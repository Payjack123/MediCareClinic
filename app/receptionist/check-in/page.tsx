'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, Calendar, Phone, Fingerprint, Activity, Users,
  Stethoscope, MapPin, Check, Info, CheckCircle2, Ticket,
  Printer, ArrowRight, RotateCw, Clock, User, Loader2
} from 'lucide-react';
import Link from 'next/link';
import { searchAppointment, confirmCheckIn, getQueueAndHistory } from './actions';

export default function CheckInPage() {
  const [searchType, setSearchType] = useState('Mã lịch hẹn');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [appointments, setAppointments] = useState<any[]>([]);
  const [selectedAppId, setSelectedAppId] = useState<number | null>(null);
  const appointment = appointments.find(a => a.id === selectedAppId);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [queueNumber, setQueueNumber] = useState<string | null>(null);
  
  const [queue, setQueue] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [isQueueLoading, setIsQueueLoading] = useState(true);

  // Load queue on mount
  useEffect(() => {
    loadSidebarData();
  }, []);

  const loadSidebarData = async () => {
    setIsQueueLoading(true);
    const res = await getQueueAndHistory();
    if (res.success && res.data) {
      setQueue(res.data.queue);
      setHistory(res.data.history);
    }
    setIsQueueLoading(false);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError('Vui lòng nhập thông tin tìm kiếm.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setSuccessMsg('');
    setAppointments([]);
    setSelectedAppId(null);

    const res = await searchAppointment(searchQuery, searchType);
    
    if (res.success && res.data && res.data.length > 0) {
      setAppointments(res.data);
      setSelectedAppId(res.data[0].id);
    } else {
      setError(res.error || 'Có lỗi xảy ra.');
    }
    
    setIsLoading(false);
  };

  const handleCheckIn = async () => {
    if (!appointment) return;
    
    setIsCheckingIn(true);
    setError('');
    
    const res = await confirmCheckIn(appointment.id);
    
    if (res.success) {
      setSuccessMsg('Check-in thành công!');
      // Update local state to reflect change
      setAppointments(appointments.map(a => a.id === appointment.id ? { ...a, status: 'ĐÃ XÁC NHẬN' } : a));
      // Reload sidebar
      await loadSidebarData();
    } else {
      setError(res.error || 'Có lỗi xảy ra khi check-in.');
    }
    
    setIsCheckingIn(false);
  };

  return (
    <div className="space-y-6 pb-10">
      
      {/* Page Header */}
      <div className="flex flex-col gap-1 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Check-in bệnh nhân</h1>
        <p className="text-sm text-gray-500">Tìm kiếm và check-in bệnh nhân đến khám</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN (approx 8/12) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* 1. TÌM LỊCH HẸN */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-blue-50 border-b border-blue-100 p-4">
              <h3 className="font-bold text-blue-900 text-lg flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm">1</span>
                TÌM LỊCH HẸN
              </h3>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        setQueueNumber(null);
                        handleSearch();
                      }
                    }}
                    className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Mã lịch / SĐT / Mã BN..."
                  />
                </div>
                <button 
                  onClick={() => {
                    setQueueNumber(null);
                    handleSearch();
                  }}
                  disabled={isLoading}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors whitespace-nowrap disabled:bg-blue-400 flex items-center gap-2"
                >
                  {isLoading && <Loader2 size={16} className="animate-spin" />}
                  Tìm kiếm
                </button>
              </div>
              
              {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
              {successMsg && <p className="text-green-600 text-sm mt-3 font-medium">{successMsg}</p>}
            </div>
          </div>

          {/* Selector for multiple appointments if needed */}
          {appointments.length > 1 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-fade-in">
              <p className="text-sm text-blue-800 font-medium mb-3">Tìm thấy {appointments.length} lịch hẹn. Vui lòng chọn lịch hẹn cần thao tác:</p>
              <div className="flex flex-wrap gap-3">
                {appointments.map(a => (
                  <button
                    key={a.id}
                    onClick={() => {
                      setSelectedAppId(a.id);
                      setQueueNumber(null);
                    }}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors border ${
                      selectedAppId === a.id
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex flex-col items-start">
                      <span>{a.bookingDate} {a.bookingTime}</span>
                      <span className="text-xs opacity-80 font-normal">{a.specialty}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 2. THÔNG TIN BỆNH NHÂN */}
          {appointment && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
              <div className="bg-gray-50 border-b border-gray-100 p-4">
                <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-sm">2</span>
                  THÔNG TIN BỆNH NHÂN
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Cột 1: Thông tin bệnh nhân */}
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center text-blue-600 font-bold text-xl border-2 border-white shadow-sm overflow-hidden">
                      <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(appointment.patientName)}&background=eff6ff&color=2563eb`} alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xl text-gray-800 mb-1">{appointment.patientName}</h4>
                      <div className="text-sm text-gray-600 flex items-center gap-2">
                        <span className="font-medium text-blue-600">{appointment.patientCode}</span>
                        <span className="text-gray-300">|</span>
                        <span>{appointment.phone}</span>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">SĐT: {appointment.phone}</div>
                    </div>
                  </div>

                  {/* Cột 2: Thông tin khám */}
                  <div className="border-l border-gray-100 pl-6 space-y-3">
                    <div className="flex items-center gap-2">
                      <Stethoscope size={16} className="text-gray-400" />
                      <span className="font-medium text-gray-800">{appointment.doctorName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-600">{appointment.specialty}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-800 font-medium">Ngày: {appointment.bookingDate}</span>
                      <span className="text-gray-300 mx-1">|</span>
                      <Clock size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-800 font-medium">Khung: {appointment.bookingTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. XÁC NHẬN CHECK-IN */}
          {appointment && !queueNumber && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
              <div className="bg-orange-50 border-b border-orange-100 p-4">
                <h3 className="font-bold text-orange-800 text-lg flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-orange-200 text-orange-800 flex items-center justify-center text-sm">3</span>
                  XÁC NHẬN CHECK-IN
                </h3>
              </div>
              <div className="p-6">
                <div className="flex flex-col items-center justify-center space-y-6 py-4">
                  {appointment.status === 'CHỜ XÁC NHẬN' ? (
                    <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-full border border-green-200">
                      <CheckCircle2 size={20} />
                      <span className="font-bold">Lịch hẹn hợp lệ</span>
                    </div>
                  ) : appointment.status === 'ĐÃ XÁC NHẬN' ? (
                    <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-4 py-2 rounded-full border border-blue-200">
                      <Info size={20} />
                      <span className="font-bold">Lịch hẹn đã check-in</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-full border border-red-200">
                      <Info size={20} />
                      <span className="font-bold">Trạng thái không hợp lệ: {appointment.status}</span>
                    </div>
                  )}

                  <button 
                    onClick={handleCheckIn}
                    disabled={isCheckingIn || appointment.status !== 'CHỜ XÁC NHẬN'}
                    className={`flex items-center justify-center gap-2 px-12 py-4 text-white font-bold rounded-xl text-lg transition-all transform hover:scale-105 active:scale-95 shadow-lg ${
                      appointment.status !== 'CHỜ XÁC NHẬN' 
                        ? 'bg-gray-400 cursor-not-allowed shadow-none hover:scale-100' 
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-200'
                    }`}
                  >
                    {isCheckingIn ? <Loader2 size={24} className="animate-spin" /> : <Check size={24} />}
                    {appointment.status !== 'CHỜ XÁC NHẬN' ? 'ĐÃ CHECK-IN' : 'XÁC NHẬN CHECK-IN'}
                  </button>
                  
                  {appointment.status === 'ĐÃ XÁC NHẬN' && (
                    <Link 
                      href={`/receptionist/tickets?search=${encodeURIComponent(appointment.appointmentCode || appointment.patientCode)}`}
                      className="flex items-center justify-center gap-2 px-8 py-3 bg-white border-2 border-green-600 text-green-700 hover:bg-green-50 font-bold rounded-xl transition-colors shadow-sm animate-fade-in"
                    >
                      👉 Chuyển sang Cấp số & In phiếu
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Removed KẾT QUẢ section */}

        </div>

        {/* RIGHT COLUMN (approx 4/12) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Hàng đợi hiện tại */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-800">Hàng đợi hiện tại</h3>
              <button onClick={loadSidebarData} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                <RotateCw size={16} className={isQueueLoading ? 'animate-spin' : ''} />
              </button>
            </div>
            
            <div className="p-4 flex flex-col gap-3 min-h-[200px]">
              {isQueueLoading ? (
                <div className="flex justify-center items-center h-32"><Loader2 size={24} className="animate-spin text-blue-500" /></div>
              ) : queue.length === 0 ? (
                <div className="text-center text-gray-500 text-sm py-8">Chưa có bệnh nhân trong hàng đợi hôm nay.</div>
              ) : (
                queue.map((item, idx) => (
                  <div key={idx} className={`flex items-center gap-4 p-3 rounded-xl border ${item.status === 'ĐANG KHÁM' ? 'bg-green-50/50 border-green-100' : 'bg-orange-50/30 border-orange-100'}`}>
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-sm ${item.status === 'ĐANG KHÁM' ? 'bg-green-50 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                      {item.code}
                    </div>
                    <div className="flex-1">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold mb-1 ${item.status === 'ĐANG KHÁM' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                        {item.status}
                      </span>
                      <h4 className="font-bold text-gray-800 text-sm">{item.patientName}</h4>
                    </div>
                    <div className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock size={12} /> {item.time}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-3 border-t border-gray-100 bg-gray-50/50 flex justify-center">
              <Link href="/receptionist/queue" className="text-sm text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1">
                Xem tất cả hàng đợi <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Lịch sử check-in gần đây */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-800">Lịch sử check-in hôm nay</h3>
            </div>
            
            <div className="divide-y divide-gray-100 min-h-[200px]">
              {isQueueLoading ? (
                <div className="flex justify-center items-center h-32"><Loader2 size={24} className="animate-spin text-blue-500" /></div>
              ) : history.length === 0 ? (
                <div className="text-center text-gray-500 text-sm py-8">Chưa có lịch sử check-in nào.</div>
              ) : (
                history.map((item, idx) => (
                  <div key={idx} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="text-gray-500 font-bold text-sm w-10">{item.code}</div>
                      <div>
                        <h4 className="font-bold text-gray-800 text-sm">{item.patientName}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">{item.date}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs text-gray-500">{item.time}</span>
                      <span className="px-2 py-0.5 bg-green-50 text-green-600 rounded text-[10px] font-semibold border border-green-100">Đã check-in</span>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="p-3 border-t border-gray-100 bg-gray-50/50 flex justify-center">
              <Link href="/receptionist/reports" className="text-sm text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1">
                Xem tất cả <ArrowRight size={14} />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
