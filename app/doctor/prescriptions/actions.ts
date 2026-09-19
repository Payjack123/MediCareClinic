'use server';

import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

// 1. LẤY DANH SÁCH BỆNH NHÂN VÀ ĐƠN THUỐC CỦA BÁC SĨ (Dành cho trang Danh sách và form Chọn BN)
export async function getDoctorPrescriptionsData() {
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

    // Lấy danh sách bệnh nhân đã khám với bác sĩ này
    const appointments = await prisma.appointment.findMany({
      where: { doctorId: doctorId },
      select: { patientId: true },
      distinct: ['patientId']
    });
    
    const patientIds = appointments.map(a => a.patientId);

    const patients = await prisma.user.findMany({
      where: { id: { in: patientIds } },
      select: { 
        id: true, fullName: true, patientProfile: true, dob: true, gender: true,
        phone: true, address: true,
        healthMetric: { select: { allergies: true } },
        examinationsAsPatient: {
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            createdAt: true,
            symptoms: true,
            diagnosis: true,
            treatment: true,
            notes: true,
            followUpDate: true
          }
        }
      }
    });

    // Lấy toàn bộ đơn thuốc của các bệnh nhân đó do bác sĩ này kê
    const prescriptions = await prisma.prescription.findMany({
      where: { doctorId: doctorId },
      include: {
        patient: { include: { patientProfile: true } },
        items: true
      },
      orderBy: { createdAt: 'desc' }
    });

    let total = prescriptions.length;
    let draftCount = 0;
    let publishedCount = 0;
    let cancelledCount = 0;

    const formattedPrescriptions = prescriptions.map(p => {
      let status = p.status || 'Nháp';
      // Normalize statuses
      if (status === 'Chờ phát' || status === 'Đã phát') status = 'Đã kê';
      if (status === 'Đã hủy') cancelledCount++;
      else if (status === 'Đã kê') publishedCount++;
      else draftCount++;
      
      const createdDateStr = p.createdAt.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

      let age = 'N/A';
      if (p.patient.dob) {
         const year = p.patient.dob.split('/')[2] || p.patient.dob.split('-')[0];
         if (year) age = (new Date().getFullYear() - parseInt(year)).toString();
      }

      return {
        id: p.id,
        code: p.code || `DT${p.id}`,
        patientId: p.patient.id,
        patientName: p.patient.fullName,
        patientCode: p.patient.patientProfile?.patientCode || `BN${p.patient.id}`,
        age: age,
        gender: p.patient.gender || 'Nam',
        date: createdDateStr,
        time: p.createdAt.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        drugCount: p.items.length,
        status: status,
        statusColor: status === 'Đã kê' ? 'text-green-700 bg-green-100 border-green-200' :
                     status === 'Nháp' ? 'text-gray-700 bg-gray-100 border-gray-200' :
                     'text-red-700 bg-red-100 border-red-200',
        diagnosis: p.diagnosis || 'Chưa có chẩn đoán', 
        type: p.type || 'Ngoại trú',
        notes: p.notes || '',
        followUpDate: p.followUpDate || ''
      };
    });

    return {
      success: true,
      data: {
        doctorInfo: {
          name: doctor.fullName,
          avatar: doctor.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.fullName)}&background=172554&color=fff`,
          rating: doctor.doctorProfile?.rating || 5.0,
          specialty: doctor.doctorProfile?.specialty || 'Đa khoa'
        },
        patients: patients,
        prescriptions: formattedPrescriptions,
        kpis: { total, draft: draftCount, published: publishedCount, cancelled: cancelledCount }
      }
    };
  } catch (error) {
    return { success: false, message: 'Lỗi server' };
  }
}

// 2. TẠO ĐƠN THUỐC MỚI
export async function createFullPrescription(data: { patientId: number, diagnosis?: string, notes?: string, status?: string, followUpDate?: string, items: any[] }) {
  try {
    const cookieStore = await cookies();
    const userIdStr = cookieStore.get('user_id')?.value;
    const doctorId = userIdStr ? parseInt(userIdStr) : null;

    const code = `DT-${new Date().getFullYear().toString().slice(2)}${String(new Date().getMonth()+1).padStart(2,'0')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    
    const newPre = await prisma.prescription.create({ 
      data: { 
        patientId: data.patientId, 
        code: code,
        doctorId: doctorId,
        diagnosis: data.diagnosis,
        notes: data.notes,
        followUpDate: data.followUpDate,
        status: data.status || 'Nháp'
      } 
    });

    if (data.items && data.items.length > 0) {
      await prisma.prescriptionItem.createMany({
        data: data.items.map((item: any) => ({
          prescriptionId: newPre.id,
          medicationName: item.name,
          dosage: item.dosage,
          instructions: item.instructions || item.usage || item.dosage,
          remaining: item.quantity.toString(),
          statusText: data.status || 'Nháp',
          iconType: item.form === 'Dung dịch' ? 'liquid' : 'pill'
        }))
      });
    }

    return { success: true, message: 'Lưu đơn thuốc thành công!', id: newPre.id };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Lỗi khi lưu đơn thuốc' };
  }
}

// 3. CHI TIẾT ĐƠN THUỐC
export async function getPrescriptionById(id: number) {
  try {
    const cookieStore = await cookies();
    const userIdStr = cookieStore.get('user_id')?.value;
    if (!userIdStr) return { success: false, message: 'Chưa đăng nhập' };
    const doctorId = parseInt(userIdStr);

    const prescription = await prisma.prescription.findUnique({
      where: { id },
      include: {
        items: true,
        patient: { include: { patientProfile: true } },
        doctor: { include: { doctorProfile: true } }
      }
    });

    if (!prescription) return { success: false, message: 'Không tìm thấy đơn thuốc' };
    if (prescription.doctorId !== doctorId) return { success: false, message: 'Không có quyền truy cập' };

    let status = prescription.status || 'Nháp';
    if (status === 'Chờ phát' || status === 'Đã phát') status = 'Đã kê';

    return { 
      success: true, 
      data: {
        ...prescription,
        status,
        code: prescription.code || `DT${prescription.id}`
      }
    };
  } catch (error: any) {
    console.error("Lỗi getPrescriptionById:", error);
    return { success: false, message: 'Lỗi server' };
  }
}

// 4. SỬA ĐƠN THUỐC (Chỉ áp dụng khi Nháp)
export async function updatePrescription(id: number, data: { diagnosis?: string, notes?: string, status?: string, items: any[] }) {
  try {
    await prisma.prescription.update({
      where: { id },
      data: {
        diagnosis: data.diagnosis,
        notes: data.notes,
        status: data.status || 'Nháp'
      }
    });

    // Xóa item cũ và tạo item mới để dễ quản lý
    await prisma.prescriptionItem.deleteMany({ where: { prescriptionId: id } });
    
    if (data.items && data.items.length > 0) {
      await prisma.prescriptionItem.createMany({
        data: data.items.map((item: any) => ({
          prescriptionId: id,
          medicationName: item.name,
          dosage: item.dosage,
          instructions: item.instructions || item.usage || item.dosage,
          remaining: item.quantity.toString(),
          statusText: data.status || 'Nháp',
          iconType: item.form === 'Dung dịch' ? 'liquid' : 'pill'
        }))
      });
    }

    return { success: true, message: 'Cập nhật đơn thuốc thành công' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Lỗi cập nhật đơn thuốc' };
  }
}

// 5. PHÁT HÀNH ĐƠN
export async function publishPrescription(id: number) {
  try {
    await prisma.prescription.update({
      where: { id },
      data: { status: 'Đã kê' }
    });
    return { success: true, message: 'Đã phát hành đơn thuốc' };
  } catch (error) {
    return { success: false, message: 'Lỗi khi phát hành' };
  }
}

// 6. HỦY ĐƠN
export async function cancelPrescription(id: number) {
  try {
    await prisma.prescription.update({
      where: { id },
      data: { status: 'Đã hủy' }
    });
    return { success: true, message: 'Đã hủy đơn thuốc' };
  } catch (error) {
    return { success: false, message: 'Lỗi khi hủy đơn' };
  }
}