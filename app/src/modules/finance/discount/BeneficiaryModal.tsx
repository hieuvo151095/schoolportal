/**
 * Beneficiary Inspector Modal for Discount Policies
 * Finance Domain - Finviet / SOHA School Operating Portal
 * Design System: [DS] ECO ME DASHBOARD v1.1.0 (PopupModal)
 */

import React from 'react';
import { DiscountPolicy } from '../../../types/discount';
import { formatCurrency, formatDiscountValue } from '../../../utils/discountValidation';
import { SlideOver, Icon } from '@/components/ds';

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
    <SlideOver
      open={isOpen}
      onClose={onClose}
      title="Danh sách thụ hưởng"
      description={policy.name}
      icon="users"
      width={520}
      primaryAction={{
        label: 'Đóng',
        onClick: onClose,
      }}
      secondaryAction={null}
    >
      <div className="space-y-3">
        {/* Policy Summary Card */}
        <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-500">Khoản phí:</span>{' '}
            <strong className="text-slate-700">{policy.feeItemName}</strong>
          </div>
          <div className="flex items-center gap-1.5 font-bold text-[#0070CE]">
            <Icon name={policy.discountType === 'percent' ? 'percent' : 'tag'} size={12} />
            <span>
              {formatDiscountValue(policy.discountType, policy.discountValue)}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="max-h-[50vh] overflow-y-auto divide-y divide-slate-100">
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
                      <Icon name="graduation-cap" size={13} className="text-[#0070CE]" />
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
                      <div className="text-[11px] text-slate-400 font-mono">
                        {tgt.targetId}
                      </div>
                    </div>
                    {tgt.targetClass && (
                      <span className="text-[11px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full font-medium">
                        {tgt.targetClass}
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-400 py-4 text-center">Chưa có học sinh nào</div>
              )}
            </div>
          )}
        </div>
      </div>
    </SlideOver>
  );
};
