import React from 'react';
import { useRouter } from 'next/router';
import { PageHeader, CountedTabs } from '@/components/ds';

interface FeatureFlagsTabsProps {
  activeTab: 'activity' | 'period';
}

export const FeatureFlagsTabs: React.FC<FeatureFlagsTabsProps> = ({
  activeTab,
}) => {
  const router = useRouter();
  const { schoolCode } = router.query;
  const sCode = (schoolCode as string) || 'demo';

  const handleTabChange = (key: string) => {
    if (key === 'activity') {
      router.push(`/${sCode}/setting/activity`);
    } else if (key === 'period') {
      router.push(`/${sCode}/setting/period`);
    }
  };

  return (
    <div className="mb-6 space-y-4">
      {/* Page Header */}
      <PageHeader
        title="Cấu hình tính năng"
        description="Quản lý bật/tắt tính năng bình luận và mốc thời gian học kỳ theo năm học"
      />

      {/* Navigation Tabs */}
      <CountedTabs
        activeId={activeTab}
        onChange={handleTabChange}
        tabs={[
          { id: 'activity', label: 'Hoạt Động', icon: 'bolt' },
          { id: 'period', label: 'Học Kỳ', icon: 'calendar' },
        ]}
      />
    </div>
  );
};

export default FeatureFlagsTabs;
