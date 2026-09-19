'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Search, Plus, Trash2, 
  Save, Send, User, Stethoscope, Loader2 
} from 'lucide-react';
import DoctorSidebar from "@/app/doctor/Sidebar";
import { getDoctorPrescriptionsData, createFullPrescription } from '@/app/doctor/prescriptions/actions';

export default function CreatePrescriptionPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // States
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [selectedExamId, setSelectedExamId] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  
  // Medicines
  const [items, setItems] = useState<any[]>([]);
  const [drugForm, setDrugForm] = useState({ name: '', dosage: '', quantity: '', form: 'Viên', usage: '', frequency: '', duration: '' });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const res = await getDoctorPrescriptionsData();
      if (res.success && res.data) {
        setData(res.data);
      } else {
        router.push('/login');
      }
      setIsLoading(false);
    };
    fetchData();
  }, [router]);

  const activePatient = data?.patients?.find((p: any) => p.id.toString() === selectedPatientId);
  const examinations = activePatient?.examinationsAsPatient || [];

  // Auto fill when examination changes
  useEffect(() => {
    if (selectedExamId) {
      const exam = examinations.find((e: any) => e.id.toString() === selectedExamId);
      if (exam) {
        setDiagnosis(exam.diagnosis || '');
        if (exam.followUpDate) {
          let fd = exam.followUpDate;
          if (fd.includes('/')) {
            const [d, m, y] = fd.split('/');
            fd = `${y}-${m}-${d}`;
          }
          setFollowUpDate(fd);
        } else {
          setFollowUpDate('');
        }
      }
    } else {
      setDiagnosis('');
      setFollowUpDate('');
    }
  }, [selectedExamId, examinations]);

  const handleAddDrug = () => {
    if (!drugForm.name || !drugForm.quantity) return;
    
    // Create combined instruction
    const fullInstruction = [
      drugForm.dosage, 
      drugForm.frequency ? `${drugForm.frequency}` : '',
      drugForm.duration ? `trong ${drugForm.duration}` : '',
      drugForm.usage ? `(${drugForm.usage})` : ''
    ].filter(Boolean).join(' - ');

    setItems([...items, { ...drugForm, instructions: fullInstruction }]);
    setDrugForm({ name: '', dosage: '', quantity: '', form: 'Viên', usage: '', frequency: '', duration: '' });
  };

  const handleRemoveDrug = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async (status: 'Nháp' | 'Đã kê') => {
    if (!selectedPatientId) {
      setErrorMsg('Vui lòng chọn bệnh nhân');
      return;
    }
    if (!diagnosis) {
      setErrorMsg('Vui lòng nhập chẩn đoán');
      return;
    }
    if (items.length === 0) {
      setErrorMsg('Vui lòng thêm ít nhất một loại thuốc');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    const res = await createFullPrescription({
      patientId: parseInt(selectedPatientId),
      diagnosis,
      notes,
      status,
      followUpDate,
      items
    });

    if (res.success) {
      router.push(`/doctor/prescriptions/${res.id}`);
    } else {
      setErrorMsg(res.message);
      setIsSubmitting(false);
    }
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <Loader2 className="w-8 h-8 text-[#2563EB] animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] font-sans text-gray-800">
      <DoctorSidebar activePage="prescriptions-list" />
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center gap-4 sticky top-0 z-10 shadow-sm">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900 leading-none mb-1">Tạo đơn thuốc mới</h1>
            <p className="text-[13px] text-gray-500">Quy trình: Chọn bệnh nhân → Chọn lần khám → Thêm thuốc → Phát hành</p>
          </div>
        </header>

        <div className="p-8 max-w-5xl mx-auto w-full space-y-8">
          
          {errorMsg && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 font-bold">
              {errorMsg}
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <User className="text-[#2563EB]" /> Thông tin Bệnh nhân & Lần khám
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Chọn Bệnh nhân <span className="text-red-500">*</span></label>
                <select 
                  value={selectedPatientId} 
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all font-medium"
                >
                  <option value="">-- Chọn bệnh nhân --</option>
                  {data?.patients?.map((p: any) => (
                    <option key={p.id} value={p.id}>{p.fullName} - {p.patientProfile?.patientCode || `BN${p.id}`}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Chọn Lần khám (Hồ sơ bệnh án)</label>
                <select 
                  value={selectedExamId} 
                  onChange={(e) => setSelectedExamId(e.target.value)}
                  disabled={!selectedPatientId || examinations.length === 0}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all font-medium disabled:opacity-50"
                >
                  <option value="">-- Khám mới (Không liên kết) --</option>
                  {examinations.map((e: any) => (
                    <option key={e.id} value={e.id}>
                      Ngày: {new Date(e.createdAt).toLocaleDateString('vi-VN')} - Chẩn đoán: {e.diagnosis?.substring(0, 30)}...
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">Chẩn đoán <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="VD: Viêm họng cấp"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all font-medium"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Stethoscope className="text-[#2563EB]" /> Thêm Thuốc
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-5 rounded-xl border border-gray-100 mb-6">
              <div className="col-span-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Tên thuốc</label>
                <input type="text" value={drugForm.name} onChange={e => setDrugForm({...drugForm, name: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]" placeholder="Paracetamol" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Hàm lượng</label>
                <input type="text" value={drugForm.dosage} onChange={e => setDrugForm({...drugForm, dosage: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]" placeholder="500mg" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">SL</label>
                  <input type="number" value={drugForm.quantity} onChange={e => setDrugForm({...drugForm, quantity: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]" placeholder="10" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Đ.Vị</label>
                  <select value={drugForm.form} onChange={e => setDrugForm({...drugForm, form: e.target.value})} className="w-full px-2 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]">
                    <option value="Viên">Viên</option>
                    <option value="Dung dịch">Lọ</option>
                    <option value="Vỉ">Vỉ</option>
                    <option value="Hộp">Hộp</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Liều / lần</label>
                <input type="text" value={drugForm.usage} onChange={e => setDrugForm({...drugForm, usage: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]" placeholder="1 viên" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Tần suất</label>
                <input type="text" value={drugForm.frequency} onChange={e => setDrugForm({...drugForm, frequency: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]" placeholder="2 lần/ngày" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Thời gian</label>
                <input type="text" value={drugForm.duration} onChange={e => setDrugForm({...drugForm, duration: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]" placeholder="5 ngày" />
              </div>
              <div className="flex items-end">
                <button onClick={handleAddDrug} className="w-full bg-[#2563EB] text-white font-bold h-[38px] rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition">
                  <Plus size={16}/> Thêm
                </button>
              </div>
            </div>

            {items.length > 0 ? (
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-500 font-bold border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3">Thuốc</th>
                      <th className="px-4 py-3 text-center">SL</th>
                      <th className="px-4 py-3">Cách dùng</th>
                      <th className="px-4 py-3 w-16"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="px-4 py-3 font-bold text-gray-900">{item.name} <span className="font-normal text-gray-500 text-xs block">{item.dosage} • {item.form}</span></td>
                        <td className="px-4 py-3 text-center font-black">{item.quantity}</td>
                        <td className="px-4 py-3 text-gray-700">{item.instructions}</td>
                        <td className="px-4 py-3 text-center">
                          <button onClick={() => handleRemoveDrug(idx)} className="text-red-500 hover:text-red-700 p-1.5 bg-red-50 hover:bg-red-100 rounded-lg transition">
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400 border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                Chưa có thuốc nào được thêm.
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
             <div className="grid md:grid-cols-2 gap-6">
               <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Ghi chú / Lời dặn</label>
                  <textarea 
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Dặn dò bệnh nhân..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all font-medium resize-none"
                  ></textarea>
               </div>
               <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Ngày tái khám (Nếu có)</label>
                  <input 
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all font-medium mb-6"
                  />
                  
                  <div className="flex gap-4">
                    <button 
                      onClick={() => handleSubmit('Nháp')}
                      disabled={isSubmitting}
                      className="flex-1 border-2 border-gray-200 text-gray-700 font-bold py-3.5 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Save size={20} /> Lưu nháp
                    </button>
                    <button 
                      onClick={() => handleSubmit('Đã kê')}
                      disabled={isSubmitting}
                      className="flex-[2] bg-[#2563EB] text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />} 
                      Phát hành Đơn thuốc
                    </button>
                  </div>
               </div>
             </div>
          </div>

        </div>
      </main>
    </div>
  );
}
