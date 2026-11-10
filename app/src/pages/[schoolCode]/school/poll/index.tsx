import React, { useMemo, useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import PortalLayout from '@/components/layout/PortalLayout';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  setFilterStatus,
  setFilterClass,
  setSearchQuery,
  resetFilter,
  openSendModal,
  openDeleteModal,
  sendPoll,
  deletePoll,
  closeModal,
  createPoll,
  updatePoll,
} from '@/store/slices/pollSlice';
import { addToast } from '@/store/slices/toastSlice';
import { filterPolls, computePollKPIs } from '@/utils/pollValidation';
import { POLL_AVAILABLE_CLASSES } from '@/services/mockPollData';
import { PollSummaryCards } from '@/modules/school/poll/PollSummaryCards';
import { PollToolbar } from '@/modules/school/poll/PollToolbar';
import { PollTable } from '@/modules/school/poll/PollTable';
import { SendPollModal } from '@/modules/school/poll/SendPollModal';
import { DeletePollModal } from '@/modules/school/poll/DeletePollModal';
import { PollSlideOver } from '@/modules/school/poll/PollSlideOver';
import { PageHeader, Button } from '@/components/ds';
import { CreatePollPayload, Poll } from '@/types/poll';

export default function SchoolPollDirectoryPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { schoolCode } = router.query;
  const currentSchoolCode = (schoolCode as string) || 'demo';

  const { polls, filterState, activeModal, modalTargetPollId } = useAppSelector(
    (state) => state.poll
  );

  // Compute status counts for toolbar tabs
  const statusCounts = useMemo(() => {
    return {
      all: polls.length,
      da_tao: polls.filter((p) => p.status === 'da_tao').length,
      da_gui: polls.filter((p) => p.status === 'da_gui').length,
      da_dong: polls.filter((p) => p.status === 'da_dong').length,
    };
  }, [polls]);

  // Compute 4 KPI summary cards
  const kpis = useMemo(() => {
    return computePollKPIs(polls);
  }, [polls]);

  // Apply status, class, and accent-insensitive search filters
  const filteredPolls = useMemo(() => {
    return filterPolls(polls, filterState);
  }, [polls, filterState]);

  // Target poll for active modal
  const targetPoll = modalTargetPollId
    ? polls.find((p) => p.id === modalTargetPollId) || null
    : null;

  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
  const [editingPoll, setEditingPoll] = useState<Poll | null>(null);

  useEffect(() => {
    if (router.query.create === 'true') {
      setEditingPoll(null);
      setIsSlideOverOpen(true);
    } else if (router.query.edit) {
      const target = polls.find((p) => p.id === router.query.edit);
      if (target) {
        setEditingPoll(target);
        setIsSlideOverOpen(true);
      }
    }
  }, [router.query.create, router.query.edit, polls]);

  const handleSubmitPoll = (payload: CreatePollPayload) => {
    if (editingPoll) {
      dispatch(updatePoll({ ...payload, id: editingPoll.id }));
      dispatch(
        addToast({
          type: 'success',
          message: `Đã cập nhật cuộc bình chọn "${payload.title}" thành công.`,
        })
      );
    } else {
      dispatch(createPoll(payload));
      dispatch(
        addToast({
          type: 'success',
          message: `Đã tạo mới cuộc bình chọn "${payload.title}" thành công.`,
        })
      );
    }
  };

  return (
    <PortalLayout>
      <Head>
        <title>Bình chọn &amp; Khảo sát ý kiến | SOHA School Portal</title>
      </Head>

      <div className="space-y-5">
        {/* Page Header */}
        <PageHeader
          title="Bình chọn & Khảo sát"
          description="Khảo sát ý kiến phụ huynh và học sinh toàn trường hoặc theo từng khối lớp"
        />

        {/* 4 Summary KPI Cards */}
        <PollSummaryCards kpis={kpis} />

        {/* Unified Table Card: CountedTabs + Toolbar + Data Table + Footer */}
        <div className="ecomd-table-card">
          <PollToolbar
            filterState={filterState}
            statusCounts={statusCounts}
            availableClasses={POLL_AVAILABLE_CLASSES}
            onStatusChange={(status) => dispatch(setFilterStatus(status))}
            onClassChange={(classId) => dispatch(setFilterClass(classId))}
            onSearchChange={(query) => dispatch(setSearchQuery(query))}
            onResetFilter={() => dispatch(resetFilter())}
            onOpenCreate={() => {
              setEditingPoll(null);
              setIsSlideOverOpen(true);
            }}
          />

          <PollTable
            polls={filteredPolls}
            onOpenSendModal={(pollId) => dispatch(openSendModal(pollId))}
            onOpenDeleteModal={(pollId) => dispatch(openDeleteModal(pollId))}
            onOpenEdit={(poll) => {
              setEditingPoll(poll);
              setIsSlideOverOpen(true);
            }}
          />
        </div>

        {/* Send Poll Dispatch Modal */}
        <SendPollModal
          poll={targetPoll}
          isOpen={activeModal === 'send' && Boolean(targetPoll)}
          availableClasses={POLL_AVAILABLE_CLASSES}
          onClose={() => dispatch(closeModal())}
          onConfirm={(payload) => dispatch(sendPoll(payload))}
        />

        {/* Delete Draft Poll Modal */}
        <DeletePollModal
          poll={targetPoll}
          isOpen={activeModal === 'delete' && Boolean(targetPoll)}
          onClose={() => dispatch(closeModal())}
          onConfirm={(pollId) => dispatch(deletePoll(pollId))}
        />

        {/* Create / Edit Poll SlideOver (Right-Sheet Standard) */}
        <PollSlideOver
          isOpen={isSlideOverOpen}
          onClose={() => {
            setIsSlideOverOpen(false);
            setEditingPoll(null);
            if (router.query.create || router.query.edit) {
              router.replace(`/${currentSchoolCode}/school/poll`, undefined, { shallow: true });
            }
          }}
          initialPoll={editingPoll}
          isEditing={!!editingPoll}
          onSubmit={handleSubmitPoll}
        />
      </div>
    </PortalLayout>
  );
}
