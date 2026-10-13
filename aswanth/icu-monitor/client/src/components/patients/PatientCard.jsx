import { Link } from 'react-router-dom';
import Badge from '../common/Badge';
import MiniSparkline from '../charts/MiniSparkline';
import { timeAgo, riskColor } from '../../utils/formatters';

const statusColor = { stable: 'green', serious: 'yellow', critical: 'red', discharged: 'slate' };

export default function PatientCard({ patient }) {
  const v = patient.latestVital || patient.vitalsSnapshot || {};
  return (
    <Link
      to={`/doctor/patients/${patient._id}`}
      className={`block bg-slate-800 border rounded-xl p-4 hover:bg-slate-750 hover:border-blue-500/50 transition ${patient.status === 'critical' ? 'border-red-500/50 animate-pulse-shadow' : 'border-slate-700'}`}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold">{patient.name}</h3>
          <p className="text-xs text-slate-500">
            {patient.patientId} · Bed {patient.icuBed?.bedNumber || '—'} · {patient.age}y {patient.gender?.[0]?.toUpperCase()}
          </p>
        </div>
        <Badge color={statusColor[patient.status]}>{patient.status}</Badge>
      </div>

      <div className="grid grid-cols-4 gap-2 text-center text-sm mb-3">
        <div>
          <div className="text-red-400 font-bold">{v.heartRate ?? '—'}</div>
          <div className="text-[10px] text-slate-500">HR</div>
        </div>
        <div>
          <div className="text-sky-400 font-bold">{v.spo2 ?? '—'}</div>
          <div className="text-[10px] text-slate-500">SpO₂</div>
        </div>
        <div>
          <div className="text-violet-400 font-bold">{v.systolic ?? '—'}/{v.diastolic ?? '—'}</div>
          <div className="text-[10px] text-slate-500">BP</div>
        </div>
        <div>
          <div className="text-amber-400 font-bold">{v.temperature ?? '—'}</div>
          <div className="text-[10px] text-slate-500">°C</div>
        </div>
      </div>

      <div className={`text-xs border px-2 py-1 rounded ${riskColor(patient.riskLevel)}`}>
        Risk {patient.riskScore?.toFixed?.(1) ?? patient.riskScore}/10 · {patient.diagnosis || 'No diagnosis'}
      </div>
      {patient.aiUpdatedAt && <p className="text-[10px] text-slate-600 mt-2">AI updated {timeAgo(patient.aiUpdatedAt)}</p>}
    </Link>
  );
}