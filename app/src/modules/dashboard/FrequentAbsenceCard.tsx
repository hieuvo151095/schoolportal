import React from 'react';
import Link from 'next/link';
import { EmptyState, Icon, StatusTag, Tag } from '@/components/ds';
import type { FrequentAbsenceStudentItem } from '@/types/dashboard';

interface FrequentAbsenceCardProps {
  items: FrequentAbsenceStudentItem[];
  schoolCode: string;
  monthLabel?: string;
}

export const FrequentAbsenceCard: React.FC<FrequentAbsenceCardProps> = ({
  items,
  schoolCode,
  monthLabel = 'tháng 11',
}) => {
  return (
    <div
      data-testid="frequent-absence-card"
      className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[var(--radius-12)] p-4 sm:p-5 flex flex-col justify-between shadow-2xs min-w-0 h-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-[var(--radius-8)] bg-[var(--semantic-danger-soft)] flex items-center justify-center shrink-0">
            <Icon name="user-clock" size={14} color="var(--color-danger)" />
          </div>
          <h2 className="text-[15px] font-bold text-[var(--text-heading)] leading-snug truncate">
            Học Sinh Vắng Nhiều ({monthLabel})
          </h2>
        </div>

        <Link
          href={`/${schoolCode}/reports/attendance`}
          className="text-xs font-semibold text-[var(--eco-blue-strong)] hover:underline inline-flex items-center gap-1 whitespace-nowrap shrink-0"
        >
          <span>Báo cáo</span>
          <Icon name="arrow-right" size={10} />
        </Link>
      </div>

      {/* Table Content */}
      <div className="flex-1 border border-[var(--border-subtle)] rounded-[var(--radius-8)] overflow-hidden flex flex-col">
        <div className="max-h-[290px] overflow-y-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-10 bg-[var(--bg-subtle)] border-b border-[var(--border-default)]">
              <tr>
                <th className="py-2.5 px-3 text-xs font-semibold text-[var(--text-subtle)]">
                  Họ và tên
                </th>
                <th className="py-2.5 px-3 text-xs font-semibold text-[var(--text-subtle)] text-right whitespace-nowrap">
                  Số ngày vắng
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={2} className="p-4">
                    <EmptyState
                      icon="circle-check"
                      title="Chưa có học sinh vắng nhiều"
                      description="Tỷ lệ chuyên cần trong tháng đang duy trì rất tốt."
                    />
                  </td>
                </tr>
              ) : (
                items.map((st) => (
                  <tr
                    key={st.studentId}
                    className="hover:bg-[var(--bg-sunken)] transition-colors"
                  >
                    <td className="py-2.5 px-3 align-top">
                      <Link
                        href={`/${schoolCode}/class/lop-1a1/attendance`}
                        className="text-[13px] font-semibold text-[var(--eco-blue-strong)] hover:underline block"
                      >
                        {st.studentName}
                      </Link>
                      <div className="mt-1 flex items-center gap-1.5 text-[11px] text-[var(--text-subtle)]">
                        <Tag variant="default">{st.className}</Tag>
                        <span>
                          {st.excusedDays} CP
                          {st.unexcusedDays > 0 ? ` • ${st.unexcusedDays} KP` : ''}
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-right align-top whitespace-nowrap">
                      <StatusTag
                        tone={st.absentDays >= 4 || st.unexcusedDays > 0 ? 'danger' : 'warning'}
                        label={`${st.absentDays} ngày`}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-2.5 text-[11px] text-[var(--text-subtle)] flex items-center justify-between gap-2">
        <span>Theo dõi: {items.length} HS</span>
        <span>Giảm dần theo số ngày nghỉ</span>
      </div>
    </div>
  );
};
