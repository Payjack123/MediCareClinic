import React from 'react';
import { ActivitySquare, Building, Users, AlertTriangle, User, UserCheck } from 'lucide-react';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function CoordinatorDashboard() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const todayStr = `${yyyy}-${mm}-${dd}`;
  const todayDisplay = `${dd}/${mm}/${yyyy}`;

  // 1. Fetch Today's Schedules
  const todaySchedules = await prisma.doctorSchedule.findMany({
    where: {
      date: todayStr,
    },
    include: {
      doctor: {
        select: { fullName: true }
      },
      clinic: {
        include: {
          specialty: true
        }
      }
    }
  });

  // 2. Phân tích số phòng đang dùng (số clinicId duy nhất)
  const activeRoomsCount = new Set(todaySchedules.map(s => s.clinicId).filter(Boolean)).size;

  // 3. Số ca khám hôm nay
  const schedulesCount = todaySchedules.length;

  // 4. Bệnh nhân đang chờ hôm nay (appointments chưa hoàn thành)
  const waitingPatientsCount = await prisma.appointment.count({
    where: {
      bookingDate: todayStr,
      status: {
        in: ['CHỜ XÁC NHẬN', 'ĐÃ XÁC NHẬN', 'CHECKED_IN'] // Tùy vào status thực tế
      }
    }
  });

  // 5. Build detailed schedule list with appointment counts
  const scheduleDetails = await Promise.all(todaySchedules.map(async (schedule) => {
    // Đếm số lịch hẹn của bác sĩ này trong ngày hôm nay
    const apptCount = await prisma.appointment.count({
      where: {
        doctorId: schedule.doctorId,
        bookingDate: todayStr
      }
    });

    let timeSlotsArr: string[] = [];
    if (schedule.timeSlots) {
      if (typeof schedule.timeSlots === 'string') {
        try { timeSlotsArr = JSON.parse(schedule.timeSlots); } catch(e) {}
      } else if (Array.isArray(schedule.timeSlots)) {
        timeSlotsArr = schedule.timeSlots as string[];
      }
    }
    
    // Giả sử lấy ca đầu tiên làm giờ bắt đầu
    const firstTime = timeSlotsArr.length > 0 ? timeSlotsArr[0] : '08:00';

    return {
      time: firstTime,
      doctor: schedule.doctor?.fullName || 'Bác sĩ ẩn',
      room: schedule.clinic?.roomNumber || schedule.clinic?.name || 'Chưa xếp phòng',
      dept: schedule.clinic?.specialty?.name || 'Đa khoa',
      appointments: apptCount,
      doctorId: schedule.doctorId
    };
  }));

  // Sắp xếp theo giờ
  scheduleDetails.sort((a, b) => a.time.localeCompare(b.time));

  // 6. Cảnh báo tự động (Tạo cảnh báo dựa trên dữ liệu thật)
  const alerts = [];
  
  scheduleDetails.forEach(s => {
    if (s.appointments > 10) {
      alerts.push({
        type: 'amber',
        title: `${s.room} đang quá tải`,
        desc: `Bác sĩ ${s.doctor} có tới ${s.appointments} lịch hẹn hôm nay. Đề xuất điều tiết hoặc xếp thêm phòng.`
      });
    }
  });

  if (schedulesCount === 0) {
    alerts.push({
      type: 'blue',
      title: 'Chưa có lịch khám',
      desc: 'Hôm nay chưa có bác sĩ nào được phân công trực. Vui lòng tạo lịch khám.'
    });
  }

  // Nếu không có cảnh báo nào thì thêm cảnh báo mẫu
  if (alerts.length === 0 && schedulesCount > 0) {
     alerts.push({
        type: 'blue',
        title: 'Vận hành ổn định',
        desc: 'Chưa phát hiện sự cố hay quá tải nào trong các phòng khám hiện tại.'
     });
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Điều Phối Viên</h1>
          <p className="text-gray-500 mt-1">Tổng quan tình hình vận hành phòng khám hôm nay</p>
        </div>
        <div className="flex gap-2 text-sm font-medium">
          <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg">Hôm nay: {todayDisplay}</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 shrink-0">
            <ActivitySquare size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Ca khám hôm nay</p>
            <h3 className="text-3xl font-bold text-gray-800">{schedulesCount}</h3>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shrink-0">
            <Building size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Phòng đang dùng</p>
            <h3 className="text-3xl font-bold text-gray-800">{activeRoomsCount}</h3>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 shrink-0">
            <Users size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">BN đang chờ hôm nay</p>
            <h3 className="text-3xl font-bold text-gray-800">{waitingPatientsCount}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lịch khám hôm nay */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-gray-50 flex justify-between items-center bg-slate-50/50">
            <h2 className="font-bold text-gray-800 text-lg">Lịch Khám Hôm Nay</h2>
            <button className="text-sm text-blue-600 font-medium hover:underline">Xem tất cả</button>
          </div>
          <div className="flex-1 p-5 overflow-y-auto max-h-[500px] custom-scrollbar">
            <div className="space-y-4">
              {scheduleDetails.length > 0 ? scheduleDetails.map((schedule, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-blue-100 hover:shadow-md transition-all bg-white group">
                  <div className="flex items-center gap-4">
                    <div className="w-16 text-center">
                      <span className="font-bold text-gray-800 text-lg block">{schedule.time}</span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <User size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">{schedule.doctor}</h4>
                      <div className="flex flex-wrap items-center text-xs text-gray-500 gap-2 mt-1">
                        <span className="flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100"><Building size={12}/> {schedule.room}</span>
                        <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md">Khoa {schedule.dept}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium border border-emerald-100">
                      <UserCheck size={16} /> {schedule.appointments} lịch hẹn
                    </span>
                  </div>
                </div>
              )) : (
                <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                   <p className="text-slate-500 font-medium">Chưa có lịch khám nào trong hôm nay.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cảnh báo vận hành */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-gray-50 flex items-center gap-2 bg-red-50/30">
            <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600">
              <AlertTriangle size={18} />
            </div>
            <h2 className="font-bold text-gray-800 text-lg">Cảnh Báo Vận Hành</h2>
          </div>
          <div className="flex-1 p-5 overflow-y-auto max-h-[500px] custom-scrollbar">
            <div className="space-y-4">
              {alerts.map((alert, idx) => (
                <div key={idx} className={`p-4 rounded-xl border flex gap-3 
                  ${alert.type === 'amber' ? 'bg-amber-50 border-amber-100' : ''}
                  ${alert.type === 'red' ? 'bg-red-50 border-red-100' : ''}
                  ${alert.type === 'blue' ? 'bg-blue-50 border-blue-100' : ''}
                `}>
                  {alert.type === 'blue' ? (
                     <ActivitySquare className="text-blue-500 shrink-0 mt-0.5" size={18} />
                  ) : (
                     <AlertTriangle className={`shrink-0 mt-0.5 ${alert.type === 'amber' ? 'text-amber-500' : 'text-red-500'}`} size={18} />
                  )}
                  <div>
                    <h4 className={`font-semibold text-sm 
                      ${alert.type === 'amber' ? 'text-amber-800' : ''}
                      ${alert.type === 'red' ? 'text-red-800' : ''}
                      ${alert.type === 'blue' ? 'text-blue-800' : ''}
                    `}>{alert.title}</h4>
                    <p className={`text-xs mt-1
                      ${alert.type === 'amber' ? 'text-amber-700' : ''}
                      ${alert.type === 'red' ? 'text-red-700' : ''}
                      ${alert.type === 'blue' ? 'text-blue-700' : ''}
                    `}>{alert.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
