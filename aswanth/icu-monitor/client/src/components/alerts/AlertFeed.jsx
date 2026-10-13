import { useEffect } from 'react';
import AlertCard from './AlertCard';
import Loader from '../common/Loader';
import EmptyState from '../common/EmptyState';
import { useAlertStore } from '../../store/alertStore';
import { useAuthStore } from '../../store/authStore';

export default function AlertFeed({ params, limit = 50 }) {
  const { alerts, unread, fetchAlerts, ackAlert, resolveAlert } = useAlertStore();
  const user = useAuthStore((s) => s.user);

  useEffect(() => { fetchAlerts(params); }, [JSON.stringify(params)]);

  if (!alerts.length && !fetchAlerts) return <Loader />;
  if (!alerts.length) return <EmptyState icon="🔔" title="No alerts" subtitle="All clear for now." />;

  return (
    <div className="space-y-3">
      {alerts.slice(0, limit).map((a) => (
        <AlertCard key={a._id} alert={a} userRole={user?.role}
          onAck={ackAlert} onResolve={resolveAlert} />
      ))}
    </div>
  );
}