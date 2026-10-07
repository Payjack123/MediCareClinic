"use client";
import React, { useState, useEffect } from 'react';
import DoctorSidebar from "@/app/doctor/Sidebar";
import { 
  TestTube, Plus, Search, FileText, Clock, AlertTriangle, 
  CheckCircle, X, Check, FileSignature, Save, ChevronRight, Filter, User,
  Phone, Calendar, CreditCard, Hash, Eye
} from 'lucide-react';
import { getTestOrders, searchPatients, createTestOrder } from './actions';

const AVAILABLE_TESTS = [
  { id: 'tn1', name: 'Công thức máu', type: 'Huyết học', price: 150000 },
  { id: 'tn2', name: 'Đường huyết (Glucose)', type: 'Sinh hóa', price: 50000 },
  { id: 'tn3', name: 'HbA1c', type: 'Sinh hóa', price: 120000 },
  { id: 'tn4', name: 'Mỡ máu (Bộ Lipid)', type: 'Sinh hóa', price: 200000 },
  { id: 'tn5', name: 'Men gan (AST, ALT)', type: 'Sinh hóa', price: 100000 },
  { id: 'tn6', name: 'Ure, Creatinin', type: 'Sinh hóa', price: 80000 },
  { id: 'tn7', name: 'Tổng phân tích nước tiểu', type: 'Nước tiểu', price: 60000 },
];

const STATUS_CONFIG = {
  draft: { label: 'Bản nháp', color: 'bg-gray-100 text-gray-700 border-gray-200' },
  ordered: { label: 'Đã chỉ định', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  in_progress: { label: 'Đang thực hiện', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  has_result: { label: 'Đã có kết quả', color: 'bg-green-100 text-green-700 border-green-200' },
  evaluated: { label: 'Bác sĩ đã xem', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-700 border-red-200' }
};

export default function TestOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);

  // Main UI States
  const [isCreating, setIsCreating] = useState(false);

  // Search local orders
  const [orderSearch, setOrderSearch] = useState('');
  const [genderFilter, setGenderFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Create Order State
  const [patientSearch, setPatientSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [priority, setPriority] = useState('normal');
  const [reason, setReason] = useState('');
  const [instructions, setInstructions] = useState('');
  const [viewingOrder, setViewingOrder] = useState<any>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoadingOrders(true);
    const res = await getTestOrders();
    if (res.success && res.data) {
      setOrders(res.data);
    }
    setIsLoadingOrders(false);
  };

  const handleStartCreate = () => {
    setIsCreating(true);
    // Reset selections
    setPatientSearch('');
    setSearchError('');
    setSelectedPatient(null);
    setSelectedTests([]);
    setPriority('normal');
    setReason('');
    setInstructions('');
  };

  const handleSearchPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientSearch.trim()) return;
    
    setIsSearching(true);
    setSearchError('');
    const res = await searchPatients(patientSearch.trim());
    setIsSearching(false);
    
    if (res.success && res.data) {
      setSelectedPatient(res.data);
    } else {
      setSearchError("Không tìm thấy hồ sơ! Vui lòng kiểm tra và nhập đúng mã bệnh nhân.");
      setSelectedPatient(null);
    }
  };

  const handleCancelCreate = () => {
    setIsCreating(false);
  };

  const handleToggleTest = (id: string) => {
    if (selectedTests.includes(id)) {
      setSelectedTests(selectedTests.filter(t => t !== id));
    } else {
      setSelectedTests([...selectedTests, id]);
    }
  };

  const handleSaveOrder = async (status: 'draft' | 'ordered') => {
    if (!selectedPatient) {
      alert("Vui lòng tìm và chọn bệnh nhân trước.");
      return;
    }
    if (selectedTests.length === 0) {
      alert("Vui lòng chọn ít nhất 1 xét nghiệm.");
      return;
    }
    if (!reason.trim()) {
      alert("Vui lòng nhập lý do chỉ định.");
      return;
    }

    const testsData = selectedTests.map(id => {
      const t = AVAILABLE_TESTS.find(t => t.id === id);
      return { name: t?.name || "", price: t?.price || 0 };
    });
    const totalPrice = testsData.reduce((sum, t) => sum + t.price, 0);
    const testNames = testsData.map(t => t.name);
    
    const res = await createTestOrder({
      patientId: selectedPatient.id,
      testNames,
      tests: testsData,
      totalPrice,
      doctorName: "BS. Nguyễn Văn Bình", // Mock doctor
      priority,
      reason,
      instructions,
      status
    });

    if (res.success) {
      alert("Tạo phiếu chỉ định thành công!");
      fetchOrders();
      setIsCreating(false);
    } else {
      alert("Có lỗi xảy ra: " + res.message);
    }
  };

  // Filter orders
  let filteredOrders = orders.filter(o => {
    if (orderSearch) {
      const q = orderSearch.toLowerCase();
      if (!o.patientName.toLowerCase().includes(q) && 
          !o.patientProfile?.patientCode.toLowerCase().includes(q) &&
          !o.id.toLowerCase().includes(q)) {
        return false;
      }
    }
    if (genderFilter !== 'all' && o.gender !== genderFilter) {
      return false;
    }
    if (dateFilter) {
      if (o.dateFilterStr) {
        if (o.dateFilterStr !== dateFilter) return false;
      } else {
        // Fallback for orders without dateFilterStr
        try {
          const orderDate = o.date.split(' ')[0];
          const parts = orderDate.split(/[-/]/);
          if (parts.length >= 3) {
            const y = parts[2].length === 4 ? parts[2] : parts[0];
            const m = parts[2].length === 4 ? parts[1] : parts[1];
            const d = parts[2].length === 4 ? parts[0] : parts[2];
            const formattedOrderDate = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
            if (formattedOrderDate !== dateFilter) return false;
          }
        } catch(e) {}
      }
    }
    return true;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      <DoctorSidebar activePage="test-orders" />
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10 shrink-0 shadow-sm relative">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <FileSignature className="w-7 h-7 text-blue-600" />
              Chỉ định xét nghiệm
            </h1>
            <p className="text-sm text-gray-500 mt-1">Danh sách các phiếu xét nghiệm đã được chỉ định</p>
          </div>
          {!isCreating && (
            <button 
              onClick={handleStartCreate}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
            >
              <Plus size={20} /> Tạo chỉ định mới
            </button>
          )}
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 relative">
          
          {/* MAIN PAGE: ORDERS TABLE */}
          {!isCreating && (
            <div className="max-w-7xl mx-auto flex-1 flex flex-col h-full animate-in fade-in duration-300">
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm flex-1 flex flex-col min-h-0">
                {/* Filters */}
                <div className="p-4 border-b border-gray-100 flex flex-wrap items-center gap-4 bg-gray-50/50 rounded-t-2xl shrink-0">
                  <div className="relative flex-1 min-w-[300px]">
                    <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Nhập tên BN, mã BN, mã phiếu..." 
                      className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                    />
                  </div>
                  
                  <select 
                    className="py-2.5 px-4 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 min-w-[150px]"
                    value={genderFilter}
                    onChange={(e) => setGenderFilter(e.target.value)}
                  >
                    <option value="all">Giới tính (Tất cả)</option>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>

                  <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5">
                    <span className="text-sm font-medium text-gray-500 whitespace-nowrap">Ngày chỉ định:</span>
                    <input 
                      type="date" 
                      className="text-sm font-medium focus:outline-none text-gray-700 cursor-pointer bg-transparent min-w-[130px]"
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                    />
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto overflow-y-auto flex-1">
                  <table className="w-full text-left border-collapse min-w-[1000px]">
                    <thead className="sticky top-0 z-10 bg-white">
                      <tr className="border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider bg-gray-50/80 backdrop-blur-sm">
                        <th className="px-6 py-4 font-bold text-gray-700 whitespace-nowrap w-16">STT</th>
                        <th className="px-6 py-4 font-bold text-gray-700 whitespace-nowrap min-w-[200px]">Bệnh nhân</th>
                        <th className="px-6 py-4 font-bold text-gray-700 whitespace-nowrap">Mã hồ sơ</th>
                        <th className="px-6 py-4 font-bold text-gray-700 whitespace-nowrap text-center">Ngày sinh</th>
                        <th className="px-6 py-4 font-bold text-gray-700 whitespace-nowrap text-center">Giới tính</th>
                        <th className="px-6 py-4 font-bold text-gray-700 whitespace-nowrap">SĐT</th>
                        <th className="px-6 py-4 font-bold text-gray-700 whitespace-nowrap">Ngày chỉ định</th>
                        <th className="px-6 py-4 font-bold text-gray-700 whitespace-nowrap text-center">Trạng thái</th>
                        <th className="px-6 py-4 font-bold text-gray-700 whitespace-nowrap text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {paginatedOrders.length > 0 ? paginatedOrders.map((order, index) => {
                        const statusCfg = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.ordered;
                        return (
                        <tr key={order.id} className="hover:bg-blue-50/60 transition-colors group">
                          <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                            {(currentPage - 1) * itemsPerPage + index + 1}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {order.avatar ? (
                                <img src={order.avatar} alt="Avatar" className="w-10 h-10 rounded-full object-cover shadow-sm shrink-0 ring-2 ring-white" />
                              ) : (
                                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0 ring-2 ring-white">
                                  {order.patientName.split(' ').slice(-2).map((n: string) => n[0]).join('').toUpperCase()}
                                </div>
                              )}
                              <div>
                                <div className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                                  {order.patientName}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-gray-600">
                            {order.patientProfile?.patientCode}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 text-center font-medium">
                            {order.dob}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold ${
                              order.gender === 'Nam' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 
                              order.gender === 'Nữ' ? 'bg-pink-50 text-pink-600 border border-pink-100' : 'bg-gray-50 text-gray-600 border border-gray-200'
                            }`}>
                              {order.gender}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-700">
                            {order.phone}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-bold text-gray-900 mb-0.5 flex items-center gap-1.5"><Clock className="w-4 h-4 text-gray-400"/> {order.time}</div>
                            <div className="text-xs text-gray-500 flex items-center gap-1"><FileText className="w-3 h-3"/> {order.tests.length} dịch vụ</div>
                          </td>
                          <td className="px-6 py-4 text-center whitespace-nowrap">
                            <span className={`px-2.5 py-1 text-xs font-bold rounded-md border inline-block ${statusCfg.color}`}>
                              {statusCfg.label}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right whitespace-nowrap">
                            <button 
                              onClick={() => setViewingOrder(order)}
                              className="px-4 py-2 bg-white text-blue-600 hover:bg-blue-50 font-bold text-sm rounded-xl transition-all shadow-sm border border-blue-200 inline-flex items-center justify-center gap-1.5 ml-auto min-w-[130px]"
                            >
                              <Eye className="w-4 h-4"/> Xem chi tiết
                            </button>
                          </td>
                        </tr>
                      )
                      }) : (
                        <tr>
                          <td colSpan={9} className="px-6 py-16 text-center text-gray-500 bg-gray-50/50">
                            {isLoadingOrders ? (
                              <div className="flex flex-col items-center">
                                <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-3"></div>
                                Đang tải danh sách phiếu...
                              </div>
                            ) : (
                              <div className="flex flex-col items-center">
                                <FileSignature className="w-12 h-12 text-gray-300 mb-3" />
                                <div className="text-gray-500">Chưa có phiếu chỉ định nào hoặc không tìm thấy kết quả.</div>
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-gray-100 flex items-center justify-between shrink-0 bg-white rounded-b-2xl">
                  <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                    <span>Hiển thị</span>
                    <select 
                      className="border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                    >
                      <option value="10">10</option>
                      <option value="20">20</option>
                      <option value="50">50</option>
                    </select>
                    <span>kết quả mỗi trang</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button 
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-5 h-5 rotate-180" />
                    </button>
                    {Array.from({ length: totalPages }).map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentPage(idx + 1)}
                        className={`w-8 h-8 rounded-lg text-sm font-bold flex items-center justify-center transition-colors ${
                          currentPage === idx + 1 
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                            : 'text-gray-600 hover:bg-gray-100 border border-transparent hover:border-gray-200'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    ))}
                    <button 
                      disabled={currentPage === totalPages || totalPages === 0}
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW ORDER OVERLAY */}
          {viewingOrder && (
            <div className="absolute inset-0 z-50 bg-black/40 flex items-center justify-center p-6 animate-in fade-in duration-200">
              <div className="bg-white w-full max-w-4xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-full animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/80">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                      <FileText size={20} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-gray-900">Chi tiết Phiếu chỉ định</h3>
                      <p className="text-sm text-gray-500 font-medium">Mã phiếu: {viewingOrder.id}</p>
                    </div>
                  </div>
                  <button onClick={() => setViewingOrder(null)} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                    <X size={20} className="text-gray-500" />
                  </button>
                </div>
                
                {/* Body */}
                <div className="p-6 overflow-y-auto flex-1 space-y-8">
                  {/* Info Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Patient Info */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                      <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 border-b pb-2">Thông tin Bệnh nhân</h4>
                      <div className="flex gap-4 items-center mb-4">
                        {viewingOrder.avatar ? (
                          <img src={viewingOrder.avatar} alt="Avatar" className="w-12 h-12 rounded-full object-cover shadow-sm ring-2 ring-gray-100" />
                        ) : (
                          <div className="w-12 h-12 bg-blue-100 text-blue-700 font-bold rounded-full flex items-center justify-center shadow-sm">
                            {viewingOrder.patientName.split(' ').slice(-2).map((n: string) => n[0]).join('').toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="text-lg font-black text-gray-900">{viewingOrder.patientName}</p>
                          <p className="text-sm text-gray-600 font-medium">{viewingOrder.patientProfile?.patientCode}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-y-3 text-sm">
                        <div><span className="text-gray-500">Ngày sinh:</span> <span className="font-bold text-gray-900 ml-1">{viewingOrder.dob?.includes('-') ? viewingOrder.dob.split('-').reverse().join('/') : viewingOrder.dob}</span></div>
                        <div><span className="text-gray-500">Giới tính:</span> <span className="font-bold text-gray-900 ml-1">{viewingOrder.gender}</span></div>
                        <div><span className="text-gray-500">Số điện thoại:</span> <span className="font-bold text-gray-900 ml-1">{viewingOrder.phone}</span></div>
                        <div><span className="text-gray-500">CCCD:</span> <span className="font-bold text-gray-900 ml-1">{viewingOrder.cccd}</span></div>
                        <div className="col-span-2"><span className="text-gray-500">Địa chỉ:</span> <span className="font-bold text-gray-900 ml-1">{viewingOrder.address}</span></div>
                      </div>
                    </div>
                    
                    {/* Order Info */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                      <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 border-b pb-2">Thông tin Chỉ định</h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500">Trạng thái:</span>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${viewingOrder.status === 'ordered' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                            {viewingOrder.status === 'ordered' ? 'Đã phát hành' : 'Lưu nháp'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Độ ưu tiên:</span>
                          <span className={`font-bold ${viewingOrder.priority === 'emergency' ? 'text-red-600' : viewingOrder.priority === 'urgent' ? 'text-amber-600' : 'text-blue-600'}`}>
                            {viewingOrder.priority === 'emergency' ? 'Khẩn cấp' : viewingOrder.priority === 'urgent' ? 'Ưu tiên' : 'Bình thường'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Ngày chỉ định:</span>
                          <span className="font-bold text-gray-900">{viewingOrder.dateOnly}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Bác sĩ chỉ định:</span>
                          <span className="font-bold text-gray-900">BS. {viewingOrder.doctor}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Medical Details */}
                  <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5">
                    <h4 className="text-sm font-bold text-blue-800 uppercase tracking-wider mb-3">Chẩn đoán / Yêu cầu</h4>
                    <p className="text-gray-800 font-medium">{viewingOrder.reason || 'Không có ghi chú'}</p>
                  </div>

                  {/* Test List */}
                  <div>
                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Danh mục Xét nghiệm</h4>
                    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-4 py-3 font-bold text-gray-700">STT</th>
                            <th className="px-4 py-3 font-bold text-gray-700">Tên xét nghiệm</th>
                            <th className="px-4 py-3 font-bold text-gray-700 text-right">Thành tiền</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {viewingOrder.tests.map((testName: string, idx: number) => {
                            const testItem = AVAILABLE_TESTS.find(t => t.name === testName);
                            const priceStr = testItem ? testItem.price.toLocaleString() + 'đ' : '-';
                            return (
                              <tr key={idx} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-gray-500 font-medium">{idx + 1}</td>
                                <td className="px-4 py-3 font-bold text-gray-900">{testName}</td>
                                <td className="px-4 py-3 font-bold text-gray-900 text-right">{priceStr}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                        <tfoot className="bg-gray-50/80 border-t border-gray-200">
                          <tr>
                            <td colSpan={2} className="px-4 py-4 text-right font-bold text-gray-600 uppercase text-xs tracking-wider">Tổng cộng</td>
                            <td className="px-4 py-4 text-right font-black text-blue-600 text-lg">
                              {viewingOrder.tests.reduce((sum: number, testName: string) => {
                                const t = AVAILABLE_TESTS.find(t => t.name === testName);
                                return sum + (t ? t.price : 0);
                              }, 0).toLocaleString()}đ
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CREATE ORDER OVERLAY */}
          {isCreating && (
            <div className="absolute inset-0 z-50 bg-slate-50 flex flex-col p-6 overflow-y-auto animate-in fade-in slide-in-from-right-8 duration-300">
              <div className="max-w-7xl w-full mx-auto space-y-6 pb-20">
                
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                      Lập phiếu chỉ định xét nghiệm
                    </h2>
                    <p className="text-gray-700 font-medium mt-1">Chọn dịch vụ và thông tin bệnh nhân để tạo phiếu</p>
                  </div>
                  <button onClick={handleCancelCreate} className="px-5 py-2.5 border border-red-200 bg-red-50 text-red-700 font-bold rounded-xl hover:bg-red-100 transition-colors">
                    Hủy & Quay lại
                  </button>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-blue-200 overflow-hidden">
                  <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
                    
                    {/* Left Col: Patient & Test Selection */}
                    <div className="space-y-8">
                      {/* Patient Search Section */}
                      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <User className="w-5 h-5 text-blue-600" />
                          Thông tin bệnh nhân
                        </h3>
                        
                        {!selectedPatient ? (
                          <div className="space-y-3">
                            <form onSubmit={handleSearchPatient} className="flex gap-2">
                              <div className="relative flex-1">
                                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input 
                                  type="text" 
                                  placeholder="Nhập mã bệnh nhân để tìm kiếm..." 
                                  className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-xl text-base focus:outline-none focus:ring-2 transition-all font-bold text-gray-900 placeholder-gray-500 ${
                                    searchError ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                                  }`}
                                  value={patientSearch}
                                  onChange={(e) => {
                                    setPatientSearch(e.target.value);
                                    if (searchError) setSearchError('');
                                  }}
                                />
                              </div>
                              <button 
                                type="submit"
                                disabled={isSearching}
                                className="px-4 py-2.5 bg-blue-100 text-blue-700 font-bold rounded-xl hover:bg-blue-200 transition-colors"
                              >
                                {isSearching ? "Đang tìm..." : "Tìm kiếm"}
                              </button>
                            </form>
                            
                            {searchError && (
                              <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-xl border border-red-100 text-sm font-medium animate-in fade-in zoom-in-95">
                                <AlertTriangle className="w-5 h-5 shrink-0" />
                                {searchError}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center gap-5 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                            {/* Avatar */}
                            {selectedPatient.avatar ? (
                              <img src={selectedPatient.avatar} alt="Avatar" className="w-14 h-14 rounded-full object-cover shadow-sm shrink-0 ring-2 ring-white" />
                            ) : (
                              <div className="w-14 h-14 bg-blue-100/50 rounded-full flex items-center justify-center text-blue-600 text-xl font-bold shrink-0">
                                {selectedPatient.fullName.split(' ').slice(-2).map((n: string) => n[0]).join('').toUpperCase()}
                              </div>
                            )}
                            
                            {/* Info */}
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1.5">
                                <h3 className="text-lg font-black text-gray-900 leading-none">{selectedPatient.fullName}</h3>
                                <span className="px-2.5 py-1 bg-blue-50/50 border border-blue-100 text-blue-600 text-xs font-bold rounded flex items-center gap-1">
                                  {selectedPatient.gender === 'Nam' ? '♂' : '♀'} {selectedPatient.patientCode}
                                </span>
                              </div>
                              <div className="grid grid-cols-2 gap-y-1.5 text-sm text-gray-600 mt-2">
                                <div>Ngày sinh: <span className="font-bold text-gray-900">{selectedPatient.dob?.includes('-') ? selectedPatient.dob.split('-').reverse().join('/') : (selectedPatient.dob || 'N/A')}</span></div>
                                <div>SĐT: <span className="font-bold text-gray-900">{selectedPatient.phone || 'N/A'}</span></div>
                                <div>Giới tính: <span className="font-bold text-gray-900">{selectedPatient.gender || 'N/A'}</span></div>
                                <div>CCCD: <span className="font-bold text-gray-900">{selectedPatient.cccd || 'N/A'}</span></div>
                                <div className="col-span-2 mt-0.5">Địa chỉ: <span className="font-bold text-gray-900">{selectedPatient.address || 'Chưa cập nhật'}</span></div>
                              </div>
                            </div>
                            
                            <button 
                              onClick={() => setSelectedPatient(null)}
                              className="text-gray-400 hover:text-red-500 transition-colors self-start p-1"
                              title="Chọn bệnh nhân khác"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Test Selection */}
                      <div>
                        <div className="flex justify-between items-end mb-4">
                          <label className="block text-base font-bold text-gray-800">Danh mục xét nghiệm <span className="text-red-500">*</span></label>
                          <span className="text-sm font-bold bg-blue-50 text-blue-600 px-3 py-1 rounded-full border border-blue-100">Đã chọn {selectedTests.length}</span>
                        </div>
                        
                        <div className="border border-gray-200 rounded-2xl overflow-hidden bg-gray-50 shadow-inner max-h-[380px] overflow-y-auto">
                          <div className="divide-y divide-gray-200">
                            {AVAILABLE_TESTS.map(test => (
                              <label 
                                key={test.id} 
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleToggleTest(test.id);
                                }}
                                className={`flex items-start gap-4 p-4 cursor-pointer transition-colors ${selectedTests.includes(test.id) ? 'bg-blue-50/80 hover:bg-blue-50' : 'bg-white hover:bg-gray-50'}`}
                              >
                                <div className="flex-shrink-0 mt-0.5">
                                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedTests.includes(test.id) ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                                    {selectedTests.includes(test.id) && <Check size={14} className="text-white" />}
                                  </div>
                                </div>
                                <div className="flex-1">
                                  <p className={`font-black ${selectedTests.includes(test.id) ? 'text-blue-900' : 'text-gray-900'}`}>{test.name}</p>
                                  <p className="text-sm text-gray-700 flex items-center gap-2 mt-1.5 font-medium">
                                    <span className="px-2 py-0.5 bg-gray-200 rounded text-gray-800 font-bold">{test.type}</span>
                                  </p>
                                </div>
                                <div className="font-black text-gray-900">
                                  {test.price.toLocaleString()}đ
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Col: Details & Save */}
                    <div className="space-y-6 bg-gray-50/80 p-6 rounded-2xl border border-gray-200 shadow-inner">
                      <div>
                        <label className="block text-sm font-black text-gray-900 mb-3">Mức độ ưu tiên</label>
                        <div className="grid grid-cols-3 gap-3">
                          {['normal', 'urgent', 'emergency'].map(type => (
                            <label key={type} className={`border p-3 rounded-xl cursor-pointer text-center font-bold text-sm transition-all shadow-sm ${
                              priority === type 
                                ? (type === 'normal' ? 'border-blue-500 bg-blue-50 text-blue-800 ring-2 ring-blue-500/30' : 
                                  type === 'urgent' ? 'border-amber-500 bg-amber-50 text-amber-800 ring-2 ring-amber-500/30' : 
                                  'border-red-500 bg-red-50 text-red-800 ring-2 ring-red-500/30')
                                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                            }`}>
                              <input 
                                type="radio" 
                                name="priority" 
                                className="hidden" 
                                checked={priority === type}
                                onChange={() => setPriority(type)}
                              />
                              {type === 'normal' ? 'Bình thường' : type === 'urgent' ? 'Ưu tiên (Nhanh)' : 'Khẩn cấp'}
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-black text-gray-900 mb-2">Chẩn đoán sơ bộ / Yêu cầu lâm sàng <span className="text-red-500">*</span></label>
                        <textarea 
                          rows={3} 
                          className="w-full p-4 bg-white border border-gray-300 rounded-xl text-base font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none shadow-sm text-gray-900 placeholder-gray-500"
                          placeholder="VD: Bệnh nhân sốt cao 3 ngày, nghi ngờ sốt xuất huyết..."
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-black text-gray-900 mb-2">Ghi chú cho bộ phận Xét nghiệm (Tùy chọn)</label>
                        <textarea 
                          rows={2} 
                          className="w-full p-4 bg-white border border-gray-300 rounded-xl text-base font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none shadow-sm text-gray-900 placeholder-gray-500"
                          placeholder="VD: Chú ý lấy ven khó..."
                          value={instructions}
                          onChange={(e) => setInstructions(e.target.value)}
                        />
                      </div>
                      
                      {/* HÓA ĐƠN SUMMARY */}
                      <div className="bg-white border border-blue-100 rounded-xl p-5 mt-4 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -z-0"></div>
                        <h4 className="font-black text-gray-900 mb-4 flex items-center gap-2 relative z-10">
                          <CreditCard size={18} className="text-blue-600" /> Tạm tính chi phí
                        </h4>
                        <div className="space-y-3 mb-4 relative z-10">
                          {selectedTests.map(id => {
                            const t = AVAILABLE_TESTS.find(t => t.id === id);
                            if (!t) return null;
                            return (
                              <div key={t.id} className="flex justify-between text-sm items-center">
                                <span className="text-gray-600 line-clamp-1 mr-4 font-medium flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div> {t.name}
                                </span>
                                <span className="font-bold text-gray-900">{t.price.toLocaleString()}đ</span>
                              </div>
                            );
                          })}
                          {selectedTests.length === 0 && (
                            <div className="text-sm text-gray-400 italic text-center py-4">Chưa chọn dịch vụ nào</div>
                          )}
                        </div>
                        <div className="flex justify-between items-center pt-4 border-t border-gray-200 border-dashed relative z-10">
                          <span className="font-bold text-gray-500 uppercase text-xs tracking-wider">Tổng cộng</span>
                          <span className="text-2xl font-black text-blue-600">
                            {selectedTests.reduce((sum, id) => {
                              const t = AVAILABLE_TESTS.find(t => t.id === id);
                              return sum + (t?.price || 0);
                            }, 0).toLocaleString()}đ
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 flex gap-4">
                        <button 
                          onClick={() => handleSaveOrder('draft')}
                          className="flex-1 py-3.5 border border-gray-300 bg-white text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
                        >
                          Lưu nháp
                        </button>
                        <button 
                          onClick={() => handleSaveOrder('ordered')}
                          className="flex-[2] py-3.5 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0"
                        >
                          <Save size={20} />
                          Xác nhận & Phát hành phiếu
                        </button>
                      </div>
                    </div>
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
