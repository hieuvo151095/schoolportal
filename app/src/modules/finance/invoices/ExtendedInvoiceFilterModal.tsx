/**
 * Extended Invoice Filter Modal Component (BR11)
 * Multi-criteria filter drawer for financial status, payment methods,
 * deductions/refunds, electronic invoice export, and grade levels.
 * Governance: Marcus Fleet V34 / Constitution V1.0.0
 * Reference: docs_legacy/operating-portal/tai-chinh/hoc-phi.md (BR11)
 */

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faFilter, faRotateLeft, faCheck } from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  setFilterModalOpen,
  setFilterCriteria,
  resetFilterCriteria,
} from '../../../store/slices/invoiceSlice';
import { InvoiceLifecycleStatus, PaymentMethod } from '../../../types/invoice';

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faFilter} className="text-[#0070CE]" />
            <h3 className="font-bold text-slate-900 text-base">Lọc mở rộng học phí</h3>
          </div>
          <button
            onClick={() => dispatch(setFilterModalOpen(false))}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4 text-xs">
          {/* Status Selection (7 options including All) */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Trạng thái hóa đơn
            </label>
            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as InvoiceLifecycleStatus | 'tat_ca')
              }
              className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800"
            >
              <option value="tat_ca">Tất cả trạng thái</option>
              <option value="da_tao">Đã tạo (Bản nháp)</option>
              <option value="da_gui">Đã gửi phụ huynh</option>
              <option value="da_thanh_toan">Đã thanh toán đủ</option>
              <option value="thanh_toan_mot_phan">Thanh toán một phần</option>
              <option value="qua_han">Quá hạn thanh toán</option>
              <option value="da_huy">Đã hủy</option>
            </select>
          </div>

          {/* Conditional Subfield: Payment Method (only when status = da_thanh_toan per BR11) */}
          {status === 'da_thanh_toan' && (
            <div className="bg-blue-50/60 p-3 rounded-xl border border-blue-100 space-y-1">
              <label className="block font-bold text-[#0070CE] mb-1">
                Phương thức thanh toán đã dùng (BR11)
              </label>
              <select
                value={paymentMethod}
                onChange={(e) =>
                  setPaymentMethod(e.target.value as PaymentMethod | 'tat_ca')
                }
                className="w-full h-9 px-3 bg-white border border-blue-200 rounded-lg text-xs text-slate-800"
              >
                <option value="tat_ca">Tất cả phương thức</option>
                <option value="chuyen_khoan">Chuyển khoản VietQR</option>
                <option value="cong_sepay">Cổng thanh toán điện tử (Sepay)</option>
                <option value="tien_mat">Tiền mặt</option>
                <option value="the_pos">Thẻ POS</option>
              </select>
            </div>
          )}

          {/* Grade Level Selection */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Khối lớp</label>
            <select
              value={gradeLevel}
              onChange={(e) => setGradeLevel(e.target.value)}
              className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800"
            >
              <option value="tat_ca">Tất cả khối lớp</option>
              <option value="Khối 6">Khối 6</option>
              <option value="Khối 7">Khối 7</option>
              <option value="Khối 12">Khối 12</option>
              <option value="Mầm non">Mầm non</option>
            </select>
          </div>

          {/* Toggle: Has Deduction / Refund */}
          <div className="pt-2 border-t border-slate-200 space-y-3">
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
                  className={`px-2.5 py-1 rounded text-xs font-semibold border ${
                    hasDeduction === true
                      ? 'bg-blue-50 border-[#0070CE] text-[#0070CE]'
                      : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  Có
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setHasDeduction(hasDeduction === false ? null : false)
                  }
                  className={`px-2.5 py-1 rounded text-xs font-semibold border ${
                    hasDeduction === false
                      ? 'bg-blue-50 border-[#0070CE] text-[#0070CE]'
                      : 'bg-white border-slate-200 text-slate-600'
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
                  className={`px-2.5 py-1 rounded text-xs font-semibold border ${
                    hasElectronicInvoice === true
                      ? 'bg-blue-50 border-[#0070CE] text-[#0070CE]'
                      : 'bg-white border-slate-200 text-slate-600'
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
                  className={`px-2.5 py-1 rounded text-xs font-semibold border ${
                    hasElectronicInvoice === false
                      ? 'bg-blue-50 border-[#0070CE] text-[#0070CE]'
                      : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  Không
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={handleReset}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1.5"
            >
              <FontAwesomeIcon icon={faRotateLeft} />
              <span>Đặt lại</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => dispatch(setFilterModalOpen(false))}
                className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 bg-white hover:bg-slate-50"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={handleApply}
                className="px-5 py-2 bg-[#0070CE] hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-sm flex items-center gap-1.5"
              >
                <FontAwesomeIcon icon={faCheck} />
                <span>Áp dụng</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
