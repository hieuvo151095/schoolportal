import { Body1, Button, Card, Spinner, makeStyles, tokens } from '@fluentui/react-components'
import { ArrowUploadRegular, DocumentArrowDownRegular } from '@fluentui/react-icons'
import { useRef } from 'react'
import { downloadUploadTemplate } from '../buildTemplate'
import type { UploadEntityConfig } from '../types'

const useStyles = makeStyles({
  card: {
    padding: tokens.spacingHorizontalXL,
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalM,
    maxWidth: '520px',
  },
  actions: {
    display: 'flex',
    columnGap: tokens.spacingHorizontalS,
  },
})

interface StepTemplateAndUploadProps<TRow extends object> {
  config: UploadEntityConfig<TRow>
  processing: boolean
  onFileSelected: (file: File) => void
}

export function StepTemplateAndUpload<TRow extends object>({
  config,
  processing,
  onFileSelected,
}: StepTemplateAndUploadProps<TRow>) {
  const styles = useStyles()
  const inputRef = useRef<HTMLInputElement>(null)

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (file) onFileSelected(file)
    event.target.value = ''
  }

  return (
    <Card className={styles.card}>
      <Body1>
        Bước 1: tải file mẫu đúng cấu trúc cột yêu cầu. Bước 2: điền dữ liệu {config.entityLabel.toLowerCase()} theo
        mẫu rồi tải file lên (.xlsx hoặc .csv).
      </Body1>
      <div className={styles.actions}>
        <Button
          appearance="secondary"
          icon={<DocumentArrowDownRegular />}
          onClick={() => downloadUploadTemplate(config)}
        >
          Tải template mẫu
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
    </Card>
  )
}
