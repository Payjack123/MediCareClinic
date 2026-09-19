import React from 'react';
import Link from 'next/link';
import { 
  Heart, 
  Brain, 
  Smile, 
  Baby, 
  Star, 
  MessageCircle, 
  Activity,
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  User,
  CalendarDays,
  PlayCircle,
  ArrowRight,
  Target,
  Eye,
  Diamond,
  Milestone,
  Users,
  Cpu,
  Award,
  Handshake,
  Send,
  Building2,
  Code2,
  Database,
  Bot,
  CheckCircle2
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans relative">
      
      {/* ==========================================
          1. TOP BAR
      ========================================== */}
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

      {/* ==========================================
          2. NAVBAR
      ========================================== */}
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
              <Link href="/index/dashboard" className="text-yellow-400 font-bold transition">Trang chủ</Link>
              <Link href="/index/community" className="text-white hover:text-yellow-400 transition">Cộng đồng</Link>
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
          3. HERO BANNER
      ========================================== */}
      <section className="relative bg-[#0b53c1] pt-24 pb-40 text-center overflow-hidden">
        <div className="absolute top-10 left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <span className="inline-block py-1.5 px-4 rounded-full bg-blue-500/30 text-blue-100 border border-blue-400/30 text-sm font-semibold mb-6 uppercase tracking-wider backdrop-blur-sm">
            Nền tảng Quản lý Y tế Toàn diện
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-8 drop-shadow-md">
            Chuyển đổi số phòng khám & <br className="hidden md:block"/> nhà thuốc của bạn ngay hôm nay
          </h1>
          <p className="text-blue-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            Hệ sinh thái phần mềm ưu việt giúp tối ưu quy trình vận hành, nâng cao doanh thu và trải nghiệm khám chữa bệnh.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full font-bold transition shadow-lg w-full sm:w-auto text-lg">
              Bắt đầu dùng thử miễn phí
            </Link>
            <Link href="#demo" className="bg-white text-[#0b53c1] hover:bg-gray-50 px-8 py-4 rounded-full font-bold transition w-full sm:w-auto flex items-center justify-center gap-2 text-lg shadow-lg">
              <PlayCircle size={24} /> Xem Demo
            </Link>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
          <svg className="relative block w-full h-[80px] md:h-[120px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C89.71,117.84,204.62,78.23,321.39,56.44Z" fill="#ffffff"></path>
          </svg>
        </div>
      </section>

      {/* ==========================================
          4. VỀ CHÚNG TÔI
      ========================================== */}
      <section className="py-20 bg-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 text-[#0b53c1] font-semibold text-sm mb-6">
              <Activity size={16} /> Về Webnhathuoc
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              Đơn vị tiên phong cung cấp giải pháp Y tế số tại Việt Nam
            </h2>
            <p className="text-gray-600 mb-6 text-lg leading-relaxed">
              Chúng tôi hiểu rằng việc quản lý cơ sở y tế đòi hỏi sự chính xác tuyệt đối và quy trình chặt chẽ. Webnhathuoc được sinh ra để giải quyết triệt để các bài toán khó khăn nhất trong khâu vận hành.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="text-green-500 mt-1 shrink-0" />
                <span className="text-gray-700">Giao diện thân thiện, dễ sử dụng cho mọi lứa tuổi.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="text-green-500 mt-1 shrink-0" />
                <span className="text-gray-700">Tích hợp AI hỗ trợ chuẩn đoán & ra quyết định.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="text-green-500 mt-1 shrink-0" />
                <span className="text-gray-700">Liên thông chuẩn dữ liệu với Cổng thông tin Quốc gia.</span>
              </li>
            </ul>
            <Link href="/patient/about" className="inline-flex items-center gap-2 text-[#0b53c1] font-bold hover:gap-3 transition-all">
              Tìm hiểu thêm về chúng tôi <ArrowRight size={18} />
            </Link>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-orange-400 rounded-3xl transform rotate-3 scale-105 opacity-20 -z-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1576091160550-2173ff9e5eb2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
              alt="Medical Team" 
              className="rounded-3xl shadow-2xl w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ==========================================
          5. SỨ MỆNH - TẦM NHÌN - GIÁ TRỊ CỐT LÕI
      ========================================== */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 text-center">
              <div className="w-20 h-20 bg-blue-50 text-[#0b53c1] rounded-full flex items-center justify-center mx-auto mb-6">
                <Target size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Sứ mệnh</h3>
              <p className="text-gray-600 leading-relaxed">
                Giải phóng sức lao động y tế, giảm thiểu sai sót và nâng cao chất lượng phục vụ cộng đồng thông qua công nghệ.
              </p>
            </div>
            
            <div className="bg-gradient-to-b from-[#0b53c1] to-[#1e3a8a] p-10 rounded-3xl shadow-xl text-white transform md:-translate-y-6 text-center">
              <div className="w-20 h-20 bg-white/20 text-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <Eye size={40} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Tầm nhìn</h3>
              <p className="text-blue-100 leading-relaxed">
                Trở thành nền tảng quản lý y tế số 1 Đông Nam Á, nơi mọi cơ sở y tế được vận hành tự động và thông minh.
              </p>
            </div>

            <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 text-center">
              <div className="w-20 h-20 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Diamond size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Giá trị cốt lõi</h3>
              <p className="text-gray-600 leading-relaxed">
                Tận tâm phục vụ • Đổi mới sáng tạo • Bảo mật tuyệt đối • Hợp tác cùng phát triển bền vững.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          6. HÀNH TRÌNH PHÁT TRIỂN
      ========================================== */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#1e3a8a] mb-4 flex items-center justify-center gap-2">
              <Milestone className="text-orange-500" /> Hành trình phát triển
            </h2>
            <p className="text-gray-600">Những cột mốc quan trọng đánh dấu sự trưởng thành của hệ thống.</p>
          </div>

          <div className="relative border-l-4 border-blue-100 ml-3 md:ml-1/2 md:translate-x-[-2px] space-y-12">
            {[
              { year: '2015', title: 'Khởi nguồn', desc: 'Ra mắt phiên bản đầu tiên hỗ trợ quản lý nhà thuốc.' },
              { year: '2018', title: 'Hệ sinh thái', desc: 'Mở rộng giải pháp toàn diện cho phòng khám đa khoa.' },
              { year: '2021', title: 'Đột phá', desc: 'Đạt mốc 1000+ Khách hàng, ứng dụng điện toán đám mây.' },
              { year: 'Nay', title: 'Tiên phong AI', desc: 'Tích hợp Trợ lý AI và hệ thống tự động hóa thông minh.' }
            ].map((milestone, idx) => (
              <div key={idx} className="relative pl-8 md:pl-0">
                <div className="absolute w-6 h-6 bg-white border-4 border-[#0b53c1] rounded-full -left-[15px] md:left-1/2 md:-translate-x-1/2 mt-1.5 shadow-md z-10"></div>
                
                <div className={`md:w-1/2 ${idx % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12 md:ml-auto md:text-left'}`}>
                  <div className="bg-gray-50 p-6 rounded-2xl shadow-sm border border-gray-100 inline-block w-full">
                    <span className="text-orange-500 font-black text-xl mb-1 block">{milestone.year}</span>
                    <h4 className="font-bold text-gray-900 text-lg mb-2">{milestone.title}</h4>
                    <p className="text-gray-600 text-sm">{milestone.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          7. ĐỘI NGŨ PHÁT TRIỂN
      ========================================== */}
      <section className="py-20 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-[#1e3a8a] mb-12 flex items-center justify-center gap-2">
            <Users className="text-orange-500" /> Đội ngũ dẫn dắt
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { name: 'Phạm Đức Mạnh', role: 'Lead Developer / Founder' },
              { name: 'Trần Thị B', role: 'Giám đốc Sản phẩm' },
              { name: 'Lê Hoàng C', role: 'Trưởng phòng Kinh doanh' },
              { name: 'Nguyễn Văn D', role: 'Giám đốc Kỹ thuật' }
            ].map((member, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-6 text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                <div className="w-24 h-24 bg-[#0b53c1] rounded-full mx-auto mb-5 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                  {member.name.charAt(0)}
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">{member.name}</h3>
                <p className="text-orange-500 text-sm font-medium">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          8. CÔNG NGHỆ SỬ DỤNG
      ========================================== */}
      <section className="py-20 bg-gradient-to-r from-[#172554] to-[#0b53c1] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
              <Cpu className="text-yellow-400" /> Nền tảng công nghệ
            </h2>
            <p className="text-blue-200 max-w-2xl mx-auto">Hệ thống áp dụng công nghệ hiện đại đảm bảo tính ổn định, tốc độ và bảo mật cấp ngân hàng.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: <Code2 size={40}/>, title: 'Next.js & React', color: 'text-blue-300' },
              { icon: <Activity size={40}/>, title: 'ASP.NET Core', color: 'text-purple-300' },
              { icon: <Database size={40}/>, title: 'MySQL & Redis', color: 'text-orange-300' },
              { icon: <Bot size={40}/>, title: 'AI Assistant', color: 'text-green-300' }
            ].map((tech, idx) => (
              <div key={idx} className="bg-white/10 p-8 rounded-3xl backdrop-blur-sm border border-white/20 hover:bg-white/20 transition cursor-pointer">
                <div className={`flex justify-center mb-4 ${tech.color}`}>{tech.icon}</div>
                <h4 className="font-bold text-lg text-white">{tech.title}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          9. THÀNH TỰU (Stats)
      ========================================== */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="w-16 h-16 bg-blue-50 text-[#0b53c1] rounded-2xl flex items-center justify-center mx-auto mb-4"><Award size={32}/></div>
              <h3 className="text-4xl font-black text-gray-900 mb-2">10+</h3>
              <p className="text-gray-500 font-medium uppercase tracking-wider text-sm">Năm kinh nghiệm</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4"><Building2 size={32}/></div>
              <h3 className="text-4xl font-black text-gray-900 mb-2">2,500+</h3>
              <p className="text-gray-500 font-medium uppercase tracking-wider text-sm">Cơ sở y tế</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4"><Users size={32}/></div>
              <h3 className="text-4xl font-black text-gray-900 mb-2">5M+</h3>
              <p className="text-gray-500 font-medium uppercase tracking-wider text-sm">Hồ sơ bệnh nhân</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-purple-50 text-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4"><Smile size={32}/></div>
              <h3 className="text-4xl font-black text-gray-900 mb-2">99%</h3>
              <p className="text-gray-500 font-medium uppercase tracking-wider text-sm">Khách hài lòng</p>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          10. KHÁCH HÀNG NÓI GÌ (Testimonials)
      ========================================== */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#1e3a8a] mb-4">Khách hàng nói gì về chúng tôi?</h2>
            <div className="w-20 h-1 bg-orange-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                text: "Hệ thống cực kỳ trực quan, giúp phòng khám tôi giảm thiểu tối đa sai sót trong khâu thu ngân và cấp phát thuốc.",
                author: "BS. Trần Thanh Bình",
                role: "Phòng khám Đa khoa Bình Minh"
              },
              {
                text: "Tôi đặc biệt ấn tượng với tính năng đặt lịch và thẻ thành viên. Lượng bệnh nhân quay lại tái khám tăng 30%.",
                author: "Dược sĩ Lê Mai",
                role: "Chuỗi nhà thuốc Tâm An"
              },
              {
                text: "Đội ngũ CSKH hỗ trợ rất nhiệt tình. Từ khi dùng phần mềm, việc báo cáo kết quả kinh doanh cuối ngày chỉ mất 5 phút.",
                author: "ThS. BS Nguyễn Hoàng",
                role: "Phòng khám Nhi Sài Gòn"
              }
            ].map((review, idx) => (
              <div key={idx} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg transition">
                <div className="flex gap-1 text-yellow-400 mb-4">
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                </div>
                <p className="text-gray-600 italic mb-6">{`"${review.text}"`}</p>
                <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-[#0b53c1] font-bold">
                    {review.author.charAt(4)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{review.author}</h4>
                    <p className="text-xs text-gray-500">{review.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          11. ĐỐI TÁC
      ========================================== */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-8">Hơn 50+ Đối tác đồng hành</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-300">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex items-center gap-2 font-bold text-xl text-gray-500 cursor-pointer">
                <Activity size={28} /> Partner {i}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          12. LIÊN HỆ
      ========================================== */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden flex flex-col md:flex-row">
            
            <div className="md:w-2/5 bg-[#0b53c1] p-10 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
              <h3 className="text-3xl font-bold mb-8 relative z-10">Kết nối với chúng tôi</h3>
              <ul className="space-y-6 relative z-10">
                <li className="flex items-start gap-4">
                  <MapPin className="text-orange-400 mt-1" size={24}/>
                  <div>
                    <h4 className="font-bold text-lg">Trụ sở</h4>
                    <p className="text-blue-100 mt-1">133 Yên Duyên, Hoàng Mai, HN</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <Phone className="text-orange-400 mt-1" size={24}/>
                  <div>
                    <h4 className="font-bold text-lg">Hotline</h4>
                    <p className="text-blue-100 mt-1">0989.199.535</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <Mail className="text-orange-400 mt-1" size={24}/>
                  <div>
                    <h4 className="font-bold text-lg">Email</h4>
                    <p className="text-blue-100 mt-1">hotro@webnhathuoc.com</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="md:w-3/5 p-10">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Đăng ký tư vấn miễn phí</h3>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" placeholder="Họ và tên *" />
                  <input type="text" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" placeholder="Số điện thoại *" />
                </div>
                <input type="text" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" placeholder="Tên phòng khám / Nhà thuốc" />
                <textarea rows={3} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" placeholder="Nội dung cần tư vấn..."></textarea>
                <button type="button" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2">
                  <Send size={18} /> Gửi thông tin
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* ==========================================
          13. FOOTER
      ========================================== */}
      <footer className="relative bg-[#0b53c1] text-white pt-20 pb-6 overflow-hidden mt-10">
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
                    <span className="text-[10px] font-bold leading-none">WEB NHÀ THUỐC</span>
                    <span className="text-[10px] font-medium leading-none mt-1">WEB NHÀ THUỐC</span>
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
        Nhắn tin tư vấn
      </button>

    </div>
  );
}
