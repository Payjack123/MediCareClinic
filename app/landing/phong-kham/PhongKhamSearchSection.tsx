'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, MapPin, Star, CheckCircle2, ChevronDown, Filter, X, 
  Building2, Users, Clock, ShieldCheck, Stethoscope, ChevronRight,
  Sparkles, Award
} from 'lucide-react';

interface Doctor {
  id: number;
  degree?: string | null;
  experience?: string | null;
  user: {
    id: number;
    fullName: string;
    avatar?: string | null;
  };
}

interface Facility {
  id: number;
  name: string;
  address: string | null;
}

interface Specialty {
  id: number;
  name: string;
}

interface Clinic {
  id: number;
  name: string;
  roomNumber?: string | null;
  type: string;
  status: string;
  facilityId: number;
  facility: Facility;
  specialty?: Specialty | null;
  doctors: Doctor[];
}

interface Props {
  clinics: Clinic[];
  bookingLink: string;
}

const CLINIC_IMAGES: Record<string, string> = {
  'Nội tổng quát': 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'Tim mạch': 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'Da liễu': 'https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'Răng hàm mặt': 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'Mắt': 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'Cơ xương khớp': 'https://images.unsplash.com/photo-1516549655169-df83a0774514?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'VIP': 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'default': 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
};

const DOCTOR_AVATAR_FALLBACK = '/images/doctors/doctor-3.jpg';

const CITIES = [
  { id: 'Hà Nội', label: 'MediCare Hà Nội' },
  { id: 'TP. Hồ Chí Minh', label: 'MediCare TP.HCM' }
];

export default function PhongKhamSearchSection({ clinics, bookingLink }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string>('all');

  // Extract unique specialties from clinics
  const availableSpecialties = useMemo(() => {
    const set = new Set<string>();
    clinics.forEach(c => {
      if (c.specialty?.name) set.add(c.specialty.name);
    });
    return Array.from(set);
  }, [clinics]);

  const handleToggleCity = (cityId: string) => {
    setSelectedCities(prev => 
      prev.includes(cityId) ? prev.filter(c => c !== cityId) : [...prev, cityId]
    );
  };

  const handleToggleSpecialty = (spec: string) => {
    setSelectedSpecialties(prev => 
      prev.includes(spec) ? prev.filter(s => s !== spec) : [...prev, spec]
    );
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCities([]);
    setSelectedSpecialties([]);
    setSelectedType('all');
  };

  const filteredClinics = useMemo(() => {
    return clinics.filter(clinic => {
      const facilityName = clinic.facility?.name || '';
      const facilityAddress = clinic.facility?.address || '';
      const specialtyName = clinic.specialty?.name || clinic.name;
      const room = clinic.roomNumber || '';

      // 1. Text search
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim();
        const matchName = clinic.name.toLowerCase().includes(q);
        const matchFacility = facilityName.toLowerCase().includes(q) || facilityAddress.toLowerCase().includes(q);
        const matchSpec = specialtyName.toLowerCase().includes(q);
        const matchRoom = room.toLowerCase().includes(q) || `phòng ${room}`.toLowerCase().includes(q);
        const matchDoc = clinic.doctors.some(d => d.user.fullName.toLowerCase().includes(q));

        if (!matchName && !matchFacility && !matchSpec && !matchRoom && !matchDoc) {
          return false;
        }
      }

      // 2. City / Facility filter
      if (selectedCities.length > 0) {
        const isHanoi = facilityName.toLowerCase().includes('hà nội') || facilityAddress.toLowerCase().includes('hà nội');
        const isHcm = facilityName.toLowerCase().includes('sài gòn') || 
                      facilityName.toLowerCase().includes('hồ chí minh') || 
                      facilityAddress.toLowerCase().includes('hồ chí minh');

        const matchesCity = (isHanoi && selectedCities.includes('Hà Nội')) ||
                            (isHcm && selectedCities.includes('TP. Hồ Chí Minh'));
        if (!matchesCity) return false;
      }

      // 3. Specialty filter
      if (selectedSpecialties.length > 0) {
        const matchesSpec = selectedSpecialties.some(s => 
          specialtyName.toLowerCase().includes(s.toLowerCase()) || 
          clinic.name.toLowerCase().includes(s.toLowerCase())
        );
        if (!matchesSpec) return false;
      }

      // 4. Type filter (Tiêu chuẩn / VIP)
      if (selectedType !== 'all') {
        if (selectedType === 'VIP' && clinic.type !== 'VIP') return false;
        if (selectedType === 'Tiêu chuẩn' && clinic.type === 'VIP') return false;
      }

      return true;
    });
  }, [clinics, searchTerm, selectedCities, selectedSpecialties, selectedType]);

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      
      {/* ==========================================
          LEFT: FILTER SIDEBAR
      ========================================== */}
      <div className="w-full lg:w-1/4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 sticky top-24">
          <div className="flex items-center justify-between font-bold text-lg mb-6 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2 text-gray-900">
              <Filter size={20} className="text-blue-600" />
              Bộ lọc phòng khám
            </div>
            {(searchTerm || selectedCities.length > 0 || selectedSpecialties.length > 0 || selectedType !== 'all') && (
              <button 
                onClick={handleResetFilters}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
              >
                Đặt lại
              </button>
            )}
          </div>

          {/* Cơ sở Bệnh viện */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex justify-between items-center text-sm">
              Cơ sở Bệnh viện <ChevronDown size={16} />
            </h3>
            <div className="space-y-2">
              {CITIES.map((city) => (
                <label key={city.id} className="flex items-center gap-3 cursor-pointer group select-none">
                  <input 
                    type="checkbox" 
                    checked={selectedCities.includes(city.id)}
                    onChange={() => handleToggleCity(city.id)}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer" 
                  />
                  <span className="text-gray-600 group-hover:text-blue-600 transition-colors text-sm">
                    {city.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Loại phòng khám */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex justify-between items-center text-sm">
              Loại phòng khám <ChevronDown size={16} />
            </h3>
            <div className="space-y-2">
              {[
                { id: 'all', label: 'Tất cả các loại phòng' },
                { id: 'Tiêu chuẩn', label: 'Phòng khám Tiêu chuẩn' },
                { id: 'VIP', label: 'Phòng khám VIP' }
              ].map((t) => (
                <label key={t.id} className="flex items-center gap-3 cursor-pointer group select-none">
                  <input 
                    type="radio" 
                    name="clinicType"
                    checked={selectedType === t.id}
                    onChange={() => setSelectedType(t.id)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer" 
                  />
                  <span className="text-gray-600 group-hover:text-blue-600 transition-colors text-sm">
                    {t.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Chuyên khoa */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex justify-between items-center text-sm">
              Chuyên khoa phụ trách <ChevronDown size={16} />
            </h3>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-2 custom-scrollbar">
              {availableSpecialties.map((spec, idx) => (
                <label key={idx} className="flex items-center gap-3 cursor-pointer group select-none">
                  <input 
                    type="checkbox" 
                    checked={selectedSpecialties.includes(spec)}
                    onChange={() => handleToggleSpecialty(spec)}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer" 
                  />
                  <span className="text-gray-600 group-hover:text-blue-600 transition-colors text-sm">{spec}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Nút Xóa bộ lọc */}
          <button 
            type="button"
            onClick={handleResetFilters}
            className="w-full bg-blue-50 text-blue-700 font-bold py-2.5 rounded-xl hover:bg-blue-100 transition-colors text-sm"
          >
            Xóa bộ lọc
          </button>
        </div>
      </div>

      {/* ==========================================
          RIGHT: LIST CLINICS
      ========================================== */}
      <div className="w-full lg:w-3/4">
        
        {/* Search Bar */}
        <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 flex items-center mb-6">
          <div className="flex-1 flex items-center px-4">
            <Search className="text-gray-400" size={20} />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tên phòng khám, chuyên khoa, số phòng, cơ sở..." 
              className="w-full bg-transparent border-none focus:ring-0 px-3 py-2.5 text-gray-700 outline-none text-sm sm:text-base placeholder:text-gray-400"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="text-gray-400 hover:text-gray-600 p-1"
                title="Xóa tìm kiếm"
              >
                <X size={18} />
              </button>
            )}
          </div>
          <button 
            type="button"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl transition-colors shrink-0 text-sm"
          >
            Tìm kiếm
          </button>
        </div>

        {/* Search Results Summary */}
        <div className="flex justify-between items-center mb-4 text-sm text-gray-600 px-1">
          <span>
            Tìm thấy <strong className="text-blue-600 font-bold">{filteredClinics.length}</strong> phòng khám
            {searchTerm && <span> với từ khóa &quot;<strong className="text-gray-900">{searchTerm}</strong>&quot;</span>}
          </span>
          {(searchTerm || selectedSpecialties.length > 0 || selectedCities.length > 0 || selectedType !== 'all') && (
            <button 
              onClick={handleResetFilters}
              className="text-blue-600 hover:underline font-medium text-xs"
            >
              Xem tất cả ({clinics.length}) phòng khám
            </button>
          )}
        </div>

        {/* Empty state */}
        {filteredClinics.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm my-6">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Không tìm thấy phòng khám phù hợp</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6 text-sm">
              Không có phòng khám nào khớp với từ khóa &quot;<strong>{searchTerm}</strong>&quot; hoặc bộ lọc đã chọn.
            </p>
            <button 
              onClick={handleResetFilters}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl transition-colors text-sm shadow-md shadow-blue-200"
            >
              Hiển thị lại toàn bộ phòng khám
            </button>
          </div>
        ) : (
          /* Clinic Items List */
          <div className="space-y-6">
            {filteredClinics.map((clinic) => {
              const specName = clinic.specialty?.name || 'Đa khoa';
              const isVip = clinic.type === 'VIP' || clinic.name.includes('VIP');
              const image = isVip ? CLINIC_IMAGES['VIP'] : (CLINIC_IMAGES[specName] || CLINIC_IMAGES['default']);
              const isHcm = clinic.facility.name.includes('Sài Gòn') || (clinic.facility.address?.includes('Hồ Chí Minh') ?? false);
              const doctors = clinic.doctors || [];
              const priceDisplay = isVip ? '300.000đ' : '150.000đ';

              return (
                <div 
                  key={clinic.id} 
                  className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-100 transition-all flex flex-col sm:flex-row gap-6 group"
                >
                  {/* Image with badges */}
                  <div className="w-full sm:w-60 h-52 sm:h-auto rounded-xl overflow-hidden relative shrink-0 bg-gray-100 block">
                    <Link href={`/landing/phong-kham/${clinic.id}`} className="block w-full h-full">
                      <img 
                        src={image} 
                        alt={clinic.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    </Link>
                    
                    {/* Badge: Phòng VIP or Chuyên khoa */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                      {isVip ? (
                        <span className="bg-amber-500 text-white px-2.5 py-1 rounded-lg text-xs font-black shadow flex items-center gap-1">
                          <Sparkles size={12} /> PHÒNG VIP
                        </span>
                      ) : (
                        <span className="bg-blue-600 text-white px-2.5 py-1 rounded-lg text-xs font-bold shadow">
                          {specName}
                        </span>
                      )}
                      {clinic.roomNumber && (
                        <span className="bg-white/95 backdrop-blur text-gray-800 px-2 py-0.5 rounded text-[11px] font-bold shadow-sm w-fit">
                          Phòng {clinic.roomNumber}
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-3 right-3 bg-gray-900/75 backdrop-blur text-white px-2 py-0.5 rounded text-[11px] font-medium">
                      {isHcm ? 'TP.HCM' : 'Hà Nội'}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      {/* Title & Rating */}
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                        <div>
                          <Link href={`/landing/phong-kham/${clinic.id}`}>
                            <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors cursor-pointer flex items-center gap-2">
                              {clinic.name}
                              {isVip && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded font-bold">Chăm sóc đặc biệt</span>}
                            </h2>
                          </Link>
                          <div className="flex items-center gap-2 text-sm text-blue-600 font-semibold mt-1">
                            <Building2 size={16} /> {clinic.facility.name}
                          </div>
                        </div>

                        <div className="flex items-center gap-1 bg-orange-50 text-orange-600 px-2.5 py-1 rounded-lg text-sm font-bold shrink-0 w-fit">
                          <Star size={16} fill="currentColor" />
                          4.9
                        </div>
                      </div>

                      {/* Address */}
                      <p className="text-gray-500 text-sm flex items-start gap-1.5 my-2.5 leading-relaxed">
                        <MapPin size={16} className="text-gray-400 shrink-0 mt-0.5" />
                        {clinic.facility.address}
                      </p>

                      {/* Features */}
                      <div className="flex flex-wrap gap-2 my-3">
                        <span className="flex items-center gap-1 bg-green-50 text-green-700 px-2.5 py-1 rounded-md text-xs font-medium">
                          <CheckCircle2 size={12} /> Khám BHYT
                        </span>
                        <span className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-xs font-medium">
                          <Clock size={12} /> Hẹn giờ chính xác
                        </span>
                        <span className="flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md text-xs font-medium">
                          <ShieldCheck size={12} /> Trang thiết bị chuẩn Bộ Y Tế
                        </span>
                      </div>

                      {/* Doctors working here */}
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                          <Users size={14} className="text-blue-600" />
                          <span className="font-semibold text-gray-700">Đội ngũ bác sĩ phụ trách:</span>
                          {doctors.length > 0 ? (
                            <span className="text-blue-600 font-bold">{doctors.length} Bác sĩ</span>
                          ) : (
                            <span className="text-gray-500">Bác sĩ luân phiên theo ca</span>
                          )}
                        </div>

                        {doctors.length > 0 ? (
                          <div className="flex flex-wrap items-center gap-2">
                            {doctors.map(d => (
                              <Link 
                                key={d.id} 
                                href={`/landing/bac-si/${d.id}`}
                                className="inline-flex items-center gap-1.5 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 text-gray-700 hover:text-blue-700 text-xs px-2.5 py-1 rounded-full transition-colors font-medium"
                              >
                                <img 
                                  src={d.user.avatar || DOCTOR_AVATAR_FALLBACK} 
                                  alt={d.user.fullName} 
                                  className="w-4 h-4 rounded-full object-cover" 
                                />
                                <span>BS. {d.user.fullName}</span>
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-gray-400 italic">
                            Các bác sĩ chuyên khoa phụ trách theo lịch phân công hằng ngày của viện.
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Bottom Action */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-5 pt-4 border-t border-gray-100">
                      <div className="flex items-baseline gap-1.5 w-full sm:w-auto">
                        <span className="text-xs text-gray-400">Giá khám niêm yết:</span>
                        <span className="text-lg font-black text-blue-600">
                          {priceDisplay}
                        </span>
                      </div>

                      <div className="flex gap-3 w-full sm:w-auto">
                        <Link 
                          href={`/landing/phong-kham/${clinic.id}`} 
                          className="flex-1 sm:flex-none border border-blue-600 text-blue-600 font-bold py-2.5 px-5 rounded-xl hover:bg-blue-50 transition-colors text-center text-sm"
                        >
                          Chi tiết phòng khám
                        </Link>
                        <Link 
                          href={bookingLink} 
                          className="flex-1 sm:flex-none bg-blue-600 text-white font-bold py-2.5 px-6 rounded-xl hover:bg-blue-700 transition-colors text-center text-sm shadow-md shadow-blue-200"
                        >
                          Đặt lịch ngay
                        </Link>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

    </div>
  );
}
