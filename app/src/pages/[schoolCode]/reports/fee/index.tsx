import React, { useMemo, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { PortalLayout } from '../../../../components/layout/PortalLayout';
import { PageHeader } from '../../../../components/ds';
import { useAppDispatch, useAppSelector } from '../../../../store';
import { setActiveTab } from '../../../../store/slices/feeReportSlice';
import { filterPaidInvoices } from '../../../../utils/feeReportValidation';
import { FeeReportTabsNav } from '../../../../modules/finance/reports/FeeReportTabsNav';
import { FeeReportToolbar } from '../../../../modules/finance/reports/FeeReportToolbar';
import { PaidInvoicesTable } from '../../../../modules/finance/reports/PaidInvoicesTable';

export default function PaidFeeReportsPage() {
  const router = useRouter();
  const schoolCode = (router.query.schoolCode as string) || 'demo';
  const dispatch = useAppDispatch();

  const { invoices, filters } = useAppSelector((state) => state.feeReport);

  useEffect(() => {
    dispatch(setActiveTab('paid'));
  }, [dispatch]);

  // BR03: Filter paid invoices by payment confirmation date
  const filteredPaidInvoices = useMemo(() => {
    return filterPaidInvoices(invoices, filters);
  }, [invoices, filters]);

  const handleExportExcel = () => {
    alert(
      `Đang xuất danh sách ${filteredPaidInvoices.length} hóa đơn đã thanh toán ra tệp Excel (.xlsx)...`
    );
  };

  return (
    <PortalLayout>
      <Head>
        <title>Hóa Đơn Đã Thanh Toán | Báo Cáo Học Phí</title>
      </Head>

      <div className="space-y-6">
        {/* Page Header */}
        <PageHeader
          title="Báo Cáo Học Phí"
          description="Danh sách hóa đơn đã thu hoàn tất, lọc theo ngày xác nhận thanh toán và phương thức giao dịch"
        />

        {/* Master Table Card: CountedTabs + FilterBar + DataTable */}
        <div className="ecomd-table-card">
          <FeeReportTabsNav schoolCode={schoolCode} />
          <FeeReportToolbar
            currentTab="paid"
            recordCount={filteredPaidInvoices.length}
            onExportExcel={handleExportExcel}
          />
          <PaidInvoicesTable
            invoices={filteredPaidInvoices}
            schoolCode={schoolCode}
          />
        </div>
      </div>
    </PortalLayout>
  );
}
