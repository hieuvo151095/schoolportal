/**
 * Class Picker Modal for Class-Scoped Exemption Scoping
 * Finance Domain - Finviet / SOHA School Operating Portal
 * Governance: Marcus Fleet V34 / Constitution V1.0.0
 * Design System: [DS] ECO ME DASHBOARD v1.1.0 (PopupModal + Dropdown)
 */

import React, { useState, useMemo } from 'react';
import { AVAILABLE_CLASSES_FOR_DISCOUNT } from '../../../services/mockDiscountData';
import { PopupModal, Dropdown, DropdownOption, Icon } from '@/components/ds';

interface ClassPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedClassIds: string[];
  onConfirm: (selectedIds: string[]) => void;
}

export const ClassPickerModal: React.FC<ClassPickerModalProps> = ({
  isOpen,
  onClose,
  selectedClassIds,
  onConfirm,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGradeFilter, setSelectedGradeFilter] = useState('all');
  const [tempSelectedIds, setTempSelectedIds] = useState<string[]>(selectedClassIds);

  // Sync state on modal open
  React.useEffect(() => {
    if (isOpen) {
      setTempSelectedIds(selectedClassIds);
      setSearchQuery('');
      setSelectedGradeFilter('all');
    }
  }, [isOpen, selectedClassIds]);

  const uniqueGrades = useMemo(() => {
    const set = new Set<string>();
    AVAILABLE_CLASSES_FOR_DISCOUNT.forEach((c) => {
      set.add(c.grade);
    });
    return Array.from(set);
  }, []);

  const gradeOptions: DropdownOption[] = useMemo(() => [
    { value: 'all', label: 'Tất cả các khối' },
    ...uniqueGrades.map((g) => ({ value: g, label: g })),
  ], [uniqueGrades]);

  const filteredClasses = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return AVAILABLE_CLASSES_FOR_DISCOUNT.filter((cls) => {
      const matchGrade = selectedGradeFilter === 'all' || cls.grade === selectedGradeFilter;
      const matchQuery =
        !q ||
        cls.name.toLowerCase().includes(q) ||
        cls.grade.toLowerCase().includes(q);
      return matchGrade && matchQuery;
    });
  }, [searchQuery, selectedGradeFilter]);

  if (!isOpen) return null;

  const isSelected = (classId: string) => {
    return tempSelectedIds.includes(classId);
  };

  const handleToggleClass = (classId: string) => {
    if (isSelected(classId)) {
      setTempSelectedIds((prev) => prev.filter((id) => id !== classId));
    } else {
      setTempSelectedIds((prev) => [...prev, classId]);
    }
  };

  const handleSelectAllFiltered = () => {
    const unselectedFiltered = filteredClasses
      .map((c) => c.id)
      .filter((id) => !tempSelectedIds.includes(id));
    setTempSelectedIds((prev) => [...prev, ...unselectedFiltered]);
  };

  const handleDeselectAllFiltered = () => {
    const filteredIds = new Set(filteredClasses.map((c) => c.id));
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
      title="Chọn lớp học áp dụng"
      description="Tìm kiếm và chỉ định các lớp được hưởng chính sách miễn giảm"
      icon="graduation-cap"
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
              placeholder="Tìm tên lớp, khối lớp..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 px-3 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0070CE]"
            />
          </div>
          <div className="w-full sm:w-48">
            <Dropdown
              value={selectedGradeFilter}
              onChange={(val) => setSelectedGradeFilter(val)}
              options={gradeOptions}
              size="sm"
              fullWidth
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>
            Tìm thấy <strong className="text-slate-700">{filteredClasses.length}</strong> lớp học
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

        {/* Class List */}
        <div className="max-h-[50vh] overflow-y-auto divide-y divide-slate-100">
          {filteredClasses.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-sm">
              Không tìm thấy lớp học phù hợp với điều kiện tìm kiếm.
            </div>
          ) : (
            filteredClasses.map((cls) => {
              const checked = isSelected(cls.id);
              return (
                <div
                  key={cls.id}
                  onClick={() => handleToggleClass(cls.id)}
                  className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-colors ${
                    checked ? 'bg-blue-50/70' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleToggleClass(cls.id)}
                      className="w-4 h-4 rounded text-[#0070CE] focus:ring-[#0070CE] border-slate-300"
                    />
                    <div>
                      <div className="text-xs font-semibold text-slate-800">
                        {cls.name}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {cls.grade} • Sĩ số:{' '}
                        <span className="text-slate-600 font-medium">{cls.studentCount} học sinh</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full font-medium">
                      {cls.studentCount} HS
                    </span>
                    <span className="text-[11px] px-2 py-0.5 bg-blue-50 text-[#0070CE] rounded-full font-medium">
                      {cls.grade}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </PopupModal>
  );
};
