/**
 * Expense Detail SlideOver Component (Right Drawer)
 * View full voucher details, lifecycle states, and actions in a slideover drawer
 * Design System: [DS] ECO ME DASHBOARD v1.1.0 (SlideOver)
 */

import React from 'react';
import { ExpenseVoucher } from '../../../types/expense';
import { formatExpenseAmount, getLifecycleStatusMeta } from '../../../utils/expenseValidation';
import { SlideOver, Icon, StatusTag } from '@/components/ds';

interface ExpenseDetailSlideOverProps {
  voucher: ExpenseVoucher | null;
  isOpen: boolean;
  schoolCode: string;
  onClose: () => void;
  onConfirmDisbursement: (voucherId: string) => void;
  onApproveVoucher: (voucherId: string) => void;
  onOpenCancelModal: (voucherId: string) => void;
}

export const ExpenseDetailSlideOver: React.FC<ExpenseDetailSlideOverProps> = ({
  voucher,
  isOpen,
  schoolCode,
  onClose,
  onConfirmDisbursement,
  onApproveVoucher,
  onOpenCancelModal,
}) => {
  if (!isOpen || !voucher) {
    return null;
  }

  const statusMeta = getLifecycleStatusMeta(voucher.status);
  const isStudent = voucher.targetType === 'hoc_sinh';

  const handleDownload = () => {
    alert(`Đang tạo và tải xuống file phiếu chi ${voucher.voucherCode} dạng PDF...`);
  };

  // Primary action based on status
  let primaryAction = undefined;
  if (voucher.status === 'da_tao') {
    primaryAction = {
      label: 'Duyệt chi',
      icon: 'check' as const,
      onClick: () => {
        onApproveVoucher(voucher.id);
        onClose();
      },
    };
  } else if (voucher.status === 'da_duyet') {
    primaryAction = {
      label: 'Xác nhận giải ngân',
      icon: 'check' as const,
      onClick: () => {
        onConfirmDisbursement(voucher.id);
        onClose();
      },
    };
  }

  // Extra action for cancel if applicable
  let extraAction = undefined;
  if (voucher.status === 'da_tao' || voucher.status === 'da_duyet') {
    extraAction = {
      label: 'Hủy phiếu chi',
      icon: 'ban' as const,
      tone: 'danger' as const,
      onClick: () => {
        onClose();
        onOpenCancelModal(voucher.id);
      },
    };
  }

  return (
    <SlideOver
      open={isOpen}
      onClose={onClose}
      title={voucher.title}
      description={`Mã phiếu: ${voucher.voucherCode} • Danh mục: ${voucher.categoryName}`}
      icon="file-invoice-dollar"
      width={740}
      primaryAction={primaryAction}
      secondaryAction={{
        label: 'Đóng',
        onClick: onClose,
      }}
      extraAction={extraAction}
    >
      <div className="space-y-6 text-sm">
        {/* Status & Quick Download Banner */}
        <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Trạng thái:</span>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${statusMeta.badgeClass}`}>
              <span className={`w-2 h-2 rounded-full ${statusMeta.dotColor}`} />
              {statusMeta.label}
            </span>
          </div>

          <button
            onClick={handleDownload}
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <Icon name="download" size={13} className="text-slate-500" />
            <span>Tải phiếu PDF</span>
          </button>
        </div>

        {/* 1. Thông tin chung */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
          <h2 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2.5 flex items-center gap-2">
            <Icon name="circle-info" size={14} className="text-[#0070CE]" />
            <span>1. Thông tin chung phiếu chi</span>
          </h2>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-500 block mb-0.5">Mã phiếu chi:</span>
              <span className="font-mono font-bold text-slate-800">{voucher.voucherCode}</span>
            </div>
            <div>
              <span className="text-slate-500 block mb-0.5">Ngày lập phiếu:</span>
              <span className="font-semibold text-slate-800">{voucher.createdDate}</span>
            </div>
            <div>
              <span className="text-slate-500 block mb-0.5">Người lập:</span>
              <span className="font-semibold text-slate-800">{voucher.createdBy}</span>
            </div>
            <div>
              <span className="text-slate-500 block mb-0.5">Danh mục chi:</span>
              <span className="font-semibold text-slate-800">{voucher.categoryName}</span>
            </div>
            <div>
              <span className="text-slate-500 block mb-0.5">Loại phiếu:</span>
              <span className="font-semibold text-slate-800">
                {voucher.voucherType === 'hoan_tien'
                  ? 'Hoàn tiền học phí'
                  : 'Khác (Chi mua sắm, phụ cấp...)'}
              </span>
            </div>
            {voucher.approvedDate && (
              <div>
                <span className="text-slate-500 block mb-0.5">Ngày duyệt chi:</span>
                <span className="font-semibold text-slate-800">{voucher.approvedDate}</span>
              </div>
            )}
            {voucher.disbursedDate && (
              <div>
                <span className="text-slate-500 block mb-0.5">Ngày giải ngân thực tế:</span>
                <span className="font-semibold text-emerald-700">{voucher.disbursedDate}</span>
              </div>
            )}
          </div>
        </div>

        {/* 2. Đối tượng nhận chi */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
          <h2 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2.5 flex items-center gap-2">
            <Icon name="user" size={14} className="text-[#0070CE]" />
            <span>2. Đối tượng nhận chi</span>
          </h2>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-500 block mb-0.5">Phân loại đối tượng:</span>
              <span className="font-semibold text-slate-800">
                {isStudent ? 'Học sinh' : 'Nhân viên / Giáo viên'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block mb-0.5">Họ và tên đối tượng:</span>
              <span className="font-bold text-slate-800">{voucher.targetName}</span>
            </div>
            {voucher.targetSubInfo && (
              <div>
                <span className="text-slate-500 block mb-0.5">Lớp / Bộ phận:</span>
                <span className="font-semibold text-slate-800">{voucher.targetSubInfo}</span>
              </div>
            )}
            {voucher.recipientName && (
              <div>
                <span className="text-slate-500 block mb-0.5">Người nhận tiền (Đại diện):</span>
                <span className="font-bold text-slate-800">{voucher.recipientName}</span>
              </div>
            )}
            {voucher.recipientPhone && (
              <div>
                <span className="text-slate-500 block mb-0.5">Số điện thoại liên hệ:</span>
                <span className="font-mono text-slate-800">{voucher.recipientPhone}</span>
              </div>
            )}
            {voucher.notes && (
              <div className="col-span-2">
                <span className="text-slate-500 block mb-0.5">Ghi chú nội bộ:</span>
                <p className="text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100 m-0">
                  {voucher.notes}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 3. Bảng hoạch toán chi tiết */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
          <h2 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon name="coins" size={14} className="text-[#0070CE]" />
              <span>3. Bảng hoạch toán chi tiết ({voucher.lineItems.length} khoản)</span>
            </div>
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px] bg-slate-50">
                  <th className="py-2.5 px-3">STT</th>
                  <th className="py-2.5 px-3">Nội dung chi</th>
                  <th className="py-2.5 px-3 text-right">Đơn giá</th>
                  <th className="py-2.5 px-3 text-center">Số lượng</th>
                  <th className="py-2.5 px-3 text-center">ĐVT</th>
                  <th className="py-2.5 px-3 text-right">Thành tiền</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {voucher.lineItems.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 text-slate-400 font-mono">{idx + 1}</td>
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-slate-800">{item.content}</div>
                      {item.note && <div className="text-[11px] text-slate-400">{item.note}</div>}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-600 font-mono">
                      {formatExpenseAmount(item.unitPrice)}
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono">{item.quantity}</td>
                    <td className="py-2.5 px-3 text-center text-slate-500">{item.unit}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-800 font-mono">
                      {formatExpenseAmount(item.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-50/90 border-t-2 border-slate-300">
                  <td colSpan={5} className="py-3 px-3 text-right font-bold text-slate-800 uppercase text-[11px] tracking-wider">
                    Tổng cộng tiền chi:
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-sm text-[#0070CE] font-mono">
                    {formatExpenseAmount(voucher.totalAmount)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </SlideOver>
  );
};
