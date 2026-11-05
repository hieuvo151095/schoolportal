/**
 * Fee Report Tabs Navigation
 * Design System: [DS] ECO ME DASHBOARD v1.1.0
 */

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '../../../store';
import { setActiveTab } from '../../../store/slices/feeReportSlice';
import type { FeeReportTab } from '../../../types/feeReport';

interface FeeReportTabsNavProps {
  schoolCode: string;
}

export const FeeReportTabsNav: React.FC<FeeReportTabsNavProps> = ({ schoolCode }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { activeTab } = useAppSelector((state) => state.feeReport);

  const tabs: Array<{ key: FeeReportTab; label: string; href: string }> = [
    { key: 'overview', label: '1. Tổng quan theo lớp', href: `/${schoolCode}/reports/fee/overview` },
    { key: 'paid', label: '2. Hóa đơn đã thanh toán', href: `/${schoolCode}/reports/fee` },
    { key: 'partial', label: '3. Hóa đơn thanh toán một phần', href: `/${schoolCode}/reports/fee/partial` },
    { key: 'unpaid', label: '4. Hóa đơn chưa thanh toán', href: `/${schoolCode}/reports/fee/unpaid` },
  ];

  const handleTabClick = (tabKey: FeeReportTab) => {
    dispatch(setActiveTab(tabKey));
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        borderBottom: '1px solid var(--border-neutral)',
        background: 'var(--bg-surface)',
        padding: 'var(--space-3) var(--space-4) 0',
        overflowX: 'auto',
      }}
    >
      {tabs.map((tab) => {
        const isActive =
          (tab.key === 'overview' && router.asPath.includes('/reports/fee/overview')) ||
          (tab.key === 'partial' && router.asPath.includes('/reports/fee/partial')) ||
          (tab.key === 'unpaid' && router.asPath.includes('/reports/fee/unpaid')) ||
          (tab.key === 'paid' &&
            (router.asPath.endsWith('/reports/fee') || router.asPath.endsWith('/reports/fee/')));

        return (
          <Link
            key={tab.key}
            href={tab.href}
            onClick={() => handleTabClick(tab.key)}
            style={{
              paddingBottom: 'var(--space-3)',
              paddingLeft: 'var(--space-3)',
              paddingRight: 'var(--space-3)',
              fontSize: 'var(--text-sm)',
              fontWeight: isActive ? 'var(--font-bold)' : 'var(--font-medium)',
              color: isActive ? 'var(--eco-blue-strong)' : 'var(--text-secondary)',
              borderBottom: isActive ? '2px solid var(--eco-blue-strong)' : '2px solid transparent',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease',
            }}
          >
            <span>{tab.label}</span>
          </Link>
        );
      })}
    </div>
  );
};
