/**
 * Fee Report Tabs Navigation
 * Design System: [DS] ECO ME DASHBOARD v2.6.0 (CountedTabs SSOT)
 */

import React, { useMemo } from 'react';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '../../../store';
import { setActiveTab } from '../../../store/slices/feeReportSlice';
import type { FeeReportTab } from '../../../types/feeReport';
import { CountedTabs, CountedTabItem } from '../../../components/ds';
import { mockFeeReportClasses } from '../../../services/mockFeeReportData';

interface FeeReportTabsNavProps {
  schoolCode: string;
}

export const FeeReportTabsNav: React.FC<FeeReportTabsNavProps> = ({ schoolCode }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { invoices } = useAppSelector((state) => state.feeReport);

  const currentActiveId = useMemo<FeeReportTab>(() => {
    if (router.asPath.includes('/reports/fee/overview')) return 'overview';
    if (router.asPath.includes('/reports/fee/partial')) return 'partial';
    if (router.asPath.includes('/reports/fee/unpaid')) return 'unpaid';
    return 'paid';
  }, [router.asPath]);

  const counts = useMemo(() => {
    return {
      overview: mockFeeReportClasses.length,
      paid: invoices.filter((i) => i.status === 'da_thanh_toan').length,
      partial: invoices.filter((i) => i.status === 'thanh_toan_mot_phan').length,
      unpaid: invoices.filter(
        (i) => i.status === 'da_tao' || i.status === 'da_gui' || i.status === 'qua_han'
      ).length,
    };
  }, [invoices]);

  const tabs: CountedTabItem[] = [
    { id: 'overview', label: 'Tổng quan theo lớp', count: counts.overview, icon: 'layer-group' },
    { id: 'paid', label: 'Hóa đơn đã thanh toán', count: counts.paid, icon: 'circle-check' },
    { id: 'partial', label: 'Thanh toán một phần', count: counts.partial, icon: 'clock' },
    { id: 'unpaid', label: 'Hóa đơn chưa thanh toán', count: counts.unpaid, icon: 'file-invoice-dollar' },
  ];

  const handleTabChange = (tabId: string) => {
    const key = tabId as FeeReportTab;
    dispatch(setActiveTab(key));
    if (key === 'overview') {
      router.push(`/${schoolCode}/reports/fee/overview`);
    } else if (key === 'paid') {
      router.push(`/${schoolCode}/reports/fee`);
    } else if (key === 'partial') {
      router.push(`/${schoolCode}/reports/fee/partial`);
    } else if (key === 'unpaid') {
      router.push(`/${schoolCode}/reports/fee/unpaid`);
    }
  };

  return (
    <CountedTabs
      tabs={tabs}
      activeId={currentActiveId}
      onChange={handleTabChange}
    />
  );
};

export default FeeReportTabsNav;
