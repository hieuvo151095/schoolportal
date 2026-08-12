import {
  Body1,
  Button,
  Combobox,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  Dropdown,
  Field,
  Input,
  MessageBar,
  MessageBarBody,
  Option,
  makeStyles,
  tokens,
} from '@fluentui/react-components'
import { useEffect, useMemo, useState } from 'react'
import type { ParsedFile } from './parseFile'
import type { UploadEntityConfig, UploadFieldConfig } from './types'
import { coerceAllRows, computeCrossRowErrors, isContextDataDerived } from './validators'

const useStyles = makeStyles({
  surface: {
    maxWidth: '90vw',
    width: '640px',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalM,
  },
  requiredMark: {
    color: tokens.colorPaletteRedForeground1,
  },
})

interface AddRecordDialogProps<TRow extends object> {
  config: UploadEntityConfig<TRow>
  open: boolean
  onClose: () => void
  /** Gọi sau khi lưu thành công — trang gọi refresh bảng + bắn toast. */
  onSaved: () => void
}

function buildEmptyValues<TRow extends object>(config: UploadEntityConfig<TRow>): Record<string, string> {
  return Object.fromEntries(config.fields.map((f) => [f.key, '']))
}

/** Giá trị thật sự đưa vào pipeline validate cho 1 field — field derivedDisplay không đọc từ ô
 * gõ tay của chính nó mà tính lại từ field nguồn (vd Tên học sinh tự điền theo Mã học sinh) mỗi
 * lần values đổi, để required-validation tự chặn lưu khi resolve không ra giá trị (mã không tồn
 * tại) thay vì phải viết thêm 1 lớp validate riêng. */
function resolveFieldValue<TRow extends object>(field: UploadFieldConfig<TRow>, values: Record<string, string>): string {
  if (!field.derivedDisplay) return values[field.key]
  const sourceValue = values[field.derivedDisplay.sourceKey] ?? ''
  if (!sourceValue) return ''
  return field.derivedDisplay.resolve(sourceValue) ?? ''
}

/** Form nhập liệu 1 dòng thủ công — tái dùng ĐÚNG pipeline validate của luồng upload file
 * (coerceAllRows + computeCrossRowErrors: required/type/enum/min/existingDataCheck/crossRef),
 * bằng cách dựng 1 ParsedFile "giả" chỉ có 1 dòng từ giá trị form, rồi chạy qua đúng 2 hàm đó —
 * không viết lại bất kỳ logic validate nào riêng cho form này. */
export function AddRecordDialog<TRow extends object>({ config, open, onClose, onSaved }: AddRecordDialogProps<TRow>) {
  const styles = useStyles()
  const [values, setValues] = useState<Record<string, string>>(() => buildEmptyValues(config))
  const [confirmOpen, setConfirmOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    setValues(buildEmptyValues(config))
    setConfirmOpen(false)
  }, [open, config])

  const validation = useMemo(() => {
    const parsedFile: ParsedFile = {
      headers: config.fields.map((f) => f.columnLabel),
      rows: [
        {
          excelRowNumber: 2,
          sheetName: '',
          data: Object.fromEntries(config.fields.map((f) => [f.columnLabel, resolveFieldValue(f, values)])),
        },
      ],
    }
    const { rows } = coerceAllRows(parsedFile, config)
    const row = rows[0]
    if (!row) return { errors: [], coerced: {} as Record<string, unknown>, contextValue: '' }

    const contextValue = isContextDataDerived(config) ? String(row.coerced[config.contextField.key] ?? '') : ''
    const crossErrors = computeCrossRowErrors(config, rows, contextValue)
    const errors = [...row.fieldErrors, ...(crossErrors.get(row.id) ?? [])]
    return { errors, coerced: row.coerced, contextValue }
  }, [values, config])

  const hasAnyInput = Object.values(values).some((v) => v.trim() !== '')
  // Chỉ severity 'error' mới chặn lưu — 'warning' vẫn cho "Hoàn tất" (đồng nhất với luồng upload
  // file, xem useReviewUpload.ts hasErrors).
  const hasBlockingErrors = validation.errors.some((e) => (e.severity ?? 'error') === 'error')
  const isValid = hasAnyInput && !hasBlockingErrors && !!validation.contextValue

  function handleValueChange(key: string, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  function handleConfirmSave() {
    const finalRow = config.buildRow(validation.coerced, validation.contextValue)
    config.persist([finalRow], validation.contextValue)
    setConfirmOpen(false)
    onClose()
    onSaved()
  }

  function renderField(field: UploadFieldConfig<TRow>) {
    const label = (
      <>
        {field.columnLabel}
        {field.required && <span className={styles.requiredMark}> *</span>}
      </>
    )

    if (field.derivedDisplay) {
      const sourceValue = values[field.derivedDisplay.sourceKey] ?? ''
      const resolved = sourceValue ? field.derivedDisplay.resolve(sourceValue) : null
      const displayValue = !sourceValue ? '' : (resolved ?? field.derivedDisplay.notFoundLabel)
      return (
        <Field key={field.key} label={label} validationState={sourceValue && !resolved ? 'error' : 'none'}>
          <Input value={displayValue} readOnly disabled={!sourceValue} />
        </Field>
      )
    }

    if (field.comboboxOptions) {
      const options = field.comboboxOptions()
      return (
        <Field key={field.key} label={label}>
          <Combobox
            value={values[field.key]}
            selectedOptions={values[field.key] ? [values[field.key]] : []}
            onOptionSelect={(_, data) => handleValueChange(field.key, data.optionValue ?? '')}
          >
            {options.map((opt) => (
              <Option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.value}
              </Option>
            ))}
          </Combobox>
        </Field>
      )
    }

    if (field.type === 'enum' || field.type === 'nullable-enum') {
      return (
        <Field key={field.key} label={label}>
          <Dropdown
            value={values[field.key]}
            selectedOptions={values[field.key] ? [values[field.key]] : []}
            onOptionSelect={(_, data) => handleValueChange(field.key, data.optionValue ?? '')}
          >
            {!field.required && <Option value="">—</Option>}
            {field.enumValues?.map((opt) => (
              <Option key={opt} value={opt}>
                {opt}
              </Option>
            ))}
          </Dropdown>
        </Field>
      )
    }

    const inputType = field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'
    return (
      <Field key={field.key} label={label}>
        <Input type={inputType} value={values[field.key]} onChange={(_, data) => handleValueChange(field.key, data.value)} />
      </Field>
    )
  }

  return (
    <>
      <Dialog open={open && !confirmOpen} onOpenChange={(_, data) => !data.open && onClose()}>
        <DialogSurface className={styles.surface}>
          <DialogBody>
            <DialogTitle>Thêm mới {config.entityLabel}</DialogTitle>
            <DialogContent className={styles.content}>
              {config.fields.map((field) => renderField(field))}

              {hasAnyInput && validation.errors.length > 0 && (
                <MessageBar intent={hasBlockingErrors ? 'error' : 'warning'}>
                  <MessageBarBody>{validation.errors.map((e) => `${e.columnLabel}: ${e.message}`).join('; ')}</MessageBarBody>
                </MessageBar>
              )}
            </DialogContent>
            <DialogActions>
              <Button appearance="secondary" onClick={onClose}>
                Huỷ
              </Button>
              <Button appearance="primary" disabled={!isValid} onClick={() => setConfirmOpen(true)}>
                Hoàn tất
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>

      <Dialog open={confirmOpen} onOpenChange={(_, data) => !data.open && setConfirmOpen(false)}>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>Xác nhận thêm mới</DialogTitle>
            <DialogContent>
              <Body1>Xác nhận thêm mới dòng dữ liệu {config.entityLabel} này vào hệ thống?</Body1>
            </DialogContent>
            <DialogActions>
              <Button appearance="secondary" onClick={() => setConfirmOpen(false)}>
                Huỷ
              </Button>
              <Button appearance="primary" onClick={handleConfirmSave}>
                Xác nhận
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </>
  )
}
