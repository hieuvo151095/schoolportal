import { buildDanhMucPhiSeed } from '../mock-data/danhMucPhiSeed'
import type { KhoanPhiRow } from '../types/domain'
import { STORAGE_KEYS } from './keys'

type DanhMucPhiStore = Record<string, KhoanPhiRow[]>

function readStore(): DanhMucPhiStore {
  const raw = localStorage.getItem(STORAGE_KEYS.danhMucPhi)
  if (!raw) return {}
  try {
    return JSON.parse(raw) as DanhMucPhiStore
  } catch {
    return {}
  }
}

export function getDanhMucPhiStore(): DanhMucPhiStore {
  return readStore()
}

export function getDanhMucPhiByNienKhoa(nienKhoa: string): KhoanPhiRow[] {
  return readStore()[nienKhoa] ?? []
}

/** Thêm dữ liệu mới vào danh mục phí của 1 niên khoá — nối vào dữ liệu cũ, không xoá dữ liệu đã
 * có (uploadConfig.existingDataCheck đã chặn trùng maPhi với dữ liệu cũ từ trước, nên rows truyền
 * vào đây luôn là bản ghi mới hoàn toàn). */
export function saveDanhMucPhiByNienKhoa(nienKhoa: string, rows: KhoanPhiRow[]): void {
  const store = readStore()
  store[nienKhoa] = [...(store[nienKhoa] ?? []), ...rows]
  localStorage.setItem(STORAGE_KEYS.danhMucPhi, JSON.stringify(store))
}

/** Sinh sẵn dữ liệu mẫu cho 1 niên khoá nếu chưa có dữ liệu — để Tab "Danh sách" không trống
 * khi demo lần đầu. Idempotent. */
export function ensureSeededDanhMucPhi(nienKhoa: string): void {
  const store = readStore()
  if (store[nienKhoa]?.length) return
  store[nienKhoa] = buildDanhMucPhiSeed(nienKhoa)
  localStorage.setItem(STORAGE_KEYS.danhMucPhi, JSON.stringify(store))
}
