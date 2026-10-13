/* Run: npm run seed  (from server folder) */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Patient = require('../models/Patient');
const Bed = require('../models/Bed');
const Vital = require('../models/Vital');
const Alert = require('../models/Alert');
const Threshold = require('../models/Threshold');

const rand = (min, max) => min + Math.random() * (max - min);

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('🌱 Seeding...');

  // Wipe existing demo data
  await Promise.all([User, Patient, Bed, Vital, Alert, Threshold].map(M => M.deleteMany()));

  // --- Users ---
  const [admin, drRavi, drPriya, nurseAnu, nurseKumar] = await User.create([
    { name: 'Admin Mathan', email: 'admin@icu.local', password: 'admin123', role: 'admin' },
    { name: 'Dr. Ravi Kumar', email: 'ravi@icu.local', password: 'doctor123', role: 'doctor', specialization: 'Critical Care' },
    { name: 'Dr. Priya Nair', email: 'priya@icu.local', password: 'doctor123', role: 'doctor', specialization: 'Cardiology' },
    { name: 'Nurse Anitha', email: 'anu@icu.local', password: 'nurse123', role: 'nurse' },
    { name: 'Nurse Kumar', email: 'kumar@icu.local', password: 'nurse123', role: 'nurse' }
  ]);

  // --- Beds ---
  const beds = await Bed.create(
    Array.from({ length: 10 }, (_, i) => ({ bedNumber: `ICU-${String(i + 1).padStart(2, '0')}` }))
  );

  // --- Patients (variety of statuses = variety of vitals) ---
  const patientsData = [
    { name: 'Ramesh Iyer', age: 67, gender: 'male', diagnosis: 'Sepsis, AKI', history: 'Diabetic, CKD stage 3', status: 'critical', doctor: drRavi, nurses: [nurseAnu] },
    { name: 'Lakshmi Menon', age: 54, gender: 'female', diagnosis: 'Post-cardiac surgery', history: 'Hypertension', status: 'critical', doctor: drPriya, nurses: [nurseAnu] },
    { name: 'Suresh Babu', age: 45, gender: 'male', diagnosis: 'Severe pneumonia', history: 'Smoker', status: 'serious', doctor: drRavi, nurses: [nurseKumar] },
    { name: 'Fathima Beevi', age: 72, gender: 'female', diagnosis: 'COPD exacerbation', history: 'COPD, ex-smoker', status: 'serious', doctor: drPriya, nurses: [nurseKumar] },
    { name: 'Arun Prasad', age: 30, gender: 'male', diagnosis: 'Dengue fever', history: 'None', status: 'stable', doctor: drRavi, nurses: [nurseAnu] },
    { name: 'Divya Raman', age: 28, gender: 'female', diagnosis: 'Post-appendectomy', history: 'None', status: 'stable', doctor: drPriya, nurses: [nurseAnu] },
    { name: 'Mohan Das', age: 61, gender: 'male', diagnosis: 'Stroke, ICU observation', history: 'Atrial fibrillation', status: 'serious', doctor: drRavi, nurses: [nurseKumar] },
    { name: 'Geetha Krishnan', age: 49, gender: 'female', diagnosis: 'Ketoacidosis', history: 'Type 1 diabetes', status: 'stable', doctor: drPriya, nurses: [nurseKumar] }
  ];

  const patients = [];
  for (let i = 0; i < patientsData.length; i++) {
    const d = patientsData[i];
    const bed = beds[i];
    const p = await Patient.create({
      patientId: `P${1001 + i}`, name: d.name, age: d.age, gender: d.gender,
      diagnosis: d.diagnosis, medicalHistory: d.history,
      icuBed: bed._id, assignedDoctor: d.doctor._id, assignedNurses: d.nurses.map(n => n._id),
      status: d.status,
      riskLevel: d.status === 'critical' ? 'high' : d.status === 'serious' ? 'medium' : 'low',
      riskScore: d.status === 'critical' ? rand(7.5, 9.5) : d.status === 'serious' ? rand(4, 6.5) : rand(1, 3)
    });
    bed.isOccupied = true;
    bed.currentPatient = p._id;
    await bed.save();
    patients.push(p);
  }

  // --- 24h of vitals history (every 15 min = 96 readings per patient) ---
  console.log('📈 Generating 24h vitals history (this takes a few seconds)...');
  const now = Date.now();
  let vitalDocs = [];

  for (const p of patients) {
    const base = p.status === 'critical'
      ? { hr: 122, spo2: 88, sys: 160, dia: 95, temp: 38.8, rr: 26 }
      : p.status === 'serious'
      ? { hr: 98, spo2: 93, sys: 135, dia: 85, temp: 38.0, rr: 21 }
      : { hr: 80, spo2: 97, sys: 118, dia: 76, temp: 36.8, rr: 16 };

    // slight worsening trend for critical/serious patients (great for AI summaries)
    for (let i = 0; i < 96; i++) {
      const age = (now - (96 - i) * 15 * 60 * 1000); // 24h ago → now
      const progress = i / 96;
      const drift = p.status === 'stable' ? 0 : progress; // gets worse over time
      vitalDocs.push({
        patient: p._id, source: 'device', timestamp: new Date(age),
        heartRate: Math.round(base.hr + drift * 14 + rand(-4, 4)),
        systolic: Math.round(base.sys + drift * 10 + rand(-5, 5)),
        diastolic: Math.round(base.dia + drift * 6 + rand(-3, 3)),
        spo2: Math.round(base.spo2 - drift * 4 + rand(-1.5, 1.5)),
        temperature: +(base.temp + drift * 0.6 + rand(-0.2, 0.2)).toFixed(1),
        respiratoryRate: Math.round(base.rr + drift * 4 + rand(-1, 1))
      });
    }
  }

  await Vital.insertMany(vitalDocs);
  console.log(`✅ ${vitalDocs.length} vital readings created`);

  // --- Global threshold config ---
  await Threshold.create({ scope: 'global' });

  console.log('\n🎉 SEED COMPLETE! Login accounts:');
  console.log('────────────────────────────────────────');
  console.log('Admin  → admin@icu.local  / admin123');
  console.log('Doctor → ravi@icu.local   / doctor123');
  console.log('Doctor → priya@icu.local  / doctor123');
  console.log('Nurse  → anu@icu.local    / nurse123');
  console.log('Nurse  → kumar@icu.local  / nurse123');
  console.log('────────────────────────────────────────');
  await mongoose.disconnect();
  process.exit(0);
};

seed().catch(e => { console.error('Seed failed:', e.message); process.exit(1); });