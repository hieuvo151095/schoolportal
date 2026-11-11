import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  setActiveParadigm,
  setFilterModalOpen,
  setFilterCriteria,
  openRubricModal,
} from '../../../store/slices/gradebookSlice';
import { filterGradebooks, getTermActionInfo } from '../../../utils/gradebookValidation';
import { ClassGradebookRecord } from '../../../types/gradebook';
import {
  CountedTabs,
  SearchField,
  SelectField,
  Button,
  Tag,
  StatusTag,
  Meter,
  EmptyState,
  FilterBar,
  DataTable,
} from '@/components/ds';

function MobileClassScoreboardCard({
  cls,
  schoolCode,
  activeParadigm,
  onOpenRubric,
}: {
  cls: ClassGradebookRecord;
  schoolCode: string;
  activeParadigm: string;
  onOpenRubric: (id: string) => void;
}) {
  const [selectedTermId, setSelectedTermId] = useState<string>(
    cls.terms[0]?.termId || ''
  );

  const activeTerm =
    cls.terms.find((t) => t.termId === selectedTermId) || cls.terms[0];

  const actionInfo = getTermActionInfo(activeTerm?.status || 'chua_thuc_hien');
  const progressPercent =
    activeTerm && activeTerm.totalStudents > 0
      ? Math.round((activeTerm.completedStudents / activeTerm.totalStudents) * 100)
      : 0;

  const statusTone =
    activeTerm?.status === 'da_cong_bo'
      ? 'success'
      : activeTerm?.status === 'tien_hanh'
      ? 'warning'
      : 'neutral';

  const meterTone: 'default' | 'success' | 'warning' =
    activeTerm?.status === 'da_cong_bo'
      ? 'success'
      : activeTerm?.status === 'tien_hanh'
      ? 'warning'
      : 'default';

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-xl p-4 shadow-sm flex flex-col gap-3">
      {/* Class header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-base font-bold text-[#0f172a]">{cls.className}</div>
          <div className="flex items-center gap-1.5 flex-wrap mt-1">
            <Tag variant="default">{cls.gradeLevel}</Tag>
            <span className="text-xs text-[#334155]">GV: {cls.homeroomTeacher}</span>
            <span className="text-xs text-[#64748b]">• {cls.studentCount} HS</span>
          </div>
        </div>
      </div>

      {/* Term Selector Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 -mx-1 px-1">
        {cls.terms.map((term) => {
          const isSelected = term.termId === (activeTerm?.termId || '');
          return (
            <button
              key={term.termId}
              type="button"
              onClick={() => setSelectedTermId(term.termId)}
              className={`flex-none whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold transition-all min-h-[36px] ${
                isSelected
                  ? 'bg-[var(--eco-blue-strong,#0070ce)] text-white shadow-xs'
                  : 'bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0]'
              }`}
            >
              {term.termName}
            </button>
          );
        })}
      </div>

      {/* Active Term Details Box */}
      {activeTerm && (
        <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-3 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#475569]">{activeTerm.termName}</span>
            <StatusTag tone={statusTone} label={actionInfo.statusText} />
          </div>

          {activeTerm.publishedAt && (
            <div className="text-xs text-[#64748b]">
              Ngày công bố: <span className="font-semibold text-[#334155]">{activeTerm.publishedAt}</span>
            </div>
          )}

          {/* Progress bar using Meter SSOT */}
          <div className="w-full">
            <Meter
              value={activeTerm.completedStudents}
              max={activeTerm.totalStudents}
              text={`${activeTerm.completedStudents}/${activeTerm.totalStudents} HS (${progressPercent}%)`}
              tone={meterTone}
              style={{ width: '100%' }}
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 mt-1">
            {activeParadigm === 'numeric_gradebook' ? (
              <>
                <Link
                  href={`/${schoolCode}/school/scoreboard/grade/${cls.classId}/${activeTerm.termId}`}
                  className="flex-1"
                >
                  <Button variant="primary" size="sm" className="w-full justify-center">
                    {activeTerm.status === 'tien_hanh' ? 'Tiếp tục nhập' : 'Nhập điểm'}
                  </Button>
                </Link>
                <Link
                  href={`/${schoolCode}/school/scoreboard/summary/${cls.classId}/${activeTerm.termId}`}
                  className="flex-1"
                >
                  <Button variant="secondary" size="sm" className="w-full justify-center">
                    Tổng kết
                  </Button>
                </Link>
              </>
            ) : (
              <Button
                variant="primary"
                size="sm"
                className="w-full justify-center"
                onClick={() => onOpenRubric('hs-m01')}
              >
                Đánh giá định kỳ
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface ScoreboardOverviewGridProps {
  schoolCode?: string;
}

export const ScoreboardOverviewGrid: React.FC<ScoreboardOverviewGridProps> = ({
  schoolCode = 'demo',
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { classes, activeParadigm, filterCriteria } = useAppSelector(
    (state) => state.gradebook
  );

  const filteredClasses = filterGradebooks(classes, filterCriteria).filter(
    (c) => c.paradigm === activeParadigm
  );

  const numericCount = classes.filter((c) => c.paradigm === 'numeric_gradebook').length;
  const rubricCount = classes.filter((c) => c.paradigm === 'developmental_rubric').length;

  return (
    <div className="ecomd-table-card">
      {/* Top Paradigm Tabs */}
      <CountedTabs
        activeId={activeParadigm}
        onChange={(id) => dispatch(setActiveParadigm(id as any))}
        tabs={[
          {
            id: 'numeric_gradebook',
            label: 'Bảng điểm học tập (Khối phổ thông)',
            count: numericCount,
          },
          {
            id: 'developmental_rubric',
            label: 'Phiếu đánh giá định kỳ (Mầm non & Tiểu học)',
            count: rubricCount,
          },
        ]}
      />

      {/* Toolbar & Filters (Standard FilterBar SSOT) */}
      <FilterBar
        search={{
          placeholder: 'Tìm theo tên lớp học, GVCN...',
          value: filterCriteria.searchQuery,
          onChange: (q) => dispatch(setFilterCriteria({ searchQuery: q })),
        }}
        filters={[
          {
            placeholder: 'Chọn khối lớp',
            options: [
              { value: 'Tất cả khối', label: 'Tất cả khối lớp' },
              { value: 'Khối 1', label: 'Khối 1' },
              { value: 'Khối 2', label: 'Khối 2' },
              { value: 'Khối 6', label: 'Khối 6' },
              { value: 'Khối 12', label: 'Khối 12' },
              { value: 'Mầm non', label: 'Mầm non' },
            ],
            value: filterCriteria.gradeLevel,
            onChange: (val) => dispatch(setFilterCriteria({ gradeLevel: val })),
          },
          {
            placeholder: 'Chọn năm học',
            defaultValue: 'Năm học 2025 - 2026',
            options: [
              { value: 'Năm học 2025 - 2026', label: '2025 - 2026 (Hiện tại)' },
              { value: 'Năm học 2024 - 2025', label: '2024 - 2025' },
              { value: 'Kỳ 1 năm học 2026 - 2027', label: 'Kỳ 1 (2026 - 2027)' },
            ],
            value: filterCriteria.academicYear,
            onChange: (val) => dispatch(setFilterCriteria({ academicYear: val })),
          },
        ]}
        advanced={{
          label: 'Bộ lọc nâng cao',
          active: false,
          onClick: () => dispatch(setFilterModalOpen(true)),
        }}
      />

      {/* Main Grid Content */}
      {filteredClasses.length === 0 ? (
        <EmptyState
          icon="graduation-cap"
          title="Không tìm thấy lớp học phù hợp"
          description="Vui lòng thử điều chỉnh lại từ khóa tìm kiếm hoặc bộ lọc khối lớp."
        />
      ) : (
        <>
          {/* Mobile Card List View (< 768px) with Per-Class Term Selector */}
          <div className="block md:hidden p-4 space-y-3 bg-[#f8fafc]">
            {filteredClasses.map((cls) => (
              <MobileClassScoreboardCard
                key={cls.classId}
                cls={cls}
                schoolCode={schoolCode}
                activeParadigm={activeParadigm}
                onOpenRubric={(id) => dispatch(openRubricModal(id))}
              />
            ))}
          </div>

          {/* Desktop Multi-column Matrix View (>= 768px) */}
          <div className="hidden md:block ecomd-table-scroll">
            <table className="ecomd-table w-full">
            <thead>
              <tr>
                <th
                  className="body-xs-semibold text-[var(--text-subtle)] is-primary"
                  rowSpan={activeParadigm === 'numeric_gradebook' ? 2 : 1}
                  style={{ verticalAlign: 'bottom', width: '22%' }}
                >
                  Lớp học &amp; GVCN
                </th>
                {activeParadigm === 'numeric_gradebook' ? (
                  <>
                    <th
                      className="body-xs-semibold"
                      colSpan={2}
                      style={{
                        padding: 'var(--space-8) var(--space-16)',
                        borderLeft: '1px solid var(--border-default)',
                        textAlign: 'center',
                        color: 'var(--text-heading)',
                      }}
                    >
                      Học kỳ I
                    </th>
                    <th
                      className="body-xs-semibold"
                      colSpan={2}
                      style={{
                        padding: 'var(--space-8) var(--space-16)',
                        borderLeft: '1px solid var(--border-default)',
                        textAlign: 'center',
                        color: 'var(--text-heading)',
                      }}
                    >
                      Học kỳ II
                    </th>
                    <th
                      className="body-xs-semibold"
                      style={{
                        padding: 'var(--space-8) var(--space-16)',
                        borderLeft: '1px solid var(--border-default)',
                        textAlign: 'center',
                        color: 'var(--text-heading)',
                      }}
                    >
                      Cả năm
                    </th>
                  </>
                ) : (
                  <>
                    <th
                      className="body-xs-semibold text-[var(--text-subtle)]"
                      style={{ borderLeft: '1px solid var(--border-default)', textAlign: 'center' }}
                    >
                      Giữa học kỳ I
                    </th>
                    <th
                      className="body-xs-semibold text-[var(--text-subtle)]"
                      style={{ borderLeft: '1px solid var(--border-default)', textAlign: 'center' }}
                    >
                      Học kỳ I
                    </th>
                    <th
                      className="body-xs-semibold text-[var(--text-subtle)]"
                      style={{ borderLeft: '1px solid var(--border-default)', textAlign: 'center' }}
                    >
                      Giữa học kỳ II
                    </th>
                    <th
                      className="body-xs-semibold text-[var(--text-subtle)]"
                      style={{ borderLeft: '1px solid var(--border-default)', textAlign: 'center' }}
                    >
                      Cuối năm
                    </th>
                  </>
                )}
                <th
                  className="body-xs-semibold text-[var(--text-subtle)] is-actions"
                  rowSpan={activeParadigm === 'numeric_gradebook' ? 2 : 1}
                  style={{
                    verticalAlign: 'bottom',
                    textAlign: 'center',
                    width: '64px',
                    borderLeft: '1px solid var(--border-default)',
                  }}
                >
                  Thao tác
                </th>
              </tr>
              {activeParadigm === 'numeric_gradebook' && (
                <tr>
                  <th
                    className="body-xs-semibold text-[var(--text-subtle)]"
                    style={{ textAlign: 'center', borderLeft: '1px solid var(--border-default)' }}
                  >
                    Giữa học kỳ
                  </th>
                  <th
                    className="body-xs-semibold text-[var(--text-subtle)]"
                    style={{ textAlign: 'center' }}
                  >
                    Cuối học kỳ
                  </th>
                  <th
                    className="body-xs-semibold text-[var(--text-subtle)]"
                    style={{ textAlign: 'center', borderLeft: '1px solid var(--border-default)' }}
                  >
                    Giữa học kỳ
                  </th>
                  <th
                    className="body-xs-semibold text-[var(--text-subtle)]"
                    style={{ textAlign: 'center' }}
                  >
                    Cuối học kỳ
                  </th>
                  <th
                    className="body-xs-semibold text-[var(--text-subtle)]"
                    style={{ textAlign: 'center', borderLeft: '1px solid var(--border-default)' }}
                  >
                    Tổng kết năm
                  </th>
                </tr>
              )}
            </thead>
            <tbody>
              {filteredClasses.map((cls) => (
                <tr key={cls.classId}>
                  <td className="body-sm is-primary" style={{ verticalAlign: 'top', padding: 'var(--space-12) var(--space-16)' }}>
                    <div className="ecomd-cell__value">
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        <span className="body-sm-bold text-[var(--text-heading)]">
                          {cls.className}
                        </span>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <Tag variant="default">{cls.gradeLevel}</Tag>
                          <span className="body-xs text-[var(--text-body)]">
                            GV: {cls.homeroomTeacher}
                          </span>
                          <span className="body-xs text-[var(--text-subtle)]">
                            • {cls.studentCount} HS
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {cls.terms.map((term) => {
                    const actionInfo = getTermActionInfo(term.status);
                    const statusTone =
                      term.status === 'da_cong_bo'
                        ? 'success'
                        : term.status === 'tien_hanh'
                        ? 'warning'
                        : 'neutral';

                    const meterTone =
                      term.status === 'da_cong_bo'
                        ? 'success'
                        : term.status === 'tien_hanh'
                        ? 'warning'
                        : 'default';

                    const meterText = term.publishedAt
                      ? `Công bố ${term.publishedAt}`
                      : `${term.completedStudents}/${term.totalStudents} HS`;

                    return (
                      <td
                        key={term.termId}
                        className="body-sm"
                        style={{
                          verticalAlign: 'top',
                          padding: 'var(--space-12) var(--space-14)',
                          borderLeft: '1px solid var(--border-subtle)',
                        }}
                      >
                        <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">
                          {term.termName}
                        </span>
                        <div className="ecomd-cell__value">
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'flex-start',
                              gap: 'var(--space-6)',
                              minWidth: 'calc(var(--size-40) * 3.5)',
                            }}
                          >
                            <StatusTag tone={statusTone} label={actionInfo.statusText} />

                            <Meter
                              value={term.completedStudents}
                              max={term.totalStudents}
                              text={meterText}
                              tone={meterTone}
                              style={{ width: '100%' }}
                            />

                            <div className="pt-1">
                              {activeParadigm === 'numeric_gradebook' ? (
                                <Link
                                  href={
                                    term.status === 'da_cong_bo'
                                      ? `/${schoolCode}/school/scoreboard/summary/${cls.classId}/${term.termId}`
                                      : `/${schoolCode}/school/scoreboard/grade/${cls.classId}/${term.termId}`
                                  }
                                  className="body-xs-semibold text-[var(--eco-blue-strong)] hover:underline whitespace-nowrap inline-flex items-center"
                                >
                                  {term.status === 'tien_hanh'
                                    ? 'Tiếp tục nhập'
                                    : term.status === 'da_cong_bo'
                                    ? 'Xem bảng điểm'
                                    : 'Nhập điểm'}
                                </Link>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => dispatch(openRubricModal('hs-m01'))}
                                  className="body-xs-semibold text-[var(--eco-blue-strong)] hover:underline whitespace-nowrap inline-flex items-center"
                                >
                                  Đánh giá định kỳ
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                    );
                  })}

                  <td
                    className="body-sm is-right is-actions"
                    style={{
                      verticalAlign: 'middle',
                      textAlign: 'center',
                      borderLeft: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div className="ecomd-cell__value flex justify-center">
                      <DataTable.RowAction
                        label={`Thao tác với ${cls.className}`}
                        items={[
                          {
                            label: 'Tổng kết học kỳ',
                            icon: 'clipboard-check',
                            onClick: () =>
                              router.push(
                                `/${schoolCode}/school/scoreboard/summary/${cls.classId}/${cls.terms[0]?.termId}`
                              ),
                          },
                          {
                            label: 'Xem bảng điểm',
                            icon: 'clipboard-list',
                            onClick: () =>
                              router.push(
                                `/${schoolCode}/school/scoreboard/grade/${cls.classId}/${cls.terms[0]?.termId}`
                              ),
                          },
                          {
                            label: 'Xuất bảng điểm',
                            icon: 'file-excel',
                            onClick: () => {},
                          },
                        ]}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
      )}
    </div>
  );
};

export default ScoreboardOverviewGrid;
