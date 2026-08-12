/** Niên khoá bắt đầu từ tháng 8 hàng năm — trước tháng 8 vẫn thuộc niên khoá bắt đầu năm trước. */
export function getCurrentNienKhoa(): string {
  const today = new Date()
  const year = today.getFullYear()
  const startYear = today.getMonth() + 1 >= 8 ? year : year - 1
  return `${startYear}-${startYear + 1}`
}

/** Niên khoá hiện tại + 2 niên khoá liền trước, mới nhất trước. */
export function getNienKhoaOptions(): string[] {
  const [startYear] = getCurrentNienKhoa().split('-').map(Number)
  return [0, 1, 2].map((offset) => `${startYear - offset}-${startYear - offset + 1}`)
}

/** "Năm học" dùng riêng cho dropdown ở bước "Tải file lên" (module Nhập dữ liệu) — chạy từ 1/6
 * năm N đến 31/5 năm N+1, hiển thị dạng "2025 - 2026" (có khoảng trắng quanh dấu gạch ngang).
 * KHÁC getCurrentNienKhoa() ở trên (mốc tháng 8, không khoảng trắng) — 2 khái niệm được dùng ở
 * 2 nơi độc lập, không gộp chung để tránh đổi hành vi hiện có của Niên khoá/Kỳ Hoá đơn. */
export function getCurrentNamHoc(): string {
  const today = new Date()
  const year = today.getFullYear()
  const startYear = today.getMonth() + 1 >= 6 ? year : year - 1
  return `${startYear} - ${startYear + 1}`
}

/** Năm học hiện tại + 2 năm học liền trước, mới nhất trước — cùng quy ước với getNienKhoaOptions. */
export function getNamHocOptions(): string[] {
  const startYear = Number(getCurrentNamHoc().split(' - ')[0])
  return [0, 1, 2].map((offset) => `${startYear - offset} - ${startYear - offset + 1}`)
}
