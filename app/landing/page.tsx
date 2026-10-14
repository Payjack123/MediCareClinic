import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { 
  Phone, Mail, MapPin, Search, ChevronRight,
  Shield, CheckCircle2, Clock, Activity, Building2,
  Users, Stethoscope, HeartPulse, Award, MessageSquare, 
  Menu, Star
} from 'lucide-react';

const FACILITY_METADATA: Record<number, { image: string; tag: string; city: string; desc: string }> = {
  1: {
    image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    tag: 'Trụ sở Hà Nội',
    city: 'Hà Nội',
    desc: 'Bệnh viện cơ sở hiện đại hàng đầu thủ đô với đầy đủ chuyên khoa, phòng khám và trang thiết bị chuẩn quốc tế.'
  },
  2: {
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    tag: 'Cơ sở TP.HCM',
    city: 'TP. Hồ Chí Minh',
    desc: 'Bệnh viện & Trung tâm y tế kỹ thuật cao tại trung tâm TP. Hồ Chí Minh, phục vụ khám chữa bệnh chất lượng cao.'
  }
};

const DEFAULT_FACILITY_IMAGE = 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';

const DOCTOR_AVATARS = [
  '/images/doctors/doctor-3.jpg',
];

export default async function HomePage() {
  const bookingLink = '/login';

  // Lấy dữ liệu thật 2 bệnh viện từ database
  const rawFacilities = await prisma.facility.findMany({
    include: {
      clinics: {
        include: {
          specialty: true
        }
      }
    },
    orderBy: { id: 'asc' }
  });

  // Lấy dữ liệu thật danh sách Bác sĩ từ database
  const rawDoctors = await prisma.doctorProfile.findMany({
    where: {
      status: 'Đang làm việc'
    },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          avatar: true,
          phone: true,
          address: true
        }
      },
      specialty: true,
      department: true,
      clinics: {
        include: {
          facility: true
        }
      }
    },
    orderBy: { id: 'asc' },
    take: 8
  });

  // Lấy dữ liệu 3 gói khám tiêu biểu từ database
  let featuredPackages: any[] = [];
  try {
    featuredPackages = await (prisma as any).healthPackage.findMany({
      where: { status: 'HOAT_DONG' },
      orderBy: { price: 'asc' },
      take: 3
    });
  } catch (e) {
    console.error('Error fetching featured health packages:', e);
  }

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
            <Link href="#" className="hover:text-blue-200 transition font-medium">Hệ thống Y tế MediCare</Link>
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
            <Link href="/" className="flex items-center gap-2 cursor-pointer">
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
            
            {/* Mobile Menu Button */}
            <button className="lg:hidden text-gray-700 p-2">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* ==========================================
          3. HERO & SEARCH SECTION
      ========================================== */}
      <section className="relative bg-white pt-16 pb-20 overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-50/50 rounded-bl-[100px] -z-10"></div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50 -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full font-semibold text-sm mb-6 border border-blue-100">
              <Shield size={16} /> Hệ thống Đặt lịch khám Bệnh viện MediCare
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Đặt lịch khám với <span className="text-blue-600">Bác sĩ chuyên gia</span> MediCare
            </h1>
            <p className="text-gray-500 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
              Hệ thống bệnh viện hiện đại tại Hà Nội và TP. Hồ Chí Minh. Đặt lịch khám nhanh chóng, chủ động thời gian, nhận kết quả online.
            </p>

            {/* Search Widget */}
            <div className="bg-white p-3 rounded-2xl shadow-xl border border-gray-100 flex flex-col md:flex-row gap-3 max-w-3xl mx-auto relative z-10">
              <div className="flex-1 flex items-center px-4 bg-gray-50 rounded-xl">
                <Search className="text-gray-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Tìm bác sĩ, chuyên khoa, phòng khám MediCare..." 
                  className="w-full bg-transparent border-none focus:ring-0 px-3 py-4 text-gray-700 outline-none"
                />
              </div>
              <Link 
                href={bookingLink} 
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl transition-colors md:w-auto w-full text-center flex items-center justify-center shadow-md shadow-blue-200"
              >
                Đặt lịch khám ngay
              </Link>
            </div>
            
            {/* Trending tags */}
            <div className="mt-6 flex flex-wrap justify-center gap-2 text-sm text-gray-500">
              <span className="font-medium mr-2">Cơ sở & Chuyên khoa:</span>
              {['MediCare Hà Nội', 'MediCare TP.HCM', 'Nội tổng quát', 'Tim mạch', 'Da liễu', 'Cơ xương khớp'].map((tag, idx) => (
                <Link key={idx} href={bookingLink} className="bg-white border border-gray-200 px-3 py-1 rounded-full hover:border-blue-500 hover:text-blue-600 transition-colors">
                  {tag}
                </Link>
              ))}
            </div>

            {/* Trust Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 pt-10 border-t border-gray-100">
              <div className="flex flex-col items-center">
                <span className="text-3xl font-black text-blue-600 mb-1">2 Cơ sở</span>
                <span className="text-gray-600 font-medium">Hà Nội & TP.HCM</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-black text-blue-600 mb-1">18+</span>
                <span className="text-gray-600 font-medium">Bác sĩ chuyên gia</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-black text-blue-600 mb-1">100%</span>
                <span className="text-gray-600 font-medium">Đặt hẹn online</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-black text-blue-600 mb-1">24/7</span>
                <span className="text-gray-600 font-medium">Tư vấn hỗ trợ</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          4. QUICK BOOKING CARDS
      ========================================== */}
      <section className="py-12 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative -mt-20 z-20">
            {[
              { title: 'Đặt lịch bệnh viện', desc: 'Chọn khám tại 2 cơ sở MediCare Hà Nội hoặc TP.HCM', icon: <Building2 size={32} />, href: '/landing/benh-vien' },
              { title: 'Đặt lịch phòng khám', desc: 'Khám chuyên khoa tiêu chuẩn với 14+ phòng khám hiện đại', icon: <Activity size={32} />, href: '/landing/phong-kham' },
              { title: 'Đặt khám bác sĩ', desc: 'Chọn bác sĩ giỏi, đặt trước giờ khám nhanh chóng', icon: <Stethoscope size={32} />, href: '/landing/bac-si' },
              { title: 'Đặt khám theo gói', desc: 'Gói khám sức khỏe tổng quát, tầm soát chuyên sâu', icon: <HeartPulse size={32} />, href: '/landing/goi-kham' },
            ].map((item, idx) => (
              <Link 
                key={idx} 
                href={item.href} 
                className="bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all group cursor-pointer block"
              >
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  {item.icon}
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{item.desc}</p>
                <div className="flex items-center text-blue-600 font-semibold text-sm group-hover:gap-2 transition-all">
                  Đặt lịch ngay <ChevronRight size={16} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          5. REPUTABLE HOSPITALS / 2 BỆNH VIỆN MEDICARE (DỮ LIỆU THẬT DATABASE)
      ========================================== */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <div className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                🏥 Hệ thống Bệnh viện MediCare
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Bệnh viện & Cơ sở MediCare</h2>
              <p className="text-gray-500 text-sm mt-1">2 bệnh viện cơ sở chính quy đạt chuẩn chất lượng cao tại Hà Nội và TP. Hồ Chí Minh</p>
            </div>
            <Link href="/landing/benh-vien" className="hidden sm:flex text-blue-600 font-semibold hover:text-blue-700 items-center gap-1">
              Xem chi tiết cơ sở <ChevronRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {rawFacilities.map((hos, idx) => {
              const meta = FACILITY_METADATA[hos.id] || {
                image: DEFAULT_FACILITY_IMAGE,
                tag: idx === 0 ? 'Trụ sở Hà Nội' : 'Cơ sở TP.HCM',
                city: idx === 0 ? 'Hà Nội' : 'TP. Hồ Chí Minh',
                desc: 'Bệnh viện đạt tiêu chuẩn quốc tế thuộc hệ thống MediCare.'
              };
              const clinicsCount = hos.clinics.length || (idx === 0 ? 8 : 7);

              return (
                <div key={hos.id} className="flex flex-col sm:flex-row bg-white border border-gray-100 rounded-3xl p-5 shadow-sm hover:shadow-xl transition-all gap-6 group hover:-translate-y-1">
                  <Link 
                    href={`/landing/benh-vien/${hos.id}`}
                    className="w-full sm:w-2/5 aspect-[4/3] bg-gray-100 rounded-2xl relative overflow-hidden flex-shrink-0 block cursor-pointer"
                  >
                    <img 
                      src={meta.image} 
                      alt={hos.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur px-2.5 py-1 rounded-lg text-xs font-bold text-blue-600 flex items-center gap-1 shadow-sm">
                      <CheckCircle2 size={13} /> {meta.tag}
                    </div>
                    <div className="absolute bottom-3 right-3 bg-blue-600/90 backdrop-blur text-white px-2 py-0.5 rounded text-[11px] font-semibold">
                      Đạt chuẩn Bộ Y Tế
                    </div>
                  </Link>
                  <div className="flex flex-col justify-between flex-1">
                    <div>
                      <div className="flex items-center gap-1 text-amber-500 text-xs font-bold mb-1">
                        <Star size={14} className="fill-amber-400 text-amber-400" />
                        <span>4.9 / 5.0 (Xuất sắc)</span>
                      </div>
                      <Link href={`/landing/benh-vien/${hos.id}`}>
                        <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-blue-600 transition-colors cursor-pointer">
                          {hos.name}
                        </h3>
                      </Link>
                      <p className="text-gray-500 text-sm flex items-start gap-1.5 mb-3 leading-relaxed">
                        <MapPin size={16} className="text-blue-500 shrink-0 mt-0.5" />
                        {hos.address}
                      </p>
                      <p className="text-gray-400 text-xs mb-4 line-clamp-2">
                        {meta.desc}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-5">
                        <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg text-xs font-semibold">
                          {clinicsCount} Chuyên khoa & Phòng khám
                        </span>
                        <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg text-xs font-semibold">
                          Hỗ trợ BHYT
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Link 
                        href={`/landing/benh-vien/${hos.id}`}
                        className="flex-1 border border-blue-600 text-blue-600 font-bold py-3 rounded-xl hover:bg-blue-50 transition-colors text-center text-sm"
                      >
                        Xem chi tiết
                      </Link>
                      <Link 
                        href={bookingLink} 
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-blue-200 text-center text-sm"
                      >
                        Đặt lịch khám
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==========================================
          6. TOP DOCTORS (DỮ LIỆU THẬT DATABASE)
      ========================================== */}
      <section className="py-16 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <div className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                🩺 Đội ngũ Bác sĩ MediCare
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Bác sĩ hàng đầu hệ thống</h2>
              <p className="text-gray-500 text-sm mt-1">Đội ngũ bác sĩ, chuyên gia giàu kinh nghiệm luôn sẵn sàng phục vụ</p>
            </div>
            <Link href="/landing/bac-si" className="hidden sm:flex text-blue-600 font-semibold hover:text-blue-700 items-center gap-1">
              Xem tất cả ({rawDoctors.length}) bác sĩ <ChevronRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {rawDoctors.map((doc, idx) => {
              const avatar = doc.user.avatar || DOCTOR_AVATARS[idx % DOCTOR_AVATARS.length];
              const specialtyName = doc.specialty?.name || doc.department?.name || 'Đa khoa';
              const degree = doc.degree || 'Bác sĩ chuyên khoa';
              const exp = doc.experience ? (doc.experience.includes('năm') ? doc.experience : `${doc.experience} năm KN`) : 'Nhiều năm KN';
              const userAddr = doc.user?.address?.toLowerCase() || '';
              const isHcmDoctor = userAddr.includes('hồ chí minh') || userAddr.includes('hcm') || userAddr.includes('sài gòn') || doc.id >= 10;
              const facilityName = doc.clinics?.[0]?.facility?.name || (isHcmDoctor ? 'MediCare TP.HCM' : 'MediCare Hà Nội');

              return (
                <div key={doc.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col justify-between">
                  <div>
                    <Link href={`/landing/bac-si/${doc.id}`} className="block">
                      <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden bg-gray-100 border-4 border-white shadow-md relative cursor-pointer">
                        <img 
                          src={avatar} 
                          alt={doc.user.fullName} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                        />
                      </div>
                    </Link>
                    <div className="text-center mb-4">
                      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">
                        {degree}
                      </div>
                      <Link href={`/landing/bac-si/${doc.id}`}>
                        <h3 className="font-bold text-gray-900 text-base mb-1 group-hover:text-blue-600 transition-colors cursor-pointer">
                          {doc.user.fullName}
                        </h3>
                      </Link>
                      <p className="text-sm font-semibold text-blue-600 mb-2">
                        {specialtyName}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center justify-center gap-1 line-clamp-1">
                        <MapPin size={12} className="text-gray-400" />
                        {facilityName}
                      </p>
                      <div className="flex items-center justify-center gap-2 mt-3">
                        <span className="inline-block bg-orange-50 text-orange-600 px-2 py-0.5 rounded text-xs font-bold">
                          {exp}
                        </span>
                        <span className="inline-block bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-bold">
                          {doc.price ? `${doc.price.toLocaleString('vi-VN')}đ` : '150.000đ'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link 
                      href={`/landing/bac-si/${doc.id}`} 
                      className="flex-1 border border-blue-600 text-blue-600 font-bold py-2 rounded-xl hover:bg-blue-50 transition-all text-center block text-xs"
                    >
                      Chi tiết
                    </Link>
                    <Link 
                      href={bookingLink} 
                      className="flex-1 bg-blue-600 text-white font-bold py-2 rounded-xl hover:bg-blue-700 transition-all text-center block text-xs shadow-sm shadow-blue-200"
                    >
                      Đặt khám
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==========================================
          7. HEALTH PACKAGES
      ========================================== */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end mb-12">
            <div className="text-center sm:text-left">
              <div className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                📦 Gói khám sức khỏe
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Gói khám tiết kiệm & toàn diện</h2>
              <p className="text-gray-500 text-sm mt-1">Đa dạng lựa chọn tầm soát từ cơ bản đến chuyên sâu cho mọi lứa tuổi</p>
            </div>
            <Link href="/landing/goi-kham" className="mt-4 sm:mt-0 text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-1">
              Xem tất cả gói khám <ChevronRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {(featuredPackages.length > 0 ? featuredPackages : [
              { id: 1, name: 'Gói Khám Tổng Quát Cơ Bản', price: 1500000, features: ['Khám nội tổng quát', 'Xét nghiệm máu cơ bản', 'Siêu âm ổ bụng', 'Chụp X-Quang tim phổi'] },
              { id: 3, name: 'Gói Khám Nâng Cao (VIP)', price: 3200000, discount: 15, features: ['Khám chuyên khoa', 'Tầm soát ung thư (3 chỉ số)', 'Siêu âm tuyến giáp', 'Điện tâm đồ', 'Nội soi Tiêu hóa'] },
              { id: 4, name: 'Gói Tầm Soát Toàn Diện (VVIP)', price: 6500000, features: ['Tầm soát ung thư toàn diện', 'MRI/CT Scanner', 'Xét nghiệm chuyên sâu', 'Khám phụ/nam khoa', 'Tư vấn dinh dưỡng'] },
            ]).map((pkg: any, idx: number) => {
              const isRecommended = idx === 1 || pkg.discount > 10;
              const colors = ['bg-gradient-to-br from-teal-600 to-teal-700', 'bg-gradient-to-br from-blue-600 to-blue-700', 'bg-gradient-to-br from-indigo-600 to-purple-700'];
              const headerColor = colors[idx % colors.length];
              const featuresList = Array.isArray(pkg.features) 
                ? pkg.features 
                : typeof pkg.features === 'string' 
                  ? JSON.parse(pkg.features) 
                  : ['Khám nội tổng quát', 'Xét nghiệm cơ bản', 'Chẩn đoán hình ảnh'];

              return (
                <div key={pkg.id || idx} className={`bg-white rounded-3xl overflow-hidden border ${isRecommended ? 'border-blue-500 shadow-2xl scale-105 z-10' : 'border-gray-200 shadow-sm'} relative flex flex-col hover:shadow-xl transition-all`}>
                  {isRecommended && (
                    <div className="absolute top-0 right-0 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg shadow-sm">
                      {pkg.discount ? `ƯU ĐÃI -${pkg.discount}%` : 'ĐƯỢC CHỌN NHIỀU'}
                    </div>
                  )}
                  <div className={`${headerColor} text-white p-7 text-center`}>
                    <h3 className="font-bold text-lg mb-2 line-clamp-2 min-h-[3.5rem] flex items-center justify-center">{pkg.name}</h3>
                    <div className="text-3xl font-black mb-1">
                      {Number(pkg.price).toLocaleString('vi-VN')}đ
                    </div>
                    {pkg.oldPrice ? (
                      <p className="text-white/70 line-through text-xs font-medium">
                        {Number(pkg.oldPrice).toLocaleString('vi-VN')}đ
                      </p>
                    ) : (
                      <p className="text-white/80 text-xs">Giá trọn gói niêm yết</p>
                    )}
                  </div>
                  <div className="p-7 flex-1 flex flex-col justify-between">
                    <ul className="space-y-3 mb-8 flex-1">
                      {featuresList.slice(0, 5).map((feature: string, i: number) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <CheckCircle2 size={18} className="text-blue-500 shrink-0 mt-0.5" />
                          <span className="text-gray-600 text-sm line-clamp-2">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link 
                      href={`/landing/goi-kham/${pkg.id}`} 
                      className={`w-full font-bold py-3.5 rounded-xl transition-all block text-center ${isRecommended ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200' : 'bg-blue-50 hover:bg-blue-100 text-blue-700'}`}
                    >
                      Xem chi tiết & Đặt khám
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==========================================
          8. WHY CHOOSE MEDICARE
      ========================================== */}
      <section className="py-20 bg-blue-900 text-white relative overflow-hidden">
        {/* Abstract background */}
        <div className="absolute inset-0 opacity-10">
           <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
             <defs>
               <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                 <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
               </pattern>
             </defs>
             <rect width="100%" height="100%" fill="url(#grid)" />
           </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block bg-white/20 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
              💖 Vì sao chọn MediCare
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">Ưu điểm vượt trội của nền tảng</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Shield size={40}/>, title: 'Bác sĩ & Cơ sở uy tín', desc: '100% bác sĩ và phòng khám được thẩm định, xác thực thông tin rõ ràng.' },
              { icon: <Clock size={40}/>, title: 'Tiết kiệm thời gian', desc: 'Chủ động chọn giờ khám. Không phải xếp hàng chờ đợi lấy số mệt mỏi.' },
              { icon: <Award size={40}/>, title: 'Chuyên gia hàng đầu', desc: 'Mạng lưới chuyên gia, giáo sư, bác sĩ đầu ngành trên toàn quốc.' },
            ].map((item, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 text-center hover:-translate-y-2 transition-transform">
                <div className="inline-flex p-4 bg-blue-500 rounded-2xl mb-6 text-white shadow-lg">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-blue-100">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          9. FOOTER
      ========================================== */}
      <footer className="bg-[#0B1325] text-gray-300 pt-16 pb-8 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            
            {/* Col 1: Brand & Info */}
            <div className="lg:col-span-2 pr-8">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Activity size={24} className="text-white" />
                </div>
                <span className="font-bold text-2xl text-white">Medi<span className="text-blue-400">Care</span></span>
              </div>
              <p className="mb-4 text-gray-400 leading-relaxed">
                Công ty Cổ phần Công nghệ Y tế MediCare.<br/>
                Nền tảng đặt lịch khám bệnh trực tuyến số 1 tại Việt Nam, kết nối bệnh nhân với hệ thống y tế uy tín.
              </p>
              <ul className="space-y-3 mt-6">
                <li className="flex items-start gap-3">
                  <MapPin size={18} className="text-blue-500 mt-0.5 shrink-0" />
                  <span>Trụ sở: Tòa nhà ABC, 123 Đường XYZ, Cầu Giấy, Hà Nội</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone size={18} className="text-blue-500 shrink-0" />
                  <span>Hotline: 0941.298.865</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={18} className="text-blue-500 shrink-0" />
                  <span>Email: support@medicare.vn</span>
                </li>
              </ul>
            </div>

            {/* Col 2: Categories */}
            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Danh mục</h4>
              <ul className="space-y-3">
                <li><Link href="#" className="hover:text-blue-500 transition">Bệnh viện</Link></li>
                <li><Link href="#" className="hover:text-blue-500 transition">Phòng khám</Link></li>
                <li><Link href="#" className="hover:text-blue-500 transition">Bác sĩ chuyên khoa</Link></li>
                <li><Link href="#" className="hover:text-blue-500 transition">Gói khám sức khỏe</Link></li>
                <li><Link href="#" className="hover:text-blue-500 transition">Tin tức y tế</Link></li>
              </ul>
            </div>

            {/* Col 3: Account & Support */}
            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Hỗ trợ</h4>
              <ul className="space-y-3">
                <li><Link href="#" className="hover:text-blue-500 transition">Tài khoản của tôi</Link></li>
                <li><Link href="#" className="hover:text-blue-500 transition">Lịch khám đã đặt</Link></li>
                <li><Link href="#" className="hover:text-blue-500 transition">Câu hỏi thường gặp (FAQ)</Link></li>
                <li><Link href="#" className="hover:text-blue-500 transition">Điều khoản sử dụng</Link></li>
                <li><Link href="#" className="hover:text-blue-500 transition">Chính sách bảo mật</Link></li>
              </ul>
            </div>

            {/* Col 4: Register Partner */}
            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Đối tác</h4>
              <p className="mb-4 text-gray-400">Tham gia hệ thống MediCare để tiếp cận hàng triệu bệnh nhân.</p>
              <button className="bg-transparent border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white font-bold py-2 px-4 rounded-lg transition-colors w-full mb-4">
                Đăng ký đối tác
              </button>
              
              <div className="mt-6">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Da_dang_ky_bo_cong_thuong.png/320px-Da_dang_ky_bo_cong_thuong.png" alt="Bộ Công Thương" className="h-12 opacity-80" />
              </div>
            </div>
            
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500">
            <p>© 2026 medicare.vn. Bảo lưu mọi quyền.</p>
            <div className="flex gap-4">
               {/* Social Icons Placeholder */}
               <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer text-white">f</div>
               <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer text-white">yt</div>
            </div>
          </div>
        </div>
      </footer>



    </div>
  );
}
