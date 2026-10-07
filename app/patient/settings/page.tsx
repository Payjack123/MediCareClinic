'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, CalendarDays, FileText, Pill, TestTube, 
  Bell, Settings, LogOut, Search, Activity, User, Wallet, 
  ShieldCheck, Lock, Smartphone, Monitor, AlertTriangle, 
  Camera, CheckCircle2, Mail, Phone, Trash2, KeyRound, Loader2
} from 'lucide-react';

import { getPatientSettingsData, updatePatientProfile, updatePatientPassword } from '@/app/patient/settings/actions';
import PatientSidebar from '@/app/patient/Sidebar';

export default function PatientSettingsPage() {
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  // State cho Hồ sơ
  const [profileForm, setProfileForm] = useState<any>({
    fullName: '', email: '', phone: '', dob: '', gender: 'Nam', address: '', patientCode: '', avatar: '', cccd: ''
  });

  // State cho Mật khẩu
  const [passForm, setPassForm] = useState({
    currentPassword: '', newPassword: '', confirmPassword: ''
  });

  // State Tắt/Bật thông báo (Mock UI)
  const [notiSettings, setNotiSettings] = useState({
    appointment: true, labResult: true, prescription: true, billing: false, email: true, sms: true
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

  const handleLogout = () => {
    router.push('/login');
  };

  const toggleNoti = (key: keyof typeof notiSettings) => {
    setNotiSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

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
      
      {/* ==========================================
          SIDEBAR
      ========================================== */}
      <PatientSidebar activePage="settings" />

      {/* ==========================================
          MAIN CONTENT AREA
      ========================================== */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* TOP HEADER */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-8 shrink-0 z-10">
          <div className="flex items-center gap-4">
            <div className="bg-blue-50 p-2 rounded-lg"><Settings className="text-[#2563EB]" size={24}/></div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Cài đặt Cá nhân</h1>
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
              <img src={profileForm.avatar} alt="Avatar" className="w-11 h-11 rounded-full border-2 border-white shadow-sm group-hover:shadow-md transition"/>
            </div>
          </div>
        </header>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 animate-in fade-in duration-500">
          
          {/* DASHBOARD MINI */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0"><User size={24}/></div>
              <div><p className="text-xs text-gray-500 font-bold uppercase">Tài khoản</p><p className="text-lg font-black text-gray-900 mt-0.5">Bệnh nhân</p></div>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0"><ShieldCheck size={24}/></div>
              <div><p className="text-xs text-gray-500 font-bold uppercase">Bảo mật</p><p className="text-lg font-black text-green-600 mt-0.5">An toàn</p></div>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0"><Smartphone size={24}/></div>
              <div><p className="text-xs text-gray-500 font-bold uppercase">Thiết bị</p><p className="text-lg font-black text-gray-900 mt-0.5">1</p></div>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0"><Bell size={24}/></div>
              <div><p className="text-xs text-gray-500 font-bold uppercase">Thông báo</p><p className="text-lg font-black text-gray-900 mt-0.5">Đang bật</p></div>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 col-span-2 md:col-span-4 lg:col-span-1">
              <div className="w-12 h-12 rounded-xl bg-gray-50 text-gray-600 flex items-center justify-center shrink-0"><Activity size={24}/></div>
              <div><p className="text-xs text-gray-500 font-bold uppercase">Trạng thái</p><p className="text-lg font-black text-[#2563EB] mt-0.5">Hoạt động</p></div>
            </div>
          </div>

          {/* MASTER-DETAIL TABS LAYOUT */}
          <div className="flex flex-col xl:flex-row gap-8 h-[calc(100vh-280px)] min-h-[600px]">
            
            {/* CỘT TRÁI: Dịch vụ Tabs */}
            <div className="xl:w-[25%] flex flex-col gap-2 shrink-0">
              {[
                { id: 'profile', label: 'Hồ sơ cá nhân', icon: User },
                { id: 'security', label: 'Bảo mật & Mật khẩu', icon: Lock },
                { id: 'notifications', label: 'Cài đặt thông báo', icon: Bell },
                { id: 'devices', label: 'Thiết bị đăng nhập', icon: Monitor },
                { id: 'privacy', label: 'Quyền riêng tư', icon: ShieldCheck, isDanger: true },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-5 py-4 rounded-2xl font-bold transition-all text-sm w-full text-left
                    ${activeTab === tab.id 
                      ? tab.isDanger ? 'bg-red-50 text-red-600 border border-red-200 shadow-sm' : 'bg-white text-[#2563EB] border border-blue-200 shadow-sm' 
                      : 'bg-transparent text-gray-600 hover:bg-white hover:border-gray-200 border border-transparent'
                    }`}
                >
                  <tab.icon size={20}/> {tab.label}
                </button>
              ))}
            </div>

            {/* CỘT PHẢI: Nội dung chi tiết Tab */}
            <div className="xl:w-[75%] bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col relative overflow-hidden">
              
              {/* TAB 1: HỒ SƠ CÁ NHÂN */}
              {activeTab === 'profile' && (
                <form onSubmit={handleProfileSubmit} className="p-8 h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 overflow-y-auto custom-scrollbar">
                  <div className="border-b border-gray-100 pb-5 mb-6">
                    <h2 className="text-2xl font-black text-gray-900">Hồ sơ cá nhân</h2>
                    <p className="text-gray-500 text-sm mt-1">Cập nhật thông tin cá nhân và ảnh đại diện của bạn.</p>
                  </div>

                  <div className="flex flex-col md:flex-row gap-8 mb-8">
                    <div className="flex flex-col items-center gap-3">
                      <div className="relative group cursor-pointer">
                        <img src={profileForm.avatar} alt="Avatar" className="w-32 h-32 rounded-full border-4 border-white shadow-md"/>
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

                  <div className="mt-auto border-t border-gray-100 pt-5 flex justify-end">
                    <button disabled={isSaving} type="submit" className="bg-[#2563EB] text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-md transition-all flex items-center gap-2">
                      {isSaving ? <Loader2 size={18} className="animate-spin"/> : 'Lưu thay đổi'}
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 2: BẢO MẬT & MẬT KHẨU */}
              {activeTab === 'security' && (
                <div className="p-8 h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 overflow-y-auto custom-scrollbar">
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
                        <button disabled={isSaving} type="submit" className="w-full bg-[#2563EB] text-white py-3 rounded-xl font-bold hover:bg-blue-700 shadow-sm transition-all mt-2 flex justify-center">
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
                            <p className="text-xs text-gray-500 mt-0.5">{profileForm.email}</p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-green-700 bg-green-200 px-2.5 py-1 rounded flex items-center gap-1"><CheckCircle2 size={12}/> Đã xác minh</span>
                      </div>

                      <div className="border border-green-200 bg-green-50 p-5 rounded-2xl flex items-center justify-between">
                        <div className="flex gap-3 items-center">
                          <div className="bg-white p-2.5 rounded-lg text-green-600 shadow-sm"><Phone size={20}/></div>
                          <div>
                            <p className="font-bold text-gray-900">Số điện thoại</p>
                            <p className="text-xs text-gray-500 mt-0.5">{profileForm.phone}</p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-green-700 bg-green-200 px-2.5 py-1 rounded flex items-center gap-1"><CheckCircle2 size={12}/> Đã xác minh</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: CÀI ĐẶT THÔNG BÁO (Mock UI) */}
              {activeTab === 'notifications' && (
                <div className="p-8 h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 overflow-y-auto custom-scrollbar">
                  <div className="border-b border-gray-100 pb-5 mb-6">
                    <h2 className="text-2xl font-black text-gray-900">Cài đặt Thông báo</h2>
                    <p className="text-gray-500 text-sm mt-1">Chọn loại thông báo bạn muốn nhận từ hệ thống.</p>
                  </div>

                  <div className="max-w-2xl space-y-6">
                    <div>
                      <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Thông báo trong ứng dụng</h3>
                      <div className="border border-gray-200 rounded-2xl overflow-hidden divide-y divide-gray-100">
                        <div className="p-4 flex justify-between items-center bg-white hover:bg-gray-50 transition cursor-pointer" onClick={() => toggleNoti('appointment')}>
                          <div><p className="font-bold text-gray-900">Nhắc lịch khám & Tái khám</p><p className="text-xs text-gray-500 mt-0.5">Nhận thông báo trước 1 ngày và trước 2 giờ.</p></div>
                          <div className={`w-11 h-6 rounded-full relative transition-colors duration-300 ${notiSettings.appointment ? 'bg-[#2563EB]' : 'bg-gray-300'}`}><div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-300 ${notiSettings.appointment ? 'translate-x-6' : 'translate-x-1'}`}></div></div>
                        </div>
                        <div className="p-4 flex justify-between items-center bg-white hover:bg-gray-50 transition cursor-pointer" onClick={() => toggleNoti('labResult')}>
                          <div><p className="font-bold text-gray-900">Có kết quả xét nghiệm mới</p><p className="text-xs text-gray-500 mt-0.5">Thông báo ngay khi bác sĩ trả kết quả.</p></div>
                          <div className={`w-11 h-6 rounded-full relative transition-colors duration-300 ${notiSettings.labResult ? 'bg-[#2563EB]' : 'bg-gray-300'}`}><div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-300 ${notiSettings.labResult ? 'translate-x-6' : 'translate-x-1'}`}></div></div>
                        </div>
                        <div className="p-4 flex justify-between items-center bg-white hover:bg-gray-50 transition cursor-pointer" onClick={() => toggleNoti('prescription')}>
                          <div><p className="font-bold text-gray-900">Đơn thuốc & Nhắc uống thuốc</p><p className="text-xs text-gray-500 mt-0.5">Thông báo khi có đơn mới và nhắc giờ uống thuốc.</p></div>
                          <div className={`w-11 h-6 rounded-full relative transition-colors duration-300 ${notiSettings.prescription ? 'bg-[#2563EB]' : 'bg-gray-300'}`}><div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-300 ${notiSettings.prescription ? 'translate-x-6' : 'translate-x-1'}`}></div></div>
                        </div>
                        <div className="p-4 flex justify-between items-center bg-white hover:bg-gray-50 transition cursor-pointer" onClick={() => toggleNoti('billing')}>
                          <div><p className="font-bold text-gray-900">Nhắc nhở thanh toán viện phí</p><p className="text-xs text-gray-500 mt-0.5">Thông báo hóa đơn chưa thanh toán hoặc quá hạn.</p></div>
                          <div className={`w-11 h-6 rounded-full relative transition-colors duration-300 ${notiSettings.billing ? 'bg-[#2563EB]' : 'bg-gray-300'}`}><div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-300 ${notiSettings.billing ? 'translate-x-6' : 'translate-x-1'}`}></div></div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Kênh thông báo khác</h3>
                      <div className="border border-gray-200 rounded-2xl overflow-hidden divide-y divide-gray-100">
                        <div className="p-4 flex justify-between items-center bg-white hover:bg-gray-50 transition cursor-pointer" onClick={() => toggleNoti('email')}>
                          <div className="flex items-center gap-3"><Mail size={20} className="text-gray-400"/><p className="font-bold text-gray-900">Nhận qua Email</p></div>
                          <div className={`w-11 h-6 rounded-full relative transition-colors duration-300 ${notiSettings.email ? 'bg-green-500' : 'bg-gray-300'}`}><div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-300 ${notiSettings.email ? 'translate-x-6' : 'translate-x-1'}`}></div></div>
                        </div>
                        <div className="p-4 flex justify-between items-center bg-white hover:bg-gray-50 transition cursor-pointer" onClick={() => toggleNoti('sms')}>
                          <div className="flex items-center gap-3"><Smartphone size={20} className="text-gray-400"/><p className="font-bold text-gray-900">Nhận qua SMS (Khuyên dùng)</p></div>
                          <div className={`w-11 h-6 rounded-full relative transition-colors duration-300 ${notiSettings.sms ? 'bg-green-500' : 'bg-gray-300'}`}><div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-300 ${notiSettings.sms ? 'translate-x-6' : 'translate-x-1'}`}></div></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: THIẾT BỊ ĐĂNG NHẬP (Mock UI) */}
              {activeTab === 'devices' && (
                <div className="p-8 h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 overflow-y-auto custom-scrollbar">
                  <div className="border-b border-gray-100 pb-5 mb-6 flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-black text-gray-900">Thiết bị & Phiên đăng nhập</h2>
                      <p className="text-gray-500 text-sm mt-1">Quản lý các thiết bị đang đăng nhập tài khoản của bạn.</p>
                    </div>
                    <button className="bg-red-50 text-red-600 px-4 py-2 rounded-xl font-bold text-sm hover:bg-red-100 transition hidden md:block">
                      Đăng xuất tất cả thiết bị khác
                    </button>
                  </div>

                  <div className="space-y-4 max-w-3xl">
                    <div className="border border-[#2563EB] bg-blue-50/30 p-5 rounded-2xl flex items-center justify-between shadow-sm relative overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#2563EB]"></div>
                      <div className="flex gap-4 items-center">
                        <div className="w-12 h-12 bg-white text-[#2563EB] rounded-xl flex items-center justify-center shadow-sm border border-blue-100"><Monitor size={24}/></div>
                        <div>
                          <p className="font-bold text-gray-900">Máy tính (Trình duyệt Web)</p>
                          <p className="text-sm text-gray-500 mt-0.5">IP: 192.168.1.100 • Hà Nội, Việt Nam</p>
                          <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-bold text-green-700 bg-green-100 border border-green-200">Thiết bị hiện tại</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: QUYỀN RIÊNG TƯ (DANGER ZONE) */}
              {activeTab === 'privacy' && (
                <div className="p-8 h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 overflow-y-auto custom-scrollbar">
                  <div className="border-b border-gray-100 pb-5 mb-6">
                    <h2 className="text-2xl font-black text-gray-900">Quyền riêng tư & Dữ liệu</h2>
                    <p className="text-gray-500 text-sm mt-1">Quản lý cách dữ liệu của bạn được sử dụng trong hệ thống.</p>
                  </div>

                  <div className="max-w-2xl space-y-8">
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">Trích xuất dữ liệu</h3>
                      <p className="text-sm text-gray-600 mb-4">Bạn có thể yêu cầu tải xuống toàn bộ dữ liệu khám chữa bệnh, lịch sử giao dịch và thông tin cá nhân dưới định dạng PDF/CSV.</p>
                      <button className="bg-gray-100 border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-200 transition">Yêu cầu trích xuất</button>
                    </div>

                    <div className="border-t border-gray-200 pt-8">
                      <div className="border-2 border-red-200 bg-red-50 rounded-2xl p-6">
                        <h3 className="font-black text-red-700 mb-2 flex items-center gap-2 text-lg"><AlertTriangle size={20}/> Khu vực nguy hiểm (Xóa tài khoản)</h3>
                        <p className="text-sm text-red-900/80 mb-6 leading-relaxed">
                          Hành động này sẽ xóa vĩnh viễn tài khoản, hồ sơ bệnh án và lịch sử giao dịch của bạn khỏi hệ thống. Vì lý do y tế, yêu cầu này cần được quản trị viên phê duyệt. <strong>Dữ liệu không thể khôi phục sau khi xóa.</strong>
                        </p>
                        <button className="bg-red-600 text-white px-5 py-3 rounded-xl font-bold text-sm hover:bg-red-700 shadow-sm transition-all flex items-center gap-2">
                          <Trash2 size={16}/> Gửi yêu cầu xóa tài khoản
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </main>

    </div>
  );
}