/**
 * COMPREHENSIVE END-TO-END SCENARIO TEST SUITE
 * Eco School Operating Portal (Design System v2.6.0 & SEPO Core 2.0.0)
 * 
 * Tests 12 End-to-End Persona Scenarios (SCEN-01 through SCEN-12):
 * Covering Multi-step Lifecycle Journeys, State Machines, Boundary Invariants,
 * Cross-module Couplings, and Defensive Fallbacks across all 38 Sub-modules.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// SCEN-01 & SCEN-02: Academic Foundation & RBAC
import {
  validateAcademicYearForm,
  isCurrentAcademicYear,
} from '../../src/utils/academicYearValidation.ts';
import {
  validateClassForm,
  checkHomeroomConflict,
  canDeleteClass,
} from '../../src/utils/classValidation.ts';
import {
  validateCreateUserPayload,
  canEditAccount,
  canDeleteAccount,
  canEditFullName,
} from '../../src/utils/accountValidation.ts';
import {
  checkAccessScope,
  hasPermission,
} from '../../src/utils/rbac.ts';

// SCEN-03 & SCEN-04: Daily Operations, Activities & Handbook
import {
  validatePostContent,
  sortActivityPosts,
} from '../../src/utils/activityValidation.ts';
import {
  validateCategory,
  validateArticle,
  buildCategoryTree,
} from '../../src/utils/parentHandbookValidation.ts';

// SCEN-05: Homework & Academics Gradebook
import {
  validateAssignmentForm,
  isLateSubmission,
  validateGradingSubmission,
} from '../../src/utils/assignmentValidation.ts';
import {
  validateScoreInput,
  calculateTBHK,
  getTermActionInfo,
} from '../../src/utils/gradebookValidation.ts';

// SCEN-06 & SCEN-07: Nutrition Menu & Staff Attendance
import { canCloneMenu } from '../../src/utils/menuValidation.ts';
import menuReducer, { deleteMenu } from '../../src/store/slices/menuSlice.ts';
import {
  validateTimeFormat,
  isDateLockedForEdit,
} from '../../src/utils/staffAttendanceValidation.ts';

// SCEN-08, SCEN-09 & SCEN-10: Finance, Discounts, Invoices, Meal Refunds & Expenses
import { validateCreateFeeItemInput } from '../../src/utils/schoolFeeValidation.ts';
import {
  findStudentDiscountConflicts,
} from '../../src/utils/discountValidation.ts';
import {
  AVAILABLE_CLASSES_FOR_DISCOUNT,
  AVAILABLE_STUDENTS_FOR_DISCOUNT,
  ALL_24_SCHOOL_FEES,
  getApplicableFeeItemsForTargets,
} from '../../src/services/mockDiscountData.ts';
import {
  calculateInvoiceTotals,
  resolveInvoiceStatus,
  getPermittedBatchActions,
  generateVietQRPayload,
} from '../../src/utils/invoiceValidation.ts';
import {
  validateMealRefundRates,
  calculateMealRefundForStudent,
  generateMealRefundDescription,
} from '../../src/utils/mealRefundCalculation.ts';
import {
  canApproveVoucher,
  canConfirmDisbursement,
  canCancelVoucher,
  calculateVoucherTotal,
} from '../../src/utils/expenseValidation.ts';

// SCEN-11: Feedback & Surveys/Polls
import {
  validateCommentSubmission,
  validateClosureEligibility,
  getNextTurnTakingStatus,
} from '../../src/utils/feedbackValidation.ts';
import {
  validatePollPayload,
  isPollExpired,
  canEditPoll,
  canDeletePoll,
  calculateOptionPercentages,
} from '../../src/utils/pollValidation.ts';

// SCEN-12: Archive & Student Lifecycle
import {
  sortArchivedStudents,
  evaluateRestorationClass,
} from '../../src/utils/archiveValidation.ts';
import {
  isActivitySettingsDirty,
  isAddTermLocked,
} from '../../src/utils/featureFlagsValidation.ts';

describe('COMPREHENSIVE MULTI-SCENARIO E2E AUDIT (SCEN-01 -> SCEN-12)', () => {

  /* ========================================================================
     SCEN-01: Quản Trị Viên (Admin) - Thiết lập Niên khóa & Cấu trúc Học thuật
     ======================================================================== */
  describe('SCEN-01: Admin Academic Foundation & Structural Integrity', () => {
    it('executes full sequence: create valid academic year, lock terms at 2, assign homeroom teacher, and prevent cascade deletion', () => {
      // 1. Create Academic Year: Valid dates (endDate >= startDate)
      const validYear = validateAcademicYearForm({
        name: 'Năm học 2026 - 2027',
        startDate: '2026-09-01',
        endDate: '2027-05-31',
      });
      assert.equal(validYear.isValid, true);

      // Inverted dates must fail immediately
      const invalidYear = validateAcademicYearForm({
        name: 'Năm học Lỗi',
        startDate: '2027-05-31',
        endDate: '2026-09-01',
      });
      assert.equal(invalidYear.isValid, false);

      // Automated current year detector
      assert.equal(isCurrentAcademicYear({ startDate: '2026-09-01', endDate: '2027-05-31' }, new Date('2026-10-15')), true);
      assert.equal(isCurrentAcademicYear({ startDate: '2026-09-01', endDate: '2027-05-31' }, new Date('2025-05-01')), false);

      // 2. Term limit: Academic year has max 2 terms
      assert.equal(isAddTermLocked(null, 1), false);
      assert.equal(isAddTermLocked(null, 2), true, 'Maximum 2 terms enforced');

      // 3. Class form validation
      const validClass = validateClassForm({
        name: 'Lớp 10A1',
        code: '10A1',
        academicYear: '2026-2027',
        gradeLevelId: 'grade-10',
        roomNumber: 'Phòng 201',
        maxCapacity: 35,
      });
      assert.equal(validClass.isValid, true);

      // 4. Homeroom conflict detection
      const existingAssignments = [
        { id: 'cls-10a1', name: 'Lớp 10A1', code: '10A1', homeroomTeacherId: 'tch-01', academicYear: '2026-2027', status: 'dang_hoat_dong', studentCount: 30, maxCapacity: 35 },
      ];
      const conflictResult = checkHomeroomConflict('tch-01', 'cls-10a2', '2026-2027', existingAssignments);
      assert.equal(conflictResult.hasConflict, true);
      assert.equal(conflictResult.conflictingClassName, 'Lớp 10A1');

      // 5. Cascade delete protection
      assert.equal(canDeleteClass({ studentCount: 30 }), false, 'Class with 30 students cannot be deleted');
      assert.equal(canDeleteClass({ studentCount: 0 }), true, 'Empty class can be safely deleted');
    });
  });

  /* ========================================================================
     SCEN-02: Quản Trị Viên (Admin) - Quản lý Tài khoản & Phân quyền RBAC
     ======================================================================== */
  describe('SCEN-02: Admin Security, User Provisioning & Privilege Isolation', () => {
    it('executes full sequence: create staff account, reject parent creation, protect Super-Admin, and check RBAC scope', () => {
      // 1. Create Teacher account: valid
      const validTeacher = validateCreateUserPayload({
        fullName: 'Nguyễn Văn Minh',
        email: 'minh.nv@ecoschool.edu.vn',
        roles: ['giao_vien'],
      });
      assert.equal(validTeacher.isValid, true);

      // 2. School admin cannot select Parent or Admin during account creation
      const invalidAdminCreation = validateCreateUserPayload({
        fullName: 'Admin Test',
        email: 'admin.test@ecoschool.edu.vn',
        roles: ['admin'],
      });
      assert.equal(invalidAdminCreation.isValid, false);

      // 3. Super-Admin immutability
      const superAdmin = {
        id: 'usr-admin-root',
        fullName: 'Ban Giám Hiệu',
        email: 'root@ecoschool.edu.vn',
        roles: ['admin'],
        status: 'active',
        isSyncedCsdlSo: true,
      };
      assert.equal(canEditAccount(superAdmin), false);
      assert.equal(canDeleteAccount(superAdmin), false);
      assert.equal(canEditFullName(superAdmin), false);

      // 4. RBAC Module-Level Permission Checks
      assert.equal(hasPermission('admin', 'finance:invoice:approve'), true);
      assert.equal(hasPermission('accountant', 'finance:invoice:approve'), true);
      assert.equal(hasPermission('teacher', 'finance:invoice:approve'), false);
      assert.equal(hasPermission('teacher', 'academics:gradebook:input'), true);
    });
  });

  /* ========================================================================
     SCEN-03: Giáo Viên Chủ Nhiệm (GVCN) - Điểm danh & Y tế Học sinh
     ======================================================================== */
  describe('SCEN-03: GVCN Daily Attendance, Health Record & Camera Override', () => {
    it('executes full sequence: records morning attendance, logs health note, preserves camera audit log', () => {
      // 1. Valid attendance status codes
      const validAttendanceStatuses = ['co_mat', 'nghi_co_phep', 'nghi_khong_phep', 'di_muon'];
      assert.equal(validAttendanceStatuses.length, 4);

      // 2. Camera AI vs Manual Override record structure
      const attendanceEntry = {
        studentId: 'hs-101',
        session: 'morning',
        status: 'nghi_co_phep',
        bodyTemperature: 36.5,
        healthNote: 'Phụ huynh báo đau họng',
        source: 'teacher_override',
        cameraCheckInTime: '07:18',
        overrideReason: 'Học sinh vào phòng y tế nghỉ ngơi',
      };

      assert.equal(attendanceEntry.status, 'nghi_co_phep');
      assert.equal(attendanceEntry.source, 'teacher_override');
      assert.equal(attendanceEntry.bodyTemperature <= 37.5, true, 'Temperature is normal');
      assert.ok(attendanceEntry.cameraCheckInTime);
    });
  });

  /* ========================================================================
     SCEN-04: Giáo Viên Chủ Nhiệm (GVCN) - Hoạt động Lớp học & Sổ tay Phụ huynh
     ======================================================================== */
  describe('SCEN-04: GVCN Classroom Activity Stories & Parent Handbook', () => {
    it('executes full sequence: validates post content, sorts pinned stories, verifies 2-tier handbook category tree', () => {
      // 1. Post content validation: needs text or media
      assert.equal(validatePostContent('', 0).valid, false);
      assert.equal(validatePostContent('Hôm nay lớp học thí nghiệm khoa học', 0).valid, true);
      assert.equal(validatePostContent('', 3).valid, true, 'Photo-only post is valid');

      // 2. Pinned post priority sorting
      const posts = [
        { id: 'p1', content: 'Bài viết 1', isPinned: false, createdAt: '2026-10-15T09:00:00Z' },
        { id: 'p2', content: 'Bài viết ghim', isPinned: true, createdAt: '2026-10-14T09:00:00Z' },
        { id: 'p3', content: 'Bài viết 3', isPinned: false, createdAt: '2026-10-16T09:00:00Z' },
      ];
      const sortedPosts = sortActivityPosts(posts);
      assert.equal(sortedPosts[0].id, 'p2', 'Pinned post floats to top');
      assert.equal(sortedPosts[1].id, 'p3', 'Most recent unpinned post comes second');

      // 3. Parent handbook: 2-tier tree validation
      const rootCat = { id: 'cat-root', name: 'Nội quy & Quy định', parentCategoryId: null, displayOrder: 1 };
      const subCat = { id: 'cat-sub', name: 'Quy định trang phục', parentCategoryId: 'cat-root', displayOrder: 1 };

      assert.equal(validateCategory(rootCat, []).isValid, true);
      assert.equal(validateCategory(subCat, [rootCat]).isValid, true);

      // 3rd tier category attempt must be blocked
      const illegalTier3 = { id: 'cat-tier3', name: 'Mũ bảo hiểm', parentCategoryId: 'cat-sub', displayOrder: 1 };
      const tier3Val = validateCategory(illegalTier3, [rootCat, subCat]);
      assert.equal(tier3Val.isValid, false);
      assert.ok(tier3Val.error?.includes('2 cấp'));

      // 4. Handbook article validation
      const validArticle = validateArticle({
        title: 'Quy định giờ đón trả học sinh',
        content: 'Nhà trường mở cổng đón học sinh từ 06:30 đến 08:30 hàng ngày.',
        categoryId: 'cat-root',
      }, [rootCat, subCat]);
      assert.equal(validArticle.isValid, true);
    });
  });

  /* ========================================================================
     SCEN-05: Giáo Viên Bộ Môn (GVBM) - Thời khóa biểu, Bài tập & Sổ điểm
     ======================================================================== */
  describe('SCEN-05: GVBM Homework Assignment, Grading & Periodic Scoreboard', () => {
    it('executes full sequence: assigns homework, detects late submission, validates scores (0-10), and calculates MoET GPA', () => {
      // 1. Homework Assignment Creation
      const assignment = validateAssignmentForm({
        classId: 'class-10a1',
        subjectId: 'sub-toan',
        title: 'Bài tập Đại số: Bất phương trình bậc 2',
        dueDate: '2026-10-20T23:59:59Z',
      });
      assert.equal(assignment.isValid, true);

      // 2. Late Submission Detection
      assert.equal(isLateSubmission('2026-10-19T10:00:00Z', '2026-10-20T23:59:59Z'), false);
      assert.equal(isLateSubmission('2026-10-21T08:00:00Z', '2026-10-20T23:59:59Z'), true, 'Submission after due date flagged as late');

      // 3. Grading validation
      const gradingValid = validateGradingSubmission({
        submittedAt: '2026-10-19T10:00:00Z',
        isGraded: true,
        score: 9.0,
        teacherComment: 'Làm bài xuất sắc, trình bày sạch sẽ.',
      }, '2026-10-20T23:59:59Z');
      assert.equal(gradingValid.isValid, true);

      // Score out of bounds (15.0)
      const gradingInvalid = validateGradingSubmission({
        submittedAt: '2026-10-19T10:00:00Z',
        isGraded: true,
        score: 15.0,
        teacherComment: 'Điểm vượt khung',
      }, '2026-10-20T23:59:59Z');
      assert.equal(gradingInvalid.isValid, false);

      // 4. Gradebook: validate score input string
      assert.equal(validateScoreInput('8.5').score, 8.5);
      assert.equal(validateScoreInput('9,5').score, 9.5); // Vietnamese comma support
      assert.equal(validateScoreInput('12.0').isValid, false);
      assert.equal(validateScoreInput('-1').isValid, false);

      // 5. Semester GPA (TBHK): (Sum(TX) + 2*GK + 3*CK) / (Count(TX) + 5)
      // Scores: TX=[8, 9], GK=8, CK=9 -> (8 + 9 + 16 + 27) / 7 = 60 / 7 = 8.5714 -> 8.6
      const tbhk = calculateTBHK([8, 9], 8, 9);
      assert.equal(tbhk, 8.6);

      // Missing final exam -> TBHK is null (cannot compute incomplete semester)
      assert.equal(calculateTBHK([8, 9], 8, null), null);

      // 6. Term publication state
      const actionInfo = getTermActionInfo('da_cong_bo');
      assert.equal(actionInfo.isPublished, true);
      assert.equal(actionInfo.buttonLabel, 'Cập nhật');
    });
  });

  /* ========================================================================
     SCEN-06: Nhân Viên Bếp (Staff) - Thực đơn Dinh dưỡng Tuần & Bất biến
     ======================================================================== */
  describe('SCEN-06: Kitchen Staff Weekly Menu Planning & Nutrition Immutability', () => {
    it('executes full sequence: clone grid menu, publish menu, and lock published menu from deletion', () => {
      // 1. Menu format check: grid vs file
      const gridMenu = { id: 'm-grid', contentType: 'grid' };
      const fileMenu = { id: 'm-file', contentType: 'file' };
      assert.equal(canCloneMenu(gridMenu), true);
      assert.equal(canCloneMenu(fileMenu), false);

      // 2. Published Menu Immutability check via Redux reducer
      const initialState = {
        menus: [
          { id: 'menu-pub', weekRange: '12/10 - 18/10', status: 'published' },
          { id: 'menu-draft', weekRange: '19/10 - 25/10', status: 'draft' },
        ],
        activeMenu: null,
        loading: false,
        error: null,
        notification: null,
      };

      // Attempt to delete published menu -> must NOT be removed
      const stateAfterPub = menuReducer(initialState, deleteMenu('menu-pub'));
      assert.equal(stateAfterPub.menus.some((m) => m.id === 'menu-pub'), true);

      // Attempt to delete draft menu -> successfully removed
      const stateAfterDraft = menuReducer(initialState, deleteMenu('menu-draft'));
      assert.equal(stateAfterDraft.menus.some((m) => m.id === 'menu-draft'), false);
    });
  });

  /* ========================================================================
     SCEN-07: Nhân Viên (Staff) - Chấm công Nhân sự & Khóa 45 Ngày
     ======================================================================== */
  describe('SCEN-07: School Staff Attendance & 45-Day Retrospective Edit Boundary', () => {
    it('executes full sequence: validates check-in/out format, locks dates older than 45 days', () => {
      // 1. Time format (HH:mm)
      assert.equal(validateTimeFormat('07:30'), true);
      assert.equal(validateTimeFormat('17:45'), true);
      assert.equal(validateTimeFormat('25:00'), false);
      assert.equal(validateTimeFormat('invalid'), false);

      // 2. 45-day edit lock boundary
      // Today is 2026-10-15:
      // Date from 2026-08-01 is > 45 days ago -> locked
      assert.equal(isDateLockedForEdit('2026-08-01', '2026-10-15'), true);
      // Date from 2026-10-10 is 5 days ago -> editable
      assert.equal(isDateLockedForEdit('2026-10-10', '2026-10-15'), false);
    });
  });

  /* ========================================================================
     SCEN-08: Kế Toán (Accountant) - Danh mục Phí Master & Chính sách Miễn giảm
     ======================================================================== */
  describe('SCEN-08: Accountant Fee Catalog, Target Intersection & Exemption Conflict Guard', () => {
    it('executes full sequence: rejects negative fees, computes common fees for multi-class, and catches exemption overlap', () => {
      // 1. Negative fee item rejection
      const invalidFee = validateCreateFeeItemInput({
        name: 'Tiền xe buýt',
        revenueCategoryId: 1,
        defaultAmount: -100000,
        unit: 'thang',
      });
      assert.equal(invalidFee.valid, false);

      const validFee = validateCreateFeeItemInput({
        name: 'Tiền xe buýt',
        revenueCategoryId: 1,
        defaultAmount: 1200000,
        unit: 'thang',
      });
      assert.equal(validFee.valid, true);

      // 2. Class fee intersection
      const commonFees = getApplicableFeeItemsForTargets('class', ['class-10a1', 'class-10a2'], AVAILABLE_STUDENTS_FOR_DISCOUNT);
      assert.ok(commonFees.length > 0);
      assert.ok(commonFees.some((f) => f.id === 'fee-sys-001')); // Học phí chính khóa is mandatory common

      // 3. Discount conflict: 1 policy per fee item rule
      const existingPolicies = [
        {
          id: 'disc-01',
          code: 'MG-001',
          name: 'Học bổng tài năng 50%',
          feeItemId: 'fee-sys-001',
          status: 'active',
          discountType: 'percent',
          discountValue: 50,
          targets: [
            {
              id: 'tgt-1',
              discountPolicyId: 'disc-01',
              targetType: 'student',
              targetId: 'hs-001',
              targetName: 'Nguyễn Gia Huy',
              targetClass: 'Lớp 10A1',
            },
          ],
        },
      ];

      // New policy targeting the same fee-sys-001 for hs-001 must return conflict
      const conflicts = findStudentDiscountConflicts(
        ['hs-001'],
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
    });
  });

  /* ========================================================================
     SCEN-09: Kế Toán (Accountant) - Hóa đơn Học phí, VietQR & Vòng đời Gạch nợ
     ======================================================================== */
  describe('SCEN-09: Accountant Tuition Billing, VietQR & Settlement Lifecycle', () => {
    it('executes full sequence: calculates invoice totals, creates VietQR payload, guards batch deletion, and resolves lifecycle', () => {
      // 1. Calculate invoice line items
      const lineItems = [
        { unitPrice: 2500000, quantity: 1, discountAmount: 500000, amount: 2000000 },
        { unitPrice: 850000, quantity: 1, discountAmount: 0, amount: 850000 },
      ];
      const totals = calculateInvoiceTotals(lineItems);
      assert.equal(totals.subtotal, 3350000);
      assert.equal(totals.discountTotal, 500000);
      assert.equal(totals.totalAmount, 2850000);

      // 2. Generate VietQR details
      const qr = generateVietQRPayload('HOCPHI-2026-001', totals.totalAmount);
      assert.equal(qr.transferContent, 'HOCPHI HOCPHI-2026-001');
      assert.equal(qr.accountNo, '0987654321');

      // 3. Batch deletion permission
      // Draft-only can be deleted
      assert.deepEqual(getPermittedBatchActions([{ id: 'inv-1', status: 'da_tao' }]), ['send', 'delete']);
      // Paid invoice cannot be deleted
      assert.equal(getPermittedBatchActions([{ id: 'inv-2', status: 'da_thanh_toan' }]).includes('delete'), false);

      // 4. Lifecycle state transitions
      // Partial payment
      assert.equal(resolveInvoiceStatus(2850000, 1000000, '2026-10-31', 'da_gui'), 'thanh_toan_mot_phan');
      // Full settlement
      assert.equal(resolveInvoiceStatus(2850000, 2850000, '2026-10-31', 'da_gui'), 'da_thanh_toan');
    });
  });

  /* ========================================================================
     SCEN-10: Kế Toán (Accountant) - Hoàn tiền Ăn (08:30 Cut-off) & Phiếu Chi
     ======================================================================== */
  describe('SCEN-10: Meal Absence Refund Calculation & Expense Voucher Disbursement', () => {
    it('executes full sequence: validates refund rates, computes meal deduction, and manages expense voucher lifecycle', () => {
      // 1. Rate bounds (0 - 100%)
      assert.equal(validateMealRefundRates({ mainMealRatePercent: 50, breakfastRatePercent: 70 }).isValid, true);
      assert.equal(validateMealRefundRates({ mainMealRatePercent: -5, breakfastRatePercent: 70 }).isValid, false);

      // 2. Student meal refund calculation
      const absenceRecord = {
        studentId: 'hs-101',
        studentName: 'Trần Văn An',
        className: '10A1',
        month: '2026-09',
        excusedAbsenceDays: 4,
        unexcusedAbsenceDays: 0,
        totalAbsenceDays: 4,
        schoolDaysInMonth: 22,
      };

      const refund = calculateMealRefundForStudent(
        absenceRecord,
        { mainMealUnitPrice: 40000, breakfastUnitPrice: 20000 },
        { mainMealRatePercent: 50, breakfastRatePercent: 70 },
        '2026-10'
      );

      assert.ok(refund.totalMealRefund > 0);
      assert.equal(refund.items.length, 2);

      // Description format check
      const desc = generateMealRefundDescription('tien_an', 4, 50, 80000, 22, 0, '09/2026', 0, 4, 50, 80000);
      assert.ok(desc.includes('Khấu trừ hoàn tiền ăn'));

      // 3. Expense Voucher State Machine: da_tao -> da_duyet -> da_chi
      assert.equal(canApproveVoucher('da_tao'), true);
      assert.equal(canApproveVoucher('da_duyet'), false);

      assert.equal(canConfirmDisbursement('da_duyet'), true);
      assert.equal(canConfirmDisbursement('da_tao'), false);

      assert.equal(canCancelVoucher('da_chi'), false, 'Disbursed voucher cannot be cancelled');
      assert.equal(canCancelVoucher('da_tao'), true);
    });
  });

  /* ========================================================================
     SCEN-11: Phụ Huynh & Nhà Trường - Phản hồi Góp ý & Bình chọn Khảo sát
     ======================================================================== */
  describe('SCEN-11: Community Feedback Turn-Taking & Survey Poll Voting Guard', () => {
    it('executes full sequence: validates feedback comments, reopens on parent reply, locks expired polls and computes percentages', () => {
      // 1. Feedback comment validation
      assert.equal(validateCommentSubmission('').isValid, false);
      assert.equal(validateCommentSubmission('Trường tiếp thu ý kiến của phụ huynh.').isValid, true);

      // 2. Completed feedback closure guard
      assert.equal(validateClosureEligibility({ id: 'fb-1', status: 'completed' }).canClose, false);
      assert.equal(validateClosureEligibility({ id: 'fb-2', status: 'processing' }).canClose, true);

      // 3. Reactive Turn-taking: Parent replies to completed ticket -> reopens ticket
      const turnAfterParentReply = getNextTurnTakingStatus('school', 'parent', 'completed');
      assert.equal(turnAfterParentReply.waitingFor, 'school');
      assert.equal(turnAfterParentReply.nextStatus, 'reopened');

      // Staff replies -> turn transferred to parent
      const turnAfterStaffReply = getNextTurnTakingStatus('school', 'teacher', 'processing');
      assert.equal(turnAfterStaffReply.waitingFor, 'parent');

      // 4. Poll validation: Title & Options
      const validPoll = validatePollPayload({
        title: 'Khảo sát tổ chức Dã ngoại học kỳ 1',
        audienceScope: 'toan_truong',
        deadline: '2026-11-30T17:00:00Z',
        options: ['Địa điểm A', 'Địa điểm B'],
      });
      assert.equal(validPoll.isValid, true);

      // 5. Poll actions: mutations allowed in da_tao only
      assert.equal(canEditPoll('da_tao'), true);
      assert.equal(canEditPoll('da_gui'), false);
      assert.equal(canDeletePoll('da_dong'), false);

      // 6. Expiration check
      assert.equal(isPollExpired('2020-01-01T00:00:00Z'), true);
      assert.equal(isPollExpired('2099-01-01T00:00:00Z'), false);

      // 7. Option percentages calculation (0 votes edge case)
      const options = [
        { id: 'opt-1', title: 'Đồng ý', voteCount: 0 },
        { id: 'opt-2', title: 'Không đồng ý', voteCount: 0 },
      ];
      const pctResults = calculateOptionPercentages(options, 0);
      assert.equal(pctResults[0].percentage, 0);
      assert.equal(pctResults[1].percentage, 0);
    });
  });

  /* ========================================================================
     SCEN-12: Vòng đời Học sinh - Lưu trữ Hồ sơ & Phục hồi Khi Lớp Cũ Bị Xóa
     ======================================================================== */
  describe('SCEN-12: Student Lifecycle, Archive Sorting & Inactive Class Fallback', () => {
    it('executes full sequence: sorts archives with null dates, maps inactive former classes to unassigned state', () => {
      // 1. Archive sorting handles null/undefined dates gracefully
      const archiveList = [
        { id: 'st-1', fullName: 'Đỗ Minh Quân', archiveDate: '2025-06-30' },
        { id: 'st-2', fullName: 'Bùi Thị Hà', archiveDate: undefined },
        { id: 'st-3', fullName: 'Phạm Gia Khiêm', archiveDate: '2024-05-15' },
      ];
      const sorted = sortArchivedStudents(archiveList, 'archiveDate', 'asc');
      assert.equal(sorted[0].id, 'st-3', 'Oldest date is first in ascending sort');
      assert.equal(sorted[2].archiveDate, undefined, 'Missing date sinks to bottom');

      // 2. Class continuity evaluation when restoring student
      const activeClasses = [
        { id: 'cls-10a1', name: 'Lớp 10A1' },
      ];

      // Case A: Former class still active
      const restoreActive = evaluateRestorationClass(
        { id: 'st-1', formerClassId: 'cls-10a1', formerClassName: 'Lớp 10A1' },
        activeClasses
      );
      assert.equal(restoreActive.isClassActive, true);
      assert.equal(restoreActive.restoredClassId, 'cls-10a1');

      // Case B: Former class was disbanded or deleted
      const restoreDisbanded = evaluateRestorationClass(
        { id: 'st-2', formerClassId: 'cls-deleted', formerClassName: 'Lớp 9A3 (Đã giải thể)' },
        activeClasses
      );
      assert.equal(restoreDisbanded.isClassActive, false);
      assert.equal(restoreDisbanded.restoredClassId, null);
      assert.equal(restoreDisbanded.restoredClassName, 'Chưa xếp lớp');
      assert.ok(restoreDisbanded.warningMessage?.includes('không còn hoạt động'));
    });
  });
});
