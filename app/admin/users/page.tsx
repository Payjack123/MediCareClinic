'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, Bell, Clock, ShieldCheck, Plus, Users, 
  Lock, Unlock, KeyRound, X, Save
} from 'lucide-react';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

import Sidebar from '@/app/admin/Sidebar';
import { 
  getUsers, createUser, toggleUserLock, resetUserPassword,
  getRBACConfig, saveRBACConfig 
} from '@/app/admin/users/actions';

export default function AdminUsersPage() {
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<'USERS' | 'RBAC'>('USERS');
  const [isLoading, setIsLoading] = useState(true);

  // --- STATE CHO TAB USERS ---
  const [users, setUsers] = useState<any[]>([]);
  const [filters, setFilters] = useState({ search: '', role: '', status: '' });
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ fullName: '', email: '', password: '', role: 'PATIENT' });

  // --- STATE CHO TAB RBAC ---
  const [rbacConfig, setRbacConfig] = useState<any>({});
  const [selectedRole, setSelectedRole] = useState('ADMIN');
  
  const ROLES_MAP: Record<string, string> = {
    ADMIN: 'Admin Quản Trị',
    BAC_SI: 'Bác Sĩ',
    LE_TAN: 'Lễ Tân',
    BENH_NHAN: 'Bệnh Nhân'
  };

  const PERMISSIONS = [
    { key: 'VIEW', label: 'Xem (View)' },
    { key: 'CREATE', label: 'Thêm (Create)' },
    { key: 'UPDATE', label: 'Sửa (Update)' },
    { key: 'DELETE', label: 'Xóa (Delete)' },
    { key: 'EXPORT', label: 'Xuất file (Export)' }
  ];

  const MODULES = ['Dashboard', 'Bác_sĩ', 'Bệnh_nhân', 'Lịch_hẹn', 'Hồ_sơ_bệnh_án', 'Hóa_đơn', 'Thu_phí', 'Khoa_phòng', 'Dịch_vụ', 'RBAC'];

  const fetchData = async () => {
    setIsLoading(true);
    
    // Tải Users
    const uRes = await getUsers();
    if (uRes.success && uRes.data) {
      let filtered = uRes.data;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        filtered = filtered.filter((u: any) => u.fullName?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q));
      }
      if (filters.role) filtered = filtered.filter((u: any) => u.role === filters.role);
      if (filters.status) filtered = filtered.filter((u: any) => u.status === filters.status);
      setUsers(filtered);
    } else if (uRes.message === 'Không có quyền truy cập') {
      router.push('/login');
    }

    // Tải RBAC Config
    const rRes = await getRBACConfig();
    if (rRes.success && rRes.data) {
      setRbacConfig(rRes.data);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, activeTab]);

  const handleLogout = () => router.push('/login');

  // --- HANDLERS CHO USERS ---
  const handleCreateUser = async () => {
    if (!newUser.email || !newUser.password || !newUser.fullName) {
      toast.error('Vui lòng nhập đầy đủ thông tin');
      return;
    }
    const tId = toast.loading('Đang tạo tài khoản...');
    const res = await createUser(newUser);
    if (res.success) {
      toast.success(res.message, { id: tId });
      setIsAddModalOpen(false);
      setNewUser({ fullName: '', email: '', password: '', role: 'PATIENT' });
      fetchData();
    } else {
      toast.error(res.message, { id: tId });
    }
  };

  const handleToggleLock = async (id: number, currentStatus: string) => {
    if (!confirm(currentStatus === 'Hoạt động' ? 'Bạn muốn KHÓA tài khoản này?' : 'Bạn muốn MỞ KHÓA tài khoản này?')) return;
    const res = await toggleUserLock(id, currentStatus);
    if (res.success) {
      toast.success(res.message);
      fetchData();
    }
  };

  const handleResetPassword = async (id: number) => {
    if (!confirm('Bạn có chắc muốn Reset mật khẩu về mặc định (123456)?')) return;
    const res = await resetUserPassword(id);
    if (res.success) toast.success(res.message);
  };

  // --- HANDLERS CHO RBAC ---
  const handleTogglePermission = (mod: string, perm: string) => {
    const updatedConfig = { ...rbacConfig };
    if (!updatedConfig[selectedRole][mod]) updatedConfig[selectedRole][mod] = [];
    
    const permsList = updatedConfig[selectedRole][mod];
    if (permsList.includes(perm)) {
      updatedConfig[selectedRole][mod] = permsList.filter((p: string) => p !== perm);
    } else {
      updatedConfig[selectedRole][mod].push(perm);
    }
    setRbacConfig(updatedConfig);
  };

  const handleSaveRBAC = async () => {
    const tId = toast.loading('Đang lưu cấu hình...');
    const res = await saveRBACConfig(rbacConfig);
    if (res.success) {
      toast.success(res.message, { id: tId });
    } else {
      toast.error(res.message, { id: tId });
    }
  };

  const currentDateTime = dayjs().format('DD/MM/YYYY HH:mm');

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans text-slate-800 overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* TOP HEADER */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 z-10 shadow-sm">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="text-blue-600"/> Quản lý Tài Khoản & RBAC
            </h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-sm font-medium text-slate-500 bg-slate-100 px-4 py-2 rounded-full border border-slate-200 flex items-center gap-2">
              <Clock size={16}/> {currentDateTime}
            </div>
            
            <div className="flex items-center gap-4 pl-6 border-l border-slate-200">
              <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition">
                <Bell size={20}/>
              </button>
              <div className="flex items-center gap-3 cursor-pointer group" onClick={handleLogout}>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Admin</p>
                  <p className="text-xs text-slate-500">Super Admin</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold border-2 border-white shadow-sm group-hover:bg-blue-600 transition-colors">
                  AD
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* TABS */}
        <div className="bg-white border-b border-slate-200 px-8 flex gap-8 shrink-0">
          <button 
            className={`py-4 font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'USERS' ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
            onClick={() => setActiveTab('USERS')}
          >
            <Users size={18}/> Quản Lý Tài Khoản
          </button>
          <button 
            className={`py-4 font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'RBAC' ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
            onClick={() => setActiveTab('RBAC')}
          >
            <ShieldCheck size={18}/> Ma Trận Phân Quyền (RBAC)
          </button>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto p-8 animate-in fade-in duration-500">
          
          {/* ================= TAB 1: USERS ================= */}
          {activeTab === 'USERS' && (
            <div className="space-y-6">
              
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col xl:flex-row items-center gap-4 justify-between">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="relative group">
                    <input 
                      type="text" 
                      placeholder="Tìm Tên, Email..." 
                      className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 w-64 transition-all outline-none"
                      value={filters.search} onChange={e => setFilters({...filters, search: e.target.value})}
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18}/>
                  </div>
                  <select 
                    className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none w-44"
                    value={filters.role} onChange={e => setFilters({...filters, role: e.target.value})}
                  >
                    <option value="">Tất cả Vai trò</option>
                    <option value="ADMIN">Admin</option>
                    <option value="DOCTOR">Bác sĩ</option>
                    <option value="RECEPTIONIST">Lễ tân</option>
                    <option value="PATIENT">Bệnh nhân</option>
                  </select>
                  <select 
                    className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none w-44"
                    value={filters.status} onChange={e => setFilters({...filters, status: e.target.value})}
                  >
                    <option value="">Tất cả Trạng thái</option>
                    <option value="Hoạt động">Hoạt động</option>
                    <option value="Khóa">Bị khóa</option>
                  </select>
                </div>
                <button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-2.5 rounded-xl font-bold transition flex items-center gap-2 text-sm shadow-sm"
                >
                  <Plus size={18}/> Tạo tài khoản
                </button>
              </div>

              {isLoading ? (
                <div className="py-20 flex justify-center"><div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-xs tracking-wider">
                        <tr>
                          <th className="px-6 py-4">ID</th>
                          <th className="px-6 py-4">Họ Tên & Email</th>
                          <th className="px-6 py-4">Vai trò</th>
                          <th className="px-6 py-4">Ngày tạo</th>
                          <th className="px-6 py-4">Trạng thái</th>
                          <th className="px-6 py-4 text-right">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {users.map((u: any) => (
                          <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 font-bold text-slate-500">#{u.id}</td>
                            <td className="px-6 py-4">
                              <p className="font-bold text-slate-900">{u.fullName || 'Chưa cập nhật'}</p>
                              <p className="text-xs text-slate-500">{u.email}</p>
                            </td>
                            <td className="px-6 py-4">
                              <span className="px-3 py-1 bg-slate-100 text-slate-700 font-bold rounded-lg text-xs">
                                {u.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-slate-500">{dayjs(u.createdAt).format('DD/MM/YYYY')}</td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 text-xs font-bold rounded-lg ${u.status === 'Hoạt động' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                {u.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right space-x-2">
                              <button 
                                onClick={() => handleResetPassword(u.id)}
                                className="inline-flex items-center justify-center p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition" title="Reset Mật Khẩu"
                              >
                                <KeyRound size={16}/>
                              </button>
                              <button 
                                onClick={() => handleToggleLock(u.id, u.status)}
                                className={`inline-flex items-center justify-center p-2 rounded-lg transition ${u.status === 'Hoạt động' ? 'bg-red-50 hover:bg-red-100 text-red-600' : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600'}`}
                                title={u.status === 'Hoạt động' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                              >
                                {u.status === 'Hoạt động' ? <Lock size={16}/> : <Unlock size={16}/>}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= TAB 2: RBAC ================= */}
          {activeTab === 'RBAC' && rbacConfig && (
            <div className="flex gap-8 items-start">
              
              {/* Cột chọn Role */}
              <div className="w-64 shrink-0 space-y-2">
                <h3 className="font-bold text-slate-900 mb-4 px-2 uppercase tracking-wider text-xs">Chọn Vai Trò (Role)</h3>
                {Object.keys(ROLES_MAP).map(roleKey => (
                  <button
                    key={roleKey}
                    onClick={() => setSelectedRole(roleKey)}
                    className={`w-full text-left px-5 py-3.5 rounded-xl font-bold transition flex items-center justify-between ${selectedRole === roleKey ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
                  >
                    {ROLES_MAP[roleKey]}
                  </button>
                ))}
              </div>

              {/* Ma trận Quyền của Role đã chọn */}
              <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                  <div>
                    <h2 className="text-xl font-black text-slate-900">Ma trận quyền: {ROLES_MAP[selectedRole]}</h2>
                    <p className="text-sm text-slate-500 mt-1">Cấp quyền truy cập và thao tác cho các chức năng trong hệ thống.</p>
                  </div>
                  <button 
                    onClick={handleSaveRBAC}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm transition flex items-center gap-2 text-sm"
                  >
                    <Save size={18}/> Lưu Ma Trận
                  </button>
                </div>

                <div className="p-8">
                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="px-6 py-4 font-bold text-slate-800">Module / Chức năng</th>
                          {PERMISSIONS.map(p => (
                            <th key={p.key} className="px-4 py-4 text-center font-bold text-slate-500 text-xs uppercase tracking-wider">{p.label}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {MODULES.map(mod => {
                          const modKey = mod;
                          const currentPerms = rbacConfig[selectedRole]?.[modKey] || [];
                          
                          return (
                            <tr key={mod} className="hover:bg-slate-50/50">
                              <td className="px-6 py-4 font-bold text-slate-700">{mod.replace(/_/g, ' ')}</td>
                              {PERMISSIONS.map(p => {
                                const hasPerm = currentPerms.includes(p.key);
                                return (
                                  <td key={p.key} className="px-4 py-4 text-center">
                                    <input 
                                      type="checkbox"
                                      className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                      checked={hasPerm}
                                      onChange={() => handleTogglePermission(modKey, p.key)}
                                    />
                                  </td>
                                )
                              })}
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* MODAL THÊM TÀI KHOẢN */}
        {isAddModalOpen && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Users className="text-blue-600" size={20}/> Tạo Tài Khoản Mới
                </h3>
                <button onClick={() => setIsAddModalOpen(false)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition">
                  <X size={20}/>
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Vai trò (Role) <span className="text-red-500">*</span></label>
                  <select 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-blue-700 focus:bg-white focus:border-blue-500 outline-none"
                    value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})}
                  >
                    <option value="PATIENT">Bệnh nhân</option>
                    <option value="RECEPTIONIST">Lễ tân</option>
                    <option value="DOCTOR">Bác sĩ</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Họ Tên <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    placeholder="VD: Nguyễn Văn A" 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none"
                    value={newUser.fullName} onChange={e => setNewUser({...newUser, fullName: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Email / Username đăng nhập <span className="text-red-500">*</span></label>
                  <input 
                    type="email" 
                    placeholder="VD: nguyenvana@gmail.com" 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none"
                    value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Mật khẩu khởi tạo <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    placeholder="Mật khẩu..." 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none"
                    value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})}
                  />
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                <button 
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition"
                >
                  Hủy
                </button>
                <button 
                  onClick={handleCreateUser}
                  className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm rounded-xl transition"
                >
                  Khởi Tạo Tài Khoản
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}