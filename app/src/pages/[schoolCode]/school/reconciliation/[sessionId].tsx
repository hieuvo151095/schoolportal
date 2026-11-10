import React, { useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { PortalLayout } from '../../../../components/layout/PortalLayout';
import { useAppDispatch, useAppSelector } from '../../../../store';
import {
  setSearchKeyword,
  setSelectedChannel,
  toggleExpandTransaction,
} from '../../../../store/slices/reconciliationSlice';
import {
  filterTransactions,
  formatReconciliationAmount,
} from '../../../../utils/reconciliationValidation';
import { SessionDetailHeader } from '../../../../modules/finance/reconciliation/SessionDetailHeader';
import { SessionDetailToolbar } from '../../../../modules/finance/reconciliation/SessionDetailToolbar';
import { TransactionRosterTable } from '../../../../modules/finance/reconciliation/TransactionRosterTable';
import { Icon } from '@/components/ds';

export default function ReconciliationSessionDetailPage() {
  const router = useRouter();
  const schoolCode = (router.query.schoolCode as string) || 'demo';
  const sessionId = router.query.sessionId as string;
  const dispatch = useAppDispatch();

  const { sessions, searchKeyword, selectedChannel, expandedTransactionIds } =
    useAppSelector((state) => state.reconciliation);

  // Find the target session
  const session = useMemo(() => {
    if (!sessionId) return null;
    return (
      sessions.find(
        (s) => s.id === sessionId || s.sessionCode.toLowerCase() === sessionId.toLowerCase()
      ) || null
    );
  }, [sessions, sessionId]);

  // Filter transactions inside the session (BR03, BR06)
  const filteredTransactions = useMemo(() => {
    if (!session) return [];
    return filterTransactions(session.transactions, searchKeyword, selectedChannel);
  }, [session, searchKeyword, selectedChannel]);

  const handleSearchChange = (keyword: string) => {
    dispatch(setSearchKeyword(keyword));
  };

  const handleChannelChange = (channel: any) => {
    dispatch(setSelectedChannel(channel));
  };

  const handleToggleExpand = (txId: string) => {
    dispatch(toggleExpandTransaction(txId));
  };

  const handleExportSessionTransactions = () => {
    if (!session || filteredTransactions.length === 0) return;
    alert(
      `Đang xuất chi tiết ${filteredTransactions.length} giao dịch của phiên đối soát ${session.sessionCode} ra file Excel...`
    );
  };

  if (!session) {
    return (
      <PortalLayout>
        <div className="p-8 max-w-4xl mx-auto text-center">
          <div className="bg-white rounded-2xl border border-slate-200 p-12 shadow-xs">
            <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="calendar" size={32} />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2 font-heading">
              Không Tìm Thấy Phiên Đối Soát
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              Mã phiên đối soát &quot;{sessionId}&quot; không tồn tại hoặc đã bị xóa khỏi hệ thống đồng bộ.
            </p>
            <Link
              href={`/${schoolCode}/school/reconciliation`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#0070CE] hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              <Icon name="arrow-left" size={14} />
              <span>Quay lại danh sách phiên</span>
            </Link>
          </div>
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout>
      <Head>
        <title>Chi Tiết Phiên Đối Soát {session.sessionCode} | FinViet School Portal</title>
      </Head>

      <div className="w-full">
        {/* Session Detail Header & Summary Strip */}
        <SessionDetailHeader session={session} schoolCode={schoolCode} />

        {/* Toolbar: Search by Student & Channel Filter */}
        <SessionDetailToolbar
          searchKeyword={searchKeyword}
          onSearchChange={handleSearchChange}
          selectedChannel={selectedChannel}
          onChannelChange={handleChannelChange}
          filteredCount={filteredTransactions.length}
          onExport={handleExportSessionTransactions}
        />

        {/* Transactions Table with Inline Expandable Invoice Accordion */}
        <TransactionRosterTable
          transactions={filteredTransactions}
          schoolCode={schoolCode}
          expandedTransactionIds={expandedTransactionIds}
          onToggleExpand={handleToggleExpand}
        />
      </div>
    </PortalLayout>
  );
}
