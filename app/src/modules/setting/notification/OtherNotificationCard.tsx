import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBellConcierge,
  faComments,
  faClockRotateLeft,
  faBookOpen,
  faHeart,
  faMobileScreen,
  faEnvelope,
  faClock,
} from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  updateOtherToggle,
  updateOtherPendingApproval,
  updateOtherDailyDiary,
} from '../../../store/slices/notificationSettingsSlice';

export const OtherNotificationCard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentSettings } = useAppSelector(
    (state) => state.notificationSettings
  );
  const { other } = currentSettings;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Section Header */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
            <FontAwesomeIcon icon={faBellConcierge} className="text-sm" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              4. Khác
            </h2>
            <p className="text-xs text-slate-500">
              Kênh thông báo đa phương thức (Web/App & Email) cho duyệt hoạt động, nhật ký và tương tác
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Item 1: Tin nhắn trao đổi */}
        <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faComments} className="text-sm text-slate-400" />
              <label
                htmlFor="toggle-conv-admin"
                className="text-sm font-semibold text-slate-900 cursor-pointer block"
              >
                Thông báo tin nhắn trao đổi phụ huynh
              </label>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Gửi thông báo đẩy đến Quản trị viên khi có phụ huynh gửi tin nhắn mới trong phân hệ Trao Đổi.
            </p>
          </div>

          <button
            id="toggle-conv-admin"
            type="button"
            role="switch"
            aria-checked={other.conversationsNotifyAdmins}
            onClick={() =>
              dispatch(
                updateOtherToggle({
                  field: 'conversationsNotifyAdmins',
                  value: !other.conversationsNotifyAdmins,
                })
              )
            }
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#0070CE] focus:ring-offset-2 mt-0.5 ${
              other.conversationsNotifyAdmins ? 'bg-[#0070CE]' : 'bg-slate-300'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                other.conversationsNotifyAdmins ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Dual-Channel Grid: Hoạt động chờ duyệt & Nhật ký hằng ngày (BR05, K099) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Item 2: Hoạt động chờ duyệt (Dual Channel) */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-md bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
                <FontAwesomeIcon icon={faClockRotateLeft} className="text-xs" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Hoạt động chờ duyệt
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Thông báo đến Ban giám hiệu & Quản trị viên khi có bài viết hoặc album mới cần phê duyệt.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-slate-200/60">
              {/* Web & Ứng dụng */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200/70">
                <div className="flex items-center gap-1.5">
                  <FontAwesomeIcon icon={faMobileScreen} className="text-xs text-slate-400" />
                  <span className="text-xs font-medium text-slate-700">Web & App</span>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={other.pendingActivityApproval.webApp}
                  onClick={() =>
                    dispatch(
                      updateOtherPendingApproval({
                        channel: 'webApp',
                        value: !other.pendingActivityApproval.webApp,
                      })
                    )
                  }
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#0070CE] focus:ring-offset-2 ${
                    other.pendingActivityApproval.webApp ? 'bg-[#0070CE]' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      other.pendingActivityApproval.webApp ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Email */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200/70">
                <div className="flex items-center gap-1.5">
                  <FontAwesomeIcon icon={faEnvelope} className="text-xs text-slate-400" />
                  <span className="text-xs font-medium text-slate-700">Email</span>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={other.pendingActivityApproval.email}
                  onClick={() =>
                    dispatch(
                      updateOtherPendingApproval({
                        channel: 'email',
                        value: !other.pendingActivityApproval.email,
                      })
                    )
                  }
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#0070CE] focus:ring-offset-2 ${
                    other.pendingActivityApproval.email ? 'bg-[#0070CE]' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      other.pendingActivityApproval.email ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Item 3: Nhật ký hằng ngày (Dual Channel & Fixed 20:00 BR06, K100) */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-md bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
                  <FontAwesomeIcon icon={faBookOpen} className="text-xs" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Nhật ký hằng ngày
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Nhắc nhở giáo viên và quản lý kiểm tra nội dung nhật ký lớp học.
                  </p>
                </div>
              </div>

              {/* Fixed readonly time 20:00 */}
              <div className="flex items-center gap-1.5 shrink-0 bg-slate-200/80 px-2 py-0.5 rounded border border-slate-300">
                <FontAwesomeIcon icon={faClock} className="text-xs text-slate-500" />
                <span className="text-xs font-semibold text-slate-600 select-none">
                  {other.dailyActivityDiary.time}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-slate-200/60">
              {/* Web & Ứng dụng */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200/70">
                <div className="flex items-center gap-1.5">
                  <FontAwesomeIcon icon={faMobileScreen} className="text-xs text-slate-400" />
                  <span className="text-xs font-medium text-slate-700">Web & App</span>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={other.dailyActivityDiary.webApp}
                  onClick={() =>
                    dispatch(
                      updateOtherDailyDiary({
                        channel: 'webApp',
                        value: !other.dailyActivityDiary.webApp,
                      })
                    )
                  }
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#0070CE] focus:ring-offset-2 ${
                    other.dailyActivityDiary.webApp ? 'bg-[#0070CE]' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      other.dailyActivityDiary.webApp ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Email */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200/70">
                <div className="flex items-center gap-1.5">
                  <FontAwesomeIcon icon={faEnvelope} className="text-xs text-slate-400" />
                  <span className="text-xs font-medium text-slate-700">Email</span>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={other.dailyActivityDiary.email}
                  onClick={() =>
                    dispatch(
                      updateOtherDailyDiary({
                        channel: 'email',
                        value: !other.dailyActivityDiary.email,
                      })
                    )
                  }
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#0070CE] focus:ring-offset-2 ${
                    other.dailyActivityDiary.email ? 'bg-[#0070CE]' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      other.dailyActivityDiary.email ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Item 4: Bài viết được yêu thích */}
        <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faHeart} className="text-sm text-rose-500" />
              <label
                htmlFor="toggle-post-favorited"
                className="text-sm font-semibold text-slate-900 cursor-pointer block"
              >
                Thông báo bài viết được yêu thích
              </label>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Gửi thông báo tới Giáo viên khi phụ huynh thả tim hoặc yêu thích bài đăng hoạt động, hình ảnh của lớp.
            </p>
          </div>

          <button
            id="toggle-post-favorited"
            type="button"
            role="switch"
            aria-checked={other.postFavoritedNotifyTeachers}
            onClick={() =>
              dispatch(
                updateOtherToggle({
                  field: 'postFavoritedNotifyTeachers',
                  value: !other.postFavoritedNotifyTeachers,
                })
              )
            }
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#0070CE] focus:ring-offset-2 mt-0.5 ${
              other.postFavoritedNotifyTeachers ? 'bg-[#0070CE]' : 'bg-slate-300'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                other.postFavoritedNotifyTeachers ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};
