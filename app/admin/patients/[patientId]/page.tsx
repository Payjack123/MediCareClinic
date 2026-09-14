'use client';
import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Bell, User, Clock, ArrowLeft, Save, Loader2, Users, Mail, Phone, Hash, CreditCard, MapPin, 
  CalendarDays, Stethoscope, Shield, Receipt, Edit
} from 'lucide-react';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

import Sidebar from '@/app/admin/Sidebar';
import { getPatientById, updatePatient, updatePatientStatus } from '@/app/admin/patients/actions';

export default function PatientDetailsPage({ params }: { params: Promise<{ patientId: string }> }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resolvedParams = use(params);
  const patientId = Number(resolvedParams.patientId);
  
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'info');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(searchParams.get('edit') === 'true');
  
  const [patientData, setPatientData] = useState<any>(null);
  
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
    insurance: '',
    status: ''
  });

  const fetchPatient = async () => {
    setIsLoading(true);
    const res = await getPatientById(patientId);
    if (res.success && res.data) {
      const pat = res.data;
      const profile = pat.patientProfile;
      setPatientData(pat);
      setFormData({
        fullName: pat.fullName || '',
        email: pat.email || '',
        phone: pat.phone || '',
        patientCode: profile?.patientCode || '',
        gender: pat.gender || 'Nam',
        dob: pat.dob || '',
        address: pat.address || '',
        cccd: profile?.cccd || '',
        bhyt: profile?.bhyt || '',
        insurance: profile?.insurance || '',
        status: pat.status || 'Hoạt động'
      });
    } else {
      toast.error('Không tìm thấy bệnh nhân');
      router.push('/admin/patients');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (patientId) {
      fetchPatient();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!confirm(`Xác nhận chuyển trạng thái tài khoản thành "${newStatus}"?`)) return;
    const toastId = toast.loading('Đang cập nhật trạng thái...');
    const res = await updatePatientStatus(patientId, newStatus);
    if (res.success) {
      toast.success(res.message, { id: toastId });
      setFormData(prev => ({...prev, status: newStatus}));
      setPatientData((prev: any) => ({ ...prev, status: newStatus }));
    } else {
      toast.error(res.message, { id: toastId });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone) {
      toast.error('Vui lòng điền đầy đủ Họ tên và Số điện thoại');
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading('Đang lưu thông tin...');

    const res = await updatePatient(patientId, formData);
    
    if (res.success) {
      toast.success(res.message, { id: toastId });
      setIsEditing(false);
      fetchPatient();
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
              <Users className="text-blue-600"/> Chi tiết Bệnh nhân
            </h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-sm font-medium text-slate-500 bg-slate-100 px-4 py-2 rounded-full border border-slate-200 flex items-center gap-2">
              <Clock size={16}/> {currentDateTime}
            </div>
          </div>
        </header>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto p-8 animate-in fade-in duration-500">
          
          {isLoading ? (
            <div className="py-20 flex justify-center"><Loader2 className="w-10 h-10 text-blue-600 animate-spin" /></div>
          ) : (
            <div className="max-w-6xl mx-auto space-y-6">
              
              <div className="flex items-center justify-between">
                <Link href="/admin/patients" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold transition-colors">
                  <ArrowLeft size={20}/> Quay lại
                </Link>

                <div className="flex items-center gap-3">
                  <select 
                    value={formData.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className={`px-4 py-2 rounded-xl font-bold outline-none cursor-pointer border ${
                      formData.status === 'Khóa' ? 'bg-red-50 text-red-700 border-red-200' : 
                      formData.status === 'Tạm khóa' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                      'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}
                  >
                    <option value="Hoạt động">🟢 Đang hoạt động</option>
                    <option value="Tạm khóa">🟡 Tạm khóa</option>
                    <option value="Khóa">🔴 Khóa tài khoản</option>
                  </select>
                </div>
              </div>

              {/* PATIENT HEADER CARD */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-3xl border-4 border-white shadow-md shrink-0">
                  {formData.fullName?.charAt(0) || 'BN'}
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 mb-1">{formData.fullName} - {formData.patientCode}</h2>
                  <div className="flex items-center gap-4 text-sm font-medium text-slate-600">
                    <span className="flex items-center gap-1"><Phone size={16}/> {formData.phone}</span>
                    <span className="flex items-center gap-1"><User size={16}/> {formData.gender}</span>
                    <span className="flex items-center gap-1">
                      <Clock size={16}/> {formData.dob ? dayjs(formData.dob).format('DD/MM/YYYY') : 'Chưa cập nhật'}
                    </span>
                  </div>
                </div>
              </div>

              {/* TABS */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="flex border-b border-slate-200 bg-slate-50 overflow-x-auto custom-scrollbar">
                  {[
                    { id: 'info', icon: User, label: 'Thông tin' },
                    { id: 'appointments', icon: CalendarDays, label: 'Lịch hẹn' },
                    { id: 'history', icon: Stethoscope, label: 'Lịch sử khám' },
                    { id: 'bhyt', icon: Shield, label: 'BHYT' },
                    { id: 'finance', icon: Receipt, label: 'Tài chính' },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => { setActiveTab(tab.id); setIsEditing(false); }}
                      className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-colors whitespace-nowrap ${
                        activeTab === tab.id 
                        ? 'bg-white text-blue-600 border-b-2 border-blue-600' 
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      <tab.icon size={18} /> {tab.label}
                    </button>
                  ))}
                </div>

                <div className="p-8">
                  
                  {/* TAB 1: THÔNG TIN */}
                  {activeTab === 'info' && (
                    <div className="animate-in fade-in">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-slate-900">Thông tin hành chính</h3>
                        {!isEditing ? (
                          <button 
                            onClick={() => setIsEditing(true)}
                            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition flex items-center gap-2 text-sm"
                          >
                            <Edit size={16}/> Chỉnh sửa
                          </button>
                        ) : (
                          <div className="flex gap-2">
                            <button 
                              onClick={() => { setIsEditing(false); fetchPatient(); }}
                              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition text-sm"
                            >
                              Hủy
                            </button>
                            <button 
                              onClick={handleSubmit}
                              disabled={isSubmitting}
                              className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition flex items-center gap-2 text-sm disabled:opacity-70"
                            >
                              {isSubmitting ? <Loader2 size={16} className="animate-spin"/> : <Save size={16}/>} Lưu
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Họ và tên</label>
                          <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} disabled={!isEditing}
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none disabled:opacity-70 font-medium"/>
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Mã bệnh nhân</label>
                          <input type="text" name="patientCode" value={formData.patientCode} onChange={handleChange} disabled={!isEditing}
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none disabled:opacity-70 font-medium"/>
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Giới tính</label>
                          <select name="gender" value={formData.gender} onChange={handleChange} disabled={!isEditing}
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none disabled:opacity-70 font-medium">
                            <option value="Nam">Nam</option>
                            <option value="Nữ">Nữ</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Ngày sinh</label>
                          <input type="date" name="dob" value={formData.dob} onChange={handleChange} disabled={!isEditing}
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none disabled:opacity-70 font-medium"/>
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Số điện thoại</label>
                          <input type="text" name="phone" value={formData.phone} onChange={handleChange} disabled={!isEditing}
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none disabled:opacity-70 font-medium"/>
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Căn cước công dân</label>
                          <input type="text" name="cccd" value={formData.cccd} onChange={handleChange} disabled={!isEditing}
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none disabled:opacity-70 font-medium"/>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                          <input type="email" name="email" value={formData.email} onChange={handleChange} disabled={!isEditing}
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none disabled:opacity-70 font-medium"/>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-bold text-slate-700 mb-2">Địa chỉ</label>
                          <input type="text" name="address" value={formData.address} onChange={handleChange} disabled={!isEditing}
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none disabled:opacity-70 font-medium"/>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: LỊCH HẸN */}
                  {activeTab === 'appointments' && (
                    <div className="animate-in fade-in">
                      <h3 className="text-lg font-bold text-slate-900 mb-6">Danh sách lịch hẹn</h3>
                      <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-xs">
                          <tr>
                            <th className="px-4 py-3">Ngày</th>
                            <th className="px-4 py-3">Bác sĩ</th>
                            <th className="px-4 py-3">Phòng</th>
                            <th className="px-4 py-3">Trạng thái</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {patientData?.appointmentsAsPatient?.length > 0 ? patientData.appointmentsAsPatient.map((apt: any) => (
                            <tr key={apt.id}>
                              <td className="px-4 py-3 font-medium">{apt.bookingDate} {apt.bookingTime}</td>
                              <td className="px-4 py-3">{apt.doctor?.fullName} ({apt.specialty})</td>
                              <td className="px-4 py-3">{apt.room || 'Chưa xếp'}</td>
                              <td className="px-4 py-3">
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold">{apt.status}</span>
                              </td>
                            </tr>
                          )) : (
                            <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-500">Không có lịch hẹn nào.</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* TAB 3: LỊCH SỬ KHÁM */}
                  {activeTab === 'history' && (
                    <div className="animate-in fade-in">
                      <h3 className="text-lg font-bold text-slate-900 mb-6">Lịch sử khám (Chỉ xem)</h3>
                      <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-xs">
                          <tr>
                            <th className="px-4 py-3">Ngày</th>
                            <th className="px-4 py-3">Bác sĩ</th>
                            <th className="px-4 py-3">Chẩn đoán</th>
                            <th className="px-4 py-3">Trạng thái</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {patientData?.examinationsAsPatient?.length > 0 ? patientData.examinationsAsPatient.map((exam: any) => (
                            <tr key={exam.id}>
                              <td className="px-4 py-3 font-medium">{dayjs(exam.createdAt).format('DD/MM/YYYY')}</td>
                              <td className="px-4 py-3">{exam.doctor?.fullName}</td>
                              <td className="px-4 py-3 max-w-xs truncate" title={exam.diagnosis}>{exam.diagnosis}</td>
                              <td className="px-4 py-3">Hoàn thành</td>
                            </tr>
                          )) : (
                            <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-500">Chưa có lịch sử khám.</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* TAB 4: BHYT */}
                  {activeTab === 'bhyt' && (
                    <div className="animate-in fade-in">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-slate-900">Thông tin BHYT</h3>
                        {!isEditing ? (
                          <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition flex items-center gap-2 text-sm">
                            <Edit size={16}/> Chỉnh sửa
                          </button>
                        ) : (
                          <button onClick={handleSubmit} disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition flex items-center gap-2 text-sm">
                            {isSubmitting ? <Loader2 size={16} className="animate-spin"/> : <Save size={16}/>} Lưu
                          </button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-slate-50 rounded-xl border border-slate-200">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Mã BHYT</label>
                          <input type="text" name="bhyt" value={formData.bhyt} onChange={handleChange} disabled={!isEditing}
                            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none disabled:bg-slate-100"/>
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Nơi đăng ký KCB Ban đầu</label>
                          <input type="text" name="insurance" value={formData.insurance} onChange={handleChange} disabled={!isEditing}
                            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none disabled:bg-slate-100"/>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 5: TÀI CHÍNH */}
                  {activeTab === 'finance' && (
                    <div className="animate-in fade-in">
                      <h3 className="text-lg font-bold text-slate-900 mb-6">Lịch sử Hóa đơn</h3>
                      <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-xs">
                          <tr>
                            <th className="px-4 py-3">Mã HĐ</th>
                            <th className="px-4 py-3">Ngày tạo</th>
                            <th className="px-4 py-3 text-right">Tổng tiền</th>
                            <th className="px-4 py-3">Trạng thái</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {patientData?.invoicesAsPatient?.length > 0 ? patientData.invoicesAsPatient.map((inv: any) => (
                            <tr key={inv.id}>
                              <td className="px-4 py-3 font-bold text-slate-700">{inv.invoiceCode}</td>
                              <td className="px-4 py-3">{dayjs(inv.createdAt).format('DD/MM/YYYY HH:mm')}</td>
                              <td className="px-4 py-3 text-right font-bold text-emerald-600">{inv.finalAmount.toLocaleString('vi-VN')} đ</td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${inv.status === 'Đã thanh toán' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                  {inv.status}
                                </span>
                              </td>
                            </tr>
                          )) : (
                            <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-500">Chưa có hóa đơn nào.</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}

                </div>
              </div>

            </div>
          )}
        </div>
      </main>
    </div>
  );
}
