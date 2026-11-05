import React from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  deleteAssignment,
  sendAssignment,
} from '../../../store/slices/assignmentSlice';
import {
  calculateSubmissionTally,
  filterAssignments,
  formatAssignmentDate,
  getAssignmentActions,
} from '../../../utils/assignmentValidation';
import {
  Tag,
  StatusTag,
  IconButton,
  DropdownMenu,
  Icon,
  EmptyState,
} from '@/components/ds';

interface AssignmentTableProps {
  schoolCode: string;
}

export const AssignmentTable: React.FC<AssignmentTableProps> = ({ schoolCode }) => {
  const dispatch = useAppDispatch();
  const assignments = useAppSelector((state) => state.assignment.assignments);
  const filterCriteria = useAppSelector(
    (state) => state.assignment.filterCriteria
  );

  const filteredAssignments = filterAssignments(assignments, filterCriteria);

  const handleSend = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn gửi bài tập này đến học sinh/phụ huynh?')) {
      dispatch(sendAssignment(id));
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa bài tập này?')) {
      dispatch(deleteAssignment(id));
    }
  };

  if (filteredAssignments.length === 0) {
    return (
      <EmptyState
        icon="book-open"
        title="Không tìm thấy bài tập nào"
        description="Hãy thử thay đổi bộ lọc hoặc thêm bài tập mới cho lớp học."
      />
    );
  }

  const now = Date.now();

  return (
    <div className="ecomd-table-scroll">
      <table className="ecomd-table w-full">
        <thead>
          <tr>
            <th className="body-xs-semibold text-[var(--text-subtle)] is-primary" style={{ width: '32%' }}>
              Bài tập &amp; môn học
            </th>
            <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ width: '14%' }}>
              Giao cho
            </th>
            <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ width: '16%' }}>
              Hạn nộp bài
            </th>
            <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ width: '16%' }}>
              Tiến độ nộp
            </th>
            <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ width: '12%' }}>
              Trạng thái
            </th>
            <th className="body-xs-semibold text-[var(--text-subtle)] is-right is-actions" style={{ width: '10%', textAlign: 'right' }}>
              <span className="sr-only">Thao tác</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredAssignments.map((assignment) => {
            const tally = calculateSubmissionTally(assignment.submissions);
            const actions = getAssignmentActions(assignment);
            const isDuePassed = new Date(assignment.dueDate).getTime() < now;

            const menuItems = [
              {
                label: 'Xem chi tiết',
                href: `/${schoolCode}/school/assignment/${assignment.id}`,
              },
              ...(actions.canEdit
                ? [
                    {
                      label: 'Chỉnh sửa',
                      href: `/${schoolCode}/school/assignment/edit/${assignment.id}`,
                    },
                  ]
                : []),
              ...(actions.canSend && assignment.status !== 'da_gui'
                ? [
                    {
                      label: 'Gửi thông báo',
                      onClick: () => handleSend(assignment.id),
                    },
                  ]
                : []),
              ...(actions.canDelete
                ? [
                    { divider: true as const },
                    {
                      label: 'Xóa bài tập',
                      tone: 'danger' as const,
                      onClick: () => handleDelete(assignment.id),
                    },
                  ]
                : []),
            ];

            return (
              <tr key={assignment.id}>
                {/* Title & Subject */}
                <td className="body-sm is-primary">
                  <div className="ecomd-cell__value">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', minWidth: 0 }}>
                      <Link
                        href={`/${schoolCode}/school/assignment/${assignment.id}`}
                        className="body-sm-bold text-[var(--text-heading)] hover:text-[var(--eco-blue-strong)] hover:underline inline-block"
                      >
                        {assignment.title}
                      </Link>
                      <div className="body-xs flex items-center gap-1.5 flex-wrap text-[var(--text-subtle)]">
                        <Tag variant="default">{assignment.subjectName}</Tag>
                        <Tag variant="default">{assignment.className}</Tag>
                        {assignment.attachments.length > 0 && (
                          <span
                            className="body-xs text-[var(--text-subtle)] inline-flex items-center gap-1"
                            title={`${assignment.attachments.length} tệp đính kèm`}
                          >
                            <Icon name="paperclip" size={12} />
                            <span>{assignment.attachments.length} tệp</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Audience */}
                <td className="body-sm">
                  <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                    Giao cho
                  </span>
                  <div className="ecomd-cell__value">
                    <span className="body-sm text-[var(--text-body)]" style={{ whiteSpace: 'nowrap' }}>
                      {assignment.audienceType === 'whole_class'
                        ? 'Cả lớp'
                        : `${assignment.targetStudentIds.length} học sinh`}
                    </span>
                  </div>
                </td>

                {/* Due Date */}
                <td className="body-sm">
                  <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                    Hạn nộp bài
                  </span>
                  <div className="ecomd-cell__value">
                    <div className="flex flex-col items-start gap-1">
                      <span
                        className="body-sm font-numeric text-[var(--text-heading)]"
                        style={{ whiteSpace: 'nowrap' }}
                      >
                        {formatAssignmentDate(assignment.dueDate)}
                      </span>
                      {isDuePassed && (
                        <StatusTag tone="danger" label="Đã hết hạn" />
                      )}
                    </div>
                  </div>
                </td>

                {/* Submission Progress */}
                <td className="body-sm">
                  <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                    Tiến độ nộp
                  </span>
                  <div className="ecomd-cell__value">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', minWidth: '120px' }}>
                      <div className="flex items-center justify-between body-xs-semibold font-numeric text-[var(--text-body)]">
                        <span>{tally.submittedCount}/{tally.total} đã nộp</span>
                        <span className="text-[var(--text-subtle)] font-normal">{tally.submissionRate}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-[var(--bg-muted)] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[var(--eco-blue-strong)] rounded-full transition-all"
                          style={{ width: `${tally.submissionRate}%` }}
                        />
                      </div>
                      <span className="body-xs text-[var(--text-subtle)]">
                        {tally.evaluatedCount} bài đã chấm
                      </span>
                    </div>
                  </div>
                </td>

                {/* Lifecycle Status */}
                <td className="body-sm">
                  <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                    Trạng thái
                  </span>
                  <div className="ecomd-cell__value">
                    <div className="flex flex-col items-start gap-1">
                      {assignment.status === 'da_tao' && (
                        <StatusTag tone="neutral" label="Bản nháp" />
                      )}
                      {assignment.status === 'chua_gui' && (
                        <div>
                          <StatusTag tone="warning" label="Chưa gửi" />
                          {assignment.scheduledSendDate && (
                            <div className="body-xs text-[var(--text-subtle)] mt-0.5" style={{ whiteSpace: 'nowrap' }}>
                              Lên lịch: {formatAssignmentDate(assignment.scheduledSendDate)}
                            </div>
                          )}
                        </div>
                      )}
                      {assignment.status === 'da_gui' && (
                        <StatusTag tone="success" label="Đã gửi" />
                      )}
                      {assignment.status === 'da_thu_hoi' && (
                        <StatusTag tone="danger" label="Đã thu hồi" />
                      )}
                    </div>
                  </div>
                </td>

                {/* Action Menu */}
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
                      items={menuItems}
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AssignmentTable;
