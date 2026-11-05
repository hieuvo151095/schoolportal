/**
 * Invoice Roster Table Component
 * Student-centric tuition billing roster with month picker, class filter,
 * dynamic batch action toolbar, and status-dependent action buttons.
 * Governance: Marcus Fleet V34 / Constitution V1.0.0
 * Design System: [DS] ECO ME DASHBOARD v1.1.0
 * References: docs_legacy/operating-portal/tai-chinh/hoc-phi.md (BR01, BR02, BR03, BR04, BR11)
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  setSelectedMonth,
  setSelectedClassId,
  toggleSelectInvoice,
  toggleSelectAllInvoices,
  clearSelectedInvoices,
  setFilterCriteria,
  setDateFilterType,
  setCreatedDateRange,
  setFilterModalOpen,
  setPaymentModalOpen,
  setCancelModalOpen,
  sendInvoices,
  deleteDraftInvoices,
} from '../../../store/slices/invoiceSlice';
import { mockFeeClasses } from '../../../services/mockInvoiceData';
import {
  formatVND,
  getPermittedActions,
  getPermittedBatchActions,
  filterInvoices,
} from '../../../utils/invoiceValidation';
import { InvoiceLifecycleStatus } from '../../../types/invoice';
import {
  StatCard,
  FilterBar,
  Button,
  IconButton,
  DropdownMenu,
  BulkActionBar,
  Tag,
  StatusTag,
  Avatar,
  Checkbox,
  Icon,
} from '../../../components/ds';

export const InvoiceRosterTable: React.FC = () => {
  const router = useRouter();
  const schoolCode = (router.query.schoolCode as string) || 'demo';
  const dispatch = useAppDispatch();

  const {
    invoices,
    students,
    selectedClassId,
    selectedInvoiceIds,
    filterCriteria,
  } = useAppSelector((state) => state.invoice);

  const [isDateRangeOpen, setIsDateRangeOpen] = useState(false);

  const formatDateDisplay = (dateStr?: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  };

  // Filter invoices for current criteria
  const filteredInvoices = filterInvoices(invoices, filterCriteria);

  // Students belonging to current class
  const classStudents = students.filter((s) => s.classId === selectedClassId);

  // Pair each student with their invoice in the filtered set
  const studentRows = classStudents
    .map((student) => {
      const invoice = filteredInvoices.find(
        (inv) => inv.studentId === student.studentId
      );
      return {
        student,
        invoice,
      };
    })
    .filter((row) => {
      // If a search query or filter is active, filter rows accordingly
      if (filterCriteria.searchKeyword && filterCriteria.searchKeyword.trim()) {
        const q = filterCriteria.searchKeyword.trim().toLowerCase();
        const matchStudent =
          row.student.studentName.toLowerCase().includes(q) ||
          row.student.studentCode.toLowerCase().includes(q);
        const matchInvoice =
          row.invoice &&
          (row.invoice.invoiceNo.toLowerCase().includes(q) ||
            row.invoice.title.toLowerCase().includes(q));
        return matchStudent || matchInvoice;
      }
      // If status filter is not 'tat_ca', only show rows that match the invoice status
      if (filterCriteria.status && filterCriteria.status !== 'tat_ca') {
        return row.invoice?.status === filterCriteria.status;
      }
      return true;
    });

  // Selected invoices objects
  const selectedInvoices = invoices.filter((i) =>
    selectedInvoiceIds.includes(i.id)
  );
  const permittedBatchActions = getPermittedBatchActions(selectedInvoices);

  // Available invoice IDs in current view for "Select All"
  const selectableInvoiceIds = studentRows
    .filter((r) => r.invoice !== undefined)
    .map((r) => r.invoice!.id);

  const allSelected =
    selectableInvoiceIds.length > 0 &&
    selectableInvoiceIds.every((id) => selectedInvoiceIds.includes(id));

  // Handler for batch actions
  const handleBatchSend = () => {
    dispatch(sendInvoices(selectedInvoiceIds));
  };

  const handleBatchDelete = () => {
    if (
      confirm(
        `Bạn có chắc chắn muốn xóa ${selectedInvoiceIds.length} hóa đơn nháp đã chọn?`
      )
    ) {
      dispatch(deleteDraftInvoices(selectedInvoiceIds));
    }
  };

  const handleBatchPay = () => {
    if (selectedInvoices.length === 1) {
      dispatch(
        setPaymentModalOpen({ isOpen: true, invoice: selectedInvoices[0] })
      );
    } else {
      alert(
        `Chức năng ghi nhận thanh toán hàng loạt cho ${selectedInvoiceIds.length} hóa đơn.`
      );
    }
  };

  // Helper for DS StatusTag
  const renderStatusTag = (status?: InvoiceLifecycleStatus) => {
    if (!status) {
      return <StatusTag tone="neutral" label="Chưa có hóa đơn" />;
    }

    switch (status) {
      case 'da_tao':
        return <StatusTag tone="neutral" label="Bản nháp" icon={true} />;
      case 'da_gui':
        return <StatusTag tone="info" label="Đã gửi" icon={true} />;
      case 'da_thanh_toan':
        return <StatusTag tone="success" label="Đã thanh toán" icon={true} />;
      case 'thanh_toan_mot_phan':
        return <StatusTag tone="warning" label="Thanh toán một phần" icon={true} />;
      case 'qua_han':
        return <StatusTag tone="danger" label="Quá hạn" icon={true} />;
      case 'da_huy':
        return <StatusTag tone="neutral" label="Đã hủy" icon={true} />;
      default:
        return null;
    }
  };

  // KPI calculations
  const totalBilled = filteredInvoices
    .filter((inv) => inv.status !== 'da_huy')
    .reduce((sum, inv) => sum + inv.totalAmount, 0);

  const totalCollected = filteredInvoices.reduce(
    (sum, inv) => sum + inv.paidAmount,
    0
  );

  const totalRemaining = filteredInvoices
    .filter((inv) => inv.status !== 'da_huy')
    .reduce((sum, inv) => sum + inv.remainingAmount, 0);

  const overdueCount = filteredInvoices.filter(
    (inv) => inv.status === 'qua_han'
  ).length;

  return (
    <div
      className="space-y-5"
      onClick={() => {
        setIsDateRangeOpen(false);
      }}
    >
      {/* 4 StatCards */}
      <div
        className="ecomd-stat-group"
        style={{ '--ecomd-cols': 4 } as React.CSSProperties}
      >
        <StatCard
          label="Tổng phải thu"
          value={formatVND(totalBilled)}
          tone="info"
          icon="receipt"
        />
        <StatCard
          label="Đã thu thực tế"
          value={formatVND(totalCollected)}
          tone="success"
          icon="circle-check"
        />
        <StatCard
          label="Còn phải thu"
          value={formatVND(totalRemaining)}
          tone="warning"
          icon="clock"
        />
        <StatCard
          label="Hóa đơn quá hạn"
          value={overdueCount}
          tone={overdueCount > 0 ? 'warning' : 'neutral'}
          icon="triangle-exclamation"
        />
      </div>

      {/* Unified Table Card */}
      <div className="ecomd-table-card">
        {/* Filter Bar */}
        <FilterBar
          search={{
            placeholder: 'Tên học sinh, mã HS, số HĐ...',
            value: filterCriteria.searchKeyword || '',
            onChange: (val) => dispatch(setFilterCriteria({ searchKeyword: val })),
          }}
          filters={[
            {
              options: mockFeeClasses.map((cls) => ({
                label: `${cls.name} (${cls.gradeLevel})`,
                value: cls.id,
              })),
              value: selectedClassId,
              onChange: (val) => dispatch(setSelectedClassId(val)),
            },
            {
              options: [
                { label: 'Thời gian tạo HĐ', value: 'createdAt' },
                { label: 'Hạn đóng HĐ', value: 'dueDate' },
              ],
              value: filterCriteria.dateFilterType || 'createdAt',
              onChange: (val) =>
                dispatch(setDateFilterType(val as 'createdAt' | 'dueDate')),
            },
          ]}
          advanced={{
            label: 'Lọc mở rộng',
            active:
              filterCriteria.status !== 'tat_ca' ||
              filterCriteria.paymentMethod !== 'tat_ca' ||
              filterCriteria.hasDeduction !== null,
            onClick: () => dispatch(setFilterModalOpen(true)),
          }}
        >
          {/* Date range popover button */}
          <div style={{ position: 'relative' }}>
            <Button
              variant="secondary"
              icon="calendar"
              onClick={(e) => {
                e.stopPropagation();
                setIsDateRangeOpen(!isDateRangeOpen);
              }}
            >
              {formatDateDisplay(filterCriteria.createdDateFrom)} -{' '}
              {formatDateDisplay(filterCriteria.createdDateTo)}
            </Button>

            {isDateRangeOpen && (
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 4px)',
                  right: 0,
                  zIndex: 50,
                  width: '280px',
                  padding: 'var(--space-12)',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-8)',
                  boxShadow: 'var(--shadow-lg)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-8)',
                }}
              >
                <div style={{ fontWeight: 600, fontSize: '12px', color: 'var(--text-heading)' }}>
                  Chọn khoảng thời gian
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-subtle)', marginBottom: '4px' }}>
                    Từ ngày
                  </label>
                  <input
                    type="date"
                    value={filterCriteria.createdDateFrom || ''}
                    onChange={(e) =>
                      dispatch(setCreatedDateRange({ from: e.target.value }))
                    }
                    style={{
                      width: '100%',
                      height: '32px',
                      padding: '0 var(--space-8)',
                      border: '1px solid var(--border-default)',
                      borderRadius: 'var(--radius-6)',
                      fontSize: '12px',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-subtle)', marginBottom: '4px' }}>
                    Đến ngày
                  </label>
                  <input
                    type="date"
                    value={filterCriteria.createdDateTo || ''}
                    onChange={(e) =>
                      dispatch(setCreatedDateRange({ to: e.target.value }))
                    }
                    style={{
                      width: '100%',
                      height: '32px',
                      padding: '0 var(--space-8)',
                      border: '1px solid var(--border-default)',
                      borderRadius: 'var(--radius-6)',
                      fontSize: '12px',
                    }}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: 'var(--space-8)',
                    borderTop: '1px solid var(--border-default)',
                  }}
                >
                  <Button
                    variant="text"
                    size="sm"
                    onClick={() =>
                      dispatch(
                        setCreatedDateRange({
                          from: '2026-09-01',
                          to: '2026-09-30',
                        })
                      )
                    }
                  >
                    Tháng 9/2026
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setIsDateRangeOpen(false)}
                  >
                    Đóng
                  </Button>
                </div>
              </div>
            )}
          </div>
        </FilterBar>

        {/* Canonical DS Bulk Action Bar */}
        <BulkActionBar
          selectedCount={selectedInvoiceIds.length}
          totalCount={selectableInvoiceIds.length}
          onClearSelection={() => dispatch(clearSelectedInvoices())}
        >
          {permittedBatchActions.includes('send') && (
            <Button variant="secondary" icon="paper-plane" size="sm" onClick={handleBatchSend}>
              Gửi hóa đơn ({selectedInvoiceIds.length})
            </Button>
          )}
          {permittedBatchActions.includes('pay') && (
            <Button variant="secondary" icon="circle-check" size="sm" onClick={handleBatchPay}>
              Xác nhận thanh toán
            </Button>
          )}
          {permittedBatchActions.includes('delete') && (
            <Button variant="secondary" icon="trash" size="sm" onClick={handleBatchDelete}>
              Xóa bản nháp ({selectedInvoiceIds.length})
            </Button>
          )}
        </BulkActionBar>

        {/* Main Student-Centric Table */}
        <div className="ecomd-table-scroll">
          <table className="ecomd-table ecomd-table--dense w-full">
            <thead>
              <tr>
                <th className="is-check" style={{ width: '48px', textAlign: 'center' }}>
                  <Checkbox
                    checked={allSelected}
                    onChange={() =>
                      dispatch(toggleSelectAllInvoices(selectableInvoiceIds))
                    }
                  />
                </th>
                <th className="body-xs-semibold text-[var(--text-subtle)] is-primary">Học sinh</th>
                <th className="body-xs-semibold text-[var(--text-subtle)]">Thông tin hóa đơn</th>
                <th className="body-xs-semibold text-[var(--text-subtle)]">Người tạo</th>
                <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ textAlign: 'center' }}>Trạng thái</th>
                <th className="body-xs-semibold text-[var(--text-subtle)] is-right" style={{ textAlign: 'right' }}>Số tiền</th>
                <th className="body-xs-semibold text-[var(--text-subtle)] is-right is-actions" style={{ textAlign: 'right', width: '80px' }}>
                  <span className="sr-only">Thao tác</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {studentRows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="ecomd-empty is-italic" style={{ padding: '48px 16px', textAlign: 'center' }}>
                    Không tìm thấy dữ liệu học sinh hoặc hóa đơn phù hợp.
                  </td>
                </tr>
              ) : (
                studentRows.map(({ student, invoice }) => {
                  const isSelected = invoice
                    ? selectedInvoiceIds.includes(invoice.id)
                    : false;
                  const permittedActions = invoice
                    ? getPermittedActions(invoice.status)
                    : [];

                  return (
                    <tr
                      key={student.studentId}
                      className={isSelected ? 'is-selected' : undefined}
                      style={isSelected ? { background: 'var(--bg-selected)' } : undefined}
                    >
                      {/* Checkbox */}
                      <td className="is-check" style={{ textAlign: 'center' }}>
                        {invoice ? (
                          <Checkbox
                            checked={isSelected}
                            onChange={() =>
                              dispatch(toggleSelectInvoice(invoice.id))
                            }
                          />
                        ) : (
                          <span style={{ opacity: 0.3 }}>—</span>
                        )}
                      </td>

                      {/* Student Profile */}
                      <td className="body-sm is-primary">
                        <div className="ecomd-cell__value">
                          <div className="ecomd-person">
                            <Avatar
                              name={student.studentName}
                              src={student.avatar}
                              size="md"
                            />
                            <div>
                              <div className="body-sm-bold text-[var(--text-heading)]">
                                {student.studentName}
                              </div>
                              <div className="body-xs font-mono text-[var(--text-subtle)]">
                                {student.studentCode} • {student.className}
                              </div>
                              <div className="body-xs text-[var(--text-subtle)] mt-0.5">
                                PH: {student.parentName}
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Invoice Details */}
                      <td className="body-sm">
                        <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                          Hóa đơn
                        </span>
                        <div className="ecomd-cell__value">
                          {invoice ? (
                            <div>
                              <Link
                                href={`/${schoolCode}/school/fee/${invoice.id}`}
                                className="body-sm-bold text-[var(--text-heading)] hover:text-[var(--eco-blue-strong)] hover:underline inline-block"
                              >
                                {invoice.title}
                              </Link>
                              <div className="flex items-center gap-1.5 mt-1">
                                <Tag variant="code">{invoice.invoiceNo}</Tag>
                                {invoice.exportElectronicInvoice && (
                                  <Tag variant="success">HĐĐT</Tag>
                                )}
                              </div>
                              <div className="body-xs text-[var(--text-subtle)] mt-1">
                                Hạn:{' '}
                                <span className="font-numeric text-[var(--text-body)]">
                                  {invoice.dueDate}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="body-xs text-[var(--text-subtle)] italic">
                                Không có hóa đơn
                              </span>
                              <Link
                                href={`/${schoolCode}/school/fee/create`}
                                className="body-xs-semibold text-[var(--eco-blue-strong)] bg-[var(--bg-muted)] px-2 py-0.5 rounded hover:underline"
                              >
                                + Lập HĐ
                              </Link>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Creator */}
                      <td className="body-sm">
                        <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                          Người tạo
                        </span>
                        <div className="ecomd-cell__value">
                          {invoice ? (
                            <div>
                              <div className="body-sm text-[var(--text-body)]">
                                {invoice.createdBy}
                              </div>
                              <div className="body-xs font-numeric text-[var(--text-subtle)] mt-0.5">
                                {invoice.issueDate}
                              </div>
                            </div>
                          ) : (
                            <span className="text-[var(--text-subtle)]">—</span>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="body-sm" style={{ textAlign: 'center' }}>
                        <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                          Trạng thái
                        </span>
                        <div className="ecomd-cell__value">
                          <div className="flex flex-col items-center gap-1">
                            {renderStatusTag(invoice?.status)}
                            {invoice?.status === 'thanh_toan_mot_phan' && (
                              <div className="body-xs font-numeric text-[var(--semantic-warning)] font-medium">
                                Đã nộp: {formatVND(invoice.paidAmount)}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="body-sm is-right" style={{ textAlign: 'right' }}>
                        <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                          Số tiền
                        </span>
                        <div className="ecomd-cell__value">
                          {invoice ? (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
                              <div className="body-sm-semibold font-numeric text-[var(--text-heading)]">
                                {formatVND(invoice.totalAmount)}
                              </div>
                              {invoice.status === 'thanh_toan_mot_phan' && (
                                <div className="body-xs font-numeric text-[var(--semantic-danger)]">
                                  Còn lại: {formatVND(invoice.remainingAmount)}
                                </div>
                              )}
                              {invoice.discountTotal > 0 && (
                                <div className="body-xs font-numeric text-[var(--semantic-success)]">
                                  Giảm trừ: -{formatVND(invoice.discountTotal)}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-[var(--text-subtle)]">—</span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="body-sm is-right is-actions" style={{ textAlign: 'right' }}>
                        <div className="ecomd-cell__value flex justify-end">
                          {invoice ? (
                            <DropdownMenu
                              trigger={
                                <IconButton
                                  icon="ellipsis-vertical"
                                  label="Thao tác"
                                  size="sm"
                                />
                              }
                              items={[
                                {
                                  label: 'Xem chi tiết',
                                  href: `/${schoolCode}/school/fee/${invoice.id}`,
                                },
                                ...(permittedActions.includes('edit')
                                  ? [
                                      {
                                        label: 'Chỉnh sửa hóa đơn',
                                        href: `/${schoolCode}/school/fee/edit/${invoice.id}`,
                                      },
                                    ]
                                  : []),
                                ...(permittedActions.includes('pay')
                                  ? [
                                      {
                                        label: 'Ghi nhận thanh toán',
                                        onClick: () =>
                                          dispatch(
                                            setPaymentModalOpen({ isOpen: true, invoice })
                                          ),
                                      },
                                    ]
                                  : []),
                                ...(permittedActions.includes('send')
                                  ? [
                                      {
                                        label: 'Gửi thông báo phụ huynh',
                                        onClick: () => dispatch(sendInvoices([invoice.id])),
                                      },
                                    ]
                                  : []),
                                ...(permittedActions.includes('cancel')
                                  ? [
                                      { divider: true as const },
                                      {
                                        label: 'Hủy hóa đơn',
                                        tone: 'danger' as const,
                                        onClick: () =>
                                          dispatch(
                                            setCancelModalOpen({ isOpen: true, invoice })
                                          ),
                                      },
                                    ]
                                  : []),
                                ...(permittedActions.includes('delete')
                                  ? [
                                      { divider: true as const },
                                      {
                                        label: 'Xóa bản nháp',
                                        tone: 'danger' as const,
                                        onClick: () =>
                                          dispatch(deleteDraftInvoices([invoice.id])),
                                      },
                                    ]
                                  : []),
                              ]}
                            />
                          ) : (
                            <span className="text-[var(--text-subtle)]">—</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info bar */}
        <div className="ecomd-table__footer">
          <div>
            Hiển thị <b>{studentRows.length}</b> / <b>{classStudents.length}</b> học sinh
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-16)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}>
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--semantic-success)',
                }}
              />
              Đã thu:{' '}
              <b
                style={{
                  color: 'var(--text-heading)',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {formatVND(totalCollected)}
              </b>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}>
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--semantic-danger)',
                }}
              />
              Còn phải thu:{' '}
              <b
                style={{
                  color: 'var(--text-heading)',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {formatVND(totalRemaining)}
              </b>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
