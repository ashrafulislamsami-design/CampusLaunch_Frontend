export const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');

// For Socket.io/Canvas logic (Stripping /api for the base origin)
export const SOCKET_URL = API_BASE_URL.replace(/\/api\/?$/, '');

