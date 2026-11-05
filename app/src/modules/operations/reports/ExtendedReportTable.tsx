import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  openDuplicateModal,
  deleteExtendedReport,
} from '../../../store/slices/reportsSlice';
import { canDeleteReport, filterExtendedReports } from '../../../utils/reportsValidation';
import { ExtendedReport } from '../../../types/reports';
import { Avatar, StatusTag, Icon, IconButton } from '@/components/ds';

export const ExtendedReportTable: React.FC = () => {
  const router = useRouter();
  const schoolCode = (router.query.schoolCode as string) || 'demo';
  const dispatch = useAppDispatch();

  const reports = useAppSelector((state) => state.reports.extendedReports);
  const filters = useAppSelector((state) => state.reports.reportFilters);

  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  // Close dropdown menu on document click
  useEffect(() => {
    const handleDocumentClick = () => {
      setOpenDropdownId(null);
    };
    document.addEventListener('click', handleDocumentClick);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);

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
              <th className="body-xs-semibold">Học sinh</th>
              <th className="body-xs-semibold">Mẫu báo cáo</th>
              <th className="body-xs-semibold">Kỳ / Giai đoạn đánh giá</th>
              <th className="body-xs-semibold" style={{ textAlign: 'center' }}>Trạng thái</th>
              <th className="body-xs-semibold">Người tạo / Cập nhật</th>
              <th className="body-xs-semibold" style={{ textAlign: 'right' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.map((report, index) => {
              const isDraft = report.status === 'draft';
              const isNearBottom = index >= filteredReports.length - 2 && filteredReports.length > 2;
              const isMenuOpen = openDropdownId === report.id;

              return (
                <tr key={report.id}>
                  {/* Student Cell */}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-10)' }}>
                      <Avatar
                        src={report.studentAvatar}
                        name={report.studentName}
                        size="md"
                      />
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <Link
                          href={`/${schoolCode}/reports/extended/${report.id}`}
                          className="body-sm-bold"
                          style={{
                            color: 'var(--text-heading)',
                            textDecoration: 'none',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--eco-blue-strong)')}
                          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-heading)')}
                        >
                          {report.studentName}
                        </Link>
                        <span className="body-xs" style={{ color: 'var(--text-subtle)' }}>
                          {report.studentAge} • {report.className}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Template Name */}
                  <td>
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
                  </td>

                  {/* Stage / Date */}
                  <td>
                    <span className="body-xs-semibold" style={{ color: 'var(--text-heading)' }}>
                      {report.stageName || `${report.startDate} ~ ${report.endDate}`}
                    </span>
                  </td>

                  {/* Status */}
                  <td style={{ textAlign: 'center' }}>
                    {renderStatusBadge(report.status)}
                  </td>

                  {/* Created By / Updated At */}
                  <td>
                    <div className="body-xs-semibold" style={{ color: 'var(--text-heading)' }}>
                      {report.createdBy}
                    </div>
                    <div className="body-xs" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      {report.updatedAt?.split('T')[0]}
                    </div>
                  </td>

                  {/* Action Menu */}
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                      <IconButton
                        icon="ellipsis"
                        label="Tùy chọn thao tác"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenDropdownId(openDropdownId === report.id ? null : report.id);
                        }}
                      />

                      {isMenuOpen && (
                        <div
                          style={{
                            position: 'absolute',
                            right: 0,
                            top: isNearBottom ? undefined : '100%',
                            bottom: isNearBottom ? '100%' : undefined,
                            marginTop: isNearBottom ? undefined : '4px',
                            marginBottom: isNearBottom ? '4px' : undefined,
                            width: '180px',
                            background: 'var(--bg-surface)',
                            border: '1px solid var(--border-default)',
                            borderRadius: 'var(--radius-8)',
                            boxShadow: 'var(--shadow-lg)',
                            padding: '4px',
                            zIndex: 60,
                            textAlign: 'left',
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Link
                            href={`/${schoolCode}/reports/extended/${report.id}`}
                            style={{
                              display: 'block',
                              padding: '8px 12px',
                              fontSize: '12px',
                              fontWeight: 500,
                              color: 'var(--text-heading)',
                              textDecoration: 'none',
                              borderRadius: 'var(--radius-4)',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-subtle)')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                          >
                            Xem / Đánh giá
                          </Link>

                          <button
                            type="button"
                            onClick={() => {
                              setOpenDropdownId(null);
                              handleDuplicate(report);
                            }}
                            style={{
                              width: '100%',
                              display: 'block',
                              padding: '8px 12px',
                              fontSize: '12px',
                              fontWeight: 500,
                              color: 'var(--text-heading)',
                              background: 'transparent',
                              border: 0,
                              borderRadius: 'var(--radius-4)',
                              cursor: 'pointer',
                              textAlign: 'left',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-subtle)')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                          >
                            Nhân bản
                          </button>

                          <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '4px 0' }} />

                          <button
                            type="button"
                            disabled={!isDraft}
                            onClick={() => {
                              if (isDraft) {
                                setOpenDropdownId(null);
                                handleDelete(report);
                              }
                            }}
                            style={{
                              width: '100%',
                              display: 'block',
                              padding: '8px 12px',
                              fontSize: '12px',
                              fontWeight: 500,
                              color: isDraft ? 'var(--semantic-danger-strong)' : 'var(--text-disabled)',
                              background: 'transparent',
                              border: 0,
                              borderRadius: 'var(--radius-4)',
                              cursor: isDraft ? 'pointer' : 'not-allowed',
                              textAlign: 'left',
                            }}
                            onMouseEnter={(e) => {
                              if (isDraft) e.currentTarget.style.background = 'var(--semantic-danger-soft)';
                            }}
                            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                          >
                            Xóa bản nháp
                          </button>
                        </div>
                      )}
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
