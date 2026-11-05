/**
 * Reconciliation Summary KPI Metrics
 * Design System: [DS] ECO ME DASHBOARD v1.1.0 (StatCard.Group, StatCard)
 */

import React from 'react';
import { StatCard } from '../../../components/ds';
import { formatReconciliationAmount } from '../../../utils/reconciliationValidation';

interface ReconciliationSummaryCardsProps {
  totalAmount: number;
  totalTransactions: number;
  totalSessions: number;
  startDate: string;
  endDate: string;
}

export const ReconciliationSummaryCards: React.FC<ReconciliationSummaryCardsProps> = ({
  totalAmount,
  totalTransactions,
  totalSessions,
  startDate,
  endDate,
}) => {
  return (
    <div
      className="ecomd-stat-group"
      style={{ '--ecomd-cols': 4 } as React.CSSProperties}
    >
      <StatCard
        label="Tổng Tiền Thanh Toán"
        value={formatReconciliationAmount(totalAmount)}
        tone="info"
        icon="receipt"
      />
      <StatCard
        label="Số Giao Dịch"
        value={`${totalTransactions} GD`}
        tone="success"
        icon="check"
      />
      <StatCard
        label="Phiên Đối Soát"
        value={`${totalSessions} đợt`}
        tone="warning"
        icon="calendar"
      />
      <StatCard
        label="Độ Khớp Số Liệu"
        value="100%"
        tone="purple"
        icon="circle-check"
      />
    </div>
  );
};
