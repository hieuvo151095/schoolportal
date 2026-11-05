import type {
  AccountLoginInput,
  AuthResult,
  EducationDepartment,
  FieldErrors,
  SchoolAccount,
  SsoAccount,
  SsoLoginInput,
  SsoSchool,
} from '../types/auth.ts';

export const GENERIC_CREDENTIAL_ERROR = 'Mã trường, email hoặc mật khẩu không đúng.';
export const GENERIC_SSO_ERROR = 'Tên tài khoản hoặc mật khẩu không đúng.';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CCCD_RE = /^\d{12}$/;

export function normalizeSchoolCode(value: string): string {
  return (value || '').trim().toLowerCase();
}

export function removeVietnameseTones(value: string): string {
  return (value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
}

/* ------------------------- Đăng nhập bằng tài khoản ------------------------- */

export function validateAccountLogin(
  input: AccountLoginInput
): { isValid: boolean; errors: FieldErrors<'schoolCode' | 'email' | 'password'> } {
  const errors: FieldErrors<'schoolCode' | 'email' | 'password'> = {};
  if (!normalizeSchoolCode(input.schoolCode)) {
    errors.schoolCode = 'Vui lòng nhập mã trường.';
  }
  const email = (input.email || '').trim();
  if (!email) {
    errors.email = 'Vui lòng nhập email.';
  } else if (!EMAIL_RE.test(email)) {
    errors.email = 'Email không đúng định dạng.';
  }
  if (!input.password) {
    errors.password = 'Vui lòng nhập mật khẩu.';
  }
  return { isValid: Object.keys(errors).length === 0, errors };
}

/**
 * Xác thực mock. Cố ý trả về MỘT thông báo chung cho mọi lý do sai,
 * để không lộ mã trường / email nào tồn tại.
 */
export function authenticateAccount(
  accounts: SchoolAccount[],
  input: AccountLoginInput,
  now: Date = new Date()
): AuthResult {
  const code = normalizeSchoolCode(input.schoolCode);
  const email = (input.email || '').trim().toLowerCase();
  const found = accounts.find(
    (a) => a.schoolCode.toLowerCase() === code && a.email.toLowerCase() === email
  );
  if (!found || found.password !== input.password) {
    return { ok: false, error: GENERIC_CREDENTIAL_ERROR };
  }
  return {
    ok: true,
    session: {
      method: 'account',
      schoolCode: found.schoolCode,
      schoolName: found.schoolName,
      displayName: found.displayName,
      role: found.role,
      issuedAt: now.toISOString(),
    },
  };
}

/* ------------------------------ Đăng nhập SSO ------------------------------ */

export function getSchoolsByDepartment(schools: SsoSchool[], departmentId: string): SsoSchool[] {
  return schools.filter((s) => s.departmentId === departmentId);
}

/** Tìm trường theo tên hoặc mã trường; không phân biệt hoa thường và dấu. */
export function filterSchools(schools: SsoSchool[], query: string): SsoSchool[] {
  const q = removeVietnameseTones(query).trim();
  if (!q) return schools;
  return schools.filter(
    (s) => removeVietnameseTones(s.name).includes(q) || s.code.toLowerCase().includes(q)
  );
}

export function formatSchoolLabel(school: SsoSchool): string {
  return `${school.name} (${school.code})`;
}

export function validateSsoSelection(
  departmentId: string,
  schoolCode: string
): { isValid: boolean; errors: FieldErrors<'department' | 'school'> } {
  const errors: FieldErrors<'department' | 'school'> = {};
  if (!departmentId) errors.department = 'Vui lòng chọn Sở Giáo dục.';
  if (!schoolCode) errors.school = 'Vui lòng chọn trường.';
  return { isValid: Object.keys(errors).length === 0, errors };
}

/** Trả về URL cổng SSO của Sở; trường phải thuộc đúng Sở đã chọn. */
export function buildSsoPortalUrl(
  departments: EducationDepartment[],
  schools: SsoSchool[],
  departmentId: string,
  schoolCode: string
): string | null {
  const dept = departments.find((d) => d.id === departmentId);
  const school = schools.find((s) => s.code === schoolCode && s.departmentId === departmentId);
  if (!dept || !school) return null;
  return `/sso/login?so=${encodeURIComponent(dept.id)}&school=${encodeURIComponent(school.code)}`;
}

export function validateSsoCredentials(
  input: SsoLoginInput
): { isValid: boolean; errors: FieldErrors<'username' | 'password'> } {
  const errors: FieldErrors<'username' | 'password'> = {};
  const username = (input.username || '').trim();
  if (!username) {
    errors.username = 'Vui lòng nhập số CCCD.';
  } else if (!CCCD_RE.test(username)) {
    errors.username = 'Số CCCD gồm 12 chữ số.';
  }
  if (!input.password) errors.password = 'Vui lòng nhập mật khẩu.';
  return { isValid: Object.keys(errors).length === 0, errors };
}

export function authenticateSso(
  accounts: SsoAccount[],
  schools: SsoSchool[],
  schoolCode: string,
  input: SsoLoginInput,
  now: Date = new Date()
): AuthResult {
  const school = schools.find((s) => s.code === schoolCode);
  const found = accounts.find(
    (a) => a.schoolCode === schoolCode && a.username === (input.username || '').trim()
  );
  if (!school || !found || found.password !== input.password) {
    return { ok: false, error: GENERIC_SSO_ERROR };
  }
  return {
    ok: true,
    session: {
      method: 'sso',
      schoolCode: school.code,
      schoolName: school.name,
      displayName: found.displayName,
      role: found.role,
      issuedAt: now.toISOString(),
    },
  };
}

/* -------------------------------- Điều hướng -------------------------------- */

export const DEFAULT_LANDING_PATH = (schoolCode: string) =>
  `/${schoolCode}/class/lop-1a1/attendance`;

/** Chỉ chấp nhận đường dẫn nội bộ (chống open-redirect: `//evil.com`, `https://…`, `/\evil`). */
export function sanitizeNextPath(next: unknown): string | null {
  if (typeof next !== 'string') return null;
  if (!next.startsWith('/') || next.startsWith('//') || next.includes('\\')) return null;
  if (/^\/(signin|sso)(\/|\?|$)/.test(next)) return null;
  return next;
}

export function resolvePostLoginPath(schoolCode: string, next?: unknown): string {
  return sanitizeNextPath(next) || DEFAULT_LANDING_PATH(schoolCode);
}
