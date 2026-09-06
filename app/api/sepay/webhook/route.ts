import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    require('fs').appendFileSync('sepay_log.json', JSON.stringify(data, null, 2) + '\n');


    const apiKey = req.headers.get('Apikey') || req.headers.get('apikey') || req.headers.get('Authorization') || '';

    // Xác thực API Key (trong thực tế nên đưa vào .env, nhưng tạm thời hardcode)
    if (!apiKey.includes('PhamManh2003@')) {
      return NextResponse.json({ success: false, message: 'Invalid API Key' }, { status: 401 });
    }

    const { content } = data;

    if (!content) {
      return NextResponse.json({ success: false, message: 'No content' }, { status: 400 });
    }

    // Nội dung từ SePay thường viết hoa, ta trích xuất mã thanh toán (VD: DK12345)
    const match = content.match(/DK\d+/i);
    const paymentCode = match ? match[0].toUpperCase() : content.trim().toUpperCase();

    // Tìm tất cả các lịch hẹn đang CHỜ THANH TOÁN có chứa mã thanh toán này
    const appointments = await prisma.appointment.findMany({
      where: {
        reason: { contains: paymentCode },
        status: 'CHỜ THANH TOÁN'
      }
    });

    if (appointments.length > 0) {
      // Cập nhật trạng thái thành ĐÃ THANH TOÁN
      await prisma.appointment.updateMany({
        where: {
          id: { in: appointments.map(a => a.id) }
        },
        data: { status: 'ĐÃ THANH TOÁN' }
      });
      return NextResponse.json({ success: true, message: 'Payment updated' });
    }

    return NextResponse.json({ success: false, message: 'Appointment not found or already paid' });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
