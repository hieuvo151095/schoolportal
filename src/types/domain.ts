// Khai báo type độc lập của Portal Nhập liệu Nhà trường. Field name/enum value được giữ
// khớp chính xác với dashportal (src/mock-data/types.ts) để export JSON dễ map sau này,
// nhưng KHÔNG import từ dashportal — 2 dự án độc lập kỹ thuật hoàn toàn.

export type CapHoc = 'Mầm non' | 'Tiểu học' | 'THCS' | 'THPT'

export type HeThongDoiTac =
  | 'SSC'
  | 'Misa'
  | 'Viettel'
  | 'VNPT'
  | 'eNetViet'
  | 'YoYoSchool'
  | 'ECO School'

export type DonViTinh = 'tháng' | 'giờ' | 'lần' | 'ngày' | 'năm' | 'chuyến'

export type NguonThu = 'Học phí' | 'Dịch vụ' | 'Bán trú'

export type NhomPhi = 'Thu theo tháng' | 'Thu theo năm' | 'Thu không định kỳ'

export type DanhMucKhoanThu =
  | 'Học phí'
  | 'Bán trú'
  | 'Đưa đón'
  | 'Bảo hiểm y tế'
  | 'Đồng phục'
  | 'Ngoại khoá'
  | 'Khoản thu khác'

export type HinhThucThanhToan = 'Tiền mặt' | 'Chuyển khoản' | 'Ví điện tử' | 'QR Code'

export type GioiTinh = 'Nam' | 'Nữ'

/** Nhãn hiển thị cho nhân viên trường. Khi export JSON, 'Chưa thanh toán' được map sang
 * enum thật của dashportal ('Đã gửi') — xem upload-engine/exportJson.ts. */
export type TrangThaiHoaDon = 'Đã thanh toán' | 'Thanh toán một phần' | 'Chưa thanh toán'

export const THAM_CHIEU_PHAP_LY_LIST = [
  'NQ 04/2023/NQ-HĐND',
  'TT 55/2011/TTLT-BGDĐT-BTC',
  'NĐ 81/2021/NĐ-CP',
  'QĐ 3488/QĐ-UBND',
] as const

export interface HoSoTruong {
  maTruong: string
  tenTruong: string
  xaPhuong: string
  capHoc: CapHoc
  heThongDoiTac: HeThongDoiTac
  /** Niên khoá đang hoạt động — default cho upload Danh mục Phí/Học sinh, và là chuẩn
   * đối chiếu khoá ngoại maHocSinh khi upload Hoá đơn. */
  nienKhoa: string
}

export interface KhoanPhiRow {
  maPhi: string
  tenPhi: string
  soTien: number
  donViTinh: DonViTinh
  nguonThu: NguonThu
  nhomPhi: NhomPhi
  danhMucKhoanThu: DanhMucKhoanThu
  nienKhoa: string
  thamChieuPhapLy: string
  ghiChu: string
  /** true = đã được xác nhận qua module "Đồng bộ" (gửi lên Sở) — false = mới lưu ở bước nhập
   * liệu, đang chờ. Bảng chính của module vẫn hiện cả 2 trạng thái, chỉ module Đồng bộ lọc theo
   * false. */
  daDongBo: boolean
}

export interface HocSinhRow {
  maHocSinh: string
  hoTen: string
  lop: string
  khoi: string
  gioiTinh: GioiTinh
  nienKhoa: string
  /** true = đã được xác nhận qua module "Đồng bộ" (gửi lên Sở) — false = mới lưu ở bước nhập
   * liệu, đang chờ. Bảng chính của module vẫn hiện cả 2 trạng thái, chỉ module Đồng bộ lọc theo
   * false. */
  daDongBo: boolean
}

export interface HoaDonRow {
  soHoaDon: string
  maHocSinh: string
  ky: string
  hanThanhToan: string
  soTien: number
  hinhThucThanhToan: HinhThucThanhToan | null
  ngayThanhToan: string | null
  trangThai: TrangThaiHoaDon
  daTra: number
  taoBoi: string
  xacNhanBoi: string | null
  /** true = đã được xác nhận qua module "Đồng bộ" (gửi lên Sở) — false = mới lưu ở bước nhập
   * liệu, đang chờ. Bảng chính của module vẫn hiện cả 2 trạng thái, chỉ module Đồng bộ lọc theo
   * false. */
  daDongBo: boolean
}

/** 1 dòng khoản phí thuộc 1 hoá đơn — nhiều dòng có thể cùng chung soHoaDon (quan hệ 1-nhiều).
 * Tổng soTien của các dòng cùng soHoaDon phải khớp HoaDonRow.soTien của hoá đơn đó. */
export interface HoaDonKhoanPhiRow {
  soHoaDon: string
  maPhi: string
  soTien: number
}

/** Đúng 1 dòng trong file upload Hoá đơn — gộp field header hoá đơn (lặp lại trên mọi dòng
 * cùng Mã HĐ) + 1 dòng khoản phí (maPhi/soTien). Sau khi review, các dòng cùng soHoaDon được
 * gộp lại thành 1 HoaDonRow (soTien = tổng) + nhiều HoaDonKhoanPhiRow, xem hoaDonUploadConfig.ts. */
export interface HoaDonUploadLineRow {
  soHoaDon: string
  maHocSinh: string
  ky: string
  hanThanhToan: string
  hinhThucThanhToan: HinhThucThanhToan | null
  ngayThanhToan: string | null
  trangThai: TrangThaiHoaDon
  daTra: number
  taoBoi: string
  xacNhanBoi: string | null
  maPhi: string
  soTien: number
}

export type LoaiDuLieuDongBo = 'danhMucPhi' | 'hocSinh' | 'hoaDon'

export type TrangThaiDongBo = 'Thành công' | 'Thất bại'

/** 1 lần chạy module "Đồng bộ" — gộp cả 3 loại dữ liệu (Danh mục Phí/Học sinh/Hoá đơn) trong
 * cùng 1 lần bấm nút "Đồng bộ". Khác hẳn khái niệm "lưu dữ liệu" ở từng module nhập liệu (chỉ
 * ghi vào localStorage với daDongBo=false, không tạo dòng lịch sử ở đây).
 * Thành công: mọi bản ghi đã tick (soLuongDaChon) được set daDongBo=true.
 * Thất bại: KHÔNG bản ghi nào được set true (rollback toàn bộ, giữ nguyên false để thử lại sau)
 * — soLuongDaChon vẫn ghi lại đúng những gì ĐÃ CHỌN lúc đó (dù không thành) để mở "Chi tiết" xem
 * lại nội dung đã tick và biết cần sửa gì trước khi thử lại. */
export interface DongBoLichSuEntry {
  id: string
  thoiDiem: string
  nguoiThucHien: string
  trangThai: TrangThaiDongBo
  /** Chỉ có giá trị khi trangThai = 'Thất bại' — lý do cụ thể, hiện trong tooltip icon cạnh badge. */
  lyDoThatBai: string | null
  soLuongDaChon: {
    danhMucPhi: number
    hocSinh: number
    hoaDon: number
  }
  /** Snapshot đúng những mã đã được tick chọn trong lần đồng bộ này (dù thành công hay thất
   * bại) — dùng để mở lại "Chi tiết" xem đúng nội dung của lần đó, không phụ thuộc dữ liệu hiện
   * tại (có thể đã đổi khác kể từ lúc đó). */
  chiTietMa: {
    danhMucPhi: string[]
    hocSinh: string[]
    hoaDon: string[]
  }
}
