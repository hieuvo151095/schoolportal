import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faEnvelope,
  faPhone,
  faIdCard,
  faCalendarAlt,
  faChalkboardTeacher,
  faBookOpen,
  faShieldAlt,
  faGraduationCap,
  faAward,
  faCheckCircle,
  faUserTie,
  faEdit,
} from '@fortawesome/free-solid-svg-icons';
import type { Teacher } from '../../../types/teacher';
import {
  formatTeacherStatus,
  formatPermissionTier,
  formatLegacyField,
  shouldAutoPublishActivity,
} from '../../../utils/teacherValidation';

interface TeacherDetailViewProps {
  teacher: Teacher;
  schoolCode: string;
  onOpenAssignClass: () => void;
  onOpenChangeEmail: () => void;
  onChangePermission: () => void;
  onChangeStatus: () => void;
}

export const TeacherDetailView: React.FC<TeacherDetailViewProps> = ({
  teacher,
  schoolCode,
  onOpenAssignClass,
  onOpenChangeEmail,
  onChangePermission,
  onChangeStatus,
}) => {
  const statusMeta = formatTeacherStatus(teacher.status);
  const permMeta = formatPermissionTier(teacher.permissionTier);
  const autoPublishes = shouldAutoPublishActivity(teacher.permissionTier);

  return (
    <div className="space-y-6">
      {/* Top Breadcrumbs & Back Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href={`/${schoolCode}/school/teacher`}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300 transition-colors shadow-2xs"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="w-3.5 h-3.5" />
          </Link>
          <div>
            <div className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
              <Link href={`/${schoolCode}/school/teacher`} className="hover:text-[#0070CE]">
                Giáo viên
              </Link>
              <span>/</span>
              <span className="text-slate-600">Hồ sơ chi tiết</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-0.5">{teacher.fullName}</h1>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenAssignClass}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors shadow-2xs"
          >
            <FontAwesomeIcon icon={faChalkboardTeacher} className="text-xs text-[#0070CE]" />
            <span>Phân công lớp</span>
          </button>
          <button
            type="button"
            onClick={onOpenChangeEmail}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors shadow-2xs"
          >
            <FontAwesomeIcon icon={faEnvelope} className="text-xs text-[#0070CE]" />
            <span>Đổi email</span>
          </button>
        </div>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border-2 border-slate-200 shadow-xs">
              {teacher.avatar ? (
                <img
                  src={teacher.avatar}
                  alt={teacher.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-blue-100 text-[#0070CE] font-bold text-2xl">
                  {teacher.fullName.charAt(0)}
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-slate-900">{teacher.fullName}</h2>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusMeta.bgClass} ${statusMeta.textClass} ${statusMeta.borderClass}`}
                >
                  {statusMeta.label}
                </span>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${permMeta.badgeClass}`}
                >
                  {permMeta.label}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500">
                <span className="font-mono bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-slate-700 font-semibold">
                  {formatLegacyField(teacher.staffCode, 'Chưa có mã NV')}
                </span>
                <span className="flex items-center gap-1.5">
                  <FontAwesomeIcon icon={faEnvelope} className="text-slate-400" />
                  <span>{teacher.email}</span>
                </span>
                {teacher.phone && (
                  <span className="flex items-center gap-1.5">
                    <FontAwesomeIcon icon={faPhone} className="text-slate-400" />
                    <span>{teacher.phone}</span>
                  </span>
                )}
                {teacher.csdlSoCode && (
                  <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-500" />
                    <span>CSDL Sở: {teacher.csdlSoCode}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onChangePermission}
              className="px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
            >
              Chuyển sang {teacher.permissionTier === 'chinh' ? 'GV hỗ trợ' : 'GV chính'}
            </button>
            <button
              type="button"
              onClick={onChangeStatus}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors"
            >
              {teacher.status === 'dang_lam_viec' ? 'Chuyển tạm nghỉ' : 'Kích hoạt làm việc'}
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Profile Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section 1: Phân công giảng dạy */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-4">
          <div className="flex items-center gap-2.5 text-slate-800 font-bold text-sm border-b border-slate-100 pb-3">
            <FontAwesomeIcon icon={faChalkboardTeacher} className="text-[#0070CE]" />
            <span>Phân công giảng dạy & Lớp học</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-500 block mb-1">Lớp chủ nhiệm:</span>
              {teacher.homeroomClassName ? (
                <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {teacher.homeroomClassName}
                </span>
              ) : (
                <span className="text-slate-400 italic">Chưa phân công chủ nhiệm</span>
              )}
            </div>

            <div>
              <span className="text-slate-500 block mb-1">Lớp phụ trách / Giảng dạy:</span>
              {teacher.assignedClasses.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {teacher.assignedClasses.map((ac) => (
                    <span
                      key={ac.classId}
                      className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium border border-slate-200"
                    >
                      {ac.className}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-slate-400 italic">Chưa có lớp phụ trách</span>
              )}
            </div>

            <div>
              <span className="text-slate-500 block mb-1">Môn học phụ trách:</span>
              {teacher.subjects && teacher.subjects.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {teacher.subjects.map((sub, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-medium border border-blue-100"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-slate-400 italic">Chưa đăng ký môn học</span>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Quyền hạn & Kiểm duyệt bài đăng (BR01) */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-4">
          <div className="flex items-center gap-2.5 text-slate-800 font-bold text-sm border-b border-slate-100 pb-3">
            <FontAwesomeIcon icon={faShieldAlt} className="text-[#0070CE]" />
            <span>Phân quyền & Kiểm duyệt nội dung</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-500 block mb-1">Vai trò hệ thống:</span>
              <span className="font-semibold text-slate-800">{permMeta.label}</span>
            </div>

            <div className="p-3.5 rounded-xl border bg-slate-50 border-slate-200 space-y-1.5">
              <div className="font-bold text-slate-800 flex items-center gap-2">
                <span>Cơ chế đăng tin hoạt động (BR01):</span>
                {autoPublishes ? (
                  <span className="text-emerald-600 font-semibold">Tự động phát hành</span>
                ) : (
                  <span className="text-amber-600 font-semibold">Cần phê duyệt</span>
                )}
              </div>
              <p className="text-slate-500 leading-relaxed">
                {autoPublishes
                  ? 'Là Giáo viên chính, các bài viết hoạt động, hình ảnh và nhật ký lớp học do giáo viên tạo sẽ tự động hiển thị cho phụ huynh ngay khi đăng.'
                  : 'Là Giáo viên hỗ trợ, các bài viết hoạt động được tạo sẽ chuyển vào Hàng đợi kiểm duyệt (Chờ duyệt) và cần Giáo viên chính hoặc Quản trị viên phê duyệt trước khi phụ huynh nhìn thấy.'}
              </p>
            </div>

            <div>
              <span className="text-slate-500 block mb-1">Thời gian đăng nhập gần nhất:</span>
              <span className="text-slate-700">
                {teacher.lastLoginAt ? new Date(teacher.lastLoginAt).toLocaleString('vi-VN') : 'Chưa đăng nhập'}
              </span>
            </div>
          </div>
        </div>

        {/* Section 3: Thông tin cá nhân */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-4">
          <div className="flex items-center gap-2.5 text-slate-800 font-bold text-sm border-b border-slate-100 pb-3">
            <FontAwesomeIcon icon={faIdCard} className="text-[#0070CE]" />
            <span>Thông tin cá nhân</span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-500 block mb-0.5">Giới tính:</span>
              <span className="font-semibold text-slate-800">
                {teacher.gender === 'nam' ? 'Nam' : teacher.gender === 'nu' ? 'Nữ' : 'Khác'}
              </span>
            </div>

            <div>
              <span className="text-slate-500 block mb-0.5">Ngày sinh:</span>
              <span className="font-semibold text-slate-800">
                {teacher.dob || 'Chưa cập nhật'}
              </span>
            </div>

            <div>
              <span className="text-slate-500 block mb-0.5">Số CCCD / Định danh:</span>
              <span className="font-semibold text-slate-800">
                {formatLegacyField(teacher.cccd, 'Chưa có CCCD')}
              </span>
            </div>

            <div>
              <span className="text-slate-500 block mb-0.5">Ngày bắt đầu công tác:</span>
              <span className="font-semibold text-slate-800">
                {teacher.joinedDate || 'Chưa cập nhật'}
              </span>
            </div>
          </div>
        </div>

        {/* Section 4: Học vấn & Chứng chỉ */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-4">
          <div className="flex items-center gap-2.5 text-slate-800 font-bold text-sm border-b border-slate-100 pb-3">
            <FontAwesomeIcon icon={faGraduationCap} className="text-[#0070CE]" />
            <span>Học vấn & Bằng cấp chuyên môn</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-500 block mb-0.5">Trình độ đào tạo:</span>
              <span className="font-semibold text-slate-800">
                {teacher.educationLevel || 'Chưa cập nhật'}
              </span>
            </div>

            <div>
              <span className="text-slate-500 block mb-0.5">Chuyên ngành:</span>
              <span className="font-semibold text-slate-800">
                {teacher.major || 'Chưa cập nhật'}
              </span>
            </div>

            <div>
              <span className="text-slate-500 block mb-1">Chứng chỉ chuyên môn:</span>
              {teacher.certificates && teacher.certificates.length > 0 ? (
                <ul className="space-y-1">
                  {teacher.certificates.map((cert, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-slate-700">
                      <FontAwesomeIcon icon={faAward} className="text-amber-500 text-xs" />
                      <span>{cert}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="text-slate-400 italic">Chưa có chứng chỉ ghi nhận</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Internal Notes Section */}
      {teacher.notes && (
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-2">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Ghi chú nội bộ nhà trường
          </div>
          <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-200 leading-relaxed">
            {teacher.notes}
          </p>
        </div>
      )}
    </div>
  );
};
