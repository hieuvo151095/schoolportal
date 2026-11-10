import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { PortalLayout } from '../../../../../components/layout/PortalLayout';
import { useAppDispatch, useAppSelector } from '../../../../../store';
import { createExtendedReport } from '../../../../../store/slices/reportsSlice';
import { DEVELOPMENTAL_TEMPLATES } from '../../../../../services/mockReportsData';
import { ExtendedReport, ReportTemplateId } from '../../../../../types/reports';

const Container = styled.div`
  width: 100%;
`;

const FormCard = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #E2E8F0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  overflow: hidden;
`;

const FormHeader = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid #E2E8F0;
  background-color: #F8FAFC;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h1 {
    margin: 0;
    font-size: 18px;
    font-weight: 800;
    color: #0F172A;
  }

  .back-link {
    font-size: 13px;
    color: #64748B;
    text-decoration: none;
    font-weight: 600;
    &:hover {
      color: #0070CE;
    }
  }
`;

const FormBody = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    font-size: 13px;
    font-weight: 700;
    color: #1E293B;
  }

  .hint {
    font-size: 12px;
    color: #64748B;
  }
`;

const Select = styled.select`
  width: 100%;
  box-sizing: border-box;
  padding: 10px 14px;
  border: 1.5px solid #CBD5E1;
  border-radius: 8px;
  font-size: 14px;
  color: #1E293B;
  outline: none;
  background-color: white;

  &:focus {
    border-color: #0070CE;
    box-shadow: 0 0 0 3px rgba(0, 112, 206, 0.15);
  }
`;

const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 10px 14px;
  border: 1.5px solid #CBD5E1;
  border-radius: 8px;
  font-size: 14px;
  color: #1E293B;
  outline: none;

  &:focus {
    border-color: #0070CE;
    box-shadow: 0 0 0 3px rgba(0, 112, 206, 0.15);
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  box-sizing: border-box;
  padding: 10px 14px;
  border: 1.5px solid #CBD5E1;
  border-radius: 8px;
  font-size: 14px;
  color: #1E293B;
  outline: none;
  min-height: 80px;

  &:focus {
    border-color: #0070CE;
    box-shadow: 0 0 0 3px rgba(0, 112, 206, 0.15);
  }
`;

const TemplatePreviewBox = styled.div`
  background-color: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  padding: 16px;

  .title {
    font-size: 13px;
    font-weight: 700;
    color: #0070CE;
    margin-bottom: 8px;
    text-transform: uppercase;
  }

  .desc {
    font-size: 13px;
    color: #475569;
    margin-bottom: 12px;
  }

  .sec-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 12px;
    color: #334155;
  }
`;

const FormFooter = styled.div`
  padding: 16px 24px;
  border-top: 1px solid #E2E8F0;
  background-color: #F8FAFC;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
  border: 1px solid ${props => (props.$variant === 'primary' ? '#0070CE' : '#CBD5E1')};
  background-color: ${props => (props.$variant === 'primary' ? '#0070CE' : '#FFFFFF')};
  color: ${props => (props.$variant === 'primary' ? '#FFFFFF' : '#334155')};

  &:hover {
    background-color: ${props => (props.$variant === 'primary' ? '#005bb5' : '#F1F5F9')};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export default function CreateExtendedReportPage() {
  const router = useRouter();
  const schoolCode = (router.query.schoolCode as string) || 'demo';
  const dispatch = useAppDispatch();

  const students = useAppSelector(state => state.reports.studentRoster);

  const [templateId, setTemplateId] = useState<ReportTemplateId>('tieng_viet');
  const [studentId, setStudentId] = useState(students[0]?.studentId || '');
  const [stageName, setStageName] = useState('Tháng 10/2026');
  const [startDate, setStartDate] = useState('2026-10-01');
  const [endDate, setEndDate] = useState('2026-10-31');
  const [generalNotes, setGeneralNotes] = useState('');

  const selectedTemplate = DEVELOPMENTAL_TEMPLATES.find(t => t.id === templateId);
  const selectedStudent = students.find(s => s.studentId === studentId);

  const handleCreate = () => {
    if (!selectedStudent || !selectedTemplate) return;

    // Initialize checklist data empty
    const checklistData: { [secId: string]: { [itemId: string]: boolean } } = {};
    selectedTemplate.sections.forEach(sec => {
      checklistData[sec.id] = {};
      sec.items.forEach(item => {
        checklistData[sec.id][item.id] = false;
      });
    });

    const newReport: ExtendedReport = {
      id: `rep-${Date.now()}`,
      title: `${selectedTemplate.name} - ${selectedStudent.studentName}`,
      studentId: selectedStudent.studentId,
      studentName: selectedStudent.studentName,
      studentCode: selectedStudent.studentCode,
      studentAge: '4 tuổi',
      studentAvatar: selectedStudent.avatarUrl,
      parentName: `PH ${selectedStudent.studentName}`,
      classId: 'lop-1a1',
      className: 'Lớp 1A1 - Mầm Non',
      templateId: selectedTemplate.id,
      templateName: selectedTemplate.name,
      dateType: 'stage',
      startDate,
      endDate,
      stageName,
      status: 'draft',
      createdBy: 'Cô Nguyễn Mai',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      checklistData,
      generalNotes: generalNotes.trim() || undefined,
    };

    dispatch(createExtendedReport(newReport));
    router.push(`/${schoolCode}/reports/extended/${newReport.id}`);
  };

  return (
    <PortalLayout>
      <Head>
        <title>Tạo Báo Cáo Mở Rộng | Finviet School Operating Portal</title>
        <meta name="description" content="Tạo phiếu báo cáo đánh giá phát triển học sinh mới." />
      </Head>

      <Container>
        <FormCard>
          <FormHeader>
            <h1>Tạo Phiếu Đánh Giá / Báo Cáo Mở Rộng Mới</h1>
            <Link href={`/${schoolCode}/reports/extended/`} className="back-link">
              ← Hủy và quay lại
            </Link>
          </FormHeader>

          <FormBody>
            <FormGroup>
              <label htmlFor="template-select">1. Chọn Mẫu Báo Cáo Phát Triển (*):</label>
              <Select
                id="template-select"
                value={templateId}
                onChange={e => setTemplateId(e.target.value as ReportTemplateId)}
              >
                {DEVELOPMENTAL_TEMPLATES.map(tpl => (
                  <option key={tpl.id} value={tpl.id}>
                    {tpl.name} ({tpl.category})
                  </option>
                ))}
              </Select>
            </FormGroup>

            {selectedTemplate && (
              <TemplatePreviewBox>
                <div className="title">Mô tả cấu trúc mẫu: {selectedTemplate.name}</div>
                <div className="desc">{selectedTemplate.description}</div>
                <div className="sec-list">
                  <strong>Các phần tiêu chí đánh giá ({selectedTemplate.sections.length} phần):</strong>
                  {selectedTemplate.sections.map(s => (
                    <div key={s.id}>• {s.title} ({s.items.length} tiêu chí)</div>
                  ))}
                </div>
              </TemplatePreviewBox>
            )}

            <FormGroup>
              <label htmlFor="student-select">2. Chọn Học Sinh Đánh Giá (*):</label>
              <Select
                id="student-select"
                value={studentId}
                onChange={e => setStudentId(e.target.value)}
              >
                {students.map(std => (
                  <option key={std.studentId} value={std.studentId}>
                    {std.studentName} ({std.studentCode})
                  </option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <label htmlFor="stage-input">3. Kỳ / Giai Đoạn Đánh Giá:</label>
              <Input
                id="stage-input"
                placeholder="VD: Tháng 10/2026, Giữa Kỳ 1..."
                value={stageName}
                onChange={e => setStageName(e.target.value)}
              />
            </FormGroup>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <FormGroup>
                <label htmlFor="start-date">Từ ngày:</label>
                <Input
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                />
              </FormGroup>
              <FormGroup>
                <label htmlFor="end-date">Đến ngày:</label>
                <Input
                  id="end-date"
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                />
              </FormGroup>
            </div>

            <FormGroup>
              <label htmlFor="general-notes">4. Nhận Xét Chung Ban Đầu (Tùy chọn):</label>
              <Textarea
                id="general-notes"
                placeholder="Nhập ghi chú sơ bộ về tình hình học tập và phát triển của bé..."
                value={generalNotes}
                onChange={e => setGeneralNotes(e.target.value)}
              />
            </FormGroup>
          </FormBody>

          <FormFooter>
            <Link href={`/${schoolCode}/reports/extended/`} passHref legacyBehavior>
              <Button as="a" $variant="secondary">
                Hủy
              </Button>
            </Link>
            <Button
              $variant="primary"
              disabled={!studentId || !templateId}
              onClick={handleCreate}
            >
              Tạo Bản Nháp Báo Cáo
            </Button>
          </FormFooter>
        </FormCard>
      </Container>
    </PortalLayout>
  );
}
