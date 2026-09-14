'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Bell, Clock, Settings, Save, Loader2,
  Building2, CalendarClock, CreditCard, MailWarning, ShieldAlert,
  DatabaseBackup, ListOrdered, CheckCircle2
} from 'lucide-react';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

import Sidebar from '@/app/admin/Sidebar';
import { getGlobalSettings, saveGlobalSettings, getSystemLogs } from '@/app/admin/settings/actions';

export default function AdminSettingsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState('GENERAL');
  
  const [settings, setSettings] = useState<any>({});
  const [logs, setLogs] = useState<any[]>([]);

  const fetchSettings = async () => {
    setIsLoading(true);
    const res = await getGlobalSettings();
    if (res.success && res.data) {
      setSettings(res.data);
    } else if (res.message === 'Không có quyền truy cập') {
      router.push('/login');
    }

    const logRes = await getSystemLogs();
    if (logRes.success && logRes.data) {
      setLogs(logRes.data);
    }
    
    setIsLoading(false);
  };

  useEffect(() => {
    fetchSettings();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => router.push('/login');

  const handleSave = async () => {
    const tId = toast.loading('Đang lưu cấu hình...');
    const res = await saveGlobalSettings(settings);
    if (res.success) {
      toast.success(res.message, { id: tId });
      // Reload logs sau khi save
      const logRes = await getSystemLogs();
      if (logRes.success) setLogs(logRes.data);
    } else {
      toast.error(res.message, { id: tId });
    }
  };

  // Helpers cập nhật state
  const updateGeneral = (field: string, value: any) => setSettings({...settings, general: {...settings.general, [field]: value}});
  const updateClinic = (field: string, value: any) => setSettings({...settings, clinic: {...settings.clinic, [field]: value}});
  const updateAppt = (field: string, value: any) => setSettings({...settings, appointment: {...settings.appointment, [field]: value}});
  const updatePayment = (field: string, value: any) => setSettings({...settings, payment: {...settings.payment, [field]: value}});
  const updateNotif = (field: string, value: any) => setSettings({...settings, notification: {...settings.notification, [field]: value}});
  const updateSec = (field: string, value: any) => setSettings({...settings, security: {...settings.security, [field]: value}});

  const TABS = [
    { id: 'GENERAL', label: 'Cài đặt chung', icon: Settings },
    { id: 'CLINIC', label: 'Phòng khám & Giờ', icon: Building2 },
    { id: 'APPOINTMENT', label: 'Lịch hẹn', icon: CalendarClock },
    { id: 'PAYMENT', label: 'Thanh toán', icon: CreditCard },
    { id: 'NOTIFICATION', label: 'Thông báo', icon: MailWarning },
    { id: 'SECURITY', label: 'Bảo mật', icon: ShieldAlert },
    { id: 'BACKUP', label: 'Sao lưu dữ liệu', icon: DatabaseBackup },
    { id: 'LOGS', label: 'Nhật ký hệ thống', icon: ListOrdered },
  ];

  const currentDateTime = dayjs().format('DD/MM/YYYY HH:mm');

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans text-slate-800 overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* TOP HEADER */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 z-10 shadow-sm">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Settings className="text-blue-600"/> Cài đặt Hệ thống
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

        {/* CẤU TRÚC: MENU TRÁI + NỘI DUNG PHẢI */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* MENU TRÁI */}
          <div className="w-64 bg-white border-r border-slate-200 overflow-y-auto shrink-0 py-6 px-4 space-y-1">
            <p className="px-3 mb-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Danh mục cài đặt</p>
            {TABS.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-sm transition-all ${isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                  <Icon size={18} className={isActive ? 'text-blue-600' : 'text-slate-400'}/>
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* NỘI DUNG PHẢI */}
          <div className="flex-1 overflow-y-auto p-8 relative">
            
            {isLoading ? (
              <div className="py-20 flex justify-center"><Loader2 className="w-10 h-10 text-blue-600 animate-spin" /></div>
            ) : (
              <div className="max-w-4xl pb-24">
                
                {/* HEADER CỦA TAB */}
                <div className="mb-8 flex justify-between items-end border-b border-slate-200 pb-4">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900">{TABS.find(t => t.id === activeTab)?.label}</h2>
                    <p className="text-slate-500 mt-1">Cấu hình các thông số cho hệ thống phòng khám.</p>
                  </div>
                  
                  {activeTab !== 'LOGS' && (
                    <button 
                      onClick={handleSave}
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm transition flex items-center gap-2"
                    >
                      <Save size={18}/> Lưu thay đổi
                    </button>
                  )}
                </div>

                {/* FORM TƯƠNG ỨNG TỪNG TAB */}
                <div className="space-y-6">
                  
                  {activeTab === 'GENERAL' && settings.general && (
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 grid grid-cols-2 gap-6 shadow-sm">
                      <div className="col-span-full md:col-span-1">
                        <label className="block text-sm font-bold text-slate-700 mb-2">Tên phòng khám</label>
                        <input type="text" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none" value={settings.general.clinicName} onChange={e => updateGeneral('clinicName', e.target.value)} />
                      </div>
                      <div className="col-span-full md:col-span-1">
                        <label className="block text-sm font-bold text-slate-700 mb-2">Số điện thoại Hotline</label>
                        <input type="text" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none" value={settings.general.phone} onChange={e => updateGeneral('phone', e.target.value)} />
                      </div>
                      <div className="col-span-full md:col-span-1">
                        <label className="block text-sm font-bold text-slate-700 mb-2">Email hỗ trợ</label>
                        <input type="text" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none" value={settings.general.email} onChange={e => updateGeneral('email', e.target.value)} />
                      </div>
                      <div className="col-span-full md:col-span-1">
                        <label className="block text-sm font-bold text-slate-700 mb-2">Website</label>
                        <input type="text" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none" value={settings.general.website} onChange={e => updateGeneral('website', e.target.value)} />
                      </div>
                      <div className="col-span-full">
                        <label className="block text-sm font-bold text-slate-700 mb-2">Địa chỉ</label>
                        <input type="text" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none" value={settings.general.address} onChange={e => updateGeneral('address', e.target.value)} />
                      </div>
                      <div className="col-span-full md:col-span-1">
                        <label className="block text-sm font-bold text-slate-700 mb-2">Mã số thuế</label>
                        <input type="text" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none" value={settings.general.taxId} onChange={e => updateGeneral('taxId', e.target.value)} />
                      </div>
                    </div>
                  )}

                  {activeTab === 'CLINIC' && settings.clinic && (
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 grid grid-cols-2 gap-6 shadow-sm">
                      <div className="col-span-full md:col-span-1">
                        <label className="block text-sm font-bold text-slate-700 mb-2">Giờ mở cửa (Sáng)</label>
                        <input type="time" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none" value={settings.clinic.openTime} onChange={e => updateClinic('openTime', e.target.value)} />
                      </div>
                      <div className="col-span-full md:col-span-1">
                        <label className="block text-sm font-bold text-slate-700 mb-2">Giờ đóng cửa (Chiều)</label>
                        <input type="time" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none" value={settings.clinic.closeTime} onChange={e => updateClinic('closeTime', e.target.value)} />
                      </div>
                      <div className="col-span-full md:col-span-1">
                        <label className="block text-sm font-bold text-slate-700 mb-2">Bắt đầu nghỉ trưa</label>
                        <input type="time" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none" value={settings.clinic.breakStart} onChange={e => updateClinic('breakStart', e.target.value)} />
                      </div>
                      <div className="col-span-full md:col-span-1">
                        <label className="block text-sm font-bold text-slate-700 mb-2">Kết thúc nghỉ trưa</label>
                        <input type="time" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none" value={settings.clinic.breakEnd} onChange={e => updateClinic('breakEnd', e.target.value)} />
                      </div>
                      <div className="col-span-full">
                        <label className="block text-sm font-bold text-slate-700 mb-2">Ngày làm việc trong tuần</label>
                        <div className="flex gap-2">
                          {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(day => {
                            const isActive = settings.clinic.workDays.includes(day);
                            return (
                              <button 
                                key={day}
                                onClick={() => {
                                  const arr = [...settings.clinic.workDays];
                                  if (isActive) updateClinic('workDays', arr.filter(d => d !== day));
                                  else updateClinic('workDays', [...arr, day]);
                                }}
                                className={`w-12 h-12 rounded-xl font-bold transition ${isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                              >
                                {day}
                              </button>
                            )
                          })}
                        </div>
                        <p className="text-xs text-slate-500 mt-2">Các ngày không được bôi màu sẽ bị khóa lịch hẹn trên hệ thống.</p>
                      </div>
                    </div>
                  )}

                  {activeTab === 'APPOINTMENT' && settings.appointment && (
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 grid grid-cols-2 gap-6 shadow-sm">
                      <div className="col-span-full md:col-span-1">
                        <label className="block text-sm font-bold text-slate-700 mb-2">Thời lượng 1 ca khám (Phút)</label>
                        <input type="number" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none" value={settings.appointment.slotDuration} onChange={e => updateAppt('slotDuration', e.target.value)} />
                      </div>
                      <div className="col-span-full md:col-span-1">
                        <label className="block text-sm font-bold text-slate-700 mb-2">Số lượng tối đa / ca</label>
                        <input type="number" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none" value={settings.appointment.maxPatientsPerSlot} onChange={e => updateAppt('maxPatientsPerSlot', e.target.value)} />
                      </div>
                      <div className="col-span-full md:col-span-1">
                        <label className="block text-sm font-bold text-slate-700 mb-2">Yêu cầu đặt trước (Ngày)</label>
                        <input type="number" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none" value={settings.appointment.bookBeforeDays} onChange={e => updateAppt('bookBeforeDays', e.target.value)} />
                      </div>
                      <div className="col-span-full md:col-span-1">
                        <label className="block text-sm font-bold text-slate-700 mb-2">Cho phép hủy trước (Giờ)</label>
                        <input type="number" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none" value={settings.appointment.cancelBeforeHours} onChange={e => updateAppt('cancelBeforeHours', e.target.value)} />
                      </div>
                      <div className="col-span-full">
                        <label className="flex items-center gap-3 cursor-pointer p-4 border border-slate-200 rounded-xl bg-slate-50">
                          <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked={settings.appointment.allowReschedule} onChange={e => updateAppt('allowReschedule', e.target.checked)} />
                          <span className="font-bold text-slate-700">Cho phép Bệnh nhân tự đổi lịch khám (trên Web/App)</span>
                        </label>
                      </div>
                    </div>
                  )}

                  {activeTab === 'PAYMENT' && settings.payment && (
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-6 shadow-sm">
                      <div className="grid grid-cols-2 gap-6 border-b border-slate-100 pb-6">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Đơn vị tiền tệ hiển thị</label>
                          <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none" value={settings.payment.currency} onChange={e => updatePayment('currency', e.target.value)}>
                            <option value="VNĐ">VNĐ - Việt Nam Đồng</option>
                            <option value="USD">USD - Đô la Mỹ</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Thuế / Phụ thu mặc định (%)</label>
                          <input type="number" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none" value={settings.payment.taxRate} onChange={e => updatePayment('taxRate', e.target.value)} />
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-bold text-slate-900 mb-4">Các Phương thức Thanh toán được chấp nhận</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <label className={`flex items-center gap-3 cursor-pointer p-4 border rounded-xl transition ${settings.payment.enableCash ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-slate-50'}`}>
                            <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked={settings.payment.enableCash} onChange={e => updatePayment('enableCash', e.target.checked)} />
                            <span className="font-bold text-slate-700">Tiền mặt</span>
                          </label>
                          <label className={`flex items-center gap-3 cursor-pointer p-4 border rounded-xl transition ${settings.payment.enableBankTransfer ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-slate-50'}`}>
                            <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked={settings.payment.enableBankTransfer} onChange={e => updatePayment('enableBankTransfer', e.target.checked)} />
                            <span className="font-bold text-slate-700">Chuyển khoản Ngân hàng</span>
                          </label>
                          <label className={`flex items-center gap-3 cursor-pointer p-4 border rounded-xl transition ${settings.payment.enableQR ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-slate-50'}`}>
                            <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked={settings.payment.enableQR} onChange={e => updatePayment('enableQR', e.target.checked)} />
                            <span className="font-bold text-slate-700">Quét mã QR Code</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'NOTIFICATION' && settings.notification && (
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-sm">
                      <label className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer">
                        <div>
                          <p className="font-bold text-slate-800">Email tự động (Lịch hẹn, Hóa đơn)</p>
                          <p className="text-xs text-slate-500 mt-1">Gửi email cho bệnh nhân khi có thay đổi trạng thái đặt lịch, hoặc tạo hóa đơn mới.</p>
                        </div>
                        <div className={`relative w-12 h-6 transition duration-200 ease-linear rounded-full ${settings.notification.emailAppointment ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                          <label htmlFor="emailAppt" className={`absolute left-1 top-1 mb-2 w-4 h-4 rounded-full bg-white transition transform ${settings.notification.emailAppointment ? 'translate-x-6' : ''} cursor-pointer`}></label>
                          <input type="checkbox" id="emailAppt" className="hidden" checked={settings.notification.emailAppointment} onChange={e => updateNotif('emailAppointment', e.target.checked)} />
                        </div>
                      </label>

                      <label className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer">
                        <div>
                          <p className="font-bold text-slate-800">Gửi tin nhắn SMS nhắc lịch hẹn</p>
                          <p className="text-xs text-slate-500 mt-1">Gửi SMS tự động trước 24h (Yêu cầu cấu hình SMS Gateway).</p>
                        </div>
                        <div className={`relative w-12 h-6 transition duration-200 ease-linear rounded-full ${settings.notification.smsReminder ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                          <label htmlFor="smsRem" className={`absolute left-1 top-1 mb-2 w-4 h-4 rounded-full bg-white transition transform ${settings.notification.smsReminder ? 'translate-x-6' : ''} cursor-pointer`}></label>
                          <input type="checkbox" id="smsRem" className="hidden" checked={settings.notification.smsReminder} onChange={e => updateNotif('smsReminder', e.target.checked)} />
                        </div>
                      </label>

                      <label className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer">
                        <div>
                          <p className="font-bold text-slate-800">Hiển thị Thông báo Cảnh báo Hệ thống</p>
                          <p className="text-xs text-slate-500 mt-1">Pop-up nhắc nhở nhân viên về hàng đợi bệnh nhân lâu, hoặc thiếu kết quả XN.</p>
                        </div>
                        <div className={`relative w-12 h-6 transition duration-200 ease-linear rounded-full ${settings.notification.systemAlerts ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                          <label htmlFor="sysAlert" className={`absolute left-1 top-1 mb-2 w-4 h-4 rounded-full bg-white transition transform ${settings.notification.systemAlerts ? 'translate-x-6' : ''} cursor-pointer`}></label>
                          <input type="checkbox" id="sysAlert" className="hidden" checked={settings.notification.systemAlerts} onChange={e => updateNotif('systemAlerts', e.target.checked)} />
                        </div>
                      </label>
                    </div>
                  )}

                  {activeTab === 'SECURITY' && settings.security && (
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 grid grid-cols-2 gap-6 shadow-sm">
                      <div className="col-span-full md:col-span-1">
                        <label className="block text-sm font-bold text-slate-700 mb-2">Số lần đăng nhập sai tối đa (khóa tạm thời)</label>
                        <input type="number" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none" value={settings.security.maxLoginAttempts} onChange={e => updateSec('maxLoginAttempts', e.target.value)} />
                      </div>
                      <div className="col-span-full md:col-span-1">
                        <label className="block text-sm font-bold text-slate-700 mb-2">Tự động đăng xuất sau (Phút không thao tác)</label>
                        <input type="number" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none" value={settings.security.sessionTimeout} onChange={e => updateSec('sessionTimeout', e.target.value)} />
                      </div>
                      <div className="col-span-full">
                        <label className="flex items-center gap-3 cursor-pointer p-4 border border-slate-200 rounded-xl bg-slate-50">
                          <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked={settings.security.requirePasswordChange} onChange={e => updateSec('requirePasswordChange', e.target.checked)} />
                          <span className="font-bold text-slate-700">Yêu cầu người dùng (Bác sĩ/Lễ tân) đổi mật khẩu mỗi 90 ngày</span>
                        </label>
                      </div>
                    </div>
                  )}

                  {activeTab === 'BACKUP' && (
                    <div className="bg-white p-10 rounded-2xl border border-slate-200 text-center shadow-sm">
                      <DatabaseBackup size={64} className="mx-auto text-blue-300 mb-4"/>
                      <h3 className="text-xl font-bold text-slate-900">Sao lưu Dữ liệu Đồ án</h3>
                      <p className="text-slate-500 mt-2 max-w-md mx-auto mb-6">Tính năng này sẽ tạo một file Dump của cơ sở dữ liệu PostgreSQL để bạn có thể khôi phục lại trạng thái hiện tại bất cứ lúc nào.</p>
                      
                      <div className="flex justify-center gap-4">
                        <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm transition" onClick={() => toast.success('Đã chạy tiến trình tạo file Dump PostgreSQL (.sql)')}>
                          Sao lưu ngay (Tạo Dump)
                        </button>
                        <button className="px-6 py-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold rounded-xl transition" onClick={() => toast.error('Tính năng đang bảo trì để tránh mất dữ liệu Demo')}>
                          Khôi phục dữ liệu
                        </button>
                      </div>
                    </div>
                  )}

                  {activeTab === 'LOGS' && (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                      <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex justify-between items-center">
                        <h3 className="font-bold text-slate-900">Nhật Ký Cảnh Báo & Thao Tác (Audit Logs)</h3>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 font-bold text-xs rounded-lg">Ghi nhận 100 log gần nhất</span>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                          <thead className="bg-white border-b border-slate-100 text-slate-400 font-bold uppercase text-xs">
                            <tr>
                              <th className="px-6 py-3">Thời gian</th>
                              <th className="px-6 py-3">Người thực hiện</th>
                              <th className="px-6 py-3">Hành động</th>
                              <th className="px-6 py-3 text-right">Địa chỉ IP</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                            {logs.length > 0 ? logs.map((log: any) => (
                              <tr key={log.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 text-slate-500 whitespace-nowrap">{dayjs(log.time).format('DD/MM/YYYY HH:mm:ss')}</td>
                                <td className="px-6 py-4 font-bold text-slate-800">{log.user}</td>
                                <td className="px-6 py-4 text-blue-600 font-medium">{log.action}</td>
                                <td className="px-6 py-4 text-right text-slate-400 font-mono text-xs">{log.ip}</td>
                              </tr>
                            )) : (
                              <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-400">Không có dữ liệu nhật ký.</td></tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}