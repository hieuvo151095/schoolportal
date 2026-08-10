import * as XLSX from 'xlsx'

export interface ParsedRow {
  /** Số dòng theo Excel TRONG SHEET chứa nó — dòng 1 là header, dữ liệu bắt đầu từ dòng 2. */
  excelRowNumber: number
  /** Tên sheet chứa dòng này — dùng để ghép id duy nhất khi file có nhiều sheet (Hoá đơn, xem
   * sheetKeyField), vì excelRowNumber chỉ duy nhất TRONG PHẠM VI 1 sheet. */
  sheetName: string
  data: Record<string, unknown>
}

export interface ParsedFile {
  headers: string[]
  rows: ParsedRow[]
}

/** Đọc file .xlsx hoặc .csv phía client — SheetJS tự nhận diện định dạng qua nội dung buffer.
 * Không truyền `sheetKeyField`: chỉ đọc sheet đầu tiên (hành vi thông thường). Có truyền: đọc
 * TẤT CẢ sheet trong file, tên mỗi sheet được gắn làm giá trị `sheetKeyField.columnLabel` cho mọi
 * dòng của sheet đó (như thể đó là 1 cột thật trong file) — dùng cho template nhiều sheet theo
 * Mã phí của Hoá đơn. */
export async function parseUploadFile(
  file: File,
  sheetKeyField?: { columnLabel: string },
): Promise<ParsedFile> {
  const buffer = await file.arrayBuffer()
  const workbook = XLSX.read(buffer, { type: 'array' })
  const sheetNames = sheetKeyField ? workbook.SheetNames : workbook.SheetNames.slice(0, 1)

  let headers: string[] = []
  const rows: ParsedRow[] = []

  sheetNames.forEach((sheetName, sheetIndex) => {
    const sheet = workbook.Sheets[sheetName]

    const headerRow = XLSX.utils.sheet_to_json<string[]>(sheet, { header: 1, raw: false })[0] ?? []
    if (sheetIndex === 0) {
      const sheetHeaders = headerRow.map((h) => String(h ?? '').trim())
      headers = sheetKeyField ? [...sheetHeaders, sheetKeyField.columnLabel] : sheetHeaders
    }

    const records = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
      raw: false,
      dateNF: 'yyyy-mm-dd',
      defval: '',
    })

    records.forEach((record, index) => {
      const data = sheetKeyField ? { ...record, [sheetKeyField.columnLabel]: sheetName.trim() } : record
      rows.push({ excelRowNumber: index + 2, sheetName, data })
    })
  })

  return { headers, rows }
}
