import type { DongBoLichSuEntry } from '../types/domain'
import { DEFAULT_KY } from '../utils/ky'
import { getCurrentNienKhoa } from '../utils/nienKhoa'

const DANH_MUC_PHI_MA = ['HP001', 'BT001', 'DD001', 'BH001', 'DP001', 'NK001', 'NK002', 'KT001', 'HP002', 'BT002']
const HOC_SINH_MA = Array.from({ length: 10 }, (_, i) => `HS${String(i + 1).padStart(4, '0')}`)
const HOA_DON_MA = Array.from({ length: 10 }, (_, i) => `HD${String(i + 1).padStart(5, '0')}`)

/** Sinh 2 dòng lịch sử mẫu (1 Thành công gộp toàn bộ dữ liệu seed, 1 Thất bại minh hoạ badge +
 * tooltip lý do) — mã tham chiếu khớp đúng buildDanhMucPhiSeed/buildHocSinhSeed/buildHoaDonSeed
 * để nút "Chi tiết" mở lại tra cứu ra dữ liệu thật, không rỗng. */
export function buildDongBoLichSuSeed(): DongBoLichSuEntry[] {
  const nienKhoa = getCurrentNienKhoa()
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
      soLuongDaChon: {
        danhMucPhi: DANH_MUC_PHI_MA.length,
        hocSinh: HOC_SINH_MA.length,
        hoaDon: HOA_DON_MA.length,
      },
      chiTietMa: {
        danhMucPhi: DANH_MUC_PHI_MA.map((ma) => `${nienKhoa}::${ma}`),
        hocSinh: HOC_SINH_MA.map((ma) => `${nienKhoa}::${ma}`),
        hoaDon: HOA_DON_MA.map((ma) => `${ky}::${ma}`),
      },
    },
    {
      id: 'seed-dong-bo-that-bai',
      thoiDiem: thoiDiemThatBai.toISOString(),
      nguoiThucHien: 'Trần Văn Hiệu phó',
      trangThai: 'Thất bại',
      lyDoThatBai: "1 hoá đơn tham chiếu Mã HS/Mã phí chưa được đồng bộ: HD00005 (Mã phí XX999).",
      soLuongDaChon: { danhMucPhi: 0, hocSinh: 0, hoaDon: 1 },
      chiTietMa: {
        danhMucPhi: [],
        hocSinh: [],
        hoaDon: [`${ky}::HD00005`],
      },
    },
  ]
}
