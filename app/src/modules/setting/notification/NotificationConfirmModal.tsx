import React from 'react';
import { SlideOver, Icon } from '@/components/ds';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  closeConfirmModal,
  saveNotificationSettings,
} from '../../../store/slices/notificationSettingsSlice';

export const NotificationConfirmModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isConfirmModalOpen } = useAppSelector(
    (state) => state.notificationSettings
  );

  if (!isConfirmModalOpen) return null;

  const handleCancel = () => {
    dispatch(closeConfirmModal());
  };

  const handleConfirm = () => {
    dispatch(saveNotificationSettings());
  };

  return (
    <SlideOver
      open={isConfirmModalOpen}
      onClose={handleCancel}
      title="Xác nhận thay đổi cấu hình thông báo"
      description="Vui lòng xác nhận áp dụng các thiết lập thông báo cho toàn trường"
      icon="triangle-exclamation"
      width={460}
      primaryAction={{
        label: 'Xác nhận lưu',
        icon: 'check',
        onClick: handleConfirm,
      }}
      secondaryAction={{
        label: 'Hủy bỏ',
        onClick: handleCancel,
      }}
    >
      <div className="space-y-4 py-2">
        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-xs text-amber-900">
          <Icon name="triangle-exclamation" size={14} className="text-amber-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Thay đổi sẽ có hiệu lực ngay lập tức trên toàn trường và đồng bộ tới ứng dụng di động của giáo viên và phụ huynh.
          </p>
        </div>

        <p className="text-xs text-slate-600">
          Vui lòng kiểm tra kỹ các kênh thông báo đã chọn (Zalo, App push, SMS) trước khi hoàn tất.
        </p>
      </div>
    </SlideOver>
  );
};

export default NotificationConfirmModal;
