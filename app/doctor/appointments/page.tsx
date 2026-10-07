'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  CalendarDays, MapPin, Loader2, ChevronLeft, ChevronRight, 
  Calendar, Clock, CheckCircle2, User, Users, FileText
} from 'lucide-react';
import DoctorSidebar from '@/app/doctor/Sidebar';
import { getMySchedules } from './actions';

export default function DoctorSchedulesPage() {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('month');
  const [selectedShift, setSelectedShift] = useState<any | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const res = await getMySchedules(currentDate.getFullYear(), currentDate.getMonth() + 1);
      if (res.success) {
        setSchedules(res.schedules || []);
      } else {
        setSchedules([]);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [currentDate.getMonth(), currentDate.getFullYear()]);

  const handlePrev = () => {
    const d = new Date(currentDate);
    if (viewMode === 'month') d.setMonth(d.getMonth() - 1);
    else if (viewMode === 'week') d.setDate(d.getDate() - 7);
    else d.setDate(d.getDate() - 1);
    setCurrentDate(d);
    setSelectedShift(null);
  };

  const handleNext = () => {
    const d = new Date(currentDate);
    if (viewMode === 'month') d.setMonth(d.getMonth() + 1);
    else if (viewMode === 'week') d.setDate(d.getDate() + 7);
    else d.setDate(d.getDate() + 1);
    setCurrentDate(d);
    setSelectedShift(null);
  };

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  
  const renderMonthGrid = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = new Date(year, month, 1).getDay(); // 0 is Sunday
    const startOffset = firstDay === 0 ? 6 : firstDay - 1; // Make Monday = 0
    
    const days = [];
    for (let i = 0; i < startOffset; i++) {
      days.push(<div key={`empty-${i}`} className="bg-gray-50/30 border-r border-b border-gray-100 min-h-[120px]"></div>);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const daySchedules = schedules.filter(s => s.date === dateStr);
      
      const isToday = new Date().toDateString() === new Date(year, month, i).toDateString();

      days.push(
        <div key={i} className={`border-r border-b border-gray-100 p-2 min-h-[120px] transition hover:bg-blue-50/30 ${isToday ? 'bg-blue-50/30' : ''}`}>
          <div className={`text-xs font-bold w-7 h-7 flex items-center justify-center rounded-full mb-2 ${isToday ? 'bg-[#2563EB] text-white' : 'text-gray-500'}`}>
            {i}
          </div>
          <div className="space-y-1.5">
            {daySchedules.map((shift, idx) => (
              <div 
                key={idx} 
                onClick={() => setSelectedShift(shift)}
                className={`text-[11px] p-2 rounded cursor-pointer border ${
                  selectedShift?.id === shift.id 
                    ? 'bg-blue-100 border-blue-200 text-blue-800 shadow-sm' 
                    : 'bg-white border-gray-200 hover:border-blue-300 text-gray-700'
                }`}
              >
                <div className="font-bold flex items-center gap-1"><Clock size={10} /> {shift.shiftTime}</div>
                <div className="text-gray-500 truncate mt-0.5">{shift.room}</div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    return (
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
          {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(d => (
            <div key={d} className="py-3 text-center text-xs font-bold text-gray-500 border-r border-gray-200 last:border-0">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {days}
        </div>
      </div>
    );
  };

  const renderShiftList = () => {
    let filtered = schedules;
    if (viewMode === 'day') {
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
      filtered = schedules.filter(s => s.date === dateStr);
    } else if (viewMode === 'week') {
      // Simplified week logic: just show all for the month in list for now if not day
      // In a real app, we'd filter strictly by the 7 days of the week.
    }

    if (filtered.length === 0) {
      return (
        <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-gray-200">
          <CalendarDays className="mx-auto text-gray-300 mb-4" size={48} />
          <h3 className="text-lg font-bold text-gray-900 mb-1">Không có ca khám</h3>
          <p className="text-gray-500 text-sm">Bạn không có lịch làm việc trong thời gian này.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {filtered.map(shift => (
          <div 
            key={shift.id} 
            onClick={() => setSelectedShift(shift)}
            className={`bg-white rounded-2xl p-5 border shadow-sm cursor-pointer transition ${
              selectedShift?.id === shift.id ? 'border-[#2563EB] ring-1 ring-[#2563EB]' : 'border-gray-100 hover:border-blue-200'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-black text-gray-900">{shift.shiftTime}</h3>
                <p className="text-sm font-medium text-[#2563EB] mt-1">{shift.formattedDate}</p>
              </div>
              <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                shift.status === 'Đang hoạt động' ? 'bg-green-100 text-green-700' :
                shift.status === 'Sắp diễn ra' ? 'bg-yellow-100 text-yellow-700' :
                'bg-gray-100 text-gray-600'
              }`}>
                {shift.status}
              </span>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
              <span className="flex items-center gap-1.5"><MapPin size={16} className="text-gray-400" /> Phòng: <strong className="text-gray-900">{shift.room}</strong></span>
              <span className="flex items-center gap-1.5"><FileText size={16} className="text-gray-400" /> Khoa: <strong className="text-gray-900">{shift.specialty}</strong></span>
            </div>

            <div className="flex gap-4 p-3 bg-gray-50 rounded-xl text-sm border border-gray-100">
               <div className="flex items-center gap-1"><Users size={16} className="text-gray-400"/> Tổng: <strong>{shift.stats.total}</strong></div>
               <div className="flex items-center gap-1"><CheckCircle2 size={16} className="text-green-500"/> Đã khám: <strong>{shift.stats.completed}</strong></div>
               <div className="flex items-center gap-1"><User size={16} className="text-purple-500"/> Đang khám: <strong>{shift.stats.examining}</strong></div>
               <div className="flex items-center gap-1"><Clock size={16} className="text-orange-400"/> Chờ: <strong>{shift.stats.waiting}</strong></div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] font-sans text-gray-800">
      <DoctorSidebar activePage="appointments" />

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* HEADER */}
        <header className="bg-white border-b border-gray-100 px-8 h-20 shrink-0 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-xl font-black text-gray-900">Lịch khám của Bác sĩ</h1>
            <p className="text-sm text-gray-500">Quản lý các ca khám được phân công</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button 
                onClick={() => setViewMode('day')}
                className={`px-4 py-1.5 rounded-md text-sm font-bold transition ${viewMode === 'day' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Hôm nay
              </button>
              <button 
                onClick={() => setViewMode('week')}
                className={`px-4 py-1.5 rounded-md text-sm font-bold transition ${viewMode === 'week' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Tuần
              </button>
              <button 
                onClick={() => setViewMode('month')}
                className={`px-4 py-1.5 rounded-md text-sm font-bold transition ${viewMode === 'month' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Tháng
              </button>
            </div>
            
            <div className="flex items-center bg-white border border-gray-200 rounded-lg p-1 shadow-sm ml-4">
              <button onClick={handlePrev} className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded"><ChevronLeft size={18} /></button>
              <div className="px-4 text-sm font-bold w-32 text-center uppercase">
                {viewMode === 'month' 
                  ? `Tháng ${currentDate.getMonth() + 1} / ${currentDate.getFullYear()}` 
                  : `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`}
              </div>
              <button onClick={handleNext} className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded"><ChevronRight size={18} /></button>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-hidden flex">
          {/* Main Content (Calendar / List) */}
          <div className={`flex-1 overflow-y-auto p-8 custom-scrollbar ${selectedShift ? 'w-2/3' : 'w-full'}`}>
            {isLoading ? (
              <div className="flex items-center justify-center py-20 text-[#2563EB]">
                <Loader2 className="animate-spin" size={32} />
                <span className="ml-3 font-semibold">Đang tải lịch khám...</span>
              </div>
            ) : viewMode === 'month' ? (
              renderMonthGrid()
            ) : (
              renderShiftList()
            )}
          </div>

          {/* Right Sidebar: Selected Shift Details */}
          {selectedShift && (
            <div className="w-1/3 min-w-[350px] max-w-[400px] border-l border-gray-200 bg-white flex flex-col animate-in slide-in-from-right-8">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h2 className="font-black text-gray-900">CHI TIẾT CA KHÁM</h2>
                <button onClick={() => setSelectedShift(null)} className="text-gray-400 hover:text-gray-900 bg-white rounded-full p-1 border shadow-sm">
                  <ChevronRight size={18} />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Ngày:</span>
                    <strong className="text-gray-900">{selectedShift.formattedDate}</strong>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Khung giờ:</span>
                    <strong className="text-gray-900">{selectedShift.shiftTime}</strong>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Chuyên khoa:</span>
                    <strong className="text-gray-900">{selectedShift.specialty}</strong>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Cơ sở:</span>
                    <strong className="text-gray-900">{selectedShift.facility}</strong>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Phòng khám:</span>
                    <strong className="text-gray-900">{selectedShift.room}</strong>
                  </div>
                  <div className="flex justify-between text-sm pt-3 border-t border-gray-100">
                    <span className="text-gray-500">Trạng thái:</span>
                    <span className={`font-bold flex items-center gap-1.5 ${
                      selectedShift.status === 'Đang hoạt động' ? 'text-green-600' :
                      selectedShift.status === 'Sắp diễn ra' ? 'text-yellow-600' :
                      'text-gray-500'
                    }`}>
                      {selectedShift.status === 'Đang hoạt động' && '🟢'}
                      {selectedShift.status === 'Sắp diễn ra' && '🟡'}
                      {selectedShift.status === 'Đã kết thúc' && '⚪'}
                      {selectedShift.status}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-3 uppercase text-xs tracking-wider text-gray-500">Lịch hẹn trong ca ({selectedShift.stats.total})</h3>
                  
                  {selectedShift.appointments.length === 0 ? (
                    <div className="bg-gray-50 p-4 rounded-xl text-center text-sm text-gray-500 border border-gray-100">
                      Chưa có lịch hẹn nào
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {selectedShift.appointments.map((apt: any) => (
                        <div key={apt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 text-sm">
                          <div>
                            <div className="font-bold text-[#2563EB] text-[10px]">{apt.code}</div>
                            <div className="font-bold text-gray-900">{apt.patientName}</div>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-1 rounded ${
                            apt.status === 'Đã khám' ? 'bg-green-100 text-green-700' :
                            apt.status === 'Đang khám' ? 'bg-purple-100 text-purple-700' :
                            apt.status === 'Đã check-in' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {apt.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                <Link 
                  href={`/doctor/my-appointments?date=${selectedShift.date}`} 
                  className="block w-full bg-[#2563EB] text-white text-center py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-sm"
                >
                  Xem chi tiết Lịch hẹn
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
