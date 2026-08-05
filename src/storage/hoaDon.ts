import { buildHoaDonKhoanPhiSeed, buildHoaDonSeed } from '../mock-data/hoaDonSeed'
import type { HoaDonRow } from '../types/domain'
import { ensureSeededDanhMucPhi } from './danhMucPhi'
import { saveHoaDonKhoanPhiByKy } from './hoaDonKhoanPhi'
import { STORAGE_KEYS } from './keys'
import { ensureSeededHocSinh } from './hocSinh'
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

/** Thêm hoá đơn mới vào 1 kỳ — nối vào dữ liệu cũ, không xoá dữ liệu đã có
 * (uploadConfig.existingDataCheck đã chặn trùng soHoaDon với dữ liệu cũ từ trước, nên rows truyền
 * vào đây luôn là hoá đơn mới hoàn toàn). */
export function saveHoaDonByKy(ky: string, rows: HoaDonRow[]): void {
  const store = readStore()
  store[ky] = [...(store[ky] ?? []), ...rows]
  localStorage.setItem(STORAGE_KEYS.hoaDon, JSON.stringify(store))
}

/** Sinh sẵn dữ liệu mẫu cho 1 kỳ nếu chưa có dữ liệu — để Tab "Danh sách" không trống khi demo
 * lần đầu. Đảm bảo Học sinh và Danh mục Phí đã có sẵn trước (khoá ngoại maHocSinh/maPhi).
 * Idempotent. */
export function ensureSeededHoaDon(ky: string): void {
  const store = readStore()
  if (store[ky]?.length) return
  const hoSo = getHoSoTruong()
  if (hoSo) {
    ensureSeededHocSinh(hoSo.nienKhoa)
    ensureSeededDanhMucPhi(hoSo.nienKhoa)
  }
  store[ky] = buildHoaDonSeed(ky)
  localStorage.setItem(STORAGE_KEYS.hoaDon, JSON.stringify(store))
  saveHoaDonKhoanPhiByKy(ky, buildHoaDonKhoanPhiSeed())
}
