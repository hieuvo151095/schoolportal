import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCamera,
  faChevronRight,
  faChevronLeft,
  faUserCheck,
  faUserClock,
  faUsers,
  faSlidersH,
} from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch, useAppSelector } from '@/store';
import { setFilterState, clearToast } from '@/store/slices/faceRecognitionSlice';
import { addToast } from '@/store/slices/toastSlice';
import { filterStudentFaceRecords } from '@/utils/faceRecognitionValidation';
import { FaceRecognitionToolbar } from './FaceRecognitionToolbar';
import { FaceRecognitionTable } from './FaceRecognitionTable';
import { RegisterFaceModal } from './RegisterFaceModal';
import { EditFaceModal } from './EditFaceModal';
import { DeleteFaceConfirmModal } from './DeleteFaceConfirmModal';
import { FacePhotoLightboxModal } from './FacePhotoLightboxModal';
import { PageHeader, StatCard, IconButton } from '@/components/ds';

export const FaceRecognitionShell: React.FC = () => {
  const router = useRouter();
  const schoolCode = (router.query.schoolCode as string) || 'demo';
  const dispatch = useAppDispatch();
  const { records, filterState, toastMessage } = useAppSelector(
    (state) => state.faceRecognition
  );

  // Lightbox state
  const [lightboxPhoto, setLightboxPhoto] = useState<string | null>(null);
  const [lightboxStudent, setLightboxStudent] = useState<string | null>(null);

  // Sync toastMessage from faceRecognitionSlice with global toast
  useEffect(() => {
    if (toastMessage) {
      dispatch(
        addToast({
          type: 'success',
          title: 'Nhận diện khuôn mặt',
          message: toastMessage,
        })
      );
      dispatch(clearToast());
    }
  }, [toastMessage, dispatch]);

  const filteredRecords = filterStudentFaceRecords(records, filterState);

  // Statistics
  const totalStudents = records.length;
  const registeredCount = records.filter((r) => r.isRegistered).length;
  const unregisteredCount = totalStudents - registeredCount;
  const registeredPercentage =
    totalStudents > 0 ? Math.round((registeredCount / totalStudents) * 100) : 0;

  // Pagination
  const pageSize = filterState.pageSize;
  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / pageSize));
  const currentPage = Math.min(filterState.page, totalPages);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      dispatch(setFilterState({ page: newPage }));
    }
  };

  const handleOpenLightbox = (photoUrl: string, studentName: string) => {
    setLightboxPhoto(photoUrl);
    setLightboxStudent(studentName);
  };

  const handleCloseLightbox = () => {
    setLightboxPhoto(null);
    setLightboxStudent(null);
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Page Header */}
      <PageHeader
        title="Đăng ký nhận diện"
        description="Quản lý và đăng ký ảnh khuôn mặt nhận diện sinh trắc học cho học sinh toàn trường"
      />

      {/* KPI / Metric Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 'var(--space-4)',
          marginBottom: 'var(--space-4)',
        }}
      >
        <StatCard
          label="Tổng học sinh"
          value={`${totalStudents} học sinh`}
          icon="users"
          tone="info"
        />
        <StatCard
          label="Đã đăng ký nhận diện"
          value={`${registeredCount} (${registeredPercentage}%)`}
          icon="circle-check"
          tone="success"
        />
        <StatCard
          label="Chưa đăng ký nhận diện"
          value={`${unregisteredCount} chưa có ảnh`}
          icon="clock"
          tone="warning"
        />
      </div>

      {/* Filter Toolbar */}
      <FaceRecognitionToolbar />

      {/* Main Table */}
      <FaceRecognitionTable onPreviewPhoto={handleOpenLightbox} />

      {/* Dynamic Footer with Total and Pagination (BR09) */}
      <div className="bg-white px-5 py-3.5 rounded-xl border border-gray-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Total Count */}
        <div className="text-xs text-gray-600 font-medium">
          Tổng:{' '}
          <span className="font-bold text-gray-900 font-mono">
            {filteredRecords.length}
          </span>{' '}
          học sinh
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center gap-1.5">
          <IconButton
            icon="chevron-left"
            label="Trang trước"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          />

          <span className="text-xs text-slate-600 px-2 font-medium">
            Trang <strong className="text-slate-900">{currentPage}</strong> / {totalPages}
          </span>

          <IconButton
            icon="chevron-right"
            label="Trang sau"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          />
        </div>
      </div>

      {/* Modals */}
      <RegisterFaceModal />
      <EditFaceModal />
      <DeleteFaceConfirmModal />
      <FacePhotoLightboxModal
        photoUrl={lightboxPhoto}
        studentName={lightboxStudent}
        onClose={handleCloseLightbox}
      />
    </div>
  );
};
