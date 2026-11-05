import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function FeaturesRedirectPage() {
  const router = useRouter();
  const { schoolCode } = router.query;

  useEffect(() => {
    if (router.isReady) {
      const sCode = (schoolCode as string) || 'demo';
      router.replace(`/${sCode}/setting/activity`);
    }
  }, [router, schoolCode]);

  return null;
}
