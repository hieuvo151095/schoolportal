/**
 * Poll Table Component
 * Design System: [DS] ECO ME DASHBOARD v2.6.0
 */

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Poll } from '@/types/poll';
import { formatPollDeadline } from '@/utils/pollValidation';
import { StatusTag, Tag, IconButton, DropdownMenu, Icon, EmptyState } from '@/components/ds';

interface PollTableProps {
  polls: Poll[];
  onOpenSendModal: (pollId: string) => void;
  onOpenDeleteModal: (pollId: string) => void;
  onOpenEdit?: (poll: Poll) => void;
}

export const PollTable: React.FC<PollTableProps> = ({
  polls,
  onOpenSendModal,
  onOpenDeleteModal,
  onOpenEdit,
}) => {
  const router = useRouter();
  const { schoolCode } = router.query;
  const currentSchoolCode = (schoolCode as string) || 'demo';

  const renderStatusBadge = (status: Poll['status']) => {
    switch (status) {
      case 'da_gui':
        return <StatusTag tone="success" label="Đang diễn ra" icon={true} />;
      case 'da_tao':
        return <StatusTag tone="neutral" label="Bản nháp" />;
      case 'da_dong':
        return <StatusTag tone="info" label="Đã đóng" icon={true} />;
      default:
        return null;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  if (polls.length === 0) {
    return (
      <EmptyState
        icon="square-poll-vertical"
        title="Không tìm thấy cuộc bình chọn nào"
        description="Thử thay đổi bộ lọc trạng thái, lớp học hoặc từ khóa tìm kiếm."
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
              <th className="body-xs-semibold text-[var(--text-subtle)] is-primary" style={{ minWidth: '280px' }}>
                Chủ đề bình chọn
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ minWidth: '180px' }}>
                Đối tượng gửi
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ width: '120px' }}>
                Ngày tạo
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ textAlign: 'center', width: '130px' }}>
                Trạng thái
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)] is-right is-actions" style={{ textAlign: 'right', width: '70px' }}>
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {polls.map((poll, index) => {
              const isDraft = poll.status === 'da_tao';
              const detailHref = `/${currentSchoolCode}/school/poll/${poll.id}`;

              const menuItems: Array<{ label: string; onClick?: () => void; href?: string; tone?: 'default' | 'danger'; divider?: boolean; icon?: any }> = [
                {
                  label: 'Xem chi tiết',
                  icon: 'eye',
                  href: detailHref,
                },
              ];

              if (isDraft) {
                menuItems.push(
                  {
                    label: 'Chỉnh sửa bình chọn',
                    icon: 'pen-to-square',
                    onClick: onOpenEdit ? () => onOpenEdit(poll) : undefined,
                    href: onOpenEdit ? undefined : `/${currentSchoolCode}/school/poll/edit/${poll.id}`,
                  },
                  {
                    label: 'Gửi bình chọn',
                    icon: 'paper-plane',
                    onClick: () => onOpenSendModal(poll.id),
                  },
                  { divider: true, label: '' },
                  {
                    label: 'Xóa bình chọn',
                    tone: 'danger',
                    icon: 'trash',
                    onClick: () => onOpenDeleteModal(poll.id),
                  }
                );
              }

              return (
                <tr key={poll.id}>
                  {/* STT */}
                  <td className="body-sm" style={{ textAlign: 'center' }}>
                    <span className="body-xs font-numeric text-[var(--text-subtle)]">
                      {index + 1}
                    </span>
                  </td>

                  {/* Title & Metadata */}
                  <td className="body-sm is-primary">
                    <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                      Chủ đề
                    </span>
                    <div className="ecomd-cell__value">
                      <Link
                        href={detailHref}
                        className="body-sm-bold text-[var(--text-heading)] hover:underline block"
                      >
                        {poll.title}
                      </Link>
                      <div className="body-xs text-[var(--text-subtle)] mt-0.5 flex items-center gap-1.5">
                        <Icon name="calendar-days" size={12} />
                        <span className="font-numeric">{formatPollDeadline(poll.deadline)}</span>
                      </div>
                    </div>
                  </td>

                  {/* Target Audience */}
                  <td className="body-sm">
                    <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                      Đối tượng
                    </span>
                    <div className="ecomd-cell__value flex items-center gap-1.5">
                      <Icon
                        name={poll.audienceScope === 'toan_truong' ? 'school' : 'chalkboard'}
                        size={13}
                      />
                      {poll.audienceScope === 'toan_truong' ? (
                        <Tag variant="default">Toàn trường</Tag>
                      ) : poll.targetClassNames && poll.targetClassNames.length > 0 ? (
                        <span className="body-xs font-medium text-[var(--text-body)]">
                          {poll.targetClassNames.join('; ')}
                        </span>
                      ) : (
                        <span className="body-xs text-[var(--text-subtle)] italic">Chưa gán</span>
                      )}
                    </div>
                  </td>

                  {/* Created At */}
                  <td className="body-sm font-numeric text-[var(--text-subtle)]">
                    <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                      Ngày tạo
                    </span>
                    <div className="ecomd-cell__value">
                      {formatDate(poll.createdAt)}
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="body-sm" style={{ textAlign: 'center' }}>
                    <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                      Trạng thái
                    </span>
                    <div className="ecomd-cell__value flex justify-center">
                      {renderStatusBadge(poll.status)}
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
                        items={menuItems.map((item) =>
                          item.divider
                            ? { divider: true }
                            : {
                                label: item.label,
                                href: item.href,
                                icon: item.icon,
                                onClick: item.onClick,
                                tone: item.tone,
                              }
                        )}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="ecomd-table__footer body-xs text-[var(--text-subtle)] flex items-center justify-between">
        <div>
          Hiển thị <b>{polls.length}</b> cuộc bình chọn
        </div>
      </div>
    </div>
  );
};

export default PollTable;
