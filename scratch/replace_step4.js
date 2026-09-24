const fs = require('fs');
const file = 'e:/WebPhongKham/MediCareClinic/app/patient/appointments/page.tsx';
let content = fs.readFileSync(file, 'utf8');
const lines = content.split('\n');

const importLine = `import Step4Confirm from './components/Step4Confirm';`;
if (!content.includes(importLine)) {
  const importIndex = lines.findIndex(l => l.includes('import Step3DateTime'));
  lines.splice(importIndex + 1, 0, importLine);
}

const startIndex = lines.findIndex(l => l.includes('{/* STEP 4: XÁC NHẬN */}'));
const endIndex = lines.findIndex(l => l.includes('{/* STEP 5: THANH TOÁN */}'));

if (startIndex !== -1 && endIndex !== -1) {
  const newCode = `              {/* STEP 4: XÁC NHẬN */}
              {step === 4 && (
                <Step4Confirm
                  setStep={setStep}
                  patients={patients}
                  setPatients={setPatients}
                  activePatientId={activePatientId}
                  bookingData={bookingData}
                  bookingMethod={bookingMethod}
                  isSubmitting={isSubmitting}
                />
              )}`;
  const before = lines.slice(0, startIndex);
  const after = lines.slice(endIndex);
  fs.writeFileSync(file, before.join('\n') + '\n' + newCode + '\n' + after.join('\n'));
  console.log('Successfully replaced step 4');
} else {
  console.log('Could not find start or end index', startIndex, endIndex);
}
