import { useMemo, useState } from 'react'
import { getSession } from '../../storage/session'
import { getPendingData, performDongBo, type DongBoSelection, type PendingData } from './dongBoLogic'

const EMPTY_PENDING: PendingData = { danhMucPhi: [], hocSinh: [], hoaDon: [] }

export interface UseDongBoDialogOptions {
  /** Gọi sau khi đồng bộ thành công — dùng để trang gọi refresh lại bảng đang hiển thị. */
  onSynced?: () => void
}

/** State + hành động cho pop-up "Đồng bộ dữ liệu" (chế độ tạo mới, khác chế độ xem lại "Chi
 * tiết" readOnly) — dùng chung giữa module Đồng bộ (nút "Đồng bộ dữ liệu") và nút "Bắt đầu đồng
 * bộ" ở từng module Danh mục Phí/Học sinh/Hoá đơn, để không lặp lại logic mở pending + gọi
 * performDongBo ở nhiều nơi. */
export function useDongBoDialog(options?: UseDongBoDialogOptions) {
  const [open, setOpen] = useState(false)

  /** Tính lại pending mỗi khi pop-up mở — đảm bảo luôn đọc đúng dữ liệu mới nhất tại thời điểm
   * mở, không bị stale nếu trang cha vừa lưu/thêm dữ liệu trước đó. */
  const pending = useMemo(() => (open ? getPendingData() : EMPTY_PENDING), [open])

  function openDialog() {
    setOpen(true)
  }

  function closeDialog() {
    setOpen(false)
  }

  function confirm(selection: DongBoSelection) {
    const session = getSession()
    if (!session) return
    performDongBo(pending, selection, session.taiKhoan || session.tenTruong)
    setOpen(false)
    options?.onSynced?.()
  }

  return { open, pending, openDialog, closeDialog, confirm }
}
