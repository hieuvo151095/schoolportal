import React, { useState } from 'react';
import { SlideOver, Icon, Dropdown } from '@/components/ds';
import { MediaFilterState, MediaFilterType } from '../../../types/media';
import { MOCK_STUDENTS } from '../../../services/mockActivityData';
import { validateStudentFilterSelection } from '../../../utils/mediaValidation';

interface MediaFilterModalProps {
  isOpen: boolean;
  currentFilter: MediaFilterState;
  onClose: () => void;
  onApplyFilter: (filter: MediaFilterState) => void;
}

export const MediaFilterModal: React.FC<MediaFilterModalProps> = ({
  isOpen,
  currentFilter,
  onClose,
  onApplyFilter,
}) => {
  const [filterType, setFilterType] = useState<MediaFilterType>(currentFilter.filterType);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>(
    currentFilter.selectedStudentIds || []
  );
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>(currentFilter.sortBy);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleToggleStudent = (studentId: string) => {
    setError(null);
    if (selectedStudentIds.includes(studentId)) {
      setSelectedStudentIds((prev) => prev.filter((id) => id !== studentId));
    } else {
      if (selectedStudentIds.length >= 5) {
        setError('Vui lòng chọn tối đa 5 học sinh theo quy định hệ thống.');
        return;
      }
      setSelectedStudentIds((prev) => [...prev, studentId]);
    }
  };

  const handleApply = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const validation = validateStudentFilterSelection(selectedStudentIds, filterType);
    if (!validation.valid) {
      setError(validation.error || 'Số lượng học sinh vượt quá giới hạn.');
      return;
    }

    onApplyFilter({
      filterType,
      selectedStudentIds: filterType === 'students' ? selectedStudentIds : [],
      sortBy,
    });
    onClose();
  };

  const handleReset = () => {
    setFilterType('all');
    setSelectedStudentIds([]);
    setSortBy('newest');
    setError(null);
  };

  return (
    <SlideOver
      open={isOpen}
      onClose={onClose}
      icon="filter"
      title="Lọc Mở Rộng Album"
      description="Lọc hiển thị hình ảnh theo học sinh cụ thể hoặc thứ tự thời gian"
      width={480}
      extraAction={{
        label: 'Đặt lại mặc định',
        onClick: handleReset,
      }}
      secondaryAction={{
        label: 'Hủy',
        onClick: onClose,
      }}
      primaryAction={{
        label: 'Áp dụng bộ lọc',
        icon: 'check',
        onClick: () => handleApply(),
      }}
    >
      <form onSubmit={handleApply} className="space-y-4">
        {/* Target Group Radio Selection */}
        <div>
          <label className="block text-xs font-semibold text-[var(--text-heading)] mb-2">
            Đối tượng hiển thị ảnh
          </label>
          <div className="space-y-2">
            <label className="flex items-center gap-2.5 p-2.5 rounded-[var(--radius-8)] border border-[var(--border-default)] hover:bg-[var(--bg-subtle)] cursor-pointer transition-colors">
              <input
                type="radio"
                name="filterType"
                value="all"
                checked={filterType === 'all'}
                onChange={() => {
                  setFilterType('all');
                  setError(null);
                }}
                className="text-[var(--eco-blue-strong)]"
              />
              <span className="text-xs font-semibold text-[var(--text-heading)]">
                Cả lớp (Xem tất cả ảnh)
              </span>
            </label>

            <label className="flex items-center gap-2.5 p-2.5 rounded-[var(--radius-8)] border border-[var(--border-default)] hover:bg-[var(--bg-subtle)] cursor-pointer transition-colors">
              <input
                type="radio"
                name="filterType"
                value="unassigned"
                checked={filterType === 'unassigned'}
                onChange={() => {
                  setFilterType('unassigned');
                  setError(null);
                }}
                className="text-[var(--eco-blue-strong)]"
              />
              <span className="text-xs font-semibold text-[var(--text-heading)]">
                Không gắn thẻ (Ảnh tập thể / Chưa nhận diện)
              </span>
            </label>

            <label className="flex items-center gap-2.5 p-2.5 rounded-[var(--radius-8)] border border-[var(--border-default)] hover:bg-[var(--bg-subtle)] cursor-pointer transition-colors">
              <input
                type="radio"
                name="filterType"
                value="students"
                checked={filterType === 'students'}
                onChange={() => setFilterType('students')}
                className="text-[var(--eco-blue-strong)]"
              />
              <div className="flex-1 flex items-center justify-between">
                <span className="text-xs font-semibold text-[var(--text-heading)]">
                  Học sinh cụ thể (Tối đa 5 em)
                </span>
                {filterType === 'students' && (
                  <span className="text-[10px] font-bold text-[var(--eco-blue-strong)] bg-blue-50 px-2 py-0.5 rounded-full">
                    {selectedStudentIds.length}/5
                  </span>
                )}
              </div>
            </label>
          </div>
        </div>

        {/* Student Picker Checklist (BR06) */}
        {filterType === 'students' && (
          <div className="space-y-2 pt-1">
            <div className="text-[11px] font-bold text-[var(--text-subtle)] uppercase tracking-wider">
              Chọn học sinh cần lọc (tối đa 5 em):
            </div>
            <div className="max-h-48 overflow-y-auto border border-[var(--border-default)] rounded-[var(--radius-8)] divide-y divide-[var(--border-subtle)] bg-[var(--bg-surface)]">
              {MOCK_STUDENTS.map((stu) => {
                const isSelected = selectedStudentIds.includes(stu.id);
                return (
                  <div
                    key={stu.id}
                    onClick={() => handleToggleStudent(stu.id)}
                    className={`flex items-center justify-between p-2.5 cursor-pointer transition-colors ${
                      isSelected ? 'bg-blue-50/80' : 'hover:bg-[var(--bg-subtle)]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={stu.avatarUrl}
                        alt={stu.name}
                        className="w-7 h-7 rounded-full object-cover border border-[var(--border-default)]"
                      />
                      <span className="text-xs font-semibold text-[var(--text-heading)]">
                        {stu.name}
                      </span>
                    </div>
                    <div
                      className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${
                        isSelected
                          ? 'bg-[var(--eco-blue-strong)] border-[var(--eco-blue-strong)] text-white'
                          : 'border-[var(--border-default)] bg-[var(--bg-surface)]'
                      }`}
                    >
                      {isSelected && <Icon name="check" size={10} />}
                    </div>
                  </div>
                );
              })}
            </div>

            {error && (
              <div className="flex items-center gap-1.5 text-xs text-[var(--text-danger)] font-medium">
                <Icon name="circle-xmark" size={12} />
                <span>{error}</span>
              </div>
            )}
          </div>
        )}

        {/* Sort By Selection */}
        <div>
          <label className="block text-xs font-semibold text-[var(--text-heading)] mb-1.5 flex items-center gap-1.5">
            <Icon name="arrow-down-wide-short" size={12} className="text-[var(--text-subtle)]" />
            <span>Sắp xếp ảnh theo</span>
          </label>
          <Dropdown
            options={[
              { value: 'newest', label: 'Theo media mới nhất (Mặc định)' },
              { value: 'oldest', label: 'Theo media cũ nhất' },
            ]}
            value={sortBy}
            onChange={(val) => setSortBy(val as 'newest' | 'oldest')}
            fullWidth
          />
        </div>
      </form>
    </SlideOver>
  );
};

export default MediaFilterModal;
