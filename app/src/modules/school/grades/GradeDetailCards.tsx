import React from 'react';
import type { GradeLevelRollup } from '@/types/grade';
import { StatCard } from '@/components/ds';

interface GradeDetailCardsProps {
  grade: GradeLevelRollup;
}

export const GradeDetailCards: React.FC<GradeDetailCardsProps> = ({ grade }) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: 'var(--space-4)',
        marginBottom: 'var(--space-6)',
      }}
    >
      <StatCard
        label="Mã khối & Cấp học"
        value={`${grade.code} (${grade.stage})`}
        icon="layer-group"
        tone="info"
      />
      <StatCard
        label="Tổng số lớp học"
        value={`${grade.classCount} lớp`}
        icon="chalkboard"
        tone="success"
      />
      <StatCard
        label="Tổng số học sinh"
        value={`${grade.studentCount.toLocaleString('vi-VN')} HS`}
        icon="graduation-cap"
        tone="purple"
      />
      <StatCard
        label="Tỷ lệ gán GVCN"
        value={`${grade.homeroomAssignedCount}/${grade.classCount} (${grade.homeroomRate}%)`}
        icon="user-tie"
        tone="warning"
      />
    </div>
  );
};
