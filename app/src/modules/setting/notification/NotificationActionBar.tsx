import React from 'react';
import { Button, Icon } from '@/components/ds';
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
    <div className="sticky bottom-0 z-20 bg-white/95 backdrop-blur-md border-t border-[var(--border-default)] py-3 px-4 sm:px-6 shadow-lg rounded-b-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      {/* Last Updated Timestamp */}
      <div className="flex items-center gap-2 text-xs text-[var(--text-subtle)]">
        <Icon name="clock" size={14} color="var(--text-subtle)" />
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
          <Button
            variant="secondary"
            icon="rotate-right"
            onClick={handleResetClick}
          >
            Khôi phục
          </Button>
        )}

        <Button
          variant="primary"
          icon="check"
          disabled={!isDirty}
          onClick={handleUpdateClick}
        >
          Cập nhật cấu hình
        </Button>
      </div>
    </div>
  );
};

export default NotificationActionBar;
