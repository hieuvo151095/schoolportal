/**
 * Discount Policy Table Component (Miễn Giảm)
 * Design System: [DS] ECO ME DASHBOARD v1.1.0
 * Standardized with Three-Dots DropdownMenu (clean text, no icons), StatusTag, and Unified Table Card.
 */

import React, { useState } from 'react';
import { useAppDispatch } from '../../../store';
import {
  openEditModal,
  togglePolicyStatus,
  deleteDiscountPolicy,
  openBeneficiaryModal,
} from '../../../store/slices/discountSlice';
import { addToast } from '../../../store/slices/toastSlice';
import { DiscountPolicy } from '../../../types/discount';
import { formatDiscountValue } from '../../../utils/discountValidation';
import {
  IconButton,
  DropdownMenu,
  StatusTag,
  Tag,
  Icon,
  Button,
} from '../../../components/ds';

interface DiscountTableProps {
  policies: DiscountPolicy[];
}

export const DiscountTable: React.FC<DiscountTableProps> = ({ policies }) => {
  const dispatch = useAppDispatch();
  const [pendingDeletePolicy, setPendingDeletePolicy] = useState<DiscountPolicy | null>(null);

  const handleToggleStatus = (policy: DiscountPolicy) => {
    dispatch(togglePolicyStatus(policy.id));
    const nextStatus = policy.status === 'active' ? 'ngừng áp dụng' : 'kích hoạt lại';
    dispatch(
      addToast({
        type: 'info',
        message: `Đã ${nextStatus} chính sách "${policy.name}"`,
      })
    );
  };

  const handleConfirmDelete = () => {
    if (!pendingDeletePolicy) return;
    dispatch(deleteDiscountPolicy(pendingDeletePolicy.id));
    dispatch(
      addToast({
        type: 'success',
        message: `Đã xóa chính sách "${pendingDeletePolicy.name}"`,
      })
    );
    setPendingDeletePolicy(null);
  };

  const renderStatusTag = (status: DiscountPolicy['status']) => {
    switch (status) {
      case 'active':
        return <StatusTag tone="success" label="Đang hoạt động" icon={true} />;
      case 'paused':
        return <StatusTag tone="warning" label="Ngừng áp dụng" icon={true} />;
      case 'expired':
        return <StatusTag tone="neutral" label="Hết hạn" />;
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
              <th className="body-xs-semibold text-[var(--text-subtle)] is-primary" style={{ minWidth: '180px' }}>
                Chính sách
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ minWidth: '150px' }}>
                Khoản phí
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)] is-right" style={{ textAlign: 'right', width: '110px' }}>
                Mức giảm
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ textAlign: 'center', width: '130px' }}>
                Áp dụng cho
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ minWidth: '140px' }}>
                Thời hạn
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ textAlign: 'center', width: '120px' }}>
                Trạng thái
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)] is-right is-actions" style={{ textAlign: 'right', width: '70px' }}>
                <span className="sr-only">Thao tác</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {policies.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: 'var(--space-48) var(--space-16)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-8)' }}>
                    <Icon name="folder" size={36} color="var(--text-subtle)" />
                    <p className="body-sm-bold text-[var(--text-heading)] m-0">
                      Không tìm thấy chính sách miễn giảm nào phù hợp
                    </p>
                    <p className="body-xs text-[var(--text-subtle)] m-0">
                      Hãy thử thay đổi điều kiện lọc hoặc từ khóa tìm kiếm.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              policies.map((policy) => {
                const isClassScope = policy.scopeType === 'class';
                const beneficiaryCount = policy.targets.length;

                return (
                  <tr key={policy.id}>
                    {/* Name, Code, Reason */}
                    <td className="body-sm is-primary">
                      <div className="ecomd-cell__value">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                          <span className="body-sm-bold text-[var(--text-heading)]">
                            {policy.name}
                          </span>
                          <span className="body-xs font-mono text-[var(--text-subtle)]">
                            {policy.code} {policy.reason ? `• ${policy.reason}` : ''}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Fee Item */}
                    <td className="body-sm">
                      <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                        Khoản phí
                      </span>
                      <div className="ecomd-cell__value">
                        <Tag variant="default">
                          {policy.feeItemName}
                        </Tag>
                      </div>
                    </td>

                    {/* Discount Value */}
                    <td className="body-sm is-right" style={{ textAlign: 'right' }}>
                      <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                        Mức giảm
                      </span>
                      <div className="ecomd-cell__value">
                        <span
                          className="body-sm-semibold font-numeric"
                          style={{
                            color: policy.discountType === 'percent' ? 'var(--eco-blue-strong)' : 'var(--semantic-success)',
                          }}
                        >
                          {formatDiscountValue(policy.discountType, policy.discountValue)}
                        </span>
                      </div>
                    </td>

                    {/* Beneficiary Scope */}
                    <td className="body-sm" style={{ textAlign: 'center' }}>
                      <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                        Áp dụng cho
                      </span>
                      <div className="ecomd-cell__value flex justify-center">
                        <button
                          type="button"
                          onClick={() => dispatch(openBeneficiaryModal(policy))}
                          className="body-xs-medium text-[var(--text-body)] bg-[var(--bg-surface)] hover:bg-[var(--bg-muted)] border border-[var(--border-default)] px-2.5 py-1 rounded inline-flex items-center gap-1.5 cursor-pointer"
                          title="Bấm để xem chi tiết danh sách thụ hưởng"
                        >
                          <Icon
                            name={isClassScope ? 'chalkboard' : 'graduation-cap'}
                            size={13}
                            color={isClassScope ? 'var(--eco-blue-strong)' : 'var(--accent-purple)'}
                          />
                          <span>
                            {isClassScope
                              ? `${beneficiaryCount} lớp`
                              : `${beneficiaryCount} học sinh`}
                          </span>
                        </button>
                      </div>
                    </td>

                    {/* Time Period */}
                    <td className="body-sm">
                      <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                        Thời hạn
                      </span>
                      <div className="ecomd-cell__value">
                        <div className="flex items-center gap-1.5 body-xs font-numeric text-[var(--text-body)]">
                          <Icon name="calendar" size={13} color="var(--text-subtle)" />
                          <span>
                            {policy.validityType === 'academic_year'
                              ? policy.academicYearName || 'Năm học 2026 - 2027'
                              : `${policy.fromMonth} - ${policy.toMonth}`}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="body-sm" style={{ textAlign: 'center' }}>
                      <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                        Trạng thái
                      </span>
                      <div className="ecomd-cell__value flex justify-center">
                        {renderStatusTag(policy.status)}
                      </div>
                    </td>

                    {/* Actions: Standardized Three-Dots DropdownMenu (Pure Text) */}
                    <td className="body-sm is-right is-actions" style={{ textAlign: 'right' }}>
                      <div className="ecomd-cell__value flex justify-end">
                        <DropdownMenu
                          trigger={
                            <IconButton
                              icon="ellipsis-vertical"
                              label="Thao tác"
                              size="sm"
                            />
                          }
                        align="right"
                        items={[
                          {
                            label: 'Chỉnh sửa chính sách',
                            onClick: () => dispatch(openEditModal(policy)),
                          },
                          {
                            label: policy.status === 'active' ? 'Ngừng áp dụng' : 'Kích hoạt lại',
                            onClick: () => handleToggleStatus(policy),
                          },
                          { divider: true },
                          {
                            label: 'Xóa chính sách',
                            tone: 'danger',
                            onClick: () => setPendingDeletePolicy(policy),
                          },
                        ]}
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
      <div className="ecomd-table__footer">
        <div>
          Hiển thị <b>{policies.length}</b> chính sách
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {pendingDeletePolicy && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(2px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--space-16)',
          }}
        >
          <div
            style={{
              background: 'var(--bg-surface)',
              borderRadius: 'var(--radius-12)',
              maxWidth: '440px',
              width: '100%',
              padding: 'var(--space-24)',
              boxShadow: 'var(--shadow-xl)',
            }}
          >
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--text-heading)', margin: '0 0 var(--space-8)' }}>
              Xóa chính sách miễn giảm
            </h3>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', margin: '0 0 var(--space-20)' }}>
              Bạn có chắc chắn muốn xóa chính sách <b>&quot;{pendingDeletePolicy.name}&quot;</b>?
              Hành động này sẽ không thể khôi phục.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-8)' }}>
              <Button
                variant="secondary"
                onClick={() => setPendingDeletePolicy(null)}
              >
                Hủy bỏ
              </Button>
              <Button
                variant="primary"
                onClick={handleConfirmDelete}
                style={{ background: 'var(--semantic-danger)', borderColor: 'var(--semantic-danger)' }}
              >
                Xác nhận xóa
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default DiscountTable;
