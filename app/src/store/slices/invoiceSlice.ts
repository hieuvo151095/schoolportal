/**
 * Redux Slice for Finance - Tuition Invoices (Học Phí)
 * Governance: Marcus Fleet V34 / Constitution V1.0.0
 * References:
 * - docs_legacy/operating-portal/tai-chinh/hoc-phi.md (BR01 - BR11)
 * - TASK-FIN-001 & TASK-FIN-002
 */

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  InvoiceRecord,
  InvoiceLifecycleStatus,
  InvoiceFilterCriteria,
  InvoiceLineItem,
  PaymentMethod,
  PaymentHistoryEntry,
  CreateInvoiceFormData,
  StudentBillingRosterItem,
} from '../../types/invoice.ts';
import {
  mockInvoices,
  mockStudentsRoster,
  mockFeeClasses,
} from '../../services/mockInvoiceData.ts';
import {
  calculateInvoiceTotals,
  calculateLineItemTotal,
  resolveInvoiceStatus,
  generateVietQRPayload,
} from '../../utils/invoiceValidation.ts';
import { INITIAL_DISCOUNT_POLICIES } from '../../services/mockDiscountData.ts';
import { resolveStudentDiscounts } from '../../utils/discountValidation.ts';
import { getStudentAbsenceBreakdown } from '../../services/mockMealRefundData.ts';
import { calculateMealRefundForStudent, getPreviousMonthKey } from '../../utils/mealRefundCalculation.ts';

const mapCategoryToFeeItemId = (category: string, name: string, feeItemId?: string): string => {
  if (feeItemId) return feeItemId;
  const lowerName = (name || '').toLowerCase();
  if (lowerName.includes('2a8')) return 'fee-cust-006';
  if (lowerName.includes('xe đưa đón') || lowerName.includes('xe buýt') || lowerName.includes('đưa đón')) return 'fee-cust-003';
  if (category === 'hoc_phi' || lowerName.includes('học phí')) return 'fee-sys-001';
  if (category === 'tien_an' || lowerName.includes('tiền ăn')) return 'fee-sys-002';
  if (category === 'phi_tra_tre' || lowerName.includes('trả trẻ') || lowerName.includes('trông trễ')) return 'fee-sys-003';
  if (lowerName.includes('steam')) return 'fee-cust-001';
  if (lowerName.includes('tiếng anh')) return 'fee-cust-002';
  if (lowerName.includes('đồng phục hè')) return 'fee-cust-004';
  if (lowerName.includes('test khoản mới')) return 'fee-cust-005';
  if (lowerName.includes('theo chuyến')) return 'fee-cust-006';
  if (lowerName.includes('bán trú')) return 'fee-cust-007';
  if (lowerName.includes('bơi')) return 'fee-cust-008';
  if (lowerName.includes('kỹ năng')) return 'fee-cust-009';
  if (lowerName.includes('thể thao')) return 'fee-cust-010';
  if (lowerName.includes('dã ngoại')) return 'fee-cust-011';
  if (lowerName.includes('cờ vua')) return 'fee-cust-012';
  if (lowerName.includes('âm nhạc')) return 'fee-cust-013';
  if (lowerName.includes('bảo hiểm')) return 'fee-cust-014';
  if (lowerName.includes('sách')) return 'fee-cust-015';
  if (lowerName.includes('khám sức khỏe')) return 'fee-cust-016';
  if (lowerName.includes('nước uống')) return 'fee-cust-018';
  if (lowerName.includes('đoàn đội')) return 'fee-cust-019';
  if (lowerName.includes('cambridge')) return 'fee-cust-020';
  if (lowerName.includes('thẻ học sinh')) return 'fee-cust-021';
  return `fee-${category}`;
};

interface InvoiceState {
  invoices: InvoiceRecord[];
  students: Array<Omit<StudentBillingRosterItem, 'invoice'>>;
  selectedMonth: string;
  selectedClassId: string;
  selectedInvoiceIds: string[];
  activeInvoice: InvoiceRecord | null;
  filterCriteria: InvoiceFilterCriteria;
  isCreateModalOpen: boolean;
  isPaymentModalOpen: boolean;
  isFilterModalOpen: boolean;
  isCancelModalOpen: boolean;
  targetPaymentInvoice: InvoiceRecord | null;
  targetCancelInvoice: InvoiceRecord | null;
}

const initialFilterCriteria: InvoiceFilterCriteria = {
  searchKeyword: '',
  classId: 'lop-6a1',
  billingMonth: 'tat_ca',
  dateFilterType: 'createdAt',
  createdDateFrom: '2026-09-01',
  createdDateTo: '2026-09-30',
  status: 'tat_ca',
  gradeLevel: 'tat_ca',
  hasDeduction: null,
  hasElectronicInvoice: null,
  paymentMethod: 'tat_ca',
};

const initialState: InvoiceState = {
  invoices: mockInvoices,
  students: mockStudentsRoster,
  selectedMonth: '2026-09',
  selectedClassId: 'lop-6a1',
  selectedInvoiceIds: [],
  activeInvoice: null,
  filterCriteria: initialFilterCriteria,
  isCreateModalOpen: false,
  isPaymentModalOpen: false,
  isFilterModalOpen: false,
  isCancelModalOpen: false,
  targetPaymentInvoice: null,
  targetCancelInvoice: null,
};

export const invoiceSlice = createSlice({
  name: 'invoice',
  initialState,
  reducers: {
    setSelectedMonth: (state, action: PayloadAction<string>) => {
      state.selectedMonth = action.payload;
      state.filterCriteria.billingMonth = action.payload;
      state.selectedInvoiceIds = [];
    },

    setSelectedClassId: (state, action: PayloadAction<string>) => {
      state.selectedClassId = action.payload;
      state.filterCriteria.classId = action.payload;
      state.selectedInvoiceIds = [];
    },

    toggleSelectInvoice: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const index = state.selectedInvoiceIds.indexOf(id);
      if (index >= 0) {
        state.selectedInvoiceIds.splice(index, 1);
      } else {
        state.selectedInvoiceIds.push(id);
      }
    },

    toggleSelectAllInvoices: (state, action: PayloadAction<string[]>) => {
      const availableIds = action.payload;
      const allSelected = availableIds.every((id) =>
        state.selectedInvoiceIds.includes(id)
      );
      if (allSelected) {
        state.selectedInvoiceIds = state.selectedInvoiceIds.filter(
          (id) => !availableIds.includes(id)
        );
      } else {
        state.selectedInvoiceIds = Array.from(
          new Set([...state.selectedInvoiceIds, ...availableIds])
        );
      }
    },

    clearSelectedInvoices: (state) => {
      state.selectedInvoiceIds = [];
    },

    setActiveInvoice: (state, action: PayloadAction<InvoiceRecord | null>) => {
      state.activeInvoice = action.payload;
    },

    setFilterCriteria: (
      state,
      action: PayloadAction<Partial<InvoiceFilterCriteria>>
    ) => {
      state.filterCriteria = {
        ...state.filterCriteria,
        ...action.payload,
      };
      if (action.payload.classId) {
        state.selectedClassId = action.payload.classId;
      }
      if (action.payload.billingMonth) {
        state.selectedMonth = action.payload.billingMonth;
      }
    },

    setDateFilterType: (
      state,
      action: PayloadAction<'createdAt' | 'dueDate'>
    ) => {
      state.filterCriteria.dateFilterType = action.payload;
      state.selectedInvoiceIds = [];
    },

    setCreatedDateRange: (
      state,
      action: PayloadAction<{ from?: string; to?: string }>
    ) => {
      if (action.payload.from !== undefined) {
        state.filterCriteria.createdDateFrom = action.payload.from;
      }
      if (action.payload.to !== undefined) {
        state.filterCriteria.createdDateTo = action.payload.to;
      }
      state.selectedInvoiceIds = [];
    },

    resetFilterCriteria: (state) => {
      state.filterCriteria = {
        ...initialFilterCriteria,
        classId: state.selectedClassId,
        billingMonth: state.selectedMonth,
        createdDateFrom: '2026-09-01',
        createdDateTo: '2026-09-30',
      };
      state.selectedInvoiceIds = [];
    },

    setCreateModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isCreateModalOpen = action.payload;
    },

    setPaymentModalOpen: (
      state,
      action: PayloadAction<{ isOpen: boolean; invoice?: InvoiceRecord | null }>
    ) => {
      state.isPaymentModalOpen = action.payload.isOpen;
      state.targetPaymentInvoice = action.payload.invoice || null;
    },

    setFilterModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isFilterModalOpen = action.payload;
    },

    setCancelModalOpen: (
      state,
      action: PayloadAction<{ isOpen: boolean; invoice?: InvoiceRecord | null }>
    ) => {
      state.isCancelModalOpen = action.payload.isOpen;
      state.targetCancelInvoice = action.payload.invoice || null;
    },

    /**
     * BR05: Create invoices for selected scope
     * Skips students who already have an invoice for that month.
     */
    createBatchInvoices: (state, action: PayloadAction<CreateInvoiceFormData>) => {
      const form = action.payload;

      // 1. Determine target students
      let targetStudents = state.students;
      if (form.scope === 'hoc_sinh' && form.studentId) {
        targetStudents = state.students.filter((s) => s.studentId === form.studentId);
      } else if (form.scope === 'lop_hoc') {
        const targetClassIds =
          form.classIds && form.classIds.length > 0
            ? form.classIds
            : form.classId
            ? [form.classId]
            : [];
        targetStudents = state.students.filter((s) => targetClassIds.includes(s.classId));
      } else if (form.scope === 'khoi_lop' && form.gradeLevel) {
        targetStudents = state.students.filter((s) => s.gradeLevel === form.gradeLevel);
      }

      // 2. Filter out students who already have an active invoice in this billingMonth (BR05)
      const eligibleStudents = targetStudents.filter((student) => {
        const existing = state.invoices.find(
          (inv) =>
            inv.studentId === student.studentId &&
            inv.billingMonth === form.billingMonth &&
            inv.status !== 'da_huy'
        );
        return !existing;
      });

      const nextInvoiceNumStart = state.invoices.length + 1;

      // 3. Construct invoices
      const newInvoices: InvoiceRecord[] = eligibleStudents.map((student, idx) => {
        const invoiceNum = nextInvoiceNumStart + idx;
        const invoiceNo = `HD${form.billingMonth.replace('-', '')}-${String(invoiceNum).padStart(3, '0')}`;

        // Check if discount policies apply to this student
        let appliedDiscounts: any[] = [];
        if (form.autoApplyDiscount !== false) {
          const discountCandidateFeeItems = form.items.map((item) => ({
            id: mapCategoryToFeeItemId(item.category, item.name, item.feeItemId),
            name: item.name,
            amount: item.unitPrice * item.quantity,
          }));

          const studentObj = {
            id: student.studentId,
            classId: student.classId,
            fullName: student.studentName,
          };

          appliedDiscounts = resolveStudentDiscounts(
            studentObj,
            discountCandidateFeeItems,
            form.discountPolicies || INITIAL_DISCOUNT_POLICIES,
            form.billingMonth
          );
        }

        // Check if student has previous-month meal fee refund to deduct (M+1 billing cycle)
        const prevMonthKey = getPreviousMonthKey(form.billingMonth);
        const studentAbsence = getStudentAbsenceBreakdown(student.studentId, prevMonthKey);
        let mealRefundSummary: any = null;

        if (studentAbsence && form.autoApplyMealRefund !== false) {
          const mealRates = form.mealRefundRates || { mainMealRatePercent: 50, breakfastRatePercent: 70 };
          mealRefundSummary = calculateMealRefundForStudent(
            studentAbsence,
            { mainMealUnitPrice: 40000, breakfastUnitPrice: 20000 },
            mealRates,
            form.billingMonth,
            form.refundableFees
          );
        }

        // Compute items
        const lineItems: InvoiceLineItem[] = form.items.map((item, itemIdx) => {
          const feeItemId = mapCategoryToFeeItemId(item.category, item.name, item.feeItemId);
          const matchedDiscount = appliedDiscounts.find((d) => d.feeItemId === feeItemId);

          let discountPercent = item.discountPercent;
          let manualDeduction = 0;
          let autoDeduction = 0;
          const isWaived = (item as any).isDiscountWaived || item.description?.includes('[Không áp dụng');

          let discountType: 'percent' | 'fixed_amount' = item.discountType || 'percent';

          if (item.discountType === 'fixed_amount' && item.discountAmount !== undefined) {
            manualDeduction = item.discountAmount;
          } else if (discountPercent > 0) {
            manualDeduction = Math.round((item.unitPrice * item.quantity * discountPercent) / 100);
          }

          if (!isWaived && matchedDiscount && matchedDiscount.deductionAmount > 0) {
            autoDeduction = matchedDiscount.deductionAmount;
            if (discountPercent === 0 && manualDeduction === 0) {
              discountType = matchedDiscount.discountType;
              if (matchedDiscount.discountType === 'percent') {
                discountPercent = matchedDiscount.discountValue;
              } else {
                discountPercent = Math.min(
                  100,
                  Math.round((autoDeduction / (item.unitPrice * item.quantity)) * 100)
                );
              }
            }
          }

          // Meal / Daily fee refund deduction for matching category or fee
          let mealRefundDeduction = 0;
          let mealRefundDesc = '';
          const lowerItemName = item.name.toLowerCase();

          if (mealRefundSummary) {
            // 1. Direct match by feeItemId / feeId / feeCode
            let matchedRefund = mealRefundSummary.items.find(
              (it: any) =>
                (feeItemId && (it.feeId === feeItemId || it.feeCode === feeItemId)) ||
                (item.feeItemId && (it.feeId === item.feeItemId || it.feeCode === item.feeItemId))
            );

            // 2. Specific matching for "Phí đưa đón 2A8"
            if (!matchedRefund && lowerItemName.includes('2a8')) {
              matchedRefund = mealRefundSummary.items.find(
                (it: any) =>
                  it.feeId === 'fee-cust-006' ||
                  it.feeCode === 'DUA_DON_2A8' ||
                  it.name.toLowerCase().includes('2a8')
              );
            }

            // 3. Match breakfast
            const isBreakfast =
              (item.category as string) === 'tien_an_sang' ||
              lowerItemName.includes('sáng') ||
              lowerItemName.includes('ăn sáng');

            if (!matchedRefund && isBreakfast) {
              matchedRefund = mealRefundSummary.items.find(
                (it: any) =>
                  it.category === 'tien_an_sang' ||
                  it.feeCode === 'TIEN_AN_SANG' ||
                  it.name.toLowerCase().includes('sáng')
              );
            }

            // 4. Match main meal
            const isMainMeal =
              (item.category === 'tien_an' ||
                item.isMealFee ||
                lowerItemName.includes('tiền ăn') ||
                lowerItemName.includes('bán trú')) &&
              !isBreakfast;

            if (!matchedRefund && isMainMeal) {
              matchedRefund = mealRefundSummary.items.find(
                (it: any) =>
                  it.category === 'tien_an' ||
                  it.feeCode === 'TIEN_AN' ||
                  it.name.toLowerCase().includes('tiền ăn') ||
                  it.name.toLowerCase().includes('bán trú')
              );
            }

            // 5. Match by general name
            if (!matchedRefund) {
              matchedRefund = mealRefundSummary.items.find((it: any) => {
                const itLower = it.name.toLowerCase();
                return lowerItemName.includes(itLower) || itLower.includes(lowerItemName);
              });
            }

            if (matchedRefund && matchedRefund.totalRefundAmount > 0) {
              mealRefundDeduction = matchedRefund.totalRefundAmount;
              mealRefundDesc = matchedRefund.explanation;
            }
          }

          const totalDiscountAmount = Math.min(
            item.unitPrice * item.quantity,
            (manualDeduction > 0 ? manualDeduction : autoDeduction) + mealRefundDeduction
          );
          const netAmount = Math.max(0, item.unitPrice * item.quantity - totalDiscountAmount);

          let itemDesc = item.description || '';
          if (matchedDiscount && autoDeduction > 0 && !itemDesc.includes('[Đã áp dụng')) {
            const tag = `[Đã áp dụng ${matchedDiscount.policyName}]`;
            itemDesc = itemDesc ? `${itemDesc} • ${tag}` : tag;
          }
          if (mealRefundDesc && !itemDesc.includes('Khấu trừ hoàn')) {
            itemDesc = itemDesc ? `${itemDesc} • ${mealRefundDesc}` : mealRefundDesc;
          }

          return {
            id: `item-${invoiceNo}-${itemIdx + 1}`,
            feeItemId: feeItemId,
            category: item.category,
            name: item.name,
            description: itemDesc,
            unitPrice: item.unitPrice,
            quantity: item.quantity,
            discountType,
            discountPercent,
            discountAmount: totalDiscountAmount,
            amount: netAmount,
            isRequired: item.isRequired,
            isMealFee: item.isMealFee,
          };
        });

        const totals = calculateInvoiceTotals(lineItems);
        const initialStatus: InvoiceLifecycleStatus = form.sendDate ? 'da_tao' : 'da_gui';

        return {
          id: `inv-${Date.now()}-${idx}`,
          invoiceNo,
          title: form.title || `Hóa đơn tháng ${form.billingMonth}`,
          billingMonth: form.billingMonth,
          studentId: student.studentId,
          studentName: student.studentName,
          studentCode: student.studentCode,
          classId: student.classId,
          className: student.className,
          gradeLevel: student.gradeLevel,
          parentName: student.parentName,
          parentPhone: student.parentPhone,
          status: initialStatus,
          issueDate: form.issueDate,
          sendDate: form.sendDate || form.issueDate,
          dueDate: form.dueDate,
          exportElectronicInvoice: form.exportElectronicInvoice,
          createdBy: 'Nguyễn Thị Kế Toán',
          createdAt: new Date().toISOString(),
          items: lineItems,
          subtotal: totals.subtotal,
          discountTotal: totals.discountTotal,
          totalAmount: totals.totalAmount,
          paidAmount: 0,
          remainingAmount: totals.totalAmount,
          paymentHistory: [],
          vietQRData: generateVietQRPayload(invoiceNo, totals.totalAmount),
        };
      });

      state.invoices = [...newInvoices, ...state.invoices];
    },

    /**
     * BR06: Update draft invoice
     */
    updateDraftInvoice: (
      state,
      action: PayloadAction<{
        id: string;
        items: InvoiceLineItem[];
        issueDate: string;
        dueDate: string;
        exportElectronicInvoice: boolean;
      }>
    ) => {
      const { id, items, issueDate, dueDate, exportElectronicInvoice } = action.payload;
      const target = state.invoices.find((inv) => inv.id === id);
      if (target && target.status === 'da_tao') {
        const totals = calculateInvoiceTotals(items);
        target.items = items;
        target.issueDate = issueDate;
        target.dueDate = dueDate;
        target.exportElectronicInvoice = exportElectronicInvoice;
        target.subtotal = totals.subtotal;
        target.discountTotal = totals.discountTotal;
        target.totalAmount = totals.totalAmount;
        target.remainingAmount = Math.max(0, totals.totalAmount - target.paidAmount);
        target.vietQRData = generateVietQRPayload(target.invoiceNo, target.remainingAmount);

        if (state.activeInvoice && state.activeInvoice.id === id) {
          state.activeInvoice = { ...target };
        }
      }
    },

    /**
     * BR03: Send invoices (transitions da_tao -> da_gui)
     */
    sendInvoices: (state, action: PayloadAction<string[]>) => {
      const ids = action.payload;
      const today = '18/09/2026';
      state.invoices.forEach((inv) => {
        if (ids.includes(inv.id) && inv.status === 'da_tao') {
          inv.status = 'da_gui';
          inv.sendDate = today;
        }
      });
      if (state.activeInvoice && ids.includes(state.activeInvoice.id)) {
        const updated = state.invoices.find((i) => i.id === state.activeInvoice?.id);
        if (updated) state.activeInvoice = { ...updated };
      }
      state.selectedInvoiceIds = state.selectedInvoiceIds.filter((id) => !ids.includes(id));
    },

    /**
     * BR03: Delete draft invoices
     */
    deleteDraftInvoices: (state, action: PayloadAction<string[]>) => {
      const ids = action.payload;
      state.invoices = state.invoices.filter(
        (inv) => !(ids.includes(inv.id) && inv.status === 'da_tao')
      );
      if (state.activeInvoice && ids.includes(state.activeInvoice.id)) {
        state.activeInvoice = null;
      }
      state.selectedInvoiceIds = state.selectedInvoiceIds.filter((id) => !ids.includes(id));
    },

    /**
     * BR03: Cancel invoice with reason
     */
    cancelInvoice: (
      state,
      action: PayloadAction<{ id: string; reason: string; cancelledBy: string }>
    ) => {
      const { id, reason, cancelledBy } = action.payload;
      const target = state.invoices.find((inv) => inv.id === id);
      if (target && target.status !== 'da_thanh_toan') {
        target.status = 'da_huy';
        target.cancellationReason = reason;
        target.cancelledAt = new Date().toISOString();
        target.cancelledBy = cancelledBy || 'Nguyễn Thị Kế Toán';
        if (state.activeInvoice && state.activeInvoice.id === id) {
          state.activeInvoice = { ...target };
        }
      }
      state.isCancelModalOpen = false;
      state.targetCancelInvoice = null;
    },

    /**
     * BR08 & TASK-FIN-001: Add payment entry (cumulative payment history)
     */
    addPaymentEntry: (
      state,
      action: PayloadAction<{
        invoiceId: string;
        amount: number;
        paymentMethod: PaymentMethod;
        confirmedBy: string;
        note?: string;
        transactionRef?: string;
      }>
    ) => {
      const { invoiceId, amount, paymentMethod, confirmedBy, note, transactionRef } = action.payload;
      const target = state.invoices.find((inv) => inv.id === invoiceId);
      if (target && target.status !== 'da_huy') {
        const safeAmount = Math.max(0, Math.round(amount));
        const newPayment: PaymentHistoryEntry = {
          id: `pay-${Date.now()}-${target.paymentHistory.length + 1}`,
          paidAt: new Date().toISOString(),
          amount: safeAmount,
          paymentMethod,
          confirmedBy: confirmedBy || 'Nguyễn Thị Kế Toán',
          note: note || '',
          transactionRef: transactionRef || `REF-${Math.floor(100000 + Math.random() * 900000)}`,
        };

        target.paymentHistory.push(newPayment);
        target.paidAmount += safeAmount;
        target.remainingAmount = Math.max(0, target.totalAmount - target.paidAmount);

        // Update status
        target.status = resolveInvoiceStatus(
          target.totalAmount,
          target.paidAmount,
          target.dueDate,
          target.status
        );

        // Update VietQR remaining amount
        target.vietQRData = generateVietQRPayload(target.invoiceNo, target.remainingAmount);

        if (state.activeInvoice && state.activeInvoice.id === invoiceId) {
          state.activeInvoice = { ...target };
        }
      }
      state.isPaymentModalOpen = false;
      state.targetPaymentInvoice = null;
    },
  },
});

export const {
  setSelectedMonth,
  setSelectedClassId,
  toggleSelectInvoice,
  toggleSelectAllInvoices,
  clearSelectedInvoices,
  setActiveInvoice,
  setFilterCriteria,
  setDateFilterType,
  setCreatedDateRange,
  resetFilterCriteria,
  setCreateModalOpen,
  setPaymentModalOpen,
  setFilterModalOpen,
  setCancelModalOpen,
  createBatchInvoices,
  updateDraftInvoice,
  sendInvoices,
  deleteDraftInvoices,
  cancelInvoice,
  addPaymentEntry,
} = invoiceSlice.actions;

export default invoiceSlice.reducer;
