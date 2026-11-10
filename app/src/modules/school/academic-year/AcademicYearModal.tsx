import React, { useState, useEffect } from 'react';
import { AcademicYear, AcademicYearFormData } from '@/types/academicYear';
import { validateAcademicYearForm } from '@/utils/academicYearValidation';
import { PopupModal, Icon } from '@/components/ds';

interface AcademicYearModalProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  initialData?: AcademicYear | null;
  onClose: () => void;
  onSubmit: (formData: AcademicYearFormData) => void;
}

export const AcademicYearModal: React.FC<AcademicYearModalProps> = ({
  isOpen,
  mode,
  initialData,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<AcademicYearFormData>({
    name: '',
    startDate: '',
    endDate: '',
  });

  const [touched, setTouched] = useState<{ [K in keyof AcademicYearFormData]?: boolean }>({});

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialData) {
        setFormData({
          name: initialData.name || '',
          startDate: initialData.startDate || '',
          endDate: initialData.endDate || '',
        });
      } else {
        setFormData({
          name: '',
          startDate: '',
          endDate: '',
        });
      }
      setTouched({});
    }
  }, [isOpen, mode, initialData]);

  if (!isOpen) return null;

  const validationResult = validateAcademicYearForm(formData);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validationResult.isValid) return;
    onSubmit(formData);
  };

  return (
    <PopupModal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Tạo năm học mới' : 'Chỉnh sửa năm học'}
      subtitle="Cấu hình thời gian niên khóa chuẩn áp dụng đồng bộ toàn hệ thống"
      icon="calendar"
      width={520}
      primaryAction={{
        label: mode === 'create' ? 'Thêm' : 'Cập nhật',
        onClick: () => handleSubmit(),
        disabled: !validationResult.isValid,
        icon: 'check',
      }}
      secondaryAction={{
        label: 'Hủy',
        onClick: onClose,
      }}
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        <div>
          <label htmlFor="ay-name" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Tên năm học <span className="text-rose-500">*</span>
          </label>
          <input
            id="ay-name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            onBlur={() => setTouched({ ...touched, name: true })}
            placeholder="VD: Năm học 2026 - 2027 hoặc Kỳ 1 năm học 2026 - 2027"
            className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0070CE]/20 focus:border-[#0070CE]"
            autoFocus
          />
          {touched.name && validationResult.errors.name && (
            <p className="text-xs text-rose-500 mt-1">{validationResult.errors.name}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="ay-start-date" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Ngày bắt đầu <span className="text-rose-500">*</span>
            </label>
            <input
              id="ay-start-date"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              onBlur={() => setTouched({ ...touched, startDate: true })}
              className={`w-full px-3.5 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
                touched.startDate && validationResult.errors.startDate
                  ? 'border-rose-400 focus:ring-rose-200'
                  : 'border-slate-300 focus:ring-[#0070CE]/20 focus:border-[#0070CE]'
              }`}
            />
            {touched.startDate && validationResult.errors.startDate && (
              <p className="text-xs text-rose-500 mt-1">{validationResult.errors.startDate}</p>
            )}
          </div>

          <div>
            <label htmlFor="ay-end-date" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Ngày kết thúc <span className="text-rose-500">*</span>
            </label>
            <input
              id="ay-end-date"
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              onBlur={() => setTouched({ ...touched, endDate: true })}
              className={`w-full px-3.5 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
                touched.endDate && validationResult.errors.endDate
                  ? 'border-rose-400 focus:ring-rose-200'
                  : 'border-slate-300 focus:ring-[#0070CE]/20 focus:border-[#0070CE]'
              }`}
            />
            {touched.endDate && validationResult.errors.endDate && (
              <p className="text-xs text-rose-500 mt-1">{validationResult.errors.endDate}</p>
            )}
          </div>
        </div>
      </form>
    </PopupModal>
  );
};
