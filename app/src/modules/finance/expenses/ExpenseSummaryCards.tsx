/**
 * Expense Summary KPI Cards
 * Design System: [DS] ECO ME DASHBOARD v1.1.0 (StatCard.Group, StatCard)
 */

import React from 'react';
import { StatCard } from '../../../components/ds';
import { ExpenseVoucher } from '../../../types/expense';
import { formatExpenseAmount } from '../../../utils/expenseValidation';

interface ExpenseSummaryCardsProps {
  vouchers: ExpenseVoucher[];
  selectedMonth: string;
}

export const ExpenseSummaryCards: React.FC<ExpenseSummaryCardsProps> = ({
  vouchers,
  selectedMonth,
}) => {
  const disbursedVouchers = vouchers.filter((v) => v.status === 'da_chi');
  const approvedVouchers = vouchers.filter((v) => v.status === 'da_duyet');
  const draftVouchers = vouchers.filter((v) => v.status === 'da_tao');
  const cancelledVouchers = vouchers.filter((v) => v.status === 'da_huy');

  const totalDisbursedAmount = disbursedVouchers.reduce((sum, v) => sum + v.totalAmount, 0);
  const totalApprovedAmount = approvedVouchers.reduce((sum, v) => sum + v.totalAmount, 0);
  const totalMonthAmount = vouchers
    .filter((v) => v.status !== 'da_huy')
    .reduce((sum, v) => sum + v.totalAmount, 0);

  // Format month display (e.g. 2025-12 -> Tháng 12/2025)
  const monthParts = selectedMonth.split('-');
  const monthLabel = monthParts.length === 2 ? `Tháng ${monthParts[1]}/${monthParts[0]}` : selectedMonth;

  return (
    <div
      className="ecomd-stat-group"
      style={{ '--ecomd-cols': 4 } as React.CSSProperties}
    >
      <StatCard
        label={`Tổng chi (${monthLabel})`}
        value={formatExpenseAmount(totalMonthAmount)}
        tone="info"
        icon="receipt"
      />
      <StatCard
        label="Đã giải ngân"
        value={formatExpenseAmount(totalDisbursedAmount)}
        tone="success"
        icon="check"
      />
      <StatCard
        label="Chờ giải ngân"
        value={formatExpenseAmount(totalApprovedAmount)}
        tone="warning"
        icon="clock"
      />
      <StatCard
        label="Nháp & Hủy bỏ"
        value={`${draftVouchers.length} nháp / ${cancelledVouchers.length} hủy`}
        tone="neutral"
        icon="folder"
      />
    </div>
  );
};
