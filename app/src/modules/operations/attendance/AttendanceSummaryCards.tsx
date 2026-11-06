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
    <div
      className="w-full"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: 'var(--space-10)',
      }}
    >
      <StatCard
        label="Có mặt hôm nay"
        value={`${presentCount} / ${totalStudents}`}
        icon="user-check"
        tone="success"
        sub={
          <div className="flex items-center justify-between gap-1.5 sm:gap-2">
            <span className="text-xs truncate">Tỷ lệ: <strong>{attendanceRate}%</strong></span>
            <div className="w-10 sm:w-14 h-1 bg-[var(--bg-muted)] rounded-full overflow-hidden flex-shrink-0">
              <div style={{ width: `${attendanceRate}%` }} className="h-full bg-[var(--semantic-success)]" />
            </div>
          </div>
        }
      />
      <StatCard
        label="Nghỉ có phép (CP)"
        value={`${absentExcusedCount} học sinh`}
        icon="clock"
        tone="warning"
        sub={<span className="text-xs truncate block" title="Đủ điều kiện hoàn tiền ăn">Đủ điều kiện hoàn tiền</span>}
      />
      <StatCard
        label="Nghỉ không phép (KP)"
        value={`${absentUnexcusedCount} học sinh`}
        icon="circle-xmark"
        tone="danger"
        sub={<span className="text-xs truncate block" title="Cần giáo viên liên hệ PH">Cần liên hệ PH</span>}
      />
      <StatCard
        label="Chưa điểm danh"
        value={`${unmarkedCount} học sinh`}
        icon="user-clock"
        tone="neutral"
        sub={<span className="text-xs truncate block" title="Đang mở tiếp nhận điểm danh">Đang tiếp nhận</span>}
      />
    </div>
  );
};

export default AttendanceSummaryCards;
