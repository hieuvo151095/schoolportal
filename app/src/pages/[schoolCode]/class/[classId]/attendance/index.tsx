import React, { useMemo, useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  setSelectedDate,
  setSelectedClassId,
  setSearchQuery,
  setStatusFilter,
  toggleSelectStudent,
  toggleSelectAll,
  checkInStudent,
  checkOutStudent,
  checkOutWithGuardian,
  bulkCheckInSelected,
  bulkCheckOutSelected,
  bulkRecordAbsence,
  updateHealthRecord,
  updateStudentNotes,
  updateStudentAttendanceTime,
  openPickupModal,
  closePickupModal,
  openBulkAbsentModal,
  closeBulkAbsentModal,
} from '@/store/slices/attendanceSlice';
import PortalLayout from '@/components/layout/PortalLayout';
import AttendanceSummaryCards from '@/modules/operations/attendance/AttendanceSummaryCards';
import AttendanceToolbar from '@/modules/operations/attendance/AttendanceToolbar';
import AttendanceRoster from '@/modules/operations/attendance/AttendanceRoster';
import PickupGuardianModal from '@/modules/operations/attendance/PickupGuardianModal';
import BulkAbsentModal from '@/modules/operations/attendance/BulkAbsentModal';
import BulkTimeConfirmModal from '@/modules/operations/attendance/BulkTimeConfirmModal';
import { HealthCondition } from '@/types/attendance';
import { CLASSES_LIST } from '@/services/mockAttendanceData';
import { PageHeader } from '@/components/ds';

export default function AttendancePage() {
  const router = useRouter();
  const schoolCode = (router.query.schoolCode as string) || 'demo';
  const routerClassId = router.query.classId as string;

  const dispatch = useAppDispatch();
  const {
    students,
    selectedDate,
    selectedClassId,
    searchQuery,
    statusFilter,
    selectedStudentIds,
    summary,
    isPickupModalOpen,
    activeStudentForPickup,
    isBulkAbsentModalOpen,
  } = useAppSelector((state) => state.attendance);

  // Bulk Time Confirm Modal State (Allows timer adjustment before confirming bulk checkIn or checkOut)
  const [bulkTimeModalConfig, setBulkTimeModalConfig] = useState<{
    isOpen: boolean;
    type: 'checkIn' | 'checkOut';
  }>({
    isOpen: false,
    type: 'checkIn',
  });

  // Handle dynamic class switching and shallow router synchronization
  const handleSelectClassId = (newClassId: string) => {
    dispatch(setSelectedClassId(newClassId));
    router.push(`/${schoolCode}/class/${newClassId}/attendance`, undefined, { shallow: true });
  };

  // Sync route param with redux state on mount or browser navigation
  useEffect(() => {
    if (router.isReady && routerClassId && routerClassId !== selectedClassId) {
      dispatch(setSelectedClassId(routerClassId));
    }
  }, [router.isReady, routerClassId, selectedClassId, dispatch]);

  const currentClass = useMemo(() => {
    return CLASSES_LIST.find((c) => c.id === selectedClassId) || CLASSES_LIST[0];
  }, [selectedClassId]);

  // Selected students who have arrived and are present (eligible for checkout)
  const selectedCheckedInStudents = useMemo(() => {
    return students.filter(
      (s) =>
        selectedStudentIds.includes(s.studentId) &&
        Boolean(s.arrivalTime) &&
        s.status === 'present'
    );
  }, [students, selectedStudentIds]);

  const [bulkFilterNoticeCount, setBulkFilterNoticeCount] = useState<number>(0);

  // Selected students brief for confirmation modal preview
  // For checkout, automatically filter to only checked-in students
  const modalSelectedStudents = useMemo(() => {
    if (bulkTimeModalConfig.type === 'checkOut') {
      return selectedCheckedInStudents.map((s) => ({
        studentId: s.studentId,
        fullName: s.fullName,
        studentCode: s.studentCode,
        avatarUrl: s.avatarUrl,
      }));
    }
    return students
      .filter((s) => selectedStudentIds.includes(s.studentId))
      .map((s) => ({
        studentId: s.studentId,
        fullName: s.fullName,
        studentCode: s.studentCode,
        avatarUrl: s.avatarUrl,
      }));
  }, [bulkTimeModalConfig.type, selectedCheckedInStudents, students, selectedStudentIds]);

  // Filter students based on status and search query
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      // Status filter
      if (statusFilter !== 'all' && student.status !== statusFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = student.fullName.toLowerCase().includes(q);
        const matchesCode = student.studentCode.toLowerCase().includes(q);
        if (!matchesName && !matchesCode) {
          return false;
        }
      }
      return true;
    });
  }, [students, statusFilter, searchQuery]);

  // Handle open bulk confirmation modal with timer adjustment
  const handleOpenBulkCheckIn = () => {
    if (selectedStudentIds.length === 0) return;
    setBulkFilterNoticeCount(0);
    setBulkTimeModalConfig({ isOpen: true, type: 'checkIn' });
  };

  const handleOpenBulkCheckOut = () => {
    if (selectedCheckedInStudents.length === 0) return;
    const excludedCount = selectedStudentIds.length - selectedCheckedInStudents.length;
    setBulkFilterNoticeCount(excludedCount);
    setBulkTimeModalConfig({ isOpen: true, type: 'checkOut' });
  };

  const handleConfirmBulkTime = (time: string, studentIds?: string[]) => {
    if (bulkTimeModalConfig.type === 'checkIn') {
      dispatch(bulkCheckInSelected({ arrivalTime: time, studentIds }));
    } else {
      // For checkout, target students are the filtered checked-in students if studentIds not explicitly provided
      const targetIds = studentIds || selectedCheckedInStudents.map((s) => s.studentId);
      dispatch(bulkCheckOutSelected({ departureTime: time, studentIds: targetIds }));
    }
    setBulkTimeModalConfig((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <PortalLayout schoolCode={schoolCode}>
      <Head>
        <title>{`Điểm danh ${currentClass?.name || 'Lớp học'} | School Operating Portal`}</title>
        <meta
          name="description"
          content="Phân hệ Điểm danh lớp học - Vận hành nhà trường ECO School Portal"
        />
      </Head>

      <div className="space-y-5">
        {/* Page Header */}
        <PageHeader
          title={`Điểm danh ${currentClass?.name || 'Lớp 1A1'}`}
          description={`GVCN: ${currentClass?.homeroomTeacher || 'Cô Nguyễn Thu Mai'} • Quản lý giờ đón, giờ trả, ủy quyền người giám hộ và sức khỏe học sinh`}
        />

        {/* KPI Summary Cards */}
        <AttendanceSummaryCards summary={summary} />

        {/* Unified Table Card: CountedTabs + Filter Controls + Bulk Actions + Data Table */}
        <div className="ecomd-table-card overflow-hidden w-full max-w-full">
          <AttendanceToolbar
            selectedClassId={selectedClassId}
            onSelectClassId={handleSelectClassId}
            selectedDate={selectedDate}
            onSelectDate={(date) => dispatch(setSelectedDate(date))}
            searchQuery={searchQuery}
            onSearchChange={(q) => dispatch(setSearchQuery(q))}
            statusFilter={statusFilter}
            onStatusFilterChange={(s) => dispatch(setStatusFilter(s))}
            selectedCount={selectedStudentIds.length}
            selectedCheckedInCount={selectedCheckedInStudents.length}
            totalCount={filteredStudents.length}
            onBulkCheckIn={handleOpenBulkCheckIn}
            onBulkCheckOut={handleOpenBulkCheckOut}
            onOpenBulkAbsentModal={() => dispatch(openBulkAbsentModal())}
            onSelectAllToggle={(select) => dispatch(toggleSelectAll(select))}
            statusCounts={{
              all: students.length,
              present: students.filter((s) => s.status === 'present').length,
              excused_absent: students.filter((s) => s.status === 'excused_absent').length,
              unexcused_absent: students.filter((s) => s.status === 'unexcused_absent').length,
              unmarked: students.filter((s) => s.status === 'unmarked').length,
            }}
          />

          <AttendanceRoster
            students={filteredStudents}
            selectedStudentIds={selectedStudentIds}
            onToggleSelect={(id) => dispatch(toggleSelectStudent(id))}
            onSelectAll={(select) => dispatch(toggleSelectAll(select))}
            onCheckIn={(id) => dispatch(checkInStudent({ studentId: id }))}
            onCheckOut={(id) => dispatch(checkOutStudent({ studentId: id }))}
            onUpdateTime={(studentId, type, time) =>
              dispatch(updateStudentAttendanceTime({ studentId, type, time }))
            }
            onOpenPickupModal={(student) => dispatch(openPickupModal(student))}
            onUpdateHealth={(studentId, temp, condition) =>
              dispatch(
                updateHealthRecord({
                  studentId,
                  temperature: temp,
                  healthCondition: condition,
                })
              )
            }
            onUpdateNotes={(studentId, notes) =>
              dispatch(updateStudentNotes({ studentId, notes }))
            }
          />
        </div>
      </div>

      {/* Authorized Pickup Modal */}
      <PickupGuardianModal
        isOpen={isPickupModalOpen}
        student={activeStudentForPickup}
        onClose={() => dispatch(closePickupModal())}
        onSubmit={(params) => dispatch(checkOutWithGuardian(params))}
      />

      {/* Bulk Absent Modal */}
      <BulkAbsentModal
        isOpen={isBulkAbsentModalOpen}
        selectedCount={selectedStudentIds.length}
        onClose={() => dispatch(closeBulkAbsentModal())}
        onSubmit={(params) => dispatch(bulkRecordAbsence(params))}
      />

      {/* Bulk Time Confirmation & Adjustment Modal */}
      <BulkTimeConfirmModal
        isOpen={bulkTimeModalConfig.isOpen}
        type={bulkTimeModalConfig.type}
        selectedStudents={modalSelectedStudents}
        filteredOutCount={bulkFilterNoticeCount}
        onConfirm={handleConfirmBulkTime}
        onClose={() => setBulkTimeModalConfig((prev) => ({ ...prev, isOpen: false }))}
      />
    </PortalLayout>
  );
}
