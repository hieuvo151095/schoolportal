import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { loadSession, saveSession } from '@/utils/authSession';
import { MOCK_SCHOOL_ACCOUNTS } from '@/services/mockAuthData';
import type { AuthSession } from '@/types/auth';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    let session = loadSession();
    if (!session) {
      const demoAccount = MOCK_SCHOOL_ACCOUNTS[0];
      const demoSession: AuthSession = {
        method: 'account',
        schoolCode: demoAccount.schoolCode,
        schoolName: demoAccount.schoolName,
        displayName: demoAccount.displayName,
        role: demoAccount.role,
        issuedAt: new Date().toISOString(),
      };
      saveSession(demoSession, true);
    }
    router.replace('/demo/school/subjects');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-[#0070CE] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-sm font-semibold text-slate-600">Đang chuyển hướng tới hệ thống...</p>
      </div>
    </div>
  );
}
