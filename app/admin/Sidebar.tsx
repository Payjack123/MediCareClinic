'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Users, CalendarDays, FileText, Pill, TestTube, 
  Settings, Activity, Building2, ShieldCheck, Receipt, Stethoscope, 
  BriefcaseMedical, CreditCard, TrendingUp
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Báo cáo', href: '/admin/reports', icon: TrendingUp },
    { type: 'divider' },
    { name: 'Bác sĩ', href: '/admin/doctors', icon: Stethoscope },
    { name: 'Bệnh nhân', href: '/admin/patients', icon: Users },
    { name: 'Lịch hẹn', href: '/admin/appointments', icon: CalendarDays },
    { name: 'Hồ sơ bệnh án', href: '/admin/records', icon: FileText },
    { name: 'Đơn thuốc', href: '/admin/prescriptions', icon: Pill },
    { name: 'Xét nghiệm', href: '/admin/lab-tests', icon: TestTube },
    { type: 'divider' },
    { name: 'Hóa đơn', href: '/admin/billing', icon: Receipt },
    { name: 'Thu phí', href: '/admin/payments', icon: CreditCard },
    { type: 'divider' },
    { name: 'Khoa phòng', href: '/admin/departments', icon: Building2 },
    { name: 'Dịch vụ', href: '/admin/services', icon: BriefcaseMedical },
    { name: 'Tài khoản / RBAC', href: '/admin/users', icon: ShieldCheck },
    { name: 'Cài đặt', href: '/admin/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen sticky top-0 shrink-0 shadow-xl z-20">
      <div className="h-20 flex items-center justify-center border-b border-slate-800 bg-slate-950">
        <div className="flex items-center gap-2 text-white">
          <Activity className="text-blue-500" size={28}/>
          <span className="font-bold text-xl tracking-tight">ADMIN<span className="text-blue-500">PRO</span></span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-1 px-3 custom-scrollbar text-sm font-medium">
        {navItems.map((item, idx) => {
          if (item.type === 'divider') {
            return <div key={`div-${idx}`} className="my-2 border-t border-slate-800"></div>;
          }

          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
          const baseClasses = "flex items-center gap-3 px-4 py-3 rounded-xl transition-all";
          const activeClasses = "bg-blue-600 text-white shadow-md";
          const inactiveClasses = "hover:bg-slate-800 hover:text-white";

          const Icon = item.icon as any;

          return (
            <Link 
              key={item.href} 
              href={item.href as string} 
              className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
            >
              <Icon size={18} /> {item.name}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
