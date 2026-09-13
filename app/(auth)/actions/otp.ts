'use server';

import prisma from '@/lib/prisma';

export async function sendOtp(email: string) {
  try {
    // Basic validation
    if (!email || !email.includes('@')) {
      return { success: false, message: 'Email không hợp lệ' };
    }

    // Generate 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

    // Clean up old OTPs for this email to prevent spam
    await prisma.otpCode.deleteMany({
      where: { email }
    });

    // Save new OTP
    await prisma.otpCode.create({
      data: {
        email,
        code,
        expiresAt
      }
    });

    // MOCK SEND OTP - PRINT TO CONSOLE
    console.log(`\n==============================================`);
    console.log(`[MOCK OTP] Đã gửi mã OTP cho email: ${email}`);
    console.log(`[MOCK OTP] MÃ OTP CỦA BẠN LÀ: ${code}`);
    console.log(`==============================================\n`);

    return { success: true, message: 'Đã gửi mã OTP thành công! (Vui lòng kiểm tra Console)' };
  } catch (error) {
    console.error('Lỗi khi gửi OTP:', error);
    return { success: false, message: 'Đã xảy ra lỗi hệ thống khi gửi OTP' };
  }
}

export async function verifyOtp(email: string, code: string) {
  try {
    const otpRecord = await prisma.otpCode.findFirst({
      where: {
        email,
        code
      }
    });

    if (!otpRecord) {
      return { success: false, message: 'Mã OTP không chính xác!' };
    }

    if (otpRecord.expiresAt < new Date()) {
      return { success: false, message: 'Mã OTP đã hết hạn!' };
    }

    // Mark as verified
    await prisma.otpCode.update({
      where: { id: otpRecord.id },
      data: { verified: true }
    });

    return { success: true, message: 'Xác thực OTP thành công!' };
  } catch (error) {
    console.error('Lỗi khi xác thực OTP:', error);
    return { success: false, message: 'Đã xảy ra lỗi hệ thống' };
  }
}
