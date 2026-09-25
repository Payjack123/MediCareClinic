'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CalendarDays, Users, Bell, Check, Search, ArrowLeft, ArrowRight, UserCircle2, Clock, Plus, Filter, Info, Trash2, HeartPulse, Pill, TestTube, FileText, LayoutDashboard, Settings, Activity, LogOut, Wallet, Star, ShieldCheck, Stethoscope, ChevronRight, X, Phone, Mail, MapPin, User, Loader2, Link2, Download, Eye, Calendar, History, Smile, Bone, CheckCircle2, Landmark, Lock, Save, ScanLine, ChevronDown } from 'lucide-react';
import QRCode from 'react-qr-code';
import PatientSidebar from '@/app/patient/Sidebar';
import NotificationBell from '@/components/NotificationBell';
import { toast } from 'react-hot-toast';

import { getPatientAppointmentData, getBookedTimes, getDoctorSchedules, getAvailableSchedules, createAppointment, findPatientByQuery, mockConfirmPayment, checkPayment, searchAndLinkPatient, verifyPatientForFamily } from '@/app/patient/appointments/actions';
import { updatePatientProfile } from '@/app/patient/settings/actions';
import Step1Patient from './components/Step1Patient';
import Step2BookingMethod from './components/Step2BookingMethod';
import Step3DateTime from './components/Step3DateTime';
import Step4Confirm from './components/Step4Confirm';
export default function PatientAppointmentsPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'BANK' | 'EWALLET' | 'COUNTER'>('BANK');
  const [paymentCode, setPaymentCode] = useState('');

  const [userData, setUserData] = useState<any>(null);
  const [doctorsList, setDoctorsList] = useState<any[]>([]);
  const [historyList, setHistoryList] = useState<any[]>([]);
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);
  const [doctorSchedules, setDoctorSchedules] = useState<any[]>([]);
  const [selectedDoctorDetail, setSelectedDoctorDetail] = useState<any>(null);

  const [facilities, setFacilities] = useState<any[]>([]);
  const [specialties, setSpecialties] = useState<any[]>([]);
  const [clinics, setClinics] = useState<any[]>([]);

  const [bookingData, setBookingData] = useState({
    facility: '',
    specialty: '',
    doctor: '',
    doctorId: 0,
    doctorPrice: 150000,
    date: '',
    finalCodes: [] as string[]
  });

  const [patients, setPatients] = useState<any[]>([
    { id: 1, name: '', phone: '', address: '', time: '', reason: '', facility: '', specialty: '', doctor: '', doctorId: 0, doctorPrice: 0, cccd: '', patientCode: '' }
  ]);
  const [activePatientId, setActivePatientId] = useState<number>(1);
  const [isChangingDoctorForId, setIsChangingDoctorForId] = useState<number | null>(null);
  const [bookingMethod, setBookingMethod] = useState<'specialty' | 'doctor' | 'clinic' | null>(null);
  const [activeModal, setActiveModal] = useState<'facility' | 'specialty' | 'doctor' | 'clinic' | null>(null);
  const [clinicSearchQuery, setClinicSearchQuery] = useState('');
  const [specialtySearchQuery, setSpecialtySearchQuery] = useState('');
  const [doctorSearchQuery, setDoctorSearchQuery] = useState('');

  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);
  const [addPatientModalStep, setAddPatientModalStep] = useState(1);
  const [isLinkingPatient, setIsLinkingPatient] = useState(false);
  const [newPatientForm, setNewPatientForm] = useState({ name: '', dob: '', cccd: '', phone: '', relationship: '' });

  // States for Missing Info Modal
  const [isMissingInfoModalOpen, setIsMissingInfoModalOpen] = useState(false);
  const [isSavingMissingInfo, setIsSavingMissingInfo] = useState(false);
  const [pendingDoctorDoc, setPendingDoctorDoc] = useState<any>(null);
  const [missingInfoForm, setMissingInfoForm] = useState({
    fullName: '', email: '', phone: '', dob: '', gender: 'Nam', address: '', cccd: ''
  });

  const handleVerifyPatient = async () => {
    if (!newPatientForm.name || !newPatientForm.dob || !newPatientForm.cccd) {
      toast.error('Vui lòng điền đầy đủ Họ tên, Ngày sinh và CCCD!');
      return;
    }

    setIsLinkingPatient(true);
    const res = await verifyPatientForFamily(newPatientForm.cccd, newPatientForm.dob, newPatientForm.name);
    setIsLinkingPatient(false);

    if (res.success && res.patient) {
      setNewPatientForm({ ...newPatientForm, phone: res.patient.phone || '' });
      setAddPatientModalStep(2); // Go to step 2
    } else {
      toast.error(res.message || 'Không tìm thấy hồ sơ phù hợp');
    }
  };

  const handleAddNewPatient = async () => {
    if (!newPatientForm.relationship) {
      toast.error('Vui lòng chọn mối quan hệ!');
      return;
    }

    setIsLinkingPatient(true);
    const res = await searchAndLinkPatient(newPatientForm.cccd, newPatientForm.dob, newPatientForm.relationship);
    setIsLinkingPatient(false);

    if (res.success && res.patient) {
      toast.success('Đã liên kết hồ sơ thành công!');
      const newP = {
        id: res.patient.id,
        name: res.patient.name,
        phone: res.patient.phone,
        dob: res.patient.dob,
        address: res.patient.address,
        time: '',
        reason: '',
        cccd: res.patient.cccd,
        patientCode: res.patient.patientCode,
        specialty: bookingData.specialty,
        doctor: bookingData.doctor,
        doctorId: bookingData.doctorId,
        doctorPrice: bookingData.doctorPrice,
        relationship: res.patient.relationship
      };

      setPatients([...patients, newP]);
      setActivePatientId(newP.id);
      setIsAddPatientModalOpen(false);
      setAddPatientModalStep(1);
      setNewPatientForm({ name: '', dob: '', cccd: '', phone: '', relationship: '' });
    } else {
      toast.error(res.message || 'Lỗi khi liên kết hồ sơ');
    }
  };


  const morningTimes: string[] = [];
  for (let h = 6; h <= 11; h++) {
    for (let m = 0; m < 60; m += 15) {
      if (h === 6 && m < 15) continue; // Bắt đầu từ 6:15
      morningTimes.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    }
  }

  const afternoonTimes: string[] = [];
  for (let h = 13; h <= 16; h++) {
    for (let m = 0; m < 60; m += 15) {
      if (h === 13 && m < 30) continue; // Bắt đầu từ 13:30
      if (h === 16 && m > 15) break; // Kết thúc ở 16:15
      afternoonTimes.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const res = await getPatientAppointmentData();
      if (res.success && res.data) {
        setUserData(res.data.user);

        // Cập nhật người đầu tiên và nạp danh sách người thân từ DB
        if (patients[0].name === '' && res.data.user) {
          const mainUser = {
            id: res.data.user.id,
            name: res.data.user?.fullName || '',
            phone: res.data.user?.phone || '',
            dob: res.data.user?.dob || '',
            address: res.data.user?.address || '',
            time: '',
            reason: '',
            specialty: '',
            doctor: '',
            doctorId: 0,
            doctorPrice: 0,
            cccd: res.data.user?.patientProfile?.cccd || '',
            patientCode: res.data.user?.patientProfile?.patientCode || '',
            relationship: 'Chủ tài khoản'
          };

          const familyMembers = (res.data.user.managedFamilyMembers || []).map((fm: any) => ({
            id: fm.patient.id,
            name: fm.patient.fullName || '',
            phone: fm.patient.phone || '',
            dob: fm.patient.dob || '',
            address: fm.patient.address || '',
            time: '',
            reason: '',
            specialty: '',
            doctor: '',
            doctorId: 0,
            doctorPrice: 0,
            cccd: fm.patient.patientProfile?.cccd || '',
            patientCode: fm.patient.patientProfile?.patientCode || '',
            relationship: fm.relationship || 'Thành viên gia đình'
          }));

          setPatients([mainUser, ...familyMembers]);
          setActivePatientId(mainUser.id);
        }

        const formattedDoctors = res.data.doctors.map((doc: any) => ({
          id: doc.id,
          name: doc.fullName,
          address: doc.address || '',
          specialty: doc.doctorProfile?.specialty?.name || (doc.fullName.includes('Bình') ? 'Nội tổng quát' : 'Đa khoa'),
          exp: doc.doctorProfile?.experience || '5 năm',
          rating: doc.doctorProfile?.rating || 5.0,
          price: (doc.doctorProfile?.price || 150000).toLocaleString('vi-VN') + 'đ',
          rawPrice: doc.doctorProfile?.price || 150000,
          image: doc.doctorProfile?.imagePrefix || 'BS',
          avatar: doc.avatar || null,
          degree: doc.doctorProfile?.degree || 'Thạc sĩ Y Khoa',
          university: doc.doctorProfile?.university || 'Đại học Y Dược',
          languages: doc.doctorProfile?.languages || 'Tiếng Việt, Tiếng Anh',
          certificates: doc.doctorProfile?.certificateNumber || 'Chứng chỉ Hành nghề, CME',
          bio: doc.doctorProfile?.bio || '',
          status: doc.doctorProfile?.status || 'Đang làm việc',
          clinics: doc.doctorProfile?.clinics || []
        }));
        setDoctorsList(formattedDoctors);

        const formattedHistory = res.data.history.map((apt: any) => {
          let color = 'text-gray-700 bg-gray-100 border-gray-200';
          if (apt.status === 'ĐÃ XÁC NHẬN') color = 'text-green-700 bg-green-100 border-green-200';
          if (apt.status === 'CHỜ XÁC NHẬN') color = 'text-yellow-700 bg-yellow-100 border-yellow-200';

          return {
            id: `LK260${apt.id}`,
            date: apt.bookingDate,
            time: apt.bookingTime,
            doctor: apt.doctor.fullName,
            dept: apt.specialty,
            status: apt.status,
            color: color
          };
        });
        setHistoryList(formattedHistory);

        setFacilities(res.data.facilities || []);

        const iconMap: any = { Stethoscope, HeartPulse, Smile, Bone, Eye, Activity };
        setSpecialties((res.data.specialties || []).map((s: any) => ({
          ...s,
          icon: iconMap[s.iconType] || Stethoscope
        })));

        setClinics(res.data.clinics || []);
      } else {
        router.push('/login');
      }
      setIsLoading(false);
    };
    fetchData();
  }, [router]);

  useEffect(() => {
    const fetchSchedules = async () => {
      if (bookingData.doctorId || bookingData.specialty || bookingData.facility) {
        const res = await getAvailableSchedules(bookingData);
        if (res.success) setDoctorSchedules(res.schedules);
        else setDoctorSchedules([]);
      } else {
        setDoctorSchedules([]);
      }
    };
    fetchSchedules();
  }, [bookingData.doctorId, bookingData.specialty, bookingData.facility]);

  useEffect(() => {
    const fetchTimes = async () => {
      if (bookingData.doctorId && bookingData.date) {
        const fullDate = bookingData.date.split('-').reverse().join('/');
        const res = await getBookedTimes(bookingData.doctorId, fullDate);
        if (res.success) setBookedTimes(res.bookedTimes);
      }
    };
    fetchTimes();
  }, [bookingData.doctorId, bookingData.date]);

  // Polling check trạng thái thanh toán
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 6 && paymentCode) {
      interval = setInterval(async () => {
        try {
          const data = await checkPayment(paymentCode);
          if (data.paid) {
            clearInterval(interval);
            setStep(7); // Thành công
          }
        } catch (e) { }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [step, paymentCode]);

  const handleConfirmBooking = async (overrideCode?: string | null, overrideStatus?: string) => {
    setIsSubmitting(true);
    const fullDate = bookingData.date.split('-').reverse().join('/');

    const codes: string[] = [];
    const pCode = overrideCode || '';

    // Tạo lịch cho từng người
    for (const patient of patients) {
      const res = await createAppointment({
        doctorId: patient.doctorId,
        specialty: patient.specialty,
        date: fullDate,
        time: patient.time,
        // serialize thêm tên/sđt vào reason
        reason: (pCode ? `Mã thanh toán: ${pCode} - ` : '') + `Người khám: ${patient.name} - Mã BN: ${patient.patientCode || 'Không có'} - CCCD: ${patient.cccd || 'Không có'} - SĐT: ${patient.phone} - ĐC: ${patient.address}. Lý do: ${patient.reason}`,
        status: overrideStatus || 'CHỜ XÁC NHẬN',
        paymentMethod: paymentMethod === 'BANK' ? 'CHUYỂN KHOẢN' : 'TẠI QUẦY'
      });
      if (res.success && res.appointmentCode) {
        codes.push(res.appointmentCode);
      }
    }

    setIsSubmitting(false);

    if (codes.length > 0) {
      setBookingData(prev => ({ ...prev, finalCodes: codes }));
      if (overrideStatus === 'CHỜ THANH TOÁN') {
        setStep(6);
      } else {
        setStep(7);
      }
    } else {
      alert("Đã xảy ra lỗi khi tạo lịch khám!");
    }
  };

  const handleLogout = () => router.push('/login');

  // FIX LỖI Ở ĐÂY: Lọc không phân biệt hoa thường và bỏ khoảng trắng thừa
  const filteredDoctors = doctorsList.filter(doc =>
    doc.specialty?.trim().toLowerCase() === bookingData.specialty?.trim().toLowerCase()
  );

  // Hàm tính số lượng bác sĩ của 1 khoa
  const getDoctorCount = (specialtyName: string) => {
    return doctorsList.filter(doc =>
      doc.specialty?.trim().toLowerCase() === specialtyName.trim().toLowerCase()
    ).length;
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]"><Loader2 className="w-10 h-10 text-[#2563EB] animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] font-sans text-gray-800 overflow-hidden">

      {/* ==========================================
          1. SIDEBAR
      ========================================== */}
      <PatientSidebar activePage="appointments" />

      {/* ==========================================
          2. MAIN CONTENT AREA
      ========================================== */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">

        {/* TOP HEADER */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-8 shrink-0 z-10">
          <div className="flex items-center gap-4">
            <div className="bg-blue-50 p-2 rounded-lg"><CalendarDays className="text-[#2563EB]" size={24} /></div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Quản lý Lịch khám</h1>
            </div>
          </div>
          <div className="flex items-center gap-6 ml-auto">
            <NotificationBell />
            <div className="flex items-center gap-3 pl-6 border-l border-gray-200 cursor-pointer group">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-900 group-hover:text-[#2563EB] transition">{userData?.fullName}</p>
                <p className="text-xs text-gray-500 font-medium">Bệnh nhân ({userData?.patientCode})</p>
              </div>
              <img src={`https://ui-avatars.com/api/?name=${userData?.fullName}&background=2563EB&color=fff`} alt="Avatar" className="w-11 h-11 rounded-full border-2 border-white shadow-sm group-hover:shadow-md transition" />
            </div>
          </div>
        </header>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 animate-in fade-in duration-500">

          {/* =======================================
              TAB 1: WIZARD ĐẶT LỊCH
          ======================================= */}
          <div className={`mx-auto transition-all duration-500 ${step === 7 ? 'max-w-7xl' : 'max-w-4xl'}`}>

            {/* STEPPER */}
            {step <= 4 && (
              <div className="flex justify-between items-center mb-8 px-4 sm:px-12 relative">
                <div className="absolute left-10 right-10 top-1/2 -translate-y-1/2 h-1 bg-gray-200 rounded-full z-0"></div>
                <div
                  className="absolute left-10 top-1/2 -translate-y-1/2 h-1 bg-[#2563EB] rounded-full z-0 transition-all duration-500"
                  style={{ width: `${(step - 1) * 33.33}%` }}
                ></div>

                {[
                  { id: 1, label: 'Thành viên' },
                  { id: 2, label: 'Phương thức' },
                  { id: 3, label: 'Lịch khám' },
                  { id: 4, label: 'Xác nhận' }
                ].map((s) => (
                  <div key={s.id} className="relative z-10 flex flex-col items-center gap-2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all shadow-sm ${step >= s.id ? 'bg-[#2563EB] text-white ring-4 ring-blue-50' : 'bg-white text-gray-400 border-2 border-gray-200'}`}>
                      {step > s.id ? <Check size={18} strokeWidth={3} /> : s.id}
                    </div>
                    <span className={`text-xs font-bold ${step >= s.id ? 'text-[#2563EB]' : 'text-gray-400'}`}>{s.label}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden min-h-[500px] flex flex-col relative animate-in fade-in slide-in-from-bottom-4">

              {/* STEP 1: THÀNH VIÊN */}
              {step === 1 && (
                <Step1Patient
                  patients={patients}
                  setPatients={setPatients}
                  activePatientId={activePatientId}
                  setActivePatientId={setActivePatientId}
                  userData={userData}
                  setIsAddPatientModalOpen={setIsAddPatientModalOpen}
                  setStep={setStep}
                />
              )}

              {/* STEP 2: PHƯƠNG THỨC */}
              {step === 2 && (
                <Step2BookingMethod
                  setStep={setStep}
                  patients={patients}
                  setPatients={setPatients}
                  activePatientId={activePatientId}
                  bookingData={bookingData}
                  setBookingData={setBookingData}
                  activeModal={activeModal}
                  setActiveModal={setActiveModal}
                  bookingMethod={bookingMethod}
                  setBookingMethod={setBookingMethod}
                  facilities={facilities}
                  specialties={specialties}
                  doctorsList={doctorsList}
                  clinics={clinics}
                  clinicSearchQuery={clinicSearchQuery}
                  setClinicSearchQuery={setClinicSearchQuery}
                  specialtySearchQuery={specialtySearchQuery}
                  setSpecialtySearchQuery={setSpecialtySearchQuery}
                  doctorSearchQuery={doctorSearchQuery}
                  setDoctorSearchQuery={setDoctorSearchQuery}
                  onNextStep={() => {
                    setPatients(patients.map(p => p.id === activePatientId ? {
                      ...p,
                      facility: bookingData.facility,
                      specialty: bookingData.specialty,
                      doctor: bookingData.doctor,
                      doctorId: bookingData.doctorId,
                      doctorPrice: bookingData.doctorPrice
                    } : p));
                    setStep(3);
                  }}
                />
              )}
              {/* STEP 3: LỊCH KHÁM */}
              {step === 3 && (
                <Step3DateTime
                  setStep={setStep}
                  patients={patients}
                  setPatients={setPatients}
                  activePatientId={activePatientId}
                  bookingData={bookingData}
                  setBookingData={setBookingData}
                  bookingMethod={bookingMethod}
                  bookedTimes={bookedTimes}
                  doctorSchedules={doctorSchedules}
                />
              )}
              {/* STEP 4: XÁC NHẬN */}
              {step === 4 && (
                <Step4Confirm
                  setStep={setStep}
                  patients={patients}
                  setPatients={setPatients}
                  activePatientId={activePatientId}
                  bookingData={bookingData}
                  bookingMethod={bookingMethod}
                  isSubmitting={isSubmitting}
                />
              )}
              {/* STEP 5: THANH TOÁN */}
              {step === 5 && (
                <div className="p-8 flex-1 flex flex-col animate-in slide-in-from-right-8 bg-gray-50/50">
                  <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
                    <button onClick={() => setStep(4)} className="p-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-full text-gray-600 transition"><ArrowLeft size={20} /></button>
                    <div>
                      <h2 className="text-2xl font-black text-gray-900">Thanh toán hóa đơn</h2>
                      <p className="text-gray-500 text-sm mt-1">Vui lòng chọn phương thức thanh toán để hoàn tất đặt lịch.</p>
                    </div>
                  </div>

                  <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                    <div className="text-center mb-8 pb-8 border-b border-gray-100">
                      <h2 className="font-bold text-gray-500 mb-2">Số tiền cần thanh toán</h2>
                      <p className="font-black text-4xl xl:text-5xl text-[#2563EB]">
                        {patients.reduce((sum, p) => sum + p.doctorPrice, 0).toLocaleString('vi-VN')} <span className="text-3xl">₫</span>
                      </p>
                    </div>

                    <h3 className="font-bold text-gray-900 mb-4 text-lg">Chọn phương thức thanh toán</h3>

                    <div className="space-y-4 mb-8">
                      {/* Chuyển khoản ngân hàng */}
                      <label className={`flex gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'BANK' ? 'border-[#2563EB] bg-blue-50/50 shadow-sm ring-2 ring-blue-500/20 transform scale-[1.01]' : 'border-gray-100 hover:border-blue-300'}`}>
                        <div className="pt-0.5">
                          <input type="radio" name="paymentMethod" className="w-4 h-4 text-[#2563EB] mt-1" checked={paymentMethod === 'BANK'} onChange={() => setPaymentMethod('BANK')} />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-gray-900 text-base">Chuyển khoản ngân hàng</p>
                          <p className="text-sm text-gray-500 mt-1">Chuyển khoản qua số tài khoản của phòng khám</p>
                        </div>
                        <div className="flex items-center text-[#2563EB]">
                          <Landmark size={32} />
                        </div>
                      </label>

                      {/* Thanh toán tại quầy */}
                      {userData?.patientProfile?.noShowCount >= 3 ? (
                        <div className="p-5 rounded-xl border-2 border-red-200 bg-red-50 opacity-80">
                          <div className="flex gap-4">
                            <div className="pt-0.5">
                              <input type="radio" disabled className="w-4 h-4 text-gray-400 mt-1 cursor-not-allowed" />
                            </div>
                            <div className="flex-1">
                              <p className="font-bold text-gray-900 text-base">Thanh toán tại quầy</p>
                              <p className="text-sm text-red-600 mt-1 font-medium">Tài khoản của bạn đã vi phạm quy định hủy lịch quá 3 lần. Bạn chỉ có thể chọn Thanh toán chuyển khoản.</p>
                            </div>
                            <div className="flex items-center text-gray-400">
                              <Users size={32} />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <label className={`flex gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'COUNTER' ? 'border-[#2563EB] bg-blue-50/50 shadow-sm ring-2 ring-blue-500/20 transform scale-[1.01]' : 'border-gray-100 hover:border-blue-300'}`}>
                          <div className="pt-0.5">
                            <input type="radio" name="paymentMethod" className="w-4 h-4 text-[#2563EB] mt-1" checked={paymentMethod === 'COUNTER'} onChange={() => setPaymentMethod('COUNTER')} />
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-gray-900 text-base">Thanh toán tại quầy</p>
                            <p className="text-sm text-gray-500 mt-1">Giao dịch trực tiếp bằng tiền mặt hoặc quẹt thẻ tại lễ tân</p>
                          </div>
                          <div className="flex items-center text-gray-400">
                            <Users size={32} />
                          </div>
                        </label>
                      )}
                    </div>

                    <button
                      disabled={isSubmitting}
                      onClick={async () => {
                        if (paymentMethod === 'BANK') {
                          const newCode = `DK${Math.floor(10000 + Math.random() * 90000)}`;
                          setPaymentCode(newCode);
                          await handleConfirmBooking(newCode, 'CHỜ THANH TOÁN');
                        } else {
                          await handleConfirmBooking(null, 'CHỜ XÁC NHẬN');
                        }
                      }}
                      className="w-full bg-[#2563EB] hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-200 transition-all flex justify-center items-center gap-2 disabled:opacity-50"
                    >
                      {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <CheckCircle2 size={20} />}
                      Tiếp tục thanh toán
                    </button>

                    <div className="mt-5 flex items-center justify-center gap-2 text-xs text-gray-500 text-center">
                      <ShieldCheck size={16} className="text-green-600" /> Toàn bộ giao dịch và thông tin thẻ được mã hóa bảo mật tuyệt đối.
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 6: MÃ QR CHUYỂN KHOẢN */}
              {step === 6 && (
                <div className="p-8 flex-1 flex flex-col animate-in slide-in-from-right-8 bg-gray-50/50">
                  <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
                    <button onClick={() => setStep(5)} className="p-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-full text-gray-600 transition"><ArrowLeft size={20} /></button>
                    <div>
                      <h2 className="text-2xl font-black text-gray-900">Quét mã QR thanh toán</h2>
                      <p className="text-gray-500 text-sm mt-1">Mở ứng dụng ngân hàng của bạn và quét mã QR bên dưới.</p>
                    </div>
                  </div>

                  <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center max-w-lg mx-auto w-full">
                    <div className="bg-[#2563EB] text-white w-full py-4 rounded-t-xl text-center font-bold text-lg mb-6 shadow-md">
                      MB Bank (Mock)
                    </div>

                    <div className="p-4 bg-white border-2 border-dashed border-[#2563EB] rounded-2xl shadow-sm mb-8 flex justify-center">
                      <QRCode
                        value={`${typeof window !== 'undefined' ? window.location.origin : ''}/mock-payment?code=${paymentCode}&amount=${patients.reduce((sum, p) => sum + p.doctorPrice, 0)}`}
                        size={200}
                        level="M"
                      />
                    </div>

                    <div className="w-full space-y-4 text-sm mb-8 bg-gray-50 p-6 rounded-xl border border-gray-200">
                      <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                        <span className="text-gray-500 font-medium">Số tiền:</span>
                        <strong className="text-[#2563EB] text-xl">{patients.reduce((sum, p) => sum + p.doctorPrice, 0).toLocaleString('vi-VN')} ₫</strong>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 font-medium">Số tài khoản:</span>
                        <strong className="text-gray-900 text-base tracking-wider">0968973608</strong>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 font-medium">Ngân hàng:</span>
                        <strong className="text-gray-900">MB Bank</strong>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 font-medium">Nội dung bắt buộc:</span>
                        <strong className="text-gray-900 bg-yellow-100 px-2 py-1 rounded">{paymentCode}</strong>
                      </div>
                    </div>

                    <button
                      disabled={true}
                      className="w-full bg-blue-50 text-[#2563EB] border border-blue-200 py-4 rounded-xl font-bold text-lg shadow-sm transition-all flex justify-center items-center gap-2"
                    >
                      <Loader2 size={24} className="animate-spin" />
                      Hệ thống đang tự động xác nhận...
                    </button>
                    <p className="text-xs text-gray-400 mt-4 text-center">Hãy quét mã QR bằng điện thoại (Camera, Zalo) để mở giao diện thanh toán giả lập. Màn hình này sẽ tự động chuyển tiếp.</p>
                  </div>
                </div>
              )}

              {/* STEP 7: THÀNH CÔNG */}
              {step === 7 && (
                <div className="p-8 flex-1 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-500">
                  <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                    <Check size={48} strokeWidth={3} />
                  </div>
                  <h2 className="text-3xl font-black text-gray-900 mb-2">Đặt lịch thành công!</h2>
                  <p className="text-gray-600 max-w-md">Bạn đã đặt thành công <strong className="text-gray-900">{patients.length} lịch khám</strong> vào ngày <strong className="text-[#2563EB]">{bookingData.date}/{new Date().getFullYear()}</strong>.</p>

                  <div className={`mt-8 w-full flex gap-6 overflow-x-auto p-6 custom-scrollbar items-start ${patients.length > 3 ? 'justify-start' : 'justify-center'}`}>
                    {patients.map((p, idx) => {
                      const code = bookingData.finalCodes[idx] || `LK${Date.now()}`;
                      const dateParts = bookingData.date.split('-');
                      const formattedDate = dateParts.length === 3 ? `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}` : bookingData.date;
                      return (
                        <div key={idx} className="shrink-0 w-[320px] bg-white shadow-2xl relative text-left rounded-3xl overflow-hidden ring-1 ring-gray-200/50">
                          {/* Header */}
                          <div className="text-center p-5 pt-6 border-b-2 border-dashed border-gray-300">
                            <p className="text-xs font-bold uppercase text-gray-500">Hệ thống Y tế</p>
                            <p className="text-sm font-bold uppercase text-gray-800">Phòng Khám Đa Khoa N1</p>
                            <p className="text-[15px] font-bold text-[#2563EB] mt-2 bg-blue-50/80 px-3 py-1 rounded-full inline-block border border-blue-100">Mã lịch: {code}</p>
                            <div className="flex justify-center my-4">
                              <div className="p-2 bg-white border border-gray-200 rounded-xl shadow-sm">
                                <QRCode value={code} size={100} level="M" />
                              </div>
                            </div>
                            <h3 className="text-xl font-bold uppercase mt-1 tracking-wider text-gray-900">Phiếu Khám Bệnh</h3>
                          </div>

                          {/* Body */}
                          <div className="p-5 space-y-2.5 text-sm text-gray-800 border-b-2 border-dashed border-gray-300">
                            <div className="flex justify-between"><span className="text-gray-500">Họ và tên:</span> <span className="font-bold text-right uppercase">{p.name}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">SĐT:</span> <span className="font-bold text-right">{p.phone}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">CCCD:</span> <span className="font-bold text-right">{p.cccd || 'Không có'}</span></div>
                            <div className="flex justify-between items-start gap-4"><span className="text-gray-500 shrink-0">Địa chỉ:</span> <span className="font-bold text-right truncate">{p.address || 'Không có'}</span></div>
                            <div className="h-px bg-gray-100 my-1"></div>
                            <div className="flex justify-between"><span className="text-gray-500">YC khám:</span> <span className="font-bold text-right">{p.specialty}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Bác sĩ:</span> <span className="font-bold text-right">{p.doctor}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Giá khám:</span> <span className="font-black text-[#2563EB] text-right">{p.doctorPrice.toLocaleString('vi-VN')} đ</span></div>
                          </div>

                          {/* Footer */}
                          <div className="p-5 text-center bg-gray-50">
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Giờ khám dự kiến</p>
                            <p className="text-5xl font-black text-gray-900 my-2">{p.time}</p>
                            <p className="text-sm font-medium text-gray-600">Ngày {formattedDate}</p>
                          </div>

                        </div>
                      );
                    })}
                  </div>

                  <p className="text-sm font-bold text-orange-500 mt-6 max-w-md bg-orange-50 p-3 rounded-lg flex items-center justify-center gap-2">
                    <Info size={18} /> Vui lòng đưa mã QR này cho lễ tân khi đến khám.
                  </p>

                  <div className="mt-8 flex gap-4 w-full max-w-sm">
                    <button
                      onClick={() => { window.location.reload(); }}
                      className="flex-1 bg-white border-2 border-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:border-gray-300 hover:bg-gray-50 transition"
                    >
                      Đặt lịch mới
                    </button>
                    <button
                      onClick={() => router.push('/patient/dashboard')}
                      className="flex-1 bg-[#2563EB] text-white py-3 rounded-xl font-bold hover:bg-blue-700 shadow-md transition"
                    >
                      Về trang chủ
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>

      {/* DOCTOR PROFILE MODAL */}
      {selectedDoctorDetail && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setSelectedDoctorDetail(null)}
          ></div>
          <div className="relative bg-white rounded-3xl shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-blue-50/50 p-6 pb-20 border-b border-gray-100 relative">
              <button
                onClick={() => setSelectedDoctorDetail(null)}
                className="absolute top-4 right-4 p-2 bg-white rounded-full text-gray-500 hover:text-gray-900 shadow-sm transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="px-8 pb-8 pt-0 relative">
              <div className="flex gap-6 -mt-12">
                <div className="w-28 h-28 rounded-2xl bg-indigo-50 border-4 border-white shadow-md flex items-center justify-center text-4xl font-black text-indigo-600 shrink-0 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 to-indigo-50"></div>
                  {selectedDoctorDetail.avatar ? (
                    <img src={selectedDoctorDetail.avatar} alt={selectedDoctorDetail.name} className="relative z-10 w-full h-full object-cover" />
                  ) : (
                    <span className="relative z-10">{selectedDoctorDetail.image}</span>
                  )}
                </div>
                <div className="pt-14 flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-black text-gray-900">{selectedDoctorDetail.name}</h2>
                      <p className="text-[#2563EB] font-bold text-sm mt-0.5">{selectedDoctorDetail.specialty}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-orange-50 text-orange-600 px-2.5 py-1 rounded-lg font-bold text-sm">
                      <Star size={16} fill="currentColor" /> {selectedDoctorDetail.rating}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mt-8">
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Kinh nghiệm</p>
                    <p className="font-medium text-gray-900 flex items-center gap-2"><Activity size={16} className="text-gray-400" /> {selectedDoctorDetail.exp}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Bằng cấp</p>
                    <p className="font-medium text-gray-900 flex items-center gap-2"><FileText size={16} className="text-gray-400" /> {selectedDoctorDetail.degree}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Nơi công tác / Đào tạo</p>
                    <p className="font-medium text-gray-900 flex items-center gap-2"><MapPin size={16} className="text-gray-400" /> {selectedDoctorDetail.university}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Ngoại ngữ</p>
                    <p className="font-medium text-gray-900 flex items-center gap-2"><Phone size={16} className="text-gray-400" /> {selectedDoctorDetail.languages}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Giá khám</p>
                    <p className="font-black text-[#2563EB] text-lg">{selectedDoctorDetail.price}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Chứng chỉ</p>
                    <p className="font-medium text-gray-900 flex items-center gap-2"><ShieldCheck size={16} className="text-gray-400" /> {selectedDoctorDetail.certificates}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm text-gray-600 leading-relaxed">
                {selectedDoctorDetail.bio || `Bác sĩ ${selectedDoctorDetail.name} là một trong những chuyên gia hàng đầu trong lĩnh vực ${selectedDoctorDetail.specialty}. Với nhiều năm kinh nghiệm công tác tại các bệnh viện lớn, bác sĩ luôn tận tâm và mang lại chất lượng khám chữa bệnh tốt nhất cho bệnh nhân.`}
              </div>

              <div className="mt-6 border-t border-gray-100 pt-6">
                <h3 className="font-bold text-gray-900 mb-4">Đánh giá từ bệnh nhân</h3>
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex gap-2 items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-[#2563EB] flex items-center justify-center font-bold text-xs">NT</div>
                        <span className="font-bold text-sm text-gray-900">Nguyễn Văn T.</span>
                      </div>
                      <div className="flex text-orange-400 gap-0.5">
                        <Star size={14} fill="currentColor" />
                        <Star size={14} fill="currentColor" />
                        <Star size={14} fill="currentColor" />
                        <Star size={14} fill="currentColor" />
                        <Star size={14} fill="currentColor" />
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">Bác sĩ rất tận tình, giải thích cặn kẽ bệnh tình và hướng dẫn cách chăm sóc sức khỏe một cách khoa học. Rất hài lòng!</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex gap-2 items-center">
                        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xs">LM</div>
                        <span className="font-bold text-sm text-gray-900">Lê Thị M.</span>
                      </div>
                      <div className="flex text-orange-400 gap-0.5">
                        <Star size={14} fill="currentColor" />
                        <Star size={14} fill="currentColor" />
                        <Star size={14} fill="currentColor" />
                        <Star size={14} fill="currentColor" />
                        <Star size={14} fill="currentColor" />
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">Khám rất nhẹ nhàng, phòng khám hiện đại sạch sẽ. Bác sĩ tư vấn đơn thuốc rõ ràng, uống mau khỏi.</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  onClick={() => setSelectedDoctorDetail(null)}
                  className="flex-1 py-3.5 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition"
                >
                  Đóng
                </button>
                <button
                  onClick={() => {
                    if (!userData?.phone || !userData?.patientProfile?.cccd || !userData?.address || !userData?.dob) {
                      setMissingInfoForm({
                        fullName: userData?.fullName || '',
                        email: userData?.email || '',
                        phone: userData?.phone || '',
                        dob: userData?.dob || '',
                        gender: userData?.gender || 'Nam',
                        address: userData?.address || '',
                        cccd: userData?.patientProfile?.cccd || ''
                      });
                      setPendingDoctorDoc(selectedDoctorDetail);
                      setSelectedDoctorDetail(null);
                      setIsMissingInfoModalOpen(true);
                      return;
                    }

                    setBookingData({
                      ...bookingData,
                      doctor: selectedDoctorDetail.name,
                      doctorId: selectedDoctorDetail.id,
                      doctorPrice: selectedDoctorDetail.rawPrice
                    });
                    setPatients(patients.map(p => p.id === patients[0].id ? {
                      ...p,
                      specialty: bookingData.specialty,
                      doctor: selectedDoctorDetail.name,
                      doctorId: selectedDoctorDetail.id,
                      doctorPrice: selectedDoctorDetail.rawPrice
                    } : p));
                    setSelectedDoctorDetail(null);
                    setStep(3);
                  }}
                  className="flex-[2] py-3.5 bg-[#2563EB] text-white rounded-xl font-bold shadow-md hover:bg-blue-700 transition"
                >
                  Chọn khám bác sĩ này
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DOCTOR SELECTION MODAL FOR A SPECIFIC PATIENT */}
      {isChangingDoctorForId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsChangingDoctorForId(null)}
          ></div>
          <div className="relative bg-white rounded-3xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-3xl">
              <h2 className="text-xl font-black text-gray-900">Thay đổi Bác sĩ khám</h2>
              <button
                onClick={() => setIsChangingDoctorForId(null)}
                className="p-2 text-gray-500 hover:bg-gray-200 rounded-full transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
              <h3 className="font-bold text-gray-900 text-sm mb-3 uppercase">1. CHỌN CHUYÊN KHOA</h3>
              <div className="flex gap-2 overflow-x-auto pb-4 custom-scrollbar mb-4">
                {specialties.map(spec => (
                  <button
                    key={`modal-spec-${spec.id}`}
                    onClick={() => {
                      const newP = [...patients];
                      const idx = newP.findIndex(p => p.id === isChangingDoctorForId);
                      if (idx !== -1) {
                        newP[idx].specialty = spec.name;
                        newP[idx].doctor = '';
                        newP[idx].doctorId = 0;
                        newP[idx].doctorPrice = 0;
                        setPatients(newP);
                      }
                    }}
                    className={`shrink-0 px-4 py-2.5 rounded-xl font-bold text-sm border flex items-center gap-2 transition-all ${patients.find(p => p.id === isChangingDoctorForId)?.specialty === spec.name
                      ? 'border-[#2563EB] text-[#2563EB] bg-blue-50 ring-2 ring-blue-100'
                      : 'border-gray-200 text-gray-700 bg-white hover:bg-gray-50'
                      }`}
                  >
                    <spec.icon size={16} /> {spec.name}
                  </button>
                ))}
              </div>
              <h3 className="font-bold text-gray-900 text-sm mb-3 uppercase">2. CHỌN BÁC SĨ</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {doctorsList.filter(d => d.specialty?.trim().toLowerCase() === patients.find(p => p.id === isChangingDoctorForId)?.specialty?.trim().toLowerCase()).length > 0 ? (
                  doctorsList
                    .filter(d => d.specialty?.trim().toLowerCase() === patients.find(p => p.id === isChangingDoctorForId)?.specialty?.trim().toLowerCase())
                    .map(doc => (
                      <div key={`modal-doc-${doc.id}`} className="border border-gray-200 rounded-xl p-4 flex gap-4 bg-white hover:border-blue-200 hover:shadow-md transition-all group">
                        <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center font-bold text-blue-600 text-xl border-2 border-white shadow-sm group-hover:bg-[#2563EB] group-hover:text-white transition-colors shrink-0 overflow-hidden">
                          {doc.avatar ? <img src={doc.avatar} alt={doc.name} className="w-full h-full object-cover" /> : doc.image}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900">{doc.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-medium text-orange-500 bg-orange-50 px-2 py-0.5 rounded flex items-center gap-1">
                              <Star size={12} fill="currentColor" /> {doc.rating}
                            </span>
                            <span className="text-xs font-bold text-[#2563EB]">{doc.price}</span>
                          </div>
                          <div className="flex gap-2 mt-3">
                            <button
                              onClick={() => setSelectedDoctorDetail(doc)}
                              className="flex-1 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-bold rounded-lg transition"
                            >
                              Xem hồ sơ
                            </button>
                            <button
                              onClick={() => {
                                const newP = [...patients];
                                const idx = newP.findIndex(p => p.id === isChangingDoctorForId);
                                if (idx !== -1) {
                                  newP[idx].doctor = doc.name;
                                  newP[idx].doctorId = doc.id;
                                  newP[idx].doctorPrice = doc.rawPrice;
                                  newP[idx].time = ''; // Đặt lại giờ nếu đổi bác sĩ
                                  setPatients(newP);
                                }
                                setIsChangingDoctorForId(null);
                              }}
                              className="flex-[2] py-2 bg-blue-50 hover:bg-[#2563EB] hover:text-white text-[#2563EB] text-sm font-bold rounded-lg transition"
                            >
                              Chọn bác sĩ này
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="col-span-2 text-center py-8 bg-gray-50 rounded-xl text-gray-500 text-sm">
                    Không có bác sĩ nào thuộc chuyên khoa này.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD PATIENT MODAL */}
      {isAddPatientModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsAddPatientModalOpen(false)}
          ></div>
          <div className="relative bg-white shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200" style={{ borderRadius: '24px' }}>
            <div className="bg-[#2563EB] text-white p-4 flex items-center gap-3">
              <button
                onClick={() => {
                  if (addPatientModalStep === 2) setAddPatientModalStep(1);
                  else setIsAddPatientModalOpen(false);
                }}
                className="p-1 hover:bg-blue-700 rounded-full transition"
              >
                <ArrowLeft size={24} />
              </button>
              <h2 className="text-lg font-bold uppercase tracking-wide">Thêm thành viên</h2>
            </div>

            <div className="p-6 bg-gray-50/50">
              <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-4 flex gap-3 mb-6">
                <Info size={20} className="text-[#2563EB] shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-blue-900">Vui lòng nhập thông tin cơ bản của thành viên gia đình</p>
              </div>

              {addPatientModalStep === 1 && (
                <div className="animate-in slide-in-from-right-4">
                  <div className="space-y-4 mb-8">
                    <div className="relative border border-gray-300 rounded-2xl p-1 pt-2 bg-white focus-within:border-[#2563EB] transition-colors">
                      <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-semibold text-gray-500">Họ và tên *</label>
                      <div className="flex items-center">
                        <div className="pl-3 text-gray-400"><User size={20} /></div>
                        <input
                          type="text"
                          placeholder="Nhập họ và tên"
                          value={newPatientForm.name}
                          onChange={(e) => {
                            setNewPatientForm({ ...newPatientForm, name: e.target.value.toUpperCase() });
                          }}
                          className="w-full px-3 py-2.5 bg-transparent text-base outline-none font-medium text-gray-900"
                        />
                      </div>
                    </div>

                    <div className="relative border border-gray-300 rounded-2xl p-1 pt-2 bg-white focus-within:border-[#2563EB] transition-colors">
                      <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-semibold text-gray-500">Ngày sinh (Ngày/Tháng/Năm) *</label>
                      <div className="flex items-center">
                        <div className="pl-3 text-gray-400"><Calendar size={20} /></div>
                        <input
                          type="text"
                          placeholder="VD: 01/01/1990"
                          value={newPatientForm.dob}
                          maxLength={10}
                          onChange={(e) => setNewPatientForm({ ...newPatientForm, dob: e.target.value })}
                          className="w-full px-3 py-2.5 bg-transparent text-base outline-none font-medium text-gray-900"
                        />
                      </div>
                      <p className="absolute bottom-1 right-2 text-right text-[10px] text-gray-400 px-2">{newPatientForm.dob.length}/10</p>
                    </div>

                    <div className="relative border border-gray-300 rounded-2xl p-1 pt-2 bg-white focus-within:border-[#2563EB] transition-colors">
                      <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-semibold text-gray-500">Số CCCD / Mã định danh *</label>
                      <div className="flex items-center">
                        <div className="pl-3 text-gray-400"><Landmark size={20} /></div>
                        <input
                          type="text"
                          placeholder="Nhập CCCD"
                          value={newPatientForm.cccd}
                          maxLength={20}
                          onChange={(e) => setNewPatientForm({ ...newPatientForm, cccd: e.target.value })}
                          className="w-full px-3 py-2.5 bg-transparent text-base outline-none font-medium text-gray-900"
                        />
                      </div>
                      <p className="absolute bottom-1 right-2 text-right text-[10px] text-gray-400 px-2">{newPatientForm.cccd.length}/20</p>
                    </div>

                    <button className="w-full py-3.5 bg-white border border-[#2563EB] text-[#2563EB] hover:bg-blue-50 font-bold rounded-2xl transition flex items-center justify-center gap-2">
                      <ScanLine size={20} /> Quét QR CCCD/Phiếu Khám
                    </button>
                  </div>

                  <div className="space-y-4">
                    <button
                      disabled={!newPatientForm.name || !newPatientForm.dob || !newPatientForm.cccd || isLinkingPatient}
                      onClick={handleVerifyPatient}
                      className="w-full py-4 bg-[#2563EB] hover:bg-blue-700 text-white font-bold rounded-2xl transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isLinkingPatient ? <Loader2 size={20} className="animate-spin" /> : <ArrowRight size={20} />}
                      {isLinkingPatient ? 'Đang kiểm tra...' : 'Tiếp tục'}
                    </button>
                  </div>
                </div>
              )}

              {addPatientModalStep === 2 && (
                <div className="animate-in slide-in-from-right-4">
                  <div className="mb-4">
                    <button
                      onClick={() => setAddPatientModalStep(1)}
                      className="flex items-center gap-1 text-[#2563EB] text-sm font-bold hover:text-blue-800 transition"
                    >
                      <ArrowLeft size={16} /> Tra cứu lại
                    </button>
                  </div>

                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-6 shadow-sm">
                    <div className="flex items-center gap-2 text-emerald-800 font-bold text-lg mb-1">
                      <CheckCircle2 size={18} className="text-emerald-600" /> {newPatientForm.name}
                    </div>
                    <p className="text-sm text-emerald-700 pl-7">
                      {newPatientForm.dob} • {newPatientForm.cccd}
                    </p>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="relative border border-gray-300 rounded-2xl p-1 pt-2 bg-white focus-within:border-[#2563EB] transition-colors">
                      <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-semibold text-gray-500">Quan hệ với chủ tài khoản *</label>
                      <div className="flex items-center">
                        <div className="pl-3 text-gray-400"><Users size={20} /></div>
                        <select
                          value={newPatientForm.relationship}
                          onChange={(e) => setNewPatientForm({ ...newPatientForm, relationship: e.target.value })}
                          className="w-full px-3 py-2.5 bg-transparent text-base outline-none font-medium text-gray-900 appearance-none"
                        >
                          <option value="" disabled hidden>Chọn mối quan hệ</option>
                          <option value="Bố">Bố</option>
                          <option value="Mẹ">Mẹ</option>
                          <option value="Vợ">Vợ</option>
                          <option value="Chồng">Chồng</option>
                          <option value="Con">Con</option>
                          <option value="Anh">Anh</option>
                          <option value="Chị">Chị</option>
                          <option value="Em">Em</option>
                          <option value="Ông">Ông</option>
                          <option value="Bà">Bà</option>
                          <option value="Khác">Khác</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                          <ChevronDown size={20} />
                        </div>
                      </div>
                    </div>

                    <div className="relative border border-gray-300 rounded-2xl p-1 pt-2 bg-white focus-within:border-[#2563EB] transition-colors">
                      <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-semibold text-gray-500">Số điện thoại *</label>
                      <div className="flex items-center">
                        <div className="pl-3 text-gray-400">
                          <Phone size={20} />
                        </div>
                        <input
                          type="text"
                          value={newPatientForm.phone}
                          maxLength={10}
                          onChange={(e) => setNewPatientForm({ ...newPatientForm, phone: e.target.value })}
                          className="w-full px-3 py-2.5 bg-transparent text-base outline-none font-medium text-gray-900"
                        />
                        {newPatientForm.phone && (
                          <button
                            onClick={() => setNewPatientForm({ ...newPatientForm, phone: '' })}
                            className="pr-3 text-gray-400 hover:text-gray-600"
                          >
                            <X size={18} />
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between items-center px-2">
                      <p className="text-xs text-gray-500">Mã OTP sẽ gửi tới số này</p>
                      <p className="text-xs text-gray-400">{newPatientForm.phone.length}/10</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <button
                      disabled={!newPatientForm.phone || !newPatientForm.relationship || isLinkingPatient}
                      onClick={handleAddNewPatient}
                      className="w-full py-4 bg-[#2563EB] hover:bg-blue-700 text-white font-bold rounded-2xl transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isLinkingPatient ? <Loader2 size={20} className="animate-spin" /> : null}
                      Xác nhận
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Missing Info */}
      {isMissingInfoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-blue-50/50">
              <div>
                <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2"><User size={20} className="text-[#2563EB]" /> Cập nhật thông tin cá nhân</h3>
                <p className="text-sm text-gray-500 mt-1">Vui lòng điền đầy đủ thông tin để tiếp tục đặt lịch khám.</p>
              </div>
              <button onClick={() => setIsMissingInfoModalOpen(false)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
              <form id="missingInfoForm" onSubmit={async (e) => {
                e.preventDefault();
                if (!missingInfoForm.phone || !missingInfoForm.cccd || !missingInfoForm.address || !missingInfoForm.dob) {
                  alert("Vui lòng điền đầy đủ số điện thoại, CCCD, địa chỉ và ngày sinh!");
                  return;
                }
                setIsSavingMissingInfo(true);
                const res = await updatePatientProfile(missingInfoForm);
                setIsSavingMissingInfo(false);

                if (res.success) {
                  // Update current userData state so it doesn't prompt again
                  setUserData({
                    ...userData,
                    ...missingInfoForm,
                    patientProfile: {
                      ...userData.patientProfile,
                      cccd: missingInfoForm.cccd
                    }
                  });
                  // Update patients[0] state
                  setPatients(patients.map((p, idx) => idx === 0 ? {
                    ...p,
                    phone: missingInfoForm.phone,
                    address: missingInfoForm.address,
                    cccd: missingInfoForm.cccd,
                    specialty: bookingData.specialty,
                    doctor: pendingDoctorDoc.name,
                    doctorId: pendingDoctorDoc.id,
                    doctorPrice: pendingDoctorDoc.rawPrice
                  } : p));

                  // Proceed to step 3
                  setBookingData({ ...bookingData, doctor: pendingDoctorDoc.name, doctorId: pendingDoctorDoc.id, doctorPrice: pendingDoctorDoc.rawPrice });
                  setIsMissingInfoModalOpen(false);
                  setStep(3);
                } else {
                  alert(res.message);
                }
              }} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Số điện thoại *</label>
                  <input required value={missingInfoForm.phone} onChange={e => setMissingInfoForm({ ...missingInfoForm, phone: e.target.value })} type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#2563EB] outline-none font-medium text-gray-900" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Căn cước công dân *</label>
                  <input required value={missingInfoForm.cccd} onChange={e => setMissingInfoForm({ ...missingInfoForm, cccd: e.target.value })} type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#2563EB] outline-none font-medium text-gray-900" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Ngày sinh *</label>
                  <input required value={missingInfoForm.dob} onChange={e => setMissingInfoForm({ ...missingInfoForm, dob: e.target.value })} type="date" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#2563EB] outline-none font-medium text-gray-900" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Giới tính</label>
                  <select value={missingInfoForm.gender} onChange={e => setMissingInfoForm({ ...missingInfoForm, gender: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#2563EB] outline-none font-medium text-gray-900">
                    <option value="Nam">Nam</option><option value="Nữ">Nữ</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Địa chỉ *</label>
                  <input required value={missingInfoForm.address} onChange={e => setMissingInfoForm({ ...missingInfoForm, address: e.target.value })} type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#2563EB] outline-none font-medium text-gray-900" placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/TP" />
                </div>
              </form>
            </div>

            <div className="p-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50 mt-auto">
              <button disabled={isSavingMissingInfo} onClick={() => setIsMissingInfoModalOpen(false)} className="px-5 py-2.5 rounded-xl font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-100 transition-colors">
                Hủy bỏ
              </button>
              <button disabled={isSavingMissingInfo} form="missingInfoForm" type="submit" className="px-6 py-2.5 rounded-xl font-bold text-white bg-[#2563EB] hover:bg-blue-700 shadow-md transition-colors flex items-center gap-2 disabled:opacity-70">
                {isSavingMissingInfo ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Cập nhật & Tiếp tục
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}