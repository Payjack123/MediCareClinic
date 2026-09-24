'use client';

import React, { useState, useEffect } from 'react';
import { CalendarDays, Clock, MapPin, Loader2, ArrowRight } from 'lucide-react';
import DoctorSidebar from '@/app/doctor/Sidebar';
import { getMySchedules } from './actions';

export default function DoctorSchedulesPage() {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Giả lập lấy userId của user hiện tại (ví dụ Nguyễn Văn Bình)
    // Trong thực tế sẽ lấy từ Session/AuthContext
    const userId = 30001; 

    const fetchData = async () => {
      const res = await getMySchedules(userId);
      if (res.success) {
        setSchedules(res.schedules);
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] font-sans text-gray-800">
      <DoctorSidebar activePage="schedule" />

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* HEADER */}
        <header className="bg-white border-b border-gray-100 px-8 h-20 shrink-0 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Quản lý Lịch Trực</h1>
            <p className="text-sm text-gray-500">Lịch làm việc của bạn trong tháng</p>
          </div>
          <div className="flex items-center gap-4">
             {/* Header icons can go here */}
          </div>
        </header>

        <div className="flex-1 overflow-auto p-8 animate-in fade-in duration-500">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-3xl font-black text-gray-900 mb-2">Ca làm (Khung giờ khám)</h2>
                <p className="text-gray-500">Danh sách các khung giờ bạn có lịch khám chữa bệnh.</p>
              </div>
            </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-[#2563EB]">
            <Loader2 className="animate-spin" size={32} />
            <span className="ml-3 font-semibold">Đang tải lịch trực...</span>
          </div>
        ) : schedules.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-gray-200">
            <CalendarDays className="mx-auto text-gray-300 mb-4" size={48} />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Bạn chưa có lịch trực nào</h3>
            <p className="text-gray-500">Vui lòng liên hệ Quản trị viên để được xếp lịch làm việc.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schedules.map((schedule) => {
              const dateObj = new Date(schedule.date);
              const dayOfWeek = dateObj.getDay();
              const displayDay = dayOfWeek === 0 ? 'Chủ nhật' : `Thứ ${dayOfWeek + 1}`;
              
              return (
                <div key={schedule.id} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start border-b border-gray-50 pb-4 mb-4">
                    <div>
                      <p className="text-sm font-bold text-[#2563EB] mb-1">{displayDay}</p>
                      <h2 className="text-2xl font-black text-gray-900">{schedule.date.split('-').reverse().join('/')}</h2>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
                      <CalendarDays size={24} />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {schedule.clinic && (
                      <div className="flex gap-3 text-sm text-gray-600">
                        <MapPin size={18} className="text-gray-400 shrink-0" />
                        <span>
                          <strong className="text-gray-900">{schedule.clinic.name}</strong> 
                          {schedule.clinic.roomNumber && <><br/>{schedule.clinic.roomNumber}</>}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
    </main>
    </div>
  );
}
