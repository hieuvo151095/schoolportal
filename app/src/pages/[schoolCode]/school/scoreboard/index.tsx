import React from 'react';
import Head from 'next/head';
import { PortalLayout } from '../../../../components/layout/PortalLayout';
import { ScoreboardSummaryCards } from '../../../../modules/academics/gradebook/ScoreboardSummaryCards';
import { ScoreboardOverviewGrid } from '../../../../modules/academics/gradebook/ScoreboardOverviewGrid';
import { ExtendedGradebookFilterModal } from '../../../../modules/academics/gradebook/ExtendedGradebookFilterModal';
import { PeriodicEvaluationModal } from '../../../../modules/academics/gradebook/PeriodicEvaluationModal';
import { PageHeader } from '@/components/ds';

export default function ScoreboardOverviewPage() {
  return (
    <PortalLayout>
      <Head>
        <title>Điểm & Đánh Giá | Finviet School Operating Portal</title>
        <meta
          name="description"
          content="Bảng điểm học tập theo môn và phiếu đánh giá định kỳ cho các cấp học từ Mầm non đến Trung học phổ thông theo Thông tư Bộ GD&ĐT."
        />
      </Head>

      <div className="space-y-5">
        <PageHeader
          title="Điểm & Đánh Giá"
          description="Tiến độ nhập điểm, công bố kết quả và tổng kết theo kỳ đánh giá của từng lớp học"
        />

        {/* Top Summary Metrics */}
        <ScoreboardSummaryCards />

        {/* Matrix Overview */}
        <ScoreboardOverviewGrid />

        {/* Advanced Filter Modal */}
        <ExtendedGradebookFilterModal />

        {/* Early Childhood Rubric Modal */}
        <PeriodicEvaluationModal />
      </div>
    </PortalLayout>
  );
}
