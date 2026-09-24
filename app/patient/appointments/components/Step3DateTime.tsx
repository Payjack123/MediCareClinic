import React from 'react';
import { ArrowLeft, ArrowRight, CalendarDays, Clock, Check, MapPin } from 'lucide-react';

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
              // Nếu chọn Theo bác sĩ và có lịch, lấy danh sách ngày có lịch
              const validDates = doctorSchedules && doctorSchedules.length > 0
                ? doctorSchedules.map(s => s.date)
                : null;

              const daysArray = [];
              for (let i = 0; i < 14; i++) {
                const dateObj = new Date();
                dateObj.setDate(dateObj.getDate() + i + 1);

                const dayOfWeek = dateObj.getDay();

                // CHỈ HIỂN THỊ TRONG TUẦN NÀY
                // Nếu gặp ngày Thứ 2 (dayOfWeek === 1) VÀ không phải là ngày đầu tiên của vòng lặp (i > 0)
                // -> Nghĩa là đã sang tuần mới -> Dừng hiển thị
                if (dayOfWeek === 1 && i > 0) {
                  break;
                }

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
                return <div className="text-gray-500 italic p-4">Bác sĩ chưa có lịch làm việc trong 14 ngày tới.</div>;
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
          ) : null}

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🌅</span>
              <h4 className="font-bold text-[#2563EB] text-lg">Buổi sáng</h4>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-3 custom-scrollbar">
              {morningTimes.filter(time => !doctorSchedules || doctorSchedules.length === 0 || (doctorSchedules.find(s => s.date === bookingData.date)?.timeSlots || []).includes(time)).length === 0 ? (
                 <div className="text-gray-400 italic text-sm py-2">Không có ca khám buổi sáng</div>
              ) : morningTimes.filter(time => !doctorSchedules || doctorSchedules.length === 0 || (doctorSchedules.find(s => s.date === bookingData.date)?.timeSlots || []).includes(time)).map((time) => {
                const isBooked = bookedTimes.includes(time);
                const isSelected = patients.find(p => p.id === activePatientId)?.time === time;
                return (
                  <button
                    key={time}
                    disabled={isBooked}
                    onClick={() => setPatients(patients.map(p => p.id === activePatientId ? { ...p, time } : p))}
                    className={`shrink-0 min-w-[100px] py-2.5 rounded-xl text-sm font-bold transition-all border-2 flex items-center justify-center gap-1.5 ${isSelected
                      ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-md transform scale-105'
                      : isBooked
                        ? 'bg-gray-100 text-gray-400 border-gray-100 cursor-not-allowed'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-[#2563EB] hover:text-[#2563EB]'
                      }`}
                  >
                    <Clock size={14} className={isSelected ? 'text-blue-100' : 'text-gray-400'} /> {time}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🌇</span>
              <h4 className="font-bold text-[#2563EB] text-lg">Buổi chiều</h4>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-3 custom-scrollbar">
              {afternoonTimes.filter(time => !doctorSchedules || doctorSchedules.length === 0 || (doctorSchedules.find(s => s.date === bookingData.date)?.timeSlots || []).includes(time)).length === 0 ? (
                 <div className="text-gray-400 italic text-sm py-2">Không có ca khám buổi chiều</div>
              ) : afternoonTimes.filter(time => !doctorSchedules || doctorSchedules.length === 0 || (doctorSchedules.find(s => s.date === bookingData.date)?.timeSlots || []).includes(time)).map((time) => {
                const isBooked = bookedTimes.includes(time);
                const isSelected = patients.find(p => p.id === activePatientId)?.time === time;
                return (
                  <button
                    key={time}
                    disabled={isBooked}
                    onClick={() => setPatients(patients.map(p => p.id === activePatientId ? { ...p, time } : p))}
                    className={`shrink-0 min-w-[100px] py-2.5 rounded-xl text-sm font-bold transition-all border-2 flex items-center justify-center gap-1.5 ${isSelected
                      ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-md transform scale-105'
                      : isBooked
                        ? 'bg-gray-100 text-gray-400 border-gray-100 cursor-not-allowed'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-[#2563EB] hover:text-[#2563EB]'
                      }`}
                  >
                    <Clock size={14} className={isSelected ? 'text-blue-100' : 'text-gray-400'} /> {time}
                  </button>
                );
              })}
            </div>
          </div>
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
