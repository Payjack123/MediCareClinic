'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, Activity, ArrowLeft, Loader2, User, Stethoscope, ShieldCheck, ClipboardList, Eye, EyeOff, Shield, HeartPulse, Apple, Network } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/app/(auth)/actions/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [selectedRole, setSelectedRole] = useState<'PATIENT' | 'DOCTOR' | 'ADMIN' | 'RECEPTIONIST' | 'COORDINATOR'>('PATIENT');

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await loginUser(email, password, selectedRole);

      if (res.success) {
        switch (res.role) {
          case 'patient':
            router.push('/patient/dashboard');
            break;
          case 'doctor':
            router.push('/doctor/dashboard');
            break;
          case 'admin':
            router.push('/admin/dashboard');
            break;
          case 'receptionist':
            router.push('/receptionist/dashboard');
            break;
          case 'coordinator':
            router.push('/coordinator/dashboard');
            break;
          default:
            router.push('/patient/dashboard');
            break;
        }
      } else {
        setError(res.message || 'Đăng nhập không thành công.');
      }
    } catch (err) {
      console.error('Lỗi khi đăng nhập:', err);
      setError('Đã xảy ra lỗi kết nối hệ thống. Vui lòng thử lại!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-row font-sans bg-slate-50">

      {/* LEFT COLUMN - BRANDING (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 relative overflow-hidden p-12 flex-col justify-between">

        {/* Abstract Tech/Medical Pattern Overlay */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent bg-[length:20px_20px] mix-blend-overlay"></div>

        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-blue-100 hover:text-white transition-colors mb-12 group">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Quay lại trang chủ</span>
          </Link>

          <div className="flex items-center gap-3 mb-6">
            <div className="bg-white p-2 rounded-xl shadow-lg shadow-blue-900/20">
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
            <span className="font-bold text-3xl text-white tracking-tight">HEALTHCARE</span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
            Giải pháp quản lý <br /> nhà thuốc toàn diện
          </h1>
          <p className="text-blue-100 text-lg max-w-md leading-relaxed">
            Nền tảng công nghệ y tế hiện đại giúp tối ưu hóa quy trình khám chữa bệnh và quản lý hồ sơ y tế an toàn.
          </p>
        </div>

        {/* Glowing UI Card Illustration */}
        <div className="relative z-10 w-full max-w-md mx-auto mt-12 mb-8">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-2xl blur opacity-40"></div>
          <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-cyan-500/20 p-2.5 rounded-full">
                  <Shield className="h-6 w-6 text-cyan-300" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Bảo mật dữ liệu</h3>
                  <p className="text-blue-200 text-xs">Mã hóa đầu cuối 256-bit</p>
                </div>
              </div>
              <div className="h-2.5 w-2.5 bg-green-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(74,222,128,1)]"></div>
            </div>
            <div className="space-y-3">
              <div className="h-2 bg-white/20 rounded-full w-full"></div>
              <div className="h-2 bg-white/20 rounded-full w-4/5"></div>
              <div className="h-2 bg-white/20 rounded-full w-2/3"></div>
            </div>
            <div className="mt-6 flex items-center gap-4 border-t border-white/10 pt-4">
              <div className="flex -space-x-3">
                <div className="h-8 w-8 rounded-full border-2 border-blue-600 bg-blue-100 flex items-center justify-center"><User size={14} className="text-blue-600" /></div>
                <div className="h-8 w-8 rounded-full border-2 border-blue-600 bg-blue-200 flex items-center justify-center"><Stethoscope size={14} className="text-blue-700" /></div>
                <div className="h-8 w-8 rounded-full border-2 border-blue-600 bg-blue-300 flex items-center justify-center"><Activity size={14} className="text-blue-800" /></div>
              </div>
              <p className="text-blue-100 text-xs">Hơn +10,000 người dùng tin tưởng</p>
            </div>
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN - AUTH FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative overflow-y-auto">

        {/* Mobile Branding Header */}
        <div className="absolute top-6 left-6 lg:hidden flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl text-slate-800 tracking-tight">HEALTHCARE</span>
        </div>

        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100 my-auto">

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Đăng nhập</h2>
            <p className="text-slate-500 text-sm">
              Chào mừng trở lại! Vui lòng điền thông tin để tiếp tục.
            </p>
          </div>

          {/* Role Toggle Tabs */}
          <div className="flex flex-wrap bg-slate-100 p-1 rounded-xl mb-6 shadow-inner gap-1">
            <button type="button" onClick={() => { setError(''); setSelectedRole('PATIENT'); }}
              className={`flex-1 min-w-[65px] flex flex-col items-center justify-center gap-1.5 py-2 text-[10px] sm:text-xs font-semibold rounded-lg transition-all ${selectedRole === 'PATIENT' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}>
              <User size={18} /> Bệnh nhân
            </button>
            <button type="button" onClick={() => { setError(''); setSelectedRole('DOCTOR'); }}
              className={`flex-1 min-w-[65px] flex flex-col items-center justify-center gap-1.5 py-2 text-[10px] sm:text-xs font-semibold rounded-lg transition-all ${selectedRole === 'DOCTOR' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}>
              <Stethoscope size={18} /> Bác sĩ
            </button>
            <button type="button" onClick={() => { setError(''); setSelectedRole('RECEPTIONIST'); }}
              className={`flex-1 min-w-[65px] flex flex-col items-center justify-center gap-1.5 py-2 text-[10px] sm:text-xs font-semibold rounded-lg transition-all ${selectedRole === 'RECEPTIONIST' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}>
              <ClipboardList size={18} /> Lễ tân
            </button>
            <button type="button" onClick={() => { setError(''); setSelectedRole('COORDINATOR'); }}
              className={`flex-1 min-w-[65px] flex flex-col items-center justify-center gap-1.5 py-2 text-[10px] sm:text-xs font-semibold rounded-lg transition-all ${selectedRole === 'COORDINATOR' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}>
              <Network size={18} /> Điều phối
            </button>
            <button type="button" onClick={() => { setError(''); setSelectedRole('ADMIN'); }}
              className={`flex-1 min-w-[65px] flex flex-col items-center justify-center gap-1.5 py-2 text-[10px] sm:text-xs font-semibold rounded-lg transition-all ${selectedRole === 'ADMIN' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}>
              <ShieldCheck size={18} /> Admin
            </button>
          </div>

          {error && (
            <div className="mb-6 flex items-start gap-3 text-red-700 bg-red-50 p-4 rounded-xl text-sm font-medium border border-red-100 animate-in fade-in">
              <HeartPulse className="h-5 w-5 shrink-0 text-red-500 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-600">
                  <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="block w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-slate-50 hover:border-slate-300 bg-white"
                  placeholder="nhapemail@gmail.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Mật khẩu</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-600">
                  <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="block w-full pl-11 pr-12 py-3 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-slate-50 hover:border-slate-300 bg-white"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <div className="flex justify-end mt-2">
                <Link href="#" className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors">
                  Quên mật khẩu?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl shadow-lg shadow-blue-600/30 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all mt-4 disabled:bg-slate-300 disabled:shadow-none disabled:transform-none disabled:cursor-not-allowed disabled:text-slate-500"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Đang xử lý...</span>
                </>
              ) : (
                'Đăng nhập'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-8 flex items-center">
            <div className="flex-1 border-t border-slate-200"></div>
            <span className="px-4 text-xs text-slate-400 font-semibold uppercase tracking-wider bg-white">Hoặc tiếp tục với</span>
            <div className="flex-1 border-t border-slate-200"></div>
          </div>

          {/* Social Logins */}
          <div className="mt-6">
            <button className="w-full flex justify-center items-center gap-2 py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95">
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <span className="text-sm font-semibold text-slate-700">Đăng nhập với Google</span>
            </button>
          </div>

          <div className="mt-8 text-center bg-slate-50 p-4 rounded-xl border border-slate-100">
            <p className="text-sm text-slate-600">
              Chưa có tài khoản?{' '}
              <Link href="/register" className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors ml-1">
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}