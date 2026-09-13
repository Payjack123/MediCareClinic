// app/actions/auth.ts
'use server';

import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { verifyOtp } from './otp';

// Tự định nghĩa kiểu để chống lỗi TypeScript
export type UserRole = 'PATIENT' | 'DOCTOR' | 'ADMIN' | 'RECEPTIONIST';

// 1. HÀM ĐĂNG KÝ
export async function registerUser(fullName: string, email: string, password: string, roleInput: UserRole, otpCode?: string) {
  try {
    if (otpCode) {
      const verifyRes = await verifyOtp(email, otpCode);
      if (!verifyRes.success) {
        return { success: false, message: verifyRes.message };
      }
    } else {
      // Bắt buộc OTP cho luồng đăng ký mới
      return { success: false, message: 'Vui lòng xác thực mã OTP trước khi đăng ký!' };
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (existingUser) {
      // NẾU TỒN TẠI VÀ CHƯA CÓ LỊCH SỬ THAY ĐỔI MK HOẶC CHỈ LÀ HỒ SƠ LỄ TÂN TẠO -> CLAIM ACCOUNT
      // Ta sẽ cập nhật mật khẩu và tên (nếu muốn) cho user này
      await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          fullName, // Cập nhật tên theo người dùng nhập mới
          passwordHash: hashedPassword
        }
      });
      return { success: true, message: 'Đồng bộ tài khoản thành công! Bạn có thể đăng nhập.' };
    }

    // NẾU CHƯA TỒN TẠI -> TẠO MỚI BÌNH THƯỜNG
    await prisma.user.create({
      data: {
        fullName,
        email,
        passwordHash: hashedPassword,
        role: roleInput,
        patientProfile: roleInput === 'PATIENT' ? {
          create: {
            patientCode: `BN${Math.floor(100000 + Math.random() * 900000)}`
          }
        } : undefined
      }
    });

    return { success: true, message: 'Đăng ký thành công!' };
  } catch (error) {
    console.error('Lỗi đăng ký:', error);
    return { success: false, message: 'Lỗi hệ thống, vui lòng thử lại sau.' };
  }
}

// 2. HÀM ĐĂNG NHẬP
export async function loginUser(email: string, password: string, loginRole: UserRole) {
  try {
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      return { success: false, message: 'Email không tồn tại trong hệ thống!' };
    }

    // So sánh quyền người dùng chọn với quyền trong Database
    if (user.role !== loginRole) {
      const roleName = loginRole === 'ADMIN' ? 'Quản trị viên' : loginRole === 'DOCTOR' ? 'Bác sĩ' : loginRole === 'RECEPTIONIST' ? 'Lễ tân' : 'Bệnh nhân';
      return { success: false, message: `Tài khoản này không có quyền truy cập với vai trò ${roleName}!` };
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return { success: false, message: 'Mật khẩu không chính xác!' };
    }

    // Set cookie sau khi đăng nhập
    const cookieStore = await cookies();
    cookieStore.set('user_role', user.role.toLowerCase(), { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    cookieStore.set('user_id', user.id.toString(), { httpOnly: true, secure: process.env.NODE_ENV === 'production' });  

    // Trả về role chữ thường để Next.js điều hướng (patient, doctor, admin)
    return { success: true, role: user.role.toLowerCase(), name: user.fullName };
  } catch (error) {
    console.error('Lỗi đăng nhập:', error);
    return { success: false, message: 'Lỗi hệ thống, vui lòng thử lại sau.' };
  }
}