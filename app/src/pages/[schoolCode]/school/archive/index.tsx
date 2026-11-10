import React, { useMemo } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { Icon } from '@/components/ds';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  setSearchQuery,
  setArchivePeriodMonth,
  toggleSort,
  openStudentDetailModal,
  openStaffModal,
  openRestoreModal,
  openPurgeModal,
  closeModal,
  restoreStudent,
  purgeStudent,
  clearNotification,
} from '@/store/slices/archiveSlice';
import {
  filterArchivedStudents,
  sortArchivedStudents,
  formatArchiveDate,
  formatGender,
} from '@/utils/archiveValidation';
import { ArchiveToolbar } from '@/modules/school/archive/ArchiveToolbar';
import { ArchiveTable } from '@/modules/school/archive/ArchiveTable';
import { ArchivedStudentDetailModal } from '@/modules/school/archive/ArchivedStudentDetailModal';
import { ArchiveStaffModal } from '@/modules/school/archive/ArchiveStaffModal';
import { RestoreConfirmModal } from '@/modules/school/archive/RestoreConfirmModal';
import { PermanentDeleteModal } from '@/modules/school/archive/PermanentDeleteModal';
import type { ArchivedStudent, ArchiveStaffOperator, ArchiveSortField } from '@/types/archive';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
`;

const Breadcrumbs = styled.nav`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #64748b;

  .active {
    color: #0f172a;
    font-weight: 500;
  }
`;

const PageHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const PageTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.025em;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.625rem;
`;

const PageSubtitle = styled.p`
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
`;

const NotificationBanner = styled.div<{ $type: 'success' | 'warning' | 'error' | 'info' }>`
  padding: 0.875rem 1.25rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  animation: slideDown 0.2s ease-out;

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  ${(props) =>
    props.$type === 'success' &&
    `
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    color: #166534;
  `}

  ${(props) =>
    props.$type === 'warning' &&
    `
    background: #fffbeb;
    border: 1px solid #fde68a;
    color: #92400e;
  `}
`;

const DismissButton = styled.button`
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.25rem;
  opacity: 0.7;

  &:hover {
    opacity: 1;
  }
`;

export default function SchoolArchivePage() {
  const router = useRouter();
  const schoolCode = (router.query.schoolCode as string) || 'demo';

  const dispatch = useAppDispatch();
  const {
    students,
    activeClasses,
    filter,
    sort,
    selectedStudent,
    selectedStaff,
    activeModal,
    notification,
  } = useAppSelector((state) => state.archive);

  // Filter and sort students
  const displayStudents = useMemo(() => {
    const filtered = filterArchivedStudents(
      students,
      filter.searchQuery,
      filter.archivePeriodMonth
    );
    return sortArchivedStudents(filtered, sort.field, sort.direction);
  }, [students, filter.searchQuery, filter.archivePeriodMonth, sort.field, sort.direction]);

  const handleSearchChange = (query: string) => {
    dispatch(setSearchQuery(query));
  };

  const handleMonthChange = (month?: string) => {
    dispatch(setArchivePeriodMonth(month));
  };

  const handleToggleSort = (field: ArchiveSortField) => {
    dispatch(toggleSort(field));
  };

  const handleOpenDetailModal = (student: ArchivedStudent) => {
    dispatch(openStudentDetailModal(student));
  };

  const handleOpenStaffModal = (staff: ArchiveStaffOperator) => {
    dispatch(openStaffModal(staff));
  };

  const handleOpenRestoreModal = (student: ArchivedStudent) => {
    dispatch(openRestoreModal(student));
  };

  const handleOpenPurgeModal = (student: ArchivedStudent) => {
    dispatch(openPurgeModal(student));
  };

  const handleCloseModal = () => {
    dispatch(closeModal());
  };

  const handleConfirmRestore = (studentId: string) => {
    dispatch(restoreStudent(studentId));
  };

  const handleConfirmPurge = (studentId: string) => {
    dispatch(purgeStudent(studentId));
  };

  const handleExportExcel = () => {
    // Generate CSV string with UTF-8 BOM for Excel Vietnamese compatibility
    const header = [
      'STT',
      'Mã học sinh',
      'Họ và tên',
      'Biệt danh',
      'Ngày sinh',
      'Giới tính',
      'Lớp cũ',
      'Ngày lưu trữ',
      'Người lưu trữ',
      'Lý do lưu trữ',
      'Ghi chú',
      'Phụ huynh',
      'Số điện thoại',
    ];

    const rows = displayStudents.map((s, idx) => [
      idx + 1,
      s.studentCode,
      `"${s.fullName}"`,
      `"${s.nickname || ''}"`,
      formatArchiveDate(s.dateOfBirth),
      formatGender(s.gender),
      `"${s.formerClassName || ''}"`,
      formatArchiveDate(s.archiveDate),
      `"${s.archivedBy?.name || ''}"`,
      `"${s.archiveReason || ''}"`,
      `"${s.archiveNote || ''}"`,
      `"${s.parentName || ''}"`,
      `"${s.parentPhone || ''}"`,
    ]);

    const csvContent =
      '\uFEFF' +
      [header.join(','), ...rows.map((row) => row.join(','))].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `danh_sach_hoc_sinh_luu_tru_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <PortalLayout schoolCode={schoolCode}>
      <Head>
        <title>Lưu trữ học sinh | Cổng điều hành trường học</title>
        <meta
          name="description"
          content="Quản lý hồ sơ học sinh đã chuyển trường, thôi học hoặc tốt nghiệp (Cold Storage)"
        />
      </Head>

      <PageContainer>
        <Breadcrumbs aria-label="Breadcrumbs">
          <span>Nhà trường</span>
          <Icon name="chevron-right" size={12} className="text-slate-400" />
          <span className="active">Lưu trữ</span>
        </Breadcrumbs>

        <PageHeader>
          <PageTitle>
            <Icon name="box-archive" size={22} className="text-[#0070ce]" />
            <span>Lưu trữ học sinh</span>
          </PageTitle>
          <PageSubtitle>
            Quản lý hồ sơ học sinh đã chuyển trường, thôi học hoặc tốt nghiệp (Cold Storage)
          </PageSubtitle>
        </PageHeader>

        {notification && (
          <NotificationBanner $type={notification.type}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Icon
                name={notification.type === 'success' ? 'circle-check' : 'triangle-exclamation'}
                size={16}
              />
              <span>{notification.message}</span>
            </div>
            <DismissButton
              type="button"
              onClick={() => dispatch(clearNotification())}
              aria-label="Đóng thông báo"
            >
              <Icon name="xmark" size={14} />
            </DismissButton>
          </NotificationBanner>
        )}

        <ArchiveToolbar
          searchQuery={filter.searchQuery}
          onSearchChange={handleSearchChange}
          archivePeriodMonth={filter.archivePeriodMonth}
          onMonthChange={handleMonthChange}
          onExportExcel={handleExportExcel}
          totalCount={displayStudents.length}
        />

        <ArchiveTable
          students={displayStudents}
          sort={sort}
          onToggleSort={handleToggleSort}
          onOpenDetailModal={handleOpenDetailModal}
          onOpenStaffModal={handleOpenStaffModal}
          onOpenRestoreModal={handleOpenRestoreModal}
          onOpenPurgeModal={handleOpenPurgeModal}
        />

        <ArchivedStudentDetailModal
          student={selectedStudent}
          isOpen={activeModal === 'detail'}
          onClose={handleCloseModal}
          onRestore={handleOpenRestoreModal}
        />

        <ArchiveStaffModal
          staff={selectedStaff}
          isOpen={activeModal === 'staff'}
          onClose={handleCloseModal}
        />

        <RestoreConfirmModal
          student={selectedStudent}
          activeClasses={activeClasses}
          isOpen={activeModal === 'restore'}
          onClose={handleCloseModal}
          onConfirmRestore={handleConfirmRestore}
        />

        <PermanentDeleteModal
          student={selectedStudent}
          isOpen={activeModal === 'purge'}
          onClose={handleCloseModal}
          onConfirmPurge={handleConfirmPurge}
        />
      </PageContainer>
    </PortalLayout>
  );
}
