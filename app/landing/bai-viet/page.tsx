import React from 'react';
import Link from 'next/link';
import { 
  Phone, Mail, MapPin, Search, ChevronRight, Calendar,
  Activity, Users, Menu, Clock, TrendingUp, Tag
} from 'lucide-react';

export default function BaiVietPage() {
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
            <Link href="#" className="hover:text-blue-200 transition font-medium">Đối tác</Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-medium">Hệ thống đặt lịch khám toàn quốc</span>
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
              <Link href="/landing/goi-kham" className="hover:text-blue-600 transition">Gói khám</Link>
              <Link href="/landing/bai-viet" className="text-blue-600 transition border-b-2 border-blue-600 py-1">Tin sức khỏe</Link>
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
          3. BREADCRUMB & PAGE HEADER
      ========================================== */}
      <div className="bg-blue-50/50 border-b border-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex text-sm text-gray-500 mb-4">
            <Link href="/landing" className="hover:text-blue-600">Trang chủ</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">Tin sức khỏe & Cẩm nang y tế</span>
          </nav>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                Tin tức Y tế & Sức khỏe
              </h1>
              <p className="text-gray-600 mt-2">Cập nhật thông tin y khoa, kiến thức phòng bệnh và cẩm nang sống khỏe mỗi ngày.</p>
            </div>
            {/* Search Box inside header */}
            <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-200 flex items-center w-full md:w-80">
              <div className="flex-1 flex items-center px-3">
                <Search className="text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Tìm kiếm bài viết..." 
                  className="w-full bg-transparent border-none focus:ring-0 px-2 py-2 text-sm text-gray-700 outline-none"
                />
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors text-sm">
                Tìm
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ==========================================
          4. MAIN CONTENT
      ========================================== */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* 4.1 FEATURED POSTS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            {/* Main Featured Post */}
            <div className="lg:col-span-2 group cursor-pointer">
              <div className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                  alt="Featured Post" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider shadow-md">
                  Tin Nổi Bật
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6 sm:p-8 w-full text-white">
                  <div className="flex items-center gap-4 text-xs font-medium text-gray-300 mb-3">
                    <span className="flex items-center gap-1.5"><Calendar size={14}/> 10/10/2026</span>
                    <span className="flex items-center gap-1.5"><Activity size={14}/> BS. CKII Lê Hải</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold leading-tight group-hover:text-blue-300 transition-colors">
                    Những thói quen vàng giúp bảo vệ tim mạch trong mùa đông giá rét
                  </h2>
                </div>
              </div>
            </div>

            {/* Side Featured Posts */}
            <div className="flex flex-col gap-6">
              {[
                {
                  title: 'Dấu hiệu nhận biết sớm bệnh đột quỵ không thể bỏ qua',
                  date: '08/10/2026',
                  category: 'Bệnh học',
                  image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
                },
                {
                  title: 'Thực đơn dinh dưỡng 7 ngày chuẩn y khoa cho người tiểu đường',
                  date: '05/10/2026',
                  category: 'Dinh dưỡng',
                  image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
                },
                {
                  title: 'Tiêm phòng vaccine cúm mùa: Ai cần tiêm và khi nào?',
                  date: '02/10/2026',
                  category: 'Phòng bệnh',
                  image: 'https://images.unsplash.com/photo-1631815587646-b85a1bb02246?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
                }
              ].map((post, idx) => (
                <div key={idx} className="flex gap-4 group cursor-pointer">
                  <div className="w-32 h-24 rounded-xl overflow-hidden shrink-0 relative">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="flex flex-col justify-between py-1">
                    <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">{post.category}</div>
                    <h3 className="font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <div className="text-xs text-gray-500 flex items-center gap-1.5 mt-2">
                      <Clock size={12}/> {post.date}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-10">
            
            {/* 4.2 LATEST NEWS (Main Column) */}
            <div className="w-full lg:w-2/3 xl:w-3/4">
              <div className="flex items-center gap-3 border-b-2 border-gray-100 pb-4 mb-8">
                <div className="w-2 h-6 bg-blue-600 rounded-full"></div>
                <h2 className="text-2xl font-bold text-gray-900">Bài viết mới nhất</h2>
              </div>

              <div className="space-y-8">
                {[
                  {
                    title: 'Trầm cảm sau sinh: Hiểu đúng để vượt qua an toàn',
                    snippet: 'Trầm cảm sau sinh không chỉ là nỗi buồn thoảng qua mà là một căn bệnh thực sự cần được quan tâm, thấu hiểu và điều trị đúng cách...',
                    date: '10/10/2026',
                    author: 'Khoa Tâm Lý',
                    category: 'Mẹ & Bé',
                    image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
                  },
                  {
                    title: 'Giải mã hội chứng "Cổ tay ống cổ tay" ở dân văn phòng',
                    snippet: 'Làm việc liên tục với máy tính khiến nhiều nhân viên văn phòng gặp tình trạng tê buốt bàn tay. Đây là dấu hiệu điển hình của hội chứng ống cổ tay.',
                    date: '09/10/2026',
                    author: 'BS. Tuấn Minh',
                    category: 'Cơ xương khớp',
                    image: 'https://images.unsplash.com/photo-1590650153855-d9e808231d41?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
                  },
                  {
                    title: 'Cách phân biệt Sốt xuất huyết và Sốt virus thông thường',
                    snippet: 'Vào mùa mưa, dịch sốt xuất huyết bùng phát mạnh. Việc nhầm lẫn giữa sốt xuất huyết và sốt virus có thể dẫn đến những biến chứng nguy hiểm.',
                    date: '07/10/2026',
                    author: 'Bộ Y Tế',
                    category: 'Cẩm nang Y khoa',
                    image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
                  },
                  {
                    title: '5 Bài tập yoga đơn giản giúp cải thiện chất lượng giấc ngủ',
                    snippet: 'Chỉ với 15 phút tập luyện các tư thế yoga này trước khi ngủ, bạn sẽ dễ dàng chìm vào giấc ngủ sâu và thức dậy với tinh thần sảng khoái.',
                    date: '06/10/2026',
                    author: 'Nguyễn Hạnh',
                    category: 'Sống Khỏe',
                    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
                  },
                  {
                    title: 'Cảnh báo tình trạng suy thận đang trẻ hóa tại Việt Nam',
                    snippet: 'Lối sống thiếu khoa học, tiêu thụ nhiều thức ăn nhanh và thói quen nhịn tiểu đang làm gia tăng tỷ lệ mắc bệnh suy thận ở người trẻ tuổi.',
                    date: '04/10/2026',
                    author: 'BS. Ngọc Anh',
                    category: 'Bệnh học',
                    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
                  }
                ].map((post, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row gap-6 group cursor-pointer">
                    <div className="w-full sm:w-64 h-48 rounded-2xl overflow-hidden shrink-0 relative">
                      <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold text-blue-700 shadow-sm">
                        {post.category}
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight mb-3 group-hover:text-blue-600 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 line-clamp-2 mb-4 leading-relaxed">
                        {post.snippet}
                      </p>
                      <div className="flex items-center gap-4 text-sm font-medium text-gray-500 mt-auto">
                        <span className="flex items-center gap-1.5 text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                          <Users size={14}/> {post.author}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Calendar size={14}/> {post.date}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center mt-12 pt-8 border-t border-gray-100">
                <div className="flex gap-2">
                  <button className="w-10 h-10 rounded-lg flex items-center justify-center border border-gray-200 text-gray-500 hover:bg-gray-50">
                    <ChevronRight size={18} className="rotate-180" />
                  </button>
                  <button className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-600 text-white font-bold">1</button>
                  <button className="w-10 h-10 rounded-lg flex items-center justify-center border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium">2</button>
                  <button className="w-10 h-10 rounded-lg flex items-center justify-center border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium">3</button>
                  <span className="w-10 h-10 flex items-center justify-center text-gray-400">...</span>
                  <button className="w-10 h-10 rounded-lg flex items-center justify-center border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium">12</button>
                  <button className="w-10 h-10 rounded-lg flex items-center justify-center border border-gray-200 text-gray-500 hover:bg-gray-50">
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>

            </div>

            {/* 4.3 SIDEBAR (Right Column) */}
            <div className="w-full lg:w-1/3 xl:w-1/4">
              
              {/* Categories Widget */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <Menu className="text-blue-600" size={20}/> Danh mục
                </h3>
                <ul className="space-y-1">
                  {[
                    { name: 'Cẩm nang Y khoa', count: 125 },
                    { name: 'Sống khỏe mỗi ngày', count: 86 },
                    { name: 'Mẹ & Bé', count: 54 },
                    { name: 'Dinh dưỡng', count: 92 },
                    { name: 'Bệnh học', count: 210 },
                    { name: 'Thông tin Dịch bệnh', count: 32 }
                  ].map((cat, idx) => (
                    <li key={idx}>
                      <Link href="#" className="flex justify-between items-center py-2.5 text-gray-600 hover:text-blue-600 font-medium transition-colors border-b border-dashed border-gray-100 last:border-0 group">
                        <span className="flex items-center gap-2">
                          <ChevronRight size={14} className="text-gray-300 group-hover:text-blue-500 transition-colors" /> {cat.name}
                        </span>
                        <span className="bg-gray-50 text-gray-400 text-xs px-2 py-0.5 rounded-full group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                          {cat.count}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Popular Tags Widget */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <Tag className="text-blue-600" size={20}/> Từ khóa nổi bật
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['Tiểu đường', 'Huyết áp cao', 'Giảm cân', 'Đau dạ dày', 'Covid-19', 'Mất ngủ', 'Ung thư', 'Yoga', 'Detox'].map((tag, idx) => (
                    <Link key={idx} href="#" className="bg-gray-50 border border-gray-200 text-gray-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 px-3 py-1.5 rounded-lg text-sm font-medium transition-all">
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Banner/Ad Widget */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white text-center shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-4">
                    <Activity size={32} className="text-white"/>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Tải ứng dụng MediCare</h3>
                  <p className="text-blue-100 text-sm mb-6">Đặt lịch khám nhanh chóng, quản lý hồ sơ sức khỏe trọn đời.</p>
                  <button className="bg-white text-blue-700 font-bold py-3 px-6 rounded-xl hover:bg-gray-50 transition-colors w-full shadow-lg">
                    Tải ngay
                  </button>
                </div>
              </div>

            </div>
          </div>
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
                <li><Link href="/landing/benh-vien" className="hover:text-blue-500 transition">Bệnh viện</Link></li>
                <li><Link href="/landing/phong-kham" className="hover:text-blue-500 transition">Phòng khám</Link></li>
                <li><Link href="/landing/bac-si" className="hover:text-blue-500 transition">Bác sĩ chuyên khoa</Link></li>
                <li><Link href="/landing/goi-kham" className="hover:text-blue-500 transition">Gói khám sức khỏe</Link></li>
                <li><Link href="/landing/bai-viet" className="hover:text-blue-500 transition">Tin tức y tế</Link></li>
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
