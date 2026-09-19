'use client';
import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Download, Printer, CalendarDays, 
  User, Stethoscope, ClipboardList, FileText, 
  CalendarClock, Calendar, ChevronRight, Loader2
} from 'lucide-react';
import PatientSidebar from '@/app/patient/Sidebar';
import { getPrescriptionById } from '../actions';

export default function PatientPrescriptionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const id = parseInt(resolvedParams.id);
  const [prescription, setPrescription] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const res = await getPrescriptionById(id);
        if (res.success && res.data) {
          setPrescription(res.data);
        } else {
          setErrorMsg(res.message || 'Lỗi tải dữ liệu');
        }
      }
      setIsLoading(false);
    };
    fetchData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <Loader2 className="w-10 h-10 text-[#2563EB] animate-spin" />
      </div>
    );
  }

  if (errorMsg || !prescription) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
          <p className="text-red-500 font-bold mb-4">{errorMsg || 'Không tìm thấy thông tin'}</p>
          <button onClick={() => router.push('/patient/prescriptions')} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold">
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] font-sans text-gray-800 overflow-hidden">
      
      {/* SIDEBAR */}
      <PatientSidebar activePage="prescriptions" />

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* HEADER */}
        <header className="bg-white border-b border-gray-100 shrink-0 z-10 px-8 py-4 flex items-center justify-between sticky top-0">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push("/patient/prescriptions")} className="p-2 hover:bg-gray-50 rounded-full transition-colors text-gray-500">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900 leading-none mb-1.5 flex items-center gap-2">
                Chi tiết đơn thuốc
              </h1>
              <div className="text-[13px] text-gray-500 flex items-center gap-1.5">
                <Link href="/patient/prescriptions" className="hover:text-[#2563EB] transition-colors">Đơn thuốc của tôi</Link>
                <ChevronRight size={12} className="text-gray-400" />
                <span className="text-gray-700">{prescription.code}</span>
              </div>
            </div>
          </div>
        </header>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
          <div className="w-full max-w-5xl mx-auto space-y-6">
            
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 xl:p-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                  Mã đơn: <span className="text-[#2563EB]">{prescription.code}</span>
                </h2>
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-700 hover:border-[#2563EB] hover:text-[#2563EB] bg-white rounded-xl text-sm font-bold transition shadow-sm">
                    <Download size={18} /> Tải PDF
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2.5 border border-[#2563EB] text-[#2563EB] bg-blue-50/50 hover:bg-blue-100 rounded-xl text-sm font-bold transition shadow-sm">
                    <Printer size={18} /> In đơn thuốc
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 border border-gray-100 rounded-2xl mb-8 divide-x divide-gray-100 text-sm bg-gray-50/50">
                <div className="px-2">
                  <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-2">Ngày khám</p>
                  <p className="font-bold text-gray-900 text-base">{prescription.date}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{prescription.time}</p>
                </div>
                <div className="px-6">
                  <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-2">Bác sĩ khám</p>
                  <p className="font-bold text-gray-900 text-base">{prescription.doctor}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{prescription.doctorSpecialty}</p>
                </div>
                <div className="px-6">
                  <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-2">Chẩn đoán</p>
                  <p className="font-bold text-gray-900 text-base leading-relaxed pr-2">{prescription.diagnosis}</p>
                </div>
                <div className="px-6 flex flex-col justify-center">
                  <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-2">Trạng thái</p>
                  <div><span className={`px-4 py-1.5 rounded-lg text-xs font-bold border inline-block ${prescription.statusColor}`}>{prescription.status}</span></div>
                </div>
              </div>

              <h3 className="font-bold text-gray-900 mb-4 text-lg">Danh sách thuốc</h3>
              <div className="overflow-x-auto border border-gray-100 rounded-2xl mb-8 shadow-sm">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-500 bg-gray-50 border-b border-gray-100 uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4 font-bold">STT</th>
                      <th className="px-6 py-4 font-bold">Tên thuốc</th>
                      <th className="px-6 py-4 font-bold">Hàm lượng</th>
                      <th className="px-6 py-4 font-bold">Dạng bào chế</th>
                      <th className="px-6 py-4 font-bold text-center">Số lượng</th>
                      <th className="px-6 py-4 font-bold">Cách dùng / Ghi chú</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {prescription.medicines.map((med: any, idx: number) => (
                      <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-5 text-gray-500 font-medium">{idx + 1}</td>
                        <td className="px-6 py-5 font-bold text-gray-900 text-base">{med.name}</td>
                        <td className="px-6 py-5 text-gray-600">{med.dosage || '-'}</td>
                        <td className="px-6 py-5 text-gray-600">{med.form || '-'}</td>
                        <td className="px-6 py-5 font-black text-gray-900 text-center text-base">{med.quantity}</td>
                        <td className="px-6 py-5 text-gray-600 leading-relaxed whitespace-pre-line font-medium">
                          {med.note}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                
                <div className="border border-blue-100 bg-blue-50/40 rounded-2xl p-6">
                  <h3 className="font-bold text-[#2563EB] mb-4 flex items-center gap-2 text-base">
                    <FileText size={20} /> Lưu ý của bác sĩ
                  </h3>
                  <ul className="space-y-3 text-sm text-gray-800 list-disc pl-5">
                    {prescription.instructions.map((inst: string, idx: number) => (
                      <li key={idx} className="leading-relaxed font-medium">{inst}</li>
                    ))}
                  </ul>
                </div>

                <div className="border border-gray-100 rounded-2xl p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-[#2563EB] mb-4 flex items-center gap-2 text-base">
                      <CalendarClock size={20} /> Tái khám
                    </h3>
                    <p className="text-gray-500 text-sm font-medium mb-1.5 uppercase tracking-wider">Ngày tái khám dự kiến</p>
                    <p className="font-black text-gray-900 text-xl">{prescription.followUpDate || 'Không có hẹn'}</p>
                  </div>
                  {prescription.followUpDate && (
                    <div className="mt-6 flex justify-start">
                      <button className="px-6 py-3 border border-[#2563EB] bg-[#2563EB] text-white hover:bg-blue-700 transition rounded-xl text-sm font-bold shadow-sm flex items-center gap-2">
                        <Calendar size={18}/> Đặt lịch tái khám
                      </button>
                    </div>
                  )}
                </div>

              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
