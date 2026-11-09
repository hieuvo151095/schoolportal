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
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 sm:px-5 sm:py-4 border-b border-[var(--border-default)] bg-[var(--bg-surface)]">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center flex-wrap gap-2.5 sm:gap-3 w-full sm:w-auto">
          {activeTab === 'students' ? (
            <>
              {/* Class Select */}
              <div className="w-full sm:w-[180px]">
                <SelectField
                  value={selectedClassId}
                  onChange={(val) => dispatch(setAttendanceFilters({ classId: val }))}
                  options={[
                    { value: 'lop-1a2', label: 'Lớp Lá (1A2)' },
                    { value: 'lop-1a1', label: 'Lớp Chồi (1A1)' },
                    { value: 'infant', label: 'Nhà trẻ' },
                  ]}
                  fullWidth
                  className="w-full"
                />
              </div>

              {/* Month Select */}
              <div className="w-full sm:w-[160px]">
                <SelectField
                  value={String(selectedMonth)}
                  onChange={(val) => dispatch(setAttendanceFilters({ month: parseInt(val, 10) }))}
                  options={[
                    { value: '9', label: 'Tháng 09/2026' },
                    { value: '8', label: 'Tháng 08/2026' },
                    { value: '10', label: 'Tháng 10/2026' },
                  ]}
                  fullWidth
                  className="w-full"
                />
              </div>
            </>
          ) : (
            <>
              {/* Search Staff */}
              <div className="w-full sm:w-[220px]">
                <SearchField
                  value={staffSearchQuery}
                  onChange={(val) => dispatch(setAttendanceFilters({ staffSearchQuery: val }))}
                  placeholder="Tìm kiếm nhân viên..."
                  block
                  className="w-full"
                />
              </div>

              {/* Role Select */}
              <div className="w-full sm:w-[180px]">
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
                  fullWidth
                  className="w-full"
                />
              </div>

              {/* Month Select */}
              <div className="w-full sm:w-[160px]">
                <SelectField
                  value={String(selectedMonth)}
                  onChange={(val) => dispatch(setAttendanceFilters({ month: parseInt(val, 10) }))}
                  options={[
                    { value: '9', label: 'Tháng 09/2026' },
                    { value: '8', label: 'Tháng 08/2026' },
                    { value: '10', label: 'Tháng 10/2026' },
                  ]}
                  fullWidth
                  className="w-full"
                />
              </div>
            </>
          )}
        </div>

        {/* Action Button */}
        <div className="w-full sm:w-auto">
          <Button
            variant="secondary"
            icon="download"
            onClick={handleExport}
            className="w-full sm:w-auto justify-center"
          >
            Xuất dữ liệu Excel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceReportTabs;
