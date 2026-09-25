import React from 'react';
import { ArrowLeft, ArrowRight, CalendarDays, Clock, Check, MapPin, Edit3 } from 'lucide-react';

interface Step3DateTimeProps {
  setStep: (step: number) => void;
  patients: any[];
  setPatients: (patients: any[]) => void;
  activePatientId: number;
  bookingData: any;
  setBookingData: (data: any) => void;
  bookingMethod: string | null;
  bookedTimes: string[];
  doctorSchedules?: any[];
}

export default function Step3DateTime({
  setStep, patients, setPatients, activePatientId, bookingData, setBookingData, bookingMethod, bookedTimes, doctorSchedules
}: Step3DateTimeProps) {
  const hasSelectedTime = !!patients.find(p => p.id === activePatientId)?.time;
  const [isEditingTime, setIsEditingTime] = React.useState(!hasSelectedTime);

  const morningTimes: string[] = [];
  for (let h = 6; h <= 11; h++) {
    for (let m = (h === 6 ? 15 : 0); m < 60; m += 15) {
      if (h === 11 && m > 45) break;
      morningTimes.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    }
  }

  const afternoonTimes: string[] = [];
  for (let h = 13; h <= 16; h++) {
    for (let m = (h === 13 ? 30 : 0); m < 60; m += 15) {
      if (h === 16 && m > 15) break;
      afternoonTimes.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    }
  }

  return (
    <div className="p-8 flex-1 flex flex-col animate-in slide-in-from-right-8">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => setStep(2)} className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-600 transition"><ArrowLeft size={20} /></button>
        <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
          <CalendarDays className="text-[#2563EB]" size={28} /> Chọn ngày và giờ khám
          <span className="text-xs text-red-500">(Debug: {doctorSchedules?.length ?? 0} lịch)</span>
        </h2>
      </div>

      <div className="mb-6">
        <p className="text-gray-600">Bệnh nhân: <strong className="text-gray-900">{patients.find(p => p.id === activePatientId)?.name}</strong></p>
        {bookingMethod === 'specialty' && (
          <p className="text-gray-600">Theo chuyên khoa: <strong className="text-gray-900">{bookingData.specialty}</strong></p>
        )}
        {bookingMethod === 'doctor' && (
          <p className="text-gray-600">Theo bác sĩ: <strong className="text-gray-900 uppercase">{bookingData.doctor}</strong></p>
        )}
        {bookingMethod === 'clinic' && (
          <p className="text-gray-600">Theo phòng khám: <strong className="text-gray-900">{bookingData.specialty}</strong></p>
        )}
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="font-bold text-[#2563EB] mb-3 text-lg">Chọn ngày khám:</h3>
          <div className="flex gap-3 overflow-x-auto pb-4 custom-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {(() => {
              // Chỉ lấy các ngày có lịch khám
              const validDates = doctorSchedules ? doctorSchedules.map(s => s.date) : [];

              const daysArray = [];
              for (let i = 0; i < 7; i++) {
                const dateObj = new Date();
                dateObj.setDate(dateObj.getDate() + i + 1);

                const dayOfWeek = dateObj.getDay();

                const dateNum = dateObj.getDate();
                const monthNum = dateObj.getMonth() + 1;
                const year = dateObj.getFullYear();
                const dateString = `${year}-${String(monthNum).padStart(2, '0')}-${String(dateNum).padStart(2, '0')}`;

                // Bỏ qua nếu có lịch của bác sĩ nhưng ngày này không có trong lịch
                if (validDates && !validDates.includes(dateString)) {
                  continue;
                }

                daysArray.push({
                  dateString,
                  displayDay: i === 0 ? 'Ngày mai' : dayOfWeek === 0 ? 'CN' : `T${dayOfWeek + 1}`,
                  displayDate: `${dateNum}/${monthNum}`
                });
              }

              if (daysArray.length === 0) {
                return <div className="text-gray-500 italic p-4 w-full text-center bg-gray-50 rounded-xl">Hiện tại không có lịch khám trống. Vui lòng quay lại và chọn tiêu chí khác.</div>;
              }

              return daysArray.map(({ dateString, displayDay, displayDate }) => {
                const isSelected = bookingData.date === dateString;
                return (
                  <div
                    key={dateString}
                    onClick={() => {
                      setBookingData({ ...bookingData, date: dateString });
                      // Reset time if it's not available in the new date
                      setPatients(patients.map(p => p.id === activePatientId ? { ...p, time: '' } : p));
                      setIsEditingTime(true);
                    }}
                    className={`flex flex-col items-center justify-center shrink-0 w-[85px] h-[95px] rounded-2xl cursor-pointer transition-all border-2 ${isSelected ? 'bg-[#2563EB] border-[#2563EB] text-white shadow-md transform scale-105' : 'bg-white border-gray-200 text-gray-700 hover:border-[#2563EB] hover:text-[#2563EB]'}`}
                  >
                    <span className={`text-sm font-bold mb-1 ${isSelected ? 'text-blue-100' : 'text-gray-500'}`}>{displayDay}</span>
                    <span className="font-black text-xl">{displayDate}</span>
                  </div>
                )
              });
            })()}
          </div>
          <style dangerouslySetInnerHTML={{
            __html: `
            .custom-scrollbar::-webkit-scrollbar { height: 6px; }
            .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 4px; margin-top: 4px; }
            .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
          `}} />
        </div>

        <div className={`transition-opacity ${bookingData.date ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
          <h3 className="font-bold text-[#2563EB] mb-3 text-lg">Giờ khám:</h3>

          {patients.find(p => p.id === activePatientId)?.time ? (
            <div className="mb-6">
              <div className="p-4 rounded-xl border-2 border-[#2563EB] bg-blue-50/50 flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Clock className="text-[#2563EB]" size={24} />
                  <div>
                    <p className="text-2xl font-black text-[#2563EB]">{patients.find(p => p.id === activePatientId)?.time}</p>
                    <p className="text-sm text-gray-600 font-medium">Ngày: {bookingData.date.split('-').reverse().join('/')}</p>
                  </div>
                </div>
                <div className="w-8 h-8 bg-[#2563EB] rounded-full text-white flex items-center justify-center"><Check size={20} strokeWidth={3} /></div>
              </div>
              
              {!isEditingTime && (
                <button 
                  onClick={() => setIsEditingTime(true)}
                  className="w-full py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 font-bold rounded-xl transition flex items-center justify-center gap-2"
                >
                  <Edit3 size={18} /> Đổi giờ khám
                </button>
              )}
            </div>
          ) : null}

          {isEditingTime && (
          <div className="space-y-8 animate-in fade-in slide-in-from-top-2">
            {(!doctorSchedules || doctorSchedules.length === 0) ? (
              <div className="text-gray-400 italic text-sm py-4">Vui lòng chọn ngày khám để xem các ca trống</div>
            ) : (() => {
              const schedulesForDate = doctorSchedules.filter(s => s.date === bookingData.date);
              if (schedulesForDate.length === 0) {
                return <div className="text-gray-400 italic text-sm py-4">Không có lịch khám trong ngày này</div>;
              }

              return schedulesForDate.map(schedule => {
                const morningTimes = schedule.timeSlots.filter((t: string) => parseInt(t.split(':')[0]) < 12);
                const afternoonTimes = schedule.timeSlots.filter((t: string) => parseInt(t.split(':')[0]) >= 12);
                const bookedTimes = schedule.bookedTimes || [];
                
                const clinicInfo = schedule.clinic 
                  ? `${schedule.clinic.name}${schedule.clinic.roomNumber ? ` (P. ${schedule.clinic.roomNumber})` : ''}`
                  : `Phòng khám ${schedule.doctor?.doctorProfile?.specialty?.name || bookingData.specialty || 'Đa khoa'}`;
                
                const docName = schedule.doctor?.fullName || bookingData.doctor;

                return (
                  <div key={schedule.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
                    {/* Header: Cơ sở và Bác sĩ */}
                    <div className="bg-gray-50/80 p-4 border-b border-gray-100">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="text-green-600" size={18} />
                        <h4 className="font-bold text-green-700">{bookingData.facility || 'Cơ sở chính'}</h4>
                      </div>
                      <div className="flex items-center gap-2 pl-1">
                        <div className="w-5 h-5 bg-gray-400 text-white rounded flex items-center justify-center text-[12px] shrink-0">+</div>
                        <p className="font-bold text-gray-800 text-[15px]">
                          {clinicInfo} <span className="mx-2 text-gray-300">•</span> <span className="text-[#2563EB] uppercase">{docName}</span>
                        </p>
                      </div>
                    </div>

                    <div className="p-5">
                      {/* Buổi sáng */}
                      {morningTimes.length > 0 && (
                        <div className="mb-6">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-xl">🌅</span>
                            <h4 className="font-bold text-[#2563EB] text-lg">Buổi sáng</h4>
                          </div>
                          <div className="flex gap-3 overflow-x-auto pb-3 custom-scrollbar">
                            {morningTimes.map((time: string) => {
                              const isBooked = bookedTimes.includes(time);
                              const pData = patients.find(p => p.id === activePatientId);
                              const isSelected = pData?.time === time && pData?.doctorId === schedule.doctorId;
                              
                              return (
                                <button
                                  key={time}
                                  disabled={isBooked}
                                  onClick={() => {
                                    setPatients(patients.map(p => p.id === activePatientId ? { 
                                      ...p, time, 
                                      doctorId: schedule.doctorId, 
                                      doctor: schedule.doctor?.fullName,
                                      facility: bookingData.facility || 'Cơ sở chính'
                                    } : p));
                                    setIsEditingTime(false);
                                  }}
                                  className={`shrink-0 min-w-[100px] py-2.5 rounded-xl text-sm font-bold transition-all border-2 flex items-center justify-center gap-1.5 ${isSelected
                                    ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-md transform scale-105'
                                    : isBooked
                                      ? 'bg-gray-100 text-gray-400 border-gray-100 cursor-not-allowed'
                                      : 'bg-white text-gray-700 border-gray-200 hover:border-[#2563EB] hover:text-[#2563EB]'
                                    }`}
                                >
                                  <Clock size={14} className={isSelected ? 'text-blue-100' : 'text-gray-400'} /> {time}
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      )}

                      {/* Buổi chiều */}
                      {afternoonTimes.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-xl">🌇</span>
                            <h4 className="font-bold text-[#2563EB] text-lg">Buổi chiều</h4>
                          </div>
                          <div className="flex gap-3 overflow-x-auto pb-3 custom-scrollbar">
                            {afternoonTimes.map((time: string) => {
                              const isBooked = bookedTimes.includes(time);
                              const pData = patients.find(p => p.id === activePatientId);
                              const isSelected = pData?.time === time && pData?.doctorId === schedule.doctorId;
                              
                              return (
                                <button
                                  key={time}
                                  disabled={isBooked}
                                  onClick={() => {
                                    setPatients(patients.map(p => p.id === activePatientId ? { 
                                      ...p, time, 
                                      doctorId: schedule.doctorId, 
                                      doctor: schedule.doctor?.fullName,
                                      facility: bookingData.facility || 'Cơ sở chính'
                                    } : p));
                                    setIsEditingTime(false);
                                  }}
                                  className={`shrink-0 min-w-[100px] py-2.5 rounded-xl text-sm font-bold transition-all border-2 flex items-center justify-center gap-1.5 ${isSelected
                                    ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-md transform scale-105'
                                    : isBooked
                                      ? 'bg-gray-100 text-gray-400 border-gray-100 cursor-not-allowed'
                                      : 'bg-white text-gray-700 border-gray-200 hover:border-[#2563EB] hover:text-[#2563EB]'
                                    }`}
                                >
                                  <Clock size={14} className={isSelected ? 'text-blue-100' : 'text-gray-400'} /> {time}
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              });
            })()}
          </div>
          )}
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          disabled={!bookingData.date || !patients.find(p => p.id === activePatientId)?.time}
          onClick={() => setStep(4)}
          className="bg-[#2563EB] text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
        >
          Tiếp tục <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
