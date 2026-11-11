/**
 * Grade Table Component
 * Design System: [DS] ECO ME DASHBOARD v2.6.0
 */

import React from 'react';
import type { GradeLevelRollup } from '@/types/grade';
import { Tag, Button, EmptyState } from '@/components/ds';

interface GradeTableProps {
  grades: GradeLevelRollup[];
  onSelectGrade: (gradeId: string) => void;
}

export const GradeTable: React.FC<GradeTableProps> = ({ grades, onSelectGrade }) => {
  if (grades.length === 0) {
    return (
      <div className="p-8">
        <EmptyState
          icon="layer-group"
          title="Không tìm thấy khối lớp phù hợp"
          description="Vui lòng thử điều chỉnh lại bộ lọc cấp học hoặc từ khóa tìm kiếm."
        />
      </div>
    );
  }

  const renderStageTag = (stage: string) => {
    switch (stage) {
      case 'TH':
        return <Tag variant="default">Tiểu học (TH)</Tag>;
      case 'THCS':
        return <Tag variant="default">THCS</Tag>;
      case 'THPT':
        return <Tag variant="default">THPT</Tag>;
      case 'GDTX':
        return <Tag variant="warning">GDTX</Tag>;
      default:
        return <Tag variant="default">{stage}</Tag>;
    }
  };

  return (
    <>
      <div className="ecomd-table-scroll">
        <table className="ecomd-table ecomd-table--dense w-full">
          <thead>
            <tr>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ width: '48px', textAlign: 'center' }}>
                STT
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ width: '110px' }}>
                Mã khối
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)] is-primary" style={{ minWidth: '160px' }}>
                Tên khối
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ width: '140px' }}>
                Cấp học
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ textAlign: 'center', width: '110px' }}>
                Số lượng lớp
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ textAlign: 'center', width: '130px' }}>
                Số học sinh
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)]" style={{ minWidth: '170px' }}>
                Tỷ lệ gán GVCN
              </th>
              <th className="body-xs-semibold text-[var(--text-subtle)] is-right is-actions" style={{ width: '90px', textAlign: 'right' }}>
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {grades.map((grade, idx) => (
              <tr
                key={grade.id}
                onClick={() => onSelectGrade(grade.id)}
                className="cursor-pointer"
              >
                {/* 1. STT */}
                <td className="body-sm" style={{ textAlign: 'center' }}>
                  <span className="body-xs font-numeric text-[var(--text-subtle)]">
                    {idx + 1}
                  </span>
                </td>

                {/* 2. Mã khối */}
                <td className="body-sm font-mono">
                  <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                    Mã khối
                  </span>
                  <div className="ecomd-cell__value">
                    <Tag variant="code">{grade.code}</Tag>
                  </div>
                </td>

                {/* 3. Tên khối */}
                <td className="body-sm is-primary">
                  <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                    Tên khối
                  </span>
                  <div className="ecomd-cell__value">
                    <div className="body-sm-bold text-[var(--eco-blue-strong)] hover:underline">
                      {grade.name}
                    </div>
                    {grade.description && (
                      <div className="body-xs text-[var(--text-subtle)] mt-0.5">
                        {grade.description}
                      </div>
                    )}
                  </div>
                </td>

                {/* 4. Cấp học */}
                <td className="body-sm">
                  <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                    Cấp học
                  </span>
                  <div className="ecomd-cell__value">
                    {renderStageTag(grade.stage)}
                  </div>
                </td>

                {/* 5. Số lượng lớp */}
                <td className="body-sm font-numeric" style={{ textAlign: 'center' }}>
                  <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                    Số lớp
                  </span>
                  <div className="ecomd-cell__value justify-center">
                    <b className="body-sm-bold text-[var(--text-heading)]">{grade.classCount}</b>{' '}
                    <span className="body-xs text-[var(--text-subtle)] ml-1">lớp</span>
                  </div>
                </td>

                {/* 6. Số lượng học sinh */}
                <td className="body-sm font-numeric" style={{ textAlign: 'center' }}>
                  <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                    Số HS
                  </span>
                  <div className="ecomd-cell__value justify-center">
                    <b className="body-sm-bold text-[var(--text-heading)]">
                      {grade.studentCount.toLocaleString('vi-VN')}
                    </b>{' '}
                    <span className="body-xs text-[var(--text-subtle)] ml-1">HS</span>
                  </div>
                </td>

                {/* 7. Tỷ lệ gán GVCN */}
                <td className="body-sm">
                  <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                    Gán GVCN
                  </span>
                  <div className="ecomd-cell__value flex-col">
                    <div className="flex justify-between body-xs text-[var(--text-subtle)] mb-1">
                      <span>
                        {grade.homeroomAssignedCount}/{grade.classCount} lớp
                      </span>
                      <span className="font-numeric font-semibold text-[var(--text-heading)]">
                        {grade.homeroomRate}%
                      </span>
                    </div>
                    <div className="w-full bg-[var(--bg-muted)] h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${grade.homeroomRate}%`,
                          backgroundColor:
                            grade.homeroomRate >= 100
                              ? 'var(--semantic-success)'
                              : grade.homeroomRate >= 50
                              ? 'var(--semantic-warning)'
                              : 'var(--semantic-danger)',
                        }}
                      />
                    </div>
                  </div>
                </td>

                {/* 8. Thao tác */}
                <td
                  className="body-sm is-right is-actions"
                  style={{ textAlign: 'right' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectGrade(grade.id);
                  }}
                >
                  <div className="ecomd-cell__value flex justify-end">
                    <Button variant="secondary" size="sm" icon="eye">
                      Chi tiết
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="ecomd-table__footer body-xs text-[var(--text-subtle)] flex items-center justify-between">
        <div>
          Hiển thị <b>{grades.length}</b> khối lớp
        </div>
        <div className="hidden sm:block">
          Chuẩn hóa danh mục khối lớp Bộ GD&ĐT (Thông tư 28/2020 & 32/2020)
        </div>
      </div>
    </>
  );
};
