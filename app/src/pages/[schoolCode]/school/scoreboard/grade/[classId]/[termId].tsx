import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { PortalLayout } from '../../../../../../components/layout/PortalLayout';
import { SubjectGradeEntryTable } from '../../../../../../modules/academics/gradebook/SubjectGradeEntryTable';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px;
`;

export default function SubjectGradeEntryPage() {
  const router = useRouter();
  const schoolCode = (router.query.schoolCode as string) || 'demo';
  const classId = (router.query.classId as string) || 'c-6a1';
  const termId = (router.query.termId as string) || 't-6a1-hk1-mid';

  return (
    <PortalLayout>
      <Head>
        <title>Bảng Điểm Môn Học | Finviet School Operating Portal</title>
        <meta
          name="description"
          content="Nhập và quản lý điểm số chi tiết từng môn học, tự động tính điểm trung bình học kỳ theo công thức chuẩn Bộ GD&ĐT."
        />
      </Head>

      <PageContainer>
        <SubjectGradeEntryTable
          schoolCode={schoolCode}
          classId={classId}
          termId={termId}
        />
      </PageContainer>
    </PortalLayout>
  );
}
