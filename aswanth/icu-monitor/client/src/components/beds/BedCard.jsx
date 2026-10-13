import Badge from '../common/Badge';

export default function BedCard({ bed }) {
  const p = bed.currentPatient;
  const tone = !p
    ? 'border-slate-200 bg-slate-50'
    : p.status === 'critical'
      ? 'border-red-200 bg-red-50'
      : p.status === 'serious'
        ? 'border-amber-200 bg-amber-50'
        : 'border-emerald-200 bg-emerald-50';

  return (
    <div className={`rounded-2xl border p-4 ${tone}`}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-sm font-semibold text-slate-900">{bed.bedNumber}</span>
        {p ? (
          <Badge color={p.status === 'critical' ? 'red' : p.status === 'serious' ? 'yellow' : 'green'}>{p.status}</Badge>
        ) : (
          <Badge color="slate">Available</Badge>
        )}
      </div>

      {p ? (
        <>
          <p className="truncate text-sm font-medium text-slate-900">{p.name}</p>
          <p className="mt-1 text-xs text-slate-500">{p.patientId}{p.riskLevel ? ` · ${p.riskLevel} risk` : ''}</p>
        </>
      ) : (
        <p className="text-xs text-slate-500">No patient assigned</p>
      )}
    </div>
  );
}