import test from 'node:test';
import assert from 'node:assert/strict';

import {
  formatFeeReportCurrency,
  calculateCollectionRate,
  isInvoiceOverdue,
  calculateClassOverviewRows,
  filterPaidInvoices,
  filterPartialInvoices,
  filterUnpaidInvoices,
} from '../../src/utils/feeReportValidation.ts';

import {
  mockFeeReportInvoices,
  defaultFeeReportFilter,
} from '../../src/services/mockFeeReportData.ts';

import feeReportReducer, {
  setActiveTab,
  setDateRange,
  setClassFilter,
  setStudentSearch,
  setPaymentMethodFilter,
  setUnpaidStatusFilter,
  toggleOverdueOnly,
  setOverdueOnly,
  openPaymentHistoryModal,
  closePaymentHistoryModal,
  resetFilters,
} from '../../src/store/slices/feeReportSlice.ts';

test('Finance Fee Collection Reports & Analytics (Báo Cáo Học Phí) Business Rules & Engine', async (t) => {
  await t.test('BR09 & NFR03: Currency and percentage calculations', () => {
    assert.equal(formatFeeReportCurrency(1199407125), '1.199.407.125 Đ');
    assert.equal(formatFeeReportCurrency(0), '0 Đ');
    assert.equal(formatFeeReportCurrency(500000), '500.000 Đ');
    assert.equal(formatFeeReportCurrency(1200000), '1.200.000 Đ');

    assert.equal(calculateCollectionRate(500000, 1000000), 50);
    assert.equal(calculateCollectionRate(854000, 1000000), 85.4);
    assert.equal(calculateCollectionRate(0, 1000000), 0);
    assert.equal(calculateCollectionRate(1000, 0), 0);
  });

  await t.test('BR05: Overdue invoice detection logic', () => {
    const overdueInvoice = {
      id: 'test-inv-overdue',
      status: 'da_gui',
      dueDate: '05/09/2026',
    };
    const notOverdueInvoice = {
      id: 'test-inv-not-overdue',
      status: 'da_gui',
      dueDate: '30/09/2026',
    };
    const paidInvoice = {
      id: 'test-inv-paid',
      status: 'da_thanh_toan',
      dueDate: '01/09/2026',
    };

    // Reference date: 2026-09-22
    assert.equal(isInvoiceOverdue(overdueInvoice, '2026-09-22'), true);
    assert.equal(isInvoiceOverdue(notOverdueInvoice, '2026-09-22'), false);
    assert.equal(isInvoiceOverdue(paidInvoice, '2026-09-22'), false);
  });

  await t.test('BR02: Class overview grouping, archived student row, and totals calculation', () => {
    const { rows, totals, kpis } = calculateClassOverviewRows(mockFeeReportInvoices, 'all');

    assert.ok(rows.length > 0, 'Overview rows should not be empty');
    
    // Verify presence of dedicated archived / deleted students row
    const archivedRow = rows.find((r) => r.isArchivedGroup);
    assert.ok(archivedRow, 'Must include dedicated "Học sinh lưu trữ / đã xoá" row (BR02)');
    assert.equal(archivedRow.className, 'Học sinh lưu trữ / đã xoá');
    assert.ok(archivedRow.totalInvoices > 0, 'Archived row should include archived invoices');

    // Totals row checks
    assert.equal(totals.className, 'Tổng cộng');
    assert.ok(totals.totalInvoices > 0);
    assert.ok(totals.totalAmount > 0);
    assert.equal(totals.totalInvoices, kpis.totalInvoices);
    assert.equal(totals.totalAmount, kpis.totalAmount);
    assert.equal(totals.paidAmount + totals.partialAmount, kpis.totalCollected);

    // Filter by specific class
    const singleClassResult = calculateClassOverviewRows(mockFeeReportInvoices, 'lop-6a1');
    assert.equal(singleClassResult.rows.length, 1);
    assert.equal(singleClassResult.rows[0].classId, 'lop-6a1');
  });

  await t.test('BR03: Paid invoices filtered by confirmation date and payment method', () => {
    // Filter with date range covering 10/09/2026
    const criteria = {
      ...defaultFeeReportFilter,
      dateFrom: '2026-09-08',
      dateTo: '2026-09-12',
      paymentMethod: 'all',
    };
    const paidInvoices = filterPaidInvoices(mockFeeReportInvoices, criteria);
    assert.ok(paidInvoices.length > 0, 'Should find paid invoices in confirmation window');
    paidInvoices.forEach((inv) => {
      assert.equal(inv.status, 'da_thanh_toan');
    });

    // Filter with non-matching confirmation date window
    const pastCriteria = {
      ...defaultFeeReportFilter,
      dateFrom: '2025-01-01',
      dateTo: '2025-01-05',
    };
    const emptyPaidInvoices = filterPaidInvoices(mockFeeReportInvoices, pastCriteria);
    assert.equal(emptyPaidInvoices.length, 0, 'Should return 0 records for non-matching date');

    // Filter by payment method
    const sepayCriteria = {
      ...defaultFeeReportFilter,
      paymentMethod: 'cong_sepay',
    };
    const sepayInvoices = filterPaidInvoices(mockFeeReportInvoices, sepayCriteria);
    assert.ok(sepayInvoices.length > 0);
  });

  await t.test('BR04: Partial invoices filtering and stacked amounts', () => {
    const partialInvoices = filterPartialInvoices(mockFeeReportInvoices, defaultFeeReportFilter);
    assert.ok(partialInvoices.length > 0);
    partialInvoices.forEach((inv) => {
      assert.equal(inv.status, 'thanh_toan_mot_phan');
      assert.ok(inv.totalAmount > inv.remainingAmount, 'Total should be greater than remaining');
      assert.ok(inv.paidAmount > 0, 'Paid amount should be greater than 0');
    });
  });

  await t.test('BR05: Unpaid invoices filtering with status and overdue toggle', () => {
    // 1. Unpaid with status 'da_gui'
    const sentCriteria = {
      ...defaultFeeReportFilter,
      unpaidStatus: 'da_gui',
      isOverdueOnly: false,
    };
    const sentInvoices = filterUnpaidInvoices(mockFeeReportInvoices, sentCriteria);
    assert.ok(sentInvoices.length > 0);
    sentInvoices.forEach((inv) => {
      assert.equal(inv.status, 'da_gui');
    });

    // 2. Unpaid with status 'da_tao'
    const draftCriteria = {
      ...defaultFeeReportFilter,
      unpaidStatus: 'da_tao',
      isOverdueOnly: false,
    };
    const draftInvoices = filterUnpaidInvoices(mockFeeReportInvoices, draftCriteria);
    assert.ok(draftInvoices.length > 0);
    draftInvoices.forEach((inv) => {
      assert.equal(inv.status, 'da_tao');
    });

    // 3. Unpaid with isOverdueOnly = true
    const overdueCriteria = {
      ...defaultFeeReportFilter,
      unpaidStatus: 'all',
      isOverdueOnly: true,
    };
    const overdueInvoices = filterUnpaidInvoices(mockFeeReportInvoices, overdueCriteria, '2026-09-22');
    assert.ok(overdueInvoices.length > 0);
    overdueInvoices.forEach((inv) => {
      assert.ok(isInvoiceOverdue(inv, '2026-09-22'), 'Invoice must be overdue');
    });
  });

  await t.test('BR01: Redux state setActiveTab resets date range to default current month', () => {
    const initialState = {
      invoices: mockFeeReportInvoices,
      activeTab: 'overview',
      filters: {
        ...defaultFeeReportFilter,
        dateFrom: '2025-01-01', // Custom date
        dateTo: '2025-01-31',
        studentSearch: 'test',
      },
      selectedInvoiceForHistory: null,
      isHistoryModalOpen: false,
    };

    // Switch tab to 'paid' -> Should reset date range to 2026-09-01 / 2026-09-30 per BR01
    const nextState = feeReportReducer(initialState, setActiveTab('paid'));
    assert.equal(nextState.activeTab, 'paid');
    assert.equal(nextState.filters.dateFrom, '2026-09-01');
    assert.equal(nextState.filters.dateTo, '2026-09-30');
    assert.equal(nextState.filters.studentSearch, '');
  });

  await t.test('BR06: Redux state openPaymentHistoryModal and closePaymentHistoryModal', () => {
    const initialState = {
      invoices: mockFeeReportInvoices,
      activeTab: 'partial',
      filters: defaultFeeReportFilter,
      selectedInvoiceForHistory: null,
      isHistoryModalOpen: false,
    };

    const targetInvoice = mockFeeReportInvoices[1]; // Partial payment invoice
    const openedState = feeReportReducer(initialState, openPaymentHistoryModal(targetInvoice));
    assert.equal(openedState.isHistoryModalOpen, true);
    assert.equal(openedState.selectedInvoiceForHistory?.id, targetInvoice.id);

    const closedState = feeReportReducer(openedState, closePaymentHistoryModal());
    assert.equal(closedState.isHistoryModalOpen, false);
    assert.equal(closedState.selectedInvoiceForHistory, null);
  });

  await t.test('Redux state filter toggles: class, search, method, and overdue toggle', () => {
    let state = feeReportReducer(undefined, setClassFilter('lop-6a1'));
    assert.equal(state.filters.classId, 'lop-6a1');

    state = feeReportReducer(state, setStudentSearch('An'));
    assert.equal(state.filters.studentSearch, 'An');

    state = feeReportReducer(state, setPaymentMethodFilter('cong_sepay'));
    assert.equal(state.filters.paymentMethod, 'cong_sepay');

    state = feeReportReducer(state, toggleOverdueOnly());
    assert.equal(state.filters.isOverdueOnly, true);

    state = feeReportReducer(state, toggleOverdueOnly());
    assert.equal(state.filters.isOverdueOnly, false);

    state = feeReportReducer(state, resetFilters());
    assert.equal(state.filters.classId, 'all');
    assert.equal(state.filters.studentSearch, '');
  });
});
