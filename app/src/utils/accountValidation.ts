/**
 * Account Management Pure Validation Engine & Utilities
 * Feature: 047-settings-account-management-tai-khoan
 * Standards: BR01-BR21, K076-K082, TK-01 to TK-07, VR-ACC-01 to VR-ACC-10
 */

import type {
  UserAccount,
  StudentAccountItem,
  UserRole,
  StaffFunction,
  CreateUserAccountPayload,
  UpdateUserAccountPayload,
  CreateStudentAccountPayload,
  UpdateStudentAccountPayload,
  UserAccountFilterState,
  StudentAccountFilterState,
} from '../types/account.ts';

export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const STUDENT_USERNAME_REGEX = /^[a-zA-Z0-9_\-\.]+$/;

/**
 * Remove Vietnamese accents for diacritic-insensitive search matching
 */
export function removeVietnameseTones(str: string): string {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
}

/**
 * Formats user role into Vietnamese human-readable label
 */
export function formatRoleLabel(role: UserRole): string {
  switch (role) {
    case 'admin':
      return 'Quản trị viên';
    case 'quan_ly':
      return 'Quản lý';
    case 'giao_vien':
      return 'Giáo viên';
    case 'nhan_vien':
      return 'Nhân viên';
    case 'phu_huynh':
      return 'Phụ huynh';
    default:
      return role;
  }
}

/**
 * Role badge styling token mapping
 */
export function getRoleBadgeStyle(role: UserRole): { bg: string; text: string; border: string } {
  switch (role) {
    case 'admin':
      return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' };
    case 'quan_ly':
      return { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' };
    case 'giao_vien':
      return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' };
    case 'nhan_vien':
      return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' };
    case 'phu_huynh':
      return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' };
    default:
      return { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' };
  }
}

/**
 * Formats staff function into Vietnamese label
 */
export function formatStaffFunctionLabel(fn: StaffFunction): string {
  switch (fn) {
    case 'diem_danh':
      return 'Điểm danh';
    case 'ke_toan':
      return 'Kế toán';
    case 'thong_bao':
      return 'Thông báo';
    case 'cham_soc_y_te':
      return 'Chăm sóc/Y tế';
    default:
      return fn;
  }
}

/**
 * Invariant: Can user account be edited?
 * Admin accounts cannot be edited from the school portal interface (BR03, K077).
 */
export function canEditAccount(account: Pick<UserAccount, 'roles'>): boolean {
  return !account.roles.includes('admin');
}

/**
 * Invariant: Can user account be deleted?
 * Admin accounts cannot be deleted from the school portal interface (BR03, K077).
 */
export function canDeleteAccount(account: Pick<UserAccount, 'roles'>): boolean {
  return !account.roles.includes('admin');
}

/**
 * Invariant: Can full name be edited?
 * Accounts synchronized from CSDL Sở lock the full name field (BR05, K078).
 */
export function canEditFullName(account: Pick<UserAccount, 'isSyncedCsdlSo'>): boolean {
  return !account.isSyncedCsdlSo;
}

/**
 * Invariant: Can row status be toggled?
 * Toggling status on CSDL Sở records is rejected with error banner TK-03 (BR06, K078).
 */
export function canToggleRowStatus(account: Pick<UserAccount, 'isSyncedCsdlSo'>): {
  allowed: boolean;
  errorCode?: string;
  errorMessage?: string;
} {
  if (account.isSyncedCsdlSo) {
    return {
      allowed: false,
      errorCode: 'TK-03',
      errorMessage: 'Không thể cập nhật với đối tượng được đồng bộ từ CSDL ngành',
    };
  }
  return { allowed: true };
}

/**
 * Validates create user account payload
 */
export function validateCreateUserPayload(payload: CreateUserAccountPayload): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!payload.fullName || !payload.fullName.trim()) {
    errors.fullName = 'Vui lòng nhập họ và tên';
  }

  if (!payload.email || !payload.email.trim()) {
    errors.email = 'Vui lòng nhập email';
  } else if (!EMAIL_REGEX.test(payload.email.trim())) {
    errors.email = 'Email không đúng định dạng';
  }

  if (!payload.roles || payload.roles.length === 0) {
    errors.roles = 'Vui lòng chọn ít nhất một vai trò';
  } else if (payload.roles.includes('admin')) {
    // BR04, K077: Admin checkbox cannot be selected on creation
    errors.roles = 'Không thể tạo mới tài khoản với vai trò Quản trị viên';
  }

  if (payload.roles?.includes('nhan_vien')) {
    if (!payload.staffFunctions || payload.staffFunctions.length === 0) {
      // BR10, K081: Error TK-02
      errors.staffFunctions = 'Vui lòng chọn chức năng';
    }
  }

  if (payload.roles?.includes('quan_ly')) {
    if (!payload.managedClassIds || payload.managedClassIds.length === 0) {
      errors.managedClassIds = 'Vui lòng chọn ít nhất một lớp phụ trách';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validates update user account payload
 */
export function validateUpdateUserPayload(payload: UpdateUserAccountPayload, originalAccount: UserAccount): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!payload.fullName || !payload.fullName.trim()) {
    errors.fullName = 'Vui lòng nhập họ và tên';
  }

  // If CSDL Sở, fullName cannot be modified
  if (originalAccount.isSyncedCsdlSo && payload.fullName.trim() !== originalAccount.fullName.trim()) {
    errors.fullName = 'Họ và tên của tài khoản CSDL Sở không được phép thay đổi';
  }

  if (!payload.roles || payload.roles.length === 0) {
    errors.roles = 'Vui lòng chọn ít nhất một vai trò';
  }

  if (payload.roles?.includes('nhan_vien')) {
    if (!payload.staffFunctions || payload.staffFunctions.length === 0) {
      errors.staffFunctions = 'Vui lòng chọn chức năng';
    }
  }

  if (payload.roles?.includes('quan_ly')) {
    if (!payload.managedClassIds || payload.managedClassIds.length === 0) {
      errors.managedClassIds = 'Vui lòng chọn ít nhất một lớp phụ trách';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validates new email format
 */
export function validateEmailPayload(newEmail: string, currentEmail?: string): {
  isValid: boolean;
  error?: string;
} {
  if (!newEmail || !newEmail.trim()) {
    return { isValid: false, error: 'Vui lòng nhập email mới' };
  }
  if (!EMAIL_REGEX.test(newEmail.trim())) {
    return { isValid: false, error: 'Email không đúng định dạng' };
  }
  if (currentEmail && newEmail.trim().toLowerCase() === currentEmail.trim().toLowerCase()) {
    return { isValid: false, error: 'Email mới phải khác email hiện tại' };
  }
  return { isValid: true };
}

/**
 * Validates password update payload
 */
export function validatePasswordPayload(newPassword: string, confirmPassword: string): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!newPassword || newPassword.length < 6) {
    errors.newPassword = 'Mật khẩu phải chứa ít nhất 6 ký tự';
  }

  if (!confirmPassword) {
    errors.confirmPassword = 'Vui lòng xác nhận mật khẩu mới';
  } else if (newPassword !== confirmPassword) {
    errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validates student account username and password
 */
export function validateStudentAccountPayload(
  payload: CreateStudentAccountPayload | UpdateStudentAccountPayload,
  isCreate: boolean
): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!payload.username || !payload.username.trim()) {
    errors.username = 'Vui lòng nhập tên tài khoản';
  } else if (!STUDENT_USERNAME_REGEX.test(payload.username.trim())) {
    // BR20: Username contains only alphanumeric, _, -, .
    errors.username = 'Tên đăng nhập chỉ chứa chữ cái, số, dấu gạch dưới, gạch ngang hoặc chấm';
  }

  if (isCreate) {
    const createPayload = payload as CreateStudentAccountPayload;
    if (!createPayload.password || createPayload.password.length < 6) {
      errors.password = 'Mật khẩu phải chứa ít nhất 6 ký tự';
    }
    if (!createPayload.confirmPassword) {
      errors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (createPayload.password !== createPayload.confirmPassword) {
      errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }
  } else {
    const updatePayload = payload as UpdateStudentAccountPayload;
    if (updatePayload.password) {
      if (updatePayload.password.length < 6) {
        errors.password = 'Mật khẩu phải chứa ít nhất 6 ký tự';
      }
      if (updatePayload.password !== updatePayload.confirmPassword) {
        errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Filters user accounts by search query, role, status, and CSDL Sở sync
 */
export function filterUserAccounts(
  users: UserAccount[],
  filters: UserAccountFilterState
): UserAccount[] {
  const normalizedQuery = removeVietnameseTones(filters.searchQuery);

  return users.filter((user) => {
    // Search query matching full name, email, phone, or linked student names
    if (normalizedQuery) {
      const matchName = removeVietnameseTones(user.fullName).includes(normalizedQuery);
      const matchEmail = (user.email || '').toLowerCase().includes(normalizedQuery);
      const matchPhone = (user.phone || '').includes(normalizedQuery);
      const matchStudents = user.linkedStudents?.some((s) =>
        removeVietnameseTones(s.studentName).includes(normalizedQuery)
      );

      if (!matchName && !matchEmail && !matchPhone && !matchStudents) {
        return false;
      }
    }

    // Role filter
    if (filters.roleFilter !== 'all') {
      if (!user.roles.includes(filters.roleFilter)) {
        return false;
      }
    }

    // Status filter
    if (filters.statusFilter !== 'all') {
      if (user.status !== filters.statusFilter) {
        return false;
      }
    }

    // CSDL Sở sync filter
    if (filters.csdlSoFilter === 'yes' && !user.isSyncedCsdlSo) {
      return false;
    }
    if (filters.csdlSoFilter === 'no' && user.isSyncedCsdlSo) {
      return false;
    }

    return true;
  });
}

/**
 * Filters student accounts by search query, class, and account status
 */
export function filterStudentAccounts(
  students: StudentAccountItem[],
  filters: StudentAccountFilterState
): StudentAccountItem[] {
  const normalizedQuery = removeVietnameseTones(filters.searchQuery);

  return students.filter((item) => {
    // Search matching student name, code, or username
    if (normalizedQuery) {
      const matchName = removeVietnameseTones(item.studentName).includes(normalizedQuery);
      const matchCode = (item.studentCode || '').toLowerCase().includes(normalizedQuery);
      const matchUser = (item.username || '').toLowerCase().includes(normalizedQuery);

      if (!matchName && !matchCode && !matchUser) {
        return false;
      }
    }

    // Class filter
    if (filters.classFilter && filters.classFilter !== 'all') {
      if (item.classId !== filters.classFilter) {
        return false;
      }
    }

    // Account status filter
    if (filters.accountStatusFilter === 'has_account' && !item.hasAccount) {
      return false;
    }
    if (filters.accountStatusFilter === 'no_account' && item.hasAccount) {
      return false;
    }

    return true;
  });
}
