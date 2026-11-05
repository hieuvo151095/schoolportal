import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faBookOpen,
  faTableList,
  faChalkboardTeacher,
  faUserPlus,
  faUserMinus,
  faCheck,
  faLock,
  faInfoCircle,
  faPhone,
  faEnvelope
} from '@fortawesome/free-solid-svg-icons';
import type { SchoolSubject, SubjectTeacherAssignment } from '@/types/subject';
import {
  formatClassification,
  formatSubjectType,
  formatEvaluationType,
  getStageName
} from '@/utils/subjectValidation';

interface SubjectDetailDrawerProps {
  isOpen: boolean;
  subject: SchoolSubject | null;
  onClose: () => void;
  onOpenAssignTeacher: (subjectId: string) => void;
  onOpenUnassignTeacher: (
    subjectId: string,
    subjectName: string,
    teacher: SubjectTeacherAssignment
  ) => void;
}

export const SubjectDetailDrawer: React.FC<SubjectDetailDrawerProps> = ({
  isOpen,
  subject,
  onClose,
  onOpenAssignTeacher,
  onOpenUnassignTeacher
}) => {
  if (!isOpen || !subject) return null;

  const classification = formatClassification(subject.classification);
  const subjectType = formatSubjectType(subject.type);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-fadeIn"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-white shadow-2xl flex flex-col animate-slideLeft">
          {/* Header */}
          <div className="p-5 bg-gradient-to-r from-blue-50/80 to-slate-50 border-b border-slate-200 flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0070CE] text-white flex items-center justify-center shrink-0 shadow-xs font-bold text-sm">
                <FontAwesomeIcon icon={faBookOpen} className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-bold text-slate-900">{subject.name}</h3>
                  <span className="font-mono text-xs font-bold px-2 py-0.5 bg-slate-200 text-slate-800 rounded">
                    {subject.code}
                  </span>
                  {subject.isStandardMoET && (
                    <span className="text-[10px] font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full border border-blue-200">
                      Chuẩn Bộ GD&ĐT
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Cấp học: <strong className="text-slate-700">{getStageName(subject.stage)}</strong> • Năm học: <strong className="text-slate-700">{subject.academicYear}</strong>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-lg transition-colors cursor-pointer"
            >
              <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {/* Section 1: Thông tin cấu hình chung */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#0070CE]"></span>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Thông tin cấu hình môn học
                </h4>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                <div>
                  <span className="text-[11px] text-slate-400 block mb-0.5">Phân loại môn</span>
                  <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold border ${classification.badgeClass}`}>
                    {classification.label}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] text-slate-400 block mb-0.5">Loại môn học</span>
                  <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold border ${subjectType.badgeClass}`}>
                    {subjectType.label}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] text-slate-400 block mb-0.5">Tính ĐTB tổng kết</span>
                  {subject.isCountedForGPA ? (
                    <span className="inline-flex items-center gap-1 font-bold text-emerald-700">
                      <FontAwesomeIcon icon={faCheck} className="w-3 h-3" />
                      Có tính điểm ĐTB
                    </span>
                  ) : (
                    <span className="text-slate-500 font-medium">Không tính điểm ĐTB</span>
                  )}
                </div>

                <div>
                  <span className="text-[11px] text-slate-400 block mb-0.5">Khối lớp áp dụng</span>
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {subject.applicableGrades.map((g) => (
                      <span key={g} className="px-1.5 py-0.5 bg-white border border-slate-200 text-slate-700 text-[10px] font-medium rounded">
                        {g}
                      </span>
                    ))}
                  </div>
                </div>

                {subject.description && (
                  <div className="col-span-2 pt-2 border-t border-slate-200/60">
                    <span className="text-[11px] text-slate-400 block mb-0.5">Mô tả chương trình</span>
                    <p className="text-slate-600 text-xs leading-relaxed">{subject.description}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Section 2: Phương thức đánh giá 4 kỳ (BR08, K031) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Phương thức đánh giá theo từng kỳ
                  </h4>
                </div>
                <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                  <FontAwesomeIcon icon={faLock} className="w-2.5 h-2.5" />
                  Chỉ đọc (Quy định Bộ GD&ĐT)
                </span>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">Kỳ đánh giá</th>
                      <th className="py-2.5 px-3">Thời điểm</th>
                      <th className="py-2.5 px-3 text-right">Phương thức đánh giá</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">Học kỳ 1</td>
                      <td className="py-2.5 px-3 text-slate-500">Giữa Kỳ 1</td>
                      <td className="py-2.5 px-3 text-right">
                        <span className="font-bold text-[#0070CE] bg-blue-50 px-2 py-0.5 rounded border border-blue-200 text-[11px]">
                          {formatEvaluationType(subject.evaluationMatrix.term1_mid)}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">Học kỳ 1</td>
                      <td className="py-2.5 px-3 text-slate-500">Cuối Kỳ 1</td>
                      <td className="py-2.5 px-3 text-right">
                        <span className="font-bold text-[#0070CE] bg-blue-50 px-2 py-0.5 rounded border border-blue-200 text-[11px]">
                          {formatEvaluationType(subject.evaluationMatrix.term1_end)}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">Học kỳ 2</td>
                      <td className="py-2.5 px-3 text-slate-500">Giữa Kỳ 2</td>
                      <td className="py-2.5 px-3 text-right">
                        <span className="font-bold text-[#0070CE] bg-blue-50 px-2 py-0.5 rounded border border-blue-200 text-[11px]">
                          {formatEvaluationType(subject.evaluationMatrix.term2_mid)}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">Học kỳ 2</td>
                      <td className="py-2.5 px-3 text-slate-500">Cuối Kỳ 2</td>
                      <td className="py-2.5 px-3 text-right">
                        <span className="font-bold text-[#0070CE] bg-blue-50 px-2 py-0.5 rounded border border-blue-200 text-[11px]">
                          {formatEvaluationType(subject.evaluationMatrix.term2_end)}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100 flex items-start gap-2 text-[11px] text-blue-900">
                <FontAwesomeIcon icon={faInfoCircle} className="w-3.5 h-3.5 text-[#0070CE] mt-0.5 shrink-0" />
                <span>
                  Ma trận đánh giá được tiêu thụ tự động bởi module <strong>Điểm & Đánh Giá</strong> và <strong>Thời Khóa Biểu</strong> để thiết lập cột điểm, thang điểm và phiếu liên lạc.
                </span>
              </div>
            </div>

            {/* Section 3: Quản lý giáo viên giảng dạy (BR07, BR09, BR10) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Giáo viên giảng dạy ({subject.assignedTeachers.length})
                  </h4>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenAssignTeacher(subject.id)}
                  className="px-3 py-1.5 text-xs font-bold text-white bg-[#0070CE] hover:bg-[#005bb5] active:scale-95 rounded-lg shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <FontAwesomeIcon icon={faUserPlus} className="w-3 h-3" />
                  <span>Phân công thêm GV</span>
                </button>
              </div>

              {subject.assignedTeachers.length > 0 ? (
                <div className="space-y-2">
                  {subject.assignedTeachers.map((teacher) => (
                    <div
                      key={teacher.teacherId}
                      className="p-3 bg-slate-50 hover:bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-3 transition-colors shadow-2xs group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {teacher.avatarUrl ? (
                          <img
                            src={teacher.avatarUrl}
                            alt={teacher.teacherName}
                            className="w-9 h-9 rounded-full object-cover shrink-0 border border-slate-200"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-blue-100 text-[#0070CE] flex items-center justify-center font-bold text-sm shrink-0">
                            {teacher.teacherName.charAt(0)}
                          </div>
                        )}

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-800 truncate">
                              {teacher.teacherName}
                            </span>
                            <span className="text-[10px] font-mono text-slate-500 bg-slate-200 px-1.5 py-0.2 rounded">
                              {teacher.teacherCode}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-0.5">
                            {teacher.phone && (
                              <span className="flex items-center gap-1">
                                <FontAwesomeIcon icon={faPhone} className="w-2.5 h-2.5 text-slate-400" />
                                {teacher.phone}
                              </span>
                            )}
                            <span className="text-blue-700 font-semibold">
                              {teacher.assignedClassesCount} lớp giảng dạy
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Remove Teacher CTA (BR10) */}
                      <button
                        type="button"
                        onClick={() =>
                          onOpenUnassignTeacher(subject.id, subject.name, teacher)
                        }
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title={`Gỡ giáo viên ${teacher.teacherName} khỏi môn học`}
                      >
                        <FontAwesomeIcon icon={faUserMinus} className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-center">
                  <FontAwesomeIcon icon={faChalkboardTeacher} className="w-6 h-6 text-slate-400 mb-2" />
                  <p className="text-xs text-slate-600 font-semibold">
                    Chưa có giáo viên nào được phân công giảng dạy môn này
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Nhấp vào &quot;Phân công thêm GV&quot; để gán giáo viên phụ trách.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Drawer Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200/70 rounded-lg transition-colors cursor-pointer"
            >
              Đóng chi tiết
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
