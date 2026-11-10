import React from 'react';
import Link from 'next/link';
import { ExpenseVoucher } from '../../../types/expense';
import { formatExpenseAmount, getLifecycleStatusMeta } from '../../../utils/expenseValidation';
import { Icon } from '@/components/ds';

interface ExpenseDetailViewProps {
  voucher: ExpenseVoucher;
  schoolCode: string;
  onConfirmDisbursement: (voucherId: string) => void;
  onApproveVoucher: (voucherId: string) => void;
  onOpenCancelModal: (voucherId: string) => void;
}

export const ExpenseDetailView: React.FC<ExpenseDetailViewProps> = ({
  voucher,
  schoolCode,
  onConfirmDisbursement,
  onApproveVoucher,
  onOpenCancelModal,
}) => {
  const statusMeta = getLifecycleStatusMeta(voucher.status);
  const isStudent = voucher.targetType === 'hoc_sinh';

  const handleDownload = () => {
    alert(`Đang tạo và tải xuống file phiếu chi ${voucher.voucherCode} dạng PDF...`);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & State-Dependent Actions (BR05) */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <Link href={`/${schoolCode}/school/expenses`} className="hover:underline flex items-center gap-1">
              <Icon name="arrow-left" size={12} />
              <span>Khoản chi</span>
            </Link>
            <span>/</span>
            <span className="font-mono text-slate-700">{voucher.voucherCode}</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl font-bold text-slate-900 m-0">{voucher.title}</h1>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${statusMeta.badgeClass}`}>
              <span className={`w-2 h-2 rounded-full ${statusMeta.dotColor}`} />
              {statusMeta.label}
            </span>
          </div>
        </div>

        {/* Action Buttons Matrix */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Trở về button */}
          <Link
            href={`/${schoolCode}/school/expenses`}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 font-medium text-sm transition-all shadow-sm cursor-pointer"
          >
            <Icon name="arrow-left" size={14} />
            <span>Trở về</span>
          </Link>

          {/* Hủy phiếu chi button (Only in da_tao and da_duyet) */}
          {(voucher.status === 'da_tao' || voucher.status === 'da_duyet') && (
            <button
              onClick={() => onOpenCancelModal(voucher.id)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-700 font-medium text-sm transition-all shadow-sm cursor-pointer"
            >
              <Icon name="ban" size={14} />
              <span>Hủy phiếu chi</span>
            </button>
          )}

          {/* Duyệt chi button (Only in da_tao) */}
          {voucher.status === 'da_tao' && (
            <button
              onClick={() => onApproveVoucher(voucher.id)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0070CE] hover:bg-blue-700 text-white font-medium text-sm transition-all shadow-sm cursor-pointer"
            >
              <Icon name="check" size={14} />
              <span>Duyệt chi</span>
            </button>
          )}

          {/* Xác nhận chi button (Only in da_duyet) */}
          {voucher.status === 'da_duyet' && (
            <button
              onClick={() => onConfirmDisbursement(voucher.id)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition-all shadow-sm cursor-pointer"
            >
              <Icon name="check" size={14} />
              <span>Xác nhận chi</span>
            </button>
          )}

          {/* Tải phiếu chi button (Always available) */}
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 font-medium text-sm transition-all shadow-sm cursor-pointer"
          >
            <Icon name="download" size={14} className="text-slate-500" />
            <span>Tải phiếu chi</span>
          </button>
        </div>
      </div>

      {/* Cancellation Reason Banner (If da_huy) */}
      {voucher.status === 'da_huy' && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-rose-800 flex items-start gap-3">
          <Icon name="alert-triangle" size={18} className="text-rose-500 shrink-0 mt-0.5" />
          <div className="text-sm">
            <div className="font-semibold text-rose-900">Phiếu chi đã bị hủy</div>
            <div className="mt-1">
              <span className="font-medium">Lý do hủy:</span> {voucher.cancelReason || 'Không có ghi chú lý do.'}
            </div>
            <div className="text-xs text-rose-600 mt-1">
              Người hủy: {voucher.cancelledBy || 'Kế toán trường'} • Thời gian: {voucher.cancelledDate || voucher.createdDate}
            </div>
          </div>
        </div>
      )}

      {/* Grid: Thông tin chung & Đối tượng chi cho */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Thông tin phiếu chi */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Icon name="file" size={16} className="text-[#0070CE]" />
            <h2 className="font-bold text-slate-800 text-base m-0">Thông tin phiếu chi</h2>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Mã phiếu chi:</span>
              <span className="font-mono font-bold text-slate-900">{voucher.voucherCode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Ngày lập:</span>
              <span className="font-medium text-slate-800">{voucher.createdDate}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Loại phiếu chi:</span>
              <span className="font-medium text-slate-800">
                {voucher.voucherType === 'hoan_tien' ? 'Hoàn tiền' : 'Khác'}
              </span>
            </div>
            {voucher.voucherType === 'hoan_tien' && (
              <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-100 text-xs text-blue-700 flex items-center gap-1.5">
                <Icon name="info" size={13} className="shrink-0" />
                <span>*Phiếu chi sẽ gửi thông báo cho phụ huynh</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-500">Danh mục chi phí:</span>
              <span className="font-medium text-slate-800">{voucher.categoryName}</span>
            </div>
            {voucher.notes && (
              <div className="pt-2 border-t border-slate-100">
                <span className="text-slate-500 block text-xs mb-1">Ghi chú nội bộ:</span>
                <p className="text-slate-700 text-xs italic bg-slate-50 p-2.5 rounded-lg border border-slate-100 m-0">
                  {voucher.notes}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Card 2: Chi cho (BR03: Dynamic Student vs Staff) */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Icon name={isStudent ? 'graduation-cap' : 'user'} size={16} className="text-amber-500" />
            <h2 className="font-bold text-slate-800 text-base m-0">Thông tin đối tượng chi</h2>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Đối tượng:</span>
              <span className="font-medium text-slate-800">
                {isStudent ? 'Học sinh' : 'Nhân viên / Giáo viên'}
              </span>
            </div>

            {/* BR03: Student branch shows both Student and Recipient */}
            {isStudent ? (
              <>
                <div className="flex justify-between">
                  <span className="text-slate-500">Học sinh:</span>
                  <span className="font-bold text-slate-900">
                    {voucher.targetName} ({voucher.targetSubInfo})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Mã học sinh:</span>
                  <span className="font-mono text-slate-700">{voucher.targetId}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-100">
                  <span className="text-slate-500">Người nhận tiền (Phụ huynh):</span>
                  <span className="font-bold text-[#0070CE]">{voucher.recipientName}</span>
                </div>
                {voucher.recipientPhone && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Số điện thoại liên hệ:</span>
                    <span className="font-medium text-slate-800">{voucher.recipientPhone}</span>
                  </div>
                )}
              </>
            ) : (
              /* BR03: Staff branch shows Staff and Department, no separate guardian */
              <>
                <div className="flex justify-between">
                  <span className="text-slate-500">Nhân viên nhận:</span>
                  <span className="font-bold text-slate-900">{voucher.targetName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Chức vụ / Bộ phận:</span>
                  <span className="font-medium text-slate-800">{voucher.targetSubInfo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Mã nhân viên:</span>
                  <span className="font-mono text-slate-700">{voucher.targetId}</span>
                </div>
                {voucher.recipientPhone && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Số điện thoại:</span>
                    <span className="font-medium text-slate-800">{voucher.recipientPhone}</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Bảng Hoạch Toán Chi Tiết (BR04) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="file" size={16} className="text-[#0070CE]" />
            <h2 className="font-bold text-slate-800 text-base m-0">Bảng hoạch toán chi phí</h2>
          </div>
          <span className="text-xs text-slate-500">
            {voucher.lineItems.length} mục chi phí
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 tracking-wider">
                <th className="py-3 px-4 w-12 text-center">STT</th>
                <th className="py-3 px-4 min-w-[260px]">Nội dung chi</th>
                <th className="py-3 px-4 min-w-[200px]">Ghi chú</th>
                <th className="py-3 px-4 text-right">Đơn giá (đ)</th>
                <th className="py-3 px-4 text-center">Số lượng</th>
                <th className="py-3 px-4 text-right">Thành tiền (đ)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {voucher.lineItems.map((item, index) => (
                <tr key={item.id || index} className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 text-center text-slate-500 font-medium">{index + 1}</td>
                  <td className="py-3.5 px-4 font-medium text-slate-900">{item.content}</td>
                  <td className="py-3.5 px-4 text-slate-500 text-xs">{item.note || '—'}</td>
                  <td className="py-3.5 px-4 text-right font-medium text-slate-700">
                    {formatExpenseAmount(item.unitPrice, false)}
                  </td>
                  <td className="py-3.5 px-4 text-center text-slate-700">
                    {item.quantity} <span className="text-xs text-slate-400">{item.unit}</span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                    {formatExpenseAmount(item.total)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-50/90 border-t-2 border-slate-300">
                <td colSpan={5} className="py-4 px-4 text-right font-bold text-slate-800 uppercase text-xs tracking-wider">
                  Tổng tiền chi:
                </td>
                <td className="py-4 px-4 text-right font-bold text-xl text-[#0070CE]">
                  {formatExpenseAmount(voucher.totalAmount)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Audit Trail Card (NFR03) */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
          <Icon name="clock" size={16} className="text-slate-500" />
          <h2 className="font-bold text-slate-800 text-base m-0">Nhật ký xử lý & Phê duyệt</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Lập phiếu */}
          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-100">
            <div className="text-xs font-semibold text-slate-500 uppercase">Người lập phiếu</div>
            <div className="font-medium text-slate-900 mt-1">{voucher.createdBy}</div>
            <div className="text-xs text-slate-500 mt-0.5">{voucher.createdDate}</div>
          </div>

          {/* Phê duyệt */}
          <div className={`p-3.5 rounded-lg border ${
            voucher.approvedBy ? 'bg-sky-50/60 border-sky-100' : 'bg-slate-50 border-slate-100 opacity-60'
          }`}>
            <div className="text-xs font-semibold text-slate-500 uppercase">Người duyệt chi</div>
            <div className="font-medium text-slate-900 mt-1">
              {voucher.approvedBy || 'Chưa duyệt'}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              {voucher.approvedDate || '—'}
            </div>
          </div>

          {/* Giải ngân */}
          <div className={`p-3.5 rounded-lg border ${
            voucher.disbursedBy ? 'bg-emerald-50/60 border-emerald-100' : 'bg-slate-50 border-slate-100 opacity-60'
          }`}>
            <div className="text-xs font-semibold text-slate-500 uppercase">Người xác nhận chi</div>
            <div className="font-medium text-slate-900 mt-1">
              {voucher.disbursedBy || 'Chưa chi'}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              {voucher.disbursedDate || '—'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
