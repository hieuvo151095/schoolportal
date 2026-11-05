/**
 * Beneficiary Inspector Modal for Discount Policies
 * Finance Domain - Finviet / SOHA School Operating Portal
 */

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faUsers,
  faGraduationCap,
  faPercent,
  faTag,
} from '@fortawesome/free-solid-svg-icons';
import { DiscountPolicy } from '../../../types/discount';
import { formatCurrency, formatDiscountValue } from '../../../utils/discountValidation';

interface BeneficiaryModalProps {
  policy: DiscountPolicy | null;
  isOpen: boolean;
  onClose: () => void;
}

export const BeneficiaryModal: React.FC<BeneficiaryModalProps> = ({
  policy,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !policy) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 animate-fadeIn">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0070CE] flex items-center justify-center">
              <FontAwesomeIcon icon={faUsers} className="text-base" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">Danh sách thụ hưởng</h2>
              <p className="text-xs text-slate-500 line-clamp-1">{policy.name}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Policy Summary Card */}
        <div className="p-4 bg-blue-50/50 border-b border-blue-100 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-500">Khoản phí:</span>{' '}
            <strong className="text-slate-700">{policy.feeItemName}</strong>
          </div>
          <div className="flex items-center gap-1.5 font-bold text-[#0070CE]">
            <FontAwesomeIcon icon={policy.discountType === 'percent' ? faPercent : faTag} />
            <span>
              {formatDiscountValue(policy.discountType, policy.discountValue)}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 max-h-[60vh] overflow-y-auto divide-y divide-slate-100">
          {policy.scopeType === 'class' ? (
            <div className="space-y-2">
              <div className="text-xs text-slate-500 font-semibold mb-2">
                Các lớp áp dụng chính sách ({policy.targets.length} lớp):
              </div>
              {policy.targets && policy.targets.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {policy.targets.map((tgt, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center gap-2 text-xs font-semibold text-slate-700"
                    >
                      <FontAwesomeIcon icon={faGraduationCap} className="text-[#0070CE]" />
                      <span>{tgt.targetName}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-slate-400 py-4 text-center">Chưa có lớp nào</div>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-xs text-slate-500 font-semibold mb-2">
                Các học sinh áp dụng chính sách ({policy.targets.length} học sinh):
              </div>
              {policy.targets && policy.targets.length > 0 ? (
                policy.targets.map((tgt, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-slate-800">{tgt.targetName}</div>
                      <div className="text-slate-400 text-[11px]">
                        Lớp: <span className="text-slate-600 font-medium">{tgt.targetClass || 'Chưa phân lớp'}</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-medium text-[11px]">
                      Thụ hưởng
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-400 py-4 text-center">Chưa có học sinh nào</div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-white bg-[#0070CE] hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
