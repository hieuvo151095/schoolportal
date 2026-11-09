import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSchool,
  faClock,
  faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  setActiveTab,
  openUnsavedLeaveModal,
  closeUnsavedLeaveModal,
  discardChanges,
  loadSchoolByCode,
} from '../../../store/slices/schoolProfileSlice';
import { SchoolInfoForm } from './SchoolInfoForm';
import { OperatingHoursForm } from './OperatingHoursForm';
import { AttendanceRulesForm } from './AttendanceRulesForm';
import { CameraAttendanceForm } from './CameraAttendanceForm';
import { UnsavedChangesModal } from './UnsavedChangesModal';
import { EcoButton } from '../../../components/eco';

export const SchoolEditContainer: React.FC = () => {
  const router = useRouter();
  const { schoolCode, tab } = router.query;
  const sCode = (schoolCode as string) || 'demo';

  const dispatch = useAppDispatch();
  const {
    activeTab,
    isDirtyInfo,
    isDirtyHours,
    isDirtyRules,
    isDirtyCamera,
    showUnsavedLeaveModal: isModalOpen,
    pendingNavigationUrl,
    toastMessage,
    toastType,
  } = useAppSelector((state) => state.schoolProfile);

  const isDirty = isDirtyInfo || isDirtyHours || isDirtyRules || isDirtyCamera;

  // Load school profile based on sCode
  useEffect(() => {
    if (sCode) {
      dispatch(loadSchoolByCode(sCode));
    }
  }, [sCode, dispatch]);

  // Sync route query ?tab= with Redux activeTab
  useEffect(() => {
    if (tab === 'weekdays') {
      dispatch(setActiveTab('weekdays'));
    } else if (tab === 'info') {
      dispatch(setActiveTab('info'));
    }
  }, [tab, dispatch]);

  // Intercept Next.js client-side route navigation when dirty (TR-02)
  useEffect(() => {
    const handleRouteChangeStart = (url: string) => {
      // If navigating to the exact same tab, do not intercept
      if (url.includes(`/setting/school/edit?tab=${activeTab}`)) {
        return;
      }

      if (isDirty) {
        router.events.emit('routeChangeError');
        dispatch(openUnsavedLeaveModal(url));
        throw 'Route change aborted by unsaved changes guard';
      }
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
    };
  }, [isDirty, activeTab, router, dispatch]);

  const handleTabClick = (targetTab: 'info' | 'weekdays') => {
    if (targetTab === activeTab) return;

    if (isDirty) {
      dispatch(openUnsavedLeaveModal(`/${sCode}/setting/school/edit?tab=${targetTab}`));
    } else {
      dispatch(setActiveTab(targetTab));
      router.push(`/${sCode}/setting/school/edit?tab=${targetTab}`, undefined, { shallow: true });
    }
  };

  const handleBackToOverview = () => {
    if (isDirty) {
      dispatch(openUnsavedLeaveModal(`/${sCode}/setting/school`));
    } else {
      router.push(`/${sCode}/setting/school`);
    }
  };

  const handleConfirmDiscard = () => {
    const targetUrl = pendingNavigationUrl || `/${sCode}/setting/school`;
    dispatch(discardChanges());

    if (targetUrl.includes('?tab=')) {
      const match = targetUrl.match(/tab=(info|weekdays)/);
      if (match) {
        dispatch(setActiveTab(match[1] as 'info' | 'weekdays'));
      }
    }
    router.push(targetUrl);
  };

  const handleCancelModal = () => {
    dispatch(closeUnsavedLeaveModal());
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div
          className={`p-4 rounded-xl border text-sm font-medium flex items-center justify-between shadow-sm animate-fade-in ${
            toastType === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-blue-50 text-blue-800 border-blue-200'
          }`}
        >
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div>
          <nav className="flex items-center gap-2 text-xs text-gray-500 mb-2">
            <span>Cấu hình</span>
            <span>/</span>
            <Link
              href={`/${sCode}/setting/school`}
              onClick={(e) => {
                if (isDirty) {
                  e.preventDefault();
                  handleBackToOverview();
                }
              }}
              className="hover:underline"
            >
              Trường
            </Link>
            <span>/</span>
            <span className="text-gray-800 font-medium">Chỉnh sửa</span>
          </nav>
          <div className="flex items-center gap-3">
            <button
              onClick={handleBackToOverview}
              className="w-9 h-9 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 flex items-center justify-center transition-colors"
              title="Quay lại tổng quan"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="text-sm" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                Chỉnh sửa thông tin trường
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Cập nhật thông tin nhận diện, thời gian mở/đóng cửa và quy định điểm danh
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Two-Tab Navigation Bar (K070) */}
      <div className="flex items-center border-b border-gray-200 bg-white px-6 rounded-t-xl">
        <button
          onClick={() => handleTabClick('info')}
          className={`py-3.5 px-4 text-sm font-bold border-b-2 flex items-center gap-2 transition-all ${
            activeTab === 'info'
              ? 'border-eco-blue text-eco-blue'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <FontAwesomeIcon icon={faSchool} />
          Thông tin trường
          {isDirtyInfo && <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
        </button>

        <button
          onClick={() => handleTabClick('weekdays')}
          className={`py-3.5 px-4 text-sm font-bold border-b-2 flex items-center gap-2 transition-all ${
            activeTab === 'weekdays'
              ? 'border-eco-blue text-eco-blue'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <FontAwesomeIcon icon={faClock} />
          Giờ hoạt động
          {(isDirtyHours || isDirtyRules || isDirtyCamera) && (
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          )}
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'info' ? (
        <SchoolInfoForm onCancelRequest={handleBackToOverview} />
      ) : (
        <div className="space-y-6">
          <OperatingHoursForm onCancelRequest={handleBackToOverview} />
          <AttendanceRulesForm onCancelRequest={handleBackToOverview} />
          <CameraAttendanceForm onCancelRequest={handleBackToOverview} />
        </div>
      )}

      {/* Navigation Interception Guard Modal (TR-02) */}
      <UnsavedChangesModal
        isOpen={isModalOpen}
        onCancel={handleCancelModal}
        onConfirm={handleConfirmDiscard}
      />
    </div>
  );
};
