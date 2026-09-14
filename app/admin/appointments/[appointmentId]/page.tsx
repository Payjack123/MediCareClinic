'use client';
import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Bell, Clock, ArrowLeft, Loader2, CalendarDays, User, Stethoscope, MapPin, Hash, CheckCircle, XCircle
} from 'lucide-react';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

import Sidebar from '@/app/admin/Sidebar';
import { getAppointmentById, updateAppointmentStatus } from '@/app/admin/appointments/actions';

export default function AppointmentDetailsPage({ params }: { params: Promise<{ appointmentId: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const appointmentId = Number(resolvedParams.appointmentId);
  
  const [isLoading, setIsLoading] = useState(true);
  const [appointment, setAppointment] = useState<any>(null);

  const fetchAppointment = async () => {
    setIsLoading(true);
    const res = await getAppointmentById(appointmentId);
    if (res.success && res.data) {
      setAppointment(res.data);
    } else {
      toast.error('Không tìm thấy lịch hẹn');
      router.push('/admin/appointments');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (appointmentId) {
      fetchAppointment();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointmentId]);

  const handleStatusChange = async (newStatus: string) => {
    if (!confirm(`Bạn có chắc muốn chuyển lịch hẹn này sang trạng thái "${newStatus}"?`)) return;
    
    const toastId = toast.loading('Đang cập nhật trạng thái...');
    const res = await updateAppointmentStatus(appointmentId, newStatus);
    
    if (res.success) {
      toast.success(res.message, { id: toastId });
      fetchAppointment();
    } else {
      toast.error(res.message, { id: toastId });
    }
  };

  const currentDateTime = dayjs().format('DD/MM/YYYY HH:mm');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Đã đặt': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Đã xác nhận': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Đã check-in': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Đang khám': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Đã khám': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Đã hủy': return 'bg-red-100 text-red-700 border-red-200';
      case 'Không đến': return 'bg-slate-100 text-slate-700 border-slate-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans text-slate-800 overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* TOP HEADER */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 z-10 shadow-sm">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <CalendarDays className="text-blue-600"/> Chi tiết Lịch hẹn
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
          ) : appointment && (
            <div className="max-w-4xl mx-auto space-y-6">
              
              <div className="flex items-center justify-between mb-2">
                <Link href="/admin/appointments" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold transition-colors">
                  <ArrowLeft size={20}/> Quay lại
                </Link>
                
                <div className={`px-4 py-2 rounded-xl font-bold border ${getStatusBadge(appointment.status)} flex items-center gap-2`}>
                  {appointment.status === 'Đã hủy' ? <XCircle size={18}/> : <CheckCircle size={18}/>}
                  Trạng thái: {appointment.status}
                </div>
              </div>

              {/* CARD THÔNG TIN */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 border-b border-slate-200 p-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 mb-1">Mã lịch: {appointment.appointmentCode}</h2>
                    <p className="text-slate-500 text-sm">Tạo lúc: {dayjs(appointment.createdAt).format('DD/MM/YYYY HH:mm')}</p>
                  </div>
                </div>

                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                  
                  {/* Cột 1: Thông tin bệnh nhân & Bác sĩ */}
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2"><User size={16}/> Thông tin Bệnh nhân</h3>
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <p className="font-bold text-lg text-slate-900 mb-1">{appointment.patient?.fullName}</p>
                        <p className="text-sm text-slate-600 mb-2">Mã BN: {appointment.patient?.patientProfile?.patientCode || 'N/A'}</p>
                        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-200">
                          <Link href={`/admin/patients/${appointment.patientId}`} className="text-blue-600 text-sm font-bold hover:underline">
                            Xem hồ sơ bệnh nhân &rarr;
                          </Link>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2"><Stethoscope size={16}/> Phụ trách Y tế</h3>
                      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                        <p className="font-bold text-lg text-blue-900 mb-1">BS. {appointment.doctor?.fullName}</p>
                        <p className="text-sm text-blue-700">Chuyên khoa: {appointment.specialty}</p>
                      </div>
                    </div>
                  </div>

                  {/* Cột 2: Thời gian & Địa điểm */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2"><Clock size={16}/> Lịch trình</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-200">
                        <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                          <CalendarDays size={20}/>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500 font-medium mb-1">Ngày khám</p>
                          <p className="font-bold text-slate-900">{appointment.bookingDate}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-200">
                        <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                          <Clock size={20}/>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500 font-medium mb-1">Khung giờ đến khám</p>
                          <p className="font-bold text-slate-900 text-lg">{appointment.bookingTime}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-200">
                        <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                          <MapPin size={20}/>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500 font-medium mb-1">Phòng khám</p>
                          <p className="font-bold text-slate-900">{appointment.room || 'Chưa phân bổ'}</p>
                        </div>
                      </div>
                    </div>

                    {appointment.reason && (
                      <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <p className="text-sm text-slate-500 font-medium mb-2">Ghi chú / Lý do khám:</p>
                        <p className="text-slate-800 text-sm leading-relaxed">{appointment.reason}</p>
                      </div>
                    )}
                  </div>
                  
                </div>

                {/* HÀNH ĐỘNG CỦA ADMIN */}
                <div className="bg-slate-50 border-t border-slate-200 p-6 flex flex-wrap items-center justify-between gap-4">
                  <div className="text-sm text-slate-500 font-medium">Thao tác dành cho Quản trị viên:</div>
                  <div className="flex gap-3">
                    
                    {appointment.status === 'Đã đặt' && (
                      <button 
                        onClick={() => handleStatusChange('Đã xác nhận')}
                        className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold shadow hover:bg-blue-700 transition"
                      >
                        Xác nhận Lịch hẹn
                      </button>
                    )}

                    {appointment.status === 'Đã xác nhận' && (
                      <button 
                        onClick={() => handleStatusChange('Đã check-in')}
                        className="px-6 py-2.5 bg-amber-500 text-white rounded-xl font-bold shadow hover:bg-amber-600 transition"
                      >
                        Check-in Thủ công
                      </button>
                    )}

                    {!['Đã khám', 'Đã hủy', 'Không đến'].includes(appointment.status) && (
                      <button 
                        onClick={() => handleStatusChange('Đã hủy')}
                        className="px-6 py-2.5 bg-white border border-red-200 text-red-600 rounded-xl font-bold hover:bg-red-50 transition"
                      >
                        Hủy lịch
                      </button>
                    )}

                  </div>
                </div>

              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
