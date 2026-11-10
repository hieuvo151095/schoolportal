import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function CreateHandbookArticlePage() {
  const router = useRouter();
  const { schoolCode, categoryId } = router.query;
  const currentSchoolCode = (schoolCode as string) || 'demo';

  useEffect(() => {
    const q = categoryId ? `?create=true&categoryId=${categoryId}` : `?create=true`;
    router.replace(`/${currentSchoolCode}/school/handbook${q}`);
  }, [router, currentSchoolCode, categoryId]);

  return null;
}
