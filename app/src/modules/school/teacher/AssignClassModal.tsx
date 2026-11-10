import React, { useState, useEffect } from 'react';
import { Icon, Dropdown } from '@/components/ds';
import type { Teacher, AssignedClassItem } from '../../../types/teacher';
import { checkHomeroomConflict } from '../../../utils/teacherValidation';
import { useAppDispatch, useAppSelector } from '../../../store';
import { assignClasses } from '../../../store/slices/teacherSlice';
import { addToast } from '../../../store/slices/toastSlice';

interface AssignClassModalProps {
  teacher: Teacher | null;
  isOpen: boolean;
  onClose: () => void;
}

const AVAILABLE_CLASSES: { id: string; name: string }[] = [
  { id: 'lop-1a1', name: 'Lớp 1A1' },
  { id: 'lop-1a2', name: 'Lớp 1A2' },
  { id: 'lop-2a1', name: 'Lớp 2A1' },
  { id: 'lop-nk-ve', name: 'Lớp Vẽ Sáng Tạo' },
];

export const AssignClassModal: React.FC<AssignClassModalProps> = ({
  teacher,
  isOpen,
  onClose,
}) => {
  const dispatch = useAppDispatch();
  const allTeachers = useAppSelector((state) => state.teacher.teachers);

  const [selectedHomeroom, setSelectedHomeroom] = useState<string>('');
  const [selectedAssigned, setSelectedAssigned] = useState<string[]>([]);

  useEffect(() => {
    if (teacher) {
      setSelectedHomeroom(teacher.homeroomClassId || '');
      setSelectedAssigned(teacher.assignedClasses.map((c) => c.classId));
    }
  }, [teacher]);

  if (!isOpen || !teacher) return null;

  const targetHomeroomObj = AVAILABLE_CLASSES.find((c) => c.id === selectedHomeroom);
  const conflict = checkHomeroomConflict(
    allTeachers,
    teacher.id,
    selectedHomeroom || undefined,
    targetHomeroomObj?.name
  );

  const toggleAssignedClass = (classId: string) => {
    setSelectedAssigned((prev) =>
      prev.includes(classId) ? prev.filter((id) => id !== classId) : [...prev, classId]
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const assignedClassItems: AssignedClassItem[] = selectedAssigned.map((id) => {
      const found = AVAILABLE_CLASSES.find((c) => c.id === id);
      return {
        classId: id,
        className: found ? found.name : id,
      };
    });

    dispatch(
      assignClasses({
        teacherId: teacher.id,
        homeroomClassId: selectedHomeroom || undefined,
        homeroomClassName: targetHomeroomObj?.name,
        assignedClasses: assignedClassItems,
      })
    );

    dispatch(
      addToast({
        type: 'success',
        title: 'Phân công thành công',
        message: `Đã cập nhật phân công lớp học cho giáo viên "${teacher.fullName}"`,
      })
    );

    onClose();
  };

  const homeroomOptions = [
    { value: '', label: '-- Không phân công chủ nhiệm --' },
    ...AVAILABLE_CLASSES.map((c) => ({ value: c.id, label: c.name })),
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#0070CE]">
              <Icon name="chalkboard-user" size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Phân công lớp học</h3>
              <p className="text-xs text-slate-500">{teacher.fullName}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng cửa sổ"
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors"
          >
            <Icon name="xmark" size={14} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSave} className="p-6 space-y-5">
          {/* Homeroom Assignment */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Lớp chủ nhiệm
            </label>
            <Dropdown
              value={selectedHomeroom}
              onChange={setSelectedHomeroom}
              options={homeroomOptions}
              fullWidth
            />
            <p className="text-xs text-slate-400 mt-1">
              Giáo viên chủ nhiệm có toàn quyền quản lý điểm danh, hoạt động và trao đổi của lớp.
            </p>
          </div>

          {/* Resolution K006: Homeroom Conflict Warning Banner */}
          {conflict.hasConflict && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 flex items-start gap-3 text-xs">
              <Icon
                name="triangle-exclamation"
                size={16}
                className="text-amber-600 mt-0.5 shrink-0"
              />
              <div>
                <div className="font-bold text-amber-900">Cảnh báo trùng lặp chủ nhiệm</div>
                <div className="mt-0.5 leading-relaxed">{conflict.warningMessage}</div>
              </div>
            </div>
          )}

          {/* Assigned Teaching Classes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Lớp phụ trách / Giảng dạy bộ môn
            </label>
            <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
              {AVAILABLE_CLASSES.map((c) => {
                const isChecked = selectedAssigned.includes(c.id);
                return (
                  <label
                    key={c.id}
                    className={`flex items-center gap-2.5 p-2 rounded-lg border transition-colors cursor-pointer select-none ${
                      isChecked
                        ? 'bg-blue-50/70 border-blue-200 text-blue-900 font-medium'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100/60'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleAssignedClass(c.id)}
                      className="rounded border-slate-300 text-[#0070CE] focus:ring-[#0070CE]"
                    />
                    <span className="text-xs">{c.name}</span>
                  </label>
                );
              })}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Giáo viên sẽ được cấp quyền xem danh sách và tạo nhật ký học tập cho các lớp được phân công.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#0070CE] hover:bg-[#005ba8] rounded-lg transition-colors shadow-xs"
            >
              <Icon name="circle-check" size={14} />
              <span>Lưu phân công</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
