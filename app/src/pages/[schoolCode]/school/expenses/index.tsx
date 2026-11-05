/**
 * Finance Expenses & Disbursements Overview Page
 * Route: /[schoolCode]/school/expenses
 * Governance: Marcus Fleet V34 / Constitution V1.0.0
 * Design System: [DS] ECO ME DASHBOARD v1.1.0
 * References: docs_legacy/operating-portal/tai-chinh/khoan-chi.md (BR01-BR10)
 */

import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import PortalLayout from '../../../../components/layout/PortalLayout';
import { PageHeader, Button } from '../../../../components/ds';
import { useAppDispatch, useAppSelector } from '../../../../store';
import {
  setSelectedMonth,
  setSearchKeyword,
  setSelectedType,
  setSelectedStatus,
  setCategoryModalOpen,
  openCancelModal,
  closeCancelModal,
  confirmDisbursement,
  cancelVoucher,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../../../../store/slices/expenseSlice';
import { filterVouchers } from '../../../../utils/expenseValidation';
import { ExpenseSummaryCards } from '../../../../modules/finance/expenses/ExpenseSummaryCards';
import { ExpenseToolbar } from '../../../../modules/finance/expenses/ExpenseToolbar';
import { ExpenseOverviewTable } from '../../../../modules/finance/expenses/ExpenseOverviewTable';
import { ExpenseCategoryModal } from '../../../../modules/finance/expenses/ExpenseCategoryModal';
import { CancelVoucherModal } from '../../../../modules/finance/expenses/CancelVoucherModal';

export default function ExpensesOverviewPage() {
  const router = useRouter();
  const schoolCode = (router.query.schoolCode as string) || 'demo';
  const dispatch = useAppDispatch();

  const {
    vouchers,
    categories,
    selectedMonth,
    searchKeyword,
    selectedType,
    selectedStatus,
    isCategoryModalOpen,
    isCancelModalOpen,
    targetVoucherIdForCancel,
  } = useAppSelector((state) => state.expense);

  // Filter vouchers for active criteria (BR07: includes mandatory single-month)
  const filteredVouchers = filterVouchers(vouchers, {
    selectedMonth,
    searchKeyword,
    voucherType: selectedType,
    status: selectedStatus,
  });

  // Total vouchers in the month (unfiltered by status/type/search) for export button disable guard (BR09)
  const monthTotalVouchers = vouchers.filter((v) => v.createdDate.startsWith(selectedMonth));

  const targetVoucherForCancel = targetVoucherIdForCancel
    ? vouchers.find((v) => v.id === targetVoucherIdForCancel)
    : null;

  return (
    <PortalLayout>
      <Head>
        <title>Quản Lý Khoản Chi — Finviet School Portal</title>
        <meta
          name="description"
          content="Quản lý phiếu chi, hoàn tiền học phí cho phụ huynh, chi phụ cấp nhân viên và giải ngân chi phí nội bộ."
        />
      </Head>

      <div className="space-y-5">
        {/* Page Header */}
        <PageHeader
          title="Quản Lý Khoản Chi"
          description="Theo dõi phiếu chi, hoàn tiền học phí cho phụ huynh và kiểm soát quy trình giải ngân 3 bước."
          actions={
            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                icon="folder"
                onClick={() => dispatch(setCategoryModalOpen(true))}
              >
                Danh mục chi
              </Button>
              <Button
                variant="primary"
                icon="plus"
                onClick={() => router.push(`/${schoolCode}/school/expenses/create`)}
              >
                Thêm phiếu chi
              </Button>
            </div>
          }
        />

        {/* Summary KPI Cards */}
        <ExpenseSummaryCards
          vouchers={monthTotalVouchers}
          selectedMonth={selectedMonth}
        />

        {/* Unified Table Card: Filter Toolbar + Data Table + Footer */}
        <div className="ecomd-table-card">
          <ExpenseToolbar
            schoolCode={schoolCode}
            selectedMonth={selectedMonth}
            onMonthChange={(m) => dispatch(setSelectedMonth(m))}
            searchKeyword={searchKeyword}
            onSearchChange={(k) => dispatch(setSearchKeyword(k))}
            selectedType={selectedType}
            onTypeChange={(t) => dispatch(setSelectedType(t))}
            selectedStatus={selectedStatus}
            onStatusChange={(s) => dispatch(setSelectedStatus(s))}
            onOpenCategoryModal={() => dispatch(setCategoryModalOpen(true))}
            totalVouchersInMonth={monthTotalVouchers.length}
          />

          <ExpenseOverviewTable
            vouchers={filteredVouchers}
            schoolCode={schoolCode}
            onConfirmDisbursement={(id) => dispatch(confirmDisbursement({ voucherId: id }))}
            onOpenCancelModal={(id) => dispatch(openCancelModal(id))}
          />
        </div>

        {/* Category Modal */}
        <ExpenseCategoryModal
          isOpen={isCategoryModalOpen}
          categories={categories}
          onClose={() => dispatch(setCategoryModalOpen(false))}
          onCreateCategory={(name, desc) => dispatch(createCategory({ name, description: desc }))}
          onUpdateCategory={(id, name, desc) => dispatch(updateCategory({ id, name, description: desc }))}
          onDeleteCategory={(id) => dispatch(deleteCategory(id))}
        />

        {/* Cancel Voucher Modal */}
        <CancelVoucherModal
          isOpen={isCancelModalOpen}
          voucherId={targetVoucherIdForCancel}
          voucherTitle={targetVoucherForCancel?.title}
          onClose={() => dispatch(closeCancelModal())}
          onConfirmCancel={(voucherId, reason) =>
            dispatch(cancelVoucher({ voucherId, reason }))
          }
        />
      </div>
    </PortalLayout>
  );
}
