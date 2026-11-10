/**
 * Grade Cockpit / Detail Page
 * Design System: [DS] ECO ME DASHBOARD v1.1.0 (PageHeader, StatCard, GradeClassTable)
 */

import React, { useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import PortalLayout from '@/components/layout/PortalLayout';
import { useAppSelector } from '@/store';
import { computeGradeRollups } from '@/utils/gradeValidation';
import { GradeDetailCards } from '@/modules/school/grades/GradeDetailCards';
import { GradeClassTable } from '@/modules/school/grades/GradeClassTable';
import type { GradeClassItem } from '@/types/grade';
import { PageHeader, Button, Icon } from '@/components/ds';

export default function GradeDetailPage() {
  const router = useRouter();
  const schoolCode = (router.query.schoolCode as string) || 'demo';
  const gradeId = (router.query.gradeId as string) || '';

  const { grades, classes: seededGradeClasses, selectedAcademicYear } =
    useAppSelector((state) => state.grade);
  const classSliceItems = useAppSelector((state) => state.class?.classes || []);

  // Find target grade
  const grade = useMemo(() => {
    return grades.find(
      (g) =>
        g.id.toLowerCase() === gradeId.toLowerCase() ||
        g.code.toLowerCase() === gradeId.toLowerCase()
    );
  }, [grades, gradeId]);

  // Combine seeded grade classes with any classes matching grade in classSlice
  const classItems = useMemo<GradeClassItem[]>(() => {
    if (!grade) return [];

    // Check pre-seeded mock grade classes
    const preSeeded = seededGradeClasses[grade.id] || seededGradeClasses[grade.id.toLowerCase()] || [];

    // Also pull classes from classSlice if matching
    const fromClassSlice = classSliceItems
      .filter((c) => c.gradeLevelId === grade.id || c.gradeName === grade.name)
      .map((c) => ({
        id: c.id,
        code: c.code,
        name: c.name,
        gradeLevelId: grade.id,
        academicYear: c.academicYear,
        room: c.roomNumber,
        homeroomTeacher: c.homeroomTeacherId
          ? {
              id: c.homeroomTeacherId,
              fullName: c.homeroomTeacherName || 'Chưa rõ',
              phone: c.homeroomTeacherPhone || '',
              avatar: c.homeroomTeacherAvatar,
            }
          : undefined,
        studentCount: c.studentCount,
        maxCapacity: c.maxCapacity || 35,
        subjectTeacherCount: c.instructors ? c.instructors.length : 10,
        status: (c.status === 'dang_hoat_dong' ? 'dang_hoc' : 'tam_dung') as 'dang_hoc' | 'tam_dung',
      }));

    // Deduplicate by ID
    const map = new Map<string, GradeClassItem>();
    preSeeded.forEach((c) => map.set(c.id, c));
    fromClassSlice.forEach((c) => map.set(c.id, c));

    return Array.from(map.values());
  }, [grade, seededGradeClasses, classSliceItems]);

  // Compute rollups for target grade
  const gradeRollup = useMemo(() => {
    if (!grade) return null;
    return computeGradeRollups(grade, classItems, selectedAcademicYear);
  }, [grade, classItems, selectedAcademicYear]);

  if (!grade || !gradeRollup) {
    return (
      <PortalLayout>
        <div style={{ padding: 'var(--space-12)', textAlign: 'center', maxWidth: '480px', margin: '0 auto' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--color-primary-50)',
              color: 'var(--semantic-amber)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto var(--space-4)',
            }}
          >
            <Icon name="triangle-exclamation" size={24} />
          </div>
          <h2 className="h4" style={{ marginBottom: 'var(--space-2)' }}>
            Không tìm thấy thông tin khối lớp
          </h2>
          <p className="body-sm" style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>
            Mã khối lớp &ldquo;{gradeId}&rdquo; không tồn tại hoặc đã bị di chuyển.
          </p>
          <Link
            href={`/${schoolCode}/school/grades`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              padding: 'var(--space-2) var(--space-4)',
              background: 'var(--eco-blue-strong)',
              color: '#ffffff',
              borderRadius: 'var(--radius-md)',
              textDecoration: 'none',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-bold)',
            }}
          >
            <Icon name="arrow-left" size={14} />
            <span>Quay lại danh mục khối lớp</span>
          </Link>
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout>
      <Head>
        <title>{grade.name} | Chi tiết Khối Lớp | School Operating Portal</title>
      </Head>

      <div className="space-y-6">
        {/* Navigation & Page Header */}
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <Link
            href={`/${schoolCode}/school/grades`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              fontSize: 'var(--text-xs)',
              fontWeight: 'var(--font-semibold)',
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              marginBottom: 'var(--space-2)',
            }}
          >
            <Icon name="arrow-left" size={12} />
            <span>Danh mục khối lớp</span>
          </Link>
          <PageHeader
            title={`${grade.name} (${grade.code})`}
            description={`Tổng hợp thông tin phân bổ lớp học, giáo viên chủ nhiệm và năng lực tiếp nhận học sinh khối ${grade.name} (${selectedAcademicYear})`}
            actions={
              <Button
                variant="primary"
                icon="plus"
                href={`/${schoolCode}/school/classes/create`}
              >
                Thêm lớp mới vào khối
              </Button>
            }
          />
        </div>

        {/* 4 Detail KPI Cards */}
        <GradeDetailCards grade={gradeRollup} />

        {/* Classes Table */}
        <GradeClassTable schoolCode={schoolCode} classes={classItems} />
      </div>
    </PortalLayout>
  );
}
