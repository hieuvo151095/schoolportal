import React from 'react';
import { Icon, SlideOver } from '../../../components/ds';
import { SchoolEvent } from '../../../types/calendar';

interface EventDeleteConfirmModalProps {
  isOpen: boolean;
  event: SchoolEvent | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const EventDeleteConfirmModal: React.FC<EventDeleteConfirmModalProps> = ({
  isOpen,
  event,
  onConfirm,
  onCancel,
}) => {
  if (!event) return null;

  return (
    <SlideOver
      open={isOpen}
      onClose={onCancel}
      title="Xác nhận xóa sự kiện"
      description="Thao tác này sẽ gỡ bỏ sự kiện khỏi lịch trường và phụ huynh"
      icon="trash"
      width={480}
      primaryAction={{
        label: 'Xác nhận xóa',
        icon: 'trash',
        onClick: onConfirm,
      }}
      secondaryAction={{
        label: 'Hủy bỏ',
        onClick: onCancel,
      }}
    >
      <div className="space-y-6">
        <div className="flex flex-col items-center text-center p-6 bg-rose-50 border border-rose-200 rounded-2xl">
          <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-2xl font-bold mb-3 border-2 border-rose-300">
            <Icon name="trash" size={28} />
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1">
            Xác nhận xóa sự kiện?
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
            Vui lòng xác nhận xóa sự kiện <strong className="text-slate-800">&quot;{event.title}&quot;</strong> khỏi lịch hoạt động.
          </p>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Tên sự kiện:</span>
            <span className="font-bold text-slate-800">{event.title}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Thời gian bắt đầu:</span>
            <span className="font-semibold text-slate-700">{event.startDate}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Phân loại:</span>
            <span className="font-semibold text-slate-700">{event.category}</span>
          </div>
        </div>

        {event.category === 'ngay_nghi' && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
            <Icon name="triangle-exclamation" size={18} className="text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 leading-relaxed">
              <strong className="font-semibold block mb-0.5">Lưu ý ngày nghỉ:</strong>
              Sự kiện này đang là Ngày nghỉ chính thức. Việc xóa sự kiện có thể thay đổi số ngày khấu trừ hoàn tiền ăn của học sinh trong tháng.
            </div>
          </div>
        )}
      </div>
    </SlideOver>
  );
};
