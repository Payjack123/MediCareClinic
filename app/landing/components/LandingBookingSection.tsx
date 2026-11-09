'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import QRCode from 'react-qr-code';
import { 
  Calendar, Clock, User, Phone, FileText, CheckCircle2, 
  Stethoscope, ArrowRight, ShieldCheck, Sparkles, 
  Building2, RotateCcw, AlertCircle, Loader2, Check, ExternalLink,
  LogIn, UserPlus, Lock, X, CalendarDays
} from 'lucide-react';
import { createLandingAppointment } from '@/app/landing/dat-lich/actions';

interface BookingConfirmation {
  appointmentCode: string;
  patientName: string;
  phone: string;
  bookingDate: string;
  bookingTime: string;
  doctorName: string;
  specialty: string;
  facilityName: string;
  room?: string;
}

interface Facility {
  id: number;
  name: string;
  address: string;
}

interface Doctor {
  id: number;
  userId?: number;
  user: {
    id: number;
    fullName: string;
    avatar?: string | null;
    phone?: string | null;
  };
  degree?: string | null;
  experience?: string | null;
  price?: number | null;
  specialty?: {
    id: number;
    name: string;
  } | null;
  department?: {
    id: number;
    name: string;
  } | null;
  clinics?: Array<{
    id: number;
    name: string;
    facilityId: number;
    facility?: {
      id: number;
      name: string;
    } | null;
  }>;
}

interface Specialty {
  id: number;
  name: string;
}

interface Props {
  facilities: Facility[];
  doctors: Doctor[];
  specialties: Specialty[];
  isLoggedIn?: boolean;
  currentUser?: {
    id?: number;
    fullName?: string;
    phone?: string | null;
    dob?: string | null;
    gender?: string | null;
  } | null;
}

const MORNING_SLOTS = [
  '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00'
];

const AFTERNOON_SLOTS = [
  '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
];

export default function LandingBookingSection({
  facilities = [],
  doctors = [],
  specialties = [],
  isLoggedIn = false,
  currentUser = null
}: Props) {
  // 7 ngày tiếp theo
  const availableDays = useMemo(() => {
    const days = [];
    const now = new Date();
    const currentHour = now.getHours();
    const startOffset = currentHour >= 17 ? 1 : 0;

    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i + startOffset);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const dateNum = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${dateNum}`;
      const dayOfWeek = d.getDay();

      const label = (i + startOffset) === 0 
        ? 'Hôm nay' 
        : (i + startOffset) === 1 
          ? 'Ngày mai' 
          : dayOfWeek === 0 ? 'Chủ Nhật' : `Thứ ${dayOfWeek + 1}`;

      days.push({
        dateStr,
        label,
        displayDate: `${dateNum}/${month}`
      });
    }
    return days;
  }, []);

  const [selectedFacilityId, setSelectedFacilityId] = useState<number>(facilities[0]?.id || 1);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');
  const [selectedDoctorId, setSelectedDoctorId] = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState<string>(availableDays[0]?.dateStr || '');
  const [selectedTime, setSelectedTime] = useState<string>('08:00');

  const [patientName, setPatientName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [reason, setReason] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successData, setSuccessData] = useState<BookingConfirmation | null>(null);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  // Khôi phục bản ghi tạm từ localStorage nếu có
  useEffect(() => {
    try {
      const saved = localStorage.getItem('medicare_draft_booking');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.facilityId) setSelectedFacilityId(parsed.facilityId);
        if (parsed.specialtyName) setSelectedSpecialty(parsed.specialtyName);
        if (parsed.doctorId) setSelectedDoctorId(parsed.doctorId);
        if (parsed.bookingDate) setSelectedDate(parsed.bookingDate);
        if (parsed.bookingTime) setSelectedTime(parsed.bookingTime);
        if (parsed.patientName) setPatientName(parsed.patientName);
        if (parsed.phone) setPhone(parsed.phone);
        if (parsed.reason) setReason(parsed.reason);
      }
    } catch (e) {
      console.error('Failed to restore draft booking:', e);
    }
  }, []);

  // Tự động điền nếu đã có currentUser
  useEffect(() => {
    if (currentUser) {
      if (currentUser.fullName && !patientName) {
        setPatientName(currentUser.fullName);
      }
      if (currentUser.phone && !phone) {
        setPhone(currentUser.phone);
      }
    }
  }, [currentUser]);

  // Lọc bác sĩ theo cơ sở và chuyên khoa đã chọn
  const filteredDoctors = useMemo(() => {
    return doctors.filter(doc => {
      // Lọc theo cơ sở
      if (selectedFacilityId) {
        const inFacility = doc.clinics?.some(c => c.facilityId === selectedFacilityId) || 
          (selectedFacilityId === 1 && !doc.user?.fullName?.includes('TP')) ||
          (selectedFacilityId === 2 && (doc.id >= 10 || doc.user?.fullName?.includes('HCM')));
        if (!inFacility && doc.clinics && doc.clinics.length > 0) return false;
      }
      // Lọc theo chuyên khoa
      if (selectedSpecialty) {
        const docSpecialty = doc.specialty?.name || doc.department?.name || '';
        if (docSpecialty !== selectedSpecialty) return false;
      }
      return true;
    });
  }, [doctors, selectedFacilityId, selectedSpecialty]);

  const selectedFacilityObj = facilities.find(f => f.id === selectedFacilityId);
  const selectedDoctorObj = doctors.find(d => (d.userId || d.user?.id || d.id) === selectedDoctorId);

  // Lưu thông tin draft
  const saveBookingDraft = () => {
    try {
      localStorage.setItem('medicare_draft_booking', JSON.stringify({
        facilityId: selectedFacilityId,
        specialtyName: selectedSpecialty,
        doctorId: selectedDoctorId,
        bookingDate: selectedDate,
        bookingTime: selectedTime,
        patientName: patientName.trim(),
        phone: phone.trim(),
        reason: reason.trim()
      }));
    } catch (err) {
      console.error('Failed to save draft:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!patientName.trim()) {
      setErrorMessage('Vui lòng nhập họ và tên của bạn');
      return;
    }
    if (!phone.trim()) {
      setErrorMessage('Vui lòng nhập số điện thoại');
      return;
    }
    if (!selectedDate) {
      setErrorMessage('Vui lòng chọn ngày khám');
      return;
    }
    if (!selectedTime) {
      setErrorMessage('Vui lòng chọn khung giờ khám');
      return;
    }

    // Luôn lưu dữ liệu tạm để không bị mất khi chuyển sang Đăng nhập / Đăng ký
    saveBookingDraft();

    // KIỂM TRA ĐĂNG NHẬP: Bắt buộc đăng nhập hoặc đăng ký mới được đặt lịch
    if (!isLoggedIn) {
      setShowAuthModal(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createLandingAppointment({
        facilityId: selectedFacilityId,
        facilityName: selectedFacilityObj?.name || 'MediCare',
        specialtyName: selectedSpecialty || (selectedDoctorObj?.specialty?.name) || 'Đa khoa',
        doctorId: selectedDoctorId,
        doctorName: selectedDoctorObj?.user?.fullName,
        bookingDate: selectedDate,
        bookingTime: selectedTime,
        patientName: patientName.trim(),
        phone: phone.trim(),
        reason: reason.trim() || 'Đặt lịch khám trực tuyến qua website MediCare'
      });

      if (res.success && res.details) {
        try {
          localStorage.removeItem('medicare_draft_booking');
        } catch {}
        setSuccessData(res.details);
      } else if (res.requireAuth) {
        setShowAuthModal(true);
      } else {
        setErrorMessage(res.message || 'Đặt lịch chưa thành công, vui lòng thử lại');
      }
    } catch {
      setErrorMessage('Không thể kết nối máy chủ, vui lòng thử lại sau');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setSuccessData(null);
    setPatientName('');
    setPhone('');
    setReason('');
    setSelectedDoctorId(0);
    setErrorMessage('');
  };

  return (
    <section id="dat-lich" className="py-20 bg-gradient-to-b from-white via-blue-50/40 to-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3 shadow-xs">
            <Sparkles size={14} className="text-blue-600" /> Đặt lịch khám trực tuyến
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Chủ động hẹn khám với <span className="text-blue-600">Bác sĩ chuyên khoa</span>
          </h2>
          <p className="text-gray-500 text-base md:text-lg mt-3 leading-relaxed">
            Tiết kiệm tối đa thời gian chờ đợi. Lựa chọn cơ sở bệnh viện, chuyên khoa và khung giờ khám phù hợp chỉ trong 1 phút.
          </p>
        </div>

        {/* Success Modal / State */}
        {successData ? (
          <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-emerald-100 animate-in zoom-in-95 duration-300">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">Đặt lịch khám thành công!</h3>
              <p className="text-sm text-gray-500 mb-6">
                Hệ thống MediCare đã ghi nhận lịch hẹn của bạn và gửi thông báo xác nhận.
              </p>

              {/* QR Code & Code Badge */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 max-w-sm mx-auto mb-6 text-center shadow-inner">
                <div className="bg-white p-3 rounded-xl inline-block shadow-sm mb-3">
                  <QRCode value={successData.appointmentCode || 'MEDICARE'} size={140} />
                </div>
                <div className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1">Mã lịch hẹn</div>
                <div className="text-2xl font-black text-blue-600 tracking-wider">
                  {successData.appointmentCode}
                </div>
                <p className="text-xs text-gray-400 mt-1">Xuất trình mã này tại quầy tiếp đón để nhận số ưu tiên</p>
              </div>

              {/* Details table */}
              <div className="bg-blue-50/60 rounded-2xl p-5 mb-8 text-left space-y-3 border border-blue-100 text-sm">
                <div className="flex justify-between items-center py-1 border-b border-blue-100/60">
                  <span className="text-gray-500">Họ và tên bệnh nhân:</span>
                  <span className="font-bold text-gray-900">{successData.patientName}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-blue-100/60">
                  <span className="text-gray-500">Số điện thoại:</span>
                  <span className="font-bold text-gray-900">{successData.phone}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-blue-100/60">
                  <span className="text-gray-500">Thời gian khám:</span>
                  <span className="font-bold text-blue-700">{successData.bookingTime} - Ngày {successData.bookingDate}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-blue-100/60">
                  <span className="text-gray-500">Bác sĩ phụ trách:</span>
                  <span className="font-bold text-gray-900">{successData.doctorName}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-blue-100/60">
                  <span className="text-gray-500">Chuyên khoa:</span>
                  <span className="font-semibold text-gray-900">{successData.specialty}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-500">Cơ sở khám:</span>
                  <span className="font-semibold text-gray-900 text-right">{successData.facilityName}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/patient/appointments"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3.5 rounded-xl transition-all shadow-md shadow-blue-200 flex items-center justify-center gap-2 text-sm"
                >
                  Xem lịch hẹn đã đặt <ExternalLink size={16} />
                </Link>
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold px-6 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <RotateCcw size={16} /> Đặt thêm lịch khác
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Booking Layout: Form on Left + Benefits on Right */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT: Interactive Booking Form */}
            <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-9 shadow-xl border border-gray-100">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* 1. Chọn Bệnh viện / Cơ sở */}
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                    <Building2 size={18} className="text-blue-600" />
                    <span>1. Chọn Cơ sở Bệnh viện MediCare</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {facilities.map((fac) => {
                      const isSelected = selectedFacilityId === fac.id;
                      return (
                        <button
                          key={fac.id}
                          type="button"
                          onClick={() => {
                            setSelectedFacilityId(fac.id);
                            setSelectedDoctorId(0);
                          }}
                          className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                            isSelected
                              ? 'border-blue-600 bg-blue-50/50 shadow-sm ring-2 ring-blue-500/20'
                              : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50/50'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold ${
                            isSelected ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {fac.id}
                          </div>
                          <div>
                            <div className="font-bold text-gray-900 text-sm">{fac.name}</div>
                            <div className="text-xs text-gray-500 line-clamp-1 mt-0.5">{fac.address}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Chọn Chuyên khoa & Bác sĩ */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                      <Stethoscope size={18} className="text-blue-600" />
                      <span>2. Chuyên khoa khám</span>
                    </label>
                    <select
                      value={selectedSpecialty}
                      onChange={(e) => {
                        setSelectedSpecialty(e.target.value);
                        setSelectedDoctorId(0);
                      }}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    >
                      <option value="">-- Tất cả chuyên khoa --</option>
                      {specialties.map((spec) => (
                        <option key={spec.id} value={spec.name}>
                          {spec.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                      <User size={18} className="text-blue-600" />
                      <span>Bác sĩ chỉ định (tùy chọn)</span>
                    </label>
                    <select
                      value={selectedDoctorId}
                      onChange={(e) => setSelectedDoctorId(Number(e.target.value))}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    >
                      <option value={0}>-- Hệ thống tự động sắp xếp bác sĩ giỏi --</option>
                      {filteredDoctors.map((doc) => {
                        const docId = doc.userId || doc.user?.id || doc.id;
                        const docSpecialty = doc.specialty?.name || doc.department?.name || 'Đa khoa';
                        const degree = doc.degree || 'BS';
                        return (
                          <option key={docId} value={docId}>
                            {degree}. {doc.user.fullName} ({docSpecialty})
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>

                {/* 3. Chọn Ngày khám */}
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                    <Calendar size={18} className="text-blue-600" />
                    <span>3. Chọn ngày khám</span>
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                    {availableDays.map((item) => {
                      const isSelected = selectedDate === item.dateStr;
                      return (
                        <button
                          key={item.dateStr}
                          type="button"
                          onClick={() => setSelectedDate(item.dateStr)}
                          className={`p-2.5 rounded-xl border text-center transition-all ${
                            isSelected
                              ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200'
                              : 'border-gray-200 hover:border-blue-400 bg-white text-gray-700'
                          }`}
                        >
                          <div className={`text-[11px] font-semibold ${isSelected ? 'text-blue-100' : 'text-gray-400'}`}>
                            {item.label}
                          </div>
                          <div className="text-sm font-extrabold mt-0.5">
                            {item.displayDate}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Chọn Giờ khám */}
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                    <Clock size={18} className="text-blue-600" />
                    <span>4. Khung giờ khám</span>
                  </label>
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Buổi sáng (07:30 - 11:30)</div>
                      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                        {MORNING_SLOTS.map((slot) => {
                          const isSelected = selectedTime === slot;
                          return (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => setSelectedTime(slot)}
                              className={`py-2 px-1 text-center rounded-lg text-xs font-bold transition-all border ${
                                isSelected
                                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                  : 'border-gray-200 hover:border-blue-300 text-gray-700 hover:bg-blue-50'
                              }`}
                            >
                              {slot}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Buổi chiều (13:30 - 17:30)</div>
                      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                        {AFTERNOON_SLOTS.map((slot) => {
                          const isSelected = selectedTime === slot;
                          return (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => setSelectedTime(slot)}
                              className={`py-2 px-1 text-center rounded-lg text-xs font-bold transition-all border ${
                                isSelected
                                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                  : 'border-gray-200 hover:border-blue-300 text-gray-700 hover:bg-blue-50'
                              }`}
                            >
                              {slot}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5. Thông tin bệnh nhân */}
                <div className="pt-2 border-t border-gray-100">
                  <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <User size={18} className="text-blue-600" />
                    <span>5. Thông tin người đến khám</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="relative">
                        <User size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                        <input
                          type="text"
                          required
                          value={patientName}
                          onChange={(e) => setPatientName(e.target.value)}
                          placeholder="Họ và tên bệnh nhân *"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="relative">
                        <Phone size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Số điện thoại nhận mã *"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="relative">
                      <FileText size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                      <input
                        type="text"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Triệu chứng hoặc lý do khám (ví dụ: đau đầu, đau dạ dày, tái khám...)"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2">
                    <AlertCircle size={18} className="shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Thông báo trạng thái tài khoản */}
                {!isLoggedIn ? (
                  <div className="p-4 bg-amber-50/90 border border-amber-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm text-amber-900">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center shrink-0 text-amber-700">
                        <Lock size={16} />
                      </div>
                      <div>
                        <div className="font-bold">Yêu cầu đăng nhập hoặc đăng ký</div>
                        <div className="text-amber-700/80 text-xs mt-0.5">Quý khách cần có tài khoản để hệ thống xác nhận lịch và lưu phiếu khám.</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <Link 
                        href="/login?redirect=/landing/dat-lich"
                        onClick={saveBookingDraft}
                        className="px-3.5 py-1.5 bg-white border border-amber-300 text-amber-900 font-bold rounded-lg hover:bg-amber-100 transition-colors text-xs flex items-center gap-1.5"
                      >
                        <LogIn size={13} /> Đăng nhập
                      </Link>
                      <Link 
                        href="/register?redirect=/landing/dat-lich"
                        onClick={saveBookingDraft}
                        className="px-3.5 py-1.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors text-xs flex items-center gap-1.5 shadow-sm"
                      >
                        <UserPlus size={13} /> Đăng ký
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-xs sm:text-sm text-emerald-900">
                    <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                    <span>Đang đặt lịch với tài khoản: <strong>{currentUser?.fullName}</strong> ({currentUser?.phone || 'Chưa cập nhật SĐT'})</span>
                  </div>
                )}

                {/* Submit Action */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-gray-500 flex items-center gap-1.5">
                    <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
                    <span>Miễn phí đặt trước. Thanh toán phí khám tại viện hoặc online.</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-blue-200 hover:scale-[1.02] flex items-center justify-center gap-2 text-base cursor-pointer disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>Đang xử lý đặt lịch...</span>
                      </>
                    ) : (
                      <>
                        <span>Xác nhận đặt lịch ngay</span>
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* RIGHT: Why Book Online & Quick Info */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Highlight Card */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-3xl p-7 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold mb-4">
                    <CheckCircle2 size={14} /> Tiện ích thông minh
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Lợi ích khi đặt trước</h3>
                  <p className="text-blue-100 text-sm mb-6 leading-relaxed">
                    Hệ thống phân luồng thông minh giúp người bệnh không phải xếp hàng lấy số sáng sớm.
                  </p>

                  <ul className="space-y-3.5 text-sm">
                    {[
                      'Không phải chờ đợi lấy số thứ tự tại viện',
                      'Ưu tiên vào khám đúng khung giờ đã chọn',
                      'Chủ động lựa chọn bác sĩ và chuyên khoa',
                      'Lưu trữ hồ sơ bệnh án và đơn thuốc điện tử',
                      'Nhắc lịch tự động qua SMS và Zalo trước ngày khám'
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-blue-50">
                        <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                          <Check size={12} className="text-white" />
                        </div>
                        <span className="leading-snug">{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8 pt-6 border-t border-white/20 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-blue-200">Tổng đài hỗ trợ 24/7</div>
                      <div className="text-lg font-black tracking-wide">0941.298.865</div>
                    </div>
                    <Link
                      href="/landing/dat-lich"
                      className="bg-white text-blue-700 font-bold px-4 py-2 rounded-xl text-xs hover:bg-blue-50 transition-colors shadow-sm"
                    >
                      Trang đặt lịch &rarr;
                    </Link>
                  </div>
                </div>
              </div>

              {/* 4 Steps Guide */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <h4 className="font-bold text-gray-900 text-base mb-4 flex items-center gap-2">
                  <Clock size={18} className="text-blue-600" /> Quy trình đi khám tại MediCare
                </h4>
                <div className="space-y-4">
                  {[
                    { step: '1', title: 'Đặt hẹn online', desc: 'Chọn ngày giờ, bác sĩ và nhận mã QR lịch khám' },
                    { step: '2', title: 'Đến viện trước 15 phút', desc: 'Quét mã QR tại cây Kiosk hoặc quầy tiếp đón ưu tiên' },
                    { step: '3', title: 'Vào phòng khám chuyên khoa', desc: 'Khám và tư vấn chuyên sâu cùng bác sĩ chuyên gia' },
                    { step: '4', title: 'Nhận kết quả trực tuyến', desc: 'Xem hồ sơ, đơn thuốc trực tiếp trên website hoặc ứng dụng' },
                  ].map((item) => (
                    <div key={item.step} className="flex gap-3">
                      <div className="w-7 h-7 rounded-xl bg-blue-50 text-blue-600 font-black text-xs flex items-center justify-center shrink-0 mt-0.5 border border-blue-100">
                        {item.step}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-sm">{item.title}</div>
                        <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

      </div>

      {/* ==========================================
          MODAL XÁC THỰC: YÊU CẦU ĐĂNG NHẬP / ĐĂNG KÝ
      ========================================== */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-gray-100 animate-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 flex items-center justify-center transition-colors"
            >
              <X size={18} />
            </button>

            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
                <Lock size={28} />
              </div>
              <h3 className="text-2xl font-black text-gray-900">Yêu cầu Đăng nhập hoặc Đăng ký</h3>
              <p className="text-gray-500 text-xs sm:text-sm mt-1.5 leading-relaxed">
                Để bảo vệ thông tin sức khỏe và xuất phiếu khám điện tử, quý khách vui lòng đăng nhập hoặc đăng ký tài khoản MediCare.
              </p>
            </div>

            {/* Tóm tắt lịch hẹn đã chọn */}
            <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-4 mb-6 text-xs sm:text-sm text-gray-700 space-y-2">
              <div className="font-bold text-blue-900 border-b border-blue-100 pb-1.5 flex items-center gap-1.5">
                <CalendarDays size={16} className="text-blue-600" /> Thông tin lịch hẹn của bạn:
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Cơ sở:</span>
                <span className="font-semibold text-gray-900">{selectedFacilityObj?.name || 'MediCare'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Chuyên khoa:</span>
                <span className="font-semibold text-gray-900">{selectedSpecialty || selectedDoctorObj?.specialty?.name || 'Đa khoa'}</span>
              </div>
              {selectedDoctorObj && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Bác sĩ:</span>
                  <span className="font-semibold text-gray-900">{selectedDoctorObj.user?.fullName}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">Thời gian:</span>
                <span className="font-bold text-blue-700">{selectedTime} - {selectedDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Người khám:</span>
                <span className="font-semibold text-gray-900">{patientName} ({phone})</span>
              </div>
            </div>

            {/* Các nút hành động */}
            <div className="space-y-3">
              <Link
                href="/login?redirect=/landing/dat-lich"
                onClick={saveBookingDraft}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-200 hover:scale-[1.01] transition-all text-sm sm:text-base cursor-pointer"
              >
                <LogIn size={18} />
                <span>Đăng nhập để xác nhận lịch khám</span>
              </Link>

              <Link
                href="/register?redirect=/landing/dat-lich"
                onClick={saveBookingDraft}
                className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-2 border-emerald-500 font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 hover:scale-[1.01] transition-all text-sm sm:text-base cursor-pointer"
              >
                <UserPlus size={18} />
                <span>Đăng ký tài khoản mới</span>
              </Link>
            </div>

            <div className="mt-5 text-center">
              <p className="text-[11px] text-gray-500 leading-relaxed">
                💡 Thông tin lịch hẹn đã được lưu an toàn. Sau khi đăng nhập, hệ thống sẽ tự động đưa bạn quay lại hoàn tất việc đặt khám.
              </p>
              <button
                type="button"
                onClick={() => setShowAuthModal(false)}
                className="mt-3 text-xs text-gray-500 hover:text-gray-800 underline font-medium"
              >
                Quay lại chỉnh sửa thông tin khám
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

