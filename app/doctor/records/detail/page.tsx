'use client';
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { getDoctorMedicalRecordById } from "@/app/doctor/records/detail/actions";
import {
   ArrowLeft, Search, Bell, Activity, Stethoscope, Clock, Calendar, Plus, Printer,
   ChevronRight, FileText, Pill, FlaskConical, History, Save, HeartPulse
} from "lucide-react";
import DoctorSidebar from "@/app/doctor/Sidebar";

function MedicalRecordDetailContent() {
   const router = useRouter();
   const searchParams = useSearchParams();
   const id = parseInt(searchParams.get("id") || "0");
   const [activeTab, setActiveTab] = useState("Thông tin khám");
   const [record, setRecord] = useState<any>(null);
   const [isLoading, setIsLoading] = useState(true);
   const [errorMsg, setErrorMsg] = useState<string>("");

   useEffect(() => {
      const fetchData = async () => {
         if (id) {
            try {
               const res = await getDoctorMedicalRecordById(id);
               if (res.success && res.data) {
                  setRecord(res.data);
               } else {
                  setErrorMsg(res.message || "Lỗi lấy dữ liệu");
               }
            } catch (err: any) {
               setErrorMsg(err.message || "Lỗi ngoại lệ");
            }
         }
         setIsLoading(false);
      };
      fetchData();
   }, [id]);

   if (isLoading)
      return (
         <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
            <div className="w-8 h-8 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin"></div>
         </div>
      );

   if (!id || !record) {
      return (
         <div className="flex flex-col items-center justify-center h-screen bg-[#F8FAFC] font-sans">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center max-w-md">
               <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText size={28} />
               </div>
               <h2 className="text-xl font-bold text-gray-900 mb-2">Không tìm thấy bệnh án</h2>
               {errorMsg && <p className="text-red-500 mb-4 font-bold text-sm bg-red-50 p-2 rounded border border-red-100">{errorMsg}</p>}
               <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                  Hồ sơ bệnh án không tồn tại hoặc bạn không có quyền truy cập.
               </p>
               <Link href="/doctor/records" className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#2563EB] text-white rounded-xl text-sm font-bold shadow-sm hover:bg-blue-700 transition-all">
                  Quay lại danh sách
               </Link>
            </div>
         </div>
      );
   }

   const tabs = [
      { name: "Thông tin khám", icon: FileText },
      { name: "Sức khỏe", icon: Activity },
      { name: "Chẩn đoán", icon: Stethoscope },
      { name: "Điều trị", icon: HeartPulse },
      { name: "Đơn thuốc", icon: Pill },
      { name: "Xét nghiệm", icon: FlaskConical },
      { name: "Lịch sử khám", icon: History },
      { name: "Ghi chú", icon: FileText },
   ];

   return (
      <div className="min-h-screen flex bg-[#FAFAFA] font-sans text-gray-800">
         <DoctorSidebar activePage="records" />

         <main className="flex-1 flex flex-col h-screen overflow-hidden">
            {/* TOP HEADER */}
            <header className="bg-white border-b border-gray-100 shrink-0 z-10 px-8 py-4 flex items-center justify-between sticky top-0">
               <div className="flex items-center gap-4">
                  <button onClick={() => router.push("/doctor/records")} className="p-2 hover:bg-gray-50 rounded-full transition-colors text-gray-500">
                     <ArrowLeft size={20} />
                  </button>
                  <div>
                     <h1 className="text-xl font-bold text-gray-900 leading-none mb-1.5 flex items-center gap-2">
                        Hồ sơ bệnh án <span className="text-gray-300">|</span> <span className="text-[#2563EB]">{record.baCode}</span>
                     </h1>
                     <div className="text-[13px] text-gray-500 flex items-center gap-1.5">
                        <Link href="/doctor/patients" className="hover:text-blue-600 transition-colors">Danh sách</Link>
                        <ChevronRight size={12} className="text-gray-400" />
                        <span className="text-gray-700">Chi tiết bệnh án</span>
                     </div>
                  </div>
               </div>

               <div className="flex items-center gap-5">
                  <button className="relative p-2 text-gray-400 hover:bg-gray-50 rounded-full transition-colors">
                     <Bell size={20} />
                     <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                  </button>
                  <div className="flex items-center gap-3 border-l border-gray-100 pl-5">
                     <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-gray-900 leading-tight">BS. {record.doctor}</p>
                        <p className="text-xs text-gray-500">{record.doctorSpecialty}</p>
                     </div>
                     <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(record.doctor)}&background=E0E7FF&color=2563EB`} alt="Doctor" className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                  </div>
               </div>
            </header>

            {/* SCROLLABLE BODY */}
            <div className="flex-1 overflow-y-auto px-8 py-8 custom-scrollbar">
               <div className="max-w-6xl mx-auto space-y-6">

                  {/* PATIENT INFO CARD */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-6 flex items-start justify-between">
                     <div className="flex items-start gap-6">
                        <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(record.patientName)}&background=E0E7FF&color=2563EB&bold=true`} alt="Avatar" className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-sm" />
                        <div>
                           <div className="flex items-center gap-3 mb-2">
                              <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">{record.patientName}</h2>
                              <span className="px-2 py-0.5 bg-blue-50 text-[#2563EB] border border-blue-100 rounded text-xs font-bold flex items-center gap-1">
                                 {record.gender === 'Nam' ? '♂' : '♀'} {record.patientCode}
                              </span>
                           </div>
                           <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-[13px]">
                              <div className="flex items-center"><span className="text-gray-500 w-20">Ngày sinh:</span> <span className="font-medium text-gray-900">{record.patientDob?.includes('-') ? record.patientDob.split('-').reverse().join('/') : record.patientDob}</span></div>
                              <div className="flex items-center"><span className="text-gray-500 w-16">SĐT:</span> <span className="font-medium text-gray-900">{record.patientPhone}</span></div>
                              <div className="flex items-center"><span className="text-gray-500 w-20">CCCD:</span> <span className="font-medium text-gray-900">{record.patientCccd || "Chưa cập nhật"}</span></div>
                              <div className="flex items-center"><span className="text-gray-500 w-16">Nhóm máu:</span> <span className="font-medium text-red-600">{record.bloodType || 'Chưa rõ'}</span></div>
                              <div className="flex items-center col-span-2"><span className="text-gray-500 w-20">Địa chỉ:</span> <span className="font-medium text-gray-900 truncate" title={record.patientAddress}>{record.patientAddress}</span></div>
                           </div>
                        </div>
                     </div>

                     <div className="flex flex-col items-end gap-3 border-l border-gray-100 pl-6 h-full justify-center">
                        <div className="text-right">
                           <p className="text-[11px] font-bold text-gray-500 mb-0.5 uppercase tracking-wider">Ngày khám</p>
                           <p className="text-sm font-bold text-gray-900 flex items-center gap-1.5"><Calendar size={14} className="text-gray-400" /> {record.date}</p>
                        </div>
                        <button className="px-5 py-2 text-[13px] font-bold text-[#2563EB] bg-blue-50 border border-blue-100 rounded-lg hover:bg-blue-100 transition-colors w-40">
                           Xem lịch sử
                        </button>
                        <Link href={`/doctor/records/create?patientId=${record.patientId}`} className="px-5 py-2 text-[13px] font-bold text-white bg-[#2563EB] rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5 w-40 shadow-sm">
                           <Plus size={16} /> Bệnh án mới
                        </Link>
                     </div>
                  </div>

                  {/* TABS */}
                  <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-1">
                     {tabs.map((tab) => (
                        <button
                           key={tab.name}
                           onClick={() => setActiveTab(tab.name)}
                           className={`flex items-center gap-2 px-5 py-2.5 text-[13px] font-bold rounded-xl transition-all whitespace-nowrap ${activeTab === tab.name ? "bg-[#2563EB] text-white shadow-sm" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                        >
                           <tab.icon size={15} /> {tab.name}
                        </button>
                     ))}
                  </div>

                  {/* TAB CONTENTS */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 min-h-[400px]">

                     {/* 1. THÔNG TIN KHÁM */}
                     {activeTab === "Thông tin khám" && (
                        <div className="space-y-6">
                           <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4"><FileText size={20} className="text-[#2563EB]" /> Thông tin lâm sàng & Bệnh sử</h3>
                           <div className="grid grid-cols-2 gap-6">
                              <div className="space-y-4">
                                 <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-2">Lý do đến khám</p>
                                    <p className="font-bold text-gray-900 text-sm">{record.reason || "Không ghi nhận lý do"}</p>
                                 </div>
                                 <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-2">Triệu chứng & Bệnh sử</p>
                                    <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{record.symptoms || "Không có ghi nhận"}</p>
                                 </div>
                              </div>
                              <div className="space-y-4">
                                 <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-2">Tiền sử bệnh</p>
                                    <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{record.medicalHistory || "Không có tiền sử bệnh lý đáng chú ý"}</p>
                                 </div>
                                 <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                                    <p className="text-[11px] text-orange-600 font-bold uppercase tracking-wider mb-2">Tiền sử dị ứng</p>
                                    <p className="text-sm text-orange-800 font-medium">{record.allergies && record.allergies !== 'Không có' ? record.allergies : "Không ghi nhận dị ứng"}</p>
                                 </div>
                              </div>
                           </div>
                        </div>
                     )}

                     {/* 2. SỨC KHỎE */}
                     {activeTab === "Sức khỏe" && (
                        <div>
                           <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6"><Activity size={20} className="text-red-500" /> tình trạng sức khỏe</h3>
                           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                              <div className="bg-red-50 border border-red-100 rounded-2xl p-4 text-center">
                                 <p className="text-[11px] text-red-500 font-bold uppercase mb-1">Huyết áp</p>
                                 <p className="text-2xl font-black text-red-600">{record.vitals.bloodPressure || "--"}</p>
                                 <p className="text-[10px] text-red-400 font-medium">mmHg</p>
                              </div>
                              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-center">
                                 <p className="text-[11px] text-emerald-500 font-bold uppercase mb-1">Nhịp tim</p>
                                 <p className="text-2xl font-black text-emerald-600">{record.vitals.heartRate || "--"}</p>
                                 <p className="text-[10px] text-emerald-400 font-medium">lần/phút</p>
                              </div>
                              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-center">
                                 <p className="text-[11px] text-blue-500 font-bold uppercase mb-1">SpO2</p>
                                 <p className="text-2xl font-black text-blue-600">{record.vitals.spO2 !== "--" ? String(record.vitals.spO2).replace("%", "") : "--"}</p>
                                 <p className="text-[10px] text-blue-400 font-medium">%</p>
                              </div>
                              <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 text-center">
                                 <p className="text-[11px] text-orange-500 font-bold uppercase mb-1">Nhiệt độ</p>
                                 <p className="text-2xl font-black text-orange-600">{record.vitals.temperature || "--"}</p>
                                 <p className="text-[10px] text-orange-400 font-medium">°C</p>
                              </div>

                              <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4 text-center">
                                 <p className="text-[11px] text-purple-500 font-bold uppercase mb-1">Cân nặng</p>
                                 <p className="text-2xl font-black text-purple-600">{record.vitals.weight || "--"}</p>
                                 <p className="text-[10px] text-purple-400 font-medium">kg</p>
                              </div>
                           </div>
                        </div>
                     )}

                     {/* 3. CHẨN ĐOÁN */}
                     {activeTab === "Chẩn đoán" && (
                        <div>
                           <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6"><Stethoscope size={20} className="text-[#2563EB]" /> Kết quả khám & Chẩn đoán</h3>
                           <div className="grid grid-cols-2 gap-6">
                              <div>
                                 <h4 className="text-sm font-bold text-gray-700 mb-3 border-b border-gray-100 pb-2">Khám lâm sàng</h4>
                                 <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed min-h-[120px]">
                                    {record.clinicalExam || "Không ghi nhận khám lâm sàng"}
                                 </div>
                              </div>
                              <div className="space-y-4">
                                 <h4 className="text-sm font-bold text-gray-700 mb-3 border-b border-gray-100 pb-2">Chẩn đoán xác định</h4>
                                 <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                    <p className="text-[11px] text-blue-500 font-bold uppercase tracking-wider mb-1">Chẩn đoán chính</p>
                                    <p className="font-bold text-blue-900 text-sm">{record.diagnosis || "Chưa có chẩn đoán"}</p>
                                 </div>
                                 <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-1">Chẩn đoán phụ</p>
                                    <p className="font-medium text-gray-900 text-sm">{record.secondaryDiagnosis || "Không có chẩn đoán phụ"}</p>
                                 </div>
                              </div>
                           </div>
                        </div>
                     )}

                     {/* 4. ĐIỀU TRỊ */}
                     {activeTab === "Điều trị" && (
                        <div>
                           <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6"><HeartPulse size={20} className="text-emerald-500" /> Hướng điều trị & Kế hoạch</h3>
                           <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100 mb-6">
                              <h4 className="text-[11px] text-emerald-600 font-bold uppercase tracking-wider mb-3">Phác đồ điều trị</h4>
                              <p className="text-sm text-emerald-900 whitespace-pre-wrap leading-relaxed">{record.treatment || "Chưa có hướng điều trị cụ thể"}</p>
                           </div>
                           <div className="bg-orange-50 p-5 rounded-2xl border border-orange-100">
                              <h4 className="text-[11px] text-orange-600 font-bold uppercase tracking-wider mb-3">Kế hoạch tái khám</h4>
                              {record.followUpDate ? (
                                 <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-orange-200 text-orange-700 font-bold">
                                       <Clock size={16} /> {record.followUpDate.split("-").reverse().join("/")} - {record.followUpTime || "00:00"}
                                    </div>
                                    <div className="text-sm font-medium text-orange-900">{record.followUpReason || "Kiểm tra lại sau điều trị"}</div>
                                 </div>
                              ) : (
                                 <p className="text-sm text-orange-800 italic">Không có chỉ định tái khám</p>
                              )}
                           </div>
                        </div>
                     )}

                     {/* TAB ĐƠN THUỐC */}
                     {activeTab === "Đơn thuốc" && (
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                           <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><Pill className="text-blue-600" size={20} /> Danh sách Đơn thuốc</h3>
                           {record.prescriptions && record.prescriptions.length > 0 ? (
                              <div className="space-y-4">
                                 {record.prescriptions.map((px: any) => (
                                    <div key={px.id} className="border border-gray-100 rounded-xl p-4 bg-gray-50/50">
                                       <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-3">
                                          <div>
                                             <p className="font-bold text-gray-900">{px.code || `ĐT-${px.id}`}</p>
                                             <p className="text-xs text-gray-500 mt-1">{new Date(px.createdAt).toLocaleDateString('vi-VN')}</p>
                                          </div>
                                          <div className="flex items-center gap-2">
                                             <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full">{px.items?.length || 0} loại thuốc</span>
                                             <Link href={`/doctor/prescriptions/${px.id}`} className="px-3 py-1 bg-blue-50 text-[#2563EB] text-xs font-bold rounded-full hover:bg-blue-100 transition-colors">Xem chi tiết</Link>
                                          </div>
                                       </div>
                                       {px.items && px.items.length > 0 ? (
                                          <div className="overflow-x-auto mt-2">
                                             <table className="w-full text-sm text-left border-collapse">
                                                <thead className="bg-white border-b border-gray-200 text-gray-500 font-bold text-[11px] uppercase">
                                                   <tr>
                                                      <th className="px-3 py-2">Tên thuốc</th>
                                                      <th className="px-3 py-2">Hàm lượng</th>
                                                      <th className="px-3 py-2 text-center">Số lượng</th>
                                                      <th className="px-3 py-2">Giá thuốc</th>
                                                      <th className="px-3 py-2">Cách dùng</th>
                                                   </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100">
                                                   {px.items.map((item: any, idx: number) => (
                                                      <tr key={item.id} className="hover:bg-white transition-colors">
                                                         <td className="px-3 py-2 font-bold text-gray-800 flex items-center gap-2">
                                                            <span className="w-4">{idx + 1}.</span>
                                                            {item.medicationName}
                                                         </td>
                                                         <td className="px-3 py-2 text-gray-600">{item.dosage || '--'}</td>
                                                         <td className="px-3 py-2 text-center font-bold text-[#2563EB]">{item.remaining}</td>
                                                         <td className="px-3 py-2 text-gray-500 italic">--</td>
                                                         <td className="px-3 py-2 text-gray-600 text-xs italic">{item.instructions}</td>
                                                      </tr>
                                                   ))}
                                                </tbody>
                                             </table>
                                          </div>
                                       ) : (
                                          <p className="text-sm text-gray-500 italic">Không có chi tiết thuốc.</p>
                                       )}
                                    </div>
                                 ))}
                              </div>
                           ) : (
                              <div className="text-center py-10 text-gray-500"><Pill size={40} className="mx-auto text-gray-300 mb-3" /> Chưa có đơn thuốc nào cho bệnh nhân này.</div>
                           )}
                        </div>
                     )}

                     {/* TAB XÉT NGHIỆM */}
                     {activeTab === "Xét nghiệm" && (
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                           <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><FlaskConical className="text-purple-600" size={20} /> Kết quả Xét nghiệm</h3>
                           {record.labTests && record.labTests.length > 0 ? (
                              <div className="space-y-4">
                                 {record.labTests.map((test: any) => (
                                    <div key={test.id} className="border border-gray-100 rounded-xl p-4 bg-gray-50/50 flex justify-between items-center">
                                       <div>
                                          <p className="font-bold text-gray-900">{test.testName || 'Xét nghiệm'}</p>
                                          <p className="text-xs text-gray-500 mt-1">Thực hiện: {new Date(test.date).toLocaleDateString('vi-VN')}</p>
                                       </div>
                                       <div className="text-right">
                                          <div className="flex justify-end items-center gap-2 mb-2">
                                             <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-bold rounded-full inline-block">
                                                {test.statusType === 'evaluated' ? 'Đã đánh giá' :
                                                   test.statusType === 'ordered' ? 'Đã chỉ định' :
                                                      test.statusType === 'waiting' ? 'Chờ kết quả' :
                                                         test.statusType === 'has_result' ? 'Có kết quả' :
                                                            test.statusType === 'completed' ? 'Hoàn thành' :
                                                               test.statusType || 'Hoàn thành'}
                                             </span>
                                             <Link href="/doctor/test-results" className="px-3 py-1 bg-blue-50 text-[#2563EB] text-xs font-bold rounded-full hover:bg-blue-100 transition-colors">Xem chi tiết</Link>
                                          </div>
                                          <p className="text-sm font-medium text-gray-800">{(() => {
                                             let res = test.result || 'Chưa có kết quả';
                                             try {
                                                if (test.notes) {
                                                   const n = typeof test.notes === 'string' ? JSON.parse(test.notes) : test.notes;
                                                   if (n.evaluation) res = n.evaluation;
                                                }
                                             } catch (e) { }
                                             return res;
                                          })()}</p>
                                       </div>
                                    </div>
                                 ))}
                              </div>
                           ) : (
                              <div className="text-center py-10 text-gray-500"><FlaskConical size={40} className="mx-auto text-gray-300 mb-3" /> Chưa có dữ liệu xét nghiệm.</div>
                           )}
                        </div>
                     )}

                     {/* TAB LỊCH SỬ KHÁM */}
                     {activeTab === "Lịch sử khám" && (
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                           <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><History className="text-teal-600" size={20} /> Lịch sử khám bệnh</h3>
                           {record.pastVisits && record.pastVisits.length > 0 ? (
                              <div className="relative border-l-2 border-gray-100 ml-3 pl-6 space-y-6">
                                 {record.pastVisits.map((visit: any) => (
                                    <div key={visit.id} className="relative">
                                       <div className="absolute w-4 h-4 bg-teal-500 rounded-full -left-[31px] top-1 border-4 border-white shadow-sm"></div>
                                       <p className="text-sm font-bold text-teal-600 mb-1">{visit.date} <span className="text-gray-400 font-normal ml-2">({visit.doctorName})</span></p>
                                       <div className="bg-gray-50/80 p-4 rounded-xl border border-gray-100 mt-2">
                                          <p className="text-sm text-gray-800"><span className="font-semibold">Chẩn đoán:</span> {visit.diagnosis}</p>
                                          <p className="text-sm text-gray-600 mt-1"><span className="font-semibold">Triệu chứng:</span> {visit.symptoms}</p>
                                       </div>
                                    </div>
                                 ))}
                              </div>
                           ) : (
                              <div className="text-center py-10 text-gray-500"><History size={40} className="mx-auto text-gray-300 mb-3" /> Chưa có lịch sử khám trước đây.</div>
                           )}
                        </div>
                     )}

                     {/* TAB GHI CHÚ */}
                     {activeTab === "Ghi chú" && (
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                           <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><FileText className="text-amber-600" size={20} /> Ghi chú bác sĩ</h3>
                           {record.notes ? (
                              <div className="bg-amber-50 p-5 rounded-xl border border-amber-100">
                                 <p className="text-sm text-amber-900 whitespace-pre-wrap leading-relaxed">{record.notes}</p>
                              </div>
                           ) : (
                              <div className="text-center py-10 text-gray-500"><FileText size={40} className="mx-auto text-gray-300 mb-3" /> Không có ghi chú nào cho bệnh án này.</div>
                           )}
                        </div>
                     )}

                  </div>
               </div>
            </div>
         </main>
      </div>
   );
}

export default function MedicalRecordDetail() {
   return (
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]"><div className="w-8 h-8 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin"></div></div>}>
         <MedicalRecordDetailContent />
      </Suspense>
   );
}
