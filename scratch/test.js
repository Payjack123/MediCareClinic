const { PrismaClient } = require('../lib/generated/prisma');
const p = new PrismaClient();
p.user.findMany({where: {role: 'DOCTOR'}, include: {doctorProfile: {include: {clinics: true}}}}).then(d => { 
  console.log(d.map(x => ({id: x.id, name: x.fullName, clinics: x.doctorProfile?.clinics?.length}))); 
  p.$disconnect(); 
});
