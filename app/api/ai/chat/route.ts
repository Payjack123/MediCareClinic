import { NextResponse } from 'next/server';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const SYSTEM_INSTRUCTION = `Bạn là Bác sĩ Trợ lý AI Cấp cao của Hệ thống Y tế & Phòng khám Đa khoa MediCare Việt Nam.
Nhiệm vụ của bạn:
1. Lắng nghe, đồng cảm và trả lời mọi câu hỏi về y tế, sức khỏe, bệnh học, triệu chứng, sử dụng thuốc, chế độ dinh dưỡng, lối sống và các dịch vụ khám chữa bệnh.
2. Trả lời bằng tiếng Việt chuẩn y khoa, giọng điệu chuyên nghiệp, ân cần, mạch lạc, dễ hiểu như một bác sĩ giàu kinh nghiệm đang tư vấn cho bệnh nhân.
3. Cấu trúc câu trả lời:
   - Nhận định sơ bộ tình trạng hoặc giải thích bản chất vấn đề.
   - Phân tích các nguyên nhân hoặc bệnh lý thường gặp liên quan.
   - Lời khuyên xử trí cụ thể, việc nên làm và không nên làm tại nhà.
   - Hướng dẫn chuyên khoa cần đi khám hoặc gói khám tầm soát phù hợp tại MediCare (Hà Nội hoặc TP.HCM).
   - Cảnh báo các dấu hiệu cờ đỏ (Red Flags) cần cấp cứu nếu có.
4. Tuân thủ đạo đức y khoa: Khuyên người bệnh không tự ý mua thuốc kháng sinh/thuốc đặc trị khi chưa có đơn của bác sĩ, nhắc nhở thông tin từ AI mang tính tham khảo và hướng dẫn.`;

// ============================================================================
// HỆ CHUYÊN GIA Y KHOA LÂM SÀNG DỰ PHÒNG THÔNG MINH (MEDICARE CLINICAL ENGINE)
// Phân tích ngữ nghĩa đa tầng khi chưa có hoặc gián đoạn kết nối AI Cloud
// ============================================================================
function generateSmartFallbackResponse(query: string): string {
  const q = query.toLowerCase().trim();

  // 1. CHÀO HỎI & GIỚI THIỆU BÁC SĨ
  if (/^(chào|xin chào|hello|hi|bạn là ai|giới thiệu|bác sĩ ơi|alo)/.test(q) && q.length < 35) {
    return `Chào bạn! Tôi là **Bác sĩ Trợ lý Trí tuệ Nhân tạo của Hệ thống Y tế MediCare** 🩺.

Tôi được đào tạo dựa trên các phác đồ y khoa chuẩn quốc tế và hướng dẫn của Bộ Y tế để hỗ trợ bạn:
- 🔍 **Tư vấn bệnh học & Phân tích triệu chứng** bạn đang gặp phải.
- 💊 **Hướng dẫn sử dụng thuốc an toàn**, cảnh báo tương tác và tác dụng phụ.
- 🧪 **Giải thích ý nghĩa chỉ số xét nghiệm**, kết quả siêu âm, chụp X-quang, MRI/CT.
- 🏥 **Gợi ý chuyên khoa và gói khám sức khỏe phù hợp** tại cơ sở MediCare Hà Nội và TP.HCM.

Bạn đang có vấn đề gì về sức khỏe hoặc băn khoăn về triệu chứng nào? Hãy chia sẻ cụ thể để tôi hỗ trợ bạn nhé!`;
  }

  // 2. LỜI CẢM ƠN & KẾT THÚC HỘI THOẠI
  if (/^(cảm ơn|cam on|thanks|thank you|ok cảm ơn|tuyệt vời)/.test(q) && q.length < 30) {
    return `Rất vui được hỗ trợ và đồng hành cùng sức khỏe của bạn! 🩺✨

Nếu trong quá trình theo dõi tại nhà, triệu chứng có bất kỳ thay đổi bất thường nào, bạn đừng ngần ngại nhắn tin lại cho tôi ngay nhé. Chúc bạn và gia đình luôn dồi dào sức khỏe và bình an!`;
  }

  // 3. TIM MẠCH, HUYẾT ÁP, ĐỘT QUỴ & ĐAU NGỰC
  if (q.includes('đau ngực') || q.includes('tức ngực') || q.includes('huyết áp') || q.includes('tim mạch') || q.includes('đột quỵ') || q.includes('tai biến') || q.includes('nhồi máu cơ tim') || q.includes('đánh trống ngực') || q.includes('hồi hộp')) {
    return `Chào bạn, tôi là Bác sĩ Trợ lý AI của MediCare. Về vấn đề tim mạch & huyết áp của bạn:

**1. Đánh giá y khoa sơ bộ:**
- **Cơn đau thắt ngực:** Cảm giác bóp nghẹt, đè nặng sau xương ức có thể là dấu hiệu cảnh báo thiếu máu cơ tim cục bộ hoặc bệnh mạch vành. Nếu đau lan lên cổ, vai trái hoặc cánh tay, cần đặc biệt thận trọng.
- **Tăng huyết áp / Nhịp tim nhanh:** Có thể do căng thẳng, vận động quá sức, mất ngủ hoặc bệnh lý tim mạch tiềm ẩn.
- **Cảnh báo đột quỵ (F.A.S.T):** Nhận diện méo miệng (Face), yếu tay chân (Arm), nói đớ/ngọng (Speech), thời gian cấp cứu vàng dưới 4.5 giờ (Time).

**2. Hướng dẫn chăm sóc & Việc nên làm ngay:**
- Dừng ngay mọi hoạt động gắng sức, ngồi hoặc nằm nghỉ ngơi nửa nằm nửa ngồi ở nơi thoáng khí.
- Đo huyết áp và nhịp tim nếu có máy đo tại nhà. Thở chậm và sâu (hít vào 4 giây, thở ra 6 giây).
- Giảm lượng muối trong chế độ ăn (< 5g muối/ngày), kiêng rượu bia, thuốc lá và cà phê.

**3. Khuyến nghị chuyên khoa tại MediCare:**
- Bạn nên thăm khám sớm tại **Khoa Tim mạch** hoặc đăng ký **Gói Tầm Soát Đột Quỵ & Tim Mạch (Mã: GK-TM-DOTQUY)** tại MediCare để làm điện tâm đồ (ECG), siêu âm tim Doppler và xét nghiệm men tim.

⚠️ **Dấu hiệu cấp cứu khẩn cấp (Gọi 115 ngay):** Cơn đau thắt ngực kéo dài trên 15 phút không giảm, vã mồ hôi lạnh, khó thở dữ dội, ngất xỉu hoặc có dấu hiệu méo miệng, yếu liệt nửa người!`;
  }

  // 4. TIÊU HÓA, DẠ DÀY, TRÀO NGƯỢC, ĐAU BỤNG & GAN MẬT
  if (q.includes('dạ dày') || q.includes('bao tử') || q.includes('trào ngược') || q.includes('ợ chua') || q.includes('ợ nóng') || q.includes('đau bụng') || q.includes('tiêu hóa') || q.includes('viêm gan') || q.includes('men gan') || q.includes('tiêu chảy') || q.includes('táo bón') || q.includes('đầy hơi') || q.includes('khó tiêu')) {
    return `Chào bạn, tôi là Bác sĩ Trợ lý AI của MediCare. Về tình trạng tiêu hóa và dạ dày của bạn:

**1. Nhận định nguyên nhân thường gặp:**
- **Trào ngược dạ dày thực quản (GERD):** Axit dịch vị trào ngược gây cảm giác nóng rát sau xương ức, ợ chua, ợ hơi, vướng nghẹn ở cổ họng và ho về đêm.
- **Viêm loét dạ dày - tá tràng:** Thường đau cồn cào vùng thượng vị khi đói hoặc sau ăn, liên quan đến vi khuẩn *Helicobacter pylori (HP)* hoặc dùng thuốc giảm đau kháng viêm.
- **Rối loạn tiêu hóa / Hội chứng ruột kích thích (IBS):** Đầy trướng bụng, thay đổi thói quen đại tiện (tiêu chảy xen lẫn táo bón) sau ăn đồ lạ hoặc căng thẳng.

**2. Hướng dẫn chế độ ăn & Chăm sóc:**
- Chia nhỏ 4 - 5 bữa ăn/ngày, nhai kỹ, không ăn quá no và **tuyệt đối không nằm ngay sau ăn** (chờ ít nhất 2 - 3 tiếng).
- Kiêng đồ chua cay, dầu mỡ, đồ uống có ga, cà phê và rượu bia.
- Kê cao đầu giường 10 - 15cm khi ngủ nếu hay bị trào ngược ban đêm.

**3. Đề xuất thăm khám tại MediCare:**
- Bạn nên khám tại **Khoa Tiêu hóa - Gan mật** hoặc thực hiện **Gói Tầm Soát Ung Thư Tiêu Hóa (Mã: GK-UT-TIEUHOA)** để nội soi dạ dày - đại tràng êm ái, test vi khuẩn HP và kiểm tra chức năng gan.

⚠️ **Cảnh báo cần đi viện ngay:** Đau bụng dữ dội như dao đâm, nôn ra máu, đi ngoài phân đen như bã cà phê, hoặc sốt cao kèm đau bụng khu trú hố chậu phải (nghi viêm ruột thừa)!`;
  }

  // 5. THẦN KINH, ĐAU ĐẦU, CHÓNG MẶT, TIỀN ĐÌNH & MẤT NGỦ
  if (q.includes('đau đầu') || q.includes('chóng mặt') || q.includes('nửa đầu') || q.includes('migraine') || q.includes('tiền đình') || q.includes('hoa mắt') || q.includes('mất ngủ') || q.includes('khó ngủ') || q.includes('căng thẳng') || q.includes('stress')) {
    return `Chào bạn, tôi là Bác sĩ Trợ lý AI của MediCare. Về tình trạng đau đầu / chóng mặt / thần kinh của bạn:

**1. Phân tích lâm sàng:**
- **Đau đầu do căng thẳng (Tension headache):** Cảm giác ê ẩm như có vòng siết quanh trán hoặc gáy, thường liên quan đến áp lực công việc, thiếu ngủ hoặc ngồi máy tính lâu.
- **Đau nửa đầu (Migraine):** Đau giật theo nhịp mạch ở một bên đầu, tăng nặng khi vận động, thường kèm buồn nôn, sợ ánh sáng và tiếng ồn.
- **Rối loạn tiền đình / Thiểu năng tuần hoàn não:** Gây cảm giác chao đảo, nhà cửa quay cuồng, mất thăng bằng khi đổi tư thế đột ngột, có thể kèm ù tai.

**2. Lời khuyên xử trí tại nhà:**
- Nghỉ ngơi trong phòng tối, yên tĩnh, nhiệt độ mát mẻ.
- Chườm mát lên trán hoặc chườm ấm vùng cổ gáy để giải tỏa co thắt cơ.
- Tránh thay đổi tư thế đột ngột (đặc biệt khi ngủ dậy, nên ngồi lại mép giường 1 - 2 phút trước khi đứng lên).
- Uống đủ 2 lít nước ấm/ngày, hạn chế cà phê sau 14h chiều và tập hít thở sâu trước khi ngủ.

**3. Đề xuất chuyên khoa:**
- Bạn nên đăng ký khám tại **Khoa Nội Thần kinh** hoặc **Gói Khám Sức Khỏe Toàn Diện VIP (Mã: GK-TQ-VIP)** để được đo lưu huyết não, siêu âm mạch máu và chụp MRI não nếu cơn đau kéo dài.

⚠️ **Cảnh báo nguy hiểm:** Đau đầu dữ dội đột ngột chưa từng có ("tiếng sét đánh"), đau đầu kèm sốt cao cứng cổ, nói ngọng, méo miệng hoặc yếu liệt một bên tay chân!`;
  }

  // 6. HÔ HẤP, HO, KHÓ THỞ, VIÊM HỌNG & CẢM CÚM
  if (q.includes('ho') || q.includes('sổ mũi') || q.includes('nghẹt mũi') || q.includes('viêm họng') || q.includes('viêm phế quản') || q.includes('phổi') || q.includes('khó thở') || q.includes('khò khè') || q.includes('viêm xoang') || q.includes('đờm')) {
    return `Chào bạn, tôi là Bác sĩ Trợ lý AI của MediCare. Về vấn đề đường hô hấp của bạn:

**1. Nhận định nguyên nhân:**
- **Viêm đường hô hấp trên / Cảm cúm:** Thường do virus gây ho khan, ho có đờm, rát họng, hắt hơi, nghẹt mũi và sốt nhẹ.
- **Viêm phế quản / Viêm phổi:** Ho nhiều thành cơn, ho đờm đục/vàng xanh, tức rát ngực sau cơn ho, khó thở hoặc khò khè.
- **Viêm mũi xoang dị ứng:** Ngứa mũi, hắt hơi liên tục, chảy dịch mũi sau xuống họng gây ngứa họng và ho về sáng sớm.

**2. Hướng dẫn chăm sóc đường thở:**
- Súc họng bằng nước muối sinh lý 0.9% từ 3 - 4 lần/ngày.
- Uống nhiều nước ấm (trà gừng mật ong, nước chanh ấm) giúp làm loãng đờm và dịu niêm mạc họng.
- Giữ ấm cổ ngực, đeo khẩu trang khi ra ngoài, dùng máy tạo độ ẩm nếu nằm phòng điều hòa.
- Không tự ý mua thuốc kháng sinh uống khi chưa xác định được có nhiễm khuẩn hay do virus.

**3. Khuyến nghị thăm khám tại MediCare:**
- Bạn nên đến khám tại **Khoa Hô hấp - Phổi** hoặc **Khoa Tai Mũi Họng** để được nội soi họng thanh quản, nghe phổi và chụp X-quang tim phổi kiểm tra nhu mô phổi.

⚠️ **Cần đến bệnh viện ngay:** Khó thở, thở rít, co kéo lồng ngực, ho ra máu tươi, hoặc sốt cao trên 39°C kéo dài không hạ!`;
  }

  // 7. SỐT, NHIỄM TRÙNG, SỐT XUẤT HUYẾT
  if (q.includes('sốt') || q.includes('nhiệt độ') || q.includes('rét run') || q.includes('sốt xuất huyết') || q.includes('nóng lạnh')) {
    return `Chào bạn, tôi là Bác sĩ Trợ lý AI của MediCare. Về tình trạng sốt của bạn:

**1. Hướng dẫn hạ sốt an toàn chuẩn y khoa:**
- **Nếu sốt trên 38.5°C:** Uống **Paracetamol** liều lượng 10 - 15mg/kg cân nặng mỗi lần (người lớn thường là 500mg - 650mg), cách nhau từ 4 - 6 tiếng. Tuyệt đối không dùng quá 4,000mg/24 giờ.
- **Bù nước & Điện giải:** Uống nhiều nước, dung dịch **Oresol** (pha đúng tỷ lệ theo hướng dẫn trên gói), nước dừa hoặc nước cam.
- **Làm mát vật lý:** Mặc đồ rộng rãi thoáng mát, lau người bằng khăn ấm tại các vị trí nách, bẹn, trán (không dùng nước đá lạnh hoặc cồn).

**2. Cảnh báo sốt xuất huyết Dengue:**
- Nếu sốt cao đột ngột 39 - 40°C kèm đau nhức hốc mắt, đau cơ khớp toàn thân: **TUYỆT ĐỐI KHÔNG DÙNG Aspirin hoặc Ibuprofen** vì có thể gây xuất huyết dạ dày và đe dọa tính mạng!

**3. Khi nào cần nhập viện cấp cứu:**
- Sốt cao kéo dài trên 3 ngày không hạ dù đã dùng thuốc.
- Xuất hiện chấm xuất huyết dưới da, chảy máu chân răng, nôn ra máu, đi ngoài phân đen.
- Đau bụng vùng gan dữ dội, li bì, chân tay lạnh ngắt.`;
  }

  // 8. CƠ XƯƠNG KHỚP, ĐAU LƯNG, CỘT SỐNG & BỆNH GOUT
  if (q.includes('đau lưng') || q.includes('khớp') || q.includes('cơ xương khớp') || q.includes('gout') || q.includes('gút') || q.includes('axit uric') || q.includes('thoái hóa') || q.includes('thoát vị') || q.includes('vai gáy') || q.includes('loãng xương') || q.includes('tê bì')) {
    return `Chào bạn, tôi là Bác sĩ Trợ lý AI của MediCare. Về vấn đề cơ xương khớp của bạn:

**1. Phân loại bệnh lý thường gặp:**
- **Thoái hóa cột sống / Thoát vị đĩa đệm:** Đau âm ỉ vùng thắt lưng hoặc cổ gáy, tăng khi ngồi lâu, cúi mang vác nặng, có thể lan xuống mông và chân (đau dây thần kinh tọa).
- **Cơn Gút cấp (Gout):** Viêm sưng nóng đỏ đau dữ dội ở khớp ngón chân cái hoặc cổ chân, thường bùng phát vào ban đêm sau bữa ăn nhiều đạm (thịt bò, hải sản) hoặc uống rượu bia.
- **Viêm quanh khớp vai / Hội chứng cổ vai gáy:** Co cứng cơ vùng gáy, đau lan ra bả vai và cánh tay do ngồi sai tư thế làm việc kéo dài.

**2. Biện pháp chăm sóc ban đầu:**
- Nghỉ ngơi, tránh mang vác nặng và không vặn xoắn cột sống đột ngột.
- Nếu khớp sưng đỏ nóng (nghi Gout hoặc viêm cấp): Chườm lạnh 15 phút. Nếu đau mỏi cơ mạn tính do căng cơ: Chườm ấm.
- Với bệnh Gút: Kiêng hoàn toàn rượu bia, nội tạng, thịt đỏ; uống từ 2.5 - 3 lít nước/ngày để tăng đào thải axit uric.
- Duy trì vận động nhẹ nhàng như bơi lội, đi bộ hoặc yoga kéo giãn cột sống.

**3. Khám chuyên khoa tại MediCare:**
- Bạn nên khám tại **Khoa Cơ Xương Khớp** hoặc thực hiện **Gói Tầm Soát Loãng Xương & Cơ Xương Khớp (Mã: GK-CXK-LOANGXUONG)** để chụp X-quang/MRI cột sống và định lượng Axit Uric, Calci máu.

⚠️ **Cảnh báo:** Mất cảm giác vùng đáy chậu, rối loạn đại tiểu tiện (bí tiểu, tiểu không tự chủ) hoặc teo cơ, yếu liệt chi tiến triển nhanh!`;
  }

  // 9. NỘI TIẾT, TIỂU ĐƯỜNG, ĐƯỜNG HUYẾT & TUYẾN GIÁP
  if (q.includes('tiểu đường') || q.includes('đái tháo đường') || q.includes('đường huyết') || q.includes('hba1c') || q.includes('tuyến giáp') || q.includes('bướu cổ') || q.includes('khát nước') || q.includes('sụt cân')) {
    return `Chào bạn, tôi là Bác sĩ Trợ lý AI của MediCare. Về bệnh lý nội tiết & chuyển hóa của bạn:

**1. Đánh giá lâm sàng:**
- **Đái tháo đường (Tiểu đường):** Thường có dấu hiệu "4 nhiều": Ăn nhiều, Uống nhiều, Tiểu nhiều (đặc biệt về đêm) và Sụt cân nhanh không rõ nguyên nhân, kèm mệt mỏi, mắt mờ.
- **Rối loạn chức năng tuyến giáp:** Cường giáp (tim đập nhanh, sụt cân, run tay, đổ mồ hôi) hoặc Suy giáp (mệt mỏi, tăng cân, sợ lạnh, rụng tóc).

**2. Lời khuyên dinh dưỡng & Lối sống:**
- Hạn chế tinh bột tinh chế (cơm trắng, bánh mì trắng), đồ ngọt, nước ngọt có ga và bánh kẹo.
- Tăng cường chất xơ từ rau xanh, các loại hạt nguyên cám và trái cây ít ngọt (ổi, bưởi, táo).
- Vận động thể lực đều đặn ít nhất 30 phút/ngày (đi bộ nhanh, bơi lội, đạp xe).
- Tự theo dõi đường huyết mao mạch lúc đói và sau ăn nếu đã có máy đo tại nhà.

**3. Gợi ý xét nghiệm & Gói khám tại MediCare:**
- Bạn nên đăng ký khám tại **Khoa Nội tiết - Đái tháo đường** hoặc chọn **Gói Khám Sức Khỏe Toàn Diện VIP (Mã: GK-TQ-VIP)** để làm xét nghiệm Glucose đói, chỉ số vàng HbA1c và siêu âm Doppler tuyến giáp.

⚠️ **Dấu hiệu cấp cứu:** Thở nhanh sâu, hơi thở có mùi táo chín (nhiễm toan ceton), lú lẫn, lơ mơ hoặc hôn mê do hạ/tăng đường huyết quá mức!`;
  }

  // 10. THẬN - TIẾT NIỆU & NAM KHOA
  if (q.includes('tiểu buốt') || q.includes('tiểu rắt') || q.includes('tiểu ra máu') || q.includes('sỏi thận') || q.includes('tiết niệu') || q.includes('thận') || q.includes('bàng quang') || q.includes('nam khoa')) {
    return `Chào bạn, tôi là Bác sĩ Trợ lý AI của MediCare. Về vấn đề thận - tiết niệu của bạn:

**1. Nguyên nhân phổ biến:**
- **Nhiễm trùng đường tiết niệu (UTI):** Viêm bàng quang hoặc niệu đạo gây tiểu buốt, nóng rát như kim châm, tiểu rắt nhiều lần nhưng lượng ít, nước tiểu đục hoặc có mùi hôi.
- **Sỏi tiết niệu (Sỏi thận, sỏi niệu quản):** Có thể gây cơn đau quặn thận dữ dội vùng hông lưng lan xuống bẹn, tiểu ra máu vi thể hoặc đại thể.

**2. Hướng dẫn xử trí ban đầu:**
- Uống thật nhiều nước lọc (2 - 2.5 lít/ngày) giúp tống vi khuẩn và cặn sỏi ra ngoài theo dòng nước tiểu.
- Tuyệt đối không nhịn tiểu khi có nhu cầu, vệ sinh cá nhân sạch sẽ từ trước ra sau.
- Cần đi khám để làm xét nghiệm tổng phân tích nước tiểu trước khi dùng kháng sinh, tránh kháng thuốc.

**3. Thăm khám tại MediCare:**
- Bạn nên đến **Khoa Thận - Tiết niệu & Nam khoa** để siêu âm hệ tiết niệu, chụp X-quang hệ niệu không chuẩn bị (KUB) và xét nghiệm chức năng thận (Ure, Creatinine).

⚠️ **Cảnh báo khẩn cấp:** Sốt cao rét run kèm đau dữ dội vùng mạn sườn thắt lưng (nghi ngờ viêm đài bể thận cấp) hoặc bí tiểu hoàn toàn không tiểu được!`;
  }

  // 11. THUỐC, DƯỢC PHẨM & LIỀU DÙNG
  if (q.includes('thuốc') || q.includes('paracetamol') || q.includes('panadol') || q.includes('kháng sinh') || q.includes('ibuprofen') || q.includes('aspirin') || q.includes('liều dùng') || q.includes('uống thế nào') || q.includes('tác dụng phụ')) {
    return `Chào bạn, tôi là Bác sĩ Trợ lý AI của MediCare. Về việc sử dụng thuốc an toàn:

**1. Thuốc giảm đau hạ sốt phổ biến (Paracetamol/Panadol):**
- **Liều chuẩn:** 10 - 15mg/kg cân nặng mỗi lần (người lớn thường dùng 500mg - 650mg).
- **Khoảng cách liều:** Uống cách nhau ít nhất 4 - 6 tiếng, chỉ uống khi có sốt trên 38.5°C hoặc đau nhiều.
- **Liều tối đa:** Tuyệt đối không quá 4g (4,000mg)/24 giờ để tránh hoại tử tế bào gan cấp.
- Tuyệt đối không uống rượu bia trong thời gian dùng thuốc vì làm tăng độc tính trên gan.

**2. Nguyên tắc sử dụng thuốc kháng sinh & Thuốc đặc trị:**
- Kháng sinh chỉ có tác dụng diệt vi khuẩn, **hoàn toàn vô hiệu với virus** (như cảm cúm thông thường).
- Không tự ý mua thuốc kháng sinh uống bừa bãi để tránh tình trạng vi khuẩn kháng thuốc nguy hiểm.
- Uống thuốc đúng giờ, đủ liều và đủ số ngày theo đơn bác sĩ chỉ định ngay cả khi triệu chứng đã thuyên giảm.

💡 *Nếu bạn có đơn thuốc hoặc tên thuốc cụ thể cần tra cứu, hãy gõ tên thuốc vào đây để tôi giải thích chi tiết thành phần và lưu ý nhé!*`;
  }

  // 12. GÓI KHÁM SỨC KHỎE & THÔNG TIN DỊCH VỤ MEDICARE
  if (q.includes('gói khám') || q.includes('bảng giá') || q.includes('giá khám') || q.includes('bao nhiêu tiền') || q.includes('đặt lịch') || q.includes('địa chỉ') || q.includes('cơ sở') || q.includes('hotline') || q.includes('bảo hiểm')) {
    return `Chào bạn! **Hệ thống Y tế MediCare** cung cấp đầy đủ các dịch vụ khám chữa bệnh chất lượng cao với 2 cơ sở bệnh viện hiện đại:

**1. Các Gói Khám Tiêu Chuẩn Nổi Bật Tại MediCare:**
- 📦 **Gói Khám Tổng Quát Tiêu Chuẩn Cho Nam (GK-TQ-NAM):** 1.850.000đ (Khám nội, X-quang, siêu âm ổ bụng, xét nghiệm máu - nước tiểu toàn diện).
- 📦 **Gói Khám Tổng Quát Tiêu Chuẩn Cho Nữ (GK-TQ-NU):** 2.150.000đ (Bổ sung tầm soát phụ khoa, siêu âm tuyến vú).
- 💎 **Gói Khám Sức Khỏe Toàn Diện VIP (GK-TQ-VIP):** 4.800.000đ (Tầm soát chuyên sâu toàn diện, chức năng gan thận, điện tim, nội soi).
- 🫀 **Gói Tầm Soát Đột Quỵ & Tim Mạch (GK-TM-DOTQUY):** 2.900.000đ (Siêu âm tim, Doppler mạch cảnh, đo điện tim ECG).
- 🔬 **Gói Tầm Soát Ung Thư Tiêu Hóa (GK-UT-TIEUHOA):** 3.600.000đ (Nội soi dạ dày - đại tràng gây mê không đau, test vi khuẩn HP).
- 🦴 **Gói Tầm Soát Loãng Xương & Cơ Xương Khớp (GK-CXK-LOANGXUONG):** 2.200.000đ (Đo mật độ xương Dexa, định lượng Axit Uric).

**2. Thông Tin Liên Hệ & Đặt Lịch:**
- 📍 **MediCare Hà Nội:** Tòa nhà MediCare, 123 Phố Cầu Giấy, Hà Nội.
- 📍 **MediCare TP.HCM:** 456 Đường Nguyễn Văn Cừ, Quận 5, TP. Hồ Chí Minh.
- 📞 **Hotline tư vấn & Đặt lịch:** **0941.298.865** (Phục vụ 24/7).
- Bạn có thể chuyển sang tab **Gói khám** trên thanh menu để xem chi tiết từng hạng mục dịch vụ và đặt lịch trực tuyến!`;
  }

  // 13. CÂU HỎI TỔNG QUÁT TỰ NHIÊN (DYNAMIC INFERENCE THEO TỪ KHÓA CỦA NGƯỜI DÙNG)
  const keywords = q.replace(/[?,.!\-_/]/g, ' ').split(/\s+/).filter(w => w.length > 2);
  const keywordDisplay = keywords.slice(0, 4).join(', ');

  return `Chào bạn, tôi là **Bác sĩ Trợ lý AI của Hệ thống Y tế MediCare** 🩺!

Tôi đã tiếp nhận câu hỏi của bạn: *"${query}"*

**1. Phân tích định hướng y khoa:**
- Dựa trên các dấu hiệu bạn mô tả (${keywordDisplay ? `về: **${keywordDisplay}**` : 'vấn đề sức khỏe của bạn'}), đây là tình trạng cần được theo dõi kỹ lưỡng. Triệu chứng cơ thể xuất hiện có thể là phản ứng thích nghi tạm thời nhưng cũng có thể là dấu hiệu cảnh báo của bệnh lý nội khoa tiềm ẩn.

**2. Hướng xử trí khuyến nghị tại nhà:**
- Nghỉ ngơi hợp lý, tránh thức khuya và giảm bớt căng thẳng công việc.
- Uống đủ 2 - 2.5 lít nước ấm mỗi ngày, ăn chín uống sôi và bổ sung vitamin từ rau xanh, trái cây tươi.
- Tạm thời theo dõi nhiệt độ cơ thể, huyết áp và ghi lại tần suất xuất hiện triệu chứng.

**3. Khuyến nghị thăm khám tại MediCare:**
- Để có chẩn đoán chính xác nhất, bạn nên đến thăm khám trực tiếp tại cơ sở **MediCare Hà Nội** hoặc **MediCare TP.HCM** để bác sĩ chuyên khoa thăm khám lâm sàng và chỉ định các xét nghiệm cận lâm sàng thích hợp.
- Hotline hỗ trợ đặt hẹn nhanh: **0941.298.865**.

💡 *Bạn có thể mô tả chi tiết hơn về thời gian bị, vị trí đau hoặc độ tuổi để tôi tư vấn cụ thể và chuẩn xác hơn nhé!*`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages = [], apiKey: clientKey } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Nội dung tin nhắn không hợp lệ.' }, { status: 400 });
    }

    const lastMessage = messages[messages.length - 1];
    const userQuery = lastMessage?.content || '';

    // Lấy API key từ env hoặc client truyền vào
    const apiKey = clientKey || process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    // 1. NẾU CÓ GEMINI API KEY -> GỌI GOOGLE GEMINI THẬT 100%
    if (apiKey) {
      try {
        // Chuẩn bị contents theo chuẩn Gemini Chat API
        const contents = messages.map((m: ChatMessage) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }]
        }));

        // Gửi kèm System Instruction
        const geminiPayload = {
          system_instruction: {
            parts: [{ text: SYSTEM_INSTRUCTION }]
          },
          contents: contents,
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          }
        };

        // Thử model mới nhất gemini-3.8-flash, fallback sang gemini-flash-latest
        const candidateModels = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-2.5-flash'];
        let successReply = '';
        let usedModel = '';

        for (const model of candidateModels) {
          try {
            const res = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(geminiPayload)
              }
            );

            if (res.ok) {
              const data = await res.json();
              const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
              if (text) {
                successReply = text;
                usedModel = model;
                break;
              }
            } else {
              const errText = await res.text();
              console.warn(`Model ${model} returned:`, errText.slice(0, 150));
            }
          } catch (modelErr) {
            console.warn(`Failed model ${model}:`, modelErr);
          }
        }

        if (successReply) {
          return NextResponse.json({
            reply: successReply,
            source: usedModel,
            isLiveAI: true
          });
        }
      } catch (geminiError) {
        console.error('Không thể kết nối Gemini API:', geminiError);
      }
    }

    // 2. NẾU CHƯA CÓ KEY HOẶC LỖI -> DÙNG CLINICAL EXPERT ENGINE DỰ PHÒNG
    const fallbackReply = generateSmartFallbackResponse(userQuery);
    return NextResponse.json({
      reply: fallbackReply,
      source: 'medicare-expert-nlp',
      isLiveAI: false,
      tip: 'Chưa tìm thấy GEMINI_API_KEY. Bạn có thể nhập key trong ô Cài đặt API Key để kích hoạt Google Gemini 1.5 Flash!'
    });

  } catch (error: any) {
    console.error('Lỗi API Chat:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi xử lý tin nhắn. Vui lòng thử lại.' },
      { status: 500 }
    );
  }
}
