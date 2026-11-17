import React from 'react';
import {
  StatusTag,
  DropdownMenu,
  Button,
} from '@/components/ds';
import type { StudentCareRecord } from '@/types/nutrition';

interface NutritionRosterTableProps {
  records: StudentCareRecord[];
  selectedStudentIds: string[];
  onToggleSelectStudent: (id: string) => void;
  onToggleSelectAll: () => void;
  onOpenSingleCare: (studentId: string) => void;
  onQuickStandardCare: (studentId: string) => void;
  onResetCare: (studentId: string) => void;
}

export default function NutritionRosterTable({
  records,
  selectedStudentIds,
  onToggleSelectStudent,
  onToggleSelectAll,
  onOpenSingleCare,
  onQuickStandardCare,
  onResetCare,
}: NutritionRosterTableProps) {
  const allSelected =
    records.length > 0 && records.every((r) => selectedStudentIds.includes(r.studentId));
  const someSelected =
    records.some((r) => selectedStudentIds.includes(r.studentId)) && !allSelected;

  const getMealBadge = (amount: string, behavior: string) => {
    if (behavior === 'bo_bua') return <StatusTag tone="danger">Bỏ bữa</StatusTag>;
    if (amount === 'an_het_suat') return <StatusTag tone="success">Hết suất</StatusTag>;
    if (amount === 'an_nua_suat') return <StatusTag tone="warning">1/2 suất</StatusTag>;
    return <StatusTag tone="neutral">Sơ sài</StatusTag>;
  };

  const getSleepBadge = (duration: string, behavior: string) => {
    if (behavior === 'khong_ngu') return <StatusTag tone="danger">Không ngủ</StatusTag>;
    if (duration === 'ngu_sau') return <StatusTag tone="success">Ngủ sâu</StatusTag>;
    if (duration === 'tam_60_phut') return <StatusTag tone="warning">~60 phút</StatusTag>;
    return <StatusTag tone="neutral">~30 phút</StatusTag>;
  };

  const getHydrationBadge = (amount: string, behavior: string) => {
    if (behavior === 'khong_uong') return <StatusTag tone="danger">Không uống</StatusTag>;
    if (amount === 'thuong_xuyen') return <StatusTag tone="success">Đủ nước</StatusTag>;
    if (amount === 'thinh_thoang') return <StatusTag tone="warning">Thỉnh thoảng</StatusTag>;
    return <StatusTag tone="neutral">Hiếm khi</StatusTag>;
  };

  if (records.length === 0) {
    return (
      <div className="bg-white rounded-[var(--radius-8)] border border-[var(--border-default)] p-12 text-center shadow-sm">
        <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-[var(--text-heading)] mb-1">
          Chưa có trẻ đến lớp hoặc không có dữ liệu
        </h3>
        <p className="text-sm text-[var(--text-subtle)]">
          Vui lòng kiểm tra lại ngày được chọn hoặc điều chỉnh bộ lọc tìm kiếm.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[var(--radius-8)] border border-[var(--border-default)] shadow-sm overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[var(--border-default)] bg-[var(--bg-subtle)] text-[12px] font-semibold text-[var(--text-subtle)] uppercase tracking-wider">
              <th className="py-3 px-4 w-12 text-center">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = someSelected;
                  }}
                  onChange={onToggleSelectAll}
                  className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                />
              </th>
              <th className="py-3 px-4 min-w-[220px]">Học sinh & Mã trẻ</th>
              <th className="py-3 px-4 min-w-[140px]">Bữa ăn (Trưa)</th>
              <th className="py-3 px-4 min-w-[130px]">Giấc ngủ</th>
              <th className="py-3 px-4 min-w-[120px]">Uống nước</th>
              <th className="py-3 px-4 min-w-[130px]">Đại tiện / Vệ sinh</th>
              <th className="py-3 px-4 min-w-[120px]">Trạng thái</th>
              <th className="py-3 px-4 w-28 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-default)] text-[13px]">
            {records.map((student) => {
              const isSelected = selectedStudentIds.includes(student.studentId);
              return (
                <tr
                  key={student.studentId}
                  className={`hover:bg-teal-50/40 transition-colors ${
                    isSelected ? 'bg-teal-50/60' : ''
                  }`}
                >
                  <td className="py-3.5 px-4 text-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelectStudent(student.studentId)}
                      className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                    />
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-9 h-9 rounded-full overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                        {student.avatarUrl ? (
                          <img
                            src={student.avatarUrl}
                            alt={student.fullName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-bold text-slate-500">
                            {student.fullName.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-[var(--text-heading)] flex items-center gap-1.5 truncate">
                          <span>{student.fullName}</span>
                          {student.nickname && (
                            <span className="text-xs text-slate-400 font-normal">
                              ({student.nickname})
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-[var(--text-subtle)] flex items-center gap-2 mt-0.5">
                          <span className="font-mono">{student.studentCode}</span>
                          <span>•</span>
                          <span>PH: {student.parentName}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    {student.isEvaluated ? (
                      <div className="space-y-1">
                        <div>{getMealBadge(student.meals.lunch.amount, student.meals.lunch.behavior)}</div>
                        {student.meals.lunch.note && (
                          <p className="text-xs text-slate-500 line-clamp-1 italic">
                            {student.meals.lunch.note}
                          </p>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-400 text-xs italic">Chưa ghi nhận</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    {student.isEvaluated ? (
                      <div className="space-y-1">
                        <div>{getSleepBadge(student.sleep.duration, student.sleep.behavior)}</div>
                        {student.sleep.note && (
                          <p className="text-xs text-slate-500 line-clamp-1 italic">
                            {student.sleep.note}
                          </p>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-400 text-xs italic">Chưa ghi nhận</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    {student.isEvaluated ? (
                      <div>{getHydrationBadge(student.hydration.amount, student.hydration.behavior)}</div>
                    ) : (
                      <span className="text-slate-400 text-xs italic">Chưa ghi nhận</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    {student.isEvaluated ? (
                      <div className="space-y-1">
                        <span className="text-xs font-medium text-slate-700">
                          {student.hygiene.poop.behavior === 'khong_di' ? 'Chưa đi tiêu' : 'Đã đi tiêu'}
                        </span>
                        {student.hygiene.general.activities.length > 0 && (
                          <p className="text-[11px] text-slate-500">
                            {student.hygiene.general.activities.includes('rua_tay') ? 'Rửa tay sạch' : ''}
                          </p>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-400 text-xs italic">Chưa ghi nhận</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    {student.isEvaluated ? (
                      <StatusTag tone="success">Đã đánh giá</StatusTag>
                    ) : (
                      <StatusTag tone="neutral">Chưa đánh giá</StatusTag>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <DropdownMenu
                      trigger={
                        <button className="p-1.5 rounded-[var(--radius-8)] text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                        </button>
                      }
                      items={[
                        {
                          label: 'Chăm sóc trẻ (Mở form)',
                          icon: 'utensils',
                          onClick: () => onOpenSingleCare(student.studentId),
                        },
                        {
                          label: 'Áp dụng mẫu chuẩn nhanh',
                          icon: 'check',
                          onClick: () => onQuickStandardCare(student.studentId),
                        },
                        {
                          label: 'Đặt lại đánh giá',
                          icon: 'trash',
                          tone: 'danger',
                          onClick: () => onResetCare(student.studentId),
                        },
                      ]}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List View (<768px) */}
      <div className="md:hidden divide-y divide-[var(--border-default)]">
        {records.map((student) => {
          const isSelected = selectedStudentIds.includes(student.studentId);
          return (
            <div
              key={student.studentId}
              className={`p-4 transition-colors ${isSelected ? 'bg-teal-50/60' : 'bg-white'}`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelectStudent(student.studentId)}
                    className="w-5 h-5 rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                  />
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                    {student.avatarUrl ? (
                      <img
                        src={student.avatarUrl}
                        alt={student.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-slate-500">
                        {student.fullName.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-[var(--text-heading)]">
                      {student.fullName} {student.nickname && `(${student.nickname})`}
                    </h4>
                    <p className="text-xs text-slate-400 font-mono">{student.studentCode}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="utensils"
                    onClick={() => onOpenSingleCare(student.studentId)}
                  >
                    Chăm sóc
                  </Button>
                </div>
              </div>

              {/* Status and summary chips */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-[var(--radius-8)] mb-2">
                <div>
                  <span className="text-slate-400 block text-[11px]">Bữa trưa:</span>
                  {student.isEvaluated ? (
                    getMealBadge(student.meals.lunch.amount, student.meals.lunch.behavior)
                  ) : (
                    <span className="text-slate-400 italic">Chưa đánh giá</span>
                  )}
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Giấc ngủ:</span>
                  {student.isEvaluated ? (
                    getSleepBadge(student.sleep.duration, student.sleep.behavior)
                  ) : (
                    <span className="text-slate-400 italic">Chưa đánh giá</span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span>PH: {student.parentName}</span>
                {student.isEvaluated ? (
                  <StatusTag tone="success">Đã hoàn thành</StatusTag>
                ) : (
                  <StatusTag tone="neutral">Chờ đánh giá</StatusTag>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
