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

/** Toàn bộ khoản phí (mọi niên khoá) chưa qua module "Đồng bộ" — dùng ở module Đồng bộ. */
export function getDanhMucPhiChoDongBo(): KhoanPhiRow[] {
  return Object.values(readStore()).flat().filter((row) => !row.daDongBo)
}

/** Tìm 1 khoản phí theo Mã Phí, không phân biệt niên khoá — dùng để kiểm tra daDongBo của Mã
 * Phí mà 1 hoá đơn tham chiếu (xem dongBoLogic.ts). */
export function getDanhMucPhiByMa(maPhi: string): KhoanPhiRow | undefined {
  return Object.values(readStore()).flat().find((row) => row.maPhi === maPhi)
}

/** Set daDongBo=true cho đúng các khoản phí được liệt kê (theo nienKhoa+maPhi) — dùng khi xác
 * nhận đồng bộ thành công ở module "Đồng bộ". Bỏ qua bản ghi không tìm thấy (đã bị xoá/đổi). */
export function markDanhMucPhiDaDongBo(items: { nienKhoa: string; maPhi: string }[]): void {
  const store = readStore()
  for (const { nienKhoa, maPhi } of items) {
    const row = store[nienKhoa]?.find((r) => r.maPhi === maPhi)
    if (row) row.daDongBo = true
  }
  localStorage.setItem(STORAGE_KEYS.danhMucPhi, JSON.stringify(store))
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
