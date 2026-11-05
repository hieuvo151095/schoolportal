import React, { useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faXmark,
  faUserSlash,
  faHandHoldingDollar,
  faNoteSticky,
  faCircleCheck,
} from '@fortawesome/free-solid-svg-icons';
import { AttendanceStatus } from '@/types/attendance';

interface BulkAbsentModalProps {
  isOpen: boolean;
  selectedCount: number;
  onClose: () => void;
  onSubmit: (params: {
    absentType: 'excused_absent' | 'unexcused_absent';
    refundEligible: boolean;
    notes?: string;
  }) => void;
}

const ModalOverlay = styled.div`
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(4px);
`;

export const BulkAbsentModal: React.FC<BulkAbsentModalProps> = ({
  isOpen,
  selectedCount,
  onClose,
  onSubmit,
}) => {
  const [absentType, setAbsentType] = useState<'excused_absent' | 'unexcused_absent'>('excused_absent');
  const [refundEligible, setRefundEligible] = useState<boolean>(true);
  const [notes, setNotes] = useState<string>('');

  if (!isOpen) return null;

  const handleTypeChange = (type: 'excused_absent' | 'unexcused_absent') => {
    setAbsentType(type);
    // Suggest refund when excused, no refund when unexcused
    if (type === 'excused_absent') {
      setRefundEligible(true);
    } else {
      setRefundEligible(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      absentType,
      refundEligible,
      notes: notes.trim() || undefined,
    });
  };

  return (
    <ModalOverlay className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-600 to-rose-700 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
              <FontAwesomeIcon icon={faUserSlash} className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg leading-tight">
                Báo Vắng Học Sinh
              </h3>
              <p className="text-xs text-rose-100">
                Cập nhật trạng thái vắng cho {selectedCount} học sinh đã chọn
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors"
          >
            <FontAwesomeIcon icon={faXmark} className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Absence Type Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Phân loại vắng mặt
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label
                onClick={() => handleTypeChange('excused_absent')}
                className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                  absentType === 'excused_absent'
                    ? 'border-amber-500 bg-amber-50 text-amber-900 font-bold shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <span className="text-sm">Nghỉ có phép</span>
                <span className="text-[11px] text-slate-500 mt-0.5">Phụ huynh báo trước</span>
              </label>

              <label
                onClick={() => handleTypeChange('unexcused_absent')}
                className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                  absentType === 'unexcused_absent'
                    ? 'border-rose-500 bg-rose-50 text-rose-900 font-bold shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <span className="text-sm">Nghỉ không phép</span>
                <span className="text-[11px] text-slate-500 mt-0.5">Không có thông báo</span>
              </label>
            </div>
          </div>

          {/* Refund Eligible Toggle (BR04b) */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={refundEligible}
                onChange={(e) => setRefundEligible(e.target.checked)}
                className="w-4 h-4 mt-0.5 text-[#0070CE] rounded focus:ring-[#0070CE]"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <FontAwesomeIcon icon={faHandHoldingDollar} className="text-emerald-600" />
                  Được hoàn tiền ăn và dịch vụ trong ngày
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Hệ thống tài chính sẽ tự động cấn trừ hoàn phí bán trú/bữa ăn khi xuất hóa đơn tháng kế tiếp.
                </p>
              </div>
            </label>
          </div>

          {/* Reason / Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <FontAwesomeIcon icon={faNoteSticky} className="text-slate-500" />
              Lý do xin nghỉ / Ghi chú
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Nhập lý do vắng (ví dụ: Bé bị cảm sốt, gia đình có việc riêng...)"
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Đóng
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition-all shadow-xs"
            >
              Xác nhận báo vắng
            </button>
          </div>
        </form>
      </div>
    </ModalOverlay>
  );
};

export default BulkAbsentModal;
