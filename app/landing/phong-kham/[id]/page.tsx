import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { 
  Phone, Mail, MapPin, Calendar, Clock, ShieldCheck, 
  CheckCircle2, Star, Building2, Stethoscope, Award, 
  ChevronRight, Users, Activity, ArrowLeft, HeartPulse, 
  Sparkles, FileText, Check, AlertCircle, Share2
} from 'lucide-react';

interface Props {
  params: Promise<{ id: string }>;
}

const CLINIC_METADATA: Record<string, {
  image: string;
  gallery: string[];
  desc: string;
  scope: string[];
  equipments: { name: string; origin: string; desc: string }[];
  services: { name: string; price: string; note: string }[];
}> = {
  'Nội tổng quát': {
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1516549655169-df83a0774514?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    ],
    desc: 'Phòng khám Nội tổng quát là cửa ngõ thăm khám sức khỏe đầu tiên và toàn diện nhất tại MediCare. Phòng khám tiếp nhận đánh giá thể trạng, tầm soát và điều trị các bệnh lý nội khoa phổ biến như hô hấp, tiêu hóa, gan mật, nội tiết và rối loạn chuyển hóa.',
    scope: [
      'Khám và điều trị các bệnh lý tăng huyết áp, đái tháo đường, rối loạn mỡ máu',
      'Thăm khám các bệnh lý đường tiêu hóa: viêm loét dạ dày, trào ngược GERD, đại tràng',
      'Đánh giá và tầm soát các bệnh lý gan mật, sỏi mật, men gan cao',
      'Thăm khám và chẩn đoán các triệu chứng mệt mỏi, sụt cân, sốt kéo dài không rõ nguyên nhân',
      'Tư vấn chế độ dinh dưỡng và lối sống lành mạnh dự phòng bệnh mạn tính'
    ],
    equipments: [
      { name: 'Máy đo huyết áp & chỉ số sinh tồn điện tử Omron', origin: 'Nhật Bản', desc: 'Đo lường chính xác các chỉ số sinh tồn cơ bản trong tích tắc.' },
      { name: 'Hệ thống điện tim 12 cần kỹ thuật số Nihon Kohden', origin: 'Nhật Bản', desc: 'Phát hiện nhanh chóng rối loạn nhịp và thiếu máu cơ tim.' },
      { name: 'Ống nghe y tế điện tử 3M Littmann Digital', origin: 'Hoa Kỳ', desc: 'Lọc tạp âm và khuếch đại âm tim phổi siêu nhạy.' }
    ],
    services: [
      { name: 'Khám Nội tổng quát định kỳ', price: '150.000đ', note: 'Áp dụng BHYT' },
      { name: 'Tư vấn quản lý bệnh mạn tính (Tiểu đường, Huyết áp)', price: '200.000đ', note: 'Theo dõi theo phác đồ' },
      { name: 'Đo điện tim ECG 12 chuyển đạo', price: '100.000đ', note: 'Kết quả ngay' },
      { name: 'Xét nghiệm đường huyết nhanh tại chỗ', price: '50.000đ', note: 'Kết quả 5 phút' }
    ]
  },
  'Tim mạch': {
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    ],
    desc: 'Phòng khám Tim mạch MediCare chuyên sâu trong chẩn đoán sớm, điều trị và phục hồi chức năng cho bệnh nhân mắc các bệnh lý tim và mạch máu. Đội ngũ bác sĩ tim mạch giàu kinh nghiệm cùng hệ thống máy siêu âm Doppler màu thế hệ mới mang lại độ chính xác cao.',
    scope: [
      'Chẩn đoán và điều trị bệnh cơ tim thiếu máu cục bộ, bệnh mạch vành',
      'Quản lý suy tim, bệnh van tim hậu thấp và thoái hóa',
      'Thăm khám và theo dõi các rối loạn nhịp tim, rung nhĩ, ngoại tâm thu',
      'Tầm soát nguy cơ đột quỵ và xơ vữa động mạch cảnh',
      'Kiểm soát tăng huyết áp kháng trị và bệnh lý mạch máu ngoại biên'
    ],
    equipments: [
      { name: 'Hệ thống Siêu âm Tim Doppler màu GE Vivid E95', origin: 'Mỹ', desc: 'Độ phân giải siêu cao 4D, đánh giá chuyển động cơ tim và dòng máu qua van tim.' },
      { name: 'Hệ thống Holter điện tâm đồ 24h Schiller', origin: 'Thụy Sĩ', desc: 'Ghi nhận liên tục nhịp tim trong suốt sinh hoạt hàng ngày.' },
      { name: 'Máy đo xơ vữa động mạch ABI Omron', origin: 'Nhật Bản', desc: 'Đo lường chính xác mức độ cứng và tắc hẹp của thành mạch.' }
    ],
    services: [
      { name: 'Khám chuyên khoa Tim mạch', price: '200.000đ', note: 'Khám bởi bác sĩ chuyên khoa' },
      { name: 'Siêu âm tim Doppler màu mạch máu', price: '450.000đ', note: 'Hỗ trợ BHYT' },
      { name: 'Holter điện tâm đồ 24h', price: '600.000đ', note: 'Theo dõi 24 giờ' },
      { name: 'Đo vận tốc lan truyền sóng mạch ABI', price: '250.000đ', note: 'Đánh giá xơ vữa mạch' }
    ]
  },
  'Da liễu': {
    image: 'https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    ],
    desc: 'Phòng khám Da liễu MediCare kết hợp giữa điều trị bệnh lý da liễu và chăm sóc thẩm mỹ chuẩn y khoa. Chúng tôi sử dụng các công nghệ laser vi điểm, ánh sáng trị liệu hiện đại giúp giải quyết triệt để các vấn đề về mụn, nám, vảy nến, viêm da cơ địa.',
    scope: [
      'Điều trị các bệnh da liễu mạn tính: vảy nến, viêm da cơ địa, chàm, mày đay',
      'Điều trị mụn trứng cá chuyên sâu, sẹo rỗ, tăng sắc tố da sau viêm',
      'Tầm soát và điều trị u lành tính, nốt ruồi, sùi mào gà, mụn cóc bằng Laser CO2',
      'Điều trị các bệnh lý nấm da, rụng tóc từng mảng, rụng tóc nội tiết',
      'Chăm sóc và phục hồi hàng rào bảo vệ da sau tổn thương'
    ],
    equipments: [
      { name: 'Hệ thống Laser Fractional CO2 Lutronic', origin: 'Hàn Quốc', desc: 'Tái tạo bề mặt da, điều trị sẹo rỗ và loại bỏ tổn thương lành tính.' },
      { name: 'Máy soi da phân tích đa tầng A-One Pro', origin: 'Hàn Quốc', desc: 'Đánh giá chính xác độ ẩm, sắc tố melanin, lỗ chân lông và bã nhờn.' },
      { name: 'Đèn soi da Wood Light chẩn đoán nấm', origin: 'Đức', desc: 'Phát hiện chính xác các chủng vi nấm và rối loạn sắc tố.' }
    ],
    services: [
      { name: 'Khám chuyên khoa Da liễu', price: '150.000đ', note: 'Bác sĩ CK Da liễu' },
      { name: 'Soi da vi thể & tư vấn phác đồ', price: '100.000đ', note: 'Miễn phí khi khám bệnh' },
      { name: 'Đốt nốt ruồi, mụn thịt Laser CO2', price: '150.000đ - 500.000đ', note: 'Tùy số lượng và kích thước' },
      { name: 'Điều trị viêm da, mụn chuẩn y khoa', price: '300.000đ', note: 'Quy trình vô trùng y tế' }
    ]
  },
  'Răng hàm mặt': {
    image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    ],
    desc: 'Phòng khám Răng Hàm Mặt MediCare cung cấp dịch vụ khám chữa và phục hình nha khoa toàn diện với ghế khám thông minh tích hợp camera nội soi và hệ thống vô trùng khép kín Class B đạt tiêu chuẩn châu Âu.',
    scope: [
      'Khám, chẩn đoán và điều trị sâu răng, viêm tủy, viêm nha chu',
      'Nhổ răng khôn không đau bằng công nghệ sóng siêu âm Piezotome',
      'Lấy cao răng siêu âm và đánh bóng men răng định kỳ',
      'Phục hình răng sứ thẩm mỹ, cấy ghép Implant kỹ thuật cao',
      'Chỉnh nha - niềng răng mắc cài và khay trong suốt Invisalign'
    ],
    equipments: [
      { name: 'Ghế máy nha khoa thông minh Sirona Intego', origin: 'Đức', desc: 'Tích hợp đầy đủ các chức năng nội nha, cạo vôi và đèn quang trùng hợp.' },
      { name: 'Máy phẫu thuật siêu âm Piezotome Acteon', origin: 'Pháp', desc: 'Nhổ răng an toàn, không rách màng xương, lành thương nhanh.' },
      { name: 'Hệ thống hấp tiệt trùng hơi nước áp suất cao Melag', origin: 'Đức', desc: 'Đảm bảo vô trùng 100% cho từng bộ dụng cụ khám.' }
    ],
    services: [
      { name: 'Khám và tư vấn Răng hàm mặt', price: '100.000đ', note: 'Miễn phí khi thực hiện dịch vụ' },
      { name: 'Lấy cao răng siêu âm & đánh bóng', price: '150.000đ - 250.000đ', note: 'Êm ái, không buốt' },
      { name: 'Hàn trám răng thẩm mỹ Composite', price: '200.000đ - 350.000đ', note: 'Bảo hành 1 năm' },
      { name: 'Nhổ răng khôn Piezotome', price: '1.200.000đ - 2.500.000đ', note: 'Tùy mức độ khó' }
    ]
  },
  'Mắt': {
    image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    ],
    desc: 'Phòng khám Mắt MediCare trang bị đầy đủ máy đo khúc xạ tự động, sinh hiển vi khám mắt và máy đo nhãn áp không tiếp xúc. Phòng khám chuyên tầm soát tật khúc xạ, đục thủy tinh thể, glôcôm và các bệnh lý đáy mắt cho mọi lứa tuổi.',
    scope: [
      'Đo tật khúc xạ: cận thị, viễn thị, loạn thị chính xác bằng máy tự động',
      'Khám và điều trị viêm kết mạc, viêm giác mạc, khô mắt, chắp lẹo',
      'Tầm soát bệnh Glaucoma (thiên đầu thống) và đo nhãn áp định kỳ',
      'Khám và phát hiện sớm đục thủy tinh thể (cườm khô)',
      'Tầm soát bệnh võng mạc đái tháo đường và thoái hóa hoàng điểm'
    ],
    equipments: [
      { name: 'Kính sinh hiển vi khám mắt Topcon SL-D7', origin: 'Nhật Bản', desc: 'Hình ảnh sắc nét, quan sát chi tiết giác mạc, tiền phòng và thể thủy tinh.' },
      { name: 'Máy đo khúc xạ tự động kèm độ cong giác mạc Nidek', origin: 'Nhật Bản', desc: 'Độ chính xác cao, lấy nét tự động siêu nhanh.' },
      { name: 'Máy đo nhãn áp không tiếp xúc Reichert 7CR', origin: 'Mỹ', desc: 'Đo nhãn áp nhẹ nhàng bằng luồng khí êm dịu, không cần nhỏ tê.' }
    ],
    services: [
      { name: 'Khám chuyên khoa Mắt toàn diện', price: '150.000đ', note: 'Áp dụng BHYT' },
      { name: 'Đo khúc xạ thị lực bằng máy tự động', price: '80.000đ', note: 'Kèm bảng đo thị lực chuẩn' },
      { name: 'Đo nhãn áp không tiếp xúc Reichert', price: '100.000đ', note: 'Tầm soát Glôcôm' },
      { name: 'Soi đáy mắt trực tiếp', price: '120.000đ', note: 'Đánh giá võng mạc' }
    ]
  },
  'Cơ xương khớp': {
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1516549655169-df83a0774514?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    ],
    desc: 'Phòng khám Cơ Xương Khớp MediCare chuyên sâu trong điều trị thoái hóa khớp, thoát vị đĩa đệm, loãng xương và các bệnh viêm khớp tự miễn. Áp dụng phối hợp phác đồ nội khoa hiện đại, tiêm huyết tương giàu tiểu cầu (PRP) và phục hồi chức năng.',
    scope: [
      'Điều trị thoái hóa khớp gối, khớp háng, thoái hóa cột sống cổ và thắt lưng',
      'Thăm khám và quản lý bệnh Gút (Gout), viêm khớp dạng thấp, viêm cột sống dính khớp',
      'Đo mật độ xương và điều trị loãng xương dự phòng gãy xương',
      'Chẩn đoán và điều trị viêm quanh khớp vai, hội chứng ống cổ tay, viêm gân',
      'Tư vấn bài tập vật lý trị liệu phục hồi chức năng vận động'
    ],
    equipments: [
      { name: 'Máy siêu âm cơ xương khớp chuyên dụng Philips Affiniti', origin: 'Mỹ', desc: 'Đầu dò tần số cao phát hiện viêm bao hoạt dịch, rách gân và lắng đọng tinh thể urat.' },
      { name: 'Hệ thống đo loãng xương DEXA toàn thân Hologic', origin: 'Mỹ', desc: 'Tiêu chuẩn vàng chẩn đoán mật độ khoáng chất của xương.' },
      { name: 'Máy ly tâm tách chiết huyết tương giàu tiểu cầu PRP Eppendorf', origin: 'Đức', desc: 'Chiết xuất huyết tương tiểu cầu độ tinh khiết cao phục vụ tiêm khớp.' }
    ],
    services: [
      { name: 'Khám chuyên khoa Cơ xương khớp', price: '200.000đ', note: 'Bác sĩ chuyên khoa' },
      { name: 'Siêu âm khớp chuyên sâu (1 khớp)', price: '250.000đ', note: 'Hỗ trợ BHYT' },
      { name: 'Đo mật độ xương DEXA 2 vị trí', price: '350.000đ', note: 'Cột sống & Cổ xương đùi' },
      { name: 'Hút dịch khớp & tiêm thuốc điều trị khớp', price: '400.000đ', note: 'Thực hiện dưới hướng dẫn siêu âm' }
    ]
  },
  'VIP': {
    image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1516549655169-df83a0774514?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    ],
    desc: 'Phòng khám VIP MediCare được thiết kế riêng biệt theo tiêu chuẩn khách sạn y tế cao cấp, mang lại không gian thăm khám riêng tư, sang trọng và tuyệt đối thư giãn. Khách hàng được chăm sóc bởi các chuyên gia, giáo sư đầu ngành với dịch vụ lễ tân ưu tiên 1:1 không phải chờ đợi.',
    scope: [
      'Khám và tư vấn toàn diện cùng các Bác sĩ Trưởng khoa, Chuyên gia cao cấp',
      'Không gian khám riêng tư 100%, bảo mật tuyệt đối hồ sơ sức khỏe',
      'Quy trình phục vụ ưu tiên lấy mẫu xét nghiệm và cận lâm sàng tại phòng',
      'Phục vụ trà, bánh dinh dưỡng cao cấp và phòng chờ hạng thương gia',
      'Đội ngũ điều phối viên y tế hỗ trợ phiên dịch và đồng hành xuyên suốt'
    ],
    equipments: [
      { name: 'Không gian phòng khám tiện nghi cao cấp tiêu chuẩn Suite', origin: 'Quốc tế', desc: 'Nội thất sang trọng, điều hòa lọc khí ion âm kháng khuẩn.' },
      { name: 'Hệ thống theo dõi sức khỏe thông minh cá nhân hóa', origin: 'Mỹ', desc: 'Đồng bộ kết quả khám trực tiếp lên ứng dụng di động của bệnh nhân.' },
      { name: 'Trang thiết bị chẩn đoán di động tại chỗ', origin: 'Đức', desc: 'Lấy mẫu xét nghiệm và siêu âm tận nơi không cần di chuyển nhiều.' }
    ],
    services: [
      { name: 'Khám chuyên gia VIP (Toàn diện)', price: '300.000đ', note: 'Bác sĩ CKII / Trưởng khoa' },
      { name: 'Gói chăm sóc y tế VIP chuyên sâu', price: '1.500.000đ', note: 'Bao gồm cận lâm sàng cơ bản' },
      { name: 'Tư vấn sức khỏe gia đình định kỳ', price: '500.000đ', note: 'Theo dõi hồ sơ liên tục' }
    ]
  }
};

const DEFAULT_META = CLINIC_METADATA['Nội tổng quát'];

export default async function ClinicDetailPage({ params }: Props) {
  const { id } = await params;
  const clinicId = parseInt(id, 10);

  if (isNaN(clinicId)) {
    notFound();
  }

  // Lấy dữ liệu chi tiết phòng khám từ database
  const clinic = await prisma.clinic.findUnique({
    where: { id: clinicId },
    include: {
      facility: true,
      specialty: true,
      department: true,
      doctors: {
        include: {
          user: true,
          specialty: true
        }
      }
    }
  });

  if (!clinic) {
    notFound();
  }

  const specName = clinic.specialty?.name || clinic.name;
  const isVip = clinic.type === 'VIP' || clinic.name.includes('VIP');
  const meta = isVip ? CLINIC_METADATA['VIP'] : (CLINIC_METADATA[specName] || DEFAULT_META);
  const isHcm = clinic.facility.name.includes('Sài Gòn') || (clinic.facility.address?.includes('Hồ Chí Minh') ?? false);
  const bookingLink = '/login';
  const priceDisplay = isVip ? '300.000đ' : '150.000đ';

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
              <Link href="/landing/phong-kham" className="text-blue-600 transition border-b-2 border-blue-600 py-1">Phòng khám</Link>
              <Link href="/landing/bac-si" className="hover:text-blue-600 transition">Bác sĩ</Link>
              <Link href="/landing/goi-kham" className="hover:text-blue-600 transition">Gói khám</Link>
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
            <Link href="/landing/phong-kham" className="hover:text-blue-600 transition">Phòng khám</Link>
            <ChevronRight size={14} />
            <span className="text-gray-900 font-medium truncate max-w-xs sm:max-w-md">
              {clinic.name} - {clinic.facility.name}
            </span>
          </nav>
        </div>
      </div>

      {/* ==========================================
          4. HERO BANNER
      ========================================== */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            
            {/* Image Gallery Main */}
            <div className="w-full md:w-5/12">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 shadow-md relative group">
                <img src={meta.image} alt={clinic.name} className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4 flex gap-2">
                  {isVip ? (
                    <span className="bg-amber-500 text-white px-3 py-1.5 rounded-xl text-xs font-black shadow flex items-center gap-1">
                      <Sparkles size={14} /> TIÊU CHUẨN VIP
                    </span>
                  ) : (
                    <span className="bg-blue-600 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow">
                      Chuyên khoa {specName}
                    </span>
                  )}
                  {clinic.roomNumber && (
                    <span className="bg-white/95 backdrop-blur text-gray-900 px-2.5 py-1.5 rounded-xl text-xs font-bold shadow">
                      Phòng {clinic.roomNumber}
                    </span>
                  )}
                </div>
              </div>

              {/* Sub thumbnails */}
              <div className="grid grid-cols-3 gap-3 mt-3">
                {meta.gallery.map((img, idx) => (
                  <div key={idx} className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 border border-gray-100">
                    <img src={img} alt={`${clinic.name} ${idx + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Summary Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold">
                  <CheckCircle2 size={13} /> {clinic.status || 'Đang hoạt động'}
                </span>
                <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                  {isHcm ? 'Cơ sở TP.HCM' : 'Trụ sở Hà Nội'}
                </span>
              </div>

              <h1 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">
                {clinic.name}
              </h1>

              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4 flex-wrap">
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star size={16} fill="currentColor" /> 4.9
                  <span className="text-gray-400 font-normal">(950+ lượt khám)</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5 text-gray-700 font-medium">
                  <Building2 size={16} className="text-blue-600" />
                  <Link href={`/landing/benh-vien/${clinic.facilityId}`} className="hover:text-blue-600 hover:underline">
                    {clinic.facility.name}
                  </Link>
                </div>
              </div>

              <p className="text-gray-600 text-sm flex items-start gap-2 mb-5 leading-relaxed bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                <MapPin size={18} className="text-blue-600 shrink-0 mt-0.5" />
                <span>{clinic.facility.address}</span>
              </p>

              {/* Quick Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                  <div className="text-xs text-gray-500 mb-1">Số phòng trực tiếp</div>
                  <div className="font-bold text-gray-900 text-sm">Phòng {clinic.roomNumber || 'Chính'}</div>
                </div>
                <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                  <div className="text-xs text-gray-500 mb-1">Bác sĩ phụ trách</div>
                  <div className="font-bold text-blue-600 text-sm">
                    {clinic.doctors.length > 0 ? `${clinic.doctors.length} Bác sĩ chuyên khoa` : 'Bác sĩ theo ca'}
                  </div>
                </div>
                <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 col-span-2 sm:col-span-1">
                  <div className="text-xs text-gray-500 mb-1">Giá khám niêm yết</div>
                  <div className="font-bold text-emerald-600 text-sm">{priceDisplay}</div>
                </div>
              </div>

              {/* Action CTA */}
              <div className="flex gap-4 flex-wrap">
                <Link 
                  href={bookingLink}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center gap-2 text-sm"
                >
                  <Calendar size={18} /> Đặt lịch khám tại phòng này
                </Link>
                <Link 
                  href="/landing/phong-kham"
                  className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3.5 px-6 rounded-xl transition-colors flex items-center gap-2 text-sm"
                >
                  <ArrowLeft size={16} /> Xem các phòng khám khác
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
          
          {/* LEFT 2 COLUMNS: DETAILED INFO */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Section A: Giới thiệu phòng khám */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4 pb-3 border-b border-gray-100 flex items-center gap-2">
                <Stethoscope className="text-blue-600" size={22} />
                Giới thiệu & Chức năng nhiệm vụ
              </h2>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6">
                {meta.desc}
              </p>

              <h3 className="font-bold text-gray-900 text-base mb-3">Phạm vi chuyên môn & Khám điều trị:</h3>
              <ul className="space-y-2.5">
                {meta.scope.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-gray-700">
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Section B: Bác sĩ phụ trách */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Users className="text-blue-600" size={22} />
                  Đội ngũ Bác sĩ phụ trách phòng khám
                </h2>
                <Link href="/landing/bac-si" className="text-xs text-blue-600 hover:underline font-semibold">
                  Xem tất cả bác sĩ
                </Link>
              </div>

              {clinic.doctors.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {clinic.doctors.map((doctor) => {
                    const avatar = doctor.user.avatar || '/images/doctors/doctor-3.jpg';
                    const degree = doctor.degree || 'Thạc sĩ Y Khoa';
                    const exp = doctor.experience ? (doctor.experience.includes('năm') ? doctor.experience : `${doctor.experience} năm KN`) : 'Nhiều năm KN';

                    return (
                      <div key={doctor.id} className="border border-gray-100 rounded-xl p-4 hover:shadow-md hover:border-blue-200 transition-all flex items-center gap-4 bg-gray-50/50">
                        <Link href={`/landing/bac-si/${doctor.id}`} className="shrink-0">
                          <img 
                            src={avatar} 
                            alt={doctor.user.fullName} 
                            className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm hover:scale-105 transition-transform" 
                          />
                        </Link>
                        <div className="flex-1 min-w-0">
                          <span className="text-[11px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                            {degree}
                          </span>
                          <Link href={`/landing/bac-si/${doctor.id}`}>
                            <h4 className="font-bold text-gray-900 text-sm mt-1 hover:text-blue-600 transition-colors truncate cursor-pointer">
                              BS. {doctor.user.fullName}
                            </h4>
                          </Link>
                          <div className="text-xs text-gray-500 mt-0.5">{exp}</div>
                          <div className="mt-2 flex gap-2">
                            <Link 
                              href={`/landing/bac-si/${doctor.id}`}
                              className="text-xs text-blue-600 font-semibold hover:underline"
                            >
                              Xem hồ sơ
                            </Link>
                            <span className="text-gray-300">|</span>
                            <Link 
                              href={bookingLink}
                              className="text-xs text-blue-600 font-semibold hover:underline"
                            >
                              Đặt lịch
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-6 bg-blue-50/50 rounded-xl text-center border border-blue-100">
                  <p className="text-sm text-gray-600 mb-2">
                    Phòng khám được phụ trách luân phiên bởi các bác sĩ chuyên khoa giàu kinh nghiệm thuộc khoa {clinic.department?.name || specName}.
                  </p>
                  <Link href="/landing/bac-si" className="text-sm text-blue-600 font-bold hover:underline">
                    Xem danh sách toàn bộ bác sĩ hệ thống MediCare →
                  </Link>
                </div>
              )}
            </div>

            {/* Section C: Trang thiết bị hiện đại */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-100 flex items-center gap-2">
                <ShieldCheck className="text-blue-600" size={22} />
                Trang thiết bị chuyên dụng tại phòng khám
              </h2>

              <div className="space-y-4">
                {meta.equipments.map((eq, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm sm:text-base">{eq.name}</h4>
                      <p className="text-gray-500 text-xs sm:text-sm mt-1">{eq.desc}</p>
                    </div>
                    <span className="shrink-0 bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-md font-semibold self-start sm:self-center">
                      Xuất xứ: {eq.origin}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Section D: Danh mục dịch vụ & Bảng giá */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-100 flex items-center gap-2">
                <FileText className="text-blue-600" size={22} />
                Bảng giá dịch vụ khám niêm yết
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-500 font-semibold bg-gray-50">
                      <th className="py-3 px-4">Tên dịch vụ</th>
                      <th className="py-3 px-4">Giá niêm yết</th>
                      <th className="py-3 px-4">Ghi chú</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {meta.services.map((svc, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50">
                        <td className="py-3 px-4 font-medium text-gray-900">{svc.name}</td>
                        <td className="py-3 px-4 font-bold text-blue-600">{svc.price}</td>
                        <td className="py-3 px-4 text-gray-500 text-xs">{svc.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section E: Quy trình khám bệnh */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-100 flex items-center gap-2">
                <Clock className="text-blue-600" size={22} />
                Quy trình thăm khám tại phòng khám
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {[
                  { step: '01', title: 'Đặt lịch online', desc: 'Chọn giờ khám trên MediCare, không cần xếp hàng lấy số.' },
                  { step: '02', title: 'Tiếp đón tại quầy', desc: 'Xác nhận mã đặt khám và được hướng dẫn vào thẳng phòng khám.' },
                  { step: '03', title: 'Bác sĩ thăm khám', desc: 'Khám lâm sàng chu đáo, trao đổi kỹ lưỡng và chỉ định cận lâm sàng (nếu cần).' },
                  { step: '04', title: 'Tư vấn & Nhận đơn', desc: 'Bác sĩ kết luận bệnh, hướng dẫn dùng thuốc và theo dõi hồ sơ online.' },
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

          {/* RIGHT 1 COLUMN: STICKY BOOKING CARD & FACILITY INFO */}
          <div className="space-y-6">
            
            {/* Booking Box */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <div className="text-center pb-6 border-b border-gray-100">
                <span className="text-xs text-gray-400 uppercase font-semibold">Giá khám ban đầu</span>
                <div className="text-3xl font-black text-blue-600 my-1">{priceDisplay}</div>
                <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full">
                  Áp dụng BHYT & Bảo lãnh viện phí
                </span>
              </div>

              <div className="py-5 space-y-3.5 text-sm text-gray-600 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Clock size={16} className="text-gray-400" /> Giờ làm việc:
                  </span>
                  <span className="font-semibold text-gray-900">07:30 - 17:00</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Calendar size={16} className="text-gray-400" /> Ngày khám:
                  </span>
                  <span className="font-semibold text-gray-900">Thứ 2 - Thứ 7</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Building2 size={16} className="text-gray-400" /> Vị trí phòng:
                  </span>
                  <span className="font-semibold text-gray-900">Phòng {clinic.roomNumber || '201'}</span>
                </div>
              </div>

              <div className="pt-6 space-y-3">
                <Link 
                  href={bookingLink}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md shadow-blue-200 text-center block text-sm"
                >
                  Đặt lịch khám ngay
                </Link>
                <div className="text-center text-xs text-gray-400">
                  Không mất phí đặt lịch • Miễn phí hủy trước 2 giờ
                </div>
              </div>

              {/* Facility card snippet */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                    <Building2 size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{clinic.facility.name}</h4>
                    <p className="text-xs text-gray-500">{isHcm ? 'Cơ sở TP.HCM' : 'Trụ sở Hà Nội'}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed mb-3">
                  {clinic.facility.address}
                </p>
                <Link 
                  href={`/landing/benh-vien/${clinic.facilityId}`}
                  className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1"
                >
                  Xem chi tiết cơ sở bệnh viện <ChevronRight size={14} />
                </Link>
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
