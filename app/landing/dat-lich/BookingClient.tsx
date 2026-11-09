'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import QRCode from 'react-qr-code';
import { 
  Calendar, Clock, User, Phone, FileText, CheckCircle2, 
  Stethoscope, ArrowRight, ShieldCheck, 
  Building2, RotateCcw, AlertCircle, Loader2, Check, 
  CalendarDays, HelpCircle, ChevronDown, 
  ChevronUp, ExternalLink, LogIn, UserPlus, Lock, X
} from 'lucide-react';
import { createLandingAppointment } from './actions';

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
  clinics?: Array<{ id: number; name: string }>;
}

interface Specialty {
  id: number;
  name: string;
}

interface Doctor {
  id: number;
  userId?: number;
  user: {
    id: number;
    fullName: string;
    avatar?: string | null;
    phone?: string | null;
    address?: string | null;
  };
  degree?: string | null;
  experience?: string | null;
  price?: number | null;
  bio?: string | null;
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

interface Props {
  facilities: Facility[];
  specialties: Specialty[];
  doctors: Doctor[];
  bookingLink?: string;
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

const DOCTOR_AVATARS = [
  '/images/doctors/doctor-3.jpg',
];

const FAQS = [
  {
    q: 'Tôi có cần trả phí khi đặt lịch hẹn trực tuyến không?',
    a: 'Hoàn toàn KHÔNG. Việc đặt lịch khám trực tuyến trên hệ thống MediCare là hoàn toàn miễn phí. Quý khách chỉ thanh toán chi phí khám và xét nghiệm khi đến trực tiếp tại bệnh viện hoặc qua cổng thanh toán bảo mật.'
  },
  {
    q: 'Khi đi khám tôi cần mang theo những giấy tờ gì?',
    a: 'Quý khách vui lòng mang theo Căn cước công dân (CCCD/CMND), Thẻ BHYT (nếu có), các sổ khám và kết quả xét nghiệm, đơn thuốc cũ (nếu có) để bác sĩ tiện theo dõi lịch sử bệnh lý.'
  },
  {
    q: 'Tôi có thể đổi ngày hoặc hủy lịch khám đã đặt không?',
    a: 'Có. Quý khách có thể truy cập mục Quản lý lịch hẹn sau khi đăng nhập bằng số điện thoại, hoặc liên hệ trực tiếp Tổng đài 0941.298.865 trước giờ khám ít nhất 2 tiếng để được nhân viên hỗ trợ đổi lịch nhanh chóng.'
  },
  {
    q: 'Hệ thống bệnh viện MediCare có hỗ trợ BHYT không?',
    a: 'Có. Cả 2 cơ sở MediCare tại Hà Nội và TP.HCM đều tiếp nhận khám chữa bệnh thông tuyến BHYT theo đúng quy định hiện hành của Bộ Y Tế.'
  }
];

export default function BookingClient({
  facilities = [],
  specialties = [],
  doctors = [],
  bookingLink = '/login',
  isLoggedIn = false,
  currentUser = null
}: Props) {
  // Mode: 'quick' | 'by-doctor'
  const [bookingMode, setBookingMode] = useState<'quick' | 'by-doctor'>('quick');

  // Days
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
  const [gender, setGender] = useState<string>('Nam');
  const [dob, setDob] = useState<string>('');
  const [reason, setReason] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successData, setSuccessData] = useState<BookingConfirmation | null>(null);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

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
        if (parsed.dob) setDob(parsed.dob);
        if (parsed.gender) setGender(parsed.gender);
        if (parsed.reason) setReason(parsed.reason);
      }
    } catch (e) {
      console.error('Failed to restore draft booking:', e);
    }
  }, []);

  // Tự động điền thông tin người dùng nếu đã đăng nhập
  useEffect(() => {
    if (currentUser) {
      if (currentUser.fullName && !patientName) {
        setPatientName(currentUser.fullName);
      }
      if (currentUser.phone && !phone) {
        setPhone(currentUser.phone);
      }
      if (currentUser.dob && !dob) {
        try {
          const d = new Date(currentUser.dob);
          if (!isNaN(d.getTime())) {
            setDob(d.toISOString().split('T')[0]);
          }
        } catch {}
      }
      if (currentUser.gender && !gender) {
        setGender(currentUser.gender);
      }
    }
  }, [currentUser]);

  // Filtered doctors
  const filteredDoctors = useMemo(() => {
    return doctors.filter(doc => {
      if (selectedFacilityId) {
        const inFacility = doc.clinics?.some(c => c.facilityId === selectedFacilityId) || 
          (selectedFacilityId === 1 && !doc.user?.fullName?.includes('TP')) ||
          (selectedFacilityId === 2 && (doc.id >= 10 || doc.user?.fullName?.includes('HCM')));
        if (!inFacility && doc.clinics && doc.clinics.length > 0) return false;
      }
      if (selectedSpecialty) {
        const docSpecialty = doc.specialty?.name || doc.department?.name || '';
        if (docSpecialty !== selectedSpecialty) return false;
      }
      return true;
    });
  }, [doctors, selectedFacilityId, selectedSpecialty]);

  const selectedFacilityObj = facilities.find(f => f.id === selectedFacilityId);
  const selectedDoctorObj = doctors.find(d => (d.userId || d.user?.id || d.id) === selectedDoctorId);

  // Lưu thông tin draft vào localStorage
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
        gender,
        dob,
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
      setErrorMessage('Vui lòng nhập họ và tên của người khám');
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
        gender,
        dob,
        reason: reason.trim() || 'Đặt lịch khám trực tuyến qua website MediCare'
      });

      if (res.success && res.details) {
        try {
          localStorage.removeItem('medicare_draft_booking');
        } catch {}
        setSuccessData(res.details);
        window.scrollTo({ top: 200, behavior: 'smooth' });
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
    <div className="space-y-16">
      
      {/* 1. SUCCESS VIEW (If booked) */}
      {successData ? (
        <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-emerald-100 animate-in zoom-in-95 duration-300">
          <div className="text-center">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm">
              <CheckCircle2 size={44} />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Đặt lịch khám thành công!</h2>
            <p className="text-gray-500 max-w-lg mx-auto mb-8 text-sm sm:text-base">
              Hệ thống MediCare đã tiếp nhận lịch hẹn của bạn. Bạn có thể xuất trình mã QR hoặc mã lịch hẹn này khi đến bệnh viện.
            </p>

            {/* QR Card */}
            <div className="bg-gradient-to-br from-slate-50 to-blue-50/40 border border-slate-200 rounded-3xl p-6 max-w-md mx-auto mb-8 shadow-sm">
              <div className="bg-white p-4 rounded-2xl inline-block shadow-md mb-4">
                <QRCode value={successData.appointmentCode || 'MEDICARE'} size={160} />
              </div>
              <div className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-1">Mã lịch hẹn</div>
              <div className="text-3xl font-black text-blue-600 tracking-wider">
                {successData.appointmentCode}
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Trạng thái: <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">Chờ xác nhận</span>
              </div>
            </div>

            {/* Details */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-8 text-left space-y-3.5 shadow-sm">
              <h4 className="font-bold text-gray-900 text-base pb-3 border-b border-gray-100 flex items-center gap-2">
                <FileText size={18} className="text-blue-600" /> Thông tin chi tiết phiếu đặt hẹn
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400 text-xs block">Họ và tên bệnh nhân</span>
                  <span className="font-bold text-gray-900">{successData.patientName}</span>
                </div>
                <div>
                  <span className="text-gray-400 text-xs block">Số điện thoại</span>
                  <span className="font-bold text-gray-900">{successData.phone}</span>
                </div>
                <div>
                  <span className="text-gray-400 text-xs block">Thời gian khám</span>
                  <span className="font-bold text-blue-600">{successData.bookingTime} - {successData.bookingDate}</span>
                </div>
                <div>
                  <span className="text-gray-400 text-xs block">Chuyên khoa</span>
                  <span className="font-semibold text-gray-800">{successData.specialty}</span>
                </div>
                <div>
                  <span className="text-gray-400 text-xs block">Bác sĩ phụ trách</span>
                  <span className="font-bold text-gray-900">{successData.doctorName}</span>
                </div>
                <div>
                  <span className="text-gray-400 text-xs block">Cơ sở khám</span>
                  <span className="font-semibold text-gray-800">{successData.facilityName}</span>
                </div>
              </div>
            </div>

            {/* Next steps guide */}
            <div className="bg-blue-50/80 rounded-2xl p-5 mb-8 text-left text-xs sm:text-sm text-blue-900 border border-blue-100">
              <div className="font-bold mb-1.5 flex items-center gap-1.5 text-blue-700">
                <ShieldCheck size={16} /> Lưu ý khi đến viện:
              </div>
              <ul className="list-disc list-inside space-y-1 text-blue-800">
                <li>Quý khách vui lòng đến trước giờ hẹn <strong>15 phút</strong> để làm thủ tục tiếp đón.</li>
                <li>Xuất trình mã lịch hẹn trên điện thoại tại Quầy tiếp đón ưu tiên MediCare.</li>
                <li>Nếu cần hỗ trợ gấp hoặc thay đổi thời gian, gọi hotline <strong>0941.298.865</strong>.</li>
              </ul>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/patient/appointments"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-7 py-3.5 rounded-xl transition-all shadow-md shadow-blue-200 flex items-center justify-center gap-2 text-sm"
              >
                Vào cổng bệnh nhân <ExternalLink size={16} />
              </Link>
              <button
                type="button"
                onClick={handleResetForm}
                className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold px-7 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
              >
                <RotateCcw size={16} /> Đặt lịch hẹn mới
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* 2. BOOKING FORM & WIZARD */
        <div>
          {/* Mode Switcher */}
          <div className="flex justify-center mb-10">
            <div className="bg-gray-100 p-1.5 rounded-2xl flex max-w-md w-full shadow-inner border border-gray-200">
              <button
                type="button"
                onClick={() => setBookingMode('quick')}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                  bookingMode === 'quick'
                    ? 'bg-white text-blue-600 shadow-md'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                <CalendarDays size={18} /> Đặt theo Chuyên khoa
              </button>
              <button
                type="button"
                onClick={() => setBookingMode('by-doctor')}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                  bookingMode === 'by-doctor'
                    ? 'bg-white text-blue-600 shadow-md'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                <Stethoscope size={18} /> Đặt theo Bác sĩ
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* MAIN FORM */}
            <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-gray-100">
              <form onSubmit={handleSubmit} className="space-y-7">
                
                {/* 1. Cơ sở */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Building2 size={18} className="text-blue-600" />
                    <span>Bước 1: Chọn Cơ sở Bệnh viện khám bệnh</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {facilities.map((fac) => {
                      const isSelected = selectedFacilityId === fac.id;
                      return (
                        <div
                          key={fac.id}
                          onClick={() => {
                            setSelectedFacilityId(fac.id);
                            setSelectedDoctorId(0);
                          }}
                          className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3.5 ${
                            isSelected
                              ? 'border-blue-600 bg-blue-50/50 shadow-md ring-2 ring-blue-500/20'
                              : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-sm font-black ${
                            isSelected ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {fac.id}
                          </div>
                          <div>
                            <div className="font-bold text-gray-900 text-sm">{fac.name}</div>
                            <div className="text-xs text-gray-500 line-clamp-1 mt-0.5">{fac.address}</div>
                            <span className="inline-block mt-2 text-[11px] font-bold text-blue-600 bg-blue-100/60 px-2 py-0.5 rounded">
                              Đạt chuẩn Bộ Y Tế
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Chuyên khoa hoặc Bác sĩ */}
                {bookingMode === 'quick' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <Stethoscope size={18} className="text-blue-600" />
                        <span>Bước 2: Chọn Chuyên khoa</span>
                      </label>
                      <select
                        value={selectedSpecialty}
                        onChange={(e) => {
                          setSelectedSpecialty(e.target.value);
                          setSelectedDoctorId(0);
                        }}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
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
                      <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <User size={18} className="text-blue-600" />
                        <span>Bác sĩ chỉ định (tùy chọn)</span>
                      </label>
                      <select
                        value={selectedDoctorId}
                        onChange={(e) => setSelectedDoctorId(Number(e.target.value))}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      >
                        <option value={0}>-- Hệ thống tự động chọn bác sĩ phù hợp --</option>
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
                ) : (
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-3 flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Stethoscope size={18} className="text-blue-600" />
                        <span>Bước 2: Chọn Bác sĩ chuyên khoa</span>
                      </span>
                      <span className="text-xs text-gray-400 font-normal">
                        ({filteredDoctors.length} bác sĩ sẵn sàng nhận lịch)
                      </span>
                    </label>

                    {/* Filter by specialty inline */}
                    <div className="flex gap-2 overflow-x-auto pb-3 mb-4 custom-scrollbar text-xs">
                      <button
                        type="button"
                        onClick={() => setSelectedSpecialty('')}
                        className={`px-3 py-1.5 rounded-full whitespace-nowrap font-semibold transition ${
                          selectedSpecialty === '' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        Tất cả
                      </button>
                      {specialties.slice(0, 6).map((spec) => (
                        <button
                          key={spec.id}
                          type="button"
                          onClick={() => setSelectedSpecialty(spec.name)}
                          className={`px-3 py-1.5 rounded-full whitespace-nowrap font-semibold transition ${
                            selectedSpecialty === spec.name ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {spec.name}
                        </button>
                      ))}
                    </div>

                    {/* Doctors list cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto p-1">
                      {filteredDoctors.map((doc, idx) => {
                        const docId = doc.userId || doc.user?.id || doc.id;
                        const isSelected = selectedDoctorId === docId;
                        const avatar = doc.user.avatar || DOCTOR_AVATARS[idx % DOCTOR_AVATARS.length];
                        const docSpecialty = doc.specialty?.name || doc.department?.name || 'Đa khoa';
                        const degree = doc.degree || 'Bác sĩ chuyên khoa';
                        const price = doc.price ? `${doc.price.toLocaleString('vi-VN')}đ` : '150.000đ';

                        return (
                          <div
                            key={docId}
                            onClick={() => setSelectedDoctorId(docId)}
                            className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
                              isSelected
                                ? 'border-blue-600 bg-blue-50/60 shadow-sm'
                                : 'border-gray-200 hover:border-blue-300 bg-white'
                            }`}
                          >
                            <img
                              src={avatar}
                              alt={doc.user.fullName}
                              className="w-12 h-12 rounded-full object-cover border border-gray-200"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="text-[11px] font-semibold text-gray-400 uppercase">{degree}</div>
                              <div className="font-bold text-gray-900 text-sm truncate">{doc.user.fullName}</div>
                              <div className="text-xs text-blue-600 font-semibold truncate">{docSpecialty}</div>
                            </div>
                            <div className="text-right shrink-0">
                              <div className="text-xs font-bold text-gray-900">{price}</div>
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center mt-1 ml-auto ${
                                isSelected ? 'bg-blue-600 text-white' : 'border border-gray-300'
                              }`}>
                                {isSelected && <Check size={12} />}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 3. Chọn Ngày khám */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <Calendar size={18} className="text-blue-600" />
                    <span>Bước 3: Chọn ngày khám</span>
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
                  <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <Clock size={18} className="text-blue-600" />
                    <span>Bước 4: Chọn khung giờ khám</span>
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
                  <label className="block text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <User size={18} className="text-blue-600" />
                    <span>Bước 5: Thông tin người đến khám</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                    <div className="relative">
                      <Phone size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Số điện thoại nhận tin nhắn *"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                    <div>
                      <input
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        placeholder="Ngày sinh"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </div>
                    <div className="flex gap-4 items-center px-4 bg-gray-50 border border-gray-200 rounded-xl">
                      <span className="text-xs text-gray-500 font-semibold">Giới tính:</span>
                      <label className="flex items-center gap-1.5 text-sm text-gray-700 cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          value="Nam"
                          checked={gender === 'Nam'}
                          onChange={() => setGender('Nam')}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span>Nam</span>
                      </label>
                      <label className="flex items-center gap-1.5 text-sm text-gray-700 cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          value="Nữ"
                          checked={gender === 'Nữ'}
                          onChange={() => setGender('Nữ')}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span>Nữ</span>
                      </label>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="relative">
                      <FileText size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                      <input
                        type="text"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Triệu chứng hoặc lý do khám bệnh (ví dụ: sốt, đau ngực, khám tổng quát...)"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2">
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

                {/* Submit button */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-gray-500 flex items-center gap-1.5">
                    <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
                    <span>Bảo mật thông tin 100%. Xác nhận lịch hẹn tức thì.</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold px-9 py-4 rounded-xl transition-all shadow-lg shadow-blue-200 hover:scale-[1.02] flex items-center justify-center gap-2 text-base cursor-pointer disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>Đang xử lý đặt lịch...</span>
                      </>
                    ) : (
                      <>
                        <span>Xác nhận đặt lịch khám</span>
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </div>

              </form>
            </div>

            {/* SIDEBAR RIGHT */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Hotlines */}
              <div className="bg-gradient-to-br from-blue-700 to-indigo-800 text-white rounded-3xl p-7 shadow-xl">
                <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-xs font-bold mb-4">
                  <Phone size={14} /> Hỗ trợ đặt lịch 24/7
                </div>
                <h3 className="text-xl font-bold mb-2">Cần tư vấn trực tiếp?</h3>
                <p className="text-blue-100 text-xs mb-5 leading-relaxed">
                  Đội ngũ điều phối viên y tế MediCare luôn sẵn sàng hỗ trợ bạn chọn đúng chuyên khoa và bác sĩ.
                </p>
                <div className="bg-white/10 backdrop-blur rounded-2xl p-4 mb-4 border border-white/20">
                  <div className="text-xs text-blue-200">Hotline toàn quốc</div>
                  <div className="text-2xl font-black tracking-wide text-white">0941.298.865</div>
                </div>
                <div className="text-xs text-blue-200">
                  Thời gian làm việc: <strong>07:00 - 20:00</strong> tất cả các ngày trong tuần (kể cả Thứ 7 & CN).
                </div>
              </div>

              {/* 4 Steps */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <h4 className="font-bold text-gray-900 text-base mb-4 flex items-center gap-2">
                  <Clock size={18} className="text-blue-600" /> Quy trình khám bệnh tại viện
                </h4>
                <div className="space-y-4">
                  {[
                    { step: '1', title: 'Đặt hẹn online', desc: 'Chọn giờ khám, chuyên khoa và nhận mã lịch hẹn' },
                    { step: '2', title: 'Tiếp đón ưu tiên', desc: 'Đến trước 15 phút, quét mã QR tại quầy đón tiếp' },
                    { step: '3', title: 'Khám chuyên khoa', desc: 'Bác sĩ thăm khám, chỉ định xét nghiệm nếu cần' },
                    { step: '4', title: 'Nhận kết quả số hóa', desc: 'Xem hồ sơ bệnh án và đơn thuốc trên cổng bệnh nhân' },
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

              {/* Patient portal callout */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 text-emerald-900">
                <div className="flex items-center gap-2 font-bold mb-2 text-emerald-800">
                  <ShieldCheck size={20} className="text-emerald-600" /> Đã có tài khoản MediCare?
                </div>
                <p className="text-xs text-emerald-700 leading-relaxed mb-4">
                  Đăng nhập để tự động điền thông tin, quản lý lịch sử khám, kết quả xét nghiệm và đơn thuốc điện tử.
                </p>
                <Link
                  href={`${bookingLink}?redirect=/patient/appointments`}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs block text-center transition-colors shadow-sm"
                >
                  Đăng nhập cổng bệnh nhân &rarr;
                </Link>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* 3. FAQ SECTION */}
      <section className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-gray-100">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase mb-2">
              <HelpCircle size={14} /> Giải đáp thắc mắc
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Câu hỏi thường gặp khi đặt lịch khám</h3>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIdx === idx;
              return (
                <div
                  key={idx}
                  className="border border-gray-200 rounded-2xl overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left font-bold text-gray-900 text-sm sm:text-base flex justify-between items-center gap-4 hover:bg-gray-50"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp size={18} className="text-blue-600 shrink-0" /> : <ChevronDown size={18} className="text-gray-400 shrink-0" />}
                  </button>
                  {isOpen && (
                    <div className="p-4 sm:p-5 pt-0 text-sm text-gray-600 leading-relaxed border-t border-gray-100 bg-slate-50/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

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

    </div>
  );
}

