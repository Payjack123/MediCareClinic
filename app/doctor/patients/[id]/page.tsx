'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import {
   ChevronLeft, Calendar, User, Phone, MapPin, Droplets, Activity,
   Clock, FileText, Pill, FlaskConical, Stethoscope, Eye
} from 'lucide-react';
import DoctorSidebar from "@/app/doctor/Sidebar";
import { getPatientDetailForDoctor } from '@/app/doctor/patients/actions';

export default function PatientDetailPage() {
   const { id } = useParams();
   const searchParams = useSearchParams();
   const router = useRouter();

   const [patientData, setPatientData] = useState<any>(null);
   const [doctorInfo, setDoctorInfo] = useState<any>(null);
   const [isLoading, setIsLoading] = useState(true);

   // Tabs: info, history, appointments, records, prescriptions, tests
   const initialTab = searchParams.get('tab') || 'info';
   const [activeTab, setActiveTab] = useState(initialTab);

   const fetchData = async () => {
      setIsLoading(true);
      const res = await getPatientDetailForDoctor(Number(id));
      if (res.success && res.data) {
         setPatientData(res.data.patient);
         setDoctorInfo(res.data.doctorInfo);
      } else {
         router.push('/doctor/patients');
      }
      setIsLoading(false);
   };

   useEffect(() => {
      if (id) {
         fetchData();
      }
   }, [id]);

   if (isLoading || !patientData) {
      return (
         <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
            <div className="w-10 h-10 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin"></div>
         </div>
      );
   }

   const tabs = [
      { id: 'info', label: 'Thông tin', icon: <User size={16} /> },
      { id: 'history', label: 'Lịch sử khám', icon: <Clock size={16} /> },
      { id: 'appointments', label: 'Lịch hẹn', icon: <Calendar size={16} /> },
      { id: 'records', label: 'Bệnh án', icon: <FileText size={16} /> },
      { id: 'prescriptions', label: 'Đơn thuốc', icon: <Pill size={16} /> },
      { id: 'tests', label: 'Xét nghiệm', icon: <FlaskConical size={16} /> }
   ];

   return (
      <div className="min-h-screen flex bg-[#F8FAFC] font-sans text-gray-800">
         <DoctorSidebar activePage="patients" />

         <main className="flex-1 flex flex-col h-screen overflow-hidden bg-white">
            {/* HEADER */}
            <header className="bg-white border-b border-gray-100 px-8 h-20 shrink-0 flex items-center justify-between sticky top-0 z-10">
               <div className="flex items-center gap-4">
                  <button onClick={() => router.push('/doctor/patients')} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors">
                     <ChevronLeft size={20} />
                  </button>
                  <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                     Chi tiết bệnh nhân <span className="text-gray-400 font-normal">|</span> <span className="text-[#2563EB]">{patientData.code}</span>
                  </h1>
               </div>
               <div className="flex items-center gap-3">
                  <div className="text-right">
                     <p className="text-sm font-bold text-gray-900">BS. {doctorInfo?.name}</p>
                     <p className="text-xs text-gray-500">Khoa Nội tổng quát</p>
                  </div>
                  <img src={doctorInfo?.avatar} alt="Doctor" className="w-10 h-10 rounded-full border border-gray-200 object-cover" />
               </div>
            </header>

            <div className="flex-1 overflow-y-auto custom-scrollbar bg-gray-50/30">

               {/* PROFILE HEADER CARD */}
               <div className="bg-white border-b border-gray-200">
                  <div className="max-w-6xl mx-auto px-8 py-6">
                     <div className="flex items-start gap-6">
                        <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(patientData.name)}&background=random`} alt={patientData.name} className="w-24 h-24 rounded-2xl border-4 border-white shadow-sm object-cover" />
                        <div className="flex-1">
                           <div className="flex justify-between items-start">
                              <div>
                                 <h2 className="text-2xl font-bold text-gray-900 uppercase">{patientData.name}</h2>
                                 <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                    <div className="flex items-center gap-1.5"><Calendar size={14} className="text-gray-400" /> {patientData.dob} ({patientData.age} tuổi)</div>
                                    <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                                    <div className="flex items-center gap-1.5"><User size={14} className="text-gray-400" /> Giới tính: {patientData.gender}</div>
                                 </div>
                              </div>
                              <Link href={`/doctor/records/create?patientId=${patientData.id}`} className="px-5 py-2.5 bg-[#2563EB] text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2">
                                 <Stethoscope size={16} /> Tạo bệnh án mới
                              </Link>
                           </div>

                           <div className="grid grid-cols-3 gap-6 mt-6 pt-6 border-t border-gray-100">
                              <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600"><Phone size={16} /></div>
                                 <div>
                                    <p className="text-xs text-gray-500 font-medium">Số điện thoại</p>
                                    <p className="font-bold text-gray-900">{patientData.phone}</p>
                                 </div>
                              </div>
                              <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600"><MapPin size={16} /></div>
                                 <div>
                                    <p className="text-xs text-gray-500 font-medium">Địa chỉ</p>
                                    <p className="font-bold text-gray-900 truncate max-w-[200px]" title={patientData.address}>{patientData.address}</p>
                                 </div>
                              </div>
                              <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600"><Droplets size={16} /></div>
                                 <div>
                                    <p className="text-xs text-gray-500 font-medium">Nhóm máu</p>
                                    <p className="font-bold text-gray-900">{patientData.healthMetric?.bloodType || 'Chưa cập nhật'}</p>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* TABS MENU */}
                  <div className="max-w-6xl mx-auto px-8 flex gap-6">
                     {tabs.map(tab => (
                        <button
                           key={tab.id}
                           onClick={() => setActiveTab(tab.id)}
                           className={`flex items-center gap-2 pb-4 text-sm font-bold border-b-2 transition-colors ${activeTab === tab.id ? 'border-[#2563EB] text-[#2563EB]' : 'border-transparent text-gray-500 hover:text-gray-700'
                              }`}
                        >
                           {tab.icon} {tab.label}
                        </button>
                     ))}
                  </div>
               </div>

               {/* TAB CONTENT */}
               <div className="max-w-6xl mx-auto px-8 py-8">

                  {/* TAB THÔNG TIN */}
                  {activeTab === 'info' && (
                     <div className="grid grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                           <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2"><User size={20} className="text-[#2563EB]" /> Thông tin hành chính</h3>
                           <div className="space-y-4">
                              <div className="flex justify-between pb-3 border-b border-gray-50">
                                 <span className="text-gray-500 text-sm">Họ và tên</span>
                                 <span className="font-bold text-gray-900 text-sm">{patientData.name}</span>
                              </div>
                              <div className="flex justify-between pb-3 border-b border-gray-50">
                                 <span className="text-gray-500 text-sm">Mã bệnh nhân</span>
                                 <span className="font-bold text-gray-900 text-sm">{patientData.code}</span>
                              </div>
                              <div className="flex justify-between pb-3 border-b border-gray-50">
                                 <span className="text-gray-500 text-sm">CCCD / Passport</span>
                                 <span className="font-bold text-gray-900 text-sm">{patientData.cccd}</span>
                              </div>
                              <div className="flex justify-between pb-3 border-b border-gray-50">
                                 <span className="text-gray-500 text-sm">Mã BHYT</span>
                                 <span className="font-bold text-gray-900 text-sm">{patientData.bhyt}</span>
                              </div>
                              <div className="flex justify-between pb-3 border-b border-gray-50">
                                 <span className="text-gray-500 text-sm">Email</span>
                                 <span className="font-bold text-gray-900 text-sm">{patientData.email}</span>
                              </div>
                           </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                           <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2"><Activity size={20} className="text-red-500" /> Chỉ số sinh tồn gần nhất</h3>
                           {patientData.healthMetric ? (
                              <div className="grid grid-cols-2 gap-4">
                                 <div className="p-4 bg-gray-50 rounded-xl">
                                    <p className="text-xs text-gray-500 font-medium mb-1">Huyết áp</p>
                                    <p className="font-black text-xl text-gray-900">{patientData.healthMetric.bloodPressure} <span className="text-xs font-medium text-gray-400">mmHg</span></p>
                                 </div>
                                 <div className="p-4 bg-gray-50 rounded-xl">
                                    <p className="text-xs text-gray-500 font-medium mb-1">Nhịp tim</p>
                                    <p className="font-black text-xl text-gray-900">{patientData.healthMetric.heartRate} <span className="text-xs font-medium text-gray-400">bpm</span></p>
                                 </div>
                                 <div className="p-4 bg-gray-50 rounded-xl">
                                    <p className="text-xs text-gray-500 font-medium mb-1">Cân nặng</p>
                                    <p className="font-black text-xl text-gray-900">{patientData.healthMetric.weight} <span className="text-xs font-medium text-gray-400">kg</span></p>
                                 </div>
                                 <div className="p-4 bg-gray-50 rounded-xl">
                                    <p className="text-xs text-gray-500 font-medium mb-1">Chiều cao</p>
                                    <p className="font-black text-xl text-gray-900">{patientData.healthMetric.height} <span className="text-xs font-medium text-gray-400">cm</span></p>
                                 </div>
                                 <div className="col-span-2 p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                                    <p className="text-xs text-yellow-700 font-bold mb-1">Tiền sử dị ứng</p>
                                    <p className="font-medium text-sm text-yellow-900">{patientData.healthMetric.allergies}</p>
                                 </div>
                              </div>
                           ) : (
                              <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                                 Chưa có dữ liệu sinh tồn
                              </div>
                           )}
                        </div>
                     </div>
                  )}

                  {/* TAB LỊCH SỬ KHÁM */}
                  {activeTab === 'history' && (
                     <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                           <thead className="bg-gray-50/50 text-gray-500 font-bold text-xs uppercase">
                              <tr>
                                 <th className="px-6 py-4 border-b border-gray-100">Ngày khám</th>
                                 <th className="px-6 py-4 border-b border-gray-100">Lý do khám</th>
                                 <th className="px-6 py-4 border-b border-gray-100">Bác sĩ khám</th>
                                 <th className="px-6 py-4 border-b border-gray-100">Trạng thái</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-gray-50">
                              {patientData.appointments.length > 0 ? patientData.appointments.filter((a: any) => new Date(a.date.split('/').reverse().join('-')) <= new Date()).map((apt: any) => (
                                 <tr key={apt.id} className="hover:bg-gray-50/50">
                                    <td className="px-6 py-4 font-medium">{apt.date} - {apt.time}</td>
                                    <td className="px-6 py-4 text-gray-600 truncate max-w-[250px]">{apt.reason}</td>
                                    <td className="px-6 py-4 text-gray-900">BS. {apt.doctor}</td>
                                    <td className="px-6 py-4">
                                       <span className={`px-2.5 py-1 text-[11px] font-bold rounded-md ${apt.status === 'HOÀN THÀNH' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                                          {apt.status}
                                       </span>
                                    </td>
                                 </tr>
                              )) : (
                                 <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">Chưa có lịch sử khám</td></tr>
                              )}
                           </tbody>
                        </table>
                     </div>
                  )}

                  {/* TAB BỆNH ÁN */}
                  {activeTab === 'records' && (
                     <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <table className="w-full text-left text-sm">
                           <thead className="bg-gray-50/50 text-gray-500 font-bold text-xs uppercase">
                              <tr>
                                 <th className="px-6 py-4 border-b border-gray-100 w-32">Ngày tạo</th>
                                 <th className="px-6 py-4 border-b border-gray-100">Chẩn đoán</th>
                                 <th className="px-6 py-4 border-b border-gray-100">Bác sĩ</th>
                                 <th className="px-6 py-4 border-b border-gray-100 w-24 text-center">Thao tác</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-gray-50">
                              {patientData.records.length > 0 ? patientData.records.map((rec: any) => (
                                 <tr key={rec.id} className="hover:bg-gray-50/50">
                                    <td className="px-6 py-4 font-medium">{new Date(rec.date).toLocaleDateString('vi-VN')}</td>
                                    <td className="px-6 py-4">
                                       <p className="font-bold text-gray-900">{rec.diagnosis}</p>
                                       <p className="text-xs text-gray-500 mt-1 line-clamp-1">{rec.symptoms}</p>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">BS. {rec.doctor}</td>
                                    <td className="px-6 py-4 text-center">
                                       <Link href={`/doctor/records/detail?id=${rec.id}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-semibold transition-colors text-xs bg-white text-gray-700 border-gray-200 hover:bg-gray-50 shadow-sm">
                                          <Eye size={14} /> Xem
                                       </Link>
                                    </td>
                                 </tr>
                              )) : (
                                 <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">Chưa có hồ sơ bệnh án</td></tr>
                              )}
                           </tbody>
                        </table>
                     </div>
                  )}

                  {/* OTHER TABS (Simplified for now) */}
                  {['appointments', 'prescriptions', 'tests'].includes(activeTab) && (
                     <div className="bg-white p-10 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mb-4">
                           {activeTab === 'appointments' && <Calendar size={28} />}
                           {activeTab === 'prescriptions' && <Pill size={28} />}
                           {activeTab === 'tests' && <FlaskConical size={28} />}
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Đang trong quá trình phát triển</h3>
                        <p className="text-gray-500 text-sm max-w-md">Dữ liệu chi tiết cho tab này đang được cập nhật. Vui lòng quay lại sau.</p>
                     </div>
                  )}

               </div>
            </div>
         </main>
      </div>
   );
}
