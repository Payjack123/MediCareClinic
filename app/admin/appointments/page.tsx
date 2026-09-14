'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Search, Bell, Clock, Plus, Eye, Filter, CalendarDays, Edit
} from 'lucide-react';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

import Sidebar from '@/app/admin/Sidebar';
import { getAppointments, updateAppointmentStatus } from '@/app/admin/appointments/actions';

export default function AdminAppointmentsPage() {
  const router = useRouter();
  
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [filters, setFilters] = useState({
    search: '',
    date: dayjs().format('DD/MM/YYYY'), // Default to today
    status: ''
  });

  const fetchData = async () => {
    setIsLoading(true);
    const res = await getAppointments(filters);

    if (res.success && res.data) {
      setAppointments(res.data);
    } else {
      if (res.message === 'Không có quyền truy cập') {
        router.push('/login');
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    router.push('/login');
  };

  const currentDateTime = dayjs().format('DD/MM/YYYY HH:mm');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Đã đặt': return 'bg-blue-100 text-blue-700';
      case 'Đã xác nhận': return 'bg-emerald-100 text-emerald-700';
      case 'Đã check-in': return 'bg-amber-100 text-amber-700';
      case 'Đang khám': return 'bg-purple-100 text-purple-700';
      case 'Đã khám': return 'bg-emerald-100 text-emerald-700';
      case 'Đã hủy': return 'bg-red-100 text-red-700';
      case 'Không đến': return 'bg-slate-100 text-slate-700';
      default: return 'bg-slate-100 text-slate-700';
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
              <CalendarDays className="text-blue-600"/> Quản lý Lịch hẹn
            </h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-sm font-medium text-slate-500 bg-slate-100 px-4 py-2 rounded-full border border-slate-200 flex items-center gap-2">
              <Clock size={16}/> {currentDateTime}
            </div>
            
            <div className="flex items-center gap-4 pl-6 border-l border-slate-200">
              <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition">
                <Bell size={20}/>
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
          
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 mb-8 flex flex-col lg:flex-row items-center gap-4 justify-between">
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative group">
                <input 
                  type="text" 
                  placeholder="Mã lịch, Tên BN, SĐT..." 
                  className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 w-64 transition-all outline-none"
                  value={filters.search}
                  onChange={e => setFilters({...filters, search: e.target.value})}
                  onKeyDown={e => e.key === 'Enter' && fetchData()}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18}/>
              </div>

              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Ngày (DD/MM/YYYY)"
                  className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none w-48"
                  value={filters.date}
                  onChange={e => setFilters({...filters, date: e.target.value})}
                />
                <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
              </div>

              <select 
                className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none w-48"
                value={filters.status}
                onChange={e => setFilters({...filters, status: e.target.value})}
              >
                <option value="">Tất cả trạng thái</option>
                <option value="Đã đặt">Đã đặt</option>
                <option value="Đã xác nhận">Đã xác nhận</option>
                <option value="Đã check-in">Đã check-in</option>
                <option value="Đang khám">Đang khám</option>
                <option value="Đã khám">Đã khám</option>
                <option value="Đã hủy">Đã hủy</option>
                <option value="Không đến">Không đến</option>
              </select>
              
              <button 
                onClick={fetchData}
                disabled={isLoading}
                className="bg-slate-100 text-slate-700 hover:bg-slate-200 px-4 py-2.5 rounded-xl font-bold transition flex items-center gap-2 text-sm"
              >
                <Filter size={18}/> Lọc
              </button>
            </div>
            
            <Link href="/admin/appointments/create" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 shadow-md transition flex items-center gap-2 text-sm">
              <Plus size={18}/> Tạo lịch hẹn
            </Link>
          </div>

          {isLoading ? (
            <div className="py-20 flex justify-center">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-xs tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Mã Lịch</th>
                      <th className="px-6 py-4">Bệnh nhân</th>
                      <th className="px-6 py-4">Bác sĩ</th>
                      <th className="px-6 py-4">Ngày khám</th>
                      <th className="px-6 py-4">Giờ khám</th>
                      <th className="px-6 py-4">Phòng</th>
                      <th className="px-6 py-4">Trạng thái</th>
                      <th className="px-6 py-4 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {appointments.length > 0 ? appointments.map((apt: any) => (
                      <tr key={apt.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-900">{apt.appointmentCode}</td>
                        <td className="px-6 py-4 font-medium text-slate-900">
                          {apt.patient?.fullName} <br/>
                          <span className="text-xs text-slate-500 font-normal">{apt.patient?.phone}</span>
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-900">
                          BS. {apt.doctor?.fullName} <br/>
                          <span className="text-xs text-slate-500 font-normal">{apt.specialty}</span>
                        </td>
                        <td className="px-6 py-4 text-slate-700 font-medium">{apt.bookingDate}</td>
                        <td className="px-6 py-4 text-slate-700 font-bold text-blue-600">{apt.bookingTime}</td>
                        <td className="px-6 py-4 text-slate-700">{apt.room || 'Chưa xếp'}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 text-xs font-bold rounded-lg flex items-center gap-1.5 w-max ${getStatusBadge(apt.status)}`}>
                            {apt.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/admin/appointments/${apt.id}`} className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition" title="Xem chi tiết">
                              <Eye size={16}/>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan={8} className="px-6 py-12 text-center text-slate-500">Không tìm thấy lịch hẹn nào phù hợp.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}