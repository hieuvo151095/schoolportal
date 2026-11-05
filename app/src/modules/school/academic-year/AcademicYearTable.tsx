/**
 * Academic Year Table Component
 * Design System: [DS] ECO ME DASHBOARD v2.6.0
 * Invariants: Permanent removal omitted per MoET governance rules.
 */

import React from 'react';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { AcademicYear } from '../../../types/academicYear';
import { isCurrentAcademicYear, formatDateDisplay } from '../../../utils/academicYearValidation';
import { Tag, StatusTag, Button, EmptyState } from '../../../components/ds';

interface AcademicYearTableProps {
  items: AcademicYear[];
  onEdit: (item: AcademicYear) => void;
}

export const AcademicYearTable: React.FC<AcademicYearTableProps> = ({
  items,
  onEdit,
}) => {
  return (
    <div className="ecomd-table-card">
      <div className="ecomd-table-scroll">
        <table className="ecomd-table ecomd-table--dense w-full">
          <thead>
            <tr>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ width: '48px', textAlign: 'center' }}>
                STT
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)] is-primary" style={{ minWidth: '220px' }}>
                Tên năm học / Niên khóa
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ width: '160px' }}>
                Thời gian bắt đầu
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ width: '160px' }}>
                Thời gian kết thúc
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ textAlign: 'center', width: '160px' }}>
                Trạng thái áp dụng
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)] is-right is-actions" style={{ width: '110px', textAlign: 'right' }}>
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-0">
                  <EmptyState
                    icon="calendar"
                    title="Không tìm thấy năm học phù hợp"
                    description="Hãy thử tìm với từ khóa khác hoặc tạo mới năm học."
                  />
                </td>
              </tr>
            ) : (
              items.map((item, index) => {
                const current = isCurrentAcademicYear(item);

                return (
                  <tr
                    key={item.id}
                    className={current ? 'is-selected' : undefined}
                  >
                    {/* Index */}
                    <td className="body-sm" style={{ textAlign: 'center' }}>
                      <span className="body-xs font-numeric text-[var(--text-subtle)]">
                        {index + 1}
                      </span>
                    </td>

                    {/* Name */}
                    <td className="body-sm is-primary">
                      <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                        Năm học
                      </span>
                      <div className="ecomd-cell__value flex items-center gap-2">
                        <span
                          className={current ? 'body-sm-bold text-[var(--eco-blue-strong)]' : 'body-sm-medium text-[var(--text-heading)]'}
                        >
                          {item.name}
                        </span>
                        {current && (
                          <Tag variant="success">Hiện tại</Tag>
                        )}
                      </div>
                    </td>

                    {/* Start Date */}
                    <td className="body-sm font-numeric text-[var(--text-subtle)]">
                      <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                        Bắt đầu
                      </span>
                      <div className="ecomd-cell__value">
                        {formatDateDisplay(item.startDate)}
                      </div>
                    </td>

                    {/* End Date */}
                    <td className="body-sm font-numeric text-[var(--text-subtle)]">
                      <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                        Kết thúc
                      </span>
                      <div className="ecomd-cell__value">
                        {formatDateDisplay(item.endDate)}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="body-sm" style={{ textAlign: 'center' }}>
                      <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                        Trạng thái
                      </span>
                      <div className="ecomd-cell__value flex justify-center">
                        {current ? (
                          <StatusTag tone="success" label="Đang áp dụng" icon={true} />
                        ) : (
                          <StatusTag tone="neutral" label="Đã hoàn thành" />
                        )}
                      </div>
                    </td>

                    {/* Action */}
                    <td className="body-sm is-right is-actions" style={{ textAlign: 'right' }}>
                      <div className="ecomd-cell__value flex justify-end">
                        <Button
                          variant="secondary"
                          size="sm"
                          icon="pencil"
                          onClick={() => onEdit(item)}
                        >
                          Chỉnh sửa
                        </Button>
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
      {items.length > 0 && (
        <div className="ecomd-table__footer body-xs text-[var(--text-subtle)] flex items-center justify-between">
          <div>
            Hiển thị <b>{items.length}</b> niên khóa
          </div>
          <div className="hidden sm:block">
            Cấu hình thời gian niên khóa chuẩn áp dụng đồng bộ toàn hệ thống
          </div>
        </div>
      )}
    </div>
  );
};
