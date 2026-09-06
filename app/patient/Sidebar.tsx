'use client';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard, CalendarDays, CalendarCheck, FileText, Pill, HeartPulse,
  Settings, LogOut, Activity, Wallet, History
} from 'lucide-react';

export default function PatientSidebar({ activePage }: { activePage: string }) {
  const router = useRouter();


  const handleLogout = () => {
    router.push('/login');
  };

  const getMenuItemClass = (pageName: string) => {
    return activePage === pageName
      ? "flex items-center gap-3 px-4 py-3 bg-[#2563EB] text-white rounded-2xl font-bold shadow-md shadow-blue-200 transition-all text-sm"
      : "flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-[#2563EB] rounded-2xl transition-all text-sm font-semibold";
  };


  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0 shrink-0 shadow-sm z-20">
      <div className="h-20 flex items-center justify-center border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Activity className="text-[#2563EB]" size={28} />
          <span className="font-black text-xl tracking-tight text-gray-900">HEALTH<span className="text-[#2563EB]">CARE</span></span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-2 px-4 custom-scrollbar">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">Tổng quan</p>
        <Link href="/patient/dashboard" className={getMenuItemClass('dashboard')}>
          <LayoutDashboard size={18} /> Dashboard
        </Link>

        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-4 mb-2 px-2">Lịch hẹn</p>
        <Link href="/patient/appointments" className={getMenuItemClass('appointments')}>
          <CalendarDays size={18} /> Đặt lịch khám
        </Link>
        <Link href="/patient/my-appointments" className={getMenuItemClass('my-appointments')}>
          <CalendarCheck size={18} /> Lịch hẹn của tôi
        </Link>
        <Link href="/patient/medical-history" className={getMenuItemClass('medical-history')}>
          <History size={18} /> Lịch sử khám
        </Link>

        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-4 mb-2 px-2">Hồ sơ bệnh án</p>
        <Link href="/patient/records" className={getMenuItemClass('records')}>
          <HeartPulse size={18} /> Hồ sơ sức khỏe
        </Link>
        <Link href="/patient/medical-record" className={getMenuItemClass('medical-record')}>
          <FileText size={18} /> Hồ sơ bệnh án
        </Link>

        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-4 mb-2 px-2">Xét nghiệm</p>
        <Link href="/patient/test-results" className={getMenuItemClass('test-results')}>
          <Activity size={18} /> Kết quả xét nghiệm
        </Link>

        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-4 mb-2 px-2">Đơn thuốc</p>
        <Link href="/patient/prescriptions" className={getMenuItemClass('prescriptions')}>
          <Pill size={18} /> Đơn thuốc của tôi
        </Link>

        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-4 mb-2 px-2">Thu phí</p>
        <Link href="/patient/payments/history" className={getMenuItemClass('history')}>
          <FileText size={18} /> Danh sách hóa đơn
        </Link>
        <Link href="/patient/payments/invoices/pending" className={getMenuItemClass('invoices')}>
          <Wallet size={18} /> Thanh toán viện phí
        </Link>
        <Link href="/patient/payments/insurance" className={getMenuItemClass('insurance')}>
          <HeartPulse size={18} /> Bảo hiểm y tế
        </Link>

        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-4 mb-2 px-2">Tài khoản</p>
        <Link href="/patient/settings" className={getMenuItemClass('settings')}>
          <Settings size={18} /> Cài đặt cá nhân
        </Link>
      </div>

      <div className="p-4 border-t border-gray-100">
        <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-2xl transition-all text-sm font-bold">
          <LogOut size={18} /> Đăng xuất
        </button>
      </div>
    </aside>
  );
}
