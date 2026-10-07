'use client';

import React, { useState, useEffect } from 'react';
import { getDoctors, getDoctorSchedules, assignSchedule, getClinics } from './actions';
import { 
  CalendarDays, User, Clock, ChevronLeft, ChevronRight, Check, Save, Loader2, Info
} from 'lucide-react';
import Sidebar from '../Sidebar';

export default function AdminSchedulesPage() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null);
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [schedules, setSchedules] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // When clicking a day
  const [selectedDayStr, setSelectedDayStr] = useState<string | null>(null);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);
  const [selectedClinicId, setSelectedClinicId] = useState<number | null>(null);
  const [clinics, setClinics] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const availableTimeSlots = [
    '07:00', '07:30', '08:00', '08:30',
    '09:00', '09:30', '10:00', '10:30', '11:00',
    '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30',
  ];

  useEffect(() => {
    getDoctors().then(res => {
      if (res.success) setDoctors(res.doctors);
    });
    getClinics().then(res => {
      if (res.success) setClinics(res.clinics);
    });
  }, []);

  useEffect(() => {
    if (selectedDoctor) {
      fetchSchedules();
    }
  }, [selectedDoctor, currentDate.getMonth(), currentDate.getFullYear()]);

  const fetchSchedules = async () => {
    if (!selectedDoctor) return;
    setIsLoading(true);
    const res = await getDoctorSchedules(selectedDoctor, currentDate.getMonth() + 1, currentDate.getFullYear());
    if (res.success) setSchedules(res.schedules || []);
    setIsLoading(false);
  };

  const handlePrevMonth = () => {
    const d = new Date(currentDate);
    d.setMonth(d.getMonth() - 1);
    setCurrentDate(d);
  };

  const handleNextMonth = () => {
    const d = new Date(currentDate);
    d.setMonth(d.getMonth() + 1);
    setCurrentDate(d);
  };

  const handleDayClick = (dateStr: string) => {
    setSelectedDayStr(dateStr);
    const existing = schedules.find(s => s.date === dateStr);
    setSelectedTimeSlots(existing ? existing.timeSlots : []);
    setSelectedClinicId(existing && existing.clinicId ? existing.clinicId : null);
  };

  const morningSlots = availableTimeSlots.filter(t => parseInt(t.split(':')[0]) < 12);
  const afternoonSlots = availableTimeSlots.filter(t => {
    const h = parseInt(t.split(':')[0]);
    return h >= 12 && h < 18;
  });
  const eveningSlots = availableTimeSlots.filter(t => parseInt(t.split(':')[0]) >= 18);

  const isMorningSelected = morningSlots.length > 0 && morningSlots.every(slot => selectedTimeSlots.includes(slot));
  const isAfternoonSelected = afternoonSlots.length > 0 && afternoonSlots.every(slot => selectedTimeSlots.includes(slot));
  const isEveningSelected = eveningSlots.length > 0 && eveningSlots.every(slot => selectedTimeSlots.includes(slot));

  const toggleMorning = () => {
    if (isMorningSelected) {
      setSelectedTimeSlots(prev => prev.filter(slot => !morningSlots.includes(slot)));
    } else {
      setSelectedTimeSlots(prev => Array.from(new Set([...prev, ...morningSlots])).sort());
    }
  };

  const toggleAfternoon = () => {
    if (isAfternoonSelected) {
      setSelectedTimeSlots(prev => prev.filter(slot => !afternoonSlots.includes(slot)));
    } else {
      setSelectedTimeSlots(prev => Array.from(new Set([...prev, ...afternoonSlots])).sort());
    }
  };

  const toggleEvening = () => {
    if (isEveningSelected) {
      setSelectedTimeSlots(prev => prev.filter(slot => !eveningSlots.includes(slot)));
    } else {
      setSelectedTimeSlots(prev => Array.from(new Set([...prev, ...eveningSlots])).sort());
    }
  };

  const handleSave = async () => {
    if (!selectedDoctor || !selectedDayStr) return;
    setIsSaving(true);
    const res = await assignSchedule(selectedDoctor, selectedDayStr, selectedTimeSlots, selectedClinicId);
    if (res.success) {
      await fetchSchedules();
      alert('Đã lưu phân công ca khám thành công!');
    } else {
      alert('Đã xảy ra lỗi khi lưu.');
    }
    setIsSaving(false);
  };

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();

  const renderMonthGrid = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = new Date(year, month, 1).getDay(); // 0 is Sunday
    const startOffset = firstDay === 0 ? 6 : firstDay - 1; // Make Monday = 0
    
    const days = [];
    for (let i = 0; i < startOffset; i++) {
      days.push(<div key={`empty-${i}`} className="bg-slate-50 border-r border-b border-slate-200 min-h-[100px]"></div>);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const daySchedule = schedules.find(s => s.date === dateStr);
      const isSelected = selectedDayStr === dateStr;
      
      const hasMorning = daySchedule?.timeSlots.some((t: string) => parseInt(t.split(':')[0]) < 12);
      const hasAfternoon = daySchedule?.timeSlots.some((t: string) => {
        const h = parseInt(t.split(':')[0]);
        return h >= 12 && h < 18;
      });
      const hasEvening = daySchedule?.timeSlots.some((t: string) => parseInt(t.split(':')[0]) >= 18);

      days.push(
        <div 
          key={i} 
          onClick={() => handleDayClick(dateStr)}
          className={`border-r border-b border-slate-200 p-2 min-h-[100px] cursor-pointer transition ${
            isSelected ? 'bg-blue-50 ring-2 ring-blue-500 ring-inset' : 'hover:bg-slate-100 bg-white'
          }`}
        >
          <div className="flex justify-between items-start">
            <span className={`text-sm font-bold ${isSelected ? 'text-blue-700' : 'text-slate-700'}`}>{i}</span>
            {daySchedule && daySchedule.timeSlots.length > 0 && (
              <span className="bg-green-100 text-green-700 text-[10px] font-bold px-1.5 py-0.5 rounded">
                {daySchedule.timeSlots.length} ca
              </span>
            )}
          </div>
          <div className="mt-2 flex gap-1">
            {hasMorning && <div className="w-3 h-3 bg-blue-400 rounded-full" title="Sáng"></div>}
            {hasAfternoon && <div className="w-3 h-3 bg-orange-400 rounded-full" title="Chiều"></div>}
            {hasEvening && <div className="w-3 h-3 bg-purple-400 rounded-full" title="Tối"></div>}
          </div>
        </div>
      );
    }
    
    return (
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="grid grid-cols-7 bg-slate-100 border-b border-slate-200">
          {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(d => (
            <div key={d} className="py-2 text-center text-xs font-bold text-slate-500 border-r border-slate-200 last:border-0">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {days}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans text-slate-800">
      <Sidebar />
      <div className="flex-1 p-6 flex flex-col h-screen overflow-hidden">
        <div className="mb-6 flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <CalendarDays className="text-blue-600" /> Phân công Ca Khám
          </h1>
          <p className="text-slate-500 mt-1">Quản lý và xếp lịch làm việc cho các Bác sĩ</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Left Column: Select Doctor */}
        <div className="col-span-3 flex flex-col gap-4 min-h-0">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 h-full flex flex-col">
            <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><User size={18}/> Chọn Bác sĩ</h2>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2">
              {doctors.map(doc => (
                <div 
                  key={doc.id}
                  onClick={() => setSelectedDoctor(doc.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition ${
                    selectedDoctor === doc.id ? 'border-blue-500 bg-blue-50 text-blue-900' : 'border-slate-100 hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold text-sm">{doc.name}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{doc.specialty}</div>
                </div>
              ))}
              {doctors.length === 0 && (
                <div className="text-sm text-slate-400 italic">Đang tải danh sách bác sĩ...</div>
              )}
            </div>
          </div>
        </div>

        {/* Middle Column: Calendar */}
        <div className="col-span-6 flex flex-col min-h-0">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 h-full flex flex-col">
            {!selectedDoctor ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                <CalendarDays size={64} className="mb-4 opacity-20" />
                <p>Vui lòng chọn một Bác sĩ bên trái để xem lịch</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                    Lịch làm việc
                    {isLoading && <Loader2 size={16} className="animate-spin text-blue-500"/>}
                  </h2>
                  <div className="flex items-center gap-3">
                    <button onClick={handlePrevMonth} className="p-1.5 rounded hover:bg-slate-100 text-slate-600"><ChevronLeft size={18}/></button>
                    <span className="font-bold text-sm w-24 text-center">Tháng {currentDate.getMonth() + 1} / {currentDate.getFullYear()}</span>
                    <button onClick={handleNextMonth} className="p-1.5 rounded hover:bg-slate-100 text-slate-600"><ChevronRight size={18}/></button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  {renderMonthGrid()}
                </div>
                
                  <div className="mt-4 flex gap-4 text-xs font-bold text-slate-500 justify-center">
                    <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-blue-400 rounded-full"></div> Có ca sáng</div>
                    <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-orange-400 rounded-full"></div> Có ca chiều</div>
                    <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-purple-400 rounded-full"></div> Có ca tối</div>
                  </div>
              </>
            )}
          </div>
        </div>

        {/* Right Column: Time Slots Selection */}
        <div className="col-span-3 flex flex-col min-h-0">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 h-full flex flex-col relative overflow-hidden">
            {!selectedDayStr ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                <Clock size={48} className="mb-4 opacity-20" />
                <p className="text-center text-sm">Chọn một ngày trên lịch<br/>để phân bổ ca khám</p>
              </div>
            ) : (
              <>
                <div className="mb-4 pb-4 border-b border-slate-100">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Thiết lập giờ khám</div>
                  <div className="text-xl font-black text-blue-600 mb-3">
                    {selectedDayStr.split('-').reverse().join('/')}
                  </div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 mt-2">Phòng Khám / Cơ Sở</div>
                  {(() => {
                    const selectedDocObj = doctors.find(d => d.id === selectedDoctor);
                    // HÀM HỖ TRỢ: Trích xuất khu vực (HN / HCM) từ chuỗi địa chỉ
                    // Mục đích: Phân loại nhanh địa chỉ của bác sĩ và cơ sở để ghép cặp chính xác.
                    const getLocationKey = (text: string) => {
                      if (!text) return null;
                      const lower = text.toLowerCase();
                      // Nhận diện khu vực Hà Nội
                      if (lower.includes('hà nội') || lower.includes('ha noi') || lower.includes('hn')) return 'HN';
                      // Nhận diện khu vực TP. Hồ Chí Minh
                      if (lower.includes('hồ chí minh') || lower.includes('ho chi minh') || lower.includes('hcm') || lower.includes('sài gòn') || lower.includes('sai gon')) return 'HCM';
                      return null;
                    };

                    // BỘ LỌC KÉP: Trích xuất danh sách phòng khám dựa trên thông tin Bác sĩ
                    const filteredClinics = selectedDocObj 
                      ? clinics.filter(c => {
                          // BƯỚC 1: LỌC THEO CHUYÊN KHOA
                          // - Nếu phòng khám có chuyên khoa, bắt buộc phải trùng với chuyên khoa của bác sĩ.
                          // - Nếu phòng khám không có chuyên khoa (Phòng khám đa khoa), thì cho phép hiển thị.
                          const matchSpecialty = c.specialty?.name === selectedDocObj.specialty || !c.specialty;
                          if (!matchSpecialty) return false;

                          // BƯỚC 2: LỌC THEO VỊ TRÍ ĐỊA LÝ (CÙNG THÀNH PHỐ)
                          // Tránh việc bác sĩ sống ở Hà Nội lại bị xếp lịch vào cơ sở Sài Gòn.
                          const docLocation = getLocationKey(selectedDocObj.address);
                          if (docLocation) {
                            // Quét tên và địa chỉ của cơ sở (Facility) để tìm khu vực
                            const clinicLocation = getLocationKey((c.facility?.name || '') + ' ' + (c.facility?.address || ''));
                            // Nếu phát hiện ra khu vực của cơ sở mà khác với khu vực của bác sĩ => Loại bỏ ngay
                            if (clinicLocation && clinicLocation !== docLocation) {
                              return false;
                            }
                          }
                          return true; // Thỏa mãn cả 2 điều kiện
                        })
                      : clinics;
                      
                    return (
                      <select 
                        value={selectedClinicId || ''} 
                        onChange={e => setSelectedClinicId(e.target.value ? parseInt(e.target.value) : null)}
                        className="w-full border border-slate-200 rounded-lg p-2 text-sm font-bold text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">-- Chọn phòng khám --</option>
                        {filteredClinics.map(c => (
                          <option key={c.id} value={c.id}>
                            {c.name} {c.roomNumber ? `(P. ${c.roomNumber})` : ''} - {c.facility?.name}
                          </option>
                        ))}
                      </select>
                    );
                  })()}
                </div>

                <div className="flex-1 -mx-2 px-2 pb-20 flex flex-col gap-4">
                  <button
                    onClick={toggleMorning}
                    className={`p-4 rounded-xl border-2 transition-all flex justify-between items-center ${
                      isMorningSelected 
                        ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-md shadow-blue-100' 
                        : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-black text-lg">Ca Sáng</span>
                      <span className="text-sm opacity-80 mt-1">07:00 - 11:00</span>
                    </div>
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                      isMorningSelected ? 'bg-blue-500 border-blue-500 text-white' : 'border-slate-300'
                    }`}>
                      {isMorningSelected && <Check size={16} strokeWidth={3} />}
                    </div>
                  </button>

                  <button
                    onClick={toggleAfternoon}
                    className={`p-4 rounded-xl border-2 transition-all flex justify-between items-center ${
                      isAfternoonSelected 
                        ? 'bg-orange-50 border-orange-500 text-orange-700 shadow-md shadow-orange-100' 
                        : 'bg-white border-slate-200 text-slate-600 hover:border-orange-300'
                    }`}
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-black text-lg">Ca Chiều</span>
                      <span className="text-sm opacity-80 mt-1">13:30 - 17:30</span>
                    </div>
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                      isAfternoonSelected ? 'bg-orange-500 border-orange-500 text-white' : 'border-slate-300'
                    }`}>
                      {isAfternoonSelected && <Check size={16} strokeWidth={3} />}
                    </div>
                  </button>

                  <button
                    onClick={toggleEvening}
                    className={`p-4 rounded-xl border-2 transition-all flex justify-between items-center ${
                      isEveningSelected 
                        ? 'bg-purple-50 border-purple-500 text-purple-700 shadow-md shadow-purple-100' 
                        : 'bg-white border-slate-200 text-slate-600 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-black text-lg">Ca Tối</span>
                      <span className="text-sm opacity-80 mt-1">18:00 - 18:30</span>
                    </div>
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                      isEveningSelected ? 'bg-purple-500 border-purple-500 text-white' : 'border-slate-300'
                    }`}>
                      {isEveningSelected && <Check size={16} strokeWidth={3} />}
                    </div>
                  </button>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur border-t border-slate-100">
                  <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200 disabled:opacity-50"
                  >
                    {isSaving ? <Loader2 size={18} className="animate-spin"/> : <Save size={18} />}
                    Lưu Phân Công
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
