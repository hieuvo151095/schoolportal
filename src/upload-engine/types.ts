import type { LoaiDuLieuDongBo } from '../types/domain'

export type FieldType = 'string' | 'number' | 'enum' | 'date' | 'nullable-enum'

export interface UploadFieldConfig<TRow> {
  key: keyof TRow & string
  columnLabel: string
  type: FieldType
  required: boolean
  enumValues?: readonly string[]
  /** Giá trị số tối thiểu cho phép (dùng cho type 'number'). */
  min?: number
  /** 2-3 giá trị mẫu điền vào các dòng ví dụ trong file template. */
  exampleValues: [string, string, string?]
  /** Chạy sau validator chung (required/type/enum/min). Nhận giá trị đã coerce của field này,
   * dòng hiện tại (đã coerce toàn bộ field, chưa gắn context), và toàn bộ các dòng trong file
   * (dùng để kiểm tra trùng lặp hoặc đối chiếu khoá ngoại với dữ liệu đã lưu). */
  customValidator?: (value: unknown, row: Record<string, unknown>, allRows: Record<string, unknown>[]) => string | null
  /** Đánh dấu field này là khoá ngoại đối chiếu với 1 module đã đồng bộ trước (Danh mục Phí,
   * Học sinh...) — khi customValidator báo lỗi ở field có crossRef, RowError tương ứng được gắn
   * kèm metadata này để pop-up review gom nhóm và hiện banner điều hướng riêng, nổi bật hơn bảng
   * lỗi thông thường. */
  crossRef?: { entityLabel: string; route: string }
}

export interface RowError {
  /** Số dòng hiển thị cho người dùng — tính theo Excel (dòng 1 = header, dữ liệu bắt đầu dòng 2). */
  rowIndex: number
  columnLabel: string
  message: string
  crossRef?: { entityLabel: string; route: string; value: string }
}

export interface UploadEntityConfig<TRow extends object> {
  entityKey: LoaiDuLieuDongBo
  entityLabel: string
  fields: UploadFieldConfig<TRow>[]
  /** Field (hoặc tổ hợp nhiều field) dùng làm khoá kiểm tra trùng lặp trong phạm vi 1 file đang
   * upload — vd Hoá đơn dùng tổ hợp [soHoaDon, maPhi] vì nhiều dòng được phép chia sẻ chung
   * soHoaDon (1 hoá đơn nhiều khoản phí), chỉ cấm trùng đúng 1 khoản phí trong cùng 1 hoá đơn. */
  uniqueKey?: (keyof TRow & string) | (keyof TRow & string)[]
  /** Đối chiếu các field liệt kê phải giống hệt nhau giữa mọi dòng chia sẻ chung giá trị
   * groupKey (vd mọi dòng cùng soHoaDon phải khớp Trạng thái, Hạn thanh toán...) — dùng khi 1
   * bản ghi logic (hoá đơn) được trải trên nhiều dòng file do quan hệ 1-nhiều với field khác
   * (khoản phí). Bỏ qua nếu không khai báo. */
  groupConsistencyCheck?: { groupKey: keyof TRow & string; fields: (keyof TRow & string)[] }
  /** Context bắt buộc chọn trước khi upload (Niên khoá hoặc Kỳ) — engine tự gắn giá trị này
   * vào mỗi dòng đã parse, không cần cột riêng trong template. */
  contextField: { key: string; label: string }
  /** Ráp 1 dòng đã coerce (keyed theo field.key) + giá trị context thành TRow hoàn chỉnh. */
  buildRow: (coercedRow: Record<string, unknown>, contextValue: string) => TRow
  /** Ghi đè toàn bộ dữ liệu của context hiện tại vào localStorage — do từng trang cụ thể cung cấp
   * (gọi đúng module storage/<entity>.ts tương ứng). */
  persist: (rows: TRow[], contextValue: string) => void
  /** Số dòng "thành công" hiện trong Lịch sử đồng bộ — mặc định = rows.length (1 dòng file = 1
   * bản ghi). Hoá đơn ghi đè để đếm số Mã HĐ duy nhất, vì 1 dòng file giờ là 1 khoản phí, không
   * còn là 1 hoá đơn. */
  countSuccessRows?: (rows: TRow[]) => number
  /** Biến đổi 1 dòng trước khi đưa vào mảng `data` của JSON export (vd map enum UI -> enum thật
   * của dashportal). Mặc định giữ nguyên dòng. */
  transformForExport?: (row: TRow) => Record<string, unknown>
  /** Ghi chú thêm vào `metadata` của JSON export (vd giải thích 1 mapping enum đã áp dụng). */
  exportMetadataNote?: string
}
