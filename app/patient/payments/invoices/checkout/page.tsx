'use client';
import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ChevronLeft, Loader2, Landmark, Wallet, Users, ShieldCheck, Lock
} from 'lucide-react';
import { getPatientBillingData, confirmInvoicePayment } from '@/app/patient/payments/invoices/actions';

function InvoicePaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'ONLINE' | 'BANK' | 'EWALLET' | 'COUNTER'>('ONLINE');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const res = await getPatientBillingData();
      if (res.success && res.data) {
        setData(res.data);
      } else {
        router.push('/login');
      }
      setIsLoading(false);
    };
    fetchData();
  }, [router]);

  const handleConfirmPayment = async (rawId: number) => {
    setIsSubmitting(true);
    const res = await confirmInvoicePayment(rawId);
    setIsSubmitting(false);

    if (res.success) {
      alert("Thanh toán thành công!");
      router.push('/patient/payments/history');
    } else {
      alert(res.message);
    }
  };

  if (isLoading || !data) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#2563EB] animate-spin" />
      </div>
    );
  }

  const { invoices } = data;
  const activeInvoice = invoices.find((inv: any) => inv.id === id);

  if (!activeInvoice) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <Wallet size={48} className="text-gray-300 mb-4" />
        <p className="text-gray-500 font-medium">Không tìm thấy hóa đơn này.</p>
        <Link href="/patient/payments/invoices/pending" className="mt-4 text-[#2563EB] hover:underline font-bold">
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      
      {/* Tiêu đề & Breadcrumb */}
      <div>
        <h1 className="text-2xl font-black text-gray-900">Thanh toán hóa đơn</h1>
        <Link href={`/patient/payments/invoices/details?id=${activeInvoice.id}`} className="inline-flex items-center gap-1 text-[#2563EB] text-sm font-bold mt-4 hover:underline">
          <ChevronLeft size={16} /> Quay lại chi tiết hóa đơn
        </Link>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <div className="text-center mb-8 pb-8 border-b border-gray-100">
          <h2 className="font-bold text-gray-500 mb-2">Số tiền cần thanh toán</h2>
          <p className="font-black text-4xl xl:text-5xl text-[#2563EB]">{activeInvoice.final} <span className="text-3xl">₫</span></p>
          <p className="text-sm text-gray-500 mt-2">Mã hóa đơn: <strong className="text-gray-900">{activeInvoice.id}</strong></p>
        </div>

        <h3 className="font-bold text-gray-900 mb-4 text-lg">Chọn phương thức thanh toán</h3>
        
        <div className="space-y-4 mb-8">
          
          {/* Phương thức 1 */}
          <label className={`flex gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'ONLINE' ? 'border-[#2563EB] bg-blue-50/50 shadow-sm ring-2 ring-blue-500/20 transform scale-[1.01]' : 'border-gray-100 hover:border-blue-300'}`}>
            <div className="pt-0.5">
              <input type="radio" name="paymentMethod" className="w-4 h-4 text-[#2563EB] mt-1" checked={paymentMethod === 'ONLINE'} onChange={() => setPaymentMethod('ONLINE')} />
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-900 text-base">Thanh toán thẻ Online</p>
              <p className="text-sm text-gray-500 mt-1">Hỗ trợ thẻ ATM, Visa, MasterCard, JCB</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <div className="h-6 w-9 bg-[#1434CB] rounded flex items-center justify-center text-[10px] text-white font-bold italic">VISA</div>
              <div className="h-6 w-9 bg-red-500 rounded flex items-center justify-center text-[10px] text-white font-bold">MC</div>
            </div>
          </label>

          {/* Phương thức 2 */}
          <label className={`flex gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'BANK' ? 'border-[#2563EB] bg-blue-50/50 shadow-sm ring-2 ring-blue-500/20 transform scale-[1.01]' : 'border-gray-100 hover:border-blue-300'}`}>
            <div className="pt-0.5">
              <input type="radio" name="paymentMethod" className="w-4 h-4 text-[#2563EB] mt-1" checked={paymentMethod === 'BANK'} onChange={() => setPaymentMethod('BANK')} />
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-900 text-base">Chuyển khoản ngân hàng</p>
              <p className="text-sm text-gray-500 mt-1">Chuyển khoản qua số tài khoản của phòng khám</p>
            </div>
            <div className="flex items-center text-[#2563EB]">
              <Landmark size={32} />
            </div>
          </label>

          {/* Phương thức 3 */}
          <label className={`flex gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'EWALLET' ? 'border-[#2563EB] bg-blue-50/50 shadow-sm ring-2 ring-blue-500/20 transform scale-[1.01]' : 'border-gray-100 hover:border-blue-300'}`}>
            <div className="pt-0.5">
              <input type="radio" name="paymentMethod" className="w-4 h-4 text-[#2563EB] mt-1" checked={paymentMethod === 'EWALLET'} onChange={() => setPaymentMethod('EWALLET')} />
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-900 text-base">Ví điện tử</p>
              <p className="text-sm text-gray-500 mt-1">Thanh toán qua ứng dụng MoMo, ZaloPay, VNPay</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <div className="h-8 w-8 bg-[#A50064] rounded flex items-center justify-center text-xs text-white font-bold">mo</div>
              <div className="h-8 w-8 bg-[#0068FF] rounded flex items-center justify-center text-xs text-white font-bold">Zalo</div>
            </div>
          </label>

          {/* Phương thức 4 */}
          <label className={`flex gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'COUNTER' ? 'border-[#2563EB] bg-blue-50/50 shadow-sm ring-2 ring-blue-500/20 transform scale-[1.01]' : 'border-gray-100 hover:border-blue-300'}`}>
            <div className="pt-0.5">
              <input type="radio" name="paymentMethod" className="w-4 h-4 text-[#2563EB] mt-1" checked={paymentMethod === 'COUNTER'} onChange={() => setPaymentMethod('COUNTER')} />
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-900 text-base">Thanh toán tại quầy</p>
              <p className="text-sm text-gray-500 mt-1">Giao dịch trực tiếp bằng tiền mặt hoặc quẹt thẻ tại lễ tân</p>
            </div>
            <div className="flex items-center text-gray-400">
              <Users size={32} />
            </div>
          </label>

        </div>

        <button
          disabled={isProcessing || activeInvoice.status === 'Đã thanh toán'}
          onClick={() => handleConfirmPayment(activeInvoice.rawId)}
          className="w-full bg-[#2563EB] hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-200 transition-all flex justify-center items-center gap-2 disabled:opacity-50"
        >
          {isProcessing ? <Loader2 size={20} className="animate-spin" /> : <Lock size={20} />} 
          {activeInvoice.status === 'Đã thanh toán' ? 'Hóa đơn đã thanh toán' : `Xác nhận thanh toán ${activeInvoice.final} ₫`}
        </button>
        
        <div className="mt-5 flex items-center justify-center gap-2 text-xs text-gray-500 text-center">
          <ShieldCheck size={16} className="text-green-600" /> Toàn bộ giao dịch và thông tin thẻ được mã hóa bảo mật tuyệt đối.
        </div>

      </div>
    </div>
  );
}

export default function InvoicePaymentPage() {
  return (
    <Suspense fallback={
      <div className="flex h-full items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#2563EB] animate-spin" />
      </div>
    }>
      <InvoicePaymentContent />
    </Suspense>
  );
}
