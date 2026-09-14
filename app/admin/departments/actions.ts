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

    let setting = await prisma.systemSetting.findUnique({
      where: { key: 'departments_data' }
    });

    if (!setting) {
      // Mock dữ liệu mặc định nếu chưa có
      const defaultData = [
        { id: 'NTQ001', name: 'Nội tổng quát', headDoctor: 'BS. Nguyễn Văn Bình', status: 'Hoạt động', desc: 'Khám và điều trị các bệnh nội khoa', doctors: [], rooms: [], services: [] },
        { id: 'NKH001', name: 'Ngoại khoa', headDoctor: 'BS. Trần B', status: 'Hoạt động', desc: 'Chuyên phẫu thuật', doctors: [], rooms: [], services: [] },
        { id: 'NHI001', name: 'Nhi khoa', headDoctor: 'BS. Lê C', status: 'Hoạt động', desc: 'Khám nhi đồng', doctors: [], rooms: [], services: [] },
        { id: 'TMH001', name: 'Tai Mũi Họng', headDoctor: 'BS. Hoàng D', status: 'Tạm dừng', desc: 'Điều trị TMH', doctors: [], rooms: [], services: [] },
      ];
      setting = await prisma.systemSetting.create({
        data: {
          key: 'departments_data',
          value: JSON.stringify(defaultData),
          description: 'Lưu trữ danh sách khoa phòng (do chưa có bảng db)'
        }
      });
    }

    const departments = JSON.parse(setting.value);
    return { success: true, data: departments };
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

    const setting = await prisma.systemSetting.findUnique({
      where: { key: 'departments_data' }
    });
    
    let departments = [];
    if (setting) {
      departments = JSON.parse(setting.value);
    }

    // Gắn id nếu chưa có
    const newDept = {
      ...data,
      id: data.id || `KHOA${Date.now()}`,
      doctors: data.doctors || [],
      rooms: data.rooms || [],
      services: data.services || []
    };

    departments.push(newDept);

    await prisma.systemSetting.upsert({
      where: { key: 'departments_data' },
      update: { value: JSON.stringify(departments) },
      create: { key: 'departments_data', value: JSON.stringify(departments), description: 'Dữ liệu khoa phòng' }
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
    const setting = await prisma.systemSetting.findUnique({
      where: { key: 'departments_data' }
    });
    if (!setting) return { success: false, message: 'Không tìm thấy dữ liệu' };

    let departments = JSON.parse(setting.value);
    const index = departments.findIndex((d: any) => d.id === id);
    if (index === -1) return { success: false, message: 'Không tìm thấy khoa' };

    departments[index].status = newStatus;

    await prisma.systemSetting.update({
      where: { key: 'departments_data' },
      data: { value: JSON.stringify(departments) }
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
          select: { specialty: true, doctorCode: true }
        }
      }
    });
    return { success: true, data: doctors };
  } catch (error) {
    return { success: false, message: 'Lỗi lấy danh sách bác sĩ' };
  }
}

// Lấy chi tiết 1 khoa
export async function getDepartmentDetail(id: string) {
  try {
    const setting = await prisma.systemSetting.findUnique({
      where: { key: 'departments_data' }
    });
    if (!setting) return { success: false, message: 'Không tìm thấy khoa' };

    const departments = JSON.parse(setting.value);
    const department = departments.find((d: any) => d.id === id);
    
    if (!department) return { success: false, message: 'Không tìm thấy khoa' };
    return { success: true, data: department };
  } catch (error) {
    return { success: false, message: 'Lỗi máy chủ' };
  }
}

// Phân công Bác sĩ vào Khoa
export async function assignDoctorToDepartment(deptId: string, doctorId: number, doctorName: string) {
  try {
    const setting = await prisma.systemSetting.findUnique({
      where: { key: 'departments_data' }
    });
    if (!setting) return { success: false, message: 'Lỗi dữ liệu' };

    let departments = JSON.parse(setting.value);
    const deptIndex = departments.findIndex((d: any) => d.id === deptId);
    if (deptIndex === -1) return { success: false, message: 'Khoa không tồn tại' };

    // Kiểm tra trùng lặp
    const exists = departments[deptIndex].doctors.find((d: any) => d.id === doctorId);
    if (!exists) {
      departments[deptIndex].doctors.push({ id: doctorId, name: doctorName });
      
      await prisma.systemSetting.update({
        where: { key: 'departments_data' },
        data: { value: JSON.stringify(departments) }
      });
      return { success: true, message: 'Đã phân công bác sĩ vào khoa!' };
    }
    return { success: false, message: 'Bác sĩ này đã thuộc khoa' };
  } catch (error) {
    return { success: false, message: 'Lỗi máy chủ' };
  }
}

// Xóa Bác sĩ khỏi Khoa
export async function removeDoctorFromDepartment(deptId: string, doctorId: number) {
  try {
    const setting = await prisma.systemSetting.findUnique({
      where: { key: 'departments_data' }
    });
    if (!setting) return { success: false, message: 'Lỗi dữ liệu' };

    let departments = JSON.parse(setting.value);
    const deptIndex = departments.findIndex((d: any) => d.id === deptId);
    if (deptIndex === -1) return { success: false, message: 'Khoa không tồn tại' };

    departments[deptIndex].doctors = departments[deptIndex].doctors.filter((d: any) => d.id !== doctorId);
      
    await prisma.systemSetting.update({
      where: { key: 'departments_data' },
      data: { value: JSON.stringify(departments) }
    });
    return { success: true, message: 'Đã xóa bác sĩ khỏi khoa!' };
  } catch (error) {
    return { success: false, message: 'Lỗi máy chủ' };
  }
}

// Thêm Phòng vào Khoa
export async function addRoomToDepartment(deptId: string, roomName: string, floor: string, type: string) {
  try {
    const setting = await prisma.systemSetting.findUnique({
      where: { key: 'departments_data' }
    });
    if (!setting) return { success: false, message: 'Lỗi dữ liệu' };

    let departments = JSON.parse(setting.value);
    const deptIndex = departments.findIndex((d: any) => d.id === deptId);
    if (deptIndex === -1) return { success: false, message: 'Khoa không tồn tại' };

    departments[deptIndex].rooms.push({ 
      id: `ROOM${Date.now()}`,
      name: roomName,
      floor,
      type,
      status: 'Hoạt động'
    });
      
    await prisma.systemSetting.update({
      where: { key: 'departments_data' },
      data: { value: JSON.stringify(departments) }
    });
    return { success: true, message: 'Đã thêm phòng khám!' };
  } catch (error) {
    return { success: false, message: 'Lỗi máy chủ' };
  }
}

// Đổi trạng thái Phòng
export async function updateRoomStatus(deptId: string, roomId: string, newStatus: string) {
  try {
    const setting = await prisma.systemSetting.findUnique({
      where: { key: 'departments_data' }
    });
    if (!setting) return { success: false, message: 'Lỗi dữ liệu' };

    let departments = JSON.parse(setting.value);
    const deptIndex = departments.findIndex((d: any) => d.id === deptId);
    if (deptIndex !== -1) {
      const rIdx = departments[deptIndex].rooms.findIndex((r: any) => r.id === roomId);
      if (rIdx !== -1) {
        departments[deptIndex].rooms[rIdx].status = newStatus;
        await prisma.systemSetting.update({
          where: { key: 'departments_data' },
          data: { value: JSON.stringify(departments) }
        });
        return { success: true, message: 'Đã cập nhật trạng thái phòng!' };
      }
    }
    return { success: false, message: 'Lỗi cập nhật' };
  } catch (error) {
    return { success: false, message: 'Lỗi máy chủ' };
  }
}
