'use server';

import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function getDoctorPatientsData() {
  try {
    const cookieStore = await cookies();
    const userIdStr = cookieStore.get('user_id')?.value;
    if (!userIdStr) return { success: false, message: 'Chưa đăng nhập' };
    const doctorId = parseInt(userIdStr);

    const doctor = await prisma.user.findUnique({
      where: { id: doctorId },
      include: { doctorProfile: true }
    });

    if (!doctor) return { success: false, message: 'Không tìm thấy bác sĩ' };

    // Lấy tất cả lịch khám để phân tích bệnh nhân của bác sĩ
    const appointments = await prisma.appointment.findMany({
      where: {
        doctorId: doctorId,
        patientId: { not: doctorId } 
      },
      include: {
        patient: {
          include: { 
            patientProfile: true,
            healthMetric: true,
            examinationsAsPatient: {
              orderBy: { createdAt: 'desc' },
              take: 1
            }
          }
        },
        examination: true
      },
      orderBy: { bookingDate: 'desc' }
    });

    if (appointments.length === 0) {
      return {
        success: true,
        data: {
          doctorInfo: {
            name: doctor.fullName,
            avatar: doctor.avatar || `https://ui-avatars.com/api/?name=${doctor.fullName.replace(/ /g, '+')}&background=172554&color=fff`,
            rating: doctor.doctorProfile?.rating || 5
          },
          patients: [],
          kpis: { total: 0, new: 0, inTreatment: 0, completed: 0 }
        }
      };
    }

    const uniquePatientsMap = new Map();
    const historyMap = new Map();
    const todayStr = new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    let newPatientsTodayCount = 0;

    appointments.forEach(apt => {
      const pId = apt.patientId;

      if (!uniquePatientsMap.has(pId)) {
        let age = 'N/A';
        let dobStr = 'Chưa cập nhật';
        if (apt.patient.dob) {
          dobStr = apt.patient.dob;
          let year;
          if (dobStr.includes('/')) {
            year = dobStr.split('/')[2];
          } else if (dobStr.includes('-')) {
            year = dobStr.split('-')[0];
          } else {
            year = dobStr.substr(-4);
          }

          if (year && !isNaN(parseInt(year))) {
            age = (new Date().getFullYear() - parseInt(year)).toString();
          }
        }

        let lastRecordId = apt.patient.examinationsAsPatient?.[0]?.id || null;

        let statusText = 'Đã từng khám';
        if (apt.status === 'ĐÃ XÁC NHẬN' || apt.status === 'ĐANG KHÁM') {
           statusText = 'Đang theo dõi';
        }
        if (apt.reason?.toLowerCase().includes('tái khám')) {
           statusText = 'Tái khám';
        }

        uniquePatientsMap.set(pId, {
          id: apt.patient.id,
          code: apt.patient.patientProfile?.patientCode || `BN${apt.patient.id.toString().padStart(4, '0')}`,
          name: apt.patient.fullName,
          age: age,
          dob: dobStr,
          gender: apt.patient.gender || 'Nam',
          phone: apt.patient.phone || 'Chưa cập nhật',
          email: apt.patient.email || 'Chưa cập nhật',
          blood: apt.patient.healthMetric?.bloodPressure ? 'Có dữ liệu' : 'Chưa đo',
          address: apt.patient.address || 'Chưa cập nhật',
          spec: apt.specialty || 'Nội tổng quát',
          lastVisit: apt.bookingDate,
          status: statusText,
          statusColor: 'bg-blue-100 text-blue-700 border-blue-200',
          lastRecordId: lastRecordId,
          appointments: [] // Store for filters
        });
      }

      // Add to patient appointments for Today filter
      const pData = uniquePatientsMap.get(pId);
      pData.appointments.push(apt.bookingDate);
      
      if (apt.bookingDate === todayStr) {
         pData.hasTodayAppointment = true;
      }

      if (!historyMap.has(pId)) {
        historyMap.set(pId, []);
      }
      historyMap.get(pId).push({
        id: `LK${apt.id}`,
        date: apt.bookingDate,
        time: apt.bookingTime,
        dept: apt.specialty,
        status: apt.status,
      });
    });

    const formattedPatients = Array.from(uniquePatientsMap.values());
    formattedPatients.forEach(p => {
      p.history = historyMap.get(p.id);
      if (p.hasTodayAppointment && !historyMap.get(p.id).find((h: any) => h.date < todayStr)) {
        newPatientsTodayCount++;
      }
    });

    let inTreatment = 0;
    let completedCount = 0;

    formattedPatients.forEach(p => {
      if (p.status === 'Đang theo dõi' || p.status === 'Tái khám') inTreatment++;
      if (p.status === 'Đã từng khám') completedCount++;
    });

    return {
      success: true,
      data: {
        doctorInfo: {
          name: doctor.fullName,
          avatar: doctor.avatar || `https://ui-avatars.com/api/?name=${doctor.fullName.replace(/ /g, '+')}&background=172554&color=fff`,
          rating: doctor.doctorProfile?.rating || 5
        },
        patients: formattedPatients,
        kpis: {
          total: formattedPatients.length,
          new: newPatientsTodayCount,
          inTreatment: inTreatment,
          completed: completedCount
        }
      }
    };
  } catch (error) {
    console.error('Lỗi Backend:', error);
    return { success: false, message: 'Lỗi khi lấy dữ liệu bệnh nhân' };
  }
}

export async function getPatientDetailForDoctor(patientId: number) {
  try {
    const cookieStore = await cookies();
    const userIdStr = cookieStore.get('user_id')?.value;
    if (!userIdStr) return { success: false, message: 'Chưa đăng nhập' };
    const doctorId = parseInt(userIdStr);

    const doctor = await prisma.user.findUnique({
      where: { id: doctorId },
      include: { doctorProfile: true }
    });

    if (!doctor) return { success: false, message: 'Không tìm thấy bác sĩ' };

    const patient = await prisma.user.findUnique({
      where: { id: patientId, role: 'PATIENT' },
      include: {
        patientProfile: true,
        healthMetric: true,
        appointmentsAsPatient: {
          orderBy: { bookingDate: 'desc' },
          include: {
            doctor: true
          }
        },
        examinationsAsPatient: {
          orderBy: { createdAt: 'desc' },
          include: {
            doctor: true
          }
        },
        prescriptions: {
          orderBy: { createdAt: 'desc' },
          include: {
            doctor: true,
            items: true
          }
        },
        labTests: {
          orderBy: { date: 'desc' }
        }
      }
    });

    if (!patient) return { success: false, message: 'Không tìm thấy bệnh nhân' };

    let age = 'N/A';
    if (patient.dob) {
      const dobStr = patient.dob;
      let year;
      if (dobStr.includes('/')) year = dobStr.split('/')[2];
      else if (dobStr.includes('-')) year = dobStr.split('-')[0];
      else year = dobStr.substr(-4);
      
      if (year && !isNaN(parseInt(year))) {
        age = (new Date().getFullYear() - parseInt(year)).toString();
      }
    }

    const patientData = {
      id: patient.id,
      code: patient.patientProfile?.patientCode || `BN${patient.id.toString().padStart(4, '0')}`,
      name: patient.fullName,
      dob: patient.dob || 'Chưa cập nhật',
      age: age,
      gender: patient.gender || 'Nam',
      phone: patient.phone || 'Chưa cập nhật',
      email: patient.email || 'Chưa cập nhật',
      address: patient.address || 'Chưa cập nhật',
      cccd: patient.patientProfile?.cccd || 'Chưa cập nhật',
      bhyt: patient.patientProfile?.bhyt || 'Chưa cập nhật',
      healthMetric: patient.healthMetric,
      
      // Mảng Lịch hẹn
      appointments: patient.appointmentsAsPatient.map(a => ({
        id: a.id,
        date: a.bookingDate,
        time: a.bookingTime,
        doctor: a.doctor?.fullName || 'Không rõ',
        room: a.room || 'Chưa sắp phòng',
        reason: a.reason || 'Không rõ',
        status: a.status
      })),

      // Mảng Bệnh án
      records: patient.examinationsAsPatient.map(e => ({
        id: e.id,
        date: e.createdAt,
        doctor: e.doctor?.fullName || 'Không rõ',
        diagnosis: e.diagnosis,
        symptoms: e.symptoms
      })),

      // Đơn thuốc
      prescriptions: patient.prescriptions.map(p => ({
        id: p.id,
        code: p.code,
        date: p.createdAt,
        doctor: p.doctor?.fullName || 'Không rõ',
        diagnosis: p.diagnosis || 'Không rõ',
        status: p.status,
        itemCount: p.items?.length || 0
      })),

      // Xét nghiệm
      tests: patient.labTests.map(l => ({
        id: l.id,
        name: l.testName,
        date: l.date,
        doctor: l.doctorName,
        result: l.result,
        status: l.statusType
      }))
    };

    return {
      success: true,
      data: {
        doctorInfo: {
          name: doctor.fullName,
          avatar: doctor.avatar || `https://ui-avatars.com/api/?name=${doctor.fullName.replace(/ /g, '+')}&background=172554&color=fff`
        },
        patient: patientData
      }
    };
  } catch (error) {
    console.error('Lỗi lấy chi tiết bệnh nhân:', error);
    return { success: false, message: 'Lỗi server' };
  }
}