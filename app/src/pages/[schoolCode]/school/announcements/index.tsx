/**
 * School Announcement Board Page
 * Design System: [DS] ECO ME DASHBOARD v1.1.0 (PageHeader, FilterBar, StatCard, DataTable)
 */

import React, { useState, useMemo, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import PortalLayout from '@/components/layout/PortalLayout';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  setSearchQuery,
  setStatusFilter,
  setCategoryFilter,
  setChannelFilter,
  resetFilters,
  togglePinAnnouncement,
  deleteAnnouncement,
  deleteMultipleAnnouncements,
  toggleSelectForBulk,
  selectAllForBulk,
  clearBulkSelection,
  createAnnouncement,
  updateDraftAnnouncement,
  scheduleAnnouncement,
} from '@/store/slices/announcementSlice';
import { addToast } from '@/store/slices/toastSlice';
import {
  filterAnnouncements,
  calculateAnnouncementKPIs
} from '@/utils/announcementValidation';
import { Announcement } from '@/types/announcement';
import { AnnouncementSummaryCards } from '@/modules/school/announcements/AnnouncementSummaryCards';
import { AnnouncementToolbar } from '@/modules/school/announcements/AnnouncementToolbar';
import { AnnouncementTable } from '@/modules/school/announcements/AnnouncementTable';
import DeleteAnnouncementModal from '@/modules/school/announcements/DeleteAnnouncementModal';
import { AnnouncementSlideOver } from '@/modules/school/announcements/AnnouncementSlideOver';
import { PageHeader } from '@/components/ds';

export default function SchoolAnnouncementsPage() {
  const router = useRouter();
  const schoolCode = (router.query.schoolCode as string) || 'demo';
  const dispatch = useAppDispatch();

  const { announcements, filters, selectedIdsForBulk } = useAppSelector(
    state => state.announcement
  );

  // Modal & SlideOver states
  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean;
    announcement?: Announcement;
    isBulk?: boolean;
  }>({
    isOpen: false
  });
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);

  useEffect(() => {
    if (router.query.create === 'true') {
      setEditingAnnouncement(null);
      setIsSlideOverOpen(true);
    } else if (router.query.edit) {
      const target = announcements.find((a) => a.id === router.query.edit);
      if (target) {
        setEditingAnnouncement(target);
        setIsSlideOverOpen(true);
      }
    }
  }, [router.query.create, router.query.edit, announcements]);

  // Calculate 4 summary KPIs
  const kpis = useMemo(() => {
    return calculateAnnouncementKPIs(announcements);
  }, [announcements]);

  // Filtered and sorted announcements
  const filteredList = useMemo(() => {
    return filterAnnouncements(announcements, filters);
  }, [announcements, filters]);

  // Handlers
  const handleFilterChange = (updates: Partial<typeof filters>) => {
    if (updates.searchQuery !== undefined) dispatch(setSearchQuery(updates.searchQuery));
    if (updates.statusFilter !== undefined) dispatch(setStatusFilter(updates.statusFilter));
    if (updates.categoryFilter !== undefined) dispatch(setCategoryFilter(updates.categoryFilter));
    if (updates.channelFilter !== undefined) dispatch(setChannelFilter(updates.channelFilter));
  };

  const handleResetFilters = () => {
    dispatch(resetFilters());
  };

  const handleTogglePin = (id: string) => {
    dispatch(togglePinAnnouncement({ id }));
    const target = announcements.find(a => a.id === id);
    const wasPinned = target?.isPinned;
    dispatch(
      addToast({
        type: 'success',
        message: wasPinned
          ? 'Đã bỏ ghim thông báo khỏi đầu bảng'
          : 'Đã ghim thông báo lên đầu bảng tin'
      })
    );
  };

  const handleOpenSingleDelete = (announcement: Announcement) => {
    setDeleteModalState({
      isOpen: true,
      announcement,
      isBulk: false
    });
  };

  const handleOpenBulkDelete = () => {
    if (selectedIdsForBulk.length === 0) return;
    setDeleteModalState({
      isOpen: true,
      isBulk: true
    });
  };

  const handleConfirmDelete = () => {
    if (deleteModalState.isBulk) {
      const count = selectedIdsForBulk.length;
      dispatch(deleteMultipleAnnouncements({ ids: selectedIdsForBulk }));
      dispatch(clearBulkSelection());
      dispatch(
        addToast({
          type: 'success',
          message: `Đã xóa thành công ${count} thông báo đã chọn`
        })
      );
    } else if (deleteModalState.announcement) {
      dispatch(deleteAnnouncement({ id: deleteModalState.announcement.id }));
      dispatch(
        addToast({
          type: 'success',
          message: 'Đã xóa thông báo thành công'
        })
      );
    }
  };

  const handleSaveAnnouncement = (payload: any, status: 'nhap' | 'da_len_lich' | 'da_gui') => {
    if (editingAnnouncement) {
      dispatch(updateDraftAnnouncement({ id: editingAnnouncement.id, updates: payload }));
      if (status === 'da_len_lich') {
        dispatch(
          scheduleAnnouncement({
            id: editingAnnouncement.id,
            scheduledAt: payload.scheduledAt || new Date().toISOString(),
          })
        );
      }
      dispatch(
        addToast({
          type: 'success',
          message:
            status === 'da_gui'
              ? 'Đã phát hành thông báo thành công!'
              : status === 'da_len_lich'
              ? 'Đã lên lịch phát hành thông báo thành công!'
              : 'Đã cập nhật bản nháp thành công!',
        })
      );
    } else {
      dispatch(createAnnouncement(payload));
      dispatch(
        addToast({
          type: 'success',
          message:
            status === 'da_gui'
              ? 'Đã phát hành thông báo chính thức thành công!'
              : status === 'da_len_lich'
              ? 'Đã lên lịch phát hành thông báo thành công!'
              : 'Đã lưu bản nháp thông báo thành công!',
        })
      );
    }
  };

  return (
    <PortalLayout schoolCode={schoolCode}>
      <Head>
        <title>Bảng Thông Tin | School Operating Portal</title>
      </Head>

      <div className="space-y-6">
        {/* Page Header */}
        <PageHeader
          title="Bảng Thông Tin & Bản Tin Nhà Trường"
          description="Quản lý phát hành thông báo đa kênh, lên lịch gửi và theo dõi tỷ lệ tiếp cận phụ huynh"
        />

        {/* 4 Summary KPI Cards */}
        <AnnouncementSummaryCards kpis={kpis} />

        {/* Filter and Search Toolbar */}
        <AnnouncementToolbar
          schoolCode={schoolCode}
          filters={filters}
          kpis={kpis}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          selectedCount={selectedIdsForBulk.length}
          onBulkDelete={handleOpenBulkDelete}
          onOpenCreate={() => {
            setEditingAnnouncement(null);
            setIsSlideOverOpen(true);
          }}
        />

        {/* 8-Column Data Table */}
        <AnnouncementTable
          schoolCode={schoolCode}
          announcements={filteredList}
          selectedIds={selectedIdsForBulk}
          onToggleSelect={id => dispatch(toggleSelectForBulk(id))}
          onSelectAll={ids => dispatch(selectAllForBulk(ids))}
          onTogglePin={handleTogglePin}
          onOpenDeleteModal={handleOpenSingleDelete}
          onOpenEdit={(announcement) => {
            setEditingAnnouncement(announcement);
            setIsSlideOverOpen(true);
          }}
        />

        {/* Delete Confirmation Modal */}
        <DeleteAnnouncementModal
          isOpen={deleteModalState.isOpen}
          onClose={() => setDeleteModalState({ isOpen: false })}
          onConfirm={handleConfirmDelete}
          announcementTitle={deleteModalState.announcement?.title}
          isBulk={deleteModalState.isBulk}
          bulkCount={selectedIdsForBulk.length}
        />

        {/* Create / Edit SlideOver (Right-Sheet Standard) */}
        <AnnouncementSlideOver
          isOpen={isSlideOverOpen}
          onClose={() => {
            setIsSlideOverOpen(false);
            setEditingAnnouncement(null);
            if (router.query.create || router.query.edit) {
              router.replace(`/${schoolCode}/school/announcements`, undefined, { shallow: true });
            }
          }}
          schoolCode={schoolCode}
          initialAnnouncement={editingAnnouncement}
          isEditMode={!!editingAnnouncement}
          onSave={handleSaveAnnouncement}
        />
      </div>
    </PortalLayout>
  );
}
