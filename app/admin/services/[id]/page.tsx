'use client';
import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Clock, ArrowLeft, Loader2, BriefcaseMedical, Building2,
  Clock4, DollarSign, CheckCircle2, AlertTriangle, ShieldCheck
} from 'lucide-react';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

import Sidebar from '@/app/admin/Sidebar';
import { getServiceDetail, updateServiceStatus } from '@/app/admin/services/actions';
import { getDepartmentDetail } from '@/app/admin/departments/actions';

export default function ServiceDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const serviceId = resolvedParams.id;
  
  const [isLoading, setIsLoading] = useState(true);
  const [service, setService] = useState<any>(null);
  const [department, setDepartment] = useState<any>(null);

  const fetchService = async () => {
    setIsLoading(true);
    const res = await getServiceDetail(serviceId);
    if (res.success && res.data) {
      setService(res.data);
      if (res.data.departmentId) {
        const deptRes = await getDepartmentDetail(res.data.departmentId);
        if (deptRes.success) setDepartment(deptRes.data);
      }
    } else {
      toast.error('Không tìm thấy dịch vụ');
      router.push('/admin/services');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (serviceId) fetchService();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceId]);

  const handleUpdateStatus = async (status: string) => {
    const res = await updateServiceStatus(serviceId, status);
    if (res.success) {
      toast.success(res.message);
      fetchService();
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Hoạt động': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Tạm dừng': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Ngừng hoạt động': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
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
              <BriefcaseMedical className="text-blue-600"/> Chi tiết Dịch vụ
            </h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-sm font-medium text-slate-500 bg-slate-100 px-4 py-2 rounded-full border border-slate-200 flex items-center gap-2">
              <Clock size={16}/> {currentDateTime}
            </div>
          </div>
        </header>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto p-8 animate-in fade-in duration-500">
          
          {isLoading ? (
            <div className="py-20 flex justify-center"><Loader2 className="w-10 h-10 text-blue-600 animate-spin" /></div>
          ) : service && (
            <div className="max-w-5xl mx-auto space-y-6">
              
              <div className="flex items-center justify-between mb-2">
                <Link href="/admin/services" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold transition-colors">
                  <ArrowLeft size={20}/> Quay lại danh mục
                </Link>
              </div>

              {/* CARD DỊCH VỤ */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                
                {/* HEADER */}
                <div className="bg-slate-50 border-b border-slate-200 p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-bold text-slate-400 tracking-wider uppercase border border-slate-200 bg-white px-3 py-1 rounded-lg">
                        Mã DV: {service.id}
                      </span>
                      <span className="text-sm font-bold text-blue-700 bg-blue-100 px-3 py-1 rounded-lg">
                        {service.type}
                      </span>
                    </div>
                    <div className="text-3xl font-black text-slate-900">{service.name}</div>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <div className={`px-5 py-2.5 rounded-xl font-bold border ${getStatusBadge(service.status)} flex items-center gap-2`}>
                      Trạng thái: {service.status}
                    </div>
                  </div>
                </div>

                <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 border-b border-slate-100">
                  
                  {/* BÊN TRÁI: THÔNG TIN TỔ CHỨC */}
                  <div className="space-y-6">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                      <Building2 size={16}/> Cơ cấu tổ chức
                    </h3>
                    
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-5">
                      <div>
                        <p className="text-xs text-slate-500 font-bold uppercase mb-1">Khoa Phụ Trách</p>
                        {department ? (
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-black text-slate-900 text-lg">{department.name}</p>
                              <p className="text-sm text-slate-600 mt-1">
                                👨‍⚕️ Trưởng khoa: {department.headDoctor}
                              </p>
                            </div>
                            <Link href={`/admin/departments/${department.id}`} className="px-3 py-1.5 text-xs font-bold text-blue-600 bg-blue-100 hover:bg-blue-200 rounded-lg transition">
                              Xem Khoa
                            </Link>
                          </div>
                        ) : (
                          <p className="font-bold text-slate-900 text-lg">{service.departmentName}</p>
                        )}
                      </div>

                      <div className="border-t border-slate-200 pt-5">
                        <p className="text-xs text-slate-500 font-bold uppercase mb-2">Phòng thực hiện (Gợi ý từ Khoa)</p>
                        {department?.rooms && department.rooms.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {department.rooms.filter((r: any) => r.status === 'Hoạt động').map((r: any) => (
                              <span key={r.id} className="px-3 py-1.5 bg-white border border-slate-200 text-sm font-bold text-slate-700 rounded-lg shadow-sm">
                                {r.name}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-slate-500 italic">Chưa cấu hình phòng hoạt động trong khoa này.</p>
                        )}
                      </div>

                      <div className="border-t border-slate-200 pt-5">
                        <p className="text-xs text-slate-500 font-bold uppercase mb-1">Thời gian dự kiến</p>
                        <p className="font-bold text-slate-900 flex items-center gap-2">
                          <Clock4 size={18} className="text-blue-500"/> {service.duration || 'Không xác định'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* BÊN PHẢI: CHI PHÍ */}
                  <div className="space-y-6">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                      <DollarSign size={16}/> Tài chính & Chi phí
                    </h3>
                    
                    <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 space-y-5 h-full">
                      <div>
                        <p className="text-xs text-slate-500 font-bold uppercase mb-1">Giá niêm yết</p>
                        <p className="text-4xl font-black text-blue-700">
                          {service.price.toLocaleString('vi-VN')} đ
                        </p>
                      </div>

                      <div className="border-t border-blue-200 border-dashed pt-5">
                        <p className="text-xs text-slate-500 font-bold uppercase mb-2">Chính sách BHYT</p>
                        {service.hasBHYT ? (
                          <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-emerald-100">
                            <ShieldCheck className="text-emerald-500 shrink-0" size={24}/>
                            <div>
                              <p className="font-bold text-emerald-800">Được áp dụng giảm trừ BHYT</p>
                              <p className="text-xs text-emerald-600 mt-0.5">Dịch vụ này nằm trong danh mục thanh toán của Bảo hiểm Y tế. Mức giảm trừ sẽ được tính tự động khi xuất hóa đơn dựa vào thẻ của Bệnh nhân.</p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-slate-200">
                            <AlertTriangle className="text-slate-400 shrink-0" size={24}/>
                            <div>
                              <p className="font-bold text-slate-700">Không áp dụng BHYT</p>
                              <p className="text-xs text-slate-500 mt-0.5">Bệnh nhân phải thanh toán 100% chi phí cho dịch vụ này.</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-8 border-b border-slate-100 bg-white">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Mô tả / Hướng dẫn</h3>
                  <p className="text-slate-700 leading-relaxed">{service.desc || 'Chưa có thông tin mô tả chi tiết cho dịch vụ này.'}</p>
                </div>

                {/* HÀNH ĐỘNG CỦA ADMIN */}
                <div className="bg-slate-50 p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-slate-500 font-medium">
                    Quản lý hoạt động dịch vụ:
                  </div>
                  <div className="flex flex-wrap gap-3">
                    
                    {service.status !== 'Hoạt động' && (
                      <button 
                        onClick={() => handleUpdateStatus('Hoạt động')}
                        className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-bold shadow-sm hover:bg-emerald-700 transition flex items-center gap-2"
                      >
                        <CheckCircle2 size={18}/> Bật Hoạt Động
                      </button>
                    )}

                    {service.status === 'Hoạt động' && (
                      <button 
                        onClick={() => handleUpdateStatus('Tạm dừng')}
                        className="px-6 py-2.5 bg-white border border-amber-300 text-amber-700 rounded-xl font-bold hover:bg-amber-50 transition flex items-center gap-2"
                      >
                        Tạm dừng dịch vụ
                      </button>
                    )}

                    {service.status !== 'Ngừng hoạt động' && (
                      <button 
                        onClick={() => handleUpdateStatus('Ngừng hoạt động')}
                        className="px-6 py-2.5 bg-white border border-red-200 text-red-600 rounded-xl font-bold hover:bg-red-50 transition flex items-center gap-2"
                      >
                        Ngừng vĩnh viễn
                      </button>
                    )}

                  </div>
                </div>

              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
