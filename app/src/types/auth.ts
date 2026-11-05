/**
 * Đăng nhập (Sign-in) — domain types.
 * Hai phương thức: SSO (Sở GD&ĐT → Trường → cổng SSO) và Tài khoản (mã trường + email + mật khẩu).
 */

export type LoginMethod = 'sso' | 'account';

export type UserRole = 'admin' | 'teacher' | 'accountant';

/** Sở Giáo dục & Đào tạo (tỉnh/thành) cung cấp dữ liệu SSO. */
export interface EducationDepartment {
  id: string;
  name: string;
  /** Tên cổng SSO hiển thị ở màn đăng nhập của Sở (vd. HCMEDU SSO). */
  ssoBrand: string;
  /** Đơn vị vận hành cổng, hiển thị ở chân trang cổng SSO. */
  poweredBy: string;
}

export interface SsoSchool {
  /** Mã trường do Sở cấp (vd. 74718333). */
  code: string;
  name: string;
  departmentId: string;
}

/** Tài khoản do Finviet cấp cho trường (đăng nhập bằng mã trường + email + mật khẩu). */
export interface SchoolAccount {
  schoolCode: string;
  schoolName: string;
  email: string;
  /** Mock only — backend thật chỉ lưu hash, không bao giờ trả mật khẩu về client. */
  password: string;
  displayName: string;
  role: UserRole;
}

/** Tài khoản trên cổng SSO của Sở (tên tài khoản = số CCCD). */
export interface SsoAccount {
  schoolCode: string;
  username: string;
  password: string;
  displayName: string;
  role: UserRole;
}

export interface AuthSession {
  method: LoginMethod;
  schoolCode: string;
  schoolName: string;
  displayName: string;
  role: UserRole;
  issuedAt: string;
}

export type AuthResult =
  | { ok: true; session: AuthSession }
  | { ok: false; error: string };

export interface AccountLoginInput {
  schoolCode: string;
  email: string;
  password: string;
}

export interface SsoLoginInput {
  username: string;
  password: string;
}

export type FieldErrors<K extends string> = Partial<Record<K, string>>;
