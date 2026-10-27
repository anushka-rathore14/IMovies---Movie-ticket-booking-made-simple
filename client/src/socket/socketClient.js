import { io } from 'socket.io-client';

let socket = null;

export const getSocket = () => {
  if (!socket) {
    const socketUrl = import.meta.env.VITE_SOCKET_URL || (
      import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : '/'
    );
    socket = io(socketUrl, {
      autoConnect: true,
      transports: ['websocket', 'polling'],
    });
  }
  return socket;
};
