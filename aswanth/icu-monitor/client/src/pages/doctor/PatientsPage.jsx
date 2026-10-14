// src/pages/doctor/PatientsPage.jsx
import { useEffect } from 'react';
import { usePatientStore } from '../../store/patientStore';
import PatientCard from '../../components/patients/PatientCard';
import Loader from '../../components/common/Loader';
export default function PatientsPage() {
  const patients = usePatientStore((s) => s.patients);
  const loading = usePatientStore((s) => s.loading);
  const fetchPatients = usePatientStore((s) => s.fetchPatients);
  useEffect(() => { fetchPatients(); }, [fetchPatients]);
  if (loading) return <Loader />;
  return (<div>
    <h1 className="text-2xl font-bold mb-4">My Patients ({patients.length})</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {patients.map((p) => <PatientCard key={p._id} patient={p} />)}
    </div>
  </div>);
}
