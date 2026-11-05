/**
 * Grade Class Table Component
 * Design System: [DS] ECO ME DASHBOARD v2.6.0
 */

import React from 'react';
import Link from 'next/link';
import type { GradeClassItem } from '@/types/grade';
import { Tag, StatusTag, Avatar, Button, EmptyState } from '@/components/ds';

interface GradeClassTableProps {
  schoolCode: string;
  classes: GradeClassItem[];
}

export const GradeClassTable: React.FC<GradeClassTableProps> = ({
  schoolCode,
  classes,
}) => {
  if (classes.length === 0) {
    return (
      <EmptyState
        icon="chalkboard"
        title="Chưa có lớp học nào trong khối này"
        description="Hiện chưa có lớp học nào được phân bổ vào khối này trong niên khóa đã chọn."
      />
    );
  }

  const renderStatusTag = (status: string) => {
    switch (status) {
      case 'active':
        return <StatusTag tone="success" label="Đang hoạt động" icon={true} />;
      case 'paused':
        return <StatusTag tone="warning" label="Tạm dừng" icon={true} />;
      default:
        return <StatusTag tone="neutral" label="Kết thúc" />;
    }
  };

  return (
    <div className="ecomd-table-card">
      <div className="ecomd-table-card__toolbar flex items-center justify-between p-4 border-b border-[var(--border-default)]">
        <div>
          <h4 className="body-sm-bold text-[var(--text-heading)]">Danh Sách Lớp Trong Khối</h4>
          <p className="body-xs text-[var(--text-subtle)] mt-0.5">
            Phân bổ phòng học, giáo viên chủ nhiệm và tình trạng tuyển sinh
          </p>
        </div>
        <span className="body-xs-semibold px-2.5 py-1 rounded-full bg-[var(--bg-selected)] text-[var(--eco-blue-strong)]">
          Tổng cộng: {classes.length} lớp
        </span>
      </div>

      <div className="ecomd-table-scroll">
        <table className="ecomd-table ecomd-table--dense w-full">
          <thead>
            <tr>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ width: '48px', textAlign: 'center' }}>
                STT
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)] is-primary" style={{ minWidth: '160px' }}>
                Tên lớp học
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ width: '110px' }}>
                Phòng học
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ minWidth: '180px' }}>
                Giáo viên chủ nhiệm
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ minWidth: '160px' }}>
                Sĩ số học sinh
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ width: '90px', textAlign: 'center' }}>
                Số GVBM
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ width: '130px', textAlign: 'center' }}>
                Trạng thái
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)] is-right is-actions" style={{ width: '180px', textAlign: 'right' }}>
                Lối tắt
              </th>
            </tr>
          </thead>
          <tbody>
            {classes.map((cls, idx) => {
              return (
                <tr key={cls.id}>
                  {/* 1. STT */}
                  <td className="body-sm" style={{ textAlign: 'center' }}>
                    <span className="body-xs font-numeric text-[var(--text-subtle)]">
                      {idx + 1}
                    </span>
                  </td>

                  {/* 2. Tên lớp học */}
                  <td className="body-sm is-primary">
                    <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                      Tên lớp
                    </span>
                    <div className="ecomd-cell__value flex items-center gap-2">
                      <Tag variant="code">{cls.code}</Tag>
                      <Link
                        href={`/${schoolCode}/school/classes/${cls.id}`}
                        className="body-sm-bold text-[var(--eco-blue-strong)] hover:underline"
                      >
                        {cls.name}
                      </Link>
                    </div>
                  </td>

                  {/* 3. Phòng học */}
                  <td className="body-sm">
                    <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                      Phòng
                    </span>
                    <div className="ecomd-cell__value text-[var(--text-subtle)]">
                      {cls.room || '—'}
                    </div>
                  </td>

                  {/* 4. GVCN */}
                  <td className="body-sm">
                    <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                      GVCN
                    </span>
                    <div className="ecomd-cell__value flex items-center gap-2">
                      {cls.homeroomTeacher ? (
                        <>
                          <Avatar
                            src={cls.homeroomTeacher.avatar}
                            name={cls.homeroomTeacher.fullName}
                            size="sm"
                          />
                          <div>
                            <div className="body-sm-medium text-[var(--text-heading)]">
                              {cls.homeroomTeacher.fullName}
                            </div>
                            <div className="body-xs font-numeric text-[var(--text-subtle)]">
                              {cls.homeroomTeacher.phone}
                            </div>
                          </div>
                        </>
                      ) : (
                        <span className="body-xs text-[var(--semantic-amber)] italic">
                          Chưa phân công
                        </span>
                      )}
                    </div>
                  </td>

                  {/* 5. Sĩ số */}
                  <td className="body-sm font-numeric">
                    <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                      Sĩ số
                    </span>
                    <div className="ecomd-cell__value flex-col">
                      <div className="flex justify-between body-xs mb-1">
                        <span className="font-semibold text-[var(--text-heading)]">
                          {cls.studentCount}/{cls.maxCapacity} HS
                        </span>
                        <span className="text-[var(--text-subtle)]">
                          {Math.round((cls.studentCount / cls.maxCapacity) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-[var(--bg-muted)] h-1.5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[var(--eco-blue-strong)] rounded-full"
                          style={{
                            width: `${Math.min(100, Math.round((cls.studentCount / cls.maxCapacity) * 100))}%`,
                          }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* 6. Số GVBM */}
                  <td className="body-sm font-numeric" style={{ textAlign: 'center' }}>
                    <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                      GVBM
                    </span>
                    <div className="ecomd-cell__value justify-center">
                      <Tag variant="default">{cls.subjectTeacherCount} GV</Tag>
                    </div>
                  </td>

                  {/* 7. Trạng thái */}
                  <td className="body-sm" style={{ textAlign: 'center' }}>
                    <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                      Trạng thái
                    </span>
                    <div className="ecomd-cell__value flex justify-center">
                      {renderStatusTag(cls.status)}
                    </div>
                  </td>

                  {/* 8. Lối tắt */}
                  <td className="body-sm is-right is-actions" style={{ textAlign: 'right' }}>
                    <div className="ecomd-cell__value flex items-center justify-end gap-1.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        href={`/${schoolCode}/class/${cls.id}/attendance`}
                      >
                        Điểm danh
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        href={`/${schoolCode}/school/classes/${cls.id}`}
                      >
                        Chi tiết
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="ecomd-table__footer body-xs text-[var(--text-subtle)] flex items-center justify-between">
        <div>
          Hiển thị <b>{classes.length}</b> lớp học
        </div>
      </div>
    </div>
  );
};
