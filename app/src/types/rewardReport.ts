export interface RewardReportWeek {
  weekNumber: number; // e.g. 27, 28, 29, 30, 31
  weekLabel: string; // e.g. "Tuần 27"
  dateRange: string; // e.g. "02/11 - 06/11/2026"
  isFuture: boolean;
}

export interface StudentWeekRewardStatus {
  isAwarded: boolean;
  isPublished: boolean;
  excusedAbsence: number;
  unexcusedAbsence: number;
  teacherComment?: string;
  isFuture: boolean;
}

export interface StudentRewardReportRow {
  studentId: string;
  studentCode: string;
  fullName: string;
  nickname?: string;
  avatarUrl: string;
  gender: 'male' | 'female';
  weeklyStatus: Record<number, StudentWeekRewardStatus>;
  totalAwarded: number;
  totalExcused: number;
  totalUnexcused: number;
}

export interface RewardReportSummary {
  totalStudents: number;
  weeklyAwardedTotals: Record<number, number>;
  grandTotalAwarded: number;
  totalExcusedAbsences: number;
  totalUnexcusedAbsences: number;
  averageRate: number; // %
}

export interface RewardMonthlyReport {
  month: string; // '2026-11'
  monthLabel: string; // 'Tháng 11/2026'
  classId: string;
  className: string;
  weeks: RewardReportWeek[];
  rows: StudentRewardReportRow[];
  summary: RewardReportSummary;
}
