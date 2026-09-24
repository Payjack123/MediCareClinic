const fs = require('fs');
const file = 'e:/WebPhongKham/MediCareClinic/app/patient/appointments/page.tsx';
let content = fs.readFileSync(file, 'utf8');
const lines = content.split('\n');

const startIndex = lines.findIndex(l => l.includes('{/* STEP 1: THÀNH VIÊN */}'));
const endIndex = lines.findIndex(l => l.includes('{/* STEP 3: LỊCH KHÁM */}'));

if (startIndex !== -1 && endIndex !== -1) {
  const newCode = `              {/* STEP 1: THÀNH VIÊN */}
              {step === 1 && (
                <Step1Patient
                  patients={patients}
                  setPatients={setPatients}
                  activePatientId={activePatientId}
                  setActivePatientId={setActivePatientId}
                  userData={userData}
                  setIsAddPatientModalOpen={setIsAddPatientModalOpen}
                  setStep={setStep}
                />
              )}

              {/* STEP 2: PHƯƠNG THỨC */}
              {step === 2 && (
                <Step2BookingMethod
                  setStep={setStep}
                  patients={patients}
                  activePatientId={activePatientId}
                  bookingData={bookingData}
                  setBookingData={setBookingData}
                  activeModal={activeModal}
                  setActiveModal={setActiveModal}
                  bookingMethod={bookingMethod}
                  setBookingMethod={setBookingMethod}
                  facilities={facilities}
                  specialties={specialties}
                  doctorsList={doctorsList}
                  clinics={clinics}
                  clinicSearchQuery={clinicSearchQuery}
                  setClinicSearchQuery={setClinicSearchQuery}
                  specialtySearchQuery={specialtySearchQuery}
                  setSpecialtySearchQuery={setSpecialtySearchQuery}
                  doctorSearchQuery={doctorSearchQuery}
                  setDoctorSearchQuery={setDoctorSearchQuery}
                  onNextStep={() => {
                    setPatients(patients.map(p => p.id === activePatientId ? {
                      ...p,
                      facility: bookingData.facility,
                      specialty: bookingData.specialty,
                      doctor: bookingData.doctor,
                      doctorId: bookingData.doctorId,
                      doctorPrice: bookingData.doctorPrice
                    } : p));
                    setStep(3);
                  }}
                />
              )}`;
  const before = lines.slice(0, startIndex);
  const after = lines.slice(endIndex);
  fs.writeFileSync(file, before.join('\n') + '\n' + newCode + '\n' + after.join('\n'));
  console.log('Successfully replaced step 1 & 2');
} else {
  console.log('Could not find start or end index', startIndex, endIndex);
}
