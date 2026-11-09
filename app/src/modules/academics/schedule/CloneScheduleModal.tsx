import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import { cloneSchedule, setCloneModalOpen } from '../../../store/slices/scheduleSlice';
import { generateAutoTitle } from '../../../utils/scheduleValidation';
import { SlideOver, Dropdown } from '@/components/ds';

export const CloneScheduleModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isCloneModalOpen, activeModalScheduleId, timetables, classes, semesters } =
    useAppSelector((state) => state.schedule);

  const targetSchedule = timetables.find((t) => t.id === activeModalScheduleId);

  const [targetClassId, setTargetClassId] = useState('');
  const [targetSemesterId, setTargetSemesterId] = useState('');
  const [title, setTitle] = useState('');

  const selectedSemester = semesters.find((s) => s.id === targetSemesterId);

  useEffect(() => {
    if (selectedSemester && (!title || title.startsWith('Thời khóa biểu'))) {
      setTitle(generateAutoTitle(selectedSemester.name));
    }
  }, [selectedSemester]);

  if (!isCloneModalOpen || !targetSchedule) return null;

  const handleClose = () => {
    dispatch(setCloneModalOpen({ isOpen: false }));
    setTargetClassId('');
    setTargetSemesterId('');
    setTitle('');
  };

  const isFormValid =
    targetClassId !== '' &&
    targetSemesterId !== '' &&
    title.trim().length > 0;

  const handleClone = () => {
    if (!isFormValid) return;

    const targetClass = classes.find((c) => c.id === targetClassId);
    const targetSem = semesters.find((s) => s.id === targetSemesterId);

    if (!targetClass || !targetSem) return;

    dispatch(
      cloneSchedule({
        sourceId: targetSchedule.id,
        targetClassId: targetClass.id,
        targetClassName: targetClass.name,
        targetSemesterId: targetSem.id,
        targetSemesterName: targetSem.name,
        customTitle: title,
      })
    );
  };

  const classOptions = [
    { value: '', label: '-- Chọn lớp học đích --' },
    ...classes.map((cls) => ({ value: cls.id, label: cls.name })),
  ];

  const semesterOptions = [
    { value: '', label: '-- Chọn học kỳ áp dụng --' },
    ...semesters.map((sem) => ({
      value: sem.id,
      label: `${sem.name} (${sem.academicYear})`,
    })),
  ];

  return (
    <SlideOver
      open={isCloneModalOpen}
      onClose={handleClose}
      title="Tạo bản sao thời khóa biểu"
      description="Sao chép cấu trúc và ma trận tiết học sang lớp hoặc học kỳ khác"
      icon="copy"
      width={460}
      primaryAction={{
        label: 'Tạo bản sao',
        icon: 'copy',
        disabled: !isFormValid,
        onClick: handleClone,
      }}
      secondaryAction={{
        label: 'Hủy',
        onClick: handleClose,
      }}
    >
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5 text-xs text-blue-800 space-y-1">
          <p className="font-semibold text-blue-900">Thời khóa biểu nguồn:</p>
          <p className="font-medium text-blue-700">
            {targetSchedule.title} • {targetSchedule.className} ({targetSchedule.semesterName})
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[var(--text-heading)] mb-1.5">
            Lớp học đích áp dụng <span className="text-red-500">*</span>
          </label>
          <Dropdown
            searchable
            fullWidth
            value={targetClassId}
            onChange={(val) => setTargetClassId(val)}
            options={classOptions}
            placeholder="-- Chọn lớp học đích --"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[var(--text-heading)] mb-1.5">
            Học kỳ áp dụng <span className="text-red-500">*</span>
          </label>
          <Dropdown
            searchable
            fullWidth
            value={targetSemesterId}
            onChange={(val) => setTargetSemesterId(val)}
            options={semesterOptions}
            placeholder="-- Chọn học kỳ áp dụng --"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[var(--text-heading)] mb-1.5">
            Tên thời khóa biểu mới <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="w-full h-10 px-3 border border-[var(--border-default)] rounded-lg text-sm bg-[var(--bg-surface)] text-[var(--text-body)] focus:border-[var(--primary)] outline-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="VD: Thời khóa biểu Học kỳ 1..."
          />
        </div>

        <div className="bg-[var(--bg-muted)] border border-[var(--border-default)] rounded-lg p-3 text-xs text-[var(--text-subtle)] space-y-1">
          <p className="font-semibold text-[var(--text-heading)]">Quy tắc sao chép:</p>
          <p>• Sao chép toàn bộ danh sách tiết học, giáo viên phụ trách và phòng học tương ứng.</p>
          <p>• Bản sao mới sẽ được lưu dưới dạng Bản nháp để bạn kiểm tra trước khi phát hành.</p>
        </div>
      </div>
    </SlideOver>
  );
};

export default CloneScheduleModal;
