import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  deleteSchedule,
  sendScheduleNotification,
} from '../../../store/slices/scheduleSlice';
import { filterTimetables } from '../../../utils/scheduleValidation';
import { Timetable } from '../../../types/schedule';
import {
  Tag,
  StatusTag,
  IconButton,
  DropdownMenu,
  Icon,
  Button,
  PopupModal,
  EmptyState,
} from '@/components/ds';

interface ScheduleTableProps {
  schoolCode: string;
}

export const ScheduleTable: React.FC<ScheduleTableProps> = ({ schoolCode }) => {
  const dispatch = useAppDispatch();
  const { timetables, filterCriteria } = useAppSelector((state) => state.schedule);

  // Pagination: maximum 10 schedules per page
  const PAGE_SIZE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  // Confirmation Modals
  const [sendConfirmSchedule, setSendConfirmSchedule] = useState<Timetable | null>(null);
  const [deleteConfirmSchedule, setDeleteConfirmSchedule] = useState<Timetable | null>(null);

  const filteredTimetables = filterTimetables(timetables, filterCriteria);
  const totalCount = filteredTimetables.length;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE) || 1;

  // Reset page to 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filterCriteria]);

  // Adjust current page if total pages shrinks
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const paginatedTimetables = filteredTimetables.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleConfirmSend = () => {
    if (!sendConfirmSchedule) return;
    dispatch(
      sendScheduleNotification({
        scheduleId: sendConfirmSchedule.id,
        senderName: 'Cô Lan Hương (GVCN)',
        senderRole: 'Giáo viên chủ nhiệm',
        channel: 'all',
        recipientsCount: 32,
        note: `Phát hành thông báo thời khóa biểu lớp ${sendConfirmSchedule.className}`,
      })
    );
    setSendConfirmSchedule(null);
  };

  const handleConfirmDelete = () => {
    if (!deleteConfirmSchedule) return;
    dispatch(deleteSchedule(deleteConfirmSchedule.id));
    setDeleteConfirmSchedule(null);
  };

  const handleDownload = (item: Timetable) => {
    if (item.type === 'file' && item.fileUrl) {
      window.open(item.fileUrl, '_blank');
    } else {
      const dataStr =
        'data:text/json;charset=utf-8,' +
        encodeURIComponent(JSON.stringify(item, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute(
        'download',
        `${item.title.replace(/\s+/g, '_')}.json`
      );
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    }
  };

  return (
    <>
      <div className="ecomd-table-scroll w-full">
        {filteredTimetables.length === 0 ? (
          <EmptyState
            icon="calendar-days"
            title="Không tìm thấy thời khóa biểu phù hợp"
            description="Vui lòng thay đổi từ khóa tìm kiếm hoặc đặt lại bộ lọc."
          />
        ) : (
          <table className="ecomd-table ecomd-table--dense w-full">
            <thead>
              <tr>
                <th style={{ width: '90px' }} className="body-xs-semibold">Mã TKB</th>
                <th style={{ minWidth: '220px' }} className="is-primary body-xs-semibold">Thời khóa biểu</th>
                <th style={{ width: '110px' }} className="body-xs-semibold">Lớp</th>
                <th style={{ width: '130px' }} className="body-xs-semibold">Học kỳ</th>
                <th style={{ width: '120px' }} className="body-xs-semibold">Định dạng</th>
                <th style={{ width: '130px' }} className="body-xs-semibold">Trạng thái</th>
                <th style={{ width: '110px' }} className="body-xs-semibold">Ngày cập nhật</th>
                <th style={{ width: '70px', textAlign: 'right' }} className="is-actions body-xs-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTimetables.map((item) => {
                const statusTone =
                  item.status === 'published'
                    ? 'success'
                    : item.status === 'updated'
                    ? 'warning'
                    : 'neutral';

                const statusLabel =
                  item.status === 'published'
                    ? 'Đã phát hành'
                    : item.status === 'updated'
                    ? 'Cập nhật'
                    : 'Bản nháp';

                return (
                  <tr key={item.id}>
                    <td>
                      <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">Mã TKB</span>
                      <div className="ecomd-cell__value">
                        <span className="body-xs font-mono" style={{ color: 'var(--text-subtle)' }}>
                          {item.id}
                        </span>
                      </div>
                    </td>
                    <td className="is-primary">
                      <div className="ecomd-cell__value">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-12)' }}>
                          <span
                            aria-hidden="true"
                            style={{
                              display: 'flex',
                              flex: 'none',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '36px',
                              height: '36px',
                              borderRadius: 'var(--radius-8)',
                              background: 'var(--bg-muted)',
                              color: 'var(--text-nav)',
                            }}
                          >
                            <Icon
                              name={item.type === 'grid' ? 'table-cells' : 'file-pdf'}
                              size={15}
                            />
                          </span>
                          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                            <Link
                              href={`/${schoolCode}/school/schedule/${item.id}/`}
                              className="body-sm-bold hover:underline"
                              style={{ color: 'var(--text-heading)', textDecoration: 'none' }}
                            >
                              {item.title}
                            </Link>
                            <span className="body-xs font-mono" style={{ color: 'var(--text-subtle)' }}>
                              {item.id}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">Lớp</span>
                      <div className="ecomd-cell__value">
                        <Tag variant="default">{item.className}</Tag>
                      </div>
                    </td>
                    <td>
                      <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">Học kỳ</span>
                      <div className="ecomd-cell__value">
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span className="body-sm" style={{ color: 'var(--text-body)', whiteSpace: 'nowrap' }}>
                            {item.semesterName}
                          </span>
                          <span className="body-xs font-mono" style={{ color: 'var(--text-subtle)' }}>
                            {item.academicYear}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">Định dạng</span>
                      <div className="ecomd-cell__value">
                        <span className="body-sm" style={{ color: 'var(--text-body)', whiteSpace: 'nowrap' }}>
                          {item.type === 'grid' ? 'Dạng lưới' : 'Tệp đính kèm'}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">Trạng thái</span>
                      <div className="ecomd-cell__value">
                        <StatusTag tone={statusTone} label={statusLabel} icon={true} />
                      </div>
                    </td>
                    <td>
                      <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">Cập nhật</span>
                      <div className="ecomd-cell__value">
                        <span className="body-sm font-numeric" style={{ color: 'var(--text-subtle)' }}>
                          {new Date(item.updatedAt).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                    </td>
                    <td className="is-actions" style={{ textAlign: 'right' }}>
                      <div className="ecomd-cell__value">
                        <DropdownMenu
                          trigger={
                            <IconButton
                              icon="ellipsis-vertical"
                              label="Thao tác"
                              size="sm"
                            />
                          }
                          items={[
                            {
                              label: 'Xem chi tiết',
                              href: `/${schoolCode}/school/schedule/${item.id}/`,
                            },
                            {
                              label: 'Chỉnh sửa',
                              href: `/${schoolCode}/school/schedule/edit/${item.id}/`,
                            },
                            {
                              label: 'Gửi phụ huynh',
                              onClick: () => setSendConfirmSchedule(item),
                            },
                            {
                              label: 'Tải xuống',
                              onClick: () => handleDownload(item),
                            },
                            { divider: true },
                            {
                              label: 'Xóa thời khóa biểu',
                              tone: 'danger',
                              onClick: () => setDeleteConfirmSchedule(item),
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
        )}
      </div>

      {/* Pagination Controls - Maximum 10 schedules per page */}
      {totalCount > 0 && (
        <div
          className="flex items-center justify-between flex-wrap gap-3 px-5 py-3 border-t border-[var(--border-subtle)] text-xs text-[var(--text-subtle)]"
          style={{ background: 'var(--bg-subtle)' }}
        >
          <div>
            Hiển thị <b>{(currentPage - 1) * PAGE_SIZE + 1}</b> -{' '}
            <b>{Math.min(currentPage * PAGE_SIZE, totalCount)}</b> trên tổng số{' '}
            <b>{totalCount}</b> thời khóa biểu
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant="secondary"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              ‹ Trang trước
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}

            <Button
              variant="secondary"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              Trang sau ›
            </Button>
          </div>
        </div>
      )}

      {/* Send to Parents Confirmation Modal */}
      {sendConfirmSchedule && (
        <PopupModal
          title="Xác nhận gửi thời khóa biểu"
          description={`Phát hành thông báo thời khóa biểu ${sendConfirmSchedule.title} của lớp ${sendConfirmSchedule.className} đến phụ huynh.`}
          icon="paper-plane"
          onClose={() => setSendConfirmSchedule(null)}
          primaryAction={{
            label: 'Xác nhận gửi',
            onClick: handleConfirmSend,
          }}
          secondaryAction={{
            label: 'Hủy bỏ',
            onClick: () => setSendConfirmSchedule(null),
          }}
        >
          <div className="text-sm text-[var(--text-body)]">
            Thông báo sẽ được chuyển đến tất cả phụ huynh qua ứng dụng và tin nhắn Zalo.
          </div>
        </PopupModal>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmSchedule && (
        <PopupModal
          title="Xác nhận xóa thời khóa biểu"
          description={`Bạn có chắc chắn muốn xóa thời khóa biểu ${deleteConfirmSchedule.title} (Mã: ${deleteConfirmSchedule.id}) không?`}
          icon="trash"
          onClose={() => setDeleteConfirmSchedule(null)}
          primaryAction={{
            label: 'Xác nhận xóa',
            onClick: handleConfirmDelete,
          }}
          secondaryAction={{
            label: 'Hủy bỏ',
            onClick: () => setDeleteConfirmSchedule(null),
          }}
        >
          <div className="text-sm text-[var(--text-danger)] font-medium">
            Thao tác này không thể hoàn tác sau khi thực hiện.
          </div>
        </PopupModal>
      )}
    </>
  );
};

export default ScheduleTable;
