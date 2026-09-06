'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ChevronLeft, CalendarDays, Loader2, Wallet, Users, Info, Building2, FileText, User
} from 'lucide-react';
import { getPatientBillingData } from '@/app/patient/payments/invoices/actions';

export default function InvoiceDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  if (isLoading || !data) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#2563EB] animate-spin" />
      </div>
    );
  }

  const { patientInfo, invoices } = data;
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
    <div className="w-full max-w-4xl mx-auto space-y-6">
      
      {/* Tiêu đề & Breadcrumb */}
      <div>
        <h1 className="text-2xl font-black text-gray-900">Chi tiết hóa đơn {activeInvoice.id}</h1>
        <Link href="/patient/payments/invoices/pending" className="inline-flex items-center gap-1 text-[#2563EB] text-sm font-bold mt-4 hover:underline">
          <ChevronLeft size={16} /> Quay lại danh sách
        </Link>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
          <h2 className="font-bold text-xl text-gray-900">Thông tin chi tiết</h2>
          <span className={`px-3 py-1.5 rounded-lg text-sm font-bold ${activeInvoice.status === 'Chưa thanh toán' ? 'bg-orange-100 text-orange-700' : activeInvoice.status === 'Quá hạn' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {activeInvoice.status}
          </span>
        </div>

        {/* Metadata Hóa đơn */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div>
            <p className="text-sm text-gray-500 flex items-center gap-1.5 mb-1"><FileText size={16}/> Mã hóa đơn</p>
            <p className="font-bold text-gray-900 text-lg">{activeInvoice.id}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 flex items-center gap-1.5 mb-1"><CalendarDays size={16}/> Ngày tạo</p>
            <p className="font-bold text-gray-900 text-lg">{activeInvoice.date}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 flex items-center gap-1.5 mb-1"><CalendarDays size={16}/> Hạn thanh toán</p>
            <p className="font-bold text-red-500 text-lg">{activeInvoice.dueDate}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 flex items-center gap-1.5 mb-1"><Building2 size={16}/> Cơ sở khám</p>
            <p className="font-bold text-gray-900 text-lg">{activeInvoice.facility}</p>
          </div>
        </div>

        {/* Bệnh nhân & Bác sĩ */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="flex-1 bg-blue-50/50 p-5 rounded-xl border border-blue-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 text-[#2563EB] rounded-lg"><User size={20} /></div>
              <h3 className="font-bold text-gray-900">Người bệnh</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Họ và tên</span><span className="font-bold text-gray-900">{patientInfo.name}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Mã bệnh nhân</span><span className="font-bold text-gray-900">{patientInfo.code}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Ngày sinh</span><span className="font-bold text-gray-900">{patientInfo.dob}</span></div>
            </div>
          </div>
          <div className="flex-1 bg-indigo-50/50 p-5 rounded-xl border border-indigo-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg"><Users size={20} /></div>
              <h3 className="font-bold text-gray-900">Bác sĩ phụ trách</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Bác sĩ</span><span className="font-bold text-gray-900">{activeInvoice.doctor}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Chuyên khoa</span><span className="font-bold text-gray-900">{activeInvoice.specialty}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Số hồ sơ</span><span className="font-bold text-gray-900">HS{activeInvoice.id.replace('HD', '')}</span></div>
            </div>
          </div>
        </div>

        {/* Danh sách dịch vụ */}
        <div className="mb-8">
          <h3 className="font-bold text-gray-900 mb-4 text-lg">Chi tiết dịch vụ</h3>
          <div className="overflow-hidden rounded-xl border border-gray-200">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-5 py-4 font-bold">STT</th>
                  <th className="px-5 py-4 font-bold">Dịch vụ</th>
                  <th className="px-5 py-4 font-bold text-right">Đơn giá</th>
                  <th className="px-5 py-4 font-bold text-center">SL</th>
                  <th className="px-5 py-4 font-bold text-right">Thành tiền</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {activeInvoice.details?.length > 0 ? (
                  activeInvoice.details.map((item: any, idx: number) => (
                    <tr key={idx} className="hover:bg-gray-50/50">
                      <td className="px-5 py-4 text-gray-500">{idx + 1}</td>
                      <td className="px-5 py-4 font-medium text-gray-900">{item.name}</td>
                      <td className="px-5 py-4 text-right">{item.price} ₫</td>
                      <td className="px-5 py-4 text-center">1</td>
                      <td className="px-5 py-4 text-right font-medium text-gray-900">{item.price} ₫</td>
                    </tr>
                  ))
                ) : (
                    <tr className="hover:bg-gray-50/50">
                      <td className="px-5 py-4 text-gray-500">1</td>
                      <td className="px-5 py-4 font-medium text-gray-900">Khám bệnh & Thuốc</td>
                      <td className="px-5 py-4 text-right">{activeInvoice.total} ₫</td>
                      <td className="px-5 py-4 text-center">1</td>
                      <td className="px-5 py-4 text-right font-medium text-gray-900">{activeInvoice.total} ₫</td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary */}
        <div className="flex flex-col items-end gap-3 text-sm pt-6 border-t border-gray-200">
          <div className="flex justify-between w-full md:w-80">
            <span className="text-gray-500 text-base">Tổng tiền dịch vụ</span>
            <span className="font-bold text-gray-900 text-base">{activeInvoice.total} ₫</span>
          </div>
          <div className="flex justify-between w-full md:w-80">
            <span className="text-gray-500 text-base">Bảo hiểm chi trả</span>
            <span className="font-bold text-green-600 text-base">- {activeInvoice.insurance} ₫</span>
          </div>
          <div className="flex justify-between w-full md:w-80 pt-4 border-t border-gray-200 mt-2">
            <span className="font-bold text-gray-900 text-lg">Cần thanh toán</span>
            <span className="font-black text-3xl text-[#2563EB]">{activeInvoice.final} ₫</span>
          </div>
        </div>

        {activeInvoice.status !== 'Đã thanh toán' && (
          <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-orange-600 bg-orange-50 px-4 py-2 rounded-lg border border-orange-100 w-full md:w-auto">
              <Info size={18} />
              Vui lòng thanh toán trước hạn để không bị hủy lịch
            </div>
            
            <button 
              onClick={() => router.push(`/patient/payments/invoices/checkout?id=${activeInvoice.id}`)}
              className="w-full md:w-auto bg-[#2563EB] hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all"
            >
              Tiếp tục thanh toán
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
