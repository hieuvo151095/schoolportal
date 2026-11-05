import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import PortalLayout from '@/components/layout/PortalLayout';
import { useAppDispatch } from '@/store';
import { createPoll } from '@/store/slices/pollSlice';
import { CreatePollPayload } from '@/types/poll';
import { PollComposer } from '@/modules/school/poll/PollComposer';

export default function CreatePollPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { schoolCode } = router.query;
  const currentSchoolCode = (schoolCode as string) || 'demo';

  const handleSubmit = (payload: CreatePollPayload) => {
    dispatch(createPoll(payload));
    router.push(`/${currentSchoolCode}/school/poll`);
  };

  return (
    <PortalLayout>
      <Head>
        <title>Tạo cuộc bình chọn mới | SOHA School Portal</title>
      </Head>

      <PollComposer onSubmit={handleSubmit} isEditing={false} />
    </PortalLayout>
  );
}
