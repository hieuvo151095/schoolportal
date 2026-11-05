/**
 * Fee Overview Table Component (Multi-Header Class Matrix)
 * Design System: [DS] ECO ME DASHBOARD v1.1.0
 */

import React from 'react';
import Link from 'next/link';
import type { ClassFeeOverviewRow } from '../../../types/feeReport';
import { formatFeeReportCurrency } from '../../../utils/feeReportValidation';
import { Tag } from '../../../components/ds';

interface FeeOverviewTableProps {
  rows: ClassFeeOverviewRow[];
  totals: ClassFeeOverviewRow;
  schoolCode: string;
}

export const FeeOverviewTable: React.FC<FeeOverviewTableProps> = ({
  rows,
  totals,
  schoolCode,
}) => {
  return (
    <div className="ecomd-table-card">
      <div className="ecomd-table-scroll">
        <table className="ecomd-table ecomd-table--dense w-full">
          <thead>
            {/* Top Multi-Header Row */}
            <tr
              style={{
                background: 'var(--bg-subtle)',
                color: 'var(--text-heading)',
                borderBottom: '1px solid var(--border-default)',
              }}
            >
              <th
                rowSpan={2}
                className="body-xs-semibold text-[var(--text-subtle)] is-primary"
                style={{ verticalAlign: 'bottom', borderRight: '1px solid var(--border-default)', minWidth: '150px' }}
              >
                Lớp học
              </th>
              <th
                colSpan={2}
                className="body-xs-semibold"
                style={{ padding: '8px 12px', textAlign: 'center', borderRight: '1px solid var(--border-default)', background: 'var(--semantic-info-soft)', color: 'var(--eco-blue-strong)' }}
              >
                Phiếu thu (tổng)
              </th>
              <th
                colSpan={2}
                className="body-xs-semibold"
                style={{ padding: '8px 12px', textAlign: 'center', borderRight: '1px solid var(--border-default)', background: 'var(--semantic-success-soft)', color: 'var(--semantic-success)' }}
              >
                Đã thu
              </th>
              <th
                colSpan={2}
                className="body-xs-semibold"
                style={{ padding: '8px 12px', textAlign: 'center', borderRight: '1px solid var(--border-default)', background: 'var(--semantic-warning-soft)', color: 'var(--semantic-warning)' }}
              >
                Đã thu 1 phần
              </th>
              <th
                colSpan={2}
                className="body-xs-semibold"
                style={{ padding: '8px 12px', textAlign: 'center', borderRight: '1px solid var(--border-default)', background: 'var(--semantic-danger-soft)', color: 'var(--semantic-danger)' }}
              >
                Chưa thu
              </th>
              <th
                rowSpan={2}
                className="body-xs-semibold text-[var(--text-subtle)]"
                style={{ verticalAlign: 'bottom', padding: '12px 16px', textAlign: 'right', borderRight: '1px solid var(--border-default)', minWidth: '120px' }}
              >
                Còn lại
              </th>
              <th
                rowSpan={2}
                className="body-xs-semibold text-[var(--text-subtle)]"
                style={{ verticalAlign: 'bottom', padding: '12px 16px', textAlign: 'center', minWidth: '130px' }}
              >
                Tỉ lệ thu (%)
              </th>
            </tr>
            {/* Sub-Header Row */}
            <tr
              style={{
                background: 'var(--bg-subtle)',
                borderBottom: '1px solid var(--border-default)',
              }}
            >
              {/* Phiếu thu */}
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ padding: '8px', textAlign: 'center', borderRight: '1px solid var(--border-default)', width: '64px' }}>Số lượng</th>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ padding: '8px 12px', textAlign: 'right', borderRight: '1px solid var(--border-default)', minWidth: '110px' }}>Thành tiền</th>
              {/* Đã thu */}
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ padding: '8px', textAlign: 'center', borderRight: '1px solid var(--border-default)', width: '64px' }}>Số lượng</th>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ padding: '8px 12px', textAlign: 'right', borderRight: '1px solid var(--border-default)', minWidth: '110px' }}>Thành tiền</th>
              {/* Đã thu 1 phần */}
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ padding: '8px', textAlign: 'center', borderRight: '1px solid var(--border-default)', width: '64px' }}>Số lượng</th>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ padding: '8px 12px', textAlign: 'right', borderRight: '1px solid var(--border-default)', minWidth: '110px' }}>Thành tiền</th>
              {/* Chưa thu */}
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ padding: '8px', textAlign: 'center', borderRight: '1px solid var(--border-default)', width: '64px' }}>Số lượng</th>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ padding: '8px 12px', textAlign: 'right', borderRight: '1px solid var(--border-default)', minWidth: '110px' }}>Thành tiền</th>
            </tr>
          </thead>

          <tbody style={{ color: 'var(--text-heading)' }}>
            {rows.map((row) => {
              const isArchived = row.isArchivedGroup;
              return (
                <tr
                  key={row.classId}
                  style={{
                    borderBottom: '1px solid var(--border-subtle)',
                    background: isArchived ? 'var(--bg-subtle)' : 'transparent',
                    transition: 'background 0.15s ease',
                  }}
                >
                  {/* Class Name */}
                  <td className="body-sm is-primary" style={{ padding: '10px 16px', borderRight: '1px solid var(--border-default)' }}>
                    {isArchived ? (
                      <span className="body-sm text-[var(--text-subtle)] italic">
                        {row.className}
                      </span>
                    ) : (
                      <Link
                        href={`/${schoolCode}/reports/fee?classId=${row.classId}`}
                        className="body-sm-bold text-[var(--eco-blue-strong)] hover:underline inline-block"
                      >
                        {row.className}
                      </Link>
                    )}
                  </td>

                  {/* Total Invoices */}
                  <td className="body-sm font-numeric" style={{ padding: '10px 8px', textAlign: 'center', borderRight: '1px solid var(--border-default)' }}>
                    {row.totalInvoices}
                  </td>
                  <td className="body-sm font-numeric" style={{ padding: '10px 12px', textAlign: 'right', borderRight: '1px solid var(--border-default)' }}>
                    {formatFeeReportCurrency(row.totalAmount)}
                  </td>

                  {/* Paid */}
                  <td className="body-sm font-numeric text-[var(--semantic-success)]" style={{ padding: '10px 8px', textAlign: 'center', borderRight: '1px solid var(--border-default)' }}>
                    {row.paidCount}
                  </td>
                  <td className="body-sm font-numeric text-[var(--semantic-success)] font-semibold" style={{ padding: '10px 12px', textAlign: 'right', borderRight: '1px solid var(--border-default)' }}>
                    {formatFeeReportCurrency(row.paidAmount)}
                  </td>

                  {/* Partial */}
                  <td className="body-sm font-numeric text-[var(--semantic-warning)]" style={{ padding: '10px 8px', textAlign: 'center', borderRight: '1px solid var(--border-default)' }}>
                    {row.partialCount}
                  </td>
                  <td className="body-sm font-numeric text-[var(--semantic-warning)]" style={{ padding: '10px 12px', textAlign: 'right', borderRight: '1px solid var(--border-default)' }}>
                    {formatFeeReportCurrency(row.partialAmount)}
                  </td>

                  {/* Unpaid */}
                  <td className="body-sm font-numeric text-[var(--semantic-danger)]" style={{ padding: '10px 8px', textAlign: 'center', borderRight: '1px solid var(--border-default)' }}>
                    {row.unpaidCount}
                  </td>
                  <td className="body-sm font-numeric text-[var(--semantic-danger)]" style={{ padding: '10px 12px', textAlign: 'right', borderRight: '1px solid var(--border-default)' }}>
                    {formatFeeReportCurrency(row.unpaidAmount)}
                  </td>

                  {/* Remaining */}
                  <td className="body-sm-semibold font-numeric text-[var(--semantic-danger)]" style={{ padding: '10px 16px', textAlign: 'right', borderRight: '1px solid var(--border-default)' }}>
                    {formatFeeReportCurrency(row.remainingAmount)}
                  </td>

                  {/* Completion Rate */}
                  <td className="body-sm" style={{ padding: '10px 16px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-8)' }}>
                      <div
                        style={{
                          flex: 1,
                          height: '6px',
                          background: 'var(--bg-muted)',
                          borderRadius: '9999px',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            height: '100%',
                            width: `${Math.min(row.collectionRate, 100)}%`,
                            background: row.collectionRate >= 80 ? 'var(--semantic-success)' : row.collectionRate >= 50 ? 'var(--semantic-warning)' : 'var(--semantic-danger)',
                            borderRadius: '9999px',
                          }}
                        />
                      </div>
                      <span
                        className="body-xs-semibold font-numeric"
                        style={{
                          width: '42px',
                          textAlign: 'right',
                          color: row.collectionRate >= 80 ? 'var(--semantic-success)' : 'var(--text-heading)',
                        }}
                      >
                        {row.collectionRate}%
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>

          {/* Totals Footer Row */}
          <tfoot>
            <tr
              style={{
                background: 'var(--bg-subtle)',
                fontWeight: 600,
                borderTop: '2px solid var(--border-default)',
                color: 'var(--text-heading)',
              }}
            >
              <td className="body-sm-bold is-primary" style={{ padding: '12px 16px', borderRight: '1px solid var(--border-default)' }}>
                {totals.className}
              </td>

              {/* Total Invoices */}
              <td className="body-sm font-numeric font-semibold" style={{ padding: '12px 8px', textAlign: 'center', borderRight: '1px solid var(--border-default)' }}>
                {totals.totalInvoices}
              </td>
              <td className="body-sm font-numeric font-semibold" style={{ padding: '12px 12px', textAlign: 'right', borderRight: '1px solid var(--border-default)' }}>
                {formatFeeReportCurrency(totals.totalAmount)}
              </td>

              {/* Paid */}
              <td className="body-sm font-numeric font-semibold text-[var(--semantic-success)]" style={{ padding: '12px 8px', textAlign: 'center', borderRight: '1px solid var(--border-default)' }}>
                {totals.paidCount}
              </td>
              <td className="body-sm font-numeric font-semibold text-[var(--semantic-success)]" style={{ padding: '12px 12px', textAlign: 'right', borderRight: '1px solid var(--border-default)' }}>
                {formatFeeReportCurrency(totals.paidAmount)}
              </td>

              {/* Partial */}
              <td className="body-sm font-numeric font-semibold text-[var(--semantic-warning)]" style={{ padding: '12px 8px', textAlign: 'center', borderRight: '1px solid var(--border-default)' }}>
                {totals.partialCount}
              </td>
              <td className="body-sm font-numeric font-semibold text-[var(--semantic-warning)]" style={{ padding: '12px 12px', textAlign: 'right', borderRight: '1px solid var(--border-default)' }}>
                {formatFeeReportCurrency(totals.partialAmount)}
              </td>

              {/* Unpaid */}
              <td className="body-sm font-numeric font-semibold text-[var(--semantic-danger)]" style={{ padding: '12px 8px', textAlign: 'center', borderRight: '1px solid var(--border-default)' }}>
                {totals.unpaidCount}
              </td>
              <td className="body-sm font-numeric font-semibold text-[var(--semantic-danger)]" style={{ padding: '12px 12px', textAlign: 'right', borderRight: '1px solid var(--border-default)' }}>
                {formatFeeReportCurrency(totals.unpaidAmount)}
              </td>

              {/* Remaining */}
              <td className="body-sm-bold font-numeric text-[var(--semantic-danger)]" style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid var(--border-default)' }}>
                {formatFeeReportCurrency(totals.remainingAmount)}
              </td>

              {/* Rate */}
              <td className="body-sm font-numeric" style={{ padding: '12px 16px', textAlign: 'center' }}>
                <Tag variant={totals.collectionRate >= 80 ? 'success' : 'warning'}>
                  {totals.collectionRate}%
                </Tag>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default FeeOverviewTable;
