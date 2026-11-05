import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { loadSession } from '@/utils/authSession';
import { DEFAULT_LANDING_PATH } from '@/utils/authValidation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const session = loadSession();
    router.replace(session ? DEFAULT_LANDING_PATH(session.schoolCode) : '/signin');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-[#0070CE] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-sm font-semibold text-slate-600">Đang chuyển hướng...</p>
      </div>
    </div>
  );
}
