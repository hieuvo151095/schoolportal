import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import PortalLayout from '@/components/layout/PortalLayout';
import FeedbackKPICards from '@/modules/school/feedback/FeedbackKPICards';
import FeedbackToolbar from '@/modules/school/feedback/FeedbackToolbar';
import FeedbackRoster from '@/modules/school/feedback/FeedbackRoster';
import ClosureModal from '@/modules/school/feedback/ClosureModal';
import ProfileQuickViewModal from '@/modules/school/feedback/ProfileQuickViewModal';

export default function SchoolFeedbackPage() {
  const router = useRouter();
  const { schoolCode = 'demo' } = router.query;
  const currentSchoolCode = (schoolCode as string) || 'demo';

  return (
    <PortalLayout schoolCode={currentSchoolCode}>
      <Head>
        <title>Hòm Thư Góp Ý Phụ Huynh | SOHA Operating Portal</title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Page Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
              Hòm Thư Góp Ý Phụ Huynh
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Tiếp nhận, phân loại và giải quyết các đề xuất, phản ánh gửi từ phụ huynh học sinh
            </p>
          </div>
        </div>

        {/* 4 Status KPI / Filter Cards (BR02, K055) */}
        <FeedbackKPICards />

        {/* Multi-Factor Filter Toolbar */}
        <FeedbackToolbar />

        {/* Feedback Ticket Roster Table */}
        <FeedbackRoster />

        {/* Terminal Closure & Read-Only Profile Modals */}
        <ClosureModal />
        <ProfileQuickViewModal />
      </div>
    </PortalLayout>
  );
}
