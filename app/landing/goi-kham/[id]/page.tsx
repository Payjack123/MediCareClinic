import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { 
  Phone, Mail, MapPin, Calendar, Clock, ShieldCheck, 
  CheckCircle2, Star, Building2, Stethoscope, Award, 
  ChevronRight, Users, Activity, ArrowLeft, HeartPulse, 
  Sparkles, FileText, Check, AlertCircle, Share2, Tag, Info
} from 'lucide-react';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PackageDetailPage({ params }: Props) {
  const { id } = await params;
  const packageId = parseInt(id, 10);

  if (isNaN(packageId)) {
    notFound();
  }

  // Lấy dữ liệu chi tiết gói khám từ database
  const pkg = await prisma.healthPackage.findUnique({
    where: { id: packageId },
    include: { facility: true }
  });

  if (!pkg) {
    notFound();
  }

  const bookingLink = '/login';
  const features = Array.isArray(pkg.features) ? pkg.features : [];
  const details = Array.isArray(pkg.details) ? pkg.details : [];
  const isVip = pkg.category.includes('VIP');

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
              <Link href="/landing/bac-si" className="hover:text-blue-600 transition">Bác sĩ</Link>
              <Link href="/landing/goi-kham" className="text-blue-600 transition border-b-2 border-blue-600 py-1">Gói khám</Link>
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
      <div className="bg-white border-b border-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center text-sm text-gray-500 gap-2 flex-wrap">
            <Link href="/landing" className="hover:text-blue-600 transition">Trang chủ</Link>
            <ChevronRight size={14} />
            <Link href="/landing/goi-kham" className="hover:text-blue-600 transition">Gói khám sức khỏe</Link>
            <ChevronRight size={14} />
            <span className="text-gray-900 font-medium truncate max-w-xs sm:max-w-md">
              {pkg.name}
            </span>
          </nav>
        </div>
      </div>

      {/* ==========================================
          4. HERO BANNER GÓI KHÁM
      ========================================== */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            
            {/* Image Thumbnail */}
            <div className="w-full md:w-5/12">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 shadow-md relative group">
                <img 
                  src={pkg.image || 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} 
                  alt={pkg.name} 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className={`px-3 py-1.5 rounded-xl text-xs font-black shadow ${
                    isVip ? 'bg-amber-500 text-white' : 'bg-blue-600 text-white'
                  }`}>
                    {pkg.category}
                  </span>
                  {pkg.targetGender && pkg.targetGender !== 'Tất cả' && (
                    <span className="bg-white/95 backdrop-blur text-gray-900 px-2.5 py-1.5 rounded-xl text-xs font-bold shadow">
                      {pkg.targetGender}
                    </span>
                  )}
                </div>

                {pkg.discount && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-xl text-xs font-black shadow">
                    GIẢM {pkg.discount}
                  </div>
                )}
              </div>
            </div>

            {/* Package Hero Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                  <Tag size={13} /> Mã gói: {pkg.code}
                </span>
                <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold">
                  Áp dụng BHYT & Bảo lãnh
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">
                {pkg.name}
              </h1>

              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4 flex-wrap">
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star size={16} fill="currentColor" /> 4.9
                  <span className="text-gray-400 font-normal">(1.200+ lượt đăng ký)</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5 text-gray-700 font-medium">
                  <Building2 size={16} className="text-blue-600" />
                  <span>{pkg.facility ? pkg.facility.name : 'MediCare Hà Nội & MediCare TP.HCM'}</span>
                </div>
              </div>

              {/* Price display */}
              <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-100 mb-6 flex flex-wrap items-baseline gap-3">
                <div className="text-xs text-gray-500 uppercase font-semibold block w-full mb-1">
                  Giá gói khám trọn gói:
                </div>
                <span className="text-3xl font-black text-blue-600">
                  {pkg.price.toLocaleString('vi-VN')}đ
                </span>
                {pkg.oldPrice && (
                  <span className="text-base text-gray-400 line-through">
                    {pkg.oldPrice.toLocaleString('vi-VN')}đ
                  </span>
                )}
                {pkg.discount && (
                  <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded">
                    Tiết kiệm {pkg.discount}
                  </span>
                )}
              </div>

              {/* Quick Details List */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="text-xs text-gray-400 mb-0.5">Đối tượng</div>
                  <div className="font-bold text-gray-800 text-xs sm:text-sm">{pkg.targetGender || 'Mọi đối tượng'}</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="text-xs text-gray-400 mb-0.5">Độ tuổi</div>
                  <div className="font-bold text-gray-800 text-xs sm:text-sm">{pkg.targetAge || 'Từ 18 tuổi'}</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 col-span-2 sm:col-span-1">
                  <div className="text-xs text-gray-400 mb-0.5">Thời gian khám</div>
                  <div className="font-bold text-blue-600 text-xs sm:text-sm">2 - 3 giờ</div>
                </div>
              </div>

              {/* CTA buttons */}
              <div className="flex gap-4 flex-wrap">
                <Link 
                  href={bookingLink}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center gap-2 text-sm"
                >
                  <Calendar size={18} /> Đăng ký đặt gói khám ngay
                </Link>
                <Link 
                  href="/landing/goi-kham"
                  className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3.5 px-6 rounded-xl transition-colors flex items-center gap-2 text-sm"
                >
                  <ArrowLeft size={16} /> Xem các gói khám khác
                </Link>
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* ==========================================
          5. MAIN CONTENT (2 COLUMNS)
      ========================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: COMPREHENSIVE DETAILS (2 COLS) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Overview Section */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4 pb-3 border-b border-gray-100 flex items-center gap-2">
                <HeartPulse className="text-blue-600" size={22} />
                Mục đích & Ý nghĩa gói khám
              </h2>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6">
                {pkg.description}
              </p>

              <h3 className="font-bold text-gray-900 text-base mb-3">Điểm nổi bật của gói khám:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {features.map((f: any, idx: number) => (
                  <div key={idx} className="flex items-start gap-2.5 text-sm text-gray-700 p-2.5 rounded-xl bg-blue-50/40 border border-blue-50">
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Clinical Items Table */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-100 flex items-center gap-2">
                <FileText className="text-blue-600" size={22} />
                Danh mục chi tiết các hạng mục thăm khám
              </h2>

              <div className="space-y-6">
                {details.map((sec: any, sIdx: number) => (
                  <div key={sIdx} className="border border-gray-200 rounded-xl overflow-hidden">
                    <div className="bg-blue-600 text-white px-5 py-3 font-bold text-sm sm:text-base flex items-center justify-between">
                      <span>{sec.category || `Phần ${sIdx + 1}`}</span>
                      <span className="text-xs font-normal text-blue-100">({sec.items?.length || 0} danh mục)</span>
                    </div>
                    <div className="divide-y divide-gray-100 bg-white">
                      {sec.items?.map((item: string, iIdx: number) => (
                        <div key={iIdx} className="p-3.5 sm:px-5 flex items-start gap-3 text-xs sm:text-sm text-gray-700 hover:bg-gray-50">
                          <Check size={16} className="text-blue-600 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Preparation Instructions */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-100 flex items-center gap-2">
                <Info className="text-blue-600" size={22} />
                Hướng dẫn chuẩn bị trước khi khám
              </h2>

              <div className="space-y-4 text-sm text-gray-600">
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-50/60 border border-amber-100 text-amber-900">
                  <AlertCircle size={20} className="text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-amber-900 mb-1">Nhịn ăn sáng:</h4>
                    <p className="text-xs sm:text-sm text-amber-800 leading-relaxed">
                      Quý khách vui lòng nhịn ăn sáng tối thiểu 6 - 8 tiếng trước khi lấy mẫu máu. Chỉ uống nước lọc, không uống sữa, nước ngọt, cà phê hoặc trà.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                    <h4 className="font-bold text-gray-900 text-sm mb-1">Thời gian vàng lấy mẫu</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Nên đến khám từ 07:30 - 09:30 sáng để các chỉ số sinh hóa máu đạt độ chính xác và chuẩn xác cao nhất.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                    <h4 className="font-bold text-gray-900 text-sm mb-1">Chuẩn bị siêu âm</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Uống nhiều nước lọc và nhịn tiểu trước khi siêu âm ổ bụng khoảng 30 phút để bàng quang căng nước tiểu dễ quan sát.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 4 Steps Workflow */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-100 flex items-center gap-2">
                <Clock className="text-blue-600" size={22} />
                Quy trình thực hiện gói khám tại MediCare
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {[
                  { step: '01', title: 'Đặt lịch hẹn', desc: 'Chọn ngày khám tiện lợi, nhận mã xác nhận SMS.' },
                  { step: '02', title: 'Tiếp đón & Lấy mẫu', desc: 'Lễ tân tiếp đón tại quầy ưu tiên, lấy máu xét nghiệm nhanh.' },
                  { step: '03', title: 'Khám chuyên khoa', desc: 'Khám lâm sàng, siêu âm, chụp X-quang, chẩn đoán hình ảnh.' },
                  { step: '04', title: 'Tư vấn kết quả', desc: 'Bác sĩ chuyên khoa kết luận và lưu trữ bệnh án số hóa.' },
                ].map((st, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex flex-col justify-between">
                    <div>
                      <span className="text-2xl font-black text-blue-600 block mb-2">{st.step}</span>
                      <h4 className="font-bold text-gray-900 text-sm mb-1">{st.title}</h4>
                      <p className="text-gray-500 text-xs leading-relaxed">{st.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT: STICKY BOOKING CARD */}
          <div className="space-y-6">
            
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <div className="text-center pb-6 border-b border-gray-100">
                <span className="text-xs text-gray-400 uppercase font-semibold">Chi phí trọn gói</span>
                <div className="text-3xl font-black text-blue-600 my-1">
                  {pkg.price.toLocaleString('vi-VN')}đ
                </div>
                {pkg.oldPrice && (
                  <div className="text-xs text-gray-400 line-through">
                    Giá gốc: {pkg.oldPrice.toLocaleString('vi-VN')}đ
                  </div>
                )}
                <span className="inline-block mt-2 text-xs text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full">
                  Bao gồm đầy đủ các xét nghiệm & cận lâm sàng
                </span>
              </div>

              <div className="py-5 space-y-3.5 text-sm text-gray-600 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Clock size={16} className="text-gray-400" /> Thời lượng:
                  </span>
                  <span className="font-semibold text-gray-900">2 - 3 giờ</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Calendar size={16} className="text-gray-400" /> Ngày phục vụ:
                  </span>
                  <span className="font-semibold text-gray-900">Thứ 2 - Thứ 7</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-gray-400" /> Trả kết quả:
                  </span>
                  <span className="font-semibold text-blue-600">Trong ngày & Online</span>
                </div>
              </div>

              <div className="pt-6 space-y-3">
                <Link 
                  href={bookingLink}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md shadow-blue-200 text-center block text-sm"
                >
                  Đăng ký khám ngay
                </Link>
                <div className="text-center text-xs text-gray-400">
                  Hỗ trợ trả góp 0% cho gói khám từ 3.000.000đ
                </div>
              </div>

              {/* Facility snippet */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <h4 className="font-bold text-gray-900 text-sm mb-3">Cơ sở phục vụ gói khám:</h4>
                <div className="space-y-3 text-xs text-gray-600">
                  <div className="flex items-start gap-2">
                    <MapPin size={16} className="text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-gray-800 block">MediCare Clinic Hà Nội:</strong>
                      144 Xuân Thủy, Cầu Giấy, Hà Nội
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin size={16} className="text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-gray-800 block">MediCare Clinic Sài Gòn:</strong>
                      Đường Tôn Đức Thắng, Quận 1, TP. Hồ Chí Minh
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                  <span>Hotline tư vấn gói khám:</span>
                  <span className="font-bold text-blue-600">0941.298.865</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* ==========================================
          6. FOOTER
      ========================================== */}
      <footer className="bg-[#0B1325] text-gray-300 pt-16 pb-8 text-sm mt-12">
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
                <li><Link href="/landing/benh-vien" className="hover:text-blue-500 transition">Bệnh viện</Link></li>
                <li><Link href="/landing/phong-kham" className="hover:text-blue-500 transition">Phòng khám</Link></li>
                <li><Link href="/landing/bac-si" className="hover:text-blue-500 transition">Bác sĩ chuyên khoa</Link></li>
                <li><Link href="/landing/goi-kham" className="hover:text-blue-500 transition">Gói khám sức khỏe</Link></li>
                <li><Link href="/landing/bai-viet" className="hover:text-blue-500 transition">Tin tức y tế</Link></li>
              </ul>
            </div>

            {/* Col 3: Support */}
            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Hỗ trợ</h4>
              <ul className="space-y-3">
                <li><Link href="/login" className="hover:text-blue-500 transition">Tài khoản của tôi</Link></li>
                <li><Link href="/login" className="hover:text-blue-500 transition">Lịch khám đã đặt</Link></li>
                <li><Link href="#" className="hover:text-blue-500 transition">Câu hỏi thường gặp (FAQ)</Link></li>
                <li><Link href="#" className="hover:text-blue-500 transition">Điều khoản sử dụng</Link></li>
                <li><Link href="#" className="hover:text-blue-500 transition">Chính sách bảo mật</Link></li>
              </ul>
            </div>

            {/* Col 4: Partner */}
            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Đối tác</h4>
              <p className="mb-4 text-gray-400">Tham gia hệ thống MediCare để tiếp cận hàng triệu bệnh nhân.</p>
              <button className="bg-transparent border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white font-bold py-2 px-4 rounded-lg transition-colors w-full mb-4">
                Đăng ký đối tác
              </button>
            </div>
            
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500">
            <p>© 2026 medicare.vn. Bảo lưu mọi quyền.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
