import React, { useState, useEffect } from 'react';
import { Icon, SlideOver } from '@/components/ds';
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

  useEffect(() => {
    setUseFileOnly(filters.useFileOnly);
    setStatus(filters.status);
    setSelectedMonth(filters.selectedMonth || '');
  }, [filters, isOpen]);

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
    <SlideOver
      open={isOpen}
      onClose={onClose}
      title="Bộ lọc mở rộng thực đơn"
      description="Lọc chi tiết danh sách thực đơn theo thời gian, hình thức biên soạn và trạng thái"
      icon="filter"
      width={460}
      primaryAction={{
        label: 'Áp dụng bộ lọc',
        icon: 'check',
        onClick: handleApply,
      }}
      secondaryAction={{
        label: 'Thiết lập lại',
        onClick: handleReset,
      }}
    >
      <div className="space-y-6">
        {/* Thời gian / Tháng */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Icon name="calendar" size={14} className="text-[#0070CE]" />
            <span>Thời gian (Tháng)</span>
          </label>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#0070CE] text-slate-800 bg-white"
          />
        </div>

        {/* Sử dụng file (BR04, BR05) */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Icon name="file" size={14} className="text-[#0070CE]" />
            <span>Hình thức nội dung</span>
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
                className={`px-3 py-2.5 text-xs font-medium rounded-xl border transition-all ${
                  useFileOnly === opt.id
                    ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-2xs font-semibold ring-1 ring-blue-500/20'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Trạng thái */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Icon name="tag" size={14} className="text-[#0070CE]" />
            <span>Trạng thái xuất bản</span>
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
                className={`px-3 py-2.5 text-xs font-medium rounded-xl border transition-all ${
                  status === opt.id
                    ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-2xs font-semibold ring-1 ring-blue-500/20'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </SlideOver>
  );
};
