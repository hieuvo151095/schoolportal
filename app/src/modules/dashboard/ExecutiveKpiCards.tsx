import React from 'react';
import { StatCard } from '@/components/ds';
import { formatVndCompact } from '@/utils/dashboardAnalytics';
import type { ExecutiveKPIBundle } from '@/types/dashboard';

interface ExecutiveKpiCardsProps {
  kpis: ExecutiveKPIBundle;
}

export const ExecutiveKpiCards: React.FC<ExecutiveKpiCardsProps> = ({ kpis }) => {
  return (
    <div
      data-testid="executive-kpi-cards"
      className="ecomd-stat-group"
      style={{ '--ecomd-cols': 4 } as React.CSSProperties}
    >
      {/* 1. Quy mô học sinh & Lấp đầy */}
      <StatCard
        label="Quy mô học sinh"
        value={`${kpis.totalStudents} / ${kpis.totalCapacity} HS`}
        icon="users"
        tone="neutral"
        sub={`${kpis.fillRate}% công suất • ${kpis.studentDeltaLabel}`}
      />

      {/* 2. Chuyên cần hôm nay */}
      <StatCard
        label="Tỷ lệ chuyên cần"
        value={`${kpis.attendanceRate}%`}
        icon="calendar-check"
        tone="info"
        sub={`${kpis.presentCount} có mặt • ${kpis.excusedAbsentCount} CP • ${kpis.unexcusedAbsentCount} KP`}
      />

      {/* 3. Thu học phí */}
      <StatCard
        label="Thu học phí kỳ này"
        value={`${kpis.tuitionCollectionRate}%`}
        icon="coins"
        tone="success"
        sub={`Đã thu ${formatVndCompact(kpis.tuitionCollectedVnd)} / ${formatVndCompact(kpis.tuitionTotalIssuedVnd)}`}
      />

      {/* 4. Chỉ số hài lòng CSAT */}
      <StatCard
        label="Chỉ số hài lòng (CSAT)"
        value={`${kpis.csatScore.toFixed(2)} / ${kpis.csatMax.toFixed(1)}`}
        icon="square-poll-vertical"
        tone="warning"
        sub={`${kpis.positivePollRate}% bình chọn tốt • ${kpis.parentAppAdoptionRate}% dùng App`}
      />
    </div>
  );
};
