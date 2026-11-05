import React from 'react';
import Head from 'next/head';
import { PortalLayout } from '../../../../components/layout/PortalLayout';
import { AccountTabsShell } from '../../../../modules/setting/account/AccountTabsShell';

export default function UserAccountsPage() {
  return (
    <PortalLayout>
      <Head>
        <title>Quản lý tài khoản & phân quyền | Eco School</title>
      </Head>
      <AccountTabsShell />
    </PortalLayout>
  );
}
