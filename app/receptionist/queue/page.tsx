'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, Calendar, RefreshCcw, User, Phone, MapPin, 
  CheckCircle2, Clock, Volume2, RotateCcw, XSquare, Printer, Settings, ChevronLeft, ChevronRight, Activity, ChevronDown, Loader2
} from 'lucide-react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import { getQueueList, callPatient, callNextPatient, updateQueueStatus, transferTurn, getFilterMetadata } from './actions';

export default function QueuePage() {
  const [activeTab, setActiveTab] = useState('Đang chờ');
  const [queue, setQueue] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);

  // Filters
  const [filterSpecialty, setFilterSpecialty] = useState('all');
  const [filterRoom, setFilterRoom] = useState('all');
  const [filterDoctor, setFilterDoctor] = useState('all');

  const [filterData, setFilterData] = useState({ specialties: [] as string[], rooms: [] as string[], doctors: [] as string[] });

  useEffect(() => {
    fetchData();
  }, [filterDate]);

  useEffect(() => {
    const loadFilterData = async () => {
      const res = await getFilterMetadata();
      if (res.success && res.data) {
        setFilterData(res.data);
      }
    };
    loadFilterData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    const [year, month, day] = filterDate.split('-');
    const formattedDate = `${day}/${month}/${year}`;
    
    const res = await getQueueList(formattedDate);
    if (res.success) {
      setQueue(res.data);
    }
    setIsLoading(false);
  };

  const handleCallPatient = async (id: number) => {
    setIsActionLoading(true);
    await callPatient(id);
    await fetchData();
    setIsActionLoading(false);
  };

  const handleCallNext = async () => {
    setIsActionLoading(true);
    const [year, month, day] = filterDate.split('-');
    const formattedDate = `${day}/${month}/${year}`;
    const res = await callNextPatient(formattedDate);
    if (!res.success) {
      alert(res.message);
    }
    await fetchData();
    setIsActionLoading(false);
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    setIsActionLoading(true);
    await updateQueueStatus(id, status);
    await fetchData();
    setIsActionLoading(false);
  };

  const handleTransfer = async (id: number) => {
    setIsActionLoading(true);
    const [year, month, day] = filterDate.split('-');
    const formattedDate = `${day}/${month}/${year}`;
    const res = await transferTurn(id, formattedDate);
    if (!res.success) alert(res.message);
    await fetchData();
    setIsActionLoading(false);
  };

  // Tính toán Tabs & Lọc
  const filteredQueue = queue.filter(p => {
    const matchSpecialty = filterSpecialty === 'all' || p.specialty === filterSpecialty;
    const matchRoom = filterRoom === 'all' || p.room === filterRoom;
    const matchDoctor = filterDoctor === 'all' || p.doctor === filterDoctor;
    return matchSpecialty && matchRoom && matchDoctor;
  });

  const waitingPatients = filteredQueue.filter(p => p.status === 'Đang chờ');
  const examiningPatients = filteredQueue.filter(p => p.status === 'Đang khám');
  const finishedPatients = filteredQueue.filter(p => p.status === 'Đã khám');
  const skippedPatients = filteredQueue.filter(p => p.status === 'Bỏ lượt');

  // No longer using single activePatient
  let currentTabPatients: any[] = [];
  if (activeTab === 'Đang chờ') currentTabPatients = waitingPatients;
  else if (activeTab === 'Đã khám') currentTabPatients = finishedPatients;
  else if (activeTab === 'Bỏ lượt') currentTabPatients = skippedPatients;

  // Dropdown lists
  const { specialties, rooms, doctors } = filterData;

  // TỔNG QUAN STATS
  const totalToday = queue.length;
  const countFinished = queue.filter(p => p.status === 'Đã khám').length;
  const countWaiting = queue.filter(p => p.status === 'Đang chờ').length;
  const countExamining = queue.filter(p => p.status === 'Đang khám').length;
  const countSkipped = queue.filter(p => p.status === 'Bỏ lượt').length;

  return (
    <div className="space-y-6 pb-10 animate-fade-in">
      
      {/* Page Header */}
      <div className="flex flex-col gap-1 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Hàng đợi khám</h1>
        <p className="text-sm text-gray-500">Quản lý hàng đợi và trạng thái khám bệnh</p>
      </div>

      {/* TOP FILTERS */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-end gap-4">
          <div className="w-48">
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Ngày làm việc</label>
            <div className="relative">
              <DatePicker
                selected={filterDate ? new Date(filterDate) : null}
                onChange={(date: Date | null) => {
                  if (date) {
                    setFilterDate(dayjs(date).format('YYYY-MM-DD'));
                  }
                }}
                dateFormat="dd/MM/yyyy"
                className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholderText="Ngày làm việc"
              />
            </div>
          </div>
          <div className="flex-1 grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Khoa / Chuyên khoa</label>
              <select value={filterSpecialty} onChange={e => setFilterSpecialty(e.target.value)} className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="all">Tất cả các khoa</option>
                {specialties.map(s => <option key={s as string} value={s as string}>{s as string}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Phòng khám</label>
              <select value={filterRoom} onChange={e => setFilterRoom(e.target.value)} className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="all">Tất cả phòng</option>
                {rooms.map(r => <option key={r as string} value={r as string}>{r as string}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Bác sĩ</label>
              <select value={filterDoctor} onChange={e => setFilterDoctor(e.target.value)} className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="all">Tất cả bác sĩ</option>
                {doctors.map(d => <option key={d as string} value={d as string}>{d as string}</option>)}
              </select>
            </div>
          </div>
          <div className="w-32">
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
        
        {/* LEFT COLUMN (9/12) */}
        <div className="xl:col-span-9 space-y-6">
          
          {/* ACTIVE PATIENTS LIST */}
          {examiningPatients.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {examiningPatients.map(patient => (
                <div key={patient.id} className="bg-white rounded-2xl shadow-sm border border-green-100 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-white/20 pointer-events-none"></div>
                  <div className="p-5 relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="text-[10px] font-bold text-green-600 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> ĐANG KHÁM
                        </div>
                        <div className="text-3xl font-black text-green-600 tracking-tighter leading-none">{patient.queueNumber}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-800 text-sm">{patient.room}</div>
                        <div className="text-xs text-gray-500">{patient.doctor}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 mb-4">
                      <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(patient.name)}&background=16a34a&color=fff`} className="w-10 h-10 rounded-full" alt="avatar" />
                      <div>
                        <h3 className="text-sm font-bold text-gray-900">{patient.name}</h3>
                        <div className="text-xs text-gray-500">{patient.gender} - {patient.age} tuổi • {patient.phone}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-4 border-t border-gray-100/50">
                      <button onClick={() => handleUpdateStatus(patient.id, 'HOÀN THÀNH')} disabled={isActionLoading} className="flex-1 py-1.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors">
                        <CheckCircle2 size={14}/> Kết thúc
                      </button>
                      <button onClick={() => handleUpdateStatus(patient.id, 'ĐÃ HỦY')} disabled={isActionLoading} className="flex-1 py-1.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 font-medium rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors">
                        <XSquare size={14}/> Hủy khám
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
              <Activity size={24} className="text-gray-400" />
            </div>
            <h4 className="text-gray-900 font-bold mb-1">Chưa có bệnh nhân đang khám</h4>
            <p className="text-sm text-gray-500">Hãy gọi bệnh nhân tiếp theo từ hàng đợi để bắt đầu.</p>
            <button onClick={handleCallNext} disabled={isActionLoading || waitingPatients.length === 0} className="mt-4 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-medium rounded-xl transition-colors shadow-sm inline-flex items-center gap-2">
              <Volume2 size={18} /> Gọi bệnh nhân đầu tiên
            </button>
          </div>
          )}

          {/* QUEUE TABS & TABLE */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            
            {/* Tabs */}
            <div className="flex border-b border-gray-100 px-2 pt-2">
              {[`Đang chờ (${waitingPatients.length})`, `Đã khám (${finishedPatients.length})`, `Bỏ lượt (${skippedPatients.length})`].map(tab => {
                const tabName = tab.split(' (')[0];
                const isActive = activeTab === tabName;
                return (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tabName)}
                    className={`px-6 py-3.5 text-sm font-medium border-b-2 transition-colors ${isActive ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
                  >
                    {tab}
                  </button>
                )
              })}
            </div>

            {/* Table */}
            <div className="overflow-x-auto min-h-[300px]">
              {currentTabPatients.length === 0 ? (
                <div className="p-10 text-center text-gray-500">Danh sách trống.</div>
              ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-[11px] uppercase tracking-wider text-gray-500 font-bold bg-white">
                    <th className="px-5 py-4 text-center w-16">STT</th>
                    <th className="px-5 py-4">Số thứ tự</th>
                    <th className="px-5 py-4">Bệnh nhân</th>
                    <th className="px-5 py-4 text-center">Giờ hẹn</th>
                    <th className="px-5 py-4 text-center">Check-in</th>
                    <th className="px-5 py-4 text-center">Thời gian chờ</th>
                    <th className="px-5 py-4 text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {currentTabPatients.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-4 text-center font-medium text-gray-500">{idx + 1}</td>
                      <td className="px-5 py-4 font-black text-orange-500 text-base">{item.queueNumber}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=f3f4f6&color=4b5563`} className="w-8 h-8 rounded-full" alt="avatar" />
                          <div>
                            <div className="font-bold text-gray-900">{item.name}</div>
                            <div className="text-[11px] text-gray-500">{item.gender} - {item.age} tuổi &nbsp; • &nbsp; <Phone size={10} className="inline"/> {item.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-center font-semibold text-gray-900">{item.appointmentTime}</td>
                      <td className="px-5 py-4 text-center text-gray-500">{item.checkInTime}</td>
                      <td className="px-5 py-4 text-center font-bold text-orange-600">{item.waitTime}</td>
                      <td className="px-5 py-4 text-center">
                        {item.status === 'Đang chờ' && (
                          <div className="flex items-center justify-center gap-1">
                            <button onClick={() => handleCallPatient(item.id)} disabled={isActionLoading} className="px-3 py-1.5 border border-blue-200 text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white font-medium rounded-lg text-xs transition-colors flex items-center gap-1.5">
                              <Volume2 size={14}/> Gọi số
                            </button>
                            <button onClick={() => handleUpdateStatus(item.id, 'BỎ LƯỢT')} title="Bỏ lượt" disabled={isActionLoading} className="w-8 h-[28px] border border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg flex items-center justify-center transition-colors">
                              <XSquare size={14}/>
                            </button>
                          </div>
                        )}
                        {item.status === 'Bỏ lượt' && (
                           <button onClick={() => handleCallPatient(item.id)} disabled={isActionLoading} className="px-3 py-1.5 border border-orange-200 text-orange-600 bg-orange-50 hover:bg-orange-500 hover:text-white font-medium rounded-lg text-xs transition-colors flex items-center gap-1.5">
                             <RotateCcw size={14}/> Gọi lại
                           </button>
                        )}
                        {item.status === 'Đã khám' && (
                          <span className="text-xs font-bold text-green-600">Hoàn thành</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              )}
            </div>
          </div>

          {/* BOTTOM QUICK ACTIONS */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">Thao tác nhanh</h3>
              <button className="text-xs text-blue-600 font-medium flex items-center gap-1 hover:underline"><Settings size={14}/> Cài đặt hiển thị</button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
              <button onClick={handleCallNext} disabled={isActionLoading || waitingPatients.length === 0} className="flex items-center gap-3 p-3 rounded-xl border border-blue-100 bg-blue-50 hover:bg-blue-100 transition-colors text-left group">
                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-blue-600 shadow-sm group-hover:scale-110 transition-transform"><Volume2 size={20}/></div>
                <div>
                  <div className="text-sm font-bold text-blue-900">Gọi số tiếp theo</div>
                  <div className="text-[10px] text-blue-600/70">Gọi bệnh nhân tiếp theo trong hàng đợi</div>
                </div>
              </button>
              
              <button disabled={skippedPatients.length === 0 || isActionLoading} onClick={() => skippedPatients.length > 0 && handleCallPatient(skippedPatients[0].id)} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors text-left group">
                <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform"><RotateCcw size={20}/></div>
                <div>
                  <div className="text-sm font-bold text-gray-800">Gọi lại số</div>
                  <div className="text-[10px] text-gray-500">Gọi lại bệnh nhân bỏ lượt</div>
                </div>
              </button>

              <button disabled={waitingPatients.length === 0 || isActionLoading} onClick={() => {
                const targetId = waitingPatients[0]?.id;
                if (targetId) handleTransfer(targetId);
              }} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors text-left group">
                <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform"><RefreshCcw size={20}/></div>
                <div>
                  <div className="text-sm font-bold text-gray-800">Chuyển lượt</div>
                  <div className="text-[10px] text-gray-500">Chuyển bệnh nhân tiếp theo xuống cuối</div>
                </div>
              </button>

              <button disabled={waitingPatients.length === 0 || isActionLoading} onClick={() => {
                const targetId = waitingPatients[0]?.id;
                if (targetId) handleUpdateStatus(targetId, 'BỎ LƯỢT');
              }} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors text-left group">
                <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform"><XSquare size={20}/></div>
                <div>
                  <div className="text-sm font-bold text-gray-800">Bỏ lượt</div>
                  <div className="text-[10px] text-gray-500">Bỏ lượt bệnh nhân tiếp theo</div>
                </div>
              </button>

              <button className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors text-left group">
                <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform"><Printer size={20}/></div>
                <div>
                  <div className="text-sm font-bold text-gray-800">In danh sách</div>
                  <div className="text-[10px] text-gray-500">In danh sách hàng đợi</div>
                </div>
              </button>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN (3/12) */}
        <div className="xl:col-span-3 space-y-6">
          
          {/* OVERVIEW STATS */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-4">Tổng quan hàng đợi</h3>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100 text-center flex flex-col justify-center h-24">
                <div className="text-3xl font-black text-blue-600 leading-none mb-1">{totalToday}</div>
                <div className="text-[11px] font-medium text-blue-800">Tổng số hôm nay</div>
              </div>
              <div className="bg-green-50/50 rounded-xl p-4 border border-green-100 text-center flex flex-col justify-center h-24">
                <div className="text-3xl font-black text-green-600 leading-none mb-1">{countFinished}</div>
                <div className="text-[11px] font-medium text-green-800">Đã khám</div>
              </div>
              <div className="bg-orange-50/50 rounded-xl p-4 border border-orange-100 text-center flex flex-col justify-center h-24">
                <div className="text-3xl font-black text-orange-500 leading-none mb-1">{countWaiting}</div>
                <div className="text-[11px] font-medium text-orange-800">Đang chờ</div>
              </div>
              <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-100 text-center flex flex-col justify-center h-24">
                <div className="text-3xl font-black text-blue-500 leading-none mb-1">{0}</div>
                <div className="text-[11px] font-medium text-gray-600">Chưa gọi</div>
              </div>
              <div className="bg-emerald-50/50 rounded-xl p-4 border border-emerald-100 text-center flex flex-col justify-center h-24">
                <div className="text-3xl font-black text-emerald-600 leading-none mb-1">{countExamining}</div>
                <div className="text-[11px] font-medium text-emerald-800">Đang khám</div>
              </div>
              <div className="bg-red-50/50 rounded-xl p-4 border border-red-100 text-center flex flex-col justify-center h-24">
                <div className="text-3xl font-black text-red-500 leading-none mb-1">{countSkipped}</div>
                <div className="text-[11px] font-medium text-red-800">Bỏ lượt</div>
              </div>
            </div>
          </div>

          {/* AVERAGE WAIT TIME */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
              <Clock size={24} className="text-gray-400" />
            </div>
            <div>
              <div className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">Thời gian chờ trung bình</div>
              <div className="text-2xl font-black text-gray-900 leading-none">
                {waitingPatients.length > 0 ? '15 phút' : '0 phút'}
              </div>
              <div className="text-[10px] text-gray-500 mt-1">Tính đến hiện tại</div>
            </div>
          </div>

          {/* RECENT CALLED */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">Lịch sử gọi số gần đây</h3>
              <button className="text-[11px] text-blue-600 font-medium hover:underline">Xem tất cả</button>
            </div>
            
            <div className="divide-y divide-gray-50">
              {queue.filter(p => ['Đang khám', 'Đã khám'].includes(p.status)).slice(0, 5).map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3.5 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="font-black text-gray-800 w-10">{item.queueNumber}</div>
                    <div className="text-sm font-medium text-gray-700">{item.name}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`text-[10px] font-bold px-2 py-0.5 rounded ${item.status === 'Đang khám' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-gray-50 text-gray-500 border border-gray-200'}`}>
                      {item.status}
                    </div>
                  </div>
                </div>
              ))}
              {queue.filter(p => ['Đang khám', 'Đã khám'].includes(p.status)).length === 0 && (
                <div className="p-4 text-center text-sm text-gray-500">Chưa có lịch sử.</div>
              )}
            </div>
          </div>

        </div>
      </div>
      )}
    </div>
  );
}
