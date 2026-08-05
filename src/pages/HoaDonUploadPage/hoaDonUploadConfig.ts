import { getDanhMucPhiByNienKhoa } from '../../storage/danhMucPhi'
import { getHocSinhByNienKhoa } from '../../storage/hocSinh'
import { getHoaDonByKy, saveHoaDonByKy } from '../../storage/hoaDon'
import { saveHoaDonKhoanPhiByKy } from '../../storage/hoaDonKhoanPhi'
import { getHoSoTruong } from '../../storage/hoSoTruong'
import type { HinhThucThanhToan, HoaDonKhoanPhiRow, HoaDonRow, HoaDonUploadLineRow, TrangThaiHoaDon } from '../../types/domain'
import type { UploadEntityConfig, UploadFieldConfig } from '../../upload-engine/types'
import { getKyOptions } from '../../utils/ky'

const KY_OPTIONS = getKyOptions()

const HINH_THUC_THANH_TOAN_LIST: HinhThucThanhToan[] = ['Tiền mặt', 'Chuyển khoản', 'Ví điện tử', 'QR Code']
const TRANG_THAI_LIST: TrangThaiHoaDon[] = ['Đã thanh toán', 'Thanh toán một phần', 'Chưa thanh toán']

/** Enum thật của dashportal không có 'Chưa thanh toán' — map sang 'Đã gửi' khi export JSON. */
const TRANG_THAI_EXPORT_MAP: Record<TrangThaiHoaDon, string> = {
  'Đã thanh toán': 'Đã thanh toán',
  'Thanh toán một phần': 'Thanh toán một phần',
  'Chưa thanh toán': 'Đã gửi',
}

const fields: UploadFieldConfig<HoaDonUploadLineRow>[] = [
  {
    key: 'soHoaDon',
    columnLabel: 'Mã HĐ',
    type: 'string',
    required: true,
    exampleValues: ['HD00001', 'HD00001'],
  },
  {
    key: 'maHocSinh',
    columnLabel: 'Mã HS',
    type: 'string',
    required: true,
    exampleValues: ['HS0001', 'HS0001'],
    crossRef: { entityLabel: 'Học sinh', route: '/hoc-sinh' },
    customValidator: (value) => {
      const nienKhoa = getHoSoTruong()?.nienKhoa
      if (!nienKhoa) return 'Chưa có niên khoá hoạt động trong Hồ sơ trường'
      const exists = getHocSinhByNienKhoa(nienKhoa).some((hs) => hs.maHocSinh === value)
      if (!exists) return `Mã học sinh không tồn tại trong danh sách Học sinh đã đồng bộ (niên khoá ${nienKhoa})`
      return null
    },
  },
  {
    key: 'ky',
    columnLabel: 'Kỳ',
    type: 'enum',
    required: true,
    enumValues: KY_OPTIONS,
    exampleValues: [KY_OPTIONS[KY_OPTIONS.length - 1], KY_OPTIONS[KY_OPTIONS.length - 1]],
  },
  {
    key: 'hanThanhToan',
    columnLabel: 'Hạn thanh toán',
    type: 'date',
    required: true,
    exampleValues: ['2026-09-05', '2026-09-05'],
  },
  {
    key: 'hinhThucThanhToan',
    columnLabel: 'Hình thức thanh toán',
    type: 'nullable-enum',
    required: false,
    enumValues: HINH_THUC_THANH_TOAN_LIST,
    exampleValues: ['Chuyển khoản', 'Chuyển khoản'],
  },
  {
    key: 'ngayThanhToan',
    columnLabel: 'Ngày thanh toán',
    type: 'date',
    required: false,
    exampleValues: ['2026-09-01', '2026-09-01'],
  },
  {
    key: 'trangThai',
    columnLabel: 'Trạng thái',
    type: 'enum',
    required: true,
    enumValues: TRANG_THAI_LIST,
    exampleValues: ['Đã thanh toán', 'Đã thanh toán'],
  },
  {
    key: 'daTra',
    columnLabel: 'Số tiền đã trả',
    type: 'number',
    required: false,
    min: 0,
    exampleValues: ['500000', '500000'],
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
    exampleValues: ['Trần Văn Hiệu trưởng', 'Trần Văn Hiệu trưởng'],
  },
  {
    key: 'maPhi',
    columnLabel: 'Mã phí',
    type: 'string',
    required: true,
    exampleValues: ['HP001', 'BT001'],
    crossRef: { entityLabel: 'Danh mục Phí', route: '/danh-muc-phi' },
    customValidator: (value) => {
      const nienKhoa = getHoSoTruong()?.nienKhoa
      if (!nienKhoa) return 'Chưa có niên khoá hoạt động trong Hồ sơ trường'
      const exists = getDanhMucPhiByNienKhoa(nienKhoa).some((kp) => kp.maPhi === value)
      if (!exists) return `Mã phí không tồn tại trong Danh mục Phí đã đồng bộ (niên khoá ${nienKhoa})`
      return null
    },
  },
  {
    key: 'soTien',
    columnLabel: 'Số tiền khoản phí',
    type: 'number',
    required: true,
    min: 0,
    exampleValues: ['500000', '300000'],
  },
]

/** Gộp các dòng file (1 dòng = 1 cặp Hoá đơn+Khoản phí) theo Mã HĐ — trả về hoá đơn (soTien =
 * tổng các khoản phí) + danh sách khoản phí phẳng, dùng khi lưu và khi export JSON. */
function groupBySoHoaDon(lines: HoaDonUploadLineRow[]): { hoaDon: HoaDonRow[]; khoanPhi: HoaDonKhoanPhiRow[] } {
  const hoaDonMap = new Map<string, HoaDonRow>()
  const khoanPhi: HoaDonKhoanPhiRow[] = []

  for (const line of lines) {
    khoanPhi.push({ soHoaDon: line.soHoaDon, maPhi: line.maPhi, soTien: line.soTien })

    const existing = hoaDonMap.get(line.soHoaDon)
    if (existing) {
      existing.soTien += line.soTien
      continue
    }
    hoaDonMap.set(line.soHoaDon, {
      soHoaDon: line.soHoaDon,
      maHocSinh: line.maHocSinh,
      ky: line.ky,
      hanThanhToan: line.hanThanhToan,
      soTien: line.soTien,
      hinhThucThanhToan: line.hinhThucThanhToan,
      ngayThanhToan: line.ngayThanhToan,
      trangThai: line.trangThai,
      daTra: line.daTra,
      taoBoi: line.taoBoi,
      xacNhanBoi: line.xacNhanBoi,
    })
  }

  return { hoaDon: Array.from(hoaDonMap.values()), khoanPhi }
}

export const hoaDonUploadConfig: UploadEntityConfig<HoaDonUploadLineRow> = {
  entityKey: 'hoaDon',
  entityLabel: 'Hoá đơn',
  fields,
  uniqueKey: ['soHoaDon', 'maPhi'],
  existingDataCheck: { key: 'soHoaDon', getExistingRows: (ky) => getHoaDonByKy(ky) },
  groupConsistencyCheck: {
    groupKey: 'soHoaDon',
    fields: ['maHocSinh', 'hanThanhToan', 'hinhThucThanhToan', 'ngayThanhToan', 'trangThai', 'daTra', 'taoBoi', 'xacNhanBoi'],
  },
  contextField: { key: 'ky', label: 'Kỳ' },
  buildRow: (row, ky) => ({
    soHoaDon: row.soHoaDon as string,
    maHocSinh: row.maHocSinh as string,
    ky,
    hanThanhToan: row.hanThanhToan as string,
    hinhThucThanhToan: (row.hinhThucThanhToan as HinhThucThanhToan | null) ?? null,
    ngayThanhToan: (row.ngayThanhToan as string | null) ?? null,
    trangThai: row.trangThai as TrangThaiHoaDon,
    daTra: (row.daTra as number | null) ?? 0,
    taoBoi: row.taoBoi as string,
    xacNhanBoi: (row.xacNhanBoi as string) || null,
    maPhi: row.maPhi as string,
    soTien: row.soTien as number,
  }),
  persist: (rows, ky) => {
    const { hoaDon, khoanPhi } = groupBySoHoaDon(rows)
    saveHoaDonByKy(ky, hoaDon)
    saveHoaDonKhoanPhiByKy(ky, khoanPhi)
  },
  countSuccessRows: (rows) => new Set(rows.map((r) => r.soHoaDon)).size,
  transformForExport: (row) => ({ ...row, trangThai: TRANG_THAI_EXPORT_MAP[row.trangThai] }),
  exportMetadataNote: "Trạng thái 'Chưa thanh toán' được map thành 'Đã gửi' để khớp enum thật của dashportal.",
}
