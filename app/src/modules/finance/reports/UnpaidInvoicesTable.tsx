import React from 'react';
import Link from 'next/link';
import type { InvoiceRecord } from '../../../types/invoice';
import { formatFeeReportCurrency, isInvoiceOverdue } from '../../../utils/feeReportValidation';
import { Tag, StatusTag, EmptyState } from '../../../components/ds';

interface UnpaidInvoicesTableProps {
  invoices: InvoiceRecord[];
  schoolCode: string;
}

export const UnpaidInvoicesTable: React.FC<UnpaidInvoicesTableProps> = ({
  invoices,
  schoolCode,
}) => {
  const getStatusBadge = (inv: InvoiceRecord) => {
    const overdue = isInvoiceOverdue(inv);
    if (overdue || inv.status === 'qua_han') {
      return <StatusTag tone="danger" label="Quá hạn" icon={true} />;
    }
    if (inv.status === 'da_gui') {
      return <StatusTag tone="info" label="Đã gửi" icon={true} />;
    }
    return <StatusTag tone="neutral" label="Chưa thu" />;
  };

  if (invoices.length === 0) {
    return (
      <div className="p-8">
        <EmptyState
          icon="circle-check"
          title="Không có hóa đơn chưa thanh toán"
          description="Tuyệt vời! Toàn bộ hóa đơn trong khoảng thời gian đã chọn đều đã được thu đầy đủ."
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
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ textAlign: 'center', minWidth: '130px' }}>
                Trạng thái
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ minWidth: '140px' }}>
                Hạn thanh toán
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)] is-right" style={{ textAlign: 'right', minWidth: '130px' }}>
                Số tiền cần thu
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
                <td className="body-sm" style={{ textAlign: 'center' }}>
                  {getStatusBadge(inv)}
                </td>
                <td className="body-sm font-numeric text-[var(--text-body)]">
                  {inv.dueDate}
                </td>
                <td className="body-sm is-right font-numeric font-semibold text-[var(--semantic-danger)]" style={{ textAlign: 'right' }}>
                  {formatFeeReportCurrency(inv.remainingAmount || inv.totalAmount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  );
};

export default UnpaidInvoicesTable;
