import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faFolderPlus,
  faExclamationCircle,
  faImage,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
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
  const [audienceScope, setAudienceScope] = useState<AudienceScope>('current_class');
  const [selectedCover, setSelectedCover] = useState(SAMPLE_COVERS[0]);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100/70 text-[#0070CE] flex items-center justify-center">
              <FontAwesomeIcon icon={faFolderPlus} className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900 font-heading">
              Tạo Album Ảnh Mới
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Title input (BR02) */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Tên album <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError(null);
              }}
              placeholder="VD: Dã ngoại Làng Gốm Bát Tràng, Lễ Khai Giảng..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0070CE] focus:bg-white transition-all text-slate-800"
            />
            {error && (
              <div className="mt-1 flex items-center gap-1.5 text-red-600 font-medium">
                <FontAwesomeIcon icon={faExclamationCircle} className="w-3 h-3" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Description textarea */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Mô tả album (không bắt buộc)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Nhập ghi chú hoặc hoạt động chính trong album này..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0070CE] focus:bg-white transition-all text-slate-800 resize-none"
            />
          </div>

          {/* Audience Scope Dropdown (BR02) */}
          <div>
            <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <FontAwesomeIcon icon={faUsers} className="text-slate-400" />
              <span>Đối tượng hiển thị</span>
            </label>
            <select
              value={audienceScope}
              onChange={(e) => setAudienceScope(e.target.value as AudienceScope)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0070CE] focus:bg-white transition-all text-slate-800 font-medium"
            >
              <option value="current_class">Lớp hiện tại (Lớp 1A1)</option>
              <option value="whole_school">Toàn trường (Tất cả các lớp)</option>
              <option value="custom_classes">Nhiều lớp khác nhau</option>
            </select>
          </div>

          {/* Cover Photo Selection */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <FontAwesomeIcon icon={faImage} className="text-slate-400" />
              <span>Chọn ảnh bìa đại diện</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {SAMPLE_COVERS.map((url, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedCover(url)}
                  className={`aspect-video rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                    selectedCover === url
                      ? 'border-[#0070CE] ring-2 ring-blue-200 scale-98'
                      : 'border-slate-200 hover:border-slate-400 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={url} alt={`Mẫu ${index + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-[#0070CE] hover:bg-[#1A94FF] active:bg-[#005096] rounded-lg shadow-xs transition-all cursor-pointer"
            >
              Tạo album
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
