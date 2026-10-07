'use client';

import React, { useState, useMemo } from 'react';
import {
  Building, Search, Filter, Calendar, Clock, ActivitySquare, User,
  CheckCircle2, AlertTriangle, X, Settings2, Edit, Trash2, ArrowRightLeft, ShieldAlert, Loader2
} from 'lucide-react';
import { createDoctorScheduleAction } from '../appointments/actions';
import { changeDoctorScheduleRoomAction, cancelDoctorScheduleAction } from './actions';

export default function CoordinatorRoomsClient({ 
  clinics, 
  todaySchedules, 
  doctors, 
  specialties,
  todayStr 
}: any) {
  const [filterDate, setFilterDate] = useState(todayStr);
  const [filterDept, setFilterDept] = useState('All');
  const [filterDoctor, setFilterDoctor] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Modals
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isChangeRoomModalOpen, setIsChangeRoomModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);

  // Form phân phòng
  const [assignForm, setAssignForm] = useState({
    date: filterDate,
    time: 'Ca 1 (08:00 - 12:00)',
    specialtyId: '',
    doctorId: '',
    clinicId: ''
  });

  // Đổi phòng
  const [newClinicId, setNewClinicId] = useState('');

  // Xử lý dữ liệu bảng (View theo Phòng)
  const roomList = useMemo(() => {
    return clinics.map((clinic: any) => {
      // Nếu view ngày khác todayStr, lý tưởng là phải fetch từ server
      const schedule = filterDate === todayStr 
        ? todaySchedules.find((s: any) => s.clinicId === clinic.id)
        : null;

      let status = 'Trống';
      if (clinic.roomNumber === '205' || clinic.name.includes('205')) {
        status = 'Bảo trì';
      } else if (schedule) {
        status = 'Đã xếp';
      }

      let timeSlotsArr: string[] = [];
      if (schedule?.timeSlots) {
        if (typeof schedule.timeSlots === 'string') {
          try { timeSlotsArr = JSON.parse(schedule.timeSlots); } catch(e) {}
        } else if (Array.isArray(schedule.timeSlots)) {
          timeSlotsArr = schedule.timeSlots;
        }
      }

      return {
        id: clinic.id,
        roomNumber: clinic.roomNumber ? `P${clinic.roomNumber}` : clinic.name,
        type: clinic.type,
        specialty: clinic.specialty?.name || 'Đa khoa',
        status: status,
        scheduleId: schedule?.id || null,
        doctorName: schedule?.doctor?.fullName || '—',
        time: timeSlotsArr.length > 0 ? `${timeSlotsArr[0]} - ${timeSlotsArr[timeSlotsArr.length-1]}` : '—',
        doctorId: schedule?.doctorId || null,
      };
    });
  }, [clinics, todaySchedules, filterDate, todayStr]);

  const filteredRooms = roomList.filter((r: any) => {
    const matchSearch = r.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        r.doctorName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchDept = filterDept === 'All' || r.specialty === filterDept;
    const matchDoctor = filterDoctor === 'All' || r.doctorId?.toString() === filterDoctor;
    const matchStatus = filterStatus === 'All' || r.status === filterStatus;
    return matchSearch && matchDept && matchDoctor && matchStatus;
  });

  // Danh sách phòng trống
  const emptyRooms = roomList.filter((r: any) => r.status === 'Trống');

  // Lọc bác sĩ theo khoa (Modal)
  const availableDoctors = doctors.filter((d: any) => 
    (!assignForm.specialtyId || d.specialtyId?.toString() === assignForm.specialtyId)
  );

  // --- Handlers ---
  const handleAssignSubmit = async () => {
    if (!assignForm.doctorId || !assignForm.clinicId) return alert('Vui lòng chọn đủ thông tin');
    setIsLoading(true);

    let timeSlots = [];
    if (assignForm.time === 'Ca 1 (08:00 - 12:00)') {
      timeSlots = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30'];
    } else {
      timeSlots = ['13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'];
    }

    const res = await createDoctorScheduleAction({
      doctorId: parseInt(assignForm.doctorId),
      clinicId: parseInt(assignForm.clinicId),
      date: assignForm.date,
      timeSlots: timeSlots,
    });

    setIsLoading(false);
    if (res.success) {
      alert(res.message);
      setIsAssignModalOpen(false);
      window.location.reload();
    } else {
      alert(res.message);
    }
  };

  const handleChangeRoomSubmit = async () => {
    if (!newClinicId || !selectedRoom?.scheduleId) return;
    setIsLoading(true);
    const res = await changeDoctorScheduleRoomAction(selectedRoom.scheduleId, parseInt(newClinicId));
    setIsLoading(false);
    if (res.success) {
      alert(res.message);
      setIsChangeRoomModalOpen(false);
      window.location.reload();
    } else {
      alert(res.message);
    }
  };

  const handleCancelAssignment = async (scheduleId: number) => {
    if (!confirm('Bạn có chắc chắn muốn hủy phân phòng này?')) return;
    const res = await cancelDoctorScheduleAction(scheduleId);
    if (res.success) {
      alert(res.message);
      window.location.reload();
    } else {
      alert(res.message);
    }
  };

  // UI Helpers
  const getStatusBadge = (status: string) => {
    if (status === 'Đã xếp') return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Đã xếp</span>;
    if (status === 'Trống') return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Trống</span>;
    if (status === 'Bảo trì') return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Bảo trì</span>;
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Sắp Xếp Phòng Khám</h1>
          <p className="text-gray-500 mt-1 text-sm">Điều phối không gian, phân phòng cho bác sĩ và xử lý sự cố cơ sở vật chất</p>
        </div>
        <button
          onClick={() => {
            setAssignForm({ ...assignForm, date: filterDate, specialtyId: '', doctorId: '', clinicId: '' });
            setIsAssignModalOpen(true);
          }}
          className="px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/20 transition-all font-medium flex items-center gap-2 shrink-0"
        >
          <Building size={18} /> Phân phòng
        </button>
      </div>

      {/* Toolbar Filters */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col xl:flex-row gap-4 items-center justify-between">
        <div className="relative w-full xl:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Tìm theo phòng, bác sĩ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          <input 
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            disabled // Khóa tạm tính năng chọn ngày khác để demo
            title="Demo đang khóa chọn ngày khác"
            className="px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 bg-gray-50 cursor-not-allowed"
          />
          <select 
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 focus:outline-none focus:border-blue-500 bg-white"
          >
            <option value="All">Tất cả khoa</option>
            {specialties.map((s: any) => <option key={s.id} value={s.name}>{s.name}</option>)}
          </select>
          <select 
            value={filterDoctor}
            onChange={(e) => setFilterDoctor(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 focus:outline-none focus:border-blue-500 bg-white"
          >
            <option value="All">Tất cả bác sĩ</option>
            {doctors.map((d: any) => <option key={d.userId} value={d.userId}>{d.user.fullName}</option>)}
          </select>
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 focus:outline-none focus:border-blue-500 bg-white"
          >
            <option value="All">Mọi trạng thái phòng</option>
            <option value="Đã xếp">Đã xếp</option>
            <option value="Trống">Trống</option>
            <option value="Bảo trì">Bảo trì</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 text-sm">
                <th className="px-6 py-4 font-semibold">Phòng</th>
                <th className="px-6 py-4 font-semibold">Bác sĩ phụ trách</th>
                <th className="px-6 py-4 font-semibold">Khoa / Loại phòng</th>
                <th className="px-6 py-4 font-semibold">Thời gian trực</th>
                <th className="px-6 py-4 font-semibold">Trạng thái phòng</th>
                <th className="px-6 py-4 font-semibold text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredRooms.map((room: any) => (
                <tr key={room.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center
                        ${room.status === 'Đã xếp' ? 'bg-emerald-100 text-emerald-600' : 
                          room.status === 'Trống' ? 'bg-blue-50 text-blue-500' : 'bg-red-50 text-red-500'}`}
                      >
                        {room.status === 'Bảo trì' ? <Settings2 size={20} /> : <Building size={20} />}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 text-base">{room.roomNumber}</p>
                        <p className="text-xs text-gray-500">Cơ sở chính</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {room.status === 'Đã xếp' ? (
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-indigo-400" />
                        <span className="font-bold text-gray-800">{room.doctorName}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400 font-medium">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1 items-start">
                      <span className="font-medium text-gray-700 flex items-center gap-1.5"><ActivitySquare size={14} className="text-blue-400"/> {room.specialty}</span>
                      <span className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">{room.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     {room.status === 'Đã xếp' ? (
                       <span className="font-medium text-gray-600 flex items-center gap-1.5"><Clock size={14} className="text-amber-500"/> {room.time}</span>
                     ) : (
                       <span className="text-gray-400 font-medium">—</span>
                     )}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(room.status)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {room.status === 'Đã xếp' && (
                       <div className="flex items-center justify-center gap-2">
                         <button 
                           title="Đổi phòng do sự cố"
                           onClick={() => { setSelectedRoom(room); setIsChangeRoomModalOpen(true); }}
                           className="p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-100"
                         >
                           <ArrowRightLeft size={16} />
                         </button>
                         <button 
                           title="Hủy phân phòng"
                           onClick={() => handleCancelAssignment(room.scheduleId)}
                           className="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-100"
                         >
                           <Trash2 size={16} />
                         </button>
                       </div>
                    )}
                    {room.status === 'Trống' && (
                      <button 
                         onClick={() => {
                           setAssignForm({ ...assignForm, date: filterDate, clinicId: room.id.toString(), specialtyId: '', doctorId: '' });
                           setIsAssignModalOpen(true);
                         }}
                         className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 bg-white border border-blue-200 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        + Xếp ca
                      </button>
                    )}
                  </td>
                </tr>
              ))}

              {filteredRooms.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <Building size={48} className="text-gray-300 mb-3" />
                      <p className="text-base font-medium text-gray-600">Không tìm thấy phòng khám nào</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL PHÂN PHÒNG */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in slide-in-bottom-4 duration-300">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-blue-600 text-white">
              <div className="flex items-center gap-3">
                <Building size={24} />
                <h3 className="font-bold text-xl">Phân Phòng Khám</h3>
              </div>
              <button onClick={() => setIsAssignModalOpen(false)} className="hover:bg-blue-700 p-2 rounded-xl transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                   <label className="text-sm font-semibold text-slate-700">Ngày</label>
                   <input type="date" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" value={assignForm.date} onChange={e => setAssignForm({...assignForm, date: e.target.value})} disabled />
                </div>
                <div className="space-y-1.5">
                   <label className="text-sm font-semibold text-slate-700">Thời gian ca</label>
                   <select value={assignForm.time} onChange={e => setAssignForm({...assignForm, time: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none">
                     <option value="Ca 1 (08:00 - 12:00)">Ca 1 (08:00 - 12:00)</option>
                     <option value="Ca 2 (13:00 - 17:00)">Ca 2 (13:00 - 17:00)</option>
                   </select>
                </div>
                <div className="space-y-1.5">
                   <label className="text-sm font-semibold text-slate-700">Khoa</label>
                   <select value={assignForm.specialtyId} onChange={e => setAssignForm({...assignForm, specialtyId: e.target.value, doctorId: ''})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none">
                     <option value="">-- Chọn khoa --</option>
                     {specialties.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
                   </select>
                </div>
                <div className="space-y-1.5">
                   <label className="text-sm font-semibold text-slate-700">Bác sĩ</label>
                   <select value={assignForm.doctorId} onChange={e => setAssignForm({...assignForm, doctorId: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" disabled={!assignForm.specialtyId}>
                     <option value="">-- Chọn bác sĩ --</option>
                     {availableDoctors.map((d: any) => <option key={d.userId} value={d.userId}>{d.user.fullName}</option>)}
                   </select>
                </div>
              </div>

              {/* Danh sách phòng */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 font-bold text-slate-700 text-sm">
                  CHỌN PHÒNG KHẢ DỤNG
                </div>
                <div className="p-2 max-h-48 overflow-y-auto space-y-1">
                  {roomList.map((pr: any) => (
                    <label key={pr.id} className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer border ${pr.status === 'Trống' ? (assignForm.clinicId === pr.id.toString() ? 'border-blue-500 bg-blue-50' : 'border-slate-100 hover:bg-slate-50') : 'border-transparent opacity-60 cursor-not-allowed'}`}>
                       <input 
                         type="radio" 
                         name="roomSelect" 
                         value={pr.id}
                         checked={assignForm.clinicId === pr.id.toString()}
                         onChange={(e) => setAssignForm({...assignForm, clinicId: e.target.value})}
                         disabled={pr.status !== 'Trống'} 
                         className="w-4 h-4 text-blue-600 focus:ring-blue-500" 
                       />
                       <div className="flex-1 flex justify-between items-center text-sm">
                          <span className="font-bold text-slate-800 w-16">{pr.roomNumber}</span>
                          <span className="text-slate-500 flex-1">{pr.specialty} - {pr.type}</span>
                          {getStatusBadge(pr.status)}
                       </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
               <button onClick={() => setIsAssignModalOpen(false)} className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">Hủy</button>
               <button onClick={handleAssignSubmit} disabled={isLoading || !assignForm.doctorId || !assignForm.clinicId} className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                 {isLoading && <Loader2 size={16} className="animate-spin" />}
                 Xác nhận phân phòng
               </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ĐỔI PHÒNG */}
      {isChangeRoomModalOpen && selectedRoom && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
           <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-6 text-center space-y-4">
                 <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
                    <ShieldAlert size={32} />
                 </div>
                 <h3 className="text-xl font-bold text-slate-800">Xử lý sự cố: Đổi phòng</h3>
                 <p className="text-slate-600 text-sm">
                   Bác sĩ <b>{selectedRoom.doctorName}</b> đang trực tại <b>{selectedRoom.roomNumber}</b>.
                   Bạn muốn chuyển toàn bộ ca khám này sang phòng dự phòng?
                 </p>
                 <div className="pt-4 text-left space-y-2">
                   <label className="text-sm font-semibold text-slate-700">Chọn phòng trống để chuyển đến:</label>
                   <select value={newClinicId} onChange={e => setNewClinicId(e.target.value)} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none">
                     <option value="">-- Chọn phòng --</option>
                     {emptyRooms.map((r: any) => (
                       <option key={r.id} value={r.id}>{r.roomNumber} - {r.specialty}</option>
                     ))}
                   </select>
                 </div>
              </div>
              <div className="p-4 bg-slate-50 flex gap-3">
                 <button onClick={() => setIsChangeRoomModalOpen(false)} className="flex-1 py-3 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-100">Hủy bỏ</button>
                 <button onClick={handleChangeRoomSubmit} disabled={!newClinicId || isLoading} className="flex-1 py-3 text-sm font-semibold text-white bg-amber-500 rounded-xl hover:bg-amber-600 shadow-lg shadow-amber-500/20 disabled:opacity-50 flex justify-center items-center gap-2">
                   {isLoading && <Loader2 size={16} className="animate-spin" />}
                   Xác nhận dời ca
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
