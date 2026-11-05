import React from 'react';
import { AttendanceSummary } from '@/types/attendance';
import { StatCard } from '@/components/ds';

interface AttendanceSummaryCardsProps {
  summary: AttendanceSummary;
}

export const AttendanceSummaryCards: React.FC<AttendanceSummaryCardsProps> = ({ summary }) => {
  const {
    totalStudents,
    presentCount,
    absentExcusedCount,
    absentUnexcusedCount,
    unmarkedCount,
  } = summary;

  const attendanceRate = totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0;

  return (
    <div className="ecomd-stat-group grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      <StatCard
        label="Có mặt hôm nay"
        value={`${presentCount} / ${totalStudents}`}
        icon="user-check"
        tone="success"
        sub={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-8)' }}>
            <span>Tỷ lệ có mặt: <strong>{attendanceRate}%</strong></span>
            <div style={{ width: '60px', height: '4px', background: 'var(--bg-muted)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
              <div style={{ width: `${attendanceRate}%`, height: '100%', background: 'var(--semantic-success)' }} />
            </div>
          </div>
        }
      />
      <StatCard
        label="Nghỉ có phép (CP)"
        value={`${absentExcusedCount} học sinh`}
        icon="clock"
        tone="warning"
        sub="Đủ điều kiện hoàn tiền ăn"
      />
      <StatCard
        label="Nghỉ không phép (KP)"
        value={`${absentUnexcusedCount} học sinh`}
        icon="circle-xmark"
        tone="danger"
        sub="Cần giáo viên liên hệ PH"
      />
      <StatCard
        label="Chưa điểm danh"
        value={`${unmarkedCount} học sinh`}
        icon="user-clock"
        tone="neutral"
        sub="Đang mở tiếp nhận điểm danh"
      />
    </div>
  );
};

export default AttendanceSummaryCards;
