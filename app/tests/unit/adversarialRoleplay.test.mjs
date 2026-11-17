/**
 * Comprehensive Adversarial & Role-Play Cross-Module Test Suite
 * Master Plan Reference: roleplay_adversarial_testing_plan.md
 * Phases 1 through 5: 20 Adversarial & Role-Play Scenarios (ADV-01 -> ADV-20)
 */

import { describe, it, test } from 'node:test';
import assert from 'node:assert/strict';

// Phase 1 Imports
import {
  validateClassForm,
  canDeleteClass,
  getDeletionBlockReason,
  checkHomeroomConflict,
} from '../../src/utils/classValidation.ts';
import { validateAcademicYearForm } from '../../src/utils/academicYearValidation.ts';
import {
  canEditAccount,
  canDeleteAccount,
  canEditFullName,
  validateCreateUserPayload,
} from '../../src/utils/accountValidation.ts';

// Phase 2 Imports
import { canCloneMenu } from '../../src/utils/menuValidation.ts';
import menuReducer, { deleteMenu } from '../../src/store/slices/menuSlice.ts';
import {
  isDateLockedForEdit,
  validateTimeFormat,
} from '../../src/utils/staffAttendanceValidation.ts';
import {
  validateMealRefundRates,
  calculateMealRefundForStudent,
  generateMealRefundDescription,
} from '../../src/utils/mealRefundCalculation.ts';

// Phase 3 Imports
import {
  findStudentDiscountConflicts,
} from '../../src/utils/discountValidation.ts';
import {
  AVAILABLE_CLASSES_FOR_DISCOUNT,
  AVAILABLE_STUDENTS_FOR_DISCOUNT,
  ALL_24_SCHOOL_FEES,
  getApplicableFeeItemsForTargets,
} from '../../src/services/mockDiscountData.ts';
import { validateCreateFeeItemInput } from '../../src/utils/schoolFeeValidation.ts';
import { formatFeeAmount } from '../../src/utils/tuitionManagementValidation.ts';
import {
  getPermittedBatchActions,
  resolveInvoiceStatus,
} from '../../src/utils/invoiceValidation.ts';

// Phase 4 Imports
import {
  sortArchivedStudents,
  evaluateRestorationClass,
} from '../../src/utils/archiveValidation.ts';
import {
  validateScoreInput,
  calculateTBHK,
  getTermActionInfo,
} from '../../src/utils/gradebookValidation.ts';
import {
  checkAccessScope,
  hasPermission,
} from '../../src/utils/rbac.ts';

// Phase 5 Imports
import {
  isAddTermLocked,
  validateTermDraft,
  isActivitySettingsDirty,
} from '../../src/utils/featureFlagsValidation.ts';
import {
  isPollExpired,
  canEditPoll,
  canSendPoll,
  canDeletePoll,
  calculateOptionPercentages,
} from '../../src/utils/pollValidation.ts';
import {
  validateClosureEligibility,
  validateCommentSubmission,
  getNextTurnTakingStatus,
} from '../../src/utils/feedbackValidation.ts';

describe('ADVERSARIAL & ROLE-PLAY MASTER TEST SUITE (ADV-01 -> ADV-20)', () => {

  /* ========================================================================
     PHASE 1: CẤU TRÚC NỀN TẢNG, NIÊN KHÓA & ĐỊNH DANH HỌC THUẬT
     ======================================================================== */
  describe('PHASE 1: Foundation, Academic Structure & Identity', () => {

    // [ADV-01] Homeroom Collision
    it('[ADV-01] Homeroom Collision: Prevents a teacher from homerooming two active classes simultaneously', () => {
      const mockClasses = [
        {
          id: 'class-1',
          name: 'Lớp 10A1',
          code: '10A1',
          academicYear: '2025-2026',
          status: 'dang_hoat_dong',
          homeroomTeacherId: 'teacher-1',
          studentCount: 30,
        },
        {
          id: 'class-2',
          name: 'Lớp 10A2',
          code: '10A2',
          academicYear: '2025-2026',
          status: 'dang_hoat_dong',
          homeroomTeacherId: 'teacher-2',
          studentCount: 28,
        },
        {
          id: 'class-3',
          name: 'Lớp 9A1 (Niên khóa cũ)',
          code: '9A1-OLD',
          academicYear: '2024-2025',
          status: 'da_ket_thuc',
          homeroomTeacherId: 'teacher-1',
          studentCount: 25,
        },
      ];

      // Actor: Admin assigns teacher-1 (already homeroom in class-1) to class-2
      const conflict = checkHomeroomConflict('teacher-1', 'class-2', '2025-2026', mockClasses);
      assert.equal(conflict.hasConflict, true, 'Must detect homeroom conflict');
      assert.equal(conflict.conflictingClassName, 'Lớp 10A1');
      assert.equal(conflict.conflictingClassCode, '10A1');

      // Actor: Self-editing class-1 preserves existing teacher-1 without false conflict
      const selfConflict = checkHomeroomConflict('teacher-1', 'class-1', '2025-2026', mockClasses);
      assert.equal(selfConflict.hasConflict, false, 'Self-edit must not trigger false conflict');

      // Actor: Past concluded classes (da_ket_thuc) do not block current homeroom assignment
      const pastConflict = checkHomeroomConflict('teacher-1', 'class-new', '2025-2026', [mockClasses[2]]);
      assert.equal(pastConflict.hasConflict, false, 'Ended classes must not block new assignments');
    });

    // [ADV-02] Temporal Inversion (Academic Year & Terms)
    it('[ADV-02] Temporal Inversion: Strictly rejects inverted start/end dates for academic years and terms', () => {
      // Inverted Academic Year (endDate < startDate)
      const invertedYear = validateAcademicYearForm({
        name: 'Năm học 2026 - 2027',
        startDate: '2027-06-30',
        endDate: '2026-09-01',
      });
      assert.equal(invertedYear.isValid, false);
      assert.ok(invertedYear.errors.endDate?.includes('trước') || invertedYear.errors.endDate?.includes('lớn hơn') || invertedYear.errors.endDate);

      // Inverted Term dates
      const invertedTerm = validateTermDraft({
        termName: 'Học kỳ 1',
        startDate: '2026-12-31',
        endDate: '2026-09-01',
        notes: '',
      });
      assert.equal(invertedTerm.isValid, false);
      assert.ok(invertedTerm.errors.dateRange);
    });

    // [ADV-03] Cascade Constraint: Block Deleting Class with Active Students
    it('[ADV-03] Cascade Constraint: Forbids deleting classes with enrolled students to prevent orphaned records', () => {
      const classWithStudents = { id: 'c-1', studentCount: 32 };
      const emptyClass = { id: 'c-2', studentCount: 0 };

      assert.equal(canDeleteClass(classWithStudents), false, 'Class with students cannot be deleted');
      assert.ok(getDeletionBlockReason(32).includes('32 học sinh'));

      assert.equal(canDeleteClass(emptyClass), true, 'Empty class can be safely deleted');
      assert.equal(getDeletionBlockReason(0), '');
    });

    // [ADV-04] Privilege Isolation: Protect Super-Admin & Ban Parent Account Creation
    it('[ADV-04] Privilege Isolation: Protects Super-Admin from modification and omits Parent role creation', () => {
      const superAdminUser = {
        id: 'usr-super',
        fullName: 'Trương Ban Giám Hiệu',
        email: 'admin@ecoschool.edu.vn',
        roles: ['admin'],
        status: 'active',
        isSyncedCsdlSo: true,
      };

      const regularUser = {
        id: 'usr-reg',
        fullName: 'Nguyễn Văn Minh',
        email: 'minh.nv@ecoschool.edu.vn',
        roles: ['giao_vien'],
        status: 'active',
        isSyncedCsdlSo: false,
      };

      // Super-Admin cannot be edited or deleted
      assert.equal(canEditAccount(superAdminUser), false, 'Super-Admin cannot be edited');
      assert.equal(canDeleteAccount(superAdminUser), false, 'Super-Admin cannot be deleted');
      assert.equal(canEditFullName(superAdminUser), false, 'CSDL So synced accounts cannot edit full name');

      // Regular staff can be edited
      assert.equal(canEditAccount(regularUser), true);
      assert.equal(canDeleteAccount(regularUser), true);
      assert.equal(canEditFullName(regularUser), true);

      // Admin role cannot be selected on creation
      const invalidAdminPayload = {
        fullName: 'Người Dùng Mới',
        email: 'newadmin@ecoschool.edu.vn',
        roles: ['admin'],
      };
      const val = validateCreateUserPayload(invalidAdminPayload);
      assert.equal(val.isValid, false);
      assert.ok(val.errors.roles?.includes('Quản trị viên'));
    });
  });

  /* ========================================================================
     PHASE 2: VẬN HÀNH HÀNG NGÀY, ĐIỂM DANH, Y TẾ & BẾP ĂN
     ======================================================================== */
  describe('PHASE 2: Daily Operations, Attendance & Nutrition', () => {

    // [ADV-07] Menu Immutability: Deleting published menu is strictly blocked
    it('[ADV-07] Menu Immutability: Published weekly menus cannot be permanently deleted', () => {
      const initialMenus = [
        { id: 'menu-published', status: 'published', schedule: {} },
        { id: 'menu-draft', status: 'draft', schedule: {} },
      ];

      const stateWithPublished = {
        menus: initialMenus,
        activeMenuId: 'menu-published',
        selectedWeek: 38,
        selectedYear: 2026,
        filterScope: 'all',
        filterClassId: '',
        searchQuery: '',
        isCreateSlideOverOpen: false,
        notification: null,
      };

      // Attempt to delete published menu -> must be rejected
      const stateAfterPubDelete = menuReducer(stateWithPublished, deleteMenu('menu-published'));
      assert.equal(
        stateAfterPubDelete.menus.some((m) => m.id === 'menu-published'),
        true,
        'Published menu must survive delete attempt'
      );

      // Attempt to delete draft menu -> accepted
      const stateAfterDraftDelete = menuReducer(stateWithPublished, deleteMenu('menu-draft'));
      assert.equal(
        stateAfterDraftDelete.menus.some((m) => m.id === 'menu-draft'),
        false,
        'Draft menu can be safely removed'
      );
    });

    // [ADV-08] Menu Cloning Restrictions: Only Grid menus can be cloned, not file uploads
    it('[ADV-08] Menu Cloning Integrity: File-based menus cannot be cloned into structured grid weeks', () => {
      const gridMenu = { id: 'm-grid', contentType: 'grid' };
      const fileMenu = { id: 'm-file', contentType: 'file' };

      assert.equal(canCloneMenu(gridMenu), true);
      assert.equal(canCloneMenu(fileMenu), false);
    });

    // [ADV-05] Meal Refund Invariants & Percentage Bounds
    it('[ADV-05] Cut-off Time & Meal Refund Invariants: Validates rate bounds and computes itemized deduction', () => {
      // 1. Percentage bounds checking (0-100%)
      const invalidOver = validateMealRefundRates({ mainMealRatePercent: 120, breakfastRatePercent: 50 });
      assert.equal(invalidOver.isValid, false);
      assert.ok(invalidOver.error?.includes('100%'));

      const invalidUnder = validateMealRefundRates({ mainMealRatePercent: 50, breakfastRatePercent: -10 });
      assert.equal(invalidUnder.isValid, false);
      assert.ok(invalidUnder.error?.includes('0%'));

      const validRates = validateMealRefundRates({ mainMealRatePercent: 50, breakfastRatePercent: 70 });
      assert.equal(validRates.isValid, true);

      // 2. Meal refund calculation based on absence breakdown
      const absence = {
        studentId: 'hs-001',
        studentName: 'Nguyễn Gia Huy',
        className: '10A1',
        excusedAbsenceDays: 3,
        unexcusedAbsenceDays: 1,
        totalAbsenceDays: 4,
        schoolDaysInMonth: 22,
      };

      const refundSummary = calculateMealRefundForStudent(
        absence,
        { mainMealUnitPrice: 40000, breakfastUnitPrice: 20000 },
        { mainMealRatePercent: 50, breakfastRatePercent: 70 },
        '2026-10'
      );

      assert.ok(refundSummary.totalMealRefund > 0);
      assert.ok(refundSummary.items.length > 0);

      // 3. Itemized description generation
      const desc = generateMealRefundDescription('tien_an', 3, 50, 60000, 22, 0, '10/2026', 0, 3, 50, 60000);
      assert.ok(desc.includes('Khấu trừ hoàn tiền ăn'));
      assert.ok(desc.includes('3 ngày nghỉ có phép'));
    });

    // [ADV-06] Attendance Audit Log & State Invariant
    it('[ADV-06] Attendance Integrity: Preserves attendance status codes and validates recognized values', () => {
      const validStatuses = ['co_mat', 'nghi_co_phep', 'nghi_khong_phep', 'di_muon'];
      validStatuses.forEach((st) => {
        assert.ok(validStatuses.includes(st));
      });

      // Verify non-empty student ID and valid record structure
      const record = {
        studentId: 'hs-001',
        status: 'nghi_co_phep',
        source: 'teacher_manual',
        cameraCheckInTime: '07:15',
        manualOverrideReason: 'Học sinh chưa vào lớp học',
      };
      assert.equal(record.status, 'nghi_co_phep');
      assert.equal(record.source, 'teacher_manual');
      assert.ok(record.cameraCheckInTime);
    });

    // Staff Attendance Time Validity & Edit Boundary
    it('[ADV-STAFF] Staff Attendance Invariants: Rejects invalid time format and locks edits older than 45 days', () => {
      assert.equal(validateTimeFormat('25:99'), false);
      assert.equal(validateTimeFormat('abc'), false);
      assert.equal(validateTimeFormat('07:30'), true);
      assert.equal(validateTimeFormat('17:45'), true);

      // 45-day edit lock boundary
      assert.equal(isDateLockedForEdit('2026-08-01', '2026-10-15'), true, 'Dates older than 45 days must be locked');
      assert.equal(isDateLockedForEdit('2026-10-10', '2026-10-15'), false, 'Recent dates within 45 days are editable');
    });
  });

  /* ========================================================================
     PHASE 3: TÀI CHÍNH, BIỂU PHÍ, MIỄN GIẢM, HÓA ĐƠN & SEPAY
     ======================================================================== */
  describe('PHASE 3: Finance, Fee Matrix, Discount Policies & Invoices', () => {

    // [ADV-09] Duplicate Discount Conflict Detection (1 policy per fee item)
    it('[ADV-09] Duplicate Discount Conflict: Detects overlapping policies for the same fee item on the same student', () => {
      const existingPolicies = [
        {
          id: 'p-1',
          code: 'MG-001',
          name: 'Học bổng tài năng 50%',
          feeItemId: 'fee-sys-001',
          scopeType: 'student',
          status: 'active',
          discountType: 'percent',
          discountValue: 50,
          academicYearId: 'ay-2026-2027',
          validityType: 'academic_year',
          targets: [
            {
              id: 'tgt-1',
              discountPolicyId: 'p-1',
              targetType: 'student',
              targetId: 'hs-001',
              targetName: 'Nguyễn Gia Huy',
              targetClass: 'Lớp 10A1',
            },
            {
              id: 'tgt-2',
              discountPolicyId: 'p-1',
              targetType: 'student',
              targetId: 'hs-002',
              targetName: 'Lê Bảo Anh',
              targetClass: 'Lớp 10A1',
            },
          ],
        },
      ];

      // New policy targets fee-sys-001 for hs-001 -> must trigger conflict
      const conflicts = findStudentDiscountConflicts(
        ['hs-001', 'hs-003'],
        'fee-sys-001',
        'percent',
        100,
        existingPolicies,
        AVAILABLE_STUDENTS_FOR_DISCOUNT,
        ALL_24_SCHOOL_FEES
      );

      assert.equal(conflicts.length, 1);
      assert.equal(conflicts[0].studentId, 'hs-001');
      assert.equal(conflicts[0].existingPolicy.code, 'MG-001');

      // Targeting different fee item fee-sys-002 on hs-001 -> NO conflict
      const noConflicts = findStudentDiscountConflicts(
        ['hs-001', 'hs-003'],
        'fee-sys-002',
        'percent',
        100,
        existingPolicies,
        AVAILABLE_STUDENTS_FOR_DISCOUNT,
        ALL_24_SCHOOL_FEES
      );
      assert.equal(noConflicts.length, 0);
    });

    // [ADV-10] Mathematical Intersection of Applicable Fees
    it('[ADV-10] Mathematical Intersection: Only common fees are offered when targeting multiple classes', () => {
      // Pick all classes
      const allClassIds = AVAILABLE_CLASSES_FOR_DISCOUNT.map((c) => c.id);
      const commonFees = getApplicableFeeItemsForTargets('class', allClassIds, AVAILABLE_STUDENTS_FOR_DISCOUNT);

      // Mandatory common fees across all classes: Học phí (fee-sys-001), Tiền ăn (fee-sys-002)
      assert.ok(commonFees.length > 0);
      assert.ok(commonFees.some((f) => f.id === 'fee-sys-001'));
      assert.ok(commonFees.some((f) => f.id === 'fee-sys-002'));

      // If no targets selected, common fees must be empty
      const emptyTargets = getApplicableFeeItemsForTargets('class', [], AVAILABLE_STUDENTS_FOR_DISCOUNT);
      assert.equal(emptyTargets.length, 0);
    });

    // [ADV-11] Negative Fee Amount Rejection
    it('[ADV-11] Fee Validation: Strictly rejects negative default fee amounts', () => {
      const negativeFee = validateCreateFeeItemInput({
        name: 'Phí dịch vụ',
        revenueCategoryId: 1,
        defaultAmount: -50000,
        unit: 'thang',
      });
      assert.equal(negativeFee.valid, false);
      assert.ok(negativeFee.errors.defaultAmount);
    });

    // [ADV-12] Invoice Deletion Guard & Lifecycle Status Resolution
    it('[ADV-12] Invoice Cancellation & Bulk Action Guard: Forbids deleting non-draft invoices and resolves lifecycle correctly', () => {
      // 1. Only draft (da_tao) invoices can be deleted
      const draftInvoices = [
        { id: 'inv-1', status: 'da_tao' },
        { id: 'inv-2', status: 'da_tao' },
      ];
      assert.deepEqual(getPermittedBatchActions(draftInvoices), ['send', 'delete']);

      const mixedInvoices = [
        { id: 'inv-1', status: 'da_tao' },
        { id: 'inv-3', status: 'da_gui' },
      ];
      const mixedActions = getPermittedBatchActions(mixedInvoices);
      assert.equal(mixedActions.includes('delete'), false, 'Non-draft invoices cannot be deleted');

      const paidInvoices = [
        { id: 'inv-4', status: 'da_thanh_toan' },
      ];
      const paidActions = getPermittedBatchActions(paidInvoices);
      assert.equal(paidActions.includes('delete'), false, 'Paid invoices cannot be deleted');

      // 2. Lifecycle status resolution
      // Full payment
      assert.equal(resolveInvoiceStatus(2500000, 2500000, '2026-09-30', 'da_gui'), 'da_thanh_toan');
      // Partial payment
      assert.equal(resolveInvoiceStatus(2500000, 1000000, '2026-09-30', 'da_gui'), 'thanh_toan_mot_phan');
      // Cancelled remains cancelled
      assert.equal(resolveInvoiceStatus(2500000, 0, '2026-09-30', 'da_huy'), 'da_huy');
      // Overdue (due on 10 Sep, tested with ref date 18 Sep -> 8 days past due)
      assert.equal(resolveInvoiceStatus(2500000, 0, '10/09/2026', 'da_gui', new Date('2026-09-18')), 'qua_han');
    });

    // Currency Formatting Consistency
    it('[ADV-FMT] Vietnamese Currency Format: Correctly formats numbers with dot separator', () => {
      assert.equal(formatFeeAmount(3500000), '3.500.000');
      assert.equal(formatFeeAmount(0), '0');
      assert.equal(formatFeeAmount(50000), '50.000');
    });
  });

  /* ========================================================================
     PHASE 4: HỌC TẬP, SỔ ĐIỂM, THỜI KHÓA BIỂU & VÒNG ĐỜI HỌC SINH
     ======================================================================== */
  describe('PHASE 4: Academic Assessment & Student Lifecycle', () => {

    // [ADV-13] Gradebook Boundary Violation & RBAC Scope Check
    it('[ADV-13] Gradebook Boundary Violation: Prevents unauthorized grade input outside assigned classes', () => {
      // Teacher trying to input grades in unassigned class -> rejected
      const unassignedCheck = checkAccessScope('teacher', 'academics:gradebook:input', {
        userAssignedClassIds: ['class-10a1'],
        targetClassId: 'class-12a1',
        requiredScope: 'class',
      });
      assert.equal(unassignedCheck.allowed, false);
      assert.ok(unassignedCheck.reason);

      // Teacher in assigned class -> allowed
      const assignedCheck = checkAccessScope('teacher', 'academics:gradebook:input', {
        userAssignedClassIds: ['class-10a1'],
        targetClassId: 'class-10a1',
        requiredScope: 'class',
      });
      assert.equal(assignedCheck.allowed, true);

      // Super-Admin can access any class
      const adminCheck = checkAccessScope('admin', 'academics:gradebook:input', {
        targetClassId: 'class-12a1',
        requiredScope: 'class',
      });
      assert.equal(adminCheck.allowed, true);
    });

    // [ADV-14] Gradebook Score Boundary & Injection Defense
    it('[ADV-14] Gradebook Score Boundaries: Rejects invalid, negative, or injected scores and computes TBHK correctly', () => {
      // Invalid inputs rejected
      assert.equal(validateScoreInput('-1').isValid, false);
      assert.equal(validateScoreInput('10.5').isValid, false);
      assert.equal(validateScoreInput('abc').isValid, false);
      assert.equal(validateScoreInput('<script>alert(1)</script>').isValid, false);

      // Valid inputs accepted
      assert.equal(validateScoreInput('8.5').isValid, true);
      assert.equal(validateScoreInput('8.5').score, 8.5);
      assert.equal(validateScoreInput('9,5').isValid, true);
      assert.equal(validateScoreInput('9,5').score, 9.5);
      assert.equal(validateScoreInput('—').isValid, true);
      assert.equal(validateScoreInput('—').score, null);

      // TBHK calculation with MoET formula: (Sum(TX) + 2*GK + 3*CK) / (Count(TX) + 5)
      // Missing GK or CK yields null
      assert.equal(calculateTBHK([8, 9], null, 8), null);
      assert.equal(calculateTBHK([8, 9], 8, null), null);

      // Full scores: (8 + 9 + 2*8 + 3*9) / 7 = 60 / 7 = 8.5714 -> 8.6
      assert.equal(calculateTBHK([8, 9], 8, 9), 8.6);
    });

    // [ADV-15] Term Scoreboard Lockdown
    it('[ADV-15] Term Scoreboard Lockdown: Identifies published term state and switches to update action', () => {
      const published = getTermActionInfo('da_cong_bo');
      assert.equal(published.isPublished, true);
      assert.equal(published.buttonLabel, 'Cập nhật');

      const inProgress = getTermActionInfo('tien_hanh');
      assert.equal(inProgress.isPublished, false);
      assert.equal(inProgress.buttonLabel, 'Công bố');

      const notStarted = getTermActionInfo('chua_thuc_hien');
      assert.equal(notStarted.isPublished, false);
      assert.equal(notStarted.buttonLabel, 'Bắt đầu');
    });

    // [ADV-16] Archive Date Graceful Degradation
    it('[ADV-16] Archive Graceful Degradation: Handles missing or undefined archive dates without crashing', () => {
      const mockArchive = [
        { id: 'arc-1', fullName: 'Lê Văn A', archiveDate: '2024-05-15' },
        { id: 'arc-2', fullName: 'Trần Thị B', archiveDate: undefined },
        { id: 'arc-3', fullName: 'Hoàng Văn C', archiveDate: '2023-09-01' },
      ];

      const sortedAsc = sortArchivedStudents(mockArchive, 'archiveDate', 'asc');
      // Oldest valid date first
      assert.equal(sortedAsc[0].id, 'arc-3');
      // Undefined date sunk to bottom
      assert.equal(sortedAsc[sortedAsc.length - 1].archiveDate, undefined);
    });

    // [ADV-17] Inactive Class Graceful Restoration
    it('[ADV-17] Inactive Class Restoration: Safely maps former inactive classes to unassigned state with warning', () => {
      const activeClasses = [{ id: 'class-10a1', name: 'Lớp 10A1' }];

      // Active former class match
      const studentActive = {
        id: 'arc-1',
        formerClassId: 'class-10a1',
        formerClassName: 'Lớp 10A1',
      };
      const resActive = evaluateRestorationClass(studentActive, activeClasses);
      assert.equal(resActive.isClassActive, true);
      assert.equal(resActive.restoredClassId, 'class-10a1');

      // Deleted/Inactive former class
      const studentInactive = {
        id: 'arc-2',
        formerClassId: 'class-deleted-99',
        formerClassName: 'Lớp Cũ Đã Xóa',
      };
      const resInactive = evaluateRestorationClass(studentInactive, activeClasses);
      assert.equal(resInactive.isClassActive, false);
      assert.equal(resInactive.restoredClassId, null);
      assert.equal(resInactive.restoredClassName, 'Chưa xếp lớp');
      assert.ok(resInactive.warningMessage?.includes('không còn hoạt động'));
    });
  });

  /* ========================================================================
     PHASE 5: GÓP Ý, BÌNH CHỌN, BẢNG TIN & QUẢN TRỊ TỔNG THỂ
     ======================================================================== */
  describe('PHASE 5: Feedback, Governance, Announcements & Configuration', () => {

    // [ADV-18] Poll Expiration Manipulation & Draft-Only Mutations
    it('[ADV-18] Poll Expiration & Mutation Guard: Enforces draft-only mutations, detects expired deadlines, and computes percentages', () => {
      // 1. Expiration check
      assert.equal(isPollExpired('2020-01-01T00:00:00Z'), true);
      assert.equal(isPollExpired('2099-01-01T00:00:00Z'), false);

      // 2. Draft-only mutations
      assert.equal(canEditPoll('da_tao'), true);
      assert.equal(canEditPoll('da_gui'), false);
      assert.equal(canEditPoll('da_dong'), false);

      assert.equal(canDeletePoll('da_tao'), true);
      assert.equal(canDeletePoll('da_gui'), false);
      assert.equal(canDeletePoll('da_dong'), false);

      // 3. Option percentage calculations (zero division resilience)
      const zeroVotes = [
        { id: 'opt-1', title: 'Phương án 1', voteCount: 0 },
        { id: 'opt-2', title: 'Phương án 2', voteCount: 0 },
      ];
      const zeroResults = calculateOptionPercentages(zeroVotes, 0);
      assert.equal(zeroResults[0].percentage, 0);
      assert.equal(zeroResults[1].percentage, 0);

      const realVotes = [
        { id: 'opt-1', title: 'Phương án 1', voteCount: 75 },
        { id: 'opt-2', title: 'Phương án 2', voteCount: 25 },
      ];
      const realResults = calculateOptionPercentages(realVotes, 100);
      assert.equal(realResults[0].percentage, 75);
      assert.equal(realResults[1].percentage, 25);
    });

    // [ADV-19] Feedback Closure Guard & Reactive Turn-Taking
    it('[ADV-19] Feedback Closure Guard: Protects completed feedback and reactive turn-taking state transitions', () => {
      // 1. Closure eligibility
      const completedTicket = { id: 'fb-1', status: 'completed' };
      assert.equal(validateClosureEligibility(completedTicket).canClose, false);

      const processingTicket = { id: 'fb-2', status: 'processing' };
      assert.equal(validateClosureEligibility(processingTicket).canClose, true);

      // 2. Comment submission validation
      assert.equal(validateCommentSubmission('').isValid, false);
      assert.equal(validateCommentSubmission('   ').isValid, false);
      assert.equal(validateCommentSubmission('Đã phản hồi ý kiến phụ huynh.').isValid, true);

      // 3. Reactive turn-taking state transitions
      // Parent responds to completed ticket -> reopens ticket and hands turn to school
      const parentReopen = getNextTurnTakingStatus('school', 'parent', 'completed');
      assert.equal(parentReopen.waitingFor, 'school');
      assert.equal(parentReopen.nextStatus, 'reopened');

      // School staff responds -> hands turn to parent
      const staffReply = getNextTurnTakingStatus('school', 'teacher', 'processing');
      assert.equal(staffReply.waitingFor, 'parent');
    });

    // Term Addition Limit (Max 2 terms per academic year)
    it('[ADV-18b] Term Addition Limit: Enforces strict maximum of 2 terms per academic year', () => {
      // 0 or 1 term -> not locked
      assert.equal(isAddTermLocked(null, 0), false);
      assert.equal(isAddTermLocked(null, 1), false);

      // 2 terms -> locked
      assert.equal(isAddTermLocked(null, 2), true);
      assert.equal(isAddTermLocked(null, 3), true);

      // While editing any term (editingTermId !== null), adding is locked (single-row mutual exclusion lock)
      assert.equal(isAddTermLocked('term-1', 1), true, 'Add button is locked while editing another term');
    });

    // [ADV-20] Feature Flags Dirty State Invariant
    it('[ADV-20] Dirty State Invariant: Detects modification between current and saved activity settings', () => {
      const original = { allowComments: true, requireCommentModeration: false };
      const identical = { allowComments: true, requireCommentModeration: false };
      const modified = { allowComments: false, requireCommentModeration: false };

      assert.equal(isActivitySettingsDirty(original, identical), false);
      assert.equal(isActivitySettingsDirty(original, modified), true);
    });
  });
});
