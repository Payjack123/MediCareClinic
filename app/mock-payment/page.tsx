'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Landmark, CheckCircle2, Loader2, X } from 'lucide-react';
import { mockConfirmPayment } from '@/app/patient/appointments/actions';

function MockPaymentContent() {
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  const amount = searchParams.get('amount');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!code) {
    return <div className="p-8 text-center text-gray-500">Mã giao dịch không hợp lệ.</div>;
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#F4F6F8] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
          <CheckCircle2 size={40} />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">Thanh toán thành công!</h2>
        <p className="text-gray-500 mb-8">Giao dịch đã được ghi nhận. Vui lòng xem màn hình máy tính để tiếp tục.</p>
        <button 
          onClick={() => window.close()} 
          className="bg-gray-200 text-gray-800 font-bold py-3 px-8 rounded-xl"
        >
          Đóng trang này
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6F8] flex flex-col max-w-md mx-auto shadow-2xl relative">
      {/* Header */}
      <div className="bg-[#2563EB] text-white pt-6 pb-4 px-6 rounded-b-3xl shrink-0 shadow-md">
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => window.close()}><X size={24} /></button>
          <h3 className="font-bold text-lg">Chuyển khoản an toàn</h3>
          <div className="w-6"></div>
        </div>
        <div className="text-center">
          <p className="text-blue-100 text-sm mb-1">Số tiền thanh toán</p>
          <p className="text-3xl font-black">{Number(amount || 0).toLocaleString('vi-VN')} VND</p>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 p-5 pt-8">
        <div className="bg-white rounded-2xl p-5 shadow-sm mb-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center border border-blue-100">
              <Landmark size={24} className="text-[#2563EB]" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-0.5">Tới tài khoản</p>
              <p className="font-black text-gray-900">PHONG KHAM DA KHOA N1</p>
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-sm space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Ngân hàng thụ hưởng:</span>
              <span className="font-bold text-[#2563EB]">MB Bank</span>
            </div>
            <div className="h-px bg-gray-200 w-full"></div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Số tài khoản:</span>
              <span className="font-bold text-gray-900 tracking-wider">0968973608</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm mb-4 border border-gray-100">
          <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">Nội dung chuyển tiền</p>
          <p className="font-bold text-gray-900 bg-yellow-50/50 p-3 rounded-xl border border-yellow-100 text-center text-lg">{code}</p>
        </div>
      </div>

      {/* Footer */}
      <div className="p-5 bg-white border-t border-gray-100 mt-auto pb-8">
        <button
          disabled={isSubmitting}
          onClick={async () => {
            setIsSubmitting(true);
            const res = await mockConfirmPayment(code);
            setIsSubmitting(false);
            if (res.success) {
              setIsSuccess(true);
            } else {
              alert("Có lỗi xảy ra: " + res.message);
            }
          }}
          className="w-full bg-[#2563EB] text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSubmitting ? <Loader2 size={24} className="animate-spin" /> : 'Xác nhận thanh toán'}
        </button>
        <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1.5">
          Đây là môi trường giả lập (Mock)
        </p>
      </div>
    </div>
  );
}

export default function MockPaymentPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center"><Loader2 className="animate-spin mx-auto text-blue-500" /></div>}>
      <MockPaymentContent />
    </Suspense>
  );
}
