'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Calendar, Clock, Sun, Sunset, MapPin, CheckCircle2, 
  ShieldCheck, ChevronRight, Sparkles, CreditCard
} from 'lucide-react';

interface Props {
  doctorId: number;
  doctorName: string;
  clinicName: string;
  facilityName: string;
  facilityAddress: string;
  price: string;
  bookingLink?: string;
}

interface DayOption {
  dayName: string;
  dateStr: string;
  fullLabel: string;
  isToday?: boolean;
}

interface TimeSlot {
  time: string;
  range: string;
}

// Mỗi khung giờ đặt cách nhau 30 phút đúng như hình mẫu của người dùng
const MORNING_SLOTS: TimeSlot[] = [
  { time: '07:30', range: '07:30 - 08:00' },
  { time: '08:00', range: '08:00 - 08:30' },
  { time: '08:30', range: '08:30 - 09:00' },
  { time: '09:00', range: '09:00 - 09:30' },
  { time: '09:30', range: '09:30 - 10:00' },
  { time: '10:00', range: '10:00 - 10:30' },
  { time: '10:30', range: '10:30 - 11:00' },
  { time: '11:00', range: '11:00 - 11:30' },
];

const AFTERNOON_SLOTS: TimeSlot[] = [
  { time: '13:30', range: '13:30 - 14:00' },
  { time: '14:00', range: '14:00 - 14:30' },
  { time: '14:30', range: '14:30 - 15:00' },
  { time: '15:00', range: '15:00 - 15:30' },
  { time: '15:30', range: '15:30 - 16:00' },
  { time: '16:00', range: '16:00 - 16:30' },
  { time: '16:30', range: '16:30 - 17:00' },
  { time: '17:00', range: '17:00 - 17:30' },
];

export default function BacSiScheduleSection({
  doctorId,
  doctorName,
  clinicName,
  facilityName,
  facilityAddress,
  price,
  bookingLink = '/login'
}: Props) {
  // 6 ngày khám trong tuần
  const days: DayOption[] = [
    { dayName: 'Thứ 2', dateStr: '12/10', fullLabel: 'Thứ Hai, 12/10', isToday: true },
    { dayName: 'Thứ 3', dateStr: '13/10', fullLabel: 'Thứ Ba, 13/10' },
    { dayName: 'Thứ 4', dateStr: '14/10', fullLabel: 'Thứ Tư, 14/10' },
    { dayName: 'Thứ 5', dateStr: '15/10', fullLabel: 'Thứ Năm, 15/10' },
    { dayName: 'Thứ 6', dateStr: '16/10', fullLabel: 'Thứ Sáu, 16/10' },
    { dayName: 'Thứ 7', dateStr: '17/10', fullLabel: 'Thứ Bảy, 17/10' },
  ];

  const [selectedDayIdx, setSelectedDayIdx] = useState(0);
  // Mặc định chọn trước khung giờ 7h30
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(MORNING_SLOTS[0]);

  const currentDay = days[selectedDayIdx];

  const formatVietnameseTime = (timeStr: string) => {
    const [hour, minute] = timeStr.split(':');
    const h = parseInt(hour, 10);
    return `${h}h${minute}`;
  };

  const handleSelectSlot = (slot: TimeSlot) => {
    setSelectedSlot(slot);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">
      
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 shadow-sm border border-blue-100">
            <Calendar size={24} className="stroke-[2.2]" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              Lịch khám bệnh & Khung giờ nhận hẹn
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm mt-0.5 flex items-center gap-1.5">
              <MapPin size={14} className="text-blue-500 shrink-0" />
              <span>{clinicName} - <strong className="text-gray-700">{facilityName}</strong></span>
            </p>
          </div>
        </div>

        {/* Live Status Badge */}
        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3.5 py-1.5 rounded-full border border-emerald-200/80 w-fit self-start sm:self-auto text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Sẵn sàng tiếp nhận bệnh nhân</span>
        </div>
      </div>

      {/* 2. Chọn ngày khám */}
      <div>
        <div className="flex items-center justify-between mb-3 text-xs sm:text-sm font-semibold text-gray-700">
          <span className="flex items-center gap-1.5">
            <Calendar size={15} className="text-blue-600" />
            Chọn ngày khám:
          </span>
          <span className="text-blue-600 font-bold text-xs sm:text-sm">
            {currentDay.fullLabel}
          </span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-2.5">
          {days.map((day, idx) => {
            const isSelected = selectedDayIdx === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setSelectedDayIdx(idx);
                  setSelectedSlot(null);
                }}
                className={`flex flex-col items-center justify-center py-3 px-2 rounded-2xl border transition-all duration-200 text-center relative ${
                  isSelected
                    ? 'bg-gradient-to-b from-blue-600 to-blue-700 text-white border-blue-600 shadow-lg shadow-blue-200 scale-[1.02]'
                    : 'bg-slate-50/80 hover:bg-blue-50/60 border-slate-200/70 text-gray-700 hover:border-blue-200'
                }`}
              >
                {day.isToday && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full mb-1 ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-700'
                  }`}>
                    Hôm nay
                  </span>
                )}
                <span className={`font-bold text-sm ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                  {day.dayName}
                </span>
                <span className={`text-xs mt-0.5 ${isSelected ? 'text-blue-100 font-medium' : 'text-gray-500'}`}>
                  {day.dateStr}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Khung giờ đặt khám cách nhau 30 phút (4 cột như ảnh mẫu) */}
      <div className="space-y-6 pt-1">
        
        {/* Ca Sáng */}
        <div className="bg-slate-50/70 rounded-2xl p-4 sm:p-5 border border-slate-200/60">
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                <Sun size={16} className="stroke-[2.2]" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm sm:text-base">Chọn giờ khám (Ca Sáng)</h4>
                <p className="text-[11px] text-gray-500">Khung giờ sáng từ 07:30 đến 11:30 • Mỗi lượt 30 phút</p>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-blue-700 bg-blue-100/60 px-2.5 py-0.5 rounded-full">
              8 khung giờ
            </span>
          </div>

          {/* Grid 4 cột giống hệt trên hình */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {MORNING_SLOTS.map((slot, idx) => {
              const isPicked = selectedSlot?.time === slot.time;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectSlot(slot)}
                  className={`py-3 px-4 rounded-xl text-sm sm:text-base font-semibold transition-all duration-200 flex items-center justify-center border shadow-sm ${
                    isPicked
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200 ring-2 ring-blue-300 scale-[1.02]'
                      : 'bg-white hover:bg-blue-50 text-gray-800 border-gray-200 hover:border-blue-400 hover:text-blue-700'
                  }`}
                >
                  <span>{slot.time}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Ca Chiều */}
        <div className="bg-slate-50/70 rounded-2xl p-4 sm:p-5 border border-slate-200/60">
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <Sunset size={16} className="stroke-[2.2]" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm sm:text-base">Chọn giờ khám (Ca Chiều)</h4>
                <p className="text-[11px] text-gray-500">Khung giờ chiều từ 13:30 đến 17:30 • Mỗi lượt 30 phút</p>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-100/60 px-2.5 py-0.5 rounded-full">
              8 khung giờ
            </span>
          </div>

          {/* Grid 4 cột giống hệt trên hình */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {AFTERNOON_SLOTS.map((slot, idx) => {
              const isPicked = selectedSlot?.time === slot.time;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectSlot(slot)}
                  className={`py-3 px-4 rounded-xl text-sm sm:text-base font-semibold transition-all duration-200 flex items-center justify-center border shadow-sm ${
                    isPicked
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200 ring-2 ring-blue-300 scale-[1.02]'
                      : 'bg-white hover:bg-blue-50 text-gray-800 border-gray-200 hover:border-blue-400 hover:text-blue-700'
                  }`}
                >
                  <span>{slot.time}</span>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* 4. Banner xác nhận khung giờ đã chọn */}
      {selectedSlot ? (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-200">
              <CheckCircle2 size={22} />
            </div>
            <div>
              <p className="text-xs text-blue-700 font-semibold uppercase tracking-wider">Khung giờ đã chọn</p>
              <h4 className="font-black text-gray-900 text-base sm:text-lg">
                {formatVietnameseTime(selectedSlot.time)} • {currentDay.fullLabel}
              </h4>
              <p className="text-xs text-gray-500 mt-0.5">Bác sĩ: {doctorName} ({clinicName})</p>
            </div>
          </div>

          <Link
            href={bookingLink}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md shadow-blue-200 hover:shadow-lg flex items-center justify-center gap-2 text-sm shrink-0"
          >
            <span>Tiếp tục đặt lịch</span>
            <ChevronRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-xs text-gray-500 bg-blue-50/40 p-3 rounded-xl border border-blue-100/60">
          <Sparkles size={15} className="text-blue-600 shrink-0" />
          <span>
            Nhấp chọn một <strong>khung giờ 30 phút</strong> phía trên để chọn giờ và tiếp tục đặt lịch khám trực tiếp với Bác sĩ.
          </span>
        </div>
      )}

      {/* 5. Chính sách dịch vụ */}
      <div className="pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-gray-600">
        <div className="flex items-start gap-2 bg-slate-50 p-3 rounded-xl">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <strong className="text-gray-900 block font-semibold">Miễn phí đặt chỗ</strong>
            <span>Không thu phụ phí đặt lịch hẹn trực tuyến qua hệ thống</span>
          </div>
        </div>

        <div className="flex items-start gap-2 bg-slate-50 p-3 rounded-xl">
          <CreditCard size={16} className="text-blue-600 shrink-0 mt-0.5" />
          <div>
            <strong className="text-gray-900 block font-semibold">Giá khám công khai</strong>
            <span>{price}/lượt khám, áp dụng thanh toán BHYT đúng tuyến</span>
          </div>
        </div>

        <div className="flex items-start gap-2 bg-slate-50 p-3 rounded-xl">
          <ShieldCheck size={16} className="text-indigo-600 shrink-0 mt-0.5" />
          <div>
            <strong className="text-gray-900 block font-semibold">Ưu tiên tiếp đón</strong>
            <span>Đến theo khung giờ đã hẹn, không mất thời gian bốc số chờ đợi</span>
          </div>
        </div>
      </div>

    </div>
  );
}
