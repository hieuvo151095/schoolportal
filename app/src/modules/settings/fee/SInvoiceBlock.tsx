import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileInvoice,
  faSave,
  faUndo,
  faLock,
  faCheckCircle,
  faExclamationCircle,
  faChevronDown,
  faChevronUp
} from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  updateDraftSInvoice,
  saveSInvoice,
  discardSInvoice
} from '@/store/slices/settingFeeSlice';
import { validateSInvoiceConfig } from '@/utils/settingFeeValidation';
import { addToast } from '@/store/slices/toastSlice';

export const SInvoiceBlock: React.FC = () => {
  const dispatch = useAppDispatch();
  const sinvoice = useAppSelector((state) => state.settingFee.sinvoice);
  const draftSInvoice = useAppSelector((state) => state.settingFee.draft.sinvoice);
  const isDirty = useAppSelector((state) => state.settingFee.dirtyFlags.sinvoice);

  const [isExpanded, setIsExpanded] = useState(true);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleToggleEnable = (checked: boolean) => {
    dispatch(updateDraftSInvoice({ isEnabled: checked }));
    if (checked) {
      setIsExpanded(true);
    }
  };

  const handleFieldChange = (field: string, value: any) => {
    dispatch(updateDraftSInvoice({ [field]: value }));
    if (formErrors[field]) {
      const updatedErrors = { ...formErrors };
      delete updatedErrors[field];
      setFormErrors(updatedErrors);
    }
  };

  const handleSave = () => {
    const { isValid, errors } = validateSInvoiceConfig(draftSInvoice);
    if (!isValid) {
      setFormErrors(errors);
      dispatch(
        addToast({
          type: 'error',
          message: 'Vui lòng kiểm tra lại các trường thông tin bắt buộc của SInvoice!'
        })
      );
      return;
    }

    setFormErrors({});
    dispatch(saveSInvoice());
    dispatch(
      addToast({
        type: 'success',
        message: 'Lưu cấu hình hóa đơn điện tử SInvoice thành công!'
      })
    );
  };

  const handleDiscard = () => {
    setFormErrors({});
    dispatch(discardSInvoice());
    dispatch(
      addToast({
        type: 'info',
        message: 'Đã hoàn tác thay đổi cấu hình SInvoice.'
      })
    );
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <FontAwesomeIcon icon={faFileInvoice} className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-800">
                Hóa đơn điện tử SInvoice
              </h2>
              {isDirty && (
                <span className="px-2 py-0.5 text-[11px] font-semibold bg-amber-100 text-amber-800 rounded-full border border-amber-200">
                  Chưa lưu
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Cấu hình tài khoản phát hành hóa đơn điện tử Viettel SInvoice tự động.
            </p>
          </div>
        </div>

        {/* Master Toggle & Actions */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
            <span className="text-xs font-semibold text-slate-700">
              {draftSInvoice.isEnabled ? 'Đang bật' : 'Đang tắt'}
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={draftSInvoice.isEnabled}
                onChange={(e) => handleToggleEnable(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0070CE]"></div>
            </label>
          </div>

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
            <span>Lưu cấu hình</span>
          </button>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            title={isExpanded ? 'Thu gọn' : 'Mở rộng'}
          >
            <FontAwesomeIcon
              icon={isExpanded ? faChevronUp : faChevronDown}
              className="w-3.5 h-3.5"
            />
          </button>
        </div>
      </div>

      {/* Body */}
      {isExpanded && (
        <div className="p-6 space-y-6">
          {!draftSInvoice.isEnabled ? (
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
              Tính năng hóa đơn điện tử SInvoice hiện đang tắt. Bật công tắc phía trên để kích hoạt cấu hình kết nối.
            </div>
          ) : (
            <>
              {/* Form Inputs (6 Mandatory Fields - BR05) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* 1. Tax Code (MST) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Mã số thuế trường (MST) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={draftSInvoice.taxCode}
                    onChange={(e) => handleFieldChange('taxCode', e.target.value)}
                    placeholder="VD: 0108998877"
                    className={`w-full px-3.5 py-2 text-xs text-slate-800 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0070CE] focus:border-transparent transition-all ${
                      formErrors.taxCode ? 'border-red-400 bg-red-50/20' : 'border-slate-300'
                    }`}
                  />
                  {formErrors.taxCode && (
                    <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                      <FontAwesomeIcon icon={faExclamationCircle} className="w-2.5 h-2.5" />
                      {formErrors.taxCode}
                    </p>
                  )}
                </div>

                {/* 2. Account Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Tên tài khoản SInvoice <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={draftSInvoice.accountName}
                    onChange={(e) => handleFieldChange('accountName', e.target.value)}
                    placeholder="VD: ECO_SCHOOL_HN"
                    className={`w-full px-3.5 py-2 text-xs text-slate-800 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0070CE] focus:border-transparent transition-all ${
                      formErrors.accountName ? 'border-red-400 bg-red-50/20' : 'border-slate-300'
                    }`}
                  />
                  {formErrors.accountName && (
                    <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                      <FontAwesomeIcon icon={faExclamationCircle} className="w-2.5 h-2.5" />
                      {formErrors.accountName}
                    </p>
                  )}
                </div>

                {/* 3. Password (Strictly Masked - BR06, K019) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Mật khẩu kết nối <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={draftSInvoice.password}
                      onChange={(e) => handleFieldChange('password', e.target.value)}
                      placeholder="••••••••••••"
                      className={`w-full pl-3.5 pr-8 py-2 text-xs text-slate-800 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0070CE] focus:border-transparent transition-all ${
                        formErrors.password ? 'border-red-400 bg-red-50/20' : 'border-slate-300'
                      }`}
                    />
                    <FontAwesomeIcon
                      icon={faLock}
                      className="w-3 h-3 text-slate-400 absolute right-3 top-2.5"
                    />
                  </div>
                  {formErrors.password ? (
                    <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                      <FontAwesomeIcon icon={faExclamationCircle} className="w-2.5 h-2.5" />
                      {formErrors.password}
                    </p>
                  ) : (
                    <p className="text-[11px] text-slate-400 mt-1">
                      Mật khẩu được mã hóa an toàn và không hiển thị công khai.
                    </p>
                  )}
                </div>

                {/* 4. Invoice Template */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Mẫu số hóa đơn <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={draftSInvoice.invoiceTemplate}
                    onChange={(e) => handleFieldChange('invoiceTemplate', e.target.value)}
                    placeholder="VD: 1/001"
                    className={`w-full px-3.5 py-2 text-xs text-slate-800 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0070CE] focus:border-transparent transition-all ${
                      formErrors.invoiceTemplate ? 'border-red-400 bg-red-50/20' : 'border-slate-300'
                    }`}
                  />
                  {formErrors.invoiceTemplate && (
                    <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                      <FontAwesomeIcon icon={faExclamationCircle} className="w-2.5 h-2.5" />
                      {formErrors.invoiceTemplate}
                    </p>
                  )}
                </div>

                {/* 5. Invoice Type */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Loại hóa đơn <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={draftSInvoice.invoiceType}
                    onChange={(e) => handleFieldChange('invoiceType', e.target.value)}
                    placeholder="VD: C26TAA"
                    className={`w-full px-3.5 py-2 text-xs text-slate-800 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0070CE] focus:border-transparent transition-all ${
                      formErrors.invoiceType ? 'border-red-400 bg-red-50/20' : 'border-slate-300'
                    }`}
                  />
                  {formErrors.invoiceType && (
                    <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                      <FontAwesomeIcon icon={faExclamationCircle} className="w-2.5 h-2.5" />
                      {formErrors.invoiceType}
                    </p>
                  )}
                </div>

                {/* 6. Invoice Serial */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Ký hiệu hóa đơn <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={draftSInvoice.invoiceSerial}
                    onChange={(e) => handleFieldChange('invoiceSerial', e.target.value)}
                    placeholder="VD: AA/26E"
                    className={`w-full px-3.5 py-2 text-xs text-slate-800 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0070CE] focus:border-transparent transition-all ${
                      formErrors.invoiceSerial ? 'border-red-400 bg-red-50/20' : 'border-slate-300'
                    }`}
                  />
                  {formErrors.invoiceSerial && (
                    <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                      <FontAwesomeIcon icon={faExclamationCircle} className="w-2.5 h-2.5" />
                      {formErrors.invoiceSerial}
                    </p>
                  )}
                </div>
              </div>

              {/* Checkbox Options */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={draftSInvoice.autoCreateInvoice}
                    onChange={(e) => handleFieldChange('autoCreateInvoice', e.target.checked)}
                    className="w-4 h-4 text-[#0070CE] rounded border-slate-300 focus:ring-[#0070CE]"
                  />
                  <span className="text-xs text-slate-700 font-medium select-none">
                    Tự động tạo và phát hành hóa đơn điện tử ngay khi hóa đơn học phí được thanh toán đủ
                  </span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={draftSInvoice.splitInvoice}
                    onChange={(e) => handleFieldChange('splitInvoice', e.target.checked)}
                    className="w-4 h-4 text-[#0070CE] rounded border-slate-300 focus:ring-[#0070CE]"
                  />
                  <span className="text-xs text-slate-700 font-medium select-none">
                    Tách hóa đơn theo từng nhóm khoản phí riêng biệt (Học phí chính khóa và Dịch vụ ngoại khóa)
                  </span>
                </label>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
