import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function CreatePollPage() {
  const router = useRouter();
  const { schoolCode } = router.query;
  const currentSchoolCode = (schoolCode as string) || 'demo';

  useEffect(() => {
    router.replace(`/${currentSchoolCode}/school/poll?create=true`);
  }, [router, currentSchoolCode]);

  return null;
}
