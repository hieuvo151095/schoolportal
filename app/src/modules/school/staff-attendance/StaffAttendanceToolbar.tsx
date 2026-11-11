/**
 * Staff Attendance Toolbar Component
 * Design System: [DS] ECO ME DASHBOARD v1.1.0
 */

import React from 'react';
import { StaffRole } from '../../../types/staffAttendance';
import {
  MOCK_CLASS_OPTIONS,
  MOCK_ROLE_OPTIONS,
} from '../../../services/mockStaffAttendanceData';
import {
  getTodayISODate,
  shouldShowPastDateWarning,
  isDateLockedForEdit,
} from '../../../utils/staffAttendanceValidation';
import { FilterBar, Button, Icon } from '../../../components/ds';

interface StaffAttendanceToolbarProps {
  date: string;
  classId: string;
  role: StaffRole | 'all';
  searchQuery: string;
  onDateChange: (date: string) => void;
  onClassChange: (classId: string) => void;
  onRoleChange: (role: StaffRole | 'all') => void;
  onSearchChange: (query: string) => void;
}

export const StaffAttendanceToolbar: React.FC<StaffAttendanceToolbarProps> = ({
  date,
  classId,
  role,
  searchQuery,
  onDateChange,
  onClassChange,
  onRoleChange,
  onSearchChange,
}) => {
  const todayStr = getTodayISODate();
  const isPastDate = shouldShowPastDateWarning(date, todayStr);
  const isLocked = isDateLockedForEdit(date, todayStr);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
      {/* Warning Banners */}
      {isPastDate && (
        <div
          data-testid="warning-banner-dd02"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
            padding: 'var(--space-3) var(--space-4)',
            background: '#fffbeb',
            border: '1px solid #fde68a',
            borderRadius: 'var(--radius-lg)',
            color: '#92400e',
            fontSize: 'var(--text-sm)',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <div style={{ color: 'var(--semantic-amber)', flexShrink: 0 }}>
            <Icon name="triangle-exclamation" size={16} />
          </div>
          <div style={{ flex: 1, fontWeight: 'var(--font-medium)' }}>
            <span>Chỉ được cập nhật thông tin điểm danh trong vòng 45 ngày kể từ hôm nay.</span>
            {isLocked && (
              <span style={{ display: 'block', marginTop: '2px', fontSize: 'var(--text-xs)', color: 'var(--semantic-red)', fontWeight: 'var(--font-semibold)' }}>
                (Dữ liệu điểm danh ngày {date} đã quá 45 ngày và chỉ có thể xem ở chế độ chỉ đọc, không thể chỉnh sửa).
              </span>
            )}
          </div>
          {isLocked && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-1)',
                padding: '4px 8px',
                borderRadius: 'var(--radius-md)',
                background: '#fee2e2',
                color: 'var(--semantic-red)',
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--font-bold)',
                flexShrink: 0,
              }}
            >
              <Icon name="lock" size={12} />
              Khóa chỉnh sửa
            </span>
          )}
        </div>
      )}

      {/* Main Filter Toolbar */}
      <FilterBar
        search={{
          placeholder: 'Tìm nhân viên theo tên, biệt danh, mã NV...',
          value: searchQuery,
          onChange: (val) => onSearchChange(val),
        }}
        filters={[
          {
            placeholder: 'Chọn lớp học',
            value: classId,
            defaultValue: 'all',
            onChange: (val) => onClassChange(val),
            options: MOCK_CLASS_OPTIONS.map((c) => ({
              value: c.classId,
              label: c.className,
            })),
          },
          {
            placeholder: 'Chọn vai trò',
            value: role,
            defaultValue: 'all',
            onChange: (val) => onRoleChange(val as any),
            options: MOCK_ROLE_OPTIONS.map((r) => ({
              value: r.role,
              label: r.label,
            })),
          },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              icon="download"
              onClick={() => alert('Đang xuất sổ điểm danh nhân viên ra file Excel...')}
            >
              Xuất Excel
            </Button>
          </div>
        }
      >
        <div className="inline-flex items-center gap-1.5 h-[38px] px-2.5 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[var(--radius-8)] text-[13px] flex-none">
          <Icon name="calendar" size={14} color="var(--text-subtle)" />
          <span className="text-[12px] font-medium text-[var(--text-subtle)] whitespace-nowrap">
            Ngày:
          </span>
          <input
            type="date"
            data-testid="attendance-date-picker"
            max={todayStr}
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            className="h-[28px] w-[120px] bg-transparent border-0 text-[12px] font-semibold text-[var(--text-heading)] focus:outline-none cursor-pointer p-0"
          />
        </div>
      </FilterBar>
    </div>
  );
};
