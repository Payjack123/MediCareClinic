'use server';

import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

// 1. Lấy dữ liệu khởi tạo cho trang Đặt lịch Bệnh nhân
export async function getPatientAppointmentData() {
  try {
    const cookieStore = await cookies();
    const userIdStr = cookieStore.get('user_id')?.value;
    if (!userIdStr) return { success: false, message: 'Chưa đăng nhập' };
    
    const userId = parseInt(userIdStr);

    const user = await prisma.user.findUnique({ 
      where: { id: userId },
      select: { 
        id: true, 
        fullName: true, 
        email: true,
        phone: true, 
        dob: true,
        gender: true,
        address: true, 
        patientProfile: true,
        managedFamilyMembers: {
          include: {
            patient: {
              select: {
                id: true,
                fullName: true,
                phone: true,
                dob: true,
                address: true,
                patientProfile: true
              }
            }
          }
        }
      } 
    });

    if (user && (!user.patientProfile?.patientCode || user.patientProfile?.patientCode === 'BN-NEW')) {
      const generatedCode = `BN${new Date().getFullYear().toString().slice(-2)}${user.id.toString().padStart(4, '0')}`;
      await prisma.patientProfile.upsert({
        where: { userId: userId },
        update: { patientCode: generatedCode },
        create: { userId: userId, patientCode: generatedCode }
      });
    }

    const [doctors, history, facilities, specialties, clinics] = await Promise.all([
      prisma.user.findMany({
        where: { role: 'DOCTOR' },
        include: { doctorProfile: { include: { specialty: true, clinics: true } } }
      }),
      prisma.appointment.findMany({
        where: { patientId: userId },
        orderBy: { createdAt: 'desc' },
        include: { 
          doctor: { 
            select: { 
              fullName: true, 
              avatar: true, 
              doctorProfile: { include: { specialty: true } } 
            } 
          } 
        }
      }),
      prisma.facility.findMany(),
      prisma.specialty.findMany(),
      prisma.clinic.findMany()
    ]);

    return { success: true, data: { user, doctors, history, facilities, specialties, clinics } };
  } catch (error) {
    console.error('Lỗi lấy dữ liệu đặt lịch:', error);
    return { success: false, message: 'Lỗi server' };
  }
}

// 2. Lấy các khung giờ ĐÃ BỊ ĐẶT
export async function getBookedTimes(doctorId: number, date: string) {
  try {
    const appointments = await prisma.appointment.findMany({
      where: { doctorId, bookingDate: date, status: { not: 'ĐÃ HỦY' } },
      select: { bookingTime: true }
    });
    return { success: true, bookedTimes: appointments.map(a => a.bookingTime) };
  } catch (error) {
    return { success: false, bookedTimes: [] };
  }
}

export async function getDoctorSchedules(doctorId: number) {
  try {
    console.log('--- FETCHING SCHEDULE FOR DOCTOR ---', doctorId);
    
    const schedules = await prisma.doctorSchedule.findMany({
      where: { doctorId: doctorId },
      orderBy: { date: 'asc' }
    });
    console.log('--- SCHEDULES RETURNED ---', schedules.length);
    return { success: true, schedules };
  } catch (error) {
    console.error('Lỗi lấy lịch trực chi tiết:', error);
    return { success: false, schedules: [] };
  }
}

// 3. XÁC NHẬN ĐẶT LỊCH
export async function createAppointment(data: { doctorId: number, specialty: string, date: string, time: string, reason: string, status?: string, paymentMethod?: string }) {
  try {
    const cookieStore = await cookies();
    const userIdStr = cookieStore.get('user_id')?.value;
    if (!userIdStr) return { success: false, message: 'Chưa đăng nhập' };

    // Sinh mã lịch hẹn tự động
    const generatedCode = `LH${Date.now().toString().slice(-6)}${Math.floor(10 + Math.random() * 90)}`;
    const paymentMethod = data.paymentMethod || 'TẠI QUẦY';
    const paymentStatus = 'CHƯA THANH TOÁN';

    let assignedDoctorId = data.doctorId;

    // NẾU CHƯA CÓ BÁC SĨ (VÌ CHỌN THEO KHOA HOẶC PHÒNG KHÁM), TÌM BÁC SĨ RANDOM
    if (!assignedDoctorId || assignedDoctorId === 0) {
      const randomDoctor = await prisma.user.findFirst({
        where: { role: 'DOCTOR' },
        select: { id: true }
      });
      if (randomDoctor) {
        assignedDoctorId = randomDoctor.id;
      } else {
        return { success: false, message: 'Không có bác sĩ nào trống để nhận lịch này.' };
      }
    }

    // KIỂM TRA GIỚI HẠN SỐ LƯỢNG BỆNH NHÂN TRONG NGÀY
    const doctorProfile = await prisma.doctorProfile.findUnique({
      where: { userId: assignedDoctorId },
      select: { maxPatientsPerDay: true }
    });
    
    const maxPatients = doctorProfile?.maxPatientsPerDay || 10;
    
    const currentAppointmentsCount = await prisma.appointment.count({
      where: {
        doctorId: assignedDoctorId,
        bookingDate: data.date,
        status: { not: 'ĐÃ HỦY' }
      }
    });

    if (currentAppointmentsCount >= maxPatients) {
      return { success: false, message: 'Bác sĩ đã kín lịch trong ngày này. Vui lòng chọn ngày khác.' };
    }

    const newApt = await prisma.appointment.create({
      data: {
        patientId: parseInt(userIdStr),
        doctorId: assignedDoctorId,
        specialty: data.specialty || 'Đa khoa',
        bookingDate: data.date,
        bookingTime: data.time,
        reason: data.reason,
        status: data.status || 'CHỜ XÁC NHẬN',
        appointmentCode: generatedCode,
        paymentMethod: paymentMethod,
        paymentStatus: paymentStatus
      } as any // Use 'any' temporarily to avoid TS errors until prisma generate is recognized
    });

    return { success: true, appointmentCode: generatedCode };
  } catch (error) {
    console.error('Lỗi đặt lịch:', error);
    return { success: false, message: 'Không thể đặt lịch lúc này.' };
  }
}

// 4. LẤY HỒ SƠ CÔNG KHAI CỦA BÁC SĨ (MỚI THÊM)
export async function getPublicDoctorProfile(doctorId: number) {
  try {
    const doctor = await prisma.user.findUnique({
      where: { id: doctorId, role: 'DOCTOR' },
      include: {
        doctorProfile: true,
        appointmentsAsDoctor: { select: { id: true, status: true } },
      }
    });

    if (!doctor) return { success: false, message: 'Không tìm thấy thông tin bác sĩ này' };

    const uniquePatients = new Set(await prisma.appointment.findMany({
      where: { doctorId: doctor.id },
      select: { patientId: true }
    }));

    const dProfile = doctor.doctorProfile || {} as any;

    let parsedSchedule = [];
    if (dProfile.schedule) {
      if (typeof dProfile.schedule === 'string') {
        try { parsedSchedule = JSON.parse(dProfile.schedule); } catch (e) {}
      } else if (Array.isArray(dProfile.schedule)) {
        parsedSchedule = dProfile.schedule;
      }
    }

    const profileData = {
      id: `BS${doctor.id.toString().padStart(3, '0')}`,
      fullName: doctor.fullName,
      gender: doctor.gender || 'Nam',
      avatar: doctor.avatar || `https://ui-avatars.com/api/?name=${doctor.fullName.replace(/ /g, '+')}&background=2563EB&color=fff`,
      
      specialty: dProfile.specialty || 'Đa khoa',
      status: dProfile.status || 'Đang làm việc',
      degree: dProfile.degree || 'Chưa cập nhật',
      university: dProfile.university || 'Chưa cập nhật',
      experience: parseInt(dProfile.experience) || 0,
      languages: dProfile.languages || 'Chưa cập nhật',
      rating: dProfile.rating || 5.0,
      
      certificates: dProfile.certificates || [],
      schedule: parsedSchedule,
      
      stats: {
        totalPatients: uniquePatients.size,
        totalAppointments: doctor.appointmentsAsDoctor.length,
      },
      reviews: [
        { id: 1, name: 'Trần Thị H.', rating: 5, comment: 'Bác sĩ rất tận tình, khám kỹ và dặn dò chu đáo.', date: 'Gần đây' },
        { id: 2, name: 'Nguyễn Văn M.', rating: 5, comment: 'Chuyên môn cao, phòng khám sạch sẽ.', date: 'Tháng trước' }
      ]
    };

    return { success: true, data: profileData };
  } catch (error) {
    return { success: false, message: 'Lỗi server' };
  }
}

// 5. TÌM KIẾM BỆNH NHÂN THEO SĐT / CCCD / MÃ
export async function findPatientByQuery(query: string) {
  try {
    const q = query.trim();
    if (!q) return { success: false, message: 'Vui lòng nhập thông tin tìm kiếm' };

    const patient = await prisma.user.findFirst({
      where: {
        role: 'PATIENT',
        OR: [
          { phone: q },
          { patientProfile: { cccd: q } },
          { patientProfile: { patientCode: q } }
        ]
      },
      select: {
        fullName: true,
        phone: true,
        address: true,
        patientProfile: true
      }
    });

    if (!patient) {
      return { success: false, message: 'Không tìm thấy hồ sơ phù hợp' };
    }

    return { success: true, data: patient };
  } catch (error) {
    console.error('Lỗi tìm kiếm bệnh nhân:', error);
    return { success: false, message: 'Lỗi server' };
  }
}

// 6. GIẢ LẬP THANH TOÁN THÀNH CÔNG (Dành cho mock payment)
export async function mockConfirmPayment(paymentCode: string) {
  try {
    await prisma.appointment.updateMany({
      where: {
        reason: { contains: paymentCode }
      },
      data: {
        status: 'CHỜ XÁC NHẬN',
        paymentStatus: 'ĐÃ THANH TOÁN'
      }
    });
    return { success: true };
  } catch (error) {
    console.error('Lỗi cập nhật profile:', error);
    return { success: false, message: 'Đã xảy ra lỗi' };
  }
}

export async function verifyPatientForFamily(cccd: string, dob: string, name: string) {
  try {
    const cookieStore = await cookies();
    const userIdStr = cookieStore.get('user_id')?.value;
    if (!userIdStr) return { success: false, message: 'Chưa đăng nhập' };
    const userId = parseInt(userIdStr);

    // Chuẩn hóa input
    const cleanCccd = cccd.trim();
    const cleanName = name.trim().toLowerCase();
    
    // Tìm kiếm trong hệ thống
    const patientProfiles = await prisma.patientProfile.findMany({
      where: {
        cccd: cleanCccd,
      },
      include: { user: true }
    });

    if (!patientProfiles || patientProfiles.length === 0) {
      return { success: false, message: 'Không tìm thấy hồ sơ bệnh nhân với CCCD này!' };
    }

    // Lọc theo tên và ngày sinh
    let matchedProfile = null;
    for (const p of patientProfiles) {
      const pName = (p.user.fullName || '').trim().toLowerCase();
      // Chuyển đổi dob trong db và dob nhập vào về cùng format để so sánh
      const dbDob = p.user.dob || '';
      
      const isNameMatch = pName === cleanName || pName.includes(cleanName) || cleanName.includes(pName);
      
      // Xử lý dob nhập vào có thể là dd/MM/yyyy hoặc yyyy-MM-dd
      let inputDobFormatted = dob.trim();
      if (inputDobFormatted.includes('/')) {
        const parts = inputDobFormatted.split('/');
        if (parts.length === 3) {
          // dd/MM/yyyy -> yyyy-MM-dd
          inputDobFormatted = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
        }
      }
      
      let dbDobFormatted = dbDob;
      if (dbDobFormatted.includes('/')) {
        const parts = dbDobFormatted.split('/');
        if (parts.length === 3) {
          dbDobFormatted = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
        }
      }

      const isDobMatch = inputDobFormatted === dbDobFormatted || inputDobFormatted === dbDob || dob.trim() === dbDob;

      if (isNameMatch && isDobMatch) {
        matchedProfile = p;
        break;
      }
    }

    if (!matchedProfile) {
      return { success: false, message: 'CCCD đúng nhưng Họ tên hoặc Ngày sinh không khớp với hệ thống!' };
    }

    if (matchedProfile.userId === userId) {
      return { success: false, message: 'Không thể thêm chính bạn làm người thân!' };
    }

    // Kiểm tra liên kết
    const existingLink = await prisma.familyMember.findFirst({
      where: { userId: userId, patientId: matchedProfile.userId }
    });

    if (existingLink) {
      return { success: false, message: 'Người thân này đã có trong danh sách của bạn!' };
    }

    return { 
      success: true, 
      patient: {
        id: matchedProfile.userId,
        name: matchedProfile.user.fullName,
        phone: matchedProfile.user.phone || '',
        dob: matchedProfile.user.dob || dob, // Trả về dob mà họ nhập (hoặc db) để hiển thị
        address: matchedProfile.user.address || '',
        cccd: matchedProfile.cccd || '',
        patientCode: matchedProfile.patientCode || ''
      } 
    };

  } catch (error) {
    console.error('Lỗi tìm kiếm bệnh nhân:', error);
    return { success: false, message: 'Lỗi máy chủ khi tra cứu' };
  }
}

export async function searchAndLinkPatient(cccd: string, dob: string, relationship: string) {
  try {
    const cookieStore = await cookies();
    const userIdStr = cookieStore.get('user_id')?.value;
    if (!userIdStr) return { success: false, message: 'Chưa đăng nhập' };
    const userId = parseInt(userIdStr);

    // Xử lý dob nhập vào có thể là dd/MM/yyyy hoặc yyyy-MM-dd
    let inputDobFormatted = dob.trim();
    if (inputDobFormatted.includes('/')) {
      const parts = inputDobFormatted.split('/');
      if (parts.length === 3) {
        inputDobFormatted = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
      }
    }

    // Tìm kiếm trong hệ thống
    const patientProfiles = await prisma.patientProfile.findMany({
      where: {
        cccd: cccd.trim(),
      },
      include: { user: true }
    });

    if (!patientProfiles || patientProfiles.length === 0) {
      return { success: false, message: 'Không tìm thấy hồ sơ bệnh nhân trên hệ thống!' };
    }

    // Lọc theo ngày sinh
    let patientProfile = null;
    for (const p of patientProfiles) {
      const dbDob = p.user.dob || '';
      
      let dbDobFormatted = dbDob;
      if (dbDobFormatted.includes('/')) {
        const parts = dbDobFormatted.split('/');
        if (parts.length === 3) {
          dbDobFormatted = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
        }
      }

      const isDobMatch = inputDobFormatted === dbDobFormatted || inputDobFormatted === dbDob || dob.trim() === dbDob;

      if (isDobMatch) {
        patientProfile = p;
        break;
      }
    }

    if (!patientProfile) {
      return { success: false, message: 'Không tìm thấy hồ sơ bệnh nhân trên hệ thống!' };
    }

    if (patientProfile.userId === userId) {
      return { success: false, message: 'Không thể thêm chính bạn làm người thân!' };
    }

    // Kiểm tra liên kết
    const existingLink = await prisma.familyMember.findFirst({
      where: { userId: userId, patientId: patientProfile.userId }
    });

    if (existingLink) {
      return { success: false, message: 'Người thân này đã có trong danh sách của bạn!' };
    }

    // Tạo liên kết
    await prisma.familyMember.create({
      data: {
        userId: userId,
        patientId: patientProfile.userId,
        relationship: relationship
      }
    });

    return { 
      success: true, 
      patient: {
        id: patientProfile.userId,
        name: patientProfile.user.fullName,
        phone: patientProfile.user.phone || '',
        dob: patientProfile.user.dob || '',
        address: patientProfile.user.address || '',
        cccd: patientProfile.cccd || '',
        patientCode: patientProfile.patientCode || '',
        relationship: relationship
      } 
    };

  } catch (error) {
    console.error('Lỗi tìm kiếm bệnh nhân:', error);
    return { success: false, message: 'Lỗi máy chủ khi tra cứu' };
  }
}

export async function checkPayment(code: string) {
  try {
    if (!code) return { paid: false };

    const appointments = await prisma.appointment.findMany({
      where: {
        reason: { contains: code }
      },
      select: { paymentStatus: true }
    });

    if (appointments.length > 0 && appointments.every(a => a.paymentStatus === 'ĐÃ THANH TOÁN')) {
      return { paid: true };
    }
    return { paid: false };
  } catch (error) {
    console.error('Lỗi check payment:', error);
    return { paid: false };
  }
}