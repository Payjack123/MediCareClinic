'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, Users, CalendarDays, FileText, Pill, TestTube, 
  Bell, Settings, LogOut, Search, Activity, User, Building2, 
  ShieldCheck, Wallet, Receipt, Stethoscope, BriefcaseMedical, 
  CreditCard, Loader2, TrendingUp, Filter, Printer, Download, Clock
} from 'lucide-react';

import { getAdminReportsData, getFilterOptions, ReportFilters } from '@/app/admin/reports/actions';
import dayjs from 'dayjs';
import Sidebar from '@/app/admin/Sidebar';

export default function AdminReportsPage() {
  const router = useRouter();
  
  // Data State
  const [data, setData] = useState<any>(null);
  const [options, setOptions] = useState<{ specialties: string[], doctors: any[] }>({ specialties: [], doctors: [] });
  const [isLoading, setIsLoading] = useState(true);

  // Filter State
  const [filters, setFilters] = useState<ReportFilters>({
    startDate: dayjs().startOf('month').format('YYYY-MM-DD'),
    endDate: dayjs().endOf('month').format('YYYY-MM-DD'),
    specialty: '',
    doctorId: undefined
  });

  // Fetch initial filter options
  useEffect(() => {
    const fetchOptions = async () => {
      const res = await getFilterOptions();
      if (res.success && res.data) {
        setOptions(res.data);
      }
    };
    fetchOptions();
  }, []);

  // Fetch report data based on filters
  const fetchReportData = async () => {
    setIsLoading(true);
    const res = await getAdminReportsData(filters);
    if (res.success && res.data) {
      setData(res.data);
    } else {
      if (res.message === 'Không có quyền truy cập') {
        router.push('/login');
      }
    }
    setIsLoading(false);
  };

  // Initial fetch
  useEffect(() => {
    fetchReportData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    router.push('/login');
  };

  // UI Helpers
  const specColors = ['#2563EB', '#EF4444', '#F59E0B', '#10B981', '#8B5CF6', '#EC4899'];
  const currentDateTime = dayjs().format('DD/MM/YYYY HH:mm');

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans text-slate-800 overflow-hidden">
      
      {/* ==========================================
          1. SIDEBAR
      ========================================== */}
      <Sidebar />

      {/* ==========================================
          2. MAIN CONTENT AREA
      ========================================== */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* TOP HEADER */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 z-10 shadow-sm">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="text-blue-600"/> Báo cáo & Thống kê
            </h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-sm font-medium text-slate-500 bg-slate-100 px-4 py-2 rounded-full border border-slate-200 flex items-center gap-2">
              <Clock size={16}/> {currentDateTime}
            </div>
            
            <div className="flex items-center gap-4 pl-6 border-l border-slate-200">
              <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition">
                <Bell size={20}/>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center gap-3 cursor-pointer group" onClick={handleLogout}>
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
          
          {/* BỘ LỌC (FILTER BAR) */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 mb-8 flex flex-wrap items-end gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Từ ngày</label>
              <input 
                type="date" 
                className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none w-40"
                value={filters.startDate}
                onChange={e => setFilters({...filters, startDate: e.target.value})}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Đến ngày</label>
              <input 
                type="date" 
                className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none w-40"
                value={filters.endDate}
                onChange={e => setFilters({...filters, endDate: e.target.value})}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Khoa</label>
              <select 
                className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none w-48"
                value={filters.specialty}
                onChange={e => setFilters({...filters, specialty: e.target.value})}
              >
                <option value="">Tất cả các khoa</option>
                {options.specialties.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Bác sĩ</label>
              <select 
                className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none w-48"
                value={filters.doctorId || ''}
                onChange={e => setFilters({...filters, doctorId: e.target.value ? Number(e.target.value) : undefined})}
              >
                <option value="">Tất cả bác sĩ</option>
                {options.doctors.map(d => <option key={d.id} value={d.id}>{d.fullName}</option>)}
              </select>
            </div>
            
            <button 
              onClick={fetchReportData}
              disabled={isLoading}
              className="ml-auto bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 shadow-md transition flex items-center gap-2 text-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 size={18} className="animate-spin"/> : <Filter size={18}/>}
              Xem báo cáo
            </button>
          </div>

          {isLoading || !data ? (
            <div className="py-20 flex justify-center"><Loader2 className="w-10 h-10 text-blue-600 animate-spin" /></div>
          ) : (
            <>
              {/* 1. KHỐI CHỈ SỐ KPI */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-5 relative overflow-hidden group hover:border-blue-300 transition-colors">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                  <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shrink-0 relative z-10 shadow-sm">
                    <CalendarDays size={26} strokeWidth={2.5}/>
                  </div>
                  <div className="relative z-10">
                    <p className="text-sm text-slate-500 font-bold mb-1 uppercase tracking-wide">Lượt khám</p>
                    <p className="text-3xl font-black text-slate-900">{data.kpis.appointments.toLocaleString('vi-VN')}</p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-5 relative overflow-hidden group hover:border-emerald-300 transition-colors">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0 relative z-10 shadow-sm">
                    <Users size={26} strokeWidth={2.5}/>
                  </div>
                  <div className="relative z-10">
                    <p className="text-sm text-slate-500 font-bold mb-1 uppercase tracking-wide">Bệnh nhân</p>
                    <p className="text-3xl font-black text-slate-900">{data.kpis.patients.toLocaleString('vi-VN')}</p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-5 relative overflow-hidden group hover:border-orange-300 transition-colors">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                  <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center shrink-0 relative z-10 shadow-sm">
                    <Wallet size={26} strokeWidth={2.5}/>
                  </div>
                  <div className="relative z-10">
                    <p className="text-sm text-slate-500 font-bold mb-1 uppercase tracking-wide">Doanh thu</p>
                    <p className="text-3xl font-black text-slate-900">{(data.kpis.revenue / 1000000).toLocaleString('vi-VN', { maximumFractionDigits: 1 })} Tr</p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-5 relative overflow-hidden group hover:border-purple-300 transition-colors">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                  <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center shrink-0 relative z-10 shadow-sm">
                    <Receipt size={26} strokeWidth={2.5}/>
                  </div>
                  <div className="relative z-10">
                    <p className="text-sm text-slate-500 font-bold mb-1 uppercase tracking-wide">Hóa đơn</p>
                    <p className="text-3xl font-black text-slate-900">{data.kpis.invoices.toLocaleString('vi-VN')}</p>
                  </div>
                </div>
              </div>

              {/* GRID: LƯỢT KHÁM & BỆNH NHÂN THEO KHOA */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                
                {/* 2. LƯỢT KHÁM THEO NGÀY (Line Chart CSS) */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
                  <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
                    <h3 className="font-bold text-lg text-slate-900 uppercase tracking-wide flex items-center gap-2">
                      <TrendingUp className="text-blue-500"/> Lượt khám theo ngày
                    </h3>
                  </div>
                  
                  <div className="flex-1 min-h-[250px] flex items-end justify-between px-6 pb-4 border-b-2 border-l-2 border-slate-200 relative pt-6 overflow-x-auto">
                    {/* Grid lines */}
                    <div className="absolute top-[20%] left-0 w-full border-t border-dashed border-slate-200"></div>
                    <div className="absolute top-[50%] left-0 w-full border-t border-dashed border-slate-200"></div>
                    <div className="absolute top-[80%] left-0 w-full border-t border-dashed border-slate-200"></div>
                    
                    {data.appointmentsByDay.length > 0 ? data.appointmentsByDay.map((item: any, idx: number) => {
                      const maxCount = Math.max(...data.appointmentsByDay.map((d:any) => d.count), 5);
                      const h = `${Math.max((item.count / maxCount) * 100, 5)}%`;
                      
                      return (
                        <div key={idx} className="flex flex-col items-center gap-3 group min-w-[40px] z-10">
                          <div className="w-8 bg-gradient-to-t from-blue-600 to-cyan-400 rounded-t-md hover:opacity-80 transition-all cursor-pointer relative shadow-sm" style={{ height: h }}>
                            <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-bold text-white bg-slate-800 px-2.5 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                              {item.count}
                            </span>
                          </div>
                          <span className="text-xs font-bold text-slate-500">{item.day}</span>
                        </div>
                      )
                    }) : (
                      <div className="absolute inset-0 flex items-center justify-center text-slate-500 font-medium">Không có dữ liệu trong khoảng thời gian này</div>
                    )}
                  </div>
                </div>

                {/* 3. CƠ CẤU BỆNH NHÂN THEO KHOA */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
                  <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                    <h3 className="font-bold text-lg text-slate-900 uppercase tracking-wide flex items-center gap-2">
                      <Users className="text-emerald-500"/> Bệnh nhân theo khoa
                    </h3>
                  </div>
                  
                  <div className="relative flex-1 flex items-center justify-center min-h-[220px]">
                    {data.patientsBySpecialty.length > 0 ? (
                      <div 
                        className="w-52 h-52 rounded-full flex items-center justify-center relative shadow-inner"
                        style={{
                          background: `conic-gradient(${data.patientsBySpecialty.map((spec: any, idx: number) => {
                            const previousTotal = data.patientsBySpecialty.slice(0, idx).reduce((acc: number, curr: any) => acc + curr.percentage, 0);
                            return `${specColors[idx % specColors.length]} ${previousTotal}% ${previousTotal + spec.percentage}%`;
                          }).join(', ')})`
                        }}
                      >
                        <div className="w-36 h-36 bg-white rounded-full flex flex-col items-center justify-center shadow-lg border-4 border-slate-50">
                          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Tổng lịch</span>
                          <span className="text-2xl font-black text-slate-900">{data.kpis.appointments}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-slate-500 text-sm font-medium">Chưa có dữ liệu</div>
                    )}
                  </div>

                  <div className="mt-8 space-y-3">
                    {data.patientsBySpecialty.map((spec: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between text-sm p-2 hover:bg-slate-50 rounded-lg transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: specColors[idx % specColors.length] }}></div>
                          <span className="text-slate-700 font-bold">{spec.name}</span>
                        </div>
                        <span className="font-black text-slate-900 bg-slate-100 px-2 py-1 rounded-md">{spec.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* GRID: DOANH THU KHOA */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
                <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
                  <h3 className="font-bold text-lg text-slate-900 uppercase tracking-wide flex items-center gap-2">
                    <Wallet className="text-orange-500"/> Doanh thu theo khoa
                  </h3>
                </div>
                <div className="space-y-6">
                  {data.revenueBySpecialty.length > 0 ? data.revenueBySpecialty.map((dept: any, idx: number) => {
                    const maxRev = Math.max(...data.revenueBySpecialty.map((d:any) => d.amount), 1);
                    const w = `${Math.max((dept.amount / maxRev) * 100, 5)}%`;
                    
                    return (
                      <div key={idx} className="group">
                        <div className="flex justify-between text-sm font-bold text-slate-700 mb-2">
                          <span className="group-hover:text-blue-600 transition-colors">{dept.name}</span>
                          <span className="text-blue-700 font-black bg-blue-50 px-3 py-1 rounded-lg">{(dept.amount).toLocaleString('vi-VN')} đ</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden shadow-inner">
                          <div className="bg-gradient-to-r from-blue-600 to-cyan-400 h-full rounded-full transition-all duration-1000 ease-out" style={{width: w}}></div>
                        </div>
                      </div>
                    )
                  }) : (
                    <div className="text-slate-500 text-sm text-center py-10 font-medium bg-slate-50 rounded-xl">Không có dữ liệu doanh thu trong khoảng thời gian này</div>
                  )}
                </div>
              </div>

              {/* BOTTOM ACTIONS */}
              <div className="flex flex-wrap items-center justify-center gap-4 py-4">
                <button className="bg-red-50 text-red-600 border border-red-200 px-6 py-3 rounded-xl font-bold hover:bg-red-600 hover:text-white shadow-sm transition flex items-center gap-2">
                  <Download size={18}/> Xuất PDF
                </button>
                <button className="bg-emerald-50 text-emerald-600 border border-emerald-200 px-6 py-3 rounded-xl font-bold hover:bg-emerald-600 hover:text-white shadow-sm transition flex items-center gap-2">
                  <Download size={18}/> Xuất Excel
                </button>
                <button className="bg-slate-800 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-900 shadow-md transition flex items-center gap-2">
                  <Printer size={18}/> In báo cáo
                </button>
              </div>

            </>
          )}

        </div>
      </main>
    </div>
  );
}
