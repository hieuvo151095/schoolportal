/**
 * Edit Fee SlideOver Component (Right Drawer)
 * Drawer for editing custom fee items (Name, Default Amount, Unit only)
 * Explicitly omits Xuất HĐĐT per BR04
 * Governance: Marcus Fleet V34 / Constitution V1.0.0
 * References: docs_legacy/operating-portal/tai-chinh/khoan-phi.md (BR04)
 * Design System: [DS] ECO ME DASHBOARD v1.1.0 (SlideOver)
 */

import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import { addToast } from '../../../store/slices/toastSlice';
import { Dropdown, SlideOver, Icon } from '@/components/ds';
import {
  updateFeeItem,
  closeEditModal,
} from '../../../store/slices/schoolFeeSlice';
import {
  FEE_UNIT_OPTIONS,
  validateEditFeeItemInput,
} from '../../../utils/schoolFeeValidation';
import { FeeUnit } from '../../../types/schoolFee';

export const EditFeeModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const editingFee = useAppSelector((state) => state.schoolFee.editingFee);
  const revenueCategories = useAppSelector(
    (state) => state.revenueCategory?.dropdownList || []
  );

  const [name, setName] = useState<string>('');
  const [revenueCategoryId, setRevenueCategoryId] = useState<number | ''>('');
  const [defaultAmount, setDefaultAmount] = useState<string>('');
  const [unit, setUnit] = useState<FeeUnit | ''>('');
  const [description, setDescription] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingFee) {
      setName(editingFee.name);
      setRevenueCategoryId(editingFee.revenue_category_id ?? '');
      setDefaultAmount(
        editingFee.defaultAmount !== undefined
          ? Number(editingFee.defaultAmount).toLocaleString('vi-VN')
          : ''
      );
      setUnit(editingFee.unit || '');
      setDescription(editingFee.description || '');
      setErrors({});
    }
  }, [editingFee]);

  if (!editingFee) {
    return null;
  }

  const handleClose = () => {
    setErrors({});
    dispatch(closeEditModal());
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const numericAmount = parseFloat(defaultAmount.replace(/[^\d]/g, ''));

    const validation = validateEditFeeItemInput({
      name,
      defaultAmount: isNaN(numericAmount) ? (undefined as unknown as number) : numericAmount,
      unit: unit ? (unit as FeeUnit) : undefined,
      description,
    });

    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    const updatedName = name.trim();
    dispatch(
      updateFeeItem({
        id: editingFee.id,
        data: {
          name: updatedName,
          defaultAmount: numericAmount,
          unit: unit ? (unit as FeeUnit) : undefined,
          revenue_category_id: revenueCategoryId ? Number(revenueCategoryId) : null,
          description: description.trim() || undefined,
        },
      })
    );

    dispatch(
      addToast({
        type: 'success',
        message: `Cập nhật khoản phí "${updatedName}" thành công!`,
      })
    );

    handleClose();
  };

  const isFormValid = name.trim().length > 0 && defaultAmount.replace(/[^\d]/g, '').length > 0;

  return (
    <SlideOver
      open={Boolean(editingFee)}
      onClose={handleClose}
      title="Chỉnh sửa khoản phí"
      description="Cập nhật thông tin khoản phí, định mức và đơn vị tính"
      icon="pen"
      width={540}
      primaryAction={{
        label: 'Cập nhật',
        icon: 'check',
        disabled: !isFormValid,
        onClick: () => handleSubmit(),
      }}
      secondaryAction={{
        label: 'Hủy',
        onClick: handleClose,
      }}
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        {/* BR04 Note */}
        <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg flex items-start gap-2.5 text-xs text-blue-800">
          <Icon name="circle-info" size={14} className="text-blue-500 mt-0.5 shrink-0" />
          <p>
            Cấu hình <strong>Xuất HĐĐT</strong> được thay đổi trực tiếp qua dropdown ngay tại cột trong danh sách khoản phí.
          </p>
        </div>

        {/* Tên khoản phí (*) */}
        <div>
          <label className="block text-xs font-semibold text-[var(--text-heading)] mb-1.5">
            Tên khoản phí <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) {
                setErrors((prev) => ({ ...prev, name: '' }));
              }
            }}
            placeholder="Ví dụ: Học STEAM, Kỹ năng sống..."
            className={`w-full px-3.5 py-2.5 bg-[var(--bg-surface)] text-[var(--text-heading)] border rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--eco-primary)] transition ${
              errors.name
                ? 'border-rose-300 ring-1 ring-rose-300 bg-rose-50/30'
                : 'border-[var(--border-default)]'
            }`}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
              <Icon name="circle-exclamation" size={12} />
              {errors.name}
            </p>
          )}
        </div>

        {/* Danh mục thu liên kết */}
        <div>
          <label className="block text-xs font-semibold text-[var(--text-heading)] mb-1.5">
            Danh mục thu (CSDL Sở / Quy định)
          </label>
          <Dropdown
            options={[
              { value: '', label: '-- Chọn danh mục thu liên kết (Tùy chọn) --' },
              ...revenueCategories.map((cat) => ({
                value: String(cat.id),
                label: `[${cat.code}] ${cat.name}`,
                sublabel: `Đơn vị: ${cat.unit}`,
              })),
            ]}
            value={revenueCategoryId !== '' ? String(revenueCategoryId) : ''}
            onChange={(val) => setRevenueCategoryId(val ? Number(val) : '')}
            placeholder="Chọn danh mục thu liên kết..."
            searchable={revenueCategories.length > 5}
            searchPlaceholder="Tìm danh mục thu..."
            fullWidth
          />
          <p className="mt-1 text-[11px] text-[var(--text-subtle)]">
            Liên kết khoản phí với danh mục thu để đồng bộ mã Hóa đơn điện tử và báo cáo thu.
          </p>
        </div>

        {/* Số tiền mặc định (*) & Đơn vị */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-heading)] mb-1.5">
              Số tiền mặc định (VNĐ) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={defaultAmount}
              onChange={(e) => {
                const raw = e.target.value.replace(/[^\d]/g, '');
                setDefaultAmount(raw ? Number(raw).toLocaleString('vi-VN') : '');
                if (errors.defaultAmount) {
                  setErrors((prev) => ({ ...prev, defaultAmount: '' }));
                }
              }}
              placeholder="Ví dụ: 500.000"
              className={`w-full px-3.5 py-2.5 bg-[var(--bg-surface)] text-[var(--text-heading)] border rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--eco-primary)] transition ${
                errors.defaultAmount
                  ? 'border-rose-300 ring-1 ring-rose-300 bg-rose-50/30'
                  : 'border-[var(--border-default)]'
              }`}
            />
            {errors.defaultAmount && (
              <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                <Icon name="circle-exclamation" size={12} />
                {errors.defaultAmount}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-heading)] mb-1.5">
              Đơn vị tính
            </label>
            <Dropdown
              options={[
                { value: '', label: 'Chọn đơn vị...' },
                ...FEE_UNIT_OPTIONS.map((opt) => ({
                  value: opt.value,
                  label: opt.label,
                })),
              ]}
              value={unit}
              onChange={(val) => setUnit((val as FeeUnit) || '')}
              placeholder="Chọn đơn vị..."
              fullWidth
            />
          </div>
        </div>

        {/* Mô tả / Ghi chú */}
        <div>
          <label className="block text-xs font-semibold text-[var(--text-heading)] mb-1.5">
            Mô tả / Ghi chú
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Nhập thông tin chi tiết về khoản phí..."
            className="w-full px-3.5 py-2.5 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--eco-primary)] text-[var(--text-heading)] placeholder-[var(--text-subtle)]"
          />
        </div>
      </form>
    </SlideOver>
  );
};

export const EditFeeSlideOver = EditFeeModal;
export default EditFeeModal;
