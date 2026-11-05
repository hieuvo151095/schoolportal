import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faTimes, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { validateCancelVoucher } from '../../../utils/expenseValidation';

interface CancelVoucherModalProps {
  isOpen: boolean;
  voucherId: string | null;
  voucherTitle?: string;
  onClose: () => void;
  onConfirmCancel: (voucherId: string, reason: string) => void;
}

export const CancelVoucherModal: React.FC<CancelVoucherModalProps> = ({
  isOpen,
  voucherId,
  voucherTitle,
  onClose,
  onConfirmCancel,
}) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !voucherId) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateCancelVoucher(reason);
    if (!validation.isValid) {
      setError(validation.error || 'Vui lòng nhập lý do hủy');
      return;
    }

    onConfirmCancel(voucherId, reason.trim());
    setReason('');
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-2.5 text-rose-600">
            <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center">
              <FontAwesomeIcon icon={faBan} className="text-base" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Hủy phiếu chi</h2>
              <p className="text-xs text-slate-500 font-mono">{voucherId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Warning Alert */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 mb-4 text-xs text-amber-800 flex items-start gap-2.5">
          <FontAwesomeIcon icon={faExclamationTriangle} className="text-amber-500 text-sm mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-amber-900">Lưu ý trước khi hủy:</p>
            <p className="mt-0.5 text-amber-700">
              Hành động này sẽ chuyển trạng thái phiếu chi thành <span className="font-bold">&quot;Đã hủy&quot;</span>. Sau khi hủy, phiếu không thể tiếp tục phê duyệt hay giải ngân chi tiền.
            </p>
          </div>
        </div>

        {voucherTitle && (
          <div className="mb-4 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-slate-700">
            <span className="font-semibold text-slate-500">Tiêu đề phiếu:</span> {voucherTitle}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Ghi chú lý do hủy <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (error) setError(null);
              }}
              placeholder="VD: Phụ huynh xin rút yêu cầu hoàn tiền do tiếp tục học / Nhập sai bảng hoạch toán..."
              className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-rose-500 focus:outline-none transition-all ${
                error ? 'border-rose-400 ring-1 ring-rose-300' : 'border-slate-300'
              }`}
              autoFocus
            />
            {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-medium transition-colors"
            >
              Đóng
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium transition-all shadow-sm active:scale-98"
            >
              Xác nhận hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
