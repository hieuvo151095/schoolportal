import {
  Body1,
  Button,
  Checkbox,
  Combobox,
  Field,
  Input,
  Link,
  Option,
  Spinner,
  Tab,
  TabList,
  Title1,
  Title3,
  makeStyles,
  tokens,
  type SelectTabData,
} from '@fluentui/react-components'
import {
  BuildingRegular,
  EyeOffRegular,
  EyeRegular,
  HatGraduationRegular,
  LockClosedRegular,
  LocationRegular,
  PersonRegular,
} from '@fluentui/react-icons'
import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { MOCK_SCHOOLS } from '../../mock-data/mockSchools'
import { getHoSoTruong, saveHoSoTruong } from '../../storage/hoSoTruong'
import { isAuthenticated, login } from '../../storage/session'
import { EducationIllustration } from './EducationIllustration'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const SO_GD_DT = 'Sở GD&ĐT TP. Hồ Chí Minh'

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100%',
    backgroundColor: tokens.colorNeutralBackground3,
    padding: tokens.spacingHorizontalXL,
  },
  panels: {
    display: 'flex',
    width: '960px',
    maxWidth: '100%',
    minHeight: '560px',
    borderRadius: tokens.borderRadiusXLarge,
    overflow: 'hidden',
    boxShadow: tokens.shadow28,
  },
  illustrationPanel: {
    flex: '1 1 45%',
    background: 'linear-gradient(180deg, #fde047 0%, #facc15 20%, #2563eb 65%, #1d4ed8 100%)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: tokens.spacingHorizontalXL,
    position: 'relative',
    ...({ '@media (max-width: 720px)': { display: 'none' } } as Record<string, unknown>),
  },
  headline: {
    color: '#1e3a8a',
    fontWeight: 800,
    fontSize: '28px',
    lineHeight: '132%',
    letterSpacing: '-0.5px',
    textShadow: '0 1px 0 rgba(255,255,255,0.4)',
  },
  illustrationBody: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: tokens.spacingVerticalL,
  },
  formPanel: {
    flex: '1 1 55%',
    backgroundColor: tokens.colorNeutralBackground1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: tokens.spacingHorizontalXXL,
    rowGap: tokens.spacingVerticalM,
  },
  logo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    rowGap: tokens.spacingVerticalXS,
    marginBottom: tokens.spacingVerticalS,
    textAlign: 'center',
  },
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    columnGap: tokens.spacingHorizontalS,
    color: tokens.colorBrandForeground1,
  },
  tabs: {
    display: 'flex',
    justifyContent: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalM,
  },
  linkRow: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  optionsRow: {
    display: 'flex',
    alignItems: 'center',
  },
  comboboxWrapper: {
    position: 'relative',
  },
  comboboxIcon: {
    position: 'absolute',
    left: tokens.spacingHorizontalSNudge,
    top: '50%',
    transform: 'translateY(-50%)',
    color: tokens.colorNeutralForeground3,
    pointerEvents: 'none',
    zIndex: 1,
    display: 'flex',
  },
})

type LoginTab = 'sso' | 'account'

export function LoginPage() {
  const styles = useStyles()
  const navigate = useNavigate()
  const [tab, setTab] = useState<LoginTab>('account')
  const [loading, setLoading] = useState(false)

  // Tab "Đăng nhập bằng tài khoản"
  const [maTruongInput, setMaTruongInput] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberPassword, setRememberPassword] = useState(false)
  const [maTruongError, setMaTruongError] = useState<string | undefined>()
  const [emailError, setEmailError] = useState<string | undefined>()
  const [passwordError, setPasswordError] = useState<string | undefined>()

  // Tab "Đăng nhập SSO"
  const [ssoMaTruong, setSsoMaTruong] = useState('')
  const [ssoError, setSsoError] = useState<string | undefined>()

  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />
  }

  function completeLogin(maTruong: string, tenTruong: string, taiKhoan: string) {
    setLoading(true)
    setTimeout(() => {
      login(maTruong, tenTruong, taiKhoan)
      if (!getHoSoTruong()) {
        const school = MOCK_SCHOOLS.find((s) => s.maTruong === maTruong)
        if (school) saveHoSoTruong(school)
      }
      navigate('/dashboard', { replace: true })
    }, 500)
  }

  function handleAccountSubmit(event: FormEvent) {
    event.preventDefault()

    const school = MOCK_SCHOOLS.find((s) => s.maTruong.toLowerCase() === maTruongInput.trim().toLowerCase())
    const nextMaTruongError = !maTruongInput.trim()
      ? 'Vui lòng nhập mã trường'
      : !school
        ? 'Mã trường không tồn tại trong hệ thống demo'
        : undefined
    const nextEmailError = !email ? 'Vui lòng nhập email' : !EMAIL_REGEX.test(email) ? 'Email không hợp lệ' : undefined
    const nextPasswordError = !password ? 'Vui lòng nhập mật khẩu' : undefined

    setMaTruongError(nextMaTruongError)
    setEmailError(nextEmailError)
    setPasswordError(nextPasswordError)
    if (nextMaTruongError || nextEmailError || nextPasswordError || !school) return

    completeLogin(school.maTruong, school.tenTruong, email)
  }

  function handleSsoSubmit(event: FormEvent) {
    event.preventDefault()

    const school = MOCK_SCHOOLS.find((s) => s.maTruong === ssoMaTruong)
    if (!school) {
      setSsoError('Vui lòng chọn trường')
      return
    }
    setSsoError(undefined)
    completeLogin(school.maTruong, school.tenTruong, 'Đăng nhập SSO')
  }

  return (
    <div className={styles.root}>
      <div className={styles.panels}>
        <div className={styles.illustrationPanel}>
          <div className={styles.headline}>GIẢI PHÁP CHUYỂN ĐỔI SỐ TRƯỜNG HỌC</div>
          <div className={styles.illustrationBody}>
            <EducationIllustration />
          </div>
          <div />
        </div>

        <div className={styles.formPanel}>
          <div className={styles.logo}>
            <div className={styles.logoRow}>
              <HatGraduationRegular fontSize={28} />
              <Title3>Portal Nhập liệu</Title3>
            </div>
            <Title1 as="h1" style={{ fontSize: '22px' }}>
              Đăng nhập vào trường
            </Title1>
          </div>

          <div className={styles.tabs}>
            <TabList
              selectedValue={tab}
              onTabSelect={(_, data: SelectTabData) => setTab(data.value as LoginTab)}
            >
              <Tab value="sso">Đăng nhập SSO</Tab>
              <Tab value="account">Đăng nhập bằng tài khoản</Tab>
            </TabList>
          </div>

          {tab === 'account' ? (
            <form className={styles.form} onSubmit={handleAccountSubmit} noValidate>
              <Field
                label="Mã trường"
                validationState={maTruongError ? 'error' : 'none'}
                validationMessage={maTruongError}
              >
                <Input
                  value={maTruongInput}
                  onChange={(_, data) => setMaTruongInput(data.value)}
                  contentBefore={<BuildingRegular />}
                  placeholder="VD: THCS001"
                />
              </Field>
              <div className={styles.linkRow}>
                <Link>Đăng nhập bằng số điện thoại</Link>
              </div>

              <Field label="Email" validationState={emailError ? 'error' : 'none'} validationMessage={emailError}>
                <Input
                  type="email"
                  value={email}
                  onChange={(_, data) => setEmail(data.value)}
                  contentBefore={<PersonRegular />}
                  placeholder="ten@truong.edu.vn"
                />
              </Field>

              <Field
                label="Mật khẩu"
                validationState={passwordError ? 'error' : 'none'}
                validationMessage={passwordError}
              >
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(_, data) => setPassword(data.value)}
                  contentBefore={<LockClosedRegular />}
                  contentAfter={
                    <Button
                      appearance="transparent"
                      size="small"
                      icon={showPassword ? <EyeOffRegular /> : <EyeRegular />}
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    />
                  }
                  placeholder="Nhập mật khẩu"
                />
              </Field>

              <div className={styles.optionsRow}>
                <Checkbox
                  checked={rememberPassword}
                  onChange={(_, data) => setRememberPassword(data.checked === true)}
                  label="Nhớ mật khẩu"
                />
              </div>

              <Button
                type="submit"
                appearance="primary"
                disabled={loading}
                icon={loading ? <Spinner size="tiny" /> : undefined}
              >
                {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </Button>
            </form>
          ) : (
            <form className={styles.form} onSubmit={handleSsoSubmit} noValidate>
              <Field label="Sở GD&ĐT">
                <div className={styles.comboboxWrapper}>
                  <span className={styles.comboboxIcon}>
                    <LocationRegular />
                  </span>
                  <Combobox
                    value={SO_GD_DT}
                    selectedOptions={[SO_GD_DT]}
                    freeform
                    input={{ style: { paddingLeft: '32px' } }}
                  >
                    <Option value={SO_GD_DT} text={SO_GD_DT}>
                      {SO_GD_DT}
                    </Option>
                  </Combobox>
                </div>
              </Field>

              <Field
                label="Chọn trường / Nhập mã trường"
                validationState={ssoError ? 'error' : 'none'}
                validationMessage={ssoError}
              >
                <div className={styles.comboboxWrapper}>
                  <span className={styles.comboboxIcon}>
                    <BuildingRegular />
                  </span>
                  <Combobox
                    placeholder="Chọn trường..."
                    value={MOCK_SCHOOLS.find((s) => s.maTruong === ssoMaTruong)?.tenTruong ?? ''}
                    selectedOptions={ssoMaTruong ? [ssoMaTruong] : []}
                    onOptionSelect={(_, data) => data.optionValue && setSsoMaTruong(data.optionValue)}
                    input={{ style: { paddingLeft: '32px' } }}
                  >
                    {MOCK_SCHOOLS.map((school) => (
                      <Option key={school.maTruong} value={school.maTruong} text={school.tenTruong}>
                        {school.tenTruong} ({school.maTruong})
                      </Option>
                    ))}
                  </Combobox>
                </div>
              </Field>

              <Button
                type="submit"
                appearance="primary"
                disabled={loading}
                icon={loading ? <Spinner size="tiny" /> : undefined}
              >
                {loading ? 'Đang đăng nhập...' : 'Đăng nhập SSO'}
              </Button>
            </form>
          )}

          <Body1 as="p">Đăng nhập giả lập (bản demo).</Body1>
        </div>
      </div>
    </div>
  )
}
