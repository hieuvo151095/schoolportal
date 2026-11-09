import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  addStudentToAssignment,
  closeManageStudentsModal,
} from '../../../store/slices/assignmentSlice';
import { SlideOver, SearchField, Icon } from '@/components/ds';

export const ManageStudentsModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(
    (state) => state.assignment.isManageStudentsModalOpen
  );
  const assignmentId = useAppSelector(
    (state) => state.assignment.activeAssignmentIdForStudents
  );
  const assignments = useAppSelector(
    (state) => state.assignment.assignments
  );
  const allStudents = useAppSelector((state) => state.assignment.students);

  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const currentAssignment = assignments.find((a) => a.id === assignmentId);

  if (!isOpen || !currentAssignment) return null;

  // Filter out students who are already part of this assignment's submissions
  const existingStudentIds = currentAssignment.submissions.map(
    (s) => s.studentId
  );
  const availableStudents = allStudents.filter(
    (s) =>
      s.classId.toLowerCase() === currentAssignment.classId.toLowerCase() &&
      !existingStudentIds.includes(s.id)
  );

  const filteredStudents = availableStudents.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.studentCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggle = (id: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedStudentIds.length === filteredStudents.length) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(filteredStudents.map((s) => s.id));
    }
  };

  const handleClose = () => {
    setSelectedStudentIds([]);
    setSearchQuery('');
    dispatch(closeManageStudentsModal());
  };

  const handleAddStudents = () => {
    selectedStudentIds.forEach((studentId) => {
      dispatch(
        addStudentToAssignment({
          assignmentId: currentAssignment.id,
          studentId,
        })
      );
    });

    handleClose();
  };

  return (
    <SlideOver
      open={isOpen}
      onClose={handleClose}
      title="Thêm học sinh vào bài tập"
      description={`Chỉ định bổ sung học sinh lớp ${currentAssignment.className} cần hoàn thành bài tập`}
      icon="users"
      width={480}
      primaryAction={{
        label: `Thêm (${selectedStudentIds.length}) học sinh`,
        icon: 'check',
        disabled: selectedStudentIds.length === 0,
        onClick: handleAddStudents,
      }}
      secondaryAction={{
        label: 'Hủy',
        onClick: handleClose,
      }}
    >
      <div className="space-y-3.5">
        <div>
          <SearchField
            value={searchQuery}
            onChange={(q) => setSearchQuery(q)}
            placeholder="Tìm theo tên học sinh, mã HS..."
          />
        </div>

        {filteredStudents.length > 0 && (
          <div className="flex items-center justify-between text-xs text-[var(--text-subtle)] px-1">
            <span>Tìm thấy {filteredStudents.length} học sinh</span>
            <button
              type="button"
              onClick={handleSelectAll}
              className="text-[var(--eco-blue-strong)] hover:underline font-semibold"
            >
              {selectedStudentIds.length === filteredStudents.length
                ? 'Bỏ chọn tất cả'
                : 'Chọn tất cả'}
            </button>
          </div>
        )}

        <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
          {filteredStudents.length === 0 ? (
            <div className="py-8 text-center text-xs text-[var(--text-subtle)] bg-[var(--bg-muted)] rounded-xl border border-dashed border-[var(--border-default)]">
              {availableStudents.length === 0
                ? 'Tất cả học sinh trong lớp đã có trong danh sách bài tập này.'
                : 'Không tìm thấy học sinh phù hợp với từ khóa.'}
            </div>
          ) : (
            filteredStudents.map((student) => {
              const isSelected = selectedStudentIds.includes(student.id);

              return (
                <div
                  key={student.id}
                  onClick={() => handleToggle(student.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-[var(--eco-blue-strong)] bg-blue-50/60 shadow-xs'
                      : 'border-[var(--border-default)] bg-[var(--bg-surface)] hover:bg-[var(--bg-muted)]'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}}
                    className="w-4 h-4 rounded text-[var(--eco-blue-strong)] focus:ring-0 cursor-pointer"
                  />
                  <div className="w-8 h-8 rounded-full bg-[var(--bg-muted)] flex items-center justify-center text-xs font-bold text-[var(--text-heading)] flex-shrink-0">
                    {student.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-[var(--text-heading)] truncate">
                      {student.name}
                    </p>
                    <p className="text-[11px] text-[var(--text-subtle)] font-mono truncate">
                      Mã: {student.studentCode}
                      {student.nickname ? ` • ${student.nickname}` : ''}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </SlideOver>
  );
};

export default ManageStudentsModal;
