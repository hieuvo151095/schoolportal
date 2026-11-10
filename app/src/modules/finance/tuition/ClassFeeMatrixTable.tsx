/**
 * Class Fee Matrix Table Component (Ma Trận Học Sinh x Khoản Phí Theo Lớp)
 * Route: /[schoolCode]/school/tuition-management/[classId]
 * Legacy Reference: docs_legacy/operating-portal/tai-chinh/quan-ly-hoc-phi.md (BR02-BR10)
 * Design System: [DS] ECO ME DASHBOARD v1.1.0
 */

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  updateStudentFeeAmount,
  toggleStudentFeeOption,
  removeClassFee,
  openBatchModal,
  openAddFeeModal,
  saveChanges,
  discardChanges,
} from '../../../store/slices/tuitionManagementSlice';
import {
  formatFeeAmount,
  getDefaultFeeHint,
} from '../../../utils/tuitionManagementValidation';
import { BatchUpdateFeeModal } from './BatchUpdateFeeModal';
import { AddClassFeeModal } from './AddClassFeeModal';
import {
  Button,
  IconButton,
  SearchField,
  Tag,
  Icon,
} from '../../../components/ds';

export const ClassFeeMatrixTable: React.FC = () => {
  const router = useRouter();
  const schoolCode = (router.query.schoolCode as string) || 'demo';
  const classId = (router.query.classId as string) || '12A1';
  const dispatch = useAppDispatch();

  const {
    assignedFees,
    matrixRows,
    hasUnsavedChanges,
    toastMessage,
  } = useAppSelector((state) => state.tuitionManagement);

  const [studentSearch, setStudentSearch] = useState<string>('');

  const filteredStudents = useMemo(() => {
    if (!studentSearch.trim()) return matrixRows;
    const q = studentSearch.trim().toLowerCase();
    return matrixRows.filter(
      (s) =>
        s.fullName.toLowerCase().includes(q) ||
        s.studentCode.toLowerCase().includes(q)
    );
  }, [matrixRows, studentSearch]);

  const handleCellAmountChange = (
    studentId: string,
    feeId: string,
    rawVal: string
  ) => {
    const cleanDigits = rawVal.replace(/\D/g, '');
    const num = cleanDigits === '' ? null : Number(cleanDigits);
    dispatch(updateStudentFeeAmount({ studentId, feeId, amount: num }));
  };

  const handleToggleOption = (
    studentId: string,
    feeId: string,
    currentEnabled: boolean
  ) => {
    dispatch(
      toggleStudentFeeOption({
        studentId,
        feeId,
        isEnabled: !currentEnabled,
      })
    );
  };

  const handleDeleteFee = (feeId: string, feeName: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa khoản phí "${feeName}" khỏi lớp này không?`)) {
      dispatch(removeClassFee(feeId));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', paddingBottom: '96px' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
            padding: 'var(--space-3) var(--space-4)',
            background: 'var(--color-primary-50)',
            border: '1px solid var(--color-primary-200)',
            borderRadius: 'var(--radius-lg)',
            color: 'var(--eco-blue-strong)',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-medium)',
          }}
        >
          <Icon name="check" size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Card */}
      <div
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 sm:p-5 rounded-xl border border-[var(--border-neutral)] bg-[var(--bg-surface)] shadow-xs"
      >
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            icon="arrow-left"
            onClick={() => router.push(`/${schoolCode}/school/tuition-management`)}
            aria-label="Quay lại danh sách lớp"
          >
            Quay lại
          </Button>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="h4 m-0 text-[var(--text-primary)]">
                Danh sách khoản phí theo lớp
              </h2>
              <Tag variant="code">Lớp {classId}</Tag>
            </div>
            <p className="body-xs mt-0.5 mb-0 text-[var(--text-secondary)]">
              Quản lý ma trận số tiền theo từng học sinh, hỗ trợ miễn giảm và điều chỉnh riêng biệt
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="w-full sm:w-60">
            <SearchField
              placeholder="Tìm tên hoặc mã HS..."
              value={studentSearch}
              onChange={(val) => setStudentSearch(val)}
            />
          </div>

          <Button
            variant="secondary"
            icon="download"
            onClick={() => alert(`Đang xuất bảng ma trận học phí lớp ${classId} ra file Excel...`)}
          >
            Xuất Excel
          </Button>

          <Button
            variant="primary"
            icon="plus"
            onClick={() => dispatch(openAddFeeModal())}
          >
            Thêm khoản phí
          </Button>
        </div>
      </div>

      {/* 2D Matrix Table */}
      <div className="ecomd-table-card">
        <div className="ecomd-table-scroll" style={{ maxHeight: '70vh' }}>
          <table className="ecomd-table w-full">
            <thead
              style={{
                position: 'sticky',
                top: 0,
                zIndex: 20,
                background: 'var(--bg-subtle)',
                borderBottom: '1px solid var(--border-default)',
              }}
            >
              <tr className="body-xs-semibold text-[var(--text-subtle)]">
                {/* Fixed student identification columns */}
                <th
                  style={{
                    padding: '12px 14px',
                    textAlign: 'center',
                    width: '48px',
                    background: 'var(--bg-subtle)',
                    position: 'sticky',
                    left: 0,
                    zIndex: 30,
                  }}
                >
                  STT
                </th>
                <th
                  style={{
                    padding: '12px 14px',
                    minWidth: '110px',
                    background: 'var(--bg-subtle)',
                    position: 'sticky',
                    left: '48px',
                    zIndex: 30,
                  }}
                >
                  Mã HS
                </th>
                <th
                  style={{
                    padding: '12px 16px',
                    minWidth: '180px',
                    background: 'var(--bg-subtle)',
                    position: 'sticky',
                    left: '158px',
                    zIndex: 30,
                    borderRight: '1px solid var(--border-default)',
                  }}
                >
                  Tên học sinh
                </th>
                <th style={{ padding: '12px 14px', textAlign: 'center', minWidth: '100px' }}>
                  Ngày sinh
                </th>
                <th style={{ padding: '12px 14px', textAlign: 'center', minWidth: '80px' }}>
                  Giới tính
                </th>

                {/* Assigned Fee Columns */}
                {assignedFees.map((fee) => (
                  <th
                    key={fee.feeId}
                    style={{
                      padding: '12px 16px',
                      minWidth: '220px',
                      borderLeft: '1px solid var(--border-default)',
                      background: fee.isMandatory ? 'var(--semantic-info-soft)' : 'var(--bg-subtle)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-2)' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', fontWeight: 600, color: 'var(--text-heading)', fontSize: '13px' }}>
                          <span>{fee.feeName}</span>
                          {fee.isMandatory && (
                            <Tag variant="code">Bắt buộc</Tag>
                          )}
                        </div>
                        <div className="body-xs text-[var(--text-subtle)] mt-0.5">
                          {formatFeeAmount(fee.defaultAmount)} Đ/{fee.unit}
                        </div>
                        {!fee.isMandatory && (
                          <div style={{ fontSize: '11px', fontWeight: 'var(--font-bold)', color: 'var(--semantic-warning)', marginTop: '2px' }}>
                            ({fee.activeStudentCount} Học sinh)
                          </div>
                        )}
                      </div>

                      {/* Header Actions: Edit Column / Delete Column */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <IconButton
                          icon="pencil"
                          size="sm"
                          label={`Cập nhật học phí hàng loạt cho cột ${fee.feeName}`}
                          onClick={() => dispatch(openBatchModal(fee.feeId))}
                        />
                        {!fee.isMandatory && (
                          <IconButton
                            icon="trash"
                            size="sm"
                            label={`Xóa khoản phí ${fee.feeName} khỏi lớp`}
                            onClick={() => handleDeleteFee(fee.feeId, fee.feeName)}
                          />
                        )}
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
              {filteredStudents.map((student, idx) => (
                <tr
                  key={student.studentId}
                  style={{
                    borderBottom: '1px solid var(--border-light)',
                    transition: 'background 0.15s ease',
                  }}
                >
                  {/* Sticky Student Info */}
                  <td
                    style={{
                      padding: '12px 14px',
                      textAlign: 'center',
                      color: 'var(--text-secondary)',
                      fontSize: 'var(--text-xs)',
                      background: 'var(--bg-surface)',
                      position: 'sticky',
                      left: 0,
                      zIndex: 10,
                    }}
                  >
                    {idx + 1}
                  </td>
                  <td
                    style={{
                      padding: '12px 14px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 'var(--font-bold)',
                      color: 'var(--text-secondary)',
                      background: 'var(--bg-surface)',
                      position: 'sticky',
                      left: '48px',
                      zIndex: 10,
                    }}
                  >
                    {student.studentCode}
                  </td>
                  <td
                    style={{
                      padding: '12px 16px',
                      fontWeight: 'var(--font-bold)',
                      color: 'var(--text-primary)',
                      background: 'var(--bg-surface)',
                      position: 'sticky',
                      left: '158px',
                      zIndex: 10,
                      borderRight: '1px solid var(--border-neutral)',
                    }}
                  >
                    {student.fullName}
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'center', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                    {student.dateOfBirth}
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'center', fontSize: 'var(--text-xs)' }}>
                    <Tag variant={student.gender === 'Nam' ? 'code' : 'default'}>
                      {student.gender}
                    </Tag>
                  </td>

                  {/* Dynamic Fee Cells */}
                  {assignedFees.map((fee) => {
                    const cell = student.feeCells[fee.feeId] || {
                      feeId: fee.feeId,
                      isEnabled: fee.isMandatory,
                      amount: fee.defaultAmount,
                      hasOverride: false,
                    };

                    return (
                      <td
                        key={fee.feeId}
                        style={{
                          padding: '12px 14px',
                          borderLeft: '1px solid var(--border-light)',
                          verticalAlign: 'top',
                          background: fee.isMandatory ? 'rgba(238, 246, 255, 0.3)' : 'transparent',
                        }}
                      >
                        {fee.isMandatory ? (
                          /* Mandatory Fee Cell */
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <input
                              type="text"
                              value={
                                cell.amount !== null
                                  ? new Intl.NumberFormat('vi-VN').format(cell.amount)
                                  : ''
                              }
                              onChange={(e) =>
                                handleCellAmountChange(
                                  student.studentId,
                                  fee.feeId,
                                  e.target.value
                                )
                              }
                              placeholder={
                                fee.feeId === 'fee_hoc_phi'
                                  ? 'Chưa có học phí'
                                  : 'Chưa có tiền ăn'
                              }
                              style={{
                                width: '100%',
                                padding: '6px 10px',
                                fontSize: 'var(--text-xs)',
                                fontWeight: 'var(--font-bold)',
                                borderRadius: 'var(--radius-md)',
                                border: cell.hasOverride
                                  ? '1px solid var(--semantic-success)'
                                  : '1px solid var(--border-neutral)',
                                background: cell.hasOverride
                                  ? 'rgba(46, 125, 50, 0.05)'
                                  : 'var(--bg-secondary)',
                                color: 'var(--text-primary)',
                                fontVariantNumeric: 'tabular-nums',
                              }}
                            />
                            {cell.hasOverride && (
                              <div
                                style={{
                                  fontSize: '10px',
                                  fontWeight: 'var(--font-bold)',
                                  color: 'var(--semantic-success)',
                                }}
                              >
                                {getDefaultFeeHint(fee.defaultAmount, fee.unit)}
                              </div>
                            )}
                          </div>
                        ) : (
                          /* Optional Fee Cell */
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                              <button
                                type="button"
                                onClick={() =>
                                  handleToggleOption(
                                    student.studentId,
                                    fee.feeId,
                                    cell.isEnabled
                                  )
                                }
                                style={{
                                  position: 'relative',
                                  width: '34px',
                                  height: '18px',
                                  borderRadius: 'var(--radius-full)',
                                  background: cell.isEnabled
                                    ? 'var(--eco-blue-strong)'
                                    : 'var(--border-neutral)',
                                  border: 'none',
                                  cursor: 'pointer',
                                  transition: 'background 0.2s ease',
                                  padding: 0,
                                }}
                                role="switch"
                                aria-checked={cell.isEnabled}
                                aria-label={`Bật tắt ${fee.feeName} cho ${student.fullName}`}
                              >
                                <span
                                  style={{
                                    position: 'absolute',
                                    top: '2px',
                                    left: cell.isEnabled ? '18px' : '2px',
                                    width: '14px',
                                    height: '14px',
                                    borderRadius: 'var(--radius-full)',
                                    background: '#fff',
                                    transition: 'left 0.2s ease',
                                    boxShadow: 'var(--shadow-sm)',
                                  }}
                                />
                              </button>
                              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                                {cell.isEnabled ? 'Đang bật' : 'Tắt'}
                              </span>
                            </div>

                            {cell.isEnabled && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <input
                                  type="text"
                                  value={
                                    cell.amount !== null
                                      ? new Intl.NumberFormat('vi-VN').format(cell.amount)
                                      : ''
                                  }
                                  onChange={(e) =>
                                    handleCellAmountChange(
                                      student.studentId,
                                      fee.feeId,
                                      e.target.value
                                    )
                                  }
                                  placeholder="Nhập số tiền..."
                                  style={{
                                    width: '100%',
                                    padding: '6px 10px',
                                    fontSize: 'var(--text-xs)',
                                    fontWeight: 'var(--font-bold)',
                                    borderRadius: 'var(--radius-md)',
                                    border: cell.hasOverride
                                      ? '1px solid var(--semantic-success)'
                                      : '1px solid var(--border-neutral)',
                                    background: cell.hasOverride
                                      ? 'rgba(46, 125, 50, 0.05)'
                                      : 'var(--bg-secondary)',
                                    color: 'var(--text-primary)',
                                    fontVariantNumeric: 'tabular-nums',
                                  }}
                                />
                                {cell.hasOverride && (
                                  <div
                                    style={{
                                      fontSize: '10px',
                                      fontWeight: 'var(--font-bold)',
                                      color: 'var(--semantic-success)',
                                    }}
                                  >
                                    {getDefaultFeeHint(fee.defaultAmount, fee.unit)}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Matrix Footer */}
        <div
          style={{
            background: 'var(--bg-secondary)',
            padding: 'var(--space-3) var(--space-4)',
            borderTop: '1px solid var(--border-neutral)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 'var(--text-xs)',
            color: 'var(--text-secondary)',
          }}
        >
          <div>
            Đang hiển thị <b>{filteredStudents.length}</b> / {matrixRows.length} học sinh trong lớp {classId}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', color: 'var(--semantic-success)', fontWeight: 'var(--font-bold)' }}>
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--semantic-success)',
                  display: 'inline-block',
                }}
              />
              Chữ xanh lá: Số tiền đã được điều chỉnh khác mức mặc định
            </span>
          </div>
        </div>
      </div>

      {/* Persistent / Floating Unsaved Changes Bottom Banner (BR10) */}
      {hasUnsavedChanges && (
        <div
          style={{
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 40,
            maxWidth: '640px',
            width: '90%',
            background: 'var(--bg-neutral-strong)',
            color: '#fff',
            padding: 'var(--space-3) var(--space-5)',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-xl)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--space-4)',
            border: '1px solid var(--border-neutral)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <Icon name="alert-triangle" size={18} color="var(--semantic-warning)" />
            <div>
              <p style={{ margin: 0, fontSize: 'var(--text-xs)', fontWeight: 'var(--font-bold)', color: '#fff' }}>
                Thay đổi của bạn chưa được lưu.
              </p>
              <p style={{ margin: '2px 0 0', fontSize: '11px', color: 'rgba(255, 255, 255, 0.7)' }}>
                Vui lòng xác nhận lưu lại các mức phí mới hoặc hủy bỏ!
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Button
              variant="secondary"
              onClick={() => dispatch(discardChanges())}
            >
              Hủy bỏ
            </Button>
            <Button
              variant="primary"
              icon="check"
              onClick={() => dispatch(saveChanges())}
            >
              Lưu thay đổi
            </Button>
          </div>
        </div>
      )}

      {/* Modals */}
      <BatchUpdateFeeModal />
      <AddClassFeeModal />
    </div>
  );
};

export default ClassFeeMatrixTable;
