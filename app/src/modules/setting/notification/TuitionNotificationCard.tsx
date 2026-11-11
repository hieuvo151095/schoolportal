import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMoneyBillWave,
  faFileInvoiceDollar,
  faCalendarCheck,
  faHourglassHalf,
  faUsers,
  faUserShield,
} from '@fortawesome/free-solid-svg-icons';
import { Dropdown } from '@/components/ds';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  updateTuitionChangeToggle,
  updateTuitionGracePeriod,
  updateTuitionDueReminder,
} from '../../../store/slices/notificationSettingsSlice';
import { TuitionDueTiming } from '../../../types/notificationSettings';
import { formatTuitionDueSummary } from '../../../utils/notificationSettingsValidation';

export const TuitionNotificationCard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentSettings } = useAppSelector(
    (state) => state.notificationSettings
  );
  const { tuition } = currentSettings;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Section Header */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <FontAwesomeIcon icon={faMoneyBillWave} className="text-sm" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              3. Học phí
            </h2>
            <p className="text-xs text-slate-500">
              Cấu hình thông báo phát hành phiếu thu, nhắc gia hạn và lịch nhắc hạn nộp học phí
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Item 1: Thông báo thay đổi học phí (Biểu phí mới hoặc sửa đổi) */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-md bg-emerald-100/70 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
              <FontAwesomeIcon icon={faFileInvoiceDollar} className="text-xs" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Thông báo thay đổi biểu phí & phát hành phiếu thu
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Tự động gửi thông báo khi kế toán điều chỉnh khoản thu hoặc tạo kỳ thu học phí mới.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200/60">
            {/* Phụ huynh */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200/70">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faUsers} className="text-xs text-slate-400" />
                <span className="text-xs font-medium text-slate-700">Gửi cho Phụ huynh</span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={tuition.tuitionChangeNotifyParents}
                onClick={() =>
                  dispatch(
                    updateTuitionChangeToggle({
                      target: 'tuitionChangeNotifyParents',
                      value: !tuition.tuitionChangeNotifyParents,
                    })
                  )
                }
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#0070CE] focus:ring-offset-2 ${
                  tuition.tuitionChangeNotifyParents ? 'bg-[#0070CE]' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    tuition.tuitionChangeNotifyParents ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Quản trị viên */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200/70">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faUserShield} className="text-xs text-slate-400" />
                <span className="text-xs font-medium text-slate-700">Gửi cho Quản trị viên</span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={tuition.tuitionChangeNotifyAdmins}
                onClick={() =>
                  dispatch(
                    updateTuitionChangeToggle({
                      target: 'tuitionChangeNotifyAdmins',
                      value: !tuition.tuitionChangeNotifyAdmins,
                    })
                  )
                }
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#0070CE] focus:ring-offset-2 ${
                  tuition.tuitionChangeNotifyAdmins ? 'bg-[#0070CE]' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    tuition.tuitionChangeNotifyAdmins ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Item 2 & Item 3: Gia hạn học phí & Nhắc học phí đến hạn */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Item 2: Thông báo gia hạn học phí */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faCalendarCheck} className="text-xs text-slate-400" />
                  <label
                    htmlFor="toggle-tuition-grace"
                    className="text-sm font-semibold text-slate-900 cursor-pointer block"
                  >
                    Thông báo gia hạn học phí
                  </label>
                </div>

                <button
                  id="toggle-tuition-grace"
                  type="button"
                  role="switch"
                  aria-checked={tuition.gracePeriod.notifyParents}
                  onClick={() =>
                    dispatch(
                      updateTuitionGracePeriod({
                        notifyParents: !tuition.gracePeriod.notifyParents,
                      })
                    )
                  }
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#0070CE] focus:ring-offset-2 ${
                    tuition.gracePeriod.notifyParents ? 'bg-[#0070CE]' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      tuition.gracePeriod.notifyParents ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Nhắc nhở phụ huynh về ngày gia hạn đóng tiền của đợt thu học phí.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60">
              <span className="text-xs text-slate-600 font-medium whitespace-nowrap">
                Gửi nhắc vào:
              </span>
              <Dropdown
                placeholder="Chọn ngày gửi"
                options={Array.from({ length: 31 }, (_, i) => i + 1).map((day) => ({
                  value: String(day),
                  label: `Ngày ${day} hàng tháng`,
                }))}
                value={String(tuition.gracePeriod.dayOfMonth)}
                onChange={(val) =>
                  dispatch(
                    updateTuitionGracePeriod({
                      dayOfMonth: parseInt(val, 10),
                    })
                  )
                }
                size="sm"
                className="min-w-[170px]"
              />
            </div>
          </div>

          {/* Item 3: Thông báo học phí đến hạn (Directional Timing BR08, K102) */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faHourglassHalf} className="text-xs text-slate-400" />
                  <label
                    htmlFor="toggle-tuition-due"
                    className="text-sm font-semibold text-slate-900 cursor-pointer block"
                  >
                    Thông báo học phí đến hạn
                  </label>
                </div>

                <button
                  id="toggle-tuition-due"
                  type="button"
                  role="switch"
                  aria-checked={tuition.dueReminder.notifyParents}
                  onClick={() =>
                    dispatch(
                      updateTuitionDueReminder({
                        notifyParents: !tuition.dueReminder.notifyParents,
                      })
                    )
                  }
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#0070CE] focus:ring-offset-2 ${
                    tuition.dueReminder.notifyParents ? 'bg-[#0070CE]' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      tuition.dueReminder.notifyParents ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Tự động gửi thông báo theo mốc: <span className="font-semibold text-slate-700">{formatTuitionDueSummary(tuition.dueReminder.timing, tuition.dueReminder.days)}</span>.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200/60">
              <Dropdown
                placeholder="Chọn thời điểm nhắc"
                options={[
                  { value: 'before', label: 'Trước hạn đóng học phí' },
                  { value: 'after', label: 'Sau hạn đóng học phí' },
                ]}
                value={tuition.dueReminder.timing}
                onChange={(val) =>
                  dispatch(
                    updateTuitionDueReminder({
                      timing: val as TuitionDueTiming,
                    })
                  )
                }
                size="sm"
                className="min-w-[190px]"
              />

              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min={1}
                  max={31}
                  value={tuition.dueReminder.days}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    if (!isNaN(val) && val >= 1 && val <= 31) {
                      dispatch(updateTuitionDueReminder({ days: val }));
                    }
                  }}
                  aria-label="Số ngày nhắc nhở học phí đến hạn"
                  className="w-12 px-2 py-1 text-xs font-bold text-center text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0070CE]"
                />
                <span className="text-xs text-slate-600 font-medium">ngày</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
