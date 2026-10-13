import { timeAgo, priorityColor } from '../../utils/formatters';
import { canAckAlert, canResolveAlert } from '../../utils/permissions';
import toast from 'react-hot-toast';

export default function AlertCard({ alert, onAck, onResolve, userRole }) {
  const ack = async () => { try { await onAck(alert._id); toast.success('Acknowledged'); } catch { toast.error('Failed'); } };
  const res = async () => { try { await onResolve(alert._id); toast.success('Resolved'); } catch { toast.error('Failed'); } };

  return (
    <div className={`bg-slate-800 border rounded-xl p-4 ${alert.status === 'active' && alert.priority === 'critical' ? 'border-red-500/60' : 'border-slate-700'}`}>
      <div className="flex justify-between items-start gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${priorityColor(alert.priority)}`}>{alert.priority}</span>
            <span className="text-sm font-medium truncate">{alert.type}</span>
            {alert.escalated && <span className="text-[10px] text-red-400">⏫ ESCALATED</span>}
          </div>
          <p className="text-sm text-slate-300 mt-1">{alert.message}</p>
          <p className="text-xs text-slate-500 mt-1">
            {alert.patient?.name} ({alert.patient?.patientId}) · {timeAgo(alert.createdAt)} · {alert.source === 'ai' ? '🤖 AI' : '⚡ Threshold'}
          </p>
        </div>
        <div className="flex flex-col gap-2 shrink-0">
          {alert.status === 'active' && canAckAlert(userRole) && (
            <button onClick={ack} className="text-xs bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded-lg">Acknowledge</button>
          )}
          {alert.status === 'acknowledged' && canResolveAlert(userRole) && (
            <button onClick={res} className="text-xs bg-green-600 hover:bg-green-500 px-3 py-1.5 rounded-lg">Resolve</button>
          )}
          {alert.status === 'resolved' && <span className="text-xs text-green-400">✓ Resolved</span>}
        </div>
      </div>
    </div>
  );
}