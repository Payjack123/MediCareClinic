'use client';

import React, { useState } from 'react';
import { 
  User, Mail, Phone, Calendar, MapPin, Shield, Lock, 
  Bell, Volume2, Printer, CheckCircle2, AlertCircle, Save, 
  Sparkles, Laptop, Smartphone, KeyRound, Check, RefreshCw, 
  Building2, Clock, VolumeX, Eye, EyeOff, Radio, Settings2, BadgeCheck
} from 'lucide-react';
import { 
  updateReceptionistProfile, 
  updateDeskPreferences, 
  updateReceptionistPassword 
} from './actions';

interface SettingsClientProps {
  initialUser: any;
  initialPreferences: any;
}

export default function SettingsClient({ initialUser, initialPreferences }: SettingsClientProps) {
  // Tabs
  const [activeTab, setActiveTab] = useState<'profile' | 'desk' | 'security' | 'notifications'>('profile');

  // Form states - Profile
  const [profileData, setProfileData] = useState({
    fullName: initialUser?.fullName || 'Nguyễn Thị Hương',
    email: initialUser?.email || 'receptionist@gmail.com',
    phone: initialUser?.phone || '0900000003',
    dob: initialUser?.dob || '1996-08-15',
    gender: initialUser?.gender || 'Nữ',
    address: initialUser?.address || 'Đống Đa, Hà Nội',
    avatar: initialUser?.avatar || ''
  });
  const [isProfileSaving, setIsProfileSaving] = useState(false);

  // Form states - Desk Preferences
  const [deskPreferences, setDeskPreferences] = useState({
    deskNumber: initialPreferences?.deskNumber || 'Quầy 01 - Tiếp đón & Phân luồng trung tâm',
    shift: initialPreferences?.shift || 'Ca Sáng (07:30 - 12:00)',
    employeeCode: initialPreferences?.employeeCode || 'LT-001',
    autoPrintTicket: initialPreferences?.autoPrintTicket ?? true,
    soundNewBooking: initialPreferences?.soundNewBooking ?? true,
    soundCallQueue: initialPreferences?.soundCallQueue ?? true,
    noShowAlertMinutes: initialPreferences?.noShowAlertMinutes || 15,
    emailDailyReport: initialPreferences?.emailDailyReport ?? true,
    voiceGender: initialPreferences?.voiceGender || 'female_north'
  });
  const [isDeskSaving, setIsDeskSaving] = useState(false);

  // Form states - Security
  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [isSecuritySaving, setIsSecuritySaving] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Toast feedback
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  // Synthesize clean medical chime using Web Audio API
  const playTestChime = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      const now = ctx.currentTime;
      // Note 1 (E5 - 659.25Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(659.25, now);
      gain1.gain.setValueAtTime(0.3, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.6);

      // Note 2 (C5 - 523.25Hz)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(523.25, now + 0.25);
      gain2.gain.setValueAtTime(0.3, now + 0.25);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.25);
      osc2.stop(now + 0.9);

      showToast('Đang phát chuông thử nghiệm tiếp đón!');
    } catch (e) {
      console.error(e);
    }
  };

  // Handle Save Profile
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProfileSaving(true);
    try {
      const res = await updateReceptionistProfile(profileData);
      if (res.success) {
        showToast(res.message);
      } else {
        showToast(res.message, 'error');
      }
    } catch (err) {
      showToast('Có lỗi xảy ra khi lưu hồ sơ', 'error');
    } finally {
      setIsProfileSaving(false);
    }
  };

  // Handle Save Desk Preferences
  const handleSaveDesk = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDeskSaving(true);
    try {
      const res = await updateDeskPreferences(deskPreferences);
      if (res.success) {
        showToast(res.message);
      } else {
        showToast(res.message, 'error');
      }
    } catch (err) {
      showToast('Có lỗi khi lưu cấu hình quầy', 'error');
    } finally {
      setIsDeskSaving(false);
    }
  };

  // Handle Password Change
  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (securityData.newPassword !== securityData.confirmPassword) {
      showToast('Mật khẩu mới và xác nhận mật khẩu không khớp!', 'error');
      return;
    }
    if (securityData.newPassword.length < 6) {
      showToast('Mật khẩu mới phải có ít nhất 6 ký tự!', 'error');
      return;
    }

    setIsSecuritySaving(true);
    try {
      const res = await updateReceptionistPassword(securityData);
      if (res.success) {
        showToast(res.message);
        setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        showToast(res.message, 'error');
      }
    } catch (err) {
      showToast('Có lỗi xảy ra khi đổi mật khẩu', 'error');
    } finally {
      setIsSecuritySaving(false);
    }
  };

  // Calculate password strength
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 6) score += 33;
    if (pwd.length >= 8 && /[A-Z]/.test(pwd)) score += 33;
    if (/[0-9]/.test(pwd) && /[^A-Za-z0-9]/.test(pwd)) score += 34;
    return Math.min(score, 100);
  };
  const pwdStrength = getPasswordStrength(securityData.newPassword);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-14 font-sans">
      {/* Toast popup */}
      {toast && (
        <div className={`fixed bottom-5 right-5 z-50 px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border text-white text-sm font-medium animate-fade-in ${
          toast.type === 'success' ? 'bg-slate-900 border-slate-700' : 'bg-rose-900 border-rose-700'
        }`}>
          {toast.type === 'success' ? (
            <Sparkles className="text-amber-400 w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="text-rose-400 w-5 h-5 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* 1. HERO USER PROFILE CARD */}
      <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-xs border border-gray-100 flex flex-col md:flex-row items-center md:items-start justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-blue-50/80 via-indigo-50/40 to-transparent rounded-full -mr-20 -mt-20 pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10 text-center sm:text-left">
          {/* Avatar with status indicator */}
          <div className="relative group">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center font-black text-3xl shadow-md shadow-blue-100 border-4 border-white overflow-hidden">
              {profileData.avatar ? (
                <img src={profileData.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                (profileData.fullName || 'LT').split(' ').slice(-2).map((n: string) => n[0]).join('')
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center" title="Trực tuyến">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
            </div>
          </div>

          {/* User Details */}
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                {profileData.fullName}
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                <BadgeCheck size={14} className="text-blue-600" />
                Lễ Tân Chính
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium">
              Mã NV: <strong className="text-gray-800">{deskPreferences.employeeCode}</strong> • Vị trí: Nhân viên Tiếp đón & Thu ngân Trung tâm
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-xs text-gray-600">
              <span className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                <Building2 size={13} className="text-blue-600" />
                {deskPreferences.deskNumber.split('-')[0].trim()}
              </span>
              <span className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                <Clock size={13} className="text-emerald-600" />
                {deskPreferences.shift.split('(')[0].trim()}
              </span>
              <span className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                <Mail size={13} className="text-indigo-600" />
                {profileData.email}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Badges */}
        <div className="flex flex-row md:flex-col items-center md:items-end justify-center gap-2 relative z-10 shrink-0">
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Đang trong ca trực
          </span>
          <span className="text-[11px] text-gray-400">
            Cập nhật lần cuối: Hôm nay
          </span>
        </div>
      </div>

      {/* 2. TAB CONTROLS */}
      <div className="bg-white rounded-2xl p-1.5 shadow-xs border border-gray-100 flex flex-wrap gap-1.5">
        {[
          { id: 'profile', label: 'Hồ Sơ Cá Nhân', icon: User },
          { id: 'desk', label: 'Cấu Hình Quầy Tiếp Đón', icon: Settings2 },
          { id: 'security', label: 'Bảo Mật & Mật Khẩu', icon: Lock },
          { id: 'notifications', label: 'Thông Báo & Âm Thanh', icon: Bell },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 min-w-[160px] py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. TAB 1: PROFILE INFORMATION */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-xs border border-gray-100">
          <div className="border-b border-gray-100 pb-4 mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <User size={20} className="text-blue-600" />
                Thông Tin Hồ Sơ Cá Nhân
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Cập nhật thông tin định danh và số liên lạc cá nhân của lễ tân
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Họ và tên */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                  <User size={13} className="text-gray-400" />
                  Họ và tên lễ tân
                </label>
                <input
                  type="text"
                  required
                  value={profileData.fullName}
                  onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                  placeholder="Nhập họ và tên..."
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                  <Mail size={13} className="text-gray-400" />
                  Địa chỉ Email
                </label>
                <input
                  type="email"
                  required
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                  placeholder="vidu@medicare.vn"
                />
              </div>

              {/* Số điện thoại */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                  <Phone size={13} className="text-gray-400" />
                  Số điện thoại liên hệ
                </label>
                <input
                  type="text"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                  placeholder="0901234567"
                />
              </div>

              {/* Ngày sinh */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                  <Calendar size={13} className="text-gray-400" />
                  Ngày sinh
                </label>
                <input
                  type="date"
                  value={profileData.dob}
                  onChange={(e) => setProfileData({ ...profileData, dob: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition cursor-pointer"
                />
              </div>

              {/* Giới tính */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">Giới tính</label>
                <div className="flex gap-4 pt-1">
                  {['Nữ', 'Nam'].map((g) => (
                    <label key={g} className="flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-800">
                      <input
                        type="radio"
                        name="gender"
                        value={g}
                        checked={profileData.gender === g}
                        onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span>{g}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Địa chỉ */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                  <MapPin size={13} className="text-gray-400" />
                  Địa chỉ thường trú / tạm trú
                </label>
                <input
                  type="text"
                  value={profileData.address}
                  onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                  placeholder="Quận Đống Đa, Hà Nội..."
                />
              </div>
            </div>

            {/* Avatar URL or Preset selection */}
            <div className="pt-2 border-t border-gray-100">
              <label className="text-xs font-bold text-gray-700 block mb-2">Ảnh đại diện (URL hoặc chọn mẫu)</label>
              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="url"
                  value={profileData.avatar}
                  onChange={(e) => setProfileData({ ...profileData, avatar: e.target.value })}
                  placeholder="Dán link ảnh đại diện (https://...)"
                  className="flex-1 min-w-[280px] px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setProfileData({ ...profileData, avatar: '' })}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition"
                >
                  Dùng chữ viết tắt
                </button>
              </div>
            </div>

            {/* Action Save Button */}
            <div className="pt-4 flex items-center justify-end gap-3">
              <button
                type="submit"
                disabled={isProfileSaving}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-200 flex items-center gap-2 active:scale-95 transition cursor-pointer disabled:opacity-50"
              >
                {isProfileSaving ? (
                  <RefreshCw size={15} className="animate-spin" />
                ) : (
                  <Save size={15} />
                )}
                <span>Lưu Thay Đổi Hồ Sơ</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 4. TAB 2: DESK PREFERENCES & WORKFLOWS */}
      {activeTab === 'desk' && (
        <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-xs border border-gray-100 space-y-6">
          <div className="border-b border-gray-100 pb-4 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Settings2 size={20} className="text-indigo-600" />
                Cấu Hình Quầy Tiếp Đón & Quy Trình
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Thiết lập vị trí quầy trực, ca làm việc và các tự động hóa khi phục vụ bệnh nhân
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveDesk} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Vị trí quầy làm việc */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                  <Building2 size={13} className="text-gray-400" />
                  Vị trí Quầy trực phân công
                </label>
                <select
                  value={deskPreferences.deskNumber}
                  onChange={(e) => setDeskPreferences({ ...deskPreferences, deskNumber: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="Quầy 01 - Tiếp đón & Phân luồng trung tâm">Quầy 01 - Tiếp đón & Phân luồng trung tâm</option>
                  <option value="Quầy 02 - Tiếp đón Ưu tiên & Khám BHYT">Quầy 02 - Tiếp đón Ưu tiên & Khám BHYT</option>
                  <option value="Quầy 03 - Quầy Cấp số & Tiếp nhận hồ sơ">Quầy 03 - Quầy Cấp số & Tiếp nhận hồ sơ</option>
                  <option value="Quầy 04 - Quầy Thu ngân & Thanh toán viện phí">Quầy 04 - Quầy Thu ngân & Thanh toán viện phí</option>
                </select>
                <p className="text-[11px] text-gray-400">Hiển thị trên màn hình điều hướng và phiếu khám của bệnh nhân</p>
              </div>

              {/* Ca trực */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                  <Clock size={13} className="text-gray-400" />
                  Ca trực mặc định
                </label>
                <select
                  value={deskPreferences.shift}
                  onChange={(e) => setDeskPreferences({ ...deskPreferences, shift: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="Ca Sáng (07:30 - 12:00)">Ca Sáng (07:30 - 12:00)</option>
                  <option value="Ca Chiều (13:00 - 17:30)">Ca Chiều (13:00 - 17:30)</option>
                  <option value="Ca Hành Chính (07:30 - 17:30)">Ca Hành Chính (07:30 - 17:30)</option>
                </select>
              </div>

              {/* Giọng đọc loa gọi số */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                  <Volume2 size={13} className="text-gray-400" />
                  Giọng đọc phát thanh gọi số hàng đợi
                </label>
                <select
                  value={deskPreferences.voiceGender}
                  onChange={(e) => setDeskPreferences({ ...deskPreferences, voiceGender: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="female_north">Giọng Nữ Miền Bắc (Chuẩn y tế)</option>
                  <option value="female_south">Giọng Nữ Miền Nam (Truyền cảm)</option>
                  <option value="chime_only">Chỉ dùng chuông Ding-Dong (Không đọc tên)</option>
                </select>
              </div>

              {/* Cảnh báo quá giờ hẹn */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                  <AlertCircle size={13} className="text-gray-400" />
                  Thời gian cảnh báo trễ hẹn (No-show alert)
                </label>
                <select
                  value={deskPreferences.noShowAlertMinutes}
                  onChange={(e) => setDeskPreferences({ ...deskPreferences, noShowAlertMinutes: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value={10}>Quá 10 phút chưa đến quầy</option>
                  <option value={15}>Quá 15 phút chưa đến quầy</option>
                  <option value={20}>Quá 20 phút chưa đến quầy</option>
                  <option value={30}>Quá 30 phút chưa đến quầy</option>
                </select>
              </div>
            </div>

            {/* Checkbox Toggles */}
            <div className="pt-4 border-t border-gray-100 space-y-4">
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Tự động hóa tại quầy
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Toggle 1: Auto Print */}
                <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-gray-50/80 border border-gray-200/60 hover:bg-gray-50 cursor-pointer transition">
                  <input
                    type="checkbox"
                    checked={deskPreferences.autoPrintTicket}
                    onChange={(e) => setDeskPreferences({ ...deskPreferences, autoPrintTicket: e.target.checked })}
                    className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                      <Printer size={13} className="text-blue-600" />
                      Tự động in phiếu số thứ tự khi Check-in
                    </span>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Gửi lệnh in nhiệt tự động đến máy in quầy ngay khi quét QR hoặc xác nhận
                    </p>
                  </div>
                </label>

                {/* Toggle 2: Sound Booking */}
                <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-gray-50/80 border border-gray-200/60 hover:bg-gray-50 cursor-pointer transition">
                  <input
                    type="checkbox"
                    checked={deskPreferences.soundNewBooking}
                    onChange={(e) => setDeskPreferences({ ...deskPreferences, soundNewBooking: e.target.checked })}
                    className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                      <Volume2 size={13} className="text-emerald-600" />
                      Âm báo khi có bệnh nhân đặt hẹn mới
                    </span>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Phát chuông thông báo nhẹ khi bệnh nhân đặt khám trực tuyến thành công
                    </p>
                  </div>
                </label>

                {/* Toggle 3: Sound Queue */}
                <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-gray-50/80 border border-gray-200/60 hover:bg-gray-50 cursor-pointer transition">
                  <input
                    type="checkbox"
                    checked={deskPreferences.soundCallQueue}
                    onChange={(e) => setDeskPreferences({ ...deskPreferences, soundCallQueue: e.target.checked })}
                    className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                      <Bell size={13} className="text-indigo-600" />
                      Chuông loa khi gọi số vào phòng khám
                    </span>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Đồng bộ âm thanh loa phòng chờ khi bấm nút "Gọi số tiếp theo"
                    </p>
                  </div>
                </label>

                {/* Toggle 4: Email Report */}
                <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-gray-50/80 border border-gray-200/60 hover:bg-gray-50 cursor-pointer transition">
                  <input
                    type="checkbox"
                    checked={deskPreferences.emailDailyReport}
                    onChange={(e) => setDeskPreferences({ ...deskPreferences, emailDailyReport: e.target.checked })}
                    className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                      <Mail size={13} className="text-purple-600" />
                      Gửi tóm tắt doanh thu quầy qua email
                    </span>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Tự động gửi bản sao chốt ca và biên bản bàn giao đến email cá nhân
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Test Sound Button & Save */}
            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={playTestChime}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer"
              >
                <Volume2 size={15} />
                Thử Âm Báo Quầy (Chime Test)
              </button>

              <button
                type="submit"
                disabled={isDeskSaving}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-200 flex items-center gap-2 active:scale-95 transition cursor-pointer disabled:opacity-50"
              >
                {isDeskSaving ? <RefreshCw size={15} className="animate-spin" /> : <Save size={15} />}
                <span>Lưu Cấu Hình Quầy</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 5. TAB 3: SECURITY & PASSWORD */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          {/* Password Change Card */}
          <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-xs border border-gray-100 space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Lock size={20} className="text-blue-600" />
                Đổi Mật Khẩu Đăng Nhập
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Nên cập nhật mật khẩu định kỳ để bảo vệ tài khoản quầy thu ngân và dữ liệu bệnh nhân
              </p>
            </div>

            <form onSubmit={handleSavePassword} className="space-y-4 max-w-lg">
              {/* Mật khẩu hiện tại */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">Mật khẩu hiện tại</label>
                <div className="relative">
                  <input
                    type={showPassword.current ? 'text' : 'password'}
                    required
                    value={securityData.currentPassword}
                    onChange={(e) => setSecurityData({ ...securityData, currentPassword: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                    placeholder="Nhập mật khẩu đang dùng..."
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword.current ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Mật khẩu mới */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">Mật khẩu mới</label>
                <div className="relative">
                  <input
                    type={showPassword.new ? 'text' : 'password'}
                    required
                    value={securityData.newPassword}
                    onChange={(e) => setSecurityData({ ...securityData, newPassword: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                    placeholder="Tối thiểu 6 ký tự..."
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword.new ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {/* Password strength meter */}
                {securityData.newPassword && (
                  <div className="space-y-1 pt-1">
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${pwdStrength}%` }}
                        className={`h-full transition-all duration-300 ${
                          pwdStrength < 50 ? 'bg-rose-500' : pwdStrength < 80 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-gray-500">
                      Độ mạnh: {pwdStrength < 50 ? 'Yếu' : pwdStrength < 80 ? 'Trung bình' : 'Mạnh'}
                    </span>
                  </div>
                )}
              </div>

              {/* Xác nhận mật khẩu mới */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">Xác nhận mật khẩu mới</label>
                <div className="relative">
                  <input
                    type={showPassword.confirm ? 'text' : 'password'}
                    required
                    value={securityData.confirmPassword}
                    onChange={(e) => setSecurityData({ ...securityData, confirmPassword: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                    placeholder="Nhập lại mật khẩu mới..."
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword.confirm ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSecuritySaving}
                className="mt-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSecuritySaving ? <RefreshCw size={14} className="animate-spin" /> : <KeyRound size={14} />}
                <span>Cập Nhật Mật Khẩu Mới</span>
              </button>
            </form>
          </div>

          {/* 2FA & Login Sessions Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 2FA */}
            <div className="bg-white rounded-3xl p-6 shadow-xs border border-gray-100 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                    <Shield size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-900">Xác thực 2 yếu tố (2FA)</h3>
                    <p className="text-xs text-gray-500">Bảo mật mã OTP qua Google Authenticator</p>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-3 leading-relaxed">
                  Bảo vệ quầy thanh toán của bạn bằng việc yêu cầu mã xác thực 6 số mỗi khi đăng nhập trên thiết bị lạ.
                </p>
              </div>

              <div className="pt-6 flex items-center justify-between">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  twoFactorEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                }`}>
                  {twoFactorEnabled ? 'Đang kích hoạt' : 'Chưa kích hoạt'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setTwoFactorEnabled(!twoFactorEnabled);
                    showToast(!twoFactorEnabled ? 'Đã kích hoạt xác thực 2 bước 2FA' : 'Đã tắt xác thực 2 bước');
                  }}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  {twoFactorEnabled ? 'Tắt 2FA' : 'Kích hoạt ngay'}
                </button>
              </div>
            </div>

            {/* Active Devices */}
            <div className="bg-white rounded-3xl p-6 shadow-xs border border-gray-100 space-y-4">
              <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                <Laptop size={18} className="text-blue-600" />
                Phiên Đăng Nhập Đang Hoạt Động
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50/50 border border-blue-100">
                  <div className="flex items-center gap-2.5">
                    <Laptop size={16} className="text-blue-600" />
                    <div>
                      <p className="font-bold text-gray-900">Máy tính Quầy 01 (Chrome - Windows)</p>
                      <p className="text-[11px] text-gray-500">Địa chỉ IP: 192.168.1.45 • Hiện tại</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-100/60 px-2 py-0.5 rounded-full">
                    Đang dùng
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-200/60">
                  <div className="flex items-center gap-2.5">
                    <Smartphone size={16} className="text-gray-500" />
                    <div>
                      <p className="font-bold text-gray-800">Điện thoại iPhone (Safari - iOS)</p>
                      <p className="text-[11px] text-gray-500">Hà Nội • Hoạt động 2 ngày trước</p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => showToast('Đã đăng xuất khỏi các thiết bị khác')}
                className="w-full py-2 bg-gray-50 hover:bg-rose-50 text-gray-600 hover:text-rose-600 rounded-xl text-xs font-bold border border-gray-200 hover:border-rose-200 transition cursor-pointer"
              >
                Đăng xuất khỏi các thiết bị khác
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. TAB 4: NOTIFICATIONS & SYSTEM PREFERENCES */}
      {activeTab === 'notifications' && (
        <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-xs border border-gray-100 space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Bell size={20} className="text-amber-500" />
              Tùy Chọn Thông Báo & Hệ Thống
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Cài đặt cách thức nhận cảnh báo bệnh nhân, âm thanh thông báo và báo cáo tự động
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                title: 'Âm thanh thông báo khi có lịch hẹn mới',
                desc: 'Phát âm thanh chuông nhẹ trên máy tính khi có bệnh nhân đặt hẹn trực tuyến.',
                enabled: true
              },
              {
                title: 'Cảnh báo bệnh nhân chờ quá 20 phút',
                desc: 'Hiển thị badge màu đỏ nhắc nhở lễ tân hỗ trợ bệnh nhân chưa được vào khám.',
                enabled: true
              },
              {
                title: 'Thông báo hóa đơn chưa thanh toán',
                desc: 'Nhắc nhở quầy thu ngân khi bác sĩ hoàn thành khám và chỉ định viện phí.',
                enabled: true
              },
              {
                title: 'Báo cáo tổng kết ca trực qua email',
                desc: 'Tự động gửi email biên bản bàn giao và bảng kê thu phí sau khi chốt ca.',
                enabled: deskPreferences.emailDailyReport
              }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50/70 border border-gray-100">
                <div>
                  <h4 className="text-xs font-bold text-gray-900">{item.title}</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">{item.desc}</p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked={item.enabled}
                  onChange={() => showToast('Đã lưu tùy chọn thông báo!')}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                />
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
            <button
              type="button"
              onClick={playTestChime}
              className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer"
            >
              <Volume2 size={16} />
              Thử Nghiệm Âm Thanh Chuông Báo
            </button>

            <button
              type="button"
              onClick={() => showToast('Tất cả cài đặt thông báo đã được lưu!')}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-md shadow-blue-200 cursor-pointer"
            >
              Lưu Tùy Chọn Thông Báo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
