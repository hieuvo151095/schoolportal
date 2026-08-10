import { useMemo, useState } from 'react'
import { getSession } from '../../storage/session'
import { getPendingHoaDon, performDongBo } from './dongBoLogic'

export interface UseDongBoDialogOptions {
  /** Gọi sau khi nộp báo cáo thành công — dùng để trang gọi refresh lại bảng đang hiển thị. */
  onSynced?: () => void
}

/** State + hành động cho pop-up "Nộp báo cáo" (chế độ tạo mới, khác chế độ xem lại "Chi tiết"
 * readOnly) — dùng chung giữa module Nộp báo cáo và nút cùng chức năng ở module Nhập dữ liệu, để
 * không lặp lại logic mở pending + gọi performDongBo ở nhiều nơi. */
export function useDongBoDialog(options?: UseDongBoDialogOptions) {
  const [open, setOpen] = useState(false)

  /** Tính lại pending mỗi khi pop-up mở — đảm bảo luôn đọc đúng dữ liệu mới nhất tại thời điểm
   * mở, không bị stale nếu trang cha vừa lưu/thêm dữ liệu trước đó. */
  const pending = useMemo(() => (open ? getPendingHoaDon() : []), [open])

  function openDialog() {
    setOpen(true)
  }

  function closeDialog() {
    setOpen(false)
  }

  function confirm(selection: string[]) {
    const session = getSession()
    if (!session) return
    performDongBo(pending, selection, session.taiKhoan || session.tenTruong)
    setOpen(false)
    options?.onSynced?.()
  }

  return { open, pending, openDialog, closeDialog, confirm }
}
