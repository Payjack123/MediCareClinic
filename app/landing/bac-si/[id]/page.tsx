import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { 
  Phone, Mail, MapPin, Calendar, Clock, ShieldCheck, 
  CheckCircle2, Star, Building2, Stethoscope, Award, 
  ChevronRight, Users, Activity, ArrowLeft, HeartPulse, 
  GraduationCap, Languages, FileCheck2, UserCheck, Briefcase
} from 'lucide-react';
import BacSiScheduleSection from './BacSiScheduleSection';

interface Props {
  params: Promise<{ id: string }>;
}

const DOCTOR_AVATARS = [
  '/images/doctors/doctor-3.jpg',
];

export default async function BacSiDetailPage({ params }: Props) {
  const { id } = await params;
  const doctorId = parseInt(id, 10);

  if (isNaN(doctorId)) {
    notFound();
  }

  // Truy vấn thông tin bác sĩ từ database
  const doctor = await prisma.doctorProfile.findFirst({
    where: {
      OR: [
        { id: doctorId },
        { userId: doctorId }
      ]
    },
    include: {
      user: true,
      specialty: true,
      department: true,
      clinics: {
        include: {
          facility: true
        }
      }
    }
  });

  if (!doctor) {
    notFound();
  }

  const avatar = doctor.user.avatar || DOCTOR_AVATARS[doctor.id % DOCTOR_AVATARS.length];
  const specialtyName = doctor.specialty?.name || doctor.department?.name || 'Đa khoa';
  const degree = doctor.degree || 'Thạc sĩ Y Khoa';
  const exp = doctor.experience ? (doctor.experience.includes('năm') ? doctor.experience : `${doctor.experience} năm kinh nghiệm`) : 'Nhiều năm kinh nghiệm';
  const userAddr = doctor.user.address?.toLowerCase() || '';
  const isHcmDoctor = userAddr.includes('hồ chí minh') || userAddr.includes('hcm') || userAddr.includes('sài gòn') || doctor.id >= 10;
  const facility = doctor.clinics?.[0]?.facility || (isHcmDoctor ? {
    id: 2,
    name: 'MediCare Clinic Sài Gòn',
    address: 'Đường Tôn Đức Thắng, Bến Nghé, Quận 1, TP. Hồ Chí Minh'
  } : {
    id: 1,
    name: 'MediCare Clinic Hà Nội',
    address: '144 Xuân Thủy, Cầu Giấy, Hà Nội'
  });
  const clinicName = doctor.clinics?.[0]?.name || `Phòng khám chuyên khoa ${specialtyName}`;
  const price = doctor.price ? `${doctor.price.toLocaleString('vi-VN')}đ` : '150.000đ';
  const university = doctor.university || (facility.name.includes('Hà Nội') ? 'Đại học Y Hà Nội' : 'Đại học Y Dược TP. Hồ Chí Minh');
  const certificateNumber = doctor.certificateNumber || `CCHN-0${doctor.id}824/BYT`;
  const languages = doctor.languages || 'Tiếng Việt, Tiếng Anh';
  const bio = doctor.bio || `Bác sĩ ${doctor.user.fullName} là chuyên gia đầu ngành trong lĩnh vực ${specialtyName}, có nhiều năm kinh nghiệm công tác tại hệ thống Bệnh viện & Phòng khám MediCare. Bác sĩ được đào tạo chuyên sâu và liên tục cập nhật các phác đồ điều trị tiên tiến chuẩn quốc tế.`;
  const bookingLink = '/login';

  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-800 font-sans relative">
      
      {/* ==========================================
          1. TOP BAR
      ========================================== */}
      <div className="bg-[#0b53c1] text-white text-sm py-2 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 font-medium">
              <Phone size={14} /> Hotline: 0941.298.865
            </span>
            <span className="text-blue-200">|</span>
            <Link href="/landing" className="hover:text-blue-200 transition font-medium">Hệ thống Y tế MediCare</Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-medium">Hệ thống đặt lịch khám trực tuyến</span>
            <span className="text-blue-200">|</span>
            <button className="flex items-center gap-1 hover:text-blue-200 transition font-medium">
              Tiếng Việt
            </button>
          </div>
        </div>
      </div>

      {/* ==========================================
          2. HEADER / NAVBAR
      ========================================== */}
      <nav className="bg-white sticky top-0 z-50 shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/landing" className="flex items-center gap-2 cursor-pointer">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-2 shadow-sm">
                  <Activity size={24} className="text-white" />
                </div>
                <span className="font-bold text-3xl tracking-tight text-gray-900">
                  Medi<span className="text-blue-600">Care</span>
                </span>
              </div>
            </Link>

            {/* Menu Desktop */}
            <div className="hidden lg:flex space-x-8 font-semibold text-gray-700 items-center">
              <Link href="/landing/benh-vien" className="hover:text-blue-600 transition">Bệnh viện</Link>
              <Link href="/landing/phong-kham" className="hover:text-blue-600 transition">Phòng khám</Link>
              <Link href="/landing/bac-si" className="text-blue-600 transition border-b-2 border-blue-600 py-1">Bác sĩ</Link>
              <Link href="/landing/goi-kham" className="hover:text-blue-600 transition">Gói khám</Link>
              <Link href="/landing/bai-viet" className="hover:text-blue-600 transition">Tin sức khỏe</Link>
              <Link href="/landing/tra-cuu" className="hover:text-blue-600 transition">Tra cứu</Link>
            </div>

            {/* Right Actions */}
            <div className="hidden md:flex items-center gap-4">
              <Link href="/login" className="text-gray-700 font-semibold hover:text-blue-600 transition flex items-center gap-2">
                <Users size={18} /> Đăng nhập
              </Link>
              <Link href="/register" className="bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] text-white px-5 py-2.5 rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all text-sm">
                Đăng ký
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ==========================================
          3. BREADCRUMB
      ========================================== */}
      <div className="bg-blue-50/60 border-b border-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center text-sm text-gray-500">
            <Link href="/landing" className="hover:text-blue-600">Trang chủ</Link>
            <ChevronRight size={14} className="mx-2 text-gray-400" />
            <Link href="/landing/bac-si" className="hover:text-blue-600">Danh sách Bác sĩ</Link>
            <ChevronRight size={14} className="mx-2 text-gray-400" />
            <span className="text-gray-900 font-semibold">{doctor.user.fullName}</span>
          </nav>
        </div>
      </div>

      {/* ==========================================
          4. HERO DOCTOR PROFILE CARD
      ========================================== */}
      <section className="bg-white border-b border-gray-200/80 py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-blue-50/60 via-white to-indigo-50/40 rounded-3xl p-6 sm:p-10 border border-blue-100/80 shadow-sm">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              
              {/* Avatar lớn */}
              <div className="relative shrink-0 flex flex-col items-center">
                <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-3xl overflow-hidden border-4 border-white shadow-xl relative">
                  <img 
                    src={avatar} 
                    alt={doctor.user.fullName} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="mt-3 bg-blue-600 text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
                  <UserCheck size={14} /> Bác sĩ chính thức
                </div>
              </div>

              {/* Thông tin bác sĩ */}
              <div className="flex-1 space-y-4 text-center md:text-left">
                
                <div>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
                    <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-lg uppercase tracking-wide">
                      {degree}
                    </span>
                    <span className="bg-green-50 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1 border border-green-200/60">
                      <CheckCircle2 size={13} /> {certificateNumber}
                    </span>
                    <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2.5 py-1 rounded-lg text-xs font-bold border border-amber-200/60">
                      <Star size={13} className="fill-amber-400 text-amber-400" />
                      5.0 (250+ lượt đánh giá)
                    </div>
                  </div>

                  <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
                    {doctor.user.fullName}
                  </h1>

                  <p className="text-blue-600 font-bold text-lg mt-1 flex items-center justify-center md:justify-start gap-2">
                    <Stethoscope size={20} /> Chuyên khoa: {specialtyName}
                  </p>
                </div>

                {/* Cơ sở & Kinh nghiệm */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600 bg-white/80 p-4 rounded-2xl border border-gray-100">
                  <div className="flex items-start gap-2.5">
                    <Building2 className="text-blue-600 shrink-0 mt-0.5" size={18} />
                    <div>
                      <span className="font-bold text-gray-900 block">Nơi công tác</span>
                      <Link href={`/landing/benh-vien/${facility.id}`} className="text-blue-600 hover:underline">
                        {facility.name}
                      </Link>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <MapPin className="text-blue-600 shrink-0 mt-0.5" size={18} />
                    <div>
                      <span className="font-bold text-gray-900 block">Phòng khám</span>
                      <span>{clinicName}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Award className="text-amber-500 shrink-0 mt-0.5" size={18} />
                    <div>
                      <span className="font-bold text-gray-900 block">Kinh nghiệm</span>
                      <span>{exp} trong nghề</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <GraduationCap className="text-indigo-600 shrink-0 mt-0.5" size={18} />
                    <div>
                      <span className="font-bold text-gray-900 block">Đào tạo</span>
                      <span>{university}</span>
                    </div>
                  </div>
                </div>

                {/* Giá khám & Nút đặt hẹn */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm text-gray-500 font-medium">Giá khám tiêu chuẩn:</span>
                    <span className="text-2xl font-black text-blue-600">{price}</span>
                    <span className="text-xs text-gray-400">/lượt</span>
                  </div>

                  <div className="flex gap-3 w-full sm:w-auto">
                    <Link 
                      href={bookingLink}
                      className="flex-1 sm:flex-none border border-blue-600 text-blue-600 hover:bg-blue-50 font-bold py-3 px-6 rounded-xl transition-colors text-center text-sm"
                    >
                      Tư vấn trực tuyến
                    </Link>
                    <Link 
                      href={bookingLink}
                      className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-blue-300 text-center flex items-center justify-center gap-2 text-sm"
                    >
                      <Calendar size={18} /> Đặt lịch khám với Bác sĩ
                    </Link>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          5. THỐNG KÊ NHANH CỦA BÁC SĨ
      ========================================== */}
      <section className="bg-slate-50 py-8 border-b border-gray-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm text-center">
              <span className="text-3xl font-black text-blue-600 block mb-1">{exp.replace(/[^0-9]/g, '') || '5'}+</span>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Năm kinh nghiệm</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm text-center">
              <span className="text-3xl font-black text-emerald-600 block mb-1">2,000+</span>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Bệnh nhân đã khám</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm text-center">
              <span className="text-3xl font-black text-amber-500 block mb-1">5.0 ★</span>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Đánh giá xuất sắc</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm text-center">
              <span className="text-3xl font-black text-indigo-600 block mb-1">100%</span>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Cấp chứng chỉ Bộ Y tế</span>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          6. NỘI DUNG CHI TIẾT (2 CỘT)
      ========================================== */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-10">
            
            {/* CỘT TRÁI: CHI TIẾT TIỂU SỬ & CHUYÊN MÔN */}
            <div className="w-full lg:w-2/3 space-y-10">
              
              {/* 1. TIỂU SỬ & GIỚI THIỆU */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2.5">
                  <FileCheck2 className="text-blue-600" size={24} /> Giới thiệu chuyên môn & Quá trình công tác
                </h2>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                  {bio}
                </p>
                <div className="pt-3 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Languages size={18} className="text-blue-600" />
                    <span>Ngôn ngữ giao tiếp: <strong className="text-gray-900">{languages}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={18} className="text-green-600" />
                    <span>Trạng thái: <strong className="text-green-700">Đang nhận đặt lịch khám</strong></span>
                  </div>
                </div>
              </div>

              {/* 2. LĨNH VỰC KHÁM & ĐIỀU TRỊ THẾ MẠNH */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2.5">
                  <Briefcase className="text-blue-600" size={24} /> Lĩnh vực khám & điều trị chuyên sâu
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {[
                    `Khám và chẩn đoán các bệnh lý chuyên khoa ${specialtyName}`,
                    `Tư vấn phác đồ điều trị cá thể hóa cho từng bệnh nhân`,
                    'Khám tầm soát và phát hiện sớm các nguy cơ biến chứng',
                    'Đọc và phân tích kết quả xét nghiệm, chẩn đoán hình ảnh chuyên sâu',
                    'Theo dõi điều trị ngoại trú và quản lý bệnh lý mãn tính',
                    'Tư vấn chế độ dinh dưỡng và lối sống lành mạnh kết hợp'
                  ].map((field, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 bg-blue-50/50 p-3 rounded-xl border border-blue-100/60 text-sm text-gray-800">
                      <CheckCircle2 size={16} className="text-blue-600 shrink-0 mt-0.5" />
                      <span>{field}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. QUÁ TRÌNH ĐÀO TẠO & HỌC VỊ */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2.5">
                  <GraduationCap className="text-blue-600" size={24} /> Bằng cấp & Chứng chỉ chuyên môn
                </h2>
                <div className="space-y-3">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-xs font-bold text-blue-600 uppercase">Học vị đào tạo</span>
                    <h4 className="font-bold text-gray-900 text-base mt-0.5">{degree}</h4>
                    <p className="text-xs text-gray-500 mt-1">{university}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-xs font-bold text-green-600 uppercase">Chứng chỉ hành nghề y</span>
                    <h4 className="font-bold text-gray-900 text-base mt-0.5">{certificateNumber}</h4>
                    <p className="text-xs text-gray-500 mt-1">Cấp bởi Bộ Y tế - Phạm vi chuyên môn: Khám chữa bệnh chuyên khoa {specialtyName}</p>
                  </div>
                </div>
              </div>

              {/* 4. LỊCH KHÁM BỆNH & KHUNG GIỜ NHẬN HẸN */}
              <BacSiScheduleSection 
                doctorId={doctor.id}
                doctorName={doctor.user.fullName}
                clinicName={clinicName}
                facilityName={facility.name}
                facilityAddress={facility.address || ''}
                price={price}
                bookingLink={bookingLink}
              />

            </div>

            {/* CỘT PHẢI: STICKY BOOKING CARD */}
            <div className="w-full lg:w-1/3">
              <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-lg border border-blue-100 sticky top-28 space-y-6">
                
                <div className="border-b border-gray-100 pb-5">
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-1">Đặt khám trực tuyến</span>
                  <h3 className="text-xl font-black text-gray-900">
                    {doctor.user.fullName}
                  </h3>
                  <p className="text-xs text-blue-600 font-semibold mt-1">
                    Chuyên khoa: {specialtyName}
                  </p>
                </div>

                <div className="space-y-3.5 text-sm">
                  <div className="flex items-center justify-between text-gray-700">
                    <span className="text-gray-500">Cơ sở khám:</span>
                    <span className="font-bold truncate max-w-[170px] text-right">{facility.name}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-700">
                    <span className="text-gray-500">Phòng khám:</span>
                    <span className="font-bold">{clinicName}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-700">
                    <span className="text-gray-500">Giá khám:</span>
                    <span className="font-black text-blue-600 text-lg">{price}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-700">
                    <span className="text-gray-500">Đặt hẹn:</span>
                    <span className="font-bold text-green-600">Miễn phí giữ chỗ</span>
                  </div>
                </div>

                <div className="bg-blue-50/70 p-4 rounded-2xl text-xs text-blue-800 space-y-2 border border-blue-100">
                  <div className="flex items-center gap-2 font-bold">
                    <ShieldCheck size={16} className="text-blue-600" /> Cam kết dịch vụ khám MediCare:
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    <li>Khám trực tiếp 1:1 với bác sĩ đúng chuyên môn</li>
                    <li>Không phải xếp hàng chờ đợi lấy số</li>
                    <li>Lưu trữ hồ sơ và đơn thuốc điện tử an toàn</li>
                  </ul>
                </div>

                <Link 
                  href={bookingLink}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-300 text-center block text-base"
                >
                  Đặt lịch khám với Bác sĩ
                </Link>

                <p className="text-[11px] text-gray-400 text-center leading-relaxed">
                  Vui lòng đăng nhập tài khoản Bệnh nhân để tiếp tục chọn ngày giờ và xác nhận đặt lịch hẹn.
                </p>

                <div className="border-t border-gray-100 pt-4 flex items-center justify-center gap-4 text-xs text-gray-500">
                  <Link href="/landing/bac-si" className="hover:text-blue-600 flex items-center gap-1 font-medium">
                    <ArrowLeft size={14} /> Quay lại danh sách bác sĩ
                  </Link>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ==========================================
          7. FOOTER
      ========================================== */}
      <footer className="bg-[#0B1325] text-gray-300 pt-16 pb-8 text-sm mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            
            <div className="lg:col-span-2 pr-8">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Activity size={24} className="text-white" />
                </div>
                <span className="font-bold text-2xl text-white">Medi<span className="text-blue-400">Care</span></span>
              </div>
              <p className="mb-4 text-gray-400 leading-relaxed">
                Hệ thống Y tế MediCare - Nền tảng đặt lịch khám bệnh trực tuyến kết nối bệnh nhân với đội ngũ bác sĩ chuyên khoa giỏi.
              </p>
              <ul className="space-y-3 mt-6">
                <li className="flex items-start gap-3">
                  <MapPin size={18} className="text-blue-500 mt-0.5 shrink-0" />
                  <span>{facility.name} - {facility.address}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone size={18} className="text-blue-500 shrink-0" />
                  <span>Hotline hỗ trợ: 0941.298.865</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Danh mục</h4>
              <ul className="space-y-3">
                <li><Link href="/landing/benh-vien" className="hover:text-blue-500 transition">Bệnh viện</Link></li>
                <li><Link href="/landing/phong-kham" className="hover:text-blue-500 transition">Phòng khám</Link></li>
                <li><Link href="/landing/bac-si" className="hover:text-blue-500 transition">Bác sĩ chuyên khoa</Link></li>
                <li><Link href="/landing/goi-kham" className="hover:text-blue-500 transition">Gói khám sức khỏe</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Chuyên khoa khác</h4>
              <ul className="space-y-3">
                <li><Link href="/landing/bac-si" className="hover:text-blue-500 transition">Bác sĩ Tim mạch</Link></li>
                <li><Link href="/landing/bac-si" className="hover:text-blue-500 transition">Bác sĩ Da liễu</Link></li>
                <li><Link href="/landing/bac-si" className="hover:text-blue-500 transition">Bác sĩ Răng hàm mặt</Link></li>
                <li><Link href="/landing/bac-si" className="hover:text-blue-500 transition">Bác sĩ Mắt</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Hỗ trợ 24/7</h4>
              <p className="mb-4 text-gray-400">Cần tư vấn đặt hẹn hoặc chọn bác sĩ phù hợp? Liên hệ hotline.</p>
              <a 
                href="tel:0941298865"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl transition-colors block text-center shadow-md shadow-blue-900"
              >
                Hotline 0941.298.865
              </a>
            </div>

          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500">
            <p>© 2026 medicare.vn. Bản quyền thuộc Hệ thống Y tế MediCare.</p>
            <div className="flex gap-4">
              <span className="text-xs">Đạt chuẩn chất lượng Bộ Y tế</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
