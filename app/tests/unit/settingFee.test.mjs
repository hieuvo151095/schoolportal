import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  validateEmailFormat,
  validateEmailCandidate,
  validateTierDeletion,
  validateSInvoiceConfig,
  validateLatePickupFixed,
  formatCurrencyVND,
  isAnyBlockDirty,
  validateSchoolGroupConfig,
  generateTermsForSchedule
} from '../../src/utils/settingFeeValidation.ts';

describe('Settings Fee Configuration (Cấu Hình — Học Phí) Business Rules & Validation Engine', () => {

  describe('BR01 & Dirty State Machine: isAnyBlockDirty', () => {
    it('returns false when all block dirty flags are false', () => {
      const dirtyFlags = {
        invoiceNote: false,
        sinvoice: false,
        latePickupAndRefund: false,
        reconciliation: false
      };
      assert.equal(isAnyBlockDirty(dirtyFlags), false);
    });

    it('returns true when any single block is dirty', () => {
      assert.equal(
        isAnyBlockDirty({
          invoiceNote: true,
          sinvoice: false,
          latePickupAndRefund: false,
          reconciliation: false
        }),
        true
      );
      assert.equal(
        isAnyBlockDirty({
          invoiceNote: false,
          sinvoice: true,
          latePickupAndRefund: false,
          reconciliation: false
        }),
        true
      );
      assert.equal(
        isAnyBlockDirty({
          invoiceNote: false,
          sinvoice: false,
          latePickupAndRefund: true,
          reconciliation: false
        }),
        true
      );
      assert.equal(
        isAnyBlockDirty({
          invoiceNote: false,
          sinvoice: false,
          latePickupAndRefund: false,
          reconciliation: true
        }),
        true
      );
    });
  });

  describe('BR05, BR06 & Resolution K019: SInvoice Configuration Validation', () => {
    it('passes validation when SInvoice is disabled even with empty fields', () => {
      const config = {
        isEnabled: false,
        taxCode: '',
        accountName: '',
        password: '',
        invoiceTemplate: '',
        invoiceType: '',
        invoiceSerial: '',
        autoCreateInvoice: false,
        splitInvoice: false,
        updatedAt: '2026-09-29T10:00:00Z'
      };
      const result = validateSInvoiceConfig(config);
      assert.equal(result.isValid, true);
      assert.equal(Object.keys(result.errors).length, 0);
    });

    it('flags mandatory errors for empty required fields when SInvoice is enabled', () => {
      const config = {
        isEnabled: true,
        taxCode: '',
        accountName: '',
        password: '',
        invoiceTemplate: '',
        invoiceType: '',
        invoiceSerial: '',
        autoCreateInvoice: true,
        splitInvoice: false,
        updatedAt: '2026-09-29T10:00:00Z'
      };
      const result = validateSInvoiceConfig(config);
      assert.equal(result.isValid, false);
      assert.ok(result.errors.taxCode);
      assert.ok(result.errors.accountName);
      assert.ok(result.errors.password);
      assert.ok(result.errors.invoiceTemplate);
      assert.ok(result.errors.invoiceType);
      assert.ok(result.errors.invoiceSerial);
    });

    it('validates tax code format (10 or 13 digits) and minimum password length', () => {
      const invalidTaxAndPass = {
        isEnabled: true,
        taxCode: '12345',
        accountName: 'admin_demo',
        password: '123',
        invoiceTemplate: '1/001',
        invoiceType: 'Hóa đơn GTGT',
        invoiceSerial: 'C26TAV',
        autoCreateInvoice: true,
        splitInvoice: false,
        updatedAt: '2026-09-29T10:00:00Z'
      };
      const result = validateSInvoiceConfig(invalidTaxAndPass);
      assert.equal(result.isValid, false);
      assert.match(result.errors.taxCode, /định dạng/i);
      assert.match(result.errors.password, /6 ký tự/i);
    });

    it('accepts valid 10-digit tax code and complete credentials', () => {
      const validConfig = {
        isEnabled: true,
        taxCode: '0312345678',
        accountName: 'truong_demo_admin',
        password: 'ViettelPassword2026',
        invoiceTemplate: '1/001',
        invoiceType: 'Hóa đơn giá trị gia tăng',
        invoiceSerial: 'C26TAV',
        autoCreateInvoice: true,
        splitInvoice: false,
        updatedAt: '2026-09-29T10:00:00Z'
      };
      const result = validateSInvoiceConfig(validConfig);
      assert.equal(result.isValid, true);
      assert.equal(Object.keys(result.errors).length, 0);
    });
  });

  describe('BR07, BR11, BR13: Late Pickup Validation & Tier Table Row Deletion', () => {
    it('validates fixed interval minutes (5-60m step 5) and amount per hour', () => {
      assert.equal(validateLatePickupFixed(30, 50000).isValid, true);
      assert.equal(validateLatePickupFixed(5, 20000).isValid, true);
      assert.equal(validateLatePickupFixed(60, 100000).isValid, true);

      assert.equal(validateLatePickupFixed(12, 50000).isValid, false);
      assert.equal(validateLatePickupFixed(65, 50000).isValid, false);
      assert.equal(validateLatePickupFixed(30, -5000).isValid, false);
    });

    it('rejects deletion of the only row in Tiered bracket table (Row 1 invariant)', () => {
      const singleTier = [
        { id: 'tier-1', startTime: '17:00', endTime: '17:30', amount: 30000 }
      ];
      const result = validateTierDeletion(0, singleTier);
      assert.equal(result.canDelete, false);
      assert.match(result.error, /khung giờ đầu tiên/i);
    });

    it('permits deletion when table has 2 or more rows', () => {
      const multipleTiers = [
        { id: 'tier-1', startTime: '17:00', endTime: '17:30', amount: 30000 },
        { id: 'tier-2', startTime: '17:30', endTime: '18:00', amount: 60000 }
      ];
      const result = validateTierDeletion(1, multipleTiers);
      assert.equal(result.canDelete, true);
    });
  });

  describe('BR14, ERR-HP-01, ERR-HP-02: Reconciliation Email Validation & 3-Email Limit', () => {
    it('validates email format adhering to RFC 5322', () => {
      assert.equal(validateEmailFormat('ketoan@school.edu.vn'), true);
      assert.equal(validateEmailFormat('admin.finance+portal@finviet.vn'), true);
      assert.equal(validateEmailFormat('invalid-email'), false);
      assert.equal(validateEmailFormat('test@.com'), false);
      assert.equal(validateEmailFormat(''), false);
    });

    it('rejects invalid email with ERR-HP-01 "Email không hợp lệ"', () => {
      const result = validateEmailCandidate('invalid-email-address', ['ketoan@school.edu.vn']);
      assert.equal(result.isValid, false);
      assert.equal(result.error, 'Email không hợp lệ');
    });

    it('rejects duplicate email with ERR-HP-02 "Email đã tồn tại trong danh sách" (case-insensitive)', () => {
      const existing = ['ketoan@school.edu.vn', 'admin@soha.edu.vn'];
      const result = validateEmailCandidate('KeToan@school.EDU.vn', existing);
      assert.equal(result.isValid, false);
      assert.equal(result.error, 'Email đã tồn tại trong danh sách');
    });

    it('rejects adding a 4th email when list already has 3 emails', () => {
      const existing = [
        'ketoan1@school.edu.vn',
        'ketoan2@school.edu.vn',
        'ketoan3@school.edu.vn'
      ];
      const result = validateEmailCandidate('new.accountant@school.edu.vn', existing);
      assert.equal(result.isValid, false);
      assert.match(result.error, /tối đa 3 email/i);
    });

    it('accepts valid distinct email when list has fewer than 3 items', () => {
      const existing = ['ketoan1@school.edu.vn'];
      const result = validateEmailCandidate('ketoan2@school.edu.vn', existing);
      assert.equal(result.isValid, true);
      assert.equal(result.error, undefined);
    });
  });

  describe('VND Currency Formatting Utility', () => {
    it('formats numeric amounts with Vietnamese thousand dot separators', () => {
      assert.equal(formatCurrencyVND(50000), '50.000 đ');
      assert.equal(formatCurrencyVND(1250000), '1.250.000 đ');
      assert.equal(formatCurrencyVND(0), '0 đ');
      assert.equal(formatCurrencyVND(NaN), '0 đ');
    });
  });

  describe('Redux State Machine Mutations & Isolation', async () => {
    const {
      default: settingFeeReducer,
      updateDraftInvoiceNote,
      saveInvoiceNote,
      discardInvoiceNote,
      updateDraftSInvoice,
      saveSInvoice,
      discardSInvoice,
      updateDraftLatePickup,
      addLatePickupTier,
      deleteLatePickupTier,
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
      openSchoolGroupModal,
      closeSchoolGroupModal,
      updateActiveGroupDraft,
      updateActiveGroupScheduleType,
      generateActiveGroupTerms,
      removeActiveGroupTerm,
      saveActiveGroup,
      discardAllChanges,
      saveAllChanges
    } = await import('../../src/store/slices/settingFeeSlice.ts');
    const { mockSchoolGroupReconciliations } = await import(
      '../../src/services/mockSettingFeeData.ts'
    );

    it('mutates invoice note draft and saves atomically', () => {
      const initialState = settingFeeReducer(undefined, { type: '@@INIT' });
      assert.equal(initialState.dirtyFlags.invoiceNote, false);

      const modifiedState = settingFeeReducer(
        initialState,
        updateDraftInvoiceNote('Nội dung ghi chú mới')
      );
      assert.equal(modifiedState.draft.invoiceNote.note, 'Nội dung ghi chú mới');
      assert.equal(modifiedState.dirtyFlags.invoiceNote, true);

      // Save
      const savedState = settingFeeReducer(modifiedState, saveInvoiceNote());
      assert.equal(savedState.invoiceNote.note, 'Nội dung ghi chú mới');
      assert.equal(savedState.dirtyFlags.invoiceNote, false);

      // Discard
      const discardedState = settingFeeReducer(
        settingFeeReducer(savedState, updateDraftInvoiceNote('Nội dung tạm thời')),
        discardInvoiceNote()
      );
      assert.equal(discardedState.draft.invoiceNote.note, 'Nội dung ghi chú mới');
      assert.equal(discardedState.dirtyFlags.invoiceNote, false);
    });

    it('manages late pickup tiers and enforces row 1 invariant on deletion', () => {
      const initialState = settingFeeReducer(undefined, { type: '@@INIT' });
      const initialCount = initialState.draft.latePickupAndRefund.latePickup.tiers.length;

      // Add tier
      const stateWithTier = settingFeeReducer(
        initialState,
        addLatePickupTier({
          id: 'tier-test',
          startTime: '19:00',
          endTime: '20:00',
          amount: 100000
        })
      );
      assert.equal(
        stateWithTier.draft.latePickupAndRefund.latePickup.tiers.length,
        initialCount + 1
      );
      assert.equal(stateWithTier.dirtyFlags.latePickupAndRefund, true);

      // Delete added tier
      const stateAfterDelete = settingFeeReducer(
        stateWithTier,
        deleteLatePickupTier(initialCount)
      );
      assert.equal(
        stateAfterDelete.draft.latePickupAndRefund.latePickup.tiers.length,
        initialCount
      );
    });

    it('adds and removes reconciliation emails within 3-item cap', () => {
      const initialState = settingFeeReducer(undefined, { type: '@@INIT' });
      const emailCount = initialState.draft.reconciliation.emails.length;

      const stateAdded = settingFeeReducer(
        initialState,
        addReconciliationEmail('newaccountant@school.vn')
      );
      assert.equal(stateAdded.draft.reconciliation.emails.length, emailCount + 1);
      assert.equal(stateAdded.dirtyFlags.reconciliation, true);

      const stateRemoved = settingFeeReducer(
        stateAdded,
        removeReconciliationEmail(emailCount)
      );
      assert.equal(stateRemoved.draft.reconciliation.emails.length, emailCount);
    });

    it('mutates meal refund percentage rates draft, sets dirty flag, and saves atomically', () => {
      const initialState = settingFeeReducer(undefined, { type: '@@INIT' });
      assert.equal(initialState.dirtyFlags.latePickupAndRefund, false);

      // Mutate rates
      const modifiedState = settingFeeReducer(
        initialState,
        updateDraftMealRefundRates({ mainMealRatePercent: 60, breakfastRatePercent: 80 })
      );
      assert.equal(
        modifiedState.draft.latePickupAndRefund.mealRefund.rates.mainMealRatePercent,
        60
      );
      assert.equal(
        modifiedState.draft.latePickupAndRefund.mealRefund.rates.breakfastRatePercent,
        80
      );
      assert.equal(modifiedState.dirtyFlags.latePickupAndRefund, true);

      // Save
      const savedState = settingFeeReducer(modifiedState, saveLatePickupAndRefund());
      assert.equal(
        savedState.latePickupAndRefund.mealRefund.rates.mainMealRatePercent,
        60
      );
      assert.equal(savedState.dirtyFlags.latePickupAndRefund, false);

      // Discard
      const discardedState = settingFeeReducer(
        settingFeeReducer(
          savedState,
          updateDraftMealRefundRates({ mainMealRatePercent: 90 })
        ),
        discardLatePickupAndRefund()
      );
      assert.equal(
        discardedState.draft.latePickupAndRefund.mealRefund.rates.mainMealRatePercent,
        60
      );
      assert.equal(discardedState.dirtyFlags.latePickupAndRefund, false);
    });

    it('mutates excused, unexcused, and holiday rates separately with dirty tracking', () => {
      const initialState = settingFeeReducer(undefined, { type: '@@INIT' });

      // Update Excused rates
      const excusedState = settingFeeReducer(
        initialState,
        updateDraftExcusedRates({ mainMealRatePercent: 75, breakfastRatePercent: 85 })
      );
      assert.equal(
        excusedState.draft.latePickupAndRefund.mealRefund.excusedRates.mainMealRatePercent,
        75
      );
      assert.equal(
        excusedState.draft.latePickupAndRefund.mealRefund.excusedRates.breakfastRatePercent,
        85
      );
      assert.equal(excusedState.dirtyFlags.latePickupAndRefund, true);

      // Update Unexcused rates
      const unexcusedState = settingFeeReducer(
        excusedState,
        updateDraftUnexcusedRates({ mainMealRatePercent: 10, breakfastRatePercent: 15 })
      );
      assert.equal(
        unexcusedState.draft.latePickupAndRefund.mealRefund.unexcusedRates.mainMealRatePercent,
        10
      );
      assert.equal(
        unexcusedState.draft.latePickupAndRefund.mealRefund.unexcusedRates.breakfastRatePercent,
        15
      );

      // Update Holiday rates
      const holidayState = settingFeeReducer(
        unexcusedState,
        updateDraftHolidayRates({ mainMealRatePercent: 90, breakfastRatePercent: 95 })
      );
      assert.equal(
        holidayState.draft.latePickupAndRefund.mealRefund.holidayRates.mainMealRatePercent,
        90
      );
      assert.equal(
        holidayState.draft.latePickupAndRefund.mealRefund.holidayRates.breakfastRatePercent,
        95
      );
    });

    it('manages national and custom holiday items with automated date recalculation', () => {
      const initialState = settingFeeReducer(undefined, { type: '@@INIT' });
      const initialHolidayCount = initialState.draft.latePickupAndRefund.mealRefund.holidays.length;

      // Add custom holiday
      const newHol = {
        id: 'hol-custom-test',
        name: 'Lễ hội trường',
        lawBasis: 'Sự kiện nội bộ',
        startDate: '2026-11-20',
        endDate: '2026-11-20',
        dayCount: 1,
        isActive: true,
        isCustom: true
      };
      const addedState = settingFeeReducer(initialState, addDraftHolidayItem(newHol));
      assert.equal(
        addedState.draft.latePickupAndRefund.mealRefund.holidays.length,
        initialHolidayCount + 1
      );

      // Update holiday dates
      const updatedState = settingFeeReducer(
        addedState,
        updateDraftHolidayItem({
          id: 'hol-custom-test',
          item: { startDate: '2026-11-20', endDate: '2026-11-22' }
        })
      );
      const updatedItem = updatedState.draft.latePickupAndRefund.mealRefund.holidays.find(
        (h) => h.id === 'hol-custom-test'
      );
      assert.ok(updatedItem);
      assert.equal(updatedItem.dayCount, 3);

      // Remove custom holiday
      const removedState = settingFeeReducer(
        updatedState,
        removeDraftHolidayItem('hol-custom-test')
      );
      assert.equal(
        removedState.draft.latePickupAndRefund.mealRefund.holidays.length,
        initialHolidayCount
      );
    });

    it('manages dynamic refundable fees with unit "ngày", defaults to "Tiền ăn" and "Phí đưa đón 2A8", and synchronizes across groups A and B', () => {
      const initialState = settingFeeReducer(undefined, { type: '@@INIT' });
      const refundFees = initialState.draft.latePickupAndRefund.mealRefund.refundableFees;

      // 1. Invariant: Default refundable fees present
      assert.ok(Array.isArray(refundFees));
      assert.equal(refundFees.length, 2);
      assert.equal(refundFees[0].code, 'TIEN_AN');
      assert.equal(refundFees[0].isDefault, true);
      assert.equal(refundFees[0].unit, 'ngày');
      assert.equal(refundFees[1].code, 'DUA_DON_2A8');

      // 2. Add new custom daily fee 'Ăn sáng'
      const newDailyFee = {
        feeId: 'fee-cust-023',
        code: 'AN_SANG',
        name: 'Ăn sáng',
        unit: 'ngày',
        defaultAmount: 60000,
        isDefault: false,
        holidayRatePercent: 100,
        excusedRatePercent: 50,
        unexcusedRatePercent: 0
      };
      const addedState = settingFeeReducer(initialState, addDraftRefundableFee(newDailyFee));
      assert.equal(
        addedState.draft.latePickupAndRefund.mealRefund.refundableFees.length,
        3
      );
      assert.equal(addedState.dirtyFlags.latePickupAndRefund, true);

      // Verify fee is present in state
      const addedFee = addedState.draft.latePickupAndRefund.mealRefund.refundableFees.find(
        (f) => f.feeId === 'fee-cust-023'
      );
      assert.ok(addedFee);
      assert.equal(addedFee.name, 'Ăn sáng');

      // 3. Update Holiday %, Excused %, and Unexcused % for the added fee
      const updatedHoliday = settingFeeReducer(
        addedState,
        updateDraftRefundableFeeRate({
          feeId: 'fee-cust-023',
          rateType: 'holiday',
          percent: 90
        })
      );
      const updatedExcused = settingFeeReducer(
        updatedHoliday,
        updateDraftRefundableFeeRate({
          feeId: 'fee-cust-023',
          rateType: 'excused',
          percent: 75
        })
      );
      const updatedUnexcused = settingFeeReducer(
        updatedExcused,
        updateDraftRefundableFeeRate({
          feeId: 'fee-cust-023',
          rateType: 'unexcused',
          percent: 20
        })
      );

      const targetFee = updatedUnexcused.draft.latePickupAndRefund.mealRefund.refundableFees.find(
        (f) => f.feeId === 'fee-cust-023'
      );
      assert.equal(targetFee.holidayRatePercent, 90);
      assert.equal(targetFee.excusedRatePercent, 75);
      assert.equal(targetFee.unexcusedRatePercent, 20);

      // 4. Invariant: Default 'Tiền ăn' cannot be removed
      const tryRemoveDefault = settingFeeReducer(
        updatedUnexcused,
        removeDraftRefundableFee('fee-sys-002')
      );
      assert.equal(
        tryRemoveDefault.draft.latePickupAndRefund.mealRefund.refundableFees.length,
        3
      );

      // 5. Remove custom fee 'Ăn sáng' -> Successfully removed
      const removedCustom = settingFeeReducer(
        updatedUnexcused,
        removeDraftRefundableFee('fee-cust-023')
      );
      assert.equal(
        removedCustom.draft.latePickupAndRefund.mealRefund.refundableFees.length,
        2
      );
      assert.equal(
        removedCustom.draft.latePickupAndRefund.mealRefund.refundableFees[0].code,
        'TIEN_AN'
      );
    });

    it('adds multiple refundable fees at once with addDraftRefundableFees', () => {
      const initialState = settingFeeReducer(undefined, { type: '@@INIT' });
      assert.equal(initialState.draft.latePickupAndRefund.mealRefund.refundableFees.length, 2);

      const batchFees = [
        {
          feeId: 'fee-cust-023',
          code: 'AN_SANG',
          name: 'Ăn sáng',
          unit: 'ngày',
          defaultAmount: 60000,
          isDefault: false,
          holidayRatePercent: 100,
          excusedRatePercent: 50,
          unexcusedRatePercent: 0
        },
        {
          feeId: 'fee-cust-024',
          code: 'BAN_TRU_T7',
          name: 'Bán trú thứ 7',
          unit: 'ngày',
          defaultAmount: 50000,
          isDefault: false,
          holidayRatePercent: 100,
          excusedRatePercent: 50,
          unexcusedRatePercent: 0
        }
      ];

      const batchAddedState = settingFeeReducer(
        initialState,
        addDraftRefundableFees(batchFees)
      );

      assert.equal(
        batchAddedState.draft.latePickupAndRefund.mealRefund.refundableFees.length,
        4
      );
      assert.equal(batchAddedState.dirtyFlags.latePickupAndRefund, true);
      assert.ok(
        batchAddedState.draft.latePickupAndRefund.mealRefund.refundableFees.some(
          (f) => f.feeId === 'fee-cust-023'
        )
      );
      assert.ok(
        batchAddedState.draft.latePickupAndRefund.mealRefund.refundableFees.some(
          (f) => f.feeId === 'fee-cust-024'
        )
      );
    });

    it('saves and discards all changes globally', () => {
      const initialState = settingFeeReducer(undefined, { type: '@@INIT' });
      const dirtyState = settingFeeReducer(
        settingFeeReducer(initialState, updateDraftInvoiceNote('Note draft')),
        updateDraftSInvoice({ taxCode: '9999999999' })
      );
      assert.equal(dirtyState.dirtyFlags.invoiceNote, true);
      assert.equal(dirtyState.dirtyFlags.sinvoice, true);

      const savedAllState = settingFeeReducer(dirtyState, saveAllChanges());
      assert.equal(savedAllState.dirtyFlags.invoiceNote, false);
      assert.equal(savedAllState.dirtyFlags.sinvoice, false);
      assert.equal(savedAllState.invoiceNote.note, 'Note draft');
      assert.equal(savedAllState.sinvoice.taxCode, '9999999999');
    });

    describe('School Group Reconciliation & Schedule Mode Invariants', () => {
      it('initializes all default mock school groups with scheduleType "year" and empty terms array', () => {
        const initialState = settingFeeReducer(undefined, { type: '@@INIT' });
        assert.equal(initialState.schoolGroups.length, 4);

        for (const group of initialState.schoolGroups) {
          assert.equal(group.scheduleType, 'year');
          assert.equal(group.termCount, 1);
          assert.deepEqual(group.terms, []); // Red frame is empty/deleted for all year-based groups!
        }

        const uattest2 = initialState.schoolGroups.find((g) => g.groupCode === 'UATTEST2');
        assert.ok(uattest2);
        assert.equal(uattest2.groupCode, 'UATTEST2');
        assert.equal(uattest2.groupName, 'UATTest2');
        assert.equal(uattest2.serviceStartDate, '2026-09-05');
        assert.equal(uattest2.serviceEndDate, '2027-05-25');
        assert.deepEqual(uattest2.terms, []);
      });

      it('opens modal and updates activeGroupDraft with isolated state', () => {
        const initialState = settingFeeReducer(undefined, { type: '@@INIT' });
        const targetGroup = initialState.schoolGroups[0];

        const openState = settingFeeReducer(initialState, openSchoolGroupModal(targetGroup));
        assert.equal(openState.isGroupModalOpen, true);
        assert.ok(openState.draft.activeGroupDraft);
        assert.equal(openState.draft.activeGroupDraft.groupCode, targetGroup.groupCode);

        // Update draft
        const updatedDraftState = settingFeeReducer(
          openState,
          updateActiveGroupDraft({ serviceStartDate: '2026-09-01' })
        );
        assert.equal(updatedDraftState.draft.activeGroupDraft.serviceStartDate, '2026-09-01');
        assert.equal(updatedDraftState.dirtyFlags.schoolGroups, true);

        // Close modal
        const closedState = settingFeeReducer(updatedDraftState, closeSchoolGroupModal());
        assert.equal(closedState.isGroupModalOpen, false);
        assert.equal(closedState.draft.activeGroupDraft, null);
      });

      it('deletes sub-period terms when switching from "term" mode back to "year" mode (red frame removal)', () => {
        const initialState = settingFeeReducer(undefined, { type: '@@INIT' });
        const targetGroup = initialState.schoolGroups[0];

        // Open modal
        const openState = settingFeeReducer(initialState, openSchoolGroupModal(targetGroup));

        // Switch to "term" mode (Đối soát theo kỳ)
        const termModeState = settingFeeReducer(
          openState,
          updateActiveGroupScheduleType('term')
        );
        assert.equal(termModeState.draft.activeGroupDraft.scheduleType, 'term');
        assert.equal(termModeState.draft.activeGroupDraft.termCount, 2);

        // Generate terms for 2 periods
        const generatedState = settingFeeReducer(termModeState, generateActiveGroupTerms());
        assert.equal(generatedState.draft.activeGroupDraft.terms.length, 2);
        assert.equal(generatedState.draft.activeGroupDraft.terms[0].termName.includes('Kỳ 1'), true);
        assert.equal(generatedState.draft.activeGroupDraft.terms[1].termName.includes('Kỳ 2'), true);

        // NOW CRITICAL: Switch back to "year" mode (Đối soát theo năm)
        const yearModeState = settingFeeReducer(
          generatedState,
          updateActiveGroupScheduleType('year')
        );
        assert.equal(yearModeState.draft.activeGroupDraft.scheduleType, 'year');
        assert.equal(yearModeState.draft.activeGroupDraft.termCount, 1);
        // Assert the entire sub-periods table (red frame) is DELETED!
        assert.deepEqual(yearModeState.draft.activeGroupDraft.terms, []);
      });

      it('generateTermsForSchedule returns empty array for "year" schedule and creates intervals for "term" schedule', () => {
        // Year mode: MUST return []
        const yearTerms = generateTermsForSchedule('2026-09-05', '2027-05-25', 1, 'year');
        assert.deepEqual(yearTerms, []);

        // Term mode: returns calculated term slices
        const termTerms = generateTermsForSchedule('2026-09-05', '2027-05-25', 2, 'term');
        assert.equal(termTerms.length, 2);
        assert.equal(termTerms[0].termName.startsWith('Kỳ 1'), true);
        assert.equal(termTerms[1].termName.startsWith('Kỳ 2'), true);
        assert.equal(termTerms[0].isChargeable, true);
        assert.equal(termTerms[1].isChargeable, true);
      });

      it('validateSchoolGroupConfig enforces zero terms and termCount=1 for "year" schedule', () => {
        // Valid year config (empty terms)
        const validYearConfig = {
          id: 'test-group',
          groupCode: 'UATTEST2',
          groupName: 'UATTest2',
          branchCount: 0,
          reconciliationUnit: 'group',
          emails: ['hieu.vo1@finviet.com.vn'],
          scheduleType: 'year',
          serviceStartDate: '2026-09-05',
          serviceEndDate: '2027-05-25',
          termCount: 1,
          terms: [],
          threshold: { minActiveMonths: 1, roundingDaysThreshold: 15 }
        };
        const validResult = validateSchoolGroupConfig(validYearConfig);
        assert.equal(validResult.isValid, true);

        // Invalid year config having terms (violates year rule)
        const invalidYearConfig = {
          ...validYearConfig,
          terms: [
            {
              id: 't-1',
              termName: 'Kỳ 1',
              startDate: '2026-09-05',
              endDate: '2027-02-17',
              isChargeable: true
            }
          ]
        };
        const invalidResult = validateSchoolGroupConfig(invalidYearConfig);
        assert.equal(invalidResult.isValid, false);
        assert.ok(invalidResult.errors.terms);
      });
    });
  });

  describe('BR-SIM-01: Attendance Refund Sandbox Simulation Engine', () => {
    const simExcusedDays = 3;
    const simUnexcusedDays = 2;

    const computeSimulation = (fees) => {
      const items = fees.map((fee) => {
        const unitPrice =
          fee.defaultAmount && fee.defaultAmount > 0
            ? fee.defaultAmount
            : fee.code === 'TIEN_AN'
            ? 40000
            : 20000;
        const excusedRate = fee.excusedRatePercent ?? 50;
        const unexcusedRate = fee.unexcusedRatePercent ?? 0;

        const excusedRefund = Math.round(
          simExcusedDays * unitPrice * (excusedRate / 100)
        );
        const unexcusedRefund = Math.round(
          simUnexcusedDays * unitPrice * (unexcusedRate / 100)
        );
        const totalRefund = excusedRefund + unexcusedRefund;

        return {
          feeId: fee.feeId,
          name: fee.name,
          unitPrice,
          excusedRefund,
          unexcusedRefund,
          totalRefund,
          excusedRate,
          unexcusedRate
        };
      });

      const excusedTotal = items.reduce((acc, it) => acc + it.excusedRefund, 0);
      const unexcusedTotal = items.reduce((acc, it) => acc + it.unexcusedRefund, 0);
      const monthTotal = excusedTotal + unexcusedTotal;

      return { items, excusedTotal, unexcusedTotal, monthTotal };
    };

    it('computes 0đ for 2 unexcused days by default (0%) and 102.000đ total for 3 excused days', () => {
      const defaultFees = [
        {
          feeId: 'rf-1',
          code: 'TIEN_AN',
          name: 'Tiền ăn bán trú',
          defaultAmount: 40000,
          excusedRatePercent: 50,
          unexcusedRatePercent: 0
        },
        {
          feeId: 'rf-2',
          code: 'AN_SANG',
          name: 'Tiền ăn sáng',
          defaultAmount: 20000,
          excusedRatePercent: 70,
          unexcusedRatePercent: 0
        }
      ];

      const sim = computeSimulation(defaultFees);

      // Excused: (3 * 40k * 50%) + (3 * 20k * 70%) = 60,000 + 42,000 = 102,000 VND
      assert.equal(sim.excusedTotal, 102000);
      assert.equal(sim.items[0].excusedRefund, 60000);
      assert.equal(sim.items[1].excusedRefund, 42000);

      // Unexcused: 0% by default -> 0 VND
      assert.equal(sim.unexcusedTotal, 0);
      assert.equal(sim.items[0].unexcusedRefund, 0);
      assert.equal(sim.items[1].unexcusedRefund, 0);

      // Grand total = 102,000 VND
      assert.equal(sim.monthTotal, 102000);
    });

    it('dynamically recalculates simulation numbers when user modifies unexcused absence percentages', () => {
      const customFees = [
        {
          feeId: 'rf-1',
          code: 'TIEN_AN',
          name: 'Tiền ăn bán trú',
          defaultAmount: 40000,
          excusedRatePercent: 50,
          unexcusedRatePercent: 20 // User set to 20%
        },
        {
          feeId: 'rf-2',
          code: 'AN_SANG',
          name: 'Tiền ăn sáng',
          defaultAmount: 20000,
          excusedRatePercent: 70,
          unexcusedRatePercent: 10 // User set to 10%
        }
      ];

      const sim = computeSimulation(customFees);

      // Excused stays 102,000 VND
      assert.equal(sim.excusedTotal, 102000);

      // Unexcused:
      // Tiền ăn bán trú: 2 days * 40k * 20% = 16,000 VND
      // Tiền ăn sáng: 2 days * 20k * 10% = 4,000 VND
      // Unexcused total = 20,000 VND
      assert.equal(sim.items[0].unexcusedRefund, 16000);
      assert.equal(sim.items[1].unexcusedRefund, 4000);
      assert.equal(sim.unexcusedTotal, 20000);

      // Grand total = 102,000 + 20,000 = 122,000 VND
      assert.equal(sim.monthTotal, 122000);
    });
  });
});


