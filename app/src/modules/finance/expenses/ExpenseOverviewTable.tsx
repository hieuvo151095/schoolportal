/**
 * Expense Overview Table Component
 * Design System: [DS] ECO ME DASHBOARD v1.1.0
 * Standardized with Three-Dots DropdownMenu (clean text, no icons), StatusTag, and Unified Table Card.
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { ExpenseVoucher } from '../../../types/expense';
import { formatExpenseAmount } from '../../../utils/expenseValidation';
import { Tag, StatusTag, Icon, IconButton, DropdownMenu } from '../../../components/ds';

interface ExpenseOverviewTableProps {
  vouchers: ExpenseVoucher[];
  schoolCode: string;
  onConfirmDisbursement: (voucherId: string) => void;
  onOpenCancelModal: (voucherId: string) => void;
}

export const ExpenseOverviewTable: React.FC<ExpenseOverviewTableProps> = ({
  vouchers,
  schoolCode,
  onConfirmDisbursement,
  onOpenCancelModal,
}) => {
  const totalAmount = vouchers.reduce(
    (sum, v) => sum + (v.status !== 'da_huy' ? v.totalAmount : 0),
    0
  );

  const renderStatusTag = (status: ExpenseVoucher['status']) => {
    switch (status) {
      case 'da_chi':
        return <StatusTag tone="success" label="Đã chi" icon={true} />;
      case 'da_duyet':
        return <StatusTag tone="info" label="Đã duyệt" icon={true} />;
      case 'da_tao':
        return <StatusTag tone="neutral" label="Bản nháp" icon="pencil" />;
      case 'da_huy':
        return <StatusTag tone="neutral" label="Đã hủy" icon="ban" />;
      default:
        return <StatusTag tone="neutral" label={status} />;
    }
  };

  return (
    <>
      <div className="ecomd-table-scroll">
        <table className="ecomd-table ecomd-table--dense w-full">
          <thead>
            <tr>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ width: '130px' }}>
                Mã phiếu
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)] is-primary" style={{ minWidth: '240px' }}>
                Tên phiếu chi &amp; danh mục
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ width: '110px' }}>
                Loại phiếu
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ minWidth: '200px' }}>
                Chi cho / người nhận
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)] is-right" style={{ textAlign: 'right', minWidth: '130px' }}>
                Tổng tiền (đ)
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ minWidth: '110px' }}>
                Ngày lập
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ textAlign: 'center', width: '120px' }}>
                Trạng thái
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)] is-right is-actions" style={{ textAlign: 'right', width: '80px' }}>
                <span className="sr-only">Thao tác</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {vouchers.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  style={{
                    padding: 'var(--space-48) var(--space-16)',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-8)' }}>
                    <Icon name="folder" size={36} color="var(--text-subtle)" />
                    <p style={{ fontWeight: 'var(--font-bold)', color: 'var(--text-heading)', margin: 0 }}>
                      Không có phiếu chi nào trong kỳ này
                    </p>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-subtle)', margin: 0 }}>
                      Hãy chọn tháng khác hoặc bấm &quot;Thêm phiếu chi&quot; để lập phiếu mới.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              vouchers.map((voucher) => {
                const detailHref = `/${schoolCode}/school/expenses/${voucher.id}`;

                const menuItems: Array<{ label: string; onClick?: () => void; href?: string; tone?: 'default' | 'danger'; divider?: boolean }> = [
                  {
                    label: 'Xem chi tiết',
                    href: detailHref,
                  },
                ];

                if (voucher.status === 'da_duyet') {
                  menuItems.push({
                    label: 'Xác nhận giải ngân',
                    onClick: () => onConfirmDisbursement(voucher.id),
                  });
                }

                if (voucher.status !== 'da_chi' && voucher.status !== 'da_huy') {
                  menuItems.push(
                    { divider: true, label: '' },
                    {
                      label: 'Hủy phiếu chi',
                      tone: 'danger',
                      onClick: () => onOpenCancelModal(voucher.id),
                    }
                  );
                }

                return (
                  <tr key={voucher.id}>
                    {/* Code */}
                    <td className="body-sm">
                      <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                        Mã phiếu
                      </span>
                      <div className="ecomd-cell__value">
                        <Link
                          href={detailHref}
                          className="body-xs font-mono text-[var(--eco-blue-strong)] hover:underline"
                        >
                          {voucher.voucherCode}
                        </Link>
                      </div>
                    </td>

                    {/* Title & Category */}
                    <td className="body-sm is-primary">
                      <div className="ecomd-cell__value">
                        <Link
                          href={detailHref}
                          className="body-sm-bold text-[var(--text-heading)] hover:text-[var(--eco-blue-strong)] hover:underline inline-block"
                        >
                          {voucher.title}
                        </Link>
                        <div className="body-xs text-[var(--text-subtle)] mt-0.5">
                          Danh mục: {voucher.categoryName}
                        </div>
                      </div>
                    </td>

                    {/* Type */}
                    <td className="body-sm">
                      <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                        Loại phiếu
                      </span>
                      <div className="ecomd-cell__value">
                        <Tag variant="code">
                          {voucher.voucherType === 'hoan_tien' ? 'Hoàn tiền' : 'Chi khác'}
                        </Tag>
                      </div>
                    </td>

                    {/* Beneficiary */}
                    <td className="body-sm">
                      <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                        Chi cho
                      </span>
                      <div className="ecomd-cell__value">
                        <div className="body-sm text-[var(--text-heading)]">
                          {voucher.targetName}
                          {voucher.targetSubInfo ? (
                            <span className="body-xs text-[var(--text-subtle)] ml-1">
                              ({voucher.targetSubInfo})
                            </span>
                          ) : null}
                        </div>
                        <div className="body-xs text-[var(--text-subtle)] mt-0.5">
                          {voucher.targetType === 'hoc_sinh' ? `PH: ${voucher.recipientName}` : voucher.recipientName}
                          {voucher.recipientPhone ? ` • ${voucher.recipientPhone}` : ''}
                        </div>
                      </div>
                    </td>

                    {/* Total Amount */}
                    <td className="body-sm is-right" style={{ textAlign: 'right' }}>
                      <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                        Tổng tiền
                      </span>
                      <div className="ecomd-cell__value">
                        <span className="body-sm-semibold font-numeric text-[var(--text-heading)]">
                          {formatExpenseAmount(voucher.totalAmount)}
                        </span>
                      </div>
                    </td>

                    {/* Created Date */}
                    <td className="body-sm">
                      <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                        Ngày lập
                      </span>
                      <div className="ecomd-cell__value">
                        <span className="body-xs font-numeric text-[var(--text-subtle)]">
                          {voucher.createdDate}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="body-sm" style={{ textAlign: 'center' }}>
                      <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                        Trạng thái
                      </span>
                      <div className="ecomd-cell__value flex justify-center">
                        {renderStatusTag(voucher.status)}
                      </div>
                    </td>

                    {/* Actions: Standardized Three-Dots DropdownMenu (Pure Text) */}
                    <td className="body-sm is-right is-actions" style={{ textAlign: 'right' }}>
                      <div className="ecomd-cell__value flex justify-end">
                        <DropdownMenu
                          trigger={
                            <IconButton
                              icon="ellipsis-vertical"
                              label="Thao tác phiếu chi"
                              size="sm"
                            />
                          }
                        align="right"
                        items={menuItems.map((item) =>
                          item.divider
                            ? { divider: true }
                            : {
                                label: item.label,
                                href: item.href,
                                onClick: item.onClick,
                                tone: item.tone,
                              }
                        )}
                      />
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      {vouchers.length > 0 && (
        <div className="ecomd-table__footer">
          <div>
            Hiển thị <b>{vouchers.length}</b> phiếu chi
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)' }}>
            <span>Tổng số tiền:</span>
            <b
              style={{
                color: 'var(--text-heading)',
                fontVariantNumeric: 'tabular-nums',
                fontSize: 'var(--text-sm)',
              }}
            >
              {formatExpenseAmount(totalAmount)}
            </b>
          </div>
        </div>
      )}
    </>
  );
};
export default ExpenseOverviewTable;
