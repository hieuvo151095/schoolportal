import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { PortalLayout } from '../../../../components/layout/PortalLayout';
import { useAppDispatch } from '../../../../store';
import { addEvent } from '../../../../store/slices/calendarSlice';
import { addToast } from '../../../../store/slices/toastSlice';
import { EventForm } from '../../../../modules/school/calendar/EventForm';
import { EventFormData } from '../../../../types/calendar';

export default function CreateEventPage() {
  const router = useRouter();
  const schoolCode = (router.query.schoolCode as string) || 'demo';
  const dispatch = useAppDispatch();

  const handleCreateSubmit = (formData: EventFormData) => {
    dispatch(
      addEvent({
        schoolCode,
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
        message: `Đã thêm sự kiện "${formData.title}" vào lịch thành công!`,
      })
    );

    router.push(`/${schoolCode}/school/calendar`);
  };

  return (
    <PortalLayout schoolCode={schoolCode} noPadding>
      <Head>
        <title>Thêm sự kiện mới | School Operating Portal</title>
      </Head>

      <div className="h-full overflow-y-auto">
        <EventForm
          schoolCode={schoolCode}
          isEdit={false}
          onSubmit={handleCreateSubmit}
        />
      </div>
    </PortalLayout>
  );
}
