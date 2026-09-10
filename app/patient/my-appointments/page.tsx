'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  CalendarDays, Calendar, Hourglass, CheckCircle2, XCircle, X, UserCircle2,
  Search, CalendarRange, Clock, MapPin, User, Stethoscope, Loader2,
  Info, Trash2, Star, CheckCircle, AlertCircle, ArrowRight, Activity
} from 'lucide-react';
import QRCode from 'react-qr-code';
import PatientSidebar from '@/app/patient/Sidebar';
import NotificationBell from '@/components/NotificationBell';
import { getMyAppointmentsData, cancelAppointment } from './actions';

export default function MyAppointmentsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Tất cả');
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // States for filter bar
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState('');
  const [filterDoctor, setFilterDoctor] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const tabs = ['Tất cả', 'Sắp tới', 'Đã hủy'];

  const stats = [
    { label: 'Tất cả lịch hẹn', count: appointments.length, desc: 'Tất cả các lịch hẹn', icon: CalendarDays, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Sắp tới', count: appointments.filter(a => a.status === 'Sắp tới').length, desc: 'Đang chờ phòng khám xác nhận', icon: Hourglass, color: 'text-yellow-500', bg: 'bg-yellow-50' },
    { label: 'Đã hủy', count: appointments.filter(a => a.status === 'Đã hủy').length, desc: 'Lịch hẹn đã hủy', icon: XCircle, color: 'text-red-500', bg: 'bg-red-50' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const res = await getMyAppointmentsData();
      if (res.success && res.data) {
        setUserData(res.data.user);
        setAppointments(res.data.appointments);
        if (res.data.appointments.length > 0) {
          setSelectedAppointment(res.data.appointments[0]);
        }
      } else {
        router.push('/login');
      }
      setIsLoading(false);
    };
    fetchData();
  }, [router]);

  let finalFiltered = appointments;

  if (activeTab !== 'Tất cả') {
    finalFiltered = finalFiltered.filter(app => app.status === activeTab);
  }

  if (filterStatus) {
    finalFiltered = finalFiltered.filter(app => app.status === filterStatus);
  }

  if (filterSpecialty) {
    finalFiltered = finalFiltered.filter(app => app.specialty === filterSpecialty);
  }

  if (filterDoctor) {
    finalFiltered = finalFiltered.filter(app => app.doctor === filterDoctor);
  }

  if (searchQuery.trim() !== '') {
    const q = searchQuery.toLowerCase();
    finalFiltered = finalFiltered.filter(app =>
      app.doctor.toLowerCase().includes(q) ||
      app.specialty.toLowerCase().includes(q) ||
      app.clinic.toLowerCase().includes(q) ||
      app.appointmentCode?.toLowerCase().includes(q)
    );
  }

  const parseDateForFilter = (raw: string) => {
    if (!raw) return '';
    if (raw.includes('/')) {
      const parts = raw.split('/');
      if (parts.length === 3) {
        return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
      }
    }
    return raw;
  };

  if (fromDate) {
    finalFiltered = finalFiltered.filter(app => {
      const dateStr = parseDateForFilter(app.rawDate);
      return dateStr ? dateStr >= fromDate : true;
    });
  }

  if (toDate) {
    finalFiltered = finalFiltered.filter(app => {
      const dateStr = parseDateForFilter(app.rawDate);
      return dateStr ? dateStr <= toDate : true;
    });
  }

  const filteredAppointments = finalFiltered;

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, fromDate, toDate, filterStatus, filterSpecialty, filterDoctor, searchQuery]);

  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAppointments = filteredAppointments.slice(indexOfFirstItem, indexOfLastItem);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]"><Loader2 className="w-10 h-10 text-[#2563EB] animate-spin" /></div>;
  }

  return (
    <>
      <div className="min-h-screen flex bg-[#F8FAFC] font-sans text-gray-800 overflow-hidden">

        {/* ==========================================
          1. SIDEBAR
      ========================================== */}
        <PatientSidebar activePage="my-appointments" />

        {/* ==========================================
          2. MAIN CONTENT AREA
      ========================================== */}
        <main className="flex-1 flex flex-col h-screen overflow-hidden">

          {/* TOP HEADER */}
          <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-8 shrink-0 z-10">
            <div className="flex items-center gap-4">
              <div className="bg-blue-50 p-2 rounded-lg hidden sm:block"><CalendarDays className="text-[#2563EB]" size={24} /></div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 leading-tight">Lịch hẹn của tôi</h1>
                <p className="text-xs text-gray-500 hidden sm:block mt-0.5">Quản lý và theo dõi các lịch hẹn khám bệnh của bạn.</p>
              </div>
            </div>
            <div className="flex items-center gap-6 ml-auto">
              <NotificationBell />
              <div className="flex items-center gap-3 cursor-pointer group">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-gray-900 group-hover:text-[#2563EB] transition">{userData?.fullName}</p>
                  <p className="text-xs text-gray-500 font-medium">{userData?.patientCode}</p>
                </div>
                <img src={`https://ui-avatars.com/api/?name=${userData?.fullName}&background=2563EB&color=fff`} alt="Avatar" className="w-10 h-10 rounded-full border-2 border-white shadow-sm group-hover:shadow-md transition" />
              </div>
            </div>
          </header>

          {/* SCROLLABLE CONTENT */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 animate-in fade-in duration-500">



            {/* STATS CARDS */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {stats.map((stat, idx) => (
                <div key={idx} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-all">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.bg} ${stat.color}`}>
                    <stat.icon size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase">{stat.label}</p>
                    <p className="text-2xl font-black text-gray-900 leading-tight mt-1">{stat.count}</p>
                    <p className="text-xs text-gray-400 mt-1">{stat.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* MAIN CONTENT GRID */}
            <div className="flex flex-col lg:flex-row gap-6">

              {/* LEFT: LIST OF APPOINTMENTS */}
              <div className="flex-1">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Danh sách lịch hẹn</h2>

                {/* FILTER BAR */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-wrap gap-4 items-end">
                  <div className="flex-1 min-w-[130px]">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Từ ngày</label>
                    <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="flex-1 min-w-[130px]">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Đến ngày</label>
                    <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Trạng thái</label>
                    <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Tất cả trạng thái</option>
                      <option value="Sắp tới">Sắp tới</option>
                      <option value="Đã hủy">Đã hủy</option>
                    </select>
                  </div>
                  <div className="flex-1 min-w-[170px]">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Chuyên khoa</label>
                    <select value={filterSpecialty} onChange={(e) => setFilterSpecialty(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Tất cả chuyên khoa</option>
                      {Array.from(new Set(appointments.map(a => a.specialty))).map(spec => (
                        <option key={spec} value={spec}>{spec}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1 min-w-[170px]">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Bác sĩ</label>
                    <select value={filterDoctor} onChange={(e) => setFilterDoctor(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Tất cả bác sĩ</option>
                      {Array.from(new Set(appointments.map(a => a.doctor))).map(doc => (
                        <option key={doc} value={doc}>{doc}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-[2] min-w-[200px] relative">
                    <input type="text" placeholder="Tìm kiếm lịch khám..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  </div>
                  <button
                    onClick={() => {
                      setFromDate('');
                      setToDate('');
                      setFilterStatus('');
                      setFilterSpecialty('');
                      setFilterDoctor('');
                      setSearchQuery('');
                    }}
                    className="flex items-center gap-2 px-4 py-2 border border-blue-200 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 transition shrink-0 h-[38px]"
                  >
                    <Trash2 size={16} /> Bỏ lọc
                  </button>
                </div>
                {/* Danh sách lịch hẹn */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                  {currentAppointments.length > 0 ? currentAppointments.map((app, idx) => (
                    <div
                      key={app.id}
                      onClick={() => setSelectedAppointment(app)}
                      className={`flex flex-col sm:flex-row p-5 gap-5 border-b border-gray-50 cursor-pointer transition-all ${selectedAppointment?.id === app.id ? 'bg-blue-50/30' : 'hover:bg-gray-50'}`}
                    >
                      {/* Date Block */}
                      <div className="flex flex-col items-center justify-center min-w-[100px] border-r border-gray-100 pr-5 shrink-0">
                        <span className="text-3xl font-black text-gray-900">{app.day}</span>
                        <span className="text-xs text-gray-500 mt-0.5">{app.monthYear}</span>
                        <span className="text-xs font-bold text-gray-700 mt-1">{app.dayOfWeek}</span>
                      </div>

                      {/* Info Block */}
                      <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                        <div className="w-16 flex items-center font-bold text-[#2563EB] text-lg shrink-0">
                          {app.time}
                        </div>

                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <img src={app.avatar} alt={app.doctor} className="w-12 h-12 rounded-full border border-gray-200 shrink-0" />
                          <div className="truncate">
                            <p className="text-sm font-bold text-gray-900">{app.specialty}</p>
                            <p className="text-sm text-gray-600 mt-0.5">{app.doctor}</p>
                            <p className="text-xs text-gray-400 mt-1 truncate">{app.room}, {app.clinic}</p>
                          </div>
                        </div>

                        <div className="w-32 flex justify-center shrink-0">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${app.statusColor}`}>
                            {app.status}
                          </span>
                        </div>
                      </div>

                      {/* Action Block */}
                      <div className="flex sm:flex-col items-center justify-center gap-2 min-w-[120px] shrink-0 border-t sm:border-t-0 pt-4 sm:pt-0 border-gray-50 mt-2 sm:mt-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedAppointment(app);
                            setIsModalOpen(true);
                          }}
                          className="w-full bg-[#2563EB] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition"
                        >
                          Chi tiết
                        </button>
                      </div>
                    </div>
                  )) : (
                    <div className="p-12 text-center text-gray-500 flex flex-col items-center">
                      <Calendar size={48} className="text-gray-300 mb-4" />
                      <p className="font-medium text-gray-900 text-lg">Không có lịch hẹn nào</p>
                      <p className="text-sm mt-1">Bạn chưa có lịch hẹn nào trong danh sách này.</p>
                    </div>
                  )}

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="p-4 border-t border-gray-100 flex justify-center gap-2">
                      <button 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition disabled:opacity-50"
                      >&laquo;</button>
                      
                      {Array.from({ length: totalPages }).map((_, i) => (
                        <button 
                          key={i}
                          onClick={() => setCurrentPage(i + 1)}
                          className={`w-8 h-8 flex items-center justify-center rounded-lg border font-medium transition ${
                            currentPage === i + 1 
                              ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-sm' 
                              : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}

                      <button 
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition disabled:opacity-50"
                      >&raquo;</button>
                    </div>
                  )}
                </div>
              </div>



            </div>

          </div>
        </main>

      </div>

      {/* MODAL CHI TIẾT LỊCH HẸN */}
      {isModalOpen && selectedAppointment && (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm overflow-y-auto custom-scrollbar">
          <div className="min-h-screen flex items-center justify-center p-4 py-12">
            <div className="relative animate-in zoom-in-95 duration-200">
            {/* Nút Đóng */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute -top-4 -right-4 z-20 p-2 bg-white hover:bg-gray-100 rounded-full text-gray-500 shadow-md transition"
            >
              <X size={20} />
            </button>

            <div className="w-[340px] bg-white shadow-2xl relative text-left rounded-3xl overflow-hidden ring-1 ring-gray-200/50">
              {/* Header */}
              <div className="text-center p-5 pt-6 border-b-2 border-dashed border-gray-300">
                <p className="text-xs font-bold uppercase text-gray-500">Hệ thống Y tế</p>
                <p className="text-sm font-bold uppercase text-gray-800">{selectedAppointment.clinic}</p>
                <p className="text-xs font-medium text-gray-500 mt-1">Mã lịch: {selectedAppointment.appointmentCode}</p>
                <div className="flex justify-center my-4">
                  <div className="p-2 bg-white border border-gray-200 rounded-xl shadow-sm">
                    <QRCode value={selectedAppointment.appointmentCode} size={100} level="M" />
                  </div>
                </div>
                <h3 className="text-xl font-bold uppercase mt-1 tracking-wider text-gray-900">Phiếu Khám Bệnh</h3>
              </div>

              {/* Body */}
              <div className="p-5 space-y-2.5 text-sm text-gray-800 border-b-2 border-dashed border-gray-300">
                <div className="flex justify-between"><span className="text-gray-500">Mã BN:</span> <span className="font-bold text-right uppercase">{selectedAppointment.patientDetails?.patientCode || userData?.patientProfile?.patientCode || 'Không có'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Họ và tên:</span> <span className="font-bold text-right uppercase">{selectedAppointment.patientDetails?.name || userData?.fullName || 'Không có'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">SĐT:</span> <span className="font-bold text-right">{selectedAppointment.patientDetails?.phone || userData?.phone || 'Không có'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">CCCD:</span> <span className="font-bold text-right">{selectedAppointment.patientDetails?.cccd || 'Không có'}</span></div>
                <div className="flex justify-between items-start gap-4"><span className="text-gray-500 shrink-0">Địa chỉ:</span> <span className="font-bold text-right truncate">{selectedAppointment.patientDetails?.address || userData?.address || 'Không có'}</span></div>
                <div className="h-px bg-gray-100 my-1"></div>
                <div className="flex justify-between"><span className="text-gray-500">YC khám:</span> <span className="font-bold text-right">{selectedAppointment.specialty}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Bác sĩ:</span> <span className="font-bold text-right">{selectedAppointment.doctor}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Giá khám:</span> <span className="font-black text-[#2563EB] text-right">{(selectedAppointment.price || 150000).toLocaleString('vi-VN')} đ</span></div>
              </div>

              {/* Footer */}
              <div className="p-5 text-center bg-gray-50">
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Giờ khám dự kiến</p>
                <p className="text-5xl font-black text-gray-900 my-2">{selectedAppointment.time}</p>
                <p className="text-sm font-medium text-gray-600">Ngày {selectedAppointment.day}/{selectedAppointment.monthYear.replace('Tháng ', '').replace(', ', '/')}</p>
              </div>

            </div>

            {/* Actions */}
            {(selectedAppointment.status === 'Sắp tới' || selectedAppointment.status === 'Chờ xác nhận') && (
              <div className="mt-4">
                <button
                  onClick={() => setIsCancelConfirmOpen(true)}
                  className="w-full bg-white text-red-500 border border-red-200 py-3 rounded-xl font-bold hover:bg-red-50 shadow-lg transition"
                >
                  Hủy lịch hẹn
                </button>
              </div>
            )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL XÁC NHẬN HỦY LỊCH */}
      {isCancelConfirmOpen && selectedAppointment && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200 p-6 text-center border border-gray-100">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm">
              <AlertCircle className="text-red-500 w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Hủy lịch hẹn?</h2>
            <p className="text-gray-600 mb-6 text-sm leading-relaxed">
              Bạn có chắc chắn muốn hủy lịch khám ngày <strong className="text-gray-900">{selectedAppointment.day}/{selectedAppointment.monthYear.replace('Tháng ', '').replace(', ', '/')}</strong> lúc <strong className="text-gray-900">{selectedAppointment.time}</strong> với <strong className="text-gray-900">{selectedAppointment.doctor}</strong> không?<br />
              <span className="text-red-500 italic mt-1 inline-block">Thao tác này không thể hoàn tác.</span>
            </p>

            <div className="flex gap-3 w-full">
              <button
                onClick={() => setIsCancelConfirmOpen(false)}
                disabled={isCanceling}
                className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-100 text-gray-600 font-bold hover:bg-gray-50 transition disabled:opacity-50"
              >
                Quay lại
              </button>
              <button
                onClick={async () => {
                  setIsCanceling(true);
                  const res = await cancelAppointment(selectedAppointment.id);
                  if (res.success) {
                    setIsCanceling(false);
                    setIsCancelConfirmOpen(false);
                    setIsModalOpen(false); // Đóng cả bảng chi tiết
                    setIsSuccessModalOpen(true);
                  } else {
                    alert(res.message);
                    setIsCanceling(false);
                    setIsCancelConfirmOpen(false);
                  }
                }}
                disabled={isCanceling}
                className="flex-1 px-4 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 shadow-md shadow-red-200 transition flex items-center justify-center disabled:bg-red-400"
              >
                {isCanceling ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Đồng ý hủy'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* MODAL THÔNG BÁO HỦY THÀNH CÔNG */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200 p-6 text-center border border-gray-100">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm">
              <CheckCircle className="text-green-500 w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Hủy lịch thành công!</h2>
            <p className="text-gray-600 mb-6 text-sm leading-relaxed">
              Lịch hẹn của bạn đã được hủy bỏ thành công trên hệ thống.
            </p>

            <button
              onClick={() => {
                setIsSuccessModalOpen(false);
                window.location.reload(); // Tải lại trang sau khi đóng để cập nhật danh sách
              }}
              className="w-full px-4 py-3 rounded-xl bg-green-500 text-white font-bold hover:bg-green-600 shadow-md shadow-green-200 transition"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </>
  );
}
