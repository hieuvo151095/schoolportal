import React, { useState, useEffect } from 'react';
import { Icon } from '../../../components/ds';
import { WeekdayKey, MealType, DishItem } from '../../../types/menu';
import { WEEKDAY_LABELS, MEAL_LABELS } from '../../../utils/menuValidation';

interface MealSessionTickXanhModalProps {
  isOpen: boolean;
  day: WeekdayKey;
  meal: MealType;
  dateLabel?: string; // e.g. "12/10/2026"
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
      // Clear tick xanh
      onSave('', false, applyToAllDay);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header with light blue tint */}
        <div className="px-6 py-4 bg-[#f0f7ff] border-b border-blue-100 flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#f87171] text-white flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
              <span className="text-[10px] font-black uppercase tracking-tighter">MENU</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1e3a8a]">
                Khai báo an toàn thực phẩm &amp; Truy xuất nguồn gốc
              </h3>
              <div className="mt-1 space-y-0.5">
                <div className="text-xs font-semibold text-amber-600 flex items-center gap-1.5">
                  <Icon name="sun" className="w-3.5 h-3.5 text-amber-500" />
                  <span>{sessionSubtitle}</span>
                </div>
                <div className="text-xs text-gray-600 flex items-center gap-1.5">
                  <Icon name="utensils" className="w-3 h-3 text-gray-400" />
                  <span>
                    Món ăn: <strong className="text-gray-800">{dishNames}</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-white/80 transition-colors"
          >
            <Icon name="xmark" className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 overflow-y-auto">
          {/* Brand Info Card */}
          <div className="p-4 rounded-xl border border-gray-200 bg-white shadow-2xs space-y-3">
            <div className="flex items-center gap-3">
              {/* Official Handshake / Tick Xanh Circular Logo */}
              <div className="w-12 h-12 rounded-full bg-emerald-50 border-2 border-emerald-500 flex items-center justify-center flex-shrink-0 text-emerald-600 shadow-sm">
                <Icon name="shield-halved" className="w-6 h-6 text-emerald-600" />
              </div>

              <div>
                <div className="text-xs font-extrabold uppercase tracking-wide text-[#b45309]">
                  SUẤT ĂN MINH BẠCH
                </div>
                <div className="text-sm font-black uppercase tracking-wide text-[#0070CE]">
                  TICK XANH TRÁCH NHIỆM
                </div>
                <div className="text-[10px] text-gray-500 italic">
                  (Bản quyền thương hiệu &quot;Tick Xanh Trách Nhiệm&quot; thuộc Sở Công Thương TP.HCM)
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-3 text-xs text-gray-600 leading-relaxed space-y-2">
              <p>
                Chương trình <strong>&quot;Suất ăn minh bạch - Tick Xanh Trách Nhiệm&quot;</strong> do{' '}
                <strong>Sở Công Thương TP.HCM</strong> chủ trì nhằm tăng cường kiểm soát, giám sát chuỗi
                cung ứng thực phẩm an toàn và minh bạch cho học đường.
              </p>
              <p>
                Nhập đường dẫn trang web truy xuất nguồn gốc của suất ăn/món ăn từ đơn vị cung cấp đạt chuẩn.
                Phụ huynh và học sinh sẽ có nút bấm trên ứng dụng di động để truy cập trực tiếp liên kết này.
              </p>
            </div>
          </div>

          {/* Form field: Đường dẫn Tick Xanh */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-700">
              Đường dẫn Tick Xanh
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1 flex items-center">
                <div className="absolute left-2 w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center pointer-events-none">
                  <Icon name="link" className="w-3.5 h-3.5 text-amber-700" />
                </div>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    setErrorMessage('');
                  }}
                  readOnly={!isEditing}
                  placeholder="https://tfd.tf/26198-B-29-0040260"
                  className={`w-full pl-11 pr-3 py-2 text-xs rounded-xl border ${
                    errorMessage
                      ? 'border-red-400 bg-red-50/30'
                      : !isEditing
                      ? 'border-gray-200 bg-gray-50 text-gray-700'
                      : 'border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                  }`}
                />
              </div>

              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl inline-flex items-center gap-1 transition-colors"
                >
                  <Icon name="pencil" className="w-3 h-3" />
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
                    className="px-3 py-2 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 hover:bg-blue-100 rounded-xl inline-flex items-center gap-1 transition-colors"
                    title="Mở link kiểm tra"
                  >
                    <svg className="w-3 h-3 fill-none stroke-currentColor stroke-2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Xem
                  </button>
                )
              )}
            </div>

            {errorMessage && (
              <p className="text-[11px] text-red-500 font-medium">{errorMessage}</p>
            )}

            {url && (
              <p className="text-[11px] text-emerald-600 flex items-center gap-1">
                <Icon name="circle-check" className="w-3.5 h-3.5 text-emerald-600" />
                <span>Suất ăn này sẽ hiển thị huy hiệu &quot;Đã có tick xanh&quot; trên cổng và app phụ huynh.</span>
              </p>
            )}

            {/* Apply to All Meals of the Day Checkbox */}
            <div className="pt-2 border-t border-gray-100">
              <label className="flex items-center gap-2.5 p-2 rounded-xl bg-sky-50/60 border border-sky-100 hover:bg-sky-50 transition-colors cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={applyToAllDay}
                  onChange={(e) => setApplyToAllDay(e.target.checked)}
                  className="w-4 h-4 rounded text-[#0070CE] focus:ring-blue-500 border-gray-300"
                />
                <span className="text-xs font-medium text-gray-700">
                  Áp dụng liên kết này cho <strong>tất cả buổi ăn trong ngày</strong> ({dateLabel || WEEKDAY_LABELS[day]})
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 rounded-xl transition-colors"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 text-xs font-semibold text-white bg-[#0070CE] hover:bg-blue-700 rounded-xl shadow-sm shadow-blue-500/20 transition-all"
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
};
