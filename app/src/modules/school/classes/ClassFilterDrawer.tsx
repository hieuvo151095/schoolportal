import React from 'react';
import { Icon, Dropdown, SlideOver } from '@/components/ds';
import { ClassFilterState } from '../../../types/class';

interface ClassFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filterCriteria: ClassFilterState;
  onUpdateFilter: (filter: Partial<ClassFilterState>) => void;
  onResetFilter: () => void;
  availableTeachers: { id: string; name: string; phone: string }[];
}

export const ClassFilterDrawer: React.FC<ClassFilterDrawerProps> = ({
  isOpen,
  onClose,
  filterCriteria,
  onUpdateFilter,
  onResetFilter,
  availableTeachers,
}) => {
  return (
    <SlideOver
      open={isOpen}
      onClose={onClose}
      title="Bộ lọc nâng cao"
      description="Lọc chi tiết danh sách lớp học theo trạng thái, GVCN và khoảng sĩ số"
      icon="filter"
      width={460}
      primaryAction={{
        label: 'Áp dụng',
        icon: 'check',
        onClick: onClose,
      }}
      secondaryAction={{
        label: 'Đặt lại',
        onClick: onResetFilter,
      }}
    >
      <div className="space-y-6">
        {/* Status Filter */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
            Trạng thái hoạt động
          </label>
          <Dropdown
            value={filterCriteria.status || ''}
            onChange={(val) =>
              onUpdateFilter({
                status: val ? (val as ClassFilterState['status']) : undefined,
              })
            }
            options={[
              { value: '', label: 'Tất cả trạng thái' },
              { value: 'dang_hoat_dong', label: 'Đang hoạt động' },
              { value: 'tam_dung', label: 'Tạm dừng' },
              { value: 'da_ket_thuc', label: 'Đã kết thúc' },
            ]}
            fullWidth
          />
        </div>

        {/* Teacher Role Filter */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
            Tình trạng GVCN
          </label>
          <div className="space-y-1.5">
            {[
              { label: 'Tất cả', value: undefined },
              { label: 'Đã phân công GVCN', value: 'co_gvcn' },
              { label: 'Chưa có GVCN', value: 'chua_co_gvcn' },
            ].map((opt, idx) => (
              <label
                key={idx}
                className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 cursor-pointer text-xs font-medium text-slate-700"
              >
                <input
                  type="radio"
                  name="teacherRole"
                  checked={filterCriteria.teacherRole === opt.value}
                  onChange={() =>
                    onUpdateFilter({
                      teacherRole: opt.value as ClassFilterState['teacherRole'],
                    })
                  }
                  className="text-[#0070CE] focus:ring-[#0070CE]"
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Specific Teacher Filter */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
            Giáo viên cụ thể
          </label>
          <Dropdown
            value={filterCriteria.teacherId || ''}
            onChange={(val) =>
              onUpdateFilter({
                teacherId: val ? val : undefined,
              })
            }
            options={[
              { value: '', label: 'Tất cả giáo viên' },
              ...availableTeachers.map((t) => ({
                value: t.id,
                label: t.name,
              })),
            ]}
            fullWidth
          />
        </div>

        {/* CSDL Sở Status Filter */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
            Liên kết CSDL Sở GD&amp;ĐT
          </label>
          <Dropdown
            value={filterCriteria.csdlStatus || ''}
            onChange={(val) =>
              onUpdateFilter({
                csdlStatus: val
                  ? (val as ClassFilterState['csdlStatus'])
                  : undefined,
              })
            }
            options={[
              { value: '', label: 'Tất cả trạng thái liên kết' },
              { value: 'da_lien_ket', label: 'Đã liên kết CSDL Sở' },
              { value: 'chua_lien_ket', label: 'Chưa liên kết' },
            ]}
            fullWidth
          />
        </div>

        {/* Capacity Range */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
            Khoảng sĩ số học sinh
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <input
                type="number"
                min="0"
                placeholder="Từ (VD: 0)"
                value={filterCriteria.capacityMin !== undefined ? filterCriteria.capacityMin : ''}
                onChange={(e) =>
                  onUpdateFilter({
                    capacityMin: e.target.value !== '' ? Number(e.target.value) : undefined,
                  })
                }
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-[#0070CE]"
              />
            </div>
            <div>
              <input
                type="number"
                min="0"
                placeholder="Đến (VD: 35)"
                value={filterCriteria.capacityMax !== undefined ? filterCriteria.capacityMax : ''}
                onChange={(e) =>
                  onUpdateFilter({
                    capacityMax: e.target.value !== '' ? Number(e.target.value) : undefined,
                  })
                }
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-[#0070CE]"
              />
            </div>
          </div>
        </div>
      </div>
    </SlideOver>
  );
};
