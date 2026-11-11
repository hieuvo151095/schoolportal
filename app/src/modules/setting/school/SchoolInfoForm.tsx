import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSchool,
  faCloudArrowUp,
  faTrashCan,
  faCheck,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  updateSchoolProfile,
  setDirtyInfo,
  openUnsavedLeaveModal,
} from '../../../store/slices/schoolProfileSlice';
import {
  validateSchoolInfoField,
  validateSchoolInfo,
} from '../../../utils/schoolProfileValidation';
import {
  SchoolInfoFormData,
  SchoolInfoValidationErrors,
  NotificationLanguage,
} from '../../../types/schoolProfile';
import { Dropdown } from '@/components/ds';
import { EcoButton, EcoInput } from '../../../components/eco';

interface SchoolInfoFormProps {
  onCancelRequest: () => void;
}

export const SchoolInfoForm: React.FC<SchoolInfoFormProps> = ({ onCancelRequest }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { profile, isDirtyInfo } = useAppSelector((state) => state.schoolProfile);

  const [formData, setFormData] = useState<SchoolInfoFormData>({
    name: profile.name || '',
    shortName: profile.shortName || '',
    address: profile.address || '',
    website: profile.website || '',
    phone: profile.phone || '',
    email: profile.email || '',
    slogan: profile.slogan || '',
    contactInfo: profile.contactInfo || '',
    defaultLanguage: profile.defaultLanguage || 'vi',
    logoUrl: profile.logoUrl || '',
  });

  const [errors, setErrors] = useState<SchoolInfoValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setFormData({
      name: profile.name || '',
      shortName: profile.shortName || '',
      address: profile.address || '',
      website: profile.website || '',
      phone: profile.phone || '',
      email: profile.email || '',
      slogan: profile.slogan || '',
      contactInfo: profile.contactInfo || '',
      defaultLanguage: profile.defaultLanguage || 'vi',
      logoUrl: profile.logoUrl || '',
    });
  }, [profile]);

  const handleChange = (field: keyof SchoolInfoFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    dispatch(setDirtyInfo(true));

    if (touched[field]) {
      const err = validateSchoolInfoField(field, value);
      setErrors((prev) => ({ ...prev, [field]: err }));
    }
  };

  const handleBlur = (field: keyof SchoolInfoFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const err = validateSchoolInfoField(field, formData[field]);
    setErrors((prev) => ({ ...prev, [field]: err }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Mock local preview URL
      const url = URL.createObjectURL(file);
      handleChange('logoUrl', url);
    }
  };

  const handleRemoveLogo = () => {
    handleChange('logoUrl', '');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateSchoolInfo(formData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      setTouched({
        name: true,
        address: true,
        email: true,
      });
      return;
    }

    dispatch(updateSchoolProfile(formData));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-6">
        <div className="pb-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faSchool} className="text-eco-blue text-sm" />
            <h2 className="text-base font-bold text-gray-900">Thông tin trường học</h2>
          </div>
          <span className="text-xs text-gray-400">Các trường đánh dấu (*) là bắt buộc</span>
        </div>

        {/* Logo Upload Zone */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-gray-700">Logo trường</label>
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
              {formData.logoUrl ? (
                <img
                  src={formData.logoUrl}
                  alt="Logo"
                  className="w-full h-full object-contain p-1"
                />
              ) : (
                <FontAwesomeIcon icon={faSchool} className="text-gray-300 text-2xl" />
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <label className="cursor-pointer">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-eco-blue hover:bg-blue-100 transition-colors">
                    <FontAwesomeIcon icon={faCloudArrowUp} />
                    Tải ảnh lên
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
                {formData.logoUrl && (
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <FontAwesomeIcon icon={faTrashCan} />
                    Xóa logo
                  </button>
                )}
              </div>
              <p className="text-[11px] text-gray-400">
                Định dạng PNG, JPG, GIF hoặc SVG (tối đa 2MB). Khuyến nghị tỷ lệ 1:1.
              </p>
            </div>
          </div>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Tên trường * (TR-01) */}
          <div className="space-y-1 sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-700">
              Tên trường <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              onBlur={() => handleBlur('name')}
              placeholder="Nhập tên trường học"
              className={`w-full px-3.5 py-2 text-sm rounded-lg border transition-colors focus:outline-none ${
                errors.name
                  ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                  : 'border-gray-200 focus:border-eco-blue focus:ring-1 focus:ring-eco-blue'
              }`}
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1 font-medium">{errors.name}</p>
            )}
          </div>

          {/* Tên ngắn gọn */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-gray-700">Tên ngắn gọn</label>
            <input
              type="text"
              value={formData.shortName}
              onChange={(e) => handleChange('shortName', e.target.value)}
              placeholder="VD: Ban Mai Kindergarten"
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-gray-200 focus:border-eco-blue focus:ring-1 focus:ring-eco-blue focus:outline-none"
            />
          </div>

          {/* Ngôn ngữ thông báo mặc định */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-gray-700">
              Ngôn ngữ thông báo mặc định
            </label>
            <Dropdown
              placeholder="Chọn ngôn ngữ"
              options={[
                { value: 'vi', label: 'Tiếng Việt (vi)' },
                { value: 'en', label: 'English (en)' },
              ]}
              value={formData.defaultLanguage}
              onChange={(val) =>
                handleChange('defaultLanguage', val as NotificationLanguage)
              }
              fullWidth
              size="md"
            />
          </div>

          {/* Địa chỉ * (TR-01) */}
          <div className="space-y-1 sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-700">
              Địa chỉ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              onBlur={() => handleBlur('address')}
              placeholder="Nhập địa chỉ cơ sở trường học"
              className={`w-full px-3.5 py-2 text-sm rounded-lg border transition-colors focus:outline-none ${
                errors.address
                  ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                  : 'border-gray-200 focus:border-eco-blue focus:ring-1 focus:ring-eco-blue'
              }`}
            />
            {errors.address && (
              <p className="text-xs text-red-500 mt-1 font-medium">{errors.address}</p>
            )}
          </div>

          {/* Email liên hệ * (TR-01) */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-gray-700">
              Email liên hệ <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              placeholder="VD: contact@banmai.edu.vn"
              className={`w-full px-3.5 py-2 text-sm rounded-lg border transition-colors focus:outline-none ${
                errors.email
                  ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                  : 'border-gray-200 focus:border-eco-blue focus:ring-1 focus:ring-eco-blue'
              }`}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1 font-medium">{errors.email}</p>
            )}
          </div>

          {/* Số điện thoại */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-gray-700">Số điện thoại</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="VD: 028 3822 9999"
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-gray-200 focus:border-eco-blue focus:ring-1 focus:ring-eco-blue focus:outline-none"
            />
          </div>

          {/* Website */}
          <div className="space-y-1 sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-700">Website</label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => handleChange('website', e.target.value)}
              placeholder="VD: https://banmai.edu.vn"
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-gray-200 focus:border-eco-blue focus:ring-1 focus:ring-eco-blue focus:outline-none"
            />
          </div>

          {/* Khẩu hiệu (Slogan) */}
          <div className="space-y-1 sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-700">
              Khẩu hiệu (Slogan)
            </label>
            <textarea
              rows={2}
              value={formData.slogan}
              onChange={(e) => handleChange('slogan', e.target.value)}
              placeholder="Nhập khẩu hiệu hoặc phương châm giáo dục của trường"
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-gray-200 focus:border-eco-blue focus:ring-1 focus:ring-eco-blue focus:outline-none resize-none"
            />
          </div>

          {/* Thông tin liên hệ bổ sung */}
          <div className="space-y-1 sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-700">
              Thông tin liên hệ bổ sung
            </label>
            <textarea
              rows={2}
              value={formData.contactInfo}
              onChange={(e) => handleChange('contactInfo', e.target.value)}
              placeholder="VD: Phòng Tuyển sinh & CSKH - Hotline: 0909 123 456"
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-gray-200 focus:border-eco-blue focus:ring-1 focus:ring-eco-blue focus:outline-none resize-none"
            />
          </div>
        </div>

        {/* Submit Actions Bar */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
          <EcoButton type="button" variant="secondary" onClick={onCancelRequest}>
            Hủy bỏ
          </EcoButton>
          <EcoButton type="submit" variant="primary" leadingIcon={<FontAwesomeIcon icon={faCheck} />}>
            Cập nhật
          </EcoButton>
        </div>
      </div>
    </form>
  );
};
