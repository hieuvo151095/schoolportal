import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faComments,
  faShieldHalved,
  faCheckCircle,
} from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  setActivityToggle,
  saveActivitySettings,
  clearToast,
} from '../../../store/slices/featureFlagsSlice';
import { isActivitySettingsDirty } from '../../../utils/featureFlagsValidation';

export const ActivitySettingsTab: React.FC = () => {
  const dispatch = useAppDispatch();
  const { activitySettings, savedActivitySettings, toastMessage } =
    useAppSelector((state) => state.featureFlags);

  const isDirty = isActivitySettingsDirty(
    activitySettings,
    savedActivitySettings
  );

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        dispatch(clearToast());
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage, dispatch]);

  const handleToggleComments = () => {
    dispatch(
      setActivityToggle({
        key: 'allowComments',
        value: !activitySettings.allowComments,
      })
    );
  };

  const handleToggleModeration = () => {
    dispatch(
      setActivityToggle({
        key: 'requireCommentModeration',
        value: !activitySettings.requireCommentModeration,
      })
    );
  };

  const handleSave = () => {
    if (!isDirty) return;
    dispatch(saveActivitySettings());
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg animate-fade-in text-sm font-medium">
          <FontAwesomeIcon icon={faCheckCircle} className="text-base" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Settings Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="border-b border-slate-100 pb-4 mb-6">
          <h2 className="text-base font-bold text-slate-900">
            Cấu hình tương tác trên hoạt động lớp
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Thiết lập quyền bình luận và quy trình duyệt kiểm duyệt bình luận cho bài đăng hoạt động hàng ngày.
          </p>
        </div>

        <div className="space-y-6">
          {/* Toggle 1: Bình luận */}
          <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 transition-colors">
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-blue-100 text-[#0070CE] flex items-center justify-center shrink-0 mt-0.5">
                <FontAwesomeIcon icon={faComments} className="text-sm" />
              </div>
              <div>
                <label
                  htmlFor="toggle-comments"
                  className="text-sm font-semibold text-slate-900 cursor-pointer block"
                >
                  Bình luận
                </label>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  Cho phép phụ huynh và giáo viên tham gia viết bình luận, phản hồi dưới các bài đăng hoạt động của lớp học.
                </p>
              </div>
            </div>

            <button
              id="toggle-comments"
              type="button"
              role="switch"
              aria-checked={activitySettings.allowComments}
              onClick={handleToggleComments}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#0070CE] focus:ring-offset-2 mt-1 ${
                activitySettings.allowComments ? 'bg-[#0070CE]' : 'bg-slate-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  activitySettings.allowComments
                    ? 'translate-x-5'
                    : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Toggle 2: Duyệt bình luận (Strictly Independent from Toggle 1, BR02, K090) */}
          <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 transition-colors">
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                <FontAwesomeIcon icon={faShieldHalved} className="text-sm" />
              </div>
              <div>
                <label
                  htmlFor="toggle-moderation"
                  className="text-sm font-semibold text-slate-900 cursor-pointer block"
                >
                  Duyệt bình luận
                </label>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  Bắt buộc bình luận mới phải được giáo viên phụ trách hoặc quản trị viên duyệt trước khi hiển thị công khai cho mọi người.
                </p>
              </div>
            </div>

            <button
              id="toggle-moderation"
              type="button"
              role="switch"
              aria-checked={activitySettings.requireCommentModeration}
              onClick={handleToggleModeration}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#0070CE] focus:ring-offset-2 mt-1 ${
                activitySettings.requireCommentModeration
                  ? 'bg-[#0070CE]'
                  : 'bg-slate-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  activitySettings.requireCommentModeration
                    ? 'translate-x-5'
                    : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Submit Action Area (BR03 & K091: Dirty-State Invariant) */}
        <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            {isDirty
              ? 'Có thay đổi chưa được lưu'
              : 'Cấu hình đang đồng bộ với hệ thống'}
          </span>

          <button
            type="button"
            disabled={!isDirty}
            onClick={handleSave}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 shadow-sm ${
              isDirty
                ? 'bg-[#0070CE] text-white hover:bg-blue-700 active:scale-[0.98]'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200 shadow-none'
            }`}
          >
            Cập nhật
          </button>
        </div>
      </div>
    </div>
  );
};
