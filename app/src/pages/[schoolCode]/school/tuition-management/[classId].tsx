/**
 * Class Fee Schedule 2D Matrix Page (Danh Sách Khoản Phí Theo Lớp)
 * Route: /[schoolCode]/school/tuition-management/[classId]
 * Governance: Marcus Fleet V34 / Constitution V1.0.0
 * References: docs_legacy/operating-portal/tai-chinh/quan-ly-hoc-phi.md (BR02-BR10)
 */

import React, { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import PortalLayout from '../../../../components/layout/PortalLayout';
import { ClassFeeMatrixTable } from '../../../../modules/finance/tuition/ClassFeeMatrixTable';
import { useAppDispatch } from '../../../../store';
import { setActiveClass } from '../../../../store/slices/tuitionManagementSlice';

export default function ClassTuitionMatrixPage() {
  const router = useRouter();
  const schoolCode = (router.query.schoolCode as string) || 'demo';
  const classId = (router.query.classId as string) || '12A1';
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (classId) {
      dispatch(setActiveClass(classId));
    }
  }, [classId, dispatch]);

  return (
    <PortalLayout>
      <Head>
        <title>Danh Sách Khoản Phí Theo Lớp {classId} — Finviet School Portal</title>
        <meta
          name="description"
          content={`Ma trận chi tiết học phí và các khoản thu riêng cho từng học sinh lớp ${classId}.`}
        />
      </Head>

      <div className="space-y-6">
        {/* 2D Matrix Table Component with Sticky Unsaved Changes Banner */}
        <ClassFeeMatrixTable />
      </div>
    </PortalLayout>
  );
}
