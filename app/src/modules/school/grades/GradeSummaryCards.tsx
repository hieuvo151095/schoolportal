/**
 * Grade Summary KPI Cards
 * Design System: [DS] ECO ME DASHBOARD v2.6.0
 */

import React from 'react';
import type { GradeSummaryKPI } from '@/types/grade';
import { StatCard } from '@/components/ds';

interface GradeSummaryCardsProps {
  kpis: GradeSummaryKPI;
}

export const GradeSummaryCards: React.FC<GradeSummaryCardsProps> = ({ kpis }) => {
  return (
    <div className="ecomd-stat-group mb-6" style={{ '--ecomd-cols': 4 } as React.CSSProperties}>
      <StatCard
        label="Tổng số khối lớp"
        value={`${kpis.totalGrades} khối`}
        icon="layer-group"
        tone="info"
      />
      <StatCard
        label="Tổng số lớp học"
        value={`${kpis.totalClasses} lớp`}
        icon="chalkboard"
        tone="success"
      />
      <StatCard
        label="Tổng số học sinh"
        value={`${kpis.totalStudents.toLocaleString('vi-VN')} HS`}
        icon="graduation-cap"
        tone="purple"
      />
      <StatCard
        label="Sĩ số trung bình/lớp"
        value={`${kpis.averageStudentsPerClass} HS/lớp`}
        icon="users"
        tone="warning"
      />
    </div>
  );
};
