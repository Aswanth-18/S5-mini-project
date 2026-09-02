import { cn } from '@/lib/cn'

export function CyberPulse({
  size = 120,
  progress = 62,
  intensity = 'calm',
  label = 'System pulse',
  className,
}) {
  const radius = 42
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (progress / 100) * circumference

  return (
    <figure
      className={cn('relative inline-flex items-center justify-center', className)}
      aria-label={label}
    >
      <svg width={size} height={size} viewBox="0 0 120 120" className="overflow-visible">
        <circle cx="60" cy="60" r="52" fill="none" stroke="var(--border)" strokeWidth="1" />
        <circle
          cx="60"
          cy="60"
          r="42"
          fill="none"
          stroke="var(--surface-raised)"
          strokeWidth="6"
        />
        <circle
          cx="60"
          cy="60"
          r="42"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="-rotate-90 origin-center"
        />
        <circle cx="60" cy="60" r="22" fill="var(--surface)" stroke="var(--border)" />
        <g className={intensity === 'calm' ? 'origin-center animate-[spin_28s_linear_infinite]' : ''}>
          <circle cx="60" cy="8" r="2.2" fill="var(--accent)" />
          <circle cx="104" cy="76" r="1.6" fill="var(--success)" />
          <circle cx="18" cy="70" r="1.4" fill="var(--text-muted)" />
        </g>
      </svg>
      <figcaption className="absolute type-technical text-secondary">{progress}%</figcaption>
    </figure>
  )
}
