import type {
  RewardReportWeek,
  StudentRewardReportRow,
  RewardReportSummary,
  RewardMonthlyReport,
} from '../types/rewardReport.ts';
import { RAW_MOCK_STUDENTS, NUTRITION_CLASSES_LIST } from '../services/mockNutritionData.ts';

export const REWARD_REPORT_MONTHS = [
  { value: '2026-11', label: 'Tháng 11/2026' },
  { value: '2026-10', label: 'Tháng 10/2026' },
  { value: '2026-09', label: 'Tháng 09/2026' },
];

export function getWeeksForMonth(month: string): RewardReportWeek[] {
  if (month === '2026-10') {
    return [
      { weekNumber: 22, weekLabel: 'Tuần 22', dateRange: '28/09 - 02/10/2026', isFuture: false },
      { weekNumber: 23, weekLabel: 'Tuần 23', dateRange: '05/10 - 09/10/2026', isFuture: false },
      { weekNumber: 24, weekLabel: 'Tuần 24', dateRange: '12/10 - 16/10/2026', isFuture: false },
      { weekNumber: 25, weekLabel: 'Tuần 25', dateRange: '19/10 - 23/10/2026', isFuture: false },
      { weekNumber: 26, weekLabel: 'Tuần 26', dateRange: '26/10 - 30/10/2026', isFuture: false },
    ];
  }

  // Default: 2026-11
  return [
    { weekNumber: 27, weekLabel: 'Tuần 27', dateRange: '02/11 - 06/11/2026', isFuture: false },
    { weekNumber: 28, weekLabel: 'Tuần 28', dateRange: '09/11 - 13/11/2026', isFuture: false },
    { weekNumber: 29, weekLabel: 'Tuần 29', dateRange: '16/11 - 20/11/2026', isFuture: false },
    { weekNumber: 30, weekLabel: 'Tuần 30', dateRange: '23/11 - 27/11/2026', isFuture: true },
    { weekNumber: 31, weekLabel: 'Tuần 31', dateRange: '30/11 - 04/12/2026', isFuture: true },
  ];
}

export function buildMonthlyRewardReport(
  classId: string,
  month: string = '2026-11'
): RewardMonthlyReport {
  const weeks = getWeeksForMonth(month);
  const targetClass = NUTRITION_CLASSES_LIST.find((c) => c.id === classId) || NUTRITION_CLASSES_LIST[0];
  const filtered = RAW_MOCK_STUDENTS.filter((s) => s.classId === classId);
  const students = filtered.length > 0 ? filtered : RAW_MOCK_STUDENTS;

  const weeklyAwardedTotals: Record<number, number> = {};
  weeks.forEach((w) => {
    weeklyAwardedTotals[w.weekNumber] = 0;
  });

  let grandTotalAwarded = 0;
  let totalExcusedAbsences = 0;
  let totalUnexcusedAbsences = 0;

  const rows: StudentRewardReportRow[] = students.map((s, idx) => {
    const weeklyStatus: StudentRewardReportRow['weeklyStatus'] = {};
    let rowAwarded = 0;
    let rowExcused = 0;
    let rowUnexcused = 0;

    weeks.forEach((w) => {
      if (w.isFuture) {
        weeklyStatus[w.weekNumber] = {
          isAwarded: false,
          isPublished: false,
          excusedAbsence: 0,
          unexcusedAbsence: 0,
          isFuture: true,
        };
      } else {
        // Deterministic realistic award pattern matching sample portal
        // Student idx 0, 1, 3, 4 awarded most weeks; idx 2, 5 unawarded in some weeks
        const awarded = idx === 2 ? w.weekNumber === 27 : idx === 4 ? w.weekNumber !== 29 : idx !== 5;
        const excused = idx === 1 ? 1 : idx === 2 ? (w.weekNumber === 29 ? 2 : 0) : 0;
        const unexcused = idx === 2 && w.weekNumber === 28 ? 1 : 0;

        weeklyStatus[w.weekNumber] = {
          isAwarded: awarded,
          isPublished: true,
          excusedAbsence: excused,
          unexcusedAbsence: unexcused,
          teacherComment: awarded ? 'Bé chăm ngoan, ăn hết suất' : 'Cần cố gắng hơn',
          isFuture: false,
        };

        if (awarded) {
          rowAwarded++;
          weeklyAwardedTotals[w.weekNumber] = (weeklyAwardedTotals[w.weekNumber] || 0) + 1;
        }
        rowExcused += excused;
        rowUnexcused += unexcused;
      }
    });

    grandTotalAwarded += rowAwarded;
    totalExcusedAbsences += rowExcused;
    totalUnexcusedAbsences += rowUnexcused;

    return {
      studentId: s.studentId,
      studentCode: s.studentCode,
      fullName: s.fullName,
      nickname: s.nickname,
      avatarUrl: s.avatarUrl,
      gender: s.gender,
      weeklyStatus,
      totalAwarded: rowAwarded,
      totalExcused: rowExcused,
      totalUnexcused: rowUnexcused,
    };
  });

  const totalStudents = rows.length;
  const maxPossibleAwards = totalStudents * weeks.filter((w) => !w.isFuture).length;
  const averageRate = maxPossibleAwards > 0 ? Math.round((grandTotalAwarded / maxPossibleAwards) * 100) : 0;

  const summary: RewardReportSummary = {
    totalStudents,
    weeklyAwardedTotals,
    grandTotalAwarded,
    totalExcusedAbsences,
    totalUnexcusedAbsences,
    averageRate,
  };

  const monthOption = REWARD_REPORT_MONTHS.find((m) => m.value === month) || REWARD_REPORT_MONTHS[0];

  return {
    month,
    monthLabel: monthOption.label,
    classId: targetClass.id,
    className: targetClass.name,
    weeks,
    rows,
    summary,
  };
}

export function exportRewardReportToCsv(report: RewardMonthlyReport): string {
  const metadata = [
    `"BÁO CÁO PHIẾU BÉ NGOAN - ${report.monthLabel.toUpperCase()}"`,
    `"Lớp: ${report.className}"`,
    `"Tổng số trẻ: ${report.summary.totalStudents} | Tổng phiếu đạt: ${report.summary.grandTotalAwarded} | Tỷ lệ: ${report.summary.averageRate}%"`,
    '',
  ];

  const headers = [
    'Mã học sinh',
    'Họ và tên',
    'Lớp',
    ...report.weeks.map((w) => `${w.weekLabel} (${w.dateRange})`),
    'Tổng phiếu đạt',
    'Vắng có phép',
    'Vắng không phép',
  ];

  const lines = [...metadata, headers.join(',')];

  report.rows.forEach((r) => {
    const row = [
      r.studentCode,
      `"${r.fullName}"`,
      `"${report.className}"`,
      ...report.weeks.map((w) => {
        const ws = r.weeklyStatus[w.weekNumber];
        if (ws?.isFuture) return '—';
        return ws?.isAwarded ? 'Đạt' : 'Chưa đạt';
      }),
      r.totalAwarded,
      r.totalExcused,
      r.totalUnexcused,
    ];
    lines.push(row.join(','));
  });

  // Footer summary row
  const summaryRow = [
    'TỔNG CỘNG',
    `"${report.summary.totalStudents} học sinh"`,
    `"${report.className}"`,
    ...report.weeks.map((w) => {
      if (w.isFuture) return '—';
      return `${report.summary.weeklyAwardedTotals[w.weekNumber] || 0} đạt`;
    }),
    report.summary.grandTotalAwarded,
    report.summary.totalExcusedAbsences,
    report.summary.totalUnexcusedAbsences,
  ];
  lines.push(summaryRow.join(','));

  return '\uFEFF' + lines.join('\n');
}
