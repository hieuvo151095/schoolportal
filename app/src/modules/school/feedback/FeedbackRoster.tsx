import React from 'react';
import { useAppSelector } from '@/store';
import { filterFeedbackItems } from '@/utils/feedbackValidation';
import { EmptyState } from '@/components/ds';
import FeedbackRow from './FeedbackRow';

export default function FeedbackRoster() {
  const { items, filters } = useAppSelector((state) => state.feedback);
  const filteredItems = filterFeedbackItems(items, filters);

  return (
    <div className="ecomd-table-card">
      <div className="ecomd-table-scroll">
        <table className="ecomd-table ecomd-table--dense w-full">
          <thead>
            <tr>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ width: '100px' }}>
                Mã góp ý
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)] is-primary" style={{ minWidth: '220px' }}>
                Tiêu đề & Loại
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ minWidth: '140px' }}>
                Học sinh
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ minWidth: '140px' }}>
                Phụ huynh
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ width: '120px' }}>
                Trạng thái
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ width: '110px' }}>
                Chờ phản hồi
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ minWidth: '140px' }}>
                Người xử lý
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ width: '110px' }}>
                Độ ưu tiên
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ width: '130px' }}>
                Ngày gửi
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)] is-right is-actions" style={{ width: '100px', textAlign: 'right' }}>
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={10} className="p-0">
                  <EmptyState
                    icon="comment-dots"
                    title="Không tìm thấy góp ý nào phù hợp"
                    description="Vui lòng thử điều chỉnh lại bộ lọc trạng thái, loại góp ý hoặc từ khóa tìm kiếm."
                  />
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => <FeedbackRow key={item.id} item={item} />)
            )}
          </tbody>
        </table>
      </div>

      {filteredItems.length > 0 && (
        <div className="ecomd-table__footer body-xs text-[var(--text-subtle)] flex items-center justify-between">
          <div>
            Hiển thị <b>{filteredItems.length}</b> góp ý
          </div>
        </div>
      )}
    </div>
  );
}
