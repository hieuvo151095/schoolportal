import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserShield,
  faUsers,
  faGraduationCap,
  faTriangleExclamation,
  faXmark,
  faCheckCircle,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  setActiveTab,
  clearToast,
  clearErrorBanner,
} from '../../../store/slices/accountSlice';
import { UserAccountsToolbar } from './UserAccountsToolbar';
import { UserAccountsTable } from './UserAccountsTable';
import { UserAccountForm } from './UserAccountForm';
import { AccountActionConfirmModal } from './AccountActionConfirmModal';
import { DeleteUserModal } from './DeleteUserModal';
import { ChangeEmailModal } from './ChangeEmailModal';
import { StudentAccountsToolbar } from './StudentAccountsToolbar';
import { StudentAccountsTable } from './StudentAccountsTable';
import { StudentAccountModal } from './StudentAccountModal';
import { PageHeader } from '@/components/ds';

export const AccountTabsShell: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { schoolCode, tab } = router.query;
  const sCode = (schoolCode as string) || 'demo';

  const { activeTab, errorBanner, toast } = useAppSelector((state) => state.account);

  // Synchronize route query with activeTab state
  useEffect(() => {
    if (tab === 'students' || router.pathname.includes('/school/kid/accounts')) {
      if (activeTab !== 'students') {
        dispatch(setActiveTab('students'));
      }
    } else {
      if (activeTab !== 'users') {
        dispatch(setActiveTab('users'));
      }
    }
  }, [tab, router.pathname, dispatch, activeTab]);

  // Auto-dismiss toast after 4s
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        dispatch(clearToast());
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast, dispatch]);

  const handleTabClick = (newTab: 'users' | 'students') => {
    dispatch(setActiveTab(newTab));
    if (newTab === 'students') {
      router.push(`/${sCode}/setting/users?tab=students`, undefined, { shallow: true });
    } else {
      router.push(`/${sCode}/setting/users`, undefined, { shallow: true });
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <PageHeader
        title="Quản lý tài khoản & phân quyền"
        description="Quản lý người dùng hệ thống, phân quyền vai trò và tài khoản đăng nhập học sinh"
      />

      {/* Global Error Banner (TK-03 for CSDL Sở rejection) */}
      {errorBanner && (
        <div
          style={{
            padding: 'var(--space-4)',
            background: '#fef2f2',
            border: '1px solid #fee2e2',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 'var(--space-3)',
            color: 'var(--semantic-red, #dc2626)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
            <FontAwesomeIcon icon={faTriangleExclamation} style={{ fontSize: '18px', marginTop: '2px', flexShrink: 0 }} />
            <div>
              <p style={{ fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {errorBanner.code}: Lỗi cập nhật trạng thái
              </p>
              <p style={{ fontSize: 'var(--text-sm)', fontWeight: 500, marginTop: '2px' }}>
                {errorBanner.message}
              </p>
            </div>
          </div>
          <button
            onClick={() => dispatch(clearErrorBanner())}
            style={{
              color: 'var(--text-tertiary)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            <FontAwesomeIcon icon={faXmark} style={{ fontSize: '16px' }} />
          </button>
        </div>
      )}

      {/* Global Toast Notification */}
      {toast && (
        <div
          style={{
            padding: 'var(--space-4)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid',
            borderColor:
              toast.type === 'success'
                ? '#bbf7d0'
                : toast.type === 'error'
                ? '#fee2e2'
                : 'var(--eco-blue-border, #bfdbfe)',
            background:
              toast.type === 'success'
                ? '#ecfdf5'
                : toast.type === 'error'
                ? '#fef2f2'
                : 'var(--color-primary-50)',
            color:
              toast.type === 'success'
                ? 'var(--semantic-green, #16a34a)'
                : toast.type === 'error'
                ? 'var(--semantic-red, #dc2626)'
                : 'var(--eco-blue-strong, #0070CE)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--space-3)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <FontAwesomeIcon
              icon={
                toast.type === 'success'
                  ? faCheckCircle
                  : toast.type === 'error'
                  ? faTriangleExclamation
                  : faInfoCircle
              }
              style={{ fontSize: '18px' }}
            />
            <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{toast.message}</p>
          </div>
          <button
            onClick={() => dispatch(clearToast())}
            style={{
              color: 'var(--text-tertiary)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            <FontAwesomeIcon icon={faXmark} style={{ fontSize: '16px' }} />
          </button>
        </div>
      )}

      {/* Two-Tab Routed Navigation Bar (K076, BR01) */}
      <div
        style={{
          borderBottom: '1px solid var(--border-neutral)',
          background: 'var(--bg-surface)',
          padding: '0 var(--space-4)',
          borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
          boxShadow: 'var(--shadow-xs)',
        }}
      >
        <div style={{ display: 'flex', gap: 'var(--space-8)' }}>
          <button
            type="button"
            onClick={() => handleTabClick('users')}
            style={{
              padding: 'var(--space-4) var(--space-2)',
              fontSize: 'var(--text-sm)',
              fontWeight: activeTab === 'users' ? 700 : 500,
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              border: 'none',
              borderBottom: activeTab === 'users' ? '2px solid var(--eco-blue-strong, #0070CE)' : '2px solid transparent',
              background: 'transparent',
              color: activeTab === 'users' ? 'var(--eco-blue-strong, #0070CE)' : 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <FontAwesomeIcon icon={faUsers} />
            <span>Người Dùng</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabClick('students')}
            style={{
              padding: 'var(--space-4) var(--space-2)',
              fontSize: 'var(--text-sm)',
              fontWeight: activeTab === 'students' ? 700 : 500,
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              border: 'none',
              borderBottom: activeTab === 'students' ? '2px solid var(--eco-blue-strong, #0070CE)' : '2px solid transparent',
              background: 'transparent',
              color: activeTab === 'students' ? 'var(--eco-blue-strong, #0070CE)' : 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <FontAwesomeIcon icon={faGraduationCap} />
            <span>Học Sinh</span>
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      {activeTab === 'users' ? (
        <div className="space-y-4">
          <UserAccountsToolbar />
          <UserAccountsTable />
          <UserAccountForm />
          <AccountActionConfirmModal />
          <DeleteUserModal />
          <ChangeEmailModal />
        </div>
      ) : (
        <div className="space-y-4">
          <StudentAccountsToolbar />
          <StudentAccountsTable />
          <StudentAccountModal />
        </div>
      )}
    </div>
  );
};
