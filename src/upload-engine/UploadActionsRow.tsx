import { Button, Spinner, makeStyles, tokens } from '@fluentui/react-components'
import { ArrowUploadRegular, DocumentArrowDownRegular } from '@fluentui/react-icons'
import { useRef } from 'react'
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
}

/** Nút "Tải file mẫu" + "Chọn file để tải lên", đặt ngay trên dòng tiêu đề cột của bảng. */
export function UploadActionsRow<TRow extends object>({
  config,
  processing,
  onFileSelected,
}: UploadActionsRowProps<TRow>) {
  const styles = useStyles()
  const inputRef = useRef<HTMLInputElement>(null)

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (file) onFileSelected(file)
    event.target.value = ''
  }

  return (
    <div className={styles.row}>
      <Button appearance="secondary" icon={<DocumentArrowDownRegular />} onClick={() => downloadUploadTemplate(config)}>
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
