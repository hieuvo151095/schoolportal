import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import PortalLayout from '@/components/layout/PortalLayout';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  updateDraftAnnouncement,
  publishAnnouncement,
  scheduleAnnouncement
} from '@/store/slices/announcementSlice';
import { addToast } from '@/store/slices/toastSlice';
import AnnouncementComposer from '@/modules/school/announcements/AnnouncementComposer';
import { Icon } from '@/components/ds';

export default function EditAnnouncementPage() {
  const router = useRouter();
  const schoolCode = (router.query.schoolCode as string) || 'demo';
  const id = router.query.id as string;
  const dispatch = useAppDispatch();

  const announcement = useAppSelector(state =>
    state.announcement.announcements.find(a => a.id === id)
  );

  const handleSave = (payload: any, status: 'nhap' | 'da_len_lich' | 'da_gui') => {
    if (!announcement) return;

    if (status === 'nhap') {
      dispatch(updateDraftAnnouncement({ id: announcement.id, updates: payload }));
      dispatch(
        addToast({
          type: 'success',
          message: 'Đã cập nhật bản nháp thành công!'
        })
      );
    } else if (status === 'da_len_lich') {
      dispatch(updateDraftAnnouncement({ id: announcement.id, updates: payload }));
      dispatch(
        scheduleAnnouncement({
          id: announcement.id,
          scheduledAt: payload.scheduledAt || new Date().toISOString()
        })
      );
      dispatch(
        addToast({
          type: 'success',
          message: 'Đã lên lịch phát hành thông báo thành công!'
        })
      );
    } else if (status === 'da_gui') {
      dispatch(updateDraftAnnouncement({ id: announcement.id, updates: payload }));
      dispatch(publishAnnouncement({ id: announcement.id }));
      dispatch(
        addToast({
          type: 'success',
          message: 'Đã phát hành thông báo chính thức đến người nhận!'
        })
      );
    }

    router.push(`/${schoolCode}/school/announcements`);
  };

  if (!announcement) {
    return (
      <PortalLayout schoolCode={schoolCode}>
        <div className="p-8 text-center max-w-md mx-auto my-12 bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="text-slate-400 mb-3 flex justify-center">
            <Icon name="circle-exclamation" className="w-8 h-8 text-slate-400" />
          </div>
          <h2 className="text-base font-bold text-slate-700 mb-1">
            Không tìm thấy thông báo
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Bản tin thông báo này không tồn tại hoặc đã bị xóa.
          </p>
          <Link
            href={`/${schoolCode}/school/announcements`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Icon name="arrow-left" className="w-4 h-4" />
            <span>Quay lại Bảng thông tin</span>
          </Link>
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout schoolCode={schoolCode}>
      <Head>
        <title>Chỉnh Sửa Thông Báo | School Operating Portal</title>
      </Head>

      <div className="space-y-6">
        <AnnouncementComposer
          schoolCode={schoolCode}
          initialAnnouncement={announcement}
          isEditMode={true}
          onSave={handleSave}
        />
      </div>
    </PortalLayout>
  );
}
