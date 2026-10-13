import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useAlertStore } from '../../store/alertStore';
import { getNotificationSettings, requestNotificationPermission, setNotificationSettings } from '../../services/notifications';

export default function Topbar({ onLogout }) {
  const { user } = useAuthStore();
  const alerts = useAlertStore((s) => s.alerts);
  const [prefs, setPrefs] = useState(getNotificationSettings());
  const unread = alerts.filter((a) => a.status === 'active').length;
  const alertPath = user?.role === 'nurse' ? '/nurse/alerts' : user?.role === 'doctor' ? '/doctor/alerts' : '/admin/alerts';

  const updatePreference = async (patch) => {
    const next = { ...prefs, ...patch };
    setPrefs(next);
    setNotificationSettings(next);

    if (patch.browser) {
      await requestNotificationPermission();
    }
  };

  return (
    <header className="h-14 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-6 shrink-0">
      <div className="text-sm text-slate-400">
        {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/60 px-2 py-1 text-xs text-slate-300">
          <button
            type="button"
            onClick={() => updatePreference({ sound: !prefs.sound })}
            className={`rounded-full px-2 py-1 ${prefs.sound ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'}`}
            title="Toggle alert sound"
          >
            {prefs.sound ? '🔊' : '🔇'}
          </button>
          <button
            type="button"
            onClick={() => updatePreference({ browser: !prefs.browser })}
            className={`rounded-full px-2 py-1 ${prefs.browser ? 'bg-sky-500/20 text-sky-300' : 'bg-slate-800 text-slate-400'}`}
            title="Toggle browser notifications"
          >
            {prefs.browser ? '🔔' : '🔕'}
          </button>
        </div>

        <Link to={alertPath} className="relative text-xl" title="Active alerts">
          🚨
          {unread > 0 && (
            <span className="absolute -top-1 -right-2 bg-red-600 text-white text-[10px] rounded-full min-w-5 h-5 px-1 flex items-center justify-center font-bold">
              {unread > 99 ? '99+' : unread}
            </span>
          )}
        </Link>
        <button onClick={onLogout} className="text-sm text-slate-300 hover:text-red-400 transition">Logout</button>
      </div>
    </header>
  );
}