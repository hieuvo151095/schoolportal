/**
 * Executive Overview Dashboard (Tổng Quan Điều Hành) Types
 * Design System: [DS] ECO ME DASHBOARD v2.6.0
 */

export type DashboardTimeRange = 'today' | 'week' | 'month' | 'term' | 'year';

export type ClassMatrixStatus = 'stable' | 'warning' | 'critical';

export interface GradeCensusSummary {
  gradeId: string;
  gradeName: string;
  classCount: number;
  studentCount: number;
  capacity: number;
  colorToken: string;
  colorHex: string;
}

export interface MonthlyCashflowPoint {
  monthKey: string;
  monthLabel: string;
  /** Số tiền đã thực thu (VND) */
  collected: number;
  /** Số tiền còn phải thu trong hạn (VND) */
  inTermRemaining: number;
  /** Số tiền quá hạn > 30 ngày (VND) */
  overdue: number;
  /** Chi phí vận hành trong tháng (VND) */
  expenses: number;
}

export interface CareWellnessTrendPoint {
  dateKey: string;
  dayLabel: string;
  fullDate: string;
  /** Tỷ lệ điểm danh có mặt (%) */
  attendanceRate: number;
  /** Tỷ lệ trẻ ăn hết suất (%) */
  mealCompletionRate: number;
  /** Tỷ lệ trẻ ngủ sâu giấc (%) */
  sleepQualityRate: number;
  /** Tỷ lệ uống đủ nước (%) */
  hydrationRate: number;
}

export interface WeeklyActivityDayPoint {
  dateKey: string;
  dayLabel: string;
  fullDate: string;
  /** Số bài đăng trong sub-module Hoạt động */
  postCount: number;
  /** Số lượt tim từ phụ huynh */
  heartCount: number;
}

export interface BulletinBoardItem {
  id: string;
  title: string;
  targetAudience: string;
  timeAgo: string;
  gradeId?: string;
}

export interface ApprovalPendingClassItem {
  classId: string;
  className: string;
  gradeId: string;
  pendingCount: number;
}

export interface FrequentAbsenceStudentItem {
  studentId: string;
  studentName: string;
  classId: string;
  className: string;
  gradeId: string;
  absentDays: number;
  excusedDays: number;
  unexcusedDays: number;
}

export interface ClassPerformanceRow {
  classId: string;
  className: string;
  gradeId: string;
  gradeName: string;
  homeroomTeacher: string;
  studentCount: number;
  capacity: number;
  attendanceRate: number;
  presentCount: number;
  absentCount: number;
  mealCompletionRate: number;
  rewardRate: number;
  tuitionCollectionRate: number;
  tuitionRemainingVnd: number;
  status: ClassMatrixStatus;
  alertNote?: string;
}

export interface ExecutiveKPIBundle {
  totalStudents: number;
  totalCapacity: number;
  fillRate: number;
  studentDeltaLabel: string;

  attendanceRate: number;
  presentCount: number;
  excusedAbsentCount: number;
  unexcusedAbsentCount: number;

  tuitionCollectionRate: number;
  tuitionCollectedVnd: number;
  tuitionTotalIssuedVnd: number;
  tuitionRemainingVnd: number;

  csatScore: number;
  csatMax: number;
  positivePollRate: number;
  parentAppAdoptionRate: number;
}

export interface DashboardFilterState {
  timeRange: DashboardTimeRange;
  gradeScope: string; // 'all' | gradeId
  searchQuery: string;
  statusFilter: 'all' | ClassMatrixStatus;
  lastRefreshedAt: string;
}
