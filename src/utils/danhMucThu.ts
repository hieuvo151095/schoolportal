import type { KhoanPhiRow } from '../types/domain'

export type TrangThaiKhoanThu = 'Đang hoạt động' | 'Ngưng hoạt động'

/** Trạng thái hoạt động TẠI 1 thời điểm cụ thể (mặc định = hôm nay) — "Đang hoạt động" khi thời
 * điểm nằm trong [ngayBatDau, ngayKetThuc] (ngayKetThuc = null nghĩa là chưa có ngày kết thúc,
 * vẫn tính là còn hoạt động). So sánh chuỗi ISO 'YYYY-MM-DD' vẫn đúng thứ tự thời gian. */
export function computeTrangThaiKhoanThu(
  row: Pick<KhoanPhiRow, 'ngayBatDau' | 'ngayKetThuc'>,
  atDate: string = new Date().toISOString().slice(0, 10),
): TrangThaiKhoanThu {
  if (row.ngayBatDau > atDate) return 'Ngưng hoạt động'
  if (row.ngayKetThuc && row.ngayKetThuc < atDate) return 'Ngưng hoạt động'
  return 'Đang hoạt động'
}
