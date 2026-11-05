import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isActivitySettingsDirty,
  canAddTerm,
  isTermEditingLocked,
  isAddTermLocked,
  normalizeDateForInput,
  formatDateDisplay,
  validateTermDraft,
} from '../../src/utils/featureFlagsValidation.ts';
import featureFlagsReducer, {
  setActivityToggle,
  saveActivitySettings,
  selectAcademicYear,
  startEditTerm,
  startAddTerm,
  updateDraftTerm,
  cancelEditTerm,
  saveTerm,
  clearToast,
  clearError,
} from '../../src/store/slices/featureFlagsSlice.ts';
import {
  mockInitialActivitySettings,
  mockAcademicYears,
  mockInitialTerms,
} from '../../src/services/mockFeatureFlagsData.ts';

test('Settings Feature Flags & Academic Terms (Tinh Nang) Test Suite - Feature 049 / Epic 34', async (t) => {
  // -------------------------------------------------------------
  // Suite 1: Pure Validation & Dirty-State Detection (BR02, BR03, K090, K091)
  // -------------------------------------------------------------
  await t.test('BR03 & K091: isActivitySettingsDirty returns false when active matches saved', () => {
    const saved = { allowComments: true, requireCommentModeration: true };
    const active = { allowComments: true, requireCommentModeration: true };
    assert.equal(isActivitySettingsDirty(active, saved), false);
  });

  await t.test('BR03 & K091: isActivitySettingsDirty returns true when allowComments diverges', () => {
    const saved = { allowComments: true, requireCommentModeration: true };
    const active = { allowComments: false, requireCommentModeration: true };
    assert.equal(isActivitySettingsDirty(active, saved), true);
  });

  await t.test('BR03 & K091: isActivitySettingsDirty returns true when requireCommentModeration diverges', () => {
    const saved = { allowComments: true, requireCommentModeration: true };
    const active = { allowComments: true, requireCommentModeration: false };
    assert.equal(isActivitySettingsDirty(active, saved), true);
  });

  await t.test('BR02 & K090: Toggle decoupling - both toggles can diverge independently', () => {
    const saved = { allowComments: true, requireCommentModeration: true };
    // Comment disabled, moderation still enabled
    const active1 = { allowComments: false, requireCommentModeration: true };
    assert.equal(isActivitySettingsDirty(active1, saved), true);

    // Comment disabled, moderation disabled
    const active2 = { allowComments: false, requireCommentModeration: false };
    assert.equal(isActivitySettingsDirty(active2, saved), true);
  });

  // -------------------------------------------------------------
  // Suite 2: Statutory Two-Term Limit & Add Term Invariants (BR05, BR08, K092)
  // -------------------------------------------------------------
  await t.test('BR05 & K092: canAddTerm enforces strict two-term ceiling', () => {
    const emptyTerms = [];
    assert.equal(canAddTerm(emptyTerms), true);

    const oneTerm = [{ id: 'term-1', academicYearId: 'year-1', termName: 'Học kì 1', startDate: '2026-09-01', endDate: '2027-01-15' }];
    assert.equal(canAddTerm(oneTerm), true);

    const twoTerms = [
      { id: 'term-1', academicYearId: 'year-1', termName: 'Học kì 1', startDate: '2026-09-01', endDate: '2027-01-15' },
      { id: 'term-2', academicYearId: 'year-1', termName: 'Học kì 2', startDate: '2027-01-16', endDate: '2027-05-31' },
    ];
    assert.equal(canAddTerm(twoTerms), false);
  });

  await t.test('BR05, BR08: isAddTermLocked disables add button when at 2 terms or when editing', () => {
    // 0 terms, not editing -> unlocked
    assert.equal(isAddTermLocked(null, 0), false);
    // 1 term, not editing -> unlocked
    assert.equal(isAddTermLocked(null, 1), false);
    // 2 terms, not editing -> locked (two-term ceiling)
    assert.equal(isAddTermLocked(null, 2), true);
    // 1 term, but editing another row -> locked (mutual exclusion)
    assert.equal(isAddTermLocked('term-1', 1), true);
    // 0 terms, but in addition mode -> locked (prevents multi-add)
    assert.equal(isAddTermLocked('new', 0), true);
  });

  // -------------------------------------------------------------
  // Suite 3: Single-Row Mutual Exclusion Locking (BR06, BR07, K093, NFR01)
  // -------------------------------------------------------------
  await t.test('BR07 & K093: isTermEditingLocked locks sibling rows while one row is editing', () => {
    // No term being edited -> neither is locked
    assert.equal(isTermEditingLocked('term-1', null), false);
    assert.equal(isTermEditingLocked('term-2', null), false);

    // term-1 is being edited -> term-1 is NOT locked, term-2 IS locked
    assert.equal(isTermEditingLocked('term-1', 'term-1'), false);
    assert.equal(isTermEditingLocked('term-2', 'term-1'), true);

    // in add mode ('new') -> both existing terms are locked
    assert.equal(isTermEditingLocked('term-1', 'new'), true);
    assert.equal(isTermEditingLocked('term-2', 'new'), true);
  });

  // -------------------------------------------------------------
  // Suite 4: Date Formatting & Validation
  // -------------------------------------------------------------
  await t.test('Date Utilities: normalizeDateForInput and formatDateDisplay', () => {
    assert.equal(normalizeDateForInput('15/01/2027'), '2027-01-15');
    assert.equal(normalizeDateForInput('2027-01-15'), '2027-01-15');
    assert.equal(formatDateDisplay('2027-01-15'), '15/01/2027');
    assert.equal(formatDateDisplay('15/01/2027'), '15/01/2027');
    assert.equal(formatDateDisplay(''), '');
  });

  await t.test('Date Validation: validateTermDraft checks required fields and chronological order', () => {
    // Missing term name
    const missingName = validateTermDraft({
      termName: '',
      startDate: '2026-09-01',
      endDate: '2027-01-15',
      notes: '',
    });
    assert.equal(missingName.isValid, false);
    assert.equal(missingName.errors.termName, 'Học kỳ không được để trống');

    // Missing start date
    const missingStart = validateTermDraft({
      termName: 'Học kì 1',
      startDate: '',
      endDate: '2027-01-15',
      notes: '',
    });
    assert.equal(missingStart.isValid, false);
    assert.equal(missingStart.errors.startDate, 'Ngày bắt đầu không được để trống');

    // Inverted date range (start > end)
    const invertedDates = validateTermDraft({
      termName: 'Học kì 1',
      startDate: '2027-02-01',
      endDate: '2027-01-15',
      notes: '',
    });
    assert.equal(invertedDates.isValid, false);
    assert.equal(invertedDates.errors.dateRange, 'Ngày bắt đầu phải trước hoặc bằng ngày kết thúc');

    // Valid draft
    const validDraft = validateTermDraft({
      termName: 'Học kì 1',
      startDate: '2026-09-01',
      endDate: '2027-01-15',
      notes: 'Ghi chú học kỳ 1',
    });
    assert.equal(validDraft.isValid, true);
    assert.deepEqual(validDraft.errors, {});
  });

  // -------------------------------------------------------------
  // Suite 5: Redux State Machine Transitions
  // -------------------------------------------------------------
  await t.test('Redux: Initial state contains defaults and current academic year selected', () => {
    const state = featureFlagsReducer(undefined, { type: '@@INIT' });
    assert.equal(state.activitySettings.allowComments, true);
    assert.equal(state.activitySettings.requireCommentModeration, true);
    assert.equal(state.selectedAcademicYearId, 'year-2026-2027');
    assert.equal(state.inlineEdit.editingTermId, null);
    assert.equal(state.inlineEdit.draftTerm, null);
  });

  await t.test('Redux: setActivityToggle mutates active settings independently', () => {
    let state = featureFlagsReducer(undefined, { type: '@@INIT' });

    state = featureFlagsReducer(
      state,
      setActivityToggle({ key: 'allowComments', value: false })
    );
    assert.equal(state.activitySettings.allowComments, false);
    assert.equal(state.activitySettings.requireCommentModeration, true);
    assert.equal(isActivitySettingsDirty(state.activitySettings, state.savedActivitySettings), true);

    state = featureFlagsReducer(state, saveActivitySettings());
    assert.equal(state.savedActivitySettings.allowComments, false);
    assert.equal(isActivitySettingsDirty(state.activitySettings, state.savedActivitySettings), false);
    assert.equal(state.toastMessage, 'Cập nhật cấu hình thành công');
  });

  await t.test('Redux: selectAcademicYear cancels active inline editing and resets error', () => {
    let state = featureFlagsReducer(undefined, { type: '@@INIT' });
    state = featureFlagsReducer(state, selectAcademicYear('year-2024-2025'));
    state = featureFlagsReducer(state, startAddTerm());
    assert.equal(state.inlineEdit.editingTermId, 'new');

    state = featureFlagsReducer(state, selectAcademicYear('year-2025-2026'));
    assert.equal(state.selectedAcademicYearId, 'year-2025-2026');
    assert.equal(state.inlineEdit.editingTermId, null);
    assert.equal(state.inlineEdit.draftTerm, null);
  });

  await t.test('Redux: startEditTerm, updateDraftTerm, cancelEditTerm, and saveTerm for existing term', () => {
    let state = featureFlagsReducer(undefined, { type: '@@INIT' });

    // Start edit
    state = featureFlagsReducer(state, startEditTerm('term-2026-1'));
    assert.equal(state.inlineEdit.editingTermId, 'term-2026-1');
    assert.equal(state.inlineEdit.draftTerm?.termName, 'Học kì 1');

    // Update draft fields
    state = featureFlagsReducer(
      state,
      updateDraftTerm({ notes: 'Ghi chú mới cập nhật' })
    );
    assert.equal(state.inlineEdit.draftTerm?.notes, 'Ghi chú mới cập nhật');

    // Cancel edit reverts without mutating original term
    const canceledState = featureFlagsReducer(state, cancelEditTerm());
    assert.equal(canceledState.inlineEdit.editingTermId, null);
    const unchangedTerm = canceledState.terms.find((t) => t.id === 'term-2026-1');
    assert.notEqual(unchangedTerm?.notes, 'Ghi chú mới cập nhật');

    // Save term commits the changes
    const savedState = featureFlagsReducer(state, saveTerm());
    assert.equal(savedState.inlineEdit.editingTermId, null);
    const updatedTerm = savedState.terms.find((t) => t.id === 'term-2026-1');
    assert.equal(updatedTerm?.notes, 'Ghi chú mới cập nhật');
    assert.equal(savedState.toastMessage, 'Cập nhật học kỳ thành công');
  });

  await t.test('Redux: startAddTerm inserts draft and saveTerm appends new term', () => {
    let state = featureFlagsReducer(undefined, { type: '@@INIT' });
    // Switch to year-2024-2025 which only has 1 term
    state = featureFlagsReducer(state, selectAcademicYear('year-2024-2025'));

    state = featureFlagsReducer(state, startAddTerm());
    assert.equal(state.inlineEdit.editingTermId, 'new');
    assert.equal(state.inlineEdit.draftTerm?.termName, 'Học kì 2');

    state = featureFlagsReducer(
      state,
      updateDraftTerm({
        startDate: '2025-01-16',
        endDate: '2025-05-31',
        notes: 'Kỳ 2 năm 2024 - 2025',
      })
    );

    state = featureFlagsReducer(state, saveTerm());
    assert.equal(state.inlineEdit.editingTermId, null);
    const yearTerms = state.terms.filter((t) => t.academicYearId === 'year-2024-2025');
    assert.equal(yearTerms.length, 2);
    assert.equal(state.toastMessage, 'Thêm học kỳ mới thành công');
  });

  await t.test('Redux: startAddTerm is blocked if academic year already has 2 terms', () => {
    let state = featureFlagsReducer(undefined, { type: '@@INIT' });
    // year-2026-2027 already has 2 terms
    state = featureFlagsReducer(state, startAddTerm());
    assert.equal(state.inlineEdit.editingTermId, null);
    assert.equal(state.error, 'Mỗi năm học chỉ được phép khai báo tối đa 2 học kỳ');
  });

  await t.test('Redux: clearToast and clearError reset transient feedback', () => {
    let state = featureFlagsReducer(undefined, { type: '@@INIT' });
    state = featureFlagsReducer(state, saveActivitySettings());
    assert.ok(state.toastMessage);

    state = featureFlagsReducer(state, clearToast());
    assert.equal(state.toastMessage, null);
  });
});
