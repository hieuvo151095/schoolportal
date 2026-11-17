import type {
  StudentRewardRecord,
  RewardSummary,
  WeekHistoryItem,
} from '../types/reward.ts';

export function calculateRewardSummary(records: StudentRewardRecord[]): RewardSummary {
  const totalStudents = records.length;
  let awardedCount = 0;
  let publishedCount = 0;
  let fullAttendanceCount = 0;

  for (const r of records) {
    if (r.isAwarded) awardedCount++;
    if (r.isPublished) publishedCount++;
    if (r.excusedAbsenceCount === 0 && r.unexcusedAbsenceCount === 0) {
      fullAttendanceCount++;
    }
  }

  return {
    totalStudents,
    awardedCount,
    unawardedCount: Math.max(0, totalStudents - awardedCount),
    publishedCount,
    fullAttendanceCount,
  };
}

export function generateDefaultMonthHistory(
  currentMonthWeek: number,
  isCurrentlyAwarded: boolean,
  currentComment: string
): WeekHistoryItem[] {
  return [
    {
      week: 1,
      weekLabel: 'Tuần 1 • 02/11 - 08/11',
      weekRange: '02/11 - 08/11/2026',
      isAwarded: true,
      publishedAt: '18:11 05/11/2026',
      teacherComment: 'Bé đi học đầy đủ, ăn ngủ ngoan và biết chào hỏi lễ phép.',
    },
    {
      week: 2,
      weekLabel: 'Tuần 2 • 09/11 - 15/11',
      weekRange: '09/11 - 15/11/2026',
      isAwarded: true,
      publishedAt: '17:30 13/11/2026',
      teacherComment: 'Bé hòa đồng với các bạn, tích cực tham gia hoạt động góc.',
    },
    {
      week: 3,
      weekLabel: 'Tuần này • 16/11 - 22/11',
      weekRange: '16/11 - 20/11/2026',
      isAwarded: isCurrentlyAwarded,
      publishedAt: isCurrentlyAwarded ? '16/11/2026 15:33' : undefined,
      teacherComment: currentComment || (isCurrentlyAwarded ? 'Tuần này bé chăm ngoan, nghe lời cô giáo.' : ''),
    },
    {
      week: 4,
      weekLabel: 'Tuần 4 • 23/11 - 29/11',
      weekRange: '23/11 - 29/11/2026',
      isAwarded: false,
      publishedAt: undefined,
      teacherComment: '',
    },
  ];
}
