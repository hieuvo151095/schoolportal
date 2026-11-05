import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import PortalLayout from '@/components/layout/PortalLayout';
import { useAppSelector } from '@/store';
import { PollDetailCockpit } from '@/modules/school/poll/PollDetailCockpit';

export default function PollDetailPage() {
  const router = useRouter();
  const { pollId } = router.query;
  const targetId = (pollId as string) || '';

  const { polls } = useAppSelector((state) => state.poll);
  const poll = polls.find((p) => p.id === targetId);

  return (
    <PortalLayout>
      <Head>
        <title>{poll ? `${poll.title} | Chi tiết bình chọn` : 'Chi tiết bình chọn'} | SOHA School Portal</title>
      </Head>

      {targetId ? (
        <PollDetailCockpit pollId={targetId} />
      ) : (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-[#0070CE] rounded-full animate-spin"></div>
        </div>
      )}
    </PortalLayout>
  );
}
