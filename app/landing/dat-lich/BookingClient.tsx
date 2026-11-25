'use client';

import { startTransition, useEffect, useMemo, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import Link from 'next/link';
import QRCode from 'react-qr-code';
import { CalendarDays, CheckCircle2, Clock, Loader2, Phone, ShieldCheck, Stethoscope, User, X } from 'lucide-react';
import { createLandingAppointment, getLandingAvailability } from './actions';
import { normalizeBookingDate, storedBookingDate, vietnamDateTime, type BookableSchedule, type BookingPatient } from '@/lib/booking-utils';

interface Props {
  facilities: Array<{ id: number; name: string; address: string }>;
  specialties: Array<{ id: number; name: string }>;
  doctors: Array<{
    id: number; userId: number; user: { id: number; fullName: string; avatar?: string | null };
    degree?: string | null; price?: number | null;
  }>;
  bookingLink?: string;
  isLoggedIn?: boolean;
  currentUser?: BookingPatient | null;
  patients: BookingPatient[];
}

type Confirmation = NonNullable<Awaited<ReturnType<typeof createLandingAppointment>>['details']>;
const DRAFT_KEY = 'medicare_booking_v2';
const fieldClass = 'w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60';
const choiceButtonClass = 'rounded-xl border px-4 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50';
const selectedChoiceClass = 'border-blue-600 bg-blue-600 text-white hover:border-blue-700 hover:bg-blue-700';
const unselectedChoiceClass = 'border-gray-200 bg-white text-gray-700 hover:border-blue-400';
const resetButtonClass = `${choiceButtonClass} ${unselectedChoiceClass}`;

function storeDraft(draft: Record<string, unknown>) {
  try {
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ ...draft, version: 2, createdAt: Date.now() }));
  } catch {}
}

export default function BookingClient({ facilities, specialties, doctors, isLoggedIn = false, currentUser = null, patients }: Props) {
  const [bookingMode, setBookingMode] = useState<'quick' | 'by-doctor'>('quick');
  const [facilityId, setFacilityId] = useState(facilities[0]?.id || 0);
  const [specialtyId, setSpecialtyId] = useState(0);
  const [doctorId, setDoctorId] = useState(0);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [patientId, setPatientId] = useState(patients[0]?.id || 0);
  const [phone, setPhone] = useState('');
  const [reason, setReason] = useState('');
  const [refresh, setRefresh] = useState(0);
  const [availability, setAvailability] = useState<{ facilityId: number; loading: boolean; schedules: BookableSchedule[]; error: string }>({ facilityId: 0, loading: true, schedules: [], error: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState<Confirmation | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const requestId = useRef('');
  const submitting = useRef(false);
  const patient = patients.find(p => p.id === patientId);
  const facility = facilities.find(f => f.id === facilityId);
  const loading = availability.loading || availability.facilityId !== facilityId;
  const schedules = useMemo(() => availability.facilityId === facilityId && !availability.error ? availability.schedules : [], [availability, facilityId]);
  const shownSpecialties = specialties.filter(s => schedules.some(schedule => schedule.specialtyId === s.id));
  const specialtySchedules = schedules.filter(s => !specialtyId || s.specialtyId === specialtyId);
  const shownDoctors = doctors.filter(d => specialtySchedules.some(s => s.doctorId === d.userId));
  const matchingSchedules = specialtySchedules.filter(s => !doctorId || s.doctorId === doctorId);
  const days = [...new Set(matchingSchedules.filter(s => s.times.length > 0).map(s => s.date))].sort();
  const selectedDate = date ? (days.includes(date) ? date : '') : days.find(day => matchingSchedules.some(s => s.date === day && s.availableTimes.length > 0)) || '';
  const daySchedules = matchingSchedules.filter(s => s.date === selectedDate);
  const times = [...new Set(daySchedules.flatMap(s => s.times))].sort();
  const candidates = daySchedules.filter(s => s.availableTimes.includes(time)).sort((a, b) => a.appointmentCount - b.appointmentCount || a.doctorId - b.doctorId || a.id - b.id);
  const selectedSchedule = candidates[0];
  const selectedTime = selectedSchedule ? time : '';

  useEffect(() => {
    let active = true;
    // Read browser storage after hydration; cancel the read on unmount.
    queueMicrotask(() => {
    if (!active) return;
    // The old draft included patient details and could leak across accounts.
    try { localStorage.removeItem('medicare_draft_booking'); } catch {}
    try {
      const draft = JSON.parse(sessionStorage.getItem(DRAFT_KEY) || 'null');
      if (!draft || draft.version !== 2 || typeof draft.createdAt !== 'number' || Date.now() - draft.createdAt > 30 * 60 * 1000
        || (draft.ownerId !== null && draft.ownerId !== currentUser?.id)) {
        sessionStorage.removeItem(DRAFT_KEY);
        return;
      }
      if (facilities.some(f => f.id === draft.facilityId)) setFacilityId(draft.facilityId);
      if (specialties.some(s => s.id === draft.specialtyId)) setSpecialtyId(draft.specialtyId);
      if (doctors.some(d => d.userId === draft.doctorId)) setDoctorId(draft.doctorId);
      if (draft.mode === 'by-doctor') setBookingMode('by-doctor');
      if (normalizeBookingDate(draft.date)) setDate(draft.date);
      if (typeof draft.time === 'string') setTime(draft.time);
      if (patients.some(p => p.id === draft.patientId)) setPatientId(draft.patientId);
      if (typeof draft.requestId === 'string' && draft.requestId.length <= 100) requestId.current = draft.requestId;
    } catch { try { sessionStorage.removeItem(DRAFT_KEY); } catch {} }
    });
    return () => { active = false; };
    // Initial props are the authorized profiles for this page load.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let active = true;
    startTransition(async () => {
      setAvailability({ facilityId, loading: true, schedules: [], error: '' });
      try {
        const result = await getLandingAvailability(facilityId);
        if (active) setAvailability({ facilityId, loading: false, schedules: result.schedules, error: result.success ? '' : result.message || 'Không thể tải lịch khám.' });
      } catch {
        if (active) setAvailability({ facilityId, loading: false, schedules: [], error: 'Không thể tải lịch khám. Vui lòng thử lại.' });
      }
    });
    return () => { active = false; };
  }, [facilityId, refresh]);

  useEffect(() => {
    const reload = () => setRefresh(value => value + 1);
    window.addEventListener('focus', reload);
    return () => window.removeEventListener('focus', reload);
  }, []);

  const saveDraft = () => {
    if (!requestId.current) requestId.current = crypto.randomUUID();
    storeDraft({
      ownerId: currentUser?.id || null,
      facilityId, specialtyId, doctorId, date: selectedDate, time: selectedTime, patientId,
      mode: bookingMode, requestId: requestId.current,
    });
  };

  function resetSlot() { setDate(''); setTime(''); setError(''); requestId.current = ''; }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    setError('');
    if (loading || !selectedSchedule || !selectedTime || (bookingMode === 'by-doctor' && !doctorId)) {
      setError('Vui lòng chọn bác sĩ (nếu khám theo bác sĩ) và một giờ khám còn trống.');
      return;
    }
    saveDraft();
    if (!isLoggedIn) { setShowAuth(true); return; }
    if (!patient) { setError('Vui lòng chọn hồ sơ người khám đã liên kết với tài khoản.'); return; }
    if (!patient.phone && !/^0\d{9}$/.test(phone.replace(/\D/g, ''))) { setError('Vui lòng bổ sung số điện thoại gồm 10 số, bắt đầu bằng 0.'); return; }
    submitting.current = true;
    setIsSubmitting(true);
    try {
      const result = await createLandingAppointment({
        facilityId, specialtyId: specialtyId || undefined, doctorId: selectedSchedule.doctorId,
        scheduleId: selectedSchedule.id, patientId: patient.id, bookingDate: selectedDate, bookingTime: selectedTime,
        phone: patient.phone || phone, reason, requestId: requestId.current,
      });
      if (result.success && result.details) {
        setSuccess(result.details);
        try { sessionStorage.removeItem(DRAFT_KEY); } catch {}
        window.scrollTo({ top: 200, behavior: 'smooth' });
      } else {
        setError(result.message || 'Đặt lịch chưa thành công. Vui lòng thử lại.');
        if (result.requireAuth) setShowAuth(true);
        if (result.refreshAvailability) { setTime(''); setRefresh(value => value + 1); }
      }
    } catch { setError('Không thể kết nối máy chủ. Bạn có thể thử lại yêu cầu này.'); }
    finally { submitting.current = false; setIsSubmitting(false); }
  }

  if (success) return (
    <div className="mx-auto max-w-3xl rounded-3xl border border-emerald-100 bg-white p-8 text-center shadow-xl sm:p-12">
      <CheckCircle2 size={64} className="mx-auto mb-5 text-emerald-600" />
      <h2 className="mb-3 text-3xl font-extrabold text-gray-900">Đặt lịch khám thành công!</h2>
      <p className="mb-6 text-gray-600">Lịch hẹn của bạn đang chờ xác nhận. Vui lòng lưu mã lịch hẹn để xuất trình khi đến khám.</p>
      <div className="mx-auto mb-6 w-fit rounded-2xl border border-gray-200 p-5">
        <QRCode value={success.appointmentCode} size={160} className="mx-auto" />
        <p className="mt-4 break-all text-sm font-bold text-blue-700">{success.appointmentCode}</p>
      </div>
      <dl className="mb-6 grid gap-4 rounded-2xl bg-blue-50 p-6 text-left sm:grid-cols-2">
        {[
          ['Người khám', success.patientName], ['Điện thoại', success.phone],
          ['Ngày và giờ', `${success.bookingTime} - ${success.bookingDate}`], ['Chuyên khoa', success.specialty],
          ['Bác sĩ', success.doctorName], ['Địa điểm', success.room],
        ].map(([label, value]) => <div key={label}><dt className="text-sm text-gray-500">{label}</dt><dd className="font-semibold text-gray-900">{value || 'Chưa cập nhật'}</dd></div>)}
      </dl>
      <p className="mb-6 text-sm text-gray-600">Vui lòng đến trước giờ hẹn 15 phút để làm thủ tục tiếp đón.</p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/patient/my-appointments" className="rounded-xl bg-blue-600 px-5 py-3 font-bold text-white">Xem lịch hẹn</Link>
        <button type="button" className={resetButtonClass} onClick={() => { setSuccess(null); requestId.current = ''; resetSlot(); setReason(''); setRefresh(value => value + 1); }}>Đặt lịch khác</button>
      </div>
    </div>
  );

  return (
    <div className="grid items-start gap-8 lg:grid-cols-3">
      <section className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-lg lg:col-span-2">
        <div className="border-b border-gray-100 bg-blue-50/60 p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-gray-900">Chọn lịch khám phù hợp</h2>
          <p className="mt-2 text-sm text-gray-600">Các giờ khám được lấy từ lịch trực thực tế của bác sĩ trong 30 ngày tới.</p>
          <div className="mt-5 flex gap-2">
            {(['quick', 'by-doctor'] as const).map(mode => <button type="button" key={mode} onClick={() => { setBookingMode(mode); setDoctorId(0); resetSlot(); }} className={`rounded-xl px-4 py-3 text-sm font-bold ${bookingMode === mode ? 'bg-blue-600 text-white' : 'border border-gray-200 bg-white text-gray-700'}`}>{mode === 'quick' ? 'Đặt lịch nhanh' : 'Khám theo bác sĩ'}</button>)}
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-7 p-6 sm:p-8">
          <fieldset disabled={isSubmitting} className="space-y-7 disabled:opacity-70">
            <div>
              <h3 className="mb-3 font-bold text-gray-900">1. Chọn cơ sở khám</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {facilities.map(f => <button type="button" key={f.id} onClick={() => { setFacilityId(f.id); setSpecialtyId(0); setDoctorId(0); resetSlot(); }} aria-pressed={facilityId === f.id} className={`rounded-2xl border-2 p-4 text-left ${facilityId === f.id ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}><span className="block font-bold text-gray-900">{f.name}</span><span className="mt-1 block text-sm text-gray-600">{f.address}</span></button>)}
              </div>
              {!facilities.length && <p role="alert" className="text-sm text-red-600">Hiện chưa có cơ sở khám hoạt động.</p>}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block space-y-2"><span className="font-bold text-gray-900">2. Chuyên khoa</span>
                <select className={fieldClass} value={specialtyId} disabled={loading} onChange={event => { setSpecialtyId(Number(event.target.value)); setDoctorId(0); resetSlot(); }}>
                  <option value={0}>Tất cả chuyên khoa có lịch trực</option>
                  {!!specialtyId && !shownSpecialties.some(s => s.id === specialtyId) && <option value={specialtyId}>Chuyên khoa đã chọn chưa có lịch trực</option>}
                  {shownSpecialties.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </label>
              <label className="block space-y-2"><span className="font-bold text-gray-900">Bác sĩ {bookingMode === 'quick' ? '(tùy chọn)' : '(bắt buộc)'}</span>
                <select className={fieldClass} value={doctorId} disabled={loading} onChange={event => { setDoctorId(Number(event.target.value)); resetSlot(); }}>
                  <option value={0}>{bookingMode === 'quick' ? 'Tự chọn bác sĩ còn chỗ, ít lịch hơn' : 'Chọn bác sĩ khám'}</option>
                  {!!doctorId && !shownDoctors.some(d => d.userId === doctorId) && <option value={doctorId}>Bác sĩ đã chọn chưa có lịch trực</option>}
                  {shownDoctors.map(d => <option key={d.userId} value={d.userId}>{d.degree ? `${d.degree}. ` : ''}{d.user.fullName}</option>)}
                </select>
              </label>
            </div>

            {loading ? <div role="status" className="flex items-center gap-2 rounded-xl bg-blue-50 p-5 text-blue-700"><Loader2 size={20} className="animate-spin" />Đang kiểm tra lịch khám còn trống...</div> : availability.error ? (
              <div role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{availability.error}<button type="button" className="ml-3 font-bold underline" onClick={() => setRefresh(value => value + 1)}>Thử lại</button></div>
            ) : bookingMode === 'by-doctor' && !doctorId ? <p className="rounded-xl bg-blue-50 p-4 text-sm text-blue-700">Vui lòng chọn bác sĩ để xem ngày và giờ khám.</p> : !days.length ? (
              <p role="status" className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800">Chưa có lịch trực phù hợp trong 30 ngày tới. Vui lòng chọn cơ sở, chuyên khoa hoặc bác sĩ khác.</p>
            ) : <>
              <div>
                <h3 className="mb-3 flex items-center gap-2 font-bold text-gray-900"><CalendarDays size={18} className="text-blue-600" />3. Chọn ngày khám</h3>
                {date && !days.includes(date) && <p role="status" className="mb-3 text-sm text-amber-700">Ngày khám đã chọn không còn khả dụng. Vui lòng chọn lại ngày.</p>}
                <div className="grid max-h-56 grid-cols-3 gap-2 overflow-y-auto sm:grid-cols-5">
                  {days.map(day => {
                    const available = matchingSchedules.some(s => s.date === day && s.availableTimes.length > 0);
                    return <button type="button" key={day} disabled={!available} aria-pressed={selectedDate === day} onClick={() => { setDate(day); setTime(''); setError(''); requestId.current = ''; }} className={`${choiceButtonClass} ${selectedDate === day ? selectedChoiceClass : unselectedChoiceClass}`}>
                      <span className="block">{day === vietnamDateTime().date ? 'Hôm nay' : new Intl.DateTimeFormat('vi-VN', { weekday: 'short', timeZone: 'Asia/Ho_Chi_Minh' }).format(new Date(`${day}T00:00:00+07:00`))}</span>
                      <span className="block">{storedBookingDate(day).slice(0, 5)}</span>
                      {!available && <span className="block text-xs">Hết chỗ</span>}
                    </button>;
                  })}
                </div>
              </div>
              <div>
                <h3 className="mb-3 flex items-center gap-2 font-bold text-gray-900"><Clock size={18} className="text-blue-600" />4. Chọn giờ khám</h3>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {times.map(slot => {
                    const available = daySchedules.some(s => s.availableTimes.includes(slot));
                    return <button type="button" key={slot} disabled={!available} aria-pressed={selectedTime === slot} onClick={() => { setTime(slot); setError(''); requestId.current = ''; }} className={`${choiceButtonClass} ${selectedTime === slot ? selectedChoiceClass : unselectedChoiceClass}`}>{slot}{!available && <span className="mt-1 block text-xs">Hết chỗ</span>}</button>;
                  })}
                </div>
                {!times.length && <p className="text-sm text-gray-500">Không có giờ khám phù hợp. Vui lòng chọn ngày khác.</p>}
                {selectedSchedule && <p className="mt-3 rounded-xl bg-blue-50 p-4 text-sm text-blue-900"><strong>{selectedSchedule.doctorName}</strong> · {selectedSchedule.specialty}<br />{selectedSchedule.room}</p>}
              </div>
            </>}

            <div className="space-y-4 border-t border-gray-100 pt-5">
              <h3 className="flex items-center gap-2 font-bold text-gray-900"><User size={18} className="text-blue-600" />5. Chọn người khám</h3>
              {isLoggedIn ? <>
                <label className="block space-y-2"><span className="text-sm text-gray-600">Hồ sơ người khám</span>
                  <select className={fieldClass} value={patientId} onChange={event => { setPatientId(Number(event.target.value)); setPhone(''); setError(''); requestId.current = ''; }}>
                    {!patients.length && <option value={0}>Chưa có hồ sơ bệnh nhân phù hợp</option>}
                    {patients.map(p => <option key={p.id} value={p.id}>{p.fullName}{p.id === currentUser?.id ? ' (Bản thân)' : ' (Người thân đã liên kết)'}</option>)}
                  </select>
                </label>
                {patient && <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-700">
                  <p><strong>{patient.fullName}</strong>{patient.gender ? ` · ${patient.gender}` : ''}{patient.dob ? ` · Ngày sinh: ${patient.dob}` : ''}</p>
                  {patient.phone ? <p className="mt-2">Số điện thoại: {patient.phone}</p> : <label className="mt-3 block space-y-2"><span>Bổ sung số điện thoại vào hồ sơ người khám</span><input type="tel" autoComplete="tel" required className={fieldClass} value={phone} onChange={event => setPhone(event.target.value)} placeholder="Số điện thoại 10 chữ số" /></label>}
                </div>}
                <p className="text-sm text-gray-500">Thông tin lấy từ hồ sơ đã liên kết để thống nhất với phiếu khám. <Link href="/patient/appointments" onClick={() => saveDraft()} className="font-semibold text-blue-600 underline">Quản lý hồ sơ người thân</Link></p>
              </> : <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">Đăng nhập để vào trang tổng quan bệnh nhân, quản lý hồ sơ và lịch khám.<div className="mt-3 flex gap-4"><Link href="/login" onClick={() => saveDraft()} className="font-bold text-blue-700 underline">Đăng nhập</Link><Link href="/register" onClick={() => saveDraft()} className="font-bold text-blue-700 underline">Đăng ký</Link></div></div>}
              <label className="block space-y-2"><span className="text-sm font-semibold text-gray-700">Triệu chứng hoặc lý do khám</span><textarea value={reason} maxLength={2000} onChange={event => setReason(event.target.value)} className={fieldClass} rows={3} placeholder="Mô tả ngắn gọn lý do khám..." /></label>
            </div>
          </fieldset>
          {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}
          <button type="submit" disabled={isSubmitting || loading || !selectedSchedule || (bookingMode === 'by-doctor' && !doctorId)} className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-4 font-bold text-white shadow-lg hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">{isSubmitting && <Loader2 size={20} className="animate-spin" />}{isSubmitting ? 'Đang xác nhận lịch...' : isLoggedIn ? 'Xác nhận đặt lịch khám' : 'Đăng nhập để đặt lịch'}</button>
          <p className="text-center text-sm text-gray-500">Giờ khám được kiểm tra lại khi bạn xác nhận.</p>
        </form>
      </section>
      <aside className="space-y-6">
        <div className="rounded-3xl bg-gradient-to-br from-blue-700 to-indigo-800 p-7 text-white shadow-lg">
          <Phone size={28} className="mb-4" /><h3 className="text-xl font-bold">Hỗ trợ đặt lịch khám</h3>
          <p className="mt-3 text-sm leading-relaxed text-blue-100">Cần hỗ trợ chọn chuyên khoa, bác sĩ hoặc tìm giờ khám phù hợp? Liên hệ đội ngũ tiếp đón MediCare.</p>
          <a href="tel:0941298865" className="mt-5 block text-2xl font-extrabold">0941.298.865</a>
        </div>
        <div className="space-y-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900"><Stethoscope size={22} className="text-blue-600" />Trước khi đến khám</h3>
          <p className="text-sm leading-relaxed text-gray-600">Đến trước giờ hẹn 15 phút. Mang theo giấy tờ tùy thân, thẻ BHYT và kết quả khám trước đây nếu có.</p>
          <p className="flex items-center gap-2 text-sm text-emerald-700"><ShieldCheck size={20} />Đặt lịch trực tuyến miễn phí</p>
          {facility && <p className="border-t border-gray-100 pt-4 text-sm text-gray-600"><strong>{facility.name}</strong><br />{facility.address}</p>}
        </div>
        <div className="rounded-3xl border border-gray-100 bg-white p-6 text-sm text-gray-600 shadow-sm"><h3 className="mb-3 font-bold text-gray-900">Có thể đổi hoặc hủy lịch?</h3><p className="leading-relaxed">Bạn có thể xem và quản lý lịch hẹn trong cổng bệnh nhân, hoặc gọi hotline để được hỗ trợ.</p></div>
      </aside>
      {showAuth && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="booking-auth-title">
        <div className="relative w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl">
          <button type="button" aria-label="Đóng" onClick={() => setShowAuth(false)} className="absolute right-4 top-4 rounded-full bg-gray-100 p-2 text-gray-600"><X size={20} /></button>
          <h2 id="booking-auth-title" className="pr-8 text-2xl font-bold text-gray-900">Đăng nhập tài khoản bệnh nhân</h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-600">Sau khi đăng nhập, bạn sẽ vào trang tổng quan bệnh nhân để đặt và quản lý lịch khám.</p>
          <div className="mt-5 rounded-xl bg-blue-50 p-4 text-sm text-blue-900">{facility?.name}<br />{selectedDate ? storedBookingDate(selectedDate) : ''} · {selectedTime}</div>
          <Link href="/login" onClick={() => saveDraft()} className="mt-5 block rounded-xl bg-blue-600 p-3 text-center font-bold text-white">Đăng nhập</Link>
          <Link href="/register" onClick={() => saveDraft()} className="mt-3 block rounded-xl border border-blue-600 p-3 text-center font-bold text-blue-600">Đăng ký tài khoản</Link>
        </div>
      </div>}
    </div>
  );
}
