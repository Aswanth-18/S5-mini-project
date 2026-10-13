// components/patients/PatientForm.jsx
import { useState } from 'react';

export default function PatientForm({ beds = [], doctors = [], onSubmit, onCancel }) {
  const [form, setForm] = useState({ name: '', age: '', gender: 'male', diagnosis: '', medicalHistory: '', icuBed: '', assignedDoctor: '' });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit({ ...form, age: +form.age }); }} className="space-y-3">
      <input required value={form.name} onChange={set('name')} placeholder="Patient name"
        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-sm" />
      <div className="grid grid-cols-2 gap-3">
        <input required type="number" value={form.age} onChange={set('age')} placeholder="Age"
          className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-sm" />
        <select value={form.gender} onChange={set('gender')}
          className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-sm">
          {['male', 'female', 'other'].map((g) => <option key={g}>{g}</option>)}
        </select>
      </div>
      <input value={form.diagnosis} onChange={set('diagnosis')} placeholder="Diagnosis"
        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-sm" />
      <input value={form.medicalHistory} onChange={set('medicalHistory')} placeholder="Medical history"
        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-sm" />
      <select required value={form.icuBed} onChange={set('icuBed')}
        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-sm">
        <option value="">Select bed…</option>
        {beds.filter((b) => !b.isOccupied).map((b) => <option key={b._id} value={b._id}>{b.bedNumber}</option>)}
      </select>
      <select value={form.assignedDoctor} onChange={set('assignedDoctor')}
        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-sm">
        <option value="">Assign doctor…</option>
        {doctors.map((d) => <option key={d._id} value={d._id}>{d.name}</option>)}
      </select>
      <div className="flex gap-3">
        <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-500 rounded-lg py-2.5 font-semibold text-sm">Admit</button>
        <button type="button" onClick={onCancel} className="flex-1 bg-slate-700 hover:bg-slate-600 rounded-lg py-2.5 text-sm">Cancel</button>
      </div>
    </form>
  );
}