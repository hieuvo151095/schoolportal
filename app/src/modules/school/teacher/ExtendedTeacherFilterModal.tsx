import React, { useState, useEffect } from 'react';
import { Icon, SlideOver, Checkbox } from '@/components/ds';
import { useAppDispatch, useAppSelector } from '../../../store';
import { setFilter, resetFilter } from '../../../store/slices/teacherSlice';

interface ExtendedTeacherFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExtendedTeacherFilterModal: React.FC<ExtendedTeacherFilterModalProps> = ({
  isOpen,
  onClose,
}) => {
  const dispatch = useAppDispatch();
  const filter = useAppSelector((state) => state.teacher.filter);

  const [csdlSoOnly, setCsdlSoOnly] = useState(filter.csdlSoOnly);

  useEffect(() => {
    setCsdlSoOnly(filter.csdlSoOnly);
  }, [filter.csdlSoOnly, isOpen]);

  const handleApply = () => {
    dispatch(setFilter({ csdlSoOnly }));
    onClose();
  };

  const handleReset = () => {
    setCsdlSoOnly(false);
    dispatch(resetFilter());
    onClose();
  };

  return (
    <SlideOver
      open={isOpen}
      onClose={onClose}
      title="Bộ lọc nâng cao"
      description="Tùy chọn lọc nâng cao cho danh sách giáo viên & đồng bộ CSDL Sở"
      icon="filter"
      width={460}
      primaryAction={{
        label: 'Áp dụng bộ lọc',
        icon: 'check',
        onClick: handleApply,
      }}
      secondaryAction={{
        label: 'Thiết lập lại',
        onClick: handleReset,
      }}
    >
      <div className="space-y-6">
        {/* CSDL Sở GD&ĐT Criteria (BR09) */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={csdlSoOnly}
              onChange={(e) => setCsdlSoOnly(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-[#0070CE] focus:ring-[#0070CE] border-slate-300"
            />
            <div>
              <span className="text-xs font-bold text-slate-800 block">
                Chỉ hiển thị giáo viên đã liên kết CSDL Sở GD&amp;ĐT
              </span>
              <span className="text-[11px] text-slate-500 block mt-0.5 leading-relaxed">
                Lọc danh sách chỉ giữ lại các cán bộ giáo viên đã được đồng bộ mã định danh ngành chuẩn Sở.
              </span>
            </div>
          </label>
        </div>

        <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-xl flex items-start gap-3">
          <Icon name="circle-info" size={16} className="text-[#0070CE] shrink-0 mt-0.5" />
          <div className="text-xs text-blue-900 leading-relaxed">
            Hệ thống tự động liên kết tài khoản giáo viên với CSDL ngành khi mã CCCD/Định danh cá nhân trùng khớp.
          </div>
        </div>
      </div>
    </SlideOver>
  );
};
