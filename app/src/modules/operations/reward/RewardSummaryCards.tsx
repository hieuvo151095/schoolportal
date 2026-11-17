import React from 'react';
import { StatCard } from '@/components/ds';
import type { RewardSummary } from '@/types/reward';

interface RewardSummaryCardsProps {
  summary: RewardSummary;
}

export default function RewardSummaryCards({ summary }: RewardSummaryCardsProps) {
  const percent = summary.totalStudents > 0
    ? Math.round((summary.awardedCount / summary.totalStudents) * 100)
    : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-5">
      <StatCard
        label="Sĩ số lớp"
        value={summary.totalStudents}
        sub="Học sinh trong danh sách"
        icon="users"
        tone="neutral"
      />
      <StatCard
        label="Đạt Phiếu bé ngoan"
        value={`${summary.awardedCount}/${summary.totalStudents}`}
        sub={`Đạt ${percent}% toàn lớp`}
        icon="circle-check"
        tone="success"
      />
      <StatCard
        label="Chưa đạt phiếu"
        value={summary.unawardedCount}
        sub="Cần cố gắng rèn luyện thêm"
        icon="triangle-exclamation"
        tone="warning"
      />
      <StatCard
        label="Đã công bố PH"
        value={`${summary.publishedCount}/${summary.totalStudents}`}
        sub="Phụ huynh xem qua ứng dụng"
        icon="bullhorn"
        tone="info"
      />
    </div>
  );
}
