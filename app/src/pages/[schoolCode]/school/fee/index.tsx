/**
 * Tuition Invoices Overview Roster Page
 * Route: /[schoolCode]/school/fee
 * Governance: Marcus Fleet V34 / Constitution V1.0.0
 * Design System: [DS] ECO ME DASHBOARD v1.1.0
 * References: docs_legacy/operating-portal/tai-chinh/hoc-phi.md (BR01, BR04, BR11)
 */

import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import PortalLayout from '../../../../components/layout/PortalLayout';
import { PageHeader, Button } from '../../../../components/ds';
import { InvoiceRosterTable } from '../../../../modules/finance/invoices/InvoiceRosterTable';
import { ManualPaymentModal } from '../../../../modules/finance/invoices/ManualPaymentModal';
import { CancelInvoiceModal } from '../../../../modules/finance/invoices/CancelInvoiceModal';
import { ExtendedInvoiceFilterModal } from '../../../../modules/finance/invoices/ExtendedInvoiceFilterModal';

export default function FeeRosterPage() {
  const router = useRouter();
  const schoolCode = (router.query.schoolCode as string) || 'demo';

  return (
    <PortalLayout>
      <Head>
        <title>Học Phí & Hóa Đơn — Finviet School Portal</title>
        <meta
          name="description"
          content="Quản lý danh sách học phí, xuất hóa đơn, theo dõi thanh toán và đối soát học phí học sinh."
        />
      </Head>

      <div className="space-y-5">
        {/* Page Header */}
        <PageHeader
          title="Danh Sách Học Phí & Hóa Đơn"
          description="Theo dõi hóa đơn thu học phí, tiền ăn bán trú, cơ sở vật chất và quản lý lịch sử thanh toán học sinh."
        />

        {/* Tuition Roster Table */}
        <InvoiceRosterTable />

        {/* Global Modals */}
        <ManualPaymentModal />
        <CancelInvoiceModal />
        <ExtendedInvoiceFilterModal />
      </div>
    </PortalLayout>
  );
}
