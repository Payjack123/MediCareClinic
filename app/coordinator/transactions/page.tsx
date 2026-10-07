import React from 'react';
import { FileText } from 'lucide-react';

export default function CoordinatorTransactions() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Đối Soát Giao Dịch</h1>
          <p className="text-gray-500 mt-1">Xem và đối soát giao dịch theo phạm vi vận hành</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center min-h-[400px]">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 mb-4">
          <FileText size={32} />
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Chức năng đang được phát triển</h2>
        <p className="text-gray-500 max-w-md">
          Tính năng xem giao dịch, chi tiết hóa đơn, đối chiếu trạng thái đang trong quá trình xây dựng. Vui lòng quay lại sau.
        </p>
      </div>
    </div>
  );
}
