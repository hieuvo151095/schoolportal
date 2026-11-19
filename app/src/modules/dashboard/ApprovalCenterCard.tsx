import React from 'react';
import Link from 'next/link';
import { EmptyState, Icon, IconButton, StatusTag } from '@/components/ds';
import type { ApprovalPendingClassItem } from '@/types/dashboard';

interface ApprovalCenterCardProps {
  items: ApprovalPendingClassItem[];
  schoolCode: string;
  onRefresh: () => void;
}

export const ApprovalCenterCard: React.FC<ApprovalCenterCardProps> = ({
  items,
  schoolCode,
  onRefresh,
}) => {
  const totalPending = items.reduce((s, it) => s + it.pendingCount, 0);

  return (
    <div
      data-testid="approval-center-card"
      className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[var(--radius-12)] p-4 sm:p-5 flex flex-col justify-between shadow-2xs min-w-0 h-full"
    >
      {/* Header */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-[var(--radius-8)] bg-[var(--semantic-warning-soft)] flex items-center justify-center shrink-0">
              <Icon
                name="clipboard-list"
                size={14}
                color="var(--semantic-warning-strong)"
              />
            </div>
            <h2 className="body-md-bold text-[var(--text-heading)]">
              Trung Tâm Kiểm Duyệt
            </h2>
          </div>

          <IconButton
            icon="arrow-rotate-right"
            size="sm"
            label="Làm mới danh sách kiểm duyệt"
            onClick={onRefresh}
          />
        </div>

        <div className="flex items-center justify-between text-xs font-semibold text-[var(--eco-blue-strong)] mb-2.5">
          <span>Hoạt động chờ duyệt</span>
          <StatusTag
            tone={totalPending > 0 ? 'warning' : 'success'}
            label={totalPending > 0 ? `${totalPending} chờ duyệt` : 'Đã duyệt hết'}
          />
        </div>
      </div>

      {/* Table Content */}
      <div className="flex-1 border border-[var(--border-subtle)] rounded-[var(--radius-8)] overflow-hidden flex flex-col">
        <div className="max-h-[260px] overflow-y-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-10 bg-[var(--bg-subtle)] border-b border-[var(--border-default)]">
              <tr>
                <th className="py-2.5 px-3 text-xs font-semibold text-[var(--text-subtle)]">
                  Lớp học
                </th>
                <th className="py-2.5 px-3 text-xs font-semibold text-[var(--text-subtle)] text-right whitespace-nowrap">
                  Hoạt động chờ duyệt
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={2} className="p-4">
                    <EmptyState
                      icon="circle-check"
                      title="Chưa có hoạt động cần duyệt"
                      description="Tất cả bài đăng hoạt động trong phạm vi đã được phê duyệt."
                    />
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr
                    key={item.classId}
                    className="hover:bg-[var(--bg-sunken)] transition-colors"
                  >
                    <td className="py-2.5 px-3">
                      <Link
                        href={`/${schoolCode}/class/${item.classId}/activity?tab=cho_duyet`}
                        className="text-[13px] font-semibold text-[var(--eco-blue-strong)] hover:underline"
                      >
                        {item.className}
                      </Link>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <Link
                        href={`/${schoolCode}/class/${item.classId}/activity?tab=cho_duyet`}
                        className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[var(--color-semantic-orange)] hover:underline font-tabular"
                      >
                        <span>{item.pendingCount} bài</span>
                        <Icon name="arrow-right" size={10} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Total Count */}
      <div className="mt-2.5 flex items-center justify-between text-[11px] text-[var(--text-subtle)]">
        <span className="inline-flex items-center gap-1.5 font-medium text-[var(--text-secondary)]">
          <Icon name="clipboard-list" size={12} />
          Tổng: <strong className="text-[var(--text-heading)]">{totalPending}</strong>
        </span>
        <Link
          href={`/${schoolCode}/class/lop-1a1/activity`}
          className="font-semibold text-[var(--eco-blue-strong)] hover:underline"
        >
          Mở danh sách Hoạt động →
        </Link>
      </div>
    </div>
  );
};
