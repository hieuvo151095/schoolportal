import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFloppyDisk, faRotateLeft, faClockRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  openConfirmModal,
  resetWorkingSettings,
} from '../../../store/slices/notificationSettingsSlice';
import { isNotificationSettingsDirty } from '../../../utils/notificationSettingsValidation';

export const NotificationActionBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentSettings, savedSettings } = useAppSelector(
    (state) => state.notificationSettings
  );

  const isDirty = isNotificationSettingsDirty(currentSettings, savedSettings);

  const handleUpdateClick = () => {
    if (!isDirty) return;
    dispatch(openConfirmModal());
  };

  const handleResetClick = () => {
    if (!isDirty) return;
    dispatch(resetWorkingSettings());
  };

  return (
    <div className="sticky bottom-0 z-20 bg-white/95 backdrop-blur-md border-t border-slate-200 py-3.5 px-4 sm:px-6 shadow-lg rounded-b-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      {/* Last Updated Timestamp */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <FontAwesomeIcon icon={faClockRotateLeft} className="text-slate-400" />
        {currentSettings.updatedAt ? (
          <span>
            Lần cập nhật gần nhất:{' '}
            <strong className="font-semibold text-slate-700">
              {new Date(currentSettings.updatedAt).toLocaleDateString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })}
            </strong>{' '}
            bởi {currentSettings.updatedBy || 'Quản trị viên'}
          </span>
        ) : (
          <span>Chưa có lịch sử cập nhật cấu hình.</span>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2.5 self-end sm:self-auto">
        {isDirty && (
          <button
            type="button"
            onClick={handleResetClick}
            className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <FontAwesomeIcon icon={faRotateLeft} className="text-xs" />
            Khôi phục
          </button>
        )}

        <button
          type="button"
          disabled={!isDirty}
          onClick={handleUpdateClick}
          className={`px-5 py-2 text-xs font-semibold rounded-lg shadow-xs flex items-center gap-2 transition-all duration-150 cursor-pointer ${
            isDirty
              ? 'bg-[#0070CE] hover:bg-[#005bb0] text-white active:scale-98 shadow-blue-500/20'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed select-none'
          }`}
        >
          <FontAwesomeIcon icon={faFloppyDisk} className="text-xs" />
          Cập nhật
        </button>
      </div>
    </div>
  );
};
