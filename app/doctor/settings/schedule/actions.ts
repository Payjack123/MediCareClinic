'use server';

import { PrismaClient } from '@/lib/generated/prisma';
const prisma = new PrismaClient();

export async function getMySchedules(userId: number) {
  try {
    const doctorProfile = await prisma.doctorProfile.findUnique({
      where: { userId }
    });

    if (!doctorProfile) {
      return { success: false, schedules: [] };
    }

    // Tính toán ngày Thứ 2 và Chủ nhật của tuần hiện tại
    const today = new Date();
    const currentDay = today.getDay(); // 0: CN, 1: T2, ..., 6: T7
    const diffToMonday = currentDay === 0 ? -6 : 1 - currentDay;
    
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() + diffToMonday);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const startStr = `${startOfWeek.getFullYear()}-${String(startOfWeek.getMonth() + 1).padStart(2, '0')}-${String(startOfWeek.getDate()).padStart(2, '0')}`;
    const endStr = `${endOfWeek.getFullYear()}-${String(endOfWeek.getMonth() + 1).padStart(2, '0')}-${String(endOfWeek.getDate()).padStart(2, '0')}`;

    const schedules = await prisma.doctorSchedule.findMany({
      where: { 
        doctorId: doctorProfile.userId,
        date: {
          gte: startStr,
          lte: endStr
        }
      },
      orderBy: { date: 'asc' },
      include: { clinic: true }
    });

    return { success: true, schedules };
  } catch (error) {
    console.error('Error fetching schedules:', error);
    return { success: false, schedules: [] };
  }
}
