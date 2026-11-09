import type {
  EducationDepartment,
  SchoolAccount,
  SsoAccount,
  SsoSchool,
} from '../types/auth.ts';

export const MOCK_DEPARTMENTS: EducationDepartment[] = [
  {
    id: 'hcm',
    name: 'Sở GD&ĐT TP. Hồ Chí Minh',
    ssoBrand: 'HCMEDU SSO',
    poweredBy: 'Sở Giáo dục và Đào tạo TP Hồ Chí Minh',
  },
  {
    id: 'hn',
    name: 'Sở GD&ĐT Hà Nội',
    ssoBrand: 'HANOIEDU SSO',
    poweredBy: 'Sở Giáo dục và Đào tạo Hà Nội',
  },
  {
    id: 'dn',
    name: 'Sở GD&ĐT Đà Nẵng',
    ssoBrand: 'DANANGEDU SSO',
    poweredBy: 'Sở Giáo dục và Đào tạo Đà Nẵng',
  },
];

export const MOCK_SSO_SCHOOLS: SsoSchool[] = [
  { code: '74718333', name: 'Trường MN Hoa Hồng', departmentId: 'hcm' },
  { code: '74718341', name: 'Trường MN Chánh Mỹ', departmentId: 'hcm' },
  { code: '74718600', name: 'NT Baby', departmentId: 'hcm' },
  { code: '74718601', name: 'LMG Thanh Tâm', departmentId: 'hcm' },
  { code: '74718605', name: 'NT-LMG Vườn Tuổi Thơ', departmentId: 'hcm' },
  { code: '74718702', name: 'Liên cấp PT Sao Mai', departmentId: 'hcm' },
  { code: '01801001', name: 'Trường TH Ba Đình', departmentId: 'hn' },
  { code: '01801002', name: 'Trường MN Hoa Sữa', departmentId: 'hn' },
  { code: '04801001', name: 'Trường TH Hải Châu', departmentId: 'dn' },
];

/** Tài khoản demo cho cổng SSO (tên tài khoản = số CCCD). */
export const MOCK_SSO_ACCOUNTS: SsoAccount[] = [
  {
    schoolCode: '74718702',
    username: '079201001234',
    password: 'Sso@2026',
    displayName: 'Cô Nguyễn Thị Mai',
    role: 'teacher',
  },
  {
    schoolCode: '74718333',
    username: '079201005678',
    password: 'Sso@2026',
    displayName: 'Thầy Trần Văn Hùng',
    role: 'admin',
  },
];

/** Tài khoản demo do Finviet cấp (mã trường + email + mật khẩu). */
export const MOCK_SCHOOL_ACCOUNTS: SchoolAccount[] = [
  // --- Trường K12 (Điểm danh 2 buổi) ---
  {
    schoolCode: 'demo',
    schoolName: 'Trường Phổ Thông Liên Cấp ECO (K12)',
    email: 'admin@demo.edu.vn',
    password: 'Demo@2026',
    displayName: 'Quản trị viên K12',
    role: 'admin',
  },
  {
    schoolCode: 'demo',
    schoolName: 'Trường Phổ Thông Liên Cấp ECO (K12)',
    email: 'ketoan@demo.edu.vn',
    password: 'Demo@2026',
    displayName: 'Nguyễn Thị Kế Toán',
    role: 'accountant',
  },
  {
    schoolCode: 'demo',
    schoolName: 'Trường Phổ Thông Liên Cấp ECO (K12)',
    email: 'mai.nguyen@demo.edu.vn',
    password: 'Demo@2026',
    displayName: 'Cô Nguyễn Thị Mai',
    role: 'teacher',
  },

  // --- Trường Mầm Non (Điểm danh 1 buổi) ---
  {
    schoolCode: 'mamnon',
    schoolName: 'Trường Mầm Non Ban Mai',
    email: 'admin@mamnon.edu.vn',
    password: 'Demo@2026',
    displayName: 'Quản trị viên Mầm Non',
    role: 'admin',
  },
  {
    schoolCode: 'mamnon',
    schoolName: 'Trường Mầm Non Ban Mai',
    email: 'mai.nguyen@mamnon.edu.vn',
    password: 'Demo@2026',
    displayName: 'Cô Nguyễn Mai Anh',
    role: 'teacher',
  },
];
