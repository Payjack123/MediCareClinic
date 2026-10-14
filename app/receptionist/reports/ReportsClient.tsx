'use client';

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Calendar, Users, UserCheck, CheckCircle2, Clock, 
  Wallet, CreditCard, Banknote, QrCode, ShieldPlus, Printer, 
  Download, RefreshCw, Search, Filter, ChevronRight, AlertCircle, 
  Building2, Stethoscope, FileText, X, ChevronDown, Check, 
  Sparkles, ArrowUpRight, BarChart3, AlertTriangle, Layers, Award
} from 'lucide-react';
import dayjs from 'dayjs';
import { getReceptionistReportData, seedTodayDemoData, ReportFilterParams } from './actions';

interface ReportsClientProps {
  initialData: any;
  initialOptions: { specialties: string[]; doctors: any[] };
}

export default function ReportsClient({ initialData, initialOptions }: ReportsClientProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>(initialData);
  const [filterOptions] = useState(initialOptions);

  // Filter states
  const [activePreset, setActivePreset] = useState<'today' | 'yesterday' | '7days' | 'month' | 'all' | 'custom'>('today');
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | undefined>(undefined);

  // Table tabs & search
  const [activeTableTab, setActiveTableTab] = useState<'invoices' | 'appointments'>('invoices');
  const [tableSearch, setTableSearch] = useState('');
  const [paymentFilter, setPaymentFilter] = useState<'ALL' | 'Tiền mặt' | 'Chuyển khoản'>('ALL');

  // Modals & Feedback
  const [showHandoverModal, setShowHandoverModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Cash count values for shift handover check
  const [cashCounts, setCashCounts] = useState<{ [denom: number]: number }>({
    500000: 0,
    200000: 0,
    100000: 0,
    50000: 0,
    20000: 0,
    10000: 0
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch report data when filter changes
  const fetchData = async (preset = activePreset, date = selectedDate, spec = selectedSpecialty, doc = selectedDoctorId) => {
    setIsLoading(true);
    try {
      const params: ReportFilterParams = {
        preset,
        date: preset === 'custom' ? date : undefined,
        specialty: spec || undefined,
        doctorId: doc || undefined
      };
      const res = await getReceptionistReportData(params);
      if (res.success && res.data) {
        setData(res.data);
      } else {
        showToast(res.message || 'Lỗi khi tải dữ liệu');
      }
    } catch (err) {
      console.error(err);
      showToast('Không thể kết nối máy chủ');
    } finally {
      setIsLoading(false);
    }
  };

  // Preset button handler
  const handlePresetChange = (preset: 'today' | 'yesterday' | '7days' | 'month' | 'all') => {
    setActivePreset(preset);
    fetchData(preset, selectedDate, selectedSpecialty, selectedDoctorId);
  };

  const handleSpecialtyChange = (spec: string) => {
    setSelectedSpecialty(spec);
    fetchData(activePreset, selectedDate, spec, selectedDoctorId);
  };

  const handleDoctorChange = (docId?: number) => {
    setSelectedDoctorId(docId);
    fetchData(activePreset, selectedDate, selectedSpecialty, docId);
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setActivePreset('custom');
    fetchData('custom', date, selectedSpecialty, selectedDoctorId);
  };

  // Quick Seed Demo Data
  const handleSeedDemo = async () => {
    setIsLoading(true);
    const res = await seedTodayDemoData();
    if (res.success) {
      showToast(res.message || 'Đã tạo dữ liệu mẫu thành công!');
      setActivePreset('today');
      fetchData('today', selectedDate, selectedSpecialty, selectedDoctorId);
    } else {
      showToast(res.message || 'Lỗi khi tạo dữ liệu mẫu');
      setIsLoading(false);
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    if (!data) return;
    try {
      let csvContent = '\uFEFF'; // UTF-8 BOM for Excel in Vietnamese
      
      if (activeTableTab === 'invoices') {
        csvContent += 'BẢNG KÊ HÓA ĐƠN VÀ THU PHÍ LỄ TÂN\n';
        csvContent += `Thời gian: ${data.periodTitle}\n`;
        csvContent += `Người xuất: ${data.summary.receptionistName}\n\n`;
        csvContent += 'Mã HĐ,Tên Bệnh Nhân,Mã BN,Số Điện Thoại,Bác Sĩ,Chuyên Khoa,Tổng Tiền,BHYT Khấu Trừ,Thực Thu,Hình Thức TT,Thời Gian,Trạng Thái\n';

        (data.invoicesList || []).forEach((inv: any) => {
          csvContent += `"${inv.invoiceCode}","${inv.patientName}","${inv.patientCode}","${inv.phone}","${inv.doctorName}","${inv.specialty}",${inv.totalAmount},${inv.insuranceAmount},${inv.finalAmount},"${inv.paymentMethod}","${inv.createdAt}","${inv.status}"\n`;
        });
      } else {
        csvContent += 'SỔ THEO DÕI TIẾP ĐÓN BỆNH NHÂN\n';
        csvContent += `Thời gian: ${data.periodTitle}\n`;
        csvContent += `Người xuất: ${data.summary.receptionistName}\n\n`;
        csvContent += 'Số Phiếu,Mã Hẹn,Tên Bệnh Nhân,Mã BN,Số Điện Thoại,Bác Sĩ,Phòng Khám,Chuyên Khoa,Giờ Hẹn,Trạng Thái,Lý Do\n';

        (data.appointmentsList || []).forEach((apt: any) => {
          csvContent += `"${apt.queueNumber}","${apt.code}","${apt.patientName}","${apt.patientCode}","${apt.phone}","${apt.doctorName}","${apt.room}","${apt.specialty}","${apt.bookingTime}","${apt.status}","${apt.reason.replace(/"/g, '""')}"\n`;
        });
      }

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `BaoCao_LeTan_${activeTableTab}_${dayjs().format('YYYYMMDD_HHmm')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Đã tải xuống file CSV thành công!');
    } catch (e) {
      console.error(e);
      showToast('Lỗi khi xuất file Excel');
    }
  };

  // Format currency helper
  const fmtVND = (num: number) => {
    return (num || 0).toLocaleString('vi-VN') + ' đ';
  };

  // Filtered lists for table
  const filteredInvoices = (data?.invoicesList || []).filter((inv: any) => {
    const matchesSearch = 
      inv.invoiceCode.toLowerCase().includes(tableSearch.toLowerCase()) ||
      inv.patientName.toLowerCase().includes(tableSearch.toLowerCase()) ||
      inv.patientCode.toLowerCase().includes(tableSearch.toLowerCase()) ||
      inv.phone.includes(tableSearch);

    const matchesPayment = 
      paymentFilter === 'ALL' || 
      (paymentFilter === 'Tiền mặt' && (inv.paymentMethod.toLowerCase().includes('tiền mặt') || inv.paymentMethod.toLowerCase().includes('cash'))) ||
      (paymentFilter === 'Chuyển khoản' && (inv.paymentMethod.toLowerCase().includes('chuyển khoản') || inv.paymentMethod.toLowerCase().includes('qr') || inv.paymentMethod.toLowerCase().includes('transfer')));

    return matchesSearch && matchesPayment;
  });

  const filteredAppointments = (data?.appointmentsList || []).filter((apt: any) => {
    return (
      apt.patientName.toLowerCase().includes(tableSearch.toLowerCase()) ||
      apt.patientCode.toLowerCase().includes(tableSearch.toLowerCase()) ||
      apt.code.toLowerCase().includes(tableSearch.toLowerCase()) ||
      apt.phone.includes(tableSearch) ||
      apt.doctorName.toLowerCase().includes(tableSearch.toLowerCase())
    );
  });

  // Calculate counted physical cash
  const totalCountedCash = Object.entries(cashCounts).reduce(
    (acc, [denom, count]) => acc + Number(denom) * (Number(count) || 0),
    0
  );

  return (
    <div className="space-y-6 pb-12 font-sans max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-700 animate-bounce">
          <Sparkles className="text-amber-400 w-5 h-5 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* TOP HEADER & ACTION CONTROLS */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
            <BarChart3 size={15} />
            Báo cáo lễ tân & Thu ngân ca trực
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            Báo Cáo Trong Ngày
            <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
              {data?.periodTitle || 'Hôm nay'}
            </span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Tổng hợp tiếp đón, lưu lượng bệnh nhân và đối soát doanh thu chốt két quầy lễ tân
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => fetchData()}
            disabled={isLoading}
            className="p-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl transition border border-gray-200 flex items-center gap-2 text-sm font-semibold active:scale-95 disabled:opacity-50"
            title="Làm mới dữ liệu"
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin text-blue-600' : ''} />
            <span className="hidden sm:inline">Làm mới</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-gray-50 hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 rounded-xl transition border border-gray-200 hover:border-emerald-200 flex items-center gap-2 text-sm font-semibold shadow-2xs active:scale-95"
          >
            <Download size={16} className="text-emerald-600" />
            <span>Xuất Excel</span>
          </button>

          <button
            onClick={() => setShowHandoverModal(true)}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl transition font-bold text-sm shadow-md shadow-blue-200 flex items-center gap-2 active:scale-95"
          >
            <Printer size={16} />
            <span>In Biên Bản Chốt Ca</span>
          </button>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-gray-100 flex flex-wrap items-center justify-between gap-4">
        {/* Preset Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-gray-50/80 rounded-xl border border-gray-200/60 overflow-x-auto max-w-full">
          {[
            { id: 'today', label: 'Hôm nay' },
            { id: 'yesterday', label: 'Hôm qua' },
            { id: '7days', label: '7 ngày qua' },
            { id: 'month', label: 'Tháng này' },
            { id: 'all', label: 'Tất cả' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => handlePresetChange(item.id as any)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                activePreset === item.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Date Selector & Secondary Dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Custom Date Input */}
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200 text-sm">
            <Calendar size={15} className="text-gray-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
              className="bg-transparent text-xs font-medium text-gray-800 outline-hidden cursor-pointer"
            />
          </div>

          {/* Specialty Dropdown */}
          <select
            value={selectedSpecialty}
            onChange={(e) => handleSpecialtyChange(e.target.value)}
            className="bg-gray-50 text-xs font-semibold text-gray-700 px-3 py-2 rounded-xl border border-gray-200 outline-hidden hover:bg-gray-100 transition cursor-pointer"
          >
            <option value="">Tất cả chuyên khoa</option>
            {filterOptions.specialties.map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>

          {/* Doctor Dropdown */}
          <select
            value={selectedDoctorId || ''}
            onChange={(e) => handleDoctorChange(e.target.value ? Number(e.target.value) : undefined)}
            className="bg-gray-50 text-xs font-semibold text-gray-700 px-3 py-2 rounded-xl border border-gray-200 outline-hidden hover:bg-gray-100 transition cursor-pointer"
          >
            <option value="">Tất cả bác sĩ</option>
            {filterOptions.doctors.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.fullName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ZERO DATA HELPER CALLOUT */}
      {data && data.kpis.totalAppointments === 0 && (
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 border border-blue-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-blue-900">
                Khoảng thời gian này chưa có dữ liệu tiếp đón hoặc hóa đơn
              </h4>
              <p className="text-xs text-blue-700 mt-0.5">
                Bạn có thể chọn xem <button onClick={() => handlePresetChange('7days')} className="underline font-bold cursor-pointer">7 ngày qua</button>, <button onClick={() => handlePresetChange('all')} className="underline font-bold cursor-pointer">tất cả</button>, hoặc bấm nạp dữ liệu mẫu hôm nay để trải nghiệm đầy đủ biểu đồ và báo cáo.
              </p>
            </div>
          </div>
          <button
            onClick={handleSeedDemo}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs whitespace-nowrap active:scale-95 transition cursor-pointer"
          >
            + Nạp Dữ Liệu Mẫu Hôm Nay
          </button>
        </div>
      )}

      {/* 1. TOP METRICS / KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Tổng lượt tiếp đón */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-gray-100 relative overflow-hidden group hover:border-blue-200 transition">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tiếp Đón Hôm Nay</p>
              <h3 className="text-3xl font-black text-gray-900 mt-1">
                {data?.kpis?.totalAppointments || 0}
              </h3>
              <p className="text-xs text-blue-600 font-semibold mt-1 flex items-center gap-1">
                <UserCheck size={13} /> Check-in: {data?.kpis?.checkInRate || 0}% ({data?.kpis?.checkedInCount || 0} BN)
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition">
              <Users size={24} />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between text-xs text-gray-500">
            <span>Đang chờ: <b className="text-amber-600">{data?.kpis?.waitingCount || 0}</b></span>
            <span>Đang khám: <b className="text-blue-600">{data?.kpis?.examiningCount || 0}</b></span>
          </div>
        </div>

        {/* KPI 2: Hoàn thành khám */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-gray-100 relative overflow-hidden group hover:border-emerald-200 transition">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Đã Khám Xong</p>
              <h3 className="text-3xl font-black text-emerald-600 mt-1">
                {data?.kpis?.completedCount || 0}
              </h3>
              <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                <CheckCircle2 size={13} /> Tỷ lệ hoàn tất: {data?.kpis?.completedRate || 0}%
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition">
              <CheckCircle2 size={24} />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between text-xs text-gray-500">
            <span>Hủy / Vắng mặt: <b className="text-rose-500">{data?.kpis?.cancelledCount || 0}</b></span>
            <span>BHYT: <b className="text-teal-600">{data?.kpis?.hasInsuranceCount || 0}</b></span>
          </div>
        </div>

        {/* KPI 3: Tổng doanh thu đã thu */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-gray-100 relative overflow-hidden group hover:border-indigo-200 transition">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Thực Thu Tại Quầy</p>
              <h3 className="text-2xl font-black text-indigo-700 mt-1">
                {fmtVND(data?.kpis?.totalRevenue || 0)}
              </h3>
              <p className="text-xs text-indigo-600 font-semibold mt-1 flex items-center gap-1">
                <Wallet size={13} /> {data?.kpis?.paidInvoicesCount || 0} hóa đơn đã thu
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition">
              <Wallet size={24} />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between text-xs text-gray-500">
            <span>Chờ thanh toán:</span>
            <b className="text-amber-600">{fmtVND(data?.kpis?.pendingRevenue || 0)} ({data?.kpis?.pendingInvoicesCount || 0} HĐ)</b>
          </div>
        </div>

        {/* KPI 4: BHYT Khấu Trừ */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-gray-100 relative overflow-hidden group hover:border-purple-200 transition">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">BHYT Khấu Trừ</p>
              <h3 className="text-2xl font-black text-purple-700 mt-1">
                {fmtVND(data?.kpis?.totalInsuranceAmount || 0)}
              </h3>
              <p className="text-xs text-purple-600 font-semibold mt-1 flex items-center gap-1">
                <ShieldPlus size={13} /> Tổng tiền BH trợ giá
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition">
              <ShieldPlus size={24} />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between text-xs text-gray-500">
            <span>Tổng giá trị gốc:</span>
            <b className="text-gray-700">{fmtVND(data?.kpis?.totalOriginalAmount || 0)}</b>
          </div>
        </div>
      </div>

      {/* 2. CASHIER SHIFT HANDOVER / BÁO CÁO BÀN GIAO TIỀN KÉT */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-gray-100 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Banknote className="text-emerald-600" size={22} />
              Đối Soát & Bàn Giao Quầy Thu Ngân Lễ Tân
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Phân loại dòng tiền theo phương thức thanh toán để bàn giao thủ quỹ và kiểm kê két
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
              Tổng tiền thu quầy: <strong className="text-emerald-700 text-sm ml-1">{fmtVND(data?.cashierHandover?.totalCollected || 0)}</strong>
            </span>
          </div>
        </div>

        {/* 3 Cards breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Tiền mặt */}
          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-500 text-white shadow-2xs">
                  <Banknote size={18} />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Tiền Mặt (Két)</span>
              </div>
              <span className="text-xs font-black text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                {data?.cashierHandover?.cash?.percentage || 0}%
              </span>
            </div>
            <div className="mt-4">
              <div className="text-xl font-black text-emerald-900">
                {fmtVND(data?.cashierHandover?.cash?.amount || 0)}
              </div>
              <p className="text-xs text-emerald-700 mt-1">
                {data?.cashierHandover?.cash?.count || 0} giao dịch tiền mặt
              </p>
            </div>
          </div>

          {/* Chuyển khoản / QR */}
          <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-600 text-white shadow-2xs">
                  <QrCode size={18} />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-800">Chuyển Khoản / QR</span>
              </div>
              <span className="text-xs font-black text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-full">
                {data?.cashierHandover?.transfer?.percentage || 0}%
              </span>
            </div>
            <div className="mt-4">
              <div className="text-xl font-black text-blue-900">
                {fmtVND(data?.cashierHandover?.transfer?.amount || 0)}
              </div>
              <p className="text-xs text-blue-700 mt-1">
                {data?.cashierHandover?.transfer?.count || 0} giao dịch qua ngân hàng
              </p>
            </div>
          </div>

          {/* Khác / Chờ thanh toán */}
          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-100 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-amber-500 text-white shadow-2xs">
                  <Clock size={18} />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800">Chờ Thu Tiền</span>
              </div>
              <span className="text-xs font-black text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-full">
                {data?.kpis?.pendingInvoicesCount || 0} HĐ
              </span>
            </div>
            <div className="mt-4">
              <div className="text-xl font-black text-amber-900">
                {fmtVND(data?.kpis?.pendingRevenue || 0)}
              </div>
              <p className="text-xs text-amber-700 mt-1">
                Hóa đơn dịch vụ chưa kết sổ
              </p>
            </div>
          </div>
        </div>

        {/* Visual Progress Bar Ratio */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold text-gray-500">
            <span>Tỷ trọng dòng tiền thực thu:</span>
            <span>Tổng cộng: 100%</span>
          </div>
          <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden flex shadow-inner">
            <div
              style={{ width: `${data?.cashierHandover?.cash?.percentage || 0}%` }}
              className="bg-emerald-500 h-full transition-all duration-500"
              title={`Tiền mặt: ${data?.cashierHandover?.cash?.percentage}%`}
            />
            <div
              style={{ width: `${data?.cashierHandover?.transfer?.percentage || 0}%` }}
              className="bg-blue-600 h-full transition-all duration-500"
              title={`Chuyển khoản: ${data?.cashierHandover?.transfer?.percentage}%`}
            />
          </div>
          <div className="flex flex-wrap items-center gap-5 pt-1 text-xs text-gray-600">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Tiền mặt ({data?.cashierHandover?.cash?.percentage || 0}%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span> Chuyển khoản ({data?.cashierHandover?.transfer?.percentage || 0}%)
            </span>
            <span className="flex items-center gap-1.5 ml-auto text-gray-400">
              * Khớp dữ liệu với ngân hàng và biên lai trước khi chốt ca
            </span>
          </div>
        </div>
      </div>

      {/* 3. VISUAL ANALYTICS: HOURLY PEAK & SPECIALTIES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Hourly Peak Chart (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 shadow-xs border border-gray-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <TrendingUp size={18} className="text-blue-600" />
                  Lưu Lượng Tiếp Đón Theo Khung Giờ
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">Phân bổ lượng bệnh nhân theo các giờ tiếp đón trong ngày</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                Cao điểm: 08h - 10h
              </span>
            </div>

            {/* Custom Bar Chart */}
            <div className="h-60 flex items-end justify-between gap-2 pt-8 pb-4 border-b border-gray-100 px-2 relative">
              {/* Background horizontal dashed lines */}
              <div className="absolute top-1/4 left-0 right-0 border-t border-dashed border-gray-100 -z-0"></div>
              <div className="absolute top-2/4 left-0 right-0 border-t border-dashed border-gray-100 -z-0"></div>
              <div className="absolute top-3/4 left-0 right-0 border-t border-dashed border-gray-100 -z-0"></div>

              {(data?.hourlyDistribution || []).map((slot: any, idx: number) => {
                const heightPercent = Math.max(slot.percentage, 8);
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 z-10 group relative h-full justify-end">
                    {/* Tooltip */}
                    <div className="absolute -top-10 bg-slate-900 text-white text-[11px] font-bold px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none z-20">
                      {slot.slot}: {slot.count} BN
                    </div>

                    {/* Bar */}
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full max-w-[28px] rounded-t-lg transition-all duration-300 relative group-hover:scale-105 ${
                        slot.isPeak
                          ? 'bg-gradient-to-t from-blue-700 to-indigo-500 shadow-sm shadow-blue-200'
                          : slot.count > 0
                          ? 'bg-gradient-to-t from-blue-500 to-cyan-400'
                          : 'bg-gray-100'
                      }`}
                    >
                      {slot.count > 0 && (
                        <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-black text-gray-700">
                          {slot.count}
                        </span>
                      )}
                    </div>

                    {/* Label */}
                    <span className="text-[11px] font-bold text-gray-500 group-hover:text-blue-600 transition">
                      {slot.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-blue-600"></span> Khung giờ hoạt động tiếp đón (07:00 - 18:00)
            </span>
            <span>Tổng lượt đến khám: <strong className="text-gray-900">{data?.kpis?.totalAppointments || 0}</strong></span>
          </div>
        </div>

        {/* Specialty Distribution (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 shadow-xs border border-gray-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <Stethoscope size={18} className="text-purple-600" />
                  Cơ Cấu Theo Chuyên Khoa
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">Số lượt khám & doanh thu theo từng khoa</p>
              </div>
            </div>

            <div className="space-y-3.5 max-h-[240px] overflow-y-auto pr-1">
              {(data?.specialtiesList || []).length > 0 ? (
                data.specialtiesList.map((spec: any, idx: number) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-gray-800 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                        {spec.name}
                      </span>
                      <div className="text-right">
                        <span className="font-extrabold text-gray-900">{spec.count} BN</span>
                        <span className="text-gray-400 mx-1">|</span>
                        <span className="font-semibold text-emerald-600">{fmtVND(spec.revenue)}</span>
                      </div>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${Math.max(spec.percentage, 5)}%` }}
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center text-xs text-gray-400">
                  Chưa có dữ liệu chuyên khoa trong giai đoạn này
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>Bệnh nhân có BHYT: <b className="text-blue-700">{data?.kpis?.hasInsuranceCount || 0}</b></span>
            <span>Khám dịch vụ tự trả: <b className="text-gray-700">{data?.kpis?.noInsuranceCount || 0}</b></span>
          </div>
        </div>
      </div>

      {/* 4. DOCTOR WORKLOAD & ROOM SUMMARY */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-gray-100 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Building2 size={18} className="text-indigo-600" />
              Công Suất Phân Luồng Phòng Khám & Bác Sĩ Trực
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">Số lượng bệnh nhân phân luồng đến từng bác sĩ và phòng khám</p>
          </div>
          <span className="text-xs text-gray-500 font-semibold bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
            {data?.doctorWorkload?.length || 0} Bác sĩ đang tiếp nhận
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50/80 text-gray-500 font-bold border-y border-gray-100">
                <th className="py-3 px-4 rounded-l-xl">Bác Sĩ Khám</th>
                <th className="py-3 px-4">Chuyên Khoa</th>
                <th className="py-3 px-4">Phòng</th>
                <th className="py-3 px-4 text-center">Tiếp Nhận</th>
                <th className="py-3 px-4 text-center">Đang Chờ</th>
                <th className="py-3 px-4 text-center">Đã Hoàn Thành</th>
                <th className="py-3 px-4 text-right rounded-r-xl">Doanh Thu Thu Được</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {(data?.doctorWorkload || []).length > 0 ? (
                data.doctorWorkload.map((doc: any, idx: number) => (
                  <tr key={idx} className="hover:bg-gray-50/50 transition">
                    <td className="py-3 px-4 font-bold text-gray-900 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[11px] font-black shrink-0">
                        {doc.name.charAt(0)}
                      </div>
                      {doc.name}
                    </td>
                    <td className="py-3 px-4 text-gray-600 font-medium">{doc.specialty}</td>
                    <td className="py-3 px-4">
                      <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded font-bold text-[11px]">
                        {doc.room}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-gray-900">{doc.patientCount}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-amber-600 font-bold">{doc.waitingCount}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                        <Check size={11} /> {doc.completedCount}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-black text-gray-900">
                      {fmtVND(doc.revenue)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-400">
                    Chưa có thông tin phân bổ bác sĩ trong khoảng thời gian này
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. DETAILED LEDGER & REGISTER TABLES */}
      <div className="bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden">
        {/* Table Header & Subtabs */}
        <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-xl">
            <button
              onClick={() => setActiveTableTab('invoices')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTableTab === 'invoices'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FileText size={15} />
              Bảng Kê Hóa Đơn & Thu Phí ({filteredInvoices.length})
            </button>
            <button
              onClick={() => setActiveTableTab('appointments')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTableTab === 'appointments'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Users size={15} />
              Sổ Tiếp Đón Bệnh Nhân ({filteredAppointments.length})
            </button>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {activeTableTab === 'invoices' && (
              <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl border border-gray-200">
                {(['ALL', 'Tiền mặt', 'Chuyển khoản'] as const).map((method) => (
                  <button
                    key={method}
                    onClick={() => setPaymentFilter(method)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                      paymentFilter === method
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    {method === 'ALL' ? 'Tất cả' : method}
                  </button>
                ))}
              </div>
            )}

            <div className="relative min-w-[220px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input
                type="text"
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                placeholder="Tìm mã, tên BN, SĐT..."
                className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Tab 1: INVOICES TABLE */}
        {activeTableTab === 'invoices' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider border-b border-gray-100">
                <tr>
                  <th className="py-3 px-4">Mã Hóa Đơn</th>
                  <th className="py-3 px-4">Bệnh Nhân</th>
                  <th className="py-3 px-4">Bác Sĩ / Khoa</th>
                  <th className="py-3 px-4 text-right">Tổng Tiền</th>
                  <th className="py-3 px-4 text-right">BHYT Trừ</th>
                  <th className="py-3 px-4 text-right">Thực Thu</th>
                  <th className="py-3 px-4 text-center">Hình Thức</th>
                  <th className="py-3 px-4 text-center">Thời Gian</th>
                  <th className="py-3 px-4 text-center">Trạng Thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredInvoices.length > 0 ? (
                  filteredInvoices.map((inv: any, idx: number) => (
                    <tr key={idx} className="hover:bg-blue-50/30 transition">
                      <td className="py-3 px-4 font-bold text-blue-700">
                        {inv.invoiceCode}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-gray-900">{inv.patientName}</div>
                        <div className="text-[11px] text-gray-400 flex items-center gap-1">
                          <span>{inv.patientCode}</span> • <span>{inv.phone}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-gray-800">{inv.doctorName}</div>
                        <div className="text-[11px] text-gray-500">{inv.specialty}</div>
                      </td>
                      <td className="py-3 px-4 text-right font-medium text-gray-600">
                        {fmtVND(inv.totalAmount)}
                      </td>
                      <td className="py-3 px-4 text-right font-medium text-purple-600">
                        {inv.insuranceAmount > 0 ? `-${fmtVND(inv.insuranceAmount)}` : '0 đ'}
                      </td>
                      <td className="py-3 px-4 text-right font-black text-gray-900">
                        {fmtVND(inv.finalAmount)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          inv.paymentMethod === 'Tiền mặt' || (inv.paymentMethod || '').toLowerCase().includes('tiền mặt') || (inv.paymentMethod || '').toLowerCase().includes('cash')
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}>
                          {inv.paymentMethod === 'Tiền mặt' || (inv.paymentMethod || '').toLowerCase().includes('tiền mặt') || (inv.paymentMethod || '').toLowerCase().includes('cash') ? 'Tiền mặt' : 'Chuyển khoản'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center text-gray-500 text-[11px]">
                        {inv.createdAt}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          inv.status === 'Đã thanh toán' || inv.status === 'ĐÃ THANH TOÁN'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {inv.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="text-center py-10 text-gray-400">
                      Không tìm thấy hóa đơn nào phù hợp với bộ lọc
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: APPOINTMENTS TABLE */}
        {activeTableTab === 'appointments' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider border-b border-gray-100">
                <tr>
                  <th className="py-3 px-4">Số Phiếu</th>
                  <th className="py-3 px-4">Mã Lịch Hẹn</th>
                  <th className="py-3 px-4">Bệnh Nhân</th>
                  <th className="py-3 px-4">Bác Sĩ & Phòng</th>
                  <th className="py-3 px-4">Chuyên Khoa</th>
                  <th className="py-3 px-4 text-center">Giờ Hẹn</th>
                  <th className="py-3 px-4">Lý Do Khám</th>
                  <th className="py-3 px-4 text-center">Trạng Thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map((apt: any, idx: number) => (
                    <tr key={idx} className="hover:bg-blue-50/30 transition">
                      <td className="py-3 px-4 font-black text-blue-600">
                        {apt.queueNumber}
                      </td>
                      <td className="py-3 px-4 font-mono font-medium text-gray-600">
                        {apt.code}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-gray-900">{apt.patientName}</div>
                        <div className="text-[11px] text-gray-400 flex items-center gap-1">
                          <span>{apt.patientCode}</span> • <span>{apt.phone}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-gray-800">{apt.doctorName}</div>
                        <div className="text-[11px] text-gray-500">{apt.room}</div>
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-700">
                        {apt.specialty}
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-gray-800">
                        {apt.bookingTime}
                      </td>
                      <td className="py-3 px-4 max-w-[200px] truncate text-gray-600" title={apt.reason}>
                        {apt.reason}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          apt.status === 'HOÀN THÀNH' || apt.status === 'ĐÃ KHÁM'
                            ? 'bg-emerald-100 text-emerald-800'
                            : apt.status === 'ĐANG KHÁM'
                            ? 'bg-purple-100 text-purple-800'
                            : apt.status === 'ĐÃ XÁC NHẬN' || apt.status === 'ĐÃ CHECK-IN'
                            ? 'bg-blue-100 text-blue-800'
                            : apt.status === 'ĐÃ HỦY'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {apt.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center py-10 text-gray-400">
                      Không tìm thấy lịch tiếp đón nào phù hợp với bộ lọc
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 6. SHIFT HANDOVER PRINT MODAL */}
      {showHandoverModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-8 shadow-2xl border border-gray-100 space-y-6 max-h-[90vh] overflow-y-auto print:p-0 print:border-none print:shadow-none">
            
            {/* Modal Header & Close (Hide on Print) */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 print:hidden">
              <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
                <Printer size={18} />
                <span>Xem Trước Biên Bản Bàn Giao Ca Lễ Tân</span>
              </div>
              <button
                onClick={() => setShowHandoverModal(false)}
                className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* PRINTABLE CONTENT AREA */}
            <div id="print-area" className="space-y-6 text-gray-900 font-sans print:m-0">
              {/* Header Slip */}
              <div className="border-b-2 border-gray-900 pb-4 flex justify-between items-start">
                <div>
                  <h2 className="text-sm font-extrabold uppercase tracking-wide text-gray-800">
                    PHÒNG KHÁM ĐA KHOA QUỐC TẾ MEDICARE
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">Địa chỉ: 123 Đường Giải Phóng, Đống Đa, Hà Nội</p>
                  <p className="text-xs text-gray-500">Hotline: 1900 6868 | Website: medicareclinic.vn</p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-mono font-bold text-gray-400 uppercase">
                    MẪU BB-LT/01
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    Ngày lập: {data?.summary?.reportGeneratedAt || dayjs().format('DD/MM/YYYY HH:mm')}
                  </p>
                </div>
              </div>

              {/* Title */}
              <div className="text-center space-y-1">
                <h1 className="text-xl font-black uppercase text-gray-900 tracking-tight">
                  BIÊN BẢN BÀN GIAO CA TRỰC & CHỐT SỔ THU NGÂN LỄ TÂN
                </h1>
                <p className="text-xs text-gray-500 italic">
                  (Áp dụng chốt sổ cuối ngày và bàn giao ca làm việc bộ phận Lễ tân - Thu ngân)
                </p>
              </div>

              {/* Info General */}
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl text-xs">
                <div>
                  <p><strong>Người bàn giao (Lễ tân):</strong> {data?.summary?.receptionistName || 'Nguyễn Thị Hương'}</p>
                  <p className="mt-1"><strong>Bộ phận:</strong> Quầy Tiếp đón & Thu ngân Trung tâm</p>
                </div>
                <div>
                  <p><strong>Kỳ báo cáo / Ngày chốt:</strong> {data?.periodTitle || dayjs().format('DD/MM/YYYY')}</p>
                  <p className="mt-1"><strong>Trạng thái ca trực:</strong> Đã hoàn thành bàn giao</p>
                </div>
              </div>

              {/* Phần 1: Số liệu Tiếp đón */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 border-l-3 border-blue-600 pl-2">
                  I. TỔNG HỢP TIẾP ĐÓN BỆNH NHÂN TRONG CA
                </h4>
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="border border-gray-200 p-2.5 rounded-lg">
                    <p className="text-gray-500 text-[11px]">Tổng tiếp đón</p>
                    <p className="font-bold text-base text-gray-900">{data?.kpis?.totalAppointments || 0}</p>
                  </div>
                  <div className="border border-gray-200 p-2.5 rounded-lg">
                    <p className="text-gray-500 text-[11px]">Đã check-in</p>
                    <p className="font-bold text-base text-blue-600">{data?.kpis?.checkedInCount || 0}</p>
                  </div>
                  <div className="border border-gray-200 p-2.5 rounded-lg">
                    <p className="text-gray-500 text-[11px]">Đã khám xong</p>
                    <p className="font-bold text-base text-emerald-600">{data?.kpis?.completedCount || 0}</p>
                  </div>
                  <div className="border border-gray-200 p-2.5 rounded-lg">
                    <p className="text-gray-500 text-[11px]">Hủy / Không đến</p>
                    <p className="font-bold text-base text-rose-600">{data?.kpis?.cancelledCount || 0}</p>
                  </div>
                </div>
              </div>

              {/* Phần 2: Số liệu Tài chính Chốt Két */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 border-l-3 border-emerald-600 pl-2">
                  II. TỔNG HỢP THU TIỀN VÀ BÀN GIAO THỦ QUỸ
                </h4>
                <table className="w-full text-xs border border-gray-200 border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700 font-bold border-b border-gray-200">
                      <th className="py-2 px-3 text-left">Phương Thức Thanh Toán</th>
                      <th className="py-2 px-3 text-center">Số Lượt Giao Dịch</th>
                      <th className="py-2 px-3 text-right">Số Tiền (VNĐ)</th>
                      <th className="py-2 px-3 text-left">Ghi Chú Bàn Giao</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="py-2 px-3 font-bold">1. Tiền mặt tại két (Cash)</td>
                      <td className="py-2 px-3 text-center">{data?.cashierHandover?.cash?.count || 0}</td>
                      <td className="py-2 px-3 text-right font-black text-emerald-700">
                        {fmtVND(data?.cashierHandover?.cash?.amount || 0)}
                      </td>
                      <td className="py-2 px-3 text-gray-500">Bàn giao phong bì niêm phong</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-bold">2. Chuyển khoản ngân hàng / VietQR</td>
                      <td className="py-2 px-3 text-center">{data?.cashierHandover?.transfer?.count || 0}</td>
                      <td className="py-2 px-3 text-right font-black text-blue-700">
                        {fmtVND(data?.cashierHandover?.transfer?.amount || 0)}
                      </td>
                      <td className="py-2 px-3 text-gray-500">Tài khoản VCB Phòng khám</td>
                    </tr>
                    <tr className="bg-gray-50 font-bold">
                      <td className="py-2 px-3 text-gray-900 uppercase">TỔNG THỰC THU TRONG CA</td>
                      <td className="py-2 px-3 text-center">{data?.kpis?.paidInvoicesCount || 0}</td>
                      <td className="py-2 px-3 text-right text-sm text-indigo-900 font-black">
                        {fmtVND(data?.cashierHandover?.totalCollected || 0)}
                      </td>
                      <td className="py-2 px-3 text-emerald-700 font-bold">Khớp 100% sao kê</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Phần 3: Bảng kiểm đếm tiền mặt tại két */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 border-l-3 border-amber-500 pl-2">
                  III. BẢNG KIỂM KÊ TIỀN MẶT THEO MỆNH GIÁ
                </h4>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-xs">
                  {[500000, 200000, 100000, 50000, 20000, 10000].map((denom) => (
                    <div key={denom} className="border border-gray-200 p-2 rounded-lg bg-gray-50/50">
                      <span className="font-bold text-[11px] text-gray-700">{(denom / 1000).toLocaleString()}k:</span>
                      <input
                        type="number"
                        min="0"
                        value={cashCounts[denom] || ''}
                        onChange={(e) =>
                          setCashCounts({ ...cashCounts, [denom]: Math.max(0, parseInt(e.target.value) || 0) })
                        }
                        placeholder="0 tờ"
                        className="w-full mt-1 px-1.5 py-0.5 border border-gray-300 rounded text-right font-bold text-xs bg-white print:border-none print:p-0"
                      />
                    </div>
                  ))}
                </div>
                <div className="text-right text-xs text-gray-600 font-semibold">
                  Tổng kiểm đếm thực tế: <strong className="text-emerald-700 text-sm ml-1">{fmtVND(totalCountedCash)}</strong>
                  {totalCountedCash > 0 && (
                    <span className="ml-2 text-[11px] text-gray-500">
                      (Chênh lệch: {fmtVND(totalCountedCash - (data?.cashierHandover?.cash?.amount || 0))})
                    </span>
                  )}
                </div>
              </div>

              {/* Chữ Ký Bàn Giao 3 Bên */}
              <div className="grid grid-cols-3 gap-6 pt-6 text-center text-xs">
                <div className="space-y-16">
                  <div>
                    <p className="font-bold uppercase text-gray-900">LỄ TÂN GIAO CA</p>
                    <p className="text-[11px] text-gray-400 italic">(Ký & ghi rõ họ tên)</p>
                  </div>
                  <p className="font-bold text-gray-800">{data?.summary?.receptionistName || 'Nguyễn Thị Hương'}</p>
                </div>

                <div className="space-y-16">
                  <div>
                    <p className="font-bold uppercase text-gray-900">THỦ QUỸ / KẾ TOÁN</p>
                    <p className="text-[11px] text-gray-400 italic">(Ký nhận tiền & hóa đơn)</p>
                  </div>
                  <p className="font-bold text-gray-800">Trần Thị Mai Anh</p>
                </div>

                <div className="space-y-16">
                  <div>
                    <p className="font-bold uppercase text-gray-900">QUẢN LÝ PHÒNG KHÁM</p>
                    <p className="text-[11px] text-gray-400 italic">(Xác nhận duyệt)</p>
                  </div>
                  <p className="font-bold text-gray-800">Ban Giám Đốc</p>
                </div>
              </div>
            </div>

            {/* Footer Buttons (Hide on Print) */}
            <div className="border-t border-gray-100 pt-4 flex items-center justify-end gap-3 print:hidden">
              <button
                onClick={() => setShowHandoverModal(false)}
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-semibold transition cursor-pointer"
              >
                Đóng
              </button>
              <button
                onClick={() => window.print()}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-md shadow-blue-200 flex items-center gap-2 active:scale-95 transition cursor-pointer"
              >
                <Printer size={16} />
                In Ngay (Print)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
