import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function CreateSchoolMenuPage() {
  const router = useRouter();
  const schoolCode = (router.query.schoolCode as string) || 'demo';

  useEffect(() => {
    const mode = router.query.mode ? `&mode=${router.query.mode}` : '';
    const template = router.query.template ? `&template=${router.query.template}` : '';
    router.replace(`/${schoolCode}/school/menu?create=true${mode}${template}`);
  }, [router, schoolCode]);

  return null;
}
