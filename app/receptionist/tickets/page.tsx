'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, Calendar, RefreshCcw, User, Phone, MapPin, 
  Printer, ArrowRight, Info, CheckCircle2, Check, ChevronLeft, ChevronRight, Activity, Loader2, Clock
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { getCheckedInAppointments, issueQueueNumber, getRoomQueueStats } from './actions';
import { Suspense } from 'react';

function TicketsContent() {
  const [patients, setPatients] = useState<any[]>([]);
  const [queueList, setQueueList] = useState<any[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isIssuing, setIsIssuing] = useState(false);
  
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]); // YYYY-MM-DD
  const [filterSpecialty, setFilterSpecialty] = useState('all');
  const [filterRoom, setFilterRoom] = useState('all');
  const [filterDoctor, setFilterDoctor] = useState('all');

  // Lấy danh sách ngay khi mount hoặc thay đổi ngày
  useEffect(() => {
    fetchData();
  }, [filterDate]);

  const fetchData = async () => {
    setIsLoading(true);
    
    // Format YYYY-MM-DD to DD/MM/YYYY for DB query
    const [year, month, day] = filterDate.split('-');
    const formattedDate = `${day}/${month}/${year}`;
    
    const ptsRes = await getCheckedInAppointments(formattedDate);
    
    let targetDoctorId: number | undefined;
    
    if (ptsRes.success) {
      setPatients(ptsRes.data);
      if (ptsRes.data.length > 0 && !selectedPatientId) {
        // If there's an initial search, try to select that patient automatically
        const matched = ptsRes.data.find((p: any) => p.code === initialSearch || p.patientCode === initialSearch);
        const autoSelectedId = matched ? matched.id : ptsRes.data[0].id;
        setSelectedPatientId(autoSelectedId);
        targetDoctorId = ptsRes.data.find((p: any) => p.id === autoSelectedId)?.doctorId;
      } else if (ptsRes.data.length === 0) {
        setSelectedPatientId(null);
      } else {
        targetDoctorId = ptsRes.data.find((p: any) => p.id === selectedPatientId)?.doctorId;
      }
    }
      
    const queueRes = await getRoomQueueStats(formattedDate, targetDoctorId);
    
    if (queueRes.success) {
      setQueueList(queueRes.queueList);
    }
    setIsLoading(false);
  };

  const handleIssueNumber = async (id: number) => {
    setIsIssuing(true);
    const [year, month, day] = filterDate.split('-');
    const formattedDate = `${day}/${month}/${year}`;
    
    const res = await issueQueueNumber(id, formattedDate);
    if (res.success) {
      // Reload data
      await fetchData();
    } else {
      alert((res as any).message || 'Có lỗi xảy ra');
    }
    setIsIssuing(false);
  };

  // Lọc
  const filteredPatients = patients.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (p.code || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.patientCode || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.phone || '').includes(searchQuery);
    
    const matchSpecialty = filterSpecialty === 'all' || p.specialty === filterSpecialty;
    const matchRoom = filterRoom === 'all' || p.room === filterRoom;
    const matchDoctor = filterDoctor === 'all' || p.doctor === filterDoctor;

    return matchSearch && matchSpecialty && matchRoom && matchDoctor;
  });

  const selectedPatient = patients.find(p => p.id === selectedPatientId) || patients[0];

  // Tính stats
  const totalIssued = queueList.length;
  const lastIssued = queueList.length > 0 ? queueList[queueList.length - 1].queueNumber : 'Chưa có';
  
  let nextQueuePreview = 'A001';
  if (lastIssued !== 'Chưa có' && lastIssued) {
    const numPart = parseInt(lastIssued.replace('A', ''), 10);
    if (!isNaN(numPart)) {
      nextQueuePreview = `A${String(numPart + 1).padStart(3, '0')}`;
    }
  }

  // Lấy danh sách unique cho Dropdowns
  const specialties = Array.from(new Set(patients.map(p => p.specialty).filter(Boolean)));
  const rooms = Array.from(new Set(patients.map(p => p.room).filter(Boolean)));
  const doctors = Array.from(new Set(patients.map(p => p.doctor).filter(Boolean)));

  return (
    <div className="space-y-6 pb-10 animate-fade-in">
      
      {/* Page Header */}
      <div className="flex flex-col gap-1 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Cấp số thứ tự</h1>
        <p className="text-sm text-gray-500">Tạo và cấp số thứ tự cho bệnh nhân đã check-in</p>
      </div>

      {/* TOP FILTERS */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Ngày làm việc</label>
            <div className="relative">
              <input 
                type="date" 
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Khoa / Chuyên khoa</label>
            <select 
              value={filterSpecialty}
              onChange={(e) => setFilterSpecialty(e.target.value)}
              className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả các khoa</option>
              {specialties.map(spec => <option key={spec as string} value={spec as string}>{spec as string}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Phòng khám</label>
            <select 
              value={filterRoom}
              onChange={(e) => setFilterRoom(e.target.value)}
              className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả phòng</option>
              {rooms.map(room => <option key={room as string} value={room as string}>{room as string}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Bác sĩ</label>
            <select 
              value={filterDoctor}
              onChange={(e) => setFilterDoctor(e.target.value)}
              className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả bác sĩ</option>
              {doctors.map(doc => <option key={doc as string} value={doc as string}>{doc as string}</option>)}
            </select>
          </div>
          <div className="flex items-end">
            <button onClick={fetchData} className="w-full px-4 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
              <RefreshCcw size={16} /> Làm mới
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      ) : (
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN (8/12) */}
        <div className="xl:col-span-8 space-y-6">
          
          {/* 1. TABLE SECTION */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-800 text-lg">1. Tìm bệnh nhân đã check-in</h3>
            </div>
            
            <div className="p-5 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    placeholder="Nhập mã lịch hẹn, SĐT hoặc tên bệnh nhân..."
                  />
                </div>
                <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors whitespace-nowrap text-sm shadow-sm">
                  Tìm kiếm
                </button>
              </div>
            </div>

            <div className="overflow-x-auto min-h-[250px]">
              {filteredPatients.length === 0 ? (
                <div className="p-10 text-center text-gray-500">Không có bệnh nhân nào đang chờ cấp số.</div>
              ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-[11px] uppercase tracking-wider text-gray-500 font-bold">
                    <th className="px-4 py-3 text-center w-16">STT</th>
                    <th className="px-4 py-3">Bệnh nhân</th>
                    <th className="px-4 py-3">Mã lịch hẹn</th>
                    <th className="px-4 py-3">Giờ hẹn</th>
                    <th className="px-4 py-3">Bác sĩ</th>
                    <th className="px-4 py-3 text-center">Trạng thái check-in</th>
                    <th className="px-4 py-3 text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {filteredPatients.map((patient, idx) => (
                    <tr 
                      key={patient.id} 
                      onClick={() => setSelectedPatientId(patient.id)}
                      className={`hover:bg-blue-50/50 cursor-pointer transition-colors ${selectedPatientId === patient.id ? 'bg-blue-50/50' : 'bg-white'}`}
                    >
                      <td className="px-4 py-4 text-center">
                        {selectedPatientId === patient.id ? (
                          <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto shadow-sm">
                            <Check size={12} strokeWidth={3} />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center mx-auto">
                            <span className="text-xs text-gray-500">{idx + 1}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(patient.name)}&background=eff6ff&color=2563eb`} className="w-8 h-8 rounded-full" alt="avatar" />
                          <div>
                            <div className="font-bold text-gray-900">{patient.name}</div>
                            <div className="text-[11px] text-gray-500">{patient.yob} - {patient.gender}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 font-medium text-gray-700">{patient.code}</td>
                      <td className="px-4 py-4 font-semibold text-gray-800">{patient.time}</td>
                      <td className="px-4 py-4 text-gray-600">{patient.doctor}</td>
                      <td className="px-4 py-4 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${patient.status === 'Đã cấp số' ? 'text-blue-600 bg-blue-50 border-blue-100 border' : 'text-green-600 bg-green-50 border border-green-100'}`}>
                            {patient.status}
                          </span>
                          <span className="text-xs text-gray-500 mt-1">{patient.checkinTime}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        {patient.status === 'Đã cấp số' ? (
                           <div className="text-xs font-bold text-gray-400">Đã cấp ({patient.queueNumber})</div>
                        ) : (
                        <button onClick={(e) => { e.stopPropagation(); handleIssueNumber(patient.id); }} disabled={isIssuing} className="px-3 py-1.5 border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-medium rounded-lg text-xs transition-colors">
                          Cấp số
                        </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              )}
            </div>

            <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500 bg-white">
              <div>Hiển thị 1 - {filteredPatients.length} trong {patients.length} bệnh nhân đã check-in</div>
              <div className="flex items-center gap-1">
                <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50"><ChevronLeft size={16}/></button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-600 text-white font-medium shadow-sm">1</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50"><ChevronRight size={16}/></button>
              </div>
            </div>
          </div>

          {/* 2. DETAIL & ACTION SECTION */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h3 className="font-bold text-gray-800 text-lg">2. Thông tin cấp số</h3>
            </div>
            
            {selectedPatient ? (
              <>
                <div className="p-5 grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Thẻ 1: Thông tin BN */}
                  <div className="bg-gray-50/50 rounded-xl p-5 border border-gray-100 relative">
                    <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-4">Thông tin bệnh nhân</h4>
                    
                    <div className="flex flex-col items-center mb-5 text-center">
                      <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(selectedPatient.name)}&background=2563eb&color=fff&size=80`} className="w-20 h-20 rounded-full border-4 border-white shadow-sm mb-3" alt="avatar" />
                      <h5 className="font-bold text-lg text-gray-900">{selectedPatient.name}</h5>
                      <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                        <User size={14}/> {selectedPatient.gender}, {selectedPatient.age} tuổi ({selectedPatient.dob})
                      </div>
                    </div>

                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-3">
                        <Phone size={16} className="text-gray-400 mt-0.5 shrink-0"/>
                        <div>
                          <span className="text-xs text-gray-500 block">SĐT:</span>
                          <span className="font-medium text-gray-800">{selectedPatient.phone}</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Activity size={16} className="text-gray-400 mt-0.5 shrink-0"/>
                        <div>
                          <span className="text-xs text-gray-500 block">Mã bệnh nhân:</span>
                          <span className="font-bold text-gray-800">{selectedPatient.patientCode}</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin size={16} className="text-gray-400 mt-0.5 shrink-0"/>
                        <div>
                          <span className="text-xs text-gray-500 block">Địa chỉ:</span>
                          <span className="font-medium text-gray-800 leading-tight">{selectedPatient.address}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Thẻ 2: Thông tin lịch hẹn */}
                  <div className="bg-gray-50/50 rounded-xl p-5 border border-gray-100">
                    <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-4">Thông tin lịch hẹn</h4>
                    
                    <div className="space-y-4 text-sm">
                      <div>
                        <span className="text-xs text-gray-500 block mb-1">Mã lịch hẹn</span>
                        <span className="font-bold text-gray-900 bg-white px-2 py-1 border border-gray-200 rounded">{selectedPatient.code}</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-xs text-gray-500 block mb-1">Ngày khám</span>
                          <span className="font-medium text-gray-800">{new Date().toLocaleDateString('vi-VN')}</span>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500 block mb-1">Giờ hẹn</span>
                          <span className="font-bold text-gray-900">{selectedPatient.time}</span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-gray-200 border-dashed space-y-3">
                        <div>
                          <span className="text-xs text-gray-500 block mb-1">Bác sĩ</span>
                          <span className="font-semibold text-gray-800">{selectedPatient.doctor}</span>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500 block mb-1">Khoa/Chuyên khoa</span>
                          <span className="font-medium text-gray-800">{selectedPatient.specialty}</span>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500 block mb-1">Phòng khám</span>
                          <span className="font-bold text-[#2563eb]">{selectedPatient.room}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Thẻ 3: ACTION CẤP SỐ */}
                  <div className="bg-green-50/80 rounded-xl p-5 border border-green-200 flex flex-col justify-between">
                    <div className="text-center">
                      <h4 className="text-xs font-bold text-green-800 uppercase tracking-wider mb-2">Số thứ tự tiếp theo</h4>
                      <div className="text-6xl font-black text-green-600 tracking-tighter my-4 drop-shadow-sm">
                        {selectedPatient.status === 'Đã cấp số' ? selectedPatient.queueNumber : nextQueuePreview}
                      </div>
                      <div className="text-xs text-green-800 mb-1">Số cuối cùng đã cấp: <span className="font-bold text-green-900">{lastIssued}</span></div>
                      <div className="text-xs text-green-800">Tổng số đã cấp hôm nay: <span className="font-bold text-green-900">{totalIssued}</span></div>
                    </div>

                    <div className="mt-6 space-y-2">
                      <button onClick={() => handleIssueNumber(selectedPatient.id)} disabled={isIssuing || selectedPatient.status === 'Đã cấp số'} className={`w-full py-3.5 ${selectedPatient.status === 'Đã cấp số' ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg'} text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all text-sm`}>
                        <Printer size={18} /> {selectedPatient.status === 'Đã cấp số' ? 'Đã cấp số' : 'Cấp số & In phiếu'}
                      </button>
                      <button onClick={() => handleIssueNumber(selectedPatient.id)} disabled={isIssuing || selectedPatient.status === 'Đã cấp số'} className={`w-full py-3 bg-white border border-green-200 text-green-700 hover:bg-green-50 font-semibold rounded-xl transition-colors text-sm shadow-sm ${selectedPatient.status === 'Đã cấp số' ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        Chỉ cấp số (không in)
                      </button>
                    </div>
                  </div>

                </div>

                <div className="px-5 py-4 bg-orange-50 border-t border-orange-100 flex gap-3">
                  <Info className="text-orange-500 shrink-0 mt-0.5" size={18} />
                  <div>
                    <h5 className="text-sm font-bold text-orange-800">Lưu ý</h5>
                    <p className="text-xs text-orange-700 mt-1">Vui lòng xác nhận thông tin bệnh nhân trước khi cấp số. Số thứ tự được cấp theo thứ tự check-in hoặc thao tác của lễ tân.</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-16 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                  <User size={24} className="text-gray-400" />
                </div>
                <h4 className="text-gray-900 font-bold mb-1">Chưa có thông tin</h4>
                <p className="text-sm text-gray-500">Vui lòng chọn một bệnh nhân từ danh sách đã check-in để xem thông tin và cấp số.</p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN (4/12) */}
        <div className="xl:col-span-4 space-y-6">
          
          {/* QUEUE SIDEBAR */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-800 text-base">Hàng đợi hiện tại {selectedPatient ? `- ${selectedPatient.room}` : ''}</h3>
            </div>
            
            {/* STATS */}
            <div className="grid grid-cols-3 gap-2 p-4 border-b border-gray-100 bg-gray-50/50 text-center">
              <div className="bg-white rounded-xl p-2 border border-gray-100 shadow-sm flex flex-col items-center justify-center h-16">
                <div className="text-lg font-black text-green-600 leading-none">{queueList.filter(q => q.status === 'Đang khám').length}</div>
                <div className="text-[9px] font-bold text-gray-500 uppercase mt-1">Đang khám</div>
              </div>
              <div className="bg-white rounded-xl p-2 border border-gray-100 shadow-sm flex flex-col items-center justify-center h-16">
                <div className="text-lg font-black text-orange-500 leading-none">{queueList.filter(q => q.status === 'Đang chờ').length}</div>
                <div className="text-[9px] font-bold text-gray-500 uppercase mt-1">Đang chờ</div>
              </div>
              <div className="bg-blue-50/50 rounded-xl p-2 border border-blue-100 flex flex-col items-center justify-center h-16">
                <div className="text-lg font-black text-blue-700 leading-none">{queueList.filter(q => q.status === 'Đã khám').length}</div>
                <div className="text-[9px] font-bold text-blue-800 uppercase mt-1">Đã khám</div>
              </div>
            </div>

            {/* QUEUE LIST */}
            <div className="p-4 space-y-3 min-h-[200px] max-h-[400px] overflow-y-auto">
              {queueList.length === 0 ? (
                <div className="text-center text-gray-500 text-sm py-8">Chưa có dữ liệu hàng đợi.</div>
              ) : (
                queueList.map((item, idx) => {
                  const isKhambenh = item.status === 'Đang khám';
                  const isCho = item.status === 'Đang chờ';
                  const isXong = item.status === 'Đã khám';
                  
                  return (
                    <div key={idx} className={`flex items-center gap-3 p-3 rounded-xl border ${isKhambenh ? 'bg-green-50/50 border-green-200 shadow-sm' : isCho ? 'bg-white border-orange-100' : 'bg-gray-50/50 border-gray-100 opacity-60'}`}>
                      <div className={`w-12 h-12 font-bold text-base rounded-lg flex items-center justify-center shrink-0 ${isKhambenh ? 'bg-green-100 text-green-700' : isCho ? 'bg-orange-50 text-orange-600' : 'bg-gray-200 text-gray-600'}`}>
                        {item.queueNumber}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className={`inline-block px-1.5 py-0.5 text-[9px] font-bold rounded uppercase mb-1 ${isKhambenh ? 'bg-green-500 text-white' : isCho ? 'bg-orange-100 text-orange-700' : 'bg-gray-200 text-gray-600'}`}>
                          {item.status}
                        </span>
                        <h4 className="font-bold text-sm text-gray-900 leading-tight truncate">{item.patientName}</h4>
                        <p className="text-[10px] text-gray-500 truncate mt-0.5">{item.doctorName}</p>
                      </div>
                      <div className="text-[10px] text-gray-400 font-medium whitespace-nowrap self-start mt-1 flex items-center gap-1">
                        <Clock size={12} /> {item.time}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            
            <div className="p-3 border-t border-gray-100 flex justify-center">
              <button className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors">
                Xem tất cả hàng đợi <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* ROOM INFO */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-800 text-base">Thông tin phòng khám</h3>
            </div>
            <div className="p-5 space-y-3.5 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Phòng khám</span>
                <span className="font-semibold text-gray-900">{selectedPatient ? selectedPatient.room : 'Chưa xác định'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Bác sĩ phụ trách</span>
                <span className="font-semibold text-gray-900">{selectedPatient ? selectedPatient.doctor : 'Chưa xác định'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Khoa / Chuyên khoa</span>
                <span className="font-semibold text-gray-900">{selectedPatient ? selectedPatient.specialty : 'Chưa xác định'}</span>
              </div>
              <div className="pt-3.5 mt-3.5 border-t border-gray-100 border-dashed space-y-3.5">
                <div className="flex justify-between">
                  <span className="text-gray-500">Đã nhận số</span>
                  <span className="font-bold text-blue-600">{queueList.length}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
      )}
    </div>
  );
}

export default function TicketsPage() {
  return (
    <Suspense fallback={
      <div className="flex h-full items-center justify-center p-10">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    }>
      <TicketsContent />
    </Suspense>
  );
}
