import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Icon, Button, IconButton } from '../../../components/ds';
import {
  EventFormData,
  SchoolEventType,
  EVENT_CATEGORY_MAP,
} from '../../../types/calendar';
import { validateEventForm } from '../../../utils/calendarValidation';

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

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newAttachmentName, setNewAttachmentName] = useState<string>('');

  const handleChange = <K extends keyof EventFormData>(field: K, value: EventFormData[K]) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
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

  const handleAddAttachment = () => {
    if (!newAttachmentName.trim()) return;
    setFormData((prev) => ({
      ...prev,
      attachments: [...(prev.attachments || []), newAttachmentName.trim()],
    }));
    setNewAttachmentName('');
  };

  const handleRemoveAttachment = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      attachments: (prev.attachments || []).filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e && e.preventDefault) e.preventDefault();
    const validationErrors = validateEventForm(formData);

    if (validationErrors.length > 0) {
      const errorMap: Record<string, string> = {};
      validationErrors.forEach((err) => {
        errorMap[err.field] = err.message;
      });
      setErrors(errorMap);
      return;
    }

    onSubmit(formData);
  };

  const isSubmitDisabled = !formData.title.trim();

  return (
    <form onSubmit={handleSubmit} className="space-y-6 py-2">
      {/* 1. Tiêu đề sự kiện */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
          Tiêu đề sự kiện <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="VD: Lễ Khai giảng năm học mới, Nghỉ Tết Nguyên Đán..."
          className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0070CE] transition ${
            errors.title
              ? 'border-rose-400 bg-rose-50/30'
              : 'border-slate-300 hover:border-slate-400'
          }`}
        />
        {errors.title && (
          <p className="text-xs text-rose-600 mt-1 font-medium">{errors.title}</p>
        )}
      </div>

      {/* 2. Phân loại sự kiện */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Phân loại sự kiện <span className="text-rose-500">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Ngày nghỉ */}
          <div
            onClick={() => handleChange('category', 'ngay_nghi')}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between select-none ${
              formData.category === 'ngay_nghi'
                ? 'bg-rose-50/50 border-rose-500 ring-1 ring-rose-500 shadow-xs'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
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
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Lịch nghỉ lễ chính thức. Tự động hoàn 100% tiền ăn học sinh trong hóa đơn học phí.
            </p>
          </div>

          {/* Sự kiện nội bộ */}
          <div
            onClick={() => handleChange('category', 'noi_bo')}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between select-none ${
              formData.category === 'noi_bo'
                ? 'bg-teal-50/50 border-teal-500 ring-1 ring-teal-500 shadow-xs'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
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
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Dành riêng cho ban giám hiệu, giáo viên và cán bộ nhân viên nhà trường.
            </p>
          </div>

          {/* Sự kiện có mời phụ huynh */}
          <div
            onClick={() => handleChange('category', 'moi_phu_huynh')}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between select-none ${
              formData.category === 'moi_phu_huynh'
                ? 'bg-amber-50/50 border-amber-500 ring-1 ring-amber-500 shadow-xs'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
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
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Sự kiện chung toàn trường có sự tham gia của quý phụ huynh và học sinh.
            </p>
          </div>
        </div>
        {errors.category && (
          <p className="text-xs text-rose-600 mt-1 font-medium">{errors.category}</p>
        )}
      </div>

      {/* 3. Thời gian & Địa điểm tổ chức */}
      <div className="space-y-4 pt-2">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          Thời gian & Địa điểm tổ chức
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Từ ngày <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => handleChange('startDate', e.target.value)}
              className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0070CE] transition ${
                errors.startDate
                  ? 'border-rose-400 bg-rose-50/30'
                  : 'border-slate-300 hover:border-slate-400'
              }`}
            />
            {errors.startDate && (
              <p className="text-xs text-rose-600 mt-1 font-medium">{errors.startDate}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Đến ngày <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => handleChange('endDate', e.target.value)}
              className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0070CE] transition ${
                errors.endDate
                  ? 'border-rose-400 bg-rose-50/30'
                  : 'border-slate-300 hover:border-slate-400'
              }`}
            />
            {errors.endDate && (
              <p className="text-xs text-rose-600 mt-1 font-medium">{errors.endDate}</p>
            )}
          </div>
        </div>

        {/* Checkbox "Thêm thời gian" */}
        <div className="pt-1">
          <label className="inline-flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={formData.hasSpecificTime}
              onChange={(e) => handleChange('hasSpecificTime', e.target.checked)}
              className="w-4 h-4 text-[#0070CE] rounded border-slate-300 focus:ring-[#0070CE]"
            />
            <span className="text-xs font-bold text-slate-700">
              Thêm thời gian (Giờ bắt đầu & Giờ kết thúc cụ thể)
            </span>
          </label>
          <p className="text-[11px] text-slate-500 ml-6.5 mt-0.5">
            Nếu không chọn, sự kiện sẽ được hiển thị là sự kiện cả ngày.
          </p>

          {formData.hasSpecificTime && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3 ml-6.5 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Giờ bắt đầu (HH:mm) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => handleChange('startTime', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#0070CE]"
                />
                {errors.startTime && (
                  <p className="text-xs text-rose-600 mt-1 font-medium">{errors.startTime}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Giờ kết thúc (HH:mm) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => handleChange('endTime', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#0070CE]"
                />
                {errors.endTime && (
                  <p className="text-xs text-rose-600 mt-1 font-medium">{errors.endTime}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Địa điểm tổ chức */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Địa điểm tổ chức
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              <Icon name="location-dot" size={14} />
            </span>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="VD: Sân trường trung tâm, Hội trường Tầng 3, Toàn trường..."
              className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-slate-300 hover:border-slate-400 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0070CE] transition"
            />
          </div>
        </div>
      </div>

      {/* 4. Ảnh bìa & Nội dung chi tiết */}
      <div className="space-y-4 pt-2">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          Ảnh bìa & Nội dung chi tiết
        </label>

        {/* Cover Image Presets */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Ảnh bìa sự kiện
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-2.5">
            {DEFAULT_COVER_PRESETS.map((presetUrl, idx) => (
              <div
                key={idx}
                onClick={() => handleChange('coverImage', presetUrl)}
                className={`relative h-20 rounded-xl overflow-hidden cursor-pointer border-2 transition-all group ${
                  formData.coverImage === presetUrl
                    ? 'border-[#0070CE] ring-2 ring-[#0070CE]/20 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 opacity-80 hover:opacity-100'
                }`}
              >
                <img
                  src={presetUrl}
                  alt={`Preset ${idx + 1}`}
                  className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                />
                {formData.coverImage === presetUrl && (
                  <span className="absolute top-1.5 right-1.5 w-5 h-5 bg-[#0070CE] text-white rounded-full flex items-center justify-center text-[10px] shadow-sm">
                    <Icon name="check" size={10} />
                  </span>
                )}
              </div>
            ))}
          </div>
          {/* Custom image URL input */}
          <input
            type="url"
            value={formData.coverImage}
            onChange={(e) => handleChange('coverImage', e.target.value)}
            placeholder="Hoặc dán URL ảnh bìa tùy chỉnh (https://...)"
            className="w-full px-3.5 py-2 bg-white border border-slate-300 hover:border-slate-400 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0070CE] transition"
          />
        </div>

        {/* Mô tả sự kiện */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Nội dung mô tả sự kiện
          </label>
          <textarea
            rows={4}
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Nhập thông tin chi tiết về chương trình, lịch trình, lưu ý trang phục và các yêu cầu chuẩn bị..."
            className="w-full px-3.5 py-2.5 bg-white border border-slate-300 hover:border-slate-400 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0070CE] transition resize-y"
          />
        </div>

        {/* Tệp đính kèm */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Tệp đính kèm (Kế hoạch, thông báo PDF, tài liệu hướng dẫn)
          </label>
          <div className="flex items-center gap-2 mb-2">
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <Icon name="paperclip" size={14} />
              </span>
              <input
                type="text"
                value={newAttachmentName}
                onChange={(e) => setNewAttachmentName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddAttachment();
                  }
                }}
                placeholder="Nhập tên tệp (VD: Ke_hoach_khai_giang_2026.pdf)..."
                className="w-full pl-9 pr-3.5 py-2 bg-white border border-slate-300 hover:border-slate-400 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0070CE] transition"
              />
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              icon="plus"
              onClick={handleAddAttachment}
              disabled={!newAttachmentName.trim()}
            >
              Thêm tệp
            </Button>
          </div>

          {/* Attachments list */}
          {formData.attachments && formData.attachments.length > 0 && (
            <div className="space-y-1.5">
              {formData.attachments.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                >
                  <div className="flex items-center gap-2 truncate">
                    <Icon name="paperclip" size={13} className="text-slate-400 shrink-0" />
                    <span className="font-medium text-slate-800 truncate">{file}</span>
                  </div>
                  <IconButton
                    icon="trash"
                    size="sm"
                    label="Xóa tệp đính kèm"
                    onClick={() => handleRemoveAttachment(idx)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {!hideHeader && (
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
          >
            Hủy bỏ
          </Button>
          <Button
            type="submit"
            variant="primary"
            icon="check"
            disabled={isSubmitDisabled}
          >
            {isEdit ? 'Cập nhật sự kiện' : 'Lưu sự kiện'}
          </Button>
        </div>
      )}
    </form>
  );
};

export default EventForm;
