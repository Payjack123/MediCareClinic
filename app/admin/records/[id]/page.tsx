'use client';
import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Clock, ArrowLeft, Loader2, FileText, User, Stethoscope, 
  Printer, Download, Pill, TestTube, Activity
} from 'lucide-react';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

import Sidebar from '@/app/admin/Sidebar';
import { getExaminationDetail } from '@/app/admin/records/actions';

export default function RecordDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const recordId = Number(resolvedParams.id);
  
  const [activeTab, setActiveTab] = useState('info');
  const [isLoading, setIsLoading] = useState(true);
  const [record, setRecord] = useState<any>(null);

  const fetchRecord = async () => {
    setIsLoading(true);
    const res = await getExaminationDetail(recordId);
    if (res.success && res.data) {
      setRecord(res.data);
    } else {
      toast.error('Không tìm thấy hồ sơ bệnh án');
      router.push('/admin/records');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (recordId) {
      fetchRecord();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recordId]);

  const currentDateTime = dayjs().format('DD/MM/YYYY HH:mm');

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    toast.success('Đã tải xuống hồ sơ bệnh án (PDF)');
  };

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans text-slate-800 overflow-hidden print:bg-white print:block">
      <div className="print:hidden h-full flex w-full">
        <Sidebar />
        <main className="flex-1 flex flex-col h-screen overflow-hidden">
          
          {/* TOP HEADER */}
          <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 z-10 shadow-sm">
            <div className="flex items-center gap-6">
              <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <FileText className="text-blue-600"/> Chi tiết Hồ sơ Bệnh án
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
            ) : record && (
              <div className="max-w-5xl mx-auto space-y-6">
                
                <div className="flex items-center justify-between mb-2">
                  <Link href="/admin/records" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold transition-colors">
                    <ArrowLeft size={20}/> Quay lại danh sách
                  </Link>
                  
                  <div className="flex gap-3">
                    <button onClick={handlePrint} className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl font-bold transition flex items-center gap-2 text-sm border border-slate-200">
                      <Printer size={16}/> In hồ sơ
                    </button>
                    <button onClick={handleExport} className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl font-bold transition flex items-center gap-2 text-sm border border-blue-200">
                      <Download size={16}/> Xuất PDF
                    </button>
                  </div>
                </div>

                {/* CARD THÔNG TIN */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  
                  {/* HEADER HỒ SƠ */}
                  <div className="bg-slate-900 text-white p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                      <h2 className="text-sm font-medium text-slate-400 mb-1 tracking-wider uppercase">Hồ sơ Bệnh án</h2>
                      <div className="text-2xl font-black mb-2">{record.appointment?.appointmentCode || `HS-${record.id}`}</div>
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium text-slate-300">
                        <span className="flex items-center gap-1.5"><User size={16} className="text-blue-400"/> {record.patient?.fullName} - {record.patient?.patientProfile?.patientCode}</span>
                        <span className="flex items-center gap-1.5"><Stethoscope size={16} className="text-emerald-400"/> BS. {record.doctor?.fullName} ({record.appointment?.specialty})</span>
                        <span className="flex items-center gap-1.5"><Clock size={16} className="text-orange-400"/> Ngày khám: {dayjs(record.createdAt).format('DD/MM/YYYY')}</span>
                      </div>
                    </div>
                    <div className="bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 px-4 py-2 rounded-xl font-bold text-sm">
                      Đã hoàn thành
                    </div>
                  </div>

                  {/* TABS HỒ SƠ */}
                  <div className="flex border-b border-slate-200 bg-slate-50 overflow-x-auto custom-scrollbar">
                    {[
                      { id: 'info', icon: Activity, label: 'Thông tin khám' },
                      { id: 'diagnosis', icon: Stethoscope, label: 'Chẩn đoán' },
                      { id: 'treatment', icon: FileText, label: 'Điều trị' },
                      { id: 'prescriptions', icon: Pill, label: 'Đơn thuốc' },
                      { id: 'labtests', icon: TestTube, label: 'Xét nghiệm' },
                      { id: 'history', icon: Clock, label: 'Lịch sử khám' },
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
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
                    
                    {/* TAB: THÔNG TIN KHÁM */}
                    {activeTab === 'info' && (
                      <div className="animate-in fade-in space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                            <h3 className="text-sm font-bold text-slate-500 mb-2 uppercase">Lý do đến khám (Triệu chứng)</h3>
                            <p className="font-medium text-slate-900 leading-relaxed">{record.symptoms || 'Không ghi nhận'}</p>
                          </div>
                          <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                            <h3 className="text-sm font-bold text-slate-500 mb-2 uppercase">Tiền sử bệnh</h3>
                            <p className="font-medium text-slate-900 leading-relaxed">{record.medicalHistory || 'Chưa ghi nhận'}</p>
                          </div>
                        </div>
                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                          <h3 className="text-sm font-bold text-slate-500 mb-2 uppercase">Khám lâm sàng</h3>
                          <p className="font-medium text-slate-900 leading-relaxed whitespace-pre-wrap">{record.clinicalExam || 'Chưa có thông tin khám lâm sàng'}</p>
                        </div>
                      </div>
                    )}

                    {/* TAB: CHẨN ĐOÁN */}
                    {activeTab === 'diagnosis' && (
                      <div className="animate-in fade-in space-y-6">
                        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                          <h3 className="text-sm font-bold text-blue-600 mb-2 uppercase">Chẩn đoán chính</h3>
                          <p className="text-xl font-black text-blue-900 leading-relaxed">{record.diagnosis || 'Chưa có chẩn đoán'}</p>
                        </div>
                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                          <h3 className="text-sm font-bold text-slate-500 mb-2 uppercase">Chẩn đoán phụ / Phân biệt</h3>
                          <p className="font-medium text-slate-900 leading-relaxed whitespace-pre-wrap">{record.secondaryDiagnosis || 'Không có'}</p>
                        </div>
                        {record.notes && (
                          <div className="bg-amber-50 p-6 rounded-xl border border-amber-100">
                            <h3 className="text-sm font-bold text-amber-600 mb-2 uppercase">Ghi chú chuyên môn</h3>
                            <p className="font-medium text-amber-900 leading-relaxed whitespace-pre-wrap">{record.notes}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* TAB: ĐIỀU TRỊ */}
                    {activeTab === 'treatment' && (
                      <div className="animate-in fade-in space-y-6">
                        <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100">
                          <h3 className="text-sm font-bold text-emerald-600 mb-2 uppercase">Hướng điều trị</h3>
                          <p className="font-medium text-emerald-900 leading-relaxed whitespace-pre-wrap">{record.treatment || 'Chưa có hướng dẫn điều trị'}</p>
                        </div>
                        
                        {(record.followUpDate || record.followUpReason) && (
                          <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 flex flex-col md:flex-row gap-8">
                            <div>
                              <h3 className="text-sm font-bold text-slate-500 mb-2 uppercase">Lịch tái khám</h3>
                              <p className="font-bold text-slate-900 text-lg">
                                {record.followUpDate ? `${record.followUpDate} ${record.followUpTime ? `- ${record.followUpTime}` : ''}` : 'Không hẹn trước'}
                              </p>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-sm font-bold text-slate-500 mb-2 uppercase">Lời dặn / Yêu cầu tái khám</h3>
                              <p className="font-medium text-slate-900">{record.followUpReason || 'Đến khám lại nếu không thuyên giảm.'}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* TAB: ĐƠN THUỐC */}
                    {activeTab === 'prescriptions' && (
                      <div className="animate-in fade-in">
                        {record.prescriptions && record.prescriptions.length > 0 ? (
                          record.prescriptions.map((pres: any) => (
                            <div key={pres.id} className="mb-8 last:mb-0">
                              <div className="flex justify-between items-end mb-4 border-b border-slate-200 pb-2">
                                <div>
                                  <h3 className="text-lg font-bold text-slate-900">Đơn thuốc: {pres.code}</h3>
                                  <p className="text-sm text-slate-500">{pres.type || 'Ngoại trú'} | {dayjs(pres.createdAt).format('HH:mm DD/MM/YYYY')}</p>
                                </div>
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-lg">{pres.status}</span>
                              </div>
                              <table className="w-full text-left text-sm whitespace-nowrap border border-slate-200 rounded-xl overflow-hidden">
                                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-xs">
                                  <tr>
                                    <th className="px-4 py-3">Tên thuốc</th>
                                    <th className="px-4 py-3">Liều dùng</th>
                                    <th className="px-4 py-3">Số lượng</th>
                                    <th className="px-4 py-3">Hướng dẫn</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                  {pres.items?.map((item: any) => (
                                    <tr key={item.id} className="hover:bg-slate-50">
                                      <td className="px-4 py-3 font-bold text-slate-900">{item.medicationName}</td>
                                      <td className="px-4 py-3 text-slate-700">{item.dosage}</td>
                                      <td className="px-4 py-3 text-slate-700 font-medium">{item.remaining}</td>
                                      <td className="px-4 py-3 text-slate-700">{item.instructions}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ))
                        ) : (
                          <div className="py-12 text-center bg-slate-50 rounded-xl border border-slate-200 border-dashed">
                            <Pill className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                            <p className="text-slate-500 font-medium">Không có đơn thuốc nào được kê trong lần khám này.</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* TAB: XÉT NGHIỆM */}
                    {activeTab === 'labtests' && (
                      <div className="animate-in fade-in">
                        {record.labTests && record.labTests.length > 0 ? (
                          <table className="w-full text-left text-sm whitespace-nowrap border border-slate-200 rounded-xl overflow-hidden">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-xs">
                              <tr>
                                <th className="px-4 py-3">Tên xét nghiệm</th>
                                <th className="px-4 py-3">Thời gian</th>
                                <th className="px-4 py-3">Bác sĩ chỉ định</th>
                                <th className="px-4 py-3">Kết quả</th>
                                <th className="px-4 py-3">Trạng thái</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {record.labTests.map((test: any) => (
                                <tr key={test.id} className="hover:bg-slate-50">
                                  <td className="px-4 py-3 font-bold text-slate-900">{test.testName}</td>
                                  <td className="px-4 py-3 text-slate-700">{dayjs(test.date).format('HH:mm')}</td>
                                  <td className="px-4 py-3 text-slate-700">{test.doctorName}</td>
                                  <td className="px-4 py-3 font-medium text-slate-900 truncate max-w-[200px]" title={test.result}>{test.result || '-'}</td>
                                  <td className="px-4 py-3">
                                    <span className={`px-2 py-1 text-xs font-bold rounded-lg ${test.statusType === 'Hoàn thành' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                      {test.statusType}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <div className="py-12 text-center bg-slate-50 rounded-xl border border-slate-200 border-dashed">
                            <TestTube className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                            <p className="text-slate-500 font-medium">Không có chỉ định xét nghiệm nào.</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* TAB: LỊCH SỬ KHÁM */}
                    {activeTab === 'history' && (
                      <div className="animate-in fade-in">
                        <h3 className="text-lg font-bold text-slate-900 mb-6">Lịch sử khám bệnh trước đây</h3>
                        {record.history && record.history.length > 0 ? (
                          <div className="space-y-4">
                            {record.history.map((hist: any) => (
                              <div key={hist.id} className="flex gap-4 p-4 rounded-xl border border-slate-200 hover:border-blue-300 transition-colors bg-white">
                                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-600 flex flex-col items-center justify-center shrink-0">
                                  <span className="text-[10px] font-bold leading-none">{dayjs(hist.createdAt).format('MM')}</span>
                                  <span className="text-sm font-black leading-none">{dayjs(hist.createdAt).format('YYYY')}</span>
                                </div>
                                <div className="flex-1">
                                  <div className="flex justify-between items-start mb-1">
                                    <h4 className="font-bold text-slate-900">
                                      {hist.diagnosis ? hist.diagnosis : 'Khám bệnh'}
                                    </h4>
                                    <Link href={`/admin/records/${hist.id}`} className="text-blue-600 text-xs font-bold hover:underline">
                                      Xem hồ sơ &rarr;
                                    </Link>
                                  </div>
                                  <p className="text-sm text-slate-600">
                                    BS. {hist.doctor?.fullName} | {hist.appointment?.specialty || 'Đa khoa'}
                                  </p>
                                  <p className="text-xs text-slate-400 mt-1">Mã HS: {hist.appointment?.appointmentCode}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="py-12 text-center bg-slate-50 rounded-xl border border-slate-200 border-dashed">
                            <p className="text-slate-500 font-medium">Bệnh nhân chưa có lịch sử khám nào trước đây.</p>
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                </div>

                <div className="text-center text-slate-400 text-xs mt-6">
                  * Module Hồ sơ Bệnh án dành cho Quản trị viên chỉ có quyền xem (Read-Only) để đảm bảo an toàn dữ liệu y tế.
                </div>

              </div>
            )}
          </div>
        </main>
      </div>
      
      {/* GIAO DIỆN IN (Chỉ hiển thị khi in) */}
      <div className="hidden print:block print:p-8">
        {record && (
          <div className="space-y-6">
            <div className="text-center mb-8 border-b-2 border-black pb-4">
              <h1 className="text-2xl font-black uppercase">Phòng Khám AdminPro</h1>
              <h2 className="text-xl font-bold mt-2 uppercase">HỒ SƠ BỆNH ÁN</h2>
              <p className="mt-1">Mã HS: {record.appointment?.appointmentCode}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p><strong>Bệnh nhân:</strong> {record.patient?.fullName}</p>
                <p><strong>Mã BN:</strong> {record.patient?.patientProfile?.patientCode}</p>
                <p><strong>Ngày sinh:</strong> {record.patient?.dob}</p>
              </div>
              <div>
                <p><strong>Ngày khám:</strong> {dayjs(record.createdAt).format('DD/MM/YYYY')}</p>
                <p><strong>Bác sĩ khám:</strong> {record.doctor?.fullName}</p>
                <p><strong>Chuyên khoa:</strong> {record.appointment?.specialty}</p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-bold border-b border-black mb-2 uppercase">1. Thông tin khám</h3>
              <p><strong>Lý do khám:</strong> {record.symptoms}</p>
              <p><strong>Tiền sử:</strong> {record.medicalHistory}</p>
              <p><strong>Khám lâm sàng:</strong> {record.clinicalExam}</p>
            </div>

            <div className="mt-6">
              <h3 className="font-bold border-b border-black mb-2 uppercase">2. Chẩn đoán & Điều trị</h3>
              <p><strong>Chẩn đoán:</strong> {record.diagnosis}</p>
              <p><strong>Phân biệt:</strong> {record.secondaryDiagnosis}</p>
              <p><strong>Hướng điều trị:</strong> {record.treatment}</p>
              <p><strong>Ghi chú:</strong> {record.notes}</p>
            </div>

            {/* In thêm đơn thuốc nếu có */}
            {record.prescriptions && record.prescriptions.length > 0 && (
              <div className="mt-6">
                <h3 className="font-bold border-b border-black mb-2 uppercase">3. Đơn thuốc chỉ định</h3>
                {record.prescriptions.map((pres: any, idx: number) => (
                  <div key={idx} className="mb-4">
                    <p className="font-bold">Mã đơn: {pres.code}</p>
                    <table className="w-full text-left mt-2 border-collapse border border-black">
                      <thead>
                        <tr>
                          <th className="border border-black p-2">Tên thuốc</th>
                          <th className="border border-black p-2">Liều dùng</th>
                          <th className="border border-black p-2">Số lượng</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pres.items?.map((item: any, i2: number) => (
                          <tr key={i2}>
                            <td className="border border-black p-2">{item.medicationName}</td>
                            <td className="border border-black p-2">{item.dosage}</td>
                            <td className="border border-black p-2">{item.remaining}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-12 text-right">
              <p>Ngày ..... Tháng ..... Năm 2026</p>
              <p className="font-bold mt-2">BÁC SĨ ĐIỀU TRỊ</p>
              <p className="mt-16">{record.doctor?.fullName}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
