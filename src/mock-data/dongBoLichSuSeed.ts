import type { DongBoLichSuEntry } from '../types/domain'
import { DEFAULT_KY } from '../utils/ky'

const HOA_DON_MA = Array.from({ length: 10 }, (_, i) => `HD${String(i + 1).padStart(5, '0')}`)

/** Sinh 2 dòng lịch sử mẫu (1 Thành công gộp toàn bộ hoá đơn seed, 1 Thất bại minh hoạ badge +
 * tooltip lý do) — mã tham chiếu khớp đúng buildHoaDonSeed() để nút "Chi tiết" mở lại tra cứu ra
 * dữ liệu thật, không rỗng. */
export function buildDongBoLichSuSeed(): DongBoLichSuEntry[] {
  const ky = DEFAULT_KY

  const thoiDiemThanhCong = new Date()
  thoiDiemThanhCong.setDate(thoiDiemThanhCong.getDate() - 10)
  const thoiDiemThatBai = new Date()
  thoiDiemThatBai.setDate(thoiDiemThatBai.getDate() - 3)

  return [
    {
      id: 'seed-dong-bo-thanh-cong',
      thoiDiem: thoiDiemThanhCong.toISOString(),
      nguoiThucHien: 'Nguyễn Thị Kế toán',
      trangThai: 'Thành công',
      lyDoThatBai: null,
      soLuongHoaDon: HOA_DON_MA.length,
      maHoaDon: HOA_DON_MA.map((ma) => `${ky}::${ma}`),
    },
    {
      id: 'seed-dong-bo-that-bai',
      thoiDiem: thoiDiemThatBai.toISOString(),
      nguoiThucHien: 'Trần Văn Hiệu phó',
      trangThai: 'Thất bại',
      lyDoThatBai: 'Không kết nối được tới hệ thống Sở, vui lòng thử nộp báo cáo lại.',
      soLuongHoaDon: 1,
      maHoaDon: [`${ky}::HD00005`],
    },
  ]
}
