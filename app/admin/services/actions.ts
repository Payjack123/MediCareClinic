'use server';

import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { getDepartments } from '@/app/admin/departments/actions';

// Lấy danh sách toàn bộ dịch vụ
export async function getServices() {
  try {
    const cookieStore = await cookies();
    if (cookieStore.get('user_role')?.value !== 'admin') {
      return { success: false, message: 'Không có quyền truy cập' };
    }

    let setting = await prisma.systemSetting.findUnique({
      where: { key: 'services_data' }
    });

    if (!setting) {
      // Mock dữ liệu mặc định nếu chưa có
      const defaultData = [
        { id: 'DV001', name: 'Khám tổng quát', type: 'Khám bệnh', departmentId: 'NTQ001', departmentName: 'Nội tổng quát', price: 200000, hasBHYT: true, duration: '20 phút', status: 'Hoạt động', desc: 'Khám sức khỏe tổng quát' },
        { id: 'DV002', name: 'Xét nghiệm máu', type: 'Xét nghiệm', departmentId: 'NTQ001', departmentName: 'Nội tổng quát', price: 150000, hasBHYT: true, duration: '15 phút', status: 'Hoạt động', desc: 'Công thức máu cơ bản' },
        { id: 'DV003', name: 'Siêu âm', type: 'Chẩn đoán hình ảnh', departmentId: 'NKH001', departmentName: 'Ngoại khoa', price: 300000, hasBHYT: false, duration: '30 phút', status: 'Hoạt động', desc: 'Siêu âm ổ bụng' },
        { id: 'DV004', name: 'Nội soi dạ dày', type: 'Thủ thuật', departmentId: 'NTQ001', departmentName: 'Nội tổng quát', price: 500000, hasBHYT: false, duration: '45 phút', status: 'Tạm dừng', desc: 'Nội soi dạ dày gây mê' },
      ];
      setting = await prisma.systemSetting.create({
        data: {
          key: 'services_data',
          value: JSON.stringify(defaultData),
          description: 'Lưu trữ danh mục dịch vụ'
        }
      });
    }

    const services = JSON.parse(setting.value);
    return { success: true, data: services };
  } catch (error) {
    console.error("Lỗi lấy danh sách dịch vụ:", error);
    return { success: false, message: 'Lỗi máy chủ' };
  }
}

// Lưu 1 dịch vụ mới (hoặc cập nhật)
export async function saveService(data: any) {
  try {
    const cookieStore = await cookies();
    if (cookieStore.get('user_role')?.value !== 'admin') {
      return { success: false, message: 'Không có quyền truy cập' };
    }

    const setting = await prisma.systemSetting.findUnique({
      where: { key: 'services_data' }
    });
    
    let services = [];
    if (setting) {
      services = JSON.parse(setting.value);
    }

    // Lookup tên khoa từ departmentId
    let deptName = 'Chưa xác định';
    if (data.departmentId) {
      const deptsRes = await getDepartments();
      if (deptsRes.success) {
        const dept = deptsRes.data.find((d: any) => d.id === data.departmentId);
        if (dept) deptName = dept.name;
      }
    }

    const newService = {
      ...data,
      id: data.id || `DV${Date.now()}`,
      departmentName: deptName
    };

    services.push(newService);

    await prisma.systemSetting.upsert({
      where: { key: 'services_data' },
      update: { value: JSON.stringify(services) },
      create: { key: 'services_data', value: JSON.stringify(services), description: 'Danh mục dịch vụ' }
    });

    return { success: true, message: 'Lưu dịch vụ thành công!' };
  } catch (error) {
    console.error("Lỗi lưu dịch vụ:", error);
    return { success: false, message: 'Lỗi máy chủ' };
  }
}

// Lấy chi tiết 1 dịch vụ
export async function getServiceDetail(id: string) {
  try {
    const setting = await prisma.systemSetting.findUnique({
      where: { key: 'services_data' }
    });
    if (!setting) return { success: false, message: 'Không tìm thấy dịch vụ' };

    const services = JSON.parse(setting.value);
    const service = services.find((s: any) => s.id === id);
    
    if (!service) return { success: false, message: 'Không tìm thấy dịch vụ' };
    return { success: true, data: service };
  } catch (error) {
    return { success: false, message: 'Lỗi máy chủ' };
  }
}

// Cập nhật trạng thái
export async function updateServiceStatus(id: string, newStatus: string) {
  try {
    const setting = await prisma.systemSetting.findUnique({
      where: { key: 'services_data' }
    });
    if (!setting) return { success: false, message: 'Không tìm thấy dữ liệu' };

    let services = JSON.parse(setting.value);
    const index = services.findIndex((s: any) => s.id === id);
    if (index === -1) return { success: false, message: 'Không tìm thấy dịch vụ' };

    services[index].status = newStatus;

    await prisma.systemSetting.update({
      where: { key: 'services_data' },
      data: { value: JSON.stringify(services) }
    });

    return { success: true, message: `Đã chuyển trạng thái sang: ${newStatus}` };
  } catch (error) {
    console.error("Lỗi cập nhật dịch vụ:", error);
    return { success: false, message: 'Lỗi máy chủ' };
  }
}
