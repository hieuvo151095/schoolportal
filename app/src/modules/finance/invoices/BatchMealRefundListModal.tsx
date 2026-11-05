/**
 * Batch Meal Refund Inspection Modal (Pop-up danh sách hoàn tiền ăn khi tạo hóa đơn hàng loạt)
 * Allows school accountant to review the list of eligible students with meal fee refund deductions
 * before confirming batch invoice generation for Toàn trường, Khối lớp, or Lớp học.
 * 
 * Governance: Marcus Fleet V34 / Constitution V1.0.0
 * References:
 * - Feature ID: 034-settings-meal-refund-mechanism-and-next-month-invoice-deduction
 * - docs_legacy/operating-portal/tai-chinh/hoc-phi.md
 */

import React, { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faUtensils,
  faSearch,
  faInfoCircle,
  faCheckCircle,
  faCalendarAlt,
  faUserGraduate,
  faMoneyBillWave,
} from '@fortawesome/free-solid-svg-icons';
import type { StudentAbsenceBreakdown, StudentMealRefundSummary } from '../../../types/settingFee';
import type { InvoiceCreationScope } from '../../../types/invoice';
import { formatVND } from '../../../utils/invoiceValidation';

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
  reconciledMonth: string;
  scope: InvoiceCreationScope;
  standardGrossSubtotal?: number;
}

export const BatchMealRefundListModal: React.FC<BatchMealRefundListModalProps> = ({
  isOpen,
  onClose,
  refundStudents,
  billingMonth,
  reconciledMonth,
  scope,
  standardGrossSubtotal = 0,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

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

  const grandTotalRefund = useMemo(() => {
    return refundStudents.reduce(
      (sum, item) => sum + item.refundSummary.totalMealRefund,
      0
    );
  }, [refundStudents]);

  if (!isOpen) return null;

  const reconciledMonthDisplay = reconciledMonth.includes('-')
    ? `Tháng ${reconciledMonth.split('-')[1]}/${reconciledMonth.split('-')[0]}`
    : reconciledMonth;

  const billingMonthDisplay = billingMonth.includes('-')
    ? `Tháng ${billingMonth.split('-')[1]}/${billingMonth.split('-')[0]}`
    : billingMonth;

  const scopeLabel =
    scope === 'toan_truong'
      ? 'Toàn trường'
      : scope === 'khoi_lop'
      ? 'Khối lớp'
      : scope === 'lop_hoc'
      ? 'Lớp học'
      : 'Học sinh';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-50 via-blue-50/40 to-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shadow-xs shrink-0">
              <FontAwesomeIcon icon={faUtensils} className="text-base" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-slate-900 text-base">
                  Danh sách học sinh được khấu trừ hoàn tiền ăn
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {refundStudents.length} học sinh
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Đối soát từ {reconciledMonthDisplay} $\rightarrow$ Tự động giảm trừ vào kỳ thu {billingMonthDisplay} • Phạm vi: <span className="font-semibold text-slate-700">{scopeLabel}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 flex items-center justify-center transition shrink-0"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Toolbar & Search */}
        <div className="px-6 py-3 bg-slate-50/80 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tên, mã học sinh, lớp..."
              className="w-full h-8 pl-8 pr-3 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0070CE] focus:border-[#0070CE]"
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
        <div className="flex-1 overflow-y-auto p-6">
          {filteredStudents.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              <FontAwesomeIcon icon={faUserGraduate} className="text-3xl text-slate-300 mb-2" />
              <p>Không tìm thấy học sinh nào phù hợp với từ khóa tìm kiếm.</p>
            </div>
          ) : (
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-xs font-bold text-slate-700">
                    <th className="py-3 px-3 w-10 text-center">#</th>
                    <th className="py-3 px-4 min-w-[170px]">Học sinh</th>
                    <th className="py-3 px-4 min-w-[200px]">Lý do & Số ngày nghỉ ({reconciledMonthDisplay})</th>
                    <th className="py-3 px-4 min-w-[200px]">Chi tiết các khoản hoàn</th>
                    <th className="py-3 px-4 text-right whitespace-nowrap">Tổng hoàn tiền</th>
                    <th className="py-3 px-4 text-right whitespace-nowrap">Tổng tiền thanh toán</th>
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
                        <td className="py-3 px-3 text-center text-slate-400 font-mono">
                          {idx + 1}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            {item.student.avatar ? (
                              <img
                                src={item.student.avatar}
                                alt={item.student.studentName}
                                className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-blue-100 text-[#0070CE] font-bold flex items-center justify-center text-xs shrink-0">
                                {item.student.studentName.charAt(0)}
                              </div>
                            )}
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
                        <td className="py-3 px-4">
                          <div className="space-y-1">
                            {item.absence.selfAbsenceDays > 0 ? (
                              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 text-amber-800 text-[11px] font-semibold border border-amber-200 whitespace-nowrap">
                                <FontAwesomeIcon icon={faCheckCircle} className="text-[9px] text-amber-600" />
                                <span>{item.absence.selfAbsenceDays} ngày vắng có phép</span>
                              </div>
                            ) : (
                              <span className="text-slate-400 text-xs italic">Không vắng</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 min-w-[200px]">
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
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <span className="font-bold text-emerald-700 text-sm">
                            -{formatVND(item.refundSummary.totalMealRefund)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">
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

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <FontAwesomeIcon icon={faInfoCircle} className="text-[#0070CE] shrink-0" />
            <span>
              Mỗi học sinh trong danh sách trên sẽ được tạo hóa đơn với số tiền thanh toán đã trừ khoản hoàn tương ứng. Các học sinh khác sẽ thu theo định mức chuẩn.
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-[#0070CE] hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors shrink-0 shadow-xs"
          >
            Đã hiểu & Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
