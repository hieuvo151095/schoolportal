// Công thức khớp đúng quy tắc "hạn đồng bộ" thật của dashportal (src/utils/dongBo.ts):
// hạn chót đồng bộ dữ liệu của 1 Kỳ = ngày 7 tháng kế tiếp kỳ đó (vd kỳ 07/2026 -> hạn 07/08/2026).
export function hanChotDongBoCuaKy(ky: string): Date {
  const [thangStr, namStr] = ky.split('/')
  // Date(năm, tháng, ngày) coi tham số tháng là 0-based — truyền thẳng số tháng 1-based của kỳ
  // vào đúng bằng chỉ số 0-based của tháng KẾ TIẾP, khỏi phải +1 rồi xử lý tràn năm thủ công.
  return new Date(Number(namStr), Number(thangStr), 7)
}

const MS_MOT_NGAY = 24 * 60 * 60 * 1000

/** Số ngày còn lại tới hạn đồng bộ của 1 Kỳ, tính từ hôm nay — dương nếu còn hạn, âm nếu đã
 * quá hạn. Khác với `soNgayTreCuaTruong` của dashportal (so ngày đồng bộ thật với hạn) — hàm
 * này so hôm nay với hạn, dùng để nhắc nhở trước khi đồng bộ, không phải chấm điểm sau khi đã
 * đồng bộ. */
export function soNgayConLaiToiHan(ky: string): number {
  const hanChot = hanChotDongBoCuaKy(ky)
  const homNay = new Date()
  homNay.setHours(0, 0, 0, 0)
  hanChot.setHours(0, 0, 0, 0)
  return Math.round((hanChot.getTime() - homNay.getTime()) / MS_MOT_NGAY)
}
