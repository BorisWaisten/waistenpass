import type { AuthResponse, AuthUser } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000/api';
const ACCESS_TOKEN_KEY = 'easy-ticket.accessToken';
const REFRESH_TOKEN_KEY = 'easy-ticket.refreshToken';
const USER_KEY = 'easy-ticket.user';

interface ApiOptions extends RequestInit {
  json?: unknown;
}

async function parseResponse(response: Response) {
  if (response.status === 204) return null;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  return response.text();
}

export async function apiFetch<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { json, headers, ...rest } = options;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    body: json ? JSON.stringify(json) : rest.body
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    const message = (data as { message?: string })?.message ?? 'Ocurrió un error inesperado';
    throw new Error(message);
  }

  return data as T;
}

export function storeAuthTokens(tokens: { accessToken: string; refreshToken: string }) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
}

export function storeSession(auth: AuthResponse) {
  storeAuthTokens({ accessToken: auth.accessToken, refreshToken: auth.refreshToken });
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_KEY, JSON.stringify(auth.user));
}

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function clearSession() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export async function authFetch<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const token = getAccessToken();
  if (!token) {
    throw new Error('Debes iniciar sesión para realizar esta acción');
  }

  return apiFetch<T>(path, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.headers || {})
    }
  });
}
