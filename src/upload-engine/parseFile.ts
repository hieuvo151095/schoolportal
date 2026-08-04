import * as XLSX from 'xlsx'

export interface ParsedRow {
  /** Số dòng theo Excel — dòng 1 là header, dữ liệu bắt đầu từ dòng 2. */
  excelRowNumber: number
  data: Record<string, unknown>
}

export interface ParsedFile {
  headers: string[]
  rows: ParsedRow[]
}

/** Đọc file .xlsx hoặc .csv phía client — SheetJS tự nhận diện định dạng qua nội dung buffer. */
export async function parseUploadFile(file: File): Promise<ParsedFile> {
  const buffer = await file.arrayBuffer()
  const workbook = XLSX.read(buffer, { type: 'array' })
  const sheetName = workbook.SheetNames[0]
  const sheet = workbook.Sheets[sheetName]

  const headerRow = XLSX.utils.sheet_to_json<string[]>(sheet, { header: 1, raw: false })[0] ?? []
  const headers = headerRow.map((h) => String(h ?? '').trim())

  const records = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
    raw: false,
    dateNF: 'yyyy-mm-dd',
    defval: '',
  })

  const rows: ParsedRow[] = records.map((record, index) => ({
    excelRowNumber: index + 2,
    data: record,
  }))

  return { headers, rows }
}
