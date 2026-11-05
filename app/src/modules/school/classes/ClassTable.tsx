/**
 * Class Table Component
 * Design System: [DS] ECO ME DASHBOARD v2.6.0
 */

import React from 'react';
import Link from 'next/link';
import { ClassItem, ClassTaxonomy } from '../../../types/class';
import { canDeleteClass } from '../../../utils/classValidation';
import { Tag, StatusTag, IconButton, EmptyState, DropdownMenu } from '../../../components/ds';

interface ClassTableProps {
  classes: ClassItem[];
  taxonomy: ClassTaxonomy;
  schoolCode: string;
  onSelectClass?: (classId: string) => void;
  onEditClass: (classId: string) => void;
  onDeleteClass: (classId: string) => void;
}

export const ClassTable: React.FC<ClassTableProps> = ({
  classes,
  taxonomy,
  schoolCode,
  onEditClass,
  onDeleteClass,
}) => {
  if (classes.length === 0) {
    return (
      <EmptyState
        icon="chalkboard"
        title="Không tìm thấy lớp học nào"
        description="Không có lớp học nào phù hợp với bộ lọc hiện tại. Vui lòng thay đổi từ khóa tìm kiếm hoặc điều chỉnh điều kiện lọc."
      />
    );
  }

  const renderStatusTag = (status: ClassItem['status']) => {
    switch (status) {
      case 'dang_hoat_dong':
        return <StatusTag tone="success" label="Đang học" icon={true} />;
      case 'tam_dung':
        return <StatusTag tone="warning" label="Tạm dừng" icon={true} />;
      case 'da_ket_thuc':
        return <StatusTag tone="neutral" label="Đã kết thúc" />;
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
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ width: '48px', textAlign: 'center' }}>
                STT
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ width: '120px' }}>
                Mã lớp
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)] is-primary" style={{ minWidth: '180px' }}>
                Tên lớp học
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ width: '100px' }}>
                Khối
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ minWidth: '200px' }}>
                {taxonomy === 'chinh_khoa' ? 'Giáo viên chủ nhiệm' : 'Giáo viên phụ trách'}
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ textAlign: 'center', width: '90px' }}>
                Sĩ số
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ textAlign: 'center', width: '120px' }}>
                Trạng thái
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)] is-right is-actions" style={{ textAlign: 'right', width: '70px' }}>
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {classes.map((cls, index) => {
              const deletable = canDeleteClass(cls);

              return (
                <tr key={cls.id}>
                  {/* STT */}
                  <td className="body-sm" style={{ textAlign: 'center' }}>
                    <span className="body-xs font-numeric text-[var(--text-subtle)]">
                      {index + 1}
                    </span>
                  </td>

                  {/* Class Code */}
                  <td className="body-sm font-mono">
                    <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                      Mã lớp
                    </span>
                    <div className="ecomd-cell__value">
                      <Tag variant="code">{cls.code}</Tag>
                    </div>
                  </td>

                  {/* Class Name */}
                  <td className="body-sm is-primary">
                    <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                      Tên lớp
                    </span>
                    <div className="ecomd-cell__value">
                      <Link
                        href={`/${schoolCode}/school/classes/${cls.id}`}
                        className="body-sm-bold text-[var(--eco-blue-strong)] hover:underline block"
                      >
                        {cls.name}
                      </Link>
                      {cls.roomNumber && (
                        <div className="body-xs text-[var(--text-subtle)] mt-0.5">
                          Phòng: {cls.roomNumber}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Grade Level */}
                  <td className="body-sm">
                    <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                      Khối
                    </span>
                    <div className="ecomd-cell__value">
                      <Tag variant="default">{cls.gradeName || 'N/A'}</Tag>
                    </div>
                  </td>

                  {/* Teachers */}
                  <td className="body-sm">
                    <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                      Giáo viên
                    </span>
                    <div className="ecomd-cell__value">
                      <div className="body-sm-medium text-[var(--text-heading)]">
                        {cls.homeroomTeacherName || 'Chưa phân công'}
                      </div>
                      {cls.homeroomTeacherPhone && (
                        <div className="body-xs font-numeric text-[var(--text-subtle)] mt-0.5">
                          {cls.homeroomTeacherPhone}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Capacity / Students */}
                  <td className="body-sm font-numeric" style={{ textAlign: 'center' }}>
                    <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                      Sĩ số
                    </span>
                    <div className="ecomd-cell__value justify-center">
                      <b className="body-sm-bold text-[var(--text-heading)]">{cls.studentCount}</b>
                      <span className="body-xs text-[var(--text-subtle)]">/{cls.maxCapacity}</span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="body-sm" style={{ textAlign: 'center' }}>
                    <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                      Trạng thái
                    </span>
                    <div className="ecomd-cell__value flex justify-center">
                      {renderStatusTag(cls.status)}
                    </div>
                  </td>

                  {/* Actions */}
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
                            label: 'Xem chi tiết lớp học',
                            icon: 'eye',
                            href: `/${schoolCode}/school/classes/${cls.id}`,
                          },
                          {
                            label: 'Chỉnh sửa thông tin lớp',
                            icon: 'pen-to-square',
                            onClick: () => onEditClass(cls.id),
                          },
                          {
                            divider: true,
                          },
                          {
                            label: 'Xóa lớp học',
                            icon: 'trash',
                            tone: 'danger',
                            disabled: !deletable,
                            onClick: () => onDeleteClass(cls.id),
                          },
                        ]}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      {classes.length > 0 && (
        <div className="ecomd-table__footer body-xs text-[var(--text-subtle)] flex items-center justify-between">
          <div>
            Hiển thị <b>{classes.length}</b> lớp học
          </div>
          <div className="text-[var(--text-subtle)] hidden sm:block">
            Phân loại: {taxonomy === 'chinh_khoa' ? 'Chính khóa' : 'Ngoại khóa & CLB'}
          </div>
        </div>
      )}
    </div>
  );
};
