import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserCheck,
  faCheck,
  faExternalLinkAlt,
  faCircleInfo,
} from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  updateAttendanceRules,
  setDirtyRules,
} from '../../../store/slices/schoolProfileSlice';
import { generateLateArrivalOptions } from '../../../utils/schoolProfileValidation';
import { AttendanceRulesFormData } from '../../../types/schoolProfile';
import { EcoButton, EcoSwitch, EcoBadge } from '../../../components/eco';

interface AttendanceRulesFormProps {
  onCancelRequest?: () => void;
}

export const AttendanceRulesForm: React.FC<AttendanceRulesFormProps> = ({ onCancelRequest }) => {
  const router = useRouter();
  const { schoolCode } = router.query;
  const sCode = (schoolCode as string) || 'demo';

  const dispatch = useAppDispatch();
  const { attendanceRules } = useAppSelector((state) => state.schoolProfile);

  const [formData, setFormData] = useState<AttendanceRulesFormData>({
    lateArrivalEnabled: attendanceRules.lateArrivalEnabled,
    lateArrivalThresholdMinutes: attendanceRules.lateArrivalThresholdMinutes,
    lateDepartureEnabled: attendanceRules.lateDepartureEnabled,
  });

  useEffect(() => {
    setFormData({
      lateArrivalEnabled: attendanceRules.lateArrivalEnabled,
      lateArrivalThresholdMinutes: attendanceRules.lateArrivalThresholdMinutes,
      lateDepartureEnabled: attendanceRules.lateDepartureEnabled,
    });
  }, [attendanceRules]);

  const lateOptions = generateLateArrivalOptions(5, 60, 5); // 5 to 60, step 5

  const handleToggleLateArrival = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, lateArrivalEnabled: checked }));
    dispatch(setDirtyRules(true));
  };

  const handleSelectMinutes = (minutes: number) => {
    setFormData((prev) => ({ ...prev, lateArrivalThresholdMinutes: minutes }));
    dispatch(setDirtyRules(true));
  };

  const handleToggleLateDeparture = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, lateDepartureEnabled: checked }));
    dispatch(setDirtyRules(true));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(updateAttendanceRules(formData));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-6">
        <div className="pb-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faUserCheck} className="text-amber-600 text-sm" />
            <h2 className="text-base font-bold text-gray-900">Quy định điểm danh toàn trường</h2>
          </div>
          <span className="text-xs text-gray-400">Thiết lập mốc đến muộn & về muộn</span>
        </div>

        {/* Read-Only System Mode & Session Windows (BR05, BR14) */}
        <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100/70 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-700">Hình thức điểm danh:</span>
            <EcoBadge variant="info" size="sm">
              {attendanceRules.attendanceMode}
            </EcoBadge>
          </div>
          <div className="text-xs text-gray-600 flex items-center justify-between pt-1 border-t border-blue-100/40">
            <span>Khung giờ điểm danh mặc định:</span>
            <span className="font-semibold text-gray-800">
              Sáng: {attendanceRules.morningSessionTime} | Chiều: {attendanceRules.afternoonSessionTime}
            </span>
          </div>
          <p className="text-[11px] text-gray-400 italic pt-1">
            *{attendanceRules.sessionTimeNotice} ({attendanceRules.attendanceModeNotice})
          </p>
        </div>

        {/* Section 2: Đến Muộn (BR10) */}
        <div className="p-4 bg-gray-50/70 rounded-xl border border-gray-100 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Quy định đến muộn</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Bật hoặc tắt tính năng đánh dấu học sinh đến muộn khi điểm danh buổi sáng
              </p>
            </div>
            <EcoSwitch
              checked={formData.lateArrivalEnabled}
              onChange={handleToggleLateArrival}
              aria-label="Toggle đến muộn"
            />
          </div>

          <div
            className={`flex items-center gap-3 pt-2 transition-opacity ${
              formData.lateArrivalEnabled ? 'opacity-100' : 'opacity-40 pointer-events-none'
            }`}
          >
            <span className="text-xs text-gray-600 font-medium">
              Đánh dấu đến muộn sau giờ mở cửa:
            </span>
            <select
              value={formData.lateArrivalThresholdMinutes}
              disabled={!formData.lateArrivalEnabled}
              onChange={(e) => handleSelectMinutes(Number(e.target.value))}
              className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-semibold text-gray-800 focus:outline-none focus:border-eco-blue focus:ring-1 focus:ring-eco-blue"
            >
              {lateOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt} phút
                </option>
              ))}
            </select>
            <span className="text-xs text-gray-400 italic">
              (Học sinh đến sau mốc này sẽ tự động gắn nhãn "Đến muộn")
            </span>
          </div>
        </div>

        {/* Section 3: Về Muộn (BR11, K074) */}
        <div className="p-4 bg-gray-50/70 rounded-xl border border-gray-100 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Quy định về muộn</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Tính năng theo dõi phụ huynh đón muộn và liên kết tính phí trông muộn
              </p>
            </div>
            <EcoSwitch
              checked={formData.lateDepartureEnabled}
              onChange={handleToggleLateDeparture}
              aria-label="Toggle về muộn"
            />
          </div>

          <div className="space-y-1.5 pt-1">
            <p className="text-xs text-gray-600 leading-relaxed">
              {attendanceRules.lateDepartureNotice}
            </p>

            {/* Active Link to Fee Settings (K074) */}
            {formData.lateDepartureEnabled && (
              <div className="pt-1">
                <Link
                  href={`/${sCode}/setting/fee`}
                  className="text-eco-blue hover:underline inline-flex items-center gap-1.5 font-medium text-xs"
                >
                  Cài đặt phí trông học sinh về muộn tại đây
                  <FontAwesomeIcon icon={faExternalLinkAlt} className="text-[10px]" />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Independent Sub-Form Submit Bar (K071) */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-400 italic">
            *Lưu quy định điểm danh độc lập với biểu mẫu giờ hoạt động trường
          </span>
          <EcoButton type="submit" variant="primary" leadingIcon={<FontAwesomeIcon icon={faCheck} />}>
            Cập nhật quy định điểm danh
          </EcoButton>
        </div>
      </div>
    </form>
  );
};
