import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function CreateTeacherPage() {
  const router = useRouter();
  const schoolCode = (router.query.schoolCode as string) || 'demo';

  useEffect(() => {
    router.replace(`/${schoolCode}/school/teacher?create=true`);
  }, [router, schoolCode]);

  return null;
}
