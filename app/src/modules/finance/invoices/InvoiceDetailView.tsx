/**
 * Invoice Detail View Component
 * Detailed invoice bill showing itemized fee lines, attendance-linked meal deduction,
 * dynamic VietQR payment card, and append-only cumulative payment history.
 * Governance: Marcus Fleet V34 / Constitution V1.0.0
 * References:
 * - docs_legacy/operating-portal/tai-chinh/hoc-phi.md (BR02, BR03, BR08, BR09)
 * - TASK-FIN-001 & TASK-FIN-002
 * - ISSUE-INV-002: Dynamic status banner on settled invoices
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Icon } from '@/components/ds';
import { useAppDispatch } from '../../../store';
import {
  setPaymentModalOpen,
  setCancelModalOpen,
  sendInvoices,
} from '../../../store/slices/invoiceSlice';
import { InvoiceRecord } from '../../../types/invoice';
import { formatVND, getPermittedActions, generateVietQRPayload } from '../../../utils/invoiceValidation';

interface InvoiceDetailViewProps {
  invoice: InvoiceRecord;
}

export const InvoiceDetailView: React.FC<InvoiceDetailViewProps> = ({ invoice }) => {
  const router = useRouter();
  const schoolCode = (router.query.schoolCode as string) || 'demo';
  const dispatch = useAppDispatch();

  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const permittedActions = getPermittedActions(invoice?.status || 'da_tao');
  const vietQRData =
    invoice?.vietQRData ||
    generateVietQRPayload(
      invoice?.invoiceNo || 'HD-2026',
      invoice?.totalAmount || 0
    );
  const items = invoice?.items || [];
  const paymentHistory = invoice?.paymentHistory || [];

  // Status badge styling
  const renderStatusBadge = () => {
    switch (invoice.status) {
      case 'da_thanh_toan':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-300">
            <Icon name="circle-check" size={13} className="mr-1.5 text-emerald-600" />
            Đã thanh toán đủ
          </span>
        );
      case 'thanh_toan_mot_phan':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-300">
            <Icon name="clock" size={13} className="mr-1.5 text-amber-600" />
            Thanh toán một phần ({formatVND(invoice.paidAmount)} / {formatVND(invoice.totalAmount)})
          </span>
        );
      case 'da_gui':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-300">
            <span className="w-2 h-2 mr-2 rounded-full bg-blue-500"></span>
            Đã gửi phụ huynh
          </span>
        );
      case 'da_tao':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-300">
            <span className="w-2 h-2 mr-2 rounded-full bg-slate-500"></span>
            Bản nháp (Đã tạo)
          </span>
        );
      case 'qua_han':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-300">
            <Icon name="triangle-exclamation" size={13} className="mr-1.5 text-rose-600" />
            Quá hạn thanh toán
          </span>
        );
      case 'da_huy':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-500 border border-gray-300 line-through">
            Đã hủy hóa đơn
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Navigation & Action Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href={`/${schoolCode}/school/fee`}
              className="h-10 px-3.5 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 flex items-center gap-2"
            >
              <Icon name="arrow-left" size={13} className="text-slate-500" />
              <span>Trở về</span>
            </Link>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">{invoice.title}</h1>
                <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-blue-50 text-[#0070CE] border border-blue-200">
                  {invoice.invoiceNo}
                </span>
                {renderStatusBadge()}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Mã học sinh: <span className="font-semibold text-slate-700">{invoice.studentCode}</span> • Lớp: <span className="font-semibold text-slate-700">{invoice.className}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons (BR03) */}
          <div className="flex items-center gap-2">
            {/* Edit Button (Draft only) */}
            {permittedActions.includes('edit') && (
              <Link
                href={`/${schoolCode}/school/fee/edit/${invoice.id}`}
                className="h-10 px-3.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-300 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors"
              >
                <Icon name="pen" size={13} />
                <span>Chỉnh sửa</span>
              </Link>
            )}

            {/* Send Button (Draft only) */}
            {permittedActions.includes('send') && (
              <button
                onClick={() => dispatch(sendInvoices([invoice.id]))}
                className="h-10 px-4 bg-[#0070CE] hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-sm flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Icon name="paper-plane" size={13} />
                <span>Gửi hóa đơn</span>
              </button>
            )}

            {/* Manual Payment Button */}
            {permittedActions.includes('pay') && (
              <button
                onClick={() =>
                  dispatch(setPaymentModalOpen({ isOpen: true, invoice }))
                }
                className="h-10 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold shadow-sm flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Icon name="coins" size={13} />
                <span>Xác nhận thanh toán</span>
              </button>
            )}

            {/* Print Button */}
            <button
              onClick={() => window.print()}
              className="h-10 px-3.5 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
            >
              <Icon name="print" size={13} className="text-slate-500" />
              <span>In phiếu</span>
            </button>

            {/* Cancel Button */}
            {permittedActions.includes('cancel') && (
              <button
                onClick={() =>
                  dispatch(setCancelModalOpen({ isOpen: true, invoice }))
                }
                className="h-10 px-3.5 border border-slate-300 rounded-lg text-sm font-semibold text-rose-600 bg-white hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
              >
                <Icon name="ban" size={13} />
                <span>Hủy HĐ</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Cancellation Notice Banner (if cancelled) */}
      {invoice.status === 'da_huy' && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3">
          <Icon name="ban" size={18} className="text-rose-500 mt-0.5" />
          <div>
            <div className="font-bold text-rose-900 text-sm">
              Hóa đơn này đã bị hủy bỏ
            </div>
            <div className="text-xs text-rose-700 mt-1">
              Lý do: <span className="font-medium">{invoice.cancellationReason || 'Không có ghi chú'}</span>
            </div>
            <div className="text-[11px] text-rose-600 mt-0.5">
              Người hủy: {invoice.cancelledBy} • Thời gian: {invoice.cancelledAt ? new Date(invoice.cancelledAt).toLocaleString('vi-VN') : ''}
            </div>
          </div>
        </div>
      )}

      {/* Main Content Grid: Left Bill & Items, Right VietQR & History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Bill & Line Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            {/* Bill Letterhead Header */}
            <div className="border-b border-slate-200 pb-5 mb-5 flex items-start justify-between">
              <div>
                <div className="text-xs font-bold text-[#0070CE] uppercase tracking-wider">
                  Trường Liên cấp Finviet
                </div>
                <h2 className="text-lg font-bold text-slate-900 mt-1">
                  PHIẾU BÁO HỌC PHÍ VÀ DỊCH VỤ
                </h2>
                <div className="text-xs text-slate-500 font-mono mt-0.5">
                  Số: {invoice.invoiceNo} • Kỳ thu: {invoice.billingMonth}
                </div>
              </div>
              <div className="text-right text-xs text-slate-500">
                <div>Ngày lập: <span className="font-semibold text-slate-700">{invoice.issueDate}</span></div>
                {invoice.sendDate && <div>Ngày gửi: <span className="font-semibold text-slate-700">{invoice.sendDate}</span></div>}
                <div>Hạn thanh toán: <span className="font-bold text-rose-600">{invoice.dueDate}</span></div>
                {invoice.exportElectronicInvoice && (
                  <div className="mt-1 inline-block px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[11px] font-bold rounded border border-emerald-200">
                    Xuất hóa đơn điện tử (HĐĐT)
                  </div>
                )}
              </div>
            </div>

            {/* Recipient Profile Card */}
            <div className="bg-slate-50 rounded-lg p-4 mb-6 border border-slate-200">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 block">Học sinh:</span>
                  <span className="font-bold text-slate-800 text-sm">{invoice.studentName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Mã học sinh:</span>
                  <span className="font-semibold text-slate-800">{invoice.studentCode}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Lớp học:</span>
                  <span className="font-semibold text-slate-800">{invoice.className} ({invoice.gradeLevel})</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Người nhận thông báo:</span>
                  <span className="font-semibold text-slate-800">{invoice.parentName}</span>
                  <span className="text-slate-500 block text-[11px]">{invoice.parentPhone}</span>
                </div>
              </div>
            </div>

            {/* Itemized Table */}
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-xs font-bold text-slate-700">
                    <th className="py-2.5 px-3 w-10 text-center">#</th>
                    <th className="py-2.5 px-3">Khoản thu</th>
                    <th className="py-2.5 px-3 text-right">Đơn giá</th>
                    <th className="py-2.5 px-3 text-center w-20">Số lượng</th>
                    <th className="py-2.5 px-3 text-right">Giảm trừ</th>
                    <th className="py-2.5 px-3 text-right">Thành tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {items.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-slate-50/60">
                      <td className="py-3 px-3 text-center text-xs text-slate-400 font-mono">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-800">{item.name}</div>
                        {item.description && (
                          <div className="text-xs text-slate-500 mt-0.5">{item.description}</div>
                        )}
                        {/* Attendance-linked meal deduction indicator (TASK-FIN-002) */}
                        {item.isMealFee && item.excusedAbsenceDays !== undefined && item.excusedAbsenceDays > 0 && (
                          <span className="inline-flex items-center gap-1 mt-1 text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                            <Icon name="utensils" size={11} />
                            Đã trừ {item.excusedAbsenceDays} ngày nghỉ phép có phép từ Báo cáo điểm danh
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right text-xs font-medium text-slate-600">
                        {formatVND(item.unitPrice)}
                      </td>
                      <td className="py-3 px-3 text-center text-xs font-bold text-slate-700">
                        {item.quantity}
                      </td>
                      <td className="py-3 px-3 text-right text-xs text-emerald-600">
                        {item.discountAmount > 0 ? `-${formatVND(item.discountAmount)}` : '—'}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="font-bold text-slate-900">{formatVND(item.amount)}</div>
                        {item.description?.includes('Khấu trừ hoàn') && (
                          <div className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 mt-1 inline-flex items-center gap-1 shadow-2xs">
                            <Icon name="utensils" size={10} className="text-emerald-600" />
                            <span>Hoàn tiền: -{formatVND(item.discountAmount)}</span>
                          </div>
                        )}
                        {item.amount > 0 && (
                          (item.isPaid ?? (invoice.status === 'da_thanh_toan' || (invoice.paidAmount > 0 && items.slice(0, idx + 1).filter(i => i.amount > 0).reduce((acc, curr) => acc + curr.amount, 0) <= invoice.paidAmount))) ? (
                            <div className="text-xs text-emerald-600 font-medium mt-0.5">Đã thanh toán</div>
                          ) : (
                            <div className="text-xs text-rose-500 font-medium mt-0.5">Chưa thanh toán</div>
                          )
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals Summary Box */}
            <div className="border-t border-slate-200 pt-4 flex flex-col items-end">
              <div className="w-full sm:w-80 space-y-2 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Tạm tính:</span>
                  <span className="font-semibold">{formatVND(invoice.subtotal)}</span>
                </div>
                {invoice.discountTotal > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Tổng giảm trừ:</span>
                    <span className="font-semibold">-{formatVND(invoice.discountTotal)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold text-slate-900 border-t border-slate-200 pt-2">
                  <span>Tổng tiền thanh toán:</span>
                  <span className="text-[#0070CE]">{formatVND(invoice.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-slate-600 text-xs">
                  <span>Đã thanh toán:</span>
                  <span className="font-bold text-emerald-600">{formatVND(invoice.paidAmount)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-slate-900 bg-blue-50 p-2.5 rounded-lg border border-blue-200">
                  <span>Còn lại phải nộp:</span>
                  <span className={invoice.remainingAmount > 0 ? 'text-rose-600' : 'text-emerald-700'}>
                    {formatVND(invoice.remainingAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): VietQR Card & Payment History */}
        <div className="space-y-6">
          {/* VietQR Payment Card (BR08, BR09 / ISSUE-INV-002) */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Icon name="qrcode" size={16} className="text-[#0070CE]" />
                <h3 className="font-bold text-slate-900 text-sm">Thanh toán VietQR</h3>
              </div>
              <span className="text-xs font-bold text-[#0070CE]">MB Bank</span>
            </div>

            {/* Dynamic Status Banner (Resolves BR09 / ISSUE-INV-002) */}
            {invoice.status === 'da_thanh_toan' ? (
              <div className="mt-4 bg-emerald-50 border border-emerald-300 rounded-xl p-5 text-center">
                <Icon name="circle-check" size={36} className="text-emerald-600 mx-auto mb-2" />
                <h4 className="font-bold text-emerald-900 text-base">ĐÃ THANH TOÁN ĐỦ</h4>
                <p className="text-xs text-emerald-700 mt-1">
                  Hóa đơn đã được quyết toán hoàn toàn. Cảm ơn Quý phụ huynh!
                </p>
                <div className="text-[11px] text-emerald-600 mt-2 font-mono">
                  Tổng tiền đã thu: {formatVND(invoice.paidAmount)}
                </div>
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                {/* QR Image */}
                <div className="flex justify-center p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <img
                    src={vietQRData.qrImageUrl}
                    alt="VietQR Payment Code"
                    className="w-48 h-48 rounded"
                  />
                </div>

                {/* Transfer Coordinates */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center p-2 bg-slate-50 rounded border border-slate-200">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Tài khoản nhận:</span>
                      <span className="font-mono font-bold text-slate-900">{vietQRData.accountNo}</span>
                    </div>
                    <button
                      onClick={() => handleCopy(vietQRData.accountNo, 'stk')}
                      className="text-xs text-[#0070CE] hover:underline"
                    >
                      {copiedField === 'stk' ? 'Đã chép!' : 'Sao chép'}
                    </button>
                  </div>

                  <div className="flex justify-between items-center p-2 bg-slate-50 rounded border border-slate-200">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Cú pháp chuyển khoản:</span>
                      <span className="font-mono font-bold text-[#0070CE]">{vietQRData.transferContent}</span>
                    </div>
                    <button
                      onClick={() => handleCopy(vietQRData.transferContent, 'syntax')}
                      className="text-xs text-[#0070CE] hover:underline"
                    >
                      {copiedField === 'syntax' ? 'Đã chép!' : 'Sao chép'}
                    </button>
                  </div>

                  <div className="p-2 bg-slate-50 rounded border border-slate-200 flex justify-between items-center">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Số tiền còn nộp:</span>
                      <span className="font-bold text-rose-600 text-sm">{formatVND(invoice.remainingAmount)}</span>
                    </div>
                    <button
                      onClick={() =>
                        dispatch(setPaymentModalOpen({ isOpen: true, invoice }))
                      }
                      className="text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200"
                    >
                      Ghi nhận thủ công
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Cumulative Payment History (BR08 & TASK-FIN-001) */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Icon name="clock-rotate-left" size={16} className="text-[#0070CE]" />
                <h3 className="font-bold text-slate-900 text-sm">Lịch sử thanh toán</h3>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                {paymentHistory.length} giao dịch
              </span>
            </div>

            <div className="mt-4">
              {paymentHistory.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs">
                  Chưa có giao dịch thanh toán nào được ghi nhận.
                </div>
              ) : (
                <div className="space-y-3">
                  {paymentHistory.map((pay, idx) => (
                    <div
                      key={pay.id}
                      className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-700 text-sm">
                          +{formatVND(pay.amount)}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-slate-700 border border-slate-200">
                          {pay.paymentMethod === 'cong_sepay'
                            ? 'Sepay Online'
                            : pay.paymentMethod === 'chuyen_khoan'
                            ? 'VietQR MB Bank'
                            : pay.paymentMethod === 'tien_mat'
                            ? 'Tiền mặt'
                            : 'Thẻ POS'}
                        </span>
                      </div>
                      <div className="text-slate-500 text-[11px]">
                        Thời gian: <span className="font-medium text-slate-700">{new Date(pay.paidAt).toLocaleString('vi-VN')}</span>
                      </div>
                      <div className="text-slate-500 text-[11px]">
                        Xác nhận bởi: <span className="font-semibold text-slate-800">{pay.confirmedBy}</span>
                      </div>
                      {pay.note && (
                        <div className="text-slate-600 bg-white p-1.5 rounded border border-slate-100 text-[11px] italic">
                          {pay.note}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
