/**
 * Student Directory Overview Page
 * Route: /[schoolCode]/school/kid
 * Governance: Marcus Fleet V34 / Constitution V1.0.0
 * Design System: [DS] ECO ME DASHBOARD v1.1.0
 */

import React, { useState, useMemo } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { PortalLayout } from '../../../../components/layout/PortalLayout';
import { PageHeader, StatCard, Button } from '../../../../components/ds';
import { StudentToolbar } from '../../../../modules/school/student/StudentToolbar';
import { StudentTable } from '../../../../modules/school/student/StudentTable';
import { ClassTransferModal } from '../../../../modules/school/student/ClassTransferModal';
import { StudentNotesModal } from '../../../../modules/school/student/StudentNotesModal';
import { PhysicalGrowthModal } from '../../../../modules/school/student/PhysicalGrowthModal';
import { TuitionOverrideModal } from '../../../../modules/school/student/TuitionOverrideModal';
import { CreateStudentSlideOver } from '../../../../modules/school/student/CreateStudentSlideOver';
import { useAppSelector } from '../../../../store';
import { Student } from '../../../../types/student';
import { matchesStudentFilter } from '../../../../utils/studentValidation';

export default function StudentDirectoryPage() {
  const router = useRouter();
  const { schoolCode = 'demo' } = router.query;
  const currentSchoolCode = typeof schoolCode === 'string' ? schoolCode : 'demo';

  const { students, filter } = useAppSelector((state) => state.student);
  const policies = useAppSelector((state) => state.discount?.policies || []);

  // Filtered student list
  const filteredStudents = useMemo(() => {
    return students.filter((s) => matchesStudentFilter(s, filter, policies));
  }, [students, filter, policies]);

  // Multi-selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modals state
  const [transferStudentsList, setTransferStudentsList] = useState<Student[]>([]);
  const [isTransferOpen, setIsTransferOpen] = useState(false);

  const [activeNotesStudent, setActiveNotesStudent] = useState<Student | null>(null);
  const [isNotesOpen, setIsNotesOpen] = useState(false);

  const [activeGrowthStudent, setActiveGrowthStudent] = useState<Student | null>(null);
  const [isGrowthOpen, setIsGrowthOpen] = useState(false);

  const [activeTuitionStudent, setActiveTuitionStudent] = useState<Student | null>(null);
  const [isTuitionOpen, setIsTuitionOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  React.useEffect(() => {
    if (router.query.create === 'true') {
      setIsCreateOpen(true);
    }
  }, [router.query.create]);

  // Stats
  const stats = useMemo(() => {
    const total = students.length;
    const active = students.filter((s) => s.status === 'active').length;
    const inactive = students.filter((s) => s.status !== 'active').length;
    const male = students.filter((s) => s.gender === 'nam').length;
    const female = students.filter((s) => s.gender === 'nu').length;
    return { total, active, inactive, male, female };
  }, [students]);

  // Selection handlers
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredStudents.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredStudents.map((s) => s.id));
    }
  };

  // Open modals
  const handleOpenTransferSingle = (student: Student) => {
    setTransferStudentsList([student]);
    setIsTransferOpen(true);
  };

  const handleOpenBatchTransfer = () => {
    const selectedStudents = students.filter((s) => selectedIds.includes(s.id));
    if (selectedStudents.length > 0) {
      setTransferStudentsList(selectedStudents);
      setIsTransferOpen(true);
    }
  };

  const handleOpenPromotion = () => {
    const activeStudents = filteredStudents.filter((s) => s.status === 'active');
    setTransferStudentsList(activeStudents);
    setIsTransferOpen(true);
  };

  return (
    <PortalLayout schoolCode={currentSchoolCode}>
      <Head>
        <title>Hồ Sơ Học Sinh | Cổng Vận Hành Trường Học</title>
      </Head>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        {/* Page Header */}
        <PageHeader
          title="Danh Sách Học Sinh"
          description="Quản lý hồ sơ học sinh, thông tin người giám hộ, phân bổ lớp học và thể chất."
        />

        {/* Stats */}
        <div className="ecomd-stat-group" style={{ '--ecomd-cols': 4 } as React.CSSProperties}>
          <StatCard
            label="Tổng số học sinh"
            value={stats.total}
            icon="graduation-cap"
            tone="neutral"
          />
          <StatCard
            label="Đang học"
            value={stats.active}
            icon="check"
            tone="success"
          />
          <StatCard
            label="Tạm nghỉ / Đã chuyển"
            value={stats.inactive}
            icon="clock"
            tone="warning"
          />
          <StatCard
            label="Tỷ lệ Nam / Nữ"
            value={`${stats.male} Nam / ${stats.female} Nữ`}
            icon="user"
            tone="info"
          />
        </div>

        {/* Content Section - Unified Table Card */}
        <div className="ecomd-table-card">
          {/* Toolbar */}
          <StudentToolbar
            schoolCode={currentSchoolCode}
            selectedCount={selectedIds.length}
            onOpenBatchTransfer={handleOpenBatchTransfer}
            onOpenPromotion={handleOpenPromotion}
            onOpenCreate={() => setIsCreateOpen(true)}
          />

          {/* Master Table */}
          <StudentTable
            students={filteredStudents}
            schoolCode={currentSchoolCode}
            selectedIds={selectedIds}
            onToggleSelect={handleToggleSelect}
            onToggleSelectAll={handleToggleSelectAll}
            onOpenTransfer={handleOpenTransferSingle}
            onOpenNotes={(student) => {
              setActiveNotesStudent(student);
              setIsNotesOpen(true);
            }}
            onOpenTuition={(student) => {
              setActiveTuitionStudent(student);
              setIsTuitionOpen(true);
            }}
            onOpenGrowth={(student) => {
              setActiveGrowthStudent(student);
              setIsGrowthOpen(true);
            }}
          />
        </div>

        {/* Modals */}
        <ClassTransferModal
          students={transferStudentsList}
          isOpen={isTransferOpen}
          onClose={() => {
            setIsTransferOpen(false);
            setTransferStudentsList([]);
          }}
        />

        <StudentNotesModal
          student={activeNotesStudent}
          isOpen={isNotesOpen}
          onClose={() => {
            setIsNotesOpen(false);
            setActiveNotesStudent(null);
          }}
        />

        <PhysicalGrowthModal
          student={activeGrowthStudent}
          isOpen={isGrowthOpen}
          onClose={() => {
            setIsGrowthOpen(false);
            setActiveGrowthStudent(null);
          }}
        />

        <TuitionOverrideModal
          student={activeTuitionStudent}
          isOpen={isTuitionOpen}
          onClose={() => {
            setIsTuitionOpen(false);
            setActiveTuitionStudent(null);
          }}
        />

        <CreateStudentSlideOver
          isOpen={isCreateOpen}
          onClose={() => {
            setIsCreateOpen(false);
            if (router.query.create) {
              router.replace(`/${currentSchoolCode}/school/kid`, undefined, { shallow: true });
            }
          }}
          schoolCode={currentSchoolCode}
        />
      </div>
    </PortalLayout>
  );
}
