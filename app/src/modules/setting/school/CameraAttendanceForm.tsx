import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCamera,
  faClock,
  faCheck,
  faCircleInfo,
  faExclamationTriangle,
  faBell,
  faSchool,
  faRotateRight,
} from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  updateCameraAttendanceRules,
  setDirtyCamera,
} from '../../../store/slices/schoolProfileSlice';
import {
  generateTimeOptions,
  validateCameraAttendanceRules,
  getCameraNotificationRule,
} from '../../../utils/schoolProfileValidation';
import type {
  CameraAttendanceRules,
  CameraTimeWindow,
  SchoolEducationalType,
} from '../../../types/schoolProfile';
import { EcoButton, EcoSwitch, EcoBadge } from '../../../components/eco';

interface CameraAttendanceFormProps {
  onCancelRequest?: () => void;
}

export const CameraAttendanceForm: React.FC<CameraAttendanceFormProps> = ({ onCancelRequest }) => {
  const dispatch = useAppDispatch();
  const { cameraAttendanceRules } = useAppSelector((state) => state.schoolProfile);

  const [formData, setFormData] = useState<CameraAttendanceRules>(cameraAttendanceRules);
  const [validationError, setValidationError] = useState<string | undefined>(undefined);

  useEffect(() => {
    setFormData(cameraAttendanceRules);
    setValidationError(undefined);
  }, [cameraAttendanceRules]);

  const timeOptions = generateTimeOptions(6, 19, 5); // 06:00 to 19:00, step 5 min

  const handleTypeChange = (type: SchoolEducationalType) => {
    const updated: CameraAttendanceRules = {
      ...formData,
      educationalType: type,
    };
    setFormData(updated);
    setValidationError(undefined);
    dispatch(setDirtyCamera(true));
  };

  const handleToggleWindow = (
    key: 'pickup' | 'dropoff' | 'morningPickup' | 'morningDropoff' | 'afternoonPickup' | 'afternoonDropoff',
    enabled: boolean
  ) => {
    const updated: CameraAttendanceRules = {
      ...formData,
      [key]: {
        ...formData[key],
        enabled,
      },
    };
    setFormData(updated);
    setValidationError(undefined);
    dispatch(setDirtyCamera(true));
  };

  const handleTimeChange = (
    key: 'pickup' | 'dropoff' | 'morningPickup' | 'morningDropoff' | 'afternoonPickup' | 'afternoonDropoff',
    field: 'startTime' | 'endTime',
    value: string
  ) => {
    const updated: CameraAttendanceRules = {
      ...formData,
      [key]: {
        ...formData[key],
        [field]: value,
      },
    };
    setFormData(updated);
    setValidationError(undefined);
    dispatch(setDirtyCamera(true));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateCameraAttendanceRules(formData);
    if (!result.isValid) {
      setValidationError(result.error);
      return;
    }
    setValidationError(undefined);
    dispatch(updateCameraAttendanceRules(formData));
  };

  const renderTimePickerBox = (
    windowKey: 'pickup' | 'dropoff' | 'morningPickup' | 'morningDropoff' | 'afternoonPickup' | 'afternoonDropoff',
    window: CameraTimeWindow
  ) => {
    return (
      <div
        className={`flex flex-wrap items-center gap-2.5 transition-all ${
          window.enabled ? 'opacity-100' : 'opacity-40 pointer-events-none'
        }`}
      >
        {/* Start Time Box */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:border-gray-300 focus-within:border-eco-blue focus-within:ring-1 focus-within:ring-eco-blue transition-colors shadow-xs">
          <span className="text-amber-500 text-xs flex items-center justify-center w-4">
            <FontAwesomeIcon icon={faClock} />
          </span>
          <select
            value={window.startTime}
            disabled={!window.enabled}
            onChange={(e) => handleTimeChange(windowKey, 'startTime', e.target.value)}
            className="bg-transparent text-xs font-semibold text-gray-800 focus:outline-none cursor-pointer pr-1"
            aria-label="Giờ bắt đầu"
          >
            {timeOptions.map((time) => (
              <option key={`start-${time}`} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>

        <span className="text-gray-400 text-xs font-medium">—</span>

        {/* End Time Box */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:border-gray-300 focus-within:border-eco-blue focus-within:ring-1 focus-within:ring-eco-blue transition-colors shadow-xs">
          <span className="text-amber-500 text-xs flex items-center justify-center w-4">
            <FontAwesomeIcon icon={faClock} />
          </span>
          <select
            value={window.endTime}
            disabled={!window.enabled}
            onChange={(e) => handleTimeChange(windowKey, 'endTime', e.target.value)}
            className="bg-transparent text-xs font-semibold text-gray-800 focus:outline-none cursor-pointer pr-1"
            aria-label="Giờ kết thúc"
          >
            {timeOptions.map((time) => (
              <option key={`end-${time}`} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  };

  const renderPreschoolRows = () => {
    const pickupRule = getCameraNotificationRule('mam_non', 'pickup', formData.pickup.endTime);
    const dropoffRule = getCameraNotificationRule('mam_non', 'dropoff', formData.dropoff.endTime);

    return (
      <div className="space-y-4">
        {/* Row 1: Giờ đón học sinh */}
        <div className="p-4 bg-gray-50/80 rounded-xl border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-gray-900">Giờ đón học sinh</h3>
              <EcoBadge variant="success" size="sm">
                Check-in
              </EcoBadge>
            </div>
            <p className="text-xs text-gray-500">Khung giờ camera ghi nhận học sinh đến trường</p>
            <div className="flex items-center gap-1.5 pt-1 text-[11px] text-emerald-700 font-medium">
              <FontAwesomeIcon icon={faBell} className="text-[10px]" />
              <span>{pickupRule.label}</span>
            </div>
          </div>

          <div className="flex items-center gap-3.5 self-start sm:self-center">
            <EcoSwitch
              checked={formData.pickup.enabled}
              onChange={(checked) => handleToggleWindow('pickup', checked)}
              aria-label="Bật tắt giới hạn giờ đón"
            />
            {renderTimePickerBox('pickup', formData.pickup)}
          </div>
        </div>

        {/* Row 2: Giờ trả học sinh */}
        <div className="p-4 bg-gray-50/80 rounded-xl border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-gray-900">Giờ trả học sinh</h3>
              <EcoBadge variant="warning" size="sm">
                Check-out
              </EcoBadge>
            </div>
            <p className="text-xs text-gray-500">Khung giờ camera ghi nhận học sinh ra về</p>
            <div className="flex items-center gap-1.5 pt-1 text-[11px] text-amber-700 font-medium">
              <FontAwesomeIcon icon={faBell} className="text-[10px]" />
              <span>{dropoffRule.label}</span>
            </div>
          </div>

          <div className="flex items-center gap-3.5 self-start sm:self-center">
            <EcoSwitch
              checked={formData.dropoff.enabled}
              onChange={(checked) => handleToggleWindow('dropoff', checked)}
              aria-label="Bật tắt giới hạn giờ trả"
            />
            {renderTimePickerBox('dropoff', formData.dropoff)}
          </div>
        </div>
      </div>
    );
  };

  const renderK12Rows = () => {
    return (
      <div className="space-y-5">
        {/* Morning Session */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 pb-1 border-b border-gray-100">
            <span className="w-2 h-2 rounded-full bg-eco-blue" />
            <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">
              Buổi sáng (Điểm danh & Trả trưa)
            </span>
          </div>

          {/* Morning Pickup */}
          <div className="p-4 bg-gray-50/80 rounded-xl border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-gray-900">Giờ đón sáng</h3>
                <EcoBadge variant="info" size="sm">
                  Đón sáng
                </EcoBadge>
              </div>
              <p className="text-xs text-gray-500">Khung giờ camera ghi nhận học sinh đến trường buổi sáng</p>
              <div className="flex items-center gap-1.5 pt-1 text-[11px] text-emerald-700 font-medium">
                <FontAwesomeIcon icon={faBell} className="text-[10px]" />
                <span>Lấy sự kiện đầu tiên · Bắn thông báo ngay lập tức</span>
              </div>
            </div>

            <div className="flex items-center gap-3.5 self-start sm:self-center">
              <EcoSwitch
                checked={formData.morningPickup.enabled}
                onChange={(checked) => handleToggleWindow('morningPickup', checked)}
                aria-label="Bật tắt giới hạn giờ đón sáng"
              />
              {renderTimePickerBox('morningPickup', formData.morningPickup)}
            </div>
          </div>

          {/* Morning Dropoff */}
          <div className="p-4 bg-gray-50/80 rounded-xl border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-gray-900">Giờ trả sáng (Trưa)</h3>
                <EcoBadge variant="neutral" size="sm">
                  Trả trưa
                </EcoBadge>
              </div>
              <p className="text-xs text-gray-500">Khung giờ camera ghi nhận học sinh bán trú hoặc ra về buổi trưa</p>
              <div className="flex items-center gap-1.5 pt-1 text-[11px] text-emerald-700 font-medium">
                <FontAwesomeIcon icon={faBell} className="text-[10px]" />
                <span>Lấy sự kiện đầu tiên · Bắn thông báo ngay lập tức</span>
              </div>
            </div>

            <div className="flex items-center gap-3.5 self-start sm:self-center">
              <EcoSwitch
                checked={formData.morningDropoff.enabled}
                onChange={(checked) => handleToggleWindow('morningDropoff', checked)}
                aria-label="Bật tắt giới hạn giờ trả sáng"
              />
              {renderTimePickerBox('morningDropoff', formData.morningDropoff)}
            </div>
          </div>
        </div>

        {/* Afternoon Session */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2 pb-1 border-b border-gray-100">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">
              Buổi chiều (Vào lớp & Tan học)
            </span>
          </div>

          {/* Afternoon Pickup */}
          <div className="p-4 bg-gray-50/80 rounded-xl border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-gray-900">Giờ đón chiều</h3>
                <EcoBadge variant="info" size="sm">
                  Đón chiều
                </EcoBadge>
              </div>
              <p className="text-xs text-gray-500">Khung giờ camera ghi nhận học sinh vào lớp buổi chiều</p>
              <div className="flex items-center gap-1.5 pt-1 text-[11px] text-emerald-700 font-medium">
                <FontAwesomeIcon icon={faBell} className="text-[10px]" />
                <span>Lấy sự kiện đầu tiên · Bắn thông báo ngay lập tức</span>
              </div>
            </div>

            <div className="flex items-center gap-3.5 self-start sm:self-center">
              <EcoSwitch
                checked={formData.afternoonPickup.enabled}
                onChange={(checked) => handleToggleWindow('afternoonPickup', checked)}
                aria-label="Bật tắt giới hạn giờ đón chiều"
              />
              {renderTimePickerBox('afternoonPickup', formData.afternoonPickup)}
            </div>
          </div>

          {/* Afternoon Dropoff */}
          <div className="p-4 bg-gray-50/80 rounded-xl border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-gray-900">Giờ trả chiều (Tan học)</h3>
                <EcoBadge variant="warning" size="sm">
                  Tan học
                </EcoBadge>
              </div>
              <p className="text-xs text-gray-500">Khung giờ camera ghi nhận học sinh tan học ra về</p>
              <div className="flex items-center gap-1.5 pt-1 text-[11px] text-emerald-700 font-medium">
                <FontAwesomeIcon icon={faBell} className="text-[10px]" />
                <span>Lấy sự kiện đầu tiên · Bắn thông báo ngay lập tức</span>
              </div>
            </div>

            <div className="flex items-center gap-3.5 self-start sm:self-center">
              <EcoSwitch
                checked={formData.afternoonDropoff.enabled}
                onChange={(checked) => handleToggleWindow('afternoonDropoff', checked)}
                aria-label="Bật tắt giới hạn giờ trả chiều"
              />
              {renderTimePickerBox('afternoonDropoff', formData.afternoonDropoff)}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-6">
        {/* Header Section */}
        <div className="pb-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faCamera} className="text-eco-blue text-sm" />
              <h2 className="text-base font-bold text-gray-900">
                Cấu hình giờ đón/trả bằng camera
              </h2>
            </div>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Camera nhận diện chỉ ghi nhận điểm danh trong khung giờ được cấu hình. Tắt giới hạn để camera ghi nhận cả ngày.
            </p>
            <p className="text-xs text-amber-600 font-medium mt-0.5">
              Lưu ý: Khung giờ đón và khung giờ trả không được trùng nhau.
            </p>
          </div>

          {/* Educational Type Switcher */}
          <div className="flex items-center bg-gray-100/80 p-1 rounded-xl shrink-0 self-start sm:self-auto border border-gray-200/50">
            <button
              type="button"
              onClick={() => handleTypeChange('mam_non')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                formData.educationalType === 'mam_non'
                  ? 'bg-white text-eco-blue shadow-xs font-bold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Trường Mầm non (1 buổi)
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('k12')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                formData.educationalType === 'k12'
                  ? 'bg-white text-eco-blue shadow-xs font-bold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Trường K12 (2 buổi)
            </button>
          </div>
        </div>

        {/* Validation Error Banner */}
        {validationError && (
          <div className="p-3.5 rounded-xl border border-red-200 bg-red-50/80 flex items-start gap-2.5 text-xs text-red-700 animate-fade-in">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500 mt-0.5 shrink-0" />
            <span className="font-medium leading-relaxed">{validationError}</span>
          </div>
        )}

        {/* Mode Explanatory Card */}
        <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100/70 space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-gray-800">
              Quy tắc nghiệp vụ sự kiện & gửi thông báo phụ huynh:
            </span>
            <EcoBadge variant={formData.educationalType === 'mam_non' ? 'info' : 'neutral'} size="sm">
              {formData.educationalType === 'mam_non' ? 'Mô hình Mầm Non (1 buổi)' : 'Mô hình K12 (2 buổi)'}
            </EcoBadge>
          </div>

          {formData.educationalType === 'mam_non' ? (
            <div className="text-gray-600 space-y-1 pt-1 border-t border-blue-100/50">
              <p>
                • <strong>Check-in (Đón sáng):</strong> Hệ thống ghi nhận <em>sự kiện đầu tiên</em> và tự động phát thông báo tới phụ huynh <em>ngay lập tức</em>.
              </p>
              <p>
                • <strong>Check-out (Trả chiều):</strong> Hệ thống theo dõi và lấy <em>sự kiện cuối cùng</em> trong khung giờ; thông báo chỉ được phát tới phụ huynh tại <em>mốc kết thúc khung giờ</em> ({formData.dropoff.endTime}) để tránh sai sót khi trẻ di chuyển qua lại.
              </p>
            </div>
          ) : (
            <div className="text-gray-600 space-y-1 pt-1 border-t border-blue-100/50">
              <p>
                • <strong>Điểm danh 2 buổi (Sáng & Chiều):</strong> Ở cả 2 buổi, cả sự kiện đón và trả đều lấy <em>sự kiện đầu tiên</em> và phát thông báo tới phụ huynh <em>ngay lập tức</em>.
              </p>
            </div>
          )}
        </div>

        {/* Rows for Selected Educational Type */}
        {formData.educationalType === 'mam_non' ? renderPreschoolRows() : renderK12Rows()}

        {/* Submit Actions Bar */}
        <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-xs text-gray-400 italic">
            *Cấu hình được đồng bộ tức thì sang toàn bộ trạm Camera AI đặt tại cổng trường.
          </span>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            {onCancelRequest && (
              <button
                type="button"
                onClick={onCancelRequest}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Hủy bỏ
              </button>
            )}
            <EcoButton
              type="submit"
              variant="primary"
              leadingIcon={<FontAwesomeIcon icon={faCheck} />}
            >
              Cập nhật
            </EcoButton>
          </div>
        </div>
      </div>
    </form>
  );
};
