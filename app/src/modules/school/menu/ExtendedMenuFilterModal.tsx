import React, { useState } from 'react';
import { Icon } from '../../../components/ds';
import { MenuFilterState } from '../../../types/menu';

interface ExtendedMenuFilterModalProps {
  isOpen: boolean;
  filters: MenuFilterState;
  onClose: () => void;
  onApply: (filters: Partial<MenuFilterState>) => void;
  onReset: () => void;
}

export const ExtendedMenuFilterModal: React.FC<ExtendedMenuFilterModalProps> = ({
  isOpen,
  filters,
  onClose,
  onApply,
  onReset,
}) => {
  const [useFileOnly, setUseFileOnly] = useState<'all' | 'file_only' | 'grid_only'>(
    filters.useFileOnly
  );
  const [status, setStatus] = useState<'all' | 'draft' | 'published'>(filters.status);
  const [selectedMonth, setSelectedMonth] = useState<string>(filters.selectedMonth || '');

  if (!isOpen) return null;

  const handleApply = () => {
    onApply({
      useFileOnly,
      status,
      selectedMonth: selectedMonth || undefined,
    });
    onClose();
  };

  const handleReset = () => {
    setUseFileOnly('all');
    setStatus('all');
    setSelectedMonth('');
    onReset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/10 flex items-center justify-center text-blue-600">
              <Icon name="filter" className="w-4 h-4 text-blue-600" />
            </div>
            <h3 className="text-base font-semibold text-gray-900">Lọc mở rộng thực đơn</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-white/60 transition-colors"
          >
            <Icon name="xmark" className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Thời gian / Tháng */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Icon name="calendar" className="w-3.5 h-3.5 text-blue-600" />
              Thời gian (Tháng)
            </label>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-gray-800"
            />
          </div>

          {/* Sử dụng file (BR04, BR05) */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Icon name="file" className="w-3.5 h-3.5 text-blue-600" />
              Hình thức nội dung (Sử dụng file)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'all', label: 'Tất cả' },
                { id: 'grid_only', label: 'Dạng lưới' },
                { id: 'file_only', label: 'Dạng file (Bật)' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setUseFileOnly(opt.id as any)}
                  className={`px-3 py-2 text-xs font-medium rounded-xl border transition-all ${
                    useFileOnly === opt.id
                      ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm font-semibold'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Trạng thái */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Trạng thái xuất bản
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'all', label: 'Tất cả' },
                { id: 'published', label: 'Đã xuất bản' },
                { id: 'draft', label: 'Bản nháp' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setStatus(opt.id as any)}
                  className={`px-3 py-2 text-xs font-medium rounded-xl border transition-all ${
                    status === opt.id
                      ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm font-semibold'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-medium text-gray-500 hover:text-gray-800 transition-colors"
          >
            Thiết lập lại
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-sm shadow-blue-500/20 transition-all"
            >
              Áp dụng lọc
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
