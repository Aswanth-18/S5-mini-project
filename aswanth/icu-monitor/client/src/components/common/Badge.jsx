export function Badge({ children, color = 'slate', pulse }) {
  const colors = {
    slate: 'bg-slate-700 text-slate-300',
    red: 'bg-red-500/20 text-red-400',
    green: 'bg-green-500/20 text-green-400',
    yellow: 'bg-yellow-500/20 text-yellow-400',
    orange: 'bg-orange-500/20 text-orange-400',
    blue: 'bg-blue-500/20 text-blue-400'
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${colors[color]} ${pulse ? 'animate-pulse' : ''}`}>
      {children}
    </span>
  );
}

export default Badge;