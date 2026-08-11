/** Tăng số này +1 MỖI KHI thay đổi cấu trúc dữ liệu lưu trong localStorage — đổi shape 1 object,
 * thêm/bớt field bắt buộc, tách/gộp key, đổi ý nghĩa 1 field... BẤT KỂ ai sửa, bất kể có nhớ đọc
 * comment này hay không thì cũng phải tăng. Đây là app demo/prototype — không có migrate dữ liệu
 * cũ, version lệch thì xoá sạch và để ensureSeeded* tự sinh lại từ đầu (xem ensureSchemaVersion). */
export const DATA_SCHEMA_VERSION = 4

const SCHEMA_VERSION_KEY = 'schoolportal:schema-version'
const STORAGE_PREFIX = 'schoolportal:'

/** Gọi 1 lần khi app khởi động, trước khi bất kỳ code nào khác đọc localStorage. Nếu version đã
 * lưu (hoặc không có — kể cả dữ liệu cũ từ trước khi tồn tại cơ chế này) khác
 * DATA_SCHEMA_VERSION hiện tại, xoá sạch toàn bộ key "schoolportal:*" (kể cả session — buộc đăng
 * nhập lại, tránh trạng thái nửa cũ nửa mới) rồi ghi lại version mới. Khớp version thì không làm
 * gì, giữ nguyên dữ liệu hiện có. */
export function ensureSchemaVersion(): void {
  const stored = localStorage.getItem(SCHEMA_VERSION_KEY)
  if (stored !== null && Number(stored) === DATA_SCHEMA_VERSION) return

  for (const key of Object.keys(localStorage)) {
    if (key.startsWith(STORAGE_PREFIX)) localStorage.removeItem(key)
  }
  localStorage.setItem(SCHEMA_VERSION_KEY, String(DATA_SCHEMA_VERSION))
}
