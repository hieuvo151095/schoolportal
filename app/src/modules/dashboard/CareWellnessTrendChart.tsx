import React, { useState } from 'react';
import type { CareWellnessTrendPoint } from '@/types/dashboard';

interface CareWellnessTrendChartProps {
  data: CareWellnessTrendPoint[];
}

export const CareWellnessTrendChart: React.FC<CareWellnessTrendChartProps> = ({ data }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const chartWidth = 560;
  const chartHeight = 220;
  const padLeft = 44;
  const padRight = 32;
  const padTop = 18;
  const padBottom = 34;
  const plotW = chartWidth - padLeft - padRight;
  const plotH = chartHeight - padTop - padBottom;

  const yMin = 70;
  const yMax = 100;
  const yTicks = [70, 80, 90, 100];

  const getX = (idx: number) =>
    data.length <= 1 ? padLeft + plotW / 2 : padLeft + (plotW / (data.length - 1)) * idx;

  const getY = (val: number) => {
    const clamped = Math.min(yMax, Math.max(yMin, val));
    return padTop + plotH * (1 - (clamped - yMin) / (yMax - yMin));
  };

  const buildPolyline = (accessor: (pt: CareWellnessTrendPoint) => number) =>
    data.map((pt, i) => `${getX(i).toFixed(1)},${getY(accessor(pt)).toFixed(1)}`).join(' ');

  const buildAreaPath = (accessor: (pt: CareWellnessTrendPoint) => number) => {
    if (data.length === 0) return '';
    const linePts = data
      .map((pt, i) => `${getX(i).toFixed(1)},${getY(accessor(pt)).toFixed(1)}`)
      .join(' L ');
    const lastX = getX(data.length - 1).toFixed(1);
    const firstX = getX(0).toFixed(1);
    const bottomY = (padTop + plotH).toFixed(1);
    return `M ${firstX},${bottomY} L ${linePts} L ${lastX},${bottomY} Z`;
  };

  const activePoint = hoveredIdx !== null ? data[hoveredIdx] : data[data.length - 1];

  return (
    <div
      data-testid="care-wellness-trend-chart"
      className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[var(--radius-12)] p-4 sm:p-5 flex flex-col justify-between shadow-2xs min-w-0 h-full"
    >
      {/* Header & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
        <div>
          <h2 className="body-md-bold text-[var(--text-heading)]">
            Xu Hướng Chuyên Cần & Chăm Sóc (7 Ngày)
          </h2>
          <p className="body-xs text-[var(--text-subtle)] mt-0.5">
            Tương quan tỷ lệ đi học, ăn hết suất và giấc ngủ trưa
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--text-secondary)]">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--eco-blue)] inline-block" />
            Có mặt
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-semantic-green)] inline-block" />
            Ăn hết suất
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-semantic-orange)] inline-block" />
            Ngủ sâu giấc
          </span>
        </div>
      </div>

      {/* Interactive Daily Summary Strip */}
      {activePoint && (
        <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 mb-3 rounded-[var(--radius-8)] bg-[var(--bg-sunken)] border border-[var(--border-subtle)] text-xs">
          <div className="font-semibold text-[var(--text-heading)]">
            {activePoint.dayLabel} ({activePoint.fullDate})
          </div>
          <div className="flex flex-wrap items-center gap-3 font-tabular">
            <span className="text-[var(--eco-blue)] font-semibold">
              Có mặt: {activePoint.attendanceRate}%
            </span>
            <span className="text-[var(--color-semantic-green)] font-semibold">
              Ăn hết suất: {activePoint.mealCompletionRate}%
            </span>
            <span className="text-[var(--color-semantic-orange)] font-semibold">
              Ngủ sâu: {activePoint.sleepQualityRate}%
            </span>
          </div>
        </div>
      )}

      {/* Multi-series SVG Area Chart */}
      <div className="w-full overflow-x-auto no-scrollbar">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-auto min-w-[360px] select-none"
          role="img"
          aria-label="Biểu đồ xu hướng chuyên cần và chăm sóc 7 ngày gần nhất"
        >
          <defs>
            <linearGradient id="ecoBlueArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--eco-blue)" stopOpacity="0.18" />
              <stop offset="100%" stopColor="var(--eco-blue)" stopOpacity="0.01" />
            </linearGradient>
            <linearGradient id="ecoGreenArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-semantic-green)" stopOpacity="0.14" />
              <stop offset="100%" stopColor="var(--color-semantic-green)" stopOpacity="0.01" />
            </linearGradient>
          </defs>

          {/* Horizontal Y gridlines */}
          {yTicks.map((val) => {
            const y = getY(val);
            return (
              <g key={val}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={chartWidth - padRight}
                  y2={y}
                  stroke="var(--border-subtle)"
                  strokeDasharray={val === 70 ? undefined : '3 3'}
                  strokeWidth="1"
                />
                <text
                  x={padLeft - 8}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="11"
                  fill="var(--text-tertiary)"
                >
                  {val}%
                </text>
              </g>
            );
          })}

          {/* Area Fills */}
          <path d={buildAreaPath((d) => d.attendanceRate)} fill="url(#ecoBlueArea)" />
          <path d={buildAreaPath((d) => d.mealCompletionRate)} fill="url(#ecoGreenArea)" />

          {/* Series Polylines */}
          <polyline
            fill="none"
            stroke="var(--color-semantic-orange)"
            strokeWidth="2"
            strokeDasharray="4 3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={buildPolyline((d) => d.sleepQualityRate)}
          />
          <polyline
            fill="none"
            stroke="var(--color-semantic-green)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={buildPolyline((d) => d.mealCompletionRate)}
          />
          <polyline
            fill="none"
            stroke="var(--eco-blue)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={buildPolyline((d) => d.attendanceRate)}
          />

          {/* Interactive Vertical Hover Strip + Dots */}
          {data.map((pt, idx) => {
            const cx = getX(idx);
            const isHovered = hoveredIdx === idx;
            const slotW = data.length > 1 ? plotW / (data.length - 1) : plotW;

            return (
              <g
                key={pt.dateKey}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                onClick={() => setHoveredIdx(idx)}
              >
                {isHovered && (
                  <line
                    x1={cx}
                    y1={padTop}
                    x2={cx}
                    y2={padTop + plotH}
                    stroke="var(--border-default)"
                    strokeDasharray="3 3"
                    strokeWidth="1.2"
                  />
                )}

                {/* Invisible wide hit-area */}
                <rect
                  x={cx - slotW / 2}
                  y={padTop}
                  width={slotW}
                  height={plotH + padBottom}
                  fill="transparent"
                />

                {/* Sleep dot */}
                <circle
                  cx={cx}
                  cy={getY(pt.sleepQualityRate)}
                  r={isHovered ? 4.5 : 3}
                  fill="var(--bg-surface)"
                  stroke="var(--color-semantic-orange)"
                  strokeWidth="2"
                />
                {/* Meal dot */}
                <circle
                  cx={cx}
                  cy={getY(pt.mealCompletionRate)}
                  r={isHovered ? 5 : 3.5}
                  fill="var(--bg-surface)"
                  stroke="var(--color-semantic-green)"
                  strokeWidth="2.2"
                />
                {/* Attendance dot */}
                <circle
                  cx={cx}
                  cy={getY(pt.attendanceRate)}
                  r={isHovered ? 5.5 : 3.5}
                  fill="var(--eco-blue)"
                  stroke="var(--bg-surface)"
                  strokeWidth="2"
                />

                {/* X-axis label */}
                <text
                  x={cx}
                  y={chartHeight - 10}
                  textAnchor="middle"
                  fontSize="11.5"
                  fontWeight={isHovered || idx === data.length - 1 ? 700 : 500}
                  fill={isHovered ? 'var(--text-heading)' : 'var(--text-secondary)'}
                >
                  {pt.dayLabel}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
