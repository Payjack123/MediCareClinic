'use server';

import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function getDoctorMedicalRecordById(recordId: number) {
  try {
    const cookieStore = await cookies();
    const userIdStr = cookieStore.get('user_id')?.value;
    if (!userIdStr) return { success: false, message: 'Chưa đăng nhập' };
    const doctorId = parseInt(userIdStr);

    const record = await prisma.examination.findUnique({
      where: { id: recordId },
      include: {
        appointment: true,
        patient: {
          include: {
            patientProfile: true,
            healthMetric: true,
            prescriptions: { include: { items: true }, orderBy: { createdAt: 'desc' } },
            labTests: { orderBy: { date: 'desc' } },
            examinationsAsPatient: {
              orderBy: { createdAt: 'desc' },
              include: { doctor: true }
            }
          }
        },
        doctor: {
          include: { doctorProfile: { include: { specialty: true } } }
        }
      }
    });

    if (!record) return { success: false, message: 'Không tìm thấy hồ sơ' };
    if ((record as any).doctorId !== doctorId) return { success: false, message: 'Không có quyền truy cập' };

    let treatmentStr = record.treatment || '';
    let notesStr = record.notes || '';
    if (!record.treatment && notesStr.startsWith('[Hướng điều trị: ')) {
      const endIdx = notesStr.indexOf(']');
      if (endIdx !== -1) {
        treatmentStr = notesStr.substring('[Hướng điều trị: '.length, endIdx);
        notesStr = notesStr.substring(endIdx + 1).trim();
      }
    }

    let age = 'N/A';
    if ((record as any).patient.dob) {
      const year = (record as any).patient.dob.split('/')[2] || (record as any).patient.dob.split('-')[0];
      if (year) age = (new Date().getFullYear() - parseInt(year)).toString();
    }

    const examDateStr = new Date(record.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const examTimeStr = new Date(record.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

      let extractedReason = (record as any).appointment?.reason || 'Khám tổng quát';
      if (extractedReason.includes('Lý do: ')) {
        extractedReason = extractedReason.split('Lý do: ')[1].trim();
      } else if (extractedReason.includes('Lý do khám: ')) {
        extractedReason = extractedReason.split('Lý do khám: ')[1].trim();
      }

    const formattedRecord = {
      id: record.id,
      baCode: `BA-${new Date(record.createdAt).getFullYear().toString().slice(2)}${String(new Date(record.createdAt).getMonth() + 1).padStart(2, '0')}-${record.id.toString().padStart(3, '0')}`,
      patientId: (record as any).patientId,
      patientName: (record as any).patient.fullName,
      patientCode: (record as any).patient.patientProfile?.patientCode || `BN${(record as any).patientId}`,
      patientCccd: (record as any).patient.patientProfile?.cccd || 'Chưa cập nhật',
      patientDob: (record as any).patient.dob || 'Chưa cập nhật',
      patientPhone: (record as any).patient.phone || 'Chưa cập nhật',
      patientAddress: (record as any).patient.address || 'Chưa cập nhật',
      age: age,
      gender: (record as any).patient.gender || 'Nam',
      bloodType: (record as any).patient.healthMetric?.bloodType || 'O+',
      allergies: (record as any).patient.healthMetric?.allergies || 'Không có',
      medicalHistory: (record as any).patient.healthMetric?.medicalHistory || 'Không có',
      date: examDateStr,
      time: examTimeStr,
      doctor: (record as any).doctor.fullName,
      doctorSpecialty: (record as any).doctor.doctorProfile?.specialty?.name || (record as any).appointment?.specialty || 'Đa khoa',
      reason: extractedReason,
      symptoms: record.symptoms || 'Không có ghi nhận',
      clinicalExam: (record as any).clinicalExam || 'Không có ghi nhận',
      diagnosis: record.diagnosis || 'Đang chờ chẩn đoán',
      secondaryDiagnosis: (record as any).secondaryDiagnosis || 'Không có',
      treatment: treatmentStr,
      notes: notesStr,
      followUpDate: (record as any).followUpDate,
      followUpTime: (record as any).followUpTime,
      followUpReason: (record as any).followUpReason,
      vitals: {
        height: (record as any).patient.healthMetric?.height ? `${(record as any).patient.healthMetric.height} cm` : '--',
        weight: (record as any).patient.healthMetric?.weight ? `${(record as any).patient.healthMetric.weight} kg` : '--',
        bloodPressure: (record as any).patient.healthMetric?.bloodPressure || '--',
        heartRate: (record as any).patient.healthMetric?.heartRate ? `${(record as any).patient.healthMetric.heartRate} l/p` : '--',
        temperature: (record as any).patient.healthMetric?.temperature ? `${(record as any).patient.healthMetric.temperature} °C` : '--',
        spO2: (record as any).patient.healthMetric?.spO2 ? `${(record as any).patient.healthMetric.spO2}%` : '--',
        respiratoryRate: (record as any).patient.healthMetric?.respiratoryRate ? `${(record as any).patient.healthMetric.respiratoryRate} l/p` : '--'
      },
      prescriptions: (record as any).patient.prescriptions,
      labTests: (record as any).patient.labTests,
      pastVisits: ((record as any).patient.examinationsAsPatient || [])
        .map((ex: any) => ({
          id: ex.id,
          date: new Date(ex.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }),
          doctorName: ex.doctor?.fullName || 'Bác sĩ',
          diagnosis: ex.diagnosis || 'Chưa có',
          treatment: ex.treatment || 'Chưa có',
          symptoms: ex.symptoms || 'Chưa rõ',
          clinicalExam: (ex as any).clinicalExam || 'Chưa rõ',
          notes: ex.notes || 'Không có ghi chú',
          followUpDate: ex.followUpDate || null,
          followUpTime: ex.followUpTime || null,
          followUpReason: ex.followUpReason || null
        }))
    };

    return { success: true, data: formattedRecord };
  } catch (error) {
    console.error('Lỗi lấy chi tiết BA:', error);
    return { success: false, message: 'Lỗi server' };
  }
}



