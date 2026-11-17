import React from 'react';
import { StatusTag } from '@/components/ds';
import type { RewardMonthlyReport, StudentRewardReportRow } from '@/types/rewardReport';

interface RewardReportMatrixTableProps {
  report: RewardMonthlyReport;
  searchQuery: string;
  onOpenDetail?: (row: StudentRewardReportRow) => void;
}

export default function RewardReportMatrixTable({
  report,
  searchQuery,
  onOpenDetail,
}: RewardReportMatrixTableProps) {
  const filteredRows = report.rows.filter((r) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      r.fullName.toLowerCase().includes(q) ||
      r.studentCode.toLowerCase().includes(q) ||
      (r.nickname && r.nickname.toLowerCase().includes(q))
    );
  });

  if (filteredRows.length === 0) {
    return (
      <div className="bg-white rounded-[var(--radius-8)] border border-[var(--border-default)] p-12 text-center shadow-sm">
        <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h4 className="text-[15px] font-semibold text-[var(--text-heading)] mb-1">Không tìm thấy kết quả phù hợp</h4>
        <p className="text-[13px] text-slate-500 max-w-md mx-auto">
          Vui lòng thử điều chỉnh từ khóa tìm kiếm hoặc chọn lớp khác.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full min-w-0">
      {/* Desktop & Tablet Matrix Table (>=768px) */}
      <div className="hidden md:block overflow-x-auto ecomd-table-scroll">
        <table className="w-full text-left border-collapse text-[13px]">
          <thead>
            {/* Header Level 1: Group Headers */}
            <tr className="bg-[var(--bg-subtle)] border-b border-[var(--border-default)] text-slate-700 font-semibold sticky top-0 z-20">
              <th
                rowSpan={2}
                className="py-3 px-4 min-w-[240px] sticky left-0 z-30 bg-[var(--bg-subtle)] border-r border-[var(--border-default)] shadow-xs"
              >
                Trẻ
              </th>
              <th
                colSpan={report.weeks.length}
                className="py-2.5 px-4 text-center border-r border-[var(--border-default)] bg-amber-50/50 text-amber-900 font-bold tracking-wide"
              >
                {report.monthLabel}
              </th>
              <th
                colSpan={3}
                className="py-2.5 px-4 text-center bg-blue-50/50 text-blue-900 font-bold tracking-wide"
              >
                Tổng kết tháng
              </th>
            </tr>

            {/* Header Level 2: Specific Columns */}
            <tr className="bg-[var(--bg-subtle)] border-b border-[var(--border-default)] text-slate-600 font-medium text-[12px] sticky top-[37px] z-20">
              {/* Week Columns */}
              {report.weeks.map((w) => (
                <th
                  key={w.weekNumber}
                  className="py-2.5 px-3 min-w-[140px] text-center border-r border-[var(--border-default)]"
                >
                  <div className="flex flex-col items-center leading-tight">
                    <span className="font-semibold text-slate-800">{w.weekLabel}</span>
                    <span className="text-[11px] text-slate-500 mt-0.5">{w.dateRange}</span>
                  </div>
                </th>
              ))}

              {/* Summary Columns */}
              <th className="py-2.5 px-3 min-w-[120px] text-center font-semibold text-emerald-800 whitespace-nowrap">
                Phiếu bé ngoan
              </th>
              <th className="py-2.5 px-3 min-w-[110px] text-center font-semibold text-slate-700 whitespace-nowrap">
                Vắng có phép
              </th>
              <th className="py-2.5 px-3 min-w-[130px] text-center font-semibold text-red-700 whitespace-nowrap">
                Vắng không phép
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[var(--border-default)]">
            {filteredRows.map((row) => (
              <tr
                key={row.studentId}
                onClick={() => onOpenDetail && onOpenDetail(row)}
                className="hover:bg-slate-50/70 transition-colors cursor-pointer"
              >
                {/* Sticky Student Column */}
                <td className="py-3 px-4 sticky left-0 z-10 bg-white group-hover:bg-slate-50/70 border-r border-[var(--border-default)] shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-slate-100 border border-slate-200">
                      <img
                        src={row.avatarUrl}
                        alt={row.fullName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-[13.5px] text-[var(--text-heading)] hover:text-[var(--eco-blue-strong)] text-left truncate transition-colors">
                          {row.fullName}
                        </span>
                        {row.nickname && (
                          <span className="text-[11.5px] text-slate-500 font-normal truncate">
                            ({row.nickname})
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[12px] text-slate-500 mt-0.5">
                        <span>Mã: <strong className="font-mono text-slate-700">{row.studentCode}</strong></span>
                      </div>
                    </div>
                  </div>
                </td>

                {/* Week Cells */}
                {report.weeks.map((w) => {
                  const status = row.weeklyStatus[w.weekNumber];
                  if (!status || status.isFuture) {
                    return (
                      <td
                        key={w.weekNumber}
                        className="py-3 px-3 text-center border-r border-[var(--border-default)] text-slate-300 font-mono"
                      >
                        —
                      </td>
                    );
                  }

                  return (
                    <td
                      key={w.weekNumber}
                      className="py-3 px-3 text-center border-r border-[var(--border-default)]"
                    >
                      <div className="flex flex-col items-center justify-center gap-0.5">
                        {status.isAwarded ? (
                          <span
                            title={`Tuần ${w.weekNumber}: Đạt Phiếu Bé Ngoan`}
                            className="inline-block hover:scale-110 transition-transform cursor-pointer"
                            onClick={() => onOpenDetail && onOpenDetail(row)}
                          >
                            <img
                              src="/images/reward/sun_awarded.png"
                              alt="Đạt phiếu"
                              className="w-8 h-8 object-contain drop-shadow-xs"
                            />
                          </span>
                        ) : (
                          <span
                            title={`Tuần ${w.weekNumber}: Chưa đạt`}
                            className="inline-block hover:scale-110 transition-transform cursor-pointer"
                            onClick={() => onOpenDetail && onOpenDetail(row)}
                          >
                            <img
                              src="/images/reward/sun_unawarded.png"
                              alt="Chưa đạt"
                              className="w-8 h-8 object-contain grayscale opacity-45"
                            />
                          </span>
                        )}
                        {status.excusedAbsence > 0 && (
                          <span className="text-[10px] text-amber-700 bg-amber-50 px-1 rounded font-medium">
                            Vắng {status.excusedAbsence}
                          </span>
                        )}
                      </div>
                    </td>
                  );
                })}

                {/* Total Awarded */}
                <td className="py-3 px-3 text-center font-bold text-slate-800 tabular-nums">
                  <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[12px] bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {row.totalAwarded} phiếu
                  </span>
                </td>

                {/* Total Excused */}
                <td className="py-3 px-3 text-center tabular-nums text-slate-700 font-semibold">
                  {row.totalExcused} buổi
                </td>

                {/* Total Unexcused */}
                <td className="py-3 px-3 text-center tabular-nums">
                  <span
                    className={
                      row.totalUnexcused > 0
                        ? 'text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded'
                        : 'text-slate-600'
                    }
                  >
                    {row.totalUnexcused} buổi
                  </span>
                </td>
              </tr>
            ))}
          </tbody>

          {/* Footer Summary Row */}
          <tfoot>
            <tr className="bg-slate-100/80 font-bold text-slate-800 border-t-2 border-slate-300">
              <td className="py-3.5 px-4 sticky left-0 z-10 bg-slate-100 border-r border-[var(--border-default)] shadow-xs">
                Tổng phiếu bé ngoan trong tháng
              </td>

              {/* Weekly Totals */}
              {report.weeks.map((w) => (
                <td
                  key={w.weekNumber}
                  className="py-3.5 px-3 text-center border-r border-[var(--border-default)] tabular-nums"
                >
                  {w.isFuture ? (
                    <span className="text-slate-400 font-normal">—</span>
                  ) : (
                    <span className="text-emerald-700 font-bold">
                      {report.summary.weeklyAwardedTotals[w.weekNumber] || 0}
                    </span>
                  )}
                </td>
              ))}

              {/* Grand Total */}
              <td className="py-3.5 px-3 text-center tabular-nums text-emerald-800 text-[14px]">
                {report.summary.grandTotalAwarded}
              </td>

              {/* Total Excused Absences */}
              <td className="py-3.5 px-3 text-center tabular-nums text-slate-700">
                {report.summary.totalExcusedAbsences}
              </td>

              {/* Total Unexcused Absences */}
              <td className="py-3.5 px-3 text-center tabular-nums text-red-600">
                {report.summary.totalUnexcusedAbsences}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Mobile Card List View (<768px) */}
      <div className="block md:hidden divide-y divide-[var(--border-default)]">
        {filteredRows.map((row) => (
          <div key={row.studentId} className="p-4 bg-white">
            <div className="flex items-start justify-between gap-3 mb-2.5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-slate-100 border border-slate-200">
                  <img
                    src={row.avatarUrl}
                    alt={row.fullName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h5
                    onClick={() => onOpenDetail && onOpenDetail(row)}
                    className="font-semibold text-[14px] text-[var(--text-heading)] hover:text-[var(--eco-blue-strong)] cursor-pointer"
                  >
                    {row.fullName}
                  </h5>
                  <span className="text-[12px] text-slate-500 font-mono">
                    {row.studentCode} • {row.nickname ? `(${row.nickname})` : ''}
                  </span>
                </div>
              </div>

              {/* Monthly Award Count Pill */}
              <span className="px-2.5 py-1 rounded-full text-[12px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {row.totalAwarded} phiếu
              </span>
            </div>

            {/* Weekly Sun Stamps Row on Mobile */}
            <div className="bg-slate-50 p-3 rounded-[var(--radius-8)] mb-2 flex items-center justify-around gap-1">
              {report.weeks.map((w) => {
                const status = row.weeklyStatus[w.weekNumber];
                return (
                  <div key={w.weekNumber} className="flex flex-col items-center">
                    <span className="text-[10px] text-slate-500 font-semibold mb-1">{w.weekLabel}</span>
                    {status?.isFuture ? (
                      <span className="text-slate-300 font-mono text-xs">—</span>
                    ) : status?.isAwarded ? (
                      <img
                        src="/images/reward/sun_awarded.png"
                        alt="Đạt"
                        className="w-7 h-7 object-contain"
                      />
                    ) : (
                      <img
                        src="/images/reward/sun_unawarded.png"
                        alt="Chưa đạt"
                        className="w-7 h-7 object-contain grayscale opacity-45"
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Attendance line */}
            <div className="text-[12px] text-slate-600 flex justify-between">
              <span>Nghỉ có phép: <strong>{row.totalExcused}</strong> buổi</span>
              <span>Nghỉ không phép: <strong className={row.totalUnexcused > 0 ? 'text-red-600' : ''}>{row.totalUnexcused}</strong> buổi</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
