/**
 * Modal to select a specific discount policy for an invoice line item
 * Allows switching between candidate discount programs when a student qualifies for multiple policies.
 * Governance: Marcus Fleet V34 / Constitution V1.0.0
 */

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faPercent,
  faCheckCircle,
  faStar,
  faTag,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import type { StudentCandidateDiscountOption } from '../../../utils/discountValidation';
import { formatVND } from '../../../utils/invoiceValidation';

interface SelectDiscountProgramModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemName: string;
  itemGrossAmount: number;
  studentName: string;
  className: string;
  options: StudentCandidateDiscountOption[];
  currentSelectedPolicyId: string | 'none';
  onConfirm: (
    policyId: string | 'none',
    percent: number,
    policyName?: string,
    discountType?: 'percent' | 'fixed_amount',
    amount?: number
  ) => void;
}

export const SelectDiscountProgramModal: React.FC<SelectDiscountProgramModalProps> = ({
  isOpen,
  onClose,
  itemName,
  itemGrossAmount,
  studentName,
  className,
  options,
  currentSelectedPolicyId,
  onConfirm,
}) => {
  const [selectedId, setSelectedId] = useState<string | 'none'>(currentSelectedPolicyId);

  useEffect(() => {
    setSelectedId(currentSelectedPolicyId);
  }, [currentSelectedPolicyId, isOpen]);

  if (!isOpen) return null;

  const handleApply = () => {
    if (selectedId === 'none') {
      onConfirm('none', 0, undefined, 'percent', 0);
    } else {
      const chosen = options.find((o) => o.policy.id === selectedId);
      if (chosen) {
        onConfirm(
          chosen.policy.id,
          chosen.discountPercentEquivalent,
          chosen.policy.name,
          chosen.policy.discountType,
          chosen.deductionAmount
        );
      } else if (options.length > 0) {
        onConfirm(
          options[0].policy.id,
          options[0].discountPercentEquivalent,
          options[0].policy.name,
          options[0].policy.discountType,
          options[0].deductionAmount
        );
      }
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#0070CE] flex items-center justify-center font-bold text-sm">
              <FontAwesomeIcon icon={faPercent} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Chọn chương trình miễn giảm
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Khoản thu: <span className="font-semibold text-slate-700">{itemName}</span> • Học sinh:{' '}
                <span className="font-semibold text-slate-700">{studentName} ({className})</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} className="text-base" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Info callout */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-blue-900">
            <FontAwesomeIcon icon={faInfoCircle} className="text-[#0070CE] mt-0.5 shrink-0" />
            <div>
              Học sinh <span className="font-bold">{studentName}</span> có{' '}
              <span className="font-bold">{options.length} chương trình</span> miễn giảm hợp lệ cho khoản{' '}
              <span className="font-semibold">{itemName}</span> (nguyên giá:{' '}
              <span className="font-bold">{formatVND(itemGrossAmount)}</span>). Mặc định hệ thống tự động chọn mức ưu đãi cao nhất. Bạn có thể bấm chọn chương trình khác nếu muốn:
            </div>
          </div>

          {/* Program Options */}
          <div className="space-y-2.5">
            {options.map((opt) => {
              const isSelected = selectedId === opt.policy.id;
              const netAmount = Math.max(0, itemGrossAmount - opt.deductionAmount);

              return (
                <div
                  key={opt.policy.id}
                  onClick={() => setSelectedId(opt.policy.id)}
                  className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-[#0070CE] bg-blue-50/50 shadow-xs ring-1 ring-[#0070CE]/20'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="pt-0.5">
                        <input
                          type="radio"
                          name="discountPolicy"
                          checked={isSelected}
                          onChange={() => setSelectedId(opt.policy.id)}
                          className="w-4 h-4 text-[#0070CE] border-slate-300 focus:ring-[#0070CE]"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-slate-900">
                            {opt.policy.name}
                          </span>
                          <span className="text-[11px] font-medium text-slate-500 font-mono">
                            ({opt.policy.code})
                          </span>
                          {opt.isHighest && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                              <FontAwesomeIcon icon={faStar} className="text-[9px] text-amber-600" />
                              <span>Mức cao nhất (Mặc định)</span>
                            </span>
                          )}
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-600">
                            {opt.policy.scopeType === 'student' ? 'Cá nhân học sinh' : `Theo lớp ${className}`}
                          </span>
                        </div>

                        {opt.policy.reason && (
                          <p className="text-[11px] text-slate-500 mt-1 italic">
                            Lý do: {opt.policy.reason}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-bold text-emerald-600">
                        {opt.policy.discountType === 'fixed_amount'
                          ? `Giảm ${formatVND(opt.deductionAmount)}`
                          : `Giảm ${opt.discountPercentEquivalent}% (-${formatVND(opt.deductionAmount)})`}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 font-medium">
                        Còn lại: <span className="font-bold text-slate-900">{formatVND(netAmount)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Option to waive/disable discount */}
            <div
              onClick={() => setSelectedId('none')}
              className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                selectedId === 'none'
                  ? 'border-[#0070CE] bg-blue-50/50 shadow-xs ring-1 ring-[#0070CE]/20'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="discountPolicy"
                    checked={selectedId === 'none'}
                    onChange={() => setSelectedId('none')}
                    className="w-4 h-4 text-[#0070CE] border-slate-300 focus:ring-[#0070CE]"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-700">
                      Không áp dụng miễn giảm cho dòng này (0%)
                    </span>
                    <p className="text-[11px] text-slate-500">
                      Thu đủ 100% nguyên giá ({formatVND(itemGrossAmount)})
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-700">
                  {formatVND(itemGrossAmount)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-2.5 bg-slate-50/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="px-5 py-2 bg-[#0070CE] hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
          >
            Xác nhận áp dụng
          </button>
        </div>
      </div>
    </div>
  );
};
