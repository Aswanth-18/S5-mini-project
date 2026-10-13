// BedCard.jsx
import Badge from '../common/Badge';

export default function BedCard({ bed }) {
  const p = bed.currentPatient;
  const tone = !p ? 'border-slate-700'
    : p.status === 'critical' ? 'border-red-500/60 bg-red-500/5'
    : p.status === 'serious' ? 'border-yellow-500/50 bg-yellow-500/5'
    : 'border-green-500/40 bg-green-500/5';

  return (
    <div className={`bg-slate-800 border rounded-xl p-4 ${tone}`}>
      <div className="flex justify-between items-center mb-1">
        <span className="font-semibold text-sm">{bed.bedNumber}</span>
        {p ? <Badge color={p.status === 'critical' ? 'red' : p.status === 'serious' ? 'yellow' : 'green'}>{p.status}</Badge>
            : <Badge>free</Badge>}
      </div>
      {p ? (
        <>
          <p className="text-sm truncate">{p.name}</p>
          <p className="text-xs text-slate-500">{p.patientId}{p.riskLevel ? ` · ${p.riskLevel} risk` : ''}</p>
        </>
      ) : <p className="text-xs text-slate-600">Available</p>}
    </div>
  );
}