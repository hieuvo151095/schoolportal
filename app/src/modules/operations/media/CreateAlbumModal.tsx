import React, { useState } from 'react';
import { SlideOver, Icon, Dropdown } from '@/components/ds';
import { AudienceScope } from '../../../types/media';
import { validateAlbumCreation } from '../../../utils/mediaValidation';

interface CreateAlbumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description: string;
    audienceScope: AudienceScope;
    coverPhotoUrl: string;
  }) => void;
}

const SAMPLE_COVERS = [
  'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1588072432836-e10032774350?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80',
];

export const CreateAlbumModal: React.FC<CreateAlbumModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [audienceScope, setAudienceScope] = useState<AudienceScope | ''>('');
  const [selectedCover, setSelectedCover] = useState(SAMPLE_COVERS[0]);
  const [error, setError] = useState<string | null>(null);

  const isFormValid = title.trim().length > 0 && audienceScope !== '';

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!isFormValid || !audienceScope) {
      setError('Vui lòng điền đầy đủ các thông tin bắt buộc.');
      return;
    }

    const validation = validateAlbumCreation(title);
    if (!validation.valid) {
      setError(validation.error || 'Vui lòng nhập tên album.');
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      audienceScope,
      coverPhotoUrl: selectedCover,
    });

    // Reset and close
    setTitle('');
    setDescription('');
    setAudienceScope('');
    setError(null);
    onClose();
  };

  return (
    <SlideOver
      open={isOpen}
      onClose={onClose}
      icon="images"
      title="Tạo album ảnh mới"
      description="Khai báo thông tin album hoạt động, chọn phạm vi hiển thị và ảnh bìa đại diện"
      width={520}
      primaryAction={{
        label: 'Tạo album mới',
        icon: 'plus',
        disabled: !isFormValid,
        onClick: () => handleSubmit(),
      }}
      secondaryAction={{
        label: 'Hủy',
        onClick: onClose,
      }}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Tên album */}
        <div>
          <label className="block text-xs font-semibold text-[var(--text-heading)] mb-1">
            Tên album <span className="text-[var(--text-danger)]">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError(null);
            }}
            placeholder="VD: Dã ngoại Làng Gốm Bát Tràng, Lễ Khai Giảng..."
            className="w-full px-3.5 py-2.5 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[var(--radius-8)] text-sm text-[var(--text-heading)] focus:outline-none focus:border-[var(--eco-blue-strong)] focus:ring-2 focus:ring-[var(--eco-blue-100,#dbeafe)] transition-all placeholder:text-[var(--text-disabled)]"
            autoFocus
          />
          <p className="text-[11px] text-[var(--text-subtle)] mt-1">
            Tên gọi ngắn gọn, rõ ràng để phụ huynh và giáo viên dễ nhận biết.
          </p>
          {error && (
            <div className="mt-1 flex items-center gap-1.5 text-xs text-[var(--text-danger)] font-medium">
              <Icon name="circle-xmark" size={12} />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Đối tượng hiển thị */}
        <div>
          <label className="block text-xs font-semibold text-[var(--text-heading)] mb-1">
            Đối tượng hiển thị <span className="text-[var(--text-danger)]">*</span>
          </label>
          <Dropdown
            options={[
              { value: 'current_class', label: 'Lớp hiện tại (Lớp 1A1)' },
              { value: 'whole_school', label: 'Toàn trường (Tất cả các lớp)' },
              { value: 'custom_classes', label: 'Nhiều lớp khác nhau' },
            ]}
            value={audienceScope}
            onChange={(val) => {
              setAudienceScope(val as AudienceScope);
              if (error) setError(null);
            }}
            placeholder="-- Chọn đối tượng hiển thị --"
            fullWidth
          />
          <p className="text-[11px] text-[var(--text-subtle)] mt-1">
            Xác định nhóm học sinh và phụ huynh có quyền xem album ảnh này.
          </p>
        </div>

        {/* Mô tả album */}
        <div>
          <label className="block text-xs font-semibold text-[var(--text-heading)] mb-1">
            Mô tả album
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Nhập ghi chú tóm tắt về chuyến đi hoặc các hoạt động trải nghiệm..."
            className="w-full px-3.5 py-2.5 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[var(--radius-8)] text-sm text-[var(--text-heading)] focus:outline-none focus:border-[var(--eco-blue-strong)] focus:ring-2 focus:ring-[var(--eco-blue-100,#dbeafe)] transition-all placeholder:text-[var(--text-disabled)] resize-none"
          />
          <p className="text-[11px] text-[var(--text-subtle)] mt-1">
            Ghi chú tóm tắt để phụ huynh nắm rõ bối cảnh hoạt động (không bắt buộc).
          </p>
        </div>

        {/* Ảnh bìa đại diện */}
        <div>
          <label className="block text-xs font-semibold text-[var(--text-heading)] mb-1.5">
            Chọn ảnh bìa đại diện
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {SAMPLE_COVERS.map((url, index) => {
              const isSelected = selectedCover === url;
              return (
                <div
                  key={index}
                  onClick={() => setSelectedCover(url)}
                  className={`relative aspect-video rounded-[var(--radius-8)] overflow-hidden border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-[var(--eco-blue-strong)] ring-2 ring-[var(--eco-blue-100,#dbeafe)] shadow-sm'
                      : 'border-[var(--border-default)] hover:border-[var(--text-subtle)] opacity-75 hover:opacity-100'
                  }`}
                >
                  <img
                    src={url}
                    alt={`Cover ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {isSelected && (
                    <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-[var(--eco-blue-strong)] text-white flex items-center justify-center shadow-xs">
                      <Icon name="check" size={10} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <p className="text-[11px] text-[var(--text-subtle)] mt-1">
            Ảnh bìa sẽ được hiển thị trên danh mục thư viện ảnh của lớp và cổng phụ huynh.
          </p>
        </div>
      </form>
    </SlideOver>
  );
};
