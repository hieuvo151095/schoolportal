import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Icon, Dropdown } from '@/components/ds';
import { useAppDispatch, useAppSelector } from '../../../../../store';
import { updateClass } from '../../../../../store/slices/classSlice';
import { addToast } from '../../../../../store/slices/toastSlice';
import { validateClassForm, checkHomeroomConflict } from '../../../../../utils/classValidation';
import { PortalLayout } from '../../../../../components/layout/PortalLayout';
import { MOCK_AVAILABLE_TEACHERS } from '../../../../../services/mockClassData';
import { ClassFormData, ClassInstructorAssignment } from '../../../../../types/class';

const CLUB_CATEGORIES = [
  'Ngoại ngữ & Hội nhập',
  'Thể chất & Thể thao',
  'Năng khiếu & Tư duy',
  'Khoa học & STEM',
  'Kỹ năng sống & Nghệ thuật',
  'Chung',
];

export default function EditClassPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const schoolCode = (router.query.schoolCode as string) || 'demo';
  const classId = router.query.classId as string;

  const { classes, gradeLevels } = useAppSelector((state) => state.class);
  const currentClass = classes.find((c) => c.id === classId);

  const [formData, setFormData] = useState<ClassFormData>({
    name: '',
    code: '',
    taxonomy: 'chinh_khoa',
    gradeLevelId: '',
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

  useEffect(() => {
    if (currentClass) {
      setFormData({
        name: currentClass.name,
        code: currentClass.code,
        taxonomy: currentClass.taxonomy,
        gradeLevelId: currentClass.gradeLevelId || '',
        academicYear: currentClass.academicYear,
        roomNumber: currentClass.roomNumber || '',
        maxCapacity: currentClass.maxCapacity,
        homeroomTeacherId: currentClass.homeroomTeacherId || '',
        instructors: currentClass.instructors || [],
        clubCategory: currentClass.clubCategory || 'Chung',
        meetingSchedule: currentClass.meetingSchedule || '',
        status: currentClass.status,
        notes: currentClass.notes || '',
      });
    }
  }, [currentClass]);

  const handleTeacherChange = (teacherId: string) => {
    setFormData({ ...formData, homeroomTeacherId: teacherId });
    if (formData.taxonomy === 'chinh_khoa' && teacherId) {
      const conflict = checkHomeroomConflict(
        teacherId,
        currentClass?.id,
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
    if (!currentClass) return;
    const result = validateClassForm(formData, classes, currentClass.id);
    if (!result.isValid) {
      setErrors(result.errors);
      return;
    }

    dispatch(updateClass({ id: currentClass.id, data: formData }));
    dispatch(
      addToast({
        type: 'success',
        message: `Đã cập nhật lớp ${formData.name} thành công.`,
      })
    );
    router.push(`/${schoolCode}/school/classes/${currentClass.id}`);
  };

  if (!currentClass) {
    return (
      <PortalLayout>
        <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 m-6">
          <h2 className="text-lg font-bold text-slate-800">Không tìm thấy thông tin lớp học</h2>
          <button
            type="button"
            onClick={() => router.push(`/${schoolCode}/school/classes`)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold"
          >
            Quay lại danh sách
          </button>
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout>
      <Head>
        <title>Chỉnh Sửa {currentClass.name} | SOHA Portal</title>
      </Head>

      <div className="flex flex-col h-full bg-[#F8FAFC]">
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href={`/${schoolCode}/school/classes/${currentClass.id}`}
                className="w-9 h-9 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors shadow-2xs"
                aria-label="Quay lại chi tiết lớp"
              >
                <Icon name="arrow-left" size={14} />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-slate-800">Chỉnh sửa lớp: {currentClass.name}</h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Mã lớp: {currentClass.code} • Năm học: {currentClass.academicYear}
                </p>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {conflictWarning && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                  <Icon name="triangle-exclamation" size={16} className="text-amber-600 mt-0.5 shrink-0" />
                  <div className="text-xs text-amber-800 leading-relaxed font-medium">
                    {conflictWarning}
                  </div>
                </div>
              )}

              {/* Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tên lớp học <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                    className={`w-full px-3 py-2 text-sm bg-slate-50 border rounded-lg font-mono focus:outline-none focus:ring-2 focus:bg-white uppercase transition-all ${
                      errors.code ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-200 focus:ring-blue-500'
                    }`}
                  />
                  {errors.code && <p className="text-xs text-rose-500 mt-1">{errors.code}</p>}
                </div>
              </div>

              {/* Curricular Specifics */}
              {formData.taxonomy === 'chinh_khoa' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Khối lớp <span className="text-rose-500">*</span>
                    </label>
                    <Dropdown
                      value={formData.gradeLevelId}
                      onChange={(val) => setFormData({ ...formData, gradeLevelId: val })}
                      options={[
                        { value: '', label: '-- Chọn khối lớp --' },
                        ...gradeLevels.map((grd) => ({
                          value: grd.id,
                          label: grd.name,
                        })),
                      ]}
                      placeholder="-- Chọn khối lớp --"
                      fullWidth
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Giáo viên chủ nhiệm (GVCN)
                    </label>
                    <Dropdown
                      value={formData.homeroomTeacherId || ''}
                      onChange={(val) => handleTeacherChange(val)}
                      options={[
                        { value: '', label: '-- Chưa chỉ định GVCN --' },
                        ...MOCK_AVAILABLE_TEACHERS.map((t) => ({
                          value: t.id,
                          label: `${t.name} (${t.phone})`,
                        })),
                      ]}
                      placeholder="-- Chưa chỉ định GVCN --"
                      fullWidth
                    />
                  </div>
                </div>
              )}

              {/* Room & Capacity */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phòng học
                  </label>
                  <input
                    type="text"
                    value={formData.roomNumber || ''}
                    onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
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
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Trạng thái hoạt động
                  </label>
                  <Dropdown
                    value={formData.status}
                    onChange={(val) => setFormData({ ...formData, status: val as any })}
                    options={[
                      { value: 'dang_hoat_dong', label: 'Đang hoạt động' },
                      { value: 'tam_dung', label: 'Tạm dừng' },
                      { value: 'da_ket_thuc', label: 'Đã kết thúc' },
                    ]}
                    fullWidth
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ghi chú điều hành
                </label>
                <textarea
                  rows={3}
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              {/* Footer */}
              <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
                <Link
                  href={`/${schoolCode}/school/classes/${currentClass.id}`}
                  className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-semibold transition-colors"
                >
                  Hủy bỏ
                </Link>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-sm font-semibold shadow-sm transition-colors cursor-pointer"
                >
                  <Icon name="check" size={14} />
                  <span>Cập nhật thay đổi</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
