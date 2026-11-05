import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faCheck } from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  updateOperatingHours,
  setDirtyHours,
} from '../../../store/slices/schoolProfileSlice';
import {
  generateTimeOptions,
  validateOperatingHours,
} from '../../../utils/schoolProfileValidation';
import { DayOperatingHour } from '../../../types/schoolProfile';
import { EcoButton } from '../../../components/eco';

interface OperatingHoursFormProps {
  onCancelRequest?: () => void;
}

export const OperatingHoursForm: React.FC<OperatingHoursFormProps> = ({ onCancelRequest }) => {
  const dispatch = useAppDispatch();
  const { operatingHours } = useAppSelector((state) => state.schoolProfile);

  const [hoursList, setHoursList] = useState<DayOperatingHour[]>(operatingHours);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setHoursList(operatingHours);
  }, [operatingHours]);

  const timeOptions = generateTimeOptions(6, 18, 5); // 06:00 to 18:00 (step 5)

  const handleTimeChange = (
    dayOfWeek: number,
    field: 'openTime' | 'closeTime',
    value: string
  ) => {
    setHoursList((prev) =>
      prev.map((item) => (item.dayOfWeek === dayOfWeek ? { ...item, [field]: value } : item))
    );
    dispatch(setDirtyHours(true));
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateOperatingHours(hoursList);
    if (!validation.isValid) {
      setError(validation.error || 'Giờ mở cửa phải trước giờ đóng cửa');
      return;
    }

    dispatch(updateOperatingHours(hoursList));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-6">
        <div className="pb-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faClock} className="text-emerald-600 text-sm" />
            <h2 className="text-base font-bold text-gray-900">Giờ hoạt động trường</h2>
          </div>
          <span className="text-xs text-gray-400">Bước nhảy 5 phút (06:00 - 18:00)</span>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-100 font-medium">
            {error}
          </div>
        )}

        <div className="space-y-3">
          {hoursList.map((day) => (
            <div
              key={day.dayOfWeek}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-lg bg-gray-50/70 border border-gray-100 text-xs"
            >
              {/* Day Label */}
              <div className="flex items-center gap-3 w-32">
                <span
                  className={`inline-block px-2.5 py-1 rounded font-bold text-xs ${
                    day.isOpen
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                      : 'bg-gray-100 text-gray-400 border border-gray-200'
                  }`}
                >
                  {day.dayLabel}
                </span>
              </div>

              {/* Time Pickers or Static Tag */}
              {day.isOpen ? (
                <div className="flex items-center gap-3 flex-1 sm:justify-end">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 font-medium">Mở cửa:</span>
                    <select
                      value={day.openTime || '07:00'}
                      onChange={(e) => handleTimeChange(day.dayOfWeek, 'openTime', e.target.value)}
                      className="px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white font-medium text-gray-800 focus:outline-none focus:border-eco-blue focus:ring-1 focus:ring-eco-blue"
                    >
                      {timeOptions.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>

                  <span className="text-gray-400 font-bold">—</span>

                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 font-medium">Đóng cửa:</span>
                    <select
                      value={day.closeTime || '17:30'}
                      onChange={(e) => handleTimeChange(day.dayOfWeek, 'closeTime', e.target.value)}
                      className="px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white font-medium text-gray-800 focus:outline-none focus:border-eco-blue focus:ring-1 focus:ring-eco-blue"
                    >
                      {timeOptions.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : (
                /* Sunday Static Non-Operational Tag (BR09, K073) */
                <div className="flex items-center gap-2 flex-1 sm:justify-end">
                  <span className="text-gray-400 italic font-medium px-3 py-1.5 bg-gray-100/70 rounded-lg">
                    Chủ nhật không hoạt động (Ngày nghỉ tĩnh toàn trường)
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Independent Sub-Form Submit Bar (K071) */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-400 italic">
            *Lưu giờ hoạt động hoàn toàn độc lập với biểu mẫu quy định điểm danh
          </span>
          <EcoButton type="submit" variant="primary" leadingIcon={<FontAwesomeIcon icon={faCheck} />}>
            Cập nhật giờ hoạt động
          </EcoButton>
        </div>
      </div>
    </form>
  );
};
