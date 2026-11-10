import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function CreateEventPage() {
  const router = useRouter();
  const schoolCode = (router.query.schoolCode as string) || 'demo';

  useEffect(() => {
    router.replace(`/${schoolCode}/school/calendar?create=true`);
  }, [router, schoolCode]);

  return null;
}
