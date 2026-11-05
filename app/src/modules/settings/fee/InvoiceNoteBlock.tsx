import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faSave, faUndo, faClock, faUserEdit } from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  updateDraftInvoiceNote,
  saveInvoiceNote,
  discardInvoiceNote
} from '@/store/slices/settingFeeSlice';
import { addToast } from '@/store/slices/toastSlice';

export const InvoiceNoteBlock: React.FC = () => {
  const dispatch = useAppDispatch();
  const invoiceNote = useAppSelector((state) => state.settingFee.invoiceNote);
  const draftNote = useAppSelector((state) => state.settingFee.draft.invoiceNote);
  const isDirty = useAppSelector((state) => state.settingFee.dirtyFlags.invoiceNote);

  const handleSave = () => {
    dispatch(saveInvoiceNote());
    dispatch(
      addToast({
        type: 'success',
        message: 'Lưu ghi chú hóa đơn học phí thành công!'
      })
    );
  };

  const handleDiscard = () => {
    dispatch(discardInvoiceNote());
    dispatch(
      addToast({
        type: 'info',
        message: 'Đã hoàn tác thay đổi ghi chú hóa đơn.'
      })
    );
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#0070CE] flex items-center justify-center font-bold">
            <FontAwesomeIcon icon={faFileAlt} className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-800">
                Ghi chú hóa đơn học phí
              </h2>
              {isDirty && (
                <span className="px-2 py-0.5 text-[11px] font-semibold bg-amber-100 text-amber-800 rounded-full border border-amber-200">
                  Chưa lưu
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Nội dung ghi chú hiển thị ở chân trang phiếu báo học phí và thông báo gửi đến phụ huynh.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {isDirty && (
            <button
              type="button"
              onClick={handleDiscard}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors flex items-center gap-1.5"
            >
              <FontAwesomeIcon icon={faUndo} className="w-3 h-3" />
              <span>Hoàn tác</span>
            </button>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={!isDirty}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 shadow-xs ${
              isDirty
                ? 'bg-[#0070CE] hover:bg-[#005bb5] text-white cursor-pointer active:scale-95'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
            }`}
          >
            <FontAwesomeIcon icon={faSave} className="w-3.5 h-3.5" />
            <span>Lưu thay đổi</span>
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-6">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Nội dung ghi chú
        </label>
        <textarea
          rows={4}
          value={draftNote.note}
          onChange={(e) => dispatch(updateDraftInvoiceNote(e.target.value))}
          placeholder="Nhập nội dung ghi chú hóa đơn học phí gửi cho phụ huynh..."
          className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0070CE] focus:border-transparent transition-all placeholder:text-slate-400 leading-relaxed"
        />

        {/* Metadata Footer */}
        <div className="mt-3 flex flex-wrap items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <FontAwesomeIcon icon={faClock} className="w-3 h-3 text-slate-400" />
              Cập nhật lần cuối: <strong className="text-slate-700">{invoiceNote.updatedAt || '—'}</strong>
            </span>
            {invoiceNote.updatedBy && (
              <span className="flex items-center gap-1.5">
                <FontAwesomeIcon icon={faUserEdit} className="w-3 h-3 text-slate-400" />
                Bởi: <span className="text-slate-700">{invoiceNote.updatedBy}</span>
              </span>
            )}
          </div>
          <span className="text-slate-400">
            {draftNote.note.length} ký tự
          </span>
        </div>
      </div>
    </div>
  );
};
