import React, { useState, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faHistory,
  faSearch,
  faFilter,
  faCircleCheck,
  faClock,
  faTimesCircle,
  faMoneyBillWave,
  faReceipt,
  faDownload
} from '@fortawesome/free-solid-svg-icons';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { useAppSelector } from '@/store';
import { formatCurrencyVND } from '@/utils/settingFeeValidation';

export default function SepayPaymentHistoryPage() {
  const router = useRouter();
  const schoolCode = (router.query.schoolCode as string) || 'demo';

  const transactions = useAppSelector((state) => state.settingFee.transactions);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('2026-09');
  const [statusFilter, setStatusFilter] = useState<'all' | 'success' | 'pending' | 'failed'>('all');

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // Month match
      if (selectedMonth && !tx.paymentDate.startsWith(selectedMonth)) {
        return false;
      }
      // Status match
      if (statusFilter !== 'all' && tx.status !== statusFilter) {
        return false;
      }
      // Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim();
        const matchesName = tx.studentName.toLowerCase().includes(query);
        const matchesClass = tx.className.toLowerCase().includes(query);
        const matchesInvoice = tx.invoiceNumber.toLowerCase().includes(query);
        const matchesCode = tx.transactionCode.toLowerCase().includes(query);
        return matchesName || matchesClass || matchesInvoice || matchesCode;
      }
      return true;
    });
  }, [transactions, selectedMonth, statusFilter, searchTerm]);

  // Statistics
  const totalAmount = useMemo(() => {
    return filteredTransactions
      .filter((tx) => tx.status === 'success')
      .reduce((sum, tx) => sum + tx.amount, 0);
  }, [filteredTransactions]);

  const successCount = useMemo(() => {
    return filteredTransactions.filter((tx) => tx.status === 'success').length;
  }, [filteredTransactions]);

  const pendingCount = useMemo(() => {
    return filteredTransactions.filter((tx) => tx.status === 'pending').length;
  }, [filteredTransactions]);

  const failedCount = useMemo(() => {
    return filteredTransactions.filter((tx) => tx.status === 'failed').length;
  }, [filteredTransactions]);

  return (
    <PortalLayout schoolCode={schoolCode}>
      <Head>
        <title>Lịch sử thanh toán Sepay | Finviet School Operating Portal</title>
      </Head>

      <div className="flex-1 overflow-y-auto bg-[#F8FAFC]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* Top Bar / Breadcrumb */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link
                href={`/${schoolCode}/setting/fee`}
                className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-[#0070CE] hover:border-blue-300 flex items-center justify-center transition-colors shadow-2xs"
                title="Quay lại Cấu hình Học phí"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  Lịch sử thanh toán Sepay
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Nhật ký tất cả giao dịch thanh toán học phí trực tuyến qua cổng Sepay & VietQR.
                </p>
              </div>
            </div>

            {/* Month Filter */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-slate-600">Tháng:</label>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0070CE]"
              />
            </div>
          </div>

          {/* Metric Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Total Revenue Collected */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <FontAwesomeIcon icon={faMoneyBillWave} className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Tổng tiền đã thu
                </div>
                <div className="text-lg font-bold text-slate-900 mt-0.5">
                  {formatCurrencyVND(totalAmount)}
                </div>
              </div>
            </div>

            {/* Success Count */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#0070CE] flex items-center justify-center font-bold">
                <FontAwesomeIcon icon={faCircleCheck} className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Giao dịch thành công
                </div>
                <div className="text-lg font-bold text-slate-900 mt-0.5">
                  {successCount} / {filteredTransactions.length}
                </div>
              </div>
            </div>

            {/* Pending / Failed Count */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <FontAwesomeIcon icon={faClock} className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Đang xử lý / Thất bại
                </div>
                <div className="text-lg font-bold text-slate-900 mt-0.5">
                  {pendingCount} chờ • {failedCount} lỗi
                </div>
              </div>
            </div>
          </div>

          {/* Filter Toolbar & Search */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex flex-wrap items-center justify-between gap-4">
            {/* Status Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg">
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  statusFilter === 'all'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tất cả ({transactions.length})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('success')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  statusFilter === 'success'
                    ? 'bg-white text-emerald-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Thành công ({transactions.filter((t) => t.status === 'success').length})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('pending')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  statusFilter === 'pending'
                    ? 'bg-white text-amber-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Đang xử lý ({transactions.filter((t) => t.status === 'pending').length})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('failed')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  statusFilter === 'failed'
                    ? 'bg-white text-red-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Thất bại ({transactions.filter((t) => t.status === 'failed').length})
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <FontAwesomeIcon
                icon={faSearch}
                className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm mã HĐ, tên học sinh, lớp..."
                className="w-full pl-9 pr-3.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0070CE] focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Transactions Data Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Thời gian</th>
                    <th className="py-3 px-4">Mã hóa đơn</th>
                    <th className="py-3 px-4">Học sinh</th>
                    <th className="py-3 px-4">Lớp</th>
                    <th className="py-3 px-4 text-right">Số tiền</th>
                    <th className="py-3 px-4">Mã giao dịch NH</th>
                    <th className="py-3 px-4 text-center">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        <FontAwesomeIcon
                          icon={faReceipt}
                          className="w-8 h-8 mx-auto mb-2 text-slate-300"
                        />
                        <p className="text-xs font-semibold">Không tìm thấy giao dịch nào phù hợp</p>
                      </td>
                    </tr>
                  ) : (
                    filteredTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                          {tx.paymentDate}
                        </td>
                        <td className="py-3 px-4 font-semibold text-[#0070CE]">
                          {tx.invoiceNumber}
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900">
                          {tx.studentName}
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {tx.className}
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-slate-900">
                          {formatCurrencyVND(tx.amount)}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">
                          {tx.transactionCode}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {tx.status === 'success' && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                              <FontAwesomeIcon icon={faCircleCheck} className="w-2.5 h-2.5" />
                              Thành công
                            </span>
                          )}
                          {tx.status === 'pending' && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                              <FontAwesomeIcon icon={faClock} className="w-2.5 h-2.5" />
                              Đang xử lý
                            </span>
                          )}
                          {tx.status === 'failed' && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
                              <FontAwesomeIcon icon={faTimesCircle} className="w-2.5 h-2.5" />
                              Thất bại
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="px-4 py-3 bg-slate-50/50 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500">
              <span>Hiển thị {filteredTransactions.length} giao dịch</span>
              <span className="font-semibold text-slate-700">
                Tổng cộng: {formatCurrencyVND(totalAmount)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
