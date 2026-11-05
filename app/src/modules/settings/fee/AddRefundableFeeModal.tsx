import React, { useState, useMemo, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faSearch,
  faPlus,
  faCalendarDay,
  faCheckCircle,
  faTag,
  faCheckSquare,
  faSquare
} from '@fortawesome/free-solid-svg-icons';
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
  alreadyAddedFeeIds
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFeeIds, setSelectedFeeIds] = useState<string[]>([]);

  // Reset state whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
      setSelectedFeeIds([]);
    }
  }, [isOpen]);

  // Sourced from Redux store fee catalog, with fallback to initial mock catalog
  const storeFees = useAppSelector((state) => state.schoolFee?.items) || [];
  const allFees = storeFees.length > 0 ? storeFees : INITIAL_SCHOOL_FEES;

  // Strict rule: Only fees with unit 'ngay' / 'ngày' can be added
  const availableDailyFees = useMemo(() => {
    return allFees.filter((fee) => {
      const unit = (fee.unit || '').trim().toLowerCase();
      const isDailyUnit = unit === 'ngay' || unit === 'ngày';
      if (!isDailyUnit) return false;

      // Exclude already added fees (including system Tiền ăn)
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
      (f) =>
        f.name.toLowerCase().includes(term) ||
        f.code.toLowerCase().includes(term) ||
        (f.description && f.description.toLowerCase().includes(term))
    );
  }, [availableDailyFees, searchTerm]);

  const isAllFilteredSelected =
    filteredFees.length > 0 &&
    filteredFees.every((fee) => selectedFeeIds.includes(fee.id));

  const handleToggleFee = (feeId: string) => {
    setSelectedFeeIds((prev) =>
      prev.includes(feeId) ? prev.filter((id) => id !== feeId) : [...prev, feeId]
    );
  };

  const handleToggleSelectAll = () => {
    if (isAllFilteredSelected) {
      // Unselect all filtered fees
      const filteredIds = new Set(filteredFees.map((f) => f.id));
      setSelectedFeeIds((prev) => prev.filter((id) => !filteredIds.has(id)));
    } else {
      // Select all filtered fees
      const newIds = new Set([...selectedFeeIds, ...filteredFees.map((f) => f.id)]);
      setSelectedFeeIds(Array.from(newIds));
    }
  };

  const handleConfirmAdd = () => {
    const selectedItems = availableDailyFees.filter((f) =>
      selectedFeeIds.includes(f.id)
    );
    if (selectedItems.length === 0) return;

    if (onAddFees) {
      onAddFees(selectedItems);
    } else if (onSelectFee) {
      selectedItems.forEach((item) => onSelectFee(item));
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-150 flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-50/70 via-slate-50 to-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0070CE] text-white flex items-center justify-center shadow-xs">
              <FontAwesomeIcon icon={faCalendarDay} className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                Thêm khoản phí áp dụng hoàn tiền
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Chỉ hiển thị các khoản phí có đơn vị tính theo{' '}
                <span className="font-bold text-[#0070CE] bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                  Ngày
                </span>{' '}
                • Cho phép chọn nhiều khoản phí cùng lúc
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
          </button>
        </div>

        {/* Search & Bulk Select Toolbar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="relative flex-1">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm theo tên khoản phí hoặc mã khoản phí..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0070CE] focus:border-transparent placeholder:text-slate-400"
              autoFocus
            />
          </div>

          {filteredFees.length > 0 && (
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={handleToggleSelectAll}
                className="px-3 py-1.5 text-xs font-semibold text-[#0070CE] hover:text-[#005bb5] bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <FontAwesomeIcon
                  icon={isAllFilteredSelected ? faCheckSquare : faSquare}
                  className="w-3.5 h-3.5"
                />
                <span>
                  {isAllFilteredSelected
                    ? 'Bỏ chọn tất cả'
                    : `Chọn tất cả (${filteredFees.length})`}
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Fee Items List with Checkboxes */}
        <div className="overflow-y-auto p-4 space-y-2.5 flex-1">
          {filteredFees.length > 0 ? (
            filteredFees.map((fee) => {
              const isSelected = selectedFeeIds.includes(fee.id);
              return (
                <div
                  key={fee.id}
                  onClick={() => handleToggleFee(fee.id)}
                  className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-4 cursor-pointer select-none ${
                    isSelected
                      ? 'border-[#0070CE] bg-blue-50/50 shadow-2xs ring-1 ring-[#0070CE]/30'
                      : 'border-slate-200 bg-white hover:border-blue-200 hover:bg-slate-50/60'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* Checkbox Icon */}
                    <div className="shrink-0 flex items-center justify-center">
                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'bg-[#0070CE] border-[#0070CE] text-white shadow-2xs'
                            : 'bg-white border-slate-300 text-transparent'
                        }`}
                      >
                        <svg
                          className="w-3.5 h-3.5 stroke-current stroke-2 fill-none"
                          viewBox="0 0 24 24"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    </div>

                    <div className="w-9 h-9 rounded-lg bg-blue-100 text-[#0070CE] flex items-center justify-center shrink-0 font-bold">
                      <FontAwesomeIcon icon={faTag} className="w-4 h-4" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-800 truncate">
                          {fee.name}
                        </span>
                        <span className="text-[10px] font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full border border-blue-200 shrink-0">
                          Đơn vị: Ngày
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-0.5">
                        <span>
                          Mã:{' '}
                          <code className="text-slate-600 font-mono text-[10px]">
                            {fee.code}
                          </code>
                        </span>
                        {fee.defaultAmount !== undefined && fee.defaultAmount > 0 && (
                          <span>
                            Đơn giá mặc định:{' '}
                            <strong className="text-slate-700 font-semibold">
                              {formatCurrencyVND(fee.defaultAmount)}/ngày
                            </strong>
                          </span>
                        )}
                      </div>
                      {fee.description && (
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          {fee.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-md transition-colors shrink-0 ${
                      isSelected
                        ? 'text-[#0070CE] bg-blue-100/70 font-bold'
                        : 'text-slate-400 bg-slate-100'
                    }`}
                  >
                    {isSelected ? 'Đã chọn' : 'Bấm để chọn'}
                  </span>
                </div>
              );
            })
          ) : (
            <div className="py-12 px-4 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <FontAwesomeIcon icon={faCheckCircle} className="w-6 h-6 text-slate-400" />
              </div>
              <h4 className="text-xs font-bold text-slate-700">
                {searchTerm
                  ? 'Không tìm thấy khoản phí phù hợp'
                  : 'Đã thêm tất cả các khoản phí có đơn vị Ngày'}
              </h4>
              <p className="text-[11px] text-slate-500 mt-1 max-w-sm mx-auto">
                {searchTerm
                  ? 'Thử tìm với từ khóa khác hoặc kiểm tra lại tên khoản phí trong danh mục.'
                  : 'Tất cả các khoản phí tính theo đơn vị Ngày trong danh mục đã được cấu hình trong cơ chế hoàn tiền.'}
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer with Multi-Select Confirm */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-600">
            {selectedFeeIds.length > 0 ? (
              <span>
                Đã chọn:{' '}
                <strong className="text-[#0070CE] font-bold">
                  {selectedFeeIds.length}
                </strong>{' '}
                khoản phí
              </span>
            ) : (
              <span className="text-slate-400 text-[11px]">
                Nhấp vào khoản phí để chọn một hoặc nhiều mục cần thêm.
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              Đóng
            </button>
            <button
              type="button"
              disabled={selectedFeeIds.length === 0}
              onClick={handleConfirmAdd}
              className="px-4 py-2 text-xs font-bold text-white bg-[#0070CE] hover:bg-[#005bb5] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <FontAwesomeIcon icon={faPlus} className="w-3 h-3" />
              <span>
                {selectedFeeIds.length > 0
                  ? `Thêm ${selectedFeeIds.length} khoản phí đã chọn`
                  : 'Thêm khoản phí'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
