'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Bell, User, Clock, ArrowLeft, Save, Loader2, Users, Mail, Phone, Hash, CreditCard, Shield, MapPin, Calendar
} from 'lucide-react';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

import Sidebar from '@/app/admin/Sidebar';
import { createPatient } from '@/app/admin/patients/actions';

export default function AddPatientPage() {
  const router = useRouter();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    patientCode: '',
    gender: 'Nam',
    dob: '',
    address: '',
    cccd: '',
    bhyt: '',
    insurance: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.phone) {
      toast.error('Vui lòng điền đầy đủ Họ tên và Số điện thoại');
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading('Đang lưu thông tin...');

    const res = await createPatient(formData);
    
    if (res.success) {
      toast.success(res.message, { id: toastId });
      router.push('/admin/patients');
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
              <Users className="text-blue-600"/> Thêm Bệnh nhân mới
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
              <Link href="/admin/patients" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold transition-colors">
                <ArrowLeft size={20}/> Quay lại danh sách
              </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* THÔNG TIN CÁ NHÂN */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                  <User className="text-blue-500"/> Thông tin hành chính
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Mã bệnh nhân</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        name="patientCode"
                        value={formData.patientCode}
                        onChange={handleChange}
                        placeholder="Để trống để hệ thống tự tạo (VD: BN00125)"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                      />
                      <Hash size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                    </div>
                  </div>

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

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Ngày sinh</label>
                    <div className="relative">
                      <input 
                        type="date" 
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none transition-all"
                      />
                      <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Giới tính</label>
                    <select 
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none transition-all"
                    >
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Căn cước công dân</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        name="cccd"
                        value={formData.cccd}
                        onChange={handleChange}
                        placeholder="Số CCCD/CMND"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none transition-all"
                      />
                      <CreditCard size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
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
                        placeholder="Để trống nếu không có"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none transition-all"
                      />
                      <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Địa chỉ</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Số nhà, đường, phường/xã, quận/huyện..."
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none transition-all"
                      />
                      <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                    </div>
                  </div>
                </div>
              </div>

              {/* THÔNG TIN BHYT */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                  <Shield className="text-emerald-500"/> Thông tin Bảo hiểm Y tế (Tuỳ chọn)
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Mã thẻ BHYT</label>
                    <input 
                      type="text" 
                      name="bhyt"
                      value={formData.bhyt}
                      onChange={handleChange}
                      placeholder="VD: GD483920..."
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Nơi đăng ký KCB Ban đầu</label>
                    <input 
                      type="text" 
                      name="insurance"
                      value={formData.insurance}
                      onChange={handleChange}
                      placeholder="Tên bệnh viện / trung tâm y tế..."
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* THÔNG TIN HỆ THỐNG */}
              <div className="bg-slate-100 p-6 rounded-2xl border border-slate-200">
                <h3 className="text-sm font-bold text-slate-700 mb-2">Thông tin tài khoản</h3>
                <p className="text-sm text-slate-500 mb-4">
                  Bệnh nhân có thể đăng nhập ứng dụng bằng Số điện thoại (hoặc Email) với mật khẩu mặc định là Số điện thoại của họ.
                </p>
                <div className="flex gap-4">
                  <span className="px-3 py-1.5 bg-slate-200 text-slate-600 rounded-lg text-xs font-bold">Vai trò: BỆNH NHÂN</span>
                  <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold">Trạng thái: Hoạt động</span>
                </div>
              </div>

              <div className="flex justify-end gap-4 pb-12">
                <button 
                  type="button" 
                  onClick={() => router.push('/admin/patients')}
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
                  Lưu Bệnh nhân
                </button>
              </div>

            </form>

          </div>

        </div>
      </main>
    </div>
  );
}
