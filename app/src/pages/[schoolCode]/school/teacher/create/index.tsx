import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faUserPlus,
  faCheckCircle,
  faExclamationTriangle,
  faShieldAlt,
  faChalkboardTeacher,
  faBookOpen,
} from '@fortawesome/free-solid-svg-icons';
import { PortalLayout } from '../../../../../components/layout/PortalLayout';
import { useAppDispatch, useAppSelector } from '../../../../../store';
import { addTeacher } from '../../../../../store/slices/teacherSlice';
import { addToast } from '../../../../../store/slices/toastSlice';
import type {
  CreateTeacherPayload,
  TeacherGender,
  TeacherPermissionTier,
  AssignedClassItem,
} from '../../../../../types/teacher';
import {
  validateTeacherCreation,
  checkHomeroomConflict,
} from '../../../../../utils/teacherValidation';

const AVAILABLE_CLASSES = [
  { id: 'lop-1a1', name: 'Lớp 1A1' },
  { id: 'lop-1a2', name: 'Lớp 1A2' },
  { id: 'lop-2a1', name: 'Lớp 2A1' },
  { id: 'lop-nk-ve', name: 'Lớp Vẽ Sáng Tạo' },
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

export default function CreateTeacherPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { schoolCode = 'demo' } = router.query;
  const currentSchoolCode = typeof schoolCode === 'string' ? schoolCode : 'demo';

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
    subjects: ['Toán', 'Tiếng Việt'],
    permissionTier: 'chinh',
  });

  const [educationLevel, setEducationLevel] = useState('Cử nhân Sư phạm Tiểu học');
  const [major, setMajor] = useState('Giáo dục Tiểu học');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Resolution K010: Form Abandonment Protection
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

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

  // Homeroom conflict check (Resolution K006)
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

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
        schoolCode: currentSchoolCode,
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
        joinedDate: new Date().toISOString().split('T')[0],
      })
    );

    dispatch(
      addToast({
        type: 'success',
        title: 'Thêm giáo viên thành công',
        message: `Đã tạo hồ sơ cho giáo viên "${formData.fullName}" thành công!`,
      })
    );

    setIsDirty(false);
    router.push(`/${currentSchoolCode}/school/teacher`);
  };

  const handleCancel = () => {
    if (isDirty) {
      if (
        window.confirm(
          'Bạn có những thay đổi chưa lưu. Bạn có chắc chắn muốn rời khỏi trang này không?'
        )
      ) {
        setIsDirty(false);
        router.push(`/${currentSchoolCode}/school/teacher`);
      }
    } else {
      router.push(`/${currentSchoolCode}/school/teacher`);
    }
  };

  return (
    <PortalLayout schoolCode={currentSchoolCode}>
      <Head>
        <title>Thêm Giáo Viên Mới | Cổng Vận Hành Trường Học</title>
      </Head>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Breadcrumb & Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300 transition-colors shadow-2xs"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="w-3.5 h-3.5" />
            </button>
            <div>
              <div className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                <Link href={`/${currentSchoolCode}/school/teacher`} className="hover:text-[#0070CE]">
                  Giáo viên
                </Link>
                <span>/</span>
                <span className="text-slate-600">Thêm mới</span>
              </div>
              <h1 className="text-xl font-bold text-slate-900 mt-0.5">Tạo hồ sơ giáo viên mới</h1>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Thông tin tài khoản & Bắt buộc (BR03) */}
          <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-slate-800 font-bold text-sm border-b border-slate-100 pb-3">
              <FontAwesomeIcon icon={faUserPlus} className="text-[#0070CE]" />
              <span>Thông tin tài khoản & Định danh cơ bản</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Họ và tên giáo viên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Nguyễn Thị Mai"
                  value={formData.fullName}
                  onChange={(e) => updateField('fullName', e.target.value)}
                  className={`w-full px-3.5 py-2 text-sm bg-white border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#0070CE] transition-colors ${
                    errors.fullName ? 'border-red-400 bg-red-50/30' : 'border-slate-300'
                  }`}
                />
                {errors.fullName && (
                  <p className="text-xs text-red-500 mt-1 font-medium">{errors.fullName}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email đăng nhập <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="tengv@finviet.edu.vn"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  className={`w-full px-3.5 py-2 text-sm bg-white border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#0070CE] transition-colors ${
                    errors.email ? 'border-red-400 bg-red-50/30' : 'border-slate-300'
                  }`}
                />
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1 font-medium">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mật khẩu khởi tạo <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  placeholder="Tối thiểu 6 ký tự"
                  value={formData.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  className={`w-full px-3.5 py-2 text-sm bg-white border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#0070CE] transition-colors ${
                    errors.password ? 'border-red-400 bg-red-50/30' : 'border-slate-300'
                  }`}
                />
                {errors.password && (
                  <p className="text-xs text-red-500 mt-1 font-medium">{errors.password}</p>
                )}
              </div>

              {/* Staff Code */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mã nhân viên (Staff Code)
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: GV-2026-008"
                  value={formData.staffCode}
                  onChange={(e) => updateField('staffCode', e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#0070CE]"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Số điện thoại liên hệ
                </label>
                <input
                  type="tel"
                  placeholder="0912345678"
                  value={formData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#0070CE]"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Giới tính</label>
                <select
                  value={formData.gender}
                  onChange={(e) => updateField('gender', e.target.value as TeacherGender)}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#0070CE]"
                >
                  <option value="nu">Nữ</option>
                  <option value="nam">Nam</option>
                  <option value="khac">Khác</option>
                </select>
              </div>

              {/* DOB */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Ngày sinh</label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => updateField('dob', e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#0070CE]"
                />
              </div>

              {/* CCCD */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Số CCCD / Mã định danh
                </label>
                <input
                  type="text"
                  placeholder="12 chữ số CCCD"
                  value={formData.cccd}
                  onChange={(e) => updateField('cccd', e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#0070CE]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Phân quyền & Vai trò hệ thống (BR01) */}
          <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-slate-800 font-bold text-sm border-b border-slate-100 pb-3">
              <FontAwesomeIcon icon={faShieldAlt} className="text-[#0070CE]" />
              <span>Phân quyền & Kiểm duyệt bài đăng (BR01)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label
                className={`flex items-start gap-3.5 p-4 rounded-xl border-2 transition-all cursor-pointer select-none ${
                  formData.permissionTier === 'chinh'
                    ? 'border-[#0070CE] bg-blue-50/40 shadow-2xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="permissionTier"
                  checked={formData.permissionTier === 'chinh'}
                  onChange={() => updateField('permissionTier', 'chinh')}
                  className="mt-1 text-[#0070CE] focus:ring-[#0070CE]"
                />
                <div>
                  <div className="font-bold text-sm text-slate-800 flex items-center gap-2">
                    <span>Giáo viên chính</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                      Tự động duyệt
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Được quyền tạo bài viết hoạt động, tải ảnh lên thư viện và các nội dung sẽ lập tức
                    hiển thị đến phụ huynh mà không cần qua duyệt.
                  </p>
                </div>
              </label>

              <label
                className={`flex items-start gap-3.5 p-4 rounded-xl border-2 transition-all cursor-pointer select-none ${
                  formData.permissionTier === 'ho_tro'
                    ? 'border-amber-500 bg-amber-50/40 shadow-2xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="permissionTier"
                  checked={formData.permissionTier === 'ho_tro'}
                  onChange={() => updateField('permissionTier', 'ho_tro')}
                  className="mt-1 text-amber-500 focus:ring-amber-500"
                />
                <div>
                  <div className="font-bold text-sm text-slate-800 flex items-center gap-2">
                    <span>Giáo viên hỗ trợ</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                      Kiểm duyệt trước
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Các bài đăng hoạt động tạo bởi giáo viên sẽ được chuyển vào hàng đợi kiểm duyệt
                    (Chờ duyệt) để Giáo viên chính hoặc Ban Giám Hiệu rà soát.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Section 3: Phân công lớp học & Giảng dạy */}
          <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-slate-800 font-bold text-sm border-b border-slate-100 pb-3">
              <FontAwesomeIcon icon={faChalkboardTeacher} className="text-[#0070CE]" />
              <span>Phân công lớp học & Môn giảng dạy</span>
            </div>

            {/* Homeroom Assignment */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Lớp chủ nhiệm
              </label>
              <select
                value={formData.homeroomClassId}
                onChange={(e) => updateField('homeroomClassId', e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#0070CE] font-medium text-slate-800"
              >
                <option value="">-- Chưa phân công chủ nhiệm --</option>
                {AVAILABLE_CLASSES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              {/* Resolution K006: Conflict Warning */}
              {conflict.hasConflict && (
                <div className="mt-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 flex items-start gap-2.5 text-xs">
                  <FontAwesomeIcon
                    icon={faExclamationTriangle}
                    className="w-4 h-4 text-amber-600 mt-0.5 shrink-0"
                  />
                  <div>
                    <span className="font-bold">Cảnh báo trùng lặp:</span> {conflict.warningMessage}
                  </div>
                </div>
              )}
            </div>

            {/* Teaching Classes */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Lớp phụ trách / Giảng dạy bộ môn
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {AVAILABLE_CLASSES.map((c) => {
                  const isChecked = formData.assignedClassIds.includes(c.id);
                  return (
                    <label
                      key={c.id}
                      className={`flex items-center gap-2 p-2.5 rounded-lg border transition-colors cursor-pointer select-none ${
                        isChecked
                          ? 'bg-blue-50/70 border-blue-200 text-blue-900 font-medium'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleAssignedClass(c.id)}
                        className="rounded border-slate-300 text-[#0070CE] focus:ring-[#0070CE]"
                      />
                      <span className="text-xs">{c.name}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Subjects */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Môn học phụ trách
              </label>
              <div className="flex flex-wrap gap-2">
                {SUBJECT_OPTIONS.map((sub) => {
                  const isChecked = formData.subjects.includes(sub);
                  return (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => toggleSubject(sub)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        isChecked
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {sub} {isChecked && '✓'}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 4: Chuyên môn & Ghi chú */}
          <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-slate-800 font-bold text-sm border-b border-slate-100 pb-3">
              <FontAwesomeIcon icon={faBookOpen} className="text-[#0070CE]" />
              <span>Chuyên môn & Ghi chú nội bộ</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Trình độ đào tạo
                </label>
                <input
                  type="text"
                  value={educationLevel}
                  onChange={(e) => {
                    setIsDirty(true);
                    setEducationLevel(e.target.value);
                  }}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#0070CE]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Chuyên ngành
                </label>
                <input
                  type="text"
                  value={major}
                  onChange={(e) => {
                    setIsDirty(true);
                    setMajor(e.target.value);
                  }}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#0070CE]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ghi chú nội bộ
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => {
                    setIsDirty(true);
                    setNotes(e.target.value);
                  }}
                  placeholder="Ghi chú về năng khiếu, kinh nghiệm làm việc hoặc phân công chuyên môn đặc thù..."
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#0070CE]"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleCancel}
              className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-[#0070CE] hover:bg-[#005ba8] rounded-xl transition-colors shadow-xs"
            >
              <FontAwesomeIcon icon={faCheckCircle} className="text-xs" />
              <span>Hoàn tất & Tạo giáo viên</span>
            </button>
          </div>
        </form>
      </div>
    </PortalLayout>
  );
}
