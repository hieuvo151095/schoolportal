import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Icon } from '@/components/ds';
import { CreatePollPayload, Poll } from '@/types/poll';
import { validatePollPayload } from '@/utils/pollValidation';

interface PollComposerProps {
  initialPoll?: Poll;
  onSubmit: (payload: CreatePollPayload) => void;
  isEditing?: boolean;
}

export const PollComposer: React.FC<PollComposerProps> = ({
  initialPoll,
  onSubmit,
  isEditing = false,
}) => {
  const router = useRouter();
  const { schoolCode } = router.query;
  const currentSchoolCode = (schoolCode as string) || 'demo';

  // Format initial deadline for datetime-local input
  const formatInitialDeadline = (iso?: string) => {
    if (!iso) {
      // Default: 7 days from now at 18:00
      const d = new Date();
      d.setDate(d.getDate() + 7);
      d.setHours(18, 0, 0, 0);
      return d.toISOString().slice(0, 16);
    }
    return new Date(iso).toISOString().slice(0, 16);
  };

  const [title, setTitle] = useState(initialPoll?.title || '');
  const [description, setDescription] = useState(initialPoll?.description || '');
  const [deadline, setDeadline] = useState(formatInitialDeadline(initialPoll?.deadline));
  const [imageUrl, setImageUrl] = useState(initialPoll?.imageUrl || '');
  const [options, setOptions] = useState<string[]>(
    initialPoll?.options.map((o) => o.title) || ['', '']
  );
  const [allowMultipleChoices, setAllowMultipleChoices] = useState(
    initialPoll?.config.allowMultipleChoices || false
  );
  const [allowParentViewResults, setAllowParentViewResults] = useState(
    initialPoll?.config.allowParentViewResults || false
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleAddOption = () => {
    setOptions((prev) => [...prev, '']);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length <= 2) return;
    setOptions((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleOptionChange = (index: number, value: string) => {
    const next = [...options];
    next[index] = value;
    setOptions(next);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: CreatePollPayload = {
      title,
      description,
      deadline: new Date(deadline).toISOString(),
      imageUrl: imageUrl.trim() || undefined,
      options,
      config: {
        allowMultipleChoices,
        allowParentViewResults,
      },
    };

    const validation = validatePollPayload(payload);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    onSubmit(payload);
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Breadcrumb Navigation */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm text-slate-500">
          <Link
            href={`/${currentSchoolCode}/school/poll`}
            className="hover:text-[#0070CE] transition-colors"
          >
            Bình chọn
          </Link>
          <span>/</span>
          <span className="font-semibold text-slate-800">
            {isEditing ? 'Chỉnh sửa bình chọn' : 'Tạo bình chọn'}
          </span>
        </div>

        <Link
          href={`/${currentSchoolCode}/school/poll`}
          className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <Icon name="arrow-left" className="mr-1.5 w-3.5 h-3.5" />
          Quay lại danh sách
        </Link>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card 1: Main Poll Information */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center">
            <Icon name="square-poll-vertical" className="mr-2 w-4 h-4 text-[#0070CE]" />
            Thông tin bình chọn
          </h2>

          {/* Title (Chủ đề*) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Chủ đề bình chọn <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Ví dụ: Khảo sát lựa chọn địa điểm dã ngoại mùa thu 2026..."
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
              }}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm text-slate-900 outline-none transition-all ${
                errors.title
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                  : 'border-slate-200 focus:border-[#0070CE] focus:ring-1 focus:ring-[#0070CE]'
              }`}
            />
            {errors.title && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.title}</p>}
          </div>

          {/* Description (Mô tả) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Mô tả chi tiết
            </label>
            <textarea
              rows={4}
              placeholder="Nhập nội dung mô tả, lý do khảo sát hoặc thông tin hướng dẫn dành cho phụ huynh/học sinh..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#0070CE] focus:ring-1 focus:ring-[#0070CE] text-sm text-slate-900 outline-none transition-all resize-y"
            />
          </div>

          {/* Deadline* (Thời hạn bình chọn*) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Thời hạn bình chọn <span className="text-rose-500">*</span>
            </label>
            <input
              type="datetime-local"
              value={deadline}
              onChange={(e) => {
                setDeadline(e.target.value);
                if (errors.deadline) setErrors((prev) => ({ ...prev, deadline: '' }));
              }}
              className={`w-full max-w-xs px-4 py-2.5 rounded-xl border text-sm text-slate-900 outline-none transition-all ${
                errors.deadline
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                  : 'border-slate-200 focus:border-[#0070CE] focus:ring-1 focus:ring-[#0070CE]'
              }`}
            />
            {errors.deadline && (
              <p className="text-xs text-rose-600 mt-1 font-medium">{errors.deadline}</p>
            )}
            <p className="text-xs text-slate-400 mt-1">
              Hệ thống sẽ tự động đóng bình chọn khi đến thời điểm này.
            </p>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Hình ảnh minh họa (URL)
            </label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#0070CE] focus:ring-1 focus:ring-[#0070CE] text-sm text-slate-900 outline-none transition-all"
            />
          </div>
        </div>

        {/* Card 2: Options (Các lựa chọn*) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Các lựa chọn <span className="text-rose-500">*</span>
              </h2>
              <p className="text-xs text-slate-500">Tối thiểu 2 phương án bình chọn</p>
            </div>
            <button
              type="button"
              onClick={handleAddOption}
              className="inline-flex items-center px-3 py-1.5 rounded-lg bg-blue-50 text-[#0070CE] hover:bg-blue-100 text-xs font-bold transition-colors"
            >
              <Icon name="plus" className="mr-1.5 w-3.5 h-3.5" />
              Thêm phương án
            </button>
          </div>

          {errors.options && (
            <p className="text-xs text-rose-600 font-medium bg-rose-50 p-2.5 rounded-lg border border-rose-100">
              {errors.options}
            </p>
          )}

          <div className="space-y-3">
            {options.map((option, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-500 text-xs font-bold flex items-center justify-center">
                  {idx + 1}
                </span>
                <input
                  type="text"
                  placeholder={`Phương án ${idx + 1}...`}
                  value={option}
                  onChange={(e) => handleOptionChange(idx, e.target.value)}
                  className="flex-1 px-4 py-2 rounded-xl border border-slate-200 focus:border-[#0070CE] focus:ring-1 focus:ring-[#0070CE] text-sm text-slate-900 outline-none"
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(idx)}
                    className="w-8 h-8 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors"
                    title="Xóa lựa chọn này"
                  >
                    <Icon name="trash" className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Card 3: Configuration Toggles (BR04) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            Cấu hình bình chọn
          </h2>

          <div className="space-y-4">
            {/* Toggle 1: allowMultipleChoices */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-800">Chọn nhiều phương án</p>
                <p className="text-xs text-slate-500">
                  Cho phép người dùng tích chọn một hoặc nhiều lựa chọn cùng lúc (dạng checkbox).
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={allowMultipleChoices}
                  onChange={(e) => setAllowMultipleChoices(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0070CE]"></div>
              </label>
            </div>

            {/* Toggle 2: allowParentViewResults */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-4">
              <div>
                <p className="text-sm font-bold text-slate-800">PH được xem kết quả bình chọn</p>
                <p className="text-xs text-slate-500">
                  Hiển thị tỷ lệ phần trăm số phiếu các phương án trên ứng dụng của phụ huynh.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={allowParentViewResults}
                  onChange={(e) => setAllowParentViewResults(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0070CE]"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end space-x-3 pt-2">
          <Link
            href={`/${currentSchoolCode}/school/poll`}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Hủy bỏ
          </Link>
          {(() => {
            const isFormValid =
              title.trim().length > 0 &&
              options.filter((o) => o.trim().length > 0).length >= 2;
            return (
              <button
                type="submit"
                disabled={!isFormValid}
                className={`px-6 py-2.5 rounded-xl text-white text-sm font-bold shadow-md transition-all flex items-center ${
                  isFormValid
                    ? 'bg-[#0070CE] hover:bg-[#005bb5] cursor-pointer'
                    : 'bg-slate-300 cursor-not-allowed'
                }`}
              >
                <Icon name="check" className="mr-2 w-3.5 h-3.5" />
                {isEditing ? 'Lưu thay đổi' : 'Tạo bình chọn'}
              </button>
            );
          })()}
        </div>
      </form>
    </div>
  );
};
export default PollComposer;
