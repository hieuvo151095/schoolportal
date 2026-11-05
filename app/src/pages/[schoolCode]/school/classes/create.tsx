import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faSchool,
  faUsers,
  faCheck,
  faExclamationTriangle,
  faPlus,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch, useAppSelector } from '../../../../store';
import { addClass } from '../../../../store/slices/classSlice';
import { addToast } from '../../../../store/slices/toastSlice';
import { validateClassForm, checkHomeroomConflict } from '../../../../utils/classValidation';
import { PortalLayout } from '../../../../components/layout/PortalLayout';
import { MOCK_AVAILABLE_TEACHERS } from '../../../../services/mockClassData';
import { ClassFormData, ClassInstructorAssignment } from '../../../../types/class';

const CLUB_CATEGORIES = [
  'Ngoại ngữ & Hội nhập',
  'Thể chất & Thể thao',
  'Năng khiếu & Tư duy',
  'Khoa học & STEM',
  'Kỹ năng sống & Nghệ thuật',
  'Chung',
];

export default function CreateClassPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const schoolCode = (router.query.schoolCode as string) || 'demo';

  const { classes, gradeLevels } = useAppSelector((state) => state.class);

  const [formData, setFormData] = useState<ClassFormData>({
    name: '',
    code: '',
    taxonomy: 'chinh_khoa',
    gradeLevelId: gradeLevels.length > 0 ? gradeLevels[0].id : '',
    academicYear: '2025-2026',
    roomNumber: '',
    maxCapacity: 30,
    homeroomTeacherId: '',
    instructors: [],
    clubCategory: 'Chung',
    meetingSchedule: '',
    status: 'dang_hoat_dong',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [conflictWarning, setConflictWarning] = useState<string | null>(null);

  const handleTeacherChange = (teacherId: string) => {
    setFormData({ ...formData, homeroomTeacherId: teacherId });
    if (formData.taxonomy === 'chinh_khoa' && teacherId) {
      const conflict = checkHomeroomConflict(
        teacherId,
        undefined,
        formData.academicYear,
        classes
      );
      if (conflict.hasConflict) {
        const teacherName = MOCK_AVAILABLE_TEACHERS.find((t) => t.id === teacherId)?.name || 'Giáo viên';
        setConflictWarning(
          `Cảnh báo: ${teacherName} hiện đang là GVCN của lớp ${conflict.conflictingClassName} (${conflict.conflictingClassCode}) trong năm học ${formData.academicYear}.`
        );
      } else {
        setConflictWarning(null);
      }
    } else {
      setConflictWarning(null);
    }
  };

  const addInstructor = () => {
    const unselectedTeacher = MOCK_AVAILABLE_TEACHERS.find(
      (t) => !formData.instructors?.some((ins) => ins.teacherId === t.id)
    );
    if (unselectedTeacher) {
      const newInstructor: ClassInstructorAssignment = {
        teacherId: unselectedTeacher.id,
        teacherName: unselectedTeacher.name,
        teacherPhone: unselectedTeacher.phone,
        teacherAvatar: unselectedTeacher.avatar,
        role: 'giao_vien_chinh',
      };
      setFormData({
        ...formData,
        instructors: [...(formData.instructors || []), newInstructor],
      });
    }
  };

  const removeInstructor = (index: number) => {
    const updated = [...(formData.instructors || [])];
    updated.splice(index, 1);
    setFormData({ ...formData, instructors: updated });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateClassForm(formData, classes);
    if (!result.isValid) {
      setErrors(result.errors);
      return;
    }

    dispatch(addClass(formData));
    dispatch(
      addToast({
        type: 'success',
        message: `Đã tạo mới lớp ${formData.name} thành công.`,
      })
    );
    router.push(`/${schoolCode}/school/classes`);
  };

  return (
    <PortalLayout>
      <Head>
        <title>Thêm Lớp Mới | SOHA Portal</title>
      </Head>

      <div className="flex flex-col h-full bg-[#F8FAFC]">
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href={`/${schoolCode}/school/classes`}
                className="w-9 h-9 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors shadow-2xs"
              >
                <FontAwesomeIcon icon={faArrowLeft} />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-slate-800">Thêm lớp học mới</h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Thiết lập cấu hình lớp chính khóa hoặc câu lạc bộ ngoại khóa năm học 2025-2026.
                </p>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Dual Taxonomy Switcher */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                  1. Phân loại lớp học <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, taxonomy: 'chinh_khoa' })}
                    className={`flex items-center justify-center gap-2.5 p-4 rounded-xl border text-sm font-semibold transition-all ${
                      formData.taxonomy === 'chinh_khoa'
                        ? 'border-blue-600 bg-blue-50 text-blue-800 ring-2 ring-blue-500/20 shadow-sm'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <FontAwesomeIcon icon={faSchool} className="text-base" />
                    <span>Lớp chính khóa</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, taxonomy: 'ngoai_khoa' })}
                    className={`flex items-center justify-center gap-2.5 p-4 rounded-xl border text-sm font-semibold transition-all ${
                      formData.taxonomy === 'ngoai_khoa'
                        ? 'border-amber-600 bg-amber-50 text-amber-800 ring-2 ring-amber-500/20 shadow-sm'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <FontAwesomeIcon icon={faUsers} className="text-base" />
                    <span>Lớp ngoại khóa & CLB</span>
                  </button>
                </div>
              </div>

              {/* Conflict Warning */}
              {conflictWarning && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="text-amber-600 text-sm mt-0.5 shrink-0" />
                  <div className="text-xs text-amber-800 leading-relaxed font-medium">
                    {conflictWarning}
                  </div>
                </div>
              )}

              {/* Basic Information */}
              <div>
                <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-3">
                  2. Thông tin cơ bản
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {formData.taxonomy === 'chinh_khoa' ? 'Tên lớp học' : 'Tên CLB / Lớp ngoại khóa'}{' '}
                      <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={formData.taxonomy === 'chinh_khoa' ? 'VD: Lớp Mầm 1' : 'VD: CLB Tiếng Anh Starters'}
                      className={`w-full px-3 py-2 text-sm bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                        errors.name ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-200 focus:ring-blue-500'
                      }`}
                    />
                    {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Mã định danh <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      placeholder="VD: MAM-01"
                      className={`w-full px-3 py-2 text-sm bg-slate-50 border rounded-lg font-mono focus:outline-none focus:ring-2 focus:bg-white uppercase transition-all ${
                        errors.code ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-200 focus:ring-blue-500'
                      }`}
                    />
                    {errors.code && <p className="text-xs text-rose-500 mt-1">{errors.code}</p>}
                  </div>
                </div>
              </div>

              {/* Curricular Specifics */}
              {formData.taxonomy === 'chinh_khoa' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Khối lớp <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.gradeLevelId}
                      onChange={(e) => setFormData({ ...formData, gradeLevelId: e.target.value })}
                      className={`w-full px-3 py-2 text-sm bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                        errors.gradeLevelId ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-200 focus:ring-blue-500'
                      }`}
                    >
                      <option value="">-- Chọn khối lớp --</option>
                      {gradeLevels.map((grd) => (
                        <option key={grd.id} value={grd.id}>
                          {grd.name}
                        </option>
                      ))}
                    </select>
                    {errors.gradeLevelId && <p className="text-xs text-rose-500 mt-1">{errors.gradeLevelId}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Giáo viên chủ nhiệm (GVCN)
                    </label>
                    <select
                      value={formData.homeroomTeacherId || ''}
                      onChange={(e) => handleTeacherChange(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                    >
                      <option value="">-- Chưa chỉ định GVCN --</option>
                      {MOCK_AVAILABLE_TEACHERS.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name} ({t.phone})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Extracurricular Specifics */}
              {formData.taxonomy === 'ngoai_khoa' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Lĩnh vực / Thể loại
                      </label>
                      <select
                        value={formData.clubCategory}
                        onChange={(e) => setFormData({ ...formData, clubCategory: e.target.value })}
                        className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                      >
                        {CLUB_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Lịch sinh hoạt / học tập
                      </label>
                      <input
                        type="text"
                        value={formData.meetingSchedule || ''}
                        onChange={(e) => setFormData({ ...formData, meetingSchedule: e.target.value })}
                        placeholder="VD: Thứ 3, Thứ 5 (16:30 - 17:45)"
                        className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-semibold text-slate-700">
                        Đội ngũ Giáo viên / HLV phụ trách ({formData.instructors?.length || 0})
                      </label>
                      <button
                        type="button"
                        onClick={addInstructor}
                        className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
                      >
                        <FontAwesomeIcon icon={faPlus} className="text-[10px]" />
                        <span>Thêm giáo viên</span>
                      </button>
                    </div>

                    {formData.instructors && formData.instructors.length > 0 ? (
                      <div className="space-y-2 p-1">
                        {formData.instructors.map((ins, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between gap-3 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-800">{ins.teacherName}</span>
                              <span className="text-slate-400">({ins.teacherPhone})</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeInstructor(index)}
                              className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                            >
                              <FontAwesomeIcon icon={faTrash} className="text-xs" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">Chưa chỉ định giáo viên phụ trách cho CLB này.</p>
                    )}
                  </div>
                </div>
              )}

              {/* Room & Capacity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phòng học
                  </label>
                  <input
                    type="text"
                    value={formData.roomNumber || ''}
                    onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                    placeholder="VD: P.102"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Sĩ số tối đa <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={formData.maxCapacity}
                    onChange={(e) => setFormData({ ...formData, maxCapacity: Number(e.target.value) })}
                    className={`w-full px-3 py-2 text-sm bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                      errors.maxCapacity ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-200 focus:ring-blue-500'
                    }`}
                  />
                  {errors.maxCapacity && <p className="text-xs text-rose-500 mt-1">{errors.maxCapacity}</p>}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
                <Link
                  href={`/${schoolCode}/school/classes`}
                  className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-semibold transition-colors"
                >
                  Hủy bỏ
                </Link>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-sm font-semibold shadow-sm transition-colors"
                >
                  <FontAwesomeIcon icon={faCheck} />
                  <span>Lưu lớp học</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
