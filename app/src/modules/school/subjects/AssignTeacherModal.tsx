import React, { useState, useMemo } from 'react';
import { useAppSelector } from '@/store';
import { mockTeachers } from '@/services/mockTeacherData';
import { getUnassignedTeachers, normalizeVietnameseText } from '@/utils/subjectValidation';
import type { SchoolSubject, AssignTeacherPayload } from '@/types/subject';
import { SlideOver, Icon } from '@/components/ds';

interface AssignTeacherModalProps {
  isOpen: boolean;
  subject: SchoolSubject | null;
  onClose: () => void;
  onAssign: (payload: AssignTeacherPayload) => void;
}

export const AssignTeacherModal: React.FC<AssignTeacherModalProps> = ({
  isOpen,
  subject,
  onClose,
  onAssign,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');
  const [selectedClassIds, setSelectedClassIds] = useState<string[]>([]);

  // Sourced from Redux teacher directory with mock fallback
  const reduxTeachers = useAppSelector((state) => state.teacher?.teachers) || [];
  const allTeachers = reduxTeachers.length > 0 ? reduxTeachers : mockTeachers;

  // Active classes from Redux class slice
  const reduxClasses = useAppSelector((state) => state.class?.classes) || [];

  // BR09: Dropdown strictly excludes teachers already assigned to this subject
  const unassignedTeachers = useMemo(() => {
    if (!subject) return [];
    const available = getUnassignedTeachers(allTeachers, subject.assignedTeachers);

    if (!searchTerm) return available;
    const normalizedTerm = normalizeVietnameseText(searchTerm);
    return available.filter(
      (t) =>
        normalizeVietnameseText(t.fullName).includes(normalizedTerm) ||
        normalizeVietnameseText(t.staffCode || '').includes(normalizedTerm)
    );
  }, [allTeachers, subject, searchTerm]);

  if (!isOpen || !subject) return null;

  const handleConfirm = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedTeacherId) return;
    const targetTeacher = allTeachers.find((t) => t.id === selectedTeacherId);
    if (!targetTeacher) return;

    onAssign({
      subjectId: subject.id,
      teacherId: targetTeacher.id,
      teacherName: targetTeacher.fullName,
      teacherCode: targetTeacher.staffCode || `GV-${targetTeacher.id}`,
      avatarUrl: targetTeacher.avatar,
      phone: targetTeacher.phone,
      email: targetTeacher.email,
      assignedClasses: selectedClassIds,
    });

    // Reset local state
    setSelectedTeacherId('');
    setSelectedClassIds([]);
    setSearchTerm('');
  };

  const selectedTeacher = allTeachers.find((t) => t.id === selectedTeacherId);

  return (
    <SlideOver
      open={isOpen}
      onClose={onClose}
      title="Phân công giáo viên giảng dạy"
      description={`Môn: ${subject.name} (${subject.code})`}
      icon="user-plus"
      width={560}
      primaryAction={{
        label: 'Xác nhận phân công',
        onClick: () => handleConfirm(),
        disabled: !selectedTeacherId,
        icon: 'check',
      }}
      secondaryAction={{
        label: 'Hủy bỏ',
        onClick: onClose,
      }}
    >
      <div className="space-y-4 text-left">
        {/* Search for unassigned teachers */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700">
            1. Chọn giáo viên phụ trách (Chỉ hiển thị GV chưa được gán)
          </label>
          <div className="relative">
            <Icon
              name="magnifying-glass"
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tên giáo viên hoặc mã nhân viên..."
              className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0070CE] focus:bg-white"
            />
          </div>

          {/* Teacher Selection List */}
          <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100 bg-slate-50/50">
            {unassignedTeachers.length > 0 ? (
              unassignedTeachers.map((teacher) => {
                const isSelected = selectedTeacherId === teacher.id;
                return (
                  <div
                    key={teacher.id}
                    onClick={() => setSelectedTeacherId(teacher.id)}
                    className={`p-2.5 flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-blue-50/90 text-blue-900 font-semibold'
                        : 'hover:bg-slate-100/70 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {teacher.avatar ? (
                        <img
                          src={teacher.avatar}
                          alt={teacher.fullName}
                          className="w-7 h-7 rounded-full object-cover shrink-0 border border-slate-200"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-blue-100 text-[#0070CE] flex items-center justify-center text-xs font-bold shrink-0">
                          {teacher.fullName.charAt(0)}
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="text-xs font-bold truncate">{teacher.fullName}</div>
                        <div className="text-[10px] text-slate-500">
                          {teacher.staffCode || 'Mã GV: Chưa có'} • {teacher.educationLevel || 'Đại học Sư phạm'}
                        </div>
                      </div>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'border-[#0070CE] bg-[#0070CE] text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <Icon name="check" size={10} />}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-4 text-center text-xs text-slate-500">
                {searchTerm
                  ? 'Không tìm thấy giáo viên nào phù hợp'
                  : 'Tất cả giáo viên trong trường đã được phân công cho môn học này.'}
              </div>
            )}
          </div>
        </div>

        {/* Selected Teacher Summary */}
        {selectedTeacher && (
          <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200 text-xs text-blue-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <Icon name="chalkboard-user" size={14} className="text-[#0070CE]" />
              <span>Đã chọn: {selectedTeacher.fullName}</span>
              <span className="font-mono text-[10px] bg-blue-100 px-1.5 py-0.5 rounded font-normal">
                {selectedTeacher.staffCode || selectedTeacher.id}
              </span>
            </div>
            <p className="text-[11px] text-blue-700 m-0">
              Giáo viên sẽ được cấp quyền nhập điểm, đánh giá và soạn kế hoạch bài dạy cho môn {subject.name}.
            </p>
          </div>
        )}

        {/* Optional Classes to Assign */}
        {reduxClasses.length > 0 && (
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              2. Chọn lớp phụ trách dạy (Tùy chọn)
            </label>
            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2 bg-slate-50 rounded-lg border border-slate-200">
              {reduxClasses.map((cls) => {
                const isClassSelected = selectedClassIds.includes(cls.id);
                return (
                  <button
                    key={cls.id}
                    type="button"
                    onClick={() => {
                      setSelectedClassIds((prev) =>
                        isClassSelected
                          ? prev.filter((id) => id !== cls.id)
                          : [...prev, cls.id]
                      );
                    }}
                    className={`px-2 py-1 text-[11px] rounded-md font-medium border transition-colors cursor-pointer flex items-center gap-1 ${
                      isClassSelected
                        ? 'bg-[#0070CE] text-white border-[#0070CE]'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <Icon name="chalkboard" size={10} />
                    <span>{cls.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </SlideOver>
  );
};
