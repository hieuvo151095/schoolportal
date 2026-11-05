/**
 * School Subjects Management Page
 * Design System: [DS] ECO ME DASHBOARD v1.1.0 (PageHeader, FilterBar, StatCard, DataTable)
 */

import React, { useMemo } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import PortalLayout from '@/components/layout/PortalLayout';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  setActiveStage,
  setSelectedAcademicYear,
  setSearchQuery,
  setGradeLevelFilter,
  setClassificationFilter,
  setTypeFilter,
  resetFilters,
  openDetailDrawer,
  closeDetailDrawer,
  openAssignTeacherModal,
  closeAssignTeacherModal,
  openUnassignTeacherModal,
  closeUnassignTeacherModal,
  assignTeacherToSubject,
  unassignTeacherFromSubject
} from '@/store/slices/subjectSlice';
import { addToast } from '@/store/slices/toastSlice';
import {
  filterSubjects,
  calculateSubjectKPIs,
  getStageName
} from '@/utils/subjectValidation';
import { SubjectToolbar } from '@/modules/school/subjects/SubjectToolbar';
import { SubjectSummaryCards } from '@/modules/school/subjects/SubjectSummaryCards';
import { SubjectTable } from '@/modules/school/subjects/SubjectTable';
import { SubjectDetailDrawer } from '@/modules/school/subjects/SubjectDetailDrawer';
import { AssignTeacherModal } from '@/modules/school/subjects/AssignTeacherModal';
import { UnassignTeacherModal } from '@/modules/school/subjects/UnassignTeacherModal';
import type {
  EducationStage,
  AssignTeacherPayload,
  SubjectTeacherAssignment
} from '@/types/subject';
import { PageHeader } from '@/components/ds';

export default function SchoolSubjectsPage() {
  const router = useRouter();
  const schoolCode = (router.query.schoolCode as string) || 'demo';
  const dispatch = useAppDispatch();

  const {
    subjects,
    activeStage,
    selectedAcademicYear,
    filter,
    selectedSubjectId,
    isDetailDrawerOpen,
    isAssignTeacherModalOpen,
    isUnassignTeacherModalOpen,
    teacherToUnassign
  } = useAppSelector((state) => state.subject);

  // Filtered subjects for active stage and search filters
  const filteredSubjects = useMemo(() => {
    return filterSubjects(subjects, filter);
  }, [subjects, filter]);

  // High-level KPI calculation
  const kpis = useMemo(() => {
    return calculateSubjectKPIs(filteredSubjects);
  }, [filteredSubjects]);

  // Stage count mapping
  const stageCounts = useMemo(() => {
    const counts: Record<EducationStage, number> = {
      TH: 0,
      THCS: 0,
      THPT: 0,
      GDTX: 0
    };
    subjects.forEach((s) => {
      if (s.academicYear === selectedAcademicYear) {
        counts[s.stage] = (counts[s.stage] || 0) + 1;
      }
    });
    return counts;
  }, [subjects, selectedAcademicYear]);

  // Target subject for Drawer or Modals
  const selectedSubject = useMemo(() => {
    return subjects.find((s) => s.id === selectedSubjectId) || null;
  }, [subjects, selectedSubjectId]);

  // Handler: Assign Teacher
  const handleAssignTeacher = (payload: AssignTeacherPayload) => {
    dispatch(assignTeacherToSubject(payload));
    dispatch(
      addToast({
        type: 'success',
        message: `Đã phân công giáo viên "${payload.teacherName}" cho môn học!`
      })
    );
  };

  // Handler: Unassign Teacher
  const handleUnassignTeacher = (subjectId: string, teacherId: string) => {
    dispatch(
      unassignTeacherFromSubject({
        subjectId,
        teacherId
      })
    );
    dispatch(
      addToast({
        type: 'info',
        message: 'Đã hủy phân công giáo viên khỏi môn học!'
      })
    );
  };

  return (
    <PortalLayout>
      <Head>
        <title>Quản lý Môn Học | School Operating Portal</title>
      </Head>

      <div style={{ padding: 'var(--space-6)', maxWidth: '1440px', margin: '0 auto' }}>
        {/* Page Header */}
        <PageHeader
          title="Quản Lý Môn Học"
          description={`Danh mục môn học GDPT 2018 cấp ${getStageName(activeStage)}, phân công giáo viên bộ môn và cấu hình ma trận đánh giá`}
        />

        {/* 4 Summary KPI Cards */}
        <SubjectSummaryCards kpis={kpis} />

        {/* Filter and Stage Toolbar */}
        <SubjectToolbar
          activeStage={activeStage}
          onSelectStage={(stage) => dispatch(setActiveStage(stage))}
          stageCounts={stageCounts}
          selectedAcademicYear={selectedAcademicYear}
          onSelectAcademicYear={(year) => dispatch(setSelectedAcademicYear(year))}
          filterCriteria={filter}
          onUpdateFilter={(updates) => {
            if (updates.searchQuery !== undefined) dispatch(setSearchQuery(updates.searchQuery));
            if (updates.gradeLevel !== undefined) dispatch(setGradeLevelFilter(updates.gradeLevel));
            if (updates.classification !== undefined) dispatch(setClassificationFilter(updates.classification));
            if (updates.type !== undefined) dispatch(setTypeFilter(updates.type));
          }}
          onResetFilter={() => dispatch(resetFilters())}
        />

        {/* Main Subject Table */}
        <SubjectTable
          subjects={filteredSubjects}
          onViewDetail={(id) => dispatch(openDetailDrawer(id))}
          onAssignTeacher={(id) => dispatch(openAssignTeacherModal(id))}
        />

        {/* Subject Detail Drawer */}
        <SubjectDetailDrawer
          isOpen={isDetailDrawerOpen}
          subject={selectedSubject}
          onClose={() => dispatch(closeDetailDrawer())}
          onOpenAssignTeacher={(subjectId) => {
            dispatch(openAssignTeacherModal(subjectId));
          }}
          onOpenUnassignTeacher={(subjectId, subjectName, teacher) => {
            dispatch(openUnassignTeacherModal({ subjectId, subjectName, teacher }));
          }}
        />

        {/* Assign Teacher Modal */}
        <AssignTeacherModal
          isOpen={isAssignTeacherModalOpen}
          subject={selectedSubject}
          onClose={() => dispatch(closeAssignTeacherModal())}
          onAssign={handleAssignTeacher}
        />

        {/* Unassign Confirmation Modal */}
        <UnassignTeacherModal
          isOpen={isUnassignTeacherModalOpen}
          data={teacherToUnassign}
          onClose={() => dispatch(closeUnassignTeacherModal())}
          onConfirm={handleUnassignTeacher}
        />
      </div>
    </PortalLayout>
  );
}
