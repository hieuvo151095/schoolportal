import React, { useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { PortalLayout } from '../../../../components/layout/PortalLayout';
import { ExtendedReportTable } from '../../../../modules/operations/reports/ExtendedReportTable';
import { ExtendedFilterModal } from '../../../../modules/operations/reports/ExtendedFilterModal';
import { DuplicateReportModal } from '../../../../modules/operations/reports/DuplicateReportModal';
import { useAppDispatch, useAppSelector } from '../../../../store';
import { setReportFilterCriteria, toggleExtendedFilter } from '../../../../store/slices/reportsSlice';
import { ReportLifecycleStatus } from '../../../../types/reports';
import { PageHeader, CountedTabs, SearchField, Button } from '@/components/ds';

export default function ExtendedReportsPage() {
  const router = useRouter();
  const schoolCode = (router.query.schoolCode as string) || 'demo';
  const dispatch = useAppDispatch();

  const reports = useAppSelector((state) => state.reports.extendedReports);
  const filter = useAppSelector((state) => state.reports.reportFilters);

  const hasActiveFilters =
    (filter.templateId && filter.templateId !== 'all') ||
    (filter.status && filter.status !== 'all');

  const draftCount = useMemo(() => reports.filter((r) => r.status === 'draft').length, [reports]);
  const sentCount = useMemo(() => reports.filter((r) => r.status === 'sent').length, [reports]);
  const completedCount = useMemo(() => reports.filter((r) => r.status === 'completed').length, [reports]);

  const tabs = [
    { id: 'all', label: 'Tất cả báo cáo', count: reports.length, icon: 'layer-group' as const },
    { id: 'draft', label: 'Bản nháp', count: draftCount, icon: 'clock' as const },
    { id: 'sent', label: 'Đã gửi PH', count: sentCount, icon: 'paper-plane' as const },
    { id: 'completed', label: 'Hoàn tất', count: completedCount, icon: 'circle-check' as const },
  ];

  return (
    <PortalLayout>
      <Head>
        <title>Báo Cáo Mở Rộng | Finviet School Operating Portal</title>
        <meta
          name="description"
          content="Danh sách và quản lý các biểu mẫu báo cáo phát triển, đánh giá định kỳ và thư tuần."
        />
      </Head>

      <div className="space-y-5">
        {/* Page Header */}
        <PageHeader
          title="Báo Cáo Mở Rộng"
          description="Quản lý các biểu mẫu đánh giá năng lực ngôn ngữ, tư duy toán học, nhận xét định kỳ và thư tuần của học sinh"
          actions={
            <Link href={`/${schoolCode}/reports/create/create-extended/`} style={{ textDecoration: 'none' }}>
              <Button variant="primary" icon="plus">
                Tạo Báo Cáo Mới
              </Button>
            </Link>
          }
        />

        {/* Unified Table Card: CountedTabs + Filter Bar + Table + Footer */}
        <div className="ecomd-table-card">
          {/* 1. CountedTabs */}
          <CountedTabs
            tabs={tabs}
            activeId={filter.status || 'all'}
            onChange={(id) => dispatch(setReportFilterCriteria({ status: id as 'all' | ReportLifecycleStatus }))}
          />

          {/* 2. Filter Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 sm:px-5 sm:py-4 border-b border-[var(--border-default)] bg-[var(--bg-surface)]">
            <div className="w-full sm:w-[360px]">
              <SearchField
                value={filter.searchQuery || ''}
                onChange={(q) => dispatch(setReportFilterCriteria({ searchQuery: q }))}
                placeholder="Tìm kiếm học sinh theo tên hoặc mã..."
                block
                className="w-full"
              />
            </div>

            <div className="w-full sm:w-auto flex items-center justify-end">
              <Button
                variant="secondary"
                icon="filter"
                active={Boolean(hasActiveFilters)}
                onClick={() => dispatch(toggleExtendedFilter(true))}
                className="w-full sm:w-auto justify-center"
              >
                Bộ lọc nâng cao {hasActiveFilters && '(Đang áp dụng)'}
              </Button>
            </div>
          </div>

          {/* 3. Data Table */}
          <ExtendedReportTable />
        </div>

        {/* Filter Drawer / Modal */}
        <ExtendedFilterModal />

        {/* Duplication Dialog */}
        <DuplicateReportModal />
      </div>
    </PortalLayout>
  );
}
