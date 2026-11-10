import React, { useState } from 'react';
import { Dropdown, SlideOver } from '../../../components/ds';
import { WeeklyMenu } from '../../../types/menu';
import { getWeekDates, formatMenuDateRange } from '../../../utils/menuValidation';

interface CloneMenuModalProps {
  isOpen: boolean;
  menu: WeeklyMenu | null;
  onClose: () => void;
  onConfirmClone: (
    targetWeekNumber: number,
    targetYear: number,
    startDate: string,
    endDate: string
  ) => void;
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
    label: `Tuần ${w} (${formatMenuDateRange(
      getWeekDates(w, targetYear).startDate,
      getWeekDates(w, targetYear).endDate
    )})`,
  }));

  return (
    <SlideOver
      open={isOpen}
      onClose={onClose}
      title="Sao chép thực đơn"
      description={menu.title}
      icon="copy"
      width={480}
      primaryAction={{
        label: 'Xác nhận sao chép',
        icon: 'copy',
        onClick: handleConfirm,
      }}
      secondaryAction={{
        label: 'Hủy bỏ',
        onClick: onClose,
      }}
    >
      <div className="space-y-4">
        <div className="text-sm text-gray-700">
          Bạn có muốn tạo bản sao thực đơn <span className="font-semibold text-gray-900">&ldquo;{menu.title}&rdquo;</span> không?
        </div>

        <div className="bg-amber-50/60 border border-amber-200/70 rounded-xl p-3.5 text-xs text-amber-800 leading-relaxed">
          Hệ thống sẽ sao chép toàn bộ danh sách món ăn và định lượng vào tuần mới ở trạng thái <strong>Bản nháp</strong>.
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
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
    </SlideOver>
  );
};
