import React from 'react';
import { CalendarDays } from 'lucide-react';

export default function CoordinatorBookings() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Theo dõi Lịch Hẹn</h1>
          <p className="text-gray-500 mt-1">Điều chỉnh, theo dõi lịch hẹn khi có thay đổi vận hành</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center min-h-[400px]">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 mb-4">
          <CalendarDays size={32} />
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Chức năng đang được phát triển</h2>
        <p className="text-gray-500 max-w-md">
          Tính năng theo dõi toàn bộ lịch hẹn, tìm kiếm, lọc theo khoa/bác sĩ/phòng và xử lý thay đổi lịch hẹn đang trong quá trình xây dựng.
        </p>
      </div>
    </div>
  );
}
