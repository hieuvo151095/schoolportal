import React from 'react';
import { StatCard } from '@/components/ds';
import type { NutritionSummary } from '@/types/nutrition';

interface NutritionSummaryCardsProps {
  summary: NutritionSummary;
}

export default function NutritionSummaryCards({ summary }: NutritionSummaryCardsProps) {
  const evaluatedPercent = summary.totalStudents > 0
    ? Math.round((summary.evaluatedCount / summary.totalStudents) * 100)
    : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-5">
      <StatCard
        label="Sĩ số lớp"
        value={summary.totalStudents}
        sub="Học sinh trong danh sách"
        icon="users"
        tone="neutral"
      />
      <StatCard
        label="Đã đánh giá"
        value={`${summary.evaluatedCount}/${summary.totalStudents}`}
        sub={`Đạt ${evaluatedPercent}% sĩ số`}
        icon="circle-check"
        tone="success"
      />
      <StatCard
        label="Ăn hết suất"
        value={summary.ateFullPortionCount}
        sub="Bữa trưa đầy đủ dinh dưỡng"
        icon="utensils"
        tone="info"
      />
      <StatCard
        label="Ngủ sâu giấc"
        value={summary.sleptWellCount}
        sub="Giấc ngủ trưa ngon đạt chuẩn"
        icon="moon"
        tone="warning"
      />
    </div>
  );
}
