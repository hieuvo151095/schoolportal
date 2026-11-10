/**
 * Extended Invoice Filter Modal Component (BR11)
 * Multi-criteria filter drawer for financial status, payment methods,
 * deductions/refunds, electronic invoice export, and grade levels.
 * Governance: Marcus Fleet V34 / Constitution V1.0.0
 * Design System: [DS] ECO ME DASHBOARD v1.1.0 (SlideOver + Dropdown)
 * Reference: docs_legacy/operating-portal/tai-chinh/hoc-phi.md (BR11)
 */

import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  setFilterModalOpen,
  setFilterCriteria,
  resetFilterCriteria,
} from '../../../store/slices/invoiceSlice';
import { InvoiceLifecycleStatus, PaymentMethod } from '../../../types/invoice';
import { SlideOver, Dropdown, DropdownOption } from '@/components/ds';

export const ExtendedInvoiceFilterModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isFilterModalOpen, filterCriteria } = useAppSelector(
    (state) => state.invoice
  );

  // Local state for draft edits before applying
  const [status, setStatus] = useState<InvoiceLifecycleStatus | 'tat_ca'>(
    filterCriteria.status
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | 'tat_ca'>(
    filterCriteria.paymentMethod
  );
  const [gradeLevel, setGradeLevel] = useState<string>(filterCriteria.gradeLevel);
  const [hasDeduction, setHasDeduction] = useState<boolean | null>(
    filterCriteria.hasDeduction
  );
  const [hasElectronicInvoice, setHasElectronicInvoice] = useState<boolean | null>(
    filterCriteria.hasElectronicInvoice
  );

  useEffect(() => {
    if (isFilterModalOpen) {
      setStatus(filterCriteria.status);
      setPaymentMethod(filterCriteria.paymentMethod);
      setGradeLevel(filterCriteria.gradeLevel);
      setHasDeduction(filterCriteria.hasDeduction);
      setHasElectronicInvoice(filterCriteria.hasElectronicInvoice);
    }
  }, [isFilterModalOpen, filterCriteria]);

  if (!isFilterModalOpen) {
    return null;
  }

  const handleApply = () => {
    dispatch(
      setFilterCriteria({
        status,
        paymentMethod: status === 'da_thanh_toan' ? paymentMethod : 'tat_ca',
        gradeLevel,
        hasDeduction,
        hasElectronicInvoice,
      })
    );
    dispatch(setFilterModalOpen(false));
  };

  const handleReset = () => {
    setStatus('tat_ca');
    setPaymentMethod('tat_ca');
    setGradeLevel('tat_ca');
    setHasDeduction(null);
    setHasElectronicInvoice(null);
    dispatch(resetFilterCriteria());
    dispatch(setFilterModalOpen(false));
  };

  const statusOptions: DropdownOption<InvoiceLifecycleStatus | 'tat_ca'>[] = [
    { value: 'tat_ca', label: 'Tất cả trạng thái' },
    { value: 'da_tao', label: 'Đã tạo (Bản nháp)' },
    { value: 'da_gui', label: 'Đã gửi phụ huynh' },
    { value: 'da_thanh_toan', label: 'Đã thanh toán đủ' },
    { value: 'thanh_toan_mot_phan', label: 'Thanh toán một phần' },
    { value: 'qua_han', label: 'Quá hạn thanh toán' },
    { value: 'da_huy', label: 'Đã hủy' },
  ];

  const paymentOptions: DropdownOption<PaymentMethod | 'tat_ca'>[] = [
    { value: 'tat_ca', label: 'Tất cả phương thức' },
    { value: 'chuyen_khoan', label: 'Chuyển khoản VietQR' },
    { value: 'cong_sepay', label: 'Cổng thanh toán điện tử (Sepay)' },
    { value: 'tien_mat', label: 'Tiền mặt' },
    { value: 'the_pos', label: 'Thẻ POS' },
  ];

  const gradeOptions: DropdownOption<string>[] = [
    { value: 'tat_ca', label: 'Tất cả khối lớp' },
    { value: 'Khối 6', label: 'Khối 6' },
    { value: 'Khối 7', label: 'Khối 7' },
    { value: 'Khối 12', label: 'Khối 12' },
    { value: 'Mầm non', label: 'Mầm non' },
  ];

  return (
    <SlideOver
      open={isFilterModalOpen}
      onClose={() => dispatch(setFilterModalOpen(false))}
      title="Bộ lọc nâng cao học phí"
      description="Lọc danh sách hóa đơn theo trạng thái, hình thức thanh toán, khối lớp và giảm trừ"
      icon="filter"
      width={460}
      primaryAction={{
        label: 'Áp dụng bộ lọc',
        icon: 'check',
        onClick: handleApply,
      }}
      secondaryAction={{
        label: 'Đặt lại',
        onClick: handleReset,
      }}
    >
      <div className="space-y-4 text-xs">
        {/* Status Selection */}
        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Trạng thái hóa đơn
          </label>
          <Dropdown
            value={status}
            onChange={(val) => setStatus(val)}
            options={statusOptions}
            fullWidth
          />
        </div>

        {/* Conditional Subfield: Payment Method */}
        {status === 'da_thanh_toan' && (
          <div className="bg-blue-50/60 p-3 rounded-xl border border-blue-100 space-y-1">
            <label className="block font-bold text-[#0070CE] mb-1">
              Phương thức thanh toán đã dùng (BR11)
            </label>
            <Dropdown
              value={paymentMethod}
              onChange={(val) => setPaymentMethod(val)}
              options={paymentOptions}
              fullWidth
            />
          </div>
        )}

        {/* Grade Level Selection */}
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Khối lớp</label>
          <Dropdown
            value={gradeLevel}
            onChange={(val) => setGradeLevel(val)}
            options={gradeOptions}
            fullWidth
          />
        </div>

        {/* Toggle: Has Deduction / Refund */}
        <div className="pt-3 border-t border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-700">
              Hóa đơn có hoàn phí / giảm trừ
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setHasDeduction(hasDeduction === true ? null : true)
                }
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                  hasDeduction === true
                    ? 'bg-blue-50 border-[#0070CE] text-[#0070CE]'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                Có
              </button>
              <button
                type="button"
                onClick={() =>
                  setHasDeduction(hasDeduction === false ? null : false)
                }
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                  hasDeduction === false
                    ? 'bg-blue-50 border-[#0070CE] text-[#0070CE]'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                Không
              </button>
            </div>
          </div>

          {/* Toggle: Electronic Invoice */}
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-700">
              Xuất hóa đơn điện tử (HĐĐT)
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setHasElectronicInvoice(
                    hasElectronicInvoice === true ? null : true
                  )
                }
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                  hasElectronicInvoice === true
                    ? 'bg-blue-50 border-[#0070CE] text-[#0070CE]'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                Có
              </button>
              <button
                type="button"
                onClick={() =>
                  setHasElectronicInvoice(
                    hasElectronicInvoice === false ? null : false
                  )
                }
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                  hasElectronicInvoice === false
                    ? 'bg-blue-50 border-[#0070CE] text-[#0070CE]'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                Không
              </button>
            </div>
          </div>
        </div>
      </div>
    </SlideOver>
  );
};
