import React, { useState, useEffect } from 'react';
import { SlideOver, Icon } from '@/components/ds';
import { useAppDispatch, useAppSelector } from '../../../store';
import { closeAbsenceEditModal, updateAbsenceRecord } from '../../../store/slices/reportsSlice';
import { AttendanceDayStatus } from '../../../types/reports';

export const EditAbsenceModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const selectedAbsenceEdit = useAppSelector((state) => state.reports.selectedAbsenceEdit);

  const [status, setStatus] = useState<AttendanceDayStatus>('absent_excused');
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (selectedAbsenceEdit) {
      setStatus(
        selectedAbsenceEdit.record.status === 'absent_unexcused'
          ? 'absent_unexcused'
          : 'absent_excused'
      );
      setReason(selectedAbsenceEdit.record.notes || '');
    }
  }, [selectedAbsenceEdit]);

  if (!selectedAbsenceEdit) return null;

  const { studentName, record } = selectedAbsenceEdit;

  const handleClose = () => {
    dispatch(closeAbsenceEditModal());
  };

  const handleSave = () => {
    dispatch(
      updateAbsenceRecord({
        studentId: selectedAbsenceEdit.studentId,
        date: record.date,
        status,
        notes: reason.trim(),
      })
    );
    handleClose();
  };

  return (
    <SlideOver
      open={Boolean(selectedAbsenceEdit)}
      onClose={handleClose}
      icon="pen"
      title="Chỉnh Sửa Trạng Thái Vắng"
      description={`Cập nhật phân loại nghỉ và lý do vắng cho học sinh ${studentName}`}
      width={480}
      secondaryAction={{
        label: 'Hủy',
        onClick: handleClose,
      }}
      primaryAction={{
        label: 'Lưu thay đổi',
        icon: 'check',
        onClick: handleSave,
      }}
    >
      <div className="space-y-4">
        {/* Info card */}
        <div
          className="p-3.5 rounded-[var(--radius-8)] border text-xs leading-relaxed"
          style={{
            background: 'var(--semantic-info-soft)',
            borderColor: 'var(--border-info-soft, #bfdbfe)',
            color: 'var(--semantic-info-strong)',
          }}
        >
          <div className="font-bold text-sm">{studentName}</div>
          <div className="text-[11px] opacity-90 mt-0.5">Ngày vắng: {record.date}</div>
        </div>

        {/* Absence Type */}
        <div>
          <label className="block text-xs font-semibold text-[var(--text-heading)] mb-1.5">
            Loại vắng mặt <span className="text-[var(--text-danger)]">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label
              className={`flex items-center gap-2.5 p-3 rounded-[var(--radius-8)] border cursor-pointer transition-all ${
                status === 'absent_excused'
                  ? 'border-[var(--eco-blue-strong)] bg-[var(--semantic-info-soft)] text-[var(--eco-blue-strong)] font-semibold'
                  : 'border-[var(--border-default)] hover:border-[var(--text-subtle)] text-[var(--text-body)] bg-[var(--bg-surface)]'
              }`}
            >
              <input
                type="radio"
                name="absence-type"
                checked={status === 'absent_excused'}
                onChange={() => setStatus('absent_excused')}
                className="w-4 h-4 text-[var(--eco-blue-strong)]"
              />
              <span className="text-xs">Nghỉ có phép (P)</span>
            </label>

            <label
              className={`flex items-center gap-2.5 p-3 rounded-[var(--radius-8)] border cursor-pointer transition-all ${
                status === 'absent_unexcused'
                  ? 'border-[var(--eco-blue-strong)] bg-[var(--semantic-info-soft)] text-[var(--eco-blue-strong)] font-semibold'
                  : 'border-[var(--border-default)] hover:border-[var(--text-subtle)] text-[var(--text-body)] bg-[var(--bg-surface)]'
              }`}
            >
              <input
                type="radio"
                name="absence-type"
                checked={status === 'absent_unexcused'}
                onChange={() => setStatus('absent_unexcused')}
                className="w-4 h-4 text-[var(--eco-blue-strong)]"
              />
              <span className="text-xs">Nghỉ không phép (KP)</span>
            </label>
          </div>
          <p className="text-[11px] text-[var(--text-subtle)] mt-1.5">
            {status === 'absent_excused'
              ? 'Học sinh đủ điều kiện hoàn lại tiền ăn bán trú theo quy định nhà trường.'
              : 'Nghỉ không phép sẽ không được khấu trừ tiền ăn trong tháng.'}
          </p>
        </div>

        {/* Reason */}
        <div>
          <label className="block text-xs font-semibold text-[var(--text-heading)] mb-1">
            Lý do xin nghỉ / Ghi chú của giáo viên
          </label>
          <textarea
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Nhập lý do vắng mặt..."
            className="w-full px-3.5 py-2.5 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[var(--radius-8)] text-sm text-[var(--text-heading)] focus:outline-none focus:border-[var(--eco-blue-strong)] focus:ring-2 focus:ring-[var(--eco-blue-100,#dbeafe)] transition-all resize-none placeholder:text-[var(--text-disabled)]"
          />
        </div>
      </div>
    </SlideOver>
  );
};

export default EditAbsenceModal;
