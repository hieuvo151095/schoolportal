/**
 * Student Directory Table Component
 * Design System: [DS] ECO ME DASHBOARD v2.6.0
 */

import React from 'react';
import Link from 'next/link';
import { Student } from '../../../types/student';
import { hasStudentDiscount } from '../../../utils/studentValidation';
import { useAppSelector } from '../../../store';
import {
  Tag,
  StatusTag,
  Avatar,
  Checkbox,
  DropdownMenu,
  IconButton,
  EmptyState,
} from '../../../components/ds';

interface StudentTableProps {
  students: Student[];
  schoolCode: string;
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onOpenTransfer: (student: Student) => void;
  onOpenNotes: (student: Student) => void;
  onOpenTuition: (student: Student) => void;
  onOpenGrowth: (student: Student) => void;
}

export const StudentTable: React.FC<StudentTableProps> = ({
  students,
  schoolCode,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onOpenTransfer,
  onOpenNotes,
  onOpenTuition,
  onOpenGrowth,
}) => {
  const policies = useAppSelector((state) => state.discount?.policies || []);
  const allSelected = students.length > 0 && selectedIds.length === students.length;

  const renderStatusTag = (status: Student['status']) => {
    switch (status) {
      case 'active':
        return <StatusTag tone="success" label="Đang học" icon={true} />;
      case 'chua_xep_lop':
        return <StatusTag tone="warning" label="Chưa xếp lớp" icon={true} />;
      case 'thoi_hoc':
        return <StatusTag tone="danger" label="Thôi học" icon="ban" />;
      case 'chuyen_truong':
        return <StatusTag tone="neutral" label="Chuyển trường" icon="ban" />;
      case 'tot_nghiep':
        return <StatusTag tone="info" label="Tốt nghiệp" icon={true} />;
      default:
        return <StatusTag tone="neutral" label={status} />;
    }
  };

  return (
    <div className="ecomd-table-card">
      <div className="ecomd-table-scroll">
        <table className="ecomd-table ecomd-table--dense w-full">
          <thead>
            <tr>
              <th className="is-checkbox" style={{ width: '48px', textAlign: 'center' }}>
                <Checkbox
                  checked={allSelected}
                  onChange={onToggleSelectAll}
                  aria-label="Chọn tất cả học sinh"
                />
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ width: '130px' }}>
                Mã học sinh
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)] is-primary" style={{ minWidth: '220px' }}>
                Học sinh
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ width: '110px' }}>
                Lớp học
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ minWidth: '180px' }}>
                Phụ huynh / Giám hộ
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ width: '130px' }}>
                Trạng thái
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ textAlign: 'center', width: '110px' }}>
                Chính sách
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)] is-right is-actions" style={{ textAlign: 'right', width: '70px' }}>
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-0">
                  <EmptyState
                    icon="graduation-cap"
                    title="Không tìm thấy học sinh phù hợp"
                    description="Vui lòng thử điều chỉnh lại từ khóa tìm kiếm hoặc bộ lọc lớp học."
                  />
                </td>
              </tr>
            ) : (
              students.map((student) => {
                const isSelected = selectedIds.includes(student.id);
                const hasDiscount = hasStudentDiscount(student, policies);
                const primaryGuardian =
                  student.guardians?.find((g) => g.isPrimaryPickup) || student.guardians?.[0];

                return (
                  <tr key={student.id} className={isSelected ? 'is-selected' : undefined}>
                    {/* Checkbox */}
                    <td className="is-checkbox" style={{ textAlign: 'center' }}>
                      <Checkbox
                        checked={isSelected}
                        onChange={() => onToggleSelect(student.id)}
                        aria-label={`Chọn ${student.fullName}`}
                      />
                    </td>

                    {/* Student Code */}
                    <td className="body-sm font-mono">
                      <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                        Mã HS
                      </span>
                      <div className="ecomd-cell__value">
                        <Tag variant="code">{student.studentCode || '—'}</Tag>
                      </div>
                    </td>

                    {/* Person: Avatar + Name + Birthday */}
                    <td className="body-sm is-primary">
                      <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                        Học sinh
                      </span>
                      <div className="ecomd-cell__value flex items-center gap-3">
                        <Avatar name={student.fullName} src={student.avatar} size="md" />
                        <div>
                          <Link
                            href={`/${schoolCode}/school/kid/detail/${student.id}`}
                            className="body-sm-bold text-[var(--text-heading)] hover:underline block"
                          >
                            {student.fullName}
                          </Link>
                          <div className="body-xs text-[var(--text-subtle)]">
                            {student.gender === 'nam' ? 'Nam' : 'Nữ'} • <span className="font-numeric">{student.dob}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Class */}
                    <td className="body-sm">
                      <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                        Lớp
                      </span>
                      <div className="ecomd-cell__value">
                        <Tag variant="default">{student.className}</Tag>
                      </div>
                    </td>

                    {/* Guardian */}
                    <td className="body-sm">
                      <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                        Phụ huynh
                      </span>
                      <div className="ecomd-cell__value">
                        <div className="body-sm-medium text-[var(--text-heading)]">
                          {primaryGuardian?.fullName || 'Chưa cập nhật'}
                        </div>
                        <div className="body-xs font-numeric text-[var(--text-subtle)]">
                          {primaryGuardian?.phone || ''}
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="body-sm">
                      <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                        Trạng thái
                      </span>
                      <div className="ecomd-cell__value">
                        {renderStatusTag(student.status)}
                      </div>
                    </td>

                    {/* Discount Tag */}
                    <td className="body-sm" style={{ textAlign: 'center' }}>
                      <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                        Chính sách
                      </span>
                      <div className="ecomd-cell__value flex justify-center">
                        {hasDiscount ? (
                          <Tag variant="success">Miễn giảm</Tag>
                        ) : (
                          <span className="text-[var(--text-subtle)]">—</span>
                        )}
                      </div>
                    </td>

                    {/* Actions: DropdownMenu */}
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
                              label: 'Xem chi tiết hồ sơ',
                              icon: 'eye',
                              href: `/${schoolCode}/school/kid/detail/${student.id}`,
                            },
                            {
                              label: 'Chuyển lớp',
                              icon: 'arrow-right',
                              onClick: () => onOpenTransfer(student),
                            },
                            {
                              label: 'Ghi chú học sinh',
                              icon: 'file-lines',
                              onClick: () => onOpenNotes(student),
                            },
                            {
                              label: 'Hồ sơ thể chất (BMI)',
                              icon: 'chart-pie',
                              onClick: () => onOpenGrowth(student),
                            },
                            { divider: true },
                            {
                              label: 'Điều chỉnh học phí riêng',
                              icon: 'coins',
                              onClick: () => onOpenTuition(student),
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

      {/* Footer */}
      {students.length > 0 && (
        <div className="ecomd-table__footer body-xs text-[var(--text-subtle)] flex items-center justify-between">
          <div>
            Hiển thị <b>{students.length}</b> học sinh
          </div>
          {selectedIds.length > 0 && (
            <div className="text-[var(--eco-blue-strong)] font-semibold">
              Đang chọn {selectedIds.length} học sinh
            </div>
          )}
        </div>
      )}
    </div>
  );
};
