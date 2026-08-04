import { useState } from 'react'
import { appendLichSuDongBo } from '../storage/lichSuDongBo'
import { getSession } from '../storage/session'
import { downloadSyncJson } from './exportJson'
import { parseUploadFile } from './parseFile'
import type { RowError, UploadEntityConfig } from './types'
import { validateRows } from './validators'

export type UploadWizardStep = 'upload' | 'errors' | 'preview' | 'done'

export interface ConfirmSummary {
  soDong: number
  tenFileExport: string
}

export function useUploadWizard<TRow extends object>(
  config: UploadEntityConfig<TRow>,
  contextValue: string,
  onConfirmed?: () => void,
) {
  const [step, setStep] = useState<UploadWizardStep>('upload')
  const [fileName, setFileName] = useState<string | null>(null)
  const [missingColumns, setMissingColumns] = useState<string[]>([])
  const [errors, setErrors] = useState<RowError[]>([])
  const [rows, setRows] = useState<TRow[]>([])
  const [confirmSummary, setConfirmSummary] = useState<ConfirmSummary | null>(null)
  const [processing, setProcessing] = useState(false)

  async function handleFile(file: File) {
    setProcessing(true)
    setFileName(file.name)
    try {
      const parsed = await parseUploadFile(file)
      const result = validateRows(parsed, config)

      if (result.missingColumns.length > 0) {
        setMissingColumns(result.missingColumns)
        setErrors([])
        setStep('errors')
        return
      }
      if (result.errors.length > 0) {
        setMissingColumns([])
        setErrors(result.errors)
        setStep('errors')
        return
      }

      const builtRows = result.coercedRows.map((row) => config.buildRow(row, contextValue))
      setMissingColumns([])
      setErrors([])
      setRows(builtRows)
      setStep('preview')
    } finally {
      setProcessing(false)
    }
  }

  function reset() {
    setStep('upload')
    setFileName(null)
    setMissingColumns([])
    setErrors([])
    setRows([])
    setConfirmSummary(null)
  }

  function confirm() {
    const session = getSession()
    if (!session) return

    config.persist(rows, contextValue)
    const { tenFileExport } = downloadSyncJson(config, rows, contextValue, session.maTruong)

    appendLichSuDongBo({
      id: `${config.entityKey}-${Date.now()}`,
      thoiDiem: new Date().toISOString(),
      loaiDuLieu: config.entityKey,
      nienKhoaHoacKy: contextValue,
      soDongThanhCong: rows.length,
      soDongLoi: 0,
      trangThai: 'Thành công',
      tenFileExport,
      nguoiThucHien: session.taiKhoan || session.tenTruong,
    })

    setConfirmSummary({ soDong: rows.length, tenFileExport })
    setStep('done')
    onConfirmed?.()
  }

  return {
    step,
    fileName,
    missingColumns,
    errors,
    rows,
    confirmSummary,
    processing,
    handleFile,
    reset,
    confirm,
  }
}
