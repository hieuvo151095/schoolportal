import React from 'react';
import { StatusTag, IconButton, DropdownMenu, type DropdownMenuItem } from '@/components/ds';
import type { StudentRewardRecord } from '@/types/reward';

interface RewardRosterTableProps {
  records: StudentRewardRecord[];
  selectedIds: string[];
  onToggleSelect: (studentId: string) => void;
  onSelectAll: () => void;
  onToggleReward: (studentId: string) => void;
  onOpenDetail: (record: StudentRewardRecord) => void;
  onUpdateComment: (studentId: string, comment: string) => void;
}

export default function RewardRosterTable({
  records,
  selectedIds,
  onToggleSelect,
  onSelectAll,
  onToggleReward,
  onOpenDetail,
  onUpdateComment,
}: RewardRosterTableProps) {
  const allSelected = records.length > 0 && records.every((r) => selectedIds.includes(r.studentId));
  const someSelected = records.some((r) => selectedIds.includes(r.studentId)) && !allSelected;

  if (records.length === 0) {
    return (
      <div className="bg-white rounded-[var(--radius-8)] border border-[var(--border-default)] p-12 text-center shadow-sm">
        <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h4 className="text-[15px] font-semibold text-[var(--text-heading)] mb-1">Không tìm thấy học sinh nào</h4>
        <p className="text-[13px] text-slate-500 max-w-md mx-auto">
          Vui lòng thử điều chỉnh bộ lọc tìm kiếm, tuần học hoặc chọn lớp khác.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[var(--radius-8)] border border-[var(--border-default)] shadow-sm overflow-hidden mb-6">
      {/* Desktop & Tablet Table (>=768px) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse text-[13px]">
          <thead>
            <tr className="bg-[var(--bg-subtle)] border-b border-[var(--border-default)] text-slate-600 font-semibold sticky top-0 z-10">
              <th className="py-3 px-4 w-[48px] text-center">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = someSelected;
                  }}
                  onChange={onSelectAll}
                  className="w-4 h-4 text-[var(--eco-blue-strong)] rounded border-slate-300 focus:ring-[var(--eco-blue-strong)] cursor-pointer"
                  aria-label="Chọn tất cả học sinh"
                />
              </th>
              <th className="py-3 px-4 min-w-[200px]">Học sinh & Mã trẻ</th>
              <th className="py-3 px-4 min-w-[170px] text-center">Phiếu bé ngoan</th>
              <th className="py-3 px-4 min-w-[140px] text-center">Nghỉ học tuần</th>
              <th className="py-3 px-4 min-w-[260px]">Nhận xét của giáo viên</th>
              <th className="py-3 px-4 w-[80px] text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-default)]">
            {records.map((record) => {
              const isSelected = selectedIds.includes(record.studentId);
              const rowMenuItems: DropdownMenuItem[] = [
                {
                  label: 'Xem chi tiết phiếu',
                  icon: 'eye',
                  onClick: () => onOpenDetail(record),
                },
                {
                  label: record.isAwarded ? 'Bỏ cấp phiếu bé ngoan' : 'Cấp phiếu bé ngoan',
                  icon: record.isAwarded ? 'x-mark' : 'circle-check',
                  tone: record.isAwarded ? 'danger' : 'default',
                  onClick: () => onToggleReward(record.studentId),
                },
              ];

              return (
                <tr
                  key={record.studentId}
                  className={`hover:bg-slate-50/70 transition-colors ${
                    isSelected ? 'bg-blue-50/40' : ''
                  }`}
                >
                  {/* Checkbox */}
                  <td className="py-3.5 px-4 text-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelect(record.studentId)}
                      className="w-4 h-4 text-[var(--eco-blue-strong)] rounded border-slate-300 focus:ring-[var(--eco-blue-strong)] cursor-pointer"
                    />
                  </td>

                  {/* Student Info */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-slate-100 border border-slate-200">
                        <img
                          src={record.avatarUrl}
                          alt={record.fullName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => onOpenDetail(record)}
                            className="font-semibold text-[var(--text-heading)] hover:text-[var(--eco-blue-strong)] text-left transition-colors"
                          >
                            {record.fullName}
                          </button>
                          {record.nickname && (
                            <span className="text-[11px] text-slate-500 font-normal">
                              ({record.nickname})
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[12px] text-slate-500">
                          <span>Mã: <strong className="font-mono text-slate-700">{record.studentCode}</strong></span>
                          <span>•</span>
                          <span>{record.gender === 'male' ? 'Nam' : 'Nữ'}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Sun Character Reward Stamp (1-Click Toggle) */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex flex-col items-center justify-center gap-1">
                      <button
                        type="button"
                        onClick={() => onToggleReward(record.studentId)}
                        className="group relative p-1 rounded-full hover:bg-amber-50 focus:outline-none transition-transform active:scale-95"
                        title={record.isAwarded ? 'Bấm để hủy cấp phiếu bé ngoan' : 'Bấm để cấp phiếu bé ngoan'}
                      >
                        {record.isAwarded ? (
                          <img
                            src="/images/reward/sun_awarded.png"
                            alt="Đã đạt Phiếu Bé Ngoan"
                            className="w-11 h-11 object-contain drop-shadow-md group-hover:scale-110 transition-transform"
                          />
                        ) : (
                          <img
                            src="/images/reward/sun_unawarded.png"
                            alt="Chưa đạt Phiếu Bé Ngoan"
                            className="w-11 h-11 object-contain grayscale opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all"
                          />
                        )}
                      </button>

                      <div className="flex items-center gap-1 mt-0.5">
                        {record.isAwarded ? (
                          <StatusTag tone="success">Đạt phiếu</StatusTag>
                        ) : (
                          <StatusTag tone="neutral">Chưa đạt</StatusTag>
                        )}
                        {record.isPublished && (
                          <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-medium border border-blue-200">
                            Đã gửi PH
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Absence Stats */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="inline-flex flex-col items-center gap-1 text-[12px]">
                      <div className="flex items-center gap-1 text-slate-600">
                        <span>Có phép:</span>
                        <strong className="text-slate-800">{record.excusedAbsenceCount}</strong>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-slate-600">Không phép:</span>
                        <strong
                          className={
                            record.unexcusedAbsenceCount > 0
                              ? 'text-red-600 font-bold bg-red-50 px-1 rounded'
                              : 'text-slate-800'
                          }
                        >
                          {record.unexcusedAbsenceCount}
                        </strong>
                      </div>
                    </div>
                  </td>

                  {/* Teacher Comment */}
                  <td className="py-3.5 px-4">
                    <div className="relative group">
                      <input
                        type="text"
                        value={record.teacherComment}
                        onChange={(e) => onUpdateComment(record.studentId, e.target.value)}
                        placeholder="Nhập nhận xét của cô giáo..."
                        className="w-full h-[36px] px-3 text-[13px] bg-transparent border border-transparent rounded-[var(--radius-8)] hover:border-slate-300 focus:bg-white focus:border-[var(--eco-blue-strong)] focus:outline-none transition-all placeholder:text-slate-400 text-slate-800"
                      />
                      <button
                        type="button"
                        onClick={() => onOpenDetail(record)}
                        className="opacity-0 group-hover:opacity-100 absolute right-2 top-1/2 -translate-y-1/2 text-[11px] text-[var(--eco-blue-strong)] font-medium hover:underline bg-white/90 px-1 py-0.5 rounded"
                      >
                        Mẫu
                      </button>
                    </div>
                  </td>

                  {/* Action Menu (Three-Dots Dropdown) */}
                  <td className="py-3.5 px-4 text-right">
                    <DropdownMenu
                      items={rowMenuItems}
                      align="right"
                      trigger={
                        <IconButton
                          icon="ellipsis-vertical"
                          label="Thao tác"
                          size="sm"
                        />
                      }
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List View (<768px) */}
      <div className="block md:hidden divide-y divide-[var(--border-default)]">
        {records.map((record) => {
          const isSelected = selectedIds.includes(record.studentId);

          return (
            <div
              key={record.studentId}
              className={`p-4 transition-colors ${isSelected ? 'bg-blue-50/40' : 'bg-white'}`}
            >
              <div className="flex items-start justify-between gap-3 mb-2.5">
                {/* Student header with checkbox */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelect(record.studentId)}
                    className="w-4 h-4 text-[var(--eco-blue-strong)] rounded border-slate-300 focus:ring-[var(--eco-blue-strong)]"
                  />
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-slate-100 border border-slate-200">
                    <img
                      src={record.avatarUrl}
                      alt={record.fullName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h5
                      onClick={() => onOpenDetail(record)}
                      className="font-semibold text-[14px] text-[var(--text-heading)] hover:text-[var(--eco-blue-strong)] cursor-pointer"
                    >
                      {record.fullName}
                    </h5>
                    <span className="text-[12px] text-slate-500 font-mono">
                      {record.studentCode} • {record.gender === 'male' ? 'Nam' : 'Nữ'}
                    </span>
                  </div>
                </div>

                {/* Sun Stamp on Mobile */}
                <button
                  type="button"
                  onClick={() => onToggleReward(record.studentId)}
                  className="p-1 rounded-full hover:bg-slate-100 flex-shrink-0 active:scale-95"
                >
                  {record.isAwarded ? (
                    <img
                      src="/images/reward/sun_awarded.png"
                      alt="Đã đạt"
                      className="w-11 h-11 object-contain drop-shadow"
                    />
                  ) : (
                    <img
                      src="/images/reward/sun_unawarded.png"
                      alt="Chưa đạt"
                      className="w-11 h-11 object-contain grayscale opacity-50"
                    />
                  )}
                </button>
              </div>

              {/* Status pills & absences */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-[12px] mb-3 bg-slate-50 p-2.5 rounded-[var(--radius-8)]">
                <div className="flex items-center gap-1.5">
                  {record.isAwarded ? (
                    <StatusTag tone="success">Đạt phiếu bé ngoan</StatusTag>
                  ) : (
                    <StatusTag tone="neutral">Chưa đạt phiếu</StatusTag>
                  )}
                  {record.isPublished && (
                    <span className="text-[11px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-medium">
                      Đã gửi PH
                    </span>
                  )}
                </div>
                <div className="text-slate-600">
                  Vắng: có phép <strong>{record.excusedAbsenceCount}</strong>, KP{' '}
                  <strong className={record.unexcusedAbsenceCount > 0 ? 'text-red-600' : ''}>
                    {record.unexcusedAbsenceCount}
                  </strong>
                </div>
              </div>

              {/* Mobile comment field & button */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={record.teacherComment}
                  onChange={(e) => onUpdateComment(record.studentId, e.target.value)}
                  placeholder="Nhận xét của cô..."
                  className="flex-grow h-[36px] px-3 text-[13px] bg-white border border-slate-300 rounded-[var(--radius-8)] text-slate-800 placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => onOpenDetail(record)}
                  className="h-[36px] px-3 text-[12px] font-medium text-[var(--eco-blue-strong)] bg-blue-50 hover:bg-blue-100 rounded-[var(--radius-8)] flex-shrink-0"
                >
                  Xem phiếu
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
