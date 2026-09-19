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
  MonitorSmartphone,
  Stethoscope,
  Pill,
  Receipt,
  BarChart3,
  Bot,
  ShieldCheck,
  Cloud,
  Lock,
  Smartphone,
  Laptop,
  CheckCircle2,
  HelpCircle,
  Zap,
  Layers
} from 'lucide-react';

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans relative">
      
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
              <Link href="/index/features" className="text-yellow-400 font-bold transition">Tính năng </Link>
              <Link href="/index/training" className="text-white hover:text-yellow-400 transition">Đào tạo</Link>
              <Link href="/index/documentation" className="text-white hover:text-yellow-400 transition">Tài liệu</Link>
              <Link href="/index/about" className="text-white hover:text-yellow-400 transition">Giới thiệu</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ==========================================
          2. HERO BANNER: TÍNH NĂNG
      ========================================== */}
      <section className="relative bg-[#0b53c1] pt-20 pb-36 text-center overflow-hidden">
        <div className="absolute top-10 left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 drop-shadow-md uppercase tracking-wide">
            Tính Năng Ưu Việt
          </h1>
          <p className="text-blue-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            Tất cả những gì phòng khám cần đều có trong một hệ thống. Tự động hóa quy trình, tối ưu trải nghiệm khám chữa bệnh.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3.5 rounded-full font-bold transition shadow-lg w-full sm:w-auto">
              Dùng thử miễn phí
            </Link>
            <Link href="#demo" className="bg-white/10 hover:bg-white/20 border border-white/30 text-white px-8 py-3.5 rounded-full font-bold transition w-full sm:w-auto flex items-center justify-center gap-2">
              <PlayCircle size={20} /> Xem Demo
            </Link>
          </div>
        </div>

        {/* Lượn sóng */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
          <svg className="relative block w-full h-[60px] md:h-[100px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C89.71,117.84,204.62,78.23,321.39,56.44Z" fill="#ffffff"></path>
          </svg>
        </div>
      </section>

      {/* ==========================================
          3. CÁC TÍNH NĂNG NỔI BẬT
      ========================================== */}
      <section className="py-16 bg-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#1e3a8a] mb-4">Tính năng nổi bật</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Trải nghiệm bộ công cụ toàn diện giúp việc quản lý cơ sở y tế trở nên dễ dàng và chuyên nghiệp hơn bao giờ hết.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: <MonitorSmartphone size={32}/>, title: 'Hồ sơ y tế điện tử', desc: 'Lưu trữ toàn bộ lịch sử khám bệnh, đơn thuốc, chỉ định 100% online.' },
            { icon: <CalendarDays size={32}/>, title: 'Đặt lịch thông minh', desc: 'Bệnh nhân tự động đặt lịch qua Web/App, giảm thiểu tình trạng chờ đợi.' },
            { icon: <Pill size={32}/>, title: 'Kê đơn & Kho Dược', desc: 'Kiểm soát tồn kho theo thời gian thực, liên thông Dược quốc gia.' },
            { icon: <BarChart3 size={32}/>, title: 'Báo cáo trực quan', desc: 'Thống kê doanh thu, số lượng bệnh nhân chi tiết qua biểu đồ.' }
          ].map((feat, idx) => (
            <div key={idx} className="bg-gray-50 border border-gray-100 p-6 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-blue-100 text-[#0b53c1] rounded-xl flex items-center justify-center mb-5">
                {feat.icon}
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">{feat.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ==========================================
          4. CHI TIẾT TỪNG TÍNH NĂNG (Giao diện Zig-Zag)
      ========================================== */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
          
          {/* Feature 1 */}
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 text-orange-600 rounded-xl mb-6">
                <User size={24} />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Quản lý Bệnh nhân Toàn diện</h2>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                Nắm bắt nhanh chóng thông tin bệnh nhân từ lần khám đầu tiên. Hệ thống tự động đồng bộ tiền sử bệnh lý, dị ứng thuốc và các chỉ định đã thực hiện.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-gray-700"><CheckCircle2 className="text-green-500 shrink-0"/> Tra cứu bằng SĐT / CCCD / Mã BHYT</li>
                <li className="flex items-center gap-3 text-gray-700"><CheckCircle2 className="text-green-500 shrink-0"/> Cảnh báo tương tác thuốc tự động</li>
                <li className="flex items-center gap-3 text-gray-700"><CheckCircle2 className="text-green-500 shrink-0"/> Quản lý thẻ thành viên, thẻ gia đình</li>
              </ul>
            </div>
            <div className="md:w-1/2">
              <div className="bg-white p-2 rounded-2xl shadow-xl border border-gray-100">
                <div className="bg-gray-100 h-72 rounded-xl flex items-center justify-center text-gray-400 relative overflow-hidden">
                   <div className="absolute inset-0 bg-blue-50/50"></div>
                   <Activity size={80} className="text-blue-200" />
                   <span className="absolute bottom-4 right-4 text-xs font-bold text-blue-400">Mockup Hình Ảnh</span>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2 (Reversed) */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-12">
            <div className="md:w-1/2">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 text-green-600 rounded-xl mb-6">
                <Receipt size={24} />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Tích hợp Thanh toán & Viện phí</h2>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                Rút ngắn thời gian thanh toán tại quầy. Hệ thống kết nối đa dạng phương thức, giảm thiểu sai sót trong khâu thu ngân.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-gray-700"><CheckCircle2 className="text-green-500 shrink-0"/> Thanh toán QR Code động</li>
                <li className="flex items-center gap-3 text-gray-700"><CheckCircle2 className="text-green-500 shrink-0"/> Bóc tách chi phí BHYT và dịch vụ</li>
                <li className="flex items-center gap-3 text-gray-700"><CheckCircle2 className="text-green-500 shrink-0"/> Xuất hóa đơn điện tử tự động</li>
              </ul>
            </div>
            <div className="md:w-1/2">
              <div className="bg-white p-2 rounded-2xl shadow-xl border border-gray-100">
                <div className="bg-gray-100 h-72 rounded-xl flex items-center justify-center text-gray-400 relative overflow-hidden">
                   <div className="absolute inset-0 bg-green-50/50"></div>
                   <Receipt size={80} className="text-green-200" />
                   <span className="absolute bottom-4 right-4 text-xs font-bold text-green-400">Mockup Hình Ảnh</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ==========================================
          5. AI DOCTOR - TRỢ LÝ Y TẾ AI
      ========================================== */}
      <section className="py-20 bg-gradient-to-br from-[#172554] via-[#1e3a8a] to-[#0b53c1] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-32 opacity-10"><Bot size={400}/></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-yellow-300 text-sm font-bold mb-6">
                <Zap size={16}/> Công nghệ đột phá
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">AI Doctor - Trợ lý thông minh cho phòng khám</h2>
              <p className="text-blue-100 text-lg mb-8 leading-relaxed">
                Ứng dụng Trí tuệ nhân tạo (AI) giúp tự động hóa quy trình sàng lọc bệnh nhân, hỗ trợ bác sĩ chẩn đoán và giảm tải công việc hành chính.
              </p>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="mt-1"><MessageCircle className="text-yellow-400"/></div>
                  <div>
                    <h4 className="font-bold text-xl mb-1">Chatbot Khám Bệnh Sơ Bộ</h4>
                    <p className="text-blue-200 text-sm">AI tự động hỏi triệu chứng, phân loại mức độ khẩn cấp và gợi ý chuyên khoa phù hợp trước khi bệnh nhân đến khám.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="mt-1"><Stethoscope className="text-yellow-400"/></div>
                  <div>
                    <h4 className="font-bold text-xl mb-1">Hỗ Trợ Chẩn Đoán Cận Lâm Sàng</h4>
                    <p className="text-blue-200 text-sm">Tích hợp AI phân tích hình ảnh X-Quang, siêu âm, đưa ra khoanh vùng bất thường giúp bác sĩ tiết kiệm 50% thời gian đọc kết quả.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              {/* Box mô phỏng màn hình chat AI */}
              <div className="w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl">
                <div className="bg-blue-600 px-6 py-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-600"><Bot size={20}/></div>
                  <div>
                    <h4 className="font-bold text-white leading-tight">Trợ lý y tế AI</h4>
                    <p className="text-xs text-blue-200 flex items-center gap-1"><span className="w-2 h-2 bg-green-400 rounded-full"></span> Online</p>
                  </div>
                </div>
                <div className="p-6 bg-gray-50 h-64 flex flex-col gap-4">
                  <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-tl-none text-gray-700 text-sm w-4/5 shadow-sm">
                    Chào bạn, tôi là AI Doctor. Bạn đang gặp triệu chứng gì hãy mô tả nhé!
                  </div>
                  <div className="bg-blue-600 text-white p-3 rounded-2xl rounded-tr-none text-sm w-4/5 self-end shadow-sm">
                    Tôi bị đau đầu vùng trán và sốt 38.5 độ từ hôm qua.
                  </div>
                  <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-tl-none text-gray-700 text-sm w-4/5 shadow-sm">
                    Dựa trên triệu chứng, bạn có thể đang bị viêm xoang hoặc cảm cúm. Tôi đã giúp bạn đặt lịch BS. Nam (Khoa Nội) vào 14:00 chiều nay nhé.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          6. BẢO MẬT TUYỆT ĐỐI
      ========================================== */}
      <section className="py-20 bg-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 text-[#0b53c1] rounded-2xl mb-6">
          <ShieldCheck size={36} />
        </div>
        <h2 className="text-3xl font-bold text-[#1e3a8a] mb-4">Bảo mật dữ liệu tiêu chuẩn Y tế</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-16">
          Hồ sơ sức khỏe là tài sản vô giá. Chúng tôi áp dụng các tiêu chuẩn mã hóa quốc tế để đảm bảo thông tin bệnh nhân không bao giờ bị rò rỉ.
        </p>

        <div className="grid md:grid-cols-3 gap-8 text-left">
          <div className="p-8 border border-gray-100 rounded-3xl hover:shadow-lg transition bg-gray-50/50">
            <Lock className="text-[#0b53c1] mb-4" size={32}/>
            <h4 className="font-bold text-xl mb-3 text-gray-900">Mã hóa đầu cuối 256-bit</h4>
            <p className="text-gray-600 text-sm">Mọi dữ liệu truyền tải giữa phòng khám và máy chủ đều được mã hóa bằng thuật toán chuẩn ngân hàng.</p>
          </div>
          <div className="p-8 border border-gray-100 rounded-3xl hover:shadow-lg transition bg-gray-50/50">
            <Cloud className="text-[#0b53c1] mb-4" size={32}/>
            <h4 className="font-bold text-xl mb-3 text-gray-900">Sao lưu Cloud tự động</h4>
            <p className="text-gray-600 text-sm">Hệ thống tự động đồng bộ và sao lưu dữ liệu mỗi giờ, không lo mất mát khi máy tính tại phòng khám hỏng hóc.</p>
          </div>
          <div className="p-8 border border-gray-100 rounded-3xl hover:shadow-lg transition bg-gray-50/50">
            <Layers className="text-[#0b53c1] mb-4" size={32}/>
            <h4 className="font-bold text-xl mb-3 text-gray-900">Phân quyền chặt chẽ</h4>
            <p className="text-gray-600 text-sm">Chỉ định quyền truy cập cụ thể cho từng vai trò: Lễ tân, Bác sĩ, Dược sĩ, Quản lý để bảo vệ tính riêng tư.</p>
          </div>
        </div>
      </section>

      {/* ==========================================
          7. ỨNG DỤNG ĐA NỀN TẢNG
      ========================================== */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                Hoạt động mượt mà trên <br/> <span className="text-[#0b53c1]">Mọi nền tảng</span>
              </h2>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                Không cần cài đặt phức tạp. Hệ thống Webphongkham hoạt động hoàn hảo trên trình duyệt Web và có ứng dụng riêng cho thiết bị di động (iOS & Android).
              </p>
              <div className="flex justify-center md:justify-start gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-white shadow-sm rounded-full flex items-center justify-center text-blue-600 mb-2 border border-gray-100">
                    <Laptop size={28}/>
                  </div>
                  <span className="text-sm font-semibold text-gray-700">Web App</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-white shadow-sm rounded-full flex items-center justify-center text-gray-800 mb-2 border border-gray-100">
                    <Smartphone size={28}/>
                  </div>
                  <span className="text-sm font-semibold text-gray-700">iOS</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-white shadow-sm rounded-full flex items-center justify-center text-green-600 mb-2 border border-gray-100">
                    <Smartphone size={28}/>
                  </div>
                  <span className="text-sm font-semibold text-gray-700">Android</span>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 w-full flex justify-center">
               <div className="relative w-full max-w-md">
                 <div className="w-full aspect-video bg-gray-800 rounded-xl shadow-2xl border-4 border-gray-700 flex items-center justify-center text-gray-500">
                    MacBook Mockup
                 </div>
                 <div className="absolute -bottom-8 -right-8 w-1/3 aspect-[9/16] bg-gray-100 rounded-xl shadow-2xl border-4 border-gray-800 flex items-center justify-center text-gray-400">
                    iPhone
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          8. QUY TRÌNH HOẠT ĐỘNG
      ========================================== */}
      <section className="py-20 bg-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-[#1e3a8a] mb-4">Quy trình vận hành chuẩn</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Phần mềm thiết kế tối ưu luồng chạy của phòng khám, hạn chế thao tác thừa.</p>
        </div>

        <div className="relative">
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-blue-100 -translate-y-1/2 z-0"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
            {[
              { step: '01', title: 'Tiếp đón', desc: 'Lấy số, quét thẻ BHYT, nhập thông tin nhanh chóng.' },
              { step: '02', title: 'Khám bệnh', desc: 'Bác sĩ xem bệnh sử, chẩn đoán & ra chỉ định.' },
              { step: '03', title: 'Cận lâm sàng', desc: 'Trả kết quả siêu âm, xét nghiệm trực tiếp vào bệnh án.' },
              { step: '04', title: 'Phát thuốc', desc: 'Thanh toán viện phí & Dược sĩ xuất thuốc theo đơn.' }
            ].map((item, idx) => (
              <div key={idx} className="text-center bg-white p-6 rounded-2xl border-2 border-gray-50 shadow-sm hover:border-[#0b53c1] transition">
                <div className="w-16 h-16 bg-[#0b53c1] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-6 border-4 border-white shadow-md">
                  {item.step}
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          9. FAQ (Câu hỏi thường gặp về Tính năng)
      ========================================== */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1e3a8a] mb-4">Câu hỏi thường gặp</h2>
          </div>
          <div className="space-y-4">
            {[
              { q: 'Phần mềm có hỗ trợ đọc kết quả xét nghiệm từ máy không?', a: 'Có. Chúng tôi có tính năng LIS tích hợp, kết nối trực tiếp với 95% các dòng máy xét nghiệm hiện có trên thị trường để đổ kết quả tự động.' },
              { q: 'Phòng khám mất điện hoặc rớt mạng có dùng được không?', a: 'Với bản Cloud, bạn cần có mạng Internet (có thể dùng 4G phát từ điện thoại) để truy cập. Nếu phòng khám thường xuyên rớt mạng, chúng tôi cung cấp giải pháp cài đặt Server nội bộ (Offline).' },
              { q: 'Tính năng AI Doctor có tính thêm phí không?', a: 'AI Doctor là module nâng cao tích hợp trong gói "Chuyên nghiệp" trở lên. Các phòng khám sử dụng gói cơ bản có thể đăng ký Add-on riêng.' },
            ].map((faq, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
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
          10. CTA CHÍNH
      ========================================== */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto bg-[#0b53c1] rounded-3xl p-10 md:p-16 text-center text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4 relative z-10">Bạn muốn trải nghiệm trực tiếp mọi tính năng?</h2>
          <p className="text-blue-100 mb-8 text-lg max-w-2xl mx-auto relative z-10">
            Tạo tài khoản dùng thử miễn phí 14 ngày hoặc liên hệ với chuyên viên của chúng tôi để được tư vấn lộ trình số hóa.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
            <Link href="/register" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-bold transition shadow-lg flex items-center justify-center gap-2">
              Bắt đầu dùng thử ngay <ArrowRight size={20}/>
            </Link>
          </div>
        </div>
      </section>

      {/* ==========================================
          11. FOOTER (Giữ nguyên)
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
