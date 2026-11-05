import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { PortalLayout } from '../../../../../components/layout/PortalLayout';
import { TeacherDetailView } from '../../../../../modules/school/teacher/TeacherDetailView';
import { AssignClassModal } from '../../../../../modules/school/teacher/AssignClassModal';
import { ChangeEmailModal } from '../../../../../modules/school/teacher/ChangeEmailModal';
import { useAppDispatch, useAppSelector } from '../../../../../store';
import {
  changePermissionTier,
  changeTeacherStatus,
} from '../../../../../store/slices/teacherSlice';
import { addToast } from '../../../../../store/slices/toastSlice';
import type { TeacherWorkingStatus } from '../../../../../types/teacher';

export default function TeacherInfoPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { schoolCode = 'demo', id } = router.query;
  const currentSchoolCode = typeof schoolCode === 'string' ? schoolCode : 'demo';
  const teacherId = typeof id === 'string' ? id : '';

  const teacher = useAppSelector((state) =>
    state.teacher.teachers.find((t) => t.id === teacherId)
  );

  // Modals state
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [isEmailOpen, setIsEmailOpen] = useState(false);

  const handleChangePermission = () => {
    if (!teacher) return;
    const nextTier = teacher.permissionTier === 'chinh' ? 'ho_tro' : 'chinh';
    dispatch(changePermissionTier({ teacherId: teacher.id, permissionTier: nextTier }));
    dispatch(
      addToast({
        type: 'info',
        title: 'Cập nhật phân quyền',
        message: `Đã chuyển phân quyền của "${teacher.fullName}" sang ${
          nextTier === 'chinh' ? 'Giáo viên chính' : 'Giáo viên hỗ trợ'
        }`,
      })
    );
  };

  const handleChangeStatus = () => {
    if (!teacher) return;
    const nextStatus: TeacherWorkingStatus =
      teacher.status === 'dang_lam_viec' ? 'tam_nghi' : 'dang_lam_viec';
    dispatch(changeTeacherStatus({ teacherId: teacher.id, status: nextStatus }));
    dispatch(
      addToast({
        type: 'info',
        title: 'Cập nhật trạng thái',
        message: `Đã chuyển trạng thái làm việc của "${teacher.fullName}" sang ${
          nextStatus === 'dang_lam_viec' ? 'Đang làm việc' : 'Tạm nghỉ'
        }`,
      })
    );
  };

  return (
    <PortalLayout schoolCode={currentSchoolCode}>
      <Head>
        <title>
          {teacher ? `${teacher.fullName} | Hồ Sơ Giáo Viên` : 'Chi Tiết Giáo Viên'}
        </title>
      </Head>

      <div className="space-y-6">
        {!teacher ? (
          <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-12 text-center space-y-4">
            <h2 className="text-lg font-bold text-slate-800">Không tìm thấy thông tin giáo viên</h2>
            <p className="text-xs text-slate-500">
              Giáo viên có mã &quot;{teacherId}&quot; không tồn tại hoặc đã bị xóa khỏi hệ thống.
            </p>
            <Link
              href={`/${currentSchoolCode}/school/teacher`}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#0070CE] rounded-lg hover:bg-[#005ba8]"
            >
              Quay lại danh sách
            </Link>
          </div>
        ) : (
          <>
            <TeacherDetailView
              teacher={teacher}
              schoolCode={currentSchoolCode}
              onOpenAssignClass={() => setIsAssignOpen(true)}
              onOpenChangeEmail={() => setIsEmailOpen(true)}
              onChangePermission={handleChangePermission}
              onChangeStatus={handleChangeStatus}
            />

            {/* Modals */}
            <AssignClassModal
              teacher={teacher}
              isOpen={isAssignOpen}
              onClose={() => setIsAssignOpen(false)}
            />

            <ChangeEmailModal
              teacher={teacher}
              isOpen={isEmailOpen}
              onClose={() => setIsEmailOpen(false)}
            />
          </>
        )}
      </div>
    </PortalLayout>
  );
}
