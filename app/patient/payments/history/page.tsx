'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search, Bell, ChevronDown, Calendar, RotateCcw,
  Eye, Download, CreditCard, Banknote, Building, Info, HelpCircle,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import PatientSidebar from '@/app/patient/Sidebar';
import { getPaymentHistoryData } from '@/app/patient/payments/history/actions';

export default function PaymentHistoryPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const res = await getPaymentHistoryData();
      if (res.success && res.data) {
        setData(res.data);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [router]);

  if (isLoading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="w-10 h-10 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const { patientInfo, history } = data;

  const renderPaymentIcon = (iconName: string) => {
    switch(iconName) {
      case 'Visa':
        return <div className="text-blue-800 font-black italic text-[10px]">VISA</div>;
      case 'Mastercard':
        return <div className="flex"><div className="w-2.5 h-2.5 bg-red-500 rounded-full opacity-90"></div><div className="w-2.5 h-2.5 bg-yellow-500 rounded-full -ml-1 opacity-90"></div></div>;
      case 'MoMo':
        return <div className="text-pink-600 font-bold text-[8px] leading-tight bg-pink-100 px-1 py-0.5 rounded">mo<br/>mo</div>;
      case 'Bank':
        return <Building size={14} className="text-blue-600"/>;
      case 'Cash':
        return <Banknote size={14} className="text-green-600"/>;
      case 'VNPay':
        return <div className="flex gap-0.5"><div className="w-1.5 h-1.5 bg-red-600 rounded-sm"></div><div className="w-1.5 h-1.5 bg-blue-600 rounded-sm"></div></div>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] font-sans text-gray-800 overflow-hidden">
      
      {/* SIDEBAR */}
      <PatientSidebar activePage="history" />

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* TOP HEADER */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-8 shrink-0 z-10">
          <div className="flex items-center w-full max-w-xl relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Tìm kiếm bác sĩ, chuyên khoa, dịch vụ..." 
              className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#2563EB] focus:bg-white outline-none transition-all shadow-sm"
            />
          </div>
          <div className="flex items-center gap-5 ml-auto">
            <button className="relative p-2.5 text-gray-500 hover:bg-blue-50 hover:text-[#2563EB] rounded-full transition bg-white border border-gray-200 shadow-sm">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-5 border-l border-gray-200 cursor-pointer group">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-900 group-hover:text-[#2563EB] transition">{patientInfo.name}</p>
                <p className="text-xs text-gray-500 font-medium">{patientInfo.code}</p>
              </div>
              <img src={patientInfo.avatar} alt="Avatar" className="w-11 h-11 rounded-full border-2 border-white shadow-sm group-hover:shadow-md transition" />
              <ChevronDown size={16} className="text-gray-400" />
            </div>
          </div>
        </header>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
          <div className="w-full max-w-[1400px] xl:max-w-none mx-auto space-y-6">
            
            {/* Tiêu đề */}
            <div>
              <h1 className="text-2xl font-black text-gray-900">Danh sách hóa đơn</h1>
              <p className="text-gray-500 text-sm mt-1">Quản lý và theo dõi tất cả hóa đơn thanh toán của bạn.</p>
            </div>

            {/* BỘ LỌC */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 md:items-end">
              <div className="flex-1 min-w-[250px]">
                <label className="block text-xs font-bold text-gray-500 mb-2">Tìm kiếm</label>
                <div className="relative">
                  <input type="text" placeholder="Nhập mã hóa đơn, dịch vụ, phòng khám..." className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#2563EB]" />
                  <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              
              <div className="w-full md:w-[220px]">
                <label className="block text-xs font-bold text-gray-500 mb-2">Trạng thái</label>
                <div className="relative">
                  <select className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#2563EB] appearance-none font-medium text-gray-700">
                    <option>Tất cả trạng thái</option>
                    <option>Đã thanh toán</option>
                    <option>Chờ thanh toán</option>
                    <option>Quá hạn</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="w-full md:w-[280px]">
                <label className="block text-xs font-bold text-gray-500 mb-2">Khoảng thời gian</label>
                <div className="relative">
                  <input type="text" defaultValue="01/01/2025 - 31/05/2025" className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#2563EB] font-medium text-gray-700" />
                  <Calendar size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <div className="flex gap-3 mt-4 md:mt-0 shrink-0">
                <button className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-bold bg-white hover:bg-gray-50 shadow-sm transition">
                  <RotateCcw size={16} /> Xóa bộ lọc
                </button>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-[#2563EB] text-white rounded-xl text-sm font-bold hover:bg-blue-600 shadow-sm transition">
                  <Search size={16} /> Tìm kiếm
                </button>
              </div>
            </div>

            {/* BẢNG DỮ LIỆU */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left whitespace-nowrap">
                  <thead className="text-xs text-gray-500 bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 font-bold">Mã hóa đơn</th>
                      <th className="px-6 py-4 font-bold">Ngày tạo</th>
                      <th className="px-6 py-4 font-bold">Nội dung</th>
                      <th className="px-6 py-4 font-bold">Phòng khám</th>
                      <th className="px-6 py-4 font-bold">Số tiền</th>
                      <th className="px-6 py-4 font-bold text-center">Trạng thái</th>
                      <th className="px-6 py-4 font-bold">Phương thức</th>
                      <th className="px-6 py-4 font-bold text-center">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {history.map((inv: any, idx: number) => {
                      const isPending = inv.status === 'Chờ thanh toán' || inv.status === 'Quá hạn';
                      return (
                        <tr key={idx} className="hover:bg-gray-50/50 transition">
                          <td className="px-6 py-5 font-bold text-gray-900">{inv.id}</td>
                          <td className="px-6 py-5 text-gray-600 font-medium">{inv.date}</td>
                          <td className="px-6 py-5 font-bold text-gray-800">{inv.content}</td>
                          <td className="px-6 py-5 text-gray-600 font-medium">{inv.clinic}</td>
                          <td className="px-6 py-5 font-black text-[#2563EB]">{inv.amount}</td>
                          <td className="px-6 py-5 text-center">
                            <span className={`px-3 py-1 rounded-md text-[11px] font-bold border inline-block ${inv.statusColor}`}>{inv.status}</span>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-2">
                              <span className="text-gray-600 font-medium">{inv.method}</span>
                              {inv.methodIcon !== 'None' && (
                                <div className="w-7 h-5 flex items-center justify-center bg-white border border-gray-200 rounded shadow-sm">
                                  {renderPaymentIcon(inv.methodIcon)}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex items-center justify-center gap-2">
                              {isPending ? (
                                <>
                                  <Link href={`/patient/payments/invoices/details?id=${inv.id}`} className="flex items-center gap-1.5 px-3 py-1.5 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-xs font-bold bg-white shadow-sm">
                                    <Eye size={14} /> Xem chi tiết
                                  </Link>
                                  <Link href={`/patient/payments/invoices/checkout?id=${inv.id}`} className="flex items-center gap-1.5 px-3 py-1.5 text-white bg-[#2563EB] rounded-lg hover:bg-blue-600 transition text-xs font-bold shadow-sm">
                                    <CreditCard size={14} /> Thanh toán
                                  </Link>
                                </>
                              ) : (
                                <>
                                  <Link href={`/patient/payments/invoices/details?id=${inv.id}`} className="flex items-center gap-1.5 px-3 py-1.5 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-xs font-bold bg-white shadow-sm">
                                    <Eye size={14} /> Xem chi tiết
                                  </Link>
                                  <button className="flex items-center justify-center w-8 h-8 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition bg-white shadow-sm">
                                    <Download size={14} />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION */}
              <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50 text-sm">
                <span className="text-gray-500 font-medium">Hiển thị <span className="font-bold text-gray-900">1 - 8</span> trong tổng số <span className="font-bold text-gray-900">18</span> hóa đơn</span>
                
                <div className="flex items-center gap-6">
                  <div className="flex bg-white shadow-sm rounded-lg">
                    <button className="w-9 h-9 flex items-center justify-center border border-gray-200 rounded-l-lg text-gray-400 hover:bg-gray-50 transition"><ChevronLeft size={16}/></button>
                    <button className="w-9 h-9 flex items-center justify-center border-y border-gray-200 bg-[#2563EB] text-white font-bold">1</button>
                    <button className="w-9 h-9 flex items-center justify-center border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium transition">2</button>
                    <button className="w-9 h-9 flex items-center justify-center border-y border-r border-gray-200 text-gray-600 hover:bg-gray-50 font-medium transition">3</button>
                    <button className="w-9 h-9 flex items-center justify-center border-y border-r border-gray-200 rounded-r-lg text-gray-600 hover:bg-gray-50 transition"><ChevronRight size={16}/></button>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 font-medium">Hiển thị</span>
                    <div className="relative">
                      <select className="pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-lg outline-none appearance-none font-bold text-gray-700 shadow-sm">
                        <option>8 / trang</option>
                        <option>16 / trang</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* LƯU Ý BOX */}
            <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 mt-6">
              <div>
                <h3 className="font-bold text-[#2563EB] flex items-center gap-2 mb-2">
                  <Info size={18} /> Lưu ý
                </h3>
                <ul className="list-disc pl-5 space-y-1.5 text-sm text-gray-700 font-medium">
                  <li>Hóa đơn có trạng thái <span className="font-bold">"Chờ thanh toán"</span> vui lòng thanh toán trước khi đến khám.</li>
                  <li>Bạn có thể tải hóa đơn điện tử (PDF) để lưu trữ hoặc gửi cho bảo hiểm (nếu cần).</li>
                </ul>
              </div>
              <button className="flex items-center justify-center gap-2 px-6 py-2.5 border border-[#2563EB] text-[#2563EB] bg-white rounded-xl text-sm font-bold shadow-sm hover:bg-blue-50 transition shrink-0">
                <HelpCircle size={16} /> Hướng dẫn thanh toán
              </button>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}
