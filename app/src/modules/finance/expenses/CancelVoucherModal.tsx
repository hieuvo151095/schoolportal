import React, { useState } from 'react';
import { validateCancelVoucher } from '../../../utils/expenseValidation';
import { PopupModal, Icon } from '@/components/ds';

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

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
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

  const isSubmitDisabled = !reason.trim();

  return (
    <PopupModal
      isOpen={isOpen}
      onClose={onClose}
      title="Hủy phiếu chi"
      subtitle={`Mã phiếu: ${voucherId}`}
      icon="ban"
      width={480}
      primaryAction={{
        label: 'Xác nhận hủy',
        onClick: () => handleSubmit(),
        disabled: isSubmitDisabled,
        tone: 'danger',
        icon: 'ban',
      }}
      secondaryAction={{
        label: 'Đóng',
        onClick: onClose,
      }}
    >
      <div className="space-y-4 text-left">
        {/* Warning Alert */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-800 flex items-start gap-2.5">
          <Icon name="alert-triangle" size={14} className="text-amber-500 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold text-amber-900 m-0">Lưu ý trước khi hủy:</p>
            <p className="mt-0.5 mb-0 text-amber-700">
              Hành động này sẽ chuyển trạng thái phiếu chi thành <strong>&quot;Đã hủy&quot;</strong>. Sau khi hủy, phiếu không thể tiếp tục phê duyệt hay giải ngân chi tiền.
            </p>
          </div>
        </div>

        {voucherTitle && (
          <div className="text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-slate-700">
            <span className="font-semibold text-slate-500">Tiêu đề phiếu:</span> {voucherTitle}
          </div>
        )}

        {/* Reason Input */}
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
          {error && <p className="text-xs text-rose-500 mt-1 mb-0">{error}</p>}
        </div>
      </div>
    </PopupModal>
  );
};
