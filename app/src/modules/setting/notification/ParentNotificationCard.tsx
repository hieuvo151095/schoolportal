import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHandsHoldingChild,
  faClipboardUser,
  faShapes,
  faImages,
} from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch, useAppSelector } from '../../../store';
import { updateParentToggle } from '../../../store/slices/notificationSettingsSlice';

export const ParentNotificationCard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentSettings } = useAppSelector(
    (state) => state.notificationSettings
  );
  const { parent } = currentSettings;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Section Header */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
            <FontAwesomeIcon icon={faHandsHoldingChild} className="text-sm" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              5. Phụ huynh nhận thông báo
            </h2>
            <p className="text-xs text-slate-500">
              Cấu hình các sự kiện tương tác tự động gửi thông báo đẩy tới ứng dụng di động của phụ huynh
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Item 1: Điểm danh (BR10, K103: Orange Highlighted Keyword) */}
        <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faClipboardUser} className="text-sm text-slate-400" />
              <label
                htmlFor="toggle-parent-attendance"
                className="text-sm font-semibold text-slate-900 cursor-pointer block"
              >
                Thông báo khi <span className="font-bold text-[#EA580C]">điểm danh</span> học sinh
              </label>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Tự động gửi thông báo đẩy đến phụ huynh khi giáo viên hoàn tất điểm danh đến lớp, báo vắng hoặc điểm danh trả trẻ.
            </p>
          </div>

          <button
            id="toggle-parent-attendance"
            type="button"
            role="switch"
            aria-checked={parent.onStudentAttendance}
            onClick={() =>
              dispatch(
                updateParentToggle({
                  field: 'onStudentAttendance',
                  value: !parent.onStudentAttendance,
                })
              )
            }
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#0070CE] focus:ring-offset-2 mt-0.5 ${
              parent.onStudentAttendance ? 'bg-[#0070CE]' : 'bg-slate-300'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                parent.onStudentAttendance ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Item 2: Hoạt động (BR10, K103: Orange Highlighted Keyword) */}
        <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faShapes} className="text-sm text-slate-400" />
              <label
                htmlFor="toggle-parent-activity"
                className="text-sm font-semibold text-slate-900 cursor-pointer block"
              >
                Thông báo khi học sinh được gắn thẻ vào <span className="font-bold text-[#EA580C]">hoạt động</span>
              </label>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Gửi thông báo cập nhật khi có bài đăng hoạt động học tập, dã ngoại hoặc bài học mới được gắn thẻ học sinh.
            </p>
          </div>

          <button
            id="toggle-parent-activity"
            type="button"
            role="switch"
            aria-checked={parent.onStudentAddedToActivity}
            onClick={() =>
              dispatch(
                updateParentToggle({
                  field: 'onStudentAddedToActivity',
                  value: !parent.onStudentAddedToActivity,
                })
              )
            }
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#0070CE] focus:ring-offset-2 mt-0.5 ${
              parent.onStudentAddedToActivity ? 'bg-[#0070CE]' : 'bg-slate-300'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                parent.onStudentAddedToActivity ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Item 3: Album & Hình/Video (BR10, K103: Orange Highlighted Keywords) */}
        <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faImages} className="text-sm text-slate-400" />
              <label
                htmlFor="toggle-parent-media"
                className="text-sm font-semibold text-slate-900 cursor-pointer block"
              >
                Thông báo khi học sinh xuất hiện trong <span className="font-bold text-[#EA580C]">album</span> hoặc <span className="font-bold text-[#EA580C]">hình/video</span>
              </label>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Thông báo cho phụ huynh khi hệ thống nhận diện khuôn mặt AI phát hiện học sinh hoặc giáo viên tải ảnh/video mới lên thư viện.
            </p>
          </div>

          <button
            id="toggle-parent-media"
            type="button"
            role="switch"
            aria-checked={parent.onStudentMediaAdded}
            onClick={() =>
              dispatch(
                updateParentToggle({
                  field: 'onStudentMediaAdded',
                  value: !parent.onStudentMediaAdded,
                })
              )
            }
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#0070CE] focus:ring-offset-2 mt-0.5 ${
              parent.onStudentMediaAdded ? 'bg-[#0070CE]' : 'bg-slate-300'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                parent.onStudentMediaAdded ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};
