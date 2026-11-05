import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEnvelope,
  faPlus,
  faTimes,
  faSave,
  faUndo,
  faExclamationCircle,
  faLock,
  faScaleBalanced
} from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  addReconciliationEmail,
  removeReconciliationEmail,
  saveReconciliation,
  discardReconciliation
} from '@/store/slices/settingFeeSlice';
import { validateEmailCandidate } from '@/utils/settingFeeValidation';
import { addToast } from '@/store/slices/toastSlice';

export const ReconciliationEmailBlock: React.FC = () => {
  const dispatch = useAppDispatch();
  const draftEmails = useAppSelector((state) => state.settingFee.draft.reconciliation.emails);
  const isDirty = useAppSelector((state) => state.settingFee.dirtyFlags.reconciliation);

  const [inputEmail, setInputEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isMaxReached = draftEmails.length >= 3;

  const handleAddEmail = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const { isValid, error } = validateEmailCandidate(inputEmail, draftEmails);
    if (!isValid) {
      setErrorMessage(error || 'Email không hợp lệ');
      return;
    }

    setErrorMessage(null);
    dispatch(addReconciliationEmail(inputEmail.trim()));
    setInputEmail('');
  };

  const handleRemoveEmail = (index: number) => {
    dispatch(removeReconciliationEmail(index));
    setErrorMessage(null);
  };

  const handleSave = () => {
    dispatch(saveReconciliation());
    dispatch(
      addToast({
        type: 'success',
        message: 'Lưu danh sách email nhận đối soát thành công!'
      })
    );
  };

  const handleDiscard = () => {
    setErrorMessage(null);
    dispatch(discardReconciliation());
    dispatch(
      addToast({
        type: 'info',
        message: 'Đã hoàn tác thay đổi danh sách email đối soát.'
      })
    );
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
            <FontAwesomeIcon icon={faScaleBalanced} className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-800">
                5. Cấu hình email nhận đối soát học phí
              </h2>
              {isDirty && (
                <span className="px-2 py-0.5 text-[11px] font-semibold bg-amber-100 text-amber-800 rounded-full border border-amber-200">
                  Chưa lưu
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Thiết lập danh sách địa chỉ email nhận báo cáo và biên bản đối soát học phí tự động hàng kỳ.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {isDirty && (
            <button
              type="button"
              onClick={handleDiscard}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
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
            <span>Lưu email</span>
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 space-y-6">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Thêm địa chỉ email nhận đối soát học phí ({draftEmails.length}/3)
          </label>
          <form onSubmit={handleAddEmail} className="flex gap-2 max-w-xl">
            <div className="relative flex-1">
              <input
                type="email"
                disabled={isMaxReached}
                value={inputEmail}
                onChange={(e) => {
                  setInputEmail(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder={
                  isMaxReached
                    ? 'Đã đạt số lượng tối đa 3 email đối soát'
                    : 'Nhập email (VD: ketoan@school.edu.vn)...'
                }
                className={`w-full px-3.5 py-2 text-xs text-slate-800 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0070CE] disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed ${
                  errorMessage ? 'border-red-400 bg-red-50/20' : 'border-slate-300'
                }`}
              />
              {isMaxReached && (
                <FontAwesomeIcon
                  icon={faLock}
                  className="w-3 h-3 text-slate-400 absolute right-3 top-2.5"
                />
              )}
            </div>

            <button
              type="submit"
              disabled={isMaxReached || !inputEmail.trim()}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#0070CE] hover:bg-[#005bb5] disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <FontAwesomeIcon icon={faPlus} className="w-3 h-3" />
              <span>Thêm email</span>
            </button>
          </form>

          {/* Validation Error Message */}
          {errorMessage && (
            <p className="text-xs text-red-600 mt-2 flex items-center gap-1.5">
              <FontAwesomeIcon icon={faExclamationCircle} className="w-3 h-3" />
              {errorMessage}
            </p>
          )}

          {/* Existing Email Tags */}
          <div className="pt-3">
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Danh sách email nhận thông báo:
            </label>
            {draftEmails.length === 0 ? (
              <p className="text-xs text-slate-400 italic">
                Chưa có email nào trong danh sách nhận đối soát.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2.5">
                {draftEmails.map((email, index) => (
                  <div
                    key={email}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 text-xs font-medium shadow-2xs"
                  >
                    <FontAwesomeIcon icon={faEnvelope} className="w-3 h-3 text-teal-600" />
                    <span>{email}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveEmail(index)}
                      className="w-4 h-4 rounded-full hover:bg-teal-200 text-teal-600 hover:text-teal-900 flex items-center justify-center transition-colors ml-1 cursor-pointer"
                      title="Xóa email này"
                    >
                      <FontAwesomeIcon icon={faTimes} className="w-2.5 h-2.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
