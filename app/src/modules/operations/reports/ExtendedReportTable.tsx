import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  openDuplicateModal,
  deleteExtendedReport,
} from '../../../store/slices/reportsSlice';
import { canDeleteReport, filterExtendedReports } from '../../../utils/reportsValidation';
import { ExtendedReport } from '../../../types/reports';
import { Avatar, StatusTag, Icon, IconButton, DropdownMenu } from '@/components/ds';

export const ExtendedReportTable: React.FC = () => {
  const router = useRouter();
  const schoolCode = (router.query.schoolCode as string) || 'demo';
  const dispatch = useAppDispatch();

  const reports = useAppSelector((state) => state.reports.extendedReports);
  const filters = useAppSelector((state) => state.reports.reportFilters);

  const filteredReports = filterExtendedReports(reports, filters);

  const handleDelete = (report: ExtendedReport) => {
    if (!canDeleteReport(report.status)) {
      alert('Không thể xóa báo cáo đã gửi hoặc đã hoàn tất!');
      return;
    }
    if (confirm(`Bạn có chắc chắn muốn xóa bản nháp báo cáo của học sinh ${report.studentName}?`)) {
      dispatch(deleteExtendedReport(report.id));
    }
  };

  const handleDuplicate = (report: ExtendedReport) => {
    dispatch(openDuplicateModal(report));
  };

  const renderStatusBadge = (status: 'draft' | 'sent' | 'completed') => {
    switch (status) {
      case 'draft':
        return <StatusTag tone="neutral" label="Bản nháp" icon />;
      case 'sent':
        return <StatusTag tone="info" label="Đã gửi PH" icon />;
      case 'completed':
        return <StatusTag tone="success" label="Hoàn thành" icon />;
    }
  };

  if (filteredReports.length === 0) {
    return (
      <div style={{ padding: 'var(--space-48) var(--space-20)', textAlign: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-8)' }}>
          <Icon name="search" size={32} color="var(--text-muted)" />
          <span className="title-md" style={{ color: 'var(--text-heading)' }}>
            Không tìm thấy báo cáo nào
          </span>
          <span className="body-xs" style={{ color: 'var(--text-subtle)' }}>
            Hãy thử thay đổi điều kiện lọc hoặc tạo báo cáo mở rộng mới.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="ecomd-table-scroll">
        <table className="ecomd-table">
          <thead>
            <tr>
              <th className="body-xs-semibold is-primary">Học sinh</th>
              <th className="body-xs-semibold">Mẫu báo cáo</th>
              <th className="body-xs-semibold">Kỳ / Giai đoạn đánh giá</th>
              <th className="body-xs-semibold hidden md:table-cell" style={{ textAlign: 'center' }}>
                Trạng thái
              </th>
              <th className="body-xs-semibold">Người tạo / Cập nhật</th>
              <th className="body-xs-semibold is-actions" style={{ textAlign: 'right' }}>
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.map((report) => {
              const isDraft = report.status === 'draft';

              return (
                <tr key={report.id}>
                  {/* Student Cell (is-primary): Tên HS nằm cạnh Avatar */}
                  <td className="is-primary">
                    <div className="ecomd-cell__value flex items-center gap-3">
                      <Avatar
                        src={report.studentAvatar}
                        name={report.studentName}
                        size="md"
                        className="shrink-0"
                      />
                      <div className="flex flex-col min-w-0">
                        <Link
                          href={`/${schoolCode}/reports/extended/${report.id}`}
                          className="body-sm-bold hover:underline"
                          style={{
                            color: 'var(--text-heading)',
                            textDecoration: 'none',
                          }}
                        >
                          {report.studentName}
                        </Link>
                        <span className="body-xs text-[var(--text-subtle)]">
                          {report.studentAge} • {report.className}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Template Name */}
                  <td>
                    <div className="flex items-center">
                      <span
                        style={{
                          fontSize: '12px',
                          fontWeight: 600,
                          color: 'var(--text-body)',
                          background: 'var(--bg-muted)',
                          padding: '3px 8px',
                          borderRadius: 'var(--radius-4)',
                          border: '1px solid var(--border-default)',
                        }}
                      >
                        {report.templateName}
                      </span>
                    </div>
                  </td>

                  {/* Stage / Date & Status: Trạng thái nằm cùng hàng với thời gian trên mobile */}
                  <td>
                    <div className="flex items-center justify-between gap-2 w-full">
                      <span className="body-xs-semibold" style={{ color: 'var(--text-heading)' }}>
                        {report.stageName || `${report.startDate} ~ ${report.endDate}`}
                      </span>
                      <span className="inline-flex md:hidden shrink-0">
                        {renderStatusBadge(report.status)}
                      </span>
                    </div>
                  </td>

                  {/* Status on Desktop */}
                  <td className="desktop-only hidden md:table-cell" style={{ textAlign: 'center' }}>
                    <div className="flex justify-center">
                      {renderStatusBadge(report.status)}
                    </div>
                  </td>

                  {/* Created By / Updated At: Thời gian nằm ngay dưới tên cô */}
                  <td>
                    <div className="flex flex-col items-start text-left leading-tight w-full">
                      <span className="body-xs-semibold" style={{ color: 'var(--text-heading)' }}>
                        {report.createdBy}
                      </span>
                      <span
                        className="body-xs font-mono mt-0.5"
                        style={{ color: 'var(--text-subtle)' }}
                      >
                        {report.updatedAt?.split('T')[0]}
                      </span>
                    </div>
                  </td>

                  {/* Action Menu (is-actions): Neo góc phải, Dropdown không bị che */}
                  <td className="is-actions" style={{ textAlign: 'right' }}>
                    <div className="ecomd-cell__value flex justify-end">
                      <DropdownMenu
                        trigger={
                          <IconButton
                            icon="ellipsis"
                            label="Tùy chọn thao tác"
                            size="sm"
                          />
                        }
                        align="right"
                        items={[
                          {
                            label: 'Xem / Đánh giá',
                            href: `/${schoolCode}/reports/extended/${report.id}`,
                          },
                          {
                            label: 'Nhân bản',
                            onClick: () => handleDuplicate(report),
                          },
                          { divider: true },
                          {
                            label: 'Xóa bản nháp',
                            tone: 'danger',
                            disabled: !isDraft,
                            onClick: () => handleDelete(report),
                          },
                        ]}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Card Footer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'var(--space-12) var(--space-20)',
          borderTop: '1px solid var(--border-default)',
          fontSize: '13px',
          color: 'var(--text-subtle)',
          background: 'var(--bg-surface)',
        }}
      >
        <span>
          Hiển thị <strong>{filteredReports.length}</strong> / {reports.length} báo cáo
        </span>
        <span style={{ fontSize: '12px' }}>
          Đồng bộ với sổ theo dõi và hồ sơ học sinh
        </span>
      </div>
    </div>
  );
};

export default ExtendedReportTable;
