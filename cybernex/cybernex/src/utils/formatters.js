/**
 * CyberNex - Formatting Utilities
 *
 * Pure, dependency-free formatting helpers used across pages and
 * components (dates, durations, numbers, names, file sizes, etc).
 */

// ===== DATE & TIME =====

export const formatDate = (date, options = {}) => {
  if (!date) return '—';
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  });
};

export const formatDateTime = (date) => {
  if (!date) return '—';
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

export const formatTime = (date) => {
  if (!date) return '—';
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
};

export const formatRelativeTime = (date) => {
  if (!date) return '—';
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return '—';

  const diffMs = d.getTime() - Date.now();
  const diffSec = Math.round(diffMs / 1000);
  const abs = Math.abs(diffSec);

  const units = [
    ['year', 31536000],
    ['month', 2592000],
    ['week', 604800],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
    ['second', 1],
  ];

  if (abs < 5) return 'just now';

  for (const [unit, secondsInUnit] of units) {
    if (abs >= secondsInUnit || unit === 'second') {
      const value = Math.round(diffSec / secondsInUnit);
      const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
      return rtf.format(value, unit);
    }
  }
  return 'just now';
};

export const formatDuration = (totalSeconds) => {
  const seconds = Math.max(0, Math.floor(Number(totalSeconds) || 0));
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  const mm = String(m).padStart(2, '0');
  const ss = String(s).padStart(2, '0');

  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
};

export const formatMinutes = (totalMinutes) => {
  const minutes = Math.max(0, Math.round(Number(totalMinutes) || 0));
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
};

// ===== NUMBERS =====

export const formatNumber = (value) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return '0';
  return Number(value).toLocaleString('en-US');
};

export const formatPercent = (value, { alreadyPercent = false, decimals = 0 } = {}) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return '0%';
  const pct = alreadyPercent ? Number(value) : Number(value) * 100;
  return `${pct.toFixed(decimals)}%`;
};

export const formatScore = (earned, total) => {
  const e = Number(earned) || 0;
  const t = Number(total) || 0;
  const pct = t > 0 ? Math.round((e / t) * 100) : 0;
  return `${e}/${t} (${pct}%)`;
};

export const formatFileSize = (bytes) => {
  const value = Number(bytes) || 0;
  if (value === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(value) / Math.log(1024));
  const size = value / Math.pow(1024, i);
  return `${size.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
};

// ===== TEXT =====

export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  const str = String(text);
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength).trimEnd()}…`;
};

export const capitalize = (text) => {
  if (!text) return '';
  const str = String(text);
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const formatLabel = (text) => {
  if (!text) return '';
  return String(text)
    .replace(/[_-]+/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const formatFullName = (user) => {
  if (!user) return 'Unknown User';
  if (user.name) return user.name;
  const first = user.firstName || '';
  const last = user.lastName || '';
  const full = `${first} ${last}`.trim();
  return full || user.email || 'Unknown User';
};

export const formatInitials = (name) => {
  if (!name) return '?';
  const parts = String(name).trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const formatCount = (count, singular, plural = `${singular}s`) => {
  const n = Number(count) || 0;
  return `${formatNumber(n)} ${n === 1 ? singular : plural}`;
};

// ===== IDs / CODES =====

export const formatId = (id) => (id ? String(id).trim().toUpperCase() : '');

export const maskEmail = (email) => {
  if (!email || !email.includes('@')) return email || '';
  const [local, domain] = email.split('@');
  const visible = local.slice(0, 2);
  return `${visible}${'*'.repeat(Math.max(local.length - 2, 2))}@${domain}`;
};

export default {
  formatDate, formatDateTime, formatTime, formatRelativeTime, formatDuration,
  formatMinutes, formatNumber, formatPercent, formatScore, formatFileSize,
  truncateText, capitalize, formatLabel, formatFullName, formatInitials,
  formatCount, formatId, maskEmail,
};