import React from 'react';
import { StatCard } from '@/components/ds';
import type { RewardReportSummary } from '@/types/rewardReport';

interface RewardReportSummaryCardsProps {
  summary: RewardReportSummary;
  monthLabel: string;
}

export default function RewardReportSummaryCards({ summary, monthLabel }: RewardReportSummaryCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-5">
      <StatCard
        label="Sĩ số lớp"
        value={summary.totalStudents}
        sub="Học sinh theo dõi trong tháng"
        icon="users"
        tone="neutral"
      />
      <StatCard
        label="Tổng phiếu đạt"
        value={summary.grandTotalAwarded}
        sub={`Toàn lớp trong ${monthLabel}`}
        icon="circle-check"
        tone="success"
      />
      <StatCard
        label="Tỷ lệ đạt chuẩn"
        value={`${summary.averageRate}%`}
        sub="Tỷ lệ rèn luyện đạt chuẩn"
        icon="chart-pie"
        tone="info"
      />
      <StatCard
        label="Tổng ngày vắng"
        value={summary.totalExcusedAbsences + summary.totalUnexcusedAbsences}
        sub={`Có phép: ${summary.totalExcusedAbsences} | Không phép: ${summary.totalUnexcusedAbsences}`}
        icon="calendar-days"
        tone={summary.totalUnexcusedAbsences > 0 ? 'warning' : 'neutral'}
      />
    </div>
  );
}
