/**
 * Manual Payment Confirmation Modal (BR08 & TASK-FIN-001)
 * Records manual settlement, appends to payment history, and transitions invoice status.
 * Governance: Marcus Fleet V34 / Constitution V1.0.0
 * Design System: [DS] ECO ME DASHBOARD v1.1.0 (SlideOver + Dropdown)
 * Reference: docs_legacy/operating-portal/tai-chinh/hoc-phi.md (BR08)
 */

import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  setPaymentModalOpen,
  addPaymentEntry,
} from '../../../store/slices/invoiceSlice';
import { addToast } from '../../../store/slices/toastSlice';
import { PaymentMethod } from '../../../types/invoice';
import { formatVND } from '../../../utils/invoiceValidation';
import { SlideOver, Dropdown, DropdownOption, Icon } from '@/components/ds';

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

  const handleSubmit = () => {
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

  // ADR-036: Manual payment confirmation strictly offers only 1 option: Cash (Tiền mặt).
  // Electronic payment methods (QR ECOPay, Ví Finviet) are handled via automated gateway reconciliation.
  const paymentOptions: DropdownOption<PaymentMethod>[] = [
    { value: 'tien_mat', label: 'Tiền mặt' },
  ];

  return (
    <SlideOver
      open={isPaymentModalOpen}
      onClose={() => dispatch(setPaymentModalOpen({ isOpen: false }))}
      title="Xác nhận thanh toán học phí"
      description={`Hóa đơn: ${targetPaymentInvoice.invoiceNo} • ${targetPaymentInvoice.studentName}`}
      icon="coins"
      width={480}
      primaryAction={{
        label: 'Lưu xác nhận',
        icon: 'check',
        onClick: handleSubmit,
      }}
      secondaryAction={{
        label: 'Hủy bỏ',
        onClick: () => dispatch(setPaymentModalOpen({ isOpen: false })),
      }}
    >
      <div className="space-y-4 text-xs">
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
              className="w-full h-11 px-3 text-base font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0070CE]"
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
              className="text-[11px] font-bold text-[#0070CE] hover:underline cursor-pointer"
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
          <Dropdown
            value={paymentMethod}
            onChange={(val) => setPaymentMethod(val)}
            options={paymentOptions}
            fullWidth
          />
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
      </div>
    </SlideOver>
  );
};
