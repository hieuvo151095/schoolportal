import React, { useState, useMemo, useEffect } from 'react';
import { SlideOver, Icon, Button, SearchField } from '@/components/ds';
import { useAppSelector } from '@/store';
import { INITIAL_SCHOOL_FEES } from '@/services/mockSchoolFeeData';
import { formatCurrencyVND } from '@/utils/settingFeeValidation';
import type { FeeItem } from '@/types/schoolFee';

interface AddRefundableFeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddFees?: (fees: FeeItem[]) => void;
  onSelectFee?: (fee: FeeItem) => void;
  alreadyAddedFeeIds: string[];
}

export const AddRefundableFeeModal: React.FC<AddRefundableFeeModalProps> = ({
  isOpen,
  onClose,
  onAddFees,
  onSelectFee,
  alreadyAddedFeeIds,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFeeIds, setSelectedFeeIds] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
      setSelectedFeeIds([]);
    }
  }, [isOpen]);

  const storeFees = useAppSelector((state) => state.schoolFee?.items) || [];
  const allFees = storeFees.length > 0 ? storeFees : INITIAL_SCHOOL_FEES;

  const availableDailyFees = useMemo(() => {
    return allFees.filter((fee) => {
      const unit = (fee.unit || '').trim().toLowerCase();
      const isDailyUnit = unit === 'ngay' || unit === 'ngày';
      if (!isDailyUnit) return false;

      const isAlreadyAdded =
        alreadyAddedFeeIds.includes(fee.id) ||
        fee.code === 'TIEN_AN' ||
        alreadyAddedFeeIds.includes(fee.code);

      return !isAlreadyAdded;
    });
  }, [allFees, alreadyAddedFeeIds]);

  const filteredFees = useMemo(() => {
    if (!searchTerm.trim()) return availableDailyFees;
    const term = searchTerm.toLowerCase();
    return availableDailyFees.filter(
      (fee) =>
        fee.name.toLowerCase().includes(term) ||
        fee.code.toLowerCase().includes(term)
    );
  }, [availableDailyFees, searchTerm]);

  const handleToggleFee = (feeId: string) => {
    setSelectedFeeIds((prev) =>
      prev.includes(feeId) ? prev.filter((id) => id !== feeId) : [...prev, feeId]
    );
  };

  const handleConfirmAdd = () => {
    if (selectedFeeIds.length === 0) return;
    const selectedFees = availableDailyFees.filter((fee) =>
      selectedFeeIds.includes(fee.id)
    );
    if (onAddFees) {
      onAddFees(selectedFees);
    } else if (onSelectFee && selectedFees.length > 0) {
      onSelectFee(selectedFees[0]);
    }
    onClose();
  };

  return (
    <SlideOver
      open={isOpen}
      onClose={onClose}
      title="Thêm khoản phí hoàn tiền"
      description="Chỉ hiển thị các khoản phí có đơn vị tính theo Ngày"
      icon="calendar-days"
      width={600}
      primaryAction={{
        label: selectedFeeIds.length > 0 ? `Thêm ${selectedFeeIds.length} khoản phí` : 'Thêm khoản phí',
        icon: 'plus',
        disabled: selectedFeeIds.length === 0,
        onClick: handleConfirmAdd,
      }}
      secondaryAction={{
        label: 'Đóng',
        onClick: onClose,
      }}
    >
      <div className="space-y-4 py-2">
        {/* Search */}
        <SearchField
          value={searchTerm}
          onChange={(val) => setSearchTerm(val)}
          placeholder="Tìm khoản phí theo tên hoặc mã phí..."
        />

        {/* Fee items list */}
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
          <div className="divide-y divide-slate-100 max-h-[420px] overflow-y-auto">
            {filteredFees.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                Không tìm thấy khoản phí theo ngày phù hợp
              </div>
            ) : (
              filteredFees.map((fee) => {
                const isSelected = selectedFeeIds.includes(fee.id);
                return (
                  <div
                    key={fee.id}
                    onClick={() => handleToggleFee(fee.id)}
                    className={`p-3.5 flex items-center justify-between cursor-pointer transition-colors ${
                      isSelected ? 'bg-blue-50/60' : 'hover:bg-slate-50/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="w-4 h-4 rounded text-[#0070CE] focus:ring-[#0070CE]"
                      />
                      <div>
                        <div className="font-bold text-xs text-slate-800">{fee.name}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Mã: <span className="font-mono">{fee.code}</span> • Đơn giá:{' '}
                          <span className="font-semibold text-slate-700">
                            {formatCurrencyVND(fee.defaultAmount || 0)}
                          </span>{' '}
                          / ngày
                        </div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                      Tính theo ngày
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </SlideOver>
  );
};

export default AddRefundableFeeModal;
