const { PrismaClient } = require('../lib/generated/prisma');
const prisma = new PrismaClient();

const PACKAGES = [
  {
    code: 'GK-TQ-NAM',
    name: 'Gói Khám Sức Khỏe Tổng Quát Tiêu Chuẩn Cho Nam',
    category: 'Khám tổng quát',
    price: 2200000,
    oldPrice: 2800000,
    discount: '-21%',
    description: 'Đánh giá toàn diện chức năng các cơ quan nội tạng, tầm soát sớm các bệnh lý chuyển hóa phổ biến ở nam giới như gan nhiễm mỡ, gout, mỡ máu, tim mạch và tiểu đường.',
    targetGender: 'Nam',
    targetAge: 'Từ 18 tuổi trở lên',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    facilityId: null, // Cả 2 cơ sở
    features: [
      'Khám nội tổng quát & đo chỉ số sinh tồn',
      'Xét nghiệm 18 chỉ số máu & nước tiểu toàn diện',
      'Siêu âm ổ bụng tổng quát màu Doppler',
      'Chụp X-quang tim phổi kỹ thuật số',
      'Đo điện tâm đồ ECG 12 cần'
    ],
    details: [
      {
        category: 'Khám Lâm Sàng',
        items: [
          'Khám Nội tổng quát: Đo huyết áp, chiều cao, cân nặng, BMI, đánh giá thể trạng',
          'Khám mắt: Đo thị lực, nhãn áp không tiếp xúc',
          'Khám Tai Mũi Họng: Kiểm tra họng, thanh quản, vòm mũi',
          'Khám Răng Hàm Mặt: Đánh giá sức khỏe răng miệng, nướu'
        ]
      },
      {
        category: 'Xét Nghiệm Huyết Học & Sinh Hóa',
        items: [
          'Tổng phân tích tế bào máu ngoại vi (24 thông số)',
          'Định lượng Glucose máu & HbA1c (tầm soát tiểu đường)',
          'Đánh giá chức năng thận: Ure, Creatinine',
          'Đánh giá chức năng gan: AST (GOT), ALT (GPT), GGT',
          'Bộ mỡ máu toàn phần: Cholesterol toàn phần, Triglyceride, HDL-C, LDL-C',
          'Định lượng Acid Uric máu (tầm soát bệnh Gút)',
          'Tổng phân tích nước tiểu 10 thông số'
        ]
      },
      {
        category: 'Chẩn Đoán Hình Ảnh & Thăm Dò Chức Năng',
        items: [
          'Chụp X-quang ngực thẳng kỹ thuật số (DR)',
          'Siêu âm màu ổ bụng tổng quát (Gan, mật, tụy, lách, thận, bàng quang, tiền liệt tuyến)',
          'Điện tâm đồ (ECG) phát hiện rối loạn nhịp tim'
        ]
      }
    ]
  },
  {
    code: 'GK-TQ-NU',
    name: 'Gói Khám Sức Khỏe Tổng Quát Tiêu Chuẩn Cho Nữ',
    category: 'Khám tổng quát',
    price: 2450000,
    oldPrice: 3100000,
    discount: '-20%',
    description: 'Thiết kế chuyên biệt cho phụ nữ hiện đại, kết hợp khám nội tổng quát với siêu âm tuyến giáp, siêu âm vú và tầm soát phụ khoa cơ bản.',
    targetGender: 'Nữ',
    targetAge: 'Từ 18 tuổi trở lên',
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    facilityId: null,
    features: [
      'Khám lâm sàng nội, mắt, răng hàm mặt, phụ khoa',
      'Xét nghiệm máu, đường huyết, mỡ máu, chức năng gan thận',
      'Siêu âm tuyến giáp & siêu âm tuyến vú 2 bên',
      'Siêu âm ổ bụng tổng quát & phụ khoa',
      'Chụp X-quang tim phổi kỹ thuật số'
    ],
    details: [
      {
        category: 'Khám Lâm Sàng',
        items: [
          'Khám Nội tổng quát & đo chỉ số sinh tồn',
          'Khám Phụ khoa: Đánh giá cơ quan sinh dục nữ',
          'Khám Tai Mũi Họng & Khám Răng Hàm Mặt'
        ]
      },
      {
        category: 'Xét Nghiệm Cận Lâm Sàng',
        items: [
          'Tổng phân tích tế bào máu (24 thông số)',
          'Đường huyết đói (Glucose)',
          'Chức năng gan (AST, ALT, GGT), chức năng thận (Ure, Creatinine)',
          'Bộ bilan lipid máu (Cholesterol, Triglyceride, HDL, LDL)',
          'Tổng phân tích nước tiểu'
        ]
      },
      {
        category: 'Chẩn Đoán Hình Ảnh',
        items: [
          'Siêu âm tuyến vú 2 bên (tầm soát u xơ, nang vú)',
          'Siêu âm tuyến giáp màu Doppler',
          'Siêu âm ổ bụng tổng quát & tử cung phần phụ',
          'Chụp X-quang tim phổi thẳng kỹ thuật số',
          'Điện tim đồ ECG'
        ]
      }
    ]
  },
  {
    code: 'GK-TQ-VIP',
    name: 'Gói Khám Sức Khỏe Toàn Diện & Tầm Soát Chuyên Sâu (VIP)',
    category: 'Khám VIP',
    price: 5800000,
    oldPrice: 7200000,
    discount: '-19%',
    description: 'Gói khám đẳng cấp thượng hạng tại phòng khám VIP MediCare. Tầm soát ung thư đa cơ quan, kiểm tra xơ vữa mạch máu, chức năng tim phổi và nội soi tiêu hóa.',
    targetGender: 'Tất cả',
    targetAge: 'Mọi lứa tuổi (Khuyến nghị trên 30)',
    image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    facilityId: null,
    features: [
      'Khám trực tiếp cùng Giáo sư, Bác sĩ Trưởng khoa',
      'Phục vụ tại Phòng khám VIP riêng biệt',
      'Tầm soát 5 dấu ấn ung thư phổ biến (Gan, Phổi, Dạ dày, Tiêu hóa, Tuyến tiền liệt/Buồng trứng)',
      'Nội soi thực quản - dạ dày không đau',
      'Siêu âm tim Doppler màu & Siêu âm mạch máu cảnh'
    ],
    details: [
      {
        category: 'Khám & Tư Vấn Chuyên Gia',
        items: [
          'Khám toàn diện cùng Bác sĩ Chuyên khoa II / Trưởng khoa',
          'Tư vấn dinh dưỡng và phác đồ nâng cao sức khỏe cá nhân hóa',
          'Dịch vụ lễ tân ưu tiên 1:1, suất ăn nhẹ dinh dưỡng tại phòng chờ VIP'
        ]
      },
      {
        category: 'Xét Nghiệm Đa Chỉ Số & Dấu Ấn Ung Thư',
        items: [
          'Xét nghiệm máu tổng quát cao cấp (30 thông số)',
          'Định lượng dấu ấn ung thư gan: AFP',
          'Dấu ấn ung thư đường tiêu hóa: CEA, CA 19-9',
          'Dấu ấn ung thư phổi: Cyfra 21-1',
          'Dấu ấn ung thư tiền liệt tuyến (Nam): PSA toàn phần',
          'Dấu ấn ung thư buồng trứng (Nữ): CA 125',
          'Xét nghiệm Viêm gan B (HBsAg, Anti-HBs), Viêm gan C (Anti-HCV)'
        ]
      },
      {
        category: 'Chẩn Đoán Hình Ảnh Đỉnh Cao',
        items: [
          'Siêu âm Doppler màu tim và động mạch cảnh (tầm soát nguy cơ đột quỵ)',
          'Nội soi dạ dày - tá tràng phóng đại NBI không đau (gây mê êm ái)',
          'Chụp X-quang tim phổi thẳng cao tần',
          'Siêu âm ổ bụng, tuyến giáp, tuyến vú đa tầng'
        ]
      }
    ]
  },
  {
    code: 'GK-UT-TIEUHOA',
    name: 'Gói Tầm Soát Ung Thư Tiêu Hóa (Dạ Dày, Đại Tràng)',
    category: 'Tầm soát ung thư',
    price: 3600000,
    oldPrice: 4500000,
    discount: '-20%',
    description: 'Chẩn đoán sớm các tổn thương tiền ung thư đường tiêu hóa với công nghệ nội soi phóng đại NBI nhuộm màu mô hiện đại, êm dịu, không đau và an toàn tuyệt đối.',
    targetGender: 'Tất cả',
    targetAge: 'Từ 35 tuổi trở lên',
    image: 'https://images.unsplash.com/photo-1584982751601-97dcc096659c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    facilityId: null,
    features: [
      'Nội soi thực quản - dạ dày - tá tràng tiền mê không đau',
      'Nội soi toàn bộ khung đại trực tràng công nghệ NBI',
      'Xét nghiệm tìm vi khuẩn HP dạ dày qua hơi thở / sinh thiết',
      'Xét nghiệm các dấu ấn ung thư tiêu hóa CEA, CA 19-9, CA 72-4'
    ],
    details: [
      {
        category: 'Khám Tiêu Hóa Lâm Sàng',
        items: [
          'Bác sĩ chuyên khoa tiêu hóa khám và đánh giá tiền sử bệnh lý gia đình',
          'Tư vấn quy trình chuẩn bị làm sạch đại tràng và tiền mê an toàn'
        ]
      },
      {
        category: 'Thủ Thuật Nội Soi Công Nghệ Cao',
        items: [
          'Nội soi dạ dày không đau bằng dàn máy Olympus EVIS X1',
          'Nội soi đại trực tràng toàn bộ kiểm tra polyp và tổn thương niêm mạc',
          'Test nhanh vi khuẩn Helicobacter Pylori (HP)'
        ]
      },
      {
        category: 'Xét Nghiệm Miễn Dịch & Tế Bào',
        items: [
          'Dấu ấn ung thư đại trực tràng CEA',
          'Dấu ấn ung thư tụy - đường mật CA 19-9',
          'Dấu ấn ung thư dạ dày CA 72-4'
        ]
      }
    ]
  },
  {
    code: 'GK-TM-DOTQUY',
    name: 'Gói Khám Tim Mạch & Tầm Soát Nguy Cơ Đột Quỵ',
    category: 'Khám tim mạch',
    price: 3200000,
    oldPrice: 3900000,
    discount: '-18%',
    description: 'Đánh giá chuyên sâu cấu trúc cơ tim, van tim và mức độ xơ vữa của động mạch cảnh nuôi não. Giúp phát hiện sớm nguy cơ nhồi máu cơ tim và tai biến mạch máu não.',
    targetGender: 'Tất cả',
    targetAge: 'Từ 40 tuổi trở lên hoặc người có bệnh nền',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    facilityId: null,
    features: [
      'Siêu âm tim Doppler màu 4D chuyên sâu',
      'Siêu âm Doppler động mạch cảnh 2 bên (tầm soát mảng xơ vữa gây đột quỵ)',
      'Đo điện tâm đồ ECG 12 chuyển đạo',
      'Xét nghiệm mỡ máu toàn phần & dấu ấn xơ vữa mạch hs-CRP',
      'Đo chỉ số xơ vữa mạch ngoại biên ABI'
    ],
    details: [
      {
        category: 'Khám Chuyên Khoa Tim Mạch',
        items: [
          'Bác sĩ chuyên khoa Tim mạch thăm khám, nghe tim phổi và phân tầng nguy cơ tim mạch 10 năm',
          'Tư vấn chế độ dùng thuốc hạ áp, chống đông hoặc statin hạ mỡ máu'
        ]
      },
      {
        category: 'Chẩn Đoán Hình Ảnh Mạch Máu',
        items: [
          'Siêu âm Doppler động mạch cảnh: Phát hiện mảng xơ vữa, đo độ dày lớp nội trung mạc (IMT)',
          'Siêu âm tim GE Vivid E95: Đánh giá chức năng tâm thu (EF), tâm trương và áp lực buồng tim',
          'Điện tâm đồ ECG 12 cần kỹ thuật số'
        ]
      },
      {
        category: 'Xét Nghiệm Sinh Hóa Tim Mạch',
        items: [
          'Định lượng hs-CRP (chỉ điểm viêm và nguy cơ xơ vữa động mạch)',
          'Bộ Lipid máu chi tiết: Cholesterol, Triglyceride, LDL-C, HDL-C',
          'Định lượng Axit Uric máu, Glucose, HbA1c'
        ]
      }
    ]
  },
  {
    code: 'GK-THN-TOANDIEN',
    name: 'Gói Khám Sức Khỏe Tiền Hôn Nhân Toàn Diện',
    category: 'Khám tiền hôn nhân',
    price: 2100000,
    oldPrice: 2600000,
    discount: '-19%',
    description: 'Trang bị hành trang sức khỏe vững vàng cho các cặp đôi trước khi kết hôn. Đánh giá sức khỏe sinh sản, phát hiện sớm các bệnh lý di truyền và bệnh truyền nhiễm.',
    targetGender: 'Tất cả',
    targetAge: 'Thanh niên chuẩn bị kết hôn',
    image: 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    facilityId: null,
    features: [
      'Khám và tư vấn sức khỏe sinh sản cùng bác sĩ chuyên khoa',
      'Tầm soát bệnh lây truyền qua đường tình dục (HIV, Viêm gan B, Giang mai)',
      'Tầm soát bệnh lý huyết sắc tố Thalassemia di truyền',
      'Siêu âm tử cung phần phụ (Nữ) / Tinh hoàn (Nam)',
      'Tư vấn tiêm chủng vắc xin trước mang thai'
    ],
    details: [
      {
        category: 'Khám & Tư Vấn Sản Phụ Khoa / Nam Khoa',
        items: [
          'Bác sĩ chuyên khoa khám cơ quan sinh dục và tư vấn sức khỏe tình dục an toàn',
          'Tư vấn chế độ dinh dưỡng, tiêm phòng Rubella, Cúm, HPV trước thai kỳ'
        ]
      },
      {
        category: 'Xét Nghiệm Truyền Nhiễm & Di Truyền',
        items: [
          'Xét nghiệm HIV Ab test nhanh thế hệ 4',
          'Kháng nguyên viêm gan B (HBsAg)',
          'Test kháng thể giang mai (Syphilis TP)',
          'Công thức máu toàn phần phát hiện dấu hiệu mang gen tan máu bẩm sinh (Thalassemia)'
        ]
      },
      {
        category: 'Chẩn Đoán Hình Ảnh Phụ Trợ',
        items: [
          'Siêu âm ổ bụng và hệ sinh sản (Tử cung buồng trứng / Tiền liệt tuyến)',
          'Chụp X-quang tim phổi thẳng kỹ thuật số'
        ]
      }
    ]
  },
  {
    code: 'GK-NHI-DINHDUONG',
    name: 'Gói Khám Tổng Quát & Tầm Soát Dinh Dưỡng Cho Bé',
    category: 'Khám nhi khoa',
    price: 1350000,
    oldPrice: 1700000,
    discount: '-20%',
    description: 'Chăm sóc và theo dõi toàn diện sự phát triển thể chất và tinh thần của trẻ từ 0 - 15 tuổi. Phát hiện sớm tình trạng thiếu vi chất, còi xương, suy dinh dưỡng hoặc thừa cân béo phì.',
    targetGender: 'Tất cả',
    targetAge: 'Trẻ em từ 6 tháng đến 15 tuổi',
    image: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    facilityId: null,
    features: [
      'Bác sĩ Nhi khoa giàu kinh nghiệm trực tiếp khám',
      'Đánh giá biểu đồ tăng trưởng chiều cao, cân nặng theo chuẩn WHO',
      'Xét nghiệm vi chất dinh dưỡng: Canxi, Kẽm, Sắt, Vitamin D',
      'Kiểm tra thị lực và tật khúc xạ học đường',
      'Tư vấn lịch tiêm chủng mở rộng và dịch vụ'
    ],
    details: [
      {
        category: 'Khám Nhi Khoa & Dinh Dưỡng',
        items: [
          'Khám thể lực, thóp, vận động, kiểm tra tim phổi, tai mũi họng',
          'Khám răng trẻ em và bôi fluor ngừa sâu răng',
          'Tư vấn khẩu phần ăn uống cân đối theo lứa tuổi'
        ]
      },
      {
        category: 'Xét Nghiệm Vi Chất Máu',
        items: [
          'Tổng phân tích tế bào máu (kiểm tra thiếu máu thiếu sắt)',
          'Định lượng Canxi ion hóa & Sắt huyết thanh',
          'Định lượng Kẽm huyết thanh',
          'Định lượng 25-OH Vitamin D3'
        ]
      },
      {
        category: 'Chẩn Đoán Bổ Sung',
        items: [
          'Siêu âm ổ bụng tổng quát cho bé',
          'Đo thị lực mắt học đường bằng máy tự động'
        ]
      }
    ]
  },
  {
    code: 'GK-CXK-LOANGXUONG',
    name: 'Gói Tầm Soát Thoái Hóa Khớp & Đo Mật Độ Xương Toàn Thân',
    category: 'Cơ xương khớp',
    price: 1850000,
    oldPrice: 2300000,
    discount: '-19%',
    description: 'Tầm soát loãng xương, gai cột sống, thoái hóa khớp gối và lắng đọng acid uric. Đặc biệt phù hợp cho người trung niên, người cao tuổi hoặc người làm việc văn phòng.',
    targetGender: 'Tất cả',
    targetAge: 'Từ 40 tuổi trở lên',
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    facilityId: null,
    features: [
      'Đo mật độ xương toàn thân phương pháp DEXA chuẩn quốc tế',
      'Siêu âm khớp gối màu Doppler độ phân giải cao',
      'Chụp X-quang cột sống thắt lưng / khớp gối thẳng nghiêng',
      'Định lượng Acid Uric máu (Gout) & Canxi máu',
      'Tư vấn bài tập vật lý trị liệu phục hồi chức năng khớp'
    ],
    details: [
      {
        category: 'Khám Cơ Xương Khớp Chuyên Sâu',
        items: [
          'Bác sĩ chuyên khoa khám tầm vận động của các khớp và cột sống',
          'Đánh giá tư thế, dáng đi và mức độ đau nhức khớp'
        ]
      },
      {
        category: 'Đo Mật Độ Xương & Chẩn Đoán Hình Ảnh',
        items: [
          'Đo mật độ xương DEXA tại Cột sống thắt lưng và Cổ xương đùi (tiêu chuẩn vàng chẩn đoán loãng xương)',
          'Siêu âm khớp gối: Đánh giá sụn khớp, dịch khớp và bao hoạt dịch',
          'Chụp X-quang cột sống hoặc khớp gối kỹ thuật số'
        ]
      },
      {
        category: 'Xét Nghiệm Máu',
        items: [
          'Định lượng Acid Uric máu',
          'Định lượng Canxi toàn phần và Phospho máu',
          'Định lượng CRP (chỉ số viêm khớp)'
        ]
      }
    ]
  }
];

async function main() {
  console.log('Seeding health packages into database...');

  for (const pkg of PACKAGES) {
    const existing = await prisma.healthPackage.findUnique({
      where: { code: pkg.code }
    });

    if (existing) {
      await prisma.healthPackage.update({
        where: { code: pkg.code },
        data: {
          name: pkg.name,
          category: pkg.category,
          price: pkg.price,
          oldPrice: pkg.oldPrice,
          discount: pkg.discount,
          description: pkg.description,
          targetGender: pkg.targetGender,
          targetAge: pkg.targetAge,
          image: pkg.image,
          features: pkg.features,
          details: pkg.details,
          facilityId: pkg.facilityId
        }
      });
      console.log(`Updated package: ${pkg.code} - ${pkg.name}`);
    } else {
      await prisma.healthPackage.create({
        data: {
          code: pkg.code,
          name: pkg.name,
          category: pkg.category,
          price: pkg.price,
          oldPrice: pkg.oldPrice,
          discount: pkg.discount,
          description: pkg.description,
          targetGender: pkg.targetGender,
          targetAge: pkg.targetAge,
          image: pkg.image,
          features: pkg.features,
          details: pkg.details,
          facilityId: pkg.facilityId
        }
      });
      console.log(`Created package: ${pkg.code} - ${pkg.name}`);
    }
  }

  const count = await prisma.healthPackage.count();
  console.log(`Total packages in database: ${count}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
