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
  /** Niên khoá đang hoạt động — chuẩn đối chiếu khoá ngoại maPhi khi upload Hoá đơn. */
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
  /** Thời điểm dữ liệu này được ghi nhận lần gần nhất (proxy nội bộ — schoolportal chưa có kênh
   * đồng bộ KV thật với dashportal, xem src/types/domain.ts comment đầu file). Hiện ở cột "Ngày
   * cập nhật" của Danh mục thu (thuần xem, không còn CRUD phía trường). */
  ngayCapNhat: string
}

export interface HoaDonRow {
  soHoaDon: string
  maHocSinh: string
  hoTenHocSinh: string
  ky: string
  hanThanhToan: string
  soTien: number
  hinhThucThanhToan: HinhThucThanhToan | null
  ngayThanhToan: string | null
  trangThai: TrangThaiHoaDon
  daTra: number
  taoBoi: string
  /** true = đã được xác nhận qua module "Nộp báo cáo" (gửi lên Sở) — false = mới lưu ở bước nhập
   * liệu, đang chờ. Bảng chính của module vẫn hiện cả 2 trạng thái, chỉ module Nộp báo cáo lọc
   * theo false. */
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
 * gộp lại thành 1 HoaDonRow (soTien = tổng) + nhiều HoaDonKhoanPhiRow, xem hoaDonUploadConfig.ts.
 * Không có `trangThai` — trạng thái thanh toán không còn nhập tay, hệ thống tự tính ở mức hoá đơn
 * (so sánh tổng soTien các dòng cùng soHoaDon với daTra) sau khi gộp, xem groupBySoHoaDon(). */
export interface HoaDonUploadLineRow {
  soHoaDon: string
  maHocSinh: string
  hoTenHocSinh: string
  ky: string
  hanThanhToan: string
  hinhThucThanhToan: HinhThucThanhToan | null
  ngayThanhToan: string | null
  daTra: number
  taoBoi: string
  maPhi: string
  soTien: number
}

export type TrangThaiDongBo = 'Đã xử lý' | 'Đang xử lý'

/** Kết quả đẩy 1 hoá đơn CỤ THỂ lên portal Sở — khác trangThai TỔNG của cả lần nộp báo cáo
 * (DongBoLichSuEntry.trangThai): 1 lần nộp có thể đã "Đã xử lý" xong xuôi nhưng vẫn có vài hoá đơn
 * riêng lẻ "Thất bại" cần xử lý lại, không nhất thiết đồng nhất với trạng thái tổng. */
export type TrangThaiHoaDonDongBo = 'Thành công' | 'Thất bại'

/** Lý do 1 hoá đơn "Thất bại" — phân biệt rõ 2 nguyên nhân để hiện đúng tooltip theo từng dòng,
 * không dùng chung 1 câu chung chung (xem LY_DO_THAT_BAI_HOA_DON_TEXT ở dongBoLogic.ts). */
export type LyDoThatBaiHoaDon = 'trung-du-lieu' | 'loi-he-thong'

export interface HoaDonDongBoResult {
  trangThai: TrangThaiHoaDonDongBo
  /** Chỉ có giá trị khi trangThai = 'Thất bại'. */
  lyDo: LyDoThatBaiHoaDon | null
}

/** 1 lần chạy module "Nộp báo cáo" — chỉ còn đúng 1 loại dữ liệu (Hoá đơn). Khác hẳn khái niệm
 * "lưu dữ liệu" ở module Nhập dữ liệu (chỉ ghi vào localStorage với daDongBo=false, không tạo
 * dòng lịch sử ở đây). Nộp xong luôn khởi tạo 'Đang xử lý' — mọi hoá đơn đã tick (soLuongHoaDon)
 * được set daDongBo=true ngay, nhưng dòng lịch sử tự chuyển 'Đã xử lý' sau 1 khoảng trễ mô phỏng ở
 * lần tải trang kế tiếp (xem resolveDongBoDangXuLy ở storage/dongBoLichSu.ts). */
export interface DongBoLichSuEntry {
  id: string
  thoiDiem: string
  nguoiThucHien: string
  trangThai: TrangThaiDongBo
  /** Lý do đang xử lý/vướng mắc — chỉ có giá trị khi có vướng mắc cụ thể cần nêu, hiện trong
   * tooltip icon cạnh badge 'Đang xử lý'. null nếu đang xử lý bình thường (chưa gặp vấn đề) hoặc
   * đã xử lý xong. */
  lyDoThatBai: string | null
  soLuongHoaDon: number
  /** Snapshot đúng các Mã HĐ đã được tick chọn trong lần nộp báo cáo này — dùng để mở lại "Chi
   * tiết" xem đúng nội dung của lần đó, không phụ thuộc dữ liệu hiện tại (có thể đã đổi khác kể
   * từ lúc đó). */
  maHoaDon: string[]
  /** Kết quả đẩy lên portal Sở của TỪNG hoá đơn trong maHoaDon — key = hoaDonId (`${ky}::${soHoaDon}`,
   * xem dongBoLogic.ts). Hiện ở cột "Trạng thái" riêng trong bảng hoá đơn của pop-up "Chi tiết lần
   * nộp báo cáo", KHÁC với badge trangThai tổng ở trên. */
  ketQuaHoaDon: Record<string, HoaDonDongBoResult>
}
