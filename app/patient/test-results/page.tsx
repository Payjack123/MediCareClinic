'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FileText, Search, Bell, ChevronRight, Activity, 
  Filter, Download, Printer, CheckCircle2, Clock,
  AlertCircle, XCircle, Beaker, FileImage, Stethoscope, ChevronLeft
} from 'lucide-react';
import PatientSidebar from '@/app/patient/Sidebar';
import { getTestResults } from './actions';

export default function TestResultsPage() {
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('Tất cả');
  const [selectedStatus, setSelectedStatus] = useState('Tất cả');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const res = await getTestResults();
      if (res.success && res.data) {
        setData(res.data);
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const testTypes = ['Tất cả', 'Xét nghiệm máu', 'Nước tiểu', 'Siêu âm', 'X-quang'];
  const testStatuses = ['Tất cả', 'Đã chỉ định', 'Đang thực hiện', 'Có kết quả', 'Bác sĩ đã xác nhận', 'Đã hủy'];

  const filteredData = data.filter(test => {
    const matchesSearch = test.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          test.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'Tất cả' || test.type === selectedType;
    const matchesStatus = selectedStatus === 'Tất cả' || test.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusConfig = (status: string) => {
    switch(status) {
      case 'Đã chỉ định': return { color: 'text-yellow-600', bg: 'bg-yellow-50', icon: <Clock size={14} className="text-yellow-500"/> };
      case 'Đang thực hiện': return { color: 'text-blue-600', bg: 'bg-blue-50', icon: <Activity size={14} className="text-blue-500 animate-pulse"/> };
      case 'Có kết quả': return { color: 'text-green-600', bg: 'bg-green-50', icon: <CheckCircle2 size={14} className="text-green-500"/> };
      case 'Bác sĩ đã xác nhận': return { color: 'text-emerald-700', bg: 'bg-emerald-50', icon: <CheckCircle2 size={14} className="text-emerald-600"/> };
      case 'Đã hủy': return { color: 'text-red-600', bg: 'bg-red-50', icon: <XCircle size={14} className="text-red-500"/> };
      default: return { color: 'text-gray-600', bg: 'bg-gray-50', icon: null };
    }
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'Xét nghiệm máu': return <Beaker size={20} className="text-red-500" />;
      case 'Nước tiểu': return <Beaker size={20} className="text-yellow-500" />;
      case 'X-quang': return <FileImage size={20} className="text-purple-500" />;
      case 'Siêu âm': return <Activity size={20} className="text-cyan-500" />;
      default: return <Stethoscope size={20} className="text-blue-500" />;
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] font-sans text-gray-800 overflow-hidden">
      <PatientSidebar activePage="test-results" />

      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#F8FAFC]">
        {/* TOP HEADER */}
        <header className="h-20 bg-white border-b border-gray-100 px-8 flex items-center justify-between shrink-0 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center border border-indigo-100/50">
              <Beaker size={24} />
            </div>
            <h1 className="text-xl font-black text-gray-900">Kết quả xét nghiệm</h1>
          </div>
          <div className="flex items-center gap-5 ml-auto">
            <button className="relative p-2.5 text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 rounded-full transition bg-white border border-gray-200 shadow-sm">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-5 border-l border-gray-200 cursor-pointer group">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition">Nguyễn Văn A</p>

              </div>
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border-2 border-white shadow-sm">
                A
              </div>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <div className="flex-1 overflow-hidden p-6 lg:p-8 flex flex-col gap-6 lg:gap-8">
          
          {/* LEFT: LIST & FILTERS */}
          <div className="w-full flex flex-col gap-4 h-full bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden shrink-0">
            <div className="p-5 border-b border-gray-100 space-y-4">
              <h2 className="text-lg font-black text-gray-900">Danh sách xét nghiệm</h2>
              
              {/* Search Box */}
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Tìm theo mã, tên xét nghiệm..." 
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Filters */}
              <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-1">
                <select 
                  className="text-xs bg-gray-50 border border-gray-200 text-gray-700 rounded-lg px-3 py-2 outline-none focus:border-indigo-500 whitespace-nowrap"
                  value={selectedType}
                  onChange={e => setSelectedType(e.target.value)}
                >
                  {testTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <select 
                  className="text-xs bg-gray-50 border border-gray-200 text-gray-700 rounded-lg px-3 py-2 outline-none focus:border-indigo-500 whitespace-nowrap"
                  value={selectedStatus}
                  onChange={e => setSelectedStatus(e.target.value)}
                >
                  {testStatuses.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
              {isLoading ? (
                <div className="flex justify-center p-8"><Activity className="animate-spin text-indigo-500" /></div>
              ) : filteredData.length > 0 ? (
                <div className="flex flex-col gap-4">
                {filteredData.map(test => {
                  const statusConfig = getStatusConfig(test.status);
                  return (
                    <div 
                      key={test.id}
                      className="p-5 rounded-2xl transition-all border bg-white border-gray-100 hover:border-indigo-200 hover:shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3.5 rounded-xl bg-indigo-50 shadow-sm border border-indigo-100/50 text-indigo-600 shrink-0">
                          {getTypeIcon(test.type)}
                        </div>
                        <div>
                          <h3 className="text-[15px] font-bold text-gray-900">{test.name}</h3>
                          <div className="flex items-center gap-4 mt-1.5">
                            <p className="text-xs text-gray-500 flex items-center gap-1.5"><Clock size={12} className="text-gray-400"/> {test.date} • {test.time}</p>
                            <span className="text-[11px] font-bold text-gray-400 border border-gray-200 px-1.5 py-0.5 rounded uppercase tracking-wider">{test.code}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 md:ml-auto w-full md:w-auto mt-2 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100">
                        <div className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-bold ${statusConfig.bg} ${statusConfig.color} flex-1 md:flex-none border border-transparent`}>
                          {statusConfig.icon} {test.status}
                        </div>
                        <Link href={`/patient/test-results/${test.id}`} className="px-5 py-2 bg-indigo-50 border border-indigo-100 hover:bg-indigo-600 text-indigo-600 hover:text-white rounded-xl text-[13px] font-bold transition-colors text-center shrink-0 shadow-sm">
                          Xem chi tiết
                        </Link>
                      </div>
                    </div>
                  );
                })}
                </div>
              ) : (
                <div className="text-center p-12 text-gray-500 text-sm">
                  Không tìm thấy kết quả nào
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
