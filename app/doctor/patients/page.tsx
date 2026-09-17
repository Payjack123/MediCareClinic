'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Users, UserPlus, CalendarDays, Activity, ChevronLeft, ChevronRight,
  Eye, FileText, Search, Bell, Clock, Plus
} from 'lucide-react';
import DoctorSidebar from "@/app/doctor/Sidebar";
import { getDoctorPatientsData } from '@/app/doctor/patients/actions';

export default function DoctorPatientsPage() {
  const router = useRouter();

  const [patients, setPatients] = useState<any[]>([]);
  const [kpis, setKpis] = useState<any>({});
  const [doctorInfo, setDoctorInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Pagination & Filter state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('Tất cả'); // Tất cả, Hôm nay, Đã từng khám, Đang theo dõi, Tái khám

  const fetchData = async () => {
    setIsLoading(true);
    const res = await getDoctorPatientsData();
    if (res.success && res.data) {
      setPatients(res.data.patients);
      setKpis(res.data.kpis);
      setDoctorInfo(res.data.doctorInfo);
    } else {
      router.push('/login');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [router]);

  const stats = {
    total: kpis?.total || 0,
    following: kpis?.inTreatment || 0,
    new: kpis?.new || 0,
    revisit: patients.filter(p => p.status === 'Tái khám').length,
    completed: kpis?.completed || 0
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Đang theo dõi':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Tái khám':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'Đã từng khám':
        return 'text-gray-600 bg-gray-100 border-gray-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  // Filtering logic
  const filteredPatients = patients.filter(p => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      if (!p.name.toLowerCase().includes(term) && !p.phone.includes(term) && !p.code.toLowerCase().includes(term)) return false;
    }
    
    if (activeFilter === 'Hôm nay') {
       if (!p.hasTodayAppointment) return false;
    } else if (activeFilter !== 'Tất cả') {
       if (p.status !== activeFilter) return false;
    }

    return true;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage) || 1;
  const paginatedPatients = filteredPatients.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (isLoading || !doctorInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="w-10 h-10 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] font-sans text-gray-800">
      {/* SIDEBAR */}
      <DoctorSidebar activePage="patients" />

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-white">
        {/* HEADER CỐ ĐỊNH */}
        <header className="bg-white border-b border-gray-100 px-8 h-20 shrink-0 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Danh sách bệnh nhân</h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex gap-4">
              <button className="relative text-gray-400 hover:text-gray-600 transition">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">3</span>
              </button>
            </div>
            <div className="h-8 w-px bg-gray-200"></div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">BS. {doctorInfo.name}</p>
                <p className="text-xs text-gray-500">Khoa Nội tổng quát</p>
              </div>
              <img src={doctorInfo.avatar} alt="Doctor" className="w-10 h-10 rounded-full border border-gray-200 object-cover" />
            </div>
          </div>
        </header>

        {/* NỘI DUNG SCROLL */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">

          {/* FILTER BARS & SEARCH */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
              
              {/* STATUS FILTER CHIPS */}
              <div className="flex flex-wrap items-center gap-2">
                {['Tất cả', 'Hôm nay', 'Đã từng khám', 'Đang theo dõi', 'Tái khám'].map(filter => (
                  <button
                    key={filter}
                    onClick={() => { setActiveFilter(filter); setCurrentPage(1); }}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      activeFilter === filter
                        ? 'bg-[#2563EB] text-white shadow-md'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {/* SEARCH */}
              <div className="relative w-full md:w-80">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  placeholder="Mã BN, Tên bệnh nhân, SĐT..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all"
                />
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              </div>

            </div>
          </div>

          {/* TABLE */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-50/50 border-b border-gray-100 text-gray-500 text-xs font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-5">Mã BN</th>
                    <th className="px-6 py-5">Bệnh nhân</th>
                    <th className="px-6 py-5">Tuổi</th>
                    <th className="px-6 py-5">Giới tính</th>
                    <th className="px-6 py-5">Lần khám gần nhất</th>
                    <th className="px-6 py-5">Trạng thái</th>
                    <th className="px-6 py-5 text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedPatients.length > 0 ? paginatedPatients.map((p, idx) => (
                    <tr key={p.id} className="hover:bg-gray-50/80 transition-colors group">
                      <td className="px-6 py-4">
                        <span className="font-semibold text-[#2563EB] bg-blue-50 px-2 py-1 rounded-md text-xs">{p.code}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=random`} alt={p.name} className="w-9 h-9 rounded-full border border-gray-200 object-cover" />
                          <div>
                            <p className="font-bold text-gray-900">{p.name}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{p.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700 font-medium">
                        {p.age}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 text-[11px] font-bold rounded-md ${p.gender === 'Nam' ? 'bg-sky-50 text-sky-600' : 'bg-pink-50 text-pink-600'}`}>
                          {p.gender}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-700">
                           <Clock size={14} className="text-gray-400" />
                           <span className="font-medium">{p.lastVisit}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold border ${getStatusStyle(p.status)}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link href={`/doctor/patients/${p.id}`} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-semibold transition-colors text-xs bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:text-gray-900 shadow-sm">
                              <Eye size={14} />
                              Xem hồ sơ
                            </Link>
                            <Link href={`/doctor/patients/${p.id}?tab=history`} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-semibold transition-colors text-xs bg-purple-50 text-purple-700 border-purple-100 hover:bg-purple-100 shadow-sm">
                              <FileText size={14} />
                              Lịch sử khám
                            </Link>
                            <Link href={`/doctor/records/create?patientId=${p.id}`} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-semibold transition-colors text-xs bg-[#2563EB] text-white border-blue-600 hover:bg-blue-700 shadow-sm">
                              <Plus size={14} />
                              Tạo bệnh án
                            </Link>
                          </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                           <Users size={48} className="text-gray-200 mb-3" />
                           <p className="text-gray-500 font-medium">Không tìm thấy bệnh nhân nào phù hợp</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            {filteredPatients.length > 0 && (
              <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50 shrink-0">
                <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                  Hiển thị
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="border border-gray-200 rounded-md px-2 py-1 outline-none focus:border-[#2563EB] bg-white font-medium"
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                  / {filteredPatients.length} kết quả
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="w-8 h-8 rounded-md flex items-center justify-center text-gray-500 hover:bg-white hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all border border-transparent hover:border-gray-200"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-8 h-8 rounded-md flex items-center justify-center text-sm font-bold transition-all shadow-sm ${currentPage === i + 1 ? 'bg-[#2563EB] text-white border-blue-600' : 'bg-white text-gray-600 hover:bg-gray-50 border-gray-200'}`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="w-8 h-8 rounded-md flex items-center justify-center text-gray-500 hover:bg-white hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all border border-transparent hover:border-gray-200"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}