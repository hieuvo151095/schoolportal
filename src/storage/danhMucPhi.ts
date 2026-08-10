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

/** Sinh sẵn dữ liệu mẫu cho 1 niên khoá nếu chưa có dữ liệu — để Danh mục thu không trống khi
 * demo lần đầu. Danh mục thu giờ THUẦN XEM (không còn upload/thêm mới phía trường), nên đây là
 * kênh DUY NHẤT dữ liệu này được ghi vào hệ thống. Idempotent. */
export function ensureSeededDanhMucPhi(nienKhoa: string): void {
  const store = readStore()
  if (store[nienKhoa]?.length) return
  store[nienKhoa] = buildDanhMucPhiSeed(nienKhoa)
  localStorage.setItem(STORAGE_KEYS.danhMucPhi, JSON.stringify(store))
}
