'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { performLogout } from '@/lib/auth-client'; // <-- Import useRouter
import {
  LayoutDashboard, CalendarDays, Users, FileText, Pill, TestTube,
  BarChart3, Bell, User, Settings, LogOut, Search,
  CheckCircle2, Activity, Printer,
  TrendingUp, Star, DollarSign, Download, ArrowUpRight
} from 'lucide-react';

import DoctorSidebar from "@/app/doctor/Sidebar";

export default function ReportsPage() {
  const router = useRouter(); // <-- Khởi tạo router
  const [dateRange, setDateRange] = useState('Tháng này');

  // Hàm xử lý đăng xuất
  const handleLogout = async () => {
    await performLogout('/login');
  };

  return (
    <div className="min-h-screen flex bg-gray-50 font-sans text-gray-800 overflow-hidden">

      {/* ==========================================
          1. SIDEBAR (Đồng bộ chuẩn)
      ========================================== */}
      <DoctorSidebar activePage="reports" />

      {/* ==========================================
          2. MAIN CONTENT
      ========================================== */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">

        {/* TOP HEADER */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0 z-10">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">Báo cáo & Thống kê</h1>
            <p className="text-sm text-gray-500">Theo dõi hoạt động phòng khám bằng biểu đồ trực quan</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative">
              <input type="text" placeholder="Tìm kiếm báo cáo..." className="pl-10 pr-4 py-2 bg-gray-100 border-none rounded-full text-sm focus:ring-2 focus:ring-[#2563EB] w-64 outline-none transition" />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            </div>
            <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-gray-900">BS. Nguyễn Văn Bình</p>
                <div className="flex text-yellow-400 text-xs justify-end">
                  <Star fill="currentColor" size={12} /><Star fill="currentColor" size={12} /><Star fill="currentColor" size={12} /><Star fill="currentColor" size={12} /><Star fill="currentColor" size={12} />
                </div>
              </div>
              <img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop" alt="Doctor" className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover" />
            </div>
          </div>
        </header>

        {/* SCROLLABLE BODY */}
        <div className="flex-1 overflow-y-auto p-8 bg-gray-50/50">

          {/* 3. BỘ LỌC CHÍNH */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-8 flex justify-between items-center">
            <div className="flex gap-4 w-2/3">
              <select
                className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#2563EB] outline-none"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option>Hôm nay</option>
                <option>Tuần này</option>
                <option>Tháng này</option>
                <option>Năm nay</option>
              </select>
              <select className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#2563EB] outline-none">
                <option>Tất cả Bác sĩ</option>
                <option>BS. Nguyễn Văn Bình</option>
                <option>BS. Trần Thị An</option>
              </select>
              <select className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#2563EB] outline-none">
                <option>Loại Báo cáo</option>
                <option>Bệnh nhân & Lịch khám</option>
                <option>Doanh thu & Tài chính</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button className="bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl font-bold hover:bg-gray-50 transition flex items-center gap-2">
                <Printer size={18} /> In báo cáo
              </button>
              <button className="bg-[#2563EB] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 shadow-md transition flex items-center gap-2">
                <Download size={18} /> Xuất Excel
              </button>
            </div>
          </div>

          {/* 4. DASHBOARD TỔNG QUAN (6 Cards) */}
          <div className="grid grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition">
              <div className="absolute right-0 top-0 opacity-10 group-hover:scale-110 transition-transform"><Users size={80} className="text-[#2563EB]" /></div>
              <p className="text-sm text-gray-500 font-medium mb-1">Bệnh nhân mới</p>
              <p className="text-3xl font-black text-gray-900">2,450</p>
              <p className="text-xs text-green-600 font-bold mt-2 flex items-center gap-1"><ArrowUpRight size={14} /> +12.5% so với kỳ trước</p>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition">
              <div className="absolute right-0 top-0 opacity-10 group-hover:scale-110 transition-transform"><CalendarDays size={80} className="text-green-500" /></div>
              <p className="text-sm text-gray-500 font-medium mb-1">Lịch khám</p>
              <p className="text-3xl font-black text-gray-900">1,230</p>
              <p className="text-xs text-green-600 font-bold mt-2 flex items-center gap-1"><ArrowUpRight size={14} /> +5.2% so với kỳ trước</p>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition">
              <div className="absolute right-0 top-0 opacity-10 group-hover:scale-110 transition-transform"><CheckCircle2 size={80} className="text-blue-500" /></div>
              <p className="text-sm text-gray-500 font-medium mb-1">Tỷ lệ hoàn thành</p>
              <p className="text-3xl font-black text-gray-900">89%</p>
              <p className="text-xs text-green-600 font-bold mt-2 flex items-center gap-1"><ArrowUpRight size={14} /> +2.1% so với kỳ trước</p>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition">
              <div className="absolute right-0 top-0 opacity-10 group-hover:scale-110 transition-transform"><Pill size={80} className="text-purple-500" /></div>
              <p className="text-sm text-gray-500 font-medium mb-1">Đơn thuốc đã kê</p>
              <p className="text-3xl font-black text-gray-900">3,200</p>
              <p className="text-xs text-green-600 font-bold mt-2 flex items-center gap-1"><ArrowUpRight size={14} /> +8.4% so với kỳ trước</p>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition">
              <div className="absolute right-0 top-0 opacity-10 group-hover:scale-110 transition-transform"><DollarSign size={80} className="text-yellow-500" /></div>
              <p className="text-sm text-gray-500 font-medium mb-1">Doanh thu (VNĐ)</p>
              <p className="text-3xl font-black text-[#2563EB]">425<span className="text-xl">Tr</span></p>
              <p className="text-xs text-green-600 font-bold mt-2 flex items-center gap-1"><ArrowUpRight size={14} /> +18.2% so với kỳ trước</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

            {/* 5. BIỂU ĐỒ BỆNH NHÂN (Bar Chart CSS) */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-8">
                <h2 className="font-bold text-lg text-gray-900 flex items-center gap-2"><TrendingUp size={20} className="text-[#2563EB]" /> Bệnh nhân theo Tuần</h2>
                <span className="bg-blue-50 text-[#2563EB] text-xs font-bold px-3 py-1 rounded-full">Tăng 15%</span>
              </div>

              <div className="h-64 flex items-end justify-between px-4 pb-2 border-b border-l border-gray-200 relative pt-8">
                {/* Horizontal reference lines */}
                <div className="absolute top-[20%] left-0 w-full border-t border-dashed border-gray-200"></div>
                <div className="absolute top-[50%] left-0 w-full border-t border-dashed border-gray-200"></div>
                <div className="absolute top-[80%] left-0 w-full border-t border-dashed border-gray-200"></div>

                {/* Bars */}
                {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day, idx) => {
                  const heights = ['60%', '45%', '80%', '65%', '90%', '100%', '30%'];
                  const values = [120, 90, 160, 130, 180, 200, 60];
                  return (
                    <div key={day} className="flex flex-col items-center gap-2 z-10 group w-10 relative">
                      <span className="absolute -top-6 text-xs font-bold text-gray-600 opacity-0 group-hover:opacity-100 transition">{values[idx]}</span>
                      <div className="w-full bg-[#2563EB] rounded-t-sm hover:bg-blue-500 transition-colors cursor-pointer" style={{ height: heights[idx] }}></div>
                      <span className="text-xs text-gray-500 font-medium absolute -bottom-6">{day}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 6. BIỂU ĐỒ CHUYÊN KHOA & TRẠNG THÁI (Progress Bars) */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="font-bold text-lg text-gray-900 flex items-center gap-2 mb-6"><Activity size={20} className="text-green-500" /> Tỷ trọng hoạt động</h2>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm font-bold text-gray-700 mb-2">
                    <span>Nội tổng quát</span>
                    <span>45%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3">
                    <div className="bg-[#2563EB] h-3 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm font-bold text-gray-700 mb-2">
                    <span>Tim mạch</span>
                    <span>25%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3">
                    <div className="bg-green-500 h-3 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm font-bold text-gray-700 mb-2">
                    <span>Nhi khoa</span>
                    <span>20%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3">
                    <div className="bg-yellow-500 h-3 rounded-full" style={{ width: '20%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm font-bold text-gray-700 mb-2">
                    <span>Khác</span>
                    <span>10%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3">
                    <div className="bg-gray-400 h-3 rounded-full" style={{ width: '10%' }}></div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* 7. TOP BÁC SĨ (Bảng) */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="font-bold text-gray-900 flex items-center gap-2"><Users size={18} className="text-[#2563EB]" /> Top Bác sĩ (Số ca khám)</h3>
              </div>
              <table className="w-full text-left text-sm">
                <thead className="bg-white border-b border-gray-100 text-gray-500 font-bold">
                  <tr>
                    <th className="px-5 py-4">Bác sĩ</th>
                    <th className="px-5 py-4 text-center">Số ca khám</th>
                    <th className="px-5 py-4 text-center">Đánh giá</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="hover:bg-blue-50/50 transition">
                    <td className="px-5 py-4 font-bold text-gray-900">BS. Nguyễn Văn Bình</td>
                    <td className="px-5 py-4 text-center font-bold text-[#2563EB]">152</td>
                    <td className="px-5 py-4 text-center text-yellow-500 font-bold">4.9 ★</td>
                  </tr>
                  <tr className="hover:bg-blue-50/50 transition">
                    <td className="px-5 py-4 font-bold text-gray-900">BS. Trần Thị An</td>
                    <td className="px-5 py-4 text-center font-bold text-[#2563EB]">145</td>
                    <td className="px-5 py-4 text-center text-yellow-500 font-bold">4.8 ★</td>
                  </tr>
                  <tr className="hover:bg-blue-50/50 transition">
                    <td className="px-5 py-4 font-bold text-gray-900">BS. Lê Hoàng</td>
                    <td className="px-5 py-4 text-center font-bold text-[#2563EB]">133</td>
                    <td className="px-5 py-4 text-center text-yellow-500 font-bold">4.7 ★</td>
                  </tr>
                  <tr className="hover:bg-blue-50/50 transition">
                    <td className="px-5 py-4 font-bold text-gray-900">BS. Trần Hùng</td>
                    <td className="px-5 py-4 text-center font-bold text-[#2563EB]">120</td>
                    <td className="px-5 py-4 text-center text-yellow-500 font-bold">4.9 ★</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 8. TOP BỆNH & THUỐC (Bảng) */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="font-bold text-gray-900 flex items-center gap-2"><Pill size={18} className="text-purple-600" /> Top Thuốc kê đơn</h3>
              </div>
              <table className="w-full text-left text-sm">
                <thead className="bg-white border-b border-gray-100 text-gray-500 font-bold">
                  <tr>
                    <th className="px-5 py-4">Tên thuốc</th>
                    <th className="px-5 py-4 text-center">Số lượt kê</th>
                    <th className="px-5 py-4 text-center">Tồn kho</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="hover:bg-purple-50/50 transition">
                    <td className="px-5 py-4 font-bold text-gray-900">Paracetamol 500mg</td>
                    <td className="px-5 py-4 text-center font-bold text-purple-600">352</td>
                    <td className="px-5 py-4 text-center text-green-600 font-bold">Còn hàng</td>
                  </tr>
                  <tr className="hover:bg-purple-50/50 transition">
                    <td className="px-5 py-4 font-bold text-gray-900">Vitamin C 500mg</td>
                    <td className="px-5 py-4 text-center font-bold text-purple-600">300</td>
                    <td className="px-5 py-4 text-center text-green-600 font-bold">Còn hàng</td>
                  </tr>
                  <tr className="hover:bg-purple-50/50 transition">
                    <td className="px-5 py-4 font-bold text-gray-900">Amoxicillin 500mg</td>
                    <td className="px-5 py-4 text-center font-bold text-purple-600">250</td>
                    <td className="px-5 py-4 text-center text-yellow-600 font-bold">Sắp hết</td>
                  </tr>
                  <tr className="hover:bg-purple-50/50 transition">
                    <td className="px-5 py-4 font-bold text-gray-900">Ibuprofen 400mg</td>
                    <td className="px-5 py-4 text-center font-bold text-purple-600">190</td>
                    <td className="px-5 py-4 text-center text-red-600 font-bold">Hết hàng</td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>

        </div>
      </main>

    </div>
  );
}