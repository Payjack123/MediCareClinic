'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Bell, Search, Pill, User, Clock, 
  CalendarDays, Download, Printer, Filter, ShieldCheck, 
  ChevronRight, CalendarClock, ChevronDown, CheckCircle2,
  Lock, Calendar, FileText, ClipboardList, Stethoscope
} from 'lucide-react';
import PatientSidebar from '@/app/patient/Sidebar';
import { getPatientPrescriptionsData } from '@/app/patient/prescriptions/actions';

export default function PatientPrescriptionsPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Tất cả đơn thuốc');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const res = await getPatientPrescriptionsData();
      if (res.success && res.data) {
        setData(res.data);
      } else {
        router.push('/login');
      }
      setIsLoading(false);
    };
    fetchData();
  }, [router]);

  if (isLoading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="w-10 h-10 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const { patientInfo, prescriptions, kpis } = data;
  
  const filteredPrescriptions = prescriptions.filter((p: any) => {
    if (activeTab === 'Tất cả đơn thuốc') return true;
    if (activeTab === 'Đang sử dụng') return p.status === 'Đang sử dụng';
    if (activeTab === 'Sắp hết thuốc') return p.status === 'Đang sử dụng' && p.medicines.some((m:any) => m.quantity < 5); 
    if (activeTab === 'Đã hoàn thành') return p.status === 'Đã hoàn thành';
    return true;
  });

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] font-sans text-gray-800 overflow-hidden">
      
      {/* SIDEBAR */}
      <PatientSidebar activePage="prescriptions" />

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* TOP HEADER */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-8 shrink-0 z-10">
          <div className="flex items-center gap-3 w-full max-w-xl">
            <div className="bg-blue-50 p-2.5 rounded-xl text-[#2563EB]">
              <Pill size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black text-gray-900">Đơn thuốc của tôi</h1>
              <p className="text-gray-500 text-xs mt-0.5">Xem và quản lý các đơn thuốc đã được bác sĩ kê.</p>
            </div>
          </div>
          <div className="flex items-center gap-5 ml-auto">
            <button className="relative p-2.5 text-gray-500 hover:bg-blue-50 hover:text-[#2563EB] rounded-full transition bg-white border border-gray-200 shadow-sm">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-5 border-l border-gray-200 cursor-pointer group">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-900 group-hover:text-[#2563EB] transition">{patientInfo.name}</p>

              </div>
              <img src={patientInfo.avatar} alt="Avatar" className="w-11 h-11 rounded-full border-2 border-white shadow-sm group-hover:shadow-md transition" />
              <ChevronDown size={16} className="text-gray-400" />
            </div>
          </div>
        </header>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
          <div className="w-full max-w-[1600px] xl:max-w-none mx-auto space-y-6">
            
            {/* KPI Cards (Compact & Balanced) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-[#2563EB] text-white px-5 py-4 rounded-2xl flex items-center justify-between shadow-sm shadow-blue-500/20 hover:-translate-y-0.5 transition-transform cursor-pointer">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <FileText size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider opacity-80 mb-0.5">Tổng đơn</p>
                    <p className="text-2xl font-black leading-none">{kpis.total}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white border border-gray-200 px-5 py-4 rounded-2xl flex items-center justify-between shadow-sm hover:border-green-300 hover:shadow-md transition-all cursor-pointer">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Đang dùng</p>
                    <p className="text-2xl font-black text-gray-900 leading-none">{kpis.using}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 px-5 py-4 rounded-2xl flex items-center justify-between shadow-sm hover:border-orange-300 hover:shadow-md transition-all cursor-pointer">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Sắp hết</p>
                    <p className="text-2xl font-black text-gray-900 leading-none">{kpis.almostEmpty}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 px-5 py-4 rounded-2xl flex items-center justify-between shadow-sm hover:border-purple-300 hover:shadow-md transition-all cursor-pointer">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Hoàn thành</p>
                    <p className="text-2xl font-black text-gray-900 leading-none">{kpis.completed}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* TABS & SEARCH */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 border-b border-gray-200">
              <div className="flex gap-8 w-full overflow-x-auto custom-scrollbar">
                {['Tất cả đơn thuốc', 'Đang sử dụng', 'Sắp hết thuốc', 'Đã hoàn thành'].map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${activeTab === tab ? 'text-[#2563EB] border-[#2563EB]' : 'text-gray-500 border-transparent hover:text-gray-700'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              
              <div className="flex items-center gap-3 pb-2 w-full sm:w-auto shrink-0">
                <div className="relative">
                  <input type="text" placeholder="Tìm kiếm đơn thuốc..." className="w-64 pl-4 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-[#2563EB]" />
                  <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
                <button className="flex items-center gap-2 px-3 py-2 border border-[#2563EB] text-[#2563EB] font-bold rounded-lg text-sm bg-blue-50/50 hover:bg-blue-100 transition-colors">
                  <Filter size={16} /> Bộ lọc
                </button>
              </div>
            </div>

            {/* LIST LAYOUT */}
            <div className="w-full space-y-4">
              {filteredPrescriptions.length > 0 ? (
                <>
                  <div className="flex flex-col gap-4">
                    {filteredPrescriptions.map((p: any) => {
                      const displayDiagnosis = p.diagnosis && p.diagnosis.toLowerCase() !== 'chưa chẩn đoán' && p.diagnosis.toLowerCase() !== 'không có' ? p.diagnosis : 'Đơn thuốc điều trị chung';
                      return (
                      <div 
                        key={p.id}
                        onClick={() => router.push(`/patient/prescriptions/${p.id}`)}
                        className="bg-white rounded-2xl border border-gray-100 hover:border-[#2563EB] hover:shadow-lg transition-all cursor-pointer flex flex-col md:flex-row items-center overflow-hidden group w-full"
                      >
                        {/* Cột trái: Lịch & Mã đơn */}
                        <div className="p-5 flex items-center gap-5 w-full md:w-64 md:border-r border-gray-100 bg-gray-50/50">
                          <div className="w-16 h-16 rounded-2xl bg-white border border-gray-200 text-blue-600 flex flex-col items-center justify-center shrink-0 shadow-sm group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white transition-colors">
                            <span className="text-2xl font-black leading-none mb-1">{p.day}</span>
                            <span className="text-[10px] font-bold uppercase tracking-wider">{p.monthYear}</span>
                          </div>
                          <div className="flex flex-col justify-center">
                            <p className="text-[11px] text-gray-500 font-bold mb-1.5 uppercase tracking-widest">MÃ ĐƠN</p>
                            <p className="text-sm font-black text-gray-900 bg-white px-2.5 py-1 rounded-md border border-gray-200 shadow-sm inline-block">
                              {p.code || `DT${p.id}`}
                            </p>
                          </div>
                        </div>

                        {/* Cột giữa: Chẩn đoán & Bác sĩ */}
                        <div className="p-5 flex-1 min-w-0 w-full flex flex-col justify-center">
                          <h3 className="font-bold text-gray-900 text-lg mb-2.5 line-clamp-1 group-hover:text-blue-600 transition-colors">
                            {displayDiagnosis}
                          </h3>
                          <div className="flex flex-wrap items-center gap-5 text-sm text-gray-600">
                            <p className="flex items-center gap-1.5 font-medium">
                              <User size={15} className="text-gray-400" />
                              <span className="text-gray-800">{p.doctor}</span>
                            </p>
                            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                            <p className="flex items-center gap-1.5 font-medium">
                              <Pill size={15} className="text-gray-400" />
                              <span className="text-gray-800">{p.drugCount} loại thuốc</span>
                            </p>
                          </div>
                        </div>

                        {/* Cột phải: Trạng thái & Action */}
                        <div className="p-5 w-full md:w-48 flex md:flex-col items-center justify-between gap-4 md:items-end border-t md:border-t-0 border-gray-100 bg-gray-50/30">
                          <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border tracking-wide uppercase ${
                            p.status === 'Đang sử dụng' ? 'bg-green-50 text-green-700 border-green-200' :
                            p.status === 'Đã hoàn thành' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                            'bg-orange-50 text-orange-700 border-orange-200'
                          }`}>
                            {p.status}
                          </span>
                          <div className="text-sm font-bold text-blue-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform bg-blue-50 px-3 py-1.5 rounded-lg">
                            Chi tiết <ChevronRight size={16} />
                          </div>
                        </div>
                      </div>
                    )})}
                  </div>
                  
                  <div className="pt-4 flex justify-center">
                    <button className="px-6 py-3 bg-white border border-gray-200 rounded-xl text-[#2563EB] text-sm font-bold flex items-center justify-center gap-2 shadow-sm hover:bg-blue-50 transition-colors">
                      Xem thêm <ChevronDown size={16} />
                    </button>
                  </div>
                </>
              ) : (
                <div className="bg-white p-16 rounded-2xl border border-gray-100 flex flex-col items-center justify-center text-gray-400">
                  <Pill size={48} className="opacity-20 mb-4" />
                  <p className="text-gray-500 text-base font-medium">Không tìm thấy đơn thuốc nào.</p>
                </div>
              )}
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}