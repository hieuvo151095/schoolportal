import { Button, Spinner, makeStyles, tokens } from '@fluentui/react-components'
import { ArrowUploadRegular, DocumentArrowDownRegular } from '@fluentui/react-icons'
import { useRef } from 'react'
import { useAppToast } from '../components/AppToaster'
import { downloadUploadTemplate } from './buildTemplate'
import type { UploadEntityConfig } from './types'

const useStyles = makeStyles({
  row: {
    display: 'flex',
    alignItems: 'flex-end',
    columnGap: tokens.spacingHorizontalS,
  },
})

interface UploadActionsRowProps<TRow extends object> {
  config: UploadEntityConfig<TRow>
  processing: boolean
  onFileSelected: (file: File) => void
  /** Bắt buộc khi config.sheetKeyField có khai báo — trả về danh sách giá trị dùng làm tên sheet
   * (Hoá đơn: danh sách Mã phí lấy ĐỘNG từ Danh mục thu tại thời điểm bấm tải, không hardcode). */
  getSheetNames?: () => string[]
}

/** Nút "Tải file mẫu" + "Chọn file để tải lên", đặt ngay trên dòng tiêu đề cột của bảng. */
export function UploadActionsRow<TRow extends object>({
  config,
  processing,
  onFileSelected,
  getSheetNames,
}: UploadActionsRowProps<TRow>) {
  const styles = useStyles()
  const inputRef = useRef<HTMLInputElement>(null)
  const { showError } = useAppToast()

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (file) onFileSelected(file)
    event.target.value = ''
  }

  function handleDownloadTemplate() {
    if (!config.sheetKeyField) {
      downloadUploadTemplate(config)
      return
    }
    const sheetNames = getSheetNames?.() ?? []
    if (sheetNames.length === 0) {
      showError(`Chưa có ${config.sheetKeyField.columnLabel} nào trong Danh mục thu — không thể tạo file mẫu.`)
      return
    }
    downloadUploadTemplate(config, sheetNames)
  }

  return (
    <div className={styles.row}>
      <Button appearance="secondary" icon={<DocumentArrowDownRegular />} onClick={handleDownloadTemplate}>
        Tải file mẫu
      </Button>
      <Button
        appearance="primary"
        icon={processing ? <Spinner size="tiny" /> : <ArrowUploadRegular />}
        disabled={processing}
        onClick={() => inputRef.current?.click()}
      >
        {processing ? 'Đang xử lý...' : 'Chọn file để tải lên'}
      </Button>
      <input ref={inputRef} type="file" accept=".xlsx,.xls,.csv" hidden onChange={handleChange} />
    </div>
  )
}
