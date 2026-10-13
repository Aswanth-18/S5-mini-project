import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const linksFor = (role) => ({
  admin: [
    { to: '/admin', label: 'Dashboard', icon: '📊', end: true },
    { to: '/admin/users', label: 'Users', icon: '👥' },
    { to: '/admin/beds', label: 'Beds', icon: '🛏️' },
    { to: '/admin/alerts', label: 'Alert Stats', icon: '🚨' },
    { to: '/admin/audit', label: 'Audit Logs', icon: '📋' }
  ],
  doctor: [
    { to: '/doctor', label: 'Dashboard', icon: '📊', end: true },
    { to: '/doctor/patients', label: 'Patients', icon: '🧑‍⚕️' },
    { to: '/doctor/alerts', label: 'Alerts', icon: '🚨' }
  ],
  nurse: [
    { to: '/nurse', label: 'Dashboard', icon: '📊', end: true },
    { to: '/nurse/my-beds', label: 'My Beds', icon: '🛏️' },
    { to: '/nurse/vitals', label: 'Enter Vitals', icon: '❤️' },
    { to: '/nurse/alerts', label: 'Alerts', icon: '🚨' },
    { to: '/nurse/handover', label: 'Handover', icon: '🔄' }
  ]
}[role] || []);

export default function Sidebar() {
  const { user } = useAuthStore();
  return (
    <aside className="w-60 bg-slate-800 border-r border-slate-700 flex flex-col shrink-0">
      <div className="p-5 border-b border-slate-700">
        <div className="text-2xl font-bold">🫀 <span className="text-blue-400">ICU</span></div>
        <p className="text-xs text-slate-500 mt-0.5">AI Patient Monitoring</p>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {linksFor(user?.role).map((l) => (
          <NavLink key={l.to} to={l.to} end={l.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}>
            <span>{l.icon}</span> {l.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-700 text-xs text-slate-500">
        <span className="text-slate-300 font-medium">{user?.name}</span>
        <div className="capitalize text-blue-400">{user?.role}</div>
      </div>
    </aside>
  );
}