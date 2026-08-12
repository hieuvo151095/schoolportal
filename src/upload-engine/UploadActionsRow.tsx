import { Button, Spinner, makeStyles, tokens } from '@fluentui/react-components'
import { ArrowUploadRegular } from '@fluentui/react-icons'

const useStyles = makeStyles({
  row: {
    display: 'flex',
    alignItems: 'flex-end',
    columnGap: tokens.spacingHorizontalS,
  },
})

interface UploadActionsRowProps {
  processing: boolean
  onOpenUploadDialog: () => void
}

/** Nút "Chọn file để tải lên" — mở pop-up 2 bước (Tải file lên → Kiểm tra dữ liệu), xem
 * UploadFileDialog.tsx. Nút "Tải file mẫu" đã chuyển vào bên trong bước 1 của pop-up đó (cần
 * dropdown Năm học để lọc đúng Mã khoản thu đang hoạt động). */
export function UploadActionsRow({ processing, onOpenUploadDialog }: UploadActionsRowProps) {
  const styles = useStyles()

  return (
    <div className={styles.row}>
      <Button
        appearance="primary"
        icon={processing ? <Spinner size="tiny" /> : <ArrowUploadRegular />}
        disabled={processing}
        onClick={onOpenUploadDialog}
      >
        {processing ? 'Đang xử lý...' : 'Chọn file để tải lên'}
      </Button>
    </div>
  )
}
