import React from 'react';
import Link from 'next/link';
import { EmptyState, Icon, Tag } from '@/components/ds';
import type { BulletinBoardItem } from '@/types/dashboard';

interface BulletinBoardCardProps {
  items: BulletinBoardItem[];
  schoolCode: string;
}

export const BulletinBoardCard: React.FC<BulletinBoardCardProps> = ({
  items,
  schoolCode,
}) => {
  return (
    <div
      data-testid="bulletin-board-card"
      className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[var(--radius-12)] p-4 sm:p-5 flex flex-col justify-between shadow-2xs min-w-0 h-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-[var(--radius-8)] bg-[var(--semantic-info-soft)] flex items-center justify-center shrink-0">
            <Icon name="bullhorn" size={14} color="var(--eco-blue-strong)" />
          </div>
          <h2 className="body-md-bold text-[var(--text-heading)]">
            Bảng Thông Tin
          </h2>
        </div>

        <Link
          href={`/${schoolCode}/school/announcements`}
          className="text-xs font-semibold text-[var(--eco-blue-strong)] hover:underline inline-flex items-center gap-1"
        >
          <span>Xem tất cả</span>
          <Icon name="arrow-right" size={10} />
        </Link>
      </div>

      {/* Scrollable DS Table */}
      <div className="flex-1 border border-[var(--border-subtle)] rounded-[var(--radius-8)] overflow-hidden flex flex-col">
        <div className="max-h-[290px] overflow-y-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-10 bg-[var(--bg-subtle)] border-b border-[var(--border-default)]">
              <tr>
                <th className="py-2.5 px-3 text-xs font-semibold text-[var(--text-subtle)]">
                  Tiêu đề
                </th>
                <th className="py-2.5 px-3 text-xs font-semibold text-[var(--text-subtle)] text-right whitespace-nowrap w-20">
                  Ngày gửi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={2} className="p-4">
                    <EmptyState
                      icon="bullhorn"
                      title="Chưa có thông báo mới"
                      description="Không có bản tin nào trong phạm vi đã chọn."
                    />
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-[var(--bg-sunken)] transition-colors"
                  >
                    <td className="py-2.5 px-3 align-top">
                      <Link
                        href={`/${schoolCode}/school/announcements`}
                        className="text-[13px] font-semibold text-[var(--eco-blue-strong)] hover:underline line-clamp-2 leading-snug"
                      >
                        {item.title}
                      </Link>
                      <div className="mt-1 flex items-center gap-1.5 text-[11px] text-[var(--text-subtle)]">
                        <span>Gửi đến</span>
                        <Tag variant="default">{item.targetAudience}</Tag>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-right align-top text-xs text-[var(--text-subtle)] whitespace-nowrap font-tabular">
                      {item.timeAgo}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-2.5 text-[11px] text-[var(--text-subtle)] flex items-center justify-between">
        <span>Tổng số: {items.length} bản tin gần nhất</span>
        <span>Đồng bộ từ Bảng thông tin</span>
      </div>
    </div>
  );
};
