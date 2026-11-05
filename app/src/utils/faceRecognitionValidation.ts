/**
 * Pure validation engine and business rules for Settings Face Recognition (Cấu hình - Nhận diện)
 * Feature: 048-settings-face-recognition-nhan-dien
 * Specification: docs_legacy/operating-portal/M6-cau-hinh/SM4-nhan-dien.md
 * Rules: BR01 - BR09
 */

import type {
  StudentFaceRecord,
  FaceRecognitionFilterState,
  RegisterFacePayload,
  UpdateFacePayload,
  DeleteFacePayload,
} from '../types/faceRecognition';

/**
 * Strips Vietnamese diacritics and converts to lowercase for accent-insensitive search.
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
 * BR08: Conjunction filtering (AND logic) across search keyword, class, and registration status.
 */
export function filterStudentFaceRecords(
  records: StudentFaceRecord[],
  filters: FaceRecognitionFilterState
): StudentFaceRecord[] {
  if (!records || !Array.isArray(records)) return [];

  const normalizedQuery = removeVietnameseTones(filters.searchQuery || '');

  return records.filter((student) => {
    // 1. Text Search matching student name, student code, or nickname
    if (normalizedQuery) {
      const nameMatch = removeVietnameseTones(student.fullName || '').includes(normalizedQuery);
      const codeMatch = removeVietnameseTones(student.studentCode || '').includes(normalizedQuery);
      const nickMatch = removeVietnameseTones(student.nickname || '').includes(normalizedQuery);
      if (!nameMatch && !codeMatch && !nickMatch) {
        return false;
      }
    }

    // 2. Class Filter (BR08)
    if (filters.classId && filters.classId !== 'all') {
      if (student.classId !== filters.classId) {
        return false;
      }
    }

    // 3. Registration Status Filter (BR07)
    if (filters.registrationStatus && filters.registrationStatus !== 'all') {
      if (filters.registrationStatus === 'registered' && !student.isRegistered) {
        return false;
      }
      if (filters.registrationStatus === 'unregistered' && student.isRegistered) {
        return false;
      }
    }

    return true;
  });
}

/**
 * BR04: Registration button in create modal is disabled until a file is selected.
 */
export function canSubmitRegistration(hasSelectedFile: boolean): boolean {
  return Boolean(hasSelectedFile);
}

/**
 * BR04, BR05: Edit button in edit modal is disabled until a NEW file is selected.
 * Viewing the current photo is explicitly insufficient to enable saving.
 */
export function canSubmitEdit(hasSelectedNewFile: boolean): boolean {
  return Boolean(hasSelectedNewFile);
}

/**
 * BR01: Formats registration date as DD/MM/YYYY when registered, or '-' when unregistered.
 */
export function formatRegistrationDate(registeredDate?: string, isRegistered?: boolean): string {
  if (!isRegistered || !registeredDate) {
    return '-';
  }
  return registeredDate;
}

/**
 * BR01: Renders image thumbnail URL when registered, or '-' indicator when unregistered.
 */
export function formatPhotoDisplay(record: StudentFaceRecord): {
  isRegistered: boolean;
  photoUrl?: string;
  displayText: string;
} {
  if (!record.isRegistered || !record.facePhotoUrl) {
    return {
      isRegistered: false,
      displayText: '-',
    };
  }
  return {
    isRegistered: true,
    photoUrl: record.facePhotoUrl,
    displayText: '',
  };
}

/**
 * BR02, K087: Action column affordance duality.
 * Unregistered -> single '+' icon (tooltip: "Đăng ký ảnh nhận diện")
 * Registered -> 2 icons: pencil (edit) and X/trash (delete)
 */
export function getActionButtons(isRegistered: boolean): Array<'register' | 'edit' | 'delete'> {
  if (!isRegistered) {
    return ['register'];
  }
  return ['edit', 'delete'];
}

/**
 * BR06, K088: Deletion confirmation prompt explicitly naming the target student.
 */
export function getDeleteConfirmPrompt(studentName: string): string {
  const safeName = (studentName || '').trim();
  return `Vui lòng xác nhận xóa thông tin nhận diện của học sinh ${safeName}`;
}

/**
 * Validates payload for registering a new facial image.
 */
export function validateRegisterPayload(payload: RegisterFacePayload): {
  isValid: boolean;
  error?: string;
} {
  if (!payload || !payload.studentId) {
    return { isValid: false, error: 'Thiếu định danh học sinh' };
  }
  if (!payload.facePhotoUrl || !payload.facePhotoUrl.trim()) {
    return { isValid: false, error: 'Vui lòng chọn ảnh nhận diện' };
  }
  return { isValid: true };
}

/**
 * Validates payload for updating an existing facial image.
 */
export function validateUpdatePayload(payload: UpdateFacePayload): {
  isValid: boolean;
  error?: string;
} {
  if (!payload || !payload.studentId) {
    return { isValid: false, error: 'Thiếu định danh học sinh' };
  }
  if (!payload.facePhotoUrl || !payload.facePhotoUrl.trim()) {
    return { isValid: false, error: 'Vui lòng chọn ảnh nhận diện mới' };
  }
  return { isValid: true };
}

/**
 * Validates payload for purging a student's facial image.
 */
export function validateDeletePayload(payload: DeleteFacePayload): {
  isValid: boolean;
  error?: string;
} {
  if (!payload || !payload.studentId) {
    return { isValid: false, error: 'Thiếu định danh học sinh' };
  }
  return { isValid: true };
}
