/**
 * Finance Expenses & Disbursements Detail Page
 * Route: /[schoolCode]/school/expenses/[expenseId]
 * Design System: [DS] ECO ME DASHBOARD v1.1.0
 */

import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import PortalLayout from '../../../../components/layout/PortalLayout';
import { useAppDispatch, useAppSelector } from '../../../../store';
import {
  confirmDisbursement,
  approveVoucher,
  cancelVoucher,
  openCancelModal,
  closeCancelModal,
} from '../../../../store/slices/expenseSlice';
import { ExpenseDetailView } from '../../../../modules/finance/expenses/ExpenseDetailView';
import { CancelVoucherModal } from '../../../../modules/finance/expenses/CancelVoucherModal';
import { Icon } from '@/components/ds';

export default function ExpenseDetailPage() {
  const router = useRouter();
  const schoolCode = (router.query.schoolCode as string) || 'demo';
  const rawExpenseId = router.query.expenseId as string;
  const pathParts = router.asPath.split('?')[0].split('/');
  const fallbackId = pathParts[pathParts.length - 1];
  const expenseId = rawExpenseId || (fallbackId && fallbackId !== '[expenseId]' ? fallbackId : '');

  const dispatch = useAppDispatch();

  const { vouchers, isCancelModalOpen, targetVoucherIdForCancel } = useAppSelector(
    (state) => state.expense
  );

  const voucher = vouchers.find(
    (v) => v.id === expenseId || v.voucherCode === expenseId
  ) || (typeof window === 'undefined' ? vouchers[0] : undefined);

  const targetVoucherForCancel = targetVoucherIdForCancel
    ? vouchers.find((v) => v.id === targetVoucherIdForCancel)
    : null;

  return (
    <PortalLayout>
      <Head>
        <title>
          {voucher ? `${voucher.voucherCode} — Finviet School Portal` : 'Chi Tiết Phiếu Chi'}
        </title>
      </Head>

      {!voucher ? (
        <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center space-y-4 max-w-lg mx-auto mt-12">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto text-2xl">
            <Icon name="alert-triangle" size={32} />
          </div>
          <h2 className="text-xl font-bold text-slate-900 m-0">Không tìm thấy phiếu chi</h2>
          <p className="text-sm text-slate-500 m-0">
            Mã phiếu chi <span className="font-mono font-medium text-slate-700">{expenseId}</span> không tồn tại hoặc đã bị xóa khỏi hệ thống.
          </p>
          <Link
            href={`/${schoolCode}/school/expenses`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0070CE] text-white text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Icon name="arrow-left" size={14} />
            <span>Quay về danh sách</span>
          </Link>
        </div>
      ) : (
        <>
          <ExpenseDetailView
            voucher={voucher}
            schoolCode={schoolCode}
            onConfirmDisbursement={(id) => dispatch(confirmDisbursement({ voucherId: id }))}
            onApproveVoucher={(id) => dispatch(approveVoucher({ voucherId: id }))}
            onOpenCancelModal={(id) => dispatch(openCancelModal(id))}
          />

          <CancelVoucherModal
            isOpen={isCancelModalOpen}
            voucherId={targetVoucherIdForCancel}
            voucherTitle={targetVoucherForCancel?.title}
            onClose={() => dispatch(closeCancelModal())}
            onConfirmCancel={(voucherId, reason) =>
              dispatch(cancelVoucher({ voucherId, reason }))
            }
          />
        </>
      )}
    </PortalLayout>
  );
}
