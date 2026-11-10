import React from 'react';
import { Icon, SlideOver } from '../../../components/ds';

interface DeleteAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  announcementTitle?: string;
  isBulk?: boolean;
  bulkCount?: number;
}

export const DeleteAnnouncementModal: React.FC<DeleteAnnouncementModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  announcementTitle,
  isBulk = false,
  bulkCount = 1,
}) => {
  return (
    <SlideOver
      open={isOpen}
      onClose={onClose}
      title={isBulk ? `Xác nhận xóa ${bulkCount} thông báo` : 'Xác nhận xóa thông báo'}
      description="Thao tác này sẽ gỡ bỏ bản tin khỏi hệ thống và không thể hoàn tác"
      icon="trash"
      width={480}
      primaryAction={{
        label: isBulk ? `Xóa ${bulkCount} thông báo` : 'Xóa thông báo',
        icon: 'trash',
        onClick: () => {
          onConfirm();
          onClose();
        },
      }}
      secondaryAction={{
        label: 'Hủy bỏ',
        onClick: onClose,
      }}
    >
      <div className="space-y-6">
        <div className="flex flex-col items-center text-center p-6 bg-rose-50 border border-rose-200 rounded-2xl">
          <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-2xl font-bold mb-3 border-2 border-rose-300">
            <Icon name="trash" size={28} />
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1">
            {isBulk ? `Xóa ${bulkCount} thông báo đã chọn?` : 'Xác nhận xóa bản tin?'}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
            Bản tin sẽ bị xóa hoàn toàn khỏi bảng tin của nhà trường và ứng dụng di động của phụ huynh.
          </p>
        </div>

        {!isBulk && announcementTitle && (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <div className="text-xs text-slate-500">Tiêu đề thông báo:</div>
            <div className="text-sm font-bold text-slate-800">&quot;{announcementTitle}&quot;</div>
          </div>
        )}

        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3">
          <Icon name="triangle-exclamation" size={18} className="text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs text-rose-900 leading-relaxed">
            Hành động này không thể hoàn tác. Các lượt đọc và xác nhận của phụ huynh đối với bản tin này cũng sẽ bị hủy bỏ.
          </div>
        </div>
      </div>
    </SlideOver>
  );
};

export default DeleteAnnouncementModal;
