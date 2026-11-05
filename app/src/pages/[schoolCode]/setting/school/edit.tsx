import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { PortalLayout } from '../../../../components/layout/PortalLayout';
import { SchoolEditContainer } from '../../../../modules/setting/school/SchoolEditContainer';

export default function SchoolProfileEditPage() {
  const router = useRouter();
  const { schoolCode } = router.query;
  const sCode = (schoolCode as string) || 'demo';

  return (
    <PortalLayout schoolCode={sCode}>
      <Head>
        <title>Chỉnh sửa thông tin trường | School Operating Portal</title>
      </Head>
      <SchoolEditContainer />
    </PortalLayout>
  );
}
