'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, Users, Activity, Menu, X, ArrowRight } from 'lucide-react';
import LogoutButton from '@/components/LogoutButton';

export interface UserAuth {
  id: number;
  fullName: string;
  phone?: string | null;
  role?: string;
  avatar?: string | null;
}

interface LandingNavbarProps {
  initialUser?: UserAuth | null;
  isLoggedIn?: boolean;
}

export default function LandingNavbar({
  initialUser = null,
  isLoggedIn: initialIsLoggedIn = false
}: LandingNavbarProps) {
  const pathname = usePathname();
  const [user, setUser] = useState<UserAuth | null>(initialUser);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(initialIsLoggedIn || !!initialUser);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Đồng bộ trạng thái đăng nhập qua API /api/auth/me
  useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            if (data.isLoggedIn && data.user) {
              setUser(data.user);
              setIsLoggedIn(true);
            } else {
              setUser(null);
              setIsLoggedIn(false);
            }
          }
        }
      } catch (err) {
        console.error('Lỗi kiểm tra phiên đăng nhập:', err);
      }
    }

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [pathname]);

  // Đóng mobile menu khi chuyển trang
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: 'Bệnh viện', href: '/landing/benh-vien', match: '/landing/benh-vien' },
    { name: 'Phòng khám', href: '/landing/phong-kham', match: '/landing/phong-kham' },
    { name: 'Bác sĩ', href: '/landing/bac-si', match: '/landing/bac-si' },
    { name: 'Đặt lịch khám', href: '/landing/dat-lich', match: '/landing/dat-lich' },
    { name: 'Tin sức khỏe', href: '/landing/bai-viet', match: '/landing/bai-viet' },
    { name: 'Tra cứu AI', href: '/landing/tra-cuu', match: '/landing/tra-cuu' }
  ];

  const isLinkActive = (match: string | string[]) => {
    if (Array.isArray(match)) {
      return match.some(m => pathname.startsWith(m));
    }
    return pathname.startsWith(match);
  };

  const getDashboardHref = () => {
    if (!user) return '/patient/dashboard';
    if (user.role === 'DOCTOR') return '/doctor/dashboard';
    if (user.role === 'ADMIN') return '/admin/dashboard';
    if (user.role === 'RECEPTIONIST') return '/receptionist/dashboard';
    return '/patient/dashboard';
  };

  return (
    <>
      {/* 1. TOP BAR */}
      <div className="bg-[#0b53c1] text-white text-sm py-2 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 font-medium">
              <Phone size={14} /> Hotline: 0941.298.865
            </span>
            <span className="text-blue-200">|</span>
            <Link href="/landing" className="hover:text-blue-200 transition font-medium">
              Hệ thống Y tế MediCare
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-medium">Hệ thống đặt lịch khám trực tuyến toàn quốc</span>
            <span className="text-blue-200">|</span>
            <span className="font-medium text-blue-100">Tiếng Việt</span>
          </div>
        </div>
      </div>

      {/* 2. NAVBAR CHÍNH */}
      <nav className="bg-white sticky top-0 z-50 shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/landing" className="flex items-center gap-2 cursor-pointer">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center mr-2.5 shadow-sm text-white">
                  <Activity size={24} />
                </div>
                <span className="font-bold text-3xl tracking-tight text-gray-900">
                  Medi<span className="text-blue-600">Care</span>
                </span>
              </div>
            </Link>

            {/* Menu Desktop */}
            <div className="hidden lg:flex space-x-7 font-semibold text-gray-700 items-center">
              {navLinks.map((link) => {
                const active = isLinkActive(link.match);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`transition-colors py-1 ${
                      active
                        ? 'text-blue-600 border-b-2 border-blue-600 font-bold'
                        : 'text-gray-700 hover:text-blue-600'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            {/* Right Actions */}
            <div className="hidden md:flex items-center gap-4">
              {isLoggedIn && user ? (
                <div className="flex items-center gap-3">
                  <Link
                    href={getDashboardHref()}
                    className="text-blue-600 font-bold hover:underline flex items-center gap-1.5 text-sm bg-blue-50/70 border border-blue-100 px-3.5 py-2 rounded-xl transition-all"
                  >
                    <Users size={16} />
                    <span>{user.fullName}</span>
                  </Link>
                  <LogoutButton redirectTo="/landing" />
                </div>
              ) : (
                <>
                  <Link
                    href={`/login?redirect=${encodeURIComponent(pathname)}`}
                    className="text-gray-700 font-semibold hover:text-blue-600 transition flex items-center gap-2 text-sm"
                  >
                    <Users size={18} /> Đăng nhập
                  </Link>
                  <Link
                    href={`/register?redirect=${encodeURIComponent(pathname)}`}
                    className="bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] text-white px-5 py-2.5 rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all text-sm"
                  >
                    Đăng ký
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-gray-700 p-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 px-4 pt-4 pb-6 space-y-3 shadow-xl animate-in slide-in-from-top-2">
            <div className="space-y-1">
              {navLinks.map((link) => {
                const active = isLinkActive(link.match);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`block px-3 py-2.5 rounded-xl font-semibold text-sm ${
                      active ? 'bg-blue-50 text-blue-600 font-bold' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            <div className="pt-4 border-t border-gray-100">
              {isLoggedIn && user ? (
                <div className="space-y-3">
                  <div className="text-xs text-gray-400 font-bold uppercase tracking-wider px-1">Tài khoản</div>
                  <Link
                    href={getDashboardHref()}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-blue-50 text-blue-700 font-bold text-sm"
                  >
                    <span className="flex items-center gap-2">
                      <Users size={16} /> {user.fullName}
                    </span>
                    <ArrowRight size={16} />
                  </Link>
                  <LogoutButton redirectTo="/landing" className="w-full justify-center py-2.5" />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href={`/login?redirect=${encodeURIComponent(pathname)}`}
                    className="w-full py-2.5 rounded-xl border border-gray-300 font-bold text-gray-700 text-center text-sm hover:bg-gray-50 flex items-center justify-center gap-1.5"
                  >
                    <Users size={16} /> Đăng nhập
                  </Link>
                  <Link
                    href={`/register?redirect=${encodeURIComponent(pathname)}`}
                    className="w-full py-2.5 rounded-xl bg-blue-600 font-bold text-white text-center text-sm hover:bg-blue-700 shadow-md shadow-blue-200"
                  >
                    Đăng ký
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}

