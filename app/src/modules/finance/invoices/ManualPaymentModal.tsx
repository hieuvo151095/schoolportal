/**
 * Manual Payment Confirmation Modal (BR08 & TASK-FIN-001)
 * Records manual settlement, appends to payment history, and transitions invoice status.
 * Governance: Marcus Fleet V34 / Constitution V1.0.0
 * Reference: docs_legacy/operating-portal/tai-chinh/hoc-phi.md (BR08)
 */

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faMoneyBillWave,
  faCheckCircle,
  faBuildingColumns,
} from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  setPaymentModalOpen,
  addPaymentEntry,
} from '../../../store/slices/invoiceSlice';
import { addToast } from '../../../store/slices/toastSlice';
import { PaymentMethod } from '../../../types/invoice';
import { formatVND } from '../../../utils/invoiceValidation';

export const ManualPaymentModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isPaymentModalOpen, targetPaymentInvoice } = useAppSelector(
    (state) => state.invoice
  );

  const [amount, setAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('tien_mat');
  const [confirmedBy, setConfirmedBy] = useState<string>('Nguyễn Thị Kế Toán');
  const [note, setNote] = useState<string>('');
  const [transactionRef, setTransactionRef] = useState<string>('');

  useEffect(() => {
    if (targetPaymentInvoice) {
      setAmount(targetPaymentInvoice.remainingAmount);
      setNote(`Xác nhận thanh toán học phí hóa đơn ${targetPaymentInvoice.invoiceNo}`);
      setTransactionRef(`TX-${Math.floor(100000 + Math.random() * 900000)}`);
    }
  }, [targetPaymentInvoice]);

  if (!isPaymentModalOpen || !targetPaymentInvoice) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) {
      dispatch(
        addToast({
          type: 'error',
          title: 'Lỗi thanh toán',
          message: 'Vui lòng nhập số tiền thanh toán lớn hơn 0 đ.',
        })
      );
      return;
    }

    dispatch(
      addPaymentEntry({
        invoiceId: targetPaymentInvoice.id,
        amount,
        paymentMethod,
        confirmedBy,
        note,
        transactionRef,
      })
    );

    dispatch(
      addToast({
        type: 'success',
        title: 'Xác nhận thanh toán',
        message: 'Xác nhận thanh toán học phí thành công!',
      })
    );

    dispatch(setPaymentModalOpen({ isOpen: false }));
  };

  const isFullPayment = amount >= targetPaymentInvoice.remainingAmount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <FontAwesomeIcon icon={faMoneyBillWave} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Xác nhận thanh toán học phí
              </h3>
              <div className="text-xs text-slate-500 font-mono">
                {targetPaymentInvoice.invoiceNo}
              </div>
            </div>
          </div>
          <button
            onClick={() => dispatch(setPaymentModalOpen({ isOpen: false }))}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Student Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500">Học sinh:</span>
              <span className="font-bold text-slate-800">
                {targetPaymentInvoice.studentName} ({targetPaymentInvoice.studentCode})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Lớp:</span>
              <span className="font-semibold text-slate-700">
                {targetPaymentInvoice.className}
              </span>
            </div>
            <div className="flex justify-between border-t border-blue-200 pt-1 mt-1 font-semibold">
              <span className="text-slate-600">Số tiền còn phải thu:</span>
              <span className="text-rose-600 font-bold">
                {formatVND(targetPaymentInvoice.remainingAmount)}
              </span>
            </div>
          </div>

          {/* Amount Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Số tiền thu đợt này (VNĐ) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                min={1000}
                max={targetPaymentInvoice.remainingAmount * 2}
                step={1000}
                required
                className="w-full h-11 px-3 text-base font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <span className="absolute right-3 top-3 text-xs font-bold text-slate-500">
                đ
              </span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-[11px] text-slate-500">
                {isFullPayment ? 'Thanh toán đủ 100%' : 'Thanh toán một phần'}
              </span>
              <button
                type="button"
                onClick={() => setAmount(targetPaymentInvoice.remainingAmount)}
                className="text-[11px] font-bold text-[#0070CE] hover:underline"
              >
                Nhập toàn bộ còn lại
              </button>
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Hình thức thanh toán <span className="text-rose-500">*</span>
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
              className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="tien_mat">Tiền mặt</option>
              <option value="qr_ecopay">QR ECOPay</option>
              <option value="vi_finviet">Ví Finviet</option>
            </select>
          </div>

          {/* Transaction Ref */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Mã chuẩn chi / Mã giao dịch ngân hàng
            </label>
            <input
              type="text"
              value={transactionRef}
              onChange={(e) => setTransactionRef(e.target.value)}
              placeholder="VD: MB-982173 hoặc phiếu thu số..."
              className="w-full h-9 px-3 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 font-mono"
            />
          </div>

          {/* Confirmed By */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Người xác nhận thu tiền
            </label>
            <input
              type="text"
              value={confirmedBy}
              onChange={(e) => setConfirmedBy(e.target.value)}
              required
              className="w-full h-9 px-3 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800"
            />
          </div>

          {/* Internal Note */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Ghi chú nội bộ
            </label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => dispatch(setPaymentModalOpen({ isOpen: false }))}
              className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 bg-white hover:bg-slate-50"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <FontAwesomeIcon icon={faCheckCircle} />
              <span>Lưu xác nhận</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
