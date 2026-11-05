import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  validateTeacherCreation,
  validateEmailChange,
  checkHomeroomConflict,
  shouldAutoPublishActivity,
  matchesTeacherFilter,
  formatTeacherStatus,
  formatPermissionTier,
  formatLegacyField,
} from '../../src/utils/teacherValidation.ts';
import teacherReducer, {
  addTeacher,
  updateTeacher,
  changeTeacherEmail,
  assignClasses,
  changeTeacherStatus,
  changePermissionTier,
  deleteTeacher,
  setFilter,
  resetFilter,
} from '../../src/store/slices/teacherSlice.ts';

const SAMPLE_TEACHERS = [
  {
    id: 'gv-001',
    schoolCode: 'demo',
    staffCode: 'GV-2024-001',
    fullName: 'Nguyễn Thị Mai',
    email: 'mai.nguyen@finviet.edu.vn',
    phone: '0912345678',
    gender: 'nu',
    dob: '1988-03-15',
    cccd: '001188001234',
    homeroomClassId: 'lop-1a1',
    homeroomClassName: 'Lớp 1A1',
    assignedClasses: [
      { classId: 'lop-1a1', className: 'Lớp 1A1' },
      { classId: 'lop-1a2', className: 'Lớp 1A2' },
    ],
    subjects: ['Tiếng Việt', 'Toán'],
    permissionTier: 'chinh',
    status: 'dang_lam_viec',
    csdlSoCode: 'SO-HN-88001',
    createdAt: '2024-01-10T08:00:00Z',
  },
  {
    id: 'gv-002',
    schoolCode: 'demo',
    staffCode: 'GV-2024-002',
    fullName: 'Trần Văn Dũng',
    email: 'dung.tran@finviet.edu.vn',
    phone: '0987654321',
    gender: 'nam',
    dob: '1985-11-20',
    cccd: '079185005678',
    homeroomClassId: 'lop-1a2',
    homeroomClassName: 'Lớp 1A2',
    assignedClasses: [{ classId: 'lop-1a2', className: 'Lớp 1A2' }],
    subjects: ['Toán'],
    permissionTier: 'chinh',
    status: 'dang_lam_viec',
    createdAt: '2024-01-10T08:00:00Z',
  },
  {
    id: 'gv-004',
    schoolCode: 'demo',
    staffCode: 'GV-2025-004',
    fullName: 'Phạm Quỳnh Nga',
    email: 'nga.pham@finviet.edu.vn',
    phone: '0934567890',
    gender: 'nu',
    assignedClasses: [{ classId: 'lop-1a1', className: 'Lớp 1A1' }],
    subjects: ['Mỹ thuật'],
    permissionTier: 'ho_tro',
    status: 'dang_lam_viec',
    createdAt: '2025-02-15T10:00:00Z',
  },
  {
    id: 'gv-005',
    schoolCode: 'demo',
    staffCode: 'GV-2023-005',
    fullName: 'Hoàng Minh Đức',
    email: 'duc.hoang@finviet.edu.vn',
    gender: 'nam',
    assignedClasses: [],
    subjects: ['Thể chất'],
    permissionTier: 'chinh',
    status: 'tam_nghi',
    createdAt: '2024-08-10T08:00:00Z',
  },
  {
    id: 'gv-007',
    schoolCode: 'demo',
    fullName: 'Đặng Hoài An',
    email: 'an.dang@finviet.edu.vn',
    gender: 'nu',
    assignedClasses: [],
    subjects: ['Kỹ năng sống'],
    permissionTier: 'ho_tro',
    status: 'dang_lam_viec',
    createdAt: '2024-03-01T08:00:00Z',
  },
];

describe('Teacher Module Business Rules & Integration (Nhà Trường - Giáo Viên)', () => {
  describe('BR-TCH-01: Two-Tier Content Moderation & Auto-Publishing (BR01)', () => {
    test('auto-publishes activity posts for Giáo viên chính (chinh)', () => {
      assert.equal(shouldAutoPublishActivity('chinh'), true);
    });

    test('routes activity posts to moderation review for Giáo viên hỗ trợ (ho_tro)', () => {
      assert.equal(shouldAutoPublishActivity('ho_tro'), false);
    });
  });

  describe('BR-TCH-02: Homeroom Assignment Conflict Detection (Resolution K006)', () => {
    test('detects conflict when target class already has another homeroom teacher', () => {
      // Class 'lop-1a1' is already homeroomed by 'gv-001' (Nguyễn Thị Mai)
      const conflict = checkHomeroomConflict(
        SAMPLE_TEACHERS,
        'gv-004', // target teacher is Nga
        'lop-1a1',
        'Lớp 1A1'
      );
      assert.equal(conflict.hasConflict, true);
      assert.equal(conflict.conflictType, 'class_has_another_teacher');
      assert.equal(conflict.conflictingTeacherName, 'Nguyễn Thị Mai');
      assert.ok(conflict.warningMessage?.includes('Nguyễn Thị Mai'));
    });

    test('detects conflict when target teacher already homerooms another class', () => {
      // Teacher 'gv-001' already homerooms 'lop-1a1', now assigned to 'lop-2a1'
      const conflict = checkHomeroomConflict(
        SAMPLE_TEACHERS,
        'gv-001',
        'lop-2a1',
        'Lớp 2A1'
      );
      assert.equal(conflict.hasConflict, true);
      assert.equal(conflict.conflictType, 'teacher_has_another_class');
      assert.equal(conflict.conflictingClassName, 'Lớp 1A1');
    });

    test('returns no conflict when assigning an available class to an unassigned teacher', () => {
      const conflict = checkHomeroomConflict(
        SAMPLE_TEACHERS,
        'gv-004',
        'lop-2a1',
        'Lớp 2A1'
      );
      assert.equal(conflict.hasConflict, false);
    });

    test('returns no conflict when unassigning homeroom (targetClassId is undefined)', () => {
      const conflict = checkHomeroomConflict(SAMPLE_TEACHERS, 'gv-001', undefined);
      assert.equal(conflict.hasConflict, false);
    });
  });

  describe('BR-TCH-03: Teacher Creation Validation (BR03)', () => {
    test('rejects empty payload with required field errors', () => {
      const result = validateTeacherCreation({});
      assert.equal(result.isValid, false);
      assert.ok(result.errors.fullName);
      assert.ok(result.errors.email);
      assert.ok(result.errors.password);
    });

    test('rejects invalid email formats', () => {
      const result = validateTeacherCreation({
        fullName: 'Nguyễn Văn A',
        email: 'invalid-email-address',
        password: 'password123',
      });
      assert.equal(result.isValid, false);
      assert.equal(result.errors.email, 'Địa chỉ email không đúng định dạng');
    });

    test('rejects password shorter than 6 characters', () => {
      const result = validateTeacherCreation({
        fullName: 'Nguyễn Văn A',
        email: 'vana@school.edu.vn',
        password: '12345',
      });
      assert.equal(result.isValid, false);
      assert.equal(result.errors.password, 'Mật khẩu khởi tạo phải chứa tối thiểu 6 ký tự');
    });

    test('accepts valid teacher creation payload', () => {
      const result = validateTeacherCreation({
        fullName: 'Lê Hoàng Nam',
        email: 'nam.le@finviet.edu.vn',
        password: 'secretPassword123',
      });
      assert.equal(result.isValid, true);
      assert.deepEqual(result.errors, {});
    });
  });

  describe('BR-TCH-04: Credential Email Change Validation (BR06)', () => {
    test('rejects empty new email', () => {
      const result = validateEmailChange('old@school.edu.vn', '');
      assert.equal(result.isValid, false);
      assert.ok(result.error);
    });

    test('rejects invalid email syntax', () => {
      const result = validateEmailChange('old@school.edu.vn', 'not-an-email');
      assert.equal(result.isValid, false);
      assert.equal(result.error, 'Địa chỉ email mới không hợp lệ');
    });

    test('rejects identical email to current email (case-insensitive)', () => {
      const result = validateEmailChange('mai.nguyen@finviet.edu.vn', 'MAI.NGUYEN@finviet.edu.vn');
      assert.equal(result.isValid, false);
      assert.equal(result.error, 'Email mới phải khác với email hiện tại');
    });

    test('accepts valid distinct new email', () => {
      const result = validateEmailChange('mai.nguyen@finviet.edu.vn', 'mai.nguyen.new@finviet.edu.vn');
      assert.equal(result.isValid, true);
      assert.equal(result.error, undefined);
    });
  });

  describe('BR-TCH-05: Multi-Factor Directory Search & Filtering (BR04, BR05, BR09)', () => {
    test('matches teacher by partial name search', () => {
      const filter = { search: 'Thị Mai', classId: 'all', permissionTier: 'all', status: 'all', csdlSoOnly: false };
      assert.equal(matchesTeacherFilter(SAMPLE_TEACHERS[0], filter), true);
      assert.equal(matchesTeacherFilter(SAMPLE_TEACHERS[1], filter), false);
    });

    test('matches teacher by staffCode or CCCD', () => {
      const filterStaff = { search: 'GV-2024-002', classId: 'all', permissionTier: 'all', status: 'all', csdlSoOnly: false };
      assert.equal(matchesTeacherFilter(SAMPLE_TEACHERS[1], filterStaff), true);

      const filterCCCD = { search: '001188001234', classId: 'all', permissionTier: 'all', status: 'all', csdlSoOnly: false };
      assert.equal(matchesTeacherFilter(SAMPLE_TEACHERS[0], filterCCCD), true);
    });

    test('filters teachers by classId matching either homeroom or assigned classes', () => {
      const filter = { search: '', classId: 'lop-1a1', permissionTier: 'all', status: 'all', csdlSoOnly: false };
      // gv-001 is homeroom for lop-1a1 -> matches
      assert.equal(matchesTeacherFilter(SAMPLE_TEACHERS[0], filter), true);
      // gv-004 is assigned to lop-1a1 -> matches
      assert.equal(matchesTeacherFilter(SAMPLE_TEACHERS[2], filter), true);
      // gv-002 is homeroom for lop-1a2 only -> does not match
      assert.equal(matchesTeacherFilter(SAMPLE_TEACHERS[1], filter), false);
    });

    test('filters teachers by permissionTier (chinh vs ho_tro)', () => {
      const filterChinh = { search: '', classId: 'all', permissionTier: 'chinh', status: 'all', csdlSoOnly: false };
      assert.equal(matchesTeacherFilter(SAMPLE_TEACHERS[0], filterChinh), true);
      assert.equal(matchesTeacherFilter(SAMPLE_TEACHERS[2], filterChinh), false);

      const filterHoTro = { search: '', classId: 'all', permissionTier: 'ho_tro', status: 'all', csdlSoOnly: false };
      assert.equal(matchesTeacherFilter(SAMPLE_TEACHERS[2], filterHoTro), true);
      assert.equal(matchesTeacherFilter(SAMPLE_TEACHERS[0], filterHoTro), false);
    });

    test('filters teachers by working status (dang_lam_viec vs tam_nghi)', () => {
      const filterTamNghi = { search: '', classId: 'all', permissionTier: 'all', status: 'tam_nghi', csdlSoOnly: false };
      assert.equal(matchesTeacherFilter(SAMPLE_TEACHERS[3], filterTamNghi), true);
      assert.equal(matchesTeacherFilter(SAMPLE_TEACHERS[0], filterTamNghi), false);
    });

    test('filters teachers by CSDL Sở GD&ĐT synchronization code (BR09)', () => {
      const filterCsdl = { search: '', classId: 'all', permissionTier: 'all', status: 'all', csdlSoOnly: true };
      // gv-001 has csdlSoCode -> true
      assert.equal(matchesTeacherFilter(SAMPLE_TEACHERS[0], filterCsdl), true);
      // gv-002 has no csdlSoCode -> false
      assert.equal(matchesTeacherFilter(SAMPLE_TEACHERS[1], filterCsdl), false);
    });
  });

  describe('BR-TCH-06: Status, Permission & Legacy Field Degradation (K008)', () => {
    test('formats working status with appropriate badge classes', () => {
      const active = formatTeacherStatus('dang_lam_viec');
      assert.equal(active.label, 'Đang làm việc');
      assert.ok(active.textClass.includes('emerald'));

      const paused = formatTeacherStatus('tam_nghi');
      assert.equal(paused.label, 'Tạm nghỉ');
      assert.ok(paused.textClass.includes('amber'));

      const left = formatTeacherStatus('da_nghi_viec');
      assert.equal(left.label, 'Đã nghỉ việc');
      assert.ok(left.textClass.includes('slate'));
    });

    test('formats permission tier badge', () => {
      const primary = formatPermissionTier('chinh');
      assert.equal(primary.label, 'Giáo viên chính');
      assert.ok(primary.badgeClass.includes('blue'));

      const assistant = formatPermissionTier('ho_tro');
      assert.equal(assistant.label, 'Giáo viên hỗ trợ');
      assert.ok(assistant.badgeClass.includes('amber'));
    });

    test('gracefully degrades missing staffCode and CCCD for legacy records (K008)', () => {
      const legacyTeacher = SAMPLE_TEACHERS[4]; // gv-007
      assert.equal(formatLegacyField(legacyTeacher.staffCode, 'Chưa có mã nhân viên'), 'Chưa có mã nhân viên');
      assert.equal(formatLegacyField(legacyTeacher.cccd, 'Chưa có CCCD'), 'Chưa có CCCD');
    });
  });

  describe('BR-TCH-07: Redux State Machine Mutations', () => {
    const initialState = {
      teachers: [...SAMPLE_TEACHERS],
      filter: { search: '', classId: 'all', permissionTier: 'all', status: 'all', csdlSoOnly: false },
      selectedTeacherId: null,
      loading: false,
      activeModal: 'none',
      modalTargetTeacherId: null,
    };

    test('addTeacher prepends new teacher with unique ID and timestamp', () => {
      const state = teacherReducer(
        initialState,
        addTeacher({
          schoolCode: 'demo',
          fullName: 'Bùi Thị Lan',
          email: 'lan.bui@finviet.edu.vn',
          gender: 'nu',
          assignedClasses: [],
          subjects: ['Toán'],
          permissionTier: 'chinh',
          status: 'dang_lam_viec',
        })
      );
      assert.equal(state.teachers.length, SAMPLE_TEACHERS.length + 1);
      assert.equal(state.teachers[0].fullName, 'Bùi Thị Lan');
      assert.ok(state.teachers[0].id.startsWith('gv-'));
      assert.ok(state.teachers[0].createdAt);
    });

    test('changeTeacherEmail updates target teacher email', () => {
      const state = teacherReducer(
        initialState,
        changeTeacherEmail({
          teacherId: 'gv-001',
          newEmail: 'mai.updated@finviet.edu.vn',
        })
      );
      const teacher = state.teachers.find((t) => t.id === 'gv-001');
      assert.equal(teacher?.email, 'mai.updated@finviet.edu.vn');
    });

    test('assignClasses assigns homeroom and unassigns previous homeroom holder', () => {
      // gv-004 is assigned homeroom 'lop-1a1' which belonged to 'gv-001'
      const state = teacherReducer(
        initialState,
        assignClasses({
          teacherId: 'gv-004',
          homeroomClassId: 'lop-1a1',
          homeroomClassName: 'Lớp 1A1',
          assignedClasses: [{ classId: 'lop-1a1', className: 'Lớp 1A1' }],
        })
      );

      const newHomeroom = state.teachers.find((t) => t.id === 'gv-004');
      assert.equal(newHomeroom?.homeroomClassId, 'lop-1a1');
      assert.equal(newHomeroom?.homeroomClassName, 'Lớp 1A1');

      const oldHomeroom = state.teachers.find((t) => t.id === 'gv-001');
      assert.equal(oldHomeroom?.homeroomClassId, undefined);
      assert.equal(oldHomeroom?.homeroomClassName, undefined);
    });

    test('changeTeacherStatus and changePermissionTier update metadata', () => {
      let state = teacherReducer(
        initialState,
        changeTeacherStatus({ teacherId: 'gv-001', status: 'tam_nghi' })
      );
      assert.equal(state.teachers.find((t) => t.id === 'gv-001')?.status, 'tam_nghi');

      state = teacherReducer(
        state,
        changePermissionTier({ teacherId: 'gv-001', permissionTier: 'ho_tro' })
      );
      assert.equal(state.teachers.find((t) => t.id === 'gv-001')?.permissionTier, 'ho_tro');
    });

    test('deleteTeacher removes teacher from state', () => {
      const state = teacherReducer(initialState, deleteTeacher('gv-002'));
      assert.equal(state.teachers.length, SAMPLE_TEACHERS.length - 1);
      assert.equal(state.teachers.find((t) => t.id === 'gv-002'), undefined);
    });

    test('setFilter and resetFilter manage directory search state', () => {
      let state = teacherReducer(initialState, setFilter({ search: 'Mai', classId: 'lop-1a1' }));
      assert.equal(state.filter.search, 'Mai');
      assert.equal(state.filter.classId, 'lop-1a1');

      state = teacherReducer(state, resetFilter());
      assert.equal(state.filter.search, '');
      assert.equal(state.filter.classId, 'all');
    });
  });
});
