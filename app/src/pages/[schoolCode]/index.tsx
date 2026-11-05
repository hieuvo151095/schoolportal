import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function SchoolCodeHome() {
  const router = useRouter();
  const { schoolCode } = router.query;

  useEffect(() => {
    const code = typeof schoolCode === 'string' && schoolCode ? schoolCode : 'demo';
    if (code.includes('.')) return;
    router.replace(`/${code}/class/lop-1a1/attendance`);
  }, [router, schoolCode]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-[#0070CE] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-sm font-semibold text-slate-600">
          Đang chuyển hướng tới phân hệ Điểm Danh...
        </p>
      </div>
    </div>
  );
}
