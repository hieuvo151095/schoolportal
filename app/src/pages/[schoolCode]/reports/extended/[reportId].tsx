import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { PortalLayout } from '../../../../components/layout/PortalLayout';
import { ExtendedReportDetail } from '../../../../modules/operations/reports/ExtendedReportDetail';
import { useAppSelector } from '../../../../store';

const NotFoundContainer = styled.div`
  max-width: 600px;
  margin: 80px auto;
  padding: 40px;
  text-align: center;
  background: white;
  border-radius: 12px;
  border: 1px solid #E2E8F0;

  .icon {
    font-size: 48px;
    margin-bottom: 16px;
  }
  h2 {
    font-size: 20px;
    font-weight: 700;
    color: #1E293B;
    margin-bottom: 8px;
  }
  p {
    font-size: 14px;
    color: #64748B;
    margin-bottom: 20px;
  }
  a {
    display: inline-block;
    padding: 8px 18px;
    background-color: #0070CE;
    color: white;
    font-weight: 600;
    font-size: 13px;
    border-radius: 6px;
    text-decoration: none;
    &:hover {
      background-color: #005bb5;
    }
  }
`;

export default function ExtendedReportDetailPage() {
  const router = useRouter();
  const schoolCode = (router.query.schoolCode as string) || 'demo';
  const reportId = router.query.reportId as string;

  const reports = useAppSelector(state => state.reports.extendedReports);
  const report = reports.find(r => r.id === reportId);

  return (
    <PortalLayout>
      <Head>
        <title>
          {report
            ? `${report.templateName} - ${report.studentName} | Finviet School Operating Portal`
            : 'Chi Tiết Báo Cáo Mở Rộng | Finviet School Operating Portal'}
        </title>
        <meta name="description" content="Chi tiết phiếu đánh giá phát triển học sinh theo biểu mẫu chuẩn." />
      </Head>

      {report ? (
        <ExtendedReportDetail report={report} />
      ) : (
        <NotFoundContainer>
          <div className="icon">📄</div>
          <h2>Không tìm thấy báo cáo</h2>
          <p>Mã báo cáo "{reportId}" không tồn tại hoặc đã bị xóa.</p>
          <Link href={`/${schoolCode}/reports/extended/`}>
            ← Quay lại danh sách báo cáo
          </Link>
        </NotFoundContainer>
      )}
    </PortalLayout>
  );
}
