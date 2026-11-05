import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faSchool,
  faUsers,
  faExclamationTriangle,
  faCheck,
  faPlus,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-2xl my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-lg font-bold text-slate-800">
              {mode === 'create' ? 'Thêm lớp học mới' : `Chỉnh sửa lớp: ${initialData?.name}`}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Năm học áp dụng: <span className="font-semibold text-slate-700">{formData.academicYear}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
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
                <FontAwesomeIcon icon={faSchool} className="text-base" />
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
                <FontAwesomeIcon icon={faUsers} className="text-base" />
                <span>Lớp ngoại khóa & CLB</span>
              </button>
            </div>
          </div>

          {/* Conflict Warning Banner (BR03 / K027) */}
          {conflictWarning && (
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-amber-600 text-sm mt-0.5 shrink-0" />
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
                  onChange={(e) => setFormData({ ...formData, homeroomTeacherId: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                >
                  <option value="">-- Chưa chỉ định GVCN --</option>
                  {availableTeachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.phone})
                    </option>
                  ))}
                </select>
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
                    <FontAwesomeIcon icon={faPlus} className="text-[10px]" />
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
                          <select
                            value={ins.role}
                            onChange={(e) =>
                              updateInstructorRole(index, e.target.value as ClassInstructorAssignment['role'])
                            }
                            className="px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-700 focus:outline-none"
                          >
                            <option value="giao_vien_chinh">Giáo viên chính</option>
                            <option value="tro_giang">Trợ giảng</option>
                            <option value="huan_luyen_vien">Huấn luyện viên</option>
                          </select>
                          <button
                            type="button"
                            onClick={() => removeInstructor(index)}
                            className="w-6 h-6 text-slate-400 hover:text-rose-600 transition-colors"
                          >
                            <FontAwesomeIcon icon={faTrash} className="text-xs" />
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
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as ClassItem['status'] })}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              >
                <option value="dang_hoat_dong">Đang hoạt động</option>
                <option value="tam_dung">Tạm dừng</option>
                <option value="da_ket_thuc">Đã kết thúc</option>
              </select>
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

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-semibold transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-sm font-semibold shadow-sm transition-colors"
            >
              <FontAwesomeIcon icon={faCheck} />
              <span>{mode === 'create' ? 'Lưu lớp học' : 'Cập nhật thay đổi'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
