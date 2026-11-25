import React from 'react';
import Link from 'next/link';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { 
  Phone, Mail, MapPin, Activity, Users, Menu, 
  CalendarDays, Clock
} from 'lucide-react';
import BookingClient from './BookingClient';
import LandingNavbar from '../components/LandingNavbar';
import type { BookingPatient } from '@/lib/booking-utils';

interface FacilityItem {
  id: number;
  name: string;
  address: string;
  clinics: Array<{
    id: number;
    name: string;
    facilityId: number;
    specialty?: { id: number; name: string } | null;
  }>;
}

interface SpecialtyItem {
  id: number;
  name: string;
}

interface DoctorItem {
  id: number;
  userId: number;
  user: {
    id: number;
    fullName: string;
    avatar: string | null;
    phone: string | null;
    address: string | null;
  };
  degree: string | null;
  experience: string | null;
  price: number | null;
  bio: string | null;
  specialty?: { id: number; name: string } | null;
  department?: { id: number; name: string } | null;
  clinics?: Array<{
    id: number;
    name: string;
    facilityId: number;
    facility?: { id: number; name: string } | null;
  }>;
}

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Đặt Lịch Khám Trực Tuyến - Hệ Thống Bệnh Viện MediCare',
  description: 'Đặt lịch khám bệnh trực tuyến nhanh chóng với đội ngũ bác sĩ chuyên khoa đầu ngành tại Hà Nội và TP. Hồ Chí Minh.'
};

export default async function DatLichPage() {
  const bookingLink = '/login';

  const cookieStore = await cookies();
  const userIdStr = cookieStore.get('user_id')?.value;
  let currentUser: { id: number; fullName: string; phone: string | null; dob: string | null; gender: string | null } | null = null;
  let bookingPatients: BookingPatient[] = [];

  if (userIdStr) {
    const userId = parseInt(userIdStr, 10);
    if (!isNaN(userId)) {
      try {
        const user = await prisma.user.findUnique({
          where: { id: userId, status: 'Hoạt động' },
          select: {
            id: true,
            fullName: true,
            phone: true,
            dob: true,
            gender: true,
            role: true,
            managedFamilyMembers: {
              where: { patient: { role: 'PATIENT', status: 'Hoạt động' } },
              select: { patient: { select: { id: true, fullName: true, phone: true, dob: true, gender: true } } },
            },
          }
        });
        if (user) {
          currentUser = { id: user.id, fullName: user.fullName, phone: user.phone, dob: user.dob, gender: user.gender };
          bookingPatients = [
            ...(user.role === 'PATIENT' ? [currentUser] : []),
            ...user.managedFamilyMembers.map(member => member.patient),
          ];
        }
      } catch (err) {
        console.error('Error fetching current user:', err);
      }
    }
  }

  const isLoggedIn = !!currentUser;

  // Lấy dữ liệu thật từ cơ sở dữ liệu
  let facilities: FacilityItem[] = [];
  let specialties: SpecialtyItem[] = [];
  let doctors: DoctorItem[] = [];

  try {
    const rawFacilities = await prisma.facility.findMany({
      where: { status: 'Hoạt động' },
      include: {
        clinics: {
          include: {
            specialty: true
          }
        }
      },
      orderBy: { id: 'asc' }
    });

    const rawSpecialties = await prisma.specialty.findMany({
      orderBy: { name: 'asc' }
    });

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
      orderBy: { id: 'asc' }
    });

    facilities = rawFacilities;
    specialties = rawSpecialties;
    doctors = rawDoctors;
  } catch (error) {
    console.error('Lỗi lấy dữ liệu đặt lịch khám:', error);
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-800 font-sans relative">
      
      {/* NAVBAR DÙNG CHUNG ĐỒNG BỘ ĐĂNG NHẬP / ĐĂNG KÝ */}
      <LandingNavbar initialUser={currentUser} isLoggedIn={isLoggedIn} />

      {/* ==========================================
          3. BREADCRUMB & PAGE HEADER
      ========================================== */}
      <div className="bg-gradient-to-b from-blue-50/70 to-[#f8fafc] border-b border-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex text-sm text-gray-500 mb-4">
            <Link href="/landing" className="hover:text-blue-600">Trang chủ</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">Đặt lịch khám bệnh</span>
          </nav>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                <CalendarDays size={14} /> Hệ thống đặt hẹn khám trực tuyến
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 flex items-center gap-3">
                Đặt Lịch Khám Bệnh Trực Tuyến
              </h1>
              <p className="text-gray-600 mt-2 max-w-2xl leading-relaxed text-sm sm:text-base">
                Chủ động chọn cơ sở bệnh viện tại Hà Nội & TP.HCM, chọn bác sĩ chuyên khoa và khung giờ khám thuận tiện. Không cần xếp hàng chờ đợi lấy số.
              </p>
            </div>

            <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 shrink-0">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Clock size={24} />
              </div>
              <div>
                <div className="text-xs text-gray-400 font-medium">Khung giờ tiếp nhận</div>
                <div className="font-extrabold text-gray-900 text-sm">07:30 - 17:30 Hàng ngày</div>
                <div className="text-xs text-emerald-600 font-semibold">Tiếp nhận cả Thứ 7 & CN</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==========================================
          4. MAIN BOOKING SECTION
      ========================================== */}
      <main className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BookingClient
            facilities={facilities}
            specialties={specialties}
            doctors={doctors}
            bookingLink={bookingLink}
            isLoggedIn={isLoggedIn}
            currentUser={currentUser}
            patients={bookingPatients}
          />
        </div>
      </main>

      {/* ==========================================
          5. FOOTER
      ========================================== */}
      <footer className="bg-[#0B1325] text-gray-300 pt-16 pb-8 text-sm mt-16">
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
                <li><Link href="/landing/dat-lich" className="text-blue-400 font-semibold transition">Đặt lịch khám</Link></li>
                <li><Link href="/landing/bai-viet" className="hover:text-blue-500 transition">Tin tức y tế</Link></li>
              </ul>
            </div>

            {/* Col 3: Account & Support */}
            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Hỗ trợ</h4>
              <ul className="space-y-3">
                <li><Link href="/login" className="hover:text-blue-500 transition">Tài khoản của tôi</Link></li>
                <li><Link href="/patient/appointments" className="hover:text-blue-500 transition">Lịch khám đã đặt</Link></li>
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
               <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer text-white">f</div>
               <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer text-white">yt</div>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}

