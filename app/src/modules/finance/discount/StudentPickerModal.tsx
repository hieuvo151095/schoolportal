/**
 * Student Picker Modal for Individual Student Exemption Scoping
 * Finance Domain - Finviet / SOHA School Operating Portal
 * Design System: [DS] ECO ME DASHBOARD v1.1.0 (PopupModal + Dropdown)
 */

import React, { useState, useMemo } from 'react';
import { AVAILABLE_STUDENTS_FOR_DISCOUNT } from '../../../services/mockDiscountData';
import { PopupModal, Dropdown, DropdownOption, Icon } from '@/components/ds';

interface StudentPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedStudentIds: string[];
  onConfirm: (selectedIds: string[]) => void;
}

export const StudentPickerModal: React.FC<StudentPickerModalProps> = ({
  isOpen,
  onClose,
  selectedStudentIds,
  onConfirm,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState('all');
  const [tempSelectedIds, setTempSelectedIds] = useState<string[]>(selectedStudentIds);

  // Sync state on modal open
  React.useEffect(() => {
    if (isOpen) {
      setTempSelectedIds(selectedStudentIds);
      setSearchQuery('');
      setSelectedClassFilter('all');
    }
  }, [isOpen, selectedStudentIds]);

  const uniqueClasses = useMemo(() => {
    const map = new Map<string, string>();
    AVAILABLE_STUDENTS_FOR_DISCOUNT.forEach((s) => {
      map.set(s.classId, s.className);
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, []);

  const classOptions: DropdownOption[] = useMemo(() => [
    { value: 'all', label: 'Tất cả các lớp' },
    ...uniqueClasses.map((c) => ({ value: c.id, label: c.name })),
  ], [uniqueClasses]);

  const filteredStudents = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return AVAILABLE_STUDENTS_FOR_DISCOUNT.filter((s) => {
      const matchClass = selectedClassFilter === 'all' || s.classId === selectedClassFilter;
      const matchQuery =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q) ||
        s.className.toLowerCase().includes(q);
      return matchClass && matchQuery;
    });
  }, [searchQuery, selectedClassFilter]);

  if (!isOpen) return null;

  const isSelected = (studentId: string) => {
    return tempSelectedIds.includes(studentId);
  };

  const handleToggleStudent = (studentId: string) => {
    if (isSelected(studentId)) {
      setTempSelectedIds((prev) => prev.filter((id) => id !== studentId));
    } else {
      setTempSelectedIds((prev) => [...prev, studentId]);
    }
  };

  const handleSelectAllFiltered = () => {
    const unselectedFiltered = filteredStudents
      .map((s) => s.id)
      .filter((id) => !tempSelectedIds.includes(id));
    setTempSelectedIds((prev) => [...prev, ...unselectedFiltered]);
  };

  const handleDeselectAllFiltered = () => {
    const filteredIds = new Set(filteredStudents.map((s) => s.id));
    setTempSelectedIds((prev) => prev.filter((id) => !filteredIds.has(id)));
  };

  const handleConfirm = () => {
    onConfirm(tempSelectedIds);
    onClose();
  };

  return (
    <PopupModal
      open={isOpen}
      onClose={onClose}
      title="Chọn học sinh áp dụng"
      description="Tìm kiếm và chỉ định học sinh được hưởng chính sách miễn giảm"
      icon="user-graduate"
      width={640}
      primaryAction={{
        label: `Xác nhận (${tempSelectedIds.length})`,
        icon: 'check',
        onClick: handleConfirm,
      }}
      secondaryAction={{
        label: 'Hủy',
        onClick: onClose,
      }}
    >
      <div className="space-y-3">
        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-3 pb-2 border-b border-slate-100">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Tìm tên, mã học sinh..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 px-3 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0070CE]"
            />
          </div>
          <div className="w-full sm:w-48">
            <Dropdown
              value={selectedClassFilter}
              onChange={(val) => setSelectedClassFilter(val)}
              options={classOptions}
              size="sm"
              fullWidth
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>
            Tìm thấy <strong className="text-slate-700">{filteredStudents.length}</strong> học sinh
            (Đã chọn <strong className="text-[#0070CE]">{tempSelectedIds.length}</strong>)
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSelectAllFiltered}
              className="text-[#0070CE] hover:underline font-medium cursor-pointer"
            >
              Chọn tất cả
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={handleDeselectAllFiltered}
              className="text-rose-500 hover:underline font-medium cursor-pointer"
            >
              Bỏ chọn tất cả
            </button>
          </div>
        </div>

        {/* Student List */}
        <div className="max-h-[50vh] overflow-y-auto divide-y divide-slate-100">
          {filteredStudents.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-sm">
              Không tìm thấy học sinh phù hợp với điều kiện tìm kiếm.
            </div>
          ) : (
            filteredStudents.map((student) => {
              const checked = isSelected(student.id);
              return (
                <div
                  key={student.id}
                  onClick={() => handleToggleStudent(student.id)}
                  className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-colors ${
                    checked ? 'bg-blue-50/70' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleToggleStudent(student.id)}
                      className="w-4 h-4 rounded text-[#0070CE] focus:ring-[#0070CE] border-slate-300"
                    />
                    <div>
                      <div className="text-xs font-semibold text-slate-800">
                        {student.name}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Mã HS: <span className="font-mono text-slate-600">{student.code}</span> • Lớp:{' '}
                        <span className="text-slate-600 font-medium">{student.className}</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full font-medium">
                    {student.className}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </PopupModal>
  );
};
