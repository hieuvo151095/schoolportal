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
