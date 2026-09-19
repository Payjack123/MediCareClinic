'use server';

import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function getPatientPrescriptionsData() {
  try {
    const cookieStore = await cookies();
    const userIdStr = cookieStore.get('user_id')?.value;
    if (!userIdStr) return { success: false, message: 'Chưa đăng nhập' };
    const patientId = parseInt(userIdStr);

    const patient = await prisma.user.findUnique({
      where: { id: patientId },
      include: {
        patientProfile: true,
        prescriptions: {
          include: { 
            items: true,
            doctor: { include: { doctorProfile: true } }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!patient) return { success: false, message: 'Không tìm thấy bệnh nhân' };

    const formattedPrescriptions = patient.prescriptions.map((p) => {
      const doctorName = p.doctor ? `BS. ${p.doctor.fullName}` : 'Phòng khám';
      const doctorSpecialty = p.doctor?.doctorProfile?.specialty || 'Khoa Nội';

      let status = p.status || 'Chờ phát';
      if (status === 'Đã phát') status = 'Đang sử dụng';

      const createdDateStr = p.createdAt.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

      const instructions = [];
      if (p.notes) {
        instructions.push(...p.notes.split('\n').filter(Boolean));
      } else {
        instructions.push('Uống thuốc đúng theo hướng dẫn.', 'Uống nhiều nước ấm.', 'Không dùng chung thuốc với người khác.', 'Tái khám nếu không giảm sau 3 ngày.');
      }

      return {
        id: p.id,
        code: p.code,
        patientName: patient.fullName,
        patientCode: patient.patientProfile?.patientCode || `BN${patient.id}`,
        doctor: doctorName,
        doctorSpecialty: doctorSpecialty,
        date: createdDateStr,
        day: p.createdAt.getDate().toString().padStart(2, '0'),
        monthYear: `${String(p.createdAt.getMonth()+1).padStart(2,'0')}/${p.createdAt.getFullYear()}`,
        time: p.createdAt.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        drugCount: p.items.length,
        status: status,
        statusColor: status === 'Đã hoàn thành' ? 'text-green-700 bg-green-100 border-green-200' :
                     status === 'Đang sử dụng' ? 'text-green-700 bg-green-100 border-green-200' :
                     'text-gray-700 bg-gray-100 border-gray-200',
        diagnosis: p.diagnosis || 'Không có chẩn đoán',
        followUpDate: p.followUpDate || '',
        medicines: p.items.map(item => ({
          name: item.medicationName,
          dosage: item.dosage,
          quantity: item.remaining,
          note: item.instructions || item.dosage,
          form: item.iconType === 'liquid' ? 'Dung dịch' : 'Viên'
        })),
        instructions: instructions
      };
    });

    let total = formattedPrescriptions.length;
    let using = formattedPrescriptions.filter(p => p.status === 'Đang sử dụng').length;
    let almostEmpty = using > 0 ? 1 : 0; 
    let completed = formattedPrescriptions.filter(p => p.status === 'Đã hoàn thành').length;

    return {
      success: true,
      data: {
        patientInfo: {
          name: patient.fullName,
          code: patient.patientProfile?.patientCode || `BN${patient.id}`,
          avatar: patient.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(patient.fullName)}&background=2563EB&color=fff`
        },
        prescriptions: formattedPrescriptions,
        kpis: { total, using, almostEmpty, completed }
      }
    };
  } catch (error: any) {
    console.error("Lỗi getPatientPrescriptionsData:", error);
    return { success: false, message: 'Lỗi server', error: error.message };
  }
}

export async function completePrescription(id: number) {
  try {
    await prisma.prescription.update({
      where: { id },
      data: { status: 'Đã hoàn thành' }
    });

    await prisma.prescriptionItem.updateMany({
      where: { prescriptionId: id },
      data: { statusText: 'Đã hoàn thành' }
    });

    return { success: true, message: 'Đã hoàn thành đơn thuốc!' };
  } catch (error: any) {
    console.error("Lỗi completePrescription:", error);
    return { success: false, message: 'Lỗi server', error: error.message };
  }
}

export async function getPrescriptionById(id: number) {
  try {
    const cookieStore = await cookies();
    const userIdStr = cookieStore.get('user_id')?.value;
    if (!userIdStr) return { success: false, message: 'Chưa đăng nhập' };
    const patientId = parseInt(userIdStr);

    const prescription = await prisma.prescription.findUnique({
      where: { id },
      include: {
        items: true,
        doctor: { include: { doctorProfile: true } },
        patient: { include: { patientProfile: true } }
      }
    });

    if (!prescription) return { success: false, message: 'Không tìm thấy đơn thuốc' };
    if (prescription.patientId !== patientId) return { success: false, message: 'Không có quyền truy cập đơn thuốc này' };

    const doctorName = prescription.doctor ? `BS. ${prescription.doctor.fullName}` : 'Phòng khám';
    const doctorSpecialty = prescription.doctor?.doctorProfile?.specialty || 'Khoa Nội';
    
    let status = prescription.status || 'Chờ phát';
    if (status === 'Đã phát') status = 'Đang sử dụng';

    const createdDateStr = prescription.createdAt.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

    const instructions = [];
    if (prescription.notes) {
      instructions.push(...prescription.notes.split('\n').filter(Boolean));
    } else {
      instructions.push('Uống thuốc đúng theo hướng dẫn.', 'Uống nhiều nước ấm.', 'Không dùng chung thuốc với người khác.', 'Tái khám nếu không giảm sau 3 ngày.');
    }

    const data = {
      id: prescription.id,
      code: prescription.code || `DT260917-${prescription.id.toString().padStart(5, '0')}`,
      patientName: prescription.patient.fullName,
      patientCode: prescription.patient.patientProfile?.patientCode || `BN${prescription.patientId}`,
      doctor: doctorName,
      doctorSpecialty: doctorSpecialty,
      date: createdDateStr,
      time: prescription.createdAt.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      status: status,
      statusColor: status === 'Đã hoàn thành' ? 'text-green-700 bg-green-100 border-green-200' :
                   status === 'Đang sử dụng' ? 'text-green-700 bg-green-100 border-green-200' :
                   'text-gray-700 bg-gray-100 border-gray-200',
      diagnosis: prescription.diagnosis || 'Không có chẩn đoán',
      medicines: prescription.items.map(item => ({
        id: item.id,
        name: item.medicationName,
        dosage: item.dosage,
        quantity: item.remaining,
        note: item.instructions || item.dosage,
        form: item.iconType === 'liquid' ? 'Dung dịch' : 'Viên'
      })),
      instructions: instructions
    };

    return { success: true, data };
  } catch (error: any) {
    console.error("Lỗi getPrescriptionById:", error);
    return { success: false, message: 'Lỗi server', error: error.message };
  }
}