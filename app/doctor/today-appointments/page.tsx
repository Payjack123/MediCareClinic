'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  CalendarDays, ChevronLeft, ChevronRight, RefreshCw, 
  Search, Filter, Eye, Edit2, MoreVertical, CheckCircle2, Clock, XCircle, User, Stethoscope, Phone, Trash2
} from 'lucide-react';
import { getDoctorAppointmentsData } from '@/app/doctor/today-appointments/actions';
import DoctorSidebar from '@/app/doctor/Sidebar';

export default function TodayAppointmentsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  
  // Lấy ngày hôm nay
  const today = new Date();
  const dateStr = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [specialtyFilter, setSpecialtyFilter] = useState('ALL');
  const [patientFilter, setPatientFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  
  const displayDate = today.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const res = await getDoctorAppointmentsData(dateStr);
      if (res.success && res.data) {
        setData(res.data);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [dateStr]);

  const refreshData = async () => {
    setIsLoading(true);
    const res = await getDoctorAppointmentsData(dateStr);
    if (res.success && res.data) {
      setData(res.data);
    }
    setIsLoading(false);
  };

  // Tính toán số liệu phụ (Đang khám)
  const total = data?.appointments?.length || 0;
  const completed = data?.stats?.completed || 0;
  const waiting = data?.stats?.waiting || 0;
  const canceled = data?.stats?.canceled || 0;
  const inProgress = Math.max(0, total - completed - waiting - canceled); // Giả định nếu có trạng thái khác

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

  const getStatusText = (status: string) => {
    return status || 'Đã đặt';
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
    
    // Lọc theo ngày (do đây là trang lịch hôm nay nên từ/đến ngày thường chỉ là chính ngày đó, nhưng vẫn xử lý logic)
    if (fromDate || toDate) {
      const aptDateParts = dateStr.split('/'); // DD/MM/YYYY
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
    <div className="min-h-screen flex bg-[#F8FAFC] font-sans text-gray-800">
      <DoctorSidebar activePage="today-appointments" />

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header (Mô phỏng topbar nhỏ nếu cần, ở đây ghép vào body luôn cho giống thiết kế) */}
        
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">Lịch hẹn hôm nay của tôi</h1>
              <p className="text-sm text-gray-500 mt-1">Danh sách các lịch hẹn của bạn trong ngày hôm nay.</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm">
                <button className="text-gray-400 hover:text-gray-700"><ChevronLeft size={18} /></button>
                <span className="text-sm font-bold text-gray-700 flex items-center gap-2">
                   {displayDate} <CalendarDays size={16} className="text-gray-400" />
                </span>
                <button className="text-gray-400 hover:text-gray-700"><ChevronRight size={18} /></button>
              </div>
              <button 
                onClick={refreshData}
                className="flex items-center gap-2 bg-white border border-blue-200 text-[#2563EB] px-4 py-2 rounded-lg font-bold shadow-sm hover:bg-blue-50 transition"
              >
                <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} /> Làm mới
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-5 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0">
                <CalendarDays size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500">Tổng lịch hẹn hôm nay</p>
                <p className="text-2xl font-black text-gray-900 mt-1 flex items-baseline gap-1">
                  {total} <span className="text-sm font-medium text-gray-500">lịch</span>
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500">Đã khám</p>
                <p className="text-2xl font-black text-gray-900 mt-1 flex items-baseline gap-1">
                  {completed} <span className="text-sm font-medium text-gray-500">lịch</span>
                </p>
                <p className="text-[10px] font-bold text-gray-400 mt-0.5">{getPercent(completed)}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                <Clock size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500">Đã check-in</p>
                <p className="text-2xl font-black text-gray-900 mt-1 flex items-baseline gap-1">
                  {data?.stats?.checkedIn || 0} <span className="text-sm font-medium text-gray-500">lịch</span>
                </p>
                <p className="text-[10px] font-bold text-gray-400 mt-0.5">{getPercent(data?.stats?.checkedIn || 0)}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <User size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500">Đang khám</p>
                <p className="text-2xl font-black text-gray-900 mt-1 flex items-baseline gap-1">
                  {data?.stats?.examining || 0} <span className="text-sm font-medium text-gray-500">lịch</span>
                </p>
                <p className="text-[10px] font-bold text-gray-400 mt-0.5">{getPercent(data?.stats?.examining || 0)}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gray-50 text-gray-600 flex items-center justify-center shrink-0">
                <XCircle size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500">Đã hủy</p>
                <p className="text-2xl font-black text-gray-900 mt-1 flex items-baseline gap-1">
                  {canceled} <span className="text-sm font-medium text-gray-500">lịch</span>
                </p>
                <p className="text-[10px] font-bold text-gray-400 mt-0.5">{getPercent(canceled)}</p>
              </div>
            </div>
          </div>

          {/* MỚI: BỘ LỌC TÌM KIẾM THEO GIAO DIỆN YÊU CẦU */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6 flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[140px]">
              <label className="block text-[11px] font-bold text-gray-500 mb-1.5">Từ ngày</label>
              <div className="relative">
                <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2563EB]" />
              </div>
            </div>
            <div className="flex-1 min-w-[140px]">
              <label className="block text-[11px] font-bold text-gray-500 mb-1.5">Đến ngày</label>
              <div className="relative">
                <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2563EB]" />
              </div>
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="block text-[11px] font-bold text-gray-500 mb-1.5">Trạng thái</label>
              <div className="relative">
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm appearance-none focus:outline-none focus:border-[#2563EB]">
                  <option value="ALL">Tất cả trạng thái</option>
                  <option value="Đã đặt">Đã đặt</option>
                  <option value="Đã xác nhận">Đã xác nhận</option>
                  <option value="Đã check-in">Đã check-in</option>
                  <option value="Đang khám">Đang khám</option>
                  <option value="Đã khám">Đã khám</option>
                  <option value="Đã hủy">Đã hủy</option>
                  <option value="Không đến">Không đến</option>
                </select>
                <ChevronRight size={14} className="absolute right-3 top-2.5 rotate-90 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div className="flex-1 min-w-[160px]">
              <label className="block text-[11px] font-bold text-gray-500 mb-1.5">Chuyên khoa</label>
              <div className="relative">
                <select value={specialtyFilter} onChange={(e) => setSpecialtyFilter(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm appearance-none focus:outline-none focus:border-[#2563EB]">
                  <option value="ALL">Tất cả chuyên khoa</option>
                  {uniqueSpecialties.map((spec, idx) => (
                    <option key={idx} value={spec}>{spec}</option>
                  ))}
                </select>
                <ChevronRight size={14} className="absolute right-3 top-2.5 rotate-90 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div className="flex-1 min-w-[160px]">
              <label className="block text-[11px] font-bold text-gray-500 mb-1.5">Bệnh nhân</label>
              <div className="relative">
                <select value={patientFilter} onChange={(e) => setPatientFilter(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm appearance-none focus:outline-none focus:border-[#2563EB]">
                  <option value="ALL">Tất cả bệnh nhân</option>
                  {uniquePatients.map((name, idx) => (
                    <option key={idx} value={name}>{name}</option>
                  ))}
                </select>
                <ChevronRight size={14} className="absolute right-3 top-2.5 rotate-90 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div className="flex-[1.5] min-w-[200px]">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-2.5 text-gray-400 pointer-events-none" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm lịch khám..." 
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
              className="flex items-center gap-2 border border-blue-200 text-[#2563EB] bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg text-sm font-bold transition h-[38px]"
            >
              <Trash2 size={16} /> Bỏ lọc
            </button>
          </div>

          {/* Data Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider w-16">STT</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Giờ hẹn</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Bệnh nhân</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">SĐT</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Chuyên khoa</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Lý do khám</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Trạng thái</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Ghi chú</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-gray-500">
                      Đang tải dữ liệu...
                    </td>
                  </tr>
                ) : filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-gray-500">
                      Không tìm thấy lịch hẹn nào.
                    </td>
                  </tr>
                ) : (
                  filteredAppointments.map((apt: any, idx: number) => (
                    <tr key={apt.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6 text-sm font-bold text-gray-900">{idx + 1}</td>
                      <td className="py-4 px-6 text-sm font-bold text-gray-900">{apt.time}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img src={apt.avatar} alt="Avatar" className="w-10 h-10 rounded-full object-cover border border-gray-100" />
                          <div>
                            <p className="text-sm font-bold text-gray-900">{apt.patientName}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{apt.gender}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm font-bold text-gray-700">{apt.patientPhone || '--'}</td>
                      <td className="py-4 px-6 text-sm font-bold text-gray-700">{apt.room}</td>
                      <td className="py-4 px-6 text-sm text-gray-900 max-w-[200px] truncate" title={apt.reason}>{apt.reason}</td>
                      <td className="py-4 px-6 text-center">
                        <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${getStatusStyle(apt.rawStatus)}`}>
                          {getStatusText(apt.rawStatus)}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm font-bold text-gray-700">
                        {apt.rawStatus === 'Đã hủy' ? 'Bệnh nhân hủy' : apt.rawStatus === 'Đã khám' ? `Xong lúc ${apt.time}` : '--'}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center gap-2">
                          <Link href={`/doctor/appointments/${apt.id}`} className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 text-xs font-bold hover:bg-gray-50 hover:text-gray-900 transition flex items-center gap-1">
                            <Eye size={14} /> Xem
                          </Link>
                          {apt.rawStatus === 'Đã check-in' && (
                            <Link href={`/doctor/records/${apt.id}`} className="px-3 py-1.5 rounded-lg bg-[#2563EB] text-white text-xs font-bold hover:bg-blue-600 transition shadow-sm flex items-center gap-1">
                              <Stethoscope size={14} /> Bắt đầu khám
                            </Link>
                          )}
                          {apt.rawStatus === 'Đang khám' && (
                            <Link href={`/doctor/records/${apt.id}`} className="px-3 py-1.5 rounded-lg bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 transition shadow-sm flex items-center gap-1">
                              <Stethoscope size={14} /> Tiếp tục khám
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
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
                <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-gray-900">&raquo;</button>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-4 py-3 rounded-xl border border-blue-100">
            <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">i</span>
            Lưu ý: Giờ hẹn được hiển thị theo múi giờ hệ thống.
          </div>

        </div>
      </main>
    </div>
  );
}
