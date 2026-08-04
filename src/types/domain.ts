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
}

export interface HocSinhRow {
  maHocSinh: string
  hoTen: string
  lop: string
  khoi: string
  gioiTinh: GioiTinh
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
}

export type LoaiDuLieuDongBo = 'danhMucPhi' | 'hocSinh' | 'hoaDon'

export interface LichSuDongBoEntry {
  id: string
  thoiDiem: string
  loaiDuLieu: LoaiDuLieuDongBo
  nienKhoaHoacKy: string
  soDongThanhCong: number
  /** Số dòng bị phát hiện lỗi và đã xoá khỏi file trong bước review, trước khi đồng bộ —
   * KHÔNG phải dòng lỗi còn sót lại (flow review luôn chặn đồng bộ khi còn lỗi). */
  soDongLoi: number
  tenFileExport: string
  nguoiThucHien: string
}
