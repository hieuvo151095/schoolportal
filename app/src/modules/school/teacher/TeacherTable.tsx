/**
 * Teacher Table Component
 * Design System: [DS] ECO ME DASHBOARD v2.6.0
 */

import React from 'react';
import Link from 'next/link';
import type { Teacher, TeacherPermissionTier, TeacherWorkingStatus } from '../../../types/teacher';
import {
  Tag,
  StatusTag,
  EmptyValue,
  Avatar,
  Checkbox,
  DropdownMenu,
  IconButton,
  EmptyState,
} from '../../../components/ds';

interface TeacherTableProps {
  teachers: Teacher[];
  schoolCode: string;
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onOpenAssignClass: (teacher: Teacher) => void;
  onOpenChangeEmail: (teacher: Teacher) => void;
  onOpenDelete: (teacher: Teacher) => void;
  onChangePermission: (teacherId: string, tier: TeacherPermissionTier) => void;
  onChangeStatus: (teacherId: string, status: TeacherWorkingStatus) => void;
}

export const TeacherTable: React.FC<TeacherTableProps> = ({
  teachers,
  schoolCode,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onOpenAssignClass,
  onOpenChangeEmail,
  onOpenDelete,
  onChangePermission,
  onChangeStatus,
}) => {
  const allSelected = teachers.length > 0 && selectedIds.length === teachers.length;

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
                  aria-label="Chọn tất cả giáo viên"
                />
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ width: '130px' }}>
                Mã nhân viên
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)] is-primary" style={{ minWidth: '220px' }}>
                Họ và tên
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ minWidth: '130px' }}>
                Lớp chủ nhiệm
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ minWidth: '180px' }}>
                Lớp phụ trách
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ width: '140px' }}>
                Phân quyền
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ width: '140px' }}>
                Trạng thái
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)] is-right is-actions" style={{ textAlign: 'right', width: '70px' }}>
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {teachers.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-0">
                  <EmptyState
                    icon="user-tie"
                    title="Không tìm thấy giáo viên phù hợp"
                    description="Vui lòng thử điều chỉnh lại từ khóa tìm kiếm hoặc bộ lọc."
                  />
                </td>
              </tr>
            ) : (
              teachers.map((teacher) => {
                const isSelected = selectedIds.includes(teacher.id);
                const isPrimary = teacher.permissionTier === 'chinh';
                const isWorking = teacher.status === 'dang_lam_viec';

                return (
                  <tr key={teacher.id} className={isSelected ? 'is-selected' : undefined}>
                    {/* Checkbox */}
                    <td className="is-checkbox" style={{ textAlign: 'center' }}>
                      <Checkbox
                        checked={isSelected}
                        onChange={() => onToggleSelect(teacher.id)}
                        aria-label={`Chọn giáo viên ${teacher.fullName}`}
                      />
                    </td>

                    {/* Staff Code */}
                    <td className="body-sm font-mono">
                      <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                        Mã NV
                      </span>
                      <div className="ecomd-cell__value">
                        {teacher.staffCode ? (
                          <Tag variant="code">{teacher.staffCode}</Tag>
                        ) : (
                          <EmptyValue italic>Chưa có mã</EmptyValue>
                        )}
                      </div>
                    </td>

                    {/* Person: Avatar + Full Name + Email */}
                    <td className="body-sm is-primary">
                      <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                        Họ và tên
                      </span>
                      <div className="ecomd-cell__value flex items-center gap-3">
                        <Avatar name={teacher.fullName} src={teacher.avatar} size="md" />
                        <div>
                          <Link
                            href={`/${schoolCode}/school/teacher/info/${teacher.id}`}
                            className="body-sm-bold text-[var(--text-heading)] hover:underline block"
                          >
                            {teacher.fullName}
                          </Link>
                          <div className="body-xs font-mono text-[var(--text-subtle)]">
                            {teacher.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Homeroom */}
                    <td className="body-sm">
                      <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                        Chủ nhiệm
                      </span>
                      <div className="ecomd-cell__value">
                        {teacher.homeroomClassId ? (
                          <Tag variant="success">{teacher.homeroomClassName || teacher.homeroomClassId}</Tag>
                        ) : (
                          <EmptyValue>Chưa chủ nhiệm</EmptyValue>
                        )}
                      </div>
                    </td>

                    {/* Assigned Classes */}
                    <td className="body-sm">
                      <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                        Phụ trách
                      </span>
                      <div className="ecomd-cell__value">
                        {teacher.assignedClasses && teacher.assignedClasses.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {teacher.assignedClasses.map((cls) => (
                              <Tag key={cls.classId} variant="default">
                                {cls.className || cls.classId}
                              </Tag>
                            ))}
                          </div>
                        ) : (
                          <EmptyValue>Chưa phân công</EmptyValue>
                        )}
                      </div>
                    </td>

                    {/* Permission Tier */}
                    <td className="body-sm">
                      <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                        Phân quyền
                      </span>
                      <div className="ecomd-cell__value">
                        <StatusTag
                          tone={isPrimary ? 'info' : 'warning'}
                          label={isPrimary ? 'Giáo viên chính' : 'Giáo viên hỗ trợ'}
                        />
                      </div>
                    </td>

                    {/* Working Status */}
                    <td className="body-sm">
                      <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                        Trạng thái
                      </span>
                      <div className="ecomd-cell__value">
                        <StatusTag
                          tone={
                            teacher.status === 'dang_lam_viec'
                              ? 'success'
                              : teacher.status === 'tam_nghi'
                              ? 'warning'
                              : 'neutral'
                          }
                          label={
                            teacher.status === 'dang_lam_viec'
                              ? 'Đang làm việc'
                              : teacher.status === 'tam_nghi'
                              ? 'Tạm nghỉ'
                              : 'Đã nghỉ việc'
                          }
                          icon={true}
                        />
                      </div>
                    </td>

                    {/* Actions Menu */}
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
                              href: `/${schoolCode}/school/teacher/info/${teacher.id}`,
                            },
                            {
                              label: 'Phân công lớp học',
                              icon: 'chalkboard-user',
                              onClick: () => onOpenAssignClass(teacher),
                            },
                            {
                              label: 'Đổi email đăng nhập',
                              icon: 'envelope',
                              onClick: () => onOpenChangeEmail(teacher),
                            },
                            { divider: true },
                            {
                              label: isPrimary ? 'Hạ quyền: Giáo viên hỗ trợ' : 'Nâng quyền: Giáo viên chính',
                              onClick: () => onChangePermission(teacher.id, isPrimary ? 'ho_tro' : 'chinh'),
                            },
                            {
                              label: isWorking ? 'Chuyển sang Tạm nghỉ' : 'Kích hoạt Đang làm việc',
                              onClick: () => onChangeStatus(teacher.id, isWorking ? 'tam_nghi' : 'dang_lam_viec'),
                            },
                            { divider: true },
                            {
                              label: 'Xóa giáo viên',
                              tone: 'danger',
                              icon: 'trash',
                              onClick: () => onOpenDelete(teacher),
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
      {teachers.length > 0 && (
        <div className="ecomd-table__footer body-xs text-[var(--text-subtle)] flex items-center justify-between">
          <div>
            Hiển thị <b>{teachers.length}</b> giáo viên
          </div>
          {selectedIds.length > 0 && (
            <div className="text-[var(--eco-blue-strong)] font-semibold">
              Đang chọn {selectedIds.length} giáo viên
            </div>
          )}
        </div>
      )}
    </div>
  );
};
