import React from 'react';
import { useAppSelector } from '../../../store';
import { calculateSubmissionTally } from '../../../utils/assignmentValidation';
import { StatCard } from '@/components/ds';

export const AssignmentSummaryCards: React.FC = () => {
  const assignments = useAppSelector((state) => state.assignment.assignments);

  const totalAssignments = assignments.length;
  const now = Date.now();

  const activeAssignments = assignments.filter((a) => {
    return a.status === 'da_gui' && new Date(a.dueDate).getTime() >= now;
  }).length;

  const expiredAssignments = assignments.filter((a) => {
    return new Date(a.dueDate).getTime() < now;
  }).length;

  let totalStudentSubmissions = 0;
  let totalSubmitted = 0;

  assignments.forEach((a) => {
    const tally = calculateSubmissionTally(a.submissions);
    totalStudentSubmissions += tally.total;
    totalSubmitted += tally.submittedCount;
  });

  const avgSubmissionRate =
    totalStudentSubmissions > 0
      ? Math.round((totalSubmitted / totalStudentSubmissions) * 100)
      : 0;

  return (
    <div
      className="ecomd-stat-group"
      style={{
        '--ecomd-cols': 4,
        marginBottom: 'var(--space-16)',
      } as React.CSSProperties}
    >
      <StatCard
        label="Tổng số bài tập"
        value={`${totalAssignments} bài`}
        icon="book-open"
        tone="info"
      />
      <StatCard
        label="Đang tiến hành"
        value={`${activeAssignments} chưa tới hạn`}
        icon="circle-check"
        tone="success"
      />
      <StatCard
        label="Đã hết hạn nộp"
        value={`${expiredAssignments} quá hạn`}
        icon="clock"
        tone="warning"
      />
      <StatCard
        label="Tỷ lệ nộp bài chung"
        value={`${avgSubmissionRate}%`}
        icon="percent"
        tone="purple"
      />
    </div>
  );
};
