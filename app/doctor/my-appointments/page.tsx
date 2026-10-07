'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  CalendarDays, ChevronLeft, ChevronRight, RefreshCw, 
  Search, Eye, Edit2, MoreVertical, CheckCircle2, Clock, XCircle, Calendar, Trash2
} from 'lucide-react';
import { getAllDoctorAppointments } from '@/app/doctor/my-appointments/actions';
import DoctorSidebar from '@/app/doctor/Sidebar';

export default function MyAppointmentsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [specialtyFilter, setSpecialtyFilter] = useState('ALL');
  const [patientFilter, setPatientFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const res = await getAllDoctorAppointments();
      if (res.success && res.data) {
        setData(res.data);
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const total = data?.stats?.total || 0;
  const completed = data?.stats?.completed || 0;
  const upcoming = data?.stats?.upcoming || 0;
  const canceled = data?.stats?.canceled || 0;

  const getPercent = (val: number) => {
    if (total === 0) return '0%';
    return ((val / total) * 100).toFixed(1) + '%';
  };

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'Đã đặt': return 'bg-blue-50 text-blue-600 border border-blue-100';
      case 'Đã xác nhận': return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
      case 'Đã check-in': return 'bg-yellow-50 text-yellow-600 border border-yellow-100';
      case 'Đang khám': return 'bg-purple-50 text-purple-600 border border-purple-100';
      case 'Đã khám': return 'bg-green-50 text-green-700 border border-green-100';
      case 'Đã hủy': return 'bg-red-50 text-red-600 border border-red-100';
      case 'Không đến': return 'bg-gray-100 text-gray-700 border border-gray-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredAppointments = data?.appointments?.filter((apt: any) => {
    let match = true;
    
    // Lọc theo trạng thái
    if (statusFilter !== 'ALL' && apt.status !== statusFilter) match = false;
    
    // Lọc theo chuyên khoa
    if (specialtyFilter !== 'ALL' && apt.room !== specialtyFilter) match = false;
    
    // Lọc theo bệnh nhân
    if (patientFilter !== 'ALL' && apt.patientName !== patientFilter) match = false;
    
    // Lọc theo từ khoá tìm kiếm
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!apt.patientName?.toLowerCase().includes(q) &&
          !apt.patientPhone?.includes(q) &&
          !apt.reason?.toLowerCase().includes(q)) {
        match = false;
      }
    }
    
    // Lọc theo ngày
    if (fromDate || toDate) {
      const aptDateParts = (apt.date || apt.bookingDate).split('/'); // DD/MM/YYYY
      if (aptDateParts.length === 3) {
         const aptDate = new Date(`${aptDateParts[2]}-${aptDateParts[1]}-${aptDateParts[0]}`);
         if (fromDate) {
           const fd = new Date(fromDate);
           if (aptDate < fd) match = false;
         }
         if (toDate) {
           const td = new Date(toDate);
           if (aptDate > td) match = false;
         }
      }
    }

    return match;
  }) || [];
  
  const uniquePatients = Array.from(new Set(data?.appointments?.map((a: any) => a.patientName))) as string[];
  const uniqueSpecialties = Array.from(new Set(data?.appointments?.map((a: any) => a.room))) as string[];

  return (
    <div className="min-h-screen flex bg-white font-sans text-gray-800">
      <DoctorSidebar activePage="my-appointments" />

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Lịch hẹn của tôi</h1>
            <p className="text-sm text-gray-500 mt-1">Quản lý và theo dõi tất cả lịch hẹn khám bệnh của bạn.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0">
                <CalendarDays size={28} />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Tổng lịch hẹn</p>
                <p className="text-3xl font-black text-gray-900 mt-1 flex items-baseline gap-1">
                  {total} <span className="text-sm font-medium text-gray-500">lịch</span>
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-green-50 text-green-500 flex items-center justify-center shrink-0">
                <CheckCircle2 size={28} />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Đã khám</p>
                <p className="text-3xl font-black text-gray-900 mt-1 flex items-baseline gap-1">
                  {completed} <span className="text-sm font-medium text-gray-500">lịch</span>
                </p>
                <p className="text-xs font-bold text-gray-500 mt-1">{getPercent(completed)}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                <Clock size={28} />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Sắp tới</p>
                <p className="text-3xl font-black text-gray-900 mt-1 flex items-baseline gap-1">
                  {upcoming} <span className="text-sm font-medium text-gray-500">lịch</span>
                </p>
                <p className="text-xs font-bold text-gray-500 mt-1">{getPercent(upcoming)}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <XCircle size={28} />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Đã hủy</p>
                <p className="text-3xl font-black text-gray-900 mt-1 flex items-baseline gap-1">
                  {canceled} <span className="text-sm font-medium text-gray-500">lịch</span>
                </p>
                <p className="text-xs font-bold text-gray-500 mt-1">{getPercent(canceled)}</p>
              </div>
            </div>
          </div>

          {/* MỚI: BỘ LỌC TÌM KIẾM THEO GIAO DIỆN YÊU CẦU */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6 flex flex-wrap xl:flex-nowrap gap-3 items-end w-full">
            <div className="flex-1 min-w-[120px]">
              <label className="block text-[11px] font-bold text-gray-500 mb-1.5">Từ ngày</label>
              <div className="relative">
                <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="w-full border border-gray-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:border-[#2563EB]" />
              </div>
            </div>
            <div className="flex-1 min-w-[120px]">
              <label className="block text-[11px] font-bold text-gray-500 mb-1.5">Đến ngày</label>
              <div className="relative">
                <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="w-full border border-gray-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:border-[#2563EB]" />
              </div>
            </div>
            <div className="flex-1 min-w-[130px]">
              <label className="block text-[11px] font-bold text-gray-500 mb-1.5">Trạng thái</label>
              <div className="relative">
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full border border-gray-200 rounded-lg px-2 py-2 text-sm appearance-none focus:outline-none focus:border-[#2563EB]">
                  <option value="ALL">Tất cả trạng thái</option>
                  <option value="Đã đặt">Đã đặt</option>
                  <option value="Đã xác nhận">Đã xác nhận</option>
                  <option value="Đã check-in">Đã check-in</option>
                  <option value="Đang khám">Đang khám</option>
                  <option value="Đã khám">Đã khám</option>
                  <option value="Đã hủy">Đã hủy</option>
                  <option value="Không đến">Không đến</option>
                </select>
                <ChevronRight size={14} className="absolute right-2 top-2.5 rotate-90 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div className="flex-1 min-w-[140px]">
              <label className="block text-[11px] font-bold text-gray-500 mb-1.5">Chuyên khoa</label>
              <div className="relative">
                <select value={specialtyFilter} onChange={(e) => setSpecialtyFilter(e.target.value)} className="w-full border border-gray-200 rounded-lg px-2 py-2 text-sm appearance-none focus:outline-none focus:border-[#2563EB]">
                  <option value="ALL">Tất cả chuyên khoa</option>
                  {uniqueSpecialties.map((spec, idx) => (
                    <option key={idx} value={spec}>{spec}</option>
                  ))}
                </select>
                <ChevronRight size={14} className="absolute right-2 top-2.5 rotate-90 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div className="flex-1 min-w-[140px]">
              <label className="block text-[11px] font-bold text-gray-500 mb-1.5">Bệnh nhân</label>
              <div className="relative">
                <select value={patientFilter} onChange={(e) => setPatientFilter(e.target.value)} className="w-full border border-gray-200 rounded-lg px-2 py-2 text-sm appearance-none focus:outline-none focus:border-[#2563EB]">
                  <option value="ALL">Tất cả bệnh nhân</option>
                  {uniquePatients.map((name, idx) => (
                    <option key={idx} value={name}>{name}</option>
                  ))}
                </select>
                <ChevronRight size={14} className="absolute right-2 top-2.5 rotate-90 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div className="flex-[1.5] min-w-[160px]">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-2.5 text-gray-400 pointer-events-none" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm..." 
                  className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-[#2563EB]" 
                />
              </div>
            </div>
            <button 
              onClick={() => {
                setFromDate('');
                setToDate('');
                setStatusFilter('ALL');
                setSpecialtyFilter('ALL');
                setPatientFilter('ALL');
                setSearchQuery('');
              }}
              className="flex items-center justify-center gap-1.5 border border-blue-200 text-[#2563EB] bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg text-sm font-bold transition h-[38px] whitespace-nowrap shrink-0"
            >
              <Trash2 size={16} /> Bỏ lọc
            </button>
          </div>

          {/* Data Table */}
          <div className="bg-white rounded-2xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="py-4 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider w-12 text-center">STT</th>
                  <th className="py-4 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Bệnh nhân</th>
                  <th className="py-4 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">SĐT</th>
                  <th className="py-4 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Chuyên khoa</th>
                  <th className="py-4 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-center">Ngày hẹn</th>
                  <th className="py-4 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-center">Giờ hẹn</th>
                  <th className="py-4 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Lý do khám</th>
                  <th className="py-4 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-center">Trạng thái</th>
                  <th className="py-4 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoading ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-gray-500">
                      Đang tải dữ liệu...
                    </td>
                  </tr>
                ) : filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-gray-500">
                      Không có lịch hẹn nào.
                    </td>
                  </tr>
                ) : (
                  filteredAppointments.map((apt: any, idx: number) => {
                    const lines = apt.dateWithDay.split('\n');
                    const formattedDate = lines.length > 1 ? (
                      <div className="text-center">
                        <div className="font-bold text-gray-900">{lines[0]}</div>
                        <div className="text-gray-500">{lines[1]}</div>
                      </div>
                    ) : (
                      <div className="font-bold text-gray-900">{apt.date}</div>
                    );

                    return (
                      <tr key={apt.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 px-4 text-sm font-bold text-gray-900 text-center">{idx + 1}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <img src={apt.avatar} alt="Avatar" className="w-10 h-10 rounded-full object-cover" />
                            <div>
                              <p className="text-sm font-bold text-gray-900">{apt.patientName}</p>
                              <p className="text-xs text-gray-500 mt-0.5">{apt.gender}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-sm font-bold text-gray-700">{apt.patientPhone || '--'}</td>
                        <td className="py-4 px-4 text-sm font-bold text-gray-700">{apt.room}</td>
                        <td className="py-4 px-4 text-sm">{formattedDate}</td>
                        <td className="py-4 px-4 text-sm font-bold text-gray-900 text-center">{apt.time}</td>
                        <td className="py-4 px-4 text-sm text-gray-900 max-w-[150px] truncate" title={apt.reason}>{apt.reason}</td>
                        <td className="py-4 px-4 text-center">
                          <span className={`inline-flex px-3 py-1.5 text-[11px] font-bold rounded ${getStatusStyle(apt.status)}`}>
                            {apt.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-center gap-1">
                            <Link href={`/doctor/patients/${apt.patientId}`} className="w-8 h-8 rounded-lg flex items-center justify-center text-blue-500 hover:bg-blue-50 transition" title="Xem hồ sơ bệnh nhân">
                              <Eye size={16} />
                            </Link>
                            <button className="w-8 h-8 rounded-lg flex items-center justify-center text-blue-500 hover:bg-blue-50 transition" title="Lưu trữ">
                              <Calendar size={16} />
                            </button>
                            <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition">
                              <MoreVertical size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between mt-4">
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span>Hiển thị</span>
                <select className="border border-gray-200 rounded px-2 py-1 bg-white font-medium focus:outline-none focus:border-blue-500">
                  <option>10</option>
                  <option>20</option>
                  <option>50</option>
                </select>
                <span>kết quả mỗi trang</span>
              </div>
              <div className="flex items-center gap-1">
                <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-gray-900">&laquo;</button>
                <button className="w-8 h-8 flex items-center justify-center rounded bg-[#2563EB] text-white font-bold shadow-sm">1</button>
                <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium">2</button>
                <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium">3</button>
                <span className="text-gray-400 px-1">...</span>
                <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium">6</button>
                <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-gray-900">&raquo;</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
