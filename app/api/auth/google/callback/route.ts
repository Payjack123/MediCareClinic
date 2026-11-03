import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state'); // URL redirect ban đầu nếu có
  const error = searchParams.get('error');

  // Xác định domain hiện tại
  const host = req.headers.get('host') || 'localhost:3000';
  const protocol = req.headers.get('x-forwarded-proto') || (host.startsWith('localhost') ? 'http' : 'https');
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || `${protocol}://${host}`;
  const baseUrl = appUrl.replace(/\/$/, '');
  const redirectUri = `${baseUrl}/api/auth/google/callback`;

  if (error || !code) {
    console.error('Google Auth Error:', error || 'No code returned from Google');
    return NextResponse.redirect(`${baseUrl}/login?error=GoogleAuthFailed`);
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(`${baseUrl}/login?error=GoogleOAuthNotConfigured`);
  }

  try {
    // 1. Đổi authorization code lấy access_token từ Google
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const tokens = await tokenResponse.json();

    if (!tokens.access_token) {
      console.error('Lỗi lấy access_token từ Google:', tokens);
      return NextResponse.redirect(`${baseUrl}/login?error=TokenExchangeFailed`);
    }

    // 2. Lấy thông tin user từ Google UserInfo API
    const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    if (!userRes.ok) {
      return NextResponse.redirect(`${baseUrl}/login?error=UserInfoFailed`);
    }

    const googleUser = await userRes.json();
    const { email, name, picture } = googleUser;

    if (!email) {
      return NextResponse.redirect(`${baseUrl}/login?error=NoEmail`);
    }

    // 3. Tìm tài khoản trong database MediCare
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Nếu chưa có, tự động đăng ký tài khoản mới vai trò BỆNH NHÂN (PATIENT)
      const randomPassword = crypto.randomBytes(32).toString('hex');
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(randomPassword, salt);

      user = await prisma.user.create({
        data: {
          fullName: name || 'Bệnh nhân',
          email,
          passwordHash,
          role: 'PATIENT',
          avatar: picture || null,
          status: 'Hoạt động',
          patientProfile: {
            create: {
              patientCode: `BN${Math.floor(100000 + Math.random() * 900000)}`,
            },
          },
        },
      });
    } else if (picture && !user.avatar) {
      // Cập nhật avatar nếu người dùng chưa có
      try {
        await prisma.user.update({
          where: { id: user.id },
          data: { avatar: picture },
        });
      } catch (e) {
        console.warn('Không thể cập nhật avatar:', e);
      }
    }

    // 4. Lưu session vào Cookies (chuẩn định dạng toàn bộ ứng dụng đang dùng)
    const cookieStore = await cookies();
    cookieStore.set('user_role', user.role.toLowerCase(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // Lưu 7 ngày
    });
    cookieStore.set('user_id', user.id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    // 5. Điều hướng theo redirectUrl ban đầu (nếu có) hoặc theo vai trò người dùng
    let destination = '/patient/dashboard';

    if (state && state.startsWith('/') && !state.startsWith('//')) {
      destination = state;
    } else {
      switch (user.role) {
        case 'DOCTOR':
          destination = '/doctor/dashboard';
          break;
        case 'ADMIN':
          destination = '/admin/dashboard';
          break;
        case 'RECEPTIONIST':
          destination = '/receptionist/dashboard';
          break;
        case 'PATIENT':
        default:
          destination = '/patient/dashboard';
          break;
      }
    }

    return NextResponse.redirect(`${baseUrl}${destination}`);
  } catch (err) {
    console.error('Lỗi xác thực Google callback:', err);
    return NextResponse.redirect(`${baseUrl}/login?error=ServerError`);
  }
}

