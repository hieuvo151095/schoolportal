import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarCheck,
  faCheckCircle,
  faExclamationCircle,
} from '@fortawesome/free-solid-svg-icons';
import { Dropdown, Button } from '@/components/ds';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  selectAcademicYear,
  startEditTerm,
  startAddTerm,
  updateDraftTerm,
  cancelEditTerm,
  saveTerm,
  clearToast,
  clearError,
} from '../../../store/slices/featureFlagsSlice';
import {
  isAddTermLocked,
  isTermEditingLocked,
  validateTermDraft,
} from '../../../utils/featureFlagsValidation';
import { InlineTermRow } from './InlineTermRow';
import { InlineTermDraft } from '../../../types/featureFlags';

export const PeriodSettingsTab: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    academicYears,
    selectedAcademicYearId,
    terms,
    inlineEdit,
    error,
    toastMessage,
  } = useAppSelector((state) => state.featureFlags);

  const [dateValidationError, setDateValidationError] = useState<string | null>(null);

  // Auto-dismiss toast
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        dispatch(clearToast());
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage, dispatch]);

  const currentYearTerms = terms.filter(
    (t) => t.academicYearId === selectedAcademicYearId
  );

  const isAddingNew = inlineEdit.editingTermId === 'new';
  const addLocked = isAddTermLocked(
    inlineEdit.editingTermId,
    currentYearTerms.length
  );

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(selectAcademicYear(e.target.value));
    setDateValidationError(null);
  };

  const handleStartAdd = () => {
    if (addLocked) return;
    setDateValidationError(null);
    dispatch(startAddTerm());
  };

  const handleFieldChange = (field: keyof InlineTermDraft, value: string) => {
    dispatch(updateDraftTerm({ [field]: value }));
    setDateValidationError(null);
    if (error) {
      dispatch(clearError());
    }
  };

  const handleSave = () => {
    if (!inlineEdit.draftTerm) return;

    const validation = validateTermDraft(inlineEdit.draftTerm);
    if (!validation.isValid) {
      const firstError =
        validation.errors.dateRange ||
        validation.errors.termName ||
        validation.errors.startDate ||
        validation.errors.endDate;
      setDateValidationError(firstError || 'Thông tin nhập liệu không hợp lệ');
      return;
    }

    setDateValidationError(null);
    dispatch(saveTerm());
  };

  const handleCancel = () => {
    setDateValidationError(null);
    dispatch(cancelEditTerm());
  };

  const currentYear = academicYears.find((y) => y.id === selectedAcademicYearId);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg animate-fade-in text-sm font-medium">
          <FontAwesomeIcon icon={faCheckCircle} className="text-base" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        {/* Toolbar: Academic Year Selector & Add Term Action */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <Dropdown
              placeholder="Chọn năm học"
              options={academicYears.map((year) => ({
                value: year.id,
                label: `${year.name}${year.isCurrent ? ' (Hiện tại)' : ''}`,
              }))}
              value={selectedAcademicYearId}
              defaultValue={academicYears.find((y) => y.isCurrent)?.id || 'year-2026-2027'}
              onChange={(val) => {
                dispatch(selectAcademicYear(val));
                setDateValidationError(null);
              }}
              size="md"
              className="min-w-[220px]"
            />
          </div>

          {/* "+ Thêm học kỳ" Button (BR05, BR08, K092) */}
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              icon="plus"
              disabled={addLocked}
              onClick={handleStartAdd}
              title={
                currentYearTerms.length >= 2
                  ? 'Năm học này đã đủ 2 học kỳ (tối đa 2 học kỳ/năm)'
                  : inlineEdit.editingTermId !== null
                  ? 'Đang có học kỳ khác được chỉnh sửa'
                  : 'Thêm học kỳ mới'
              }
            >
              Thêm học kỳ
            </Button>
          </div>
        </div>

        {/* Global Error Banner if any */}
        {(error || dateValidationError) && (
          <div className="mt-4 flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            <FontAwesomeIcon icon={faExclamationCircle} className="text-sm shrink-0" />
            <span>{error || dateValidationError}</span>
          </div>
        )}

        {/* Academic Terms Table */}
        <div className="overflow-x-auto mt-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-700 text-xs font-semibold uppercase tracking-wider">
                <th className="px-4 py-3 text-center w-12">STT</th>
                <th className="px-4 py-3 min-w-[140px]">Học kỳ</th>
                <th className="px-4 py-3 min-w-[140px]">Ngày bắt đầu</th>
                <th className="px-4 py-3 min-w-[140px]">Ngày kết thúc</th>
                <th className="px-4 py-3 min-w-[180px]">Ghi chú</th>
                <th className="px-4 py-3 text-center w-24">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {/* Existing Terms List */}
              {currentYearTerms.map((term, idx) => {
                const isEditing = inlineEdit.editingTermId === term.id;
                const isLocked = isTermEditingLocked(term.id, inlineEdit.editingTermId);

                return (
                  <InlineTermRow
                    key={term.id}
                    term={term}
                    index={idx}
                    isEditing={isEditing}
                    isLocked={isLocked}
                    draftTerm={isEditing ? inlineEdit.draftTerm : null}
                    onEdit={() => dispatch(startEditTerm(term.id))}
                    onSave={handleSave}
                    onCancel={handleCancel}
                    onChange={handleFieldChange}
                    validationError={isEditing ? dateValidationError : null}
                  />
                );
              })}

              {/* In-flight Adding New Term Row (BR08, K093) */}
              {isAddingNew && inlineEdit.draftTerm && (
                <InlineTermRow
                  term={{
                    id: 'new',
                    academicYearId: selectedAcademicYearId,
                    termName: inlineEdit.draftTerm.termName,
                    startDate: inlineEdit.draftTerm.startDate,
                    endDate: inlineEdit.draftTerm.endDate,
                    notes: inlineEdit.draftTerm.notes,
                    isDraft: true,
                  }}
                  index={currentYearTerms.length}
                  isEditing={true}
                  isLocked={false}
                  draftTerm={inlineEdit.draftTerm}
                  onEdit={() => {}}
                  onSave={handleSave}
                  onCancel={handleCancel}
                  onChange={handleFieldChange}
                  validationError={dateValidationError}
                />
              )}

              {/* Clean Empty State (BR10) */}
              {currentYearTerms.length === 0 && !isAddingNew && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-12 text-center text-sm text-slate-500 italic bg-slate-50/30"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                        <FontAwesomeIcon icon={faCalendarCheck} />
                      </div>
                      <span>Chưa có học kỳ</span>
                      <span className="text-xs text-slate-400 font-normal not-italic">
                        Nhấn nút &ldquo;Thêm học kỳ&rdquo; ở trên để bắt đầu khai báo mốc thời gian
                      </span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Notes & Statutory Info */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between text-xs text-slate-400 gap-2">
          <span>
            Theo quy định của Bộ GD&ĐT, mỗi năm học được chia tối đa 2 học kỳ (Học kì 1 và Học kì 2).
          </span>
          <span className="font-medium text-slate-500">
            Tổng cộng: {currentYearTerms.length}/2 học kỳ
          </span>
        </div>
      </div>
    </div>
  );
};
