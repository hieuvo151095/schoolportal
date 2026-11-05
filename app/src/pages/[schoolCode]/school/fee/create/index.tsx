/**
 * Batch Invoice Creation Wizard Page
 * Route: /[schoolCode]/school/fee/create
 * Governance: Marcus Fleet V34 / Constitution V1.0.0
 * References: docs_legacy/operating-portal/tai-chinh/hoc-phi.md (BR05, BR07) & TASK-FIN-002
 */

import React from 'react';
import Head from 'next/head';
import PortalLayout from '../../../../../components/layout/PortalLayout';
import { CreateInvoiceWizard } from '../../../../../modules/finance/invoices/CreateInvoiceWizardModal';

export default function CreateInvoicePage() {
  return (
    <PortalLayout>
      <Head>
        <title>Tạo Hóa Đơn Học Phí — Finviet School Portal</title>
        <meta
          name="description"
          content="Tạo hóa đơn học phí hàng loạt cho toàn trường, khối, lớp hoặc học sinh."
        />
      </Head>

      <div className="py-4">
        <CreateInvoiceWizard />
      </div>
    </PortalLayout>
  );
}
