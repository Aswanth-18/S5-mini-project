import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useAuthStore } from '../../store/authStore';
import { useAlertStore } from '../../store/alertStore';

export default function Layout() {
  const { user, logout } = useAuthStore();
  const { subscribe, fetchAlerts } = useAlertStore();
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = subscribe();
    fetchAlerts({ status: 'active' });
    const refresh = setInterval(() => fetchAlerts({}), 30000);
    return () => { unsub(); clearInterval(refresh); };
  }, []);

  return (
    <div className="min-h-screen flex bg-slate-900">
      <Toaster position="top-right" toastOptions={{ style: { background: '#1e293b', color: '#f1f5f9' } }} />
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onLogout={() => { logout(); navigate('/login'); }} />
        <main className="flex-1 p-6 overflow-auto"><Outlet /></main>
      </div>
    </div>
  );
}