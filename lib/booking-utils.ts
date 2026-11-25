// Keep storage compatible with the existing reception/doctor screens. Accept
// both formats when reading appointments created by the old landing page.
export function normalizeBookingDate(value: string): string | null {
  if (typeof value !== 'string') return null;
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  const local = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  if (!iso && !local) return null;
  const [year, month, day] = iso
    ? [Number(iso[1]), Number(iso[2]), Number(iso[3])]
    : [Number(local![3]), Number(local![2]), Number(local![1])];
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function bookingDateAliases(value: string): string[] {
  const iso = normalizeBookingDate(value);
  return iso ? [iso, iso.split('-').reverse().join('/')] : [];
}

export function storedBookingDate(value: string): string {
  const dates = bookingDateAliases(value);
  if (!dates.length) throw new Error('Ngày khám không hợp lệ');
  return dates[1];
}

export function parseBookingTime(value: string) {
  if (typeof value !== 'string') return null;
  const match = /^(\d{2}):(\d{2})(?:\s*-\s*(\d{2}):(\d{2}))?$/.exec(value);
  if (!match) return null;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour > 23 || minute > 59) return null;
  const start = hour * 60 + minute;
  let end = start + 1;
  if (match[3]) {
    const endHour = Number(match[3]);
    const endMinute = Number(match[4]);
    if (endHour > 23 || endMinute > 59) return null;
    end = endHour * 60 + endMinute;
    if (end <= start) return null;
  }
  return { start, end };
}

export function bookingTimesOverlap(left: string, right: string): boolean {
  const a = parseBookingTime(left);
  const b = parseBookingTime(right);
  return !!a && !!b && a.start < b.end && b.start < a.end;
}

export function vietnamDateTime(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(now);
  const part = (name: string) => parts.find(p => p.type === name)!.value;
  return { date: `${part('year')}-${part('month')}-${part('day')}`, minutes: Number(part('hour')) * 60 + Number(part('minute')) };
}

export function isFutureBooking(date: string, time: string, now = new Date()): boolean {
  const iso = normalizeBookingDate(date);
  const slot = parseBookingTime(time);
  const current = vietnamDateTime(now);
  return !!iso && !!slot && (iso > current.date || (iso === current.date && slot.start > current.minutes));
}

export function parseScheduleTimes(value: string | null): string[] {
  try {
    const parsed: unknown = JSON.parse(value || '[]');
    return Array.isArray(parsed)
      ? [...new Set(parsed.filter((time): time is string => typeof time === 'string' && !!parseBookingTime(time)))].sort()
      : [];
  } catch {
    return [];
  }
}

export const RELEASED_APPOINTMENT_STATUSES = ['ĐÃ HỦY', 'Đã hủy', 'BỎ LƯỢT'];

export interface BookingPatient {
  id: number;
  fullName: string;
  phone: string | null;
  dob: string | null;
  gender: string | null;
}

export interface BookableSchedule {
  id: number;
  doctorId: number;
  doctorName: string;
  doctorPrice: number;
  specialtyId: number | null;
  specialty: string;
  clinicId: number;
  clinicName: string;
  facilityId: number;
  facilityName: string;
  room: string;
  date: string;
  times: string[];
  availableTimes: string[];
  appointmentCount: number;
}
