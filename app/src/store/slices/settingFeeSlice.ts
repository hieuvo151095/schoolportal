import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  SettingFeeState,
  InvoiceNoteConfig,
  SInvoiceConfig,
  LatePickupConfig,
  LatePickupTier,
  MealRefundConfig,
  MealRefundRates,
  RefundableFeeConfigItem,
  ReconciliationEmailConfig,
  SchoolGroupReconciliationConfig,
  ReconciliationScheduleType,
  NationalHolidayItem
} from '../../types/settingFee.ts';
import {
  initialInvoiceNote,
  initialSepayConfig,
  mockSepayTransactions,
  initialSInvoiceConfig,
  initialLatePickupAndRefund,
  initialReconciliation,
  mockSchoolGroupReconciliations
} from '../../services/mockSettingFeeData.ts';
import { generateTermsForSchedule } from '../../utils/settingFeeValidation.ts';

const initialState: SettingFeeState = {
  invoiceNote: { ...initialInvoiceNote },
  sepay: { ...initialSepayConfig },
  sinvoice: { ...initialSInvoiceConfig },
  latePickupAndRefund: JSON.parse(JSON.stringify(initialLatePickupAndRefund)),
  reconciliation: JSON.parse(JSON.stringify(initialReconciliation)),
  schoolGroups: JSON.parse(JSON.stringify(mockSchoolGroupReconciliations)),
  selectedGroup: null,
  isGroupModalOpen: false,
  draft: {
    invoiceNote: { ...initialInvoiceNote },
    sinvoice: { ...initialSInvoiceConfig },
    latePickupAndRefund: JSON.parse(JSON.stringify(initialLatePickupAndRefund)),
    reconciliation: JSON.parse(JSON.stringify(initialReconciliation)),
    schoolGroups: JSON.parse(JSON.stringify(mockSchoolGroupReconciliations)),
    activeGroupDraft: null
  },
  dirtyFlags: {
    invoiceNote: false,
    sinvoice: false,
    latePickupAndRefund: false,
    reconciliation: false,
    schoolGroups: false
  },
  transactions: [...mockSepayTransactions],
  isSaving: false,
  saveError: null
};

const settingFeeSlice = createSlice({
  name: 'settingFee',
  initialState,
  reducers: {
    // 1. Invoice Note Reducers
    updateDraftInvoiceNote(state, action: PayloadAction<string>) {
      state.draft.invoiceNote.note = action.payload;
      state.dirtyFlags.invoiceNote = state.draft.invoiceNote.note !== state.invoiceNote.note;
    },
    saveInvoiceNote(state) {
      state.invoiceNote = {
        ...state.draft.invoiceNote,
        updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
      };
      state.draft.invoiceNote = { ...state.invoiceNote };
      state.dirtyFlags.invoiceNote = false;
    },
    discardInvoiceNote(state) {
      state.draft.invoiceNote = { ...state.invoiceNote };
      state.dirtyFlags.invoiceNote = false;
    },

    // 2. SInvoice Reducers
    updateDraftSInvoice(state, action: PayloadAction<Partial<SInvoiceConfig>>) {
      state.draft.sinvoice = {
        ...state.draft.sinvoice,
        ...action.payload
      };
      state.dirtyFlags.sinvoice = true;
    },
    saveSInvoice(state) {
      state.sinvoice = {
        ...state.draft.sinvoice,
        updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
      };
      state.draft.sinvoice = { ...state.sinvoice };
      state.dirtyFlags.sinvoice = false;
    },
    discardSInvoice(state) {
      state.draft.sinvoice = { ...state.sinvoice };
      state.dirtyFlags.sinvoice = false;
    },

    // 3. Late Pickup & Refund Reducers
    updateDraftLatePickup(state, action: PayloadAction<Partial<LatePickupConfig>>) {
      state.draft.latePickupAndRefund.latePickup = {
        ...state.draft.latePickupAndRefund.latePickup,
        ...action.payload
      };
      state.dirtyFlags.latePickupAndRefund = true;
    },
    addLatePickupTier(state, action: PayloadAction<LatePickupTier>) {
      state.draft.latePickupAndRefund.latePickup.tiers.push(action.payload);
      state.dirtyFlags.latePickupAndRefund = true;
    },
    updateLatePickupTier(
      state,
      action: PayloadAction<{ index: number; tier: Partial<LatePickupTier> }>
    ) {
      const { index, tier } = action.payload;
      if (state.draft.latePickupAndRefund.latePickup.tiers[index]) {
        state.draft.latePickupAndRefund.latePickup.tiers[index] = {
          ...state.draft.latePickupAndRefund.latePickup.tiers[index],
          ...tier
        };
        state.dirtyFlags.latePickupAndRefund = true;
      }
    },
    deleteLatePickupTier(state, action: PayloadAction<number>) {
      const index = action.payload;
      if (state.draft.latePickupAndRefund.latePickup.tiers.length > 1) {
        state.draft.latePickupAndRefund.latePickup.tiers.splice(index, 1);
        state.dirtyFlags.latePickupAndRefund = true;
      }
    },
    updateDraftMealRefund(state, action: PayloadAction<Partial<MealRefundConfig>>) {
      state.draft.latePickupAndRefund.mealRefund = {
        ...state.draft.latePickupAndRefund.mealRefund,
        ...action.payload
      };
      state.dirtyFlags.latePickupAndRefund = true;
    },
    updateDraftMealRefundRates(state, action: PayloadAction<Partial<MealRefundRates>>) {
      state.draft.latePickupAndRefund.mealRefund.rates = {
        ...state.draft.latePickupAndRefund.mealRefund.rates,
        ...action.payload
      };
      if (!state.draft.latePickupAndRefund.mealRefund.excusedRates) {
        state.draft.latePickupAndRefund.mealRefund.excusedRates = {
          mainMealRatePercent: 50,
          breakfastRatePercent: 70
        };
      }
      state.draft.latePickupAndRefund.mealRefund.excusedRates = {
        ...state.draft.latePickupAndRefund.mealRefund.excusedRates,
        ...action.payload
      };
      const fees = state.draft.latePickupAndRefund.mealRefund.refundableFees;
      if (fees) {
        if (action.payload.mainMealRatePercent !== undefined) {
          const mainItem = fees.find((f) => f.code === 'TIEN_AN');
          if (mainItem) mainItem.excusedRatePercent = action.payload.mainMealRatePercent;
        }
        if (action.payload.breakfastRatePercent !== undefined) {
          const bfItem = fees.find((f) => f.code === 'AN_SANG' || f.code === 'TIEN_AN_SANG');
          if (bfItem) bfItem.excusedRatePercent = action.payload.breakfastRatePercent;
        }
      }
      state.dirtyFlags.latePickupAndRefund = true;
    },
    updateDraftExcusedRates(state, action: PayloadAction<Partial<MealRefundRates>>) {
      const current = state.draft.latePickupAndRefund.mealRefund.excusedRates || {
        mainMealRatePercent: 50,
        breakfastRatePercent: 70
      };
      state.draft.latePickupAndRefund.mealRefund.excusedRates = {
        ...current,
        ...action.payload
      };
      state.draft.latePickupAndRefund.mealRefund.rates = {
        ...state.draft.latePickupAndRefund.mealRefund.excusedRates
      };
      const fees = state.draft.latePickupAndRefund.mealRefund.refundableFees;
      if (fees) {
        if (action.payload.mainMealRatePercent !== undefined) {
          const mainItem = fees.find((f) => f.code === 'TIEN_AN');
          if (mainItem) mainItem.excusedRatePercent = action.payload.mainMealRatePercent;
        }
        if (action.payload.breakfastRatePercent !== undefined) {
          const bfItem = fees.find((f) => f.code === 'AN_SANG' || f.code === 'TIEN_AN_SANG');
          if (bfItem) bfItem.excusedRatePercent = action.payload.breakfastRatePercent;
        }
      }
      state.dirtyFlags.latePickupAndRefund = true;
    },
    updateDraftUnexcusedRates(state, action: PayloadAction<Partial<MealRefundRates>>) {
      const current = state.draft.latePickupAndRefund.mealRefund.unexcusedRates || {
        mainMealRatePercent: 0,
        breakfastRatePercent: 0
      };
      state.draft.latePickupAndRefund.mealRefund.unexcusedRates = {
        ...current,
        ...action.payload
      };
      const fees = state.draft.latePickupAndRefund.mealRefund.refundableFees;
      if (fees) {
        if (action.payload.mainMealRatePercent !== undefined) {
          const mainItem = fees.find((f) => f.code === 'TIEN_AN');
          if (mainItem) mainItem.unexcusedRatePercent = action.payload.mainMealRatePercent;
        }
        if (action.payload.breakfastRatePercent !== undefined) {
          const bfItem = fees.find((f) => f.code === 'AN_SANG' || f.code === 'TIEN_AN_SANG');
          if (bfItem) bfItem.unexcusedRatePercent = action.payload.breakfastRatePercent;
        }
      }
      state.dirtyFlags.latePickupAndRefund = true;
    },
    updateDraftHolidayRates(state, action: PayloadAction<Partial<MealRefundRates>>) {
      const current = state.draft.latePickupAndRefund.mealRefund.holidayRates || {
        mainMealRatePercent: 100,
        breakfastRatePercent: 100
      };
      state.draft.latePickupAndRefund.mealRefund.holidayRates = {
        ...current,
        ...action.payload
      };
      const fees = state.draft.latePickupAndRefund.mealRefund.refundableFees;
      if (fees) {
        if (action.payload.mainMealRatePercent !== undefined) {
          const mainItem = fees.find((f) => f.code === 'TIEN_AN');
          if (mainItem) mainItem.holidayRatePercent = action.payload.mainMealRatePercent;
        }
        if (action.payload.breakfastRatePercent !== undefined) {
          const bfItem = fees.find((f) => f.code === 'AN_SANG' || f.code === 'TIEN_AN_SANG');
          if (bfItem) bfItem.holidayRatePercent = action.payload.breakfastRatePercent;
        }
      }
      state.dirtyFlags.latePickupAndRefund = true;
    },
    addDraftRefundableFee(state, action: PayloadAction<RefundableFeeConfigItem>) {
      if (!state.draft.latePickupAndRefund.mealRefund.refundableFees) {
        state.draft.latePickupAndRefund.mealRefund.refundableFees = [
          {
            feeId: 'fee-sys-002',
            code: 'TIEN_AN',
            name: 'Tiền ăn (bán trú / trưa)',
            unit: 'ngày',
            defaultAmount: 40000,
            isDefault: true,
            excusedRatePercent: 50,
            unexcusedRatePercent: 0
          }
        ];
      }
      const exists = state.draft.latePickupAndRefund.mealRefund.refundableFees.some(
        (f) => f.feeId === action.payload.feeId || f.code === action.payload.code
      );
      if (!exists) {
        state.draft.latePickupAndRefund.mealRefund.refundableFees.push({
          ...action.payload,
          excusedRatePercent: action.payload.excusedRatePercent ?? 50,
          unexcusedRatePercent: action.payload.unexcusedRatePercent ?? 0
        });
        state.dirtyFlags.latePickupAndRefund = true;
      }
    },
    addDraftRefundableFees(state, action: PayloadAction<RefundableFeeConfigItem[]>) {
      if (!state.draft.latePickupAndRefund.mealRefund.refundableFees) {
        state.draft.latePickupAndRefund.mealRefund.refundableFees = [
          {
            feeId: 'fee-sys-002',
            code: 'TIEN_AN',
            name: 'Tiền ăn (bán trú / trưa)',
            unit: 'ngày',
            defaultAmount: 40000,
            isDefault: true,
            excusedRatePercent: 50,
            unexcusedRatePercent: 0
          }
        ];
      }
      let anyAdded = false;
      action.payload.forEach((item) => {
        const exists = state.draft.latePickupAndRefund.mealRefund.refundableFees!.some(
          (f) => f.feeId === item.feeId || f.code === item.code
        );
        if (!exists) {
          state.draft.latePickupAndRefund.mealRefund.refundableFees!.push({
            ...item,
            excusedRatePercent: item.excusedRatePercent ?? 50,
            unexcusedRatePercent: item.unexcusedRatePercent ?? 0
          });
          anyAdded = true;
        }
      });
      if (anyAdded) {
        state.dirtyFlags.latePickupAndRefund = true;
      }
    },
    removeDraftRefundableFee(state, action: PayloadAction<string>) {
      const feeId = action.payload;
      const fees = state.draft.latePickupAndRefund.mealRefund.refundableFees || [];
      const target = fees.find((f) => f.feeId === feeId);
      if (target && !target.isDefault) {
        state.draft.latePickupAndRefund.mealRefund.refundableFees = fees.filter(
          (f) => f.feeId !== feeId
        );
        state.dirtyFlags.latePickupAndRefund = true;
      }
    },
    updateDraftRefundableFeeRate(
      state,
      action: PayloadAction<{
        feeId: string;
        rateType: 'holiday' | 'excused' | 'unexcused';
        percent: number;
      }>
    ) {
      const { feeId, rateType, percent } = action.payload;
      const clampedPercent = Math.min(100, Math.max(0, percent));
      const fees = state.draft.latePickupAndRefund.mealRefund.refundableFees || [];
      const idx = fees.findIndex((f) => f.feeId === feeId);
      if (idx !== -1) {
        if (rateType === 'holiday') {
          fees[idx].holidayRatePercent = clampedPercent;
          if (fees[idx].code === 'TIEN_AN') {
            if (!state.draft.latePickupAndRefund.mealRefund.holidayRates) {
              state.draft.latePickupAndRefund.mealRefund.holidayRates = { mainMealRatePercent: 100, breakfastRatePercent: 100 };
            }
            state.draft.latePickupAndRefund.mealRefund.holidayRates.mainMealRatePercent = clampedPercent;
          } else if (fees[idx].code === 'AN_SANG' || fees[idx].code === 'TIEN_AN_SANG') {
            if (!state.draft.latePickupAndRefund.mealRefund.holidayRates) {
              state.draft.latePickupAndRefund.mealRefund.holidayRates = { mainMealRatePercent: 100, breakfastRatePercent: 100 };
            }
            state.draft.latePickupAndRefund.mealRefund.holidayRates.breakfastRatePercent = clampedPercent;
          }
        } else if (rateType === 'excused') {
          fees[idx].excusedRatePercent = clampedPercent;
          if (fees[idx].code === 'TIEN_AN') {
            if (!state.draft.latePickupAndRefund.mealRefund.excusedRates) {
              state.draft.latePickupAndRefund.mealRefund.excusedRates = { mainMealRatePercent: 50, breakfastRatePercent: 70 };
            }
            state.draft.latePickupAndRefund.mealRefund.excusedRates.mainMealRatePercent = clampedPercent;
            state.draft.latePickupAndRefund.mealRefund.rates.mainMealRatePercent = clampedPercent;
          } else if (fees[idx].code === 'AN_SANG' || fees[idx].code === 'TIEN_AN_SANG') {
            if (!state.draft.latePickupAndRefund.mealRefund.excusedRates) {
              state.draft.latePickupAndRefund.mealRefund.excusedRates = { mainMealRatePercent: 50, breakfastRatePercent: 70 };
            }
            state.draft.latePickupAndRefund.mealRefund.excusedRates.breakfastRatePercent = clampedPercent;
            state.draft.latePickupAndRefund.mealRefund.rates.breakfastRatePercent = clampedPercent;
          }
        } else if (rateType === 'unexcused') {
          fees[idx].unexcusedRatePercent = clampedPercent;
          if (fees[idx].code === 'TIEN_AN') {
            if (!state.draft.latePickupAndRefund.mealRefund.unexcusedRates) {
              state.draft.latePickupAndRefund.mealRefund.unexcusedRates = { mainMealRatePercent: 0, breakfastRatePercent: 0 };
            }
            state.draft.latePickupAndRefund.mealRefund.unexcusedRates.mainMealRatePercent = clampedPercent;
          } else if (fees[idx].code === 'AN_SANG' || fees[idx].code === 'TIEN_AN_SANG') {
            if (!state.draft.latePickupAndRefund.mealRefund.unexcusedRates) {
              state.draft.latePickupAndRefund.mealRefund.unexcusedRates = { mainMealRatePercent: 0, breakfastRatePercent: 0 };
            }
            state.draft.latePickupAndRefund.mealRefund.unexcusedRates.breakfastRatePercent = clampedPercent;
          }
        }
        state.draft.latePickupAndRefund.mealRefund.refundableFees = [...fees];
        state.dirtyFlags.latePickupAndRefund = true;
      }
    },
    updateDraftHolidayItem(
      state,
      action: PayloadAction<{ id: string; item: Partial<NationalHolidayItem> }>
    ) {
      const { id, item } = action.payload;
      const holidays = state.draft.latePickupAndRefund.mealRefund.holidays || [];
      const idx = holidays.findIndex((h) => h.id === id);
      if (idx !== -1) {
        const updated = { ...holidays[idx], ...item };
        // Recalculate dayCount if dates changed
        if (item.startDate || item.endDate) {
          const start = new Date(updated.startDate);
          const end = new Date(updated.endDate);
          if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && start <= end) {
            const diffTime = Math.abs(end.getTime() - start.getTime());
            updated.dayCount = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
          }
        }
        holidays[idx] = updated;
        state.draft.latePickupAndRefund.mealRefund.holidays = [...holidays];
        state.dirtyFlags.latePickupAndRefund = true;
      }
    },
    addDraftHolidayItem(state, action: PayloadAction<NationalHolidayItem>) {
      if (!state.draft.latePickupAndRefund.mealRefund.holidays) {
        state.draft.latePickupAndRefund.mealRefund.holidays = [];
      }
      state.draft.latePickupAndRefund.mealRefund.holidays.push(action.payload);
      state.dirtyFlags.latePickupAndRefund = true;
    },
    removeDraftHolidayItem(state, action: PayloadAction<string>) {
      const holidays = state.draft.latePickupAndRefund.mealRefund.holidays || [];
      state.draft.latePickupAndRefund.mealRefund.holidays = holidays.filter(
        (h) => h.id !== action.payload
      );
      state.dirtyFlags.latePickupAndRefund = true;
    },
    saveLatePickupAndRefund(state) {
      state.latePickupAndRefund = JSON.parse(
        JSON.stringify({
          ...state.draft.latePickupAndRefund,
          updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
        })
      );
      state.draft.latePickupAndRefund = JSON.parse(
        JSON.stringify(state.latePickupAndRefund)
      );
      state.dirtyFlags.latePickupAndRefund = false;
    },
    discardLatePickupAndRefund(state) {
      state.draft.latePickupAndRefund = JSON.parse(
        JSON.stringify(state.latePickupAndRefund)
      );
      state.dirtyFlags.latePickupAndRefund = false;
    },

    // 4. Reconciliation Reducers
    addReconciliationEmail(state, action: PayloadAction<string>) {
      const email = action.payload.trim();
      if (email && state.draft.reconciliation.emails.length < 3) {
        state.draft.reconciliation.emails.push(email);
        state.dirtyFlags.reconciliation = true;
      }
    },
    removeReconciliationEmail(state, action: PayloadAction<number>) {
      state.draft.reconciliation.emails.splice(action.payload, 1);
      state.dirtyFlags.reconciliation = true;
    },
    saveReconciliation(state) {
      state.reconciliation = JSON.parse(
        JSON.stringify({
          ...state.draft.reconciliation,
          updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
        })
      );
      state.draft.reconciliation = JSON.parse(
        JSON.stringify(state.reconciliation)
      );
      state.dirtyFlags.reconciliation = false;
    },
    discardReconciliation(state) {
      state.draft.reconciliation = JSON.parse(
        JSON.stringify(state.reconciliation)
      );
      state.dirtyFlags.reconciliation = false;
    },

    // 5. School Group Reconciliation Reducers
    openSchoolGroupModal(state, action: PayloadAction<SchoolGroupReconciliationConfig>) {
      state.selectedGroup = action.payload;
      state.draft.activeGroupDraft = JSON.parse(JSON.stringify(action.payload));
      state.isGroupModalOpen = true;
    },
    closeSchoolGroupModal(state) {
      state.selectedGroup = null;
      state.draft.activeGroupDraft = null;
      state.isGroupModalOpen = false;
    },
    updateActiveGroupDraft(
      state,
      action: PayloadAction<Partial<SchoolGroupReconciliationConfig>>
    ) {
      if (state.draft.activeGroupDraft) {
        state.draft.activeGroupDraft = {
          ...state.draft.activeGroupDraft,
          ...action.payload
        };
        state.dirtyFlags.schoolGroups = true;
      }
    },
    updateActiveGroupScheduleType(
      state,
      action: PayloadAction<ReconciliationScheduleType>
    ) {
      if (state.draft.activeGroupDraft) {
        const scheduleType = action.payload;
        state.draft.activeGroupDraft.scheduleType = scheduleType;
        if (scheduleType === 'year') {
          // CRITICAL: When set to 'Đối soát theo năm', termCount is fixed to 1 and terms table MUST BE DELETED (empty [])
          state.draft.activeGroupDraft.termCount = 1;
          state.draft.activeGroupDraft.terms = [];
        } else if (scheduleType === 'term') {
          state.draft.activeGroupDraft.termCount = Math.max(2, state.draft.activeGroupDraft.termCount || 2);
        }
        state.dirtyFlags.schoolGroups = true;
      }
    },
    generateActiveGroupTerms(state) {
      if (state.draft.activeGroupDraft) {
        const { serviceStartDate, serviceEndDate, termCount, scheduleType } =
          state.draft.activeGroupDraft;
        if (scheduleType === 'year') {
          state.draft.activeGroupDraft.terms = [];
        } else {
          state.draft.activeGroupDraft.terms = generateTermsForSchedule(
            serviceStartDate,
            serviceEndDate,
            termCount,
            scheduleType
          );
        }
        state.dirtyFlags.schoolGroups = true;
      }
    },
    removeActiveGroupTerm(state, action: PayloadAction<string>) {
      if (state.draft.activeGroupDraft) {
        state.draft.activeGroupDraft.terms = state.draft.activeGroupDraft.terms.filter(
          (t) => t.id !== action.payload
        );
        state.draft.activeGroupDraft.termCount = state.draft.activeGroupDraft.terms.length;
        state.dirtyFlags.schoolGroups = true;
      }
    },
    saveActiveGroup(state) {
      if (state.draft.activeGroupDraft) {
        const updated = {
          ...state.draft.activeGroupDraft,
          updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
        };
        const index = state.schoolGroups.findIndex((g) => g.id === updated.id);
        if (index !== -1) {
          state.schoolGroups[index] = updated;
        } else {
          state.schoolGroups.push(updated);
        }
        state.draft.schoolGroups = JSON.parse(JSON.stringify(state.schoolGroups));
        state.selectedGroup = updated;
        state.dirtyFlags.schoolGroups = false;
        state.isGroupModalOpen = false;
      }
    },
    discardActiveGroup(state) {
      if (state.selectedGroup) {
        state.draft.activeGroupDraft = JSON.parse(JSON.stringify(state.selectedGroup));
      } else {
        state.draft.activeGroupDraft = null;
      }
      state.dirtyFlags.schoolGroups = false;
      state.isGroupModalOpen = false;
    },

    // Global Reset & Discard
    discardAllChanges(state) {
      state.draft.invoiceNote = { ...state.invoiceNote };
      state.draft.sinvoice = { ...state.sinvoice };
      state.draft.latePickupAndRefund = JSON.parse(
        JSON.stringify(state.latePickupAndRefund)
      );
      state.draft.reconciliation = JSON.parse(
        JSON.stringify(state.reconciliation)
      );
      state.draft.schoolGroups = JSON.parse(
        JSON.stringify(state.schoolGroups)
      );
      state.draft.activeGroupDraft = null;
      state.isGroupModalOpen = false;
      state.dirtyFlags = {
        invoiceNote: false,
        sinvoice: false,
        latePickupAndRefund: false,
        reconciliation: false,
        schoolGroups: false
      };
    },
    saveAllChanges(state) {
      const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
      if (state.dirtyFlags.invoiceNote) {
        state.invoiceNote = { ...state.draft.invoiceNote, updatedAt: now };
      }
      if (state.dirtyFlags.sinvoice) {
        state.sinvoice = { ...state.draft.sinvoice, updatedAt: now };
      }
      if (state.dirtyFlags.latePickupAndRefund) {
        state.latePickupAndRefund = JSON.parse(
          JSON.stringify({ ...state.draft.latePickupAndRefund, updatedAt: now })
        );
      }
      if (state.dirtyFlags.reconciliation) {
        state.reconciliation = JSON.parse(
          JSON.stringify({ ...state.draft.reconciliation, updatedAt: now })
        );
      }
      if (state.dirtyFlags.schoolGroups) {
        state.schoolGroups = JSON.parse(
          JSON.stringify(state.draft.schoolGroups)
        );
      }
      state.draft = {
        invoiceNote: { ...state.invoiceNote },
        sinvoice: { ...state.sinvoice },
        latePickupAndRefund: JSON.parse(JSON.stringify(state.latePickupAndRefund)),
        reconciliation: JSON.parse(JSON.stringify(state.reconciliation)),
        schoolGroups: JSON.parse(JSON.stringify(state.schoolGroups)),
        activeGroupDraft: null
      };
      state.dirtyFlags = {
        invoiceNote: false,
        sinvoice: false,
        latePickupAndRefund: false,
        reconciliation: false,
        schoolGroups: false
      };
    }
  }
});

export const {
  updateDraftInvoiceNote,
  saveInvoiceNote,
  discardInvoiceNote,
  updateDraftSInvoice,
  saveSInvoice,
  discardSInvoice,
  updateDraftLatePickup,
  addLatePickupTier,
  updateLatePickupTier,
  deleteLatePickupTier,
  updateDraftMealRefund,
  updateDraftMealRefundRates,
  updateDraftExcusedRates,
  updateDraftUnexcusedRates,
  updateDraftHolidayRates,
  addDraftRefundableFee,
  addDraftRefundableFees,
  removeDraftRefundableFee,
  updateDraftRefundableFeeRate,
  updateDraftHolidayItem,
  addDraftHolidayItem,
  removeDraftHolidayItem,
  saveLatePickupAndRefund,
  discardLatePickupAndRefund,
  addReconciliationEmail,
  removeReconciliationEmail,
  saveReconciliation,
  discardReconciliation,
  openSchoolGroupModal,
  closeSchoolGroupModal,
  updateActiveGroupDraft,
  updateActiveGroupScheduleType,
  generateActiveGroupTerms,
  removeActiveGroupTerm,
  saveActiveGroup,
  discardActiveGroup,
  discardAllChanges,
  saveAllChanges
} = settingFeeSlice.actions;

export default settingFeeSlice.reducer;
