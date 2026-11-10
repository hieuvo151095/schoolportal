import React from 'react';
import { SlideOver } from '@/components/ds';
import AnnouncementComposer from './AnnouncementComposer';
import { Announcement } from '../../../types/announcement';

interface AnnouncementSlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  schoolCode: string;
  initialAnnouncement?: Announcement | null;
  isEditMode?: boolean;
  onSave: (payload: any, status: 'nhap' | 'da_len_lich' | 'da_gui') => void;
}

export const AnnouncementSlideOver: React.FC<AnnouncementSlideOverProps> = ({
  isOpen,
  onClose,
  schoolCode,
  initialAnnouncement,
  isEditMode,
  onSave,
}) => {
  return (
    <SlideOver
      open={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Chỉnh sửa thông báo' : 'Soạn thông báo mới'}
      description="Quản trị thông báo gửi phụ huynh, học sinh và cán bộ giáo viên"
      icon="bullhorn"
      width={720}
    >
      <div className="py-2">
        <AnnouncementComposer
          schoolCode={schoolCode}
          initialAnnouncement={initialAnnouncement || undefined}
          isEditMode={isEditMode}
          hideHeader={true}
          onSave={(payload, status) => {
            onSave(payload, status);
            onClose();
          }}
        />
      </div>
    </SlideOver>
  );
};

export default AnnouncementSlideOver;
