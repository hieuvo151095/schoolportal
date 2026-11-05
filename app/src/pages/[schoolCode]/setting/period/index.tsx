import React from 'react';
import Head from 'next/head';
import { PortalLayout } from '../../../../components/layout/PortalLayout';
import { FeatureFlagsTabs } from '../../../../modules/setting/features/FeatureFlagsTabs';
import { PeriodSettingsTab } from '../../../../modules/setting/features/PeriodSettingsTab';

export default function PeriodSettingsPage() {
  return (
    <PortalLayout>
      <Head>
        <title>Cấu hình tính năng - Học Kỳ | Eco School</title>
      </Head>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <FeatureFlagsTabs activeTab="period" />
        <PeriodSettingsTab />
      </div>
    </PortalLayout>
  );
}
