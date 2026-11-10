/**
 * School Archive Table Component
 * Design System: [DS] ECO ME DASHBOARD v2.6.0
 */

import React from 'react';
import type {
  ArchivedStudent,
  ArchiveStaffOperator,
  ArchiveSortField,
  ArchiveSortState,
} from '@/types/archive';
import { formatArchiveDate, formatGender } from '@/utils/archiveValidation';
import { EmptyState, Tag, Icon } from '@/components/ds';

interface ArchiveTableProps {
  students: ArchivedStudent[];
  sort: ArchiveSortState;
  onToggleSort: (field: ArchiveSortField) => void;
  onOpenDetailModal: (student: ArchivedStudent) => void;
  onOpenStaffModal: (staff: ArchiveStaffOperator) => void;
  onOpenRestoreModal: (student: ArchivedStudent) => void;
  onOpenPurgeModal: (student: ArchivedStudent) => void;
}

export const ArchiveTable: React.FC<ArchiveTableProps> = ({
  students,
  sort,
  onToggleSort,
  onOpenDetailModal,
  onOpenStaffModal,
  onOpenRestoreModal,
  onOpenPurgeModal,
}) => {
  const renderSortIcon = (field: ArchiveSortField) => {
    if (sort.field !== field) {
      return (
        <span className="ml-1 text-[var(--text-subtle)] text-xs inline-flex items-center">
          <Icon name="sort" size={12} />
        </span>
      );
    }
    return (
      <span className="ml-1 text-[var(--eco-blue-strong)] text-xs inline-flex items-center">
        <Icon name={sort.direction === 'asc' ? 'sort-up' : 'sort-down'} size={12} />
      </span>
    );
  };

  if (students.length === 0) {
    return (
      <EmptyState
        icon="box-archive"
        title="Không tìm thấy học sinh lưu trữ nào"
        description="Không có kết quả nào phù hợp với bộ lọc tìm kiếm hoặc chưa có học sinh nào được lưu trữ."
      />
    );
  }

  return (
    <div className="ecomd-table-card mt-4">
      <div className="ecomd-table-scroll">
        <table className="ecomd-table ecomd-table--dense w-full">
          <thead>
            <tr>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ width: '48px', textAlign: 'center' }}>
                STT
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ width: '120px' }}>
                Mã học sinh
              </th>
              <th
                className="body-xs-semibold text-[var(--text-subtle)] is-primary cursor-pointer select-none hover:text-[var(--eco-blue-strong)]"
                onClick={() => onToggleSort('fullName')}
                title="Sắp xếp theo tên học sinh"
                style={{ minWidth: '180px' }}
              >
                Tên học sinh {renderSortIcon('fullName')}
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ width: '110px' }}>
                Ngày sinh
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ width: '90px', textAlign: 'center' }}>
                Giới tính
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ width: '120px' }}>
                Lớp cũ
              </th>
              <th
                className="body-xs-semibold text-[var(--text-subtle)] cursor-pointer select-none hover:text-[var(--eco-blue-strong)]"
                onClick={() => onToggleSort('archiveDate')}
                title="Sắp xếp theo ngày lưu trữ"
                style={{ width: '130px' }}
              >
                Ngày lưu trữ {renderSortIcon('archiveDate')}
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ minWidth: '140px' }}>
                Lưu trữ bởi
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ minWidth: '160px' }}>
                Lý do
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)] is-right is-actions" style={{ width: '90px', textAlign: 'center' }}>
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={student.id}>
                {/* STT */}
                <td className="body-sm" style={{ textAlign: 'center' }}>
                  <span className="body-xs font-numeric text-[var(--text-subtle)]">
                    {index + 1}
                  </span>
                </td>

                {/* Code */}
                <td className="body-sm font-mono">
                  <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                    Mã HS
                  </span>
                  <div className="ecomd-cell__value">
                    <Tag variant="code">{student.studentCode}</Tag>
                  </div>
                </td>

                {/* Name */}
                <td className="body-sm is-primary">
                  <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                    Học sinh
                  </span>
                  <div className="ecomd-cell__value">
                    <button
                      type="button"
                      onClick={() => onOpenDetailModal(student)}
                      className="body-sm-bold text-[var(--eco-blue-strong)] hover:underline border-0 bg-transparent p-0 cursor-pointer text-left"
                      title={`Xem chi tiết hồ sơ lưu trữ của ${student.fullName}`}
                    >
                      {student.fullName}
                    </button>
                  </div>
                </td>

                {/* DOB */}
                <td className="body-sm font-numeric text-[var(--text-subtle)]">
                  <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                    Ngày sinh
                  </span>
                  <div className="ecomd-cell__value">
                    {formatArchiveDate(student.dateOfBirth)}
                  </div>
                </td>

                {/* Gender */}
                <td className="body-sm" style={{ textAlign: 'center' }}>
                  <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                    Giới tính
                  </span>
                  <div className="ecomd-cell__value justify-center">
                    {formatGender(student.gender)}
                  </div>
                </td>

                {/* Class */}
                <td className="body-sm">
                  <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                    Lớp cũ
                  </span>
                  <div className="ecomd-cell__value">
                    {student.formerClassName ? (
                      <Tag variant="default">{student.formerClassName}</Tag>
                    ) : (
                      <span className="text-[var(--text-subtle)]">—</span>
                    )}
                  </div>
                </td>

                {/* Archive Date */}
                <td className="body-sm font-numeric text-[var(--text-subtle)]">
                  <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                    Ngày lưu
                  </span>
                  <div className="ecomd-cell__value">
                    {formatArchiveDate(student.archiveDate)}
                  </div>
                </td>

                {/* Archived By */}
                <td className="body-sm">
                  <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                    Người lưu
                  </span>
                  <div className="ecomd-cell__value">
                    {student.archivedBy ? (
                      <button
                        type="button"
                        onClick={() => onOpenStaffModal(student.archivedBy!)}
                        className="body-xs-medium text-[var(--eco-blue-strong)] hover:underline border-0 bg-transparent p-0 cursor-pointer"
                        title={`Xem thông tin người thực hiện: ${student.archivedBy.name}`}
                      >
                        {student.archivedBy.name}
                      </button>
                    ) : (
                      <span className="text-[var(--text-subtle)]">—</span>
                    )}
                  </div>
                </td>

                {/* Reason */}
                <td className="body-sm text-[var(--text-subtle)]">
                  <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                    Lý do
                  </span>
                  <div className="ecomd-cell__value">
                    {student.archiveReason || '—'}
                  </div>
                </td>

                {/* Actions */}
                <td className="body-sm is-right is-actions" style={{ textAlign: 'center' }}>
                  <div className="ecomd-cell__value flex items-center justify-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onOpenRestoreModal(student)}
                      title={`Phục hồi học sinh ${student.fullName}`}
                      aria-label={`Phục hồi học sinh ${student.fullName}`}
                      className="p-1.5 rounded-md border border-[var(--border-default)] bg-[var(--bg-surface)] text-[var(--eco-blue-strong)] hover:bg-[var(--bg-muted)] cursor-pointer inline-flex items-center justify-center min-w-[32px] min-h-[32px]"
                    >
                      <Icon name="rotate-right" size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpenPurgeModal(student)}
                      title={`Xoá vĩnh viễn học sinh ${student.fullName}`}
                      aria-label={`Xoá vĩnh viễn học sinh ${student.fullName}`}
                      className="p-1.5 rounded-md border border-[var(--border-default)] bg-[var(--bg-surface)] text-[var(--semantic-danger)] hover:bg-rose-50 cursor-pointer inline-flex items-center justify-center min-w-[32px] min-h-[32px]"
                    >
                      <Icon name="trash" size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      {students.length > 0 && (
        <div className="ecomd-table__footer body-xs text-[var(--text-subtle)] flex items-center justify-between">
          <div>
            Hiển thị <b>{students.length}</b> hồ sơ lưu trữ
          </div>
          <div className="hidden sm:block">
            Quản lý lưu trữ hồ sơ học sinh chuyển trường, thôi học và tốt nghiệp
          </div>
        </div>
      )}
    </div>
  );
};
