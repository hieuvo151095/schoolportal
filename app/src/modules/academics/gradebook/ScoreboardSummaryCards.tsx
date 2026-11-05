import React from 'react';
import { useAppSelector } from '../../../store';
import { StatCard } from '@/components/ds';

export const ScoreboardSummaryCards: React.FC = () => {
  const { classes } = useAppSelector((state) => state.gradebook);

  const totalClasses = classes.length;
  let inProgressCount = 0;
  let publishedCount = 0;
  let pendingCount = 0;

  classes.forEach((cls) => {
    cls.terms.forEach((term) => {
      if (term.status === 'tien_hanh') {
        inProgressCount++;
      } else if (term.status === 'da_cong_bo') {
        publishedCount++;
      } else {
        pendingCount++;
      }
    });
  });

  return (
    <div
      className="ecomd-stat-group"
      style={{
        '--ecomd-cols': 4,
        marginBottom: 'var(--space-16)',
      } as React.CSSProperties}
    >
      <StatCard
        label="Lớp đang theo dõi"
        value={`${totalClasses} lớp`}
        icon="chalkboard"
        tone="neutral"
      />
      <StatCard
        label="Kỳ đang nhập điểm"
        value={`${inProgressCount} kỳ`}
        icon="pen"
        tone="warning"
      />
      <StatCard
        label="Kỳ đã công bố"
        value={`${publishedCount} kỳ`}
        icon="circle-check"
        tone="success"
      />
      <StatCard
        label="Kỳ chưa bắt đầu"
        value={`${pendingCount} kỳ`}
        icon="hourglass-half"
        tone="neutral"
      />
    </div>
  );
};

export default ScoreboardSummaryCards;
