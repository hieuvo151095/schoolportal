import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Icon } from '@/components/ds';
import PortalLayout from '@/components/layout/PortalLayout';
import { useAppDispatch, useAppSelector } from '@/store';
import { updatePoll } from '@/store/slices/pollSlice';
import { CreatePollPayload } from '@/types/poll';
import { PollComposer } from '@/modules/school/poll/PollComposer';

export default function EditPollPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { schoolCode, pollId } = router.query;
  const currentSchoolCode = (schoolCode as string) || 'demo';
  const targetId = (pollId as string) || '';

  const { polls } = useAppSelector((state) => state.poll);
  const poll = polls.find((p) => p.id === targetId);

  if (!poll) {
    return (
      <PortalLayout>
        <Head>
          <title>Chỉnh sửa bình chọn | SOHA School Portal</title>
        </Head>
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 mb-2">Không tìm thấy cuộc bình chọn</h2>
          <p className="text-sm text-slate-500 mb-6">
            Cuộc bình chọn không tồn tại hoặc đã bị xóa.
          </p>
          <Link
            href={`/${currentSchoolCode}/school/poll`}
            className="inline-flex items-center px-4 py-2 rounded-xl bg-[#0070CE] text-white text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Icon name="arrow-left" className="mr-2 w-4 h-4" />
            Quay lại danh sách
          </Link>
        </div>
      </PortalLayout>
    );
  }

  // Invariant BR02 / K044: Guard against editing active or closed polls
  if (poll.status !== 'da_tao') {
    return (
      <PortalLayout>
        <Head>
          <title>Không thể chỉnh sửa | SOHA School Portal</title>
        </Head>
        <div className="bg-white rounded-2xl border border-amber-200 p-8 text-center max-w-lg mx-auto mt-12 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4 text-2xl">
            <Icon name="triangle-exclamation" className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-bold text-slate-800 mb-2">Không thể chỉnh sửa cuộc bình chọn</h2>
          <p className="text-xs text-slate-600 mb-6 leading-relaxed">
            Chỉ những cuộc bình chọn ở trạng thái <strong className="text-slate-800">&ldquo;Bản nháp&rdquo;</strong> mới được phép chỉnh sửa nội dung hoặc phương án để bảo đảm tính khách quan và hợp lệ của dữ liệu biểu quyết.
          </p>
          <div className="flex items-center justify-center space-x-3">
            <Link
              href={`/${currentSchoolCode}/school/poll/${poll.id}`}
              className="inline-flex items-center px-4 py-2 rounded-xl bg-[#0070CE] text-white text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
            >
              Xem chi tiết kết quả
            </Link>
            <Link
              href={`/${currentSchoolCode}/school/poll`}
              className="inline-flex items-center px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors"
            >
              Quay lại danh sách
            </Link>
          </div>
        </div>
      </PortalLayout>
    );
  }

  const handleSubmit = (payload: CreatePollPayload) => {
    dispatch(
      updatePoll({
        id: poll.id,
        title: payload.title,
        description: payload.description,
        deadline: payload.deadline,
        imageUrl: payload.imageUrl,
        options: payload.options,
        config: payload.config,
      })
    );
    router.push(`/${currentSchoolCode}/school/poll/${poll.id}`);
  };

  return (
    <PortalLayout>
      <Head>
        <title>Chỉnh sửa: {poll.title} | SOHA School Portal</title>
      </Head>

      <PollComposer initialPoll={poll} onSubmit={handleSubmit} isEditing={true} />
    </PortalLayout>
  );
}
