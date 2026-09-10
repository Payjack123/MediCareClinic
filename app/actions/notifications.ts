'use server';

import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function getMyNotifications() {
  try {
    const cookieStore = await cookies();
    const userIdStr = cookieStore.get('user_id')?.value;
    if (!userIdStr) return { success: false, data: [] };

    const userId = parseInt(userIdStr);

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    return { success: true, data: notifications };
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return { success: false, data: [] };
  }
}

export async function markNotificationAsRead(id: number) {
  try {
    await prisma.notification.update({
      where: { id },
      data: { isRead: true }
    });
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

export async function createNotification(userId: number, title: string, message: string, type: string = 'INFO') {
  try {
    await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type
      }
    });
    return { success: true };
  } catch (error) {
    console.error('Error creating notification:', error);
    return { success: false };
  }
}
