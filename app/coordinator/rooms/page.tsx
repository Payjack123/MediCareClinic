import React from 'react';
import prisma from '@/lib/prisma';
import CoordinatorRoomsClient from './client';

export const dynamic = 'force-dynamic';

export default async function CoordinatorRooms() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const todayStr = `${yyyy}-${mm}-${dd}`; // YYYY-MM-DD

  // Fetch all clinics (rooms)
  const clinics = await prisma.clinic.findMany({
    include: { specialty: true }
  });

  // Fetch today's schedules
  const todaySchedules = await prisma.doctorSchedule.findMany({
    where: { date: todayStr },
    include: { doctor: { select: { fullName: true } } }
  });

  const doctors = await prisma.doctorProfile.findMany({
    include: { user: { select: { fullName: true } } }
  });
  
  const specialties = await prisma.specialty.findMany();

  // Mapped data to Client
  return (
    <CoordinatorRoomsClient 
      clinics={clinics}
      todaySchedules={todaySchedules}
      doctors={doctors}
      specialties={specialties}
      todayStr={todayStr}
    />
  );
}
