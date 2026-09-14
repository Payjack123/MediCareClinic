'use client';
import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Clock, ArrowLeft, Loader2, CreditCard, User, XCircle,
  Receipt, CheckCircle, AlertTriangle, RefreshCcw, HandCoins
} from 'lucide-react';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

import Sidebar from '@/app/admin/Sidebar';
import { getPaymentDetail, updatePaymentStatus } from '@/app/admin/payments/actions';

export default function PaymentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const paymentId = Number(resolvedParams.id);

  const [isLoading, setIsLoading] = useState(true);
  const [payment, setPayment] = useState<any>(null);

  const fetchPayment = async () => {
    setIsLoading(true);
    const res = await getPaymentDetail(paymentId);
    if (res.success && res.data) {
      setPayment(res.data);
    } else {
      toast.error('Không tìm thấy giao dịch');
      router.push('/admin/payments');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (paymentId) {
      fetchPayment();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentId]);

  const handleStatusChange = async (newStatus: string) => {
    if (!confirm(`Bạn có chắc muốn thực hiện: "${newStatus}" giao dịch này?`)) return;

    const toastId = toast.loading('Đang xử lý...');
    const res = await updatePaymentStatus(paymentId, newStatus);

    if (res.success) {
      toast.success(res.message, { id: toastId });
      fetchPayment();
    } else {
      toast.error(res.message, { id: toastId });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Chờ xác nhận': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Đang đối soát': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Đã thanh toán': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Hoàn tiền': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Đã hủy': return 'bg-red-100 text-red-700 border-red-200';
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
              <CreditCard className="text-blue-600" /> Chi tiết Đối soát Giao dịch
            </h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-sm font-medium text-slate-500 bg-slate-100 px-4 py-2 rounded-full border border-slate-200 flex items-center gap-2">
              <Clock size={16} /> {currentDateTime}
            </div>
          </div>
        </header>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto p-8 animate-in fade-in duration-500">

          {isLoading ? (
            <div className="py-20 flex justify-center"><Loader2 className="w-10 h-10 text-blue-600 animate-spin" /></div>
          ) : payment && (
            <div className="max-w-4xl mx-auto space-y-6">

              <div className="flex items-center justify-between mb-2">
                <Link href="/admin/payments" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold transition-colors">
                  <ArrowLeft size={20} /> Quay lại danh sách
                </Link>

                <Link href={`/admin/billing/${payment.id}`} className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl font-bold transition flex items-center gap-2 text-sm border border-slate-200">
                  <Receipt size={16} /> Xem chi tiết Hóa đơn gốc
                </Link>
              </div>

              {/* CARD ĐỐI SOÁT */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">

                {/* HEADER GIAO DỊCH */}
                <div className="bg-slate-50 border-b border-slate-200 p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div>
                    <h2 className="text-sm font-medium text-slate-500 mb-1 tracking-wider uppercase">Mã Giao dịch</h2>
                    <div className="text-3xl font-black text-slate-900 mb-2">{payment.transactionCode}</div>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      Hóa đơn tham chiếu: <Link href={`/admin/billing/${payment.id}`} className="font-bold text-blue-600 hover:underline">{payment.invoiceCode}</Link>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className={`px-5 py-2.5 rounded-xl font-bold border ${getStatusBadge(payment.status)} flex items-center gap-2`}>
                      Trạng thái: {payment.status}
                    </div>
                  </div>
                </div>

                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-slate-100 bg-white">

                  {/* BÊN TRÁI: DỮ LIỆU TỪ HÓA ĐƠN (PHẢI THU) */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                        <Receipt size={16} /> Hệ thống (Phải thu)
                      </h3>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 h-full">
                      <div className="space-y-4">
                        <div>
                          <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Bệnh nhân</p>
                          <p className="font-bold text-slate-900 flex items-center gap-2">
                            <User size={16} className="text-slate-400" />
                            {payment.patient?.fullName} ({payment.patient?.patientProfile?.patientCode || 'N/A'})
                          </p>
                        </div>

                        <div className="pt-4 border-t border-dashed border-slate-300">
                          <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Số tiền Hóa đơn</p>
                          <p className="text-3xl font-black text-slate-900">
                            {payment.expectedAmount.toLocaleString('vi-VN')} đ
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* BÊN PHẢI: DỮ LIỆU TỪ LỄ TÂN (THỰC THU) */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                        <HandCoins size={16} /> Lễ tân (Thực thu)
                      </h3>
                    </div>
                    <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 h-full">
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Người thu</p>
                            <p className="font-bold text-slate-900">{payment.cashier}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Hình thức</p>
                            <p className="font-bold text-slate-900">{payment.method}</p>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-dashed border-blue-200">
                          <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1 flex justify-between">
                            <span>Số tiền Khách đưa</span>
                            <span>{dayjs(payment.date).format('DD/MM/YYYY HH:mm')}</span>
                          </p>
                          <p className={`text-3xl font-black ${payment.actualAmount >= payment.expectedAmount ? 'text-emerald-600' : 'text-red-600'}`}>
                            {payment.actualAmount.toLocaleString('vi-VN')} đ
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* KẾT QUẢ ĐỐI SOÁT */}
                <div className="p-8 border-b border-slate-100">
                  {payment.actualAmount === payment.expectedAmount ? (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                        <CheckCircle size={24} className="text-emerald-600" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-emerald-800 mb-1">Khớp dữ liệu hoàn toàn</h4>
                        <p className="text-emerald-600 font-medium">Số tiền thu thực tế từ Lễ tân khớp với Số tiền phải thu trên Hóa đơn của hệ thống.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                        <AlertTriangle size={24} className="text-red-600" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-red-800 mb-1">Dữ liệu KHÔNG khớp</h4>
                        <p className="text-red-600 font-medium">Lệch: {Math.abs(payment.actualAmount - payment.expectedAmount).toLocaleString('vi-VN')} đ. Vui lòng kiểm tra lại với Lễ tân trước khi đối soát.</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* HÀNH ĐỘNG CỦA ADMIN */}
                <div className="bg-slate-50 p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-slate-500 font-medium">
                    Thao tác xử lý luồng tiền dành cho Quản trị viên:
                  </div>
                  <div className="flex flex-wrap gap-3">

                    {['Chờ xác nhận', 'Đang đối soát'].includes(payment.status) && (
                      <button
                        onClick={() => handleStatusChange('Đã thanh toán')}
                        className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-sm hover:bg-emerald-700 transition flex items-center gap-2"
                      >
                        <CheckCircle size={18} /> Xác nhận Đối soát Giao dịch
                      </button>
                    )}

                    {['Đã thanh toán', 'Chờ xác nhận'].includes(payment.status) && (
                      <button
                        onClick={() => handleStatusChange('Hoàn tiền')}
                        className="px-6 py-3 bg-white border border-orange-200 text-orange-600 rounded-xl font-bold hover:bg-orange-50 transition flex items-center gap-2"
                      >
                        <RefreshCcw size={18} /> Duyệt Hoàn Tiền
                      </button>
                    )}

                    {!['Đã thanh toán', 'Đã hủy', 'Hoàn tiền'].includes(payment.status) && (
                      <button
                        onClick={() => handleStatusChange('Đã hủy')}
                        className="px-6 py-3 bg-white border border-red-200 text-red-600 rounded-xl font-bold hover:bg-red-50 transition flex items-center gap-2"
                      >
                        <XCircle size={18} /> Hủy giao dịch
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
