import React, { useState, useEffect } from 'react';
import { Icon, Dropdown, SlideOver } from '@/components/ds';
import {
  ClassFormData,
  ClassItem,
  ClassTaxonomy,
  GradeLevel,
  ClassInstructorAssignment,
} from '../../../types/class';
import {
  validateClassForm,
  checkHomeroomConflict,
} from '../../../utils/classValidation';

interface ClassFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ClassFormData) => void;
  mode: 'create' | 'edit';
  initialData?: ClassItem | null;
  gradeLevels: GradeLevel[];
  availableTeachers: { id: string; name: string; phone: string; avatar?: string }[];
  existingClasses: ClassItem[];
}

const CLUB_CATEGORIES = [
  'Ngoại ngữ & Hội nhập',
  'Thể chất & Thể thao',
  'Năng khiếu & Tư duy',
  'Khoa học & STEM',
  'Kỹ năng sống & Nghệ thuật',
  'Chung',
];

export const ClassFormModal: React.FC<ClassFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  mode,
  initialData,
  gradeLevels,
  availableTeachers,
  existingClasses,
}) => {
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
    if (initialData && mode === 'edit') {
      setFormData({
        name: initialData.name,
        code: initialData.code,
        taxonomy: initialData.taxonomy,
        gradeLevelId: initialData.gradeLevelId || '',
        academicYear: initialData.academicYear,
        roomNumber: initialData.roomNumber || '',
        maxCapacity: initialData.maxCapacity,
        homeroomTeacherId: initialData.homeroomTeacherId || '',
        instructors: initialData.instructors || [],
        clubCategory: initialData.clubCategory || 'Chung',
        meetingSchedule: initialData.meetingSchedule || '',
        status: initialData.status,
        notes: initialData.notes || '',
      });
    } else {
      setFormData({
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
    }
    setErrors({});
    setConflictWarning(null);
  }, [initialData, mode, isOpen, gradeLevels]);

  // Realtime homeroom conflict check (BR03 / Resolution K027)
  useEffect(() => {
    if (formData.taxonomy === 'chinh_khoa' && formData.homeroomTeacherId) {
      const conflict = checkHomeroomConflict(
        formData.homeroomTeacherId,
        initialData?.id,
        formData.academicYear,
        existingClasses
      );
      if (conflict.hasConflict) {
        const teacherName = availableTeachers.find((t) => t.id === formData.homeroomTeacherId)?.name || 'Giáo viên';
        setConflictWarning(
          `Cảnh báo: ${teacherName} hiện đang là GVCN của lớp ${conflict.conflictingClassName} (${conflict.conflictingClassCode}) trong năm học ${formData.academicYear}. Bạn có chắc chắn muốn phân công lại?`
        );
      } else {
        setConflictWarning(null);
      }
    } else {
      setConflictWarning(null);
    }
  }, [formData.homeroomTeacherId, formData.taxonomy, formData.academicYear, initialData, existingClasses, availableTeachers]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateClassForm(formData, existingClasses, initialData?.id);
    if (!result.isValid) {
      setErrors(result.errors);
      return;
    }
    onSubmit(formData);
  };

  const addInstructor = () => {
    const unselectedTeacher = availableTeachers.find(
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

  const updateInstructorRole = (index: number, role: ClassInstructorAssignment['role']) => {
    const updated = [...(formData.instructors || [])];
    updated[index] = { ...updated[index], role };
    setFormData({ ...formData, instructors: updated });
  };

  if (!isOpen) return null;

  const isFormValid = Boolean(
    formData.name.trim() &&
    formData.code.trim() &&
    (formData.taxonomy === 'ngoai_khoa' || formData.gradeLevelId)
  );

  return (
    <SlideOver
      open={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Thêm lớp học mới' : `Chỉnh sửa lớp: ${initialData?.name}`}
      description={
        <span>
          Năm học áp dụng: <strong className="text-slate-700">{formData.academicYear}</strong>
        </span>
      }
      icon={mode === 'create' ? 'plus' : 'edit'}
      width={640}
      primaryAction={{
        label: mode === 'create' ? 'Lưu lớp học' : 'Cập nhật thay đổi',
        icon: 'check',
        disabled: !isFormValid,
        onClick: () => {
          const form = document.getElementById('class-form-modal') as HTMLFormElement;
          if (form) form.requestSubmit();
        },
      }}
      secondaryAction={{
        label: 'Hủy',
        onClick: onClose,
      }}
    >
      <form id="class-form-modal" onSubmit={handleSubmit} className="space-y-5">
          {/* Dual Taxonomy Switcher */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
              Phân loại lớp học <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, taxonomy: 'chinh_khoa' })}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-semibold transition-all ${
                  formData.taxonomy === 'chinh_khoa'
                    ? 'border-blue-600 bg-blue-50 text-blue-800 ring-2 ring-blue-500/20 shadow-sm'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon name="school" size={16} />
                <span>Lớp chính khóa</span>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, taxonomy: 'ngoai_khoa' })}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-semibold transition-all ${
                  formData.taxonomy === 'ngoai_khoa'
                    ? 'border-amber-600 bg-amber-50 text-amber-800 ring-2 ring-amber-500/20 shadow-sm'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon name="users" size={16} />
                <span>Lớp ngoại khóa & CLB</span>
              </button>
            </div>
          </div>

          {/* Conflict Warning Banner (BR03 / K027) */}
          {conflictWarning && (
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
              <Icon name="triangle-exclamation" size={16} className="text-amber-600 mt-0.5 shrink-0" />
              <div className="text-xs text-amber-800 leading-relaxed font-medium">
                {conflictWarning}
              </div>
            </div>
          )}

          {/* Row 1: Class Name & Class Code */}
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

          {/* Curricular Fields: Grade Level & Homeroom Teacher */}
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
                {errors.gradeLevelId && <p className="text-xs text-rose-500 mt-1">{errors.gradeLevelId}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Giáo viên chủ nhiệm (GVCN)
                </label>
                <Dropdown
                  value={formData.homeroomTeacherId || ''}
                  onChange={(val) => setFormData({ ...formData, homeroomTeacherId: val })}
                  options={[
                    { value: '', label: '-- Chưa chỉ định GVCN --' },
                    ...availableTeachers.map((t) => ({
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

          {/* Extracurricular Fields: Club Category & Meeting Schedule */}
          {formData.taxonomy === 'ngoai_khoa' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Lĩnh vực / Thể loại
                  </label>
                  <Dropdown
                    value={formData.clubCategory}
                    onChange={(val) => setFormData({ ...formData, clubCategory: val })}
                    options={CLUB_CATEGORIES.map((cat) => ({
                      value: cat,
                      label: cat,
                    }))}
                    placeholder="-- Chọn lĩnh vực --"
                    fullWidth
                  />
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

              {/* Multi-instructor Assignment Section */}
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
                    <Icon name="plus" size={11} />
                    <span>Thêm giáo viên</span>
                  </button>
                </div>

                {formData.instructors && formData.instructors.length > 0 ? (
                  <div className="space-y-2 max-h-36 overflow-y-auto p-1">
                    {formData.instructors.map((ins, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between gap-3 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-800">{ins.teacherName}</span>
                          <span className="text-slate-400">({ins.teacherPhone})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Dropdown
                            value={ins.role}
                            onChange={(val) =>
                              updateInstructorRole(index, val as ClassInstructorAssignment['role'])
                            }
                            options={[
                              { value: 'giao_vien_chinh', label: 'Giáo viên chính' },
                              { value: 'tro_giang', label: 'Trợ giảng' },
                              { value: 'huan_luyen_vien', label: 'Huấn luyện viên' },
                            ]}
                            className="w-40"
                          />
                          <button
                            type="button"
                            onClick={() => removeInstructor(index)}
                            className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-rose-600 transition-colors"
                            aria-label="Xóa giáo viên"
                          >
                            <Icon name="trash" size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">Chưa chỉ định giáo viên phụ trách cho CLB này.</p>
                )}
              </div>
            </div>
          )}

          {/* Row 3: Room Number, Max Capacity, Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Trạng thái
              </label>
              <Dropdown
                value={formData.status}
                onChange={(val) => setFormData({ ...formData, status: val as ClassItem['status'] })}
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
              rows={2}
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Ghi chú thêm về cơ sở vật chất, giáo trình..."
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>

        </form>
    </SlideOver>
  );
};
