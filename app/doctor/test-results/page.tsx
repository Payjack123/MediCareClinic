"use client";
import React, { useState, useEffect } from "react";
import DoctorSidebar from "@/app/doctor/Sidebar";
import {
  Search, CheckCircle2,
  Filter, Calendar, User, TestTube, Clock, CheckCircle,
  AlertCircle, AlertTriangle, FileText, ChevronRight, Pill,
  Save, FileSignature, Activity, Loader2, X, Eye
} from "lucide-react";
import { getLabResults, evaluateLabResult } from './actions';

const STATUS_CONFIG = {
  waiting: { label: "Chờ kết quả", color: "bg-amber-100 text-amber-700 border-amber-200", icon: Clock },
  has_result: { label: "Có kết quả", color: "bg-blue-100 text-blue-700 border-blue-200", icon: FileText },
  confirmed: { label: "Đã xác nhận", color: "bg-indigo-100 text-indigo-700 border-indigo-200", icon: CheckCircle },
  evaluated: { label: "Đã đánh giá", color: "bg-green-100 text-green-700 border-green-200", icon: FileSignature },
};

export default function TestResultsPage() {
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modal State
  const [selectedResult, setSelectedResult] = useState<any>(null);
  const [evaluation, setEvaluation] = useState("");
  const [doctorNote, setDoctorNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    const res = await getLabResults();
    if (res.success && res.data) {
      setResults(res.data);
    }
    setIsLoading(false);
  };

  const handleSelectResult = (res: any) => {
    setSelectedResult(res);
    setEvaluation(res.evaluation || "");
    setDoctorNote(res.doctorNote || "");
  };

  const handleSaveEvaluation = async () => {
    if (!selectedResult) return;
    if (!evaluation) {
      alert("Vui lòng chọn tình trạng đánh giá (Bình thường / Theo dõi / Bất thường)!");
      return;
    }

    setIsSaving(true);
    const res = await evaluateLabResult(selectedResult.dbId, evaluation, doctorNote);
    if (res.success) {
      alert("Đánh giá kết quả xét nghiệm thành công!");
      await fetchData(); // Refresh list to get updated status
      // We could update the selectedResult to show "Evaluated" success state, 
      // but let's just close the modal for simplicity and efficiency.
      setSelectedResult(null); 
    } else {
      alert("Đã xảy ra lỗi: " + res.message);
    }
    setIsSaving(false);
  };

  // Filtering
  const filteredResults = results.filter(res => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!res.patientName.toLowerCase().includes(q) && 
          !res.patientCode.toLowerCase().includes(q) &&
          !res.id.toLowerCase().includes(q)) {
        return false;
      }
    }
    if (statusFilter !== 'all' && res.status !== statusFilter) {
      return false;
    }
    if (dateFilter) {
      if (res.dateFilterStr !== dateFilter) return false;
    }
    return true;
  });

  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
  const paginatedResults = filteredResults.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      <DoctorSidebar activePage="test-results" />

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10 shrink-0 shadow-sm relative">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <TestTube className="w-7 h-7 text-blue-600" />
              Kết quả xét nghiệm
            </h1>
            <p className="text-sm text-gray-500 mt-1">Danh sách, xem chi tiết và đánh giá kết quả xét nghiệm</p>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 relative">
          
          {/* MAIN PAGE: RESULTS TABLE */}
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
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <select 
                  className="py-2.5 px-4 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 min-w-[150px]"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">Trạng thái (Tất cả)</option>
                  <option value="waiting">Chờ kết quả</option>
                  <option value="has_result">Có kết quả</option>
                  <option value="evaluated">Đã đánh giá</option>
                </select>

                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5">
                  <span className="text-sm font-medium text-gray-500 whitespace-nowrap">Ngày:</span>
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
                      <th className="px-6 py-4 font-bold text-gray-700 whitespace-nowrap">Mã phiếu</th>
                      <th className="px-6 py-4 font-bold text-gray-700 whitespace-nowrap">Loại xét nghiệm</th>
                      <th className="px-6 py-4 font-bold text-gray-700 whitespace-nowrap">Ngày giờ</th>
                      <th className="px-6 py-4 font-bold text-gray-700 whitespace-nowrap text-center">Trạng thái</th>
                      <th className="px-6 py-4 font-bold text-gray-700 whitespace-nowrap text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginatedResults.length > 0 ? paginatedResults.map((res, index) => {
                      const statusCfg = STATUS_CONFIG[res.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.waiting;
                      const StatusIcon = statusCfg.icon;
                      
                      return (
                      <tr key={res.id} className="hover:bg-blue-50/60 transition-colors group">
                        <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {res.avatar ? (
                              <img src={res.avatar} alt="Avatar" className="w-10 h-10 rounded-full object-cover shadow-sm shrink-0 ring-2 ring-white" />
                            ) : (
                              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0 ring-2 ring-white">
                                {res.patientName.split(' ').slice(-2).map((n: string) => n[0]).join('').toUpperCase()}
                              </div>
                            )}
                            <div>
                              <div className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                                {res.patientName}
                              </div>
                              <div className="text-xs text-gray-500">{res.patientCode}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-gray-600 whitespace-nowrap">
                          {res.id}
                        </td>
                        <td className="px-6 py-4">
                          <div className="inline-flex items-center gap-1.5 text-sm font-bold text-gray-800 bg-gray-100 px-3 py-1 rounded-lg">
                            <TestTube className="w-4 h-4 text-gray-500" />
                            {res.type.length > 30 ? res.type.substring(0, 30) + '...' : res.type}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-gray-900 mb-0.5 flex items-center gap-1.5"><Clock className="w-4 h-4 text-gray-400"/> {res.time}</div>
                          <div className="text-xs text-gray-500 flex items-center gap-1 mt-1"><Calendar className="w-3 h-3"/> {res.dateOnly}</div>
                        </td>
                        <td className="px-6 py-4 text-center whitespace-nowrap">
                          <span className={`px-2.5 py-1 text-xs font-bold rounded-md border inline-flex items-center justify-center gap-1 ${statusCfg.color}`}>
                            <StatusIcon className="w-3.5 h-3.5" />
                            {statusCfg.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <button 
                            onClick={() => handleSelectResult(res)}
                            className="px-4 py-2 bg-white text-blue-600 hover:bg-blue-50 font-bold text-sm rounded-xl transition-all shadow-sm border border-blue-200 inline-flex items-center justify-center gap-1.5 ml-auto min-w-[130px]"
                          >
                            <Eye className="w-4 h-4"/> Xem kết quả
                          </button>
                        </td>
                      </tr>
                    )
                    }) : (
                      <tr>
                        <td colSpan={7} className="px-6 py-16 text-center text-gray-500 bg-gray-50/50">
                          {isLoading ? (
                            <div className="flex flex-col items-center">
                              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-3"></div>
                              Đang tải dữ liệu...
                            </div>
                          ) : (
                            <div className="flex flex-col items-center">
                              <Activity className="w-12 h-12 text-gray-300 mb-3" />
                              <div className="text-gray-500">Chưa có kết quả xét nghiệm nào.</div>
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

          {/* VIEW RESULT OVERLAY (MODAL) */}
          {selectedResult && (
            <div className="absolute inset-0 z-50 bg-black/40 flex items-center justify-center p-6 animate-in fade-in duration-200">
              <div className="bg-slate-50 w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-full animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-white shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                      <Activity size={20} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-gray-900">Chi tiết Kết quả Xét nghiệm</h3>
                      <p className="text-sm text-gray-500 font-medium">Mã phiếu: {selectedResult.id}</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedResult(null)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <X size={20} className="text-gray-500" />
                  </button>
                </div>
                
                {/* Body */}
                <div className="p-6 overflow-y-auto flex-1 space-y-6">
                  {/* Info Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Patient Info */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                      <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 border-b pb-2">Thông tin Bệnh nhân</h4>
                      <div className="flex gap-4 items-center mb-4">
                        {selectedResult.avatar ? (
                          <img src={selectedResult.avatar} alt="Avatar" className="w-12 h-12 rounded-full object-cover shadow-sm ring-2 ring-gray-100" />
                        ) : (
                          <div className="w-12 h-12 bg-indigo-100 text-indigo-700 font-bold rounded-full flex items-center justify-center shadow-sm text-lg">
                            {selectedResult.patientName.split(' ').slice(-2).map((n: string) => n[0]).join('').toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="text-lg font-black text-gray-900">{selectedResult.patientName}</p>
                          <p className="text-sm text-gray-600 font-medium">{selectedResult.patientCode}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-y-3 text-sm">
                        <div><span className="text-gray-500">Ngày sinh:</span> <span className="font-bold text-gray-900 ml-1">{selectedResult.dob?.includes('-') ? selectedResult.dob.split('-').reverse().join('/') : selectedResult.dob}</span></div>
                        <div><span className="text-gray-500">Giới tính:</span> <span className="font-bold text-gray-900 ml-1">{selectedResult.gender}</span></div>
                        <div><span className="text-gray-500">Số điện thoại:</span> <span className="font-bold text-gray-900 ml-1">{selectedResult.phone}</span></div>
                        <div><span className="text-gray-500">CCCD:</span> <span className="font-bold text-gray-900 ml-1">{selectedResult.cccd}</span></div>
                        <div className="col-span-2"><span className="text-gray-500">Địa chỉ:</span> <span className="font-bold text-gray-900 ml-1">{selectedResult.address}</span></div>
                      </div>
                    </div>
                    
                    {/* Test Info */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                      <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 border-b pb-2">Thông tin Xét nghiệm</h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500">Loại xét nghiệm:</span>
                          <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">{selectedResult.type}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500">Trạng thái:</span>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold border inline-flex items-center gap-1 ${STATUS_CONFIG[selectedResult.status as keyof typeof STATUS_CONFIG]?.color || STATUS_CONFIG.waiting.color}`}>
                            {React.createElement(STATUS_CONFIG[selectedResult.status as keyof typeof STATUS_CONFIG]?.icon || Clock, { className: "w-3.5 h-3.5" })}
                            {STATUS_CONFIG[selectedResult.status as keyof typeof STATUS_CONFIG]?.label || "Không rõ"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Ngày giờ:</span>
                          <span className="font-bold text-gray-900">{selectedResult.time} - {selectedResult.dateOnly}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Kỹ thuật viên:</span>
                          <span className="font-bold text-gray-900">{selectedResult.technician}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Indices Table */}
                  {selectedResult.indices && selectedResult.indices.length > 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2">
                          <Activity className="w-5 h-5 text-blue-500" />
                          Chi tiết các chỉ số
                        </h3>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                          <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                            <tr>
                              <th className="px-6 py-3 whitespace-nowrap">Tên chỉ số</th>
                              <th className="px-6 py-3 whitespace-nowrap">Kết quả</th>
                              <th className="px-6 py-3 text-gray-500 whitespace-nowrap">Khoảng tham chiếu</th>
                              <th className="px-6 py-3 text-gray-500 whitespace-nowrap">Đơn vị</th>
                              <th className="px-6 py-3 text-right whitespace-nowrap">Đánh giá</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {selectedResult.indices.map((idx: any, i: number) => (
                              <tr key={i} className={`hover:bg-gray-50/50 transition-colors ${idx.status === 'abnormal' ? 'bg-red-50/30' : ''}`}>
                                <td className="px-6 py-4 font-bold text-gray-900">{idx.name}</td>
                                <td className={`px-6 py-4 font-black text-base ${idx.status === 'abnormal' ? 'text-red-600' : 'text-gray-900'}`}>
                                  {idx.result}
                                </td>
                                <td className="px-6 py-4 text-gray-600 font-medium">{idx.min} - {idx.max}</td>
                                <td className="px-6 py-4 text-gray-500">{idx.unit}</td>
                                <td className="px-6 py-4 text-right">
                                  {idx.status === 'normal' ? (
                                    <span className="inline-flex items-center gap-1 text-green-700 bg-green-100/50 px-2.5 py-1 rounded-md text-xs font-bold border border-green-200">
                                      <CheckCircle className="w-3.5 h-3.5" /> Bình thường
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 text-red-700 bg-red-100/50 px-2.5 py-1 rounded-md text-xs font-bold border border-red-200">
                                      <AlertCircle className="w-3.5 h-3.5" /> Bất thường
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 text-center flex flex-col items-center justify-center">
                      <Clock className="w-12 h-12 text-gray-300 mb-4 animate-pulse" />
                      <h3 className="text-lg font-bold text-gray-800 mb-1">Đang chờ kết quả</h3>
                      <p className="text-gray-500 text-sm">Kỹ thuật viên chưa cập nhật kết quả cho xét nghiệm này.</p>
                    </div>
                  )}

                  {/* Doctor Evaluation Section */}
                  {selectedResult.status !== 'waiting' && (
                    <div className="bg-white rounded-2xl shadow-sm border border-indigo-200 overflow-hidden relative">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -z-0"></div>
                      <div className="px-6 py-4 border-b border-gray-100 bg-white relative z-10">
                        <h3 className="font-black text-indigo-900 flex items-center gap-2">
                          <FileSignature className="w-5 h-5 text-indigo-500" />
                          Bác sĩ đánh giá & Kết luận
                        </h3>
                      </div>
                      
                      <div className="p-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left: Radios */}
                        <div>
                          <label className="block text-sm font-black text-gray-900 mb-3">Đánh giá chung <span className="text-red-500">*</span></label>
                          <div className="space-y-3">
                            <label className={`flex items-center gap-3 p-4 border rounded-xl transition-all shadow-sm ${evaluation === 'normal' ? 'border-green-500 bg-green-50 ring-2 ring-green-500/30' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'} ${selectedResult.status === 'evaluated' ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer'}`}>
                              <input
                                type="radio"
                                name="evaluation"
                                value="normal"
                                checked={evaluation === 'normal'}
                                onChange={() => setEvaluation('normal')}
                                disabled={selectedResult.status === 'evaluated'}
                                className="w-4 h-4 text-green-600 focus:ring-green-500 disabled:opacity-50"
                              />
                              <div>
                                <p className={`font-bold ${evaluation === 'normal' ? 'text-green-800' : 'text-gray-900'}`}>Bình thường</p>
                                <p className="text-xs text-gray-500 font-medium">Các chỉ số trong giới hạn an toàn</p>
                              </div>
                            </label>

                            <label className={`flex items-center gap-3 p-4 border rounded-xl transition-all shadow-sm ${evaluation === 'monitor' ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-500/30' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'} ${selectedResult.status === 'evaluated' ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer'}`}>
                              <input
                                type="radio"
                                name="evaluation"
                                value="monitor"
                                checked={evaluation === 'monitor'}
                                onChange={() => setEvaluation('monitor')}
                                disabled={selectedResult.status === 'evaluated'}
                                className="w-4 h-4 text-amber-600 focus:ring-amber-500 disabled:opacity-50"
                              />
                              <div>
                                <p className={`font-bold ${evaluation === 'monitor' ? 'text-amber-800' : 'text-gray-900'}`}>Cần theo dõi thêm</p>
                                <p className="text-xs text-gray-500 font-medium">Có dấu hiệu rủi ro, cần chú ý</p>
                              </div>
                            </label>

                            <label className={`flex items-center gap-3 p-4 border rounded-xl transition-all shadow-sm ${evaluation === 'abnormal' ? 'border-red-500 bg-red-50 ring-2 ring-red-500/30' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'} ${selectedResult.status === 'evaluated' ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer'}`}>
                              <input
                                type="radio"
                                name="evaluation"
                                value="abnormal"
                                checked={evaluation === 'abnormal'}
                                onChange={() => setEvaluation('abnormal')}
                                disabled={selectedResult.status === 'evaluated'}
                                className="w-4 h-4 text-red-600 focus:ring-red-500 disabled:opacity-50"
                              />
                              <div>
                                <p className={`font-bold ${evaluation === 'abnormal' ? 'text-red-800' : 'text-gray-900'}`}>Bất thường / Nguy hiểm</p>
                                <p className="text-xs text-gray-500 font-medium">Chỉ số vượt mức, cần điều trị</p>
                              </div>
                            </label>
                          </div>
                        </div>

                        {/* Right: Notes & Save */}
                        <div className="flex flex-col">
                          <label className="block text-sm font-black text-gray-900 mb-3">Ghi chú chuyên môn (Kết luận)</label>
                          <textarea
                            rows={6}
                            value={doctorNote}
                            onChange={(e) => setDoctorNote(e.target.value)}
                            placeholder="Nhập nhận xét, đánh giá của bác sĩ về kết quả này..."
                            className="w-full p-4 border border-gray-300 rounded-xl text-sm text-gray-900 font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none shadow-sm flex-1 bg-white"
                          ></textarea>
                          
                          {/* Save Action */}
                          <div className="mt-6 flex gap-4">
                            {selectedResult.status !== 'evaluated' ? (
                              <button
                                onClick={handleSaveEvaluation}
                                disabled={isSaving}
                                className="w-full px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                              >
                                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                Lưu đánh giá & Cập nhật bệnh án
                              </button>
                            ) : (
                              <div className="w-full bg-green-50 border border-green-200 rounded-xl p-3.5 flex items-center justify-center gap-2 text-green-700 font-bold shadow-sm">
                                <CheckCircle2 size={20} />
                                Đã lưu đánh giá thành công
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
