/**
 * Tuition Exemption & Fee Discount Policy Management Page (Miễn Giảm)
 * Route: /[schoolCode]/school/discount
 * Finance Domain - Finviet / SOHA School Operating Portal
 * Governance: Marcus Fleet V34 / Constitution V1.0.0
 * Design System: [DS] ECO ME DASHBOARD v1.1.0
 */

import React, { useMemo } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import PortalLayout from '../../../../components/layout/PortalLayout';
import { PageHeader, StatCard, Button } from '../../../../components/ds';
import { useAppDispatch, useAppSelector } from '../../../../store';
import {
  openCreateModal,
  closeCreateModal,
  closeEditModal,
  closeBeneficiaryModal,
} from '../../../../store/slices/discountSlice';
import { matchesDiscountFilter } from '../../../../utils/discountValidation';
import { DiscountToolbar } from '../../../../modules/finance/discount/DiscountToolbar';
import { DiscountTable } from '../../../../modules/finance/discount/DiscountTable';
import { CreateDiscountPolicyModal } from '../../../../modules/finance/discount/CreateDiscountPolicyModal';
import { BeneficiaryModal } from '../../../../modules/finance/discount/BeneficiaryModal';

export default function DiscountPage() {
  const router = useRouter();
  const schoolCode = (router.query.schoolCode as string) || 'demo';
  const dispatch = useAppDispatch();
  const {
    policies,
    filters,
    isCreateModalOpen,
    editingPolicy,
    inspectingBeneficiaryPolicy,
  } = useAppSelector((state) => state.discount);

  // Filtered policies list
  const filteredPolicies = useMemo(() => {
    return policies.filter((p) => matchesDiscountFilter(p, filters));
  }, [policies, filters]);

  // Aggregate metrics
  const activeCount = useMemo(
    () => policies.filter((p) => p.status === 'active').length,
    [policies]
  );

  const totalClassBeneficiaries = useMemo(() => {
    const classSet = new Set<string>();
    policies
      .filter((p) => p.status === 'active' && p.scopeType === 'class')
      .forEach((p) => p.targets.forEach((t) => classSet.add(t.targetId)));
    return classSet.size;
  }, [policies]);

  const totalStudentBeneficiaries = useMemo(() => {
    const studentSet = new Set<string>();
    policies
      .filter((p) => p.status === 'active' && p.scopeType === 'student')
      .forEach((p) => p.targets.forEach((t) => studentSet.add(t.targetId)));
    return studentSet.size;
  }, [policies]);

  const handleCloseFormModal = () => {
    dispatch(closeCreateModal());
    dispatch(closeEditModal());
  };

  return (
    <PortalLayout>
      <Head>
        <title>Miễn Giảm Học Phí & Khoản Thu — Finviet School Portal</title>
        <meta
          name="description"
          content="Quản lý chính sách miễn giảm học phí và các khoản thu theo Lớp học hoặc Học sinh, tích hợp tự động vào hóa đơn."
        />
      </Head>

      <div className="space-y-5">
        {/* 1. Page Header */}
        <PageHeader
          title="Chính Sách Miễn Giảm Học Phí & Khoản Thu"
          description="Thiết lập mức miễn giảm linh hoạt (theo % hoặc số tiền cố định), chỉ định phạm vi theo Lớp hoặc từng Học sinh cụ thể."
        />

        {/* 2. 4 StatCards KPI Summary */}
        <div
          className="ecomd-stat-group"
          style={{ '--ecomd-cols': 4 } as React.CSSProperties}
        >
          <StatCard
            label="Tổng chính sách"
            value={`${policies.length} chính sách`}
            icon="coins"
            tone="neutral"
          />
          <StatCard
            label="Đang áp dụng"
            value={`${activeCount} đang bật`}
            icon="circle-check"
            tone="success"
          />
          <StatCard
            label="Lớp thụ hưởng"
            value={`${totalClassBeneficiaries} lớp`}
            icon="chalkboard"
            tone="info"
          />
          <StatCard
            label="Học sinh chỉ định"
            value={`${totalStudentBeneficiaries} học sinh`}
            icon="graduation-cap"
            tone="neutral"
          />
        </div>

        {/* 3. Unified Table Card (CountedTabs + Toolbar + Table + Footer) */}
        <div className="ecomd-table-card">
          <DiscountToolbar
            filteredCount={filteredPolicies.length}
            totalCount={policies.length}
          />
          <DiscountTable policies={filteredPolicies} />
        </div>

        {/* Create / Edit Policy Modal */}
        <CreateDiscountPolicyModal
          isOpen={isCreateModalOpen || editingPolicy !== null}
          editingPolicy={editingPolicy}
          onClose={handleCloseFormModal}
        />

        {/* Beneficiary List Inspection Modal */}
        <BeneficiaryModal
          policy={inspectingBeneficiaryPolicy}
          isOpen={inspectingBeneficiaryPolicy !== null}
          onClose={() => dispatch(closeBeneficiaryModal())}
        />
      </div>
    </PortalLayout>
  );
}
