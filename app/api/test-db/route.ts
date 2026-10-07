import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const apts = await prisma.appointment.findMany({
    orderBy: { id: 'desc' },
    take: 4
  });

  for (const apt of apts) {
    let newReason = apt.reason || '';
    if (newReason.includes('. Lý do: ')) {
      const parts = newReason.split('. Lý do: ');
      newReason = parts[0] + '. Lý do: '; // Leave reason blank
    }
    
    await prisma.appointment.update({
      where: { id: apt.id },
      data: { reason: newReason }
    });
  }

  return NextResponse.json({ success: true, message: 'Cleared reasons!' });
}
