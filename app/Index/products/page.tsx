import React from 'react';
import Link from 'next/link';
import { 
  Building2,
  Users,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  MonitorSmartphone,
  Stethoscope,
  Pill,
  Receipt,
  BarChart3,
  ShieldCheck,
  Zap,
  HelpCircle,
  PlayCircle,
  Activity,
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  Building,
  Monitor,
  Server,
  Smartphone
} from 'lucide-react';

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans relative">
      
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
              <Link href="/index/products" className="text-yellow-400 font-bold transition">Sản phẩm</Link>
              <Link href="/index/features" className="text-white hover:text-yellow-400 transition ">Tính năng </Link>
              <Link href="/index/training" className="text-white hover:text-yellow-400 transition">Đào tạo</Link>
              <Link href="/index/documentation" className="text-white hover:text-yellow-400 transition">Tài liệu</Link>
              <Link href="/index/about" className="text-white hover:text-yellow-400 transition">Giới thiệu</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ==========================================
          2. BANNER SẢN PHẨM
      ========================================== */}
      <section className="bg-[#0b53c1] pt-20 pb-28 px-4 text-center relative overflow-hidden">
        <div className="absolute top-10 left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <span className="inline-block py-1 px-3 rounded-full bg-blue-500/30 text-blue-100 border border-blue-400/30 text-sm font-semibold mb-4 uppercase tracking-wider">
            Hệ sinh thái phần mềm
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Giải pháp toàn diện dành cho <br className="hidden md:block"/> phòng khám và bệnh viện
          </h1>
          <p className="text-blue-100 mb-10 text-lg">
            Số hóa toàn bộ quy trình vận hành, nâng cao chất lượng khám chữa bệnh <br className="hidden md:block" /> và tối ưu trải nghiệm của bệnh nhân.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3.5 rounded-full font-bold transition shadow-lg w-full sm:w-auto">
              Đăng ký dùng thử
            </Link>
            <Link href="#demo" className="bg-white text-[#0b53c1] px-8 py-3.5 rounded-full font-bold transition w-full sm:w-auto hover:bg-gray-50 flex items-center justify-center gap-2">
              <PlayCircle size={20} /> Xem Demo
            </Link>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
          <svg className="relative block w-full h-[60px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C89.71,117.84,204.62,78.23,321.39,56.44Z" fill="#ffffff"></path>
          </svg>
        </div>
      </section>

      {/* ==========================================
          3. SẢN PHẨM NỔI BẬT
      ========================================== */}
      <section className="py-16 bg-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#1e3a8a] mb-4">Các sản phẩm nổi bật</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Hệ sinh thái phần mềm đáp ứng mọi nhu cầu quản lý y tế từ cơ bản đến chuyên sâu.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: <Monitor size={40}/>, title: 'Webphongkham Pro', desc: 'Phần mềm quản lý tổng thể phòng khám đa khoa, chuyên khoa. Đầy đủ module từ tiếp đón, khám bệnh đến viện phí.', color: 'text-blue-600', bg: 'bg-blue-50' },
            { icon: <Server size={40}/>, title: 'Webnhathuoc', desc: 'Giải pháp quản lý kho dược, bán hàng và kê đơn điện tử liên thông Cục Quản lý Dược Quốc gia.', color: 'text-green-600', bg: 'bg-green-50' },
            { icon: <Smartphone size={40}/>, title: 'App Bệnh Nhân', desc: 'Ứng dụng di động giúp bệnh nhân đặt lịch hẹn, xem hồ sơ bệnh án và chat trực tiếp với bác sĩ hoặc AI.', color: 'text-orange-600', bg: 'bg-orange-50' }
          ].map((prod, idx) => (
            <div key={idx} className="border border-gray-200 rounded-3xl p-8 hover:shadow-xl transition-all duration-300 group hover:-translate-y-2 bg-white">
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 ${prod.bg} ${prod.color} group-hover:scale-110 transition`}>
                {prod.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{prod.title}</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">{prod.desc}</p>
              <Link href="#" className={`font-semibold flex items-center gap-2 ${prod.color} hover:gap-3 transition-all`}>
                Tìm hiểu thêm <ArrowRight size={18} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ==========================================
          4. CHI TIẾT TỪNG MODULE
      ========================================== */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1e3a8a] mb-4">Phân hệ tính năng (Modules)</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Được thiết kế chuyên biệt để theo sát hành trình của bệnh nhân tại phòng khám.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Users/>, title: 'Quản lý Lễ tân & Đặt lịch', desc: 'Tiếp đón, tạo hồ sơ mới, xếp số thứ tự khám tự động và quản lý lịch hẹn online.' },
              { icon: <Stethoscope/>, title: 'Khám bệnh (EMR)', desc: 'Bệnh án điện tử, ghi nhận sinh hiệu, tiền sử bệnh và ra chỉ định cận lâm sàng nhanh chóng.' },
              { icon: <MonitorSmartphone/>, title: 'Cận lâm sàng (LIS/PACS)', desc: 'Kết nối máy xét nghiệm, siêu âm, X-quang. Trả kết quả trực tiếp về phòng khám.' },
              { icon: <Pill/>, title: 'Quản lý Kho Dược', desc: 'Nhập xuất tồn, quản lý lô/date thuốc, cảnh báo hết hạn và kê đơn thuốc điện tử.' },
              { icon: <Receipt/>, title: 'Viện phí & Bảo hiểm', desc: 'Thu ngân, xuất hóa đơn điện tử, tính toán chi phí BHYT và tích hợp thanh toán mã QR.' },
              { icon: <BarChart3/>, title: 'Báo cáo & Thống kê', desc: 'Hệ thống báo cáo doanh thu, lượt khám, hoa hồng bác sĩ trực quan theo thời gian thực.' }
            ].map((module, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-blue-300 transition flex gap-4">
                <div className="mt-1 w-12 h-12 bg-blue-100 text-[#0b53c1] rounded-xl flex items-center justify-center shrink-0">
                  {module.icon}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2 text-lg">{module.title}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{module.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          5. QUY TRÌNH HOẠT ĐỘNG
      ========================================== */}
      <section className="py-20 bg-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-[#1e3a8a] mb-4">Quy trình vận hành tự động</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Phần mềm giúp chuẩn hóa và liên kết chặt chẽ các phòng ban, loại bỏ sai sót và giảm chờ đợi.</p>
        </div>

        <div className="relative">
          {/* Đường kẻ ngang (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-blue-100 -translate-y-1/2 z-0"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
            {[
              { step: '01', title: 'Tiếp đón', desc: 'Bệnh nhân đăng ký thông tin, lấy số thứ tự tự động.' },
              { step: '02', title: 'Khám bệnh', desc: 'Bác sĩ chẩn đoán, chỉ định CLS qua phần mềm.' },
              { step: '03', title: 'Thực hiện CLS', desc: 'Phòng xét nghiệm/siêu âm cập nhật kết quả lên hệ thống.' },
              { step: '04', title: 'Thanh toán & Nhận thuốc', desc: 'Thu ngân thanh toán, dược sĩ phát thuốc theo đơn điện tử.' }
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
          6. LỢI ÍCH MANG LẠI
      ========================================== */}
      <section className="py-16 bg-gradient-to-r from-[#172554] to-[#0b53c1] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">Tại sao nên chọn hệ thống của chúng tôi?</h2>
              <p className="text-blue-100 mb-8 text-lg">Không chỉ là phần mềm quản lý, chúng tôi mang đến một bộ máy vận hành trơn tru giúp bạn tập trung hoàn toàn vào chuyên môn y tế.</p>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0"><Zap className="text-yellow-400"/></div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Tốc độ xử lý siêu việt</h4>
                    <p className="text-blue-100 text-sm">Hệ thống Cloud tối ưu, xử lý hàng nghìn lượt khám cùng lúc không giật lag.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0"><ShieldCheck className="text-green-400"/></div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Bảo mật dữ liệu tuyệt đối</h4>
                    <p className="text-blue-100 text-sm">Chuẩn bảo mật quốc tế, tự động sao lưu dữ liệu y tế của bệnh nhân hàng ngày.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0"><Activity className="text-pink-400"/></div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Tích hợp AI thông minh</h4>
                    <p className="text-blue-100 text-sm">Hỗ trợ nhận diện bệnh án, cảnh báo tương tác thuốc và chatbot tư vấn sức khỏe.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="hidden md:flex justify-center">
              {/* Hình ảnh mô tả mockup màn hình */}
              <div className="w-full h-96 bg-white/10 border border-white/20 rounded-3xl backdrop-blur-md flex items-center justify-center shadow-2xl relative">
                <Monitor size={100} className="text-white/50" />
                <div className="absolute top-4 left-4 bg-red-500 w-3 h-3 rounded-full"></div>
                <div className="absolute top-4 left-9 bg-yellow-500 w-3 h-3 rounded-full"></div>
                <div className="absolute top-4 left-14 bg-green-500 w-3 h-3 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          7. KHÁCH HÀNG ĐANG SỬ DỤNG
      ========================================== */}
      <section className="py-12 bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-8">Tin dùng bởi hơn 2500+ cơ sở y tế</p>
          <div className="flex flex-wrap justify-center gap-6 md:gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-300">
             {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex items-center gap-2 font-bold text-lg text-gray-500">
                <Building2 size={24} /> Clinic {i}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          8. BẢNG GIÁ
      ========================================== */}
      <section className="py-20 bg-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-[#1e3a8a] mb-4">Bảng giá tham khảo</h2>
          <p className="text-gray-600 max-w-xl mx-auto">Chi phí linh hoạt, phù hợp với quy mô từ phòng khám nhỏ đến hệ thống bệnh viện lớn.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
          {/* Gói Cơ bản */}
          <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
            <h3 className="font-bold text-xl text-gray-900 mb-2">Cơ bản</h3>
            <p className="text-gray-500 text-sm mb-6">Dành cho phòng khám tư nhân nhỏ.</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-900">300k</span>
              <span className="text-gray-500">/tháng</span>
            </div>
            <ul className="space-y-4 mb-8 text-sm text-gray-600">
              <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-green-500"/> Quản lý tối đa 3 bác sĩ</li>
              <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-green-500"/> Bệnh án điện tử (EMR)</li>
              <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-green-500"/> Quản lý nhà thuốc cơ bản</li>
            </ul>
            <button className="w-full py-3 rounded-xl border-2 border-[#0b53c1] text-[#0b53c1] font-bold hover:bg-blue-50 transition">Đăng ký ngay</button>
          </div>

          {/* Gói Chuyên nghiệp (Nổi bật) */}
          <div className="bg-[#0b53c1] border border-[#0b53c1] rounded-3xl p-8 shadow-2xl relative transform md:-translate-y-4 text-white">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-orange-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase">Khuyên dùng</div>
            <h3 className="font-bold text-xl mb-2">Chuyên nghiệp (Pro)</h3>
            <p className="text-blue-200 text-sm mb-6">Đầy đủ tính năng cho phòng khám đa khoa.</p>
            <div className="mb-6">
              <span className="text-4xl font-bold">800k</span>
              <span className="text-blue-200">/tháng</span>
            </div>
            <ul className="space-y-4 mb-8 text-sm text-blue-50">
              <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-green-400"/> Không giới hạn tài khoản bác sĩ</li>
              <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-green-400"/> Tích hợp máy xét nghiệm (LIS)</li>
              <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-green-400"/> Quản lý kho Dược nâng cao</li>
              <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-green-400"/> Chăm sóc khách hàng tự động Zalo/SMS</li>
            </ul>
            <button className="w-full py-3 rounded-xl bg-orange-500 text-white font-bold hover:bg-orange-600 transition shadow-lg">Đăng ký ngay</button>
          </div>

          {/* Gói Bệnh viện */}
          <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
            <h3 className="font-bold text-xl text-gray-900 mb-2">Bệnh viện</h3>
            <p className="text-gray-500 text-sm mb-6">Tùy biến cao theo nghiệp vụ riêng biệt.</p>
            <div className="mb-6">
              <span className="text-3xl font-bold text-gray-900">Liên hệ</span>
            </div>
            <ul className="space-y-4 mb-8 text-sm text-gray-600">
              <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-green-500"/> Quản lý nội trú & ngoại trú</li>
              <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-green-500"/> Tích hợp ERP kế toán</li>
              <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-green-500"/> Cổng thanh toán, App bệnh nhân riêng</li>
              <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-green-500"/> Triển khai Server nội bộ (On-premise)</li>
            </ul>
            <button className="w-full py-3 rounded-xl border-2 border-[#0b53c1] text-[#0b53c1] font-bold hover:bg-blue-50 transition">Nhận báo giá</button>
          </div>
        </div>
      </section>

      {/* ==========================================
          9. FAQ
      ========================================== */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1e3a8a] mb-4">Câu hỏi thường gặp</h2>
          </div>
          <div className="space-y-4">
            {[
              { q: 'Thời gian triển khai phần mềm mất bao lâu?', a: 'Đối với phòng khám vừa và nhỏ, chúng tôi hỗ trợ khởi tạo và sử dụng ngay trong 24h. Với hệ thống lớn cần kết nối máy móc, thời gian từ 3 - 7 ngày làm việc.' },
              { q: 'Phần mềm có liên thông đơn thuốc quốc gia không?', a: 'Có, Webnhathuoc và Webphongkham hỗ trợ liên thông trực tiếp lên Cổng thông tin Dược quốc gia bằng 1 click.' },
              { q: 'Tôi có được hỗ trợ kỹ thuật sau khi mua không?', a: 'Chắc chắn. Chúng tôi có đội ngũ kỹ thuật trực 24/7 qua Hotline và Zalo để hỗ trợ mọi vấn đề trong quá trình sử dụng.' },
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
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4 relative z-10">Bắt đầu quản lý phòng khám hiệu quả hơn ngay hôm nay!</h2>
          <p className="text-blue-100 mb-8 text-lg max-w-2xl mx-auto relative z-10">
            Hãy để Webphongkham đồng hành cùng sự phát triển của cơ sở y tế của bạn. Đăng ký nhận tài khoản Demo miễn phí 14 ngày.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
            <Link href="/register" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-bold transition shadow-lg flex items-center justify-center gap-2">
              Dùng thử phần mềm miễn phí
            </Link>
          </div>
        </div>
      </section>

      {/* ==========================================
          11. FOOTER
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
