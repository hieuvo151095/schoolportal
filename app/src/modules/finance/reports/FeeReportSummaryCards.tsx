/**
 * Fee Report Summary KPI Cards
 * Design System: [DS] ECO ME DASHBOARD v1.1.0 (StatCard.Group, StatCard)
 */

import React from 'react';
import type { FeeReportSummaryKPIs } from '../../../types/feeReport';
import { formatFeeReportCurrency } from '../../../utils/feeReportValidation';
import { StatCard } from '../../../components/ds';

interface FeeReportSummaryCardsProps {
  kpis: FeeReportSummaryKPIs;
}

export const FeeReportSummaryCards: React.FC<FeeReportSummaryCardsProps> = ({ kpis }) => {
  return (
    <div
      className="ecomd-stat-group"
      style={{ '--ecomd-cols': 4 } as React.CSSProperties}
    >
      <StatCard
        label="Tổng Số Hóa Đơn"
        value={`${kpis.totalInvoices} HĐ`}
        tone="info"
        icon="receipt"
      />
      <StatCard
        label="Tổng Tiền Phát Hành"
        value={formatFeeReportCurrency(kpis.totalAmount)}
        tone="neutral"
        icon="receipt"
      />
      <StatCard
        label="Đã Thực Thu"
        value={formatFeeReportCurrency(kpis.totalCollected)}
        tone="success"
        icon="check"
      />
      <StatCard
        label="Còn Phải Thu"
        value={formatFeeReportCurrency(kpis.totalRemaining)}
        tone="warning"
        icon="clock"
      />
    </div>
  );
};
