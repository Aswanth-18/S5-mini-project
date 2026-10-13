import { io } from 'socket.io-client';

let socket = null;

export const getSocket = () => {
  if (!socket) socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', { autoConnect: false });
  return socket;
};

export const connectSocket = () => {
  const { token, user } = JSON.parse(localStorage.getItem('auth_snapshot') || '{"token":null,"user":null}');
  const s = getSocket();
  if (!s.connected) {
    s.connect();
    s.on('connect', () => s.emit('join', { token, role: user?.role }));
  }
  return s;
};

export const disconnectSocket = () => { if (socket) socket.disconnect(); };