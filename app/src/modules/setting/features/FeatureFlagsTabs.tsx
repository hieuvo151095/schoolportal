import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBolt,
  faCalendarAlt,
  faSlidersH,
} from '@fortawesome/free-solid-svg-icons';

interface FeatureFlagsTabsProps {
  activeTab: 'activity' | 'period';
}

export const FeatureFlagsTabs: React.FC<FeatureFlagsTabsProps> = ({
  activeTab,
}) => {
  const router = useRouter();
  const { schoolCode } = router.query;
  const sCode = (schoolCode as string) || 'demo';

  return (
    <div className="mb-6">
      {/* Page Header & Breadcrumbs */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
            <span>Cấu hình</span>
            <span>/</span>
            <span className="text-[#0070CE] font-semibold">Tính năng</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#0070CE]">
              <FontAwesomeIcon icon={faSlidersH} className="text-lg" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
                Cấu hình tính năng
              </h1>
              <p className="text-xs md:text-sm text-slate-500">
                Quản lý bật/tắt tính năng bình luận và mốc thời gian học kỳ theo năm học
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 mt-4">
        <Link
          href={`/${sCode}/setting/activity`}
          className={`flex items-center gap-2 py-3 px-5 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'activity'
              ? 'border-[#0070CE] text-[#0070CE]'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
          }`}
        >
          <FontAwesomeIcon icon={faBolt} className="text-sm" />
          <span>Hoạt Động</span>
        </Link>

        <Link
          href={`/${sCode}/setting/period`}
          className={`flex items-center gap-2 py-3 px-5 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'period'
              ? 'border-[#0070CE] text-[#0070CE]'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
          }`}
        >
          <FontAwesomeIcon icon={faCalendarAlt} className="text-sm" />
          <span>Học Kỳ</span>
        </Link>
      </div>
    </div>
  );
};
