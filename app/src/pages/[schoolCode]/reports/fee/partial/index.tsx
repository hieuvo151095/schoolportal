import React, { useMemo, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { PortalLayout } from '../../../../../components/layout/PortalLayout';
import { PageHeader } from '../../../../../components/ds';
import { useAppDispatch, useAppSelector } from '../../../../../store';
import {
  setActiveTab,
  openPaymentHistoryModal,
  closePaymentHistoryModal,
} from '../../../../../store/slices/feeReportSlice';
import { filterPartialInvoices } from '../../../../../utils/feeReportValidation';
import { FeeReportTabsNav } from '../../../../../modules/finance/reports/FeeReportTabsNav';
import { FeeReportToolbar } from '../../../../../modules/finance/reports/FeeReportToolbar';
import { PartialInvoicesTable } from '../../../../../modules/finance/reports/PartialInvoicesTable';
import { PaymentHistoryModal } from '../../../../../modules/finance/reports/PaymentHistoryModal';
import type { InvoiceRecord } from '../../../../../types/invoice';

export default function PartialFeeReportsPage() {
  const router = useRouter();
  const schoolCode = (router.query.schoolCode as string) || 'demo';
  const dispatch = useAppDispatch();

  const { invoices, filters, selectedInvoiceForHistory, isHistoryModalOpen } =
    useAppSelector((state) => state.feeReport);

  useEffect(() => {
    dispatch(setActiveTab('partial'));
  }, [dispatch]);

  // BR04: Filter partially paid invoices
  const filteredPartialInvoices = useMemo(() => {
    return filterPartialInvoices(invoices, filters);
  }, [invoices, filters]);

  const handleOpenHistory = (invoice: InvoiceRecord) => {
    dispatch(openPaymentHistoryModal(invoice));
  };

  const handleCloseHistory = () => {
    dispatch(closePaymentHistoryModal());
  };

  const handleExportExcel = () => {
    alert(
      `Đang xuất danh sách ${filteredPartialInvoices.length} hóa đơn thanh toán một phần ra tệp Excel (.xlsx)...`
    );
  };

  return (
    <PortalLayout>
      <Head>
        <title>Hóa Đơn Thanh Toán Một Phần | Báo Cáo Học Phí</title>
      </Head>

      <div className="space-y-6">
        {/* 4-Tab Navigation (BR01) */}
        <FeeReportTabsNav schoolCode={schoolCode} />

        {/* Page Header */}
        <PageHeader
          title="Hóa Đơn Thanh Toán Một Phần"
          description="Theo dõi hóa đơn đang thu nhiều đợt, hiển thị số tiền còn thiếu (BR04) và lịch sử thanh toán chi tiết (BR06)"
        />

        {/* Filter Toolbar */}
        <FeeReportToolbar
          currentTab="partial"
          recordCount={filteredPartialInvoices.length}
          onExportExcel={handleExportExcel}
        />

        {/* Partial Invoices Table (BR04, BR06) */}
        <PartialInvoicesTable
          invoices={filteredPartialInvoices}
          schoolCode={schoolCode}
          onViewHistory={handleOpenHistory}
        />

        {/* Payment History Modal (BR06) */}
        <PaymentHistoryModal
          isOpen={isHistoryModalOpen}
          invoice={selectedInvoiceForHistory}
          onClose={handleCloseHistory}
        />
      </div>
    </PortalLayout>
  );
}
