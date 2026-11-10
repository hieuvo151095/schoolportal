import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Icon, Dropdown } from '@/components/ds';
import type { Student } from '../../../types/student';
import { useAppSelector } from '../../../store';

interface StudentAttendanceTabProps {
  student: Student;
  schoolCode: string;
}

export interface StudentDailyAttendanceLog {
  date: string;
  dayOfWeek: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  status: 'present' | 'absent_excused' | 'absent_unexcused' | 'unmarked';
  isLate: boolean;
  lateMinutes: number;
  pickupPerson: string;
  temperature: number | null;
  healthNote: string;
  teacherNote: string;
}

export const StudentAttendanceTab: React.FC<StudentAttendanceTabProps> = ({
  student,
  schoolCode,
}) => {
  const [selectedMonth, setSelectedMonth] = useState('2026-09');
  const [statusFilter, setStatusFilter] = useState('all');

  // Meal refund config from settings
  const mealRefundConfig = useAppSelector(
    (state) => state.settingFee?.latePickupAndRefund?.mealRefund
  );

  // Seed daily attendance records for this student across September & October 2026
  const attendanceLogs: StudentDailyAttendanceLog[] = useMemo(() => {
    return [
      {
        date: '2026-09-30',
        dayOfWeek: 'Thứ Tư',
        checkInTime: '07:35',
        checkOutTime: '17:15',
        status: 'present',
        isLate: false,
        lateMinutes: 0,
        pickupPerson: 'Nguyễn Trí Đức (Bố - Đón chính)',
        temperature: 36.6,
        healthNote: 'Bình thường',
        teacherNote: 'Học sinh tích cực tham gia các hoạt động lớp.',
      },
      {
        date: '2026-09-29',
        dayOfWeek: 'Thứ Ba',
        checkInTime: '07:40',
        checkOutTime: '17:20',
        status: 'present',
        isLate: false,
        lateMinutes: 0,
        pickupPerson: 'Trần Thị Thu An (Mẹ - Đón chính)',
        temperature: 36.5,
        healthNote: 'Bình thường',
        teacherNote: 'Ăn hết suất ăn trưa và ăn xế.',
      },
      {
        date: '2026-09-28',
        dayOfWeek: 'Thứ Hai',
        checkInTime: '08:15',
        checkOutTime: '17:10',
        status: 'present',
        isLate: true,
        lateMinutes: 15,
        pickupPerson: 'Nguyễn Trí Đức (Bố - Đón chính)',
        temperature: 36.7,
        healthNote: 'Bình thường',
        teacherNote: 'Gia đình thông báo kẹt xe đầu tuần nên đến muộn 15 phút.',
      },
      {
        date: '2026-09-25',
        dayOfWeek: 'Thứ Sáu',
        checkInTime: null,
        checkOutTime: null,
        status: 'absent_excused',
        isLate: false,
        lateMinutes: 0,
        pickupPerson: 'Không có',
        temperature: null,
        healthNote: 'Nghỉ ốm (sốt nhẹ)',
        teacherNote: 'Phụ huynh gửi đơn xin phép nghỉ qua ứng dụng lúc 06:45.',
      },
      {
        date: '2026-09-24',
        dayOfWeek: 'Thứ Năm',
        checkInTime: null,
        checkOutTime: null,
        status: 'absent_excused',
        isLate: false,
        lateMinutes: 0,
        pickupPerson: 'Không có',
        temperature: null,
        healthNote: 'Nghỉ ốm theo dõi tại nhà',
        teacherNote: 'Giáo viên chủ nhiệm gọi điện hỏi thăm tình hình sức khỏe học sinh.',
      },
      {
        date: '2026-09-23',
        dayOfWeek: 'Thứ Tư',
        checkInTime: '07:30',
        checkOutTime: '17:05',
        status: 'present',
        isLate: false,
        lateMinutes: 0,
        pickupPerson: 'Xe đưa đón Tuyến 03',
        temperature: 36.8,
        healthNote: 'Bình thường',
        teacherNote: 'Tham gia đầy đủ tiết bơi lội và hoạt động ngoại khóa.',
      },
      {
        date: '2026-09-22',
        dayOfWeek: 'Thứ Ba',
        checkInTime: '07:38',
        checkOutTime: '17:15',
        status: 'present',
        isLate: false,
        lateMinutes: 0,
        pickupPerson: 'Nguyễn Trí Đức (Bố)',
        temperature: 36.5,
        healthNote: 'Bình thường',
        teacherNote: 'Học sinh vui vẻ, làm bài tập đầy đủ.',
      },
      {
        date: '2026-09-21',
        dayOfWeek: 'Thứ Hai',
        checkInTime: '07:42',
        checkOutTime: '17:25',
        status: 'present',
        isLate: false,
        lateMinutes: 0,
        pickupPerson: 'Trần Thị Thu An (Mẹ)',
        temperature: 36.6,
        healthNote: 'Bình thường',
        teacherNote: 'Tham gia hoạt động đầu tuần đầy đủ.',
      },
      {
        date: '2026-09-18',
        dayOfWeek: 'Thứ Sáu',
        checkInTime: '07:35',
        checkOutTime: '17:30',
        status: 'present',
        isLate: false,
        lateMinutes: 0,
        pickupPerson: 'Xe đưa đón Tuyến 03',
        temperature: 36.5,
        healthNote: 'Bình thường',
        teacherNote: 'Học sinh ngoan, chăm chỉ.',
      },
      {
        date: '2026-09-17',
        dayOfWeek: 'Thứ Năm',
        checkInTime: '07:30',
        checkOutTime: '17:10',
        status: 'present',
        isLate: false,
        lateMinutes: 0,
        pickupPerson: 'Nguyễn Trí Đức (Bố)',
        temperature: 36.7,
        healthNote: 'Bình thường',
        teacherNote: 'Hoàn thành tốt bài thực hành STEAM.',
      },
    ];
  }, [student.fullName]);

  // Filter logs based on status
  const filteredLogs = useMemo(() => {
    if (statusFilter === 'all') return attendanceLogs;
    if (statusFilter === 'late') return attendanceLogs.filter((l) => l.isLate);
    return attendanceLogs.filter((l) => l.status === statusFilter);
  }, [attendanceLogs, statusFilter]);

  // Aggregate KPI summary
  const summary = useMemo(() => {
    const totalDays = attendanceLogs.length;
    const presentCount = attendanceLogs.filter((l) => l.status === 'present').length;
    const absentExcusedCount = attendanceLogs.filter((l) => l.status === 'absent_excused').length;
    const absentUnexcusedCount = attendanceLogs.filter((l) => l.status === 'absent_unexcused').length;
    const lateCount = attendanceLogs.filter((l) => l.isLate).length;
    const attendanceRate = totalDays > 0 ? ((presentCount / totalDays) * 100).toFixed(0) : '0';

    return {
      totalDays,
      presentCount,
      absentExcusedCount,
      absentUnexcusedCount,
      lateCount,
      attendanceRate,
    };
  }, [attendanceLogs]);

  const renderStatusBadge = (log: StudentDailyAttendanceLog) => {
    if (log.status === 'present') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
          Có mặt
        </span>
      );
    }
    if (log.status === 'absent_excused') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          <Icon name="circle-info" size={10} />
          Nghỉ có phép
        </span>
      );
    }
    if (log.status === 'absent_unexcused') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
          <Icon name="circle-xmark" size={10} />
          Nghỉ không phép
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">
        Chưa điểm danh
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* 1. Overview Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="p-4 bg-white rounded-2xl shadow-xs border border-slate-200">
          <div className="text-xs font-semibold text-slate-500 mb-1">Tổng ngày học</div>
          <div className="text-2xl font-bold text-slate-800">{summary.totalDays} ngày</div>
          <div className="text-2xs text-slate-400 mt-1">Trong tháng 09/2026</div>
        </div>

        <div className="p-4 bg-white rounded-2xl shadow-xs border border-emerald-100 bg-emerald-50/20">
          <div className="text-xs font-semibold text-emerald-700 mb-1">Số ngày có mặt</div>
          <div className="text-2xl font-bold text-emerald-700">{summary.presentCount} ngày</div>
          <div className="text-2xs text-emerald-600 font-medium mt-1">Đạt tỷ lệ {summary.attendanceRate}%</div>
        </div>

        <div className="p-4 bg-white rounded-2xl shadow-xs border border-amber-100 bg-amber-50/20">
          <div className="text-xs font-semibold text-amber-700 mb-1">Vắng có phép</div>
          <div className="text-2xl font-bold text-amber-700">{summary.absentExcusedCount} ngày</div>
          <div className="text-2xs text-amber-600 font-medium mt-1">Đủ điều kiện hoàn tiền ăn</div>
        </div>

        <div className="p-4 bg-white rounded-2xl shadow-xs border border-rose-100 bg-rose-50/20">
          <div className="text-xs font-semibold text-rose-700 mb-1">Vắng không phép</div>
          <div className="text-2xl font-bold text-rose-700">{summary.absentUnexcusedCount} ngày</div>
          <div className="text-2xs text-rose-500 mt-1">Không hoàn tiền ăn</div>
        </div>

        <div className="p-4 bg-white rounded-2xl shadow-xs border border-blue-100 bg-blue-50/20">
          <div className="text-xs font-semibold text-blue-700 mb-1">Số lần đi trễ</div>
          <div className="text-2xl font-bold text-blue-700">{summary.lateCount} lần</div>
          <div className="text-2xs text-blue-600 font-medium mt-1">Tổng cộng 15 phút</div>
        </div>
      </div>

      {/* 2. Filter & Controls Bar */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Month Selector */}
          <div className="w-48">
            <Dropdown
              options={[
                { value: '2026-11', label: 'Tháng 11/2026' },
                { value: '2026-10', label: 'Tháng 10/2026' },
                { value: '2026-09', label: 'Tháng 09/2026' },
                { value: '2026-08', label: 'Tháng 08/2026' },
              ]}
              value={selectedMonth}
              onChange={(val) => setSelectedMonth(val)}
              size="sm"
              variant="filter"
            />
          </div>

          {/* Status Filter */}
          <div className="w-52">
            <Dropdown
              options={[
                { value: 'all', label: 'Tất cả trạng thái' },
                { value: 'present', label: 'Có mặt' },
                { value: 'absent_excused', label: 'Nghỉ có phép' },
                { value: 'absent_unexcused', label: 'Nghỉ không phép' },
                { value: 'late', label: 'Đi trễ' },
              ]}
              value={statusFilter}
              onChange={(val) => setStatusFilter(val)}
              size="sm"
              variant="filter"
            />
          </div>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Hiển thị <span className="font-bold text-slate-800">{filteredLogs.length}</span> / {attendanceLogs.length} ngày ghi nhận
        </div>
      </div>

      {/* 3. Daily Attendance Ledger Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <th className="py-3 px-4">Ngày điểm danh</th>
                <th className="py-3 px-4">Giờ đón (Check-in)</th>
                <th className="py-3 px-4">Giờ trả (Check-out)</th>
                <th className="py-3 px-4">Người đưa đón</th>
                <th className="py-3 px-4">Thân nhiệt & Sức khỏe</th>
                <th className="py-3 px-4">Ghi chú giáo viên</th>
                <th className="py-3 px-4 text-center">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredLogs.map((log) => (
                <tr key={log.date} className="hover:bg-slate-50/80 transition-colors">
                  {/* Date & Day of Week */}
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800">
                      {new Date(log.date).toLocaleDateString('vi-VN')}
                    </div>
                    <div className="text-2xs text-slate-400 font-normal">{log.dayOfWeek}</div>
                  </td>

                  {/* Check-in */}
                  <td className="py-3.5 px-4">
                    {log.checkInTime ? (
                      <div className="flex items-center gap-1.5">
                        <Icon name="clock" size={12} className="text-slate-400" />
                        <span className="font-semibold text-slate-800">{log.checkInTime}</span>
                        {log.isLate && (
                          <span className="px-1.5 py-0.2 rounded text-3xs font-bold bg-amber-100 text-amber-800">
                            Trễ {log.lateMinutes}p
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-300 italic">--:--</span>
                    )}
                  </td>

                  {/* Check-out */}
                  <td className="py-3.5 px-4">
                    {log.checkOutTime ? (
                      <div className="flex items-center gap-1.5">
                        <Icon name="clock" size={12} className="text-slate-400" />
                        <span className="font-semibold text-slate-800">{log.checkOutTime}</span>
                      </div>
                    ) : (
                      <span className="text-slate-300 italic">--:--</span>
                    )}
                  </td>

                  {/* Pickup Person */}
                  <td className="py-3.5 px-4 max-w-[180px]">
                    <div className="truncate text-slate-700 font-medium">
                      {log.pickupPerson}
                    </div>
                  </td>

                  {/* Temperature & Health */}
                  <td className="py-3.5 px-4">
                    {log.temperature ? (
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 font-semibold text-slate-800">
                          <svg className="w-3.5 h-3.5 text-rose-500 fill-none stroke-currentColor stroke-2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0a3 3 0 100 6 3 3 0 000-6zm-7 3a7 7 0 1114 0" />
                          </svg>
                          {log.temperature}°C
                        </span>
                        <span className="text-2xs text-slate-500">• {log.healthNote}</span>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">{log.healthNote}</span>
                    )}
                  </td>

                  {/* Teacher Note */}
                  <td className="py-3.5 px-4 max-w-[220px]">
                    <p className="truncate text-slate-600 font-normal" title={log.teacherNote}>
                      {log.teacherNote}
                    </p>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-4 text-center">
                    {renderStatusBadge(log)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Insight */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Icon name="circle-info" size={14} className="text-blue-500" />
            <span>
              Dữ liệu chuyên cần được tự động đồng bộ từ sổ điểm danh lớp học của giáo viên chủ nhiệm.
            </span>
          </div>

          <Link
            href={`/${schoolCode}/class/${student.classId || 'class-11a1'}/attendance`}
            className="text-[#0070CE] font-semibold hover:underline inline-flex items-center gap-1"
          >
            <span>Mở sổ điểm danh lớp</span>
            <Icon name="arrow-right" size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
};
