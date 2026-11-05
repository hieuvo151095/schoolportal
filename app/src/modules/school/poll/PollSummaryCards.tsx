/**
 * Poll Summary KPI Cards
 * Design System: [DS] ECO ME DASHBOARD v2.6.0
 */

import React from 'react';
import { PollSummaryKPI } from '@/types/poll';
import { StatCard } from '@/components/ds';

interface PollSummaryCardsProps {
  kpis: PollSummaryKPI;
}

export const PollSummaryCards: React.FC<PollSummaryCardsProps> = ({ kpis }) => {
  return (
    <div className="ecomd-stat-group mb-6" style={{ '--ecomd-cols': 4 } as React.CSSProperties}>
      <StatCard
        label="Tổng số bình chọn"
        value={`${kpis.totalPolls} khảo sát`}
        icon="chart-bar"
        tone="info"
      />
      <StatCard
        label="Đang diễn ra"
        value={`${kpis.activePollsCount} đang nhận`}
        icon="circle-check"
        tone="success"
      />
      <StatCard
        label="Bản nháp"
        value={`${kpis.draftPollsCount} chưa gửi`}
        icon="file-lines"
        tone="warning"
      />
      <StatCard
        label="Đã kết thúc"
        value={`${kpis.closedPollsCount} đã đóng`}
        icon="lock"
        tone="purple"
      />
    </div>
  );
};

export default PollSummaryCards;
