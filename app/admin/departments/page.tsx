'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Search, Bell, Clock, Building2, Plus, 
  Settings2, ShieldCheck, X
} from 'lucide-react';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

import Sidebar from '@/app/admin/Sidebar';
import { getDepartments, saveDepartment } from '@/app/admin/departments/actions';

export default function AdminDepartmentsPage() {
  const router = useRouter();
  
  const [departments, setDepartments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [filters, setFilters] = useState({
    search: '',
    status: ''
  });

  // Modal Thêm Khoa
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newDept, setNewDept] = useState({
    id: '',
    name: '',
    headDoctor: '',
    desc: '',
    status: 'Hoạt động'
  });

  const fetchData = async () => {
    setIsLoading(true);
    const res = await getDepartments();

    if (res.success && res.data) {
      let filtered = res.data;
      if (filters.search) {
        const query = filters.search.toLowerCase();
        filtered = filtered.filter((d: any) => 
          d.id.toLowerCase().includes(query) || 
          d.name.toLowerCase().includes(query) ||
          d.headDoctor.toLowerCase().includes(query)
        );
      }
      if (filters.status) {
        filtered = filtered.filter((d: any) => d.status === filters.status);
      }
      setDepartments(filtered);
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
  }, [filters]);

  const handleLogout = () => {
    router.push('/login');
  };

  const handleSaveDepartment = async () => {
    if (!newDept.id || !newDept.name) {
      toast.error('Vui lòng nhập Mã khoa và Tên khoa');
      return;
    }
    
    const toastId = toast.loading('Đang lưu khoa mới...');
    const res = await saveDepartment(newDept);
    
    if (res.success) {
      toast.success(res.message, { id: toastId });
      setIsAddModalOpen(false);
      setNewDept({ id: '', name: '', headDoctor: '', desc: '', status: 'Hoạt động' });
      fetchData();
    } else {
      toast.error(res.message, { id: toastId });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Hoạt động': return 'bg-emerald-100 text-emerald-700';
      case 'Tạm dừng': return 'bg-amber-100 text-amber-700';
      case 'Ngừng hoạt động': return 'bg-slate-200 text-slate-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const currentDateTime = dayjs().format('DD/MM/YYYY HH:mm');

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans text-slate-800 overflow-hidden">
      
      <Sidebar />

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* TOP HEADER */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 z-10 shadow-sm">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="text-blue-600"/> Quản lý Cơ cấu Khoa phòng
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
                  placeholder="Tên khoa, Mã khoa..." 
                  className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 w-64 transition-all outline-none"
                  value={filters.search}
                  onChange={e => setFilters({...filters, search: e.target.value})}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18}/>
              </div>

              <select 
                className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none w-44"
                value={filters.status}
                onChange={e => setFilters({...filters, status: e.target.value})}
              >
                <option value="">Tất cả trạng thái</option>
                <option value="Hoạt động">Hoạt động</option>
                <option value="Tạm dừng">Tạm dừng</option>
                <option value="Ngừng hoạt động">Ngừng hoạt động</option>
              </select>
            </div>
            
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-2.5 rounded-xl font-bold transition flex items-center gap-2 text-sm shadow-sm"
            >
              <Plus size={18}/> Thêm Khoa
            </button>
          </div>

          {isLoading ? (
            <div className="py-20 flex justify-center">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {departments.length > 0 ? departments.map((dept: any) => (
                <div key={dept.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
                  <div className="p-5 border-b border-slate-100">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`px-2.5 py-1 text-xs font-bold rounded-lg ${getStatusBadge(dept.status)}`}>
                        {dept.status}
                      </div>
                      <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                        {dept.id}
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-1">{dept.name}</h3>
                    <p className="text-sm text-slate-500 line-clamp-2 min-h-[40px]">{dept.desc}</p>
                  </div>
                  
                  <div className="p-5 bg-slate-50 flex-1 grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <p className="text-xs text-slate-400 font-bold uppercase mb-1">Trưởng khoa</p>
                      <p className="font-bold text-slate-800 text-sm flex items-center gap-2"><ShieldCheck size={16} className="text-blue-500"/> {dept.headDoctor || 'Chưa chỉ định'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase mb-1">Nhân sự</p>
                      <p className="font-bold text-slate-800 text-sm">{dept.doctors?.length || 0} Bác sĩ</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase mb-1">Phòng khám</p>
                      <p className="font-bold text-slate-800 text-sm">{dept.rooms?.length || 0} Phòng</p>
                    </div>
                  </div>
                  
                  <div className="p-4 border-t border-slate-100 bg-white mt-auto">
                    <Link href={`/admin/departments/${dept.id}`} className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white rounded-xl font-bold transition text-sm">
                      <Settings2 size={18}/> Quản lý Khoa & Phòng
                    </Link>
                  </div>
                </div>
              )) : (
                <div className="col-span-full py-12 text-center text-slate-500">
                  <Building2 size={48} className="mx-auto text-slate-300 mb-4"/>
                  <p className="text-lg font-medium">Chưa có khoa phòng nào hoặc không khớp tìm kiếm.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* MODAL THÊM KHOA MỚI */}
        {isAddModalOpen && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Building2 className="text-blue-600" size={20}/> Thêm Khoa Mới
                </h3>
                <button onClick={() => setIsAddModalOpen(false)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition">
                  <X size={20}/>
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Mã khoa <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      placeholder="VD: NTQ002" 
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none"
                      value={newDept.id} onChange={e => setNewDept({...newDept, id: e.target.value.toUpperCase()})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Tên khoa <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      placeholder="VD: Khoa Khám bệnh" 
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none"
                      value={newDept.name} onChange={e => setNewDept({...newDept, name: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Trưởng khoa (Tên BS)</label>
                  <input 
                    type="text" 
                    placeholder="Nhập tên trưởng khoa..." 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none"
                    value={newDept.headDoctor} onChange={e => setNewDept({...newDept, headDoctor: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Mô tả khoa</label>
                  <textarea 
                    placeholder="Chức năng, nhiệm vụ..." 
                    rows={3}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none resize-none"
                    value={newDept.desc} onChange={e => setNewDept({...newDept, desc: e.target.value})}
                  />
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                <button 
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition"
                >
                  Hủy
                </button>
                <button 
                  onClick={handleSaveDepartment}
                  className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm rounded-xl transition"
                >
                  Lưu Khoa mới
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}