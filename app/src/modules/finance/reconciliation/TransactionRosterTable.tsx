import React from 'react';
import Link from 'next/link';
import { ReconciliationTransaction } from '../../../types/reconciliation';
import { formatReconciliationAmount } from '../../../utils/reconciliationValidation';
import { Icon, Tag, StatusTag, Button, EmptyState } from '../../../components/ds';

interface TransactionRosterTableProps {
  transactions: ReconciliationTransaction[];
  schoolCode: string;
  expandedTransactionIds: string[];
  onToggleExpand: (transactionId: string) => void;
}

export const TransactionRosterTable: React.FC<TransactionRosterTableProps> = ({
  transactions,
  schoolCode,
  expandedTransactionIds,
  onToggleExpand,
}) => {
  if (transactions.length === 0) {
    return (
      <EmptyState
        icon="magnifying-glass"
        title="Không tìm thấy giao dịch nào phù hợp"
        description="Vui lòng thay đổi từ khóa tìm kiếm hoặc chọn 'Tất cả cổng thanh toán' để hiển thị toàn bộ giao dịch."
      />
    );
  }

  return (
    <div className="ecomd-table-card">
      <div
        style={{
          padding: 'var(--space-14) var(--space-20)',
          borderBottom: '1px solid var(--border-default)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-subtle)',
        }}
      >
        <div>
          <h3 className="body-sm-bold text-[var(--text-heading)] m-0">
            Danh Sách Giao Dịch Chi Tiết
          </h3>
          <p className="body-xs text-[var(--text-subtle)] mt-0.5 m-0">
            Bấm vào nút &quot;N hóa đơn&quot; để mở rộng xem trực tiếp hóa đơn liên kết ngay tại dòng
          </p>
        </div>
        <Tag variant="code">{transactions.length} giao dịch</Tag>
      </div>

      <div className="ecomd-table-scroll">
        <table className="ecomd-table ecomd-table--dense w-full">
          <thead>
            <tr>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ width: '48px', textAlign: 'center' }}>
                STT
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)]">Mã giao dịch</th>
              <th className="body-xs-semibold text-[var(--text-subtle)] is-primary">Học sinh &amp; lớp</th>
              <th className="body-xs-semibold text-[var(--text-subtle)] is-right" style={{ textAlign: 'right' }}>
                Số tiền
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)]">Thời gian giao dịch</th>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ textAlign: 'center' }}>
                Cổng thanh toán
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)] is-right is-actions" style={{ textAlign: 'center' }}>
                Hóa đơn liên kết
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, index) => {
              const isExpanded = expandedTransactionIds.includes(tx.id);
              const isFinviet = tx.channel === 'finviet';

              return (
                <React.Fragment key={tx.id}>
                  {/* Main Transaction Row */}
                  <tr
                    className={isExpanded ? 'is-selected' : undefined}
                    style={isExpanded ? { background: 'var(--bg-selected)' } : undefined}
                  >
                    {/* STT */}
                    <td className="body-sm" style={{ textAlign: 'center' }}>
                      <span className="body-xs font-numeric text-[var(--text-subtle)]">
                        {index + 1}
                      </span>
                    </td>

                    {/* Mã Giao Dịch */}
                    <td className="body-sm">
                      <span className="body-xs font-mono font-semibold text-[var(--eco-blue-strong)]">
                        {tx.transactionCode}
                      </span>
                    </td>

                    {/* Tên Trẻ & Lớp */}
                    <td className="body-sm is-primary">
                      <div className="ecomd-cell__value">
                        <div className="body-sm-bold text-[var(--text-heading)]">{tx.studentName}</div>
                        <div className="body-xs text-[var(--text-subtle)] mt-0.5">
                          Mã HS: <span className="font-mono">{tx.studentId}</span> • {tx.className}
                        </div>
                      </div>
                    </td>

                    {/* Số Tiền */}
                    <td className="body-sm is-right" style={{ textAlign: 'right' }}>
                      <span className="body-sm-semibold font-numeric text-[var(--text-heading)]">
                        {formatReconciliationAmount(tx.amount)}
                      </span>
                    </td>

                    {/* Ngày & Giờ Giao Dịch */}
                    <td className="body-sm">
                      <span className="body-xs font-numeric text-[var(--text-body)]">
                        {tx.transactionTime}
                      </span>
                    </td>

                    {/* Cổng Thanh Toán */}
                    <td className="body-sm" style={{ textAlign: 'center' }}>
                      <Tag variant={isFinviet ? 'default' : 'success'}>
                        {tx.channelLabel}
                      </Tag>
                    </td>

                    {/* Hóa Đơn Liên Kết Button */}
                    <td className="body-sm is-right is-actions" style={{ textAlign: 'center' }}>
                      <Button
                        variant={isExpanded ? 'primary' : 'secondary'}
                        size="sm"
                        icon={isExpanded ? 'chevron-up' : 'chevron-down'}
                        onClick={() => onToggleExpand(tx.id)}
                      >
                        {tx.linkedInvoices.length} hóa đơn
                      </Button>
                    </td>
                  </tr>

                  {/* Inline Expanded Row: Linked Invoices Accordion */}
                  {isExpanded && (
                    <tr style={{ background: 'var(--bg-subtle)' }}>
                      <td colSpan={7} style={{ padding: 'var(--space-16)' }}>
                        <div
                          style={{
                            background: 'var(--bg-surface)',
                            borderRadius: 'var(--radius-8)',
                            border: '1px solid var(--border-default)',
                            padding: 'var(--space-14)',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              paddingBottom: 'var(--space-8)',
                              marginBottom: 'var(--space-12)',
                              borderBottom: '1px solid var(--border-subtle)',
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <span
                                style={{
                                  width: '8px',
                                  height: '8px',
                                  borderRadius: '9999px',
                                  background: 'var(--eco-blue-strong)',
                                }}
                              />
                              <h4 className="body-xs-semibold text-[var(--text-heading)] uppercase tracking-wider m-0">
                                Hóa Đơn Học Phí Liên Kết Với Giao Dịch {tx.transactionCode}
                              </h4>
                            </div>
                            <span className="body-xs text-[var(--text-subtle)]">
                              Đối chiếu khớp đúng với module Học Phí
                            </span>
                          </div>

                          <div className="ecomd-table-scroll">
                            <table className="ecomd-table ecomd-table--dense w-full">
                              <thead>
                                <tr>
                                  <th className="body-xs-semibold text-[var(--text-subtle)]">Tên hóa đơn</th>
                                  <th className="body-xs-semibold text-[var(--text-subtle)]">Mã hóa đơn</th>
                                  <th className="body-xs-semibold text-[var(--text-subtle)] is-right" style={{ textAlign: 'right' }}>Tổng tiền hóa đơn</th>
                                  <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ textAlign: 'center' }}>Trạng thái</th>
                                  <th className="body-xs-semibold text-[var(--text-subtle)] is-right" style={{ textAlign: 'right' }}>Xem chi tiết</th>
                                </tr>
                              </thead>
                              <tbody>
                                {tx.linkedInvoices.map((inv) => (
                                  <tr key={inv.id}>
                                    <td className="body-sm-bold text-[var(--text-heading)]">
                                      {inv.invoiceTitle}
                                    </td>
                                    <td className="body-xs font-mono font-medium text-[var(--text-body)]">
                                      {inv.invoiceCode}
                                    </td>
                                    <td className="body-sm-semibold font-numeric text-[var(--text-heading)]" style={{ textAlign: 'right' }}>
                                      {formatReconciliationAmount(inv.totalAmount)}
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                      <StatusTag tone="success" label="Đã thanh toán" icon={true} />
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                      <Link
                                        href={`/${schoolCode}/school/fee/${inv.invoiceCode}`}
                                        className="body-xs-semibold text-[var(--eco-blue-strong)] hover:underline inline-flex items-center gap-1"
                                        title="Chuyển sang module Học Phí để xem hóa đơn gốc"
                                      >
                                        <span>Mở Hóa Đơn</span>
                                        <Icon name="arrow-up-right-from-square" size={11} />
                                      </Link>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          {/* Reconciliation Evidence Note */}
                          <div
                            style={{
                              marginTop: 'var(--space-12)',
                              padding: 'var(--space-10) var(--space-12)',
                              background: 'var(--semantic-info-soft)',
                              borderRadius: 'var(--radius-6)',
                              border: '1px solid var(--border-info-soft)',
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: 'var(--space-8)',
                              fontSize: '12px',
                              color: 'var(--text-body)',
                            }}
                          >
                            <span style={{ color: 'var(--eco-blue-strong)' }}>ℹ️</span>
                            <div>
                              <strong>Xác nhận đối soát (BR04):</strong> Giao dịch số tiền{' '}
                              <strong>{formatReconciliationAmount(tx.amount)}</strong> được thực hiện qua cổng{' '}
                              <strong>{tx.channelLabel}</strong> bởi phụ huynh của học sinh{' '}
                              <strong>{tx.studentName}</strong>, được hệ thống ghi nhận đối trừ vào hóa đơn mã{' '}
                              <strong>{tx.linkedInvoices[0]?.invoiceCode}</strong>.
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionRosterTable;
