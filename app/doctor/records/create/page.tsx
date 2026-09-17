'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getInitialCreateData, createDoctorMedicalRecord } from '@/app/doctor/records/create/actions';
import {
  ArrowLeft, Search, Bell, ChevronRight, X, Save,
  User, Activity, Stethoscope, FileText, CalendarClock
} from 'lucide-react';
import DoctorSidebar from '@/app/doctor/Sidebar';

function DoctorMedicalRecordCreateContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const patientId = parseInt(searchParams.get('patientId') || '0');
  const appointmentId = searchParams.get('appointmentId') ? parseInt(searchParams.get('appointmentId')!) : undefined;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initData, setInitData] = useState<any>(null);

  // Form State
  const [reason, setReason] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');
  const [bloodPressure, setBloodPressure] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [respiratoryRate, setRespiratoryRate] = useState('');
  const [temperature, setTemperature] = useState('');
  const [spO2, setSpO2] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [clinicalExam, setClinicalExam] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [secondaryDiagnosis, setSecondaryDiagnosis] = useState('');
  const [treatment, setTreatment] = useState('');
  const [notes, setNotes] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [followUpTime, setFollowUpTime] = useState('');
  const [followUpReason, setFollowUpReason] = useState('');

  useEffect(() => {
    const fetchInit = async () => {
      if (!patientId) {
        setIsLoading(false);
        return;
      }
      const res = await getInitialCreateData(patientId);
      if (res.success && res.data) {
        setInitData(res.data);
        if (res.data.appointment?.reason && res.data.appointment.reason !== 'Khám tổng quát') setReason(res.data.appointment.reason);
        
        if (res.data.latestExamination) {
          if (res.data.latestExamination.symptoms) setSymptoms(res.data.latestExamination.symptoms);
          if (res.data.latestExamination.medicalHistory) setMedicalHistory(res.data.latestExamination.medicalHistory);
          if (res.data.latestExamination.clinicalExam) setClinicalExam(res.data.latestExamination.clinicalExam);
          if (res.data.latestExamination.diagnosis) setDiagnosis(res.data.latestExamination.diagnosis);
          if (res.data.latestExamination.secondaryDiagnosis) setSecondaryDiagnosis(res.data.latestExamination.secondaryDiagnosis);
          if (res.data.latestExamination.treatment) setTreatment(res.data.latestExamination.treatment);
          if (res.data.latestExamination.notes) setNotes(res.data.latestExamination.notes);
        } else if (res.data.patient?.medicalHistory && res.data.patient.medicalHistory !== 'Không có') {
          setMedicalHistory(res.data.patient.medicalHistory);
        }
      }
      setIsLoading(false);
    };
    fetchInit();
  }, [patientId]);

  const handleSave = async () => {
    setIsSubmitting(true);
    const data = {
      patientId,
      appointmentId: appointmentId || initData?.appointment?.id,
      reason,
      symptoms,
      medicalHistory,
      clinicalExam,
      diagnosis,
      secondaryDiagnosis,
      treatment,
      notes,
      followUpDate,
      followUpTime,
      followUpReason,
      vitals: { bloodPressure, heartRate, respiratoryRate, temperature, spO2, weight, height }
    };
    const res = await createDoctorMedicalRecord(data);
    setIsSubmitting(false);
    if (res.success) {
      router.push('/doctor/records/detail?id=' + res.data?.examinationId);
    } else {
      alert(res.message || 'Lỗi');
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin"></div></div>;
  if (!patientId || !initData) return (
    <div className="flex h-screen bg-[#F8FAFC]">
      <DoctorSidebar activePage="records" />
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <div className="flex flex-col items-center justify-center h-[80vh] gap-4 text-gray-500">
          <p>Vui lòng chọn bệnh nhân trước khi tạo bệnh án.</p>
          <Link href="/doctor/patients" className="px-6 py-2 bg-[#2563EB] text-white font-bold rounded-xl shadow-sm hover:bg-blue-700 transition-colors">Quay lại danh sách bệnh nhân</Link>
        </div>
      </main>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-[#FAFAFA] font-sans text-gray-800">
      <DoctorSidebar activePage="records" />

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* TOP HEADER */}
        <header className="bg-white border-b border-gray-100 shrink-0 z-10 px-8 py-4 flex items-center justify-between sticky top-0">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push('/doctor/patients')} className="p-2 hover:bg-gray-50 rounded-full transition-colors text-gray-500">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900 leading-none mb-1.5 flex items-center gap-2">Tạo hồ sơ bệnh án <span className="text-gray-300">|</span> <span className="text-[#2563EB]">{initData.patient.name}</span></h1>
              <div className="text-[13px] text-gray-500 flex items-center gap-1.5">
                <span>Vui lòng điền đầy đủ các thông tin khám bệnh bên dưới</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <button className="relative p-2 text-gray-500 hover:bg-gray-50 rounded-full transition-colors">
              <Bell size={20} />
            </button>
            <div className="flex items-center gap-3 pl-5 border-l border-gray-100">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-bold text-gray-900 leading-tight mb-0.5">BS. {initData.doctor.name}</p>
                <p className="text-xs text-gray-500">{initData.doctor.specialty}</p>
              </div>
              <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(initData.doctor.name)}&background=E0E7FF&color=2563EB`} alt="Doctor" className="w-10 h-10 rounded-full border border-gray-200" />
            </div>
          </div>
        </header>

        {/* SCROLLABLE BODY */}
        <div className="flex-1 overflow-y-auto px-8 py-8 pb-28 custom-scrollbar">
          <div className="max-w-4xl mx-auto space-y-6">

            {/* 1. THÔNG TIN KHÁM BỆNH */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
               <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                  <User size={18} className="text-[#2563EB]" />
                  <h2 className="font-bold text-gray-900 text-[15px]">1. Thông tin hành chính & Lần khám</h2>
               </div>
               <div className="p-6">
                  <div className="flex items-center gap-6 mb-6 pb-6 border-b border-gray-50">
                     <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(initData.patient.name)}&background=random`} alt="Avatar" className="w-16 h-16 rounded-full" />
                     <div className="flex-1 grid grid-cols-3 gap-4 text-[13px]">
                        <div>
                           <p className="text-gray-500 mb-1">Mã bệnh nhân</p>
                           <p className="font-bold text-gray-900">{initData.patient.code}</p>
                        </div>
                        <div>
                           <p className="text-gray-500 mb-1">Ngày sinh</p>
                           <p className="font-bold text-gray-900">{initData.patient.dob}</p>
                        </div>
                        <div>
                           <p className="text-gray-500 mb-1">Giới tính</p>
                           <p className="font-bold text-gray-900">{initData.patient.gender}</p>
                        </div>
                     </div>
                  </div>
                  
                  <div className="space-y-4">
                     <div>
                        <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Lý do khám <span className="text-red-500">*</span></label>
                        <input type="text" value={reason} onChange={e => setReason(e.target.value)} placeholder="Nhập lý do bệnh nhân đến khám" className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Triệu chứng (Bệnh sử)</label>
                           <textarea rows={3} value={symptoms} onChange={e => setSymptoms(e.target.value)} placeholder="Mô tả các triệu chứng lâm sàng" className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"></textarea>
                        </div>
                        <div>
                           <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Tiền sử bệnh</label>
                           <textarea rows={3} value={medicalHistory} onChange={e => setMedicalHistory(e.target.value)} placeholder="Tiền sử bệnh lý cá nhân và gia đình" className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"></textarea>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* 2. SINH HIỆU */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
               <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                  <Activity size={18} className="text-red-500" />
                  <h2 className="font-bold text-gray-900 text-[15px]">2. Chỉ số sinh tồn</h2>
               </div>
               <div className="p-6">
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                     <div>
                        <label className="block text-[12px] font-bold text-gray-600 mb-1.5">Huyết áp</label>
                        <div className="relative">
                           <input type="text" value={bloodPressure} onChange={e => setBloodPressure(e.target.value)} placeholder="120/80" className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-center focus:outline-none focus:border-blue-500 font-medium" />
                           <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-gray-400">mmHg</span>
                        </div>
                     </div>
                     <div>
                        <label className="block text-[12px] font-bold text-gray-600 mb-1.5">Nhịp tim</label>
                        <div className="relative">
                           <input type="text" value={heartRate} onChange={e => setHeartRate(e.target.value)} placeholder="70" className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-center focus:outline-none focus:border-blue-500 font-medium" />
                           <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-gray-400">lần/p</span>
                        </div>
                     </div>
                     <div>
                        <label className="block text-[12px] font-bold text-gray-600 mb-1.5">Nhiệt độ</label>
                        <div className="relative">
                           <input type="text" value={temperature} onChange={e => setTemperature(e.target.value)} placeholder="37" className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-center focus:outline-none focus:border-blue-500 font-medium" />
                           <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-gray-400">°C</span>
                        </div>
                     </div>
                     <div>
                        <label className="block text-[12px] font-bold text-gray-600 mb-1.5">SpO2</label>
                        <div className="relative">
                           <input type="text" value={spO2} onChange={e => setSpO2(e.target.value)} placeholder="98" className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-center focus:outline-none focus:border-blue-500 font-medium" />
                           <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-gray-400">%</span>
                        </div>
                     </div>
                     <div>
                        <label className="block text-[12px] font-bold text-gray-600 mb-1.5">Cân nặng</label>
                        <div className="relative">
                           <input type="text" value={weight} onChange={e => setWeight(e.target.value)} placeholder="65" className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-center focus:outline-none focus:border-blue-500 font-medium" />
                           <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-gray-400">kg</span>
                        </div>
                     </div>
                     <div>
                        <label className="block text-[12px] font-bold text-gray-600 mb-1.5">Chiều cao</label>
                        <div className="relative">
                           <input type="text" value={height} onChange={e => setHeight(e.target.value)} placeholder="170" className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-center focus:outline-none focus:border-blue-500 font-medium" />
                           <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-gray-400">cm</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* 3. KHÁM LÂM SÀNG & CHẨN ĐOÁN */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
               <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                  <Stethoscope size={18} className="text-emerald-500" />
                  <h2 className="font-bold text-gray-900 text-[15px]">3. Khám lâm sàng & Chẩn đoán</h2>
               </div>
               <div className="p-6 space-y-5">
                  <div>
                     <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Khám lâm sàng toàn thân & các cơ quan</label>
                     <textarea rows={3} value={clinicalExam} onChange={e => setClinicalExam(e.target.value)} placeholder="Ghi nhận các dấu hiệu lâm sàng khi thăm khám..." className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"></textarea>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                        <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Chẩn đoán sơ bộ / chính <span className="text-red-500">*</span></label>
                        <div className="relative">
                           <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                           <input type="text" value={diagnosis} onChange={e => setDiagnosis(e.target.value)} placeholder="Tìm chẩn đoán (ICD-10)..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                        </div>
                     </div>
                     <div>
                        <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Chẩn đoán phụ (kèm theo)</label>
                        <div className="relative">
                           <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                           <input type="text" value={secondaryDiagnosis} onChange={e => setSecondaryDiagnosis(e.target.value)} placeholder="Tìm chẩn đoán (ICD-10)..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* 4. ĐIỀU TRỊ & KẾ HOẠCH */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
               <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                  <FileText size={18} className="text-orange-500" />
                  <h2 className="font-bold text-gray-900 text-[15px]">4. Hướng điều trị & Kế hoạch theo dõi</h2>
               </div>
               <div className="p-6 space-y-5">
                  <div>
                     <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Hướng điều trị / Phác đồ</label>
                     <textarea rows={3} value={treatment} onChange={e => setTreatment(e.target.value)} placeholder="Ghi nhận phương pháp điều trị, các chỉ định cần thiết..." className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"></textarea>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-orange-50/50 p-4 rounded-xl border border-orange-100/50">
                     <div>
                        <label className="block text-[13px] font-bold text-gray-700 mb-1.5 flex items-center gap-1.5"><CalendarClock size={16} className="text-orange-500"/> Kế hoạch tái khám</label>
                        <div className="grid grid-cols-2 gap-3 mb-3">
                           <input type="date" value={followUpDate} onChange={e => setFollowUpDate(e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-orange-500" />
                           <input type="time" value={followUpTime} onChange={e => setFollowUpTime(e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-orange-500" />
                        </div>
                        <input type="text" value={followUpReason} onChange={e => setFollowUpReason(e.target.value)} placeholder="Lý do tái khám (nếu có)" className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-orange-500" />
                     </div>
                     <div>
                        <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Ghi chú thêm</label>
                        <textarea rows={4} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Những dặn dò thêm cho bệnh nhân hoặc lưu ý chuyên môn..." className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-orange-500 resize-none"></textarea>
                     </div>
                  </div>
               </div>
            </div>

          </div>
        </div>

        {/* BOTTOM FIXED ACTION BAR */}
        <div className="bg-white border-t border-gray-100 px-8 py-4 shrink-0 flex items-center justify-between z-20">
          <button onClick={() => router.back()} className="flex items-center gap-2 px-5 py-2.5 text-[13px] font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
            <X size={16} /> Hủy bỏ
          </button>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1.5 px-5 py-2.5 bg-white border border-[#2563EB] rounded-xl text-[13px] font-bold text-[#2563EB] hover:bg-blue-50 transition-colors">
              <Save size={16} /> Lưu nháp
            </button>
            <button onClick={handleSave} disabled={isSubmitting || !reason || !diagnosis} className="flex items-center gap-1.5 px-8 py-2.5 bg-[#2563EB] text-white rounded-xl shadow-md text-[13px] font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {isSubmitting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Save size={16} />}
              {isSubmitting ? 'Đang lưu...' : 'Lưu và Hoàn thành'}
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}

export default function DoctorMedicalRecordCreate() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin"></div></div>}>
      <DoctorMedicalRecordCreateContent />
    </Suspense>
  );
}
