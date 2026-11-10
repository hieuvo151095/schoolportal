/**
 * Batch Meal Refund Inspection Modal (Pop-up danh sách hoàn tiền ăn khi tạo hóa đơn hàng loạt)
 * Allows school accountant to review the list of eligible students with meal fee refund deductions
 * before confirming batch invoice generation for Toàn trường, Khối lớp, or Lớp học.
 * 
 * Governance: Marcus Fleet V34 / Constitution V1.0.0
 * References:
 * - Feature ID: 034-settings-meal-refund-mechanism-and-next-month-invoice-deduction
 * - docs_legacy/operating-portal/tai-chinh/hoc-phi.md
 * Design System: [DS] ECO ME DASHBOARD v1.1.0 (PopupModal)
 */

import React, { useState, useMemo } from 'react';
import type { StudentAbsenceBreakdown, StudentMealRefundSummary } from '../../../types/settingFee';
import type { InvoiceCreationScope } from '../../../types/invoice';
import { formatVND } from '../../../utils/invoiceValidation';
import { PopupModal, Icon, Avatar } from '@/components/ds';

export interface BatchMealRefundItem {
  student: {
    studentId: string;
    studentCode: string;
    studentName: string;
    avatar?: string;
    classId: string;
    className: string;
    gradeLevel: string;
  };
  absence: StudentAbsenceBreakdown;
  refundSummary: StudentMealRefundSummary;
}

interface BatchMealRefundListModalProps {
  isOpen: boolean;
  onClose: () => void;
  refundStudents: BatchMealRefundItem[];
  billingMonth: string;
  reconciledMonth?: string;
  scope: InvoiceCreationScope;
  gradeLevel?: string;
  standardGrossSubtotal?: number;
}

export const BatchMealRefundListModal: React.FC<BatchMealRefundListModalProps> = ({
  isOpen,
  onClose,
  refundStudents,
  billingMonth,
  scope,
  gradeLevel,
  standardGrossSubtotal = 0,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  // Filter students based on search term
  const filteredStudents = useMemo(() => {
    if (!searchTerm.trim()) return refundStudents;
    const term = searchTerm.toLowerCase().trim();
    return refundStudents.filter(
      (item) =>
        item.student.studentName.toLowerCase().includes(term) ||
        item.student.studentCode.toLowerCase().includes(term) ||
        item.student.className.toLowerCase().includes(term)
    );
  }, [refundStudents, searchTerm]);

  // Total deductions across all eligible students
  const grandTotalRefund = useMemo(() => {
    return refundStudents.reduce(
      (sum, item) => sum + item.refundSummary.totalMealRefund,
      0
    );
  }, [refundStudents]);

  // Format month labels
  const parts = billingMonth.split('-');
  const billingMonthDisplay =
    parts.length === 2 ? `Tháng ${parts[1]}/${parts[0]}` : billingMonth;

  const prevMonthKey =
    refundStudents.length > 0
      ? refundStudents[0].refundSummary.reconciledMonth
      : '';
  const prevParts = prevMonthKey.split('-');
  const reconciledMonthDisplay =
    prevParts.length === 2
      ? `Tháng ${prevParts[1]}/${prevParts[0]}`
      : prevMonthKey || 'Tháng trước';

  const scopeLabel =
    scope === 'toan_truong'
      ? 'Toàn trường'
      : scope === 'khoi_lop'
      ? `Khối ${gradeLevel || ''}`
      : scope === 'lop_hoc'
      ? 'Lớp học'
      : 'Học sinh';

  return (
    <PopupModal
      open={isOpen}
      onClose={onClose}
      title="Danh sách học sinh được khấu trừ hoàn tiền ăn"
      description={`Đối soát từ ${reconciledMonthDisplay} → Tự động giảm trừ vào kỳ thu ${billingMonthDisplay} • Phạm vi: ${scopeLabel}`}
      icon="utensils"
      width={860}
      primaryAction={{
        label: 'Đã hiểu & Đóng',
        icon: 'check',
        onClick: onClose,
      }}
    >
      <div className="space-y-3">
        {/* Toolbar & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-2 border-b border-slate-100">
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tên, mã học sinh, lớp..."
              className="w-full h-9 pl-3 pr-3 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0070CE] focus:border-[#0070CE]"
            />
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Tổng hoàn toàn đợt:</span>
              <span className="font-extrabold text-emerald-700 text-sm">
                -{formatVND(grandTotalRefund)}
              </span>
            </div>
          </div>
        </div>

        {/* Content Table */}
        <div className="max-h-[55vh] overflow-y-auto">
          {filteredStudents.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              <Icon name="user-graduate" size={32} className="text-slate-300 mx-auto mb-2" />
              <p>Không tìm thấy học sinh nào phù hợp với từ khóa tìm kiếm.</p>
            </div>
          ) : (
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-xs font-bold text-slate-700">
                    <th className="py-2.5 px-3 w-10 text-center">#</th>
                    <th className="py-2.5 px-4 min-w-[170px]">Học sinh</th>
                    <th className="py-2.5 px-4 min-w-[180px]">Số ngày nghỉ ({reconciledMonthDisplay})</th>
                    <th className="py-2.5 px-4 min-w-[180px]">Chi tiết các khoản hoàn</th>
                    <th className="py-2.5 px-4 text-right whitespace-nowrap">Tổng hoàn tiền</th>
                    <th className="py-2.5 px-4 text-right whitespace-nowrap">Tổng thanh toán</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredStudents.map((item, idx) => {
                    const mainMealItem = item.refundSummary.items.find(
                      (i) => i.category === 'tien_an'
                    );
                    const breakfastItem = item.refundSummary.items.find(
                      (i) => i.category === 'tien_an_sang'
                    );
                    const payableAmount = Math.max(
                      0,
                      standardGrossSubtotal - item.refundSummary.totalMealRefund
                    );

                    return (
                      <tr key={item.student.studentId} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-2.5 px-3 text-center text-slate-400 font-mono">
                          {idx + 1}
                        </td>
                        <td className="py-2.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <Avatar
                              name={item.student.studentName}
                              src={item.student.avatar}
                              size="sm"
                            />
                            <div>
                              <div className="font-bold text-slate-900 whitespace-nowrap">
                                {item.student.studentName}
                              </div>
                              <div className="text-[11px] text-slate-500 font-mono">
                                {item.student.studentCode} • {item.student.className}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-2.5 px-4">
                          <div className="space-y-1">
                            {item.absence.selfAbsenceDays > 0 ? (
                              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 text-amber-800 text-[11px] font-semibold border border-amber-200 whitespace-nowrap">
                                <Icon name="circle-check" size={11} className="text-amber-600" />
                                <span>{item.absence.selfAbsenceDays} ngày vắng có phép</span>
                              </div>
                            ) : (
                              <span className="text-slate-400 text-xs italic">Không vắng</span>
                            )}
                          </div>
                        </td>
                        <td className="py-2.5 px-4 min-w-[180px]">
                          <div className="space-y-1">
                            {mainMealItem && mainMealItem.totalRefundAmount > 0 && (
                              <div className="flex items-center justify-between gap-3 whitespace-nowrap text-slate-700 text-[11px]">
                                <span className="font-medium">Tiền ăn bán trú:</span>
                                <span className="font-bold text-emerald-600">
                                  -{formatVND(mainMealItem.totalRefundAmount)}
                                </span>
                              </div>
                            )}
                            {breakfastItem && breakfastItem.totalRefundAmount > 0 && (
                              <div className="flex items-center justify-between gap-3 whitespace-nowrap text-slate-700 text-[11px]">
                                <span className="font-medium">Tiền ăn sáng:</span>
                                <span className="font-bold text-emerald-600">
                                  -{formatVND(breakfastItem.totalRefundAmount)}
                                </span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-2.5 px-4 text-right whitespace-nowrap">
                          <span className="font-bold text-emerald-700 text-sm">
                            -{formatVND(item.refundSummary.totalMealRefund)}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-right whitespace-nowrap">
                          <div className="font-extrabold text-[#0070CE] text-sm">
                            {formatVND(payableAmount)}
                          </div>
                          {standardGrossSubtotal > 0 && (
                            <div className="text-[10px] text-slate-400 mt-0.5 font-medium">
                              Định mức {formatVND(standardGrossSubtotal)} - Hoàn {formatVND(item.refundSummary.totalMealRefund)}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </PopupModal>
  );
};
