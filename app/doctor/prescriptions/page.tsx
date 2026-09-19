'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Pill, CheckCircle2, Clock, Calendar, Search, Star,
  Plus, FileText, XCircle
} from 'lucide-react';
import DoctorSidebar from "@/app/doctor/Sidebar";
import { getDoctorPrescriptionsData } from '@/app/doctor/prescriptions/actions';

export default function DoctorPrescriptionsPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Lọc dữ liệu
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedPatient, setSelectedPatient] = useState('Tất cả');
  const [filterStatus, setFilterStatus] = useState('Tất cả');
  const [searchTerm, setSearchTerm] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus, selectedPatient, fromDate, toDate]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const res = await getDoctorPrescriptionsData();
      if (res.success && res.data) {
        setData(res.data);
      } else {
        router.push('/login');
      }
      setIsLoading(false);
    };
    fetchData();
  }, [router]);

  const handleResetFilter = () => {
    setFromDate('');
    setToDate('');
    setSelectedPatient('Tất cả');
    setFilterStatus('Tất cả');
    setSearchTerm('');
  };

  if (isLoading || !data) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <div className="flex items-center gap-3 text-[#2563EB]">
         <div className="w-6 h-6 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin"></div>
         <p className="font-bold">Đang tải dữ liệu...</p>
      </div>
    </div>
  );

  const rawPrescriptions = data.prescriptions || [];
  const uniquePatients = Array.from(new Set(rawPrescriptions.map((p: any) => p.patientName)));

  const filteredPrescriptions = rawPrescriptions.filter((p: any) => {
    const matchSearch = searchTerm === '' || 
      p.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.code.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.patientCode.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchStatus = filterStatus === 'Tất cả' || p.status === filterStatus;
    const matchPatient = selectedPatient === 'Tất cả' || p.patientName === selectedPatient;

    let matchDate = true;
    if (fromDate || toDate) {
      const pDateArr = p.date.split('/');
      if (pDateArr.length === 3) {
        const pDate = new Date(`${pDateArr[2]}-${pDateArr[1]}-${pDateArr[0]}`);
        pDate.setHours(0, 0, 0, 0);
        
        if (fromDate) {
          const fd = new Date(fromDate);
          fd.setHours(0, 0, 0, 0);
          if (pDate < fd) matchDate = false;
        }
        if (toDate) {
          const td = new Date(toDate);
          td.setHours(23, 59, 59, 999);
          if (pDate > td) matchDate = false;
        }
      }
    }
    return matchSearch && matchStatus && matchPatient && matchDate;
  });

  const totalItems = filteredPrescriptions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPrescriptions = filteredPrescriptions.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] font-sans text-gray-800 overflow-hidden">
      <DoctorSidebar activePage="prescriptions-list" />
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0 z-10">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">Quản lý Đơn thuốc</h1>
            <p className="text-sm text-gray-500">Xem và quản lý các đơn thuốc đã kê</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-gray-900">BS. {data.doctorInfo.name}</p>
                <div className="flex text-yellow-400 text-xs justify-end">
                  {[...Array(Math.floor(data.doctorInfo.rating))].map((_, i) => <Star key={i} fill="currentColor" size={12} />)}
                </div>
              </div>
              <img src={data.doctorInfo.avatar} alt="Doctor" className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover bg-white" />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 bg-gray-50/50 animate-in fade-in duration-500">
          <div className="grid grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 text-[#2563EB] rounded-2xl flex items-center justify-center"><Pill size={24} /></div>
              <div><p className="text-sm text-gray-500 font-medium">Tổng đơn thuốc</p><p className="text-2xl font-black text-gray-900">{data.kpis.total}</p></div>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-50 text-gray-600 rounded-2xl flex items-center justify-center"><FileText size={24} /></div>
              <div><p className="text-sm text-gray-500 font-medium">Đơn nháp</p><p className="text-2xl font-black text-gray-900">{data.kpis.draft}</p></div>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center"><CheckCircle2 size={24} /></div>
              <div><p className="text-sm text-gray-500 font-medium">Đã phát hành</p><p className="text-2xl font-black text-gray-900">{data.kpis.published}</p></div>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center"><XCircle size={24} /></div>
              <div><p className="text-sm text-gray-500 font-medium">Đã hủy</p><p className="text-2xl font-black text-gray-900">{data.kpis.cancelled}</p></div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-8 w-full">
            <div className="flex flex-wrap xl:flex-nowrap items-end gap-3 w-full">
              <div className="flex-1 min-w-[130px] flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Từ ngày</label>
                <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white text-gray-700 transition-all" />
              </div>
              <div className="flex-1 min-w-[130px] flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Đến ngày</label>
                <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white text-gray-700 transition-all" />
              </div>
              <div className="flex-1 min-w-[140px] flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Bệnh nhân</label>
                <select value={selectedPatient} onChange={(e) => setSelectedPatient(e.target.value)} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white cursor-pointer text-gray-700 transition-all">
                  <option value="Tất cả">Tất cả Bệnh nhân</option>
                  {uniquePatients.map((p: any, i: number) => <option key={i} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="flex-1 min-w-[130px] flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Trạng thái</label>
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white cursor-pointer text-gray-700 transition-all">
                  <option value="Tất cả">Tất cả</option>
                  <option value="Nháp">Nháp</option>
                  <option value="Đã kê">Đã kê</option>
                  <option value="Đã hủy">Đã hủy</option>
                </select>
              </div>
              <div className="flex-[1.5] min-w-[180px] flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Tìm kiếm</label>
                <div className="relative w-full">
                  <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Mã đơn, tên BN..." className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white text-gray-700 transition-all" />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 h-[38px] mb-[1px]">
                <button onClick={handleResetFilter} className="bg-[#2563EB] text-white px-5 h-full rounded-lg font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-1.5 text-sm shadow-sm">
                  Đặt lại
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            <div className="p-5 border-b border-gray-100 bg-gray-50 font-bold text-gray-700 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-base">Danh sách đơn thuốc</span>
                <span className="text-[#2563EB] bg-blue-100 px-3 py-1 rounded-md text-xs font-bold">{filteredPrescriptions.length} Kết quả</span>
              </div>
              <Link
                href="/doctor/prescriptions/create"
                className="bg-[#2563EB] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 shadow-md transition-all flex items-center gap-2 text-sm"
              >
                <Plus size={18} /> Tạo đơn thuốc
              </Link>
            </div>

            <div className="overflow-x-auto custom-scrollbar min-h-[400px]">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-white border-b border-gray-100 text-gray-500 font-bold">
                  <tr>
                    <th className="px-6 py-4 text-center">STT</th>
                    <th className="px-6 py-4">Mã đơn thuốc</th>
                    <th className="px-6 py-4">Bệnh nhân</th>
                    <th className="px-6 py-4">Ngày kê đơn</th>
                    <th className="px-6 py-4">Chẩn đoán</th>
                    <th className="px-6 py-4">Trạng thái</th>
                    <th className="px-6 py-4 text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {currentPrescriptions.length > 0 ? currentPrescriptions.map((p: any, index: number) => (
                    <tr
                      key={p.id}
                      className="hover:bg-blue-50/50 transition-colors group cursor-pointer"
                      onClick={() => router.push(`/doctor/prescriptions/${p.id}`)}
                    >
                      <td className="px-6 py-4 text-center font-bold text-gray-400">{startIndex + index + 1}</td>
                      <td className="px-6 py-4 font-bold text-[#2563EB] group-hover:underline">{p.code}</td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-900">{p.patientName}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{p.patientCode}</p>
                      </td>
                      <td className="px-6 py-4 text-gray-700 flex items-center gap-1.5 h-[72px]"><Calendar size={14} /> {p.date}</td>
                      <td className="px-6 py-4 font-medium text-gray-800 max-w-[200px] truncate" title={p.diagnosis}>{p.diagnosis}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border flex items-center w-max gap-1.5 ${p.statusColor}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center gap-2">
                           <button
                            onClick={(e) => { e.stopPropagation(); router.push(`/doctor/prescriptions/${p.id}`); }}
                            className="text-[#2563EB] bg-blue-50 hover:bg-[#2563EB] hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shadow-sm border border-blue-100"
                          >
                            Xem chi tiết
                          </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={8} className="px-6 py-16 text-center text-gray-500">
                        <FileText size={48} className="mx-auto mb-4 opacity-20" />
                        Không tìm thấy đơn thuốc nào phù hợp với bộ lọc.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                Hiển thị
                <select
                  className="border border-gray-200 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-[#2563EB] bg-gray-50"
                  value={itemsPerPage}
                  onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
                kết quả
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                  &laquo;
                </button>
                {totalPages > 0 && [...Array(totalPages)].map((_, i) => (
                    <button
                      key={i+1}
                      onClick={() => setCurrentPage(i+1)}
                      className={`px-3.5 py-1.5 rounded-lg border text-sm font-bold transition-colors ${currentPage === i+1
                        ? 'bg-[#2563EB] border-[#2563EB] text-white'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                      {i+1}
                    </button>
                ))}
                <button
                  onClick={() => setCurrentPage(Math.min(Math.max(1, totalPages), currentPage + 1))}
                  disabled={currentPage >= totalPages}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                  &raquo;
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}