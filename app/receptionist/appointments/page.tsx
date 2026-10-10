'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, Calendar, Filter, CheckCircle, XCircle, 
  Clock, MoreVertical, Loader2, Phone, User, CheckSquare
} from 'lucide-react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import { getAppointments, updateAppointmentStatus } from './actions';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  
  // Filters
  const todayStr = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
  const [filterDate, setFilterDate] = useState(todayStr);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    fetchData();
  }, [filterDate, statusFilter]); // Tự động load khi đổi ngày hoặc trạng thái

  const fetchData = async () => {
    setIsLoading(true);
    // Chuyển đổi định dạng ngày từ YYYY-MM-DD sang DD/MM/YYYY để match với DB
    const [year, month, day] = filterDate.split('-');
    const formattedDate = `${day}/${month}/${year}`;
    
    const res = await getAppointments(formattedDate, searchQuery, statusFilter);
    if (res.success) {
      setAppointments(res.data);
    }
    setIsLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData();
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    if (!confirm(`Bạn có chắc muốn chuyển trạng thái thành: ${status}?`)) return;
    
    setIsActionLoading(true);
    const res = await updateAppointmentStatus(id, status);
    if (res.success) {
      await fetchData();
    } else {
      alert(res.message);
    }
    setIsActionLoading(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CHỜ XÁC NHẬN':
        return <span className="px-2.5 py-1 bg-amber-50 text-amber-600 border border-amber-200 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"><Clock size={12}/> Chờ xác nhận</span>;
      case 'ĐÃ XÁC NHẬN':
        return <span className="px-2.5 py-1 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"><CheckCircle size={12}/> Đã check-in</span>;
      case 'ĐÃ CẤP SỐ':
      case 'ĐANG KHÁM':
      case 'HOÀN THÀNH':
        return <span className="px-2.5 py-1 bg-green-50 text-green-600 border border-green-200 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"><CheckSquare size={12}/> Đã xử lý</span>;
      case 'ĐÃ HỦY':
      case 'BỎ LƯỢT':
        return <span className="px-2.5 py-1 bg-red-50 text-red-600 border border-red-200 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"><XCircle size={12}/> Đã hủy</span>;
      default:
        return <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 pb-10 animate-fade-in">
      
      {/* Page Header */}
      <div className="flex flex-col gap-1 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Danh sách Lịch hẹn</h1>
        <p className="text-sm text-gray-500">Quản lý, tìm kiếm và xác nhận lịch hẹn của bệnh nhân</p>
      </div>

      {/* TOP FILTERS */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          <div className="md:col-span-4">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Tìm kiếm</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50"
                placeholder="Mã lịch hẹn, tên, SĐT..."
              />
            </div>
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Ngày khám</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <DatePicker
                selected={filterDate ? new Date(filterDate) : null}
                onChange={(date: Date | null) => {
                  if (date) {
                    setFilterDate(dayjs(date).format('YYYY-MM-DD'));
                  }
                }}
                dateFormat="dd/MM/yyyy"
                className="w-full pl-10 pr-3 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholderText="Ngày khám"
              />
            </div>
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Trạng thái</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option value="ALL">Tất cả trạng thái</option>
                <option value="CHỜ XÁC NHẬN">Chờ xác nhận</option>
                <option value="ĐÃ XÁC NHẬN">Đã Check-in</option>
                <option value="ĐÃ HỦY">Đã hủy</option>
              </select>
            </div>
          </div>

          <div className="md:col-span-2 flex items-end">
            <button type="submit" className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors shadow-sm h-[42px] flex items-center justify-center gap-2">
              <Search size={16} /> Tìm
            </button>
          </div>
        </form>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative">
        
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        )}

        <div className="overflow-x-auto min-h-[400px]">
          {appointments.length === 0 && !isLoading ? (
             <div className="p-20 text-center flex flex-col items-center justify-center">
               <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                 <Calendar className="w-8 h-8 text-gray-400" />
               </div>
               <h3 className="text-gray-900 font-bold mb-1">Không tìm thấy lịch hẹn nào</h3>
               <p className="text-gray-500 text-sm">Thử thay đổi bộ lọc hoặc ngày tìm kiếm.</p>
             </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] uppercase tracking-wider text-gray-500 font-bold">
                  <th className="px-6 py-4">Mã lịch hẹn</th>
                  <th className="px-6 py-4">Bệnh nhân</th>
                  <th className="px-6 py-4">Thời gian</th>
                  <th className="px-6 py-4">Bác sĩ & Khoa</th>
                  <th className="px-6 py-4 text-center">Trạng thái</th>
                  <th className="px-6 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {appointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-blue-50/30 transition-colors">
                    
                    <td className="px-6 py-4">
                      <div className="font-bold text-blue-600 text-sm">{apt.appointmentCode}</div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(apt.patientName)}&background=eff6ff&color=2563eb`} className="w-9 h-9 rounded-full" alt="avatar" />
                        <div>
                          <div className="font-bold text-gray-900 text-sm">{apt.patientName}</div>
                          <div className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5"><Phone size={10}/> {apt.phone}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900 text-sm">{apt.bookingTime}</div>
                      <div className="text-xs text-gray-500">{apt.bookingDate}</div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-800 text-sm">{apt.doctorName}</div>
                      <div className="text-xs text-gray-500">{apt.specialty}</div>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        {getStatusBadge(apt.status)}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {apt.status === 'CHỜ XÁC NHẬN' && (
                          <button 
                            disabled={isActionLoading}
                            onClick={() => handleUpdateStatus(apt.id, 'ĐÃ XÁC NHẬN')}
                            className="px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 hover:bg-green-600 hover:text-white rounded-lg text-xs font-bold transition-colors"
                          >
                            Check-in
                          </button>
                        )}
                        {(apt.status === 'CHỜ XÁC NHẬN' || apt.status === 'ĐÃ XÁC NHẬN') && (
                          <button 
                            disabled={isActionLoading}
                            onClick={() => handleUpdateStatus(apt.id, 'ĐÃ HỦY')}
                            className="px-3 py-1.5 bg-white text-red-600 border border-gray-200 hover:bg-red-50 rounded-lg text-xs font-bold transition-colors"
                          >
                            Hủy
                          </button>
                        )}
                        <button className="p-1.5 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
