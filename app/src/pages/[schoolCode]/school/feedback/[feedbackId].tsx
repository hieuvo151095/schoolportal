import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import PortalLayout from '@/components/layout/PortalLayout';
import { useAppSelector } from '@/store';
import FeedbackDetailPane from '@/modules/school/feedback/FeedbackDetailPane';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

export default function SchoolFeedbackDetailPage() {
  const router = useRouter();
  const { schoolCode = 'demo', feedbackId } = router.query;
  const currentSchoolCode = (schoolCode as string) || 'demo';

  const { items } = useAppSelector((state) => state.feedback);
  const currentItem = items.find((i) => i.id === feedbackId);

  return (
    <PortalLayout schoolCode={currentSchoolCode}>
      <Head>
        <title>
          {currentItem
            ? `${currentItem.code}: ${currentItem.title} | Góp Ý Phụ Huynh`
            : 'Chi Tiết Góp Ý | SOHA Operating Portal'}
        </title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {!currentItem ? (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center max-w-lg mx-auto my-12 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-3 text-lg">
              <FontAwesomeIcon icon={faExclamationCircle} />
            </div>
            <h2 className="text-base font-bold text-slate-800 mb-2">
              Không tìm thấy góp ý
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Mã góp ý <span className="font-semibold text-slate-700">{feedbackId}</span> không tồn tại hoặc đã được chuyển vào kho lưu trữ.
            </p>
            <Link
              href={`/${currentSchoolCode}/school/feedback`}
              className="inline-flex items-center px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-1.5" />
              Quay lại hòm thư góp ý
            </Link>
          </div>
        ) : (
          <FeedbackDetailPane item={currentItem} />
        )}
      </div>
    </PortalLayout>
  );
}
