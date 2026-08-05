import type { ParsedFile } from './parseFile'
import type { FieldType, RowError, UploadEntityConfig, UploadFieldConfig } from './types'

export interface ReviewRow {
  /** Id ổn định cho key React / thao tác xoá — dựa theo số dòng Excel gốc. */
  id: string
  excelRowNumber: number
  /** Dòng đã coerce theo type, keyed theo field.key — CHƯA gắn context (nienKhoa/ky). */
  coerced: Record<string, unknown>
  /** Lỗi field-level (required/type/enum/min) — cố định, không đổi khi các dòng khác bị xoá. */
  fieldErrors: RowError[]
}

export interface CoerceAllResult {
  missingColumns: string[]
  rows: ReviewRow[]
}

/** Context (Niên khoá/Kỳ) được coi là "đọc từ chính dữ liệu file" khi contextField.key trùng với
 * 1 field thật trong danh sách cột upload (Danh mục Phí, Hoá đơn) — khác với Học sinh, nơi Niên
 * khoá vẫn là giá trị chọn từ ngoài (không có field tương ứng trong HocSinhRow). */
export function isContextDataDerived<TRow extends object>(config: UploadEntityConfig<TRow>): boolean {
  return config.fields.some((field) => field.key === config.contextField.key)
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

/** Coerce toàn bộ dòng theo type (required/type/enum/min) — LUÔN trả về đủ mọi dòng (không bail
 * sớm khi có lỗi), để pop-up review có thể hiện toàn bộ file kèm lỗi và cho phép xoá từng dòng. */
export function coerceAllRows<TRow extends object>(
  parsedFile: ParsedFile,
  config: UploadEntityConfig<TRow>,
): CoerceAllResult {
  const missingColumns = config.fields
    .filter((field) => !parsedFile.headers.includes(field.columnLabel))
    .map((field) => field.columnLabel)

  if (missingColumns.length > 0) {
    return { missingColumns, rows: [] }
  }

  const rows: ReviewRow[] = parsedFile.rows.map((parsedRow) => {
    const coerced: Record<string, unknown> = {}
    const fieldErrors: RowError[] = []
    for (const field of config.fields as UploadFieldConfig<Record<string, unknown>>[]) {
      const { value, error } = coerceAndValidateField(field, parsedRow.data[field.columnLabel], parsedRow.excelRowNumber)
      coerced[field.key] = value
      if (error) fieldErrors.push(error)
    }
    return { id: `row-${parsedRow.excelRowNumber}`, excelRowNumber: parsedRow.excelRowNumber, coerced, fieldErrors }
  })

  return { missingColumns: [], rows }
}

/** Lỗi phụ thuộc vào TẬP DÒNG hiện tại (customValidator FK/... + trùng khoá trong file/với dữ
 * liệu cũ) — tính lại mỗi khi tập dòng đổi (vd sau khi xoá 1 dòng), khác với fieldErrors cố định.
 * `contextValue` (niên khoá/kỳ hiệu lực của lần upload này) dùng để tra dữ liệu đã đồng bộ trước
 * đó cho existingDataCheck — bỏ qua check này nếu context chưa xác định được (rỗng). */
export function computeCrossRowErrors<TRow extends object>(
  config: UploadEntityConfig<TRow>,
  rows: ReviewRow[],
  contextValue: string,
): Map<string, RowError[]> {
  const errorsByRowId = new Map<string, RowError[]>()

  function addError(rowId: string, error: RowError) {
    const list = errorsByRowId.get(rowId) ?? []
    list.push(error)
    errorsByRowId.set(rowId, list)
  }

  const allCoerced = rows.map((row) => row.coerced)

  for (const row of rows) {
    for (const field of config.fields as UploadFieldConfig<Record<string, unknown>>[]) {
      if (!field.customValidator) continue
      const message = field.customValidator(row.coerced[field.key], row.coerced, allCoerced)
      if (message) {
        addError(row.id, {
          rowIndex: row.excelRowNumber,
          columnLabel: field.columnLabel,
          message,
          ...(field.crossRef
            ? { crossRef: { ...field.crossRef, value: String(row.coerced[field.key] ?? '') } }
            : {}),
        })
      }
    }
  }

  if (config.uniqueKey) {
    const keys = Array.isArray(config.uniqueKey) ? config.uniqueKey : [config.uniqueKey]
    const columnLabel = keys
      .map((k) => config.fields.find((f) => f.key === k)?.columnLabel ?? String(k))
      .join(' + ')
    const seen = new Map<string, number>()
    for (const row of rows) {
      const parts = keys.map((k) => String(row.coerced[k as string] ?? ''))
      if (parts.some((p) => !p)) continue
      const value = parts.join('::')
      if (seen.has(value)) {
        addError(row.id, {
          rowIndex: row.excelRowNumber,
          columnLabel,
          message: `Trùng giá trị với dòng ${seen.get(value)} trong cùng file`,
        })
      } else {
        seen.set(value, row.excelRowNumber)
      }
    }
  }

  if (config.existingDataCheck && contextValue) {
    const { key, getExistingRows } = config.existingDataCheck
    const columnLabel = config.fields.find((f) => f.key === key)?.columnLabel ?? String(key)
    const existingValues = new Set(
      getExistingRows(contextValue)
        .map((existingRow) => String(existingRow[key] ?? ''))
        .filter(Boolean),
    )
    for (const row of rows) {
      const value = String(row.coerced[key] ?? '')
      if (!value || !existingValues.has(value)) continue
      addError(row.id, {
        rowIndex: row.excelRowNumber,
        columnLabel,
        message: `${columnLabel} '${value}' đã tồn tại trong dữ liệu ${config.entityLabel} đã đồng bộ trước đó (${config.contextField.label} ${contextValue})`,
      })
    }
  }

  if (config.groupConsistencyCheck) {
    const { groupKey, fields: fieldsToMatch } = config.groupConsistencyCheck
    const firstByGroup = new Map<string, { excelRowNumber: number; coerced: Record<string, unknown> }>()
    for (const row of rows) {
      const groupValue = String(row.coerced[groupKey as string] ?? '')
      if (!groupValue) continue
      const first = firstByGroup.get(groupValue)
      if (!first) {
        firstByGroup.set(groupValue, row)
        continue
      }
      for (const fieldKey of fieldsToMatch) {
        if (row.coerced[fieldKey as string] === first.coerced[fieldKey as string]) continue
        const fieldConfig = config.fields.find((f) => f.key === fieldKey)
        addError(row.id, {
          rowIndex: row.excelRowNumber,
          columnLabel: fieldConfig?.columnLabel ?? String(fieldKey),
          message: `Không khớp với dòng ${first.excelRowNumber} (cùng ${String(groupKey)} '${groupValue}')`,
        })
      }
    }
  }

  // 1 lần đồng bộ chỉ áp dụng cho đúng 1 Niên khoá/Kỳ — nếu context đọc từ dữ liệu file, mọi dòng
  // phải cùng giá trị với dòng đầu tiên; dòng lệch bị đánh dấu lỗi (tái dùng cơ chế xoá dòng lỗi
  // hiện có) thay vì âm thầm tách nhóm hay tự chọn 1 giá trị đại diện.
  if (isContextDataDerived(config) && rows.length > 0) {
    const contextKey = config.contextField.key
    const contextFieldConfig = config.fields.find((f) => f.key === contextKey)
    const firstValue = rows[0].coerced[contextKey]
    for (const row of rows) {
      const value = row.coerced[contextKey]
      if (value && firstValue && value !== firstValue) {
        addError(row.id, {
          rowIndex: row.excelRowNumber,
          columnLabel: contextFieldConfig?.columnLabel ?? config.contextField.label,
          message: `Không khớp ${config.contextField.label} với dòng đầu tiên trong file ('${firstValue}') — 1 lần đồng bộ chỉ áp dụng cho 1 ${config.contextField.label.toLowerCase()}`,
        })
      }
    }
  }

  return errorsByRowId
}
