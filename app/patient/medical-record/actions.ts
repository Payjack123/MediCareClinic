'use server';

import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

// 1. Lấy danh sách hồ sơ bệnh án (Examinations)
export async function getMedicalRecordsList() {
  try {
    const cookieStore = await cookies();
    const userIdStr = cookieStore.get('user_id')?.value;
    if (!userIdStr) return { success: false, message: 'Chưa đăng nhập' };
    const patientId = parseInt(userIdStr);

    const examinations = await prisma.examination.findMany({
      where: { patientId },
      orderBy: { createdAt: 'desc' },
      include: {
        doctor: { include: { doctorProfile: { include: { specialty: true } } } },
        appointment: true
      }
    });

    const records = examinations.map(exam => ({
      id: exam.id,
      code: exam.appointment?.id ? `HSBA${exam.appointment.id.toString().padStart(6, '0')}` : `HSBA${exam.id.toString().padStart(6, '0')}`,
      date: exam.createdAt.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      time: exam.createdAt.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      doctorName: exam.doctor ? `BS. ${exam.doctor.fullName}` : 'Chưa cập nhật',
      specialty: exam.doctor?.doctorProfile?.specialty?.name || exam.appointment?.specialty || 'Khám bệnh',
      diagnosis: exam.diagnosis || 'Chưa chẩn đoán',
      status: exam.appointment?.status === 'HOÀN THÀNH' ? 'Hoàn thành' : 'Đang điều trị'
    }));

    return {
      success: true,
      data: records
    };
  } catch (error: any) {
    console.error("Lỗi getMedicalRecordsList:", error);
    return { success: false, message: 'Lỗi server', error: error.message };
  }
}

// 2. Lấy chi tiết một hồ sơ bệnh án cụ thể
export async function getMedicalRecordById(recordId: number) {
  try {
    const cookieStore = await cookies();
    const userIdStr = cookieStore.get('user_id')?.value;
    if (!userIdStr) return { success: false, message: 'Chưa đăng nhập' };
    const patientId = parseInt(userIdStr);

    const exam = await prisma.examination.findUnique({
      where: { id: recordId },
      include: {
        doctor: { include: { doctorProfile: { include: { specialty: true } } } },
        appointment: true,
        patient: { include: { healthMetric: true } }
      }
    });

    if (!exam || exam.patientId !== patientId) {
      return { success: false, message: 'Không tìm thấy hồ sơ hoặc không có quyền truy cập' };
    }

    // Find prescription created around the same time
    const examPrescription = await prisma.prescription.findFirst({
      where: {
        patientId,
        status: { not: 'Đã hủy' },
        createdAt: {
          gte: new Date(exam.createdAt.getTime() - 1000 * 60 * 60 * 24),
          lte: new Date(exam.createdAt.getTime() + 1000 * 60 * 60 * 24)
        }
      },
      include: { items: true }
    });

    let treatmentStr = 'Không có hướng điều trị';
    let notesStr = exam.notes || 'Không có ghi chú';
    if (notesStr.startsWith('[Hướng điều trị: ')) {
        const endIdx = notesStr.indexOf(']');
        if (endIdx !== -1) {
            treatmentStr = notesStr.substring('[Hướng điều trị: '.length, endIdx);
            notesStr = notesStr.substring(endIdx + 1).trim();
            if (!notesStr) notesStr = 'Không có ghi chú';
        }
    } else {
        treatmentStr = exam.treatment || 'Chưa có thông tin điều trị';
    }

      let extractedReason = exam.appointment?.reason || 'Không ghi nhận';
      if (extractedReason.includes('Lý do: ')) {
        extractedReason = extractedReason.split('Lý do: ')[1].trim();
      } else if (extractedReason.includes('Lý do khám: ')) {
        extractedReason = extractedReason.split('Lý do khám: ')[1].trim();
      }
      if (!extractedReason) extractedReason = 'Không ghi nhận';

    const detail = {
      id: exam.id,
      code: exam.appointment?.id ? `HSBA${exam.appointment.id.toString().padStart(6, '0')}` : `HSBA${exam.id.toString().padStart(6, '0')}`,
      status: exam.appointment?.status === 'HOÀN THÀNH' ? 'Hoàn thành' : 'Đang điều trị',
      
      // THÔNG TIN KHÁM
      date: `${exam.createdAt.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} - ${exam.createdAt.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}`,
      doctorName: exam.doctor ? `BS. ${exam.doctor.fullName}` : 'Chưa cập nhật',
      specialty: exam.doctor?.doctorProfile?.specialty?.name || exam.appointment?.specialty || 'Khám bệnh',
      reason: extractedReason,
      symptoms: exam.symptoms || 'Không ghi nhận', // Bệnh sử
      medicalHistory: exam.medicalHistory || exam.patient?.healthMetric?.medicalHistory || 'Không có tiền sử bệnh lý', // Tiền sử bệnh
      
      // CHẨN ĐOÁN
      primaryDiagnosis: exam.diagnosis || 'Chưa chẩn đoán',
      secondaryDiagnosis: exam.secondaryDiagnosis || 'Không có',
      conclusion: notesStr,

      // ĐIỀU TRỊ
      treatment: treatmentStr,
      prescriptionId: examPrescription?.id || null,
      
      // TÁI KHÁM
      followUpDate: exam.followUpDate || null,
      followUpTime: exam.followUpTime || null,
      followUpReason: exam.followUpReason || null
    };

    return {
      success: true,
      data: detail
    };
  } catch (error: any) {
    console.error("Lỗi getMedicalRecordById:", error);
    return { success: false, message: 'Lỗi server', error: error.message };
  }
}
