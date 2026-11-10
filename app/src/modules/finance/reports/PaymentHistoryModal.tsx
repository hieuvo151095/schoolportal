import React from 'react';
import type { InvoiceRecord } from '../../../types/invoice';
import { formatFeeReportCurrency } from '../../../utils/feeReportValidation';
import { PopupModal, Icon } from '@/components/ds';

interface PaymentHistoryModalProps {
  isOpen: boolean;
  invoice: InvoiceRecord | null;
  onClose: () => void;
}

export const PaymentHistoryModal: React.FC<PaymentHistoryModalProps> = ({
  isOpen,
  invoice,
  onClose,
}) => {
  if (!isOpen || !invoice) return null;

  const getMethodName = (method: string) => {
    switch (method) {
      case 'cong_sepay':
        return 'Ví FinViet / QR Ecopay';
      case 'chuyen_khoan':
        return 'Chuyển khoản VietQR';
      case 'tien_mat':
        return 'Tiền mặt tại trường';
      case 'the_pos':
        return 'Thẻ POS';
      default:
        return 'Điện tử';
    }
  };

  return (
    <PopupModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Lịch Sử Thanh Toán — ${invoice.invoiceNo}`}
      subtitle={`Học sinh: ${invoice.studentName} (Lớp ${invoice.className})`}
      icon="clock"
      width={640}
      secondaryAction={{
        label: 'Đóng',
        onClick: onClose,
      }}
    >
      <div className="space-y-4 text-left">
        {/* Summary Metric Strip */}
        <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-center text-xs">
          <div>
            <span className="text-slate-500 block mb-0.5">Tổng hóa đơn</span>
            <span className="font-mono font-bold text-slate-900 text-sm">
              {formatFeeReportCurrency(invoice.totalAmount)}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block mb-0.5">Đã thu</span>
            <span className="font-mono font-bold text-emerald-600 text-sm">
              {formatFeeReportCurrency(invoice.paidAmount)}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block mb-0.5">Còn thiếu</span>
            <span className="font-mono font-bold text-rose-600 text-sm">
              {formatFeeReportCurrency(invoice.remainingAmount)}
            </span>
          </div>
        </div>

        {/* 5-Column Payment History Table (BR06) */}
        <div className="border border-slate-200 rounded-xl overflow-hidden overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <th className="py-2.5 px-3">Ngày thanh toán</th>
                <th className="py-2.5 px-3 text-right">Số tiền</th>
                <th className="py-2.5 px-3">Xác nhận bởi</th>
                <th className="py-2.5 px-3">Phương thức</th>
                <th className="py-2.5 px-3">Ghi chú</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {invoice.paymentHistory.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    Chưa có giao dịch thanh toán nào được ghi nhận
                  </td>
                </tr>
              ) : (
                invoice.paymentHistory.map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-50/60">
                    <td className="py-2.5 px-3 font-mono font-medium text-slate-800">
                      {entry.paidAt}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-600">
                      {formatFeeReportCurrency(entry.amount)}
                    </td>
                    <td className="py-2.5 px-3 text-slate-700">{entry.confirmedBy}</td>
                    <td className="py-2.5 px-3">
                      <span className="inline-flex px-2 py-0.5 rounded-sm bg-slate-100 text-slate-700 font-medium text-[11px] border border-slate-200">
                        {getMethodName(entry.paymentMethod)}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 max-w-[180px] truncate" title={entry.note}>
                      {entry.note || '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </PopupModal>
  );
};
