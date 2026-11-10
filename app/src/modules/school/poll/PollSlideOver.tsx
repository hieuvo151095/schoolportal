import React from 'react';
import { SlideOver } from '@/components/ds';
import { PollComposer } from './PollComposer';
import { CreatePollPayload, Poll } from '@/types/poll';

interface PollSlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  initialPoll?: Poll | null;
  isEditing?: boolean;
  onSubmit: (payload: CreatePollPayload) => void;
}

export const PollSlideOver: React.FC<PollSlideOverProps> = ({
  isOpen,
  onClose,
  initialPoll,
  isEditing,
  onSubmit,
}) => {
  return (
    <SlideOver
      open={isOpen}
      onClose={onClose}
      title={isEditing ? 'Chỉnh sửa cuộc bình chọn' : 'Tạo cuộc bình chọn mới'}
      description="Khảo sát lấy ý kiến phụ huynh và học sinh toàn trường hoặc theo lớp"
      icon="square-poll-vertical"
      width={680}
    >
      <div className="py-2">
        <PollComposer
          initialPoll={initialPoll || undefined}
          isEditing={isEditing}
          hideHeader={true}
          onCancel={onClose}
          onSubmit={(payload) => {
            onSubmit(payload);
            onClose();
          }}
        />
      </div>
    </SlideOver>
  );
};

export default PollSlideOver;
