const fs = require('fs');
const filePath = 'e:/WebPhongKham/MediCareClinic/app/patient/appointments/components/Step3DateTime.tsx';
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace('bookedTimes: string[];', 'bookedTimes: string[];\n  doctorSchedules?: any[];');
content = content.replace('bookingMethod, bookedTimes\n}: Step3DateTimeProps)', 'bookingMethod, bookedTimes, doctorSchedules\n}: Step3DateTimeProps)');

const datesRenderCodeOld = `          <div className="flex gap-3 overflow-x-auto pb-4 custom-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {Array.from({ length: 14 }).map((_, i) => {
              const dateObj = new Date();
              dateObj.setDate(dateObj.getDate() + i + 1); // Bắt đầu từ ngày mai
              const dayOfWeek = dateObj.getDay();
              const dateNum = dateObj.getDate();
              const monthNum = dateObj.getMonth() + 1;
              const year = dateObj.getFullYear();
              const dateString = \`\${year}-\${String(monthNum).padStart(2, '0')}-\${String(dateNum).padStart(2, '0')}\`;
              const displayDay = i === 0 ? 'Ngày mai' : dayOfWeek === 0 ? 'CN' : \`T\${dayOfWeek + 1}\`;
              const displayDate = \`\${dateNum}/\${monthNum}\`;
              const isSelected = bookingData.date === dateString;
              
              return (
                <div 
                  key={dateString}
                  onClick={() => setBookingData({ ...bookingData, date: dateString })}
                  className={\`flex flex-col items-center justify-center shrink-0 w-[85px] h-[95px] rounded-2xl cursor-pointer transition-all border-2 \${isSelected ? 'bg-[#2563EB] border-[#2563EB] text-white shadow-md transform scale-105' : 'bg-white border-gray-200 text-gray-700 hover:border-[#2563EB] hover:text-[#2563EB]'}\`}
                >
                  <span className={\`text-sm font-bold mb-1 \${isSelected ? 'text-blue-100' : 'text-gray-500'}\`}>{displayDay}</span>
                  <span className="font-black text-xl">{displayDate}</span>
                </div>
              )
            })}
          </div>`;

const datesRenderCodeNew = `          <div className="flex gap-3 overflow-x-auto pb-4 custom-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
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
                const dateNum = dateObj.getDate();
                const monthNum = dateObj.getMonth() + 1;
                const year = dateObj.getFullYear();
                const dateString = \`\${year}-\${String(monthNum).padStart(2, '0')}-\${String(dateNum).padStart(2, '0')}\`;
                
                // Bỏ qua nếu có lịch của bác sĩ nhưng ngày này không có trong lịch
                if (validDates && !validDates.includes(dateString)) {
                  continue;
                }

                daysArray.push({
                  dateString,
                  displayDay: i === 0 ? 'Ngày mai' : dayOfWeek === 0 ? 'CN' : \`T\${dayOfWeek + 1}\`,
                  displayDate: \`\${dateNum}/\${monthNum}\`
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
                    className={\`flex flex-col items-center justify-center shrink-0 w-[85px] h-[95px] rounded-2xl cursor-pointer transition-all border-2 \${isSelected ? 'bg-[#2563EB] border-[#2563EB] text-white shadow-md transform scale-105' : 'bg-white border-gray-200 text-gray-700 hover:border-[#2563EB] hover:text-[#2563EB]'}\`}
                  >
                    <span className={\`text-sm font-bold mb-1 \${isSelected ? 'text-blue-100' : 'text-gray-500'}\`}>{displayDay}</span>
                    <span className="font-black text-xl">{displayDate}</span>
                  </div>
                )
              });
            })()}
          </div>`;

content = content.replace(datesRenderCodeOld, datesRenderCodeNew);

// Now change the timeslots to only show times from the schedule
const morningTimesOld = `            <div className="flex gap-3 overflow-x-auto pb-3 custom-scrollbar">
              {morningTimes.map((time) => {`;
const morningTimesNew = `            <div className="flex gap-3 overflow-x-auto pb-3 custom-scrollbar">
              {morningTimes.filter(time => !doctorSchedules || doctorSchedules.length === 0 || (doctorSchedules.find(s => s.date === bookingData.date)?.timeSlots || []).includes(time)).length === 0 ? (
                 <div className="text-gray-400 italic text-sm py-2">Không có ca khám buổi sáng</div>
              ) : morningTimes.filter(time => !doctorSchedules || doctorSchedules.length === 0 || (doctorSchedules.find(s => s.date === bookingData.date)?.timeSlots || []).includes(time)).map((time) => {`;

const afternoonTimesOld = `            <div className="flex gap-3 overflow-x-auto pb-3 custom-scrollbar">
              {afternoonTimes.map((time) => {`;
const afternoonTimesNew = `            <div className="flex gap-3 overflow-x-auto pb-3 custom-scrollbar">
              {afternoonTimes.filter(time => !doctorSchedules || doctorSchedules.length === 0 || (doctorSchedules.find(s => s.date === bookingData.date)?.timeSlots || []).includes(time)).length === 0 ? (
                 <div className="text-gray-400 italic text-sm py-2">Không có ca khám buổi chiều</div>
              ) : afternoonTimes.filter(time => !doctorSchedules || doctorSchedules.length === 0 || (doctorSchedules.find(s => s.date === bookingData.date)?.timeSlots || []).includes(time)).map((time) => {`;

content = content.replace(morningTimesOld, morningTimesNew);
content = content.replace(afternoonTimesOld, afternoonTimesNew);

fs.writeFileSync(filePath, content);
console.log('Replaced Step 3 successfully');
