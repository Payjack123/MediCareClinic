"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getTestOrders() {
  try {
    const labTests = await prisma.labTest.findMany({
      orderBy: { date: "desc" },
      include: {
        patient: {
          select: { fullName: true, dob: true, gender: true, phone: true, avatar: true, patientProfile: true, address: true },
        },
      },
    });

    const formattedOrders = labTests.map((order) => {
      let notesData: any = { priority: "normal", reason: "", instructions: "" };
      try {
        if (order.notes) {
          notesData = JSON.parse(order.notes);
        }
      } catch (e) {
        notesData.reason = order.notes || "";
      }

      let formattedDob = order.patient?.dob || "";
      if (formattedDob && formattedDob.includes("-")) {
        const parts = formattedDob.split("-");
        if (parts.length === 3) formattedDob = `${parts[2]}/${parts[1]}/${parts[0]}`;
      }

      return {
        id: `XNCD-${order.id.toString().padStart(4, "0")}`,
        dbId: order.id,
        patientName: order.patient?.fullName || "Bệnh nhân ẩn",
        patientCode: order.patient?.patientProfile?.patientCode || "N/A",
        dob: formattedDob,
        gender: order.patient?.gender || "Khác",
        phone: order.patient?.phone || "Không có",
        avatar: order.patient?.avatar || null,
        cccd: order.patient?.patientProfile?.cccd || "Không có",
        address: order.patient?.address || "Chưa cập nhật",
        date: order.date.toLocaleString("vi-VN"),
        dateOnly: order.date.toLocaleDateString("vi-VN"),
        time: `${order.date.getHours().toString().padStart(2, '0')}:${order.date.getMinutes().toString().padStart(2, '0')}`,
        dateFilterStr: order.date.toISOString().split('T')[0],
        doctor: order.doctorName,
        tests: (order as any).testsDetail && Array.isArray((order as any).testsDetail) && (order as any).testsDetail.length > 0
          ? (order as any).testsDetail.map((t: any) => t.name)
          : (notesData.testsDetail && Array.isArray(notesData.testsDetail) && notesData.testsDetail.length > 0
              ? notesData.testsDetail.map((t: any) => t.name)
              : (order.testName ? order.testName.split(", ") : [])),
        priority: notesData.priority || "normal",
        reason: notesData.reason || "",
        instructions: notesData.instructions || "",
        status: order.statusType || "ordered",
      };
    });

    return { success: true, data: formattedOrders };
  } catch (error: any) {
    console.error("Lỗi lấy danh sách phiếu chỉ định:", error);
    return { success: false, message: error.message || "Lỗi máy chủ" };
  }
}

export async function searchPatients(query: string) {
  try {
    if (!query) return { success: true, data: null };

    const patient = await prisma.user.findFirst({
      where: {
        role: "PATIENT",
        patientProfile: { patientCode: query },
      },
      select: {
        id: true,
        fullName: true,
        phone: true,
        dob: true,
        patientProfile: true,
        gender: true,
        address: true,
        avatar: true,
      },
    });

    if (patient) {
      // Force exact case-sensitive match since Prisma/DB might be case-insensitive
      if (patient.patientProfile?.patientCode !== query) {
        return { success: true, data: null };
      }

      let formattedDob = patient.dob;
      if (formattedDob && formattedDob.includes("-")) {
        const parts = formattedDob.split("-");
        if (parts.length === 3) {
          formattedDob = `${parts[2]}/${parts[1]}/${parts[0]}`;
        }
      }
      return {
        success: true,
        data: {
          ...patient,
          dob: formattedDob,
          gender: patient.gender || "Khác",
          patientCode: patient.patientProfile?.patientCode || "",
          cccd: patient.patientProfile?.cccd || "N/A",
        },
      };
    }

    return { success: true, data: null };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function createTestOrder(data: {
  patientId: number;
  testNames: string[];
  tests: { name: string; price: number }[];
  totalPrice: number;
  doctorName: string;
  priority: string;
  reason: string;
  instructions: string;
  status: string;
}) {
  try {
    const testNamesLower = data.testNames.join(", ").toLowerCase();
    let indicesToCreate: any[] = [];
    
    if (testNamesLower.includes("công thức máu")) {
      indicesToCreate.push(
        { name: "WBC (Bạch cầu)", result: "6.8", min: "4.0", max: "10.0", unit: "G/L", status: "normal" },
        { name: "RBC (Hồng cầu)", result: "4.7", min: "4.2", max: "5.9", unit: "T/L", status: "normal" },
        { name: "HGB (Huyết sắc tố)", result: "14.2", min: "13.0", max: "17.5", unit: "g/dL", status: "normal" },
        { name: "PLT (Tiểu cầu)", result: "250", min: "150", max: "450", unit: "G/L", status: "normal" }
      );
    }
    if (testNamesLower.includes("đường huyết")) {
      indicesToCreate.push(
        { name: "GLU (Glucose máu)", result: "10.5", min: "4.0", max: "6.4", unit: "mmol/L", status: "abnormal" }
      );
    }
    if (testNamesLower.includes("hba1c")) {
      indicesToCreate.push(
        { name: "HbA1c", result: "7.2", min: "4.0", max: "6.0", unit: "%", status: "abnormal" }
      );
    }
    if (testNamesLower.includes("mỡ máu")) {
      indicesToCreate.push(
        { name: "CHOL (Cholesterol toàn phần)", result: "5.8", min: "0", max: "5.2", unit: "mmol/L", status: "abnormal" },
        { name: "TRIG (Triglyceride)", result: "2.1", min: "0", max: "1.7", unit: "mmol/L", status: "abnormal" },
        { name: "HDL-C", result: "1.1", min: "0.9", max: "2.0", unit: "mmol/L", status: "normal" },
        { name: "LDL-C", result: "3.5", min: "0", max: "3.4", unit: "mmol/L", status: "abnormal" }
      );
    }
    if (testNamesLower.includes("men gan")) {
      indicesToCreate.push(
        { name: "AST (SGOT)", result: "35", min: "0", max: "40", unit: "U/L", status: "normal" },
        { name: "ALT (SGPT)", result: "42", min: "0", max: "40", unit: "U/L", status: "abnormal" }
      );
    }
    if (testNamesLower.includes("ure") || testNamesLower.includes("creatinin")) {
      indicesToCreate.push(
        { name: "Ure máu", result: "5.2", min: "2.5", max: "7.5", unit: "mmol/L", status: "normal" },
        { name: "Creatinin", result: "85", min: "53", max: "106", unit: "µmol/L", status: "normal" }
      );
    }
    if (testNamesLower.includes("nước tiểu")) {
      indicesToCreate.push(
        { name: "PRO (Protein)", result: "Âm tính", min: "Âm tính", max: "", unit: "", status: "normal" },
        { name: "pH", result: "6.0", min: "4.8", max: "7.4", unit: "", status: "normal" },
        { name: "SG (Tỷ trọng)", result: "1.020", min: "1.015", max: "1.025", unit: "", status: "normal" }
      );
    }
    
    if (indicesToCreate.length === 0) {
      indicesToCreate.push({ name: "Chỉ số chung", result: "5.5", min: "4.0", max: "6.0", unit: "U", status: "normal" });
    }

    const notesJson = JSON.stringify({
      priority: data.priority,
      reason: data.reason,
      instructions: data.instructions,
      testsDetail: data.tests,
      totalPrice: data.totalPrice,
      indices: indicesToCreate,
    });

    const newLabTest = await prisma.labTest.create({
      data: {
        patientId: data.patientId,
        testName: data.testNames.join(", "),
        date: new Date(),
        doctorName: data.doctorName,
        result: "Chờ cập nhật", // Default result
        statusType: data.status,
        testsDetail: data.tests,
        notes: notesJson,
      }
    });

    revalidatePath("/doctor/test-orders");
    revalidatePath("/doctor/test-results");
    return { success: true, data: newLabTest };
  } catch (error: any) {
    console.error("Lỗi tạo phiếu chỉ định:", error);
    return { success: false, message: error.message || "Lỗi máy chủ" };
  }
}

export async function getPatientsList() {
  try {
    const patients = await prisma.user.findMany({
      where: { role: 'PATIENT' },
      orderBy: { createdAt: 'desc' },
      include: { patientProfile: true, 
        examinationsAsPatient: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });

    const formattedPatients = patients.map(p => {
      let lastVisit = null;
      let lastVisitReason = null;
      if (p.examinationsAsPatient && p.examinationsAsPatient.length > 0) {
        const exam = p.examinationsAsPatient[0] as any; // Cast to any to avoid type issues if diagnosis is missing
        lastVisit = exam.createdAt.toLocaleDateString("vi-VN");
        lastVisitReason = exam.diagnosis || exam.symptoms || "Khám chung";
      }

      // Format dob
      let formattedDob = p.dob || "";
      let dobDate = null;
      if (formattedDob && formattedDob.includes("-")) {
        const parts = formattedDob.split("-");
        if (parts.length === 3) {
          formattedDob = `${parts[2]}/${parts[1]}/${parts[0]}`;
          dobDate = new Date(`${parts[0]}-${parts[1]}-${parts[2]}`);
        }
      }

      return {
        id: p.id,
        fullName: p.fullName || "Chưa cập nhật",
        patientCode: p.patientProfile?.patientCode || "N/A",
        dob: formattedDob,
        dobRaw: dobDate,
        gender: p.gender === 'MALE' ? 'Nam' : p.gender === 'FEMALE' ? 'Nữ' : 'Khác',
        phone: p.phone || "Không có",
        lastVisit: lastVisit,
        lastVisitReason: lastVisitReason,
        avatar: p.avatar,
      };
    });

    return { success: true, data: formattedPatients };
  } catch (error: any) {
    return { success: false, message: error.message || "Lỗi máy chủ" };
  }
}
