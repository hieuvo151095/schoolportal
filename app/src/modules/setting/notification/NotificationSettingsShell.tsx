import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBell,
  faChevronRight,
  faCheckCircle,
} from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch, useAppSelector } from '../../../store';
import { clearToastMessage } from '../../../store/slices/notificationSettingsSlice';
import { NotificationPolicyBanner } from './NotificationPolicyBanner';
import { AttendanceNotificationCard } from './AttendanceNotificationCard';
import { BirthdayNotificationCard } from './BirthdayNotificationCard';
import { TuitionNotificationCard } from './TuitionNotificationCard';
import { OtherNotificationCard } from './OtherNotificationCard';
import { ParentNotificationCard } from './ParentNotificationCard';
import { NotificationActionBar } from './NotificationActionBar';
import { NotificationConfirmModal } from './NotificationConfirmModal';

export const NotificationSettingsShell: React.FC = () => {
  const router = useRouter();
  const schoolCode = (router.query.schoolCode as string) || 'demo';
  const dispatch = useAppDispatch();
  const { toastMessage } = useAppSelector(
    (state) => state.notificationSettings
  );

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        dispatch(clearToastMessage());
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage, dispatch]);

  return (
    <div className="space-y-6 pb-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-between gap-3 shadow-xs animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <FontAwesomeIcon
              icon={faCheckCircle}
              className="text-emerald-600 text-base"
            />
            <span className="text-sm font-semibold">{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => dispatch(clearToastMessage())}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 cursor-pointer"
          >
            Đóng
          </button>
        </div>
      )}

      {/* Header & Breadcrumbs */}
      <div>
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-1.5 font-medium">
          <Link
            href={`/${schoolCode}/setting/school`}
            className="hover:text-[#0070CE] transition-colors"
          >
            Cấu hình
          </Link>
          <FontAwesomeIcon icon={faChevronRight} className="text-[10px] text-slate-400" />
          <span className="text-slate-800 font-semibold">Thông báo</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-blue-100 text-[#0070CE] flex items-center justify-center shrink-0 text-sm">
                <FontAwesomeIcon icon={faBell} />
              </span>
              Cấu hình thông báo
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
              Quản lý và kích hoạt các luồng thông báo tự động, lời nhắc định kỳ và phân phối đa kênh toàn trường
            </p>
          </div>
        </div>
      </div>

      {/* Top Policy Banner (BR03, K097) */}
      <NotificationPolicyBanner />

      {/* Monolithic Configuration Cards (1 to 5) (BR01, K095) */}
      <div className="space-y-6">
        <AttendanceNotificationCard />
        <BirthdayNotificationCard />
        <TuitionNotificationCard />
        <OtherNotificationCard />
        <ParentNotificationCard />
      </div>

      {/* Bottom Sticky Action Bar (BR01, BR02, K095) */}
      <NotificationActionBar />

      {/* Confirmation Modal (BR02, K096) */}
      <NotificationConfirmModal />
    </div>
  );
};
