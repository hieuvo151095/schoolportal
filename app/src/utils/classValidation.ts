import type { ClassFormData, ClassItem, ClassFilterState } from '../types/class.ts';

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface HomeroomConflictResult {
  hasConflict: boolean;
  conflictingClassName?: string;
  conflictingClassCode?: string;
}

export const validateClassForm = (
  data: Partial<ClassFormData>,
  existingClasses: ClassItem[] = [],
  editingClassId?: string
): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!data.name || !data.name.trim()) {
    errors.name = 'Tên lớp học không được để trống';
  } else if (data.name.trim().length > 100) {
    errors.name = 'Tên lớp học tối đa 100 ký tự';
  }

  if (!data.code || !data.code.trim()) {
    errors.code = 'Mã định danh lớp không được để trống';
  } else {
    const trimmedCode = data.code.trim().toUpperCase();
    const isDuplicate = existingClasses.some(
      (c) =>
        c.id !== editingClassId &&
        c.code.trim().toUpperCase() === trimmedCode &&
        c.academicYear === (data.academicYear || '2025-2026')
    );
    if (isDuplicate) {
      errors.code = `Mã lớp '${trimmedCode}' đã tồn tại trong năm học ${data.academicYear || '2025-2026'}`;
    }
  }

  if (!data.academicYear || !data.academicYear.trim()) {
    errors.academicYear = 'Năm học không được để trống';
  }

  if (data.maxCapacity === undefined || data.maxCapacity === null || isNaN(Number(data.maxCapacity))) {
    errors.maxCapacity = 'Sĩ số tối đa không được để trống';
  } else if (Number(data.maxCapacity) < 1) {
    errors.maxCapacity = 'Sĩ số tối đa phải lớn hơn 0';
  } else if (Number(data.maxCapacity) > 60) {
    errors.maxCapacity = 'Sĩ số tối đa không vượt quá 60 học sinh';
  }

  if (data.taxonomy === 'chinh_khoa') {
    if (!data.gradeLevelId || !data.gradeLevelId.trim()) {
      errors.gradeLevelId = 'Vui lòng chọn khối lớp cho lớp chính khóa';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const canDeleteClass = (classItem: Pick<ClassItem, 'studentCount'>): boolean => {
  return classItem.studentCount === 0;
};

export const getDeletionBlockReason = (studentCount: number): string => {
  if (studentCount > 0) {
    return `Không thể xóa lớp đang có ${studentCount} học sinh. Vui lòng chuyển học sinh sang lớp khác trước khi xóa.`;
  }
  return '';
};

export const checkHomeroomConflict = (
  teacherId: string | undefined,
  currentClassId: string | undefined,
  academicYear: string,
  existingClasses: ClassItem[] = []
): HomeroomConflictResult => {
  if (!teacherId) {
    return { hasConflict: false };
  }

  const conflictingClass = existingClasses.find(
    (c) =>
      c.id !== currentClassId &&
      c.homeroomTeacherId === teacherId &&
      c.academicYear === academicYear &&
      c.status !== 'da_ket_thuc'
  );

  if (conflictingClass) {
    return {
      hasConflict: true,
      conflictingClassName: conflictingClass.name,
      conflictingClassCode: conflictingClass.code,
    };
  }

  return { hasConflict: false };
};

export const filterClassesList = (
  classes: ClassItem[],
  filter: ClassFilterState
): ClassItem[] => {
  return classes.filter((item) => {
    // Taxonomy tab filter
    if (filter.taxonomy && item.taxonomy !== filter.taxonomy) {
      return false;
    }

    // Academic Year filter
    if (filter.academicYear && item.academicYear !== filter.academicYear) {
      return false;
    }

    // Grade Level filter
    if (filter.gradeLevelId && item.gradeLevelId !== filter.gradeLevelId) {
      return false;
    }

    // Status filter
    if (filter.status && item.status !== filter.status) {
      return false;
    }

    // Search query matching name, code, roomNumber, teacher name
    if (filter.searchQuery && filter.searchQuery.trim()) {
      const q = filter.searchQuery.trim().toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchCode = item.code.toLowerCase().includes(q);
      const matchRoom = item.roomNumber ? item.roomNumber.toLowerCase().includes(q) : false;
      const matchTeacher = item.homeroomTeacherName ? item.homeroomTeacherName.toLowerCase().includes(q) : false;
      const matchCategory = item.clubCategory ? item.clubCategory.toLowerCase().includes(q) : false;

      if (!matchName && !matchCode && !matchRoom && !matchTeacher && !matchCategory) {
        return false;
      }
    }

    // Teacher Role filter
    if (filter.teacherRole === 'co_gvcn' && !item.homeroomTeacherId) {
      return false;
    }
    if (filter.teacherRole === 'chua_co_gvcn' && item.homeroomTeacherId) {
      return false;
    }

    // Specific Teacher filter
    if (filter.teacherId) {
      const isHomeroom = item.homeroomTeacherId === filter.teacherId;
      const isInstructor = item.instructors?.some((ins) => ins.teacherId === filter.teacherId);
      if (!isHomeroom && !isInstructor) {
        return false;
      }
    }

    // CSDL Sở status filter
    if (filter.csdlStatus && item.csdlStatus !== filter.csdlStatus) {
      return false;
    }

    // Capacity range filter
    if (filter.capacityMin !== undefined && item.studentCount < filter.capacityMin) {
      return false;
    }
    if (filter.capacityMax !== undefined && item.studentCount > filter.capacityMax) {
      return false;
    }

    return true;
  });
};
