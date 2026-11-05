import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { PortalLayout } from '../../../../components/layout/PortalLayout';
import { SchoolOverviewView } from '../../../../modules/setting/school/SchoolOverviewView';

export default function SchoolProfilePage() {
  const router = useRouter();
  const { schoolCode } = router.query;
  const sCode = (schoolCode as string) || 'demo';

  return (
    <PortalLayout schoolCode={sCode}>
      <Head>
        <title>Thông tin trường học | School Operating Portal</title>
      </Head>
      <SchoolOverviewView />
    </PortalLayout>
  );
}
