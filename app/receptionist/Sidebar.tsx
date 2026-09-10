'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home, UserCheck, Ticket, Users, CalendarDays, CalendarClock, CalendarRange,
  Search, MessageSquare, LogOut, HeartPulse, CreditCard, FileText, ShieldPlus, BarChart3, Settings, Headset
} from 'lucide-react';
import NotificationBell from '@/components/NotificationBell';

export default function ReceptionistLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const activePage = pathname.split('/').pop() || 'dashboard';

  const getLinkClass = (pageName: string) => {
    return activePage === pageName
      ? "flex items-center gap-3 px-4 py-2.5 bg-blue-50 text-blue-600 rounded-xl font-medium transition-all duration-200"
      : "flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-gray-600 hover:text-gray-900 rounded-xl transition-all duration-200";
  };

  const getIconClass = (pageName: string) => {
    return activePage === pageName ? "text-blue-600" : "text-gray-400";
  };

  const Subtitle = ({ children }: { children: React.ReactNode }) => (
    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-4 mb-2 px-4">{children}</p>
  );

  return (
    <div className="flex min-h-screen bg-gray-50/50 text-gray-900 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0 shrink-0 z-20">
        <div className="h-20 flex flex-col justify-center px-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 rounded-lg p-1">
              <HeartPulse className="text-white" size={24} />
            </div>
            <div>
              <h1 className="font-bold text-xl text-blue-900 leading-tight">MediCare</h1>
              <p className="text-[10px] text-gray-500 font-medium">Hệ thống quản lý phòng khám</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-1 px-3 custom-scrollbar">
          <Link href="/receptionist/dashboard" className={getLinkClass('dashboard')}>
            <Home size={20} className={getIconClass('dashboard')} /> Tổng quan
          </Link>

          <Subtitle>TIẾP ĐÓN</Subtitle>
          <Link href="/receptionist/check-in" className={getLinkClass('check-in')}>
            <UserCheck size={20} className={getIconClass('check-in')} /> Check-in bệnh nhân
          </Link>
          <Link href="/receptionist/tickets" className={getLinkClass('tickets')}>
            <Ticket size={20} className={getIconClass('tickets')} /> Cấp số thứ tự
          </Link>
          <Link href="/receptionist/queue" className={getLinkClass('queue')}>
            <Users size={20} className={getIconClass('queue')} /> Hàng đợi khám
          </Link>

          <Subtitle>LỊCH HẸN</Subtitle>
          <Link href="/receptionist/appointments" className={getLinkClass('appointments')}>
            <CalendarDays size={20} className={getIconClass('appointments')} /> Danh sách lịch hẹn
          </Link>
          <Link href="/receptionist/today-appointments" className={getLinkClass('today-appointments')}>
            <CalendarClock size={20} className={getIconClass('today-appointments')} /> Lịch hẹn hôm nay
          </Link>
          <Link href="/receptionist/tomorrow-appointments" className={getLinkClass('tomorrow-appointments')}>
            <CalendarRange size={20} className={getIconClass('tomorrow-appointments')} /> Lịch hẹn ngày mai
          </Link>

          <Subtitle>BỆNH NHÂN</Subtitle>
          <Link href="/receptionist/patients" className={getLinkClass('patients')}>
            <Users size={20} className={getIconClass('patients')} /> Danh sách bệnh nhân
          </Link>

          <Subtitle>THANH TOÁN</Subtitle>
          <Link href="/receptionist/fee" className={getLinkClass('fee')}>
            <CreditCard size={20} className={getIconClass('fee')} /> Thu phí
          </Link>
          <Link href="/receptionist/invoices" className={getLinkClass('invoices')}>
            <FileText size={20} className={getIconClass('invoices')} /> Hóa đơn
          </Link>
          <Link href="/receptionist/insurance" className={getLinkClass('insurance')}>
            <ShieldPlus size={20} className={getIconClass('insurance')} /> BHYT
          </Link>

          <Subtitle>BÁO CÁO</Subtitle>
          <Link href="/receptionist/reports" className={getLinkClass('reports')}>
            <BarChart3 size={20} className={getIconClass('reports')} /> Báo cáo trong ngày
          </Link>

          <Subtitle>CÀI ĐẶT</Subtitle>
          <Link href="/receptionist/settings" className={getLinkClass('settings')}>
            <Settings size={20} className={getIconClass('settings')} /> Cài đặt cá nhân
          </Link>
        </div>

        <div className="p-4 border-t border-gray-100">
          <Link href="/" className="flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl font-medium transition-colors">
            <LogOut size={20} />
            Đăng xuất
          </Link>
        </div>
      </aside>

      {/* Main Content including Header */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Xin chào, Lễ tân Nguyễn Thị Hương 👋</h2>
            <p className="text-sm text-gray-500 mt-1">Chúc bạn một ngày làm việc hiệu quả!</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-full text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-gray-50/50"
                placeholder="Tìm bệnh nhân, SĐT, mã lịch hẹn..."
              />
              <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
                <span className="text-xs text-gray-400 bg-white border border-gray-200 px-1.5 py-0.5 rounded shadow-sm">/</span>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <NotificationBell />
              <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <MessageSquare size={20} />
                <span className="absolute top-1.5 right-1.5 block h-4 w-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
                  1
                </span>
              </button>
            </div>

            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="h-10 w-10 rounded-full bg-blue-100 overflow-hidden relative border border-gray-200">
                <div className="w-full h-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold">
                  NH
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-700">Nguyễn Thị Hương</span>
                <span className="text-xs text-gray-500">Lễ tân</span>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto bg-gray-50/50 p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
