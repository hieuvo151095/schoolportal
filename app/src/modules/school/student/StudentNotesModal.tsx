import React, { useState } from 'react';
import { Icon } from '@/components/ds';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-yellow-100 text-yellow-700 flex items-center justify-center font-semibold text-sm">
              <Icon name="clipboard-list" size={16} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Ghi chú học sinh</h3>
              <p className="text-xs text-slate-500">{student.fullName} • {student.className}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Đóng"
          >
            <Icon name="xmark" size={14} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-3">
          <label className="block text-xs font-semibold text-slate-700">
            Nội dung ghi chú nội bộ (sức khỏe, lưu ý bán trú, gia đình...)
          </label>
          <textarea
            rows={5}
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

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            Đóng
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#0070CE] hover:bg-[#005ba8] rounded-lg transition-colors shadow-xs"
          >
            <Icon name="circle-check" size={14} />
            <span>Lưu ghi chú</span>
          </button>
        </div>
      </div>
    </div>
  );
};
