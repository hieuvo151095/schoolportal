import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Icon } from '@/components/ds';
import { MOCK_DEPARTMENTS, MOCK_SSO_ACCOUNTS, MOCK_SSO_SCHOOLS } from '@/services/mockAuthData';
import {
  authenticateSso,
  resolvePostLoginPath,
  validateSsoCredentials,
} from '@/utils/authValidation';
import { saveSession } from '@/utils/authSession';
import styles from '@/styles/signin.module.css';

/**
 * Cổng đăng nhập SSO của Sở (MOCK).
 * Mô phỏng giao diện chuẩn api.hcm.edu.vn/SignOnV2/ssologin của Sở GD&ĐT TP.HCM.
 */
export default function SsoLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const soId = typeof router.query.so === 'string' ? router.query.so : '';
  const schoolId = typeof router.query.school === 'string' ? router.query.school : '';
  const dept = MOCK_DEPARTMENTS.find((d) => d.id === soId);
  const school = MOCK_SSO_SCHOOLS.find((s) => s.code === schoolId && s.departmentId === soId);

  useEffect(() => {
    setFormError('');
  }, [username, password]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting || !school) return;
    const v = validateSsoCredentials({ username, password });
    setErrors(v.errors);
    if (!v.isValid) return;
    setSubmitting(true);
    window.setTimeout(() => {
      const result = authenticateSso(MOCK_SSO_ACCOUNTS, MOCK_SSO_SCHOOLS, school.code, {
        username,
        password,
      });
      if (!result.ok) {
        setFormError(result.error);
        setPassword('');
        setSubmitting(false);
        return;
      }
      saveSession(result.session, false);
      router.replace(resolvePostLoginPath(result.session.schoolCode, router.query.next));
    }, 350);
  };

  if (router.isReady && (!dept || !school)) {
    return (
      <main className={styles.ssoPage}>
        <div className={styles.ssoCard}>
          <h1 className={styles.ssoSchoolTitle}>Liên kết SSO không hợp lệ</h1>
          <p className={styles.ssoAppSubtitle}>
            Không tìm thấy Sở hoặc trường tương ứng. Vui lòng chọn lại.
          </p>
          <div className={styles.ssoBack}>
            <Link href="/signin" className="body-sm" style={{ color: '#0070d2', fontWeight: 600 }}>
              Quay lại đăng nhập
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      <Head>
        <title>{`${dept ? dept.ssoBrand : 'SSO'} | Đăng nhập`}</title>
      </Head>
      <main className={styles.ssoPage}>
        <div className={styles.ssoCard}>
          {/* Emblem Sở & Tên hệ thống */}
          <div className={styles.ssoEmblemWrap}>
            <img
              src="/images/signin/hcmedu-emblem@2x.png"
              alt={dept ? dept.ssoBrand : 'HCMEDU SSO'}
              className={styles.ssoEmblemImg}
            />
            <span className={styles.ssoBrandSubtitle}>{dept ? dept.ssoBrand : 'HCMEDU SSO'}</span>
          </div>

          <h1 className={styles.ssoSchoolTitle}>{school ? school.name : 'Liên cấp PT Sao Mai'}</h1>
          <p className={styles.ssoAppSubtitle}>EDUi APP</p>

          <form className={styles.ssoForm} onSubmit={submit} noValidate>
            {formError ? (
              <div role="alert" className={`${styles.alert} body-sm`}>
                <Icon name="circle-exclamation" size={14} />
                <span>{formError}</span>
              </div>
            ) : null}

            <div>
              <div className={styles.ssoLabelRow}>
                <label htmlFor="sso-username" className={styles.ssoLabelText}>
                  Tên tài khoản
                </label>
                <span className={styles.ssoRequiredText}>*Nhập số CCCD</span>
              </div>
              <input
                id="sso-username"
                type="text"
                className={styles.ssoInput}
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={submitting}
                autoFocus
              />
              {errors.username ? (
                <span
                  className="body-2xs"
                  style={{ color: '#ff0000', marginTop: 4, display: 'block' }}
                >
                  {errors.username}
                </span>
              ) : null}
            </div>

            <div>
              <div className={styles.ssoLabelRow}>
                <label htmlFor="sso-password" className={styles.ssoLabelText}>
                  Mật khẩu
                </label>
              </div>
              <input
                id="sso-password"
                type="password"
                className={styles.ssoInput}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={submitting}
              />
              {errors.password ? (
                <span
                  className="body-2xs"
                  style={{ color: '#ff0000', marginTop: 4, display: 'block' }}
                >
                  {errors.password}
                </span>
              ) : null}
            </div>

            <button type="submit" className={styles.ssoSubmitBtn} disabled={submitting}>
              {submitting ? 'Đang xác thực...' : 'Đăng Nhập'}
            </button>
          </form>

          <div className={styles.ssoPowered}>
            Powered by
            <a href="#" className={styles.ssoPoweredLink}>
              {dept ? dept.poweredBy : 'Sở Giáo dục và Đào tạo TP Hồ Chí Minh'}
            </a>
          </div>

          <div className={styles.ssoBack}>
            <Link href="/signin" className="body-xs" style={{ color: '#718096' }}>
              ← Chọn trường khác
            </Link>
          </div>
        </div>

        {/* reCAPTCHA badge floating bottom right */}
        <div className={styles.recaptchaBadge} aria-hidden="true">
          <img src="/images/signin/recaptcha-badge.png" alt="reCAPTCHA" width={44} height={45} />
        </div>
      </main>
    </>
  );
}
