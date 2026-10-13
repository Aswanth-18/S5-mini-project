import { create } from 'zustand';
import { getPatients, getPatient, dischargePatient } from '../services/patientApi';
import { getVitals } from '../services/vitalApi';

export const usePatientStore = create((set, get) => ({
  patients: [],
  current: null,
  vitals: [],
  loading: false,

  fetchPatients: async (params) => {
    set({ loading: true });
    const patients = await getPatients(params);
    set({ patients, loading: false });
  },

  fetchPatient: async (id) => {
    set({ loading: true });
    const [current, vitals] = await Promise.all([getPatient(id), getVitals(id, 100)]);
    set({ current, vitals, loading: false });
  },

  discharge: async (id) => {
    await dischargePatient(id);
    set({ patients: get().patients.map((p) => (p._id === id ? { ...p, status: 'discharged' } : p)) });
  },

  // live vitals from socket
  pushVital: (patientId, vital) => {
    if (get().current?._id === patientId) {
      set({ vitals: [...get().vitals, vital].slice(-100) });
    }
    set({
      patients: get().patients.map((p) => (p._id === patientId ? { ...p, latestVital: vital } : p))
    });
  },

  clear: () => set({ current: null, vitals: [] })
}));