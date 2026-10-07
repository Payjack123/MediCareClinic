import React from 'react';
import { Settings } from 'lucide-react';

export default function CoordinatorSettings() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Cài Đặt</h1>
          <p className="text-gray-500 mt-1">Cấu hình hệ thống và tài khoản cá nhân</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center min-h-[400px]">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 mb-4">
          <Settings size={32} />
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Chức năng đang được phát triển</h2>
        <p className="text-gray-500 max-w-md">
          Tính năng cài đặt hệ thống và thông tin cá nhân đang trong quá trình xây dựng. Vui lòng quay lại sau.
        </p>
      </div>
    </div>
  );
}
