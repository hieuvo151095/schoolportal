import React from 'react';
import { SlideOver } from '@/components/ds';
import { EventForm } from './EventForm';
import { EventFormData } from '../../../types/calendar';

interface CreateEventSlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  schoolCode: string;
  initialData?: Partial<EventFormData>;
  isEdit?: boolean;
  onSubmit: (data: EventFormData) => void;
}

export const CreateEventSlideOver: React.FC<CreateEventSlideOverProps> = ({
  isOpen,
  onClose,
  schoolCode,
  initialData,
  isEdit = false,
  onSubmit,
}) => {
  return (
    <SlideOver
      open={isOpen}
      onClose={onClose}
      title={isEdit ? 'Chỉnh sửa sự kiện nhà trường' : 'Thêm sự kiện mới'}
      description="Quản lý lịch năm học, ngày nghỉ lễ, thi cử và hoạt động ngoại khóa"
      icon="calendar-days"
      width={700}
    >
      <div className="py-2">
        <EventForm
          schoolCode={schoolCode}
          initialData={initialData}
          isEdit={isEdit}
          hideHeader={true}
          onCancel={onClose}
          onSubmit={(data) => {
            onSubmit(data);
            onClose();
          }}
        />
      </div>
    </SlideOver>
  );
};

export default CreateEventSlideOver;
