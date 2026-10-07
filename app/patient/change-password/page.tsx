'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Bell, Lock, KeyRound, ShieldCheck, Mail, Phone, CheckCircle2, Loader2
} from 'lucide-react';

import { getPatientSettingsData, updatePatientPassword } from '@/app/patient/settings/actions';
import PatientSidebar from '@/app/patient/Sidebar';

export default function PatientChangePasswordPage() {
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [profileForm, setProfileForm] = useState<any>({
    fullName: '', email: '', phone: '', patientCode: '', avatar: ''
  });

  const [passForm, setPassForm] = useState({
    currentPassword: '', newPassword: '', confirmPassword: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const res = await getPatientSettingsData();
      if (res.success && res.data) {
        setProfileForm(res.data);
      } else {
        router.push('/login');
      }
      setIsLoading(false);
    };
    fetchData();
  }, [router]);

  // Xử lý Cập nhật Mật khẩu
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passForm.newPassword !== passForm.confirmPassword) {
      return alert('Mật khẩu xác nhận không khớp!');
    }
    if (passForm.newPassword.length < 6) {
      return alert('Mật khẩu mới phải có ít nhất 6 ký tự!');
    }

    setIsSaving(true);
    const res = await updatePatientPassword(passForm);
    setIsSaving(false);

    if (res.success) {
      alert(res.message);
      setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } else {
      alert(res.message);
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]"><Loader2 className="w-10 h-10 text-[#2563EB] animate-spin" /></div>;

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] font-sans text-gray-800 overflow-hidden">
      
      {/* SIDEBAR */}
      <PatientSidebar activePage="change-password" />

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* TOP HEADER */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-8 shrink-0 z-10">
          <div className="flex items-center gap-4">
            <div className="bg-blue-50 p-2 rounded-lg"><Lock className="text-[#2563EB]" size={24}/></div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Đổi mật khẩu & Bảo mật</h1>
            </div>
          </div>
          <div className="flex items-center gap-5 ml-auto">
            <button className="relative p-2.5 text-gray-500 hover:bg-blue-50 hover:text-[#2563EB] rounded-full transition bg-white border border-gray-200 shadow-sm">
              <Bell size={20}/>
            </button>
            <div className="flex items-center gap-3 pl-5 border-l border-gray-200 cursor-pointer group">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-900 group-hover:text-[#2563EB] transition">{profileForm.fullName}</p>

              </div>
              <img src={profileForm.avatar} alt="Avatar" className="w-11 h-11 rounded-full border-2 border-white shadow-sm group-hover:shadow-md transition object-cover"/>
            </div>
          </div>
        </header>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 animate-in fade-in duration-500 bg-[#F8FAFC]">
          
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col relative max-w-5xl mx-auto p-8">
            <div className="border-b border-gray-100 pb-5 mb-6">
              <h2 className="text-2xl font-black text-gray-900">Bảo mật tài khoản</h2>
              <p className="text-gray-500 text-sm mt-1">Đổi mật khẩu và tăng cường bảo mật cho tài khoản của bạn.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
              {/* Đổi mật khẩu */}
              <form onSubmit={handlePasswordSubmit} className="bg-gray-50 p-6 rounded-2xl border border-gray-100 h-max">
                <h3 className="font-bold text-gray-900 mb-5 flex items-center gap-2"><KeyRound size={18} className="text-[#2563EB]"/> Đổi mật khẩu</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">MẬT KHẨU HIỆN TẠI</label>
                    <input required value={passForm.currentPassword} onChange={e => setPassForm({...passForm, currentPassword: e.target.value})} type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#2563EB] outline-none"/>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">MẬT KHẨU MỚI</label>
                    <input required value={passForm.newPassword} onChange={e => setPassForm({...passForm, newPassword: e.target.value})} type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#2563EB] outline-none"/>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">XÁC NHẬN MẬT KHẨU MỚI</label>
                    <input required value={passForm.confirmPassword} onChange={e => setPassForm({...passForm, confirmPassword: e.target.value})} type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#2563EB] outline-none"/>
                  </div>
                  <button disabled={isSaving} type="submit" className="w-full bg-[#2563EB] text-white py-3 rounded-xl font-bold hover:bg-blue-700 shadow-sm transition-all mt-2 flex justify-center items-center gap-2">
                    {isSaving ? <Loader2 size={20} className="animate-spin"/> : 'Cập nhật mật khẩu'}
                  </button>
                </div>
              </form>

              {/* Xác thực 2 bước & SĐT */}
              <div className="space-y-4">
                <div className="border border-gray-200 p-5 rounded-2xl flex items-center justify-between">
                  <div className="flex gap-3 items-center">
                    <div className="bg-blue-50 p-2.5 rounded-lg text-[#2563EB]"><ShieldCheck size={20}/></div>
                    <div>
                      <p className="font-bold text-gray-900">Xác thực 2 bước (2FA)</p>
                      <p className="text-xs text-gray-500 mt-0.5">Tăng cường bảo mật qua ứng dụng.</p>
                    </div>
                  </div>
                  <div className="w-12 h-6 bg-gray-200 rounded-full relative cursor-pointer">
                    <div className="absolute top-1 left-1 bg-white w-4 h-4 rounded-full shadow"></div>
                  </div>
                </div>

                <div className="border border-green-200 bg-green-50 p-5 rounded-2xl flex items-center justify-between">
                  <div className="flex gap-3 items-center">
                    <div className="bg-white p-2.5 rounded-lg text-green-600 shadow-sm"><Mail size={20}/></div>
                    <div>
                      <p className="font-bold text-gray-900">Email khôi phục</p>
                      <p className="text-xs text-gray-500 mt-0.5">{profileForm.email || 'Chưa cập nhật'}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-green-700 bg-green-200 px-2.5 py-1 rounded flex items-center gap-1"><CheckCircle2 size={12}/> Đã xác minh</span>
                </div>

                <div className="border border-green-200 bg-green-50 p-5 rounded-2xl flex items-center justify-between">
                  <div className="flex gap-3 items-center">
                    <div className="bg-white p-2.5 rounded-lg text-green-600 shadow-sm"><Phone size={20}/></div>
                    <div>
                      <p className="font-bold text-gray-900">Số điện thoại</p>
                      <p className="text-xs text-gray-500 mt-0.5">{profileForm.phone || 'Chưa cập nhật'}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-green-700 bg-green-200 px-2.5 py-1 rounded flex items-center gap-1"><CheckCircle2 size={12}/> Đã xác minh</span>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </main>
    </div>
  );
}
