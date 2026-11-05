/**
 * Academic Year (Năm Học) Management Page
 * Route: /[schoolCode]/school/academic-year
 * Governance: Marcus Fleet V34 / Constitution V1.0.0
 * Design System: [DS] ECO ME DASHBOARD v1.1.0
 */

import React, { useMemo } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { PortalLayout } from '../../../../components/layout/PortalLayout';
import { PageHeader, Button } from '../../../../components/ds';
import { useAppDispatch, useAppSelector } from '../../../../store';
import {
  setSearchQuery,
  openCreateModal,
  openEditModal,
  closeModal,
  addAcademicYear,
  updateAcademicYear,
} from '../../../../store/slices/academicYearSlice';
import { filterAcademicYears, sortAcademicYears } from '../../../../utils/academicYearValidation';
import { AcademicYearToolbar } from '../../../../modules/school/academic-year/AcademicYearToolbar';
import { AcademicYearTable } from '../../../../modules/school/academic-year/AcademicYearTable';
import { AcademicYearModal } from '../../../../modules/school/academic-year/AcademicYearModal';
import { AcademicYearFormData, AcademicYear } from '../../../../types/academicYear';

export default function AcademicYearPage() {
  const router = useRouter();
  const schoolCode = (router.query.schoolCode as string) || 'demo';

  const dispatch = useAppDispatch();
  const {
    items,
    searchQuery,
    isModalOpen,
    modalMode,
    editingItem,
  } = useAppSelector((state) => state.academicYear);

  // Filter and sort items dynamically
  const displayItems = useMemo(() => {
    const filtered = filterAcademicYears(items, searchQuery);
    return sortAcademicYears(filtered);
  }, [items, searchQuery]);

  const handleSearchChange = (query: string) => {
    dispatch(setSearchQuery(query));
  };

  const handleOpenCreateModal = () => {
    dispatch(openCreateModal());
  };

  const handleOpenEditModal = (item: AcademicYear) => {
    dispatch(openEditModal(item));
  };

  const handleCloseModal = () => {
    dispatch(closeModal());
  };

  const handleSubmitModal = (data: AcademicYearFormData) => {
    if (modalMode === 'create') {
      dispatch(addAcademicYear(data));
    } else if (modalMode === 'edit' && editingItem) {
      dispatch(
        updateAcademicYear({
          id: editingItem.id,
          ...data,
        })
      );
    }
  };

  return (
    <PortalLayout schoolCode={schoolCode}>
      <Head>
        <title>Quản Lý Năm Học | Cổng Vận Hành Trường Học</title>
      </Head>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        {/* Page Header */}
        <PageHeader
          title="Quản Lý Năm Học"
          description="Cấu hình danh mục năm học, phân kỳ học kỳ và xác định năm học hiện tại áp dụng cho toàn trường."
          actions={
            <Button
              variant="primary"
              icon="plus"
              onClick={handleOpenCreateModal}
            >
              Thêm năm học mới
            </Button>
          }
        />

        {/* Toolbar */}
        <AcademicYearToolbar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onOpenCreateModal={handleOpenCreateModal}
        />

        {/* Master Table */}
        <AcademicYearTable
          items={displayItems}
          onEdit={handleOpenEditModal}
        />

        {/* Add / Edit Minimalist 3-Field Modal */}
        <AcademicYearModal
          isOpen={isModalOpen}
          mode={modalMode}
          initialData={editingItem}
          onClose={handleCloseModal}
          onSubmit={handleSubmitModal}
        />
      </div>
    </PortalLayout>
  );
}
