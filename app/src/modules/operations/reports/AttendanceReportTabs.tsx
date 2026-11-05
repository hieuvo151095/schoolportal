import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import { setActiveTab, setAttendanceFilters } from '../../../store/slices/reportsSlice';
import { CountedTabs, SelectField, SearchField, Button } from '@/components/ds';

export const AttendanceReportTabs: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    activeTab,
    selectedMonth,
    selectedClassId,
    selectedRole,
    staffSearchQuery,
    studentRoster,
    staffRoster,
  } = useAppSelector((state) => state.reports);

  const handleExport = () => {
    alert(`Đang xuất dữ liệu báo cáo điểm danh tháng ${selectedMonth}/2026 dạng CSV...`);
  };

  const tabs = [
    {
      id: 'students',
      label: 'Học sinh',
      count: studentRoster.length,
      icon: 'users' as const,
    },
    {
      id: 'staff',
      label: 'Nhân viên',
      count: staffRoster.length,
      icon: 'user-check' as const,
    },
  ];

  return (
    <div>
      {/* 1. CountedTabs at top of the unified card */}
      <CountedTabs
        tabs={tabs}
        activeId={activeTab}
        onChange={(id) => dispatch(setActiveTab(id as 'students' | 'staff'))}
      />

      {/* 2. Filter Toolbar */}
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
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-12)' }}>
          {activeTab === 'students' ? (
            <>
              {/* Class Select */}
              <div style={{ width: '180px' }}>
                <SelectField
                  value={selectedClassId}
                  onChange={(val) => dispatch(setAttendanceFilters({ classId: val }))}
                  options={[
                    { value: 'lop-1a2', label: 'Lớp Lá (1A2)' },
                    { value: 'lop-1a1', label: 'Lớp Chồi (1A1)' },
                    { value: 'infant', label: 'Nhà trẻ' },
                  ]}
                />
              </div>

              {/* Month Select */}
              <div style={{ width: '160px' }}>
                <SelectField
                  value={String(selectedMonth)}
                  onChange={(val) => dispatch(setAttendanceFilters({ month: parseInt(val, 10) }))}
                  options={[
                    { value: '9', label: 'Tháng 09/2026' },
                    { value: '8', label: 'Tháng 08/2026' },
                    { value: '10', label: 'Tháng 10/2026' },
                  ]}
                />
              </div>
            </>
          ) : (
            <>
              {/* Search Staff */}
              <div style={{ width: '220px' }}>
                <SearchField
                  value={staffSearchQuery}
                  onChange={(val) => dispatch(setAttendanceFilters({ staffSearchQuery: val }))}
                  placeholder="Tìm kiếm nhân viên..."
                />
              </div>

              {/* Role Select */}
              <div style={{ width: '180px' }}>
                <SelectField
                  value={selectedRole}
                  onChange={(val) => dispatch(setAttendanceFilters({ role: val }))}
                  options={[
                    { value: 'all', label: 'Tất cả vai trò' },
                    { value: 'giao_vien', label: 'Giáo Viên' },
                    { value: 'admin', label: 'Quản Trị Viên (Admin)' },
                    { value: 'quan_ly', label: 'Quản Lý Chuyên Môn' },
                    { value: 'nhan_vien', label: 'Nhân Viên / Hậu Cần' },
                  ]}
                />
              </div>

              {/* Month Select */}
              <div style={{ width: '160px' }}>
                <SelectField
                  value={String(selectedMonth)}
                  onChange={(val) => dispatch(setAttendanceFilters({ month: parseInt(val, 10) }))}
                  options={[
                    { value: '9', label: 'Tháng 09/2026' },
                    { value: '8', label: 'Tháng 08/2026' },
                    { value: '10', label: 'Tháng 10/2026' },
                  ]}
                />
              </div>
            </>
          )}
        </div>

        {/* Action Button */}
        <div>
          <Button
            variant="secondary"
            icon="download"
            onClick={handleExport}
          >
            Xuất dữ liệu Excel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceReportTabs;
