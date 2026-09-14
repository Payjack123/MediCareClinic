'use server';

import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

export async function getPatients(filters?: { search?: string, gender?: string, status?: string }) {
  try {
    const cookieStore = await cookies();
    if (cookieStore.get('user_role')?.value !== 'admin') {
      return { success: false, message: 'Không có quyền truy cập' };
    }

    const whereClause: any = { role: 'PATIENT' };

    if (filters?.search) {
      whereClause.OR = [
        { fullName: { contains: filters.search } },
        { phone: { contains: filters.search } },
        { patientProfile: { patientCode: { contains: filters.search } } }
      ];
    }

    if (filters?.gender) {
      whereClause.gender = filters.gender;
    }
    
    if (filters?.status) {
      whereClause.status = filters.status;
    }

    const patients = await prisma.user.findMany({
      where: whereClause,
      include: {
        patientProfile: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return { success: true, data: patients };
  } catch (error) {
    console.error("Lỗi lấy danh sách bệnh nhân:", error);
    return { success: false, message: 'Lỗi máy chủ' };
  }
}

export async function createPatient(data: any) {
  try {
    const cookieStore = await cookies();
    if (cookieStore.get('user_role')?.value !== 'admin') {
      return { success: false, message: 'Không có quyền truy cập' };
    }

    // Tự sinh mã bệnh nhân nếu không nhập
    let code = data.patientCode;
    if (!code) {
      const count = await prisma.user.count({ where: { role: 'PATIENT' } });
      code = `BN${String(count + 1000).padStart(5, '0')}`;
    } else {
      const existingCode = await prisma.patientProfile.findFirst({
        where: { patientCode: code }
      });
      if (existingCode) return { success: false, message: 'Mã bệnh nhân đã tồn tại!' };
    }

    // Kiểm tra trùng lặp SĐT/Email
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { phone: data.phone },
          ...(data.email ? [{ email: data.email }] : [])
        ]
      }
    });

    if (existingUser) {
      return { success: false, message: 'Số điện thoại hoặc Email đã được sử dụng!' };
    }

    // Mật khẩu mặc định là số điện thoại
    const hashedPassword = await bcrypt.hash(data.phone, 10);

    const newPatient = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          fullName: data.fullName,
          phone: data.phone,
          email: data.email || `bn_${code.toLowerCase()}@system.local`,
          passwordHash: hashedPassword,
          role: 'PATIENT',
          gender: data.gender || 'Nam',
          dob: data.dob,
          address: data.address,
          status: 'Hoạt động'
        }
      });

      await tx.patientProfile.create({
        data: {
          userId: user.id,
          patientCode: code,
          cccd: data.cccd,
          bhyt: data.bhyt,
          insurance: data.insurance,
        }
      });

      return user;
    });

    return { success: true, data: newPatient, message: 'Thêm bệnh nhân thành công' };
  } catch (error) {
    console.error("Lỗi thêm bệnh nhân:", error);
    return { success: false, message: 'Lỗi máy chủ khi tạo bệnh nhân' };
  }
}

export async function getPatientById(id: number) {
  try {
    const cookieStore = await cookies();
    if (cookieStore.get('user_role')?.value !== 'admin') {
      return { success: false, message: 'Không có quyền truy cập' };
    }

    const patient = await prisma.user.findUnique({
      where: { id, role: 'PATIENT' },
      include: { 
        patientProfile: true,
        appointmentsAsPatient: {
          include: { doctor: true },
          orderBy: { createdAt: 'desc' }
        },
        examinationsAsPatient: {
          include: { doctor: true },
          orderBy: { createdAt: 'desc' }
        },
        invoicesAsPatient: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!patient) return { success: false, message: 'Không tìm thấy bệnh nhân' };

    return { success: true, data: patient };
  } catch (error) {
    console.error("Lỗi lấy thông tin bệnh nhân:", error);
    return { success: false, message: 'Lỗi máy chủ' };
  }
}

export async function updatePatient(id: number, data: any) {
  try {
    const cookieStore = await cookies();
    if (cookieStore.get('user_role')?.value !== 'admin') {
      return { success: false, message: 'Không có quyền truy cập' };
    }

    if (data.patientCode) {
      const existingCode = await prisma.patientProfile.findFirst({
        where: { patientCode: data.patientCode, userId: { not: id } }
      });
      if (existingCode) return { success: false, message: 'Mã bệnh nhân đã tồn tại ở hồ sơ khác!' };
    }

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id },
        data: {
          fullName: data.fullName,
          phone: data.phone,
          email: data.email,
          gender: data.gender,
          dob: data.dob,
          address: data.address
        }
      });

      await tx.patientProfile.update({
        where: { userId: id },
        data: {
          patientCode: data.patientCode,
          cccd: data.cccd,
          bhyt: data.bhyt,
          insurance: data.insurance,
        }
      });
    });

    return { success: true, message: 'Cập nhật thành công' };
  } catch (error) {
    console.error("Lỗi cập nhật bệnh nhân:", error);
    return { success: false, message: 'Lỗi máy chủ khi cập nhật' };
  }
}

export async function updatePatientStatus(id: number, status: string) {
  try {
    const cookieStore = await cookies();
    if (cookieStore.get('user_role')?.value !== 'admin') {
      return { success: false, message: 'Không có quyền truy cập' };
    }

    await prisma.user.update({
      where: { id },
      data: { status }
    });

    return { success: true, message: 'Cập nhật trạng thái thành công' };
  } catch (error) {
    console.error("Lỗi cập nhật trạng thái:", error);
    return { success: false, message: 'Lỗi máy chủ' };
  }
}