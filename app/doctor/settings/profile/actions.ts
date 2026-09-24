// app/actions/doctor-profile.ts
'use server';

import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

// Hàm helper sinh lịch 7 ngày của tuần hiện tại
function generateCurrentWeekSchedule() {
  const today = new Date();
  const currentDay = today.getDay(); // 0: CN, 1: T2...
  const diff = today.getDate() - currentDay + (currentDay === 0 ? -6 : 1); // Lùi về Thứ 2
  const monday = new Date(today.setDate(diff));

  const week = [];
  const dayNames = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    const dayName = i === 6 ? 'Chủ nhật' : `Thứ ${i + 2}`;
    const dateStr = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;

    week.push({
      day: `${dayName} - ${dateStr}`,
      time: '08:00 - 17:00',
      room: 'Chưa xếp',
      status: 'Có lịch'
    });
  }
  return week;
}

// 1. LẤY DỮ LIỆU
export async function getDoctorProfileData(targetDoctorId?: number) {
  try {
    let doctorIdToFetch = targetDoctorId;

    if (!doctorIdToFetch) {
      const cookieStore = await cookies();
      const userIdStr = cookieStore.get('user_id')?.value;
      if (!userIdStr) return { success: false, message: 'Chưa đăng nhập' };
      doctorIdToFetch = parseInt(userIdStr);
    }

    const doctor = await prisma.user.findUnique({
      where: { id: doctorIdToFetch },
      include: {
        doctorProfile: { include: { specialty: true } },
        appointmentsAsDoctor: { select: { id: true, status: true } },
      }
    });

    if (!doctor) return { success: false, message: 'Không tìm thấy tài khoản bác sĩ' };

    const uniquePatients = new Set(await prisma.appointment.findMany({
      where: { doctorId: doctor.id },
      select: { patientId: true }
    }));

    const dProfile = doctor.doctorProfile || {
      specialty: null,
      degree: 'Chưa cập nhật',
      university: 'Chưa cập nhật',
      experience: '0',
      languages: 'Chưa cập nhật',
      rating: 5.0,
      status: 'Đang làm việc',
      certificates: null,
      schedule: null,
      certificateNumber: null,
      bio: null,
      doctorCode: null,
      price: 150000
    };

    const profileData = {
      id: doctor.id,
      doctorCode: dProfile.doctorCode || `BS${doctor.id.toString().padStart(4, '0')}`,
      fullName: doctor.fullName,
      email: doctor.email,
      phone: doctor.phone || 'Chưa cập nhật',
      dob: doctor.dob || 'Chưa cập nhật',
      gender: doctor.gender || 'Nam',
      address: doctor.address || 'Chưa cập nhật',
      avatar: doctor.avatar || `https://ui-avatars.com/api/?name=${doctor.fullName.replace(/ /g, '+')}&background=random`,

      specialty: dProfile.specialty?.name || 'Chưa cập nhật',
      status: dProfile.status || 'Đang làm việc',
      degree: dProfile.degree || 'Chưa cập nhật',
      university: dProfile.university || 'Chưa cập nhật',
      experience: parseInt(dProfile.experience) || 0,
      languages: dProfile.languages || 'Chưa cập nhật',
      rating: dProfile.rating || 5.0,
      price: dProfile.price || 150000,

      certificates: {
        certificateNumber: dProfile.certificateNumber || '',
        bio: dProfile.bio || '',
        items: Array.isArray(dProfile.certificates) ? dProfile.certificates : [{ id: 1, name: 'Bằng Bác sĩ Đa khoa', year: '2015' }]
      },
      // Nếu DB chưa có lịch, tự động sinh lịch tuần hiện tại
      schedule: dProfile.schedule || generateCurrentWeekSchedule(),

      stats: {
        totalPatients: uniquePatients.size,
        totalAppointments: doctor.appointmentsAsDoctor.length,
        prescriptions: 0,
        completionRate: 100
      },
      reviews: []
    };

    return { success: true, data: profileData };
  } catch (error) {
    return { success: false, message: 'Lỗi server' };
  }
}

// 2. CẬP NHẬT
export async function updateDoctorProfileData(formData: any) {
  try {
    const cookieStore = await cookies();
    const userIdStr = cookieStore.get('user_id')?.value;
    if (!userIdStr) return { success: false, message: 'Chưa đăng nhập' };
    const doctorId = parseInt(userIdStr);

    await prisma.user.update({
      where: { id: doctorId },
      data: {
        fullName: formData.fullName,
        phone: formData.phone,
        dob: formData.dob,
        gender: formData.gender,
        address: formData.address,
      }
    });

    let specialtyId = null;
    if (formData.specialty) {
      const spec = await prisma.specialty.findFirst({
        where: { name: { contains: formData.specialty } }
      });
      if (spec) specialtyId = spec.id;
    }

    await prisma.doctorProfile.upsert({
      where: { userId: doctorId },
      update: {
        specialtyId: specialtyId,
        status: formData.status,
        experience: formData.experience.toString(),
        degree: formData.degree,
        university: formData.university,
        languages: formData.languages,
        price: parseInt(formData.price) || 150000,
        doctorCode: `BS${doctorId.toString().padStart(4, '0')}`,
        certificateNumber: formData.certificateNumber,
        bio: formData.bio,
        certificates: formData.certificates?.items || [],
        schedule: formData.schedule, // <--- BỔ SUNG LƯU LỊCH LÀM VIỆC (JSON)
      },
      create: {
        userId: doctorId,
        specialtyId: specialtyId,
        status: formData.status || 'Đang làm việc',
        experience: formData.experience.toString(),
        degree: formData.degree,
        university: formData.university,
        languages: formData.languages,
        doctorCode: `BS${doctorId.toString().padStart(4, '0')}`,
        certificateNumber: formData.certificateNumber,
        bio: formData.bio,
        certificates: formData.certificates?.items || [],
        schedule: formData.schedule, // <--- BỔ SUNG LƯU LỊCH LÀM VIỆC (JSON)
        rating: 5.0,
        price: parseInt(formData.price) || 150000,
        imagePrefix: "B"
      }
    });

    return { success: true, message: 'Cập nhật hồ sơ và lịch làm việc thành công!' };
  } catch (error) {
    return { success: false, message: 'Lỗi server khi lưu dữ liệu' };
  }
}
