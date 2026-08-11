import type { DongBoLichSuEntry, HoaDonDongBoResult } from '../types/domain'
import { DEFAULT_KY } from '../utils/ky'

const HOA_DON_MA = Array.from({ length: 10 }, (_, i) => `HD${String(i + 1).padStart(5, '0')}`)

const THANH_CONG: HoaDonDongBoResult = { trangThai: 'Thành công', lyDo: null }

/** Sinh 2 dòng lịch sử mẫu (1 Đã xử lý gộp toàn bộ hoá đơn seed, 1 Đang xử lý minh hoạ badge +
 * tooltip lý do) — mã tham chiếu khớp đúng buildHoaDonSeed() để nút "Chi tiết" mở lại tra cứu ra
 * dữ liệu thật, không rỗng. Dòng 'Đang xử lý' cố tình đặt thoiDiem = hiện tại (không lùi ngày) để
 * còn đủ mới, chưa vượt ngưỡng resolveDongBoDangXuLy() — demo được cả 2 trạng thái ngay lần đầu.
 * Dòng 'Đã xử lý' (10 hoá đơn) cố tình gài 2 hoá đơn "Thất bại" ở cấp hoá đơn (khác trangThai TỔNG
 * đã "Đã xử lý" xong xuôi) — minh hoạ đủ cả 2 lý do "Thất bại": trùng dữ liệu (HD00001) và lỗi hệ
 * thống (HD00006), xem cột "Trạng thái" riêng trong pop-up "Chi tiết lần nộp báo cáo". */
export function buildDongBoLichSuSeed(): DongBoLichSuEntry[] {
  const ky = DEFAULT_KY

  const thoiDiemDaXuLy = new Date()
  thoiDiemDaXuLy.setDate(thoiDiemDaXuLy.getDate() - 10)
  const thoiDiemDangXuLy = new Date()

  const ketQuaMuoiHoaDon: Record<string, HoaDonDongBoResult> = Object.fromEntries(
    HOA_DON_MA.map((ma) => [
      `${ky}::${ma}`,
      ma === 'HD00001'
        ? { trangThai: 'Thất bại', lyDo: 'trung-du-lieu' }
        : ma === 'HD00006'
          ? { trangThai: 'Thất bại', lyDo: 'loi-he-thong' }
          : THANH_CONG,
    ]),
  )

  return [
    {
      id: 'seed-dong-bo-thanh-cong',
      thoiDiem: thoiDiemDaXuLy.toISOString(),
      nguoiThucHien: 'Nguyễn Thị Kế toán',
      trangThai: 'Đã xử lý',
      lyDoThatBai: null,
      soLuongHoaDon: HOA_DON_MA.length,
      maHoaDon: HOA_DON_MA.map((ma) => `${ky}::${ma}`),
      ketQuaHoaDon: ketQuaMuoiHoaDon,
    },
    {
      id: 'seed-dong-bo-that-bai',
      thoiDiem: thoiDiemDangXuLy.toISOString(),
      nguoiThucHien: 'Trần Văn Hiệu phó',
      trangThai: 'Đang xử lý',
      lyDoThatBai: 'Không kết nối được tới hệ thống Sở, vui lòng thử nộp báo cáo lại.',
      soLuongHoaDon: 1,
      maHoaDon: [`${ky}::HD00005`],
      ketQuaHoaDon: { [`${ky}::HD00005`]: { trangThai: 'Thất bại', lyDo: 'loi-he-thong' } },
    },
  ]
}
