import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  ExpenseVoucher,
  ExpenseCategory,
  VoucherLifecycleStatus,
  VoucherType,
  CreateVoucherFormData,
  ExpenseLineItem,
} from '../../types/expense.ts';
import {
  INITIAL_EXPENSE_CATEGORIES,
  INITIAL_EXPENSE_VOUCHERS,
} from '../../services/mockExpenseData.ts';
import { calculateLineItemTotal, canCancelVoucher, canConfirmDisbursement, canDeleteCategory } from '../../utils/expenseValidation.ts';

export interface ExpenseState {
  vouchers: ExpenseVoucher[];
  categories: ExpenseCategory[];
  selectedMonth: string; // YYYY-MM
  searchKeyword: string;
  selectedType: 'all' | VoucherType;
  selectedStatus: 'all' | VoucherLifecycleStatus;
  isCategoryModalOpen: boolean;
  isCancelModalOpen: boolean;
  targetVoucherIdForCancel: string | null;
}

const initialState: ExpenseState = {
  vouchers: INITIAL_EXPENSE_VOUCHERS,
  categories: INITIAL_EXPENSE_CATEGORIES,
  selectedMonth: '2025-12', // Matches demo data month
  searchKeyword: '',
  selectedType: 'all',
  selectedStatus: 'all',
  isCategoryModalOpen: false,
  isCancelModalOpen: false,
  targetVoucherIdForCancel: null,
};

export const expenseSlice = createSlice({
  name: 'expense',
  initialState,
  reducers: {
    setSelectedMonth: (state, action: PayloadAction<string>) => {
      state.selectedMonth = action.payload;
    },
    setSearchKeyword: (state, action: PayloadAction<string>) => {
      state.searchKeyword = action.payload;
    },
    setSelectedType: (state, action: PayloadAction<'all' | VoucherType>) => {
      state.selectedType = action.payload;
    },
    setSelectedStatus: (state, action: PayloadAction<'all' | VoucherLifecycleStatus>) => {
      state.selectedStatus = action.payload;
    },
    setCategoryModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isCategoryModalOpen = action.payload;
    },
    openCancelModal: (state, action: PayloadAction<string>) => {
      state.targetVoucherIdForCancel = action.payload;
      state.isCancelModalOpen = true;
    },
    closeCancelModal: (state) => {
      state.targetVoucherIdForCancel = null;
      state.isCancelModalOpen = false;
    },
    // BR06: 2 entrypoints: "Lưu nháp" -> da_tao; "Lưu & Duyệt chi" -> da_duyet
    createVoucher: (
      state,
      action: PayloadAction<{
        data: CreateVoucherFormData;
        immediateApprove?: boolean;
        staffName?: string;
      }>
    ) => {
      const { data, immediateApprove, staffName = 'Kế toán Trần Thị Mai' } = action.payload;
      const cleanMonth = data.createdDate.substring(0, 7).replace('-', '');
      const countForMonth = state.vouchers.filter((v) => v.createdDate.startsWith(data.createdDate.substring(0, 7))).length + 1;
      const voucherCode = `PC-${cleanMonth}-${String(countForMonth).padStart(3, '0')}`;
      const nowStr = new Date().toISOString().substring(0, 16).replace('T', ' ');

      const category = state.categories.find((c) => c.id === data.categoryId);
      const categoryName = category ? category.name : 'Mặc định';

      const lineItems: ExpenseLineItem[] = data.lineItems.map((item, index) => {
        const total = calculateLineItemTotal(item.unitPrice, item.quantity);
        return {
          id: `li-${Date.now()}-${index}`,
          content: item.content,
          note: item.note,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
          unit: item.unit || 'lần',
          total,
        };
      });

      const totalAmount = lineItems.reduce((sum, item) => sum + item.total, 0);

      const status: VoucherLifecycleStatus = immediateApprove ? 'da_duyet' : 'da_tao';

      const newVoucher: ExpenseVoucher = {
        id: voucherCode,
        voucherCode,
        title: data.title,
        voucherType: data.voucherType,
        categoryId: data.categoryId,
        categoryName,
        targetType: data.targetType,
        targetId: data.targetId,
        targetName: data.targetName,
        targetSubInfo: data.targetSubInfo,
        recipientName: data.recipientName || data.targetName,
        recipientPhone: data.recipientPhone,
        createdDate: data.createdDate,
        status,
        lineItems,
        totalAmount,
        createdBy: staffName,
        approvedBy: immediateApprove ? 'Hiệu trưởng Lê Văn Thịnh' : undefined,
        approvedDate: immediateApprove ? nowStr : undefined,
        notes: data.notes,
      };

      state.vouchers.unshift(newVoucher);

      // Increment applied count of category
      if (category) {
        category.appliedCount += 1;
      }
    },
    // BR05: Confirm Disbursement (from da_duyet to da_chi)
    confirmDisbursement: (
      state,
      action: PayloadAction<{ voucherId: string; staffName?: string }>
    ) => {
      const { voucherId, staffName = 'Thủ quỹ Phạm Thu Hà' } = action.payload;
      const voucher = state.vouchers.find((v) => v.id === voucherId || v.voucherCode === voucherId);
      if (!voucher) return;

      if (canConfirmDisbursement(voucher.status)) {
        voucher.status = 'da_chi';
        voucher.disbursedBy = staffName;
        voucher.disbursedDate = new Date().toISOString().substring(0, 16).replace('T', ' ');
      }
    },
    // Approve Voucher (from da_tao to da_duyet)
    approveVoucher: (
      state,
      action: PayloadAction<{ voucherId: string; staffName?: string }>
    ) => {
      const { voucherId, staffName = 'Hiệu trưởng Lê Văn Thịnh' } = action.payload;
      const voucher = state.vouchers.find((v) => v.id === voucherId || v.voucherCode === voucherId);
      if (!voucher) return;

      if (voucher.status === 'da_tao') {
        voucher.status = 'da_duyet';
        voucher.approvedBy = staffName;
        voucher.approvedDate = new Date().toISOString().substring(0, 16).replace('T', ' ');
      }
    },
    // BR05: Cancel Voucher with reason note
    cancelVoucher: (
      state,
      action: PayloadAction<{ voucherId: string; reason: string; staffName?: string }>
    ) => {
      const { voucherId, reason, staffName = 'Kế toán Trần Thị Mai' } = action.payload;
      const voucher = state.vouchers.find((v) => v.id === voucherId || v.voucherCode === voucherId);
      if (!voucher) return;

      if (canCancelVoucher(voucher.status)) {
        voucher.status = 'da_huy';
        voucher.cancelReason = reason;
        voucher.cancelledBy = staffName;
        voucher.cancelledDate = new Date().toISOString().substring(0, 16).replace('T', ' ');
      }
      state.isCancelModalOpen = false;
      state.targetVoucherIdForCancel = null;
    },
    // Create new custom Category
    createCategory: (
      state,
      action: PayloadAction<{ name: string; description: string }>
    ) => {
      const { name, description } = action.payload;
      const newCategory: ExpenseCategory = {
        id: `cat-${Date.now()}`,
        name: name.trim(),
        description: description.trim(),
        isSystemDefault: false,
        appliedCount: 0,
      };
      state.categories.push(newCategory);
    },
    // Update Category
    updateCategory: (
      state,
      action: PayloadAction<{ id: string; name: string; description: string }>
    ) => {
      const { id, name, description } = action.payload;
      const cat = state.categories.find((c) => c.id === id);
      if (cat) {
        // If not system default, allow renaming
        if (!cat.isSystemDefault) {
          cat.name = name.trim();
        }
        cat.description = description.trim();
      }
    },
    // Delete Category (guarded by BR08)
    deleteCategory: (state, action: PayloadAction<string>) => {
      const categoryId = action.payload;
      const cat = state.categories.find((c) => c.id === categoryId);
      if (cat && canDeleteCategory(cat)) {
        state.categories = state.categories.filter((c) => c.id !== categoryId);
      }
    },
  },
});

export const {
  setSelectedMonth,
  setSearchKeyword,
  setSelectedType,
  setSelectedStatus,
  setCategoryModalOpen,
  openCancelModal,
  closeCancelModal,
  createVoucher,
  confirmDisbursement,
  approveVoucher,
  cancelVoucher,
  createCategory,
  updateCategory,
  deleteCategory,
} = expenseSlice.actions;

export default expenseSlice.reducer;
