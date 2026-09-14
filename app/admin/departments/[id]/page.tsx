'use client';
import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Clock, ArrowLeft, Loader2, Building2, ShieldCheck, UserPlus, X,
  DoorOpen, Stethoscope, Users, CheckCircle, Plus
} from 'lucide-react';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

import Sidebar from '@/app/admin/Sidebar';
import { 
  getDepartmentDetail, updateDepartmentStatus, 
  getAvailableDoctors, assignDoctorToDepartment, removeDoctorFromDepartment,
  addRoomToDepartment, updateRoomStatus
} from '@/app/admin/departments/actions';

export default function DepartmentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const deptId = resolvedParams.id;
  
  const [isLoading, setIsLoading] = useState(true);
  const [dept, setDept] = useState<any>(null);

  // Modal Phân công Bác sĩ
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  const [availableDoctors, setAvailableDoctors] = useState<any[]>([]);

  // Modal Thêm Phòng
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [newRoom, setNewRoom] = useState({ name: '', floor: '', type: 'Phòng khám' });

  const fetchDept = async () => {
    setIsLoading(true);
    const res = await getDepartmentDetail(deptId);
    if (res.success && res.data) {
      setDept(res.data);
    } else {
      toast.error('Không tìm thấy khoa phòng');
      router.push('/admin/departments');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (deptId) fetchDept();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deptId]);

  const fetchDoctors = async () => {
    const res = await getAvailableDoctors();
    if (res.success && res.data) setAvailableDoctors(res.data);
  };

  // --- ACTIONS ---

  const handleUpdateStatus = async (status: string) => {
    const res = await updateDepartmentStatus(deptId, status);
    if (res.success) {
      toast.success(res.message);
      fetchDept();
    }
  };

  const handleAssignDoctor = async (docId: number, docName: string) => {
    const res = await assignDoctorToDepartment(deptId, docId, docName);
    if (res.success) {
      toast.success(res.message);
      fetchDept();
    } else {
      toast.error(res.message);
    }
  };

  const handleRemoveDoctor = async (docId: number) => {
    if (!confirm('Bạn muốn xóa bác sĩ này khỏi khoa?')) return;
    const res = await removeDoctorFromDepartment(deptId, docId);
    if (res.success) {
      toast.success(res.message);
      fetchDept();
    }
  };

  const handleAddRoom = async () => {
    if (!newRoom.name) return toast.error('Vui lòng nhập tên phòng');
    const res = await addRoomToDepartment(deptId, newRoom.name, newRoom.floor, newRoom.type);
    if (res.success) {
      toast.success(res.message);
      setIsRoomModalOpen(false);
      setNewRoom({ name: '', floor: '', type: 'Phòng khám' });
      fetchDept();
    }
  };

  const handleUpdateRoomStatus = async (roomId: string, status: string) => {
    const res = await updateRoomStatus(deptId, roomId, status);
    if (res.success) fetchDept();
  };


  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Hoạt động': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Tạm dừng': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Ngừng hoạt động': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const currentDateTime = dayjs().format('DD/MM/YYYY HH:mm');

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans text-slate-800 overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* TOP HEADER */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 z-10 shadow-sm">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="text-blue-600"/> Chi tiết Khoa Phòng
            </h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-sm font-medium text-slate-500 bg-slate-100 px-4 py-2 rounded-full border border-slate-200 flex items-center gap-2">
              <Clock size={16}/> {currentDateTime}
            </div>
          </div>
        </header>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto p-8 animate-in fade-in duration-500">
          
          {isLoading ? (
            <div className="py-20 flex justify-center"><Loader2 className="w-10 h-10 text-blue-600 animate-spin" /></div>
          ) : dept && (
            <div className="max-w-6xl mx-auto space-y-6">
              
              <div className="flex items-center justify-between mb-2">
                <Link href="/admin/departments" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold transition-colors">
                  <ArrowLeft size={20}/> Quay lại danh sách
                </Link>
              </div>

              {/* THÔNG TIN KHOA */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 border-b border-slate-200 p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div>
                    <h2 className="text-sm font-bold text-slate-400 mb-1 tracking-wider uppercase">Khoa</h2>
                    <div className="text-3xl font-black text-slate-900 mb-2">{dept.name}</div>
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <span className="font-medium bg-white border border-slate-200 px-3 py-1 rounded-lg">Mã khoa: <span className="font-bold text-slate-900">{dept.id}</span></span>
                      <span className="font-medium bg-white border border-slate-200 px-3 py-1 rounded-lg flex items-center gap-2">Trưởng khoa: <ShieldCheck size={16} className="text-blue-500"/><span className="font-bold text-slate-900">{dept.headDoctor || 'Chưa có'}</span></span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <div className={`px-5 py-2.5 rounded-xl font-bold border ${getStatusBadge(dept.status)} flex items-center gap-2`}>
                      Trạng thái: {dept.status}
                    </div>
                    {dept.status === 'Hoạt động' ? (
                      <button onClick={() => handleUpdateStatus('Tạm dừng')} className="text-xs font-bold text-amber-600 hover:underline">Chuyển sang Tạm dừng</button>
                    ) : (
                      <button onClick={() => handleUpdateStatus('Hoạt động')} className="text-xs font-bold text-emerald-600 hover:underline">Chuyển sang Hoạt động</button>
                    )}
                  </div>
                </div>
                
                <div className="p-8 border-b border-slate-100 bg-white">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Mô tả</h3>
                  <p className="text-slate-700">{dept.desc || 'Chưa có mô tả.'}</p>
                </div>
              </div>

              {/* GRID: BÁC SĨ & PHÒNG */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* BLOCK BÁC SĨ */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                  <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                      <Users className="text-blue-600" size={20}/> Nhân sự / Bác sĩ ({dept.doctors?.length || 0})
                    </h3>
                    <button 
                      onClick={() => { fetchDoctors(); setIsDoctorModalOpen(true); }}
                      className="px-4 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg font-bold text-xs transition flex items-center gap-1"
                    >
                      <UserPlus size={16}/> Phân công BS
                    </button>
                  </div>
                  
                  <div className="p-6 flex-1 overflow-y-auto max-h-80 custom-scrollbar">
                    {dept.doctors && dept.doctors.length > 0 ? (
                      <div className="space-y-3">
                        {dept.doctors.map((doc: any) => (
                          <div key={doc.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                                {doc.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-bold text-slate-900">{doc.name}</p>
                                <p className="text-xs text-slate-500">Mã BS: {doc.id}</p>
                              </div>
                            </div>
                            <button onClick={() => handleRemoveDoctor(doc.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition" title="Xóa khỏi khoa">
                              <X size={18}/>
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-10 text-slate-500">
                        <Users size={40} className="mx-auto text-slate-300 mb-3"/>
                        <p>Khoa chưa có bác sĩ nào.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* BLOCK PHÒNG KHÁM */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                  <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                      <DoorOpen className="text-indigo-600" size={20}/> Phòng khám thuộc Khoa ({dept.rooms?.length || 0})
                    </h3>
                    <button 
                      onClick={() => setIsRoomModalOpen(true)}
                      className="px-4 py-2 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded-lg font-bold text-xs transition flex items-center gap-1"
                    >
                      <Plus size={16}/> Thêm Phòng
                    </button>
                  </div>
                  
                  <div className="p-6 flex-1 overflow-y-auto max-h-80 custom-scrollbar">
                    {dept.rooms && dept.rooms.length > 0 ? (
                      <div className="grid grid-cols-2 gap-4">
                        {dept.rooms.map((room: any) => (
                          <div key={room.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 relative group">
                            <div className="flex justify-between items-start mb-2">
                              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${room.status === 'Hoạt động' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                {room.status}
                              </span>
                              
                              <select 
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-xs border rounded p-1 bg-white cursor-pointer outline-none"
                                value={room.status}
                                onChange={(e) => handleUpdateRoomStatus(room.id, e.target.value)}
                              >
                                <option value="Hoạt động">Đổi: Hoạt động</option>
                                <option value="Tạm dừng">Đổi: Tạm dừng sửa chữa</option>
                              </select>
                            </div>
                            <h4 className="font-black text-slate-900 text-lg">{room.name}</h4>
                            <p className="text-xs text-slate-500 font-medium">{room.type} • Tầng {room.floor}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-10 text-slate-500">
                        <DoorOpen size={40} className="mx-auto text-slate-300 mb-3"/>
                        <p>Khoa chưa được cấp phòng nào.</p>
                      </div>
                    )}
                  </div>
                </div>

              </div>

            </div>
          )}
        </div>

        {/* MODAL PHÂN CÔNG BÁC SĨ */}
        {isDoctorModalOpen && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[80vh]">
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <UserPlus className="text-blue-600" size={20}/> Phân công Bác sĩ vào khoa
                </h3>
                <button onClick={() => setIsDoctorModalOpen(false)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition">
                  <X size={20}/>
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto">
                <div className="space-y-2">
                  {availableDoctors.length > 0 ? availableDoctors.map((doc: any) => {
                    const isAssigned = dept.doctors?.some((d: any) => d.id === doc.id);
                    return (
                      <div key={doc.id} className={`flex items-center justify-between p-3 rounded-xl border ${isAssigned ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-white'}`}>
                        <div>
                          <p className="font-bold text-slate-900">{doc.fullName}</p>
                          <p className="text-xs text-slate-500">{doc.doctorProfile?.specialty || 'Chưa rõ'}</p>
                        </div>
                        {isAssigned ? (
                          <span className="text-xs font-bold text-emerald-600 flex items-center gap-1"><CheckCircle size={14}/> Đã thuộc khoa</span>
                        ) : (
                          <button 
                            onClick={() => handleAssignDoctor(doc.id, doc.fullName)}
                            className="px-4 py-1.5 bg-blue-100 text-blue-700 hover:bg-blue-600 hover:text-white rounded-lg font-bold text-xs transition"
                          >
                            Chọn
                          </button>
                        )}
                      </div>
                    )
                  }) : (
                    <p className="text-center text-slate-500 py-4">Không tìm thấy bác sĩ nào trong hệ thống.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL THÊM PHÒNG */}
        {isRoomModalOpen && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <DoorOpen className="text-indigo-600" size={20}/> Thêm Phòng khám
                </h3>
                <button onClick={() => setIsRoomModalOpen(false)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition">
                  <X size={20}/>
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Tên / Số phòng</label>
                  <input 
                    type="text" 
                    placeholder="VD: Phòng 201" 
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-indigo-500 outline-none"
                    value={newRoom.name} onChange={e => setNewRoom({...newRoom, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Tầng</label>
                  <input 
                    type="text" 
                    placeholder="VD: Tầng 2" 
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-indigo-500 outline-none"
                    value={newRoom.floor} onChange={e => setNewRoom({...newRoom, floor: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Loại phòng</label>
                  <select 
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-indigo-500 outline-none"
                    value={newRoom.type} onChange={e => setNewRoom({...newRoom, type: e.target.value})}
                  >
                    <option value="Phòng khám">Phòng khám bệnh</option>
                    <option value="Phòng xét nghiệm">Phòng xét nghiệm</option>
                    <option value="Phòng phẫu thuật">Phòng phẫu thuật</option>
                    <option value="Phòng cấp cứu">Phòng cấp cứu</option>
                  </select>
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                <button 
                  onClick={() => setIsRoomModalOpen(false)}
                  className="px-5 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition"
                >
                  Hủy
                </button>
                <button 
                  onClick={handleAddRoom}
                  className="px-6 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm rounded-xl transition"
                >
                  Thêm Phòng
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
