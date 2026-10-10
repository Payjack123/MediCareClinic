'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowRight, UserCircle2, Info } from 'lucide-react';
import { getPatientSettingsData, updatePatientProfile } from '@/app/patient/settings/actions';
import { toast } from 'react-hot-toast';

export default function CompleteProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [profileForm, setProfileForm] = useState<any>({
    fullName: '', phone: '', dob: '', gender: 'Nam', address: '', cccd: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const res = await getPatientSettingsData();
      if (res.success && res.data) {
        setProfileForm({
          ...res.data,
          gender: res.data.gender || 'Nam',
        });
      } else {
        router.push('/login');
      }
      setIsLoading(false);
    };
    fetchData();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileForm.fullName || !profileForm.phone || !profileForm.dob || !profileForm.cccd || !profileForm.address) {
      toast.error('Vui lòng điền đầy đủ tất cả thông tin!');
      return;
    }

    setIsSaving(true);
    const res = await updatePatientProfile(profileForm);
    setIsSaving(false);
    if (res.success) {
      toast.success('Cập nhật hồ sơ thành công!');
      router.push('/patient/appointments');
    } else {
      toast.error(res.message);
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]"><Loader2 className="w-10 h-10 text-[#2563EB] animate-spin" /></div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] font-sans text-gray-800 p-4">
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 max-w-2xl w-full animate-in zoom-in-95 duration-500">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 text-[#2563EB] rounded-full flex items-center justify-center mx-auto mb-4">
            <UserCircle2 size={32} />
          </div>
          <h1 className="text-3xl font-black text-gray-900">Hoàn tất hồ sơ cá nhân</h1>
          <p className="text-gray-500 mt-2">Vui lòng bổ sung đầy đủ thông tin trước khi đặt lịch khám để chúng tôi có thể phục vụ bạn tốt nhất.</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3 mb-8">
          <Info size={20} className="text-[#2563EB] shrink-0 mt-0.5" />
          <p className="text-sm font-medium text-blue-900">Họ tên, Số điện thoại, Ngày sinh, Giới tính, CCCD và Địa chỉ là thông tin bắt buộc để tạo hồ sơ khám bệnh chuẩn Bộ Y tế.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Họ và tên *</label>
              <input value={profileForm.fullName} onChange={e => setProfileForm({...profileForm, fullName: e.target.value})} type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#2563EB] outline-none font-medium text-gray-900" placeholder="Nhập họ và tên" required />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Số điện thoại *</label>
              <input value={profileForm.phone} onChange={e => setProfileForm({...profileForm, phone: e.target.value})} type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#2563EB] outline-none font-medium text-gray-900" placeholder="Nhập số điện thoại" required />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Ngày sinh *</label>
              <input value={profileForm.dob} onChange={e => setProfileForm({...profileForm, dob: e.target.value})} type="date" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#2563EB] outline-none font-medium text-gray-900" required />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Giới tính *</label>
              <select value={profileForm.gender} onChange={e => setProfileForm({...profileForm, gender: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#2563EB] outline-none font-medium text-gray-900">
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Số CCCD / Mã định danh *</label>
              <input value={profileForm.cccd} onChange={e => setProfileForm({...profileForm, cccd: e.target.value})} type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#2563EB] outline-none font-medium text-gray-900" placeholder="Nhập số Căn cước công dân" required />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Địa chỉ hiện tại *</label>
              <input value={profileForm.address} onChange={e => setProfileForm({...profileForm, address: e.target.value})} type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#2563EB] outline-none font-medium text-gray-900" placeholder="Nhập địa chỉ cư trú đầy đủ" required />
            </div>
          </div>

          <button disabled={isSaving || !profileForm.fullName || !profileForm.phone || !profileForm.dob || !profileForm.cccd || !profileForm.address} type="submit" className="w-full bg-[#2563EB] hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-8">
            {isSaving ? <Loader2 size={20} className="animate-spin"/> : <ArrowRight size={20} />}
            {isSaving ? 'Đang lưu...' : 'Hoàn tất & Tiếp tục đặt lịch'}
          </button>
          
          <button type="button" onClick={() => router.push('/patient/dashboard')} className="w-full text-gray-500 font-bold hover:text-gray-800 transition text-sm py-2">
            Quay lại trang chủ
          </button>
        </form>
      </div>
    </div>
  );
}
