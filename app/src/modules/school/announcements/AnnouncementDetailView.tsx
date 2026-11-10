import React, { useState } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { Icon } from '../../../components/ds';
import { Announcement, AnnouncementChannel } from '../../../types/announcement';
import {
  getCategoryLabel,
  getCategoryColorClass,
  getStatusBadge,
  getPriorityBadge,
  getAudienceScopeLabel
} from '../../../utils/announcementValidation';
import DeleteAnnouncementModal from './DeleteAnnouncementModal';

interface AnnouncementDetailViewProps {
  schoolCode: string;
  announcement: Announcement;
  onTogglePin: (id: string) => void;
  onDelete: (id: string) => void;
}

const DetailCard = styled.div`
  background: white;
  border-radius: 0.75rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

export const AnnouncementDetailView: React.FC<AnnouncementDetailViewProps> = ({
  schoolCode,
  announcement,
  onTogglePin,
  onDelete
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const categoryColor = getCategoryColorClass(announcement.category);
  const statusBadge = getStatusBadge(announcement.status);
  const priorityBadge = getPriorityBadge(announcement.priority);

  const readRate =
    announcement.recipientCount > 0
      ? Math.round((announcement.portalReadCount / announcement.recipientCount) * 100)
      : 0;

  const renderChannelPill = (channel: AnnouncementChannel) => {
    switch (channel) {
      case 'portal':
        return (
          <span
            key="portal"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200"
          >
            <Icon name="globe" className="w-3.5 h-3.5" />
            <span>Bảng tin Portal</span>
          </span>
        );
      case 'email':
        return (
          <span
            key="email"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"
          >
            <Icon name="envelope" className="w-3.5 h-3.5" />
            <span>Email</span>
          </span>
        );
      case 'sms':
        return (
          <span
            key="sms"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200"
          >
            <Icon name="comment-dots" className="w-3.5 h-3.5" />
            <span>SMS Brandname</span>
          </span>
        );
      case 'push':
        return (
          <span
            key="push"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200"
          >
            <Icon name="mobile-screen" className="w-3.5 h-3.5" />
            <span>Mobile Push</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top action bar and breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href={`/${schoolCode}/school/announcements`}
          className="text-sm font-semibold text-slate-600 hover:text-blue-600 flex items-center gap-2 transition-colors"
        >
          <Icon name="arrow-left" className="w-4 h-4" />
          <span>Quay lại Bảng thông tin</span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Pin toggle */}
          <button
            type="button"
            onClick={() => onTogglePin(announcement.id)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors flex items-center gap-1.5 ${
              announcement.isPinned
                ? 'bg-amber-50 text-amber-700 border-amber-300'
                : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
            }`}
          >
            <svg className="w-3.5 h-3.5 fill-none stroke-currentColor stroke-2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <span>{announcement.isPinned ? 'Đã ghim' : 'Ghim thông báo'}</span>
          </button>

          {/* Edit (Draft only) */}
          {announcement.status === 'nhap' && (
            <Link
              href={`/${schoolCode}/school/announcements/edit/${announcement.id}`}
              className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Icon name="pencil" className="w-3.5 h-3.5" />
              <span>Chỉnh sửa nháp</span>
            </Link>
          )}

          {/* Delete */}
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="px-3 py-1.5 text-xs font-semibold bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Icon name="trash" className="w-3.5 h-3.5" />
            <span>Xóa thông báo</span>
          </button>
        </div>
      </div>

      {/* Main Announcement Card */}
      <DetailCard>
        {/* Badges & Meta strip */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${categoryColor.bg} ${categoryColor.text} ${categoryColor.border}`}
          >
            {getCategoryLabel(announcement.category)}
          </span>

          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusBadge.bg} ${statusBadge.text}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dot}`} />
            <span>{statusBadge.label}</span>
          </span>

          {announcement.priority !== 'normal' && (
            <span
              className={`text-xs uppercase tracking-wider px-2 py-0.5 rounded border ${
                announcement.priority === 'urgent'
                  ? 'bg-rose-50 text-rose-700 border-rose-200 font-bold'
                  : 'bg-amber-50 text-amber-700 border-amber-200 font-semibold'
              }`}
            >
              {priorityBadge.label}
            </span>
          )}

          {announcement.isPinned && (
            <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded font-semibold flex items-center gap-1">
              <svg className="w-3 h-3 fill-none stroke-currentColor stroke-2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              <span>Ghim đầu trang</span>
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800 leading-snug mb-3">
          {announcement.title}
        </h1>

        {/* Author & Timestamp */}
        <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500 pb-4 border-b border-slate-100">
          <div>
            Người đăng: <strong className="text-slate-700">{announcement.authorName}</strong> ({announcement.authorRole})
          </div>
          <div>•</div>
          <div>
            Khởi tạo:{' '}
            {new Date(announcement.createdAt).toLocaleString('vi-VN', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
          {announcement.publishedAt && (
            <>
              <div>•</div>
              <div>
                Phát hành:{' '}
                {new Date(announcement.publishedAt).toLocaleString('vi-VN', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </>
          )}
          {announcement.scheduledAt && (
            <>
              <div>•</div>
              <div className="text-purple-600 font-semibold">
                Lên lịch phát hành:{' '}
                {new Date(announcement.scheduledAt).toLocaleString('vi-VN', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </>
          )}
        </div>

        {/* Transmission & Audience Scope strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 border-b border-slate-100 text-xs">
          <div>
            <div className="font-bold text-slate-600 mb-1.5 uppercase tracking-wider text-[11px]">
              Kênh phát hành
            </div>
            <div className="flex flex-wrap gap-1.5">
              {announcement.channels.map(renderChannelPill)}
            </div>
          </div>

          <div>
            <div className="font-bold text-slate-600 mb-1.5 uppercase tracking-wider text-[11px]">
              Phạm vi đối tượng
            </div>
            <div className="flex items-center gap-2 text-slate-700 font-medium">
              <Icon name="users" className="w-4 h-4 text-slate-400" />
              <span>{getAudienceScopeLabel(announcement.audienceScope)}</span>
              <span className="text-slate-400">
                (~{announcement.recipientCount.toLocaleString('vi-VN')} người nhận)
              </span>
            </div>
          </div>
        </div>

        {/* Content body */}
        <div className="py-6 text-slate-800 leading-relaxed font-sans prose prose-slate max-w-none">
          <div dangerouslySetInnerHTML={{ __html: announcement.content }} />
        </div>

        {/* Attachments Section */}
        {announcement.attachments.length > 0 && (
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Icon name="paperclip" className="w-4 h-4 text-blue-600" />
              <span>Tệp đính kèm ({announcement.attachments.length})</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {announcement.attachments.map(att => (
                <div
                  key={att.id}
                  className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <div className="w-8 h-8 rounded bg-blue-100 text-blue-600 flex items-center justify-center font-bold uppercase text-[10px]">
                      {att.fileType}
                    </div>
                    <div className="overflow-hidden">
                      <p className="font-semibold text-slate-800 truncate" title={att.fileName}>
                        {att.fileName}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {(att.fileSize / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <a
                    href={att.fileUrl}
                    download={att.fileName}
                    className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-200 rounded transition-colors"
                    title="Tải tệp tin về máy"
                  >
                    <svg className="w-4 h-4 fill-none stroke-currentColor stroke-2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </DetailCard>

      {/* Recipient Statistics Card (if sent) */}
      {announcement.status === 'da_gui' && (
        <DetailCard>
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Icon name="circle-check" className="w-4 h-4 text-emerald-600" />
            <span>Thống kê tiếp cận & Đọc thông báo</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-center">
              <div className="text-xs text-slate-500">Tổng người nhận</div>
              <div className="text-xl font-bold text-slate-800 mt-1">
                {announcement.recipientCount.toLocaleString('vi-VN')}
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-center">
              <div className="text-xs text-slate-500">Email đã phát ra</div>
              <div className="text-xl font-bold text-emerald-600 mt-1">
                {announcement.emailSentCount.toLocaleString('vi-VN')}
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-center">
              <div className="text-xs text-slate-500">Lượt đã mở xem</div>
              <div className="text-xl font-bold text-blue-600 mt-1">
                {announcement.portalReadCount.toLocaleString('vi-VN')}
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1">
              <span>Tỷ lệ tiếp cận trên Portal</span>
              <span>{readRate}%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${readRate}%` }}
              />
            </div>
          </div>
        </DetailCard>
      )}

      {/* Delete confirmation modal */}
      <DeleteAnnouncementModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => onDelete(announcement.id)}
        announcementTitle={announcement.title}
      />
    </div>
  );
};

export default AnnouncementDetailView;
