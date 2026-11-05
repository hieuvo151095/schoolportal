import type {
  Teacher,
  TeacherFilterState,
  CreateTeacherPayload,
  TeacherWorkingStatus,
  TeacherPermissionTier,
} from '../types/teacher.ts';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateTeacherCreation(payload: Partial<CreateTeacherPayload>): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!payload.fullName || !payload.fullName.trim()) {
    errors.fullName = 'Vui lòng nhập họ và tên giáo viên';
  }

  if (!payload.email || !payload.email.trim()) {
    errors.email = 'Vui lòng nhập địa chỉ email';
  } else if (!EMAIL_REGEX.test(payload.email.trim())) {
    errors.email = 'Địa chỉ email không đúng định dạng';
  }

  if (!payload.password || payload.password.length < 6) {
    errors.password = 'Mật khẩu khởi tạo phải chứa tối thiểu 6 ký tự';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateEmailChange(currentEmail: string, newEmail: string): {
  isValid: boolean;
  error?: string;
} {
  const trimmed = newEmail ? newEmail.trim() : '';

  if (!trimmed) {
    return { isValid: false, error: 'Vui lòng nhập địa chỉ email mới' };
  }

  if (!EMAIL_REGEX.test(trimmed)) {
    return { isValid: false, error: 'Địa chỉ email mới không hợp lệ' };
  }

  if (trimmed.toLowerCase() === currentEmail.trim().toLowerCase()) {
    return { isValid: false, error: 'Email mới phải khác với email hiện tại' };
  }

  return { isValid: true };
}

export interface HomeroomConflictResult {
  hasConflict: boolean;
  conflictType?: 'teacher_has_another_class' | 'class_has_another_teacher';
  conflictingTeacherName?: string;
  conflictingClassName?: string;
  warningMessage?: string;
}

export function checkHomeroomConflict(
  teachers: Teacher[],
  targetTeacherId: string,
  targetClassId?: string,
  targetClassName?: string
): HomeroomConflictResult {
  if (!targetClassId) {
    return { hasConflict: false };
  }

  // Case A: Another teacher already homerooms this target class
  const existingHomeroomTeacher = teachers.find(
    (t) => t.id !== targetTeacherId && t.homeroomClassId === targetClassId
  );
  if (existingHomeroomTeacher) {
    return {
      hasConflict: true,
      conflictType: 'class_has_another_teacher',
      conflictingTeacherName: existingHomeroomTeacher.fullName,
      conflictingClassName: targetClassName || existingHomeroomTeacher.homeroomClassName,
      warningMessage: `Lớp ${targetClassName || existingHomeroomTeacher.homeroomClassName} hiện do giáo viên "${existingHomeroomTeacher.fullName}" chủ nhiệm. Phân công này sẽ thay thế giáo viên chủ nhiệm cũ.`,
    };
  }

  // Case B: Target teacher already homerooms another class
  const currentTeacher = teachers.find((t) => t.id === targetTeacherId);
  if (
    currentTeacher &&
    currentTeacher.homeroomClassId &&
    currentTeacher.homeroomClassId !== targetClassId
  ) {
    return {
      hasConflict: true,
      conflictType: 'teacher_has_another_class',
      conflictingTeacherName: currentTeacher.fullName,
      conflictingClassName: currentTeacher.homeroomClassName,
      warningMessage: `Giáo viên "${currentTeacher.fullName}" hiện đang chủ nhiệm lớp ${currentTeacher.homeroomClassName}. Việc chọn thêm lớp này có thể dẫn đến phụ trách 2 lớp chủ nhiệm.`,
    };
  }

  return { hasConflict: false };
}

export function shouldAutoPublishActivity(permissionTier: TeacherPermissionTier): boolean {
  return permissionTier === 'chinh';
}

export function matchesTeacherFilter(teacher: Teacher, filter: TeacherFilterState): boolean {
  // 1. Text Search (Name, Nickname, Email, StaffCode, Phone)
  if (filter.search && filter.search.trim()) {
    const q = filter.search.trim().toLowerCase();
    const nameMatch = teacher.fullName.toLowerCase().includes(q);
    const emailMatch = teacher.email.toLowerCase().includes(q);
    const staffCodeMatch = teacher.staffCode ? teacher.staffCode.toLowerCase().includes(q) : false;
    const phoneMatch = teacher.phone ? teacher.phone.includes(q) : false;
    const cccdMatch = teacher.cccd ? teacher.cccd.toLowerCase().includes(q) : false;

    if (!nameMatch && !emailMatch && !staffCodeMatch && !phoneMatch && !cccdMatch) {
      return false;
    }
  }

  // 2. Class Filter (Matches either homeroom or assigned class)
  if (filter.classId && filter.classId !== 'all') {
    const isHomeroom = teacher.homeroomClassId === filter.classId;
    const isAssigned = teacher.assignedClasses.some((c) => c.classId === filter.classId);
    if (!isHomeroom && !isAssigned) {
      return false;
    }
  }

  // 3. Permission Tier
  if (filter.permissionTier && filter.permissionTier !== 'all') {
    if (teacher.permissionTier !== filter.permissionTier) {
      return false;
    }
  }

  // 4. Status Filter
  if (filter.status && filter.status !== 'all') {
    if (teacher.status !== filter.status) {
      return false;
    }
  }

  // 5. CSDL Sở Filter
  if (filter.csdlSoOnly) {
    if (!teacher.csdlSoCode) {
      return false;
    }
  }

  return true;
}

export function formatTeacherStatus(status: TeacherWorkingStatus): {
  label: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
} {
  switch (status) {
    case 'dang_lam_viec':
      return {
        label: 'Đang làm việc',
        bgClass: 'bg-emerald-500/15',
        textClass: 'text-emerald-500',
        borderClass: 'border-emerald-500/30',
      };
    case 'tam_nghi':
      return {
        label: 'Tạm nghỉ',
        bgClass: 'bg-amber-500/15',
        textClass: 'text-amber-500',
        borderClass: 'border-amber-500/30',
      };
    case 'da_nghi_viec':
      return {
        label: 'Đã nghỉ việc',
        bgClass: 'bg-slate-500/15',
        textClass: 'text-slate-400',
        borderClass: 'border-slate-500/30',
      };
    default:
      return {
        label: 'Chưa rõ',
        bgClass: 'bg-slate-500/15',
        textClass: 'text-slate-400',
        borderClass: 'border-slate-500/30',
      };
  }
}

export function formatPermissionTier(tier: TeacherPermissionTier): {
  label: string;
  badgeClass: string;
} {
  if (tier === 'chinh') {
    return {
      label: 'Giáo viên chính',
      badgeClass: 'bg-blue-600/15 text-blue-400 border border-blue-500/30',
    };
  }
  return {
    label: 'Giáo viên hỗ trợ',
    badgeClass: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
  };
}

export function formatLegacyField(val?: string, fallback = 'Chưa có thông tin'): string {
  if (!val || !val.trim()) {
    return fallback;
  }
  return val;
}
