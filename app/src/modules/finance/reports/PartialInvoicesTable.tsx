import React from 'react';
import Link from 'next/link';
import type { InvoiceRecord } from '../../../types/invoice';
import { formatFeeReportCurrency } from '../../../utils/feeReportValidation';
import { Tag, Button, EmptyState } from '../../../components/ds';

interface PartialInvoicesTableProps {
  invoices: InvoiceRecord[];
  schoolCode: string;
  onViewHistory: (invoice: InvoiceRecord) => void;
}

export const PartialInvoicesTable: React.FC<PartialInvoicesTableProps> = ({
  invoices,
  schoolCode,
  onViewHistory,
}) => {
  if (invoices.length === 0) {
    return (
      <div className="p-8">
        <EmptyState
          icon="file-lines"
          title="Không có hóa đơn thanh toán một phần"
          description="Toàn bộ hóa đơn đã hoàn thành thu hoặc chưa bắt đầu thanh toán."
        />
      </div>
    );
  }

  return (
    <div className="ecomd-table-scroll">
      <table className="ecomd-table ecomd-table--dense w-full">
          <thead>
            <tr>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ width: '48px', textAlign: 'center' }}>
                STT
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)] is-primary" style={{ minWidth: '180px' }}>
                Hóa đơn
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ minWidth: '180px' }}>
                Học sinh
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ width: '100px' }}>
                Lớp
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ minWidth: '120px' }}>
                Hạn thanh toán
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)] is-right" style={{ textAlign: 'right', minWidth: '160px' }}>
                Số tiền (đ)
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)] is-right is-actions" style={{ textAlign: 'center', width: '120px' }}>
                Lịch sử
              </th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv, idx) => (
              <tr key={inv.id}>
                <td className="body-sm" style={{ textAlign: 'center' }}>
                  <span className="body-xs font-numeric text-[var(--text-subtle)]">
                    {idx + 1}
                  </span>
                </td>
                <td className="body-sm is-primary">
                  <div className="ecomd-cell__value">
                    <Link
                      href={`/${schoolCode}/school/fee/${inv.id}`}
                      className="body-xs font-mono font-bold text-[var(--eco-blue-strong)] hover:underline block"
                    >
                      {inv.invoiceNo}
                    </Link>
                    <div className="body-xs text-[var(--text-subtle)] truncate max-w-[200px]">
                      {inv.title}
                    </div>
                  </div>
                </td>
                <td className="body-sm">
                  <div className="ecomd-cell__value">
                    <div className="body-sm-bold text-[var(--text-heading)]">{inv.studentName}</div>
                    <div className="body-xs font-mono text-[var(--text-subtle)]">{inv.studentCode}</div>
                  </div>
                </td>
                <td className="body-sm">
                  <Tag variant="default">{inv.className}</Tag>
                </td>
                <td className="body-sm font-numeric text-[var(--text-body)]">
                  {inv.dueDate}
                </td>
                <td className="body-sm is-right font-numeric" style={{ textAlign: 'right' }}>
                  <div className="body-sm font-semibold text-[var(--text-heading)]">
                    {formatFeeReportCurrency(inv.totalAmount)}
                  </div>
                  <div className="body-xs text-[var(--semantic-success)]">
                    Đã thu: {formatFeeReportCurrency(inv.paidAmount)}
                  </div>
                  <div className="body-xs font-semibold text-[var(--semantic-danger)]">
                    Còn lại: {formatFeeReportCurrency(inv.remainingAmount)}
                  </div>
                </td>
                <td className="body-sm is-right is-actions" style={{ textAlign: 'center' }}>
                  <Button
                    variant="secondary"
                    size="sm"
                    icon="clock-rotate-left"
                    onClick={() => onViewHistory(inv)}
                  >
                    Lịch sử
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  );
};

export default PartialInvoicesTable;
