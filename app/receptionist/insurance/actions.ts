'use server';

import prisma from '@/lib/prisma';

export async function searchPatientInsurance(query: string) {
  try {
    if (!query) {
      return { success: false, message: 'Vui lòng nhập từ khóa tìm kiếm' };
    }

    // Find patient by Phone, Patient Code, or BHYT Code
    const patients = await prisma.user.findMany({
      where: {
        role: 'PATIENT',
        OR: [
          { phone: { contains: query } },
          { patientProfile: { patientCode: { contains: query } } },
          { patientProfile: { bhyt: { contains: query } } },
        ]
      },
      include: {
        patientProfile: true,
        invoicesAsPatient: {
          where: {
            status: { in: ['Chờ thanh toán', 'CHƯA THANH TOÁN'] }
          },
          include: {
            items: true
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 1
        }
      },
      take: 1
    });

    if (patients.length === 0) {
      return { success: false, message: 'Không tìm thấy thông tin bệnh nhân hoặc thẻ BHYT phù hợp.' };
    }

    const patient = patients[0];
    const invoice = patient.invoicesAsPatient[0] || null;

    // Simulate expiry date and status for BHYT if bhyt exists
    // In a real app, this might come from an external BHYT portal API
    const hasBhyt = !!patient.patientProfile?.bhyt;
    const currentYear = new Date().getFullYear();
    const expiryDate = hasBhyt ? `31/12/${currentYear}` : null;
    const isBhytValid = hasBhyt; // Mock validation

    const data = {
      patient: {
        id: patient.id,
        name: patient.fullName,
        patientCode: patient.patientProfile?.patientCode || `BN${patient.id}`,
        phone: patient.phone || 'Chưa cập nhật',
        dob: patient.dob || 'Chưa cập nhật',
      },
      bhyt: hasBhyt ? {
        code: patient.patientProfile?.bhyt,
        expiryDate: expiryDate,
        isValid: isBhytValid,
      } : null,
      invoice: invoice ? {
        id: invoice.id,
        invoiceCode: invoice.invoiceCode,
        items: invoice.items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          total: item.total
        })),
        totalAmount: invoice.totalAmount,
        insuranceAmount: invoice.insuranceAmount,
        finalAmount: invoice.finalAmount
      } : null
    };

    return { success: true, data };
  } catch (error) {
    console.error('Error searching patient insurance:', error);
    return { success: false, message: 'Lỗi hệ thống khi tìm kiếm thông tin BHYT.' };
  }
}

export async function updateInsuranceInfo(patientId: number, bhytCode: string, invoiceId: number | undefined, discountAmount: number) {
  try {
    // Save BHYT info to patient profile
    await prisma.patientProfile.update({
      where: { userId: patientId },
      data: {
        bhyt: bhytCode
      }
    });

    // Update invoice with the newly calculated insurance discount
    if (invoiceId) {
      const invoice = await prisma.invoice.findUnique({ where: { id: invoiceId } });
      if (invoice) {
        const finalAmount = Math.max(0, invoice.totalAmount - discountAmount);
        await prisma.invoice.update({
          where: { id: invoiceId },
          data: {
            insuranceAmount: discountAmount,
            finalAmount: finalAmount
          }
        });
      }
    }

    return { success: true, message: 'Cập nhật thông tin BHYT và hóa đơn thành công' };
  } catch (error) {
    console.error('Error updating insurance info:', error);
    return { success: false, message: 'Lỗi hệ thống khi lưu thông tin BHYT.' };
  }
}
