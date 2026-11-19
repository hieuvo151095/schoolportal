import React, { useState } from 'react';
import { Button } from '@/components/ds';
import type { GradeCensusSummary } from '@/types/dashboard';

interface StudentCensusDonutProps {
  grades: GradeCensusSummary[];
  activeGradeScope: string;
  onSelectGrade: (gradeId: string) => void;
}

export const StudentCensusDonut: React.FC<StudentCensusDonutProps> = ({
  grades,
  activeGradeScope,
  onSelectGrade,
}) => {
  const [hoveredGradeId, setHoveredGradeId] = useState<string | null>(null);

  const totalStudents = grades.reduce((s, g) => s + g.studentCount, 0);
  const totalCapacity = grades.reduce((s, g) => s + g.capacity, 0);
  const totalFillPct =
    totalCapacity > 0 ? ((totalStudents / totalCapacity) * 100).toFixed(1) : '0.0';

  // SVG Donut ring geometry
  const size = 180;
  const center = size / 2;
  const radius = 64;
  const strokeWidth = 22;
  const circumference = 2 * Math.PI * radius;

  let cumulativeFraction = 0;
  const segments = grades.map((g) => {
    const fraction = totalStudents > 0 ? g.studentCount / totalStudents : 0;
    const dashArray = `${fraction * circumference} ${circumference}`;
    const dashOffset = -cumulativeFraction * circumference;
    cumulativeFraction += fraction;
    return {
      ...g,
      fraction,
      sharePct: (fraction * 100).toFixed(1),
      dashArray,
      dashOffset,
    };
  });

  const focusedGrade =
    segments.find((s) => s.gradeId === hoveredGradeId) ||
    (activeGradeScope !== 'all'
      ? segments.find((s) => s.gradeId === activeGradeScope)
      : null);

  return (
    <div
      data-testid="student-census-donut"
      className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[var(--radius-12)] p-4 sm:p-5 flex flex-col justify-between gap-4 shadow-2xs min-w-0 h-full"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="body-md-bold text-[var(--text-heading)]">
            Cơ Cấu Học Sinh & Lấp Đầy
          </h2>
          <p className="body-xs text-[var(--text-subtle)] mt-0.5">
            Phân bổ sĩ số theo khối lớp (Nhấn để lọc phạm vi)
          </p>
        </div>

        {activeGradeScope !== 'all' && (
          <Button
            variant="text"
            onClick={() => onSelectGrade('all')}
          >
            Xem tất cả
          </Button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-5 my-auto py-2">
        {/* Pure SVG Donut */}
        <div className="relative flex-none flex items-center justify-center">
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="-rotate-90 select-none"
            role="img"
            aria-label="Biểu đồ tròn phân bổ học sinh theo khối"
          >
            {/* Background track */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="var(--bg-neutral-soft)"
              strokeWidth={strokeWidth}
            />

            {segments.map((seg) => {
              const isSelected = activeGradeScope === seg.gradeId;
              const isHovered = hoveredGradeId === seg.gradeId;
              const isDimmed =
                (hoveredGradeId && !isHovered) ||
                (activeGradeScope !== 'all' && !isSelected);

              return (
                <circle
                  key={seg.gradeId}
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="none"
                  stroke={seg.colorHex}
                  strokeWidth={isHovered || isSelected ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={seg.dashArray}
                  strokeDashoffset={seg.dashOffset}
                  opacity={isDimmed ? 0.35 : 1}
                  className="cursor-pointer transition-all duration-150"
                  onMouseEnter={() => setHoveredGradeId(seg.gradeId)}
                  onMouseLeave={() => setHoveredGradeId(null)}
                  onClick={() =>
                    onSelectGrade(
                      activeGradeScope === seg.gradeId ? 'all' : seg.gradeId
                    )
                  }
                />
              );
            })}
          </svg>

          {/* Center summary overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-4">
            <span className="text-[11px] font-medium text-[var(--text-subtle)] uppercase tracking-wide">
              {focusedGrade ? focusedGrade.gradeName : 'Toàn trường'}
            </span>
            <span className="text-xl font-extrabold text-[var(--text-heading)] font-tabular leading-tight mt-0.5">
              {focusedGrade ? focusedGrade.studentCount : totalStudents} HS
            </span>
            <span className="text-[11px] font-semibold text-[var(--eco-blue-strong)] mt-0.5">
              {focusedGrade ? `${focusedGrade.sharePct}% sĩ số` : `${totalFillPct}% lấp đầy`}
            </span>
          </div>
        </div>

        {/* Grade Breakdown & Capacity Bars */}
        <div className="flex-1 w-full space-y-2.5 min-w-0">
          {segments.map((seg) => {
            const fillRatio =
              seg.capacity > 0 ? Math.round((seg.studentCount / seg.capacity) * 100) : 0;
            const isSelected = activeGradeScope === seg.gradeId;

            return (
              <div
                key={seg.gradeId}
                role="button"
                tabIndex={0}
                onMouseEnter={() => setHoveredGradeId(seg.gradeId)}
                onMouseLeave={() => setHoveredGradeId(null)}
                onClick={() =>
                  onSelectGrade(
                    activeGradeScope === seg.gradeId ? 'all' : seg.gradeId
                  )
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectGrade(
                      activeGradeScope === seg.gradeId ? 'all' : seg.gradeId
                    );
                  }
                }}
                className={`p-2 rounded-[var(--radius-8)] border transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[var(--bg-neutral-soft)] border-[var(--eco-blue)]'
                    : 'bg-transparent border-transparent hover:bg-[var(--bg-sunken)] hover:border-[var(--border-subtle)]'
                }`}
              >
                <div className="flex items-center justify-between gap-2 text-xs mb-1">
                  <span className="inline-flex items-center gap-1.5 font-semibold text-[var(--text-heading)] whitespace-nowrap">
                    <span
                      className="w-2.5 h-2.5 rounded-xs shrink-0"
                      style={{ backgroundColor: seg.colorHex }}
                    />
                    <span>{seg.gradeName}</span>
                    <span className="font-normal text-[var(--text-subtle)]">
                      ({seg.classCount} lớp)
                    </span>
                  </span>
                  <span className="font-tabular font-semibold text-[var(--text-heading)] whitespace-nowrap">
                    {seg.studentCount}/{seg.capacity}{' '}
                    <span className="text-[var(--text-subtle)] font-normal">
                      ({fillRatio}%)
                    </span>
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-1.5 rounded-full bg-[var(--bg-neutral-soft)] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(100, fillRatio)}%`,
                      backgroundColor: seg.colorHex,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Capacity Summary */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 rounded-[var(--radius-8)] bg-[var(--bg-sunken)] border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)]">
        <span>
          Tổng cộng <strong className="text-[var(--text-heading)]">{grades.reduce((s, g) => s + g.classCount, 0)} lớp</strong> đang vận hành
        </span>
        <span className="font-tabular">
          Chỉ tiêu còn trống:{' '}
          <strong className="text-[var(--eco-blue-strong)]">
            {Math.max(0, totalCapacity - totalStudents)} chỗ
          </strong>
        </span>
      </div>
    </div>
  );
};
