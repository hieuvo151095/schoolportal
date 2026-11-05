import React, { useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAppDispatch } from '../../../store';
import {
  advanceReportStatus,
  updateReportChecklist,
  updateReportNotes,
} from '../../../store/slices/reportsSlice';
import { DEVELOPMENTAL_TEMPLATES } from '../../../services/mockReportsData';
import { ExtendedReport } from '../../../types/reports';

const Container = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: 24px 0 60px 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const TopNavBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
  padding: 14px 20px;
  border-radius: 12px;
  border: 1px solid #E2E8F0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  .left {
    display: flex;
    align-items: center;
    gap: 16px;

    .back-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      color: #64748B;
      font-size: 13px;
      font-weight: 600;
      text-decoration: none;
      cursor: pointer;

      &:hover {
        color: #0070CE;
      }
    }
  }

  .right {
    display: flex;
    align-items: center;
    gap: 12px;
  }
`;

const StatusTag = styled.span<{ $status: 'draft' | 'sent' | 'completed' }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 700;

  ${props => {
    switch (props.$status) {
      case 'draft':
        return `
          background-color: #F1F5F9;
          color: #475569;
          border: 1px solid #CBD5E1;
        `;
      case 'sent':
        return `
          background-color: #EFF6FF;
          color: #1D4ED8;
          border: 1px solid #BFDBFE;
        `;
      case 'completed':
        return `
          background-color: #ECFDF5;
          color: #047857;
          border: 1px solid #A7F3D0;
        `;
    }
  }}
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' | 'success' }>`
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
  border: 1px solid transparent;

  ${props => {
    switch (props.$variant) {
      case 'primary':
        return `
          background-color: #0070CE;
          color: white;
          &:hover { background-color: #005bb5; }
        `;
      case 'success':
        return `
          background-color: #10B981;
          color: white;
          &:hover { background-color: #059669; }
        `;
      default:
        return `
          background-color: #FFFFFF;
          color: #334155;
          border-color: #CBD5E1;
          &:hover { background-color: #F8FAFC; color: #0F172A; }
        `;
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const LetterheadPaper = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #E2E8F0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -1px rgba(0, 0, 0, 0.04);
  padding: 48px;
  position: relative;

  @media (max-width: 768px) {
    padding: 24px;
  }
`;

const SchoolHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding-bottom: 24px;
  border-bottom: 2px solid #0070CE;
  margin-bottom: 28px;

  .brand {
    display: flex;
    align-items: center;
    gap: 16px;

    .logo-badge {
      width: 54px;
      height: 54px;
      background: #FEC020;
      color: #0070CE;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      font-weight: 900;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .school-info {
      h1 {
        margin: 0;
        font-size: 17px;
        font-weight: 800;
        color: #0070CE;
        letter-spacing: 0.02em;
        text-transform: uppercase;
      }
      p {
        margin: 4px 0 0 0;
        font-size: 12px;
        color: #64748B;
      }
    }
  }

  .doc-meta {
    text-align: right;
    font-size: 12px;
    color: #64748B;
    .code {
      font-family: monospace;
      font-weight: 700;
      color: #334155;
    }
  }
`;

const ReportTitleBox = styled.div`
  text-align: center;
  margin-bottom: 28px;

  h2 {
    margin: 0;
    font-size: 20px;
    font-weight: 800;
    color: #0F172A;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  .period {
    margin-top: 6px;
    font-size: 14px;
    font-weight: 600;
    color: #0070CE;
  }
`;

const StudentProfileGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px 24px;
  background-color: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  padding: 16px 20px;
  margin-bottom: 32px;

  .item {
    display: flex;
    font-size: 13px;

    .lbl {
      width: 140px;
      color: #64748B;
      font-weight: 500;
    }
    .val {
      font-weight: 700;
      color: #1E293B;
    }
  }
`;

const SectionContainer = styled.div`
  margin-bottom: 32px;

  .sec-header {
    margin-bottom: 12px;
    h3 {
      margin: 0;
      font-size: 15px;
      font-weight: 700;
      color: #0070CE;
      text-transform: uppercase;
      letter-spacing: 0.02em;
    }
    p {
      margin: 4px 0 0 0;
      font-size: 12px;
      color: #64748B;
    }
  }
`;

const EvaluationTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  border: 1px solid #E2E8F0;

  th {
    background-color: #F1F5F9;
    padding: 10px 12px;
    color: #334155;
    font-weight: 700;
    border: 1px solid #E2E8F0;
    text-align: left;
  }

  td {
    padding: 10px 12px;
    border: 1px solid #E2E8F0;
    color: #334155;
    vertical-align: middle;
  }

  tr:nth-child(even) {
    background-color: #F8FAFC;
  }
`;

const CheckboxLabel = styled.label<{ $checked: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-weight: ${props => props.$checked ? '700' : '500'};
  color: ${props => props.$checked ? '#166534' : '#64748B'};

  input {
    accent-color: #16A34A;
    width: 16px;
    height: 16px;
    cursor: pointer;
  }
`;

const GeneralCommentBox = styled.div`
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  padding: 18px;
  margin-bottom: 36px;

  h4 {
    margin: 0 0 10px 0;
    font-size: 14px;
    font-weight: 700;
    color: #1E293B;
  }

  p {
    margin: 0;
    font-size: 13px;
    line-height: 1.6;
    color: #334155;
    font-style: italic;
  }
`;

const SignaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  text-align: center;
  margin-top: 40px;
  padding-top: 20px;

  .sig-col {
    .role {
      font-size: 13px;
      font-weight: 700;
      color: #1E293B;
      text-transform: uppercase;
    }
    .note {
      font-size: 11px;
      color: #94A3B8;
      margin-top: 4px;
    }
    .space {
      height: 70px;
    }
    .name {
      font-size: 13px;
      font-weight: 600;
      color: #334155;
    }
  }
`;

interface ExtendedReportDetailProps {
  report: ExtendedReport;
}

export const ExtendedReportDetail: React.FC<ExtendedReportDetailProps> = ({ report }) => {
  const router = useRouter();
  const schoolCode = (router.query.schoolCode as string) || 'demo';
  const dispatch = useAppDispatch();

  // Find corresponding template
  const template = DEVELOPMENTAL_TEMPLATES.find(t => t.id === report.templateId);

  const handleAdvanceStatus = () => {
    let confirmMsg = '';
    if (report.status === 'draft') {
      confirmMsg = 'Bạn có chắc chắn muốn gửi báo cáo này cho phụ huynh qua ứng dụng Finviet SOHA?';
    } else if (report.status === 'sent') {
      confirmMsg = 'Xác nhận hoàn tất chu trình đánh giá báo cáo này?';
    }

    if (confirmMsg && confirm(confirmMsg)) {
      dispatch(advanceReportStatus(report.id));
    }
  };

  const handleChecklistChange = (sectionId: string, itemId: string, value: boolean) => {
    if (report.status !== 'draft') {
      alert('Chỉ có thể chỉnh sửa tiêu chí đánh giá khi báo cáo ở trạng thái Bản nháp!');
      return;
    }
    dispatch(updateReportChecklist({
      reportId: report.id,
      sectionId,
      itemId,
      value
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Container>
      <TopNavBar>
        <div className="left">
          <Link href={`/${schoolCode}/reports/extended/`} className="back-btn">
            ← Quay lại danh sách báo cáo
          </Link>
          <StatusTag $status={report.status}>
            {report.status === 'draft' && '📝 Bản nháp'}
            {report.status === 'sent' && '📨 Đã gửi cho phụ huynh'}
            {report.status === 'completed' && '✅ Đã hoàn tất'}
          </StatusTag>
        </div>

        <div className="right">
          <Button $variant="secondary" onClick={handlePrint}>
            🖨️ In / Xuất PDF
          </Button>

          {report.status === 'draft' && (
            <Button $variant="primary" onClick={handleAdvanceStatus}>
              📨 Gửi Báo Cáo Cho Phụ Huynh
            </Button>
          )}

          {report.status === 'sent' && (
            <Button $variant="success" onClick={handleAdvanceStatus}>
              ✅ Đánh Dấu Hoàn Tất
            </Button>
          )}

          {report.status === 'completed' && (
            <Button disabled>
              Đã Lưu Trữ Hoàn Tất
            </Button>
          )}
        </div>
      </TopNavBar>

      <LetterheadPaper>
        <SchoolHeader>
          <div className="brand">
            <div className="logo-badge">ECO</div>
            <div className="school-info">
              <h1>Trường Tiểu Học & Mầm Non Quốc Tế ECO</h1>
              <p>Hệ thống giáo dục phát triển toàn diện & ứng dụng công nghệ</p>
              <p>Cơ sở 1: Khu Đô Thị Sala, TP. Thủ Đức, TP. Hồ Chí Minh</p>
            </div>
          </div>
          <div className="doc-meta">
            <div>Mã phiếu: <span className="code">{report.id.toUpperCase()}</span></div>
            <div>Ngày lập: {report.createdAt?.split('T')[0]}</div>
          </div>
        </SchoolHeader>

        <ReportTitleBox>
          <h2>{report.templateName}</h2>
          <div className="period">
            Kỳ / Giai đoạn đánh giá: {report.stageName || `${report.startDate} ~ ${report.endDate}`}
          </div>
        </ReportTitleBox>

        <StudentProfileGrid>
          <div className="item">
            <span className="lbl">Học sinh:</span>
            <span className="val">{report.studentName} ({report.studentCode})</span>
          </div>
          <div className="item">
            <span className="lbl">Lớp:</span>
            <span className="val">{report.className}</span>
          </div>
          <div className="item">
            <span className="lbl">Độ tuổi:</span>
            <span className="val">{report.studentAge}</span>
          </div>
          <div className="item">
            <span className="lbl">Giáo viên phụ trách:</span>
            <span className="val">{report.createdBy}</span>
          </div>
        </StudentProfileGrid>

        {template?.sections.map(section => (
          <SectionContainer key={section.id}>
            <div className="sec-header">
              <h3>{section.title}</h3>
            </div>

            <EvaluationTable>
              <thead>
                <tr>
                  <th style={{ width: '60%' }}>Nội dung / tiêu chí đánh giá</th>
                  <th style={{ width: '40%' }}>Mức độ hoàn thành & đạt chuẩn</th>
                </tr>
              </thead>
              <tbody>
                {section.items.map(item => {
                  const isChecked = Boolean(report.checklistData[section.id]?.[item.id]);
                  return (
                    <tr key={item.id}>
                      <td><strong>{item.label}</strong></td>
                      <td>
                        <CheckboxLabel $checked={isChecked}>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            disabled={report.status !== 'draft'}
                            onChange={e => handleChecklistChange(section.id, item.id, e.target.checked)}
                          />
                          <span>{isChecked ? '✓ Đạt yêu cầu chuẩn' : '○ Đang rèn luyện'}</span>
                        </CheckboxLabel>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </EvaluationTable>
          </SectionContainer>
        ))}

        <GeneralCommentBox>
          <h4>Nhận Xét Chung Của Giáo Viên Chủ Nhiệm:</h4>
          <p>
            "{report.generalNotes || 'Bé có tiến bộ rõ rệt trong các giờ học, hòa đồng cùng bạn bè và tích cực tham gia các hoạt động ngoại khóa của lớp.'}"
          </p>
        </GeneralCommentBox>

        <SignaturesGrid>
          <div className="sig-col">
            <div className="role">Phụ Huynh Học Sinh</div>
            <div className="note">(Ký và ghi rõ họ tên)</div>
            <div className="space" />
            <div className="name">{report.parentName}</div>
          </div>

          <div className="sig-col">
            <div className="role">Giáo Viên Đánh Giá</div>
            <div className="note">(Ký và ghi rõ họ tên)</div>
            <div className="space" />
            <div className="name">{report.createdBy}</div>
          </div>

          <div className="sig-col">
            <div className="role">Ban Giám Hiệu</div>
            <div className="note">(Ký tên và đóng dấu)</div>
            <div className="space" />
            <div className="name">TS. Lê Thu Hương</div>
          </div>
        </SignaturesGrid>
      </LetterheadPaper>
    </Container>
  );
};
