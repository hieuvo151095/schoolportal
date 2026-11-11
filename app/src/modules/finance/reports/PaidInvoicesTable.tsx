import React from 'react';
import Link from 'next/link';
import type { InvoiceRecord } from '../../../types/invoice';
import { formatFeeReportCurrency } from '../../../utils/feeReportValidation';
import { Tag, EmptyState } from '../../../components/ds';

interface PaidInvoicesTableProps {
  invoices: InvoiceRecord[];
  schoolCode: string;
}

export const PaidInvoicesTable: React.FC<PaidInvoicesTableProps> = ({
  invoices,
  schoolCode,
}) => {
  const getPaymentMethodBadge = (method?: string) => {
    switch (method) {
      case 'cong_sepay':
        return <Tag variant="warning">Ví FinViet / QR</Tag>;
      case 'chuyen_khoan':
        return <Tag variant="default">VietQR Chuyển khoản</Tag>;
      case 'tien_mat':
        return <Tag variant="success">Tiền mặt</Tag>;
      case 'the_pos':
        return <Tag variant="default">Thẻ POS</Tag>;
      default:
        return <Tag variant="default">Điện tử</Tag>;
    }
  };

  if (invoices.length === 0) {
    return (
      <div className="p-8">
        <EmptyState
          icon="credit-card"
          title="Không tìm thấy hóa đơn đã thanh toán"
          description="Thử chọn khoảng ngày xác nhận thanh toán khác hoặc làm mới bộ lọc."
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
              <th className="body-xs-semibold text-[var(--text-subtle)] is-primary" style={{ minWidth: '200px' }}>
                Hóa đơn
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ minWidth: '180px' }}>
                Học sinh
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ width: '100px' }}>
                Lớp
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ minWidth: '150px' }}>
                Người xác nhận
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ minWidth: '130px' }}>
                Ngày xác nhận
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ minWidth: '140px' }}>
                Phương thức TT
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)] is-right" style={{ textAlign: 'right', minWidth: '120px' }}>
                Số tiền
              </th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv, idx) => {
              const latestPayment = inv.paymentHistory[inv.paymentHistory.length - 1];

              return (
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
                      <div className="body-xs text-[var(--text-subtle)] truncate max-w-[240px]">
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
                  <td className="body-sm text-[var(--text-body)]">
                    {latestPayment?.confirmedBy || inv.createdBy || 'Hệ thống'}
                  </td>
                  <td className="body-sm font-numeric text-[var(--text-body)]">
                    {latestPayment?.paidAt || inv.issueDate}
                  </td>
                  <td className="body-sm">
                    {getPaymentMethodBadge(latestPayment?.paymentMethod)}
                  </td>
                  <td className="body-sm is-right font-numeric font-semibold text-[var(--semantic-success)]" style={{ textAlign: 'right' }}>
                    {formatFeeReportCurrency(inv.paidAmount)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
  );
};

export default PaidInvoicesTable;
