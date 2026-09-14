'use client';
import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Clock, ArrowLeft, Loader2, TestTube, User, Stethoscope, 
  Printer, Download, CheckCircle, XCircle, Beaker, Check
} from 'lucide-react';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

import Sidebar from '@/app/admin/Sidebar';
import { getLabTestDetail, updateLabTestStatus } from '@/app/admin/lab-tests/actions';

export default function LabTestDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const testId = Number(resolvedParams.id);
  
  const [isLoading, setIsLoading] = useState(true);
  const [testRecord, setTestRecord] = useState<any>(null);

  const fetchLabTest = async () => {
    setIsLoading(true);
    const res = await getLabTestDetail(testId);
    if (res.success && res.data) {
      setTestRecord(res.data);
    } else {
      toast.error('Không tìm thấy kết quả xét nghiệm');
      router.push('/admin/lab-tests');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (testId) {
      fetchLabTest();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testId]);

  const handleStatusChange = async (newStatus: string) => {
    if (!confirm(`Bạn có chắc muốn chuyển kết quả này sang trạng thái "${newStatus}"?`)) return;
    
    const toastId = toast.loading('Đang cập nhật trạng thái...');
    const res = await updateLabTestStatus(testId, newStatus);
    
    if (res.success) {
      toast.success(res.message, { id: toastId });
      fetchLabTest();
    } else {
      toast.error(res.message, { id: toastId });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    toast.success('Đã tải xuống kết quả xét nghiệm (PDF)');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ordered':
      case 'Đã chỉ định': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'waiting':
      case 'Đang thực hiện': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'processing':
      case 'Đang xử lý': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'has_result':
      case 'Đã có kết quả': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'evaluated':
      case 'Bác sĩ đã xem': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'canceled':
      case 'Đã hủy': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const translateStatus = (status: string) => {
    switch (status) {
      case 'ordered': return 'Đã chỉ định';
      case 'waiting': return 'Đang thực hiện';
      case 'processing': return 'Đang xử lý';
      case 'has_result': return 'Đã có kết quả';
      case 'evaluated': return 'Bác sĩ đã xem';
      case 'canceled': return 'Đã hủy';
      default: return status;
    }
  };

  const currentDateTime = dayjs().format('DD/MM/YYYY HH:mm');
  
  // Xử lý dữ liệu phức tạp do có thể JSON bị lưu nhầm trường hoặc cấu trúc lồng nhau
  let parsedDetails: any[] = [];
  let doctorNotesString = testRecord?.notes || '';
  
  if (testRecord) {
    // Thử parse notes xem có phải là chuỗi JSON chứa kết quả chi tiết không
    if (testRecord.notes && typeof testRecord.notes === 'string' && testRecord.notes.trim().startsWith('{')) {
      try {
        const parsedNotes = JSON.parse(testRecord.notes);
        if (parsedNotes.indices && Array.isArray(parsedNotes.indices)) {
          // Lấy danh sách chỉ số từ indices
          parsedDetails = parsedNotes.indices;
          doctorNotesString = parsedNotes.doctorNote || '';
        }
      } catch (e) {
        // Parse lỗi thì bỏ qua, giữ nguyên notes
      }
    }
    
    // Nếu parsedDetails vẫn rỗng, thử parse từ testsDetail (fallback)
    if (parsedDetails.length === 0 && testRecord.testsDetail) {
      const details = typeof testRecord.testsDetail === 'string' ? JSON.parse(testRecord.testsDetail) : testRecord.testsDetail;
      if (Array.isArray(details) && details.length > 0 && details[0].result !== undefined) {
         parsedDetails = details;
      }
    }
  }

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans text-slate-800 overflow-hidden print:bg-white print:block">
      <div className="print:hidden h-full flex w-full">
        <Sidebar />
        <main className="flex-1 flex flex-col h-screen overflow-hidden">
          
          {/* TOP HEADER */}
          <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 z-10 shadow-sm">
            <div className="flex items-center gap-6">
              <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <TestTube className="text-blue-600"/> Chi tiết Phiếu Xét nghiệm
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
            ) : testRecord && (
              <div className="max-w-4xl mx-auto space-y-6">
                
                <div className="flex items-center justify-between mb-2">
                  <Link href="/admin/lab-tests" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold transition-colors">
                    <ArrowLeft size={20}/> Quay lại danh sách
                  </Link>
                  
                  <div className="flex gap-3">
                    <button onClick={handlePrint} className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl font-bold transition flex items-center gap-2 text-sm border border-slate-200">
                      <Printer size={16}/> In kết quả
                    </button>
                    <button onClick={handleExport} className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl font-bold transition flex items-center gap-2 text-sm border border-blue-200">
                      <Download size={16}/> Xuất PDF
                    </button>
                  </div>
                </div>

                {/* CARD THÔNG TIN */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  
                  {/* HEADER HỒ SƠ */}
                  <div className="bg-slate-50 border-b border-slate-200 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                      <h2 className="text-sm font-medium text-slate-500 mb-1 tracking-wider uppercase">Phiếu Xét nghiệm</h2>
                      <div className="text-2xl font-black text-slate-900 mb-2">XN-{String(testRecord.id).padStart(5, '0')}</div>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        Thực hiện: <span className="font-bold text-slate-700">{dayjs(testRecord.date).format('DD/MM/YYYY HH:mm')}</span>
                      </div>
                    </div>
                    <div className={`px-4 py-2 rounded-xl font-bold border ${getStatusBadge(testRecord.statusType)} flex items-center gap-2`}>
                      Trạng thái: {translateStatus(testRecord.statusType)}
                    </div>
                  </div>

                  <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-slate-100">
                    {/* Thông tin Bệnh nhân */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2"><User size={16}/> Bệnh nhân</h3>
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <p className="font-bold text-lg text-slate-900 mb-1">{testRecord.patient?.fullName}</p>
                        <p className="text-sm text-slate-600">
                          Mã BN: {testRecord.patient?.patientProfile?.patientCode || 'N/A'} <br/>
                          Ngày sinh: {testRecord.patient?.dob || 'N/A'} - Giới tính: {testRecord.patient?.gender || 'N/A'}
                        </p>
                      </div>
                    </div>

                    {/* Thông tin Bác sĩ */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2"><Stethoscope size={16}/> Bác sĩ chỉ định</h3>
                      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                        <p className="font-bold text-lg text-blue-900 mb-1">BS. {testRecord.doctorName}</p>
                        <p className="text-sm text-blue-700">Chỉ định thực hiện xét nghiệm</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-8 border-b border-slate-100">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2"><Beaker size={16}/> Loại xét nghiệm</h3>
                    <p className="text-lg font-bold text-blue-700 bg-blue-50 p-4 rounded-xl border border-blue-100 inline-block">
                      {testRecord.testName}
                    </p>
                  </div>

                  {/* DANH SÁCH CHỈ SỐ */}
                  <div className="p-8 border-b border-slate-100">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Kết quả chi tiết</h3>
                    
                    {parsedDetails && parsedDetails.length > 0 ? (
                      <div className="overflow-x-auto rounded-xl border border-slate-200">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-xs">
                            <tr>
                              <th className="px-6 py-4">Chỉ số xét nghiệm</th>
                              <th className="px-6 py-4">Kết quả</th>
                              <th className="px-6 py-4">Khoảng tham chiếu</th>
                              <th className="px-6 py-4">Đơn vị</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {parsedDetails.map((item: any, index: number) => {
                              const isAbnormal = item.status && item.status !== 'normal';
                              const reference = item.reference || (item.min && item.max ? `${item.min} - ${item.max}` : '');
                              return (
                                <tr key={index} className="hover:bg-slate-50">
                                  <td className="px-6 py-4 font-bold text-slate-900">{item.name}</td>
                                  <td className={`px-6 py-4 font-black text-lg ${isAbnormal ? 'text-red-600' : 'text-slate-900'}`}>{item.result}</td>
                                  <td className="px-6 py-4 text-slate-600">{reference}</td>
                                  <td className="px-6 py-4 text-slate-500">{item.unit}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 font-medium">
                        <p className="mb-2">Kết quả tổng quát:</p>
                        <p className="text-lg font-bold text-slate-900">{testRecord.result || 'Chưa có kết quả'}</p>
                      </div>
                    )}
                  </div>
                  
                  {/* KẾT LUẬN / GHI CHÚ */}
                  {doctorNotesString && (
                    <div className="p-8 border-b border-slate-100">
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Kết luận / Đánh giá</h3>
                      <p className="text-slate-800 bg-amber-50 p-4 rounded-xl border border-amber-100 font-medium leading-relaxed">
                        {doctorNotesString}
                      </p>
                    </div>
                  )}

                  {/* HÀNH ĐỘNG CỦA ADMIN */}
                  <div className="bg-slate-50 p-6 flex flex-wrap items-center justify-between gap-4">
                    <div className="text-sm text-slate-500 font-medium">Thao tác dành cho Quản trị viên:</div>
                    <div className="flex gap-3">
                      
                      {['waiting', 'processing', 'Đang xử lý', 'Đang thực hiện'].includes(testRecord.statusType) && (
                        <button 
                          onClick={() => handleStatusChange('has_result')}
                          className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-bold shadow hover:bg-emerald-700 transition flex items-center gap-2"
                        >
                          <Check size={18}/> Xác nhận Đã Có Kết Quả
                        </button>
                      )}

                      {!['has_result', 'evaluated', 'canceled', 'Đã có kết quả', 'Bác sĩ đã xem', 'Đã hủy'].includes(testRecord.statusType) && (
                        <button 
                          onClick={() => handleStatusChange('canceled')}
                          className="px-6 py-2.5 bg-white border border-red-200 text-red-600 rounded-xl font-bold hover:bg-red-50 transition flex items-center gap-2"
                        >
                          <XCircle size={18}/> Hủy phiếu
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
        {testRecord && (
          <div className="space-y-6">
            <div className="text-center mb-8 border-b-2 border-black pb-4">
              <h1 className="text-2xl font-black uppercase">Phòng Khám AdminPro</h1>
              <h2 className="text-xl font-bold mt-2 uppercase">PHIẾU KẾT QUẢ XÉT NGHIỆM</h2>
              <p className="mt-1">Mã XN: XN-{String(testRecord.id).padStart(5, '0')}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p><strong>Bệnh nhân:</strong> {testRecord.patient?.fullName}</p>
                <p><strong>Mã BN:</strong> {testRecord.patient?.patientProfile?.patientCode}</p>
                <p><strong>Ngày sinh:</strong> {testRecord.patient?.dob}</p>
                <p><strong>Giới tính:</strong> {testRecord.patient?.gender}</p>
              </div>
              <div>
                <p><strong>Ngày thực hiện:</strong> {dayjs(testRecord.date).format('DD/MM/YYYY HH:mm')}</p>
                <p><strong>Bác sĩ chỉ định:</strong> {testRecord.doctorName}</p>
                <p><strong>Loại xét nghiệm:</strong> {testRecord.testName}</p>
              </div>
            </div>

            {parsedDetails && parsedDetails.length > 0 ? (
              <div className="mt-8">
                <h3 className="font-bold border-b border-black mb-2 uppercase">Kết quả chi tiết</h3>
                <table className="w-full text-left mt-2 border-collapse border border-black text-sm">
                  <thead>
                    <tr>
                      <th className="border border-black p-2">Chỉ số xét nghiệm</th>
                      <th className="border border-black p-2">Kết quả</th>
                      <th className="border border-black p-2">Khoảng tham chiếu</th>
                      <th className="border border-black p-2">Đơn vị</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedDetails.map((item: any, i2: number) => {
                      const reference = item.reference || (item.min && item.max ? `${item.min} - ${item.max}` : '');
                      return (
                        <tr key={i2}>
                          <td className="border border-black p-2 font-bold">{item.name}</td>
                          <td className="border border-black p-2 text-lg">{item.result}</td>
                          <td className="border border-black p-2">{reference}</td>
                          <td className="border border-black p-2">{item.unit}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="mt-8">
                <h3 className="font-bold border-b border-black mb-2 uppercase">Kết quả</h3>
                <p className="mt-2 text-lg">{testRecord.result}</p>
              </div>
            )}
            
            {doctorNotesString && (
              <div className="mt-6">
                <h3 className="font-bold border-b border-black mb-2 uppercase">Kết luận / Đánh giá</h3>
                <p className="mt-2 italic">{doctorNotesString}</p>
              </div>
            )}
            
            <div className="mt-16 flex justify-between">
              <div className="text-center">
                <p><strong>BÁC SĨ CHỈ ĐỊNH</strong></p>
                <p className="mt-16">{testRecord.doctorName}</p>
              </div>
              <div className="text-center">
                <p>Ngày ..... Tháng ..... Năm 2026</p>
                <p className="font-bold mt-2">NGƯỜI THỰC HIỆN</p>
                <p className="mt-16">(Ký & ghi rõ họ tên)</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
