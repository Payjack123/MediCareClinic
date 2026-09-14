'use server';

import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

const DEFAULT_SETTINGS = {
  general: {
    clinicName: 'MediCare Clinic',
    phone: '024 1234 5678',
    email: 'info@medicare.vn',
    address: '123 Đường Y Tế, Quận 1, Hà Nội',
    website: 'https://medicare.vn',
    taxId: '0123456789'
  },
  clinic: {
    openTime: '07:30',
    closeTime: '17:30',
    breakStart: '11:30',
    breakEnd: '13:30',
    workDays: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7']
  },
  appointment: {
    slotDuration: '20',
    maxPatientsPerSlot: 2,
    bookBeforeDays: '1',
    cancelBeforeHours: '24',
    allowReschedule: true
  },
  payment: {
    currency: 'VNĐ',
    enableCash: true,
    enableBankTransfer: true,
    enableQR: true,
    taxRate: '0'
  },
  notification: {
    emailAppointment: true,
    smsReminder: false,
    systemAlerts: true
  },
  security: {
    maxLoginAttempts: 5,
    sessionTimeout: 30,
    requirePasswordChange: false
  }
};

export async function getGlobalSettings() {
  try {
    const cookieStore = await cookies();
    if (cookieStore.get('user_role')?.value !== 'admin') {
      return { success: false, message: 'Không có quyền truy cập' };
    }

    let setting = await prisma.systemSetting.findUnique({
      where: { key: 'global_settings' }
    });

    if (!setting) {
      setting = await prisma.systemSetting.create({
        data: {
          key: 'global_settings',
          value: JSON.stringify(DEFAULT_SETTINGS),
          description: 'Cấu hình hệ thống chung'
        }
      });
    }

    return { success: true, data: JSON.parse(setting.value) };
  } catch (error) {
    console.error("Lỗi lấy cấu hình:", error);
    return { success: false, message: 'Lỗi máy chủ' };
  }
}

export async function saveGlobalSettings(configData: any) {
  try {
    const cookieStore = await cookies();
    if (cookieStore.get('user_role')?.value !== 'admin') {
      return { success: false, message: 'Không có quyền truy cập' };
    }

    await prisma.systemSetting.upsert({
      where: { key: 'global_settings' },
      update: { value: JSON.stringify(configData) },
      create: { key: 'global_settings', value: JSON.stringify(configData), description: 'Cấu hình hệ thống chung' }
    });
    
    // Ghi log
    await logSystemAction('Admin01', 'Cập nhật Cấu hình hệ thống', '127.0.0.1');

    return { success: true, message: 'Đã lưu cấu hình hệ thống!' };
  } catch (error) {
    return { success: false, message: 'Lỗi máy chủ' };
  }
}

export async function getSystemLogs() {
  try {
    let setting = await prisma.systemSetting.findUnique({
      where: { key: 'system_logs' }
    });

    if (!setting) {
      const defaultLogs = [
        { id: 1, user: 'Admin01', action: 'Đăng nhập hệ thống', time: new Date(Date.now() - 3600000).toISOString(), ip: '192.168.1.1' },
        { id: 2, user: 'Admin01', action: 'Khóa tài khoản bn00126', time: new Date(Date.now() - 3000000).toISOString(), ip: '192.168.1.1' },
        { id: 3, user: 'Admin01', action: 'Cập nhật phân quyền RBAC', time: new Date(Date.now() - 2500000).toISOString(), ip: '192.168.1.1' }
      ];
      setting = await prisma.systemSetting.create({
        data: {
          key: 'system_logs',
          value: JSON.stringify(defaultLogs),
          description: 'Nhật ký hệ thống (Audit Logs)'
        }
      });
    }

    return { success: true, data: JSON.parse(setting.value) };
  } catch (error) {
    return { success: false, message: 'Lỗi máy chủ' };
  }
}

export async function logSystemAction(user: string, action: string, ip: string) {
  try {
    let setting = await prisma.systemSetting.findUnique({
      where: { key: 'system_logs' }
    });
    
    let logs = setting ? JSON.parse(setting.value) : [];
    
    logs.unshift({
      id: Date.now(),
      user,
      action,
      time: new Date().toISOString(),
      ip
    });

    // Giữ tối đa 100 log gần nhất cho demo
    if (logs.length > 100) logs = logs.slice(0, 100);

    await prisma.systemSetting.upsert({
      where: { key: 'system_logs' },
      update: { value: JSON.stringify(logs) },
      create: { key: 'system_logs', value: JSON.stringify(logs) }
    });
  } catch (error) {
    // Bỏ qua lỗi log
  }
}