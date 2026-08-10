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
  /** Đánh dấu field này là khoá ngoại đối chiếu với dữ liệu đã lưu ở 1 module khác (Danh mục
   * Phí, Học sinh...) — khi customValidator báo lỗi ở field có crossRef, RowError tương ứng
   * được gắn kèm metadata này để pop-up review gom nhóm và hiện banner điều hướng riêng, nổi
   * bật hơn bảng lỗi thông thường. */
  crossRef?: { entityLabel: string; route: string }
  /** Chỉ dùng ở form "Thêm mới" (AddRecordDialog) — field type='string' có khai báo này sẽ render
   * Combobox chọn từ danh sách gợi ý thay vì Input gõ tay tự do (vd Mã HS/Mã phí ở Hoá đơn, chọn
   * từ dữ liệu Học sinh/Danh mục Phí đã có, tránh gõ sai gây lỗi crossRef không đáng có). Không
   * ảnh hưởng luồng upload file — file Excel vẫn chấp nhận bất kỳ giá trị nào rồi để customValidator
   * bắt lỗi như cũ. */
  comboboxOptions?: () => string[]
}

export interface RowError {
  /** Số dòng hiển thị cho người dùng — tính theo Excel (dòng 1 = header, dữ liệu bắt đầu dòng 2). */
  rowIndex: number
  columnLabel: string
  message: string
  crossRef?: { entityLabel: string; route: string; value: string }
}

export interface UploadEntityConfig<TRow extends object> {
  entityKey: string
  entityLabel: string
  fields: UploadFieldConfig<TRow>[]
  /** Khi khai báo: field này KHÔNG đọc từ 1 cột trong file — mỗi SHEET trong file coi là 1 giá
   * trị của field này (tên sheet = giá trị), áp dụng cho MỌI dòng trong sheet đó. Dùng cho Hoá
   * đơn — mỗi sheet = 1 Mã phí, người dùng khỏi phải gõ tay Mã phí từng dòng. Chỉ ảnh hưởng luồng
   * upload file (parseFile/buildTemplate) — không ảnh hưởng AddRecordDialog (form nhập tay 1
   * dòng vẫn hiện field này như field string/enum bình thường qua comboboxOptions). */
  sheetKeyField?: { key: keyof TRow & string; columnLabel: string }
  /** Field (hoặc tổ hợp nhiều field) dùng làm khoá kiểm tra trùng lặp trong phạm vi 1 file đang
   * upload — vd Hoá đơn dùng tổ hợp [soHoaDon, maPhi] vì nhiều dòng được phép chia sẻ chung
   * soHoaDon (1 hoá đơn nhiều khoản phí), chỉ cấm trùng đúng 1 khoản phí trong cùng 1 hoá đơn. */
  uniqueKey?: (keyof TRow & string) | (keyof TRow & string)[]
  /** Đối chiếu field này với dữ liệu ĐÃ LƯU TRƯỚC ĐÓ (khác uniqueKey — đó chỉ kiểm tra trùng
   * trong phạm vi file đang upload; không phân biệt daDongBo true/false, tồn tại là đủ) — trùng
   * thì báo lỗi, chặn lưu, KHÔNG tự động ghi đè/gộp. Người dùng phải xoá dòng đó khỏi file nếu
   * muốn lưu tiếp các dòng còn lại. Hoá đơn dùng đúng soHoaDon (không phải tổ hợp
   * soHoaDon+maPhi) vì 1 hoá đơn là 1 thực thể duy nhất — không cho phép "thêm khoản phí" vào
   * hoá đơn đã lưu bằng cách upload lại. */
  existingDataCheck?: {
    key: keyof TRow & string
    /** Nguồn dữ liệu đã lưu trước đó để đối chiếu — KHÔNG bắt buộc cùng shape với TRow (vd
     * Hoá đơn đối chiếu soHoaDon với bảng header HoaDonRow, khác TRow là dòng khoản phí phẳng
     * HoaDonUploadLineRow có thêm maPhi/soTien) — chỉ cần field `key` đọc được ở mỗi dòng trả về. */
    getExistingRows: (contextValue: string) => Partial<Record<keyof TRow & string, unknown>>[]
  }
  /** Đối chiếu các field liệt kê phải giống hệt nhau giữa mọi dòng chia sẻ chung giá trị
   * groupKey (vd mọi dòng cùng soHoaDon phải khớp Trạng thái, Hạn thanh toán...) — dùng khi 1
   * bản ghi logic (hoá đơn) được trải trên nhiều dòng file do quan hệ 1-nhiều với field khác
   * (khoản phí). Bỏ qua nếu không khai báo. */
  groupConsistencyCheck?: { groupKey: keyof TRow & string; fields: (keyof TRow & string)[] }
  /** Context bắt buộc chọn trước khi upload (Niên khoá hoặc Kỳ) — engine tự gắn giá trị này
   * vào mỗi dòng đã parse, không cần cột riêng trong template. */
  contextField: { key: string; label: string }
  /** Ráp 1 dòng đã coerce (keyed theo field.key) + giá trị context thành TRow hoàn chỉnh —
   * daDongBo luôn gán false ở đây (mới lưu, chưa qua module "Đồng bộ"). */
  buildRow: (coercedRow: Record<string, unknown>, contextValue: string) => TRow
  /** Nối thêm dữ liệu mới vào dữ liệu đã có của context hiện tại trong localStorage (không ghi
   * đè — existingDataCheck đã chặn trùng khoá với dữ liệu cũ từ trước khi persist chạy tới đây)
   * — do từng trang cụ thể cung cấp (gọi đúng module storage/<entity>.ts tương ứng). */
  persist: (rows: TRow[], contextValue: string) => void
  /** Số dòng "thành công" hiện trong banner xác nhận sau khi lưu — mặc định = rows.length (1
   * dòng file = 1 bản ghi). Hoá đơn ghi đè để đếm số Mã HĐ duy nhất, vì 1 dòng file giờ là 1
   * khoản phí, không còn là 1 hoá đơn. */
  countSuccessRows?: (rows: TRow[]) => number
}
