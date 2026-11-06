# TextField Component

Ô nhập liệu một dòng chuẩn `[DS] ECO ME DASHBOARD v1.1.0` (email, mã trường, mật khẩu…). `SearchField` chỉ dùng cho tìm kiếm; mọi ô nhập liệu khác dùng `TextField`.

## Tính năng
- Nhãn gắn `<label htmlFor>`, icon đầu ô tuỳ chọn (không icon emoji).
- `type="password"` tự có nút hiện/ẩn (`aria-pressed`, icon `eye-slash` / `eye`).
- `error`: viền + nền đỏ nhạt (`--semantic-danger*`), thông báo `role="alert"`, `aria-invalid`, `aria-describedby`.
- `size="lg"` cho màn hình đăng nhập; focus ring 2px `--eco-blue-strong`.

## Sử dụng
```tsx
<TextField label="Email" icon="envelope" type="email" value={email} onChange={setEmail} error={errors.email} />
<TextField label="Mật khẩu" icon="lock" type="password" value={pw} onChange={setPw} autoComplete="current-password" />
```
