import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function EditHandbookArticlePage() {
  const router = useRouter();
  const { schoolCode, articleId } = router.query;
  const currentSchoolCode = (schoolCode as string) || 'demo';

  useEffect(() => {
    if (articleId) {
      router.replace(`/${currentSchoolCode}/school/handbook?edit=${articleId}`);
    }
  }, [router, currentSchoolCode, articleId]);

  return null;
}
