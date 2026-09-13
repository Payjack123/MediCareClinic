'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Receipt, FileText, Printer, ArrowRight, Eye, 
  CheckCircle2, Clock, XCircle, AlertCircle, Calendar, ShieldPlus
} from 'lucide-react';
import { getInvoices } from './actions';
import { useRouter } from 'next/navigation';

export default function InvoicesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [invoices, setInvoices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchInvoices();
  }, [statusFilter]); // Refetch when filter changes

  const fetchInvoices = async () => {
    setIsLoading(true);
    try {
      const res = await getInvoices(searchQuery, statusFilter);
      if (res.success) {
        setInvoices(res.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchInvoices();
  };

  const openDetails = (invoice: any) => {
    setSelectedInvoice(invoice);
    setIsModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    if (status === 'Đã thanh toán') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
          <CheckCircle2 className="w-3 h-3" /> Đã TT
        </span>
      );
    }
    if (status === 'Chờ thanh toán' || status === 'CHƯA THANH TOÁN') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 border border-yellow-200">
          <Clock className="w-3 h-3" /> Chưa TT
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
        <XCircle className="w-3 h-3" /> {status}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản Lý Hóa Đơn</h1>
          <p className="text-gray-500 mt-1">Kiểm tra, phát hành và quản lý hóa đơn bệnh nhân</p>
        </div>
      </div>

      {/* Top Controls */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-12 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 transition-all text-gray-900"
              placeholder="Nhập mã HĐ, tên BN, mã BN, số điện thoại..."
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2 sm:w-auto w-full"
          >
            Tìm kiếm
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
            <Filter className="w-4 h-4" /> Bộ lọc:
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 bg-gray-50"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="Chờ thanh toán">Chưa thanh toán</option>
            <option value="Đã thanh toán">Đã thanh toán</option>
            <option value="Hủy">Đã hủy</option>
          </select>
          <input 
            type="date"
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 bg-gray-50"
          />
        </div>
      </div>

      {/* Invoice List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Mã HĐ</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Bệnh Nhân</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ngày Khám</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Tổng Tiền</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Trạng Thái</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <span className="inline-block w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-2"></span>
                    <p>Đang tải dữ liệu...</p>
                  </td>
                </tr>
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <Receipt className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Không tìm thấy hóa đơn nào</p>
                  </td>
                </tr>
              ) : (
                invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-blue-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="font-medium text-blue-700 cursor-pointer hover:underline" onClick={() => openDetails(inv)}>
                        #{inv.invoiceCode}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{inv.patientName}</p>
                      <p className="text-xs text-gray-500">{inv.patientCode} - {inv.phone}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(inv.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-medium text-gray-900">{inv.finalAmount.toLocaleString('vi-VN')}đ</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {getStatusBadge(inv.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => openDetails(inv)}
                          className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors tooltip-trigger relative"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="In hóa đơn"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                        {inv.status !== 'Đã thanh toán' && (
                          <button 
                            onClick={() => router.push(`/receptionist/fee?q=${inv.invoiceCode}`)}
                            className="p-1.5 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                            title="Chuyển đến Thu phí"
                          >
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Details Modal */}
      {isModalOpen && selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Receipt className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Chi Tiết Hóa Đơn</h3>
                  <p className="text-sm text-gray-500 font-medium">#{selectedInvoice.invoiceCode}</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
              
              {/* Patient Basic Info */}
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 flex flex-wrap gap-x-12 gap-y-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-semibold">Bệnh nhân</p>
                  <p className="font-semibold text-gray-900">{selectedInvoice.patientName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-semibold">Mã BN</p>
                  <p className="font-medium text-gray-900">{selectedInvoice.patientCode}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-semibold">Ngày khám</p>
                  <div className="flex items-center gap-1.5 text-gray-900 font-medium">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    {new Date(selectedInvoice.createdAt).toLocaleDateString('vi-VN')}
                  </div>
                </div>
              </div>

              {/* Services Table */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider flex items-center gap-2">
                  Dịch Vụ & Chi Phí
                </h4>
                <div className="border border-gray-100 rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 text-xs font-semibold text-gray-500 text-left border-b border-gray-100">
                      <tr>
                        <th className="px-4 py-3">Tên dịch vụ</th>
                        <th className="px-4 py-3 text-center">SL</th>
                        <th className="px-4 py-3 text-right">Đơn giá</th>
                        <th className="px-4 py-3 text-right">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {selectedInvoice.items.map((item: any) => (
                        <tr key={item.id}>
                          <td className="px-4 py-3 text-gray-800">{item.name}</td>
                          <td className="px-4 py-3 text-center text-gray-600">{item.quantity}</td>
                          <td className="px-4 py-3 text-right text-gray-600">{(item.price || 0).toLocaleString('vi-VN')}đ</td>
                          <td className="px-4 py-3 text-right font-medium text-gray-900">{item.total.toLocaleString('vi-VN')}đ</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-blue-50/50 rounded-xl p-5 border border-blue-100 space-y-3">
                <div className="flex justify-between items-center text-gray-600">
                  <span>Tổng tiền dịch vụ:</span>
                  <span className="font-medium text-gray-900">{selectedInvoice.totalAmount.toLocaleString('vi-VN')}đ</span>
                </div>
                {selectedInvoice.insuranceAmount > 0 && (
                  <div className="flex justify-between items-center text-green-600">
                    <span className="flex items-center gap-1.5">
                      <ShieldPlus className="w-4 h-4" /> BHYT giảm trừ:
                    </span>
                    <span className="font-medium">- {selectedInvoice.insuranceAmount.toLocaleString('vi-VN')}đ</span>
                  </div>
                )}
                <div className="pt-3 border-t border-blue-200 border-dashed flex justify-between items-center">
                  <span className="font-bold text-gray-900">Phải thu:</span>
                  <span className="text-xl font-bold text-blue-700">
                    {selectedInvoice.finalAmount.toLocaleString('vi-VN')}đ
                  </span>
                </div>
                
                <div className="pt-2 flex justify-between items-center">
                  <span className="text-sm text-gray-500">Trạng thái hiện tại:</span>
                  {getStatusBadge(selectedInvoice.status)}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex items-center justify-between">
              <button className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 font-medium transition-colors">
                <AlertCircle className="w-4 h-4" /> Yêu cầu điều chỉnh
              </button>
              
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 font-medium transition-colors">
                  <Printer className="w-4 h-4" /> In hóa đơn
                </button>
                {selectedInvoice.status !== 'Đã thanh toán' && (
                  <button 
                    onClick={() => router.push(`/receptionist/fee?q=${selectedInvoice.invoiceCode}`)}
                    className="flex items-center gap-2 px-5 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-sm"
                  >
                    <ArrowRight className="w-4 h-4" /> Thu phí ngay
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
