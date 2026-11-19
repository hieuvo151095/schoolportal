import React, { useState } from 'react';
import { formatVndCompact, formatVndCurrency } from '@/utils/dashboardAnalytics';
import type { MonthlyCashflowPoint } from '@/types/dashboard';

interface FinanceCashflowChartProps {
  data: MonthlyCashflowPoint[];
}

export const FinanceCashflowChart: React.FC<FinanceCashflowChartProps> = ({ data }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const chartHeight = 220;
  const chartWidth = 560;
  const padLeft = 56;
  const padRight = 16;
  const padTop = 16;
  const padBottom = 34;
  const plotW = chartWidth - padLeft - padRight;
  const plotH = chartHeight - padTop - padBottom;

  const totals = data.map((d) => d.collected + d.inTermRemaining + d.overdue);
  const rawMax = Math.max(...totals, 100_000_000);
  // Round ceiling to neat step
  const maxVal = rawMax * 1.12;

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((ratio) => ({
    ratio,
    value: maxVal * ratio,
    y: padTop + plotH * (1 - ratio),
  }));

  const barSlotW = data.length > 0 ? plotW / data.length : plotW;
  const barW = Math.min(36, Math.max(18, barSlotW * 0.46));

  const activePoint = hoveredIndex !== null ? data[hoveredIndex] : data[data.length - 1];
  const activeTotal = activePoint
    ? activePoint.collected + activePoint.inTermRemaining + activePoint.overdue
    : 0;
  const activeRate =
    activeTotal > 0 ? ((activePoint.collected / activeTotal) * 100).toFixed(1) : '0.0';

  return (
    <div
      data-testid="finance-cashflow-chart"
      className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[var(--radius-12)] p-4 sm:p-5 flex flex-col justify-between shadow-2xs min-w-0 h-full"
    >
      {/* Header & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
        <div>
          <h2 className="body-md-bold text-[var(--text-heading)]">
            Tiến Độ Dòng Tiền & Công Nợ Học Phí
          </h2>
          <p className="body-xs text-[var(--text-subtle)] mt-0.5">
            Theo dõi thực thu, công nợ trong hạn và quá hạn qua từng tháng
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--text-secondary)]">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[var(--color-semantic-green)] inline-block" />
            Đã thực thu
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[var(--color-semantic-orange)] inline-block" />
            Trong hạn
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[var(--color-danger)] inline-block" />
            Quá hạn &gt;30 ngày
          </span>
        </div>
      </div>

      {/* Selected / Hovered Summary Strip */}
      {activePoint && (
        <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 mb-3 rounded-[var(--radius-8)] bg-[var(--bg-sunken)] border border-[var(--border-subtle)] text-xs">
          <div className="font-semibold text-[var(--text-heading)]">
            Kỳ {activePoint.monthLabel}{' '}
            <span className="font-normal text-[var(--text-subtle)] ml-1">
              (Tỷ lệ thu: <strong className="text-[var(--color-semantic-green)]">{activeRate}%</strong>)
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3 font-tabular">
            <span className="text-[var(--color-semantic-green)] font-semibold">
              Thu: {formatVndCurrency(activePoint.collected)}
            </span>
            <span className="text-[var(--color-semantic-orange)] font-medium">
              Chờ thu: {formatVndCurrency(activePoint.inTermRemaining)}
            </span>
            <span className="text-[var(--color-danger)] font-medium">
              Quá hạn: {formatVndCurrency(activePoint.overdue)}
            </span>
          </div>
        </div>
      )}

      {/* Responsive SVG Stacked Bar Chart */}
      <div className="w-full overflow-x-auto no-scrollbar">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-auto min-w-[360px] select-none"
          role="img"
          aria-label="Biểu đồ cột chồng dòng tiền và công nợ học phí theo tháng"
        >
          {/* Horizontal gridlines & Y-axis labels */}
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
                {t.value === 0 ? '0' : formatVndCompact(t.value)}
              </text>
            </g>
          ))}

          {/* Stacked Bars */}
          {data.map((pt, idx) => {
            const xCenter = padLeft + barSlotW * idx + barSlotW / 2;
            const x = xCenter - barW / 2;

            const hCollected = (pt.collected / maxVal) * plotH;
            const hInTerm = (pt.inTermRemaining / maxVal) * plotH;
            const hOverdue = (pt.overdue / maxVal) * plotH;

            const yCollected = padTop + plotH - hCollected;
            const yInTerm = yCollected - hInTerm;
            const yOverdue = yInTerm - hOverdue;

            const isHovered = hoveredIndex === idx;

            return (
              <g
                key={pt.monthKey}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => setHoveredIndex(idx)}
              >
                {/* Subtle hover column highlight */}
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

                {/* Collected (Bottom segment) */}
                <rect
                  x={x}
                  y={yCollected}
                  width={barW}
                  height={Math.max(0, hCollected)}
                  rx={pt.inTermRemaining === 0 && pt.overdue === 0 ? 4 : 0}
                  fill="var(--color-semantic-green)"
                  opacity={hoveredIndex !== null && !isHovered ? 0.65 : 0.92}
                />

                {/* In-term Remaining (Middle segment) */}
                {hInTerm > 0 && (
                  <rect
                    x={x}
                    y={yInTerm}
                    width={barW}
                    height={Math.max(1, hInTerm)}
                    fill="var(--color-semantic-orange)"
                    opacity={hoveredIndex !== null && !isHovered ? 0.65 : 0.92}
                  />
                )}

                {/* Overdue (Top segment) */}
                {hOverdue > 0 && (
                  <rect
                    x={x}
                    y={yOverdue}
                    width={barW}
                    height={Math.max(2, hOverdue)}
                    rx={3}
                    fill="var(--color-danger)"
                    opacity={hoveredIndex !== null && !isHovered ? 0.65 : 0.95}
                  />
                )}

                {/* X-axis month label */}
                <text
                  x={xCenter}
                  y={chartHeight - 10}
                  textAnchor="middle"
                  fontSize="11.5"
                  fontWeight={isHovered ? 700 : 500}
                  fill={isHovered ? 'var(--text-heading)' : 'var(--text-secondary)'}
                >
                  {pt.monthLabel}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
