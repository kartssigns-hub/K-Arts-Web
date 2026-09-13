/**
 * Backend (Express + Socket.IO on Render) connection details.
 *
 * Set VITE_API_URL to point at a local server during development; builds without
 * it talk to the deployed Render service.
 */
export const API_URL: string = (
  import.meta.env.VITE_API_URL || 'https://k-artz-server.onrender.com'
).replace(/\/+$/, '');

const ADMIN_TOKEN_KEY = 'adminToken';
const ADMIN_EMAIL_KEY = 'adminEmail';

export const getAdminToken = (): string | null => localStorage.getItem(ADMIN_TOKEN_KEY);

export const clearAdminSession = (): void => {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
  localStorage.removeItem(ADMIN_EMAIL_KEY);
};

/** The admin token is missing, expired, or was revoked by a password change. */
export class AdminAuthError extends Error {}

/**
 * fetch() for admin-only endpoints: attaches the admin bearer token and turns a
 * 401 into AdminAuthError so callers can send the admin back to the login page.
 */
export const adminFetch = async (path: string, init: RequestInit = {}): Promise<Response> => {
  const headers = new Headers(init.headers);
  const token = getAdminToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const res = await fetch(`${API_URL}${path}`, { ...init, headers });
  if (res.status === 401) throw new AdminAuthError('Session expired. Please login again.');
  return res;
};
