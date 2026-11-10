import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  ExpenseCategory,
  VoucherType,
  BeneficiaryType,
  BeneficiaryOption,
  CreateVoucherFormData,
} from '../../../types/expense';
import {
  calculateLineItemTotal,
  calculateVoucherTotal,
  formatExpenseAmount,
  validateCreateVoucher,
} from '../../../utils/expenseValidation';
import { Dropdown, Icon, SlideOver } from '@/components/ds';

interface CreateExpenseViewProps {
  categories: ExpenseCategory[];
  beneficiaries: BeneficiaryOption[];
  schoolCode: string;
  isOpen?: boolean;
  onClose?: () => void;
  onSubmit: (formData: CreateVoucherFormData, immediateApprove: boolean) => void;
}

interface FormLineItem {
  id: string;
  content: string;
  note: string;
  unitPrice: number;
  quantity: number;
  unit: string;
}

export const CreateExpenseView: React.FC<CreateExpenseViewProps> = ({
  categories,
  beneficiaries,
  schoolCode,
  isOpen = true,
  onClose,
  onSubmit,
}) => {
  const router = useRouter();

  // Form State
  const [title, setTitle] = useState('');
  const [createdDate, setCreatedDate] = useState(
    new Date().toISOString().substring(0, 10)
  );
  const [voucherType, setVoucherType] = useState<VoucherType>('khac');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || 'cat-default');
  const [targetType, setTargetType] = useState<BeneficiaryType>('hoc_sinh');
  const [targetId, setTargetId] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [notes, setNotes] = useState('');

  // Accounting Matrix Rows (BR04)
  const [lineItems, setLineItems] = useState<FormLineItem[]>([
    {
      id: `row-${Date.now()}-1`,
      content: '',
      note: '',
      unitPrice: 0,
      quantity: 1,
      unit: 'lần',
    },
  ]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDirty, setIsDirty] = useState(false);

  // Filter available beneficiaries by targetType
  const filteredBeneficiaries = beneficiaries.filter((b) => b.type === targetType);

  // Handle Target selection
  const handleTargetChange = (selectedId: string) => {
    setTargetId(selectedId);
    setIsDirty(true);
    const selected = beneficiaries.find((b) => b.id === selectedId);
    if (selected) {
      if (targetType === 'hoc_sinh') {
        setRecipientName(selected.defaultRecipientName);
        setRecipientPhone(selected.phone || '');
      } else {
        setRecipientName(selected.name);
        setRecipientPhone(selected.phone || '');
      }
    }
  };

  // Add line item row
  const handleAddRow = () => {
    setLineItems((prev) => [
      ...prev,
      {
        id: `row-${Date.now()}-${prev.length + 1}`,
        content: '',
        note: '',
        unitPrice: 0,
        quantity: 1,
        unit: 'lần',
      },
    ]);
    setIsDirty(true);
  };

  // Remove line item row
  const handleRemoveRow = (index: number) => {
    if (lineItems.length <= 1) return;
    setLineItems((prev) => prev.filter((_, i) => i !== index));
    setIsDirty(true);
  };

  // Update line item field
  const handleLineItemChange = (
    index: number,
    field: keyof FormLineItem,
    value: string | number
  ) => {
    setLineItems((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
      return updated;
    });
    setIsDirty(true);
  };

  // Calculate total amount
  const totalAmount = calculateVoucherTotal(lineItems);

  // Handle Submit
  const handleFormSubmit = (immediateApprove: boolean) => {
    const selectedBeneficiary = beneficiaries.find((b) => b.id === targetId);

    const formData: CreateVoucherFormData = {
      title,
      createdDate,
      voucherType,
      categoryId,
      targetType,
      targetId,
      targetName: selectedBeneficiary ? selectedBeneficiary.name : '',
      targetSubInfo: selectedBeneficiary ? selectedBeneficiary.subInfo : '',
      recipientName,
      recipientPhone,
      notes,
      lineItems: lineItems.map((item) => ({
        content: item.content,
        note: item.note,
        unitPrice: Number(item.unitPrice) || 0,
        quantity: Number(item.quantity) || 1,
        unit: item.unit || 'lần',
      })),
    };

    const validation = validateCreateVoucher(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setErrors({});
    onSubmit(formData, immediateApprove);
    setIsDirty(false);
    if (onClose) {
      onClose();
    } else {
      router.push(`/${schoolCode}/school/expenses`);
    }
  };

  // Cancel / Back with dirty check
  const handleCancel = () => {
    if (isDirty) {
      const confirmed = window.confirm(
        'Thay đổi của bạn chưa được lưu. Vui lòng xác nhận rời khỏi khi chưa lưu!'
      );
      if (!confirmed) return;
    }
    if (onClose) {
      onClose();
    } else {
      router.push(`/${schoolCode}/school/expenses`);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <SlideOver
      open={isOpen}
      onClose={handleCancel}
      title="Tạo phiếu chi mới"
      description="Lập phiếu chi hoàn tiền học phí hoặc chi tiêu nội bộ trường học"
      icon="plus"
      width={780}
      primaryAction={{
        label: 'Lưu & Duyệt chi',
        icon: 'check',
        onClick: () => handleFormSubmit(true),
      }}
      secondaryAction={{
        label: 'Hủy bỏ',
        onClick: handleCancel,
      }}
      extraAction={{
        label: 'Lưu nháp',
        icon: 'save',
        onClick: () => handleFormSubmit(false),
      }}
    >
      <div className="space-y-6">

      {/* Validation Alert */}
      {Object.keys(errors).length > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-rose-800 flex items-start gap-3">
          <Icon name="alert-triangle" size={18} className="text-rose-500 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-rose-900">Vui lòng kiểm tra lại thông tin:</div>
            <ul className="list-disc list-inside text-xs mt-1 space-y-0.5">
              {Object.values(errors).map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Form Sections */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-6">
        <h2 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3">
          1. Thông tin chung
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Tên phiếu chi */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Tên phiếu chi <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setIsDirty(true);
              }}
              placeholder="VD: Hoàn tiền học phí tháng 11/2025 - Em Nguyễn Văn A"
              className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ${
                errors.title ? 'border-rose-400 ring-1 ring-rose-300' : 'border-slate-300'
              }`}
            />
            {errors.title && <p className="text-xs text-rose-500 mt-1">{errors.title}</p>}
          </div>

          {/* Ngày lập */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Ngày lập <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              value={createdDate}
              onChange={(e) => {
                setCreatedDate(e.target.value);
                setIsDirty(true);
              }}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
            />
          </div>

          {/* Danh mục chi phí */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Danh mục chi phí <span className="text-rose-500">*</span>
            </label>
            <Dropdown
              options={categories.map((cat) => ({
                value: cat.id,
                label: cat.name,
                sublabel: cat.isSystemDefault ? 'Mặc định hệ thống' : undefined,
                badge: cat.isSystemDefault ? 'Mặc định' : undefined,
              }))}
              value={categoryId}
              onChange={(val) => {
                setCategoryId(val);
                setIsDirty(true);
              }}
              placeholder="Chọn danh mục chi..."
            />
          </div>

          {/* Loại phiếu chi (BR01) */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Loại phiếu chi <span className="text-rose-500">*</span>
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="voucherType"
                  value="khac"
                  checked={voucherType === 'khac'}
                  onChange={() => {
                    setVoucherType('khac');
                    setIsDirty(true);
                  }}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-slate-800">Khác (Chi mua sắm, phụ cấp...)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="voucherType"
                  value="hoan_tien"
                  checked={voucherType === 'hoan_tien'}
                  onChange={() => {
                    setVoucherType('hoan_tien');
                    setIsDirty(true);
                  }}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-slate-800">Hoàn tiền (Học phí, tiền ăn, xe buýt...)</span>
              </label>
            </div>

            {/* BR01 Helper notice for Hoàn tiền */}
            {voucherType === 'hoan_tien' && (
              <div className="mt-2 p-2.5 rounded-lg bg-blue-50 border border-blue-100 text-xs text-blue-700 flex items-center gap-1.5">
                <Icon name="info" size={13} className="shrink-0" />
                <span>*Phiếu chi sẽ gửi thông báo cho phụ huynh</span>
              </div>
            )}
          </div>
        </div>

        {/* 2. Đối tượng chi */}
        <h2 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3 pt-4">
          2. Đối tượng nhận chi
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Đối tượng (BR02) */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Đối tượng <span className="text-rose-500">*</span>
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="targetType"
                  value="hoc_sinh"
                  checked={targetType === 'hoc_sinh'}
                  onChange={() => {
                    setTargetType('hoc_sinh');
                    setTargetId('');
                    setRecipientName('');
                    setIsDirty(true);
                  }}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-slate-800 flex items-center gap-1.5">
                  <Icon name="graduation-cap" size={13} className="text-amber-500" />
                  <span>Học sinh</span>
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="targetType"
                  value="nhan_vien"
                  checked={targetType === 'nhan_vien'}
                  onChange={() => {
                    setTargetType('nhan_vien');
                    setTargetId('');
                    setRecipientName('');
                    setIsDirty(true);
                  }}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-slate-800 flex items-center gap-1.5">
                  <Icon name="user" size={13} className="text-indigo-500" />
                  <span>Nhân viên / Giáo viên</span>
                </span>
              </label>
            </div>
          </div>

          {/* Chọn Người cụ thể (BR02) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              {targetType === 'hoc_sinh' ? 'Chọn học sinh' : 'Chọn nhân viên'} <span className="text-rose-500">*</span>
            </label>
            <Dropdown
              options={[
                { value: '', label: `-- Chọn ${targetType === 'hoc_sinh' ? 'học sinh' : 'nhân viên'} --` },
                ...filteredBeneficiaries.map((b) => ({
                  value: b.id,
                  label: b.name,
                  sublabel: b.subInfo,
                })),
              ]}
              value={targetId}
              onChange={(val) => handleTargetChange(val)}
              placeholder={`-- Chọn ${targetType === 'hoc_sinh' ? 'học sinh' : 'nhân viên'} --`}
              searchable={filteredBeneficiaries.length > 5}
              searchPlaceholder="Tìm kiếm người nhận..."
              error={errors.targetId}
            />
            {errors.targetId && <p className="text-xs text-rose-500 mt-1">{errors.targetId}</p>}
          </div>

          {/* Người nhận tiền (BR03: required for student) */}
          {targetType === 'hoc_sinh' ? (
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Người nhận tiền (Phụ huynh) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => {
                  setRecipientName(e.target.value);
                  setIsDirty(true);
                }}
                placeholder="VD: Nguyễn Văn Toàn (Ba)"
                className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ${
                  errors.recipientName ? 'border-rose-400 ring-1 ring-rose-300' : 'border-slate-300'
                }`}
              />
              {errors.recipientName && <p className="text-xs text-rose-500 mt-1">{errors.recipientName}</p>}
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Số điện thoại liên hệ
              </label>
              <input
                type="text"
                value={recipientPhone}
                onChange={(e) => {
                  setRecipientPhone(e.target.value);
                  setIsDirty(true);
                }}
                placeholder="VD: 0988 123 456"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              />
            </div>
          )}

          {/* Ghi chú */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Ghi chú nội bộ
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => {
                setNotes(e.target.value);
                setIsDirty(true);
              }}
              placeholder="Nhập ghi chú hoặc căn cứ lập phiếu chi nếu có..."
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* 3. Bảng Hoạch Toán Chi Phí (BR04) */}
        <h2 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3 pt-4 flex items-center justify-between">
          <span>3. Bảng hoạch toán chi phí</span>
          <span className="text-xs text-slate-500 font-normal">
            Thành tiền = Đơn giá × Số lượng
          </span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 tracking-wider">
                <th className="py-2.5 px-3 w-10 text-center">STT</th>
                <th className="py-2.5 px-3 min-w-[220px]">Nội dung chi (*)</th>
                <th className="py-2.5 px-3 min-w-[160px]">Ghi chú</th>
                <th className="py-2.5 px-3 w-36 text-right">Đơn giá (đ) (*)</th>
                <th className="py-2.5 px-3 w-24 text-center">Số lượng (*)</th>
                <th className="py-2.5 px-3 w-28">Đơn vị</th>
                <th className="py-2.5 px-3 w-36 text-right">Thành tiền (đ)</th>
                <th className="py-2.5 px-3 w-12 text-center">Xóa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {lineItems.map((item, index) => {
                const rowTotal = calculateLineItemTotal(item.unitPrice, item.quantity);
                return (
                  <tr key={item.id}>
                    <td className="py-2.5 px-3 text-center text-slate-400">{index + 1}</td>
                    <td className="py-2.5 px-3">
                      <input
                        type="text"
                        value={item.content}
                        onChange={(e) => handleLineItemChange(index, 'content', e.target.value)}
                        placeholder="Nội dung khoản chi"
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      />
                    </td>
                    <td className="py-2.5 px-3">
                      <input
                        type="text"
                        value={item.note}
                        onChange={(e) => handleLineItemChange(index, 'note', e.target.value)}
                        placeholder="Ghi chú thêm"
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none text-slate-600"
                      />
                    </td>
                    <td className="py-2.5 px-3">
                      <input
                        type="number"
                        min="0"
                        value={item.unitPrice || ''}
                        onChange={(e) => handleLineItemChange(index, 'unitPrice', Number(e.target.value) || 0)}
                        placeholder="0"
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-sm text-right focus:ring-1 focus:ring-blue-500 focus:outline-none font-mono"
                      />
                    </td>
                    <td className="py-2.5 px-3">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity || ''}
                        onChange={(e) => handleLineItemChange(index, 'quantity', Number(e.target.value) || 1)}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-sm text-center focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      />
                    </td>
                    <td className="py-2.5 px-3">
                      <input
                        type="text"
                        value={item.unit}
                        onChange={(e) => handleLineItemChange(index, 'unit', e.target.value)}
                        placeholder="lần, tháng..."
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none text-center"
                      />
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900 whitespace-nowrap">
                      {formatExpenseAmount(rowTotal)}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveRow(index)}
                        disabled={lineItems.length <= 1}
                        className={`p-1.5 rounded hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer ${
                          lineItems.length <= 1 ? 'opacity-30 cursor-not-allowed' : ''
                        }`}
                        title="Xóa dòng"
                      >
                        <Icon name="trash" size={13} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={8} className="py-3 px-3">
                  <button
                    type="button"
                    onClick={handleAddRow}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-blue-400 text-[#0070CE] hover:bg-blue-50 text-xs font-semibold transition-all cursor-pointer"
                  >
                    <Icon name="plus" size={13} />
                    <span>Thêm dòng chi phí</span>
                  </button>
                </td>
              </tr>
              <tr className="bg-slate-50/90 border-t-2 border-slate-300">
                <td colSpan={6} className="py-3.5 px-4 text-right font-bold text-slate-800 uppercase text-xs tracking-wider">
                  Tổng tiền chi:
                </td>
                <td className="py-3.5 px-4 text-right font-bold text-lg text-blue-700 whitespace-nowrap">
                  {formatExpenseAmount(totalAmount)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      </div>
    </SlideOver>
  );
};
