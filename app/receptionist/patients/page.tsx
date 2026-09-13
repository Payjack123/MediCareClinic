'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, User, Phone, MapPin, Loader2, 
  CreditCard, ShieldPlus, MoreVertical, FileText,
  Calendar, CheckCircle2, UserPlus, Clock
} from 'lucide-react';
import { getPatients, createPatientRecord } from './actions';

export default function PatientsListPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newPatientData, setNewPatientData] = useState({
    fullName: '', phone: '', email: '', cccd: '', bhyt: '', dob: '', gender: 'Nam', address: ''
  });

  useEffect(() => {
    fetchData();
  }, [statusFilter]);

  const fetchData = async () => {
    setIsLoading(true);
    const res = await getPatients(searchQuery, statusFilter);
    if (res.success) {
      setPatients(res.data);
    }
    setIsLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData();
  };

  const handleAddPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const res = await createPatientRecord(newPatientData);
    if (res.success) {
      alert('Thêm bệnh nhân thành công! Mã BN: ' + res.patientCode);
      setIsAddModalOpen(false);
      setNewPatientData({ fullName: '', phone: '', email: '', cccd: '', bhyt: '', dob: '', gender: 'Nam', address: '' });
      fetchData();
    } else {
      alert(res.message || 'Lỗi khi thêm bệnh nhân');
    }
    setIsSubmitting(false);
  };

  const getAptStatusBadge = (status: string) => {
    switch (status) {
      case 'CHỜ XÁC NHẬN':
        return <span className="inline-flex items-center gap-1.5 text-amber-600 font-medium"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Chờ xác nhận</span>;
      case 'ĐÃ XÁC NHẬN':
        return <span className="inline-flex items-center gap-1.5 text-blue-600 font-medium"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Đã xác nhận</span>;
      case 'ĐÃ CẤP SỐ':
      case 'ĐANG KHÁM':
        return <span className="inline-flex items-center gap-1.5 text-green-600 font-medium"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> {status === 'ĐANG KHÁM' ? 'Đang khám' : 'Đã cấp số'}</span>;
      case 'HOÀN THÀNH':
        return <span className="inline-flex items-center gap-1.5 text-emerald-600 font-medium"><CheckCircle2 size={14}/> Hoàn thành</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 text-gray-500 font-medium"><span className="w-2 h-2 rounded-full bg-gray-400"></span> {status}</span>;
    }
  };

  return (
    <div className="space-y-6 pb-10 animate-fade-in">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Danh sách Bệnh nhân</h1>
          <p className="text-sm text-gray-500">Quản lý hồ sơ và lịch trình khám của bệnh nhân</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2"
        >
          <UserPlus size={18}/> Thêm bệnh nhân
        </button>
      </div>

      {/* TOP FILTERS */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          <div className="md:col-span-7">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Tìm kiếm</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50"
                placeholder="Nhập tên, SĐT, Mã BN hoặc CCCD..."
              />
            </div>
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Trạng thái</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option value="ALL">Tất cả trạng thái</option>
                <option value="Hoạt động">Hoạt động</option>
                <option value="Chờ xác minh">Chờ xác minh</option>
                <option value="Đang điều trị">Đang điều trị</option>
              </select>
            </div>
          </div>

          <div className="md:col-span-2 flex items-end">
            <button type="submit" className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors shadow-sm h-[42px] flex items-center justify-center gap-2">
              <Search size={16} /> Tìm
            </button>
          </div>
        </form>
      </div>

      {/* LIST SECTION */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 relative min-h-[400px]">
        
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex items-center justify-center rounded-2xl">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        )}

        {!isLoading && patients.length === 0 ? (
           <div className="p-20 text-center flex flex-col items-center justify-center">
             <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
               <User className="w-8 h-8 text-blue-400" />
             </div>
             <h3 className="text-gray-900 font-bold mb-1">Không tìm thấy bệnh nhân</h3>
             <p className="text-gray-500 text-sm">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc.</p>
           </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {patients.map((p) => (
              <div key={p.id} className="p-6 hover:bg-blue-50/30 transition-colors flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
                
                {/* Info Column */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center flex-wrap gap-2 text-sm mb-3">
                    <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{p.patientCode}</span>
                    <span className="text-gray-300 hidden sm:inline">|</span>
                    <span className="font-black text-gray-900 text-lg">{p.name}</span>
                    <span className="text-gray-300 hidden sm:inline">|</span>
                    <span className="text-gray-600">{p.age} tuổi</span>
                    <span className="text-gray-300 hidden sm:inline">|</span>
                    <span className="font-semibold text-gray-800 flex items-center gap-1"><Phone size={14} className="text-gray-400"/> {p.phone}</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50/80 p-4 rounded-xl border border-gray-100/50">
                    {/* Hành chính */}
                    <div className="space-y-2">
                      <div className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">Hành chính</div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <CreditCard size={14} className="text-gray-400"/> CCCD: <span className="font-medium text-gray-900">{p.cccd}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <ShieldPlus size={14} className="text-green-500"/> BHYT: <span className="font-medium text-gray-900">{p.bhyt}</span>
                      </div>
                    </div>

                    {/* Lịch hẹn gần nhất */}
                    <div className="space-y-2">
                      <div className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">Lịch hẹn gần nhất</div>
                      {p.latestAppointment ? (
                        <>
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <Calendar size={14} className="text-gray-400"/> 
                            <span className="font-bold text-gray-900">{p.latestAppointment.date} - {p.latestAppointment.time}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <User size={14} className="text-gray-400"/> 
                            {p.latestAppointment.doctorName} <span className="text-gray-400">({p.latestAppointment.specialty})</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm mt-1.5">
                            <span className="text-gray-500">Trạng thái:</span>
                            {getAptStatusBadge(p.latestAppointment.status)}
                          </div>
                        </>
                      ) : (
                        <div className="text-sm text-gray-500 italic mt-2">Không có lịch hẹn sắp tới</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 shrink-0 w-full lg:w-auto">
                  <button className="flex-1 lg:flex-none px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium rounded-lg text-sm transition-colors flex items-center justify-center gap-2">
                    <FileText size={16} /> Xem hồ sơ
                  </button>
                  
                  <button className="flex-1 lg:flex-none px-4 py-2 bg-blue-50 border border-blue-100 text-blue-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 font-medium rounded-lg text-sm transition-colors flex items-center justify-center gap-2">
                    <Calendar size={16} /> Lịch hẹn
                  </button>
                  
                  {/* Nút Check-in hiển thị nếu đang chờ xác nhận */}
                  {p.latestAppointment?.status === 'CHỜ XÁC NHẬN' && (
                    <button className="flex-1 lg:flex-none px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg text-sm transition-colors flex items-center justify-center gap-2 shadow-sm">
                      <Clock size={16} /> Check-in
                    </button>
                  )}

                  <button className="px-3 py-2 bg-white border border-gray-200 text-gray-400 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-center">
                    <MoreVertical size={16} />
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Patient Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <UserPlus className="text-blue-600" /> Thêm mới Hồ sơ Bệnh nhân
              </h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                ✕
              </button>
            </div>
            
            <form onSubmit={handleAddPatient} className="flex-1 overflow-y-auto p-6 space-y-5">
              <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl mb-4">
                <p className="text-sm text-blue-800 font-medium">Lưu ý: Bạn phải điền đúng SĐT/Email để khách vãng lai có thể lấy mã OTP đồng bộ hồ sơ sau này.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên <span className="text-red-500">*</span></label>
                  <input required type="text" value={newPatientData.fullName} onChange={e => setNewPatientData({...newPatientData, fullName: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Nguyễn Văn A" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại <span className="text-red-500">*</span></label>
                  <input required type="tel" value={newPatientData.phone} onChange={e => setNewPatientData({...newPatientData, phone: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0901234567" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                  <input required type="email" value={newPatientData.email} onChange={e => setNewPatientData({...newPatientData, email: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="email@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giới tính</label>
                  <select value={newPatientData.gender} onChange={e => setNewPatientData({...newPatientData, gender: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh (YYYY-MM-DD)</label>
                  <input type="text" value={newPatientData.dob} onChange={e => setNewPatientData({...newPatientData, dob: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="1990-01-01" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số CCCD</label>
                  <input type="text" value={newPatientData.cccd} onChange={e => setNewPatientData({...newPatientData, cccd: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0123456789" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số BHYT</label>
                  <input type="text" value={newPatientData.bhyt} onChange={e => setNewPatientData({...newPatientData, bhyt: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="GD123456789" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                  <input type="text" value={newPatientData.address} onChange={e => setNewPatientData({...newPatientData, address: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Số nhà, Tên đường, Quận, Thành phố" />
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-5 py-2.5 text-gray-700 font-medium rounded-xl hover:bg-gray-100 transition-colors">
                  Hủy bỏ
                </button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-sm transition-colors flex items-center gap-2">
                  {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : 'Lưu hồ sơ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
