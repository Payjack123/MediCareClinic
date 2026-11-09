import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const cookieStore = await cookies();
  
  cookieStore.delete('user_id');
  cookieStore.delete('user_role');
  cookieStore.delete('auth_token');
  cookieStore.delete('token');

  cookieStore.set('user_id', '', { path: '/', maxAge: 0, expires: new Date(0) });
  cookieStore.set('user_role', '', { path: '/', maxAge: 0, expires: new Date(0) });

  return NextResponse.json({ success: true, message: 'Đã đăng xuất tài khoản thành công.' });
}

export async function GET(req: Request) {
  const cookieStore = await cookies();
  
  cookieStore.delete('user_id');
  cookieStore.delete('user_role');
  cookieStore.delete('auth_token');
  cookieStore.delete('token');

  cookieStore.set('user_id', '', { path: '/', maxAge: 0, expires: new Date(0) });
  cookieStore.set('user_role', '', { path: '/', maxAge: 0, expires: new Date(0) });

  const url = new URL(req.url);
  const redirectTarget = url.searchParams.get('redirect') || '/login';
  
  return NextResponse.redirect(new URL(redirectTarget, req.url));
}
