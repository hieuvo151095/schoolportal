/**
 * Automated Unit Test Suite for Finance - Tuition Invoices (Học Phí)
 * Tests BR01–BR11, TASK-FIN-001, TASK-FIN-002, and Redux state machine.
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import {
  formatVND,
  formatCurrencyNumber,
  parseCurrencyNumber,
  calculateMealDeduction,
  calculateLineItemTotal,
  calculateInvoiceTotals,
  resolveInvoiceStatus,
  generateVietQRPayload,
  getPermittedActions,
  getPermittedBatchActions,
  filterInvoices,
} from '../../src/utils/invoiceValidation.ts';

import invoiceReducer, {
  setSelectedMonth,
  setSelectedClassId,
  toggleSelectInvoice,
  toggleSelectAllInvoices,
  clearSelectedInvoices,
  createBatchInvoices,
  updateDraftInvoice,
  sendInvoices,
  deleteDraftInvoices,
  cancelInvoice,
  addPaymentEntry,
  setCreatedDateRange,
  setDateFilterType,
} from '../../src/store/slices/invoiceSlice.ts';

import { mockInvoices } from '../../src/services/mockInvoiceData.ts';
import { getStudentCandidateDiscountPolicies } from '../../src/utils/discountValidation.ts';
import {
  INITIAL_DISCOUNT_POLICIES,
  getApplicableFeeItemsForTargets,
} from '../../src/services/mockDiscountData.ts';

describe('Finance Tuition Invoices (Học Phí) Business Rules & Engine', () => {

  test('VND currency formatting formats with dot separator and đ suffix', () => {
    assert.equal(formatVND(0), '0 đ');
    assert.equal(formatVND(1200000), '1.200.000 đ');
    assert.equal(formatVND(1850000), '1.850.000 đ');
    assert.equal(formatVND(35000), '35.000 đ');
    assert.equal(formatVND(null), '0 đ');
  });

  test('Unit price dot formatting and parsing (formatCurrencyNumber & parseCurrencyNumber)', () => {
    assert.equal(formatCurrencyNumber(2500000), '2.500.000');
    assert.equal(formatCurrencyNumber(35000), '35.000');
    assert.equal(formatCurrencyNumber(500000), '500.000');
    assert.equal(formatCurrencyNumber(0), '0');
    assert.equal(formatCurrencyNumber(null), '0');
    assert.equal(formatCurrencyNumber(undefined), '0');

    assert.equal(parseCurrencyNumber('2.500.000'), 2500000);
    assert.equal(parseCurrencyNumber('35.000'), 35000);
    assert.equal(parseCurrencyNumber('500.000'), 500000);
    assert.equal(parseCurrencyNumber('0'), 0);
    assert.equal(parseCurrencyNumber(''), 0);
    assert.equal(parseCurrencyNumber(null), 0);
    assert.equal(parseCurrencyNumber(2500000), 2500000);
  });

  test('TASK-FIN-002: Calculates MoET attendance-linked meal fee deduction with integer precision', () => {
    // 22 school days, 2 excused absences, 35,000 VND daily rate
    const result = calculateMealDeduction(35000, 2, 22);
    assert.equal(result.deductedAmount, 70000);
    assert.equal(result.netMealDays, 20);
    assert.equal(result.totalMealFee, 700000);

    // 0 absence days
    const perfectAttendance = calculateMealDeduction(35000, 0, 22);
    assert.equal(perfectAttendance.deductedAmount, 0);
    assert.equal(perfectAttendance.netMealDays, 22);
    assert.equal(perfectAttendance.totalMealFee, 770000);

    // Absence exceeds school days -> bounded to school days
    const fullAbsence = calculateMealDeduction(35000, 30, 22);
    assert.equal(fullAbsence.deductedAmount, 770000);
    assert.equal(fullAbsence.netMealDays, 0);
    assert.equal(fullAbsence.totalMealFee, 0);
  });

  test('Line item and invoice total calculations correctly apply discount percentages', () => {
    const itemCalc = calculateLineItemTotal(1200000, 1, 10);
    assert.equal(itemCalc.discountAmount, 120000);
    assert.equal(itemCalc.amount, 1080000);

    const items = [
      { id: '1', category: 'hoc_phi', name: 'Học phí', unitPrice: 1200000, quantity: 1, discountPercent: 10, discountAmount: 120000, amount: 1080000 },
      { id: '2', category: 'tien_an', name: 'Tiền ăn', unitPrice: 35000, quantity: 20, discountPercent: 0, discountAmount: 0, amount: 700000 },
    ];
    const totals = calculateInvoiceTotals(items);
    assert.equal(totals.subtotal, 1900000);
    assert.equal(totals.discountTotal, 120000);
    assert.equal(totals.totalAmount, 1780000);
  });

  test('BR02: Resolves dynamic invoice status according to payment and due date', () => {
    const refDate = new Date(2026, 8, 18); // 18 Sep 2026

    // 1. Fully paid -> da_thanh_toan
    assert.equal(resolveInvoiceStatus(1900000, 1900000, '15/09/2026', 'da_gui', refDate), 'da_thanh_toan');

    // 2. Partially paid -> thanh_toan_mot_phan
    assert.equal(resolveInvoiceStatus(1900000, 1000000, '15/09/2026', 'da_gui', refDate), 'thanh_toan_mot_phan');

    // 3. Unpaid & past due by >= 2 days (due 15/09 vs ref 18/09 = 3 days) -> qua_han
    assert.equal(resolveInvoiceStatus(1900000, 0, '15/09/2026', 'da_gui', refDate), 'qua_han');

    // 4. Unpaid & not yet overdue (due 25/09 vs ref 18/09) -> da_gui
    assert.equal(resolveInvoiceStatus(1900000, 0, '25/09/2026', 'da_gui', refDate), 'da_gui');

    // 5. Draft remains draft if unpaid
    assert.equal(resolveInvoiceStatus(1900000, 0, '25/09/2026', 'da_tao', refDate), 'da_tao');

    // 6. Cancelled remains cancelled
    assert.equal(resolveInvoiceStatus(1900000, 0, '15/09/2026', 'da_huy', refDate), 'da_huy');
  });

  test('VietQR payload contains required transfer content syntax: HOCPHI {invoiceNo}', () => {
    const qr = generateVietQRPayload('HD2609-001', 1900000);
    assert.equal(qr.transferContent, 'HOCPHI HD2609-001');
    assert.equal(qr.accountNo, '0987654321');
    assert.ok(qr.qrImageUrl.startsWith('data:image/svg+xml'));
  });

  test('BR03: Enforces asymmetric action permissions matrix by invoice status', () => {
    const draftActions = getPermittedActions('da_tao');
    assert.ok(draftActions.includes('edit'));
    assert.ok(draftActions.includes('send'));
    assert.ok(draftActions.includes('delete'));
    assert.ok(draftActions.includes('cancel'));

    const sentActions = getPermittedActions('da_gui');
    assert.ok(sentActions.includes('pay'));
    assert.ok(sentActions.includes('print'));
    assert.ok(!sentActions.includes('edit'));
    assert.ok(!sentActions.includes('delete'));

    const paidActions = getPermittedActions('da_thanh_toan');
    assert.ok(paidActions.includes('print'));
    assert.ok(paidActions.includes('history'));
    assert.ok(!paidActions.includes('pay'));
    assert.ok(!paidActions.includes('edit'));
    assert.ok(!paidActions.includes('cancel'));
  });

  test('BR04: Computes dynamic batch actions intersection for selected roster items', () => {
    const draft1 = mockInvoices.find(i => i.status === 'da_tao');
    assert.ok(draft1);

    // All drafts -> send and delete
    const batchDrafts = getPermittedBatchActions([draft1]);
    assert.deepEqual(batchDrafts, ['send', 'delete']);

    // Unpaid invoices -> pay
    const sent = mockInvoices.find(i => i.status === 'da_gui');
    const overdue = mockInvoices.find(i => i.status === 'qua_han');
    assert.ok(sent && overdue);
    const batchPayable = getPermittedBatchActions([sent, overdue]);
    assert.deepEqual(batchPayable, ['pay']);

    // Mixed draft and paid -> empty action set
    const paid = mockInvoices.find(i => i.status === 'da_thanh_toan');
    assert.ok(paid);
    const mixed = getPermittedBatchActions([draft1, paid]);
    assert.deepEqual(mixed, []);
  });

  test('BR11: Filters invoices by multiple criteria (class, search keyword, status, payment method)', () => {
    // 1. Keyword search
    const byName = filterInvoices(mockInvoices, {
      searchKeyword: 'Văn An',
      classId: 'tat_ca',
      billingMonth: 'tat_ca',
      status: 'tat_ca',
      gradeLevel: 'tat_ca',
      hasDeduction: null,
      hasElectronicInvoice: null,
      paymentMethod: 'tat_ca',
    });
    assert.equal(byName.length, 1);
    assert.equal(byName[0].studentName, 'Nguyễn Văn An');

    // 2. Status filter
    const paidInvoices = filterInvoices(mockInvoices, {
      searchKeyword: '',
      classId: 'tat_ca',
      billingMonth: 'tat_ca',
      status: 'da_thanh_toan',
      gradeLevel: 'tat_ca',
      hasDeduction: null,
      hasElectronicInvoice: null,
      paymentMethod: 'tat_ca',
    });
    assert.ok(paidInvoices.every(i => i.status === 'da_thanh_toan'));

    // 3. Payment method filter
    const sepayInvoices = filterInvoices(mockInvoices, {
      searchKeyword: '',
      classId: 'tat_ca',
      billingMonth: 'tat_ca',
      status: 'tat_ca',
      gradeLevel: 'tat_ca',
      hasDeduction: null,
      hasElectronicInvoice: null,
      paymentMethod: 'cong_sepay',
    });
    assert.equal(sepayInvoices.length, 1);
    assert.equal(sepayInvoices[0].studentCode, 'HS-601');

    // 4. Creation date range filter (Từ ngày - Đến ngày tạo HĐ)
    const matchingRange = filterInvoices(mockInvoices, {
      searchKeyword: '',
      classId: 'tat_ca',
      billingMonth: 'tat_ca',
      createdDateFrom: '2026-09-01',
      createdDateTo: '2026-09-30',
      status: 'tat_ca',
      gradeLevel: 'tat_ca',
      hasDeduction: null,
      hasElectronicInvoice: null,
      paymentMethod: 'tat_ca',
    });
    assert.equal(matchingRange.length, mockInvoices.length);

    // Filter out by future creation date
    const outOfRange = filterInvoices(mockInvoices, {
      searchKeyword: '',
      classId: 'tat_ca',
      billingMonth: 'tat_ca',
      createdDateFrom: '2026-10-01',
      createdDateTo: '2026-10-31',
      status: 'tat_ca',
      gradeLevel: 'tat_ca',
      hasDeduction: null,
      hasElectronicInvoice: null,
      paymentMethod: 'tat_ca',
    });
    assert.equal(outOfRange.length, 0);
  });

  describe('Redux Invoice Reducer State Transitions', () => {

    test('Filters by invoice created date range via setCreatedDateRange action', () => {
      const state = invoiceReducer(undefined, { type: '@@INIT' });
      assert.equal(state.filterCriteria.createdDateFrom, '2026-09-01');
      assert.equal(state.filterCriteria.createdDateTo, '2026-09-30');

      const nextState = invoiceReducer(
        state,
        setCreatedDateRange({ from: '2026-09-05', to: '2026-09-20' })
      );
      assert.equal(nextState.filterCriteria.createdDateFrom, '2026-09-05');
      assert.equal(nextState.filterCriteria.createdDateTo, '2026-09-20');
    });

    test('BR08 & TASK-FIN-001: Appends cumulative payment entry and updates status to da_thanh_toan', () => {
      const state = invoiceReducer(undefined, { type: '@@INIT' });
      const targetInvoice = state.invoices.find(i => i.id === 'inv-6a1-003'); // da_gui, total 1.935.000, remaining 1.935.000
      assert.ok(targetInvoice);
      assert.equal(targetInvoice.status, 'da_gui');
      assert.equal(targetInvoice.paymentHistory.length, 0);

      // Settle full payment
      const nextState = invoiceReducer(
        state,
        addPaymentEntry({
          invoiceId: 'inv-6a1-003',
          amount: 1935000,
          paymentMethod: 'chuyen_khoan',
          confirmedBy: 'Nguyễn Thị Kế Toán',
          note: 'Phụ huynh chuyển qua VietQR',
          transactionRef: 'MB-109283',
        })
      );

      const updated = nextState.invoices.find(i => i.id === 'inv-6a1-003');
      assert.ok(updated);
      assert.equal(updated.paidAmount, 1935000);
      assert.equal(updated.remainingAmount, 0);
      assert.equal(updated.status, 'da_thanh_toan');
      assert.equal(updated.paymentHistory.length, 1);
      assert.equal(updated.paymentHistory[0].amount, 1935000);
      assert.equal(updated.paymentHistory[0].transactionRef, 'MB-109283');
    });

    test('BR08: Partial payment appends payment history and marks invoice as thanh_toan_mot_phan', () => {
      const state = invoiceReducer(undefined, { type: '@@INIT' });
      const nextState = invoiceReducer(
        state,
        addPaymentEntry({
          invoiceId: 'inv-6a1-003',
          amount: 1000000,
          paymentMethod: 'tien_mat',
          confirmedBy: 'Nguyễn Thị Kế Toán',
          note: 'Đóng trước tiền học phí',
        })
      );

      const updated = nextState.invoices.find(i => i.id === 'inv-6a1-003');
      assert.ok(updated);
      assert.equal(updated.paidAmount, 1000000);
      assert.equal(updated.remainingAmount, 935000);
      assert.equal(updated.status, 'thanh_toan_mot_phan');
      assert.equal(updated.paymentHistory.length, 1);
    });

    test('BR03: sendInvoices transitions da_tao to da_gui and deleteDraftInvoices removes draft', () => {
      const state = invoiceReducer(undefined, { type: '@@INIT' });
      const draftInvoice = state.invoices.find(i => i.id === 'inv-6a1-004');
      assert.ok(draftInvoice && draftInvoice.status === 'da_tao');

      // Send invoice
      const sentState = invoiceReducer(state, sendInvoices(['inv-6a1-004']));
      const updatedSent = sentState.invoices.find(i => i.id === 'inv-6a1-004');
      assert.equal(updatedSent?.status, 'da_gui');
      assert.equal(updatedSent?.sendDate, '18/09/2026');

      // Delete another draft
      const deleteState = invoiceReducer(state, deleteDraftInvoices(['inv-6a1-004']));
      const deleted = deleteState.invoices.find(i => i.id === 'inv-6a1-004');
      assert.equal(deleted, undefined);
    });

    test('BR03: cancelInvoice transitions status to da_huy with cancellation reason', () => {
      const state = invoiceReducer(undefined, { type: '@@INIT' });
      const nextState = invoiceReducer(
        state,
        cancelInvoice({
          id: 'inv-6a1-003',
          reason: 'Lập sai thông tin phụ huynh',
          cancelledBy: 'Nguyễn Thị Kế Toán',
        })
      );

      const cancelled = nextState.invoices.find(i => i.id === 'inv-6a1-003');
      assert.equal(cancelled?.status, 'da_huy');
      assert.equal(cancelled?.cancellationReason, 'Lập sai thông tin phụ huynh');
      assert.ok(cancelled?.cancelledAt);
    });

    test('BR05: createBatchInvoices creates invoices for scope and skips duplicate students', () => {
      const state = invoiceReducer(undefined, { type: '@@INIT' });
      const initialCount = state.invoices.length;

      // Student hs-606 (Hoàng Quốc Bảo) does not have an invoice for 2026-09
      const nextState = invoiceReducer(
        state,
        createBatchInvoices({
          scope: 'hoc_sinh',
          studentId: 'hs-606',
          billingMonth: '2026-09',
          title: 'Hóa đơn tháng 09/2026',
          issueDate: '01/09/2026',
          dueDate: '20/09/2026',
          exportElectronicInvoice: true,
          items: [
            { category: 'hoc_phi', name: 'Học phí chính khóa', unitPrice: 1200000, quantity: 1, discountPercent: 0, isRequired: true }
          ],
        })
      );

      assert.equal(nextState.invoices.length, initialCount + 1);
      const created = nextState.invoices.find(i => i.studentId === 'hs-606');
      assert.ok(created);
      assert.equal(created.studentName, 'Hoàng Quốc Bảo');
      assert.equal(created.totalAmount, 1200000);

      // Attempt duplicate creation for hs-606 for the same month -> skipped
      const duplicateState = invoiceReducer(
        nextState,
        createBatchInvoices({
          scope: 'hoc_sinh',
          studentId: 'hs-606',
          billingMonth: '2026-09',
          title: 'Hóa đơn tháng 09/2026',
          issueDate: '01/09/2026',
          dueDate: '20/09/2026',
          exportElectronicInvoice: true,
          items: [
            { category: 'hoc_phi', name: 'Học phí chính khóa', unitPrice: 1200000, quantity: 1, discountPercent: 0 }
          ],
        })
      );
      assert.equal(duplicateState.invoices.length, nextState.invoices.length); // No new invoice added
    });

    test('createBatchInvoices automatically applies highest discount policy (50% over 20%) for Nguyen Gia Huy (10A1)', () => {
      const state = invoiceReducer(undefined, { type: '@@INIT' });

      // Verify that hs-001 (Nguyễn Gia Huy - class-10a1) is in state.students
      const huy = state.students.find((s) => s.studentId === 'hs-001');
      assert.ok(huy, 'Nguyen Gia Huy hs-001 must exist in invoice roster');
      assert.equal(huy.classId, 'class-10a1');
      assert.equal(huy.className, 'Lớp 10A1');

      // Create invoice for Nguyen Gia Huy for Hoc phi chinh khoa (2,500,000 VND)
      const nextState = invoiceReducer(
        state,
        createBatchInvoices({
          scope: 'hoc_sinh',
          studentId: 'hs-001',
          billingMonth: '2026-09',
          title: 'Hóa đơn tháng 09/2026 - Nguyễn Gia Huy',
          issueDate: '01/09/2026',
          dueDate: '20/09/2026',
          exportElectronicInvoice: true,
          autoApplyDiscount: true,
          items: [
            {
              category: 'hoc_phi',
              name: 'Học phí chính khóa tháng 09/2026',
              unitPrice: 2500000,
              quantity: 1,
              discountPercent: 0,
              isRequired: true,
            },
          ],
        })
      );

      const createdInvoice = nextState.invoices.find((i) => i.studentId === 'hs-001');
      assert.ok(createdInvoice, 'Created invoice for Nguyen Gia Huy must exist');
      assert.equal(createdInvoice.studentName, 'Nguyễn Gia Huy');
      assert.equal(createdInvoice.className, 'Lớp 10A1');

      // 50% discount should have won over 20% class discount
      // 50% of 2,500,000 = 1,250,000 VND discount deduction
      assert.equal(createdInvoice.subtotal, 2500000);
      assert.equal(createdInvoice.discountTotal, 1250000);
      assert.equal(createdInvoice.totalAmount, 1250000);
      assert.equal(createdInvoice.remainingAmount, 1250000);

      const feeItem = createdInvoice.items[0];
      assert.equal(feeItem.discountPercent, 50);
      assert.equal(feeItem.discountAmount, 1250000);
      assert.equal(feeItem.amount, 1250000);
      assert.ok(feeItem.description?.includes('Học bổng tài năng học thuật 50%'));
    });

    test('setDateFilterType updates dateFilterType criteria', () => {
      const state = invoiceReducer(undefined, { type: '@@INIT' });
      assert.equal(state.filterCriteria.dateFilterType, 'createdAt');

      const nextState = invoiceReducer(state, setDateFilterType('dueDate'));
      assert.equal(nextState.filterCriteria.dateFilterType, 'dueDate');
    });

    test('filterInvoices supports filtering by dueDate range', () => {
      const filtered = filterInvoices(mockInvoices, {
        searchKeyword: '',
        classId: 'lop-6a1',
        billingMonth: 'tat_ca',
        dateFilterType: 'dueDate',
        createdDateFrom: '2026-09-10',
        createdDateTo: '2026-09-20',
        status: 'tat_ca',
        gradeLevel: 'tat_ca',
        hasDeduction: null,
        hasElectronicInvoice: null,
        paymentMethod: 'tat_ca',
      });

      // Every returned invoice must have dueDate between 10/09/2026 and 20/09/2026
      assert.ok(filtered.length > 0);
      for (const inv of filtered) {
        const parts = inv.dueDate.split('/');
        const dueDay = parseInt(parts[0], 10);
        assert.ok(dueDay >= 10 && dueDay <= 20);
      }
    });

    test('addPaymentEntry records payment using confirmed methods (tien_mat, qr_ecopay, vi_finviet)', () => {
      const state = invoiceReducer(undefined, { type: '@@INIT' });
      const nextState = invoiceReducer(
        state,
        addPaymentEntry({
          invoiceId: 'inv-6a1-002',
          amount: 500000,
          paymentMethod: 'qr_ecopay',
          confirmedBy: 'Kế toán viên',
          note: 'Thanh toán qua QR ECOPay',
          transactionRef: 'ECO-998811',
        })
      );

      const target = nextState.invoices.find(i => i.id === 'inv-6a1-002');
      assert.ok(target);
      const lastPayment = target.paymentHistory[target.paymentHistory.length - 1];
      assert.equal(lastPayment.paymentMethod, 'qr_ecopay');
      assert.equal(lastPayment.amount, 500000);
      assert.equal(lastPayment.transactionRef, 'ECO-998811');
    });

    test('ManualPaymentModal strictly restricts manual payment options to only 1 option (Tiền mặt) per ADR-036', () => {
      const modalFilePath = path.resolve('src/modules/finance/invoices/ManualPaymentModal.tsx');
      const modalSource = fs.readFileSync(modalFilePath, 'utf8');

      // Assert paymentOptions array contains strictly tien_mat and excludes digital gateway methods
      assert.ok(modalSource.includes("value: 'tien_mat', label: 'Tiền mặt'"), 'Must contain Tiền mặt option');
      assert.ok(!modalSource.includes("value: 'qr_ecopay'"), 'Must not contain qr_ecopay in manual payment modal');
      assert.ok(!modalSource.includes("value: 'vi_finviet'"), 'Must not contain vi_finviet in manual payment modal');
    });

    test('Candidate discount programs pop-up selection & arithmetic for Nguyen Gia Huy (10A1)', () => {
      // 1. Check candidate policies retrieval for Nguyen Gia Huy on Hoc phi chinh khoa
      const candidates = getStudentCandidateDiscountPolicies(
        { id: 'hs-001', classId: 'class-10a1', fullName: 'Nguyễn Gia Huy' },
        { id: 'fee-01', name: 'Học phí chính khóa tháng 09/2026', amount: 2500000 },
        INITIAL_DISCOUNT_POLICIES,
        '2026-09'
      );

      // Must find 2 active policies: 50% academic scholarship & 20% sibling/class discount
      assert.equal(candidates.length, 2);
      assert.equal(candidates[0].policy.id, 'disc-001');
      assert.equal(candidates[0].discountPercentEquivalent, 50);
      assert.equal(candidates[0].deductionAmount, 1250000);
      assert.equal(candidates[0].isHighest, true);

      assert.equal(candidates[1].policy.id, 'disc-002');
      assert.equal(candidates[1].discountPercentEquivalent, 20);
      assert.equal(candidates[1].deductionAmount, 500000);
      assert.equal(candidates[1].isHighest, false);

      // 2. Default: 50% discount yields 1.250.000 VND instead of 2.500.000 VND
      const calc50 = calculateLineItemTotal(2500000, 1, 50);
      assert.equal(calc50.discountAmount, 1250000);
      assert.equal(calc50.amount, 1250000);

      // 3. User switches to 20% discount program
      const calc20 = calculateLineItemTotal(2500000, 1, 20);
      assert.equal(calc20.discountAmount, 500000);
      assert.equal(calc20.amount, 2000000);

      // 4. User waives discount (0%)
      const calc0 = calculateLineItemTotal(2500000, 1, 0);
      assert.equal(calc0.discountAmount, 0);
      assert.equal(calc0.amount, 2500000);

      // 5. Create invoice in Redux with 20% user override preserved
      const state = invoiceReducer(undefined, { type: '@@INIT' });
      const state20 = invoiceReducer(
        state,
        createBatchInvoices({
          scope: 'hoc_sinh',
          studentId: 'hs-001',
          billingMonth: '2026-09',
          title: 'Hóa đơn tháng 09/2026',
          issueDate: '01/09/2026',
          dueDate: '20/09/2026',
          exportElectronicInvoice: true,
          autoApplyDiscount: true,
          items: [
            {
              category: 'hoc_phi',
              name: 'Học phí chính khóa tháng 09/2026',
              unitPrice: 2500000,
              quantity: 1,
              discountPercent: 20, // explicitly chosen 20%
              isRequired: true,
            },
          ],
        })
      );

      const inv20 = state20.invoices.find((i) => i.studentId === 'hs-001');
      assert.ok(inv20);
      assert.equal(inv20.items[0].discountPercent, 20);
      assert.equal(inv20.items[0].discountAmount, 500000);
      assert.equal(inv20.items[0].amount, 2000000);
      assert.equal(inv20.totalAmount, 2000000);
    });

    test('Multi-class invoice generation and Xe dua don discount policy application for 10A1 & 10A2', () => {
      // 1. Verify applicable fees intersection for 10A1 & 10A2 includes Xe dua don (feeNumber 6)
      const applicableFees = getApplicableFeeItemsForTargets('class', ['class-10a1', 'class-10a2']);
      assert.ok(applicableFees.some((f) => f.feeNumber === 6 && f.name === 'Xe đưa đón'));

      // 2. Mock a discount policy created for Xe dua don applied to classes 10A1 and 10A2
      const xeDuaDonPolicy = {
        id: 'disc-xe-001',
        schoolCode: 'demo',
        code: 'MG-XE-001',
        name: 'Giảm 30% phí xe đưa đón liên lớp 10A1 & 10A2',
        discountType: 'percent',
        discountValue: 30,
        feeItemId: 'fee-cust-003',
        feeItemName: 'Xe đưa đón',
        scopeType: 'class',
        validityType: 'academic_year',
        reason: 'Hỗ trợ đưa đón liên cụm dân cư',
        status: 'active',
        targets: [
          { id: 'tgt-c1', discountPolicyId: 'disc-xe-001', targetType: 'class', targetId: 'class-10a1', targetName: 'Lớp 10A1' },
          { id: 'tgt-c2', discountPolicyId: 'disc-xe-001', targetType: 'class', targetId: 'class-10a2', targetName: 'Lớp 10A2' },
        ],
      };

      const policies = [...INITIAL_DISCOUNT_POLICIES, xeDuaDonPolicy];

      // 3. Create batch invoices for both classes with Xe dua don included in fee items
      const state = invoiceReducer(undefined, { type: '@@INIT' });
      const newState = invoiceReducer(
        state,
        createBatchInvoices({
          scope: 'lop_hoc',
          classIds: ['class-10a1', 'class-10a2'],
          billingMonth: '2026-11', // fresh month without existing invoices
          title: 'Hóa đơn tháng 11/2026',
          issueDate: '01/11/2026',
          dueDate: '20/11/2026',
          exportElectronicInvoice: true,
          autoApplyDiscount: true,
          discountPolicies: policies,
          items: [
            {
              feeItemId: 'fee-sys-001',
              category: 'hoc_phi',
              name: 'Học phí chính khóa tháng 11/2026',
              unitPrice: 2500000,
              quantity: 1,
              discountPercent: 0,
              isRequired: true,
            },
            {
              feeItemId: 'fee-cust-003',
              category: 'khac',
              name: 'Xe đưa đón',
              unitPrice: 1200000,
              quantity: 1,
              discountPercent: 0,
              isRequired: false,
            },
          ],
        })
      );

      // Verify invoices were created for students in both 10A1 and 10A2
      const novInvoices = newState.invoices.filter((i) => i.billingMonth === '2026-11');
      assert.ok(novInvoices.length > 0);

      const student10A1 = novInvoices.find((i) => i.classId === 'class-10a1');
      const student10A2 = novInvoices.find((i) => i.classId === 'class-10a2');

      assert.ok(student10A1, 'Should create invoice for student in class-10a1');
      assert.ok(student10A2, 'Should create invoice for student in class-10a2');

      // Verify Xe đưa đón line item in 10A1 got the 30% discount (1.200.000 * 30% = 360.000 đ discount -> 840.000 đ)
      const busItem10A1 = student10A1.items.find((it) => it.name === 'Xe đưa đón');
      assert.ok(busItem10A1, 'Xe đưa đón line item must exist in generated invoice');
      assert.equal(busItem10A1.discountPercent, 30);
      assert.equal(busItem10A1.discountAmount, 360000);
      assert.equal(busItem10A1.amount, 840000);

      // Verify Xe đưa đón line item in 10A2 also got the 30% discount
      const busItem10A2 = student10A2.items.find((it) => it.name === 'Xe đưa đón');
      assert.ok(busItem10A2, 'Xe đưa đón line item must exist in 10A2 invoice');
      assert.equal(busItem10A2.discountPercent, 30);
      assert.equal(busItem10A2.discountAmount, 360000);
      assert.equal(busItem10A2.amount, 840000);
    });

    test('Support fixed amount (đ) discount and switching between % and đ', () => {
      // 1. Fixed amount calculation: 1.200.000 đ with 200.000 đ discount
      const busCalc = calculateLineItemTotal(1200000, 1, 0, 200000);
      assert.equal(busCalc.discountAmount, 200000);
      assert.equal(busCalc.amount, 1000000);

      // 2. User switches Dong phuc he (450.000 đ) from % (0%) to đ and adds 50.000 đ
      const uniformCalc = calculateLineItemTotal(450000, 1, 0, 50000);
      assert.equal(uniformCalc.discountAmount, 50000);
      assert.equal(uniformCalc.amount, 400000);

      // 3. Create invoice with mixed discount types: % for Hoc phi and đ for Xe dua don
      const state = invoiceReducer(undefined, { type: '@@INIT' });
      const newState = invoiceReducer(
        state,
        createBatchInvoices({
          scope: 'hoc_sinh',
          studentId: 'hs-001',
          billingMonth: '2026-12',
          title: 'Hóa đơn tháng 12/2026',
          issueDate: '01/12/2026',
          dueDate: '20/12/2026',
          exportElectronicInvoice: true,
          autoApplyDiscount: false, // manual inputs verified
          items: [
            {
              feeItemId: 'fee-sys-001',
              category: 'hoc_phi',
              name: 'Học phí chính khóa tháng 12/2026',
              unitPrice: 2500000,
              quantity: 1,
              discountType: 'percent',
              discountPercent: 50,
              discountAmount: 1250000,
              isRequired: true,
            },
            {
              feeItemId: 'fee-cust-003',
              category: 'khac',
              name: 'Xe đưa đón',
              unitPrice: 1200000,
              quantity: 1,
              discountType: 'fixed_amount',
              discountPercent: 17,
              discountAmount: 200000,
              isRequired: false,
            },
            {
              feeItemId: 'fee-cust-004',
              category: 'khac',
              name: 'Đồng phục hè',
              unitPrice: 450000,
              quantity: 1,
              discountType: 'fixed_amount',
              discountPercent: 11,
              discountAmount: 50000,
              isRequired: false,
            },
          ],
        })
      );

      const inv = newState.invoices.find((i) => i.studentId === 'hs-001' && i.billingMonth === '2026-12');
      assert.ok(inv, 'Invoice must be created');

      const busLine = inv.items.find((it) => it.name === 'Xe đưa đón');
      assert.ok(busLine);
      assert.equal(busLine.discountType, 'fixed_amount');
      assert.equal(busLine.discountAmount, 200000);
      assert.equal(busLine.amount, 1000000);

      const uniformLine = inv.items.find((it) => it.name === 'Đồng phục hè');
      assert.ok(uniformLine);
      assert.equal(uniformLine.discountType, 'fixed_amount');
      assert.equal(uniformLine.discountAmount, 50000);
      assert.equal(uniformLine.amount, 400000);

      // Total invoice amount = (2.500.000 - 1.250.000) + (1.200.000 - 200.000) + (450.000 - 50.000)
      // = 1.250.000 + 1.000.000 + 400.000 = 2.650.000 đ
      assert.equal(inv.totalAmount, 2650000);
      assert.equal(inv.discountTotal, 1500000);
    });

    test('FR-005, FR-006 & FR-007: October invoice creation automatically deducts September meal refund (100.000đ) and synchronizes VietQR payload', () => {
      const state = invoiceReducer(undefined, { type: '@@INIT' });

      // Create October invoice for student hs-001 (Nguyen Gia Huy)
      const newState = invoiceReducer(
        state,
        createBatchInvoices({
          scope: 'hoc_sinh',
          studentId: 'hs-001',
          billingMonth: '2026-10',
          title: 'Hóa đơn học phí tháng 10/2026',
          issueDate: '01/10/2026',
          dueDate: '15/10/2026',
          exportElectronicInvoice: true,
          autoApplyDiscount: false,
          autoApplyMealRefund: true,
          mealRefundRates: {
            mainMealRatePercent: 50,
            breakfastRatePercent: 70,
          },
          items: [
            {
              feeItemId: 'fee-sys-001',
              category: 'hoc_phi',
              name: 'Học phí chính khóa tháng 10/2026',
              unitPrice: 2500000,
              quantity: 1,
              discountPercent: 0,
              isRequired: true,
            },
            {
              feeItemId: 'fee-sys-002',
              category: 'tien_an',
              name: 'Tiền ăn bán trú tháng 10/2026',
              unitPrice: 40000,
              quantity: 22, // 22 days * 40k = 880,000 đ
              discountPercent: 0,
              isRequired: true,
              isMealFee: true,
            },
          ],
        })
      );

      const inv = newState.invoices.find((i) => i.studentId === 'hs-001' && i.billingMonth === '2026-10');
      assert.ok(inv, 'October invoice must exist');

      const mealLine = inv.items.find((it) => it.category === 'tien_an');
      assert.ok(mealLine, 'Meal line item must exist');

      // Gross meal fee: 22 * 40k = 880,000 đ
      // September refund deduction: 3 self-absence days (50% = 60k) = 60,000 đ
      // Net meal fee: 880k - 60k = 820,000 đ
      assert.equal(mealLine.unitPrice * mealLine.quantity, 880000);
      assert.equal(mealLine.discountAmount, 60000);
      assert.equal(mealLine.amount, 820000);

      // Verify itemized deduction description text
      assert.match(mealLine.description, /Khấu trừ hoàn tiền ăn T09\/2026: -60\.000 đ/);
      assert.match(mealLine.description, /3 ngày nghỉ có phép \[50%\]: -60\.000 đ/);

      // Total invoice amount: 2,500,000 + 820,000 = 3,320,000 đ
      assert.equal(inv.subtotal, 3380000);
      assert.equal(inv.discountTotal, 60000);
      assert.equal(inv.totalAmount, 3320000);

      // VietQR payload verification
      assert.equal(inv.vietQRData.transferContent, `HOCPHI ${inv.invoiceNo}`);
      assert.ok(inv.vietQRData.qrImageUrl);
    });

    test('BR-INV-12: Multi-Student Batch Invoice Generation (Class Scope) applies meal refund ONLY to eligible students', () => {
      const state = invoiceReducer(undefined, { type: '@@INIT' });

      // Create October invoices for class lop-6a1 (contains hs-601, hs-602, hs-603, hs-604)
      const newState = invoiceReducer(
        state,
        createBatchInvoices({
          scope: 'lop_hoc',
          classId: 'lop-6a1',
          classIds: ['lop-6a1'],
          billingMonth: '2026-10',
          title: 'Hóa đơn học phí tháng 10/2026 - Lớp 6A1',
          issueDate: '01/10/2026',
          dueDate: '15/10/2026',
          exportElectronicInvoice: true,
          autoApplyDiscount: false,
          autoApplyMealRefund: true,
          mealRefundRates: {
            mainMealRatePercent: 50,
            breakfastRatePercent: 70,
          },
          items: [
            {
              feeItemId: 'fee-sys-001',
              category: 'hoc_phi',
              name: 'Học phí chính khóa tháng 10/2026',
              unitPrice: 2500000,
              quantity: 1,
              discountPercent: 0,
              isRequired: true,
            },
            {
              feeItemId: 'fee-sys-002',
              category: 'tien_an',
              name: 'Tiền ăn bán trú tháng 10/2026',
              unitPrice: 40000,
              quantity: 22, // 22 * 40k = 880,000 đ
              discountPercent: 0,
              isRequired: true,
              isMealFee: true,
            },
            {
              feeItemId: 'fee-cust-022',
              category: 'tien_an_sang',
              name: 'Tiền ăn sáng tháng 10/2026',
              unitPrice: 20000,
              quantity: 22, // 22 * 20k = 440,000 đ
              discountPercent: 0,
              isRequired: false,
              isMealFee: true,
            },
          ],
        })
      );

      // 1. Check Lê Hoàng Cường (hs-603): has 3 self-absence days
      // Main meal refund: 3 * 40k * 50% = 60,000 đ
      // Breakfast refund: 3 * 20k * 70% = 42,000 đ
      // Total meal refund = 102,000 đ
      const cuongInv = newState.invoices.find((i) => i.studentId === 'hs-603' && i.billingMonth === '2026-10');
      assert.ok(cuongInv, 'Invoice for Le Hoang Cuong must exist');
      
      const cuongMainMeal = cuongInv.items.find((it) => it.category === 'tien_an');
      assert.ok(cuongMainMeal);
      assert.equal(cuongMainMeal.discountAmount, 60000);
      assert.equal(cuongMainMeal.amount, 820000);

      const cuongBfMeal = cuongInv.items.find((it) => it.category === 'tien_an_sang');
      assert.ok(cuongBfMeal);
      assert.equal(cuongBfMeal.discountAmount, 42000);
      assert.equal(cuongBfMeal.amount, 398000);

      assert.equal(cuongInv.discountTotal, 102000);
      assert.equal(cuongInv.totalAmount, 2500000 + 820000 + 398000); // 3,718,000 đ

      // 2. Check Nguyễn Văn An (hs-601): has NO absence in mock data
      // Standard full pricing: Học phí 2.500.000 + Tiền ăn 880.000 + Tiền ăn sáng 440.000 = 3.820.000 đ
      const anInv = newState.invoices.find((i) => i.studentId === 'hs-601' && i.billingMonth === '2026-10');
      assert.ok(anInv, 'Invoice for Nguyen Van An must exist');

      const anMainMeal = anInv.items.find((it) => it.category === 'tien_an');
      assert.ok(anMainMeal);
      assert.equal(anMainMeal.discountAmount, 0);
      assert.equal(anMainMeal.amount, 880000);

      const anBfMeal = anInv.items.find((it) => it.category === 'tien_an_sang');
      assert.ok(anBfMeal);
      assert.equal(anBfMeal.discountAmount, 0);
      assert.equal(anBfMeal.amount, 440000);

      assert.equal(anInv.discountTotal, 0);
      assert.equal(anInv.totalAmount, 3820000);
    });

    test('TASK-FIN-034: Only applies meal refunds for categories present in invoice line items (excluding breakfast when not chosen)', () => {
      const state = invoiceReducer(undefined, { type: '@@INIT' });

      // Create invoice for Le Hoang Cuong (hs-603) with ONLY Main Meal (NO breakfast)
      const action = createBatchInvoices({
        scope: 'hoc_sinh',
        studentId: 'hs-603',
        billingMonth: '2026-10',
        title: 'Hóa đơn tháng 10/2026 - Lê Hoàng Cường',
        dueDate: '2026-10-15',
        creatorName: 'Kế toán trưởng',
        schoolCode: 'demo',
        status: 'draft',
        items: [
          {
            feeItemId: 'fee-sys-001',
            category: 'hoc_phi',
            name: 'Học phí chính khóa tháng 10/2026',
            unitPrice: 2500000,
            quantity: 1,
            discountPercent: 0,
            isRequired: true,
            isMealFee: false,
          },
          {
            feeItemId: 'fee-sys-002',
            category: 'tien_an',
            name: 'Tiền ăn bán trú tháng 10/2026',
            unitPrice: 40000,
            quantity: 22, // 880,000 đ
            discountPercent: 0,
            isRequired: true,
            isMealFee: true,
          },
        ],
      });

      const newState = invoiceReducer(state, action);
      const cuongInv = newState.invoices.find((i) => i.studentId === 'hs-603' && i.billingMonth === '2026-10');
      assert.ok(cuongInv);

      // Only 60k refund for main meal applied, 42k breakfast refund is NOT applied
      const cuongMainMeal = cuongInv.items.find((it) => it.category === 'tien_an');
      assert.ok(cuongMainMeal);
      assert.equal(cuongMainMeal.discountAmount, 60000);
      assert.equal(cuongMainMeal.amount, 820000);

      assert.equal(cuongInv.discountTotal, 60000);
      assert.equal(cuongInv.totalAmount, 2500000 + 820000); // 3,320,000 đ

      // Total payable calculation verification
      const grossSubtotal = 2500000 + 880000; // 3,380,000 đ
      const payableAmount = grossSubtotal - cuongInv.discountTotal;
      assert.equal(payableAmount, 3320000);
    });

  });

});

