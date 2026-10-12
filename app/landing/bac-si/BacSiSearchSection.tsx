'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, MapPin, Star, CheckCircle2, ChevronDown, Filter, X, 
  Award, Briefcase, DollarSign, Calendar
} from 'lucide-react';

interface Doctor {
  id: number;
  userId: number;
  degree?: string | null;
  experience?: string | null;
  bio?: string | null;
  price?: number | null;
  user: {
    id: number;
    fullName: string;
    avatar?: string | null;
    phone?: string | null;
    address?: string | null;
  };
  specialty?: {
    id: number;
    name: string;
  } | null;
  department?: {
    id: number;
    name: string;
  } | null;
  clinics?: {
    id: number;
    name: string;
    facility?: {
      id: number;
      name: string;
      address?: string | null;
    } | null;
  }[];
}

interface Props {
  doctors: Doctor[];
  bookingLink: string;
}

const DOCTOR_AVATARS = [
  '/images/doctors/doctor-3.jpg',
];

const CITIES = ['Hà Nội', 'TP. Hồ Chí Minh'];
const SPECIALTIES = ['Tim mạch', 'Da liễu', 'Răng hàm mặt', 'Mắt', 'Đa khoa', 'Nội tổng quát', 'Cơ xương khớp'];

export default function BacSiSearchSection({ doctors, bookingLink }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);

  const handleToggleCity = (city: string) => {
    setSelectedCities(prev => 
      prev.includes(city) ? prev.filter(c => c !== city) : [...prev, city]
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
  };

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doctor) => {
      const specialtyName = doctor.specialty?.name || doctor.department?.name || 'Đa khoa';
      const userAddr = doctor.user.address?.toLowerCase() || '';
      const isHcmDoctor = userAddr.includes('hồ chí minh') || userAddr.includes('hcm') || userAddr.includes('sài gòn') || doctor.id >= 10;

      const facilityName = doctor.clinics?.[0]?.facility?.name || (isHcmDoctor ? 'MediCare Clinic Sài Gòn' : 'MediCare Clinic Hà Nội');
      const facilityAddress = doctor.clinics?.[0]?.facility?.address || (isHcmDoctor ? 'Quận 1, TP. Hồ Chí Minh' : 'Cầu Giấy, Hà Nội');

      // 1. Text search
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim();
        const matchName = doctor.user.fullName.toLowerCase().includes(q);
        const matchSpec = specialtyName.toLowerCase().includes(q);
        const matchDegree = doctor.degree?.toLowerCase().includes(q) || false;
        const matchFacility = facilityName.toLowerCase().includes(q) || 
                              facilityAddress.toLowerCase().includes(q) ||
                              userAddr.includes(q) ||
                              ((q.includes('hcm') || q.includes('hồ chí minh') || q.includes('sài gòn')) && isHcmDoctor);

        if (!matchName && !matchSpec && !matchDegree && !matchFacility) {
          return false;
        }
      }

      // 2. City filter (Hỗ trợ lọc chính xác cả Hà Nội và TP.HCM / Sài Gòn)
      if (selectedCities.length > 0) {
        const isHanoi = facilityName.toLowerCase().includes('hà nội') || 
                        facilityAddress.toLowerCase().includes('hà nội') ||
                        userAddr.includes('hà nội') ||
                        (!isHcmDoctor);
        const isHcm = isHcmDoctor ||
                      facilityName.toLowerCase().includes('sài gòn') || 
                      facilityName.toLowerCase().includes('hồ chí minh') || 
                      facilityName.toLowerCase().includes('tp.hcm') ||
                      facilityAddress.toLowerCase().includes('hồ chí minh') ||
                      facilityAddress.toLowerCase().includes('sài gòn') ||
                      userAddr.includes('hồ chí minh') ||
                      userAddr.includes('hcm') ||
                      userAddr.includes('sài gòn');

        const matchesCity = (isHanoi && selectedCities.includes('Hà Nội')) ||
                            (isHcm && selectedCities.includes('TP. Hồ Chí Minh'));
        if (!matchesCity) return false;
      }

      // 3. Specialty filter
      if (selectedSpecialties.length > 0) {
        const matchesSpec = selectedSpecialties.some(s => specialtyName.toLowerCase().includes(s.toLowerCase()));
        if (!matchesSpec) return false;
      }

      return true;
    });
  }, [doctors, searchTerm, selectedCities, selectedSpecialties]);

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      
      {/* LEFT: FILTER SIDEBAR */}
      <div className="w-full lg:w-1/4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 sticky top-24">
          <div className="flex items-center justify-between font-bold text-lg mb-6 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-blue-600" />
              Bộ lọc tìm kiếm
            </div>
            {(searchTerm || selectedCities.length > 0 || selectedSpecialties.length > 0) && (
              <button 
                onClick={handleResetFilters}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
              >
                Đặt lại
              </button>
            )}
          </div>

          {/* Cơ sở bệnh viện */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex justify-between items-center text-sm">
              Cơ sở Bệnh viện <ChevronDown size={16} />
            </h3>
            <div className="space-y-2">
              {CITIES.map((city, idx) => (
                <label key={idx} className="flex items-center gap-3 cursor-pointer group select-none">
                  <input 
                    type="checkbox" 
                    checked={selectedCities.includes(city)}
                    onChange={() => handleToggleCity(city)}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer" 
                  />
                  <span className="text-gray-600 group-hover:text-blue-600 transition-colors text-sm">
                    {city === 'Hà Nội' ? 'MediCare Hà Nội' : 'MediCare TP.HCM'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Chuyên khoa */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex justify-between items-center text-sm">
              Chuyên khoa <ChevronDown size={16} />
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
                  <span className="text-gray-600 group-hover:text-blue-600 transition-colors text-sm">{spec}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Action: Xóa bộ lọc */}
          <button 
            type="button"
            onClick={handleResetFilters}
            className="w-full bg-blue-50 text-blue-700 font-bold py-2.5 rounded-xl hover:bg-blue-100 transition-colors text-sm"
          >
            Xóa bộ lọc
          </button>
        </div>
      </div>

      {/* RIGHT: LIST DOCTORS */}
      <div className="w-full lg:w-3/4">
        
        {/* Search Bar */}
        <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 flex items-center mb-6">
          <div className="flex-1 flex items-center px-4">
            <Search className="text-gray-400" size={20} />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm tên bác sĩ, chuyên khoa, cơ sở..." 
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

        {/* Search info */}
        <div className="flex justify-between items-center mb-4 text-sm text-gray-600 px-1">
          <span>
            Tìm thấy <strong className="text-blue-600 font-bold">{filteredDoctors.length}</strong> bác sĩ
            {searchTerm && <span> với từ khóa &quot;<strong className="text-gray-900">{searchTerm}</strong>&quot;</span>}
          </span>
          {(searchTerm || selectedSpecialties.length > 0 || selectedCities.length > 0) && (
            <button 
              onClick={handleResetFilters}
              className="text-blue-600 hover:underline font-medium text-xs"
            >
              Xem tất cả bác sĩ
            </button>
          )}
        </div>

        {/* Empty state */}
        {filteredDoctors.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm my-6">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Không tìm thấy bác sĩ phù hợp</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6 text-sm">
              Không có bác sĩ nào khớp với từ khóa &quot;<strong>{searchTerm}</strong>&quot; hoặc bộ lọc đã chọn.
            </p>
            <button 
              onClick={handleResetFilters}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl transition-colors text-sm shadow-md shadow-blue-200"
            >
              Hiển thị lại toàn bộ danh sách
            </button>
          </div>
        ) : (
          /* Doctors List */
          <div className="space-y-6">
            {filteredDoctors.map((doctor, idx) => {
              const avatar = doctor.user.avatar || DOCTOR_AVATARS[idx % DOCTOR_AVATARS.length];
              const specialtyName = doctor.specialty?.name || doctor.department?.name || 'Đa khoa';
              const degree = doctor.degree || 'Bác sĩ chuyên khoa';
              const exp = doctor.experience ? (doctor.experience.includes('năm') ? doctor.experience : `${doctor.experience} năm kinh nghiệm`) : 'Nhiều năm kinh nghiệm';
              const userAddr = doctor.user.address?.toLowerCase() || '';
              const isHcmDoctor = userAddr.includes('hồ chí minh') || userAddr.includes('hcm') || userAddr.includes('sài gòn') || doctor.id >= 10;
              const facilityName = doctor.clinics?.[0]?.facility?.name || (isHcmDoctor ? 'MediCare Clinic Sài Gòn' : 'MediCare Clinic Hà Nội');
              const price = doctor.price ? `${doctor.price.toLocaleString('vi-VN')}đ` : '150.000đ';
              const bio = doctor.bio || `Bác sĩ chuyên khoa giàu kinh nghiệm trong lĩnh vực ${specialtyName}, công tác tại hệ thống phòng khám bệnh viện MediCare.`;

              return (
                <div key={doctor.id} className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-all flex flex-col sm:flex-row gap-6 group">
                  {/* Image */}
                  <Link 
                    href={`/landing/bac-si/${doctor.id}`}
                    className="w-full sm:w-40 h-40 sm:h-auto shrink-0 flex flex-col items-center cursor-pointer"
                  >
                    <div className="w-32 h-32 rounded-full overflow-hidden mb-3 border-4 border-blue-50 shadow-sm relative group-hover:scale-105 transition-transform duration-300">
                      <img src={avatar} alt={doctor.user.fullName} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-xs bg-blue-50 text-blue-700 font-bold px-2.5 py-1 rounded-full text-center">
                      {degree}
                    </span>
                  </Link>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <div>
                          <Link href={`/landing/bac-si/${doctor.id}`}>
                            <h2 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer flex items-center gap-2">
                              {doctor.user.fullName}
                            </h2>
                          </Link>
                          <div className="flex items-center gap-2 text-sm text-blue-600 font-semibold mt-0.5">
                            <Briefcase size={16} /> {specialtyName}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 bg-orange-50 text-orange-600 px-2.5 py-1 rounded-lg text-sm font-bold w-fit">
                          <Star size={16} fill="currentColor" />
                          5.0
                        </div>
                      </div>

                      {/* Location & Experience */}
                      <div className="space-y-1.5 my-3 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <MapPin size={16} className="text-gray-400 shrink-0" />
                          <span className="font-medium text-gray-800">{facilityName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Award size={16} className="text-gray-400 shrink-0" />
                          <span>{exp}</span>
                        </div>
                      </div>

                      <p className="text-gray-500 text-sm line-clamp-2 mb-4 leading-relaxed">
                        {bio}
                      </p>
                    </div>

                    {/* Bottom Action */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100">
                      <div className="flex items-baseline gap-1.5 w-full sm:w-auto">
                        <span className="text-xs text-gray-400">Giá khám từ:</span>
                        <span className="text-lg font-black text-blue-600 flex items-center">
                          {price}
                        </span>
                      </div>

                      <div className="flex gap-3 w-full sm:w-auto">
                        <Link 
                          href={`/landing/bac-si/${doctor.id}`}
                          className="flex-1 sm:flex-none border border-blue-600 text-blue-600 font-bold py-2.5 px-5 rounded-xl hover:bg-blue-50 transition-colors text-center text-sm"
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
