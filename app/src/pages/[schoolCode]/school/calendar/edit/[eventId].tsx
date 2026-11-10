import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function EditEventPage() {
  const router = useRouter();
  const schoolCode = (router.query.schoolCode as string) || 'demo';
  const { eventId } = router.query;

  useEffect(() => {
    if (eventId) {
      router.replace(`/${schoolCode}/school/calendar?edit=${eventId}`);
    }
  }, [router, schoolCode, eventId]);

  return null;
}
