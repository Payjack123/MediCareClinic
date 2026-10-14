import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { 
  Phone, Mail, MapPin, Calendar, Clock, ShieldCheck, 
  CheckCircle2, Star, Building2, Stethoscope, Award, 
  ChevronRight, Users, Activity, ArrowLeft, HeartPulse, 
  Share2, Compass, AlertCircle, FileText
} from 'lucide-react';

interface Props {
  params: Promise<{ id: string }>;
}

const FACILITY_EXTRA: Record<number, {
  image: string;
  gallery: string[];
  type: string;
  city: string;
  hotline: string;
  email: string;
  hours: string;
  intro: string;
  vision: string;
  strengths: string[];
  equipment: { name: string; origin: string; desc: string }[];
}> = {
  1: {
    image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1516549655169-df83a0774514?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    ],
    type: 'Bệnh viện Đa khoa Trụ sở chính Miền Bắc',
    city: 'Hà Nội',
    hotline: '0941.298.865',
    email: 'hanoi@medicare.vn',
    hours: 'Thứ 2 - Thứ 7: 07:30 - 17:00 (Ngoại trú & Cấp cứu 24/7)',
    intro: 'MediCare Clinic Hà Nội là cơ sở bệnh viện trọng điểm hàng đầu trong hệ sinh thái y tế MediCare. Tọa lạc tại vị trí đắc địa 144 Xuân Thủy, Cầu Giấy, cơ sở sở hữu quy mô hiện đại, thiết kế theo chuẩn y tế quốc tế với không gian thoáng đãng, thân thiện cùng hệ thống kiểm soát nhiễm khuẩn nghiêm ngặt.',
    vision: 'Trở thành địa chỉ chăm sóc sức khỏe toàn diện và uy tín hàng đầu khu vực miền Bắc, mang lại trải nghiệm y tế an tâm, tiện lợi và chi phí minh bạch cho mọi gia đình.',
    strengths: [
      'Hệ thống phòng khám đa chuyên khoa liên hoàn, khép kín',
      '100% bác sĩ có trình độ sau đại học (Thạc sĩ, Tiến sĩ, Bác sĩ CKII)',
      'Hỗ trợ thanh toán BHYT đúng tuyến & thông tuyến toàn quốc',
      'Bảo lãnh viện phí trực tiếp với hơn 30 hãng bảo hiểm nhân thọ & phi nhân thọ',
      'Ứng dụng công nghệ hồ sơ bệnh án điện tử, tra cứu kết quả xét nghiệm online'
    ],
    equipment: [
      { name: 'Máy chụp cộng hưởng từ MRI 3.0 Tesla', origin: 'Siemens - Đức', desc: 'Độ phân giải siêu cao, chẩn đoán sớm tổn thương thần kinh, sọ não và cơ xương khớp.' },
      { name: 'Hệ thống CT Scanner 128 dãy', origin: 'GE Healthcare - Mỹ', desc: 'Tốc độ quét nhanh, giảm tối đa liều tia xạ cho bệnh nhân, tầm soát tim mạch chính xác.' },
      { name: 'Hệ thống nội soi tiêu hóa phóng đại NBI', origin: 'Olympus - Nhật Bản', desc: 'Phát hiện sớm ung thư thực quản, dạ dày, đại tràng ở giai đoạn mầm mống.' },
      { name: 'Hệ thống xét nghiệm tự động tích hợp Cobas', origin: 'Roche - Thụy Sĩ', desc: 'Xử lý hàng nghìn mẫu xét nghiệm mỗi giờ, kết quả nhanh chóng, tin cậy.' }
    ]
  },
  2: {
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1516549655169-df83a0774514?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    ],
    type: 'Bệnh viện & Trung tâm Kỹ thuật cao Miền Nam',
    city: 'TP. Hồ Chí Minh',
    hotline: '0941.298.866',
    email: 'saigon@medicare.vn',
    hours: 'Thứ 2 - Thứ 7: 07:30 - 17:00 (Khám chuyên gia theo hẹn)',
    intro: 'MediCare Clinic Sài Gòn là cơ sở y tế kỹ thuật cao tọa lạc ngay trung tâm Quận 1, TP. Hồ Chí Minh. Được đầu tư trọng điểm về chuyên khoa sâu như Tim mạch can thiệp, Nhãn khoa và Răng Hàm Mặt, cơ sở đáp ứng nhu cầu thăm khám chất lượng cao cho người dân khu vực phía Nam và kiều bào.',
    vision: 'Tiên phong áp dụng kỹ thuật y khoa hiện đại trong chẩn đoán và điều trị ngoại trú, xây dựng mô hình bệnh viện thông minh, không giấy tờ.',
    strengths: [
      'Trung tâm chuyên sâu về Tim mạch chuyển hóa và Nội khoa kỹ thuật cao',
      'Đội ngũ chuyên gia giàu kinh nghiệm từng công tác tại các bệnh viện tuyến TW',
      'Dịch vụ khám VIP riêng tư, phục vụ chu đáo 1:1',
      'Hỗ trợ thanh toán bảo hiểm y tế và bảo hiểm tư nhân linh hoạt',
      'Bãi đỗ xe ô tô rộng rãi, vị trí trung tâm di chuyển thuận lợi'
    ],
    equipment: [
      { name: 'Máy siêu âm tim màu 4D Doppler cao cấp', origin: 'Philips - Hà Lan', desc: 'Đánh giá cấu trúc và chức năng van tim với hình ảnh không gian 4 chiều chân thực.' },
      { name: 'Hệ thống chụp cắt lớp võng mạc OCT', origin: 'Zeiss - Đức', desc: 'Chẩn đoán các bệnh lý đáy mắt, võng mạc đái tháo đường và thoái hóa hoàng điểm.' },
      { name: 'Ghế máy nha khoa thông minh Kavo', origin: 'Kavo - Đức', desc: 'Tích hợp camera nội soi miệng, vô trùng tuyệt đối, tạo cảm giác thoải mái nhất.' },
      { name: 'Phòng mổ thủ thuật áp lực dương', origin: 'Chuẩn Châu Âu', desc: 'Lọc khí HEPA vô trùng tuyệt đối cho các thủ thuật can thiệp ngoại trú an toàn.' }
    ]
  }
};

const DOCTOR_AVATARS = [
  '/images/doctors/doctor-3.jpg',
];

export const dynamic = 'force-dynamic';

export default async function BenhVienDetailPage({ params }: Props) {
  const { id } = await params;
  const facilityId = parseInt(id, 10);

  if (isNaN(facilityId)) {
    notFound();
  }

  // Truy vấn dữ liệu bệnh viện từ database
  let facility: any = null;
  let doctors: any[] = [];
  try {
    facility = await prisma.facility.findUnique({
      where: { id: facilityId },
      include: {
        clinics: {
          include: {
            specialty: true,
            department: true,
            doctors: {
              include: {
                user: true,
                specialty: true
              }
            }
          },
          orderBy: { id: 'asc' }
        }
      }
    });

    if (!facility) {
      notFound();
    }

    // Lấy danh sách bác sĩ làm việc tại cơ sở này
    doctors = await prisma.doctorProfile.findMany({
      where: {
        status: 'Đang làm việc',
        clinics: {
          some: {
            facilityId: facilityId
          }
        }
      },
      include: {
        user: true,
        specialty: true,
        department: true
      },
      take: 6
    });

    // Nếu relation clinic-doctor chưa map hết, lấy bác sĩ active phù hợp
    if (doctors.length === 0) {
      const allDoctors = await prisma.doctorProfile.findMany({
        where: { status: 'Đang làm việc' },
        include: {
          user: true,
          specialty: true,
          department: true
        },
        take: 6
      });
      doctors = allDoctors;
    }
  } catch (error) {
    console.error('Lỗi lấy chi tiết bệnh viện:', error);
  }

  if (!facility) {
    notFound();
  }

  const extra = FACILITY_EXTRA[facility.id] || FACILITY_EXTRA[1];
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
              <Phone size={14} /> Hotline: {extra.hotline}
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
              <Link href="/landing/benh-vien" className="text-blue-600 transition border-b-2 border-blue-600 py-1">Bệnh viện</Link>
              <Link href="/landing/phong-kham" className="hover:text-blue-600 transition">Phòng khám</Link>
              <Link href="/landing/bac-si" className="hover:text-blue-600 transition">Bác sĩ</Link>
              <Link href="/landing/goi-kham" className="hover:text-blue-600 transition">Gói khám</Link>
              <Link href="/landing/bai-viet" className="hover:text-blue-600 transition">Tin sức khỏe</Link>
              <Link href="/landing/tra-cuu" className="hover:text-blue-600 transition">Tra cứu AI</Link>
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
            <Link href="/landing/benh-vien" className="hover:text-blue-600">Bệnh viện MediCare</Link>
            <ChevronRight size={14} className="mx-2 text-gray-400" />
            <span className="text-gray-900 font-semibold">{facility.name}</span>
          </nav>
        </div>
      </div>

      {/* ==========================================
          4. HERO SECTION (Thông tin bệnh viện)
      ========================================== */}
      <section className="bg-white border-b border-gray-200/80 py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Ảnh bệnh viện lớn */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl overflow-hidden shadow-xl border border-gray-100 relative group">
                <img 
                  src={extra.image} 
                  alt={facility.name} 
                  className="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 bg-blue-600/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow">
                  {extra.type}
                </div>
                <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md text-white p-3 rounded-2xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                    <Star size={16} fill="currentColor" />
                    <span>4.9 / 5.0 (2,450+ lượt đánh giá)</span>
                  </div>
                  <span className="bg-green-500 text-white px-2 py-0.5 rounded font-semibold text-[11px]">Đang mở cửa</span>
                </div>
              </div>

              {/* Gallery nhỏ */}
              <div className="grid grid-cols-3 gap-3 mt-3">
                {extra.gallery.map((imgUrl, idx) => (
                  <div key={idx} className="h-20 rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                    <img src={imgUrl} alt={`Cơ sở ${idx + 1}`} className="w-full h-full object-cover hover:opacity-90 transition-opacity" />
                  </div>
                ))}
              </div>
            </div>

            {/* Thông tin chính & nút CTA */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                <Building2 size={14} /> Cơ sở Y tế Chính quy MediCare
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight leading-tight">
                {facility.name}
              </h1>

              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-blue-600 shrink-0 mt-0.5" />
                  <span className="font-medium text-gray-800 text-base">{facility.address}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock size={18} className="text-orange-500 shrink-0" />
                  <span>{extra.hours}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-green-600 shrink-0" />
                  <span>Hotline đặt hẹn: <strong className="text-gray-900">{extra.hotline}</strong> (Miễn phí cước gọi)</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-indigo-600 shrink-0" />
                  <span>Email tiếp nhận: <strong className="text-gray-900">{extra.email}</strong></span>
                </div>
              </div>

              <p className="text-gray-600 leading-relaxed text-sm pt-2 border-t border-gray-100">
                {extra.intro}
              </p>

              {/* Badges cam kết */}
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-lg flex items-center gap-1.5 border border-emerald-100">
                  <CheckCircle2 size={14} /> Khám BHYT thông tuyến
                </span>
                <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-lg flex items-center gap-1.5 border border-blue-100">
                  <ShieldCheck size={14} /> 100% Bác sĩ chuyên khoa
                </span>
                <span className="bg-purple-50 text-purple-700 text-xs font-semibold px-3 py-1 rounded-lg flex items-center gap-1.5 border border-purple-100">
                  <HeartPulse size={14} /> Trả kết quả online
                </span>
              </div>

              {/* Nút hành động */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Link 
                  href={bookingLink}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-8 rounded-xl transition-all shadow-lg shadow-blue-300/40 text-center flex items-center justify-center gap-2 text-base"
                >
                  <Calendar size={18} /> Đặt lịch khám tại cơ sở này
                </Link>
                <a 
                  href={`tel:${extra.hotline.replace(/[^0-9]/g, '')}`}
                  className="border border-gray-300 hover:border-blue-600 text-gray-700 hover:text-blue-600 font-bold py-3.5 px-6 rounded-xl transition-colors text-center flex items-center justify-center gap-2 text-sm bg-white"
                >
                  <Phone size={16} /> Gọi tư vấn ({extra.hotline})
                </a>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ==========================================
          5. THỐNG KÊ NHANH
      ========================================== */}
      <section className="bg-slate-50 py-8 border-b border-gray-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm text-center">
              <span className="text-3xl font-black text-blue-600 block mb-1">{facility.clinics.length}+</span>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Phòng khám chuyên khoa</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm text-center">
              <span className="text-3xl font-black text-indigo-600 block mb-1">100%</span>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Bác sĩ chứng chỉ hành nghề</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm text-center">
              <span className="text-3xl font-black text-emerald-600 block mb-1">30+</span>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Hãng bảo hiểm liên kết</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm text-center">
              <span className="text-3xl font-black text-orange-600 block mb-1">4.9 ★</span>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Hài lòng của người bệnh</span>
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
            
            {/* CỘT TRÁI: THÔNG TIN CHI TIẾT */}
            <div className="w-full lg:w-2/3 space-y-12">
              
              {/* PHẦN 1: TỔNG QUAN & ĐIỂM NỔI BẬT */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2.5 mb-3">
                    <Building2 className="text-blue-600" size={24} /> Giới thiệu cơ sở & Sứ mệnh
                  </h2>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {extra.vision}
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-3 text-base">Thế mạnh nổi bật tại {facility.name}:</h3>
                  <div className="space-y-2.5">
                    {extra.strengths.map((str, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-sm text-gray-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <CheckCircle2 size={18} className="text-green-600 shrink-0 mt-0.5" />
                        <span>{str}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* PHẦN 2: DANH SÁCH CHUYÊN KHOA & PHÒNG KHÁM (DATA THẬT DATABASE) */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2.5 mb-1">
                      <Stethoscope className="text-blue-600" size={24} /> Danh sách Phòng khám & Chuyên khoa ({facility.clinics.length})
                    </h2>
                    <p className="text-gray-500 text-sm">Các phòng khám chuyên khoa trực thuộc cơ sở đang hoạt động</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {facility.clinics.map((clinic: any) => {
                    const specName = clinic.specialty?.name || clinic.department?.name || 'Khám chuyên khoa';
                    return (
                      <div key={clinic.id} className="p-4 rounded-2xl border border-gray-100 bg-slate-50/70 hover:bg-white hover:border-blue-200 hover:shadow-md transition-all group">
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-xs font-bold text-blue-700 bg-blue-100/70 px-2.5 py-0.5 rounded-md">
                            {clinic.roomNumber ? `Phòng ${clinic.roomNumber}` : 'Phòng tiêu chuẩn'}
                          </span>
                          <span className="flex items-center gap-1 text-[11px] font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> {clinic.status || 'Hoạt động'}
                          </span>
                        </div>
                        <h4 className="font-bold text-gray-900 text-base group-hover:text-blue-600 transition-colors mb-1">
                          {clinic.name}
                        </h4>
                        <p className="text-xs text-gray-500 mb-3">
                          Chuyên khoa: <span className="font-semibold text-gray-700">{specName}</span>
                        </p>
                        <Link 
                          href={bookingLink}
                          className="text-xs text-blue-600 font-bold hover:underline inline-flex items-center gap-1"
                        >
                          Đặt lịch phòng này <ChevronRight size={12} />
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* PHẦN 3: ĐỘI NGŨ BÁC SĨ TẠI CƠ SỞ */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2.5 mb-1">
                      <Award className="text-blue-600" size={24} /> Bác sĩ công tác tại cơ sở ({doctors.length})
                    </h2>
                    <p className="text-gray-500 text-sm">Đội ngũ chuyên gia, bác sĩ đầu ngành thăm khám trực tiếp</p>
                  </div>
                  <Link href="/landing/bac-si" className="text-xs font-bold text-blue-600 hover:underline">
                    Xem tất cả bác sĩ
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {doctors.map((doc, idx) => {
                    const avatar = doc.user.avatar || DOCTOR_AVATARS[idx % DOCTOR_AVATARS.length];
                    const specName = doc.specialty?.name || doc.department?.name || 'Đa khoa';
                    return (
                      <div key={doc.id} className="p-4 rounded-2xl border border-gray-100 bg-white hover:border-blue-300 hover:shadow-lg transition-all flex items-center gap-4 group">
                        <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 border-2 border-blue-50">
                          <img src={avatar} alt={doc.user.fullName} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md inline-block mb-1">
                            {doc.degree || 'Bác sĩ chuyên khoa'}
                          </span>
                          <h4 className="font-bold text-gray-900 text-sm truncate group-hover:text-blue-600 transition-colors">
                            {doc.user.fullName}
                          </h4>
                          <p className="text-xs text-gray-500 truncate mb-2">
                            {specName}
                          </p>
                          <Link 
                            href={bookingLink}
                            className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded-lg inline-block transition-colors"
                          >
                            Đặt khám
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* PHẦN 4: TRANG THIẾT BỊ Y TẾ */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2.5 mb-2">
                  <ShieldCheck className="text-blue-600" size={24} /> Trang thiết bị y khoa hiện đại
                </h2>
                <p className="text-gray-500 text-sm mb-6">Được đầu tư đồng bộ và kiểm định định kỳ theo tiêu chuẩn nghiêm ngặt</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {extra.equipment.map((eq, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-blue-50/40 border border-blue-100/70">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-blue-800">{eq.origin}</span>
                        <CheckCircle2 size={14} className="text-green-600" />
                      </div>
                      <h4 className="font-bold text-gray-900 text-sm mb-1.5">{eq.name}</h4>
                      <p className="text-xs text-gray-600 leading-relaxed">{eq.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* PHẦN 5: QUY TRÌNH KHÁM BỆNH */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2.5 mb-6">
                  <Clock className="text-blue-600" size={24} /> Quy trình khám bệnh tiện lợi
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-black flex items-center justify-center mx-auto mb-3">1</div>
                    <h5 className="font-bold text-gray-900 text-sm mb-1">Đặt hẹn online</h5>
                    <p className="text-xs text-gray-500">Đăng ký ngày giờ và bác sĩ mong muốn</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-black flex items-center justify-center mx-auto mb-3">2</div>
                    <h5 className="font-bold text-gray-900 text-sm mb-1">Tiếp đón ưu tiên</h5>
                    <p className="text-xs text-gray-500">Quét mã QR, không cần lấy số xếp hàng</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-black flex items-center justify-center mx-auto mb-3">3</div>
                    <h5 className="font-bold text-gray-900 text-sm mb-1">Khám chuyên sâu</h5>
                    <p className="text-xs text-gray-500">Bác sĩ thăm khám, làm cận lâm sàng</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-black flex items-center justify-center mx-auto mb-3">4</div>
                    <h5 className="font-bold text-gray-900 text-sm mb-1">Nhận kết quả</h5>
                    <p className="text-xs text-gray-500">Tư vấn phác đồ và lưu hồ sơ online</p>
                  </div>
                </div>
              </div>

            </div>

            {/* CỘT PHẢI: STICKY BOOKING CARD */}
            <div className="w-full lg:w-1/3">
              <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-lg border border-blue-100 sticky top-28 space-y-6">
                
                <div className="border-b border-gray-100 pb-5">
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-1">Đặt khám trực tuyến</span>
                  <h3 className="text-xl font-black text-gray-900">
                    {facility.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 flex items-start gap-1">
                    <MapPin size={14} className="text-blue-500 shrink-0 mt-0.5" />
                    <span>{facility.address}</span>
                  </p>
                </div>

                <div className="space-y-3.5 text-sm">
                  <div className="flex items-center justify-between text-gray-700">
                    <span className="text-gray-500">Giờ phục vụ:</span>
                    <span className="font-bold">07:30 - 17:00</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-700">
                    <span className="text-gray-500">Hình thức khám:</span>
                    <span className="font-bold text-emerald-600">Khám theo hẹn & Khám BHYT</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-700">
                    <span className="text-gray-500">Hotline hỗ trợ:</span>
                    <span className="font-bold text-blue-600">{extra.hotline}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-700">
                    <span className="text-gray-500">Phí đặt lịch:</span>
                    <span className="font-bold text-green-600">Miễn phí hoàn toàn</span>
                  </div>
                </div>

                <div className="bg-blue-50/70 p-4 rounded-2xl text-xs text-blue-800 space-y-2 border border-blue-100">
                  <div className="flex items-center gap-2 font-bold">
                    <ShieldCheck size={16} className="text-blue-600" /> Quyền lợi khi đặt lịch trước:
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    <li>Được ưu tiên vào khám đúng giờ đã chọn</li>
                    <li>Được chỉ định bác sĩ mong muốn</li>
                    <li>Tra cứu kết quả xét nghiệm bảo mật online</li>
                  </ul>
                </div>

                <Link 
                  href={bookingLink}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-300 text-center block text-base"
                >
                  Tiến hành Đặt lịch khám
                </Link>

                <p className="text-[11px] text-gray-400 text-center leading-relaxed">
                  Bệnh nhân cần đăng nhập tài khoản MediCare để hoàn tất đặt lịch hẹn và lưu trữ lịch sử y tế.
                </p>

                <div className="border-t border-gray-100 pt-4 flex items-center justify-center gap-4 text-xs text-gray-500">
                  <Link href="/landing/benh-vien" className="hover:text-blue-600 flex items-center gap-1 font-medium">
                    <ArrowLeft size={14} /> Quay lại danh sách
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
                Hệ thống Y tế MediCare - Nền tảng đặt lịch khám bệnh trực tuyến kết nối bệnh nhân với hệ thống bệnh viện chất lượng cao.
              </p>
              <ul className="space-y-3 mt-6">
                <li className="flex items-start gap-3">
                  <MapPin size={18} className="text-blue-500 mt-0.5 shrink-0" />
                  <span>{facility.name} - {facility.address}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone size={18} className="text-blue-500 shrink-0" />
                  <span>Hotline: {extra.hotline}</span>
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
              <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Cơ sở khác</h4>
              <ul className="space-y-3">
                <li><Link href={`/landing/benh-vien/${facility.id === 1 ? 2 : 1}`} className="hover:text-blue-500 transition">
                  {facility.id === 1 ? 'MediCare TP.HCM' : 'MediCare Hà Nội'}
                </Link></li>
                <li><Link href="/landing/tra-cuu" className="hover:text-blue-500 transition">Tra cứu AI</Link></li>
                <li><Link href="/landing/bai-viet" className="hover:text-blue-500 transition">Tin tức y khoa</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Hỗ trợ 24/7</h4>
              <p className="mb-4 text-gray-400">Liên hệ tổng đài để được tư vấn chọn chuyên khoa phù hợp.</p>
              <a 
                href={`tel:${extra.hotline.replace(/[^0-9]/g, '')}`}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl transition-colors block text-center shadow-md shadow-blue-900"
              >
                Gọi {extra.hotline}
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
