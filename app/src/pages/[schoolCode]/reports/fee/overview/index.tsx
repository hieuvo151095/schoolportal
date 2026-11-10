/**
 * Fee Report Class Overview Page
 * Route: /[schoolCode]/reports/fee/overview
 * Governance: Marcus Fleet V34 / Constitution V1.0.0
 * Design System: [DS] ECO ME DASHBOARD v1.1.0
 */

import React, { useMemo, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { PortalLayout } from '../../../../../components/layout/PortalLayout';
import { PageHeader, Button } from '../../../../../components/ds';
import { useAppDispatch, useAppSelector } from '../../../../../store';
import { setActiveTab } from '../../../../../store/slices/feeReportSlice';
import { calculateClassOverviewRows } from '../../../../../utils/feeReportValidation';
import { FeeReportTabsNav } from '../../../../../modules/finance/reports/FeeReportTabsNav';
import { FeeReportSummaryCards } from '../../../../../modules/finance/reports/FeeReportSummaryCards';
import { FeeReportToolbar } from '../../../../../modules/finance/reports/FeeReportToolbar';
import { FeeOverviewTable } from '../../../../../modules/finance/reports/FeeOverviewTable';

export default function FeeReportOverviewPage() {
  const router = useRouter();
  const schoolCode = (router.query.schoolCode as string) || 'demo';
  const dispatch = useAppDispatch();

  const { invoices, filters } = useAppSelector((state) => state.feeReport);

  useEffect(() => {
    dispatch(setActiveTab('overview'));
  }, [dispatch]);

  // Calculate overview rows, archived row, and totals (BR02)
  const { rows, totals, kpis } = useMemo(() => {
    return calculateClassOverviewRows(invoices, filters.classId);
  }, [invoices, filters.classId]);

  const handleExportExcel = () => {
    alert(
      `Đang xuất báo cáo tổng quan học phí cho ${rows.length} lớp học (Kỳ: ${filters.dateFrom} - ${filters.dateTo}) ra tệp Excel (.xlsx)...`
    );
  };

  return (
    <PortalLayout>
      <Head>
        <title>Báo Cáo Học Phí — Tổng Quan Theo Lớp | Finviet School Portal</title>
      </Head>

      <div className="space-y-6">
        {/* 4-Tab Navigation */}
        <FeeReportTabsNav schoolCode={schoolCode} />

        {/* Page Header */}
        <PageHeader
          title="Báo Cáo Học Phí — Tổng Quan Theo Lớp"
          description="Tổng hợp tỉ lệ hoàn thành thu học phí theo từng lớp trong kỳ, tách riêng học sinh lưu trữ"
          actions={
            <Button
              variant="primary"
              icon="download"
              onClick={handleExportExcel}
            >
              Xuất Excel
            </Button>
          }
        />

        {/* KPI Summary Cards */}
        <FeeReportSummaryCards kpis={kpis} />

        {/* Filter Toolbar */}
        <FeeReportToolbar
          currentTab="overview"
          recordCount={rows.length}
          onExportExcel={handleExportExcel}
        />

        {/* Class Overview Matrix */}
        <FeeOverviewTable
          rows={rows}
          totals={totals}
          schoolCode={schoolCode}
        />
      </div>
    </PortalLayout>
  );
}
