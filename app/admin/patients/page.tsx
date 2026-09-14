'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Search, Bell, User, Loader2, Plus, Edit, Eye, Filter, Lock, Unlock, Users, Clock
} from 'lucide-react';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

import Sidebar from '@/app/admin/Sidebar';
import { getPatients, updatePatientStatus } from '@/app/admin/patients/actions';

export default function AdminPatientsPage() {
  const router = useRouter();
  
  const [patients, setPatients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [filters, setFilters] = useState({
    search: '',
    gender: '',
    status: ''
  });

  const fetchData = async () => {
    setIsLoading(true);
    const res = await getPatients(filters);

    if (res.success && res.data) {
      setPatients(res.data);
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

  const toggleStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'Khóa' ? 'Hoạt động' : 'Khóa';
    
    if (!confirm(`Bạn có chắc chắn muốn ${newStatus === 'Khóa' ? 'khóa' : 'mở khóa'} bệnh nhân này?`)) return;

    const toastId = toast.loading('Đang xử lý...');
    const res = await updatePatientStatus(id, newStatus);
    
    if (res.success) {
      toast.success(res.message, { id: toastId });
      fetchData(); // Reload data
    } else {
      toast.error(res.message, { id: toastId });
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
              <Users className="text-blue-600"/> Quản lý Bệnh nhân
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
                  placeholder="Tên, Mã, SĐT..." 
                  className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 w-64 transition-all outline-none"
                  value={filters.search}
                  onChange={e => setFilters({...filters, search: e.target.value})}
                  onKeyDown={e => e.key === 'Enter' && fetchData()}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18}/>
              </div>

              <select 
                className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none w-48"
                value={filters.gender}
                onChange={e => setFilters({...filters, gender: e.target.value})}
              >
                <option value="">Tất cả giới tính</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>

              <select 
                className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none w-48"
                value={filters.status}
                onChange={e => setFilters({...filters, status: e.target.value})}
              >
                <option value="">Tất cả trạng thái</option>
                <option value="Hoạt động">Hoạt động</option>
                <option value="Tạm khóa">Tạm khóa</option>
                <option value="Khóa">Đã Khóa</option>
              </select>
              
              <button 
                onClick={fetchData}
                disabled={isLoading}
                className="bg-slate-100 text-slate-700 hover:bg-slate-200 px-4 py-2.5 rounded-xl font-bold transition flex items-center gap-2 text-sm"
              >
                <Filter size={18}/>
                Lọc
              </button>
            </div>
            
            <Link href="/admin/patients/create" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 shadow-md transition flex items-center gap-2 text-sm">
              <Plus size={18}/> Thêm bệnh nhân
            </Link>
          </div>

          {isLoading ? (
            <div className="py-20 flex justify-center"><Loader2 className="w-10 h-10 text-blue-600 animate-spin" /></div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-xs tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Mã BN</th>
                      <th className="px-6 py-4">Họ tên</th>
                      <th className="px-6 py-4">Giới tính</th>
                      <th className="px-6 py-4">Số điện thoại</th>
                      <th className="px-6 py-4">Ngày sinh</th>
                      <th className="px-6 py-4">Trạng thái</th>
                      <th className="px-6 py-4 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {patients.length > 0 ? patients.map((pat: any) => {
                      const profile = pat.patientProfile;
                      const status = pat.status || 'Hoạt động';
                      
                      let statusBadge = '';
                      if (status === 'Hoạt động') {
                        statusBadge = 'bg-emerald-100 text-emerald-700';
                      } else if (status === 'Tạm khóa') {
                        statusBadge = 'bg-amber-100 text-amber-700';
                      } else {
                        statusBadge = 'bg-red-100 text-red-700';
                      }

                      return (
                        <tr key={pat.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 font-bold text-slate-900">{profile?.patientCode || 'N/A'}</td>
                          <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs">
                              {pat.fullName?.charAt(0) || 'BN'}
                            </div>
                            {pat.fullName}
                          </td>
                          <td className="px-6 py-4 text-slate-600">{pat.gender || 'Nam'}</td>
                          <td className="px-6 py-4 text-slate-600">{pat.phone}</td>
                          <td className="px-6 py-4 text-slate-600">{pat.dob ? dayjs(pat.dob, 'YYYY-MM-DD').format('DD/MM/YYYY') : 'N/A'}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 text-xs font-bold rounded-lg flex items-center gap-1.5 w-max ${statusBadge}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.replace('100', '500').replace('text', 'bg').split(' ')[0]}`}></span>
                              {status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link href={`/admin/patients/${pat.id}`} className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition" title="Xem chi tiết">
                                <Eye size={16}/>
                              </Link>
                              <Link href={`/admin/patients/${pat.id}?tab=info&edit=true`} className="p-2 text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-lg transition" title="Sửa">
                                <Edit size={16}/>
                              </Link>
                              {status === 'Khóa' ? (
                                <button onClick={() => toggleStatus(pat.id, status)} className="p-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition" title="Mở khóa">
                                  <Unlock size={16}/>
                                </button>
                              ) : (
                                <button onClick={() => toggleStatus(pat.id, status)} className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition" title="Khóa tài khoản">
                                  <Lock size={16}/>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    }) : (
                      <tr><td colSpan={7} className="px-6 py-12 text-center text-slate-500">Không tìm thấy bệnh nhân nào phù hợp.</td></tr>
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