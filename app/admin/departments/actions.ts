'use server';

import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

// Lấy danh sách toàn bộ khoa phòng
export async function getDepartments() {
  try {
    const cookieStore = await cookies();
    if (cookieStore.get('user_role')?.value !== 'admin') {
      return { success: false, message: 'Không có quyền truy cập' };
    }

    const departments = await prisma.department.findMany({
      include: {
        doctors: { include: { user: true } },
        clinics: true
      }
    });

    const data = departments.map(s => ({
      id: s.departmentCode || s.id.toString(),
      name: s.name,
      headDoctor: s.headDoctor || (s.doctors.length > 0 ? s.doctors[0].user.fullName : 'Chưa chỉ định'),
      status: s.status,
      desc: s.description || '',
      doctors: s.doctors.map(d => ({ id: d.userId, name: d.user.fullName })),
      rooms: s.clinics.map(c => ({
        id: c.id.toString(),
        name: c.name,
        type: c.type,
        floor: c.roomNumber || '',
        status: c.status
      }))
    }));

    return { success: true, data };
  } catch (error) {
    console.error("Lỗi lấy danh sách khoa:", error);
    return { success: false, message: 'Lỗi máy chủ' };
  }
}

// Lưu 1 khoa mới
export async function saveDepartment(data: any) {
  try {
    const cookieStore = await cookies();
    if (cookieStore.get('user_role')?.value !== 'admin') {
      return { success: false, message: 'Không có quyền truy cập' };
    }

    await prisma.department.create({
      data: {
        departmentCode: data.id, 
        name: data.name,
        description: data.desc || '',
        headDoctor: data.headDoctor || null,
        status: data.status || 'Hoạt động'
      }
    });

    return { success: true, message: 'Thêm khoa thành công!' };
  } catch (error) {
    console.error("Lỗi lưu khoa:", error);
    return { success: false, message: 'Lỗi máy chủ' };
  }
}

// Cập nhật trạng thái khoa
export async function updateDepartmentStatus(id: string, newStatus: string) {
  try {
    const sId = parseInt(id);
    const whereCondition = isNaN(sId) ? { departmentCode: id } : { OR: [{ id: sId }, { departmentCode: id }] };
    
    const department = await prisma.department.findFirst({ where: whereCondition });
    if (!department) return { success: false, message: 'Không tìm thấy khoa' };

    await prisma.department.update({
      where: { id: department.id },
      data: { status: newStatus }
    });
    
    return { success: true, message: 'Cập nhật trạng thái thành công' };
  } catch (error) {
    console.error("Lỗi cập nhật khoa:", error);
    return { success: false, message: 'Lỗi máy chủ' };
  }
}

// Lấy danh sách Bác sĩ từ DB thật (bảng User) để phục vụ cho việc Phân bổ
export async function getAvailableDoctors() {
  try {
    const doctors = await prisma.user.findMany({
      where: { role: 'DOCTOR' },
      select: {
        id: true,
        fullName: true,
        doctorProfile: {
          select: { specialtyId: true, departmentId: true, doctorCode: true, specialty: true }
        }
      }
    });
    // Gắn thêm tên chuyên môn để hiển thị (do đổi từ bảng cũ)
    const result = doctors.map(d => ({
      id: d.id,
      fullName: d.fullName,
      doctorProfile: {
        ...d.doctorProfile,
        specialty: d.doctorProfile?.specialty?.name || 'Đa khoa'
      }
    }));
    return { success: true, data: result };
  } catch (error) {
    return { success: false, message: 'Lỗi lấy danh sách bác sĩ' };
  }
}

// Lấy chi tiết 1 khoa
export async function getDepartmentDetail(id: string) {
  try {
    const sId = parseInt(id);
    const whereCondition = isNaN(sId) ? { departmentCode: id } : { OR: [{ id: sId }, { departmentCode: id }] };

    const s = await prisma.department.findFirst({
      where: whereCondition,
      include: {
        doctors: { include: { user: true } },
        clinics: true
      }
    });
    
    if (!s) return { success: false, message: 'Không tìm thấy khoa' };

    const department = {
      id: s.departmentCode || s.id.toString(),
      name: s.name,
      headDoctor: s.headDoctor || (s.doctors.length > 0 ? s.doctors[0].user.fullName : 'Chưa chỉ định'),
      status: s.status,
      desc: s.description || '',
      doctors: s.doctors.map(d => ({ id: d.userId, name: d.user.fullName })),
      rooms: s.clinics.map(c => ({
        id: c.id.toString(),
        name: c.name,
        type: c.type,
        floor: c.roomNumber || '',
        status: c.status
      }))
    };

    return { success: true, data: department };
  } catch (error) {
    return { success: false, message: 'Lỗi máy chủ' };
  }
}

// Phân công Bác sĩ vào Khoa
export async function assignDoctorToDepartment(deptId: string, doctorId: number, doctorName: string) {
  try {
    const sId = parseInt(deptId);
    const whereCondition = isNaN(sId) ? { departmentCode: deptId } : { OR: [{ id: sId }, { departmentCode: deptId }] };
    
    const department = await prisma.department.findFirst({ where: whereCondition });
    if (!department) return { success: false, message: 'Khoa không tồn tại' };

    const docProfile = await prisma.doctorProfile.findUnique({ where: { userId: doctorId } });
    if (!docProfile) {
      await prisma.doctorProfile.create({
        data: {
          userId: doctorId,
          experience: 'Chưa cập nhật',
          departmentId: department.id
        }
      });
    } else {
      await prisma.doctorProfile.update({
        where: { userId: doctorId },
        data: { departmentId: department.id }
      });
    }

    return { success: true, message: 'Đã phân công bác sĩ vào khoa!' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Lỗi máy chủ' };
  }
}

// Xóa Bác sĩ khỏi Khoa
export async function removeDoctorFromDepartment(deptId: string, doctorId: number) {
  try {
    await prisma.doctorProfile.update({
      where: { userId: doctorId },
      data: { departmentId: null }
    });
    return { success: true, message: 'Đã xóa bác sĩ khỏi khoa!' };
  } catch (error) {
    return { success: false, message: 'Lỗi máy chủ' };
  }
}

// Thêm Phòng vào Khoa
export async function addRoomToDepartment(deptId: string, roomName: string, floor: string, type: string) {
  try {
    const sId = parseInt(deptId);
    const whereCondition = isNaN(sId) ? { departmentCode: deptId } : { OR: [{ id: sId }, { departmentCode: deptId }] };
    
    const department = await prisma.department.findFirst({ where: whereCondition });
    if (!department) return { success: false, message: 'Khoa không tồn tại' };

    let facility = await prisma.facility.findFirst();
    if (!facility) {
      facility = await prisma.facility.create({
        data: { name: 'Cơ sở chính', address: 'Hà Nội' }
      });
    }

    await prisma.clinic.create({
      data: {
        name: roomName,
        roomNumber: floor,
        type: type,
        departmentId: department.id,
        facilityId: facility.id
      }
    });

    return { success: true, message: 'Đã thêm phòng khám!' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Lỗi máy chủ' };
  }
}

// Đổi trạng thái Phòng
export async function updateRoomStatus(deptId: string, roomId: string, newStatus: string) {
  try {
    const rId = parseInt(roomId);
    if (isNaN(rId)) return { success: false, message: 'ID phòng không hợp lệ' };
    
    await prisma.clinic.update({
      where: { id: rId },
      data: { status: newStatus }
    });
    
    return { success: true, message: 'Đã cập nhật trạng thái phòng!' };
  } catch (error) {
    return { success: false, message: 'Lỗi máy chủ' };
  }
}

