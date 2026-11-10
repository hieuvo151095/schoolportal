/**
 * Announcement Table Component
 * Design System: [DS] ECO ME DASHBOARD v2.6.0
 */

import React from 'react';
import Link from 'next/link';
import {
  Announcement,
  AnnouncementChannel
} from '../../../types/announcement';
import {
  getCategoryLabel,
  getAudienceScopeLabel
} from '../../../utils/announcementValidation';
import { Tag, StatusTag, IconButton, Icon, DropdownMenu, Checkbox, EmptyState } from '../../../components/ds';

interface AnnouncementTableProps {
  schoolCode: string;
  announcements: Announcement[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onSelectAll: (ids: string[]) => void;
  onTogglePin: (id: string) => void;
  onOpenDeleteModal: (announcement: Announcement) => void;
  onOpenEdit?: (announcement: Announcement) => void;
}

export const AnnouncementTable: React.FC<AnnouncementTableProps> = ({
  schoolCode,
  announcements,
  selectedIds,
  onToggleSelect,
  onSelectAll,
  onTogglePin,
  onOpenDeleteModal,
  onOpenEdit,
}) => {
  const allSelected =
    announcements.length > 0 && announcements.every(a => selectedIds.includes(a.id));

  const handleSelectAllChange = () => {
    if (allSelected) {
      onSelectAll([]);
    } else {
      onSelectAll(announcements.map(a => a.id));
    }
  };

  const renderChannelIcon = (channel: AnnouncementChannel) => {
    switch (channel) {
      case 'portal':
        return (
          <span
            key="portal"
            title="Bảng tin Portal"
            className="w-5 h-5 rounded bg-[var(--bg-selected)] text-[var(--eco-blue-strong)] inline-flex items-center justify-center text-xs"
          >
            <Icon name="bullhorn" size={11} />
          </span>
        );
      case 'email':
        return (
          <span
            key="email"
            title="Email"
            className="w-5 h-5 rounded bg-emerald-50 text-emerald-600 inline-flex items-center justify-center text-xs"
          >
            <Icon name="envelope" size={11} />
          </span>
        );
      case 'sms':
        return (
          <span
            key="sms"
            title="SMS Brandname"
            className="w-5 h-5 rounded bg-amber-50 text-amber-600 inline-flex items-center justify-center text-xs"
          >
            <Icon name="comment-dots" size={11} />
          </span>
        );
      case 'push':
        return (
          <span
            key="push"
            title="App Mobile Notification"
            className="w-5 h-5 rounded bg-purple-50 text-purple-600 inline-flex items-center justify-center text-xs"
          >
            <Icon name="bell" size={11} />
          </span>
        );
      default:
        return null;
    }
  };

  const renderStatus = (status: Announcement['status']) => {
    switch (status) {
      case 'da_gui':
        return <StatusTag tone="success" label="Đã gửi" icon={true} />;
      case 'da_len_lich':
        return <StatusTag tone="info" label="Đã lên lịch" icon={true} />;
      case 'nhap':
        return <StatusTag tone="neutral" label="Bản nháp" />;
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
              <th className="is-checkbox" style={{ width: '40px', textAlign: 'center' }}>
                <Checkbox
                  checked={allSelected}
                  onChange={handleSelectAllChange}
                  aria-label="Chọn tất cả thông báo"
                />
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ width: '44px', textAlign: 'center' }}>
                Ghim
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)] is-primary" style={{ minWidth: '220px' }}>
                Thông báo & Nội dung
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ width: '130px' }}>
                Đối tượng
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ width: '120px' }}>
                Kênh gửi
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ width: '120px' }}>
                Thời gian
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ width: '120px' }}>
                Trạng thái
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)] is-right is-actions" style={{ width: '70px', textAlign: 'right' }}>
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {announcements.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-0">
                  <EmptyState
                    icon="bullhorn"
                    title="Không tìm thấy thông báo nào"
                    description="Không có thông báo nào phù hợp với điều kiện tìm kiếm hoặc bộ lọc hiện tại."
                  />
                </td>
              </tr>
            ) : (
              announcements.map((announcement) => {
                const isSelected = selectedIds.includes(announcement.id);
                const isDraft = announcement.status === 'nhap';

                return (
                  <tr
                    key={announcement.id}
                    className={isSelected ? 'is-selected' : undefined}
                  >
                    {/* Checkbox */}
                    <td className="is-checkbox" style={{ textAlign: 'center' }}>
                      <Checkbox
                        checked={isSelected}
                        onChange={() => onToggleSelect(announcement.id)}
                        aria-label={`Chọn ${announcement.title}`}
                      />
                    </td>

                    {/* Pin button */}
                    <td className="body-sm" style={{ textAlign: 'center' }}>
                      <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                        Ghim
                      </span>
                      <div className="ecomd-cell__value justify-center">
                        <button
                          type="button"
                          onClick={() => onTogglePin(announcement.id)}
                          className={`p-1 border-0 bg-transparent cursor-pointer transition-colors ${
                            announcement.isPinned
                              ? 'text-[var(--semantic-warning)] hover:text-amber-600'
                              : 'text-[var(--text-subtle)] hover:text-[var(--text-heading)]'
                          }`}
                          title={announcement.isPinned ? 'Bỏ ghim thông báo' : 'Ghim thông báo lên đầu'}
                        >
                          <Icon name="bookmark" size={14} />
                        </button>
                      </div>
                    </td>

                    {/* Tiêu đề & Nội dung tóm tắt */}
                    <td className="body-sm is-primary">
                      <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                        Thông báo
                      </span>
                      <div className="ecomd-cell__value">
                        <div className="flex items-center gap-2">
                          <Tag variant="default">{getCategoryLabel(announcement.category)}</Tag>
                          <Link
                            href={`/${schoolCode}/school/announcements/${announcement.id}`}
                            className="body-sm-bold text-[var(--eco-blue-strong)] hover:underline block"
                          >
                            {announcement.title}
                          </Link>
                        </div>
                        <div className="body-xs text-[var(--text-subtle)] mt-1">
                          Người gửi: <b className="text-[var(--text-body)]">{announcement.authorName}</b> • {announcement.authorRole}
                        </div>
                      </div>
                    </td>

                    {/* Đối tượng */}
                    <td className="body-sm">
                      <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                        Đối tượng
                      </span>
                      <div className="ecomd-cell__value">
                        <Tag variant="default">{getAudienceScopeLabel(announcement.audienceScope)}</Tag>
                      </div>
                    </td>

                    {/* Kênh gửi */}
                    <td className="body-sm">
                      <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                        Kênh gửi
                      </span>
                      <div className="ecomd-cell__value flex items-center gap-1">
                        {announcement.channels.map((ch) => renderChannelIcon(ch))}
                      </div>
                    </td>

                    {/* Thời gian */}
                    <td className="body-sm font-numeric text-[var(--text-body)]">
                      <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                        Thời gian
                      </span>
                      <div className="ecomd-cell__value">
                        {announcement.publishedAt
                          ? new Date(announcement.publishedAt).toLocaleDateString('vi-VN')
                          : announcement.scheduledAt
                          ? new Date(announcement.scheduledAt).toLocaleDateString('vi-VN')
                          : new Date(announcement.createdAt).toLocaleDateString('vi-VN')}
                      </div>
                    </td>

                    {/* Trạng thái */}
                    <td className="body-sm">
                      <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                        Trạng thái
                      </span>
                      <div className="ecomd-cell__value">
                        {renderStatus(announcement.status)}
                      </div>
                    </td>

                    {/* Thao tác */}
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
                              label: 'Xem chi tiết',
                              icon: 'eye',
                              href: `/${schoolCode}/school/announcements/${announcement.id}`,
                            },
                            ...(isDraft
                              ? [
                                  {
                                    label: 'Chỉnh sửa bản nháp',
                                    icon: 'pen-to-square' as const,
                                    onClick: onOpenEdit ? () => onOpenEdit(announcement) : undefined,
                                    href: onOpenEdit ? undefined : `/${schoolCode}/school/announcements/edit/${announcement.id}`,
                                  },
                                ]
                              : []),
                            {
                              label: announcement.isPinned ? 'Bỏ ghim thông báo' : 'Ghim thông báo',
                              icon: 'bookmark',
                              onClick: () => onTogglePin(announcement.id),
                            },
                            {
                              divider: true,
                            },
                            {
                              label: 'Xóa thông báo',
                              icon: 'trash',
                              tone: 'danger',
                              onClick: () => onOpenDeleteModal(announcement),
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
      {announcements.length > 0 && (
        <div className="ecomd-table__footer body-xs text-[var(--text-subtle)] flex items-center justify-between">
          <div>
            Hiển thị <b>{announcements.length}</b> thông báo
          </div>
          <div className="hidden sm:block">
            Kênh liên lạc chính thống nhà trường kết nối Phụ huynh, Học sinh và Cán bộ giáo viên
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnouncementTable;
