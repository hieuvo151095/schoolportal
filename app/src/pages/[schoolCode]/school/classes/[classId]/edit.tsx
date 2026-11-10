import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function EditClassPage() {
  const router = useRouter();
  const schoolCode = (router.query.schoolCode as string) || 'demo';
  const classId = router.query.classId as string;

  useEffect(() => {
    if (classId) {
      router.replace(`/${schoolCode}/school/classes/${classId}?edit=true`);
    }
  }, [router, schoolCode, classId]);

  return null;
}
