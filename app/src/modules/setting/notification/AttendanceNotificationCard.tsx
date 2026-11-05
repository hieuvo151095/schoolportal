import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserCheck,
  faClock,
  faBasketball,
  faUsers,
  faChalkboardUser,
} from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  updateAttendanceToggle,
  updateExtracurricularScope,
  updateExtracurricularToggle,
} from '../../../store/slices/notificationSettingsSlice';

export const AttendanceNotificationCard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentSettings, extracurricularClasses } = useAppSelector(
    (state) => state.notificationSettings
  );
  const { attendance } = currentSettings;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Section Header */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#0070CE] flex items-center justify-center shrink-0">
            <FontAwesomeIcon icon={faUserCheck} className="text-sm" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              1. Điểm danh
            </h2>
            <p className="text-xs text-slate-500">
              Cảnh báo giờ đón/trả trẻ và thông báo điểm danh các lớp ngoại khóa
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Row 1: Nhắc nhở giáo viên đón trẻ & trả trẻ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Item 1: Đón trẻ */}
          <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="space-y-2 flex-1">
              <label
                htmlFor="toggle-pickup-reminder"
                className="text-sm font-semibold text-slate-900 cursor-pointer block"
              >
                Nhắc nhở giáo viên đón trẻ
              </label>
              <p className="text-xs text-slate-500 leading-relaxed">
                Gửi cảnh báo đến giáo viên chủ nhiệm khi học sinh chưa được ghi nhận có mặt tại trường.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <FontAwesomeIcon icon={faClock} className="text-xs text-slate-400" />
                <span className="text-xs text-slate-500 font-medium">Mốc giờ cố định:</span>
                <input
                  type="text"
                  value={attendance.pickupReminderTime}
                  disabled
                  readOnly
                  aria-label="Mốc giờ nhắc nhở đón trẻ"
                  className="w-16 px-2 py-0.5 text-xs font-semibold text-center text-slate-600 bg-slate-200/80 border border-slate-300 rounded cursor-not-allowed select-none"
                />
              </div>
            </div>

            <button
              id="toggle-pickup-reminder"
              type="button"
              role="switch"
              aria-checked={attendance.pickupTeacherReminder}
              onClick={() =>
                dispatch(
                  updateAttendanceToggle({
                    field: 'pickupTeacherReminder',
                    value: !attendance.pickupTeacherReminder,
                  })
                )
              }
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#0070CE] focus:ring-offset-2 mt-0.5 ${
                attendance.pickupTeacherReminder ? 'bg-[#0070CE]' : 'bg-slate-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  attendance.pickupTeacherReminder ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Item 2: Trả trẻ */}
          <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="space-y-2 flex-1">
              <label
                htmlFor="toggle-dropoff-reminder"
                className="text-sm font-semibold text-slate-900 cursor-pointer block"
              >
                Nhắc nhở giáo viên trả trẻ
              </label>
              <p className="text-xs text-slate-500 leading-relaxed">
                Cảnh báo những học sinh chưa được phụ huynh hoặc người đón hộ quét thẻ lúc tan trường.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <FontAwesomeIcon icon={faClock} className="text-xs text-slate-400" />
                <span className="text-xs text-slate-500 font-medium">Mốc giờ cố định:</span>
                <input
                  type="text"
                  value={attendance.pickupReminderTime}
                  disabled
                  readOnly
                  aria-label="Mốc giờ nhắc nhở trả trẻ"
                  className="w-16 px-2 py-0.5 text-xs font-semibold text-center text-slate-600 bg-slate-200/80 border border-slate-300 rounded cursor-not-allowed select-none"
                />
              </div>
            </div>

            <button
              id="toggle-dropoff-reminder"
              type="button"
              role="switch"
              aria-checked={attendance.dropoffTeacherReminder}
              onClick={() =>
                dispatch(
                  updateAttendanceToggle({
                    field: 'dropoffTeacherReminder',
                    value: !attendance.dropoffTeacherReminder,
                  })
                )
              }
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#0070CE] focus:ring-offset-2 mt-0.5 ${
                attendance.dropoffTeacherReminder ? 'bg-[#0070CE]' : 'bg-slate-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  attendance.dropoffTeacherReminder ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Row 2: Điểm danh lớp ngoại khóa (Extracurricular Scoping & Recipients) */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <FontAwesomeIcon icon={faBasketball} className="text-xs" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Thông báo điểm danh hoạt động ngoại khóa
                </h3>
                <p className="text-xs text-slate-500">
                  Gửi cập nhật điểm danh khi học sinh tham gia các lớp câu lạc bộ, năng khiếu
                </p>
              </div>
            </div>

            {/* Scope Selector Dropdown (BR07, K101) */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <label htmlFor="extracurricular-scope-select" className="text-xs text-slate-600 font-medium whitespace-nowrap">
                Áp dụng cho:
              </label>
              <select
                id="extracurricular-scope-select"
                value={attendance.extracurricular.scope}
                onChange={(e) => dispatch(updateExtracurricularScope(e.target.value))}
                className="text-xs font-medium text-slate-800 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#0070CE]"
              >
                <option value="all">Tất cả lớp ngoại khóa</option>
                {extracurricularClasses.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Child Toggles */}
          <div className="pt-2 border-t border-slate-200/60 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Toggle: Notify Parents */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200/70">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faUsers} className="text-xs text-slate-400" />
                <span className="text-xs font-medium text-slate-700">
                  Gửi thông báo cho Phụ huynh
                </span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={attendance.extracurricular.notifyParents}
                onClick={() =>
                  dispatch(
                    updateExtracurricularToggle({
                      target: 'notifyParents',
                      value: !attendance.extracurricular.notifyParents,
                    })
                  )
                }
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#0070CE] focus:ring-offset-2 ${
                  attendance.extracurricular.notifyParents ? 'bg-[#0070CE]' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    attendance.extracurricular.notifyParents ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Toggle: Notify Teachers */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200/70">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faChalkboardUser} className="text-xs text-slate-400" />
                <span className="text-xs font-medium text-slate-700">
                  Gửi cho Giáo viên & Quản lý lớp
                </span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={attendance.extracurricular.notifyTeachers}
                onClick={() =>
                  dispatch(
                    updateExtracurricularToggle({
                      target: 'notifyTeachers',
                      value: !attendance.extracurricular.notifyTeachers,
                    })
                  )
                }
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#0070CE] focus:ring-offset-2 ${
                  attendance.extracurricular.notifyTeachers ? 'bg-[#0070CE]' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    attendance.extracurricular.notifyTeachers ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
