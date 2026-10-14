'use server';

import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';

const DEFAULT_DESK_PREFERENCES = {
  deskNumber: 'Quầy 01 - Tiếp đón & Phân luồng trung tâm',
  shift: 'Ca Sáng (07:30 - 12:00)',
  employeeCode: 'LT-001',
  autoPrintTicket: true,
  soundNewBooking: true,
  soundCallQueue: true,
  noShowAlertMinutes: 15,
  emailDailyReport: true,
  voiceGender: 'female_north' // female_north, female_south, chime_only
};

// 1. Get Receptionist Profile & Preferences
export async function getReceptionistSettings() {
  try {
    const cookieStore = await cookies();
    const userIdStr = cookieStore.get('user_id')?.value;
    
    let user = null;
    if (userIdStr) {
      user = await prisma.user.findUnique({
        where: { id: parseInt(userIdStr, 10) }
      });
    }

    // Fallback to first RECEPTIONIST in database
    if (!user) {
      user = await prisma.user.findFirst({
        where: { role: 'RECEPTIONIST' }
      });
    }

    // If still not found, fallback to user id 3 or create default
    if (!user) {
      user = await prisma.user.findUnique({ where: { id: 3 } });
    }

    if (!user) {
      return { success: false, message: 'Không tìm thấy tài khoản lễ tân' };
    }

    // Fetch desk preferences from SystemSetting
    const settingKey = `receptionist_desk_settings_${user.id}`;
    let deskSetting = await prisma.systemSetting.findUnique({
      where: { key: settingKey }
    });

    if (!deskSetting) {
      // Try global receptionist key
      deskSetting = await prisma.systemSetting.findUnique({
        where: { key: 'receptionist_desk_settings' }
      });
    }

    let preferences = DEFAULT_DESK_PREFERENCES;
    if (deskSetting?.value) {
      try {
        preferences = { ...DEFAULT_DESK_PREFERENCES, ...JSON.parse(deskSetting.value) };
      } catch (e) {
        console.error('Error parsing desk preferences JSON:', e);
      }
    }

    return {
      success: true,
      data: {
        user: {
          id: user.id,
          fullName: user.fullName || 'Nguyễn Thị Hương',
          email: user.email,
          phone: user.phone || '0900000003',
          dob: user.dob || '1996-08-15',
          gender: user.gender || 'Nữ',
          address: user.address || 'Đống Đa, Hà Nội',
          avatar: user.avatar || '',
          role: user.role,
          status: user.status || 'Hoạt động',
          createdAt: user.createdAt.toISOString()
        },
        preferences
      }
    };
  } catch (error: any) {
    if (error?.digest === 'DYNAMIC_SERVER_USAGE') {
      throw error;
    }
    console.error('Lỗi khi lấy thông tin cài đặt lễ tân:', error);
    return { success: false, message: 'Lỗi hệ thống khi tải cài đặt' };
  }
}

// 2. Update Profile Information
export async function updateReceptionistProfile(formData: {
  fullName: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  address: string;
  avatar?: string;
}) {
  try {
    const cookieStore = await cookies();
    const userIdStr = cookieStore.get('user_id')?.value;
    
    let userId = userIdStr ? parseInt(userIdStr, 10) : 3;

    // Check if target user exists
    let existingUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!existingUser) {
      existingUser = await prisma.user.findFirst({ where: { role: 'RECEPTIONIST' } });
      if (existingUser) userId = existingUser.id;
    }

    if (!existingUser) {
      return { success: false, message: 'Không tìm thấy tài khoản người dùng' };
    }

    // Check email uniqueness if email changed
    if (formData.email !== existingUser.email) {
      const emailConflict = await prisma.user.findUnique({
        where: { email: formData.email }
      });
      if (emailConflict && emailConflict.id !== userId) {
        return { success: false, message: 'Email này đã được sử dụng bởi tài khoản khác!' };
      }
    }

    // Update user
    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        dob: formData.dob,
        gender: formData.gender,
        address: formData.address,
        avatar: formData.avatar ?? existingUser.avatar
      }
    });

    revalidatePath('/receptionist/settings');
    revalidatePath('/receptionist/reports');
    revalidatePath('/receptionist');

    return {
      success: true,
      message: 'Cập nhật thông tin cá nhân thành công!',
      data: {
        fullName: updated.fullName,
        email: updated.email,
        phone: updated.phone,
        dob: updated.dob,
        gender: updated.gender,
        address: updated.address,
        avatar: updated.avatar
      }
    };
  } catch (error: any) {
    console.error('Lỗi khi cập nhật hồ sơ lễ tân:', error);
    return { success: false, message: 'Đã có lỗi xảy ra khi lưu thông tin. Vui lòng thử lại!' };
  }
}

// 3. Update Desk Preferences
export async function updateDeskPreferences(preferences: typeof DEFAULT_DESK_PREFERENCES) {
  try {
    const cookieStore = await cookies();
    const userIdStr = cookieStore.get('user_id')?.value;
    const userId = userIdStr ? parseInt(userIdStr, 10) : 3;

    const settingKey = `receptionist_desk_settings_${userId}`;
    const jsonValue = JSON.stringify(preferences);

    await prisma.systemSetting.upsert({
      where: { key: settingKey },
      update: {
        value: jsonValue,
        description: 'Cài đặt quầy tiếp đón và quy trình lễ tân'
      },
      create: {
        key: settingKey,
        value: jsonValue,
        description: 'Cài đặt quầy tiếp đón và quy trình lễ tân'
      }
    });

    revalidatePath('/receptionist/settings');
    return {
      success: true,
      message: 'Đã lưu cấu hình quầy tiếp đón thành công!'
    };
  } catch (error) {
    console.error('Lỗi khi lưu cấu hình quầy:', error);
    return { success: false, message: 'Không thể lưu cài đặt quầy' };
  }
}

// 4. Update Password
export async function updateReceptionistPassword(data: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}) {
  try {
    if (!data.currentPassword || !data.newPassword) {
      return { success: false, message: 'Vui lòng nhập đầy đủ mật khẩu!' };
    }

    if (data.newPassword !== data.confirmPassword) {
      return { success: false, message: 'Mật khẩu mới và xác nhận mật khẩu không khớp!' };
    }

    if (data.newPassword.length < 6) {
      return { success: false, message: 'Mật khẩu mới phải có ít nhất 6 ký tự!' };
    }

    const cookieStore = await cookies();
    const userIdStr = cookieStore.get('user_id')?.value;
    let userId = userIdStr ? parseInt(userIdStr, 10) : 3;

    let user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      user = await prisma.user.findFirst({ where: { role: 'RECEPTIONIST' } });
      if (user) userId = user.id;
    }

    if (!user) {
      return { success: false, message: 'Tài khoản không tồn tại!' };
    }

    // Verify current password
    const isMatch = await bcrypt.compare(data.currentPassword, user.passwordHash);
    if (!isMatch) {
      return { success: false, message: 'Mật khẩu hiện tại không chính xác!' };
    }

    // Hash new password
    const newHash = await bcrypt.hash(data.newPassword, 10);

    // Update in DB
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newHash }
    });

    return {
      success: true,
      message: 'Đổi mật khẩu thành công! Hãy ghi nhớ mật khẩu mới của bạn.'
    };
  } catch (error) {
    console.error('Lỗi khi đổi mật khẩu:', error);
    return { success: false, message: 'Đã xảy ra lỗi khi cập nhật mật khẩu!' };
  }
}
