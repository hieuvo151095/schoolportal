/**
 * Electronic Payment Reconciliation Overview Page
 * Route: /[schoolCode]/school/reconciliation
 * Governance: Marcus Fleet V34 / Constitution V1.0.0
 * Design System: [DS] ECO ME DASHBOARD v1.1.0
 */

import React, { useMemo } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { PortalLayout } from '../../../../components/layout/PortalLayout';
import { PageHeader, Button } from '../../../../components/ds';
import { useAppDispatch, useAppSelector } from '../../../../store';
import { setDateRange } from '../../../../store/slices/reconciliationSlice';
import {
  calculateSessionAggregates,
  filterSessions,
  formatReconciliationAmount,
} from '../../../../utils/reconciliationValidation';
import { ReconciliationSummaryCards } from '../../../../modules/finance/reconciliation/ReconciliationSummaryCards';
import { ReconciliationToolbar } from '../../../../modules/finance/reconciliation/ReconciliationToolbar';
import { ReconciliationSessionTable } from '../../../../modules/finance/reconciliation/ReconciliationSessionTable';
import { ReconciliationSession } from '../../../../types/reconciliation';

export default function ReconciliationOverviewPage() {
  const router = useRouter();
  const schoolCode = (router.query.schoolCode as string) || 'demo';
  const dispatch = useAppDispatch();

  const { sessions, startDate, endDate } = useAppSelector(
    (state) => state.reconciliation
  );

  // Filter sessions by date range (BR01, BR05)
  const filteredSessions = useMemo(() => {
    return filterSessions(sessions, startDate, endDate);
  }, [sessions, startDate, endDate]);

  // Calculate aggregates across filtered sessions
  const aggregates = useMemo(() => {
    return calculateSessionAggregates(filteredSessions);
  }, [filteredSessions]);

  const handleDateChange = (newStart: string, newEnd: string) => {
    dispatch(setDateRange({ startDate: newStart, endDate: newEnd }));
  };

  const handleExportAll = () => {
    if (filteredSessions.length === 0) return;
    alert(
      `Đang xuất báo cáo Excel cho ${filteredSessions.length} phiên đối soát (${startDate} đến ${endDate}) với tổng số tiền ${formatReconciliationAmount(
        aggregates.totalAmount
      )}...`
    );
  };

  const handleExportSession = (session: ReconciliationSession) => {
    alert(
      `Đang xuất báo cáo đối soát phiên ${session.sessionCode} (${session.transactionPeriod}) - Tổng tiền: ${formatReconciliationAmount(
        session.totalAmount
      )}...`
    );
  };

  return (
    <PortalLayout>
      <Head>
        <title>Đối Soát Thanh Toán Điện Tử | FinViet School Portal</title>
      </Head>

      <div className="space-y-6">
        {/* Page Header */}
        <PageHeader
          title="Đối Soát Thanh Toán Điện Tử"
          description="Theo dõi, đối chiếu các giao dịch thanh toán học phí qua cổng Ví FinViet và QR Ecopay với hóa đơn Học Phí"
        />

        {/* Top KPI Metrics Strip */}
        <ReconciliationSummaryCards
          totalAmount={aggregates.totalAmount}
          totalTransactions={aggregates.totalTransactions}
          totalSessions={aggregates.totalSessions}
          startDate={startDate}
          endDate={endDate}
        />

        {/* Unified Master Table Card: FilterBar + Sessions Table */}
        <div className="ecomd-table-card">
          <ReconciliationToolbar
            startDate={startDate}
            endDate={endDate}
            onDateChange={handleDateChange}
            sessionCount={filteredSessions.length}
            onExport={handleExportAll}
          />
          <ReconciliationSessionTable
            sessions={filteredSessions}
            schoolCode={schoolCode}
            onExportSession={handleExportSession}
          />
        </div>
      </div>
    </PortalLayout>
  );
}
