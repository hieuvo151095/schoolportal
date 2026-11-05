import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import PortalLayout from '@/components/layout/PortalLayout';
import { useAppDispatch } from '@/store';
import { createAnnouncement } from '@/store/slices/announcementSlice';
import { addToast } from '@/store/slices/toastSlice';
import AnnouncementComposer from '@/modules/school/announcements/AnnouncementComposer';

export default function CreateAnnouncementPage() {
  const router = useRouter();
  const schoolCode = (router.query.schoolCode as string) || 'demo';
  const dispatch = useAppDispatch();

  const handleSave = (payload: any, status: 'nhap' | 'da_len_lich' | 'da_gui') => {
    dispatch(createAnnouncement(payload));

    let successMessage = 'Đã lưu bản nháp thông báo thành công!';
    if (status === 'da_len_lich') {
      successMessage = 'Đã lên lịch phát hành thông báo thành công!';
    } else if (status === 'da_gui') {
      successMessage = 'Đã phát hành thông báo chính thức đến người nhận!';
    }

    dispatch(
      addToast({
        type: 'success',
        message: successMessage
      })
    );

    router.push(`/${schoolCode}/school/announcements`);
  };

  return (
    <PortalLayout schoolCode={schoolCode}>
      <Head>
        <title>Soạn Thông Báo Mới | School Operating Portal</title>
      </Head>

      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        <AnnouncementComposer
          schoolCode={schoolCode}
          onSave={handleSave}
        />
      </div>
    </PortalLayout>
  );
}
