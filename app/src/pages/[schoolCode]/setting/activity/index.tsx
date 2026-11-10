import React from 'react';
import Head from 'next/head';
import { PortalLayout } from '../../../../components/layout/PortalLayout';
import { FeatureFlagsTabs } from '../../../../modules/setting/features/FeatureFlagsTabs';
import { ActivitySettingsTab } from '../../../../modules/setting/features/ActivitySettingsTab';

export default function ActivitySettingsPage() {
  return (
    <PortalLayout>
      <Head>
        <title>Cấu hình tính năng - Hoạt Động | Eco School</title>
      </Head>
      <div className="space-y-6">
        <FeatureFlagsTabs activeTab="activity" />
        <ActivitySettingsTab />
      </div>
    </PortalLayout>
  );
}
