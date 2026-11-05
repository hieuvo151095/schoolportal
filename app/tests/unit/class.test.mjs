import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  validateClassForm,
  canDeleteClass,
  getDeletionBlockReason,
  checkHomeroomConflict,
  filterClassesList,
} from '../../src/utils/classValidation.ts';
import classReducer, {
  setActiveTaxonomy,
  setFilterCriteria,
  resetFilterCriteria,
  addClass,
  updateClass,
  deleteClass,
  changeClassStatus,
} from '../../src/store/slices/classSlice.ts';
import { MOCK_CLASSES, MOCK_GRADE_LEVELS } from '../../src/services/mockClassData.ts';

describe('School Class Management (Nhà Trường — Lớp Học) Business Rules & Engine', () => {
  // BR01: Dual Taxonomy Separation
  describe('BR01: Dual Taxonomy Separation & Projection', () => {
    it('initializes state with activeTaxonomy = "chinh_khoa"', () => {
      const state = classReducer(undefined, { type: '@@INIT' });
      assert.equal(state.activeTaxonomy, 'chinh_khoa');
      assert.equal(state.filterCriteria.taxonomy, 'chinh_khoa');
      assert.ok(state.classes.length > 0);
    });

    it('switches between chinh_khoa and ngoai_khoa tabs and resets grade filter for extracurricular', () => {
      let state = classReducer(undefined, { type: '@@INIT' });
      state = classReducer(state, setFilterCriteria({ gradeLevelId: 'grd-mam' }));
      assert.equal(state.filterCriteria.gradeLevelId, 'grd-mam');

      state = classReducer(state, setActiveTaxonomy('ngoai_khoa'));
      assert.equal(state.activeTaxonomy, 'ngoai_khoa');
      assert.equal(state.filterCriteria.taxonomy, 'ngoai_khoa');
      assert.equal(state.filterCriteria.gradeLevelId, undefined);

      state = classReducer(state, setActiveTaxonomy('chinh_khoa'));
      assert.equal(state.activeTaxonomy, 'chinh_khoa');
    });
  });

  // BR02: Empty Class Deletion Safety Guardrail (Resolution K026)
  describe('BR02: Empty Class Deletion Guardrail (Resolution K026)', () => {
    it('strictly forbids deletion when studentCount > 0', () => {
      const populatedClass = { studentCount: 24 };
      assert.equal(canDeleteClass(populatedClass), false);
      const reason = getDeletionBlockReason(24);
      assert.ok(reason.includes('Không thể xóa lớp đang có 24 học sinh'));
    });

    it('allows deletion when studentCount === 0', () => {
      const emptyClass = { studentCount: 0 };
      assert.equal(canDeleteClass(emptyClass), true);
      assert.equal(getDeletionBlockReason(0), '');
    });

    it('Redux deleteClass reducer strictly ignores deletion if studentCount > 0', () => {
      const initialState = {
        classes: [
          {
            id: 'cls-active',
            schoolCode: 'demo',
            name: 'Lớp Đang Hoạt Động',
            code: 'ACTIVE-01',
            taxonomy: 'chinh_khoa',
            academicYear: '2025-2026',
            maxCapacity: 30,
            studentCount: 15,
            status: 'dang_hoat_dong',
            createdAt: '2025-08-15T08:00:00Z',
            updatedAt: '2025-08-15T08:00:00Z',
          },
          {
            id: 'cls-empty',
            schoolCode: 'demo',
            name: 'Lớp Trống',
            code: 'EMPTY-01',
            taxonomy: 'chinh_khoa',
            academicYear: '2025-2026',
            maxCapacity: 30,
            studentCount: 0,
            status: 'dang_hoat_dong',
            createdAt: '2025-08-15T08:00:00Z',
            updatedAt: '2025-08-15T08:00:00Z',
          },
        ],
        gradeLevels: MOCK_GRADE_LEVELS,
        activeTaxonomy: 'chinh_khoa',
        filterCriteria: { searchQuery: '', taxonomy: 'chinh_khoa', academicYear: '2025-2026' },
        selectedClassId: null,
        isFormModalOpen: false,
        isDeleteModalOpen: false,
        formMode: 'create',
        editingClassId: null,
        classToDelete: null,
      };

      // Attempt to delete populated class
      const stateAfterBlockedDelete = classReducer(initialState, deleteClass('cls-active'));
      assert.equal(stateAfterBlockedDelete.classes.length, 2);
      assert.ok(stateAfterBlockedDelete.classes.some((c) => c.id === 'cls-active'));

      // Delete empty class
      const stateAfterValidDelete = classReducer(stateAfterBlockedDelete, deleteClass('cls-empty'));
      assert.equal(stateAfterValidDelete.classes.length, 1);
      assert.equal(stateAfterValidDelete.classes[0].id, 'cls-active');
    });
  });

  // BR03: Homeroom Exclusivity & Conflict Detection (Resolution K027)
  describe('BR03: Homeroom Exclusivity & Conflict Detection (Resolution K027)', () => {
    it('detects conflict when teacher is already homeroom in active academic year', () => {
      const conflict = checkHomeroomConflict('TCH-001', undefined, '2025-2026', MOCK_CLASSES);
      assert.equal(conflict.hasConflict, true);
      assert.equal(conflict.conflictingClassCode, 'MAM-01');
      assert.equal(conflict.conflictingClassName, 'Lớp Mầm 1');
    });

    it('returns no conflict when teacher is not assigned to any other class in that year', () => {
      const conflict = checkHomeroomConflict('TCH-009', undefined, '2025-2026', MOCK_CLASSES);
      assert.equal(conflict.hasConflict, false);
    });

    it('does not flag self-conflict when editing the same class', () => {
      const conflict = checkHomeroomConflict('TCH-001', 'cls-mam-01', '2025-2026', MOCK_CLASSES);
      assert.equal(conflict.hasConflict, false);
    });

    it('does not flag conflict for archived or ended classes (da_ket_thuc)', () => {
      const pastClasses = [
        {
          id: 'cls-past',
          schoolCode: 'demo',
          name: 'Lớp Năm Ngoái',
          code: 'PAST-01',
          taxonomy: 'chinh_khoa',
          academicYear: '2025-2026',
          maxCapacity: 30,
          studentCount: 0,
          homeroomTeacherId: 'TCH-001',
          status: 'da_ket_thuc',
          createdAt: '2024-08-15T08:00:00Z',
          updatedAt: '2025-05-30T08:00:00Z',
        },
      ];
      const conflict = checkHomeroomConflict('TCH-001', undefined, '2025-2026', pastClasses);
      assert.equal(conflict.hasConflict, false);
    });
  });

  // BR04: Form Validation Constraints
  describe('BR04: Form Validation Constraints', () => {
    it('rejects empty name and name exceeding 100 characters', () => {
      const emptyNameRes = validateClassForm({ name: '', code: 'CLS-01', maxCapacity: 30, academicYear: '2025-2026' });
      assert.equal(emptyNameRes.isValid, false);
      assert.ok(emptyNameRes.errors.name);

      const longNameRes = validateClassForm({ name: 'A'.repeat(101), code: 'CLS-01', maxCapacity: 30, academicYear: '2025-2026' });
      assert.equal(longNameRes.isValid, false);
      assert.ok(longNameRes.errors.name);
    });

    it('rejects duplicate class code in the same academic year', () => {
      const res = validateClassForm(
        { name: 'Trùng Mã', code: 'MAM-01', maxCapacity: 30, academicYear: '2025-2026', taxonomy: 'chinh_khoa', gradeLevelId: 'grd-mam' },
        MOCK_CLASSES
      );
      assert.equal(res.isValid, false);
      assert.ok(res.errors.code);
      assert.ok(res.errors.code.includes('đã tồn tại'));
    });

    it('enforces capacity between 1 and 60', () => {
      const zeroCap = validateClassForm({ name: 'Lớp Test', code: 'TEST-01', maxCapacity: 0, academicYear: '2025-2026' });
      assert.equal(zeroCap.isValid, false);
      assert.ok(zeroCap.errors.maxCapacity);

      const excessCap = validateClassForm({ name: 'Lớp Test', code: 'TEST-01', maxCapacity: 65, academicYear: '2025-2026' });
      assert.equal(excessCap.isValid, false);
      assert.ok(excessCap.errors.maxCapacity);
    });

    it('requires gradeLevelId for curricular classes but permits omission for extracurricular', () => {
      const curricularNoGrade = validateClassForm({
        name: 'Lớp Mầm Mới',
        code: 'MAM-NEW',
        taxonomy: 'chinh_khoa',
        maxCapacity: 30,
        academicYear: '2025-2026',
      });
      assert.equal(curricularNoGrade.isValid, false);
      assert.ok(curricularNoGrade.errors.gradeLevelId);

      const extracurricularNoGrade = validateClassForm({
        name: 'CLB Cờ Vua',
        code: 'CLB-CHESS-NEW',
        taxonomy: 'ngoai_khoa',
        maxCapacity: 20,
        academicYear: '2025-2026',
      });
      assert.equal(extracurricularNoGrade.isValid, true);
    });
  });

  // BR05: Multi-Factor & Reactive Grade Filtering
  describe('BR05: Multi-Factor & Reactive Grade Filtering', () => {
    it('filters classes by taxonomy correctly', () => {
      const curricular = filterClassesList(MOCK_CLASSES, { searchQuery: '', taxonomy: 'chinh_khoa', academicYear: '2025-2026' });
      assert.ok(curricular.every((c) => c.taxonomy === 'chinh_khoa'));

      const extracurricular = filterClassesList(MOCK_CLASSES, { searchQuery: '', taxonomy: 'ngoai_khoa', academicYear: '2025-2026' });
      assert.ok(extracurricular.every((c) => c.taxonomy === 'ngoai_khoa'));
    });

    it('filters curricular classes by grade level reactively', () => {
      const mamClasses = filterClassesList(MOCK_CLASSES, {
        searchQuery: '',
        taxonomy: 'chinh_khoa',
        gradeLevelId: 'grd-mam',
        academicYear: '2025-2026',
      });
      assert.equal(mamClasses.length, 2); // MAM-01 and MAM-02
      assert.ok(mamClasses.every((c) => c.gradeLevelId === 'grd-mam'));
    });

    it('performs substring search across name, code, room, teacher name', () => {
      const searchByName = filterClassesList(MOCK_CLASSES, { searchQuery: 'bơi lội', academicYear: '2025-2026' });
      assert.equal(searchByName.length, 1);
      assert.equal(searchByName[0].code, 'CLB-SWIM');

      const searchByCode = filterClassesList(MOCK_CLASSES, { searchQuery: 'CHOI', academicYear: '2025-2026' });
      assert.equal(searchByCode.length, 1);
      assert.equal(searchByCode[0].code, 'CHOI-01');

      const searchByTeacher = filterClassesList(MOCK_CLASSES, { searchQuery: 'Nguyễn Thị Mai', academicYear: '2025-2026' });
      assert.equal(searchByTeacher.length, 1);
      assert.equal(searchByTeacher[0].code, 'MAM-01');
    });

    it('filters classes by capacity range', () => {
      const emptyClasses = filterClassesList(MOCK_CLASSES, {
        searchQuery: '',
        academicYear: '2025-2026',
        capacityMax: 0,
      });
      assert.ok(emptyClasses.every((c) => c.studentCount === 0));
      assert.equal(emptyClasses.length, 2); // MAM-02 and CLB-ROBOT
    });
  });

  // BR06: Redux State Machine Mutations
  describe('BR06: Redux State Machine Mutations', () => {
    it('addClass prepends new class with generated ID and studentCount = 0', () => {
      let state = classReducer(undefined, { type: '@@INIT' });
      const initialCount = state.classes.length;

      state = classReducer(
        state,
        addClass({
          name: 'Lớp Lá 2',
          code: 'LA-02',
          taxonomy: 'chinh_khoa',
          gradeLevelId: 'grd-la',
          academicYear: '2025-2026',
          roomNumber: 'P.105',
          maxCapacity: 30,
          status: 'dang_hoat_dong',
        })
      );

      assert.equal(state.classes.length, initialCount + 1);
      const newClass = state.classes[0];
      assert.equal(newClass.name, 'Lớp Lá 2');
      assert.equal(newClass.code, 'LA-02');
      assert.equal(newClass.studentCount, 0);
      assert.equal(newClass.gradeName, 'Khối Lá');
      assert.equal(state.isFormModalOpen, false);
    });

    it('updateClass updates class metadata correctly', () => {
      let state = classReducer(undefined, { type: '@@INIT' });
      state = classReducer(
        state,
        updateClass({
          id: 'cls-mam-01',
          data: {
            name: 'Lớp Mầm 1 (Sửa đổi)',
            roomNumber: 'Phòng VIP 1',
            maxCapacity: 35,
          },
        })
      );

      const updated = state.classes.find((c) => c.id === 'cls-mam-01');
      assert.equal(updated.name, 'Lớp Mầm 1 (Sửa đổi)');
      assert.equal(updated.roomNumber, 'Phòng VIP 1');
      assert.equal(updated.maxCapacity, 35);
      // Preserves existing properties
      assert.equal(updated.code, 'MAM-01');
      assert.equal(updated.studentCount, 24);
    });

    it('changeClassStatus transitions class lifecycle', () => {
      let state = classReducer(undefined, { type: '@@INIT' });
      state = classReducer(
        state,
        changeClassStatus({ id: 'cls-clb-eng', status: 'tam_dung' })
      );

      const target = state.classes.find((c) => c.id === 'cls-clb-eng');
      assert.equal(target.status, 'tam_dung');
    });
  });
});
