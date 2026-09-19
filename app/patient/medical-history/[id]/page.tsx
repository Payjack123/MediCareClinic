'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, CalendarDays, UserCircle2, MapPin, 
  Printer, FileText, Pill, Activity, ChevronRight, Loader2, Download
} from 'lucide-react';
import PatientSidebar from '@/app/patient/Sidebar';
import { getMedicalHistoryById } from '../actions';

export default function MedicalHistoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const id = parseInt(resolvedParams.id);
  const [appointment, setAppointment] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const res = await getMedicalHistoryById(id);
        if (res.success && res.data) {
          setAppointment(res.data);
        } else {
          setErrorMsg(res.message || 'Lỗi tải dữ liệu');
        }
      }
      setIsLoading(false);
    };
    fetchData();
  }, [id]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]"><Loader2 className="w-10 h-10 text-[#2563EB] animate-spin" /></div>;
  }

  if (errorMsg || !appointment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
          <p className="text-red-500 font-bold mb-4">{errorMsg || 'Không tìm thấy thông tin'}</p>
          <button onClick={() => router.push('/patient/medical-history')} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold">
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const InfoIcon = ({ size, className }: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="16" x2="12" y2="12"></line>
      <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
  );

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] font-sans text-gray-800">
      <PatientSidebar activePage="medical-history" />

      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* HEADER */}
        <header className="bg-white border-b border-gray-100 shrink-0 z-10 px-8 py-4 flex items-center justify-between sticky top-0">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push("/patient/medical-history")} className="p-2 hover:bg-gray-50 rounded-full transition-colors text-gray-500">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900 leading-none mb-1.5 flex items-center gap-2">
                Chi tiết khám bệnh
              </h1>
              <div className="text-[13px] text-gray-500 flex items-center gap-1.5">
                <Link href="/patient/medical-history" className="hover:text-[#2563EB] transition-colors">Lịch sử khám</Link>
                <ChevronRight size={12} className="text-gray-400" />
                <span className="text-gray-700">Chi tiết</span>
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-4xl mx-auto w-full">
          
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex flex-col">
            {/* Top Header of Detail */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-2xl font-black text-[#2563EB] mb-2">{appointment.specialty}</h3>
                <p className="text-gray-500 font-medium">Bác sĩ khám: <span className="text-gray-900">{appointment.doctor}</span></p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-4 py-1.5 rounded-lg text-sm font-bold ${appointment.statusColor}`}>
                  {appointment.status}
                </span>
                <button className="flex items-center gap-2 px-4 py-1.5 bg-gray-50 border border-gray-200 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-100 transition" title="In">
                  <Printer size={16} /> In phiếu
                </button>
              </div>
            </div>

            {/* Info List */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <CalendarDays size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium mb-1">Thời gian khám</p>
                    <p className="text-base font-bold text-gray-900">{appointment.time} - {appointment.rawDate}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium mb-1">Phòng khám</p>
                    <p className="text-base font-bold text-gray-900">{appointment.clinic}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                 <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center shrink-0">
                    <InfoIcon size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium mb-1">Lý do khám</p>
                    <p className="text-base font-bold text-gray-900">{appointment.reason}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Thông tin người khám */}
            <div className="h-px bg-gray-100 w-full mb-8"></div>
            <div className="bg-blue-50/40 rounded-2xl p-6 border border-blue-100 mb-8">
              <h4 className="text-base font-bold text-[#2563EB] mb-4">Thông tin bệnh nhân</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wider">Họ và tên</p>
                  <p className="text-sm font-bold text-gray-900">{appointment.patientDetails?.name || 'Không có'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wider">Số điện thoại</p>
                  <p className="text-sm font-bold text-gray-900">{appointment.patientDetails?.phone || 'Không có'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wider">CMND/CCCD</p>
                  <p className="text-sm font-bold text-gray-900">{appointment.patientDetails?.cccd || 'Không có'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wider">Địa chỉ</p>
                  <p className="text-sm font-bold text-gray-900 truncate" title={appointment.patientDetails?.address || 'Không có'}>{appointment.patientDetails?.address || 'Không có'}</p>
                </div>
              </div>
            </div>

            {/* Dịch vụ đã thực hiện */}
            {appointment.status === 'Đã hoàn thành' && (
              <div className="mb-8">
                <h4 className="text-base font-bold text-gray-900 mb-4">Dịch vụ đã thực hiện</h4>
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                  <div className="flex justify-between items-center mb-4 text-base">
                    <span className="text-gray-700">{appointment.specialty}</span>
                    <span className="font-bold text-gray-900">{formatCurrency(appointment.price)}</span>
                  </div>
                  <div className="h-px w-full bg-gray-200 mb-4"></div>
                  <div className="flex justify-between items-center text-lg font-black">
                    <span className="text-gray-900">Tổng tiền</span>
                    <span className="text-[#2563EB]">{formatCurrency(appointment.price)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-auto pt-8 border-t border-gray-100">
              <Link href="/patient/medical-record" className="flex flex-col items-center justify-center p-6 rounded-2xl border border-gray-200 hover:border-[#2563EB] hover:bg-blue-50 transition group text-center h-full">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-[#2563EB] flex items-center justify-center mb-4 group-hover:bg-[#2563EB] group-hover:text-white transition">
                  <FileText size={24} />
                </div>
                <span className="text-base font-bold text-gray-900 mb-1">Hồ sơ bệnh án</span>
                <span className="text-xs text-gray-500 group-hover:text-[#2563EB]">Xem kết quả chẩn đoán</span>
              </Link>
              
              <Link href="/patient/prescriptions" className="flex flex-col items-center justify-center p-6 rounded-2xl border border-gray-200 hover:border-[#2563EB] hover:bg-blue-50 transition group text-center h-full">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-[#2563EB] flex items-center justify-center mb-4 group-hover:bg-[#2563EB] group-hover:text-white transition">
                  <Pill size={24} />
                </div>
                <span className="text-base font-bold text-gray-900 mb-1">Đơn thuốc</span>
                <span className="text-xs text-gray-500 group-hover:text-[#2563EB]">Xem toa thuốc đã kê</span>
              </Link>
              
              <button className="flex flex-col items-center justify-center p-6 rounded-2xl border border-gray-200 hover:border-[#2563EB] hover:bg-blue-50 transition group text-center h-full">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-[#2563EB] flex items-center justify-center mb-4 group-hover:bg-[#2563EB] group-hover:text-white transition">
                  <Activity size={24} />
                </div>
                <span className="text-base font-bold text-gray-900 mb-1">Kết quả xét nghiệm</span>
                <span className="text-xs text-gray-500 group-hover:text-[#2563EB]">Xem kết quả CLS</span>
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
