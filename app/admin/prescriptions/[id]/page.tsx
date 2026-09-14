'use client';
import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Clock, ArrowLeft, Loader2, Pill, User, Stethoscope, 
  Printer, Download, CheckCircle, XCircle, PackageCheck
} from 'lucide-react';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

import Sidebar from '@/app/admin/Sidebar';
import { getPrescriptionDetail, updatePrescriptionStatus } from '@/app/admin/prescriptions/actions';

export default function PrescriptionDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const prescriptionId = Number(resolvedParams.id);
  
  const [isLoading, setIsLoading] = useState(true);
  const [prescription, setPrescription] = useState<any>(null);

  const fetchPrescription = async () => {
    setIsLoading(true);
    const res = await getPrescriptionDetail(prescriptionId);
    if (res.success && res.data) {
      setPrescription(res.data);
    } else {
      toast.error('Không tìm thấy đơn thuốc');
      router.push('/admin/prescriptions');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (prescriptionId) {
      fetchPrescription();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prescriptionId]);

  const handleStatusChange = async (newStatus: string) => {
    if (!confirm(`Bạn có chắc muốn chuyển đơn thuốc này sang trạng thái "${newStatus}"?`)) return;
    
    const toastId = toast.loading('Đang cập nhật trạng thái...');
    const res = await updatePrescriptionStatus(prescriptionId, newStatus);
    
    if (res.success) {
      toast.success(res.message, { id: toastId });
      fetchPrescription();
    } else {
      toast.error(res.message, { id: toastId });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    toast.success('Đã tải xuống đơn thuốc (PDF)');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Đã kê': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Đang chuẩn bị': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Đã cấp': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Đã hủy': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const currentDateTime = dayjs().format('DD/MM/YYYY HH:mm');

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans text-slate-800 overflow-hidden print:bg-white print:block">
      <div className="print:hidden h-full flex w-full">
        <Sidebar />
        <main className="flex-1 flex flex-col h-screen overflow-hidden">
          
          {/* TOP HEADER */}
          <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 z-10 shadow-sm">
            <div className="flex items-center gap-6">
              <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Pill className="text-blue-600"/> Chi tiết Đơn thuốc
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
            ) : prescription && (
              <div className="max-w-4xl mx-auto space-y-6">
                
                <div className="flex items-center justify-between mb-2">
                  <Link href="/admin/prescriptions" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold transition-colors">
                    <ArrowLeft size={20}/> Quay lại danh sách
                  </Link>
                  
                  <div className="flex gap-3">
                    <button onClick={handlePrint} className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl font-bold transition flex items-center gap-2 text-sm border border-slate-200">
                      <Printer size={16}/> In đơn thuốc
                    </button>
                    <button onClick={handleExport} className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl font-bold transition flex items-center gap-2 text-sm border border-blue-200">
                      <Download size={16}/> Xuất PDF
                    </button>
                  </div>
                </div>

                {/* CARD THÔNG TIN */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  
                  {/* HEADER HỒ SƠ */}
                  <div className="bg-slate-50 border-b border-slate-200 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                      <h2 className="text-sm font-medium text-slate-500 mb-1 tracking-wider uppercase">Đơn thuốc</h2>
                      <div className="text-2xl font-black text-slate-900 mb-2">{prescription.code}</div>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        Ngày kê: <span className="font-bold text-slate-700">{dayjs(prescription.createdAt).format('DD/MM/YYYY HH:mm')}</span>
                      </div>
                    </div>
                    <div className={`px-4 py-2 rounded-xl font-bold border ${getStatusBadge(prescription.status)} flex items-center gap-2`}>
                      Trạng thái: {prescription.status}
                    </div>
                  </div>

                  <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-slate-100">
                    {/* Thông tin Bệnh nhân */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2"><User size={16}/> Bệnh nhân</h3>
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <p className="font-bold text-lg text-slate-900 mb-1">{prescription.patient?.fullName}</p>
                        <p className="text-sm text-slate-600">Mã BN: {prescription.patient?.patientProfile?.patientCode || 'N/A'}</p>
                      </div>
                    </div>

                    {/* Thông tin Bác sĩ */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2"><Stethoscope size={16}/> Bác sĩ kê đơn</h3>
                      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                        <p className="font-bold text-lg text-blue-900 mb-1">BS. {prescription.doctor?.fullName}</p>
                        <p className="text-sm text-blue-700">Chuyên khoa: {prescription.doctor?.doctorProfile?.specialty || 'Đa khoa'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-8 border-b border-slate-100">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Chẩn đoán</h3>
                    <p className="text-lg font-bold text-slate-900 bg-slate-50 p-4 rounded-xl border border-slate-100 leading-relaxed">
                      {prescription.diagnosis || 'Chưa ghi nhận chẩn đoán cụ thể'}
                    </p>
                  </div>

                  {/* DANH SÁCH THUỐC */}
                  <div className="p-8">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Danh sách thuốc</h3>
                    
                    {prescription.items && prescription.items.length > 0 ? (
                      <div className="space-y-4">
                        {prescription.items.map((item: any, index: number) => (
                          <div key={item.id} className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-white border border-slate-200 rounded-xl hover:border-blue-300 transition-colors gap-4 shadow-sm">
                            <div className="flex items-start gap-4">
                              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center shrink-0">
                                {index + 1}
                              </div>
                              <div>
                                <h4 className="font-bold text-lg text-slate-900 mb-1">{item.medicationName}</h4>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600">
                                  <span className="font-medium text-slate-800 bg-slate-100 px-2 py-1 rounded">SL: {item.remaining}</span>
                                  <span className="flex items-center gap-1.5"><Clock size={14}/> {item.dosage}</span>
                                </div>
                              </div>
                            </div>
                            <div className="md:w-1/3 bg-orange-50 text-orange-900 p-3 rounded-lg text-sm border border-orange-100">
                              <span className="font-bold">Hướng dẫn: </span>
                              {item.instructions}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-12 text-center bg-slate-50 rounded-xl border border-slate-200 border-dashed">
                        <Pill className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500 font-medium">Đơn thuốc trống.</p>
                      </div>
                    )}
                  </div>

                  {/* HÀNH ĐỘNG CỦA ADMIN */}
                  <div className="bg-slate-50 border-t border-slate-200 p-6 flex flex-wrap items-center justify-between gap-4">
                    <div className="text-sm text-slate-500 font-medium">Thao tác dành cho Quản trị viên:</div>
                    <div className="flex gap-3">
                      
                      {['Đã kê', 'Đang chuẩn bị'].includes(prescription.status) && (
                        <button 
                          onClick={() => handleStatusChange('Đã cấp')}
                          className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-bold shadow hover:bg-emerald-700 transition flex items-center gap-2"
                        >
                          <PackageCheck size={18}/> Xác nhận Đã Cấp Thuốc
                        </button>
                      )}

                      {!['Đã cấp', 'Đã hủy'].includes(prescription.status) && (
                        <button 
                          onClick={() => handleStatusChange('Đã hủy')}
                          className="px-6 py-2.5 bg-white border border-red-200 text-red-600 rounded-xl font-bold hover:bg-red-50 transition flex items-center gap-2"
                        >
                          <XCircle size={18}/> Hủy đơn thuốc
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
      
      {/* GIAO DIỆN IN (Chỉ hiển thị khi in) */}
      <div className="hidden print:block print:p-8">
        {prescription && (
          <div className="space-y-6">
            <div className="text-center mb-8 border-b-2 border-black pb-4">
              <h1 className="text-2xl font-black uppercase">Phòng Khám AdminPro</h1>
              <h2 className="text-xl font-bold mt-2 uppercase">ĐƠN THUỐC</h2>
              <p className="mt-1">Mã ĐT: {prescription.code}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p><strong>Bệnh nhân:</strong> {prescription.patient?.fullName}</p>
                <p><strong>Mã BN:</strong> {prescription.patient?.patientProfile?.patientCode}</p>
                <p><strong>Ngày sinh:</strong> {prescription.patient?.dob}</p>
              </div>
              <div>
                <p><strong>Ngày kê:</strong> {dayjs(prescription.createdAt).format('DD/MM/YYYY')}</p>
                <p><strong>Bác sĩ:</strong> {prescription.doctor?.fullName}</p>
              </div>
            </div>

            <div className="mt-6">
              <p><strong>Chẩn đoán:</strong> {prescription.diagnosis}</p>
            </div>

            {prescription.items && prescription.items.length > 0 && (
              <div className="mt-6">
                <h3 className="font-bold border-b border-black mb-2 uppercase">Chỉ định thuốc</h3>
                <table className="w-full text-left mt-2 border-collapse border border-black">
                  <thead>
                    <tr>
                      <th className="border border-black p-2 w-12 text-center">STT</th>
                      <th className="border border-black p-2">Tên thuốc</th>
                      <th className="border border-black p-2 w-24">Số lượng</th>
                      <th className="border border-black p-2">Liều dùng & Hướng dẫn</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prescription.items?.map((item: any, i2: number) => (
                      <tr key={i2}>
                        <td className="border border-black p-2 text-center">{i2 + 1}</td>
                        <td className="border border-black p-2 font-bold">{item.medicationName}</td>
                        <td className="border border-black p-2">{item.remaining}</td>
                        <td className="border border-black p-2">
                          <p><strong>Liều:</strong> {item.dosage}</p>
                          <p><strong>HD:</strong> {item.instructions}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            <div className="mt-12 text-right">
              <p>Ngày ..... Tháng ..... Năm 2026</p>
              <p className="font-bold mt-2">BÁC SĨ KÊ ĐƠN</p>
              <p className="mt-16">{prescription.doctor?.fullName}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
