import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userIdStr = cookieStore.get('user_id')?.value;
    
    if (!userIdStr) {
      return NextResponse.json({ isLoggedIn: false, user: null });
    }

    const userId = parseInt(userIdStr, 10);
    if (isNaN(userId)) {
      return NextResponse.json({ isLoggedIn: false, user: null });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        fullName: true,
        phone: true,
        role: true,
        avatar: true
      }
    });

    if (!user) {
      return NextResponse.json({ isLoggedIn: false, user: null });
    }

    return NextResponse.json({
      isLoggedIn: true,
      user
    });
  } catch (error) {
    console.error('Error fetching /api/auth/me:', error);
    return NextResponse.json({ isLoggedIn: false, user: null }, { status: 500 });
  }
}

