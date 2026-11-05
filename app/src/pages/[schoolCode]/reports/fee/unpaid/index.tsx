import React, { useMemo, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { PortalLayout } from '../../../../../components/layout/PortalLayout';
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

      {/* 4-Tab Navigation (BR01) */}
      <FeeReportTabsNav schoolCode={schoolCode} />

      <div className="w-full mt-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">
            Hóa Đơn Chưa Thanh Toán
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Đôn đốc thu học phí, lọc riêng trạng thái Đã tạo/Đã gửi và hóa đơn quá hạn nộp (BR05)
          </p>
        </div>

        {/* Filter Toolbar with Unpaid-specific Status Dropdown & Overdue Checkbox (BR05) */}
        <FeeReportToolbar
          currentTab="unpaid"
          recordCount={filteredUnpaidInvoices.length}
          onExportExcel={handleExportExcel}
        />

        {/* Unpaid Invoices Table (BR05) */}
        <UnpaidInvoicesTable
          invoices={filteredUnpaidInvoices}
          schoolCode={schoolCode}
        />
      </div>
    </PortalLayout>
  );
}
