'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
   Search, Filter, Plus, Calendar, User, FileText, ChevronRight, MoreVertical, Eye, Stethoscope, Pill, FlaskConical, Bell
} from 'lucide-react';
import DoctorSidebar from "@/app/doctor/Sidebar";
import { getDoctorMedicalRecords } from './actions';

export default function DoctorMedicalRecordsPage() {
   const router = useRouter();

   const [records, setRecords] = useState<any[]>([]);
   const [doctorInfo, setDoctorInfo] = useState<any>(null);
   const [isLoading, setIsLoading] = useState(true);
   const [searchTerm, setSearchTerm] = useState('');
   const [statusFilter, setStatusFilter] = useState('Tất cả');

   useEffect(() => {
      const fetchData = async () => {
         setIsLoading(true);
         const res = await getDoctorMedicalRecords();
         if (res.success && res.data) {
            setRecords(res.data.records);
            setDoctorInfo(res.data.doctor);
         }
         setIsLoading(false);
      };
      fetchData();
   }, []);

   const filteredRecords = records.filter(record => {
      const matchesSearch = record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
         record.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
         record.patientCode.toLowerCase().includes(searchTerm.toLowerCase());

      if (statusFilter === 'Tất cả') return matchesSearch;
      return matchesSearch && record.status === statusFilter;
   });

   return (
      <div className="min-h-screen flex bg-[#F8FAFC] font-sans text-gray-800">
         <DoctorSidebar activePage="records" />

         <main className="flex-1 flex flex-col h-screen overflow-hidden">
            {/* HEADER */}
            <header className="bg-white border-b border-gray-100 px-8 h-20 shrink-0 flex items-center justify-between sticky top-0 z-10">
               <div>
                  <h1 className="text-xl font-bold text-gray-900 leading-none mb-1.5">Hồ sơ bệnh án</h1>
                  <div className="text-[13px] text-gray-500 flex items-center gap-1.5">
                     <span>Danh sách hồ sơ bệnh án của bác sĩ</span>
                  </div>
               </div>
               <div className="flex items-center gap-5">
                  <button className="relative p-2 text-gray-400 hover:bg-gray-50 rounded-full transition-colors">
                     <Bell size={20} />
                     <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                  </button>
                  <div className="flex items-center gap-3 pl-5 border-l border-gray-100">
                     <div className="text-right">
                        <p className="text-sm font-bold text-gray-900 leading-tight">BS. {doctorInfo?.name || '...'}</p>
                     </div>
                     <img src={doctorInfo?.avatar || `https://ui-avatars.com/api/?name=BS&background=E0E7FF&color=2563EB`} alt="Doctor" className="w-10 h-10 rounded-full border border-gray-200 object-cover" />
                  </div>
               </div>
            </header>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
               <div className="max-w-7xl mx-auto">

                  {/* TOOLBAR */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                     <div className="flex items-center gap-3">
                        <div className="relative w-72">
                           <input
                              type="text"
                              placeholder="Tìm mã hồ sơ, tên bệnh nhân..."
                              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                           />
                           <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        </div>

                        <div className="relative">
                           <select
                              className="pl-10 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none cursor-pointer"
                              value={statusFilter}
                              onChange={(e) => setStatusFilter(e.target.value)}
                           >
                              <option value="Tất cả">Trạng thái: Tất cả</option>
                              <option value="Hoàn thành">Hoàn thành</option>
                              <option value="Đang theo dõi">Đang theo dõi</option>
                           </select>
                           <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        </div>
                     </div>

                     <Link href="/doctor/patients" className="flex items-center gap-2 px-5 py-2.5 bg-[#2563EB] text-white rounded-xl text-sm font-bold shadow-sm hover:bg-blue-700 transition-all" title="Chọn bệnh nhân để tạo bệnh án">
                        <Plus size={18} /> Tạo hồ sơ mới
                     </Link>
                  </div>

                  {/* BẢNG DỮ LIỆU */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[500px]">
                     <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50/50 text-gray-500 font-bold text-[11px] uppercase tracking-wider">
                           <tr>
                              <th className="px-6 py-4 border-b border-gray-100">Mã hồ sơ</th>
                              <th className="px-6 py-4 border-b border-gray-100">Bệnh nhân</th>
                              <th className="px-6 py-4 border-b border-gray-100">Ngày khám</th>
                              <th className="px-6 py-4 border-b border-gray-100">Chẩn đoán</th>
                              <th className="px-6 py-4 border-b border-gray-100">Trạng thái</th>
                              <th className="px-6 py-4 border-b border-gray-100 text-center">Thao tác</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                           {isLoading ? (
                              <tr>
                                 <td colSpan={6} className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center justify-center text-gray-400">
                                       <div className="w-8 h-8 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin mb-3"></div>
                                       <p>Đang tải dữ liệu...</p>
                                    </div>
                                 </td>
                              </tr>
                           ) : filteredRecords.length > 0 ? (
                              filteredRecords.map((record) => (
                                 <tr key={record.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                       <span className="font-bold text-[#2563EB] bg-blue-50 px-2.5 py-1 rounded-md text-xs">{record.code}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                       <div className="flex items-center gap-3">
                                          <div className="w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold border border-indigo-100">
                                             {record.patientName.charAt(0)}
                                          </div>
                                          <div>
                                             <p className="font-bold text-gray-900">{record.patientName}</p>
                                             <p className="text-xs text-gray-500">{record.patientCode}</p>
                                          </div>
                                       </div>
                                    </td>
                                    <td className="px-6 py-4">
                                       <div className="flex items-center gap-1.5 text-gray-600">
                                          <Calendar size={14} className="text-gray-400" />
                                          <span className="font-medium">{record.date}</span>
                                       </div>
                                    </td>
                                    <td className="px-6 py-4">
                                       <p className="font-medium text-gray-900 line-clamp-1 max-w-[200px]" title={record.diagnosis}>{record.diagnosis}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                       <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold inline-flex items-center gap-1.5 border
                                   ${record.status === 'Hoàn thành' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-orange-50 text-orange-600 border-orange-100'}
                                `}>
                                          {record.status === 'Hoàn thành' ? <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> : <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>}
                                          {record.status}
                                       </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                       <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                          <Link href={`/doctor/records/detail?id=${record.id}`} className="w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-600 flex items-center justify-center hover:bg-blue-50 hover:text-[#2563EB] hover:border-blue-200 transition-colors shadow-sm" title="Xem hồ sơ">
                                             <Eye size={16} />
                                          </Link>
                                       </div>
                                       <button className="w-8 h-8 rounded-lg text-gray-400 flex items-center justify-center group-hover:hidden">
                                          <MoreVertical size={16} />
                                       </button>
                                    </td>
                                 </tr>
                              ))
                           ) : (
                              <tr>
                                 <td colSpan={6} className="px-6 py-16 text-center">
                                    <div className="flex flex-col items-center justify-center text-gray-400">
                                       <FileText size={48} className="text-gray-200 mb-4" />
                                       <h3 className="text-base font-bold text-gray-900 mb-1">Không tìm thấy hồ sơ bệnh án</h3>
                                       <p className="text-sm">Hãy thử thay đổi điều kiện tìm kiếm hoặc tạo hồ sơ mới.</p>
                                    </div>
                                 </td>
                              </tr>
                           )}
                        </tbody>
                     </table>
                  </div>

               </div>
            </div>
         </main>
      </div>
   );
}
