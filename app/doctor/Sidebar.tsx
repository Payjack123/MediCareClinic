'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Activity, LayoutDashboard, CalendarDays, Calendar, CalendarCheck, Users, 
  FileText, Pill, TestTube, BarChart3, Bell, User, Settings, LogOut, 
  ChevronUp, ChevronDown, Edit, ImageIcon, Stethoscope, ClipboardList,
  Microscope, HeartPulse, ArrowLeftToLine, Shield
} from 'lucide-react';

type SubItem = {
  name: string;
  href: string;
  id: string;
  icon: any;
};

type NavItem = {
  name: string;
  href: string;
  icon: any;
  id: string;
  badge?: number;
  isExpandable?: boolean;
  subItems?: SubItem[];
};

type NavGroup = {
  group: string;
  items: NavItem[];
};

export default function DoctorSidebar({ activePage }: { activePage: string }) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState<string>(
    activePage.startsWith('prescriptions') ? 'prescriptions' : ''
  );

  const handleLogout = () => router.push('/login');

  const navigation: NavGroup[] = [
    {
      group: 'TỔNG QUAN',
      items: [
        { name: 'Dashboard', href: '/doctor/dashboard', icon: LayoutDashboard, id: 'dashboard' },
      ]
    },
    {
      group: 'LỊCH LÀM VIỆC',
      items: [
        { name: 'Lịch hẹn', href: '/doctor/appointments', icon: Calendar, id: 'appointments' },
        { name: 'Lịch hẹn hôm nay', href: '/doctor/today-appointments', icon: CalendarCheck, id: 'today-appointments' },
      ]
    },
    {
      group: 'KHÁM CHỮA BỆNH',
      items: [
        { name: 'Danh sách bệnh nhân', href: '/doctor/patients', icon: Users, id: 'patients' },
        { name: 'Bệnh án', href: '/doctor/records', icon: FileText, id: 'records' },
      ]
    },
    {
      group: 'XÉT NGHIỆM',
      items: [
        { name: 'Chỉ định xét nghiệm', href: '/doctor/test-orders', icon: TestTube, id: 'test-assign' },
        { name: 'Kết quả xét nghiệm', href: '/doctor/test-results', icon: Microscope, id: 'test-result' },
      ]
    },
    {
      group: 'QUẢN LÝ ĐIỀU TRỊ',
      items: [
        { 
          name: 'Đơn thuốc', 
          href: '/doctor/prescriptions', 
          icon: Pill, 
          id: 'prescriptions',
          isExpandable: true,
          subItems: [
            { name: 'Tạo đơn thuốc', href: '/doctor/prescriptions/create', id: 'prescriptions-create', icon: Edit },
            { name: 'Danh sách đơn thuốc', href: '/doctor/prescriptions', id: 'prescriptions-list', icon: LayoutDashboard }
          ]
        },
      ]
    },
    {
      group: 'HỆ THỐNG',
      items: [
        { name: 'Thông báo', href: '/doctor/settings/notifications', icon: Bell, id: 'notifications' },
        { name: 'Hồ sơ cá nhân', href: '/doctor/settings/profile', icon: User, id: 'profile' },
        { name: 'Lịch làm việc', href: '/doctor/settings/schedule', icon: Calendar, id: 'schedule' },
        { name: 'Bảo mật', href: '/doctor/settings/security', icon: Shield, id: 'security' },
      ]
    }
  ];

  return (
    <aside className="w-[280px] bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0 shrink-0 z-20 font-sans">
      {/* Logo Area */}
      <div className="h-20 flex items-center px-6 shrink-0 mt-2">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
            <HeartPulse size={26} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl text-blue-700 tracking-tight">MediCare</span>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Hệ thống phòng khám</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-6 custom-scrollbar px-3">
        {navigation.map((group, idx) => (
          <div key={idx} className="flex flex-col gap-1">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-3">
              {group.group}
            </p>
            
            <div className="flex flex-col space-y-1">
              {group.items.map((item) => {
                const isActive = activePage === item.id || activePage.startsWith(item.id + '-');
                
                if (item.isExpandable) {
                  const isExpanded = isMenuOpen === item.id;
                  return (
                    <div key={item.id} className="flex flex-col gap-1">
                      <button
                        onClick={() => setIsMenuOpen(isExpanded ? '' : item.id)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-medium transition-all duration-200 text-sm ${
                          isActive 
                            ? 'bg-blue-50 text-blue-600' 
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon size={18} className={isActive ? 'text-blue-600' : 'text-gray-400'} />
                          {item.name}
                        </div>
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>

                      {isExpanded && item.subItems && (
                        <div className="ml-9 flex flex-col gap-1 mt-1 animate-in fade-in slide-in-from-top-2 duration-200">
                          {item.subItems.map((subItem) => {
                            const isSubActive = activePage === subItem.id;
                            return (
                              <Link 
                                key={subItem.id}
                                href={subItem.href} 
                                className={`text-sm px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                                  isSubActive
                                    ? 'text-blue-600 font-semibold'
                                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                              >
                                {isSubActive && <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
                                <span className={isSubActive ? '' : 'ml-3'}>{subItem.name}</span>
                              </Link>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link 
                    key={item.id} 
                    href={item.href} 
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg font-medium transition-all duration-200 text-sm relative overflow-hidden group ${
                      isActive 
                        ? 'bg-blue-50/80 text-blue-700' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-md" />
                    )}
                    <div className="flex items-center gap-3 relative z-10">
                      <item.icon size={18} className={isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'} /> 
                      {item.name}
                    </div>
                    
                    {item.badge && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isActive 
                          ? 'bg-blue-200/50 text-blue-700' 
                          : 'bg-red-50 text-red-500'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-gray-100 flex items-center justify-between gap-3 shrink-0">
        <div className="w-11 h-11 rounded-full bg-[#2a2a2a] text-white flex items-center justify-center font-bold text-lg shrink-0">
          N
        </div>
        <button 
          onClick={handleLogout} 
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-red-50/80 text-red-600 hover:bg-red-100 rounded-xl transition-all duration-200 text-sm font-bold"
        >
          <LogOut size={18} /> Đăng xuất
        </button>
      </div>
    </aside>
  );
}

