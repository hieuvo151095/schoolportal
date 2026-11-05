import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { PortalLayout } from '../../../../components/layout/PortalLayout';
import { AssignmentSummaryCards } from '../../../../modules/academics/assignment/AssignmentSummaryCards';
import { AssignmentToolbar } from '../../../../modules/academics/assignment/AssignmentToolbar';
import { AssignmentTable } from '../../../../modules/academics/assignment/AssignmentTable';
import { ExtendedAssignmentFilterModal } from '../../../../modules/academics/assignment/ExtendedAssignmentFilterModal';
import { PageHeader } from '@/components/ds';

export default function AssignmentCatalogPage() {
  const router = useRouter();
  const schoolCode = (router.query.schoolCode as string) || 'demo';

  return (
    <PortalLayout>
      <Head>
        <title>Bài Tập | Finviet School Operating Portal</title>
        <meta
          name="description"
          content="Quản lý bài tập về nhà theo lớp và môn học, theo dõi tình trạng nộp bài, nộp bài thay và đánh giá chấm điểm."
        />
      </Head>

      <div className="space-y-5">
        <PageHeader
          title="Bài Tập"
          description="Quản lý bài tập về nhà giao cho học sinh theo lớp, theo dõi tiến độ nộp bài và đánh giá kết quả học tập"
        />

        {/* Top Summary Metrics */}
        <AssignmentSummaryCards />

        {/* Unified Table Card Architecture */}
        <div className="ecomd-table-card">
          <AssignmentToolbar schoolCode={schoolCode} />
          <AssignmentTable schoolCode={schoolCode} />
        </div>

        {/* Extended Filter Drawer (BR12) */}
        <ExtendedAssignmentFilterModal />
      </div>
    </PortalLayout>
  );
}
