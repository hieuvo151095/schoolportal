import React, { useState } from 'react';
import { Icon, Dropdown } from '../../../components/ds';
import { WeeklyMenu } from '../../../types/menu';
import { getWeekDates, formatMenuDateRange } from '../../../utils/menuValidation';

interface CloneMenuModalProps {
  isOpen: boolean;
  menu: WeeklyMenu | null;
  onClose: () => void;
  onConfirmClone: (targetWeekNumber: number, targetYear: number, startDate: string, endDate: string) => void;
}

export const CloneMenuModal: React.FC<CloneMenuModalProps> = ({
  isOpen,
  menu,
  onClose,
  onConfirmClone,
}) => {
  const currentWeek = menu ? menu.weekNumber + 1 : 39;
  const currentYear = menu ? menu.year : 2026;
  const [targetWeek, setTargetWeek] = useState<number>(currentWeek);
  const [targetYear, setTargetYear] = useState<number>(currentYear);

  if (!isOpen || !menu) return null;

  const dates = getWeekDates(targetWeek, targetYear);

  const handleConfirm = () => {
    onConfirmClone(targetWeek, targetYear, dates.startDate, dates.endDate);
    onClose();
  };

  const weekOptions = Array.from({ length: 12 }, (_, i) => menu.weekNumber + i + 1).map((w) => ({
    value: String(w),
    label: `Tuần ${w} (${formatMenuDateRange(getWeekDates(w, targetYear).startDate, getWeekDates(w, targetYear).endDate)})`,
  }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-amber-50 to-orange-50/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600">
              <Icon name="copy" className="w-4 h-4" />
            </div>
            <h3 className="text-base font-semibold text-gray-900">Sao chép thực đơn</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-white/60 transition-colors"
          >
            <Icon name="xmark" className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="text-sm text-gray-700">
            Bạn có muốn tạo bản sao thực đơn <span className="font-semibold text-gray-900">"{menu.title}"</span> không?
          </div>

          <div className="bg-amber-50/60 border border-amber-200/70 rounded-xl p-3.5 text-xs text-amber-800 leading-relaxed">
            Hệ thống sẽ sao chép toàn bộ danh sách món ăn và định lượng vào tuần mới ở trạng thái <strong>Bản nháp</strong>.
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Icon name="calendar-week" className="w-3.5 h-3.5 text-amber-600" />
              Chọn tuần đích áp dụng
            </label>
            <div className="w-full">
              <Dropdown
                value={String(targetWeek)}
                onChange={(val) => setTargetWeek(Number(val))}
                options={weekOptions}
                fullWidth
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-4 py-2 text-xs font-semibold text-white bg-amber-500 hover:bg-amber-600 rounded-xl shadow-sm transition-all"
          >
            Xác nhận sao chép
          </button>
        </div>
      </div>
    </div>
  );
};
