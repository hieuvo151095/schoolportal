import type { HinhThucThanhToan, HoaDonRow, TrangThaiHoaDon } from '../types/domain'

interface HoaDonSeedSpec {
  soHoaDon: string
  maHocSinh: string
  soTien: number
  trangThai: TrangThaiHoaDon
  hinhThucThanhToan: HinhThucThanhToan | null
  daTra: number
  /** Số ngày thanh toán trước hạn (5 ngày đầu tháng) — null nếu chưa thanh toán. */
  ngayThanhToanTruocHan: number | null
  taoBoi: string
  xacNhanBoi: string | null
}

// Đa dạng trạng thái (không đồng loạt 1 giá trị), mã HS khớp đúng buildHocSinhSeed() —
// tham khảo cách sinh dữ liệu đa dạng ở module Thu Học phí bên dashportal.
const SPECS: HoaDonSeedSpec[] = [
  {
    soHoaDon: 'HD00001',
    maHocSinh: 'HS0001',
    soTien: 500000,
    trangThai: 'Đã thanh toán',
    hinhThucThanhToan: 'Chuyển khoản',
    daTra: 500000,
    ngayThanhToanTruocHan: 2,
    taoBoi: 'Nguyễn Thị Kế toán',
    xacNhanBoi: 'Trần Văn Hiệu phó',
  },
  {
    soHoaDon: 'HD00002',
    maHocSinh: 'HS0002',
    soTien: 500000,
    trangThai: 'Đã thanh toán',
    hinhThucThanhToan: 'Tiền mặt',
    daTra: 500000,
    ngayThanhToanTruocHan: 1,
    taoBoi: 'Nguyễn Thị Kế toán',
    xacNhanBoi: 'Trần Văn Hiệu phó',
  },
  {
    soHoaDon: 'HD00003',
    maHocSinh: 'HS0003',
    soTien: 500000,
    trangThai: 'Chưa thanh toán',
    hinhThucThanhToan: null,
    daTra: 0,
    ngayThanhToanTruocHan: null,
    taoBoi: 'Nguyễn Thị Kế toán',
    xacNhanBoi: null,
  },
  {
    soHoaDon: 'HD00004',
    maHocSinh: 'HS0004',
    soTien: 500000,
    trangThai: 'Thanh toán một phần',
    hinhThucThanhToan: 'QR Code',
    daTra: 200000,
    ngayThanhToanTruocHan: 3,
    taoBoi: 'Nguyễn Thị Kế toán',
    xacNhanBoi: null,
  },
  {
    soHoaDon: 'HD00005',
    maHocSinh: 'HS0005',
    soTien: 500000,
    trangThai: 'Chưa thanh toán',
    hinhThucThanhToan: null,
    daTra: 0,
    ngayThanhToanTruocHan: null,
    taoBoi: 'Nguyễn Thị Kế toán',
    xacNhanBoi: null,
  },
  {
    soHoaDon: 'HD00006',
    maHocSinh: 'HS0006',
    soTien: 300000,
    trangThai: 'Đã thanh toán',
    hinhThucThanhToan: 'Ví điện tử',
    daTra: 300000,
    ngayThanhToanTruocHan: 0,
    taoBoi: 'Nguyễn Thị Kế toán',
    xacNhanBoi: 'Trần Văn Hiệu phó',
  },
  {
    soHoaDon: 'HD00007',
    maHocSinh: 'HS0007',
    soTien: 300000,
    trangThai: 'Thanh toán một phần',
    hinhThucThanhToan: 'Tiền mặt',
    daTra: 150000,
    ngayThanhToanTruocHan: 4,
    taoBoi: 'Nguyễn Thị Kế toán',
    xacNhanBoi: null,
  },
  {
    soHoaDon: 'HD00008',
    maHocSinh: 'HS0008',
    soTien: 500000,
    trangThai: 'Đã thanh toán',
    hinhThucThanhToan: 'Chuyển khoản',
    daTra: 500000,
    ngayThanhToanTruocHan: 2,
    taoBoi: 'Nguyễn Thị Kế toán',
    xacNhanBoi: 'Trần Văn Hiệu phó',
  },
  {
    soHoaDon: 'HD00009',
    maHocSinh: 'HS0009',
    soTien: 500000,
    trangThai: 'Chưa thanh toán',
    hinhThucThanhToan: null,
    daTra: 0,
    ngayThanhToanTruocHan: null,
    taoBoi: 'Nguyễn Thị Kế toán',
    xacNhanBoi: null,
  },
  {
    soHoaDon: 'HD00010',
    maHocSinh: 'HS0010',
    soTien: 500000,
    trangThai: 'Đã thanh toán',
    hinhThucThanhToan: 'Tiền mặt',
    daTra: 500000,
    ngayThanhToanTruocHan: 1,
    taoBoi: 'Nguyễn Thị Kế toán',
    xacNhanBoi: 'Trần Văn Hiệu phó',
  },
]

/** Dữ liệu hoá đơn mẫu cố định (deterministic) cho 1 Kỳ "MM/YYYY" — mã HS khớp đúng
 * buildHocSinhSeed() để không vi phạm khoá ngoại. Hạn thanh toán cố định ngày 5 mỗi kỳ. */
export function buildHoaDonSeed(ky: string): HoaDonRow[] {
  const [thangStr, namStr] = ky.split('/')
  const nam = Number(namStr)
  const thang = Number(thangStr)
  const hanThanhToan = `${namStr}-${thangStr.padStart(2, '0')}-05`

  return SPECS.map((spec) => {
    let ngayThanhToan: string | null = null
    if (spec.ngayThanhToanTruocHan !== null) {
      const d = new Date(nam, thang - 1, 5 - spec.ngayThanhToanTruocHan)
      ngayThanhToan = d.toISOString().slice(0, 10)
    }
    return {
      soHoaDon: spec.soHoaDon,
      maHocSinh: spec.maHocSinh,
      ky,
      hanThanhToan,
      soTien: spec.soTien,
      hinhThucThanhToan: spec.hinhThucThanhToan,
      ngayThanhToan,
      trangThai: spec.trangThai,
      daTra: spec.daTra,
      taoBoi: spec.taoBoi,
      xacNhanBoi: spec.xacNhanBoi,
    }
  })
}
