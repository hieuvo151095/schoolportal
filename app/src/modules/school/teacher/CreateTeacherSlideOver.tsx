/**
 * Create Teacher SlideOver Component (Right Drawer)
 * Replaces full page with modern slide-over drawer
 * Design System: [DS] ECO ME DASHBOARD v1.1.0 (SlideOver)
 */

import React, { useState, useMemo } from 'react';
import { Icon, Dropdown, SlideOver } from '@/components/ds';
import { useAppDispatch, useAppSelector } from '../../../store';
import { addTeacher } from '../../../store/slices/teacherSlice';
import { addToast } from '../../../store/slices/toastSlice';
import type {
  CreateTeacherPayload,
  TeacherGender,
  TeacherPermissionTier,
  AssignedClassItem,
} from '../../../types/teacher';
import {
  validateTeacherCreation,
  checkHomeroomConflict,
} from '../../../utils/teacherValidation';

interface CreateTeacherSlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  schoolCode: string;
}

const AVAILABLE_CLASSES = [
  { id: 'lop-1a1', name: 'Lớp 1A1' },
  { id: 'lop-1a2', name: 'Lớp 1A2' },
  { id: 'lop-2a1', name: 'Lớp 2A1' },
  { id: 'lop-nk-ve', name: 'Lớp Vẽ Sáng Tạo' },
];

const GENDER_OPTIONS = [
  { value: 'nu', label: 'Nữ' },
  { value: 'nam', label: 'Nam' },
  { value: 'khac', label: 'Khác' },
];

const SUBJECT_OPTIONS = [
  'Toán',
  'Tiếng Việt',
  'Tiếng Anh',
  'Khoa học',
  'Tin học',
  'Âm nhạc',
  'Mỹ thuật',
  'Giáo dục Thể chất',
  'Đạo đức',
  'Kỹ năng sống',
];

export const CreateTeacherSlideOver: React.FC<CreateTeacherSlideOverProps> = ({
  isOpen,
  onClose,
  schoolCode,
}) => {
  const dispatch = useAppDispatch();
  const allTeachers = useAppSelector((state) => state.teacher.teachers);

  // Form State
  const [formData, setFormData] = useState<CreateTeacherPayload>({
    fullName: '',
    email: '',
    password: '',
    staffCode: '',
    phone: '',
    gender: 'nu',
    dob: '',
    cccd: '',
    homeroomClassId: '',
    assignedClassIds: [],
    subjects: [],
    permissionTier: 'chinh',
  });

  const [educationLevel, setEducationLevel] = useState('');
  const [major, setMajor] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDirty, setIsDirty] = useState(false);

  const isFormValid = useMemo(() => {
    return (
      formData.fullName.trim() !== '' &&
      formData.email.trim() !== '' &&
      formData.password.trim() !== ''
    );
  }, [formData.fullName, formData.email, formData.password]);

  if (!isOpen) return null;

  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      password: '',
      staffCode: '',
      phone: '',
      gender: 'nu',
      dob: '',
      cccd: '',
      homeroomClassId: '',
      assignedClassIds: [],
      subjects: [],
      permissionTier: 'chinh',
    });
    setEducationLevel('');
    setMajor('');
    setNotes('');
    setErrors({});
    setIsDirty(false);
  };

  const handleClose = () => {
    if (isDirty) {
      const confirmed = window.confirm(
        'Thông tin giáo viên chưa được lưu. Bạn có chắc muốn đóng?'
      );
      if (!confirmed) return;
    }
    resetForm();
    onClose();
  };

  const updateField = <K extends keyof CreateTeacherPayload>(
    key: K,
    value: CreateTeacherPayload[K]
  ) => {
    setIsDirty(true);
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  // Homeroom conflict check
  const targetHomeroomClass = AVAILABLE_CLASSES.find((c) => c.id === formData.homeroomClassId);
  const conflict = checkHomeroomConflict(
    allTeachers,
    'new-teacher',
    formData.homeroomClassId || undefined,
    targetHomeroomClass?.name
  );

  const toggleAssignedClass = (classId: string) => {
    setIsDirty(true);
    setFormData((prev) => ({
      ...prev,
      assignedClassIds: prev.assignedClassIds.includes(classId)
        ? prev.assignedClassIds.filter((id) => id !== classId)
        : [...prev.assignedClassIds, classId],
    }));
  };

  const toggleSubject = (subject: string) => {
    setIsDirty(true);
    setFormData((prev) => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter((s) => s !== subject)
        : [...prev.subjects, subject],
    }));
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const validation = validateTeacherCreation(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      dispatch(
        addToast({
          type: 'error',
          title: 'Thông tin chưa hợp lệ',
          message: 'Vui lòng kiểm tra lại các trường bắt buộc có đánh dấu sao',
        })
      );
      return;
    }

    const assignedClasses: AssignedClassItem[] = formData.assignedClassIds.map((id) => {
      const found = AVAILABLE_CLASSES.find((c) => c.id === id);
      return {
        classId: id,
        className: found ? found.name : id,
      };
    });

    dispatch(
      addTeacher({
        schoolCode,
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        staffCode: formData.staffCode?.trim() || undefined,
        phone: formData.phone?.trim() || undefined,
        gender: formData.gender,
        dob: formData.dob || undefined,
        cccd: formData.cccd?.trim() || undefined,
        homeroomClassId: formData.homeroomClassId || undefined,
        homeroomClassName: targetHomeroomClass?.name,
        assignedClasses,
        subjects: formData.subjects,
        permissionTier: formData.permissionTier,
        status: 'dang_lam_viec',
        educationLevel,
        major,
        notes: notes.trim() || undefined,
      })
    );

    dispatch(
      addToast({
        type: 'success',
        title: 'Tạo tài khoản thành công',
        message: `Đã tạo hồ sơ giáo viên "${formData.fullName.trim()}"`,
      })
    );

    resetForm();
    onClose();
  };

  const homeroomDropdownOptions = [
    { value: '', label: '-- Không phân công chủ nhiệm --' },
    ...AVAILABLE_CLASSES.map((c) => ({ value: c.id, label: c.name })),
  ];

  return (
    <SlideOver
      open={isOpen}
      onClose={handleClose}
      title="Tạo hồ sơ giáo viên mới"
      description="Khai báo thông tin tài khoản, phân quyền kiểm duyệt và phân công giảng dạy"
      icon="user-plus"
      width={720}
      primaryAction={{
        label: 'Lưu giáo viên',
        icon: 'check',
        disabled: !isFormValid,
        onClick: () => handleSubmit(),
      }}
      secondaryAction={{
        label: 'Hủy',
        onClick: handleClose,
      }}
    >
      <form onSubmit={handleSubmit} className="space-y-6 text-sm">
        {/* Card 1: Thông tin tài khoản & Định danh cơ bản */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0070CE] flex items-center justify-center">
              <Icon name="user" size={16} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800">1. Thông tin tài khoản & Định danh cơ bản</h2>
              <p className="text-xs text-slate-500">Các trường đánh dấu (*) là bắt buộc để cấp tài khoản portal</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Họ và tên giáo viên <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => updateField('fullName', e.target.value)}
                placeholder="Ví dụ: Nguyễn Thị Mai"
                className={`w-full px-3.5 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.fullName ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-300 focus:ring-blue-200'
                }`}
              />
              {errors.fullName && <p className="text-xs text-rose-500 mt-1">{errors.fullName}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email đăng nhập <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="tengv@finviet.edu.vn"
                className={`w-full px-3.5 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.email ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-300 focus:ring-blue-200'
                }`}
              />
              {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mật khẩu khởi tạo <span className="text-rose-500">*</span>
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => updateField('password', e.target.value)}
                placeholder="Tối thiểu 6 ký tự"
                className={`w-full px-3.5 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.password ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-300 focus:ring-blue-200'
                }`}
              />
              {errors.password && <p className="text-xs text-rose-500 mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mã nhân viên (Staff Code)
              </label>
              <input
                type="text"
                value={formData.staffCode || ''}
                onChange={(e) => updateField('staffCode', e.target.value)}
                placeholder="Ví dụ: GV-2026-008"
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Số điện thoại liên hệ
              </label>
              <input
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => updateField('phone', e.target.value)}
                placeholder="0912345678"
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Giới tính</label>
              <Dropdown
                options={GENDER_OPTIONS}
                value={formData.gender}
                onChange={(val) => updateField('gender', val as TeacherGender)}
                fullWidth
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Ngày sinh</label>
              <input
                type="date"
                value={formData.dob || ''}
                onChange={(e) => updateField('dob', e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Số CCCD / Mã định danh</label>
              <input
                type="text"
                value={formData.cccd || ''}
                onChange={(e) => updateField('cccd', e.target.value)}
                placeholder="12 chữ số CCCD"
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Phân quyền & Kiểm duyệt bài đăng */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Icon name="shield" size={16} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800">2. Phân quyền & Kiểm duyệt bài đăng</h2>
              <p className="text-xs text-slate-500">Quy định cơ chế duyệt nội dung đăng tải trên Cổng Vận Hành</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label
              className={`p-3.5 rounded-xl border flex flex-col gap-2 cursor-pointer transition-all ${
                formData.permissionTier === 'chinh'
                  ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20 shadow-xs'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="permissionTier"
                    checked={formData.permissionTier === 'chinh'}
                    onChange={() => updateField('permissionTier', 'chinh')}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="font-bold text-slate-800 text-xs">Giáo viên chính</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-700">
                  Tự động duyệt
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Được quyền tạo bài viết hoạt động, tải ảnh lên thư viện và các nội dung sẽ lập tức hiển thị đến phụ huynh mà không cần qua duyệt.
              </p>
            </label>

            <label
              className={`p-3.5 rounded-xl border flex flex-col gap-2 cursor-pointer transition-all ${
                formData.permissionTier === 'ho_tro'
                  ? 'border-amber-600 bg-amber-50/50 ring-2 ring-amber-500/20 shadow-xs'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="permissionTier"
                    checked={formData.permissionTier === 'ho_tro'}
                    onChange={() => updateField('permissionTier', 'ho_tro')}
                    className="w-4 h-4 text-amber-600"
                  />
                  <span className="font-bold text-slate-800 text-xs">Giáo viên hỗ trợ</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-700">
                  Kiểm duyệt trước
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Các bài đăng hoạt động tạo bởi giáo viên sẽ được chuyển vào hàng đợi kiểm duyệt (Chờ duyệt) để Giáo viên chính hoặc Ban Giám Hiệu rà soát.
              </p>
            </label>
          </div>
        </div>

        {/* Card 3: Phân công lớp học & Môn giảng dạy */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Icon name="chalkboard-user" size={16} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800">3. Phân công lớp học & Môn giảng dạy</h2>
              <p className="text-xs text-slate-500">Thiết lập lớp chủ nhiệm và các lớp phụ trách giảng dạy</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Lớp chủ nhiệm</label>
            <Dropdown
              options={homeroomDropdownOptions}
              value={formData.homeroomClassId || ''}
              onChange={(val) => updateField('homeroomClassId', val)}
              placeholder="-- Chọn lớp chủ nhiệm --"
              fullWidth
            />
            {conflict.hasConflict && (
              <div className="mt-2 p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-start gap-2">
                <Icon name="triangle-exclamation" size={14} className="text-amber-600 mt-0.5 shrink-0" />
                <span>{conflict.warningMessage}</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Các lớp phụ trách giảng dạy ({formData.assignedClassIds.length} lớp đã chọn)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {AVAILABLE_CLASSES.map((cls) => {
                const isSelected = formData.assignedClassIds.includes(cls.id);
                return (
                  <button
                    key={cls.id}
                    type="button"
                    onClick={() => toggleAssignedClass(cls.id)}
                    className={`p-2.5 rounded-lg border text-left flex items-center justify-between text-xs font-semibold transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{cls.name}</span>
                    {isSelected && <Icon name="check" size={12} className="text-blue-600" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Môn học phụ trách ({formData.subjects.length} môn đã chọn)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {SUBJECT_OPTIONS.map((sub) => {
                const isSelected = formData.subjects.includes(sub);
                return (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => toggleSubject(sub)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      isSelected
                        ? 'bg-[#0070CE] text-white border-[#0070CE]'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {sub}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </form>
    </SlideOver>
  );
};
