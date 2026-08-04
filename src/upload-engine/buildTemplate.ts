import * as XLSX from 'xlsx'
import type { UploadEntityConfig } from './types'

function camelToKebab(value: string): string {
  return value.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

/** Xuất file .xlsx mẫu đúng cột yêu cầu, kèm 2-3 dòng ví dụ, tải về ngay ở trình duyệt. */
export function downloadUploadTemplate<TRow extends object>(
  config: UploadEntityConfig<TRow>,
): void {
  const exampleRowCount = Math.max(...config.fields.map((f) => f.exampleValues.length))
  const exampleRows: Record<string, string>[] = []
  for (let i = 0; i < exampleRowCount; i++) {
    const row: Record<string, string> = {}
    for (const field of config.fields) {
      row[field.columnLabel] = field.exampleValues[i] ?? ''
    }
    exampleRows.push(row)
  }

  const worksheet = XLSX.utils.json_to_sheet(exampleRows, {
    header: config.fields.map((f) => f.columnLabel),
  })
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, config.entityLabel.slice(0, 31))

  XLSX.writeFile(workbook, `template_${camelToKebab(config.entityKey)}.xlsx`)
}
