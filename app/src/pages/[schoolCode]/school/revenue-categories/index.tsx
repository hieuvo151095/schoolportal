/**
 * Revenue Categories Management Page (Danh mục thu)
 * Route: /[schoolCode]/school/revenue-categories
 * Connected with Central Education Database (CSDL Sở) & Managing Portal
 * Standardized with [DS] ECO ME DASHBOARD
 */

import React, { useState, useMemo } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import PortalLayout from '../../../../components/layout/PortalLayout';
import {
  PageHeader,
  FilterBar,
  DataTable,
  DataTableColumn,
  StatusTag,
  Tag,
  EmptyValue,
  Button,
  CountedTabs,
} from '../../../../components/ds';
import { useAppDispatch, useAppSelector } from '../../../../store';
import {
  setFilter,
  setPage,
  syncStart,
  syncSuccess,
} from '../../../../store/slices/revenueCategorySlice';
import { addToast } from '../../../../store/slices/toastSlice';
import { RevenueCategory } from '../../../../types/revenueCategory';
import { mockRevenueCategories } from '../../../../mock/mockRevenueCategories';

export default function RevenueCategoriesPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { list, filter, pagination, syncing } = useAppSelector(
    (state) => state.revenueCategory
  );

  const [searchLocal, setSearchLocal] = useState<string>(filter.search || '');

  // Filter items
  const filteredList = useMemo(() => {
    return list.filter((item) => {
      // Keyword match
      if (searchLocal && searchLocal.trim()) {
        const keyword = searchLocal.trim().toLowerCase();
        const matchName = item.name.toLowerCase().includes(keyword);
        const matchCode = item.code.toLowerCase().includes(keyword);
        const matchNote = item.note?.toLowerCase().includes(keyword);
        if (!matchName && !matchCode && !matchNote) return false;
      }

      // Status filter
      if (filter.status === 1) {
        if (!item.active) return false;
      } else if (filter.status === 0) {
        if (item.active) return false;
      }

      return true;
    });
  }, [list, searchLocal, filter.status]);

  // Pagination
  const pageSize = pagination.perPage || 20;
  const totalPages = Math.ceil(filteredList.length / pageSize) || 1;
  const paginatedItems = useMemo(() => {
    const start = (pagination.currentPage - 1) * pageSize;
    return filteredList.slice(start, start + pageSize);
  }, [filteredList, pagination.currentPage, pageSize]);

  const handleSearchChange = (val: string) => {
    setSearchLocal(val);
    dispatch(setFilter({ search: val, page: 1 }));
  };

  const handleStatusFilterChange = (val: string) => {
    const statusVal = val === '' ? '' : Number(val);
    dispatch(setFilter({ status: statusVal as 1 | 0 | '', page: 1 }));
  };

  const handleSyncDatabase = () => {
    dispatch(syncStart());
    setTimeout(() => {
      // Simulate successful sync from CSDL Sở
      dispatch(syncSuccess(mockRevenueCategories));
      dispatch(
        addToast({
          type: 'success',
          message: 'Đồng bộ danh mục thu từ CSDL Sở GD&ĐT thành công!',
        })
      );
    }, 1200);
  };

  const handleExportExcel = () => {
    dispatch(
      addToast({
        type: 'success',
        message: 'Đang xuất danh mục thu ra file Excel...',
      })
    );
  };

  const formatPeriod = (effectiveFrom: string, effectiveTo?: string | null) => {
    if (effectiveFrom && effectiveTo) {
      return `${effectiveFrom} - ${effectiveTo}`;
    }
    if (effectiveFrom) {
      return `Từ ${effectiveFrom}`;
    }
    if (effectiveTo) {
      return `Đến ${effectiveTo}`;
    }
    return 'Vô thời hạn';
  };

  const columns: DataTableColumn<RevenueCategory>[] = [
    {
      key: 'index',
      title: 'STT',
      width: 60,
      render: (_r, i) => (
        <span className="body-xs text-[var(--text-subtle)]">
          {(pagination.currentPage - 1) * pageSize + i + 1}
        </span>
      ),
    },
    {
      key: 'name',
      title: 'Tên danh mục thu',
      render: (r) => (
        <div>
          <div className="body-sm-bold text-[var(--text-heading)]">{r.name}</div>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <Tag variant="code">{r.code}</Tag>
            {r.legal_reference && (
              <Tag variant="warning">{r.legal_reference}</Tag>
            )}
          </div>
          {r.note && (
            <p className="body-xs text-[var(--text-subtle)] mt-1 italic">
              • {r.note}
            </p>
          )}
        </div>
      ),
    },
    {
      key: 'active',
      title: 'Trạng thái',
      width: 160,
      render: (r) => (
        <StatusTag tone={r.active ? 'success' : 'neutral'} icon={true}>
          {r.active ? 'Đang áp dụng' : 'Ngừng áp dụng'}
        </StatusTag>
      ),
    },
    {
      key: 'period',
      title: 'Khoảng thời gian',
      width: 200,
      render: (r) => (
        <span className="body-xs text-[var(--text-body)]">
          {formatPeriod(r.effective_from, r.effective_to)}
        </span>
      ),
    },
    {
      key: 'unit',
      title: 'Đơn vị tính',
      width: 120,
      render: (r) => (r.unit ? <Tag>{r.unit}</Tag> : <EmptyValue />),
    },
  ];

  return (
    <PortalLayout>
      <Head>
        <title>Danh Mục Thu — Finviet School Portal</title>
        <meta
          name="description"
          content="Danh mục thu chuẩn hóa theo quy định Sở GD&ĐT, đồng bộ từ CSDL Sở để liên kết với các khoản phí của trường."
        />
      </Head>

      <div className="space-y-6">
        {/* Page Header */}
        <PageHeader
          title="Danh Mục Thu"
          description="Danh mục thu chuẩn hóa từ CSDL Sở Giáo dục & Đào tạo, phục vụ liên kết khoản phí và hóa đơn điện tử."
        />

        {/* Master Table Card Architecture */}
        <div className="ecomd-table-card">
          {/* Top Status Tabs */}
          <CountedTabs
            tabs={[
              { id: '', label: 'Tất cả', count: list.length },
              { id: '1', label: 'Đang áp dụng', count: list.filter((i) => i.active).length },
              { id: '0', label: 'Ngừng áp dụng', count: list.filter((i) => !i.active).length },
            ]}
            activeId={filter.status === '' ? '' : String(filter.status)}
            onChange={(id) => handleStatusFilterChange(id)}
          />

          {/* FilterBar with Search and Action */}
          <FilterBar
            search={{
              placeholder: 'Tìm kiếm danh mục (tên, mã số, ghi chú)...',
              value: searchLocal,
              onChange: handleSearchChange,
            }}
            actions={
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  icon="download"
                  onClick={handleExportExcel}
                  disabled={filteredList.length === 0}
                >
                  Xuất Excel
                </Button>
                <Button
                  variant="primary"
                  icon="rotate-right"
                  disabled={syncing}
                  onClick={handleSyncDatabase}
                >
                  {syncing ? 'Đang đồng bộ...' : 'Đồng bộ CSDL'}
                </Button>
              </div>
            }
          />

          {/* Master Revenue DataTable */}
          <DataTable
            columns={columns}
            rows={paginatedItems}
            rowKey="id"
            emptyText="Chưa có danh mục thu phù hợp"
            emptyIcon="magnifying-glass"
            footer={
              <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="body-xs text-[var(--text-subtle)]">
                  Hiển thị{' '}
                  <b className="body-xs-semibold text-[var(--text-body)]">
                    {filteredList.length === 0
                      ? 0
                      : (pagination.currentPage - 1) * pageSize + 1}
                  </b>{' '}
                  đến{' '}
                  <b className="body-xs-semibold text-[var(--text-body)]">
                    {Math.min(pagination.currentPage * pageSize, filteredList.length)}
                  </b>{' '}
                  trên tổng số{' '}
                  <b className="body-xs-semibold text-[var(--text-body)]">{filteredList.length}</b> danh mục
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center gap-1">
                    <Button
                      variant="secondary"
                      icon="chevron-left"
                      disabled={pagination.currentPage <= 1}
                      onClick={() => dispatch(setPage(Math.max(1, pagination.currentPage - 1)))}
                    />
                    {Array.from({ length: totalPages }).map((_, i) => {
                      const p = i + 1;
                      const isActive = p === pagination.currentPage;
                      return (
                        <Button
                          key={p}
                          variant={isActive ? 'primary' : 'secondary'}
                          onClick={() => dispatch(setPage(p))}
                        >
                          {p}
                        </Button>
                      );
                    })}
                    <Button
                      variant="secondary"
                      icon="chevron-right"
                      disabled={pagination.currentPage >= totalPages}
                      onClick={() => dispatch(setPage(Math.min(totalPages, pagination.currentPage + 1)))}
                    />
                  </div>
                )}
              </div>
            }
          />
        </div>
      </div>
    </PortalLayout>
  );
}
