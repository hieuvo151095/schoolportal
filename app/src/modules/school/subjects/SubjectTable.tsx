/**
 * Subject Table Component
 * Design System: [DS] ECO ME DASHBOARD v2.6.0
 */

import React from 'react';
import type { SchoolSubject } from '@/types/subject';
import {
  formatClassification,
  formatSubjectType
} from '@/utils/subjectValidation';
import { Tag, StatusTag, IconButton, Avatar, DropdownMenu, EmptyState } from '@/components/ds';

interface SubjectTableProps {
  subjects: SchoolSubject[];
  onViewDetail: (subjectId: string) => void;
  onAssignTeacher: (subjectId: string) => void;
}

export const SubjectTable: React.FC<SubjectTableProps> = ({
  subjects,
  onViewDetail,
  onAssignTeacher
}) => {
  if (subjects.length === 0) {
    return (
      <EmptyState
        icon="book-open"
        title="Không tìm thấy môn học nào"
        description="Không có môn học nào phù hợp với điều kiện tìm kiếm hoặc bộ lọc hiện tại. Vui lòng thử lại với từ khóa hoặc tùy chọn khác."
      />
    );
  }

  return (
    <div className="ecomd-table-card">
      <div className="ecomd-table-scroll">
        <table className="ecomd-table ecomd-table--dense w-full">
          <thead>
            <tr>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ width: '48px', textAlign: 'center' }}>
                STT
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ width: '110px' }}>
                Mã môn
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)] is-primary" style={{ minWidth: '180px' }}>
                Tên môn học
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ width: '130px' }}>
                Phân loại
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ width: '130px' }}>
                Loại môn
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ minWidth: '140px' }}>
                Khối lớp áp dụng
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ width: '110px', textAlign: 'center' }}>
                Tính ĐTB
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ minWidth: '190px' }}>
                Giáo viên giảng dạy
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)] is-right is-actions" style={{ width: '70px', textAlign: 'right' }}>
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((subject, index) => {
              const classification = formatClassification(subject.classification);
              const subjectType = formatSubjectType(subject.type);

              const maxTeachers = 3;
              const displayedTeachers = subject.assignedTeachers.slice(0, maxTeachers);
              const remainingCount = subject.assignedTeachers.length - maxTeachers;

              return (
                <tr
                  key={subject.id}
                  onClick={() => onViewDetail(subject.id)}
                  className="cursor-pointer"
                >
                  {/* STT */}
                  <td className="body-sm" style={{ textAlign: 'center' }}>
                    <span className="body-xs font-numeric text-[var(--text-subtle)]">
                      {index + 1}
                    </span>
                  </td>

                  {/* Mã môn */}
                  <td className="body-sm font-mono">
                    <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                      Mã môn
                    </span>
                    <div className="ecomd-cell__value">
                      <Tag variant="code">{subject.code}</Tag>
                    </div>
                  </td>

                  {/* Tên môn học */}
                  <td className="body-sm is-primary">
                    <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                      Tên môn
                    </span>
                    <div className="ecomd-cell__value">
                      <div className="flex items-center gap-2">
                        <span className="body-sm-bold text-[var(--eco-blue-strong)] hover:underline">
                          {subject.name}
                        </span>
                        {subject.isStandardMoET && (
                          <Tag variant="default">Chuẩn BGD</Tag>
                        )}
                      </div>
                      {subject.description && (
                        <p className="body-xs text-[var(--text-subtle)] mt-0.5 truncate max-w-[260px]">
                          {subject.description}
                        </p>
                      )}
                    </div>
                  </td>

                  {/* Phân loại */}
                  <td className="body-sm">
                    <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                      Phân loại
                    </span>
                    <div className="ecomd-cell__value">
                      <Tag variant="default">{classification.label}</Tag>
                    </div>
                  </td>

                  {/* Loại môn */}
                  <td className="body-sm">
                    <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                      Loại môn
                    </span>
                    <div className="ecomd-cell__value">
                      <Tag variant={subject.type === 'bat_buoc' ? 'default' : 'warning'}>
                        {subjectType.label}
                      </Tag>
                    </div>
                  </td>

                  {/* Khối lớp áp dụng */}
                  <td className="body-sm">
                    <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                      Khối áp dụng
                    </span>
                    <div className="ecomd-cell__value flex flex-wrap gap-1">
                      {subject.applicableGrades.map((grade) => (
                        <Tag key={grade} variant="code">
                          {grade}
                        </Tag>
                      ))}
                    </div>
                  </td>

                  {/* Tính điểm tổng kết */}
                  <td className="body-sm" style={{ textAlign: 'center' }}>
                    <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                      Tính ĐTB
                    </span>
                    <div className="ecomd-cell__value flex justify-center">
                      {subject.isCountedForGPA ? (
                        <StatusTag tone="success" label="Có" />
                      ) : (
                        <StatusTag tone="neutral" label="Không" />
                      )}
                    </div>
                  </td>

                  {/* Giáo viên giảng dạy */}
                  <td className="body-sm" onClick={(e) => e.stopPropagation()}>
                    <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                      Giáo viên
                    </span>
                    <div className="ecomd-cell__value flex items-center gap-1.5 flex-wrap">
                      {displayedTeachers.length > 0 ? (
                        <>
                          {displayedTeachers.map((teacher) => (
                            <div
                              key={teacher.teacherId}
                              className="inline-flex items-center gap-1.5 bg-[var(--bg-subtle)] px-2 py-0.5 rounded-full body-xs text-[var(--text-body)]"
                              title={`${teacher.teacherName} (${teacher.teacherCode}) • ${teacher.assignedClassesCount} lớp`}
                            >
                              <Avatar src={teacher.avatarUrl} name={teacher.teacherName} size="sm" />
                              <span className="max-w-[80px] truncate">
                                {teacher.teacherName}
                              </span>
                            </div>
                          ))}
                          {remainingCount > 0 && (
                            <span
                              onClick={() => onViewDetail(subject.id)}
                              className="px-1.5 py-0.5 bg-[var(--bg-selected)] text-[var(--eco-blue-strong)] body-xs-bold rounded-full cursor-pointer"
                              title="Xem toàn bộ danh sách giáo viên"
                            >
                              +{remainingCount} GV
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="body-xs text-[var(--semantic-amber)] italic">
                          Chưa phân công GV
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Thao tác */}
                  <td className="body-sm is-right is-actions" style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
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
                            label: 'Xem chi tiết & phương thức đánh giá',
                            icon: 'eye',
                            onClick: () => onViewDetail(subject.id),
                          },
                          {
                            label: 'Phân công giáo viên bộ môn',
                            icon: 'user-plus',
                            onClick: () => onAssignTeacher(subject.id),
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
      <div className="ecomd-table__footer body-xs text-[var(--text-subtle)] flex items-center justify-between">
        <div>
          Hiển thị <b>{subjects.length}</b> môn học
        </div>
        <div className="hidden sm:block">
          Nhấp vào môn học để xem cấu hình đánh giá 4 học kỳ
        </div>
      </div>
    </div>
  );
};
