import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const a = await prisma.appointment.findFirst({ where: { status: 'CHỜ THANH TOÁN' }, orderBy: { createdAt: 'desc' } });
  if (a) {
    const match = a.reason?.match(/DK\d+/i);
    if (match) {
      await fetch('http://localhost:3000/api/sepay/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Apikey': 'PhamManh2003@' },
        body: JSON.stringify({ content: match[0].toUpperCase(), transferAmount: 1000 })
      });
      return NextResponse.json({ triggered: match[0] });
    }
  }
  return NextResponse.json({ no_pending_appointments: true });
}
