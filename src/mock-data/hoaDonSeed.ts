import type { HinhThucThanhToan, HoaDonKhoanPhiRow, HoaDonRow, TrangThaiHoaDon } from '../types/domain'

interface KhoanPhiSpec {
  maPhi: string
  soTien: number
}

interface HoaDonSeedSpec {
  soHoaDon: string
  maHocSinh: string
  hoTenHocSinh: string
  /** 1 hoặc nhiều khoản phí — tổng soTien các khoản phí = soTien của hoá đơn. Mã phí khớp đúng
   * buildDanhMucPhiSeed(). */
  khoanPhi: KhoanPhiSpec[]
  trangThai: TrangThaiHoaDon
  hinhThucThanhToan: HinhThucThanhToan | null
  daTra: number
  /** Số ngày thanh toán trước hạn (5 ngày đầu tháng) — null nếu chưa thanh toán. */
  ngayThanhToanTruocHan: number | null
  taoBoi: string
}

// Đa dạng trạng thái (không đồng loạt 1 giá trị) — tham khảo cách sinh dữ liệu đa dạng ở module
// Thu Học phí bên dashportal. HD00001/HD00004 có nhiều khoản phí để demo popup breakdown, các
// hoá đơn còn lại chỉ 1 khoản phí.
const SPECS: HoaDonSeedSpec[] = [
  {
    soHoaDon: 'HD00001',
    maHocSinh: 'HS0001',
    hoTenHocSinh: 'Nguyễn Văn An',
    khoanPhi: [
      { maPhi: 'KT001', soTien: 100000 },
      { maPhi: 'NK001', soTien: 400000 },
    ],
    trangThai: 'Đã thanh toán',
    hinhThucThanhToan: 'Chuyển khoản',
    daTra: 500000,
    ngayThanhToanTruocHan: 2,
    taoBoi: 'Nguyễn Thị Kế toán',
  },
  {
    soHoaDon: 'HD00002',
    maHocSinh: 'HS0002',
    hoTenHocSinh: 'Trần Thị Bình',
    khoanPhi: [{ maPhi: 'HP001', soTien: 500000 }],
    trangThai: 'Đã thanh toán',
    hinhThucThanhToan: 'Tiền mặt',
    daTra: 500000,
    ngayThanhToanTruocHan: 1,
    taoBoi: 'Nguyễn Thị Kế toán',
  },
  {
    soHoaDon: 'HD00003',
    maHocSinh: 'HS0003',
    hoTenHocSinh: 'Lê Văn Cường',
    khoanPhi: [{ maPhi: 'HP001', soTien: 500000 }],
    trangThai: 'Chưa thanh toán',
    hinhThucThanhToan: null,
    daTra: 0,
    ngayThanhToanTruocHan: null,
    taoBoi: 'Nguyễn Thị Kế toán',
  },
  {
    soHoaDon: 'HD00004',
    maHocSinh: 'HS0004',
    hoTenHocSinh: 'Phạm Thị Dung',
    khoanPhi: [
      { maPhi: 'KT001', soTien: 100000 },
      { maPhi: 'NK001', soTien: 400000 },
    ],
    trangThai: 'Thanh toán một phần',
    hinhThucThanhToan: 'QR Code',
    daTra: 200000,
    ngayThanhToanTruocHan: 3,
    taoBoi: 'Nguyễn Thị Kế toán',
  },
  {
    soHoaDon: 'HD00005',
    maHocSinh: 'HS0005',
    hoTenHocSinh: 'Hoàng Văn Em',
    khoanPhi: [{ maPhi: 'HP001', soTien: 500000 }],
    trangThai: 'Chưa thanh toán',
    hinhThucThanhToan: null,
    daTra: 0,
    ngayThanhToanTruocHan: null,
    taoBoi: 'Nguyễn Thị Kế toán',
  },
  {
    soHoaDon: 'HD00006',
    maHocSinh: 'HS0006',
    hoTenHocSinh: 'Ngô Thị Phương',
    khoanPhi: [{ maPhi: 'BT001', soTien: 300000 }],
    trangThai: 'Đã thanh toán',
    hinhThucThanhToan: 'Ví điện tử',
    daTra: 300000,
    ngayThanhToanTruocHan: 0,
    taoBoi: 'Nguyễn Thị Kế toán',
  },
  {
    soHoaDon: 'HD00007',
    maHocSinh: 'HS0007',
    hoTenHocSinh: 'Đặng Văn Giang',
    khoanPhi: [{ maPhi: 'BT001', soTien: 300000 }],
    trangThai: 'Thanh toán một phần',
    hinhThucThanhToan: 'Tiền mặt',
    daTra: 150000,
    ngayThanhToanTruocHan: 4,
    taoBoi: 'Nguyễn Thị Kế toán',
  },
  {
    soHoaDon: 'HD00008',
    maHocSinh: 'HS0008',
    hoTenHocSinh: 'Bùi Thị Hoa',
    khoanPhi: [{ maPhi: 'HP001', soTien: 500000 }],
    trangThai: 'Đã thanh toán',
    hinhThucThanhToan: 'Chuyển khoản',
    daTra: 500000,
    ngayThanhToanTruocHan: 2,
    taoBoi: 'Nguyễn Thị Kế toán',
  },
  {
    soHoaDon: 'HD00009',
    maHocSinh: 'HS0009',
    hoTenHocSinh: 'Vũ Văn Inh',
    khoanPhi: [{ maPhi: 'HP001', soTien: 500000 }],
    trangThai: 'Chưa thanh toán',
    hinhThucThanhToan: null,
    daTra: 0,
    ngayThanhToanTruocHan: null,
    taoBoi: 'Nguyễn Thị Kế toán',
  },
  {
    soHoaDon: 'HD00010',
    maHocSinh: 'HS0010',
    hoTenHocSinh: 'Đỗ Thị Kim',
    khoanPhi: [{ maPhi: 'HP001', soTien: 500000 }],
    trangThai: 'Đã thanh toán',
    hinhThucThanhToan: 'Tiền mặt',
    daTra: 500000,
    ngayThanhToanTruocHan: 1,
    taoBoi: 'Nguyễn Thị Kế toán',
  },
]

function ngayThanhToanCua(spec: HoaDonSeedSpec, nam: number, thang: number): string | null {
  if (spec.ngayThanhToanTruocHan === null) return null
  const d = new Date(nam, thang - 1, 5 - spec.ngayThanhToanTruocHan)
  return d.toISOString().slice(0, 10)
}

/** Dữ liệu hoá đơn mẫu cố định (deterministic) cho 1 Kỳ "MM/YYYY". Hạn thanh toán cố định ngày
 * 5 mỗi kỳ. soTien = tổng các khoản phí, xem buildHoaDonKhoanPhiSeed(). */
export function buildHoaDonSeed(ky: string): HoaDonRow[] {
  const [thangStr, namStr] = ky.split('/')
  const nam = Number(namStr)
  const thang = Number(thangStr)
  const hanThanhToan = `${namStr}-${thangStr.padStart(2, '0')}-05`

  return SPECS.map((spec) => ({
    soHoaDon: spec.soHoaDon,
    maHocSinh: spec.maHocSinh,
    hoTenHocSinh: spec.hoTenHocSinh,
    ky,
    hanThanhToan,
    soTien: spec.khoanPhi.reduce((sum, kp) => sum + kp.soTien, 0),
    hinhThucThanhToan: spec.hinhThucThanhToan,
    ngayThanhToan: ngayThanhToanCua(spec, nam, thang),
    trangThai: spec.trangThai,
    daTra: spec.daTra,
    taoBoi: spec.taoBoi,
    daDongBo: true,
  }))
}

/** Breakdown khoản phí tương ứng với buildHoaDonSeed(ky) — dùng cho popup "Xem chi tiết". Không
 * phụ thuộc ky vì nội dung khoản phí giống nhau mọi kỳ trong dữ liệu mẫu, chỉ khác nơi lưu trữ. */
export function buildHoaDonKhoanPhiSeed(): HoaDonKhoanPhiRow[] {
  return SPECS.flatMap((spec) =>
    spec.khoanPhi.map((kp) => ({ soHoaDon: spec.soHoaDon, maPhi: kp.maPhi, soTien: kp.soTien })),
  )
}
