import toast from 'react-hot-toast';
import { useAlertStore } from '../../store/alertStore';
import { canAckAlert } from '../../utils/permissions';

export default function AcknowledgeButton({ alert }) {
  const ack = useAlertStore((s) => s.ackAlert);
  const role = JSON.parse(localStorage.getItem('user') || '{}').role;
  if (alert.status !== 'active' || !canAckAlert(role)) return null;
  return (
    <button onClick={() => ack(alert._id).then(() => toast.success('Acknowledged')).catch(() => toast.error('Failed'))}
      className="text-xs bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded-lg">Acknowledge</button>
  );
}