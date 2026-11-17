import React, { useMemo, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  setSelectedClassId,
  setSelectedWeekNumber,
  setSearchQuery,
  setStatusFilter,
  toggleSelectStudent,
  toggleSelectAll,
  toggleAwardStudent,
  updateTeacherComment,
  bulkAwardSelected,
  bulkUnawardSelected,
  saveRewardChanges,
  publishWeeklyRewards,
  openDetailSlideOver,
  closeDetailSlideOver,
} from '@/store/slices/rewardSlice';
import { addToast } from '@/store/slices/toastSlice';
import PortalLayout from '@/components/layout/PortalLayout';
import { PageHeader } from '@/components/ds';
import RewardSummaryCards from '@/modules/operations/reward/RewardSummaryCards';
import RewardToolbar from '@/modules/operations/reward/RewardToolbar';
import RewardRosterTable from '@/modules/operations/reward/RewardRosterTable';
import RewardDetailSlideOver from '@/modules/operations/reward/RewardDetailSlideOver';
import { REWARD_CLASSES_LIST, REWARD_WEEKS_LIST } from '@/services/mockRewardData';
import type { RewardStatusFilter } from '@/types/reward';

export default function RewardPage() {
  const router = useRouter();
  const schoolCode = (router.query.schoolCode as string) || 'demo';
  const routerClassId = router.query.classId as string;

  const dispatch = useAppDispatch();
  const {
    records,
    selectedClassId,
    selectedWeekNumber,
    searchQuery,
    statusFilter,
    selectedStudentIds,
    summary,
    isDetailSlideOverOpen,
    activeStudentId,
    hasUnsavedChanges,
  } = useAppSelector((state) => state.reward);

  // Sync router query classId to Redux state on load/change
  useEffect(() => {
    if (router.isReady && routerClassId && routerClassId !== selectedClassId) {
      dispatch(setSelectedClassId(routerClassId));
    }
  }, [router.isReady, routerClassId, selectedClassId, dispatch]);

  const currentClass = useMemo(() => {
    return REWARD_CLASSES_LIST.find((c) => c.id === selectedClassId) || REWARD_CLASSES_LIST[0];
  }, [selectedClassId]);

  const currentWeek = useMemo(() => {
    return REWARD_WEEKS_LIST.find((w) => w.weekNumber === selectedWeekNumber) || REWARD_WEEKS_LIST[0];
  }, [selectedWeekNumber]);

  const handleSelectClassId = (newClassId: string) => {
    dispatch(setSelectedClassId(newClassId));
    router.push(`/${schoolCode}/class/${newClassId}/reward`, undefined, { shallow: true });
  };

  const handleSelectWeekNumber = (weekNum: number) => {
    dispatch(setSelectedWeekNumber(weekNum));
  };

  // Filtered records
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = r.fullName.toLowerCase().includes(q);
        const matchCode = r.studentCode.toLowerCase().includes(q);
        const matchNick = r.nickname?.toLowerCase().includes(q);
        if (!matchName && !matchCode && !matchNick) return false;
      }

      // Status filter
      if (statusFilter === 'awarded' && !r.isAwarded) return false;
      if (statusFilter === 'unawarded' && r.isAwarded) return false;

      return true;
    });
  }, [records, searchQuery, statusFilter]);

  const activeStudent = useMemo(() => {
    if (!activeStudentId) return null;
    return records.find((r) => r.studentId === activeStudentId) || null;
  }, [records, activeStudentId]);

  // Actions
  const handleToggleSelectAll = () => {
    const visibleIds = filteredRecords.map((r) => r.studentId);
    dispatch(toggleSelectAll(visibleIds));
  };

  const handleToggleReward = (studentId: string) => {
    dispatch(toggleAwardStudent(studentId));
    const student = records.find((r) => r.studentId === studentId);
    if (student) {
      const nextAwarded = !student.isAwarded;
      dispatch(
        addToast({
          type: nextAwarded ? 'success' : 'info',
          title: nextAwarded ? 'Đã cấp Phiếu bé ngoan' : 'Đã hủy cấp phiếu',
          message: `${nextAwarded ? 'Cấp thành công' : 'Đã rút lại phiếu'} cho bé ${student.fullName}.`,
        })
      );
    }
  };

  const handleBulkAward = () => {
    const count = selectedStudentIds.length;
    dispatch(bulkAwardSelected());
    dispatch(
      addToast({
        type: 'success',
        title: 'Cấp phiếu hàng loạt',
        message: `Đã cấp Phiếu bé ngoan thành công cho ${count} học sinh đã chọn.`,
      })
    );
  };

  const handleBulkUnaward = () => {
    const count = selectedStudentIds.length;
    dispatch(bulkUnawardSelected());
    dispatch(
      addToast({
        type: 'info',
        title: 'Hủy cấp phiếu hàng loạt',
        message: `Đã hủy cấp phiếu cho ${count} học sinh đã chọn.`,
      })
    );
  };

  const handleSaveChanges = () => {
    dispatch(saveRewardChanges());
    dispatch(
      addToast({
        type: 'success',
        title: 'Lưu dữ liệu thành công',
        message: `Đã lưu cập nhật Phiếu bé ngoan lớp ${currentClass.name} - Tuần ${selectedWeekNumber}.`,
      })
    );
  };

  const handlePublish = () => {
    dispatch(publishWeeklyRewards());
    dispatch(
      addToast({
        type: 'success',
        title: 'Công bố phiếu bé ngoan',
        message: `Đã phát hành và gửi thông báo Phiếu bé ngoan Tuần ${selectedWeekNumber} tới toàn bộ phụ huynh!`,
      })
    );
  };

  const handleSaveSlideOver = (studentId: string, isAwarded: boolean, comment: string) => {
    const student = records.find((r) => r.studentId === studentId);
    if (student && student.isAwarded !== isAwarded) {
      dispatch(toggleAwardStudent(studentId));
    }
    dispatch(updateTeacherComment({ studentId, comment }));
    dispatch(saveRewardChanges());
    dispatch(
      addToast({
        type: 'success',
        title: 'Cập nhật thành công',
        message: `Đã cập nhật phiếu bé ngoan và lời nhận xét cho bé ${student?.fullName}.`,
      })
    );
  };

  return (
    <PortalLayout>
      <Head>
        <title>Phiếu bé ngoan - {currentClass.name} | ECO School Portal</title>
      </Head>

      <div className="space-y-5">
        {/* Page Header */}
        <PageHeader
          title={`Phiếu bé ngoan — ${currentClass.name}`}
          description={`Theo dõi chuyên cần, đánh giá nề nếp rèn luyện và phát hành phiếu bé ngoan ${currentWeek.label}.`}
        />

        {/* 4 Stat Cards */}
        <RewardSummaryCards summary={summary} />

        {/* Unified Table Card: CountedTabs + Filter Controls + Data Table */}
        <div className="ecomd-table-card overflow-hidden w-full max-w-full">
          <RewardToolbar
            selectedClassId={selectedClassId}
            onClassChange={handleSelectClassId}
            selectedWeekNumber={selectedWeekNumber}
            onWeekChange={handleSelectWeekNumber}
            searchQuery={searchQuery}
            onSearchChange={(q) => dispatch(setSearchQuery(q))}
            statusFilter={statusFilter}
            onStatusFilterChange={(s: RewardStatusFilter) => dispatch(setStatusFilter(s))}
            selectedCount={selectedStudentIds.length}
            hasUnsavedChanges={hasUnsavedChanges}
            isCurrentWeekPublished={summary.publishedCount > 0}
            onBulkAward={handleBulkAward}
            onBulkUnaward={handleBulkUnaward}
            onSaveChanges={handleSaveChanges}
            onPublish={handlePublish}
            statusCounts={{
              all: records.length,
              awarded: summary.awardedCount,
              unawarded: summary.unawardedCount,
            }}
          />

          {/* Interactive Roster Table with 1-Click Sun character toggle */}
          <RewardRosterTable
            records={filteredRecords}
            selectedIds={selectedStudentIds}
            onToggleSelect={(id) => dispatch(toggleSelectStudent(id))}
            onSelectAll={handleToggleSelectAll}
            onToggleReward={handleToggleReward}
            onOpenDetail={(record) => dispatch(openDetailSlideOver(record.studentId))}
            onUpdateComment={(studentId, comment) =>
              dispatch(updateTeacherComment({ studentId, comment }))
            }
          />
        </div>

        {/* Right-Sheet SlideOver for Certificate Preview and Detailed Review */}
        <RewardDetailSlideOver
          record={activeStudent}
          open={isDetailSlideOverOpen}
          onClose={() => dispatch(closeDetailSlideOver())}
          onSave={handleSaveSlideOver}
        />
      </div>
    </PortalLayout>
  );
}
