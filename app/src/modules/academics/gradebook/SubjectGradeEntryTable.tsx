import React, { useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  setSelectedSubjectId,
  updateStudentScore,
  toggleHideNotes
} from '../../../store/slices/gradebookSlice';
import { mockGradebookSubjects } from '../../../services/mockGradebookData';
import { validateScoreInput } from '../../../utils/gradebookValidation';

interface SubjectGradeEntryTableProps {
  schoolCode: string;
  classId: string;
  termId: string;
}

export const SubjectGradeEntryTable: React.FC<SubjectGradeEntryTableProps> = ({
  schoolCode,
  classId,
  termId
}) => {
  const dispatch = useAppDispatch();
  const { classes, selectedSubjectId, subjectScores, hideNotes } = useAppSelector(
    state => state.gradebook
  );

  const currentClass = classes.find(c => c.classId === classId);
  const currentTerm = currentClass?.terms.find(t => t.termId === termId);

  // Filter subjects matching current class grade level
  const classSubjects = mockGradebookSubjects.filter(
    s => s.gradeLevel === currentClass?.gradeLevel
  );

  const activeSubject =
    classSubjects.find(s => s.id === selectedSubjectId) || classSubjects[0];

  const currentSubjectId = activeSubject?.id || selectedSubjectId;
  const scoreKey = `${classId}_${termId}_${currentSubjectId}`;
  const studentRoster = subjectScores[scoreKey] || [];

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleScoreChange = (
    studentId: string,
    field: 'tx' | 'gk' | 'ck',
    val: string,
    txIndex?: number
  ) => {
    const validated = validateScoreInput(val);
    if (!validated.isValid) return;

    if (field === 'tx' && txIndex !== undefined) {
      dispatch(
        updateStudentScore({
          classId,
          termId,
          subjectId: currentSubjectId,
          studentId,
          txIndex,
          txScore: validated.score
        })
      );
    } else if (field === 'gk') {
      dispatch(
        updateStudentScore({
          classId,
          termId,
          subjectId: currentSubjectId,
          studentId,
          gkScore: validated.score
        })
      );
    } else if (field === 'ck') {
      dispatch(
        updateStudentScore({
          classId,
          termId,
          subjectId: currentSubjectId,
          studentId,
          ckScore: validated.score
        })
      );
    }
  };

  const handleNoteChange = (studentId: string, note: string) => {
    dispatch(
      updateStudentScore({
        classId,
        termId,
        subjectId: currentSubjectId,
        studentId,
        note
      })
    );
  };

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <Container>
      {/* Navigation Breadcrumbs & Header */}
      <HeaderCard>
        <div>
          <Breadcrumb>
            <Link href={`/${schoolCode}/school/scoreboard`} passHref>
              <BackLink>← Bảng điểm học tập</BackLink>
            </Link>
            <span>/</span>
            <span>{currentClass?.className}</span>
            <span>/</span>
            <span>{currentTerm?.termName}</span>
          </Breadcrumb>
          <PageTitle>
            Nhập Điểm Môn Học: {currentClass?.className} — {currentTerm?.termName}
          </PageTitle>
          <PageSubtitle>
            Giáo viên chủ nhiệm: {currentClass?.homeroomTeacher} • Sĩ số: {currentClass?.studentCount} học sinh
          </PageSubtitle>
        </div>

        <ActionControls>
          {savedSuccess && <SuccessToast>✓ Đã lưu bảng điểm thành công!</SuccessToast>}
          <SaveButton onClick={handleSave}>Lưu Bảng Điểm</SaveButton>
        </ActionControls>
      </HeaderCard>

      {/* Subject Selector & View Toggles */}
      <ToolbarBox>
        <SubjectSelectorGroup>
          <SelectorLabel>MÔN HỌC:</SelectorLabel>
          <SubjectSelect
            value={currentSubjectId}
            onChange={e => dispatch(setSelectedSubjectId(e.target.value))}
          >
            {classSubjects.map(sub => (
              <option key={sub.id} value={sub.id}>
                {sub.name} ({sub.gradeLevel})
              </option>
            ))}
          </SubjectSelect>

          <NoticePill>
            ✓ Đã kết nối danh mục môn học khối {currentClass?.gradeLevel} (BR03 Fix)
          </NoticePill>
        </SubjectSelectorGroup>

        <ToggleWrapper>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
            <input
              type="checkbox"
              checked={hideNotes}
              onChange={() => dispatch(toggleHideNotes())}
            />
            <span>Ẩn cột nhận xét</span>
          </label>
        </ToggleWrapper>
      </ToolbarBox>

      {/* Grade Entry Table */}
      <TableWrapper>
        {studentRoster.length === 0 ? (
          <EmptyTableState>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>📚</div>
            <div style={{ fontWeight: 700, color: '#0f172a' }}>Chưa có học sinh nào trong lớp này</div>
          </EmptyTableState>
        ) : (
          <Table>
            <thead>
              <tr>
                <th style={{ width: '50px' }}>STT</th>
                <th style={{ width: '220px' }}>Học sinh</th>
                <th colSpan={4} style={{ textAlign: 'center', background: '#eff6ff' }}>
                  Đánh giá thường xuyên (ĐĐGTX)
                </th>
                <th style={{ textAlign: 'center', width: '90px' }}>ĐĐGGK</th>
                <th style={{ textAlign: 'center', width: '90px' }}>ĐĐGCK</th>
                <th style={{ textAlign: 'center', width: '90px', background: '#fef3c7', color: '#b45309' }}>
                  TBHK
                </th>
                {!hideNotes && <th>Nhận xét của giáo viên bộ môn</th>}
              </tr>
              <SubThRow>
                <th></th>
                <th></th>
                <th style={{ width: '70px', textAlign: 'center' }}>TX 1</th>
                <th style={{ width: '70px', textAlign: 'center' }}>TX 2</th>
                <th style={{ width: '70px', textAlign: 'center' }}>TX 3</th>
                <th style={{ width: '70px', textAlign: 'center' }}>TX 4</th>
                <th></th>
                <th></th>
                <th></th>
                {!hideNotes && <th></th>}
              </SubThRow>
            </thead>
            <tbody>
              {studentRoster.map((student, idx) => (
                <tr key={student.studentId}>
                  <td style={{ textAlign: 'center', color: '#64748b' }}>{idx + 1}</td>
                  <td>
                    <StudentName>{student.studentName}</StudentName>
                    <StudentCode>{student.studentCode}</StudentCode>
                  </td>

                  {/* TX 1 - 4 */}
                  {[0, 1, 2, 3].map(txIdx => (
                    <td key={txIdx} style={{ textAlign: 'center' }}>
                      <ScoreInput
                        type="text"
                        defaultValue={student.txScores[txIdx] !== null && student.txScores[txIdx] !== undefined ? student.txScores[txIdx] : ''}
                        placeholder="—"
                        onBlur={e =>
                          handleScoreChange(student.studentId, 'tx', e.target.value, txIdx)
                        }
                      />
                    </td>
                  ))}

                  {/* GK */}
                  <td style={{ textAlign: 'center' }}>
                    <ScoreInput
                      type="text"
                      defaultValue={student.gkScore !== null && student.gkScore !== undefined ? student.gkScore : ''}
                      placeholder="—"
                      onBlur={e => handleScoreChange(student.studentId, 'gk', e.target.value)}
                    />
                  </td>

                  {/* CK */}
                  <td style={{ textAlign: 'center' }}>
                    <ScoreInput
                      type="text"
                      defaultValue={student.ckScore !== null && student.ckScore !== undefined ? student.ckScore : ''}
                      placeholder="—"
                      onBlur={e => handleScoreChange(student.studentId, 'ck', e.target.value)}
                    />
                  </td>

                  {/* TBHK Auto-Computed */}
                  <td style={{ textAlign: 'center', background: '#fffbeb' }}>
                    <TBHKBadge hasScore={student.tbhk !== null}>
                      {student.tbhk !== null ? student.tbhk.toFixed(1) : '—'}
                    </TBHKBadge>
                  </td>

                  {/* Notes */}
                  {!hideNotes && (
                    <td>
                      <NoteInput
                        type="text"
                        defaultValue={student.note || ''}
                        placeholder="Nhập nhận xét tiến độ học tập..."
                        onBlur={e => handleNoteChange(student.studentId, e.target.value)}
                      />
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </TableWrapper>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const HeaderCard = styled.div`
  background: #ffffff;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;

  @media (min-width: 768px) {
    padding: 20px 24px;
  }
`;

const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #64748b;
  margin-bottom: 6px;
  overflow-x: auto;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const BackLink = styled.a`
  color: var(--eco-blue-strong);
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const PageTitle = styled.h1`
  font-family: inherit;
  font-size: 20px;
  font-weight: 700;
  color: var(--text-heading);
  margin: 0;
`;

const PageSubtitle = styled.p`
  font-size: 13px;
  color: var(--text-subtle);
  margin: 4px 0 0;
`;

const ActionControls = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const SuccessToast = styled.span`
  background: var(--semantic-success-soft);
  color: var(--semantic-success);
  font-size: 13px;
  font-weight: 600;
  padding: 8px 14px;
  border-radius: var(--radius-8);
  border: 1px solid var(--border-success-soft);
`;

const SaveButton = styled.button`
  background: var(--eco-blue-strong);
  color: #ffffff;
  font-size: 13px;
  font-weight: 600;
  min-height: 40px;
  padding: 8px 20px;
  border-radius: var(--radius-8);
  border: none;
  cursor: pointer;
  transition: all 0.15s ease;
  &:hover {
    opacity: 0.92;
  }
`;

const ToolbarBox = styled.div`
  background: var(--bg-surface);
  border-radius: var(--radius-12);
  border: 1px solid var(--border-default);
  padding: 14px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  gap: 12px;

  @media (min-width: 640px) {
    flex-direction: row;
    gap: 16px;
  }
`;

const SubjectSelectorGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  width: 100%;

  @media (min-width: 640px) {
    width: auto;
  }
`;

const SelectorLabel = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: var(--text-subtle);
`;

const SubjectSelect = styled.select`
  padding: 7px 14px;
  min-height: 38px;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-8);
  font-size: 13px;
  font-weight: 600;
  color: var(--eco-blue-strong);
  background: var(--bg-surface);
  outline: none;
  cursor: pointer;
`;

const NoticePill = styled.span`
  background: var(--semantic-success-soft);
  color: var(--semantic-success);
  font-size: 12px;
  font-weight: 500;
  padding: 4px 10px;
  border-radius: 9999px;
`;

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;

  @media (min-width: 640px) {
    width: auto;
  }
`;

const TableWrapper = styled.div`
  background: var(--bg-surface);
  border-radius: var(--radius-12);
  border: 1px solid var(--border-default);
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
`;

const Table = styled.table`
  width: 100%;
  min-width: 860px;
  border-collapse: collapse;
  th {
    padding: 10px 14px;
    font-size: 12px;
    font-weight: 600;
    color: var(--text-subtle);
    border-bottom: 1px solid var(--border-default);
    background: var(--bg-subtle);
  }
  td {
    padding: 10px 14px;
    border-bottom: 1px solid var(--border-subtle);
    font-size: 13px;
    color: var(--text-body);
  }
  tr:hover td {
    background: var(--bg-subtle);
  }
`;

const SubThRow = styled.tr`
  th {
    border-top: 1px solid var(--border-subtle);
    font-size: 11px;
    color: var(--text-subtle);
  }
`;

const StudentName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: var(--text-heading);
`;

const StudentCode = styled.div`
  font-size: 12px;
  font-family: monospace;
  color: var(--text-subtle);
`;

const ScoreInput = styled.input`
  width: 50px;
  text-align: center;
  padding: 6px 4px;
  font-weight: 600;
  font-size: 13px;
  font-variant-numeric: tabular-nums;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-6);
  outline: none;
  background: var(--bg-surface);
  color: var(--text-heading);
  &:focus {
    border-color: var(--eco-blue-strong);
    background: var(--semantic-info-soft);
  }
`;

const TBHKBadge = styled.span<{ hasScore: boolean }>`
  display: inline-block;
  font-weight: 700;
  font-size: 13px;
  font-variant-numeric: tabular-nums;
  color: ${props => (props.hasScore ? 'var(--semantic-warning-strong, #b45309)' : 'var(--text-subtle)')};
  background: ${props => (props.hasScore ? 'var(--semantic-warning-soft, #fef3c7)' : 'var(--bg-muted)')};
  padding: 3px 8px;
  border-radius: var(--radius-6);
`;

const NoteInput = styled.input`
  width: 100%;
  padding: 6px 10px;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-6);
  font-size: 13px;
  background: var(--bg-surface);
  color: var(--text-body);
  outline: none;
  &:focus {
    border-color: var(--eco-blue-strong);
  }
`;

const EmptyTableState = styled.div`
  padding: 50px 20px;
  text-align: center;
`;
