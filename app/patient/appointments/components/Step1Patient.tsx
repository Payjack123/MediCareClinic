import React from 'react';
import { Users, Check, Phone, Calendar, Trash2, Plus, ArrowRight } from 'lucide-react';

interface Step1PatientProps {
  patients: any[];
  setPatients: (patients: any[]) => void;
  activePatientId: number;
  setActivePatientId: (id: number) => void;
  userData: any;
  setIsAddPatientModalOpen: (isOpen: boolean) => void;
  setStep: (step: number) => void;
}

export default function Step1Patient({
  patients,
  setPatients,
  activePatientId,
  setActivePatientId,
  userData,
  setIsAddPatientModalOpen,
  setStep
}: Step1PatientProps) {
  return (
    <div className="p-8 flex-1 flex flex-col animate-in slide-in-from-right-8">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
          <Users className="text-[#2563EB]" size={28} /> Chọn người cần khám
        </h2>
        <p className="text-gray-500 mt-2">Vui lòng chọn thành viên gia đình cần đặt lịch khám</p>
      </div>

      <div className="space-y-4">
        {patients.map((p, idx) => (
          <div
            key={p.id}
            onClick={() => setActivePatientId(p.id)}
            className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-4 ${activePatientId === p.id ? 'border-[#2563EB] bg-blue-50/30' : 'border-gray-200 hover:border-blue-200'}`}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${activePatientId === p.id ? 'bg-[#2563EB] text-white' : 'border-2 border-gray-300'}`}>
              {activePatientId === p.id && <Check size={14} strokeWidth={3} />}
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-100 text-[#2563EB] flex items-center justify-center font-bold text-lg shrink-0">
              {p.name ? p.name.split(' ').pop()?.charAt(0) : 'U'}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-gray-900 text-lg">{p.name || 'Chưa cập nhật tên'}</h3>
                {idx === 0 && <span className="text-xs font-bold bg-blue-100 text-[#2563EB] px-2 py-1 rounded-md">Chủ tài khoản</span>}
              </div>
              <div className="flex flex-col gap-1 mt-1">
                <p className="text-sm text-gray-500 flex items-center gap-1.5"><Phone size={14} /> {p.phone || 'Chưa có SĐT'}</p>
                {userData?.dob && idx === 0 && <p className="text-sm text-gray-500 flex items-center gap-1.5"><Calendar size={14} /> {userData.dob.includes('-') ? userData.dob.split('-').reverse().join('/') : userData.dob}</p>}
                {p.dob && idx > 0 && <p className="text-sm text-gray-500 flex items-center gap-1.5"><Calendar size={14} /> {p.dob.includes('-') ? p.dob.split('-').reverse().join('/') : p.dob}</p>}
                {idx > 0 && <p className="text-sm text-gray-500 flex items-center gap-1.5"><Users size={14} /> Thành viên gia đình {p.relationship ? `(${p.relationship})` : ''}</p>}
              </div>
            </div>
            {idx > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const newPatients = patients.filter(pat => pat.id !== p.id);
                  setPatients(newPatients);
                  if (activePatientId === p.id) {
                    setActivePatientId(newPatients[0].id);
                  }
                }}
                className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors ml-2"
                title="Xóa thành viên"
              >
                <Trash2 size={20} />
              </button>
            )}
          </div>
        ))}

        <button
          onClick={() => setIsAddPatientModalOpen(true)}
          className="w-full p-4 rounded-2xl border-2 border-dashed border-gray-300 text-gray-500 flex items-center justify-center gap-2 hover:border-[#2563EB] hover:text-[#2563EB] hover:bg-blue-50 transition-all group"
        >
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
            <Plus size={16} />
          </div>
          <span className="font-bold">Thêm hồ sơ người thân</span>
        </button>
      </div>

      <div className="mt-auto pt-8 border-t border-gray-100 flex justify-end">
        <button
          onClick={() => setStep(2)}
          className="bg-[#2563EB] hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md shadow-blue-500/20"
        >
          Tiếp tục chọn dịch vụ <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
