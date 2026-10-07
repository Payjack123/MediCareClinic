'use client';

import React, { useState } from 'react';
import {
  Search, Plus, Filter, MoreHorizontal, Calendar, Clock, User, Building,
  ActivitySquare, MapPin, X, CheckCircle2, AlertTriangle, Users, Edit, Trash2, ArrowRightLeft, Loader2, CalendarRange
} from 'lucide-react';
import { createDoctorScheduleAction, createWeeklySchedulesAction } from './actions';

export default function CoordinatorAppointmentsClient({ 
  initialSchedules, 
  doctors, 
  clinics, 
  specialties, 
  facilities 
}: any) {
  const [schedules, setSchedules] = useState(initialSchedules);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterDate, setFilterDate] = useState('All');
  const [filterDept, setFilterDept] = useState('All');

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreateWeeklyModalOpen, setIsCreateWeeklyModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null);

  // Form State
  const [createForm, setCreateForm] = useState({
    facilityId: '',
    specialtyId: '',
    doctorId: '',
    date: '',
    time: '',
    clinicId: ''
  });
  
  const [weeklyForm, setWeeklyForm] = useState({
    specialtyId: '',
    doctorId: '',
    clinicId: '',
    time: 'Ca 1 (08:00 - 12:00)',
    startDate: '',
    endDate: '',
    selectedDays: [] as number[], // 1: T2, 2: T3, ..., 0: CN
  });

  const [isChecking, setIsChecking] = useState(false);
  const [createError, setCreateError] = useState('');

  // Lọc dữ liệu cho modal
  const availableClinics = clinics.filter((c: any) => 
    (!createForm.specialtyId || c.specialtyId?.toString() === createForm.specialtyId) ||
    (!weeklyForm.specialtyId || c.specialtyId?.toString() === weeklyForm.specialtyId)
  );

  const availableDoctors = doctors.filter((d: any) => 
    (!createForm.specialtyId || d.specialtyId?.toString() === createForm.specialtyId) ||
    (!weeklyForm.specialtyId || d.specialtyId?.toString() === weeklyForm.specialtyId)
  );

  // Lọc dữ liệu hiển thị trên bảng
  const filteredSchedules = schedules.filter((s: any) => {
    const matchesSearch = s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.room.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'All' || s.status === filterStatus;
    const matchesDept = filterDept === 'All' || s.dept === filterDept;
    
    return matchesSearch && matchesStatus && matchesDept;
  });

  // Handlers
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsChecking(true);
    setCreateError('');

    let timeSlots = [];
    if (createForm.time === 'Ca 1 (08:00 - 12:00)') {
      timeSlots = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30'];
    } else if (createForm.time === 'Ca 2 (13:00 - 17:00)') {
      timeSlots = ['13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'];
    } else {
      timeSlots = [createForm.time];
    }

    const res = await createDoctorScheduleAction({
      doctorId: parseInt(createForm.doctorId),
      clinicId: parseInt(createForm.clinicId),
      date: createForm.date,
      timeSlots: timeSlots,
    });

    setIsChecking(false);

    if (res.success) {
      alert(res.message);
      setIsCreateModalOpen(false);
      window.location.reload(); 
    } else {
      setCreateError(res.message || 'Lỗi không xác định');
    }
  };

  const handleWeeklySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (weeklyForm.selectedDays.length === 0) {
      setCreateError('Vui lòng chọn ít nhất 1 thứ trong tuần!');
      return;
    }
    
    setIsChecking(true);
    setCreateError('');

    // Tính toán danh sách các ngày
    const datesToCreate = [];
    let curr = new Date(weeklyForm.startDate);
    const end = new Date(weeklyForm.endDate);

    while (curr <= end) {
      if (weeklyForm.selectedDays.includes(curr.getDay())) {
        const yyyy = curr.getFullYear();
        const mm = String(curr.getMonth() + 1).padStart(2, '0');
        const dd = String(curr.getDate()).padStart(2, '0');
        datesToCreate.push(`${yyyy}-${mm}-${dd}`);
      }
      curr.setDate(curr.getDate() + 1);
    }

    if (datesToCreate.length === 0) {
      setIsChecking(false);
      setCreateError('Không có ngày nào hợp lệ trong khoảng thời gian đã chọn!');
      return;
    }

    let timeSlots = [];
    if (weeklyForm.time === 'Ca 1 (08:00 - 12:00)') {
      timeSlots = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30'];
    } else {
      timeSlots = ['13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'];
    }

    const res = await createWeeklySchedulesAction({
      doctorId: parseInt(weeklyForm.doctorId),
      clinicId: parseInt(weeklyForm.clinicId),
      dates: datesToCreate,
      timeSlots: timeSlots,
    });

    setIsChecking(false);

    if (res.success) {
      alert(res.message);
      setIsCreateWeeklyModalOpen(false);
      window.location.reload(); 
    } else {
      setCreateError(res.message || 'Lỗi không xác định');
    }
  };

  const toggleDay = (day: number) => {
    if (weeklyForm.selectedDays.includes(day)) {
      setWeeklyForm({ ...weeklyForm, selectedDays: weeklyForm.selectedDays.filter(d => d !== day) });
    } else {
      setWeeklyForm({ ...weeklyForm, selectedDays: [...weeklyForm.selectedDays, day] });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Hoạt động': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Sắp diễn ra': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Đã kết thúc': return 'bg-slate-100 text-slate-600 border-slate-200';
      case 'Đã hủy': return 'bg-red-50 text-red-600 border-red-200';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case 'Hoạt động': return 'bg-emerald-500';
      case 'Sắp diễn ra': return 'bg-amber-500';
      case 'Đã kết thúc': return 'bg-slate-400';
      case 'Đã hủy': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý Lịch Khám</h1>
          <p className="text-gray-500 mt-1 text-sm">Điều phối lịch trực, xếp phòng và theo dõi tình trạng các ca khám</p>
        </div>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={() => { setCreateError(''); setIsCreateWeeklyModalOpen(true); }}
            className="px-4 py-2.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-xl hover:bg-indigo-100 transition-all font-medium flex items-center gap-2"
          >
            <CalendarRange size={18} /> Lập lịch tuần
          </button>
          <button
            onClick={() => { setCreateError(''); setIsCreateModalOpen(true); }}
            className="px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/20 transition-all font-medium flex items-center gap-2"
          >
            <Plus size={18} /> Tạo lịch lẻ
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Tìm bác sĩ, phòng..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select 
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 focus:outline-none focus:border-blue-500 bg-white hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <option value="All">Tất cả khoa</option>
            {specialties.map((sp: any) => (
              <option key={sp.id} value={sp.name}>{sp.name}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 focus:outline-none focus:border-blue-500 bg-white hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <option value="All">Mọi trạng thái</option>
            <option value="Hoạt động">Hoạt động</option>
            <option value="Sắp diễn ra">Sắp diễn ra</option>
            <option value="Đã kết thúc">Đã kết thúc</option>
            <option value="Đã hủy">Đã hủy</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 text-sm">
                <th className="px-6 py-4 font-semibold">Mã Lịch (DB ID)</th>
                <th className="px-6 py-4 font-semibold">Ngày & Ca</th>
                <th className="px-6 py-4 font-semibold">Bác sĩ & Khoa</th>
                <th className="px-6 py-4 font-semibold">Phòng & Cơ sở</th>
                <th className="px-6 py-4 font-semibold">Trạng thái</th>
                <th className="px-6 py-4 font-semibold text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredSchedules.map((schedule: any) => (
                <tr key={schedule.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-6 py-4 font-medium text-gray-800">
                    LK-{schedule.id}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-gray-700 flex items-center gap-1.5"><Calendar size={14} className="text-gray-400" /> {schedule.date}</span>
                      <span className="text-gray-500 flex items-center gap-1.5"><Clock size={14} className="text-blue-400" /> {schedule.time}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1 items-start">
                      <span className="font-bold text-gray-800 flex items-center gap-1.5"><User size={14} className="text-gray-400" /> {schedule.doctor}</span>
                      <span className="text-xs text-blue-600 font-medium px-2 py-0.5 bg-blue-50 rounded-md w-fit">Khoa {schedule.dept}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1 items-start">
                      <div className="flex items-center gap-2 font-semibold text-gray-700">
                        <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center text-gray-600">
                          <Building size={12} />
                        </div>
                        {schedule.room}
                      </div>
                      <span className="text-xs text-gray-500 flex items-center gap-1"><MapPin size={12} /> {schedule.facility}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(schedule.status)}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(schedule.status)}`}></span>
                      {schedule.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => setSelectedSchedule(schedule)}
                      className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-100"
                    >
                      Chi tiết
                    </button>
                  </td>
                </tr>
              ))}

              {filteredSchedules.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <ActivitySquare size={48} className="text-gray-300 mb-3" />
                      <p className="text-base font-medium text-gray-600">Không tìm thấy lịch khám nào</p>
                      <p className="text-sm mt-1">Thử thay đổi bộ lọc hoặc tạo lịch khám mới.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL LẬP LỊCH HÀNG TUẦN */}
      {isCreateWeeklyModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in slide-in-bottom-4 duration-300">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-indigo-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/20">
                  <CalendarRange size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-800">Lập Lịch Tuần (Hàng Loạt)</h3>
                  <p className="text-xs text-slate-500">Tạo nhanh ca trực cho bác sĩ lặp lại theo tuần</p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateWeeklyModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-xl transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleWeeklySubmit} className="p-6">
              
              {createError && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm flex items-center gap-2 border border-red-200">
                  <AlertTriangle size={16} />
                  {createError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-5">
                <div className="col-span-2 sm:col-span-1 space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Chuyên khoa</label>
                  <select
                    required
                    value={weeklyForm.specialtyId}
                    onChange={(e) => setWeeklyForm({ ...weeklyForm, specialtyId: e.target.value, doctorId: '' })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white text-sm"
                  >
                    <option value="">-- Chọn khoa --</option>
                    {specialties.map((s: any) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2 sm:col-span-1 space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Bác sĩ phụ trách</label>
                  <select
                    required
                    value={weeklyForm.doctorId}
                    onChange={(e) => setWeeklyForm({ ...weeklyForm, doctorId: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white text-sm disabled:bg-gray-50"
                    disabled={!weeklyForm.specialtyId}
                  >
                    <option value="">-- Chọn bác sĩ --</option>
                    {availableDoctors.map((d: any) => (
                      <option key={d.userId} value={d.userId}>{d.user.fullName}</option>
                    ))}
                  </select>
                </div>
                
                <div className="col-span-2 space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Phòng trực (Cố định)</label>
                  <select
                    required
                    value={weeklyForm.clinicId}
                    onChange={(e) => setWeeklyForm({ ...weeklyForm, clinicId: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white text-sm disabled:bg-gray-50"
                  >
                    <option value="">-- Chọn phòng --</option>
                    {clinics.map((c: any) => (
                      <option key={c.id} value={c.id}>Phòng {c.roomNumber || c.name} - {c.specialty?.name}</option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2 sm:col-span-1 space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Giai đoạn (Từ ngày)</label>
                  <input
                    type="date"
                    required
                    value={weeklyForm.startDate}
                    onChange={(e) => setWeeklyForm({ ...weeklyForm, startDate: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white text-sm"
                  />
                </div>
                
                <div className="col-span-2 sm:col-span-1 space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Giai đoạn (Đến ngày)</label>
                  <input
                    type="date"
                    required
                    value={weeklyForm.endDate}
                    onChange={(e) => setWeeklyForm({ ...weeklyForm, endDate: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white text-sm"
                  />
                </div>

                <div className="col-span-2 space-y-2">
                  <label className="text-sm font-semibold text-slate-700 flex justify-between items-center">
                    <span>Lặp lại vào các ngày trong tuần</span>
                    <span className="text-xs text-indigo-600 font-medium">Chọn ít nhất 1 ngày</span>
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {[
                      { v: 1, l: 'Thứ 2' }, { v: 2, l: 'Thứ 3' }, { v: 3, l: 'Thứ 4' }, 
                      { v: 4, l: 'Thứ 5' }, { v: 5, l: 'Thứ 6' }, { v: 6, l: 'Thứ 7' }, { v: 0, l: 'CN' }
                    ].map(day => (
                      <button
                        type="button"
                        key={day.v}
                        onClick={() => toggleDay(day.v)}
                        className={`px-3 py-2 text-sm font-medium rounded-lg border transition-all ${
                          weeklyForm.selectedDays.includes(day.v) 
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' 
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {day.l}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="col-span-2 space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Khung giờ trực</label>
                  <select
                    required
                    value={weeklyForm.time}
                    onChange={(e) => setWeeklyForm({ ...weeklyForm, time: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white text-sm"
                  >
                    <option value="Ca 1 (08:00 - 12:00)">Ca 1 (08:00 - 12:00)</option>
                    <option value="Ca 2 (13:00 - 17:00)">Ca 2 (13:00 - 17:00)</option>
                  </select>
                </div>
              </div>

              <div className="mt-8 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setIsCreateWeeklyModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isChecking || !weeklyForm.doctorId || !weeklyForm.clinicId || !weeklyForm.startDate || !weeklyForm.endDate}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/20 rounded-xl transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {isChecking ? <Loader2 size={16} className="animate-spin" /> : 'Tạo hàng loạt'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE SINGLE SCHEDULE MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in slide-in-bottom-4 duration-300">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/20">
                  <Plus size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-800">Tạo Lịch Khám Lẻ (Hàng Ngày)</h3>
                  <p className="text-xs text-slate-500">Bổ sung ca trực lẻ cho bác sĩ vào một ngày cụ thể</p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-xl transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6">
              
              {createError && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm flex items-center gap-2 border border-red-200">
                  <AlertTriangle size={16} />
                  {createError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-5">
                <div className="col-span-2 sm:col-span-1 space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Chuyên khoa</label>
                  <select
                    required
                    value={createForm.specialtyId}
                    onChange={(e) => setCreateForm({ ...createForm, specialtyId: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white text-sm"
                  >
                    <option value="">-- Chọn khoa --</option>
                    {specialties.map((s: any) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2 sm:col-span-1 space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Bác sĩ phụ trách</label>
                  <select
                    required
                    value={createForm.doctorId}
                    onChange={(e) => setCreateForm({ ...createForm, doctorId: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white text-sm disabled:bg-gray-50"
                    disabled={!createForm.specialtyId}
                  >
                    <option value="">-- Chọn bác sĩ --</option>
                    {availableDoctors.map((d: any) => (
                      <option key={d.userId} value={d.userId}>{d.user.fullName}</option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2 sm:col-span-1 space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Ngày làm việc</label>
                  <input
                    type="date"
                    required
                    value={createForm.date}
                    onChange={(e) => setCreateForm({ ...createForm, date: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white text-sm"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1 space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Ca khám</label>
                  <select
                    required
                    value={createForm.time}
                    onChange={(e) => setCreateForm({ ...createForm, time: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white text-sm"
                  >
                    <option value="">-- Chọn ca --</option>
                    <option value="Ca 1 (08:00 - 12:00)">Ca 1 (08:00 - 12:00)</option>
                    <option value="Ca 2 (13:00 - 17:00)">Ca 2 (13:00 - 17:00)</option>
                  </select>
                </div>

                <div className="col-span-2 space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 flex justify-between">
                    Phòng khám
                  </label>
                  <select
                    required
                    value={createForm.clinicId}
                    onChange={(e) => setCreateForm({ ...createForm, clinicId: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white text-sm disabled:bg-gray-50"
                    disabled={!createForm.specialtyId}
                  >
                    <option value="">-- Chọn phòng --</option>
                    {availableClinics.map((c: any) => (
                      <option key={c.id} value={c.id}>Phòng {c.roomNumber || c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Conflict Check area */}
              {createForm.doctorId && createForm.clinicId && createForm.time && createForm.date && (
                <div className="mt-6 p-4 rounded-xl bg-blue-50 border border-blue-100 flex gap-3">
                  <div className="mt-0.5 text-blue-600">
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-blue-800">Sẵn sàng phân công</h4>
                    <p className="text-xs text-blue-700 mt-1">
                      Hệ thống sẽ kiểm tra chi tiết trên server khi bạn bấm Lưu.
                    </p>
                  </div>
                </div>
              )}

              <div className="mt-8 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isChecking || !createForm.doctorId || !createForm.clinicId || !createForm.date}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/20 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isChecking ? <Loader2 size={16} className="animate-spin" /> : 'Lưu ca trực'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {selectedSchedule && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-bottom-4 duration-300">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
              <div>
                <h3 className="font-bold text-xl text-slate-800">Chi Tiết Lịch Khám</h3>
                <p className="text-sm text-slate-500 font-mono mt-1">Mã lịch: LK-{selectedSchedule.id}</p>
              </div>
              <button
                onClick={() => setSelectedSchedule(null)}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-200 p-2 rounded-xl transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar space-y-8">
              {/* General Info Grid ... */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-xs text-slate-500 font-medium mb-1">Cơ sở</p>
                  <p className="font-bold text-slate-800 flex items-center gap-1.5"><MapPin size={14} className="text-red-500" /> {selectedSchedule.facility}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-xs text-slate-500 font-medium mb-1">Chuyên khoa</p>
                  <p className="font-bold text-slate-800 flex items-center gap-1.5"><ActivitySquare size={14} className="text-blue-500" /> {selectedSchedule.dept}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 sm:col-span-2">
                  <p className="text-xs text-slate-500 font-medium mb-1">Bác sĩ phụ trách</p>
                  <p className="font-bold text-slate-800 flex items-center gap-1.5"><User size={14} className="text-indigo-500" /> {selectedSchedule.doctor}</p>
                </div>

                <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 sm:col-span-2">
                  <p className="text-xs text-blue-500 font-medium mb-1">Thời gian</p>
                  <div className="flex items-center gap-3">
                    <p className="font-bold text-blue-900 flex items-center gap-1.5"><Calendar size={14} /> {selectedSchedule.date}</p>
                    <span className="text-blue-300">|</span>
                    <p className="font-bold text-blue-900 flex items-center gap-1.5"><Clock size={14} /> {selectedSchedule.time}</p>
                  </div>
                </div>
                <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-100">
                  <p className="text-xs text-amber-600 font-medium mb-1">Phòng</p>
                  <p className="font-bold text-amber-900 flex items-center gap-1.5"><Building size={14} /> {selectedSchedule.room}</p>
                </div>
                <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
                  <p className="text-xs text-emerald-600 font-medium mb-1">Trạng thái</p>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 mt-0.5 rounded-full text-xs font-bold border ${getStatusColor(selectedSchedule.status)}`}>
                    {selectedSchedule.status}
                  </span>
                </div>
              </div>

              {/* Bookings Section */}
              <div>
                <h4 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                  <Users size={20} className="text-blue-500" />
                  Lịch Hẹn Trong Ca ({selectedSchedule.bookings.length})
                </h4>

                {selectedSchedule.bookings.length > 0 ? (
                  <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                        <tr>
                          <th className="px-4 py-3 font-semibold">Mã Hẹn</th>
                          <th className="px-4 py-3 font-semibold">Bệnh nhân</th>
                          <th className="px-4 py-3 font-semibold">Khung giờ đặt</th>
                          <th className="px-4 py-3 font-semibold">Trạng thái</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {selectedSchedule.bookings.map((booking: any, idx: number) => (
                          <tr key={idx} className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3 font-mono text-slate-500">{booking.id}</td>
                            <td className="px-4 py-3 font-bold text-slate-800">{booking.patient}</td>
                            <td className="px-4 py-3 text-slate-600">{booking.time}</td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium 
                                ${booking.status === 'ĐÃ KHÁM' ? 'bg-slate-100 text-slate-600' :
                                  booking.status === 'CHECKED_IN' ? 'bg-indigo-50 text-indigo-700' : 'bg-amber-50 text-amber-700'}`
                              }>
                                {booking.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-slate-100 border-dashed rounded-2xl p-8 text-center">
                    <p className="text-slate-500 font-medium">Hiện chưa có bệnh nhân nào đặt lịch trong ca này.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer (Actions) */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 shrink-0 flex flex-wrap gap-3 justify-end">
              <button className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-800 rounded-xl transition-colors flex items-center gap-2">
                <Edit size={16} /> Sửa lịch
              </button>
              <button className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 rounded-xl transition-colors flex items-center gap-2">
                <ArrowRightLeft size={16} /> Đổi phòng / Đổi BS
              </button>
              <button className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 hover:bg-red-50 hover:text-red-700 rounded-xl transition-colors flex items-center gap-2">
                <Trash2 size={16} /> Hủy lịch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
