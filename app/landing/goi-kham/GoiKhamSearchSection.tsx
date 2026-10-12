'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, MapPin, Star, CheckCircle2, ChevronDown, Filter, X, 
  Building2, Users, Clock, ShieldCheck, HeartPulse, ChevronRight,
  Sparkles, Tag, ArrowRight
} from 'lucide-react';

interface Facility {
  id: number;
  name: string;
  address: string | null;
}

interface HealthPackage {
  id: number;
  code: string;
  name: string;
  category: string;
  price: number;
  oldPrice?: number | null;
  discount?: string | null;
  description?: string | null;
  targetGender?: string | null;
  targetAge?: string | null;
  features: any;
  details: any;
  image?: string | null;
  status: string;
  facilityId?: number | null;
  facility?: Facility | null;
}

interface Props {
  packages: HealthPackage[];
  facilities: Facility[];
  bookingLink: string;
}

const CATEGORIES = [
  'Tất cả',
  'Khám tổng quát',
  'Tầm soát ung thư',
  'Khám VIP',
  'Khám tim mạch',
  'Khám tiền hôn nhân',
  'Khám nhi khoa',
  'Cơ xương khớp'
];

const PRICE_RANGES = [
  { id: 'all', label: 'Tất cả mức giá' },
  { id: 'under2m', label: 'Dưới 2.000.000đ' },
  { id: '2m-4m', label: '2.000.000đ - 4.000.000đ' },
  { id: 'above4m', label: 'Trên 4.000.000đ' }
];

const GENDERS = [
  { id: 'all', label: 'Mọi đối tượng' },
  { id: 'Nam', label: 'Dành riêng cho Nam' },
  { id: 'Nữ', label: 'Dành riêng cho Nữ' }
];

const CITIES = [
  { id: 'all', label: 'Tất cả cơ sở (Hà Nội & TP.HCM)' },
  { id: 'Hà Nội', label: 'MediCare Hà Nội' },
  { id: 'TP. Hồ Chí Minh', label: 'MediCare TP.HCM' }
];

export default function GoiKhamSearchSection({ packages, facilities, bookingLink }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [selectedGender, setSelectedGender] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('Tất cả');
    setSelectedPriceRange('all');
    setSelectedGender('all');
    setSelectedCity('all');
  };

  const filteredPackages = useMemo(() => {
    return packages.filter(pkg => {
      // 1. Text search
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim();
        const matchName = pkg.name.toLowerCase().includes(q);
        const matchCode = pkg.code.toLowerCase().includes(q);
        const matchCat = pkg.category.toLowerCase().includes(q);
        const matchDesc = pkg.description?.toLowerCase().includes(q) || false;
        
        let matchFeature = false;
        if (Array.isArray(pkg.features)) {
          matchFeature = pkg.features.some((f: any) => typeof f === 'string' && f.toLowerCase().includes(q));
        }

        if (!matchName && !matchCode && !matchCat && !matchDesc && !matchFeature) {
          return false;
        }
      }

      // 2. Category filter
      if (selectedCategory !== 'Tất cả') {
        if (pkg.category !== selectedCategory) return false;
      }

      // 3. Price range filter
      if (selectedPriceRange !== 'all') {
        if (selectedPriceRange === 'under2m' && pkg.price >= 2000000) return false;
        if (selectedPriceRange === '2m-4m' && (pkg.price < 2000000 || pkg.price > 4000000)) return false;
        if (selectedPriceRange === 'above4m' && pkg.price <= 4000000) return false;
      }

      // 4. Gender filter
      if (selectedGender !== 'all') {
        if (pkg.targetGender !== 'Tất cả' && pkg.targetGender !== selectedGender) {
          return false;
        }
      }

      // 5. City filter
      if (selectedCity !== 'all') {
        if (pkg.facility) {
          const isHanoi = pkg.facility.name.includes('Hà Nội') || pkg.facility.address?.includes('Hà Nội');
          const isHcm = pkg.facility.name.includes('Sài Gòn') || pkg.facility.address?.includes('Hồ Chí Minh');
          if (selectedCity === 'Hà Nội' && !isHanoi) return false;
          if (selectedCity === 'TP. Hồ Chí Minh' && !isHcm) return false;
        }
      }

      return true;
    });
  }, [packages, searchTerm, selectedCategory, selectedPriceRange, selectedGender, selectedCity]);

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
              Bộ lọc gói khám
            </div>
            {(searchTerm || selectedCategory !== 'Tất cả' || selectedPriceRange !== 'all' || selectedGender !== 'all' || selectedCity !== 'all') && (
              <button 
                onClick={handleResetFilters}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
              >
                Đặt lại
              </button>
            )}
          </div>

          {/* Danh mục gói khám */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex justify-between items-center text-sm">
              Danh mục gói khám <ChevronDown size={16} />
            </h3>
            <div className="space-y-1.5">
              {CATEGORIES.map((cat, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all flex items-center justify-between ${
                    selectedCategory === cat 
                      ? 'bg-blue-50 text-blue-700 font-bold' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span>{cat}</span>
                  {selectedCategory === cat && <CheckCircle2 size={16} className="text-blue-600" />}
                </button>
              ))}
            </div>
          </div>

          {/* Mức giá */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex justify-between items-center text-sm">
              Mức giá phù hợp <ChevronDown size={16} />
            </h3>
            <div className="space-y-2">
              {PRICE_RANGES.map((pr) => (
                <label key={pr.id} className="flex items-center gap-3 cursor-pointer group select-none">
                  <input 
                    type="radio" 
                    name="priceRange"
                    checked={selectedPriceRange === pr.id}
                    onChange={() => setSelectedPriceRange(pr.id)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer" 
                  />
                  <span className="text-gray-600 group-hover:text-blue-600 transition-colors text-sm">
                    {pr.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Đối tượng */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex justify-between items-center text-sm">
              Đối tượng áp dụng <ChevronDown size={16} />
            </h3>
            <div className="space-y-2">
              {GENDERS.map((g) => (
                <label key={g.id} className="flex items-center gap-3 cursor-pointer group select-none">
                  <input 
                    type="radio" 
                    name="targetGender"
                    checked={selectedGender === g.id}
                    onChange={() => setSelectedGender(g.id)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer" 
                  />
                  <span className="text-gray-600 group-hover:text-blue-600 transition-colors text-sm">
                    {g.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Cơ sở */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex justify-between items-center text-sm">
              Cơ sở khám <ChevronDown size={16} />
            </h3>
            <div className="space-y-2">
              {CITIES.map((c) => (
                <label key={c.id} className="flex items-center gap-3 cursor-pointer group select-none">
                  <input 
                    type="radio" 
                    name="cityFilter"
                    checked={selectedCity === c.id}
                    onChange={() => setSelectedCity(c.id)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer" 
                  />
                  <span className="text-gray-600 group-hover:text-blue-600 transition-colors text-sm">
                    {c.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Action button */}
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
          RIGHT: LIST HEALTH PACKAGES
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
              placeholder="Tìm theo tên gói khám, mục đích tầm soát, mã gói..." 
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

        {/* Results summary */}
        <div className="flex justify-between items-center mb-4 text-sm text-gray-600 px-1">
          <span>
            Tìm thấy <strong className="text-blue-600 font-bold">{filteredPackages.length}</strong> gói khám sức khỏe
            {searchTerm && <span> với từ khóa &quot;<strong className="text-gray-900">{searchTerm}</strong>&quot;</span>}
          </span>
          {(searchTerm || selectedCategory !== 'Tất cả' || selectedPriceRange !== 'all' || selectedGender !== 'all' || selectedCity !== 'all') && (
            <button 
              onClick={handleResetFilters}
              className="text-blue-600 hover:underline font-medium text-xs"
            >
              Xem tất cả ({packages.length}) gói khám
            </button>
          )}
        </div>

        {/* Empty state */}
        {filteredPackages.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm my-6">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Không tìm thấy gói khám phù hợp</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6 text-sm">
              Không có gói khám nào khớp với từ khóa &quot;<strong>{searchTerm}</strong>&quot; hoặc bộ lọc đã chọn.
            </p>
            <button 
              onClick={handleResetFilters}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl transition-colors text-sm shadow-md shadow-blue-200"
            >
              Hiển thị lại toàn bộ gói khám
            </button>
          </div>
        ) : (
          /* Health Packages List */
          <div className="space-y-6">
            {filteredPackages.map((pkg) => {
              const features = Array.isArray(pkg.features) ? pkg.features : [];
              const isVip = pkg.category.includes('VIP');
              const facilityText = pkg.facility ? pkg.facility.name : 'Áp dụng tại 2 cơ sở (Hà Nội & TP.HCM)';
              const addressText = pkg.facility ? (pkg.facility.address || '') : 'Hệ thống Bệnh viện & Phòng khám MediCare toàn quốc';

              return (
                <div 
                  key={pkg.id}
                  className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-100 transition-all flex flex-col sm:flex-row gap-6 group"
                >
                  {/* Thumbnail */}
                  <div className="w-full sm:w-60 h-52 sm:h-auto rounded-xl overflow-hidden relative shrink-0 bg-gray-100">
                    <Link href={`/landing/goi-kham/${pkg.id}`} className="block w-full h-full">
                      <img 
                        src={pkg.image || 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} 
                        alt={pkg.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    </Link>

                    {/* Top Badges */}
                    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold shadow ${
                        isVip ? 'bg-amber-500 text-white' : 'bg-blue-600 text-white'
                      }`}>
                        {pkg.category}
                      </span>
                      {pkg.targetGender && pkg.targetGender !== 'Tất cả' && (
                        <span className="bg-white/95 backdrop-blur text-gray-800 px-2 py-0.5 rounded text-[11px] font-bold shadow-sm w-fit">
                          Dành cho {pkg.targetGender}
                        </span>
                      )}
                    </div>

                    {pkg.discount && (
                      <div className="absolute top-2.5 right-2.5 bg-red-500 text-white px-2.5 py-0.5 rounded-lg text-xs font-black shadow">
                        {pkg.discount}
                      </div>
                    )}

                    <div className="absolute bottom-2.5 left-2.5 bg-gray-900/75 backdrop-blur text-white px-2 py-0.5 rounded text-[11px] font-medium">
                      Mã: {pkg.code}
                    </div>
                  </div>

                  {/* Info details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      {/* Title */}
                      <Link href={`/landing/goi-kham/${pkg.id}`}>
                        <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors cursor-pointer mb-2 leading-tight">
                          {pkg.name}
                        </h2>
                      </Link>

                      {/* Hospital & Location */}
                      <div className="flex items-center gap-2 mb-2 text-sm text-blue-700 font-semibold">
                        <Building2 size={16} className="shrink-0 text-blue-600" />
                        <span>{facilityText}</span>
                      </div>

                      <p className="text-gray-500 text-xs sm:text-sm flex items-start gap-1.5 mb-3">
                        <MapPin size={15} className="text-gray-400 shrink-0 mt-0.5" />
                        <span>{addressText}</span>
                      </p>

                      {/* Highlights / Features grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1.5 gap-x-3 my-3">
                        {features.slice(0, 4).map((f: any, idx: number) => (
                          <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-gray-700">
                            <CheckCircle2 size={15} className="text-emerald-500 shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{f}</span>
                          </div>
                        ))}
                      </div>

                      {pkg.description && (
                        <p className="text-gray-500 text-xs line-clamp-2 mt-2 leading-relaxed">
                          {pkg.description}
                        </p>
                      )}
                    </div>

                    {/* Bottom Action & Pricing */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-5 pt-4 border-t border-gray-100">
                      <div className="flex flex-col items-start w-full sm:w-auto">
                        {pkg.oldPrice && (
                          <span className="text-xs text-gray-400 line-through">
                            {pkg.oldPrice.toLocaleString('vi-VN')}đ
                          </span>
                        )}
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-black text-blue-600">
                            {pkg.price.toLocaleString('vi-VN')}đ
                          </span>
                          <span className="text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                            Đã gồm viện phí
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-3 w-full sm:w-auto">
                        <Link 
                          href={`/landing/goi-kham/${pkg.id}`}
                          className="flex-1 sm:flex-none border border-blue-600 text-blue-600 font-bold py-2.5 px-5 rounded-xl hover:bg-blue-50 transition-colors text-center text-sm"
                        >
                          Chi tiết gói khám
                        </Link>
                        <Link 
                          href={bookingLink}
                          className="flex-1 sm:flex-none bg-blue-600 text-white font-bold py-2.5 px-6 rounded-xl hover:bg-blue-700 transition-colors text-center text-sm shadow-md shadow-blue-200"
                        >
                          Đặt gói ngay
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
