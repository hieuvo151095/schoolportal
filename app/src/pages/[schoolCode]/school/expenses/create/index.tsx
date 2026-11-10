/**
 * Finance Expenses & Disbursements Creation Page
 * Route: /[schoolCode]/school/expenses/create
 * Governance: Marcus Fleet V34 / Constitution V1.0.0
 * References: docs_legacy/operating-portal/tai-chinh/khoan-chi.md (BR01, BR02, BR04, BR06)
 */

import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function CreateExpensePage() {
  const router = useRouter();
  const schoolCode = (router.query.schoolCode as string) || 'demo';

  useEffect(() => {
    router.replace(`/${schoolCode}/school/expenses?create=true`);
  }, [router, schoolCode]);

  return null;
}
