import { STORAGE_KEYS } from './keys'

export interface Session {
  maTruong: string
  tenTruong: string
  loginAt: string
  /** Tên hiển thị của người đăng nhập (email đã nhập, hoặc "Đăng nhập SSO") — dùng làm
   * "Người thực hiện" khi ghi lịch sử đồng bộ. */
  taiKhoan: string
}

export function getSession(): Session | null {
  const raw = localStorage.getItem(STORAGE_KEYS.session)
  if (!raw) return null
  try {
    return JSON.parse(raw) as Session
  } catch {
    return null
  }
}

export function isAuthenticated(): boolean {
  return getSession() !== null
}

export function login(maTruong: string, tenTruong: string, taiKhoan: string): void {
  const session: Session = { maTruong, tenTruong, loginAt: new Date().toISOString(), taiKhoan }
  localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(session))
}

export function logout(): void {
  localStorage.removeItem(STORAGE_KEYS.session)
}
