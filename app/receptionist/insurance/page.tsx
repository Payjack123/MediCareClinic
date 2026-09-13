'use client';

import React, { useState } from 'react';
import { 
  Search, User, Phone, ShieldPlus, AlertCircle, CheckCircle2, 
  FileText, Calendar, ArrowRight, Save, XCircle, CreditCard
} from 'lucide-react';
import { searchPatientInsurance, updateInsuranceInfo } from './actions';
import { useRouter } from 'next/navigation';

export default function InsurancePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const [patientData, setPatientData] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setErrorMessage('');
    setSaveSuccess(false);
    
    try {
      const res = await searchPatientInsurance(searchQuery);
      if (res.success && res.data) {
        setPatientData(res.data);
      } else {
        setErrorMessage(res.message || 'Không tìm thấy bệnh nhân');
        setPatientData(null);
      }
    } catch (err) {
      setErrorMessage('Có lỗi xảy ra khi tìm kiếm.');
      setPatientData(null);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSaveInsurance = async () => {
    if (!patientData) return;
    
    setIsSaving(true);
    setErrorMessage('');
    
    try {
      // In a real scenario, this amount is calculated based on BHYT rules (e.g., 80%, 100%)
      // For this demo, if they have BHYT, we apply a flat discount or 80% of total if it's mock
      const invoice = patientData.invoice;
      let discountAmount = 0;
      if (invoice && patientData.bhyt?.isValid) {
        // Let's say BHYT covers 80% of the total amount
        discountAmount = Math.round(invoice.totalAmount * 0.8);
      }

      const res = await updateInsuranceInfo(
        patientData.patient.id, 
        patientData.bhyt?.code || '',
        invoice?.id,
        discountAmount
      );
      
      if (res.success) {
        setSaveSuccess(true);
        // Update local state to reflect the new amounts
        if (invoice) {
          setPatientData({
            ...patientData,
            invoice: {
              ...invoice,
              insuranceAmount: discountAmount,
              finalAmount: Math.max(0, invoice.totalAmount - discountAmount)
            }
          });
        }
      } else {
        setErrorMessage(res.message || 'Lưu thất bại');
      }
    } catch (err) {
      setErrorMessage('Có lỗi xảy ra khi lưu.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleGoToFee = () => {
    if (patientData?.invoice?.invoiceCode) {
      router.push(`/receptionist/fee?q=${patientData.invoice.invoiceCode}`);
    } else {
      router.push('/receptionist/fee');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản Lý Bảo Hiểm Y Tế</h1>
          <p className="text-gray-500 mt-1">Kiểm tra thông tin BHYT và áp dụng miễn giảm cho bệnh nhân</p>
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
                placeholder="Nhập mã BN, số điện thoại hoặc mã thẻ BHYT..."
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

      {patientData && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Patient Info */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-100">
            <div className="p-6 md:w-1/3 bg-gray-50/50">
              <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4">
                <User className="text-blue-600 h-5 w-5" />
                Thông Tin Bệnh Nhân
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Họ và tên</p>
                  <p className="font-semibold text-gray-900 text-lg">{patientData.patient.name}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Mã bệnh nhân</p>
                    <p className="font-medium text-gray-900">{patientData.patient.patientCode}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Số điện thoại</p>
                    <p className="font-medium text-gray-900">{patientData.patient.phone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* BHYT Info */}
            <div className="p-6 md:w-2/3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <ShieldPlus className="text-green-600 h-5 w-5" />
                  Thông Tin Thẻ BHYT
                </h3>
                {patientData.bhyt?.isValid ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                    <CheckCircle2 className="w-4 h-4" /> Hợp lệ
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700">
                    <XCircle className="w-4 h-4" /> Không tìm thấy BHYT
                  </span>
                )}
              </div>

              {patientData.bhyt ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-green-50/50 p-5 rounded-xl border border-green-100">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Mã thẻ BHYT</p>
                    <p className="font-bold text-green-800 text-lg tracking-wider">{patientData.bhyt.code}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Họ tên trên thẻ</p>
                    <p className="font-medium text-gray-900">{patientData.patient.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Ngày sinh</p>
                    <div className="flex items-center gap-1.5 text-gray-900 font-medium">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {patientData.patient.dob}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Thời hạn</p>
                    <p className="font-medium text-gray-900">{patientData.bhyt.expiryDate}</p>
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 p-5 rounded-xl border border-yellow-100 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-800">Bệnh nhân chưa có thông tin thẻ BHYT trên hệ thống.</p>
                    <p className="text-sm text-yellow-700 mt-1">Vui lòng yêu cầu bệnh nhân cung cấp thẻ BHYT (nếu có) để cập nhật, hoặc tiếp tục quy trình tự thanh toán.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Exam Costs */}
          {patientData.invoice ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="border-b border-gray-100 px-6 py-4 bg-gray-50/50 flex justify-between items-center">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <FileText className="text-blue-600 h-5 w-5" />
                  Chi Phí Khám & Dịch Vụ
                </h3>
                <span className="text-sm font-medium bg-blue-100 text-blue-700 px-2.5 py-1 rounded-md">
                  #{patientData.invoice.invoiceCode}
                </span>
              </div>
              
              <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Services List */}
                <div>
                  <table className="w-full text-sm">
                    <thead className="text-gray-500 border-b border-gray-100">
                      <tr>
                        <th className="py-2 text-left font-medium">Khoản thu</th>
                        <th className="py-2 text-right font-medium">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {patientData.invoice.items.map((item: any) => (
                        <tr key={item.id}>
                          <td className="py-3 text-gray-800">{item.name} <span className="text-gray-400">x{item.quantity}</span></td>
                          <td className="py-3 text-right font-medium text-gray-900">{item.total.toLocaleString('vi-VN')} đ</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 flex flex-col justify-center space-y-4">
                  <div className="flex justify-between items-center text-gray-600">
                    <span>Tổng chi phí:</span>
                    <span className="font-medium text-gray-900">{patientData.invoice.totalAmount.toLocaleString('vi-VN')} đ</span>
                  </div>
                  <div className="flex justify-between items-center text-green-600">
                    <span>Phần BHYT hỗ trợ:</span>
                    <span className="font-medium">- {patientData.invoice.insuranceAmount.toLocaleString('vi-VN')} đ</span>
                  </div>
                  <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                    <span className="font-bold text-gray-900">Bệnh nhân phải trả:</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {patientData.invoice.finalAmount.toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
               <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
               <h3 className="text-lg font-medium text-gray-900">Không có hóa đơn chờ thanh toán</h3>
               <p className="text-gray-500 mt-1">Bệnh nhân này hiện không có dịch vụ nào cần thanh toán.</p>
             </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4">
            <button 
              onClick={handleSaveInsurance}
              disabled={isSaving || !patientData.bhyt || saveSuccess}
              className={`px-6 py-3 font-medium rounded-xl transition-colors flex items-center justify-center gap-2 ${
                saveSuccess 
                  ? 'bg-green-100 text-green-700 cursor-default' 
                  : 'bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 disabled:border-gray-300 disabled:text-gray-400'
              }`}
            >
              {isSaving ? (
                <span className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></span>
              ) : saveSuccess ? (
                <><CheckCircle2 className="w-5 h-5" /> Đã lưu thông tin BHYT</>
              ) : (
                <><Save className="w-5 h-5" /> Áp dụng BHYT vào hóa đơn</>
              )}
            </button>
            <button 
              onClick={handleGoToFee}
              disabled={!patientData.invoice}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              Chuyển sang Thu phí <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
