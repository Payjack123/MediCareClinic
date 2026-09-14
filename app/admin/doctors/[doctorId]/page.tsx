'use client';
import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Bell, User, Clock, ArrowLeft, Save, Loader2, Stethoscope, Mail, Phone, Hash, Award, Edit, ShieldCheck
} from 'lucide-react';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

import Sidebar from '@/app/admin/Sidebar';
import { getDoctorById, updateDoctor, updateDoctorStatus } from '@/app/admin/doctors/actions';

export default function DoctorDetailsPage({ params }: { params: Promise<{ doctorId: string }> }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resolvedParams = use(params);
  const doctorId = Number(resolvedParams.doctorId);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(searchParams.get('edit') === 'true');
  const [originalData, setOriginalData] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    doctorCode: '',
    specialty: '',
    degree: '',
    experience: '',
    certificateNumber: '',
    status: ''
  });

  const fetchDoctor = async () => {
    setIsLoading(true);
    const res = await getDoctorById(doctorId);
    if (res.success && res.data) {
      const doc = res.data;
      const profile = doc.doctorProfile;
      setOriginalData(doc);
      setFormData({
        fullName: doc.fullName || '',
        email: doc.email || '',
        phone: doc.phone || '',
        doctorCode: profile?.doctorCode || '',
        specialty: profile?.specialty || '',
        degree: profile?.degree || '',
        experience: profile?.experience || '',
        certificateNumber: profile?.certificateNumber || '',
        status: profile?.status || 'Đang làm việc'
      });
    } else {
      toast.error('Không tìm thấy bác sĩ');
      router.push('/admin/doctors');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (doctorId) {
      fetchDoctor();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctorId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!confirm(`Xác nhận chuyển trạng thái thành "${newStatus}"?`)) return;
    const toastId = toast.loading('Đang cập nhật trạng thái...');
    const res = await updateDoctorStatus(doctorId, newStatus);
    if (res.success) {
      toast.success(res.message, { id: toastId });
      setFormData(prev => ({...prev, status: newStatus}));
      setOriginalData((prev: any) => ({
        ...prev, 
        doctorProfile: { ...prev.doctorProfile, status: newStatus }
      }));
    } else {
      toast.error(res.message, { id: toastId });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.specialty || !formData.doctorCode) {
      toast.error('Vui lòng điền đầy đủ các thông tin bắt buộc (*)');
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading('Đang lưu thông tin...');

    const res = await updateDoctor(doctorId, formData);
    
    if (res.success) {
      toast.success(res.message, { id: toastId });
      setIsEditing(false);
      fetchDoctor();
    } else {
      toast.error(res.message, { id: toastId });
    }
    setIsSubmitting(false);
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
              <Stethoscope className="text-blue-600"/> Chi tiết Bác sĩ
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
          
          {isLoading ? (
            <div className="py-20 flex justify-center"><Loader2 className="w-10 h-10 text-blue-600 animate-spin" /></div>
          ) : (
            <div className="max-w-5xl mx-auto">
              
              <div className="flex items-center justify-between mb-8">
                <Link href="/admin/doctors" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold transition-colors">
                  <ArrowLeft size={20}/> Quay lại danh sách
                </Link>

                <div className="flex items-center gap-3">
                  {!isEditing ? (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="px-5 py-2 bg-white border border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition shadow-sm flex items-center gap-2"
                    >
                      <Edit size={16}/> Chỉnh sửa
                    </button>
                  ) : (
                    <button 
                      onClick={() => {
                        setIsEditing(false);
                        fetchDoctor(); // reset form
                      }}
                      className="px-5 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition flex items-center gap-2"
                    >
                      Hủy chỉnh sửa
                    </button>
                  )}
                  
                  {/* Status Dropdown */}
                  <select 
                    value={formData.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className={`px-4 py-2 rounded-xl font-bold outline-none cursor-pointer border ${
                      formData.status === 'Khóa' ? 'bg-red-50 text-red-700 border-red-200' : 
                      formData.status === 'Tạm nghỉ' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                      'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}
                  >
                    <option value="Hoạt động">🟢 Hoạt động</option>
                    <option value="Tạm nghỉ">🟡 Tạm nghỉ</option>
                    <option value="Khóa">🔴 Khóa tài khoản</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* LEFT COLUMN - USER PROFILE CARD */}
                <div className="lg:col-span-1 space-y-6">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-3xl mb-4 border-4 border-white shadow-md">
                      {originalData?.doctorProfile?.imagePrefix || 'BS'}
                    </div>
                    <h2 className="text-xl font-black text-slate-900 mb-1">{formData.fullName}</h2>
                    <p className="text-sm font-bold text-blue-600 mb-4">{formData.specialty || 'Chưa cập nhật khoa'}</p>
                    
                    <div className="w-full space-y-3 pt-4 border-t border-slate-100 text-left">
                      <div className="flex items-center gap-3 text-sm">
                        <Phone size={16} className="text-slate-400"/>
                        <span className="font-medium text-slate-700">{formData.phone}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Mail size={16} className="text-slate-400"/>
                        <span className="font-medium text-slate-700">{formData.email || 'Chưa cập nhật email'}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Hash size={16} className="text-slate-400"/>
                        <span className="font-medium text-slate-700">Mã: <span className="font-bold">{formData.doctorCode}</span></span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <ShieldCheck className="text-emerald-500" size={18}/> Thông tin hệ thống
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Vai trò:</span>
                        <span className="font-bold text-slate-900">BÁC SĨ</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Trạng thái:</span>
                        <span className="font-bold text-slate-900">{formData.status}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Ngày tạo:</span>
                        <span className="font-bold text-slate-900">{dayjs(originalData?.createdAt).format('DD/MM/YYYY')}</span>
                      </div>
                      <div className="flex justify-between border-t border-slate-100 pt-3 mt-1">
                        <span className="text-slate-500">Đăng nhập bằng:</span>
                        <span className="font-bold text-blue-600">{formData.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN - FORMS */}
                <div className="lg:col-span-2">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* THÔNG TIN CÁ NHÂN */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                      <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                        <User className="text-blue-500"/> Thông tin cá nhân
                      </h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Họ và tên <span className="text-red-500">*</span></label>
                          <input 
                            type="text" 
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none transition-all disabled:opacity-70 disabled:cursor-not-allowed font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Số điện thoại <span className="text-red-500">*</span></label>
                          <input 
                            type="text" 
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none transition-all disabled:opacity-70 disabled:cursor-not-allowed font-medium"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                          <input 
                            type="email" 
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none transition-all disabled:opacity-70 disabled:cursor-not-allowed font-medium"
                          />
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
                          <input 
                            type="text" 
                            name="doctorCode"
                            value={formData.doctorCode}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-emerald-500 outline-none transition-all disabled:opacity-70 disabled:cursor-not-allowed font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Chuyên khoa <span className="text-red-500">*</span></label>
                          <select 
                            name="specialty"
                            value={formData.specialty}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-emerald-500 outline-none transition-all disabled:opacity-70 disabled:cursor-not-allowed font-medium"
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
                            disabled={!isEditing}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-emerald-500 outline-none transition-all disabled:opacity-70 disabled:cursor-not-allowed font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Số năm kinh nghiệm</label>
                          <input 
                            type="text" 
                            name="experience"
                            value={formData.experience}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-emerald-500 outline-none transition-all disabled:opacity-70 disabled:cursor-not-allowed font-medium"
                          />
                        </div>
                        
                        <div className="md:col-span-2">
                          <label className="block text-sm font-bold text-slate-700 mb-2">Số chứng chỉ hành nghề</label>
                          <input 
                            type="text" 
                            name="certificateNumber"
                            value={formData.certificateNumber}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-emerald-500 outline-none transition-all disabled:opacity-70 disabled:cursor-not-allowed font-medium"
                          />
                        </div>
                      </div>
                    </div>

                    {isEditing && (
                      <div className="flex justify-end gap-4 pt-4">
                        <button 
                          type="submit" 
                          disabled={isSubmitting}
                          className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-md hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-70"
                        >
                          {isSubmitting ? <Loader2 size={20} className="animate-spin"/> : <Save size={20}/>}
                          Lưu Cập Nhật
                        </button>
                      </div>
                    )}

                  </form>
                </div>
              </div>

            </div>
          )}

        </div>
      </main>
    </div>
  );
}
