'use client';
import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Download, Printer, Save, Send,
  User, Stethoscope, FileText, CalendarClock, Trash2, Plus, Loader2, XCircle
} from 'lucide-react';
import DoctorSidebar from '@/app/doctor/Sidebar';
import { getPrescriptionById, updatePrescription, publishPrescription, cancelPrescription } from '../actions';

export default function DoctorPrescriptionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const id = parseInt(resolvedParams.id);
  
  const [prescription, setPrescription] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Edit states (only used if status === 'Nháp')
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<any[]>([]);
  const [drugForm, setDrugForm] = useState({ name: '', dosage: '', quantity: '', form: 'Viên', usage: '', frequency: '', duration: '' });

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const res = await getPrescriptionById(id);
        if (res.success && res.data) {
          setPrescription(res.data);
          setDiagnosis(res.data.diagnosis || '');
          setNotes(res.data.notes || '');
          
          const parsedItems = res.data.items.map((item: any) => ({
            name: item.medicationName,
            dosage: item.dosage,
            quantity: parseInt(item.remaining),
            form: item.iconType === 'liquid' ? 'Dung dịch' : 'Viên',
            instructions: item.instructions
          }));
          setItems(parsedItems);
        } else {
          setErrorMsg(res.message || 'Lỗi tải dữ liệu');
        }
      }
      setIsLoading(false);
    };
    fetchData();
  }, [id]);

  const isDraft = prescription?.status === 'Nháp';

  const handleAddDrug = () => {
    if (!drugForm.name || !drugForm.quantity) return;
    const fullInstruction = [
      drugForm.dosage, 
      drugForm.frequency ? `${drugForm.frequency}` : '',
      drugForm.duration ? `trong ${drugForm.duration}` : '',
      drugForm.usage ? `(${drugForm.usage})` : ''
    ].filter(Boolean).join(' - ');
    setItems([...items, { ...drugForm, instructions: fullInstruction }]);
    setDrugForm({ name: '', dosage: '', quantity: '', form: 'Viên', usage: '', frequency: '', duration: '' });
  };

  const handleRemoveDrug = (index: number) => setItems(items.filter((_, i) => i !== index));

  const handleSaveDraft = async () => {
    setIsSaving(true);
    const res = await updatePrescription(id, { diagnosis, notes, status: 'Nháp', items });
    if (res.success) {
      alert('Đã lưu nháp!');
      window.location.reload();
    } else {
      alert(res.message);
    }
    setIsSaving(false);
  };

  const handlePublish = async () => {
    if (confirm('Xác nhận phát hành đơn thuốc này? (Không thể sửa đổi sau khi phát hành)')) {
      setIsSaving(true);
      // Save any pending changes first, then publish
      await updatePrescription(id, { diagnosis, notes, status: 'Nháp', items });
      const res = await publishPrescription(id);
      if (res.success) {
        window.location.reload();
      } else {
        alert(res.message);
      }
      setIsSaving(false);
    }
  };

  const handleCancel = async () => {
    if (confirm('Bạn có chắc chắn muốn hủy đơn thuốc này?')) {
      setIsSaving(true);
      const res = await cancelPrescription(id);
      if (res.success) window.location.reload();
      else alert(res.message);
      setIsSaving(false);
    }
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <Loader2 className="w-10 h-10 text-[#2563EB] animate-spin" />
    </div>
  );

  if (errorMsg || !prescription) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
        <p className="text-red-500 font-bold mb-4">{errorMsg || 'Không tìm thấy thông tin'}</p>
        <button onClick={() => router.push('/doctor/prescriptions')} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold">Quay lại</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] font-sans text-gray-800">
      <DoctorSidebar activePage="prescriptions-list" />
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        <header className="bg-white border-b border-gray-100 shrink-0 z-10 px-8 py-4 flex items-center justify-between sticky top-0">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push("/doctor/prescriptions")} className="p-2 hover:bg-gray-50 rounded-full transition-colors text-gray-500">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900 leading-none mb-1.5 flex items-center gap-2">
                Chi tiết đơn thuốc
              </h1>
              <div className="text-[13px] text-gray-500 flex items-center gap-1.5">
                <Link href="/doctor/prescriptions" className="hover:text-[#2563EB] transition-colors">Đơn thuốc</Link>
                <span className="text-gray-400">/</span>
                <span className="text-gray-700">{prescription.code}</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
             {prescription.status !== 'Đã hủy' && (
               <>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 hover:border-[#2563EB] hover:text-[#2563EB] bg-white rounded-xl text-sm font-bold transition shadow-sm">
                  <Download size={16} /> Tải PDF
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-[#2563EB] text-[#2563EB] bg-blue-50/50 hover:bg-blue-100 rounded-xl text-sm font-bold transition shadow-sm">
                  <Printer size={16} /> In đơn thuốc
                </button>
               </>
             )}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
          <div className="w-full max-w-5xl mx-auto space-y-6">
            
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 xl:p-8">
              
              {/* CÁC THÔNG TIN CHUNG TĨNH (KHÔNG SỬA ĐƯỢC) */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                  Mã đơn: <span className="text-[#2563EB]">{prescription.code}</span>
                </h2>
                <div>
                  <span className={`px-4 py-1.5 rounded-lg text-sm font-bold border inline-block 
                    ${prescription.status === 'Đã kê' ? 'text-green-700 bg-green-100 border-green-200' :
                      prescription.status === 'Nháp' ? 'text-gray-700 bg-gray-100 border-gray-200' :
                      'text-red-700 bg-red-100 border-red-200'}`}>
                    Trạng thái: {prescription.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 border border-gray-100 rounded-2xl mb-8 divide-x divide-gray-100 text-sm bg-gray-50/50">
                <div className="px-2">
                  <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-2">Bệnh nhân</p>
                  <p className="font-bold text-gray-900 text-base">{prescription.patient.fullName}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{prescription.patient.patientProfile?.patientCode || `BN${prescription.patient.id}`}</p>
                </div>
                <div className="px-6">
                  <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-2">Ngày kê</p>
                  <p className="font-bold text-gray-900 text-base">{prescription.createdAt.toLocaleDateString('vi-VN')}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{prescription.createdAt.toLocaleTimeString('vi-VN', {hour:'2-digit', minute:'2-digit'})}</p>
                </div>
                <div className="px-6 col-span-2">
                  <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-2">Chẩn đoán</p>
                  {isDraft ? (
                    <input 
                      type="text" 
                      value={diagnosis} 
                      onChange={e => setDiagnosis(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg outline-none focus:border-[#2563EB] font-bold text-gray-900"
                    />
                  ) : (
                    <p className="font-bold text-gray-900 text-base">{diagnosis}</p>
                  )}
                </div>
              </div>

              <h3 className="font-bold text-gray-900 mb-4 text-lg">Danh sách thuốc</h3>
              
              {/* FORM THÊM THUỐC NẾU NHÁP */}
              {isDraft && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-blue-50/50 p-5 rounded-xl border border-blue-100 mb-6">
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-[#2563EB] mb-2">Tên thuốc</label>
                    <input type="text" value={drugForm.name} onChange={e => setDrugForm({...drugForm, name: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#2563EB]" placeholder="Paracetamol" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#2563EB] mb-2">Hàm lượng</label>
                    <input type="text" value={drugForm.dosage} onChange={e => setDrugForm({...drugForm, dosage: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#2563EB]" placeholder="500mg" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-[#2563EB] mb-2">SL</label>
                      <input type="number" value={drugForm.quantity} onChange={e => setDrugForm({...drugForm, quantity: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#2563EB]" placeholder="10" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#2563EB] mb-2">Đ.Vị</label>
                      <select value={drugForm.form} onChange={e => setDrugForm({...drugForm, form: e.target.value})} className="w-full px-2 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#2563EB]">
                        <option value="Viên">Viên</option>
                        <option value="Dung dịch">Lọ</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-[#2563EB] mb-2">Liều / lần</label>
                    <input type="text" value={drugForm.usage} onChange={e => setDrugForm({...drugForm, usage: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#2563EB]" placeholder="1 viên" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#2563EB] mb-2">Tần suất</label>
                    <input type="text" value={drugForm.frequency} onChange={e => setDrugForm({...drugForm, frequency: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#2563EB]" placeholder="2 lần/ngày" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#2563EB] mb-2">Thời gian</label>
                    <input type="text" value={drugForm.duration} onChange={e => setDrugForm({...drugForm, duration: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#2563EB]" placeholder="5 ngày" />
                  </div>
                  <div className="flex items-end">
                    <button onClick={handleAddDrug} className="w-full bg-[#2563EB] text-white font-bold h-[38px] rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition">
                      <Plus size={16}/> Thêm
                    </button>
                  </div>
                </div>
              )}

              <div className="overflow-x-auto border border-gray-100 rounded-2xl mb-8 shadow-sm">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-500 bg-gray-50 border-b border-gray-100 uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4 font-bold w-12">STT</th>
                      <th className="px-6 py-4 font-bold">Tên thuốc</th>
                      <th className="px-6 py-4 font-bold text-center">Số lượng</th>
                      <th className="px-6 py-4 font-bold">Hướng dẫn</th>
                      {isDraft && <th className="px-6 py-4 font-bold text-center w-16">Xóa</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {items.map((med: any, idx: number) => (
                      <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-5 text-gray-500 font-medium text-center">{idx + 1}</td>
                        <td className="px-6 py-5 font-bold text-gray-900 text-base">{med.name} <span className="block font-normal text-sm text-gray-500">{med.dosage} - {med.form}</span></td>
                        <td className="px-6 py-5 font-black text-[#2563EB] text-center text-base">{med.quantity}</td>
                        <td className="px-6 py-5 text-gray-700 leading-relaxed font-medium">{med.instructions}</td>
                        {isDraft && (
                          <td className="px-6 py-5 text-center">
                            <button onClick={() => handleRemoveDrug(idx)} className="text-red-500 hover:text-red-700 p-2 bg-red-50 hover:bg-red-100 rounded-lg transition">
                              <Trash2 size={16} />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                    {items.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-gray-400">Không có thuốc nào.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                
                <div className="border border-gray-200 rounded-2xl p-6 bg-gray-50/30">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-base">
                    <FileText size={20} className="text-[#2563EB]"/> Ghi chú / Dặn dò
                  </h3>
                  {isDraft ? (
                    <textarea 
                      rows={4} 
                      value={notes} 
                      onChange={e => setNotes(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-[#2563EB] transition-all font-medium resize-none"
                    ></textarea>
                  ) : (
                    <p className="text-gray-700 leading-relaxed font-medium whitespace-pre-line">{notes || 'Không có ghi chú'}</p>
                  )}
                </div>

                <div className="border border-gray-100 rounded-2xl p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-[#2563EB] mb-4 flex items-center gap-2 text-base">
                      <CalendarClock size={20} /> Tái khám
                    </h3>
                    <p className="text-gray-500 text-sm font-medium mb-1.5 uppercase tracking-wider">Ngày tái khám dự kiến</p>
                    <p className="font-black text-gray-900 text-xl">{prescription.followUpDate || 'Không có hẹn'}</p>
                  </div>
                  
                  {isDraft && (
                    <div className="mt-6 flex flex-col gap-3">
                      <button 
                        onClick={handleSaveDraft}
                        disabled={isSaving}
                        className="w-full px-6 py-3 border border-gray-200 bg-white text-gray-700 font-bold hover:bg-gray-50 rounded-xl shadow-sm flex items-center justify-center gap-2"
                      >
                         <Save size={18}/> Lưu sửa đổi (Nháp)
                      </button>
                      <button 
                        onClick={handlePublish}
                        disabled={isSaving || items.length === 0}
                        className="w-full px-6 py-3 border border-[#2563EB] bg-[#2563EB] text-white hover:bg-blue-700 transition rounded-xl font-bold shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <Send size={18}/> Phát hành đơn
                      </button>
                      <button 
                        onClick={handleCancel}
                        disabled={isSaving}
                        className="w-full px-6 py-2 mt-2 text-red-500 hover:text-red-700 font-bold flex items-center justify-center gap-2 text-sm transition"
                      >
                        <XCircle size={16}/> Hủy đơn thuốc này
                      </button>
                    </div>
                  )}
                </div>

              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
