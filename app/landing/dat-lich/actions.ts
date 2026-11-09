'use server';

import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export interface BookingPayload {
  facilityId?: number;
  facilityName?: string;
  specialtyName?: string;
  doctorId?: number;
  doctorName?: string;
  bookingDate: string; // YYYY-MM-DD
  bookingTime: string; // HH:mm
  patientName: string;
  phone: string;
  dob?: string;
  gender?: string;
  address?: string;
  reason?: string;
  paymentMethod?: string;
}

// Lấy dữ liệu khởi tạo cho trang đặt lịch
export async function getBookingInitialData() {
  try {
    const facilities = await prisma.facility.findMany({
      include: {
        clinics: {
          include: {
            specialty: true
          }
        }
      },
      orderBy: { id: 'asc' }
    });

    const specialties = await prisma.specialty.findMany({
      orderBy: { name: 'asc' }
    });

    const doctors = await prisma.doctorProfile.findMany({
      where: {
        status: 'Đang làm việc'
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            avatar: true,
            phone: true,
            address: true
          }
        },
        specialty: true,
        department: true,
        clinics: {
          include: {
            facility: true
          }
        }
      },
      orderBy: { id: 'asc' }
    });

    return {
      success: true,
      facilities,
      specialties,
      doctors
    };
  } catch (error) {
    console.error('Lỗi khi tải dữ liệu đặt lịch khám:', error);
    return {
      success: false,
      facilities: [],
      specialties: [],
      doctors: [],
      message: 'Không thể tải dữ liệu phòng khám lúc này'
    };
  }
}

// Xử lý đặt lịch khám trực tuyến từ Landing Page
export async function createLandingAppointment(payload: BookingPayload) {
  try {
    const {
      facilityId,
      facilityName,
      specialtyName,
      doctorId,
      doctorName,
      bookingDate,
      bookingTime,
      patientName,
      phone,
      dob,
      gender,
      address,
      reason,
      paymentMethod = 'TẠI QUẦY'
    } = payload;

    // Kiểm tra dữ liệu bắt buộc
    if (!patientName?.trim()) {
      return { success: false, message: 'Vui lòng nhập họ và tên người khám' };
    }
    if (!phone?.trim()) {
      return { success: false, message: 'Vui lòng nhập số điện thoại liên hệ' };
    }
    if (!bookingDate) {
      return { success: false, message: 'Vui lòng chọn ngày khám' };
    }
    if (!bookingTime) {
      return { success: false, message: 'Vui lòng chọn khung giờ khám' };
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 9 || cleanPhone.length > 11) {
      return { success: false, message: 'Số điện thoại không hợp lệ' };
    }

    const cookieStore = await cookies();
    const userIdStr = cookieStore.get('user_id')?.value;

    if (!userIdStr) {
      return {
        success: false,
        requireAuth: true,
        message: 'Vui lòng đăng nhập hoặc đăng ký tài khoản để xác nhận và hoàn tất đặt lịch khám.'
      };
    }

    const targetUserId = parseInt(userIdStr, 10);
    if (isNaN(targetUserId)) {
      return {
        success: false,
        requireAuth: true,
        message: 'Phiên đăng nhập không hợp lệ, vui lòng đăng nhập lại.'
      };
    }

    // Cập nhật thêm SĐT nếu user chưa có
    const existingUser = await prisma.user.findUnique({
      where: { id: targetUserId }
    });
    if (existingUser && !existingUser.phone) {
      await prisma.user.update({
        where: { id: targetUserId },
        data: { phone: cleanPhone }
      }).catch(() => {});
    }

    // Xác định Bác sĩ được chỉ định
    let assignedDoctorId = doctorId;

    if (!assignedDoctorId || assignedDoctorId === 0) {
      // Tìm bác sĩ phù hợp với chuyên khoa hoặc cơ sở
      let matchedDoctor: { id: number; userId: number; user?: { id: number; fullName: string } } | null = null;

      if (specialtyName && specialtyName !== 'Tất cả chuyên khoa') {
        matchedDoctor = await prisma.doctorProfile.findFirst({
          where: {
            status: 'Đang làm việc',
            specialty: { name: specialtyName }
          },
          include: { user: true }
        });
      }

      if (!matchedDoctor && facilityId) {
        matchedDoctor = await prisma.doctorProfile.findFirst({
          where: {
            status: 'Đang làm việc',
            clinics: {
              some: {
                facilityId: facilityId
              }
            }
          },
          include: { user: true }
        });
      }

      if (!matchedDoctor) {
        // Lấy bất kỳ bác sĩ đang làm việc nào
        matchedDoctor = await prisma.doctorProfile.findFirst({
          where: { status: 'Đang làm việc' },
          include: { user: true }
        });
      }

      if (matchedDoctor) {
        assignedDoctorId = matchedDoctor.userId || matchedDoctor.id;
      } else {
        // Fallback bác sĩ user role DOCTOR
        const fallbackDoctor = await prisma.user.findFirst({
          where: { role: 'DOCTOR' }
        });
        if (fallbackDoctor) {
          assignedDoctorId = fallbackDoctor.id;
        } else {
          return { success: false, message: 'Hiện không có bác sĩ khả dụng để nhận lịch này' };
        }
      }
    }

    // Lấy thông tin bác sĩ đã chọn để hiển thị kết quả
    const doctorUser = await prisma.user.findUnique({
      where: { id: assignedDoctorId },
      include: {
        doctorProfile: {
          include: {
            specialty: true,
            clinics: {
              include: { facility: true }
            }
          }
        }
      }
    });

    // Sinh mã lịch hẹn duy nhất: LH + 6 số thời gian + 2 số ngẫu nhiên
    const appointmentCode = `LH${Date.now().toString().slice(-6)}${Math.floor(10 + Math.random() * 90)}`;
    const chosenSpecialty = specialtyName || doctorUser?.doctorProfile?.specialty?.name || 'Đa khoa';

    // Tạo lịch hẹn trong CSDL
    const newAppointment = await prisma.appointment.create({
      data: {
        patientId: targetUserId,
        doctorId: assignedDoctorId,
        specialty: chosenSpecialty,
        bookingDate: bookingDate,
        bookingTime: bookingTime,
        reason: reason?.trim() || 'Đặt lịch khám trực tuyến qua website MediCare',
        status: 'CHỜ XÁC NHẬN',
        appointmentCode: appointmentCode,
        paymentMethod: paymentMethod,
        paymentStatus: 'CHƯA THANH TOÁN'
      }
    });

    // Tạo thông báo cho bệnh nhân
    await prisma.notification.create({
      data: {
        userId: targetUserId,
        title: 'Đặt lịch khám thành công',
        message: `Mã lịch hẹn của bạn là ${appointmentCode}. Ngày khám: ${bookingDate} vào lúc ${bookingTime}. Chuyên khoa: ${chosenSpecialty}. Bác sĩ: ${doctorUser?.fullName || 'Bác sĩ chuyên khoa'}.`,
        type: 'APPOINTMENT',
        link: '/patient/appointments'
      }
    }).catch((err) => {
      console.warn('Không thể gửi thông báo:', err);
    });

    revalidatePath('/landing');
    revalidatePath('/landing/dat-lich');
    revalidatePath('/patient/appointments');
    revalidatePath('/receptionist/appointments');

    return {
      success: true,
      appointmentCode: appointmentCode,
      appointmentId: newAppointment.id,
      details: {
        appointmentCode,
        patientName: patientName.trim(),
        phone: cleanPhone,
        bookingDate,
        bookingTime,
        doctorName: doctorUser?.fullName || doctorName || 'Bác sĩ chuyên khoa MediCare',
        specialty: chosenSpecialty,
        facilityName: facilityName || doctorUser?.doctorProfile?.clinics?.[0]?.facility?.name || 'Hệ thống Y tế MediCare',
        room: doctorUser?.doctorProfile?.clinics?.[0]?.name || 'Phòng khám chuyên khoa'
      }
    };
  } catch (error) {
    console.error('Lỗi khi đặt lịch khám từ landing:', error);
    return {
      success: false,
      message: 'Có lỗi xảy ra trong quá trình đặt lịch. Vui lòng thử lại hoặc gọi Hotline 0941.298.865'
    };
  }
}

