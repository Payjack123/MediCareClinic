'use client'; 

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Activity, ArrowLeft, Loader2, Stethoscope, ShieldCheck, ClipboardList, Eye, EyeOff, Shield, HeartPulse, Send } from 'lucide-react';
import { registerUser, UserRole } from '@/app/(auth)/actions/auth';
import { sendOtp } from '@/app/(auth)/actions/otp';

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [selectedRole, setSelectedRole] = useState<UserRole>('PATIENT');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // OTP States
  const [otpCode, setOtpCode] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSendOtp = async () => {
    if (!email) {
      setError('Vui lòng nhập email trước khi gửi OTP!');
      return;
    }
    setError('');
    setSuccessMsg('');
    setIsSendingOtp(true);
    try {
      const res = await sendOtp(email);
      if (res.success) {
        setIsOtpSent(true);
        setSuccessMsg(res.message);
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError('Lỗi khi gửi OTP!');
    }
    setIsSendingOtp(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp!');
      return;
    }

    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự!');
      return;
    }

    setIsLoading(true);

    try {
      // Truyền thêm otpCode vào registerUser
      const res = await registerUser(fullName, email, password, selectedRole, otpCode);
      if (res.success) {
        alert(res.message || 'Thành công! Vui lòng đăng nhập.');
        router.push('/login'); 
      } else {
        setError(res.message); 
      }
    } catch (err) {
      console.error('Lỗi khi đăng ký:', err);
      setError('Đã xảy ra lỗi kết nối. Vui lòng thử lại sau!');
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
            Bắt đầu hành trình <br /> sức khỏe mới
          </h1>
          <p className="text-blue-100 text-lg max-w-md leading-relaxed">
            Đăng ký để dễ dàng đặt lịch khám, quản lý hồ sơ và trải nghiệm dịch vụ chăm sóc sức khỏe an toàn.
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
                  <h3 className="text-white font-semibold">An toàn & Tin cậy</h3>
                  <p className="text-blue-200 text-xs">Tuân thủ tiêu chuẩn y tế</p>
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
                <div className="h-8 w-8 rounded-full border-2 border-blue-600 bg-blue-100 flex items-center justify-center"><User size={14} className="text-blue-600"/></div>
                <div className="h-8 w-8 rounded-full border-2 border-blue-600 bg-blue-200 flex items-center justify-center"><Stethoscope size={14} className="text-blue-700"/></div>
                <div className="h-8 w-8 rounded-full border-2 border-blue-600 bg-blue-300 flex items-center justify-center"><Activity size={14} className="text-blue-800"/></div>
              </div>
              <p className="text-blue-100 text-xs">Tham gia cùng +10,000 người dùng</p>
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
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Đăng ký tài khoản</h2>
            <p className="text-slate-500 text-sm">
              Chọn vai trò và điền thông tin bên dưới để tiếp tục.
            </p>
          </div>

          {/* Role Toggle Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl mb-6 shadow-inner">
            <button type="button" onClick={() => { setError(''); setSelectedRole('PATIENT'); }}
              className={`flex-1 flex flex-col items-center justify-center gap-1.5 py-2 text-[11px] sm:text-xs font-semibold rounded-lg transition-all ${selectedRole === 'PATIENT' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}>
              <User size={18} /> Bệnh nhân
            </button>
            <button type="button" onClick={() => { setError(''); setSelectedRole('DOCTOR'); }}
              className={`flex-1 flex flex-col items-center justify-center gap-1.5 py-2 text-[11px] sm:text-xs font-semibold rounded-lg transition-all ${selectedRole === 'DOCTOR' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}>
              <Stethoscope size={18} /> Bác sĩ
            </button>
            <button type="button" onClick={() => { setError(''); setSelectedRole('RECEPTIONIST'); }}
              className={`flex-1 flex flex-col items-center justify-center gap-1.5 py-2 text-[11px] sm:text-xs font-semibold rounded-lg transition-all ${selectedRole === 'RECEPTIONIST' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}>
              <ClipboardList size={18} /> Lễ tân
            </button>
            <button type="button" onClick={() => { setError(''); setSelectedRole('ADMIN'); }}
              className={`flex-1 flex flex-col items-center justify-center gap-1.5 py-2 text-[11px] sm:text-xs font-semibold rounded-lg transition-all ${selectedRole === 'ADMIN' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}>
              <ShieldCheck size={18} /> Admin
            </button>
          </div>

          {error && (
            <div className="mb-6 flex items-start gap-3 text-red-700 bg-red-50 p-4 rounded-xl text-sm font-medium border border-red-100 animate-in fade-in">
              <HeartPulse className="h-5 w-5 shrink-0 text-red-500 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          {successMsg && (
            <div className="mb-6 flex items-start gap-3 text-green-700 bg-green-50 p-4 rounded-xl text-sm font-medium border border-green-100 animate-in fade-in">
              <ShieldCheck className="h-5 w-5 shrink-0 text-green-500 mt-0.5" />
              <p>{successMsg}</p>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Họ và tên</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-600">
                  <User className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                </div>
                <input 
                  type="text" 
                  required 
                  value={fullName} 
                  onChange={(e) => setFullName(e.target.value)} 
                  disabled={isLoading} 
                  className="block w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all hover:border-slate-300 disabled:bg-slate-50" 
                  placeholder="Nguyễn Văn A" 
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-600">
                  <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                </div>
                <input 
                  type="email" 
                  required 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  disabled={isLoading || isOtpSent} 
                  className="block w-full pl-11 pr-24 py-3 border border-slate-200 rounded-xl text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all hover:border-slate-300 disabled:bg-slate-50" 
                  placeholder="email@gmail.com" 
                />
                {!isOtpSent && (
                  <button 
                    type="button" 
                    onClick={handleSendOtp}
                    disabled={isSendingOtp}
                    className="absolute inset-y-1.5 right-1.5 px-3 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-bold flex items-center transition-colors disabled:opacity-50"
                  >
                    {isSendingOtp ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Gửi mã'}
                  </button>
                )}
              </div>
            </div>

            {isOtpSent && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Mã OTP (6 số)</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-600">
                    <ShieldCheck className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  </div>
                  <input 
                    type="text" 
                    required 
                    maxLength={6}
                    value={otpCode} 
                    onChange={(e) => setOtpCode(e.target.value)} 
                    disabled={isLoading} 
                    className="block w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all hover:border-slate-300 disabled:bg-slate-50 tracking-widest font-mono text-lg" 
                    placeholder="------" 
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2 flex justify-between">
                  <span>Kiểm tra mã OTP (Mock console)</span>
                  <button type="button" onClick={handleSendOtp} className="text-blue-600 hover:underline">Gửi lại mã</button>
                </p>
              </div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Mật khẩu</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-600">
                    <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  </div>
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    required 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    disabled={isLoading} 
                    className="block w-full pl-11 pr-10 py-3 border border-slate-200 rounded-xl text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all hover:border-slate-300 disabled:bg-slate-50" 
                    placeholder="••••••••" 
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Xác nhận</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-600">
                    <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  </div>
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    required 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    disabled={isLoading} 
                    className="block w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all hover:border-slate-300 disabled:bg-slate-50" 
                    placeholder="••••••••" 
                  />
                </div>
              </div>
            </div>
            
            <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl shadow-lg shadow-blue-600/30 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all mt-6 disabled:bg-slate-300 disabled:shadow-none disabled:transform-none disabled:cursor-not-allowed disabled:text-slate-500">
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Đang xử lý...</span>
                </>
              ) : (
                'Tạo tài khoản'
              )}
            </button>
          </form>
          
          <div className="mt-8 text-center bg-slate-50 p-4 rounded-xl border border-slate-100">
             <p className="text-sm text-slate-600">
                Đã có tài khoản? <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors ml-1">Đăng nhập ngay</Link>
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}