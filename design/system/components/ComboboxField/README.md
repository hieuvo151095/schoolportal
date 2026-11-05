# ComboboxField Component

Ô chọn có tìm kiếm (combobox) chuẩn `[DS] ECO ME DASHBOARD v1.1.0`. Dùng thay `SelectField` khi danh sách dài (Sở GD&ĐT, danh sách trường).

## Tính năng
- Gõ để lọc, không phân biệt hoa/thường và dấu tiếng Việt (`"hong"` khớp `"Hoa Hồng"`).
- Bàn phím: `↓` `↑` chọn, `Enter` xác nhận, `Esc` đóng; click ra ngoài tự đóng.
- ARIA: `role="combobox"` + `listbox` / `option`, `aria-expanded`, `aria-selected`.
- `searchable={false}` cho danh sách ngắn; `emptyText` khi không có kết quả; `error` như `TextField`.

## Sử dụng
```tsx
<ComboboxField
  icon="school"
  placeholder="Chọn trường / Nhập mã trường"
  options={schools.map((s) => ({ value: s.code, label: `${s.name} (${s.code})` }))}
  value={schoolCode}
  onChange={setSchoolCode}
/>
```
