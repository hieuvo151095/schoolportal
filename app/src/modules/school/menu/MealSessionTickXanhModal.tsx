import React, { useState, useEffect } from 'react';
import { Icon, SlideOver } from '../../../components/ds';
import { WeekdayKey, MealType, DishItem } from '../../../types/menu';
import { WEEKDAY_LABELS, MEAL_LABELS } from '../../../utils/menuValidation';

interface MealSessionTickXanhModalProps {
  isOpen: boolean;
  day: WeekdayKey;
  meal: MealType;
  dateLabel?: string;
  dishes: DishItem[];
  currentUrl?: string;
  initialApplyToAll?: boolean;
  onClose: () => void;
  onSave: (url: string, verified: boolean, applyToAllDay?: boolean) => void;
}

export const MealSessionTickXanhModal: React.FC<MealSessionTickXanhModalProps> = ({
  isOpen,
  day,
  meal,
  dateLabel,
  dishes,
  currentUrl = '',
  initialApplyToAll = false,
  onClose,
  onSave,
}) => {
  const [url, setUrl] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [applyToAllDay, setApplyToAllDay] = useState<boolean>(initialApplyToAll);

  useEffect(() => {
    setUrl(currentUrl || '');
    setIsEditing(!currentUrl);
    setErrorMessage('');
    setApplyToAllDay(initialApplyToAll);
  }, [currentUrl, isOpen, initialApplyToAll]);

  if (!isOpen) return null;

  const dishNames = dishes.map((d) => d.name).join(', ') || 'Chưa có món ăn';
  const mealName = MEAL_LABELS[meal] || 'Bữa ăn';
  const sessionSubtitle = dateLabel ? `${mealName} - ${dateLabel}` : `${mealName} - ${WEEKDAY_LABELS[day]}`;

  const handleSave = () => {
    const trimmed = url.trim();
    if (trimmed) {
      const isValid =
        trimmed.startsWith('http://') ||
        trimmed.startsWith('https://') ||
        trimmed.startsWith('www.') ||
        trimmed.includes('.');
      if (!isValid) {
        setErrorMessage('Vui lòng nhập đường dẫn URL hợp lệ (ví dụ: https://tfd.tf/...)');
        return;
      }
      const fullUrl = trimmed.startsWith('www.')
        ? `https://${trimmed}`
        : !trimmed.startsWith('http')
        ? `https://${trimmed}`
        : trimmed;
      onSave(fullUrl, true, applyToAllDay);
    } else {
      onSave('', false, applyToAllDay);
    }
    onClose();
  };

  return (
    <SlideOver
      open={isOpen}
      onClose={onClose}
      title="Liên kết Tick Xanh an toàn"
      description={`Cấu hình liên kết truy xuất nguồn gốc cho ${sessionSubtitle}`}
      icon="link"
      width={520}
      primaryAction={{
        label: 'Lưu thay đổi',
        icon: 'check',
        onClick: handleSave,
      }}
      secondaryAction={{
        label: 'Hủy bỏ',
        onClick: onClose,
      }}
    >
      <div className="space-y-5">
        {/* Session context banner */}
        <div className="p-4 bg-sky-50 border border-sky-200 rounded-xl space-y-1">
          <div className="text-xs font-bold text-sky-900 uppercase tracking-wider">
            {sessionSubtitle}
          </div>
          <div className="text-xs text-sky-800">
            Các món ăn trong buổi: <strong>{dishNames}</strong>
          </div>
        </div>

        {/* Link Input Section */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Đường dẫn truy xuất nguồn gốc thực phẩm
          </label>

          <div className="relative flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setErrorMessage('');
                }}
                readOnly={!isEditing}
                placeholder="https://tfd.tf/26198-B-29-0040260"
                className={`w-full px-3.5 py-2.5 text-xs rounded-xl border ${
                  errorMessage
                    ? 'border-rose-400 bg-rose-50/30'
                    : !isEditing
                    ? 'border-slate-200 bg-slate-50 text-slate-700'
                    : 'border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0070CE]'
                }`}
              />
            </div>

            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer shrink-0"
              >
                Sửa
              </button>
            ) : (
              url && (
                <button
                  type="button"
                  onClick={() => {
                    try {
                      const target = url.startsWith('http') ? url : `https://${url}`;
                      window.open(target, '_blank', 'noopener,noreferrer');
                    } catch (e) {}
                  }}
                  className="px-3 py-2 text-xs font-medium text-[#0070CE] bg-blue-50 border border-blue-200 hover:bg-blue-100 rounded-xl transition-colors cursor-pointer shrink-0"
                  title="Mở link kiểm tra"
                >
                  Xem
                </button>
              )
            )}
          </div>

          {errorMessage && (
            <p className="text-xs text-rose-500 font-medium">{errorMessage}</p>
          )}

          {url && (
            <p className="text-xs text-emerald-600 flex items-center gap-1.5 font-medium">
              <Icon name="circle-check" size={14} className="text-emerald-600" />
              <span>Suất ăn này sẽ hiển thị huy hiệu &quot;Đã có tick xanh&quot; trên cổng và app phụ huynh.</span>
            </p>
          )}

          {/* Apply to All Meals of the Day Checkbox */}
          <div className="pt-2 border-t border-slate-100">
            <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100/70 transition-colors cursor-pointer select-none">
              <input
                type="checkbox"
                checked={applyToAllDay}
                onChange={(e) => setApplyToAllDay(e.target.checked)}
                className="w-4 h-4 rounded text-[#0070CE] focus:ring-[#0070CE] border-slate-300"
              />
              <span className="text-xs font-medium text-slate-700">
                Áp dụng liên kết này cho <strong>tất cả buổi ăn trong ngày</strong> ({dateLabel || WEEKDAY_LABELS[day]})
              </span>
            </label>
          </div>
        </div>
      </div>
    </SlideOver>
  );
};
