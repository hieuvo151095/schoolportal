/**
 * School Staff Attendance (Điểm Danh Nhân Viên) Page
 * Design System: [DS] ECO ME DASHBOARD v1.1.0 (PageHeader, FilterBar, StatCard, DataTable)
 */

import React, { useEffect, useMemo } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import PortalLayout from '../../../../components/layout/PortalLayout';
import { useAppDispatch, useAppSelector } from '../../../../store';
import {
  setFilterDate,
  setFilterClass,
  setFilterRole,
  setSearchQuery,
  toggleSortDirection,
  checkInStaff,
  checkOutStaff,
  updateTimeBadge,
  openAbsenceModal,
  closeAbsenceModal,
  recordStaffAbsence,
  cancelStaffAbsence,
  updateStaffNote,
  openStaffProfileModal,
  closeStaffProfileModal,
  setToastMessage,
  clearToastMessage,
} from '../../../../store/slices/staffAttendanceSlice';
import {
  filterStaffRoster,
  sortStaffByNickname,
  computeStaffKPIs,
} from '../../../../utils/staffAttendanceValidation';
import { StaffAttendanceToolbar } from '../../../../modules/school/staff-attendance/StaffAttendanceToolbar';
import { StaffAttendanceSummaryCards } from '../../../../modules/school/staff-attendance/StaffAttendanceSummaryCards';
import { StaffAttendanceTable } from '../../../../modules/school/staff-attendance/StaffAttendanceTable';
import { StaffAbsenceModal } from '../../../../modules/school/staff-attendance/StaffAbsenceModal';
import { StaffProfileModal } from '../../../../modules/school/staff-attendance/StaffProfileModal';
import { StaffRole, AbsenceType } from '../../../../types/staffAttendance';
import { PageHeader, Icon } from '../../../../components/ds';

export default function SchoolStaffAttendancePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const schoolCode = (router.query.schoolCode as string) || 'demo';

  const {
    staffList,
    records,
    filterState,
    activeAbsenceStaffId,
    selectedProfileStaffId,
    toastMessage,
  } = useAppSelector((state) => state.staffAttendance);

  // Sync URL query param `?classId=...` on mount or change (BR09, K047)
  useEffect(() => {
    if (router.isReady && router.query.classId) {
      const qClass = String(router.query.classId);
      if (qClass !== filterState.classId) {
        dispatch(setFilterClass(qClass));
      }
    }
  }, [router.isReady, router.query.classId, dispatch, filterState.classId]);

  // Auto-dismiss toast alert after 4 seconds
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        dispatch(clearToastMessage());
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage, dispatch]);

  const handleClassChange = (classId: string) => {
    dispatch(setFilterClass(classId));
    router.push(
      {
        pathname: `/${schoolCode}/school/staff-attendance`,
        query: classId === 'all' ? {} : { classId },
      },
      undefined,
      { shallow: true }
    );
  };

  // Derive roster items for current date and filters
  const dateRecords = useMemo(() => {
    return records[filterState.date] || {};
  }, [records, filterState.date]);

  const filteredRoster = useMemo(() => {
    return filterStaffRoster(staffList, dateRecords, filterState);
  }, [staffList, dateRecords, filterState]);

  const sortedRoster = useMemo(() => {
    return sortStaffByNickname(filteredRoster, filterState.sortDirection);
  }, [filteredRoster, filterState.sortDirection]);

  const kpis = useMemo(() => {
    return computeStaffKPIs(sortedRoster);
  }, [sortedRoster]);

  // Active modal targets
  const activeAbsenceStaff = useMemo(() => {
    if (!activeAbsenceStaffId) return null;
    return staffList.find((s) => s.id === activeAbsenceStaffId) || null;
  }, [staffList, activeAbsenceStaffId]);

  const activeAbsenceRecord = useMemo(() => {
    if (!activeAbsenceStaffId) return null;
    return dateRecords[activeAbsenceStaffId] || null;
  }, [dateRecords, activeAbsenceStaffId]);

  const selectedProfileStaff = useMemo(() => {
    if (!selectedProfileStaffId) return null;
    return staffList.find((s) => s.id === selectedProfileStaffId) || null;
  }, [staffList, selectedProfileStaffId]);

  return (
    <PortalLayout>
      <Head>
        <title>Điểm Danh Nhân Viên | School Operating Portal</title>
      </Head>

      <div className="space-y-6">
        {/* Floating Toast Notification */}
        {toastMessage && (
          <div
            data-testid="toast-notification"
            style={{
              position: 'fixed',
              top: '80px',
              right: '24px',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              padding: 'var(--space-3) var(--space-4)',
              background: 'var(--semantic-red)',
              color: '#ffffff',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-semibold)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <Icon name="circle-exclamation" size={16} />
            <span>{toastMessage}</span>
            <button
              type="button"
              onClick={() => dispatch(clearToastMessage())}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'rgba(255,255,255,0.8)',
                cursor: 'pointer',
                marginLeft: 'var(--space-2)',
                display: 'flex',
                alignItems: 'center',
              }}
              aria-label="Đóng thông báo"
            >
              <Icon name="xmark" size={14} />
            </button>
          </div>
        )}

        {/* Page Header */}
        <PageHeader
          title="Điểm Danh Nhân Viên"
          description="Sổ điểm danh hàng ngày của giáo viên, bảo mẫu, nhân viên văn phòng và ban giám hiệu"
        />

        {/* 3 Summary KPI Cards */}
        <StaffAttendanceSummaryCards
          kpis={kpis}
          searchQuery={filterState.searchQuery}
        />

        {/* Filter and Date Controls */}
        <StaffAttendanceToolbar
          date={filterState.date}
          classId={filterState.classId}
          role={filterState.role}
          searchQuery={filterState.searchQuery}
          onDateChange={(d) => dispatch(setFilterDate(d))}
          onClassChange={handleClassChange}
          onRoleChange={(r) => dispatch(setFilterRole(r))}
          onSearchChange={(q) => dispatch(setSearchQuery(q))}
        />

        {/* Master Staff Attendance Roster Table */}
        <StaffAttendanceTable
          roster={sortedRoster}
          date={filterState.date}
          sortDirection={filterState.sortDirection}
          onToggleSort={() => dispatch(toggleSortDirection())}
          onCheckIn={(staffId) =>
            dispatch(checkInStaff({ date: filterState.date, staffId }))
          }
          onCheckOut={(staffId) =>
            dispatch(checkOutStaff({ date: filterState.date, staffId }))
          }
          onUpdateTime={(staffId, type, time) =>
            dispatch(
              updateTimeBadge({
                date: filterState.date,
                staffId,
                type,
                time,
              })
            )
          }
          onOpenAbsenceModal={(staffId) =>
            dispatch(openAbsenceModal(staffId))
          }
          onUpdateNote={(staffId, note) =>
            dispatch(
              updateStaffNote({
                date: filterState.date,
                staffId,
                note,
              })
            )
          }
          onViewProfile={(staffId) =>
            dispatch(openStaffProfileModal(staffId))
          }
        />

        {/* Record/Edit Absence Modal */}
        <StaffAbsenceModal
          isOpen={!!activeAbsenceStaffId}
          staff={activeAbsenceStaff}
          attendance={activeAbsenceRecord}
          date={filterState.date}
          onClose={() => dispatch(closeAbsenceModal())}
          onSave={(payload) => {
            dispatch(recordStaffAbsence(payload));
            dispatch(closeAbsenceModal());
          }}
          onCancelAbsence={(payload) => {
            dispatch(cancelStaffAbsence(payload));
            dispatch(closeAbsenceModal());
          }}
        />

        {/* Read-Only Staff Profile Drawer / Modal */}
        <StaffProfileModal
          isOpen={!!selectedProfileStaffId}
          staff={selectedProfileStaff}
          schoolCode={schoolCode}
          onClose={() => dispatch(closeStaffProfileModal())}
        />
      </div>
    </PortalLayout>
  );
}
