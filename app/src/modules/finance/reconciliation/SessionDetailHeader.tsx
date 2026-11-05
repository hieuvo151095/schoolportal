import React from 'react';
import Link from 'next/link';
import { ReconciliationSession } from '../../../types/reconciliation';
import { formatReconciliationAmount } from '../../../utils/reconciliationValidation';
import { Icon, Tag, StatusTag, StatCard } from '../../../components/ds';

interface SessionDetailHeaderProps {
  session: ReconciliationSession;
  schoolCode: string;
}

export const SessionDetailHeader: React.FC<SessionDetailHeaderProps> = ({
  session,
  schoolCode,
}) => {
  return (
    <div className="mb-6">
      {/* Back Button */}
      <div className="mb-3">
        <Link
          href={`/${schoolCode}/school/reconciliation`}
          className="body-sm-bold text-[var(--eco-blue-strong)] hover:underline inline-flex items-center gap-1.5"
        >
          <Icon name="arrow-left" size={14} />
          <span>Quay lại danh sách phiên đối soát</span>
        </Link>
      </div>

      {/* Title & Metadata Card */}
      <div className="ecomd-table-card p-5 mb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="h4 m-0 text-[var(--text-heading)]">
                Phiên Đối Soát: <span className="text-[var(--eco-blue-strong)] font-mono">{session.sessionCode}</span>
              </h1>
              <StatusTag tone="success" label="Đã đối soát hoàn tất" icon={true} />
            </div>
            <div className="body-xs text-[var(--text-subtle)] mt-2 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Icon name="calendar" size={12} color="var(--text-subtle)" />
                <span>Ngày tạo phiên: <strong className="text-[var(--text-body)]">{session.sessionDate}</strong></span>
              </div>
              <span>•</span>
              <div>
                Khoảng thời gian giao dịch thực tế: <strong className="text-[var(--text-body)]">{session.transactionPeriod}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Stat Strip */}
        <div
          className="ecomd-stat-group pt-4"
          style={{ '--ecomd-cols': 4 } as React.CSSProperties}
        >
          <StatCard
            label="Tổng Tiền Phiên"
            value={formatReconciliationAmount(session.totalAmount)}
            tone="info"
            icon="receipt"
          />
          <StatCard
            label="Số Giao Dịch"
            value={`${session.transactionCount} GD`}
            tone="success"
            icon="check"
          />
          <StatCard
            label="Số Hóa Đơn Liên Kết"
            value={`${session.invoiceCount} hóa đơn`}
            tone="warning"
            icon="file-lines"
          />
          <StatCard
            label="Cổng Thanh Toán"
            value="Ví FinViet & QR"
            tone="neutral"
            icon="coins"
          />
        </div>
      </div>
    </div>
  );
};

export default SessionDetailHeader;
