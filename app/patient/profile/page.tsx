'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Bell, Settings, User, Camera, Loader2
} from 'lucide-react';

import { getPatientSettingsData, updatePatientProfile } from '@/app/patient/settings/actions';
import PatientSidebar from '@/app/patient/Sidebar';

export default function PatientProfilePage() {
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // State cho Hồ sơ
  const [profileForm, setProfileForm] = useState<any>({
    fullName: '', email: '', phone: '', dob: '', gender: 'Nam', address: '', patientCode: '', avatar: '', cccd: ''
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

  // Xử lý Cập nhật Hồ Sơ
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const res = await updatePatientProfile(profileForm);
    setIsSaving(false);
    if (res.success) {
      alert(res.message);
    } else {
      alert(res.message);
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]"><Loader2 className="w-10 h-10 text-[#2563EB] animate-spin" /></div>;

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] font-sans text-gray-800 overflow-hidden">
      
      {/* SIDEBAR */}
      <PatientSidebar activePage="profile" />

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* TOP HEADER */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-8 shrink-0 z-10">
          <div className="flex items-center gap-4">
            <div className="bg-blue-50 p-2 rounded-lg"><User className="text-[#2563EB]" size={24}/></div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Thông tin cá nhân</h1>
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
          
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col relative max-w-4xl mx-auto">
            <form onSubmit={handleProfileSubmit} className="p-8 flex flex-col">
              <div className="border-b border-gray-100 pb-5 mb-6">
                <h2 className="text-2xl font-black text-gray-900">Hồ sơ cá nhân</h2>
                <p className="text-gray-500 text-sm mt-1">Cập nhật thông tin cá nhân và ảnh đại diện của bạn.</p>
              </div>

              <div className="flex flex-col md:flex-row gap-8 mb-8">
                <div className="flex flex-col items-center gap-3">
                  <div className="relative group cursor-pointer">
                    <img src={profileForm.avatar} alt="Avatar" className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover"/>
                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="text-white" size={24}/>
                    </div>
                  </div>
                  <button type="button" className="text-sm font-bold text-[#2563EB] hover:underline">Thay đổi ảnh</button>
                </div>
                
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Họ và tên</label>
                    <input value={profileForm.fullName} onChange={e => setProfileForm({...profileForm, fullName: e.target.value})} type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#2563EB] outline-none font-medium text-gray-900"/>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Mã bệnh nhân</label>
                    <input type="text" value={profileForm.patientCode} disabled className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-sm outline-none font-bold text-gray-500 cursor-not-allowed"/>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Email</label>
                    <input value={profileForm.email} onChange={e => setProfileForm({...profileForm, email: e.target.value})} type="email" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#2563EB] outline-none font-medium text-gray-900"/>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Số điện thoại</label>
                    <input value={profileForm.phone} onChange={e => setProfileForm({...profileForm, phone: e.target.value})} type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#2563EB] outline-none font-medium text-gray-900"/>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Ngày sinh</label>
                    <input value={profileForm.dob} onChange={e => setProfileForm({...profileForm, dob: e.target.value})} type="date" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#2563EB] outline-none font-medium text-gray-900"/>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Giới tính</label>
                    <select value={profileForm.gender} onChange={e => setProfileForm({...profileForm, gender: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#2563EB] outline-none font-medium text-gray-900">
                      <option value="Nam">Nam</option><option value="Nữ">Nữ</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Căn cước công dân</label>
                    <input value={profileForm.cccd} onChange={e => setProfileForm({...profileForm, cccd: e.target.value})} type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#2563EB] outline-none font-medium text-gray-900" placeholder="Số CCCD/CMND"/>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Địa chỉ hiện tại</label>
                    <input value={profileForm.address} onChange={e => setProfileForm({...profileForm, address: e.target.value})} type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#2563EB] outline-none font-medium text-gray-900"/>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-5 flex justify-end">
                <button disabled={isSaving} type="submit" className="bg-[#2563EB] text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-md transition-all flex items-center gap-2">
                  {isSaving ? <Loader2 size={18} className="animate-spin"/> : 'Lưu thay đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
