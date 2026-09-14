'use server';

import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import * as bcrypt from 'bcryptjs';

// ---- QUẢN LÝ TÀI KHOẢN ----

export async function getUsers() {
  try {
    const cookieStore = await cookies();
    if (cookieStore.get('user_role')?.value !== 'admin') {
      return { success: false, message: 'Không có quyền truy cập' };
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    // Lấy danh sách ID bị khóa từ SystemSetting
    const setting = await prisma.systemSetting.findUnique({
      where: { key: 'locked_users' }
    });
    const lockedIds = setting ? JSON.parse(setting.value) : [];

    // Map trạng thái
    const data = users.map(u => ({
      ...u,
      status: lockedIds.includes(u.id) ? 'Khóa' : 'Hoạt động'
    }));

    return { success: true, data };
  } catch (error) {
    console.error("Lỗi lấy danh sách user:", error);
    return { success: false, message: 'Lỗi máy chủ' };
  }
}

export async function createUser(data: any) {
  try {
    const cookieStore = await cookies();
    if (cookieStore.get('user_role')?.value !== 'admin') {
      return { success: false, message: 'Không có quyền truy cập' };
    }

    const exists = await prisma.user.findUnique({ where: { email: data.email } });
    if (exists) return { success: false, message: 'Email hoặc Username đã tồn tại' };

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        fullName: data.fullName,
        role: data.role
      }
    });

    return { success: true, message: 'Tạo tài khoản thành công', data: { id: user.id } };
  } catch (error) {
    console.error("Lỗi tạo user:", error);
    return { success: false, message: 'Lỗi máy chủ' };
  }
}

export async function toggleUserLock(userId: number, currentStatus: string) {
  try {
    const setting = await prisma.systemSetting.findUnique({
      where: { key: 'locked_users' }
    });
    
    let lockedIds = setting ? JSON.parse(setting.value) : [];

    if (currentStatus === 'Hoạt động') {
      // Khóa
      if (!lockedIds.includes(userId)) lockedIds.push(userId);
    } else {
      // Mở khóa
      lockedIds = lockedIds.filter((id: number) => id !== userId);
    }

    await prisma.systemSetting.upsert({
      where: { key: 'locked_users' },
      update: { value: JSON.stringify(lockedIds) },
      create: { key: 'locked_users', value: JSON.stringify(lockedIds), description: 'Danh sách ID user bị khóa' }
    });

    return { success: true, message: currentStatus === 'Hoạt động' ? 'Đã khóa tài khoản' : 'Đã mở khóa tài khoản' };
  } catch (error) {
    return { success: false, message: 'Lỗi máy chủ' };
  }
}

export async function resetUserPassword(userId: number) {
  try {
    const passwordHash = await bcrypt.hash('123456', 10);
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash }
    });
    return { success: true, message: 'Đã đặt lại mật khẩu thành 123456' };
  } catch (error) {
    return { success: false, message: 'Lỗi máy chủ' };
  }
}

// ---- QUẢN LÝ RBAC ----

const DEFAULT_RBAC = {
  ADMIN: { Dashboard: ['VIEW', 'CREATE', 'UPDATE', 'DELETE', 'EXPORT'], Bác_sĩ: ['VIEW', 'CREATE', 'UPDATE', 'DELETE', 'EXPORT'], Bệnh_nhân: ['VIEW', 'CREATE', 'UPDATE', 'DELETE', 'EXPORT'], Lịch_hẹn: ['VIEW', 'CREATE', 'UPDATE', 'DELETE', 'EXPORT'], Hóa_đơn: ['VIEW', 'CREATE', 'UPDATE', 'DELETE', 'EXPORT'], RBAC: ['VIEW', 'CREATE', 'UPDATE', 'DELETE'] },
  BAC_SI: { Dashboard: ['VIEW'], Bác_sĩ: [], Bệnh_nhân: ['VIEW'], Lịch_hẹn: ['VIEW', 'UPDATE'], Hồ_sơ_bệnh_án: ['VIEW', 'CREATE', 'UPDATE', 'EXPORT'], Hóa_đơn: ['VIEW'], Thu_phí: [] },
  LE_TAN: { Dashboard: ['VIEW'], Bác_sĩ: ['VIEW'], Bệnh_nhân: ['VIEW', 'CREATE', 'UPDATE'], Lịch_hẹn: ['VIEW', 'CREATE', 'UPDATE'], Hồ_sơ_bệnh_án: ['VIEW'], Hóa_đơn: ['VIEW', 'CREATE', 'UPDATE'], Thu_phí: ['VIEW', 'CREATE', 'UPDATE', 'EXPORT'] },
  BENH_NHAN: { Dashboard: ['VIEW'], Bác_sĩ: [], Bệnh_nhân: ['VIEW', 'UPDATE'], Lịch_hẹn: ['VIEW', 'CREATE'], Hồ_sơ_bệnh_án: ['VIEW'], Hóa_đơn: ['VIEW'], Thu_phí: ['VIEW', 'CREATE'] }
};

export async function getRBACConfig() {
  try {
    let setting = await prisma.systemSetting.findUnique({
      where: { key: 'rbac_permissions' }
    });

    if (!setting) {
      setting = await prisma.systemSetting.create({
        data: {
          key: 'rbac_permissions',
          value: JSON.stringify(DEFAULT_RBAC),
          description: 'Cấu hình ma trận phân quyền (RBAC)'
        }
      });
    }

    return { success: true, data: JSON.parse(setting.value) };
  } catch (error) {
    return { success: false, message: 'Lỗi máy chủ' };
  }
}

export async function saveRBACConfig(configData: any) {
  try {
    await prisma.systemSetting.upsert({
      where: { key: 'rbac_permissions' },
      update: { value: JSON.stringify(configData) },
      create: { key: 'rbac_permissions', value: JSON.stringify(configData), description: 'Cấu hình ma trận phân quyền (RBAC)' }
    });
    return { success: true, message: 'Đã lưu cấu hình phân quyền!' };
  } catch (error) {
    return { success: false, message: 'Lỗi máy chủ' };
  }
}
