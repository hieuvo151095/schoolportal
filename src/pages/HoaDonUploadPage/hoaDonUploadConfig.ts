import { getHocSinhByNienKhoa } from '../../storage/hocSinh'
import { saveHoaDonByKy } from '../../storage/hoaDon'
import { getHoSoTruong } from '../../storage/hoSoTruong'
import type { HinhThucThanhToan, HoaDonRow, TrangThaiHoaDon } from '../../types/domain'
import type { UploadEntityConfig, UploadFieldConfig } from '../../upload-engine/types'

const HINH_THUC_THANH_TOAN_LIST: HinhThucThanhToan[] = ['Tiền mặt', 'Chuyển khoản', 'Ví điện tử', 'QR Code']
const TRANG_THAI_LIST: TrangThaiHoaDon[] = ['Đã thanh toán', 'Thanh toán một phần', 'Chưa thanh toán']

/** Enum thật của dashportal không có 'Chưa thanh toán' — map sang 'Đã gửi' khi export JSON. */
const TRANG_THAI_EXPORT_MAP: Record<TrangThaiHoaDon, string> = {
  'Đã thanh toán': 'Đã thanh toán',
  'Thanh toán một phần': 'Thanh toán một phần',
  'Chưa thanh toán': 'Đã gửi',
}

const fields: UploadFieldConfig<HoaDonRow>[] = [
  {
    key: 'soHoaDon',
    columnLabel: 'Mã HĐ',
    type: 'string',
    required: true,
    exampleValues: ['HD00001', 'HD00002'],
  },
  {
    key: 'maHocSinh',
    columnLabel: 'Mã HS',
    type: 'string',
    required: true,
    exampleValues: ['HS0001', 'HS0002'],
    customValidator: (value) => {
      const nienKhoa = getHoSoTruong()?.nienKhoa
      if (!nienKhoa) return 'Chưa có niên khoá hoạt động trong Hồ sơ trường'
      const exists = getHocSinhByNienKhoa(nienKhoa).some((hs) => hs.maHocSinh === value)
      if (!exists) return `Mã học sinh không tồn tại trong danh sách Học sinh đã đồng bộ (niên khoá ${nienKhoa})`
      return null
    },
  },
  {
    key: 'hanThanhToan',
    columnLabel: 'Hạn thanh toán',
    type: 'date',
    required: true,
    exampleValues: ['2026-09-05', '2026-09-05'],
  },
  {
    key: 'soTien',
    columnLabel: 'Số tiền',
    type: 'number',
    required: true,
    min: 0,
    exampleValues: ['500000', '300000'],
  },
  {
    key: 'hinhThucThanhToan',
    columnLabel: 'Hình thức thanh toán',
    type: 'nullable-enum',
    required: false,
    enumValues: HINH_THUC_THANH_TOAN_LIST,
    exampleValues: ['Chuyển khoản', ''],
  },
  {
    key: 'ngayThanhToan',
    columnLabel: 'Ngày thanh toán',
    type: 'date',
    required: false,
    exampleValues: ['2026-09-01', ''],
  },
  {
    key: 'trangThai',
    columnLabel: 'Trạng thái',
    type: 'enum',
    required: true,
    enumValues: TRANG_THAI_LIST,
    exampleValues: ['Đã thanh toán', 'Chưa thanh toán'],
  },
  {
    key: 'daTra',
    columnLabel: 'Số tiền đã trả',
    type: 'number',
    required: false,
    min: 0,
    exampleValues: ['500000', '0'],
    customValidator: (value, row) => {
      if (row.trangThai === 'Thanh toán một phần' && (value === null || value === undefined)) {
        return 'Bắt buộc khi Trạng thái = Thanh toán một phần'
      }
      return null
    },
  },
  {
    key: 'taoBoi',
    columnLabel: 'Tạo bởi',
    type: 'string',
    required: true,
    exampleValues: ['Nguyễn Thị Kế toán', 'Nguyễn Thị Kế toán'],
  },
  {
    key: 'xacNhanBoi',
    columnLabel: 'Xác nhận bởi',
    type: 'string',
    required: false,
    exampleValues: ['Trần Văn Hiệu trưởng', ''],
  },
]

export const hoaDonUploadConfig: UploadEntityConfig<HoaDonRow> = {
  entityKey: 'hoaDon',
  entityLabel: 'Hoá đơn',
  fields,
  uniqueKey: 'soHoaDon',
  contextField: { key: 'ky', label: 'Kỳ' },
  buildRow: (row, ky) => ({
    soHoaDon: row.soHoaDon as string,
    maHocSinh: row.maHocSinh as string,
    ky,
    hanThanhToan: row.hanThanhToan as string,
    soTien: row.soTien as number,
    hinhThucThanhToan: (row.hinhThucThanhToan as HinhThucThanhToan | null) ?? null,
    ngayThanhToan: (row.ngayThanhToan as string | null) ?? null,
    trangThai: row.trangThai as TrangThaiHoaDon,
    daTra: (row.daTra as number | null) ?? 0,
    taoBoi: row.taoBoi as string,
    xacNhanBoi: (row.xacNhanBoi as string) || null,
  }),
  persist: (rows, ky) => saveHoaDonByKy(ky, rows),
  transformForExport: (row) => ({ ...row, trangThai: TRANG_THAI_EXPORT_MAP[row.trangThai] }),
  exportMetadataNote: "Trạng thái 'Chưa thanh toán' được map thành 'Đã gửi' để khớp enum thật của dashportal.",
}
