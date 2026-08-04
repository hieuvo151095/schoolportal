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
}

export interface RowError {
  /** Số dòng hiển thị cho người dùng — tính theo Excel (dòng 1 = header, dữ liệu bắt đầu dòng 2). */
  rowIndex: number
  columnLabel: string
  message: string
}

export interface UploadEntityConfig<TRow extends object> {
  entityKey: LoaiDuLieuDongBo
  entityLabel: string
  fields: UploadFieldConfig<TRow>[]
  /** Field dùng làm khoá kiểm tra trùng lặp trong phạm vi 1 file đang upload. */
  uniqueKey?: keyof TRow & string
  /** Context bắt buộc chọn trước khi upload (Niên khoá hoặc Kỳ) — engine tự gắn giá trị này
   * vào mỗi dòng đã parse, không cần cột riêng trong template. */
  contextField: { key: string; label: string }
  /** Ráp 1 dòng đã coerce (keyed theo field.key) + giá trị context thành TRow hoàn chỉnh. */
  buildRow: (coercedRow: Record<string, unknown>, contextValue: string) => TRow
  /** Ghi đè toàn bộ dữ liệu của context hiện tại vào localStorage — do từng trang cụ thể cung cấp
   * (gọi đúng module storage/<entity>.ts tương ứng). */
  persist: (rows: TRow[], contextValue: string) => void
  /** Biến đổi 1 dòng trước khi đưa vào mảng `data` của JSON export (vd map enum UI -> enum thật
   * của dashportal). Mặc định giữ nguyên dòng. */
  transformForExport?: (row: TRow) => Record<string, unknown>
  /** Ghi chú thêm vào `metadata` của JSON export (vd giải thích 1 mapping enum đã áp dụng). */
  exportMetadataNote?: string
}
