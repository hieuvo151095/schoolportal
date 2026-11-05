import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatReconciliationAmount,
  isDateRangeValid,
  filterSessions,
  filterTransactions,
  calculateSessionAggregates,
  calculateTransactionAggregates,
} from '../../src/utils/reconciliationValidation.ts';
import reconciliationReducer, {
  setDateRange,
  setSelectedSessionId,
  setSearchKeyword,
  setSelectedChannel,
  toggleExpandTransaction,
  resetDetailFilters,
} from '../../src/store/slices/reconciliationSlice.ts';
import { INITIAL_RECONCILIATION_SESSIONS } from '../../src/services/mockReconciliationData.ts';

test('Finance Reconciliation & Gateway Settlement (Đối Soát) Business Rules & Engine', async (t) => {
  await t.test('BR08: formatReconciliationAmount formats numbers with dot separators and Đ suffix', () => {
    assert.equal(formatReconciliationAmount(6000), '6.000 Đ');
    assert.equal(formatReconciliationAmount(15800000), '15.800.000 Đ');
    assert.equal(formatReconciliationAmount(0), '0 Đ');
    assert.equal(formatReconciliationAmount(-5000), '0 Đ'); // negative guard
    assert.equal(formatReconciliationAmount(6000, false), '6.000');
  });

  await t.test('BR05: isDateRangeValid checks date boundaries and disallows future dates', () => {
    const today = '2026-09-12';

    // Valid intervals
    assert.equal(isDateRangeValid('2026-08-30', '2026-09-11', today), true);
    assert.equal(isDateRangeValid('2026-09-12', '2026-09-12', today), true);

    // Inverted range (start > end)
    assert.equal(isDateRangeValid('2026-09-15', '2026-09-10', today), false);

    // Future dates blocked (after maxDate)
    assert.equal(isDateRangeValid('2026-09-10', '2026-09-20', today), false);
    assert.equal(isDateRangeValid('2026-09-20', '2026-09-25', today), false);

    // Empty parameters
    assert.equal(isDateRangeValid('', '2026-09-11'), false);
    assert.equal(isDateRangeValid('2026-09-01', ''), false);
  });

  await t.test('BR01: filterSessions filters by sync date ("Ngày tạo phiên")', () => {
    const sessions = [...INITIAL_RECONCILIATION_SESSIONS];

    // Default 12 days range (2026-08-30 to 2026-09-11) contains all 4 sessions
    const allRecent = filterSessions(sessions, '2026-08-30', '2026-09-11');
    assert.equal(allRecent.length, 4);

    // Filter single day 2026-09-10 (Session DS-20260910-01 created at 2026-09-10 01:00)
    const singleSession = filterSessions(sessions, '2026-09-10', '2026-09-10');
    assert.equal(singleSession.length, 1);
    assert.equal(singleSession[0].sessionCode, 'DS-20260910-01');
    assert.equal(singleSession[0].transactionPeriod, '09/09/2026 14:18 - 14:21');

    // Filter range with zero sessions
    const emptySessions = filterSessions(sessions, '2026-07-01', '2026-07-15');
    assert.equal(emptySessions.length, 0);
  });

  await t.test('BR03 & BR06: filterTransactions filters by channel and search query', () => {
    const session = INITIAL_RECONCILIATION_SESSIONS[0]; // DS-20260910-01 (3 transactions)
    const txs = session.transactions;

    // Search by student name
    const matchName = filterTransactions(txs, 'Cao Ngọc Minh', 'all');
    assert.equal(matchName.length, 3);

    // Search by student ID
    const matchId = filterTransactions(txs, 'HS-0012', 'all');
    assert.equal(matchId.length, 3);

    // Search by transaction code
    const matchTx = filterTransactions(txs, 'TX-20260909-002', 'all');
    assert.equal(matchTx.length, 1);
    assert.equal(matchTx[0].amount, 2000);
    assert.equal(matchTx[0].channel, 'finviet');

    // Filter by channel: Ví FinViet (1 tx: 2.000đ)
    const finvietTxs = filterTransactions(txs, '', 'finviet');
    assert.equal(finvietTxs.length, 1);
    assert.equal(finvietTxs[0].transactionCode, 'TX-20260909-002');

    // Filter by channel: QR Ecopay (2 txs: 1.000đ and 3.000đ)
    const ecopayTxs = filterTransactions(txs, '', 'ecopay');
    assert.equal(ecopayTxs.length, 2);
    assert.equal(ecopayTxs[0].amount + ecopayTxs[1].amount, 4000);

    // Search with non-matching query
    const noMatch = filterTransactions(txs, 'NonExistentStudent', 'all');
    assert.equal(noMatch.length, 0);
  });

  await t.test('BR04: Real-world cumulative partial transactions reconcile with invoice total', () => {
    // Verified real-world case from legacy documentation:
    // 3 separate transactions of 1.000, 2.000, and 3.000 VND
    // for student Cao Ngọc Minh accumulate to exactly 6.000 VND,
    // linking to invoice 2609703607 ("Hóa đơn tháng 9/2026") with total 6.000 VND and status "da_thanh_toan".
    const session = INITIAL_RECONCILIATION_SESSIONS[0];
    const txs = session.transactions;

    assert.equal(txs.length, 3);
    const sumAmounts = txs.reduce((acc, tx) => acc + tx.amount, 0);
    assert.equal(sumAmounts, 6000);

    // Verify all 3 transactions link to the exact same invoice
    txs.forEach((tx) => {
      assert.equal(tx.linkedInvoices.length, 1);
      assert.equal(tx.linkedInvoices[0].invoiceCode, '2609703607');
      assert.equal(tx.linkedInvoices[0].totalAmount, 6000);
      assert.equal(tx.linkedInvoices[0].status, 'da_thanh_toan');
    });
  });

  await t.test('Aggregates calculation: calculateSessionAggregates and calculateTransactionAggregates', () => {
    const sessions = [...INITIAL_RECONCILIATION_SESSIONS];
    const sessionAggs = calculateSessionAggregates(sessions);

    assert.equal(sessionAggs.totalSessions, 4);
    // 6.000 + 15.800.000 + 24.500.000 + 8.200.000 = 48.506.000
    assert.equal(sessionAggs.totalAmount, 48506000);
    // 3 + 4 + 5 + 2 = 14
    assert.equal(sessionAggs.totalTransactions, 14);

    // Transaction aggregates for session 1
    const txAggs = calculateTransactionAggregates(sessions[0].transactions);
    assert.equal(txAggs.totalAmount, 6000);
    assert.equal(txAggs.totalTransactions, 3);
    assert.equal(txAggs.uniqueInvoiceCount, 1);
  });

  await t.test('Redux State: setDateRange and setSelectedSessionId', () => {
    const initialState = {
      sessions: [...INITIAL_RECONCILIATION_SESSIONS],
      startDate: '2026-08-30',
      endDate: '2026-09-11',
      selectedSessionId: null,
      searchKeyword: '',
      selectedChannel: 'all',
      expandedTransactionIds: [],
    };

    // setDateRange
    const s1 = reconciliationReducer(
      initialState,
      setDateRange({ startDate: '2026-09-01', endDate: '2026-09-10' })
    );
    assert.equal(s1.startDate, '2026-09-01');
    assert.equal(s1.endDate, '2026-09-10');

    // setSelectedSessionId
    const s2 = reconciliationReducer(s1, setSelectedSessionId('session-20260910-01'));
    assert.equal(s2.selectedSessionId, 'session-20260910-01');
    assert.equal(s2.searchKeyword, '');
    assert.equal(s2.selectedChannel, 'all');
    assert.deepEqual(s2.expandedTransactionIds, []);
  });

  await t.test('Redux State: BR04 inline accordion expansion toggles', () => {
    const initialState = {
      sessions: [...INITIAL_RECONCILIATION_SESSIONS],
      startDate: '2026-08-30',
      endDate: '2026-09-11',
      selectedSessionId: 'session-20260910-01',
      searchKeyword: '',
      selectedChannel: 'all',
      expandedTransactionIds: [],
    };

    // Expand tx-1
    const s1 = reconciliationReducer(initialState, toggleExpandTransaction('tx-20260909-001'));
    assert.deepEqual(s1.expandedTransactionIds, ['tx-20260909-001']);

    // Expand tx-2
    const s2 = reconciliationReducer(s1, toggleExpandTransaction('tx-20260909-002'));
    assert.deepEqual(s2.expandedTransactionIds, ['tx-20260909-001', 'tx-20260909-002']);

    // Collapse tx-1
    const s3 = reconciliationReducer(s2, toggleExpandTransaction('tx-20260909-001'));
    assert.deepEqual(s3.expandedTransactionIds, ['tx-20260909-002']);
  });

  await t.test('Redux State: setSearchKeyword, setSelectedChannel, and resetDetailFilters', () => {
    const initialState = {
      sessions: [...INITIAL_RECONCILIATION_SESSIONS],
      startDate: '2026-08-30',
      endDate: '2026-09-11',
      selectedSessionId: 'session-20260910-01',
      searchKeyword: '',
      selectedChannel: 'all',
      expandedTransactionIds: [],
    };

    const s1 = reconciliationReducer(initialState, setSearchKeyword('Minh'));
    assert.equal(s1.searchKeyword, 'Minh');

    const s2 = reconciliationReducer(s1, setSelectedChannel('ecopay'));
    assert.equal(s2.selectedChannel, 'ecopay');

    const s3 = reconciliationReducer(s2, resetDetailFilters());
    assert.equal(s3.searchKeyword, '');
    assert.equal(s3.selectedChannel, 'all');
  });
});
