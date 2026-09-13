import React from 'react';
import Link from 'next/link';
import { 
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  Activity,
  PlayCircle,
  ArrowRight,
  BookOpen,
  Video,
  FileText,
  Download,
  GraduationCap,
  Users,
  CheckCircle2,
  HelpCircle,
  Clock,
  BookMarked
} from 'lucide-react';

export default function TrainingPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans relative">
      
      {/* ==========================================
          1. HEADER
      ========================================== */}
      <div className="bg-[#172554] text-gray-300 text-sm py-2 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2"><Phone size={14} /> 0989.199.535</span>
            <span className="flex items-center gap-2"><Mail size={14} /> hotro@webnhathuoc.com</span>
            <span className="flex items-center gap-2"><MapPin size={14} /> 133 Yên Duyên, Hoàng Mai, Hà Nội</span>
          </div>
          <div className="flex items-center gap-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="cursor-pointer hover:text-white transition">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
            </svg>
            <MessageSquare size={18} className="cursor-pointer hover:text-white transition" /> 
            <Link href="/login" className="bg-[#ef4444] text-white px-4 py-1.5 rounded-md font-medium hover:bg-[#dc2626] transition ml-2 text-sm">
              Đăng nhập
            </Link>
            <Link href="/register" className="bg-[#10b981] text-white px-4 py-1.5 rounded-md font-medium hover:bg-[#059669] transition text-sm">
              Đăng ký
            </Link>
          </div>
        </div>
      </div>

      <nav className="bg-[#0b53c1] text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center gap-2 cursor-pointer">
              <div className="flex flex-col">
                <span className="font-bold text-2xl tracking-tight leading-none mb-1">
                  <span className="text-white">WEB </span> 
                  <span className="text-orange-400">NHÀ </span> 
                  <span className="text-green-400">THUỐC</span>
                </span>
                <span className="text-[11px] text-gray-200 font-medium tracking-wide">
                  Phần mềm chuyên biệt cho nhà thuốc
                </span>
              </div>
            </Link>

              <div className="hidden md:flex space-x-8 font-medium text-sm items-center">
              <Link href="/index/dashboard" className="text-white hover:text-yellow-400 transition">Trang chủ</Link>
              <Link href="/index/community" className="text-white hover:text-yellow-400 transition">Cộng đồng</Link>
              <Link href="/index/customers" className="text-white hover:text-yellow-400 transition">Khách hàng</Link>
              <Link href="/index/products" className="text-white hover:text-yellow-400 transition">Sản phẩm</Link>
              <Link href="/index/features" className="text-white hover:text-yellow-400 transition ">Tính năng </Link>
              <Link href="/index/training" className="text-yellow-400 font-bold transition">Đào tạo</Link>
              <Link href="/index/documentation" className="text-white hover:text-yellow-400 transition">Tài liệu</Link>
              <Link href="/index/about" className="text-white hover:text-yellow-400 transition">Giới thiệu</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ==========================================
          2. BANNER ĐÀO TẠO
      ========================================== */}
      <section className="relative bg-[#0b53c1] pt-20 pb-36 text-center overflow-hidden">
        <div className="absolute top-10 left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-6 text-yellow-400 backdrop-blur-md">
            <GraduationCap size={36} />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 drop-shadow-md uppercase tracking-wide">
            Trung Tâm Đào Tạo
          </h1>
          <p className="text-blue-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            Học cách sử dụng hệ thống quản lý phòng khám một cách nhanh chóng và hiệu quả. Nâng cao nghiệp vụ cho toàn bộ nhân sự.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="#courses" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3.5 rounded-full font-bold transition shadow-lg w-full sm:w-auto">
              Bắt đầu học ngay
            </Link>
            <Link href="#videos" className="bg-white/10 hover:bg-white/20 border border-white/30 text-white px-8 py-3.5 rounded-full font-bold transition w-full sm:w-auto flex items-center justify-center gap-2">
              <PlayCircle size={20} /> Xem video hướng dẫn
            </Link>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
          <svg className="relative block w-full h-[60px] md:h-[100px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C89.71,117.84,204.62,78.23,321.39,56.44Z" fill="#f9fafb"></path>
          </svg>
        </div>
      </section>

      {/* ==========================================
          3. LỘ TRÌNH HỌC (Learning Path)
      ========================================== */}
      <section className="py-16 bg-gray-50 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-[#1e3a8a] mb-4">Lộ trình học tập chuẩn</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Được thiết kế bài bản giúp cơ sở y tế triển khai phần mềm thành công chỉ trong 3 ngày.</p>
        </div>

        <div className="relative">
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-blue-200 -translate-y-1/2 z-0"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {[
              { step: 'Ngày 1', title: 'Thiết lập & Khởi tạo', desc: 'Cài đặt danh mục dùng chung, phân quyền tài khoản và cấu hình hệ thống.' },
              { step: 'Ngày 2', title: 'Nghiệp vụ cốt lõi', desc: 'Đào tạo Lễ tân tiếp đón, Bác sĩ khám bệnh và Dược sĩ bán thuốc.' },
              { step: 'Ngày 3', title: 'Quản trị & Tối ưu', desc: 'Hướng dẫn xem báo cáo doanh thu, thống kê tồn kho và thiết lập nâng cao.' }
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition text-center relative mt-8 md:mt-0">
                <div className="w-20 h-20 bg-[#0b53c1] text-white rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-6 border-4 border-white shadow-lg absolute -top-10 left-1/2 -translate-x-1/2">
                  {item.step}
                </div>
                <h3 className="font-bold text-xl text-gray-900 mb-3 mt-6">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          4. CÁC KHÓA HỌC (Courses)
      ========================================== */}
      <section id="courses" className="py-20 bg-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-[#1e3a8a] mb-4">Các khóa học theo nghiệp vụ</h2>
            <p className="text-gray-600">Lựa chọn khóa học phù hợp với vai trò của bạn tại phòng khám.</p>
          </div>
          <Link href="#" className="text-[#0b53c1] font-semibold hover:underline flex items-center gap-1 mt-4 md:mt-0">
            Xem tất cả <ArrowRight size={18}/>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { role: 'Dành cho Lễ tân', title: 'Nghiệp vụ Tiếp đón & Thu ngân', lessons: 12, time: '2h 30m', img: 'bg-blue-100' },
            { role: 'Dành cho Bác sĩ', title: 'Sử dụng Bệnh án điện tử (EMR)', lessons: 8, time: '1h 45m', img: 'bg-green-100' },
            { role: 'Dành cho Quản lý', title: 'Quản trị hệ thống & Báo cáo', lessons: 15, time: '3h 20m', img: 'bg-orange-100' }
          ].map((course, idx) => (
            <div key={idx} className="border border-gray-100 rounded-3xl overflow-hidden hover:shadow-xl transition-all group">
              <div className={`h-48 ${course.img} flex items-center justify-center relative overflow-hidden`}>
                <BookOpen size={60} className="text-white opacity-50 group-hover:scale-110 transition duration-500" />
                <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 rounded-full text-xs font-bold text-gray-700">
                  {course.role}
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-xl text-gray-900 mb-4 group-hover:text-[#0b53c1] transition">{course.title}</h3>
                <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
                  <span className="flex items-center gap-1.5"><BookMarked size={16} className="text-orange-500"/> {course.lessons} Bài học</span>
                  <span className="flex items-center gap-1.5"><Clock size={16} className="text-[#0b53c1]"/> {course.time}</span>
                </div>
                <button className="w-full bg-gray-50 hover:bg-[#0b53c1] hover:text-white text-[#0b53c1] font-semibold py-3 rounded-xl transition border border-gray-100 hover:border-[#0b53c1]">
                  Vào học ngay
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==========================================
          5. VIDEO HƯỚNG DẪN (Video Tutorials)
      ========================================== */}
      <section id="videos" className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3">
              <Video className="text-orange-500" /> Thư viện Video Hướng dẫn
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Học trực quan qua các video thao tác thực tế trên phần mềm.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              'Hướng dẫn tạo hồ sơ bệnh nhân mới',
              'Cách kê đơn thuốc và cảnh báo tương tác',
              'Đọc kết quả xét nghiệm LIS tự động',
              'Thiết lập chương trình thẻ thành viên'
            ].map((title, idx) => (
              <div key={idx} className="group cursor-pointer">
                <div className="relative aspect-video bg-gray-800 rounded-2xl overflow-hidden mb-4 border border-gray-700">
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition">
                    <PlayCircle size={48} className="text-white opacity-80 group-hover:scale-110 group-hover:opacity-100 transition" />
                  </div>
                </div>
                <h4 className="font-semibold text-gray-200 group-hover:text-yellow-400 transition leading-snug">{title}</h4>
                <p className="text-xs text-gray-500 mt-2">5 phút • Lượt xem: 1.2k</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
             <button className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-xl font-medium transition">
               Xem thêm trên YouTube
             </button>
          </div>
        </div>
      </section>

      {/* ==========================================
          6. TÀI LIỆU THỰC HÀNH
      ========================================== */}
      <section className="py-20 bg-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-[#1e3a8a] mb-6">Tài liệu & Biểu mẫu thực hành</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Cung cấp bộ tài liệu PDF hướng dẫn sử dụng chi tiết từng phân hệ và các biểu mẫu y tế chuẩn (hồ sơ bệnh án, phiếu chỉ định, mẫu hóa đơn...) để phòng khám dễ dàng áp dụng.
            </p>
            <div className="space-y-4">
              {[
                { name: 'Sổ tay hướng dẫn sử dụng Webphongkham v2.0', size: '2.4 MB' },
                { name: 'Bộ 50+ biểu mẫu Y tế & Báo cáo chuẩn', size: '5.1 MB' },
                { name: 'Tài liệu API tích hợp cho đối tác', size: '1.8 MB' }
              ].map((doc, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-xl hover:border-blue-300 transition group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="bg-red-100 text-red-500 p-2 rounded-lg"><FileText size={24}/></div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-sm">{doc.name}</h4>
                      <p className="text-xs text-gray-500">PDF • {doc.size}</p>
                    </div>
                  </div>
                  <Download className="text-gray-400 group-hover:text-[#0b53c1] transition" size={20}/>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center">
            <div className="w-full max-w-md aspect-square bg-[#0b53c1]/5 rounded-[3rem] p-8 relative">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-50"></div>
              <div className="relative z-10 w-full h-full bg-white rounded-2xl shadow-xl border border-gray-100 flex items-center justify-center p-6 text-center flex-col">
                <FileText size={80} className="text-orange-400 mb-6"/>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Thư viện Tài liệu</h3>
                <p className="text-gray-500 text-sm">Cập nhật liên tục các phiên bản mới nhất từ bộ phận phát triển sản phẩm.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          7. GIẢNG VIÊN HỖ TRỢ
      ========================================== */}
      <section className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1e3a8a] mb-4">Đội ngũ chuyên viên đào tạo</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Các chuyên gia giàu kinh nghiệm triển khai phần mềm y tế sẽ trực tiếp hướng dẫn phòng khám của bạn.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { name: 'Nguyễn Tiến Đạt', role: 'Chuyên gia Triển khai EMR', exp: '5 năm kinh nghiệm' },
              { name: 'Lê Minh Hương', role: 'Chuyên viên Đào tạo LIS', exp: '4 năm kinh nghiệm' },
              { name: 'Trần Văn Dũng', role: 'Kỹ sư Tích hợp Hệ thống', exp: '7 năm kinh nghiệm' },
              { name: 'Phạm Thu Trà', role: 'Hỗ trợ khách hàng VIP', exp: '3 năm kinh nghiệm' }
            ].map((instructor, idx) => (
              <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-100 text-center hover:shadow-lg transition group">
                <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center text-[#0b53c1] text-2xl font-bold border-4 border-white shadow-sm group-hover:scale-110 transition">
                  {instructor.name.charAt(0)}
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">{instructor.name}</h3>
                <p className="text-[#0b53c1] text-sm font-medium mb-2">{instructor.role}</p>
                <p className="text-xs text-gray-500">{instructor.exp}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          8. CÂU HỎI THƯỜNG GẶP (FAQ)
      ========================================== */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1e3a8a] mb-4">Câu hỏi thường gặp về Đào tạo</h2>
          </div>
          <div className="space-y-4">
            {[
              { q: 'Khóa đào tạo có mất phí không?', a: 'Với khách hàng đăng ký mua phần mềm, chúng tôi miễn phí hoàn toàn chi phí đào tạo sử dụng cho toàn bộ nhân viên phòng khám trong 3 ngày đầu triển khai.' },
              { q: 'Hình thức đào tạo như thế nào?', a: 'Chúng tôi hỗ trợ linh hoạt 2 hình thức: Đào tạo Online qua Zoom/Google Meet hoặc Cử chuyên viên xuống đào tạo trực tiếp (Offline) tại phòng khám của bạn.' },
              { q: 'Nhân viên mới vào làm có được đào tạo lại không?', a: 'Bạn hoàn toàn có thể cho nhân viên mới xem lại thư viện Video và Tài liệu hướng dẫn. Hoặc liên hệ bộ phận CSKH để đặt lịch đào tạo bổ sung (có thể tính phí nhẹ).' },
            ].map((faq, idx) => (
              <div key={idx} className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <h4 className="font-bold text-gray-900 text-lg mb-2 flex items-start gap-3">
                  <HelpCircle className="text-orange-500 shrink-0 mt-1" size={20} />
                  {faq.q}
                </h4>
                <p className="text-gray-600 pl-8">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          9. ĐĂNG KÝ ĐÀO TẠO (CTA)
      ========================================== */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl p-10 md:p-16 text-center text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
            <Users size={32} className="text-white"/>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 relative z-10">Cần hướng dẫn 1-kèm-1 trực tiếp?</h2>
          <p className="text-orange-100 mb-8 text-lg max-w-2xl mx-auto relative z-10">
            Đặt lịch ngay với chuyên viên của chúng tôi để được giải đáp chuyên sâu và hướng dẫn thao tác trực tiếp trên hệ thống phòng khám của bạn.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
            <button className="bg-white text-orange-600 hover:bg-gray-50 px-8 py-4 rounded-xl font-bold transition shadow-lg flex items-center justify-center gap-2">
              Đăng ký lịch đào tạo <ArrowRight size={20}/>
            </button>
          </div>
        </div>
      </section>

      {/* ==========================================
          10. FOOTER (Giữ nguyên)
      ========================================== */}
      <footer className="relative bg-[#0b53c1] text-white pt-20 pb-6 overflow-hidden">
        <div className="absolute top-10 right-20 w-32 h-32 rounded-full border-[10px] border-white/5"></div>
        <div className="absolute bottom-20 left-40 w-16 h-16 rounded-full bg-white/5"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            
            <div>
              <div className="mb-4">
                <span className="font-bold text-3xl tracking-tight leading-none">
                  <span className="text-white">WEB </span> 
                  <span className="text-orange-400">NHÀ </span> 
                  <span className="text-green-400">THUỐC</span>
                </span>
                <p className="text-[13px] text-gray-200 mt-1">phần mềm chuyên biệt cho nhà thuốc</p>
              </div>
              <div className="space-y-4 text-sm text-gray-100 mt-8">
                <p>CÔNG TY TNHH WEB NHÀ THUỐC.</p>
                <p className="leading-relaxed">Giấy phép kinh doanh số 0107583890 do Sở KHĐT Tp. Hà Nội cấp ngày 04/10/2016</p>
                <div className="inline-flex items-center gap-2 bg-[#0ea5e9] px-3 py-1.5 rounded-lg border border-white/20 mt-2">
                  <div className="bg-white rounded-full p-1"><Activity className="text-[#0ea5e9] w-6 h-6"/></div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold leading-none">ĐÃ THÔNG BÁO</span>
                    <span className="text-[10px] font-medium leading-none mt-1">BỘ CÔNG THƯƠNG</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6 border-l-[3px] border-orange-400 pl-3">Liên kết nhanh</h3>
              <ul className="space-y-4 text-sm">
                <li className="border-b border-blue-400/30 pb-3"><Link href="#" className="hover:text-yellow-400 transition">Chính sách quy định chung</Link></li>
                <li className="border-b border-blue-400/30 pb-3"><Link href="#" className="hover:text-yellow-400 transition">Chính sách bảo mật thông tin</Link></li>
                <li className="border-b border-blue-400/30 pb-3"><Link href="#" className="hover:text-yellow-400 transition">Giới thiệu về công ty</Link></li>
                <li className="border-b border-blue-400/30 pb-3"><Link href="#" className="hover:text-yellow-400 transition">Câu hỏi thường gặp</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6 border-l-[3px] border-orange-400 pl-3">Liên hệ</h3>
              <p className="text-sm mb-6 text-gray-100">Giải đáp mọi thắc mắc của khách hàng</p>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <MapPin className="text-orange-400 w-5 h-5 shrink-0 mt-0.5" />
                  <span>Số nhà 133, phố Yên Duyên, phường Hoàng Mai, Hà Nội</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="text-orange-400 w-5 h-5 shrink-0" />
                  <span>hotro@webnhathuoc.com</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="text-orange-400 w-5 h-5 shrink-0" />
                  <span>Tổng đài: 0346.588.983</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="text-orange-400 w-5 h-5 shrink-0" />
                  <span>Hotline: 0989.199.535</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="text-orange-400 w-5 h-5 shrink-0" />
                  <span>Số KD1: 0867.462.965</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="text-orange-400 w-5 h-5 shrink-0" />
                  <span>Số KD2: 0342.918.680</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6 border-l-[3px] border-orange-400 pl-3">Tiện ích và Download</h3>
              <p className="text-sm mb-6 text-gray-100">Sử dụng ngay phiên bản điện thoại của Webnhathuoc</p>
              <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row flex-wrap gap-3">
                <button className="bg-black border border-gray-700 hover:bg-gray-900 rounded-lg px-3 py-2 flex items-center gap-2 transition w-max">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M3 20.5v-17c0-.83.67-1.5 1.5-1.5.38 0 .74.15 1.01.42l11.16 11.16c.38.38.38 1.01 0 1.39L5.51 21.08c-.27.27-.63.42-1.01.42-.83 0-1.5-.67-1.5-1.5zm14.62-10.15l-2.6-2.6 3.82-2.2c.6-.35 1.36-.14 1.71.46.12.2.18.42.18.65v.64c0 .32-.17.61-.45.78l-2.66 2.27zM18.8 15.6l-3.82-2.2 2.6-2.6 2.66 2.27c.28.17.45.46.45.78v.64c0 .23-.06.45-.18.65-.35.6-1.11.81-1.71.46z"/></svg>
                  <div className="flex flex-col items-start leading-tight">
                    <span className="text-[9px] uppercase">GET IT ON</span>
                    <span className="text-sm font-semibold">Google Play</span>
                  </div>
                </button>
                <button className="bg-black border border-gray-700 hover:bg-gray-900 rounded-lg px-3 py-2 flex items-center gap-2 transition w-max">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M16.36 14.08c-.02-2.63 2.14-3.9 2.24-3.95-1.22-1.78-3.13-2.02-3.81-2.05-1.63-.16-3.18 1-4.02 1-.85 0-2.12-.98-3.48-.96-1.76.02-3.39 1.02-4.29 2.59-1.84 3.19-.47 7.9 1.32 10.49.88 1.27 1.91 2.7 3.25 2.65 1.29-.05 1.78-.83 3.34-.83 1.54 0 2.01.83 3.36.8 1.39-.02 2.28-1.3 3.13-2.55.99-1.44 1.4-2.84 1.42-2.91-.03-.02-2.66-1.02-2.46-4.28zM14.96 5.51c.71-.86 1.19-2.06 1.06-3.26-1.03.04-2.27.69-3 1.55-.58.71-1.12 1.95-.97 3.12 1.15.09 2.2-.6 2.91-1.41z"/></svg>
                  <div className="flex flex-col items-start leading-tight">
                    <span className="text-[9px] uppercase">Download on the</span>
                    <span className="text-sm font-semibold">App Store</span>
                  </div>
                </button>
                <button className="bg-black border border-gray-700 hover:bg-gray-900 rounded-lg px-3 py-2 flex items-center gap-2 transition w-max">
                  <div className="bg-[#cf0a2c] text-white p-1 rounded-sm"><Activity size={16} /></div>
                  <div className="flex flex-col items-start leading-tight">
                    <span className="text-[9px] uppercase">EXPLORE IT ON</span>
                    <span className="text-sm font-semibold">AppGallery</span>
                  </div>
                </button>
              </div>
            </div>

          </div>
        </div>

        <div className="mt-16 border-t border-blue-400/30 pt-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex gap-3">
              <Link href="#" className="w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-400 flex items-center justify-center transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-400 flex items-center justify-center transition">
                <span className="font-bold text-sm">Zalo</span>
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-400 flex items-center justify-center transition">
                <span className="font-bold font-serif text-lg leading-none">G+</span>
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-400 flex items-center justify-center transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </Link>
            </div>
            <p className="text-sm text-gray-200">
              Copyright © 2015 Webnhathuoc.com
            </p>
          </div>
        </div>
      </footer>

      {/* Nút Chat Xanh cố định ở góc dưới */}
      <button className="fixed bottom-0 right-10 bg-[#0ea5e9] hover:bg-[#0284c7] text-white px-6 py-3 rounded-t-lg font-medium shadow-xl transition flex items-center gap-2 z-50">
        <MessageSquare size={18} />
        Nhắn tin cho Webnhathuoc
      </button>

    </div>
  );
}
