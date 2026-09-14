'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Bell, User, Clock, ArrowLeft, Save, Loader2, Stethoscope, Mail, Phone, Hash, Award
} from 'lucide-react';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

import Sidebar from '@/app/admin/Sidebar';
import { createDoctor } from '@/app/admin/doctors/actions';

export default function AddDoctorPage() {
  const router = useRouter();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    doctorCode: '',
    specialty: '',
    degree: '',
    experience: '',
    certificateNumber: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.fullName || !formData.phone || !formData.specialty || !formData.doctorCode) {
      toast.error('Vui lòng điền đầy đủ các thông tin bắt buộc (*)');
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading('Đang lưu thông tin...');

    const res = await createDoctor(formData);
    
    if (res.success) {
      toast.success(res.message, { id: toastId });
      router.push('/admin/doctors');
    } else {
      toast.error(res.message, { id: toastId });
      setIsSubmitting(false);
    }
  };

  const currentDateTime = dayjs().format('DD/MM/YYYY HH:mm');

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans text-slate-800 overflow-hidden">
      
      <Sidebar />

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* TOP HEADER */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 z-10 shadow-sm">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Stethoscope className="text-blue-600"/> Thêm Bác sĩ mới
            </h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-sm font-medium text-slate-500 bg-slate-100 px-4 py-2 rounded-full border border-slate-200 flex items-center gap-2">
              <Clock size={16}/> {currentDateTime}
            </div>
            
            <div className="flex items-center gap-4 pl-6 border-l border-slate-200">
              <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition">
                <Bell size={20}/>
              </button>
              <div className="flex items-center gap-3 cursor-pointer group">
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Admin</p>
                  <p className="text-xs text-slate-500">Super Admin</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold border-2 border-white shadow-sm group-hover:bg-blue-600 transition-colors">
                  AD
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto p-8 animate-in fade-in duration-500">
          
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <Link href="/admin/doctors" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold transition-colors">
                <ArrowLeft size={20}/> Quay lại danh sách
              </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* THÔNG TIN CÁ NHÂN */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                  <User className="text-blue-500"/> Thông tin cá nhân
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Họ và tên <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <input 
                        type="text" 
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="VD: Nguyễn Văn A"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                      />
                      <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Số điện thoại <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <input 
                        type="text" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="VD: 0987654321"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                      />
                      <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Email (Nếu có)</label>
                    <div className="relative">
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="VD: bacsi@phongkham.com"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                      />
                      <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                    </div>
                  </div>
                </div>
              </div>

              {/* THÔNG TIN CHUYÊN MÔN */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                  <Award className="text-emerald-500"/> Thông tin chuyên môn
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Mã bác sĩ <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <input 
                        type="text" 
                        name="doctorCode"
                        value={formData.doctorCode}
                        onChange={handleChange}
                        placeholder="VD: BS001"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                      />
                      <Hash size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Chuyên khoa <span className="text-red-500">*</span></label>
                    <select 
                      name="specialty"
                      value={formData.specialty}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                    >
                      <option value="">Chọn khoa</option>
                      <option value="Nội tổng quát">Nội tổng quát</option>
                      <option value="Ngoại khoa">Ngoại khoa</option>
                      <option value="Nhi khoa">Nhi khoa</option>
                      <option value="Sản phụ khoa">Sản phụ khoa</option>
                      <option value="Tai Mũi Họng">Tai Mũi Họng</option>
                      <option value="Răng Hàm Mặt">Răng Hàm Mặt</option>
                      <option value="Da liễu">Da liễu</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Trình độ chuyên môn</label>
                    <input 
                      type="text" 
                      name="degree"
                      value={formData.degree}
                      onChange={handleChange}
                      placeholder="VD: Thạc sĩ, Bác sĩ CKI..."
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Số năm kinh nghiệm</label>
                    <input 
                      type="text" 
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      placeholder="VD: 5 năm"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Số chứng chỉ hành nghề</label>
                    <input 
                      type="text" 
                      name="certificateNumber"
                      value={formData.certificateNumber}
                      onChange={handleChange}
                      placeholder="VD: 123456/CCHN"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* THÔNG TIN HỆ THỐNG */}
              <div className="bg-slate-100 p-6 rounded-2xl border border-slate-200">
                <h3 className="text-sm font-bold text-slate-700 mb-2">Thông tin tài khoản (Tự động)</h3>
                <p className="text-sm text-slate-500 mb-4">
                  Tài khoản đăng nhập sẽ được tạo tự động khi bạn lưu.
                  Bác sĩ có thể đăng nhập bằng Số điện thoại (hoặc Email) với mật khẩu mặc định là Số điện thoại của họ.
                </p>
                <div className="flex gap-4">
                  <span className="px-3 py-1.5 bg-slate-200 text-slate-600 rounded-lg text-xs font-bold">Vai trò: BÁC SĨ</span>
                  <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold">Trạng thái: Hoạt động</span>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <button 
                  type="button" 
                  onClick={() => router.push('/admin/doctors')}
                  className="px-6 py-3 bg-white border border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition"
                >
                  Hủy bỏ
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-md hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-70"
                >
                  {isSubmitting ? <Loader2 size={20} className="animate-spin"/> : <Save size={20}/>}
                  Lưu Bác sĩ
                </button>
              </div>

            </form>

          </div>

        </div>
      </main>
    </div>
  );
}
