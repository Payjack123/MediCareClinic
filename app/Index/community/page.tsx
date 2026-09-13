import React from 'react';
import Link from 'next/link';
import { 
  Heart, 
  Brain, 
  Smile, 
  Baby, 
  MessageCircle, 
  Activity,
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  User,
  CalendarDays,
  Search,
  Flame,
  ThumbsUp,
  Clock,
  Bot,
  Award,
  ChevronRight
} from 'lucide-react';

export default function HomePage() {
  // Mock Data cho bài viết cộng đồng
  const articles = [
    { id: 1, title: 'Làm sao để kiểm soát huyết áp ở người cao tuổi?', author: 'BS. Nguyễn Văn A', time: '2 giờ trước', likes: 124, comments: 32, category: 'Tim mạch' },
    { id: 2, title: 'Dấu hiệu nhận biết trẻ bị tay chân miệng và cách xử lý', author: 'Thành viên_892', time: '5 giờ trước', likes: 89, comments: 15, category: 'Nhi khoa' },
    { id: 3, title: 'Bí quyết chăm sóc răng miệng sau khi nhổ răng khôn', author: 'Nha khoa Hạnh Phúc', time: '1 ngày trước', likes: 210, comments: 45, category: 'Răng hàm mặt' },
    { id: 4, title: 'Cách giảm stress và mệt mỏi hiệu quả cho dân văn phòng', author: 'Admin', time: '2 ngày trước', likes: 156, comments: 28, category: 'Thần kinh' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans relative">
      
      {/* ==========================================
          1. HEADER (Giữ nguyên)
      ========================================== */}
      
      {/* TOP BAR */}
      <div className="bg-[#172554] text-gray-300 text-sm py-2 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2"><Phone size={14} /> 0989.199.535</span>
            <span className="flex items-center gap-2"><Mail size={14} /> hotro@webnhathuoc.com</span>
            <span className="flex items-center gap-2"><MapPin size={14} /> 133 Yên Duyên, Hoàng Mai, Hà Nội</span>
          </div>
          <div className="flex items-center gap-4">
            {/* Facebook Icon SVG */}
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

      {/* NAVBAR */}
     <nav className="bg-[#0b53c1] text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/patient/dashboard" className="flex items-center gap-2 cursor-pointer">
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
              <Link href="/index/community" className="text-yellow-400 font-bold transition">Cộng đồng</Link>
              <Link href="/index/customers" className="text-white hover:text-yellow-400 transition">Khách hàng</Link>
              <Link href="/index/products" className="text-white hover:text-yellow-400 transition">Sản phẩm</Link>
              <Link href="/index/features" className="text-white hover:text-yellow-400 transition ">Tính năng</Link>
              <Link href="/index/training" className="text-white hover:text-yellow-400 transition">Đào tạo</Link>
              <Link href="/index/documentation" className="text-white hover:text-yellow-400 transition">Tài liệu</Link>
              <Link href="/index/about" className="text-white hover:text-yellow-400 transition">Giới thiệu</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ==========================================
          2. BANNER CỘNG ĐỒNG
      ========================================== */}
      <section className="bg-[#0b53c1] pt-16 pb-20 px-4 text-center relative overflow-hidden">
        {/* Background bubbles */}
        <div className="absolute top-10 left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">Cộng đồng chăm sóc sức khỏe</h1>
          <p className="text-blue-100 mb-8 text-lg">Nơi giao lưu, chia sẻ và giải đáp mọi thắc mắc về y tế từ các chuyên gia</p>
          
          {/* Thanh tìm kiếm */}
          <div className="relative w-full max-w-2xl mx-auto">
            <input 
              type="text" 
              placeholder="Tìm kiếm bài viết, triệu chứng, bác sĩ..." 
              className="w-full pl-12 pr-4 py-4 rounded-full shadow-lg text-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-400/50 text-lg"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full font-medium transition">
              Tìm kiếm
            </button>
          </div>
        </div>

        {/* Lượn sóng */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
          <svg className="relative block w-full h-[60px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C89.71,117.84,204.62,78.23,321.39,56.44Z" fill="#f9fafb"></path>
          </svg>
        </div>
      </section>

      {/* ==========================================
          3. DANH MỤC
      ========================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 mb-10">
        <div className="bg-white rounded-2xl shadow-md p-4 flex gap-3 overflow-x-auto scrollbar-hide items-center justify-start md:justify-center border border-gray-100">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-50 text-blue-700 font-semibold rounded-xl whitespace-nowrap hover:bg-blue-100 transition">
            <Flame size={18} className="text-orange-500"/> Tất cả
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 text-gray-600 font-medium rounded-xl whitespace-nowrap hover:bg-gray-100 transition">
            <Heart size={18} className="text-red-500"/> Tim mạch
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 text-gray-600 font-medium rounded-xl whitespace-nowrap hover:bg-gray-100 transition">
            <Smile size={18} className="text-yellow-500"/> Răng hàm mặt
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 text-gray-600 font-medium rounded-xl whitespace-nowrap hover:bg-gray-100 transition">
            <Baby size={18} className="text-pink-500"/> Nhi khoa
          </button>
        
          <button className="flex items-center gap-2 px-5 py-2.5 text-gray-600 font-medium rounded-xl whitespace-nowrap hover:bg-gray-100 transition">
            <Brain size={18} className="text-purple-500"/> Thần kinh
          </button>
        </div>
      </section>

      {/* ==========================================
          4. MAIN CONTENT & SIDEBAR
      ========================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* ---- CỘT TRÁI (Nội dung chính) ---- */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Bài viết nổi bật */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Flame className="text-orange-500" size={24} />
                <h2 className="text-2xl font-bold text-gray-900">Bài viết nổi bật</h2>
              </div>
              
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 group cursor-pointer hover:shadow-md transition">
                <div className="h-64 bg-gray-200 relative overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Featured" 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                    Đáng chú ý
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#0b53c1] transition">Đột phá mới trong việc ứng dụng AI vào tầm soát ung thư sớm</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">Trí tuệ nhân tạo đang chứng minh vai trò to lớn trong việc hỗ trợ các bác sĩ phân tích hình ảnh y khoa, từ đó phát hiện các dấu hiệu ung thư ngay từ giai đoạn đầu, tăng cơ hội chữa khỏi lên đến 90%...</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1"><User size={16}/> BS. Trần Trọng B</span>
                      <span className="flex items-center gap-1"><Clock size={16}/> 10 giờ trước</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1 hover:text-[#0b53c1]"><ThumbsUp size={16}/> 452</span>
                      <span className="flex items-center gap-1 hover:text-[#0b53c1]"><MessageCircle size={16}/> 89</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Danh sách bài viết */}
            <div>
              <div className="flex items-center justify-between mb-4 mt-10">
                <h2 className="text-2xl font-bold text-gray-900">Mới nhất</h2>
                <Link href="#" className="text-[#0b53c1] text-sm font-medium hover:underline flex items-center">Xem tất cả <ChevronRight size={16}/></Link>
              </div>

              <div className="space-y-4">
                {articles.map((item) => (
                  <div key={item.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 hover:border-blue-300 hover:shadow-md transition cursor-pointer flex flex-col sm:flex-row gap-5">
                    <div className="w-full sm:w-40 h-32 bg-gray-100 rounded-xl flex-shrink-0">
                      <div className="w-full h-full rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center text-blue-300">
                        <Activity size={32} />
                      </div>
                    </div>

                    <div className="flex flex-col justify-between flex-1">
                      <div>
                        <div className="flex items-center gap-2 mb-2 text-xs">
                          <span className="bg-blue-50 text-[#0b53c1] px-2.5 py-1 rounded-md font-medium border border-blue-100">{item.category}</span>
                          <span className="text-gray-400 flex items-center gap-1"><Clock size={12}/> {item.time}</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2 hover:text-[#0b53c1] transition leading-snug">{item.title}</h3>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm mt-3 pt-3 border-t border-gray-100">
                        <span className="text-gray-600 font-medium flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs"><User size={12}/></div>
                          {item.author}
                        </span>
                        <div className="flex items-center gap-4 text-gray-400">
                          <span className="flex items-center gap-1 hover:text-[#0b53c1]"><ThumbsUp size={16}/> {item.likes}</span>
                          <span className="flex items-center gap-1 hover:text-[#0b53c1]"><MessageCircle size={16}/> {item.comments}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-center mt-8">
                <button className="border-2 border-gray-300 text-gray-600 font-medium px-8 py-2.5 rounded-xl hover:border-[#0b53c1] hover:text-[#0b53c1] transition">
                  Xem thêm bài viết
                </button>
              </div>
            </div>

          </div>

          {/* ---- CỘT PHẢI (Sidebar) ---- */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Hỏi AI */}
            <div className="bg-gradient-to-br from-[#0b53c1] to-[#1e3a8a] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
              <div className="absolute -right-4 -top-4 opacity-20"><Bot size={100} /></div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <Bot size={28} className="text-yellow-400" />
                  <h3 className="text-xl font-bold">Hỏi AI Y Tế</h3>
                </div>
                <p className="text-blue-100 text-sm mb-5 leading-relaxed">
                  Nhận tư vấn sơ bộ về triệu chứng của bạn từ Trợ lý AI thông minh ngay lập tức.
                </p>
                <Link href="#" className="block text-center bg-white text-[#0b53c1] font-bold py-2.5 rounded-xl hover:bg-gray-50 transition w-full shadow-sm">
                  Trò chuyện ngay
                </Link>
              </div>
            </div>

            {/* Chủ đề hot */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4 border-b border-gray-100 pb-3">
                <Flame className="text-orange-500" size={20}/> Chủ đề Hot
              </h3>
              <ul className="space-y-3">
                {['Mùa dịch sốt xuất huyết', 'Dinh dưỡng cho bé', 'Mất ngủ kéo dài', 'Skincare trị mụn cơ bản', 'Bệnh tiểu đường'].map((topic, i) => (
                  <li key={i}>
                    <Link href="#" className="text-gray-700 hover:text-[#0b53c1] text-sm font-medium flex items-center before:content-['#'] before:text-blue-300 before:mr-2 before:font-bold">
                      {topic}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bác sĩ trực tuyến */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4 border-b border-gray-100 pb-3">
                <span className="relative flex h-3 w-3 mr-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                Bác sĩ trực tuyến
              </h3>
              <div className="space-y-4">
                {[
                  { name: 'BS. Lê Thị Lan', spec: 'Nhi khoa' },
                  { name: 'BS. Hoàng Minh', spec: 'Da liễu' },
                  { name: 'BS. Phạm Tuấn', spec: 'Đa khoa' }
                ].map((doctor, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-[#0b53c1] font-bold border-2 border-white shadow-sm relative">
                        {doctor.name.charAt(4)}
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 leading-tight">{doctor.name}</p>
                        <p className="text-xs text-gray-500">{doctor.spec}</p>
                      </div>
                    </div>
                    <button className="text-xs font-medium text-[#0b53c1] bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition border border-blue-100">
                      Hỏi
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Thành viên tích cực */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4 border-b border-gray-100 pb-3">
                <Award className="text-yellow-500" size={20}/> BXH Thành viên
              </h3>
              <div className="space-y-4">
                {[
                  { name: 'MebeKem_99', points: '12.4k đ', rank: 1 },
                  { name: 'HoangLong9x', points: '8.2k đ', rank: 2 },
                  { name: 'MaiAnh_Tran', points: '5.1k đ', rank: 3 }
                ].map((member, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold ${
                        i === 0 ? 'bg-yellow-100 text-yellow-700' : 
                        i === 1 ? 'bg-gray-100 text-gray-600' : 
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {member.rank}
                      </div>
                      <span className="text-sm font-medium text-gray-700">{member.name}</span>
                    </div>
                    <span className="text-xs font-bold text-[#0b53c1] bg-blue-50 px-2 py-1 rounded border border-blue-100">{member.points}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ==========================================
          5. FOOTER (Giữ nguyên)
      ========================================== */}
      <footer className="relative bg-[#0b53c1] text-white pt-20 pb-6 overflow-hidden">
        {/* Abstract shapes in background */}
        <div className="absolute top-10 right-20 w-32 h-32 rounded-full border-[10px] border-white/5"></div>
        <div className="absolute bottom-20 left-40 w-16 h-16 rounded-full bg-white/5"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            
            {/* Cột 1: Thông tin công ty */}
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
                {/* Badge Bộ công thương */}
                <div className="inline-flex items-center gap-2 bg-[#0ea5e9] px-3 py-1.5 rounded-lg border border-white/20 mt-2">
                  <div className="bg-white rounded-full p-1"><Activity className="text-[#0ea5e9] w-6 h-6"/></div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold leading-none">ĐÃ THÔNG BÁO</span>
                    <span className="text-[10px] font-medium leading-none mt-1">BỘ CÔNG THƯƠNG</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cột 2: Liên kết nhanh */}
            <div>
              <h3 className="text-lg font-semibold mb-6 border-l-[3px] border-orange-400 pl-3">Liên kết nhanh</h3>
              <ul className="space-y-4 text-sm">
                <li className="border-b border-blue-400/30 pb-3"><Link href="#" className="hover:text-yellow-400 transition">Chính sách quy định chung</Link></li>
                <li className="border-b border-blue-400/30 pb-3"><Link href="#" className="hover:text-yellow-400 transition">Chính sách bảo mật thông tin</Link></li>
                <li className="border-b border-blue-400/30 pb-3"><Link href="#" className="hover:text-yellow-400 transition">Giới thiệu về công ty</Link></li>
                <li className="border-b border-blue-400/30 pb-3"><Link href="#" className="hover:text-yellow-400 transition">Câu hỏi thường gặp</Link></li>
              </ul>
            </div>

            {/* Cột 3: Liên hệ */}
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

            {/* Cột 4: Tiện ích và Download */}
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

        {/* Thanh bản quyền & Social phía dưới */}
        <div className="mt-16 border-t border-blue-400/30 pt-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
            
            {/* Social Icons */}
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
