import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { PortalLayout } from '../../../../../components/layout/PortalLayout';
import { useAppDispatch, useAppSelector } from '../../../../../store';
import { updateEvent } from '../../../../../store/slices/calendarSlice';
import { addToast } from '../../../../../store/slices/toastSlice';
import { EventForm } from '../../../../../modules/school/calendar/EventForm';
import { EventFormData } from '../../../../../types/calendar';

export default function EditEventPage() {
  const router = useRouter();
  const schoolCode = (router.query.schoolCode as string) || 'demo';
  const eventId = router.query.eventId as string;

  const dispatch = useAppDispatch();
  const events = useAppSelector((state) => state.calendar.events);

  const existingEvent = events.find((ev) => ev.id === eventId);

  const handleUpdateSubmit = (formData: EventFormData) => {
    if (!existingEvent) return;

    dispatch(
      updateEvent({
        id: existingEvent.id,
        title: formData.title,
        category: formData.category,
        startDate: formData.startDate,
        endDate: formData.endDate,
        hasSpecificTime: formData.hasSpecificTime,
        startTime: formData.startTime,
        endTime: formData.endTime,
        location: formData.location,
        description: formData.description,
        coverImage: formData.coverImage,
        attachments: formData.attachments,
      })
    );

    dispatch(
      addToast({
        type: 'success',
        message: `Đã cập nhật sự kiện "${formData.title}" thành công!`,
      })
    );

    router.push(`/${schoolCode}/school/calendar`);
  };

  if (!router.isReady) {
    return null;
  }

  if (!existingEvent) {
    return (
      <PortalLayout schoolCode={schoolCode}>
        <Head>
          <title>Không tìm thấy sự kiện | School Operating Portal</title>
        </Head>
        <div className="max-w-md mx-auto mt-20 text-center bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
          <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
            !
          </div>
          <h2 className="text-base font-bold text-gray-900 mb-2">
            Không tìm thấy sự kiện
          </h2>
          <p className="text-xs text-gray-500 mb-6">
            Sự kiện với mã <span className="font-semibold">{eventId}</span> không tồn tại hoặc đã bị xóa.
          </p>
          <Link
            href={`/${schoolCode}/school/calendar`}
            className="inline-flex items-center justify-center px-4 py-2 bg-[#0070CE] hover:bg-[#005bb5] text-white rounded-lg text-xs font-semibold shadow-sm transition"
          >
            Quay lại lịch sự kiện
          </Link>
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout schoolCode={schoolCode} noPadding>
      <Head>
        <title>Chỉnh sửa sự kiện | {existingEvent.title}</title>
      </Head>

      <div className="h-full overflow-y-auto">
        <EventForm
          schoolCode={schoolCode}
          isEdit={true}
          initialData={{
            title: existingEvent.title,
            category: existingEvent.category,
            startDate: existingEvent.startDate,
            endDate: existingEvent.endDate,
            hasSpecificTime: existingEvent.hasSpecificTime,
            startTime: existingEvent.startTime,
            endTime: existingEvent.endTime,
            location: existingEvent.location,
            description: existingEvent.description,
            coverImage: existingEvent.coverImage,
            attachments: existingEvent.attachments,
          }}
          onSubmit={handleUpdateSubmit}
        />
      </div>
    </PortalLayout>
  );
}
