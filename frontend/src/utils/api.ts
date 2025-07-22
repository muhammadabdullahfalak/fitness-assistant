import { getToken } from './token';

export const apiFetch = async (url: string, options: RequestInit = {}) => {
  const token = getToken();
  const headers = {
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    'Content-Type': 'application/json',
  };
  const res = await fetch(url, { ...options, headers });
  return res.json();
};