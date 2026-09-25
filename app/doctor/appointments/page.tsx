'use client';
import { Star } from "lucide-react";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard, CalendarDays, Users, FileText, Pill, TestTube, Mail,
  BarChart3, Bell, User, Settings, LogOut, Search, Plus, Filter, ArrowRight,
  CheckCircle2, Clock, Activity, PlayCircle, ChevronRight, CalendarX2, Printer,
  ChevronLeft, QrCode, XCircle, Calendar as CalendarIcon, MapPin, Stethoscope, Loader2
} from 'lucide-react';
import DoctorSidebar from '@/app/doctor/Sidebar';

import { getDoctorAppointmentsData } from '@/app/doctor/appointments/actions';

export default function DoctorAppointmentsPage() {
  const router = useRouter();

  // States dữ liệu
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  // State quản lý ngày và lịch khám
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedApptId, setSelectedApptId] = useState<number | null>(null);

  // ==========================================
  // THUẬT TOÁN SINH LỊCH FULL THÁNG (GIỐNG ẢNH)
  // ==========================================
  const [currentMonthView, setCurrentMonthView] = useState(new Date());

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Đổi Chủ Nhật (0) thành 6, T2 thành 0 để grid bắt đầu từ T2
  };

  const formatDateStr = (date: Date) => {
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
  };

  const generateCalendar = () => {
    const year = currentMonthView.getFullYear();
    const month = currentMonthView.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const daysInPrevMonth = getDaysInMonth(year, month - 1);

    const days = [];

    // Ngày của tháng trước (in mờ)
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ day: daysInPrevMonth - i, isCurrentMonth: false, date: new Date(year, month - 1, daysInPrevMonth - i) });
    }

    // Ngày của tháng hiện tại
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, isCurrentMonth: true, date: new Date(year, month, i) });
    }

    // Ngày của tháng sau (bù cho đủ grid 42 ô)
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ day: i, isCurrentMonth: false, date: new Date(year, month + 1, i) });
    }

    return days;
  };

  const calendarDays = generateCalendar();

  const handlePrevMonth = () => setCurrentMonthView(new Date(currentMonthView.getFullYear(), currentMonthView.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentMonthView(new Date(currentMonthView.getFullYear(), currentMonthView.getMonth() + 1, 1));

  // Khởi tạo ngày mặc định là hôm nay
  useEffect(() => {
    setSelectedDate(formatDateStr(new Date()));
  }, []);

  // Fetch dữ liệu mỗi khi đổi ngày
  useEffect(() => {
    if (!selectedDate) return;

    const fetchData = async () => {
      setIsLoading(true);
      const res = await getDoctorAppointmentsData(selectedDate);
      if (res.success && res.data) {
        setData(res.data);
        if (res.data.appointments.length > 0) {
          setSelectedApptId(res.data.appointments[0].id);
        } else {
          setSelectedApptId(null);
        }
      } else {
        router.push('/login');
      }
      setIsLoading(false);
    };
    fetchData();
  }, [selectedDate, router]);

  const handleLogout = () => router.push('/login');

  // Tính khoảng cách Pixel để xếp khối đặt lịch
  const calculateTopPosition = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    if (hours < 8) return 0;
    const hourDiff = hours - 8;
    const minDiff = minutes / 60;
    return (hourDiff + minDiff) * 96;
  };

  const getStatusColor = (rawStatus: string) => {
    switch (rawStatus) {
      case 'Đã khám': return 'bg-green-100 border-green-500 text-green-800';
      case 'Đã hủy': return 'bg-red-100 border-red-500 text-red-800';
      case 'Đã xác nhận': return 'bg-emerald-100 border-emerald-500 text-emerald-800';
      case 'Đã check-in': return 'bg-yellow-100 border-yellow-500 text-yellow-800';
      case 'Đang khám': return 'bg-purple-100 border-purple-500 text-purple-800';
      case 'Không đến': return 'bg-gray-100 border-gray-500 text-gray-800';
      default: return 'bg-blue-100 border-blue-500 text-blue-800'; // Đã đặt
    }
  };

  if (isLoading || !data) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><Loader2 className="w-10 h-10 text-[#2563EB] animate-spin" /></div>;
  }

  const activeAppt = data.appointments.find((a: any) => a.id === selectedApptId);

  return (
    <div className="min-h-screen flex bg-gray-50 font-sans text-gray-800 overflow-hidden">

      {/* SIDEBAR */}
      <DoctorSidebar activePage="appointments" />

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#F4F7FE]">
        {/* TOP HEADER */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 shrink-0 z-10">
          <div className="flex-1 max-w-2xl relative">
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Lịch khám của bác sĩ</h1>
            <p className="text-sm text-gray-500 mt-1">Quản lý và theo dõi lịch hẹn khám trong ngày</p>
          </div>
          <div className="flex items-center gap-5 pl-6">
            <div className="relative cursor-pointer text-gray-500 hover:text-blue-600 transition">
              <Bell size={20} />
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold border-2 border-white">5</span>
            </div>
            <div className="relative cursor-pointer text-gray-500 hover:text-blue-600 transition">
              <Mail size={20} />
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold border-2 border-white">2</span>
            </div>
            <div className="flex items-center gap-3 pl-5 border-l border-gray-200 cursor-pointer">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-gray-900">BS. {data.doctorInfo.name}</p>
                <p className="text-xs text-gray-500">{data.doctorInfo.rating} sao</p>
              </div>
              <img src={data.doctorInfo.avatar} alt="Doctor" className="w-9 h-9 rounded-full object-cover" />
            </div>
          </div>
        </header>

        {/* CỘT NỘI DUNG 3 PHẦN */}
        <div className="flex-1 flex overflow-hidden p-6 gap-6">

          {/* CỘT 1: LEFT SIDE (Calendar, Stats, Notifications) */}
          <div className="w-[300px] shrink-0 flex flex-col gap-6 overflow-y-auto scrollbar-hide pr-1">

            {/* Mini Calendar */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <button onClick={handlePrevMonth} className="p-1 hover:bg-gray-100 rounded text-gray-400"><ChevronLeft size={16} /></button>
                <h3 className="font-bold text-sm text-gray-900">Tháng {currentMonthView.getMonth() + 1}, {currentMonthView.getFullYear()}</h3>
                <button onClick={handleNextMonth} className="p-1 hover:bg-gray-100 rounded text-gray-400"><ChevronRight size={16} /></button>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2 text-gray-400 font-bold">
                <div>T2</div><div>T3</div><div>T4</div><div>T5</div><div>T6</div><div>T7</div><div>CN</div>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-sm">
                {calendarDays.map((d, i) => {
                  const dateStr = formatDateStr(d.date);
                  const isSelected = selectedDate === dateStr;
                  return (
                    <div
                      key={i}
                      onClick={() => setSelectedDate(dateStr)}
                      className={`p-1.5 rounded-full cursor-pointer transition flex items-center justify-center w-8 h-8 mx-auto ${!d.isCurrentMonth ? 'text-gray-300' :
                          isSelected ? 'bg-[#2563EB] text-white shadow-md font-bold' :
                            'text-gray-700 hover:bg-blue-50 hover:text-[#2563EB]'
                        }`}
                    >
                      {d.day}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-sm text-gray-900 mb-4">Thống kê hôm nay</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="flex items-center gap-2 text-gray-600"><CalendarDays size={16} className="text-blue-500" /> Tổng lịch hẹn</span>
                  <span className="font-bold text-gray-900">{data.stats.total}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="flex items-center gap-2 text-gray-600"><CheckCircle2 size={16} className="text-green-500" /> Đã khám</span>
                  <span className="font-bold text-green-600">{data.stats.completed}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="flex items-center gap-2 text-gray-600"><Clock size={16} className="text-orange-500" /> Đang chờ</span>
                  <span className="font-bold text-orange-600">{data.stats.waiting}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="flex items-center gap-2 text-gray-600"><XCircle size={16} className="text-red-500" /> Đã hủy</span>
                  <span className="font-bold text-red-600">{data.stats.canceled}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="flex items-center gap-2 text-gray-600"><User size={16} className="text-blue-400" /> Chưa đến</span>
                  <span className="font-bold text-gray-900">0</span>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-sm text-gray-900 mb-3">Thông báo</h3>
              <ul className="space-y-2 text-xs text-gray-600 list-disc pl-4">
                <li><span className="text-red-500 font-bold">Bạn có {data.stats.waiting} lịch hẹn đang chờ khám.</span></li>
                <li>Ca khám 10:30 sẽ muộn 10 phút.</li>
                <li>Bệnh nhân Trần Văn A có kết quả XN mới.</li>
              </ul>
              <button className="text-blue-600 text-xs font-bold mt-4 flex items-center gap-1 w-full justify-center hover:underline">
                Xem tất cả thông báo <ArrowRight size={12} />
              </button>
            </div>

            {/* Current Shift */}
            <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-xs font-bold text-gray-900">Ca đang diễn ra</span>
              </div>
              <p className="text-sm font-bold text-[#2563EB] mb-1">Phòng khám 201</p>
              <p className="text-xs text-gray-500 mb-4">08:30 - 11:30</p>
              <button className="w-full py-2 bg-white border border-red-200 text-red-600 rounded-lg text-xs font-bold hover:bg-red-50 transition">
                Kết thúc ca
              </button>
            </div>

          </div>

          {/* CỘT 2: MIDDLE TINE LINE (Danh sách/Lịch) */}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="bg-white flex-1 rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
              {/* View options */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
                <h2 className="font-bold text-gray-900">Thứ Năm, {data.currentDate}</h2>
              </div>

              {/* Timeline List */}
              <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                <div className="space-y-3">
                  {(() => {
                    const getBucketInfo = (timeStr: string) => {
                      let [time, modifier] = timeStr.split(' ');
                      let [hours, minutes] = time.split(':').map(Number);
                      
                      if (modifier) {
                        if (modifier.toUpperCase() === 'PM' && hours < 12) hours += 12;
                        if (modifier.toUpperCase() === 'AM' && hours === 12) hours = 0;
                      }
                      
                      const m = minutes >= 30 ? '30' : '00';
                      const h = hours.toString().padStart(2, '0');
                      
                      return `${h}:${m}`;
                    };

                    const groupedAppointments = data.appointments.reduce((acc: any, apt: any) => {
                       const bucket = getBucketInfo(apt.time);
                       if (!acc[bucket]) acc[bucket] = [];
                       acc[bucket].push(apt);
                       return acc;
                    }, {});

                    return Array.from({ length: 48 }, (_, i) => {
                      const h = Math.floor(i / 2).toString().padStart(2, '0');
                      const m = (i % 2 === 0) ? '00' : '30';
                      const timeSlot = `${h}:${m}`;

                      const slotAppointments = groupedAppointments[timeSlot] || [];

                    if (slotAppointments.length === 0) {
                      return (
                        <div key={timeSlot} className="flex gap-4 min-h-[40px] opacity-40 hover:opacity-100 transition group">
                          <div className="w-12 text-right pt-2">
                            <span className="text-xs font-bold text-gray-400 group-hover:text-gray-600">{timeSlot}</span>
                          </div>
                          <div className="flex-1 border-t border-dashed border-gray-200 mt-4"></div>
                        </div>
                      )
                    }

                    return (
                      <div key={timeSlot} className="flex gap-4">
                        <div className="w-12 text-right pt-2 shrink-0">
                          <span className="text-xs font-bold text-gray-700">{timeSlot}</span>
                        </div>
                        <div className="flex-1 space-y-3">
                          {slotAppointments.map((apt: any) => {
                            // Card colors based on status
                            let borderColor = 'border-l-blue-500';
                            let bgColor = 'bg-blue-50/50';
                            let badgeClass = 'bg-blue-100 text-blue-700';
                            let Icon = Clock;

                            if (apt.rawStatus === 'Đã khám') {
                              borderColor = 'border-l-green-500';
                              bgColor = 'bg-green-50/50';
                              badgeClass = 'bg-green-100 text-green-700';
                              Icon = CheckCircle2;
                            } else if (apt.rawStatus === 'Đã hủy') {
                              borderColor = 'border-l-red-500';
                              bgColor = 'bg-red-50/50';
                              badgeClass = 'bg-red-100 text-red-700';
                              Icon = XCircle;
                            } else if (apt.rawStatus === 'Đang chờ') {
                              borderColor = 'border-l-orange-400';
                              bgColor = 'bg-orange-50/30';
                              badgeClass = 'bg-orange-100 text-orange-700';
                              Icon = Clock;
                            } else if (apt.rawStatus === 'Đang khám') {
                              borderColor = 'border-l-purple-500';
                              bgColor = 'bg-purple-50/50';
                              badgeClass = 'bg-purple-100 text-purple-700';
                              Icon = User;
                            } else if (apt.rawStatus === 'Đã check-in') {
                              borderColor = 'border-l-yellow-500';
                              bgColor = 'bg-yellow-50/50';
                              badgeClass = 'bg-yellow-100 text-yellow-700';
                              Icon = CheckCircle2;
                            }

                            return (
                              <div key={apt.id} className={`flex items-center justify-between p-3 rounded-xl border border-gray-100 shadow-sm border-l-4 ${borderColor} ${bgColor} hover:shadow-md transition cursor-pointer`}>
                                <div className="flex items-center gap-4">
                                  <div className="w-12 text-xs font-bold text-gray-500 shrink-0">{apt.time}</div>
                                  <div>
                                    <p className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                      {apt.patientName} <span className="text-xs font-normal text-gray-500 bg-white px-2 py-0.5 rounded-full border border-gray-200">{apt.gender}</span>
                                    </p>
                                    <p className="text-xs text-gray-600 mt-1 truncate max-w-[200px]">{apt.reason}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className={`px-2 py-1 text-[10px] font-bold rounded ${badgeClass}`}>{apt.status}</span>
                                  <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5 text-gray-400 hover:text-gray-900 transition">
                                    <Icon size={16} />
                                  </button>
                                  <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5 text-gray-400 hover:text-gray-900 transition">
                                    <div className="flex gap-0.5"><div className="w-1 h-1 bg-current rounded-full"></div><div className="w-1 h-1 bg-current rounded-full"></div><div className="w-1 h-1 bg-current rounded-full"></div></div>
                                  </button>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  });
                  })()}
                </div>
              </div>
            </div>
          </div>

          {/* CỘT 3: RIGHT SIDE (Shift info, Upcoming, Actions) */}
          <div className="w-[320px] shrink-0 flex flex-col gap-6 overflow-y-auto scrollbar-hide pl-1">


            {/* Shift Info */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-sm text-gray-900 mb-4 pb-3 border-b border-gray-100">Thông tin ca làm việc</h3>
              <div className="space-y-3 mb-5">
                <div className="flex items-start justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-2"><User size={14} /> Bác sĩ</span>
                  <span className="font-bold text-gray-900 text-right">BS. {data.doctorInfo.name}</span>
                </div>
                <div className="flex items-start justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-2"><Stethoscope size={14} /> Chuyên khoa</span>
                  <span className="font-medium text-gray-900 text-right">Nội tổng quát</span>
                </div>
                <div className="flex items-start justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-2"><MapPin size={14} /> Phòng khám</span>
                  <span className="font-medium text-gray-900 text-right">Phòng 201 - Tầng 2</span>
                </div>
                <div className="flex items-start justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-2"><Clock size={14} /> Thời gian làm việc</span>
                  <span className="font-medium text-gray-900 text-right">07:30 - 17:00</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-gray-900 mb-2">
                  <span>Thời gian đã khám hôm nay</span>
                  <span>{Math.round((data.stats.completed / (data.stats.total || 1)) * 100)}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#2563EB]" style={{ width: `${Math.round((data.stats.completed / (data.stats.total || 1)) * 100)}%` }}></div>
                </div>
                <p className="text-right text-xs text-gray-500 mt-2">{data.stats.completed}/{data.stats.total} bệnh nhân</p>
              </div>
            </div>

            {/* Upcoming Patients */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex-1 flex flex-col min-h-0">
              <h3 className="font-bold text-sm text-gray-900 mb-4 pb-3 border-b border-gray-100 shrink-0">Bệnh nhân sắp tới</h3>
              <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4">
                {data.appointments.filter((a: any) => a.rawStatus !== 'Đã khám' && a.rawStatus !== 'Đã hủy').slice(0, 4).map((apt: any) => {
                  let badgeClass = 'bg-blue-100 text-blue-700';
                  if (apt.rawStatus === 'Đã check-in' || apt.rawStatus === 'Đang chờ') badgeClass = 'bg-orange-100 text-orange-700';
                  else if (apt.rawStatus === 'Đang khám') badgeClass = 'bg-purple-100 text-purple-700';
                  else if (apt.rawStatus === 'Đã xác nhận') badgeClass = 'bg-green-100 text-green-700';

                  return (
                  <div key={apt.id} className="flex gap-3 items-center">
                    <span className="text-xs font-bold text-[#2563EB] w-9">{apt.time.split('-')[0].trim()}</span>
                    <img src={apt.avatar} className="w-10 h-10 rounded-full object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">{apt.patientName}</p>
                      <p className="text-xs text-gray-500">{apt.gender}</p>
                    </div>
                    <span className={`px-2 py-1 text-[10px] font-bold rounded ${badgeClass} shrink-0 whitespace-nowrap`}>{apt.status}</span>
                  </div>
                  );
                })}
              </div>
              <button className="text-[#2563EB] text-xs font-bold mt-4 pt-3 border-t border-gray-100 flex items-center justify-center gap-1 w-full hover:underline shrink-0">
                Xem tất cả ({data.stats.waiting}) <ArrowRight size={12} />
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-sm text-gray-900 mb-4 pb-3 border-b border-gray-100">Hành động nhanh</h3>
              <div className="grid grid-cols-4 gap-2">
                <button className="flex flex-col items-center justify-center gap-2 p-2 rounded-xl hover:bg-gray-50 transition text-gray-600 group">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition">
                    <CalendarDays size={18} />
                  </div>
                  <span className="text-[10px] font-medium text-center">Thêm lịch hẹn</span>
                </button>
                <button className="flex flex-col items-center justify-center gap-2 p-2 rounded-xl hover:bg-gray-50 transition text-gray-600 group">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition">
                    <Bell size={18} />
                  </div>
                  <span className="text-[10px] font-medium text-center">Gọi bệnh nhân</span>
                </button>
                <button className="flex flex-col items-center justify-center gap-2 p-2 rounded-xl hover:bg-gray-50 transition text-gray-600 group">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition">
                    <FileText size={18} />
                  </div>
                  <span className="text-[10px] font-medium text-center">Xem hồ sơ</span>
                </button>
                <button className="flex flex-col items-center justify-center gap-2 p-2 rounded-xl hover:bg-gray-50 transition text-gray-600 group">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition">
                    <Printer size={18} />
                  </div>
                  <span className="text-[10px] font-medium text-center">In danh sách</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}