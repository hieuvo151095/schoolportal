import * as XLSX from 'xlsx'
import type { UploadEntityConfig, UploadFieldConfig } from './types'

function camelToKebab(value: string): string {
  return value.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

/** Gắn comment (chú thích) vào ô header của các cột enum, liệt kê rõ giá trị hợp lệ — người điền
 * file thấy ngay không cần đoán hoặc tra lại tài liệu (vd Hình thức/Trạng thái thanh toán). */
function addEnumValueComments<TRow extends object>(worksheet: XLSX.WorkSheet, templateFields: UploadFieldConfig<TRow>[]): void {
  templateFields.forEach((field, colIndex) => {
    if (!field.enumValues || field.enumValues.length === 0) return
    const cell = worksheet[XLSX.utils.encode_cell({ r: 0, c: colIndex })]
    if (!cell) return
    XLSX.utils.cell_add_comment(cell, `Giá trị hợp lệ: ${field.enumValues.join(', ')}`, 'SchoolPortal')
  })
}

/** Xuất file .xlsx mẫu đúng cột yêu cầu, kèm 2-3 dòng ví dụ, tải về ngay ở trình duyệt.
 * Không có `config.sheetKeyField`: 1 sheet duy nhất, tên = entityLabel.
 * Có `config.sheetKeyField`: nhiều sheet, tên mỗi sheet = 1 giá trị trong `sheetNames` (Hoá đơn —
 * mỗi sheet 1 Mã phí, lấy ĐỘNG từ Danh mục thu hiện có, xem UploadActionsRow) — cột
 * sheetKeyField.key bị loại khỏi bảng vì đã được thể hiện qua tên sheet, không cần điền tay. */
export function downloadUploadTemplate<TRow extends object>(
  config: UploadEntityConfig<TRow>,
  sheetNames?: string[],
): void {
  const templateFields = config.sheetKeyField
    ? config.fields.filter((f) => f.key !== config.sheetKeyField!.key)
    : config.fields

  const exampleRowCount = Math.max(...templateFields.map((f) => f.exampleValues.length))
  const exampleRows: Record<string, string>[] = []
  for (let i = 0; i < exampleRowCount; i++) {
    const row: Record<string, string> = {}
    for (const field of templateFields) {
      row[field.columnLabel] = field.exampleValues[i] ?? ''
    }
    exampleRows.push(row)
  }

  const workbook = XLSX.utils.book_new()
  const names = config.sheetKeyField ? (sheetNames ?? []) : [config.entityLabel]
  const usedSheetNames = new Set<string>()

  for (const name of names) {
    const worksheet = XLSX.utils.json_to_sheet(exampleRows, { header: templateFields.map((f) => f.columnLabel) })
    addEnumValueComments(worksheet, templateFields)
    // Excel giới hạn 31 ký tự/tên sheet + không cho trùng tên — cắt bớt và thêm hậu tố nếu đụng.
    let sheetName = name.slice(0, 31)
    let suffix = 2
    while (usedSheetNames.has(sheetName)) {
      sheetName = `${name.slice(0, 28)}-${suffix}`
      suffix += 1
    }
    usedSheetNames.add(sheetName)
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
  }

  XLSX.writeFile(workbook, `template_${camelToKebab(config.entityKey)}.xlsx`)
}
