/**
 * Fee Report Filter Toolbar
 * Design System: [DS] ECO ME DASHBOARD v1.1.0
 */

import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  setDateRange,
  setClassFilter,
  resetFilters,
} from '../../../store/slices/feeReportSlice';
import { mockFeeReportClasses } from '../../../services/mockFeeReportData';
import type { FeeReportTab } from '../../../types/feeReport';
import { Button, Tag, Icon } from '../../../components/ds';

interface FeeReportToolbarProps {
  currentTab: FeeReportTab;
  recordCount: number;
  onExportExcel?: () => void;
}

export const FeeReportToolbar: React.FC<FeeReportToolbarProps> = ({
  currentTab,
  recordCount,
  onExportExcel,
}) => {
  const dispatch = useAppDispatch();
  const { filters } = useAppSelector((state) => state.feeReport);

  const isPaidTab = currentTab === 'paid';

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
      {/* Filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--space-12)' }}>
        {/* Date Range Picker */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-8)',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-8)',
            padding: '4px 10px',
            fontSize: '12px',
          }}
        >
          <Icon name="calendar" size={14} color="var(--text-subtle)" />
          <span style={{ fontWeight: 500, color: 'var(--text-subtle)' }}>
            {isPaidTab ? 'Ngày xác nhận:' : 'Kỳ hóa đơn:'}
          </span>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) =>
              dispatch(setDateRange({ dateFrom: e.target.value, dateTo: filters.dateTo }))
            }
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--text-heading)',
              cursor: 'pointer',
              outline: 'none',
            }}
          />
          <span style={{ color: 'var(--text-subtle)' }}>—</span>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) =>
              dispatch(setDateRange({ dateFrom: filters.dateFrom, dateTo: e.target.value }))
            }
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--text-heading)',
              cursor: 'pointer',
              outline: 'none',
            }}
          />
        </div>

        {/* Class Filter */}
        <select
          value={filters.classId}
          onChange={(e) => dispatch(setClassFilter(e.target.value))}
          style={{
            height: '34px',
            padding: '0 var(--space-8)',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-8)',
            fontSize: '12px',
            fontWeight: 500,
            color: 'var(--text-heading)',
            cursor: 'pointer',
          }}
        >
          <option value="tat_ca">Tất cả lớp học</option>
          {mockFeeReportClasses.map((cls) => (
            <option key={cls.id} value={cls.id}>
              {cls.name}
            </option>
          ))}
        </select>

        {/* Reset Filter Button */}
        <button
          type="button"
          onClick={() => dispatch(resetFilters())}
          className="body-xs text-[var(--text-subtle)] hover:text-[var(--text-heading)] inline-flex items-center gap-1 cursor-pointer bg-transparent border-0 underline"
        >
          <Icon name="arrow-rotate-left" size={12} />
          <span>Đặt lại</span>
        </button>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-12)' }}>
        <Tag variant="code">{recordCount} lớp ghi nhận</Tag>
        {onExportExcel && (
          <Button
            variant="secondary"
            icon="download"
            onClick={onExportExcel}
          >
            Xuất Excel
          </Button>
        )}
      </div>
    </div>
  );
};
