/**
 * Fee Catalog Table Component
 * Master table listing system fees and custom fee items with inline electronic invoice toggles,
 * quick assignment inspection, search, filters, and custom-only tally arithmetic.
 * Governance: Marcus Fleet V34 / Constitution V1.0.0
 * Standardized with [DS] ECO ME DASHBOARD
 */

import React, { useState, useRef, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import { addToast } from '../../../store/slices/toastSlice';
import {
  setFilterCriteria,
  toggleExportElectronicInvoiceInline,
  openCreateModal,
  openEditModal,
  openAssignmentModal,
  openDeleteModal,
} from '../../../store/slices/schoolFeeSlice';
import {
  formatFeeAmount,
  formatFeeUnit,
  isSystemFee,
  filterFeeItems,
  calculateCustomFeeCount,
  FEE_UNIT_OPTIONS,
} from '../../../utils/schoolFeeValidation';
import { FeeItem } from '../../../types/schoolFee';
import {
  StatCard,
  FilterBar,
  DataTable,
  DataTableColumn,
  Tag,
  StatusTag,
  EmptyValue,
  Button,
  PopupModal,
  DropdownMenuItem,
  Icon,
} from '../../../components/ds';

interface InvoiceToggleCellProps {
  item: FeeItem;
  onRequestToggle: (item: FeeItem, newValue: boolean) => void;
}

const InvoiceToggleCell: React.FC<InvoiceToggleCellProps> = ({ item, onRequestToggle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isYes = item.exportElectronicInvoice;

  useEffect(() => {
    if (!isOpen) return;
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [isOpen]);

  const handleSelectOption = (newValue: boolean) => {
    setIsOpen(false);
    if (newValue !== isYes) {
      onRequestToggle(item, newValue);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative inline-block text-left ${isOpen ? 'z-[950] is-open' : 'z-auto'}`}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer select-none ${
          isYes
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300'
            : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200 hover:border-slate-300'
        }`}
        title="Bấm để chọn trạng thái Xuất HĐĐT"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <Icon
          name={isYes ? 'circle-check' : 'circle-minus'}
          size={12}
          className={isYes ? 'text-emerald-600' : 'text-slate-400'}
        />
        <span>{isYes ? 'Có' : 'Không'}</span>
        <Icon
          name="chevron-down"
          size={10}
          className={`transition-transform duration-150 ${
            isYes ? 'text-emerald-500' : 'text-slate-400'
          } ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          className="absolute z-[1000] left-0 mt-1.5 w-32 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden py-1"
        >
          <button
            type="button"
            role="option"
            aria-selected={isYes}
            onClick={() => handleSelectOption(true)}
            className={`w-full px-3 py-2 text-xs flex items-center justify-between text-left transition-colors cursor-pointer border-0 ${
              isYes ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2">
              <Icon name="circle-check" size={13} className={isYes ? 'text-emerald-600' : 'text-slate-400'} />
              <span>Có</span>
            </div>
            {isYes && <Icon name="check" size={12} className="text-emerald-600" />}
          </button>

          <button
            type="button"
            role="option"
            aria-selected={!isYes}
            onClick={() => handleSelectOption(false)}
            className={`w-full px-3 py-2 text-xs flex items-center justify-between text-left transition-colors cursor-pointer border-0 ${
              !isYes ? 'bg-slate-100 text-slate-800 font-semibold' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2">
              <Icon name="circle-minus" size={13} className={!isYes ? 'text-slate-600' : 'text-slate-400'} />
              <span>Không</span>
            </div>
            {!isYes && <Icon name="check" size={12} className="text-slate-600" />}
          </button>
        </div>
      )}
    </div>
  );
};

export const FeeCatalogTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, filterCriteria } = useAppSelector((state) => state.schoolFee);
  const revenueCategories = useAppSelector((state) => state.revenueCategory?.list || []);

  const [pendingInvoiceToggle, setPendingInvoiceToggle] = useState<{
    feeId: string;
    feeName: string;
    currentValue: boolean;
    newValue: boolean;
  } | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 20;

  // Filtered items based on criteria
  const filteredItems = filterFeeItems(items, filterCriteria);

  // BR07 & BR08: Footer total strictly counts matching custom fee items
  const customFeeCount = calculateCustomFeeCount(filteredItems);

  // Pagination logic (20 rows per page per legacy observation)
  const totalPages = Math.ceil(filteredItems.length / pageSize) || 1;
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSearchChange = (val: string) => {
    dispatch(setFilterCriteria({ search: val }));
    setCurrentPage(1);
  };

  const handleInvoiceFilterChange = (val: string) => {
    dispatch(
      setFilterCriteria({
        exportElectronicInvoiceFilter: val as 'all' | 'yes' | 'no',
      })
    );
    setCurrentPage(1);
  };

  const handleRevenueCategoryFilterChange = (val: string) => {
    dispatch(
      setFilterCriteria({
        revenueCategoryFilter: val === 'all' ? 'all' : Number(val),
      })
    );
    setCurrentPage(1);
  };

  const handleUnitFilterChange = (val: string) => {
    dispatch(
      setFilterCriteria({
        unitFilter: val as any,
      })
    );
    setCurrentPage(1);
  };

  const handleRequestInvoiceToggle = (item: FeeItem, newValue: boolean) => {
    if (item.exportElectronicInvoice === newValue) return;
    setPendingInvoiceToggle({
      feeId: item.id,
      feeName: item.name,
      currentValue: item.exportElectronicInvoice,
      newValue,
    });
  };

  const handleConfirmInvoiceToggle = () => {
    if (!pendingInvoiceToggle) return;
    dispatch(
      toggleExportElectronicInvoiceInline({
        feeId: pendingInvoiceToggle.feeId,
        exportInvoice: pendingInvoiceToggle.newValue,
      })
    );
    dispatch(
      addToast({
        type: 'success',
        message: `Cập nhật cấu hình Xuất HĐĐT cho "${pendingInvoiceToggle.feeName}" thành "${pendingInvoiceToggle.newValue ? 'Có' : 'Không'}" thành công!`,
      })
    );
    setPendingInvoiceToggle(null);
  };

  const rowMenu = (item: FeeItem): DropdownMenuItem[] => {
    return [
      {
        label: 'Xem thông tin khoản phí',
        onClick: () => dispatch(openAssignmentModal(item)),
      },
      {
        label: 'Chỉnh sửa khoản phí',
        onClick: () => dispatch(openEditModal(item)),
      },
      { divider: true },
      {
        label: 'Xóa khoản phí',
        tone: 'danger',
        onClick: () => dispatch(openDeleteModal(item)),
      },
    ];
  };

  const columns: DataTableColumn<FeeItem>[] = [
    {
      key: 'index',
      title: 'STT',
      width: 60,
      render: (_r, i) => (
        <span className="body-xs text-[var(--text-subtle)]">
          {(currentPage - 1) * pageSize + i + 1}
        </span>
      ),
    },
    {
      key: 'name',
      title: 'Tên khoản phí',
      render: (item) => {
        const isSystem = isSystemFee(item);
        return (
          <div>
            <div className="flex items-center gap-2">
              <span className="body-sm-bold text-[var(--text-heading)]">{item.name}</span>
              {isSystem && (
                <Tag variant="warning">Hệ thống</Tag>
              )}
            </div>
            {item.description && (
              <p className="body-xs text-[var(--text-subtle)] mt-0.5 line-clamp-1">
                {item.description}
              </p>
            )}
          </div>
        );
      },
    },
    {
      key: 'revenue_category',
      title: 'Danh mục thu',
      render: (item) => {
        const cat = item.revenue_category || (item.revenue_category_id ? revenueCategories.find(c => c.id === item.revenue_category_id) : undefined);
        if (!cat) return <EmptyValue />;
        return (
          <div>
            <div className="body-xs-semibold text-[var(--text-heading)]">{cat.name}</div>
            <Tag variant="code" className="mt-1">{cat.code}</Tag>
          </div>
        );
      },
    },
    {
      key: 'defaultAmount',
      title: 'Số tiền mặc định',
      align: 'right',
      render: (item) => {
        if (isSystemFee(item)) return <EmptyValue />;
        return (
          <span className="body-sm-bold text-[var(--text-heading)] font-tabular">
            {formatFeeAmount(item.defaultAmount)}
          </span>
        );
      },
    },
    {
      key: 'unit',
      title: 'Đơn vị tính',
      render: (item) => {
        if (isSystemFee(item)) return <EmptyValue />;
        return <Tag>{formatFeeUnit(item.unit)}</Tag>;
      },
    },
    {
      key: 'exportElectronicInvoice',
      title: 'Xuất HĐĐT',
      render: (item) => {
        return (
          <InvoiceToggleCell
            item={item}
            onRequestToggle={handleRequestInvoiceToggle}
          />
        );
      },
    },
    {
      key: 'actions',
      title: 'Thao tác',
      align: 'right',
      render: (item) => {
        if (isSystemFee(item)) return <EmptyValue />;
        return (
          <DataTable.RowAction
            label={'Thao tác với khoản phí ' + item.name}
            items={rowMenu(item)}
          />
        );
      },
    },
  ];

  const handleExportExcel = () => {
    dispatch(
      addToast({
        type: 'success',
        message: 'Đang xuất danh sách khoản phí ra file Excel...',
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* 4 StatCards KPI Summary */}
      <StatCard.Group columns={4}>
        <StatCard
          label="Tổng khoản phí"
          value={items.length}
          icon="receipt"
          tone="neutral"
        />
        <StatCard
          label="Khoản phí tùy chỉnh"
          value={calculateCustomFeeCount(items)}
          icon="sliders"
          tone="purple"
        />
        <StatCard
          label="Xuất hóa đơn ĐT"
          value={items.filter((i) => i.exportElectronicInvoice).length}
          icon="file-invoice-dollar"
          tone="info"
        />
        <StatCard
          label="Khoản phí hệ thống"
          value={items.filter(isSystemFee).length}
          icon="shield-halved"
          tone="warning"
        />
      </StatCard.Group>

      {/* FilterBar with Search and Dropdowns */}
      <FilterBar
        search={{
          placeholder: 'Tìm kiếm theo tên khoản phí...',
          value: filterCriteria.search,
          onChange: handleSearchChange,
        }}
        filters={[
          {
            options: [
              { value: 'all', label: 'Tất cả danh mục' },
              ...revenueCategories.map((cat) => ({
                value: String(cat.id),
                label: `[${cat.code}] ${cat.name}`,
              })),
            ],
            value: filterCriteria.revenueCategoryFilter !== undefined ? String(filterCriteria.revenueCategoryFilter) : 'all',
            onChange: handleRevenueCategoryFilterChange,
          },
          {
            options: [
              { value: 'all', label: 'Tất cả HĐĐT' },
              { value: 'yes', label: 'Có xuất HĐĐT' },
              { value: 'no', label: 'Không xuất' },
            ],
            value: filterCriteria.exportElectronicInvoiceFilter,
            onChange: handleInvoiceFilterChange,
          },
          {
            options: [
              { value: 'all', label: 'Tất cả đơn vị' },
              ...FEE_UNIT_OPTIONS.map((opt) => ({
                value: opt.value,
                label: opt.label,
              })),
            ],
            value: filterCriteria.unitFilter || 'all',
            onChange: handleUnitFilterChange,
          },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              icon="download"
              onClick={handleExportExcel}
              disabled={filteredItems.length === 0}
            >
              Xuất Excel
            </Button>
            <Button
              variant="primary"
              icon="plus"
              onClick={() => dispatch(openCreateModal())}
            >
              Thêm khoản phí
            </Button>
          </div>
        }
      />

      {/* Main Fee DataTable */}
      <DataTable
        columns={columns}
        rows={paginatedItems}
        rowKey="id"
        emptyText="Không tìm thấy khoản phí nào phù hợp với bộ lọc hiện tại"
        emptyIcon="magnifying-glass"
        footer={
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <span className="body-xs-semibold text-[var(--text-heading)]">
                Tổng: {customFeeCount}
              </span>
              <span className="body-xs text-[var(--text-subtle)] ml-1">
                (chỉ tính khoản phí tùy chỉnh, hiển thị {paginatedItems.length}/{filteredItems.length} dòng)
              </span>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <Button
                  variant="secondary"
                  icon="chevron-left"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                />
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'primary' : 'secondary'}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant="secondary"
                  icon="chevron-right"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                />
              </div>
            )}
          </div>
        }
      />

      {/* Confirmation Modal for Xuất HĐĐT Toggle */}
      {pendingInvoiceToggle && (
        <PopupModal
          open={true}
          icon="file-invoice-dollar"
          title="Xác nhận thay đổi cấu hình Xuất HĐĐT"
          description="Cấu hình này sẽ áp dụng khi tạo và xuất hóa đơn học phí cho học sinh toàn trường."
          onClose={() => setPendingInvoiceToggle(null)}
          primaryAction={{
            label: 'Xác nhận thay đổi',
            icon: 'check',
            onClick: handleConfirmInvoiceToggle,
          }}
          secondaryAction={{
            label: 'Hủy bỏ',
            onClick: () => setPendingInvoiceToggle(null),
          }}
        >
          <div className="space-y-3">
            <p className="body-sm text-[var(--text-body)]">
              Bạn có chắc chắn muốn thay đổi trạng thái Xuất hóa đơn điện tử của khoản phí{' '}
              <strong className="body-sm-bold text-[var(--text-heading)]">
                "{pendingInvoiceToggle.feeName}"
              </strong>{' '}
              sang{' '}
              <StatusTag tone={pendingInvoiceToggle.newValue ? 'success' : 'neutral'} icon={true}>
                {pendingInvoiceToggle.newValue ? 'Có' : 'Không'}
              </StatusTag>?
            </p>
            <div className="p-3 bg-[var(--semantic-warning-soft)] border border-[var(--border-warning-soft)] rounded-lg body-xs text-[var(--semantic-warning-strong)]">
              <strong>Lưu ý:</strong> Thay đổi này sẽ ảnh hưởng trực tiếp đến việc kết nối HĐĐT sInvoice và hóa đơn từng đợt thu.
            </div>
          </div>
        </PopupModal>
      )}
    </div>
  );
};
