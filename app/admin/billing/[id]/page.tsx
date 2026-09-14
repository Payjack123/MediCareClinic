'use client';
import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Clock, ArrowLeft, Loader2, Receipt, User, Stethoscope, 
  Printer, Download, CheckCircle, XCircle, CreditCard, PenLine, Banknote
} from 'lucide-react';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

import Sidebar from '@/app/admin/Sidebar';
import { getInvoiceDetail, updateInvoiceStatus } from '@/app/admin/billing/actions';

export default function BillingDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const invoiceId = Number(resolvedParams.id);
  
  const [isLoading, setIsLoading] = useState(true);
  const [invoice, setInvoice] = useState<any>(null);

  const fetchInvoice = async () => {
    setIsLoading(true);
    const res = await getInvoiceDetail(invoiceId);
    if (res.success && res.data) {
      setInvoice(res.data);
    } else {
      toast.error('Không tìm thấy hóa đơn');
      router.push('/admin/billing');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (invoiceId) {
      fetchInvoice();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoiceId]);

  const handleStatusChange = async (newStatus: string) => {
    if (!confirm(`Bạn có chắc muốn chuyển hóa đơn này sang trạng thái "${newStatus}"?`)) return;
    
    const toastId = toast.loading('Đang cập nhật trạng thái...');
    const res = await updateInvoiceStatus(invoiceId, newStatus);
    
    if (res.success) {
      toast.success(res.message, { id: toastId });
      fetchInvoice();
    } else {
      toast.error(res.message, { id: toastId });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    toast.success('Đã xuất PDF hóa đơn');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Nháp': return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'Chờ phát hành': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Chờ thanh toán': 
      case 'Chưa thanh toán': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Đã thanh toán': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Điều chỉnh': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Đã hủy': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const currentDateTime = dayjs().format('DD/MM/YYYY HH:mm');

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans text-slate-800 overflow-hidden print:bg-white print:block">
      <div className="print:hidden h-full flex w-full">
        <Sidebar />
        <main className="flex-1 flex flex-col h-screen overflow-hidden">
          
          {/* TOP HEADER */}
          <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 z-10 shadow-sm">
            <div className="flex items-center gap-6">
              <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Receipt className="text-blue-600"/> Chi tiết Hóa đơn
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
            ) : invoice && (
              <div className="max-w-4xl mx-auto space-y-6">
                
                <div className="flex items-center justify-between mb-2">
                  <Link href="/admin/billing" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold transition-colors">
                    <ArrowLeft size={20}/> Quay lại danh sách
                  </Link>
                  
                  <div className="flex gap-3">
                    <button onClick={handlePrint} className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl font-bold transition flex items-center gap-2 text-sm border border-slate-200">
                      <Printer size={16}/> In hóa đơn
                    </button>
                    <button onClick={handleExport} className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl font-bold transition flex items-center gap-2 text-sm border border-blue-200">
                      <Download size={16}/> Xuất PDF
                    </button>
                  </div>
                </div>

                {/* CARD THÔNG TIN */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  
                  {/* HEADER HÓA ĐƠN */}
                  <div className="bg-slate-50 border-b border-slate-200 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                      <h2 className="text-sm font-medium text-slate-500 mb-1 tracking-wider uppercase">Hóa đơn dịch vụ</h2>
                      <div className="text-2xl font-black text-slate-900 mb-2">{invoice.invoiceCode}</div>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        Ngày tạo: <span className="font-bold text-slate-700">{dayjs(invoice.createdAt).format('DD/MM/YYYY HH:mm')}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className={`px-4 py-2 rounded-xl font-bold border ${getStatusBadge(invoice.status)} flex items-center gap-2`}>
                        Trạng thái: {invoice.status === 'Chờ thanh toán' ? 'Chưa thanh toán' : invoice.status}
                      </div>
                      {invoice.status === 'Đã thanh toán' && invoice.paymentDate && (
                        <div className="text-xs text-slate-500">Thanh toán lúc: {dayjs(invoice.paymentDate).format('DD/MM/YYYY HH:mm')}</div>
                      )}
                    </div>
                  </div>

                  <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-slate-100">
                    {/* Thông tin Bệnh nhân */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2"><User size={16}/> Bệnh nhân</h3>
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <p className="font-bold text-lg text-slate-900 mb-1">{invoice.patient?.fullName}</p>
                        <p className="text-sm text-slate-600 mb-1">Mã BN: {invoice.patient?.patientProfile?.patientCode || 'N/A'}</p>
                        <p className="text-sm text-slate-600">SĐT: {invoice.patient?.phone || 'N/A'}</p>
                      </div>
                    </div>

                    {/* Thông tin Lịch hẹn & Bác sĩ */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2"><Stethoscope size={16}/> Khám & Điều trị</h3>
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <p className="font-bold text-lg text-slate-900 mb-1">BS. {invoice.doctor?.fullName}</p>
                        <p className="text-sm text-slate-600 mb-1">
                          Lịch hẹn: {invoice.appointment?.appointmentCode || 'Khám trực tiếp'}
                        </p>
                        {invoice.appointment?.bookingDate && (
                          <p className="text-sm text-slate-600">Ngày khám: {invoice.appointment.bookingDate} {invoice.appointment.bookingTime}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* BẢNG CHI TIẾT DỊCH VỤ */}
                  <div className="p-8 border-b border-slate-100">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2"><Banknote size={16}/> Chi tiết Dịch vụ</h3>
                    
                    <div className="overflow-x-auto rounded-xl border border-slate-200 mb-6">
                      <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-xs">
                          <tr>
                            <th className="px-6 py-4">Tên dịch vụ</th>
                            <th className="px-6 py-4 text-right">Đơn giá</th>
                            <th className="px-6 py-4 text-center">Số lượng</th>
                            <th className="px-6 py-4 text-right">Thành tiền</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {invoice.items && invoice.items.length > 0 ? invoice.items.map((item: any) => (
                            <tr key={item.id} className="hover:bg-slate-50">
                              <td className="px-6 py-4 font-bold text-slate-900">{item.name}</td>
                              <td className="px-6 py-4 text-slate-600 text-right">{item.price.toLocaleString('vi-VN')} đ</td>
                              <td className="px-6 py-4 text-slate-600 text-center">{item.quantity}</td>
                              <td className="px-6 py-4 font-bold text-slate-900 text-right">{(item.price * item.quantity).toLocaleString('vi-VN')} đ</td>
                            </tr>
                          )) : (
                            <tr>
                              <td colSpan={4} className="px-6 py-8 text-center text-slate-500">Hóa đơn không có dịch vụ nào</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* TỔNG KẾT CHI PHÍ */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-slate-50 p-6 rounded-xl border border-slate-200">
                      
                      <div className="w-full md:w-1/2 space-y-3">
                        <div className="flex justify-between items-center text-slate-600">
                          <span>Tổng tiền dịch vụ:</span>
                          <span className="font-medium text-slate-900">{invoice.totalAmount.toLocaleString('vi-VN')} đ</span>
                        </div>
                        <div className="flex justify-between items-center text-slate-600">
                          <span>BHYT / Giảm trừ:</span>
                          <span className="font-medium text-green-600">-{invoice.insuranceAmount.toLocaleString('vi-VN')} đ</span>
                        </div>
                        <div className="border-t border-dashed border-slate-300 pt-2"></div>
                      </div>

                      <div className="w-full md:w-1/2 text-right">
                        <div className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Khách hàng cần thanh toán</div>
                        <div className="text-4xl font-black text-blue-600">
                          {invoice.finalAmount.toLocaleString('vi-VN')} đ
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* HÀNH ĐỘNG CỦA ADMIN */}
                  <div className="bg-white p-6 flex flex-wrap items-center justify-between gap-4">
                    <div className="text-sm text-slate-500 font-medium">Thao tác dành cho Quản trị viên:</div>
                    <div className="flex gap-3">
                      
                      {['Chờ thanh toán', 'Chưa thanh toán', 'Nháp'].includes(invoice.status) && (
                        <>
                          <button 
                            onClick={() => handleStatusChange('Điều chỉnh')}
                            className="px-6 py-2.5 bg-orange-50 text-orange-600 border border-orange-200 rounded-xl font-bold hover:bg-orange-100 transition flex items-center gap-2"
                          >
                            <PenLine size={18}/> Điều chỉnh
                          </button>
                          
                          {/* Tính năng dành riêng cho trường hợp Admin kiêm luôn thu ngân */}
                          <button 
                            onClick={() => handleStatusChange('Đã thanh toán')}
                            className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-bold shadow hover:bg-emerald-700 transition flex items-center gap-2"
                          >
                            <CheckCircle size={18}/> Đánh dấu Đã Thu Tiền
                          </button>
                        </>
                      )}

                      {!['Đã thanh toán', 'Đã hủy'].includes(invoice.status) && (
                        <button 
                          onClick={() => handleStatusChange('Đã hủy')}
                          className="px-6 py-2.5 bg-white border border-red-200 text-red-600 rounded-xl font-bold hover:bg-red-50 transition flex items-center gap-2"
                        >
                          <XCircle size={18}/> Hủy hóa đơn
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
      
      {/* GIAO DIỆN IN (Chỉ hiển thị khi in) */}
      <div className="hidden print:block print:p-8">
        {invoice && (
          <div className="space-y-6">
            <div className="text-center mb-8 border-b-2 border-black pb-4">
              <h1 className="text-2xl font-black uppercase">Phòng Khám AdminPro</h1>
              <h2 className="text-xl font-bold mt-2 uppercase">HÓA ĐƠN THU TIỀN</h2>
              <p className="mt-1">Mã HĐ: {invoice.invoiceCode}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p><strong>Bệnh nhân:</strong> {invoice.patient?.fullName}</p>
                <p><strong>Mã BN:</strong> {invoice.patient?.patientProfile?.patientCode}</p>
                <p><strong>Số điện thoại:</strong> {invoice.patient?.phone}</p>
              </div>
              <div>
                <p><strong>Ngày lập:</strong> {dayjs(invoice.createdAt).format('DD/MM/YYYY HH:mm')}</p>
                <p><strong>Bác sĩ khám:</strong> {invoice.doctor?.fullName}</p>
                <p><strong>Trạng thái:</strong> {invoice.status === 'Chờ thanh toán' ? 'Chưa thanh toán' : invoice.status}</p>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="font-bold border-b border-black mb-2 uppercase">Chi tiết dịch vụ</h3>
              <table className="w-full text-left mt-2 border-collapse border border-black text-sm">
                <thead>
                  <tr>
                    <th className="border border-black p-2 text-center w-12">STT</th>
                    <th className="border border-black p-2">Tên dịch vụ</th>
                    <th className="border border-black p-2 text-right">Đơn giá</th>
                    <th className="border border-black p-2 text-center w-24">SL</th>
                    <th className="border border-black p-2 text-right">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items?.map((item: any, idx: number) => (
                    <tr key={idx}>
                      <td className="border border-black p-2 text-center">{idx + 1}</td>
                      <td className="border border-black p-2 font-bold">{item.name}</td>
                      <td className="border border-black p-2 text-right">{item.price.toLocaleString('vi-VN')} đ</td>
                      <td className="border border-black p-2 text-center">{item.quantity}</td>
                      <td className="border border-black p-2 text-right">{(item.price * item.quantity).toLocaleString('vi-VN')} đ</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 flex justify-end">
              <table className="w-1/2 text-sm">
                <tbody>
                  <tr>
                    <td className="p-2 font-bold text-right">Tổng tiền dịch vụ:</td>
                    <td className="p-2 text-right">{invoice.totalAmount.toLocaleString('vi-VN')} đ</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold text-right">BHYT / Giảm trừ:</td>
                    <td className="p-2 text-right">-{invoice.insuranceAmount.toLocaleString('vi-VN')} đ</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-black text-right text-lg border-t border-black uppercase">Khách hàng thanh toán:</td>
                    <td className="p-2 font-black text-right text-lg border-t border-black">{invoice.finalAmount.toLocaleString('vi-VN')} đ</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-16 flex justify-between">
              <div className="text-center">
                <p><strong>Người nộp tiền</strong></p>
                <p className="mt-16">(Ký & ghi rõ họ tên)</p>
              </div>
              <div className="text-center">
                <p>Ngày ..... Tháng ..... Năm 2026</p>
                <p className="font-bold mt-2">NGƯỜI LẬP PHIẾU</p>
                <p className="mt-16">(Ký & ghi rõ họ tên)</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
