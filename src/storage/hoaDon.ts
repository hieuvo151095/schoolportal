import { buildHoaDonKhoanPhiSeed, buildHoaDonSeed } from '../mock-data/hoaDonSeed'
import type { HoaDonRow } from '../types/domain'
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

/** Thêm hoá đơn mới vào 1 kỳ — nối vào dữ liệu cũ, không xoá dữ liệu đã có
 * (uploadConfig.existingDataCheck đã chặn trùng soHoaDon với dữ liệu cũ từ trước, nên rows truyền
 * vào đây luôn là hoá đơn mới hoàn toàn). */
export function saveHoaDonByKy(ky: string, rows: HoaDonRow[]): void {
  const store = readStore()
  store[ky] = [...(store[ky] ?? []), ...rows]
  localStorage.setItem(STORAGE_KEYS.hoaDon, JSON.stringify(store))
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
