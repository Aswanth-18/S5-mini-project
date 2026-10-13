// components/patients/AdmitPatientModal.jsx
import { useEffect, useState } from 'react';
import Modal from '../common/Modal';
import PatientForm from './PatientForm';
import { getBeds } from '../../services/bedApi';
import { getUsers } from '../../services/userApi';

export default function AdmitPatientModal({ open, onClose, onAdmit }) {
  const [beds, setBeds] = useState([]);
  const [doctors, setDoctors] = useState([]);
  useEffect(() => {
    if (open) { getBeds().then(setBeds); getUsers().then((u) => setDoctors(u.filter((x) => x.role === 'doctor'))); }
  }, [open]);
  return (
    <Modal open={open} onClose={onClose} title="Admit Patient">
      <PatientForm beds={beds} doctors={doctors} onCancel={onClose} onSubmit={onAdmit} />
    </Modal>
  );
}