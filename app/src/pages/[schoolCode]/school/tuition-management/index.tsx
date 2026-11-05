/**
 * Tuition Management Overview Page (Quản Lý Học Phí)
 * Route: /[schoolCode]/school/tuition-management
 * Governance: Marcus Fleet V34 / Constitution V1.0.0
 * References: docs_legacy/operating-portal/tai-chinh/quan-ly-hoc-phi.md (BR01-BR10)
 * Standardized with [DS] ECO ME DASHBOARD
 */

import React from 'react';
import Head from 'next/head';
import PortalLayout from '../../../../components/layout/PortalLayout';
import { PageHeader } from '../../../../components/ds';
import { ClassFeeScheduleTable } from '../../../../modules/finance/tuition/ClassFeeScheduleTable';

export default function TuitionManagementOverviewPage() {
  return (
    <PortalLayout>
      <Head>
        <title>Quản Lý Học Phí — Finviet School Portal</title>
        <meta
          name="description"
          content="Quản lý cấu hình khoản phí theo từng lớp, theo dõi mức học phí, tiền ăn và các khoản thu tùy chọn của học sinh."
        />
      </Head>

      <div className="space-y-6">
        {/* Page Header */}
        <PageHeader
          title="Quản Lý Học Phí"
          description="Gán các khoản phí từ danh mục vào từng lớp học, thiết lập số tiền mặc định và chuyển hướng nhanh sang quản lý hóa đơn."
        />

        {/* Master Class Schedule Table */}
        <ClassFeeScheduleTable />
      </div>
    </PortalLayout>
  );
}
