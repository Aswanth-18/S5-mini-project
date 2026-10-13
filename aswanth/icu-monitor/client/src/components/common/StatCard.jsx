export default function StatCard({ icon, label, value, tone = 'blue', sub }) {
  const tones = {
    blue: 'from-blue-600/20 to-blue-600/5 text-blue-400',
    red: 'from-red-600/20 to-red-600/5 text-red-400',
    green: 'from-green-600/20 to-green-600/5 text-green-400',
    yellow: 'from-yellow-600/20 to-yellow-600/5 text-yellow-400'
  };
  return (
    <div className={`bg-gradient-to-br ${tones[tone]} border border-slate-700 rounded-xl p-5`}>
      <div className="flex items-center justify-between">
        <span className="text-2xl">{icon}</span>
        {sub && <span className="text-xs text-slate-500">{sub}</span>}
      </div>
      <div className="text-3xl font-bold mt-2">{value}</div>
      <div className="text-sm text-slate-400">{label}</div>
    </div>
  );
}