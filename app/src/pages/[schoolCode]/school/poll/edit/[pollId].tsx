import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function EditPollPage() {
  const router = useRouter();
  const { schoolCode, pollId } = router.query;
  const currentSchoolCode = (schoolCode as string) || 'demo';

  useEffect(() => {
    if (pollId) {
      router.replace(`/${currentSchoolCode}/school/poll?edit=${pollId}`);
    }
  }, [router, currentSchoolCode, pollId]);

  return null;
}
