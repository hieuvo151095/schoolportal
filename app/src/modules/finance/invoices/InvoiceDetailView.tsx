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

const getLineItemUnit = (item: any): string => {
  if (item.isMealFee || item.name?.toLowerCase().includes('tiền ăn')) return 'Ngày';
  if (item.name?.toLowerCase().includes('học phí')) return 'Tháng';
  if (item.name?.toLowerCase().includes('câu lạc bộ') || item.category === 'ngoai_khoa') return 'Tháng';
  if (item.name?.toLowerCase().includes('bảo hiểm')) return 'Năm';
  if (item.name?.toLowerCase().includes('đồng phục')) return 'Bộ';
  return 'Tháng';
};

const formatNumber = (num?: number): string => {
  if (num === undefined || num === null) return '0';
  return new Intl.NumberFormat('en-US').format(num);
};

const formatBillingMonth = (monthStr?: string): string => {
  if (!monthStr) return '09/2026';
  if (monthStr.includes('-')) {
    const [y, m] = monthStr.split('-');
    return `${m.padStart(2, '0')}/${y}`;
  }
  return monthStr;
};

const getInvoiceDateParts = (dateStr?: string) => {
  if (!dateStr) {
    return { day: '10', month: '11', year: 2026 };
  }
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    return { day: parts[0], month: parts[1], year: parts[2] };
  }
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) {
    return {
      day: String(d.getDate()).padStart(2, '0'),
      month: String(d.getMonth() + 1).padStart(2, '0'),
      year: d.getFullYear(),
    };
  }
  return { day: '10', month: '11', year: 2026 };
};

const EcoBrandLogo: React.FC = () => (
  <div className="flex items-center gap-2">
    <svg width="42" height="42" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <rect width="100" height="100" rx="22" fill="#0070CE" />
      <polygon points="22,22 48,22 22,48" fill="#F59E0B" />
      <path
        d="M68 44C68 33 59 27 48 27C35 27 27 36 27 50C27 64 35 73 49 73C59 73 66 67 68 58H56C54 61 51 63 48 63C41 63 37 57 37 51H68V44ZM37 43C38 37 42 34 48 34C54 34 58 37 58 43H37Z"
        fill="#FFFFFF"
      />
    </svg>
    <span className="text-3xl font-black tracking-tight text-[#0070CE] font-sans">ECO</span>
  </div>
);

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
  const dateParts = getInvoiceDateParts(invoice?.issueDate || invoice?.sendDate);
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
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 no-print screen-only">
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
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3 no-print screen-only">
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:block print:w-full print:p-0 print:m-0">
        {/* Left Column (2 Cols): Bill & Line Items */}
        <div className="lg:col-span-2 space-y-6 print:w-full print:p-0 print:m-0">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8 printable-invoice-container print:p-0 print:border-none print:shadow-none">
            {/* Header: ECO Logo (Left) | PHIẾU BÁO THU TIỀN + Mã hóa đơn (Center) | VietQR (Right) */}
            <div className="flex items-start justify-between gap-4 mb-4 pb-2 border-b border-slate-200 print:border-slate-800">
              <div className="w-1/4">
                <EcoBrandLogo />
              </div>
              <div className="w-2/4 text-center pt-1">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 uppercase">
                  PHIẾU BÁO THU TIỀN
                </h1>
                <p className="text-xs text-slate-700 mt-1 font-medium">
                  Mã hóa đơn: <span className="font-semibold text-slate-900">{invoice.invoiceNo}</span>
                </p>
              </div>
              <div className="w-1/4 flex flex-col items-end">
                <img
                  src={vietQRData.qrImageUrl}
                  alt="VietQR"
                  className="w-20 h-20 sm:w-22 sm:h-22 object-contain border border-slate-200 rounded p-0.5"
                />
                <span className="text-[10px] text-slate-600 mt-1 text-center w-20 sm:w-22 leading-tight">
                  Quét mã QR để thanh toán
                </span>
              </div>
            </div>

            {/* School & Student Metadata block */}
            <div className="text-xs text-slate-800 space-y-1 mb-5">
              <div className="font-bold text-slate-900">Trường FINVIET</div>
              <div>Địa chỉ: 34 Hoàng Việt, Phường Tân Sơn Nhất, TP.HCM</div>
              <div>Tên học sinh: <span className="font-medium">{invoice.studentName}</span></div>
              <div>Mã học sinh: <span className="font-medium">{invoice.studentCode}</span></div>
              <div>Lớp: <span className="font-medium">{invoice.className}</span></div>
              <div>Kỳ phí: <span className="font-medium">{formatBillingMonth(invoice.billingMonth)}</span></div>
            </div>

            {/* 7-Column Official Table */}
            <div className="overflow-x-auto mb-5">
              <table className="w-full text-left border-collapse border border-slate-300 print:border-slate-800 text-xs">
                <thead>
                  <tr className="bg-slate-50 print:bg-transparent text-slate-800 font-bold border-b border-slate-300 print:border-slate-800">
                    <th className="py-2 px-2 text-center border-r border-slate-300 print:border-slate-800 w-10">STT</th>
                    <th className="py-2 px-3 text-left border-r border-slate-300 print:border-slate-800">Nội dung</th>
                    <th className="py-2 px-2 text-center border-r border-slate-300 print:border-slate-800 w-16">ĐVT</th>
                    <th className="py-2 px-3 text-right border-r border-slate-300 print:border-slate-800 w-28">Số tiền (VNĐ)</th>
                    <th className="py-2 px-2 text-center border-r border-slate-300 print:border-slate-800 w-18">Số lượng</th>
                    <th className="py-2 px-3 text-right border-r border-slate-300 print:border-slate-800 w-32">Khấu trừ / Miễn giảm</th>
                    <th className="py-2 px-3 text-right w-32">Thành tiền (VNĐ)</th>
                  </tr>
                </thead>
                <tbody className="text-slate-800 divide-y divide-slate-300 print:divide-slate-800">
                  {items.map((item, idx) => (
                    <tr key={item.id} className="border-b border-slate-300 print:border-slate-800">
                      <td className="py-2 px-2 text-center border-r border-slate-300 print:border-slate-800">{idx + 1}</td>
                      <td className="py-2 px-3 text-left border-r border-slate-300 print:border-slate-800">
                        <span className="font-medium text-slate-900">{item.name}</span>
                        {item.isMealFee && item.excusedAbsenceDays !== undefined && item.excusedAbsenceDays > 0 && (
                          <span className="block text-[11px] text-blue-700 screen-only no-print mt-0.5">
                            (Đã khấu trừ {item.excusedAbsenceDays} ngày nghỉ phép)
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-2 text-center border-r border-slate-300 print:border-slate-800">{getLineItemUnit(item)}</td>
                      <td className="py-2 px-3 text-right border-r border-slate-300 print:border-slate-800">{formatNumber(item.unitPrice)}</td>
                      <td className="py-2 px-2 text-center border-r border-slate-300 print:border-slate-800">{item.quantity}</td>
                      <td className="py-2 px-3 text-right border-r border-slate-300 print:border-slate-800">
                        {item.discountAmount > 0 ? formatNumber(item.discountAmount) : '0'}
                      </td>
                      <td className="py-2 px-3 text-right font-medium">{formatNumber(item.amount)}</td>
                    </tr>
                  ))}
                  <tr className="font-bold border-t-2 border-slate-400 print:border-slate-900 bg-slate-50/50 print:bg-transparent">
                    <td colSpan={6} className="py-2.5 px-3 text-center border-r border-slate-300 print:border-slate-800">
                      Tổng cộng
                    </td>
                    <td className="py-2.5 px-3 text-right font-black text-slate-900">
                      {formatNumber(invoice.totalAmount)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Notes section */}
            <div className="text-xs text-slate-800 space-y-1.5 leading-relaxed mb-6">
              <div className="font-bold text-slate-900">Ghi chú:</div>
              <div>Phụ huynh mở App ngân hàng/ Ví điện tử đang sử dụng. Chọn tính năng &quot;Quét QR&quot;, thực hiện quét mã trên phiếu và thanh toán.</div>
              <div>
                Lưu ý: Tải ngay <strong className="font-bold text-slate-900">ứng dụng ECO Me</strong> để miễn phí giao dịch và sử dụng tính năng <strong className="font-bold text-slate-900">thanh toán học phí trả sau</strong>, giảm nhẹ gánh nặng tài chính và linh hoạt trả góp nhiều kỳ.
              </div>
              <div>Phụ huynh cần hướng dẫn thanh toán liên hệ tổng đài: <strong className="font-bold text-slate-900">1900 9005</strong></div>
            </div>

            {/* Signatures section */}
            <div className="mt-6">
              <div className="text-right text-xs italic text-slate-800 pr-4 mb-2">
                Ngày {dateParts.day} tháng {dateParts.month} năm {dateParts.year}
              </div>
              <div className="grid grid-cols-3 text-center text-xs text-slate-800 font-bold">
                <div>Kế toán</div>
                <div>Thủ quỹ</div>
                <div>Hiệu trưởng</div>
              </div>
              <div className="h-16" />
            </div>

            {/* Footer */}
            <div className="text-[10px] text-slate-400 mt-2">
              Powered by finviet
            </div>
          </div>

          {/* Screen-Only Settlement Summary Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 screen-only no-print">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Tình trạng quyết toán trên cổng</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 block">Tổng tiền hóa đơn:</span>
                <span className="text-sm font-bold text-[#0070CE]">{formatVND(invoice.totalAmount)}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 block">Đã thanh toán:</span>
                <span className="text-sm font-bold text-emerald-600">{formatVND(invoice.paidAmount)}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 block">Còn lại phải nộp:</span>
                <span className={`text-sm font-bold ${invoice.remainingAmount > 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {formatVND(invoice.remainingAmount)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): VietQR Card & Payment History */}
        <div className="space-y-6 screen-only no-print">
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
