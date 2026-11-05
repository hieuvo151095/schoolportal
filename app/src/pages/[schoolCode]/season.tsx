import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function SeasonRedirect() {
  const router = useRouter();
  const { schoolCode } = router.query;

  useEffect(() => {
    const code = typeof schoolCode === 'string' && schoolCode ? schoolCode : 'demo';
    router.replace(`/${code}/school/academic-year`);
  }, [router, schoolCode]);

  return null;
}
