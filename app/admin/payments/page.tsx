'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Search, Bell, Clock, Filter, CalendarDays, CreditCard, ArrowRight,
  UserCircle2
} from 'lucide-react';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

import Sidebar from '@/app/admin/Sidebar';
import { getPayments } from '@/app/admin/payments/actions';

export default function AdminPaymentsPage() {
  const router = useRouter();
  
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [filters, setFilters] = useState({
    search: '',
    fromDate: '',
    toDate: '',
    method: '',
    status: ''
  });

  const fetchData = async () => {
    setIsLoading(true);
    const res = await getPayments(filters);

    if (res.success && res.data) {
      setPayments(res.data);
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
      case 'Chờ xác nhận': return 'bg-blue-100 text-blue-700';
      case 'Đang đối soát': return 'bg-amber-100 text-amber-700';
      case 'Đã thanh toán': return 'bg-emerald-100 text-emerald-700';
      case 'Hoàn tiền': return 'bg-orange-100 text-orange-700';
      case 'Đã hủy': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
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
              <CreditCard className="text-blue-600"/> Quản lý Thu phí (Giao dịch)
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
                  placeholder="Mã GD, HĐ, Tên BN..." 
                  className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 w-60 transition-all outline-none"
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
                    className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none w-36"
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
                    className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none w-36"
                    value={filters.toDate}
                    onChange={e => setFilters({...filters, toDate: e.target.value})}
                  />
                  <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
                </div>
              </div>

              <select 
                className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none w-40"
                value={filters.method}
                onChange={e => setFilters({...filters, method: e.target.value})}
              >
                <option value="">Tất cả P.Thức</option>
                <option value="Tiền mặt">Tiền mặt</option>
                <option value="Chuyển khoản">Chuyển khoản</option>
                <option value="Thẻ tín dụng">Thẻ tín dụng</option>
              </select>

              <select 
                className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none w-44"
                value={filters.status}
                onChange={e => setFilters({...filters, status: e.target.value})}
              >
                <option value="">Tất cả trạng thái</option>
                <option value="Chờ xác nhận">Chờ xác nhận</option>
                <option value="Đang đối soát">Đang đối soát</option>
                <option value="Đã thanh toán">Đã thanh toán</option>
                <option value="Hoàn tiền">Hoàn tiền</option>
                <option value="Đã hủy">Đã hủy</option>
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
                      <th className="px-6 py-4">Mã GD</th>
                      <th className="px-6 py-4">Bệnh nhân / Lễ tân</th>
                      <th className="px-6 py-4">Ngày giao dịch</th>
                      <th className="px-6 py-4 text-right">Số tiền</th>
                      <th className="px-6 py-4 text-center">P.Thức</th>
                      <th className="px-6 py-4">Trạng thái</th>
                      <th className="px-6 py-4 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {payments.length > 0 ? payments.map((pm: any) => (
                      <tr key={pm.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-900">{pm.transactionCode}</div>
                          <Link href={`/admin/billing/${pm.id}`} className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-0.5">
                            Hóa đơn: {pm.invoiceCode}
                          </Link>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-slate-900">{pm.patientName}</div>
                          <div className="text-xs text-slate-500 font-normal flex items-center gap-1 mt-0.5">
                            <UserCircle2 size={12}/> {pm.cashier}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-700 font-medium">
                          {dayjs(pm.date).format('DD/MM/YYYY')} <br/>
                          <span className="text-xs text-slate-500 font-normal">{dayjs(pm.date).format('HH:mm')}</span>
                        </td>
                        <td className="px-6 py-4 text-right font-black text-slate-900 text-base">
                          {pm.amount.toLocaleString('vi-VN')} đ
                        </td>
                        <td className="px-6 py-4 text-center font-medium text-slate-600">
                          {pm.method}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 text-xs font-bold rounded-lg flex items-center gap-1.5 w-max ${getStatusBadge(pm.status)}`}>
                            {pm.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link href={`/admin/payments/${pm.id}`} className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-bold text-xs gap-1 shadow-sm" title="Đối soát">
                            Đối soát
                          </Link>
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan={7} className="px-6 py-12 text-center text-slate-500">Không tìm thấy giao dịch nào phù hợp.</td></tr>
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
