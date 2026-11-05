import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function SchoolWeekdaysRedirect() {
  const router = useRouter();
  const { schoolCode } = router.query;
  const sCode = (schoolCode as string) || 'demo';

  useEffect(() => {
    if (router.isReady) {
      router.replace(`/${sCode}/setting/school/edit?tab=weekdays`);
    }
  }, [router, sCode]);

  return null;
}
