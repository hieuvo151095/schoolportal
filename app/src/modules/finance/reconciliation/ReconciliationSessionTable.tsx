/**
 * Reconciliation Session Table Component
 * Design System: [DS] ECO ME DASHBOARD v1.1.0
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { ReconciliationSession } from '../../../types/reconciliation';
import { formatReconciliationAmount } from '../../../utils/reconciliationValidation';
import { Tag, StatusTag, Button, Icon } from '../../../components/ds';

interface ReconciliationSessionTableProps {
  sessions: ReconciliationSession[];
  schoolCode: string;
  onExportSession: (session: ReconciliationSession) => void;
}

export const ReconciliationSessionTable: React.FC<ReconciliationSessionTableProps> = ({
  sessions,
  schoolCode,
  onExportSession,
}) => {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  if (sessions.length === 0) {
    return (
      <div
        style={{
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-neutral)',
          padding: 'var(--space-8) var(--space-4)',
          textAlign: 'center',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            background: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-full)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto var(--space-3)',
            color: 'var(--text-secondary)',
          }}
        >
          <Icon name="calendar" size={24} />
        </div>
        <h3 className="h5" style={{ margin: '0 0 var(--space-1)', color: 'var(--text-primary)' }}>
          Không có phiên đối soát nào trong khoảng thời gian đã chọn
        </h3>
        <p className="body-sm" style={{ margin: 0, color: 'var(--text-secondary)' }}>
          Vui lòng mở rộng khoảng thời gian hoặc bấm nút &quot;12 ngày gần nhất&quot; để tìm các phiên đối soát đã đồng bộ.
        </p>
      </div>
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
            Danh Sách Phiên Đối Soát Điện Tử
          </h3>
          <p className="body-xs text-[var(--text-subtle)] mt-0.5 m-0">
            Mỗi phiên là 1 đợt đồng bộ giao dịch từ cổng thanh toán Ví FinViet và QR Ecopay
          </p>
        </div>
        <Tag variant="code">{sessions.length} phiên ghi nhận</Tag>
      </div>

      <div className="ecomd-table-scroll">
        <table className="ecomd-table ecomd-table--dense w-full">
          <thead>
            <tr>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ width: '56px', textAlign: 'center' }}>
                STT
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)] is-primary">
                Mã phiên / ngày tạo phiên
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)]">
                Khoảng thời gian giao dịch
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)] is-right" style={{ textAlign: 'right' }}>
                Tổng tiền phiên
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ textAlign: 'center' }}>
                Số giao dịch
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ textAlign: 'center' }}>
                Số hóa đơn
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ textAlign: 'center' }}>
                Trạng thái
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)] is-right is-actions" style={{ textAlign: 'right' }}>
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session, index) => {
              const detailHref = `/${schoolCode}/school/reconciliation/${session.id}`;

              return (
                <tr key={session.id}>
                  {/* STT */}
                  <td className="body-sm" style={{ textAlign: 'center' }}>
                    <div className="ecomd-cell__value justify-center">
                      <span className="body-xs font-numeric text-[var(--text-subtle)]">
                        {index + 1}
                      </span>
                    </div>
                  </td>

                  {/* Session code & created date */}
                  <td className="body-sm is-primary">
                    <div className="ecomd-cell__value">
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <Link
                          href={detailHref}
                          className="body-sm-bold text-[var(--text-heading)] hover:text-[var(--eco-blue-strong)] hover:underline inline-block"
                        >
                          {session.sessionCode}
                        </Link>
                        <span className="body-xs font-numeric text-[var(--text-subtle)]">
                          Tạo lúc: {session.sessionDate}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Transaction Period */}
                  <td className="body-sm">
                    <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                      Chu kỳ
                    </span>
                    <div className="ecomd-cell__value">
                      <div className="flex items-center gap-1.5 body-xs font-numeric text-[var(--text-body)]">
                        <Icon name="calendar" size={12} color="var(--text-subtle)" />
                        <span>{session.transactionPeriod}</span>
                      </div>
                      <div className="body-xs text-[var(--text-subtle)] mt-0.5">
                        Chu kỳ đối soát 24h
                      </div>
                    </div>
                  </td>

                  {/* Amount */}
                  <td className="body-sm is-right" style={{ textAlign: 'right' }}>
                    <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                      Tổng tiền
                    </span>
                    <div className="ecomd-cell__value justify-end">
                      <span className="body-sm-semibold font-numeric text-[var(--text-heading)]">
                        {formatReconciliationAmount(session.totalAmount)}
                      </span>
                    </div>
                  </td>

                  {/* Transactions count */}
                  <td className="body-sm" style={{ textAlign: 'center' }}>
                    <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                      Số GD
                    </span>
                    <div className="ecomd-cell__value justify-center">
                      <span className="body-sm font-numeric text-[var(--text-body)]">
                        {session.transactionCount}
                      </span>
                    </div>
                  </td>

                  {/* Invoices count */}
                  <td className="body-sm" style={{ textAlign: 'center' }}>
                    <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                      Số HĐ
                    </span>
                    <div className="ecomd-cell__value justify-center">
                      <span className="body-sm font-numeric text-[var(--text-body)]">
                        {session.invoiceCount}
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="body-sm" style={{ textAlign: 'center' }}>
                    <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                      Trạng thái
                    </span>
                    <div className="ecomd-cell__value justify-center">
                      <StatusTag tone="success" label="Đã đối soát" icon={true} />
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="body-sm is-right is-actions" style={{ textAlign: 'right' }}>
                    <div className="ecomd-cell__value flex items-center justify-end gap-1.5">
                      <Button
                        variant="secondary"
                        size="sm"
                        href={detailHref}
                      >
                        Chi tiết
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon="download"
                        onClick={(e) => {
                          e.stopPropagation();
                          onExportSession(session);
                        }}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
