'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  CalendarDays, CheckCircle2, Clock, Users, Activity,
  ArrowRight, Search, Bell, MoreVertical, FileText, Pill,
  Stethoscope, User, Calendar, Megaphone
} from 'lucide-react';
import DoctorSidebar from "@/app/doctor/Sidebar";
import { getDoctorDashboardData } from '@/app/doctor/dashboard/actions';

export default function DoctorDashboard() {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      const res = await getDoctorDashboardData();
      if (res.success && res.data) {
        setDashboardData(res.data);
      } else {
        router.push('/login');
      }
      setIsLoading(false);
    };
    fetchDashboard();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="w-10 h-10 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!dashboardData) return null;

  const { doctor, stats, appointments } = dashboardData;

  // Giả lập dữ liệu cho biểu đồ và timeline vì backend chưa có
  const mockTimeline = [
    { time: '07:00 - 07:30', title: 'Họp giao ban khoa', icon: Users, color: 'text-gray-500', bg: 'bg-white border-gray-200' },
    { time: '07:30 - 11:30', title: 'Khám bệnh', subtitle: '14 bệnh nhân', icon: Stethoscope, color: 'text-[#2563EB]', bg: 'bg-blue-50 border-blue-200' },
    { time: '11:30 - 13:30', title: 'Nghỉ trưa', icon: Pill, color: 'text-green-600', bg: 'bg-green-50 border-green-200' },
    { time: '13:30 - 17:00', title: 'Khám bệnh', subtitle: '10 bệnh nhân', icon: Stethoscope, color: 'text-[#2563EB]', bg: 'bg-blue-50 border-blue-200' },
    { time: '17:00 - 17:30', title: 'Tổng kết cuối ngày', icon: Calendar, color: 'text-gray-500', bg: 'bg-white border-gray-200' },
  ];

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] font-sans text-gray-800">
      <DoctorSidebar activePage="dashboard" />

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* HEADER CỐ ĐỊNH */}
        <header className="bg-white border-b border-gray-100 px-8 h-20 shrink-0 flex items-center justify-between sticky top-0 z-10">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Tìm bệnh nhân, mã hồ sơ, lịch khám..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all"
            />
          </div>
          <div className="flex items-center gap-6">
            <div className="flex gap-4">
              <button className="relative text-gray-400 hover:text-gray-600 transition">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">3</span>
              </button>
            </div>
            <div className="h-8 w-px bg-gray-200"></div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">BS. {doctor.fullName}</p>
                <p className="text-xs text-gray-500">{doctor.doctorProfile?.specialty || 'Khoa Nội tổng quát'}</p>
              </div>
              <img src={doctor.doctorProfile?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.fullName)}&background=2563EB&color=fff`} alt="Doctor" className="w-10 h-10 rounded-full border border-gray-200 object-cover" />
            </div>
          </div>
        </header>

        {/* NỘI DUNG SCROLL */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Xin chào, BS. {doctor.fullName}!</h1>
            <p className="text-sm text-gray-500 mt-1">Chúc bạn một ngày làm việc hiệu quả.</p>
          </div>

          {/* 1. TOP STATS (5 CARDS) */}
          <div className="grid grid-cols-5 gap-4 mb-8">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-50 text-[#2563EB] rounded-xl flex items-center justify-center shrink-0">
                  <CalendarDays size={20} />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-gray-500 uppercase">Lịch khám hôm nay</p>
                </div>
              </div>
              <div>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-black text-gray-900">{stats.todayCount}</span>
                  <span className="text-sm text-gray-500 mb-1 font-medium">bệnh nhân</span>
                </div>
                <Link href="/doctor/appointments" className="text-xs font-bold text-[#2563EB] hover:underline flex items-center gap-1 mt-2">
                  Xem chi tiết <ArrowRight size={12} />
                </Link>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center shrink-0">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-gray-500 uppercase">Đã khám</p>
                </div>
              </div>
              <div>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-black text-gray-900">{Math.floor(stats.todayCount * 0.66)}</span>
                  <span className="text-sm text-gray-500 mb-1 font-medium">bệnh nhân</span>
                </div>
                <p className="text-xs font-bold text-gray-400 mt-2">66.7%</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center shrink-0">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-gray-500 uppercase">Đang chờ khám</p>
                </div>
              </div>
              <div>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-black text-gray-900">{Math.floor(stats.todayCount * 0.22)}</span>
                  <span className="text-sm text-gray-500 mb-1 font-medium">bệnh nhân</span>
                </div>
                <p className="text-xs font-bold text-gray-400 mt-2">22.2%</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center shrink-0">
                  <CalendarDays size={20} />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-gray-500 uppercase">Chưa khám</p>
                </div>
              </div>
              <div>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-black text-gray-900">{Math.floor(stats.todayCount * 0.11)}</span>
                  <span className="text-sm text-gray-500 mb-1 font-medium">bệnh nhân</span>
                </div>
                <p className="text-xs font-bold text-gray-400 mt-2">11.1%</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center shrink-0">
                  <Activity size={20} />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-gray-500 uppercase">Tổng bệnh nhân</p>
                </div>
              </div>
              <div>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-black text-gray-900">{stats.totalPatients}</span>
                  <span className="text-xs text-gray-500 mb-1.5 font-medium block ml-1">(Tháng này)</span>
                </div>
                <p className="text-xs font-bold text-green-600 mt-2 flex items-center gap-1">↑ 12% <span className="text-gray-400 font-normal">so với tháng trước</span></p>
              </div>
            </div>
          </div>

          {/* 2. MIDDLE ROW (3 COLUMNS) */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">

            {/* CỘT 1: LỊCH KHÁM HÔM NAY */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[400px]">
              <div className="p-5 border-b border-gray-100 flex justify-between items-center shrink-0">
                <h2 className="font-bold text-base text-gray-900">Lịch khám hôm nay</h2>
                <Link href="/doctor/today-appointments" className="text-xs font-bold text-[#2563EB] hover:underline">Xem tất cả</Link>
              </div>
              <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
                <div className="space-y-1">
                  {appointments.slice(0, 5).map((apt: any) => {
                    const isCompleted = apt.status === 'HOÀN THÀNH';
                    const age = apt.patient.dob ? new Date().getFullYear() - parseInt(apt.patient.dob.split(apt.patient.dob.includes('/') ? '/' : '-')[apt.patient.dob.includes('/') ? 2 : 0]) : 24;
                    const gender = apt.patient.gender || 'Nam';
                    return (
                      <div key={apt.id} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 transition cursor-pointer gap-2">
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <span className="text-sm font-bold text-[#2563EB] w-10 shrink-0">{apt.bookingTime}</span>
                          <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(apt.patient.fullName)}&background=random`} alt="Avatar" className="w-8 h-8 rounded-full border border-gray-200 shrink-0" />
                          <div className="min-w-0 flex-1">
                            <h4 className="font-bold text-sm text-gray-900 truncate" title={apt.patient.fullName}>{apt.patient.fullName}</h4>
                            <p className="text-[11px] text-gray-500 mt-0.5 truncate">{age} tuổi • {gender}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <p className="text-[11px] text-gray-600 max-w-[80px] truncate" title={apt.reason || 'Khám tổng quát'}>{apt.reason || 'Khám tổng quát'}</p>
                          {isCompleted ? (
                            <span className="bg-green-50 text-green-700 px-2 py-1 rounded text-[10px] font-bold shrink-0">Đã khám</span>
                          ) : (
                            <span className="bg-blue-50 text-[#2563EB] px-2 py-1 rounded text-[10px] font-bold shrink-0">Chờ khám</span>
                          )}
                          <MoreVertical size={16} className="text-gray-400 cursor-pointer hover:text-gray-600 shrink-0" />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
              <div className="p-3 border-t border-gray-100 shrink-0 flex justify-center">
                <Link href="/doctor/today-appointments" className="text-xs font-bold text-[#2563EB] bg-blue-50 hover:bg-blue-100 px-4 py-2.5 rounded-lg transition-colors flex items-center gap-1 w-full justify-center">
                  Xem lịch đầy đủ <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* CỘT 2: LỊCH LÀM VIỆC HÔM NAY (TIMELINE) */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[400px]">
              <div className="p-5 border-b border-gray-100 flex justify-between items-center shrink-0">
                <h2 className="font-bold text-base text-gray-900">Lịch làm việc hôm nay</h2>
                <button className="text-xs font-bold text-[#2563EB] hover:underline">Xem lịch tuần</button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                <div className="relative border-l border-gray-200 ml-3 space-y-6">
                  {mockTimeline.map((item, index) => (
                    <div key={index} className="relative pl-6">
                      <div className={`absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full ${index === 1 ? 'bg-[#2563EB]' : 'bg-gray-300 border-2 border-white'}`}></div>
                      <div className="flex flex-col gap-2 xl:flex-row xl:items-start">
                        <span className="text-xs font-bold text-gray-500 shrink-0 w-24 pt-1">{item.time}</span>
                        <div className={`flex-1 border rounded-xl p-3 flex items-center gap-3 ${item.bg}`}>
                          <item.icon size={18} className={item.color} />
                          <div>
                            <p className={`text-sm font-bold ${item.color}`}>{item.title}</p>
                            {item.subtitle && <p className="text-[11px] text-gray-500 mt-0.5">{item.subtitle}</p>}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CỘT 3: THỐNG KÊ KHÁM BỆNH */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[400px]">
              <div className="p-5 border-b border-gray-100 flex justify-between items-center shrink-0">
                <h2 className="font-bold text-base text-gray-900">Thống kê khám bệnh</h2>
                <select className="text-[11px] font-bold border border-gray-200 rounded-lg px-2 py-1 bg-white outline-none cursor-pointer">
                  <option>Tháng 8/2026</option>
                  <option>Tháng 7/2026</option>
                </select>
              </div>
              <div className="flex-1 p-5 flex flex-col justify-between">
                {/* Giả lập biểu đồ SVG */}
                <div className="w-full relative min-h-[160px]">
                  <svg viewBox="0 0 400 150" className="w-full h-full preserve-aspect-ratio-none">
                    {/* Grid lines */}
                    <line x1="0" y1="30" x2="400" y2="30" stroke="#f3f4f6" strokeWidth="1" />
                    <line x1="0" y1="70" x2="400" y2="70" stroke="#f3f4f6" strokeWidth="1" />
                    <line x1="0" y1="110" x2="400" y2="110" stroke="#f3f4f6" strokeWidth="1" />

                    {/* Graph line */}
                    <path d="M 0 100 Q 50 80 100 60 T 200 40 T 300 20 T 400 50" fill="none" stroke="#2563EB" strokeWidth="3" strokeLinecap="round" />

                    {/* Area under line */}
                    <path d="M 0 100 Q 50 80 100 60 T 200 40 T 300 20 T 400 50 L 400 150 L 0 150 Z" fill="url(#blue-gradient)" opacity="0.1" />

                    {/* Data points */}
                    <circle cx="0" cy="100" r="4" fill="#2563EB" stroke="white" strokeWidth="2" />
                    <circle cx="100" cy="60" r="4" fill="#2563EB" stroke="white" strokeWidth="2" />
                    <circle cx="200" cy="40" r="4" fill="#2563EB" stroke="white" strokeWidth="2" />
                    <circle cx="300" cy="20" r="4" fill="#2563EB" stroke="white" strokeWidth="2" />
                    <circle cx="400" cy="50" r="4" fill="#2563EB" stroke="white" strokeWidth="2" />

                    <defs>
                      <linearGradient id="blue-gradient" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#2563EB" />
                        <stop offset="100%" stopColor="transparent" />
                      </linearGradient>
                    </defs>
                  </svg>
                  {/* Labels x-axis */}
                  <div className="absolute bottom-0 left-0 w-full flex justify-between text-[10px] text-gray-400 font-bold px-2">
                    <span>01/08</span>
                    <span>05/08</span>
                    <span>10/08</span>
                    <span>15/08</span>
                    <span>20/08</span>
                    <span>25/08</span>
                    <span>30/08</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-4">
                  <div className="border border-gray-100 bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-xl font-black text-[#2563EB]">{stats.totalPatients}</p>
                    <p className="text-[10px] text-gray-500 font-medium mt-1">Tổng lượt khám</p>
                  </div>
                  <div className="border border-gray-100 bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-xl font-black text-gray-900">21.7</p>
                    <p className="text-[10px] text-gray-500 font-medium mt-1">Trung bình/ngày</p>
                  </div>
                  <div className="border border-green-100 bg-green-50 rounded-xl p-3 text-center flex flex-col justify-center items-center">
                    <p className="text-lg font-black text-green-600">↑ 12%</p>
                    <p className="text-[9px] text-gray-500 font-medium mt-1 leading-tight">So với tháng trước</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* 3. BOTTOM ROW (3 COLUMNS) */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

            {/* CỘT 1: DANH SÁCH CHỜ KHÁM */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[320px]">
              <div className="p-5 border-b border-gray-100 flex justify-between items-center shrink-0">
                <h2 className="font-bold text-base text-gray-900">Danh sách chờ khám</h2>
                <Link href="/doctor/appointments" className="text-xs font-bold text-[#2563EB] hover:underline">Xem tất cả</Link>
              </div>
              <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                <div className="space-y-2">
                  {appointments.filter((a: any) => a.status !== 'HOÀN THÀNH').slice(0, 4).map((apt: any, i: number) => {
                    const age = apt.patient.dob ? new Date().getFullYear() - parseInt(apt.patient.dob.split(apt.patient.dob.includes('/') ? '/' : '-')[apt.patient.dob.includes('/') ? 2 : 0]) : 24;
                    const gender = apt.patient.gender || 'Nam';
                    return (
                    <div key={apt.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition">
                      <span className="text-xs font-bold text-gray-400 w-4 shrink-0 text-center">{i + 1}</span>
                      <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(apt.patient.fullName)}&background=random`} alt="Avatar" className="w-8 h-8 rounded-full border border-gray-200 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm text-gray-900 truncate" title={apt.patient.fullName}>{apt.patient.fullName}</h4>
                        <p className="text-[11px] text-gray-500 truncate">{age} tuổi • {gender}</p>
                      </div>
                      <div className="text-right shrink-0 max-w-[120px]">
                        <p className="text-[11px] font-bold text-gray-700 truncate" title={apt.reason || 'Khám tổng quát'}>{apt.reason || 'Khám tổng quát'}</p>
                        <p className="text-[10px] text-gray-400 flex items-center gap-1 justify-end mt-0.5"><Clock size={10} /> {apt.bookingTime}</p>
                      </div>
                    </div>
                  )})}
                </div>
              </div>
              <div className="p-4 border-t border-gray-100 shrink-0">
                <button className="w-full py-2.5 bg-blue-50 text-[#2563EB] rounded-xl font-bold text-sm hover:bg-blue-100 transition flex items-center justify-center gap-2">
                  <Megaphone size={16} /> Gọi bệnh nhân tiếp theo
                </button>
              </div>
            </div>

            {/* CỘT 2: HỒ SƠ BỆNH ÁN MỚI */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[320px]">
              <div className="p-5 border-b border-gray-100 flex justify-between items-center shrink-0">
                <h2 className="font-bold text-base text-gray-900">Hồ sơ bệnh án mới</h2>
                <Link href="/doctor/records" className="text-xs font-bold text-[#2563EB] hover:underline">Xem tất cả</Link>
              </div>
              <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                <div className="space-y-2">
                  {appointments.filter((a: any) => a.status === 'HOÀN THÀNH').slice(0, 4).map((apt: any) => (
                    <div key={apt.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition">
                      <div className="flex items-center gap-3">
                        <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(apt.patient.fullName)}&background=random`} alt="Avatar" className="w-8 h-8 rounded-full border border-gray-200" />
                        <div>
                          <h4 className="font-bold text-sm text-gray-900">{apt.patient.fullName}</h4>
                          <p className="text-[10px] text-gray-400 mt-0.5">{new Date().toLocaleDateString('vi-VN')} {apt.bookingTime}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[11px] font-bold text-gray-700">{apt.reason || 'Viêm họng cấp'}</p>
                        <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-md inline-block mt-0.5">Đã tạo</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-4 border-t border-gray-100 shrink-0">
                <Link href="/doctor/records" className="w-full py-2.5 bg-white border border-blue-200 text-[#2563EB] rounded-xl font-bold text-sm hover:bg-blue-50 transition flex items-center justify-center gap-2">
                  Tạo hồ sơ mới <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* CỘT 3: THAO TÁC NHANH (4 NÚT) */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[320px]">
              <div className="p-5 border-b border-gray-100 flex justify-between items-center shrink-0">
                <h2 className="font-bold text-base text-gray-900">Thao tác nhanh</h2>
              </div>
              <div className="flex-1 p-5 grid grid-cols-2 grid-rows-2 gap-4">

                <Link href="/doctor/appointments" className="bg-blue-50 hover:bg-[#2563EB] hover:text-white group border border-blue-100 rounded-xl p-3 flex flex-col items-center justify-center text-center transition-all duration-300">
                  <Stethoscope size={24} className="text-[#2563EB] group-hover:text-white mb-2 transition-colors" />
                  <h3 className="font-bold text-sm text-gray-900 group-hover:text-white">Khám bệnh</h3>
                  <p className="text-[10px] text-gray-500 group-hover:text-blue-200 mt-0.5">Tạo hồ sơ khám</p>
                </Link>

                <Link href="/doctor/prescriptions/create" className="bg-blue-50 hover:bg-[#2563EB] hover:text-white group border border-blue-100 rounded-xl p-3 flex flex-col items-center justify-center text-center transition-all duration-300">
                  <Pill size={24} className="text-[#2563EB] group-hover:text-white mb-2 transition-colors" />
                  <h3 className="font-bold text-sm text-gray-900 group-hover:text-white">Đơn thuốc</h3>
                  <p className="text-[10px] text-gray-500 group-hover:text-blue-200 mt-0.5">Tạo đơn thuốc mới</p>
                </Link>

                <Link href="/doctor/records" className="bg-blue-50 hover:bg-[#2563EB] hover:text-white group border border-blue-100 rounded-xl p-3 flex flex-col items-center justify-center text-center transition-all duration-300">
                  <FileText size={24} className="text-[#2563EB] group-hover:text-white mb-2 transition-colors" />
                  <h3 className="font-bold text-sm text-gray-900 group-hover:text-white">Hồ sơ bệnh án</h3>
                  <p className="text-[10px] text-gray-500 group-hover:text-blue-200 mt-0.5">Tạo hồ sơ mới</p>
                </Link>

                <Link href="/doctor/patients" className="bg-blue-50 hover:bg-[#2563EB] hover:text-white group border border-blue-100 rounded-xl p-3 flex flex-col items-center justify-center text-center transition-all duration-300">
                  <User size={24} className="text-[#2563EB] group-hover:text-white mb-2 transition-colors" />
                  <h3 className="font-bold text-sm text-gray-900 group-hover:text-white">Tìm bệnh nhân</h3>
                  <p className="text-[10px] text-gray-500 group-hover:text-blue-200 mt-0.5">Tra cứu hồ sơ bệnh nhân</p>
                </Link>

              </div>
            </div>

          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center gap-3 mt-6">
            <div className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center shrink-0">
              <span className="font-bold text-sm">💡</span>
            </div>
            <p className="text-sm font-medium text-yellow-800">
              <span className="font-bold">Lưu ý:</span> Vui lòng khám bệnh đúng giờ và cập nhật đầy đủ thông tin để đảm bảo chất lượng điều trị.
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}