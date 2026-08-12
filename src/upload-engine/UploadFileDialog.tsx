import {
  Body1,
  Button,
  Caption1,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  Dropdown,
  Field,
  Option,
  Spinner,
  Tab,
  TabList,
  makeStyles,
  mergeClasses,
  tokens,
} from '@fluentui/react-components'
import { ArrowUploadRegular, DocumentArrowDownRegular } from '@fluentui/react-icons'
import { useRef, useState, type ChangeEvent, type DragEvent } from 'react'
import { useAppToast } from '../components/AppToaster'
import { getDanhMucPhiStore } from '../storage/danhMucPhi'
import { computeTrangThaiKhoanThu } from '../utils/danhMucThu'
import { getCurrentNamHoc, getNamHocOptions } from '../utils/nienKhoa'
import { downloadUploadTemplate } from './buildTemplate'
import type { UploadEntityConfig } from './types'

const useStyles = makeStyles({
  surface: {
    width: '560px',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalM,
    marginTop: tokens.spacingVerticalM,
  },
  actionsRow: {
    display: 'flex',
    columnGap: tokens.spacingHorizontalS,
  },
  dropZone: {
    border: `2px dashed ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    padding: tokens.spacingVerticalXL,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    rowGap: tokens.spacingVerticalXS,
    color: tokens.colorNeutralForeground3,
    cursor: 'pointer',
    textAlign: 'center',
  },
  dropZoneActive: {
    border: `2px dashed ${tokens.colorBrandStroke1}`,
    backgroundColor: tokens.colorBrandBackground2,
    color: tokens.colorBrandForeground1,
  },
})

interface UploadFileDialogProps<TRow extends object> {
  config: UploadEntityConfig<TRow>
  open: boolean
  processing: boolean
  onClose: () => void
  onFileSelected: (file: File) => void
}

/** Bước 1/2 "Tải file lên" của pop-up "Chọn file để tải lên" — hiện dropdown Năm học (mặc định
 * tính động theo ngày hiện tại, xem getCurrentNamHoc — chỉ để ghi nhận kỳ báo cáo, KHÔNG dùng để
 * lọc Mã khoản thu, xem handleDownloadTemplate) + nút "Tải file mẫu" (lọc đúng Mã khoản thu ĐANG
 * hoạt động ở thời điểm hiện tại) + vùng kéo-thả/nút chọn file. Bước 2 "Kiểm tra dữ liệu" vẫn là
 * ReviewUploadDialog hiện có, KHÔNG đổi logic (xem HoaDonUploadPage/index.tsx) — dialog này tự
 * đóng ngay khi người dùng chọn xong file, nhường chỗ cho ReviewUploadDialog mở lên. */
export function UploadFileDialog<TRow extends object>({
  config,
  open,
  processing,
  onClose,
  onFileSelected,
}: UploadFileDialogProps<TRow>) {
  const styles = useStyles()
  const inputRef = useRef<HTMLInputElement>(null)
  const { showError } = useAppToast()
  const [namHoc, setNamHoc] = useState(() => getCurrentNamHoc())
  const [dragActive, setDragActive] = useState(false)
  const namHocOptions = getNamHocOptions()

  function pickFile(file: File | undefined) {
    if (!file) return
    onFileSelected(file)
    onClose()
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    pickFile(file)
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setDragActive(true)
  }

  function handleDragLeave() {
    setDragActive(false)
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setDragActive(false)
    pickFile(event.dataTransfer.files?.[0])
  }

  async function handleDownloadTemplate() {
    const crossRefField = config.fields.find((f) => f.crossRef?.entityLabel === 'Danh mục thu')
    if (!crossRefField) {
      await downloadUploadTemplate(config)
      return
    }
    // Năm học ở dropdown chỉ ghi nhận kỳ báo cáo — Mã khoản thu ĐANG hoạt động (bất kể thuộc năm
    // nào) đều dùng được cho bất kỳ năm học nào, nên lọc theo trạng thái HIỆN TẠI, không theo
    // năm học đã chọn.
    const allRows = Object.values(getDanhMucPhiStore()).flat()
    const active = allRows.filter((row) => computeTrangThaiKhoanThu(row) === 'Đang hoạt động')
    if (active.length === 0) {
      showError('Chưa có Mã khoản thu nào đang hoạt động — không thể tạo file mẫu.')
      return
    }
    await downloadUploadTemplate(config, { danhMucThu: active.map((row) => ({ maPhi: row.maPhi, tenPhi: row.tenPhi })) })
  }

  return (
    <Dialog open={open} onOpenChange={(_, data) => !data.open && onClose()}>
      <DialogSurface className={styles.surface}>
        <DialogBody>
          <DialogTitle>Tải file {config.entityLabel}</DialogTitle>
          <DialogContent className={styles.content}>
            <TabList selectedValue="upload">
              <Tab value="upload">1. Tải file lên</Tab>
              <Tab value="review" disabled>
                2. Kiểm tra dữ liệu
              </Tab>
            </TabList>

            <Field label="Năm học" hint="Chỉ để ghi nhận kỳ báo cáo — không giới hạn Mã khoản thu theo năm học đã chọn.">
              <Dropdown
                value={namHoc}
                selectedOptions={[namHoc]}
                onOptionSelect={(_, data) => data.optionValue && setNamHoc(data.optionValue)}
              >
                {namHocOptions.map((option) => (
                  <Option key={option} value={option}>
                    {option}
                  </Option>
                ))}
              </Dropdown>
            </Field>

            <Body1>Tải file mẫu đúng cột yêu cầu, hoặc chọn file đã điền sẵn để chuyển qua bước kiểm tra dữ liệu.</Body1>

            <div
              className={mergeClasses(styles.dropZone, dragActive && styles.dropZoneActive)}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
            >
              <ArrowUploadRegular fontSize={28} />
              <Body1>Kéo thả file vào đây</Body1>
              <Caption1>hoặc bấm nút bên dưới để chọn file (.xlsx, .xls, .csv)</Caption1>
            </div>

            <div className={styles.actionsRow}>
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
          </DialogContent>
          <DialogActions>
            <Button appearance="secondary" onClick={onClose}>
              Đóng
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  )
}
