import React from 'react';
import { SlideOver, Icon } from '@/components/ds';
import { useAppDispatch, useAppSelector } from '../../../store';
import { closeDayDetailModal } from '../../../store/slices/reportsSlice';

export const DailyAttendanceModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const selectedDayDetail = useAppSelector((state) => state.reports.selectedDayDetail);

  if (!selectedDayDetail) return null;

  const { studentName, record } = selectedDayDetail;

  const handleClose = () => {
    dispatch(closeDayDetailModal());
  };

  return (
    <SlideOver
      open={Boolean(selectedDayDetail)}
      onClose={handleClose}
      icon="calendar"
      title={`Chi Tiết Điểm Danh — ${record.date}`}
      description={`Thông tin đưa đón, sức khỏe và nhật ký điểm danh của học sinh ${studentName}`}
      width={480}
      primaryAction={{
        label: 'Đóng',
        onClick: handleClose,
      }}
      secondaryAction={null}
    >
      <div className="space-y-3.5">
        {/* Student Name */}
        <div className="flex justify-between items-center py-2 border-b border-[var(--border-default)]">
          <span className="text-xs text-[var(--text-subtle)] font-medium">Học sinh</span>
          <span className="text-sm font-bold text-[var(--text-heading)]">{studentName}</span>
        </div>

        {/* Status */}
        <div className="flex justify-between items-center py-2 border-b border-[var(--border-default)]">
          <span className="text-xs text-[var(--text-subtle)] font-medium">Trạng thái</span>
          <div>
            {record.status === 'present' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Icon name="check" size={10} /> Có mặt
              </span>
            )}
            {record.status === 'absent_excused' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                <Icon name="clock" size={10} /> Nghỉ có phép (CP)
              </span>
            )}
            {record.status === 'absent_unexcused' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                <Icon name="circle-xmark" size={10} /> Nghỉ không phép (KP)
              </span>
            )}
            {record.status === 'unmarked' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                Chưa ghi nhận
              </span>
            )}
          </div>
        </div>

        {record.status === 'present' ? (
          <>
            <div className="flex justify-between items-center py-2 border-b border-[var(--border-default)]">
              <span className="text-xs text-[var(--text-subtle)] font-medium">Giờ đến (Check-in)</span>
              <span className="text-sm font-bold text-[var(--text-heading)] font-mono">
                {record.checkInTime || '--:--'}
                {record.isLateArrival && (
                  <span className="text-amber-600 font-semibold ml-2 text-xs">
                    (+{record.lateArrivalMinutes}p đến muộn)
                  </span>
                )}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-[var(--border-default)]">
              <span className="text-xs text-[var(--text-subtle)] font-medium">Giáo viên đón</span>
              <span className="text-sm font-semibold text-[var(--text-heading)]">
                {record.checkInStaff || 'Cô Nguyễn Mai'}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-[var(--border-default)]">
              <span className="text-xs text-[var(--text-subtle)] font-medium">Giờ về (Check-out)</span>
              <span className="text-sm font-bold text-[var(--text-heading)] font-mono">
                {record.checkOutTime || '--:--'}
                {record.isLateDeparture && (
                  <span className="text-rose-600 font-semibold ml-2 text-xs">
                    (+{record.lateDepartureMinutes}p về muộn)
                  </span>
                )}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-[var(--border-default)]">
              <span className="text-xs text-[var(--text-subtle)] font-medium">Giáo viên trả trẻ</span>
              <span className="text-sm font-semibold text-[var(--text-heading)]">
                {record.checkOutStaff || 'Cô Thu Thủy'}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-[var(--border-default)]">
              <span className="text-xs text-[var(--text-subtle)] font-medium">Thân nhiệt</span>
              <span className="text-sm font-semibold text-[var(--text-heading)]">
                {record.temperature ? `${record.temperature}°C` : '36.5°C (Bình thường)'}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-[var(--border-default)]">
              <span className="text-xs text-[var(--text-subtle)] font-medium">Tình trạng sức khỏe</span>
              <span className="text-sm font-semibold text-[var(--text-heading)]">
                {record.healthStatus || 'Tốt, vui vẻ'}
              </span>
            </div>
          </>
        ) : (
          <>
            <div className="p-3 bg-[var(--bg-subtle)] rounded-[var(--radius-8)] border border-[var(--border-default)]">
              <div className="text-xs font-semibold text-[var(--text-heading)] mb-1">Lý do vắng mặt:</div>
              <div className="text-xs text-[var(--text-body)]">
                {record.notes || 'Gia đình có việc riêng, phụ huynh đã gửi đơn xin nghỉ qua cổng Trao đổi.'}
              </div>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-[var(--border-default)]">
              <span className="text-xs text-[var(--text-subtle)] font-medium">Người duyệt / ghi nhận</span>
              <span className="text-sm font-semibold text-[var(--text-heading)]">
                {record.checkInStaff || 'Cô Nguyễn Mai'}
              </span>
            </div>
          </>
        )}
      </div>
    </SlideOver>
  );
};

export default DailyAttendanceModal;
