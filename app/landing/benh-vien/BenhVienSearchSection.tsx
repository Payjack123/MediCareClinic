'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, MapPin, Star, CheckCircle2, ChevronDown, Filter, X, 
  Building2, Phone, Clock, ShieldCheck, Stethoscope
} from 'lucide-react';

interface Clinic {
  id: number;
  name: string;
  specialty?: {
    id: number;
    name: string;
  } | null;
}

interface Facility {
  id: number;
  name: string;
  address: string | null;
  phone?: string | null;
  description?: string | null;
  clinics: Clinic[];
}

interface Props {
  facilities: Facility[];
  bookingLink: string;
}

const FACILITY_METADATA: Record<number, { image: string; type: string; city: string; features: string[]; hotline: string; hours: string; intro: string }> = {
  1: {
    image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    type: 'Bệnh viện Đa khoa Trụ sở chính',
    city: 'Hà Nội',
    hotline: '0941.298.865',
    hours: 'Thứ 2 - Thứ 7: 07:30 - 17:00 (Ngoại trú & Cấp cứu 24/7)',
    intro: 'Cơ sở trụ sở chính của Hệ thống Y tế MediCare tại Hà Nội với quy mô lớn, hệ thống trang thiết bị nhập khẩu từ Đức, Mỹ và Nhật Bản, phục vụ chẩn đoán và điều trị chất lượng cao.',
    features: ['Nội tổng quát', 'Tim mạch', 'Cơ xương khớp', 'Da liễu', 'Khám BHYT & VIP']
  },
  2: {
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    type: 'Bệnh viện & Trung tâm Kỹ thuật cao',
    city: 'TP. Hồ Chí Minh',
    hotline: '0941.298.866',
    hours: 'Thứ 2 - Thứ 7: 07:30 - 17:00 (Khám chuyên gia theo hẹn)',
    intro: 'Bệnh viện và Trung tâm Y tế Kỹ thuật cao MediCare tại TP. Hồ Chí Minh nằm ở vị trí trung tâm Quận 1, cung cấp dịch vụ y tế chuẩn mực quốc tế với đội ngũ bác sĩ đầu ngành.',
    features: ['Chuyên khoa Tim mạch', 'Nội tổng quát', 'Mắt', 'Răng hàm mặt', 'Khám BHYT & VIP']
  }
};

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80';

const CITIES = [
  { id: 'Hà Nội', label: 'Hà Nội (Trụ sở chính)' },
  { id: 'TP. Hồ Chí Minh', label: 'TP. Hồ Chí Minh' }
];

const SPECIALTIES = [
  'Nội tổng quát',
  'Tim mạch',
  'Da liễu',
  'Răng hàm mặt',
  'Mắt',
  'Cơ xương khớp'
];

export default function BenhVienSearchSection({ facilities, bookingLink }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCities, setSelectedCities] = useState<string[]>(['Hà Nội', 'TP. Hồ Chí Minh']);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);

  // Toggle city checkbox
  const handleToggleCity = (cityId: string) => {
    setSelectedCities(prev => 
      prev.includes(cityId) ? prev.filter(c => c !== cityId) : [...prev, cityId]
    );
  };

  // Toggle specialty checkbox
  const handleToggleSpecialty = (spec: string) => {
    setSelectedSpecialties(prev => 
      prev.includes(spec) ? prev.filter(s => s !== spec) : [...prev, spec]
    );
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCities(['Hà Nội', 'TP. Hồ Chí Minh']);
    setSelectedSpecialties([]);
  };

  // Filter facilities
  const filteredFacilities = useMemo(() => {
    return facilities.filter(hospital => {
      const meta = FACILITY_METADATA[hospital.id] || {
        city: hospital.address?.includes('Hà Nội') ? 'Hà Nội' : 'TP. Hồ Chí Minh',
        features: []
      };

      // 1. Text search
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim();
        const matchName = hospital.name.toLowerCase().includes(query);
        const matchAddress = hospital.address ? hospital.address.toLowerCase().includes(query) : false;
        const matchCity = meta.city ? meta.city.toLowerCase().includes(query) : false;
        const matchClinic = hospital.clinics.some(c => 
          c.name.toLowerCase().includes(query) || 
          (c.specialty?.name && c.specialty.name.toLowerCase().includes(query))
        );
        const matchFeature = meta.features.some(f => f.toLowerCase().includes(query));

        if (!matchName && !matchAddress && !matchCity && !matchClinic && !matchFeature) {
          return false;
        }
      }

      // 2. City filter
      if (selectedCities.length > 0) {
        const isHanoi = hospital.address?.includes('Hà Nội') || meta.city.includes('Hà Nội');
        const isHcm = hospital.address?.includes('Hồ Chí Minh') || hospital.address?.includes('Sài Gòn') || meta.city.includes('Hồ Chí Minh');
        
        const matchesCity = (isHanoi && selectedCities.includes('Hà Nội')) || 
                            (isHcm && selectedCities.includes('TP. Hồ Chí Minh'));
        if (!matchesCity) return false;
      } else {
        return false;
      }

      // 3. Specialty filter
      if (selectedSpecialties.length > 0) {
        const hospitalSpecs = [
          ...hospital.clinics.map(c => c.specialty?.name).filter(Boolean),
          ...meta.features
        ];
        const hasAnySelected = selectedSpecialties.some(s => 
          hospitalSpecs.some(hs => hs && hs.toLowerCase().includes(s.toLowerCase()))
        );
        if (!hasAnySelected) return false;
      }

      return true;
    });
  }, [facilities, searchTerm, selectedCities, selectedSpecialties]);

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      
      {/* LEFT: FILTER SIDEBAR */}
      <div className="w-full lg:w-1/4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 sticky top-24">
          <div className="flex items-center justify-between font-bold text-lg mb-6 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-blue-600" />
              Khu vực & Cơ sở
            </div>
            {(searchTerm || selectedCities.length < 2 || selectedSpecialties.length > 0) && (
              <button 
                onClick={handleResetFilters}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
              >
                Đặt lại
              </button>
            )}
          </div>

          {/* Khu vực cơ sở */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex justify-between items-center text-sm">
              Khu vực cơ sở <ChevronDown size={16} />
            </h3>
            <div className="space-y-2">
              {CITIES.map(city => (
                <label key={city.id} className="flex items-center gap-3 cursor-pointer group select-none">
                  <input 
                    type="checkbox" 
                    checked={selectedCities.includes(city.id)}
                    onChange={() => handleToggleCity(city.id)}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer" 
                  />
                  <span className="text-gray-600 group-hover:text-blue-600 transition-colors font-medium text-sm">
                    {city.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Chuyên khoa nổi bật */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex justify-between items-center text-sm">
              Chuyên khoa nổi bật <ChevronDown size={16} />
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              {SPECIALTIES.map((spec, idx) => (
                <label key={idx} className="flex items-center gap-3 cursor-pointer group select-none">
                  <input 
                    type="checkbox" 
                    checked={selectedSpecialties.includes(spec)}
                    onChange={() => handleToggleSpecialty(spec)}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer" 
                  />
                  <span className="text-gray-600 group-hover:text-blue-600 transition-colors text-sm">
                    {spec}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Action: Đặt khám nhanh */}
          <Link 
            href={bookingLink} 
            className="w-full bg-blue-50 text-blue-700 font-bold py-2.5 rounded-xl hover:bg-blue-100 transition-colors block text-center text-sm shadow-sm"
          >
            Đặt khám ngay
          </Link>
        </div>
      </div>

      {/* RIGHT: LIST HOSPITALS & SEARCH */}
      <div className="w-full lg:w-3/4">
        
        {/* Search Bar - Client Search */}
        <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 flex items-center mb-6">
          <div className="flex-1 flex items-center px-4">
            <Search className="text-gray-400" size={20} />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tên bệnh viện hoặc cơ sở MediCare (Hà Nội, Sài Gòn, chuyên khoa...)" 
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
            onClick={() => {
              // Trigger explicit search notification if needed
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl transition-colors shrink-0 text-sm"
          >
            Tìm kiếm
          </button>
        </div>

        {/* Kết quả tìm kiếm header */}
        <div className="flex justify-between items-center mb-4 text-sm text-gray-600 px-1">
          <span>
            Hiển thị <strong className="text-blue-600 font-bold">{filteredFacilities.length}</strong> cơ sở bệnh viện MediCare
            {searchTerm && <span> cho từ khóa &quot;<strong className="text-gray-900">{searchTerm}</strong>&quot;</span>}
          </span>
          {(searchTerm || selectedSpecialties.length > 0 || selectedCities.length < 2) && (
            <button 
              onClick={handleResetFilters}
              className="text-blue-600 hover:underline font-medium text-xs"
            >
              Xem tất cả cơ sở
            </button>
          )}
        </div>

        {/* Empty State */}
        {filteredFacilities.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm my-6">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Không tìm thấy cơ sở bệnh viện phù hợp</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6 text-sm">
              Không có bệnh viện nào khớp với từ khóa &quot;<strong>{searchTerm}</strong>&quot; hoặc bộ lọc khu vực/chuyên khoa đã chọn.
            </p>
            <button 
              onClick={handleResetFilters}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl transition-colors text-sm shadow-md shadow-blue-200"
            >
              Hiển thị lại 2 bệnh viện MediCare
            </button>
          </div>
        ) : (
          /* Hospital Items */
          <div className="space-y-6">
            {filteredFacilities.map((hospital, index) => {
              const meta = FACILITY_METADATA[hospital.id] || {
                image: DEFAULT_IMAGE,
                type: 'Bệnh viện MediCare',
                features: ['Đa khoa', 'Chuyên khoa sâu', 'Khám BHYT']
              };
              const clinicsCount = hospital.clinics.length || (index === 0 ? 8 : 7);

              return (
                <div key={hospital.id} className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-all flex flex-col sm:flex-row gap-6 group">
                  {/* Image */}
                  <Link 
                    href={`/landing/benh-vien/${hospital.id}`}
                    className="w-full sm:w-56 h-48 rounded-xl overflow-hidden relative shrink-0 block cursor-pointer"
                  >
                    <img 
                      src={meta.image} 
                      alt={hospital.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute top-2 left-2 text-white px-2.5 py-1 rounded-md text-xs font-bold shadow bg-blue-600">
                      {meta.type}
                    </div>
                  </Link>
                  
                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <Link href={`/landing/benh-vien/${hospital.id}`}>
                          <h2 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer">
                            {hospital.name}
                          </h2>
                        </Link>
                        <div className="flex items-center gap-1 bg-orange-50 text-orange-600 px-2 py-1 rounded-lg text-sm font-bold shrink-0">
                          <Star size={16} fill="currentColor" />
                          4.9
                        </div>
                      </div>

                      <p className="text-gray-500 text-sm flex items-start gap-1.5 mb-3">
                        <MapPin size={16} className="text-blue-500 shrink-0 mt-0.5" />
                        {hospital.address}
                      </p>

                      <div className="mb-4">
                        <span className="text-sm font-semibold text-gray-700 mr-2">Quy mô:</span>
                        <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-2 py-1 rounded-md mr-3">
                          {clinicsCount} Chuyên khoa & Phòng khám
                        </span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {meta.features.map((feature, idx) => (
                            <span key={idx} className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-xs font-medium">
                              <CheckCircle2 size={12} /> {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 pt-4 border-t border-gray-100">
                      <div className="text-sm text-gray-500">
                        <span className="font-semibold text-gray-900">100%</span> Bác sĩ được cấp chứng chỉ hành nghề
                      </div>
                      <div className="flex gap-3 w-full sm:w-auto">
                        <Link 
                          href={`/landing/benh-vien/${hospital.id}`}
                          className="flex-1 sm:flex-none border border-blue-600 text-blue-600 font-bold py-2.5 px-6 rounded-xl hover:bg-blue-50 transition-colors text-center text-sm"
                        >
                          Xem thông tin
                        </Link>
                        <Link 
                          href={bookingLink} 
                          className="flex-1 sm:flex-none bg-blue-600 text-white font-bold py-2.5 px-6 rounded-xl hover:bg-blue-700 transition-colors text-center text-sm shadow-md shadow-blue-200"
                        >
                          Đặt lịch khám
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
