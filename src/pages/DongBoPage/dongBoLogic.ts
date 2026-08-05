import { getDanhMucPhiByMa, getDanhMucPhiChoDongBo, getDanhMucPhiStore, markDanhMucPhiDaDongBo } from '../../storage/danhMucPhi'
import { appendDongBoLichSu } from '../../storage/dongBoLichSu'
import { getHoaDonChoDongBo, getHoaDonStore, markHoaDonDaDongBo } from '../../storage/hoaDon'
import { getHoaDonKhoanPhiBySoHoaDon } from '../../storage/hoaDonKhoanPhi'
import { getHocSinhByMa, getHocSinhChoDongBo, getHocSinhStore, markHocSinhDaDongBo } from '../../storage/hocSinh'
import type { DongBoLichSuEntry, HoaDonRow, HocSinhRow, KhoanPhiRow } from '../../types/domain'

/** ID ổn định cho 1 dòng trong bảng chọn đồng bộ / khoá tra cứu trong lịch sử — ghép niên
 * khoá/kỳ vì Mã Phí/Mã HS/Mã HĐ chỉ đảm bảo duy nhất TRONG PHẠM VI 1 niên khoá hoặc 1 kỳ, không
 * phải toàn cục (vd Mã Phí "HP001" có thể lặp lại ở nhiều niên khoá khác nhau). */
export function danhMucPhiId(row: KhoanPhiRow): string {
  return `${row.nienKhoa}::${row.maPhi}`
}
export function hocSinhId(row: HocSinhRow): string {
  return `${row.nienKhoa}::${row.maHocSinh}`
}
export function hoaDonId(row: HoaDonRow): string {
  return `${row.ky}::${row.soHoaDon}`
}

export interface PendingData {
  danhMucPhi: KhoanPhiRow[]
  hocSinh: HocSinhRow[]
  hoaDon: HoaDonRow[]
}

/** Toàn bộ bản ghi daDongBo=false của cả 3 loại — nguồn dữ liệu cho Nhóm 1 + Nhóm 2 của pop-up
 * "Đồng bộ dữ liệu" (chế độ tạo mới, khác chế độ xem lại "Chi tiết" 1 lần đã qua). */
export function getPendingData(): PendingData {
  return {
    danhMucPhi: getDanhMucPhiChoDongBo(),
    hocSinh: getHocSinhChoDongBo(),
    hoaDon: getHoaDonChoDongBo(),
  }
}

export interface DongBoSelection {
  danhMucPhi: string[]
  hocSinh: string[]
  hoaDon: string[]
}

interface HoaDonFailure {
  soHoaDon: string
  missing: string[]
}

/** Hoá đơn được CHỌN đồng bộ mà Mã HS hoặc bất kỳ Mã phí nào của nó SAU ĐỢT NÀY vẫn chưa
 * daDongBo=true (không nằm trong lựa chọn Học sinh/Danh mục Phí của cùng đợt, và cũng chưa từng
 * đồng bộ trước đó) — Sở sẽ không nhận diện được mã đó nên không thể đồng bộ hoá đơn tham chiếu
 * nó. Đây là điều kiện DUY NHẤT khiến 1 lần đồng bộ "Thất bại" trong bản demo này. */
function checkHoaDonFailures(
  selectedHoaDonRows: HoaDonRow[],
  selectedHocSinhIds: Set<string>,
  selectedDanhMucPhiIds: Set<string>,
): HoaDonFailure[] {
  const failures: HoaDonFailure[] = []

  for (const hd of selectedHoaDonRows) {
    const missing: string[] = []

    const hs = getHocSinhByMa(hd.maHocSinh)
    const hsSeSyncXong = hs ? hs.daDongBo || selectedHocSinhIds.has(hocSinhId(hs)) : false
    if (!hsSeSyncXong) missing.push(`Mã HS ${hd.maHocSinh}`)

    const maPhiSet = new Set(getHoaDonKhoanPhiBySoHoaDon(hd.ky, hd.soHoaDon).map((line) => line.maPhi))
    for (const maPhi of maPhiSet) {
      const phi = getDanhMucPhiByMa(maPhi)
      const phiSeSyncXong = phi ? phi.daDongBo || selectedDanhMucPhiIds.has(danhMucPhiId(phi)) : false
      if (!phiSeSyncXong) missing.push(`Mã phí ${maPhi}`)
    }

    if (missing.length > 0) failures.push({ soHoaDon: hd.soHoaDon, missing })
  }

  return failures
}

export interface DongBoResult {
  entry: DongBoLichSuEntry
}

/** Thực thi 1 lần đồng bộ — kiểm tra ràng buộc Hoá đơn → Học sinh/Danh mục Phí trước:
 * - Không vi phạm: set daDongBo=true cho TOÀN BỘ mục đã chọn (cả 3 loại), ghi lịch sử Thành công.
 * - Có vi phạm: KHÔNG set gì cả (rollback toàn bộ đợt — coi như 1 lần gọi API thất bại, không có
 *   thành công 1 phần), ghi lịch sử Thất bại kèm lý do cụ thể. Mọi mục đã chọn giữ nguyên
 *   daDongBo=false, sẵn sàng cho lần đồng bộ thử lại sau khi người dùng sửa lựa chọn.
 * Đây là điểm sẽ gắn API thông báo dashportal thật sau này (phần C, chưa build) — chèn network
 * call vào ngay trước đoạn "if (trangThai === 'Thành công')" khi cần, giữ đúng logic rollback. */
export function performDongBo(pending: PendingData, selection: DongBoSelection, nguoiThucHien: string): DongBoResult {
  const selectedDanhMucPhi = pending.danhMucPhi.filter((r) => selection.danhMucPhi.includes(danhMucPhiId(r)))
  const selectedHocSinh = pending.hocSinh.filter((r) => selection.hocSinh.includes(hocSinhId(r)))
  const selectedHoaDon = pending.hoaDon.filter((r) => selection.hoaDon.includes(hoaDonId(r)))

  const selectedHocSinhIds = new Set(selection.hocSinh)
  const selectedDanhMucPhiIds = new Set(selection.danhMucPhi)

  const failures = checkHoaDonFailures(selectedHoaDon, selectedHocSinhIds, selectedDanhMucPhiIds)
  const trangThai: DongBoLichSuEntry['trangThai'] = failures.length > 0 ? 'Thất bại' : 'Thành công'

  const lyDoThatBai =
    failures.length > 0
      ? `${failures.length} hoá đơn tham chiếu Mã HS/Mã phí chưa được đồng bộ: ${failures
          .map((f) => `${f.soHoaDon} (${f.missing.join(', ')})`)
          .join('; ')}.`
      : null

  if (trangThai === 'Thành công') {
    markDanhMucPhiDaDongBo(selectedDanhMucPhi.map((r) => ({ nienKhoa: r.nienKhoa, maPhi: r.maPhi })))
    markHocSinhDaDongBo(selectedHocSinh.map((r) => ({ nienKhoa: r.nienKhoa, maHocSinh: r.maHocSinh })))
    markHoaDonDaDongBo(selectedHoaDon.map((r) => ({ ky: r.ky, soHoaDon: r.soHoaDon })))
  }

  const entry: DongBoLichSuEntry = {
    id: `dong-bo-${Date.now()}`,
    thoiDiem: new Date().toISOString(),
    nguoiThucHien,
    trangThai,
    lyDoThatBai,
    soLuongDaChon: {
      danhMucPhi: selectedDanhMucPhi.length,
      hocSinh: selectedHocSinh.length,
      hoaDon: selectedHoaDon.length,
    },
    chiTietMa: {
      danhMucPhi: selection.danhMucPhi,
      hocSinh: selection.hocSinh,
      hoaDon: selection.hoaDon,
    },
  }
  appendDongBoLichSu(entry)

  return { entry }
}

/** Tra cứu lại dữ liệu HIỆN TẠI cho đúng các id đã lưu trong 1 dòng lịch sử — dùng cho "Chi
 * tiết" xem lại. Đọc TOÀN BỘ bản ghi (cả daDongBo true/false) vì 1 dòng lịch sử có thể tham
 * chiếu bản ghi đã đổi trạng thái ở lần đồng bộ SAU đó. Vì daDongBo là field DUY NHẤT bị đổi khi
 * đồng bộ, các field còn lại của bản ghi (nếu vẫn còn tồn tại trong hệ thống) luôn khớp đúng nội
 * dung tại thời điểm đồng bộ đó. */
export function resolveChiTiet(chiTietMa: DongBoLichSuEntry['chiTietMa']): PendingData {
  const danhMucPhiAll = Object.values(getDanhMucPhiStore()).flat()
  const hocSinhAll = Object.values(getHocSinhStore()).flat()
  const hoaDonAll = Object.values(getHoaDonStore()).flat()

  return {
    danhMucPhi: danhMucPhiAll.filter((r) => chiTietMa.danhMucPhi.includes(danhMucPhiId(r))),
    hocSinh: hocSinhAll.filter((r) => chiTietMa.hocSinh.includes(hocSinhId(r))),
    hoaDon: hoaDonAll.filter((r) => chiTietMa.hoaDon.includes(hoaDonId(r))),
  }
}
