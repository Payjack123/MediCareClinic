import React from 'react';
import { 
  Users, CheckCircle2, Clock, Activity, ClipboardCheck, 
  ChevronLeft, ChevronRight, Phone, Stethoscope, 
  UserCheck, Ticket, Printer, CalendarPlus, Search, Info
} from 'lucide-react';
import Link from 'next/link';
import { getDashboardData } from './actions';

export const dynamic = 'force-dynamic';

export default async function ReceptionistDashboard() {
  const result = await getDashboardData();
  const { stats, appointments, queue, activeRooms, currentDate } = result.data || {};

  // For the UI, we still want to show 0 if data is not available
  const safeStats = stats || { total: 0, checkedIn: 0, waiting: 0, examining: 0, completed: 0, pendingCheckIn: 0, cancelled: 0 };
  const safeQueue = queue || [];
  const safeAppointments = appointments || [];
  const safeActiveRooms = activeRooms || [];

  return (
    <div className="space-y-6 pb-10">
      
      {/* 1. Stat Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Card 1 */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="bg-blue-50 p-2.5 rounded-xl">
              <Users className="text-blue-500" size={24} />
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 font-medium">Tổng bệnh nhân hôm nay</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">{safeStats.total}</h3>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs">
            <span className="text-green-500 font-medium">+0</span>
            <span className="text-gray-400">so với hôm qua</span>
            <div className="w-16 h-4 bg-gradient-to-r from-transparent to-green-100 rounded-full"></div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="bg-green-50 p-2.5 rounded-xl">
              <UserCheck className="text-green-500" size={24} />
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 font-medium">Đã check-in</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">{safeStats.checkedIn}</h3>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs">
            <span className="text-gray-500 font-medium">{safeStats.total > 0 ? ((safeStats.checkedIn / safeStats.total) * 100).toFixed(1) : 0}% tổng số</span>
            <div className="w-16 h-4 bg-gradient-to-r from-transparent to-green-100 rounded-full"></div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="bg-orange-50 p-2.5 rounded-xl">
              <Clock className="text-orange-500" size={24} />
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 font-medium">Đang chờ khám</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">{safeStats.waiting}</h3>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs">
            <span className="text-orange-500 font-medium">Trung bình chờ 15 phút</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="bg-purple-50 p-2.5 rounded-xl">
              <Stethoscope className="text-purple-500" size={24} />
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 font-medium">Đang khám</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">{safeStats.examining}</h3>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs">
            <span className="text-gray-500 font-medium">Đang hoạt động</span>
          </div>
        </div>

        {/* Card 5 */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="bg-teal-50 p-2.5 rounded-xl">
              <ClipboardCheck className="text-teal-500" size={24} />
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 font-medium">Đã khám</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">{safeStats.completed}</h3>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs">
            <span className="text-gray-500 font-medium">Hôm nay</span>
            <div className="w-16 h-4 bg-gradient-to-r from-transparent to-teal-100 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Hàng đợi khám hiện tại */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-800 text-lg">Hàng đợi khám hiện tại</h3>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <button className="p-1 hover:bg-gray-100 rounded-full transition-colors"><Activity size={16} /></button>
              </div>
            </div>
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <button className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-sm font-medium border border-blue-100 whitespace-nowrap">Tất cả ({safeQueue.length})</button>
                <button className="px-4 py-1.5 bg-white text-gray-600 hover:bg-gray-50 rounded-full text-sm font-medium border border-gray-200 whitespace-nowrap">Đang chờ ({safeStats.waiting})</button>
                <button className="px-4 py-1.5 bg-white text-gray-600 hover:bg-gray-50 rounded-full text-sm font-medium border border-gray-200 whitespace-nowrap">Đang khám ({safeStats.examining})</button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50/50">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Bệnh nhân</th>
                    <th className="px-6 py-4 font-semibold">Bác sĩ - Phòng khám</th>
                    <th className="px-6 py-4 font-semibold">Trạng thái</th>
                    <th className="px-6 py-4 font-semibold text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {safeQueue.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                        Không có bệnh nhân trong hàng đợi.
                      </td>
                    </tr>
                  ) : (
                    safeQueue.map((app: any) => (
                      <tr key={app.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-800">{app.patient.fullName}</div>
                          <div className="text-xs text-gray-500">{app.patient.patientCode || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-700">BS. {app.doctor.fullName}</div>
                          <div className="text-xs text-gray-500">{app.room || 'Chưa xếp phòng'}</div>
                        </td>
                        <td className="px-6 py-4">
                          {app.status === 'ĐÃ XÁC NHẬN' && <span className="px-2.5 py-1 bg-orange-50 text-orange-600 rounded-full text-xs font-medium border border-orange-100">Đang chờ</span>}
                          {app.status === 'ĐANG KHÁM' && <span className="px-2.5 py-1 bg-purple-50 text-purple-600 rounded-full text-xs font-medium border border-purple-100">Đang khám</span>}
                          {app.status === 'CHỜ XÁC NHẬN' && <span className="px-2.5 py-1 bg-gray-50 text-gray-600 rounded-full text-xs font-medium border border-gray-200">Chưa check-in</span>}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium transition-colors">
                            <Phone size={16} /> Gọi số
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50/30 flex justify-end">
              <Link href="/receptionist/queue" className="text-sm text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1">
                Xem tất cả hàng đợi <ChevronRight size={16} />
              </Link>
            </div>
          </div>

          {/* Thao tác nhanh */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h3 className="font-bold text-gray-800 text-lg">Thao tác nhanh</h3>
            </div>
            <div className="p-5 grid grid-cols-2 md:grid-cols-5 gap-4">
              <Link href="/receptionist/check-in" className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50/50 transition-all group">
                <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                  <UserCheck size={24} />
                </div>
                <span className="text-sm font-medium text-gray-700 text-center">Check-in bệnh nhân</span>
              </Link>
              
              <Link href="/receptionist/tickets" className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-green-100 hover:bg-green-50/50 transition-all group">
                <div className="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform">
                  <Ticket size={24} />
                </div>
                <span className="text-sm font-medium text-gray-700 text-center">Cấp số thứ tự</span>
              </Link>

              <button className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-purple-100 hover:bg-purple-50/50 transition-all group">
                <div className="h-12 w-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
                  <Printer size={24} />
                </div>
                <span className="text-sm font-medium text-gray-700 text-center">In phiếu khám</span>
              </button>

              <Link href="/receptionist/appointments" className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-orange-100 hover:bg-orange-50/50 transition-all group">
                <div className="h-12 w-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                  <CalendarPlus size={24} />
                </div>
                <span className="text-sm font-medium text-gray-700 text-center">Thêm lịch hẹn</span>
              </Link>

              <Link href="/receptionist/patients" className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-red-100 hover:bg-red-50/50 transition-all group">
                <div className="h-12 w-12 rounded-full bg-red-50 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                  <Search size={24} />
                </div>
                <span className="text-sm font-medium text-gray-700 text-center">Tìm bệnh nhân</span>
              </Link>
            </div>
          </div>

          {/* Thông báo (MOCK) */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h3 className="font-bold text-gray-800 text-lg">Thông báo hệ thống</h3>
            </div>
            <div className="p-2">
              <div className="flex gap-4 items-start p-3 hover:bg-gray-50 rounded-xl transition-colors">
                <div className="mt-1 text-blue-500 bg-blue-50 rounded-full p-1.5"><Info size={16} /></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-800">Cập nhật hệ thống lấy dữ liệu trực tiếp từ Database thành công.</p>
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap">Vừa xong</span>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Lịch hẹn hôm nay */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-800 text-lg">Lịch hẹn hôm nay</h3>
              <div className="flex items-center gap-3">
                <button className="p-1 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"><ChevronLeft size={18} /></button>
                <span className="text-sm font-medium text-gray-700 border border-gray-200 px-3 py-1.5 rounded-lg flex items-center gap-2">
                  <Clock size={16} className="text-gray-400" /> {currentDate || 'N/A'}
                </span>
                <button className="p-1 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"><ChevronRight size={18} /></button>
              </div>
            </div>
            
            <div className="p-5 space-y-6 max-h-[400px] overflow-y-auto custom-scrollbar">
              {safeAppointments.length === 0 ? (
                <div className="text-center text-gray-500 py-4">Không có lịch hẹn nào hôm nay.</div>
              ) : (
                safeAppointments.map((app: any, idx: number) => {
                  const isLast = idx === safeAppointments.length - 1;
                  const borderClass = isLast ? 'border-transparent pb-0' : 'border-gray-200 pb-2';
                  
                  return (
                    <div key={app.id} className={`relative pl-6 border-l-2 ${borderClass}`}>
                      <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-white border-4 border-blue-500"></div>
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-sm font-bold text-blue-600">{app.bookingTime}</span>
                        <div className="text-right">
                          {app.status === 'CHỜ XÁC NHẬN' && <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200">Chưa check-in</span>}
                          {app.status === 'ĐÃ XÁC NHẬN' && <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">Đã check-in</span>}
                          {app.status === 'ĐANG KHÁM' && <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">Đang khám</span>}
                          {app.status === 'HOÀN THÀNH' && <span className="text-[10px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100">Đã khám</span>}
                        </div>
                      </div>
                      <h4 className="font-semibold text-gray-800">{app.patient.fullName}</h4>
                      <p className="text-xs text-gray-500 mt-1">{app.specialty} - BS. {app.doctor.fullName}</p>
                    </div>
                  );
                })
              )}
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50/30 flex justify-end">
              <Link href="/receptionist/appointments" className="text-sm text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1">
                Xem tất cả lịch hẹn <ChevronRight size={16} />
              </Link>
            </div>
          </div>

          {/* Phòng khám đang hoạt động */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h3 className="font-bold text-gray-800 text-lg">Phòng khám đang hoạt động</h3>
            </div>
            <div className="p-5 grid grid-cols-2 gap-4">
              {safeActiveRooms.length === 0 ? (
                <div className="col-span-2 text-center text-gray-500 py-4">Chưa có phòng khám nào đang hoạt động.</div>
              ) : (
                safeActiveRooms.map((room: any, index: number) => (
                  <div key={index} className="border border-blue-100 bg-white rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                    <div className="p-4 border-b border-gray-50 bg-blue-50/30">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-blue-100 text-blue-600 rounded-lg"><Stethoscope size={16} /></div>
                          <div>
                            <h4 className="font-bold text-gray-800 text-sm">{room.roomName}</h4>
                            <p className="text-[10px] text-gray-500">BS. {room.doctorName}</p>
                          </div>
                        </div>
                        {room.currentlyExamining ? (
                          <span className="text-[10px] font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded border border-purple-100">Đang khám</span>
                        ) : (
                          <span className="text-[10px] font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-100">Sẵn sàng</span>
                        )}
                      </div>
                    </div>
                    <div className="p-4 text-sm space-y-2">
                      {room.currentlyExamining ? (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Bệnh nhân:</span>
                            <span className="font-bold text-gray-800 line-clamp-1 text-right">{room.currentlyExamining.patientName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Giờ khám:</span>
                            <span className="font-medium text-gray-800">{room.currentlyExamining.time}</span>
                          </div>
                        </>
                      ) : (
                        <div className="flex justify-between py-2">
                          <span className="text-gray-500">Trạng thái:</span>
                          <span className="font-medium text-gray-800">Đang chờ bệnh nhân</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-500">Đang chờ:</span>
                        <span className="font-bold text-blue-600">{room.waitingCount} <Users size={12} className="inline" /></span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Thống kê trong ngày */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-800 text-lg">Thống kê trong ngày</h3>
              <select className="text-sm border border-gray-200 rounded-lg px-2 py-1 bg-gray-50 focus:outline-none">
                <option>Hôm nay</option>
              </select>
            </div>
            <div className="p-5 flex items-center gap-6">
              <div className="w-1/2 relative flex justify-center items-center">
                {/* Custom CSS Pie Chart based on stats */}
                <div className="w-32 h-32 rounded-full" style={{
                  background: safeStats.total > 0 ? 
                    `conic-gradient(
                      #22c55e 0% ${((safeStats.checkedIn - safeStats.examining - safeStats.completed) / safeStats.total) * 100}%, 
                      #3b82f6 ${((safeStats.checkedIn - safeStats.examining - safeStats.completed) / safeStats.total) * 100}% ${((safeStats.checkedIn) / safeStats.total) * 100}%, 
                      #f59e0b ${((safeStats.checkedIn) / safeStats.total) * 100}% ${((safeStats.checkedIn + safeStats.pendingCheckIn) / safeStats.total) * 100}%, 
                      #ef4444 ${((safeStats.checkedIn + safeStats.pendingCheckIn) / safeStats.total) * 100}% 100%
                    )` : '#f3f4f6'
                }}></div>
                <div className="absolute inset-0 m-auto w-20 h-20 bg-white rounded-full flex flex-col items-center justify-center">
                  <span className="font-bold text-2xl text-gray-800">{safeStats.total}</span>
                  <span className="text-[10px] text-gray-500 font-medium">Tổng số</span>
                </div>
              </div>
              <div className="w-1/2 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-green-500"></div><span className="text-gray-600">Đã check-in</span></div>
                  <span className="font-medium text-gray-800">{safeStats.total > 0 ? (((safeStats.checkedIn - safeStats.examining - safeStats.completed) / safeStats.total) * 100).toFixed(1) : 0}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div><span className="text-gray-600">Đang & Đã khám</span></div>
                  <span className="font-medium text-gray-800">{safeStats.total > 0 ? (((safeStats.examining + safeStats.completed) / safeStats.total) * 100).toFixed(1) : 0}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-orange-500"></div><span className="text-gray-600">Chưa check-in</span></div>
                  <span className="font-medium text-gray-800">{safeStats.total > 0 ? ((safeStats.pendingCheckIn / safeStats.total) * 100).toFixed(1) : 0}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-red-500"></div><span className="text-gray-600">Đã hủy</span></div>
                  <span className="font-medium text-gray-800">{safeStats.total > 0 ? ((safeStats.cancelled / safeStats.total) * 100).toFixed(1) : 0}%</span>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50/30 flex justify-end">
              <Link href="/receptionist/reports" className="text-sm text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1">
                Xem báo cáo chi tiết <ChevronRight size={16} />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
