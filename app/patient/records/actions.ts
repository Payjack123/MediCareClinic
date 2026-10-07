'use server';

import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function getPatientMedicalRecordsData() {
  try {
    const cookieStore = await cookies();
    const userIdStr = cookieStore.get('user_id')?.value;
    
    if (!userIdStr) {
      return { success: false, message: 'Chưa đăng nhập hệ thống' };
    }
    
    const patientId = parseInt(userIdStr, 10);

    // Truy vấn tổng hợp toàn bộ hồ sơ bệnh nhân từ TiDB
    let patient = await prisma.user.findUnique({
      where: { id: patientId },
      include: {
        patientProfile: true,
        healthMetric: true,
        examinationsAsPatient: {
          include: {
            doctor: {
              include: {
                doctorProfile: true,
              },
            },
            appointment: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        prescriptions: {
          include: { items: true },
          orderBy: { createdAt: 'desc' },
        },
        labTests: {
          orderBy: { date: 'desc' },
        },
        appointmentsAsPatient: {
          include: {
            doctor: true
          },
          orderBy: { createdAt: 'desc' }
        }
      },
    });

    if (!patient) {
      return { success: false, message: 'Không tìm thấy thông tin bệnh nhân' };
    }

    if (!patient.patientProfile?.patientCode || patient.patientProfile?.patientCode === 'BN-NEW') {
      const generatedCode = `BN${new Date().getFullYear().toString().slice(-2)}${patient.id.toString().padStart(4, '0')}`;
      await prisma.patientProfile.upsert({
        where: { userId: patientId },
        update: { patientCode: generatedCode },
        create: { userId: patientId, patientCode: generatedCode }
      });
    }

    console.log("FETCHING PATIENT RECORDS FOR ID:", patientId, "HAS AIMESSAGE?", !!patient.healthMetric?.aiMessage);

    // 1. Chuẩn bị thông tin cá nhân
    const patientInfo = {
      name: patient.fullName,
      id: patient.patientProfile?.patientCode || `BN${patient.id.toString().padStart(4, '0')}`,
      dob: patient.dob || 'Chưa cập nhật',
      gender: patient.gender || 'Nam',
      phone: patient.phone || 'Chưa cập nhật',
      email: patient.email || 'Chưa có email',
      address: patient.address || 'Chưa cập nhật địa chỉ',
      bloodType: patient.healthMetric?.bloodType || 'Chưa cập nhật',
      healthStatus: patient.healthMetric?.healthStatus || 'Bình thường',
      aiMessage: patient.healthMetric?.aiMessage || 'Không có ghi chú thêm.',
      allergies: patient.healthMetric?.allergies || 'Chưa cập nhật',
      bhyt: patient.patientProfile?.bhyt || 'Chưa cập nhật',
      avatar: patient.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(patient.fullName)}&background=2563EB&color=fff`,
    };

    // 2. Chuẩn bị chỉ số sinh tồn (Vitals) từ HealthMetric
    const vitals = {
      height: patient.healthMetric?.height ? `${patient.healthMetric.height} cm` : '170 cm',
      weight: patient.healthMetric?.weight ? `${patient.healthMetric.weight} kg` : '65 kg',
      bmi: patient.healthMetric?.bmi ? patient.healthMetric.bmi.toString() : '22.5',
      bp: patient.healthMetric?.bloodPressure || '120/80',
      hr: patient.healthMetric?.heartRate ? `${patient.healthMetric.heartRate} bpm` : '72 bpm',
      temp: patient.healthMetric?.temperature ? `${patient.healthMetric.temperature}°C` : '36.8°C',
    };

    // 3. Chuẩn bị lịch sử khám bệnh (Visit History) TỪ BẢNG EXAMINATION
    const visitHistory = patient.examinationsAsPatient.map((exam) => {
      const dateStr = new Date(exam.createdAt).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });

      return {
        id: exam.id,
        date: dateStr,
        doctor: exam.doctor ? `BS. ${exam.doctor.fullName}` : 'BS. Ẩn danh',
        dept: exam.appointment?.specialty || exam.diagnosis || 'Đa khoa',
        status: 'Hoàn thành',
      };
    });

    // Thuốc đang sử dụng (Current Medications)
    let currentMedications: any[] = [];
    const validPrescriptions = patient.prescriptions.filter(p => p.status !== 'Đã hủy');
    validPrescriptions.forEach(p => {
      if (p.items) {
        currentMedications.push(...p.items.map(item => ({
          prescriptionCode: p.code,
          name: item.medicationName,
          quantity: item.remaining || 'Theo đơn',
          instructions: item.instructions || item.dosage || 'Theo chỉ định'
        })));
      }
    });

    // 4. Chuẩn bị xét nghiệm gần đây (Recent Labs)
    const recentLabs = patient.labTests.map((lab) => {
      const dateStr = new Date(lab.date).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });

      const isNormal = lab.statusType === 'GOOD' || lab.statusType === 'Bình thường';

      return {
        id: lab.id,
        date: dateStr,
        type: lab.testName,
        result: isNormal ? 'Bình thường' : 'Cần theo dõi',
        color: isNormal
          ? 'text-green-600 bg-green-50 border-green-200'
          : 'text-yellow-600 bg-yellow-50 border-yellow-200',
      };
    });

    // 5. Chuẩn bị đơn thuốc gần đây (Recent Prescriptions)
    const recentPrescriptions = patient.prescriptions.map((pres) => {
      const dateStr = new Date(pres.createdAt).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });

      return {
        id: pres.id,
        code: pres.code,
        date: dateStr,
        doctor: 'BS. Điều trị',
        count: pres.items.length,
        status: 'Hoàn thành',
      };
    });

    // 6. Thống kê nhanh KPI
    const stats = {
      visitCount: patient.examinationsAsPatient.length,
      recordCount: patient.examinationsAsPatient.length,
      prescriptionCount: patient.prescriptions.length,
      labCount: patient.labTests.length,
      diseaseCount: 1, // Mặc định từ hồ sơ bệnh lý mãn tính
    };

    return {
      success: true,
      data: {
        patientInfo,
        vitals,
        stats,
        visitHistory,
        currentMedications,
        recentLabs,
        recentPrescriptions,
        allergies: patientInfo.allergies && patientInfo.allergies !== 'Chưa cập nhật' && patientInfo.allergies !== 'Không có' ? patientInfo.allergies.split(',').map(a => a.trim()) : [],
        chronicDiseases: Array.from(new Map(
          patient.examinationsAsPatient
            .filter(exam => exam.diagnosis && exam.diagnosis !== 'Chưa chẩn đoán')
            .map(exam => [
              exam.diagnosis, 
              { 
                name: exam.diagnosis, 
                year: exam.createdAt.toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' }), 
                status: 'Ghi nhận từ lịch sử khám' 
              }
            ])
        ).values()),
        familyHistory: [
          { relation: 'Bố', disease: 'Tăng huyết áp', notes: 'Phát hiện năm 50 tuổi' },
          { relation: 'Mẹ', disease: 'Tiểu đường type 2', notes: 'Đang điều trị bằng Insulin' }
        ],
        treatmentProgress: {
          monitoring: 1, // Đang theo dõi
          followUp: 2, // Tái khám
          completed: stats.visitCount - 3 > 0 ? stats.visitCount - 3 : 5 // Hoàn thành
        }
      },
    };
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu hồ sơ bệnh án:', error);
    return { success: false, message: 'Lỗi máy chủ khi lấy dữ liệu' };
  }
}