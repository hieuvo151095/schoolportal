import React, { useState } from 'react';
import { SlideOver, Icon } from '@/components/ds';
import { useAppDispatch, useAppSelector } from '../../../store';
import { closeDuplicateModal, duplicateExtendedReport } from '../../../store/slices/reportsSlice';

export const DuplicateReportModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const selectedDuplicateReport = useAppSelector((state) => state.reports.selectedDuplicateReport);
  const students = useAppSelector((state) => state.reports.studentRoster);

  const [targetStudentId, setTargetStudentId] = useState('');

  if (!selectedDuplicateReport) return null;

  const handleClose = () => {
    dispatch(closeDuplicateModal());
  };

  const handleDuplicate = () => {
    const targetStudent = students.find((s) => s.studentId === targetStudentId);
    if (!targetStudent) return;

    dispatch(
      duplicateExtendedReport({
        sourceReportId: selectedDuplicateReport.id,
        newStudent: {
          id: targetStudent.studentId,
          name: targetStudent.studentName,
          code: targetStudent.studentCode,
          age: '4 tuổi',
          parentName: `PH ${targetStudent.studentName}`,
          avatarUrl: targetStudent.avatarUrl,
        },
        newClassId: selectedDuplicateReport.classId,
        newClassName: selectedDuplicateReport.className,
        newStartDate: selectedDuplicateReport.startDate,
        newEndDate: selectedDuplicateReport.endDate,
      })
    );

    handleClose();
  };

  return (
    <SlideOver
      open={Boolean(selectedDuplicateReport)}
      onClose={handleClose}
      icon="copy"
      title="Nhân Bản Mẫu Báo Cáo"
      description="Tạo bản sao từ báo cáo có sẵn sang học sinh tiếp nhận mới"
      width={480}
      secondaryAction={{
        label: 'Hủy',
        onClick: handleClose,
      }}
      primaryAction={{
        label: 'Tạo bản sao nháp',
        icon: 'copy',
        disabled: !targetStudentId,
        onClick: handleDuplicate,
      }}
    >
      <div className="space-y-4">
        {/* Quy tắc nhân bản */}
        <div
          className="p-3.5 rounded-[var(--radius-8)] border text-xs leading-relaxed"
          style={{
            background: 'var(--semantic-info-soft)',
            borderColor: 'var(--border-info-soft, #bfdbfe)',
            color: 'var(--semantic-info-strong)',
          }}
        >
          <strong>Quy tắc nhân bản (BR08):</strong> Mẫu báo cáo được giữ cố định theo cấu trúc tiêu chí ban đầu. Bạn chỉ cần chọn học sinh tiếp nhận.
        </div>

        {/* Mẫu báo cáo */}
        <div>
          <label className="block text-xs font-semibold text-[var(--text-heading)] mb-1">
            Mẫu báo cáo (Cố định)
          </label>
          <input
            type="text"
            disabled
            value={selectedDuplicateReport.templateName}
            className="w-full px-3.5 py-2.5 bg-[var(--bg-muted)] border border-[var(--border-default)] rounded-[var(--radius-8)] text-sm text-[var(--text-subtle)] cursor-not-allowed"
          />
        </div>

        {/* Báo cáo gốc */}
        <div>
          <label className="block text-xs font-semibold text-[var(--text-heading)] mb-1">
            Báo cáo nguồn
          </label>
          <input
            type="text"
            disabled
            value={`${selectedDuplicateReport.studentName} (${
              selectedDuplicateReport.stageName ||
              `${selectedDuplicateReport.startDate} ~ ${selectedDuplicateReport.endDate}`
            })`}
            className="w-full px-3.5 py-2.5 bg-[var(--bg-muted)] border border-[var(--border-default)] rounded-[var(--radius-8)] text-sm text-[var(--text-subtle)] cursor-not-allowed"
          />
        </div>

        {/* Học sinh tiếp nhận mới */}
        <div>
          <label className="block text-xs font-semibold text-[var(--text-heading)] mb-1">
            Học sinh tiếp nhận mới <span className="text-[var(--text-danger)]">*</span>
          </label>
          <div className="relative">
            <select
              value={targetStudentId}
              onChange={(e) => setTargetStudentId(e.target.value)}
              className="w-full appearance-none px-3.5 py-2.5 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[var(--radius-8)] text-sm text-[var(--text-heading)] focus:outline-none focus:border-[var(--eco-blue-strong)] focus:ring-2 focus:ring-[var(--eco-blue-100,#dbeafe)] transition-all font-medium pr-9"
            >
              <option value="">-- Chọn học sinh tiếp nhận --</option>
              {students
                .filter((s) => s.studentId !== selectedDuplicateReport.studentId)
                .map((s) => (
                  <option key={s.studentId} value={s.studentId}>
                    {s.studentName} ({s.studentCode})
                  </option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[var(--text-subtle)]">
              <Icon name="chevron-down" size={14} />
            </div>
          </div>
          <p className="text-[11px] text-[var(--text-subtle)] mt-1">
            Bản sao sẽ kế thừa toàn bộ tiêu chí đánh giá và lưu ở trạng thái Bản nháp.
          </p>
        </div>
      </div>
    </SlideOver>
  );
};

export default DuplicateReportModal;
