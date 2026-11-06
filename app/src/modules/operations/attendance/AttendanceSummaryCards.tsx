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
    <div className="ecomd-stat-group grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 w-full max-w-full min-w-0">
      <div className="min-w-0 overflow-hidden">
        <StatCard
          label="Có mặt hôm nay"
          value={`${presentCount} / ${totalStudents}`}
          icon="user-check"
          tone="success"
          sub={
            <div className="flex items-center justify-between gap-1.5 sm:gap-2 min-w-0">
              <span className="text-xs truncate">Tỷ lệ: <strong>{attendanceRate}%</strong></span>
              <div className="w-8 sm:w-14 h-1 bg-[var(--bg-muted)] rounded-full overflow-hidden flex-shrink-0">
                <div style={{ width: `${attendanceRate}%` }} className="h-full bg-[var(--semantic-success)]" />
              </div>
            </div>
          }
        />
      </div>
      <div className="min-w-0 overflow-hidden">
        <StatCard
          label="Nghỉ có phép (CP)"
          value={`${absentExcusedCount} học sinh`}
          icon="clock"
          tone="warning"
          sub={<span className="text-xs truncate block" title="Đủ điều kiện hoàn tiền ăn">Đủ điều kiện hoàn tiền</span>}
        />
      </div>
      <div className="min-w-0 overflow-hidden">
        <StatCard
          label="Nghỉ không phép (KP)"
          value={`${absentUnexcusedCount} học sinh`}
          icon="circle-xmark"
          tone="danger"
          sub={<span className="text-xs truncate block" title="Cần giáo viên liên hệ PH">Cần liên hệ PH</span>}
        />
      </div>
      <div className="min-w-0 overflow-hidden">
        <StatCard
          label="Chưa điểm danh"
          value={`${unmarkedCount} học sinh`}
          icon="user-clock"
          tone="neutral"
          sub={<span className="text-xs truncate block" title="Đang mở tiếp nhận điểm danh">Đang tiếp nhận</span>}
        />
      </div>
    </div>
  );
};

export default AttendanceSummaryCards;
