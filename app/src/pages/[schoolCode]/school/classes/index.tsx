/**
 * Class Management Page
 * Route: /[schoolCode]/school/classes
 * Governance: Marcus Fleet V34 / Constitution V1.0.0
 * Design System: [DS] ECO ME DASHBOARD v1.1.0
 */

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '../../../../store';
import {
  setActiveTaxonomy,
  setFilterCriteria,
  resetFilterCriteria,
  openCreateModal,
  openEditModal,
  closeFormModal,
  openDeleteModal,
  closeDeleteModal,
  addClass,
  updateClass,
  deleteClass,
} from '../../../../store/slices/classSlice';
import { addToast } from '../../../../store/slices/toastSlice';
import { filterClassesList } from '../../../../utils/classValidation';
import { PortalLayout } from '../../../../components/layout/PortalLayout';
import { PageHeader, Button } from '../../../../components/ds';
import { ClassSummaryCards } from '../../../../modules/school/classes/ClassSummaryCards';
import { ClassToolbar } from '../../../../modules/school/classes/ClassToolbar';
import { ClassTable } from '../../../../modules/school/classes/ClassTable';
import { ClassFormModal } from '../../../../modules/school/classes/ClassFormModal';
import { DeleteClassModal } from '../../../../modules/school/classes/DeleteClassModal';
import { ClassFilterDrawer } from '../../../../modules/school/classes/ClassFilterDrawer';
import { MOCK_AVAILABLE_TEACHERS } from '../../../../services/mockClassData';
import { ClassFormData } from '../../../../types/class';

export default function ClassManagementPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const schoolCode = (router.query.schoolCode as string) || 'demo';

  const {
    classes,
    gradeLevels,
    activeTaxonomy,
    filterCriteria,
    isFormModalOpen,
    isDeleteModalOpen,
    formMode,
    editingClassId,
    classToDelete,
  } = useAppSelector((state) => state.class);

  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  useEffect(() => {
    if (router.query.create === 'true') {
      dispatch(openCreateModal());
    }
  }, [router.query.create, dispatch]);

  // Compute filtered classes using pure business engine
  const filteredClasses = filterClassesList(classes, filterCriteria);
  const curricularCount = classes.filter((c) => c.taxonomy === 'chinh_khoa').length;
  const extracurricularCount = classes.filter((c) => c.taxonomy === 'ngoai_khoa').length;

  const activeFilterCount = [
    filterCriteria.gradeLevelId,
    filterCriteria.status,
    filterCriteria.teacherRole,
    filterCriteria.teacherId,
    filterCriteria.csdlStatus,
    filterCriteria.capacityMin !== undefined ? 'min' : null,
    filterCriteria.capacityMax !== undefined ? 'max' : null,
  ].filter(Boolean).length;

  const editingClass = editingClassId
    ? classes.find((c) => c.id === editingClassId)
    : null;

  const handleFormSubmit = (data: ClassFormData) => {
    if (formMode === 'create') {
      dispatch(addClass(data));
      dispatch(
        addToast({
          type: 'success',
          message: `Đã tạo mới lớp ${data.name} thành công.`,
        })
      );
    } else if (formMode === 'edit' && editingClassId) {
      dispatch(updateClass({ id: editingClassId, data }));
      dispatch(
        addToast({
          type: 'success',
          message: `Đã cập nhật thông tin lớp ${data.name}.`,
        })
      );
    }
  };

  const handleDeleteConfirm = (classId: string) => {
    const target = classes.find((c) => c.id === classId);
    dispatch(deleteClass(classId));
    dispatch(
      addToast({
        type: 'success',
        message: `Đã xóa lớp học ${target?.name || ''} khỏi hệ thống.`,
      })
    );
  };

  return (
    <PortalLayout>
      <Head>
        <title>Quản Lý Lớp Học | Finviet School Portal</title>
      </Head>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        {/* Page Header */}
        <PageHeader
          title="Quản Lý Lớp Học"
          description="Danh mục lớp học chính khóa, lớp ngoại khóa & câu lạc bộ năm học 2025-2026."
        />

        {/* 4 KPI Summary Cards */}
        <ClassSummaryCards classes={classes} />

        {/* Toolbar (Tabs, Search, Grade selector, Action CTA) */}
        <ClassToolbar
          activeTaxonomy={activeTaxonomy}
          onSelectTaxonomy={(tax) => dispatch(setActiveTaxonomy(tax))}
          curricularCount={curricularCount}
          extracurricularCount={extracurricularCount}
          gradeLevels={gradeLevels}
          filterCriteria={filterCriteria}
          onUpdateFilter={(f) => dispatch(setFilterCriteria(f))}
          onResetFilter={() => dispatch(resetFilterCriteria())}
          onOpenCreate={() => dispatch(openCreateModal())}
          onOpenFilterDrawer={() => setIsFilterDrawerOpen(true)}
          activeFilterCount={activeFilterCount}
        />

        {/* Class Table */}
        <ClassTable
          classes={filteredClasses}
          taxonomy={activeTaxonomy}
          schoolCode={schoolCode}
          onEditClass={(id) => dispatch(openEditModal(id))}
          onDeleteClass={(id) => dispatch(openDeleteModal(id))}
        />

        {/* Creation & Edit Modal */}
        <ClassFormModal
          isOpen={isFormModalOpen}
          onClose={() => dispatch(closeFormModal())}
          onSubmit={handleFormSubmit}
          mode={formMode}
          initialData={editingClass}
          gradeLevels={gradeLevels}
          availableTeachers={MOCK_AVAILABLE_TEACHERS}
          existingClasses={classes}
        />

        {/* Delete Confirmation Modal (BR02) */}
        <DeleteClassModal
          isOpen={isDeleteModalOpen}
          classItem={classToDelete}
          onClose={() => dispatch(closeDeleteModal())}
          onConfirm={handleDeleteConfirm}
        />

        {/* Filter Drawer */}
        <ClassFilterDrawer
          isOpen={isFilterDrawerOpen}
          onClose={() => setIsFilterDrawerOpen(false)}
          filterCriteria={filterCriteria}
          onUpdateFilter={(f) => dispatch(setFilterCriteria(f))}
          onResetFilter={() => dispatch(resetFilterCriteria())}
          availableTeachers={MOCK_AVAILABLE_TEACHERS}
        />
      </div>
    </PortalLayout>
  );
}
