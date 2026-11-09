'use client';

import { logoutUser } from '@/app/(auth)/actions/auth';

/**
 * Đăng xuất toàn diện:
 * 1. Gọi server action logoutUser để xoá toàn bộ cookies httpOnly (user_id, user_role, token...)
 * 2. Gọi API POST /api/auth/logout dự phòng để trình duyệt huỷ cookies triệt để
 * 3. Xoá sạch toàn bộ localStorage (bản nháp đặt lịch, thông tin phiên...) và sessionStorage
 * 4. Điều hướng cứng (window.location.href) để xoá sạch cache bộ nhớ của React/Next.js
 */
export async function performLogout(redirectTo: string = '/login') {
  try {
    await logoutUser();
  } catch (err) {
    console.error('Lỗi khi gọi logoutUser:', err);
  }

  try {
    await fetch('/api/auth/logout', { method: 'POST' });
  } catch (err) {
    console.error('Lỗi khi gọi API /api/auth/logout:', err);
  }

  try {
    if (typeof window !== 'undefined') {
      localStorage.clear();
      sessionStorage.clear();
    }
  } catch (err) {
    console.error('Lỗi khi dọn dẹp storage:', err);
  }

  if (typeof window !== 'undefined') {
    window.location.href = redirectTo;
  }
}
