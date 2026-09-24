const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../app/patient/dashboard/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const lines = content.split('\n');
const startIdx = lines.findIndex(l => l.includes('{/* SCROLLABLE CONTENT */}'));
const endIdx = lines.findIndex(l => l.includes('</main>')); // Just before main ends, line 298

if (startIdx !== -1 && endIdx !== -1) {
    const before = lines.slice(0, startIdx).join('\n');
    const after = lines.slice(endIdx).join('\n');
    
    const replacement = `        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 animate-in fade-in duration-500">
          
          {/* USER INFO HEADER */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl p-8 mb-8 text-white shadow-lg relative overflow-hidden flex items-center justify-center text-center">
             <div className="absolute top-0 right-0 opacity-10">
               <HeartPulse size={150} />
             </div>
             <div className="relative z-10 flex flex-col items-center">
                <img src={\`https://ui-avatars.com/api/?name=\${encodeURIComponent(data.user.fullName)}&background=fff&color=2563EB\`} alt="Avatar" className="w-20 h-20 rounded-full border-4 border-white/20 shadow-md mb-4" />
                <h1 className="text-3xl font-bold mb-1">Dashboard Bệnh Nhân</h1>
                <p className="text-blue-100 text-lg">{data.user.fullName}</p>
             </div>
          </div>

          {/* ROW 1: 3 Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            
            {/* LỊCH KHÁM SẮP TỚI */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow">
              <div className="p-5 border-b border-gray-50 flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><CalendarDays size={20} /></div>
                <h3 className="font-bold text-gray-900">Lịch khám sắp tới</h3>
              </div>
              <div className="p-5 flex-1 flex flex-col gap-4">
                {data.appointments.length > 0 ? data.appointments.map((apt: any) => {
                  const parsedDate = parseDate(apt.bookingDate);
                  return (
                    <div key={apt.id} className="border border-gray-100 rounded-2xl p-4 hover:shadow-md transition group bg-white">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                           <CalendarDays size={16} className="text-blue-500" />
                           <span className="font-bold text-gray-800">{apt.bookingDate}</span>
                        </div>
                        <span className={\`px-2 py-1 rounded text-xs font-bold \${getStatusStyle(apt.status)}\`}>{apt.status}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-2 text-sm text-gray-600">
                        <Clock size={16} className="text-gray-400 group-hover:text-blue-500 transition-colors" /> <span>{apt.bookingTime}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-2 text-sm text-gray-600">
                        <Stethoscope size={16} className="text-gray-400 group-hover:text-blue-500 transition-colors" /> <span>BS. {apt.doctor?.fullName || 'Chưa xếp'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <LayoutDashboard size={16} className="text-gray-400 group-hover:text-blue-500 transition-colors" /> <span>Phòng: {apt.room || 'Chưa xếp'}</span>
                      </div>
                    </div>
                  );
                }) : (
                  <p className="text-sm text-gray-500 text-center py-4">Chưa có lịch khám sắp tới</p>
                )}
                <Link href="/patient/appointments" className="mt-auto block text-center py-3 w-full bg-blue-50 text-blue-600 rounded-xl font-bold text-sm hover:bg-blue-600 hover:text-white transition">Xem chi tiết lịch</Link>
              </div>
            </div>

            {/* THÔNG BÁO */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow">
              <div className="p-5 border-b border-gray-50 flex items-center gap-3">
                <div className="p-2 bg-amber-50 text-amber-500 rounded-lg"><Bell size={20} /></div>
                <h3 className="font-bold text-gray-900">Thông báo</h3>
              </div>
              <div className="p-5 flex-1 flex flex-col gap-3">
                {data.notifications && data.notifications.length > 0 ? data.notifications.map((notif: any) => (
                  <div key={notif.id} className="flex gap-3 items-start border-b border-gray-50 pb-3 last:border-0 hover:bg-gray-50 p-2 rounded-lg transition-colors cursor-pointer">
                     <div className={\`w-2 h-2 rounded-full mt-1.5 shrink-0 \${notif.isRead ? 'bg-gray-300' : 'bg-amber-500'}\`}></div>
                     <div>
                       <p className={\`text-sm \${notif.isRead ? 'text-gray-600' : 'text-gray-900 font-bold'}\`}>{notif.title}</p>
                       <p className="text-xs text-gray-500 line-clamp-2 mt-1">{notif.message}</p>
                     </div>
                  </div>
                )) : (
                  <p className="text-sm text-gray-500 text-center py-4">Không có thông báo mới</p>
                )}
                <button className="mt-auto block text-center py-3 w-full border border-gray-200 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-50 transition">Xem tất cả</button>
              </div>
            </div>

            {/* HỒ SƠ SỨC KHỎE */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow">
              <div className="p-5 border-b border-gray-50 flex items-center gap-3">
                <div className="p-2 bg-green-50 text-green-600 rounded-lg"><User size={20} /></div>
                <h3 className="font-bold text-gray-900">Hồ sơ sức khỏe</h3>
              </div>
              <div className="p-5 flex-1 flex flex-col gap-4">
                <div className="bg-gradient-to-br from-green-50 to-green-100/50 p-4 rounded-xl border border-green-100/50 text-sm">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-500">Mã bệnh nhân:</span>
                    <span className="font-bold text-green-700">{data.user.patientProfile?.patientCode || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-500">BHYT:</span>
                    <span className="font-bold">{data.user.patientProfile?.bhyt || 'Chưa cập nhật'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">SĐT:</span>
                    <span className="font-bold">{data.user.phone || 'Chưa cập nhật'}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <div className="border border-gray-100 rounded-xl p-3 text-center bg-white shadow-sm">
                    <p className="text-xs text-gray-500 mb-1">Nhóm máu</p>
                    <p className="font-bold text-red-500 text-lg">{data.metric?.bloodType || '--'}</p>
                  </div>
                  <div className="border border-gray-100 rounded-xl p-3 text-center bg-white shadow-sm">
                    <p className="text-xs text-gray-500 mb-1">Huyết áp</p>
                    <p className="font-bold text-blue-500 text-lg">{data.metric?.bloodPressure || '--'}</p>
                  </div>
                  <div className="border border-gray-100 rounded-xl p-3 text-center bg-white shadow-sm">
                    <p className="text-xs text-gray-500 mb-1">Chiều cao</p>
                    <p className="font-bold text-gray-800 text-lg">{data.metric?.height || '--'} <span className="text-xs font-normal">cm</span></p>
                  </div>
                  <div className="border border-gray-100 rounded-xl p-3 text-center bg-white shadow-sm">
                    <p className="text-xs text-gray-500 mb-1">Cân nặng</p>
                    <p className="font-bold text-gray-800 text-lg">{data.metric?.weight || '--'} <span className="text-xs font-normal">kg</span></p>
                  </div>
                </div>
                <Link href="/patient/records" className="mt-auto block text-center py-3 w-full bg-green-50 text-green-600 rounded-xl font-bold text-sm hover:bg-green-600 hover:text-white transition">Chi tiết hồ sơ</Link>
              </div>
            </div>

          </div>

          {/* ROW 2: 3 Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            
            {/* HỒ SƠ BỆNH ÁN GẦN ĐÂY */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow">
              <div className="p-5 border-b border-gray-50 flex items-center gap-3">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><FileText size={20} /></div>
                <h3 className="font-bold text-gray-900">Bệnh án gần đây</h3>
              </div>
              <div className="p-5 flex-1 flex flex-col gap-4">
                {data.medicalRecord ? (
                  <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 group hover:bg-indigo-50 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] uppercase font-bold text-indigo-600 tracking-wider">Lần khám gần nhất</span>
                      <span className="text-xs text-gray-500">{new Date(data.medicalRecord.createdAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                    <p className="font-bold text-gray-900 mb-2 line-clamp-2 leading-relaxed">{data.medicalRecord.diagnosis}</p>
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-indigo-100/50">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600"><Stethoscope size={14}/></div>
                        <div>
                            <p className="text-xs text-gray-500">Bác sĩ điều trị</p>
                            <p className="text-sm font-bold text-gray-800">BS. {data.medicalRecord.doctor?.fullName}</p>
                        </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">Chưa có hồ sơ bệnh án</p>
                )}
                <Link href="/patient/records" className="mt-auto block text-center py-3 w-full bg-indigo-50 text-indigo-600 rounded-xl font-bold text-sm hover:bg-indigo-600 hover:text-white transition">Xem bệnh án</Link>
              </div>
            </div>

            {/* ĐƠN THUỐC ĐANG SỬ DỤNG */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow">
              <div className="p-5 border-b border-gray-50 flex items-center gap-3">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Pill size={20} /></div>
                <h3 className="font-bold text-gray-900">Đơn thuốc sử dụng</h3>
              </div>
              <div className="p-5 flex-1 flex flex-col gap-3">
                {data.prescription?.items?.length > 0 ? (
                  <div className="space-y-3">
                    {data.prescription.items.slice(0,3).map((item: any) => (
                      <div key={item.id} className="flex items-center gap-3 border-b border-gray-50 pb-3 last:border-0 hover:bg-gray-50 p-2 rounded-lg transition-colors cursor-pointer group">
                         <div className="w-10 h-10 bg-purple-50 text-purple-500 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-purple-100 group-hover:scale-110 transition-all"><Pill size={16} /></div>
                         <div className="flex-1 min-w-0">
                           <p className="font-bold text-gray-900 text-sm truncate">{item.medicationName}</p>
                           <p className="text-xs text-gray-500 truncate mt-1">{item.dosage} • {item.instructions}</p>
                         </div>
                      </div>
                    ))}
                    {data.prescription.items.length > 3 && <p className="text-xs text-center text-gray-400 pt-1">+ {data.prescription.items.length - 3} thuốc khác</p>}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">Không có đơn thuốc nào</p>
                )}
                <Link href="/patient/prescriptions" className="mt-auto block text-center py-3 w-full bg-purple-50 text-purple-600 rounded-xl font-bold text-sm hover:bg-purple-600 hover:text-white transition">Xem đơn thuốc</Link>
              </div>
            </div>

            {/* KẾT QUẢ XÉT NGHIỆM */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow">
              <div className="p-5 border-b border-gray-50 flex items-center gap-3">
                <div className="p-2 bg-teal-50 text-teal-600 rounded-lg"><TestTube size={20} /></div>
                <h3 className="font-bold text-gray-900">Kết quả xét nghiệm</h3>
              </div>
              <div className="p-5 flex-1 flex flex-col gap-3">
                {data.labTests?.length > 0 ? (
                  <div className="space-y-3">
                    {data.labTests.map((test: any) => (
                      <div key={test.id} className="flex items-center justify-between border-b border-gray-50 pb-3 last:border-0 hover:bg-gray-50 p-2 rounded-lg transition-colors cursor-pointer">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-500 flex items-center justify-center"><TestTube size={14}/></div>
                            <div>
                                <p className="font-bold text-sm text-gray-900">{test.testName}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{new Date(test.date).toLocaleDateString('vi-VN')}</p>
                            </div>
                        </div>
                        <span className={\`text-[10px] font-bold px-2 py-1 rounded-full \${test.statusType === 'pending' ? 'bg-yellow-50 text-yellow-600 border border-yellow-100' : 'bg-teal-50 text-teal-600 border border-teal-100'}\`}>
                          {test.statusType === 'pending' ? 'Chưa xem' : 'Đã có KQ'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">Chưa có xét nghiệm nào</p>
                )}
                <Link href="/patient/records" className="mt-auto block text-center py-3 w-full bg-teal-50 text-teal-600 rounded-xl font-bold text-sm hover:bg-teal-600 hover:text-white transition">Xem kết quả</Link>
              </div>
            </div>

          </div>

          {/* ROW 3: THANH TOÁN / VIỆN PHÍ */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
            <div className="p-5 border-b border-gray-50 flex items-center gap-3">
              <div className="p-2 bg-rose-50 text-rose-500 rounded-lg"><Wallet size={20} /></div>
              <h3 className="font-bold text-gray-900">Thanh toán & Viện phí</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                
                <div className="col-span-1 md:col-span-2">
                  <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><FileText size={16} className="text-gray-400"/> Các hóa đơn gần đây</h4>
                  {data.invoices?.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {data.invoices.map((inv: any) => (
                        <div key={inv.id} className="flex justify-between items-center p-4 bg-gray-50 hover:bg-white hover:shadow-md transition-all rounded-xl border border-gray-100 cursor-pointer group">
                          <div>
                            <p className="font-bold text-sm text-gray-900 group-hover:text-rose-600 transition-colors">Hóa đơn: {inv.invoiceCode}</p>
                            <p className="text-xs text-gray-500 mt-1">{new Date(inv.createdAt).toLocaleDateString('vi-VN')}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-black text-gray-900">{inv.finalAmount.toLocaleString('vi-VN')} ₫</p>
                            <span className={\`text-[10px] font-bold px-2 py-0.5 rounded mt-1 inline-block \${inv.status === 'Chờ thanh toán' ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'}\`}>{inv.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-xl p-8 text-center">
                        <p className="text-sm text-gray-500">Chưa có hóa đơn nào</p>
                    </div>
                  )}
                </div>

                <div className="bg-gradient-to-br from-rose-50 to-orange-50 p-6 rounded-3xl border border-rose-100 flex flex-col items-center justify-center text-center h-full relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Wallet size={80}/>
                  </div>
                  <div className="relative z-10 w-full flex flex-col items-center">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 text-rose-500">
                          <Wallet size={24} />
                      </div>
                      <p className="text-sm font-bold text-gray-600 mb-1">Tổng nợ chưa thanh toán</p>
                      <p className="text-3xl font-black text-rose-600 mb-6 drop-shadow-sm">
                        {data.invoices?.filter((i:any)=>i.status==='Chờ thanh toán').reduce((acc:number, cur:any) => acc + cur.finalAmount, 0).toLocaleString('vi-VN') || '0'} <span className="text-xl">₫</span>
                      </p>
                      <Link href="/patient/billing" className="w-full py-3.5 bg-rose-500 text-white rounded-xl font-bold text-sm hover:bg-rose-600 hover:shadow-lg hover:shadow-rose-500/30 transition-all active:scale-95 flex items-center justify-center gap-2">
                        Thanh toán ngay <ArrowRight size={16}/>
                      </Link>
                      <p className="text-[10px] font-medium text-rose-600/70 mt-4">* Có hỗ trợ thanh toán qua BHYT</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
`;

    const newContent = before + '\n' + replacement + '\n' + after;
    fs.writeFileSync(filePath, newContent);
    console.log("Successfully replaced content.");
} else {
    console.log("Could not find start or end index.");
}
