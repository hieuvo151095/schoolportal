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
