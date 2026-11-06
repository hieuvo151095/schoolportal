import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  authenticateAccount,
  authenticateSso,
  buildSsoPortalUrl,
  filterSchools,
  getSchoolsByDepartment,
  resolvePostLoginPath,
  sanitizeNextPath,
  validateAccountLogin,
  validateSsoCredentials,
  validateSsoSelection,
  GENERIC_CREDENTIAL_ERROR,
} from '../../src/utils/authValidation.ts';
import {
  MOCK_DEPARTMENTS,
  MOCK_SCHOOL_ACCOUNTS,
  MOCK_SSO_ACCOUNTS,
  MOCK_SSO_SCHOOLS,
} from '../../src/services/mockAuthData.ts';

describe('Đăng nhập — bằng tài khoản (mã trường + email + mật khẩu)', () => {
  it('yêu cầu đủ 3 trường và đúng định dạng email', () => {
    const empty = validateAccountLogin({ schoolCode: ' ', email: '', password: '' });
    assert.equal(empty.isValid, false);
    assert.ok(empty.errors.schoolCode && empty.errors.email && empty.errors.password);

    const badEmail = validateAccountLogin({ schoolCode: 'demo', email: 'abc', password: 'x' });
    assert.equal(badEmail.errors.email, 'Email không đúng định dạng.');

    assert.equal(
      validateAccountLogin({ schoolCode: 'demo', email: 'a@b.vn', password: 'x' }).isValid,
      true
    );
  });

  it('đăng nhập đúng: không phân biệt hoa/thường ở mã trường & email, trả session không chứa mật khẩu', () => {
    const r = authenticateAccount(MOCK_SCHOOL_ACCOUNTS, {
      schoolCode: ' DEMO ',
      email: 'Admin@Demo.edu.vn ',
      password: 'Demo@2026',
    });
    assert.equal(r.ok, true);
    if (r.ok) {
      assert.equal(r.session.schoolCode, 'demo');
      assert.equal(r.session.method, 'account');
      assert.equal(JSON.stringify(r.session).includes('Demo@2026'), false);
    }
  });

  it('mật khẩu phân biệt hoa/thường; mọi lý do sai đều trả CÙNG một thông báo (không lộ tài khoản tồn tại)', () => {
    const wrongPw = authenticateAccount(MOCK_SCHOOL_ACCOUNTS, {
      schoolCode: 'demo', email: 'admin@demo.edu.vn', password: 'demo@2026',
    });
    const wrongEmail = authenticateAccount(MOCK_SCHOOL_ACCOUNTS, {
      schoolCode: 'demo', email: 'nobody@demo.edu.vn', password: 'Demo@2026',
    });
    const wrongSchool = authenticateAccount(MOCK_SCHOOL_ACCOUNTS, {
      schoolCode: 'zzz', email: 'admin@demo.edu.vn', password: 'Demo@2026',
    });
    for (const r of [wrongPw, wrongEmail, wrongSchool]) {
      assert.equal(r.ok, false);
      if (!r.ok) assert.equal(r.error, GENERIC_CREDENTIAL_ERROR);
    }
  });
});

describe('Đăng nhập — SSO (Sở → Trường → cổng SSO)', () => {
  it('danh sách trường chỉ gồm trường thuộc Sở đã chọn', () => {
    const hcm = getSchoolsByDepartment(MOCK_SSO_SCHOOLS, 'hcm');
    assert.ok(hcm.length > 0);
    assert.ok(hcm.every((s) => s.departmentId === 'hcm'));
    assert.ok(!hcm.some((s) => s.departmentId === 'hn'));
  });

  it('tìm trường theo tên (không dấu) hoặc mã trường', () => {
    const hcm = getSchoolsByDepartment(MOCK_SSO_SCHOOLS, 'hcm');
    assert.deepEqual(filterSchools(hcm, 'hoa hong').map((s) => s.code), ['74718333']);
    assert.deepEqual(filterSchools(hcm, '74718341').map((s) => s.name), ['Trường MN Chánh Mỹ']);
    assert.equal(filterSchools(hcm, '').length, hcm.length);
    assert.equal(filterSchools(hcm, 'khong-ton-tai').length, 0);
  });

  it('bắt buộc chọn Sở và trường trước khi sang cổng SSO', () => {
    const v = validateSsoSelection('', '');
    assert.ok(v.errors.department && v.errors.school);
    assert.equal(validateSsoSelection('hcm', '74718333').isValid, true);
  });

  it('URL cổng SSO chỉ tạo khi trường thuộc đúng Sở', () => {
    assert.equal(
      buildSsoPortalUrl(MOCK_DEPARTMENTS, MOCK_SSO_SCHOOLS, 'hcm', '74718333'),
      '/sso/login?so=hcm&school=74718333'
    );
    assert.equal(buildSsoPortalUrl(MOCK_DEPARTMENTS, MOCK_SSO_SCHOOLS, 'hn', '74718333'), null);
    assert.equal(buildSsoPortalUrl(MOCK_DEPARTMENTS, MOCK_SSO_SCHOOLS, 'xx', '74718333'), null);
  });

  it('tên tài khoản SSO phải là số CCCD 12 chữ số', () => {
    assert.ok(validateSsoCredentials({ username: '123', password: 'x' }).errors.username);
    assert.ok(validateSsoCredentials({ username: '079201001234', password: '' }).errors.password);
    assert.equal(validateSsoCredentials({ username: '079201001234', password: 'x' }).isValid, true);
  });

  it('xác thực SSO đúng trường mới thành công; tài khoản trường khác bị từ chối', () => {
    const ok = authenticateSso(MOCK_SSO_ACCOUNTS, MOCK_SSO_SCHOOLS, '74718702', {
      username: '079201001234', password: 'Sso@2026',
    });
    assert.equal(ok.ok, true);
    if (ok.ok) assert.equal(ok.session.method, 'sso');

    const crossSchool = authenticateSso(MOCK_SSO_ACCOUNTS, MOCK_SSO_SCHOOLS, '74718333', {
      username: '079201001234', password: 'Sso@2026',
    });
    assert.equal(crossSchool.ok, false);
  });
});

describe('Đăng nhập — điều hướng sau đăng nhập (chống open-redirect)', () => {
  it('chỉ chấp nhận đường dẫn nội bộ', () => {
    assert.equal(sanitizeNextPath('/demo/school/fee'), '/demo/school/fee');
    for (const bad of ['//evil.com', 'https://evil.com', '/\\evil.com', 'javascript:alert(1)', '', undefined, 42, '/signin', '/sso/login']) {
      assert.equal(sanitizeNextPath(bad), null, String(bad));
    }
  });

  it('mặc định vào Điểm danh của trường vừa đăng nhập', () => {
    assert.equal(resolvePostLoginPath('demo'), '/demo/class/lop-1a1/attendance');
    assert.equal(resolvePostLoginPath('demo', '/demo/school/fee'), '/demo/school/fee');
    assert.equal(resolvePostLoginPath('demo', '//evil.com'), '/demo/class/lop-1a1/attendance');
  });
});

describe('Đăng nhập — ràng buộc kiến trúc', () => {
  const read = (p) => fs.readFileSync(path.resolve(p), 'utf8');

  it('trang signin dùng DS (TextField, ComboboxField, SegmentedControl), không tự dựng input thô', () => {
    const src = read('src/pages/signin.tsx');
    for (const c of ['TextField', 'ComboboxField', 'SegmentedControl']) assert.ok(src.includes(c), c);
    assert.equal(/<input\b/.test(src), false);
  });

  it('không lưu mật khẩu vào storage', () => {
    const src = read('src/utils/authSession.ts');
    assert.equal(/password/i.test(src.replace(/\/\*[\s\S]*?\*\//g, '')), false);
  });

  it('DS có tài liệu cho component mới', () => {
    assert.ok(fs.existsSync(path.resolve('Portal DS/components/TextField/README.md')));
    assert.ok(fs.existsSync(path.resolve('Portal DS/components/ComboboxField/README.md')));
  });
});

describe('Đăng nhập — Phân vùng session đa tab (OQ-13 & DN-01)', () => {
  it('sinh key phân vùng chính xác theo mã trường (case-insensitive)', async () => {
    const { getSessionKey, getTokenKey, RESET_TENANT_STATE } = await import('../../src/utils/authSession.ts');
    assert.equal(getSessionKey('TH-ECO01'), 'eco_session_th-eco01');
    assert.equal(getSessionKey('demo'), 'eco_session_demo');
    assert.equal(getSessionKey(''), 'eco_auth_session');
    assert.equal(getTokenKey('TH-ECO01'), 'eco_token_th-eco01');
    assert.equal(getTokenKey('demo'), 'eco_token_demo');
    assert.equal(getTokenKey(''), 'eco_token');
    assert.equal(RESET_TENANT_STATE, 'RESET_TENANT_STATE');
  });

  it('cô lập dữ liệu phiên đa tab cho 2 trường đồng thời, không bị ghi đè', async () => {
    const { saveSession, loadSession, clearSession, getAuthToken } = await import('../../src/utils/authSession.ts');

    const storageMap = new Map();
    const fakeStore = {
      getItem: (k) => storageMap.get(k) || null,
      setItem: (k, v) => storageMap.set(k, String(v)),
      removeItem: (k) => storageMap.delete(k),
      clear: () => storageMap.clear(),
    };

    global.window = {
      sessionStorage: fakeStore,
      localStorage: fakeStore,
    };

    try {
      const sessionA = {
        method: 'account',
        schoolCode: 'TH-ECO01',
        schoolName: 'Trường Tiểu học ECO 01',
        displayName: 'Cô Nguyễn Thị Hoa',
        role: 'teacher',
        issuedAt: new Date().toISOString(),
      };

      const sessionB = {
        method: 'account',
        schoolCode: 'TH-ECO02',
        schoolName: 'Trường THCS ECO 02',
        displayName: 'Cô Trần Thị Mai',
        role: 'teacher',
        issuedAt: new Date().toISOString(),
      };

      // Lưu đồng thời 2 trường ở 2 tab
      saveSession(sessionA, false);
      saveSession(sessionB, false);

      // Từng trường đọc đúng session và token độc lập của mình
      const loadedA = loadSession('TH-ECO01');
      const loadedB = loadSession('TH-ECO02');
      assert.equal(loadedA?.displayName, 'Cô Nguyễn Thị Hoa');
      assert.equal(loadedB?.displayName, 'Cô Trần Thị Mai');

      const tokenA = getAuthToken('TH-ECO01');
      const tokenB = getAuthToken('TH-ECO02');
      assert.ok(tokenA && tokenA.includes('th-eco01'));
      assert.ok(tokenB && tokenB.includes('th-eco02'));
      assert.notEqual(tokenA, tokenB);

      // Xóa session trường A, trường B vẫn tồn tại nguyên vẹn
      clearSession('TH-ECO01');
      assert.equal(loadSession('TH-ECO01'), null);
      assert.equal(loadSession('TH-ECO02')?.displayName, 'Cô Trần Thị Mai');
    } finally {
      delete global.window;
    }
  });
});
