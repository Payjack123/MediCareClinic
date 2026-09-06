import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');

    if (!code) return NextResponse.json({ paid: false });

    // Tìm các đơn khám có chứa mã code (VD: DK12345) trong lý do khám
    const appointments = await prisma.appointment.findMany({
      where: {
        reason: { contains: code }
      },
      select: { status: true }
    });

    // Nếu tìm thấy đơn khám và tất cả đều đã cập nhật thành ĐÃ THANH TOÁN
    if (appointments.length > 0 && appointments.every(a => a.status === 'ĐÃ THANH TOÁN')) {
      return NextResponse.json({ paid: true });
    }

    return NextResponse.json({ paid: false });
  } catch (error) {
    console.error('Polling API error:', error);
    return NextResponse.json({ paid: false }, { status: 500 });
  }
}
