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
