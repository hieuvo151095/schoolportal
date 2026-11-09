import React, { useState } from 'react';
import { SlideOver, Icon } from '@/components/ds';

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

export const BulkAbsentModal: React.FC<BulkAbsentModalProps> = ({
  isOpen,
  selectedCount,
  onClose,
  onSubmit,
}) => {
  const [absentType, setAbsentType] = useState<'excused_absent' | 'unexcused_absent'>('excused_absent');
  const [refundEligible, setRefundEligible] = useState<boolean>(true);
  const [notes, setNotes] = useState<string>('');

  const handleTypeChange = (type: 'excused_absent' | 'unexcused_absent') => {
    setAbsentType(type);
    if (type === 'excused_absent') {
      setRefundEligible(true);
    } else {
      setRefundEligible(false);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onSubmit({
      absentType,
      refundEligible,
      notes: notes.trim() || undefined,
    });
  };

  return (
    <SlideOver
      open={isOpen}
      onClose={onClose}
      icon="user"
      title="Báo Vắng Học Sinh"
      description={
        selectedCount > 1
          ? `Cập nhật trạng thái vắng cho ${selectedCount} học sinh đã chọn`
          : 'Cập nhật trạng thái báo vắng cho học sinh'
      }
      width={480}
      primaryAction={{
        label: 'Xác nhận báo vắng',
        icon: 'check',
        disabled: selectedCount === 0,
        onClick: () => handleSubmit(),
      }}
      secondaryAction={{
        label: 'Hủy',
        onClick: onClose,
      }}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Absence Type Selection */}
        <div>
          <label className="block text-xs font-semibold text-[var(--text-heading)] mb-2">
            Phân loại vắng mặt <span className="text-[var(--text-danger)]">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div
              onClick={() => handleTypeChange('excused_absent')}
              className={`p-3 rounded-[var(--radius-8)] border-2 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                absentType === 'excused_absent'
                  ? 'border-amber-500 bg-amber-50/70 text-amber-900 font-bold shadow-xs'
                  : 'border-[var(--border-default)] hover:border-[var(--text-subtle)] text-[var(--text-body)] bg-[var(--bg-surface)]'
              }`}
            >
              <span className="text-sm font-bold">Nghỉ có phép</span>
              <span className="text-[11px] text-[var(--text-subtle)] mt-0.5">Phụ huynh báo trước</span>
            </div>

            <div
              onClick={() => handleTypeChange('unexcused_absent')}
              className={`p-3 rounded-[var(--radius-8)] border-2 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                absentType === 'unexcused_absent'
                  ? 'border-rose-500 bg-rose-50/70 text-rose-900 font-bold shadow-xs'
                  : 'border-[var(--border-default)] hover:border-[var(--text-subtle)] text-[var(--text-body)] bg-[var(--bg-surface)]'
              }`}
            >
              <span className="text-sm font-bold">Nghỉ không phép</span>
              <span className="text-[11px] text-[var(--text-subtle)] mt-0.5">Không có thông báo</span>
            </div>
          </div>
        </div>

        {/* Refund Eligible Toggle (BR04b) */}
        <div className="bg-[var(--bg-subtle)] border border-[var(--border-default)] rounded-[var(--radius-8)] p-3.5">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={refundEligible}
              onChange={(e) => setRefundEligible(e.target.checked)}
              className="w-4 h-4 mt-0.5 text-[var(--eco-blue-strong)] rounded border-[var(--border-default)] focus:ring-[var(--eco-blue-strong)]"
            />
            <div className="text-xs">
              <span className="font-bold text-[var(--text-heading)] flex items-center gap-1.5">
                <Icon name="check" size={12} className="text-emerald-600" />
                Được hoàn tiền ăn và dịch vụ trong ngày
              </span>
              <p className="text-[11px] text-[var(--text-subtle)] mt-0.5">
                Hệ thống tài chính sẽ tự động cấn trừ hoàn phí bán trú/bữa ăn khi xuất hóa đơn tháng kế tiếp.
              </p>
            </div>
          </label>
        </div>

        {/* Reason / Notes */}
        <div>
          <label className="block text-xs font-semibold text-[var(--text-heading)] mb-1">
            Lý do xin nghỉ / Ghi chú
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Nhập lý do vắng (ví dụ: Bé bị cảm sốt, gia đình có việc riêng...)"
            className="w-full px-3.5 py-2.5 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[var(--radius-8)] text-sm text-[var(--text-heading)] focus:outline-none focus:border-[var(--eco-blue-strong)] focus:ring-2 focus:ring-[var(--eco-blue-100,#dbeafe)] transition-all resize-none placeholder:text-[var(--text-disabled)]"
          />
          <p className="text-[11px] text-[var(--text-subtle)] mt-1">
            Ghi chú lưu vào sổ theo dõi điểm danh của lớp.
          </p>
        </div>
      </form>
    </SlideOver>
  );
};

export default BulkAbsentModal;
