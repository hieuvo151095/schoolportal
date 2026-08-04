import type { UploadEntityConfig } from './types'

function buildTimestamp(): string {
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`
}

function sanitizeForFileName(value: string): string {
  return value.replace(/[/\\]/g, '-')
}

export interface SyncExportResult {
  tenFileExport: string
}

/** Tải về 1 file JSON chứa metadata + dữ liệu đã xác nhận đồng bộ — chuẩn bị cho tích hợp
 * sau này với dashportal (import thủ công, không phải API). */
export function downloadSyncJson<TRow extends object>(
  config: UploadEntityConfig<TRow>,
  rows: TRow[],
  contextValue: string,
  maTruong: string,
): SyncExportResult {
  const payload = {
    metadata: {
      maTruong,
      loaiDuLieu: config.entityKey,
      [config.contextField.key]: contextValue,
      thoiDiemXuat: new Date().toISOString(),
      ...(config.exportMetadataNote ? { ghiChuMapping: config.exportMetadataNote } : {}),
    },
    data: rows.map((row) => (config.transformForExport ? config.transformForExport(row) : row)),
  }

  const tenFileExport = `dong-bo_${sanitizeForFileName(maTruong)}_${config.entityKey}_${sanitizeForFileName(contextValue)}_${buildTimestamp()}.json`

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = tenFileExport
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)

  return { tenFileExport }
}
