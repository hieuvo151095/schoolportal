export interface HocSinhRow {
  maHocSinh: string
  hoTenHocSinh: string
}

/** Dữ liệu mẫu để tra cứu Mã học sinh → Tên học sinh, dùng cho "Tên học sinh" tự điền ở form
 * "Thêm mới hoá đơn" và khi lưu dữ liệu Hoá đơn (buildRow ở hoaDonUploadConfig.ts). Trường không
 * còn module Học sinh riêng (đã xoá) — hệ thống thật đối chiếu bằng dữ liệu từ DB Sở, đây chỉ là
 * dữ liệu mẫu cố định để hiển thị/demo, khớp đúng 10 học sinh trong mock-data/hoaDonSeed.ts. */
const HOC_SINH_SEED: HocSinhRow[] = [
  { maHocSinh: 'HS0001', hoTenHocSinh: 'Nguyễn Văn An' },
  { maHocSinh: 'HS0002', hoTenHocSinh: 'Trần Thị Bình' },
  { maHocSinh: 'HS0003', hoTenHocSinh: 'Lê Văn Cường' },
  { maHocSinh: 'HS0004', hoTenHocSinh: 'Phạm Thị Dung' },
  { maHocSinh: 'HS0005', hoTenHocSinh: 'Hoàng Văn Em' },
  { maHocSinh: 'HS0006', hoTenHocSinh: 'Ngô Thị Phương' },
  { maHocSinh: 'HS0007', hoTenHocSinh: 'Đặng Văn Giang' },
  { maHocSinh: 'HS0008', hoTenHocSinh: 'Bùi Thị Hoa' },
  { maHocSinh: 'HS0009', hoTenHocSinh: 'Vũ Văn Inh' },
  { maHocSinh: 'HS0010', hoTenHocSinh: 'Đỗ Thị Kim' },
]

/** Tra Tên học sinh theo Mã học sinh — trả về undefined nếu mã chưa có trong dữ liệu mẫu (học
 * sinh hoàn toàn mới, hệ thống thật sẽ đối chiếu DB Sở thay vì mảng cố định này). */
export function findHocSinh(maHocSinh: string): HocSinhRow | undefined {
  const normalized = maHocSinh.trim().toUpperCase()
  return HOC_SINH_SEED.find((hs) => hs.maHocSinh.toUpperCase() === normalized)
}
