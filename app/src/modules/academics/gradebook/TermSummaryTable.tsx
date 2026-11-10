import React, { useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  updateTermSummaryRecord,
  publishTermSession
} from '../../../store/slices/gradebookSlice';
import { calculateClassSummaryRate, getTermActionInfo } from '../../../utils/gradebookValidation';
import type { AcademicResultLevel, ConductResultLevel } from '../../../types/gradebook';
import { Dropdown, Icon } from '@/components/ds';

interface TermSummaryTableProps {
  schoolCode: string;
  classId: string;
  termId: string;
}

export const TermSummaryTable: React.FC<TermSummaryTableProps> = ({
  schoolCode,
  classId,
  termId
}) => {
  const dispatch = useAppDispatch();
  const { classes, termSummaries } = useAppSelector(state => state.gradebook);

  const currentClass = classes.find(c => c.classId === classId);
  const currentTerm = currentClass?.terms.find(t => t.termId === termId);

  const summaryKey = `${classId}_${termId}`;
  const studentRoster = termSummaries[summaryKey] || [];

  const summaryRate = calculateClassSummaryRate(studentRoster);
  const actionInfo = getTermActionInfo(currentTerm?.status || 'chua_thuc_hien');

  const [isBulkEdit, setIsBulkEdit] = useState(false);
  const [successToast, setSuccessToast] = useState('');

  const handleFieldChange = (
    studentId: string,
    field: 'academic' | 'conduct' | 'excused' | 'unexcused' | 'comment',
    val: any
  ) => {
    dispatch(
      updateTermSummaryRecord({
        classId,
        termId,
        studentId,
        ...(field === 'academic' && { academicResult: val as AcademicResultLevel }),
        ...(field === 'conduct' && { conductResult: val as ConductResultLevel }),
        ...(field === 'excused' && { excusedAbsence: Number(val) || 0 }),
        ...(field === 'unexcused' && { unexcusedAbsence: Number(val) || 0 }),
        ...(field === 'comment' && { homeroomComment: String(val) })
      })
    );
  };

  const handlePublishOrUpdate = () => {
    dispatch(
      publishTermSession({
        classId,
        termId
      })
    );
    setSuccessToast(
      actionInfo.isPublished
        ? 'Đã cập nhật kết quả đánh giá thành công!'
        : 'Đã công bố bảng điểm & đánh giá đến phụ huynh!'
    );
    setTimeout(() => setSuccessToast(''), 3000);
  };

  const academicOptions = [
    { value: 'hoan_thanh_tot', label: 'Hoàn thành tốt (HTT)' },
    { value: 'hoan_thanh', label: 'Hoàn thành (HT)' },
    { value: 'chua_hoan_thanh', label: 'Chưa hoàn thành (CHT)' },
  ];

  const conductOptions = [
    { value: 'tot', label: 'Tốt' },
    { value: 'kha', label: 'Khá' },
    { value: 'dat', label: 'Đạt' },
    { value: 'can_co_gang', label: 'Cần cố gắng' },
  ];

  return (
    <Container>
      {/* Header & Breadcrumb */}
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
            Tổng Kết Học Kỳ: {currentClass?.className} — {currentTerm?.termName}
          </PageTitle>
          <PageSubtitle>
            Giáo viên chủ nhiệm: {currentClass?.homeroomTeacher} • Sĩ số: {currentClass?.studentCount} học sinh
          </PageSubtitle>
        </div>

        <TopActions>
          {successToast && (
            <ToastMessage>
              <Icon name="check" size={13} />
              <span>{successToast}</span>
            </ToastMessage>
          )}

          <PublishButton onClick={handlePublishOrUpdate}>
            <Icon name={actionInfo.isPublished ? 'check' : 'bullhorn'} size={13} />
            <span>{actionInfo.isPublished ? 'Cập Nhật Công Bố' : 'Công Bố Kết Quả'}</span>
          </PublishButton>
        </TopActions>
      </HeaderCard>

      {/* Summary KPI Cards */}
      <MetricRow>
        <MetricCard>
          <MetricTitle>SĨ SỐ LỚP</MetricTitle>
          <MetricValue>{summaryRate.total} HS</MetricValue>
          <MetricSub>Đã lập danh sách đánh giá</MetricSub>
        </MetricCard>

        <MetricCard>
          <MetricTitle>HOÀN THÀNH HỌC TẬP</MetricTitle>
          <MetricValue style={{ color: '#15803d' }}>
            {summaryRate.completedPercent}% ({summaryRate.completedCount} HS)
          </MetricValue>
          <MetricSub>Đạt mức Hoàn thành & Hoàn thành tốt</MetricSub>
        </MetricCard>

        <MetricCard>
          <MetricTitle>CHƯA HOÀN THÀNH</MetricTitle>
          <MetricValue style={{ color: summaryRate.uncompletedCount > 0 ? '#b45309' : '#64748b' }}>
            {summaryRate.total > 0 ? 100 - summaryRate.completedPercent : 0}% ({summaryRate.uncompletedCount} HS)
          </MetricValue>
          <MetricSub>Cần kế hoạch phụ đạo bổ trợ</MetricSub>
        </MetricCard>
      </MetricRow>

      {/* Table & Quick Edit Bar */}
      <TableCard>
        <TableControls>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>
            Bảng Đánh Giá Kết Quả Học Tập & Rèn Luyện
          </div>

          <BulkEditBtn
            active={isBulkEdit}
            onClick={() => setIsBulkEdit(!isBulkEdit)}
          >
            <Icon name="pen" size={12} />
            <span>{isBulkEdit ? 'Hoàn tất chỉnh sửa nhanh' : 'Bật chỉnh sửa hàng loạt'}</span>
          </BulkEditBtn>
        </TableControls>

        <TableWrapper>
          <Table>
            <thead>
              <tr>
                <th style={{ width: '50px' }}>STT</th>
                <th style={{ width: '220px' }}>Học sinh</th>
                <th style={{ width: '180px' }}>Kết quả học tập</th>
                <th style={{ width: '150px' }}>Kết quả rèn luyện</th>
                <th style={{ width: '130px', textAlign: 'center' }}>Nghỉ (P / KP)</th>
                <th>Nhận xét của giáo viên chủ nhiệm</th>
              </tr>
            </thead>
            <tbody>
              {studentRoster.map((student, idx) => (
                <tr key={student.studentId}>
                  <td style={{ textAlign: 'center', color: '#64748b' }}>{idx + 1}</td>
                  <td>
                    <StudentName>{student.studentName}</StudentName>
                    <StudentCode>{student.studentCode}</StudentCode>
                  </td>

                  {/* KQ Học Tập */}
                  <td>
                    <Dropdown
                      size="sm"
                      value={student.academicResult}
                      onChange={(val) => handleFieldChange(student.studentId, 'academic', val)}
                      options={academicOptions}
                      searchable={false}
                      fullWidth
                    />
                  </td>

                  {/* KQ Rèn Luyện */}
                  <td>
                    <Dropdown
                      size="sm"
                      value={student.conductResult}
                      onChange={(val) => handleFieldChange(student.studentId, 'conduct', val)}
                      options={conductOptions}
                      searchable={false}
                      fullWidth
                    />
                  </td>

                  {/* Số ngày nghỉ */}
                  <td style={{ textAlign: 'center' }}>
                    <AbsenceInputGroup>
                      <MiniInput
                        type="number"
                        min="0"
                        value={student.excusedAbsence}
                        onChange={e => handleFieldChange(student.studentId, 'excused', e.target.value)}
                        title="Vắng có phép"
                      />
                      <span>/</span>
                      <MiniInput
                        type="number"
                        min="0"
                        value={student.unexcusedAbsence}
                        onChange={e => handleFieldChange(student.studentId, 'unexcused', e.target.value)}
                        title="Vắng không phép"
                      />
                    </AbsenceInputGroup>
                  </td>

                  {/* Nhận xét */}
                  <td>
                    <CommentInput
                      type="text"
                      defaultValue={student.homeroomComment}
                      placeholder="Nhập nhận xét tổng kết cho học sinh..."
                      onBlur={e => handleFieldChange(student.studentId, 'comment', e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableWrapper>
      </TableCard>
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
  color: var(--text-subtle);
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

const TopActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  overflow-x: auto;
  width: 100%;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }

  @media (min-width: 768px) {
    width: auto;
    gap: 12px;
  }
`;

const ToastMessage = styled.span`
  background: var(--semantic-success-soft);
  color: var(--semantic-success);
  font-size: 13px;
  font-weight: 600;
  padding: 8px 14px;
  border-radius: var(--radius-8);
  border: 1px solid var(--border-success-soft);
  flex: none;
  white-space: nowrap;
`;

const PublishButton = styled.button`
  background: var(--eco-blue-strong);
  color: #ffffff;
  font-size: 13px;
  font-weight: 600;
  min-height: 40px;
  padding: 8px 20px;
  border-radius: var(--radius-8);
  border: none;
  cursor: pointer;
  flex: none;
  white-space: nowrap;
  transition: all 0.15s ease;
  &:hover {
    opacity: 0.92;
  }
`;

const MetricRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;

  @media (min-width: 640px) {
    gap: 16px;
  }
`;

const MetricCard = styled.div`
  background: var(--bg-surface);
  border-radius: var(--radius-12);
  border: 1px solid var(--border-default);
  padding: 16px 20px;
`;

const MetricTitle = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: var(--text-subtle);
  margin-bottom: 4px;
`;

const MetricValue = styled.div`
  font-family: inherit;
  font-size: 24px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: var(--text-heading);
`;

const MetricSub = styled.div`
  font-size: 12px;
  color: var(--text-subtle);
  margin-top: 4px;
`;

const TableCard = styled.div`
  background: var(--bg-surface);
  border-radius: var(--radius-12);
  border: 1px solid var(--border-default);
  overflow: hidden;
`;

const TableControls = styled.div`
  padding: 14px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  border-bottom: 1px solid var(--border-default);
`;

const BulkEditBtn = styled.button<{ active: boolean }>`
  padding: 7px 14px;
  min-height: 38px;
  background: ${props => (props.active ? 'var(--semantic-warning-soft)' : 'var(--bg-subtle)')};
  color: ${props => (props.active ? 'var(--semantic-warning-strong)' : 'var(--text-heading)')};
  border: 1px solid ${props => (props.active ? 'var(--semantic-warning-strong)' : 'var(--border-default)')};
  border-radius: var(--radius-8);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
`;

const Table = styled.table`
  width: 100%;
  min-width: 780px;
  border-collapse: collapse;
  th {
    padding: 10px 14px;
    font-size: 12px;
    font-weight: 600;
    color: var(--text-subtle);
    background: var(--bg-subtle);
    border-bottom: 1px solid var(--border-default);
    text-align: left;
  }
  td {
    padding: 10px 14px;
    border-bottom: 1px solid var(--border-subtle);
    font-size: 13px;
    color: var(--text-body);
    vertical-align: middle;
  }
  tr:hover td {
    background: var(--bg-subtle);
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

const AbsenceInputGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: var(--text-subtle);
`;

const MiniInput = styled.input`
  width: 42px;
  text-align: center;
  padding: 4px;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-6);
  font-size: 12px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  outline: none;
  background: var(--bg-surface);
  color: var(--text-heading);
`;

const CommentInput = styled.input`
  width: 100%;
  padding: 6px 10px;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-6);
  font-size: 13px;
  color: var(--text-body);
  background: var(--bg-surface);
  outline: none;
  &:focus {
    border-color: var(--eco-blue-strong);
  }
`;
