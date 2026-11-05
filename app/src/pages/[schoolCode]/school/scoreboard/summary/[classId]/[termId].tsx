import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { PortalLayout } from '../../../../../../components/layout/PortalLayout';
import { TermSummaryTable } from '../../../../../../modules/academics/gradebook/TermSummaryTable';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px;
`;

export default function TermSummaryPage() {
  const router = useRouter();
  const schoolCode = (router.query.schoolCode as string) || 'demo';
  const classId = (router.query.classId as string) || 'c-6a1';
  const termId = (router.query.termId as string) || 't-6a1-hk1-mid';

  return (
    <PortalLayout>
      <Head>
        <title>Đánh Giá Tổng Hợp Học Kỳ | Finviet School Operating Portal</title>
        <meta
          name="description"
          content="Đánh giá kết quả học tập và rèn luyện của học sinh toàn lớp theo học kỳ, theo dõi tỉ lệ hoàn thành và nhận xét của giáo viên chủ nhiệm."
        />
      </Head>

      <PageContainer>
        <TermSummaryTable
          schoolCode={schoolCode}
          classId={classId}
          termId={termId}
        />
      </PageContainer>
    </PortalLayout>
  );
}
