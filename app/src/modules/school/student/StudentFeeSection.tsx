import React, { useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faChevronDown,
  faChevronUp,
  faGraduationCap,
  faUtensils,
  faCoffee,
  faCoins,
  faCheckCircle,
  faExclamationTriangle,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import type { Student, StudentFeeItem } from '../../../types/student';
import { useAppSelector } from '../../../store';
import { EditStudentFeeModal } from './EditStudentFeeModal';
import {
  evaluateStudentBreakfastRefundEligibility,
  formatCurrencyVND,
  formatFeeUnitDisplay,
  isBreakfastFeeItem,
} from '../../../utils/studentFeeCalculation';

interface StudentFeeSectionProps {
  student: Student;
  schoolCode: string;
}

export const StudentFeeSection: React.FC<StudentFeeSectionProps> = ({
  student,
  schoolCode,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Meal refund config from Settings module
  const mealRefundConfig = useAppSelector(
    (state) => state.settingFee.latePickupAndRefund?.mealRefund
  );

  // Fallback default fee items if student hasn't had explicit fee items saved
  const feeItems: StudentFeeItem[] =
    student.feeItems && student.feeItems.length > 0
      ? student.feeItems
      : [
          {
            id: `sfee-${student.id}-1`,
            feeId: 'fee-sys-001',
            code: 'HOC_PHI',
            name: 'Học phí',
            amount: 200000,
            unit: 'thang',
            unitDisplay: 'Đ/tháng',
            exportElectronicInvoice: true,
            category: 'hoc_phi',
            isMandatory: true,
          },
          {
            id: `sfee-${student.id}-2`,
            feeId: 'fee-sys-002',
            code: 'TIEN_AN',
            name: 'Tiền ăn',
            amount: 35000,
            unit: 'ngay',
            unitDisplay: 'Đ/ngày',
            exportElectronicInvoice: true,
            category: 'tien_an',
            isMandatory: true,
          },
          {
            id: `sfee-${student.id}-3`,
            feeId: 'fee-cust-011',
            code: 'HOC_LIEU_LS',
            name: 'Học liệu Lịch sử',
            amount: 280000,
            unit: 'nam',
            unitDisplay: 'Đ/năm',
            exportElectronicInvoice: false,
            category: 'khac',
          },
          {
            id: `sfee-${student.id}-4`,
            feeId: 'fee-cust-012',
            code: 'NGOAI_KHOA',
            name: 'Ngoại khóa',
            amount: 0,
            unit: 'thang',
            unitDisplay: 'Đ/tháng',
            exportElectronicInvoice: false,
            category: 'khac',
          },
          {
            id: `sfee-${student.id}-5`,
            feeId: 'fee-cust-013',
            code: 'TIENG_ANH',
            name: 'Tiếng Anh',
            amount: 1000,
            unit: 'thang',
            unitDisplay: 'Đ/tháng',
            exportElectronicInvoice: false,
            category: 'khac',
          },
        ];

  // Evaluate breakfast refund eligibility
  const studentWithFees = { ...student, feeItems };
  const refundEvaluation = evaluateStudentBreakfastRefundEligibility(
    studentWithFees,
    mealRefundConfig
  );

  const getFeeItemIcon = (fee: StudentFeeItem) => {
    if (fee.category === 'hoc_phi' || fee.code === 'HOC_PHI' || fee.name.toLowerCase().includes('học phí')) {
      return faGraduationCap;
    }
    if (fee.category === 'tien_an' || fee.code === 'TIEN_AN' || fee.name.toLowerCase().includes('tiền ăn')) {
      return faUtensils;
    }
    if (isBreakfastFeeItem(fee)) {
      return faCoffee;
    }
    return faCoins;
  };

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="p-5 flex items-center justify-between border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <h3 className="text-base font-bold text-slate-800">Thông tin học phí</h3>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/80">
            {feeItems.length} Khoản Phí
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Edit button opening popup modal */}
          <button
            type="button"
            onClick={() => setIsEditModalOpen(true)}
            title="Chỉnh sửa học phí học sinh"
            className="p-1.5 text-slate-500 hover:text-[#0070CE] hover:bg-slate-100 rounded-lg transition-colors inline-flex items-center justify-center cursor-pointer"
          >
            <FontAwesomeIcon icon={faEdit} className="text-base" />
          </button>

          {/* Accordion toggle */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <FontAwesomeIcon icon={isExpanded ? faChevronUp : faChevronDown} className="text-sm" />
          </button>
        </div>
      </div>

      {/* Accordion Body */}
      {isExpanded && (
        <div className="p-6 space-y-5">
          {/* Fee Items Grid - 2 columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {feeItems.map((fee) => {
              const icon = getFeeItemIcon(fee);
              const isBf = isBreakfastFeeItem(fee);

              return (
                <div
                  key={fee.id}
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                    isBf
                      ? 'bg-amber-50/40 border-amber-200'
                      : 'bg-slate-50/60 border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 shadow-2xs">
                      <FontAwesomeIcon icon={icon} className="text-sm" />
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-slate-800">
                          {fee.name}
                        </span>

                        {fee.exportElectronicInvoice && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-2xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
                            <FontAwesomeIcon icon={faCheckCircle} className="text-2xs" />
                            <span>Xuất HĐĐT</span>
                          </span>
                        )}
                      </div>

                      {isBf && (
                        <span className="text-2xs text-amber-700 font-medium block">
                          Khoản phí ăn sáng
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-semibold text-sm text-slate-900 block font-mono">
                      {formatCurrencyVND(fee.amount)} {fee.unitDisplay || formatFeeUnitDisplay(fee.unit)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Business Rule Insight Banner: Breakfast Fee & Meal Refund Interaction */}
          <div
            className={`p-3.5 rounded-xl border flex items-start gap-3 text-xs leading-relaxed ${
              refundEvaluation.status === 'eligible'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : refundEvaluation.status === 'school_disabled'
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {refundEvaluation.status === 'eligible' ? (
                <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-600 text-sm" />
              ) : refundEvaluation.status === 'school_disabled' ? (
                <FontAwesomeIcon icon={faExclamationTriangle} className="text-amber-600 text-sm" />
              ) : (
                <FontAwesomeIcon icon={faInfoCircle} className="text-slate-400 text-sm" />
              )}
            </div>

            <div className="space-y-0.5">
              <span className="font-bold block">
                Liên kết cơ chế Hoàn tiền ăn (Cấu hình &gt; Học phí):
              </span>
              <p>{refundEvaluation.reason}</p>
            </div>
          </div>
        </div>
      )}

      {/* Edit Student Fee Pop-up Modal */}
      <EditStudentFeeModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        student={student}
        currentFees={feeItems}
      />
    </div>
  );
};
