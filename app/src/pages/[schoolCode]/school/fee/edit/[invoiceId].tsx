/**
 * Draft Invoice Editor Page
 * Route: /[schoolCode]/school/fee/edit/[invoiceId]
 * Governance: Marcus Fleet V34 / Constitution V1.0.0
 * References: docs_legacy/operating-portal/tai-chinh/hoc-phi.md (BR06)
 */

import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import PortalLayout from '../../../../../components/layout/PortalLayout';
import { useAppSelector } from '../../../../../store';
import { InvoiceEditorView } from '../../../../../modules/finance/invoices/InvoiceEditorView';

export default function EditInvoicePage() {
  const router = useRouter();
  const rawInvoiceId = router.query.invoiceId as string;
  const pathParts = router.asPath.split('?')[0].split('/');
  const fallbackId = pathParts[pathParts.length - 1];
  const invoiceId = rawInvoiceId || (fallbackId && fallbackId !== '[invoiceId]' ? fallbackId : '');

  const { invoices } = useAppSelector((state) => state.invoice);

  const invoice = invoices.find(
    (inv) =>
      inv.id === invoiceId ||
      inv.invoiceNo.toLowerCase() === invoiceId.toLowerCase()
  );

  return (
    <PortalLayout>
      <Head>
        <title>
          {invoice ? `Chỉnh sửa ${invoice.invoiceNo}` : 'Chỉnh sửa hóa đơn'} — Finviet School Portal
        </title>
        <meta
          name="description"
          content="Chỉnh sửa chi tiết dòng thu, đơn giá, số lượng và giảm trừ của hóa đơn học phí."
        />
      </Head>

      <div className="space-y-6">
        {invoice ? (
          <InvoiceEditorView invoice={invoice} />
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center max-w-lg mx-auto">
            <h2 className="text-base font-bold text-slate-800">
              Không tìm thấy hóa đơn
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Mã hóa đơn &quot;{invoiceId}&quot; không tồn tại hoặc đã bị xóa.
            </p>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
