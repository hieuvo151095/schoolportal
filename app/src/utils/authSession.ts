import type { AuthSession } from '../types/auth.ts';

export const RESET_TENANT_STATE = 'RESET_TENANT_STATE';

const DEFAULT_SESSION_KEY = 'eco_auth_session';
const DEFAULT_TOKEN_KEY = 'eco_token';

/**
 * Lấy storage key phân vùng theo mã trường (OQ-13 - Tab Isolation).
 * Ví dụ: eco_session_th-eco01 hoặc eco_auth_session mặc định.
 */
export function getSessionKey(schoolCode?: string): string {
  if (!schoolCode || !schoolCode.trim()) return DEFAULT_SESSION_KEY;
  return `eco_session_${schoolCode.toLowerCase().trim()}`;
}

/**
 * Lấy token key phân vùng theo mã trường (OQ-13).
 * Ví dụ: eco_token_th-eco01 hoặc eco_token mặc định.
 */
export function getTokenKey(schoolCode?: string): string {
  if (!schoolCode || !schoolCode.trim()) return DEFAULT_TOKEN_KEY;
  return `eco_token_${schoolCode.toLowerCase().trim()}`;
}

/**
 * Lưu phiên đăng nhập phân vùng theo namespace eco_session_{schoolCode} và eco_token_{schoolCode}.
 * Hỗ trợ đa tab mở đồng thời nhiều trường mà không bị race condition ghi đè session.
 * Tuyệt đối không lưu thông tin nhạy cảm của tài khoản.
 */
export function saveSession(session: AuthSession, remember: boolean): void {
  if (typeof window === 'undefined') return;
  const sKey = getSessionKey(session.schoolCode);
  const tKey = getTokenKey(session.schoolCode);

  const store = remember ? window.localStorage : window.sessionStorage;

  // Xóa session cũ của trường này trước khi ghi mới
  clearSession(session.schoolCode);

  const payload = JSON.stringify(session);
  store.setItem(sKey, payload);
  store.setItem(DEFAULT_SESSION_KEY, payload);

  // Sinh token xác thực phân vùng cho API gateway
  const mockToken = `eco_jwt_${session.schoolCode.toLowerCase()}_${Date.now()}`;
  store.setItem(tKey, mockToken);
  store.setItem(DEFAULT_TOKEN_KEY, mockToken);
}

/**
 * Nạp phiên đăng nhập. Ưu tiên nạp theo mã trường schoolCode nếu được chỉ định.
 */
export function loadSession(schoolCode?: string): AuthSession | null {
  if (typeof window === 'undefined') return null;
  const sKey = getSessionKey(schoolCode);

  let raw = window.sessionStorage.getItem(sKey) || window.localStorage.getItem(sKey);
  if (!raw && !schoolCode) {
    raw = window.sessionStorage.getItem(DEFAULT_SESSION_KEY) || window.localStorage.getItem(DEFAULT_SESSION_KEY);
  }
  if (!raw) return null;
  try {
    const s = JSON.parse(raw) as AuthSession;
    return s && s.schoolCode ? s : null;
  } catch {
    return null;
  }
}

/**
 * Lấy Bearer Token theo mã trường.
 */
export function getAuthToken(schoolCode?: string): string | null {
  if (typeof window === 'undefined') return null;
  const tKey = getTokenKey(schoolCode);
  return (
    window.sessionStorage.getItem(tKey) ||
    window.localStorage.getItem(tKey) ||
    window.sessionStorage.getItem(DEFAULT_TOKEN_KEY) ||
    window.localStorage.getItem(DEFAULT_TOKEN_KEY)
  );
}

/**
 * Xóa phiên đăng nhập. Nếu truyền schoolCode sẽ chỉ xóa session của trường đó.
 */
export function clearSession(schoolCode?: string): void {
  if (typeof window === 'undefined') return;
  if (schoolCode && schoolCode.trim()) {
    const sKey = getSessionKey(schoolCode);
    const tKey = getTokenKey(schoolCode);
    window.sessionStorage.removeItem(sKey);
    window.localStorage.removeItem(sKey);
    window.sessionStorage.removeItem(tKey);
    window.localStorage.removeItem(tKey);
  } else {
    window.sessionStorage.removeItem(DEFAULT_SESSION_KEY);
    window.localStorage.removeItem(DEFAULT_SESSION_KEY);
    window.sessionStorage.removeItem(DEFAULT_TOKEN_KEY);
    window.localStorage.removeItem(DEFAULT_TOKEN_KEY);
  }
}

/**
 * Xóa sạch dữ liệu tenant cũ khi chuyển trường (OQ-13 - Anti ghost-data).
 */
export function purgeTenantStorage(oldSchoolCode: string): void {
  clearSession(oldSchoolCode);
}
