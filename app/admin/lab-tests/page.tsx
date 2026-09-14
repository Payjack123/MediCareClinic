'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Search, Bell, Clock, Eye, Filter, CalendarDays, TestTube, ArrowRight
} from 'lucide-react';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

import Sidebar from '@/app/admin/Sidebar';
import { getLabTests } from '@/app/admin/lab-tests/actions';

export default function AdminLabTestsPage() {
  const router = useRouter();
  
  const [labTests, setLabTests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [filters, setFilters] = useState({
    search: '',
    fromDate: '',
    toDate: '',
    status: ''
  });

  const fetchData = async () => {
    setIsLoading(true);
    const res = await getLabTests(filters);

    if (res.success && res.data) {
      setLabTests(res.data);
    } else {
      if (res.message === 'Không có quyền truy cập') {
        router.push('/login');
      } else {
        toast.error(res.message || 'Có lỗi xảy ra');
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ordered':
      case 'Đã chỉ định': return 'bg-blue-100 text-blue-700';
      case 'waiting':
      case 'Đang thực hiện': return 'bg-amber-100 text-amber-700';
      case 'processing':
      case 'Đang xử lý': return 'bg-orange-100 text-orange-700';
      case 'has_result':
      case 'Đã có kết quả': return 'bg-emerald-100 text-emerald-700';
      case 'evaluated':
      case 'Bác sĩ đã xem': return 'bg-purple-100 text-purple-700';
      case 'canceled':
      case 'Đã hủy': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const translateStatus = (status: string) => {
    switch (status) {
      case 'ordered': return 'Đã chỉ định';
      case 'waiting': return 'Đang thực hiện';
      case 'processing': return 'Đang xử lý';
      case 'has_result': return 'Đã có kết quả';
      case 'evaluated': return 'Bác sĩ đã xem';
      case 'canceled': return 'Đã hủy';
      default: return status;
    }
  };

  const currentDateTime = dayjs().format('DD/MM/YYYY HH:mm');

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans text-slate-800 overflow-hidden">
      
      <Sidebar />

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* TOP HEADER */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 z-10 shadow-sm">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <TestTube className="text-blue-600"/> Quản lý Kết quả Xét nghiệm
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
          
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 mb-8 flex flex-col xl:flex-row items-center gap-4 justify-between">
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative group">
                <input 
                  type="text" 
                  placeholder="Mã XN, Tên BN, SĐT..." 
                  className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 w-64 transition-all outline-none"
                  value={filters.search}
                  onChange={e => setFilters({...filters, search: e.target.value})}
                  onKeyDown={e => e.key === 'Enter' && fetchData()}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18}/>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Từ ngày (DD/MM)"
                    className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none w-44"
                    value={filters.fromDate}
                    onChange={e => setFilters({...filters, fromDate: e.target.value})}
                  />
                  <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
                </div>
                <span className="text-slate-400">-</span>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Đến ngày"
                    className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none w-44"
                    value={filters.toDate}
                    onChange={e => setFilters({...filters, toDate: e.target.value})}
                  />
                  <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
                </div>
              </div>

              <select 
                className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none w-48"
                value={filters.status}
                onChange={e => setFilters({...filters, status: e.target.value})}
              >
                <option value="">Tất cả trạng thái</option>
                <option value="ordered">Đã chỉ định</option>
                <option value="waiting">Đang thực hiện</option>
                <option value="processing">Đang xử lý</option>
                <option value="has_result">Đã có kết quả</option>
                <option value="evaluated">Bác sĩ đã xem</option>
                <option value="canceled">Đã hủy</option>
              </select>
              
              <button 
                onClick={fetchData}
                disabled={isLoading}
                className="bg-slate-100 text-slate-700 hover:bg-slate-200 px-4 py-2.5 rounded-xl font-bold transition flex items-center gap-2 text-sm"
              >
                <Filter size={18}/> Lọc
              </button>
            </div>
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
                      <th className="px-6 py-4">Mã XN</th>
                      <th className="px-6 py-4">Bệnh nhân</th>
                      <th className="px-6 py-4">Loại xét nghiệm</th>
                      <th className="px-6 py-4">Bác sĩ chỉ định</th>
                      <th className="px-6 py-4">Thời gian</th>
                      <th className="px-6 py-4">Trạng thái</th>
                      <th className="px-6 py-4 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {labTests.length > 0 ? labTests.map((test: any) => (
                      <tr key={test.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-900">XN-{String(test.id).padStart(5, '0')}</td>
                        <td className="px-6 py-4 font-medium text-slate-900">
                          {test.patient?.fullName} <br/>
                          <span className="text-xs text-slate-500 font-normal">{test.patient?.phone} | {test.patient?.patientProfile?.patientCode}</span>
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-800">
                          {test.testName}
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-700">
                          BS. {test.doctorName}
                        </td>
                        <td className="px-6 py-4 text-slate-700 font-medium">
                          {dayjs(test.date).format('DD/MM/YYYY')} <br/>
                          <span className="text-xs text-slate-500 font-normal">{dayjs(test.date).format('HH:mm')}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 text-xs font-bold rounded-lg flex items-center gap-1.5 w-max ${getStatusBadge(test.statusType)}`}>
                            {translateStatus(test.statusType)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/admin/lab-tests/${test.id}`} className="px-3 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition font-bold text-xs flex items-center gap-1" title="Xem chi tiết">
                              Xem KQ <ArrowRight size={14}/>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan={7} className="px-6 py-12 text-center text-slate-500">Không tìm thấy xét nghiệm nào phù hợp.</td></tr>
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
