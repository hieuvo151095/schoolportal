import React from 'react';
import { SlideOver, Icon } from '@/components/ds';

interface UnsavedChangesModalProps {
  isOpen: boolean;
  dirtyBlocks: string[];
  onConfirmLeave: () => void;
  onStay: () => void;
}

export const UnsavedChangesModal: React.FC<UnsavedChangesModalProps> = ({
  isOpen,
  dirtyBlocks,
  onConfirmLeave,
  onStay,
}) => {
  return (
    <SlideOver
      open={isOpen}
      onClose={onStay}
      title="Có thay đổi chưa được lưu!"
      description="Bạn có các thay đổi chưa lưu trong cấu hình thu phí"
      icon="triangle-exclamation"
      width={460}
      primaryAction={{
        label: 'Xác nhận rời khỏi',
        icon: 'arrow-right-from-bracket',
        tone: 'danger',
        onClick: onConfirmLeave,
      }}
      secondaryAction={{
        label: 'Ở lại lưu thay đổi',
        onClick: onStay,
      }}
    >
      <div className="space-y-4 py-2">
        <div className="p-3.5 bg-amber-50 border border-amber-200/80 rounded-xl flex items-start gap-2.5 text-xs text-amber-900">
          <Icon name="triangle-exclamation" size={14} className="text-amber-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed font-medium">
            Bạn có các thay đổi chưa lưu trong các mục cấu hình dưới đây. Nếu rời khỏi trang, những thay đổi này sẽ bị hủy bỏ.
          </p>
        </div>

        {/* Dirty Blocks List */}
        <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            Mục cấu hình có thay đổi:
          </p>
          <ul className="space-y-1.5">
            {dirtyBlocks.map((blockName) => (
              <li
                key={blockName}
                className="flex items-center gap-2 text-xs font-semibold text-slate-700"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span>{blockName}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SlideOver>
  );
};

export default UnsavedChangesModal;
