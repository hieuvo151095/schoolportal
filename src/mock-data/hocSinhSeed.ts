import type { HocSinhRow } from '../types/domain'

/** Dữ liệu học sinh mẫu cố định (deterministic) — dùng để Tab "Danh sách học sinh" có sẵn
 * dữ liệu khi demo lần đầu, và làm khoá ngoại tham chiếu cho dữ liệu mẫu Hoá đơn. */
export function buildHocSinhSeed(nienKhoa: string): HocSinhRow[] {
  const rows: Omit<HocSinhRow, 'nienKhoa'>[] = [
    { maHocSinh: 'HS0001', hoTen: 'Nguyễn Văn An', lop: '6A', khoi: '6', gioiTinh: 'Nam' },
    { maHocSinh: 'HS0002', hoTen: 'Trần Thị Bình', lop: '6A', khoi: '6', gioiTinh: 'Nữ' },
    { maHocSinh: 'HS0003', hoTen: 'Lê Văn Cường', lop: '6A', khoi: '6', gioiTinh: 'Nam' },
    { maHocSinh: 'HS0004', hoTen: 'Phạm Thị Dung', lop: '6B', khoi: '6', gioiTinh: 'Nữ' },
    { maHocSinh: 'HS0005', hoTen: 'Hoàng Văn Em', lop: '6B', khoi: '6', gioiTinh: 'Nam' },
    { maHocSinh: 'HS0006', hoTen: 'Ngô Thị Phương', lop: '7A', khoi: '7', gioiTinh: 'Nữ' },
    { maHocSinh: 'HS0007', hoTen: 'Đặng Văn Giang', lop: '7A', khoi: '7', gioiTinh: 'Nam' },
    { maHocSinh: 'HS0008', hoTen: 'Bùi Thị Hoa', lop: '7B', khoi: '7', gioiTinh: 'Nữ' },
    { maHocSinh: 'HS0009', hoTen: 'Vũ Văn Inh', lop: '8A', khoi: '8', gioiTinh: 'Nam' },
    { maHocSinh: 'HS0010', hoTen: 'Đỗ Thị Kim', lop: '8A', khoi: '8', gioiTinh: 'Nữ' },
  ]
  return rows.map((row) => ({ ...row, nienKhoa }))
}
