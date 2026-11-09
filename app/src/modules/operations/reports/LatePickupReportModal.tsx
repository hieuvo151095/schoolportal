import React from 'react';
import { SlideOver, Icon } from '@/components/ds';
import { useAppDispatch, useAppSelector } from '../../../store';
import { closeLateFeeModal } from '../../../store/slices/reportsSlice';
import { computeLatePickupFee } from '../../../utils/reportsValidation';

export const LatePickupReportModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const student = useAppSelector((state) => state.reports.selectedLateFeeReport);

  if (!student) return null;

  const handleClose = () => {
    dispatch(closeLateFeeModal());
  };

  // Filter records where late departure occurred
  const lateRecords = Object.entries(student.records)
    .filter(([_, rec]) => rec.isLateDeparture && (rec.lateDepartureMinutes || 0) > 0)
    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB));

  return (
    <SlideOver
      open={Boolean(student)}
      onClose={handleClose}
      icon="clock"
      title={`Báo Cáo Đón Muộn — ${student.studentName}`}
      description={`Chi tiết số lượt đón muộn và phụ phí bán trú của học sinh ${student.studentName}`}
      width={520}
      secondaryAction={{
        label: 'Đóng',
        onClick: handleClose,
      }}
      primaryAction={{
        label: 'Xuất Phiếu Thu Phụ Phí',
        icon: 'file-invoice-dollar',
        onClick: () => {
          alert(
            `Đã xuất bảng tính phụ phí đón muộn cho học sinh ${student.studentName}: ${student.estimatedLateFee.toLocaleString(
              'vi-VN'
            )} đ.`
          );
          handleClose();
        },
      }}
    >
      <div className="space-y-4">
        {/* Notice banner */}
        <div
          className="p-3.5 rounded-[var(--radius-8)] border text-xs leading-relaxed flex items-start gap-2.5"
          style={{
            background: 'var(--semantic-warning-soft)',
            borderColor: 'var(--border-warning-soft, #fed7aa)',
            color: 'var(--semantic-warning-strong)',
          }}
        >
          <Icon name="circle-exclamation" size={16} className="mt-0.5 shrink-0" />
          <div>
            <strong>Quy định đón muộn (BR05, BR06):</strong> Giờ tan học chuẩn là <strong>17:30</strong>. Phụ phí áp dụng <strong>50.000 đ / block 30 phút</strong> hoặc phần lẻ 30 phút quá giờ.
          </div>
        </div>

        {/* Summary Stat Box */}
        <div className="grid grid-cols-3 gap-2.5 p-3.5 bg-[var(--bg-subtle)] border border-[var(--border-default)] rounded-[var(--radius-8)] text-center">
          <div>
            <div className="text-[11px] text-[var(--text-subtle)] uppercase font-semibold">Số lần đón muộn</div>
            <div className="text-lg font-bold text-[var(--text-heading)] mt-0.5">{student.totalLateDepartures} lần</div>
          </div>
          <div>
            <div className="text-[11px] text-[var(--text-subtle)] uppercase font-semibold">Tổng phút muộn</div>
            <div className="text-lg font-bold text-amber-600 mt-0.5">{student.totalLateDepartureMinutes} phút</div>
          </div>
          <div>
            <div className="text-[11px] text-[var(--text-subtle)] uppercase font-semibold">Tổng phụ phí</div>
            <div className="text-lg font-bold text-[var(--semantic-danger-strong)] mt-0.5 font-numeric">
              {student.estimatedLateFee.toLocaleString('vi-VN')} đ
            </div>
          </div>
        </div>

        {/* Detailed List */}
        <div>
          <label className="block text-xs font-semibold text-[var(--text-heading)] mb-2">
            Nhật ký các ngày đón muộn trong tháng
          </label>
          <div className="border border-[var(--border-default)] rounded-[var(--radius-8)] overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-[var(--bg-muted)] text-[var(--text-subtle)] border-b border-[var(--border-default)]">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold">Ngày</th>
                  <th className="px-3 py-2 text-left font-semibold">Giờ về</th>
                  <th className="px-3 py-2 text-left font-semibold">Số phút</th>
                  <th className="px-3 py-2 text-right font-semibold">Phụ phí</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {lateRecords.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-3 py-4 text-center text-[var(--text-subtle)]">
                      Học sinh không có lượt đón muộn nào trong tháng.
                    </td>
                  </tr>
                ) : (
                  lateRecords.map(([date, rec]) => {
                    const mins = rec.lateDepartureMinutes || 0;
                    const fee = computeLatePickupFee(mins);
                    return (
                      <tr key={date} className="hover:bg-[var(--bg-subtle)]">
                        <td className="px-3 py-2 font-medium">
                          {date} ({rec.weekday})
                        </td>
                        <td className="px-3 py-2 font-mono text-[var(--text-subtle)]">
                          {rec.checkOutTime || '--:--'}
                        </td>
                        <td className="px-3 py-2 text-amber-600 font-semibold font-mono">
                          +{mins}p
                        </td>
                        <td className="px-3 py-2 text-right font-semibold text-[var(--semantic-danger-strong)] font-numeric">
                          {fee.toLocaleString('vi-VN')} đ
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </SlideOver>
  );
};
