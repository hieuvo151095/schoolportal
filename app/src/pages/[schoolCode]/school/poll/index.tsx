import React, { useMemo } from 'react';
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
} from '@/store/slices/pollSlice';
import { filterPolls, computePollKPIs } from '@/utils/pollValidation';
import { POLL_AVAILABLE_CLASSES } from '@/services/mockPollData';
import { PollSummaryCards } from '@/modules/school/poll/PollSummaryCards';
import { PollToolbar } from '@/modules/school/poll/PollToolbar';
import { PollTable } from '@/modules/school/poll/PollTable';
import { SendPollModal } from '@/modules/school/poll/SendPollModal';
import { DeletePollModal } from '@/modules/school/poll/DeletePollModal';
import { PageHeader, Button } from '@/components/ds';

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
          />

          <PollTable
            polls={filteredPolls}
            onOpenSendModal={(pollId) => dispatch(openSendModal(pollId))}
            onOpenDeleteModal={(pollId) => dispatch(openDeleteModal(pollId))}
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
      </div>
    </PortalLayout>
  );
}
