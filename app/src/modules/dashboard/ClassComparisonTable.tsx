import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  CountedTabs,
  DropdownMenu,
  EmptyState,
  FilterBar,
  IconButton,
  StatusTag,
  Tag,
} from '@/components/ds';
import { DASHBOARD_GRADE_OPTIONS } from '@/services/mockDashboardData';
import { formatVndCurrency } from '@/utils/dashboardAnalytics';
import type {
  ClassMatrixStatus,
  ClassPerformanceRow,
} from '@/types/dashboard';

interface ClassComparisonTableProps {
  rows: ClassPerformanceRow[];
  allGradeFilteredRows: ClassPerformanceRow[];
  schoolCode: string;
  searchQuery: string;
  gradeScope: string;
  statusFilter: 'all' | ClassMatrixStatus;
  onSearchChange: (q: string) => void;
  onGradeScopeChange: (scope: string) => void;
  onStatusFilterChange: (status: 'all' | ClassMatrixStatus) => void;
}

export const ClassComparisonTable: React.FC<ClassComparisonTableProps> = ({
  rows,
  allGradeFilteredRows,
  schoolCode,
  searchQuery,
  gradeScope,
  statusFilter,
  onSearchChange,
  onGradeScopeChange,
  onStatusFilterChange,
}) => {
  const router = useRouter();

  const stableCount = allGradeFilteredRows.filter((r) => r.status === 'stable').length;
  const warningCount = allGradeFilteredRows.filter((r) => r.status === 'warning').length;
  const criticalCount = allGradeFilteredRows.filter((r) => r.status === 'critical').length;

  return (
    <div
      data-testid="class-comparison-table"
      className="ecomd-table-card w-full max-w-full"
    >
      {/* Card Title Header */}
      <div className="px-4 pt-4 pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[var(--bg-surface)]">
        <div>
          <h2 className="body-md-bold text-[var(--text-heading)]">
            Ma Trận Hiệu Suất Theo Lớp Học
          </h2>
          <p className="body-xs text-[var(--text-subtle)] mt-0.5">
            Đối chiếu chéo sĩ số, chuyên cần, chăm sóc bán trú, khen thưởng và thu học phí giữa các lớp
          </p>
        </div>
      </div>

      {/* Counted Tabs */}
      <CountedTabs
        activeId={statusFilter}
        onChange={(id) => onStatusFilterChange(id as 'all' | ClassMatrixStatus)}
        tabs={[
          { id: 'all', label: 'Tất cả lớp', count: allGradeFilteredRows.length },
          { id: 'stable', label: 'Ổn định', count: stableCount },
          { id: 'warning', label: 'Cần chú ý', count: warningCount },
          { id: 'critical', label: 'Cảnh báo', count: criticalCount },
        ]}
      />

      {/* Single Frame Line FilterBar */}
      <FilterBar
        search={{
          placeholder: 'Tìm theo tên lớp, giáo viên...',
          value: searchQuery,
          onChange: onSearchChange,
        }}
        filters={[
          {
            placeholder: 'Chọn khối lớp',
            value: gradeScope,
            defaultValue: 'all',
            onChange: onGradeScopeChange,
            options: DASHBOARD_GRADE_OPTIONS,
          },
        ]}
      />

      {/* Responsive Table */}
      <div className="ecomd-table-scroll">
        <table className="ecomd-table ecomd-table--dense w-full">
          <thead className="sticky top-0 z-20 bg-[var(--bg-subtle)]">
            <tr>
              <th className="body-xs-semibold text-[var(--text-subtle)] is-primary" style={{ minWidth: '185px' }}>
                Lớp học & GVCN
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)] text-center" style={{ width: '90px' }}>
                Sĩ số
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)] text-center" style={{ width: '115px' }}>
                Chuyên cần
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)] text-center" style={{ width: '115px' }}>
                Ăn hết suất
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)] text-center" style={{ width: '125px' }}>
                Phiếu bé ngoan
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)] text-right" style={{ width: '155px' }}>
                Học phí / Còn nợ
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ width: '140px' }}>
                Tình trạng
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)] is-right is-actions" style={{ width: '64px', textAlign: 'right' }}>
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-0">
                  <EmptyState
                    icon="school"
                    title="Không tìm thấy lớp học phù hợp"
                    description="Hãy thử xóa từ khóa tìm kiếm hoặc chuyển sang khối lớp khác."
                  />
                </td>
              </tr>
            ) : (
              rows.map((row) => {
                // Demo class routes resolve reliably on lop-1a1 workspace
                const targetClassId = 'lop-1a1';
                const attColorClass =
                  row.attendanceRate >= 94
                    ? 'text-[var(--color-semantic-green)]'
                    : row.attendanceRate >= 90
                    ? 'text-[var(--color-semantic-orange)]'
                    : 'text-[var(--color-danger)]';

                const mealColorClass =
                  row.mealCompletionRate >= 90
                    ? 'text-[var(--color-semantic-green)]'
                    : row.mealCompletionRate >= 82
                    ? 'text-[var(--text-heading)]'
                    : 'text-[var(--color-semantic-orange)]';

                const feeColorClass =
                  row.tuitionCollectionRate >= 90
                    ? 'text-[var(--color-semantic-green)]'
                    : row.tuitionCollectionRate >= 80
                    ? 'text-[var(--eco-blue-strong)]'
                    : 'text-[var(--color-danger)]';

                return (
                  <tr key={row.classId}>
                    {/* Lớp học & GVCN */}
                    <td className="body-sm is-primary">
                      <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                        Lớp học
                      </span>
                      <div className="ecomd-cell__value flex-col">
                        <div className="flex items-center gap-1.5">
                          <Link
                            href={`/${schoolCode}/class/${targetClassId}/attendance`}
                            className="body-sm-bold text-[var(--eco-blue-strong)] hover:underline"
                          >
                            {row.className}
                          </Link>
                          <Tag variant="default">{row.gradeName}</Tag>
                        </div>
                        <div className="body-xs text-[var(--text-subtle)] mt-0.5">
                          {row.homeroomTeacher}
                        </div>
                      </div>
                    </td>

                    {/* Sĩ số */}
                    <td className="body-sm font-numeric text-center">
                      <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                        Sĩ số
                      </span>
                      <div className="ecomd-cell__value justify-center font-semibold text-[var(--text-heading)] tabular-nums">
                        {row.studentCount}/{row.capacity}
                      </div>
                    </td>

                    {/* Chuyên cần */}
                    <td className="body-sm font-numeric text-center">
                      <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                        Chuyên cần
                      </span>
                      <div className="ecomd-cell__value justify-center">
                        <div className="flex flex-col items-center">
                          <span className={`font-bold tabular-nums ${attColorClass}`}>
                            {row.attendanceRate.toFixed(1)}%
                          </span>
                          <span className="text-[11px] text-[var(--text-subtle)] tabular-nums whitespace-nowrap">
                            {row.presentCount} có mặt • {row.absentCount} vắng
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Ăn hết suất */}
                    <td className="body-sm font-numeric text-center">
                      <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                        Ăn hết suất
                      </span>
                      <div className={`ecomd-cell__value justify-center font-semibold tabular-nums ${mealColorClass}`}>
                        {row.mealCompletionRate.toFixed(1)}%
                      </div>
                    </td>

                    {/* Phiếu bé ngoan */}
                    <td className="body-sm font-numeric text-center">
                      <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                        Phiếu bé ngoan
                      </span>
                      <div className="ecomd-cell__value justify-center font-semibold text-[var(--eco-blue-strong)] tabular-nums">
                        {row.rewardRate.toFixed(1)}%
                      </div>
                    </td>

                    {/* Thu học phí & Còn nợ */}
                    <td className="body-sm font-numeric text-right">
                      <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                        Thu học phí
                      </span>
                      <div className="ecomd-cell__value justify-end">
                        <div className="flex flex-col items-end">
                          <span className={`font-bold tabular-nums ${feeColorClass}`}>
                            {row.tuitionCollectionRate.toFixed(1)}%
                          </span>
                          <span className="text-[11px] text-[var(--text-subtle)] tabular-nums whitespace-nowrap">
                            Nợ: {formatVndCurrency(row.tuitionRemainingVnd)}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Tình trạng */}
                    <td className="body-sm">
                      <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                        Tình trạng
                      </span>
                      <div className="ecomd-cell__value">
                        <div className="flex flex-col items-start">
                          {row.status === 'stable' && (
                            <StatusTag tone="success" label="Ổn định" icon />
                          )}
                          {row.status === 'warning' && (
                            <StatusTag tone="warning" label="Cần chú ý" icon />
                          )}
                          {row.status === 'critical' && (
                            <StatusTag tone="danger" label="Cảnh báo" icon />
                          )}
                          {row.alertNote && (
                            <span className="text-[11px] text-[var(--text-subtle)] mt-1 leading-tight">
                              {row.alertNote}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Thao tác 3 chấm */}
                    <td className="body-sm is-right is-actions" style={{ textAlign: 'right' }}>
                      <div className="ecomd-cell__value flex justify-end">
                        <DropdownMenu
                          trigger={
                            <IconButton
                              icon="ellipsis-vertical"
                              label={`Thao tác lớp ${row.className}`}
                            />
                          }
                          items={[
                            {
                              label: 'Xem Điểm danh lớp',
                              icon: 'calendar-check',
                              onClick: () =>
                                router.push(`/${schoolCode}/class/${targetClassId}/attendance`),
                            },
                            {
                              label: 'Xem Chăm sóc trẻ',
                              icon: 'utensils',
                              onClick: () =>
                                router.push(`/${schoolCode}/class/${targetClassId}/nutrition`),
                            },
                            {
                              label: 'Xem Phiếu bé ngoan',
                              icon: 'bookmark',
                              onClick: () =>
                                router.push(`/${schoolCode}/class/${targetClassId}/reward`),
                            },
                            { divider: true },
                            {
                              label: 'Quản lý học phí lớp',
                              icon: 'coins',
                              onClick: () =>
                                router.push(`/${schoolCode}/school/fee`),
                            },
                          ]}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
