import React, { useState } from 'react';
import Link from 'next/link';
import { Icon, IconName } from '@/components/ds';
import { ClassItem, StudentClassEnrollment } from '../../../types/class';

interface ClassDetailViewProps {
  classItem: ClassItem;
  schoolCode: string;
  enrolledStudents: StudentClassEnrollment[];
  onEditClass: () => void;
}

export const ClassDetailView: React.FC<ClassDetailViewProps> = ({
  classItem,
  schoolCode,
  enrolledStudents,
  onEditClass,
}) => {
  const [activeTab, setActiveTab] = useState<'hoc_sinh' | 'hoc_phi' | 'giao_vien'>('hoc_sinh');
  const [studentSearch, setStudentSearch] = useState('');

  const filteredStudents = enrolledStudents.filter((stu) => {
    if (!studentSearch.trim()) return true;
    const q = studentSearch.trim().toLowerCase();
    return (
      stu.fullName.toLowerCase().includes(q) ||
      stu.studentCode.toLowerCase().includes(q) ||
      stu.guardianPhone.includes(q)
    );
  });

  const shortcuts = [
    {
      title: 'Điểm danh hàng ngày',
      desc: 'Check-in, check-out, nhiệt độ & đưa đón',
      icon: 'calendar-check' as IconName,
      href: `/${schoolCode}/class/${classItem.id}/attendance`,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-100 hover:border-blue-300',
    },
    {
      title: 'Hoạt động & Bài viết',
      desc: 'Nhật ký học tập & tương tác phụ huynh',
      icon: 'camera' as IconName,
      href: `/${schoolCode}/class/${classItem.id}/activity`,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-100 hover:border-emerald-300',
    },
    {
      title: 'Thư viện ảnh lớp',
      desc: 'Album ảnh & AI nhận diện khuôn mặt',
      icon: 'images' as IconName,
      href: `/${schoolCode}/class/${classItem.id}/media`,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-100 hover:border-purple-300',
    },
    {
      title: 'Thời khóa biểu',
      desc: 'Lịch học hàng tuần & môn học',
      icon: 'calendar' as IconName,
      href: `/${schoolCode}/school/schedule`,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-100 hover:border-amber-300',
    },
    {
      title: 'Quản lý học phí lớp',
      desc: 'Cấu hình biểu phí & định mức thu',
      icon: 'coins' as IconName,
      href: `/${schoolCode}/school/tuition-management`,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-100 hover:border-rose-300',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Navigation & Header Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <Link
              href={`/${schoolCode}/school/classes`}
              className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
              aria-label="Quay lại danh sách lớp"
            >
              <Icon name="arrow-left" size={14} />
            </Link>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-bold text-slate-800">{classItem.name}</h1>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                  {classItem.code}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    classItem.taxonomy === 'chinh_khoa'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
                >
                  {classItem.taxonomy === 'chinh_khoa' ? 'Chính khóa' : 'Ngoại khóa'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {classItem.gradeName ? `${classItem.gradeName} • ` : ''}
                {classItem.roomNumber ? `${classItem.roomNumber} • ` : ''}
                Năm học: {classItem.academicYear}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onEditClass}
              className="flex items-center gap-2 px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl text-xs font-semibold transition-colors"
            >
              <Icon name="pen" size={12} />
              <span>Chỉnh sửa thông tin</span>
            </button>
          </div>
        </div>

        {/* Operational Shortcuts Bar (Launchpad to Daily Tools) */}
        <div className="pt-5">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            Trạm phóng vận hành lớp học (Operational Launchpad)
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {shortcuts.map((sc, idx) => (
              <Link
                key={idx}
                href={sc.href}
                className={`p-3.5 rounded-xl border ${sc.borderColor} bg-white transition-all shadow-2xs hover:shadow-md flex flex-col justify-between group`}
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <div
                    className={`w-8 h-8 rounded-lg ${sc.bgColor} ${sc.color} flex items-center justify-center text-sm shrink-0 group-hover:scale-110 transition-transform`}
                  >
                    <Icon name={sc.icon} size={16} />
                  </div>
                  <span className="font-bold text-xs text-slate-800 group-hover:text-blue-600 transition-colors">
                    {sc.title}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">{sc.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Content Tabs Navigation */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-200 px-4 sm:px-6 bg-slate-50/50 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('hoc_sinh')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 shrink-0 whitespace-nowrap ${
              activeTab === 'hoc_sinh'
                ? 'border-blue-600 text-blue-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Icon name="graduation-cap" size={14} />
            <span>Danh sách học sinh ({classItem.studentCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('hoc_phi')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 shrink-0 whitespace-nowrap ${
              activeTab === 'hoc_phi'
                ? 'border-blue-600 text-blue-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Icon name="coins" size={14} />
            <span>Biểu phí học phí áp dụng</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('giao_vien')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 shrink-0 whitespace-nowrap ${
              activeTab === 'giao_vien'
                ? 'border-blue-600 text-blue-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Icon name="user-tie" size={14} />
            <span>Phân công giáo viên</span>
          </button>
        </div>

        {/* Tab 1: Enrolled Students Roster */}
        {activeTab === 'hoc_sinh' && (
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="relative w-full sm:w-72">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <Icon name="magnifying-glass" size={12} />
                </span>
                <input
                  type="text"
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  placeholder="Tìm học sinh theo tên, mã..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              <div className="text-xs text-slate-500 font-medium">
                Sĩ số lớp: <strong className="text-slate-800">{classItem.studentCount}</strong> /{' '}
                {classItem.maxCapacity} học sinh
              </div>
            </div>

            {filteredStudents.length > 0 ? (
              <div className="overflow-x-auto border border-slate-100 rounded-xl">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 border-b border-slate-200 uppercase font-semibold text-slate-500">
                    <tr>
                      <th className="px-4 py-3 text-center w-12">STT</th>
                      <th className="px-4 py-3">Học sinh</th>
                      <th className="px-4 py-3">Mã định danh</th>
                      <th className="px-4 py-3">Giới tính</th>
                      <th className="px-4 py-3">Ngày sinh</th>
                      <th className="px-4 py-3">Phụ huynh liên hệ</th>
                      <th className="px-4 py-3 text-center">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredStudents.map((stu, sIdx) => (
                      <tr key={stu.studentId} className="hover:bg-slate-50/60">
                        <td className="px-4 py-3 text-center text-slate-400 font-medium">{sIdx + 1}</td>
                        <td className="px-4 py-3 font-semibold text-slate-900">{stu.fullName}</td>
                        <td className="px-4 py-3 font-mono text-slate-500">{stu.studentCode}</td>
                        <td className="px-4 py-3">{stu.gender === 'nam' ? 'Nam' : 'Nữ'}</td>
                        <td className="px-4 py-3 text-slate-600">{stu.dob}</td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-800">{stu.guardianName}</div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-1">
                            <Icon name="phone" size={10} />
                            <span>{stu.guardianPhone}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Đang học
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-8 text-center text-slate-400 text-xs italic">
                {classItem.studentCount === 0
                  ? 'Lớp học hiện tại chưa có học sinh nào được xếp vào.'
                  : 'Không tìm thấy học sinh nào phù hợp với tìm kiếm.'}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Tuition Fee Overview */}
        {activeTab === 'hoc_phi' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-slate-800">
                Biểu phí thu định mức áp dụng cho {classItem.name}
              </h4>
              <Link
                href={`/${schoolCode}/school/tuition-management`}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
              >
                Chỉnh sửa trong Quản lý học phí &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <span className="text-xs text-slate-400 uppercase font-semibold">1. Học phí chính khóa</span>
                <h5 className="text-lg font-bold text-slate-800 mt-1">2.500.000 đ/tháng</h5>
                <p className="text-xs text-slate-500 mt-1">Khoản thu bắt buộc áp dụng toàn lớp</p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <span className="text-xs text-slate-400 uppercase font-semibold">2. Tiền ăn trưa bán trú</span>
                <h5 className="text-lg font-bold text-slate-800 mt-1">35.000 đ/ngày</h5>
                <p className="text-xs text-slate-500 mt-1">Hoàn tiền 100% khi nghỉ lễ theo lịch trường</p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <span className="text-xs text-slate-400 uppercase font-semibold">3. Tiền ăn sáng (Tùy chọn)</span>
                <h5 className="text-lg font-bold text-slate-800 mt-1">20.000 đ/ngày</h5>
                <p className="text-xs text-slate-500 mt-1">Áp dụng cho học sinh đăng ký ăn sáng</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Assigned Teachers */}
        {activeTab === 'giao_vien' && (
          <div className="p-6">
            {classItem.taxonomy === 'chinh_khoa' ? (
              <div>
                <h4 className="text-sm font-bold text-slate-800 mb-3">Giáo viên chủ nhiệm lớp</h4>
                {classItem.homeroomTeacherName ? (
                  <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/30 flex items-center gap-4 max-w-md">
                    <img
                      src={classItem.homeroomTeacherAvatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=faces'}
                      alt={classItem.homeroomTeacherName}
                      className="w-12 h-12 rounded-full object-cover border border-blue-200"
                    />
                    <div>
                      <h5 className="font-bold text-slate-800 text-sm">{classItem.homeroomTeacherName}</h5>
                      <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <Icon name="phone" size={10} />
                        <span>{classItem.homeroomTeacherPhone}</span>
                      </p>
                      <span className="inline-block mt-1.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-700">
                        Giáo viên chủ nhiệm chính thức
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">Chưa phân công giáo viên chủ nhiệm.</p>
                )}
              </div>
            ) : (
              <div>
                <h4 className="text-sm font-bold text-slate-800 mb-3">Đội ngũ giáo viên / HLV phụ trách CLB</h4>
                {classItem.instructors && classItem.instructors.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg">
                    {classItem.instructors.map((ins, iIdx) => (
                      <div key={iIdx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                          <Icon name="user-tie" size={14} />
                        </div>
                        <div>
                          <div className="font-bold text-slate-800 text-xs">{ins.teacherName}</div>
                          <span className="text-[10px] font-semibold text-amber-700">
                            {ins.role === 'giao_vien_chinh' ? 'Giáo viên chính' : ins.role === 'huan_luyen_vien' ? 'Huấn luyện viên' : 'Trợ giảng'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">Chưa chỉ định giáo viên phụ trách cho CLB này.</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
