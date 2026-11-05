/**
 * Cancel Invoice Modal Component (BR03)
 * Collects cancellation reason and transitions invoice to da_huy.
 * Governance: Marcus Fleet V34 / Constitution V1.0.0
 * Reference: docs_legacy/operating-portal/tai-chinh/hoc-phi.md (BR03)
 */

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faBan, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch, useAppSelector } from '../../../store';
import { setCancelModalOpen, cancelInvoice } from '../../../store/slices/invoiceSlice';

export const CancelInvoiceModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isCancelModalOpen, targetCancelInvoice } = useAppSelector(
    (state) => state.invoice
  );

  const [reason, setReason] = useState<string>('');

  if (!isCancelModalOpen || !targetCancelInvoice) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      alert('Vui lòng cung cấp lý do hủy hóa đơn.');
      return;
    }

    dispatch(
      cancelInvoice({
        id: targetCancelInvoice.id,
        reason: reason.trim(),
        cancelledBy: 'Nguyễn Thị Kế Toán',
      })
    );
    alert(`Đã hủy thành công hóa đơn ${targetCancelInvoice.invoiceNo}!`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-rose-50 border-b border-rose-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
              <FontAwesomeIcon icon={faBan} />
            </div>
            <div>
              <h3 className="font-bold text-rose-950 text-base">Hủy bỏ hóa đơn</h3>
              <div className="text-xs text-rose-700 font-mono">
                {targetCancelInvoice.invoiceNo}
              </div>
            </div>
          </div>
          <button
            onClick={() => dispatch(setCancelModalOpen({ isOpen: false }))}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 flex items-start gap-2">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-amber-600 mt-0.5" />
            <div>
              Hóa đơn sau khi hủy sẽ <span className="font-bold">vô hiệu hóa mã QR</span> và không thể tiếp tục ghi nhận thanh toán. Thao tác này sẽ được lưu vào nhật ký kiểm toán.
            </div>
          </div>

          <div className="text-xs text-slate-600 space-y-1">
            <div>
              Học sinh: <span className="font-bold text-slate-800">{targetCancelInvoice.studentName}</span>
            </div>
            <div>
              Tổng tiền: <span className="font-bold text-slate-800">{targetCancelInvoice.totalAmount.toLocaleString('vi-VN')} đ</span>
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

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => dispatch(setCancelModalOpen({ isOpen: false }))}
              className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 bg-white hover:bg-slate-50"
            >
              Quay lại
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors"
            >
              Xác nhận hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
