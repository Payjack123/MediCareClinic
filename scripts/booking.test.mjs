import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const requireDependency = createRequire(import.meta.url);
const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));

// Load the actual TypeScript modules without Next.js or a live database.
// Only the Prisma transport is replaced; validation and transaction ordering
// are the production implementation.
function loadModule(relativePath, dependencies = {}) {
  const filename = path.join(scriptDirectory, '..', relativePath);
  const source = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
    fileName: filename,
  }).outputText;
  const compiledModule = { exports: {} };
  const execute = vm.runInThisContext(`(function(require, module, exports) { ${source}\n})`, { filename });
  execute(name => Object.hasOwn(dependencies, name) ? dependencies[name] : requireDependency(name), compiledModule, compiledModule.exports);
  return compiledModule.exports;
}

const utils = loadModule('lib/booking-utils.ts');
const date = '2099-01-03';
class PrismaClientKnownRequestError extends Error {}

function fixture() {
  const specialty = { id: 1, name: 'Nội tổng quát' };
  const facility = { id: 1, name: 'MediCare Hà Nội', status: 'Hoạt động' };
  const clinic = { id: 1, name: 'Phòng Nội', roomNumber: '201', facilityId: 1, status: 'Hoạt động', facility };
  const profile = { specialtyId: 1, specialty, status: 'Đang làm việc', maxPatientsPerDay: 10, price: 150000 };
  const users = new Map([
    [1, { id: 1, fullName: 'Bệnh nhân A', role: 'PATIENT', status: 'Hoạt động', phone: '0912345678' }],
    [2, { id: 2, fullName: 'Bệnh nhân B', role: 'PATIENT', status: 'Hoạt động', phone: '0987654321' }],
    [10, { id: 10, fullName: 'Bác sĩ A', role: 'DOCTOR', status: 'Hoạt động', doctorProfile: { ...profile } }],
    [11, { id: 11, fullName: 'Bác sĩ B', role: 'DOCTOR', status: 'Hoạt động', doctorProfile: { ...profile } }],
    [20, { id: 20, role: 'ADMIN', status: 'Hoạt động' }],
  ]);
  const schedules = [10, 11].map((doctorId, index) => ({
    id: index + 1, doctorId, date, clinicId: 1, clinic, doctor: users.get(doctorId),
    timeSlots: JSON.stringify(['08:00', '08:30', '09:00']),
  }));
  const appointments = [];
  const links = [];
  const mutexes = new Map();
  let locks = 0;
  let failNextTransaction = false;

  const models = {
    user: {
      findUnique: async ({ where }) => users.get(where.id) || null,
      update: async ({ where, data }) => Object.assign(users.get(where.id), data),
    },
    familyMember: { findUnique: async ({ where }) => links.find(link => link.userId === where.userId_patientId.userId && link.patientId === where.userId_patientId.patientId) || null },
    doctorSchedule: { findMany: async ({ where }) => schedules.filter(s =>
      (!where.doctorId || s.doctorId === where.doctorId) && (!where.id || s.id === where.id)
      && (typeof where.date !== 'string' || s.date === where.date)
      && (!where.date?.gte || s.date >= where.date.gte) && (!where.date?.lte || s.date <= where.date.lte)
      && (!where.clinic?.facility?.id || s.clinic.facilityId === where.clinic.facility.id)) },
    appointment: {
      findUnique: async ({ where }) => appointments.find(a => a.appointmentCode === where.appointmentCode) || null,
      findMany: async ({ where }) => appointments.filter(a =>
        (!where.OR || where.OR.some(condition => (condition.doctorId && condition.doctorId === a.doctorId) || (condition.patientId && condition.patientId === a.patientId)))
        && (!where.doctorId?.in || where.doctorId.in.includes(a.doctorId))
        && where.bookingDate.in.includes(a.bookingDate)
        && !where.status.notIn.includes(a.status)),
      create: async ({ data }) => {
        assert.ok(locks > 0, 'writes must happen after acquiring database locks');
        const appointment = { id: appointments.length + 1, ...data, patient: { ...users.get(data.patientId) }, doctor: { ...users.get(data.doctorId) } };
        appointments.push(appointment);
        return appointment;
      },
    },
  };
  const prisma = {
    ...models,
    $transaction: async callback => {
      if (failNextTransaction) {
        failNextTransaction = false;
        const error = new PrismaClientKnownRequestError('Write conflict');
        error.code = 'P2034';
        throw error;
      }
      const releases = [];
      const held = new Set();
      const created = [];
      let locked = false;
      try {
        return await callback({
          ...models,
          appointment: {
            ...models.appointment,
            create: async args => {
              const appointment = await models.appointment.create(args);
              created.push(appointment);
              return appointment;
            },
          },
          $queryRaw: async (strings, ids) => {
            assert.match(strings.join(''), /ORDER BY id FOR UPDATE/);
            assert.deepEqual(ids, [...ids].sort((a, b) => a - b), 'lock order must be deterministic');
            for (const id of ids) {
              if (held.has(id)) continue;
              const previous = mutexes.get(id) || Promise.resolve();
              let release;
              const next = new Promise(resolve => { release = resolve; });
              mutexes.set(id, previous.then(() => next));
              await previous;
              held.add(id);
              releases.push(release);
            }
            if (!locked) { locks++; locked = true; }
          },
        });
      } catch (error) {
        for (const appointment of created) appointments.splice(appointments.indexOf(appointment), 1);
        throw error;
      } finally {
        if (locked) locks--;
        releases.reverse().forEach(release => release());
      }
    },
  };
  const service = loadModule('lib/booking.ts', {
    '@/lib/prisma': prisma,
    '@/lib/generated/prisma': { Prisma: { join: ids => ids, PrismaClientKnownRequestError } },
    '@/lib/booking-utils': utils,
  });
  const input = { bookedById: 1, patientId: 1, doctorId: 10, scheduleId: 1, facilityId: 1, specialtyId: 1, date, time: '08:00', requestId: 'request-a' };
  return { ...service, input, users, schedules, appointments, links, failNext: () => { failNextTransaction = true; } };
}

test('dates accept both legacy formats and reject invalid calendar dates', () => {
  assert.equal(utils.normalizeBookingDate('03/01/2099'), date);
  assert.deepEqual(utils.bookingDateAliases(date), [date, '03/01/2099']);
  assert.equal(utils.storedBookingDate(date), '03/01/2099');
  for (const invalid of ['2026-02-29', '2026-02-30', '31/04/2026', '', '2026-13-01']) assert.equal(utils.normalizeBookingDate(invalid), null);
  assert.equal(utils.normalizeBookingDate('2028-02-29'), '2028-02-29');
});

test('Vietnam time is independent of server timezone and allows real evening shifts', () => {
  const now = new Date('2026-11-25T10:30:00Z');
  assert.deepEqual(utils.vietnamDateTime(now), { date: '2026-11-25', minutes: 17 * 60 + 30 });
  assert.equal(utils.isFutureBooking('2026-11-25', '18:00', now), true);
  assert.equal(utils.isFutureBooking('2026-11-25', '17:30', now), false);
  assert.equal(utils.isFutureBooking('2026-11-25', '08:00', now), false);
});

test('time ranges conflict with contained slots but adjacent ranges do not', () => {
  assert.equal(utils.bookingTimesOverlap('08:00 - 10:00', '09:30'), true);
  assert.equal(utils.bookingTimesOverlap('09:30', '08:00 - 10:00'), true);
  assert.equal(utils.bookingTimesOverlap('08:00 - 10:00', '09:00 - 11:00'), true);
  assert.equal(utils.bookingTimesOverlap('08:00 - 10:00', '10:00'), false);
  assert.equal(utils.bookingTimesOverlap('08:00', '08:30'), false);
  assert.equal(utils.parseBookingTime('25:00'), null);
  assert.equal(utils.parseBookingTime('10:00 - 08:00'), null);
  assert.deepEqual(utils.parseScheduleTimes('["08:00", "08:00", "bad", 8]'), ['08:00']);
});

test('a booking uses the authorized patient and actual clinic data', async () => {
  const f = fixture();
  f.links.push({ userId: 1, patientId: 2 });
  const appointment = await f.bookAppointment({ ...f.input, patientId: 2 });
  assert.equal(appointment.patientId, 2);
  assert.equal(appointment.patient.fullName, 'Bệnh nhân B');
  assert.equal(appointment.bookingDate, '03/01/2099');
  assert.equal(appointment.room, 'MediCare Hà Nội - Phòng Nội (P. 201)');
  assert.equal(appointment.specialty, 'Nội tổng quát');
});

test('unlinked patient, wrong facility, wrong specialty and off-shift time are rejected', async () => {
  for (const override of [{ patientId: 2 }, { facilityId: 2 }, { specialtyId: 2 }, { time: '12:00' }, { scheduleId: 2 }]) {
    const f = fixture();
    await assert.rejects(f.bookAppointment({ ...f.input, ...override }), f.BookingError);
    assert.equal(f.appointments.length, 0);
  }
});

test('an appointment saved by the old landing blocks both date formats', async () => {
  for (const bookingDate of [date, '03/01/2099']) {
    const f = fixture();
    f.appointments.push({ doctorId: 10, patientId: 2, bookingDate, bookingTime: '08:00', status: 'CHỜ XÁC NHẬN' });
    await assert.rejects(f.bookAppointment(f.input), error => error.code === 'SLOT_UNAVAILABLE');
  }
});

test('retrying the same request concurrently returns one appointment', async () => {
  const f = fixture();
  const results = await Promise.all([f.bookAppointment(f.input), f.bookAppointment(f.input)]);
  assert.equal(results[0].appointmentCode, results[1].appointmentCode);
  assert.equal(f.appointments.length, 1);
});

test('two patients racing for one doctor slot cannot both succeed', async () => {
  const f = fixture();
  const results = await Promise.allSettled([
    f.bookAppointment(f.input),
    f.bookAppointment({ ...f.input, bookedById: 2, patientId: 2, requestId: 'request-b' }),
  ]);
  assert.equal(results.filter(result => result.status === 'fulfilled').length, 1);
  assert.equal(f.appointments.length, 1);
});

test('one patient cannot race to book overlapping appointments with two doctors', async () => {
  const f = fixture();
  const results = await Promise.allSettled([
    f.bookAppointment(f.input),
    f.bookAppointment({ ...f.input, doctorId: 11, scheduleId: 2, requestId: 'request-b' }),
  ]);
  assert.equal(results.filter(result => result.status === 'fulfilled').length, 1);
});

test('daily capacity is enforced even when different slots are booked concurrently', async () => {
  const f = fixture();
  f.users.get(10).doctorProfile.maxPatientsPerDay = 1;
  const results = await Promise.allSettled([
    f.bookAppointment(f.input),
    f.bookAppointment({ ...f.input, bookedById: 2, patientId: 2, time: '08:30', requestId: 'request-b' }),
  ]);
  assert.equal(results.filter(result => result.status === 'fulfilled').length, 1);
  assert.equal(results.find(result => result.status === 'rejected').reason.code, 'DAILY_LIMIT');
});

test('cancelled bookings release their slot', async () => {
  const f = fixture();
  f.appointments.push({ doctorId: 10, patientId: 2, bookingDate: date, bookingTime: '08:00', status: 'ĐÃ HỦY' });
  await f.bookAppointment(f.input);
  assert.equal(f.appointments.length, 2);
});

test('admin time ranges also use the common conflict check', async () => {
  const f = fixture();
  await f.bookAppointment({ ...f.input, bookedById: 20, admin: true, time: '08:00 - 10:00' });
  await assert.rejects(f.bookAppointment({ ...f.input, bookedById: 2, patientId: 2, time: '08:30', requestId: 'other' }), error => error.code === 'SLOT_UNAVAILABLE');
});

test('transaction write conflicts are retried', async () => {
  const f = fixture();
  f.failNext();
  await f.bookAppointment(f.input);
  assert.equal(f.appointments.length, 1);
});

test('availability counts legacy dates and blocks times overlapped by admin ranges', async () => {
  const f = fixture();
  const tomorrow = utils.vietnamDateTime(new Date(Date.now() + 86400000)).date;
  f.schedules.forEach(schedule => { schedule.date = tomorrow; });
  f.appointments.push({ doctorId: 10, patientId: 2, bookingDate: utils.storedBookingDate(tomorrow), bookingTime: '08:00 - 09:00', status: 'CHỜ XÁC NHẬN' });
  const schedules = await f.getBookableSchedules(1);
  const doctor = schedules.find(s => s.doctorId === 10);
  assert.deepEqual(doctor.availableTimes, ['09:00']);
  assert.equal(doctor.appointmentCount, 1);
  assert.equal(doctor.facilityId, 1);
});

test('retry still returns the original booking if the schedule has since been removed', async () => {
  const f = fixture();
  const original = await f.bookAppointment(f.input);
  f.schedules.length = 0;
  assert.equal((await f.bookAppointment(f.input)).id, original.id);
  assert.equal(f.appointments.length, 1);
});

test('patients cannot request the admin override or use an inactive account', async () => {
  const f = fixture();
  await assert.rejects(f.bookAppointment({ ...f.input, admin: true }), error => error.code === 'AUTH_REQUIRED');
  f.users.get(1).status = 'Khóa';
  await assert.rejects(f.bookAppointment(f.input), error => error.code === 'AUTH_REQUIRED');
  assert.equal(f.appointments.length, 0);
});

test('family batch rolls back every reservation if one member has an unavailable slot', async () => {
  const f = fixture();
  f.links.push({ userId: 1, patientId: 2 });
  await assert.rejects(f.bookAppointments([
    f.input,
    { ...f.input, patientId: 2, time: '08:00', requestId: 'family-b' },
  ]), error => error.code === 'SLOT_UNAVAILABLE');
  assert.equal(f.appointments.length, 0);
});

test('family batch reserves all selected appointments and is safe to retry', async () => {
  const f = fixture();
  f.links.push({ userId: 1, patientId: 2 });
  const inputs = [f.input, { ...f.input, patientId: 2, time: '08:30', requestId: 'family-b' }];
  const results = await f.bookAppointments(inputs);
  assert.equal(results.length, 2);
  assert.equal(f.appointments.length, 2);
  assert.deepEqual((await f.bookAppointments(inputs)).map(a => a.id), results.map(a => a.id));
  assert.equal(f.appointments.length, 2);
});

test('patient clinic booking filters by the actual clinic rather than treating its name as a specialty', async () => {
  const schedules = [{
    id: 1, doctorId: 10, doctorName: 'Bác sĩ A', doctorPrice: 150000,
    date, facilityName: 'MediCare Hà Nội', clinicName: 'Phòng Nội', clinicId: 1,
    specialty: 'Nội tổng quát', room: 'MediCare Hà Nội - Phòng Nội', times: ['08:00', '08:30'], availableTimes: ['08:30'],
  }];
  const actions = loadModule('app/patient/appointments/actions.ts', {
    '@/lib/prisma': {},
    'next/headers': { cookies: async () => ({ get: () => ({ value: '1' }) }) },
    'next/cache': { revalidatePath: () => {} },
    '@/lib/booking': { getBookableSchedules: async () => schedules },
    '@/lib/booking-utils': utils,
  });
  const result = await actions.getAvailableSchedules({ facility: 'MediCare Hà Nội', clinicName: 'Phòng Nội', specialty: 'Phòng Nội' });
  assert.equal(result.success, true);
  assert.equal(result.schedules.length, 1);
  assert.deepEqual(result.schedules[0].bookedTimes, ['08:00']);
  assert.equal(result.schedules[0].doctor.doctorProfile.price, 150000);
  const otherFacility = await actions.getAvailableSchedules({ facility: 'MediCare TP.HCM', clinicName: 'Phòng Nội' });
  assert.equal(otherFacility.schedules.length, 0);
});
