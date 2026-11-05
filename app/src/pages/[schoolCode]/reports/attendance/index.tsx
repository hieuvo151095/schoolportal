import React from 'react';
import Head from 'next/head';
import { PortalLayout } from '../../../../components/layout/PortalLayout';
import { AttendanceReportTabs } from '../../../../modules/operations/reports/AttendanceReportTabs';
import { AttendanceCalendarGrid } from '../../../../modules/operations/reports/AttendanceCalendarGrid';
import { DailyAttendanceModal } from '../../../../modules/operations/reports/DailyAttendanceModal';
import { EditAbsenceModal } from '../../../../modules/operations/reports/EditAbsenceModal';
import { LatePickupReportModal } from '../../../../modules/operations/reports/LatePickupReportModal';
import { PageHeader } from '@/components/ds';

export default function AttendanceReportsPage() {
  return (
    <PortalLayout>
      <Head>
        <title>Báo Cáo Điểm Danh | Finviet School Operating Portal</title>
        <meta name="description" content="Báo cáo điểm danh học sinh và nhân viên hàng tháng, thống kê chuyên cần và phụ phí đón muộn." />
      </Head>

      <div className="space-y-5">
        <PageHeader
          title="Báo cáo điểm danh"
          description="Báo cáo điểm danh học sinh và nhân viên hàng tháng, thống kê chuyên cần và phụ phí đón muộn"
        />

        {/* Unified Table Card: CountedTabs + Toolbar + Attendance Calendar Grid + Legend */}
        <div className="ecomd-table-card">
          <AttendanceReportTabs />
          <AttendanceCalendarGrid />
        </div>

        {/* Interactive Modals */}
        <DailyAttendanceModal />
        <EditAbsenceModal />
        <LatePickupReportModal />
      </div>
    </PortalLayout>
  );
}
