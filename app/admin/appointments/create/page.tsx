'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Bell, Clock, ArrowLeft, Save, Loader2, CalendarDays, User, Stethoscope, MapPin, Hash, Search
} from 'lucide-react';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

import Sidebar from '@/app/admin/Sidebar';
import { getInitialDataForCreate, createAppointment } from '@/app/admin/appointments/actions';

const TIME_SLOTS = [
  '08:00 - 10:00',
  '10:00 - 12:00',
  '13:30 - 15:30',
  '15:30 - 17:30'
];

const SPECIALTIES = [
  'Nội tổng quát',
  'Ngoại khoa',
  'Nhi khoa',
  'Sản phụ khoa',
  'Da liễu',
  'Răng Hàm Mặt',
  'Mắt',
  'Tai Mũi Họng'
];

export default function CreateAppointmentPage() {
  const router = useRouter();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  
  const [filteredPatients, setFilteredPatients] = useState<any[]>([]);
  const [patientSearch, setPatientSearch] = useState('');
  const [isPatientDropdownOpen, setIsPatientDropdownOpen] = useState(false);

  const [formData, setFormData] = useState({
    patientId: 0,
    specialty: '',
    doctorId: 0,
    bookingDate: dayjs().add(1, 'day').format('DD/MM/YYYY'),
    bookingTime: '',
    room: '',
    reason: ''
  });

  useEffect(() => {
    const fetchInitial = async () => {
      setIsLoading(true);
      const res = await getInitialDataForCreate();
      if (res.success && res.data) {
        setPatients(res.data.patients);
        setDoctors(res.data.doctors);
        setFilteredPatients(res.data.patients);
      }
      setIsLoading(false);
    };
    fetchInitial();
  }, []);

  // Filter patients
  useEffect(() => {
    if (!patientSearch) {
      setFilteredPatients(patients);
      return;
    }
    const lowerSearch = patientSearch.toLowerCase();
    const filtered = patients.filter(p => 
      p.fullName?.toLowerCase().includes(lowerSearch) || 
      p.phone?.includes(lowerSearch) ||
      p.patientProfile?.patientCode?.toLowerCase().includes(lowerSearch)
    );
    setFilteredPatients(filtered);
  }, [patientSearch, patients]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePatientSelect = (patient: any) => {
    setFormData(prev => ({ ...prev, patientId: patient.id }));
    setPatientSearch(`${patient.fullName} (${patient.phone})`);
    setIsPatientDropdownOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.patientId) return toast.error('Vui lòng chọn Bệnh nhân');
    if (!formData.specialty) return toast.error('Vui lòng chọn Chuyên khoa');
    if (!formData.doctorId) return toast.error('Vui lòng chọn Bác sĩ');
    if (!formData.bookingDate) return toast.error('Vui lòng chọn Ngày khám');
    if (!formData.bookingTime) return toast.error('Vui lòng chọn Khung giờ');

    setIsSubmitting(true);
    const toastId = toast.loading('Đang tạo lịch hẹn...');

    const res = await createAppointment(formData);
    
    if (res.success) {
      toast.success(res.message, { id: toastId });
      router.push('/admin/appointments');
    } else {
      toast.error(res.message, { id: toastId });
      setIsSubmitting(false);
    }
  };

  // Lọc bác sĩ theo chuyên khoa
  const availableDoctors = doctors.filter(doc => 
    !formData.specialty || (doc.doctorProfile && doc.doctorProfile.specialty === formData.specialty)
  );

  const currentDateTime = dayjs().format('DD/MM/YYYY HH:mm');

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="w-10 h-10 animate-spin text-blue-600"/></div>;
  }

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans text-slate-800 overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* TOP HEADER */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 z-10 shadow-sm">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <CalendarDays className="text-blue-600"/> Tạo Lịch Hẹn Mới
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
          <div className="max-w-4xl mx-auto">
            
            <div className="flex items-center justify-between mb-8">
              <Link href="/admin/appointments" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold transition-colors">
                <ArrowLeft size={20}/> Quay lại danh sách
              </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* CHỌN BỆNH NHÂN */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                  <User className="text-blue-500"/> 1. Thông tin Bệnh nhân
                </h2>
                
                <div className="relative">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Tìm & Chọn Bệnh nhân <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Nhập tên, số điện thoại hoặc mã bệnh nhân..." 
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                      value={patientSearch}
                      onChange={(e) => {
                        setPatientSearch(e.target.value);
                        setFormData(prev => ({...prev, patientId: 0}));
                        setIsPatientDropdownOpen(true);
                      }}
                      onFocus={() => setIsPatientDropdownOpen(true)}
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
                  </div>

                  {isPatientDropdownOpen && patientSearch && !formData.patientId && (
                    <div className="absolute z-20 top-full mt-2 w-full max-h-64 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-lg">
                      {filteredPatients.length > 0 ? filteredPatients.map(p => (
                        <div 
                          key={p.id} 
                          className="px-4 py-3 border-b border-slate-100 hover:bg-slate-50 cursor-pointer flex items-center justify-between"
                          onClick={() => handlePatientSelect(p)}
                        >
                          <div>
                            <p className="font-bold text-slate-900">{p.fullName}</p>
                            <p className="text-xs text-slate-500">{p.patientProfile?.patientCode} | SĐT: {p.phone}</p>
                          </div>
                        </div>
                      )) : (
                        <div className="p-4 text-center text-sm text-slate-500">Không tìm thấy bệnh nhân. <Link href="/admin/patients/create" className="text-blue-600 font-bold hover:underline">Thêm mới?</Link></div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* CHUYÊN KHOA VÀ BÁC SĨ */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                  <Stethoscope className="text-emerald-500"/> 2. Chuyên khoa & Bác sĩ
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Chuyên khoa <span className="text-red-500">*</span></label>
                    <select 
                      name="specialty"
                      value={formData.specialty}
                      onChange={(e) => {
                        handleChange(e);
                        // Reset doctor when specialty changes
                        setFormData(prev => ({...prev, doctorId: 0}));
                      }}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-blue-500 outline-none transition-all"
                    >
                      <option value="">-- Chọn chuyên khoa --</option>
                      {SPECIALTIES.map(sp => (
                        <option key={sp} value={sp}>{sp}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Bác sĩ <span className="text-red-500">*</span></label>
                    <select 
                      name="doctorId"
                      value={formData.doctorId}
                      onChange={(e) => setFormData(prev => ({...prev, doctorId: Number(e.target.value)}))}
                      disabled={!formData.specialty}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-blue-500 outline-none transition-all disabled:opacity-50"
                    >
                      <option value="0">-- Chọn bác sĩ --</option>
                      {availableDoctors.map(doc => (
                        <option key={doc.id} value={doc.id}>BS. {doc.fullName}</option>
                      ))}
                    </select>
                    {!formData.specialty && <p className="text-xs text-slate-500 mt-1">Vui lòng chọn chuyên khoa trước</p>}
                  </div>
                </div>
              </div>

              {/* THỜI GIAN VÀ ĐỊA ĐIỂM */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                  <Clock className="text-orange-500"/> 3. Thời gian khám
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Ngày khám (DD/MM/YYYY) <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <input 
                        type="text" 
                        name="bookingDate"
                        value={formData.bookingDate}
                        onChange={handleChange}
                        placeholder="VD: 15/09/2026"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:bg-white focus:border-blue-500 outline-none transition-all"
                      />
                      <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Phòng khám</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        name="room"
                        value={formData.room}
                        onChange={handleChange}
                        placeholder="VD: P201 (Để trống nếu chưa xếp)"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-blue-500 outline-none transition-all"
                      />
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3">Khung giờ đến khám <span className="text-red-500">*</span></label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {TIME_SLOTS.map(slot => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setFormData(prev => ({...prev, bookingTime: slot}))}
                        className={`py-3 px-4 rounded-xl font-bold text-sm transition-all ${
                          formData.bookingTime === slot 
                          ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-200 ring-offset-2' 
                          : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 hover:border-blue-300'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Lý do khám / Triệu chứng (Không bắt buộc)</label>
                  <textarea 
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Bệnh nhân có triệu chứng gì..."
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-blue-500 outline-none transition-all"
                  ></textarea>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex justify-end gap-4 pb-12">
                <button 
                  type="button" 
                  onClick={() => router.push('/admin/appointments')}
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
                  Xác nhận Tạo Lịch
                </button>
              </div>

            </form>

          </div>
        </div>
      </main>
    </div>
  );
}
