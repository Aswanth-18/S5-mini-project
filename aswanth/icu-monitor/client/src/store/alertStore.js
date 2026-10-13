import { create } from 'zustand';
import { getAlerts, ackAlert, resolveAlert } from '../services/alertApi';
import { getSocket } from '../services/socket';
import { notifyUser, playAlertSound } from '../services/notifications';

export const useAlertStore = create((set, get) => ({
  alerts: [],

  fetchAlerts: async (params) => {
    try {
      const alerts = await getAlerts(params);
      set({ alerts });
    } catch {
      set({ alerts: [] });
    }
  },

  ackAlert: async (id) => {
    try {
      const updated = await ackAlert(id);
      set({ alerts: get().alerts.map((a) => (a._id === id ? updated : a)) });
      return updated;
    } catch {
      return null;
    }
  },

  resolveAlert: async (id) => {
    try {
      const updated = await resolveAlert(id);
      set({ alerts: get().alerts.map((a) => (a._id === id ? updated : a)) });
      return updated;
    } catch {
      return null;
    }
  },

  subscribe: () => {
    const s = getSocket();
    const onNew = (alert) => {
      set({ alerts: [alert, ...get().alerts].slice(0, 200) });
      const priority = alert.priority || 'medium';
      playAlertSound(priority, true);
      notifyUser({
        title: `${priority.toUpperCase()} alert`,
        body: alert.message || 'A patient alert requires attention',
        tag: 'icu-alert'
      });
    };

    const onUpdated = (alert) =>
      set({ alerts: get().alerts.map((a) => (a._id === alert._id ? alert : a)) });

    const onEscalated = (alert) => {
      const escalatedAlert = { ...alert, escalated: true };
      set({ alerts: [escalatedAlert, ...get().alerts.filter((a) => a._id !== alert._id)].slice(0, 200) });
      playAlertSound(alert.priority || 'critical', true);
      notifyUser({
        title: 'Escalated ICU alert',
        body: alert.message || 'An alert has escalated and needs immediate review',
        tag: 'icu-escalation'
      });
    };

    s.on('alert:new', onNew);
    s.on('alert:updated', onUpdated);
    s.on('alert:escalated', onEscalated);
    return () => { s.off('alert:new', onNew); s.off('alert:updated', onUpdated); s.off('alert:escalated', onEscalated); };
  }
}));