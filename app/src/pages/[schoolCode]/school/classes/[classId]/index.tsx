import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '../../../../../store';
import {
  openEditModal,
  closeFormModal,
  updateClass,
} from '../../../../../store/slices/classSlice';
import { addToast } from '../../../../../store/slices/toastSlice';
import { PortalLayout } from '../../../../../components/layout/PortalLayout';
import { ClassDetailView } from '../../../../../modules/school/classes/ClassDetailView';
import { ClassFormModal } from '../../../../../modules/school/classes/ClassFormModal';
import {
  MOCK_AVAILABLE_TEACHERS,
  MOCK_STUDENT_ENROLLMENTS,
} from '../../../../../services/mockClassData';
import { ClassFormData } from '../../../../../types/class';

export default function ClassDetailPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const schoolCode = (router.query.schoolCode as string) || 'demo';
  const classId = router.query.classId as string;

  const { classes, gradeLevels, isFormModalOpen, formMode, editingClassId } =
    useAppSelector((state) => state.class);

  const currentClass = classes.find((c) => c.id === classId);

  useEffect(() => {
    if (router.query.edit === 'true' && currentClass) {
      dispatch(openEditModal(currentClass.id));
    }
  }, [router.query.edit, currentClass, dispatch]);
  const enrolledStudents = classId ? MOCK_STUDENT_ENROLLMENTS[classId] || [] : [];

  const handleEditSubmit = (data: ClassFormData) => {
    if (currentClass) {
      dispatch(updateClass({ id: currentClass.id, data }));
      dispatch(
        addToast({
          type: 'success',
          message: `Đã cập nhật thông tin lớp ${data.name}.`,
        })
      );
    }
  };

  if (!currentClass) {
    return (
      <PortalLayout>
        <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 m-6">
          <h2 className="text-lg font-bold text-slate-800">Không tìm thấy thông tin lớp học</h2>
          <p className="text-sm text-slate-500 mt-1 mb-4">
            Mã lớp học không tồn tại hoặc đã bị xóa khỏi hệ thống.
          </p>
          <button
            type="button"
            onClick={() => router.push(`/${schoolCode}/school/classes`)}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            Quay lại danh sách lớp
          </button>
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout>
      <Head>
        <title>{currentClass.name} | Chi Tiết Lớp Học | SOHA Portal</title>
      </Head>

      <div className="flex flex-col h-full bg-[#F8FAFC]">
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <ClassDetailView
            classItem={currentClass}
            schoolCode={schoolCode}
            enrolledStudents={enrolledStudents}
            onEditClass={() => dispatch(openEditModal(currentClass.id))}
          />
        </div>
      </div>

      <ClassFormModal
        isOpen={isFormModalOpen}
        onClose={() => dispatch(closeFormModal())}
        onSubmit={handleEditSubmit}
        mode={formMode}
        initialData={currentClass}
        gradeLevels={gradeLevels}
        availableTeachers={MOCK_AVAILABLE_TEACHERS}
        existingClasses={classes}
      />
    </PortalLayout>
  );
}
