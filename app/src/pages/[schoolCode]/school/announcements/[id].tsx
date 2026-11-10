import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import PortalLayout from '@/components/layout/PortalLayout';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  togglePinAnnouncement,
  deleteAnnouncement
} from '@/store/slices/announcementSlice';
import { addToast } from '@/store/slices/toastSlice';
import AnnouncementDetailView from '@/modules/school/announcements/AnnouncementDetailView';
import { Icon } from '@/components/ds';

export default function AnnouncementDetailPage() {
  const router = useRouter();
  const schoolCode = (router.query.schoolCode as string) || 'demo';
  const id = router.query.id as string;
  const dispatch = useAppDispatch();

  const announcement = useAppSelector(state =>
    state.announcement.announcements.find(a => a.id === id)
  );

  const handleTogglePin = (targetId: string) => {
    dispatch(togglePinAnnouncement({ id: targetId }));
    const wasPinned = announcement?.isPinned;
    dispatch(
      addToast({
        type: 'success',
        message: wasPinned
          ? 'Đã bỏ ghim thông báo khỏi đầu bảng'
          : 'Đã ghim thông báo lên đầu bảng tin'
      })
    );
  };

  const handleDelete = (targetId: string) => {
    dispatch(deleteAnnouncement({ id: targetId }));
    dispatch(
      addToast({
        type: 'success',
        message: 'Đã xóa thông báo thành công'
      })
    );
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
            Bản tin thông báo này có thể đã bị xóa hoặc không tồn tại trên hệ thống.
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
        <title>{announcement.title} | School Operating Portal</title>
      </Head>

      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        <AnnouncementDetailView
          schoolCode={schoolCode}
          announcement={announcement}
          onTogglePin={handleTogglePin}
          onDelete={handleDelete}
        />
      </div>
    </PortalLayout>
  );
}
