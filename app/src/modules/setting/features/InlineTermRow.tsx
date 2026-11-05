import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPen,
  faCheck,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import {
  AcademicTerm,
  InlineTermDraft,
} from '../../../types/featureFlags';
import {
  formatDateDisplay,
  normalizeDateForInput,
} from '../../../utils/featureFlagsValidation';

interface InlineTermRowProps {
  term: AcademicTerm;
  index: number;
  isEditing: boolean;
  isLocked: boolean;
  draftTerm: InlineTermDraft | null;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onChange: (field: keyof InlineTermDraft, value: string) => void;
  validationError?: string | null;
}

export const InlineTermRow: React.FC<InlineTermRowProps> = ({
  term,
  index,
  isEditing,
  isLocked,
  draftTerm,
  onEdit,
  onSave,
  onCancel,
  onChange,
  validationError,
}) => {
  if (isEditing && draftTerm) {
    return (
      <tr className="bg-blue-50/60 border-b border-blue-200">
        <td className="px-4 py-3 text-xs font-semibold text-slate-600 text-center w-12">
          {index + 1}
        </td>

        {/* Inline Input: Học kỳ */}
        <td className="px-4 py-2">
          <input
            type="text"
            value={draftTerm.termName}
            onChange={(e) => onChange('termName', e.target.value)}
            placeholder="Tên học kỳ"
            className="w-full px-3 py-1.5 text-xs md:text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0070CE] focus:border-transparent font-medium"
            autoFocus
          />
        </td>

        {/* Inline Input: Ngày bắt đầu */}
        <td className="px-4 py-2">
          <input
            type="date"
            value={normalizeDateForInput(draftTerm.startDate)}
            onChange={(e) => onChange('startDate', e.target.value)}
            className="w-full px-3 py-1.5 text-xs md:text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0070CE] focus:border-transparent"
          />
        </td>

        {/* Inline Input: Ngày kết thúc */}
        <td className="px-4 py-2">
          <input
            type="date"
            value={normalizeDateForInput(draftTerm.endDate)}
            onChange={(e) => onChange('endDate', e.target.value)}
            className="w-full px-3 py-1.5 text-xs md:text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0070CE] focus:border-transparent"
          />
          {validationError && (
            <div className="text-[11px] text-rose-600 font-medium mt-1">
              {validationError}
            </div>
          )}
        </td>

        {/* Inline Input: Ghi chú */}
        <td className="px-4 py-2">
          <input
            type="text"
            value={draftTerm.notes}
            onChange={(e) => onChange('notes', e.target.value)}
            placeholder="Ghi chú (tùy chọn)"
            className="w-full px-3 py-1.5 text-xs md:text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0070CE] focus:border-transparent text-slate-700"
          />
        </td>

        {/* Inline Actions: Lưu (Tick) & Hủy (X) (BR06, K093) */}
        <td className="px-4 py-2 text-center whitespace-nowrap">
          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={onSave}
              title="Lưu học kỳ"
              className="w-8 h-8 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-700 flex items-center justify-center transition-colors active:scale-95"
            >
              <FontAwesomeIcon icon={faCheck} className="text-sm" />
            </button>
            <button
              type="button"
              onClick={onCancel}
              title="Hủy bỏ"
              className="w-8 h-8 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition-colors active:scale-95"
            >
              <FontAwesomeIcon icon={faXmark} className="text-sm" />
            </button>
          </div>
        </td>
      </tr>
    );
  }

  // Read-only Mode
  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors">
      <td className="px-4 py-3 text-xs font-medium text-slate-500 text-center w-12">
        {index + 1}
      </td>

      <td className="px-4 py-3 text-sm font-semibold text-slate-900">
        {term.termName}
      </td>

      <td className="px-4 py-3 text-sm text-slate-600 font-medium">
        {formatDateDisplay(term.startDate)}
      </td>

      <td className="px-4 py-3 text-sm text-slate-600 font-medium">
        {formatDateDisplay(term.endDate)}
      </td>

      <td className="px-4 py-3 text-xs md:text-sm text-slate-500">
        {term.notes || '-'}
      </td>

      {/* Action Column: Only Edit icon; Zero Delete icons (BR09, K094) */}
      <td className="px-4 py-3 text-center whitespace-nowrap">
        <button
          type="button"
          disabled={isLocked}
          onClick={onEdit}
          title={isLocked ? 'Đang có học kỳ khác được chỉnh sửa' : 'Chỉnh sửa học kỳ'}
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
            isLocked
              ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
              : 'bg-blue-50 text-[#0070CE] hover:bg-blue-100 active:scale-95'
          }`}
        >
          <FontAwesomeIcon icon={faPen} className="text-xs" />
        </button>
      </td>
    </tr>
  );
};
