import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { 
  Phone, Mail, MapPin, Calendar,
  Activity, Users, Menu, HeartPulse
} from 'lucide-react';
import GoiKhamSearchSection from './GoiKhamSearchSection';

export default async function GoiKhamPage() {
  const bookingLink = '/login';

  // Lấy danh sách gói khám thật từ database
  const packages = await prisma.healthPackage.findMany({
    where: { status: 'Hoạt động' },
    include: { facility: true },
    orderBy: { price: 'asc' }
  });

  // Lấy các cơ sở bệnh viện
  const facilities = await prisma.facility.findMany({
    orderBy: { id: 'asc' }
  });

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
            
            {/* Mobile Menu Button */}
            <button className="lg:hidden text-gray-700 p-2">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* ==========================================
          3. BREADCRUMB & PAGE HEADER
      ========================================== */}
      <div className="bg-blue-50/50 border-b border-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex text-sm text-gray-500 mb-4">
            <Link href="/landing" className="hover:text-blue-600">Trang chủ</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">Gói khám sức khỏe</span>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <HeartPulse className="text-blue-600" size={32} /> Danh sách Gói Khám Sức Khỏe
          </h1>
          <p className="text-gray-600 mt-2">Đa dạng các gói khám tổng quát, tầm soát ung thư, tim mạch và tiền hôn nhân chuẩn quốc tế tại MediCare.</p>
        </div>
      </div>

      {/* ==========================================
          4. MAIN CONTENT (Filter + Search + List)
      ========================================== */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <GoiKhamSearchSection packages={packages} facilities={facilities} bookingLink={bookingLink} />
        </div>
      </section>

      {/* ==========================================
          5. FOOTER
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

      {/* FAB (Floating Action Buttons) */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
        <button className="w-14 h-14 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 hover:scale-110 transition-all">
          <Calendar size={24} />
        </button>
        <button className="w-14 h-14 bg-indigo-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-indigo-600 hover:scale-110 transition-all">
          <Phone size={24} />
        </button>
      </div>

    </div>
  );
}
