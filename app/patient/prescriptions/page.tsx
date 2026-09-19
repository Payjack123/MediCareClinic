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
          <div className="flex items-center w-full max-w-xl relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Tìm kiếm..." 
              className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#2563EB] focus:bg-white outline-none transition-all shadow-sm"
            />
          </div>
          <div className="flex items-center gap-5 ml-auto">
            <button className="relative p-2.5 text-gray-500 hover:bg-blue-50 hover:text-[#2563EB] rounded-full transition bg-white border border-gray-200 shadow-sm">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-5 border-l border-gray-200 cursor-pointer group">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-900 group-hover:text-[#2563EB] transition">{patientInfo.name}</p>
                <p className="text-xs text-gray-500 font-medium">Bệnh nhân</p>
              </div>
              <img src={patientInfo.avatar} alt="Avatar" className="w-11 h-11 rounded-full border-2 border-white shadow-sm group-hover:shadow-md transition" />
              <ChevronDown size={16} className="text-gray-400" />
            </div>
          </div>
        </header>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
          <div className="w-full max-w-[1600px] xl:max-w-none mx-auto space-y-6">
            
            {/* Tiêu đề */}
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 p-2.5 rounded-xl text-[#2563EB]">
                <Pill size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-black text-gray-900">Đơn thuốc của tôi</h1>
                <p className="text-gray-500 text-sm mt-0.5">Xem và quản lý các đơn thuốc đã được bác sĩ kê.</p>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 text-[#2563EB] rounded-xl flex items-center justify-center shrink-0">
                  <Lock size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Tổng đơn thuốc</p>
                  <p className="text-2xl font-black text-gray-900 mt-0.5">{kpis.total} <span className="text-sm font-medium text-gray-500 normal-case">đơn thuốc</span></p>
                </div>
              </div>
              
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center shrink-0 border border-green-100">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Đang sử dụng</p>
                  <p className="text-2xl font-black text-gray-900 mt-0.5">{kpis.using} <span className="text-sm font-medium text-gray-500 normal-case">đơn thuốc</span></p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center shrink-0">
                  <Clock size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Sắp hết thuốc</p>
                  <p className="text-2xl font-black text-gray-900 mt-0.5">{kpis.almostEmpty} <span className="text-sm font-medium text-gray-500 normal-case">đơn thuốc</span></p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center shrink-0">
                  <Calendar size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Đã hoàn thành</p>
                  <p className="text-2xl font-black text-gray-900 mt-0.5">{kpis.completed} <span className="text-sm font-medium text-gray-500 normal-case">đơn thuốc</span></p>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredPrescriptions.map((p: any) => (
                      <div 
                        key={p.id}
                        onClick={() => router.push(`/patient/prescriptions/${p.id}`)}
                        className="bg-white rounded-2xl border border-gray-100 hover:border-[#2563EB] hover:ring-1 hover:ring-[#2563EB] p-5 cursor-pointer transition-all shadow-sm flex flex-col justify-between group"
                      >
                        <div>
                          <div className="flex justify-between items-start mb-4">
                            <span className={`px-2.5 py-1 rounded text-[11px] font-bold border inline-block ${p.statusColor}`}>{p.status}</span>
                            <span className="text-gray-500 text-xs font-bold">{p.code || `DT${p.id}`}</span>
                          </div>
                          
                          <div className="flex items-center gap-5 mb-4">
                            <div className="text-center w-14 shrink-0">
                              <p className="text-3xl font-black text-gray-900 leading-none mb-1">{p.day}</p>
                              <p className="text-[11px] text-gray-500 font-bold uppercase">{p.monthYear}</p>
                            </div>
                            <div className="border-l border-gray-100 pl-5">
                              <h3 className="font-bold text-gray-900 text-base mb-1.5 line-clamp-1">{p.diagnosis}</h3>
                              <p className="text-sm text-gray-500 flex items-center gap-1.5"><User size={14}/> {p.doctor}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-4">
                          <span className="text-sm text-gray-500 font-medium">{p.drugCount} loại thuốc</span>
                          <span className="text-sm text-[#2563EB] font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            Xem chi tiết <ChevronRight size={16} />
                          </span>
                        </div>
                      </div>
                    ))}
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