import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { PortalLayout } from '../../../../components/layout/PortalLayout';
import { ScheduleToolbar } from '../../../../modules/academics/schedule/ScheduleToolbar';
import { ScheduleTable } from '../../../../modules/academics/schedule/ScheduleTable';
import { SendHistoryModal } from '../../../../modules/academics/schedule/SendHistoryModal';
import { CloneScheduleModal } from '../../../../modules/academics/schedule/CloneScheduleModal';
import { ExtendedScheduleFilterModal } from '../../../../modules/academics/schedule/ExtendedScheduleFilterModal';
import { UploadScheduleModal } from '../../../../modules/academics/schedule/UploadScheduleModal';
import { PageHeader } from '@/components/ds';

export default function ScheduleCatalogPage() {
  const router = useRouter();
  const schoolCode = (router.query.schoolCode as string) || 'demo';

  return (
    <PortalLayout>
      <Head>
        <title>Thời Khóa Biểu | Finviet School Operating Portal</title>
        <meta
          name="description"
          content="Quản lý thời khóa biểu học tập các lớp, ma trận tiết học hàng tuần, tài liệu đính kèm và lịch sử gửi thông báo phụ huynh."
        />
      </Head>

      <div className="space-y-5">
        <PageHeader
          title="Thời Khóa Biểu"
          description="Quản lý lịch học theo tuần của các lớp, thời khóa biểu dạng lưới hoặc tệp đính kèm và lịch sử phát hành thông báo"
        />

        {/* Unified Table Card Architecture */}
        <div className="ecomd-table-card">
          <ScheduleToolbar schoolCode={schoolCode} />
          <ScheduleTable schoolCode={schoolCode} />
        </div>

        {/* Global Modals for Epic 6 */}
        <SendHistoryModal />
        <CloneScheduleModal />
        <ExtendedScheduleFilterModal />
        <UploadScheduleModal />
      </div>
    </PortalLayout>
  );
}
