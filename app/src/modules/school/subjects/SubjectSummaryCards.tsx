/**
 * Subject Summary KPI Cards
 * Design System: [DS] ECO ME DASHBOARD v2.6.0
 */

import React from 'react';
import type { SubjectSummaryKPI } from '@/types/subject';
import { StatCard } from '@/components/ds';

interface SubjectSummaryCardsProps {
  kpis: SubjectSummaryKPI;
}

export const SubjectSummaryCards: React.FC<SubjectSummaryCardsProps> = ({ kpis }) => {
  return (
    <div className="ecomd-stat-group mb-6" style={{ '--ecomd-cols': 4 } as React.CSSProperties}>
      <StatCard
        label="Tổng số môn học"
        value={`${kpis.totalSubjects} môn`}
        icon="book-open"
        tone="info"
      />
      <StatCard
        label="Môn tính điểm"
        value={`${kpis.gradedSubjectsCount} môn`}
        icon="coins"
        tone="success"
      />
      <StatCard
        label="Môn nhận xét"
        value={`${kpis.commentSubjectsCount} môn`}
        icon="comments"
        tone="warning"
      />
      <StatCard
        label="Giáo viên phân công"
        value={`${kpis.assignedTeachersCount} GV`}
        icon="user-tie"
        tone="purple"
      />
    </div>
  );
};
