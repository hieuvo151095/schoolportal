import React, { useRef } from 'react';
import { AttendanceStatus } from '@/types/attendance';
import { CLASSES_LIST } from '@/services/mockAttendanceData';
import {
  Button,
  IconButton,
  Icon,
  SearchField,
  SelectField,
  CountedTabs,
  BulkActionBar,
} from '@/components/ds';

interface AttendanceToolbarProps {
  selectedClassId: string;
  onSelectClassId: (id: string) => void;
  selectedDate: string;
  onSelectDate: (date: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: 'all' | AttendanceStatus;
  onStatusFilterChange: (status: 'all' | AttendanceStatus) => void;
  selectedCount: number;
  selectedCheckedInCount?: number;
  totalCount: number;
  onBulkCheckIn: () => void;
  onBulkCheckOut: () => void;
  onOpenBulkAbsentModal: () => void;
  onSelectAllToggle: (select: boolean) => void;
  statusCounts?: {
    all: number;
    present: number;
    excused_absent: number;
    unexcused_absent: number;
    unmarked: number;
  };
}

export const AttendanceToolbar: React.FC<AttendanceToolbarProps> = ({
  selectedClassId,
  onSelectClassId,
  selectedDate,
  onSelectDate,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  selectedCount,
  selectedCheckedInCount = 0,
  totalCount,
  onBulkCheckIn,
  onBulkCheckOut,
  onOpenBulkAbsentModal,
  onSelectAllToggle,
  statusCounts = { all: totalCount, present: 0, excused_absent: 0, unexcused_absent: 0, unmarked: 0 },
}) => {
  const dateInputRef = useRef<HTMLInputElement>(null);

  // Helper to change date by offset days
  const changeDate = (offset: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + offset);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    onSelectDate(`${yyyy}-${mm}-${dd}`);
  };

  // Format date to DD/MM/YYYY
  const formattedDate = (() => {
    try {
      const parts = selectedDate.split('-');
      if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
      return selectedDate;
    } catch {
      return selectedDate;
    }
  })();

  const tabItems = [
    { id: 'all', label: 'Tất cả', count: statusCounts.all },
    { id: 'present', label: 'Có mặt', count: statusCounts.present },
    { id: 'excused_absent', label: 'Nghỉ có phép', count: statusCounts.excused_absent },
    { id: 'unexcused_absent', label: 'Nghỉ không phép', count: statusCounts.unexcused_absent },
    { id: 'unmarked', label: 'Chưa điểm danh', count: statusCounts.unmarked },
  ];

  return (
    <div>
      {/* 1. Counted Tabs at the top of the card */}
      <CountedTabs
        tabs={tabItems}
        activeId={statusFilter}
        onChange={(id) => onStatusFilterChange(id as 'all' | AttendanceStatus)}
      />

      {/* 2. Integrated Filter Controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 'var(--space-12)',
          padding: 'var(--space-16) var(--space-20)',
          borderBottom: '1px solid var(--border-default)',
          background: 'var(--bg-surface)',
        }}
      >
        {/* Left: Class picker, Date Navigator, Search */}
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-12)' }}>
          {/* Class Select */}
          <div style={{ width: '180px' }}>
            <SelectField
              value={selectedClassId}
              onChange={onSelectClassId}
              options={CLASSES_LIST.map((c) => ({ value: c.id, label: c.name }))}
            />
          </div>

          {/* Date Navigator */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-4)',
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-8)',
              padding: '2px 4px',
            }}
          >
            <IconButton
              icon="chevron-left"
              label="Hôm trước"
              onClick={() => changeDate(-1)}
            />

            <button
              type="button"
              onClick={() => dateInputRef.current?.showPicker ? dateInputRef.current.showPicker() : dateInputRef.current?.focus()}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-8)',
                background: 'transparent',
                border: 0,
                padding: 'var(--space-4) var(--space-8)',
                color: 'var(--text-heading)',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              <Icon name="calendar-days" size={14} color="var(--eco-blue-strong)" />
              <span>{formattedDate}</span>
            </button>

            <input
              ref={dateInputRef}
              type="date"
              value={selectedDate}
              onChange={(e) => onSelectDate(e.target.value)}
              style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 0, height: 0 }}
            />

            <IconButton
              icon="chevron-right"
              label="Hôm sau"
              onClick={() => changeDate(1)}
            />
          </div>

          {/* Search Box */}
          <div style={{ width: '280px' }}>
            <SearchField
              value={searchQuery}
              onChange={onSearchChange}
              placeholder="Tìm tên bé, mã học sinh..."
            />
          </div>
        </div>

        {/* Right: Quick action buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)' }}>
          <Button
            variant="secondary"
            icon="check"
            onClick={onBulkCheckIn}
            disabled={selectedCount === 0}
            title={selectedCount === 0 ? 'Chọn học sinh để đón hàng loạt' : 'Đón các học sinh đã chọn'}
          >
            Đón hàng loạt
          </Button>

          <Button
            variant="secondary"
            icon="right-from-bracket"
            onClick={onBulkCheckOut}
            disabled={selectedCheckedInCount === 0}
            title={selectedCheckedInCount === 0 ? 'Chưa có học sinh đã đón nào được chọn' : 'Trả các học sinh đã đón'}
          >
            Trả hàng loạt
          </Button>

          <Button
            variant="secondary"
            icon="circle-xmark"
            onClick={onOpenBulkAbsentModal}
            disabled={selectedCount === 0}
            title={selectedCount === 0 ? 'Chọn học sinh để báo vắng' : 'Báo vắng cho học sinh đã chọn'}
          >
            Báo vắng
          </Button>
        </div>
      </div>

      {/* 3. Bulk Action Bar (when rows are selected) */}
      <BulkActionBar
        selectedCount={selectedCount}
        totalCount={totalCount}
        onClearSelection={() => onSelectAllToggle(false)}
      >
        <span style={{ fontSize: '13px', color: 'var(--text-subtle)', marginRight: 'var(--space-8)' }}>
          Thao tác nhanh cho {selectedCount} em:
        </span>
        <Button variant="primary" icon="check" onClick={onBulkCheckIn}>
          Đón ({selectedCount})
        </Button>
        {selectedCheckedInCount > 0 && (
          <Button variant="secondary" icon="right-from-bracket" onClick={onBulkCheckOut}>
            Trả ({selectedCheckedInCount})
          </Button>
        )}
        <Button variant="secondary" icon="circle-xmark" onClick={onOpenBulkAbsentModal}>
          Báo vắng ({selectedCount})
        </Button>
      </BulkActionBar>
    </div>
  );
};

export default AttendanceToolbar;
