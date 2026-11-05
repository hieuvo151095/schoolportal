/**
 * Reconciliation Filter Toolbar
 * Design System: [DS] ECO ME DASHBOARD v1.1.0
 */

import React from 'react';
import { Button, Tag, Icon } from '../../../components/ds';

interface ReconciliationToolbarProps {
  startDate: string;
  endDate: string;
  onDateChange: (startDate: string, endDate: string) => void;
  sessionCount: number;
  onExport: () => void;
  maxDate?: string;
}

export const ReconciliationToolbar: React.FC<ReconciliationToolbarProps> = ({
  startDate,
  endDate,
  onDateChange,
  sessionCount,
  onExport,
  maxDate = '2026-09-12',
}) => {
  const isExportDisabled = sessionCount === 0;

  // Preset: 12 days before today (BR05 default)
  const handlePreset12Days = () => {
    onDateChange('2026-08-30', '2026-09-11');
  };

  // Preset: Month to date
  const handlePresetThisMonth = () => {
    onDateChange('2026-09-01', '2026-09-12');
  };

  return (
    <div
      style={{
        background: 'var(--bg-surface)',
        borderRadius: 'var(--radius-12)',
        border: '1px solid var(--border-default)',
        padding: 'var(--space-12) var(--space-16)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 'var(--space-12)',
      }}
    >
      {/* Date Range Controls */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--space-12)' }}>
        <div className="body-sm-bold flex items-center gap-2 text-[var(--text-heading)]">
          <Icon name="calendar" size={14} color="var(--eco-blue-strong)" />
          <span>Khoảng thời gian:</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)' }}>
          <input
            type="date"
            value={startDate}
            max={endDate || maxDate}
            onChange={(e) => onDateChange(e.target.value, endDate)}
            style={{
              height: '36px',
              padding: '0 var(--space-8)',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-8)',
              fontSize: '12px',
              color: 'var(--text-heading)',
            }}
            title="Từ ngày"
          />
          <span style={{ color: 'var(--text-subtle)' }}>—</span>
          <input
            type="date"
            value={endDate}
            min={startDate}
            max={maxDate}
            onChange={(e) => onDateChange(startDate, e.target.value)}
            style={{
              height: '36px',
              padding: '0 var(--space-8)',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-8)',
              fontSize: '12px',
              color: 'var(--text-heading)',
            }}
            title="Đến ngày (không cho chọn ngày tương lai)"
          />
        </div>

        {/* Quick Presets */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)' }}>
          <Button
            variant="secondary"
            size="sm"
            onClick={handlePreset12Days}
          >
            12 ngày gần nhất
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handlePresetThisMonth}
          >
            Tháng này
          </Button>
        </div>
      </div>

      {/* Right Action: Status Pill & Export Button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-12)' }}>
        <Tag variant="code">{sessionCount} phiên tìm thấy</Tag>
        <Button
          variant="secondary"
          icon="download"
          onClick={onExport}
          disabled={isExportDisabled}
        >
          Xuất Excel
        </Button>
      </div>
    </div>
  );
};
