'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Search, Bell, Clock, BriefcaseMedical, Plus, 
  Settings2, Filter, X
} from 'lucide-react';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

import Sidebar from '@/app/admin/Sidebar';
import { getServices, saveService } from '@/app/admin/services/actions';
import { getDepartments } from '@/app/admin/departments/actions';

export default function AdminServicesPage() {
  const router = useRouter();
  
  const [services, setServices] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [filters, setFilters] = useState({
    search: '',
    departmentId: '',
    type: '',
    status: ''
  });

  // Modal Thêm Dịch vụ
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newService, setNewService] = useState({
    id: '',
    name: '',
    type: 'Khám bệnh',
    departmentId: '',
    price: 0,
    hasBHYT: true,
    duration: '20 phút',
    status: 'Hoạt động',
    desc: ''
  });

  const fetchData = async () => {
    setIsLoading(true);
    
    // Tải danh sách Khoa phòng để filter & tạo dịch vụ mới
    const deptRes = await getDepartments();
    if (deptRes.success) setDepartments(deptRes.data);

    // Tải danh sách dịch vụ
    const res = await getServices();
    if (res.success && res.data) {
      let filtered = res.data;
      
      if (filters.search) {
        const query = filters.search.toLowerCase();
        filtered = filtered.filter((s: any) => 
          s.id.toLowerCase().includes(query) || 
          s.name.toLowerCase().includes(query)
        );
      }
      if (filters.departmentId) {
        filtered = filtered.filter((s: any) => s.departmentId === filters.departmentId);
      }
      if (filters.type) {
        filtered = filtered.filter((s: any) => s.type === filters.type);
      }
      if (filters.status) {
        filtered = filtered.filter((s: any) => s.status === filters.status);
      }
      setServices(filtered);
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

  const handleSaveService = async () => {
    if (!newService.id || !newService.name || !newService.departmentId) {
      toast.error('Vui lòng nhập Mã DV, Tên DV và Khoa phụ trách');
      return;
    }
    
    const toastId = toast.loading('Đang lưu dịch vụ...');
    // Ép kiểu số
    const payload = { ...newService, price: Number(newService.price) };
    const res = await saveService(payload);
    
    if (res.success) {
      toast.success(res.message, { id: toastId });
      setIsAddModalOpen(false);
      setNewService({ id: '', name: '', type: 'Khám bệnh', departmentId: '', price: 0, hasBHYT: true, duration: '20 phút', status: 'Hoạt động', desc: '' });
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
              <BriefcaseMedical className="text-blue-600"/> Quản lý Dịch vụ
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
                  placeholder="Tên DV, Mã DV..." 
                  className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 w-64 transition-all outline-none"
                  value={filters.search}
                  onChange={e => setFilters({...filters, search: e.target.value})}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18}/>
              </div>

              <select 
                className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none w-44"
                value={filters.departmentId}
                onChange={e => setFilters({...filters, departmentId: e.target.value})}
              >
                <option value="">Tất cả các khoa</option>
                {departments.map((d: any) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>

              <select 
                className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none w-40"
                value={filters.type}
                onChange={e => setFilters({...filters, type: e.target.value})}
              >
                <option value="">Tất cả loại DV</option>
                <option value="Khám bệnh">Khám bệnh</option>
                <option value="Xét nghiệm">Xét nghiệm</option>
                <option value="Chẩn đoán hình ảnh">Chẩn đoán hình ảnh</option>
                <option value="Thủ thuật">Thủ thuật / Khác</option>
              </select>

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
              <Plus size={18}/> Thêm Dịch vụ
            </button>
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
                      <th className="px-6 py-4">Mã DV</th>
                      <th className="px-6 py-4">Tên Dịch Vụ</th>
                      <th className="px-6 py-4">Loại DV</th>
                      <th className="px-6 py-4">Khoa phụ trách</th>
                      <th className="px-6 py-4 text-right">Giá niêm yết</th>
                      <th className="px-6 py-4 text-center">BHYT</th>
                      <th className="px-6 py-4">Trạng thái</th>
                      <th className="px-6 py-4 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {services.length > 0 ? services.map((svc: any) => (
                      <tr key={svc.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-500">{svc.id}</td>
                        <td className="px-6 py-4 font-bold text-slate-900">{svc.name}</td>
                        <td className="px-6 py-4 text-slate-600 font-medium">{svc.type}</td>
                        <td className="px-6 py-4 text-slate-600 font-medium">{svc.departmentName}</td>
                        <td className="px-6 py-4 text-right font-black text-blue-600">
                          {svc.price.toLocaleString('vi-VN')} đ
                        </td>
                        <td className="px-6 py-4 text-center">
                          {svc.hasBHYT ? (
                            <span className="text-emerald-600 font-bold">Có</span>
                          ) : (
                            <span className="text-slate-400 font-medium">Không</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 text-xs font-bold rounded-lg w-max inline-block ${getStatusBadge(svc.status)}`}>
                            {svc.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link href={`/admin/services/${svc.id}`} className="inline-flex items-center justify-center px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition font-bold text-xs gap-1">
                            <Settings2 size={16}/> Xem / Sửa
                          </Link>
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan={8} className="px-6 py-12 text-center text-slate-500">Không tìm thấy dịch vụ nào phù hợp.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* MODAL THÊM DỊCH VỤ MỚI */}
        {isAddModalOpen && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <BriefcaseMedical className="text-blue-600" size={20}/> Thêm Dịch Vụ Mới
                </h3>
                <button onClick={() => setIsAddModalOpen(false)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition">
                  <X size={20}/>
                </button>
              </div>
              
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">
                
                <div className="col-span-full md:col-span-1">
                  <label className="block text-sm font-bold text-slate-700 mb-1">Mã DV <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    placeholder="VD: DV005" 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none"
                    value={newService.id} onChange={e => setNewService({...newService, id: e.target.value.toUpperCase()})}
                  />
                </div>
                
                <div className="col-span-full md:col-span-1">
                  <label className="block text-sm font-bold text-slate-700 mb-1">Tên Dịch Vụ <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    placeholder="VD: Chụp X-Quang Ngực" 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none"
                    value={newService.name} onChange={e => setNewService({...newService, name: e.target.value})}
                  />
                </div>

                <div className="col-span-full md:col-span-1">
                  <label className="block text-sm font-bold text-slate-700 mb-1">Loại dịch vụ</label>
                  <select 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none"
                    value={newService.type} onChange={e => setNewService({...newService, type: e.target.value})}
                  >
                    <option value="Khám bệnh">Khám bệnh</option>
                    <option value="Xét nghiệm">Xét nghiệm</option>
                    <option value="Chẩn đoán hình ảnh">Chẩn đoán hình ảnh</option>
                    <option value="Thủ thuật">Thủ thuật / Khác</option>
                  </select>
                </div>

                <div className="col-span-full md:col-span-1">
                  <label className="block text-sm font-bold text-slate-700 mb-1">Khoa phụ trách <span className="text-red-500">*</span></label>
                  <select 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none"
                    value={newService.departmentId} onChange={e => setNewService({...newService, departmentId: e.target.value})}
                  >
                    <option value="">Chọn khoa...</option>
                    {departments.map((d: any) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div className="col-span-full md:col-span-1">
                  <label className="block text-sm font-bold text-slate-700 mb-1">Giá niêm yết (VNĐ) <span className="text-red-500">*</span></label>
                  <input 
                    type="number" 
                    placeholder="200000" 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-blue-700 focus:bg-white focus:border-blue-500 outline-none"
                    value={newService.price} onChange={e => setNewService({...newService, price: Number(e.target.value)})}
                  />
                </div>

                <div className="col-span-full md:col-span-1">
                  <label className="block text-sm font-bold text-slate-700 mb-1">Thời gian thực hiện dự kiến</label>
                  <input 
                    type="text" 
                    placeholder="VD: 20 phút" 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none"
                    value={newService.duration} onChange={e => setNewService({...newService, duration: e.target.value})}
                  />
                </div>

                <div className="col-span-full flex items-center gap-3 bg-blue-50 p-4 rounded-xl border border-blue-100">
                  <input 
                    type="checkbox" 
                    id="hasBHYT"
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    checked={newService.hasBHYT} onChange={e => setNewService({...newService, hasBHYT: e.target.checked})}
                  />
                  <label htmlFor="hasBHYT" className="text-sm font-bold text-blue-900 cursor-pointer">
                    Dịch vụ này được áp dụng giảm trừ Bảo Hiểm Y Tế (BHYT)
                  </label>
                </div>

                <div className="col-span-full">
                  <label className="block text-sm font-bold text-slate-700 mb-1">Mô tả thêm</label>
                  <textarea 
                    placeholder="Mô tả chi tiết, hướng dẫn, lưu ý trước khi làm..." 
                    rows={3}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none resize-none"
                    value={newService.desc} onChange={e => setNewService({...newService, desc: e.target.value})}
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
                  onClick={handleSaveService}
                  className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm rounded-xl transition"
                >
                  Lưu Dịch Vụ Mới
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
