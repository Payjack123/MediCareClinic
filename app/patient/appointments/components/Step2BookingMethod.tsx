import React from 'react';
import { ArrowLeft, ArrowRight, Stethoscope, MapPin, ChevronDown, Check, HeartPulse, Search, User, Landmark } from 'lucide-react';

interface Step2BookingMethodProps {
  setStep: (step: number) => void;
  patients: any[];
  activePatientId: number;
  bookingData: any;
  setBookingData: (data: any) => void;
  activeModal: string | null;
  setActiveModal: (modal: any) => void;
  bookingMethod: string | null;
  setBookingMethod: (method: any) => void;
  facilities: any[];
  specialties: any[];
  doctorsList: any[];
  clinics: any[];
  clinicSearchQuery: string;
  setClinicSearchQuery: (query: string) => void;
  specialtySearchQuery: string;
  setSpecialtySearchQuery: (query: string) => void;
  doctorSearchQuery: string;
  setDoctorSearchQuery: (query: string) => void;
  onNextStep: () => void;
}

export default function Step2BookingMethod({
  setStep, patients, activePatientId, bookingData, setBookingData, activeModal, setActiveModal, bookingMethod, setBookingMethod,
  facilities, specialties, doctorsList, clinics, clinicSearchQuery, setClinicSearchQuery, specialtySearchQuery, setSpecialtySearchQuery, doctorSearchQuery, setDoctorSearchQuery, onNextStep
}: Step2BookingMethodProps) {
  
  const handleBookingDataChange = (updates: any) => {
    setBookingData({ ...bookingData, ...updates });
  };

  return (
    <div className="p-6 flex-1 flex flex-col animate-in slide-in-from-right-8 relative">
      <div className="mb-6 flex items-center gap-3">
        <button onClick={() => setStep(1)} className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-600 transition"><ArrowLeft size={20} /></button>
        <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
          <Stethoscope className="text-[#2563EB]" size={28} /> Chọn phương thức đặt lịch
        </h2>
      </div>

      <p className="text-gray-500 mb-6 font-medium">Đặt lịch khám cho: <strong className="text-[#2563EB]">{patients.find(p => p.id === activePatientId)?.name}</strong></p>

      <div className="mb-6 mt-4">
        <div
          onClick={() => setActiveModal(activeModal === 'facility' ? null : 'facility')}
          className={`p-4 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all bg-white ${bookingData.facility ? 'border-[#2563EB] shadow-sm' : 'border-gray-200 hover:border-[#2563EB]'}`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bookingData.facility ? 'bg-[#2563EB] text-white' : 'bg-gray-100 text-gray-500'}`}>
              <MapPin size={24} />
            </div>
            <div>
              <h3 className={`font-bold text-lg ${bookingData.facility ? 'text-gray-900' : 'text-gray-500'}`}>Chọn cơ sở khám</h3>
              {bookingData.facility && <p className="text-sm text-gray-600 mt-0.5">{bookingData.facility}</p>}
            </div>
          </div>
          <ChevronDown size={20} className={`transition-transform ${activeModal === 'facility' ? 'rotate-180 text-[#2563EB]' : bookingData.facility ? 'text-[#2563EB]' : 'text-gray-400'}`} />
        </div>

        {activeModal === 'facility' && (
          <div className="mt-3 bg-white/80 backdrop-blur-xl border border-blue-100 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] overflow-hidden animate-in fade-in slide-in-from-top-2 p-2">
            <div className="p-3 mb-2 rounded-xl border border-dashed border-gray-200 hover:bg-gray-50 hover:border-gray-300 cursor-pointer flex items-center gap-3 transition-all" onClick={() => { handleBookingDataChange({ facility: '' }); setActiveModal(null); setBookingMethod(null); }}>
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 shrink-0"><MapPin size={16} /></div>
              <span className="font-bold text-gray-500 text-sm">- Bỏ chọn / Chọn lại cơ sở khám -</span>
            </div>
            
            {facilities.map((fac) => {
              const isSelected = bookingData.facility === fac.name;
              return (
              <div 
                key={fac.id} 
                className={`p-4 mb-1 rounded-xl cursor-pointer flex items-center justify-between transition-all duration-200 ${isSelected ? 'bg-blue-50/80 border border-blue-200 shadow-sm' : 'hover:bg-gray-50 border border-transparent'}`} 
                onClick={() => { handleBookingDataChange({ facility: fac.name }); setActiveModal(null); }}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${isSelected ? 'bg-[#2563EB] text-white' : 'bg-white border border-gray-200 text-gray-400'}`}>
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className={`font-bold text-lg transition-colors ${isSelected ? 'text-[#2563EB]' : 'text-gray-900'}`}>{fac.name}</h4>
                    <p className="text-sm mt-1 text-gray-500">{fac.address}</p>
                  </div>
                </div>
                {isSelected && <div className="w-6 h-6 rounded-full bg-[#2563EB] text-white flex items-center justify-center shrink-0 ml-4"><Check size={14} strokeWidth={3} /></div>}
              </div>
            )})}
          </div>
        )}
      </div>

      <div className="space-y-4 mb-4 flex-1">
        {/* THEO CHUYÊN KHOA */}
        <div>
          <div
            className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all bg-white ${bookingData.facility ? 'cursor-pointer hover:border-[#2563EB] border-gray-100' : 'opacity-50 cursor-not-allowed border-gray-100'}`}
            onClick={(e) => {
              if (bookingData.facility) {
                if (bookingMethod !== 'specialty') {
                  setBookingMethod('specialty');
                  setActiveModal('specialty');
                  handleBookingDataChange({ specialty: '', doctor: '', doctorId: 0 });
                } else {
                  setActiveModal(activeModal === 'specialty' ? null : 'specialty');
                }
              }
            }}
          >
            <input type="radio" name="method" className="w-5 h-5 text-[#2563EB]" readOnly checked={bookingMethod === 'specialty'} />
            <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0"><HeartPulse size={24} /></div>
            <div className="flex-1">
              <p className="font-bold text-gray-900 text-lg">Theo chuyên khoa</p>
              <p className="text-sm text-gray-500">Tìm bác sĩ theo chuyên khoa</p>
            </div>
            {bookingData.specialty && bookingMethod === 'specialty' ? (
              <div className="text-right">
                <span className="text-sm font-bold text-[#2563EB] block truncate max-w-[120px]">{bookingData.specialty}</span>
                <span className="text-xs text-blue-500">Đổi</span>
              </div>
            ) : (
              <ChevronDown size={20} className={`transition-transform ${activeModal === 'specialty' ? 'rotate-180 text-[#2563EB]' : 'text-gray-400'}`} />
            )}
          </div>
          {activeModal === 'specialty' && bookingMethod === 'specialty' && (
            <div className="mt-3 ml-0 sm:ml-12 bg-white/80 backdrop-blur-xl border border-blue-100 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] overflow-hidden animate-in fade-in slide-in-from-top-2 max-h-[400px] overflow-y-auto custom-scrollbar p-2">
              <div className="sticky top-0 bg-white/95 backdrop-blur-md z-10 p-2 pb-3 mb-2 border-b border-gray-100">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input 
                    type="text" 
                    placeholder='Tìm kiếm chuyên khoa... (VD: "da lieu")' 
                    value={specialtySearchQuery}
                    onChange={(e) => setSpecialtySearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-2xl outline-none focus:border-[#2563EB] transition-colors text-[15px]" 
                  />
                </div>
              </div>
              <div className="space-y-1 px-1">
                {(() => {
                  const filteredSpecialties = specialtySearchQuery.trim() 
                    ? specialties.filter(s => s.name.toLowerCase().includes(specialtySearchQuery.toLowerCase()))
                    : specialties;
                  
                  if (filteredSpecialties.length === 0) {
                    return <div className="p-6 text-center text-gray-500 text-sm">Không tìm thấy chuyên khoa phù hợp.</div>;
                  }
                  
                  return filteredSpecialties.map(spec => {
                    const isSelected = bookingData.specialty === spec.name;
                    // Icon logic needed to be mapped from name if you didn't pass the Icon component directly.
                    // For simplicity we just use Stethoscope as a fallback if icon isn't directly usable in this file, or we just pass the specialties array WITH the icon component inside it! Since page.tsx already did this, it will work here if we use spec.icon.
                    const Icon = spec.icon || HeartPulse;
                    return (
                    <div 
                      key={spec.id} 
                      className={`p-4 rounded-2xl cursor-pointer flex items-start gap-4 transition-all duration-200 border-b border-gray-50 last:border-b-0 hover:bg-gray-50 ${isSelected ? 'bg-blue-50/50 shadow-sm' : 'bg-white'}`} 
                      onClick={() => { handleBookingDataChange({ specialty: spec.name }); setActiveModal(null); }}
                    >
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${isSelected ? 'bg-[#2563EB] text-white ring-4 ring-blue-50' : 'bg-blue-50 text-[#2563EB]'}`}>
                        <Icon size={24} />
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-bold text-[16px] mb-1.5 transition-colors ${isSelected ? 'text-[#2563EB]' : 'text-gray-900'}`}>{spec.name}</h4>
                        <div className="text-[13px] text-gray-500 leading-relaxed bg-gray-50/50 p-2 rounded-lg border border-gray-100/50">
                          <span className="inline-flex items-center rounded-md bg-orange-50 px-2 py-0.5 text-[11px] font-semibold text-orange-700 ring-1 ring-inset ring-orange-600/20 mr-2 shadow-sm">Triệu chứng</span>
                          {spec.name === 'Da liễu' ? 'Các triệu chứng ngoài da: ngứa, mụn, phỏng nước, các bệnh lây nhiễm qua đường tình dục...' : spec.name === 'Hỗ trợ sinh sản' ? 'Khám vô sinh, mong con, IUI, IVF; bảo tồn sinh sản, tiền hôn nhân, thai nghén, nội tiết, phụ khoa hiếm muộn...' : spec.name === 'Nội tổng quát' ? 'Kiểm tra sức khỏe tổng quát, tầm soát bệnh lý...' : 'Đang cập nhật triệu chứng...'}
                        </div>
                      </div>
                      {isSelected && <div className="w-6 h-6 rounded-full bg-[#2563EB] text-white flex items-center justify-center shrink-0 mt-2 shadow-sm"><Check size={14} strokeWidth={3} /></div>}
                    </div>
                  );
                });
              })()}
              </div>
            </div>
          )}
        </div>

        {/* THEO BÁC SĨ */}
        <div>
          <div
            className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all bg-white ${bookingData.facility ? 'cursor-pointer hover:border-[#2563EB] border-gray-100' : 'opacity-50 cursor-not-allowed border-gray-100'}`}
            onClick={(e) => {
              if (bookingData.facility) {
                if (bookingMethod !== 'doctor') {
                  setBookingMethod('doctor');
                  setActiveModal('doctor');
                  handleBookingDataChange({ specialty: '', doctor: '', doctorId: 0 });
                } else {
                  setActiveModal(activeModal === 'doctor' ? null : 'doctor');
                }
              }
            }}
          >
            <input type="radio" name="method" className="w-5 h-5 text-[#2563EB]" readOnly checked={bookingMethod === 'doctor'} />
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0"><User size={24} /></div>
            <div className="flex-1">
              <p className="font-bold text-gray-900 text-lg">Theo bác sĩ</p>
              <p className="text-sm text-gray-500">Chọn bác sĩ mong muốn</p>
            </div>
            {bookingData.doctor && bookingMethod === 'doctor' ? (
              <div className="text-right">
                <span className="text-sm font-bold text-[#2563EB] block truncate max-w-[120px]">{bookingData.doctor}</span>
                <span className="text-xs text-blue-500">Đổi</span>
              </div>
            ) : (
              <ChevronDown size={20} className={`transition-transform ${activeModal === 'doctor' ? 'rotate-180 text-[#2563EB]' : 'text-gray-400'}`} />
            )}
          </div>
          {activeModal === 'doctor' && bookingMethod === 'doctor' && (
            <div className="mt-3 ml-0 sm:ml-12 bg-white/80 backdrop-blur-xl border border-blue-100 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] overflow-hidden animate-in fade-in slide-in-from-top-2 max-h-[400px] overflow-y-auto custom-scrollbar p-2">
              {(() => {
                const selectedFacilityName = bookingData.facility?.toLowerCase() || '';
                const selectedFacilityId = facilities.find(f => f.name === bookingData.facility)?.id;
                
                const isNorthFacility = selectedFacilityName.includes('hà nội') || selectedFacilityName.includes('ninh bình');
                const isSouthFacility = selectedFacilityName.includes('hồ chí minh') || selectedFacilityName.includes('sài gòn');

                const filteredDoctors = bookingData.facility 
                  ? doctorsList.filter(doc => {
                      const hasClinicInFacility = doc.clinics?.some((c: any) => c.facilityId === selectedFacilityId);
                      if (hasClinicInFacility) return true;

                      const docAddress = (doc.address || '').toLowerCase();
                      
                      const NORTH_PROVINCES = [
                        'lào cai', 'yên bái', 'điện biên', 'hòa bình', 'lai châu', 'sơn la', 'hà giang', 'cao bằng', 'bắc kạn', 'lạng sơn', 'tuyên quang', 'thái nguyên', 'phú thọ', 'bắc giang', 'quảng ninh', 'hà nội', 'hải phòng', 'bắc ninh', 'hà nam', 'hải dương', 'hưng yên', 'nam định', 'ninh bình', 'thái bình', 'vĩnh phúc',
                        'thanh hóa', 'nghệ an', 'hà tĩnh', 'quảng bình', 'quảng trị', 'thừa thiên huế', 'huế', 'miền bắc'
                      ];
                      
                      const SOUTH_PROVINCES = [
                        'đà nẵng', 'quảng nam', 'quảng ngãi', 'bình định', 'phú yên', 'khánh hòa', 'ninh thuận', 'bình thuận',
                        'kon tum', 'gia lai', 'đắk lắk', 'đắk nông', 'lâm đồng', 'đà lạt',
                        'hồ chí minh', 'sài gòn', 'bình dương', 'bình phước', 'đồng nai', 'tây ninh', 'bà rịa', 'vũng tàu',
                        'long an', 'đồng tháp', 'tiền giang', 'an giang', 'bến tre', 'vĩnh long', 'trà vinh', 'hậu giang', 'kiên giang', 'sóc trăng', 'bạc liêu', 'cà mau', 'cần thơ', 'miền nam', 'miền tây'
                      ];

                      const isDocNorth = NORTH_PROVINCES.some(prov => docAddress.includes(prov));
                      const isDocSouth = SOUTH_PROVINCES.some(prov => docAddress.includes(prov));

                      if (isNorthFacility && isDocNorth) return true;
                      if (isSouthFacility && isDocSouth) return true;
                      
                      return false;
                    })
                  : doctorsList;
                
                let finalDoctorsList = filteredDoctors;
                if (doctorSearchQuery.trim()) {
                  finalDoctorsList = filteredDoctors.filter(d => 
                    d.name.toLowerCase().includes(doctorSearchQuery.toLowerCase()) || 
                    (d.specialty || '').toLowerCase().includes(doctorSearchQuery.toLowerCase())
                  );
                }
                
                return (
                  <div className="flex flex-col h-full relative">
                    <div className="sticky top-0 bg-white/95 backdrop-blur-md z-10 p-2 pb-3 mb-2 border-b border-gray-100">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input 
                          type="text" 
                          placeholder='Tìm kiếm bác sĩ... (VD: "Nguyen Van A")' 
                          value={doctorSearchQuery}
                          onChange={(e) => setDoctorSearchQuery(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-2xl outline-none focus:border-[#2563EB] transition-colors text-[15px]" 
                        />
                      </div>
                    </div>
                    <div className="space-y-1 px-1">
                      {finalDoctorsList.length === 0 ? (
                        <div className="p-6 text-center text-gray-500 text-sm">Chưa có bác sĩ nào được phân công tại cơ sở này hoặc phù hợp với tìm kiếm.</div>
                      ) : (
                        finalDoctorsList.map(doc => {
                          const isSelected = bookingData.doctorId === doc.id;
                          return (
                            <div 
                              key={doc.id} 
                              className={`p-4 rounded-2xl cursor-pointer flex items-center gap-4 transition-all duration-200 border-b border-gray-50 last:border-b-0 hover:bg-gray-50 ${isSelected ? 'bg-blue-50/50 shadow-sm' : 'bg-white'}`} 
                              onClick={() => { 
                                handleBookingDataChange({ 
                                  doctor: doc.name, 
                                  doctorId: doc.id, 
                                  doctorPrice: doc.rawPrice, 
                                  specialty: doc.specialty,
                                  clinicName: doc.clinics && doc.clinics.length > 0 ? doc.clinics[0].name : '',
                                  roomNumber: doc.clinics && doc.clinics.length > 0 ? doc.clinics[0].roomNumber : ''
                                }); 
                                setActiveModal(null); 
                              }}
                            >
                              <div className={`w-14 h-14 rounded-full bg-blue-100 overflow-hidden shrink-0 border-2 shadow-sm ${isSelected ? 'border-[#2563EB] ring-2 ring-blue-100' : 'border-white ring-2 ring-blue-50'}`}>
                                {doc.avatar ? <img src={doc.avatar} alt={doc.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[#2563EB] font-bold text-xl">{doc.image}</div>}
                              </div>
                              <div className="flex-1">
                                <h4 className={`font-bold text-[16px] transition-colors ${isSelected ? 'text-[#2563EB]' : 'text-gray-900'}`}>{doc.name}</h4>
                                <div className="flex items-center gap-2 mt-1 flex-wrap">
                                  <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/10 shadow-sm">{doc.degree || 'Ths. BS'}</span>
                                  <span className="text-[13px] text-[#2563EB] font-bold">• {doc.specialty}</span>
                                </div>
                              </div>
                              {isSelected && <div className="w-6 h-6 rounded-full bg-[#2563EB] text-white flex items-center justify-center shrink-0 ml-4 shadow-sm"><Check size={14} strokeWidth={3} /></div>}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        {/* THEO PHÒNG KHÁM */}
        <div>
          <div
            className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all bg-white ${bookingData.facility ? 'cursor-pointer hover:border-[#2563EB] border-gray-100' : 'opacity-50 cursor-not-allowed border-gray-100'}`}
            onClick={(e) => {
              if (bookingData.facility) {
                if (bookingMethod !== 'clinic') {
                  setBookingMethod('clinic');
                  setActiveModal('clinic');
                  handleBookingDataChange({ specialty: '', doctor: '', doctorId: 0 });
                } else {
                  setActiveModal(activeModal === 'clinic' ? null : 'clinic');
                }
              }
            }}
          >
            <input type="radio" name="method" className="w-5 h-5 text-[#2563EB]" readOnly checked={bookingMethod === 'clinic'} />
            <div className="w-12 h-12 rounded-xl bg-gray-100 text-gray-500 flex items-center justify-center shrink-0"><Landmark size={24} /></div>
            <div className="flex-1">
              <p className="font-bold text-gray-900 text-lg">Theo phòng khám</p>
              <p className="text-sm text-gray-500">Chọn phòng khám mong muốn</p>
            </div>
            {bookingData.specialty && bookingMethod === 'clinic' ? (
              <div className="text-right">
                <span className="text-sm font-bold text-[#2563EB] block truncate max-w-[120px]">{bookingData.specialty}</span>
                <span className="text-xs text-blue-500">Đổi</span>
              </div>
            ) : (
              <ChevronDown size={20} className={`transition-transform ${activeModal === 'clinic' ? 'rotate-180 text-[#2563EB]' : 'text-gray-400'}`} />
            )}
          </div>
          {activeModal === 'clinic' && bookingMethod === 'clinic' && (
            <div className="mt-3 ml-0 sm:ml-12 bg-white/80 backdrop-blur-xl border border-blue-100 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] overflow-hidden animate-in fade-in slide-in-from-top-2 max-h-[400px] overflow-y-auto custom-scrollbar p-2">
              {(() => {
                const selectedFacilityId = facilities.find(f => f.name === bookingData.facility)?.id;
                let filteredClinics = bookingData.facility ? clinics.filter(c => c.facilityId === selectedFacilityId) : clinics;
                
                if (clinicSearchQuery.trim()) {
                  filteredClinics = filteredClinics.filter(c => c.name.toLowerCase().includes(clinicSearchQuery.toLowerCase()));
                }

                return (
                  <div className="flex flex-col h-full relative">
                    <div className="sticky top-0 bg-white/95 backdrop-blur-md z-10 p-2 pb-3 mb-2 border-b border-gray-100">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input 
                          type="text" 
                          placeholder='Tìm kiếm phòng khám... (VD: "noi 1")' 
                          value={clinicSearchQuery}
                          onChange={(e) => setClinicSearchQuery(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-2xl outline-none focus:border-[#2563EB] transition-colors text-[15px]" 
                        />
                      </div>
                    </div>
                    <div className="space-y-1 px-1">
                      {filteredClinics.length === 0 ? (
                        <div className="p-6 text-center text-gray-500 text-sm">Không tìm thấy phòng khám phù hợp.</div>
                      ) : (
                        filteredClinics.map(clinic => {
                          const isSelected = bookingData.specialty === clinic.name;
                          return (
                            <div 
                              key={clinic.id} 
                              className={`p-4 rounded-2xl cursor-pointer flex items-center justify-between transition-all duration-200 border-b border-gray-50 last:border-b-0 hover:bg-gray-50 ${isSelected ? 'bg-blue-50/50 shadow-sm' : 'bg-white'}`} 
                              onClick={() => { 
                                handleBookingDataChange({ 
                                  specialty: clinic.name, 
                                  clinicName: clinic.name,
                                  roomNumber: clinic.roomNumber || ''
                                }); 
                                setActiveModal(null); 
                              }}
                            >
                              <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${isSelected ? 'bg-[#2563EB] text-white shadow-md ring-4 ring-blue-50' : 'bg-blue-50 text-[#2563EB]'}`}>
                                  <Landmark size={24} />
                                </div>
                                  <div>
                                    <h4 className={`font-bold text-[16px] transition-colors ${isSelected ? 'text-[#2563EB]' : 'text-gray-900'}`}>{clinic.name}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                      <span className="text-[13px] font-bold text-[#2563EB]">{clinic.type || 'Đa khoa'}</span>
                                      {clinic.roomNumber && (
                                        <>
                                          <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                          <span className="text-[13px] text-gray-500 font-medium">Phòng: {clinic.roomNumber}</span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                {isSelected && <div className="w-6 h-6 rounded-full bg-[#2563EB] text-white flex items-center justify-center shrink-0 ml-4 shadow-sm"><Check size={14} strokeWidth={3} /></div>}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 sticky bottom-0 pb-4 pt-2 bg-white/90 backdrop-blur-sm z-10">
        <div className="bg-white rounded-2xl p-4 shadow-[0_0_20px_rgba(0,0,0,0.1)] border border-gray-100">
          {(!bookingData.specialty && !bookingData.doctor) ? (
            <div className="text-center py-2">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2 text-gray-400">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 14a8 8 0 0 1-8 8" /><path d="M18 11v-1a2 2 0 0 0-2-2v0a2 2 0 0 0-2-2v0a2 2 0 0 0-2-2v0a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-1" /><path d="M12 11v-1a2 2 0 0 0-2-2v0a2 2 0 0 0-2-2v0a2 2 0 0 0-2-2v0a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-1" /></svg>
              </div>
              <p className="text-gray-500 font-medium text-sm">Vui lòng hoàn tất phương thức đặt lịch</p>
              <div className="flex gap-3 mt-4">
                <button onClick={() => setStep(1)} className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-xl transition">Quay lại</button>
                <button disabled className="flex-[2] py-3 bg-gray-200 text-white font-bold rounded-xl opacity-50 cursor-not-allowed">Tiếp tục</button>
              </div>
            </div>
          ) : (
            <div className="py-2">
              <p className="text-sm text-gray-500 mb-1">Đã chọn:</p>
              <p className="font-bold text-[#2563EB] mb-4 text-lg">
                {bookingMethod === 'specialty' ? `Chuyên khoa ${bookingData.specialty}` :
                  bookingMethod === 'doctor' ? `Bác sĩ ${bookingData.doctor}` :
                    `Phòng khám ${bookingData.specialty}`}
              </p>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition">Quay lại</button>
                <button onClick={() => {
                  onNextStep();
                }} className="flex-[2] py-3 bg-[#2563EB] hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-2">Tiếp tục <ArrowRight size={18} /></button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
