import React, { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
  Checkbox,
  ComboboxField,
  Icon,
  SegmentedControl,
  TextField,
} from '@/components/ds';
import {
  MOCK_DEPARTMENTS,
  MOCK_SCHOOL_ACCOUNTS,
  MOCK_SSO_SCHOOLS,
} from '@/services/mockAuthData';
import {
  authenticateAccount,
  buildSsoPortalUrl,
  formatSchoolLabel,
  getSchoolsByDepartment,
  resolvePostLoginPath,
  sanitizeNextPath,
  validateAccountLogin,
  validateSsoSelection,
} from '@/utils/authValidation';
import { loadSession, saveSession } from '@/utils/authSession';
import type { LoginMethod } from '@/types/auth';
import styles from '@/styles/signin.module.css';

export default function SignInPage() {
  const router = useRouter();
  const [method, setMethod] = useState<LoginMethod>('sso');

  // --- Account form ---
  const [schoolCode, setSchoolCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [accountErrors, setAccountErrors] = useState<Record<string, string | undefined>>({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // --- SSO form ---
  const [departmentId, setDepartmentId] = useState(MOCK_DEPARTMENTS[0].id);
  const [ssoSchoolCode, setSsoSchoolCode] = useState('');
  const [ssoErrors, setSsoErrors] = useState<Record<string, string | undefined>>({});

  const next = router.query.next;

  // Đã đăng nhập → vào thẳng hệ thống. Cho phép mở tab theo ?method=
  useEffect(() => {
    if (!router.isReady) return;
    const m = router.query.method;
    if (m === 'account' || m === 'sso') setMethod(m);
    const existing = loadSession();
    if (existing) router.replace(resolvePostLoginPath(existing.schoolCode, router.query.next));
  }, [router.isReady]); // eslint-disable-line react-hooks/exhaustive-deps

  const schoolOptions = useMemo(
    () =>
      getSchoolsByDepartment(MOCK_SSO_SCHOOLS, departmentId).map((s) => ({
        value: s.code,
        label: formatSchoolLabel(s),
      })),
    [departmentId]
  );

  const switchMethod = (m: LoginMethod) => {
    setMethod(m);
    setFormError('');
    setAccountErrors({});
    setSsoErrors({});
  };

  const handleAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setFormError('');
    const v = validateAccountLogin({ schoolCode, email, password });
    setAccountErrors(v.errors);
    if (!v.isValid) return;

    setSubmitting(true);
    // Mock độ trễ mạng; backend thật: POST /{schoolCode}/api/1.0/auth/login
    window.setTimeout(() => {
      const result = authenticateAccount(MOCK_SCHOOL_ACCOUNTS, { schoolCode, email, password });
      if (!result.ok) {
        setFormError(result.error);
        setPassword('');
        setSubmitting(false);
        return;
      }
      saveSession(result.session, remember);
      router.replace(resolvePostLoginPath(result.session.schoolCode, next));
    }, 350);
  };

  const handleSsoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = validateSsoSelection(departmentId, ssoSchoolCode);
    setSsoErrors(v.errors);
    if (!v.isValid) return;
    const url = buildSsoPortalUrl(MOCK_DEPARTMENTS, MOCK_SSO_SCHOOLS, departmentId, ssoSchoolCode);
    if (!url) {
      setSsoErrors({ school: 'Trường không thuộc Sở đã chọn.' });
      return;
    }
    const safeNext = sanitizeNextPath(next);
    router.push(safeNext ? `${url}&next=${encodeURIComponent(safeNext)}` : url);
  };

  return (
    <>
      <Head>
        <title>Đăng nhập | ECO School Portal</title>
      </Head>
      <main className={styles.page}>
        {/* Decorative Floating Clouds */}
        <div className={styles.cloudWrap} aria-hidden="true">
          <svg className={styles.cloud1} width="160" height="70" viewBox="0 0 160 70" fill="none">
            <path
              d="M25 55C14 55 5 46 5 35C5 24.5 13 16 23.5 15.2C27 6.5 35.5 0.5 45.5 0.5C57.5 0.5 67.5 9 69.5 20.5C73.5 17 78.5 15 84 15C96 15 106 24.5 106.5 36.5C110 34.5 114 33.5 118 33.5C129 33.5 138 42.5 138 53.5C138 54 138 54.5 137.9 55H25Z"
              fill="#FFFFFF"
              fillOpacity="0.85"
            />
          </svg>
          <svg className={styles.cloud2} width="140" height="60" viewBox="0 0 140 60" fill="none">
            <path
              d="M20 50C10 50 2 42 2 32C2 22.5 9.5 15 19 14.2C22 6.5 29.5 1 38.5 1C49 1 58 8.5 60 18.5C63.5 15.5 68 13.5 73 13.5C83.5 13.5 92 22 92.5 32.5C95.5 31 99 30 102.5 30C112 30 120 38 120 47.5C120 48.5 119.8 49.3 119.6 50H20Z"
              fill="#FFFFFF"
              fillOpacity="0.85"
            />
          </svg>
          <svg className={styles.cloud3} width="180" height="75" viewBox="0 0 180 75" fill="none">
            <path
              d="M28 60C15 60 4 49 4 36C4 23.5 14 13.5 26 13C30 5 39 0 50 0C63 0 74 9 76.5 21.5C81 18 86.5 16 92.5 16C105.5 16 116 26.5 116.5 39.5C120.5 37.5 125 36.5 129.5 36.5C141.5 36.5 151 46 151 58C151 58.7 150.9 59.4 150.7 60H28Z"
              fill="#FFFFFF"
              fillOpacity="0.85"
            />
          </svg>
          <svg className={styles.cloud4} width="150" height="65" viewBox="0 0 150 65" fill="none">
            <path
              d="M22 55C11 55 2 46 2 35C2 24.5 10 16.5 20.5 16C24 7 32.5 1 42 1C53 1 62.5 8.5 64.5 19C68 16 73 14 78 14C89 14 98 23 98.5 34C102 32.5 106 31.5 110 31.5C120 31.5 128 39.5 128 49.5C128 51.5 127.6 53.3 127 55H22Z"
              fill="#FFFFFF"
              fillOpacity="0.85"
            />
          </svg>
          <svg className={styles.cloud5} width="170" height="70" viewBox="0 0 170 70" fill="none">
            <path
              d="M25 55C12 55 2 45 2 33C2 21.5 11 12 22.5 11.5C26 4.5 34 0 43.5 0C55 0 65 8 67 19C71 16 76 14 81.5 14C93 14 102.5 23 103 34.5C106.5 33 110.5 32 114.5 32C125 32 133.5 40.5 133.5 51C133.5 52.5 133.2 53.8 132.7 55H25Z"
              fill="#FFFFFF"
              fillOpacity="0.8"
            />
          </svg>
        </div>

        {/* Central Card */}
        <div className={styles.card}>
          <aside className={styles.promo} aria-label="Giới thiệu giải pháp">
            <img
              src="/images/signin/promo-banner@2x.png"
              alt="Giải pháp Chuyển đổi số Giáo dục - Finviet Hotline 1900 9005"
              className={styles.promoImg}
            />
          </aside>

          <section className={styles.panel} aria-labelledby="signin-heading">
            <div className={styles.logoWrap}>
              <img
                src="/images/signin/finviet-logo@2x.png"
                alt="Finviet"
                className={styles.logoImg}
                width={95}
                height={45}
              />
            </div>
            <h1 id="signin-heading" className={styles.heading}>
              Đăng nhập vào trường
            </h1>

            <div className={styles.tabs}>
              <SegmentedControl
                value={method}
                onChange={switchMethod}
                items={[
                  { key: 'sso', label: 'Đăng nhập SSO' },
                  { key: 'account', label: 'Đăng nhập bằng tài khoản' },
                ]}
              />
            </div>

            {method === 'sso' ? (
              <form
                id="panel-sso"
                role="tabpanel"
                aria-labelledby="tab-sso"
                className={styles.form}
                onSubmit={handleSsoSubmit}
                noValidate
              >
                <div className={styles.formBody}>
                  <ComboboxField
                    size="lg"
                    icon="location-dot"
                    searchable={false}
                    placeholder="Chọn Sở Giáo dục"
                    options={MOCK_DEPARTMENTS.map((d) => ({ value: d.id, label: d.name }))}
                    value={departmentId}
                    onChange={(v) => {
                      setDepartmentId(v);
                      setSsoSchoolCode('');
                      setSsoErrors({});
                    }}
                    error={ssoErrors.department}
                  />
                  <ComboboxField
                    size="lg"
                    icon="school"
                    placeholder="Chọn trường / Nhập mã trường"
                    emptyText="Không tìm thấy trường"
                    options={schoolOptions}
                    value={ssoSchoolCode}
                    onChange={(v) => {
                      setSsoSchoolCode(v);
                      setSsoErrors((s) => ({ ...s, school: undefined }));
                    }}
                    error={ssoErrors.school}
                  />
                </div>
                <button type="submit" className={styles.submitBtn}>
                  Đăng nhập SSO
                </button>
              </form>
            ) : (
              <form
                id="panel-account"
                role="tabpanel"
                aria-labelledby="tab-account"
                className={styles.form}
                onSubmit={handleAccountSubmit}
                noValidate
              >
                {formError ? (
                  <div role="alert" className={`${styles.alert} body-sm`}>
                    <Icon name="circle-exclamation" size={14} />
                    <span>{formError}</span>
                  </div>
                ) : null}
                <div className={styles.formBody}>
                  <TextField
                    size="lg"
                    icon="school"
                    placeholder="Mã trường"
                    name="schoolCode"
                    autoComplete="organization"
                    value={schoolCode}
                    onChange={(v) => setSchoolCode(v)}
                    error={accountErrors.schoolCode}
                    disabled={submitting}
                  />
                  <div className={styles.phoneLoginRow}>
                    <button
                      type="button"
                      className={styles.phoneLoginLink}
                      onClick={() => alert('Tính năng đăng nhập bằng số điện thoại đang được chuẩn bị.')}
                    >
                      Đăng nhập bằng số điện thoại
                    </button>
                  </div>
                  <TextField
                    size="lg"
                    icon="user"
                    type="email"
                    placeholder="Email"
                    name="email"
                    autoComplete="username"
                    value={email}
                    onChange={(v) => setEmail(v)}
                    error={accountErrors.email}
                    disabled={submitting}
                  />
                  <TextField
                    size="lg"
                    icon="lock"
                    type="password"
                    placeholder="Mật khẩu"
                    name="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(v) => setPassword(v)}
                    error={accountErrors.password}
                    disabled={submitting}
                  />
                  <Checkbox label="Nhớ mật khẩu" checked={remember} onChange={setRemember} />
                </div>
                <button type="submit" className={styles.submitBtn} disabled={submitting}>
                  {submitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </button>
              </form>
            )}

            {process.env.NODE_ENV !== 'production' ? (
              <div className={styles.demo}>
                <strong>Tài khoản demo:</strong>{' '}
                {method === 'account' ? (
                  <>
                    Mã trường <code>demo</code> · <code>admin@demo.edu.vn</code> ·{' '}
                    <code>Demo@2026</code>
                  </>
                ) : (
                  <>
                    Chọn <code>Liên cấp PT Sao Mai</code>, CCCD <code>079201001234</code> ·{' '}
                    <code>Sso@2026</code>
                  </>
                )}
              </div>
            ) : null}

            <div className={styles.footerLang}>
              <span className={styles.langItem}>English</span>
              <span className={styles.langDivider}>|</span>
              <span className={`${styles.langItem} ${styles.langActive}`}>Tiếng Việt</span>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
