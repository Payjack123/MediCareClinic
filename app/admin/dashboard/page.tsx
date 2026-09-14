'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, Users, CalendarDays, FileText, Pill, TestTube, 
  Bell, Settings, LogOut, Search, Activity, User, Building2, 
  ShieldCheck, Wallet, Receipt, Stethoscope, BriefcaseMedical, 
  CreditCard, Loader2, TrendingUp, TrendingDown, Clock, CheckCircle2
} from 'lucide-react';

import { getAdminDashboardData } from '@/app/admin/dashboard/actions';
import dayjs from 'dayjs';
import Sidebar from '@/app/admin/Sidebar';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getAdminDashboardData();
      if (res.success && res.data) {
        setData(res.data);
      } else {
        router.push('/login');
      }
      setIsLoading(false);
    };
    fetchData();
  }, [router]);

  const handleLogout = () => {
    router.push('/login');
  };

  if (isLoading || !data) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><Loader2 className="w-10 h-10 text-[#2563EB] animate-spin" /></div>;
  }

  // Colors for Doughnut Chart
  const specColors = ['#2563EB', '#EF4444', '#F59E0B', '#10B981', '#8B5CF6', '#EC4899'];

  // Current Date Time
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
            <div className="relative group">
              <input type="text" placeholder="Tìm kiếm..." className="pl-10 pr-4 py-2 bg-slate-100 border border-transparent rounded-full text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 w-64 transition-all outline-none"/>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={16}/>
            </div>
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
          
          <h1 className="text-2xl font-black text-slate-900 mb-6">Tổng quan hệ thống</h1>

          {/* 1. KHỐI CHỈ SỐ TỔNG QUAN */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                <Users size={28}/>
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium mb-1">Bệnh nhân</p>
                <div className="flex items-baseline gap-3">
                  <p className="text-3xl font-black text-slate-900">{data.kpis.patients.toLocaleString('vi-VN')}</p>
                  <span className="text-xs font-bold text-green-500 flex items-center bg-green-50 px-2 py-1 rounded-full"><TrendingUp size={12} className="mr-1"/>+12%</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
                <CalendarDays size={28}/>
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium mb-1">Lịch hẹn</p>
                <div className="flex items-baseline gap-3">
                  <p className="text-3xl font-black text-slate-900">{data.kpis.appointments.toLocaleString('vi-VN')}</p>
                  <span className="text-xs font-bold text-green-500 flex items-center bg-green-50 px-2 py-1 rounded-full"><TrendingUp size={12} className="mr-1"/>+8%</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center shrink-0">
                <Wallet size={28}/>
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium mb-1">Doanh thu</p>
                <div className="flex items-baseline gap-3">
                  <p className="text-3xl font-black text-slate-900">{(data.kpis.revenue / 1000000).toFixed(1)}Tr</p>
                  <span className="text-xs font-bold text-green-500 flex items-center bg-green-50 px-2 py-1 rounded-full"><TrendingUp size={12} className="mr-1"/>+15%</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center shrink-0">
                <Receipt size={28}/>
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium mb-1">Hóa đơn</p>
                <div className="flex items-baseline gap-3">
                  <p className="text-3xl font-black text-slate-900">{data.kpis.invoices.toLocaleString('vi-VN')}</p>
                  <span className="text-xs font-bold text-red-500 flex items-center bg-red-50 px-2 py-1 rounded-full"><TrendingDown size={12} className="mr-1"/>-5%</span>
                </div>
              </div>
            </div>
          </div>

          {/* GRID: LƯỢT KHÁM & BỆNH NHÂN THEO KHOA */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            
            {/* 2. THỐNG KÊ LƯỢT KHÁM */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-bold text-lg text-slate-900">Thống kê lượt khám</h3>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg cursor-pointer">Hôm nay</span>
                  <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-lg cursor-pointer">7 ngày qua</span>
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg cursor-pointer">30 ngày qua</span>
                </div>
              </div>
              
              <div className="flex-1 min-h-[200px] flex items-end justify-between px-4 pb-2 border-b border-l border-slate-200 relative pt-4">
                <div className="absolute top-[20%] left-0 w-full border-t border-dashed border-slate-200"></div>
                <div className="absolute top-[50%] left-0 w-full border-t border-dashed border-slate-200"></div>
                <div className="absolute top-[80%] left-0 w-full border-t border-dashed border-slate-200"></div>
                
                {data.appointmentsByDay.map((item: any, idx: number) => {
                  // Find max count to scale heights
                  const maxCount = Math.max(...data.appointmentsByDay.map((d:any) => d.count), 10);
                  const h = `${Math.max((item.count / maxCount) * 100, 5)}%`;
                  
                  return (
                    <div key={idx} className="flex flex-col items-center gap-3 group w-10 z-10">
                      <div className="w-full bg-blue-500 rounded-t-md hover:bg-blue-400 transition-all cursor-pointer relative" style={{ height: h }}>
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-bold text-white bg-slate-800 px-2 py-1 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                          {item.count}
                        </span>
                      </div>
                      <span className="text-xs font-medium text-slate-500">{item.day}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 3. CƠ CẤU BỆNH NHÂN THEO KHOA */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
              <h3 className="font-bold text-lg text-slate-900 mb-6">Bệnh nhân theo khoa</h3>
              
              <div className="relative flex-1 flex items-center justify-center min-h-[200px]">
                {/* CSS Doughnut Chart using conic-gradient */}
                {data.patientsBySpecialty.length > 0 ? (
                  <div 
                    className="w-48 h-48 rounded-full flex items-center justify-center relative shadow-inner"
                    style={{
                      background: `conic-gradient(${data.patientsBySpecialty.map((spec: any, idx: number) => {
                        const previousTotal = data.patientsBySpecialty.slice(0, idx).reduce((acc: number, curr: any) => acc + curr.percentage, 0);
                        return `${specColors[idx % specColors.length]} ${previousTotal}% ${previousTotal + spec.percentage}%`;
                      }).join(', ')})`
                    }}
                  >
                    <div className="w-32 h-32 bg-white rounded-full flex flex-col items-center justify-center shadow-md">
                      <span className="text-xs text-slate-500 font-medium">Tổng số</span>
                      <span className="text-xl font-black text-slate-900">{data.kpis.appointments}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-slate-500 text-sm">Chưa có dữ liệu</div>
                )}
              </div>

              <div className="mt-6 space-y-3">
                {data.patientsBySpecialty.map((spec: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: specColors[idx % specColors.length] }}></div>
                      <span className="text-slate-700 font-medium">{spec.name}</span>
                    </div>
                    <span className="font-bold text-slate-900">{spec.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* GRID: DOANH THU KHOA & THÔNG BÁO */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            
            {/* 4. DOANH THU THEO KHOA */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg text-slate-900">Doanh thu theo khoa</h3>
                <select className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none text-slate-700">
                  <option>30 ngày qua</option>
                  <option>7 ngày qua</option>
                  <option>Tháng này</option>
                  <option>Năm nay</option>
                </select>
              </div>
              <div className="space-y-5">
                {data.revenueBySpecialty.length > 0 ? data.revenueBySpecialty.map((dept: any, idx: number) => {
                   const maxRev = Math.max(...data.revenueBySpecialty.map((d:any) => d.amount), 1);
                   const w = `${Math.max((dept.amount / maxRev) * 100, 5)}%`;
                   
                   return (
                    <div key={idx}>
                      <div className="flex justify-between text-sm font-bold text-slate-700 mb-1.5">
                        <span>{dept.name}</span>
                        <span className="text-blue-600">{(dept.amount / 1000000).toFixed(1)} Tr</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full" style={{width: w}}></div>
                      </div>
                    </div>
                  )
                }) : (
                  <div className="text-slate-500 text-sm text-center py-4">Chưa có dữ liệu doanh thu</div>
                )}
              </div>
            </div>

            {/* 7. THÔNG BÁO HỆ THỐNG */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg text-slate-900">Thông báo hệ thống</h3>
                <span className="text-sm text-blue-600 font-bold cursor-pointer hover:underline">Xem tất cả</span>
              </div>
              <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {data.recentNotifications.length > 0 ? data.recentNotifications.map((notif: any, idx: number) => {
                  let icon = <Bell size={18} className="text-blue-500"/>;
                  let bg = 'bg-blue-50';
                  
                  if (notif.message.toLowerCase().includes('bệnh nhân mới') || notif.type === 'APPOINTMENT') {
                    icon = <User size={18} className="text-emerald-500"/>;
                    bg = 'bg-emerald-50';
                  } else if (notif.message.toLowerCase().includes('hóa đơn') || notif.type === 'INVOICE') {
                    icon = <Receipt size={18} className="text-orange-500"/>;
                    bg = 'bg-orange-50';
                  } else if (notif.message.toLowerCase().includes('xét nghiệm') || notif.type === 'LAB') {
                    icon = <TestTube size={18} className="text-purple-500"/>;
                    bg = 'bg-purple-50';
                  }

                  return (
                    <div key={idx} className="flex gap-4 items-start p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-slate-100">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${bg}`}>
                        {icon}
                      </div>
                      <div>
                        <p className="text-sm text-slate-800 font-medium line-clamp-2">{notif.message}</p>
                        <p className="text-xs text-slate-500 mt-1">{dayjs(notif.createdAt).format('HH:mm DD/MM/YYYY')}</p>
                      </div>
                    </div>
                  );
                }) : (
                  <div className="text-center text-slate-500 text-sm py-8">
                    {/* Placeholder notifications matching user's request example if DB is empty */}
                    <div className="flex gap-4 items-start p-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0"><User size={18}/></div>
                      <div className="text-left"><p className="text-sm font-medium">Bệnh nhân Nguyễn Văn A đã đến khám</p><p className="text-xs text-slate-500 mt-1">10 phút trước</p></div>
                    </div>
                    <div className="flex gap-4 items-start p-3">
                      <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0"><Receipt size={18}/></div>
                      <div className="text-left"><p className="text-sm font-medium">Hóa đơn HD000078 đã được thanh toán</p><p className="text-xs text-slate-500 mt-1">30 phút trước</p></div>
                    </div>
                    <div className="flex gap-4 items-start p-3">
                      <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center shrink-0"><TestTube size={18}/></div>
                      <div className="text-left"><p className="text-sm font-medium">Có kết quả xét nghiệm mới của BN Trần B</p><p className="text-xs text-slate-500 mt-1">1 giờ trước</p></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* GRID: LỊCH HẸN & HÓA ĐƠN GẦN ĐÂY */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* 5. LỊCH HẸN SẮP TỚI */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
              <div className="p-5 border-b border-slate-100 bg-white flex justify-between items-center">
                <h3 className="font-bold text-lg text-slate-900">Lịch hẹn sắp tới</h3>
                <span className="text-sm text-blue-600 font-bold cursor-pointer hover:underline">Xem tất cả</span>
              </div>
              <div className="flex-1 overflow-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase text-xs tracking-wider">
                    <tr>
                      <th className="px-5 py-4">Giờ</th>
                      <th className="px-5 py-4">Mã BN</th>
                      <th className="px-5 py-4">Bệnh nhân</th>
                      <th className="px-5 py-4">Bác sĩ</th>
                      <th className="px-5 py-4">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.upcomingAppointments.length > 0 ? data.upcomingAppointments.map((app: any, idx: number) => {
                      let statusStyle = "bg-slate-100 text-slate-700";
                      if (app.status === 'ĐANG KHÁM') statusStyle = "bg-blue-100 text-blue-700";
                      else if (app.status === 'CHECK-IN') statusStyle = "bg-emerald-100 text-emerald-700";
                      else if (app.status === 'ĐANG CHỜ') statusStyle = "bg-amber-100 text-amber-700";

                      return (
                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                          <td className="px-5 py-4 font-bold text-slate-900">{app.time}</td>
                          <td className="px-5 py-4 text-slate-500">{app.patientCode}</td>
                          <td className="px-5 py-4 font-medium text-slate-900">{app.patientName}</td>
                          <td className="px-5 py-4 text-slate-600">{app.doctorName}</td>
                          <td className="px-5 py-4">
                            <span className={`px-2.5 py-1 text-xs font-bold rounded-lg ${statusStyle}`}>
                              {app.status}
                            </span>
                          </td>
                        </tr>
                      )
                    }) : (
                      <tr><td colSpan={5} className="px-5 py-8 text-center text-slate-500">Không có lịch hẹn sắp tới</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 6. HÓA ĐƠN GẦN ĐÂY */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
              <div className="p-5 border-b border-slate-100 bg-white flex justify-between items-center">
                <h3 className="font-bold text-lg text-slate-900">Hóa đơn gần đây</h3>
                <span className="text-sm text-blue-600 font-bold cursor-pointer hover:underline">Xem tất cả</span>
              </div>
              <div className="flex-1 overflow-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase text-xs tracking-wider">
                    <tr>
                      <th className="px-5 py-4">Mã HĐ</th>
                      <th className="px-5 py-4">Bệnh nhân</th>
                      <th className="px-5 py-4">Tổng tiền</th>
                      <th className="px-5 py-4">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.recentInvoices.length > 0 ? data.recentInvoices.map((inv: any, idx: number) => {
                       const isPaid = inv.status === 'Đã thanh toán';
                       return (
                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                          <td className="px-5 py-4 font-bold text-blue-600">{inv.invoiceCode}</td>
                          <td className="px-5 py-4 font-medium text-slate-900">{inv.patientName}</td>
                          <td className="px-5 py-4 font-bold text-slate-900">{inv.amount.toLocaleString('vi-VN')}đ</td>
                          <td className="px-5 py-4">
                            <span className={`flex items-center gap-1 text-xs font-bold ${isPaid ? 'text-emerald-600' : 'text-rose-500'}`}>
                              {isPaid ? <CheckCircle2 size={14}/> : <Clock size={14}/>}
                              {inv.status}
                            </span>
                          </td>
                        </tr>
                      )
                    }) : (
                      <tr><td colSpan={4} className="px-5 py-8 text-center text-slate-500">Không có hóa đơn nào</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

        </div>
      </main>

    </div>
  );
}