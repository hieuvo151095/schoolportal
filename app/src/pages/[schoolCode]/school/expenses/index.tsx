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
  approveVoucher,
  createVoucher,
  cancelVoucher,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../../../../store/slices/expenseSlice';
import { addToast } from '../../../../store/slices/toastSlice';
import { filterVouchers } from '../../../../utils/expenseValidation';
import { ExpenseSummaryCards } from '../../../../modules/finance/expenses/ExpenseSummaryCards';
import { ExpenseToolbar } from '../../../../modules/finance/expenses/ExpenseToolbar';
import { ExpenseOverviewTable } from '../../../../modules/finance/expenses/ExpenseOverviewTable';
import { ExpenseCategoryModal } from '../../../../modules/finance/expenses/ExpenseCategoryModal';
import { CancelVoucherModal } from '../../../../modules/finance/expenses/CancelVoucherModal';
import { CreateExpenseView } from '../../../../modules/finance/expenses/CreateExpenseView';
import { ExpenseDetailSlideOver } from '../../../../modules/finance/expenses/ExpenseDetailSlideOver';
import { MOCK_BENEFICIARIES } from '../../../../services/mockExpenseData';
import { CreateVoucherFormData, ExpenseVoucher } from '../../../../types/expense';

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

  const [isCreateSlideOverOpen, setIsCreateSlideOverOpen] = React.useState(false);
  const [selectedVoucherForDetail, setSelectedVoucherForDetail] = React.useState<ExpenseVoucher | null>(null);

  React.useEffect(() => {
    if (router.query.create === 'true') {
      setIsCreateSlideOverOpen(true);
    }
    if (router.query.voucherId && typeof router.query.voucherId === 'string') {
      const found = vouchers.find((v) => v.id === router.query.voucherId);
      if (found) {
        setSelectedVoucherForDetail(found);
      }
    }
  }, [router.query.create, router.query.voucherId, vouchers]);

  const handleCreateVoucher = (
    formData: CreateVoucherFormData,
    immediateApprove: boolean
  ) => {
    dispatch(
      createVoucher({
        data: formData,
        immediateApprove,
        staffName: 'Kế toán Trần Thị Mai',
      })
    );
    dispatch(
      addToast({
        type: 'success',
        message: `Đã tạo phiếu chi "${formData.title}" thành công!`,
      })
    );
    setIsCreateSlideOverOpen(false);
  };

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
            onOpenCreate={() => setIsCreateSlideOverOpen(true)}
            totalVouchersInMonth={monthTotalVouchers.length}
          />

          <ExpenseOverviewTable
            vouchers={filteredVouchers}
            schoolCode={schoolCode}
            onConfirmDisbursement={(id) => dispatch(confirmDisbursement({ voucherId: id }))}
            onOpenCancelModal={(id) => dispatch(openCancelModal(id))}
            onViewDetail={(v) => setSelectedVoucherForDetail(v)}
          />
        </div>

        {/* Create Expense SlideOver (Right-Sheet) */}
        <CreateExpenseView
          isOpen={isCreateSlideOverOpen}
          onClose={() => setIsCreateSlideOverOpen(false)}
          categories={categories}
          beneficiaries={MOCK_BENEFICIARIES}
          schoolCode={schoolCode}
          onSubmit={handleCreateVoucher}
        />

        {/* View Expense Detail SlideOver (Right-Sheet) */}
        <ExpenseDetailSlideOver
          isOpen={!!selectedVoucherForDetail}
          voucher={selectedVoucherForDetail}
          schoolCode={schoolCode}
          onClose={() => setSelectedVoucherForDetail(null)}
          onConfirmDisbursement={(id) => dispatch(confirmDisbursement({ voucherId: id }))}
          onApproveVoucher={(id) =>
            dispatch(approveVoucher({ voucherId: id, staffName: 'Kế toán Trần Thị Mai' }))
          }
          onOpenCancelModal={(id) => dispatch(openCancelModal(id))}
        />

        {/* Category Modal (SlideOver) */}
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
