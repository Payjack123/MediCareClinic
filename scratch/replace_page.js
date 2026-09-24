const fs = require('fs');
const filePath = 'e:/WebPhongKham/MediCareClinic/app/patient/appointments/page.tsx';
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace('getBookedTimes, createAppointment', 'getBookedTimes, getDoctorSchedules, createAppointment');

content = content.replace('const [bookedTimes, setBookedTimes] = useState<string[]>([]);', 'const [bookedTimes, setBookedTimes] = useState<string[]>([]);\n  const [doctorSchedules, setDoctorSchedules] = useState<any[]>([]);');

content = content.replace('const fetchTimes = async () => {\n      if (bookingData.doctorId && bookingData.date) {\n        const fullDate = bookingData.date.split(\'-\').reverse().join(\'/\');\n        const res = await getBookedTimes(bookingData.doctorId, fullDate);\n        if (res.success) setBookedTimes(res.bookedTimes);\n      }\n    };\n    fetchTimes();\n  }, [bookingData.doctorId, bookingData.date]);', `const fetchTimes = async () => {
      if (bookingData.doctorId && bookingData.date) {
        const fullDate = bookingData.date.split('-').reverse().join('/');
        const res = await getBookedTimes(bookingData.doctorId, fullDate);
        if (res.success) setBookedTimes(res.bookedTimes);
      }
    };
    fetchTimes();
  }, [bookingData.doctorId, bookingData.date]);

  useEffect(() => {
    const fetchSchedules = async () => {
      if (bookingData.doctorId) {
        const res = await getDoctorSchedules(bookingData.doctorId);
        if (res.success) setDoctorSchedules(res.schedules);
        else setDoctorSchedules([]);
      } else {
        setDoctorSchedules([]);
      }
    };
    fetchSchedules();
  }, [bookingData.doctorId]);`);

content = content.replace('bookedTimes={bookedTimes}\n          />', 'bookedTimes={bookedTimes}\n            doctorSchedules={doctorSchedules}\n          />');

fs.writeFileSync(filePath, content);
console.log('Replaced successfully');
