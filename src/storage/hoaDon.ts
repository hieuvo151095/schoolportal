import { buildHoaDonKhoanPhiSeed, buildHoaDonSeed } from '../mock-data/hoaDonSeed'
import type { HoaDonRow } from '../types/domain'
import { computeTrangThaiHoaDon } from '../utils/hoaDon'
import { ensureSeededDanhMucPhi } from './danhMucPhi'
import { saveHoaDonKhoanPhiByKy } from './hoaDonKhoanPhi'
import { STORAGE_KEYS } from './keys'
import { getHoSoTruong } from './hoSoTruong'

type HoaDonStore = Record<string, HoaDonRow[]>

function readStore(): HoaDonStore {
  const raw = localStorage.getItem(STORAGE_KEYS.hoaDon)
  if (!raw) return {}
  try {
    return JSON.parse(raw) as HoaDonStore
  } catch {
    return {}
  }
}

export function getHoaDonStore(): HoaDonStore {
  return readStore()
}

export function getHoaDonByKy(ky: string): HoaDonRow[] {
  return readStore()[ky] ?? []
}

/** Toàn bộ hoá đơn (mọi kỳ) chưa qua module "Đồng bộ" — dùng ở module Đồng bộ. */
export function getHoaDonChoDongBo(): HoaDonRow[] {
  return Object.values(readStore()).flat().filter((row) => !row.daDongBo)
}

/** Set daDongBo=true cho đúng các hoá đơn được liệt kê (theo ky+soHoaDon) — dùng khi xác nhận
 * đồng bộ thành công ở module "Đồng bộ". Bỏ qua bản ghi không tìm thấy (đã bị xoá/đổi). */
export function markHoaDonDaDongBo(items: { ky: string; soHoaDon: string }[]): void {
  const store = readStore()
  for (const { ky, soHoaDon } of items) {
    const row = store[ky]?.find((r) => r.soHoaDon === soHoaDon)
    if (row) row.daDongBo = true
  }
  localStorage.setItem(STORAGE_KEYS.hoaDon, JSON.stringify(store))
}

/** Thêm/cập nhật hoá đơn vào 1 kỳ. soHoaDon MỚI (chưa có trong kỳ) thì thêm bình thường. soHoaDon
 * TRÙNG với hoá đơn đã lưu (uploadConfig.existingDataCheck chỉ cảnh báo, không chặn — trừ hoá đơn
 * cũ đã "Đã thanh toán" đủ, bị chặn từ bước validate nên không bao giờ tới đây) thì GHI ĐÈ ngay
 * tại chỗ bằng dữ liệu mới, daDongBo về false (Chưa báo cáo):
 * - Hoá đơn cũ "Thanh toán một phần" (III.1 — cộng dồn): giữ tạm Số tiền đã trả CŨ vào daTraCu,
 *   CHƯA cộng dồn ngay — chờ finalizeHoaDonMerge() sau khi báo cáo "Đã xử lý" mới cộng đúng.
 * - Hoá đơn cũ "Chưa thanh toán" (III.2 — ghi đè hoàn toàn): không có gì để cộng dồn, ghi đè xong
 *   là dữ liệu đã ở trạng thái cuối cùng luôn, không cần xử lý gì thêm ở finalizeHoaDonMerge(). */
export function saveHoaDonByKy(ky: string, rows: HoaDonRow[]): void {
  const store = readStore()
  const existingRows = store[ky] ?? []

  for (const newRow of rows) {
    const index = existingRows.findIndex((r) => r.soHoaDon === newRow.soHoaDon)
    if (index === -1) {
      existingRows.push(newRow)
      continue
    }
    const oldRow = existingRows[index]
    existingRows[index] =
      oldRow.trangThai === 'Thanh toán một phần'
        ? { ...newRow, daDongBo: false, daTraCu: oldRow.daTra }
        : { ...newRow, daDongBo: false }
  }

  store[ky] = existingRows
  localStorage.setItem(STORAGE_KEYS.hoaDon, JSON.stringify(store))
}

/** Hoàn tất cộng dồn Số tiền đã trả cho các hoá đơn đang chờ merge (daTraCu có giá trị, xem
 * saveHoaDonByKy case III.1) — gọi khi lần "Nộp báo cáo" tương ứng chuyển "Đã xử lý" (xem
 * resolveDongBoDangXuLy() ở storage/dongBoLichSu.ts), KHÔNG phải ngay lúc lưu. Bỏ qua hoá đơn
 * không có daTraCu (đã ghi đè hoàn toàn từ lúc lưu — case III.2, không có gì để cộng thêm). */
export function finalizeHoaDonMerge(items: { ky: string; soHoaDon: string }[]): void {
  const store = readStore()
  let changed = false
  for (const { ky, soHoaDon } of items) {
    const row = store[ky]?.find((r) => r.soHoaDon === soHoaDon)
    if (!row || row.daTraCu === undefined) continue
    row.daTra += row.daTraCu
    row.trangThai = computeTrangThaiHoaDon(row.soTien, row.daTra)
    delete row.daTraCu
    changed = true
  }
  if (changed) localStorage.setItem(STORAGE_KEYS.hoaDon, JSON.stringify(store))
}

/** Sinh sẵn dữ liệu mẫu cho 1 kỳ nếu chưa có dữ liệu — để Tab "Danh sách" không trống khi demo
 * lần đầu. Đảm bảo Danh mục thu đã có sẵn trước (khoá ngoại maPhi). Idempotent. */
export function ensureSeededHoaDon(ky: string): void {
  const store = readStore()
  if (store[ky]?.length) return
  const hoSo = getHoSoTruong()
  if (hoSo) {
    ensureSeededDanhMucPhi(hoSo.nienKhoa)
  }
  store[ky] = buildHoaDonSeed(ky)
  localStorage.setItem(STORAGE_KEYS.hoaDon, JSON.stringify(store))
  saveHoaDonKhoanPhiByKy(ky, buildHoaDonKhoanPhiSeed())
}
