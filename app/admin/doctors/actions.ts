'use server';

import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

export async function getDoctors(filters?: { search?: string, specialty?: string, status?: string }) {
  try {
    const cookieStore = await cookies();
    const userRole = cookieStore.get('user_role')?.value;

    if (userRole !== 'admin') {
      return { success: false, message: 'Không có quyền truy cập' };
    }

    const whereClause: any = { role: 'DOCTOR' };

    // Tìm kiếm (Tên, Mã, SĐT)
    if (filters?.search) {
      whereClause.OR = [
        { fullName: { contains: filters.search } },
        { phone: { contains: filters.search } },
        { doctorProfile: { doctorCode: { contains: filters.search } } }
      ];
    }

    // Lọc khoa và trạng thái thông qua bảng phụ DoctorProfile
    const profileFilter: any = {};
    let hasProfileFilter = false;

    if (filters?.specialty) {
      profileFilter.specialty = filters.specialty;
      hasProfileFilter = true;
    }
    
    if (filters?.status) {
      profileFilter.status = filters.status;
      hasProfileFilter = true;
    }

    if (hasProfileFilter) {
      whereClause.doctorProfile = {
        ...whereClause.doctorProfile,
        ...profileFilter
      };
    }

    const doctors = await prisma.user.findMany({
      where: whereClause,
      include: {
        doctorProfile: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return { success: true, data: doctors };
  } catch (error) {
    console.error("Lỗi lấy danh sách bác sĩ:", error);
    return { success: false, message: 'Lỗi máy chủ' };
  }
}

export async function getDoctorSpecialties() {
  try {
    const specialties = await prisma.doctorProfile.findMany({
      select: { specialty: true },
      distinct: ['specialty']
    });
    return { success: true, data: specialties.map(s => s.specialty).filter(Boolean) };
  } catch (error) {
    return { success: false, data: [] };
  }
}

export async function createDoctor(data: any) {
  try {
    const cookieStore = await cookies();
    if (cookieStore.get('user_role')?.value !== 'admin') {
      return { success: false, message: 'Không có quyền truy cập' };
    }

    // Validate email/phone duplicate
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: data.email },
          { phone: data.phone }
        ]
      }
    });

    if (existingUser) {
      return { success: false, message: 'Email hoặc Số điện thoại đã được sử dụng!' };
    }

    const existingCode = await prisma.doctorProfile.findFirst({
      where: { doctorCode: data.doctorCode }
    });

    if (existingCode && data.doctorCode) {
      return { success: false, message: 'Mã bác sĩ đã tồn tại!' };
    }

    // Default password is their phone number
    const hashedPassword = await bcrypt.hash(data.phone, 10);

    // Create user and profile in a transaction
    const newDoctor = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          passwordHash: hashedPassword,
          role: 'DOCTOR'
        }
      });

      await tx.doctorProfile.create({
        data: {
          userId: user.id,
          doctorCode: data.doctorCode,
          specialty: data.specialty,
          degree: data.degree,
          experience: data.experience,
          status: 'Hoạt động', // Đang làm việc / Hoạt động
          certificateNumber: data.certificateNumber || null,
        }
      });

      return user;
    });

    return { success: true, data: newDoctor, message: 'Thêm bác sĩ thành công' };
  } catch (error) {
    console.error("Lỗi thêm bác sĩ:", error);
    return { success: false, message: 'Lỗi máy chủ khi tạo bác sĩ' };
  }
}

export async function getDoctorById(id: number) {
  try {
    const doctor = await prisma.user.findUnique({
      where: { id, role: 'DOCTOR' },
      include: { doctorProfile: true }
    });

    if (!doctor) return { success: false, message: 'Không tìm thấy bác sĩ' };

    return { success: true, data: doctor };
  } catch (error) {
    console.error("Lỗi lấy thông tin bác sĩ:", error);
    return { success: false, message: 'Lỗi máy chủ' };
  }
}

export async function updateDoctor(id: number, data: any) {
  try {
    const cookieStore = await cookies();
    if (cookieStore.get('user_role')?.value !== 'admin') {
      return { success: false, message: 'Không có quyền truy cập' };
    }

    // Check code duplication for other doctors
    if (data.doctorCode) {
      const existingCode = await prisma.doctorProfile.findFirst({
        where: { doctorCode: data.doctorCode, userId: { not: id } }
      });
      if (existingCode) return { success: false, message: 'Mã bác sĩ đã tồn tại!' };
    }

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id },
        data: {
          fullName: data.fullName,
          phone: data.phone,
          email: data.email,
        }
      });

      await tx.doctorProfile.update({
        where: { userId: id },
        data: {
          doctorCode: data.doctorCode,
          specialty: data.specialty,
          degree: data.degree,
          experience: data.experience,
          certificateNumber: data.certificateNumber
        }
      });
    });

    return { success: true, message: 'Cập nhật thành công' };
  } catch (error) {
    console.error("Lỗi cập nhật bác sĩ:", error);
    return { success: false, message: 'Lỗi máy chủ khi cập nhật' };
  }
}

export async function updateDoctorStatus(id: number, status: string) {
  try {
    const cookieStore = await cookies();
    if (cookieStore.get('user_role')?.value !== 'admin') {
      return { success: false, message: 'Không có quyền truy cập' };
    }

    await prisma.doctorProfile.update({
      where: { userId: id },
      data: { status }
    });

    return { success: true, message: 'Cập nhật trạng thái thành công' };
  } catch (error) {
    console.error("Lỗi cập nhật trạng thái:", error);
    return { success: false, message: 'Lỗi máy chủ' };
  }
}