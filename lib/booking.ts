import { createHash, randomUUID } from 'node:crypto';
import prisma from '@/lib/prisma';
import { Prisma } from '@/lib/generated/prisma';
import {
  bookingDateAliases, bookingTimesOverlap, isFutureBooking, normalizeBookingDate,
  parseBookingTime, parseScheduleTimes, RELEASED_APPOINTMENT_STATUSES,
  storedBookingDate, vietnamDateTime, type BookableSchedule,
} from '@/lib/booking-utils';

export class BookingError extends Error {
  constructor(message: string, public code = 'INVALID_BOOKING') { super(message); }
}

const scheduleInclude = {
  doctor: { include: { doctorProfile: { include: { specialty: true } } } },
  clinic: { include: { facility: true } },
} satisfies Prisma.DoctorScheduleInclude;

const appointmentInclude = {
  patient: { select: { id: true, fullName: true, phone: true } },
  doctor: { select: { fullName: true } },
} satisfies Prisma.AppointmentInclude;

export async function getBookableSchedules(facilityId?: number): Promise<BookableSchedule[]> {
  const today = vietnamDateTime().date;
  const end = new Date(`${today}T00:00:00+07:00`);
  end.setUTCDate(end.getUTCDate() + 30);
  const schedules = await prisma.doctorSchedule.findMany({
    where: {
      date: { gte: today, lte: vietnamDateTime(end).date },
      doctor: { role: 'DOCTOR', status: 'Hoạt động', doctorProfile: { status: 'Đang làm việc' } },
      clinic: { status: 'Hoạt động', facility: { status: 'Hoạt động', ...(facilityId ? { id: facilityId } : {}) } },
    },
    include: scheduleInclude,
    orderBy: [{ date: 'asc' }, { doctorId: 'asc' }, { id: 'asc' }],
  });
  if (!schedules.length) return [];
  const appointments = await prisma.appointment.findMany({
    where: {
      doctorId: { in: [...new Set(schedules.map(s => s.doctorId))] },
      bookingDate: { in: [...new Set(schedules.flatMap(s => bookingDateAliases(s.date)))] },
      status: { notIn: RELEASED_APPOINTMENT_STATUSES },
    },
    select: { doctorId: true, bookingDate: true, bookingTime: true },
  });
  const now = new Date();
  return schedules.flatMap(schedule => {
    const clinic = schedule.clinic;
    const profile = schedule.doctor.doctorProfile;
    if (!clinic || !profile) return [];
    const booked = appointments.filter(a => a.doctorId === schedule.doctorId && normalizeBookingDate(a.bookingDate) === schedule.date);
    const times = parseScheduleTimes(schedule.timeSlots).filter(time => isFutureBooking(schedule.date, time, now));
    const availableTimes = booked.length >= profile.maxPatientsPerDay ? [] : times.filter(time => !booked.some(a => bookingTimesOverlap(a.bookingTime, time)));
    return [{
      id: schedule.id, date: schedule.date, doctorId: schedule.doctorId, doctorName: schedule.doctor.fullName, doctorPrice: profile.price,
      specialtyId: profile.specialtyId, specialty: profile.specialty?.name || 'Đa khoa',
      clinicId: clinic.id, clinicName: clinic.name, facilityId: clinic.facilityId, facilityName: clinic.facility.name,
      room: `${clinic.facility.name} - ${clinic.name}${clinic.roomNumber ? ` (P. ${clinic.roomNumber})` : ''}`,
      times, availableTimes, appointmentCount: booked.length,
    }];
  });
}

interface BookAppointmentInput {
  bookedById: number;
  patientId: number;
  doctorId: number;
  date: string;
  time: string;
  scheduleId?: number;
  facilityId?: number;
  specialtyId?: number;
  specialty?: string;
  reason?: string;
  phone?: string;
  requestId?: string;
  paymentMethod?: string;
  status?: 'CHỜ XÁC NHẬN' | 'CHỜ THANH TOÁN';
  admin?: boolean;
  overrideLimit?: boolean;
  room?: string;
}

// All scheduling entry points acquire the same database locks, across tabs,
// requests and server instances. No process-local lock or schema migration.
export async function bookAppointment(input: BookAppointmentInput, transaction?: Prisma.TransactionClient) {
  const date = normalizeBookingDate(input.date);
  if (!date || !parseBookingTime(input.time)) {
    throw new BookingError('Vui lòng chọn ngày và giờ khám hợp lệ trong tương lai.');
  }
  if (![input.bookedById, input.patientId, input.doctorId].every(id => Number.isSafeInteger(id) && id > 0)) {
    throw new BookingError('Vui lòng chọn hồ sơ người khám và bác sĩ.');
  }
  const requestId = input.requestId || randomUUID();
  if (typeof requestId !== 'string' || requestId.length > 100) throw new BookingError('Yêu cầu đặt lịch không hợp lệ.');
  const appointmentCode = `LH${createHash('sha256').update(`${input.bookedById}:${requestId}`).digest('hex').slice(0, 24).toUpperCase()}`;

  for (let attempt = 0; ; attempt++) {
    try {
      const execute = async (tx: Prisma.TransactionClient) => {
        const lockIds = [...new Set([input.doctorId, input.patientId])].sort((a, b) => a - b);
        await tx.$queryRaw`SELECT id FROM users WHERE id IN (${Prisma.join(lockIds)}) ORDER BY id FOR UPDATE`;

        const actor = await tx.user.findUnique({ where: { id: input.bookedById }, select: { role: true, status: true } });
        if (!actor || actor.status !== 'Hoạt động' || (input.admin && actor.role !== 'ADMIN')) {
          throw new BookingError('Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.', 'AUTH_REQUIRED');
        }
        if (!input.admin && input.patientId !== input.bookedById) {
          const linked = await tx.familyMember.findUnique({ where: { userId_patientId: { userId: input.bookedById, patientId: input.patientId } } });
          if (!linked) throw new BookingError('Bạn chỉ có thể đặt lịch cho bản thân hoặc hồ sơ người thân đã liên kết.');
        }
        const existing = await tx.appointment.findUnique({ where: { appointmentCode }, include: appointmentInclude });
        if (existing) {
          if (existing.patientId !== input.patientId) throw new BookingError('Mã yêu cầu này đã được dùng cho người khám khác. Vui lòng chọn lại lịch.');
          return existing;
        }
        if (!isFutureBooking(date, input.time)) throw new BookingError('Giờ khám đã qua. Vui lòng chọn giờ khác.', 'SLOT_UNAVAILABLE');
        const patient = await tx.user.findUnique({ where: { id: input.patientId }, select: { role: true, status: true, phone: true } });
        if (!patient || patient.role !== 'PATIENT' || patient.status !== 'Hoạt động') throw new BookingError('Hồ sơ người khám không hợp lệ.');

        const doctor = await tx.user.findUnique({
          where: { id: input.doctorId },
          include: { doctorProfile: { include: { specialty: true } } },
        });
        const profile = doctor?.doctorProfile;
        if (!doctor || doctor.role !== 'DOCTOR' || doctor.status !== 'Hoạt động' || !profile || profile.status !== 'Đang làm việc') {
          throw new BookingError('Bác sĩ hiện không nhận lịch khám.');
        }
        if ((input.specialtyId && input.specialtyId !== profile.specialtyId) || (input.specialty && input.specialty !== profile.specialty?.name)) {
          throw new BookingError('Bác sĩ không thuộc chuyên khoa đã chọn.');
        }

        const schedules = await tx.doctorSchedule.findMany({
          where: { doctorId: doctor.id, date, ...(input.scheduleId ? { id: input.scheduleId } : {}) },
          include: { clinic: { include: { facility: true } } },
        });
        const matching = schedules.filter(s => s.clinic?.status === 'Hoạt động' && s.clinic.facility.status === 'Hoạt động'
          && (!input.facilityId || s.clinic.facilityId === input.facilityId)
          && parseScheduleTimes(s.timeSlots).includes(input.time));
        if (!input.admin && matching.length !== 1) {
          throw new BookingError('Ca khám đã thay đổi hoặc không thuộc cơ sở đã chọn. Vui lòng chọn lại giờ khám.', 'SLOT_UNAVAILABLE');
        }
        const schedule = matching.length === 1 ? matching[0] : null;

        const appointments = await tx.appointment.findMany({
          where: {
            OR: [{ doctorId: doctor.id }, { patientId: input.patientId }],
            bookingDate: { in: bookingDateAliases(date) }, status: { notIn: RELEASED_APPOINTMENT_STATUSES },
          },
          select: { doctorId: true, patientId: true, bookingTime: true },
        });
        if (appointments.some(a => bookingTimesOverlap(a.bookingTime, input.time))) {
          throw new BookingError('Giờ khám này vừa được đặt hoặc người khám đã có lịch trùng giờ. Vui lòng chọn giờ khác.', 'SLOT_UNAVAILABLE');
        }
        if (appointments.filter(a => a.doctorId === doctor.id).length >= profile.maxPatientsPerDay && !(input.admin && input.overrideLimit)) {
          throw new BookingError('Bác sĩ đã đủ số bệnh nhân trong ngày. Vui lòng chọn ngày hoặc bác sĩ khác.', 'DAILY_LIMIT');
        }
        // A missing phone may be completed here; existing patient identity is
        // always read from the authorized profile rather than a client snapshot.
        if (!patient.phone && input.phone) {
          const phone = input.phone.replace(/\D/g, '');
          if (!/^0\d{9}$/.test(phone)) throw new BookingError('Số điện thoại không hợp lệ.');
          await tx.user.update({ where: { id: input.patientId }, data: { phone } });
        }
        const clinic = schedule?.clinic;
        return tx.appointment.create({
          data: {
            appointmentCode, patientId: input.patientId, doctorId: doctor.id,
            specialty: profile.specialty?.name || 'Đa khoa', bookingDate: storedBookingDate(date), bookingTime: input.time,
            room: clinic ? `${clinic.facility.name} - ${clinic.name}${clinic.roomNumber ? ` (P. ${clinic.roomNumber})` : ''}` : input.room || 'Chưa xếp phòng',
            reason: input.reason?.trim() || 'Đặt lịch khám trực tuyến',
            status: input.status || 'CHỜ XÁC NHẬN', paymentMethod: input.paymentMethod || 'TẠI QUẦY', paymentStatus: 'CHƯA THANH TOÁN',
          },
          include: appointmentInclude,
        });
      };
      return transaction ? await execute(transaction) : await prisma.$transaction(execute, { maxWait: 10000, timeout: 15000 });
    } catch (error) {
      if (transaction) throw error;
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        const existing = await prisma.appointment.findUnique({ where: { appointmentCode }, include: appointmentInclude });
        if (existing) return existing;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError && attempt < 2
        && (error.code === 'P2034' || (error.code === 'P2010' && ['1213', '1205'].includes(String(error.meta?.code))))) continue;
      throw error;
    }
  }
}

// A family booking either reserves every selected appointment or none of them.
// Acquire all rows in one order before reserving individual slots.
export async function bookAppointments(inputs: BookAppointmentInput[]) {
  if (!inputs.length || inputs.length > 10) throw new BookingError('Vui lòng chọn từ 1 đến 10 hồ sơ người khám.');
  const lockIds = [...new Set(inputs.flatMap(input => [input.doctorId, input.patientId]))].sort((a, b) => a - b);
  if (!lockIds.every(id => Number.isSafeInteger(id) && id > 0)) throw new BookingError('Hồ sơ người khám hoặc bác sĩ không hợp lệ.');
  for (let attempt = 0; ; attempt++) {
    try {
      return await prisma.$transaction(async tx => {
        await tx.$queryRaw`SELECT id FROM users WHERE id IN (${Prisma.join(lockIds)}) ORDER BY id FOR UPDATE`;
        const appointments = [];
        for (const input of inputs) appointments.push(await bookAppointment(input, tx));
        return appointments;
      }, { maxWait: 10000, timeout: 20000 });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && attempt < 2
        && (error.code === 'P2034' || (error.code === 'P2010' && ['1213', '1205'].includes(String(error.meta?.code))))) continue;
      throw error;
    }
  }
}
