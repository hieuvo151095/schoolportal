import React, { useState } from 'react';
import { SlideOver } from '@/components/ds';
import { Student } from '../../../types/student';
import { useAppDispatch } from '../../../store';
import { updateStudentNotes } from '../../../store/slices/studentSlice';
import { addToast } from '../../../store/slices/toastSlice';

interface StudentNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
}

export const StudentNotesModal: React.FC<StudentNotesModalProps> = ({
  isOpen,
  onClose,
  student,
}) => {
  const dispatch = useAppDispatch();
  const [notes, setNotes] = useState(student?.notes || '');

  React.useEffect(() => {
    if (student) {
      setNotes(student.notes || '');
    }
  }, [student]);

  if (!isOpen || !student) return null;

  const handleSave = () => {
    dispatch(
      updateStudentNotes({
        studentId: student.id,
        notes,
      })
    );

    dispatch(
      addToast({
        type: 'success',
        title: 'Cập nhật thành công',
        message: `Đã lưu ghi chú cho học sinh ${student.fullName}`,
      })
    );

    onClose();
  };

  return (
    <SlideOver
      open={isOpen}
      onClose={onClose}
      title="Ghi chú học sinh"
      description={`${student.fullName} • ${student.className}`}
      icon="clipboard-list"
      width={480}
      primaryAction={{
        label: 'Lưu ghi chú',
        icon: 'circle-check',
        onClick: handleSave,
      }}
      secondaryAction={{
        label: 'Đóng',
        onClick: onClose,
      }}
    >
      <div className="space-y-3">
        <label className="block text-xs font-semibold text-slate-700">
          Nội dung ghi chú nội bộ (sức khỏe, lưu ý bán trú, gia đình...)
        </label>
        <textarea
          rows={6}
          maxLength={500}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Nhập ghi chú quan trọng về học sinh để ban giám hiệu và giáo viên theo dõi..."
          className="w-full px-3 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0070CE] focus:outline-hidden text-slate-800 placeholder:text-slate-400"
        />
        <div className="flex justify-between text-xs text-slate-400 px-1">
          <span>Chỉ giáo viên và nhân viên nội bộ xem được</span>
          <span>{notes.length}/500</span>
        </div>
      </div>
    </SlideOver>
  );
};
