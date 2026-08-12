import ExcelJS from 'exceljs'
import type { UploadEntityConfig, UploadFieldConfig } from './types'

function camelToKebab(value: string): string {
  return value.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

/** Excel giới hạn 31 ký tự/tên sheet + không cho trùng tên — cắt bớt và thêm hậu tố nếu đụng. */
function uniqueSheetName(name: string, used: Set<string>): string {
  let sheetName = name.slice(0, 31)
  let suffix = 2
  while (used.has(sheetName)) {
    sheetName = `${name.slice(0, 28)}-${suffix}`
    suffix += 1
  }
  used.add(sheetName)
  return sheetName
}

/** Gắn comment (chú thích) vào ô header của các cột enum, liệt kê rõ giá trị hợp lệ — người điền
 * file thấy ngay không cần đoán hoặc tra lại tài liệu (vd Hình thức/Trạng thái thanh toán). */
function addEnumValueComments<TRow extends object>(sheet: ExcelJS.Worksheet, templateFields: UploadFieldConfig<TRow>[]): void {
  templateFields.forEach((field, colIndex) => {
    if (!field.enumValues || field.enumValues.length === 0) return
    sheet.getCell(1, colIndex + 1).note = `Giá trị hợp lệ: ${field.enumValues.join(', ')}`
  })
}

export interface DanhMucThuOption {
  maPhi: string
  tenPhi: string
}

/** Thêm sheet "Danh mục thu" (Mã khoản thu, Tên khoản thu — đúng danh sách ĐANG hoạt động đã lọc
 * sẵn ở nơi gọi, xem UploadFileDialog) + gắn Data Validation kiểu list vào cột có khai báo crossRef
 * 'Danh mục thu' trên sheet chính, tham chiếu sang range vừa tạo — thành dropdown thật trong Excel.
 * exceljs hỗ trợ ghi Data Validation vào file .xlsx (thư viện xlsx/SheetJS bản free trước đây KHÔNG
 * hỗ trợ ghi tính năng này, đây là lý do đổi sang exceljs). */
function addDanhMucThuSheetAndValidation<TRow extends object>(
  workbook: ExcelJS.Workbook,
  mainSheet: ExcelJS.Worksheet,
  templateFields: UploadFieldConfig<TRow>[],
  danhMucThu: DanhMucThuOption[],
): void {
  const crossRefColIndex = templateFields.findIndex((f) => f.crossRef?.entityLabel === 'Danh mục thu')
  if (crossRefColIndex === -1 || danhMucThu.length === 0) return

  const refSheet = workbook.addWorksheet('Danh mục thu')
  refSheet.getCell('A1').value = 'Đây là danh sách các mã khoản thu để nhà trường chọn'
  refSheet.mergeCells('A1:B1')
  refSheet.getRow(2).values = ['Mã khoản thu', 'Tên khoản thu']
  danhMucThu.forEach((row, i) => {
    refSheet.getRow(3 + i).values = [row.maPhi, row.tenPhi]
  })
  const lastDataRow = 2 + danhMucThu.length

  const formula = `'Danh mục thu'!$A$3:$A$${lastDataRow}`
  // Áp dụng cho 1 khoảng dòng đủ rộng (không chỉ đúng số dòng ví dụ) để nhà trường thêm dòng mới
  // trong file vẫn có dropdown, không phải kéo công thức lại thủ công.
  const MAX_TEMPLATE_ROWS = 500
  for (let r = 2; r <= MAX_TEMPLATE_ROWS; r++) {
    mainSheet.getCell(r, crossRefColIndex + 1).dataValidation = {
      type: 'list',
      allowBlank: true,
      formulae: [formula],
      showErrorMessage: true,
      errorStyle: 'stop',
      errorTitle: 'Giá trị không hợp lệ',
      error: 'Vui lòng chọn Mã khoản thu có trong sheet "Danh mục thu".',
    }
  }
}

async function downloadWorkbook(workbook: ExcelJS.Workbook, fileName: string): Promise<void> {
  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = fileName
  anchor.click()
  URL.revokeObjectURL(url)
}

/** Xuất file .xlsx mẫu đúng cột yêu cầu, kèm 2-3 dòng ví dụ, tải về ngay ở trình duyệt.
 * Không có `config.sheetKeyField`: 1 sheet duy nhất, tên = entityLabel.
 * Có `config.sheetKeyField`: nhiều sheet, tên mỗi sheet = 1 giá trị trong `sheetNames` — cột
 * sheetKeyField.key bị loại khỏi bảng vì đã được thể hiện qua tên sheet, không cần điền tay.
 * `danhMucThu`: khi field nào của config có `crossRef.entityLabel === 'Danh mục thu'`, thêm 1
 * sheet tham chiếu + dropdown thật cho đúng cột đó (xem UploadFileDialog — danh sách đã lọc theo
 * Năm học chọn ở bước "Tải file lên", chỉ gồm mã Đang hoạt động). */
export async function downloadUploadTemplate<TRow extends object>(
  config: UploadEntityConfig<TRow>,
  options?: { sheetNames?: string[]; danhMucThu?: DanhMucThuOption[] },
): Promise<void> {
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

  const workbook = new ExcelJS.Workbook()
  const names = config.sheetKeyField ? (options?.sheetNames ?? []) : [config.entityLabel]
  const usedSheetNames = new Set<string>()

  let firstSheet: ExcelJS.Worksheet | null = null
  for (const name of names) {
    const sheet = workbook.addWorksheet(uniqueSheetName(name, usedSheetNames))
    sheet.columns = templateFields.map((f) => ({ header: f.columnLabel, key: f.columnLabel }))
    exampleRows.forEach((row) => sheet.addRow(row))
    addEnumValueComments(sheet, templateFields)
    firstSheet ??= sheet
  }

  if (firstSheet && options?.danhMucThu) {
    addDanhMucThuSheetAndValidation(workbook, firstSheet, templateFields, options.danhMucThu)
  }

  await downloadWorkbook(workbook, `template_${camelToKebab(config.entityKey)}.xlsx`)
}
