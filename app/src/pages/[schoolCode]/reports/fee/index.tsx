import React, { useMemo, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { PortalLayout } from '../../../../components/layout/PortalLayout';
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

      {/* 4-Tab Navigation (BR01) */}
      <FeeReportTabsNav schoolCode={schoolCode} />

      <div className="w-full mt-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">
            Hóa Đơn Đã Thanh Toán
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Danh sách hóa đơn đã thu hoàn tất, lọc theo ngày xác nhận thanh toán và phương thức giao dịch (BR03)
          </p>
        </div>

        {/* Filter Toolbar with Paid-specific Payment Method Filter */}
        <FeeReportToolbar
          currentTab="paid"
          recordCount={filteredPaidInvoices.length}
          onExportExcel={handleExportExcel}
        />

        {/* Paid Invoices Table */}
        <PaidInvoicesTable
          invoices={filteredPaidInvoices}
          schoolCode={schoolCode}
        />
      </div>
    </PortalLayout>
  );
}
