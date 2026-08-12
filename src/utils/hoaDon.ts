import type { TrangThaiHoaDon } from '../types/domain'

/** Tự tính Trạng thái thanh toán từ Số tiền khoản phí (soTien) và Số tiền đã trả (daTra) — dùng
 * lúc tạo hoá đơn mới (hoaDonUploadConfig.ts) lẫn lúc merge dữ liệu trùng Mã HĐ sau khi báo cáo
 * "Đã xử lý" (storage/hoaDon.ts finalizeHoaDonMerge). daTra > soTien đã bị chặn từ bước validate
 * (field daTra), nên ở đây chỉ còn đúng 3 trường hợp. */
export function computeTrangThaiHoaDon(soTien: number, daTra: number): TrangThaiHoaDon {
  if (daTra === soTien) return 'Đã thanh toán'
  if (daTra === 0) return 'Chưa thanh toán'
  return 'Thanh toán một phần'
}
