import React, { useState } from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ds';
import type { WeeklyActivityDayPoint } from '@/types/dashboard';

interface WeeklyActivityChartProps {
  data: WeeklyActivityDayPoint[];
  schoolCode: string;
}

const HEART_SVG_PATH =
  'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z';

export const WeeklyActivityChart: React.FC<WeeklyActivityChartProps> = ({
  data,
  schoolCode,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const chartWidth = 560;
  const chartHeight = 220;
  const padLeft = 40;
  const padRight = 38;
  const padTop = 20;
  const padBottom = 34;
  const plotW = chartWidth - padLeft - padRight;
  const plotH = chartHeight - padTop - padBottom;

  const maxPosts = Math.max(...data.map((d) => d.postCount), 4);
  const yPostMax = Math.max(4, Math.ceil(maxPosts / 4) * 4);
  const maxHearts = Math.max(...data.map((d) => d.heartCount), 20);
  const yHeartMax = Math.max(20, Math.ceil(maxHearts / 20) * 20);

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((r) => ({
    ratio: r,
    postVal: Math.round(yPostMax * r),
    heartVal: Math.round(yHeartMax * r),
    y: padTop + plotH * (1 - r),
  }));

  const barSlotW = data.length > 0 ? plotW / data.length : plotW;
  const barW = Math.min(34, Math.max(18, barSlotW * 0.42));

  const getX = (idx: number) => padLeft + barSlotW * idx + barSlotW / 2;
  const getPostY = (val: number) =>
    padTop + plotH * (1 - Math.min(1, val / Math.max(1, yPostMax)));
  const getHeartY = (val: number) =>
    padTop + plotH * (1 - Math.min(1, val / Math.max(1, yHeartMax)));

  const heartLinePoints = data
    .map((pt, i) => `${getX(i).toFixed(1)},${getHeartY(pt.heartCount).toFixed(1)}`)
    .join(' ');

  const activePoint =
    hoveredIdx !== null ? data[hoveredIdx] : data[Math.min(3, data.length - 1)];

  return (
    <div
      data-testid="weekly-activity-chart"
      className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[var(--radius-12)] p-4 sm:p-5 flex flex-col justify-between shadow-2xs min-w-0 h-full"
    >
      {/* Header & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="body-md-bold text-[var(--text-heading)]">
              Hoạt Động Trong Tuần
            </h2>
            <Link
              href={`/${schoolCode}/class/lop-1a1/activity`}
              className="text-xs font-semibold text-[var(--eco-blue-strong)] hover:underline inline-flex items-center gap-1"
            >
              <span>Chi tiết</span>
              <Icon name="arrow-right" size={10} />
            </Link>
          </div>
          <p className="body-xs text-[var(--text-subtle)] mt-0.5">
            Số lượng bài đăng Hoạt động và lượt thả tim của phụ huynh
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--text-secondary)]">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[var(--eco-blue)] inline-block" />
            Số bài hoạt động
          </span>
          <span className="inline-flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 24 24" className="shrink-0">
              <path d={HEART_SVG_PATH} fill="#ec4899" />
            </svg>
            Lượt tim phụ huynh
          </span>
        </div>
      </div>

      {/* Selected / Hovered Day Summary Strip */}
      {activePoint && (
        <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 mb-3 rounded-[var(--radius-8)] bg-[var(--bg-sunken)] border border-[var(--border-subtle)] text-xs">
          <div className="font-semibold text-[var(--text-heading)]">
            {activePoint.fullDate}
          </div>
          <div className="flex flex-wrap items-center gap-4 font-tabular">
            <span className="text-[var(--eco-blue-strong)] font-semibold">
              Bài hoạt động: {activePoint.postCount} bài
            </span>
            <span className="text-pink-600 font-semibold inline-flex items-center gap-1">
              <svg width="11" height="11" viewBox="0 0 24 24">
                <path d={HEART_SVG_PATH} fill="#ec4899" />
              </svg>
              Lượt tim: {activePoint.heartCount} tim
            </span>
          </div>
        </div>
      )}

      {/* Dual-metric SVG Chart: Posts Bar + Hearts Curve */}
      <div className="w-full overflow-x-auto no-scrollbar">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-auto min-w-[360px] select-none"
          role="img"
          aria-label="Biểu đồ bài đăng hoạt động và lượt tim phụ huynh trong tuần"
        >
          {/* Horizontal gridlines + dual Y-axis ticks */}
          {yTicks.map((t, i) => (
            <g key={i}>
              <line
                x1={padLeft}
                y1={t.y}
                x2={chartWidth - padRight}
                y2={t.y}
                stroke="var(--border-subtle)"
                strokeDasharray={i === 0 ? undefined : '3 3'}
                strokeWidth="1"
              />
              <text
                x={padLeft - 8}
                y={t.y + 4}
                textAnchor="end"
                fontSize="11"
                fill="var(--text-tertiary)"
              >
                {t.postVal}
              </text>
              <text
                x={chartWidth - padRight + 8}
                y={t.y + 4}
                textAnchor="start"
                fontSize="10.5"
                fill="#ec4899"
                opacity={0.85}
              >
                {t.heartVal}
              </text>
            </g>
          ))}

          {/* Activity Post Bars */}
          {data.map((pt, idx) => {
            const xCenter = getX(idx);
            const x = xCenter - barW / 2;
            const yTop = getPostY(pt.postCount);
            const hBar = Math.max(0, padTop + plotH - yTop);
            const isHovered = hoveredIdx === idx;

            return (
              <g
                key={pt.dateKey}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                onClick={() => setHoveredIdx(idx)}
              >
                {isHovered && (
                  <rect
                    x={xCenter - barSlotW * 0.42}
                    y={padTop}
                    width={barSlotW * 0.84}
                    height={plotH}
                    rx={6}
                    fill="var(--bg-neutral-soft)"
                    opacity={0.75}
                  />
                )}

                <rect
                  x={x}
                  y={yTop}
                  width={barW}
                  height={hBar}
                  rx={4}
                  fill="var(--eco-blue)"
                  opacity={hoveredIdx !== null && !isHovered ? 0.6 : 0.9}
                />

                {/* X-axis label */}
                <text
                  x={xCenter}
                  y={chartHeight - 10}
                  textAnchor="middle"
                  fontSize="11.5"
                  fontWeight={isHovered || pt.dayLabel === '19/11' ? 700 : 500}
                  fill={isHovered ? 'var(--text-heading)' : 'var(--text-secondary)'}
                >
                  {pt.dayLabel}
                </text>
              </g>
            );
          })}

          {/* Dashed Pink Line connecting Parent Hearts */}
          <polyline
            fill="none"
            stroke="#ec4899"
            strokeWidth="2"
            strokeDasharray="4 3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={heartLinePoints}
            className="pointer-events-none"
          />

          {/* Heart Markers on Curve */}
          {data.map((pt, idx) => {
            const cx = getX(idx);
            const cy = getHeartY(pt.heartCount);
            const isHovered = hoveredIdx === idx;
            const scale = isHovered ? 0.85 : 0.68;

            return (
              <g
                key={`heart-${pt.dateKey}`}
                transform={`translate(${cx - 12 * scale}, ${cy - 12 * scale}) scale(${scale})`}
                className="pointer-events-none"
              >
                <path
                  d={HEART_SVG_PATH}
                  fill="#ec4899"
                  stroke="var(--bg-surface)"
                  strokeWidth="2"
                />
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
