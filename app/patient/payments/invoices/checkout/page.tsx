'use client';
import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ChevronLeft, Loader2, Landmark, Wallet, Users, ShieldCheck, Lock, ArrowLeft
} from 'lucide-react';
import QRCode from 'react-qr-code';
import { getPatientBillingData, confirmInvoicePayment } from '@/app/patient/payments/invoices/actions';
import { checkPayment } from '@/app/patient/appointments/actions';

function InvoicePaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'BANK' | 'COUNTER'>('COUNTER');
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (showQR && id) {
      interval = setInterval(async () => {
        try {
          const res = await checkPayment(id);
          if (res.paid) {
            clearInterval(interval);
            alert("Thanh toán thành công!");
            router.push('/patient/payments/history');
          }
        } catch (e) { }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [showQR, id, router]);

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
    if (paymentMethod === 'BANK') {
      setShowQR(true);
      return;
    }

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

  if (showQR) {
    return (
      <div className="w-full max-w-2xl mx-auto space-y-6">
        <div className="p-8 flex-1 flex flex-col animate-in slide-in-from-right-8 bg-gray-50/50 rounded-2xl border border-gray-200">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
            <button onClick={() => setShowQR(false)} className="p-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-full text-gray-600 transition"><ArrowLeft size={20} /></button>
            <div>
              <h2 className="text-2xl font-black text-gray-900">Quét mã QR thanh toán</h2>
              <p className="text-gray-500 text-sm mt-1">Mở ứng dụng ngân hàng của bạn và quét mã QR bên dưới.</p>
            </div>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center max-w-lg mx-auto w-full">
            <div className="bg-[#2563EB] text-white w-full py-4 rounded-t-xl text-center font-bold text-lg mb-6 shadow-md">
              MB Bank (Mock)
            </div>

            <div className="p-4 bg-white border-2 border-dashed border-[#2563EB] rounded-2xl shadow-sm mb-8 flex justify-center">
              <QRCode
                value={`${typeof window !== 'undefined' ? window.location.origin : ''}/mock-payment?code=${activeInvoice.id}&amount=${activeInvoice.finalRaw}`}
                size={200}
                level="M"
              />
            </div>

            <div className="w-full space-y-4 text-sm mb-8 bg-gray-50 p-6 rounded-xl border border-gray-200">
              <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                <span className="text-gray-500 font-medium">Số tiền:</span>
                <strong className="text-[#2563EB] text-xl">{activeInvoice.final} ₫</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-medium">Số tài khoản:</span>
                <strong className="text-gray-900 text-base tracking-wider">0968973608</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-medium">Ngân hàng:</span>
                <strong className="text-gray-900">MB Bank</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-medium">Nội dung bắt buộc:</span>
                <strong className="text-gray-900 bg-yellow-100 px-2 py-1 rounded">{activeInvoice.id}</strong>
              </div>
            </div>

            <button
              disabled={true}
              className="w-full bg-blue-50 text-[#2563EB] border border-blue-200 py-4 rounded-xl font-bold text-lg shadow-sm transition-all flex justify-center items-center gap-2"
            >
              <Loader2 size={24} className="animate-spin" />
              Hệ thống đang tự động xác nhận...
            </button>
            <p className="text-xs text-gray-400 mt-4 text-center">Hãy quét mã QR bằng điện thoại (Camera, Zalo) để mở giao diện thanh toán giả lập. Màn hình này sẽ tự động chuyển tiếp.</p>
          </div>
        </div>
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
