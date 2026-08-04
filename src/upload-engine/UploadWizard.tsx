import { Body1, Button, Card, MessageBar, MessageBarBody, makeStyles, tokens } from '@fluentui/react-components'
import { ArrowUploadRegular } from '@fluentui/react-icons'
import { StepPreviewConfirm } from './steps/StepPreviewConfirm'
import { StepTemplateAndUpload } from './steps/StepTemplateAndUpload'
import { StepValidationErrors } from './steps/StepValidationErrors'
import type { UploadEntityConfig } from './types'
import { useUploadWizard } from './useUploadWizard'

const useStyles = makeStyles({
  card: {
    padding: tokens.spacingHorizontalXL,
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalM,
    maxWidth: '520px',
  },
})

interface UploadWizardProps<TRow extends object> {
  config: UploadEntityConfig<TRow>
  /** Giá trị Niên khoá hoặc Kỳ đã chọn ở trang cha, trước khi mở wizard. */
  contextValue: string
  /** Gọi sau khi xác nhận đồng bộ thành công — dùng để trang cha làm mới các khối phụ thuộc
   * (vd bảng Lịch sử đồng bộ). */
  onConfirmed?: () => void
}

export function UploadWizard<TRow extends object>({ config, contextValue, onConfirmed }: UploadWizardProps<TRow>) {
  const styles = useStyles()
  const wizard = useUploadWizard(config, contextValue, onConfirmed)

  if (wizard.step === 'upload') {
    return (
      <StepTemplateAndUpload config={config} processing={wizard.processing} onFileSelected={wizard.handleFile} />
    )
  }

  if (wizard.step === 'errors') {
    return (
      <StepValidationErrors
        missingColumns={wizard.missingColumns}
        errors={wizard.errors}
        fileName={wizard.fileName}
        onRetry={wizard.reset}
      />
    )
  }

  if (wizard.step === 'preview') {
    return (
      <StepPreviewConfirm config={config} rows={wizard.rows} onConfirm={wizard.confirm} onCancel={wizard.reset} />
    )
  }

  return (
    <Card className={styles.card}>
      <MessageBar intent="success">
        <MessageBarBody>Đồng bộ thành công.</MessageBarBody>
      </MessageBar>
      <Body1>
        Đã lưu {wizard.confirmSummary?.soDong} dòng cho {config.contextField.label.toLowerCase()} "{contextValue}".
        Đã tải về file: {wizard.confirmSummary?.tenFileExport}
      </Body1>
      <Button appearance="primary" icon={<ArrowUploadRegular />} onClick={wizard.reset}>
        Đồng bộ file khác
      </Button>
    </Card>
  )
}
