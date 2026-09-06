'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CalendarDays, Users, Bell, Check, Search, ArrowLeft, ArrowRight, UserCircle2, Clock, Plus, Filter, Info, Trash2, HeartPulse, Pill, TestTube, FileText, LayoutDashboard, Settings, Activity, LogOut, Wallet, Star, ShieldCheck, Stethoscope, ChevronRight, X, Phone, Mail, MapPin, User, Loader2, Link2, Download, Eye, Calendar, History, Smile, Bone, CheckCircle2, Landmark, Lock } from 'lucide-react';
import QRCode from 'react-qr-code';
import PatientSidebar from '@/app/patient/Sidebar';

import { getPatientAppointmentData, getBookedTimes, createAppointment, findPatientByQuery } from '@/app/patient/appointments/actions';

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
  const [selectedDoctorDetail, setSelectedDoctorDetail] = useState<any>(null);

  const [bookingData, setBookingData] = useState({
    specialty: '',
    doctor: '',
    doctorId: 0,
    doctorPrice: 150000,
    date: '',
    finalCodes: [] as string[]
  });

  const [patients, setPatients] = useState<any[]>([
    { id: 1, name: '', phone: '', address: '', time: '', reason: '', specialty: '', doctor: '', doctorId: 0, doctorPrice: 0, cccd: '', patientCode: '' }
  ]);
  const [activePatientId, setActivePatientId] = useState<number>(1);
  const [isChangingDoctorForId, setIsChangingDoctorForId] = useState<number | null>(null);

  // States cho modal thêm mới bệnh nhân
  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);
  const [hasAccountStatus, setHasAccountStatus] = useState<'idle' | 'yes' | 'no'>('idle');
  const [searchPatientType, setSearchPatientType] = useState<'phone' | 'cccd' | 'code' | null>(null);
  const [searchPatientQuery, setSearchPatientQuery] = useState('');
  const [searchPatientResult, setSearchPatientResult] = useState<any>(null);
  const [isSearchingPatient, setIsSearchingPatient] = useState(false);
  const [searchPatientError, setSearchPatientError] = useState('');

  const handleAddNewPatient = (foundPatientData: any = null) => {
    const newId = Date.now();
    setPatients([...patients, {
      id: newId,
      name: foundPatientData?.fullName || '',
      phone: foundPatientData?.phone || '',
      address: foundPatientData?.address || '',
      time: '',
      reason: '',
      cccd: foundPatientData?.patientProfile?.cccd || foundPatientData?.cccd || '',
      patientCode: foundPatientData?.patientProfile?.patientCode || '',
      specialty: bookingData.specialty,
      doctor: bookingData.doctor,
      doctorId: bookingData.doctorId,
      doctorPrice: bookingData.doctorPrice
    }]);
    setActivePatientId(newId);
    setIsAddPatientModalOpen(false);
  };

  const specialties = [
    { id: 'SP1', name: 'Nội tổng quát', icon: Stethoscope, color: 'text-blue-500 bg-blue-50' },
    { id: 'SP2', name: 'Tim mạch', icon: HeartPulse, color: 'text-red-500 bg-red-50' },
    { id: 'SP3', name: 'Răng hàm mặt', icon: Smile, color: 'text-yellow-500 bg-yellow-50' },
    { id: 'SP4', name: 'Cơ xương khớp', icon: Bone, color: 'text-orange-500 bg-orange-50' },
    { id: 'SP5', name: 'Mắt (Nhãn khoa)', icon: Eye, color: 'text-emerald-500 bg-emerald-50' },
    { id: 'SP6', name: 'Da liễu', icon: Activity, color: 'text-purple-500 bg-purple-50' },
  ];
  const availableTimes = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '14:00', '14:30', '15:00', '15:30'];

  useEffect(() => {
    const fetchData = async () => {
      const res = await getPatientAppointmentData();
      if (res.success && res.data) {
        setUserData(res.data.user);

        // Cập nhật người đầu tiên nếu chưa có tên
        if (patients[0].name === '') {
          setPatients([{
            id: 1,
            name: res.data.user?.fullName || '',
            phone: res.data.user?.phone || '',
            address: res.data.user?.address || '',
            time: '',
            reason: '',
            specialty: '',
            doctor: '',
            doctorId: 0,
            doctorPrice: 0,
            cccd: res.data.user?.patientProfile?.cccd || '',
            patientCode: res.data.user?.patientProfile?.patientCode || ''
          }]);
        }

        const formattedDoctors = res.data.doctors.map((doc: any) => ({
          id: doc.id,
          name: doc.fullName,
          specialty: doc.doctorProfile?.specialty || 'Đa khoa',
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
          status: doc.doctorProfile?.status || 'Đang làm việc'
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
      } else {
        router.push('/login');
      }
      setIsLoading(false);
    };
    fetchData();
  }, [router]);

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

  // Polling check trạng thái thanh toán SePay
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 6 && paymentCode) {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`/api/appointments/check-payment?code=${paymentCode}`);
          const data = await res.json();
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
        status: overrideStatus || 'CHỜ XÁC NHẬN'
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
          <div className="flex items-center gap-5 ml-auto">
            <button className="relative p-2.5 text-gray-500 hover:bg-blue-50 hover:text-[#2563EB] rounded-full transition bg-white border border-gray-200 shadow-sm">
              <Bell size={20} />
            </button>
            <div className="flex items-center gap-3 pl-5 border-l border-gray-200 cursor-pointer group">
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

            {/* Stepper removed */}

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden min-h-[500px] flex flex-col relative animate-in fade-in slide-in-from-bottom-4">

              {/* STEP 1: CHỌN CHUYÊN KHOA */}
              {step === 1 && (
                <div className="p-8 flex-1 flex flex-col animate-in slide-in-from-right-8">
                  <div className="mb-6 text-center">
                    <h2 className="text-2xl font-black text-gray-900">Chọn chuyên khoa</h2>
                    <p className="text-gray-500 mt-2">Vui lòng chọn chuyên khoa bạn muốn thăm khám để chúng tôi đề xuất bác sĩ phù hợp.</p>
                  </div>
                  <div className="relative mb-8 max-w-md mx-auto w-full">
                    <input type="text" placeholder="Tìm kiếm chuyên khoa..." className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#2563EB] outline-none transition-all" />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {specialties.map((spec) => {
                      // Tính số bác sĩ có trong khoa này
                      const count = getDoctorCount(spec.name);

                      return (
                        <div
                          key={spec.id}
                          onClick={() => { setBookingData({ ...bookingData, specialty: spec.name, doctor: '', doctorId: 0 }); setStep(2); }}
                          className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center justify-center text-center gap-3 group ${bookingData.specialty === spec.name ? 'border-[#2563EB] bg-blue-50/50' : 'border-gray-100 bg-white hover:border-blue-200 hover:shadow-md'}`}
                        >
                          <div className={`w-14 h-14 rounded-full flex items-center justify-center ${spec.color} transition-transform group-hover:scale-110`}>
                            <spec.icon size={28} />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900">{spec.name}</h3>
                            {/* Hiển thị số lượng bác sĩ */}
                            <p className={`text-xs mt-1 ${count > 0 ? 'text-blue-600 font-medium' : 'text-gray-400'}`}>
                              {count > 0 ? `${count} bác sĩ` : 'Chưa có bác sĩ'}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* STEP 2: CHỌN BÁC SĨ */}
              {step === 2 && (
                <div className="p-8 flex-1 flex flex-col animate-in slide-in-from-right-8">
                  <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                    <button onClick={() => setStep(1)} className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-600 transition"><ArrowLeft size={20} /></button>
                    <div>
                      <h2 className="text-xl font-black text-gray-900">Chọn bác sĩ ({bookingData.specialty})</h2>
                      <p className="text-gray-500 text-sm mt-1">Lựa chọn bác sĩ mà bạn muốn đặt lịch khám.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredDoctors.length > 0 ? filteredDoctors.map((doc) => (
                      <div
                        key={doc.id}
                        className="border border-gray-200 rounded-2xl p-5 hover:border-[#2563EB] hover:shadow-md transition-all flex flex-col bg-white"
                      >
                        <div className="flex gap-4">
                          <div className="w-16 h-16 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xl font-black text-indigo-600 shrink-0 overflow-hidden">
                            {doc.avatar ? <img src={doc.avatar} alt={doc.name} className="w-full h-full object-cover" /> : doc.image}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 text-lg leading-tight">{doc.name}</h3>
                            <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5"><Stethoscope size={14} /> Kinh nghiệm: {doc.exp}</p>
                            <div className="flex items-center gap-1 mt-1 text-sm font-bold text-orange-500">
                              <Star size={14} fill="currentColor" /> {doc.rating}
                            </div>
                          </div>
                        </div>
                        <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                          <div>
                            <p className="text-xs text-gray-500 uppercase font-bold">Phí khám</p>
                            <p className="font-black text-[#2563EB]">{doc.price}</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setSelectedDoctorDetail(doc)}
                              className="bg-white border border-[#2563EB] text-[#2563EB] hover:bg-blue-50 px-4 py-2 rounded-xl font-bold transition-colors text-sm flex items-center"
                            >
                              Xem hồ sơ
                            </button>
                            <button
                              onClick={() => {
                                setBookingData({ ...bookingData, doctor: doc.name, doctorId: doc.id, doctorPrice: doc.rawPrice });
                                setPatients(patients.map(p => p.id === patients[0].id ? {
                                  ...p,
                                  specialty: bookingData.specialty,
                                  doctor: doc.name,
                                  doctorId: doc.id,
                                  doctorPrice: doc.rawPrice
                                } : p));
                                setStep(3);
                              }}
                              className="bg-blue-50 text-[#2563EB] hover:bg-[#2563EB] hover:text-white px-5 py-2 rounded-xl font-bold transition-colors text-sm"
                            >
                              Chọn khám
                            </button>
                          </div>
                        </div>
                      </div>
                    )) : (
                      <div className="col-span-2 text-center py-12 bg-gray-50 rounded-2xl border border-gray-100 text-gray-500">
                        <Stethoscope size={48} className="mx-auto text-gray-300 mb-3" />
                        <p className="font-medium text-gray-900">Không có bác sĩ</p>
                        <p className="text-sm mt-1">Hiện không có bác sĩ nào đăng ký thuộc chuyên khoa này.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 3: CHỌN NGÀY GIỜ & LÝ DO */}
              {step === 3 && (
                <div className="p-8 flex-1 flex flex-col animate-in slide-in-from-right-8">
                  <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                    <button onClick={() => setStep(2)} className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-600 transition"><ArrowLeft size={20} /></button>
                    <div>
                      <h2 className="text-xl font-black text-gray-900">Chọn thời gian khám</h2>
                      <p className="text-gray-500 text-sm mt-1">Vui lòng khai báo thông tin bệnh nhân và chọn khung giờ.</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Chọn Ngày */}
                    <div className="mb-6">
                      <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase">1. Chọn ngày khám</h3>
                      <input
                        type="date"
                        value={bookingData.date}
                        onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                        min={new Date().toISOString().split('T')[0]} // Không cho phép chọn ngày quá khứ
                        className="w-full max-w-[250px] px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-lg font-bold text-gray-800 focus:ring-4 focus:ring-blue-100 focus:border-[#2563EB] outline-none transition-all cursor-pointer"
                      />
                    </div>

                    {/* Khai báo Người khám */}
                    <div className={`transition-opacity ${bookingData.date ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                      <div className="flex items-center justify-between mb-3 border-t border-gray-100 pt-6">
                        <h3 className="font-bold text-gray-900 text-sm uppercase">2. Danh sách người khám</h3>
                        <button
                          onClick={() => {
                            setHasAccountStatus('idle');
                            setSearchPatientType(null);
                            setSearchPatientQuery('');
                            setSearchPatientResult(null);
                            setSearchPatientError('');
                            setIsAddPatientModalOpen(true);
                          }}
                          className="flex items-center gap-1 text-sm font-bold text-[#2563EB] bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition"
                        >
                          <Plus size={16} /> Thêm mới
                        </button>
                      </div>

                      {/* Tabs người khám */}
                      <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar mb-4">
                        {patients.map((p, idx) => (
                          <button
                            key={p.id}
                            onClick={() => setActivePatientId(p.id)}
                            className={`shrink-0 px-4 py-2 rounded-lg font-bold text-sm transition-all border ${activePatientId === p.id ? 'bg-[#2563EB] text-white border-[#2563EB]' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                          >
                            Người {idx + 1}: {p.name || 'Chưa nhập'}
                          </button>
                        ))}
                      </div>

                      {/* Form chi tiết người khám đang chọn */}
                      {patients.map(p => p.id === activePatientId && (
                        <div key={p.id} className="bg-gray-50 rounded-xl p-5 border border-gray-200">

                          {/* Khối hiển thị thông tin Bác sĩ phụ trách */}
                          <div className="bg-white border border-blue-100 rounded-xl p-4 mb-5 flex justify-between items-center shadow-sm">
                            <div>
                              <p className="text-xs font-bold text-gray-400 uppercase mb-1">Bác sĩ phụ trách</p>
                              <p className="font-bold text-gray-900">{p.doctor} <span className="text-sm font-normal text-gray-500 ml-1">({p.specialty})</span></p>
                            </div>
                            <button
                              onClick={() => setIsChangingDoctorForId(p.id)}
                              className="text-sm font-bold text-[#2563EB] bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition"
                            >
                              Thay đổi bác sĩ
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                            <div>
                              <label className="block text-xs font-bold text-gray-500 mb-1">Họ và tên <span className="text-red-500">*</span></label>
                              <input
                                type="text"
                                value={p.name}
                                onChange={(e) => setPatients(patients.map(pat => pat.id === p.id ? { ...pat, name: e.target.value } : pat))}
                                placeholder="Nhập họ tên"
                                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2563EB] outline-none transition-all"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-gray-500 mb-1">Số điện thoại <span className="text-red-500">*</span></label>
                              <input
                                type="text"
                                value={p.phone}
                                onChange={(e) => setPatients(patients.map(pat => pat.id === p.id ? { ...pat, phone: e.target.value } : pat))}
                                placeholder="Nhập SĐT"
                                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2563EB] outline-none transition-all"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-gray-500 mb-1">Căn cước công dân</label>
                              <input
                                type="text"
                                value={p.cccd}
                                onChange={(e) => setPatients(patients.map(pat => pat.id === p.id ? { ...pat, cccd: e.target.value } : pat))}
                                placeholder="Nhập CCCD (nếu có)"
                                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2563EB] outline-none transition-all"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-gray-500 mb-1">Địa chỉ</label>
                              <input
                                type="text"
                                value={p.address}
                                onChange={(e) => setPatients(patients.map(pat => pat.id === p.id ? { ...pat, address: e.target.value } : pat))}
                                placeholder="Nhập địa chỉ"
                                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2563EB] outline-none transition-all"
                              />
                            </div>
                          </div>

                          <label className="block text-xs font-bold text-gray-500 mb-2">Chọn khung giờ khám (Giờ thật) <span className="text-red-500">*</span></label>
                          <div className="mb-5">
                            <input
                              type="time"
                              value={p.time}
                              onChange={(e) => setPatients(patients.map(pat => pat.id === p.id ? { ...pat, time: e.target.value } : pat))}
                              className={`w-full max-w-[200px] px-4 py-3 bg-white border-2 rounded-xl text-lg font-bold outline-none transition-all ${p.time ? 'border-[#2563EB] text-[#2563EB] focus:ring-4 ring-blue-100' : 'border-gray-200 text-gray-500 focus:border-blue-300'
                                }`}
                            />
                          </div>

                          <label className="block text-xs font-bold text-gray-500 mb-1">Lý do khám (Tùy chọn)</label>
                          <textarea
                            rows={2}
                            value={p.reason}
                            onChange={(e) => setPatients(patients.map(pat => pat.id === p.id ? { ...pat, reason: e.target.value } : pat))}
                            placeholder="Mô tả sơ bộ triệu chứng..."
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2563EB] outline-none text-sm bg-white resize-none"
                          ></textarea>

                          {patients.length > 1 && (
                            <button
                              onClick={() => {
                                const newPatients = patients.filter(pat => pat.id !== p.id);
                                setPatients(newPatients);
                                setActivePatientId(newPatients[0].id);
                              }}
                              className="mt-4 flex items-center gap-1.5 text-red-500 text-sm font-bold hover:bg-red-50 px-3 py-1.5 rounded-lg transition"
                            >
                              <Trash2 size={16} /> Xóa người này
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-auto pt-6 flex justify-end">
                    <button
                      disabled={
                        !bookingData.date ||
                        patients.some(p =>
                          !p.time ||
                          !p.name ||
                          !p.phone
                        )
                      }
                      onClick={() => setStep(4)}
                      className="bg-[#2563EB] text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-md transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Tiếp tục <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: XÁC NHẬN */}
              {step === 4 && (
                <div className="p-8 flex-1 flex flex-col animate-in slide-in-from-right-8 bg-gray-50/50">
                  <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
                    <button onClick={() => setStep(3)} className="p-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-full text-gray-600 transition"><ArrowLeft size={20} /></button>
                    <div>
                      <h2 className="text-2xl font-black text-gray-900">Xác nhận lịch hẹn</h2>
                      <p className="text-gray-500 text-sm mt-1">Vui lòng kiểm tra lại thông tin trước khi hoàn tất.</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 relative overflow-hidden">
                    <div className="absolute -left-3 top-1/2 w-6 h-6 bg-gray-50 rounded-full border-r border-gray-200"></div>
                    <div className="absolute -right-3 top-1/2 w-6 h-6 bg-gray-50 rounded-full border-l border-gray-200"></div>
                    <div className="absolute left-4 right-4 top-1/2 border-t-2 border-dashed border-gray-100"></div>

                    <div className="pb-6">
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Danh sách người khám</h3>
                      <div className="space-y-3">
                        {patients.map((p, idx) => (
                          <div key={p.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden group hover:border-[#2563EB] hover:shadow-md transition-all">
                            {/* Card Header */}
                            <div className="bg-gray-50 border-b border-gray-100 px-4 py-3 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-7 h-7 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-sm font-bold shrink-0 shadow-inner">
                                  {idx + 1}
                                </div>
                                <h4 className="font-bold text-gray-900 text-base">{p.name}</h4>
                              </div>
                              <span className="text-xs font-bold bg-blue-100 text-[#2563EB] px-2 py-1 rounded-md uppercase tracking-wider border border-blue-200">
                                {p.patientCode || 'KHÁCH LẺ'}
                              </span>
                            </div>

                            {/* Card Body */}
                            <div className="p-4 space-y-4">
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p className="text-xs text-gray-500 mb-1">Số điện thoại</p>
                                  <p className="font-bold text-gray-900">{p.phone}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 mb-1">Căn cước công dân</p>
                                  <p className="font-bold text-gray-900">{p.cccd || 'Không có'}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 mb-1">Giờ khám dự kiến</p>
                                  <div className="inline-flex items-center gap-1.5 bg-blue-50 text-[#2563EB] px-2.5 py-1 rounded-md font-black border border-blue-100 shadow-sm">
                                    <Clock size={14} className="shrink-0" /> {p.time}
                                  </div>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 mb-1">Mã bệnh nhân</p>
                                  <p className="font-bold text-gray-900">{p.patientCode || 'Không có'}</p>
                                </div>
                              </div>

                              {p.reason && (
                                <>
                                  <div className="h-px bg-gray-100 w-full"></div>
                                  <div className="flex gap-3">
                                    <FileText size={16} className="text-gray-400 mt-0.5 shrink-0" />
                                    <div className="w-full">
                                      <p className="text-xs text-gray-500 mb-1.5">Lý do khám</p>
                                      <p className="font-medium text-gray-800 text-sm leading-relaxed bg-yellow-50/50 p-3 rounded-lg border border-yellow-100">{p.reason}</p>
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-6">
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Thông tin bác sĩ & ngày khám</h3>
                      <div className="space-y-3">
                        {patients.map((p, idx) => (
                          <div key={`doc-${p.id}`} className="bg-blue-50/50 rounded-xl p-4 border border-blue-100">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <p className="font-bold text-gray-900 text-sm">Bệnh nhân: {p.name}</p>
                                <p className="text-xs text-gray-500">{p.phone}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-[#2563EB] text-sm">{p.doctorPrice.toLocaleString('vi-VN')}đ</p>
                              </div>
                            </div>
                            <div className="bg-white p-3 rounded-lg border border-gray-100 mt-2">
                              <p className="font-bold text-gray-900">{p.doctor}</p>
                              <p className="text-xs text-gray-500 font-medium">{p.specialty}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 flex flex-col gap-2 bg-gray-50 p-4 rounded-xl border border-gray-200">
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-medium text-gray-600">Tổng số người:</span>
                          <span className="font-bold text-gray-900">{patients.length}</span>
                        </div>
                        <div className="h-px bg-gray-200 w-full my-1"></div>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-gray-700 text-lg">Tổng cộng:</span>
                          <span className="font-black text-2xl text-emerald-600">
                            {patients.reduce((sum, p) => sum + p.doctorPrice, 0).toLocaleString('vi-VN')} VNĐ
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-center text-gray-400 mt-3">* Thanh toán trực tiếp tại quầy lễ tân tầng 1.</p>
                    </div>
                  </div>

                  <div className="mt-auto pt-6">
                    <button
                      disabled={isSubmitting}
                      onClick={() => setStep(5)}
                      className="w-full bg-[#2563EB] text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-2 disabled:bg-blue-400"
                    >
                      {isSubmitting ? <Loader2 className="animate-spin" size={24} /> : <CheckCircle2 size={24} />} Xác nhận đặt lịch ngay
                    </button>
                  </div>
                </div>
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
                      MB Bank
                    </div>

                    <div className="p-4 bg-white border-2 border-dashed border-[#2563EB] rounded-2xl shadow-sm mb-8 flex justify-center">
                      <img
                        src={`https://img.vietqr.io/image/MB-0968973608-compact.png?amount=${patients.reduce((sum, p) => sum + p.doctorPrice, 0)}&addInfo=${paymentCode}`}
                        alt="QR Code Chuyển Khoản"
                        className="w-[200px] h-[200px] object-contain"
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
                    <p className="text-xs text-gray-400 mt-4 text-center">Giao diện sẽ tự động chuyển sau khi ngân hàng báo thành công (thường từ 5 - 15 giây).</p>
                    <p className="text-xs text-gray-400 mt-4 text-center">Hệ thống sẽ tự động xác nhận sau khi nhận được tiền.</p>
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
                            <p className="text-xs font-medium text-gray-500 mt-1">Mã lịch: {code}</p>
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
                    setBookingData({
                      ...bookingData,
                      doctor: selectedDoctorDetail.name,
                      doctorId: selectedDoctorDetail.id,
                      doctorPrice: selectedDoctorDetail.rawPrice
                    });
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
          <div className="relative bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-black text-gray-900">Thêm người khám mới</h2>
              <button
                onClick={() => setIsAddPatientModalOpen(false)}
                className="p-2 text-gray-500 hover:bg-gray-200 rounded-full transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              {hasAccountStatus === 'idle' && (
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <UserCircle2 size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Người bệnh này đã có tài khoản trên hệ thống chưa?</h3>
                  <p className="text-sm text-gray-500 mb-6">Nếu đã từng khám hoặc đăng ký tài khoản, bạn có thể tra cứu để điền thông tin tự động.</p>

                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => setHasAccountStatus('yes')}
                      className="w-full py-3.5 bg-[#2563EB] hover:bg-blue-700 text-white font-bold rounded-xl transition shadow-md"
                    >
                      Đã có tài khoản (Tra cứu)
                    </button>
                    <button
                      onClick={() => handleAddNewPatient()}
                      className="w-full py-3.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold rounded-xl transition border border-gray-200"
                    >
                      Chưa có tài khoản (Tạo mới)
                    </button>
                  </div>
                </div>
              )}

              {hasAccountStatus === 'yes' && searchPatientType === null && (
                <div className="animate-in slide-in-from-right-4 text-center">
                  <div className="flex justify-start mb-4">
                    <button
                      onClick={() => setHasAccountStatus('idle')}
                      className="flex items-center gap-1 text-gray-500 text-sm font-medium hover:text-gray-900 transition"
                    >
                      <ArrowLeft size={16} /> Quay lại
                    </button>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-5 text-lg">Chọn phương thức tra cứu</h3>
                  <div className="flex flex-col gap-3">
                    <button onClick={() => setSearchPatientType('cccd')} className="w-full py-3.5 bg-white border-2 border-gray-200 hover:border-[#2563EB] hover:bg-blue-50 text-gray-700 font-bold rounded-xl transition shadow-sm">
                      Tra cứu bằng Căn cước công dân
                    </button>
                    <button onClick={() => setSearchPatientType('phone')} className="w-full py-3.5 bg-white border-2 border-gray-200 hover:border-[#2563EB] hover:bg-blue-50 text-gray-700 font-bold rounded-xl transition shadow-sm">
                      Tra cứu bằng Số điện thoại
                    </button>
                    <button onClick={() => setSearchPatientType('code')} className="w-full py-3.5 bg-white border-2 border-gray-200 hover:border-[#2563EB] hover:bg-blue-50 text-gray-700 font-bold rounded-xl transition shadow-sm">
                      Tra cứu bằng Mã bệnh nhân
                    </button>
                  </div>
                </div>
              )}

              {hasAccountStatus === 'yes' && searchPatientType !== null && (
                <div className="animate-in slide-in-from-right-4">
                  <button
                    onClick={() => {
                      setSearchPatientType(null);
                      setSearchPatientQuery('');
                      setSearchPatientResult(null);
                      setSearchPatientError('');
                    }}
                    className="flex items-center gap-1 text-gray-500 text-sm font-medium hover:text-gray-900 mb-4 transition"
                  >
                    <ArrowLeft size={16} /> Quay lại chọn phương thức
                  </button>

                  <h3 className="font-bold text-gray-900 mb-2 text-base">
                    Tra cứu bằng {searchPatientType === 'cccd' ? 'Căn cước công dân' : searchPatientType === 'phone' ? 'Số điện thoại' : 'Mã bệnh nhân'}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Nhập {searchPatientType === 'cccd' ? 'CCCD' : searchPatientType === 'phone' ? 'SĐT' : 'Mã bệnh nhân'} để tra cứu hồ sơ.
                  </p>

                  <div className="flex gap-2 mb-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={searchPatientQuery}
                        onChange={(e) => setSearchPatientQuery(e.target.value)}
                        placeholder={`VD: ${searchPatientType === 'phone' ? '0981234567' : searchPatientType === 'cccd' ? '001201012345' : 'BN24...'}`}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#2563EB] outline-none transition-all"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const btn = document.getElementById('btnSearchPatient');
                            if (btn) btn.click();
                          }
                        }}
                      />
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                    <button
                      id="btnSearchPatient"
                      disabled={isSearchingPatient || !searchPatientQuery.trim()}
                      onClick={async () => {
                        setIsSearchingPatient(true);
                        setSearchPatientError('');
                        setSearchPatientResult(null);
                        const res = await findPatientByQuery(searchPatientQuery);
                        if (res.success) {
                          setSearchPatientResult(res.data);
                        } else {
                          setSearchPatientError(res.message || 'Lỗi không xác định');
                        }
                        setIsSearchingPatient(false);
                      }}
                      className="px-5 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition disabled:opacity-50 flex items-center justify-center shrink-0"
                    >
                      {isSearchingPatient ? <Loader2 size={20} className="animate-spin" /> : 'Tra cứu'}
                    </button>
                  </div>

                  {searchPatientError && (
                    <p className="text-sm text-red-500 font-medium mb-4 flex items-center gap-1.5"><Info size={16} /> {searchPatientError}</p>
                  )}

                  {searchPatientResult && (
                    <div className="mt-5 bg-blue-50/50 border border-blue-100 rounded-xl p-4 animate-in fade-in">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg shrink-0">
                          {searchPatientResult.fullName.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 text-base">{searchPatientResult.fullName}</h4>
                          <div className="grid grid-cols-2 gap-y-1 mt-2 text-sm">
                            <p className="text-gray-600"><span className="text-gray-400">Mã BN:</span> {searchPatientResult.patientCode}</p>
                            <p className="text-gray-600"><span className="text-gray-400">SĐT:</span> {searchPatientResult.phone}</p>
                            <p className="text-gray-600"><span className="text-gray-400">CCCD:</span> {searchPatientResult.cccd || 'Không có'}</p>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleAddNewPatient(searchPatientResult)}
                        className="w-full mt-4 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition shadow-sm"
                      >
                        Xác nhận thêm người này
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}