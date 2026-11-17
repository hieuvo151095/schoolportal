import React, { useMemo, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  setSelectedDate,
  setSelectedClassId,
  setSearchQuery,
  setStatusFilter,
  setMealFilter,
  toggleSelectStudent,
  toggleSelectAll,
  openSingleStudentCare,
  openBulkCare,
  closeSlideOver,
  saveStudentCareRecord,
  saveBulkCareRecord,
  resetStudentCare,
  syncWithAttendance,
} from '@/store/slices/nutritionSlice';
import { addToast } from '@/store/slices/toastSlice';
import PortalLayout from '@/components/layout/PortalLayout';
import { PageHeader } from '@/components/ds';
import NutritionSummaryCards from '@/modules/operations/nutrition/NutritionSummaryCards';
import NutritionToolbar from '@/modules/operations/nutrition/NutritionToolbar';
import NutritionRosterTable from '@/modules/operations/nutrition/NutritionRosterTable';
import CareSlideOver from '@/modules/operations/nutrition/CareSlideOver';
import type { StudentCareRecord, BulkCarePayload } from '@/types/nutrition';
import { NUTRITION_CLASSES_LIST } from '@/services/mockNutritionData';

export default function NutritionPage() {
  const router = useRouter();
  const schoolCode = (router.query.schoolCode as string) || 'demo';
  const routerClassId = router.query.classId as string;

  const dispatch = useAppDispatch();
  const {
    records,
    selectedDate,
    selectedClassId,
    searchQuery,
    statusFilter,
    mealFilter,
    selectedStudentIds,
    summary,
    isSlideOverOpen,
    activeStudentId,
    isBulkMode,
  } = useAppSelector((state) => state.nutrition);

  const attendanceStudents = useAppSelector((state) => state.attendance.students);
  const attendanceDate = useAppSelector((state) => state.attendance.selectedDate);
  const attendanceClassId = useAppSelector((state) => state.attendance.selectedClassId);

  // Sync attendance into nutrition when date and class match
  useEffect(() => {
    if (attendanceDate === selectedDate && attendanceClassId === selectedClassId && attendanceStudents.length > 0) {
      dispatch(
        syncWithAttendance({
          attendanceList: attendanceStudents,
          date: selectedDate,
          classId: selectedClassId,
        })
      );
    }
  }, [attendanceDate, attendanceClassId, attendanceStudents, selectedDate, selectedClassId, dispatch]);

  // Sync route param with redux state on mount or browser navigation
  useEffect(() => {
    if (router.isReady && routerClassId && routerClassId !== selectedClassId) {
      dispatch(setSelectedClassId(routerClassId));
    }
  }, [router.isReady, routerClassId, selectedClassId, dispatch]);

  const currentClass = useMemo(() => {
    return NUTRITION_CLASSES_LIST.find((c) => c.id === selectedClassId) || NUTRITION_CLASSES_LIST[0];
  }, [selectedClassId]);

  const handleSelectClassId = (newClassId: string) => {
    dispatch(setSelectedClassId(newClassId));
    router.push(`/${schoolCode}/class/${newClassId}/nutrition`, undefined, { shallow: true });
  };

  // Filtered records
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchName = r.fullName.toLowerCase().includes(query);
        const matchCode = r.studentCode.toLowerCase().includes(query);
        const matchNick = r.nickname?.toLowerCase().includes(query);
        if (!matchName && !matchCode && !matchNick) return false;
      }

      // Status filter
      if (statusFilter === 'evaluated' && !r.isEvaluated) return false;
      if (statusFilter === 'pending' && r.isEvaluated) return false;

      // Meal filter
      if (mealFilter === 'an_het_suat' && (!r.isEvaluated || r.meals.lunch.amount !== 'an_het_suat')) {
        return false;
      }
      if (mealFilter === 'can_ho_tro' && (!r.isEvaluated || r.meals.lunch.behavior !== 'can_ho_tro')) {
        return false;
      }
      if (mealFilter === 'bo_bua' && (!r.isEvaluated || r.meals.lunch.behavior === 'bo_bua')) {
        return false;
      }

      return true;
    });
  }, [records, searchQuery, statusFilter, mealFilter]);

  const activeStudent = useMemo(() => {
    if (!activeStudentId) return null;
    return records.find((r) => r.studentId === activeStudentId) || null;
  }, [records, activeStudentId]);

  const selectedStudents = useMemo(() => {
    return records.filter((r) => selectedStudentIds.includes(r.studentId));
  }, [records, selectedStudentIds]);

  // Handlers
  const handleToggleSelectAll = () => {
    const visibleIds = filteredRecords.map((r) => r.studentId);
    dispatch(toggleSelectAll(visibleIds));
  };

  const handleQuickStandardCare = (studentId: string) => {
    const student = records.find((r) => r.studentId === studentId);
    if (!student) return;

    const updated: StudentCareRecord = {
      ...student,
      isEvaluated: true,
      updatedAt: new Date().toISOString(),
      updatedBy: 'Giáo viên phụ trách',
      meals: {
        breakfast: { behavior: 'tu_an', amount: 'an_het_suat', note: 'Ăn hết suất phần ăn sáng' },
        lunch: { behavior: 'tu_an', amount: 'an_het_suat', note: 'Tự xúc ăn hết suất cơm trưa' },
        snack: { behavior: 'tu_an', amount: 'an_het_suat', note: 'Ăn hết bữa xế' },
      },
      sleep: { behavior: 'tu_ngu', duration: 'ngu_sau', note: 'Ngủ sâu giấc ngon' },
      hydration: { behavior: 'chu_dong', amount: 'thuong_xuyen', note: 'Uống đủ nước' },
      hygiene: {
        general: { activities: ['rua_tay', 'thay_quan_ao'], behavior: 'chu_dong', note: 'Rửa tay sạch trước ăn' },
        poop: { behavior: 'chu_dong_tu_di', note: 'Đã đi tiêu bình thường' },
      },
      generalNote: 'Bé ngoan, hoàn thành tốt nề nếp sinh hoạt trong ngày.',
    };

    dispatch(saveStudentCareRecord(updated));
    dispatch(
      addToast({
        type: 'success',
        title: 'Cập nhật thành công',
        message: `Đã áp dụng mẫu đánh giá chuẩn cho bé ${student.fullName}.`,
      })
    );
  };

  const handleQuickEvaluateAll = () => {
    const allIds = records.map((r) => r.studentId);
    const payload: BulkCarePayload = {
      studentIds: allIds,
      meals: {
        breakfast: { behavior: 'tu_an', amount: 'an_het_suat', note: 'Ăn hết suất phần ăn sáng' },
        lunch: { behavior: 'tu_an', amount: 'an_het_suat', note: 'Tự xúc ăn hết suất cơm trưa' },
        snack: { behavior: 'tu_an', amount: 'an_het_suat', note: 'Ăn hết bữa xế' },
      },
      sleep: { behavior: 'tu_ngu', duration: 'ngu_sau', note: 'Ngủ sâu giấc' },
      hydration: { behavior: 'chu_dong', amount: 'thuong_xuyen', note: 'Chủ động uống nước' },
      hygiene: {
        general: { activities: ['rua_tay', 'thay_quan_ao'], behavior: 'chu_dong', note: 'Rửa tay sạch' },
        poop: { behavior: 'chu_dong_tu_di', note: 'Bình thường' },
      },
      generalNote: 'Học sinh sinh hoạt nề nếp tốt, ngoan ngoãn.',
    };

    dispatch(saveBulkCareRecord(payload));
    dispatch(
      addToast({
        type: 'success',
        title: 'Đánh giá cả lớp hoàn tất',
        message: `Đã lưu đánh giá mẫu chuẩn cho toàn bộ ${allIds.length} học sinh ${currentClass.name}.`,
      })
    );
  };

  const handleSaveSingle = (record: StudentCareRecord) => {
    dispatch(saveStudentCareRecord(record));
    dispatch(
      addToast({
        type: 'success',
        title: 'Lưu đánh giá thành công',
        message: `Đã ghi nhận chăm sóc ngày cho bé ${record.fullName}.`,
      })
    );
  };

  const handleSaveBulk = (payload: BulkCarePayload) => {
    dispatch(saveBulkCareRecord(payload));
    dispatch(
      addToast({
        type: 'success',
        title: 'Chăm sóc hàng loạt thành công',
        message: `Đã cập nhật chỉ số chăm sóc đồng loạt cho ${payload.studentIds.length} học sinh.`,
      })
    );
  };

  const handleResetCare = (studentId: string) => {
    const student = records.find((r) => r.studentId === studentId);
    dispatch(resetStudentCare(studentId));
    dispatch(
      addToast({
        type: 'info',
        title: 'Đã đặt lại',
        message: `Đã đặt lại trạng thái chăm sóc của ${student?.fullName || 'học sinh'}.`,
      })
    );
  };

  const handleRemoveStudentFromBulk = (studentId: string) => {
    dispatch(toggleSelectStudent(studentId));
  };

  return (
    <PortalLayout>
      <Head>
        <title>Chăm sóc trẻ - {currentClass.name} | ECO School Portal</title>
      </Head>

      <div className="w-full max-w-[1600px] mx-auto p-4 sm:p-6">
        <PageHeader
          title="Chăm sóc trẻ"
          description={`Quản lý dinh dưỡng bữa ăn, giấc ngủ, uống nước và vệ sinh hàng ngày — ${currentClass.name}`}
        />

        {/* Top Summary Cards */}
        <NutritionSummaryCards summary={summary} />

        {/* Single Frame Line 38px FilterBar */}
        <NutritionToolbar
          selectedDate={selectedDate}
          onDateChange={(date) => dispatch(setSelectedDate(date))}
          selectedClassId={selectedClassId}
          onClassChange={handleSelectClassId}
          searchQuery={searchQuery}
          onSearchChange={(q) => dispatch(setSearchQuery(q))}
          statusFilter={statusFilter}
          onStatusFilterChange={(s) => dispatch(setStatusFilter(s))}
          mealFilter={mealFilter}
          onMealFilterChange={(m) => dispatch(setMealFilter(m))}
          selectedCount={selectedStudentIds.length}
          onOpenBulkCare={() => dispatch(openBulkCare())}
          onQuickEvaluateAll={handleQuickEvaluateAll}
        />

        {/* Student Roster Table with Multi-Student Support */}
        <NutritionRosterTable
          records={filteredRecords}
          selectedStudentIds={selectedStudentIds}
          onToggleSelectStudent={(id) => dispatch(toggleSelectStudent(id))}
          onToggleSelectAll={handleToggleSelectAll}
          onOpenSingleCare={(id) => dispatch(openSingleStudentCare(id))}
          onQuickStandardCare={handleQuickStandardCare}
          onResetCare={handleResetCare}
          onGoToAttendance={() => router.push(`/${schoolCode}/class/${selectedClassId}/attendance`)}
        />

        {/* Right-Sheet SlideOver for Single or Multi-Student Care */}
        <CareSlideOver
          open={isSlideOverOpen}
          onClose={() => dispatch(closeSlideOver())}
          isBulkMode={isBulkMode}
          activeStudent={activeStudent}
          selectedStudents={selectedStudents}
          onRemoveStudentFromBulk={handleRemoveStudentFromBulk}
          onSaveSingle={handleSaveSingle}
          onSaveBulk={handleSaveBulk}
        />
      </div>
    </PortalLayout>
  );
}
