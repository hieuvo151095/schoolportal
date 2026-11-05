/**
 * Teacher Directory Overview Page
 * Route: /[schoolCode]/school/teacher
 * Governance: Marcus Fleet V34 / Constitution V1.0.0
 * Design System: [DS] ECO ME DASHBOARD v1.1.0 (TeacherListPage Spec 1:1)
 */

import React, { useState, useMemo } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { PortalLayout } from '../../../../components/layout/PortalLayout';
import { PageHeader, StatCard, Button } from '../../../../components/ds';
import { TeacherToolbar } from '../../../../modules/school/teacher/TeacherToolbar';
import { TeacherTable } from '../../../../modules/school/teacher/TeacherTable';
import { AssignClassModal } from '../../../../modules/school/teacher/AssignClassModal';
import { ChangeEmailModal } from '../../../../modules/school/teacher/ChangeEmailModal';
import { DeleteTeacherModal } from '../../../../modules/school/teacher/DeleteTeacherModal';
import { ExtendedTeacherFilterModal } from '../../../../modules/school/teacher/ExtendedTeacherFilterModal';
import { useAppDispatch, useAppSelector } from '../../../../store';
import type { Teacher, TeacherPermissionTier, TeacherWorkingStatus } from '../../../../types/teacher';
import { matchesTeacherFilter } from '../../../../utils/teacherValidation';
import {
  changePermissionTier,
  changeTeacherStatus,
} from '../../../../store/slices/teacherSlice';
import { addToast } from '../../../../store/slices/toastSlice';

export default function TeacherDirectoryPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { schoolCode = 'demo' } = router.query;
  const currentSchoolCode = typeof schoolCode === 'string' ? schoolCode : 'demo';

  const { teachers, filter } = useAppSelector((state) => state.teacher);

  // Filtered teachers list
  const filteredTeachers = useMemo(() => {
    return teachers.filter((t) => matchesTeacherFilter(t, filter));
  }, [teachers, filter]);

  // Multi-selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modals state
  const [activeAssignTeacher, setActiveAssignTeacher] = useState<Teacher | null>(null);
  const [isAssignOpen, setIsAssignOpen] = useState(false);

  const [activeEmailTeacher, setActiveEmailTeacher] = useState<Teacher | null>(null);
  const [isEmailOpen, setIsEmailOpen] = useState(false);

  const [activeDeleteTeacher, setActiveDeleteTeacher] = useState<Teacher | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [isExtendedFilterOpen, setIsExtendedFilterOpen] = useState(false);

  // Stats calculation matching DS TeacherListPage
  const stats = useMemo(() => {
    const total = teachers.length;
    const active = teachers.filter((t) => t.status === 'dang_lam_viec').length;
    const primary = teachers.filter((t) => t.permissionTier === 'chinh').length;
    const assistant = teachers.filter((t) => t.permissionTier === 'ho_tro').length;
    const homeroom = teachers.filter((t) => Boolean(t.homeroomClassId)).length;
    return { total, active, primary, assistant, homeroom };
  }, [teachers]);

  // Selection handlers
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredTeachers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredTeachers.map((t) => t.id));
    }
  };

  // Quick Action Handlers
  const handleChangePermission = (teacherId: string, tier: TeacherPermissionTier) => {
    const teacher = teachers.find((t) => t.id === teacherId);
    dispatch(changePermissionTier({ teacherId, permissionTier: tier }));
    dispatch(
      addToast({
        type: 'info',
        title: 'Cập nhật phân quyền',
        message: `Đã đổi phân quyền của ${teacher?.fullName || 'giáo viên'} sang ${
          tier === 'chinh' ? 'Giáo viên chính' : 'Giáo viên hỗ trợ'
        }`,
      })
    );
  };

  const handleChangeStatus = (teacherId: string, status: TeacherWorkingStatus) => {
    const teacher = teachers.find((t) => t.id === teacherId);
    dispatch(changeTeacherStatus({ teacherId, status }));
    dispatch(
      addToast({
        type: 'info',
        title: 'Cập nhật trạng thái',
        message: `Đã đổi trạng thái công tác của ${teacher?.fullName || 'giáo viên'}`,
      })
    );
  };

  return (
    <PortalLayout schoolCode={currentSchoolCode}>
      <Head>
        <title>Hồ Sơ Giáo Viên | Cổng Vận Hành Trường Học</title>
      </Head>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        {/* Page Header */}
        <PageHeader
          title="Danh Sách Giáo Viên"
          description="Quản lý đội ngũ giảng dạy, phân công chủ nhiệm, tài khoản đăng nhập và phân quyền kiểm duyệt."
          actions={
            <Button
              variant="primary"
              icon="plus"
              onClick={() => router.push(`/${currentSchoolCode}/school/teacher/create`)}
            >
              Thêm giáo viên
            </Button>
          }
        />

        {/* 5-Card Statistical Overview Bar (1:1 with DS TeacherListPage) */}
        <div className="ecomd-stat-group" style={{ '--ecomd-cols': 5 } as React.CSSProperties}>
          <StatCard
            label="Tổng giáo viên"
            value={stats.total}
            icon="user-tie"
            tone="neutral"
          />
          <StatCard
            label="Đang làm việc"
            value={stats.active}
            icon="user-clock"
            tone="success"
          />
          <StatCard
            label="Giáo viên chính"
            value={stats.primary}
            icon="user-shield"
            tone="info"
          />
          <StatCard
            label="Giáo viên hỗ trợ"
            value={stats.assistant}
            icon="id-badge"
            tone="warning"
          />
          <StatCard
            label="Đang chủ nhiệm"
            value={stats.homeroom}
            icon="chalkboard-user"
            tone="purple"
          />
        </div>

        {/* Content Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {/* Toolbar */}
          <TeacherToolbar
            schoolCode={currentSchoolCode}
            onOpenExtendedFilter={() => setIsExtendedFilterOpen(true)}
          />

          {/* Master Table */}
          <TeacherTable
            teachers={filteredTeachers}
            schoolCode={currentSchoolCode}
            selectedIds={selectedIds}
            onToggleSelect={handleToggleSelect}
            onToggleSelectAll={handleToggleSelectAll}
            onOpenAssignClass={(teacher) => {
              setActiveAssignTeacher(teacher);
              setIsAssignOpen(true);
            }}
            onOpenChangeEmail={(teacher) => {
              setActiveEmailTeacher(teacher);
              setIsEmailOpen(true);
            }}
            onOpenDelete={(teacher) => {
              setActiveDeleteTeacher(teacher);
              setIsDeleteOpen(true);
            }}
            onChangePermission={handleChangePermission}
            onChangeStatus={handleChangeStatus}
          />
        </div>

        {/* Modals */}
        <AssignClassModal
          teacher={activeAssignTeacher}
          isOpen={isAssignOpen}
          onClose={() => {
            setIsAssignOpen(false);
            setActiveAssignTeacher(null);
          }}
        />

        <ChangeEmailModal
          teacher={activeEmailTeacher}
          isOpen={isEmailOpen}
          onClose={() => {
            setIsEmailOpen(false);
            setActiveEmailTeacher(null);
          }}
        />

        <DeleteTeacherModal
          teacher={activeDeleteTeacher}
          isOpen={isDeleteOpen}
          onClose={() => {
            setIsDeleteOpen(false);
            setActiveDeleteTeacher(null);
          }}
        />

        <ExtendedTeacherFilterModal
          isOpen={isExtendedFilterOpen}
          onClose={() => setIsExtendedFilterOpen(false)}
        />
      </div>
    </PortalLayout>
  );
}
