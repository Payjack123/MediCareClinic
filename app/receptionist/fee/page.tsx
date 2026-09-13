'use client';

import React, { useState } from 'react';
import { 
  Search, User, Phone, CreditCard, Banknote, QrCode, ShieldPlus, 
  Receipt, CheckCircle2, Printer, AlertCircle, FileText, ArrowRight,
  Wallet
} from 'lucide-react';
import { searchInvoice, payInvoice } from './actions';

export default function FeePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [patientFound, setPatientFound] = useState(false);
  const [invoiceData, setInvoiceData] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');
  
  const [paymentMethod, setPaymentMethod] = useState<string>('cash');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [successInvoiceCode, setSuccessInvoiceCode] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setErrorMessage('');
    
    try {
      const res = await searchInvoice(searchQuery);
      if (res.success && res.data) {
        setInvoiceData(res.data);
        setPatientFound(true);
        setPaymentSuccess(false);
      } else {
        setErrorMessage(res.message || 'Không tìm thấy hóa đơn');
        setPatientFound(false);
        setInvoiceData(null);
      }
    } catch (err) {
      setErrorMessage('Có lỗi xảy ra. Vui lòng thử lại.');
      setPatientFound(false);
    } finally {
      setIsSearching(false);
    }
  };

  const handlePayment = async () => {
    if (!invoiceData) return;
    
    setIsProcessing(true);
    setErrorMessage('');
    
    try {
      const res = await payInvoice(invoiceData.id, paymentMethod);
      if (res.success) {
        setPaymentSuccess(true);
        setSuccessInvoiceCode(res.invoiceCode || '');
      } else {
        setErrorMessage(res.message || 'Thanh toán thất bại');
      }
    } catch (err) {
      setErrorMessage('Có lỗi xảy ra khi thanh toán.');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetForm = () => {
    setSearchQuery('');
    setPatientFound(false);
    setPaymentSuccess(false);
    setInvoiceData(null);
    setErrorMessage('');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Thu Phí Bệnh Nhân</h1>
          <p className="text-gray-500 mt-1">Xác nhận thanh toán và in biên lai cho bệnh nhân</p>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <form onSubmit={handleSearch} className="flex flex-col gap-2">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 transition-all text-gray-900"
                placeholder="Nhập mã bệnh nhân, số điện thoại hoặc mã hóa đơn..."
              />
            </div>
            <button
              type="submit"
              disabled={isSearching || !searchQuery.trim()}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium rounded-xl transition-colors flex items-center gap-2"
            >
              {isSearching ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                'Tìm kiếm'
              )}
            </button>
          </div>
          {errorMessage && (
            <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
              <AlertCircle className="h-4 w-4" /> {errorMessage}
            </p>
          )}
        </form>
      </div>

      {patientFound && invoiceData && !paymentSuccess && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Left Column: Patient & Invoice Details */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Patient Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="border-b border-gray-100 px-6 py-4 bg-gray-50/50">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <User className="text-blue-600 h-5 w-5" />
                  Thông Tin Bệnh Nhân
                </h3>
              </div>
              <div className="p-6 flex flex-wrap gap-x-12 gap-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Họ và tên</p>
                  <p className="font-semibold text-gray-900 text-lg">{invoiceData.patient.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Mã bệnh nhân</p>
                  <div className="flex items-center gap-1.5">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <p className="font-medium text-gray-900">{invoiceData.patient.id}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Số điện thoại</p>
                  <div className="flex items-center gap-1.5">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <p className="font-medium text-gray-900">{invoiceData.patient.phone}</p>
                  </div>
                </div>
                {invoiceData.patient.insurance && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Mã BHYT</p>
                    <div className="flex items-center gap-1.5">
                      <ShieldPlus className="h-4 w-4 text-green-500" />
                      <p className="font-medium text-green-700">{invoiceData.patient.bhytCode}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Invoice Details */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="border-b border-gray-100 px-6 py-4 bg-gray-50/50 flex justify-between items-center">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <Receipt className="text-blue-600 h-5 w-5" />
                  Chi Tiết Hóa Đơn
                </h3>
                <span className="text-sm font-medium bg-blue-100 text-blue-700 px-2.5 py-1 rounded-md">
                  #{invoiceData.invoiceCode}
                </span>
              </div>
              <div className="p-0">
                <table className="w-full">
                  <thead className="bg-gray-50/50 text-xs uppercase text-gray-500">
                    <tr>
                      <th className="px-6 py-3 text-left font-medium">Khoản thu</th>
                      <th className="px-6 py-3 text-center font-medium">Số lượng</th>
                      <th className="px-6 py-3 text-right font-medium">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {invoiceData.items.map((item: any) => (
                      <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 text-gray-800">{item.name}</td>
                        <td className="px-6 py-4 text-center text-gray-600">{item.quantity}</td>
                        <td className="px-6 py-4 text-right font-medium text-gray-900">
                          {item.total.toLocaleString('vi-VN')} đ
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Payment Method Selection */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="border-b border-gray-100 px-6 py-4 bg-gray-50/50">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <Wallet className="text-blue-600 h-5 w-5" />
                  Phương Thức Thanh Toán
                </h3>
              </div>
              <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <button
                  onClick={() => setPaymentMethod('cash')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === 'cash' 
                      ? 'border-blue-600 bg-blue-50 text-blue-700' 
                      : 'border-gray-100 hover:border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Banknote className="h-8 w-8 mb-2" />
                  <span className="font-medium text-sm">Tiền mặt</span>
                </button>
                <button
                  onClick={() => setPaymentMethod('transfer')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === 'transfer' 
                      ? 'border-blue-600 bg-blue-50 text-blue-700' 
                      : 'border-gray-100 hover:border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <ArrowRight className="h-8 w-8 mb-2" />
                  <span className="font-medium text-sm">Chuyển khoản</span>
                </button>
                <button
                  onClick={() => setPaymentMethod('qr')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === 'qr' 
                      ? 'border-blue-600 bg-blue-50 text-blue-700' 
                      : 'border-gray-100 hover:border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <QrCode className="h-8 w-8 mb-2" />
                  <span className="font-medium text-sm">Quét QR</span>
                </button>
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === 'card' 
                      ? 'border-blue-600 bg-blue-50 text-blue-700' 
                      : 'border-gray-100 hover:border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <CreditCard className="h-8 w-8 mb-2" />
                  <span className="font-medium text-sm">Thẻ POS</span>
                </button>
              </div>
            </div>

          </div>

          {/* Right Column: Total & Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-28">
              <div className="border-b border-gray-100 px-6 py-4 bg-gray-50/50">
                <h3 className="font-bold text-gray-800">Tổng Thanh Toán</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center text-gray-600">
                  <span>Tổng tiền dịch vụ:</span>
                  <span className="font-medium text-gray-900">{invoiceData.totalAmount.toLocaleString('vi-VN')} đ</span>
                </div>
                
                {invoiceData.insuranceAmount > 0 && (
                  <div className="flex justify-between items-center text-green-600">
                    <span className="flex items-center gap-1.5">
                      <ShieldPlus className="h-4 w-4" />
                      BHYT chi trả:
                    </span>
                    <span className="font-medium">- {invoiceData.insuranceAmount.toLocaleString('vi-VN')} đ</span>
                  </div>
                )}
                
                <div className="pt-4 border-t border-gray-200 border-dashed">
                  <div className="flex justify-between items-end">
                    <span className="text-gray-900 font-medium">Khách phải trả:</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {invoiceData.finalAmount.toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        Đang xử lý...
                      </>
                    ) : (
                      'Xác Nhận Đã Thu Tiền'
                    )}
                  </button>
                  <p className="text-center text-xs text-gray-400 mt-3">
                    Lưu ý: Chỉ xác nhận sau khi đã nhận đủ tiền từ bệnh nhân.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Success State */}
      {paymentSuccess && (
        <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-8 text-center animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Thanh Toán Thành Công!</h2>
          <p className="text-gray-500 mb-6">
            Hóa đơn <span className="font-semibold text-gray-900">#{successInvoiceCode}</span> của bệnh nhân <span className="font-semibold text-gray-900">{invoiceData?.patient?.name}</span> đã được ghi nhận thanh toán.
          </p>
          
          <div className="flex justify-center gap-4">
            <button className="px-6 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium rounded-xl transition-colors flex items-center gap-2">
              <Printer className="h-5 w-5 text-gray-500" />
              In biên lai
            </button>
            <button 
              onClick={resetForm}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
            >
              Thu phí bệnh nhân tiếp theo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
