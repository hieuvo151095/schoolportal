import type { ParsedFile } from './parseFile'
import type { FieldType, RowError, UploadEntityConfig, UploadFieldConfig } from './types'

export interface ValidationResult {
  missingColumns: string[]
  errors: RowError[]
  /** Dòng đã coerce theo type, keyed theo field.key — CHƯA gắn context (nienKhoa/ky).
   * Chỉ có giá trị đáng tin cậy khi errors và missingColumns đều rỗng. */
  coercedRows: Record<string, unknown>[]
}

function isEmpty(value: unknown): boolean {
  return value === null || value === undefined || String(value).trim() === ''
}

function coerceAndValidateField(
  field: UploadFieldConfig<Record<string, unknown>>,
  rawValue: unknown,
  rowIndex: number,
): { value: unknown; error?: RowError } {
  const empty = isEmpty(rawValue)

  if (empty) {
    if (field.required) {
      return {
        value: null,
        error: { rowIndex, columnLabel: field.columnLabel, message: 'Không được để trống' },
      }
    }
    const nullableTypes: FieldType[] = ['number', 'nullable-enum', 'date']
    return { value: nullableTypes.includes(field.type) ? null : '' }
  }

  const trimmed = String(rawValue).trim()

  switch (field.type) {
    case 'string':
      return { value: trimmed }

    case 'number': {
      const num = Number(trimmed)
      if (Number.isNaN(num)) {
        return {
          value: null,
          error: { rowIndex, columnLabel: field.columnLabel, message: 'Phải là số' },
        }
      }
      if (field.min !== undefined && num < field.min) {
        return {
          value: null,
          error: { rowIndex, columnLabel: field.columnLabel, message: `Phải lớn hơn hoặc bằng ${field.min}` },
        }
      }
      return { value: num }
    }

    case 'enum':
    case 'nullable-enum': {
      if (!field.enumValues?.includes(trimmed)) {
        return {
          value: null,
          error: {
            rowIndex,
            columnLabel: field.columnLabel,
            message: `Giá trị không hợp lệ — phải là 1 trong: ${field.enumValues?.join(', ')}`,
          },
        }
      }
      return { value: trimmed }
    }

    case 'date': {
      if (Number.isNaN(Date.parse(trimmed))) {
        return {
          value: null,
          error: { rowIndex, columnLabel: field.columnLabel, message: 'Ngày không hợp lệ (định dạng yyyy-mm-dd)' },
        }
      }
      return { value: trimmed }
    }

    default:
      return { value: trimmed }
  }
}

export function validateRows<TRow extends object>(
  parsedFile: ParsedFile,
  config: UploadEntityConfig<TRow>,
): ValidationResult {
  const missingColumns = config.fields
    .filter((field) => !parsedFile.headers.includes(field.columnLabel))
    .map((field) => field.columnLabel)

  if (missingColumns.length > 0) {
    return { missingColumns, errors: [], coercedRows: [] }
  }

  const errors: RowError[] = []
  const coercedRows: Record<string, unknown>[] = []

  for (const parsedRow of parsedFile.rows) {
    const coerced: Record<string, unknown> = {}
    for (const field of config.fields as UploadFieldConfig<Record<string, unknown>>[]) {
      const { value, error } = coerceAndValidateField(field, parsedRow.data[field.columnLabel], parsedRow.excelRowNumber)
      coerced[field.key] = value
      if (error) errors.push(error)
    }
    coercedRows.push(coerced)
  }

  // customValidator chạy sau khi toàn bộ dòng đã coerce, để có thể đối chiếu FK/trùng lặp toàn file.
  parsedFile.rows.forEach((parsedRow, index) => {
    const coerced = coercedRows[index]
    for (const field of config.fields as UploadFieldConfig<Record<string, unknown>>[]) {
      if (!field.customValidator) continue
      const message = field.customValidator(coerced[field.key], coerced, coercedRows)
      if (message) {
        errors.push({ rowIndex: parsedRow.excelRowNumber, columnLabel: field.columnLabel, message })
      }
    }
  })

  if (config.uniqueKey) {
    const seen = new Map<string, number>()
    parsedFile.rows.forEach((parsedRow, index) => {
      const value = String(coercedRows[index][config.uniqueKey as string] ?? '')
      if (!value) return
      if (seen.has(value)) {
        const field = config.fields.find((f) => f.key === config.uniqueKey)
        errors.push({
          rowIndex: parsedRow.excelRowNumber,
          columnLabel: field?.columnLabel ?? String(config.uniqueKey),
          message: `Trùng giá trị với dòng ${seen.get(value)} trong cùng file`,
        })
      } else {
        seen.set(value, parsedRow.excelRowNumber)
      }
    })
  }

  if (errors.length > 0) {
    return { missingColumns: [], errors, coercedRows: [] }
  }

  return { missingColumns: [], errors: [], coercedRows }
}
