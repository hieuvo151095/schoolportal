/**
 * Finance Expenses & Disbursements Creation Page
 * Route: /[schoolCode]/school/expenses/create
 * Governance: Marcus Fleet V34 / Constitution V1.0.0
 * References: docs_legacy/operating-portal/tai-chinh/khoan-chi.md (BR01, BR02, BR04, BR06)
 */

import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import PortalLayout from '../../../../../components/layout/PortalLayout';
import { useAppDispatch, useAppSelector } from '../../../../../store';
import { createVoucher } from '../../../../../store/slices/expenseSlice';
import { MOCK_BENEFICIARIES } from '../../../../../services/mockExpenseData';
import { CreateExpenseView } from '../../../../../modules/finance/expenses/CreateExpenseView';
import { CreateVoucherFormData } from '../../../../../types/expense';

export default function CreateExpensePage() {
  const router = useRouter();
  const schoolCode = (router.query.schoolCode as string) || 'demo';
  const dispatch = useAppDispatch();

  const { categories } = useAppSelector((state) => state.expense);

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
  };

  return (
    <PortalLayout>
      <Head>
        <title>Tạo Phiếu Chi Mới — Finviet School Portal</title>
        <meta
          name="description"
          content="Lập phiếu chi mới cho học sinh (hoàn tiền học phí) hoặc nhân viên trường học."
        />
      </Head>

      <CreateExpenseView
        categories={categories}
        beneficiaries={MOCK_BENEFICIARIES}
        schoolCode={schoolCode}
        onSubmit={handleCreateVoucher}
      />
    </PortalLayout>
  );
}
