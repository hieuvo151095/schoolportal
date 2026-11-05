import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleCheck,
  faTriangleExclamation,
  faCircleInfo,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch, useAppSelector } from '@/store';
import { removeToast, ToastItem } from '@/store/slices/toastSlice';
import { clearNotification } from '@/store/slices/attendanceSlice';
import { clearToast as clearTuitionToast } from '@/store/slices/tuitionManagementSlice';

export const GlobalToastContainer: React.FC = () => {
  const dispatch = useAppDispatch();
  const toasts = useAppSelector((state) => state.toast.toasts);
  const attendanceError = useAppSelector((state) => state.attendance.errorMessage);
  const attendanceSuccess = useAppSelector((state) => state.attendance.successMessage);
  const tuitionToast = useAppSelector((state) => state.tuitionManagement.toastMessage);

  // Auto-dismiss attendance notifications
  useEffect(() => {
    if (attendanceError || attendanceSuccess) {
      const timer = setTimeout(() => {
        dispatch(clearNotification());
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [attendanceError, attendanceSuccess, dispatch]);

  // Auto-dismiss tuition toasts
  useEffect(() => {
    if (tuitionToast) {
      const timer = setTimeout(() => {
        dispatch(clearTuitionToast());
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [tuitionToast, dispatch]);

  // Auto-dismiss standard toasts
  useEffect(() => {
    if (toasts.length > 0) {
      const timers = toasts.map((t) => {
        const dur = t.duration ?? 3500;
        return setTimeout(() => {
          dispatch(removeToast(t.id));
        }, dur);
      });
      return () => {
        timers.forEach((t) => clearTimeout(t));
      };
    }
  }, [toasts, dispatch]);

  const hasAnyToast =
    toasts.length > 0 || !!attendanceError || !!attendanceSuccess || !!tuitionToast;

  if (!hasAnyToast) return null;

  return (
    <div
      aria-live="polite"
      className="fixed top-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
    >
      {/* Attendance Module Error Toast */}
      {attendanceError && (
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md border border-rose-200 text-rose-900 px-4 py-3 rounded-xl shadow-xl flex items-start justify-between gap-3 animate-in slide-in-from-top-3 fade-in duration-200 ring-1 ring-rose-500/10">
          <div className="flex items-start gap-2.5">
            <FontAwesomeIcon icon={faTriangleExclamation} className="text-rose-600 text-base mt-0.5 shrink-0" />
            <div>
              <div className="text-xs font-bold text-rose-800">Thông báo lỗi</div>
              <div className="text-xs text-rose-700 mt-0.5 leading-relaxed">{attendanceError}</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => dispatch(clearNotification())}
            className="text-rose-400 hover:text-rose-700 p-1 -mr-1 rounded-md transition-colors"
            title="Đóng thông báo"
          >
            <FontAwesomeIcon icon={faXmark} className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Attendance Module Success Toast */}
      {attendanceSuccess && (
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md border border-emerald-200 text-emerald-900 px-4 py-3 rounded-xl shadow-xl flex items-start justify-between gap-3 animate-in slide-in-from-top-3 fade-in duration-200 ring-1 ring-emerald-500/10">
          <div className="flex items-start gap-2.5">
            <FontAwesomeIcon icon={faCircleCheck} className="text-emerald-600 text-base mt-0.5 shrink-0" />
            <div>
              <div className="text-xs font-bold text-emerald-800">Thành công</div>
              <div className="text-xs text-emerald-700 mt-0.5 leading-relaxed">{attendanceSuccess}</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => dispatch(clearNotification())}
            className="text-emerald-400 hover:text-emerald-700 p-1 -mr-1 rounded-md transition-colors"
            title="Đóng thông báo"
          >
            <FontAwesomeIcon icon={faXmark} className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Tuition Management Module Toast */}
      {tuitionToast && (
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md border border-blue-200 text-blue-900 px-4 py-3 rounded-xl shadow-xl flex items-start justify-between gap-3 animate-in slide-in-from-top-3 fade-in duration-200 ring-1 ring-blue-500/10">
          <div className="flex items-start gap-2.5">
            <FontAwesomeIcon icon={faCircleCheck} className="text-[#0070CE] text-base mt-0.5 shrink-0" />
            <div>
              <div className="text-xs font-bold text-[#0070CE]">Quản lý học phí</div>
              <div className="text-xs text-slate-700 mt-0.5 leading-relaxed">{tuitionToast}</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => dispatch(clearTuitionToast())}
            className="text-slate-400 hover:text-slate-700 p-1 -mr-1 rounded-md transition-colors"
            title="Đóng thông báo"
          >
            <FontAwesomeIcon icon={faXmark} className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Global Generic Toasts */}
      {toasts.map((toast) => {
        let borderClass = 'border-blue-200 text-blue-900 ring-blue-500/10';
        let icon = faCircleInfo;
        let iconColor = 'text-[#0070CE]';
        let titleColor = 'text-[#0070CE]';

        if (toast.type === 'success') {
          borderClass = 'border-emerald-200 text-emerald-900 ring-emerald-500/10';
          icon = faCircleCheck;
          iconColor = 'text-emerald-600';
          titleColor = 'text-emerald-800';
        } else if (toast.type === 'error') {
          borderClass = 'border-rose-200 text-rose-900 ring-rose-500/10';
          icon = faTriangleExclamation;
          iconColor = 'text-rose-600';
          titleColor = 'text-rose-800';
        } else if (toast.type === 'warning') {
          borderClass = 'border-amber-200 text-amber-900 ring-amber-500/10';
          icon = faTriangleExclamation;
          iconColor = 'text-amber-600';
          titleColor = 'text-amber-800';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto bg-white/95 backdrop-blur-md border ${borderClass} px-4 py-3 rounded-xl shadow-xl flex items-start justify-between gap-3 animate-in slide-in-from-top-3 fade-in duration-200 ring-1`}
          >
            <div className="flex items-start gap-2.5">
              <FontAwesomeIcon icon={icon} className={`${iconColor} text-base mt-0.5 shrink-0`} />
              <div>
                {toast.title && <div className={`text-xs font-bold ${titleColor}`}>{toast.title}</div>}
                <div className="text-xs text-slate-700 mt-0.5 leading-relaxed">{toast.message}</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => dispatch(removeToast(toast.id))}
              className="text-slate-400 hover:text-slate-700 p-1 -mr-1 rounded-md transition-colors"
              title="Đóng thông báo"
            >
              <FontAwesomeIcon icon={faXmark} className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default GlobalToastContainer;
