import React, { useState, useMemo } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAppDispatch } from '@/store';
import { addToast } from '@/store/slices/toastSlice';
import PortalLayout from '@/components/layout/PortalLayout';
import { PageHeader } from '@/components/ds';
import RewardReportToolbar from '@/modules/operations/reports/reward/RewardReportToolbar';
import RewardReportSummaryCards from '@/modules/operations/reports/reward/RewardReportSummaryCards';
import RewardReportMatrixTable from '@/modules/operations/reports/reward/RewardReportMatrixTable';
import RewardDetailSlideOver from '@/modules/operations/reward/RewardDetailSlideOver';
import {
  buildMonthlyRewardReport,
  exportRewardReportToCsv,
} from '@/utils/rewardReportValidation';
import { getRewardRecordsForClassAndWeek } from '@/services/mockRewardData';
import type { StudentRewardReportRow } from '@/types/rewardReport';
import type { StudentRewardRecord } from '@/types/reward';

export default function RewardReportPage() {
  const router = useRouter();
  const schoolCode = (router.query.schoolCode as string) || 'demo';

  const dispatch = useAppDispatch();
  const [selectedClassId, setSelectedClassId] = useState<string>('lop-1a1');
  const [selectedMonth, setSelectedMonth] = useState<string>('2026-11');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected student for detail slideover
  const [selectedStudentForDetail, setSelectedStudentForDetail] = useState<StudentRewardRecord | null>(null);
  const [isSlideOverOpen, setIsSlideOverOpen] = useState<boolean>(false);

  // Build report model
  const report = useMemo(() => {
    return buildMonthlyRewardReport(selectedClassId, selectedMonth);
  }, [selectedClassId, selectedMonth]);

  const handleExport = () => {
    const csvData = exportRewardReportToCsv(report);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Bao_cao_phieu_be_ngoan_${report.className}_${selectedMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    dispatch(
      addToast({
        type: 'success',
        title: 'Xuất file thành công',
        message: `Đã xuất báo cáo phiếu bé ngoan lớp ${report.className} - ${report.monthLabel}.`,
      })
    );
  };

  const handleOpenDetail = (row: StudentRewardReportRow) => {
    // Find matching full record from current week
    const currentWeekRecords = getRewardRecordsForClassAndWeek(selectedClassId, 29);
    const student = currentWeekRecords.find((s) => s.studentId === row.studentId) || {
      studentId: row.studentId,
      studentCode: row.studentCode,
      fullName: row.fullName,
      nickname: row.nickname,
      avatarUrl: row.avatarUrl,
      gender: row.gender,
      parentName: 'Phụ huynh học sinh',
      parentPhone: '0912345678',
      classId: selectedClassId,
      weekNumber: 29,
      weekRange: '16/11 - 20/11/2026',
      monthWeek: 3,
      isAwarded: row.weeklyStatus[29]?.isAwarded ?? true,
      isPublished: true,
      publishedAt: '16/11/2026 15:33',
      excusedAbsenceCount: row.weeklyStatus[29]?.excusedAbsence ?? 0,
      unexcusedAbsenceCount: row.weeklyStatus[29]?.unexcusedAbsence ?? 0,
      teacherComment: row.weeklyStatus[29]?.teacherComment ?? 'Bé chăm ngoan, ăn hết suất',
      monthHistory: [
        {
          week: 1,
          weekLabel: 'Tuần 1 • 02/11 - 08/11',
          weekRange: '02/11 - 08/11/2026',
          isAwarded: row.weeklyStatus[27]?.isAwarded ?? true,
        },
        {
          week: 2,
          weekLabel: 'Tuần 2 • 09/11 - 15/11',
          weekRange: '09/11 - 15/11/2026',
          isAwarded: row.weeklyStatus[28]?.isAwarded ?? true,
        },
        {
          week: 3,
          weekLabel: 'Tuần 3 • 16/11 - 22/11',
          weekRange: '16/11 - 22/11/2026',
          isAwarded: row.weeklyStatus[29]?.isAwarded ?? true,
        },
        {
          week: 4,
          weekLabel: 'Tuần 4 • 23/11 - 29/11',
          weekRange: '23/11 - 29/11/2026',
          isAwarded: false,
        },
      ],
    };

    setSelectedStudentForDetail(student);
    setIsSlideOverOpen(true);
  };

  return (
    <PortalLayout>
      <Head>
        <title>Báo Cáo Phiếu Bé Ngoan | ECO School Portal</title>
      </Head>

      <div className="space-y-5">
        {/* Page Header */}
        <PageHeader
          title={`Báo cáo phiếu bé ngoan — ${report.className}`}
          description={`Tổng hợp kết quả đánh giá nề nếp rèn luyện, số lượng phiếu bé ngoan và thống kê chuyên cần ${report.monthLabel}.`}
        />

        {/* 4 Stat Cards */}
        <RewardReportSummaryCards
          summary={report.summary}
          monthLabel={report.monthLabel}
        />

        {/* Unified Table Card: Single Frame Line Toolbar + Matrix Table */}
        <div className="ecomd-table-card overflow-hidden w-full max-w-full">
          <RewardReportToolbar
            selectedClassId={selectedClassId}
            onClassChange={(id) => setSelectedClassId(id)}
            selectedMonth={selectedMonth}
            onMonthChange={(m) => setSelectedMonth(m)}
            searchQuery={searchQuery}
            onSearchChange={(q) => setSearchQuery(q)}
            onExport={handleExport}
          />

          {/* Matrix Table with Sun character indicators */}
          <RewardReportMatrixTable
            report={report}
            searchQuery={searchQuery}
            onOpenDetail={handleOpenDetail}
          />
        </div>

        {/* Certificate Preview SlideOver */}
        <RewardDetailSlideOver
          record={selectedStudentForDetail}
          open={isSlideOverOpen}
          onClose={() => setIsSlideOverOpen(false)}
          onSave={() => {
            setIsSlideOverOpen(false);
          }}
        />
      </div>
    </PortalLayout>
  );
}
