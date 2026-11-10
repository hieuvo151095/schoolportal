import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Icon } from '../../../components/ds';
import {
  EventFormData,
  SchoolEventType,
  EVENT_CATEGORY_MAP,
  EventValidationError,
} from '../../../types/calendar';
import { validateEventForm } from '../../../utils/calendarValidation';
import { UnsavedChangesModal } from './UnsavedChangesModal';

interface EventFormProps {
  schoolCode: string;
  initialData?: Partial<EventFormData>;
  isEdit?: boolean;
  hideHeader?: boolean;
  onCancel?: () => void;
  onSubmit: (data: EventFormData) => void;
}

const DEFAULT_COVER_PRESETS = [
  'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1548625361-125dd1f63bc4?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop',
];

export const EventForm: React.FC<EventFormProps> = ({
  schoolCode,
  initialData,
  isEdit = false,
  hideHeader = false,
  onCancel,
  onSubmit,
}) => {
  const router = useRouter();

  const todayStr = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState<EventFormData>({
    title: initialData?.title || '',
    category: initialData?.category || 'ngay_nghi',
    startDate: initialData?.startDate || todayStr,
    endDate: initialData?.endDate || todayStr,
    hasSpecificTime: initialData?.hasSpecificTime || false,
    startTime: initialData?.startTime || '08:00',
    endTime: initialData?.endTime || '11:30',
    location: initialData?.location || '',
    description: initialData?.description || '',
    coverImage: initialData?.coverImage || DEFAULT_COVER_PRESETS[0],
    attachments: initialData?.attachments || [],
  });

  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [showExitModal, setShowExitModal] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newAttachmentName, setNewAttachmentName] = useState<string>('');

  const handleChange = <K extends keyof EventFormData>(field: K, value: EventFormData[K]) => {
    setIsDirty(true);
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };

      // Auto-sync end date when start date changes if previously matching
      if (field === 'startDate') {
        if (prev.startDate === prev.endDate) {
          updated.endDate = value as string;
        }
      }

      return updated;
    });

    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleBack = () => {
    if (onCancel) {
      onCancel();
      return;
    }
    if (isDirty) {
      setShowExitModal(true);
    } else {
      router.push(`/${schoolCode}/school/calendar`);
    }
  };

  const handleAddAttachment = () => {
    if (!newAttachmentName.trim()) return;
    setIsDirty(true);
    setFormData((prev) => ({
      ...prev,
      attachments: [...(prev.attachments || []), newAttachmentName.trim()],
    }));
    setNewAttachmentName('');
  };

  const handleRemoveAttachment = (idx: number) => {
    setIsDirty(true);
    setFormData((prev) => ({
      ...prev,
      attachments: (prev.attachments || []).filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateEventForm(formData);

    if (validationErrors.length > 0) {
      const errorMap: Record<string, string> = {};
      validationErrors.forEach((err) => {
        errorMap[err.field] = err.message;
      });
      setErrors(errorMap);
      // Scroll to first error
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    onSubmit(formData);
  };

  const isSubmitDisabled = !formData.title.trim();

  return (
    <div className={hideHeader ? 'space-y-4' : 'min-h-screen bg-[#F8FAFC] pb-16'}>
      {/* Top Header */}
      {!hideHeader && (
        <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleBack}
                className="w-9 h-9 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 flex items-center justify-center transition"
                title="Quay lại"
              >
                <Icon name="arrow-left" className="w-4 h-4" />
              </button>
              <div>
                <div className="flex items-center space-x-2 text-xs text-gray-500 mb-0.5">
                  <span>Nhà trường</span>
                  <span>/</span>
                  <Link
                    href={`/${schoolCode}/school/calendar`}
                    className="hover:underline"
                  >
                    Lịch sự kiện
                  </Link>
                  <span>/</span>
                  <span className="text-[#0070CE] font-semibold">
                    {isEdit ? 'Chỉnh sửa sự kiện' : 'Thêm sự kiện mới'}
                  </span>
                </div>
                <h1 className="text-xl font-bold text-gray-900">
                  {isEdit ? 'Chỉnh sửa sự kiện nhà trường' : 'Tạo sự kiện mới cho nhà trường'}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitDisabled}
                className={`inline-flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-semibold shadow-sm transition active:scale-95 ${
                  isSubmitDisabled
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-[#0070CE] hover:bg-[#005bb5] text-white'
                }`}
              >
                <Icon name="check" className="w-4 h-4" />
                <span>{isEdit ? 'Cập nhật sự kiện' : 'Lưu sự kiện'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Form Content */}
      <form onSubmit={handleSubmit} className="mt-6 px-6 space-y-6">
        {/* Card 1: Basic Information & Category */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider pb-3 border-b border-gray-100 flex items-center gap-2">
            <Icon name="calendar-days" className="w-4 h-4 text-[#0070CE]" />
            1. Thông tin chung sự kiện
          </h2>

          {/* Event Title */}
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1.5">
              Tiêu đề sự kiện <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="VD: Lễ Khai giảng năm học mới, Nghỉ Tết Nguyên Đán..."
              className={`w-full px-3.5 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0070CE] bg-white transition ${
                errors.title ? 'border-rose-400 bg-rose-50/30' : 'border-gray-300'
              }`}
            />
            {errors.title && (
              <p className="text-xs text-rose-600 mt-1 font-medium">{errors.title}</p>
            )}
          </div>

          {/* Category Radio Pills (BR02) */}
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-2">
              Phân loại sự kiện <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Ngày nghỉ */}
              <label
                className={`p-3.5 rounded-xl border-2 cursor-pointer transition flex flex-col justify-between ${
                  formData.category === 'ngay_nghi'
                    ? 'border-rose-500 bg-rose-50/50 shadow-xs'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500" />
                    <span className="text-xs font-bold text-rose-800">
                      {EVENT_CATEGORY_MAP.ngay_nghi.label}
                    </span>
                  </div>
                  <input
                    type="radio"
                    name="category"
                    checked={formData.category === 'ngay_nghi'}
                    onChange={() => handleChange('category', 'ngay_nghi')}
                    className="text-rose-600 focus:ring-rose-500"
                  />
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Lịch nghỉ lễ chính thức. Tự động hoàn 100% tiền ăn học sinh trong hóa đơn học phí.
                </p>
              </label>

              {/* Sự kiện nội bộ */}
              <label
                className={`p-3.5 rounded-xl border-2 cursor-pointer transition flex flex-col justify-between ${
                  formData.category === 'noi_bo'
                    ? 'border-teal-500 bg-teal-50/50 shadow-xs'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-teal-500" />
                    <span className="text-xs font-bold text-teal-800">
                      {EVENT_CATEGORY_MAP.noi_bo.label}
                    </span>
                  </div>
                  <input
                    type="radio"
                    name="category"
                    checked={formData.category === 'noi_bo'}
                    onChange={() => handleChange('category', 'noi_bo')}
                    className="text-teal-600 focus:ring-teal-500"
                  />
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Dành riêng cho ban giám hiệu, giáo viên và cán bộ nhân viên nhà trường.
                </p>
              </label>

              {/* Sự kiện có mời phụ huynh */}
              <label
                className={`p-3.5 rounded-xl border-2 cursor-pointer transition flex flex-col justify-between ${
                  formData.category === 'moi_phu_huynh'
                    ? 'border-amber-500 bg-amber-50/50 shadow-xs'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-500" />
                    <span className="text-xs font-bold text-amber-900">
                      {EVENT_CATEGORY_MAP.moi_phu_huynh.label}
                    </span>
                  </div>
                  <input
                    type="radio"
                    name="category"
                    checked={formData.category === 'moi_phu_huynh'}
                    onChange={() => handleChange('category', 'moi_phu_huynh')}
                    className="text-amber-600 focus:ring-amber-500"
                  />
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Sự kiện chung toàn trường có sự tham gia của quý phụ huynh và học sinh.
                </p>
              </label>
            </div>
            {errors.category && (
              <p className="text-xs text-rose-600 mt-1 font-medium">{errors.category}</p>
            )}
          </div>
        </div>

        {/* Card 2: Date & Time Schedule (BR03, BR08) */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider pb-3 border-b border-gray-100 flex items-center gap-2">
            <Icon name="clock" className="w-4 h-4 text-[#0070CE]" />
            2. Thời gian & Địa điểm tổ chức
          </h2>

          {/* Date Range: Start Date & End Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1.5">
                Từ ngày <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleChange('startDate', e.target.value)}
                className={`w-full px-3.5 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0070CE] bg-white transition ${
                  errors.startDate ? 'border-rose-400 bg-rose-50/30' : 'border-gray-300'
                }`}
              />
              {errors.startDate && (
                <p className="text-xs text-rose-600 mt-1 font-medium">{errors.startDate}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1.5">
                Đến ngày <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => handleChange('endDate', e.target.value)}
                className={`w-full px-3.5 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0070CE] bg-white transition ${
                  errors.endDate ? 'border-rose-400 bg-rose-50/30' : 'border-gray-300'
                }`}
              />
              {errors.endDate && (
                <p className="text-xs text-rose-600 mt-1 font-medium">{errors.endDate}</p>
              )}
            </div>
          </div>

          {/* "Thêm thời gian" Checkbox Toggle (BR08) */}
          <div className="pt-2 border-t border-gray-100">
            <label className="inline-flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.hasSpecificTime}
                onChange={(e) => handleChange('hasSpecificTime', e.target.checked)}
                className="w-4 h-4 text-[#0070CE] rounded border-gray-300 focus:ring-[#0070CE]"
              />
              <span className="text-xs font-bold text-gray-800">
                Thêm thời gian (Giờ bắt đầu & Giờ kết thúc cụ thể)
              </span>
            </label>
            <p className="text-[11px] text-gray-500 ml-6 mt-0.5">
              Nếu không chọn, sự kiện sẽ được hiển thị là sự kiện cả ngày.
            </p>

            {/* Time Pickers (Visible when checked) */}
            {formData.hasSpecificTime && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 ml-6 p-4 bg-gray-50 rounded-xl border border-gray-200 animate-fadeIn">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Giờ bắt đầu (HH:mm) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => handleChange('startTime', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#0070CE]"
                  />
                  {errors.startTime && (
                    <p className="text-xs text-rose-600 mt-1 font-medium">{errors.startTime}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Giờ kết thúc (HH:mm) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => handleChange('endTime', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#0070CE]"
                  />
                  {errors.endTime && (
                    <p className="text-xs text-rose-600 mt-1 font-medium">{errors.endTime}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Location input */}
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1.5">
              Địa điểm tổ chức
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                <Icon name="location-dot" className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="VD: Sân trường trung tâm, Hội trường Tầng 3, Toàn trường..."
                className="w-full pl-9 pr-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0070CE] bg-white transition"
              />
            </div>
          </div>
        </div>

        {/* Card 3: Details & Attachments */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider pb-3 border-b border-gray-100 flex items-center gap-2">
            <Icon name="image" className="w-4 h-4 text-[#0070CE]" />
            3. Ảnh bìa & Nội dung chi tiết
          </h2>

          {/* Cover Image Presets */}
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-2">
              Ảnh bìa sự kiện
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
              {DEFAULT_COVER_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleChange('coverImage', preset)}
                  className={`h-24 rounded-xl overflow-hidden border-2 transition relative ${
                    formData.coverImage === preset
                      ? 'border-[#0070CE] ring-2 ring-blue-200'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={preset}
                    alt={`Preset ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {formData.coverImage === preset && (
                    <span className="absolute bottom-1 right-1 bg-[#0070CE] text-white text-[10px] px-1.5 py-0.5 rounded font-bold">
                      Đang chọn
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Description Textarea */}
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1.5">
              Nội dung mô tả chi tiết
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Nhập nội dung, chương trình, thông báo hoặc hướng dẫn chuẩn bị cho sự kiện..."
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0070CE] bg-white transition"
            />
          </div>

          {/* Attachments Dropzone / List */}
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-2">
              Tệp đính kèm (Thông báo, Kế hoạch, Giấy mời...)
            </label>

            {/* Input to add mock attachment */}
            <div className="flex items-center gap-2 mb-3">
              <input
                type="text"
                value={newAttachmentName}
                onChange={(e) => setNewAttachmentName(e.target.value)}
                placeholder="VD: ke_hoach_khai_giang_2026.pdf"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#0070CE]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddAttachment();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddAttachment}
                className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-xs font-semibold transition"
              >
                + Thêm tệp
              </button>
            </div>

            {/* Existing attachments list */}
            {formData.attachments && formData.attachments.length > 0 && (
              <div className="space-y-1.5">
                {formData.attachments.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 bg-gray-50 border border-gray-200 rounded-lg text-xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Icon name="paperclip" className="w-3.5 h-3.5 text-gray-400" />
                      <span className="font-medium text-gray-800 truncate">{file}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveAttachment(idx)}
                      className="text-gray-400 hover:text-rose-600 transition p-1"
                      title="Xóa tệp đính kèm"
                    >
                      <Icon name="trash" className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleBack}
            className="px-5 py-2.5 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            disabled={isSubmitDisabled}
            className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition active:scale-95 ${
              isSubmitDisabled
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-[#0070CE] hover:bg-[#005bb5] text-white'
            }`}
          >
            <Icon name="check" className="w-4 h-4" />
            <span>{isEdit ? 'Cập nhật sự kiện' : 'Lưu sự kiện'}</span>
          </button>
        </div>
      </form>

      {/* Unsaved Changes Confirmation Modal (LS-02) */}
      <UnsavedChangesModal
        isOpen={showExitModal}
        onCancel={() => setShowExitModal(false)}
        onConfirm={() => {
          setShowExitModal(false);
          router.push(`/${schoolCode}/school/calendar`);
        }}
      />
    </div>
  );
};
