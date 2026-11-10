/**
 * Cancel Invoice Modal Component (BR03)
 * Collects cancellation reason and transitions invoice to da_huy.
 * Governance: Marcus Fleet V34 / Constitution V1.0.0
 * Design System: [DS] ECO ME DASHBOARD v1.1.0 (PopupModal)
 * Reference: docs_legacy/operating-portal/tai-chinh/hoc-phi.md (BR03)
 */

import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import { setCancelModalOpen, cancelInvoice } from '../../../store/slices/invoiceSlice';
import { addToast } from '../../../store/slices/toastSlice';
import { PopupModal, Icon } from '@/components/ds';
import { formatVND } from '../../../utils/invoiceValidation';

export const CancelInvoiceModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isCancelModalOpen, targetCancelInvoice } = useAppSelector(
    (state) => state.invoice
  );

  const [reason, setReason] = useState<string>('');

  if (!isCancelModalOpen || !targetCancelInvoice) {
    return null;
  }

  const handleSubmit = () => {
    if (!reason.trim()) {
      return;
    }

    dispatch(
      cancelInvoice({
        id: targetCancelInvoice.id,
        reason: reason.trim(),
        cancelledBy: 'Nguyễn Thị Kế Toán',
      })
    );
    dispatch(
      addToast({
        type: 'success',
        title: 'Hủy hóa đơn',
        message: `Đã hủy thành công hóa đơn ${targetCancelInvoice.invoiceNo}!`,
      })
    );
    setReason('');
    dispatch(setCancelModalOpen({ isOpen: false }));
  };

  return (
    <PopupModal
      open={isCancelModalOpen}
      onClose={() => dispatch(setCancelModalOpen({ isOpen: false }))}
      title="Hủy bỏ hóa đơn"
      description={`Hóa đơn: ${targetCancelInvoice.invoiceNo} • ${targetCancelInvoice.studentName}`}
      icon="ban"
      width={480}
      primaryAction={{
        label: 'Xác nhận hủy',
        icon: 'trash',
        tone: 'danger',
        disabled: !reason.trim(),
        onClick: handleSubmit,
      }}
      secondaryAction={{
        label: 'Quay lại',
        onClick: () => dispatch(setCancelModalOpen({ isOpen: false })),
      }}
    >
      <div className="space-y-4 text-xs">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 flex items-start gap-2">
          <Icon name="triangle-exclamation" size={14} className="text-amber-600 mt-0.5 shrink-0" />
          <div>
            Hóa đơn sau khi hủy sẽ <span className="font-bold">vô hiệu hóa mã QR</span> và không thể tiếp tục ghi nhận thanh toán. Thao tác này sẽ được lưu vào nhật ký kiểm toán.
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1 text-slate-600">
          <div className="flex justify-between">
            <span>Học sinh:</span>
            <span className="font-bold text-slate-800">{targetCancelInvoice.studentName} ({targetCancelInvoice.studentCode})</span>
          </div>
          <div className="flex justify-between">
            <span>Lớp:</span>
            <span className="font-medium text-slate-700">{targetCancelInvoice.className}</span>
          </div>
          <div className="flex justify-between border-t border-slate-200 pt-1 mt-1 font-semibold">
            <span>Tổng tiền:</span>
            <span className="font-bold text-rose-600">{formatVND(targetCancelInvoice.totalAmount)}</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Lý do hủy hóa đơn <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="VD: Lập sai thông tin phụ huynh / Học sinh chuyển trường / Thay thế bằng hóa đơn khác..."
            required
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>
      </div>
    </PopupModal>
  );
};
