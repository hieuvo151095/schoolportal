import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function EditAnnouncementPage() {
  const router = useRouter();
  const schoolCode = (router.query.schoolCode as string) || 'demo';
  const id = router.query.id as string;

  useEffect(() => {
    if (id) {
      router.replace(`/${schoolCode}/school/announcements?edit=${id}`);
    }
  }, [router, schoolCode, id]);

  return null;
}
