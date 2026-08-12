import { findHocSinh } from '../../mock-data/hocSinhSeed'
import { getDanhMucPhiByNienKhoa } from '../../storage/danhMucPhi'
import { getHoaDonByKy, saveHoaDonByKy } from '../../storage/hoaDon'
import { getHoaDonKhoanPhiBySoHoaDon, saveHoaDonKhoanPhiByKy } from '../../storage/hoaDonKhoanPhi'
import { getHoSoTruong } from '../../storage/hoSoTruong'
import type { HinhThucThanhToan, HoaDonKhoanPhiRow, HoaDonRow, HoaDonUploadLineRow, TrangThaiHoaDon } from '../../types/domain'
import type { UploadEntityConfig, UploadFieldConfig } from '../../upload-engine/types'
import { computeTrangThaiKhoanThu } from '../../utils/danhMucThu'
import { formatCurrency } from '../../utils/date'
import { computeTrangThaiHoaDon } from '../../utils/hoaDon'
import { getKyOptions } from '../../utils/ky'

const KY_OPTIONS = getKyOptions()

const HINH_THUC_THANH_TOAN_LIST: HinhThucThanhToan[] = ['Tiền mặt', 'Chuyển khoản', 'Ví điện tử', 'QR Code']

/** So Số tiền đã trả với TỔNG Số tiền khoản phí của cùng 1 hoá đơn (mọi dòng cùng soHoaDon trong
 * `allRows`, chỉ tính trong phạm vi file đang upload — nếu hoá đơn trùng Mã HĐ với dữ liệu cũ,
 * cộng dồn với Số tiền đã trả CŨ diễn ra sau, lúc merge, xem existingDataCheck bên dưới +
 * storage/hoaDon.ts finalizeHoaDonMerge) — dùng để tự tính Trạng thái thanh toán. */
function tongSoTienCungHoaDon(soHoaDon: string, allRows: Record<string, unknown>[]): number {
  return allRows
    .filter((r) => r.soHoaDon === soHoaDon)
    .reduce((sum, r) => sum + (typeof r.soTien === 'number' ? r.soTien : 0), 0)
}

const fields: UploadFieldConfig<HoaDonUploadLineRow>[] = [
  {
    key: 'maPhi',
    columnLabel: 'Mã phí',
    type: 'string',
    required: true,
    exampleValues: ['HP001', 'BT001'],
    crossRef: { entityLabel: 'Danh mục thu', route: '/danh-muc-phi' },
    // Chặn cả Mã phí không tồn tại LẪN Mã phí đã Ngưng hoạt động (yêu cầu II.1) — trước đây chỉ
    // kiểm tra tồn tại, không chặn Mã phí Ngưng hoạt động khi upload file (chỉ chặn ở combobox
    // "Thêm mới" qua comboboxOptions.disabled bên dưới).
    customValidator: (value) => {
      const nienKhoa = getHoSoTruong()?.nienKhoa
      if (!nienKhoa) return 'Chưa có niên khoá hoạt động trong Hồ sơ trường'
      const khoanPhi = getDanhMucPhiByNienKhoa(nienKhoa).find((kp) => kp.maPhi === value)
      if (!khoanPhi) return 'Mã phí chưa tồn tại trong Danh mục thu'
      if (computeTrangThaiKhoanThu(khoanPhi) === 'Ngưng hoạt động') return 'Mã phí đã Ngưng hoạt động, không thể dùng để tạo hoá đơn mới'
      return null
    },
    /** Ngưng hoạt động vẫn hiện trong danh sách nhưng disabled — không cho chọn (yêu cầu I.2). */
    comboboxOptions: () => {
      const nienKhoa = getHoSoTruong()?.nienKhoa
      if (!nienKhoa) return []
      return getDanhMucPhiByNienKhoa(nienKhoa).map((kp) => ({
        value: kp.maPhi,
        disabled: computeTrangThaiKhoanThu(kp) === 'Ngưng hoạt động',
      }))
    },
  },
  {
    key: 'soHoaDon',
    columnLabel: 'Mã HĐ',
    type: 'string',
    required: true,
    exampleValues: ['HD00001', 'HD00001'],
  },
  {
    key: 'maHocSinh',
    columnLabel: 'Mã học sinh',
    type: 'string',
    required: true,
    exampleValues: ['HS0001', 'HS0001'],
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
    // Không bắt buộc tuyệt đối — hoá đơn Chưa thanh toán (Số tiền đã trả = 0) hợp lệ không có
    // Hình thức thanh toán. Chỉ bắt buộc khi Số tiền đã trả > 0 (yêu cầu II.1), xem customValidator.
    required: false,
    enumValues: HINH_THUC_THANH_TOAN_LIST,
    exampleValues: ['Chuyển khoản', 'Chuyển khoản'],
    customValidator: (value, row) => {
      const daTra = row.daTra as number | null
      if (daTra !== null && daTra > 0 && value === null) return 'Không được để trống khi Số tiền đã trả > 0'
      return null
    },
  },
  {
    key: 'ngayThanhToan',
    columnLabel: 'Ngày thanh toán',
    type: 'date',
    // Tương tự Hình thức thanh toán — chỉ bắt buộc khi Số tiền đã trả > 0.
    required: false,
    exampleValues: ['2026-09-01', '2026-09-01'],
    customValidator: (value, row) => {
      const daTra = row.daTra as number | null
      if (daTra !== null && daTra > 0 && value === null) return 'Không được để trống khi Số tiền đã trả > 0'
      return null
    },
  },
  {
    key: 'daTra',
    columnLabel: 'Số tiền đã trả',
    type: 'number',
    required: true,
    min: 0,
    exampleValues: ['500000', '500000'],
    /** Không được vượt quá TỔNG Số tiền khoản phí của cùng hoá đơn — lỗi dữ liệu, chặn ngay từ
     * bước validate file/form (yêu cầu II.1), không chờ tới lúc lưu. */
    customValidator: (value, row, allRows) => {
      const daTra = value as number | null
      if (daTra === null) return null
      const soHoaDon = row.soHoaDon
      if (typeof soHoaDon !== 'string' || !soHoaDon) return null
      const tongSoTien = tongSoTienCungHoaDon(soHoaDon, allRows)
      if (daTra > tongSoTien) {
        return `Số tiền đã trả (${formatCurrency(daTra)}) không được lớn hơn tổng Số tiền khoản phí của hoá đơn (${formatCurrency(tongSoTien)})`
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
    key: 'soTien',
    columnLabel: 'Số tiền khoản phí',
    type: 'number',
    required: true,
    min: 0,
    exampleValues: ['500000', '300000'],
  },
  {
    key: 'hoTenHocSinh',
    columnLabel: 'Tên học sinh',
    type: 'string',
    required: true,
    exampleValues: ['Nguyễn Văn An', 'Nguyễn Văn An'],
    /** CHỈ tham chiếu ở form Thêm mới — tự điền theo Mã học sinh, không gõ tay (yêu cầu II.3). Ở
     * file Excel vẫn là 1 cột bình thường để đối chiếu hoá đơn đúng học sinh, nhưng giá trị THẬT
     * dùng khi lưu do buildRow tự map lại từ Mã học sinh, xem bên dưới. */
    derivedDisplay: {
      sourceKey: 'maHocSinh',
      resolve: (maHocSinh) => findHocSinh(maHocSinh)?.hoTenHocSinh ?? null,
      notFoundLabel: 'Không tìm thấy học sinh — kiểm tra lại Mã học sinh',
    },
  },
]

/** Gộp các dòng file (1 dòng = 1 cặp Hoá đơn+Khoản phí) theo Mã HĐ — trả về hoá đơn (soTien =
 * tổng các khoản phí, trangThai tự tính từ soTien/daTra sau khi cộng đủ) + danh sách khoản phí
 * phẳng, dùng khi lưu. */
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
      hoTenHocSinh: line.hoTenHocSinh,
      ky: line.ky,
      hanThanhToan: line.hanThanhToan,
      soTien: line.soTien,
      hinhThucThanhToan: line.hinhThucThanhToan,
      ngayThanhToan: line.ngayThanhToan,
      trangThai: 'Chưa thanh toán', // đặt tạm, tính lại đúng ở vòng lặp cuối khi soTien đã cộng đủ
      daTra: line.daTra,
      taoBoi: line.taoBoi,
      daDongBo: false,
    })
  }

  for (const hoaDon of hoaDonMap.values()) {
    hoaDon.trangThai = computeTrangThaiHoaDon(hoaDon.soTien, hoaDon.daTra)
  }

  return { hoaDon: Array.from(hoaDonMap.values()), khoanPhi }
}

export const hoaDonUploadConfig: UploadEntityConfig<HoaDonUploadLineRow> = {
  entityKey: 'hoaDon',
  entityLabel: 'Hoá đơn',
  fields,
  uniqueKey: ['soHoaDon', 'maPhi'],
  existingDataCheck: {
    key: 'soHoaDon',
    // HoaDonRow (shape thật) không khớp tĩnh với Record<string, unknown> (không có index
    // signature) — ép kiểu unknown trước, resolve() bên dưới tự cast lại field cụ thể cần dùng.
    getExistingRows: (ky) => getHoaDonByKy(ky) as unknown as Record<string, unknown>[],
    // Mã HĐ trùng dữ liệu cũ (yêu cầu II.2/III):
    // - Hoá đơn cũ đã "Đã thanh toán" đủ → vẫn CHẶN (lỗi), không cho cập nhật thêm (III.3).
    // - Hoá đơn cũ "Thanh toán một phần"/"Chưa thanh toán" → chỉ CẢNH BÁO, cho phép lưu — dữ liệu
    //   mới ghi đè ngay dòng cũ (storage/hoaDon.ts saveHoaDonByKy), Số tiền đã trả CŨ (nếu có)
    //   được cộng dồn sau khi báo cáo "Đã xử lý" (finalizeHoaDonMerge, xem III.1/III.2).
    resolve: ({ value, existingRow, contextValue }) => {
      const trangThaiCu = existingRow.trangThai as TrangThaiHoaDon
      if (trangThaiCu === 'Đã thanh toán') {
        return {
          severity: 'error',
          message: `Mã HĐ '${value}' đã tồn tại và đã thanh toán đủ (Kỳ ${contextValue}) — không thể lưu thêm dữ liệu trùng Mã HĐ này.`,
        }
      }
      const maThuCu = getHoaDonKhoanPhiBySoHoaDon(contextValue, value).map((kp) => kp.maPhi)
      return {
        severity: 'warning',
        message: `Hoá đơn kỳ ${contextValue} - ${value} của học sinh ${existingRow.maHocSinh as string} với các mã thu [${maThuCu.join(', ')}] đã tồn tại. Nếu bạn tiếp tục, dữ liệu mới sẽ được cập nhật vào dòng này.`,
      }
    },
  },
  groupConsistencyCheck: {
    groupKey: 'soHoaDon',
    fields: ['maHocSinh', 'hoTenHocSinh', 'hanThanhToan', 'hinhThucThanhToan', 'ngayThanhToan', 'daTra', 'taoBoi'],
  },
  contextField: { key: 'ky', label: 'Kỳ' },
  buildRow: (row, ky) => ({
    soHoaDon: row.soHoaDon as string,
    maHocSinh: row.maHocSinh as string,
    // Giá trị THẬT map lại từ Mã học sinh — cột "Tên học sinh" trong file/form chỉ tham chiếu,
    // không phải nguồn dữ liệu chính (yêu cầu II.3). Không tìm thấy thì tạm giữ giá trị đã nhập.
    hoTenHocSinh: findHocSinh(row.maHocSinh as string)?.hoTenHocSinh ?? (row.hoTenHocSinh as string),
    ky,
    hanThanhToan: row.hanThanhToan as string,
    hinhThucThanhToan: (row.hinhThucThanhToan as HinhThucThanhToan | null) ?? null,
    ngayThanhToan: (row.ngayThanhToan as string | null) ?? null,
    daTra: (row.daTra as number | null) ?? 0,
    taoBoi: row.taoBoi as string,
    maPhi: row.maPhi as string,
    soTien: row.soTien as number,
  }),
  persist: (rows, ky) => {
    const { hoaDon, khoanPhi } = groupBySoHoaDon(rows)
    saveHoaDonByKy(ky, hoaDon)
    saveHoaDonKhoanPhiByKy(ky, khoanPhi)
  },
  countSuccessRows: (rows) => new Set(rows.map((r) => r.soHoaDon)).size,
}
