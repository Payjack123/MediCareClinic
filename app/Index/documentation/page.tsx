import React from 'react';
import Link from 'next/link';
import { 
  Heart, 
  Brain, 
  Smile, 
  Baby, 
  Star, // <-- Đã thêm Star vào đây
  MessageCircle, 
  Activity,
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  User,
  CalendarDays,
  Search,
  BookOpen,
  FileText,
  Video,
  Code2,
  DownloadCloud,
  HelpCircle,
  FolderTree,
  ArrowRight,
  PlayCircle,
  ChevronRight,
  FileDown,
  Terminal,
  Clock
} from 'lucide-react';

export default function DocumentationPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans relative">
      
      {/* ==========================================
          1. HEADER (Giữ nguyên)
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
            {/* Logo */}
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

            {/* Menu Desktop */}
           <div className="hidden md:flex space-x-8 font-medium text-sm items-center">
              <Link href="/index/dashboard" className="text-white hover:text-yellow-400 transition">Trang chủ</Link>
              <Link href="/index/community" className="text-white hover:text-yellow-400 transition">Cộng đồng</Link>
              <Link href="/index/customers" className="text-white hover:text-yellow-400 transition">Khách hàng</Link>
              <Link href="/index/products" className="text-white hover:text-yellow-400 transition">Sản phẩm</Link>
              <Link href="/index/features" className="text-white hover:text-yellow-400 transition ">Tính năng </Link>
              <Link href="/index/training" className="text-white hover:text-yellow-400 transition">Đào tạo</Link>
              <Link href="/index/documentation" className="text-yellow-400 font-bold transition">Tài liệu</Link>
              <Link href="/index/about" className="text-white hover:text-yellow-400 transition">Giới thiệu</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ==========================================
          2. HERO BANNER: TÀI LIỆU & TÌM KIẾM
      ========================================== */}
      <section className="relative bg-[#0b53c1] pt-20 pb-36 text-center overflow-hidden">
        <div className="absolute top-10 left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-6 text-yellow-400 backdrop-blur-md">
            <BookOpen size={36} />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 drop-shadow-md uppercase tracking-wide">
            Trung Tâm Tài Liệu
          </h1>
          <p className="text-blue-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            Tất cả hướng dẫn sử dụng và tài liệu kỹ thuật dành cho phòng khám và nhà thuốc được cập nhật liên tục.
          </p>
          
          {/* Thanh tìm kiếm tài liệu */}
          <div className="relative w-full max-w-2xl mx-auto mb-8">
            <input 
              type="text" 
              placeholder="Tìm kiếm tài liệu, lỗi thường gặp, API..." 
              className="w-full pl-14 pr-4 py-4 rounded-full shadow-2xl text-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-400/50 text-lg border-none"
            />
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#0ea5e9] hover:bg-[#0284c7] text-white px-6 py-2.5 rounded-full font-medium transition">
              Tìm kiếm
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="#categories" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3.5 rounded-full font-bold transition shadow-lg w-full sm:w-auto">
              Xem tài liệu
            </Link>
            <Link href="#download" className="bg-white/10 hover:bg-white/20 border border-white/30 text-white px-8 py-3.5 rounded-full font-bold transition w-full sm:w-auto flex items-center justify-center gap-2">
              <FileDown size={20} /> Tải PDF Hướng dẫn
            </Link>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
          <svg className="relative block w-full h-[60px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C89.71,117.84,204.62,78.23,321.39,56.44Z" fill="#f9fafb"></path>
          </svg>
        </div>
      </section>

      {/* ==========================================
          3. DANH MỤC TÀI LIỆU
      ========================================== */}
      <section id="categories" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { title: 'Bắt đầu nhanh', icon: <PlayCircle size={28}/>, desc: 'Cài đặt & thiết lập ban đầu', color: 'text-orange-500', bg: 'bg-orange-100' },
            { title: 'Hướng dẫn sử dụng', icon: <BookOpen size={28}/>, desc: 'Chi tiết từng phân hệ', color: 'text-blue-600', bg: 'bg-blue-100' },
            { title: 'Lỗi thường gặp (FAQ)', icon: <HelpCircle size={28}/>, desc: 'Cách xử lý các lỗi cơ bản', color: 'text-red-500', bg: 'bg-red-100' },
            { title: 'Cập nhật tính năng', icon: <Activity size={28}/>, desc: 'Release notes mới nhất', color: 'text-green-600', bg: 'bg-green-100' }
          ].map((cat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:-translate-y-1 transition-transform cursor-pointer">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${cat.bg} ${cat.color}`}>
                {cat.icon}
              </div>
              <h3 className="font-bold text-gray-900 mb-1">{cat.title}</h3>
              <p className="text-gray-500 text-sm">{cat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ==========================================
          4. TÀI LIỆU NỔI BẬT & MỚI NHẤT
      ========================================== */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-12">
          
          {/* Cột Trái: Tài liệu nổi bật */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-8 border-b border-gray-200 pb-4">
              <Star className="text-yellow-400" size={24} fill="currentColor" />
              <h2 className="text-2xl font-bold text-[#1e3a8a]">Tài liệu Nổi bật</h2>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { title: 'Sổ tay Webphongkham toàn tập', role: 'Dành cho Quản lý', time: '15 phút đọc' },
                { title: 'Hướng dẫn Liên thông Dược Quốc gia', role: 'Dành cho Dược sĩ', time: '10 phút đọc' },
                { title: 'Sử dụng bệnh án điện tử (EMR)', role: 'Dành cho Bác sĩ', time: '12 phút đọc' },
                { title: 'Thiết lập máy in và hóa đơn', role: 'Dành cho Kỹ thuật', time: '8 phút đọc' }
              ].map((doc, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-blue-400 hover:shadow-md transition cursor-pointer group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition">
                      <FileText size={24} />
                    </div>
                    <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md">{doc.role}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 leading-snug group-hover:text-blue-600 transition">{doc.title}</h3>
                  <div className="flex items-center justify-between mt-4 text-sm text-gray-500 border-t border-gray-100 pt-4">
                    <span className="flex items-center gap-1.5"><Clock size={14}/> {doc.time}</span>
                    <span className="flex items-center gap-1 text-blue-600 font-medium">Đọc ngay <ChevronRight size={14}/></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cột Phải: Tài liệu mới nhất */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-8 border-b border-gray-200 pb-4">
              <FolderTree className="text-orange-500" size={24} />
              <h2 className="text-2xl font-bold text-[#1e3a8a]">Vừa cập nhật</h2>
            </div>
            
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <ul className="space-y-5">
                {[
                  { title: 'Cập nhật tính năng Hóa đơn điện tử v2.4', date: '15/07/2026' },
                  { title: 'Khắc phục lỗi không kết nối được máy quét mã vạch', date: '12/07/2026' },
                  { title: 'Hướng dẫn sử dụng App Bệnh nhân cho người mới', date: '08/07/2026' },
                  { title: 'Bản vá bảo mật (Patch) tháng 7/2026', date: '01/07/2026' },
                  { title: 'Thay đổi luồng tiếp đón BHYT theo chuẩn mới', date: '25/06/2026' }
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-3 group cursor-pointer">
                    <div className="mt-1"><FileText size={16} className="text-gray-400 group-hover:text-blue-600 transition"/></div>
                    <div>
                      <h4 className="font-medium text-gray-800 text-sm mb-1 group-hover:text-blue-600 transition leading-snug">{item.title}</h4>
                      <p className="text-xs text-gray-400">{item.date}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <button className="w-full mt-6 py-2.5 bg-gray-50 text-blue-600 font-semibold rounded-xl text-sm hover:bg-blue-50 transition border border-gray-100 hover:border-blue-200">
                Xem tất cả bài viết
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ==========================================
          5. VIDEO HƯỚNG DẪN
      ========================================== */}
      <section className="py-16 bg-gray-50 mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-[#1e3a8a] mb-2 flex items-center gap-2">
                <Video className="text-orange-500" /> Video hướng dẫn
              </h2>
              <p className="text-gray-600">Hướng dẫn thao tác trực quan từng bước trên hệ thống.</p>
            </div>
            <Link href="#" className="text-blue-600 font-semibold hover:underline flex items-center gap-1 mt-4 md:mt-0">
              Xem toàn bộ Video <ArrowRight size={18}/>
            </Link>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              'Quy trình tiếp đón bệnh nhân chuẩn',
              'Hướng dẫn cấu hình kết nối máy LIS',
              'Kê đơn thuốc điện tử nhanh chóng',
              'Cách xem báo cáo doanh thu cuối ngày'
            ].map((title, idx) => (
              <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group cursor-pointer hover:shadow-md transition">
                <div className="relative aspect-video bg-gray-800">
                  <img src={`https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=500&q=80&auto=format&fit=crop`} alt="Video Thumbnail" className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition"/>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <PlayCircle size={48} className="text-white opacity-80 group-hover:scale-110 group-hover:opacity-100 transition shadow-lg rounded-full bg-black/20" />
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition leading-snug mb-2">{title}</h4>
                  <p className="text-xs text-gray-500">Phân hệ: Sử dụng chung</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          6. API & TÍCH HỢP (Dành cho Developer)
      ========================================== */}
      <section className="py-20 bg-[#0f172a] text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-800 text-green-400 rounded-xl mb-6 border border-gray-700">
                <Code2 size={24} />
              </div>
              <h2 className="text-3xl font-bold text-white mb-6 leading-tight">
                Tài liệu API & Tích hợp Hệ thống
              </h2>
              <p className="mb-6 leading-relaxed">
                Dành cho lập trình viên và đối tác muốn kết nối dữ liệu hai chiều với Webnhathuoc / Webphongkham thông qua RESTful API an toàn.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3"><Terminal className="text-green-400 shrink-0 mt-1" size={18}/> Webhook cập nhật trạng thái đơn hàng/khám bệnh realtime.</li>
                <li className="flex items-start gap-3"><Terminal className="text-green-400 shrink-0 mt-1" size={18}/> API tra cứu kho dược, đồng bộ danh mục thuốc.</li>
                <li className="flex items-start gap-3"><Terminal className="text-green-400 shrink-0 mt-1" size={18}/> Tài liệu Swagger UI dễ dàng test endpoint.</li>
              </ul>
              <div className="flex gap-4">
                <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl transition text-sm">
                  Truy cập Developer Portal
                </button>
                <button className="bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600 font-bold py-3 px-6 rounded-xl transition text-sm">
                  Xem API Keys
                </button>
              </div>
            </div>
            
            {/* Box code giả lập */}
            <div className="bg-[#1e293b] rounded-2xl p-6 border border-gray-700 shadow-2xl overflow-hidden relative">
              <div className="flex items-center gap-2 mb-4 border-b border-gray-700 pb-4">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-xs text-gray-500 font-mono ml-2">POST /api/v1/patients</span>
              </div>
              <pre className="text-sm font-mono text-green-400 overflow-x-auto">
{`curl -X POST "https://api.webnhathuoc.com/v1/patients" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Nguyen Van A",
    "phone": "0989199535",
    "dob": "1990-01-01",
    "gender": "male"
  }'`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          7. DOWNLOAD TÀI LIỆU
      ========================================== */}
      <section id="download" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-[#1e3a8a] mb-4">Tải xuống Tài liệu & Biểu mẫu</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-12">Lưu trữ bộ tài liệu offline để có thể xem lại hướng dẫn bất cứ lúc nào.</p>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto text-left">
            {[
              { name: 'Sổ tay sử dụng Webphongkham', size: 'PDF • 5.2 MB' },
              { name: 'Sổ tay sử dụng Webnhathuoc', size: 'PDF • 3.8 MB' },
              { name: 'Hướng dẫn cài đặt Máy in & Barcode', size: 'PDF • 1.2 MB' },
              { name: 'Quy trình xử lý sự cố mạng nội bộ', size: 'PDF • 2.1 MB' },
              { name: 'Biểu mẫu Bệnh án y khoa chuẩn Y Tế', size: 'Word/Excel • 8.5 MB' },
              { name: 'Phiếu yêu cầu tích hợp API', size: 'PDF • 0.5 MB' },
            ].map((doc, idx) => (
              <div key={idx} className="flex items-center justify-between p-5 bg-gray-50 border border-gray-200 rounded-2xl hover:border-blue-400 hover:shadow-md transition group cursor-pointer">
                <div>
                  <h4 className="font-bold text-gray-800 text-sm mb-1 group-hover:text-blue-600 transition">{doc.name}</h4>
                  <p className="text-xs text-gray-500">{doc.size}</p>
                </div>
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gray-200 text-gray-400 group-hover:text-blue-600 group-hover:border-blue-200 transition shrink-0">
                  <DownloadCloud size={18}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          8. FAQ TÀI LIỆU
      ========================================== */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1e3a8a] mb-4">Câu hỏi thường gặp</h2>
          </div>
          <div className="space-y-4">
            {[
              { q: 'Làm sao để tôi lấy tài khoản API Key?', a: 'Vui lòng đăng nhập vào tài khoản Admin (Quản lý), truy cập mục Cài đặt Hệ thống > Tích hợp API > Nhấn "Tạo API Key mới".' },
              { q: 'Phần mềm có tài liệu hướng dẫn bằng Tiếng Anh không?', a: 'Hiện tại hệ thống tài liệu chính thức hỗ trợ Tiếng Việt. Phiên bản Tiếng Anh đang trong quá trình biên dịch và sẽ sớm ra mắt.' },
              { q: 'Tôi tải tài liệu PDF về bị lỗi font chữ?', a: 'Vui lòng đảm bảo máy tính của bạn đã cài đặt phần mềm đọc PDF chuyên dụng như Adobe Acrobat Reader hoặc mở trực tiếp trên trình duyệt Chrome/Edge mới nhất.' },
            ].map((faq, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
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
          9. CTA
      ========================================== */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-blue-600 to-[#0b53c1] rounded-3xl p-10 md:p-16 text-center text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4 relative z-10">Không tìm thấy tài liệu bạn cần?</h2>
          <p className="text-blue-100 mb-8 text-lg max-w-2xl mx-auto relative z-10">
            Đội ngũ hỗ trợ kỹ thuật của chúng tôi luôn trực 24/7. Hãy tạo Ticket hỗ trợ hoặc gọi ngay cho tổng đài.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-bold transition shadow-lg flex items-center justify-center gap-2">
              Gửi yêu cầu hỗ trợ (Ticket)
            </button>
            <button className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-8 py-4 rounded-xl font-bold transition flex items-center justify-center gap-2">
              <Phone size={20}/> Gọi 0346.588.983
            </button>
          </div>
        </div>
      </section>

      {/* ==========================================
          10. FOOTER (Giữ nguyên)
      ========================================== */}
      <footer className="relative bg-[#0b53c1] text-white pt-20 pb-6 overflow-hidden mt-10">
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
