/**
 * Class Summary KPI Cards
 * Design System: [DS] ECO ME DASHBOARD v2.6.0
 */

import React from 'react';
import { ClassItem } from '../../../types/class';
import { StatCard } from '../../../components/ds';

interface ClassSummaryCardsProps {
  classes: ClassItem[];
}

export const ClassSummaryCards: React.FC<ClassSummaryCardsProps> = ({ classes }) => {
  const totalClasses = classes.length;
  const curricularCount = classes.filter((c) => c.taxonomy === 'chinh_khoa').length;
  const extracurricularCount = classes.filter((c) => c.taxonomy === 'ngoai_khoa').length;
  const totalStudents = classes.reduce((sum, c) => sum + (c.studentCount || 0), 0);

  return (
    <div className="ecomd-stat-group" style={{ '--ecomd-cols': 4 } as React.CSSProperties}>
      <StatCard
        label="Tổng số lớp học"
        value={totalClasses}
        tone="neutral"
        icon="chalkboard"
      />
      <StatCard
        label="Lớp chính khóa"
        value={curricularCount}
        tone="info"
        icon="graduation-cap"
      />
      <StatCard
        label="Lớp ngoại khóa & CLB"
        value={extracurricularCount}
        tone="purple"
        icon="chalkboard-user"
      />
      <StatCard
        label="Học sinh đã xếp lớp"
        value={totalStudents}
        tone="success"
        icon="user"
      />
    </div>
  );
};
