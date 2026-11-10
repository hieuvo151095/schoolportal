import React from 'react';
import Head from 'next/head';
import { PortalLayout } from '../../../../components/layout/PortalLayout';
import { NotificationSettingsShell } from '../../../../modules/setting/notification/NotificationSettingsShell';

export default function NotificationSettingsPage() {
  return (
    <PortalLayout>
      <Head>
        <title>Cấu hình thông báo | Eco School</title>
      </Head>
      <div className="space-y-6">
        <NotificationSettingsShell />
      </div>
    </PortalLayout>
  );
}
