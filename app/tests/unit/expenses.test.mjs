import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatExpenseAmount,
  calculateLineItemTotal,
  calculateVoucherTotal,
  canCancelVoucher,
  canConfirmDisbursement,
  canApproveVoucher,
  canDeleteCategory,
  filterVouchers,
  validateCreateVoucher,
  validateCancelVoucher,
} from '../../src/utils/expenseValidation.ts';
import expenseReducer, {
  createVoucher,
  confirmDisbursement,
  approveVoucher,
  cancelVoucher,
  createCategory,
  deleteCategory,
} from '../../src/store/slices/expenseSlice.ts';
import { INITIAL_EXPENSE_VOUCHERS, INITIAL_EXPENSE_CATEGORIES } from '../../src/services/mockExpenseData.ts';

test('Finance Expenses & Disbursements (Khoản Chi) Business Rules & Engine', async (t) => {
  await t.test('formatExpenseAmount formats numbers with Vietnamese thousands dot separators', () => {
    assert.equal(formatExpenseAmount(1850000), '1.850.000 Đ');
    assert.equal(formatExpenseAmount(5400000), '5.400.000 Đ');
    assert.equal(formatExpenseAmount(0), '0 Đ');
    assert.equal(formatExpenseAmount(1850000, false), '1.850.000');
  });

  await t.test('BR04: Line item total and aggregate voucher total calculation', () => {
    assert.equal(calculateLineItemTotal(45000, 10), 450000);
    assert.equal(calculateLineItemTotal(120000, 30), 3600000);
    assert.equal(calculateLineItemTotal(-1000, 5), 0); // negative guard

    const lines = [
      { unitPrice: 45000, quantity: 10 },
      { unitPrice: 800000, quantity: 1 },
      { unitPrice: 600000, quantity: 1 },
    ];
    assert.equal(calculateVoucherTotal(lines), 1850000);
  });

  await t.test('BR05: Lifecycle transition permissions (da_tao -> da_duyet -> da_chi, da_huy)', () => {
    // Can cancel only in da_tao and da_duyet
    assert.equal(canCancelVoucher('da_tao'), true);
    assert.equal(canCancelVoucher('da_duyet'), true);
    assert.equal(canCancelVoucher('da_chi'), false); // Disbursed vouchers cannot be cancelled
    assert.equal(canCancelVoucher('da_huy'), false);

    // Can confirm disbursement only in da_duyet
    assert.equal(canConfirmDisbursement('da_duyet'), true);
    assert.equal(canConfirmDisbursement('da_tao'), false);
    assert.equal(canConfirmDisbursement('da_chi'), false);
    assert.equal(canConfirmDisbursement('da_huy'), false);

    // Can approve only in da_tao
    assert.equal(canApproveVoucher('da_tao'), true);
    assert.equal(canApproveVoucher('da_duyet'), false);
    assert.equal(canApproveVoucher('da_chi'), false);
  });

  await t.test('BR08: System default category "Mặc định" is locked from deletion', () => {
    const defaultCat = { id: 'cat-default', name: 'Mặc định', isSystemDefault: true, description: '', appliedCount: 1 };
    const customCat = { id: 'cat-uniform', name: 'Đồng phục', isSystemDefault: false, description: '', appliedCount: 5 };

    assert.equal(canDeleteCategory(defaultCat), false);
    assert.equal(canDeleteCategory(customCat), true);
  });

  await t.test('BR07: Mandatory single-month filtering and multi-criteria filtering', () => {
    const vouchers = [...INITIAL_EXPENSE_VOUCHERS];

    // Filter by December 2025
    const decResults = filterVouchers(vouchers, {
      selectedMonth: '2025-12',
      searchKeyword: '',
      voucherType: 'all',
      status: 'all',
    });
    assert.equal(decResults.length, 4);

    // Filter by September 2026
    const sepResults = filterVouchers(vouchers, {
      selectedMonth: '2026-09',
      searchKeyword: '',
      voucherType: 'all',
      status: 'all',
    });
    assert.equal(sepResults.length, 1);
    assert.equal(sepResults[0].voucherCode, 'PC-202609-001');

    // Filter by Type: hoan_tien
    const refundResults = filterVouchers(vouchers, {
      selectedMonth: '2025-12',
      searchKeyword: '',
      voucherType: 'hoan_tien',
      status: 'all',
    });
    assert.equal(refundResults.length, 2);

    // Filter by Status: da_duyet
    const approvedResults = filterVouchers(vouchers, {
      selectedMonth: '2025-12',
      searchKeyword: '',
      voucherType: 'all',
      status: 'da_duyet',
    });
    assert.equal(approvedResults.length, 1);
    assert.equal(approvedResults[0].voucherCode, 'PC-202512-001');

    // Search by keyword: Cao Ngọc Minh
    const searchResults = filterVouchers(vouchers, {
      selectedMonth: '2025-12',
      searchKeyword: 'Cao Ngọc Minh',
      voucherType: 'all',
      status: 'all',
    });
    assert.equal(searchResults.length, 1);
    assert.equal(searchResults[0].targetName, 'Cao Ngọc Minh');
  });

  await t.test('Validation: validateCreateVoucher and validateCancelVoucher', () => {
    // Missing required fields
    const invalidData = {
      title: '',
      voucherType: 'hoan_tien',
      categoryId: '',
      targetType: 'hoc_sinh',
      targetId: '',
      targetName: '',
      recipientName: '',
      createdDate: '',
      lineItems: [],
    };
    const check1 = validateCreateVoucher(invalidData);
    assert.equal(check1.isValid, false);
    assert.ok(check1.errors.title);
    assert.ok(check1.errors.createdDate);
    assert.ok(check1.errors.lineItems);

    // Valid data
    const validData = {
      title: 'Hoàn tiền học phí đợt 2',
      voucherType: 'hoan_tien',
      categoryId: 'cat-tuition',
      targetType: 'hoc_sinh',
      targetId: 'HS-0012',
      targetName: 'Cao Ngọc Minh',
      recipientName: 'Nguyễn Văn Toàn',
      createdDate: '2025-12-20',
      lineItems: [{ content: 'Hoàn học phí', unitPrice: 500000, quantity: 1, unit: 'tháng' }],
    };
    const check2 = validateCreateVoucher(validData);
    assert.equal(check2.isValid, true);

    // Cancel voucher reason validation
    assert.equal(validateCancelVoucher('').isValid, false);
    assert.equal(validateCancelVoucher('Phụ huynh rút yêu cầu').isValid, true);
  });

  await t.test('Redux State: BR06 creation flows ("Lưu nháp" vs "Lưu & Duyệt chi")', () => {
    const initialState = {
      vouchers: [...INITIAL_EXPENSE_VOUCHERS],
      categories: [...INITIAL_EXPENSE_CATEGORIES],
      selectedMonth: '2025-12',
      searchKeyword: '',
      selectedType: 'all',
      selectedStatus: 'all',
      isCategoryModalOpen: false,
      isCancelModalOpen: false,
      targetVoucherIdForCancel: null,
    };

    // Flow 1: Lưu nháp -> da_tao
    const draftState = expenseReducer(
      initialState,
      createVoucher({
        data: {
          title: 'Chi mua sắm giấy A4',
          voucherType: 'khac',
          categoryId: 'cat-facilities',
          targetType: 'nhan_vien',
          targetId: 'NV-007',
          targetName: 'Nguyễn Minh Trí',
          recipientName: 'Nguyễn Minh Trí',
          createdDate: '2025-12-25',
          lineItems: [{ content: 'Giấy A4 Double A', unitPrice: 70000, quantity: 10, unit: 'ram' }],
        },
        immediateApprove: false,
      })
    );
    assert.equal(draftState.vouchers[0].status, 'da_tao');
    assert.equal(draftState.vouchers[0].totalAmount, 700000);

    // Flow 2: Lưu & Duyệt chi -> da_duyet immediately
    const approvedState = expenseReducer(
      initialState,
      createVoucher({
        data: {
          title: 'Hoàn tiền học phí khẩn cấp',
          voucherType: 'hoan_tien',
          categoryId: 'cat-tuition',
          targetType: 'hoc_sinh',
          targetId: 'HS-0012',
          targetName: 'Cao Ngọc Minh',
          recipientName: 'Nguyễn Văn Toàn',
          createdDate: '2025-12-25',
          lineItems: [{ content: 'Hoàn tiền bán trú', unitPrice: 300000, quantity: 1, unit: 'tháng' }],
        },
        immediateApprove: true,
      })
    );
    assert.equal(approvedState.vouchers[0].status, 'da_duyet');
    assert.ok(approvedState.vouchers[0].approvedBy);
  });

  await t.test('Redux State: Approval, Confirmation, and Cancellation transitions', () => {
    const initialState = {
      vouchers: JSON.parse(JSON.stringify(INITIAL_EXPENSE_VOUCHERS)),
      categories: [...INITIAL_EXPENSE_CATEGORIES],
      selectedMonth: '2025-12',
      searchKeyword: '',
      selectedType: 'all',
      selectedStatus: 'all',
      isCategoryModalOpen: false,
      isCancelModalOpen: false,
      targetVoucherIdForCancel: null,
    };

    // 1. Confirm disbursement for PC-202512-001 (was da_duyet)
    const disbursedState = expenseReducer(
      initialState,
      confirmDisbursement({ voucherId: 'PC-202512-001', staffName: 'Thủ quỹ Phạm Thu Hà' })
    );
    const v1 = disbursedState.vouchers.find((v) => v.id === 'PC-202512-001');
    assert.equal(v1.status, 'da_chi');
    assert.equal(v1.disbursedBy, 'Thủ quỹ Phạm Thu Hà');
    assert.ok(v1.disbursedDate);

    // Cannot cancel an already disbursed voucher
    const tryCancelDisbursed = expenseReducer(
      disbursedState,
      cancelVoucher({ voucherId: 'PC-202512-001', reason: 'Muốn hủy' })
    );
    const v1AfterTry = tryCancelDisbursed.vouchers.find((v) => v.id === 'PC-202512-001');
    assert.equal(v1AfterTry.status, 'da_chi'); // preserved da_chi

    // 2. Approve draft voucher PC-202512-003 (was da_tao)
    const approvedState = expenseReducer(
      initialState,
      approveVoucher({ voucherId: 'PC-202512-003', staffName: 'Hiệu trưởng Lê Văn Thịnh' })
    );
    const v3 = approvedState.vouchers.find((v) => v.id === 'PC-202512-003');
    assert.equal(v3.status, 'da_duyet');
    assert.equal(v3.approvedBy, 'Hiệu trưởng Lê Văn Thịnh');

    // 3. Cancel voucher PC-202512-003 with reason
    const cancelledState = expenseReducer(
      approvedState,
      cancelVoucher({ voucherId: 'PC-202512-003', reason: 'Tạm dừng mua sắm đợt 2' })
    );
    const v3Cancelled = cancelledState.vouchers.find((v) => v.id === 'PC-202512-003');
    assert.equal(v3Cancelled.status, 'da_huy');
    assert.equal(v3Cancelled.cancelReason, 'Tạm dừng mua sắm đợt 2');
  });

  await t.test('Redux State: Category management and system default deletion guard', () => {
    const initialState = {
      vouchers: [...INITIAL_EXPENSE_VOUCHERS],
      categories: JSON.parse(JSON.stringify(INITIAL_EXPENSE_CATEGORIES)),
      selectedMonth: '2025-12',
      searchKeyword: '',
      selectedType: 'all',
      selectedStatus: 'all',
      isCategoryModalOpen: false,
      isCancelModalOpen: false,
      targetVoucherIdForCancel: null,
    };

    // Try to delete default category cat-default
    const tryDeleteDefault = expenseReducer(initialState, deleteCategory('cat-default'));
    assert.ok(tryDeleteDefault.categories.find((c) => c.id === 'cat-default')); // not deleted!

    // Delete custom category cat-uniform
    const afterDelete = expenseReducer(initialState, deleteCategory('cat-uniform'));
    assert.equal(afterDelete.categories.find((c) => c.id === 'cat-uniform'), undefined); // deleted!

    // Create new category
    const afterCreate = expenseReducer(
      initialState,
      createCategory({ name: 'Chi phí IT', description: 'Chi máy chủ và mạng' })
    );
    assert.ok(afterCreate.categories.find((c) => c.name === 'Chi phí IT'));
  });
});
