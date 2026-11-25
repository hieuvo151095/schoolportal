# TONG-QUAN-SOURCE-CODE — Toàn Bộ Mã Nguồn & Patch Tích Hợp Module Tổng Quan

> Tài liệu này chứa **100% nguyên văn (verbatim)** mã nguồn của 17 file mới và git diff chính xác của 11 file chỉnh sửa (trích từ commit `7d05677`) để một AI agent khác có thể tái tạo chính xác hoàn toàn module **Tổng quan** trong ECO School Operating Portal.

## Mục Lục Nhanh

### Phần A — 17 File Mới Tạo (Nguyên Văn Đầy Đủ)
1. `app/src/types/dashboard.ts` (130 dòng)
2. `app/src/utils/dashboardAnalytics.ts` (297 dòng)
3. `app/src/services/mockDashboardData.ts` (562 dòng)
4. `app/src/store/slices/dashboardSlice.ts` (56 dòng)
5. `app/src/modules/dashboard/DashboardToolbar.tsx` (83 dòng)
6. `app/src/modules/dashboard/ExecutiveKpiCards.tsx` (54 dòng)
7. `app/src/modules/dashboard/FinanceCashflowChart.tsx` (219 dòng)
8. `app/src/modules/dashboard/StudentCensusDonut.tsx` (225 dòng)
9. `app/src/modules/dashboard/CareWellnessTrendChart.tsx` (258 dòng)
10. `app/src/modules/dashboard/WeeklyActivityChart.tsx` (249 dòng)
11. `app/src/modules/dashboard/BulletinBoardCard.tsx` (100 dòng)
12. `app/src/modules/dashboard/ApprovalCenterCard.tsx` (128 dòng)
13. `app/src/modules/dashboard/FrequentAbsenceCard.tsx` (108 dòng)
14. `app/src/modules/dashboard/ClassComparisonTable.tsx` (324 dòng)
15. `app/src/pages/[schoolCode]/dashboard/index.tsx` (242 dòng)
16. `app/tests/unit/dashboard.test.mjs` (243 dòng)
17. `app/tests/unit/dashboardScenarios.test.mjs` (343 dòng)

Tổng cộng Phần A: **17 files / 3621 dòng**.

### Phần B — Patch Tích Hợp Vào 11 File Có Sẵn (`git show 7d05677`)
1. `app/src/components/ds/index.tsx`
2. `app/src/components/layout/PortalLayout.tsx`
3. `app/src/store/index.ts`
4. `app/src/pages/index.tsx`
5. `app/src/pages/[schoolCode]/index.tsx`
6. `app/src/modules/operations/activity/ActivityToolbar.tsx`
7. `app/src/pages/[schoolCode]/class/[classId]/activity/index.tsx`
8. `app/src/services/mockActivityData.ts`
9. `app/src/pages/[schoolCode]/class/[classId]/nutrition.tsx`
10. `app/src/pages/[schoolCode]/class/[classId]/reward.tsx`
11. `app/src/pages/[schoolCode]/reports/reward.tsx`

---

## Phần A — Mã Nguồn Nguyên Văn 17 File Mới

### A.1. `app/src/types/dashboard.ts` (130 dòng)

```ts
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
```

### A.2. `app/src/utils/dashboardAnalytics.ts` (297 dòng)

```ts
import type {
  ApprovalPendingClassItem,
  BulletinBoardItem,
  CareWellnessTrendPoint,
  ClassMatrixStatus,
  ClassPerformanceRow,
  DashboardTimeRange,
  ExecutiveKPIBundle,
  FrequentAbsenceStudentItem,
  GradeCensusSummary,
  MonthlyCashflowPoint,
  WeeklyActivityDayPoint,
} from '../types/dashboard.ts';

export function removeVietnameseTones(str: string): string {
  return (str || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
}

export function formatVndCurrency(amount: number): string {
  const rounded = Math.round(amount || 0);
  return `${rounded.toLocaleString('vi-VN')} đ`;
}

export function formatVndCompact(amount: number): string {
  const abs = Math.abs(amount || 0);
  if (abs >= 1_000_000_000) {
    return `${(amount / 1_000_000_000).toFixed(2).replace('.', ',')} tỷ`;
  }
  if (abs >= 1_000_000) {
    return `${Math.round(amount / 1_000_000)} tr`;
  }
  return `${Math.round(amount / 1_000)}k`;
}

export function filterGradeCensus(
  gradeScope: string,
  grades: GradeCensusSummary[]
): GradeCensusSummary[] {
  if (!gradeScope || gradeScope === 'all') return grades;
  return grades.filter((g) => g.gradeId === gradeScope);
}

/**
 * Tính toán tỷ trọng sĩ số của một khối so với toàn trường để scale dòng tiền theo phạm vi
 */
export function getScopeShareRatio(
  gradeScope: string,
  grades: GradeCensusSummary[]
): number {
  if (!gradeScope || gradeScope === 'all') return 1;
  const totalStudents = grades.reduce((acc, g) => acc + g.studentCount, 0);
  if (totalStudents <= 0) return 0;
  const target = grades.find((g) => g.gradeId === gradeScope);
  if (!target) return 0;
  return target.studentCount / totalStudents;
}

/**
 * Tính 4 chỉ số KPI Tinh hoa (North Star Metrics) nhất quán theo gradeScope & timeRange
 */
export function computeExecutiveKPIs(
  gradeScope: string,
  timeRange: DashboardTimeRange,
  grades: GradeCensusSummary[],
  classes: ClassPerformanceRow[],
  cashflow: MonthlyCashflowPoint[]
): ExecutiveKPIBundle {
  const scopedGrades = filterGradeCensus(gradeScope, grades);
  const scopedClasses =
    !gradeScope || gradeScope === 'all'
      ? classes
      : classes.filter((c) => c.gradeId === gradeScope);

  const totalStudents = scopedGrades.reduce((s, g) => s + g.studentCount, 0);
  const totalCapacity = scopedGrades.reduce((s, g) => s + g.capacity, 0);
  const fillRate =
    totalCapacity > 0 ? Number(((totalStudents / totalCapacity) * 100).toFixed(1)) : 0;

  // Attendance derived directly from scoped classes
  const presentCount = scopedClasses.reduce((s, c) => s + c.presentCount, 0);
  const absentCount = scopedClasses.reduce((s, c) => s + c.absentCount, 0);
  const totalRosterStudents = presentCount + absentCount;

  // Adjust attendance rate slightly for multi-day periods deterministically
  const baseAttendanceRate =
    totalRosterStudents > 0 ? (presentCount / totalRosterStudents) * 100 : 0;
  const timeOffset =
    timeRange === 'today'
      ? 0
      : timeRange === 'week'
      ? 0.4
      : timeRange === 'month'
      ? 0.7
      : timeRange === 'term'
      ? 1.1
      : 1.3;
  const attendanceRate =
    totalRosterStudents > 0
      ? Number(Math.min(100, Math.max(0, baseAttendanceRate + timeOffset)).toFixed(1))
      : 0;

  // Split excused vs unexcused deterministically (approx 75% excused, 25% unexcused)
  const excusedAbsentCount = Math.ceil(absentCount * 0.75);
  const unexcusedAbsentCount = Math.max(0, absentCount - excusedAbsentCount);

  // Tuition calculations scaled by scope & timeRange
  const shareRatio = getScopeShareRatio(gradeScope, grades);
  const relevantMonths =
    timeRange === 'today' || timeRange === 'week' || timeRange === 'month'
      ? cashflow.slice(-1)
      : timeRange === 'term'
      ? cashflow.slice(-3)
      : cashflow;

  const rawCollected = relevantMonths.reduce((s, m) => s + m.collected, 0);
  const rawRemaining = relevantMonths.reduce(
    (s, m) => s + m.inTermRemaining + m.overdue,
    0
  );

  const tuitionCollectedVnd = Math.round(rawCollected * shareRatio);
  const tuitionRemainingVnd = Math.round(rawRemaining * shareRatio);
  const tuitionTotalIssuedVnd = tuitionCollectedVnd + tuitionRemainingVnd;
  const tuitionCollectionRate =
    tuitionTotalIssuedVnd > 0
      ? Number(((tuitionCollectedVnd / tuitionTotalIssuedVnd) * 100).toFixed(1))
      : 0;

  // CSAT & engagement
  const csatBase =
    gradeScope === 'khoi-mam'
      ? 4.92
      : gradeScope === 'khoi-2'
      ? 4.74
      : gradeScope === 'khoi-1'
      ? 4.86
      : 4.85;
  const positivePollRate =
    gradeScope === 'khoi-mam'
      ? 98
      : gradeScope === 'khoi-2'
      ? 92
      : 96;

  return {
    totalStudents,
    totalCapacity,
    fillRate,
    studentDeltaLabel: '+12 HS so với kỳ trước',

    attendanceRate,
    presentCount,
    excusedAbsentCount,
    unexcusedAbsentCount,

    tuitionCollectionRate,
    tuitionCollectedVnd,
    tuitionTotalIssuedVnd,
    tuitionRemainingVnd,

    csatScore: csatBase,
    csatMax: 5.0,
    positivePollRate,
    parentAppAdoptionRate: 97.4,
  };
}

export function filterCashflowSeries(
  timeRange: DashboardTimeRange,
  gradeScope: string,
  cashflow: MonthlyCashflowPoint[],
  grades: GradeCensusSummary[]
): MonthlyCashflowPoint[] {
  const ratio = getScopeShareRatio(gradeScope, grades);
  const sliceCount = timeRange === 'term' ? 4 : 6;
  const target = cashflow.slice(-sliceCount);
  if (ratio === 1) return target;
  return target.map((pt) => ({
    ...pt,
    collected: Math.round(pt.collected * ratio),
    inTermRemaining: Math.round(pt.inTermRemaining * ratio),
    overdue: Math.round(pt.overdue * ratio),
    expenses: Math.round(pt.expenses * ratio),
  }));
}

export function filterWellnessTrend(
  gradeScope: string,
  trend: CareWellnessTrendPoint[],
  classes: ClassPerformanceRow[]
): CareWellnessTrendPoint[] {
  if (!gradeScope || gradeScope === 'all') return trend;
  const scoped = classes.filter((c) => c.gradeId === gradeScope);
  if (scoped.length === 0) return trend;

  // Compute scoped offsets relative to overall average
  const avgAtt = scoped.reduce((s, c) => s + c.attendanceRate, 0) / scoped.length;
  const avgMeal = scoped.reduce((s, c) => s + c.mealCompletionRate, 0) / scoped.length;
  const attDelta = avgAtt - 94.2;
  const mealDelta = avgMeal - 91.5;

  return trend.map((pt) => ({
    ...pt,
    attendanceRate: Number(Math.min(100, Math.max(60, pt.attendanceRate + attDelta)).toFixed(1)),
    mealCompletionRate: Number(
      Math.min(100, Math.max(60, pt.mealCompletionRate + mealDelta)).toFixed(1)
    ),
  }));
}

export function evaluateClassStatus(row: {
  attendanceRate: number;
  mealCompletionRate: number;
  tuitionCollectionRate: number;
}): ClassMatrixStatus {
  if (row.attendanceRate < 88 || row.tuitionCollectionRate < 70) {
    return 'critical';
  }
  if (
    row.attendanceRate < 92 ||
    row.mealCompletionRate < 82 ||
    row.tuitionCollectionRate < 82
  ) {
    return 'warning';
  }
  return 'stable';
}

export function filterClassPerformanceMatrix(
  classes: ClassPerformanceRow[],
  gradeScope: string,
  searchQuery: string,
  statusFilter: 'all' | ClassMatrixStatus
): ClassPerformanceRow[] {
  const q = removeVietnameseTones(searchQuery).trim();
  return classes.filter((row) => {
    if (gradeScope && gradeScope !== 'all' && row.gradeId !== gradeScope) {
      return false;
    }
    if (statusFilter !== 'all' && row.status !== statusFilter) {
      return false;
    }
    if (q) {
      const matchClass = removeVietnameseTones(row.className).includes(q);
      const matchTeacher = removeVietnameseTones(row.homeroomTeacher).includes(q);
      const matchGrade = removeVietnameseTones(row.gradeName).includes(q);
      if (!matchClass && !matchTeacher && !matchGrade) return false;
    }
    return true;
  });
}

export function filterWeeklyActivityPosts(
  gradeScope: string,
  posts: WeeklyActivityDayPoint[],
  grades: GradeCensusSummary[]
): WeeklyActivityDayPoint[] {
  const ratio = getScopeShareRatio(gradeScope, grades);
  if (ratio === 1) return posts;
  return posts.map((pt) => ({
    ...pt,
    postCount: Math.max(0, Math.round(pt.postCount * ratio)),
    heartCount: Math.max(0, Math.round(pt.heartCount * ratio)),
  }));
}

export function filterBulletinBoard(
  gradeScope: string,
  items: BulletinBoardItem[]
): BulletinBoardItem[] {
  if (!gradeScope || gradeScope === 'all') return items;
  return items.filter((it) => !it.gradeId || it.gradeId === gradeScope);
}

export function filterApprovalCenter(
  gradeScope: string,
  items: ApprovalPendingClassItem[]
): ApprovalPendingClassItem[] {
  if (!gradeScope || gradeScope === 'all') return items;
  return items.filter((it) => it.gradeId === gradeScope);
}

export function filterFrequentAbsences(
  gradeScope: string,
  items: FrequentAbsenceStudentItem[]
): FrequentAbsenceStudentItem[] {
  const filtered =
    !gradeScope || gradeScope === 'all'
      ? items
      : items.filter((it) => it.gradeId === gradeScope);
  return [...filtered].sort((a, b) => b.absentDays - a.absentDays);
}
```

### A.3. `app/src/services/mockDashboardData.ts` (562 dòng)

```ts
import type {
  ApprovalPendingClassItem,
  BulletinBoardItem,
  CareWellnessTrendPoint,
  ClassPerformanceRow,
  FrequentAbsenceStudentItem,
  GradeCensusSummary,
  MonthlyCashflowPoint,
  WeeklyActivityDayPoint,
} from '../types/dashboard.ts';

export const DASHBOARD_GRADE_OPTIONS = [
  { value: 'all', label: 'Toàn trường (Tất cả khối)' },
  { value: 'khoi-mam', label: 'Khối Mầm non' },
  { value: 'khoi-1', label: 'Khối 1' },
  { value: 'khoi-2', label: 'Khối 2' },
  { value: 'khoi-3', label: 'Khối 3' },
];

export const MOCK_GRADE_CENSUS: GradeCensusSummary[] = [
  {
    gradeId: 'khoi-mam',
    gradeName: 'Khối Mầm non',
    classCount: 3,
    studentCount: 72,
    capacity: 75,
    colorToken: 'var(--eco-blue)',
    colorHex: '#006fda',
  },
  {
    gradeId: 'khoi-1',
    gradeName: 'Khối 1',
    classCount: 4,
    studentCount: 112,
    capacity: 120,
    colorToken: 'var(--color-semantic-green)',
    colorHex: '#00ab56',
  },
  {
    gradeId: 'khoi-2',
    gradeName: 'Khối 2',
    classCount: 3,
    studentCount: 84,
    capacity: 95,
    colorToken: 'var(--color-semantic-orange)',
    colorHex: '#f78700',
  },
  {
    gradeId: 'khoi-3',
    gradeName: 'Khối 3',
    classCount: 3,
    studentCount: 74,
    capacity: 90,
    colorToken: 'var(--artic-blue)',
    colorHex: '#4ac3ff',
  },
];

export const MOCK_MONTHLY_CASHFLOW: MonthlyCashflowPoint[] = [
  {
    monthKey: '2026-06',
    monthLabel: 'T6/26',
    collected: 1290000000,
    inTermRemaining: 35000000,
    overdue: 12000000,
    expenses: 910000000,
  },
  {
    monthKey: '2026-07',
    monthLabel: 'T7/26',
    collected: 1345000000,
    inTermRemaining: 42000000,
    overdue: 18000000,
    expenses: 935000000,
  },
  {
    monthKey: '2026-08',
    monthLabel: 'T8/26',
    collected: 1480000000,
    inTermRemaining: 55000000,
    overdue: 22000000,
    expenses: 1020000000,
  },
  {
    monthKey: '2026-09',
    monthLabel: 'T9/26',
    collected: 1590000000,
    inTermRemaining: 48000000,
    overdue: 26000000,
    expenses: 1085000000,
  },
  {
    monthKey: '2026-10',
    monthLabel: 'T10/26',
    collected: 1542000000,
    inTermRemaining: 68000000,
    overdue: 34000000,
    expenses: 1060000000,
  },
  {
    monthKey: '2026-11',
    monthLabel: 'T11/26',
    collected: 1450000000,
    inTermRemaining: 142000000,
    overdue: 46000000,
    expenses: 995000000,
  },
];

export const MOCK_CARE_WELLNESS_TREND: CareWellnessTrendPoint[] = [
  {
    dateKey: '2026-11-13',
    dayLabel: 'T6',
    fullDate: '13/11/2026',
    attendanceRate: 95.6,
    mealCompletionRate: 90.4,
    sleepQualityRate: 88.2,
    hydrationRate: 92.1,
  },
  {
    dateKey: '2026-11-14',
    dayLabel: 'T7',
    fullDate: '14/11/2026',
    attendanceRate: 92.1,
    mealCompletionRate: 88.5,
    sleepQualityRate: 86.0,
    hydrationRate: 90.5,
  },
  {
    dateKey: '2026-11-15',
    dayLabel: 'T2',
    fullDate: '15/11/2026',
    attendanceRate: 96.2,
    mealCompletionRate: 91.8,
    sleepQualityRate: 89.4,
    hydrationRate: 93.4,
  },
  {
    dateKey: '2026-11-16',
    dayLabel: 'T3',
    fullDate: '16/11/2026',
    attendanceRate: 95.3,
    mealCompletionRate: 92.4,
    sleepQualityRate: 90.1,
    hydrationRate: 94.0,
  },
  {
    dateKey: '2026-11-17',
    dayLabel: 'T4',
    fullDate: '17/11/2026',
    attendanceRate: 94.8,
    mealCompletionRate: 91.2,
    sleepQualityRate: 89.6,
    hydrationRate: 93.8,
  },
  {
    dateKey: '2026-11-18',
    dayLabel: 'T5',
    fullDate: '18/11/2026',
    attendanceRate: 93.9,
    mealCompletionRate: 89.7,
    sleepQualityRate: 87.9,
    hydrationRate: 91.2,
  },
  {
    dateKey: '2026-11-19',
    dayLabel: 'Hôm nay',
    fullDate: '19/11/2026',
    attendanceRate: 94.2,
    mealCompletionRate: 91.5,
    sleepQualityRate: 90.3,
    hydrationRate: 94.5,
  },
];

export const MOCK_CLASS_PERFORMANCE_MATRIX: ClassPerformanceRow[] = [
  {
    classId: 'lop-1a1',
    className: 'Lớp 1A1',
    gradeId: 'khoi-1',
    gradeName: 'Khối 1',
    homeroomTeacher: 'Cô Nguyễn Thị Mai',
    studentCount: 28,
    capacity: 30,
    attendanceRate: 96.4,
    presentCount: 27,
    absentCount: 1,
    mealCompletionRate: 92.6,
    rewardRate: 89.3,
    tuitionCollectionRate: 95.0,
    tuitionRemainingVnd: 6800000,
    status: 'stable',
  },
  {
    classId: 'lop-1a2',
    className: 'Lớp 1A2',
    gradeId: 'khoi-1',
    gradeName: 'Khối 1',
    homeroomTeacher: 'Cô Lê Thị Hương',
    studentCount: 29,
    capacity: 30,
    attendanceRate: 89.7,
    presentCount: 26,
    absentCount: 3,
    mealCompletionRate: 88.5,
    rewardRate: 82.8,
    tuitionCollectionRate: 76.5,
    tuitionRemainingVnd: 32500000,
    status: 'warning',
    alertNote: '7 phụ huynh chưa đóng học phí T11',
  },
  {
    classId: 'lop-1a3',
    className: 'Lớp 1A3',
    gradeId: 'khoi-1',
    gradeName: 'Khối 1',
    homeroomTeacher: 'Cô Trần Thanh Tâm',
    studentCount: 28,
    capacity: 30,
    attendanceRate: 96.4,
    presentCount: 27,
    absentCount: 1,
    mealCompletionRate: 94.0,
    rewardRate: 92.9,
    tuitionCollectionRate: 91.4,
    tuitionRemainingVnd: 11200000,
    status: 'stable',
  },
  {
    classId: 'lop-1a4',
    className: 'Lớp 1A4',
    gradeId: 'khoi-1',
    gradeName: 'Khối 1',
    homeroomTeacher: 'Cô Phạm Ngọc Hân',
    studentCount: 27,
    capacity: 30,
    attendanceRate: 92.6,
    presentCount: 25,
    absentCount: 2,
    mealCompletionRate: 92.0,
    rewardRate: 88.9,
    tuitionCollectionRate: 89.2,
    tuitionRemainingVnd: 14100000,
    status: 'stable',
  },
  {
    classId: 'lop-choi-1',
    className: 'Lớp Chồi 1',
    gradeId: 'khoi-mam',
    gradeName: 'Khối Mầm non',
    homeroomTeacher: 'Cô Vũ Thị Ngọc Lan',
    studentCount: 25,
    capacity: 25,
    attendanceRate: 92.0,
    presentCount: 23,
    absentCount: 2,
    mealCompletionRate: 78.3,
    rewardRate: 96.0,
    tuitionCollectionRate: 96.0,
    tuitionRemainingVnd: 4500000,
    status: 'warning',
    alertNote: 'Tỷ lệ ăn hết suất thấp (78.3%)',
  },
  {
    classId: 'lop-mam-1',
    className: 'Lớp Mầm 1',
    gradeId: 'khoi-mam',
    gradeName: 'Khối Mầm non',
    homeroomTeacher: 'Cô Đỗ Thị Bích',
    studentCount: 23,
    capacity: 25,
    attendanceRate: 95.7,
    presentCount: 22,
    absentCount: 1,
    mealCompletionRate: 90.9,
    rewardRate: 95.7,
    tuitionCollectionRate: 92.5,
    tuitionRemainingVnd: 8400000,
    status: 'stable',
  },
  {
    classId: 'lop-la-1',
    className: 'Lớp Lá 1',
    gradeId: 'khoi-mam',
    gradeName: 'Khối Mầm non',
    homeroomTeacher: 'Cô Hoàng Minh Châu',
    studentCount: 24,
    capacity: 25,
    attendanceRate: 95.8,
    presentCount: 23,
    absentCount: 1,
    mealCompletionRate: 91.3,
    rewardRate: 91.7,
    tuitionCollectionRate: 94.0,
    tuitionRemainingVnd: 6900000,
    status: 'stable',
  },
  {
    classId: 'lop-2a1',
    className: 'Lớp 2A1',
    gradeId: 'khoi-2',
    gradeName: 'Khối 2',
    homeroomTeacher: 'Cô Bùi Cẩm Tú',
    studentCount: 29,
    capacity: 32,
    attendanceRate: 100.0,
    presentCount: 29,
    absentCount: 0,
    mealCompletionRate: 96.6,
    rewardRate: 93.1,
    tuitionCollectionRate: 91.2,
    tuitionRemainingVnd: 12400000,
    status: 'stable',
  },
  {
    classId: 'lop-2a2',
    className: 'Lớp 2A2',
    gradeId: 'khoi-2',
    gradeName: 'Khối 2',
    homeroomTeacher: 'Thầy Nguyễn Quốc Bảo',
    studentCount: 28,
    capacity: 32,
    attendanceRate: 85.7,
    presentCount: 24,
    absentCount: 4,
    mealCompletionRate: 87.5,
    rewardRate: 85.7,
    tuitionCollectionRate: 79.4,
    tuitionRemainingVnd: 28600000,
    status: 'critical',
    alertNote: '3 HS có thân nhiệt >37.5°C, 4 HS nghỉ',
  },
  {
    classId: 'lop-2a3',
    className: 'Lớp 2A3',
    gradeId: 'khoi-2',
    gradeName: 'Khối 2',
    homeroomTeacher: 'Cô Lý Gia Hân',
    studentCount: 27,
    capacity: 31,
    attendanceRate: 96.3,
    presentCount: 26,
    absentCount: 1,
    mealCompletionRate: 92.3,
    rewardRate: 88.9,
    tuitionCollectionRate: 88.0,
    tuitionRemainingVnd: 16200000,
    status: 'stable',
  },
  {
    classId: 'lop-3a1',
    className: 'Lớp 3A1',
    gradeId: 'khoi-3',
    gradeName: 'Khối 3',
    homeroomTeacher: 'Cô Nguyễn Thu Hà',
    studentCount: 26,
    capacity: 30,
    attendanceRate: 96.2,
    presentCount: 25,
    absentCount: 1,
    mealCompletionRate: 96.0,
    rewardRate: 92.3,
    tuitionCollectionRate: 93.5,
    tuitionRemainingVnd: 8900000,
    status: 'stable',
  },
  {
    classId: 'lop-3a2',
    className: 'Lớp 3A2',
    gradeId: 'khoi-3',
    gradeName: 'Khối 3',
    homeroomTeacher: 'Thầy Trần Hữu Nghĩa',
    studentCount: 24,
    capacity: 30,
    attendanceRate: 95.8,
    presentCount: 23,
    absentCount: 1,
    mealCompletionRate: 91.3,
    rewardRate: 87.5,
    tuitionCollectionRate: 84.5,
    tuitionRemainingVnd: 19400000,
    status: 'stable',
  },
  {
    classId: 'lop-3a3',
    className: 'Lớp 3A3',
    gradeId: 'khoi-3',
    gradeName: 'Khối 3',
    homeroomTeacher: 'Cô Võ Thị Minh Anh',
    studentCount: 24,
    capacity: 30,
    attendanceRate: 91.7,
    presentCount: 22,
    absentCount: 2,
    mealCompletionRate: 90.9,
    rewardRate: 87.5,
    tuitionCollectionRate: 85.2,
    tuitionRemainingVnd: 18100000,
    status: 'stable',
  },
];

export const MOCK_WEEKLY_ACTIVITY_POSTS: WeeklyActivityDayPoint[] = [
  {
    dateKey: '2026-11-16',
    dayLabel: '16/11',
    fullDate: 'Thứ Hai, 16/11/2026',
    postCount: 2,
    heartCount: 18,
  },
  {
    dateKey: '2026-11-17',
    dayLabel: '17/11',
    fullDate: 'Thứ Ba, 17/11/2026',
    postCount: 3,
    heartCount: 26,
  },
  {
    dateKey: '2026-11-18',
    dayLabel: '18/11',
    fullDate: 'Thứ Tư, 18/11/2026',
    postCount: 4,
    heartCount: 39,
  },
  {
    dateKey: '2026-11-19',
    dayLabel: '19/11',
    fullDate: 'Hôm nay, 19/11/2026',
    postCount: 3,
    heartCount: 32,
  },
  {
    dateKey: '2026-11-20',
    dayLabel: '20/11',
    fullDate: 'Thứ Sáu, 20/11/2026',
    postCount: 5,
    heartCount: 48,
  },
  {
    dateKey: '2026-11-21',
    dayLabel: '21/11',
    fullDate: 'Thứ Bảy, 21/11/2026',
    postCount: 2,
    heartCount: 15,
  },
];

export const MOCK_BULLETIN_BOARD_ITEMS: BulletinBoardItem[] = [
  {
    id: 'bb-1',
    title: 'Kế hoạch tổ chức Lễ Kỷ niệm Ngày Nhà giáo Việt Nam 20/11',
    targetAudience: 'Toàn trường',
    timeAgo: '4 giờ',
  },
  {
    id: 'bb-2',
    title: 'Thời khóa biểu: Điều chỉnh lịch ngoại khóa tuần 12',
    targetAudience: 'Khối 1, Khối 2',
    timeAgo: '22 giờ',
    gradeId: 'khoi-1',
  },
  {
    id: 'bb-3',
    title: 'Thực đơn tuần: 16/11/2026 - 21/11/2026 (Chuẩn Tích Xanh)',
    targetAudience: 'Toàn bộ phụ huynh',
    timeAgo: '3 ngày',
  },
  {
    id: 'bb-4',
    title: 'Thông báo kiểm tra sức khỏe định kỳ & đo thị lực học kỳ I',
    targetAudience: 'Lớp 1A1, Lớp 1A2',
    timeAgo: '1 tuần',
    gradeId: 'khoi-1',
  },
  {
    id: 'bb-5',
    title: 'Lịch hoạt động dã ngoại Trang trại Giáo dục sinh thái',
    targetAudience: 'Khối Mầm non',
    timeAgo: '2 tuần',
    gradeId: 'khoi-mam',
  },
  {
    id: 'bb-6',
    title: 'Hướng dẫn đóng học phí tháng 11 qua cổng VietQR tích hợp',
    targetAudience: 'Toàn trường',
    timeAgo: '3 tuần',
  },
];

export const MOCK_APPROVAL_CENTER_ITEMS: ApprovalPendingClassItem[] = [
  {
    classId: 'lop-1a1',
    className: 'Lớp 1A1',
    gradeId: 'khoi-1',
    pendingCount: 2,
  },
  {
    classId: 'lop-la-1',
    className: 'Lớp Lá 1',
    gradeId: 'khoi-mam',
    pendingCount: 1,
  },
  {
    classId: 'lop-2a1',
    className: 'Lớp 2A1',
    gradeId: 'khoi-2',
    pendingCount: 3,
  },
];

export const MOCK_FREQUENT_ABSENCE_STUDENTS: FrequentAbsenceStudentItem[] = [
  {
    studentId: 'hs-2a2-01',
    studentName: 'Nguyễn Đức Huy',
    classId: 'lop-2a2',
    className: 'Lớp 2A2',
    gradeId: 'khoi-2',
    absentDays: 4,
    excusedDays: 3,
    unexcusedDays: 1,
  },
  {
    studentId: 'hs-1a2-04',
    studentName: 'Nguyễn Thị Thu Hằng',
    classId: 'lop-1a2',
    className: 'Lớp 1A2',
    gradeId: 'khoi-1',
    absentDays: 3,
    excusedDays: 3,
    unexcusedDays: 0,
  },
  {
    studentId: 'hs-choi1-02',
    studentName: 'Lê Nguyễn Diệu Hiển',
    classId: 'lop-choi-1',
    className: 'Lớp Chồi 1',
    gradeId: 'khoi-mam',
    absentDays: 3,
    excusedDays: 2,
    unexcusedDays: 1,
  },
  {
    studentId: 'hs-1a1-03',
    studentName: 'Lê Tuấn Kiệt',
    classId: 'lop-1a1',
    className: 'Lớp 1A1',
    gradeId: 'khoi-1',
    absentDays: 2,
    excusedDays: 2,
    unexcusedDays: 0,
  },
  {
    studentId: 'hs-3a3-05',
    studentName: 'Phạm Gia Hưng',
    classId: 'lop-3a3',
    className: 'Lớp 3A3',
    gradeId: 'khoi-3',
    absentDays: 2,
    excusedDays: 1,
    unexcusedDays: 1,
  },
];
```

### A.4. `app/src/store/slices/dashboardSlice.ts` (56 dòng)

```ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type {
  ClassMatrixStatus,
  DashboardFilterState,
  DashboardTimeRange,
} from '../../types/dashboard.ts';

const initialState: DashboardFilterState = {
  timeRange: 'month',
  gradeScope: 'all',
  searchQuery: '',
  statusFilter: 'all',
  lastRefreshedAt: '19/11/2026 15:00',
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setTimeRange: (state, action: PayloadAction<DashboardTimeRange>) => {
      state.timeRange = action.payload;
    },
    setGradeScope: (state, action: PayloadAction<string>) => {
      state.gradeScope = action.payload;
    },
    setDashboardSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setDashboardStatusFilter: (
      state,
      action: PayloadAction<'all' | ClassMatrixStatus>
    ) => {
      state.statusFilter = action.payload;
    },
    refreshDashboardData: (state, action: PayloadAction<string | undefined>) => {
      state.lastRefreshedAt = action.payload || 'Vừa xong';
    },
    resetDashboardFilters: (state) => {
      state.timeRange = 'month';
      state.gradeScope = 'all';
      state.searchQuery = '';
      state.statusFilter = 'all';
    },
  },
});

export const {
  setTimeRange,
  setGradeScope,
  setDashboardSearchQuery,
  setDashboardStatusFilter,
  refreshDashboardData,
  resetDashboardFilters,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
```

### A.5. `app/src/modules/dashboard/DashboardToolbar.tsx` (83 dòng)

```tsx
import React from 'react';
import {
  Button,
  FilterBar,
  SegmentedControl,
} from '@/components/ds';
import { DASHBOARD_GRADE_OPTIONS } from '@/services/mockDashboardData';
import type { DashboardTimeRange } from '@/types/dashboard';

interface DashboardToolbarProps {
  timeRange: DashboardTimeRange;
  gradeScope: string;
  lastRefreshedAt: string;
  onTimeRangeChange: (range: DashboardTimeRange) => void;
  onGradeScopeChange: (scope: string) => void;
  onRefresh: () => void;
  onExport: () => void;
}

export const DashboardToolbar: React.FC<DashboardToolbarProps> = ({
  timeRange,
  gradeScope,
  lastRefreshedAt,
  onTimeRangeChange,
  onGradeScopeChange,
  onRefresh,
  onExport,
}) => {
  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[var(--radius-12)] overflow-visible shadow-2xs">
      <FilterBar
        className="border-0 rounded-[var(--radius-12)]"
        search={false}
        filters={[
          {
            placeholder: 'Chọn khối lớp',
            value: gradeScope,
            defaultValue: 'all',
            onChange: onGradeScopeChange,
            options: DASHBOARD_GRADE_OPTIONS,
          },
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
            <span className="hidden xl:inline-flex items-center text-xs text-[var(--text-subtle)] mr-1 tabular-nums">
              Cập nhật: {lastRefreshedAt}
            </span>
            <Button
              variant="secondary"
              icon="arrow-rotate-right"
              onClick={onRefresh}
            >
              Làm mới
            </Button>
            <Button
              variant="secondary"
              icon="download"
              onClick={onExport}
            >
              Xuất báo cáo
            </Button>
          </div>
        }
      >
        <div className="w-full sm:w-auto overflow-x-auto no-scrollbar pb-0.5 sm:pb-0">
          <SegmentedControl<DashboardTimeRange>
            size="sm"
            className="w-max"
            value={timeRange}
            onChange={onTimeRangeChange}
            items={[
              { key: 'today', label: 'Hôm nay' },
              { key: 'week', label: 'Tuần này' },
              { key: 'month', label: 'Tháng này' },
              { key: 'term', label: 'Học kỳ I' },
              { key: 'year', label: 'Cả năm' },
            ]}
          />
        </div>
      </FilterBar>
    </div>
  );
};
```

### A.6. `app/src/modules/dashboard/ExecutiveKpiCards.tsx` (54 dòng)

```tsx
import React from 'react';
import { StatCard } from '@/components/ds';
import { formatVndCompact } from '@/utils/dashboardAnalytics';
import type { ExecutiveKPIBundle } from '@/types/dashboard';

interface ExecutiveKpiCardsProps {
  kpis: ExecutiveKPIBundle;
}

export const ExecutiveKpiCards: React.FC<ExecutiveKpiCardsProps> = ({ kpis }) => {
  return (
    <div
      data-testid="executive-kpi-cards"
      className="ecomd-stat-group"
      style={{ '--ecomd-cols': 4 } as React.CSSProperties}
    >
      {/* 1. Quy mô học sinh & Lấp đầy */}
      <StatCard
        label="Quy mô học sinh"
        value={`${kpis.totalStudents} / ${kpis.totalCapacity} HS`}
        icon="users"
        tone="neutral"
        sub={`${kpis.fillRate}% công suất • ${kpis.studentDeltaLabel}`}
      />

      {/* 2. Chuyên cần hôm nay */}
      <StatCard
        label="Tỷ lệ chuyên cần"
        value={`${kpis.attendanceRate}%`}
        icon="calendar-check"
        tone="info"
        sub={`${kpis.presentCount} có mặt • ${kpis.excusedAbsentCount} CP • ${kpis.unexcusedAbsentCount} KP`}
      />

      {/* 3. Thu học phí */}
      <StatCard
        label="Thu học phí kỳ này"
        value={`${kpis.tuitionCollectionRate}%`}
        icon="coins"
        tone="success"
        sub={`Đã thu ${formatVndCompact(kpis.tuitionCollectedVnd)} / ${formatVndCompact(kpis.tuitionTotalIssuedVnd)}`}
      />

      {/* 4. Chỉ số hài lòng CSAT */}
      <StatCard
        label="Chỉ số hài lòng (CSAT)"
        value={`${kpis.csatScore.toFixed(2)} / ${kpis.csatMax.toFixed(1)}`}
        icon="square-poll-vertical"
        tone="warning"
        sub={`${kpis.positivePollRate}% bình chọn tốt • ${kpis.parentAppAdoptionRate}% dùng App`}
      />
    </div>
  );
};
```

### A.7. `app/src/modules/dashboard/FinanceCashflowChart.tsx` (219 dòng)

```tsx
import React, { useState } from 'react';
import { formatVndCompact, formatVndCurrency } from '@/utils/dashboardAnalytics';
import type { MonthlyCashflowPoint } from '@/types/dashboard';

interface FinanceCashflowChartProps {
  data: MonthlyCashflowPoint[];
}

export const FinanceCashflowChart: React.FC<FinanceCashflowChartProps> = ({ data }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const chartHeight = 220;
  const chartWidth = 560;
  const padLeft = 56;
  const padRight = 16;
  const padTop = 16;
  const padBottom = 34;
  const plotW = chartWidth - padLeft - padRight;
  const plotH = chartHeight - padTop - padBottom;

  const totals = data.map((d) => d.collected + d.inTermRemaining + d.overdue);
  const rawMax = Math.max(...totals, 100_000_000);
  // Round ceiling to neat step
  const maxVal = rawMax * 1.12;

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((ratio) => ({
    ratio,
    value: maxVal * ratio,
    y: padTop + plotH * (1 - ratio),
  }));

  const barSlotW = data.length > 0 ? plotW / data.length : plotW;
  const barW = Math.min(36, Math.max(18, barSlotW * 0.46));

  const activePoint = hoveredIndex !== null ? data[hoveredIndex] : data[data.length - 1];
  const activeTotal = activePoint
    ? activePoint.collected + activePoint.inTermRemaining + activePoint.overdue
    : 0;
  const activeRate =
    activeTotal > 0 ? ((activePoint.collected / activeTotal) * 100).toFixed(1) : '0.0';

  return (
    <div
      data-testid="finance-cashflow-chart"
      className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[var(--radius-12)] p-4 sm:p-5 flex flex-col justify-between shadow-2xs min-w-0 h-full"
    >
      {/* Header & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
        <div>
          <h2 className="body-md-bold text-[var(--text-heading)]">
            Tiến Độ Dòng Tiền & Công Nợ Học Phí
          </h2>
          <p className="body-xs text-[var(--text-subtle)] mt-0.5">
            Theo dõi thực thu, công nợ trong hạn và quá hạn qua từng tháng
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--text-secondary)]">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[var(--color-semantic-green)] inline-block" />
            Đã thực thu
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[var(--color-semantic-orange)] inline-block" />
            Trong hạn
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[var(--color-danger)] inline-block" />
            Quá hạn &gt;30 ngày
          </span>
        </div>
      </div>

      {/* Selected / Hovered Summary Strip */}
      {activePoint && (
        <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 mb-3 rounded-[var(--radius-8)] bg-[var(--bg-sunken)] border border-[var(--border-subtle)] text-xs">
          <div className="font-semibold text-[var(--text-heading)]">
            Kỳ {activePoint.monthLabel}{' '}
            <span className="font-normal text-[var(--text-subtle)] ml-1">
              (Tỷ lệ thu: <strong className="text-[var(--color-semantic-green)]">{activeRate}%</strong>)
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3 font-tabular">
            <span className="text-[var(--color-semantic-green)] font-semibold">
              Thu: {formatVndCurrency(activePoint.collected)}
            </span>
            <span className="text-[var(--color-semantic-orange)] font-medium">
              Chờ thu: {formatVndCurrency(activePoint.inTermRemaining)}
            </span>
            <span className="text-[var(--color-danger)] font-medium">
              Quá hạn: {formatVndCurrency(activePoint.overdue)}
            </span>
          </div>
        </div>
      )}

      {/* Responsive SVG Stacked Bar Chart */}
      <div className="w-full overflow-x-auto no-scrollbar">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-auto min-w-[360px] select-none"
          role="img"
          aria-label="Biểu đồ cột chồng dòng tiền và công nợ học phí theo tháng"
        >
          {/* Horizontal gridlines & Y-axis labels */}
          {yTicks.map((t, i) => (
            <g key={i}>
              <line
                x1={padLeft}
                y1={t.y}
                x2={chartWidth - padRight}
                y2={t.y}
                stroke="var(--border-subtle)"
                strokeDasharray={i === 0 ? undefined : '3 3'}
                strokeWidth="1"
              />
              <text
                x={padLeft - 8}
                y={t.y + 4}
                textAnchor="end"
                fontSize="11"
                fill="var(--text-tertiary)"
              >
                {t.value === 0 ? '0' : formatVndCompact(t.value)}
              </text>
            </g>
          ))}

          {/* Stacked Bars */}
          {data.map((pt, idx) => {
            const xCenter = padLeft + barSlotW * idx + barSlotW / 2;
            const x = xCenter - barW / 2;

            const hCollected = (pt.collected / maxVal) * plotH;
            const hInTerm = (pt.inTermRemaining / maxVal) * plotH;
            const hOverdue = (pt.overdue / maxVal) * plotH;

            const yCollected = padTop + plotH - hCollected;
            const yInTerm = yCollected - hInTerm;
            const yOverdue = yInTerm - hOverdue;

            const isHovered = hoveredIndex === idx;

            return (
              <g
                key={pt.monthKey}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => setHoveredIndex(idx)}
              >
                {/* Subtle hover column highlight */}
                {isHovered && (
                  <rect
                    x={xCenter - barSlotW * 0.42}
                    y={padTop}
                    width={barSlotW * 0.84}
                    height={plotH}
                    rx={6}
                    fill="var(--bg-neutral-soft)"
                    opacity={0.75}
                  />
                )}

                {/* Collected (Bottom segment) */}
                <rect
                  x={x}
                  y={yCollected}
                  width={barW}
                  height={Math.max(0, hCollected)}
                  rx={pt.inTermRemaining === 0 && pt.overdue === 0 ? 4 : 0}
                  fill="var(--color-semantic-green)"
                  opacity={hoveredIndex !== null && !isHovered ? 0.65 : 0.92}
                />

                {/* In-term Remaining (Middle segment) */}
                {hInTerm > 0 && (
                  <rect
                    x={x}
                    y={yInTerm}
                    width={barW}
                    height={Math.max(1, hInTerm)}
                    fill="var(--color-semantic-orange)"
                    opacity={hoveredIndex !== null && !isHovered ? 0.65 : 0.92}
                  />
                )}

                {/* Overdue (Top segment) */}
                {hOverdue > 0 && (
                  <rect
                    x={x}
                    y={yOverdue}
                    width={barW}
                    height={Math.max(2, hOverdue)}
                    rx={3}
                    fill="var(--color-danger)"
                    opacity={hoveredIndex !== null && !isHovered ? 0.65 : 0.95}
                  />
                )}

                {/* X-axis month label */}
                <text
                  x={xCenter}
                  y={chartHeight - 10}
                  textAnchor="middle"
                  fontSize="11.5"
                  fontWeight={isHovered ? 700 : 500}
                  fill={isHovered ? 'var(--text-heading)' : 'var(--text-secondary)'}
                >
                  {pt.monthLabel}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
```

### A.8. `app/src/modules/dashboard/StudentCensusDonut.tsx` (225 dòng)

```tsx
import React, { useState } from 'react';
import { Button } from '@/components/ds';
import type { GradeCensusSummary } from '@/types/dashboard';

interface StudentCensusDonutProps {
  grades: GradeCensusSummary[];
  activeGradeScope: string;
  onSelectGrade: (gradeId: string) => void;
}

export const StudentCensusDonut: React.FC<StudentCensusDonutProps> = ({
  grades,
  activeGradeScope,
  onSelectGrade,
}) => {
  const [hoveredGradeId, setHoveredGradeId] = useState<string | null>(null);

  const totalStudents = grades.reduce((s, g) => s + g.studentCount, 0);
  const totalCapacity = grades.reduce((s, g) => s + g.capacity, 0);
  const totalFillPct =
    totalCapacity > 0 ? ((totalStudents / totalCapacity) * 100).toFixed(1) : '0.0';

  // SVG Donut ring geometry
  const size = 180;
  const center = size / 2;
  const radius = 64;
  const strokeWidth = 22;
  const circumference = 2 * Math.PI * radius;

  let cumulativeFraction = 0;
  const segments = grades.map((g) => {
    const fraction = totalStudents > 0 ? g.studentCount / totalStudents : 0;
    const dashArray = `${fraction * circumference} ${circumference}`;
    const dashOffset = -cumulativeFraction * circumference;
    cumulativeFraction += fraction;
    return {
      ...g,
      fraction,
      sharePct: (fraction * 100).toFixed(1),
      dashArray,
      dashOffset,
    };
  });

  const focusedGrade =
    segments.find((s) => s.gradeId === hoveredGradeId) ||
    (activeGradeScope !== 'all'
      ? segments.find((s) => s.gradeId === activeGradeScope)
      : null);

  return (
    <div
      data-testid="student-census-donut"
      className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[var(--radius-12)] p-4 sm:p-5 flex flex-col justify-between gap-4 shadow-2xs min-w-0 h-full"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="body-md-bold text-[var(--text-heading)]">
            Cơ Cấu Học Sinh & Lấp Đầy
          </h2>
          <p className="body-xs text-[var(--text-subtle)] mt-0.5">
            Phân bổ sĩ số theo khối lớp (Nhấn để lọc phạm vi)
          </p>
        </div>

        {activeGradeScope !== 'all' && (
          <Button
            variant="text"
            onClick={() => onSelectGrade('all')}
          >
            Xem tất cả
          </Button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-5 my-auto py-2">
        {/* Pure SVG Donut */}
        <div className="relative flex-none flex items-center justify-center">
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="-rotate-90 select-none"
            role="img"
            aria-label="Biểu đồ tròn phân bổ học sinh theo khối"
          >
            {/* Background track */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="var(--bg-neutral-soft)"
              strokeWidth={strokeWidth}
            />

            {segments.map((seg) => {
              const isSelected = activeGradeScope === seg.gradeId;
              const isHovered = hoveredGradeId === seg.gradeId;
              const isDimmed =
                (hoveredGradeId && !isHovered) ||
                (activeGradeScope !== 'all' && !isSelected);

              return (
                <circle
                  key={seg.gradeId}
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="none"
                  stroke={seg.colorHex}
                  strokeWidth={isHovered || isSelected ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={seg.dashArray}
                  strokeDashoffset={seg.dashOffset}
                  opacity={isDimmed ? 0.35 : 1}
                  className="cursor-pointer transition-all duration-150"
                  onMouseEnter={() => setHoveredGradeId(seg.gradeId)}
                  onMouseLeave={() => setHoveredGradeId(null)}
                  onClick={() =>
                    onSelectGrade(
                      activeGradeScope === seg.gradeId ? 'all' : seg.gradeId
                    )
                  }
                />
              );
            })}
          </svg>

          {/* Center summary overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-4">
            <span className="text-[11px] font-medium text-[var(--text-subtle)] uppercase tracking-wide">
              {focusedGrade ? focusedGrade.gradeName : 'Toàn trường'}
            </span>
            <span className="text-xl font-extrabold text-[var(--text-heading)] font-tabular leading-tight mt-0.5">
              {focusedGrade ? focusedGrade.studentCount : totalStudents} HS
            </span>
            <span className="text-[11px] font-semibold text-[var(--eco-blue-strong)] mt-0.5">
              {focusedGrade ? `${focusedGrade.sharePct}% sĩ số` : `${totalFillPct}% lấp đầy`}
            </span>
          </div>
        </div>

        {/* Grade Breakdown & Capacity Bars */}
        <div className="flex-1 w-full space-y-2.5 min-w-0">
          {segments.map((seg) => {
            const fillRatio =
              seg.capacity > 0 ? Math.round((seg.studentCount / seg.capacity) * 100) : 0;
            const isSelected = activeGradeScope === seg.gradeId;

            return (
              <div
                key={seg.gradeId}
                role="button"
                tabIndex={0}
                onMouseEnter={() => setHoveredGradeId(seg.gradeId)}
                onMouseLeave={() => setHoveredGradeId(null)}
                onClick={() =>
                  onSelectGrade(
                    activeGradeScope === seg.gradeId ? 'all' : seg.gradeId
                  )
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectGrade(
                      activeGradeScope === seg.gradeId ? 'all' : seg.gradeId
                    );
                  }
                }}
                className={`p-2 rounded-[var(--radius-8)] border transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[var(--bg-neutral-soft)] border-[var(--eco-blue)]'
                    : 'bg-transparent border-transparent hover:bg-[var(--bg-sunken)] hover:border-[var(--border-subtle)]'
                }`}
              >
                <div className="flex items-center justify-between gap-2 text-xs mb-1">
                  <span className="inline-flex items-center gap-1.5 font-semibold text-[var(--text-heading)] whitespace-nowrap">
                    <span
                      className="w-2.5 h-2.5 rounded-xs shrink-0"
                      style={{ backgroundColor: seg.colorHex }}
                    />
                    <span>{seg.gradeName}</span>
                    <span className="font-normal text-[var(--text-subtle)]">
                      ({seg.classCount} lớp)
                    </span>
                  </span>
                  <span className="font-tabular font-semibold text-[var(--text-heading)] whitespace-nowrap">
                    {seg.studentCount}/{seg.capacity}{' '}
                    <span className="text-[var(--text-subtle)] font-normal">
                      ({fillRatio}%)
                    </span>
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-1.5 rounded-full bg-[var(--bg-neutral-soft)] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(100, fillRatio)}%`,
                      backgroundColor: seg.colorHex,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Capacity Summary */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 rounded-[var(--radius-8)] bg-[var(--bg-sunken)] border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)]">
        <span>
          Tổng cộng <strong className="text-[var(--text-heading)]">{grades.reduce((s, g) => s + g.classCount, 0)} lớp</strong> đang vận hành
        </span>
        <span className="font-tabular">
          Chỉ tiêu còn trống:{' '}
          <strong className="text-[var(--eco-blue-strong)]">
            {Math.max(0, totalCapacity - totalStudents)} chỗ
          </strong>
        </span>
      </div>
    </div>
  );
};
```

### A.9. `app/src/modules/dashboard/CareWellnessTrendChart.tsx` (258 dòng)

```tsx
import React, { useState } from 'react';
import type { CareWellnessTrendPoint } from '@/types/dashboard';

interface CareWellnessTrendChartProps {
  data: CareWellnessTrendPoint[];
}

export const CareWellnessTrendChart: React.FC<CareWellnessTrendChartProps> = ({ data }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const chartWidth = 560;
  const chartHeight = 220;
  const padLeft = 44;
  const padRight = 32;
  const padTop = 18;
  const padBottom = 34;
  const plotW = chartWidth - padLeft - padRight;
  const plotH = chartHeight - padTop - padBottom;

  const yMin = 70;
  const yMax = 100;
  const yTicks = [70, 80, 90, 100];

  const getX = (idx: number) =>
    data.length <= 1 ? padLeft + plotW / 2 : padLeft + (plotW / (data.length - 1)) * idx;

  const getY = (val: number) => {
    const clamped = Math.min(yMax, Math.max(yMin, val));
    return padTop + plotH * (1 - (clamped - yMin) / (yMax - yMin));
  };

  const buildPolyline = (accessor: (pt: CareWellnessTrendPoint) => number) =>
    data.map((pt, i) => `${getX(i).toFixed(1)},${getY(accessor(pt)).toFixed(1)}`).join(' ');

  const buildAreaPath = (accessor: (pt: CareWellnessTrendPoint) => number) => {
    if (data.length === 0) return '';
    const linePts = data
      .map((pt, i) => `${getX(i).toFixed(1)},${getY(accessor(pt)).toFixed(1)}`)
      .join(' L ');
    const lastX = getX(data.length - 1).toFixed(1);
    const firstX = getX(0).toFixed(1);
    const bottomY = (padTop + plotH).toFixed(1);
    return `M ${firstX},${bottomY} L ${linePts} L ${lastX},${bottomY} Z`;
  };

  const activePoint = hoveredIdx !== null ? data[hoveredIdx] : data[data.length - 1];

  return (
    <div
      data-testid="care-wellness-trend-chart"
      className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[var(--radius-12)] p-4 sm:p-5 flex flex-col justify-between shadow-2xs min-w-0 h-full"
    >
      {/* Header & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
        <div>
          <h2 className="body-md-bold text-[var(--text-heading)]">
            Xu Hướng Chuyên Cần & Chăm Sóc (7 Ngày)
          </h2>
          <p className="body-xs text-[var(--text-subtle)] mt-0.5">
            Tương quan tỷ lệ đi học, ăn hết suất và giấc ngủ trưa
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--text-secondary)]">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--eco-blue)] inline-block" />
            Có mặt
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-semantic-green)] inline-block" />
            Ăn hết suất
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-semantic-orange)] inline-block" />
            Ngủ sâu giấc
          </span>
        </div>
      </div>

      {/* Interactive Daily Summary Strip */}
      {activePoint && (
        <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 mb-3 rounded-[var(--radius-8)] bg-[var(--bg-sunken)] border border-[var(--border-subtle)] text-xs">
          <div className="font-semibold text-[var(--text-heading)]">
            {activePoint.dayLabel} ({activePoint.fullDate})
          </div>
          <div className="flex flex-wrap items-center gap-3 font-tabular">
            <span className="text-[var(--eco-blue)] font-semibold">
              Có mặt: {activePoint.attendanceRate}%
            </span>
            <span className="text-[var(--color-semantic-green)] font-semibold">
              Ăn hết suất: {activePoint.mealCompletionRate}%
            </span>
            <span className="text-[var(--color-semantic-orange)] font-semibold">
              Ngủ sâu: {activePoint.sleepQualityRate}%
            </span>
          </div>
        </div>
      )}

      {/* Multi-series SVG Area Chart */}
      <div className="w-full overflow-x-auto no-scrollbar">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-auto min-w-[360px] select-none"
          role="img"
          aria-label="Biểu đồ xu hướng chuyên cần và chăm sóc 7 ngày gần nhất"
        >
          <defs>
            <linearGradient id="ecoBlueArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--eco-blue)" stopOpacity="0.18" />
              <stop offset="100%" stopColor="var(--eco-blue)" stopOpacity="0.01" />
            </linearGradient>
            <linearGradient id="ecoGreenArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-semantic-green)" stopOpacity="0.14" />
              <stop offset="100%" stopColor="var(--color-semantic-green)" stopOpacity="0.01" />
            </linearGradient>
          </defs>

          {/* Horizontal Y gridlines */}
          {yTicks.map((val) => {
            const y = getY(val);
            return (
              <g key={val}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={chartWidth - padRight}
                  y2={y}
                  stroke="var(--border-subtle)"
                  strokeDasharray={val === 70 ? undefined : '3 3'}
                  strokeWidth="1"
                />
                <text
                  x={padLeft - 8}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="11"
                  fill="var(--text-tertiary)"
                >
                  {val}%
                </text>
              </g>
            );
          })}

          {/* Area Fills */}
          <path d={buildAreaPath((d) => d.attendanceRate)} fill="url(#ecoBlueArea)" />
          <path d={buildAreaPath((d) => d.mealCompletionRate)} fill="url(#ecoGreenArea)" />

          {/* Series Polylines */}
          <polyline
            fill="none"
            stroke="var(--color-semantic-orange)"
            strokeWidth="2"
            strokeDasharray="4 3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={buildPolyline((d) => d.sleepQualityRate)}
          />
          <polyline
            fill="none"
            stroke="var(--color-semantic-green)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={buildPolyline((d) => d.mealCompletionRate)}
          />
          <polyline
            fill="none"
            stroke="var(--eco-blue)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={buildPolyline((d) => d.attendanceRate)}
          />

          {/* Interactive Vertical Hover Strip + Dots */}
          {data.map((pt, idx) => {
            const cx = getX(idx);
            const isHovered = hoveredIdx === idx;
            const slotW = data.length > 1 ? plotW / (data.length - 1) : plotW;

            return (
              <g
                key={pt.dateKey}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                onClick={() => setHoveredIdx(idx)}
              >
                {isHovered && (
                  <line
                    x1={cx}
                    y1={padTop}
                    x2={cx}
                    y2={padTop + plotH}
                    stroke="var(--border-default)"
                    strokeDasharray="3 3"
                    strokeWidth="1.2"
                  />
                )}

                {/* Invisible wide hit-area */}
                <rect
                  x={cx - slotW / 2}
                  y={padTop}
                  width={slotW}
                  height={plotH + padBottom}
                  fill="transparent"
                />

                {/* Sleep dot */}
                <circle
                  cx={cx}
                  cy={getY(pt.sleepQualityRate)}
                  r={isHovered ? 4.5 : 3}
                  fill="var(--bg-surface)"
                  stroke="var(--color-semantic-orange)"
                  strokeWidth="2"
                />
                {/* Meal dot */}
                <circle
                  cx={cx}
                  cy={getY(pt.mealCompletionRate)}
                  r={isHovered ? 5 : 3.5}
                  fill="var(--bg-surface)"
                  stroke="var(--color-semantic-green)"
                  strokeWidth="2.2"
                />
                {/* Attendance dot */}
                <circle
                  cx={cx}
                  cy={getY(pt.attendanceRate)}
                  r={isHovered ? 5.5 : 3.5}
                  fill="var(--eco-blue)"
                  stroke="var(--bg-surface)"
                  strokeWidth="2"
                />

                {/* X-axis label */}
                <text
                  x={cx}
                  y={chartHeight - 10}
                  textAnchor="middle"
                  fontSize="11.5"
                  fontWeight={isHovered || idx === data.length - 1 ? 700 : 500}
                  fill={isHovered ? 'var(--text-heading)' : 'var(--text-secondary)'}
                >
                  {pt.dayLabel}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
```

### A.10. `app/src/modules/dashboard/WeeklyActivityChart.tsx` (249 dòng)

```tsx
import React, { useState } from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ds';
import type { WeeklyActivityDayPoint } from '@/types/dashboard';

interface WeeklyActivityChartProps {
  data: WeeklyActivityDayPoint[];
  schoolCode: string;
}

const HEART_SVG_PATH =
  'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z';

export const WeeklyActivityChart: React.FC<WeeklyActivityChartProps> = ({
  data,
  schoolCode,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const chartWidth = 560;
  const chartHeight = 220;
  const padLeft = 40;
  const padRight = 38;
  const padTop = 20;
  const padBottom = 34;
  const plotW = chartWidth - padLeft - padRight;
  const plotH = chartHeight - padTop - padBottom;

  const maxPosts = Math.max(...data.map((d) => d.postCount), 4);
  const yPostMax = Math.max(4, Math.ceil(maxPosts / 4) * 4);
  const maxHearts = Math.max(...data.map((d) => d.heartCount), 20);
  const yHeartMax = Math.max(20, Math.ceil(maxHearts / 20) * 20);

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((r) => ({
    ratio: r,
    postVal: Math.round(yPostMax * r),
    heartVal: Math.round(yHeartMax * r),
    y: padTop + plotH * (1 - r),
  }));

  const barSlotW = data.length > 0 ? plotW / data.length : plotW;
  const barW = Math.min(34, Math.max(18, barSlotW * 0.42));

  const getX = (idx: number) => padLeft + barSlotW * idx + barSlotW / 2;
  const getPostY = (val: number) =>
    padTop + plotH * (1 - Math.min(1, val / Math.max(1, yPostMax)));
  const getHeartY = (val: number) =>
    padTop + plotH * (1 - Math.min(1, val / Math.max(1, yHeartMax)));

  const heartLinePoints = data
    .map((pt, i) => `${getX(i).toFixed(1)},${getHeartY(pt.heartCount).toFixed(1)}`)
    .join(' ');

  const activePoint =
    hoveredIdx !== null ? data[hoveredIdx] : data[Math.min(3, data.length - 1)];

  return (
    <div
      data-testid="weekly-activity-chart"
      className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[var(--radius-12)] p-4 sm:p-5 flex flex-col justify-between shadow-2xs min-w-0 h-full"
    >
      {/* Header & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="body-md-bold text-[var(--text-heading)]">
              Hoạt Động Trong Tuần
            </h2>
            <Link
              href={`/${schoolCode}/class/lop-1a1/activity`}
              className="text-xs font-semibold text-[var(--eco-blue-strong)] hover:underline inline-flex items-center gap-1"
            >
              <span>Chi tiết</span>
              <Icon name="arrow-right" size={10} />
            </Link>
          </div>
          <p className="body-xs text-[var(--text-subtle)] mt-0.5">
            Số lượng bài đăng Hoạt động và lượt thả tim của phụ huynh
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--text-secondary)]">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[var(--eco-blue)] inline-block" />
            Số bài hoạt động
          </span>
          <span className="inline-flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 24 24" className="shrink-0">
              <path d={HEART_SVG_PATH} fill="#ec4899" />
            </svg>
            Lượt tim phụ huynh
          </span>
        </div>
      </div>

      {/* Selected / Hovered Day Summary Strip */}
      {activePoint && (
        <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 mb-3 rounded-[var(--radius-8)] bg-[var(--bg-sunken)] border border-[var(--border-subtle)] text-xs">
          <div className="font-semibold text-[var(--text-heading)]">
            {activePoint.fullDate}
          </div>
          <div className="flex flex-wrap items-center gap-4 font-tabular">
            <span className="text-[var(--eco-blue-strong)] font-semibold">
              Bài hoạt động: {activePoint.postCount} bài
            </span>
            <span className="text-pink-600 font-semibold inline-flex items-center gap-1">
              <svg width="11" height="11" viewBox="0 0 24 24">
                <path d={HEART_SVG_PATH} fill="#ec4899" />
              </svg>
              Lượt tim: {activePoint.heartCount} tim
            </span>
          </div>
        </div>
      )}

      {/* Dual-metric SVG Chart: Posts Bar + Hearts Curve */}
      <div className="w-full overflow-x-auto no-scrollbar">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-auto min-w-[360px] select-none"
          role="img"
          aria-label="Biểu đồ bài đăng hoạt động và lượt tim phụ huynh trong tuần"
        >
          {/* Horizontal gridlines + dual Y-axis ticks */}
          {yTicks.map((t, i) => (
            <g key={i}>
              <line
                x1={padLeft}
                y1={t.y}
                x2={chartWidth - padRight}
                y2={t.y}
                stroke="var(--border-subtle)"
                strokeDasharray={i === 0 ? undefined : '3 3'}
                strokeWidth="1"
              />
              <text
                x={padLeft - 8}
                y={t.y + 4}
                textAnchor="end"
                fontSize="11"
                fill="var(--text-tertiary)"
              >
                {t.postVal}
              </text>
              <text
                x={chartWidth - padRight + 8}
                y={t.y + 4}
                textAnchor="start"
                fontSize="10.5"
                fill="#ec4899"
                opacity={0.85}
              >
                {t.heartVal}
              </text>
            </g>
          ))}

          {/* Activity Post Bars */}
          {data.map((pt, idx) => {
            const xCenter = getX(idx);
            const x = xCenter - barW / 2;
            const yTop = getPostY(pt.postCount);
            const hBar = Math.max(0, padTop + plotH - yTop);
            const isHovered = hoveredIdx === idx;

            return (
              <g
                key={pt.dateKey}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                onClick={() => setHoveredIdx(idx)}
              >
                {isHovered && (
                  <rect
                    x={xCenter - barSlotW * 0.42}
                    y={padTop}
                    width={barSlotW * 0.84}
                    height={plotH}
                    rx={6}
                    fill="var(--bg-neutral-soft)"
                    opacity={0.75}
                  />
                )}

                <rect
                  x={x}
                  y={yTop}
                  width={barW}
                  height={hBar}
                  rx={4}
                  fill="var(--eco-blue)"
                  opacity={hoveredIdx !== null && !isHovered ? 0.6 : 0.9}
                />

                {/* X-axis label */}
                <text
                  x={xCenter}
                  y={chartHeight - 10}
                  textAnchor="middle"
                  fontSize="11.5"
                  fontWeight={isHovered || pt.dayLabel === '19/11' ? 700 : 500}
                  fill={isHovered ? 'var(--text-heading)' : 'var(--text-secondary)'}
                >
                  {pt.dayLabel}
                </text>
              </g>
            );
          })}

          {/* Dashed Pink Line connecting Parent Hearts */}
          <polyline
            fill="none"
            stroke="#ec4899"
            strokeWidth="2"
            strokeDasharray="4 3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={heartLinePoints}
            className="pointer-events-none"
          />

          {/* Heart Markers on Curve */}
          {data.map((pt, idx) => {
            const cx = getX(idx);
            const cy = getHeartY(pt.heartCount);
            const isHovered = hoveredIdx === idx;
            const scale = isHovered ? 0.85 : 0.68;

            return (
              <g
                key={`heart-${pt.dateKey}`}
                transform={`translate(${cx - 12 * scale}, ${cy - 12 * scale}) scale(${scale})`}
                className="pointer-events-none"
              >
                <path
                  d={HEART_SVG_PATH}
                  fill="#ec4899"
                  stroke="var(--bg-surface)"
                  strokeWidth="2"
                />
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
```

### A.11. `app/src/modules/dashboard/BulletinBoardCard.tsx` (100 dòng)

```tsx
import React from 'react';
import Link from 'next/link';
import { EmptyState, Icon, Tag } from '@/components/ds';
import type { BulletinBoardItem } from '@/types/dashboard';

interface BulletinBoardCardProps {
  items: BulletinBoardItem[];
  schoolCode: string;
}

export const BulletinBoardCard: React.FC<BulletinBoardCardProps> = ({
  items,
  schoolCode,
}) => {
  return (
    <div
      data-testid="bulletin-board-card"
      className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[var(--radius-12)] p-4 sm:p-5 flex flex-col justify-between shadow-2xs min-w-0 h-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-[var(--radius-8)] bg-[var(--semantic-info-soft)] flex items-center justify-center shrink-0">
            <Icon name="bullhorn" size={14} color="var(--eco-blue-strong)" />
          </div>
          <h2 className="body-md-bold text-[var(--text-heading)]">
            Bảng Thông Tin
          </h2>
        </div>

        <Link
          href={`/${schoolCode}/school/announcements`}
          className="text-xs font-semibold text-[var(--eco-blue-strong)] hover:underline inline-flex items-center gap-1"
        >
          <span>Xem tất cả</span>
          <Icon name="arrow-right" size={10} />
        </Link>
      </div>

      {/* Scrollable DS Table */}
      <div className="flex-1 border border-[var(--border-subtle)] rounded-[var(--radius-8)] overflow-hidden flex flex-col">
        <div className="max-h-[290px] overflow-y-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-10 bg-[var(--bg-subtle)] border-b border-[var(--border-default)]">
              <tr>
                <th className="py-2.5 px-3 text-xs font-semibold text-[var(--text-subtle)]">
                  Tiêu đề
                </th>
                <th className="py-2.5 px-3 text-xs font-semibold text-[var(--text-subtle)] text-right whitespace-nowrap w-20">
                  Ngày gửi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={2} className="p-4">
                    <EmptyState
                      icon="bullhorn"
                      title="Chưa có thông báo mới"
                      description="Không có bản tin nào trong phạm vi đã chọn."
                    />
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-[var(--bg-sunken)] transition-colors"
                  >
                    <td className="py-2.5 px-3 align-top">
                      <Link
                        href={`/${schoolCode}/school/announcements`}
                        className="text-[13px] font-semibold text-[var(--eco-blue-strong)] hover:underline line-clamp-2 leading-snug"
                      >
                        {item.title}
                      </Link>
                      <div className="mt-1 flex items-center gap-1.5 text-[11px] text-[var(--text-subtle)]">
                        <span>Gửi đến</span>
                        <Tag variant="default">{item.targetAudience}</Tag>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-right align-top text-xs text-[var(--text-subtle)] whitespace-nowrap font-tabular">
                      {item.timeAgo}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-2.5 text-[11px] text-[var(--text-subtle)] flex items-center justify-between">
        <span>Tổng số: {items.length} bản tin gần nhất</span>
        <span>Đồng bộ từ Bảng thông tin</span>
      </div>
    </div>
  );
};
```

### A.12. `app/src/modules/dashboard/ApprovalCenterCard.tsx` (128 dòng)

```tsx
import React from 'react';
import Link from 'next/link';
import { EmptyState, Icon, IconButton, StatusTag } from '@/components/ds';
import type { ApprovalPendingClassItem } from '@/types/dashboard';

interface ApprovalCenterCardProps {
  items: ApprovalPendingClassItem[];
  schoolCode: string;
  onRefresh: () => void;
}

export const ApprovalCenterCard: React.FC<ApprovalCenterCardProps> = ({
  items,
  schoolCode,
  onRefresh,
}) => {
  const totalPending = items.reduce((s, it) => s + it.pendingCount, 0);

  return (
    <div
      data-testid="approval-center-card"
      className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[var(--radius-12)] p-4 sm:p-5 flex flex-col justify-between shadow-2xs min-w-0 h-full"
    >
      {/* Header */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-[var(--radius-8)] bg-[var(--semantic-warning-soft)] flex items-center justify-center shrink-0">
              <Icon
                name="clipboard-list"
                size={14}
                color="var(--semantic-warning-strong)"
              />
            </div>
            <h2 className="body-md-bold text-[var(--text-heading)]">
              Trung Tâm Kiểm Duyệt
            </h2>
          </div>

          <IconButton
            icon="arrow-rotate-right"
            size="sm"
            label="Làm mới danh sách kiểm duyệt"
            onClick={onRefresh}
          />
        </div>

        <div className="flex items-center justify-between text-xs font-semibold text-[var(--eco-blue-strong)] mb-2.5">
          <span>Hoạt động chờ duyệt</span>
          <StatusTag
            tone={totalPending > 0 ? 'warning' : 'success'}
            label={totalPending > 0 ? `${totalPending} chờ duyệt` : 'Đã duyệt hết'}
          />
        </div>
      </div>

      {/* Table Content */}
      <div className="flex-1 border border-[var(--border-subtle)] rounded-[var(--radius-8)] overflow-hidden flex flex-col">
        <div className="max-h-[260px] overflow-y-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-10 bg-[var(--bg-subtle)] border-b border-[var(--border-default)]">
              <tr>
                <th className="py-2.5 px-3 text-xs font-semibold text-[var(--text-subtle)]">
                  Lớp học
                </th>
                <th className="py-2.5 px-3 text-xs font-semibold text-[var(--text-subtle)] text-right whitespace-nowrap">
                  Hoạt động chờ duyệt
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={2} className="p-4">
                    <EmptyState
                      icon="circle-check"
                      title="Chưa có hoạt động cần duyệt"
                      description="Tất cả bài đăng hoạt động trong phạm vi đã được phê duyệt."
                    />
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr
                    key={item.classId}
                    className="hover:bg-[var(--bg-sunken)] transition-colors"
                  >
                    <td className="py-2.5 px-3">
                      <Link
                        href={`/${schoolCode}/class/${item.classId}/activity?tab=cho_duyet`}
                        className="text-[13px] font-semibold text-[var(--eco-blue-strong)] hover:underline"
                      >
                        {item.className}
                      </Link>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <Link
                        href={`/${schoolCode}/class/${item.classId}/activity?tab=cho_duyet`}
                        className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[var(--color-semantic-orange)] hover:underline font-tabular"
                      >
                        <span>{item.pendingCount} bài</span>
                        <Icon name="arrow-right" size={10} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Total Count */}
      <div className="mt-2.5 flex items-center justify-between text-[11px] text-[var(--text-subtle)]">
        <span className="inline-flex items-center gap-1.5 font-medium text-[var(--text-secondary)]">
          <Icon name="clipboard-list" size={12} />
          Tổng: <strong className="text-[var(--text-heading)]">{totalPending}</strong>
        </span>
        <Link
          href={`/${schoolCode}/class/lop-1a1/activity`}
          className="font-semibold text-[var(--eco-blue-strong)] hover:underline"
        >
          Mở danh sách Hoạt động →
        </Link>
      </div>
    </div>
  );
};
```

### A.13. `app/src/modules/dashboard/FrequentAbsenceCard.tsx` (108 dòng)

```tsx
import React from 'react';
import Link from 'next/link';
import { EmptyState, Icon, StatusTag, Tag } from '@/components/ds';
import type { FrequentAbsenceStudentItem } from '@/types/dashboard';

interface FrequentAbsenceCardProps {
  items: FrequentAbsenceStudentItem[];
  schoolCode: string;
  monthLabel?: string;
}

export const FrequentAbsenceCard: React.FC<FrequentAbsenceCardProps> = ({
  items,
  schoolCode,
  monthLabel = 'tháng 11',
}) => {
  return (
    <div
      data-testid="frequent-absence-card"
      className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[var(--radius-12)] p-4 sm:p-5 flex flex-col justify-between shadow-2xs min-w-0 h-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-[var(--radius-8)] bg-[var(--semantic-danger-soft)] flex items-center justify-center shrink-0">
            <Icon name="user-clock" size={14} color="var(--color-danger)" />
          </div>
          <h2 className="text-[15px] font-bold text-[var(--text-heading)] leading-snug truncate">
            Học Sinh Vắng Nhiều ({monthLabel})
          </h2>
        </div>

        <Link
          href={`/${schoolCode}/reports/attendance`}
          className="text-xs font-semibold text-[var(--eco-blue-strong)] hover:underline inline-flex items-center gap-1 whitespace-nowrap shrink-0"
        >
          <span>Báo cáo</span>
          <Icon name="arrow-right" size={10} />
        </Link>
      </div>

      {/* Table Content */}
      <div className="flex-1 border border-[var(--border-subtle)] rounded-[var(--radius-8)] overflow-hidden flex flex-col">
        <div className="max-h-[290px] overflow-y-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-10 bg-[var(--bg-subtle)] border-b border-[var(--border-default)]">
              <tr>
                <th className="py-2.5 px-3 text-xs font-semibold text-[var(--text-subtle)]">
                  Họ và tên
                </th>
                <th className="py-2.5 px-3 text-xs font-semibold text-[var(--text-subtle)] text-right whitespace-nowrap">
                  Số ngày vắng
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={2} className="p-4">
                    <EmptyState
                      icon="circle-check"
                      title="Chưa có học sinh vắng nhiều"
                      description="Tỷ lệ chuyên cần trong tháng đang duy trì rất tốt."
                    />
                  </td>
                </tr>
              ) : (
                items.map((st) => (
                  <tr
                    key={st.studentId}
                    className="hover:bg-[var(--bg-sunken)] transition-colors"
                  >
                    <td className="py-2.5 px-3 align-top">
                      <Link
                        href={`/${schoolCode}/class/lop-1a1/attendance`}
                        className="text-[13px] font-semibold text-[var(--eco-blue-strong)] hover:underline block"
                      >
                        {st.studentName}
                      </Link>
                      <div className="mt-1 flex items-center gap-1.5 text-[11px] text-[var(--text-subtle)]">
                        <Tag variant="default">{st.className}</Tag>
                        <span>
                          {st.excusedDays} CP
                          {st.unexcusedDays > 0 ? ` • ${st.unexcusedDays} KP` : ''}
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-right align-top whitespace-nowrap">
                      <StatusTag
                        tone={st.absentDays >= 4 || st.unexcusedDays > 0 ? 'danger' : 'warning'}
                        label={`${st.absentDays} ngày`}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-2.5 text-[11px] text-[var(--text-subtle)] flex items-center justify-between gap-2">
        <span>Theo dõi: {items.length} HS</span>
        <span>Giảm dần theo số ngày nghỉ</span>
      </div>
    </div>
  );
};
```

### A.14. `app/src/modules/dashboard/ClassComparisonTable.tsx` (324 dòng)

```tsx
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  CountedTabs,
  DropdownMenu,
  EmptyState,
  FilterBar,
  IconButton,
  StatusTag,
  Tag,
} from '@/components/ds';
import { DASHBOARD_GRADE_OPTIONS } from '@/services/mockDashboardData';
import { formatVndCurrency } from '@/utils/dashboardAnalytics';
import type {
  ClassMatrixStatus,
  ClassPerformanceRow,
} from '@/types/dashboard';

interface ClassComparisonTableProps {
  rows: ClassPerformanceRow[];
  allGradeFilteredRows: ClassPerformanceRow[];
  schoolCode: string;
  searchQuery: string;
  gradeScope: string;
  statusFilter: 'all' | ClassMatrixStatus;
  onSearchChange: (q: string) => void;
  onGradeScopeChange: (scope: string) => void;
  onStatusFilterChange: (status: 'all' | ClassMatrixStatus) => void;
}

export const ClassComparisonTable: React.FC<ClassComparisonTableProps> = ({
  rows,
  allGradeFilteredRows,
  schoolCode,
  searchQuery,
  gradeScope,
  statusFilter,
  onSearchChange,
  onGradeScopeChange,
  onStatusFilterChange,
}) => {
  const router = useRouter();

  const stableCount = allGradeFilteredRows.filter((r) => r.status === 'stable').length;
  const warningCount = allGradeFilteredRows.filter((r) => r.status === 'warning').length;
  const criticalCount = allGradeFilteredRows.filter((r) => r.status === 'critical').length;

  return (
    <div
      data-testid="class-comparison-table"
      className="ecomd-table-card w-full max-w-full"
    >
      {/* Card Title Header */}
      <div className="px-4 pt-4 pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[var(--bg-surface)]">
        <div>
          <h2 className="body-md-bold text-[var(--text-heading)]">
            Ma Trận Hiệu Suất Theo Lớp Học
          </h2>
          <p className="body-xs text-[var(--text-subtle)] mt-0.5">
            Đối chiếu chéo sĩ số, chuyên cần, chăm sóc bán trú, khen thưởng và thu học phí giữa các lớp
          </p>
        </div>
      </div>

      {/* Counted Tabs */}
      <CountedTabs
        activeId={statusFilter}
        onChange={(id) => onStatusFilterChange(id as 'all' | ClassMatrixStatus)}
        tabs={[
          { id: 'all', label: 'Tất cả lớp', count: allGradeFilteredRows.length },
          { id: 'stable', label: 'Ổn định', count: stableCount },
          { id: 'warning', label: 'Cần chú ý', count: warningCount },
          { id: 'critical', label: 'Cảnh báo', count: criticalCount },
        ]}
      />

      {/* Single Frame Line FilterBar */}
      <FilterBar
        search={{
          placeholder: 'Tìm theo tên lớp, giáo viên...',
          value: searchQuery,
          onChange: onSearchChange,
        }}
        filters={[
          {
            placeholder: 'Chọn khối lớp',
            value: gradeScope,
            defaultValue: 'all',
            onChange: onGradeScopeChange,
            options: DASHBOARD_GRADE_OPTIONS,
          },
        ]}
      />

      {/* Responsive Table */}
      <div className="ecomd-table-scroll">
        <table className="ecomd-table ecomd-table--dense w-full">
          <thead className="sticky top-0 z-20 bg-[var(--bg-subtle)]">
            <tr>
              <th className="body-xs-semibold text-[var(--text-subtle)] is-primary" style={{ minWidth: '185px' }}>
                Lớp học & GVCN
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)] text-center" style={{ width: '90px' }}>
                Sĩ số
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)] text-center" style={{ width: '115px' }}>
                Chuyên cần
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)] text-center" style={{ width: '115px' }}>
                Ăn hết suất
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)] text-center" style={{ width: '125px' }}>
                Phiếu bé ngoan
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)] text-right" style={{ width: '155px' }}>
                Học phí / Còn nợ
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ width: '140px' }}>
                Tình trạng
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)] is-right is-actions" style={{ width: '64px', textAlign: 'right' }}>
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-0">
                  <EmptyState
                    icon="school"
                    title="Không tìm thấy lớp học phù hợp"
                    description="Hãy thử xóa từ khóa tìm kiếm hoặc chuyển sang khối lớp khác."
                  />
                </td>
              </tr>
            ) : (
              rows.map((row) => {
                // Demo class routes resolve reliably on lop-1a1 workspace
                const targetClassId = 'lop-1a1';
                const attColorClass =
                  row.attendanceRate >= 94
                    ? 'text-[var(--color-semantic-green)]'
                    : row.attendanceRate >= 90
                    ? 'text-[var(--color-semantic-orange)]'
                    : 'text-[var(--color-danger)]';

                const mealColorClass =
                  row.mealCompletionRate >= 90
                    ? 'text-[var(--color-semantic-green)]'
                    : row.mealCompletionRate >= 82
                    ? 'text-[var(--text-heading)]'
                    : 'text-[var(--color-semantic-orange)]';

                const feeColorClass =
                  row.tuitionCollectionRate >= 90
                    ? 'text-[var(--color-semantic-green)]'
                    : row.tuitionCollectionRate >= 80
                    ? 'text-[var(--eco-blue-strong)]'
                    : 'text-[var(--color-danger)]';

                return (
                  <tr key={row.classId}>
                    {/* Lớp học & GVCN */}
                    <td className="body-sm is-primary">
                      <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                        Lớp học
                      </span>
                      <div className="ecomd-cell__value flex-col">
                        <div className="flex items-center gap-1.5">
                          <Link
                            href={`/${schoolCode}/class/${targetClassId}/attendance`}
                            className="body-sm-bold text-[var(--eco-blue-strong)] hover:underline"
                          >
                            {row.className}
                          </Link>
                          <Tag variant="default">{row.gradeName}</Tag>
                        </div>
                        <div className="body-xs text-[var(--text-subtle)] mt-0.5">
                          {row.homeroomTeacher}
                        </div>
                      </div>
                    </td>

                    {/* Sĩ số */}
                    <td className="body-sm font-numeric text-center">
                      <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                        Sĩ số
                      </span>
                      <div className="ecomd-cell__value justify-center font-semibold text-[var(--text-heading)] tabular-nums">
                        {row.studentCount}/{row.capacity}
                      </div>
                    </td>

                    {/* Chuyên cần */}
                    <td className="body-sm font-numeric text-center">
                      <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                        Chuyên cần
                      </span>
                      <div className="ecomd-cell__value justify-center">
                        <div className="flex flex-col items-center">
                          <span className={`font-bold tabular-nums ${attColorClass}`}>
                            {row.attendanceRate.toFixed(1)}%
                          </span>
                          <span className="text-[11px] text-[var(--text-subtle)] tabular-nums whitespace-nowrap">
                            {row.presentCount} có mặt • {row.absentCount} vắng
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Ăn hết suất */}
                    <td className="body-sm font-numeric text-center">
                      <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                        Ăn hết suất
                      </span>
                      <div className={`ecomd-cell__value justify-center font-semibold tabular-nums ${mealColorClass}`}>
                        {row.mealCompletionRate.toFixed(1)}%
                      </div>
                    </td>

                    {/* Phiếu bé ngoan */}
                    <td className="body-sm font-numeric text-center">
                      <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                        Phiếu bé ngoan
                      </span>
                      <div className="ecomd-cell__value justify-center font-semibold text-[var(--eco-blue-strong)] tabular-nums">
                        {row.rewardRate.toFixed(1)}%
                      </div>
                    </td>

                    {/* Thu học phí & Còn nợ */}
                    <td className="body-sm font-numeric text-right">
                      <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                        Thu học phí
                      </span>
                      <div className="ecomd-cell__value justify-end">
                        <div className="flex flex-col items-end">
                          <span className={`font-bold tabular-nums ${feeColorClass}`}>
                            {row.tuitionCollectionRate.toFixed(1)}%
                          </span>
                          <span className="text-[11px] text-[var(--text-subtle)] tabular-nums whitespace-nowrap">
                            Nợ: {formatVndCurrency(row.tuitionRemainingVnd)}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Tình trạng */}
                    <td className="body-sm">
                      <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                        Tình trạng
                      </span>
                      <div className="ecomd-cell__value">
                        <div className="flex flex-col items-start">
                          {row.status === 'stable' && (
                            <StatusTag tone="success" label="Ổn định" icon />
                          )}
                          {row.status === 'warning' && (
                            <StatusTag tone="warning" label="Cần chú ý" icon />
                          )}
                          {row.status === 'critical' && (
                            <StatusTag tone="danger" label="Cảnh báo" icon />
                          )}
                          {row.alertNote && (
                            <span className="text-[11px] text-[var(--text-subtle)] mt-1 leading-tight">
                              {row.alertNote}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Thao tác 3 chấm */}
                    <td className="body-sm is-right is-actions" style={{ textAlign: 'right' }}>
                      <div className="ecomd-cell__value flex justify-end">
                        <DropdownMenu
                          trigger={
                            <IconButton
                              icon="ellipsis-vertical"
                              label={`Thao tác lớp ${row.className}`}
                            />
                          }
                          items={[
                            {
                              label: 'Xem Điểm danh lớp',
                              icon: 'calendar-check',
                              onClick: () =>
                                router.push(`/${schoolCode}/class/${targetClassId}/attendance`),
                            },
                            {
                              label: 'Xem Chăm sóc trẻ',
                              icon: 'utensils',
                              onClick: () =>
                                router.push(`/${schoolCode}/class/${targetClassId}/nutrition`),
                            },
                            {
                              label: 'Xem Phiếu bé ngoan',
                              icon: 'bookmark',
                              onClick: () =>
                                router.push(`/${schoolCode}/class/${targetClassId}/reward`),
                            },
                            { divider: true },
                            {
                              label: 'Quản lý học phí lớp',
                              icon: 'coins',
                              onClick: () =>
                                router.push(`/${schoolCode}/school/fee`),
                            },
                          ]}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
```

### A.15. `app/src/pages/[schoolCode]/dashboard/index.tsx` (242 dòng)

```tsx
/**
 * Executive Overview Dashboard Page (Tổng Quan Điều Hành)
 * Design System: [DS] ECO ME DASHBOARD v2.6.0
 */

import React, { useMemo } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { PageHeader } from '@/components/ds';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  refreshDashboardData,
  setDashboardSearchQuery,
  setDashboardStatusFilter,
  setGradeScope,
  setTimeRange,
} from '@/store/slices/dashboardSlice';
import { addToast } from '@/store/slices/toastSlice';
import {
  MOCK_APPROVAL_CENTER_ITEMS,
  MOCK_BULLETIN_BOARD_ITEMS,
  MOCK_CARE_WELLNESS_TREND,
  MOCK_CLASS_PERFORMANCE_MATRIX,
  MOCK_FREQUENT_ABSENCE_STUDENTS,
  MOCK_GRADE_CENSUS,
  MOCK_MONTHLY_CASHFLOW,
  MOCK_WEEKLY_ACTIVITY_POSTS,
} from '@/services/mockDashboardData';
import {
  computeExecutiveKPIs,
  filterApprovalCenter,
  filterBulletinBoard,
  filterCashflowSeries,
  filterClassPerformanceMatrix,
  filterFrequentAbsences,
  filterWeeklyActivityPosts,
  filterWellnessTrend,
} from '@/utils/dashboardAnalytics';
import { DashboardToolbar } from '@/modules/dashboard/DashboardToolbar';
import { ExecutiveKpiCards } from '@/modules/dashboard/ExecutiveKpiCards';
import { FinanceCashflowChart } from '@/modules/dashboard/FinanceCashflowChart';
import { StudentCensusDonut } from '@/modules/dashboard/StudentCensusDonut';
import { CareWellnessTrendChart } from '@/modules/dashboard/CareWellnessTrendChart';
import { WeeklyActivityChart } from '@/modules/dashboard/WeeklyActivityChart';
import { BulletinBoardCard } from '@/modules/dashboard/BulletinBoardCard';
import { ApprovalCenterCard } from '@/modules/dashboard/ApprovalCenterCard';
import { FrequentAbsenceCard } from '@/modules/dashboard/FrequentAbsenceCard';
import { ClassComparisonTable } from '@/modules/dashboard/ClassComparisonTable';

export default function ExecutiveDashboardPage() {
  const router = useRouter();
  const schoolCode = (router.query.schoolCode as string) || 'demo';
  const dispatch = useAppDispatch();

  const {
    timeRange,
    gradeScope,
    searchQuery,
    statusFilter,
    lastRefreshedAt,
  } = useAppSelector((state) => state.dashboard);

  const kpis = useMemo(
    () =>
      computeExecutiveKPIs(
        gradeScope,
        timeRange,
        MOCK_GRADE_CENSUS,
        MOCK_CLASS_PERFORMANCE_MATRIX,
        MOCK_MONTHLY_CASHFLOW
      ),
    [gradeScope, timeRange]
  );

  const cashflowSeries = useMemo(
    () =>
      filterCashflowSeries(
        timeRange,
        gradeScope,
        MOCK_MONTHLY_CASHFLOW,
        MOCK_GRADE_CENSUS
      ),
    [timeRange, gradeScope]
  );

  const wellnessTrend = useMemo(
    () =>
      filterWellnessTrend(
        gradeScope,
        MOCK_CARE_WELLNESS_TREND,
        MOCK_CLASS_PERFORMANCE_MATRIX
      ),
    [gradeScope]
  );

  const weeklyActivities = useMemo(
    () =>
      filterWeeklyActivityPosts(
        gradeScope,
        MOCK_WEEKLY_ACTIVITY_POSTS,
        MOCK_GRADE_CENSUS
      ),
    [gradeScope]
  );

  const bulletinItems = useMemo(
    () => filterBulletinBoard(gradeScope, MOCK_BULLETIN_BOARD_ITEMS),
    [gradeScope]
  );

  const approvalItems = useMemo(
    () => filterApprovalCenter(gradeScope, MOCK_APPROVAL_CENTER_ITEMS),
    [gradeScope]
  );

  const frequentAbsenceItems = useMemo(
    () => filterFrequentAbsences(gradeScope, MOCK_FREQUENT_ABSENCE_STUDENTS),
    [gradeScope]
  );

  const allGradeFilteredClasses = useMemo(
    () =>
      filterClassPerformanceMatrix(
        MOCK_CLASS_PERFORMANCE_MATRIX,
        gradeScope,
        '',
        'all'
      ),
    [gradeScope]
  );

  const filteredClasses = useMemo(
    () =>
      filterClassPerformanceMatrix(
        MOCK_CLASS_PERFORMANCE_MATRIX,
        gradeScope,
        searchQuery,
        statusFilter
      ),
    [gradeScope, searchQuery, statusFilter]
  );

  const handleRefresh = () => {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    dispatch(refreshDashboardData(`Hôm nay ${hh}:${mm}:${ss}`));
    dispatch(
      addToast({
        type: 'success',
        title: 'Đã đồng bộ dữ liệu',
        message: 'Số liệu điều hành mới nhất từ toàn bộ các phân hệ đã được cập nhật.',
      })
    );
  };

  const handleExport = () => {
    dispatch(
      addToast({
        type: 'info',
        title: 'Đang xuất báo cáo Tổng quan',
        message: 'Hệ thống đang tổng hợp file Excel báo cáo điều hành toàn trường...',
      })
    );
  };

  return (
    <PortalLayout schoolCode={schoolCode}>
      <Head>
        <title>Tổng Quan Điều Hành | ECO School Portal</title>
      </Head>

      <div className="space-y-5">
        {/* 1. Page Header */}
        <PageHeader
          title="Tổng Quan Điều Hành"
          description="Toàn cảnh quy mô sĩ số, chuyên cần, dòng tiền học phí, hoạt động lớp học và phản hồi phụ huynh"
        />

        {/* 2. Global Dashboard Scope & Time Range Controls */}
        <DashboardToolbar
          timeRange={timeRange}
          gradeScope={gradeScope}
          lastRefreshedAt={lastRefreshedAt}
          onTimeRangeChange={(range) => dispatch(setTimeRange(range))}
          onGradeScopeChange={(scope) => dispatch(setGradeScope(scope))}
          onRefresh={handleRefresh}
          onExport={handleExport}
        />

        {/* 3. 4 North Star Executive KPI Cards */}
        <ExecutiveKpiCards kpis={kpis} />

        {/* 4. Row 1 Charts: Finance Cashflow + Student Census & Capacity */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 items-stretch">
          <FinanceCashflowChart data={cashflowSeries} />
          <StudentCensusDonut
            grades={MOCK_GRADE_CENSUS}
            activeGradeScope={gradeScope}
            onSelectGrade={(id) => dispatch(setGradeScope(id))}
          />
        </div>

        {/* 5. Row 2 Charts: Care & Attendance Trend + Weekly Activity & Parent Hearts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 items-stretch">
          <CareWellnessTrendChart data={wellnessTrend} />
          <WeeklyActivityChart data={weeklyActivities} schoolCode={schoolCode} />
        </div>

        {/* 6. Row 3 Operational Widgets: Bảng thông tin, Trung tâm kiểm duyệt, Học sinh vắng nhiều */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
          <BulletinBoardCard items={bulletinItems} schoolCode={schoolCode} />
          <ApprovalCenterCard
            items={approvalItems}
            schoolCode={schoolCode}
            onRefresh={handleRefresh}
          />
          <FrequentAbsenceCard
            items={frequentAbsenceItems}
            schoolCode={schoolCode}
            monthLabel="T11"
          />
        </div>

        {/* 7. Class Performance Matrix Table */}
        <ClassComparisonTable
          rows={filteredClasses}
          allGradeFilteredRows={allGradeFilteredClasses}
          schoolCode={schoolCode}
          searchQuery={searchQuery}
          gradeScope={gradeScope}
          statusFilter={statusFilter}
          onSearchChange={(q) => dispatch(setDashboardSearchQuery(q))}
          onGradeScopeChange={(scope) => dispatch(setGradeScope(scope))}
          onStatusFilterChange={(st) => dispatch(setDashboardStatusFilter(st))}
        />
      </div>
    </PortalLayout>
  );
}
```

### A.16. `app/tests/unit/dashboard.test.mjs` (243 dòng)

```js
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import {
  computeExecutiveKPIs,
  evaluateClassStatus,
  filterApprovalCenter,
  filterBulletinBoard,
  filterCashflowSeries,
  filterClassPerformanceMatrix,
  filterFrequentAbsences,
  filterGradeCensus,
  filterWeeklyActivityPosts,
  filterWellnessTrend,
  formatVndCompact,
  formatVndCurrency,
  getScopeShareRatio,
  removeVietnameseTones,
} from '../../src/utils/dashboardAnalytics.ts';
import {
  MOCK_APPROVAL_CENTER_ITEMS,
  MOCK_BULLETIN_BOARD_ITEMS,
  MOCK_CARE_WELLNESS_TREND,
  MOCK_CLASS_PERFORMANCE_MATRIX,
  MOCK_FREQUENT_ABSENCE_STUDENTS,
  MOCK_GRADE_CENSUS,
  MOCK_MONTHLY_CASHFLOW,
  MOCK_WEEKLY_ACTIVITY_POSTS,
} from '../../src/services/mockDashboardData.ts';
import dashboardReducer, {
  refreshDashboardData,
  resetDashboardFilters,
  setDashboardSearchQuery,
  setDashboardStatusFilter,
  setGradeScope,
  setTimeRange,
} from '../../src/store/slices/dashboardSlice.ts';

describe('Executive Overview Dashboard (Tổng Quan Điều Hành)', () => {
  test('1. Format helpers render VND currencies and compact metrics accurately', () => {
    assert.equal(removeVietnameseTones('Khối Mầm Non - Lớp 1A1'), 'khoi mam non - lop 1a1');
    assert.ok(formatVndCurrency(1450000000).endsWith(' đ'));
    assert.equal(formatVndCompact(1450000000), '1,45 tỷ');
    assert.equal(formatVndCompact(142000000), '142 tr');
  });

  test('2. Executive KPIs compute coherent student scale, attendance, tuition, and CSAT', () => {
    const schoolKpis = computeExecutiveKPIs(
      'all',
      'month',
      MOCK_GRADE_CENSUS,
      MOCK_CLASS_PERFORMANCE_MATRIX,
      MOCK_MONTHLY_CASHFLOW
    );

    assert.equal(schoolKpis.totalStudents, 342);
    assert.equal(schoolKpis.totalCapacity, 380);
    assert.equal(schoolKpis.fillRate, 90.0);
    assert.ok(schoolKpis.attendanceRate > 90 && schoolKpis.attendanceRate <= 100);
    assert.equal(
      schoolKpis.tuitionTotalIssuedVnd,
      schoolKpis.tuitionCollectedVnd + schoolKpis.tuitionRemainingVnd
    );
    assert.ok(schoolKpis.tuitionCollectionRate > 80);
    assert.equal(schoolKpis.csatScore, 4.85);
  });

  test('3. Grade scope filtering dynamically scales cashflow, census, and wellness trends', () => {
    const grade1Ratio = getScopeShareRatio('khoi-1', MOCK_GRADE_CENSUS);
    assert.ok(grade1Ratio > 0.3 && grade1Ratio < 0.35);

    const scopedCensus = filterGradeCensus('khoi-mam', MOCK_GRADE_CENSUS);
    assert.equal(scopedCensus.length, 1);
    assert.equal(scopedCensus[0].gradeId, 'khoi-mam');

    const termCashflow = filterCashflowSeries(
      'term',
      'khoi-1',
      MOCK_MONTHLY_CASHFLOW,
      MOCK_GRADE_CENSUS
    );
    assert.equal(termCashflow.length, 4);
    assert.ok(termCashflow[0].collected < MOCK_MONTHLY_CASHFLOW[2].collected);

    const grade2Trend = filterWellnessTrend(
      'khoi-2',
      MOCK_CARE_WELLNESS_TREND,
      MOCK_CLASS_PERFORMANCE_MATRIX
    );
    assert.equal(grade2Trend.length, MOCK_CARE_WELLNESS_TREND.length);
  });

  test('4. Weekly Activity, Bulletin Board, Approval Center & Frequent Absence filters work cleanly', () => {
    // Weekly Activity strictly tracks only postCount & heartCount (no album metrics)
    const allActivities = filterWeeklyActivityPosts(
      'all',
      MOCK_WEEKLY_ACTIVITY_POSTS,
      MOCK_GRADE_CENSUS
    );
    assert.equal(allActivities.length, MOCK_WEEKLY_ACTIVITY_POSTS.length);
    assert.ok(!('albumCount' in allActivities[0]));

    const scopedActivities = filterWeeklyActivityPosts(
      'khoi-mam',
      MOCK_WEEKLY_ACTIVITY_POSTS,
      MOCK_GRADE_CENSUS
    );
    assert.ok(scopedActivities[2].postCount <= allActivities[2].postCount);

    // Bulletin board keeps global (no gradeId) + matching gradeId
    const grade1Bulletins = filterBulletinBoard('khoi-1', MOCK_BULLETIN_BOARD_ITEMS);
    assert.ok(grade1Bulletins.every((b) => !b.gradeId || b.gradeId === 'khoi-1'));

    // Approval center filters strictly by grade
    const grade3Approvals = filterApprovalCenter('khoi-3', MOCK_APPROVAL_CENTER_ITEMS);
    assert.equal(grade3Approvals.length, 0);

    const grade1Approvals = filterApprovalCenter('khoi-1', MOCK_APPROVAL_CENTER_ITEMS);
    assert.equal(grade1Approvals.length, 1);
    assert.equal(grade1Approvals[0].classId, 'lop-1a1');

    // Frequent absence sorts descending by absentDays
    const absences = filterFrequentAbsences('all', MOCK_FREQUENT_ABSENCE_STUDENTS);
    for (let i = 1; i < absences.length; i++) {
      assert.ok(absences[i - 1].absentDays >= absences[i].absentDays);
    }
  });

  test('5. Class Performance Matrix supports diacritic search, status filter & threshold rules', () => {
    assert.equal(
      evaluateClassStatus({
        attendanceRate: 85.0,
        mealCompletionRate: 90,
        tuitionCollectionRate: 90,
      }),
      'critical'
    );
    assert.equal(
      evaluateClassStatus({
        attendanceRate: 92.0,
        mealCompletionRate: 78.3,
        tuitionCollectionRate: 95,
      }),
      'warning'
    );
    assert.equal(
      evaluateClassStatus({
        attendanceRate: 96.4,
        mealCompletionRate: 92.6,
        tuitionCollectionRate: 95,
      }),
      'stable'
    );

    const byTeacher = filterClassPerformanceMatrix(
      MOCK_CLASS_PERFORMANCE_MATRIX,
      'all',
      'nguyen thi mai',
      'all'
    );
    assert.equal(byTeacher.length, 1);
    assert.equal(byTeacher[0].classId, 'lop-1a1');
  });

  test('6. Redux state transitions operate reliably', () => {
    let state = dashboardReducer(undefined, { type: '@@INIT' });
    assert.equal(state.timeRange, 'month');
    assert.equal(state.gradeScope, 'all');

    state = dashboardReducer(state, setTimeRange('week'));
    state = dashboardReducer(state, setGradeScope('khoi-2'));
    state = dashboardReducer(state, setDashboardSearchQuery('2A2'));
    state = dashboardReducer(state, setDashboardStatusFilter('critical'));
    state = dashboardReducer(state, refreshDashboardData('14:30:00'));

    assert.equal(state.timeRange, 'week');
    assert.equal(state.gradeScope, 'khoi-2');
    assert.equal(state.lastRefreshedAt, '14:30:00');

    state = dashboardReducer(state, resetDashboardFilters());
    assert.equal(state.timeRange, 'month');
    assert.equal(state.gradeScope, 'all');
  });

  test('7. Layout order & Design System invariants conform to specification', () => {
    const layoutPath = path.resolve('src/components/layout/PortalLayout.tsx');
    const layoutSrc = fs.readFileSync(layoutPath, 'utf8');
    const overviewIdx = layoutSrc.indexOf("label: 'Tổng quan'");
    const opsIdx = layoutSrc.indexOf("label: 'Vận hành'");
    assert.ok(overviewIdx !== -1 && overviewIdx < opsIdx);

    // Check Dashboard Page widget placement and deletion of ExecutiveAlertsCard
    const pageSrc = fs.readFileSync(
      path.resolve('src/pages/[schoolCode]/dashboard/index.tsx'),
      'utf8'
    );
    assert.equal(pageSrc.includes('ExecutiveAlertsCard'), false);

    const cashflowIdx = pageSrc.indexOf('<FinanceCashflowChart');
    const donutIdx = pageSrc.indexOf('<StudentCensusDonut');
    const wellnessIdx = pageSrc.indexOf('<CareWellnessTrendChart');
    const activityIdx = pageSrc.indexOf('<WeeklyActivityChart');
    const bulletinIdx = pageSrc.indexOf('<BulletinBoardCard');
    const approvalIdx = pageSrc.indexOf('<ApprovalCenterCard');
    const absenceIdx = pageSrc.indexOf('<FrequentAbsenceCard');

    assert.ok(cashflowIdx < donutIdx);
    assert.ok(donutIdx < wellnessIdx);
    assert.ok(wellnessIdx < activityIdx);
    assert.ok(activityIdx < bulletinIdx);
    assert.ok(bulletinIdx < approvalIdx);
    assert.ok(approvalIdx < absenceIdx);

    // Ensure WeeklyActivityChart tracks posts and hearts ONLY (no album legend/series)
    const activitySrc = fs.readFileSync(
      path.resolve('src/modules/dashboard/WeeklyActivityChart.tsx'),
      'utf8'
    );
    assert.equal(activitySrc.includes('Số album'), false);
    assert.ok(activitySrc.includes('Số bài hoạt động'));
    assert.ok(activitySrc.includes('Lượt tim phụ huynh'));

    // Design system conformance across all dashboard widgets
    const modulesToCheck = [
      'src/modules/dashboard/DashboardToolbar.tsx',
      'src/modules/dashboard/ClassComparisonTable.tsx',
      'src/modules/dashboard/ExecutiveKpiCards.tsx',
      'src/modules/dashboard/WeeklyActivityChart.tsx',
      'src/modules/dashboard/BulletinBoardCard.tsx',
      'src/modules/dashboard/ApprovalCenterCard.tsx',
      'src/modules/dashboard/FrequentAbsenceCard.tsx',
    ];

    for (const rel of modulesToCheck) {
      const src = fs.readFileSync(path.resolve(rel), 'utf8');
      assert.equal(/<button\b/.test(src), false, `${rel} must not use raw <button>`);
      assert.equal(/<select\b/.test(src), false, `${rel} must not use raw <select>`);
      assert.equal(/\balert\(/.test(src), false, `${rel} must not use native alert()`);
    }
  });
});
```

### A.17. `app/tests/unit/dashboardScenarios.test.mjs` (343 dòng)

```js
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import {
  computeExecutiveKPIs,
  evaluateClassStatus,
  filterApprovalCenter,
  filterBulletinBoard,
  filterCashflowSeries,
  filterClassPerformanceMatrix,
  filterFrequentAbsences,
  filterGradeCensus,
  filterWeeklyActivityPosts,
  filterWellnessTrend,
  getScopeShareRatio,
} from '../../src/utils/dashboardAnalytics.ts';
import {
  MOCK_APPROVAL_CENTER_ITEMS,
  MOCK_BULLETIN_BOARD_ITEMS,
  MOCK_CARE_WELLNESS_TREND,
  MOCK_CLASS_PERFORMANCE_MATRIX,
  MOCK_FREQUENT_ABSENCE_STUDENTS,
  MOCK_GRADE_CENSUS,
  MOCK_MONTHLY_CASHFLOW,
  MOCK_WEEKLY_ACTIVITY_POSTS,
} from '../../src/services/mockDashboardData.ts';
import { INITIAL_ACTIVITY_POSTS } from '../../src/services/mockActivityData.ts';
import { CLASSES_LIST } from '../../src/services/mockAttendanceData.ts';
import { filterActivityPosts } from '../../src/utils/activityValidation.ts';
import dashboardReducer, {
  refreshDashboardData,
  resetDashboardFilters,
  setDashboardSearchQuery,
  setDashboardStatusFilter,
  setGradeScope,
  setTimeRange,
} from '../../src/store/slices/dashboardSlice.ts';

describe('Tổng Quan Module: Role-Play, Adversarial & Cross-Module Scenario Tests', () => {
  // =========================================================================
  // ROLE-PLAY SCENARIOS
  // =========================================================================

  test('Role-Play 1 (School Owner / Chủ trường): Reviews full-school cashflow & scales across Month/Term/Year', () => {
    let state = dashboardReducer(undefined, { type: '@@INIT' });

    // Owner compares Monthly -> Term (3-month) -> Full Year (6-month) financial totals
    const kpiMonth = computeExecutiveKPIs(
      state.gradeScope,
      'month',
      MOCK_GRADE_CENSUS,
      MOCK_CLASS_PERFORMANCE_MATRIX,
      MOCK_MONTHLY_CASHFLOW
    );
    const kpiTerm = computeExecutiveKPIs(
      state.gradeScope,
      'term',
      MOCK_GRADE_CENSUS,
      MOCK_CLASS_PERFORMANCE_MATRIX,
      MOCK_MONTHLY_CASHFLOW
    );
    const kpiYear = computeExecutiveKPIs(
      state.gradeScope,
      'year',
      MOCK_GRADE_CENSUS,
      MOCK_CLASS_PERFORMANCE_MATRIX,
      MOCK_MONTHLY_CASHFLOW
    );

    assert.ok(kpiYear.tuitionCollectedVnd > kpiTerm.tuitionCollectedVnd);
    assert.ok(kpiTerm.tuitionCollectedVnd > kpiMonth.tuitionCollectedVnd);
    assert.equal(
      kpiYear.tuitionTotalIssuedVnd,
      kpiYear.tuitionCollectedVnd + kpiYear.tuitionRemainingVnd
    );

    // Owner drills into Lớp 1A2 which has high remaining fee debt
    state = dashboardReducer(state, setDashboardSearchQuery('1A2'));
    const filtered = filterClassPerformanceMatrix(
      MOCK_CLASS_PERFORMANCE_MATRIX,
      state.gradeScope,
      state.searchQuery,
      state.statusFilter
    );
    assert.equal(filtered.length, 1);
    assert.equal(filtered[0].classId, 'lop-1a2');
    assert.ok(filtered[0].tuitionRemainingVnd > 30_000_000);
  });

  test('Role-Play 2 (School Principal / Hiệu trưởng): Drills into Khối Mầm non and validates synchronized widgets', () => {
    let state = dashboardReducer(undefined, { type: '@@INIT' });
    state = dashboardReducer(state, setGradeScope('khoi-mam'));

    // 1. Census Donut & KPI
    const census = filterGradeCensus(state.gradeScope, MOCK_GRADE_CENSUS);
    assert.equal(census.length, 1);
    assert.equal(census[0].studentCount, 72);

    const kpi = computeExecutiveKPIs(
      state.gradeScope,
      state.timeRange,
      MOCK_GRADE_CENSUS,
      MOCK_CLASS_PERFORMANCE_MATRIX,
      MOCK_MONTHLY_CASHFLOW
    );
    assert.equal(kpi.totalStudents, 72);
    assert.equal(kpi.totalCapacity, 75);
    assert.equal(kpi.fillRate, 96.0);
    assert.equal(kpi.csatScore, 4.92);

    // 2. Bulletin Board shows only global + Khối Mầm non announcements
    const bulletins = filterBulletinBoard(state.gradeScope, MOCK_BULLETIN_BOARD_ITEMS);
    assert.ok(bulletins.some((b) => b.id === 'bb-5')); // Mầm non picnic
    assert.ok(!bulletins.some((b) => b.id === 'bb-2')); // Khối 1 schedule excluded

    // 3. Approval Center isolates Lớp Lá 1 pending activity
    const approvals = filterApprovalCenter(state.gradeScope, MOCK_APPROVAL_CENTER_ITEMS);
    assert.equal(approvals.length, 1);
    assert.equal(approvals[0].classId, 'lop-la-1');

    // 4. Frequent Absence isolates Mầm non students
    const absences = filterFrequentAbsences(state.gradeScope, MOCK_FREQUENT_ABSENCE_STUDENTS);
    assert.equal(absences.length, 1);
    assert.equal(absences[0].classId, 'lop-choi-1');

    // 5. Matrix narrows strictly to 3 Mầm non classes
    const matrix = filterClassPerformanceMatrix(
      MOCK_CLASS_PERFORMANCE_MATRIX,
      state.gradeScope,
      '',
      'all'
    );
    assert.equal(matrix.length, 3);
  });

  test('Role-Play 3 (Homeroom Coordinator): Monitors Weekly Activity Engagement & Frequent Absences', () => {
    const activities = filterWeeklyActivityPosts(
      'all',
      MOCK_WEEKLY_ACTIVITY_POSTS,
      MOCK_GRADE_CENSUS
    );
    const totalPosts = activities.reduce((s, a) => s + a.postCount, 0);
    const totalHearts = activities.reduce((s, a) => s + a.heartCount, 0);
    assert.ok(totalPosts > 0);
    assert.ok(totalHearts > totalPosts); // Parents react with multiple hearts per post

    // Frequent absences sorted strictly descending for immediate outreach
    const absences = filterFrequentAbsences('all', MOCK_FREQUENT_ABSENCE_STUDENTS);
    assert.equal(absences[0].studentName, 'Nguyễn Đức Huy');
    assert.equal(absences[0].absentDays, 4);
    assert.ok(absences[0].absentDays >= absences[absences.length - 1].absentDays);

    // Search teacher without Vietnamese diacritics
    const teacherLookup = filterClassPerformanceMatrix(
      MOCK_CLASS_PERFORMANCE_MATRIX,
      'all',
      'vu thi ngoc lan',
      'all'
    );
    assert.equal(teacherLookup.length, 1);
    assert.equal(teacherLookup[0].classId, 'lop-choi-1');
  });

  // =========================================================================
  // ADVERSARIAL ("FACING") BOUNDARY & DEGRADATION TESTS
  // =========================================================================

  test('Adversarial 1: Zero / Empty datasets never produce NaN, Infinity, or throw exceptions', () => {
    const emptyKpi = computeExecutiveKPIs('all', 'month', [], [], []);
    assert.equal(emptyKpi.totalStudents, 0);
    assert.equal(emptyKpi.fillRate, 0);
    assert.equal(emptyKpi.attendanceRate, 0);
    assert.equal(emptyKpi.tuitionCollectionRate, 0);
    assert.equal(Number.isNaN(emptyKpi.fillRate), false);
    assert.equal(Number.isNaN(emptyKpi.attendanceRate), false);
    assert.equal(Number.isNaN(emptyKpi.tuitionCollectionRate), false);

    assert.equal(getScopeShareRatio('khoi-1', []), 0);
    assert.deepEqual(filterWeeklyActivityPosts('khoi-1', MOCK_WEEKLY_ACTIVITY_POSTS, []), MOCK_WEEKLY_ACTIVITY_POSTS.map((p) => ({ ...p, postCount: 0, heartCount: 0 })));
    assert.deepEqual(filterWellnessTrend('khoi-99', MOCK_CARE_WELLNESS_TREND, MOCK_CLASS_PERFORMANCE_MATRIX), MOCK_CARE_WELLNESS_TREND);
  });

  test('Adversarial 2: Invalid gradeScope & malicious/whitespace search strings degrade cleanly', () => {
    const unknownScopeKpi = computeExecutiveKPIs(
      'invalid-grade-id',
      'today',
      MOCK_GRADE_CENSUS,
      MOCK_CLASS_PERFORMANCE_MATRIX,
      MOCK_MONTHLY_CASHFLOW
    );
    assert.equal(unknownScopeKpi.totalStudents, 0);
    assert.equal(unknownScopeKpi.fillRate, 0);

    const xssSearch = filterClassPerformanceMatrix(
      MOCK_CLASS_PERFORMANCE_MATRIX,
      'all',
      '   <script>alert(1)</script>   ',
      'all'
    );
    assert.equal(xssSearch.length, 0);

    const blankSearch = filterClassPerformanceMatrix(
      MOCK_CLASS_PERFORMANCE_MATRIX,
      'all',
      '    ',
      'all'
    );
    assert.equal(blankSearch.length, MOCK_CLASS_PERFORMANCE_MATRIX.length);
  });

  test('Adversarial 3: Status threshold boundary transitions are exact and deterministic', () => {
    // Critical threshold: attendance < 88 OR tuition < 70
    assert.equal(
      evaluateClassStatus({ attendanceRate: 87.9, mealCompletionRate: 95, tuitionCollectionRate: 95 }),
      'critical'
    );
    assert.equal(
      evaluateClassStatus({ attendanceRate: 88.0, mealCompletionRate: 95, tuitionCollectionRate: 95 }),
      'warning' // attendance < 92 triggers warning
    );
    assert.equal(
      evaluateClassStatus({ attendanceRate: 95.0, mealCompletionRate: 95, tuitionCollectionRate: 69.9 }),
      'critical'
    );
    // Warning thresholds: attendance < 92 OR meal < 82 OR tuition < 82
    assert.equal(
      evaluateClassStatus({ attendanceRate: 92.0, mealCompletionRate: 81.9, tuitionCollectionRate: 82.0 }),
      'warning'
    );
    assert.equal(
      evaluateClassStatus({ attendanceRate: 92.0, mealCompletionRate: 82.0, tuitionCollectionRate: 81.9 }),
      'warning'
    );
    // Stable threshold exact boundary
    assert.equal(
      evaluateClassStatus({ attendanceRate: 92.0, mealCompletionRate: 82.0, tuitionCollectionRate: 82.0 }),
      'stable'
    );
  });

  test('Adversarial 4: Full state reset clears search, status & grade scope simultaneously', () => {
    let state = dashboardReducer(undefined, { type: '@@INIT' });
    state = dashboardReducer(state, setTimeRange('year'));
    state = dashboardReducer(state, setGradeScope('khoi-3'));
    state = dashboardReducer(state, setDashboardSearchQuery('Hưng'));
    state = dashboardReducer(state, setDashboardStatusFilter('warning'));
    state = dashboardReducer(state, refreshDashboardData('15:25:00'));

    state = dashboardReducer(state, resetDashboardFilters());
    assert.equal(state.timeRange, 'month');
    assert.equal(state.gradeScope, 'all');
    assert.equal(state.searchQuery, '');
    assert.equal(state.statusFilter, 'all');
    assert.equal(state.lastRefreshedAt, '15:25:00');
  });

  // =========================================================================
  // CROSS-MODULE INTEGRITY AUDIT (ZERO BROKEN ROUTES / NO BLOCKERS)
  // =========================================================================

  test('Cross-Module Connectivity Audit: Every dashboard link & router.push resolves to a real Next.js page', () => {
    const dashboardFiles = [
      'src/modules/dashboard/WeeklyActivityChart.tsx',
      'src/modules/dashboard/BulletinBoardCard.tsx',
      'src/modules/dashboard/ApprovalCenterCard.tsx',
      'src/modules/dashboard/FrequentAbsenceCard.tsx',
      'src/modules/dashboard/ClassComparisonTable.tsx',
    ];

    const collectedPaths = new Set();
    const routePattern = /\$\{schoolCode\}(\/[a-zA-Z0-9_${}.-]+(?:\/[a-zA-Z0-9_${}.-]+)*)/g;

    for (const rel of dashboardFiles) {
      const content = fs.readFileSync(path.resolve(rel), 'utf8');
      let match;
      while ((match = routePattern.exec(content)) !== null) {
        // Normalize ${targetClassId} and ${item.classId} placeholders to [classId] dynamic segment
        const normalized = match[1].replace(/\$\{(?:targetClassId|item\.classId)\}/g, '[classId]');
        collectedPaths.add(normalized);
      }
    }

    // Also include the PortalLayout Tổng quan entry route itself
    collectedPaths.add('/dashboard');

    assert.ok(collectedPaths.size >= 6, 'Should audit at least 6 distinct target routes');

    for (const route of collectedPaths) {
      // Convert concrete class id e.g. /class/lop-1a1/attendance -> /class/[classId]/attendance
      const dynamicRoute = route.replace(/\/class\/[^/]+\//, '/class/[classId]/');
      const pagesRoot = path.resolve('src/pages/[schoolCode]');
      const candidateIndex = path.join(pagesRoot, dynamicRoute, 'index.tsx');
      const candidateFile = path.join(pagesRoot, `${dynamicRoute}.tsx`);

      const exists = fs.existsSync(candidateIndex) || fs.existsSync(candidateFile);
      assert.ok(
        exists,
        `Cross-module link target "${route}" (mapped to ${dynamicRoute}) has no Next.js page at ${candidateIndex} or ${candidateFile}`
      );
    }
  });

  test('Deep-Link Moderation Queue: Approval Center counts match Hoạt động pending posts & ?tab=cho_duyet routing', () => {
    const classIds = new Set(CLASSES_LIST.map((c) => c.id));

    for (const item of MOCK_APPROVAL_CENTER_ITEMS) {
      assert.ok(
        classIds.has(item.classId),
        `Approval Center classId "${item.classId}" must exist in standardized CLASSES_LIST`
      );
      const pendingPosts = filterActivityPosts(
        INITIAL_ACTIVITY_POSTS,
        item.classId,
        'cho_duyet',
        ''
      );
      assert.equal(
        pendingPosts.length,
        item.pendingCount,
        `Approval Center pendingCount (${item.pendingCount}) for ${item.classId} must equal actual cho_duyet posts (${pendingPosts.length})`
      );
    }

    const approvalSrc = fs.readFileSync(
      path.resolve('src/modules/dashboard/ApprovalCenterCard.tsx'),
      'utf8'
    );
    assert.ok(
      approvalSrc.includes('/class/${item.classId}/activity?tab=cho_duyet'),
      'ApprovalCenterCard links must navigate to /class/${item.classId}/activity?tab=cho_duyet'
    );

    const activityPageSrc = fs.readFileSync(
      path.resolve('src/pages/[schoolCode]/class/[classId]/activity/index.tsx'),
      'utf8'
    );
    assert.ok(activityPageSrc.includes('router.query.tab'), 'ActivityPage must read ?tab= query param');
    assert.ok(activityPageSrc.includes('setStatusFilter'), 'ActivityPage must auto-activate status filter tab');
    assert.ok(activityPageSrc.includes('onClassChange'), 'ActivityPage must wire class selector filter');
  });
});
```

---

## Phần B — Git Diff Tích Hợp Vào Các File Hiện Hữu (Commit `7d05677`)

### B.1. Patch cho `app/src/components/ds/index.tsx`

```diff
commit 7d05677972b9d4d84e4703506910d14f859bc6da
Author: Vo Chi Hieu <hieuvo@FV-LT2022-0013.local>
Date:   Thu Nov 19 16:48:25 2026 +0700

    feat(dashboard): implement Tổng quan executive overview, weekly activity & moderation deep-links

diff --git a/app/src/components/ds/index.tsx b/app/src/components/ds/index.tsx
index 4abb7b8..e795197 100644
--- a/app/src/components/ds/index.tsx
+++ b/app/src/components/ds/index.tsx
@@ -1264,7 +1264,7 @@ export function SidebarNav(p: SidebarNavProps) {
                 </button>
               ) : null}
 
-              {(isExpanded || p.collapsed) && (
+              {(isExpanded || !g.label || p.collapsed) && (
                 <div className="ecomd-sidebar__items">
                   {(g.items || []).map((it, ii) => {
                     // Check if item has children sub-items (e.g. Báo cáo -> BC Điểm danh, BC Mở rộng, BC Phiếu bé ngoan)
```

### B.2. Patch cho `app/src/components/layout/PortalLayout.tsx`

```diff
commit 7d05677972b9d4d84e4703506910d14f859bc6da
Author: Vo Chi Hieu <hieuvo@FV-LT2022-0013.local>
Date:   Thu Nov 19 16:48:25 2026 +0700

    feat(dashboard): implement Tổng quan executive overview, weekly activity & moderation deep-links

diff --git a/app/src/components/layout/PortalLayout.tsx b/app/src/components/layout/PortalLayout.tsx
index 57b4dfe..39cddba 100644
--- a/app/src/components/layout/PortalLayout.tsx
+++ b/app/src/components/layout/PortalLayout.tsx
@@ -134,6 +134,17 @@ export const PortalLayout: React.FC<PortalLayoutProps> = ({
   const activeYear = academicYears.find((y) => y.id === activeYearId) || academicYears[0];
 
   const navGroups: SidebarNavGroup[] = [
+    {
+      key: 'overview',
+      items: [
+        {
+          label: 'Tổng quan',
+          icon: 'chart-pie',
+          href: `/${schoolCode}/dashboard`,
+          active: router.asPath.includes('/dashboard'),
+        },
+      ],
+    },
     {
       label: 'Vận hành',
       items: [
```

### B.3. Patch cho `app/src/store/index.ts`

```diff
commit 7d05677972b9d4d84e4703506910d14f859bc6da
Author: Vo Chi Hieu <hieuvo@FV-LT2022-0013.local>
Date:   Thu Nov 19 16:48:25 2026 +0700

    feat(dashboard): implement Tổng quan executive overview, weekly activity & moderation deep-links

diff --git a/app/src/store/index.ts b/app/src/store/index.ts
index bb34b89..79c880f 100644
--- a/app/src/store/index.ts
+++ b/app/src/store/index.ts
@@ -39,9 +39,11 @@ import revenueCategoryReducer from './slices/revenueCategorySlice';
 import toastReducer from './slices/toastSlice';
 import nutritionReducer from './slices/nutritionSlice';
 import rewardReducer from './slices/rewardSlice';
+import dashboardReducer from './slices/dashboardSlice';
 
 export const store = configureStore({
   reducer: {
+    dashboard: dashboardReducer,
     attendance: attendanceReducer,
     activity: activityReducer,
     media: mediaReducer,
```

### B.4. Patch cho `app/src/pages/index.tsx`

```diff
commit 7d05677972b9d4d84e4703506910d14f859bc6da
Author: Vo Chi Hieu <hieuvo@FV-LT2022-0013.local>
Date:   Thu Nov 19 16:48:25 2026 +0700

    feat(dashboard): implement Tổng quan executive overview, weekly activity & moderation deep-links

diff --git a/app/src/pages/index.tsx b/app/src/pages/index.tsx
index a392a89..13f3a64 100644
--- a/app/src/pages/index.tsx
+++ b/app/src/pages/index.tsx
@@ -21,7 +21,7 @@ export default function Home() {
       };
       saveSession(demoSession, true);
     }
-    router.replace('/demo/school/subjects');
+    router.replace('/demo/dashboard');
   }, [router]);
 
   return (
```

### B.5. Patch cho `app/src/pages/[schoolCode]/index.tsx`

```diff
commit 7d05677972b9d4d84e4703506910d14f859bc6da
Author: Vo Chi Hieu <hieuvo@FV-LT2022-0013.local>
Date:   Thu Nov 19 16:48:25 2026 +0700

    feat(dashboard): implement Tổng quan executive overview, weekly activity & moderation deep-links

diff --git a/app/src/pages/[schoolCode]/index.tsx b/app/src/pages/[schoolCode]/index.tsx
index 942e67c..b62d472 100644
--- a/app/src/pages/[schoolCode]/index.tsx
+++ b/app/src/pages/[schoolCode]/index.tsx
@@ -8,7 +8,7 @@ export default function SchoolCodeHome() {
   useEffect(() => {
     const code = typeof schoolCode === 'string' && schoolCode ? schoolCode : 'demo';
     if (code.includes('.')) return;
-    router.replace(`/${code}/class/lop-1a1/attendance`);
+    router.replace(`/${code}/dashboard`);
   }, [router, schoolCode]);
 
   return (
@@ -16,7 +16,7 @@ export default function SchoolCodeHome() {
       <div className="text-center">
         <div className="w-10 h-10 border-4 border-[#0070CE] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
         <p className="text-sm font-semibold text-slate-600">
-          Đang chuyển hướng tới phân hệ Điểm Danh...
+          Đang chuyển hướng tới Tổng Quan Điều Hành...
         </p>
       </div>
     </div>
```

### B.6. Patch cho `app/src/modules/operations/activity/ActivityToolbar.tsx`

```diff
commit 7d05677972b9d4d84e4703506910d14f859bc6da
Author: Vo Chi Hieu <hieuvo@FV-LT2022-0013.local>
Date:   Thu Nov 19 16:48:25 2026 +0700

    feat(dashboard): implement Tổng quan executive overview, weekly activity & moderation deep-links

diff --git a/app/src/modules/operations/activity/ActivityToolbar.tsx b/app/src/modules/operations/activity/ActivityToolbar.tsx
index 60f1a77..f555880 100644
--- a/app/src/modules/operations/activity/ActivityToolbar.tsx
+++ b/app/src/modules/operations/activity/ActivityToolbar.tsx
@@ -1,8 +1,11 @@
 import React from 'react';
 import { ModerationStatus } from '../../../types/activity';
-import { CountedTabs, SearchField } from '@/components/ds';
+import { CLASSES_LIST } from '@/services/mockAttendanceData';
+import { CountedTabs, SearchField, SelectField } from '@/components/ds';
 
 interface ActivityToolbarProps {
+  selectedClassId?: string;
+  onClassChange?: (classId: string) => void;
   statusFilter: 'all' | ModerationStatus;
   onStatusFilterChange: (status: 'all' | ModerationStatus) => void;
   searchQuery: string;
@@ -14,6 +17,8 @@ interface ActivityToolbarProps {
 }
 
 export const ActivityToolbar: React.FC<ActivityToolbarProps> = ({
+  selectedClassId = 'lop-1a1',
+  onClassChange,
   statusFilter,
   onStatusFilterChange,
   searchQuery,
@@ -39,19 +44,33 @@ export const ActivityToolbar: React.FC<ActivityToolbarProps> = ({
         onChange={(id) => onStatusFilterChange(id as 'all' | ModerationStatus)}
       />
 
-      {/* 2. Search Toolbar */}
+      {/* 2. Integrated Class Filter & Search Toolbar (Single Frame Line 38px) */}
       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:px-5 sm:py-3 bg-[var(--bg-surface)] w-full min-w-0">
-        <div className="w-full sm:w-80 flex-1 min-w-0">
-          <SearchField
-            value={searchQuery}
-            onChange={onSearchQueryChange}
-            placeholder="Tìm kiếm hoạt động, tên bé, môn học..."
-            block
-            className="w-full"
-          />
+        <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto flex-1 min-w-0">
+          <div className="w-full sm:w-64 min-w-0">
+            <SearchField
+              value={searchQuery}
+              onChange={onSearchQueryChange}
+              placeholder="Tìm kiếm hoạt động, tên bé, môn học..."
+              block
+              className="w-full"
+            />
+          </div>
+
+          {onClassChange && (
+            <div className="w-full sm:w-48 flex-shrink-0 min-w-0">
+              <SelectField
+                placeholder="Chọn lớp học"
+                defaultValue="lop-1a1"
+                value={selectedClassId}
+                onChange={onClassChange}
+                options={CLASSES_LIST.map((c) => ({ value: c.id, label: c.name }))}
+              />
+            </div>
+          )}
         </div>
 
-        <div className="body-xs hidden sm:block text-[var(--text-subtle)]">
+        <div className="body-xs hidden lg:block text-[var(--text-subtle)] whitespace-nowrap">
           Hiển thị nhật ký học tập và sinh hoạt hàng ngày của học sinh
         </div>
       </div>
```

### B.7. Patch cho `app/src/pages/[schoolCode]/class/[classId]/activity/index.tsx`

```diff
commit 7d05677972b9d4d84e4703506910d14f859bc6da
Author: Vo Chi Hieu <hieuvo@FV-LT2022-0013.local>
Date:   Thu Nov 19 16:48:25 2026 +0700

    feat(dashboard): implement Tổng quan executive overview, weekly activity & moderation deep-links

diff --git a/app/src/pages/[schoolCode]/class/[classId]/activity/index.tsx b/app/src/pages/[schoolCode]/class/[classId]/activity/index.tsx
index dbd56be..74bcf51 100644
--- a/app/src/pages/[schoolCode]/class/[classId]/activity/index.tsx
+++ b/app/src/pages/[schoolCode]/class/[classId]/activity/index.tsx
@@ -1,4 +1,4 @@
-import React, { useMemo } from 'react';
+import React, { useEffect, useMemo } from 'react';
 import Head from 'next/head';
 import { useRouter } from 'next/router';
 import { useAppDispatch, useAppSelector } from '@/store';
@@ -18,7 +18,7 @@ import { ActivityComposer } from '@/modules/operations/activity/ActivityComposer
 import { ActivityFeed } from '@/modules/operations/activity/ActivityFeed';
 import { LessonContextPanel } from '@/modules/operations/activity/LessonContextPanel';
 import { filterActivityPosts } from '@/utils/activityValidation';
-import { AudienceScope, ActivityMedia } from '@/types/activity';
+import { AudienceScope, ActivityMedia, ModerationStatus } from '@/types/activity';
 import { CLASSES_LIST, CLASS_STUDENTS_REGISTRY } from '@/services/mockAttendanceData';
 import { PageHeader } from '@/components/ds';
 
@@ -37,6 +37,27 @@ export default function ActivityPage() {
     mentionableStudents,
   } = useAppSelector((state) => state.activity);
 
+  // Sync URL query ?tab=cho_duyet (e.g. deep link from Tổng quan -> Trung tâm kiểm duyệt)
+  useEffect(() => {
+    if (!router.isReady) return;
+    const tabParam = router.query.tab as string | undefined;
+    if (
+      tabParam === 'all' ||
+      tabParam === 'approved' ||
+      tabParam === 'cho_duyet' ||
+      tabParam === 'pinned'
+    ) {
+      dispatch(setStatusFilter(tabParam as 'all' | ModerationStatus));
+    }
+  }, [router.isReady, router.query.tab, dispatch]);
+
+  const handleClassChange = (newClassId: string) => {
+    router.push({
+      pathname: `/${schoolCode}/class/${newClassId}/activity`,
+      query: statusFilter !== 'all' ? { tab: statusFilter } : {},
+    });
+  };
+
   const currentClassInfo = useMemo(() => {
     return CLASSES_LIST.find((c) => c.id === classId) || CLASSES_LIST[0];
   }, [classId]);
@@ -128,6 +149,8 @@ export default function ActivityPage() {
 
         {/* Toolbar & Filter Bar */}
         <ActivityToolbar
+          selectedClassId={classId}
+          onClassChange={handleClassChange}
           statusFilter={statusFilter}
           onStatusFilterChange={(s) => dispatch(setStatusFilter(s))}
           searchQuery={searchQuery}
```

### B.8. Patch cho `app/src/services/mockActivityData.ts`

```diff
commit 7d05677972b9d4d84e4703506910d14f859bc6da
Author: Vo Chi Hieu <hieuvo@FV-LT2022-0013.local>
Date:   Thu Nov 19 16:48:25 2026 +0700

    feat(dashboard): implement Tổng quan executive overview, weekly activity & moderation deep-links

diff --git a/app/src/services/mockActivityData.ts b/app/src/services/mockActivityData.ts
index 7fadd0e..9846283 100644
--- a/app/src/services/mockActivityData.ts
+++ b/app/src/services/mockActivityData.ts
@@ -1,4 +1,4 @@
-import { ActivityPost, LessonRef } from '../types/activity';
+import type { ActivityPost, LessonRef } from '../types/activity';
 
 export interface SentenceTemplate {
   id: string;
@@ -404,4 +404,119 @@ export const INITIAL_ACTIVITY_POSTS: ActivityPost[] = [
     commentsCount: 9,
     isLikedByCurrentUser: false,
   },
+  {
+    id: 'post-10',
+    classId: 'lop-1a1',
+    authorId: 'tch-001',
+    authorName: 'Cô Nguyễn Thu Mai',
+    authorAvatarUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=120&auto=format&fit=crop&q=80',
+    authorRole: 'Giáo viên chủ nhiệm Lớp 1A1',
+    content: '🌿 Giờ học Khám phá Khoa học lớp 1A1: Các con quan sát quá trình nảy mầm của hạt đậu xanh và ghi chép vào sổ tay thực hành.',
+    audienceScope: 'current_class',
+    scopeLabel: 'Lớp 1A1',
+    status: 'cho_duyet',
+    isPinned: false,
+    createdAt: '2026-11-19T08:15:00.000Z',
+    updatedAt: '2026-11-19T08:15:00.000Z',
+    media: [],
+    files: [],
+    taggedStudents: [],
+    taggedLessons: ['LES-001'],
+    likesCount: 0,
+    viewsCount: 1,
+    commentsCount: 0,
+    isLikedByCurrentUser: false,
+  },
+  {
+    id: 'post-11',
+    classId: 'lop-la-1',
+    authorId: 'tch-006',
+    authorName: 'Cô Nguyễn Thu Hà',
+    authorAvatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
+    authorRole: 'Giáo viên chủ nhiệm Lớp Lá 1',
+    content: '🎵 Các bé Lớp Lá 1 tập hát và múa minh họa bài hát chào mừng Ngày Nhà giáo Việt Nam 20/11 rất sôi nổi và đáng yêu.',
+    audienceScope: 'current_class',
+    scopeLabel: 'Lớp Lá 1',
+    status: 'cho_duyet',
+    isPinned: false,
+    createdAt: '2026-11-19T09:05:00.000Z',
+    updatedAt: '2026-11-19T09:05:00.000Z',
+    media: [],
+    files: [],
+    taggedStudents: [],
+    taggedLessons: [],
+    likesCount: 0,
+    viewsCount: 1,
+    commentsCount: 0,
+    isLikedByCurrentUser: false,
+  },
+  {
+    id: 'post-12',
+    classId: 'lop-2a1',
+    authorId: 'tch-003',
+    authorName: 'Thầy Trần Quốc Tuấn',
+    authorAvatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
+    authorRole: 'Giáo viên chủ nhiệm Lớp 2A1',
+    content: '📐 Tiết Toán luyện tập lớp 2A1: Thực hành đo độ dài các đồ vật trong lớp học bằng thước cm và đề-xi-mét.',
+    audienceScope: 'current_class',
+    scopeLabel: 'Lớp 2A1',
+    status: 'cho_duyet',
+    isPinned: false,
+    createdAt: '2026-11-19T09:20:00.000Z',
+    updatedAt: '2026-11-19T09:20:00.000Z',
+    media: [],
+    files: [],
+    taggedStudents: [],
+    taggedLessons: [],
+    likesCount: 0,
+    viewsCount: 1,
+    commentsCount: 0,
+    isLikedByCurrentUser: false,
+  },
+  {
+    id: 'post-13',
+    classId: 'lop-2a1',
+    authorId: 'tch-003',
+    authorName: 'Thầy Trần Quốc Tuấn',
+    authorAvatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
+    authorRole: 'Giáo viên chủ nhiệm Lớp 2A1',
+    content: '📖 Giờ đọc sách thư viện xanh lớp 2A1: Các bạn chia nhóm tóm tắt truyện cổ tích Việt Nam và chia sẻ cảm nghĩ trước lớp.',
+    audienceScope: 'current_class',
+    scopeLabel: 'Lớp 2A1',
+    status: 'cho_duyet',
+    isPinned: false,
+    createdAt: '2026-11-19T10:00:00.000Z',
+    updatedAt: '2026-11-19T10:00:00.000Z',
+    media: [],
+    files: [],
+    taggedStudents: [],
+    taggedLessons: [],
+    likesCount: 0,
+    viewsCount: 1,
+    commentsCount: 0,
+    isLikedByCurrentUser: false,
+  },
+  {
+    id: 'post-14',
+    classId: 'lop-2a1',
+    authorId: 'tch-003',
+    authorName: 'Thầy Trần Quốc Tuấn',
+    authorAvatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
+    authorRole: 'Giáo viên chủ nhiệm Lớp 2A1',
+    content: '⚽ Hoạt động thể thao ngoài trời lớp 2A1: Rèn luyện sức khỏe và tinh thần đồng đội qua trò chơi tiếp sức.',
+    audienceScope: 'current_class',
+    scopeLabel: 'Lớp 2A1',
+    status: 'cho_duyet',
+    isPinned: false,
+    createdAt: '2026-11-19T10:30:00.000Z',
+    updatedAt: '2026-11-19T10:30:00.000Z',
+    media: [],
+    files: [],
+    taggedStudents: [],
+    taggedLessons: [],
+    likesCount: 0,
+    viewsCount: 1,
+    commentsCount: 0,
+    isLikedByCurrentUser: false,
+  },
 ];
```

### B.9. Patch cho `app/src/pages/[schoolCode]/class/[classId]/nutrition.tsx`

```diff
commit 7d05677972b9d4d84e4703506910d14f859bc6da
Author: Vo Chi Hieu <hieuvo@FV-LT2022-0013.local>
Date:   Thu Nov 19 16:48:25 2026 +0700

    feat(dashboard): implement Tổng quan executive overview, weekly activity & moderation deep-links

diff --git a/app/src/pages/[schoolCode]/class/[classId]/nutrition.tsx b/app/src/pages/[schoolCode]/class/[classId]/nutrition.tsx
deleted file mode 100644
index 1571063..0000000
--- a/app/src/pages/[schoolCode]/class/[classId]/nutrition.tsx
+++ /dev/null
@@ -1,2 +0,0 @@
-import NutritionPage from './nutrition/index';
-export default NutritionPage;
```

### B.10. Patch cho `app/src/pages/[schoolCode]/class/[classId]/reward.tsx`

```diff
commit 7d05677972b9d4d84e4703506910d14f859bc6da
Author: Vo Chi Hieu <hieuvo@FV-LT2022-0013.local>
Date:   Thu Nov 19 16:48:25 2026 +0700

    feat(dashboard): implement Tổng quan executive overview, weekly activity & moderation deep-links

diff --git a/app/src/pages/[schoolCode]/class/[classId]/reward.tsx b/app/src/pages/[schoolCode]/class/[classId]/reward.tsx
deleted file mode 100644
index bc5573a..0000000
--- a/app/src/pages/[schoolCode]/class/[classId]/reward.tsx
+++ /dev/null
@@ -1,2 +0,0 @@
-import RewardPage from './reward/index';
-export default RewardPage;
```

### B.11. Patch cho `app/src/pages/[schoolCode]/reports/reward.tsx`

```diff
commit 7d05677972b9d4d84e4703506910d14f859bc6da
Author: Vo Chi Hieu <hieuvo@FV-LT2022-0013.local>
Date:   Thu Nov 19 16:48:25 2026 +0700

    feat(dashboard): implement Tổng quan executive overview, weekly activity & moderation deep-links

diff --git a/app/src/pages/[schoolCode]/reports/reward.tsx b/app/src/pages/[schoolCode]/reports/reward.tsx
deleted file mode 100644
index 094e693..0000000
--- a/app/src/pages/[schoolCode]/reports/reward.tsx
+++ /dev/null
@@ -1,2 +0,0 @@
-import RewardReportPage from './reward/index';
-export default RewardReportPage;
```

