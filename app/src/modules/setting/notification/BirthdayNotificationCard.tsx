import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCakeCandles,
  faChalkboardTeacher,
  faUserShield,
  faCalendarDay,
  faClock,
} from '@fortawesome/free-solid-svg-icons';
import { Dropdown } from '@/components/ds';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  updateBirthdaySchedule,
  updateBirthdayToggle,
} from '../../../store/slices/notificationSettingsSlice';

export const BirthdayNotificationCard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentSettings } = useAppSelector(
    (state) => state.notificationSettings
  );
  const { birthday } = currentSettings;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Section Header */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-pink-100 text-pink-600 flex items-center justify-center shrink-0">
            <FontAwesomeIcon icon={faCakeCandles} className="text-sm" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              2. Sinh nhật
            </h2>
            <p className="text-xs text-slate-500">
              Lịch nhắc gửi lời chúc sinh nhật định kỳ hàng tháng cho cán bộ, giáo viên và nhân sự
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Shared Schedule Configuration Row (BR04, K098: Lacks independent toggle switch) */}
        <div className="p-4 rounded-xl bg-pink-50/50 border border-pink-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-sm font-semibold text-slate-900 block">
              Ngày và giờ gửi thông báo sinh nhật
            </span>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
              Mốc thời gian gửi thông báo chúc mừng định kỳ chung cho các đối tượng bên dưới.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto shrink-0">
            {/* Day of Month Selector (1-31) */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-600 font-medium">
                Ngày:
              </span>
              <Dropdown
                placeholder="Chọn ngày"
                options={Array.from({ length: 31 }, (_, i) => i + 1).map((day) => ({
                  value: String(day),
                  label: `Ngày ${day}`,
                }))}
                value={String(birthday.broadcastSchedule.dayOfMonth)}
                onChange={(val) =>
                  dispatch(
                    updateBirthdaySchedule({
                      dayOfMonth: parseInt(val, 10),
                    })
                  )
                }
                size="sm"
                className="min-w-[120px]"
              />
            </div>

            {/* Time Picker */}
            <div className="flex items-center gap-1.5">
              <FontAwesomeIcon icon={faClock} className="text-xs text-slate-400" />
              <label htmlFor="birthday-time-input" className="text-xs text-slate-600 font-medium">
                Giờ:
              </label>
              <input
                id="birthday-time-input"
                type="time"
                value={birthday.broadcastSchedule.time}
                onChange={(e) =>
                  dispatch(updateBirthdaySchedule({ time: e.target.value }))
                }
                className="text-xs font-semibold text-slate-800 bg-white border border-slate-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#0070CE]"
              />
            </div>
          </div>
        </div>

        {/* Recipient Toggles inheriting the shared schedule */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {/* Item 1: Notify Teachers */}
          <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faChalkboardTeacher} className="text-sm text-slate-400" />
                <label
                  htmlFor="toggle-birthday-teachers"
                  className="text-sm font-semibold text-slate-900 cursor-pointer block"
                >
                  Nhắc sinh nhật giáo viên
                </label>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Gửi thông báo nhắc sinh nhật các đồng nghiệp tới hòm thư cá nhân và app giáo viên.
              </p>
            </div>

            <button
              id="toggle-birthday-teachers"
              type="button"
              role="switch"
              aria-checked={birthday.notifyTeachers}
              onClick={() =>
                dispatch(
                  updateBirthdayToggle({
                    target: 'notifyTeachers',
                    value: !birthday.notifyTeachers,
                  })
                )
              }
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#0070CE] focus:ring-offset-2 mt-0.5 ${
                birthday.notifyTeachers ? 'bg-[#0070CE]' : 'bg-slate-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  birthday.notifyTeachers ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Item 2: Notify Admins */}
          <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faUserShield} className="text-sm text-slate-400" />
                <label
                  htmlFor="toggle-birthday-admins"
                  className="text-sm font-semibold text-slate-900 cursor-pointer block"
                >
                  Nhắc sinh nhật Admin nhà trường
                </label>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Gửi danh sách cán bộ, nhân sự có sinh nhật trong tháng tới ban giám hiệu và phòng nhân sự.
              </p>
            </div>

            <button
              id="toggle-birthday-admins"
              type="button"
              role="switch"
              aria-checked={birthday.notifyAdmins}
              onClick={() =>
                dispatch(
                  updateBirthdayToggle({
                    target: 'notifyAdmins',
                    value: !birthday.notifyAdmins,
                  })
                )
              }
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#0070CE] focus:ring-offset-2 mt-0.5 ${
                birthday.notifyAdmins ? 'bg-[#0070CE]' : 'bg-slate-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  birthday.notifyAdmins ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
