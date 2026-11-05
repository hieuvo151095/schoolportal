/**
 * Announcement Summary KPI Cards
 * Design System: [DS] ECO ME DASHBOARD v2.6.0
 */

import React from 'react';
import { AnnouncementSummaryKPI } from '../../../types/announcement';
import { StatCard } from '../../../components/ds';

interface AnnouncementSummaryCardsProps {
  kpis: AnnouncementSummaryKPI;
}

export const AnnouncementSummaryCards: React.FC<AnnouncementSummaryCardsProps> = ({ kpis }) => {
  return (
    <div className="ecomd-stat-group mb-6" style={{ '--ecomd-cols': 4 } as React.CSSProperties}>
      <StatCard
        label="Tổng số thông báo"
        value={`${kpis.totalAnnouncements} tin`}
        icon="bullhorn"
        tone="info"
      />
      <StatCard
        label="Đã gửi"
        value={`${kpis.publishedCount} tin`}
        icon="circle-check"
        tone="success"
      />
      <StatCard
        label="Đã lên lịch"
        value={`${kpis.scheduledCount} tin`}
        icon="clock"
        tone="purple"
      />
      <StatCard
        label="Bản nháp"
        value={`${kpis.draftCount} tin`}
        icon="file-lines"
        tone="neutral"
      />
    </div>
  );
};
