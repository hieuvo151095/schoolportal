import { useMemo, useState } from 'react'
import { appendLichSuDongBo } from '../storage/lichSuDongBo'
import { getSession } from '../storage/session'
import { downloadSyncJson } from './exportJson'
import { parseUploadFile } from './parseFile'
import type { RowError, UploadEntityConfig } from './types'
import { coerceAllRows, computeCrossRowErrors, isContextDataDerived, type ReviewRow } from './validators'

export interface ReviewRowWithErrors extends ReviewRow {
  errors: RowError[]
}

export interface ConfirmSummary {
  soDong: number
  tenFileExport: string
}

/** `externalContextValue` chỉ cần thiết khi context (Niên khoá/Kỳ) KHÔNG đọc được từ chính dữ
 * liệu file (vd Học sinh — Niên khoá là khoá lưu trữ bên ngoài, không phải field trong
 * HocSinhRow). Với Danh mục Phí/Hoá đơn, context đã có sẵn trong từng dòng file, hook tự phát
 * hiện và bỏ qua tham số này. */
export function useReviewUpload<TRow extends object>(
  config: UploadEntityConfig<TRow>,
  externalContextValue?: string,
  onConfirmed?: () => void,
) {
  const [open, setOpen] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const [missingColumns, setMissingColumns] = useState<string[]>([])
  const [rows, setRows] = useState<ReviewRow[]>([])
  const [initialRowCount, setInitialRowCount] = useState(0)
  const [processing, setProcessing] = useState(false)
  const [confirmSummary, setConfirmSummary] = useState<ConfirmSummary | null>(null)

  const dataDerived = isContextDataDerived(config)

  /** Niên khoá/Kỳ đọc được từ dòng đầu tiên của file — chỉ đáng tin khi không có lỗi lệch nhau
   * giữa các dòng (hasErrors đã bắt lỗi đó riêng, xem computeCrossRowErrors). */
  const detectedContextValue = useMemo(() => {
    if (!dataDerived || rows.length === 0) return null
    const value = rows[0].coerced[config.contextField.key]
    return typeof value === 'string' && value ? value : null
  }, [dataDerived, rows, config.contextField.key])

  const effectiveContextValue = dataDerived ? (detectedContextValue ?? '') : (externalContextValue ?? '')

  const crossErrors = useMemo(
    () => computeCrossRowErrors(config, rows, effectiveContextValue),
    [config, rows, effectiveContextValue],
  )

  const reviewRows: ReviewRowWithErrors[] = useMemo(
    () => rows.map((row) => ({ ...row, errors: [...row.fieldErrors, ...(crossErrors.get(row.id) ?? [])] })),
    [rows, crossErrors],
  )

  const hasErrors = reviewRows.some((row) => row.errors.length > 0)

  async function handleFile(file: File) {
    setProcessing(true)
    setFileName(file.name)
    setConfirmSummary(null)
    try {
      const parsed = await parseUploadFile(file)
      const result = coerceAllRows(parsed, config)
      setMissingColumns(result.missingColumns)
      setRows(result.rows)
      setInitialRowCount(result.rows.length)
      setOpen(true)
    } finally {
      setProcessing(false)
    }
  }

  function deleteRow(rowId: string) {
    setRows((prev) => prev.filter((row) => row.id !== rowId))
  }

  function cancel() {
    setOpen(false)
    setRows([])
    setMissingColumns([])
    setFileName(null)
  }

  function confirm() {
    const session = getSession()
    if (!session || hasErrors || rows.length === 0 || !effectiveContextValue) return

    const finalRows = rows.map((row) => config.buildRow(row.coerced, effectiveContextValue))
    config.persist(finalRows, effectiveContextValue)
    const { tenFileExport } = downloadSyncJson(config, finalRows, effectiveContextValue, session.maTruong)

    const soDongThanhCong = config.countSuccessRows ? config.countSuccessRows(finalRows) : finalRows.length

    appendLichSuDongBo({
      id: `${config.entityKey}-${Date.now()}`,
      thoiDiem: new Date().toISOString(),
      loaiDuLieu: config.entityKey,
      nienKhoaHoacKy: effectiveContextValue,
      soDongThanhCong,
      soDongLoi: initialRowCount - finalRows.length,
      tenFileExport,
      nguoiThucHien: session.taiKhoan || session.tenTruong,
    })

    setConfirmSummary({ soDong: finalRows.length, tenFileExport })
    setOpen(false)
    setRows([])
    setMissingColumns([])
    onConfirmed?.()
  }

  return {
    open,
    fileName,
    missingColumns,
    reviewRows,
    hasErrors,
    processing,
    confirmSummary,
    dataDerived,
    detectedContextValue,
    handleFile,
    deleteRow,
    cancel,
    confirm,
  }
}
