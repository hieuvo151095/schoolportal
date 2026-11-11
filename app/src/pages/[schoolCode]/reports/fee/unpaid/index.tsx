import React, { useMemo, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { PortalLayout } from '../../../../../components/layout/PortalLayout';
import { PageHeader } from '../../../../../components/ds';
import { useAppDispatch, useAppSelector } from '../../../../../store';
import { setActiveTab } from '../../../../../store/slices/feeReportSlice';
import { filterUnpaidInvoices } from '../../../../../utils/feeReportValidation';
import { FeeReportTabsNav } from '../../../../../modules/finance/reports/FeeReportTabsNav';
import { FeeReportToolbar } from '../../../../../modules/finance/reports/FeeReportToolbar';
import { UnpaidInvoicesTable } from '../../../../../modules/finance/reports/UnpaidInvoicesTable';

export default function UnpaidFeeReportsPage() {
  const router = useRouter();
  const schoolCode = (router.query.schoolCode as string) || 'demo';
  const dispatch = useAppDispatch();

  const { invoices, filters } = useAppSelector((state) => state.feeReport);

  useEffect(() => {
    dispatch(setActiveTab('unpaid'));
  }, [dispatch]);

  // BR05: Filter unpaid invoices with separate status and overdue filters
  const filteredUnpaidInvoices = useMemo(() => {
    return filterUnpaidInvoices(invoices, filters);
  }, [invoices, filters]);

  const handleExportExcel = () => {
    alert(
      `Đang xuất danh sách ${filteredUnpaidInvoices.length} hóa đơn chưa thanh toán ra tệp Excel (.xlsx)...`
    );
  };

  return (
    <PortalLayout>
      <Head>
        <title>Hóa Đơn Chưa Thanh Toán | Báo Cáo Học Phí</title>
      </Head>

      <div className="space-y-6">
        {/* Page Header */}
        <PageHeader
          title="Báo Cáo Học Phí"
          description="Đôn đốc thu học phí, lọc riêng trạng thái Đã tạo/Đã gửi và hóa đơn quá hạn nộp"
        />

        {/* Master Table Card: CountedTabs + FilterBar + DataTable */}
        <div className="ecomd-table-card">
          <FeeReportTabsNav schoolCode={schoolCode} />
          <FeeReportToolbar
            currentTab="unpaid"
            recordCount={filteredUnpaidInvoices.length}
            onExportExcel={handleExportExcel}
          />
          <UnpaidInvoicesTable
            invoices={filteredUnpaidInvoices}
            schoolCode={schoolCode}
          />
        </div>
      </div>
    </PortalLayout>
  );
}
