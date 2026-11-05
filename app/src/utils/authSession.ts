import type { AuthSession } from '../types/auth.ts';

const KEY = 'eco_auth_session';

/**
 * Mock session (client only). Backend thật sẽ dùng NextAuth JWT cookie httpOnly.
 * Không bao giờ lưu mật khẩu. `remember` = true → localStorage, ngược lại sessionStorage.
 */
export function saveSession(session: AuthSession, remember: boolean): void {
  if (typeof window === 'undefined') return;
  clearSession();
  const store = remember ? window.localStorage : window.sessionStorage;
  store.setItem(KEY, JSON.stringify(session));
}

export function loadSession(): AuthSession | null {
  if (typeof window === 'undefined') return null;
  const raw = window.sessionStorage.getItem(KEY) || window.localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    const s = JSON.parse(raw) as AuthSession;
    return s && s.schoolCode ? s : null;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  if (typeof window === 'undefined') return;
  window.sessionStorage.removeItem(KEY);
  window.localStorage.removeItem(KEY);
}
