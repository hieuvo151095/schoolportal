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

/** Ghi đè toàn bộ danh mục phí của 1 niên khoá — mỗi lần đồng bộ thay thế hoàn toàn dữ liệu cũ. */
export function saveDanhMucPhiByNienKhoa(nienKhoa: string, rows: KhoanPhiRow[]): void {
  const store = readStore()
  store[nienKhoa] = rows
  localStorage.setItem(STORAGE_KEYS.danhMucPhi, JSON.stringify(store))
}
