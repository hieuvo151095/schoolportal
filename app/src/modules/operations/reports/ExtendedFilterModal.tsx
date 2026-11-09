import React, { useState, useEffect } from 'react';
import { SlideOver, Icon, Dropdown } from '@/components/ds';
import { useAppDispatch, useAppSelector } from '../../../store';
import { setReportFilterCriteria, toggleExtendedFilter } from '../../../store/slices/reportsSlice';
import { DEVELOPMENTAL_TEMPLATES } from '../../../services/mockReportsData';
import { ReportLifecycleStatus, ReportTemplateId } from '../../../types/reports';

export const ExtendedFilterModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.reports.isExtendedFilterOpen);
  const currentFilters = useAppSelector((state) => state.reports.reportFilters);

  const [searchQuery, setSearchQuery] = useState(currentFilters.searchQuery);
  const [templateId, setTemplateId] = useState<'all' | ReportTemplateId>(currentFilters.templateId);
  const [status, setStatus] = useState<'all' | ReportLifecycleStatus>(currentFilters.status);

  useEffect(() => {
    if (isOpen) {
      setSearchQuery(currentFilters.searchQuery);
      setTemplateId(currentFilters.templateId);
      setStatus(currentFilters.status);
    }
  }, [isOpen, currentFilters]);

  if (!isOpen) return null;

  const handleClose = () => {
    dispatch(toggleExtendedFilter(false));
  };

  const handleApply = () => {
    dispatch(
      setReportFilterCriteria({
        searchQuery,
        templateId,
        status,
      })
    );
    handleClose();
  };

  const handleReset = () => {
    dispatch(
      setReportFilterCriteria({
        searchQuery: '',
        classId: 'all',
        templateId: 'all',
        status: 'all',
      })
    );
    setSearchQuery('');
    setTemplateId('all');
    setStatus('all');
    handleClose();
  };

  return (
    <SlideOver
      open={isOpen}
      onClose={handleClose}
      icon="filter"
      title="Bộ Lọc Báo Cáo Nâng Cao"
      description="Lọc báo cáo theo học sinh, mẫu đánh giá và trạng thái gửi phụ huynh"
      width={480}
      extraAction={{
        label: 'Đặt lại',
        onClick: handleReset,
      }}
      secondaryAction={{
        label: 'Hủy',
        onClick: handleClose,
      }}
      primaryAction={{
        label: 'Áp dụng bộ lọc',
        icon: 'check',
        onClick: handleApply,
      }}
    >
      <div className="space-y-4">
        {/* Tên học sinh / Mã học sinh */}
        <div>
          <label className="block text-xs font-semibold text-[var(--text-heading)] mb-1">
            Tên học sinh / Mã học sinh
          </label>
          <input
            type="text"
            placeholder="Nhập tên hoặc mã học sinh..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[var(--radius-8)] text-sm text-[var(--text-heading)] focus:outline-none focus:border-[var(--eco-blue-strong)] focus:ring-2 focus:ring-[var(--eco-blue-100,#dbeafe)] transition-all placeholder:text-[var(--text-disabled)]"
          />
          <p className="text-[11px] text-[var(--text-subtle)] mt-1">
            Tìm kiếm theo ký tự có dấu hoặc không dấu.
          </p>
        </div>

        {/* Mẫu báo cáo */}
        <div>
          <label className="block text-xs font-semibold text-[var(--text-heading)] mb-1">
            Mẫu báo cáo (Template)
          </label>
          <Dropdown
            options={[
              { value: 'all', label: '-- Tất cả mẫu báo cáo --' },
              ...DEVELOPMENTAL_TEMPLATES.map((t) => ({
                value: t.id,
                label: t.name,
                sublabel: t.category,
              })),
            ]}
            value={templateId}
            onChange={(val) => setTemplateId(val as 'all' | ReportTemplateId)}
            searchable
            fullWidth
          />
          <p className="text-[11px] text-[var(--text-subtle)] mt-1">
            Lọc theo tiêu chuẩn hoặc lĩnh vực giáo dục cụ thể.
          </p>
        </div>

        {/* Trạng thái */}
        <div>
          <label className="block text-xs font-semibold text-[var(--text-heading)] mb-1">
            Trạng thái xử lý báo cáo
          </label>
          <Dropdown
            options={[
              { value: 'all', label: '-- Tất cả trạng thái --' },
              { value: 'draft', label: 'Bản nháp (Draft)' },
              { value: 'sent', label: 'Đã gửi cho phụ huynh (Sent)' },
              { value: 'completed', label: 'Đã hoàn tất (Completed)' },
            ]}
            value={status}
            onChange={(val) => setStatus(val as 'all' | ReportLifecycleStatus)}
            fullWidth
          />
          <p className="text-[11px] text-[var(--text-subtle)] mt-1">
            Lọc theo quy trình phê duyệt và phản hồi từ phụ huynh.
          </p>
        </div>
      </div>
    </SlideOver>
  );
};

export default ExtendedFilterModal;
