import React from 'react';
import { ArrowLeft, CheckCircle2, FileText, Info, LayoutDashboard, Loader2, CreditCard } from 'lucide-react';

interface Step4ConfirmProps {
  setStep: (step: number) => void;
  patients: any[];
  setPatients: (patients: any[]) => void;
  activePatientId: number;
  bookingData: any;
  bookingMethod: string | null;
  isSubmitting: boolean;
}

export default function Step4Confirm({
  setStep, patients, setPatients, activePatientId, bookingData, bookingMethod, isSubmitting
}: Step4ConfirmProps) {

  const getSpecialtyFromClinic = (clinicName: string) => {
    if (!clinicName) return 'Đa Khoa';
    const name = clinicName.toLowerCase();
    if (name.includes('tim mạch')) return 'Tim mạch';
    if (name.includes('da liễu')) return 'Da liễu';
    if (name.includes('cơ xương khớp')) return 'Cơ xương khớp';
    if (name.includes('mắt')) return 'Mắt';
    if (name.includes('tai mũi họng')) return 'Tai mũi họng';
    if (name.includes('nội tiết')) return 'Nội tiết';
    if (name.includes('răng hàm mặt')) return 'Răng hàm mặt';
    if (name.includes('nội tổng quát')) return 'Nội tổng quát';
    if (name.includes('thần kinh')) return 'Nội - Thần Kinh';
    return 'Đa Khoa';
  };

  const getClinicName = (method: string | null, data: any) => {
    if (method === 'clinic') return data.specialty;
    if (method === 'specialty') {
      return data.specialty ? `Phòng khám ${data.specialty} (2A-225)` : 'Đang cập nhật';
    }
    if (method === 'doctor') {
      return data.specialty ? `Phòng khám ${data.specialty} 4 (2A-109)` : 'Đang cập nhật';
    }
    return 'Đang cập nhật';
  };
  return (
    <div className="p-8 flex-1 flex flex-col animate-in slide-in-from-right-8">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => setStep(3)} className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-600 transition"><ArrowLeft size={20} /></button>
        <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
          <CheckCircle2 className="text-[#2563EB]" size={28} /> Xác nhận thông tin đặt lịch
        </h2>
      </div>
      <p className="text-gray-500 mb-6">Vui lòng kiểm tra thông tin và nhập triệu chứng</p>

      <div className="space-y-6">
        <div>
          <h3 className="font-bold text-[#2563EB] mb-3 text-lg flex items-center gap-2"><FileText size={20} /> Triệu chứng/Lý do khám:</h3>
          <textarea
            rows={4}
            value={patients.find(p => p.id === activePatientId)?.reason || ''}
            onChange={(e) => setPatients(patients.map(p => p.id === activePatientId ? { ...p, reason: e.target.value } : p))}
            placeholder="Mô tả triệu chứng, tình trạng sức khỏe hoặc lý do khám bệnh..."
            className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-[#2563EB] outline-none text-base bg-white resize-none shadow-sm transition-all"
          ></textarea>
          <p className="text-xs text-gray-500 mt-2 italic flex items-center gap-1"><Info size={14} /> Thông tin chi tiết sẽ giúp bác sĩ chuẩn bị tốt hơn cho buổi khám</p>
        </div>

        <div className="bg-blue-50/50 border border-[#2563EB]/20 rounded-2xl p-6">
          <h3 className="font-bold text-gray-900 mb-4 text-lg flex items-center gap-2"><LayoutDashboard size={20} className="text-[#2563EB]" /> THÔNG TIN ĐẶT LỊCH</h3>
          <div className="space-y-3 text-sm">
            <div className="flex"><span className="w-36 text-gray-500">Cơ sở khám:</span> <span className="font-bold text-gray-900">{bookingData.facility || 'BỆNH VIỆN BẠCH MAI - NINH BÌNH'}</span></div>
            <div className="flex"><span className="w-36 text-gray-500">Phương thức:</span> <span className="font-bold text-gray-900">{bookingMethod === 'specialty' ? 'Theo chuyên khoa' : bookingMethod === 'clinic' ? 'Theo phòng khám' : 'Theo bác sĩ'}</span></div>
            <div className="flex"><span className="w-36 text-gray-500">Chuyên khoa:</span> <span className="font-bold text-gray-900">{bookingMethod === 'clinic' ? getSpecialtyFromClinic(bookingData.specialty) : bookingData.specialty || 'Đang cập nhật'}</span></div>
            {bookingMethod === 'doctor' && (
              <div className="flex"><span className="w-36 text-gray-500">Bác sĩ:</span> <span className="font-bold text-gray-900 uppercase">{bookingData.doctor}</span></div>
            )}
            <div className="flex"><span className="w-36 text-gray-500">Ngày khám:</span> <span className="font-bold text-gray-900">{bookingData.date ? bookingData.date.split('-').reverse().join('/') : ''}</span></div>
            <div className="flex"><span className="w-36 text-gray-500">Giờ khám:</span> <span className="font-bold text-gray-900">{patients.find(p => p.id === activePatientId)?.time}</span></div>
            <div className="flex">
              <span className="w-36 text-gray-500">Phòng khám:</span> 
              <span className="font-bold text-gray-900">
                {bookingData.clinicName || getClinicName(bookingMethod, bookingData)}
                {bookingData.roomNumber ? ` - Phòng: ${bookingData.roomNumber}` : ''}
              </span>
            </div>
            <div className="flex"><span className="w-36 text-gray-500">Triệu chứng:</span> <span className="font-bold text-gray-900">{patients.find(p => p.id === activePatientId)?.reason || 'Không có'}</span></div>
          </div>
        </div>

        <div className="p-4 bg-green-50/80 rounded-xl border border-green-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-green-700 font-bold">
            <CreditCard size={20} /> Phí khám dự kiến:
          </div>
          <div className="text-xl font-black text-green-600">
            {patients.find(p => p.id === activePatientId)?.doctorPrice?.toLocaleString('vi-VN') || '350,000'} VNĐ
          </div>
        </div>

        <div className="bg-yellow-50/80 rounded-2xl p-6 border border-yellow-200 shadow-sm">
          <h3 className="font-bold text-orange-500 mb-4 text-lg flex items-center gap-2">
            <Info size={22} /> LƯU Ý QUAN TRỌNG
          </h3>
          <ul className="space-y-3 text-orange-600/90 text-[15px] font-medium">
            <li className="flex items-start gap-2"><span className="text-orange-400 mt-0.5">•</span> Vui lòng có mặt trước 15 phút so với giờ hẹn</li>
            <li className="flex items-start gap-2"><span className="text-orange-400 mt-0.5">•</span> Mang theo CCCD/hộ chiếu và thẻ BHYT (nếu có)</li>
            <li className="flex items-start gap-2"><span className="text-orange-400 mt-0.5">•</span> Có thể hủy lịch trước 2 tiếng</li>
            <li className="flex items-start gap-2"><span className="text-orange-400 mt-0.5">•</span> Liên hệ hotline nếu cần thay đổi: 1900 888 866</li>
            <li className="flex items-start gap-2"><span className="text-orange-400 mt-0.5">•</span> Tuân thủ quy định của bệnh viện</li>
          </ul>
        </div>
      </div>

      <div className="mt-8 flex gap-4">
        <button onClick={() => setStep(3)} className="flex-1 py-4 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition">Quay lại</button>
        <button
          disabled={isSubmitting}
          onClick={() => setStep(5)}
          className="flex-[2] bg-[#2563EB] text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 disabled:bg-blue-400"
        >
          {isSubmitting ? <Loader2 className="animate-spin" size={24} /> : <CheckCircle2 size={24} />} Xác nhận đặt lịch
        </button>
      </div>
    </div>
  );
}
