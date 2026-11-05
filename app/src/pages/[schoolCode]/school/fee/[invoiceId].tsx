/**
 * Invoice Detail View Page with VietQR and Payment History
 * Route: /[schoolCode]/school/fee/[invoiceId]
 * Governance: Marcus Fleet V34 / Constitution V1.0.0
 * References: docs_legacy/operating-portal/tai-chinh/hoc-phi.md (BR02, BR08, BR09)
 */

import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import PortalLayout from '../../../../components/layout/PortalLayout';
import { useAppSelector } from '../../../../store';
import { InvoiceDetailView } from '../../../../modules/finance/invoices/InvoiceDetailView';
import { ManualPaymentModal } from '../../../../modules/finance/invoices/ManualPaymentModal';
import { CancelInvoiceModal } from '../../../../modules/finance/invoices/CancelInvoiceModal';

export default function InvoiceDetailPage() {
  const router = useRouter();
  const schoolCode = (router.query.schoolCode as string) || 'demo';
  const rawInvoiceId = router.query.invoiceId as string;
  const pathParts = router.asPath.split('?')[0].split('/');
  const fallbackId = pathParts[pathParts.length - 1];
  const invoiceId = rawInvoiceId || (fallbackId && fallbackId !== '[invoiceId]' ? fallbackId : '');

  const { invoices } = useAppSelector((state) => state.invoice);

  const invoice = invoices.find(
    (inv) =>
      inv.id === invoiceId ||
      inv.invoiceNo.toLowerCase() === invoiceId.toLowerCase() ||
      inv.studentCode.toLowerCase() === invoiceId.toLowerCase() ||
      inv.studentId.toLowerCase() === invoiceId.toLowerCase()
  );

  return (
    <PortalLayout>
      <Head>
        <title>
          {invoice ? `${invoice.invoiceNo} - ${invoice.title}` : 'Chi Tiết Hóa Đơn'} — Finviet School Portal
        </title>
        <meta
          name="description"
          content="Chi tiết hóa đơn học phí, mã QR chuyển khoản và lịch sử thanh toán học sinh."
        />
      </Head>

      <div className="space-y-6">
        {invoice ? (
          <>
            <InvoiceDetailView invoice={invoice} />
            <ManualPaymentModal />
            <CancelInvoiceModal />
          </>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center max-w-lg mx-auto space-y-4">
            <h2 className="text-base font-bold text-slate-800">
              Không tìm thấy hóa đơn
            </h2>
            <p className="text-xs text-slate-500">
              Mã hóa đơn &quot;{invoiceId || 'N/A'}&quot; không tồn tại hoặc đã được xử lý lại.
            </p>
            <div className="pt-2">
              <Link
                href={`/${schoolCode}/school/fee`}
                className="px-4 py-2 bg-[#0070CE] hover:bg-blue-700 text-white rounded-lg text-xs font-bold inline-block"
              >
                Quay lại danh sách hóa đơn
              </Link>
            </div>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
