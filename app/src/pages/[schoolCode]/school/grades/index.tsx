/**
 * School Grades Management Page
 * Design System: [DS] ECO ME DASHBOARD v1.1.0 (PageHeader, FilterBar, StatCard, DataTable)
 */

import React, { useMemo } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import PortalLayout from '@/components/layout/PortalLayout';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  setSelectedStage,
  setSelectedAcademicYear,
  setSearchQuery,
  clearSearchQuery,
} from '@/store/slices/gradeSlice';
import {
  filterGradesByStage,
  searchGrades,
  computeGradeRollups,
  computeSchoolKPIs,
} from '@/utils/gradeValidation';
import { GradeToolbar } from '@/modules/school/grades/GradeToolbar';
import { GradeSummaryCards } from '@/modules/school/grades/GradeSummaryCards';
import { GradeTable } from '@/modules/school/grades/GradeTable';
import type { EducationStage, GradeLevelRollup } from '@/types/grade';
import { PageHeader } from '@/components/ds';

export default function SchoolGradesPage() {
  const router = useRouter();
  const schoolCode = (router.query.schoolCode as string) || 'demo';
  const dispatch = useAppDispatch();

  const { grades, selectedStage, selectedAcademicYear, searchQuery } =
    useAppSelector((state) => state.grade);
  const classItems = useAppSelector((state) => state.class?.classes || []);

  // Compute counts for each stage filter pill
  const stageCounts = useMemo(() => {
    return {
      ALL: grades.length,
      TH: grades.filter((g) => g.stage === 'TH').length,
      THCS: grades.filter((g) => g.stage === 'THCS').length,
      THPT: grades.filter((g) => g.stage === 'THPT').length,
      GDTX: grades.filter((g) => g.stage === 'GDTX').length,
    };
  }, [grades]);

  // Stage filtered grades
  const stageFilteredGrades = useMemo(() => {
    return filterGradesByStage(grades, selectedStage);
  }, [grades, selectedStage]);

  // Search filtered grades
  const searchFilteredGrades = useMemo(() => {
    return searchGrades(stageFilteredGrades, searchQuery);
  }, [stageFilteredGrades, searchQuery]);

  // Compute dynamic rollups for each grade
  const rolledUpGrades = useMemo<GradeLevelRollup[]>(() => {
    return searchFilteredGrades.map((grade) =>
      computeGradeRollups(grade, classItems, selectedAcademicYear)
    );
  }, [searchFilteredGrades, classItems, selectedAcademicYear]);

  // Compute top KPI cards
  const kpis = useMemo(() => {
    return computeSchoolKPIs(stageFilteredGrades, classItems, selectedAcademicYear);
  }, [stageFilteredGrades, classItems, selectedAcademicYear]);

  // Navigation to detail cockpit
  const handleSelectGrade = (gradeId: string) => {
    router.push(`/${schoolCode}/school/grades/${gradeId}`);
  };

  return (
    <PortalLayout>
      <Head>
        <title>Quản lý Khối Lớp | School Operating Portal</title>
      </Head>

      <div className="space-y-6">
        {/* Page Header */}
        <PageHeader
          title="Quản Lý Khối Lớp"
          description="Danh mục khối lớp chuẩn Bộ GD&ĐT và tổng hợp sức chứa, phân bổ lớp học toàn trường"
        />

        {/* 4 Summary KPI Cards */}
        <GradeSummaryCards kpis={kpis} />

        {/* Filter and Search Toolbar */}
        <GradeToolbar
          selectedStage={selectedStage}
          onSelectStage={(stage) => dispatch(setSelectedStage(stage))}
          stageCounts={stageCounts}
          selectedAcademicYear={selectedAcademicYear}
          onSelectAcademicYear={(year) => dispatch(setSelectedAcademicYear(year))}
          searchQuery={searchQuery}
          onSearchChange={(q) => dispatch(setSearchQuery(q))}
          onClearSearch={() => dispatch(clearSearchQuery())}
        />

        {/* Main Grade Table */}
        <GradeTable
          grades={rolledUpGrades}
          onSelectGrade={handleSelectGrade}
        />
      </div>
    </PortalLayout>
  );
}
