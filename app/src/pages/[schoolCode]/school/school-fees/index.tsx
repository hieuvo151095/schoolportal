/**
 * Fee Catalog Overview Page
 * Route: /[schoolCode]/school/school-fees
 * Governance: Marcus Fleet V34 / Constitution V1.0.0
 * References: docs_legacy/operating-portal/tai-chinh/khoan-phi.md (BR01-BR10)
 * Standardized with [DS] ECO ME DASHBOARD
 */

import React from 'react';
import Head from 'next/head';
import PortalLayout from '../../../../components/layout/PortalLayout';
import { PageHeader } from '../../../../components/ds';
import { FeeCatalogTable } from '../../../../modules/finance/catalog/FeeCatalogTable';
import { CreateFeeModal } from '../../../../modules/finance/catalog/CreateFeeModal';
import { EditFeeModal } from '../../../../modules/finance/catalog/EditFeeModal';
import { FeeAssignmentInfoModal } from '../../../../modules/finance/catalog/FeeAssignmentInfoModal';
import { DeleteFeeModal } from '../../../../modules/finance/catalog/DeleteFeeModal';

export default function SchoolFeesPage() {
  return (
    <PortalLayout>
      <Head>
        <title>Danh Mục Khoản Phí — Finviet School Portal</title>
        <meta
          name="description"
          content="Quản lý danh mục các khoản phí toàn trường, cấu hình xuất hóa đơn điện tử, đơn vị tính và số tiền mặc định."
        />
      </Head>

      <div className="space-y-6">
        {/* Page Header */}
        <PageHeader
          title="Danh Mục Khoản Phí"
          description="Quản lý các khoản phí hệ thống và tùy chỉnh của trường, bật/tắt xuất hóa đơn điện tử nhanh và theo dõi học sinh áp dụng."
        />

        {/* Master Catalog Table */}
        <FeeCatalogTable />

        {/* Global Modals */}
        <CreateFeeModal />
        <EditFeeModal />
        <FeeAssignmentInfoModal />
        <DeleteFeeModal />
      </div>
    </PortalLayout>
  );
}
