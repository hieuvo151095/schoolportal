import React from 'react';
import { Icon, SlideOver } from '@/components/ds';
import { Poll } from '@/types/poll';

interface DeletePollModalProps {
  poll: Poll | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (pollId: string) => void;
}

export const DeletePollModal: React.FC<DeletePollModalProps> = ({
  poll,
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!poll) return null;

  return (
    <SlideOver
      open={isOpen}
      onClose={onClose}
      title="Xác nhận xóa bình chọn"
      description="Hành động này sẽ xóa hoàn toàn bản nháp bình chọn khỏi hệ thống"
      icon="trash"
      width={480}
      primaryAction={{
        label: 'Xác nhận xóa',
        icon: 'trash',
        onClick: () => {
          onConfirm(poll.id);
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
            Xác nhận xóa bình chọn?
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
            Hành động này sẽ xóa hoàn toàn bản nháp bình chọn khỏi hệ thống và không thể phục hồi lại.
          </p>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
          <div className="text-xs text-slate-500">Tiêu đề bình chọn:</div>
          <div className="text-sm font-bold text-slate-800">&ldquo;{poll.title}&rdquo;</div>
        </div>

        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3">
          <Icon name="triangle-exclamation" size={18} className="text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs text-rose-900 leading-relaxed">
            Dữ liệu khảo sát và các tùy chọn phương án sẽ bị xóa vĩnh viễn.
          </div>
        </div>
      </div>
    </SlideOver>
  );
};
