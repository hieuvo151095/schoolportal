/**
 * School Weekly Nutrition Menu (Thực Đơn) Page
 * Design System: [DS] ECO ME DASHBOARD v1.1.0 (PageHeader, FilterBar, DataTable)
 */

import React, { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { PortalLayout } from '../../../../components/layout/PortalLayout';
import { useAppDispatch, useAppSelector } from '../../../../store';
import {
  setFilters,
  resetFilters,
  publishMenu,
  cloneMenu,
  deleteMenu,
} from '../../../../store/slices/menuSlice';
import { MenuToolbar } from '../../../../modules/school/menu/MenuToolbar';
import { MenuTable } from '../../../../modules/school/menu/MenuTable';
import { CreateMenuSlideOver } from '../../../../modules/school/menu/CreateMenuSlideOver';
import { PageHeader } from '../../../../components/ds';

export default function SchoolMenuPage() {
  const router = useRouter();
  const schoolCode = (router.query.schoolCode as string) || 'demo';
  const dispatch = useAppDispatch();
  const { menus, filters } = useAppSelector((state) => state.menu);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createMode, setCreateMode] = useState<'grid' | 'file'>('grid');
  const [createTemplate, setCreateTemplate] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (router.query.create === 'true') {
      setIsCreateOpen(true);
      if (router.query.mode === 'file') setCreateMode('file');
      if (router.query.template === 'ai') setCreateTemplate('ai');
    }
  }, [router.query]);

  // Filtered menus
  const filteredMenus = useMemo(() => {
    return menus.filter((menu) => {
      // 1. Search Query
      if (filters.searchQuery && filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matchTitle = menu.title.toLowerCase().includes(q);
        const matchClass = menu.className ? menu.className.toLowerCase().includes(q) : false;
        let matchDish = false;
        if (menu.schedule) {
          for (const day of Object.values(menu.schedule)) {
            for (const meal of ['breakfast', 'lunch', 'snack'] as const) {
              if (meal in day) {
                const dishList = day[meal] || [];
                if (dishList.some((d) => d.name.toLowerCase().includes(q))) {
                  matchDish = true;
                  break;
                }
              }
            }
            if (matchDish) break;
          }
        }
        if (!matchTitle && !matchClass && !matchDish) return false;
      }

      // 2. Class scope
      if (filters.classId === 'toan_truong') {
        if (menu.scope !== 'all') return false;
      } else if (filters.classId !== 'all') {
        if (menu.classId !== filters.classId) return false;
      }

      // 3. File toggle
      if (filters.useFileOnly === 'file_only' && menu.contentType !== 'file') return false;
      if (filters.useFileOnly === 'grid_only' && menu.contentType !== 'grid') return false;

      // 4. Status
      if (filters.status !== 'all' && menu.status !== filters.status) return false;

      // 5. Month
      if (filters.selectedMonth) {
        if (!menu.startDate.startsWith(filters.selectedMonth)) return false;
      }

      return true;
    });
  }, [menus, filters]);

  return (
    <PortalLayout schoolCode={schoolCode}>
      <Head>
        <title>Quản lý Thực đơn | Cổng Vận Hành Trường Học</title>
      </Head>

      <div className="space-y-6">
        {/* Page Header */}
        <PageHeader
          title="Thực Đơn Hàng Tuần"
          description="Soạn và công bố thực đơn ăn uống nội trú toàn trường và từng lớp học kèm truy xuất nguồn gốc Suất ăn minh bạch"
        />

        {/* Unified Table Card */}
        <div className="ecomd-table-card">
          {/* Toolbar & Filter Notices */}
          <MenuToolbar
            filters={filters}
            onFilterChange={(newFilters) => dispatch(setFilters(newFilters))}
            onResetFilters={() => dispatch(resetFilters())}
            schoolCode={schoolCode}
            onOpenCreate={() => {
              setCreateMode('grid');
              setCreateTemplate(undefined);
              setIsCreateOpen(true);
            }}
            onOpenCreateFile={() => {
              setCreateMode('file');
              setCreateTemplate(undefined);
              setIsCreateOpen(true);
            }}
            onApplyAISchedule={() => {
              setCreateMode('grid');
              setCreateTemplate('ai');
              setIsCreateOpen(true);
            }}
          />

          {/* Master Menu Roster Table */}
          <MenuTable
            menus={filteredMenus}
            schoolCode={schoolCode}
            onPublish={(menuId, viaAnnouncement) => {
              dispatch(publishMenu({ id: menuId, viaAnnouncement }));
            }}
            onClone={(sourceId, targetWeek, targetYear, start, end) => {
              dispatch(
                cloneMenu({
                  sourceMenuId: sourceId,
                  targetWeekNumber: targetWeek,
                  targetYear,
                  targetStartDate: start,
                  targetEndDate: end,
                })
              );
            }}
            onDelete={(menuId) => {
              dispatch(deleteMenu(menuId));
            }}
          />
        </div>

        {/* Create Menu SlideOver */}
        <CreateMenuSlideOver
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          initialMode={createMode}
          initialTemplate={createTemplate}
          schoolCode={schoolCode}
        />
      </div>
    </PortalLayout>
  );
}
