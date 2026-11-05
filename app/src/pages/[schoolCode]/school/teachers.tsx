import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function TeachersRedirect() {
  const router = useRouter();
  const { schoolCode } = router.query;

  useEffect(() => {
    const code = typeof schoolCode === 'string' && schoolCode ? schoolCode : 'demo';
    router.replace(`/${code}/school/teacher`);
  }, [router, schoolCode]);

  return null;
}
