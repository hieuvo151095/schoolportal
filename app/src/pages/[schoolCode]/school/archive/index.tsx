import React, { useMemo } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Icon, PageHeader } from '@/components/ds';
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

export default function SchoolArchivePage() {
  const router = useRouter();
  const schoolCode = (router.query.schoolCode as string) || 'demo';
  const dispatch = useAppDispatch();

  const {
    students,
    activeClasses,
    filter,
    sort,
    activeModal,
    selectedStudent,
    selectedStaff,
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

      <div className="space-y-6">
        <PageHeader
          title="Lưu Trữ Học Sinh"
          description="Quản lý hồ sơ học sinh đã chuyển trường, thôi học hoặc tốt nghiệp (Cold Storage)"
        />

        {notification && (
          <div
            className={`p-3.5 rounded-lg flex items-center justify-between gap-3 text-sm font-medium ${
              notification.type === 'success'
                ? 'bg-[#f0fdf4] border border-[#bbf7d0] text-[#166534]'
                : 'bg-[#fffbeb] border border-[#fde68a] text-[#92400e]'
            }`}
          >
            <div className="flex items-center gap-2">
              <Icon
                name={notification.type === 'success' ? 'circle-check' : 'triangle-exclamation'}
                size={16}
              />
              <span>{notification.message}</span>
            </div>
            <button
              type="button"
              onClick={() => dispatch(clearNotification())}
              aria-label="Đóng thông báo"
              className="p-1 rounded opacity-70 hover:opacity-100 cursor-pointer"
            >
              <Icon name="xmark" size={14} />
            </button>
          </div>
        )}

        {/* Unified Table Card */}
        <div className="ecomd-table-card">
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
        </div>

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
      </div>
    </PortalLayout>
  );
}
