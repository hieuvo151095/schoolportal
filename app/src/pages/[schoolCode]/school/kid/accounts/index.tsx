import React from 'react';
import Head from 'next/head';
import { PortalLayout } from '../../../../../components/layout/PortalLayout';
import { AccountTabsShell } from '../../../../../modules/setting/account/AccountTabsShell';

export default function StudentAccountsAliasPage() {
  return (
    <PortalLayout>
      <Head>
        <title>Tài khoản học sinh | Eco School</title>
      </Head>
      <AccountTabsShell />
    </PortalLayout>
  );
}
